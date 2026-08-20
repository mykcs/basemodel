import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const header = read('../components/Header.astro');
const trajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const benchmarkDiagram = read('../components/research/BenchmarkDatasetDiagram.astro');
const comparison = read('../components/research/SeedOpenEvoComparisonDiagram.astro');
const gateway = read('../components/research/OpenEvoExperimentGateway.astro');
const state = read('./openEvoScientificState.ts');
const benchmarkZh = read('../pages/research/seed-openevo/benchmarks.astro');
const benchmarkEn = read('../pages/en/research/seed-openevo/benchmarks.astro');
const webshopZh = read('../pages/research/seed-openevo/webshop.astro');
const webshopEn = read('../pages/en/research/seed-openevo/webshop.astro');
const alfworldZh = read('../pages/research/seed-openevo/alfworld.astro');
const alfworldEn = read('../pages/en/research/seed-openevo/alfworld.astro');
const experimentZh = read('../pages/research/seed-openevo/experiment.astro');
const experimentEn = read('../pages/en/research/seed-openevo/experiment.astro');

describe('three-journey research experience', () => {
  it('keeps the global navigation centered on the two research surfaces plus More', () => {
    for (const label of ['流程理解图', 'OpenEvo × WebShop 科学研究', "t('更多', 'More')"]) expect(header).toContain(label);
    expect(header).toContain('journey-nav');
    expect(header).toContain('mobile-journeys');
    expect(header).toContain('/research/seed-openevo/experiment/');
    expect(header).toContain('/research/seed-openevo/seed/');
    expect(header).toContain('/research/seed-openevo/openevo/');
    expect(header).toContain('/research/seed-openevo/webshop/');
    expect(header).toContain('/research/seed-openevo/alfworld/');
  });

  it('keeps both benchmark data flows visible as real architecture diagrams', () => {
    expect(trajectory).toContain('BenchmarkDatasetDiagram');
    expect(benchmarkDiagram).toContain('WebShop');
    expect(benchmarkDiagram).toContain('ALFWorld');
    expect(benchmarkDiagram).toContain('WebShop 与 ALFWorld 环境模型');
    expect(benchmarkDiagram).toContain('1.18M');
    expect(benchmarkDiagram).toContain('valid_seen');
    expect(benchmarkDiagram).toContain('scene-wires');
    expect(benchmarkDiagram).toContain('state transition');
    expect(benchmarkDiagram).toContain('new observation feeds the next step');
  });

  it('keeps SEED and OpenEvo downstream processing explicit without text-arrow-only diagrams', () => {
    expect(comparison).toContain('hindsight skill');
    expect(comparison).toContain('OPD + GRPO');
    expect(comparison).toContain('sealed evidence');
    expect(comparison).toContain('successor revision');
    expect(comparison).toContain('fork-wires');
    expect(comparison).toContain('marker-end=');
  });

  it('exposes a bilingual OpenEvo gateway without freezing live state into the static page', () => {
    expect(experimentZh).toContain('OpenEvoExperimentGateway');
    expect(experimentEn).toContain('OpenEvoExperimentGateway');
    expect(gateway).toContain('历史证据 · Phase G');
    expect(gateway).toContain('Historical evidence · Phase G');
    expect(gateway).toContain('openEvoScientificState.defaultBranchSnapshot.phase');
    expect(state).toContain("phase: 'H1.27'");
    expect(gateway).toContain('current-campaign');
    expect(gateway).toContain('reconciliation');
    expect(gateway).toContain('actual branch');
    expect(state).toContain('active scientific branch may be ahead');
    expect(gateway).not.toContain('Current experiment allocation: 5× RTX 5090');
    expect(gateway).not.toContain('当前阶段</small><strong>Phase H0</strong>');
    expect(benchmarkZh).toContain('AgentEnvironmentTrajectory');
    expect(benchmarkEn).toContain('AgentEnvironmentTrajectory');
  });
  it('keeps dedicated bilingual environment explainers isolated by subject', () => {
    for (const page of [webshopZh, webshopEn]) {
      expect(page).toContain('kind="webshop"');
      expect(page).not.toContain('kind="alfworld"');
    }
    for (const page of [alfworldZh, alfworldEn]) {
      expect(page).toContain('kind="alfworld"');
      expect(page).not.toContain('kind="webshop"');
    }
    for (const page of [benchmarkZh, benchmarkEn]) {
      expect(page).toContain('/research/seed-openevo/webshop/');
      expect(page).toContain('/research/seed-openevo/alfworld/');
    }
  });
});
