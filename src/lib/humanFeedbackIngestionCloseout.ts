import {
  HUMAN_FEEDBACK_EVENTS,
  HUMAN_PREFERENCE_TRAJECTORIES,
  HUMAN_VISUAL_REFERENCE_SET,
  failureFamilySeverity,
  hardFailureFamilies,
} from '../data/humanPreferenceLearningHistory';
import { HUMAN_FEEDBACK_PRECEDENTS } from '../data/humanFeedbackPrecedents';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../data/humanPreferenceModel';
import type {
  FeedbackLedgerDisposition,
  HumanFeedbackIngestionCloseoutRecord,
} from '../data/humanFeedbackIngestionCloseouts';
import {
  buildHumanPreferenceBrief,
  candidateReceiptTemplate,
  verifyCandidateReceipt,
} from './humanPreferenceBrief';

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

function signalStatus(record: HumanFeedbackIngestionCloseoutRecord) {
  const brief = buildHumanPreferenceBrief({
    query: record.futureTaskQuery,
    contractId: 'study-briefing',
  });
  const events = new Set(brief.events.map((event) => event.id));
  const preferences = new Set(brief.learnedPreferences.map(({ preference }) => preference.id));
  const pairs = new Set(brief.goldPairs.map(({ pair }) => pair.id));
  const visuals = new Set(brief.visualReferences.map((reference) => reference.id));
  const trajectory = HUMAN_PREFERENCE_TRAJECTORIES.find((item) => item.id === 'TRAJECTORY-BRIEFING-VISUAL-20260908');
  const finalEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED');

  const statuses: Record<string, boolean> = {
    'intermediate-better-is-not-canonical':
      events.has('EVENT-20260908-SOFT-SLIDE-DIRECTION') &&
      HUMAN_FEEDBACK_EVENTS.some(
        (event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION' && event.verdict === 'better',
      ) &&
      !trajectory?.canonicalVariantId &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
    'meaningless-english-eyebrow':
      brief.hardFailureFamilies.includes('meaningless-english-eyebrow') &&
      events.has('EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW'),
    'numeric-shock-heading':
      events.has('EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT') &&
      pairs.has('PAIR-082-PARAMETER-HEADING'),
    'phone-vs-desktop-scope-split':
      events.has('EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT') &&
      preferences.has('PREF-BRIEFING-DEVICE-SCOPE') &&
      pairs.has('PAIR-082-DEVICE-SCOPE'),
    'technical-depth-without-meta-performance':
      events.has('EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META') &&
      preferences.has('PREF-TECHNICAL-DEPTH-WITHOUT-META') &&
      pairs.has('PAIR-082-TECHNICAL-WITHOUT-META'),
    'engineering-rigor-progressive-disclosure':
      events.has('EVENT-20260909-MAINLINE-RIGOR-TAX') &&
      pairs.has('PAIR-082-ENGINEERING-DEPTH'),
    'scientific-decision-chain':
      events.has('EVENT-20260909-CHRONOLOGY-SCIENCE-STORY') &&
      preferences.has('PREF-RESEARCH-JUDGMENT') &&
      pairs.has('PAIR-082-CHRONOLOGICAL-SCIENCE-STORY'),
    'internal-detail-primary-attention':
      brief.hardFailureFamilies.includes('internal-detail-promoted-to-primary-attention') &&
      pairs.has('PAIR-082-PARAMETER-HEADING') &&
      pairs.has('PAIR-082-ENGINEERING-DEPTH'),
    'concrete-accepted-is-not-canonical':
      finalEvent?.verdict === 'accepted' &&
      !trajectory?.canonicalVariantId &&
      visuals.has('VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER') &&
      !HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden'),
  };
  return { brief, statuses };
}

function buildEvaluationProofReceipt(record: HumanFeedbackIngestionCloseoutRecord) {
  const receipt = candidateReceiptTemplate('study-briefing', 'future advisor briefing recurrence check');
  receipt.exactGitSha = record.sourceWindow.finalAcceptedHead;
  receipt.variants = receipt.variants.slice(0, 2).map((variant, index) => ({
    ...variant,
    id: index === 0 ? 'A' : 'B',
    hypothesis: index === 0 ? 'decorative eyebrow recurrence' : 'direct Chinese subject heading',
    attentionCenter: index === 0 ? 'English eyebrow' : 'scientific question',
    informationDensity: 'bounded',
    visualLanguage: 'semantic HTML',
    screenshotRef: `/tmp/future-candidate-${index === 0 ? 'a' : 'b'}.png`,
    predictedFailureFamilies: index === 0 ? [record.evaluationProof.hardFamily] : [],
  }));
  receipt.selectedVariantId = 'B';
  receipt.comparisons = [
    {
      winnerId: 'B',
      loserId: 'A',
      reason: 'removes author-internal attention tax',
      evidence: 'candidate B starts directly with the scientific subject',
    },
  ];
  receipt.hardFamiliesChecked = hardFailureFamilies().filter(
    (family) => family !== record.evaluationProof.hardFamily,
  );
  return receipt;
}

export function validateHumanFeedbackIngestionCloseout(
  record: HumanFeedbackIngestionCloseoutRecord,
): HumanFeedbackIngestionValidation {
  const failures: string[] = [];
  const counts = Object.fromEntries(allDispositions.map((item) => [item, 0])) as Record<
    FeedbackLedgerDisposition,
    number
  >;
  const ledgerIds = new Set<string>();
  const eventIds = new Set(HUMAN_FEEDBACK_EVENTS.map((event) => event.id));
  const caseIds = new Set(HUMAN_FEEDBACK_PRECEDENTS.map((item) => item.id));
  const preferenceIds = new Set(HUMAN_PREFERENCE_MODEL.map((item) => item.id));
  const pairIds = new Set(HUMAN_FEEDBACK_GOLD_PAIRS.map((item) => item.id));
  const visualIds = new Set(HUMAN_VISUAL_REFERENCE_SET.map((item) => item.id));

  if (record.schema !== 'human-feedback-ingestion-closeout.v1') failures.push(`${record.id}: wrong schema`);
  if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.finalAcceptedHead)) failures.push(`${record.id}: invalid finalAcceptedHead`);
  if (!/^[0-9a-f]{40}$/i.test(record.sourceWindow.mergedMainCommit)) failures.push(`${record.id}: invalid mergedMainCommit`);
  if (!Number.isInteger(record.candidateFeedbackSignals) || record.candidateFeedbackSignals < 1) failures.push(`${record.id}: candidateFeedbackSignals must be a positive integer`);
  if (record.ledger.length !== record.candidateFeedbackSignals) failures.push(`${record.id}: candidateFeedbackSignals=${record.candidateFeedbackSignals} but ledger has ${record.ledger.length}`);
  if (!record.futureTaskQuery.trim()) failures.push(`${record.id}: futureTaskQuery is empty`);
  const normalizedFutureQuery = record.futureTaskQuery.replace(/\s+/g, '').toLowerCase();
  for (const item of record.ledger) {
    const normalizedOwnerSignal = item.ownerSignal.replace(/\s+/g, '').toLowerCase();
    if (normalizedOwnerSignal.length >= 18 && normalizedFutureQuery.includes(normalizedOwnerSignal)) {
      failures.push(`${record.id}: futureTaskQuery copies owner signal verbatim: ${item.id}`);
    }
  }
  if (!record.automationGap.trim()) failures.push(`${record.id}: automationGap must be explicit`);

  for (const item of record.ledger) {
    counts[item.disposition] += 1;
    if (ledgerIds.has(item.id)) failures.push(`${record.id}: duplicate ledger id ${item.id}`);
    ledgerIds.add(item.id);
    if (!item.ownerSignal.trim()) failures.push(`${item.id}: missing ownerSignal`);
    if (!item.rationale.trim()) failures.push(`${item.id}: missing rationale`);
    if (['ingest', 'merge-duplicate', 'superseded'].includes(item.disposition) && !item.ownerSignal.trim()) {
      failures.push(`${item.id}: learned disposition requires raw owner evidence`);
    }
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
  if (!finalEvent || finalEvent.verdict !== 'accepted') failures.push(`${record.id}: final concrete briefing must be accepted`);
  if (HUMAN_FEEDBACK_EVENTS.some((event) => event.variantId === finalEvent?.variantId && event.verdict === 'canonical')) {
    failures.push(`${record.id}: final concrete acceptance was incorrectly promoted to canonical`);
  }
  const finalVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER');
  if (!finalVisual || finalVisual.tier !== 'silver') failures.push(`${record.id}: accepted briefing visual must remain Silver without template approval`);
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'golden')) {
    failures.push(`${record.id}: briefing must not have a Golden visual without canonical owner language`);
  }
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.scopes.includes('briefing') && reference.tier === 'current-candidate')) {
    failures.push(`${record.id}: completed briefing closeout must not leave a stale current-candidate visual`);
  }

  const families = new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms));
  const repeatedFamilies = [...families].filter((family) => failureFamilySeverity(family) === 'repeated').sort();
  const hardFamilies = hardFailureFamilies();
  for (const requiredHard of ['meaningless-english-eyebrow', 'engineering-as-science-highlight', 'internal-detail-promoted-to-primary-attention']) {
    if (!hardFamilies.includes(requiredHard)) failures.push(`${record.id}: expected hard family missing: ${requiredHard}`);
  }

  const { brief, statuses } = signalStatus(record);
  for (const signal of record.expectedRetrievedSignals) {
    if (!statuses[signal]) failures.push(`${record.id}: future Preference Brief failed to recover ${signal}`);
  }

  const evaluationReceipt = buildEvaluationProofReceipt(record);
  const evaluationProofFailures = verifyCandidateReceipt(evaluationReceipt);
  const expectedFailure = `hard failure family not checked: ${record.evaluationProof.hardFamily}`;
  if (!evaluationProofFailures.includes(expectedFailure)) {
    failures.push(`${record.id}: evaluation-side proof did not reject omitted hard family ${record.evaluationProof.hardFamily}`);
  }
  evaluationReceipt.hardFamiliesChecked = hardFailureFamilies();
  const evaluationProofPassFailures = verifyCandidateReceipt(evaluationReceipt);
  if (evaluationProofPassFailures.length) {
    failures.push(`${record.id}: evaluation receipt still fails after restoring all hard-family checks: ${evaluationProofPassFailures.join('; ')}`);
  }

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
