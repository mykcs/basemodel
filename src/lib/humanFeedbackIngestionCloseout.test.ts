import { describe, expect, it } from 'vitest';
import {
  OPEN_EVO_BRIEFING_INGESTION_20260909,
  OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909,
} from '../data/humanFeedbackIngestionCloseouts';
import { HUMAN_FEEDBACK_EVENTS, HUMAN_VISUAL_REFERENCE_SET, failureFamilySeverity } from '../data/humanPreferenceLearningHistory';
import { validateHumanFeedbackIngestionCloseout } from './humanFeedbackIngestionCloseout';

const original = OPEN_EVO_BRIEFING_INGESTION_20260909;
const successor = OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909;

describe('human feedback ingestion closeout', () => {
  it('covers every identified signal across the chained source windows with no unresolved hold', () => {
    expect(original.ledger).toHaveLength(original.candidateFeedbackSignals);
    expect(successor.ledger).toHaveLength(successor.candidateFeedbackSignals);
    expect(original.candidateFeedbackSignals + successor.candidateFeedbackSignals).toBe(37);
    expect(new Set([...original.ledger, ...successor.ledger].map((item) => item.id)).size).toBe(37);
    expect([...original.ledger, ...successor.ledger].filter((item) => item.disposition === 'ambiguous-hold')).toEqual([]);
  });

  it('preserves better, accepted, workflow-canonical, and visual tiers without conflating them', () => {
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260908-SOFT-SLIDE-DIRECTION')?.verdict).toBe('better');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED')?.verdict).toBe('accepted');
    expect(HUMAN_FEEDBACK_EVENTS.find((event) => event.id === 'EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT')?.verdict).toBe('canonical');
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.scopes.includes('briefing') && event.verdict === 'canonical')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER')?.tier).toBe('silver');
    expect(HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-BRIEFING-DYNAMICS-CURRENT-CANDIDATE')?.tier).toBe('current-candidate');
  });

  it('keeps the current page successor under review rather than inventing acceptance', () => {
    expect(successor.schema).toBe('human-feedback-ingestion-closeout.v2');
    expect(successor.sourceWindow.finalVerdict).toBe('current-candidate');
    expect(successor.sourceWindow.finalOwnerVisibleHead).toBe('e5d8a184c25cd49d0264efe8881cc02b302d9c51');
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === successor.sourceWindow.finalOwnerVisibleHead && ['accepted', 'canonical'].includes(event.verdict))).toBe(false);
  });

  it('escalates only the repeated mechanisms actually evidenced by this conversation', () => {
    expect(failureFamilySeverity('meaningless-english-eyebrow')).toBe('hard');
    expect(failureFamilySeverity('engineering-as-science-highlight')).toBe('hard');
    expect(failureFamilySeverity('internal-detail-promoted-to-primary-attention')).toBe('hard');
    expect(failureFamilySeverity('incomplete-scientific-decision-loop')).toBe('repeated');
    expect(failureFamilySeverity('mobile-fixed-canvas-overflow')).toBe('repeated');
  });

  it('passes both receipts, future-task retrieval, and negative/positive evaluation proof', () => {
    const oldResult = validateHumanFeedbackIngestionCloseout(original);
    const newResult = validateHumanFeedbackIngestionCloseout(successor);
    expect(oldResult.failures).toEqual([]);
    expect(newResult.evaluationProofFailures).toContain('PASS receipt cannot be rejected-like against a Gold Pair');
    expect(newResult.evaluationProofPassFailures).toEqual([]);
    expect(newResult.failures).toEqual([]);
  });
});
