import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const server = read('src/components/research/ServerAuthorityDiagram.astro');
const benchmarks = read('src/components/research/BenchmarkDatasetDiagram.astro');
const seed = read('src/components/research/SeedFrameworkDiagram.astro');
const openevo = read('src/components/research/OpenEvoFrameworkDiagram.astro');
const compare = read('src/components/research/SeedOpenEvoComparisonDiagram.astro');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');

describe('research architecture diagrams', () => {
  it('renders real framed, color-coded architecture instead of text-arrow prose', () => {
    for (const source of [server, benchmarks, seed, openevo, compare]) {
      expect(source).toMatch(/border(?:-top)?:/);
      expect(source).toContain('border-radius');
      expect(source).toContain('background:');
      expect(source).toMatch(/border-(?:left|top):[0-9]/);
    }
    expect(server).toContain('border-left:8px solid transparent');
    expect(compare).toContain('.flow>i:after');
    expect(openevo).toContain('.arrow i');
  });

  it('explains the scoped root and Docker authority boundary', () => {
    expect(server).toContain('dev-wangr');
    expect(server).toContain('root UID 0');
    expect(server).toContain('/var/run/docker.sock');
    expect(server).toContain('I am not the global administrator');
    expect(server).toContain('UID/GID 1001:1001');
  });

  it('models the actual WebShop and ALFWorld benchmark setup', () => {
    expect(benchmarks).toContain('1.18M');
    expect(benchmarks).toContain('12,087');
    expect(benchmarks).toContain('1,000');
    expect(benchmarks).toContain('6,910');
    expect(benchmarks).toContain('goal 0–499');
    expect(benchmarks).toContain('goal 500–end');
    expect(benchmarks).toContain('valid_seen');
    expect(benchmarks).toContain('valid_unseen');
    expect(benchmarks).toContain('Pick & Place');
    expect(benchmarks).toContain('10 × won');
  });

  it('renders dedicated SEED and OpenEvo method architectures', () => {
    for (const term of ['on-policy rollout', 'hindsight skill', 'dual-context re-score', 'GRPO + OPD']) expect(seed).toContain(term);
    for (const term of ['PROJECT HEAD', 'SEALED EVIDENCE', 'EVOLUTION METHOD', 'SUCCESSOR REVISION', 'SD-LoRA train']) expect(openevo).toContain(term);
    expect(compare).toContain('SEED vs OpenEvo');
  });

  it('keeps the reproduction guide executable and embeds the visual diagrams', () => {
    expect(guide).toContain('ServerAuthorityDiagram');
    expect(guide).toContain('AgentEnvironmentTrajectory');
    expect(guide).toContain('12 reproduction gates');
    expect(guide).toContain('run_parametric_eval.py');
    expect(guide).toContain('verify_indexes_1k.py');
  });
});
