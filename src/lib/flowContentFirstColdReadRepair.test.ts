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
      '同一个 Qwen、同一批任务，只比较怎么学习',
      'ALFWorld 是文本具身任务',
      'WebShop 是网页购物任务',
      '只比较第二阶段学习器时，两边必须从同一个模型参数快照（checkpoint）出发',
      '共享同一批第一阶段轨迹、任务后复盘和训练配方',
      'SEED 是把成功经验写回模型参数的基线',
      'OpenEvo 是先保存任务证据、再更新文字经验',
      '否则只能比较两个完整系统',
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
    expect(hub).toContain('class="object-map__fact"');
    expect(hub).not.toContain("Qwen2.5-3B-Instruct', body:t('固定同一版模型参数（checkpoint，也就是模型参数快照）、数值精度和运行设置。','Pin the same model-parameter snapshot (checkpoint), numerical precision, and runtime settings.'), href:");
     expect(hub).toContain('aria-labelledby="research-objects-title"');
    expect(hub).toContain('<strong id="research-objects-title">');
    expect(hub).not.toContain("<h2>{t('研究对象', 'Research objects')}</h2>");
  });


  it('does not manufacture a full-screen gap and keeps mobile research navigation discoverable without a clipped strip', () => {
    expect(hero).not.toContain('min-height:min(34rem,calc(100svh - 9rem))');
    expect(hero).not.toContain('先看研究对象与比较条件 ↓');
    expect(hero).not.toContain('margin:1.35rem auto 1.8rem');
    expect(hero).toContain('实验状态与来源');
    expect(hero).toContain('OpenEvo 分两步：');
    expect(hero).toContain('MiniMax（任务结束后回看轨迹的分析模型）');
    for (const plainRole of ['文字经验', '可复用策略', '行为与恢复规则', '少量模型适配参数']) expect(hero).toContain(plainRole);
    for (const formalTerm of ['OPSD（', 'Text Memory（', 'Skill Bundle（', 'Agent System（', 'SD-LoRA（']) expect(hero).not.toContain(formalTerm);
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
    for (const term of ['OPSD（第一阶段封存后的初始参数训练）', 'Text Memory（文字经验）保存可复用经验', 'Skill Bundle（可复用技能）保存策略', 'Agent System（行为与恢复规则）保存全局规则', 'SD-LoRA（少量模型适配参数）更新参数', '只有最终采用的版本才装入下一批任务']) {
      expect(design).toContain(term);
    }
    expect(design).toContain('早期 Stage 1 / LoRA-vs-SD-LoRA 对照没有同时启用这四类状态');
    expect(design).toContain('完整系统比较只能回答两套系统总体表现有什么差异');
    expect(design).toContain('监督微调（SFT）训练配方');
    expect(design).toContain('checkpoint，也就是一版固定参数');
    expect(hub).toContain('参数指纹（digest，用来核对参数有没有变化）');
    expect(hub).toContain('Run Manifest，记录模型、代码、配置和任务集合');
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
