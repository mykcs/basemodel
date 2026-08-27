import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');
const header = read('src/components/Header.astro');
const sitemap = read('src/lib/sitemapRoutes.ts');
const vercel = JSON.parse(read('vercel.json')) as { redirects?: Array<{ source: string; destination: string; permanent?: boolean }> };

const canonicalPages = [
  'src/pages/research/seed-openevo/flow/index.astro',
  'src/pages/research/seed-openevo/flow/base-model.astro',
  'src/pages/research/seed-openevo/flow/seed.astro',
  'src/pages/research/seed-openevo/flow/openevo.astro',
  'src/pages/research/seed-openevo/flow/benchmarks.astro',
  'src/pages/research/seed-openevo/flow/webshop.astro',
  'src/pages/research/seed-openevo/flow/alfworld.astro',
  'src/pages/research/seed-openevo/flow/loops.astro',
  'src/pages/research/seed-openevo/study/index.astro',
  'src/pages/research/seed-openevo/study/run.astro',
  'src/pages/research/seed-openevo/study/results.astro',
];

const legacyPages = [
  'src/pages/research/seed-openevo/index.astro',
  'src/pages/research/seed-openevo/webshop.astro',
  'src/pages/research/seed-openevo/experiment.astro',
  'src/pages/research/seed-openevo/results.astro',
  'src/pages/guide/openevo-webshop-alfworld.astro',
];

const redirectMap = new Map((vercel.redirects ?? []).map((item) => [item.source, item]));

describe('research URL hierarchy', () => {
  it('makes flow and study first-class path parents', () => {
    expect(header).toContain("path: '/research/seed-openevo/flow/'");
    expect(header).toContain("path: '/research/seed-openevo/study/'");
    expect(nav).toContain("p('/research/seed-openevo/flow/webshop/')");
    expect(nav).toContain("p('/research/seed-openevo/study/run/')");
    expect(nav).toContain("p('/research/seed-openevo/study/results/')");
  });

  it('moves canonical page ownership into the grouped directories', () => {
    for (const path of canonicalPages) expect(existsSync(new URL(`../../${path}`, import.meta.url)), path).toBe(true);
    for (const path of legacyPages) expect(existsSync(new URL(`../../${path}`, import.meta.url)), path).toBe(false);
  });

  it('keeps old public URLs as permanent compatibility redirects', () => {
    const expected = new Map([
      ['/research/seed-openevo', '/research/seed-openevo/flow/'],
      ['/research/seed-openevo/webshop', '/research/seed-openevo/flow/webshop/'],
      ['/research/seed-openevo/experiment', '/research/seed-openevo/study/'],
      ['/guide/openevo-webshop-alfworld', '/research/seed-openevo/study/run/'],
      ['/research/seed-openevo/results', '/research/seed-openevo/study/results/'],
      ['/research/seed-openevo/results/:path*', '/research/seed-openevo/study/results/:path*'],
      ['/en/research/seed-openevo', '/en/research/seed-openevo/flow/'],
      ['/en/research/seed-openevo/results/:path*', '/en/research/seed-openevo/study/results/:path*'],
    ]);
    for (const [source, destination] of expected) {
      expect(redirectMap.get(source)?.destination, source).toBe(destination);
      expect(redirectMap.get(source)?.permanent, source).toBe(true);
    }
  });

  it('publishes only canonical grouped URLs in the sitemap', () => {
    expect(sitemap).toContain('/research/seed-openevo/flow/');
    expect(sitemap).toContain('/research/seed-openevo/study/results/');
    expect(sitemap).not.toContain("'/research/seed-openevo/webshop/'");
    expect(sitemap).not.toContain("'/research/seed-openevo/results/'");
    expect(sitemap).not.toContain("'/guide/openevo-webshop-alfworld/'");
  });
});
