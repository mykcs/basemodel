import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/results.astro');
const experimentPage = read('../pages/research/seed-openevo/experiment.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const protocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const questions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const g2Ablation = read('../components/research/OpenEvoWebShopG2Ablation.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const appendix = read('../components/research/OpenEvoWebShopResultsAppendix.astro');
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

const moduleComponents = [
  'OpenEvoWebShopResultsHero',
  'OpenEvoWebShopResultsProtocol',
  'OpenEvoWebShopResultsQuestions',
  'OpenEvoWebShopG2Ablation',
  'OpenEvoWebShopNextSteps',
  'OpenEvoWebShopResultsAppendix',
] as const;

describe('OpenEvo × WebShop research findings information architecture', () => {
  it('mounts the same six modules in the same order on both locale routes', () => {
    for (const page of [resultsPageZh, resultsPageEn]) {
      expect(page).toContain('data-testid="openevo-webshop-result-index"');
      expect(page).toContain("body:has([data-testid='openevo-webshop-result-index']) .plain-detail__header");
      let previous = -1;
      for (const component of moduleComponents) {
        const position = page.indexOf(`<${component} locale={locale} />`);
        expect(position, `${component} missing or out of order`).toBeGreaterThan(previous);
        previous = position;
      }
      expect(page).not.toContain('OpenEvoWebShopResultIndex');
      expect(page).not.toContain('OpenEvoResearchKeyEvidence');
      expect(page).not.toContain('OpenEvoResearchFindingFigures');
      expect(page).not.toContain('OpenEvoResearchTakeaway');
      expect(page).not.toContain('OpenEvoResearchAppendixLinks');
      expect(page).not.toContain('OpenEvoWebShopNarrativeReport');
      expect(page).not.toContain('OpenEvoWebShopProgramReport');
      expect(page).not.toContain('Seed3090ParametricProgress');
      expect(page).not.toContain('WebShopTrainingGuide');
      expect(page).not.toContain('data-program-report');
    }
    expect(resultsPageZh).toContain('OpenEvo × WebShop 研究结果');
    expect(resultsPageEn).toContain('OpenEvo × WebShop research findings');
    expect(researchDetail).toContain("title: t('OpenEvo × WebShop 研究结果', 'OpenEvo × WebShop research findings')");
  });

  it('keeps the hero abstract to one established conclusion and one bottleneck, with the evidence cutoff stated once', () => {
    expect(hero).toContain('OpenEvo × WebShop 研究结果');
    expect(hero).toContain('探究 Agent 内生经验转化为通用能力的边界与瓶颈（证据截止：H1.41）。');
    expect(hero).toContain('已确立结论');
    expect(hero).toContain('当前核心瓶颈');
    expect(hero).toContain('task-ID-disjoint');
    expect(hero).toContain('formal evaluation denominator（正式评估分母）= 0');
    expect(hero).toContain('H1.42 是之后产生的 measurement-boundary（测量边界）记录');
    expect(hero).toContain("aria-label={t('报告目录', 'Report contents')}");
    expect(hero).toContain("href: '#protocol'");
    expect(hero).toContain("href: '#questions'");
    expect(hero).toContain("href: '#g2-ablation'");
    expect(hero).toContain("href: '#next-steps'");
    expect(hero).toContain("href: '#appendix'");
  });

  it('centralizes the evaluation protocol and data boundary ahead of the seven questions', () => {
    expect(protocol).toContain('id="protocol"');
    expect(protocol).toContain('实验协议与数据边界');
    expect(protocol).toContain('Evaluation protocol & measurement boundary');
    expect(protocol).toContain('Qwen2.5-7B-Instruct');
    expect(protocol).toContain('goal_idx ≥ 500');
    expect(protocol).toContain('goal_idx 0–499');
    expect(protocol).toContain('Task Score');
    expect(protocol).toContain('Exact Success');
    expect(protocol).toContain('Qualified Positive');
    expect(protocol).toContain('0.667');
    expect(protocol).toContain('/research/seed-openevo/webshop/');
    expect(protocol).toContain('#fig-seed-webshop');
    expect(protocol).toContain('/research/seed-openevo/loops/');
    expect(protocol).toContain('#fig-seed-openevo-update-target');
    expect(protocol).toContain('0b6e7dcc718a85ed967feb85b5c95fd68f92d38e');
  });

  it('keeps Q1–Q7 on the unified scaffold: badge, one-sentence conclusion, observation table, collapsible evidence', () => {
    expect(questions).toContain('我们现在能回答的七个问题');
    expect(questions).toContain('OpenEvo 真的发生了学习吗？');
    expect(questions).toContain('OpenEvo 有没有成功经验可以学习？');
    expect(questions).toContain('有成功经验以后，OpenEvo 能把它学进去吗？');
    expect(questions).toContain('学到的经验能迁移到新的任务吗？');
    expect(questions).toContain('第一代能迁移，是否意味着可以一直越学越好？');
    expect(questions).toContain('这些数字会不会只是工程故障的假象？');
    expect(questions).toContain('最后还缺哪一个关键实验？');

    expect(questions).toContain('已确立 · 工程闭环');
    expect(questions).toContain('已确立 · 数据内生');
    expect(questions).toContain('部分确立 · 拟合 ≠ 行为');
    expect(questions).toContain('已复现 · 单步泛化');
    expect(questions).toContain('未突破 · 演化受阻');
    expect(questions).toContain('已隔离 · 测量有效');
    expect(questions).toContain('待对齐 · 下一阶段');

    expect(questions).toContain('<details class="evidence-details" id={`evidence-${item.id}`} name="research-evidence">');
    expect(questions).toContain('证据链与代码回溯');
    expect(questions).toContain('结论边界：');
    expect(questions).not.toContain("href: '#evidence-q");
    expect(questions).not.toContain('查看证据链 →');
  });

  it('protects the key quantitative anchors and claim boundaries inside the question cards', () => {
    expect(questions).toContain('128');
    expect(questions).toContain('96');
    expect(questions).toContain('28');
    expect(questions).toContain('+0.124');
    expect(questions).toContain('[0.0326, 0.2194]');
    expect(questions).toContain('+0.1637');
    expect(questions).toContain('+0.2488');
    expect(questions).toContain('+0.0851');
    expect(questions).toContain('256 attempts');
    expect(questions).toContain('132');
    expect(questions).toContain('33');
    expect(questions).toContain('16 components · effective rank 64');
    expect(questions).toContain('formal evaluation denominator（正式评估分母）= 0');
    expect(questions).toContain('OpenEvo internal fresh task-ID-disjoint evaluation');
    expect(questions).toContain('SEED official held-out evaluation');
    expect(questions).toContain('不能写成“G2 已经在正式 T2 上证明迁移失败”');
    expect(questions).toContain('MVD0 REMEASUREMENT_INVALID');
    expect(questions).toContain('webshop_003560');
    expect(questions).toContain('webshop_004357');
    expect(questions).toContain('T2 remained closed（T2 保持关闭）');
  });

  it('preserves every original evidence link inside the collapsible layers', () => {
    const evidenceCopy = `${questions}\n${g2Ablation}`;
    expect(evidenceCopy).toContain('476039e9ce82767120db803d57f016db3b1414ce');
    expect(evidenceCopy).toContain('0b6e7dcc718a85ed967feb85b5c95fd68f92d38e');
    expect(evidenceCopy).toContain('d1f35ecdf84c61b07df7c646e83588d63b9297bd');
    for (const path of [
      'launch_h140_r2_g2_training.py',
      'h1.40-r2-g2-multigeneration-v1.json',
      'g2-training-reconciliation-v1.json',
      'launch_h0_success_discovery.sh',
      'h0-final-reconciliation.json',
      'OPEN_EVO_WEBSHOP_PROGRESS_REPORT_2026-08-15.md',
      'h1_closed_loop_tracked.py',
      'h1.11/task-manifest.json',
      'h1.11-reconciliation-v1.json',
      'h1.38b-method-control-eval-v1.json',
      'reconciliation-summary.json',
      'h1.38b-correction-02/REPORT.md',
      'h1.39-mr-independent-panel-v1.json',
      'h1.39-mr/REPORT.md',
      'formal-upstream-evaluation-v5b-summary.json',
      'FORMAL_UPSTREAM_EVALUATION_REPORT.md',
      'ARTIFACT_AUTOPSY.md',
      'H141_RECONCILIATION_V5.md',
      'H142_STAGE_B_CLOSEOUT.md',
      'stage-b-reconciliation.json',
      'stage-b-resource-accounting.json',
      'h1.30-seed-comparison.json',
      'launch_h130_seed_route_smoke.sh',
      'H1.30_STATUS.md',
    ]) {
      expect(evidenceCopy, `${path} must stay linked`).toContain(path);
    }
  });

  it('deepens the G2 negative result into a three-gate ablation with the mechanism hypothesis marked as diagnostic', () => {
    expect(g2Ablation).toContain('id="g2-ablation"');
    expect(g2Ablation).toContain('Gate 1 · 新经验获取');
    expect(g2Ablation).toContain('Gate 2 · 旧能力保留');
    expect(g2Ablation).toContain('Gate 3 · 迁移延续性');
    expect(g2Ablation).toContain('−0.1635');
    expect(g2Ablation).toContain('[−0.4073, 0.0355]');
    expect(g2Ablation).toContain('−0.065625');
    expect(g2Ablation).toContain('−0.0036');
    expect(g2Ablation).toContain('[−0.0801, 0.0755]');
    expect(g2Ablation).toContain('t2Opened = false');
    expect(g2Ablation).toContain('0.691');
    expect(g2Ablation).toContain('0.181');
    expect(g2Ablation).toContain('48 + 16');
    expect(g2Ablation).toContain('诊断信号，不是因果证明');
    expect(questions).toContain("href=\"#g2-ablation\"");
  });

  it('orders next steps by evidence gap and points at the experiment page', () => {
    expect(nextSteps).toContain('id="next-steps"');
    expect(nextSteps).toContain('Experience Replay');
    expect(nextSteps).toContain('0–499');
    expect(nextSteps).toContain('ALFWorld');
    expect(nextSteps).toContain("/research/seed-openevo/experiment/");
  });

  it('keeps the appendix complete: twelve notes, full lineage, RTX6 record, audit trail, print provenance', () => {
    for (const slug of noteSlugs) {
      expect(appendix, `${slug} missing from appendix or legacy links`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
    expect(appendix).toContain('data-testid="lineage-appendix"');
    expect(appendix).toContain('data-testid="rtx6-appendix"');
    expect(appendix).toContain('<Seed3090ParametricProgress locale={locale} />');
    expect(appendix).toContain('programTimeline.map');
    expect(appendix).toContain('openEvoProgramLinks.ledger');
    expect(appendix).toContain('openEvoProgramLinks.report');
    expect(appendix).toContain('openEvoProgramLinks.campaign');
    expect(appendix).toContain('@media print');
    expect(appendix).toContain('print-provenance');
    expect(appendix).toContain('H1.42 属于之后的 measurement-boundary（测量边界）工作');
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
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
    const publicCopy = [hero, protocol, questions, g2Ablation, nextSteps, appendix, nextProtocol, evidenceNoteScope, primerMoved].join('\n');
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

  it('keeps H1.42 as a later measurement-boundary note rather than part of the H1.41 conclusions', () => {
    expect(hero).toContain('H1.42 是之后产生的 measurement-boundary（测量边界）记录');
    expect(appendix).toContain('H1.42 属于之后的 measurement-boundary（测量边界）工作');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultNote).toContain("'measurement-boundary'");
    expect(resultNote).toContain('MVD0 REMEASUREMENT_INVALID');
    expect(resultNote).toContain('H1.40、H1.41、H1.42 的 T2 都保持关闭');
    expect(resultNote).toContain('不能支持 magnitude-reset mechanism effect');
  });
});
