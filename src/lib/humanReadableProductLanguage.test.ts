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
  it('pins the heading hierarchy rule at the source-directory boundary', () => {
    expect(sourceRules).toContain('Headings name the subject');
    expect(sourceRules).toContain('Every feature and UI change must check copy');
    expect(sourceRules).toContain('../docs/agents/current/audience-centered-technical-copy.md');
    expect(sourceRules).toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
    expect(sourceRules).toContain('5×RTX5090');
    expect(sourceRules).toContain('RTX6 / 4×RTX3090');
    expect(claudeAdapter).toContain('@AGENTS.md');
    expect(claudeAdapter).toContain('new features, UI work, navigation, responsive changes, and copy changes');
  });

  it('keeps the first-screen subject concrete in both locales without turning instructions into the H1', () => {
    expect(missionHero).toContain("t('ALFWorld 与 WebShop 研究', 'ALFWorld and WebShop research')");
    expect(missionHero).toContain("t('研究总览 →','Research overview →')");
    expect(missionHero).toContain("t('研究结果','Research findings')");
    expect(missionHero).not.toContain('用 SEED 的两个 Agent 基准，检验并改进 OpenEvo');
    expect(missionHero).not.toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
  });

  it('keeps high-traffic navigation and tools concrete', () => {
    expect(header).toContain("t('流程理解图', 'Flow map')");
    expect(header).toContain("t('OpenEvo × WebShop 科学研究', 'OpenEvo × WebShop study')");
    expect(header).toContain("t('实验工作台', 'Experiment workspace')");
    expect(header).toContain("t('资料', 'Resources')");
    expect(header).not.toContain("t('研究总览', 'Research map')");
    expect(header).not.toContain("t('研究工具', 'Research tools')");
    expect(header).not.toContain('形成可保存的研究任务');
  });

  it('uses normal subject headings on methodology and paper pages', () => {
    for (const title of ['数据来源与缺失信息', '缺失值状态', '证据来源', '模型推荐边界']) expect(methodology).toContain(title);
    for (const title of ['方法摘要', '复现方式', '模型角色']) expect(paperDetail).toContain(title);
    expect(methodology).not.toContain('这些数字从哪里来，缺数据时怎么看');
    expect(paperDetail).not.toContain('这些模型在论文里分别负责什么');
    expect(workspace).toContain("'实验工作台'");
    expect(workspace).toContain('填写模型、GPU、网络、权重和训练条件');
  });

  it('keeps the durable standard and scanner aligned with the subject-heading rule', () => {
    expect(standard).toContain('Headings name the subject');
    expect(standard).toContain('标题先命名主题');
    expect(standard).toContain('ALFWorld 与 WebShop 研究');
    expect(standard).toContain('5×RTX5090');
    expect(audit).toContain('COPY-EDITORIAL-AS-HEADING');
    expect(audit).toContain('COPY-SUBJECT-TITLE-001');
    expect(audit).toContain('COPY-STATUS-002');
  });

  it('blocks rejected meta-narrative headings from returning to runtime source', () => {
    for (const file of [
      'src/components/research/SeedOpenEvoMissionHero.astro',
      'src/components/research/SeedOpenEvoResearchPageCore.astro',
      'src/components/research/AgentEnvironmentTrajectory.astro',
      'src/components/research/OpenEvoExperimentGateway.astro',
      'src/pages/_bodies/home-v2.astro',
    ]) {
      const source = read(file);
      expect(source).not.toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
      expect(source).not.toContain('把框架与基准讲成一场可追踪的对话');
      expect(source).not.toContain('用 SEED 的两个 Agent 基准，检验并改进 OpenEvo');
    }
  });
});
