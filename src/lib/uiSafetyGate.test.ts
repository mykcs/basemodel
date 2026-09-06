import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const packageJson = JSON.parse(read('../../package.json')) as {
  scripts?: Record<string, string>;
};
const playwrightConfig = read('../../playwright.config.ts');
const vercelUiGate = read('../../scripts/vercel-ui-gate.mjs');
const ciUiGate = read('../../scripts/ci-ui-gate.mjs');
const browserGate = read('../../tests/e2e/ui-safety.spec.ts');
const canonicalFigureGate = read('../../tests/e2e/canonical-research-figures.spec.ts');
const webShopThemeGate = read('../../tests/e2e/webshop-training-theme.spec.ts');
const headerVisibilityGate = read('../../tests/e2e/global-header-visibility.spec.ts');
const headerBreakpointGate = read('../../tests/e2e/global-header-breakpoints.spec.ts');
const researchGeometryGate = read('../../tests/e2e/research-explainer-layout.spec.ts');
const floatingTransportGate = read('../../tests/e2e/floating-step-transport.spec.ts');
const policy = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const geometryPolicy = read('../../docs/agents/current/research-explainer-geometry-acceptance.md');
const appLayout = read('../layouts/AppLayout.astro');
const appStyles = read('../styles/app.css');
const researchReadabilityStyles = read('../styles/research-figure-readability.css');
const interactiveResearchStyles = read('../styles/interactive-research-explainer.css');
const header = read('../components/Header.astro');
const headerStyles = read('../styles/components/header.css');
const visualCloseout = read('../styles/visual-closeout.css');
const visualRoute = read('../components/visual/VisualRoute.astro');
const layerMap = read('../components/visual/LayerMap.astro');
const evidenceLadder = read('../components/visual/EvidenceLadder.astro');

