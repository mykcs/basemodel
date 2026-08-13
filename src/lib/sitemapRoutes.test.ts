import { readdirSync } from 'node:fs';
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
  '/research/seed-openevo/experiment/',
  '/research/seed-openevo/benchmarks/',
  '/research/seed-openevo/loops/',
  '/research/seed-openevo/results/',
];

const missionRouteFiles = (directory: string) =>
  readdirSync(new URL(directory, import.meta.url))
    .filter((name) => name.endsWith('.astro'))
    .sort();

const missionRoutePaths = missionRouteFiles('../pages/research/seed-openevo/').map((name) =>
  name === 'index.astro'
    ? '/research/seed-openevo/'
    : `/research/seed-openevo/${name.replace(/\.astro$/, '')}/`,
);

const englishMissionRouteFiles = missionRouteFiles('../pages/en/research/seed-openevo/');

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

  it('keeps every mission route in the sitemap and preserves bilingual route parity', () => {
    expect(new Set(missionPaths)).toEqual(new Set(missionRoutePaths));
    expect(englishMissionRouteFiles).toEqual(
      missionRouteFiles('../pages/research/seed-openevo/'),
    );
    for (const path of missionRoutePaths) {
      expect(bilingualStaticPaths, `${path} is missing from the sitemap`).toContain(path);
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
