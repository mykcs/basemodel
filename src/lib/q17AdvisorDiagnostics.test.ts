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
    expect(component).toContain('R128 比 R127 稍差，但没有训练曲线看起来那么严重');
    expect(component).toContain('R128 was a little worse than R127—but not nearly as bad as the training curve suggested');
    expect(component).toContain('这个范围里包含“没有差别”，所以还不能确定整体真的下降');
    expect(component).toContain('最终 128 题完全没打开');
    expect(component).toContain('另一张 GPU 又跑了一遍');
    expect(component).toContain('The result was rerun on another GPU');
    expect(component).toContain('f6fa4d05b7433685088ac59b1b488eecb42c781e');
    expect(component).not.toContain('任务能力发生了重排');
  });
});
