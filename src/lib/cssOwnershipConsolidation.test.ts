import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const site = read('../styles/site.css');
const visualUpgrade = read('../styles/visual-upgrade.css');
const designRefinement = read('../styles/design-refinement.css');
const figures = read('../styles/research-figure-readability.css');
const tokens = read('../styles/tokens.css');
const paperFigures = [
  '../components/research/SeedWebShopCanonicalFigure.astro',
  '../components/research/WebShopDatasetCanonicalFigure.astro',
  '../components/research/WebShopEvaluationFigure.astro',
  '../components/research/WebShopGoalGenerationFigure.astro',
  '../components/research/WebShopSeedDataUsageFigure.astro',
  '../components/research/WebShopSeedSplitFigure.astro',
  '../components/research/WebShopSmallWorldFigure.astro',
];

describe('A03 shared CSS ownership', () => {
  it('keeps the effective reading measure in the token owner instead of patch layers', () => {
    expect(tokens).toContain('--reading-width: 68ch;');
    expect(visualUpgrade).not.toContain('--reading-width:');
    expect(designRefinement).not.toContain('--reading-width:');
  });

  it('keeps shared section-heading structure in site.css instead of patch layers', () => {
    expect(site).toContain('.section-heading { display: flex; align-items: flex-start;');
    expect(site).toContain('.section-heading h2 { max-width: 22ch; }');
    expect(site).toContain('@media (max-width: 760px)');
    expect(site).toContain('@media (max-width: 720px)');
    expect(visualUpgrade).not.toMatch(/\.section-heading\b/);
    expect(designRefinement).not.toMatch(/\.section-heading\b/);
  });

  it('gives paper-style canonical figures one shell owner without flattening feature geometry', () => {
    expect(figures).toContain('.canonical-figure--paper {');
    expect(figures).toContain('width: min(1120px, calc(100% - 2rem));');
    expect(figures).toContain('border-radius: var(--radius-feature);');
    for (const relative of paperFigures) {
      const source = read(relative);
      expect(source).toContain('class="canonical-figure canonical-figure--paper ');
      expect(source).not.toMatch(/width:\s*min\(1120px,\s*calc\(100%\s*-\s*2rem\)\)/);
      expect(source).not.toMatch(/padding:\s*clamp\(1rem,\s*3vw,\s*2rem\)/);
    }
    const comparison = read('../components/research/SeedOpenEvoCanonicalFigure.astro');
    expect(comparison).toContain('class="canonical-figure comparison-figure"');
    expect(comparison).not.toContain('canonical-figure--paper');
  });
});
