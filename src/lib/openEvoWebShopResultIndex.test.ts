import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPage = read('../pages/research/seed-openevo/results.astro');
const experimentPage = read('../pages/research/seed-openevo/experiment.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const resultIndex = read('../components/research/OpenEvoWebShopResultIndex.astro');
const keyEvidence = read('../components/research/OpenEvoResearchKeyEvidence.astro');
const findingFigures = read('../components/research/OpenEvoResearchFindingFigures.astro');
const takeaway = read('../components/research/OpenEvoResearchTakeaway.astro');
const appendix = read('../components/research/OpenEvoResearchAppendixLinks.astro');
const nextProtocol = read('../components/research/OpenEvoNextExperimentProtocol.astro');
const evidenceNoteScope = read('../components/research/OpenEvoEvidenceNoteScope.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const resultRoute = read('../pages/research/seed-openevo/results/[note].astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const sitemap = read('./sitemapRoutes.ts');

const noteSlugs = [
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
] as const;

describe('OpenEvo × WebShop research findings information architecture', () => {
  it('starts from reader questions instead of explaining the page architecture', () => {
    expect(resultsPage).toContain('OpenEvo × WebShop 研究结果');
    expect(resultsPage).toContain('OpenEvoWebShopResultIndex');
    expect(resultsPage).toContain('OpenEvoResearchKeyEvidence');
    expect(resultsPage).toContain('OpenEvoResearchFindingFigures');
    expect(resultsPage).toContain('OpenEvoResearchTakeaway');
    expect(resultsPage).toContain('OpenEvoResearchAppendixLinks');
    expect(resultsPage).not.toContain('OpenEvoResearchEvidenceMap');
    expect(resultsPage).not.toContain('OpenEvoWebShopNarrativeReport');
    expect(resultsPage).not.toContain('OpenEvoWebShopProgramReport');
    expect(resultsPage).not.toContain('Seed3090ParametricProgress');
    expect(resultsPage).not.toContain('WebShopTrainingGuide');

    expect(researchDetail).toContain("title: t('OpenEvo × WebShop 研究结果', 'OpenEvo × WebShop research findings')");
    expect(researchDetail).toContain('我们从七个最自然的问题开始');

    expect(resultIndex).toContain('OpenEvo、WebShop、SEED 和实验记录分别指什么？');
    expect(resultIndex).toContain('/research/seed-openevo/webshop/');
    expect(resultIndex).toContain('/research/seed-openevo/openevo/');
    expect(resultIndex).toContain('/research/seed-openevo/seed/');
    expect(resultIndex).toContain('/research/seed-openevo/experiment/');
  });

  it('keeps one continuous reading pass: questions → numbers → figures → takeaway → optional deep dives', () => {
    const orderedComponents = [
      '<OpenEvoWebShopResultIndex />',
      '<OpenEvoResearchKeyEvidence />',
      '<OpenEvoResearchFindingFigures />',
      '<OpenEvoResearchTakeaway />',
      '<OpenEvoResearchAppendixLinks />',
    ];
    let previous = -1;
    for (const component of orderedComponents) {
      const position = resultsPage.indexOf(component);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }
    expect(resultIndex).not.toContain('EVIDENCE NOTES');
    expect(takeaway).toContain('目前最重要的结论是什么？');
    expect(appendix).toContain('EVIDENCE NOTES');
  });

  it('keeps evidence next to the question it supports instead of jumping to a second evidence pass', () => {
    expect(resultIndex).toContain('我们现在能回答的七个问题');
    expect(resultIndex).toContain('证据截止：H1.41');
    expect(resultIndex).toContain('OpenEvo 真的发生了学习吗？');
    expect(resultIndex).toContain('OpenEvo 有没有成功经验可以学习？');
    expect(resultIndex).toContain('有成功经验以后，OpenEvo 能把它学进去吗？');
    expect(resultIndex).toContain('学到的经验能迁移到新的任务吗？');
    expect(resultIndex).toContain('第一代能迁移，是否意味着可以一直越学越好？');
    expect(resultIndex).toContain('现在真正可以下什么结论？');
    expect(resultIndex).toContain('最后还缺哪一个关键实验？');

    expect(resultIndex).toContain('<details class="evidence-details" id={`evidence-${item.id}`} name="research-evidence">');
    expect(resultIndex).toContain('<summary>展开实验依据</summary>');
    expect(resultIndex).toContain('<strong>结论边界：</strong>{item.boundary}');
    expect(resultIndex).toContain('476039e9ce82767120db803d57f016db3b1414ce');
    expect(resultIndex).toContain('h1.39-mr-independent-panel-v1.json');
    expect(resultIndex).toContain('reconciliation-summary.json');
    expect(resultIndex).toContain('FORMAL_UPSTREAM_EVALUATION_REPORT.md');
    expect(resultIndex).toContain('H1.30_STATUS.md');
    expect(resultIndex).not.toContain("href: '#evidence-q");
    expect(resultIndex).not.toContain('查看证据链 →');

    expect(resultIndex).toContain('OpenEvo internal fresh task-ID-disjoint evaluation（OpenEvo 内部新任务、任务 ID 不重叠评估）');
    expect(resultIndex).toContain('不是 SEED official held-out evaluation（SEED 官方保留任务评估）');
    expect(resultIndex).toContain('不能写成“G2 已经在正式 T2 上证明迁移失败”');
  });

  it('protects the key quantitative anchors used in the report', () => {
    expect(keyEvidence).toContain('四组数字先告诉我们，研究已经走到了哪里');
    expect(keyEvidence).toContain("value: '128'");
    expect(keyEvidence).toContain("value: '96'");
    expect(keyEvidence).toContain("value: '28'");
    expect(keyEvidence).toContain("value: '+0.124'");
    expect(keyEvidence).toContain("value: '[0.0326, 0.2194]'");
    expect(keyEvidence).toContain("value: '+0.1637'");
    expect(keyEvidence).toContain("value: '+0.2488'");
    expect(keyEvidence).toContain('goal_idx ≥ 500');
    expect(keyEvidence).toContain("value: '256'");
    expect(keyEvidence).toContain("value: '132'");
    expect(keyEvidence).toContain("value: '33'");
    expect(keyEvidence).toContain("value: '16'");
    expect(keyEvidence).toContain("value: '0'");
    expect(keyEvidence).toContain('formal evaluation denominator（正式评估分母）');
  });

  it('renders three evidence-grounded figures without crossing claim boundaries', () => {
    expect(findingFigures).toContain('三个问题最能看清目前的结果');
    expect(findingFigures).toContain('FIGURE R1 · LEARNING LADDER');
    expect(findingFigures).toContain('FIGURE R2 · INTERNAL TRANSFER');
    expect(findingFigures).toContain('FIGURE R3 · CONTINUAL INTEGRATION');
    expect(findingFigures).toContain("value: '+0.124'");
    expect(findingFigures).toContain("value: '+0.164'");
    expect(findingFigures).toContain("value: '+0.249'");
    expect(findingFigures).toContain('goal_idx ≥ 500');
    expect(findingFigures).toContain('不是 0–499 的 SEED official held-out evaluation（SEED 官方保留任务评估）');
    expect(findingFigures).toContain('T2 remained closed（T2 保持关闭）');
    expect(findingFigures).toContain('没有正式 fresh-transfer denominator（新任务迁移评估分母）');
    expect(findingFigures).toContain('不是“G2 已经在正式 T2 上证明迁移失败”');
  });

  it('protects the takeaway from overclaiming', () => {
    expect(takeaway).toContain('第一代内部新任务迁移可以出现，并已独立复现');
    expect(takeaway).toContain('已经支持');
    expect(takeaway).toContain('尚未支持');
    expect(takeaway).toContain('OpenEvo 已经在 SEED 官方保留任务上证明有效');
    expect(takeaway).toContain('goal_idx ≥ 500');
    expect(takeaway).toContain('SEED official held-out tasks（SEED 官方保留任务）');
    expect(takeaway).toContain('SEED-compatible fair comparison（与 SEED 严格兼容的公平比较）');
  });

  it('keeps the next experiment framed as a scientific question', () => {
    expect(experimentPage).toContain('OpenEvoNextExperimentProtocol');
    expect(experimentPage).toContain('OpenEvo × WebShop 实验与复现');
    expect(nextProtocol).toContain('NEXT EXPERIMENT');
    expect(nextProtocol).toContain('下一场真正关键的实验是什么？');
    expect(nextProtocol).toContain('怎样才算和 SEED 公平比较？');
    expect(nextProtocol).toContain('SEED official held-out evaluation（SEED 官方保留任务评估）');
    expect(benchmarkNote).toContain('状态：</strong>实验设计中，尚未产生正式比较结果');
  });

  it('avoids author-facing page-management language in the public research path', () => {
    const publicCopy = [resultIndex, keyEvidence, findingFigures, appendix, nextProtocol, evidenceNoteScope, primerMoved].join('\n');
    for (const phrase of [
      '背景只保留入口',
      '不在实验结果页重新讲一遍',
      '方法背景与 WebShop / SEED 设定不在这里重复',
      '背景定义不在这里重复',
      '继续向下放在 Evidence Map',
      '原始代码和机器结果继续在下方 Evidence Map',
      '从“主报告骨架”降为',
      '下一步实验设计从 Results 中移到这里',
      '一个概念只保留一个 canonical explanation',
    ]) {
      expect(publicCopy).not.toContain(phrase);
    }
  });

  it('preserves all twelve historical result-note URLs and keeps their reader-facing destinations clear', () => {
    for (const slug of noteSlugs) {
      expect(appendix, `${slug} missing from appendix or legacy links`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('想确认 WebShop 的任务与评测规则？');
    expect(primerMoved).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
  });

  it('keeps H1.42 as a later measurement-boundary note rather than part of the H1.41 conclusions', () => {
    expect(resultIndex).toContain('H1.42 是之后产生的 measurement-boundary（测量边界）记录');
    expect(appendix).toContain('H1.42 属于之后的 measurement-boundary（测量边界）工作');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultNote).toContain("'measurement-boundary'");
    expect(resultNote).toContain('MVD0 REMEASUREMENT_INVALID');
    expect(resultNote).toContain('H1.40、H1.41、H1.42 的 T2 都保持关闭');
    expect(resultNote).toContain('不能支持 magnitude-reset mechanism effect');
  });
});
