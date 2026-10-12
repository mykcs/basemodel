import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ADVISOR_QUESTIONS, ADVISOR_Q03_CUSTOM_PANEL,
  ADVISOR_Q04_CAPACITY, ADVISOR_Q05_FROZEN, ADVISOR_Q09_UPDATES,
  ADVISOR_RESEARCH_AS_OF,
} from '../data/openEvoAdvisorTenQuestions';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
const read = (path:string) => readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const root = 'src/pages/research/seed-openevo/study/';
const methods = read(root+'openevo-methods/index.astro');
const results = read(root+'parameter-memory-results/index.astro');
const questions = read(root+'advisor-questions/index.astro');
const methodComponent = read('src/components/research/AdvisorTenMethodExplainer.astro');
const sibling = read('src/components/research/OpenEvoArticleNavigation.astro');

describe('three OpenEVO research articles', () => {
  it('keeps ten complete source questions and distinguishes the post-meeting Q10', () => {
    expect(ADVISOR_QUESTIONS).toHaveLength(10);
    expect(ADVISOR_QUESTIONS.map((q)=>q.id)).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
    for (const q of ADVISOR_QUESTIONS) {
      for (const key of ['opening','experiment','finding','interpretation','unknown'] as const) {
        expect(q[key].length).toBeGreaterThan(12);
      }
      expect(q.evidence.length).toBeGreaterThanOrEqual(1);
      for(const e of q.evidence) expect(e.href).toMatch(/^https:\/\/github\.com\/mykcs\//);
    }
    expect(ADVISOR_QUESTIONS[9]?.unknown).toContain('会后');
    expect(questions).toContain("ADVISOR_QUESTIONS.map");
    expect(questions).toContain("data-report-question={q.id}");
    expect(questions).toContain("q.unknown");
    expect(questions).toContain("Q10 是会后延伸");
    expect(ADVISOR_RESEARCH_AS_OF).toBe('2026-10-09');
  });
  it('does not change sealed benchmark quantities when splitting presentation', () => {
    expect(ADVISOR_Q03_CUSTOM_PANEL.map(x=>x.score)).toEqual(['3.71','6.43','0.69','6.62']);
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.score)).toEqual(['62.98','61.19']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.score)).toEqual(['60.72','45.98','20.77']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.exact)).toEqual(['50 / 128','32 / 128','10 / 128']);
    expect(ADVISOR_Q09_UPDATES.map(x=>x.parametric)).toEqual([159,158,154]);
    for(const v of ['31.09','2.02','74.78','56.25','1,024','−3.68','+0.12','10.06']) expect(results).toContain(v);
  });
  it('separates full methods, experiments, and question answers', () => {
    expect(methods).toContain('BUNDLE');
    expect(methods).toContain('<AdvisorTenMethodExplainer />');
    expect(methods).toContain('Delta Rule');
    expect(methods).toContain('S_t');
    expect(methodComponent).toContain('data-rank8-disclosure');
    expect(methodComponent).toContain('rank4');
    expect(methodComponent).toContain('rank128');
    expect(methodComponent).not.toContain("name: '按学习信号调节写入（Gated Delta）'");
    expect(results).toContain('ADVISOR_Q05_FROZEN.map');
    expect(results).toContain('ADVISOR_Q09_UPDATES.map');
    expect(results).toContain('AdvisorTenEvidenceVisual variant="q04"');
    expect(questions).toContain('q.finding');
    expect(questions).toContain('q.interpretation');
    expect(questions).toContain('q.unknown');
    expect(questions).not.toContain('31.09 → 2.02');
  });
  it('gives every article a real route and first-read contract', () => {
    const ids=['study-openevo-methods','study-parameter-memory-results','study-advisor-ten'];
    const paths=['openevo-methods','parameter-memory-results','advisor-questions'];
    for(let i=0;i<ids.length;i++){
      const c=SITE_READER_CONTRACTS.find(x=>x.id===ids[i]);
      expect(c?.sourceRoute).toBe('/research/seed-openevo/study/'+paths[i]+'/');
      expect(c?.firstViewportSelector).toBe('.evo-article__lede');
    }
    expect(new Set(SITE_READER_CONTRACTS.map(x=>x.id)).size).toBe(SITE_READER_CONTRACTS.length);
    for(const page of [methods,results,questions]){
      expect(page).toContain('OpenEvoArticleNavigation');
      expect(page).toContain('openevo-research-blogs.css');
      expect(page).toContain('evo-article__toc');
      expect(page).toContain('evo-article__sources');
    }
    expect(sibling).toContain('openevo-methods/');
    expect(sibling).toContain('parameter-memory-results/');
    expect(sibling).toContain('advisor-questions/');
    expect(sibling).toContain('aria-current');
  });
  it('uses shared subdued-green article surface without changing global tokens', () => {
    const css=read('src/styles/openevo-research-blogs.css');
    expect(css).toContain(':has(.evo-blog)');
    expect(css).toContain('#f6f7f5');
    expect(css).toContain('--paper:#fff');
    expect(css).toContain('font-size:17px');
    expect(css).toContain('font-size:16.5px');
    const tokens=read('src/styles/tokens.css');
    expect(tokens).toContain('--color-bg: #f7f3eb;');
  });
  it('preserves statistical uncertainty and historical comparison boundaries', () => {
    expect(results).toContain('普通 OpenEVO 是更早的历史前序路线');
    expect(results).toContain('rank32 的平均 Task Score 低 1.79 分');
    expect(results).toContain('还没有足够证据确认 rank32');
    expect(results).toContain('不是同一个测量');
    expect(results).toContain('独立研究');
  });
});
