import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');
const zhPage = read('../pages/research/seed-openevo/study/briefing/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/briefing/index.astro');
const contracts = read('../data/siteReaderContracts.ts');
const sitemap = read('./sitemapRoutes.ts');

describe('SEED × OpenEVO summer review HTML deck', () => {
  it('publishes a bilingual briefing route without the study subnav competing with the deck', () => {
    expect(zhPage).toContain('OpenEVO 暑期考核汇报');
    expect(enPage).toContain('OpenEVO Summer Research Review');
    expect(zhPage).not.toContain('SeedOpenEvoResearchNav');
    expect(enPage).not.toContain('SeedOpenEvoResearchNav');
    expect(nav).toContain("id: 'briefing'");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
  });

  it('uses a normal presentation cover with basic information', () => {
    expect(briefing).toContain('OpenEVO 暑期考核汇报');
    expect(briefing).toContain('汇报日期');
    expect(briefing).toContain('2026-09-08');
    expect(briefing).toContain('汇报人');
    expect(briefing).toContain('OpenEVO 项目组');
    expect(briefing).toContain('从“跑出一个结果”，走到“能解释结果、能做公平对照”');
  });

  it('puts a plain-language agenda beside a Too long, Don\'t read summary', () => {
    expect(briefing).toContain('id="contents"');
    expect(briefing).toContain('今天讲四件事');
    expect(briefing).toContain("Too long, Don't read");
    expect(briefing).toContain('我们现在做到哪了');
    expect(briefing).toContain('这些结果说明了什么');
    expect(briefing).toContain('接下来优先押哪条线');
  });

  it('starts results with a SEED-paper-style WebShop Score / Succ table', () => {
    expect(briefing).toContain('class="paper-table"');
    expect(briefing).toContain('WebShop Score');
    expect(briefing).toContain('WebShop Succ.');
    expect(briefing).toContain('SEED (Qwen2.5-3B)');
    expect(briefing).toContain('<td>88.5</td><td>78.9%</td>');
    expect(briefing).toContain('SEED (Qwen2.5-7B)');
    expect(briefing).toContain('<td>89.7</td><td>78.1%</td>');
    expect(briefing).toContain('SEED (Qwen3-1.7B)');
    expect(briefing).toContain('<td>87.1</td><td>77.3%</td>');
  });

  it('uses OpenEVO plus a readable variant explanation for our rows and never invents DirectApply results', () => {
    expect(briefing).toContain('OpenEVO {t(\'（7B，长周期训练）\'');
    expect(briefing).toContain('<td>49.33</td><td>45.31%</td>');
    expect(briefing).toContain('OpenEVO {t(\'（1.7B，GDR 筛选）\'');
    expect(briefing).toContain('<td>37.60</td><td>0.78%</td>');
    expect(briefing).toContain('OpenEVO {t(\'（1.7B，不经过 GDR）\'');
    expect(briefing).toContain('DirectApply 尚无最终分数，所以留空');
    expect(briefing).toContain('<td>—</td><td>—</td>');
  });

  it('explains the two WebShop numbers rather than leaving naked metrics', () => {
    expect(briefing).toContain('<strong>Score</strong>');
    expect(briefing).toContain('看任务要求满足了多少');
    expect(briefing).toContain('<strong>Succ.</strong>');
    expect(briefing).toContain('只看任务是否完整成功');
    expect(briefing).toContain('SEED 是论文报告值');
    expect(briefing).toContain('本地冻结的 128 题最终测试');
  });

  it('keeps the research arc understandable before internal experiment names', () => {
    expect(briefing).toContain('我们真正想回答的，不只是“最后多少分”');
    expect(briefing).toContain('能力上限 → 参数机制 → 因果控制');
    expect(briefing).toContain('实验原则：一次只改一个原因');
    expect(briefing).toContain('工程实现可以变，但不能偷偷变成新的实验变量');
  });

  it('preserves the parameter-mechanism intervention evidence', () => {
    expect(briefing).toContain('把学习方向搬到旧模型');
    expect(briefing).toContain('TaskVector');
    expect(briefing).toContain('3 个同范数随机对照');
    expect(briefing).toContain('R14、R27、R49');
    expect(briefing).toContain('0.6082257746');
    expect(briefing).toContain('没有把它写成“这个方向没用”');
  });

  it('explains what 44 and 7 count before asking the GDR question', () => {
    expect(briefing).toContain('训练出 44 个参数更新候选，最后只有 7 个真正进入模型');
    expect(briefing).toContain('GDR 会不会把短期看起来变差、长期却有价值的更新拒绝得太早');
    expect(briefing).toContain('经过 GDR 筛选');
    expect(briefing).toContain('直接应用更新');
    expect(briefing).toContain('至少需要 3 个 training seeds');
  });

  it('translates the fixed-GPU result into the scientific meaning a human audience needs', () => {
    expect(briefing).toContain('公平对照已经真正开始了，但还没跑到终点');
    expect(briefing).toContain('GDR 还没真正起作用，两组模型就已经不一样');
    expect(briefing).toContain('重复训练已经能得到同一个 LoRA 结果');
    expect(briefing).toContain('10 项比较前身份也一致');
    expect(briefing).toContain('仍然不能说 GDR 或 DirectApply 哪个更好');
    expect(briefing).not.toContain('固定 GPU 确定性已经 PASS');
    expect(briefing).toContain('已推进到第 13 轮');
    expect(briefing).toContain('第 1 轮：84 / 128 个有效结果');
    expect(briefing).toContain('剩下 44 个还没完成');
    expect(briefing).toContain('当前仍没有继续执行授权');
  });

  it('shows the SEED control as three understandable contribution questions', () => {
    expect(briefing).toContain('SEED 对照线：把“起点、教师、后续训练”拆开看');
    expect(briefing).toContain('Stage1 · 1,440');
    expect(briefing).toContain('MiniMax');
    expect(briefing).toContain('SFT · 1,296 / 144');
    expect(briefing).toContain('起点贡献多少？');
    expect(briefing).toContain('教师贡献多少？');
    expect(briefing).toContain('Stage2 贡献多少？');
  });

  it('turns anomalies into narrower research questions', () => {
    expect(briefing).toContain('异常改变了下一个问题');
    expect(briefing).toContain('Task Score 7.17 → 8.74');
    expect(briefing).toContain('44 个候选更新，只有 7 个进入模型');
    expect(briefing).toContain('参数方向算成 0');
    expect(briefing).toContain('两组在真正比较前就已经不同');
  });

  it('makes the final advisor decision concrete enough to choose', () => {
    expect(briefing).toContain('最后想请老师和学长帮我选一个优先级');
    expect(briefing).toContain('向北');
    expect(briefing).toContain('先做参数因果实验');
    expect(briefing).toContain('OpenEVO 为什么会变强？模型内部到底学到了什么？');
    expect(briefing).toContain('向南');
    expect(briefing).toContain('先做 SEED 匹配对照');
    expect(briefing).toContain('OpenEVO 和 SEED 到底差多少？');
    expect(briefing).toContain('先把论文故事做深（向北），还是先把对照结果做齐（向南）');
  });

  it('is a fixed 16:9 HTML deck rather than a responsive web article or image-backed PPT', () => {
    expect(briefing.match(/<section id=/g)?.length).toBe(11);
    expect(briefing).toContain('--deck-w:1280px');
    expect(briefing).toContain('--deck-h:720px');
    expect(briefing).toContain('width:var(--deck-w);height:var(--deck-h)');
    expect(briefing).not.toContain('@media(');
    expect(briefing).toContain('02 / 11');
    expect(briefing).toContain('10 / 11');
    expect(briefing).not.toContain('01 / 11');
    expect(briefing).not.toContain('11 / 11');
    expect(briefing).not.toContain('下一页');
    expect(briefing).not.toContain('Next:');
    expect(briefing).not.toContain('<img');
    expect(briefing).not.toContain('background-image:url');
  });

  it('registers the fixed-deck reader contract without pretending SEED and OpenEVO are already apples-to-apples', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain('固定 16:9 HTML 演讲稿');
    expect(contracts).toContain('DirectApply 尚无最终分数');
    expect(contracts).toContain('GDR 到第 13 轮检查点');
    expect(contracts).toContain('DirectApply 第 1 轮为 84 / 128 个有效结果');
    expect(contracts).toContain("'.cover-kicker'");
    expect(briefing).toContain('data-briefing-primary');
  });
});
