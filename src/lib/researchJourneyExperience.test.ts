import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const header = read('../components/Header.astro');
const trajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const benchmarkDiagram = read('../components/research/BenchmarkDatasetDiagram.astro');
const comparison = read('../components/research/SeedOpenEvoComparisonDiagram.astro');
const gateway = read('../components/research/OpenEvoExperimentGateway.astro');
const benchmarkZh = read('../pages/research/seed-openevo/benchmarks.astro');
const benchmarkEn = read('../pages/en/research/seed-openevo/benchmarks.astro');
const experimentZh = read('../pages/research/seed-openevo/experiment.astro');
const experimentEn = read('../pages/en/research/seed-openevo/experiment.astro');

describe('three-journey research experience', () => {
  it('keeps the global navigation centered on the enduring user goals', () => {
    for (const label of ['复现 SEED', 'OpenEvo 实验', '相关知识']) expect(header).toContain(label);
    expect(header).toContain('journey-nav');
    expect(header).toContain('mobile-journeys');
    expect(header).toContain('/research/seed-openevo/experiment/');
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

  it('exposes the current bilingual OpenEvo gateway and current campaign stage', () => {
    expect(experimentZh).toContain('OpenEvoExperimentGateway');
    expect(experimentEn).toContain('OpenEvoExperimentGateway');
    expect(gateway).toContain('Phase G');
    expect(gateway).toContain('Phase H0');
    expect(gateway).toContain('5× RTX 5090');
    expect(gateway).not.toContain('V0 ↔ O1');
    expect(benchmarkZh).toContain('AgentEnvironmentTrajectory');
    expect(benchmarkEn).toContain('AgentEnvironmentTrajectory');
  });
});
