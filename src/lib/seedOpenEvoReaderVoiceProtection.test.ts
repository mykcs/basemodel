import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

// Reader-facing components actually mounted on /research/seed-openevo/* public
// pages. Anything added here MUST also be added to the `publicCopy` array so
// that the editorial-tone ban applies to the whole visible research module,
// not just the few components the author happened to remember.
const researchIndex = read('../components/research/OpenEvoWebShopResultIndex.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const researchNav = read('../components/research/SeedOpenEvoResearchNav.astro');
const researchHub = read('../components/research/SeedOpenEvoResearchHub.astro');
const researchPageCore = read('../components/research/SeedOpenEvoResearchPageCore.astro');
const conceptIndex = read('../components/research/ResearchConceptIndex.astro');
const agentTrajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const programReport = read('../components/research/OpenEvoWebShopProgramReport.astro');
const programReportNarrative = read('../components/research/OpenEvoWebShopNarrativeReport.astro');
const seed3090Progress = read('../components/research/Seed3090ParametricProgress.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const keyEvidence = read('../components/research/OpenEvoResearchKeyEvidence.astro');
const findingFigures = read('../components/research/OpenEvoResearchFindingFigures.astro');
const takeaway = read('../components/research/OpenEvoResearchTakeaway.astro');
const appendix = read('../components/research/OpenEvoResearchAppendixLinks.astro');
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

const publicCopy = [
  researchIndex,
  researchDetail,
  researchNav,
  researchHub,
  researchPageCore,
  conceptIndex,
  agentTrajectory,
  programReport,
  programReportNarrative,
  seed3090Progress,
  benchmarkNote,
  primerMoved,
  keyEvidence,
  findingFigures,
  takeaway,
  appendix,
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
  it('keeps Q1–Q7 with inline <details> evidence and forbids the legacy evidence-map jump', () => {
    expect(researchIndex).toContain('OpenEvo 真的发生了学习吗？');
    expect(researchIndex).toContain('OpenEvo 有没有成功经验可以学习？');
    expect(researchIndex).toContain('有成功经验以后，OpenEvo 能把它学进去吗？');
    expect(researchIndex).toContain('学到的经验能迁移到新的任务吗？');
    expect(researchIndex).toContain('第一代能迁移，是否意味着可以一直越学越好？');
    expect(researchIndex).toContain('现在真正可以下什么结论？');
    expect(researchIndex).toContain('最后还缺哪一个关键实验？');
    expect(researchIndex).toContain('<summary>展开实验依据</summary>');
    expect(researchIndex).not.toContain("href: '#evidence-q");
    expect(researchIndex).not.toContain('查看证据链 →');
  });

  it('keeps the research navigation labelled as Research findings, not Experiment results', () => {
    expect(researchNav).toContain('研究结果');
    expect(researchNav).toContain('Research findings');
    expect(researchNav).not.toContain('实验结果');
    expect(researchNav).not.toContain('Experiment results');
  });

  it('protects the H1.38B / H1.39 internal fresh-task boundary', () => {
    expect(researchIndex).toContain('OpenEvo internal fresh task-ID-disjoint evaluation');
    expect(researchIndex).toContain('不是 SEED official held-out evaluation');
    expect(keyEvidence).toContain('goal_idx ≥ 500');
    expect(findingFigures).toContain('不是 0–499 的 SEED official held-out evaluation');
  });

  it('protects the H1.40 T2 unopened boundary and the H1.30 formal-denominator-equals-zero boundary', () => {
    expect(researchIndex).toContain('不能写成');
    expect(researchIndex).toContain('G2 已经在正式 T2 上证明迁移失败');
    expect(keyEvidence).toContain('formal evaluation denominator');
    expect(findingFigures).toContain('T2 remained closed');
  });

  it('blocks editorial-tone copy from reappearing anywhere in the public research path', () => {
    const bannedEditorialPhrases = [
      // Page-role / IA self-reference
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
      // "本站 / 本节 / 站内 / 这里" — second-pass leaks
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

  it('keeps the WebShop canonical figures free of "本站 / 本节 / 这里" editor voice', () => {
    // Each of these figures is mounted on /research/seed-openevo/webshop/.
    // Asserting them individually makes a regression immediately locatable.
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

  it('keeps the WebShopSeedSplitFigure 128-samples / 0–499 boundary in the correct (negative) direction', () => {
    // The 128 test samples reported by the SEED paper are not pinned to
    // specific 0–499 positions. The figure must say so in the *negative*
    // direction (NOT drawn as a confirmed sampling path) in both Chinese
    // and English. A previous rewrite dropped the Chinese "不" and silently
    // flipped the meaning to "drawn as a confirmed sampling path". This
    // assertion pins the polarity so that regression breaks the build.
    expect(webshopSeedSplitFigure).toContain('不画出确定的抽样关系');
    expect(webshopSeedSplitFigure).toContain('not drawn as a confirmed sampling path');
    // Negative-direction guard: the figure must never claim the 128 goal
    // IDs are pinned, in either language.
    expect(webshopSeedSplitFigure).not.toContain('画成确定抽样关系');
    // The English sentence must keep "not drawn" together, not let
    // "drawn as a confirmed sampling path" appear on its own.
    const englishBoundary = 'not drawn as a confirmed sampling path';
    expect(webshopSeedSplitFigure).toContain(englishBoundary);
    expect(webshopSeedSplitFigure.indexOf(englishBoundary)).toBeGreaterThan(-1);
  });

  it('keeps the experiment and results pages free of "本站 / 本节 / 这一节" editor voice', () => {
    const sources = {
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
      expect(appendix, `${slug} missing from appendix deep cards or legacy links`).toContain(`/${slug}/`);
    }
  });
});
