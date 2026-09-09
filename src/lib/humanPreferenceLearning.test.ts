import { describe, expect, it } from 'vitest';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../data/humanPreferenceModel';
import {
  buildBlindColdRead,
  buildPreferenceCompareRead,
  goldPairIdsForContract,
  preferenceIdsForContract,
  retrieveHumanPreferenceContext,
} from './humanPreferenceLearning';
import { validateHumanPreferenceJudgeReceipt, type HumanPreferenceJudgeReceipt } from './humanPreferenceJudge';

describe('human preference learning loop', () => {
  it('retrieves attention preferences from semantic cues rather than one banned word', () => {
    const result = retrieveHumanPreferenceContext('ADHD 首屏 认知负担 多个卡片同时抢注意力', 'capability-home');
    expect(result.preferences.map(({ preference }) => preference.id)).toContain('PREF-FIRST-SCREEN-ATTENTION');
    expect(result.cases.map(({ precedent }) => precedent.id)).toEqual(expect.arrayContaining(['CASE-068', 'CASE-069']));
    expect(result.goldPairs.map(({ pair }) => pair.id)).toContain('PAIR-068-ATTENTION');
  });

  it('retrieves human-language direction for AI-like presenter and metaphor copy', () => {
    const result = retrieveHumanPreferenceContext('去 AI 味 标题 分岔 主持人 说人话');
    expect(result.preferences[0]?.preference.id).toBe('PREF-DIRECT-FACTS');
    expect(result.goldPairs.map(({ pair }) => pair.id)).toEqual(expect.arrayContaining(['PAIR-063-HEADING', 'PAIR-067-METAPHOR']));
  });

  it('retrieves fast review Preview only when the task actually mentions iterative preview/build cues', () => {
    const relevant = retrieveHumanPreferenceContext('反复改网页草稿 预览 build 太慢 Vercel 审阅', 'study-briefing', 10);
    expect(relevant.preferences.map(({ preference }) => preference.id)).toContain('PREF-FAST-REVIEW-PREVIEW');
    expect(relevant.goldPairs.map(({ pair }) => pair.id)).toContain('PAIR-085-FAST-REVIEW-PREVIEW');
    const unrelated = retrieveHumanPreferenceContext('解释一个模型参数的数学定义', 'study-briefing', 10);
    expect(unrelated.preferences.map(({ preference }) => preference.id)).not.toContain('PREF-FAST-REVIEW-PREVIEW');
  });

  it('activates recovery action-first learning only for actual recovery cues', () => {
    const recovery = retrieveHumanPreferenceContext('手机上打开故障自救页面，用户很着急而且完全失忆，怎样先恢复再看运行手册？', undefined, 10);
    expect(recovery.preferences.map(({ preference }) => preference.id)).toEqual(expect.arrayContaining([
      'PREF-RECOVERY-ACTION-FIRST',
      'PREF-FIRST-SCREEN-ATTENTION',
      'PREF-PROGRESSIVE-DISCLOSURE',
    ]));
    expect(recovery.cases.map(({ precedent }) => precedent.id)).toContain('CASE-086');

    const unrelated = retrieveHumanPreferenceContext('解释一个模型参数的数学定义和实验结果', 'study-briefing', 10);
    expect(unrelated.preferences.map(({ preference }) => preference.id)).not.toContain('PREF-RECOVERY-ACTION-FIRST');
    expect(preferenceIdsForContract('study-briefing')).not.toContain('PREF-RECOVERY-ACTION-FIRST');
  });

  it('retrieves natural mechanism wording, chart grammar, and local method context from paraphrased briefing cues', () => {
    const result = retrieveHumanPreferenceContext(
      '做一个两阶段 agent 训练汇报，解释 gating 为什么拒绝已经训练好的候选；多条模型训练曲线最好统一图例，听众没看过方法页',
      'study-briefing',
      12,
    );
    expect(result.preferences.map(({ preference }) => preference.id)).toEqual(expect.arrayContaining([
      'PREF-CONCRETE-MECHANISM-WORDING',
      'PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR',
      'PREF-BRIEFING-SELF-CONTAINED-METHOD',
    ]));
    expect(result.goldPairs.map(({ pair }) => pair.id)).toEqual(expect.arrayContaining([
      'PAIR-087-CONCRETE-MECHANISM',
      'PAIR-088-EXPERIMENT-CHART-GRAMMAR',
      'PAIR-089-BRIEFING-METHOD-CONTEXT',
    ]));
  });

  it('retrieves event-first research headings without banning meaningful result numbers', () => {
    const result = retrieveHumanPreferenceContext(
      '研究汇报标题不要先扔 7<8 或 7B 标签；先说训练没更新参数、为什么开始查，再解释 gate 和内部英文',
      'study-briefing',
      16,
    );
    expect(result.preferences.map(({ preference }) => preference.id)).toContain('PREF-EVENT-FIRST-RESEARCH-HEADINGS');
    expect(result.cases.map(({ precedent }) => precedent.id)).toContain('CASE-090');
    expect(result.goldPairs.map(({ pair }) => pair.id)).toEqual(expect.arrayContaining([
      'PAIR-090-GATE-HEADING',
      'PAIR-090-MODEL-COLON-HEADING',
      'PAIR-090-COMPOSED-STATE',
    ]));
    const preference = HUMAN_PREFERENCE_MODEL.find((item) => item.id === 'PREF-EVENT-FIRST-RESEARCH-HEADINGS');
    expect(preference?.antiOvergeneralization.join(' ')).toContain('44 个候选只有 7 个进入后续模型');
  });

  it('keeps workflow-learning feedback separate from surface aesthetics', () => {
    const result = retrieveHumanPreferenceContext('案例库 触类旁通 preference learning Gold Pair cold read judge');
    expect(result.preferences.map(({ preference }) => preference.id)).toContain('PREF-FEEDBACK-LEARNING-LOOP');
    expect(result.goldPairs.map(({ pair }) => pair.id)).toContain('PAIR-083-LEARNING-LOOP');
  });

  it('blind Phase A does not leak the Reader Contract or learned preference answers', () => {
    const blind = buildBlindColdRead('study').join('\n');
    const compare = buildPreferenceCompareRead('study').join('\n');
    expect(blind).not.toContain('同一 128 个 WebShop');
    expect(blind).not.toContain('PREF-');
    expect(blind).not.toContain('PAIR-');
    expect(blind).not.toContain('CASE-');
    expect(compare).toContain('Primary task:');
    expect(compare).toContain('PREF-');
    expect(compare).toContain('PAIR-');
  });

  it('binds each high-risk research contract to learned preferences and Gold Pairs', () => {
    for (const contractId of ['study', 'study-results', 'study-run', 'study-briefing', 'capability-home', 'capability-first-run']) {
      expect(preferenceIdsForContract(contractId).length, contractId).toBeGreaterThanOrEqual(2);
      expect(goldPairIdsForContract(contractId).length, contractId).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives ordinary public Reader Contracts a cross-site preference baseline', () => {
    expect(preferenceIdsForContract('model-detail')).toEqual(expect.arrayContaining([
      'PREF-OBJECT-FIRST',
      'PREF-DIRECT-FACTS',
      'PREF-FIRST-SCREEN-ATTENTION',
      'PREF-PROGRESSIVE-DISCLOSURE',
      'PREF-INLINE-TERMINOLOGY',
    ]));
    expect(goldPairIdsForContract('model-detail')).toEqual(expect.arrayContaining([
      'PAIR-063-HEADING',
      'PAIR-068-ATTENTION',
      'PAIR-069-VISUAL-CENTER',
    ]));
    const compare = buildPreferenceCompareRead('model-detail').join('\n');
    expect(compare).toContain('PREF-FIRST-SCREEN-ATTENTION');
    expect(compare).toContain('PAIR-068-ATTENTION');
  });

  it('requires every preference to carry evidence and an anti-overgeneralization boundary', () => {
    for (const preference of HUMAN_PREFERENCE_MODEL) {
      expect(preference.supportingCaseIds.length, preference.id).toBeGreaterThan(0);
      expect(preference.antiOvergeneralization.length, preference.id).toBeGreaterThan(0);
    }
    for (const pair of HUMAN_FEEDBACK_GOLD_PAIRS) {
      expect(pair.rejected, pair.id).not.toBe(pair.accepted);
      expect(pair.failureMechanisms.length, pair.id).toBeGreaterThan(0);
    }
  });

  it('fails closed when a judge saw the preference evidence before the blind read', () => {
    const receipt = validReceipt('study');
    receipt.blindCompletedBeforePreferenceReveal = false;
    expect(validateHumanPreferenceJudgeReceipt(receipt)).toContain('blind phase must be completed before preference/gold-pair reveal');
  });

  it('fails closed when PASS still looks rejected-like against a required Gold Pair', () => {
    const receipt = validReceipt('study');
    receipt.pairJudgments[0]!.verdict = 'rejected-like';
    expect(validateHumanPreferenceJudgeReceipt(receipt)).toContain('PASS receipt cannot be rejected-like against a Gold Pair');
  });

  it('accepts a complete exact-head PASS receipt', () => {
    expect(validateHumanPreferenceJudgeReceipt(validReceipt('study'))).toEqual([]);
  });
  it('retrieves a Gold Pair when Chinese wording is paraphrased rather than copied exactly', () => {
    const result = retrieveHumanPreferenceContext(
      '做导师汇报时别让参数数字为了冲击力占标题；手机要适应窗口，桌面保持有上限的 16:9',
      'study-briefing',
      10,
    );
    expect(result.goldPairs.some(({ pair }) => pair.id === 'PAIR-082-PARAMETER-HEADING')).toBe(true);
    expect(result.goldPairs.some(({ pair }) => pair.id === 'PAIR-082-DEVICE-SCOPE')).toBe(true);
    const devicePair = HUMAN_FEEDBACK_GOLD_PAIRS.find((pair) => pair.id === 'PAIR-082-DEVICE-SCOPE');
    expect(devicePair?.accepted).toContain('整张等比缩到 viewport 宽度');
    expect(devicePair?.accepted).toContain('无横向滚动');
  });

});

function validReceipt(contractId: string): HumanPreferenceJudgeReceipt {
  return {
    schemaVersion: 1,
    contractId,
    exactHead: 'a'.repeat(40),
    candidateUrl: 'https://example.test/review',
    reviewer: { kind: 'independent-agent', label: 'cold-reader-1' },
    blindCompletedBeforePreferenceReveal: true,
    blind: {
      about: 'A research experiment overview.',
      firstAttention: 'The experiment identity and current finding.',
      mostImportant: 'The current evidence is not yet a stable win.',
      machineLike: 'No obvious presenter language.',
      terminologyFriction: 'No forced glossary round trip.',
      competingCenters: 'One primary center.',
      hiddenBoundary: 'The comparison boundary is visible.',
      suggestedChange: 'No required change.',
      readingDesireScore: 4,
      readingDesireReason: 'The next research question is clear.',
    },
    preferenceJudgments: preferenceIdsForContract(contractId).map((preferenceId) => ({ preferenceId, verdict: 'pass', evidence: 'Visible evidence supports the learned preference.' })),
    pairJudgments: goldPairIdsForContract(contractId).map((pairId) => ({ pairId, verdict: 'accepted-like', evidence: 'The candidate follows the accepted direction.' })),
    scientificBoundary: { verdict: 'pass', evidence: 'Claim-changing caveats remain visible.' },
    unresolvedConcerns: [],
    finalVerdict: 'PASS',
    rationale: 'Blind comprehension and historical preference comparison both pass.',
  };
}
