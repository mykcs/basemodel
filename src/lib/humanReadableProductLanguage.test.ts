import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

const sourceRules = read('src/AGENTS.md');
const claudeAdapter = read('src/CLAUDE.md');
const standard = read('docs/agents/current/audience-centered-technical-copy.md');
const missionHero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const audit = read('scripts/audit-audience-copy.ts');

describe('human-readable product language contract', () => {
  it('pins the rule at the source-directory boundary for features and UI changes', () => {
    expect(sourceRules).toContain('Concrete action before abstract framing');
    expect(sourceRules).toContain('Every feature and UI change must check copy');
    expect(sourceRules).toContain('../docs/agents/current/audience-centered-technical-copy.md');
    expect(sourceRules).toContain('用 OpenEvo 复现 SEED 的 ALFWorld 与 WebShop 实验');
    expect(claudeAdapter).toContain('@AGENTS.md');
    expect(claudeAdapter).toContain('new features, UI work, navigation, responsive changes, and copy changes');
  });

  it('keeps the canonical first-screen wording concrete in both locales', () => {
    expect(missionHero).toContain('用 OpenEvo 复现 SEED 的 ALFWorld 与 WebShop 实验');
    expect(missionHero).toContain('Reproduce SEED’s ALFWorld and WebShop experiments with OpenEvo');
    expect(missionHero).not.toContain('用 SEED 的两个 Agent 基准，检验并改进 OpenEvo');
    expect(missionHero).not.toContain('Use SEED’s two agent benchmarks to evaluate and improve OpenEvo');
  });

  it('keeps the durable standard and scanner aligned with the rule', () => {
    expect(standard).toContain('谁用什么做什么');
    expect(standard).toContain('用 OpenEvo 复现 SEED 的 ALFWorld 与 WebShop 实验');
    expect(audit).toContain('COPY-ABSTRACT-PACKAGING');
    expect(audit).toContain('COPY-ACTION-TITLE-003');
  });

  it('blocks the two rejected abstract headings from returning to runtime source', () => {
    for (const file of [
      'src/components/research/SeedOpenEvoMissionHero.astro',
      'src/components/research/AgentEnvironmentTrajectory.astro',
      'src/components/research/OpenEvoExperimentGateway.astro',
      'src/pages/_bodies/home-v2.astro',
    ]) {
      const source = read(file);
      expect(source).not.toContain('用 SEED 的两个 Agent 基准，检验并改进 OpenEvo');
      expect(source).not.toContain('把框架与基准讲成一场可追踪的对话');
    }
  });
});
