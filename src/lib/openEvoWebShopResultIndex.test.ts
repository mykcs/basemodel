import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPage = read('../pages/research/seed-openevo/results.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const resultIndex = read('../components/research/OpenEvoWebShopResultIndex.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const resultRoute = read('../pages/research/seed-openevo/results/[note].astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const sitemap = read('./sitemapRoutes.ts');

const noteSlugs = [
  'webshop-training',
  'seed-training',
  'openevo-training',
  'why-it-kept-failing',
  'first-positive-transfer',
  'independent-replication',
  'second-generation',
  'measurement-boundary',
  'current-conclusion',
  'benchmark-first',
  'seed-faithful-benchmark',
  'openevo-benchmark-design',
] as const;

describe('OpenEvo × WebShop result article index', () => {
  it('keeps the results landing page focused on experiment evidence and canonical references', () => {
    expect(resultsPage).toContain('OpenEvoWebShopResultIndex');
    expect(resultsPage).not.toContain('OpenEvoWebShopNarrativeReport');
    expect(resultsPage).not.toContain('OpenEvoWebShopProgramReport');
    expect(resultsPage).not.toContain('Seed3090ParametricProgress');
    expect(resultsPage).not.toContain('WebShopTrainingGuide');
    expect(researchDetail).toContain("title: t('OpenEvo × WebShop 实验结果目录', 'OpenEvo × WebShop experiment evidence index')");
    expect(researchDetail).toContain('WebShop、SEED 与 OpenEvo 的背景和机制由各自的正式页面统一解释');
    expect(researchDetail).not.toContain('H1.40 established E2 supply and G2 construction');
    expect(resultIndex).toContain('实验结果页只讲实验');
    expect(resultIndex).toContain('/research/seed-openevo/webshop/');
    expect(resultIndex).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(resultIndex).toContain('/research/seed-openevo/openevo/');
    expect(resultIndex).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
    expect(resultIndex).toContain('/papers/seed/');
  });

  it('preserves all twelve historical result-note URLs while moving the first three primers to canonical pages', () => {
    for (const slug of noteSlugs) {
      expect(resultIndex, `${slug} missing from result index or legacy links`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('一个概念只保留一个 canonical explanation');
    expect(primerMoved).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
  });

  it('keeps completed evidence separate from the future benchmark redesign', () => {
    expect(resultIndex).toContain('PART I');
    expect(resultIndex).toContain('按证据链读已经完成的实验');
    expect(resultIndex).toContain('PART II');
    expect(resultIndex).toContain('把主问题重新拉回 Benchmark');
    expect(benchmarkNote).toContain('这是下一阶段的 benchmark 设计与研究重分层，不是已经完成的实验结果');
    expect(benchmarkNote).toContain('Vanilla vs OpenEvo-Native-Sparse');
    expect(benchmarkNote).toContain('19,200 WebShop episodes');
    expect(benchmarkNote).toContain('test episode 之间也禁止更新 memory、adapter 或 policy');
  });

  it('keeps H1.42 as a measurement-boundary article rather than a transfer claim', () => {
    expect(resultNote).toContain("'measurement-boundary'");
    expect(resultNote).toContain('MVD0 REMEASUREMENT_INVALID');
    expect(resultNote).toContain('H1.40、H1.41、H1.42 的 T2 都保持关闭');
    expect(resultNote).toContain('不能支持 magnitude-reset mechanism effect');
  });
});
