import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/study/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/study/results.astro');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const currentState = read('../../docs/agents/current/seed-openevo-results-current-state-2026-08-26.md');

describe('SEED × OpenEvo current Track A closeout and Track B continuation state', () => {
  it('keeps the current Q7 override on both locale routes', () => {
    for (const page of [resultsPageZh, resultsPageEn]) {
      expect(page).toContain('OpenEvoWebShopCurrentQ7');
      expect(page).not.toContain("#q7 { display:none; }");
      expect(page).toContain('seed-openevo-results-current-state-2026-08-26.md');
    }
  });

  it('publishes the completed source-faithful paired measurement without claiming a stable win', () => {
    expect(currentQ7).toContain('id="q7"');
    expect(currentQ7).toContain('已完成 · 未证明稳定提升');
    expect(currentQ7).toContain('128 / 128 PASS');
    expect(currentQ7).toContain('BASE 7.17 / 3.9%');
    expect(currentQ7).toContain('SD-LoRA 8.74 / 3.9%');
    expect(currentQ7).toContain('Δ +1.57');
    expect(currentQ7).toContain('95% CI [-3.21,+6.31]');
    expect(currentQ7).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
  });

  it('keeps the validated task panel visible in human language without relabeling it as the paper-final 128', () => {
    expect(currentQ7).toContain('已核对的 128 个验证任务');
    expect(currentQ7).toContain('在 GitHub 查看固定的 128 题');
    expect(currentQ7).toContain('configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(currentQ7).toContain('128/128 表示全部任务都通过运行时语义核对');
    expect(currentQ7).toContain('论文 89.7 / 78.1% 背后的最终 128 题');
  });

  it('keeps the Hero human-readable while retaining exact continuation state in the evidence layer', () => {
    expect(hero).toContain('这 128 个任务先按 SEED 公开代码逐题核对，128/128 都确认一致');
    expect(hero).toContain('下一步是继续 OpenEvo 与 SEED 的方法对方法比较');
    expect(hero).not.toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(hero).not.toContain('final_test_status=locked');
    expect(nextSteps).toContain('同一 128 个任务的两模型测量已完成');
    expect(nextSteps).toContain('方法对方法比较等待继续授权');
    expect(nextSteps).toContain('原本漏存的训练状态也已经在不重跑 WebShop、不使用 GPU 的前提下补齐并核对通过');
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(nextSteps).toContain('c2791000a3af97190c264ba5ea39f0c4e5f65823');
  });

  it('records the latest upstream authority and the governance exception', () => {
    expect(currentState).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
    expect(currentState).toContain('c2791000a3af97190c264ba5ea39f0c4e5f65823');
    expect(currentState).toContain('measurement-not-proven-stable-improvement');
    expect(currentState).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentState).toContain('GitHub branch authority and the `main` router did **not** precede the first formal episode');
    expect(currentState).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(currentState).toContain('formal_task_consumption_allowed=false');
    expect(currentState).toContain('final_test_status=locked');
  });
});
