import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { TECHNICAL_ARTICLE_ROUTES, READING_OVERVIEW_ROUTES, isReadingOverviewRoute, isTechnicalArticleRoute } from '../data/technicalArticleRoutes';
import { readerContractForRoute } from '../data/siteReaderContracts';

describe('technical article reading inventory', () => {
  it('binds every article to its existing reader contract without a wildcard', () => {
    expect(new Set(TECHNICAL_ARTICLE_ROUTES).size).toBe(TECHNICAL_ARTICLE_ROUTES.length);
    for (const route of [...TECHNICAL_ARTICLE_ROUTES,...READING_OVERVIEW_ROUTES]) {
      expect(readerContractForRoute(route), route).toBeDefined();
      expect(isTechnicalArticleRoute(route + '?review=1#evidence'), route).toBe(true);
      expect(isTechnicalArticleRoute('/en' + route), route).toBe(true);
    }
  });
  it('keeps tools, catalog directories, presentations and moved pages out of the article treatment', () => {
    for (const route of ['/','/development/','/en/development/','/models/','/compare/','/workspace/','/research/seed-openevo/study/run/','/research/seed-openevo/study/briefing/','/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/','/research/seed-openevo/study/results/webshop-training/']) {
      expect(isTechnicalArticleRoute(route), route).toBe(false);
    }
  });
  it('includes paper records while keeping the paper catalog functional',()=>{
    expect(isReadingOverviewRoute('/papers/seed/')).toBe(true);
    expect(isReadingOverviewRoute('/en/papers/metagpt/?review=1')).toBe(true);
    expect(isReadingOverviewRoute('/papers/')).toBe(false);
    expect(isReadingOverviewRoute('/papers/seed/nested/')).toBe(false);
  });
  it('keeps one owner for prose while scientific table fonts stay with booktabs', () => {
    const read = (p: string) => fs.readFileSync(p, 'utf8');
    const css = read('src/styles/research-article.css');
    expect(css).toContain('font: 400 14px/1.8');
    expect(css).toContain('min(750.4px, calc(100% - 24px))');
    expect(css).not.toContain('!important');
    expect(read('src/styles/openevo-research-blogs.css')).not.toContain('font-size:17px');
    expect(read('src/styles/research-booktabs.css')).toContain('"Times New Roman",Times');
    expect(read('src/styles/advisor-ten-approved-reader.css')).toContain('.advisor-ten-toc');
  });
});
