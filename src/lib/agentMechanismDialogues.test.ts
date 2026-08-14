import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo architecture comparison', () => {
  const component = read('src/components/research/SeedOpenEvoComparisonDiagram.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('keeps both update mechanisms explicit', () => {
    expect(component).toContain('SEED');
    expect(component).toContain('OpenEvo');
    expect(component).toContain('model parameters');
    expect(component).toContain('memory / artifact / adapter');
    expect(component).toContain('successor revision');
  });

  it('uses framed color-coded nodes and CSS connectors', () => {
    expect(component).toContain('SEED vs OpenEvo');
    expect(component).toContain('compare-grid');
    expect(component).toContain('border-top:4px solid');
    expect(component).toContain('.flow>i:after');
  });

  it('remains mounted on both localized loop-comparison routes', () => {
    for (const route of [zhRoute,enRoute]) {
      expect(route).toContain('SeedOpenEvoComparisonDiagram');
      expect(route).toContain('<SeedOpenEvoComparisonDiagram locale={locale} />');
    }
  });
});
