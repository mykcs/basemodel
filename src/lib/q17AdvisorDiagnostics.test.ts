import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');

describe('Q17 advisor diagnostics publication', () => {
  it('publishes the paired result without upgrading it to proven forgetting', () => {
    const data = JSON.parse(read('public/research/seed-openevo/evidence/q17-advisor-diagnostics-20260911.json'));
    expect(data.source.merge_sha).toBe('38223bf7f07aa2c2978c8583bcfb12097e9ee052');
    expect(data.panel.task_count).toBe(32);
    expect(data.boundaries.final_panel_access).toBe(0);
    expect(data.replication.merge_sha).toBe('f6fa4d05b7433685088ac59b1b488eecb42c781e');
    expect(data.replication.enter_r127_rows_exact_match).toBe(true);
    expect(data.replication.enter_r128_rows_exact_match).toBe(true);
    expect(data.replication.paired_rows_exact_match).toBe(true);
    expect(data.replication.authoritative_comparison_fields_exact_match).toBe(true);
    expect(data.paired.transitions).toEqual({ both_win: 7, win_to_loss: 3, loss_to_win: 1, both_loss: 21 });
    expect(data.paired.score_diff_bootstrap_95ci[0]).toBeLessThan(0);
    expect(data.paired.score_diff_bootstrap_95ci[1]).toBeGreaterThan(0);
    expect(data.paired.success_rate_diff_bootstrap_95ci[0]).toBeLessThan(0);
    expect(data.paired.success_rate_diff_bootstrap_95ci[1]).toBeGreaterThan(0);
  });

  it('keeps the result and boundary visible in both language routes', () => {
    const component = read('src/components/research/OpenEvoQ17AdvisorDiagnostics.astro');
    expect(component).toContain('OpenEVO 的 WebShop 同题复测：暂时不能证明第 128 轮模型状态整体变差');
    expect(component).toContain('OpenEVO WebShop same-task retest: we still cannot show that the round-128 model state got worse overall');
    expect(component).toContain('第一阶段先让 Qwen 自己完成 WebShop 任务');
    expect(component).toContain('持续学习：文字经验、可复用技能、行为规则和少量 LoRA 适配参数会分别更新并进入下一轮');
    expect(component).toContain('新的 LoRA 候选通过既定工程与数据检查后，下一轮直接使用');
    expect(component).toContain('不再先用 16 题小测在新旧参数之间做选择');
    expect(component).toContain('同一条 OpenEVO WebShop（网页购物任务）训练线');
    expect(component).toContain('进入第 127 / 128 轮时加载的两个相邻模型状态（R127 / R128）');
    expect(component).toContain('这两个模型状态怎样形成');
    expect(component).toContain('MiniMax（负责事后复盘的模型）');
    expect(component).toContain('LoRA（冻结基础模型、只训练少量适配参数）');
    expect(component).toContain('DirectApply 就是“新 LoRA 候选通过既定工程与数据检查后，下一轮直接采用”');
    expect(component).toContain('63.58 → 59.41');
    expect(component).toContain('完整做对');
    expect(component).toContain('10 / 32 → 8 / 32');
    expect(component).toContain('95% 统计范围 · 包含 0');
    expect(component).toContain('平均分少 4.18，但这个 95% 统计范围包含“没有差别”');
    expect(component).toContain('DirectApply（候选更新检查通过后直接采用）');
    expect(component).not.toContain('min-height:calc(100svh - 6rem)');
    expect(component).toContain('border-left:3px solid var(--accent-deep)');
    expect(component.indexOf('diagnostic-summary')).toBeGreaterThan(component.indexOf('result-hero__numbers'));
    expect(component).not.toContain('class="same-task-facts research-fact-band"');
    expect(component.indexOf('method-context')).toBeGreaterThan(component.indexOf('claim-boundary'));
    expect(component).toContain('result-hero__method');
    expect(component).toContain("aria-label={t('相邻两个模型状态的同题结果', 'Same-task results for the two adjacent model states')}");
    expect(component).not.toContain('id="same-task-result"');
    expect(component).toContain('/q17-directapply-analysis/');
    expect(component).toContain('查看 DirectApply 160 轮完整曲线与冻结 final');
    expect(component).not.toContain('我们现在只敢说到这里');
    expect(component).toContain('这次诊断当时没有碰最终测试');
    expect(component).toContain('research-fact-band');
    expect(component).toContain('原训练曲线的 76.1 → 48.9 来自不同题，不能直接横比');
    expect(component).toContain('同样 32 题');
    expect(component).toContain('冻结的最终测试（final）才单独打开一次');
    expect(component).toContain('另一张 GPU 又跑了一遍');
    expect(component).toContain('The result was rerun on another GPU');
    expect(component).toContain('f6fa4d05b7433685088ac59b1b488eecb42c781e');
    expect(component).not.toContain('任务能力发生了重排');
    expect(component).not.toContain('平均只差 4.18 分');
    expect(component).not.toContain('margin-top:5rem');
  });
});
