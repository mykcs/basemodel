import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HUMAN_FEEDBACK_EVENTS,
  HUMAN_PREFERENCE_TRAJECTORIES,
  HUMAN_VISUAL_REFERENCE_SET,
  failureFamilySeverity,
} from '../data/humanPreferenceLearningHistory';
import {
  buildHumanPreferenceBrief,
  candidateReceiptTemplate,
  verifyCandidateReceipt,
} from './humanPreferenceBrief';

describe('human preference learning v2', () => {
  it('preserves intermediate owner feedback instead of promoting better to canonical', () => {
    const soft = HUMAN_FEEDBACK_EVENTS.find((event) => event.variantId === 'briefing-soft-slide-family');
    expect(soft?.verdict).toBe('better');
    expect(HUMAN_PREFERENCE_TRAJECTORIES[0]?.canonicalVariantId).toBeUndefined();
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
  });

  it('escalates an explicitly repeated failure family to hard', () => {
    expect(failureFamilySeverity('meaningless-english-eyebrow')).toBe('hard');
  });

  it('keeps rejected, silver, and active current-candidate evidence distinct without inventing Golden', () => {
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'rejected')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'silver')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'current-candidate')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
  });

  it('compiles a task-time brief from events, trajectories, visuals, and the existing preference model', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '科研汇报 去 AI 味 ADHD 注意力 TaskVector 公式 英文眉题',
    });
    expect(brief.hardFailureFamilies).toContain('meaningless-english-eyebrow');
    expect(brief.events.some((event) => event.variantId === 'briefing-mechanism-math-depth')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'silver')).toBe(true);
    expect(brief.generationRules.join('\n')).toContain('2–3 candidates');
    expect(brief.generationRules.join('\n')).toContain('There is no Golden visual reference');
  });

  it('generates three internal candidate slots with screenshots required', () => {
    const template = candidateReceiptTemplate('study-briefing', 'refresh advisor briefing');
    expect(template.variants).toHaveLength(3);
    expect(template.variants.every((variant) => variant.screenshotRef.includes('required screenshot'))).toBe(true);
    expect(template.ownerSawOnlySelectedCandidate).toBe(true);
  });

  it('fails a candidate receipt that skips screenshots or hard-family checks', () => {
    const template = candidateReceiptTemplate('study-briefing', 'refresh advisor briefing');
    template.exactGitSha = 'a'.repeat(40);
    template.selectedVariantId = 'A';
    template.variants[0]!.screenshotRef = '/tmp/a.png';
    template.variants[1]!.screenshotRef = '';
    template.variants[2]!.screenshotRef = '/tmp/c.png';
    template.comparisons = [
      { winnerId: 'A', loserId: 'B', reason: 'clearer', evidence: 'one visual center' },
      { winnerId: 'A', loserId: 'C', reason: 'less noisy', evidence: 'fewer competing labels' },
    ];
    template.hardFamiliesChecked = [];
    const failures = verifyCandidateReceipt(template);
    expect(failures.some((failure) => failure.includes('B: missing screenshotRef'))).toBe(true);
    expect(failures.some((failure) => failure.includes('hard failure family not checked'))).toBe(true);
  });

  it('accepts a complete internal candidate screening receipt', () => {
    const template = candidateReceiptTemplate('study-briefing', 'refresh advisor briefing');
    template.exactGitSha = 'b'.repeat(40);
    template.selectedVariantId = 'B';
    template.variants = template.variants.map((variant) => ({
      ...variant,
      hypothesis: `hypothesis ${variant.id}`,
      attentionCenter: `center ${variant.id}`,
      informationDensity: `density ${variant.id}`,
      visualLanguage: `visual ${variant.id}`,
      screenshotRef: `/tmp/${variant.id}.png`,
    }));
    template.comparisons = [
      { winnerId: 'B', loserId: 'A', reason: 'better attention hierarchy', evidence: 'screenshot A/B' },
      { winnerId: 'B', loserId: 'C', reason: 'keeps scientific depth without noise', evidence: 'screenshot B/C' },
    ];
    expect(verifyCandidateReceipt(template)).toEqual([]);
  });

  it('keeps the v2 workflow executable and documented', () => {
    const doc = fs.readFileSync('docs/agents/current/human-preference-learning-system.md', 'utf8');
    const briefScript = fs.readFileSync('scripts/generate-human-preference-brief.ts', 'utf8');
    const receiptScript = fs.readFileSync('scripts/verify-human-preference-candidate-receipt.ts', 'utf8');
    expect(doc).toContain('Preference Trajectory');
    expect(doc).toContain('Golden / Silver / Rejected Visual Set');
    expect(doc).toContain('2–3 internal candidates');
    expect(briefScript).toContain('buildHumanPreferenceBrief');
    expect(receiptScript).toContain('verifyCandidateReceipt');
  });

  it('requires every trajectory comparison to reference declared variants', () => {
    for (const trajectory of HUMAN_PREFERENCE_TRAJECTORIES) {
      const ids = new Set(trajectory.variantIds);
      for (const comparison of trajectory.comparisons) {
        expect(ids.has(comparison.betterVariantId)).toBe(true);
        expect(ids.has(comparison.worseVariantId)).toBe(true);
      }
    }
  });
});
