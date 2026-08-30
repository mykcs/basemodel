import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/study/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/study/results.astro');
const experimentPage = read('../pages/research/seed-openevo/study/index.astro');
const researchDetail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const protocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const questions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
const wrapperAttribution = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const g2Ablation = read('../components/research/OpenEvoWebShopG2Ablation.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const evidenceRefs = read('../components/research/OpenEvoEvidenceRefs.astro');
const evidenceTypes = read('./researchEvidence.ts');
const appendix = read('../components/research/OpenEvoWebShopResultsAppendix.astro');
const nextProtocol = read('../components/research/OpenEvoNextExperimentProtocol.astro');
const evidenceNoteScope = read('../components/research/OpenEvoEvidenceNoteScope.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const resultRoute = read('../pages/research/seed-openevo/study/results/[note].astro');
const primerMoved = read('../components/research/ResearchPrimerMoved.astro');
const sitemap = read('./sitemapRoutes.ts');
const readerContract = read('../../docs/agents/current/seed-openevo-results-reader-contract.md');
const currentState = read('../../docs/agents/current/seed-openevo-results-current-state-2026-08-26.md');

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
  it('mounts the same six modules in the same order on both locale routes and keeps wrapper trace between questions and G2', () => {
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
      expect(page.indexOf('<OpenEvoActionWrapperAttribution locale={locale} />')).toBeGreaterThan(page.indexOf('<OpenEvoWebShopResultsQuestions locale={locale} />'));
      expect(page.indexOf('<OpenEvoActionWrapperAttribution locale={locale} />')).toBeLessThan(page.indexOf('<OpenEvoWebShopG2Ablation locale={locale} />'));
      expect(page).toContain('<OpenEvoWebShopCurrentQ7 locale={locale} />');
      expect(page).toContain("#q7 { display:none; }");
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
    expect(hero).toContain('同一 128 个任务先给基础模型做一遍，再给加载 SD-LoRA 的模型做一遍，共 256 个任务回合');
    expect(hero).toContain('统计区间仍然包含“没有差异”');
    expect(hero).toContain('128/128 表示计划的 128 个任务槽位全部核对通过');
    expect(hero).toContain('measurement-not-proven-stable-improvement');
    expect(hero).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(hero).toContain('专业解释：');
    expect(hero).not.toContain('95% CI');
    expect(hero).not.toContain('formal evaluation denominator');
    expect(hero).not.toContain('github.com/');
    expect(hero).toContain('机制结论以实验编号 H1.41 为时间截点');
    expect(hero).toContain('H1.42 是之后的测量校准记录');
  });

  it('keeps the Results-specific reader contract explicit and pairs it with the latest state override', () => {
    expect(readerContract).toContain('Default reader');
    expect(readerContract).toContain('First-screen promise');
    expect(readerContract).toContain('Chinese-first technical language');
    expect(readerContract).toContain('Density budget');
    expect(readerContract).toContain('Minimum reasoning bridge');
    expect(readerContract).toContain('你为什么这样说？');
    expect(readerContract).toContain('claim-level provenance');
    expect(readerContract).toContain('Observation-level evidence');
    expect(readerContract).toContain('Level A / closest to the fact');
    expect(readerContract).toContain('Any Agent making a non-trivial change to the Results route must');
    expect(currentState).toContain('128/128 runtime semantic validation PASS');
    expect(currentState).toContain('measurement-not-proven-stable-improvement');
    expect(currentState).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentState).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
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
    expect(protocol).toContain('OpenEvoEvidenceRefs');
    expect(protocol).toContain('envs.py#L115-L145');
    expect(protocol).toContain('/research/seed-openevo/flow/webshop/');
    expect(protocol).toContain('/research/seed-openevo/flow/loops/');
  });

  it('keeps Q1–Q7 with short current answers and claim-local experiment evidence', () => {
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
    expect(currentQ7).toContain('已完成 · 未证明稳定提升');
    expect(questions).toContain('现在的答案：');
    expect(questions).toContain('我们做了两次对照');
    expect(questions).toContain('这种学习在这两轮实验里还没有转化成稳定的新任务收益');
    expect(questions).toContain('七个问题 · SEVEN QUESTIONS');
    expect(questions).toContain('sources?: EvidenceRef[]');
    expect(questions).toContain('<OpenEvoEvidenceRefs locale={locale} sources={row.sources ?? []} compact />');
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
    expect(questions).toContain('T2 根本没有运行');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(questions).toContain('不能反过来改写 H1.41 的机制结论');
  });

  it('keeps historical repaired-primary evidence while current Q7 owns completed Track A', () => {
    expect(questions).toContain('768 个回合');
    expect(questions).toContain('BASE 0.0 / 0.0%');
    expect(questions).toContain('动作包装格式（wrapper）不兼容导致测量无效');
    expect(questions).toContain('BASE：任务完成度（Task Score）4.1 / 完整成功 0.0%');
    expect(questions).toContain('SD-LoRA：7.3 / 2.3%');
    expect(questions).toContain('自助法（bootstrap）95% CI [-0.65, +7.19]');
    expect(questions).toContain('数值 session index 不是完整任务身份');
    expect(questions).toContain('SEED-compatible');
    expect(questions).toContain('不是论文的确切评测分母');
    expect(currentQ7).toContain('128 / 128 PASS');
    expect(currentQ7).toContain('BASE 7.17 / 3.9%');
    expect(currentQ7).toContain('SD-LoRA 8.74 / 3.9%');
    expect(currentQ7).toContain('Δ +1.57');
    expect(currentQ7).toContain('95% CI [-3.21,+6.31]');
    expect(currentQ7).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
    expect(currentQ7).toContain('webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(hero).not.toContain('formal evaluation denominator（正式评估分母）= 0');
    expect(protocol).not.toContain('尚未执行');
  });

  it('binds the parser attribution to primary evidence with immutable exact-line URLs', () => {
    const provenanceCopy = `${questions}\n${wrapperAttribution}\n${protocol}`;
    expect(provenanceCopy).toContain('projection.py#L32-L40');
    expect(provenanceCopy).toContain('webshop.py#L25-L27');
    expect(wrapperAttribution).toContain('webshop_seed0_goal00395-2026082586.json');
    expect(wrapperAttribution).toContain('#L2-L12');
    expect(wrapperAttribution).toContain('#L42-L53');
    expect(provenanceCopy).toContain('inference.py#L227-L232');
    expect(wrapperAttribution).toContain('build_self_evolution_dataset.py#L67-L90');
    expect(wrapperAttribution).toContain('launch_h136_qwen7b_self_evolution.sh#L53-L69');
    expect(wrapperAttribution).toContain('8e526e42de82e3fb417eb6dc4d892e068d73ef1f');
    expect(wrapperAttribution).toContain('责任在我们的实验集成层。');
    expect(wrapperAttribution).toContain('不能继续定位到 Qwen2.5-7B-Instruct 的哪一条预训练 / SFT 数据');
    expect(wrapperAttribution).toContain('不声称 SD-LoRA 绝不可能改变 wrapper frequency');
  });

  it('uses one shared evidence vocabulary and accessible local source UI', () => {
    for (const kind of [
      'official-code', 'code', 'raw-episode', 'machine-result', 'config', 'manifest', 'commit',
      'runtime-receipt', 'preregistration', 'audit', 'human-report', 'design', 'historical-record',
    ]) {
      expect(evidenceTypes).toContain(`'${kind}'`);
    }
    for (const label of ['官方代码', '源代码', '原始回合', '机器结果', '实验配置', '任务清单', '提交记录', '运行凭据', '预注册', '审计', '人工报告', '实验设计', '历史记录']) {
      expect(evidenceTypes).toContain(label);
    }
    expect(evidenceRefs).toContain('aria-label');
    expect(evidenceRefs).toContain('target="_blank" rel="noreferrer"');
    expect(evidenceRefs).toContain('a:focus-visible');
    expect(evidenceRefs).toContain('overflow-wrap:anywhere');
  });

  it('keeps new historical scientific evidence immutable rather than floating on main', () => {
    for (const source of [protocol, questions, wrapperAttribution, g2Ablation, nextSteps]) {
      expect(source).not.toContain('/blob/main/');
    }
    expect(questions).toContain('2cf2fadca3c5aba28da68e8e1405182ba8d90e6c');
    expect(questions).toContain('1971fad6602d23d499a5de8bd4bf718947207d86');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
  });

  it('preserves the core historical evidence links plus repaired-primary and source-faithful evidence', () => {
    const evidenceCopy = `${questions}\n${g2Ablation}\n${currentQ7}`;
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
      'h1.13-reconciliation-v1.json',
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
      'webshop-seed-source-faithful-reproduction-v1-panel-v1.json',
    ]) {
      expect(evidenceCopy, `${path} must stay linked`).toContain(path);
    }
  });

  it('keeps the G2 three-gate explanation beginner-readable while rendering exact statistics only inside the evidence disclosure', () => {
    expect(g2Ablation).toContain('id="g2-ablation"');
    expect(g2Ablation).toContain('第二代为什么还不能说“越学越好”？');
    expect(g2Ablation).toContain('第一道门 · 学会新经验');
    expect(g2Ablation).toContain('第二道门 · 保住旧能力');
    expect(g2Ablation).toContain('第三道门 · 保住第一代收益');
    expect(g2Ablation).toContain('H1.40 和 H1.41 两轮里');
    expect(g2Ablation).toContain('不是凭感觉说“可能忘了”');
    expect(g2Ablation).toContain('t2Opened = false');
    expect(g2Ablation).toContain('诊断信号，不是因果证明');
    expect(g2Ablation).toContain('OpenEvoEvidenceRefs');
    expect(g2Ablation).toContain('展开实验依据');
    expect(g2Ablation).not.toContain('证据链与代码回溯');
    expect(g2Ablation).toContain('95% CI');
    expect(g2Ablation.indexOf('{retention.map')).toBeGreaterThan(g2Ablation.indexOf('<details class="evidence-details"'));
    expect(g2Ablation.indexOf('{preservation.map')).toBeGreaterThan(g2Ablation.indexOf('<details class="evidence-details"'));
    expect(questions).toContain('href="#g2-ablation"');
  });

  it('orders next steps around closed Track A, the WB1 state barrier, and ALFWorld', () => {
    expect(nextSteps).toContain('id="next-steps"');
    expect(nextSteps).toContain('路线 A 已完成：测量有效，但没有证明稳定胜出');
    expect(nextSteps).toContain('128/128 任务语义核对通过');
    expect(nextSteps).toContain('PUBLISHED_AND_VERIFIED');
    expect(nextSteps).toContain('公开代码能重建的“第一次验证”，不是论文最终 128 题');
    expect(nextSteps).toContain('也不是声称找回了论文 89.7 / 78.1% 当年使用的确切 128 题');
    expect(nextSteps).toContain('第 28 代状态断点已修复；路线 B / WB1 等待第 29 代授权');
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(nextSteps).toContain('第 28 代的 state-v28 已补齐、通过状态门并被正式采用');
    expect(nextSteps).toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).toContain('ALFWorld');
    expect(nextSteps).toContain('路线 B（Track B，WB1）');
    expect(nextSteps).toContain('只有路线 B 才能真正回答 OpenEvo vs SEED');
    expect(nextSteps).toContain('下一步实验 · NEXT STEPS');
    expect(nextSteps).toContain('/research/seed-openevo/study/');
  });

  it('keeps the historical records complete: twelve notes, lineage, RTX6 record, evidence trail, and print provenance', () => {
    for (const slug of noteSlugs) {
      expect(appendix, `${slug} missing from historical records`).toContain(`/${slug}/`);
      expect(resultRoute, `${slug} missing from static routes`).toContain(`'${slug}'`);
      expect(sitemap, `${slug} missing from sitemap`).toContain(`/research/seed-openevo/study/results/${slug}/`);
    }
    expect(appendix).toContain('历史实验与完整记录');
    expect(appendix).not.toContain('正文只放结论与关键数字');
    expect(appendix).toContain('data-testid="lineage-appendix"');
    expect(appendix).toContain('data-testid="rtx6-appendix"');
    expect(appendix).toContain('@media print');
    expect(appendix).toContain('print-provenance');
    expect(appendix).toContain('H1.42 发生在之后，属于测量边界（measurement-boundary）工作');
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('/research/seed-openevo/flow/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/flow/loops/#fig-seed-openevo-update-target');
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
