import {describe, expect, it} from 'vitest';
import {ADVISOR_QUESTIONS} from '../data/openEvoAdvisorTenQuestions';
import {ADVISOR_READER_DIGEST} from '../data/openEvoAdvisorReaderDigest';

const q10=ADVISOR_QUESTIONS.find(q=>q.id==='q10');
describe('advisor Q10 current scientific evidence and honest non-completion',()=>{
  it('distinguishes historic single-update transfer from unrun long-run confirmation',()=>{
    expect(q10).toBeDefined();
    expect(q10?.evidenceState).toBe('unrun');
    expect(q10?.finding).toContain('H1.38B');
    expect(q10?.finding).toContain('H1.39');
    expect(q10?.finding).toContain('0.124');
    expect(q10?.finding).toContain('0.249');
    expect(q10?.finding).toContain('不是 Q10 的长期训练结果');
    expect(ADVISOR_READER_DIGEST.q10.answer).toContain('不等于连续学习 160 轮');
  });
  it('keeps frozen panel, activation and scope independently traceable',()=>{
    expect(ADVISOR_READER_DIGEST.q10.done).toContain('128 道');
    expect(q10?.experiment).toContain('三条独立');
    expect(q10?.experiment).toContain('匹配对照');
    expect(q10?.interpretation).toContain('不能自动宣布前九问');
    expect(q10?.unknown).toContain('正式启动');
    const sources=q10?.evidence.map(x=>x.href)??[];
    expect(sources).toEqual(expect.arrayContaining([
      expect.stringContaining('confirmation-panel-freeze-progress-20261018.json'),
      expect.stringContaining('Q10_SIMPLE_PARAMETRIC_REPLICATION.md'),
      expect.stringContaining('exact-storage-qualification/current-index.json'),
      expect.stringContaining('h1.38b-correction-02/reconciliation-summary.json'),
      expect.stringContaining('h1.39-mr/reconciliation-summary.json'),
    ]));
  });
});
