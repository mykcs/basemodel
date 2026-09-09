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
  const finalEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED');
  const fastPreviewEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT');
  const candidateHead = record.sourceWindow.finalOwnerVisibleHead;
  const candidateScope = record.preferenceBrief?.scope;
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
      failureFamilySeverity('incomplete-scientific-decision-loop') === 'repeated',
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
  };
  return { brief, statuses };
}

function buildHardFamilyCandidateReceipt(record: HumanFeedbackIngestionCloseoutRecord, hardFamily: string) {
  const receipt = candidateReceiptTemplate('study-briefing', 'future advisor briefing recurrence check');
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

  if (record.evaluationProof.pairId && record.evaluationProof.failureFamily) {
    const pairId = record.evaluationProof.pairId;
    const family = record.evaluationProof.failureFamily;
    const severity = failureFamilySeverity(family);
    if (!['repeated', 'hard'].includes(severity)) failures.push(`${record.id}: evaluation failure family ${family} must be repeated/hard, got ${severity}`);
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

  failures.push(`${record.id}: evaluationProof must define hardFamily or failureFamily+pairId`);
  return { evaluationProofFailures: ['missing evaluation proof configuration'], evaluationProofPassFailures: [] };
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

  if (!['human-feedback-ingestion-closeout.v1', 'human-feedback-ingestion-closeout.v2'].includes(record.schema)) failures.push(`${record.id}: wrong schema`);
  if (record.schema === 'human-feedback-ingestion-closeout.v1') {
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.finalAcceptedHead ?? '')) failures.push(`${record.id}: invalid finalAcceptedHead`);
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.mergedMainCommit ?? '')) failures.push(`${record.id}: invalid mergedMainCommit`);
  } else {
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.finalOwnerVisibleHead ?? '')) failures.push(`${record.id}: invalid finalOwnerVisibleHead`);
    if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.mainAtCloseout ?? '')) failures.push(`${record.id}: invalid mainAtCloseout`);
    if (!['accepted', 'current-candidate'].includes(record.sourceWindow.finalVerdict ?? '')) failures.push(`${record.id}: v2 finalVerdict must be accepted/current-candidate`);
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
  }
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden')) failures.push(`${record.id}: briefing must not have a Golden visual without canonical owner language`);

  const families = new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms));
  const repeatedFamilies = [...families].filter((family) => failureFamilySeverity(family) === 'repeated').sort();
  const hardFamilies = hardFailureFamilies();
  for (const requiredHard of ['meaningless-english-eyebrow', 'engineering-as-science-highlight', 'internal-detail-promoted-to-primary-attention']) if (!hardFamilies.includes(requiredHard)) failures.push(`${record.id}: expected hard family missing: ${requiredHard}`);
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
