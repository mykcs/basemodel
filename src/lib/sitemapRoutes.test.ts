import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bilingualStaticPaths,
  bilingualCompatibilityPaths,
  availableLocalesForRoute,
  englishRuntimeArchived,
  localizedRoute,
  sitemapStaticPaths,
  toEnglishPath,
  zhOnlyStaticPaths,
  zhOnlyCompatibilityPaths,
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

const archivedRouteFiles = (directory: string) =>
  readdirSync(new URL(directory, import.meta.url))
    .filter((name) => name.endsWith('.astro.archive'))
    .map((name) => name.replace(/\.archive$/, ''))
    .sort();

const trackRoutePaths = (directory: string, prefix: string) =>
  missionRouteFiles(directory).map((name) =>
    name === 'index.astro' ? `${prefix}/` : `${prefix}/${name.replace(/\.astro$/, '')}/`,
  );

const missionRoutePaths = [
  ...trackRoutePaths('../pages/research/seed-openevo/flow/', '/research/seed-openevo/flow'),
  ...trackRoutePaths('../pages/research/seed-openevo/study/', '/research/seed-openevo/study'),
];

const archivedEnglishRoot = '../../docs/archive/site-en/src/pages/en/';

describe('sitemap route coverage', () => {
  it('keeps the shipped GDR → DirectApply page active in Chinese only', () => {
    const path = '/research/seed-openevo/study/capability-exploration/gdr-directapply/';
    expect(englishRuntimeArchived).toBe(true);
    expect(bilingualStaticPaths).toContain(path);
    expect(sitemapStaticPaths()).toContain(path);
    expect(sitemapStaticPaths()).not.toContain(toEnglishPath(path));
    expect(availableLocalesForRoute(path)).toEqual(['zh']);
    expect(localizedRoute(path, 'en')).toBeNull();
  });

  it('publishes the live Effective-State OFF/ON study in the production sitemap', () => {
    const path = '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';
    expect(bilingualStaticPaths).toContain(path);
    expect(sitemapStaticPaths()).toContain(path);
    expect(availableLocalesForRoute(path)).toEqual(['zh']);
    expect(localizedRoute(path, 'zh')).toBe(path);
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


  it('keeps moved Results primers addressable as Chinese compatibility routes but out of the sitemap', () => {
    for (const path of zhOnlyCompatibilityPaths) {
      expect(zhOnlyStaticPaths).not.toContain(path);
      expect(sitemapStaticPaths()).not.toContain(path);
      expect(availableLocalesForRoute(path)).toEqual(['zh']);
      expect(localizedRoute(path, 'zh')).toBe(path);
    }
  });


  it('covers the released Chinese product and research routes', () => {
    for (const path of ['/lab/', ...missionPaths]) expect(bilingualStaticPaths).toContain(path);
  });

  it('keeps every active mission route in the Chinese sitemap', () => {
    expect(new Set(missionPaths)).toEqual(new Set(missionRoutePaths));
    for (const path of missionRoutePaths) {
      expect(bilingualStaticPaths, `${path} is missing from the sitemap`).toContain(path);
      expect(sitemapStaticPaths()).toContain(path);
      expect(sitemapStaticPaths()).not.toContain(toEnglishPath(path));
    }
  });

  it('keeps the archived English mission wrappers byte-addressable but inert', () => {
    expect(existsSync(new URL(archivedEnglishRoot, import.meta.url))).toBe(true);
    expect(archivedRouteFiles(`${archivedEnglishRoot}research/seed-openevo/flow/`)).toEqual(
      missionRouteFiles('../pages/research/seed-openevo/flow/'),
    );
    expect(archivedRouteFiles(`${archivedEnglishRoot}research/seed-openevo/study/`)).toEqual(
      missionRouteFiles('../pages/research/seed-openevo/study/'),
    );
    expect(existsSync(new URL('../pages/en/', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../../docs/archive/site-en/MANIFEST.tsv', import.meta.url))).toBe(true);
  });

  it('keeps the dated same-day runbook Chinese-only', () => {
    expect(zhOnlyStaticPaths).toContain('/guide/today/');
    expect(bilingualStaticPaths).not.toContain('/guide/today/');
  });

  it('retains a deterministic English-path mapper for future restoration and redirects', () => {
    expect(toEnglishPath('/')).toBe('/en/');
    expect(toEnglishPath('/lab/')).toBe('/en/lab/');
    for (const path of bilingualStaticPaths) {
      expect(toEnglishPath(path)).toMatch(/^\/en\/.+|^\/en\/$/);
      expect(toEnglishPath(path)).not.toContain('//');
    }
  });

  it('does not contain duplicate active static paths', () => {
    const allPaths = [...bilingualStaticPaths, ...zhOnlyStaticPaths];
    expect(new Set(allPaths).size).toBe(allPaths.length);
  });

  it('exposes only Chinese locale targets while English is archived', () => {
    for (const path of [...bilingualStaticPaths, ...zhOnlyStaticPaths]) {
      expect(availableLocalesForRoute(path)).toEqual(['zh']);
      expect(localizedRoute(path, 'zh')).toBe(path);
      expect(localizedRoute(path, 'en')).toBeNull();
    }
  });

  it('maps every declared static URL to a real active Astro page owner', () => {
    const pageExists = (route: string) => {
      const relative = route === '/' ? 'index' : route.replace(/^\//, '').replace(/\/$/, '');
      return existsSync(new URL(`../pages/${relative}.astro`, import.meta.url))
        || existsSync(new URL(`../pages/${relative}/index.astro`, import.meta.url))
        || (relative.startsWith('research/seed-openevo/study/results/')
          && existsSync(new URL('../pages/research/seed-openevo/study/results/[note].astro', import.meta.url)));
    };
    for (const path of sitemapStaticPaths()) expect(pageExists(path), `missing page for ${path}`).toBe(true);
  });
});
