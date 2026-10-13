import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ADVISOR_QUESTIONS, ADVISOR_Q03_CUSTOM_PANEL,
  ADVISOR_Q04_CAPACITY, ADVISOR_Q05_FROZEN, ADVISOR_Q09_UPDATES,
  ADVISOR_RESEARCH_AS_OF,
} from '../data/openEvoAdvisorTenQuestions';
import { OPEN_EVO_ADVISOR_MEETING } from '../data/openEvoAdvisorMeeting';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (path:string) => readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const prefix='src/pages/research/seed-openevo/study/';
const methods=read(prefix+'openevo-methods/index.astro');
const questions=read(prefix+'advisor-questions/index.astro');
const responses=read(prefix+'parameter-memory-results/index.astro');
const methodComponent=read('src/components/research/AdvisorTenMethodExplainer.astro');
const navigation=read('src/components/research/OpenEvoArticleNavigation.astro');

describe('OpenEVO blog roles: method, ten questions, response experiments', () => {
  it('preserves original meeting and all ten research questions without rewriting raw evidence',()=>{
    expect(OPEN_EVO_ADVISOR_MEETING.points).toHaveLength(6);
    expect(ADVISOR_QUESTIONS).toHaveLength(10);
    expect(ADVISOR_QUESTIONS.map(q=>q.id)).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
    for(const q of ADVISOR_QUESTIONS) {
      for(const k of ['opening','experiment','finding','interpretation','unknown'] as const)
        expect(q[k].length).toBeGreaterThan(12);
      expect(q.evidence.length).toBeGreaterThanOrEqual(1);
      for(const e of q.evidence) expect(e.href).toMatch(/^https:\/\/github\.com\/mykcs\//);
    }
    expect(ADVISOR_QUESTIONS[9]?.unknown).toContain('会后');
    expect(ADVISOR_RESEARCH_AS_OF).toBe('2026-10-09');
  });
  it('uses the exact owner-requested reading order: methods, questions, our responses',()=>{
    const paths=['openevo-methods/','advisor-questions/','parameter-memory-results/'];
    const positions=paths.map(p=>navigation.indexOf("path:'/research/seed-openevo/study/"+p));
    expect(positions.every(x=>x>=0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a,b)=>a-b));
    expect(navigation).toContain('学长十问：问题与背景');
    expect(navigation).toContain('我们的回应实验');
    for(const [id,route] of [
      ['study-openevo-methods','openevo-methods'],
      ['study-advisor-ten','advisor-questions'],
      ['study-parameter-memory-results','parameter-memory-results']
    ]) {
      const c=SITE_READER_CONTRACTS.find(x=>x.id===id);
      expect(c?.sourceRoute).toBe('/research/seed-openevo/study/'+route+'/');
      expect(c?.firstViewportSelector).toBe('.evo-article__lede');
    }
  });
  it('leaves detailed mathematical mechanisms in article one',()=>{
    expect(methods).toContain('BUNDLE');
    expect(methods).toContain('<AdvisorTenMethodExplainer />');
    expect(methods).toContain('Delta Rule');
    expect(methods).toContain('Gated Delta');
    expect(methodComponent).toContain('data-rank8-disclosure');
    expect(methodComponent).toContain('rank4');
    expect(methodComponent).toContain('rank128');
    expect(methodComponent).not.toContain("name: '按学习信号调节写入（Gated Delta）'");
  });
  it('protects article two as questions only; no findings, scores or experimental charts',()=>{
    expect(questions).toContain('data-question-only');
    expect(questions).toContain('OPEN_EVO_ADVISOR_MEETING.points.map');
    expect(questions).toContain('data-research-question={q.id}');
    expect(questions).toContain('q.title');
    expect(questions).toContain('q.opening');
    expect(questions).toContain('responseHref(q.id)');
    expect(questions).toContain('会后新增');
    for(const forbidden of ['q.finding','q.experiment','q.interpretation','q.unknown','AdvisorTenEvidenceVisual','data-report-finding','31.09','20.77','第 156 轮'])
      expect(questions).not.toContain(forbidden);
  });
  it('makes article three answer all ten problems with experiment, observations, limits, raw sources',()=>{
    expect(responses).toContain('data-response-experiments');
    expect(responses).toContain('data-experiment-response={q.id}');
    expect(responses).toContain('q.experiment');
    expect(responses).toContain('q.finding');
    expect(responses).toContain('q.interpretation');
    expect(responses).toContain('q.unknown');
    expect(responses).toContain('q.evidence.map');
    expect(responses).toContain("id={'source-'+q.id}");
    expect(responses).toContain('对应的研究问题');
    for(const v of ['31.09','2.02','74.78','56.25','1,024','−3.68','+0.12','10.06'])
      expect(responses).toContain(v);
    expect(ADVISOR_Q03_CUSTOM_PANEL.map(x=>x.score)).toEqual(['3.71','6.43','0.69','6.62']);
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.score)).toEqual(['62.98','61.19']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.score)).toEqual(['60.72','45.98','20.77']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.exact)).toEqual(['50 / 128','32 / 128','10 / 128']);
    expect(ADVISOR_Q09_UPDATES.map(x=>x.parametric)).toEqual([159,158,154]);
  });
  it('preserves scientific uncertainty while reassigning article roles',()=>{
    expect(responses).toContain('普通 OpenEVO 是更早的历史前序路线');
    expect(responses).toContain('rank32 的平均 Task Score 低 1.79 分');
    expect(responses).toContain('还没有足够证据确认 rank32');
    expect(responses).toContain('不是同一个测量');
    expect(responses).toContain('独立研究');
    expect(questions).toContain('不能当作学长当时逐字提出的十句话');
  });
  it('reuses subdued-green paper typography only on the three blog pages',()=>{
    const css=read('src/styles/openevo-research-blogs.css');
    expect(css).toContain(':has(.evo-blog)');
    expect(css).toContain('#f6f7f5');
    expect(css).toContain('--paper:#fff');
    expect(css).toContain('font-size:17px');
    expect(css).toContain('font-size:16.5px');
    for(const page of [methods,questions,responses]){
      expect(page).toContain('OpenEvoArticleNavigation');
      expect(page).toContain('openevo-research-blogs.css');
      expect(page).toContain('evo-article__toc');
      expect(page).toContain('evo-article__sources');
    }
    expect(read('src/styles/tokens.css')).toContain('--color-bg: #f7f3eb;');
  });
});
