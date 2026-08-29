import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bilingualStaticPaths,
  availableLocalesForRoute,
  localizedRoute,
  sitemapStaticPaths,
  toEnglishPath,
  zhOnlyStaticPaths,
} from './sitemapRoutes';

const missionPaths = [
  '/research/seed-openevo/flow/',
  '/research/seed-openevo/flow/server/',
  '/research/seed-openevo/flow/base-model/',
  '/research/seed-openevo/flow/seed/',
  '/research/seed-openevo/flow/openevo/',
  '/research/seed-openevo/study/',
  '/research/seed-openevo/study/run/',
  '/research/seed-openevo/flow/benchmarks/',
  '/research/seed-openevo/flow/webshop/',
  '/research/seed-openevo/flow/alfworld/',
  '/research/seed-openevo/flow/loops/',
  '/research/seed-openevo/study/results/',
];

const missionRouteFiles = (directory: string) =>
  readdirSync(new URL(directory, import.meta.url))
    .filter((name) => name.endsWith('.astro'))
    .sort();

const trackRoutePaths = (directory: string, prefix: string) =>
  missionRouteFiles(directory).map((name) =>
    name === 'index.astro' ? `${prefix}/` : `${prefix}/${name.replace(/\.astro$/, '')}/`,
  );

const missionRoutePaths = [
  ...trackRoutePaths('../pages/research/seed-openevo/flow/', '/research/seed-openevo/flow'),
  ...trackRoutePaths('../pages/research/seed-openevo/study/', '/research/seed-openevo/study'),
];

const englishFlowRouteFiles = missionRouteFiles('../pages/en/research/seed-openevo/flow/');
const englishStudyRouteFiles = missionRouteFiles('../pages/en/research/seed-openevo/study/');

describe('sitemap route coverage', () => {
  it('covers the released bilingual product and research routes', () => {
    for (const path of [
      '/lab/',
      ...missionPaths,
    ]) {
      expect(bilingualStaticPaths).toContain(path);
    }
  });

  it('keeps every mission route in the sitemap and preserves bilingual route parity', () => {
    expect(new Set(missionPaths)).toEqual(new Set(missionRoutePaths));
    expect(englishFlowRouteFiles).toEqual(
      missionRouteFiles('../pages/research/seed-openevo/flow/'),
    );
    expect(englishStudyRouteFiles).toEqual(
      missionRouteFiles('../pages/research/seed-openevo/study/'),
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

  it('derives reciprocal locale targets and excludes unavailable translations', () => {
    for (const path of bilingualStaticPaths) {
      expect(availableLocalesForRoute(path)).toEqual(['zh', 'en']);
      expect(localizedRoute(path, 'zh')).toBe(path);
      expect(localizedRoute(path, 'en')).toBe(toEnglishPath(path));
    }
    for (const path of zhOnlyStaticPaths) {
      expect(availableLocalesForRoute(path)).toEqual(['zh']);
      expect(localizedRoute(path, 'en')).toBeNull();
    }
  });

  it('maps every declared static locale URL to a real Astro page owner', () => {
    const pageExists = (route: string) => {
      const relative = route === '/' ? 'index' : route.replace(/^\//, '').replace(/\/$/, '');
      return existsSync(new URL(`../pages/${relative}.astro`, import.meta.url))
        || existsSync(new URL(`../pages/${relative}/index.astro`, import.meta.url))
        || (!relative.startsWith('en/')
          && relative.startsWith('research/seed-openevo/study/results/')
          && existsSync(new URL('../pages/research/seed-openevo/study/results/[note].astro', import.meta.url)));
    };
    for (const path of sitemapStaticPaths()) expect(pageExists(path), `missing page for ${path}`).toBe(true);
  });
});
