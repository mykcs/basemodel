import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const resultsPageZh = read('../pages/research/seed-openevo/study/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/study/results.astro');
const experimentPage = read('../pages/research/seed-openevo/study/index.astro');
const designPage = read('../pages/research/seed-openevo/study/design/index.astro');
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
      expect(page).not.toContain("body:has([data-testid='openevo-webshop-result-index']) .plain-detail__header");
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
      expect(page).not.toContain("#q7 { display:none; }");
      expect(page).not.toContain('OpenEvoWebShopProgramReport');
      expect(page).not.toContain('data-program-report');
    }
    expect(resultsPageZh).toContain('OpenEvo × WebShop 研究结果');
    expect(resultsPageEn).toContain('OpenEvo × WebShop research findings');
    expect(researchDetail).toContain("title: t('OpenEvo × WebShop 研究结果', 'OpenEvo × WebShop research findings')");
  });

  it('starts with direct human-readable findings and keeps machine identity out of the primary reading line', () => {
    expect(hero).toContain('如果你知道实验室正在比较 OpenEvo、SEED 和 WebShop');
    expect(hero).toContain('已经知道');
    expect(hero).toContain('最新评测');
    expect(hero).toContain('接下来');
    expect(hero).toContain('模型从自己做成功的任务里学习一次以后');
    expect(hero).toContain('同一 128 个任务已经先给基础模型做一遍，再给加载 OpenEvo 学习结果后的模型做一遍，共 256 个任务回合');
    expect(hero).toContain('统计范围仍然包含“没有差异”');
    expect(hero).toContain('这 128 个任务先按 SEED 公开代码逐题核对，128/128 都确认一致');
    expect(hero).not.toContain('measurement-not-proven-stable-improvement');
    expect(hero).not.toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(hero).not.toContain('专业解释：');
    expect(hero).not.toContain('95% CI');
    expect(hero).not.toContain('formal evaluation denominator');
    expect(hero).not.toContain('github.com/');
    expect(hero).toContain('href="#evidence-q4"');
    expect(hero).toContain('href="#evidence-q7"');
    expect(hero).toContain('href="#next-n2"');
    expect(hero).toContain('机制结论以 8 月 21 日完成的 H1.41 实验为截止点');
    expect(hero).toContain('8 月 25 日的动作读取修复、8 月 26 日的任务构建复查');
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

  it('explains the two task populations and the two scoring concepts locally before Q1–Q7', () => {
    expect(protocol).toContain('训练范围内未见任务与 SEED 验证任务');
    expect(protocol).toContain('训练范围内没有见过的任务');
    expect(protocol).toContain('任务 500–6909');
    expect(protocol).toContain('SEED 留作验证的任务');
    expect(protocol).toContain('任务 0–499');
    expect(protocol).toContain('任务完成度（Task Score）');
    expect(protocol).toContain('完整成功（Exact Success）');
    expect(protocol).not.toContain('Qualified Positive');
    expect(protocol).not.toContain('0.667');
    expect(protocol).not.toContain('goal_idx');
    expect(protocol).not.toContain('projectTerms');
    expect(protocol).not.toContain('专业解释：');
    expect(protocol).toContain('只对上任务编号也不够');
    expect(protocol).toContain('实验边界');
    expect(protocol).toContain('OpenEvoEvidenceRefs');
    expect(protocol).toContain('envs.py#L115-L145');
    expect(protocol).toContain('h1.38b-method-control-eval-v1.json');
    expect(protocol).toContain('h1.39-mr-independent-panel-v1.json');
    expect(protocol).toContain('SEED_WEBSHOP_PUBLIC_CODE_REPRODUCTION_V1.md');
    expect(protocol).toContain('webshop-seed-source-faithful-reproduction-v1-semantic-validation.json');
    expect(protocol).toContain('webshop_seed0_goal00395-2026082586.json#L42-L53');
    expect(protocol).toContain('seed-official-heldout-comparison-v1/v2/analysis-v2.json');
    expect(protocol).toContain('/research/seed-openevo/flow/webshop/');
    expect(protocol).toContain('/research/seed-openevo/flow/loops/');
  });

  it('keeps Q1–Q7 with short current answers and claim-local experiment evidence', () => {
    expect(questions).toContain('七个研究问题');
    for (const question of [
      'OpenEvo 真的发生了学习吗？',
      'OpenEvo 有没有成功经验可以学习？',
      '有成功经验以后，OpenEvo 能把它学进去吗？',
      '学到的经验能迁移到新的任务吗？',
      '第一代能迁移，是否意味着可以一直越学越好？',
      '这些数字会不会只是工程故障的假象？',
    ]) {
      expect(questions).toContain(question);
    }
    expect(questions).not.toContain("id: 'q7'");
    expect(questions).not.toContain('Track A 当前是 PREPARED');
    expect(questions).not.toContain('formal execution not authorized');
    expect(currentQ7).toContain('id="q7"');
    expect(currentQ7).toContain('还缺的方法级对照');
    expect(currentQ7).toContain('已完成 · 未证明稳定提升');
    expect(questions).not.toContain('现在的答案：');
    expect(questions).not.toContain('专业解释：');
    expect(questions).toContain('class="supporting-context"');
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
    expect(questions).toContain('训练使用的 500–6909 号范围');
    expect(questions).toContain('不是 SEED 留作正式验证的 0–499 号任务');
    expect(questions).toContain('连续整合尚未建立');
    expect(questions).toContain('不能写成“模型已经在这项测试上迁移失败”');
    expect(questions).toContain('预留的新任务测试因为前面的能力检查没有通过而没有启动');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(questions).toContain('不能反过来改写 H1.41 的机制结论');
  });

  it('keeps historical repaired-primary evidence while current Q7 owns completed Track A', () => {
    expect(questions).toContain('768 个回合');
    expect(questions).toContain('两个模型都出现 0 分');
    expect(questions).toContain('这个 0 说明动作读取接口失效，不能解释成模型能力为 0');
    expect(questions).toContain('BASE 4.1 / 0.0%，SD-LoRA 7.3 / 2.3%');
    expect(questions).toContain('自助法（bootstrap）95% CI [-0.65, +7.19]');
    expect(protocol).toContain('只对上任务编号也不够：随机抽样方式会改变任务顺序和最终文字');
    expect(currentQ7).toContain('不是论文当年最终使用的确切 128 题');
    expect(currentQ7).toContain('也没有复现 SEED 论文模型保存点对应的 89.7 / 78.1%');
    expect(currentQ7).toContain('128 / 128 PASS');
    expect(currentQ7).toContain('BASE 7.17 / 3.9%');
    expect(currentQ7).toContain('SD-LoRA 8.74 / 3.9%');
    expect(currentQ7).toContain('Δ +1.57');
    expect(currentQ7).toContain('95% CI [-3.21,+6.31]');
    expect(currentQ7).toContain('PUBLISHED_AND_VERIFIED');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
    expect(currentQ7).toContain('webshop-seed-source-faithful-reproduction-v1-panel-v1.json');
    expect(currentQ7).toContain('server/evidence/analysis.json');
    expect(currentQ7).toContain('server/evidence/reconciliation.json');
    expect(currentQ7).toContain('id="evidence-q7"');
    expect(currentQ7).toContain('sources={[trackAAnalysis, trackAReconciliation]}');
    expect(currentQ7).toContain('sources={[trackASemanticValidation]}');
    expect(currentQ7).toContain('sources={[trackACloseout, trackAEvidenceManifest]}');
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

  it('keeps historical evidence immutable while making the one live WB1 router explicit', () => {
    for (const source of [protocol, questions, wrapperAttribution, g2Ablation]) {
      expect(source).not.toContain('/blob/main/');
    }
    expect(questions).toContain('2cf2fadca3c5aba28da68e8e1405182ba8d90e6c');
    expect(questions).toContain('1971fad6602d23d499a5de8bd4bf718947207d86');
    expect(currentQ7).toContain('f80ae1816384bb7e8e82d193b22644e17f561f19');
    expect(nextSteps).toContain('https://github.com/mykcs/openevo-experiment/blob/main/configs/experiment/current-campaign.json');
    expect(nextSteps).toContain('2026-09-01');
    expect(nextSteps).toContain('d471341e518ed4568fc84f4f732784d091613b03');
    expect(nextSteps).toContain('c2791000a3af97190c264ba5ea39f0c4e5f65823');
    expect(nextSteps).toContain('state-v28 采纳时的不可变 campaign 快照');
  });

  it('preserves the core historical evidence links plus repaired-primary and source-faithful evidence', () => {
    const evidenceCopy = `${protocol}\n${questions}\n${g2Ablation}\n${currentQ7}`;
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
      'webshop-seed-source-faithful-reproduction-v1-panel-v1.json',
    ]) {
      expect(evidenceCopy, `${path} must stay linked`).toContain(path);
    }
  });

  it('keeps the G2 three-gate explanation beginner-readable while rendering exact statistics only inside the evidence disclosure', () => {
    expect(g2Ablation).toContain('id="g2-ablation"');
    expect(g2Ablation).toContain('第二次更新后的能力保持');
    expect(g2Ablation).not.toContain('专业解释：');
    expect(g2Ablation).toContain('第一道门 · 学会新经验');
    expect(g2Ablation).toContain('第二道门 · 保住旧能力');
    expect(g2Ablation).toContain('第三道门 · 保住第一代收益');
    expect(g2Ablation).toContain('H1.40 和 H1.41 两轮里');
    expect(g2Ablation).toContain('这是目前最一致的风险信号');
    expect(g2Ablation).toContain('不能证明 retention 就是阻止第二代持续改进的唯一或主要因果瓶颈');
    expect(g2Ablation).not.toContain('这是目前证据最一致的瓶颈');
    expect(g2Ablation).toContain('t2Opened = false');
    expect(g2Ablation).toContain('诊断信号，不是因果证明');
    expect(g2Ablation).toContain('OpenEvoEvidenceRefs');
    expect(g2Ablation).toContain('展开实验依据');
    expect(g2Ablation).not.toContain('证据链与代码回溯');
    expect(g2Ablation).toContain('95% CI');
    expect(g2Ablation.indexOf('{retention.map')).toBeGreaterThan(g2Ablation.indexOf('<details class="evidence-details"'));
    expect(g2Ablation.indexOf('{preservation.map')).toBeGreaterThan(g2Ablation.indexOf('<details class="evidence-details"'));
    expect(questions).toContain('href="#g2-ablation"');
    expect(resultNote).toContain('经验供给已经证明不是零，但这不等于供给一定充足');
    expect(resultNote).not.toContain('经验供给不是当前直接瓶颈');
  });

  it('orders next steps around the completed 128-task measurement, method-level resumption gate, and ALFWorld', () => {
    expect(nextSteps).toContain('id="next-steps"');
    expect(nextSteps).toContain('下一轮 OpenEvo 与 SEED 公平比较');
    expect(nextSteps).toContain('同一 128 个任务的两模型测量已完成');
    expect(nextSteps).toContain('全部 256 个原始任务回合以及对账、分析和运行凭据已逐文件校验并发布');
    expect(nextSteps).toContain('这个面板不是论文最终 128 题');
    expect(nextSteps).toContain('不能当作论文 89.7 / 78.1% 的精确复现');
    expect(nextSteps).toContain('方法对方法比较等待继续授权');
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(nextSteps).toContain('WB1 live router · main');
    expect(nextSteps).toContain('恢复执行前必须重新读取最新的运行授权');
    expect(nextSteps).toContain('id={`next-${step.index.toLowerCase()}`}');
    expect(nextSteps).toContain('原本漏存的训练状态也已经在不重跑 WebShop、不使用 GPU 的前提下补齐并核对通过');
    expect(nextSteps).not.toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).toContain('ALFWorld');
    expect(nextSteps).toContain('两轮比较回答不同问题');
    expect(nextSteps).toContain('只有后一个实验才能直接回答 OpenEvo 与 SEED 的公平比较');
    expect(nextSteps).toContain('<details class="step-detail">');
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
    expect(appendix).toContain('H1.42 历史 campaign 快照');
    expect(appendix).not.toContain('Current campaign config');
    expect(resultRoute).toContain('ResearchPrimerMoved');
    expect(primerMoved).toContain('/research/seed-openevo/flow/webshop/#fig-seed-webshop');
    expect(primerMoved).toContain('/research/seed-openevo/flow/loops/#fig-seed-openevo-update-target');
  });

  it('keeps later measurement work separate from the H1.41 mechanism conclusions without surfacing another experiment code in the hero', () => {
    expect(hero).toContain('机制结论以 8 月 21 日完成的 H1.41 实验为截止点');
    expect(hero).toContain('8 月 25 日的动作读取修复');
    expect(hero).not.toContain('H1.42 是之后的测量校准记录');
    expect(appendix).toContain('H1.42 发生在之后，属于测量边界（measurement-boundary）工作');
    expect(evidenceNoteScope).toContain('H1.42 发生在 H1.41 之后');
    expect(resultNote).toContain("'measurement-boundary'");
  });

  it('keeps the study overview focused while Design owns the detailed follow-up protocol', () => {
    expect(experimentPage).not.toContain('OpenEvoNextExperimentProtocol');
    expect(designPage).toContain('OpenEvoNextExperimentProtocol');
    expect(nextProtocol).toContain('HISTORICAL DESIGN · NEXT BENCHMARK');
    expect(nextProtocol).toContain('完整预算的 OpenEvo × SEED 公平比较');
  });
});