describe('UI visual acceptance gate contract', () => {
  it('keeps the general, canonical-figure, global-header, breakpoint-handoff, research-geometry, floating-transport, and WebShop-theme browser commands wired', () => {
    for (const script of ['test:header', 'test:header:all'] as const) {
      expect(packageJson.scripts?.[script]).toContain('global-header-visibility.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('global-header-breakpoints.spec.ts');
    }
    expect(packageJson.scripts?.['test:header']).toContain('--project=chromium');
    for (const script of ['test:ui', 'test:ui:all'] as const) {
      expect(packageJson.scripts?.[script]).toContain('global-header-visibility.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('global-header-breakpoints.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('ui-safety.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('canonical-research-figures.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('research-explainer-layout.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('floating-step-transport.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('webshop-training-theme.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('compare-tray-on-demand.spec.ts');
      expect(packageJson.scripts?.[script]).toContain('--max-failures=1');
    }
    expect(packageJson.scripts?.['test:ui']).toContain('--project=chromium');
    expect(packageJson.scripts?.['test:ui:all']).not.toContain('--project=chromium');
  });

  it('keeps the Vercel hosted browser gate Chromium-only and covers ordinary, semantic-release, and UI fix branch families', () => {
    expect(vercelUiGate).toContain('agent\\/semantic-release-(?:visual-closeout|css|ui|layout|theme|responsive|nav|navigation)-');
    expect(vercelUiGate).toContain('fix\\/.*(?:visual|css|ui|layout|theme|responsive|nav|navigation)');
    expect(vercelUiGate).toContain("process.env.PLAYWRIGHT_BROWSERS_PATH = '0'");
    expect(vercelUiGate).toContain("run('npx', ['playwright', 'install', '--only-shell', 'chromium'])");
    expect(vercelUiGate).not.toContain("['playwright', 'install', 'webkit']");
    expect(vercelUiGate).not.toContain('--project=webkit');
    expect(policy).toContain('repository-owned Vercel browser gate is **Chromium-only**');
    expect(policy).toContain('Playwright-supported macOS, Ubuntu, or Debian runner');
    expect(policy).toContain('cascade-preserving CSS composition refactor');
  });

  it('retains first-failure evidence while deferring CircleCI video cost', () => {
    expect(playwrightConfig).toContain("trace: 'retain-on-failure'");
    expect(playwrightConfig).toContain("screenshot: 'only-on-failure'");
    expect(playwrightConfig).toContain("video: diagnosticVideo ? 'on' : deferFailureVideo ? 'off' : 'retain-on-failure'");
    expect(playwrightConfig).toContain("process.env.PLAYWRIGHT_DEFER_FAILURE_VIDEO === '1'");
    expect(playwrightConfig).toContain("process.env.PLAYWRIGHT_DIAGNOSTIC_VIDEO === '1'");
    expect(ciUiGate).toContain('original failure remains authoritative');
    expect(ciUiGate).toContain("'--last-failed'");
    expect(ciUiGate).toContain("'--output', diagnosticOutputDir");
    expect(ciUiGate).toContain('ci-diagnostic-results');
    expect(policy).toContain('it can never convert the original red acceptance result to green');
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

  it('keeps all legacy WebShop primer routes under exact computed-theme browser regression', () => {
    for (const route of [
      '/research/seed-openevo/study/results/webshop-training/',
      '/research/seed-openevo/study/results/seed-training/',
      '/research/seed-openevo/study/results/openevo-training/',
    ]) {
      expect(webShopThemeGate).toContain(route);
    }
    for (const term of [
      "['light', 'dark']",
      "name: 'desktop'",
      "name: 'mobile'",
      '.moved-primer',
      'articleSurface',
      'articleBorder',
      "locator('[data-theme-toggle]').first().click()",
      'migration page updates its reading surface when theme toggles without reload',
    ]) {
      expect(webShopThemeGate).toContain(term);
    }
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

  it('covers the actual 1080px responsive navigation handoff without a dead zone', () => {
    for (const term of [
      'width: 820',
      'width: 821',
      'width: 900',
      'width: 960',
      'width: 961',
      'width: 1080',
      'width: 1081',
      "mode: 'mobile'",
      "mode: 'desktop'",
      'responsive header breakpoint handoff has no navigation dead zone',
      'responsive header handoff must not create horizontal overflow',
    ]) {
      expect(headerBreakpointGate).toContain(term);
    }
    expect(headerStyles).toContain('@media (max-width: 1080px)');
    expect(headerStyles).toContain('.site-header .mission-nav');
    expect(headerStyles).toContain('.site-header .menu-toggle');
    expect(headerStyles).toContain('.site-header .mobile-menu.is-open');
  });

  it('keeps root overflow observable while the canonical Header owner composes the mobile menu', () => {
    expect(visualCloseout).toContain('overflow-x: visible');
    expect(visualCloseout).toContain('Root overflow must stay observable');
    expect(visualCloseout).not.toContain('.site-header');
    expect(headerStyles).toContain('.site-header .mobile-menu .mobile-menu__inner');
    expect(headerStyles).toContain('grid-template-columns: none');
    expect(appLayout).toContain("import '../styles/app.css';");
    const closeoutImport = appStyles.indexOf("@import './visual-closeout.css';");
    const shellOwnerImport = appStyles.indexOf("@import './components/global-shell.css';");
    const headerOwnerImport = appStyles.indexOf("@import './components/header.css';");
    expect(closeoutImport).toBeGreaterThan(-1);
    expect(shellOwnerImport).toBeGreaterThan(closeoutImport);
    expect(headerOwnerImport).toBeGreaterThan(shellOwnerImport);
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
    for (const term of ['width: 390', 'width: 768', 'width: 1440', "theme: 'light'", "theme: 'dark'", 'connector start drift', 'connector end drift']) {
      expect(researchGeometryGate).toContain(term);
    }
    expect(geometryPolicy).toContain('connector endpoint error must be <= 5px');
    expect(geometryPolicy).toContain('audited sibling nodes do not overlap by more than 2px');
  });

  it('makes readable research prose and persistent floating control ownership hard release conditions', () => {
    for (const term of ['width: 390', 'width: 768', 'width: 1024', 'width: 1440', 'prose font too small', 'CJK prose is too narrow']) {
      expect(canonicalFigureGate).toContain(term);
    }
    for (const term of ['prose font too small', 'CJK prose is too narrow', "toHaveCSS('position', 'fixed')", 'bottom-docked from the initial render']) {
      expect(researchGeometryGate).toContain(term);
    }
    for (const term of [
      'every true step-by-step owner docks Previous / Next from initial render through interaction',
      "toHaveCSS('position', 'fixed')",
      'WebShop floating transport also stays inside a mobile viewport',
      'canonical-only comparison routes never expose a floating step transport',
      'SEED transport is bottom-docked before interaction',
    ]) {
      expect(floatingTransportGate).toContain(term);
    }
    expect(researchReadabilityStyles).toContain('.canonical-figure');
    expect(researchReadabilityStyles).toContain('font-size: max(.74rem, 11.8px) !important');
    expect(interactiveResearchStyles).toContain('position:fixed');
    expect(geometryPolicy).toContain('at least **7 CJK characters per rendered line**');
    expect(geometryPolicy).toContain('becomes a bottom `position: fixed` dock');
    expect(geometryPolicy).toContain('canonical-only');
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
