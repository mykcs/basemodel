import { z } from 'zod';
import { assertPublicationSafe, evidenceSnapshotSchema, researchMetricCatalog, type EvidencePoint } from './researchEvidenceSchema';

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
const count = z.number().int().positive().nullable();
export const comparisonIdentityKeys = ['model', 'method', 'harness', 'decoding', 'budget', 'checkpointLineage', 'taskSchedule', 'seedSchedule'] as const;
const identityKey = z.enum(comparisonIdentityKeys);
const role = evidenceSnapshotSchema.shape.evaluationRole;
export const comparisonArmSchema = z.strictObject({
  id, metricId: evidenceSnapshotSchema.shape.metric.shape.id,
  unit: evidenceSnapshotSchema.shape.metric.shape.unit, evaluationRole: role,
  populationId: z.string().min(1).nullable(), taskCount: count, trialCount: count,
  independentUnitCount: count,
  identity: z.record(identityKey, z.string().min(1).nullable()),
});
export const comparisonContractSchema = z.strictObject({
  id, arms: z.tuple([id, id]),
  metricId: evidenceSnapshotSchema.shape.metric.shape.id,
  unit: evidenceSnapshotSchema.shape.metric.shape.unit, evaluationRole: role,
  design: z.enum(['same-panel', 'historical-continuation', 'temporal-windows']),
  heldFixed: z.partialRecord(identityKey, z.string().min(1)),
  treatmentVariables: z.array(identityKey),
  estimand: z.string().min(1), pairingKeys: z.array(id),
  independentUnit: z.enum(['task', 'task-within-round', 'round']),
  exclusionRule: z.literal('missing-stays-null-no-success-filter'),
  aggregationRule: z.enum(['reported-mean', 'equal-round-mean', 'paired-unit-mean']),
  analysisRole: z.enum(['exploratory', 'predeclared']),
  preregistrationRef: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\/.+$/).nullable(),
  recipeRef: z.string().min(1), rawPairsAvailable: z.boolean(),
}).superRefine((value, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (value.arms[0] === value.arms[1]) fail('A contrast needs distinct arm identities');
  if (new Set(value.treatmentVariables).size !== value.treatmentVariables.length) fail('Repeated treatment variable');
  if (new Set(value.pairingKeys).size !== value.pairingKeys.length) fail('Repeated pairing key');
  if (value.treatmentVariables.some((key) => value.heldFixed[key] !== undefined)) fail('An identity cannot be held fixed and varied');
  if (value.analysisRole === 'predeclared' && !value.preregistrationRef) fail('Predeclared analysis requires immutable preregistration');
});
export type ComparisonArm = z.infer<typeof comparisonArmSchema>;
export type ComparisonContract = z.infer<typeof comparisonContractSchema>;
export type ComparisonAssessment = ReturnType<typeof assessComparison>;

