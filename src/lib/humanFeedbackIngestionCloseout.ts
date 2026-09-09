import { OPEN_EVO_BRIEFING_CLOSEOUT_20260909, type HumanFeedbackIngestionCloseout } from '../data/humanFeedbackIngestionCloseouts';
import { HUMAN_FEEDBACK_EVENTS, HUMAN_VISUAL_REFERENCE_SET, failureFamilySeverity, hardFailureFamilies } from '../data/humanPreferenceLearningHistory';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../data/humanPreferenceModel';
import { buildHumanPreferenceBrief } from './humanPreferenceBrief';
import { goldPairIdsForContract } from './humanPreferenceLearning';

const allowed = new Set(['ingest', 'merge-duplicate', 'out-of-scope', 'ambiguous-hold', 'superseded', 'task-fact-not-preference', 'page-specific-only']);

export function closeoutDispositionCounts(closeout: HumanFeedbackIngestionCloseout) {
  return Object.fromEntries([...allowed].map((item) => [item, closeout.ledger.filter((entry) => entry.disposition === item).length]));
}

export function evaluateCloseoutProbe(candidate: string, contractId: string) {
  const requiredPairIds = new Set(goldPairIdsForContract(contractId));
  const matchedPairs = HUMAN_FEEDBACK_GOLD_PAIRS.filter((pair) =>
    requiredPairIds.has(pair.id) && candidate.toLowerCase().includes(pair.rejected.toLowerCase()),
  );
  return {
    matchedPairIds: matchedPairs.map((pair) => pair.id),
    rejectedMechanisms: [...new Set(matchedPairs.flatMap((pair) => pair.failureMechanisms))].sort(),
    verdict: matchedPairs.length ? 'FAIL' as const : 'NO-EXACT-REJECTED-EXEMPLAR' as const,
  };
}

