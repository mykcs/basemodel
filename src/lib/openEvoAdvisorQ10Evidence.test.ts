import {describe, expect, it} from 'vitest';
import {ADVISOR_QUESTIONS} from '../data/openEvoAdvisorTenQuestions';
import {ADVISOR_READER_DIGEST} from '../data/openEvoAdvisorReaderDigest';

const q10=ADVISOR_QUESTIONS.find(q=>q.id==='q10');
describe('advisor Q10 current scientific evidence and honest non-completion',()=>{
  it('distinguishes historic single-update transfer from unrun long-run confirmation',()=>{
    expect(q10).toBeDefined();
    expect(q10?.evidenceState).toBe('partial');
    expect(q10?.finding).toContain('H1.38B');
    expect(q10?.finding).toContain('H1.39');
    expect(q10?.finding).toContain('0.124');
    expect(q10?.finding).toContain('0.249');
    expect(q10?.finding).toContain('不是 Q10 的长期训练结果');
    for(const fact of ['192次评测','没有新增训练','33.90','45.22','−11.33','OWNER_PAUSED']) expect(q10?.finding).toContain(fact);
    expect(q10?.unknown).toContain('不能自动恢复');
    expect(ADVISOR_READER_DIGEST.q10.answer).toContain('不等于连续学习 160 轮');
  });
  it('retains the paid fresh Q07 result without upgrading its null interval',()=>{
    const q07=ADVISOR_QUESTIONS.find(q=>q.id==='q07');
    for(const fact of ['70.61','62.79','−7.82','−18.00 至 +1.46','没有确认','128次评测']) expect(q07?.finding).toContain(fact);
    expect(q07?.unknown).toContain('并非评测R156 checkpoint');
    expect(q07?.unknown).toContain('不能隔离方向与更新范数');
  });
  it('keeps frozen panel, activation and scope independently traceable',()=>{
    expect(ADVISOR_READER_DIGEST.q10.done).toContain('128 道');
    expect(q10?.experiment).toContain('三条独立');
    expect(q10?.experiment).toContain('匹配对照');
    expect(q10?.interpretation).toContain('不能自动宣布前九问');
    expect(q10?.unknown).toContain('由用户暂停');
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
