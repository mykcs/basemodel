import { describe, expect, it } from 'vitest';
import {
  OPEN_EVO_BRIEFING_INGESTION_20260909,
  OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909,
  FUHUO_MAC_RECOVERY_INGESTION_20260909,
} from '../data/humanFeedbackIngestionCloseouts';
import { HUMAN_FEEDBACK_EVENTS, HUMAN_VISUAL_REFERENCE_SET, failureFamilySeverity } from '../data/humanPreferenceLearningHistory';
import { validateHumanFeedbackIngestionCloseout } from './humanFeedbackIngestionCloseout';

const original = OPEN_EVO_BRIEFING_INGESTION_20260909;
const successor = OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909;
const recovery = FUHUO_MAC_RECOVERY_INGESTION_20260909;

describe('human feedback ingestion closeout', () => {
  it('covers every identified signal across the chained source windows with no unresolved hold', () => {
    expect(original.ledger).toHaveLength(original.candidateFeedbackSignals);
    expect(successor.ledger).toHaveLength(successor.candidateFeedbackSignals);
    expect(recovery.ledger).toHaveLength(recovery.candidateFeedbackSignals);
    expect(original.candidateFeedbackSignals + successor.candidateFeedbackSignals + recovery.candidateFeedbackSignals).toBe(42);
    const all = [...original.ledger, ...successor.ledger, ...recovery.ledger];
    expect(new Set(all.map((item) => item.id)).size).toBe(42);
    expect(all.filter((item) => item.disposition === 'ambiguous-hold')).toEqual([]);
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

  it('keeps the fuhuo recovery successor as current-candidate and validates cross-repository evidence', () => {
    expect(recovery.sourceWindow.sourceRepository).toBe('mykcs/fuhuo_20260419');
    expect(recovery.sourceWindow.finalVerdict).toBe('current-candidate');
    expect(recovery.sourceWindow.finalOwnerVisibleHead).toBe('123fb5e479bcb167c894519067d64a23a276d137');
    expect(HUMAN_VISUAL_REFERENCE_SET.find((reference) => reference.id === 'VISUAL-FUHUO-RECOVERY-ACTION-FIRST-CURRENT')?.tier).toBe('current-candidate');
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.evidence?.gitSha === recovery.sourceWindow.finalOwnerVisibleHead && ['accepted', 'canonical'].includes(event.verdict))).toBe(false);
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

  it('passes recovery coverage, scope-aware retrieval, and hard-family recurrence proof', () => {
    const result = validateHumanFeedbackIngestionCloseout(recovery);
    expect(result.failures).toEqual([]);
    expect(result.retrievedSignals['recovery-action-first']).toBe(true);
    expect(result.retrievedSignals['recovery-progressive-depth']).toBe(true);
    expect(result.retrievedSignals['recovery-current-candidate-not-promoted']).toBe(true);
    expect(result.evaluationProofFailures).toContain('hard failure family not checked: internal-detail-promoted-to-primary-attention');
    expect(result.evaluationProofPassFailures).toEqual([]);
  });
});
