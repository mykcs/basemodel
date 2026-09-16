import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const hero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const design = read('src/components/research/SeedOpenEvoTrainingDesignOverview.astro');

describe('Flow content-first cold-read repair', () => {
  it('defines the four named research objects at first use while preserving the fairness boundary', () => {
    for (const phrase of [
      'SEED 把任务后的成功经验继续写进模型参数',
      'OpenEvo 先封存任务证据',
      'ALFWorld（文本具身任务）',
      'WebShop（网页购物任务）',
      '条件没对齐，分数差异就不能归因于方法',
    ]) expect(hero).toContain(phrase);
  });

  it('explains Stage 1 in ordinary language instead of requiring analyzer or step-loop jargon', () => {
    expect(hub).toContain('一次 WebShop 购物任务（episode）');
    expect(hub).toContain('外部分析模型才做事后复盘');
    expect(hub).not.toContain('外部 analyzer 才能复盘');
    expect(hub).not.toContain('step loop');
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
    for (const term of ['Text Memory（文字记忆）', 'Skill Bundle（技能集合）', 'Agent System（全局行为规则）', 'SD-LoRA（参数更新）']) {
      expect(design).toContain(term);
    }
    expect(design).toContain('早期 Stage 1 / LoRA-vs-SD-LoRA 对照没有同时启用这四类状态');
    expect(design).toContain('完整系统比较只能回答两套系统总体表现有什么差异');
    expect(design).toContain('监督微调（SFT）训练配方');
    expect(design).toContain('native harness：各自负责提示、历史与动作解析');
  });

  it('uses a shared-axis table for the attribution comparison rather than two equal-weight cards', () => {
    expect(design).toContain('<table>');
    expect(design).toContain("t('比较口径', 'Comparison')");
    expect(design).toContain("t('哪些条件保持一致', 'What stays aligned')");
    expect(design).toContain("t('可以支持什么结论', 'What the result can support')");
  });
});
