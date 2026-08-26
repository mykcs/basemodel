import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/results.astro');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const currentState = read('../../docs/agents/current/seed-openevo-results-current-state-2026-08-26.md');

describe('SEED × OpenEvo current Track A closeout and Track B continuation state', () => {
  it('keeps the current Q7 override on both locale routes', () => {
    for (const page of [resultsPageZh, resultsPageEn]) {
      expect(page).toContain('OpenEvoWebShopCurrentQ7');
      expect(page).toContain("#q7 { display:none; }");
      expect(page).toContain('seed-openevo-results-current-state-2026-08-26.md');
    }
  });

  it('publishes the completed source-faithful paired measurement without claiming a stable win', () => {
    expect(currentQ7).toContain('已完成 · 未证明稳定提升');
    expect(currentQ7).toContain('128 / 128 PASS');
    expect(currentQ7).toContain('BASE 7.17 / 3.9%');
    expect(currentQ7).toContain('SD-LoRA 8.74 / 3.9%');
    expect(currentQ7).toContain('Δ +1.57');
    expect(currentQ7).toContain('95% CI [-3.21,+6.31]');
    expect(currentQ7).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
  });

  it('keeps the validated task panel visible without relabeling it as the paper-final 128', () => {
    expect(currentQ7).toContain('已验证的源码忠实 128 题');
    expect(currentQ7).toContain('在 GitHub 查看固定的 128 题');
    expect(currentQ7).toContain('configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(currentQ7).toContain('运行时语义验证已经 128/128 PASS');
    expect(currentQ7).toContain('论文 89.7 / 78.1% 背后的最终 128 题');
  });

  it('advances the Hero and Next Steps to Track A closeout and Track B barrier state', () => {
    expect(hero).toContain('source-faithful Track A 先通过 authoritative runtime semantic validation 128/128');
    expect(hero).toContain('GEN28_COMPLETE_STATE_BARRIER_MISSING');
    expect(hero).toContain('final_test_status=locked');
    expect(nextSteps).toContain('Track A 已经闭环：有效测量，但没有稳定胜出');
    expect(nextSteps).toContain('真正剩下的主问题是 Track B / WB1，但当前不能直接续跑');
    expect(nextSteps).toContain('latest adoptable native state 仍是 state-v27');
    expect(nextSteps).toContain('17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d');
  });

  it('records the latest upstream authority and the governance exception', () => {
    expect(currentState).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
    expect(currentState).toContain('17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d');
    expect(currentState).toContain('measurement-not-proven-stable-improvement');
    expect(currentState).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentState).toContain('GitHub branch authority and the `main` router did **not** precede the first formal episode');
    expect(currentState).toContain('GEN28_COMPLETE_STATE_BARRIER_MISSING');
    expect(currentState).toContain('formal_task_consumption_allowed=false');
    expect(currentState).toContain('final_test_status=locked');
  });
});
