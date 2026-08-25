import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const safety = read('../components/research/OpenEvoWebShopResultsMobileSafety.astro');
const resultsPageZh = read('../pages/research/seed-openevo/results.astro');
const resultsPageEn = read('../pages/en/research/seed-openevo/results.astro');

describe('Results mobile overflow safety', () => {
  it('keeps long status badges shrinkable and wrappable without hiding overflow', () => {
    expect(safety).toContain("[data-testid='openevo-webshop-result-index'] .question-copy");
    expect(safety).toContain('min-width: 0');
    expect(safety).toContain('max-width: 100%');
    expect(safety).toContain('flex-wrap: wrap');
    expect(safety).toContain('white-space: normal');
    expect(safety).toContain('overflow-wrap: anywhere');
    expect(safety).not.toContain('overflow-x: hidden');
    expect(safety).not.toContain('overflow-x: clip');
  });

  it('mounts the same mobile safety rule on both Results locale routes', () => {
    for (const page of [resultsPageZh, resultsPageEn]) {
      expect(page).toContain('OpenEvoWebShopResultsMobileSafety');
      expect(page).toContain('<OpenEvoWebShopResultsMobileSafety />');
    }
  });
});
