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

  it('keeps rejected and silver visual evidence distinct without inventing Golden after concrete acceptance', () => {
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'rejected')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'silver')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.tier === 'golden')).toBe(false);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.id === 'VISUAL-BRIEFING-DYNAMICS-CURRENT-CANDIDATE' && reference.tier === 'current-candidate')).toBe(true);
    expect(HUMAN_VISUAL_REFERENCE_SET.some((reference) => reference.id === 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER' && reference.tier === 'silver')).toBe(true);
    expect(HUMAN_FEEDBACK_EVENTS.some((event) => event.scopes.includes('briefing') && event.verdict === 'canonical')).toBe(false);
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

  it('retrieves the successor diagnostic and fast-preview rules for a genuinely different future task', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '下一次我要做一场新的机器人强化学习诊断组会：有若干负向实验、连续训练 checkpoint，还会和导师快速来回看网页草稿。请设计第一次汇报和审阅流程，让人能看出为什么排除了某个解释、训练过程是否在学，同时适合手机和会议室屏幕。',
    });
    expect(brief.learnedPreferences.map(({ preference }) => preference.id)).toEqual(expect.arrayContaining([
      'PREF-DIAGNOSTIC-CLOSURE',
      'PREF-FAST-REVIEW-PREVIEW',
      'PREF-BRIEFING-DEVICE-SCOPE',
    ]));
    expect(brief.goldPairs.map(({ pair }) => pair.id)).toEqual(expect.arrayContaining([
      'PAIR-084-DIAGNOSTIC-CLOSE-LOOP',
      'PAIR-085-FAST-REVIEW-PREVIEW',
      'PAIR-082-DEVICE-SCOPE',
    ]));
    expect(brief.events.some((event) => event.id === 'EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT' && event.verdict === 'canonical')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'current-candidate')).toBe(true);
    expect(brief.generationRules.join('\n')).toContain('still under review');
  });

  it('builds a recovery-scoped brief with rejected/current visual tiers and no invented Golden', () => {
    const brief = buildHumanPreferenceBrief({
      scope: 'recovery',
      query: '做一个服务器故障自救入口：用户只拿着手机、很着急、完全失忆，但完整运行手册必须保留。',
    });
    expect(brief.learnedPreferences.map(({ preference }) => preference.id)).toEqual(expect.arrayContaining([
      'PREF-RECOVERY-ACTION-FIRST',
      'PREF-FIRST-SCREEN-ATTENTION',
      'PREF-PROGRESSIVE-DISCLOSURE',
    ]));
    expect(brief.learnedPreferences.map(({ preference }) => preference.id)).not.toContain('PREF-BRIEFING-DEVICE-SCOPE');
    expect(brief.goldPairs.map(({ pair }) => pair.id)).not.toContain('PAIR-082-DEVICE-SCOPE');
    expect(brief.events.map((event) => event.id)).toEqual(expect.arrayContaining([
      'EVENT-20260909-FUHUO-RECOVERY-TECHNICAL-FIRST',
      'EVENT-20260909-FUHUO-RECOVERY-ACTION-FIRST-DIRECTION',
    ]));
    expect(brief.hardFailureFamilies).toContain('internal-detail-promoted-to-primary-attention');
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-FUHUO-RECOVERY-TECHNICAL-FIRST-REJECTED' && reference.tier === 'rejected')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-FUHUO-RECOVERY-ACTION-FIRST-CURRENT' && reference.tier === 'current-candidate')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'silver' || reference.tier === 'golden')).toBe(false);
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('复制 prompt / 命令') && boundary.includes('不是通用模板'))).toBe(true);
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
