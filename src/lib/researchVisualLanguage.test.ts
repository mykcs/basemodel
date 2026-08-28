import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const primarySurfaces = [
  'src/components/research/SeedOpenEvoMissionHero.astro',
  'src/components/research/OpenEvoExperimentProgram.astro',
  'src/components/catalog/CatalogFreshnessNotice.astro',
];

describe('primary visual-language readability', () => {
  it('does not render explanatory copy as sub-0.72rem footnotes', () => {
    for (const path of primarySurfaces) {
      const source = read(path);
      const sizes = [...source.matchAll(/font-size:\s*(0?\.\d+)rem/g)].map((match) => Number(match[1]));
      expect(sizes.length, path).toBeGreaterThan(0);
      for (const size of sizes) expect(size, `${path} contains ${size}rem copy`).toBeGreaterThanOrEqual(0.72);
    }
  });

  it('stays inside the existing surface, line, muted, and accent visual language', () => {
    for (const path of primarySurfaces) {
      const source = read(path);
      expect(source, path).toContain('var(--line)');
      expect(source, path).toContain('var(--muted)');
      expect(source, path).not.toMatch(/linear-gradient|radial-gradient|box-shadow\s*:/);
    }
  });
});
