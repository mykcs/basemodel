import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('post-advisor A/B BaseModel publication', () => {
  it('publishes the sealed Stage1 SEED-style capability result without upgrading it to full SEED', () => {
    const page = read('components/research/OpenEvoStage1LearningObjectives.astro');
    expect(page).toContain('0.0369');
    expect(page).toContain('0.0352');
    expect(page).toContain('epoch2 · step324');
    expect(page).toContain('epoch3 · step486');
    expect(page).toContain('完整 SEED Stage2');
    expect(page).toContain('不同 panel');
    expect(page).not.toContain('运行中 / 未封存');
    expect(page).not.toContain('数据已准备 / 未训练');
  });

  it('publishes the matched rank32 capacity result with the non-inferiority boundary intact', () => {
    const page = read('components/research/OpenEvoSdLoraBoundedRecurrence.astro');
    expect(page).toContain('rank32');
    expect(page).toContain('0.6119');
    expect(page).toContain('0.6298');
    expect(page).toContain('51,410,296 B');
    expect(page).toContain('205,551,528 B');
    expect(page).toContain('不能说它完全无损');
    expect(page).toContain('rank16 / 32 / 64 / 128');
    expect(page).toContain('不能因为后验 rank95≈8');
  });

  it('keeps the evidence mirror fail-closed on final-panel and rerun boundaries', () => {
    const evidence = JSON.parse(read('../public/research/seed-openevo/evidence/post-advisor-ab-final-20260928.json'));
    expect(evidence.status).toBe('PASS');
    expect(evidence.boundaries.final_panel_access).toBe(0);
    expect(evidence.boundaries.new_teacher_calls).toBe(0);
    expect(evidence.boundaries.historical_rank128_rerun).toBe(false);
    expect(evidence.boundaries.B_R152_rollout_replay).toBe(false);
    expect(evidence.A.primary_validation.states.epoch3.mean_task_score).toBe(0);
    expect(evidence.B.adapter_size_ratio_rank32_to_rank128).toBeCloseTo(0.2501090432, 9);
  });

  it('marks Experiment 07 complete and points the next question at credit assignment rather than more Stage1 epochs', () => {
    const index = read('data/openEvoExperimentNavigation.ts');
    const start = index.indexOf("id: 'stage1-learning-objectives'");
    const block = index.slice(start, start + 4200);
    expect(block).toContain("status: 'completed'");
    expect(block).toContain('credit assignment');
    expect(block).toContain('完整 SEED Stage2 未测试');
  });
});
