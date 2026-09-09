import { describe, expect, it } from 'vitest';
import { OPEN_EVO_BRIEFING_CLOSEOUT_20260909 } from '../data/humanFeedbackIngestionCloseouts';
import { HUMAN_FEEDBACK_EVENTS, HUMAN_VISUAL_REFERENCE_SET, failureFamilySeverity } from '../data/humanPreferenceLearningHistory';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../data/humanPreferenceModel';
import { buildHumanPreferenceBrief } from './humanPreferenceBrief';
import { completionReceipt, evaluateCloseoutProbe, verifyHumanFeedbackIngestionCloseout } from './humanFeedbackIngestionCloseout';

describe('human feedback ingestion closeout 2026-09-09', () => {
  it('covers every identified feedback-bearing owner turn exactly once', () => {
    const closeout = OPEN_EVO_BRIEFING_CLOSEOUT_20260909;
    expect(closeout.ledger).toHaveLength(13);
    expect(new Set(closeout.ledger.map((entry) => entry.id)).size).toBe(closeout.ledger.length);
    expect(closeout.ledger.every((entry) => entry.rawExcerpt.trim() && entry.reason.trim())).toBe(true);
    expect(completionReceipt(closeout).coveragePercent).toBe(100);
  });

  it('preserves non-binary verdicts and refuses a fake Golden promotion', () => {
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION')?.verdict).toBe('better');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-CHRONOLOGY-SCIENCE-STORY')?.verdict).toBe('promising');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-MERGED-ACCEPTED')?.verdict).toBe('accepted');
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'current-candidate')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-MERGED-ACCEPTED-SILVER')?.tier).toBe('silver');
  });

  it('keeps explicit supersession instead of rewriting old device feedback', () => {
    const newer = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT');
    expect(newer?.supersedesEventIds).toContain('EVENT-20260908-FIXED-DECK-ALL-DEVICES');
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.id === 'EVENT-20260908-FIXED-DECK-ALL-DEVICES')).toBe(true);
    expect(HUMAN_PREFERENCE_MODEL.find((preference) => preference.id === 'PREF-DEVICE-SCOPED-COMPOSITION')?.confidence).toBe('page-specific');
  });

  it('escalates only truly repeated failure families', () => {
    expect(failureFamilySeverity('meaningless-english-eyebrow')).toBe('hard');
    expect(failureFamilySeverity('attention-tax')).toBe('hard');
    expect(failureFamilySeverity('engineering-as-science-highlight')).toBe('hard');
    expect(failureFamilySeverity('mainline-rigor-tax')).toBe('hard');
    expect(failureFamilySeverity('decorative-attention-noise')).toBe('normal');
    expect(failureFamilySeverity('meta-technical-performance')).toBe('normal');
  });

  it('adds only supported Gold Pairs and preserves task facts outside preference learning', () => {
    for (const id of ['PAIR-082-PARAMETER-HEADING', 'PAIR-082-TECHNICAL-META', 'PAIR-082-RIGOR-DISCLOSURE', 'PAIR-082-DEVICE-SCOPE']) {
      expect(HUMAN_FEEDBACK_GOLD_PAIRS.some((pair) => pair.id === id)).toBe(true);
    }
    const mixed = OPEN_EVO_BRIEFING_CLOSEOUT_20260909.ledger.find((entry) => entry.id === 'FEEDBACK-ENGINEERING-DOWN-SCIENCE-STORY-UP');
    expect(mixed?.nonPreferenceFragments?.join(' ')).toContain('3B');
    expect(OPEN_EVO_BRIEFING_CLOSEOUT_20260909.nonLearningDecisions.some((item) => item.signal.includes('3B'))).toBe(true);
  });

  it('proves a future-task Preference Brief retrieves the new learning', () => {
    const probe = OPEN_EVO_BRIEFING_CLOSEOUT_20260909.futureTaskProbe;
    const brief = buildHumanPreferenceBrief({ query: probe.query, contractId: probe.contractId });
    const prefs = new Set(brief.learnedPreferences.map(({ preference }) => preference.id));
    const pairs = new Set(brief.goldPairs.map(({ pair }) => pair.id));
    for (const id of probe.expectedPreferenceIds) expect(prefs.has(id)).toBe(true);
    for (const id of probe.expectedGoldPairIds) expect(pairs.has(id)).toBe(true);
    expect(brief.generationRules.some((rule) => rule.includes('There is no Golden visual reference'))).toBe(true);
    expect(brief.events.some((event) => event.id === 'EVENT-20260909-MAINLINE-RIGOR-TAX')).toBe(true);
    expect(brief.events.some((event) => event.id === 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT')).toBe(true);
  });

  it('rejects a future candidate that reproduces learned rejected exemplars', () => {
    const closeout = OPEN_EVO_BRIEFING_CLOSEOUT_20260909;
    const result = evaluateCloseoutProbe(closeout.evaluationProbe.candidate, closeout.futureTaskProbe.contractId);
    expect(result.verdict).toBe('FAIL');
    expect(result.matchedPairIds).toEqual(expect.arrayContaining([
      'PAIR-027-ENGLISH-EYEBROW',
      'PAIR-082-PARAMETER-HEADING',
      'PAIR-082-TECHNICAL-META',
      'PAIR-082-RIGOR-DISCLOSURE',
      'PAIR-082-DEVICE-SCOPE',
    ]));
    for (const family of closeout.evaluationProbe.expectedRejectedMechanisms) expect(result.rejectedMechanisms).toContain(family);
  });

  it('validates the machine-readable completion receipt', () => {
    expect(verifyHumanFeedbackIngestionCloseout(OPEN_EVO_BRIEFING_CLOSEOUT_20260909)).toEqual([]);
    expect(completionReceipt().status).toBe('PASS');
  });
});
