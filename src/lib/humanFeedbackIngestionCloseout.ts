import {
  HUMAN_FEEDBACK_EVENTS,
  HUMAN_PREFERENCE_TRAJECTORIES,
  HUMAN_VISUAL_REFERENCE_SET,
  failureFamilySeverity,
  hardFailureFamilies,
} from '../data/humanPreferenceLearningHistory';
import { HUMAN_FEEDBACK_PRECEDENTS } from '../data/humanFeedbackPrecedents';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../data/humanPreferenceModel';
import {
  HUMAN_FEEDBACK_INGESTION_CLOSEOUTS,
  type FeedbackLedgerDisposition,
  type HumanFeedbackIngestionCloseoutRecord,
} from '../data/humanFeedbackIngestionCloseouts';
import {
  buildHumanPreferenceBrief,
  candidateReceiptTemplate,
  verifyCandidateReceipt,
} from './humanPreferenceBrief';
import { goldPairIdsForContract, preferenceIdsForContract } from './humanPreferenceLearning';
import {
  validateHumanPreferenceJudgeReceipt,
  type HumanPreferenceJudgeReceipt,
} from './humanPreferenceJudge';

export interface HumanFeedbackIngestionValidation {
  failures: string[];
  dispositionCounts: Record<FeedbackLedgerDisposition, number>;
  hardFamilies: string[];
  repeatedFamilies: string[];
  retrievedEventIds: string[];
  retrievedGoldPairIds: string[];
  retrievedSignals: Record<string, boolean>;
  evaluationProofFailures: string[];
  evaluationProofPassFailures: string[];
}

const allDispositions: FeedbackLedgerDisposition[] = [
  'ingest',
  'merge-duplicate',
  'superseded',
  'task-fact-not-preference',
  'page-specific-only',
  'ambiguous-hold',
  'out-of-scope',
];

function evidenceHead(record: HumanFeedbackIngestionCloseoutRecord): string {
  return record.sourceWindow.finalAcceptedHead ?? record.sourceWindow.finalOwnerVisibleHead ?? '';
}

export function buildHumanPreferenceBriefForCloseout(record: HumanFeedbackIngestionCloseoutRecord) {
  const context = record.preferenceBrief;
  return buildHumanPreferenceBrief({
    query: record.futureTaskQuery,
    contractId: context?.contractId ?? (context ? undefined : 'study-briefing'),
    scope: context?.scope,
  });
}

