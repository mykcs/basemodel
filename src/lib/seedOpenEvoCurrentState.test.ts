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

  it('keeps the validated task panel visible without relabeling it as the paper-final 128', () => {
    expect(currentQ7).toContain('已验证的源码忠实 128 题');
    expect(currentQ7).toContain('在 GitHub 查看固定的 128 题');
    expect(currentQ7).toContain('configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(currentQ7).toContain('128/128 表示全部 128 个任务槽位都通过运行时语义核对');
    expect(currentQ7).toContain('论文 89.7 / 78.1% 背后的最终 128 题');
  });

  it('advances the Hero and Next Steps to Track A closeout and Track B barrier state', () => {
    expect(hero).toContain('128/128 表示计划的 128 个任务槽位全部核对通过');
    expect(hero).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(hero).toContain('final_test_status=locked');
    expect(nextSteps).toContain('7B 基础模型与 OpenEVO：128 个 WebShop 任务已完成，未证明稳定优势');
    expect(nextSteps).toContain('连续学习实验：第 28 代状态已补齐，第 29 代尚未获准执行');
    expect(nextSteps).toContain('第 28 代的 state-v28 已补齐、通过状态门并被正式采用');
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
