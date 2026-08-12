import { describe, expect, it } from 'vitest';
import {
  bilingualStaticPaths,
  toEnglishPath,
  zhOnlyStaticPaths,
} from './sitemapRoutes';

const missionPaths = [
  '/research/seed-openevo/',
  '/research/seed-openevo/base-model/',
  '/research/seed-openevo/seed/',
  '/research/seed-openevo/openevo/',
  '/research/seed-openevo/benchmarks/',
  '/research/seed-openevo/loops/',
  '/research/seed-openevo/results/',
];

describe('sitemap route coverage', () => {
  it('covers the released bilingual product and research routes', () => {
    for (const path of [
      '/lab/',
      '/guide/openevo-webshop-alfworld/',
      ...missionPaths,
    ]) {
      expect(bilingualStaticPaths).toContain(path);
    }
  });

  it('keeps the dated same-day runbook Chinese-only because no English route exists', () => {
    expect(zhOnlyStaticPaths).toContain('/guide/today/');
    expect(bilingualStaticPaths).not.toContain('/guide/today/');
  });

  it('generates valid English counterparts without double slashes', () => {
    expect(toEnglishPath('/')).toBe('/en/');
    expect(toEnglishPath('/lab/')).toBe('/en/lab/');
    for (const path of bilingualStaticPaths) {
      expect(toEnglishPath(path)).toMatch(/^\/en\/.+|^\/en\/$/);
      expect(toEnglishPath(path)).not.toContain('//');
    }
  });

  it('does not contain duplicate static paths', () => {
    const allPaths = [...bilingualStaticPaths, ...zhOnlyStaticPaths];
    expect(new Set(allPaths).size).toBe(allPaths.length);
  });
});
