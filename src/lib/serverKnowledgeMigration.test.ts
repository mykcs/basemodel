import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const vercel = JSON.parse(read('../../vercel.json'));
const redirects = new Map(vercel.redirects.map((row: any) => [row.source, row]));

const machines = 'https://fuhuo-20260419.vercel.app/docs/machines';
const lifecycle = 'https://fuhuo-20260419.vercel.app/docs/server-governance';

describe('LYG2171 public knowledge migration', () => {
  it('permanently redirects the eight legacy server URLs to fuhuo', () => {
    const expected: Record<string, string> = {
      '/lab': machines, '/lab/': machines, '/en/lab': machines, '/en/lab/': machines,
      '/research/seed-openevo/flow/server': lifecycle, '/research/seed-openevo/flow/server/': lifecycle,
      '/en/research/seed-openevo/flow/server': lifecycle, '/en/research/seed-openevo/flow/server/': lifecycle,
    };
    for (const [source, destination] of Object.entries(expected)) {
      const row = redirects.get(source) as any;
      expect(row?.destination, source).toBe(destination);
      expect(row?.permanent, source).toBe(true);
    }
  });

  it('routes current visible server navigation to the fuhuo owners', () => {
    expect(read('../components/LegacyTodayRunbookNotice.astro')).toContain(machines);
    expect(read('../components/research/ResearchConceptIndex.astro')).toContain(machines);
    expect(read('../components/research/SeedOpenEvoResearchNav.astro')).toContain(lifecycle);
  });

  it('makes the ownership boundary startup-visible', () => {
    const agents = read('../../AGENTS.md');
    expect(agents).toContain('LYG2171 public ownership has moved to fuhuo');
    expect(agents).toContain(machines);
    expect(agents).toContain(lifecycle);
    expect(agents).toContain('must not receive new live LYG2171 facts');
  });
});