/** Eligibility is not an efficacy verdict and never confers causal identification. */
export function assessComparison(contractInput: unknown, armInputs: readonly unknown[]) {
  const contract = comparisonContractSchema.parse(contractInput);
  const arms = armInputs.map((value) => comparisonArmSchema.parse(value));
  assertPublicationSafe({ contract, arms });
  const blocked: string[] = [], limits: string[] = [];
  if (contract.unit !== researchMetricCatalog[contract.metricId].unit) blocked.push('invalid-metric-unit-contract');
  if (arms.length !== 2 || new Set(arms.map((arm) => arm.id)).size !== 2 || contract.arms.some((arm) => !arms.some((item) => item.id === arm))) {
    throw new Error('Comparison arm membership mismatch');
  }
  const left = arms.find((arm) => arm.id === contract.arms[0])!;
  const right = arms.find((arm) => arm.id === contract.arms[1])!;
  for (const arm of arms) {
    if (arm.evaluationRole !== contract.evaluationRole) blocked.push(`evaluation-role:${arm.id}`);
    if (arm.metricId !== contract.metricId || arm.unit !== contract.unit) blocked.push(`metric-unit:${arm.id}`);
  }
  if (left.populationId !== null && right.populationId !== null && left.populationId !== right.populationId) blocked.push('different-task-populations');
  if (left.taskCount !== null && right.taskCount !== null && left.taskCount !== right.taskCount) blocked.push('different-task-counts');
  if (left.populationId === null || right.populationId === null) limits.push('task-population-identity-unknown');
  if (arms.some((arm) => arm.taskCount === null)) limits.push('unique-task-count-unknown');
  if (arms.some((arm) => arm.trialCount === null)) limits.push('trial-denominator-unknown');
  for (const key of comparisonIdentityKeys) {
    if (contract.treatmentVariables.includes(key)) {
      if (left.identity[key] === null || right.identity[key] === null) limits.push(`treatment-identity-unknown:${key}`);
      continue;
    }
    const expected = contract.heldFixed[key];
    if (expected === undefined) {
      limits.push(`identity-not-controlled:${key}`);
      if (left.identity[key] !== null && right.identity[key] !== null && left.identity[key] !== right.identity[key]) blocked.push(`uncontrolled-difference:${key}`);
    } else {
      for (const arm of arms) {
        if (arm.identity[key] === null) limits.push(`fixed-identity-unknown:${key}:${arm.id}`);
        else if (arm.identity[key] !== expected) blocked.push(`fixed-identity-mismatch:${key}:${arm.id}`);
      }
    }
  }
  if (contract.design !== 'same-panel') limits.push('historical-or-temporal-descriptive-contrast');
  if (!contract.rawPairsAvailable) limits.push('paired-observations-unavailable');
  if (contract.pairingKeys.length === 0) limits.push('pairing-keys-unavailable');
  if (left.independentUnitCount !== null && right.independentUnitCount !== null && left.independentUnitCount !== right.independentUnitCount) blocked.push('independent-unit-counts-differ');
  if (arms.some((arm) => arm.independentUnitCount !== null && arm.trialCount !== null && arm.independentUnitCount > arm.trialCount)) blocked.push('unit-count-exceeds-trials');
  if (arms.some((arm) => arm.independentUnitCount === null)) limits.push('independent-unit-count-unknown');
  if (contract.rawPairsAvailable && arms[0]!.trialCount !== arms[1]!.trialCount) blocked.push('paired-trial-counts-differ');
  return {
    disposition: blocked.length ? 'not-comparable' as const : limits.length ? 'descriptive-only' as const : 'eligible-paired' as const,
    reasons: [...new Set(blocked)], limitations: [...new Set(limits)], contract,
    sampleSizes: arms.map((arm) => ({ arm: arm.id, trials: arm.trialCount, independentUnits: arm.independentUnitCount })),
    causalClaimAuthorized: false as const,
  };
}

/** Aggregate-only receipts never become bootstrap samples. No website-owned resampling recipe. */
export function requireRecomputablePairs(assessment: ComparisonAssessment, rows: readonly { pairId: string; unitId: string; left: number; right: number }[]) {
  if (assessment.disposition !== 'eligible-paired') throw new Error('Raw paired inference is not eligible; retain source-reported uncertainty only');
  if (!rows.length) throw new Error('Paired observations are empty');
  const pairs = new Set<string>();
  const units = new Set<string>();
  for (const row of rows) {
    if (!row.pairId || !row.unitId || !Number.isFinite(row.left) || !Number.isFinite(row.right)) throw new Error('Invalid paired observation');
    if (pairs.has(row.pairId)) throw new Error('Duplicate paired observation');
    pairs.add(row.pairId); units.add(row.unitId);
  }
  // More than one rollout per unit requires the upstream cluster-aware recipe.
  if (units.size !== rows.length) throw new Error('Repeated sample units require the original clustered analysis recipe');
  if (assessment.sampleSizes.some((size) => size.trials !== rows.length || size.independentUnits !== units.size)) throw new Error('Paired rows disagree with declared sample counts');
  return { pairCount: pairs.size, unitCount: units.size };
}

