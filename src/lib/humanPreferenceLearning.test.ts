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
