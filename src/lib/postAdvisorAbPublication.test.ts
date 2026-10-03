import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import postAdvisor from '../../public/research/seed-openevo/evidence/post-advisor-ab-final-20260928.json';
import { RANK32_CAPACITY_TABLE } from '../data/scientificResearchTables';
import { scientificTableCell } from './scientificTable';

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
    expect(page).toContain('view={RANK32_CAPACITY_TABLE}');
    const score = RANK32_CAPACITY_TABLE.rows.find((row) => row.id === 'mean-task-score')!;
    const payload = RANK32_CAPACITY_TABLE.rows.find((row) => row.id === 'persistent-payload')!;
    expect(scientificTableCell(score, 'rank32', RANK32_CAPACITY_TABLE.id).raw).toBe(postAdvisor.B.rank32.mean_task_score);
    expect(scientificTableCell(score, 'rank128', RANK32_CAPACITY_TABLE.id).raw).toBe(postAdvisor.B.rank128.mean_task_score);
    expect(scientificTableCell(payload, 'rank32', RANK32_CAPACITY_TABLE.id).raw).toBe(postAdvisor.B.rank32.final_adapter_bytes);
    expect(scientificTableCell(payload, 'rank128', RANK32_CAPACITY_TABLE.id).raw).toBe(postAdvisor.B.rank128.final_adapter_bytes);
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
