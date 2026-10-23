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
      // A semantic type role is a valid (and preferred) replacement for a
      // literal rem value. The old gate wrongly rejected a component once
      // every explicit font-size declaration had migrated to --type-*.
      const sizes = [...source.matchAll(/font-size:\s*(0?\.\d+)rem/g)].map((match) => Number(match[1]));
      const semanticRoles = [...source.matchAll(/font-size:\s*var\(--type-[a-z-]+\)/g)];
      expect(sizes.length + semanticRoles.length, path).toBeGreaterThan(0);
      for (const size of sizes) expect(size, `${path} contains ${size}rem copy`).toBeGreaterThanOrEqual(0.72);
      if (path.endsWith('CatalogFreshnessNotice.astro')) {
        // These are explanation paragraphs, not 12px decorative metadata.
        expect(source).toMatch(/\.catalog-freshness__summary p\{[^}]*font-size:var\(--type-body-small\)/);
        expect(source).toMatch(/\.catalog-freshness__signals li>p\{[^}]*font-size:var\(--type-body-small\)/);
      }
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
