import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const technical = read('../components/research/SeedOpenEvoBriefingTechnicalNotes.astro');
const longDynamics = read('../data/openEvoLongRunTrainingDynamics.ts');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');
const zhPage = read('../pages/research/seed-openevo/study/briefing/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/briefing/index.astro');
const zhTechnical = read('../pages/research/seed-openevo/study/briefing/technical-notes/index.astro');
const enTechnical = read('../pages/en/research/seed-openevo/study/briefing/technical-notes/index.astro');
const zhFrontierPage = read('../pages/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/index.astro');
const enFrontierPage = read('../pages/en/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/index.astro');
const frontierRoadmap = read('../components/research/OpenEvoQ17FrontierRoadmap.astro');
const contracts = read('../data/siteReaderContracts.ts');
const directApplyLiveSnapshot = JSON.parse(read('../../public/research/seed-openevo/evidence/q17-directapply-live-snapshot-20260910-0952-sgt.json'));
const directApplyPlateauDiagnostic = JSON.parse(read('../../public/research/seed-openevo/evidence/q17-directapply-plateau-diagnostic-20260910-1038-sgt.json'));
const directApplyFrontierPlan = JSON.parse(read('../../public/research/seed-openevo/evidence/q17-directapply-frontier-plan-20260910-2312-sgt.json'));
const directApplyLiveDynamics = read('../data/openEvoDirectApplyLiveDynamics.ts');
const sitemap = read('./sitemapRoutes.ts');

const sectionPosition = (id: string) => briefing.indexOf(`<section id="${id}"`);

