import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const header = read('src/components/Header.astro');
const conceptIndex = read('src/components/research/ResearchConceptIndex.astro');
const trajectory = read('src/components/research/AgentEnvironmentTrajectory.astro');
const gateway = read('src/components/research/OpenEvoExperimentGateway.astro');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');
const detailCore = read('src/components/research/SeedOpenEvoResearchPageCore.astro');
const benchmarkZh = read('src/pages/research/seed-openevo/benchmarks.astro');
const benchmarkEn = read('src/pages/en/research/seed-openevo/benchmarks.astro');
const webshopZh = read('src/pages/research/seed-openevo/webshop.astro');
const webshopEn = read('src/pages/en/research/seed-openevo/webshop.astro');
const alfworldZh = read('src/pages/research/seed-openevo/alfworld.astro');
const alfworldEn = read('src/pages/en/research/seed-openevo/alfworld.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const openevoZh = read('src/pages/research/seed-openevo/openevo.astro');
const openevoEn = read('src/pages/en/research/seed-openevo/openevo.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');

describe('research journey experience', () => {
  it('keeps the global navigation focused on the research journey', () => {
    expect(header).toContain("t('流程理解图', 'Flow map')");
    expect(header).toContain("t('OpenEvo × WebShop 科学研究', 'OpenEvo × WebShop study')");
  });

  it('gives each true step-by-step explainer one canonical bilingual route', () => {
    for (const [source, kind] of [
      [seedZh, 'seed'], [seedEn, 'seed'],
      [openevoZh, 'openevo'], [openevoEn, 'openevo'],
      [webshopZh, 'webshop'], [webshopEn, 'webshop'],
      [alfworldZh, 'alfworld'], [alfworldEn, 'alfworld'],
      [labZh, 'server'], [labEn, 'server'],
    ] as const) {
      expect(source).toContain('InteractiveResearchExplainer');
      expect(source).toContain(`kind="${kind}"`);
      expect(source).toContain('client:visible');
    }
  });

  it('keeps the loops comparison canonical-only instead of duplicating a second player', () => {
    for (const source of [loopsZh, loopsEn]) {
      expect(source).toContain('SeedOpenEvoCanonicalFigure');
      expect(source).not.toContain('InteractiveResearchExplainer');
      expect(source).not.toContain('kind="compare"');
      expect(source).not.toContain('client:visible');
    }
  });

  it('keeps experiment and reproduction pages as reference indexes instead of duplicating full figures', () => {
    expect(trajectory).toContain('ResearchConceptIndex');
    expect(trajectory).not.toContain('InteractiveResearchExplainer');
    expect(trajectory).not.toContain('BenchmarkDatasetDiagram');
    expect(trajectory).not.toContain('AlfworldTaskFamilies');
    expect(gateway).toContain('AgentEnvironmentTrajectory');
    expect(guide).toContain('AgentEnvironmentTrajectory');
    expect(guide).not.toContain('InteractiveResearchExplainer');
    for (const route of ['/research/seed-openevo/seed/', '/research/seed-openevo/openevo/', '/research/seed-openevo/webshop/', '/research/seed-openevo/alfworld/', '/research/seed-openevo/loops/']) {
      expect(conceptIndex).toContain(route);
    }
    expect(conceptIndex).toContain('/lab/');
  });

  it('keeps the benchmark overview comparative and gives environment links one owner', () => {
    for (const source of [benchmarkZh, benchmarkEn]) {
      expect(source).toContain('page="benchmarks"');
      expect(source).not.toContain('benchmark-route-links');
      expect(source).not.toContain('AgentEnvironmentTrajectory');
      expect(source).not.toContain('InteractiveResearchExplainer');
      expect(source).not.toContain('BenchmarkDatasetDiagram');
    }
    expect(detailCore).toContain('benchmark-detail-links');
    expect(detailCore).toContain('/research/seed-openevo/webshop/');
    expect(detailCore).toContain('/research/seed-openevo/alfworld/');
  });

  it('does not cross-mount WebShop and ALFWorld explainers on their dedicated pages', () => {
    expect(webshopZh).toContain('kind="webshop"');
    expect(webshopEn).toContain('kind="webshop"');
    expect(webshopZh).not.toContain('kind="alfworld"');
    expect(webshopEn).not.toContain('kind="alfworld"');
    expect(alfworldZh).toContain('kind="alfworld"');
    expect(alfworldEn).toContain('kind="alfworld"');
    expect(alfworldZh).not.toContain('kind="webshop"');
    expect(alfworldEn).not.toContain('kind="webshop"');
  });

  it('preserves a compact bilingual concept index rather than a second explanatory article', () => {
    expect(conceptIndex).toContain("t('原理索引', 'Concept index')");
    expect(conceptIndex).toContain("t('方法与环境参考', 'Method and environment references')");
    expect(conceptIndex).not.toContain('完整流程图只保留在各自的专门页面');
    expect(conceptIndex).not.toContain('Full process figures live only on their dedicated pages');
    expect(conceptIndex).not.toContain('让当前页面继续承担');
    expect(conceptIndex).not.toContain('client:visible');
  });
});