function signalStatus(record: HumanFeedbackIngestionCloseoutRecord) {
  const brief = buildHumanPreferenceBriefForCloseout(record);
  const events = new Set(brief.events.map((event) => event.id));
  const preferences = new Set(brief.learnedPreferences.map(({ preference }) => preference.id));
  const pairs = new Set(brief.goldPairs.map(({ pair }) => pair.id));
  const visuals = new Set(brief.visualReferences.map((reference) => reference.id));
  const trajectory = HUMAN_PREFERENCE_TRAJECTORIES.find((item) => item.id === 'TRAJECTORY-BRIEFING-VISUAL-20260908');
  const workflowTrajectory = HUMAN_PREFERENCE_TRAJECTORIES.find((item) => item.id === 'TRAJECTORY-ITERATIVE-PREVIEW-WORKFLOW-20260909');
  const chartTrajectory = HUMAN_PREFERENCE_TRAJECTORIES.find((item) => item.id === 'TRAJECTORY-BRIEFING-EXPERIMENT-CHART-GRAMMAR-20260909');
  const finalEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED');
  const fastPreviewEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT');
  const final604Event = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-604-ACCEPTED');
  const final604Visual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-604-ACCEPTED-SILVER');
  const sitewideAppleEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-SITEWIDE-APPLE-SURFACE-REPEAT');
  const sitewideAppleVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-SITEWIDE-APPLE-SURFACE-REJECTED');
  const pr619AcceptedEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260911-BRIEFING-619-ACCEPTED');
  const pr619AcceptedVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-619-ACCEPTED-SILVER');
  const priorNogdrCurveVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE');
  const candidateHead = record.sourceWindow.finalOwnerVisibleHead;
  const candidateScope = record.preferenceBrief?.scope;
  // Historical closeout receipts bind the visual that was current for that exact source head,
  // even after a later accepted successor removes it from today's active Preference Brief.
  const candidateVisual = candidateHead
    ? HUMAN_VISUAL_REFERENCE_SET.find((reference) =>
        reference.tier === 'current-candidate' &&
        reference.gitSha === candidateHead &&
        (!candidateScope || reference.scopes.includes(candidateScope)),
      )
    : undefined;

  const statuses: Record<string, boolean> = {
    'intermediate-better-is-not-canonical':
      events.has('EVENT-20260908-SOFT-SLIDE-DIRECTION') &&
      HUMAN_FEEDBACK_EVENTS.some((event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION' && event.verdict === 'better') &&
      !trajectory?.canonicalVariantId &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
    'meaningless-english-eyebrow':
      brief.hardFailureFamilies.includes('meaningless-english-eyebrow') && pairs.has('PAIR-027-ENGLISH-EYEBROW'),
    'numeric-shock-heading':
      events.has('EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT') && pairs.has('PAIR-082-PARAMETER-HEADING'),
    'phone-vs-desktop-scope-split':
      preferences.has('PREF-BRIEFING-DEVICE-SCOPE') && pairs.has('PAIR-082-DEVICE-SCOPE') &&
      (events.has('EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT') || events.has('EVENT-20260909-MOBILE-WHOLE-SLIDE-FIT-REPEAT')),
    'technical-depth-without-meta-performance':
      events.has('EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META') &&
      preferences.has('PREF-TECHNICAL-DEPTH-WITHOUT-META') && pairs.has('PAIR-082-TECHNICAL-WITHOUT-META'),
    'engineering-rigor-progressive-disclosure':
      events.has('EVENT-20260909-MAINLINE-RIGOR-TAX') && pairs.has('PAIR-082-ENGINEERING-DEPTH'),
    'scientific-decision-chain':
      preferences.has('PREF-RESEARCH-JUDGMENT') &&
      pairs.has('PAIR-082-CHRONOLOGICAL-SCIENCE-STORY') &&
      (events.has('EVENT-20260909-CHRONOLOGY-SCIENCE-STORY') || events.has('EVENT-20260909-DIAGNOSTIC-BEHAVIOR-EVIDENCE')),
    'internal-detail-primary-attention':
      brief.hardFailureFamilies.includes('internal-detail-promoted-to-primary-attention') &&
      pairs.has('PAIR-082-PARAMETER-HEADING') && pairs.has('PAIR-082-ENGINEERING-DEPTH'),
    'concrete-accepted-is-not-canonical':
      finalEvent?.verdict === 'accepted' && !trajectory?.canonicalVariantId &&
      visuals.has('VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER') &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
    'diagnostic-observation-to-decision':
      preferences.has('PREF-DIAGNOSTIC-CLOSURE') && pairs.has('PAIR-084-DIAGNOSTIC-CLOSE-LOOP') &&
      events.has('EVENT-20260909-DIAGNOSTIC-BEHAVIOR-EVIDENCE') &&
      events.has('EVENT-20260909-DIAGNOSTIC-MISSING-RESOLUTION') &&
      failureFamilySeverity('incomplete-scientific-decision-loop') === 'hard',
    'training-dynamics-evidence-layers':
      preferences.has('PREF-DIAGNOSTIC-CLOSURE') && events.has('EVENT-20260909-TRAINING-DYNAMICS-EVIDENCE') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('training loss') && boundary.includes('final eval')),
    'mobile-whole-slide-fit-repeat':
      preferences.has('PREF-BRIEFING-DEVICE-SCOPE') && events.has('EVENT-20260909-MOBILE-WHOLE-SLIDE-FIT-REPEAT') &&
      pairs.has('PAIR-082-DEVICE-SCOPE') && failureFamilySeverity('mobile-fixed-canvas-overflow') === 'repeated',
    'fast-review-preview-canonical-workflow':
      preferences.has('PREF-FAST-REVIEW-PREVIEW') && pairs.has('PAIR-085-FAST-REVIEW-PREVIEW') &&
      events.has('EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT') && fastPreviewEvent?.verdict === 'canonical' &&
      workflowTrajectory?.canonicalVariantId === 'fast-prebuilt-review-preview',
    'current-candidate-is-not-accepted':
      record.schema === 'human-feedback-ingestion-closeout.v2' && record.sourceWindow.finalVerdict === 'current-candidate' &&
      !!candidateVisual && !!candidateHead &&
      !HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === candidateHead && ['accepted', 'canonical'].includes(event.verdict)),
    'latest-merged-briefing-is-rejected-not-accepted':
      record.schema === 'human-feedback-ingestion-closeout.v2' && record.sourceWindow.finalVerdict === 'rejected' &&
      !!candidateHead &&
      events.has('EVENT-20260909-BRIEFING-TASKVECTOR-DETAIL-LAYER-REJECTED') &&
      events.has('EVENT-20260909-BRIEFING-SCIENCE-CHECKLIST-REJECTED') &&
      visuals.has('VISUAL-BRIEFING-605-MERGED-REJECTED') &&
      !HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === candidateHead && ['accepted', 'canonical'].includes(event.verdict)),
    'taskvector-progressive-disclosure-latest':
      events.has('EVENT-20260909-BRIEFING-TASKVECTOR-DETAIL-LAYER-REJECTED') &&
      preferences.has('PREF-TECHNICAL-DEPTH-WITHOUT-META') &&
      preferences.has('PREF-PROGRESSIVE-DISCLOSURE') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('TaskVector') && boundary.includes('norm') && boundary.includes('cosine')),
    'science-story-not-checklist':
      events.has('EVENT-20260909-BRIEFING-SCIENCE-CHECKLIST-REJECTED') &&
      preferences.has('PREF-RESEARCH-JUDGMENT') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('checklist') && boundary.includes('因果')),
    'briefing-self-contained-method-context':
      preferences.has('PREF-BRIEFING-SELF-CONTAINED-METHOD') &&
      pairs.has('PAIR-089-BRIEFING-METHOD-CONTEXT') &&
      events.has('EVENT-20260909-BRIEFING-METHOD-CONTEXT'),
    'concrete-mechanism-wording':
      preferences.has('PREF-CONCRETE-MECHANISM-WORDING') &&
      pairs.has('PAIR-087-CONCRETE-MECHANISM') &&
      events.has('EVENT-20260909-GDR-ABSTRACT-MECHANISM-PHRASING'),
    'diagnostic-referent-spelled-out':
      preferences.has('PREF-CONCRETE-MECHANISM-WORDING') &&
      pairs.has('PAIR-087-DIAGNOSTIC-REFERENT') &&
      events.has('EVENT-20260910-BRIEFING-UNNAMED-DIAGNOSTIC-REFERENT'),
    'live-snapshot-final-boundary':
      preferences.has('PREF-SCIENTIFIC-BOUNDARY') &&
      candidateVisual?.id === 'VISUAL-BRIEFING-NOGDR-LIVE-CURRENT-CANDIDATE' &&
      candidateVisual.gitSha === record.sourceWindow.finalOwnerVisibleHead &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('训练过程信号') && boundary.includes('最终评测')),
    'consistent-experiment-visual-grammar':
      preferences.has('PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR') &&
      pairs.has('PAIR-088-EXPERIMENT-CHART-GRAMMAR') &&
      events.has('EVENT-20260909-UNIFIED-EXPERIMENT-CHART-GRAMMAR'),
    'experiment-chart-grammar-repeated':
      preferences.has('PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR') &&
      pairs.has('PAIR-088-EXPERIMENT-CHART-GRAMMAR') &&
      events.has('EVENT-20260909-UNIFIED-EXPERIMENT-CHART-GRAMMAR') &&
      events.has('EVENT-20260910-NOGDR-CHART-GRAMMAR-REPEAT') &&
      failureFamilySeverity('inconsistent-experiment-chart-grammar') === 'repeated' &&
      failureFamilySeverity('cross-experiment-legend-relearning') === 'repeated' &&
      chartTrajectory?.variantIds.includes('briefing-nogdr-score-loss-curves-b1f86769') === true,
    'review-preview-target-verified':
      preferences.has('PREF-FAST-REVIEW-PREVIEW') &&
      events.has('EVENT-20260910-REVIEW-PREVIEW-MISSING-CLAIMED-CURVES') &&
      workflowTrajectory?.comparisons.some((comparison) => comparison.failureMechanisms.includes('review-preview-not-visually-verified')) === true &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('205') && boundary.includes('目标 slide')),
    'latest-nogdr-curves-current-candidate':
      candidateVisual?.id === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE' &&
      candidateVisual.tier === 'current-candidate' &&
      HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-LIVE-CURRENT-CANDIDATE')?.supersededByReferenceId === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE',
    'diagnostic-motivation-before-intervention':
      preferences.has('PREF-DIAGNOSTIC-CLOSURE') &&
      pairs.has('PAIR-084-DIAGNOSTIC-CLOSE-LOOP') &&
      events.has('EVENT-20260909-DIAGNOSTIC-MOTIVATION-MISSING') &&
      failureFamilySeverity('incomplete-scientific-decision-loop') === 'hard',
    'phone-internal-canvas-scaled-as-unit':
      preferences.has('PREF-BRIEFING-DEVICE-SCOPE') &&
      pairs.has('PAIR-082-DEVICE-SCOPE') &&
      events.has('EVENT-20260909-PHONE-INTERNAL-CANVAS-SQUEEZED') &&
      visuals.has('VISUAL-BRIEFING-604-ACCEPTED-SILVER'),
    'briefing-604-concrete-accepted-not-canonical':
      final604Event?.verdict === 'accepted' &&
      final604Event.evidence?.gitSha === '59f46044e15aa92d95f50f0332a9798adf8d385b' &&
      final604Visual?.tier === 'silver' &&
      final604Visual.gitSha === '59f46044e15aa92d95f50f0332a9798adf8d385b' &&
      !HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === final604Event.evidence?.gitSha && event.verdict === 'canonical') &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
    'event-first-research-heading':
      preferences.has('PREF-EVENT-FIRST-RESEARCH-HEADINGS') && pairs.has('PAIR-090-GATE-HEADING') &&
      events.has('EVENT-20260909-BRIEFING-STORYLINE-SHORTHAND-REPEAT'),
    'low-score-log-first-causal-sequence':
      preferences.has('PREF-RESEARCH-JUDGMENT') && pairs.has('PAIR-090-DIAGNOSTIC-ENTRY') &&
      events.has('EVENT-20260909-BRIEFING-STORYLINE-DIAGNOSTIC-ENTRY'),
    'compressed-shorthand-heading-hard':
      brief.hardFailureFamilies.includes('compressed-shorthand-heading') && pairs.has('PAIR-090-GATE-HEADING'),
    'unnecessary-project-jargon-translated':
      preferences.has('PREF-INLINE-TERMINOLOGY') && pairs.has('PAIR-090-COMPOSED-STATE') &&
      events.has('EVENT-20260909-BRIEFING-STORYLINE-ENGLISH-GLUE'),
    'science-vs-engineering-summary-split':
      preferences.has('PREF-RESEARCH-JUDGMENT') && preferences.has('PREF-PROGRESSIVE-DISCLOSURE') &&
      events.has('EVENT-20260909-BRIEFING-STORYLINE-SUMMARY-DIRECTION'),
    'recovery-action-first':
      preferences.has('PREF-RECOVERY-ACTION-FIRST') &&
      events.has('EVENT-20260909-FUHUO-RECOVERY-TECHNICAL-FIRST') &&
      events.has('EVENT-20260909-FUHUO-RECOVERY-ACTION-FIRST-DIRECTION'),
    'recovery-progressive-depth':
      preferences.has('PREF-RECOVERY-ACTION-FIRST') && preferences.has('PREF-PROGRESSIVE-DISCLOSURE') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('完整工程 runbook') && boundary.includes('后层')),
    'recovery-internal-detail-hard-family':
      brief.hardFailureFamilies.includes('internal-detail-promoted-to-primary-attention') &&
      events.has('EVENT-20260909-FUHUO-RECOVERY-TECHNICAL-FIRST'),
    'recovery-current-candidate-not-promoted':
      record.preferenceBrief?.scope === 'recovery' && !!candidateVisual &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('recovery') && reference.tier === 'golden') &&
      !HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === candidateHead && ['accepted', 'canonical'].includes(event.verdict)),
    'recovery-copy-action-not-universal':
      preferences.has('PREF-RECOVERY-ACTION-FIRST') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('复制 prompt / 命令') && boundary.includes('不是通用模板')),
    'reference-surface-imitation-hard':
      events.has('EVENT-20260909-SITEWIDE-APPLE-SURFACE-REPEAT') &&
      sitewideAppleEvent?.verdict === 'rejected' &&
      sitewideAppleEvent.repeatSignal === 'explicit' &&
      failureFamilySeverity('reference-surface-imitation') === 'hard' &&
      brief.hardFailureFamilies.includes('reference-surface-imitation'),
    'apple-cognition-not-visual-skin':
      events.has('EVENT-20260909-SITEWIDE-APPLE-SURFACE-REPEAT') &&
      preferences.has('PREF-FIRST-SCREEN-ATTENTION') &&
      brief.antiOvergeneralization.some((boundary) => boundary.includes('参考品牌') && boundary.includes('留白') && boundary.includes('机械复制')),
    'sitewide-reference-visual-rejected-only':
      visuals.has('VISUAL-SITEWIDE-APPLE-SURFACE-REJECTED') &&
      sitewideAppleVisual?.tier === 'rejected' &&
      sitewideAppleVisual.gitSha === '84eca7135db376f5ffa539a9a7c78b1f64c86ca7' &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) =>
        reference.gitSha === sitewideAppleVisual.gitSha && ['silver', 'golden', 'current-candidate'].includes(reference.tier),
      ) &&
      !HUMAN_FEEDBACK_EVENTS.some((event) =>
        event.evidence?.gitSha === sitewideAppleVisual.gitSha && ['accepted', 'canonical'].includes(event.verdict),
      ),
    'pr619-concrete-accepted-not-canonical':
      pr619AcceptedEvent?.verdict === 'accepted' &&
      pr619AcceptedEvent.evidence?.gitSha === '6fcef6aacdb61fe904bbf9f69389e44f9c718ed6' &&
      pr619AcceptedVisual?.tier === 'silver' &&
      pr619AcceptedVisual.gitSha === pr619AcceptedEvent.evidence?.gitSha &&
      visuals.has('VISUAL-BRIEFING-619-ACCEPTED-SILVER') &&
      !HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === pr619AcceptedEvent.evidence?.gitSha && event.verdict === 'canonical') &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
    'pr619-latest-accepted-briefing-visual':
      visuals.has('VISUAL-BRIEFING-619-ACCEPTED-SILVER') &&
      pr619AcceptedVisual?.pullRequest === 619 &&
      pr619AcceptedVisual?.tier === 'silver' &&
      record.sourceWindow.finalVerdict === 'accepted' &&
      record.sourceWindow.finalAcceptedHead === pr619AcceptedVisual.gitSha,
    'prior-nogdr-candidate-superseded-by-pr619':
      priorNogdrCurveVisual?.tier === 'current-candidate' &&
      priorNogdrCurveVisual.supersededByReferenceId === 'VISUAL-BRIEFING-619-ACCEPTED-SILVER' &&
      !visuals.has('VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE') &&
      visuals.has('VISUAL-BRIEFING-619-ACCEPTED-SILVER'),
  };
  return { brief, statuses };
}

