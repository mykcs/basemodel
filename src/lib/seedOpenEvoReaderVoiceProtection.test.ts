import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const researchIndex = read('../components/research/OpenEvoWebShopResultIndex.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const conceptIndex = read('../components/research/ResearchConceptIndex.astro');
const agentTrajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const programReport = read('../components/research/OpenEvoWebShopProgramReport.astro');
const seed3090Progress = read('../components/research/Seed3090ParametricProgress.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const keyEvidence = read('../components/research/OpenEvoResearchKeyEvidence.astro');
const findingFigures = read('../components/research/OpenEvoResearchFindingFigures.astro');
const takeaway = read('../components/research/OpenEvoResearchTakeaway.astro');
const appendix = read('../components/research/OpenEvoResearchAppendixLinks.astro');

const publicCopy = [
  researchIndex,
  researchDetail,
  conceptIndex,
  agentTrajectory,
  programReport,
  seed3090Progress,
  benchmarkNote,
  primerMoved,
  keyEvidence,
  findingFigures,
  takeaway,
  appendix,
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

  it('blocks editorial-tone copy from reappearing in the SEED × OpenEvo public research path', () => {
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
