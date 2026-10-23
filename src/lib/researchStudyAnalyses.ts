import { z } from 'zod';
import { assertPublicationSafe, validateEvidenceRegistry } from './researchEvidenceSchema';
import {
  assessComparison, comparisonIdentityKeys, finiteDifference, reportedInterval,
  requireReportedAgreement, summarizeRoundWindows,
  type ComparisonArm, type ComparisonContract,
} from './researchComparisons';
import type { NormalizedResearchHistory } from './researchHistory';

const finite = z.number();
const ratio = z.number().min(0).max(1);
const count = z.number().int().nonnegative();
const interval = z.tuple([finite, finite]);
const taskState = z.object({ mean_task_score: ratio, exact_success_count: count, positive_reward_count: count });
const rankState = z.object({ mean_task_score: ratio, exact_success_count: count, final_adapter_bytes: z.number().int().positive() });
const postAdvisorSchema = z.object({
  schema: z.literal('basemodel.post-advisor-ab-final-results.20260928'), status: z.literal('PASS'),
  A: z.object({
    train: z.object({ epochs: z.literal(3), optimizer_steps: z.literal(486), train_loss_first: finite.nonnegative(), train_loss_last: finite.nonnegative(), sft_val_loss: z.object({ step162: finite.nonnegative(), step324: finite.nonnegative(), step486: finite.nonnegative() }) }),
    primary_validation: z.object({
      panel_size: z.literal(64), panel_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      states: z.object({ initial: taskState, epoch1: taskState.extend({ step: z.literal(162) }), epoch2: taskState.extend({ step: z.literal(324) }), epoch3: taskState.extend({ step: z.literal(486) }) }),
      paired_vs_initial: z.object({ epoch1: z.object({ mean_task_score_diff: finite, bootstrap95: interval }), epoch2: z.object({ mean_task_score_diff: finite, bootstrap95: interval }), epoch3: z.object({ mean_task_score_diff: finite, bootstrap95: interval }) }),
    }),
  }),
  B: z.object({ paired_attempts: z.literal(1024), rounds: z.array(count), rank128: rankState, rank32: rankState,
    rank32_minus_rank128: z.object({ mean_task_score: finite, mean_task_score_bootstrap95: interval, exact_success_rate: finite, exact_success_rate_bootstrap95: interval }),
    adapter_size_ratio_rank32_to_rank128: ratio,
  }),
  boundaries: z.object({ new_teacher_calls: z.literal(0), final_panel_access: z.literal(0), historical_rank128_rerun: z.literal(false), B_R152_rollout_replay: z.literal(false) }),
});
export const BETA_WINDOWS = [
  { id: 'R96-119', first: 96, last: 119 },
  { id: 'R120-139', first: 120, last: 139 },
  { id: 'R140-159', first: 140, last: 159 },
  { id: 'R160-179', first: 160, last: 179 },
  { id: 'R180-199', first: 180, last: 199 },
] as const;
const betaAggregateSchema = z.object({
  schema: z.literal('basemodel.delta-beta-r200-public-analysis.v1'),
  identity: z.object({ added_rounds: z.literal(40), added_rollouts: z.literal(5120), final_panel_access_count: z.literal(0) }),
  phases: z.record(z.string(), z.object({ mean_score: finite, score_slope_per_round: finite, mean_loss: finite, loss_slope_per_round: finite, exact_total: count })),
  extension: z.object({ mean_score_R160_R199: finite, mean_loss_R160_R199: finite }),
});
const unknownIdentity = (): ComparisonArm['identity'] => Object.fromEntries(comparisonIdentityKeys.map((key) => [key, null])) as ComparisonArm['identity'];
function arm(id: string, evaluationRole: ComparisonArm['evaluationRole'], populationId: string | null, taskCount: number | null, trialCount: number | null, identity: Partial<ComparisonArm['identity']> = {}): ComparisonArm {
  return { id, metricId: 'taskScore', unit: 'ratio', evaluationRole, populationId, taskCount, trialCount, independentUnitCount: null, identity: { ...unknownIdentity(), ...identity } };
}
function contract(id: string, arms: [string, string], evaluationRole: ComparisonContract['evaluationRole'], design: ComparisonContract['design'], treatmentVariables: ComparisonContract['treatmentVariables'], estimand: string): ComparisonContract {
  return {
    id, arms, metricId: 'taskScore', unit: 'ratio', evaluationRole, design,
    heldFixed: {}, treatmentVariables, estimand, pairingKeys: [],
    independentUnit: evaluationRole === 'training' ? 'round' : 'task',
    exclusionRule: 'missing-stays-null-no-success-filter', aggregationRule: 'reported-mean',
    analysisRole: 'exploratory', preregistrationRef: null,
    recipeRef: 'src/lib/researchStudyAnalyses.ts@v1', rawPairsAvailable: false,
  };
}
function effectAgreement(computed: number | null, reported: number) {
  return requireReportedAgreement(computed, reported, 12);
}