function buildHardFamilyCandidateReceipt(record: HumanFeedbackIngestionCloseoutRecord, hardFamily: string) {
  const reviewSurface = record.preferenceBrief?.contractId ?? (record.preferenceBrief?.scope ? `scope:${record.preferenceBrief.scope}` : 'study-briefing');
  const receipt = candidateReceiptTemplate(reviewSurface, 'future preference recurrence check');
  receipt.exactGitSha = evidenceHead(record);
  receipt.variants = receipt.variants.slice(0, 2).map((variant, index) => ({
    ...variant,
    id: index === 0 ? 'A' : 'B',
    hypothesis: index === 0 ? 'known failure recurrence' : 'learned preference applied',
    attentionCenter: index === 0 ? 'author-internal framing' : 'scientific question',
    informationDensity: 'bounded',
    visualLanguage: 'semantic HTML',
    screenshotRef: `/tmp/future-candidate-${index === 0 ? 'a' : 'b'}.png`,
    predictedFailureFamilies: index === 0 ? [hardFamily] : [],
  }));
  receipt.selectedVariantId = 'B';
  receipt.comparisons = [{ winnerId: 'B', loserId: 'A', reason: 'removes the known failure mechanism', evidence: 'candidate B applies the learned preference' }];
  receipt.hardFamiliesChecked = hardFailureFamilies().filter((family) => family !== hardFamily);
  return receipt;
}

