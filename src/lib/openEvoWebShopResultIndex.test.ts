import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPage = read('../pages/research/seed-openevo/results.astro');
const resultIndex = read('../components/research/OpenEvoWebShopResultIndex.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const resultRoute = read('../pages/research/seed-openevo/results/[note].astro');
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
  it('keeps the results landing page navigation-only', () => {
    expect(resultsPage).toContain('OpenEvoWebShopResultIndex');
    expect(resultsPage).not.toContain('OpenEvoWebShopNarrativeReport');
    expect(resultsPage).not.toContain('OpenEvoWebShopProgramReport');
    expect(resultsPage).not.toContain('Seed3090ParametricProgress');
    expect(resultsPage).not.toContain('WebShopTrainingGuide');
    expect(resultIndex).toContain('这个页面只负责导航');
  });

  it('indexes and publishes every article in the twelve-note series', () => {
    for (const slug of noteSlugs) {
      expect(resultIndex, `${slug} missing from result index`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
  });

  it('keeps completed evidence separate from the future benchmark redesign', () => {
    expect(resultIndex).toContain('PART II');
    expect(resultIndex).toContain('按证据链读已经完成的实验');
    expect(resultIndex).toContain('PART III');
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
