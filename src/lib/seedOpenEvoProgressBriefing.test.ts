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

  it('keeps a fixed eighteen-slide sequence with page numbers only on the inner slides', () => {
    expect((briefing.match(/<section /g) ?? []).length).toBe(18);
    for (let page = 2; page <= 17; page += 1) expect(briefing).toContain(`${String(page).padStart(2, '0')} / 18`);
    expect(briefing).not.toContain('01 / 18');
    expect(briefing).not.toContain('18 / 18');
    expect(briefing).not.toContain('class="slide-next"');
  });

  it('preserves a literal 1280×720 canvas and proportionally scales that whole canvas on phone', () => {
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

  it('starts with a normal presentation cover and chronological agenda', () => {
    expect(briefing).toContain('OpenEVO 暑期考核汇报');
    expect(briefing).toContain("Too long, Don't read");
    expect(briefing).toContain("{t('目录', 'Agenda')}");
    for (const attempt of ['修正长期训练的更新门槛', '做一次 7B 长周期训练', '用 1.7B / 3B 做便宜诊断', '把 GDR 与 DirectApply 分开比较']) expect(briefing).toContain(attempt);
  });

  it('uses the requested SEED-style Score / Succ table and correct OpenEVO row order', () => {
    expect(briefing).toContain('class="paper-table"');
    expect(briefing).toContain('<th>Method / Model</th>');
    expect(briefing).toContain('WebShop Score');
    expect(briefing).toContain('WebShop Succ.');
    const rows = ["OpenEVO {t('（7B，长周期训练）'", "OpenEVO {t('（3B，独立实验线）'", "OpenEVO {t('（1.7B，GDR）'", "OpenEVO {t('（1.7B，DirectApply）'"];
    const positions = rows.map((row) => briefing.indexOf(row));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(briefing).toContain('<td>49.33</td><td>45.31%</td>');
    expect(briefing).toContain('<td>37.60</td><td>0.78%</td>');
    expect(briefing).toContain('<td>—</td><td>—</td>');
  });

  it('preserves the SEED comparability boundary before the numbers are interpreted', () => {
    expect(briefing).toContain('Score 看任务要求完成了多少');
    expect(briefing).toContain('Succ. 看整道任务是否完整成功');
    expect(briefing).toContain('SEED 与 OpenEVO 口径不同');
    expect(briefing).toContain('不能直接用 89.7 与 49.33 的差值判断胜负');
  });


  it('explains why the 7-vs-8 control condition blocked Stage 2 and how the rule was fixed', () => {
    expect(briefing).toContain('训练跑了很久，但参数一次都没有更新');
    expect(briefing).toContain('可能的疑问');
    expect(briefing).toContain('gate 一直不放行');
    expect(briefing).toContain('原本用途：控制实验');
    expect(briefing).toContain('8 个任务身份 × 每个 2 条成功');
    expect(briefing).toContain('后来误用：Stage 2 gate');
    expect(briefing).toContain('20,480 次 rollout 和 797 条 positive 轨迹，仍然得到 0 次参数更新');
    expect(briefing).toContain('撤掉旧 7-vs-8 gate');
    expect(briefing).toContain('至少一个 clean exact-success task');
    expect(briefing).toContain('64-component 上限是另一个问题');
    expect(briefing).toContain('更细的运行时排查留在技术页');
  });

  it('adds a one-slide OpenEVO Stage 1 → Stage 2 mental model for the live audience', () => {
    expect(briefing).toContain('后来 7B 的下一轮状态，到底由哪些东西共同组成？');
    expect(briefing).toContain('Stage 1');
    expect(briefing).toContain('180 个 WebShop 任务 × 每题 8 次完整尝试');
    expect(briefing).toContain('MiniMax 1,440 / 1,440');
    expect(briefing).toContain('任务结束后做老式的回看分析');
    expect(briefing).toContain('不替 Qwen 搜索或点击');
    expect(briefing).toContain('Stage 2');
    expect(briefing).toContain('每 128 次任务形成一轮');
    for (const carrier of ['Text Memory', 'Skill Bundle', 'Agent System', 'SD-LoRA']) expect(briefing).toContain(carrier);
    expect(briefing).toContain('TaskVector 只做诊断，不偷偷改训练');
    expect(briefing).toContain('最早的 7B Stage 1 只收集 1,440 条原始 WebShop 轨迹');
    expect(briefing).toContain('最终评测状态包含 Text Memory、Skill Bundle、Agent System，以及累计写入 143 次更新后形成的 SD-LoRA 参数状态');
  });

  it('shows 7B training dynamics, the old 64-component guard, and the direction-question pivot', () => {
    expect(briefing).toContain('我们做了一次 7B 长跑：训练在变好，冻结终评是 49.33');
    expect(briefing).toContain('SEED 7B 论文参照：89.7');
    expect(briefing).toContain('149 轮训练');
    expect(briefing).toContain('143 次真正采用的 SD-LoRA 更新');
    expect(briefing).toContain('第 64 个 component');
    expect(briefing).toContain('开始越过 64，最后到 143');
    expect(briefing).toContain('容量 guard');
    expect(briefing).toContain('effective rank ≤ 4096');
    expect(briefing).toContain('没有为了继续跑而偷偷启用 rank reduction');
    expect(briefing).toContain('学长提出的下一问：别只数次数，要看“方向”');
    expect(briefing).toContain('这个建议后来变成 TaskVector');
    expect(briefing).toContain('49.33 / 100 · 58 / 128');
    expect(briefing).toContain('SEED 7B 论文参照：89.7');
  });

  it('pins the 7B and 1.7B charts to canonical W&B identities', () => {
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-7b-202609041833-b01d24a468'");
    expect(longDynamics).toContain('sealedRounds: 149');
    expect(longDynamics).toContain('candidateUpdateCount: 143');
    expect(longDynamics).toContain("runId: 'ceiling1-stage2-qwen3-1p7b-202609041833-4c1bb58e9f'");
    expect(longDynamics).toContain('sealedRounds: 160');
    expect(longDynamics).toContain('candidateUpdateCount: 44');
    expect(longDynamics).toContain('acceptedUpdateCount: 7');
  });

  it('uses the same score/loss/update chart grammar for 7B, 1.7B, and 3B', () => {
    expect((briefing.match(/class="dynamics-grid"/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect((briefing.match(/训练过程中每轮 WebShop Score/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect((briefing.match(/SD-LoRA training loss/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(briefing).toContain('candidate-tick');
    expect(briefing).toContain('accepted-tick');
  });

  it('keeps the diagnostic story before the GDR evidence slide', () => {
    const ids = ['diagnostic-entry', 'horizon-diagnostic', 'capacity-diagnostic', 'mechanism', 'gdr', 'one-seven-b', 'directapply'];
    const positions = ids.map((id) => briefing.indexOf(`<section id="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });


  it('explains 1.7B in natural language: 44 candidates trained, GDR only used 7', () => {
    expect(briefing).toContain('在 1.7B 实验里，44 次候选只有 7 次进入后续模型');
    expect(briefing).toContain('44 次都已经把一个 SD-LoRA 候选训出来了');
    expect(briefing).toContain('只同意其中 7 次真的改到下一轮模型上');
    expect(briefing).toContain('被拒绝的 37 个候选没有保留可作为 authority 的 loss');
    expect(briefing).toContain('dynamics17B.candidateRounds.map');
    expect(briefing).toContain('dynamics17B.acceptedRounds.map');
    expect(technical).toContain('44 个 `candidate_update_attempted`');
    expect(technical).toContain('避免凭空补一条 44 点 loss 曲线');
  });

  it('shows 3B dynamics without inventing a same-protocol frozen final', () => {
    expect(briefing).toContain('3B 这条线也在变好，loss 同时下降');
    expect(briefing).toContain('123 个已封存 round');
    expect(briefing).toContain('31 次候选训练');
    expect(briefing).toContain('2</strong>{t(\' 次真正采用\'');
    expect(briefing).toContain('—</strong>{t(\' 无同口径冻结终评\'');
    expect(briefing).toContain('engineering invalid、parser repair、invalid-action termination 都是 0');
    expect(technical).toContain('15,744 次正式环境尝试');
  });

  it('introduces the observed failure patterns before the 15→30 and Text Memory interventions', () => {
    expect(briefing).toContain('分数很低，我们先去看日志，找具体卡点');
    expect(briefing).toContain('当时第一步是检查失败轨迹和训练日志');
    expect(briefing).toContain('于是我们分别做两个最小改动');
    expect(briefing).toContain('有些失败任务把 15 步全部走完');
    expect(briefing).toContain('一直在 next / back 等几个导航动作里绕');
    expect(briefing).toContain('Text Memory 在汇总 20 条记录时会撞到一次生成的 2048-token 上限');
    expect(briefing).toContain('15 → 30');
    expect(briefing).toContain('2048 → 4096 → 10+10');
    expect(briefing).toContain('接下来我们就分别验证这两个怀疑');
  });

  it('makes the negative 15→30 horizon diagnostic a trace-level scientific pivot', () => {
    expect(briefing).toContain('多给 15 步，模型还是在几个导航动作里打转');
    expect(briefing).toContain('next（下一页）和 back（返回）');
    expect(briefing).toContain('一直没有进入 buy（购买）');
    expect(briefing).toContain('多出来的 15 步没有打开新路径');
    for (const evidence of ['64 / 64', 'Δ = 0.0', '6 / 8']) expect(briefing).toContain(evidence);
    expect(briefing).toContain('瓶颈指向动作选择 / 规划；继续加 horizon 已经帮不上忙');
  });

  it('keeps the 2048→4096→10+10 capacity chain and its bounded conclusion', () => {
    expect(briefing).toContain('2048 → 4096');
    expect(briefing).toContain('最终采用 A2 方案');
    expect(briefing).toContain('10 + 10');
    expect(briefing).toContain('容量一满就卡死');
    expect(briefing).toContain('不等于证明最终 WebShop 分数因此提高');
    expect(technical).toContain('max split depth is one');
    expect(technical).toContain('科学含义是容量失败的解释发生了变化');
  });

  it('uses a simple TaskVector formula in the talk and leaves the hard derivation in technical notes', () => {
    expect(briefing).toContain('TaskVector 用来检查参数更新方向');
    expect(briefing).toContain('τ = ΔW<sub>R49</sub> − ΔW<sub>R27</sub>');
    expect(briefing).toContain('‖τ‖<sub>F</sub> = 0.608');
    expect(briefing).not.toContain('√(δcᵀGδc) = 0.6082257746');
    expect(technical).toContain('√(δcᵀGδc) = 0.6082257746');
  });

  it('uses natural GDR phrasing without abstract update-admission prose', () => {
    expect(briefing).toContain('SD-LoRA 先训出来，GDR 再决定这次用不用');
    expect(briefing).toContain('候选先训出来，GDR 再看短期效果');
    expect(briefing).toContain('44 个候选都已经训练出来了，但 GDR 只同意 7 次真的改到下一轮模型上');
    expect(briefing).toContain('已经训练了 44 次，最后只有 7 次真正影响后面的模型');
    expect(briefing).not.toContain('“训练出一个更新”和“让这个更新进入后续模型”之间出现了很大的落差');
  });

  it('keeps DirectApply as the one-variable scientific comparison', () => {
    expect(briefing).toContain('DirectApply 拿掉 GDR 的否决权，只改这一个变量');
    expect(briefing).toContain('训练 Δ → 下一轮直接用');
    expect(briefing).toContain('最终冻结分数还没有收口');
  });

  it('gives W&B / frozen-final / post-hoc checkpoint replay its own technical slide', () => {
    expect(briefing).toContain('W&B 记录训练过程；冻结终评另算');
    expect(briefing).toContain('7B 记录：149 轮 Score + 143 次已应用 SD-LoRA loss');
    expect(briefing).toContain('1.7B 记录：160 轮 Score + 44 个候选位置 + 7 个可核验 loss');
    expect(briefing).toContain('3B 记录：123 轮 Score + 31 次候选训练 loss');
    expect(briefing).toContain('那 128 题被锁到训练结束才打开');
    expect(briefing).toContain('validation / 调参集');
    expect(briefing).toContain('post-hoc checkpoint replay');
    expect(briefing).toContain('不能说它当时参与了 checkpoint selection');
    for (const item of ['动作接口与 parser', 'checkpoint、W&B、Hugging Face 归档', '断点续跑与 GPU 调度', '快速 Preview 与最终 gate 分离']) expect(briefing).toContain(item);
  });

  it('keeps engineering detail off the final advisor-choice slide', () => {
    const finalSlide = briefing.slice(briefing.indexOf('<section id="next"'));
    expect(finalSlide).toContain('下一步优先级：先做机制，还是先做 SEED 匹配比较？');
    expect(finalSlide).toContain('向北');
    expect(finalSlide).toContain('向南');
    expect(finalSlide).toContain('想请老师和学长判断优先级');
    expect(finalSlide).not.toContain('W&B + HF + checkpoint 归档');
    expect(finalSlide).not.toContain('composed state');
    expect(briefing).toContain('训练跑了很久，但参数一次都没有更新');
    expect(briefing).toContain('后来 7B 的下一轮状态，到底由哪些东西共同组成？');
    expect(finalSlide).not.toContain('15 / 15');
  });

  it('keeps meaningless English eyebrows, binary-contrast phrasing, and decorative bubbles out of the deck', () => {
    for (const token of ['OpenEVO · SEED × WebShop', '>AGENDA<', '>RESULTS<', '>QUESTION<', '>DESIGN<', '>MECHANISM<', '老师很可能会问', '钩子：', 'composed state', '这页先', 'This slide lays out', 'This slide explains']) expect(briefing).not.toContain(token);
    for (const token of ['不是', '而是', 'not just', 'not only', 'rather than', 'instead of', 'not a', 'not one']) {
      expect(briefing).not.toContain(token);
      expect(technical).not.toContain(token);
    }
    const h2Titles = [...briefing.matchAll(/<h2[^>]*>\{t\('([^']+)'/g)].map((match) => String(match[1] ?? ''));
    expect(h2Titles.some((title) => /^(7B|1\.7B|3B)：/.test(title))).toBe(false);
    expect(briefing).not.toContain('.briefing-slide::before');
    expect(briefing).not.toContain('.briefing-slide::after');
  });

  it('binds both public routes into Reader Contracts', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain("c('study-briefing-technical'");
    expect(contracts).toContain("'.technical-intro'");
  });
});