function buildGoldPairJudgeReceipt(record: HumanFeedbackIngestionCloseoutRecord, pairId: `PAIR-${string}`): HumanPreferenceJudgeReceipt {
  return {
    schemaVersion: 1,
    contractId: 'study-briefing',
    exactHead: evidenceHead(record),
    candidateUrl: 'https://example.test/future-review',
    reviewer: { kind: 'independent-agent', label: 'closeout-recurrence-proof' },
    blindCompletedBeforePreferenceReveal: true,
    blind: {
      about: 'A research diagnostic briefing.',
      firstAttention: 'The diagnostic result.',
      mostImportant: 'A hypothesis was tested and should change the next step.',
      machineLike: 'No unrelated presenter framing is needed.',
      terminologyFriction: 'Terms are explained in place.',
      competingCenters: 'One main scientific decision.',
      hiddenBoundary: 'Training-process evidence remains separate from final evaluation.',
      suggestedChange: 'Close the diagnostic loop from observation to next action.',
      readingDesireScore: 4,
      readingDesireReason: 'The next research question is visible.',
    },
    preferenceJudgments: preferenceIdsForContract('study-briefing').map((preferenceId) => ({ preferenceId, verdict: 'pass', evidence: 'Synthetic recurrence proof supplies a judgment for every required preference.' })),
    pairJudgments: goldPairIdsForContract('study-briefing').map((requiredPairId) => ({ pairId: requiredPairId, verdict: requiredPairId === pairId ? 'rejected-like' : 'accepted-like', evidence: requiredPairId === pairId ? 'Candidate reports a diagnostic result without the learned observation-to-next-action closure.' : 'No recurrence injected for this pair.' })),
    scientificBoundary: { verdict: 'pass', evidence: 'Synthetic proof keeps claim-changing boundaries visible.' },
    unresolvedConcerns: [],
    finalVerdict: 'PASS',
    rationale: 'Deliberately inconsistent PASS used to prove the preference judge rejects a known recurrence.',
  };
}

