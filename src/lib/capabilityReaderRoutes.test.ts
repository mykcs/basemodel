import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CAPABILITY_READER_ROUTES as routes } from '../data/capabilityReaderRoutes';
import { bilingualCompatibilityPaths } from './sitemapRoutes';
import { ESCAPED_UI_REGRESSIONS } from '../../scripts/preflight-ui';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const base = 'research/seed-openevo/study/capability-exploration';
const compatibilityRouteKeys = new Set(bilingualCompatibilityPaths
  .filter((path) => path.startsWith(`/${base}/`))
  .map((path) => path.slice(`/${base}/`.length).replace(/\/$/, '')));

function sourceRoutes(directory: string, suffix: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceRoutes(path, suffix) : path.endsWith(suffix) ? [path] : [];
  });
}
function routeKey(path: string, directory: string, suffix: string) {
  return relative(directory, path).replaceAll('\\', '/')
    .replace(new RegExp(`(?:^|/)index\\.astro${suffix === '.astro.archive' ? '\\.archive' : ''}$`), '')
    .replace(new RegExp(`\\.astro${suffix === '.astro.archive' ? '\\.archive' : ''}$`), '');
}

describe('capability route reader contracts', () => {
  it('registers every active Chinese public route and mounts its declared reader context', () => {
    const directory = join(repo, 'src/pages', base);
    const actual = sourceRoutes(directory, '.astro');
    const canonical = actual.filter((path) => !compatibilityRouteKeys.has(routeKey(path, directory, '.astro')));
    expect(canonical.map((path) => routeKey(path, directory, '.astro')).sort()).toEqual(routes.map((row) => row.route).sort());
    expect(actual.map((path) => routeKey(path, directory, '.astro'))).toContain('vanilla-sd-lora');
    for (const row of routes) {
      const path = actual.find((candidate) => routeKey(candidate, directory, '.astro') === row.route)!;
      const content = readFileSync(path, 'utf8');
      expect(content).toContain(`<${row.owner} locale={locale} />`);
      expect(row.label.zh.trim().length).toBeGreaterThan(0);
      expect(row.purpose.zh.trim().length).toBeGreaterThan(0);
      if (row.coverage === 'contextualized') {
        expect(content).toContain(`<ResearchRouteContext locale={locale} route="${row.route}"`);
      } else {
        const owner = readFileSync(join(repo, 'src/components/research', `${row.owner}.astro`), 'utf8');
        if (row.coverage === 'self-contained') {
          for (const marker of ['data-reader-context', 'data-reader-task', 'data-reader-purpose']) expect(owner).toContain(marker);
        } else {
          expect(owner).toContain('<ResearchTaskContext locale={locale} />');
        }
      }
    }
  });

  it('retains matching English capability wrappers in the inert source archive', () => {
    const activeDir = join(repo, 'src/pages', base);
    const archiveDir = join(repo, 'docs/archive/site-en/src/pages/en', base);
    const active = sourceRoutes(activeDir, '.astro').map((path) => routeKey(path, activeDir, '.astro')).sort();
    const archived = sourceRoutes(archiveDir, '.astro.archive').map((path) => routeKey(path, archiveDir, '.astro.archive')).sort();
    // The English archive is an immutable snapshot of the old active English site,
    // not a shadow surface that grows whenever Chinese-only research routes are added.
    // Every archived route must still have an active Chinese counterpart; post-archive
    // Chinese routes intentionally have no archived English wrapper.
    expect(archived.every((route) => active.includes(route))).toBe(true);
    expect(active.filter((route) => !archived.includes(route))).toEqual(['bounded-effective-state-gdr', 'sd-lora-bounded-acceleration', 'stage1-learning-objectives']);
    for (const row of routes) {
      expect(row.label.en.trim().length).toBeGreaterThan(0);
      expect(row.purpose.en.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps the bounded study reader summary explicit about beta-gating and the unrun alpha-plus-beta slot', () => {
    const row = routes.find((candidate) => candidate.route === 'bounded-effective-state-gdr');
    expect(row?.label.zh).toContain('已完成');
    expect(row?.label.en).toContain('completed');
    expect(row?.purpose.zh).toContain('β-gating（α 固定为 1）');
    expect(row?.purpose.zh).toContain('动态 α + 动态 β 尚未运行');
    expect(row?.purpose.en).toContain('β-gating (α fixed at 1)');
    expect(row?.purpose.en).toContain('dynamic α + dynamic β has not been run');
  });

  it('keeps reader regression cases in the actual standard browser gate', () => {
    const scripts = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).scripts as Record<string, string>;
    for (const gate of ['test:ui', 'test:ui:all']) expect(scripts[gate]).toContain('tests/e2e/openevo-two-map.spec.ts');
    const browser = readFileSync(join(repo, 'tests/e2e/openevo-two-map.spec.ts'), 'utf8');
    expect(browser).toContain('registerReaderJourneyTests();');
    expect(ESCAPED_UI_REGRESSIONS.find((row) => row.id === 'reader-journey-default-visible')?.gate).toBe('tests/e2e/openevo-two-map.spec.ts');
    expect(ESCAPED_UI_REGRESSIONS.find((row) => row.id === 'reader-lifecycle-evidence')?.gate).toBe('src/data/openEvoMechanismNarrative.test.ts');
  });
});