/** Reconcile existing reported aggregates; does not re-run an evaluation or regenerate its CI. */
export function analyzePostAdvisor(raw: unknown, sourcePointer: string) {
  assertPublicationSafe(raw);
  const input = postAdvisorSchema.parse(raw);
  if (!sourcePointer) throw new Error('Missing post-advisor source identity');
  assertPublicationSafe(sourcePointer);
  if (JSON.stringify(input.B.rounds) !== JSON.stringify(Array.from({ length: 8 }, (_, index) => index + 152))) throw new Error('Rank continuation scope is not R152-R159');
  const validation = input.A.primary_validation;
  for (const state of Object.values(validation.states)) {
    if (state.exact_success_count > state.positive_reward_count || state.positive_reward_count > validation.panel_size) throw new Error('Validation success/positive counts exceed their denominators');
  }
  if (input.B.rank32.exact_success_count > input.B.paired_attempts || input.B.rank128.exact_success_count > input.B.paired_attempts) throw new Error('Rank successes exceed rollout denominator');
  const epochs = (['epoch1', 'epoch2', 'epoch3'] as const).map((epoch, index) => {
    const state = validation.states[epoch];
    const delta = finiteDifference(state.mean_task_score, validation.states.initial.mean_task_score)!;
    const testContract = contract(`stage1-${epoch}`, ['initial', epoch], 'validation', 'same-panel', ['checkpointLineage', 'budget'], 'Reported mean Task Score difference versus initial on the frozen 64-task primary-validation panel');
    const arms = [arm('initial', 'validation', validation.panel_sha256, 64, 64, { checkpointLineage: 'initial', budget: '0-sft-steps' }), arm(epoch, 'validation', validation.panel_sha256, 64, 64, { checkpointLineage: epoch, budget: `${state.step}-sft-steps` })];
    return {
      epoch: index + 1, optimizerStep: state.step,
      validationTaskScore: state.mean_task_score, exactCount: state.exact_success_count, positiveRewardCount: state.positive_reward_count,
      sftValidationLoss: [input.A.train.sft_val_loss.step162, input.A.train.sft_val_loss.step324, input.A.train.sft_val_loss.step486][index]!,
      taskScoreDelta: delta, deltaScorePoints: delta * 100,
      agreement: effectAgreement(delta, validation.paired_vs_initial[epoch].mean_task_score_diff),
      uncertainty: reportedInterval(validation.paired_vs_initial[epoch].bootstrap95, `${sourcePointer}#/A/primary_validation/paired_vs_initial/${epoch}/bootstrap95`),
      comparison: assessComparison(testContract, arms),
    };
  });
  const rank = input.B;
  const scoreDelta = rank.rank32.mean_task_score - rank.rank128.mean_task_score;
  const exactDelta = (rank.rank32.exact_success_count - rank.rank128.exact_success_count) / rank.paired_attempts;
  const payloadRatio = rank.rank32.final_adapter_bytes / rank.rank128.final_adapter_bytes;
  const rankContract = contract('rank32-rank128-continuation', ['rank128', 'rank32'], 'development', 'historical-continuation', ['method', 'checkpointLineage'], 'Reported paired continuation mean Task Score difference over R152-R159; rank32 minus rank128');
  rankContract.independentUnit = 'task-within-round';
  const rankAssessment = assessComparison(rankContract, [arm('rank128', 'development', null, null, 1024, { method: 'bounded-rank128' }), arm('rank32', 'development', null, null, 1024, { method: 'bounded-rank32' })]);
  const initial = validation.states.initial;
  return {
    learningSignal: {
      id: 'stage1-learning-signal', analysisRole: 'exploratory' as const,
      sourcePointer, inputKind: 'reported-aggregate' as const,
      publication: 'pending-pr805-integration' as const,
      scope: { evaluationRole: 'validation', taskCount: 64, trialsPerState: 64, independentUnitCount: null, panelDigest: validation.panel_sha256 },
      recipe: { version: 1, states: ['initial', 'epoch1', 'epoch2', 'epoch3'], exclusions: [], selection: 'all-three-reported-epochs', randomResampling: 'not-performed' },
      training: { firstLoss: input.A.train.train_loss_first, lastLoss: input.A.train.train_loss_last, relativeReduction: input.A.train.train_loss_first > 0 ? 1 - input.A.train.train_loss_last / input.A.train.train_loss_first : null, reportedLossPrecision: 'As reported in source; do not infer additional measurement precision.' },
      initial: { taskScore: initial.mean_task_score, exactCount: initial.exact_success_count, positiveRewardCount: initial.positive_reward_count }, epochs,
      diagnostics: { trainingLossFell: input.A.train.train_loss_last < input.A.train.train_loss_first, anyEpochTaskScoreAboveInitial: epochs.some((epoch) => epoch.taskScoreDelta > 0), laterEpochPositiveRewards: epochs.slice(1).map((epoch) => epoch.positiveRewardCount) },
      unsupported: ['full-SEED-Stage2-failure', 'optimization-loss-proves-task-capability', 'epoch1-equivalence', 'unreported-multiple-comparison-correction'],
      limitations: ['Only a fixed validation-panel aggregate is available.', 'No task-level pairs or exact runtime identities were re-read; original intervals are preserved, not revalidated.', 'SFT validation loss and WebShop task score are separate outcomes, not values on one common scale.'],
    },
    rankCapacity: {
      id: 'rank32-capacity', analysisRole: 'exploratory' as const, sourcePointer,
      inputKind: 'reported-aggregate' as const, publication: 'pending-pr805-integration' as const,
      scope: { evaluationRole: 'development', rounds: rank.rounds, pairedAttempts: rank.paired_attempts, independentUnitCount: null },
      recipe: { version: 1, selection: 'entire-reported-continuation', exclusions: [], randomResampling: 'not-performed', nonInferiorityMargin: null },
      comparison: rankAssessment,
      rank128: rank.rank128, rank32: rank.rank32,
      difference: { taskScore: scoreDelta, scorePoints: scoreDelta * 100, exactSuccessCount: rank.rank32.exact_success_count - rank.rank128.exact_success_count, exactSuccessRate: exactDelta, exactPercentagePoints: exactDelta * 100, adapterBytesSaved: rank.rank128.final_adapter_bytes - rank.rank32.final_adapter_bytes, adapterSizeRatio: payloadRatio, adapterReductionFraction: 1 - payloadRatio },
      agreement: { taskScore: effectAgreement(scoreDelta, rank.rank32_minus_rank128.mean_task_score), exactSuccess: effectAgreement(exactDelta, rank.rank32_minus_rank128.exact_success_rate), payloadRatio: effectAgreement(payloadRatio, rank.adapter_size_ratio_rank32_to_rank128) },
      uncertainty: { taskScore: reportedInterval(rank.rank32_minus_rank128.mean_task_score_bootstrap95, `${sourcePointer}#/B/rank32_minus_rank128/mean_task_score_bootstrap95`), exactSuccess: reportedInterval(rank.rank32_minus_rank128.exact_success_rate_bootstrap95, `${sourcePointer}#/B/rank32_minus_rank128/exact_success_rate_bootstrap95`) },
      diagnostics: { taskScoreLower: scoreDelta < 0, exactSuccessHigher: exactDelta > 0, smallerPayload: payloadRatio < 1, metricDirectionsDiffer: Math.sign(scoreDelta) !== Math.sign(exactDelta) },
      unsupported: ['lossless-or-non-inferior', 'rank8-is-sufficient', '1024-independent-samples', 'same-frozen-final-comparison', 'one-metric-global-winner'],
    },
  };
}

