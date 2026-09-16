import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const hero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const design = read('src/components/research/SeedOpenEvoTrainingDesignOverview.astro');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');

describe('Flow content-first cold-read repair', () => {
  it('defines the four named research objects at first use while preserving the fairness boundary', () => {
    for (const phrase of [
      'SEED 与 OpenEvo：同模型同任务的学习对照实验',
      'SEED 把成功经验写回模型参数',
      'OpenEvo 先保存任务证据',
      'ALFWorld（文本具身任务）',
      'WebShop（网页购物任务）',
      '完整系统对照只能比较总体表现',
    ]) expect(hero).toContain(phrase);
  });

  it('explains Stage 1 in ordinary language instead of requiring analyzer or step-loop jargon', () => {
    expect(hub).toContain('下面用 WebShop 展开两阶段');
    expect(hub).toContain('MiniMax（外部复盘模型）只回看已保存轨迹，不替 Qwen 选动作');
    expect(hub).toContain('不自动代表 ALFWorld 使用同一交互流程');
    expect(hub).not.toContain('外部 analyzer 才能复盘');
    expect(hub).not.toContain('step loop');
    expect(hub.indexOf('id="questions"')).toBeLessThan(hub.indexOf('id="training-design"'));
    expect(hub).toContain('具体优化方法留到 SEED 方法页');
    expect(hub).not.toContain('OPD / GRPO 的具体做法留到 SEED 方法页');
  });


  it('does not manufacture a full-screen gap and keeps mobile research navigation discoverable without a clipped strip', () => {
    expect(hero).not.toContain('min-height:min(34rem,calc(100svh - 9rem))');
    expect(hero).not.toContain('先看研究对象与比较条件 ↓');
    expect(hero).toContain('持续学习中分别更新文字记忆、可复用技能、行为规则和 LoRA（只训练少量适配参数）');
    expect(nav).toContain('research-navigation__mobile');
    expect(nav).toContain("t('相关页面', 'Related pages')");
    expect(nav).toContain('.research-navigation__identity,.research-navigation__links{display:none}');
    expect(nav).toContain('min-height:44px');
  });

  it('keeps causal attribution visible without opening a disclosure', () => {
    const comparison = design.indexOf('data-learning-comparison-scope');
    const technicalDisclosure = design.indexOf('<ResearchTechnicalDisclosure');
    expect(comparison).toBeGreaterThan(0);
    expect(comparison).toBeLessThan(technicalDisclosure);
    expect(design).toContain('只能比较两个完整系统的总体表现，不能把全部差异单独归因于 Stage 2 学习器');
    expect(design).toContain('只有这种共同起点的对照，才允许把后续差异收窄到 Stage 2 学习器');
    expect(design).not.toContain("summary={t('完整系统比较和 learner 对照有什么区别？'");
  });

  it('connects Stage 1 evidence to the later four-state Stage 2 without rewriting early experiments', () => {
    for (const term of ['文字记忆、技能、全局行为规则或 LoRA 参数的新版本', '每一类状态都有实验开始前固定的更新条件', '最后采用的版本才装入下一批任务']) {
      expect(design).toContain(term);
    }
    expect(design).toContain('早期 Stage 1 / LoRA-vs-SD-LoRA 对照没有同时启用这四类状态');
    expect(design).toContain('完整系统比较只能回答两套系统总体表现有什么差异');
    expect(design).toContain('监督微调（SFT）训练配方');
    expect(design).toContain('各自的提示、历史与动作解析层');
    expect(design).not.toContain('native harness：');
  });

  it('uses a shared-axis table for the attribution comparison rather than two equal-weight cards', () => {
    expect(design).toContain('<table>');
    expect(design).toContain("t('比较口径', 'Comparison')");
    expect(design).toContain("t('哪些条件保持一致', 'What stays aligned')");
    expect(design).toContain("t('可以支持什么结论', 'What the result can support')");
  });
});
