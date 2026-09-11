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
    expect(data.paired.transitions).toEqual({ both_win: 7, win_to_loss: 3, loss_to_win: 1, both_loss: 21 });
    expect(data.paired.score_diff_bootstrap_95ci[0]).toBeLessThan(0);
    expect(data.paired.score_diff_bootstrap_95ci[1]).toBeGreaterThan(0);
    expect(data.paired.success_rate_diff_bootstrap_95ci[0]).toBeLessThan(0);
    expect(data.paired.success_rate_diff_bootstrap_95ci[1]).toBeGreaterThan(0);
  });

  it('keeps the result and boundary visible in both language routes', () => {
    const component = read('src/components/research/OpenEvoQ17AdvisorDiagnostics.astro');
    expect(component).toContain('有些能力换了位置，但还不能说整体发生了遗忘');
    expect(component).toContain('some capabilities moved, but the evidence does not show overall forgetting');
    expect(component).toContain('95% CI');
    expect(component).toContain('final-panel access = 0');
  });
});
