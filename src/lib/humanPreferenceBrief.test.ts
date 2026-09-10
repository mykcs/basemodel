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
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-DYNAMICS-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-604-ACCEPTED-SILVER' && reference.tier === 'silver')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-STORYLINE-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-605-MERGED-REJECTED' && reference.tier === 'rejected')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-LIVE-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE' && reference.tier === 'current-candidate')).toBe(true);
    expect(brief.generationRules.join('\n')).toContain('Current-candidate visual references are still under review');
  });

  it('retrieves the final briefing lessons for a different two-stage training talk before first draft', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '我要准备一场新的多模态代理训练组会：项目有两个训练阶段、几条不同模型尺寸的长周期实验、一个更新 gate、多个负向诊断和连续训练曲线。听众懂机器学习但没读过项目网站；同一份 HTML deck 还要在手机预览和会议室大屏展示。请给出第一版结构、机制文案和图表表达，并说明怎样避免把训练过程指标误当最终评测。',
    });
    const preferenceIds = brief.learnedPreferences.map(({ preference }) => preference.id);
    const pairIds = brief.goldPairs.map(({ pair }) => pair.id);
    expect(preferenceIds).toEqual(expect.arrayContaining([
      'PREF-BRIEFING-SELF-CONTAINED-METHOD',
      'PREF-CONCRETE-MECHANISM-WORDING',
      'PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR',
      'PREF-DIAGNOSTIC-CLOSURE',
      'PREF-BRIEFING-DEVICE-SCOPE',
    ]));
    expect(pairIds).toEqual(expect.arrayContaining([
      'PAIR-089-BRIEFING-METHOD-CONTEXT',
      'PAIR-087-CONCRETE-MECHANISM',
      'PAIR-088-EXPERIMENT-CHART-GRAMMAR',
      'PAIR-084-DIAGNOSTIC-CLOSE-LOOP',
      'PAIR-082-DEVICE-SCOPE',
    ]));
    expect(brief.hardFailureFamilies).toContain('incomplete-scientific-decision-loop');
    expect(brief.events.map((event) => event.id)).toEqual(expect.arrayContaining([
      'EVENT-20260909-BRIEFING-METHOD-CONTEXT',
      'EVENT-20260909-GDR-ABSTRACT-MECHANISM-PHRASING',
      'EVENT-20260909-UNIFIED-EXPERIMENT-CHART-GRAMMAR',
      'EVENT-20260909-DIAGNOSTIC-MOTIVATION-MISSING',
    ]));
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-604-ACCEPTED-SILVER')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'golden')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-DYNAMICS-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-STORYLINE-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-605-MERGED-REJECTED')).toBe(true);
  });

  it('retrieves event-first headings and jargon boundaries for a paraphrased future research talk', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '组会里训练跑了很久却没更新参数，后来查 gate 才找到原因；低分实验也是先看日志再决定改步数和记忆。听众不认识项目内部英文，请给自然标题。',
    });
    expect(brief.learnedPreferences.map(({ preference }) => preference.id)).toContain('PREF-EVENT-FIRST-RESEARCH-HEADINGS');
    expect(brief.goldPairs.map(({ pair }) => pair.id)).toEqual(expect.arrayContaining([
      'PAIR-090-GATE-HEADING',
      'PAIR-090-DIAGNOSTIC-ENTRY',
      'PAIR-090-COMPOSED-STATE',
    ]));
    expect(brief.hardFailureFamilies).toContain('compressed-shorthand-heading');
    expect(brief.events.map((event) => event.id)).toEqual(expect.arrayContaining([
      'EVENT-20260909-BRIEFING-STORYLINE-SHORTHAND-REPEAT',
      'EVENT-20260909-BRIEFING-STORYLINE-ENGLISH-GLUE',
    ]));
  });

  it('retrieves the explicit scientific referent correction for a different causal-mechanism talk', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '下一次做参数更新机制组会：我会比较普通 LoRA 和另一种参数更新方法，想解释为什么已有成功轨迹写进参数后任务能力仍没明显改善，以及这个对照到底在定位哪一种原因。还有一条训练正在跑，只有训练过程数据，最终冻结评测还没打开。',
    });
    const preferenceIds = brief.learnedPreferences.map(({ preference }) => preference.id);
    const pairIds = brief.goldPairs.map(({ pair }) => pair.id);
    expect(preferenceIds).toContain('PREF-CONCRETE-MECHANISM-WORDING');
    expect(pairIds).toContain('PAIR-087-DIAGNOSTIC-REFERENT');
    expect(brief.events.map((event) => event.id)).toContain('EVENT-20260910-BRIEFING-UNNAMED-DIAGNOSTIC-REFERENT');
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('近邻 antecedent') && boundary.includes('代词'))).toBe(true);
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('训练过程信号') && boundary.includes('最终评测'))).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-LIVE-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE' && reference.tier === 'current-candidate')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'golden')).toBe(false);
    expect(brief.hardFailureFamilies).not.toContain('unnamed-scientific-referent');
    expect(failureFamilySeverity('unnamed-scientific-referent')).toBe('normal');
  });

  it('retrieves repeated sibling-experiment chart grammar and target-verified fast Preview for a new model line', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '下个月新增一条 2B 长跑实验，旧 deck 已经有几条模型的 per-round Score、adapter loss 和 update 位置。我要第一版 HTML slide 直接能横向比较，还要用快速 Preview 给我看，发链接前确认目标页真的有这次新增的两张训练曲线。',
    });
    const preferenceIds = brief.learnedPreferences.map(({ preference }) => preference.id);
    const pairIds = brief.goldPairs.map(({ pair }) => pair.id);
    const eventIds = brief.events.map((event) => event.id);
    expect(preferenceIds).toEqual(expect.arrayContaining([
      'PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR',
      'PREF-FAST-REVIEW-PREVIEW',
    ]));
    expect(pairIds).toEqual(expect.arrayContaining([
      'PAIR-088-EXPERIMENT-CHART-GRAMMAR',
      'PAIR-085-FAST-REVIEW-PREVIEW',
    ]));
    expect(eventIds).toEqual(expect.arrayContaining([
      'EVENT-20260910-NOGDR-CHART-GRAMMAR-REPEAT',
      'EVENT-20260910-REVIEW-PREVIEW-MISSING-CLAIMED-CURVES',
    ]));
    expect(failureFamilySeverity('inconsistent-experiment-chart-grammar')).toBe('repeated');
    expect(failureFamilySeverity('cross-experiment-legend-relearning')).toBe('repeated');
    expect(failureFamilySeverity('review-preview-not-visually-verified')).toBe('normal');
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('新实验') && boundary.includes('不存在的曲线'))).toBe(true);
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('205') && boundary.includes('目标 slide'))).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-SUMMARY-CARDS-REJECTED' && reference.tier === 'rejected')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE' && reference.tier === 'current-candidate')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-NOGDR-LIVE-CURRENT-CANDIDATE')).toBe(false);
    expect(brief.visualReferences.some((reference) => reference.tier === 'golden')).toBe(false);
  });

  it('retrieves the repeated binary-contrast failure as hard while preserving normal scientific negation', () => {
    const brief = buildHumanPreferenceBrief({
      contractId: 'study-briefing',
      query: '准备下一次研究汇报：有一页只是列我们做过的实验尝试，标题不要先替观众构造一个二元反驳；同时结果页仍需要保留真正的科学 caveat。',
    });
    expect(brief.hardFailureFamilies).toEqual(expect.arrayContaining(['defensive-negation-opening', 'anticipatory-rebuttal']));
    expect(brief.goldPairs.map(({ pair }) => pair.id)).toContain('PAIR-081-BINARY-CONTRAST-SUMMARY');
    expect(brief.events.map((event) => event.id)).toContain('EVENT-20260909-BRIEFING-BINARY-CONTRAST-REPEAT');
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('否定句') || boundary.includes('caveat'))).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-BINARY-CONTRAST-REJECTED')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-BRIEFING-605-MERGED-REJECTED')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'golden')).toBe(false);
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


  it('retrieves Apple cognition over surface imitation for a different site-design task', () => {
    const brief = buildHumanPreferenceBrief({
      scope: 'all-public-ui',
      query: '重新设计科研工具首页、模型目录和论文入口；参考 Apple Developer 的信息设计，但不要照搬大留白、Hero 或字体皮肤，首屏还要保留必要证据。',
    });
    expect(brief.hardFailureFamilies).toContain('reference-surface-imitation');
    expect(brief.events.map((event) => event.id)).toContain('EVENT-20260909-SITEWIDE-APPLE-SURFACE-REPEAT');
    expect(brief.learnedPreferences.map(({ preference }) => preference.id)).toContain('PREF-FIRST-SCREEN-ATTENTION');
    expect(brief.visualReferences.some((reference) => reference.id === 'VISUAL-SITEWIDE-APPLE-SURFACE-REJECTED' && reference.tier === 'rejected')).toBe(true);
    expect(brief.visualReferences.some((reference) => reference.tier === 'silver' || reference.tier === 'golden' || reference.tier === 'current-candidate')).toBe(false);
    expect(brief.antiOvergeneralization.some((boundary) => boundary.includes('参考品牌') && boundary.includes('机械复制'))).toBe(true);
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
