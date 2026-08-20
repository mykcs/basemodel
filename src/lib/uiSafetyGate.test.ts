import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const packageJson = JSON.parse(read('../../package.json')) as {
  scripts?: Record<string, string>;
};
const playwrightConfig = read('../../playwright.config.ts');
const browserGate = read('../../tests/e2e/ui-safety.spec.ts');
const headerVisibilityGate = read('../../tests/e2e/global-header-visibility.spec.ts');
const researchGeometryGate = read('../../tests/e2e/research-explainer-layout.spec.ts');
const policy = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const geometryPolicy = read('../../docs/agents/current/research-explainer-geometry-acceptance.md');
const visualRoute = read('../components/visual/VisualRoute.astro');
const layerMap = read('../components/visual/LayerMap.astro');
const evidenceLadder = read('../components/visual/EvidenceLadder.astro');

describe('UI visual acceptance gate contract', () => {
  it('keeps the general, global-header, and research-geometry browser commands wired', () => {
    expect(packageJson.scripts?.['test:header']).toContain('global-header-visibility.spec.ts');
    expect(packageJson.scripts?.['test:header']).toContain('--project=chromium');
    expect(packageJson.scripts?.['test:header:all']).toContain('global-header-visibility.spec.ts');
    expect(packageJson.scripts?.['test:ui']).toContain('npm run test:header');
    expect(packageJson.scripts?.['test:ui']).toContain('ui-safety.spec.ts');
    expect(packageJson.scripts?.['test:ui']).toContain('research-explainer-layout.spec.ts');
    expect(packageJson.scripts?.['test:ui']).toContain('--project=chromium');
    expect(packageJson.scripts?.['test:ui:all']).toContain('npm run test:header:all');
    expect(packageJson.scripts?.['test:ui:all']).toContain('ui-safety.spec.ts');
    expect(packageJson.scripts?.['test:ui:all']).toContain('research-explainer-layout.spec.ts');
  });

  it('retains evidence when browser verification fails', () => {
    expect(playwrightConfig).toContain("trace: 'retain-on-failure'");
    expect(playwrightConfig).toContain("screenshot: 'only-on-failure'");
    expect(playwrightConfig).toContain("video: 'retain-on-failure'");
  });

  it('covers themes, viewports, overflow, clipping, overlap, and theme transitions', () => {
    expect(browserGate).toContain("theme: 'light'");
    expect(browserGate).toContain("theme: 'dark'");
    expect(browserGate).toContain('width: 390');
    expect(browserGate).toContain('width: 768');
    expect(browserGate).toContain('width: 1440');
    expect(browserGate).toContain('document horizontal overflow');
    expect(browserGate).toContain('clipped horizontally');
    expect(browserGate).toContain('audited siblings overlap');
    expect(browserGate).toContain('low contrast');
    expect(browserGate).toContain('theme switching updates page and surface colors without a reload');
  });

  it('crawls public route classes and requires computed global navigation to stay usable', () => {
    for (const term of [
      'bilingualStaticPaths',
      'zhOnlyStaticPaths',
      'toEnglishPath',
      'dynamicTemplateRoutes',
      '[data-site-header]',
      "theme: 'light'",
      "theme: 'dark'",
      'width: 390',
      'width: 768',
      'width: 1440',
      '.desktop-nav',
      '[data-menu-toggle]',
      'global site header must be visible after computed CSS',
      '/__header-gate-404__/',
    ]) {
      expect(headerVisibilityGate).toContain(term);
    }
    expect(headerVisibilityGate).toContain("testInfo.project.name === 'chromium'");
    expect(headerVisibilityGate).toContain('public route must render successfully');
    expect(headerVisibilityGate).toContain('public static route registry unexpectedly shrank');
  });

  it('locks research connector geometry to live DOM anchors across the visual matrix', () => {
    for (const term of ['width: 390', 'width: 768', 'width: 1440', "theme: 'light'", "theme: 'dark'", 'connector start drift', 'connector end drift', 'startError > 5', 'endError > 5']) {
      expect(researchGeometryGate).toContain(term);
    }
    expect(geometryPolicy).toContain('connector endpoint error must be <= 5px');
    expect(geometryPolicy).toContain('audited sibling nodes do not overlap by more than 2px');
  });

  it('keeps shared visual primitives opted into browser auditing', () => {
    for (const component of [visualRoute, layerMap, evidenceLadder]) {
      expect(component).toContain('data-ui-audit="contrast layout"');
      expect(component).toContain('data-ui-audit-item');
    }
  });

  it('records the owner-first-discovery anti-pattern and exact commands', () => {
    expect(policy).toContain('the owner became the first real visual tester');
    expect(policy).toContain('npm run test:ui');
    expect(policy).toContain('npm run test:ui:all');
    expect(policy).toContain('light → dark → light');
    expect(policy).toContain('390 × 844');
  });
});
