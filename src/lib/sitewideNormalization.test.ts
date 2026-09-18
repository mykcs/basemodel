import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const core = read('../components/research/SeedOpenEvoResearchPageCore.astro');
const sdLoraHistory = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const sdLoraHistoryNav = read('../components/research/OpenEvoSdLoraHistorySeriesNav.astro');
const vanillaSdLoraSlide = read('../components/research/OpenEvoVanillaSdLoraSlide.astro');
const experimentResults = read('../components/research/OpenEvoExperimentResultsScaffold.astro');
const archive = read('../components/research/OpenEvoExperimentArchive.astro');
const capabilityRoutes = read('../data/capabilityReaderRoutes.ts');
const runGuide = read('../components/OpenEvoSeedBenchmarksGuide.astro');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const baseModelCompat = read('../pages/research/seed-openevo/flow/base-model/index.astro');
const studyDesignCompat = read('../pages/research/seed-openevo/study/design/index.astro');
const alfworldZh = read('../pages/research/seed-openevo/flow/alfworld.astro');
const alfworldEn = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/flow/alfworld.astro.archive');
const modelsIndex = read('../pages/_bodies/models-index.astro');
const modelDetail = read('../pages/_bodies/model-detail.astro');
const papersIndex = read('../pages/_bodies/papers-index.astro');
const paperDetail = read('../pages/_bodies/paper-detail.astro');
const paperLearningGuide = read('../components/papers/PaperLearningGuide.astro');
const agentToSeedBridge = read('../components/AgentToSeedBridge.astro');
const q17FrontierRoadmap = read('../components/research/OpenEvoQ17FrontierRoadmap.astro');
const ceilingStrategy = read('../components/research/OpenEvoCeilingStrategy.astro');
const seedPaper = read('../content/papers/seed.json');
const researchHub = read('../components/research/SeedOpenEvoResearchHub.astro');
const briefingNotes = read('../components/research/SeedOpenEvoBriefingTechnicalNotes.astro');
const movedPrimer = read('../components/research/ResearchPrimerMoved.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const gdrDirectApply = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');
const gatedDeltaExplainer = read('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro');
const mechanismMap = read('../components/research/OpenEvoMechanismMap.astro');
const capabilityLobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const briefingTechnicalRoute = read('../pages/research/seed-openevo/study/briefing/technical-notes/index.astro');
const readerContractsSource = read('../data/siteReaderContracts.ts');
const harness2Study = read('../components/research/OpenEvoHarness2MiniStudy.astro');
const resultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const resultNoteRoute = read('../pages/research/seed-openevo/study/results/[note].astro');
const legacyStage2Journey = read('../components/research/OpenEvoLegacyStage2ResearchJourney.astro');
const trainingDesign = read('../components/research/SeedOpenEvoTrainingDesignOverview.astro');
const experimentSelector = read('../components/research/OpenEvoExperimentSelector.astro');
const sitemapRoutes = read('./sitemapRoutes.ts');
const explainerStyles = [
  read('../styles/interactive-research-explainer-core.css'),
  read('../styles/interactive-research-explainer-environments.css'),
  read('../styles/interactive-research-explainer-methods.css'),
].join('\n');

