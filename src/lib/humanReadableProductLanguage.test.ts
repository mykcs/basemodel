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
const workspacePage = read('src/pages/workspace/index.astro');
const audit = read('scripts/audit-audience-copy.ts');
const firstRun = read('src/components/research/OpenEvoFirstRunMap.astro');
const orientation = read('src/components/research/ResearchOrientation.astro');

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
    expect(missionHero).toContain("t('OpenEVO 阶段汇报 →','OpenEVO progress briefing →')");
    expect(missionHero).toContain("href={p('/research/seed-openevo/study/briefing/')}");
    expect(missionHero).toContain("t('研究总览','Research overview')");
    expect(missionHero).toContain("href:p('/research/seed-openevo/study/results/')");
    expect(missionHero).not.toContain("t('研究结果','Research findings')");
    expect(missionHero).not.toContain('用 SEED 的两个 Agent 基准，检验并改进 OpenEvo');
    expect(missionHero).not.toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
  });

  it('keeps the first-run model comparison literal and allows decorative eyebrows to be omitted', () => {
    expect(firstRun).toContain('3B 和 7B 的第一轮实验');
    expect(firstRun).toContain('7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。');
    expect(firstRun).toContain('layout="focus"');
    expect(firstRun).not.toContain('第一轮购物学习：7B 与 3B 的分岔');
    expect(firstRun).not.toContain('HISTORICAL MAP · FIRST RUN');
    expect(firstRun).not.toContain('关卡说明');
    expect(orientation).toContain('eyebrow?: string;');
  });

  it('keeps high-traffic navigation and tools concrete', () => {
    expect(header).toContain("t('流程理解图', 'Flow map')");
    expect(header).toContain("t('OpenEVO Harness · WebShop', 'OpenEVO Harness · WebShop')");
    expect(header).toContain("t('实验工作台', 'Experiment workspace')");
    expect(header).toContain("t('资料', 'Resources')");
    expect(header).not.toContain("t('研究总览', 'Research map')");
    expect(header).not.toContain("t('研究工具', 'Research tools')");
    expect(header).not.toContain('形成可保存的研究任务');
  });

  it('uses normal subject headings on methodology, paper, and workspace pages', () => {
    for (const title of ['数据来源与缺失信息', '缺失值状态', '证据来源', '模型推荐边界']) expect(methodology).toContain(title);
    for (const title of ['方法摘要', '复现方式', '模型角色']) expect(paperDetail).toContain(title);
    expect(methodology).not.toContain('这些数字从哪里来，缺数据时怎么看');
    expect(paperDetail).not.toContain('这些模型在论文里分别负责什么');
    expect(workspacePage).toContain('<h1>实验工作台</h1>');
    expect(workspacePage).toContain('先定义研究目标、模型角色和资源限制');
    expect(workspacePage).toContain('开始填写实验条件');
  });

  it('keeps the durable standard and scanner aligned with the subject-heading rule', () => {
    expect(standard).toContain('Headings name the subject');
    expect(standard).toContain('标题先命名主题');
    expect(standard).toContain('ALFWorld 与 WebShop 研究');
    expect(standard).toContain('5×RTX5090');
    expect(audit).toContain('COPY-EDITORIAL-AS-HEADING');
    expect(audit).toContain('COPY-NARRATIVE-FORK');
    expect(audit).toContain('COPY-STATIC-ENGLISH-EYEBROW');
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