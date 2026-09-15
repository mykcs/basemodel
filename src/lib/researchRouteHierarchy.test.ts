import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');
const header = read('src/components/Header.astro');
const sitemap = read('src/lib/sitemapRoutes.ts');
const fairComparison = read('src/components/research/OpenEvoFairComparisonExplainer.astro');
const vercel = JSON.parse(read('vercel.json')) as { redirects?: Array<{ source: string; destination: string; permanent?: boolean }> };

const canonicalPages = [
  'src/pages/research/seed-openevo/flow/index.astro',
  'src/pages/research/seed-openevo/flow/seed.astro',
  'src/pages/research/seed-openevo/flow/openevo.astro',
  'src/pages/research/seed-openevo/flow/benchmarks.astro',
  'src/pages/research/seed-openevo/flow/webshop.astro',
  'src/pages/research/seed-openevo/flow/alfworld.astro',
  'src/pages/research/seed-openevo/flow/loops.astro',
  'src/pages/research/seed-openevo/flow/sd-lora/index.astro',
  'src/pages/research/seed-openevo/study/index.astro',
  'src/pages/research/seed-openevo/study/run.astro',
  'src/pages/research/seed-openevo/study/results.astro',
];

const compatibilityPages = [
  'src/pages/research/seed-openevo/flow/base-model/index.astro',
  'src/pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro',
];

const legacyPages = [
  'src/pages/research/seed-openevo/index.astro',
  'src/pages/research/seed-openevo/webshop.astro',
  'src/pages/research/seed-openevo/experiment.astro',
  'src/pages/research/seed-openevo/results.astro',
  'src/pages/guide/openevo-webshop-alfworld.astro',
];

const redirects = vercel.redirects ?? [];
const redirectMap = new Map(redirects.map((item) => [item.source, item]));

describe('research URL hierarchy', () => {
  it('makes flow and study first-class path parents', () => {
    expect(header).toContain("path: '/research/seed-openevo/flow/'");
    expect(header).toContain("path: '/research/seed-openevo/study/'");
    expect(nav).toContain("p('/research/seed-openevo/flow/webshop/')");
    expect(nav).toContain("p('/research/seed-openevo/flow/sd-lora/')");
    expect(nav).toContain("p('/research/seed-openevo/study/run/')");
    expect(nav).toContain("p('/research/seed-openevo/study/results/')");
  });

  it('moves canonical page ownership into the grouped directories', () => {
    for (const path of canonicalPages) expect(existsSync(new URL(`../../${path}`, import.meta.url)), path).toBe(true);
    for (const path of compatibilityPages) expect(existsSync(new URL(`../../${path}`, import.meta.url)), path).toBe(true);
    for (const path of legacyPages) expect(existsSync(new URL(`../../${path}`, import.meta.url)), path).toBe(false);
  });

  it('keeps old Chinese public URLs as permanent compatibility redirects', () => {
    const expected = new Map([
      ['/research/seed-openevo', '/research/seed-openevo/flow/'],
      ['/research/seed-openevo/base-model', '/models/qwen2-5-3b-instruct/'],
      ['/research/seed-openevo/flow/base-model', '/models/qwen2-5-3b-instruct/'],
      ['/research/seed-openevo/study/capability-exploration/vanilla-sd-lora', '/research/seed-openevo/flow/sd-lora/'],
      ['/research/seed-openevo/webshop', '/research/seed-openevo/flow/webshop/'],
      ['/research/seed-openevo/experiment', '/research/seed-openevo/study/'],
      ['/guide/openevo-webshop-alfworld', '/research/seed-openevo/study/run/'],
      ['/research/seed-openevo/results', '/research/seed-openevo/study/results/'],
      ['/research/seed-openevo/results/:path*', '/research/seed-openevo/study/results/:path*'],
    ]);
    for (const [source, destination] of expected) {
      expect(redirectMap.get(source)?.destination, source).toBe(destination);
      expect(redirectMap.get(source)?.permanent, source).toBe(true);
    }
  });

  it('temporarily sends archived English URLs to their Chinese counterparts without permanent caching', () => {
    expect(redirectMap.get('/en')?.destination).toBe('/');
    expect(redirectMap.get('/en')?.permanent).toBe(false);
    expect(redirectMap.get('/en/')?.destination).toBe('/');
    expect(redirectMap.get('/en/')?.permanent).toBe(false);
    const deepEnglishFallback = redirectMap.get('/en/research/seed-openevo/study/');
    expect(deepEnglishFallback?.destination).toBe('/research/seed-openevo/study/');
    expect(deepEnglishFallback?.permanent).toBe(false);
    expect(redirects.some((item) => item.source.startsWith('/en/') && (item.source.includes(':path') || item.source.includes('(.*)')))).toBe(false);
  });

  it('preserves trailing-slash variants for permanent Chinese compatibility redirects', () => {
    for (const item of redirects) {
      if (item.permanent !== true || item.source.includes(':path*') || item.source.endsWith('/')) continue;
      const slashVariant = redirectMap.get(`${item.source}/`);
      expect(slashVariant?.destination, `${item.source}/`).toBe(item.destination);
      expect(slashVariant?.permanent, `${item.source}/`).toBe(true);
    }
  });

  it('keeps generated research CTA links on canonical grouped routes', () => {
    expect(fairComparison).toContain('`${root}/study/results/`');
    expect(fairComparison).toContain('`${root}/flow/seed/`');
    expect(fairComparison).not.toContain('`${root}/results/`');
    expect(fairComparison).not.toContain('`${root}/seed/`');
  });

  it('publishes only canonical grouped URLs in the sitemap', () => {
    expect(sitemap).toContain('/research/seed-openevo/flow/');
    expect(sitemap).toContain('/research/seed-openevo/flow/sd-lora/');
    expect(sitemap).toContain('/research/seed-openevo/study/results/');
    const staticRoutes = sitemap.slice(0, sitemap.indexOf('export const bilingualCompatibilityPaths'));
    expect(staticRoutes).not.toContain("'/research/seed-openevo/flow/base-model/'");
    expect(staticRoutes).not.toContain("'/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/'");
    expect(sitemap).not.toContain("'/research/seed-openevo/webshop/'");
    expect(sitemap).not.toContain("'/research/seed-openevo/results/'");
    expect(sitemap).not.toContain("'/guide/openevo-webshop-alfworld/'");
  });
});
