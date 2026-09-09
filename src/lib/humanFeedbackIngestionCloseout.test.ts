import { describe, expect, it } from 'vitest';
import { OPEN_EVO_BRIEFING_INGESTION_20260909 } from '../data/humanFeedbackIngestionCloseouts';
import {
  HUMAN_FEEDBACK_EVENTS,
  HUMAN_PREFERENCE_TRAJECTORIES,
  HUMAN_VISUAL_REFERENCE_SET,
  failureFamilySeverity,
} from '../data/humanPreferenceLearningHistory';
import { HUMAN_FEEDBACK_GOLD_PAIRS } from '../data/humanPreferenceModel';
import { validateHumanFeedbackIngestionCloseout } from './humanFeedbackIngestionCloseout';

const result = () => validateHumanFeedbackIngestionCloseout(OPEN_EVO_BRIEFING_INGESTION_20260909);

describe('OpenEVO briefing human-feedback ingestion closeout', () => {
  it('covers every identified feedback turn exactly once', () => {
    const ledger = OPEN_EVO_BRIEFING_INGESTION_20260909.ledger;
    expect(ledger).toHaveLength(25);
    expect(new Set(ledger.map((item) => item.id)).size).toBe(25);
    expect(result().dispositionCounts).toEqual({
      ingest: 12,
      'merge-duplicate': 6,
      superseded: 1,
      'task-fact-not-preference': 1,
      'page-specific-only': 4,
      'ambiguous-hold': 1,
      'out-of-scope': 0,
    });
  });

  it('preserves non-binary verdicts and does not invent Golden approval', () => {
    const soft = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION');
    const final = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED');
    const trajectory = HUMAN_PREFERENCE_TRAJECTORIES.find((item) => item.id === 'TRAJECTORY-BRIEFING-VISUAL-20260908');
    expect(soft?.verdict).toBe('better');
    expect(final?.verdict).toBe('accepted');
    expect(trajectory?.canonicalVariantId).toBeUndefined();
    expect(HUMAN_VISUAL_REFERENCE_SET.some((item) => item.scopes.includes('briefing') && item.tier === 'golden')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.find((item) => item.id === 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER')?.tier).toBe('silver');
    expect(HUMAN_VISUAL_REFERENCE_SET.find((item) => item.id === 'VISUAL-BRIEFING-TRAINING-DYNAMICS-CURRENT-CANDIDATE')?.tier).toBe('current-candidate');
  });

  it('records the phone/desktop supersession without overgeneralizing', () => {
    const oldRule = OPEN_EVO_BRIEFING_INGESTION_20260909.ledger.find((item) => item.id === 'FB-18-FIXED-16-9-ALL-DEVICES');
    const newRule = OPEN_EVO_BRIEFING_INGESTION_20260909.ledger.find((item) => item.id === 'FB-19-PARAMETER-TITLE-PHONE-DESKTOP-SPLIT');
    expect(oldRule?.disposition).toBe('superseded');
    expect(oldRule?.supersededBy).toBe(newRule?.id);
    const event = HUMAN_FEEDBACK_EVENTS.find((item) => item.id === 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT');
    expect(event?.scopes).toEqual(expect.arrayContaining(['briefing-mobile', 'briefing-desktop']));
    expect(HUMAN_FEEDBACK_GOLD_PAIRS.some((pair) => pair.id === 'PAIR-082-DEVICE-SCOPE')).toBe(true);
  });

  it('escalates repeated mechanisms rather than literal tokens', () => {
    expect(failureFamilySeverity('meaningless-english-eyebrow')).toBe('hard');
    expect(failureFamilySeverity('engineering-as-science-highlight')).toBe('hard');
    expect(failureFamilySeverity('numeric-shock-heading')).toBe('normal');
  });

  it('proves both future retrieval and pre-owner-review rejection', () => {
    const validation = result();
    expect(validation.failures).toEqual([]);
    for (const signal of OPEN_EVO_BRIEFING_INGESTION_20260909.expectedRetrievedSignals) {
      expect(validation.retrievedSignals[signal], signal).toBe(true);
    }
    expect(validation.evaluationProofFailures).toContain('hard failure family not checked: meaningless-english-eyebrow');
  });
});
