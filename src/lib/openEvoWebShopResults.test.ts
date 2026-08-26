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

  it('starts with a plain-language summary followed by a compact professional layer', () => {
    expect(hero).toContain('如果你知道实验室正在比较 OpenEvo、SEED 和 WebShop');
    expect(hero).toContain('已经知道');
    expect(hero).toContain('最新评测');
    expect(hero).toContain('接下来');
    expect(hero).toContain('模型从自己做成功的任务里学习一次以后');
    expect(hero).toContain('修复“评分工具读错模型动作”的问题后');
    expect(hero).toContain('配对置信区间（paired confidence interval）仍包含 0');
    expect(hero).toContain('源码忠实任务槽位（source-faithful task slots）');
    expect(hero).toContain('专业解释：');
    expect(hero).not.toContain('95% CI');
    expect(hero).not.toContain('formal evaluation denominator');
    expect(hero).toContain('机制结论截至 H1.41');
    expect(hero).toContain('H1.42 是之后的测量校准记录');
  });

  it('keeps the Results-specific reader contract explicit and mandatory', () => {
    expect(readerContract).toContain('Default reader');
    expect(readerContract).toContain('First-screen promise');
    expect(readerContract).toContain('Chinese-first technical language');
    expect(readerContract).toContain('Density budget');
    expect(readerContract).toContain('Minimum reasoning bridge');
    expect(readerContract).toContain('你为什么这样说？');
    expect(readerContract).toContain('2026-08-25 SEED official-held-out comparison v1 + repaired PRIMARY-v2');
    expect(readerContract).toContain('Post-v2 source-semantics audit and source-faithful successor');
    expect(readerContract).toContain('Any Agent making a non-trivial change to the Results route must');
  });

  it('teaches the task split and only the two beginner scoring concepts before Q1–Q7', () => {
    expect(protocol).toContain('先分清两种“新任务”');
    expect(protocol).toContain('Qwen2.5-7B-Instruct');
    expect(protocol).toContain('goal_idx ≥ 500');
    expect(protocol).toContain('goal_idx 0–499');
    expect(protocol).toContain('任务完成度（Task Score）');
    expect(protocol).toContain('完整成功（Exact Success）');
    expect(protocol).not.toContain('Qualified Positive');
    expect(protocol).not.toContain('0.667');
    expect(protocol).toContain('解析器（parser）');
    expect(protocol).toContain('测量无效（measurement-invalid）');
    expect(protocol).toContain('编号范围对了');
    expect(protocol).toContain('实验边界 · PROTOCOL');
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
    expect(questions).toContain('我们做了两次对照');
    expect(questions).toContain('这种学习在这两轮实验里还没有转化成稳定的新任务收益');
    expect(questions).toContain('七个问题 · SEVEN QUESTIONS');
    expect(questions).toContain('机器结果（Machine result）');
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
    expect(questions).toContain('不能反过来改写 H1.41 的机制结论');
  });

  it('updates Q7 through repaired primary v2 and the source-semantics audit', () => {
    expect(questions).toContain('修复后复测已完成 · 源码语义待验证');
    expect(questions).toContain('768 个回合');
    expect(questions).toContain('BASE 0.0 / 0.0%');
    expect(questions).toContain('动作包装格式（wrapper）不兼容导致测量无效');
    expect(questions).toContain('BASE：任务完成度（Task Score）4.1 / 完整成功 0.0%');
    expect(questions).toContain('SD-LoRA：7.3 / 2.3%');
    expect(questions).toContain('自助法（bootstrap）95% CI [-0.65, +7.19]');
    expect(questions).toContain('数值 session index 不是完整任务身份');
    expect(questions).toContain('design-only-not-authorized');
    expect(questions).toContain('SEED-compatible');
    expect(questions).toContain('不是论文的确切评测分母');
    expect(questions).toContain('checkpoint / training）仍未在本地复现');
    expect(questions).toContain('429faae1acc1132f8bdad4269a4e15864a9cccb0');
    expect(questions).toContain('seed-official-heldout-comparison-v1/v2/analysis-v2.json');
    expect(questions).toContain('seed-webshop-public-code-reproduction-v1.json');
    expect(hero).not.toContain('formal evaluation denominator（正式评估分母）= 0');
    expect(protocol).not.toContain('尚未执行');
  });

  it('preserves the core historical evidence links plus repaired-primary and source-faithful evidence', () => {
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
      'seed-official-heldout-comparison-v1/v2/analysis-v2.json',
      'seed-official-heldout-comparison-v1/v2/reconciliation-v2.json',
      'SEED_WEBSHOP_PUBLIC_CODE_REPRODUCTION_V1.md',
      'seed-webshop-public-code-reproduction-v1.json',
    ]) {
      expect(evidenceCopy, `${path} must stay linked`).toContain(path);
    }
  });

  it('keeps the G2 three-gate explanation beginner-readable while preserving exact evidence', () => {
    expect(g2Ablation).toContain('id="g2-ablation"');
    expect(g2Ablation).toContain('第二代为什么还不能说“越学越好”？');
    expect(g2Ablation).toContain('第一道门 · 学会新经验');
    expect(g2Ablation).toContain('第二道门 · 保住旧能力');
    expect(g2Ablation).toContain('第三道门 · 保住第一代收益');
    expect(g2Ablation).toContain('H1.40 和 H1.41 两轮里');
    expect(g2Ablation).toContain('不是凭感觉说“可能忘了”');
    expect(g2Ablation).toContain('t2Opened = false');
    expect(g2Ablation).toContain('诊断信号，不是因果证明');
    expect(g2Ablation).toContain('展开实验依据');
    expect(g2Ablation).not.toContain('证据链与代码回溯');
    expect(g2Ablation.indexOf('95% CI')).toBeGreaterThan(g2Ablation.indexOf('<details class="evidence-details"'));
    expect(questions).toContain('href="#g2-ablation"');
  });

  it('orders next steps around source-faithful semantics, multi-generation work, and ALFWorld', () => {
    expect(nextSteps).toContain('id="next-steps"');
    expect(nextSteps).toContain('先把 SEED 真正会看到的 128 个任务重建出来');
    expect(nextSteps).toContain('两次干净构建必须得到相同 canonical hash');
    expect(nextSteps).toContain('BASE 与 OpenEvo SD-LoRA 都保持冻结');
    expect(nextSteps).toContain('经验回放（experience replay）');
    expect(nextSteps).toContain('ALFWorld');
    expect(nextSteps).toContain('路线 B（Track B，WB1）');
    expect(nextSteps).toContain('下一步实验 · NEXT STEPS');
    expect(nextSteps).toContain('/research/seed-openevo/experiment/');
  });

  it('keeps the historical records complete: twelve notes, lineage, RTX6 record, evidence trail, and print provenance', () => {
    for (const slug of noteSlugs) {
      expect(appendix, `${slug} missing from historical records`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/results/${slug}/`);
    }
    expect(appendix).toContain('历史实验与完整记录');
    expect(appendix).not.toContain('正文只放结论与关键数字');
    expect(appendix).toContain('data-testid="lineage-appendix"');
    expect(appendix).toContain('data-testid="rtx6-appendix"');
    expect(appendix).toContain('@media print');
    expect(appendix).toContain('print-provenance');
    expect(appendix).toContain('H1.42 发生在之后，属于测量边界（measurement-boundary）工作');
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('/research/seed-openevo/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
  });

  it('keeps H1.42 as a later measurement-boundary note rather than part of the H1.41 conclusions', () => {
    expect(hero).toContain('H1.42 是之后的测量校准记录');
    expect(appendix).toContain('H1.42 发生在之后，属于测量边界（measurement-boundary）工作');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultNote).toContain("'measurement-boundary'");
  });

  it('keeps the experiment route mounted while Results owns the updated benchmark-facing status', () => {
    expect(experimentPage).toContain('OpenEvoNextExperimentProtocol');
    expect(nextProtocol).toContain('NEXT EXPERIMENT');
    expect(nextProtocol).toContain('下一场真正关键的实验是什么？');
  });
});