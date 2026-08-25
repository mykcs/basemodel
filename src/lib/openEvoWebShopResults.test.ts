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
const resultRoute = read('../pages/research/seed-openevo/results/[note].astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const sitemap = read('./sitemapRoutes.ts');
const readerContract = read('../../docs/agents/current/seed-openevo-results-reader-contract.md');

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
      expect(page).toContain('seed-openevo-results-reader-contract.md');
      let previous = -1;
      for (const component of moduleComponents) {
        const position = page.indexOf(`<${component} locale={locale} />`);
        expect(position, `${component} missing or out of order`).toBeGreaterThan(previous);
        previous = position;
      }
      expect(page).not.toContain('OpenEvoWebShopProgramReport');
      expect(page).not.toContain('data-program-report');
    }
    expect(resultsPageZh).toContain('OpenEvo × WebShop 研究结果');
    expect(resultsPageEn).toContain('OpenEvo × WebShop research findings');
    expect(researchDetail).toContain("title: t('OpenEvo × WebShop 研究结果', 'OpenEvo × WebShop research findings')");
  });

  it('starts with a low-density lab-reader summary rather than experiment IDs', () => {
    expect(hero).toContain('如果你已经知道实验室在做 OpenEvo × WebShop');
    expect(hero).toContain('已经看到');
    expect(hero).toContain('最新评测');
    expect(hero).toContain('还差一步');
    expect(hero).toContain('2026-08-25');
    expect(hero).toContain('测量无效');
    expect(hero).toContain('同一批 128 个保留任务');
    expect(hero).not.toContain('95% CI');
    expect(hero).not.toContain('task-ID-disjoint');
    expect(hero).not.toContain('formal evaluation denominator');
    expect(hero).toContain('机制结论截至 H1.41');
    expect(hero).toContain('H1.42 是之后的测量校准记录');
  });

  it('keeps the Results-specific reader contract explicit and mandatory', () => {
    expect(readerContract).toContain('Default reader');
    expect(readerContract).toContain('First-screen promise');
    expect(readerContract).toContain('Chinese-first technical language');
    expect(readerContract).toContain('Density budget');
    expect(readerContract).toContain('2026-08-25 SEED official-held-out comparison v1');
    expect(readerContract).toContain('Any Agent making a non-trivial change to the Results route must');
  });

  it('teaches the task split and only the two beginner scoring concepts before Q1–Q7', () => {
    expect(protocol).toContain('先记住两个任务范围');
    expect(protocol).toContain('Qwen2.5-7B-Instruct');
    expect(protocol).toContain('goal_idx ≥ 500');
    expect(protocol).toContain('goal_idx 0–499');
    expect(protocol).toContain('任务完成度 · Task Score');
    expect(protocol).toContain('完整成功 · Exact Success');
    expect(protocol).not.toContain('Qualified Positive');
    expect(protocol).not.toContain('0.667');
    expect(protocol).toContain('解析器（parser）');
    expect(protocol).toContain('测量无效（measurement-invalid）');
    expect(protocol).toContain('/research/seed-openevo/webshop/');
    expect(protocol).toContain('/research/seed-openevo/loops/');
  });

  it('keeps Q1–Q7 with short current answers and local experiment evidence', () => {
    expect(questions).toContain('我们现在能回答的七个问题');
    for (const question of [
      'OpenEvo 真的发生了学习吗？',
      'OpenEvo 有没有成功经验可以学习？',
      '有成功经验以后，OpenEvo 能把它学进去吗？',
      '学到的经验能迁移到新的任务吗？',
      '第一代能迁移，是否意味着可以一直越学越好？',
      '这些数字会不会只是工程故障的假象？',
      '最后还缺哪一个关键实验？',
    ]) {
      expect(questions).toContain(question);
    }
    expect(questions).toContain('现在的答案：');
    expect(questions).toContain('<details class="evidence-details" id={`evidence-${item.id}`} name="research-evidence">');
    expect(questions).toContain('展开实验依据');
    expect(questions).not.toContain('证据链与代码回溯');
    expect(questions.indexOf('<table class="obs-table">')).toBeGreaterThan(questions.indexOf('<details class="evidence-details"'));
    expect(questions).not.toContain("href: '#evidence-q");
    expect(questions).not.toContain('查看证据链 →');
  });

  it('protects the internal transfer, multi-generation, and measurement boundaries', () => {
    expect(questions).toContain('+0.124');
    expect(questions).toContain('[0.0326, 0.2194]');
    expect(questions).toContain('+0.1637');
    expect(questions).toContain('+0.2488');
    expect(questions).toContain('+0.0851');
    expect(questions).toContain('OpenEvo internal fresh task-ID-disjoint evaluation');
    expect(questions).toContain('它们不是 0–499 的 SEED 官方保留任务评估');
    expect(questions).toContain('第二代持续整合尚未建立');
    expect(questions).toContain('G2 已经在正式 T2 上证明迁移失败');
    expect(questions).toContain('T2 没有运行');
    expect(questions).toContain('H1.42 发生在 H1.41 之后');
    expect(questions).toContain('它不反过来改变 H1.41 时点的机制结论');
  });

  it('updates Q7 from denominator-zero planning to the completed-but-invalid held-out run', () => {
    expect(questions).toContain('首轮已跑 · 主评测待修复');
    expect(questions).toContain('128 tasks × 2 arms × 2 contracts = 512 episodes');
    expect(questions).toContain('BASE 0.0 / 0.0%');
    expect(questions).toContain('SD-LoRA 0.0 / 0.0%');
    expect(questions).toContain('测量无效，不能解释成模型能力');
    expect(questions).toContain('BASE：Task Score 14.6 / 完整成功 2.3%');
    expect(questions).toContain('SD-LoRA：28.3 / 1.6%');
    expect(questions).toContain('2 arms × 128 = 256 episodes，尚未运行');
    expect(questions).toContain('与 SEED 评测设置兼容（SEED-compatible）');
    expect(questions).toContain('不是论文确切的评估分母');
    expect(questions).toContain('SEED checkpoint 也没有在本地复现');
    expect(questions).toContain('c155ae10b78be8f2a208c54ff3a0cb383f318bbc');
    expect(questions).toContain('seed-official-heldout-comparison-v1/RESULTS.md');
    expect(hero).not.toContain('formal evaluation denominator（正式评估分母）= 0');
    expect(protocol).not.toContain('尚未执行');
  });

  it('preserves the core historical evidence links plus the new held-out evidence', () => {
    const evidenceCopy = `${questions}\n${g2Ablation}`;
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
      'H141_RECONCILIATION_V5.md',
      'H142_STAGE_B_CLOSEOUT.md',
      'stage-b-reconciliation.json',
      'seed-official-heldout-comparison-v1/RESULTS.md',
      'seed-official-heldout-comparison-v1/PREREGISTRATION.md',
      'seed-official-heldout-comparison-v1/results/analysis.json',
      'H1.30_STATUS.md',
    ]) {
      expect(evidenceCopy, `${path} must stay linked`).toContain(path);
    }
  });

  it('keeps the G2 three-gate ablation as the detailed second-generation record', () => {
    expect(g2Ablation).toContain('id="g2-ablation"');
    expect(g2Ablation).toContain('Gate 1 · 新经验获取');
    expect(g2Ablation).toContain('Gate 2 · 旧能力保留');
    expect(g2Ablation).toContain('Gate 3 · 迁移延续性');
    expect(g2Ablation).toContain('t2Opened = false');
    expect(g2Ablation).toContain('诊断信号，不是因果证明');
    expect(questions).toContain('href="#g2-ablation"');
  });

  it('orders next steps around the repaired held-out rerun, multi-generation work, and ALFWorld', () => {
    expect(nextSteps).toContain('id="next-steps"');
    expect(nextSteps).toContain('先把官方保留任务的测量修好');
    expect(nextSteps).toContain('共 256 次');
    expect(nextSteps).toContain('经验回放（Experience Replay）');
    expect(nextSteps).toContain('ALFWorld');
    expect(nextSteps).toContain('/research/seed-openevo/experiment/');
  });

  it('keeps the appendix complete: twelve notes, lineage, RTX6 record, audit trail, and print provenance', () => {
    for (const slug of noteSlugs) {
      expect(appendix, `${slug} missing from appendix or legacy links`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
    expect(appendix).toContain('data-testid="lineage-appendix"');
    expect(appendix).toContain('data-testid="rtx6-appendix"');
    expect(appendix).toContain('@media print');
    expect(appendix).toContain('print-provenance');
    expect(appendix).toContain('H1.42 属于之后的 measurement-boundary（测量边界）工作');
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
  });

  it('keeps H1.42 as a later measurement-boundary note rather than part of the H1.41 conclusions', () => {
    expect(hero).toContain('H1.42 是之后的测量校准记录');
    expect(appendix).toContain('H1.42 属于之后的 measurement-boundary（测量边界）工作');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultNote).toContain("'measurement-boundary'");
  });

  it('keeps the experiment route mounted while Results owns the updated benchmark-facing status', () => {
    expect(experimentPage).toContain('OpenEvoNextExperimentProtocol');
    expect(nextProtocol).toContain('NEXT EXPERIMENT');
    expect(nextProtocol).toContain('下一场真正关键的实验是什么？');
  });
});
