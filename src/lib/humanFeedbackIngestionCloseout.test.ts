import { describe, expect, it } from 'vitest';
import { OPEN_EVO_BRIEFING_INGESTION_20260909 } from '../data/humanFeedbackIngestionCloseouts';
import { HUMAN_FEEDBACK_EVENTS, HUMAN_VISUAL_REFERENCE_SET, failureFamilySeverity } from '../data/humanPreferenceLearningHistory';
import { validateHumanFeedbackIngestionCloseout } from './humanFeedbackIngestionCloseout';

const record = OPEN_EVO_BRIEFING_INGESTION_20260909;

describe('human feedback ingestion closeout', () => {
  it('covers every identified candidate owner-feedback signal with one disposition', () => {
    expect(record.ledger).toHaveLength(record.candidateFeedbackSignals);
    expect(new Set(record.ledger.map((item) => item.id)).size).toBe(record.candidateFeedbackSignals);
    expect(record.ledger.filter((item) => item.disposition === 'ambiguous-hold')).toEqual([]);
    expect(record.ledger.find((item) => item.id === 'FB-29-THREE-B-EXPERIMENT-EXISTS')?.disposition).toBe('task-fact-not-preference');
  });

  it('preserves intermediate better versus concrete accepted versus canonical', () => {
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION')?.verdict).toBe('better');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT')?.verdict).toBe('better');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED')?.verdict).toBe('accepted');
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.verdict === 'canonical')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
  });

  it('keeps the all-device fixed deck as history and supersedes it only for the phone/desktop scope split', () => {
    const current = HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT')!;
    expect(current.supersedesEventIds).toContain('EVENT-20260908-FIXED-DECK-ALL-DEVICES');
    expect(current.scopes).toEqual(expect.arrayContaining(['briefing-mobile', 'briefing-desktop']));
  });

  it('escalates repeated cross-form attention mistakes without turning them into a word blacklist', () => {
    expect(failureFamilySeverity('meaningless-english-eyebrow')).toBe('hard');
    expect(failureFamilySeverity('engineering-as-science-highlight')).toBe('hard');
    expect(failureFamilySeverity('internal-detail-promoted-to-primary-attention')).toBe('hard');
    expect(failureFamilySeverity('project-status-as-research-story')).toBe('repeated');
  });

  it('passes coverage, future-generation retrieval, and evaluation-side recurrence proof', () => {
    const result = validateHumanFeedbackIngestionCloseout(record);
    expect(result.evaluationProofFailures).toContain('hard failure family not checked: internal-detail-promoted-to-primary-attention');
    expect(result.evaluationProofPassFailures).toEqual([]);
    expect(result.failures).toEqual([]);
  });
});
