import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/results.astro');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const currentState = read('../../docs/agents/current/seed-openevo-results-current-state-2026-08-26.md');

describe('SEED × OpenEvo corrected source-faithful current state', () => {
  it('replaces the visible stale Q7 on both locale routes', () => {
    for (const page of [resultsPageZh, resultsPageEn]) {
      expect(page).toContain('OpenEvoWebShopCurrentQ7');
      expect(page).toContain("#q7 { display:none; }");
      expect(page).toContain('seed-openevo-results-current-state-2026-08-26.md');
    }
  });

  it('states the corrected fail-closed gate without publishing a new BASE-vs-SD result', () => {
    expect(currentQ7).toContain('已重建并纠错 · 等待 128/128 运行时验证');
    expect(currentQ7).toContain('第二次 worker-seed reseed');
    expect(currentQ7).toContain('PREPARED · formal_task_consumption_allowed=false');
    expect(currentQ7).toContain('authoritative WebshopWorker runtime semantic validation 128/128');
    expect(currentQ7).toContain('这里仍然没有新的 BASE-vs-SD 科学结果');
    expect(currentQ7).toContain('af89bb5c39aeab8aaa04eed57585c91e5598a968');
  });

  it('surfaces an immutable teacher-facing link to the corrected 128-task manifest', () => {
    expect(currentQ7).toContain('当前冻结的 128 题');
    expect(currentQ7).toContain('在 GitHub 查看固定的 128 题');
    expect(currentQ7).toContain('configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(currentQ7).toContain('128/128 runtime semantic validation 仍未完成');
    expect(currentQ7).toContain('不把它称为论文最终 128 题');
  });

  it('advances the first-screen and next-step copy from rebuilding to validating', () => {
    expect(hero).toContain('旧版本被作废并重新生成');
    expect(hero).toContain('当前 corrected manifest 处于 PREPARED');
    expect(hero).toContain('authoritative WebshopWorker runtime semantic validation 128/128');
    expect(nextSteps).toContain('先验证纠错后的 128 题真的和 SEED 官方运行路径一致');
    expect(nextSteps).toContain('第一版 manifest 因 SimServer reseed 语义遗漏而被 superseded');
    expect(nextSteps).toContain('当前不能发布新的 BASE-vs-SD 结果');
  });

  it('records that the newer state addendum overrides the older executing-formal-run snapshot', () => {
    expect(currentState).toContain('this file is newer and wins');
    expect(currentState).toContain('formal_task_consumption_allowed=false');
    expect(currentState).toContain('next fail-closed gate is authoritative `WebshopWorker` runtime semantic validation at `128/128`');
    expect(currentState).toContain('The new Track A work changes the confidence in **task semantics for the next comparison**');
  });
});