/** The five windows match the published analysis; every row participates, including the 24-round first window. */
export function analyzeBetaHistory(history: NormalizedResearchHistory, aggregateRaw: unknown, aggregatePointer: string) {
  assertPublicationSafe(aggregateRaw);
  const aggregate = betaAggregateSchema.parse(aggregateRaw);
  validateEvidenceRegistry(history.snapshots, history.contracts);
  if (history.lineageId !== 'beta-r200' || !aggregatePointer) throw new Error('Wrong analysis lineage or absent source pointer');
  assertPublicationSafe(aggregatePointer);
  if (history.snapshots.some((snapshot) => snapshot.source.sha256 !== history.source.sha256 || snapshot.source.commit !== history.source.commit || snapshot.source.path !== history.source.path)) throw new Error('Metrics cannot be mixed across source snapshots');
  const metric = (id: string) => {
    const found = history.snapshots.find((item) => item.metric.id === id);
    if (!found || found.evaluationRole !== 'training' || found.axis !== 'round') throw new Error('Expected a training-round snapshot');
    return found;
  };
  const score = metric('taskScore'), loss = metric('trainingLoss'), exact = metric('exactSuccessCount');
  const scoreWindows = summarizeRoundWindows(score.points, 'bounded-beta', BETA_WINDOWS, { first: 96, last: 199 });
  const lossWindows = summarizeRoundWindows(loss.points, 'bounded-beta', BETA_WINDOWS, { first: 96, last: 199 });
  const exactWindows = summarizeRoundWindows(exact.points, 'bounded-beta', BETA_WINDOWS, { first: 96, last: 199 });
  const windows = scoreWindows.map((window, index) => {
    const published = aggregate.phases[window.id];
    if (!published) throw new Error('Missing published phase');
    const lossWindow = lossWindows[index]!, exactWindow = exactWindows[index]!;
    return {
      id: window.id, firstRound: window.first, lastRound: window.last, roundCount: window.expectedRounds,
      meanTaskScore: window.mean, scorePoints: window.mean === null ? null : window.mean * 100,
      meanLoss: lossWindow.mean, exactSuccessCount: exactWindow.sum,
      scoreSlopePerRound: window.slopePerRound, lossSlopePerRound: lossWindow.slopePerRound,
      missing: { taskScore: window.missingRounds, loss: lossWindow.missingRounds, exactSuccess: exactWindow.missingRounds },
      agreement: {
        score: requireReportedAgreement(window.mean, published.mean_score), loss: requireReportedAgreement(lossWindow.mean, published.mean_loss), exact: requireReportedAgreement(exactWindow.sum, published.exact_total, 0),
        scoreSlope: requireReportedAgreement(window.slopePerRound, published.score_slope_per_round), lossSlope: requireReportedAgreement(lossWindow.slopePerRound, published.loss_slope_per_round),
      },
    };
  });
  const adjacentChanges = windows.slice(1).map((window, index) => ({
    from: windows[index]!.id, to: window.id,
    taskScore: finiteDifference(window.meanTaskScore, windows[index]!.meanTaskScore),
    loss: finiteDifference(window.meanLoss, windows[index]!.meanLoss),
  }));
  const extension = windows.slice(3);
  const extensionScore = extension.reduce((sum, window) => sum + window.meanTaskScore! * window.roundCount, 0) / 40;
  const extensionLoss = extension.reduce((sum, window) => sum + window.meanLoss! * window.roundCount, 0) / 40;
  const temporalContract = contract('beta-late-training', ['pre-extension', 'extension'], 'training', 'temporal-windows', ['checkpointLineage', 'budget', 'taskSchedule', 'seedSchedule'], 'Descriptive change across all fixed published training windows; no frozen-final or causal stopping contrast');
  return {
    id: 'beta-late-training', analysisRole: 'exploratory' as const,
    publication: 'existing-site-projection' as const, inputKind: 'per-round-scalar' as const,
    source: score.source, aggregatePointer,
    recipe: { version: 1, windows: BETA_WINDOWS, selection: 'all-published-windows', aggregation: 'equal-round-mean-and-ordinary-least-squares-slope', exclusions: [], randomResampling: 'not-performed' },
    scope: { firstRound: 96, lastRound: 199, roundCount: 104, independentUnitCount: null, finalPanelAccess: 0 },
    comparison: assessComparison(temporalContract, [arm('pre-extension', 'training', null, null, null), arm('extension', 'training', null, null, null)]),
    windows, adjacentChanges,
    extension: { meanTaskScore: extensionScore, meanLoss: extensionLoss, agreement: { score: requireReportedAgreement(extensionScore, aggregate.extension.mean_score_R160_R199), loss: requireReportedAgreement(extensionLoss, aggregate.extension.mean_loss_R160_R199) } },
    diagnostics: { lossFellInEveryAdjacentWindow: adjacentChanges.every((change) => change.loss !== null && change.loss < 0), scoreFellDespiteLowerLoss: adjacentChanges.filter((change) => change.loss !== null && change.loss < 0 && change.taskScore !== null && change.taskScore < 0).map((change) => `${change.from}:${change.to}`), postExtensionMeansAboveR140R159: extension.every((window) => window.meanTaskScore! > windows[2]!.meanTaskScore!) },
    uncertainty: { origin: 'not-computed', reason: 'Round-level aggregates do not provide independent paired tasks or a preregistered stopping comparison.' },
    unsupported: ['new-frozen-final-score', 'optimal-120-160-200-stopping-round', 'beta-causes-the-recovery', 'effective-rank-proves-minimum-state-capacity'],
  };
}