describe('sitewide normalization first repair batch', () => {
  it('introduces ALFWorld as a benchmark before mechanism details and aligns its reader contract', () => {
    expect(detail).toContain("title: t('ALFWorld 任务与评测', 'ALFWorld tasks and evaluation')");
    expect(detail).toContain('ALFWorld 是一个文本化具身任务 benchmark');
    expect(detail).toContain('these metrics are not interchangeable with WebShop normalized Score');
    expect(detail).not.toContain("title: t('ALFWorld 世界状态与任务成功'");

    const contract = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-alfworld');
    expect(contract?.attentionMode).toBe('reference');
    expect(contract?.primaryTask).toContain('ALFWorld 是什么');
    expect(contract?.firstViewportGoal).toContain('文本化具身任务 benchmark');
    expect(contract?.mustStayVisible).toContain('WebShop normalized Score / exact Success');
    expect(contract?.firstViewportSelector).toBe('.plain-detail__header p');
  });

  it('keeps the benchmark overview title bilingual instead of leaking Chinese into English', () => {
    expect(detail).toContain("title: t('ALFWorld 与 WebShop', 'ALFWorld and WebShop')");
  });

  it('keeps Flow concept relationships editorial instead of rebuilding a card wall', () => {
    expect(core).toContain('.two-grid article,.four-grid article,.status-board article{padding:.8rem 0 0;border-top:2px');
    expect(core).toContain('.step-track li::before,.comparison-route li::before');
    expect(core).toContain('.control-list li{padding:.72rem 0;border-top:1px solid var(--line)');
    expect(core).not.toContain('.two-grid article,.four-grid article,.status-board article{padding:.95rem;border:1px solid var(--line);');
    expect(detail).toContain('ALFWorld 看 Agent 能否完成家务目标');
    expect(detail).toContain('SEED 把任务轨迹变成下一版 policy 参数');
  });

  it('keeps benchmark section order while removing redundant hierarchy kickers', () => {
    const start = core.indexOf("{page === 'benchmarks'");
    const end = core.indexOf("{page === 'webshop'");
    const block = core.slice(start, end);
    expect(block).toContain('<span>01</span>');
    expect(block).toContain('<span>02</span>');
    expect(block).toContain('<span>03</span>');
    expect(block).toContain("t('交互与评测', 'Interaction and evaluation')");
    expect(block).toContain("t('结果与轨迹证据', 'Outcome and trajectory evidence')");
    expect(block).toContain("t('公平比较协议', 'Fair-comparison protocol')");
    expect(block).not.toContain("<small>{t('环境', 'Environments')}</small>");
    expect(block).not.toContain("<small>{t('证据', 'Evidence')}</small>");
    expect(block).not.toContain("<small>{t('对比', 'Comparison')}</small>");
  });

  it('removes only the redundant SD-LoRA overview eyebrow and preserves child sequence metadata', () => {
    expect(sdLoraHistory).not.toContain('SD-LoRA 专题总览');
    expect(sdLoraHistory).not.toContain('SD-LoRA SERIES OVERVIEW');
    expect(sdLoraHistory).toContain('!overview && <p class="series-page__eyebrow">');
    expect(sdLoraHistory).toContain('`${item!.number} / 07`');
  });

  it('keeps the SD-LoRA chapter navigator as quiet editorial links instead of a rounded-card rail', () => {
    expect(sdLoraHistoryNav).toContain('border-top:1px solid var(--line)');
    expect(sdLoraHistoryNav).toContain('border-bottom:2px solid transparent');
    expect(sdLoraHistoryNav).toContain("a[aria-current='page']{border-bottom-color:var(--accent-deep);color:var(--ink)}");
    expect(sdLoraHistoryNav).not.toContain('border-radius:var(--radius-panel)');
    expect(sdLoraHistoryNav).not.toContain('background:var(--surface-muted)');
  });

  it('keeps ordinary explanation in editorial sequences while preserving real choice, status, and evidence cards', () => {
    expect(agentToSeedBridge).toContain('<ol class="bridge-steps">');
    expect(agentToSeedBridge).not.toContain('<div class="bridge-grid">');
    expect(agentToSeedBridge).not.toContain('.bridge-grid article');
    expect(agentToSeedBridge).toContain('SEED / OpenEvo 更新机制');

    expect(q17FrontierRoadmap).toContain('<ol class="experiment-list">');
    expect(q17FrontierRoadmap).not.toContain('<div class="experiment-grid">');
    expect(q17FrontierRoadmap).toContain('class="metric-grid"');
    expect(q17FrontierRoadmap).toContain('class="blank-grid"');
    expect(q17FrontierRoadmap).toContain('class="boundary-box"');

    expect(ceilingStrategy).toContain('<ol class="ceiling__learning-list">');
    expect(ceilingStrategy).not.toContain('<div class="ceiling__cards">');
    expect(ceilingStrategy).toContain('class="ceiling__budget"');
    expect(ceilingStrategy).toContain('class="ceiling__rounds"');
    expect(ceilingStrategy).toContain('class="ceiling__carrier-grid"');
    expect(ceilingStrategy).toContain('class="ceiling__arm-status"');
  });

  it('keeps model and paper reference routes content-first instead of hiding useful content behind viewport-height spacers', () => {
    expect(modelsIndex).toContain('class="models-reading-lenses"');
    expect(modelsIndex).toContain("'身份' : 'Identity'");
    expect(modelsIndex).toContain("'证据' : 'Evidence'");
    expect(modelsIndex).not.toContain('min-height:clamp(420px,62svh,620px)');
    expect(modelsIndex).not.toContain('min-height:calc(100svh - 96px)');

    expect(papersIndex).toContain('class="papers-reading-path"');
    expect(papersIndex).toContain("['研究问题', '先确认论文试图解决的具体研究问题，以及它改变了哪个 Agent 环节。']");
    expect(papersIndex).toContain("['复现资料', '最后核对代码、模型、数据、环境与证据缺口，再决定适合严格复现还是方法复现。']");
    expect(papersIndex).not.toContain('min-height:calc(100svh - 110px)');
    expect(papersIndex).not.toContain('min-height:calc(100svh - 96px)');

    expect(modelDetail).toContain('class="model-detail-quickfacts"');
    expect(modelDetail).toContain("'目录资源档位' : 'Catalog resource tier'");
    expect(modelDetail).not.toContain('min-height:min(540px,calc(100svh - 116px))');
    expect(modelDetail).not.toContain('min-height:calc(100svh - 102px)');
    expect(paperDetail).not.toContain("<div class=\"section-kicker\">{locale === 'zh' ? '方法' : 'Method'}</div>");
  });

  it('aligns direct comparisons on shared axes instead of making readers compare detached cards from memory', () => {
    expect(benchmarkNote).toContain('class="shared-axis-table"');
    expect(benchmarkNote).toContain('训练候选池与正式保留池对照');
    expect(benchmarkNote).toContain('稀疏反馈与稠密反馈对照');
    expect(benchmarkNote).not.toContain('class="two-column"');

    expect(ceilingStrategy).toContain('两版 Stage 2 更新规则');
    expect(ceilingStrategy).toContain('<table>');
    expect(ceilingStrategy).not.toContain('<section class="ceiling__section ceiling__compare">');

    expect(gdrDirectApply).toContain('旧 GDR-v1 与 DirectApply 每一步对照');
    expect(gdrDirectApply).toContain('<th scope="row">04</th>');
    expect(gdrDirectApply).not.toContain('<figure>\n        <figcaption><strong>GDR-v1</strong>');

    expect(harness2Study).toContain('128 对尝试的无效动作终止配对矩阵');
    expect(harness2Study).toContain('仅候选组因无效动作终止');
    expect(harness2Study).not.toContain('<article class="warn"><span>{q.paired.candidateOnlyInvalid}</span>');
  });


  it('keeps sequence and branch topology visible when responsive layouts recompose', () => {
    expect(harness2Study).toContain('data-flow-branch="paired-arms"');
    expect(harness2Study).toContain(`role="group" aria-label={t('同一起点分成两个配对实验组'`);
    expect(harness2Study).toContain('.h2study__flow-branches::before');
    expect(harness2Study).toContain('.h2study__flow-branches>.h2study__flow-node::before');
    expect(harness2Study).not.toContain('.h2study__flow-node+ .h2study__flow-node{margin-top:.8rem}');

    expect(legacyStage2Journey).toContain('<ol class="legacy-journey__timeline" data-flow-sequence="stage2-genealogy">');
    expect(legacyStage2Journey).toContain('.legacy-journey__timeline li:not(:last-child)::after');
    expect(legacyStage2Journey).not.toContain("content:'→'");
    expect(legacyStage2Journey).not.toContain('grid-template-columns:repeat(2,minmax(0,1fr))}.legacy-journey__timeline');

    expect(trainingDesign).toContain('.responsibility-flow li:not(:last-child)::before');
    expect(trainingDesign).toContain('@media(max-width:950px)');
    expect(trainingDesign).toContain('.responsibility-flow{grid-template-columns:1fr;gap:.75rem}');
    expect(trainingDesign).not.toContain("content:'↓'");

    expect(experimentSelector).toContain('@media(max-width:980px){.experiment-selector__flow{grid-template-columns:1fr}');
    expect(experimentSelector).not.toContain('.experiment-selector__flow>.experiment-selector__arrow:nth-of-type(2){display:none}');
  });

  it('keeps public headings on the subject instead of telling the reader how to read them', () => {
    expect(paperLearningGuide).toContain("isZh ? '复现边界' : 'Reproduction boundaries'");
    expect(paperLearningGuide).not.toContain("isZh ? '常见误解' : 'Common misunderstandings'");
    expect(paperLearningGuide).not.toContain("isZh ? '论文学习' : 'Paper learning'");
    expect(seedPaper).toContain('长程轨迹的稀疏奖励问题');
    expect(seedPaper).not.toContain('先读问题，不先读公式');
    expect(seedPaper).not.toContain('Read the problem before the equations');

    expect(researchHub).toContain("t('模型、任务与比较范围', 'Models, tasks, and comparison scope')");
    expect(researchHub).toContain("t('WebShop 两阶段学习', 'WebShop two-stage learning')");
    expect(researchHub).toContain("t('实验运行与结果比较', 'Experiment execution and result comparison')");
    expect(researchHub).not.toContain('下面用 WebShop 展开两阶段');

    expect(briefingNotes).toContain("t('64-component 上限的科研含义', 'Research meaning of the 64-component limit')");
  });

  it('uses one reader-facing name for Task Vector while preserving distinct GDR method identities', () => {
    const taskVectorOwners = [mechanismMap, capabilityLobby, briefing, briefingNotes, briefingTechnicalRoute, readerContractsSource];
    for (const source of taskVectorOwners) {
      expect(source).not.toMatch(/TaskVectors?/);
    }
    expect(briefing).toContain('Task Vector、GDR、DirectApply / No-GDR');
    expect(briefingNotes).toContain('4. Task Vector：从 SD-LoRA 更新到真实参数方向');
    expect(mechanismMap).toContain('作为 Task Vector');
    expect(capabilityLobby).toContain('Task Vectors and parameter themes');

    expect(gdrDirectApply).toContain('历史 GDR-v1 / DirectApply');
    expect(gdrDirectApply).toContain('Gated-Delta SD-LoRA');
    expect(gatedDeltaExplainer).toContain('Gated Delta Rule 简式');
    expect(gatedDeltaExplainer).toContain('Gated-Delta SD-LoRA');
  });

  it('keeps long-tail compatibility routes as redirects and historical notes explicitly historical', () => {
    expect(movedPrimer).toContain('window.location.replace(target)');
    expect(movedPrimer).not.toContain('class="eyebrow"');
    expect(movedPrimer).not.toContain('border-radius:18px');
    expect(sitemapRoutes).toContain('export const zhOnlyCompatibilityPaths');
    expect(sitemapRoutes).not.toContain("  '/guide/today/',\n  '/research/seed-openevo/study/results/webshop-training/'");
    expect(benchmarkNote).toContain('历史基准设计');
    expect(benchmarkNote).toContain('历史设计记录：');
    expect(benchmarkNote).toContain('/study/capability-exploration/openevo-2-0/');
    expect(resultNote).toContain('截至 H1.42 的结论与证据边界');
    expect(resultNoteRoute).toContain('OpenEVO WebShop 历史实验：截至 H1.42 的结论与证据边界');
  });

  it('keeps ALFWorld route metadata object-first in both locales', () => {
    expect(alfworldZh).toContain('title="ALFWorld 任务与评测"');
    expect(alfworldZh).toContain('文本化具身任务 benchmark');
    expect(alfworldEn).toContain('title="ALFWorld tasks and evaluation"');
    expect(alfworldEn).toContain('text-based embodied-task benchmark');
  });

  it('introduces SEED and OpenEvo as methods before internal mechanism jargon', () => {
    expect(detail).toContain("title: t('SEED 学习流程与参数更新', 'SEED learning flow and parameter updates')");
    expect(detail).toContain('SEED 是一种让 Agent 用自己的任务轨迹继续训练 policy 的方法');
    expect(detail).toContain("title: t('OpenEvo 跨任务演化流程', 'OpenEvo cross-task evolution flow')");
    expect(detail).toContain('OpenEvo 是一个让 Agent 在任务之间保留并验证学习结果的演化框架');

    const seed = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-seed');
    const openevo = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-openevo');
    expect(seed?.firstViewportGoal).toContain('SEED 是用任务轨迹继续训练 policy 的方法');
    expect(seed?.firstViewportSelector).toBe('.plain-detail__header p');
    expect(openevo?.firstViewportGoal).toContain('OpenEvo 是跨任务演化框架');
    expect(openevo?.mustStayVisible).toContain('任务内行为与任务后演化边界');
    expect(openevo?.firstViewportSelector).toBe('.plain-detail__header p');
  });

  it('explains Vanilla SD-LoRA flow directly without narrating the rejected card metaphor', () => {
    expect(vanillaSdLoraSlide).toContain('上一轮选定的累计 LoRA 先做 128 次 WebShop 任务尝试');
    expect(vanillaSdLoraSlide).toContain('The cumulative LoRA selected last round runs 128 WebShop attempts');
    expect(vanillaSdLoraSlide).not.toContain('四张卡片');
    expect(vanillaSdLoraSlide).not.toContain('four cards in a row');
  });

  it('keeps the historical four-arm page result-first instead of narrating an unfinished scaffold', () => {
    expect(experimentResults).toContain('历史结果已整理；3B/MiniMax 无 final eval');
    expect(experimentResults).toContain('缺失不能填成 0');
    expect(experimentResults).toContain('不把这些差异直接写成 MiniMax 或模型规模的因果效应');
    expect(experimentResults).not.toContain('等待四组结果齐全');
    expect(experimentResults).not.toContain('页面骨架冻结：2026-08-29');
    expect(experimentResults).not.toContain('Waiting for all four arms');
    expect(experimentResults).not.toContain('Page scaffold frozen: 2026-08-29');
  });

  it('keeps special page types honest about archive, operational, deck, and compatibility roles', () => {
    expect(archive).toContain('这是技术与历史档案，不是当前运行状态页');
    expect(archive).toContain('not a live-run status page');
    expect(capabilityRoutes).toContain('这是技术与历史档案，不代表当前运行状态');
    expect(capabilityRoutes).toContain('not live run state');

    expect(runGuide).toContain('先确认授权。');
    expect(runGuide).toContain('Technical capability is not project authorization');
    expect(runGuide).toContain('从 Gate 01 开始 ↓');

    expect(briefing).toContain('--deck-w:1280px');
    expect(briefing).toContain('--deck-h:720px');
    expect(briefing).toContain('class="briefing-slide');

    for (const page of [baseModelCompat, studyDesignCompat]) {
      expect(page).toContain('window.location.replace(target)');
    }
  });

  it('keeps shared interactive explainers on the site typography token instead of a parallel monospace stack', () => {
    expect(explainerStyles).toContain('var(--font-mono)');
    expect(explainerStyles).not.toContain('ui-monospace,SFMono-Regular,Menlo,monospace');
  });

});
