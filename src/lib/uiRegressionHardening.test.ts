import { readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = resolve(srcRoot, '..');
const vercelUiGate = readFileSync(resolve(repoRoot, 'scripts/vercel-ui-gate.mjs'), 'utf8');
const explainerBrowserGate = readFileSync(resolve(repoRoot, 'tests/e2e/research-explainer-layout.spec.ts'), 'utf8');
const visualCloseoutBrowserGate = readFileSync(resolve(repoRoot, 'tests/e2e/visual-closeout-followup.spec.ts'), 'utf8');
const canonicalFigureGate = readFileSync(resolve(repoRoot, 'tests/e2e/canonical-research-figures.spec.ts'), 'utf8');
const appLayout = readFileSync(resolve(srcRoot, 'layouts/AppLayout.astro'), 'utf8');
const resultsZh = readFileSync(resolve(srcRoot, 'pages/research/seed-openevo/results.astro'), 'utf8');
const resultsEn = readFileSync(resolve(srcRoot, 'pages/en/research/seed-openevo/results.astro'), 'utf8');

function collectAstroFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) return collectAstroFiles(path);
    return entry.isFile() && entry.name.endsWith('.astro') ? [path] : [];
  });
}

describe('UI regression-class hardening', () => {
  it('forbids the HTML-looking Astro global-style typo repository-wide', () => {
    const offenders = collectAstroFiles(srcRoot)
      .filter((path) => /<style\b[^>]*\bis\s*=\s*["']global["'][^>]*>/i.test(readFileSync(path, 'utf8')))
      .map((path) => relative(repoRoot, path));

    expect(offenders, 'Use Astro <style is:global>; is="global" is still scoped.').toEqual([]);
  });

  it('keeps the results shell overrides on the real Astro global directive', () => {
    for (const route of [resultsZh, resultsEn]) {
      expect(route).toContain('<style is:global>');
      expect(route).not.toMatch(/<style\b[^>]*\bis\s*=\s*["']global["']/i);
    }
  });

  it('keeps production main inside the hosted Chromium UI gate', () => {
    expect(vercelUiGate).toContain("const productionBranch = branch === 'main';");
    expect(vercelUiGate).toContain('const shouldRun = productionBranch ||');
    expect(vercelUiGate).toContain('&& !productionBranch');
  });

  it('keeps provider-only telemetry out of the local browser harness', () => {
    expect(appLayout).not.toContain('<script defer src="/_vercel/speed-insights/script.js"></script>');
    expect(appLayout).toContain("host === 'localhost'");
    expect(appLayout).toContain("host === '127.0.0.1'");
    expect(appLayout).toContain("host === '::1'");
    expect(appLayout).toContain("speedInsights.src = '/_vercel/speed-insights/script.js';");
  });

  it('keeps interactive browser matrices aligned with actual explainer owner routes', () => {
    const ownerMatrix = explainerBrowserGate.match(/const routes = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
    const visualOwnerMatrix = visualCloseoutBrowserGate.match(/const explainerRoutes = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
    const stepperMatrix = visualCloseoutBrowserGate.match(/const stepperRoutes = \[([\s\S]*?)\] as const;/)?.[1] ?? '';

    const interactiveOwners = [
      '/research/seed-openevo/webshop/',
      '/research/seed-openevo/alfworld/',
      '/research/seed-openevo/seed/',
      '/research/seed-openevo/openevo/',
      '/lab/',
      '/en/research/seed-openevo/webshop/',
      '/en/research/seed-openevo/alfworld/',
      '/en/research/seed-openevo/seed/',
      '/en/research/seed-openevo/openevo/',
      '/en/lab/',
    ];
    for (const path of interactiveOwners) {
      expect(ownerMatrix, `research explainer owner matrix missing ${path}`).toContain(path);
      expect(visualOwnerMatrix, `visual closeout owner matrix missing ${path}`).toContain(path);
    }

    for (const path of [
      '/research/seed-openevo/webshop/',
      '/research/seed-openevo/alfworld/',
      '/research/seed-openevo/seed/',
      '/research/seed-openevo/openevo/',
      '/lab/',
    ]) expect(stepperMatrix, `visual closeout stepper matrix missing ${path}`).toContain(path);

    for (const canonicalOnly of ['/research/seed-openevo/loops/', '/en/research/seed-openevo/loops/']) {
      expect(ownerMatrix, `${canonicalOnly} must not regain a duplicate interactive explainer`).not.toContain(canonicalOnly);
      expect(visualOwnerMatrix, `${canonicalOnly} must not regain a duplicate interactive explainer`).not.toContain(canonicalOnly);
      expect(canonicalFigureGate, `${canonicalOnly} missing canonical figure acceptance`).toContain(canonicalOnly);
    }

    for (const retiredOwner of [
      '/research/seed-openevo/benchmarks/',
      '/guide/openevo-webshop-alfworld/',
      '/en/research/seed-openevo/benchmarks/',
      '/en/guide/openevo-webshop-alfworld/',
    ]) {
      expect(ownerMatrix, `research explainer matrix regained retired owner ${retiredOwner}`).not.toContain(retiredOwner);
      expect(visualOwnerMatrix, `visual closeout matrix regained retired owner ${retiredOwner}`).not.toContain(retiredOwner);
      expect(stepperMatrix, `stepper matrix regained retired owner ${retiredOwner}`).not.toContain(retiredOwner);
    }
  });
});
