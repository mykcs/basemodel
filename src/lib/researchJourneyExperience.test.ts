import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const header = read('../components/Header.astro');
const trajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
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

  it('keeps both benchmark data flows visible with normal subject headings', () => {
    expect(trajectory).toContain("name:'WebShop'");
    expect(trajectory).toContain("name:'ALFWorld'");
    expect(trajectory).toContain('WebShop 与 ALFWorld 数据流');
    expect(trajectory).toContain('trajectory-lab');
    expect(trajectory).toContain('normalized score and exact success');
    expect(trajectory).toContain('task success and failure traces');
  });

  it('keeps SEED and OpenEvo downstream processing explicit', () => {
    expect(trajectory).toContain('trajectory → hindsight skill → GRPO + OPD → policy update');
    expect(trajectory).toContain('sealed trajectory → evolution method → artifact / adapter → successor revision');
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