export function verifyHumanFeedbackIngestionCloseout(closeout: HumanFeedbackIngestionCloseout): string[] {
  const failures: string[] = [];
  const eventIds = new Set(HUMAN_FEEDBACK_EVENTS.map((event) => event.id));
  const preferenceIds = new Set(HUMAN_PREFERENCE_MODEL.map((item) => item.id));
  const pairIds = new Set(HUMAN_FEEDBACK_GOLD_PAIRS.map((item) => item.id));
  const visualIds = new Set(HUMAN_VISUAL_REFERENCE_SET.map((item) => item.id));
  const ledgerIds = new Set<string>();

  if (!closeout.ledger.length) failures.push('coverage ledger is empty');
  for (const entry of closeout.ledger) {
    if (ledgerIds.has(entry.id)) failures.push(`duplicate ledger id: ${entry.id}`);
    ledgerIds.add(entry.id);
    if (!allowed.has(entry.disposition)) failures.push(`${entry.id}: invalid disposition ${entry.disposition}`);
    if (!entry.rawExcerpt.trim()) failures.push(`${entry.id}: missing raw owner excerpt`);
    if (!entry.reason.trim()) failures.push(`${entry.id}: missing disposition reason`);
    for (const id of entry.eventIds ?? []) if (!eventIds.has(id)) failures.push(`${entry.id}: unknown event ${id}`);
    for (const id of entry.preferenceIds ?? []) if (!preferenceIds.has(id)) failures.push(`${entry.id}: unknown preference ${id}`);
    for (const id of entry.goldPairIds ?? []) if (!pairIds.has(id)) failures.push(`${entry.id}: unknown Gold Pair ${id}`);
    for (const id of entry.visualReferenceIds ?? []) if (!visualIds.has(id)) failures.push(`${entry.id}: unknown visual reference ${id}`);
  }

  for (const link of closeout.supersessions) {
    const older = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === link.olderEventId);
    const newer = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === link.newerEventId);
    if (!older || !newer) failures.push(`invalid supersession ${link.olderEventId} -> ${link.newerEventId}`);
    else if (!newer.supersedesEventIds?.includes(link.olderEventId)) failures.push(`supersession not encoded on newer event: ${link.newerEventId}`);
    if (!link.boundary.trim()) failures.push(`supersession boundary missing: ${link.olderEventId}`);
  }

  const finalEvent = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-MERGED-ACCEPTED');
  if (finalEvent?.verdict !== 'accepted') failures.push('final merged briefing must be accepted, not canonical');
  const finalVisual = HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-MERGED-ACCEPTED-SILVER');
  if (finalVisual?.tier !== 'silver') failures.push('final merged visual must remain Silver');
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')) failures.push('no briefing Golden reference is authorized by this closeout');
  if (HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'current-candidate')) failures.push('merged briefing closeout must not leave a stale current-candidate visual');

  const brief = buildHumanPreferenceBrief({ query: closeout.futureTaskProbe.query, contractId: closeout.futureTaskProbe.contractId });
  const retrievedPreferenceIds = new Set(brief.learnedPreferences.map(({ preference }) => preference.id));
  const retrievedPairIds = new Set(brief.goldPairs.map(({ pair }) => pair.id));
  const retrievedFamilies = new Set([...brief.hardFailureFamilies, ...brief.events.flatMap((event) => event.failureMechanisms)]);
  for (const id of closeout.futureTaskProbe.expectedPreferenceIds) if (!retrievedPreferenceIds.has(id)) failures.push(`future Preference Brief did not retrieve ${id}`);
  for (const id of closeout.futureTaskProbe.expectedGoldPairIds) if (!retrievedPairIds.has(id)) failures.push(`future Preference Brief did not retrieve ${id}`);
  for (const family of closeout.futureTaskProbe.expectedFailureFamilies) if (!retrievedFamilies.has(family)) failures.push(`future Preference Brief did not surface failure family ${family}`);
  if (closeout.futureTaskProbe.mustStateNoGoldenReference && !brief.generationRules.some((rule) => rule.includes('There is no Golden visual reference'))) failures.push('future Preference Brief did not state no-Golden boundary');

  const evaluation = evaluateCloseoutProbe(closeout.evaluationProbe.candidate, closeout.futureTaskProbe.contractId);
  if (evaluation.verdict !== 'FAIL') failures.push('evaluation probe did not fail against rejected historical exemplars');
  for (const family of closeout.evaluationProbe.expectedRejectedMechanisms) {
    if (!evaluation.rejectedMechanisms.includes(family)) failures.push(`evaluation probe did not flag ${family}`);
  }

  return failures;
}

export function completionReceipt(closeout: HumanFeedbackIngestionCloseout = OPEN_EVO_BRIEFING_CLOSEOUT_20260909) {
  const failures = verifyHumanFeedbackIngestionCloseout(closeout);
  const counts = closeoutDispositionCounts(closeout);
  return {
    schema: 'human-feedback-ingestion-closeout.v1' as const,
    id: closeout.id,
    sourceWindow: closeout.sourceWindow,
    candidateFeedbackTurns: closeout.ledger.length,
    dispositionCounts: counts,
    coveragePercent: closeout.ledger.length ? 100 : 0,
    eventCount: HUMAN_FEEDBACK_EVENTS.length,
    preferenceDimensionCount: HUMAN_PREFERENCE_MODEL.length,
    goldPairCount: HUMAN_FEEDBACK_GOLD_PAIRS.length,
    visualTiers: HUMAN_VISUAL_REFERENCE_SET.map(({ id, tier }) => ({ id, tier })),
    failureFamilies: {
      hard: hardFailureFamilies(),
      repeated: [...new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms))]
        .filter((family) => failureFamilySeverity(family) === 'repeated')
        .sort(),
    },
    supersessionCount: closeout.supersessions.length,
    retrievalProbe: closeout.futureTaskProbe,
    evaluationProbe: { ...closeout.evaluationProbe, observed: evaluateCloseoutProbe(closeout.evaluationProbe.candidate, closeout.futureTaskProbe.contractId) },
    nonLearningDecisionCount: closeout.nonLearningDecisions.length,
    nonLearningDecisions: closeout.nonLearningDecisions,
    automationGap: closeout.automationGap,
    mergeBoundary: closeout.mergeBoundary,
    failures,
    status: failures.length ? 'FAIL' as const : 'PASS' as const,
  };
}
