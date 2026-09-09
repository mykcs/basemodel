import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const technical = read('../components/research/SeedOpenEvoBriefingTechnicalNotes.astro');
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

  it('keeps a fixed eleven-slide presentation sequence with no page number on cover/final', () => {
    expect((briefing.match(/<section /g) ?? []).length).toBe(11);
    for (let page = 2; page <= 10; page += 1) expect(briefing).toContain(`${String(page).padStart(2, '0')} / 11`);
    expect(briefing).not.toContain('01 / 11');
    expect(briefing).not.toContain('11 / 11');
    expect(briefing).not.toContain('下一页');
    expect(briefing).not.toContain('Next slide');
  });


  it('keeps the same fixed 1280×720 16:9 slide canvas on phones and desktops', () => {
    expect(briefing).toContain('--deck-w:1280px;--deck-h:720px');
    expect(briefing).toContain('width:var(--deck-w);height:var(--deck-h)');
    expect(briefing).toContain('overflow-x:auto');
    expect(briefing).not.toContain('@media(max-width:720px)');
    expect(briefing).not.toContain('width:calc(100vw - 20px);height:auto');
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
  });

  it('uses a SEED-paper-style Score / Succ table and acknowledges the 3B line without inventing a score', () => {
    expect(briefing).toContain('class="paper-table"');
    expect(briefing).toContain('WebShop Score');
    expect(briefing).toContain('WebShop Succ.');
    expect(briefing).toContain('SEED (Qwen2.5-3B)');
    expect(briefing).toContain('<td>88.5</td><td>78.9%</td>');
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
    expect(briefing).toContain('<strong>Score</strong>');
    expect(briefing).toContain('看任务要求满足了多少');
    expect(briefing).toContain('<strong>Succ.</strong>');
    expect(briefing).toContain('只统计完整成功');
    expect(briefing).toContain('SEED 与 OpenEVO 不是同协议直接对照');
    expect(briefing).toContain('不能直接用 89.7 与 49.33 的差值判断胜负');
  });

  it('tells the 7B baseline with its actual experimental scale before jumping to mechanisms', () => {
    expect(briefing).toContain('7B 长周期实验：最终 49.33 分，瓶颈在哪里？');
    expect(briefing).toContain('Qwen2.5-7B');
    expect(briefing).toContain('180 个任务 × 每个任务 8 次尝试 = 1,440 条轨迹');
    expect(briefing).toContain('temperature=0.4');
    expect(briefing).toContain('每条最多 15 步');
    expect(briefing).toContain('149 轮、19,072 条有效环境交互');
    expect(briefing).toContain('完整成功 58 / 128（45.31%）');
  });

  it('uses 1.7B and 3B as smaller diagnostic lines rather than erasing 3B history', () => {
    expect(briefing).toContain('1.7B 和 3B：用更小实验定位瓶颈');
    expect(briefing).toContain('160 轮 / 20,480 次环境交互');
    expect(briefing).toContain('Qwen2.5-3B');
    expect(briefing).toContain('180×8 的第一阶段');
    expect(briefing).toContain('独立的持续学习实验线');
  });

  it('makes the negative 15→30 horizon diagnostic a scientific pivot', () => {
    expect(briefing).toContain('15 → 30 步：任务得分仍然为 0');
    expect(briefing).toContain('<span>15 步</span>');
    expect(briefing).toContain('<span>30 步</span>');
    expect(briefing).toContain('64 / 64 条尝试有效');
    expect(briefing).toContain('任务得分 = 0');
    expect(briefing).toContain('每个配对差值仍然是 0');
    expect(technical).toContain('max_steps');
  });

  it('keeps the 2048→4096→10+10 capacity chain and does not claim a benchmark win from it', () => {
    expect(briefing).toContain('2048 → 4096');
    expect(briefing).toContain('我们把记忆容量翻倍了');
    expect(briefing).not.toContain('2048 → 4096：单次记忆容量翻倍仍然失败');
    expect(briefing).toContain('<strong>2048 → 4096</strong>');
    expect(briefing).toContain("20 {t('条记录', 'records')}");
    expect(briefing).toContain('10 + 10');
    expect(technical).toContain('max split depth is one');
    expect(briefing).not.toContain('20 条 primary');
    expect(briefing).not.toContain('20 条 repair');
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

  it('explains GDR at first use and states exactly what 44 and 7 count', () => {
    expect(briefing).toContain('GDR（Gated Delta Rule，更新筛选规则）');
    expect(briefing).toContain('GDR 是 Gated Delta Rule');
    expect(briefing).toContain('本来有 44 次机会更新参数，实际只有 7 次进入了后续模型');
    expect(briefing).toContain('44 个 SD-LoRA 更新候选都真正训练出来了');
    expect(briefing).toContain('GDR 最终只接受 7 个');
    expect(briefing).toContain('θ<sub>t+1</sub> = θ<sub>t</sub> + Δ<sub>t</sub>');
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
    expect(briefing).not.toContain('11 / 11');
  });

  it('binds both public routes into Reader Contracts', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain("c('study-briefing-technical'");
    expect(contracts).toContain("'.technical-intro'");
  });
});
