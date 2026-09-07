import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsHero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const resultsProtocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const resultsQuestions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
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
const wrapperAttribution = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const resultsRoute = read('../pages/research/seed-openevo/study/results.astro');
const resultsReaderContract = read('../../docs/agents/current/seed-openevo-results-reader-contract.md');

const publicCopy = [
  resultsHero,
  resultsProtocol,
  resultsQuestions,
  currentQ7,
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
  wrapperAttribution,
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
    ]) {
      expect(resultsQuestions).toContain(question);
    }
    expect(resultsQuestions).not.toContain("id: 'q7'");
    expect(currentQ7).toContain('还缺的方法级对照');
    expect(currentQ7).toContain('id="q7"');
    expect(resultsQuestions).toContain('<details class="evidence-details"');
    expect(currentQ7).toContain('<details class="evidence-details" id="evidence-q7">');
    expect(resultsQuestions).toContain('展开实验依据');
    expect(currentQ7).toContain('展开实验依据');
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
    expect(currentQ7.indexOf('95% CI')).toBeGreaterThan(currentQ7.indexOf('<details class="evidence-details" id="evidence-q7">'));
  });

  it('pins the lab-reader audience and Chinese-first terminology contract at the route', () => {
    expect(resultsRoute).toContain('seed-openevo-results-reader-contract.md');
    expect(resultsReaderContract).toContain('lab colleague');
    expect(resultsReaderContract).toContain('Chinese-first technical language');
    expect(resultsReaderContract).toContain('Density budget');
    expect(resultsReaderContract).toContain('展开实验依据');
    expect(resultsReaderContract).toContain('源码忠实任务语义（source-faithful task semantics）');
    expect(resultsHero).toContain('如果你知道实验室正在比较 OpenEvo、SEED 和 WebShop');
    expect(resultsProtocol).toContain('训练范围内未见任务与 SEED 验证任务');
    expect(resultsProtocol).toContain('任务 500–6909');
    expect(resultsProtocol).toContain('任务 0–499');
    expect(resultsProtocol).not.toContain('goal_idx');
  });

  it('protects direct mainline prose and keeps optional evidence as the deeper layer', () => {
    expect(resultsHero).not.toContain('研究结果 · RESEARCH FINDINGS');
    expect(resultsHero).toContain('OpenEvo × WebShop 研究结果');
    expect(resultsProtocol).toContain('训练范围内未见任务与 SEED 验证任务');
    expect(resultsQuestions).not.toContain('七个问题 · SEVEN QUESTIONS');
    expect(resultsQuestions).toContain('七个研究问题');
    expect(resultsQuestions).toContain('动作读取与任务身份');
    expect(resultsQuestions).not.toContain('WHY THIS TOOK TIME');
    expect(nextSteps).toContain('下一步实验 · NEXT STEPS');
    for (const source of [resultsHero, resultsProtocol, resultsQuestions, currentQ7, nextSteps]) {
      expect(source).not.toContain('专业解释：');
      expect(source).not.toContain('Technical detail:');
    }
    expect(resultsQuestions).toContain('class="supporting-context"');
    expect(nextSteps).toContain('<details class="step-detail">');
    expect(researchHub).toContain('适配器（adapter）');
    expect(researchHub).toContain('备用动作（fallback）');
    expect(researchHub).toContain('结束原因（termination）');
  });

  it('keeps the research navigation labelled as Research findings, not Experiment results', () => {
    expect(researchNav).toContain('研究结果');
    expect(researchNav).toContain('Research findings');
    expect(researchNav).not.toContain('实验结果');
    expect(researchNav).not.toContain('Experiment results');
  });

  it('protects the fresh-task boundary in reader-facing language', () => {
    expect(resultsQuestions).toContain('训练使用的 500–6909 号范围');
    expect(resultsQuestions).toContain('不是 SEED 留作正式验证的 0–499 号任务');
    expect(resultsProtocol).toContain('任务 500–6909');
    expect(resultsProtocol).toContain('任务 0–499');
    expect(resultsProtocol).not.toContain('goal_idx');
  });

  it('protects the scientific boundaries while presenting them in reader-facing language', () => {
    expect(resultsQuestions).toContain('不能写成“模型已经在这项测试上迁移失败”');
    expect(resultsQuestions).toContain('预留的新任务测试因为前面的能力检查没有通过而没有启动');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultsHero).toContain('机制结论以 8 月 21 日完成的 H1.41 实验为截止点');
    expect(resultsQuestions).toContain('768 个回合');
    expect(resultsQuestions).toContain('动作读取接口失效');
    expect(resultsProtocol).toContain('第一次主评测出现 0 分，不代表模型被证明“完全不会做”');
    expect(resultsQuestions).toContain('BASE 4.1 / 0.0%，SD-LoRA 7.3 / 2.3%');
    expect(resultsQuestions).toContain('自助法（bootstrap）95% CI [-0.65, +7.19]');
    expect(resultsProtocol).toContain('随机抽样方式会改变任务顺序和最终文字');
    expect(currentQ7).toContain('论文 89.7 / 78.1% 背后的最终 128 题');
    expect(currentQ7).toContain('128 / 128 PASS');
    expect(currentQ7).toContain('BASE 7.17 / 3.9%');
    expect(currentQ7).toContain('SD-LoRA 8.74 / 3.9%');
    expect(currentQ7).toContain('PUBLISHED_AND_VERIFIED');
    expect(nextSteps).toContain('同一 128 个任务的两模型测量已完成');
    expect(nextSteps).toContain('两轮比较回答不同问题');
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
  });

  it('does not regress to stale held-out planning states', () => {
    for (const source of [resultsHero, resultsProtocol, currentQ7, nextSteps]) {
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
    const figures = { webshopDatasetFigure, webshopSmallWorldFigure, webshopGoalFigure, webshopSeedSplitFigure, webshopEvaluationFigure, seedWebshopCanonicalFigure };
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
    const sources = { resultsHero, resultsProtocol, resultsQuestions, currentQ7, g2Ablation, nextSteps, resultsAppendix, experimentGateway, experimentProgram, resultNote, benchmarkNote, nextProtocol, loopsFigure, modelGuide };
    for (const [name, source] of Object.entries(sources)) {
      expect(source, `${name}: "本站" must not appear`).not.toMatch(/本站/);
      expect(source, `${name}: "本节" must not appear`).not.toMatch(/本节/);
      expect(source, `${name}: "这一节" must not appear`).not.toMatch(/这一节/);
      expect(source, `${name}: "站内" must not appear`).not.toMatch(/站内/);
    }
  });

  it('preserves all twelve historical result-note URLs and primer migration redirects', () => {
    for (const slug of [
      'webshop-training', 'seed-training', 'openevo-training', 'why-it-kept-failing',
      'first-positive-transfer', 'independent-replication', 'second-generation', 'measurement-boundary',
      'current-conclusion', 'benchmark-first', 'seed-faithful-benchmark', 'openevo-benchmark-design',
    ]) {
      expect(resultsAppendix, `${slug} missing from appendix deep cards or legacy links`).toContain(`/${slug}/`);
    }
  });
});
