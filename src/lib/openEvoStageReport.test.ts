import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ADVISOR_Q04_CAPACITY } from '../data/openEvoAdvisorTenQuestions';
import intervalData from '../data/advisorConfidenceIntervals.json';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import { TECHNICAL_ARTICLE_ROUTES } from '../data/technicalArticleRoutes';
import { zhOnlyStaticPaths } from './sitemapRoutes';

const read = (path: string) => readFileSync(new URL('../../'+path, import.meta.url),'utf8');
const route='/research/seed-openevo/study/parameter-memory-report/';
const source=read('src/pages/research/seed-openevo/study/parameter-memory-report/index.astro');

describe('approved stage-report reading path',()=>{
  it('reuses Q04 source-owned numbers and source-bound paired interval',()=>{
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.bytes)).toEqual(['205.6 MB','51.4 MB']);
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.score)).toEqual(['62.98','61.19']);
    const f=intervalData.figures.find(x=>x.id==='rank32-paired');
    expect(f?.effects[0]).toMatchObject({id:'rank32',low:expect.any(Number),high:expect.any(Number)});
    const effect = f?.effects[0];
    if (!effect) throw new Error('Missing rank32 paired confidence interval');
    expect(effect.low).toBeLessThan(0);
    expect(effect.high).toBeGreaterThan(0);
    expect(source).toContain('ADVISOR_Q04_CAPACITY');
    expect(source).toContain("id === 'rank32-paired'");
    expect(source).toContain('<PaperIntervalPlot');
    expect(source).toContain('figure.source.url');
    expect(source).not.toContain('205.6 MB');
    expect(source).not.toContain('51.4 MB');
  });
  it('has a report-first directory, evidence, limits, next steps and deep sources',()=>{
    for (const id of ['progress','outcome','protocol','limits','next','reading']) {
      expect(source).toContain(`id="${id}"`);
      expect(source).toContain(`href="#${id}"`);
    }
    expect(source.indexOf('stage-report__toc')).toBeLessThan(source.indexOf('stage-report__cover'));
    expect(source).toContain('都是固定容量方案');
    expect(source).toContain('更长时间的匹配比较未闭合');
    expect(source).toContain('Q10 的长期方案处于用户暂停状态');
    expect(source).toContain('/study/openevo-methods/');
    expect(source).toContain('/study/advisor-questions/');
    expect(source).toContain('/study/parameter-memory-results/');
    expect(source).not.toContain('phd-dark');
  });
  it('is registered as a Chinese research article with a reader contract',()=>{
    expect(zhOnlyStaticPaths).toContain(route);
    expect(TECHNICAL_ARTICLE_ROUTES).toContain(route);
    const contract=SITE_READER_CONTRACTS.find(x=>x.id==='study-parameter-memory-report');
    expect(contract?.sourceRoute).toBe(route);
    expect(contract?.firstViewportSelector).toBe('.stage-report__lede');
    expect(read('src/components/research/OpenEvoExperimentIndex.astro')).toContain('data-stage-report-entry');
  });
});
