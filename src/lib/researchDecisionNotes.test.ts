import { describe, expect, it } from 'vitest';
import analysisSnapshot from '../data/researchAnalysisSnapshot.json';
import {
  RESEARCH_DECISION_EVIDENCE,
  RESEARCH_DECISION_NOTES,
  RESEARCH_DECISION_SNAPSHOT,
  researchDecisionSummary,
  validateResearchDecisionNotes,
} from '../data/researchDecisionNotes';

const note = (id: string) => {
  const found = RESEARCH_DECISION_NOTES.find((item) => item.questionId === id);
  if (!found) throw new Error('missing decision note ' + id);
  return found;
};

describe('D04 research decision synthesis', () => {
  it('covers the five planned questions exactly once', () => {
    expect(RESEARCH_DECISION_NOTES).toHaveLength(5);
    expect(new Set(RESEARCH_DECISION_NOTES.map((item) => item.questionId)).size).toBe(5);
    expect(validateResearchDecisionNotes()).toEqual([]);
  });

  it('adds no experiment authority, new formal rollout, or new PR', () => {
    expect(RESEARCH_DECISION_SNAPSHOT.finalPanelAccessAdded).toBe(0);
    expect(RESEARCH_DECISION_SNAPSHOT.newExperimentAuthorizationAdded).toBe(false);
    for (const item of RESEARCH_DECISION_NOTES) {
      expect(item.nextStudy.d04CreatesNewPr).toBe(false);
      expect(item.nextStudy.d04NewFormalRollouts).toBe(0);
      expect(item.nextStudy.executionAuthorityFromD04).toBe(false);
    }
  });

  it('keeps every open question falsifiable instead of giving one catch-all explanation', () => {
    for (const item of RESEARCH_DECISION_NOTES) {
      expect(item.hypotheses.length).toBeGreaterThanOrEqual(2);
      for (const hypothesis of item.hypotheses) {
        expect(hypothesis.discriminatingPrediction.length).toBeGreaterThan(20);
        expect(hypothesis.support.length).toBeGreaterThan(0);
      }
    }
  });

  it('reuses existing learning-signal and full-Stage2 owners instead of rerunning Stage1', () => {
    const item = note('learning-signal-transfer');
    expect(item.status).toBe('continue-existing-work');
    expect(item.nextStudy.existingPrs).toEqual([629, 630]);
    expect(item.currentDecision).toContain('不重跑');
    expect(item.evidenceIds).toContain('post-advisor-stage1-rank32');
  });

  it('does not promote the pending BaseModel Stage1 mirror into published D03 evidence', () => {
    expect(analysisSnapshot.studies.learningSignal.status).toBe('awaiting-pr805-integration');
    expect(note('learning-signal-transfer').evidenceIds).toContain('d03-comparative-analysis');
  });

  it('routes capacity work to the already active Q04 owner', () => {
    const item = note('rank-capacity-knee');
    expect(item.nextStudy.existingPrs).toEqual([631]);
    expect(item.currentDecision).toContain('不从effective rank推最小容量');
    expect(item.evidenceIds).toContain('q04-rank-owner');
  });

  it('keeps rank32 publication pending and does not assert rank8 sufficiency', () => {
    expect(analysisSnapshot.studies.rankCapacity.status).toBe('awaiting-pr805-integration');
    const serialized = JSON.stringify(note('rank-capacity-knee'));
    expect(serialized).not.toContain('rank8足够');
    expect(serialized).not.toContain('rank8 is sufficient');
  });

  it('uses beta scale, causal direction, and retention owners together', () => {
    const item = note('beta-late-dynamics');
    expect(item.nextStudy.existingPrs).toEqual([632, 635]);
    expect(item.evidenceIds).toEqual(expect.arrayContaining(['q05-beta-owner', 'q07-direction-causal', 'q08-retention-owner']));
    expect(item.currentDecision).toContain('不申请新的Final重测');
  });

  it('keeps the beta training rebound separate from frozen final evaluation', () => {
    expect(analysisSnapshot.studies.betaLateTraining.publication).toBe('existing-site-projection');
    const serialized = JSON.stringify(note('beta-late-dynamics'));
    expect(serialized).toContain('训练回升没有产生新的Frozen Final');
    expect(serialized).not.toContain('新的Final结果');
  });

  it('closes the universal 120-round question with merged cross-mechanism evidence', () => {
    const item = note('training-horizon');
    expect(item.status).toBe('closed-by-evidence');
    expect(item.nextStudy.action).toBe('no-new-study');
    expect(item.nextStudy.existingPrs).toEqual([]);
    expect(item.evidenceIds).toContain('q01-horizon');
    expect(item.currentDecision).toContain('停止');
  });

  it('preserves mechanism-specific horizons instead of choosing one global round count', () => {
    const item = note('training-horizon');
    const text = item.observations.join(' ');
    expect(text).toContain('Ordinary约120');
    expect(text).toContain('Bounded约R150');
    expect(text).toContain('GDR约R130');
  });

  it('does not convert the two acceleration numbers into one fungible budget multiplier', () => {
    const item = note('acceleration-budget-reallocation');
    expect(item.status).toBe('wait-for-existing-evidence');
    expect(item.evidenceIds).toEqual(expect.arrayContaining(['acceleration-lineages', 'acceleration-admission']));
    expect(item.currentDecision).toContain('暂不把2.01×或37.04×折算');
    expect(item.nextStudy.budgetFormula).toContain('同一已准入处理');
  });

  it('requires actual measured cost before budget reallocation', () => {
    const item = note('acceleration-budget-reallocation');
    expect(item.nextStudy.primaryMetric).toContain('端到端');
    expect(item.nextStudy.stopRule).toContain('同合同端到端实测');
    expect(item.nextStudy.existingPrs).toEqual([]);
  });

  it('pins every external evidence reference to a real nonzero commit identity', () => {
    for (const evidence of RESEARCH_DECISION_EVIDENCE) {
      expect(evidence.commit).toMatch(/^[a-f0-9]{40}$/);
      expect(evidence.commit).not.toBe('0'.repeat(40));
      expect(evidence.url).toMatch(/^https:\/\/github\.com\//);
      expect(evidence.checkedAt).toBe('2026-10-03');
    }
  });

  it('records merged evidence and open execution owners as different roles', () => {
    const q01 = RESEARCH_DECISION_EVIDENCE.find((item) => item.id === 'q01-horizon');
    const q04 = RESEARCH_DECISION_EVIDENCE.find((item) => item.id === 'q04-rank-owner');
    expect(q01?.stateAtCheck).toBe('merged');
    expect(q01?.role).toBe('observation');
    expect(q04?.stateAtCheck).toBe('open');
    expect(q04?.role).toBe('existing-study-owner');
  });

  it('does not treat a closed unmerged scientific PR as merged main authority', () => {
    const stage1 = RESEARCH_DECISION_EVIDENCE.find((item) => item.id === 'post-advisor-stage1-rank32');
    expect(stage1?.stateAtCheck).toBe('closed-unmerged');
    expect(stage1?.role).toBe('observation');
  });

  it('does not invent exact GPU-hour savings in any D04 budget formula', () => {
    for (const item of RESEARCH_DECISION_NOTES) {
      expect(item.nextStudy.budgetFormula).not.toMatch(/GPU\s*小时\s*[=:]\s*\d/i);
      expect(item.nextStudy.budgetFormula).not.toMatch(/GPU[- ]?hours?\s*[=:]\s*\d/i);
    }
  });

  it('makes the existing owner mandatory for every continue decision', () => {
    for (const item of RESEARCH_DECISION_NOTES.filter((value) => value.status === 'continue-existing-work')) {
      expect(item.nextStudy.action).toBe('continue-existing-work');
      expect(item.nextStudy.existingPrs.length).toBeGreaterThan(0);
    }
  });

  it('does not attach an execution owner to a question already closed by evidence', () => {
    const item = note('training-horizon');
    expect(item.nextStudy.d04CreatesNewPr).toBe(false);
    expect(item.nextStudy.d04NewFormalRollouts).toBe(0);
    expect(item.nextStudy.executionAuthorityFromD04).toBe(false);
  });

  it('exposes a compact machine-readable handoff summary', () => {
    expect(researchDecisionSummary()).toEqual({
      checkedAt: '2026-10-03',
      questions: 5,
      continueExisting: ['learning-signal-transfer', 'rank-capacity-knee', 'beta-late-dynamics'],
      closedByEvidence: ['training-horizon'],
      waiting: ['acceleration-budget-reallocation'],
      d04NewFormalRollouts: 0,
    });
  });
});
