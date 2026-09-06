import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CAPABILITY_READER_ROUTES as routes } from '../data/capabilityReaderRoutes';
import { ESCAPED_UI_REGRESSIONS } from '../../scripts/preflight-ui';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const base = 'research/seed-openevo/study/capability-exploration';
function astroRoutes(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? astroRoutes(path) : path.endsWith('.astro') ? [path] : [];
  });
}
function routeKey(path: string, directory: string) {
  return relative(directory, path).replaceAll('\\', '/').replace(/(?:^|\/)index\.astro$/, '').replace(/\.astro$/, '');
}

describe('capability route reader contracts', () => {
  for (const locale of ['zh', 'en'] as const) {
    it(`registers every ${locale} public route and mounts its declared reader context`, () => {
      const directory = join(repo, 'src/pages', locale === 'en' ? 'en' : '', base);
      const actual = astroRoutes(directory);
      expect(actual.map((path) => routeKey(path, directory)).sort()).toEqual(routes.map((row) => row.route).sort());
      for (const row of routes) {
        const path = actual.find((candidate) => routeKey(candidate, directory) === row.route)!;
        const content = readFileSync(path, 'utf8');
        expect(content).toContain(`<${row.owner} locale={locale} />`);
        expect(row.label[locale].trim().length).toBeGreaterThan(0);
        expect(row.purpose[locale].trim().length).toBeGreaterThan(0);
        if (row.coverage === 'contextualized') expect(content).toContain(`<ResearchRouteContext locale={locale} route="${row.route}" />`);
        else expect(readFileSync(join(repo, 'src/components/research', `${row.owner}.astro`), 'utf8')).toContain('<ResearchTaskContext locale={locale} />');
      }
    });
  }

  it('keeps reader regression cases in the actual standard browser gate', () => {
    const scripts = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).scripts as Record<string, string>;
    for (const gate of ['test:ui', 'test:ui:all']) expect(scripts[gate]).toContain('tests/e2e/openevo-two-map.spec.ts');
    const browser = readFileSync(join(repo, 'tests/e2e/openevo-two-map.spec.ts'), 'utf8');
    expect(browser).toContain('registerReaderJourneyTests();');
    expect(ESCAPED_UI_REGRESSIONS.find((row) => row.id === 'reader-journey-default-visible')?.gate).toBe('tests/e2e/openevo-two-map.spec.ts');
    expect(ESCAPED_UI_REGRESSIONS.find((row) => row.id === 'reader-lifecycle-evidence')?.gate).toBe('src/data/openEvoMechanismNarrative.test.ts');
  });
});
