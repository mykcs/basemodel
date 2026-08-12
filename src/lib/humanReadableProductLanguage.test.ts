import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

const sourceRules = read('src/AGENTS.md');
const claudeAdapter = read('src/CLAUDE.md');
const standard = read('docs/agents/current/audience-centered-technical-copy.md');
const missionHero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const header = read('src/components/Header.astro');
const methodology = read('src/pages/methodology.astro');
const paperDetail = read('src/pages/_bodies/paper-detail.astro');
const workspace = read('src/components/workspace/ResearchWorkspace.tsx');
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

  it('keeps high-traffic navigation and tools concrete', () => {
    expect(header).toContain("t('实验总览', 'Experiment overview')");
    expect(header).toContain("t('实验工作台', 'Experiment workspace')");
    expect(header).toContain("t('更多工具', 'More tools')");
    expect(header).not.toContain("t('研究总览', 'Research map')");
    expect(header).not.toContain("t('研究工具', 'Research tools')");
    expect(header).not.toContain('形成可保存的研究任务');
  });

  it('states what methodology, paper, and workspace pages actually show', () => {
    expect(methodology).toContain('这些数字从哪里来，缺数据时怎么看');
    expect(methodology).toContain('没有数据时，页面怎样显示');
    expect(paperDetail).toContain('这些模型在论文里分别负责什么');
    expect(paperDetail).toContain('选择要怎样复现这篇论文');
    expect(workspace).toContain("'实验工作台'");
    expect(workspace).toContain('填写模型、GPU、网络、权重和训练条件');
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
