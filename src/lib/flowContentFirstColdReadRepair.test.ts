import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const hero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const design = read('src/components/research/SeedOpenEvoTrainingDesignOverview.astro');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');
const comparisonData = read('src/data/seedOpenEvoIntelligenceComparison.ts');

describe('Flow content-first cold-read repair', () => {
  it('defines the four named research objects at first use while preserving the fairness boundary', () => {
    for (const phrase of [
      'SEED 与 OpenEVO 的两阶段学习范式',
      '两套方法都先借助外部高能力教师从任务轨迹中形成学习起点',
      'Stage 1 和 Stage 2 都涉及参数学习',
      'WebShop（网页购物任务）',
      'ALFWorld 是另一种文本具身任务',
      '只比较完整系统时，允许两边沿用各自的 Stage 1 初始化方法',
      'Stage 2 学习器，必须共享 Stage 1 的轨迹、事后分析、训练配方与同一个起点参数',
      '未对齐时不能宣称某种 Stage 2 学习机制更好',
    ]) expect(hero).toContain(phrase);
    expect(hero).not.toContain('这页先讲实验怎么公平比较');
    expect(hero).not.toContain('border-left:3px solid var(--accent-deep)');
  });

  it('leads with two stages and pairs both methods instead of implying Stage 1 has no parameter training', () => {
    expect(hub).toContain('SEED × OpenEVO 两阶段学习范式');
    expect(hub).not.toContain('下面用 WebShop 展开两阶段');
    expect(hub).toContain('请外部高能力教师模型 API 事后分析并训练初始参数');
    expect(hub).toContain('不把它自动推广到 ALFWorld');
    expect(hub).not.toContain('外部 analyzer 才能复盘');
    expect(hub).toContain('Stage 1 用外部教师分析完整轨迹并进行初始参数蒸馏');
    expect(hub).not.toContain('step loop');
    expect(hub.indexOf('id="training-design"')).toBeLessThan(hub.indexOf('id="questions"'));
    expect(hub).toContain('Stage 2 由当前策略自行复盘，用 GRPO + OPD 持续更新参数');
    expect(hub).not.toContain('OPD / GRPO 的具体做法留到 SEED 方法页');
    expect(hub).toContain('class="object-map__fact"');
    expect(hub).not.toContain("Qwen2.5-3B-Instruct', body:t('固定同一版模型参数（checkpoint，也就是模型参数快照）、数值精度和运行设置。','Pin the same model-parameter snapshot (checkpoint), numerical precision, and runtime settings.'), href:");
     expect(hub).toContain('aria-labelledby="research-objects-title"');
    expect(hub).toContain('<h2 id="research-objects-title">');
    expect(hub).not.toContain("<h2>{t('研究对象', 'Research objects')}</h2>");
  });


  it('does not manufacture a full-screen gap and keeps mobile research navigation discoverable without a clipped strip', () => {
    expect(hero).not.toContain('min-height:min(34rem,calc(100svh - 9rem))');
    expect(hero).not.toContain('先看研究对象与比较条件 ↓');
    expect(hero).not.toContain('margin:1.35rem auto 1.8rem');
    expect(hero).toContain('实验状态与来源');
    expect(hero).toContain('{!compact && <details class="mission-hero__secondary">');
    expect(hero).not.toContain('{compact && <details class="mission-hero__secondary">');
    expect(hero).not.toContain('mission-hero__method-summary');
    expect(hub).toContain('第一阶段都采集 WebShop 轨迹');
    expect(hub).toContain('第二阶段都从新任务中获取反馈');
    for (const plainRole of ['文字经验', '可复用策略', '全局规则']) expect(comparisonData).toContain(plainRole);
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
    expect(design).toContain('只能比较两个完整系统的总体表现，不能把全部差异单独归因于第二阶段（Stage 2）的学习器');
    expect(design).toContain('只有这种共同起点的对照，才允许把后续差异收窄到第二阶段（Stage 2）学习器');
    expect(design).not.toContain("summary={t('完整系统比较和 learner 对照有什么区别？'");
  });

  it('connects Stage 1 parameter learning to the later four-state Stage 2 without rewriting early experiments', () => {
    for (const term of ['初始参数蒸馏（OPSD）', 'Text Memory', 'Skill Bundle', 'Agent System', 'SD-LoRA', '通过既定检查的参数或经验候选']) {
      expect(comparisonData).toContain(term);
    }
    expect(design).toContain('早期 Stage 1 / LoRA-vs-SD-LoRA 对照没有同时启用全部四类 OpenEVO 状态');
    expect(design).toContain('完整系统比较只能回答两套系统总体表现有什么差异');
    expect(design).toContain('监督微调（SFT，也就是用已保存示例继续训练）配方');
    expect(design).toContain('checkpoint，也就是一版固定参数');
    expect(design).toContain('任务尝试随机种子（rollout seeds）');
    expect(design).toContain('1,440 次任务尝试（rollout）');
    expect(hub).toContain('参数指纹（digest，用来核对参数有没有变化）');
    expect(hub).toContain('Run Manifest，记录模型、代码、配置和任务集合');
    expect(design).toContain('各自的提示、历史与动作解析层');
    expect(design).not.toContain('native harness：');
  });

  it('uses a shared-axis table for the attribution comparison rather than two equal-weight cards', () => {
    expect(design).toContain('<ResearchPaperTable narrowRecords');
    expect(design).toContain('<thead>');
    expect(design).toContain('<tbody>');
    expect(design).toContain("t('比较口径', 'Comparison')");
    expect(design).toContain("t('哪些条件保持一致', 'What stays aligned')");
    expect(design).toContain("t('可以支持什么结论', 'What the result can support')");
  });
});