describe('SEED × OpenEVO summer review HTML deck', () => {
  it('publishes the bilingual deck and bilingual technical drill-down', () => {
    expect(zhPage).toContain('OpenEVO 暑期考核汇报');
    expect(enPage).toContain('OpenEVO Summer Research Review');
    expect(zhTechnical).toContain('技术推导与实验严谨性');
    expect(enTechnical).toContain('Technical derivations and experimental rigor');
    expect(zhFrontierPage).toContain('R127 与 R128 同题重测');
    expect(enFrontierPage).toContain('R127 vs R128 on the Same 32 Tasks');
    expect(nav).toContain("id: 'briefing'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/technical-notes/'");
    expect(sitemap).toContain("'/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/'");
  });

  it('keeps a twenty-four-slide deck with page numbers only on inner slides', () => {
    expect((briefing.match(/<section /g) ?? []).length).toBe(24);
    for (let page = 2; page <= 23; page += 1) expect(briefing).toContain(`${String(page).padStart(2, '0')} / 24`);
    expect(briefing).not.toContain('01 / 24');
    expect(briefing).not.toContain('<p class="slide-number">24 / 24</p>');
    expect(briefing).not.toContain('class="slide-next"');
    expect(briefing).not.toContain('返回顶部');
  });

  it('keeps the literal 1280×720 composition and scales the whole slide on phone', () => {
    expect(briefing).toContain('--deck-w:1280px;--deck-h:720px;--deck-scale:1;--scaled-deck-w:1280px;--scaled-deck-h:720px');
    expect(briefing).toContain('.briefing-slide{position:relative;width:var(--scaled-deck-w);height:var(--scaled-deck-h)');
    expect(briefing).toContain('width:var(--deck-w);height:var(--deck-h)');
    expect(briefing).toContain('transform:scale(var(--deck-scale));transform-origin:top left');
    expect(briefing).toContain('overflow-x:hidden');
    expect(briefing).toContain('const scale = availableWidth / 1280');
    expect(briefing).toContain("deck.style.setProperty('--scaled-deck-h', `${720 * scale}px`)");
    expect(briefing).not.toContain('zoom:var(--deck-scale)');
    expect(briefing).not.toContain('width:calc(100vw - 20px);height:auto');
  });

  it('uses a normal cover/agenda and a science-story overview without checklist overload', () => {
    expect(briefing).toContain('OpenEVO 在 WebShop 上到底学到了什么？');
    expect(briefing).toContain("{t('目录', 'Agenda')}");
    expect(briefing).toContain('参数往哪改、哪些改动最后被用上');
    for (const staleReaderJargon of ['参数方向与更新准入', 'accepted rollout', 'W&B 可核验', 'authority 的 loss']) {
      expect(briefing).not.toContain(staleReaderJargon);
    }
    expect(briefing).toContain("{t('先看三件事', 'Three things to know')}");
    expect(briefing).not.toContain("Too long, Don't read");
    expect(briefing).toContain('我们做过哪些科学尝试');
    expect(briefing).toContain('science-path-list');
    for (const attempt of [
      '先让训练真正发生',
      '撤掉旧 Stage 2 更新门槛，解开“最多 64 个参数组件”的代码上限',
      '再排除简单解释',
      '多给时间、扩记忆、修动作接口',
      '具体一次只改一件事：把步数从 15 加到 30；把记忆输出上限从 2048 加到 4096',
      '最后追参数机制',
      'TaskVector、GDR、DirectApply / No-GDR',
    ]) expect(briefing).toContain(attempt);
    const summarySlide = briefing.slice(sectionPosition('science-attempts'), sectionPosition('results'));
    expect(summarySlide).not.toContain('science-attempt-list');
    expect(summarySlide).not.toContain('<span>01</span>');
  });

  it('shows the results first, with the protocol boundary before the table numbers', () => {
    expect(sectionPosition('results')).toBeLessThan(sectionPosition('openevo-method'));
    expect(briefing).toContain('Score 看任务要求完成了多少');
    expect(briefing).toContain('Succ. 看整道任务是否完整成功');
    expect(briefing).toContain('SEED 论文分数与 OpenEVO 本地终评来自不同评测口径');
    expect(briefing).toContain('SEED 89.7 是论文报告值；OpenEVO 49.33 来自我们本地冻结 128 题终评');
    expect(briefing).toContain('89.7 − 49.33 不能当作最终能力差距');
    expect(briefing.indexOf('两组数字回答的评测问题不同')).toBeLessThan(briefing.indexOf('<table class="paper-table">'));
    expect(briefing).toContain('https://arxiv.org/abs/2207.01206');
    expect(briefing).toContain('https://arxiv.org/abs/2607.14777');
    expect(briefing).toContain('GDR 这个名字来自 Gated Delta Rule');
  });

  it('uses the requested Score / Succ table and authoritative OpenEVO row order only', () => {
    expect(briefing).toContain('<th>Method / Model</th>');
    expect(briefing).toContain('WebShop Score');
    expect(briefing).toContain('WebShop Succ.');
    const rows = ["OpenEVO {t('（7B，长周期训练）'", "OpenEVO {t('（3B，独立实验线）'", "OpenEVO {t('（1.7B，GDR）'", "OpenEVO {t('（1.7B，DirectApply）'"];
    const positions = rows.map((row) => briefing.indexOf(row));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(briefing).toContain('<td>49.33</td><td>45.31%</td>');
    expect(briefing).toContain('<td>37.60</td><td>0.78%</td>');
    expect((briefing.match(/<td>—<\/td><td>—<\/td>/g) ?? []).length).toBe(2);
  });

  it('separates the earliest 7B baseline-like stage from the later full long-run state', () => {
    expect(briefing).toContain('早期 7B 先验证经验能否写进参数；完整长跑后来才带上四类学习状态');
    expect(briefing).toContain('早期 7B 更像一个基础对照');
    expect(briefing).toContain('180 × 8');
    expect(briefing).toContain('MiniMax review');
    expect(briefing).toContain('LoRA / SD-LoRA');
    expect(briefing).toContain('这时还没有后来长跑里的四类滚动状态');
    expect(briefing).toContain('后来每 128 次新任务形成一轮');
    for (const carrier of ['Text Memory', 'Skill Bundle', 'Agent System', 'SD-LoRA']) expect(briefing).toContain(carrier);
    expect(briefing).toContain('SD-LoRA 这一轮不动，也不等于其他状态没有学习');
    expect(briefing).toContain('系统能写出新的记忆、技能或参数，不等于模型真的会用它们把任务做得更好');
    expect(briefing).toContain("const harnessBenefitPaperHref = 'https://arxiv.org/abs/2605.30621'");
    expect(briefing).toContain('相关论文：会更新 ≠ 会受益 ↗');
  });

  it('explains how the old control condition blocked Stage 2 and fixes the scientific rule', () => {
    expect(briefing).toContain('训练跑了很久，但参数一次都没有更新');
    expect(briefing).toContain('原本用途：控制实验');
    expect(briefing).toContain('8 个任务身份 × 每个 2 条成功');
    expect(briefing).toContain('后来误用：Stage 2 更新门槛');
    expect(briefing).toContain('做了 20,480 次任务尝试、拿到 797 条成功轨迹，参数还是 0 次更新');
    expect(briefing).toContain('撤掉这个人数门槛');
    expect(briefing).toContain('一轮做 128 次 WebShop 任务');
    expect(briefing).toContain('至少有一道题完整成功，而且记录有效');
    expect(briefing).toContain('这一轮不更新');
    expect(briefing).not.toContain('NOOP');
    expect(sectionPosition('stage2-gate')).toBeLessThan(sectionPosition('component-cap'));
  });

  it('treats the 64-component stop as its own engineering-capacity pivot, not a scientific ceiling', () => {
    expect(briefing).toContain('参数开始连续更新后，第 64 个参数组件撞到代码上限');
    expect(briefing).toContain('64 被确认只是实现层的容量限制');
    expect(briefing).toContain('它没有承担“模型只能学 64 次”的科学假设');
    expect(briefing).toContain('保持其他实验规则不变后，7B 继续越过 64');
    expect(briefing).toContain('143 次真正采用的 SD-LoRA 更新');
    expect(briefing).not.toContain('51→52 qualification');
    expect(sectionPosition('component-cap')).toBeLessThan(sectionPosition('seven-b'));
  });

  it('keeps 7B training Score, SD-LoRA loss, and frozen final as three measurements', () => {
    expect(briefing).toContain('我们做了一次 7B 长跑：训练在变好，冻结终评是 49.33');
    expect(briefing).toContain('149 轮 · 19,072 次任务尝试');
    expect(briefing).toContain('143 个点 = 143 次真正采用的参数更新');
    expect(briefing).toContain('49.33 · 58 / 128');
    expect(briefing).toContain('三种数要分开读');
    expect(briefing).toContain('SEED 7B 论文参照 89.7 · 评测方式不同');
    expect(sectionPosition('seven-b')).toBeLessThan(sectionPosition('diagnostic-entry'));
    expect(briefing.slice(sectionPosition('seven-b'), sectionPosition('diagnostic-entry'))).not.toContain('TaskVector');
  });

  it('pins 7B and 1.7B training charts to canonical W&B identities', () => {
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-7b-202609041833-b01d24a468'");
    expect(longDynamics).toContain('sealedRounds: 149');
    expect(longDynamics).toContain('candidateUpdateCount: 143');
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-qwen3-1p7b-202609041833-4c1bb58e9f'");
    expect(longDynamics).toContain('sealedRounds: 160');
    expect(longDynamics).toContain('candidateUpdateCount: 44');
    expect(longDynamics).toContain('acceptedUpdateCount: 7');
  });

  it('starts diagnostics from low score and observed failure traces before interventions', () => {
    expect(briefing).toContain('分数很低，我们先去看日志，找具体卡点');
    expect(briefing).toContain('先看失败轨迹和训练日志');
    expect(briefing).toContain('有些失败任务把 15 步全部走完');
    expect(briefing).toContain('一直在 next / back 等几个导航动作里绕');
    expect(briefing).toContain('Text Memory 在汇总 20 条记录时会撞到一次生成的 2048-token 上限');
    expect(briefing.indexOf('有些失败任务把 15 步全部走完')).toBeLessThan(briefing.indexOf('<strong>15 → 30</strong>'));
    expect(briefing.indexOf('Text Memory 在汇总 20 条记录时会撞到一次生成的 2048-token 上限')).toBeLessThan(briefing.indexOf('<strong>2048 → 4096 → 10+10</strong>'));
  });

  it('closes the 15→30 diagnostic with trace evidence and a changed judgment', () => {
    expect(briefing).toContain('多给 15 步，模型还是在几个导航动作里打转');
    expect(briefing).toContain('next（下一页）和 back（返回）');
    expect(briefing).toContain('一直没有进入 buy（购买）');
    expect(briefing).toContain('多出来的 15 步没有打开新路径');
    expect(briefing).toContain('15 步和 30 步两种条件的任务得分都为 0');
    expect(briefing).toContain('采用第二种方案：保持原提示词，只把 15 步改成 30 步');
    expect(briefing).toContain('这一步排除的是“15 步太短”这个具体解释，没有解决最终低分');
    expect(briefing).toContain('下一步把动作选择提示词单独拿出来测试，再继续检查动作接口');
    for (const technicalOnly of ['64 / 64', 'Δ = 0.0', '6 / 8']) expect(briefing).not.toContain(technicalOnly);
    expect(technical).toContain('64 条比较中 64 条尝试都有效');
  });

  it('keeps the state-aware prompt experiments as a separate causal chain after the horizon test', () => {
    expect(sectionPosition('horizon-diagnostic')).toBeLessThan(sectionPosition('prompt-diagnostic'));
    expect(sectionPosition('prompt-diagnostic')).toBeLessThan(sectionPosition('capacity-diagnostic'));
    for (const item of [
      '会看当前页面再决定动作',
      '连续翻页最多 2 次',
      'H1.8 共 128 次尝试',
      '4 次正向结果',
      'H1.9 换两组独立随机种子再测',
      '一共得到 8 次正向结果',
      'H1.10 换到新任务后也出现了正向结果',
      '还不能解释为什么整体分数低',
    ]) expect(briefing).toContain(item);
  });

  it('keeps the Text Memory capacity recovery bounded and does not claim a benchmark gain', () => {
    expect(briefing).toContain('Text Memory 整理 20 条记录时会撞到输出上限');
    expect(briefing).toContain('2048 → 4096');
    expect(briefing).toContain('同一批 20 条记录修复一次后若仍饱和');
    expect(briefing).toContain('10 + 10');
    expect(briefing).toContain('容量一满就卡死');
    expect(briefing).toContain('不等于证明最终 WebShop 分数因此提高');
    expect(briefing).not.toContain('最终采用 A2 方案');
    expect(technical).toContain('max split depth is one');
  });

  it('uses 3B as a cheap diagnostic line without inventing a frozen final', () => {
    expect(briefing).toContain('我们用 3B 做便宜诊断：动作接口修好后，训练过程仍在上升');
    expect(briefing).toContain('3B 先收集一轮基础经验');
    expect(briefing).toContain('动作执行框架、合法动作限制和不会冲突的动作编码修好');
    expect(briefing).toContain('旧实验曾经因为动作格式和解析出错而拿到假 0 分');
    expect(briefing).toContain('123</strong>{t(\' 个封存轮次\'');
    expect(briefing).toContain('31</strong>{t(\' 次候选训练\'');
    expect(briefing).toContain('—</strong>{t(\' 无同口径冻结终评\'');
    expect(briefing).toContain('没有再出现工程无效、解析修复或非法动作终止');
    expect(technical).toContain('15,744 次正式环境尝试');
  });

  it('keeps TaskVector as a plain-language parameter diagnostic, not a benchmark score', () => {
    const taskSlide = briefing.slice(sectionPosition('mechanism'), sectionPosition('m1a-identifiability'));
    expect(taskSlide).toContain('参数确实在变，但它们到底朝哪里变？');
    expect(taskSlide).toContain('TaskVector 可以理解成一支“参数方向箭头”');
    expect(taskSlide).toContain('v = θ<sub>after</sub> − θ<sub>before</sub>');
    expect(taskSlide).toContain('‖v‖ 看参数移动的大小');
    expect(taskSlide).toContain('方向相似度（cosine）看相邻两次更新');
    expect(taskSlide).toContain('固定 24 个输入的第一选择全部翻转：24 / 24');
    expect(taskSlide).toContain('最终 WebShop 成绩仍由冻结终评回答');
    expect(taskSlide).toContain('href={taskArithmeticHref}');
    expect(briefing).toContain("const taskArithmeticHref = 'https://arxiv.org/abs/2212.04089'");
    expect(taskSlide).toContain("PR #317 · {t('参数行为干预证据'");
  });

  it('shows the M1-A identifiability failure and its distinct-state successor as a scientific self-correction', () => {
    const m1aSlide = briefing.slice(sectionPosition('m1a-identifiability'), sectionPosition('gdr'));
    expect(m1aSlide).toContain('75% 和 100% 其实是同一个模型状态');
    expect(m1aSlide).toContain('R27 / R49 / R49 / R49');
    expect(m1aSlide).toContain('75% = 100% = R49');
    expect(m1aSlide).toContain('θ₁₀₀% − θ₇₅% = 0');
    expect(m1aSlide).toContain('最后一段方向根本量不出来');
    expect(m1aSlide).toContain('R14 → R27 → R49');
    expect(m1aSlide).toContain('0.6082257746');
    expect(m1aSlide).toContain('只修复“能不能量”的问题');
    expect(m1aSlide).toContain('href={m1aPr350Href}');
    expect(m1aSlide).toContain('href={m1aPr358Href}');
    expect(briefing).toContain("const m1aPr350Href = 'https://github.com/mykcs/openevo-experiment/pull/350'");
    expect(briefing).toContain("const m1aPr358Href = 'https://github.com/mykcs/openevo-experiment/pull/358'");
    expect(technical).toContain('√(δcᵀGδc) = 0.6082257746');
    expect(technical).toContain('PR #358 · R14 / R27 / R49 与 Frobenius 几何证据');
  });

  it('separates the Gated Delta Networks paper mechanism from the local GDR-v1 admission rule', () => {
    const gdrSlide = briefing.slice(sectionPosition('gdr'), sectionPosition('one-seven-b'));
    expect(gdrSlide).toContain('为什么训练好的参数更新，还要再做一次 16 题小测？');
    expect(gdrSlide).toContain('GDR 这个名字来自 Gated Delta Rule');
    expect(gdrSlide).toContain('Gated Delta Networks 论文只提供“更新可以被一道门控制”的背景');
    expect(gdrSlide).toContain('我们本地真正做的事很简单');
    expect(gdrSlide).toContain('当前模型 + 训练好的候选更新 → 固定 16 题小测 → 用不用这次更新');
    expect(gdrSlide).toContain('没有把论文公式直接当成我们的 16 题规则');
    expect(gdrSlide).toContain('一次很短的小测，会不会过早拒绝那些短期不够好、但长期可能有用的更新？');
    expect(briefing).toContain('https://arxiv.org/abs/2412.06464');
    expect(technical).toContain('固定的 16-task 短期 probe');
  });

  it('shows the authoritative 1.7B GDR result including frozen exact success', () => {
    expect(briefing).toContain('训练产生了 44 个参数候选，GDR 只让 7 个进入后续模型');
    expect(briefing).toContain('160 轮 / 20,480 次任务都跑完了');
    expect(briefing).toContain('44</strong>{t(\' 次候选训练\'');
    expect(briefing).toContain('7</strong>{t(\' 次 GDR 同意真正应用\'');
    expect(briefing).toContain('37</strong>{t(\' 次训练结果被 GDR 拒绝\'');
    expect(briefing).toContain('37.60 · 1 / 128');
    expect(briefing).toContain('被拒绝的 37 个候选没有留下可作为可靠依据的 loss');
  });

  it('keeps DirectApply as the one-variable causal comparison while preserving safety contracts', () => {
    expect(briefing).toContain('DirectApply 只改一件事：不再让固定 16 题小测二次否决');
    expect(briefing).toContain('冻结起点、任务、数据和 SD-LoRA 训练方法尽量保持一样');
    expect(briefing).toContain('通过共同的数据检查、工程安全检查和可重复性检查');
    expect(briefing).toContain('两条实验真正不同的地方只剩一件事：这次 16 题小测有没有最后否决权');
    expect(briefing).toContain('候选更新 → 固定 16 题小测 → 用 / 不用');
    expect(briefing).toContain('候选更新 → 共同检查通过 → 直接带到下一轮');
    expect(briefing).toContain('冻结终评仍未打开');
    expect(technical).toContain('16-task task-score probe 不再拥有接受 / 拒绝决定权');
  });

  it('shows the current No-GDR snapshot with the same Score/loss chart grammar and no frozen-final claim', () => {
    expect(sectionPosition('directapply')).toBeLessThan(sectionPosition('directapply-progress'));
    expect(sectionPosition('directapply-progress')).toBeLessThan(sectionPosition('directapply-plateau'));
    expect(sectionPosition('directapply-plateau')).toBeLessThan(sectionPosition('frontier-roadmap'));
    expect(sectionPosition('frontier-roadmap')).toBeLessThan(sectionPosition('technical-work-summary'));
    const directApplySection = briefing.slice(sectionPosition('directapply-progress'), sectionPosition('directapply-plateau'));
    for (const item of [
      'DirectApply 前期抬高了分数，最近进入震荡平台',
      '2026-09-10 09:52 SGT',
      '和 7B、3B、1.7B GDR 一样，用左侧 Score 图和右侧 SD-LoRA loss 图展示训练过程',
      '训练过程中每轮 WebShop Score',
      'SD-LoRA training loss',
      '每个点=DirectApply 已采用的候选更新',
      '影子 GDR 只打诊断标签，不控制训练',
      'R70–79 / R80–89 / R90–97 的均值是 58.35 → 55.36 → 50.83',
      '09:52 SGT 运行中快照',
      'current No-GDR controller · 911e3afe',
    ]) expect(directApplySection).toContain(item);
    expect(directApplySection).toContain('class="dynamics-grid"');
    expect(directApplySection).toContain('scoreRawPointsDirectApply');
    expect(directApplySection).toContain('lossPointsDirectApply');
    expect(directApplySection).not.toContain('live-progress-grid');
    expect(briefing).toContain('DirectApply 的最终 Score / Succ. 继续保持空白');
    expect(directApplyLiveSnapshot.snapshot_label_sgt).toBe('2026-09-10T09:52:00+08:00');
    expect(directApplyLiveSnapshot.status).toBe('LIVE_TRAINING_SNAPSHOT_NOT_FINAL_EVALUATION');
    expect(directApplyLiveSnapshot.controller_sha).toBe('911e3afec1bc14d2194fa59b8feb3a232c34da85');
    expect(directApplyLiveSnapshot.metrics.sealed_rounds).toBe(98);
    expect(directApplyLiveSnapshot.metrics.formal_rollouts).toBe(12544);
    expect(directApplyLiveSnapshot.metrics.sd_lora_candidates_trained).toBe(97);
    expect(directApplyLiveSnapshot.metrics.directapply_admissions).toBe(97);
    expect(directApplyLiveSnapshot.metrics.final_panel_access_count).toBe(0);
    expect(directApplyLiveSnapshot.metrics.shadow_gdr_labels).toEqual({ pass: 42, reject: 55, total: 98 });
    expect(directApplyLiveSnapshot.metrics.training_round_score_mean_pct.latest_20).toBeCloseTo(53.0628, 3);
    expect(directApplyLiveSnapshot.metrics.sd_lora_training_loss.latest).toBeCloseTo(0.107326, 6);
    expect(directApplyLiveSnapshot.score).toHaveLength(98);
    expect(directApplyLiveSnapshot.loss).toHaveLength(97);
    expect(directApplyLiveDynamics).toContain('sealed R0-R97');
    expect(directApplyLiveDynamics).toContain('score: [');
    expect(directApplyLiveDynamics).toContain('loss: [');
    expect(directApplyLiveSnapshot.counterfactual_boundary).toContain('not outcomes from a separately executed full GDR trajectory');
    expect(briefing).not.toContain('长期参数轨迹已经出现实质分叉');
  });

  it('adds a bounded plateau diagnosis and keeps successor ideas separate from the running treatment', () => {
    const plateauSection = briefing.slice(sectionPosition('directapply-plateau'), sectionPosition('frontier-roadmap'));
    for (const item of [
      'R97 看到平台；R121 显示后续恢复',
      '下面三项只是线索，用来决定下一步该测什么',
      '58.35 → 55.36 → 50.83',
      '94 / 98 轮',
      '8.25 / 16 道题进入训练',
      'cos ≈ −0.046',
      '影子 GDR 打标签，只有 3 / 10 会被标成“通过”',
      'SD-LoRA · 97',
      'Text Memory · 2',
      'Agent System · 1',
      'Skill · 1',
      '当前 DirectApply 先按原规则跑完 R160',
      '平台真正为什么出现，还没有证明',
      '每轮 128 次任务尝试',
      '让部分得分也能参与学习',
      '冻结终评还没打开',
      '论文里也见过两个相似问题',
      'Adaptive Auto-Harness：系统一直在更新，任务表现也可能先升后降',
      'ReasoningBank：只从成功轨迹学习，会漏掉失败里的有用信号',
      '这里只把论文当线索，不能说 R70 后的平台已经找到原因',
    ]) expect(plateauSection).toContain(item);
    expect(directApplyPlateauDiagnostic.status).toBe('READ_ONLY_TRAINING_DIAGNOSTIC_NOT_FINAL_EVALUATION');
    expect(directApplyPlateauDiagnostic.metrics.score_band_mean_pct).toEqual({ r70_r79: 58.3484087, r80_r89: 55.360681, r90_r97: 50.8289615 });
    expect(directApplyPlateauDiagnostic.metrics.training_signal.selection_equals_clean_exact_success_task_count_rounds).toBe(94);
    expect(directApplyPlateauDiagnostic.metrics.training_signal.latest_20_selected_task_count_mean).toBe(8.25);
    expect(directApplyPlateauDiagnostic.metrics.update_direction.latest_10_adjacent_cosine_mean).toBe(-0.0459);
    expect(directApplyPlateauDiagnostic.metrics.update_direction.latest_10_negative_adjacent_cosine_count).toBe(7);
    expect(directApplyPlateauDiagnostic.metrics.shadow_gdr.latest_10_pass).toBe(3);
    expect(directApplyPlateauDiagnostic.metrics.carrier_updates).toMatchObject({ sd_lora: 97, text_memory: 2, agent_system: 1, skill_bundle: 1 });
    expect(directApplyPlateauDiagnostic.metrics.final_panel_access_count).toBe(0);
    expect(directApplyPlateauDiagnostic.scientific_boundary).toContain('hypothesis-generating correlations');
    expect(directApplyPlateauDiagnostic.decision_boundary).toContain('Do not change the running R160 DirectApply treatment');
    expect(briefing).toContain("const adaptiveAutoHarnessHref = 'https://arxiv.org/abs/2606.01770'");
    expect(briefing).toContain("const reasoningBankHref = 'https://arxiv.org/abs/2509.25140'");
    for (const paperHref of ['webShopPaperHref','seedPaperHref','loraPaperHref','harnessBenefitPaperHref','taskArithmeticHref','gatedDeltaPaperHref','adaptiveAutoHarnessHref','reasoningBankHref']) {
      expect(briefing).toContain(`<ExternalBrandMark href={${paperHref}} />`);
    }
  });

  it('adds a Q17 frontier roadmap slide with blanks for unmeasured successor results', () => {
    const frontierSection = briefing.slice(sectionPosition('frontier-roadmap'), sectionPosition('technical-work-summary'));
    for (const item of [
      '平台期之后，我们把原因拆成可以逐个验证的问题',
      'R90–99 的 49.90 后，R110–119 回到 63.52',
      'Success@1 从 R90–99 的 25.62% 到 R110–119 的 34.38%',
      'Success@8 只从 51.88% 到 56.25%',
      'state/action coverage',
      'Frontier Curriculum',
      'Partial-credit preference',
      'ΔSuccess@8',
      '待填',
      '固定来源 #420 @ afc7b745',
      '122/122 个封口轮次',
      '111/122 轮集合完全相等',
      '不证明 success-only 学习造成平台',
      'task-identity 核对 PASS @ 9922003',
    ]) expect(frontierSection).toContain(item);
    expect(directApplyFrontierPlan.status).toBe('PLAN_AND_READ_ONLY_DIAGNOSTIC_NOT_FINAL_EVALUATION');
    expect(directApplyFrontierPlan.metrics.sealed_rounds).toBe(122);
    expect(directApplyFrontierPlan.metrics.formal_rollouts).toBe(15616);
    expect(directApplyFrontierPlan.metrics.score_block_mean_pct.r110_r119).toBe(63.52);
    expect(directApplyFrontierPlan.metrics.success_at_k_pct.r90_r99.at1).toBe(25.62);
    expect(directApplyFrontierPlan.metrics.success_at_k_pct.r100_r109.at1).toBe(30.62);
    expect(directApplyFrontierPlan.metrics.success_at_k_pct.r110_r119.at1).toBe(34.38);
    expect(directApplyFrontierPlan.metrics.sd_lora_selection.equal_to_exact_success_task_count_rounds).toBe(111);
    expect(directApplyFrontierPlan.metrics.final_panel_access_count).toBe(0);
    expect(directApplyFrontierPlan.source_plan.exact_head_sha).toBe('afc7b74500b98134c12f2ee9cc880ac2980ffc10');
    // Keep the dated 2026-09-10 projection immutable; the later identity-audit PASS is cited separately in the briefing.
    expect(directApplyFrontierPlan.diagnostic_completion).toEqual({ artifact_pack_present: true, input_integrity_verified_count: 608, selected_vs_exact_identity_audit_complete: false, deliverable_a_complete: false });
    expect(frontierSection).not.toContain('还差 selected-vs-success task identity 逐项核对');
    expect(frontierSection).not.toContain('the selected-vs-success task-identity audit is still open');
    expect(directApplyFrontierPlan.authority).toMatchObject({ may_authorize_run_mutation: false, may_authorize_recovery: false, may_authorize_successor_launch: false, may_authorize_final_panel: false });
    expect(directApplyFrontierPlan.metrics).not.toHaveProperty('r122_rollout_only');
    expect(directApplyFrontierPlan.placeholders).toEqual({
      frontier_curriculum_delta_success_at_8: null,
      frontier_curriculum_state_coverage_delta: null,
      delayed_reject_counterfactual: null,
      partial_credit_preference_start_decision: null,
    });
    expect(directApplyFrontierPlan.interpretation.not_claiming).toContain('No final-panel result');
    for (const item of [
      '训练还在继续，但分数没有稳定往上',
      '每轮 WebShop Score',
      'SD-LoRA training loss',
      'R70–79 / R80–89 / R90–97',
      '58.35 → 55.36 → 50.83',
      'R110–119 恢复到 63.52',
      '不是永久卡死',
      '还不能证明平台由 SD-LoRA 本身造成',
      '在 Slide 里看同一张图',
    ]) expect(frontierRoadmap).toContain(item);
    expect(frontierSection).not.toContain('Q17 DirectApply / No-GDR · Frontier Plan');
    expect(frontierRoadmap).toContain("OPEN_EVO_DIRECT_APPLY_LIVE_DYNAMICS");
    expect(frontierRoadmap).toContain('data-q17-plateau-visual');
  });

  it('keeps engineering work as a simple summary immediately before the final choice', () => {
    expect(sectionPosition('technical-work-summary')).toBeLessThan(sectionPosition('next'));
    expect(briefing).not.toContain('id="technical-details"');
    expect(briefing).toContain('这些技术工作保护了实验结论能被追溯、比较和恢复');
    for (const item of [
      '为了可追溯',
      'Git commit SHA',
      'config / payload SHA256',
      '为了公平比较',
      '同一块 GPU 上重复检查',
      '为了中断后还能原地继续',
      '动作执行框架、动作解析、合法动作限制',
      '为了长跑不被实现细节卡住',
      '为了加速但不改科学语义',
      '已经完成的正式任务没有被重复执行',
    ]) expect(briefing).toContain(item);
    expect(technical).toContain('训练过程曲线：什么能画，什么不能混在一起');
    expect(technical).toContain('post-hoc checkpoint replay');
  });

  it('ends with the frozen current treatment and a one-variable successor rather than abstract direction labels', () => {
    const finalSlide = briefing.slice(sectionPosition('next'));
    expect(finalSlide).toContain('DirectApply 先按原合同跑完 R160；下一条实验只改学习材料的选择');
    expect(finalSlide).toContain('中途不再改抽题方式、奖励或更新规则');
    expect(finalSlide).toContain('DirectApply 原样跑到 R160');
    expect(finalSlide).toContain('保持每轮 128 次任务尝试的总预算不变');
    expect(finalSlide).toContain('优先那些已经接近成功、但还没完全做对的难题');
    expect(finalSlide).toContain('让部分得分参与学习');
    expect(finalSlide).toContain('R160 正式封口并获得终评授权后，只打开一次冻结终评');
    expect(finalSlide).toContain('再经单独预注册和授权，启动下一条单变量实验');
    expect(finalSlide).not.toContain('向北');
    expect(finalSlide).not.toContain('向南');
    expect(finalSlide).not.toContain('想请老师和学长判断优先级');
    expect(finalSlide).not.toContain('composed state');
  });

  it('keeps hard/repeated HPL failure patterns out of the main deck', () => {
    for (const token of [
      'OpenEVO · SEED × WebShop',
      "Too long, Don't read",
      '>AGENDA<',
      '>RESULTS<',
      '>QUESTION<',
      '>DESIGN<',
      '>MECHANISM<',
      '老师很可能会问',
      '钩子：',
      'composed state',
      '这页先',
      '这里用人话说就是',
      'This slide lays out',
      'This slide explains',
      '7 < 8：',
      '7B：',
      'GDR：',
      'not just',
      'not only',
      'rather than',
      '不是',
      '而是',
      'operational admission rule',
      'treatment identity',
      'high-partial-reward',
      'partial-credit / preference learning',
      'measurement not identifiable',
      'fast-memory state',
      'association address',
      'new value to write',
      '16-task probe → admission decision',
    ]) expect(briefing).not.toContain(token);
    const h2Titles = [...briefing.matchAll(/<h2[^>]*>\{t\('([^']+)'/g)].map((match) => String(match[1] ?? ''));
    expect(h2Titles.some((title) => /^(7B|1\.7B|3B|GDR)：/.test(title))).toBe(false);
    expect(briefing).not.toContain('.briefing-slide::before');
    expect(briefing).not.toContain('.briefing-slide::after');
  });

  it('keeps the scientific story in the requested causal order', () => {
    const ids = ['results','openevo-method','stage2-gate','component-cap','seven-b','diagnostic-entry','horizon-diagnostic','prompt-diagnostic','capacity-diagnostic','training-dynamics','mechanism','m1a-identifiability','gdr','one-seven-b','directapply','directapply-progress','directapply-plateau','frontier-roadmap','text-memory-redesign','technical-work-summary','next'];
    const positions = ids.map(sectionPosition);
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('binds both public routes into Reader Contracts', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain('先看到当前结果和 evaluation protocol 边界，再回到最早 7B');
    expect(contracts).toContain("c('study-briefing-technical'");
    expect(contracts).toContain("'.technical-intro'");
  });
});
