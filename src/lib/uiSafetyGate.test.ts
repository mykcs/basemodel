import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const packageJson = JSON.parse(read('../../package.json')) as {
  scripts?: Record<string, string>;
};
const playwrightConfig = read('../../playwright.config.ts');
const browserGate = read('../../tests/e2e/ui-safety.spec.ts');
const headerVisibilityGate = read('../../tests/e2e/global-header-visibility.spec.ts');
const headerBreakpointGate = read('../../tests/e2e/global-header-breakpoints.spec.ts');
const researchGeometryGate = read('../../tests/e2e/research-explainer-layout.spec.ts');
const policy = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const geometryPolicy = read('../../docs/agents/current/research-explainer-geometry-acceptance.md');
const appLayout = read('../layouts/AppLayout.astro');
const header = read('../components/Header.astro');
const visualCloseout = read('../styles/visual-closeout.css');
const visualRoute = read('../components/visual/VisualRoute.astro');
const layerMap = read('../components/visual/LayerMap.astro');
const evidenceLadder = read('../components/visual/EvidenceLadder.astro');

describe('UI visual acceptance gate contract', () => {
  it('keeps the general, global-header, breakpoint-handoff, and research-geometry browser commands wired', () => {
    for (const script of ['test:header', 'test:header:all'] as const) {
      expect(packageJson.scripts?.[script]).toContain('global-header-visibility.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('global-header-breakpoints.spec.ts');
    }
    expect(packageJson.scripts?.['test:header']).toContain('--project=chromium');
    for (const script of ['test:ui', 'test:ui:all'] as const) {
      expect(packageJson.scripts?.[script]).toContain('global-header-visibility.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('global-header-breakpoints.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('ui-safety.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('research-explainer-layout.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('--max-failures=1');
    }
    expect(packageJson.scripts?.['test:ui']).toContain('--project=chromium');
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

  it('crawls public route classes and requires the computed global shell to stay usable', () => {
    for (const term of [
      'bilingualStaticPaths',
      'zhOnlyStaticPaths',
      'toEnglishPath',
      'dynamicTemplateRoutes',
      '[data-site-header]',
      '#main-content.site-main',
      "theme: 'light'",
      "theme: 'dark'",
      'width: 390',
      'width: 768',
      'width: 1440',
      '.desktop-nav',
      '[data-menu-toggle]',
      'global site header must be visible after computed CSS',
      'document horizontal overflow on public route',
      'body overflow-x must not mask layout failures',
      'main content shell must not collapse',
      'responsive navigation controls remain operable instead of merely visible',
      'mobile navigation sections must stack vertically rather than squeeze side-by-side',
      '/__header-gate-404__/',
    ]) {
      expect(headerVisibilityGate).toContain(term);
    }
    expect(headerVisibilityGate).toContain("testInfo.project.name === 'chromium'");
    expect(headerVisibilityGate).toContain('public route must render successfully');
    expect(headerVisibilityGate).toContain('public static route registry unexpectedly shrank');
  });

  it('covers the 820/960 responsive navigation handoff without a dead zone', () => {
    for (const term of [
      "width: 820",
      "width: 821",
      "width: 900",
      "width: 960",
      "width: 961",
      "mode: 'mobile'",
      "mode: 'desktop'",
      'responsive header breakpoint handoff has no navigation dead zone',
      'responsive header handoff must not create horizontal overflow',
    ]) {
      expect(headerBreakpointGate).toContain(term);
    }
    expect(visualCloseout).toContain('@media (max-width: 960px)');
    expect(visualCloseout).toContain('body .site-header .menu-toggle');
    expect(visualCloseout).toContain('body .site-header .mobile-menu.is-open');
  });

  it('keeps root overflow observable and the refactored mobile menu vertically composed', () => {
    expect(visualCloseout).toContain('overflow-x: visible');
    expect(visualCloseout).toContain('Root overflow must stay observable');
    expect(visualCloseout).toContain('The current Header owns a sectioned mobile navigation');
    expect(visualCloseout).toContain('body .site-header .mobile-menu .mobile-menu__inner');
    expect(visualCloseout).toContain('grid-template-columns: none');
    const hardeningImport = appLayout.indexOf("import '../styles/final-hardening.css';");
    const closeoutImport = appLayout.indexOf("import '../styles/visual-closeout.css';");
    expect(hardeningImport).toBeGreaterThan(-1);
    expect(closeoutImport).toBeGreaterThan(hardeningImport);
  });

  it('keeps the two-path header copy accurate and restores focus when More closes', () => {
    expect(header).toContain("t('两条研究主线', 'Two primary research paths')");
    expect(header).not.toContain('你可以做的三件事');
    expect(header).not.toContain('Three things you can do');
    expect(header).toContain('const focusWasInside = resourceMenu.contains(document.activeElement)');
    expect(header).toContain("resourceMenu.querySelector<HTMLElement>('summary')?.focus()");
    expect(headerVisibilityGate).toContain('await expect(resourceSummary).toBeFocused()');
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
