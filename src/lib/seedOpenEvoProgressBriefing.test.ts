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
const appLayout = read('../layouts/AppLayout.astro');

describe('SEED × OpenEVO summer review HTML deck', () => {
  it('publishes the bilingual deck and bilingual technical drill-down', () => {
    expect(zhPage).toContain('OpenEVO 暑期考核汇报');
    expect(enPage).toContain('OpenEVO Summer Research Review');
    expect(zhTechnical).toContain('技术推导与实验严谨性');
    expect(enTechnical).toContain('Technical derivations and experimental rigor');
    expect(nav).toContain("id: 'briefing'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/technical-notes/'");
    expect(appLayout).toContain("exactRoute('/research/seed-openevo/study/briefing/technical-notes') ? 'briefing'");
  });

  it('keeps a fixed twelve-slide presentation sequence with no page number on cover/final', () => {
    expect((briefing.match(/<section /g) ?? []).length).toBe(12);
    for (let page = 2; page <= 11; page += 1) expect(briefing).toContain(`${String(page).padStart(2, '0')} / 12`);
    expect(briefing).not.toContain('01 / 12');
    expect(briefing).not.toContain('12 / 12');
    expect(briefing).not.toContain('class="slide-next"');
    expect(briefing).not.toContain('Next slide</button>');
  });


  it('keeps the 16:9 composition but scales the whole deck to phone width without horizontal scrolling', () => {
    expect(briefing).toContain('--deck-w:1280px;--deck-h:720px;--deck-scale:1');
    expect(briefing).toContain('zoom:var(--deck-scale)');
    expect(briefing).toContain('overflow-x:hidden');
    expect(briefing).toContain("const availableWidth = Math.min(1280, deck.clientWidth)");
    expect(briefing).toContain("deck.style.setProperty('--deck-scale', String(availableWidth / 1280))");
    expect(briefing).not.toContain('width:calc(100vw - 20px);height:auto');
    expect(briefing).not.toContain('.paper-table{min-width:620px}');
  });

  it('starts with a normal presentation cover and chronological agenda', () => {
    expect(briefing).toContain('OpenEVO 暑期考核汇报');
    expect(briefing).toContain('OpenEVO 让模型从任务经验中持续更新记忆与参数');
    expect(briefing).toContain('汇报日期');
    expect(briefing).toContain('汇报人');
    expect(briefing).toContain("Too long, Don't read");
    expect(briefing).toContain('7B 长周期结果');
    expect(briefing).toContain("{t('目录', 'Agenda')}");
    expect(briefing).toContain('1.7B / 3B 诊断实验');
    expect(briefing).toContain('这次具体做过的尝试');
    for (const attempt of ['最大步数 15 → 30', 'Text Memory 2048 → 4096，再做 10+10 分块', 'TaskVector 参数更新方向分析', 'GDR 选择性更新 vs DirectApply']) expect(briefing).toContain(attempt);
  });

  it('uses a SEED-paper-style Score / Succ table and acknowledges the 3B line without inventing a score', () => {
    expect(briefing).toContain('class="paper-table"');
    expect(briefing).toContain('<th>Method / Model</th>');
    expect(briefing).toContain('WebShop Score');
    expect(briefing).toContain('WebShop Succ.');
    expect(briefing).toContain('SEED (Qwen2.5-3B)');
    expect(briefing).toContain('<td>88.5</td><td>78.9%</td>');
    const openEvoRows = [
      "OpenEVO {t('（7B，长周期训练）'",
      "OpenEVO {t('（3B，独立实验线）'",
      "OpenEVO {t('（1.7B，GDR）'",
      "OpenEVO {t('（1.7B，DirectApply）'",
    ];
    const rowPositions = openEvoRows.map((row) => briefing.indexOf(row));
    expect(rowPositions.every((position) => position >= 0)).toBe(true);
    expect(rowPositions).toEqual([...rowPositions].sort((a, b) => a - b));
    expect(briefing).toContain('OpenEVO {t(\'（7B，长周期训练）\'');
    expect(briefing).toContain('<td>49.33</td><td>45.31%</td>');
    expect(briefing).toContain('OpenEVO {t(\'（1.7B，GDR）\'');
    expect(briefing).toContain('<td>37.60</td><td>0.78%</td>');
    expect(briefing).toContain('OpenEVO {t(\'（3B，独立实验线）\'');
    expect(briefing).toContain('3B 确实做过独立实验线');
    expect(briefing).toContain('OpenEVO {t(\'（1.7B，DirectApply）\'');
    expect(briefing).toContain('<td>—</td><td>—</td>');
  });

  it('explains what the two WebShop metrics mean and preserves the SEED comparability boundary', () => {
    expect(briefing).toContain('Score 看任务要求完成了多少');
    expect(briefing).toContain('Succ. 看整道任务是否完整成功');
    expect((briefing.match(/Score 看任务要求完成了多少/g) ?? []).length).toBe(1);
    expect((briefing.match(/Succ\. 看整道任务是否完整成功/g) ?? []).length).toBe(1);
    expect(briefing).toContain('SEED 与 OpenEVO 不是同协议直接对照');
    expect(briefing).toContain('不能直接用 89.7 与 49.33 的差值判断胜负');
  });

  it('tells the 7B baseline with its actual experimental scale before jumping to mechanisms', () => {
    expect(briefing).toContain('7B：训练过程明显学起来，但冻结终评仍是 49.33');
    expect(briefing).toContain('Qwen2.5-7B');
    expect(briefing).toContain('180 个任务 × 每个任务 8 次尝试 = 1,440 条轨迹');
    expect(briefing).toContain('temperature=0.4');
    expect(briefing).toContain('每条最多 15 步');
    expect(briefing).toContain("轮 · 19,072 次有效环境交互");
    expect(briefing).toContain('完整成功 58 / 128（45.31%）');
    expect(briefing).toContain('143 次已接纳 SD-LoRA 更新的 loss');
    expect(briefing).toContain('前 20 轮平均');
    expect(briefing).toContain('最后 20 轮平均');
    expect(briefing).toContain('训练过程和最终泛化要分开看');
    expect(technical).toContain('ceiling1-stage2-7b-202609041833-b01d24a468');
    expect(technical).toContain('13.42 → 65.02');
    expect(technical).toContain('0.666 → 0.028');
  });

  it('uses 1.7B and 3B as smaller diagnostic lines rather than erasing 3B history', () => {
    expect(briefing).toContain('1.7B 和 3B：用更小实验定位瓶颈');
    expect(briefing).toContain('160 轮 / 20,480 次环境交互');
    expect(briefing).toContain('Qwen2.5-3B');
    expect(briefing).toContain('180×8 的第一阶段');
    expect(briefing).toContain('独立的持续学习实验线');
  });

  it('pins long-run dynamics to the canonical 7B and 1.7B W&B identities', () => {
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-7b-202609041833-b01d24a468'");
    expect(longDynamics).toContain('sealedRounds: 149');
    expect(longDynamics).toContain('acceptedRolloutsTotal: 19072');
    expect(longDynamics).toContain('candidateUpdateCount: 143');
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-qwen3-1p7b-202609041833-4c1bb58e9f'");
    expect(longDynamics).toContain('sealedRounds: 160');
    expect(longDynamics).toContain('acceptedRolloutsTotal: 20480');
    expect(longDynamics).toContain('candidateUpdateCount: 44');
    expect(longDynamics).toContain('acceptedUpdateCount: 7');
    expect(longDynamics).toContain('W&B preserves 1.7B candidate-attempt flags for all 44 candidate rounds');
  });

  it('shows the complete 1.7B score curve, 44 candidate locations, and only the 7 authoritative accepted-update losses', () => {
    expect(briefing).toContain('160 轮都跑完了，但 44 个候选只接纳 7 个');
    expect(briefing).toContain('每轮 WebShop Score；下方短线 = 候选更新发生的轮次');
    expect(briefing).toContain('canonical W&B 中可核验的 loss：7 个被 GDR 接纳的更新');
    expect(briefing).toContain('44 个候选轮次都有发生记录');
    expect(briefing).toContain('这里不补造 37 个 loss 点');
    expect(briefing).toContain('dynamics17B.candidateRounds.map');
    expect(briefing).toContain('dynamics17B.acceptedRounds.map');
    expect(technical).toContain('ceiling1-stage2-qwen3-1p7b-202609041833-4c1bb58e9f');
    expect(technical).toContain('44 个 `candidate_update_attempted`');
    expect(technical).toContain('不能凭空补一条 44 点 loss 曲线');
  });

  it('shows the 3B longitudinal training dynamics without turning training-round score into a final-eval claim', () => {
    expect(briefing).toContain('3B：任务得分上升，训练 loss 同时下降');
    expect(briefing).toContain('左图是每轮 WebShop 任务得分（Score），不是 loss');
    expect(briefing).toContain('右图才是 SD-LoRA 训练 loss');
    expect(briefing).toContain('123 个已封存 round');
    expect(briefing).toContain('最后 23 轮平均');
    expect(briefing).toContain('发生候选训练时的 SD-LoRA loss');
    expect(briefing).toContain('这段曲线是训练过程证据，不是 128 题最终终评');
    expect(briefing).toContain('dynamics3B.acceptedRolloutsTotal.toLocaleString');
    expect(technical).toContain('15,744 次正式环境尝试');
    expect(briefing).toContain('engineering invalid、parser repair、invalid-action termination 都是 0');
    expect(briefing).toContain('Curve semantics, ledger provenance, and checkpoint-replay boundary');
  });

  it('makes the negative 15→30 horizon diagnostic a trace-level scientific pivot', () => {
    expect(briefing).toContain('多给 15 步，模型还是在几个导航动作里打转');
    expect(briefing).toContain('next（下一页）和 back（返回）');
    expect(briefing).toContain('一直没有进入 buy（购买）');
    expect(briefing).toContain('多出来的 15 步没有打开新路径');
    expect(briefing).toContain('64 / 64');
    expect(briefing).toContain('Δ = 0.0');
    expect(briefing).toContain('6 / 8');
    expect(briefing).toContain('瓶颈更像动作选择 / 规划，而不是 horizon');
  });

  it('keeps the 2048→4096→10+10 capacity chain and does not claim a benchmark win from it', () => {
    expect(briefing).toContain('2048 → 4096');
    expect(briefing).toContain('我们把记忆容量翻倍了');
    expect(briefing).not.toContain('2048 → 4096：单次记忆容量翻倍仍然失败');
    expect(briefing).toContain('<strong>2048 → 4096</strong>');
    expect(briefing).toContain("20 {t('条记录', 'records')}");
    expect(briefing).toContain('10 + 10');
    expect(briefing).toContain('最终怎么解决容量饱和');
    expect(briefing).toContain('最终采用 A2 方案');
    expect(briefing).toContain('容量一满就卡死');
    expect(technical).toContain('max split depth is one');
    expect(briefing).not.toContain('20 条 primary');
    expect(briefing).not.toContain('20 条 repair');
    expect(technical).toContain('不是模型上下文长度，也不是 WebShop 的动作步数');
    expect(technical).toContain('只把已经失败的 repair 输出上限从 2048 提到 4096');
    expect(technical).toContain('3B 与 1.7B 的小模型诊断线仍然出现饱和');
    expect(technical).toContain('科学含义不是“10+10 一定让最终分数更高”');
  });

  it('uses a simple TaskVector formula in the talk and moves the hard derivation to the child page', () => {
    expect(briefing).toContain('TaskVector（参数更新方向）');
    expect(briefing).not.toContain('这里可以更硬核一点');
    expect(briefing).toContain('τ = ΔW<sub>R49</sub> − ΔW<sub>R27</sub>');
    expect(briefing).toContain('‖τ‖<sub>F</sub> = 0.608');
    expect(briefing).not.toContain('√(δcᵀGδc) = 0.6082257746');
    expect(briefing).toContain('完整技术推导与实验门槛');
    expect(briefing).not.toContain('Gram 范数和干预门槛');
    expect(technical).toContain('√(δcᵀGδc) = 0.6082257746');
    expect(technical).toContain('λ∈{−1,0,0.5,1}');
    expect(technical).toContain('9 组条件 × 64 个配对任务 = 576');
  });

  it('explains why 44 SD-LoRA updates existed before explaining the GDR filter', () => {
    expect(briefing).toContain('GDR（Gated Delta Rule，选择性更新规则）');
    expect(briefing).toContain('GDR：我们给 SD-LoRA 参数更新加了一道筛选');
    expect(briefing).toContain('每次发生参数进化，就会训练一个 SD-LoRA 更新并写入后续模型');
    expect(briefing).toContain('实际发生并训练了 44 次这样的更新');
    expect(briefing).toContain('44 个更新都训练了，但 GDR 最后只让 7 个进入后续模型');
    expect(briefing).toContain('44 不是人为设定的“更新预算”');
    expect(briefing).toContain('其余 37 个训练结果被拒绝');
  });

  it('keeps DirectApply in the main deck as one simple scientific variable and leaves the result unfinished', () => {
    expect(briefing).toContain('DirectApply：拿掉 GDR 的否决权，只改这一个变量');
    expect(briefing).toContain('DirectApply 对满足共同训练条件的候选直接应用');
    expect(briefing).toContain('最终冻结分数还没有收口');
    expect(briefing).toContain('严谨性、重复性与复现实验细节');
  });

  it('removes engineering-rigor-as-highlight from the talk while preserving it in technical notes', () => {
    expect(briefing).not.toContain('我怎么保证：结果可信，而且推进得快');
    expect(briefing).not.toContain('636.7 s → 389.6 s');
    expect(briefing).not.toContain('固定 GPU 重复性');
    expect(technical).toContain('固定 GPU 重复性与参数哈希');
    expect(technical).toContain('636.7 s → 389.6 s');
    expect(technical).toContain('1.63×');
  });

  it('keeps meaningless English eyebrows and decorative bubbles out of the deck', () => {
    for (const token of ['OpenEVO · SEED × WebShop', '>AGENDA<', '>RESULTS<', '>QUESTION<', '>DESIGN<', '>MECHANISM<']) {
      expect(briefing).not.toContain(token);
    }
    expect(briefing).not.toContain('.briefing-slide::before');
    expect(briefing).not.toContain('.briefing-slide::after');
  });

  it('ends with a concrete advisor priority choice and no final page number', () => {
    expect(briefing).toContain('下一步优先级：先做机制，还是先做 SEED 匹配比较？');
    expect(briefing).toContain('向北');
    expect(briefing).toContain('先把机制证据做深');
    expect(briefing).toContain('向南');
    expect(briefing).toContain('先把 SEED 匹配比较做齐');
    expect(briefing).toContain('先追“为什么有效”的机制证据');
    expect(briefing).toContain('想请老师和学长判断优先级');
    expect(briefing).toContain('我们解决的工程性问题（这里只列，不展开）');
    for (const item of ['动作接口与解析导致的无效动作', '长实验中断后的安全续跑与状态恢复', '多卡任务分配与空闲 GPU 动态回填', 'checkpoint、证据、W&B / HF 的实验身份与归档']) expect(briefing).toContain(item);
    expect(briefing).not.toContain('12 / 12');
  });

  it('binds both public routes into Reader Contracts', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain("c('study-briefing-technical'");
    expect(contracts).toContain("'.technical-intro'");
  });
});
