import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ADVISOR_DECISION_BRIEF, validateAdvisorDecisionBrief } from '../data/openEvoAdvisorDecisionBrief';
import { ADVISOR_QUESTIONS } from '../data/openEvoAdvisorTenQuestions';

const page = readFileSync(
  new URL('../pages/research/seed-openevo/study/parameter-memory-results/index.astro', import.meta.url),
  'utf8',
);

describe('busy advisor first-read decision path', () => {
  it('makes research purpose, bounded results, unresolved work, and next decision visible before the ten deep dives', () => {
    const overview = page.indexOf('data-advisor-overview');
    const details = page.indexOf('id="responses"');
    expect(overview).toBeGreaterThan(0);
    expect(details).toBeGreaterThan(overview);
    for (const tag of [
      'data-advisor-scientific-question',
      'data-advisor-key-findings',
      'data-advisor-critical-gaps',
      'data-advisor-priorities',
      'data-advisor-executive-evidence',
      'data-advisor-executive-gap',
    ]) {
      const at = page.indexOf(tag);
      expect(at, tag).toBeGreaterThan(overview);
      expect(at, tag).toBeLessThan(details);
    }
    expect(page).toContain('ADVISOR_DECISION_BRIEF.evidence.map');
    expect(page).toContain('ADVISOR_DECISION_BRIEF.unresolved.map');
  });

  it('anchors each executive fact in an actual deep-dive question with bounded scope', () => {
    expect(validateAdvisorDecisionBrief(ADVISOR_DECISION_BRIEF)).toEqual([]);
    const questionIds = new Set(ADVISOR_QUESTIONS.map(q => q.id));
    for (const item of [...ADVISOR_DECISION_BRIEF.evidence, ...ADVISOR_DECISION_BRIEF.unresolved]) {
      expect(questionIds.has(item.id)).toBe(true);
    }
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q04')?.finding).toContain('51.4 MB');
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q04')?.boundary).toContain('−3.68');
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q07')?.finding).toContain('10.06');
    expect(ADVISOR_DECISION_BRIEF.unresolved.map(x=>x.id)).toEqual(['q10','q03']);
    expect(ADVISOR_DECISION_BRIEF.historicalBoundary).toContain('并非严格训练对照');
    // A professor's phone viewport may reveal only the first paragraph.
    // Scientific time scope and proposal/approval state must therefore be unambiguous there.
    expect(ADVISOR_DECISION_BRIEF.researchQuestion).toContain('Q10 新题');
    expect(ADVISOR_DECISION_BRIEF.researchQuestion).toContain('建议不代表导师已批准');
    expect(ADVISOR_DECISION_BRIEF.researchQuestion).toContain('正式训练未据此启动');
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q04')?.finding).toContain('152–159 轮');
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q04')?.finding).toContain('同题比较');
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q07')?.finding).toContain('方向反过来');
    const directionBound = ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q07')?.boundary ?? '';
    expect(directionBound).toContain('已经通过 Holm 多重比较校正');
    expect(directionBound).not.toContain('未经多重比较校正');
  });

  it('rejects known-bad greenwashing: missing scientific boundary or unrun work presented as confirmed', () => {
    const lostBoundary = {
      ...ADVISOR_DECISION_BRIEF,
      evidence: ADVISOR_DECISION_BRIEF.evidence.map(x =>
        x.id==='q07' ? { ...x, boundary: '' } : x),
    };
    expect(validateAdvisorDecisionBrief(lostBoundary)).toContain('missing evidence/boundary: q07');

    const falseGeneralization = {
      ...ADVISOR_DECISION_BRIEF,
      unresolved: ADVISOR_DECISION_BRIEF.unresolved.map(x =>
        x.id==='q10' ? { ...x, state: 'confirmed' } : x),
    };
    expect(validateAdvisorDecisionBrief(falseGeneralization)).toContain('unverified work marked as done: q10');
  });

  it('allows legitimate local evidence while rejecting execution plans masquerading as results', () => {
    expect(ADVISOR_DECISION_BRIEF.evidence.find(x=>x.id==='q07')?.kind).toBe('bounded-answer');
    const prematurelyStarted = { ...ADVISOR_DECISION_BRIEF, decisionStatus: 'executed' };
    expect(validateAdvisorDecisionBrief(prematurelyStarted))
      .toContain('next decision scope missing or upgraded to execution');

    // Neighbor case: scientific reproduction and transfer questions both stay unresolved.
    for (const id of ['q03','q10']) {
      expect(ADVISOR_DECISION_BRIEF.unresolved.find(x=>x.id===id)?.state).toBe('unrun');
    }
  });
});
