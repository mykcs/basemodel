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
const contracts = read('../data/siteReaderContracts.ts');
const sitemap = read('./sitemapRoutes.ts');

const sectionPosition = (id: string) => briefing.indexOf(`<section id="${id}"`);

describe('SEED × OpenEVO summer review HTML deck', () => {
  it('publishes the bilingual deck and bilingual technical drill-down', () => {
    expect(zhPage).toContain('OpenEVO 暑期考核汇报');
    expect(enPage).toContain('OpenEVO Summer Research Review');
    expect(zhTechnical).toContain('技术推导与实验严谨性');
    expect(enTechnical).toContain('Technical derivations and experimental rigor');
    expect(nav).toContain("id: 'briefing'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/technical-notes/'");
  });

  it('keeps a twenty-slide deck with page numbers only on inner slides', () => {
    expect((briefing.match(/<section /g) ?? []).length).toBe(20);
    for (let page = 2; page <= 19; page += 1) expect(briefing).toContain(`${String(page).padStart(2, '0')} / 20`);
    expect(briefing).not.toContain('01 / 20');
    expect(briefing).not.toContain('20 / 20');
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

  it('uses a normal cover/agenda and a directory-like scientific-attempt summary', () => {
    expect(briefing).toContain('OpenEVO 暑期考核汇报');
    expect(briefing).toContain("{t('目录', 'Agenda')}");
    expect(briefing).toContain("{t('先看三件事', 'Three things to know')}");
    expect(briefing).not.toContain("Too long, Don't read");
    expect(briefing).toContain('我们做过哪些科学尝试');
    for (const attempt of [
      '撤掉误带进 Stage 2 的旧 gate',
      '解开 64-component 工程上限',
      '把最大动作步数从 15 提到 30',
      '把 Text Memory 输出容量从 2048 提到 4096',
      '把 20 条记录拆成 10 + 10',
      '修正 3B Harness 与动作接口',
      '用 TaskVector 检查参数方向',
      '用 GDR 筛选已训练的参数候选',
      '启动 DirectApply 独立对照',
    ]) expect(briefing).toContain(attempt);
  });

  it('shows the results first, with the protocol boundary before the table numbers', () => {
    expect(sectionPosition('results')).toBeLessThan(sectionPosition('openevo-method'));
    expect(briefing).toContain('Score 看任务要求完成了多少');
    expect(briefing).toContain('Succ. 看整道任务是否完整成功');
    expect(briefing).toContain('SEED 与 OpenEVO 口径不同');
    expect(briefing).toContain('不能直接用 89.7 与 49.33 的差值判断胜负');
    expect(briefing.indexOf('SEED 与 OpenEVO 口径不同')).toBeLessThan(briefing.indexOf('<table class="paper-table">'));
    expect(briefing).toContain('GDR = Gated Delta Rule');
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
    expect(briefing).toContain('最早的 7B 只收任务经验；完整长跑后来才带上四类学习状态');
    expect(briefing).toContain('最早 7B 和最终长跑属于两个阶段，状态也不同');
    expect(briefing).toContain('180 × 8');
    expect(briefing).toContain('MiniMax review');
    expect(briefing).toContain('LoRA / SD-LoRA');
    expect(briefing).toContain('这一阶段还没有注入后来完整长跑里的四类滚动状态');
    expect(briefing).toContain('后来每 128 次新任务形成一轮');
    for (const carrier of ['Text Memory', 'Skill Bundle', 'Agent System', 'SD-LoRA']) expect(briefing).toContain(carrier);
    expect(briefing).toContain('没有触发条件时可以保持原样');
  });

  it('explains how the old control condition blocked Stage 2 and fixes the scientific rule', () => {
    expect(briefing).toContain('训练跑了很久，但参数一次都没有更新');
    expect(briefing).toContain('原本用途：控制实验');
    expect(briefing).toContain('8 个任务身份 × 每个 2 条成功');
    expect(briefing).toContain('后来误用：Stage 2 gate');
    expect(briefing).toContain('20,480 次 rollout 和 797 条 positive 轨迹，仍然得到 0 次参数更新');
    expect(briefing).toContain('撤掉这个人数门槛');
    expect(briefing).toContain('一轮 128 次 WebShop 尝试里');
    expect(briefing).toContain('至少一个 clean exact-success task');
    expect(briefing).toContain('NOOP');
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
    expect(briefing).toContain('149 rounds · 19,072 rollout');
    expect(briefing).toContain('143 个点 = 143 次真正采用的参数更新');
    expect(briefing).toContain('49.33 · 58 / 128');
    expect(briefing).toContain('三种 measurement 分开读');
    expect(briefing).toContain('SEED 7B 论文参照 89.7 · evaluation protocol 不同');
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
    expect(briefing).toContain('采用第二种方案：保持原 prompt，只把 15 步改成 30 步');
    expect(briefing).toContain('后续继续检查 prompt、deliberation 和 action channel');
    for (const technicalOnly of ['64 / 64', 'Δ = 0.0', '6 / 8']) expect(briefing).not.toContain(technicalOnly);
    expect(technical).toContain('64 条比较中 64 条尝试都有效');
  });

  it('keeps the state-aware prompt experiments as a separate causal chain after the horizon test', () => {
    expect(sectionPosition('horizon-diagnostic')).toBeLessThan(sectionPosition('prompt-diagnostic'));
    expect(sectionPosition('prompt-diagnostic')).toBeLessThan(sectionPosition('capacity-diagnostic'));
    for (const item of [
      '状态感知 prompt（state-aware-v3）',
      '连续 Next 最多 2 次',
      'H1.8 共 128 次尝试',
      '4 / 16 条正向结果',
      'H1.9 用两组独立 seeds 复验',
      '一共得到 8 条正向结果',
      'H1.10 的新任务里出现了正向结果',
      '不能当成全局低分的通用解释',
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
    expect(briefing).toContain('3B 先做 Stage 1 经验采集');
    expect(briefing).toContain('Harness、ActionPrefixConstraint（约束合法动作前缀）');
    expect(briefing).toContain('injective action encoding（避免动作编码冲突）');
    expect(briefing).toContain('123</strong>{t(\' 个 sealed rounds\'');
    expect(briefing).toContain('31</strong>{t(\' 次候选训练\'');
    expect(briefing).toContain('—</strong>{t(\' 无同口径冻结终评\'');
    expect(briefing).toContain('engineering invalid、parser repair、invalid-action termination 都是 0');
    expect(technical).toContain('15,744 次正式环境尝试');
  });

  it('keeps TaskVector simple in the main deck and moves full geometry to technical notes', () => {
    const taskSlide = briefing.slice(sectionPosition('mechanism'), sectionPosition('gdr'));
    expect(taskSlide).toContain('训练确实在发生以后，新的问题是：参数到底学到了什么？');
    expect(taskSlide).toContain('v = θ<sub>after</sub> − θ<sub>before</sub>');
    expect(taskSlide).toContain('‖v‖ 告诉我们参数移动了多少');
    expect(taskSlide).toContain('夹角 / cosine');
    expect(taskSlide).not.toContain('τ = ΔW<sub>R49</sub> − ΔW<sub>R27</sub>');
    expect(taskSlide).not.toContain('‖τ‖<sub>F</sub> = 0.608');
    expect(taskSlide).not.toContain('同范数随机方向');
    expect(technical).toContain('√(δcᵀGδc) = 0.6082257746');
    expect(technical).toContain('PR #358 · R14 / R27 / R49 与 Frobenius 几何证据');
    expect(technical).toContain('R14 / R27 / R49');
  });

  it('defines GDR in place and separates candidate training from admission', () => {
    expect(briefing).toContain('OpenEVO 准备用 SD-LoRA 更新参数时，GDR 作为 gate 决定是否真的更新');
    expect(briefing).toContain('GDR = Gated Delta Rule');
    expect(briefing).toContain('这个 S / k / v 是论文的 fast-weight memory 语义');
    expect(briefing).toContain('旧状态与完整候选各做 16-task probe');
    expect(briefing).toContain('至少一个任务指标必须严格提高');
    expect(briefing).toContain('为什么最后变成了 gate？');
    expect(briefing).not.toContain('把 16-task probe 得到的短期任务证据记作 k');
    expect(briefing).toContain('OpenEVO 到底训练出了多少个 SD-LoRA 候选');
    expect(briefing).toContain('GDR 最终让多少个候选真正更新到后续模型');
    expect(technical).toContain('固定的 16-task 短期 probe');
  });

  it('shows the authoritative 1.7B GDR result including frozen exact success', () => {
    expect(briefing).toContain('在 1.7B 实验里，44 次候选只有 7 次进入后续模型');
    expect(briefing).toContain('160 轮 / 20,480 次任务都跑完了');
    expect(briefing).toContain('44</strong>{t(\' 次候选训练\'');
    expect(briefing).toContain('7</strong>{t(\' 次 GDR 同意真正应用\'');
    expect(briefing).toContain('37</strong>{t(\' 次训练结果被 GDR 拒绝\'');
    expect(briefing).toContain('37.60 · 1 / 128');
    expect(briefing).toContain('被拒绝的 37 个候选没有保留可作为 authority 的 loss');
  });

  it('keeps DirectApply as the one-variable causal comparison while preserving safety contracts', () => {
    expect(briefing).toContain('为了回答 GDR 会不会限制长期学习，我们从相同条件启动 DirectApply 对照');
    expect(briefing).toContain('DirectApply 只取消短期 task-score probe 对候选生死的决定权');
    expect(briefing).toContain('数据合同、工程安全和 determinism 检查仍然保留');
    expect(briefing).toContain('候选 → 16-task probe → 接受 / 拒绝');
    expect(briefing).toContain('候选 → 共同合同通过 → 直接进入下一轮');
    expect(briefing).toContain('冻结终评仍未打开');
    expect(technical).toContain('16-task task-score probe 不再拥有接受 / 拒绝决定权');
  });

  it('shows the current No-GDR snapshot without promoting it to a frozen final', () => {
    expect(sectionPosition('directapply')).toBeLessThan(sectionPosition('directapply-progress'));
    expect(sectionPosition('directapply-progress')).toBeLessThan(sectionPosition('technical-work-summary'));
    for (const item of [
      'No-GDR 已跑完 R0–R76：76 个 SD-LoRA 候选都进入了后续模型',
      '2026-09-10 01:00 SGT',
      '77 rounds · 9,856 rollout',
      '76 / 76',
      '35 pass · 41 reject',
      '41.83 → 52.58',
      '1.046 → 0.133',
      '0 accesses · —',
      'shadow GDR 会拒绝其中 41 个',
      '还不能回答“哪条路线最终 WebShop 更高”',
      'current No-GDR controller authority · 7422ab54',
    ]) expect(briefing).toContain(item);
    expect(briefing).toContain('DirectApply 的最终 Score / Succ. 继续保持空白');
  });

  it('keeps engineering work as a simple summary immediately before the final choice', () => {
    expect(sectionPosition('technical-work-summary')).toBeLessThan(sectionPosition('next'));
    expect(briefing).not.toContain('id="technical-details"');
    expect(briefing).toContain('我们做过哪些技术工作');
    for (const item of [
      '为了可追溯',
      'Git commit SHA',
      'config / payload SHA256',
      '为了公平比较',
      '固定 GPU 的 determinism',
      '为了中断后还能原地继续',
      'ActionPrefixConstraint',
      '为了长跑不被实现细节卡住',
      '为了加速但不改科学语义',
      'formal rollout replay = 0',
    ]) expect(briefing).toContain(item);
    expect(technical).toContain('训练过程曲线：什么能画，什么不能混在一起');
    expect(technical).toContain('post-hoc checkpoint replay');
  });

  it('ends with two explicit research choices rather than an empty advisor prompt', () => {
    const finalSlide = briefing.slice(sectionPosition('next'));
    expect(finalSlide).toContain('下一步两条路：追参数机制，或做 SEED 同条件比较');
    expect(finalSlide).toContain('向北');
    expect(finalSlide).toContain('机制 / 因果：参数内部到底学到了什么');
    expect(finalSlide).toContain('向南');
    expect(finalSlide).toContain('同条件比较：OpenEVO 与 SEED 最终还差多少');
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
    ]) expect(briefing).not.toContain(token);
    const h2Titles = [...briefing.matchAll(/<h2[^>]*>\{t\('([^']+)'/g)].map((match) => String(match[1] ?? ''));
    expect(h2Titles.some((title) => /^(7B|1\.7B|3B|GDR)：/.test(title))).toBe(false);
    expect(briefing).not.toContain('.briefing-slide::before');
    expect(briefing).not.toContain('.briefing-slide::after');
  });

  it('keeps the scientific story in the requested causal order', () => {
    const ids = ['results','openevo-method','stage2-gate','component-cap','seven-b','diagnostic-entry','horizon-diagnostic','capacity-diagnostic','training-dynamics','mechanism','gdr','one-seven-b','directapply','directapply-progress','technical-work-summary','next'];
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
