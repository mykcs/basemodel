import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo architecture comparison', () => {
  const component = read('src/components/research/SeedOpenEvoComparisonDiagram.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('keeps both update mechanisms explicit in the static technical reference', () => {
    expect(component).toContain('SEED');
    expect(component).toContain('OpenEvo');
    expect(component).toContain('updated policy checkpoint');
    expect(component).toContain('memory / artifact / adapter');
    expect(component).toContain('successor revision');
  });

  it('keeps the legacy technical reference visually testable', () => {
    expect(component).toContain('SEED 与 OpenEvo 的经验载体');
    expect(component).toContain('fork-scene');
    expect(component).toContain('border-top:5px solid');
    expect(component).toContain('<svg class="fork-wires"');
    expect(component).toContain('<marker');
    expect(component).toContain('marker-end=');
  });

  it('mounts the interactive comparison as the primary bilingual loop explainer', () => {
    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('InteractiveResearchExplainer');
      expect(route).toContain('kind="compare"');
      expect(route).toContain('client:visible');
      expect(route).not.toContain('SeedOpenEvoComparisonDiagram');
    }
  });
});