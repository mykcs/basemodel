import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsHero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const resultsProtocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const resultsQuestions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const g2Ablation = read('../components/research/OpenEvoWebShopG2Ablation.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const resultsAppendix = read('../components/research/OpenEvoWebShopResultsAppendix.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const researchNav = read('../components/research/SeedOpenEvoResearchNav.astro');
const researchHub = read('../components/research/SeedOpenEvoResearchHub.astro');
const researchPageCore = read('../components/research/SeedOpenEvoResearchPageCore.astro');
const conceptIndex = read('../components/research/ResearchConceptIndex.astro');
const agentTrajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const seed3090Progress = read('../components/research/Seed3090ParametricProgress.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const nextProtocol = read('../components/research/OpenEvoNextExperimentProtocol.astro');
const evidenceNoteScope = read('../components/research/OpenEvoEvidenceNoteScope.astro');
const experimentProgram = read('../components/research/OpenEvoExperimentProgram.astro');
const experimentGateway = read('../components/research/OpenEvoExperimentGateway.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const loopsFigure = read('../components/research/SeedOpenEvoCanonicalFigure.astro');
const webshopDatasetFigure = read('../components/research/WebShopDatasetCanonicalFigure.astro');
const webshopSmallWorldFigure = read('../components/research/WebShopSmallWorldFigure.astro');
const webshopGoalFigure = read('../components/research/WebShopGoalGenerationFigure.astro');
const webshopSeedSplitFigure = read('../components/research/WebShopSeedSplitFigure.astro');
const webshopEvaluationFigure = read('../components/research/WebShopEvaluationFigure.astro');
const seedWebshopCanonicalFigure = read('../components/research/SeedWebShopCanonicalFigure.astro');
const modelGuide = read('../components/research/OpenEvoModelExperimentGuide.astro');
const webshopTrainingNote = read('../components/research/WebShopTrainingNote.astro');
const resultsRoute = read('../pages/research/seed-openevo/results.astro');
const resultsReaderContract = read('../../docs/agents/current/seed-openevo-results-reader-contract.md');

const publicCopy = [
  resultsHero,
  resultsProtocol,
  resultsQuestions,
  g2Ablation,
  nextSteps,
  resultsAppendix,
  researchDetail,
  researchNav,
  researchHub,
  researchPageCore,
  conceptIndex,
  agentTrajectory,
  seed3090Progress,
  benchmarkNote,
  primerMoved,
  nextProtocol,
  evidenceNoteScope,
  experimentProgram,
  experimentGateway,
  resultNote,
  loopsFigure,
  webshopDatasetFigure,
  webshopSmallWorldFigure,
  webshopGoalFigure,
  webshopSeedSplitFigure,
  webshopEvaluationFigure,
  seedWebshopCanonicalFigure,
  modelGuide,
  webshopTrainingNote,
].join('\n');

describe('SEED × OpenEvo reader-voice protection', () => {
  it('keeps Q1–Q7 with local expandable experiment evidence and forbids the legacy evidence-map jump', () => {
    for (const question of [
      'OpenEvo 真的发生了学习吗？',
      'OpenEvo 有没有成功经验可以学习？',
      '有成功经验以后，OpenEvo 能把它学进去吗？',
      '学到的经验能迁移到新的任务吗？',
      '第一代能迁移，是否意味着可以一直越学越好？',
      '这些数字会不会只是工程故障的假象？',
      '最后还缺哪一个关键实验？',
    ]) {
      expect(resultsQuestions).toContain(question);
    }
    expect(resultsQuestions).toContain('<details class="evidence-details"');
    expect(resultsQuestions).toContain('展开实验依据');
    expect(resultsQuestions).not.toContain('证据链与代码回溯');
    expect(resultsQuestions).not.toContain("href: '#evidence-q");
    expect(resultsQuestions).not.toContain('查看证据链 →');
  });

  it('keeps dense observations and confidence intervals behind the evidence disclosure', () => {
    const details = resultsQuestions.indexOf('<details class="evidence-details"');
    const observationTable = resultsQuestions.indexOf('<table class="obs-table">');
    const transferFigure = resultsQuestions.indexOf('<figure class="transfer-figure"');
    expect(details).toBeGreaterThan(-1);
    expect(observationTable).toBeGreaterThan(details);
    expect(transferFigure).toBeGreaterThan(details);
    expect(resultsHero).not.toContain('95% CI');
    expect(resultsHero).not.toContain('task-ID-disjoint');
  });

  it('pins the lab-reader audience and Chinese-first terminology contract at the route', () => {
    expect(resultsRoute).toContain('seed-openevo-results-reader-contract.md');
    expect(resultsReaderContract).toContain('lab colleague');
    expect(resultsReaderContract).toContain('Chinese-first technical language');
    expect(resultsReaderContract).toContain('Density budget');
    expect(resultsReaderContract).toContain('展开实验依据');
    expect(resultsReaderContract).toContain('源码忠实任务语义（source-faithful task semantics）');
    expect(resultsHero).toContain('如果你已经知道实验室在做 OpenEvo × WebShop');
    expect(resultsProtocol).toContain('解析器（parser）');
    expect(resultsQuestions).toContain('SEED-compatible');
  });

  it('keeps the research navigation labelled as Research findings, not Experiment results', () => {
    expect(researchNav).toContain('研究结果');
    expect(researchNav).toContain('Research findings');
    expect(researchNav).not.toContain('实验结果');
    expect(researchNav).not.toContain('Experiment results');
  });

  it('protects the H1.38B / H1.39 internal fresh-task boundary', () => {
    expect(resultsQuestions).toContain('OpenEvo internal fresh task-ID-disjoint evaluation');
    expect(resultsQuestions).toContain('它们不是 0–499 的 SEED 官方保留任务评估');
    expect(resultsProtocol).toContain('goal_idx ≥ 500');
    expect(resultsProtocol).toContain('goal_idx 0–499');
  });

  it('protects H1.40 T2, later H1.42, repaired-primary v2, and the source-semantics successor', () => {
    expect(resultsQuestions).toContain('G2 已经在正式 T2 上证明迁移失败');
    expect(resultsQuestions).toContain('T2 没有运行');
    expect(resultsQuestions).toContain('H1.42 发生在 H1.41 之后');
    expect(resultsHero).toContain('机制结论截至 H1.41');
    expect(resultsQuestions).toContain('修复后复测已完成 · 源码语义待验证');
    expect(resultsQuestions).toContain('768 episodes');
    expect(resultsQuestions).toContain('测量无效');
    expect(resultsQuestions).toContain('BASE：Task Score 4.1 / 完整成功 0.0%');
    expect(resultsQuestions).toContain('SD-LoRA：7.3 / 2.3%');
    expect(resultsQuestions).toContain('数值 session index 不是完整任务身份');
    expect(resultsQuestions).toContain('不是论文确切分母');
    expect(resultsQuestions).toContain('design-only-not-authorized');
    expect(nextSteps).toContain('先复现 SEED 公共代码的任务语义');
    expect(nextSteps).toContain('WB1 属于 Track B');
  });

  it('does not regress to stale held-out planning states', () => {
    for (const source of [resultsHero, resultsProtocol, resultsQuestions, nextSteps]) {
      expect(source).not.toContain('SEED official held-out evaluation（SEED 官方保留任务评估）尚未执行');
      expect(source).not.toContain('formal evaluation denominator（正式评估分母）= 0');
      expect(source).not.toContain('冻结权重，执行 SEED 官方 0–499 评估');
      expect(source).not.toContain('2 arms × 128 = 256 episodes，尚未运行');
      expect(source).not.toContain('先把官方保留任务的测量修好');
    }
  });

  it('blocks editorial-tone copy from reappearing anywhere in the public research path', () => {
    const bannedEditorialPhrases = [
      '完整流程图只保留在各自的专门页面',
      '让当前页面继续承担实验或复现主线',
      '完整谱系和历史平台记录保留用于审计',
      '不参与主结论的视觉排序',
      '这一节只保留历史诊断价值',
      '本页负责',
      '本页用于',
      '让当前页面继续承担',
      '主报告',
      '信息架构',
      '为了避免重复',
      '这里不再重复',
      '本站比较合同',
      '本站记录合同',
      '站内实验记录',
      '本节只定义',
      '本节只建立',
      '本节对象',
      '这一节只处理',
      '尚未在这里钉死',
      '本站的教学分组',
      '本站在',
      '下一节的公平比较',
      '这里保留 UNKNOWN',
      '完整流程图只保留',
    ];
    for (const phrase of bannedEditorialPhrases) {
      expect(publicCopy, `editorial-tone phrase "${phrase}" should not reappear`).not.toContain(phrase);
    }
  });

  it('does not reintroduce the legacy primer-migration aside on the public research path', () => {
    expect(primerMoved).not.toContain('一个概念只保留一个 canonical explanation');
    expect(primerMoved).not.toContain('为了避免重复');
    expect(primerMoved).not.toContain('所以单独整理');
    expect(primerMoved).not.toContain('正式页面统一解释');
    expect(primerMoved).not.toContain('已经并入');
    expect(primerMoved).not.toContain('Compatibility shell');
  });

  it('keeps the WebShop canonical figures free of site-management editor voice', () => {
    const figures = {
      webshopDatasetFigure,
      webshopSmallWorldFigure,
      webshopGoalFigure,
      webshopSeedSplitFigure,
      webshopEvaluationFigure,
      seedWebshopCanonicalFigure,
    };
    for (const [name, source] of Object.entries(figures)) {
      expect(source, `${name}: "本站" must not appear`).not.toMatch(/本站/);
      expect(source, `${name}: "本节" must not appear`).not.toMatch(/本节/);
      expect(source, `${name}: "这一节" must not appear`).not.toMatch(/这一节/);
      expect(source, `${name}: "站内" must not appear`).not.toMatch(/站内/);
    }
  });

  it('keeps the WebShopSeedSplitFigure 128-samples / 0–499 boundary in the correct negative direction', () => {
    expect(webshopSeedSplitFigure).toContain('不画出确定的抽样关系');
    expect(webshopSeedSplitFigure).toContain('not drawn as a confirmed sampling path');
    expect(webshopSeedSplitFigure).not.toContain('画成确定抽样关系');
  });

  it('keeps the experiment and results pages free of site-management editor voice', () => {
    const sources = {
      resultsHero,
      resultsProtocol,
      resultsQuestions,
      g2Ablation,
      nextSteps,
      resultsAppendix,
      experimentGateway,
      experimentProgram,
      resultNote,
      benchmarkNote,
      nextProtocol,
      loopsFigure,
      modelGuide,
    };
    for (const [name, source] of Object.entries(sources)) {
      expect(source, `${name}: "本站" must not appear`).not.toMatch(/本站/);
      expect(source, `${name}: "本节" must not appear`).not.toMatch(/本节/);
      expect(source, `${name}: "这一节" must not appear`).not.toMatch(/这一节/);
      expect(source, `${name}: "站内" must not appear`).not.toMatch(/站内/);
    }
  });

  it('preserves all twelve historical result-note URLs and primer migration redirects', () => {
    for (const slug of [
      'webshop-training',
      'seed-training',
      'openevo-training',
      'why-it-kept-failing',
      'first-positive-transfer',
      'independent-replication',
      'second-generation',
      'measurement-boundary',
      'current-conclusion',
      'benchmark-first',
      'seed-faithful-benchmark',
      'openevo-benchmark-design',
    ]) {
      expect(resultsAppendix, `${slug} missing from appendix deep cards or legacy links`).toContain(`/${slug}/`);
    }
  });
});