function validateEvaluationProof(record: HumanFeedbackIngestionCloseoutRecord, failures: string[]) {
  if (record.evaluationProof.hardFamily) {
    const hardFamily = record.evaluationProof.hardFamily;
    const receipt = buildHardFamilyCandidateReceipt(record, hardFamily);
    const negative = verifyCandidateReceipt(receipt);
    const expected = `hard failure family not checked: ${hardFamily}`;
    if (!negative.includes(expected)) failures.push(`${record.id}: evaluation-side proof did not reject omitted hard family ${hardFamily}`);
    receipt.hardFamiliesChecked = hardFailureFamilies();
    const positive = verifyCandidateReceipt(receipt);
    if (positive.length) failures.push(`${record.id}: evaluation receipt still fails after restoring all hard-family checks: ${positive.join('; ')}`);
    return { evaluationProofFailures: negative, evaluationProofPassFailures: positive };
  }

  if (record.evaluationProof.pairId) {
    const pairId = record.evaluationProof.pairId;
    const family = record.evaluationProof.failureFamily;
    if (family) {
      const severity = failureFamilySeverity(family);
      if (!['repeated', 'hard'].includes(severity)) failures.push(`${record.id}: evaluation failure family ${family} must be repeated/hard, got ${severity}`);
    }
    if (!goldPairIdsForContract('study-briefing').includes(pairId as never)) failures.push(`${record.id}: evaluation pair ${pairId} is not required by study-briefing`);
    const receipt = buildGoldPairJudgeReceipt(record, pairId);
    const negative = validateHumanPreferenceJudgeReceipt(receipt);
    if (!negative.includes('PASS receipt cannot be rejected-like against a Gold Pair')) failures.push(`${record.id}: preference judge did not reject recurrence for ${pairId}`);
    const target = receipt.pairJudgments.find((item) => item.pairId === pairId);
    if (target) target.verdict = 'accepted-like';
    receipt.rationale = 'Repaired synthetic receipt applies the learned diagnostic Gold Pair.';
    const positive = validateHumanPreferenceJudgeReceipt(receipt);
    if (positive.length) failures.push(`${record.id}: repaired preference-judge receipt still fails: ${positive.join('; ')}`);
    return { evaluationProofFailures: negative, evaluationProofPassFailures: positive };
  }

  failures.push(`${record.id}: evaluationProof must define hardFamily or a deterministic pairId guard`);
  return { evaluationProofFailures: ['missing evaluation proof configuration'], evaluationProofPassFailures: [] };
}

