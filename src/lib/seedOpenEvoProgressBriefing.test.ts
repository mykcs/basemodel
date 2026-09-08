import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');
const zhPage = read('../pages/research/seed-openevo/study/briefing/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/briefing/index.astro');
const contracts = read('../data/siteReaderContracts.ts');
const sitemap = read('./sitemapRoutes.ts');

describe('SEED × OpenEVO advisor briefing', () => {
  it('publishes a bilingual presentation route without the study subnav competing with the deck', () => {
    expect(zhPage).toContain('SeedOpenEvoProgressBriefing');
    expect(enPage).toContain('SeedOpenEvoProgressBriefing');
    expect(zhPage).not.toContain('SeedOpenEvoResearchNav');
    expect(enPage).not.toContain('SeedOpenEvoResearchNav');
    expect(nav).toContain("id: 'briefing'");
    expect(nav).toContain("p('/research/seed-openevo/study/briefing/')");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
  });

  it('makes the research arc—not project management—the first-screen story', () => {
    expect(briefing).toContain('OpenEVO：从能力天花板到可控自我进化');
    expect(briefing).toContain('先测 OpenEVO 在固定资源预算下能学到多高');
    expect(briefing).toContain('再分析参数空间里学到了什么');
    expect(briefing).toContain('因果干预和 GDR / DirectApply 单变量实验');
    expect(briefing).toContain('第 1 轮完成 · GDR 已进入第 2 轮');
    expect(briefing).toContain('第 0 轮比较前 10 项身份一致');
    expect(briefing).not.toContain('Q17 的固定 GPU SD-LoRA 确定性问题');
    expect(briefing).not.toContain('<h2 id="quality-title">');
    expect(briefing).not.toContain('<h2 id="pace-title">');
    expect(briefing).not.toContain('measurement-title');
  });

  it('labels first-screen metrics with their units and meaning', () => {
    expect(briefing).toContain("7B 最终测试");
    expect(briefing).toContain('Task Score · 49.33 / 100');
    expect(briefing).toContain('完整成功 · 58 / 128 个任务（45.31%）');
    expect(briefing).toContain("1.7B 最终测试");
    expect(briefing).toContain('Task Score · 37.60 / 100');
    expect(briefing).toContain('完整成功 · 1 / 128 个任务（0.78%）');
    expect(briefing).toContain('Task Score 衡量任务完成到什么程度');
    expect(briefing).not.toContain('7B：49.33 / 58⁄128');
  });

  it('registers a current reader contract for the advisor task', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain('能力上限 → 参数机制 → 因果控制');
    expect(contracts).toContain('Q17 已从干净第 0 轮一致性推进到第 1 轮完成、GDR 第 2 轮在跑');
    expect(contracts).toContain("'.cover-thesis'");
    expect(briefing).toContain('data-briefing-primary');
  });

  it('shows both completed capability-ceiling results without turning them into a model leaderboard', () => {
    expect(briefing).toContain('149 轮 · 19,072 条训练轨迹');
    expect(briefing).toContain('143 个保留的 SD-LoRA 参数组件');
    expect(briefing).toContain('<td>49.33</td>');
    expect(briefing).toContain('<td>58 / 128</td>');
    expect(briefing).toContain('160 轮 · 20,480 条训练轨迹');
    expect(briefing).toContain('7 次被接受并写入后续模型的参数更新');
    expect(briefing).toContain('<td>37.60</td>');
    expect(briefing).toContain('<td>1 / 128</td>');
    expect(briefing).toContain('低于预先设定的 96 次诊断下限');
    expect(briefing).toContain('不是一场模型大小比赛');
  });

  it('keeps the scientifically useful metric split and removes the standalone engineering-measurement slide', () => {
    expect(briefing).not.toContain('id="measurement"');
    expect(briefing).not.toContain('第一道门：先证明测量是真的');
    expect(briefing).not.toContain('接口 0 分 → 测量资格');
    expect(briefing).toContain('Task Score 从 7.17 升到 8.74');
    expect(briefing).toContain('完整成功仍是 5 / 128');
    expect(briefing).toContain('“部分进展”和“真正完成任务”拆成两个信号');
  });

  it('makes the parameter-mechanism program understandable before internal experiment names', () => {
    expect(briefing).toContain('参数机制实验：从“模型变了”走到可干预的因果问题');
    expect(briefing).toContain('参数方向移植（TaskVector）');
    expect(briefing).toContain('主要参数主题删除实验');
    expect(briefing).toContain('前瞻三组验证实验');
    expect(briefing).toContain('3 个同范数随机对照');
    expect(briefing).toContain('R14、R27、R49');
    expect(briefing).toContain('0.6082257746');
    expect(briefing).toContain('没有把“算不出方向”误写成“方向没有因果作用”');
  });

  it('explains what 44 and 7 count before asking the GDR mechanism question', () => {
    expect(briefing).toContain('因果控制：训练出 44 个参数更新候选，最终只有 7 个进入模型——GDR 是否筛得太保守？');
    expect(briefing).toContain('至少需要 3 个 training seeds');
    expect(briefing).toContain('44 个 SD-LoRA 参数更新候选');
    expect(briefing).toContain('GDR 最终只接受了 7 个');
    expect(briefing).toContain('真正写入后续模型');
    expect(briefing).toContain('经过 GDR 筛选');
    expect(briefing).toContain('直接应用更新');
    expect(briefing).not.toContain('44 → 7：');
  });

  it('uses ordinary Chinese for audience-facing project jargon', () => {
    expect(briefing).not.toContain('closeout');
    expect(briefing).not.toContain('continuing state');
    expect(briefing).not.toContain('eligibility');
    expect(briefing).not.toContain('transition authority 成为唯一 intended treatment');
    expect(briefing).toContain('能力上限实验最终结果摘要');
    expect(briefing).toContain('候选更新满足共同训练条件');
  });

  it('uses the latest fixed-GPU RTX5090 PASS as an attribution prerequisite, not an engineering trophy', () => {
    expect(briefing).toContain('固定 GPU 确定性已经 PASS');
    expect(briefing).toContain('LoRA adapter 与序列化 SD 状态完全一致');
    expect(briefing).toContain('training loss 与预注册的语义状态比较面完全一致');
    expect(briefing).not.toContain('a79816333babe774');
    expect(briefing).not.toContain('cfc1a81dac0d13dc');
    expect(briefing).toContain('没有消耗正式 WebShop 训练轨迹');
    expect(briefing).toContain('没有查看最终测试题');
    expect(briefing).toContain('只比较 GDR 筛选规则');
    expect(briefing).toContain('还没有回答 GDR 和直接应用更新谁更好');
    expect(briefing).toContain('Q17 第 0 轮 parity v2 · PR #386');
    expect(briefing).toContain('第 1 轮已经在不重放 rollout / SD 的情况下完成');
    expect(briefing).toContain('task-vector geometry 仍然只做诊断');
    expect(briefing).toContain('GDR 分支已进入第 2 轮');
    expect(briefing).toContain('Q17 第 1 轮恢复证据 · PR #387');
    expect(briefing).not.toContain('获得针对这套设计的重新启动批准后，只先完成两组第 0 轮');
  });

  it('shows the SEED-style decomposition in ordinary audience language', () => {
    expect(briefing).toContain('Stage1 · 1,440');
    expect(briefing).toContain('MiniMax 事后分析 · 1,440 / 1,440');
    expect(briefing).toContain('SFT · 1,296 / 144');
    expect(briefing).toContain('当前使用 MiniMax-M3 作为教师模型');
    expect(briefing).toContain('离线 SFT 准备已经允许进行');
    expect(briefing).toContain('Stage2 还没有获准启动');
  });

  it('turns scientific anomalies into narrower research questions', () => {
    expect(briefing).toContain('让每个异常都改变下一个问题');
    expect(briefing).toContain('任务完成程度上升、完整成功不变 → 指标拆开');
    expect(briefing).toContain('44 个候选更新只有 7 个进入模型 → 研究 GDR 的筛选作用');
    expect(briefing).toContain('M1-A 算出零方向 → 先解决“方向能不能被识别”');
    expect(briefing).toContain('Q17 比较前权重漂移 → 确定性 gate → 干净第 0 轮 parity PASS');
    expect(briefing).toContain('v2 审计确认第 0 轮 10 项比较前科学身份一致');
    expect(briefing).toContain('第 1 轮在不重放 rollout / SD 的情况下完成');
    expect(briefing).toContain('几何修复只改变 Docker mount 拓扑');
  });

  it('stays HTML-native while using one-screen briefing sections', () => {
    expect(briefing.match(/<section id=/g)?.length).toBe(10);
    expect(briefing).toContain('<figure class="pipeline"');
    expect(briefing).toContain('<table>');
    expect(briefing).toContain('09 / 09');
    expect(briefing).toContain('scroll-snap-align:start');
    expect(briefing).not.toContain('class="deck-index"');
    expect(briefing).toContain('.slide-inner{position:relative');
    expect(briefing).toContain('background:transparent');
    expect(briefing).not.toContain('<img');
    expect(briefing).not.toContain('background-image:url');
  });
});
