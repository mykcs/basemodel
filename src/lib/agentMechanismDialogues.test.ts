import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo architecture comparison', () => {
  const legacyComponent = read('src/components/research/SeedOpenEvoComparisonDiagram.astro');
  const canonicalComponent = read('src/components/research/SeedOpenEvoCanonicalFigure.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('keeps both update mechanisms explicit in the retained static technical reference', () => {
    expect(legacyComponent).toContain('SEED');
    expect(legacyComponent).toContain('OpenEvo');
    expect(legacyComponent).toContain('updated policy checkpoint');
    expect(legacyComponent).toContain('memory / artifact / adapter');
    expect(legacyComponent).toContain('successor revision');
  });

  it('keeps the legacy technical reference available without making it the page owner', () => {
    expect(legacyComponent).toContain('SEED 与 OpenEvo 的经验载体');
    expect(legacyComponent).toContain('fork-scene');
    expect(legacyComponent).toContain('border-top:5px solid');
    expect(legacyComponent).toContain('<svg class="fork-wires"');
    expect(legacyComponent).toContain('<marker');
    expect(legacyComponent).toContain('marker-end=');
  });

  it('mounts one canonical comparison as the sole bilingual loop figure', () => {
    expect(canonicalComponent).toContain('fig-seed-openevo-update-target');
    expect(canonicalComponent).toContain('SHARED EXPERIENCE');
    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('SeedOpenEvoCanonicalFigure');
      expect(route).not.toContain('InteractiveResearchExplainer');
      expect(route).not.toContain('kind="compare"');
      expect(route).not.toContain('client:visible');
      expect(route).not.toContain('SeedOpenEvoComparisonDiagram');
    }
  });
});