export interface HumanFeedbackIngestionLineageCoverage {
  ingestionIds: `INGESTION-${string}`[];
  totalSignals: number;
  dispositionCounts: Record<FeedbackLedgerDisposition, number>;
  ledgerIds: string[];
  failures: string[];
}

export function collectHumanFeedbackIngestionLineage(record: HumanFeedbackIngestionCloseoutRecord): HumanFeedbackIngestionCloseoutRecord[] {
  const byId = new Map(HUMAN_FEEDBACK_INGESTION_CLOSEOUTS.map((item) => [item.id, item]));
  const ordered: HumanFeedbackIngestionCloseoutRecord[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (item: HumanFeedbackIngestionCloseoutRecord) => {
    if (visited.has(item.id)) return;
    if (visiting.has(item.id)) throw new Error(`ingestion lineage cycle at ${item.id}`);
    visiting.add(item.id);
    for (const predecessorId of item.predecessorIngestionIds ?? []) {
      const predecessor = byId.get(predecessorId);
      if (!predecessor) throw new Error(`unknown predecessor ingestion ${predecessorId}`);
      visit(predecessor);
    }
    visiting.delete(item.id);
    visited.add(item.id);
    ordered.push(item);
  };

  visit(record);
  return ordered;
}

export function aggregateHumanFeedbackIngestionCoverage(record: HumanFeedbackIngestionCloseoutRecord): HumanFeedbackIngestionLineageCoverage {
  const failures: string[] = [];
  let lineage: HumanFeedbackIngestionCloseoutRecord[] = [];
  try {
    lineage = collectHumanFeedbackIngestionLineage(record);
  } catch (error) {
    return {
      ingestionIds: [],
      totalSignals: 0,
      dispositionCounts: Object.fromEntries(allDispositions.map((item) => [item, 0])) as Record<FeedbackLedgerDisposition, number>,
      ledgerIds: [],
      failures: [error instanceof Error ? error.message : String(error)],
    };
  }
  const counts = Object.fromEntries(allDispositions.map((item) => [item, 0])) as Record<FeedbackLedgerDisposition, number>;
  const ledgerIds: string[] = [];
  const seenLedgerIds = new Set<string>();
  for (const item of lineage) {
    for (const ledgerItem of item.ledger) {
      counts[ledgerItem.disposition] += 1;
      if (seenLedgerIds.has(ledgerItem.id)) failures.push(`duplicate ledger id across ingestion lineage: ${ledgerItem.id}`);
      seenLedgerIds.add(ledgerItem.id);
      ledgerIds.push(ledgerItem.id);
      if (ledgerItem.disposition === 'ambiguous-hold') failures.push(`unresolved ambiguous-hold in ingestion lineage: ${ledgerItem.id}`);
    }
  }
  return {
    ingestionIds: lineage.map((item) => item.id),
    totalSignals: ledgerIds.length,
    dispositionCounts: counts,
    ledgerIds,
    failures,
  };
}

export function validateHumanFeedbackIngestionCloseout(record: HumanFeedbackIngestionCloseoutRecord): HumanFeedbackIngestionValidation {
  const failures: string[] = [];
  const counts = Object.fromEntries(allDispositions.map((item) => [item, 0])) as Record<FeedbackLedgerDisposition, number>;
  const ledgerIds = new Set<string>();
  const eventIds = new Set(HUMAN_FEEDBACK_EVENTS.map((event) => event.id));
  const caseIds = new Set(HUMAN_FEEDBACK_PRECEDENTS.map((item) => item.id));
  const preferenceIds = new Set(HUMAN_PREFERENCE_MODEL.map((item) => item.id));
  const pairIds = new Set(HUMAN_FEEDBACK_GOLD_PAIRS.map((item) => item.id));
  const visualIds = new Set(HUMAN_VISUAL_REFERENCE_SET.map((item) => item.id));
  const ingestionIds = new Set(HUMAN_FEEDBACK_INGESTION_CLOSEOUTS.map((item) => item.id));

  for (const reference of HUMAN_VISUAL_REFERENCE_SET) {
    if (!reference.supersededByReferenceId) continue;
    if (reference.supersededByReferenceId === reference.id) failures.push(`${record.id}: visual reference ${reference.id} cannot supersede itself`);
    if (!HUMAN_VISUAL_REFERENCE_SET.some((candidate) => candidate.id === reference.supersededByReferenceId)) {
      failures.push(`${record.id}: visual reference ${reference.id} points to unknown successor ${reference.supersededByReferenceId}`);
    }
  }

  if (!['human-feedback-ingestion-closeout.v1', 'human-feedback-ingestion-closeout.v2'].includes(record.schema)) failures.push(`${record.id}: wrong schema`);
  if (record.schema === 'human-feedback-ingestion-closeout.v1') {
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.finalAcceptedHead ?? '')) failures.push(`${record.id}: invalid finalAcceptedHead`);
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.mergedMainCommit ?? '')) failures.push(`${record.id}: invalid mergedMainCommit`);
  } else {
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.finalOwnerVisibleHead ?? '')) failures.push(`${record.id}: invalid finalOwnerVisibleHead`);
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.mainAtCloseout ?? '')) failures.push(`${record.id}: invalid mainAtCloseout`);
    if (!['accepted', 'current-candidate', 'rejected'].includes(record.sourceWindow.finalVerdict ?? '')) failures.push(`${record.id}: v2 finalVerdict must be accepted/current-candidate/rejected`);
    for (const predecessor of record.predecessorIngestionIds ?? []) if (!ingestionIds.has(predecessor)) failures.push(`${record.id}: unknown predecessor ingestion ${predecessor}`);
  }
  if (!Number.isInteger(record.candidateFeedbackSignals) || record.candidateFeedbackSignals < 1) failures.push(`${record.id}: candidateFeedbackSignals must be a positive integer`);
  if (record.ledger.length !== record.candidateFeedbackSignals) failures.push(`${record.id}: candidateFeedbackSignals=${record.candidateFeedbackSignals} but ledger has ${record.ledger.length}`);
  if (!record.futureTaskQuery.trim()) failures.push(`${record.id}: futureTaskQuery is empty`);
  const normalizedFutureQuery = record.futureTaskQuery.replace(/\s+/g, '').toLowerCase();
  for (const item of record.ledger) {
    const normalizedOwnerSignal = item.ownerSignal.replace(/\s+/g, '').toLowerCase();
    if (normalizedOwnerSignal.length >= 18 && normalizedFutureQuery.includes(normalizedOwnerSignal)) failures.push(`${record.id}: futureTaskQuery copies owner signal verbatim: ${item.id}`);
  }
  if (!record.automationGap.trim()) failures.push(`${record.id}: automationGap must be explicit`);
  if (record.sourceWindow.sourceRepository !== undefined && !/^[^/\s]+\/[^/\s]+$/.test(record.sourceWindow.sourceRepository)) {
    failures.push(`${record.id}: sourceRepository must be owner/repo when provided`);
  }
  if (record.sourceWindow.pullRequest !== undefined && (!Number.isInteger(record.sourceWindow.pullRequest) || record.sourceWindow.pullRequest < 1)) {
    failures.push(`${record.id}: pullRequest must be a positive integer when provided`);
  }

  for (const item of record.ledger) {
    counts[item.disposition] += 1;
    if (ledgerIds.has(item.id)) failures.push(`${record.id}: duplicate ledger id ${item.id}`);
    ledgerIds.add(item.id);
    if (!item.ownerSignal.trim()) failures.push(`${item.id}: missing ownerSignal`);
    if (!item.rationale.trim()) failures.push(`${item.id}: missing rationale`);
    for (const eventId of item.eventIds ?? []) if (!eventIds.has(eventId)) failures.push(`${item.id}: unknown event ${eventId}`);
    for (const caseId of item.caseIds ?? []) if (!caseIds.has(caseId as never)) failures.push(`${item.id}: unknown case ${caseId}`);
    for (const preferenceId of item.preferenceIds ?? []) if (!preferenceIds.has(preferenceId as never)) failures.push(`${item.id}: unknown preference ${preferenceId}`);
    for (const pairId of item.pairIds ?? []) if (!pairIds.has(pairId as never)) failures.push(`${item.id}: unknown pair ${pairId}`);
    for (const visualId of item.visualReferenceIds ?? []) if (!visualIds.has(visualId as never)) failures.push(`${item.id}: unknown visual reference ${visualId}`);
    const structuredLinks = [item.eventIds, item.caseIds, item.preferenceIds, item.pairIds, item.visualReferenceIds].some((items) => items?.length);
    if (item.disposition === 'ingest' && !structuredLinks) failures.push(`${item.id}: ingest must link structured evidence`);
    if (item.disposition === 'merge-duplicate' && !structuredLinks) failures.push(`${item.id}: merge-duplicate must link existing evidence`);
    if (item.disposition === 'superseded' && !item.supersededBy) failures.push(`${item.id}: superseded item needs supersededBy`);
  }
  for (const item of record.ledger) {
    if (item.supersededBy && !ledgerIds.has(item.supersededBy)) failures.push(`${item.id}: unknown superseding ledger item ${item.supersededBy}`);
    if (item.disposition !== 'superseded' || !item.supersededBy) continue;
    const successor = record.ledger.find((candidate) => candidate.id === item.supersededBy);
    const oldEventIds = new Set(item.eventIds ?? []);
    const successorEvents = HUMAN_FEEDBACK_EVENTS.filter((event) => successor?.eventIds?.includes(event.id));
    const linked = successorEvents.some((event) => (event.supersedesEventIds ?? []).some((eventId) => oldEventIds.has(eventId)));
    if (oldEventIds.size && !linked) failures.push(`${item.id}: structured supersession is not preserved by successor event ${item.supersededBy}`);
  }
  if (counts['ambiguous-hold'] !== 0) failures.push(`${record.id}: unresolved ambiguous-hold entries remain`);

  const finalEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED');
  const finalVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER');
  if (record.schema === 'human-feedback-ingestion-closeout.v1') {
    if (!finalEvent || finalEvent.verdict !== 'accepted') failures.push(`${record.id}: final concrete briefing must be accepted`);
    if (HUMAN_FEEDBACK_EVENTS.some((event) => event.variantId === finalEvent?.variantId && event.verdict === 'canonical')) failures.push(`${record.id}: final concrete acceptance was incorrectly promoted to canonical`);
    if (!finalVisual || finalVisual.tier !== 'silver') failures.push(`${record.id}: accepted briefing visual must remain Silver without template approval`);
  } else if (record.sourceWindow.finalVerdict === 'current-candidate') {
    const candidateHead = record.sourceWindow.finalOwnerVisibleHead;
    const candidateScope = record.preferenceBrief?.scope;
    const candidateVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) =>
      reference.tier === 'current-candidate' &&
      reference.gitSha === candidateHead &&
      (!candidateScope || reference.scopes.includes(candidateScope)),
    );
    if (!candidateVisual) failures.push(`${record.id}: v2 current candidate visual is missing, bound to wrong head, or outside the requested scope`);
    if (HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === candidateHead && ['accepted', 'canonical'].includes(event.verdict))) failures.push(`${record.id}: current candidate was incorrectly promoted to accepted/canonical`);
  } else if (record.sourceWindow.finalVerdict === 'rejected') {
    const rejectedHead = record.sourceWindow.finalOwnerVisibleHead;
    const rejectedScope = record.preferenceBrief?.scope;
    const rejectedEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.evidence?.gitSha === rejectedHead && event.verdict === 'rejected');
    const rejectedVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) =>
      reference.tier === 'rejected' &&
      reference.gitSha === rejectedHead &&
      (!rejectedScope || reference.scopes.includes(rejectedScope)),
    );
    if (!rejectedEvent) failures.push(`${record.id}: v2 rejected final must bind a rejected feedback event to exact head ${rejectedHead}`);
    if (!rejectedVisual) failures.push(`${record.id}: v2 rejected final must bind a Rejected visual reference to exact head ${rejectedHead}`);
    if (HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === rejectedHead && ['accepted', 'canonical'].includes(event.verdict))) failures.push(`${record.id}: rejected exact head was incorrectly promoted to accepted/canonical`);
  } else if (record.sourceWindow.finalVerdict === 'accepted') {
    const acceptedHead = record.sourceWindow.finalOwnerVisibleHead;
    const acceptedScope = record.preferenceBrief?.scope;
    const acceptedEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.evidence?.gitSha === acceptedHead && event.verdict === 'accepted');
    const acceptedVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) =>
      ['silver', 'golden'].includes(reference.tier) &&
      reference.gitSha === acceptedHead &&
      (!acceptedScope || reference.scopes.includes(acceptedScope)),
    );
    if (!acceptedEvent) failures.push(`${record.id}: v2 accepted final must bind an accepted feedback event to exact head ${acceptedHead}`);
    if (!acceptedVisual) failures.push(`${record.id}: v2 accepted final must bind a Silver/Golden visual reference to exact head ${acceptedHead}`);
    if (HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === acceptedHead && event.verdict === 'canonical')) failures.push(`${record.id}: concrete accepted head was incorrectly promoted to canonical`);
  }
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden')) failures.push(`${record.id}: briefing must not have a Golden visual without canonical owner language`);

  const families = new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms));
  const repeatedFamilies = [...families].filter((family) => failureFamilySeverity(family) === 'repeated').sort();
  const hardFamilies = hardFailureFamilies();
  for (const requiredHard of ['meaningless-english-eyebrow', 'engineering-as-science-highlight', 'internal-detail-promoted-to-primary-attention', 'incomplete-scientific-decision-loop', 'defensive-negation-opening']) if (!hardFamilies.includes(requiredHard)) failures.push(`${record.id}: expected hard family missing: ${requiredHard}`);
  if (record.schema === 'human-feedback-ingestion-closeout.v2') {
    for (const requiredRepeated of ['incomplete-scientific-decision-loop', 'mobile-fixed-canvas-overflow']) {
      if (!['repeated', 'hard'].includes(failureFamilySeverity(requiredRepeated))) failures.push(`${record.id}: expected repeated family missing: ${requiredRepeated}`);
    }
  }

  const { brief, statuses } = signalStatus(record);
  for (const signal of record.expectedRetrievedSignals) if (!statuses[signal]) failures.push(`${record.id}: future Preference Brief failed to recover ${signal}`);
  const { evaluationProofFailures, evaluationProofPassFailures } = validateEvaluationProof(record, failures);

  return {
    failures,
    dispositionCounts: counts,
    hardFamilies,
    repeatedFamilies,
    retrievedEventIds: brief.events.map((event) => event.id),
    retrievedGoldPairIds: brief.goldPairs.map(({ pair }) => pair.id),
    retrievedSignals: statuses,
    evaluationProofFailures,
    evaluationProofPassFailures,
  };
}
