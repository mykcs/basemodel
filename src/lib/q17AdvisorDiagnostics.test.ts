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
    expect(component).toContain('持续学习：文字经验、可复用技能、行为规则和 LoRA（少量模型适配参数）会分别更新并进入下一轮');
    expect(component).toContain('直接采用规则（DirectApply，也记作 No-GDR，意思是不再使用旧 16 题筛选）的含义就是：候选参数通过共同检查后直接进入下一轮');
    expect(component).toContain('OpenEVO 是这条持续学习实验线');
    expect(component).toContain('直接采用（DirectApply）训练线：候选参数通过共同检查后，就直接进入下一轮');
    expect(component).toContain('进入第 127 / 128 轮时加载的两个相邻模型状态（R127 / R128）');
    expect(component).toContain('63.58 → 59.41');
    expect(component).toContain('进入第 127 轮（R127）');
    expect(component).toContain('进入第 128 轮（R128）');
    expect(component).toContain('完整做对');
    expect(component).toContain('10 / 32 → 8 / 32');
        expect(component).toContain('平均分少 4.18，但 95% 统计范围 −17.13 ～ +8.00 包含“没有差别”');
    expect(component).toContain('直接采用规则（DirectApply：候选更新检查通过后直接采用）');
    expect(component).toContain('final：训练结束后才打开一次的固定 128 题');
    expect(component).toContain('熵（entropy：表示选择概率有多分散）');
    expect(component).not.toContain('min-height:calc(100svh - 6rem)');
    expect(component).not.toContain('border-left:3px solid var(--accent-deep)');
    expect(component).toContain('border-top:1px solid var(--line)');
    expect(component.indexOf('diagnostic-summary')).toBeGreaterThan(component.indexOf('result-hero__numbers'));
    expect(component.indexOf('method-context')).toBeGreaterThan(component.indexOf('claim-boundary'));
    expect(component).not.toContain('result-hero__method');
    expect(component).toContain("aria-label={t('相邻两个模型状态的同题结果', 'Same-task results for the two adjacent model states')}");
    expect(component).not.toContain('id="same-task-result"');
    expect(component).toContain('/q17-directapply-analysis/');
    expect(component).toContain('查看 DirectApply 160 轮完整曲线与冻结最终测试（final）');
    expect(component).not.toContain('我们现在只敢说到这里');
    expect(component).toContain('这次诊断当时没有碰最终测试');
    expect(component).not.toContain('result-hero__numbers research-fact-band');
    expect(component).toContain('原训练曲线的 76.1 → 48.9 来自不同题');
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
