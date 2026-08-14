import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const legend = read('src/components/research/ResearchDiagramLegend.astro');
const server = read('src/components/research/ServerAuthorityDiagram.astro');
const benchmarks = read('src/components/research/BenchmarkDatasetDiagram.astro');
const seed = read('src/components/research/SeedFrameworkDiagram.astro');
const openevo = read('src/components/research/OpenEvoFrameworkDiagram.astro');
const compare = read('src/components/research/SeedOpenEvoComparisonDiagram.astro');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const sourceRules = read('src/AGENTS.md');

describe('research architecture diagrams', () => {
  it('uses short subject headings while keeping the core explanation in prose', () => {
    expect(server).toContain('OpenEvo 服务器权限模型');
    expect(benchmarks).toContain('WebShop 与 ALFWorld 环境模型');
    expect(seed).toContain('SEED 自进化训练机制');
    expect(openevo).toContain('OpenEvo 跨任务演化机制');
    expect(compare).toContain('SEED 与 OpenEvo 的经验载体');
    expect(server).not.toContain('<h2 id="authority-diagram-title">{t(\'OpenEvo 服务器：权限不是一层');
    expect(benchmarks).not.toContain('Agent 到底在什么“世界”里学习');
  });

  it('uses a shared semantic visual grammar instead of decorative color', () => {
    for (const term of [
      'Environment / observation',
      'Experience / hindsight',
      'Training signal / loss',
      'Model / agent state',
      'Validated persistent state',
      'data / state flow',
      'control / authority / reference',
    ]) expect(legend).toContain(term);
    for (const source of [server, benchmarks, seed, openevo, compare]) {
      expect(source).toContain('ResearchDiagramLegend');
      expect(source).toContain('--env:#2563eb');
      expect(source).toContain('--experience:#d97706');
      expect(source).toContain('--signal:#dc2626');
      expect(source).toContain('--state:#7c3aed');
      expect(source).toContain('--persist:#059669');
    }
  });

  it('uses browser-native vector geometry for branch, merge, feedback, and authority relations', () => {
    for (const source of [server, benchmarks, seed, openevo, compare]) {
      expect(source).toContain('<svg');
      expect(source).toContain('viewBox=');
      expect(source).toContain('<marker');
      expect(source).toContain('<path');
      expect(source).toContain('marker-end=');
    }
    expect(server).toContain('stroke-dasharray');
    expect(benchmarks).toContain('feedback');
    expect(seed).toContain('reward-branch');
    expect(openevo).toContain('branch');
    expect(compare).toContain('fork-wires');
  });

  it('explains the server as sibling containers controlled through the host daemon', () => {
    for (const term of [
      'OpenEvo Server Host',
      'Docker daemon',
      'dev-wangr',
      'root UID 0',
      '/var/run/docker.sock',
      'isolated experiment container',
      'UID/GID 1001:1001',
      'SIBLING USERS',
      'daemon creates sibling container',
      'I am not the global administrator',
    ]) expect(server).toContain(term);
    for (const route of [guide, labZh, labEn]) expect(route).toContain('ServerAuthorityDiagram');
  });

  it('teaches WebShop and ALFWorld as interactive world models, not dataset names alone', () => {
    for (const term of ['1.18M', '12,087', '1,000', 'goal 0–499', 'goal 500–end', 'task_score ∈ [0,1]']) expect(benchmarks).toContain(term);
    for (const term of ['train / valid_seen / valid_unseen', 'AlfredTWEnv', 'Pick & Place', '10 × won']) expect(benchmarks).toContain(term);
    expect(benchmarks).toContain('state transition');
    expect(benchmarks).toContain('new observation feeds the next step');
  });

  it('makes the SEED core idea visually explicit', () => {
    for (const term of [
      'on-policy trajectory',
      'same sampled action tokens',
      'plain-context re-score',
      'skill-context re-score',
      'log p<sub>plain</sub>',
      'log p<sub>skill</sub>',
      'OPD',
      'GRPO',
      'policy θ<sub>t+1</sub>',
      'same checkpoint',
    ]) expect(seed).toContain(term);
    expect(seed).toContain('The next round’s actor and analyzer');
    expect(seed).toContain('prefers-reduced-motion:reduce');
  });

  it('makes OpenEvo a carrier framework rather than equating it with SD-LoRA', () => {
    for (const term of [
      'SEALED EVIDENCE',
      'EVOLUTION METHOD',
      'MEMORY',
      'AGENT ARTIFACT',
      'PARAMETRIC ADAPTER',
      'VALIDATION GATE',
      'SUCCESSOR REVISION',
      'SD-LoRA parametric path',
    ]) expect(openevo).toContain(term);
    expect(openevo).toContain('only one carrier allowed by OpenEvo');
    expect(openevo).toContain('seal first, evolve second');
  });

  it('compares SEED and OpenEvo by where experience persists', () => {
    expect(compare).toContain('SHARED EXPERIENCE');
    expect(compare).toContain('Core fork question');
    expect(compare).toContain('Where does this experience ultimately live?');
    expect(compare).toContain('memory / artifact / adapter');
    expect(compare).toContain('updated policy checkpoint');
    expect(compare).toContain('too simple');
  });

  it('keeps optional technical depth native, static, and reduced-motion safe', () => {
    for (const source of [server, benchmarks, seed, openevo, compare]) expect(source).toContain('<details class="technical-details">');
    for (const source of [server, benchmarks, seed, openevo]) expect(source).toContain('@media(prefers-reduced-motion:reduce)');
    expect(sourceRules).toContain('Shared research-diagram visual grammar');
    expect(sourceRules).toContain('inline SVG');
    expect(sourceRules).toContain('Beginner-first semantic contract');
    expect(sourceRules).toContain('solid connector');
    expect(sourceRules).toContain('dashed connector');
  });

  it('keeps the reproduction guide executable while the diagrams explain the mental model', () => {
    expect(guide).toContain('AgentEnvironmentTrajectory');
    expect(guide).toContain('12 reproduction gates');
    expect(guide).toContain('run_parametric_eval.py');
    expect(guide).toContain('verify_indexes_1k.py');
  });
});