export function reportedInterval(interval: readonly number[], sourcePointer: string) {
  if (interval.length !== 2 || !interval.every(Number.isFinite) || interval[0]! > interval[1]!) throw new Error('Invalid reported interval');
  if (!sourcePointer) throw new Error('Reported interval requires source provenance');
  return {
    low: interval[0]!, high: interval[1]!, sourcePointer,
    origin: 'source-reported-not-recomputed' as const,
    containsZero: interval[0]! <= 0 && interval[1]! >= 0,
    equivalence: 'not-established' as const, nonInferiority: 'not-established' as const,
    limitation: 'Original pair identities, resampling implementation and multiplicity were not reconstructed here.',
  };
}
export function finiteDifference(right: number | null, left: number | null): number | null {
  if (right === null || left === null) return null;
  if (!Number.isFinite(right) || !Number.isFinite(left)) throw new Error('Difference requires finite measurements');
  const difference = right - left;
  if (!Number.isFinite(difference)) throw new Error('Difference overflow');
  return difference;
}

export type RoundWindow = { id: string; first: number; last: number };
export function summarizeRoundWindows(points: readonly EvidencePoint[], series: string, windows: readonly RoundWindow[], scope: { first: number; last: number }) {
  if (!Number.isInteger(scope.first) || !Number.isInteger(scope.last) || scope.first < 0 || scope.last < scope.first || scope.last - scope.first > 10000) throw new Error('Invalid round scope');
  if (!windows.length) throw new Error('All declared windows must be supplied');
  const sorted = [...windows].sort((a, b) => a.first - b.first);
  const ids = new Set<string>();
  let next = scope.first;
  for (const window of sorted) {
    if (!window.id || ids.has(window.id) || !Number.isInteger(window.first) || !Number.isInteger(window.last) || window.first !== next || window.last < window.first) throw new Error('Windows must partition the entire declared scope without gaps or overlaps');
    ids.add(window.id); next = window.last + 1;
  }
  if (next !== scope.last + 1) throw new Error('Do not select only the best window');
  const rows = new Map<number, number | null>();
  for (const point of points.filter((point) => point.series === series)) {
    if (point.position === null || !Number.isInteger(point.position) || point.position < scope.first || point.position > scope.last) throw new Error('A point is outside its declared analysis scope');
    if (rows.has(point.position)) throw new Error('Duplicate round observation');
    if (point.value !== null && !Number.isFinite(point.value)) throw new Error('Non-finite round observation');
    rows.set(point.position, point.value);
  }
  return sorted.map((window) => {
    const observed: { round: number; value: number }[] = [];
    const missingRounds: number[] = [];
    for (let round = window.first; round <= window.last; round++) {
      const value = rows.get(round);
      if (value === null || value === undefined) missingRounds.push(round); else observed.push({ round, value });
    }
    const expected = window.last - window.first + 1;
    const sum = observed.reduce((acc, row) => acc + row.value, 0);
    const observedMean = observed.length ? sum / observed.length : null;
    const meanX = observed.reduce((acc, row) => acc + row.round, 0) / (observed.length || 1);
    const denominator = observed.reduce((acc, row) => acc + (row.round - meanX) ** 2, 0);
    const observedSlope = observedMean !== null && denominator > 0 ? observed.reduce((acc, row) => acc + (row.round - meanX) * (row.value - observedMean), 0) / denominator : null;
    return {
      ...window, expectedRounds: expected, observedRounds: observed.length, missingRounds,
      mean: missingRounds.length ? null : observedMean, sum: missingRounds.length ? null : sum,
      slopePerRound: missingRounds.length ? null : observedSlope,
      observedOnlyMean: observedMean,
      status: missingRounds.length ? 'partial' as const : 'complete' as const,
    };
  });
}

export function requireReportedAgreement(computed: number | null, reported: number, decimals = 10) {
  if (computed === null || !Number.isFinite(computed) || !Number.isFinite(reported) || !Number.isInteger(decimals) || decimals < 0 || decimals > 12) throw new Error('Invalid reproduction comparison');
  const tolerance = decimals === 0 ? 0 : 10 ** -decimals;
  if (Math.abs(computed - reported) > tolerance) throw new Error('Recomputed value disagrees with the published source');
  return { computed, reported, absoluteError: Math.abs(computed - reported), tolerance };
}
