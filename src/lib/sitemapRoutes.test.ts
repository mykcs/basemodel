import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bilingualStaticPaths,
  bilingualCompatibilityPaths,
  availableLocalesForRoute,
  localizedRoute,
  sitemapStaticPaths,
  toEnglishPath,
  zhOnlyStaticPaths,
} from './sitemapRoutes';

const missionPaths = [
  '/research/seed-openevo/flow/',
  '/research/seed-openevo/flow/server/',
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

const archivedEnglishFlowRouteFiles = missionRouteFiles('../../docs/archive/site-en/src/pages/en/research/seed-openevo/flow/');
const archivedEnglishStudyRouteFiles = missionRouteFiles('../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/');

describe('sitemap route coverage', () => {
  it('keeps the shipped GDR → DirectApply page active in Chinese only', () => {
    const path = '/research/seed-openevo/study/capability-exploration/gdr-directapply/';
    expect(bilingualStaticPaths).toContain(path);
    expect(sitemapStaticPaths()).toContain(path);
    expect(sitemapStaticPaths()).not.toContain(toEnglishPath(path));
    expect(availableLocalesForRoute(path)).toEqual(['zh']);
    expect(localizedRoute(path, 'en')).toBeNull();
  });

  it('keeps moved pages as Chinese compatibility routes, not sitemap pages', () => {
    for (const path of ['/research/seed-openevo/flow/base-model/', '/research/seed-openevo/study/design/']) {
      expect(bilingualCompatibilityPaths).toContain(path);
      expect(bilingualStaticPaths).not.toContain(path);
      expect(sitemapStaticPaths()).not.toContain(path);
      expect(sitemapStaticPaths()).not.toContain(toEnglishPath(path));
      expect(availableLocalesForRoute(path)).toEqual(['zh']);
      expect(localizedRoute(path, 'en')).toBeNull();
    }
  });

  it('keeps the current Chinese product and research route inventory', () => {
    for (const path of ['/lab/', ...missionPaths]) expect(bilingualStaticPaths).toContain(path);
  });

  it('keeps every mission route in the sitemap while preserving the archived English snapshot', () => {
    expect(new Set(missionPaths)).toEqual(new Set(missionRoutePaths));
    expect(archivedEnglishFlowRouteFiles).toEqual(missionRouteFiles('../pages/research/seed-openevo/flow/'));
    expect(archivedEnglishStudyRouteFiles).toEqual(missionRouteFiles('../pages/research/seed-openevo/study/'));
    for (const path of missionRoutePaths) expect(bilingualStaticPaths, `${path} is missing from the sitemap`).toContain(path);
  });

  it('keeps English page sources archived outside the active Astro page tree', () => {
    expect(existsSync(new URL('../pages/en/', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../../docs/archive/site-en/README.md', import.meta.url))).toBe(true);
    expect(existsSync(new URL('../../docs/archive/site-en/src/pages/en/index.astro', import.meta.url))).toBe(true);
  });

  it('keeps the dated same-day runbook Chinese-only', () => {
    expect(zhOnlyStaticPaths).toContain('/guide/today/');
    expect(bilingualStaticPaths).not.toContain('/guide/today/');
  });

  it('retains the English path helper only for archive and redirect compatibility', () => {
    expect(toEnglishPath('/')).toBe('/en/');
    expect(toEnglishPath('/lab/')).toBe('/en/lab/');
  });

  it('does not contain duplicate static paths', () => {
    const allPaths = [...bilingualStaticPaths, ...zhOnlyStaticPaths];
    expect(new Set(allPaths).size).toBe(allPaths.length);
  });

  it('advertises Chinese only for every current route', () => {
    for (const path of [...bilingualStaticPaths, ...bilingualCompatibilityPaths, ...zhOnlyStaticPaths]) {
      expect(availableLocalesForRoute(path)).toEqual(['zh']);
      expect(localizedRoute(path, 'zh')).toBe(path);
      expect(localizedRoute(path, 'en')).toBeNull();
    }
    expect(availableLocalesForRoute('/models/qwen2-5-3b-instruct/')).toEqual(['zh']);
    expect(localizedRoute('/models/qwen2-5-3b-instruct/', 'en')).toBeNull();
  });

  it('maps every declared static locale URL to a real active Astro page owner', () => {
    const pageExists = (route: string) => {
      const relative = route === '/' ? 'index' : route.replace(/^\//, '').replace(/\/$/, '');
      return existsSync(new URL(`../pages/${relative}.astro`, import.meta.url))
        || existsSync(new URL(`../pages/${relative}/index.astro`, import.meta.url))
        || (relative.startsWith('research/seed-openevo/study/results/')
          && existsSync(new URL('../pages/research/seed-openevo/study/results/[note].astro', import.meta.url)));
    };
    for (const path of sitemapStaticPaths()) {
      expect(path.startsWith('/en/')).toBe(false);
      expect(pageExists(path), `missing page for ${path}`).toBe(true);
    }
  });
});
