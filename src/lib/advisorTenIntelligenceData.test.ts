import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  Q08_SEEN_SOURCES,
  Q08_SEEN_TASKS,
} from '../data/research-evidence/advisor-q08-seen-retention-20261003';
import {
  Q09_CONTEXT_SOURCE,
  Q09_TEXT_COMPARISONS,
} from '../data/research-evidence/advisor-q09-text-guidance-20261015';
import {ADVISOR_Q09_UPDATES} from '../data/openEvoAdvisorTenQuestions';

describe('Q08 public 96-task retention projection', () => {
  const roundedDelta = (task:(typeof Q08_SEEN_TASKS)[number]) => Number((task.score160-task.score80).toFixed(9));

  it('keeps the same 96 unique task identities in three fixed cohorts', () => {
    expect(Q08_SEEN_TASKS).toHaveLength(96);
    expect(new Set(Q08_SEEN_TASKS.map(t=>t.taskId)).size).toBe(96);
    expect(Q08_SEEN_TASKS.slice(0,32).every(t=>t.cohort==='EARLY_SEEN')).toBe(true);
    expect(Q08_SEEN_TASKS.slice(32,64).every(t=>t.cohort==='MID_SEEN')).toBe(true);
    expect(Q08_SEEN_TASKS.slice(64,96).every(t=>t.cohort==='LATE_SEEN')).toBe(true);
    expect(Q08_SEEN_TASKS.every(t=>t.score80>=0&&t.score80<=1&&t.score160>=0&&t.score160<=1)).toBe(true);
  });

  it('separates descriptive score changes from actual training-evidence gaps', () => {
    expect(Q08_SEEN_TASKS.filter(t=>roundedDelta(t)>0)).toHaveLength(42);
    expect(Q08_SEEN_TASKS.filter(t=>roundedDelta(t)===0)).toHaveLength(36);
    expect(Q08_SEEN_TASKS.filter(t=>roundedDelta(t)<0)).toHaveLength(18);
    expect(Q08_SEEN_TASKS.filter(t=>t.status==='NO_EFFECTIVE_EXPOSURE')).toHaveLength(49);
    expect(Q08_SEEN_TASKS.filter(t=>t.status==='PARTIAL_MISSING_FIRST_POST_CHECKPOINT')).toHaveLength(31);
    expect(Q08_SEEN_TASKS.filter(t=>t.status==='RETENTION_MEASURED_ACQUISITION_UNVERIFIED')).toHaveLength(16);
    const down=Q08_SEEN_TASKS.filter(t=>roundedDelta(t)<0);
    expect(down.filter(t=>t.status==='NO_EFFECTIVE_EXPOSURE')).toHaveLength(9);
    expect(down.filter(t=>t.status==='PARTIAL_MISSING_FIRST_POST_CHECKPOINT')).toHaveLength(7);
    expect(down.filter(t=>t.status==='RETENTION_MEASURED_ACQUISITION_UNVERIFIED')).toHaveLength(2);
    expect(Q08_SEEN_SOURCES.scoreCsvSha256).toHaveLength(64);
    expect(Q08_SEEN_SOURCES.exposureCsvSha256).toHaveLength(64);
  });

  it('pins the real #6120 example and never invents pre/first-post scores', () => {
    const item=Q08_SEEN_TASKS.find(t=>t.taskId.startsWith('seen:6120:'));
    expect(item?.cohort).toBe('EARLY_SEEN');
    expect(item?.firstEffectiveUpdate).toBe(23);
    expect(item?.effectiveUpdates).toBe(1);
    expect(item?.score80).toBeCloseTo(44.44/100, 3);
    expect(item?.score160).toBe(0);
    expect(item?.status).toBe('PARTIAL_MISSING_FIRST_POST_CHECKPOINT');
    expect(Object.keys(item??{})).not.toContain('score40');
    expect(Object.keys(item??{})).not.toContain('preTrainingScore');
  });
});

describe('Q09 text-guidance comparison projection', () => {
  const raw=JSON.parse(readFileSync(resolve('public/research/seed-openevo/evidence/q17-checkpoint-diagnostics-20261015.json'),'utf8'));

  it('stays identical to the published primary summary for both checkpoints', () => {
    expect(Q09_TEXT_COMPARISONS).toHaveLength(6);
    expect(Q09_CONTEXT_SOURCE.tasksPerComparison).toBe(64);
    expect(raw.as_of).toBe(Q09_CONTEXT_SOURCE.asOf);
    for (const row of Q09_TEXT_COMPARISONS) {
      const source=raw.context[row.checkpoint][row.kind];
      expect(row.firstActionChanged).toBe(source.first_action_flip_rate);
      expect(row.meanScoreDelta).toBe(source.paired_mean_score_delta);
      expect(row.ci95).toEqual(source.paired_task_bootstrap95);
      expect(row.ci95[0]).toBeLessThanOrEqual(0);
      expect(row.ci95[1]).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(row.firstActionChanged*64)).toBe(true);
    }
  });

  it('shows 33 of 64 action changes for R159 Skill, not score gain', () => {
    const skill=Q09_TEXT_COMPARISONS.find(r=>r.checkpoint==='r159'&&r.kind==='skill_guidance_removed');
    expect(skill?.firstActionChanged).toBe(33/64);
    expect(skill?.meanScoreDelta).toBeLessThan(0);
    expect(skill?.meanScoreDelta).toBeCloseTo(-0.04111426767676768, 10);
    expect(ADVISOR_Q09_UPDATES[0]).toMatchObject({parametric:159,textMemory:2,skill:1,agent:3});
  });
});
