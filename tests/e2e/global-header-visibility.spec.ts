import { expect, test, type Page } from '@playwright/test';
import {
  bilingualStaticPaths,
  toEnglishPath,
  zhOnlyStaticPaths,
} from '../../src/lib/sitemapRoutes';

type Theme = 'light' | 'dark';

type HeaderState = {
  name: string;
  theme: Theme;
  viewport: { width: number; height: number };
};

const headerStates: HeaderState[] = [
  { name: 'mobile-light', theme: 'light', viewport: { width: 390, height: 844 } },
  { name: 'mobile-dark', theme: 'dark', viewport: { width: 390, height: 844 } },
  { name: 'tablet-light', theme: 'light', viewport: { width: 768, height: 1024 } },
  { name: 'tablet-dark', theme: 'dark', viewport: { width: 768, height: 1024 } },
  { name: 'desktop-light', theme: 'light', viewport: { width: 1440, height: 1000 } },
  { name: 'desktop-dark', theme: 'dark', viewport: { width: 1440, height: 1000 } },
];

const staticPublicRoutes = [...new Set([
  ...bilingualStaticPaths,
  ...zhOnlyStaticPaths,
  ...bilingualStaticPaths.map((path) => toEnglishPath(path)),
])];

// Model and paper detail pages are generated from one template per locale, so
// one real detail route per template class covers their page-owned CSS while
// the complete static route registry covers every standalone public page.
const dynamicTemplateRoutes = [
  '/models/qwen2-5-3b-instruct/',
  '/en/models/qwen2-5-3b-instruct/',
  '/papers/seed/',
  '/en/papers/seed/',
] as const;

const chromiumRoutePaths = [...new Set([
  ...staticPublicRoutes,
  ...dynamicTemplateRoutes,
])];

const webkitRepresentativeRoutes = [
  '/',
  '/guide/',
  '/models/qwen2-5-3b-instruct/',
  '/papers/seed/',
  '/workspace/',
  '/research/seed-openevo/flow/',
  '/research/seed-openevo/study/',
  '/research/seed-openevo/study/results/',
  '/en/',
  '/en/research/seed-openevo/study/results/',
] as const;

const fallbackRoute = '/__header-gate-404__/';

async function settleLayout(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  }));
}

async function assertGlobalHeader(page: Page, path: string, state: HeaderState) {
  await page.setViewportSize(state.viewport);
  await page.evaluate((theme: Theme) => {
    document.documentElement.dataset.theme = theme;
  }, state.theme);
  await settleLayout(page);

  const context = `${path} / ${state.name}`;
  const snapshot = await page.evaluate(({ desktop }) => {
    const visible = (element: Element | null) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && rect.width > 0.5
        && rect.height > 0.5;
    };

    const headers = [...document.querySelectorAll('[data-site-header]')];
    const header = headers[0] ?? null;
    const main = document.querySelector('#main-content.site-main');
    const root = document.documentElement;
    const bodyStyle = getComputedStyle(document.body);
    const rootStyle = getComputedStyle(root);
    const mainRect = main?.getBoundingClientRect() ?? null;

    if (!header) {
      return {
        count: 0,
        headerVisible: false,
        display: 'missing',
        visibility: 'missing',
        opacity: 0,
        width: 0,
        height: 0,
        brandVisible: false,
        navigationVisible: false,
        rootScrollWidth: root.scrollWidth,
        rootClientWidth: root.clientWidth,
        bodyOverflowX: bodyStyle.overflowX,
        rootOverflowX: rootStyle.overflowX,
        mainVisible: visible(main),
        mainWidth: mainRect?.width ?? 0,
        mainLeft: mainRect?.left ?? 0,
        mainRight: mainRect?.right ?? 0,
      };
    }

    const style = getComputedStyle(header);
    const rect = header.getBoundingClientRect();
    return {
      count: headers.length,
      headerVisible: visible(header),
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity),
      width: rect.width,
      height: rect.height,
      brandVisible: visible(header.querySelector('.brand')),
      navigationVisible: visible(header.querySelector(desktop ? '.desktop-nav' : '[data-menu-toggle]')),
      rootScrollWidth: root.scrollWidth,
      rootClientWidth: root.clientWidth,
      bodyOverflowX: bodyStyle.overflowX,
      rootOverflowX: rootStyle.overflowX,
      mainVisible: visible(main),
      mainWidth: mainRect?.width ?? 0,
      mainLeft: mainRect?.left ?? 0,
      mainRight: mainRect?.right ?? 0,
    };
  }, { desktop: state.viewport.width >= 1080 });

  expect(snapshot.count, `${context}: exactly one global site header must exist`).toBe(1);
  expect(snapshot.headerVisible, `${context}: global site header must be visible after computed CSS`).toBe(true);
  expect(snapshot.display, `${context}: header display`).not.toBe('none');
  expect(snapshot.visibility, `${context}: header visibility`).not.toBe('hidden');
  expect(snapshot.opacity, `${context}: header opacity`).toBeGreaterThan(0);
  expect(snapshot.height, `${context}: header must not collapse`).toBeGreaterThan(40);
  expect(snapshot.width, `${context}: header must span the usable viewport`).toBeGreaterThan(state.viewport.width * 0.9);
  expect(snapshot.brandVisible, `${context}: brand/home escape hatch must remain visible`).toBe(true);
  expect(
    snapshot.navigationVisible,
    state.viewport.width >= 1080
      ? `${context}: desktop navigation must be visible`
      : `${context}: responsive navigation control must be visible`,
  ).toBe(true);

  expect(snapshot.bodyOverflowX, `${context}: body overflow-x must not mask layout failures`).not.toBe('hidden');
  expect(snapshot.bodyOverflowX, `${context}: body overflow-x must not mask layout failures`).not.toBe('clip');
  expect(snapshot.rootOverflowX, `${context}: html overflow-x must not mask layout failures`).not.toBe('hidden');
  expect(snapshot.rootOverflowX, `${context}: html overflow-x must not mask layout failures`).not.toBe('clip');
  expect(
    snapshot.rootScrollWidth,
    `${context}: document horizontal overflow on public route (${snapshot.rootScrollWidth}px > ${snapshot.rootClientWidth}px)`,
  ).toBeLessThanOrEqual(snapshot.rootClientWidth + 2);

  expect(snapshot.mainVisible, `${context}: main content must remain visible`).toBe(true);
  expect(snapshot.mainWidth, `${context}: main content shell must not collapse`).toBeGreaterThan(state.viewport.width * 0.9);
  expect(snapshot.mainLeft, `${context}: main content must not escape left viewport edge`).toBeGreaterThanOrEqual(-2);
  expect(snapshot.mainRight, `${context}: main content must not escape right viewport edge`).toBeLessThanOrEqual(state.viewport.width + 2);
}

const globalHeaderRouteShardCount = 4;

for (let shardIndex = 0; shardIndex < globalHeaderRouteShardCount; shardIndex += 1) {
  test(`global shell and navigation survive computed CSS across every public route class [shard ${shardIndex + 1}/${globalHeaderRouteShardCount}]`, async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));

    expect(staticPublicRoutes.length, 'public static route registry unexpectedly shrank').toBeGreaterThan(40);
    const allRoutePaths = testInfo.project.name === 'chromium'
      ? chromiumRoutePaths
      : [...webkitRepresentativeRoutes];
    const routePaths = allRoutePaths.filter((_, index) => index % globalHeaderRouteShardCount === shardIndex);

    // Keep the existing per-route budget. Sharding changes scheduling granularity
    // only: every route is still visited exactly once and every geometry/theme
    // assertion remains unchanged.
    const perRouteBudgetMs = 4_000;
    test.setTimeout(Math.max(120_000, routePaths.length * perRouteBudgetMs));
    expect(routePaths.length, `header route shard ${shardIndex + 1} unexpectedly empty`).toBeGreaterThan(0);

    for (const path of routePaths) {
      await test.step(path, async () => {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), `${path}: public route must render successfully`).toBe(200);

        // One navigation per route is enough: theme attributes and media queries are
        // switched live so the same page is checked at 390 / 768 / 1440 and light / dark.
        for (const state of headerStates) {
          await assertGlobalHeader(page, path, state);
        }
      });
    }
  });
}

test('responsive navigation controls remain operable instead of merely visible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });

  const toggle = page.locator('[data-menu-toggle]');
  const mobileMenu = page.locator('[data-mobile-menu]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
  await expect(mobileMenu).toBeVisible();
  await expect(mobileMenu.locator('.mobile-journeys a').first()).toBeVisible();
  await expect(mobileMenu.locator('.lang-switch')).toHaveAttribute('href', '/en/research/seed-openevo/study/results/');

  const mobileGeometry = await mobileMenu.locator('.mobile-menu__inner').evaluate((inner) => {
    const sections = [...inner.querySelectorAll<HTMLElement>('.mobile-menu__section')];
    const controls = inner.querySelector<HTMLElement>('.mobile-menu__controls');
    const innerRect = inner.getBoundingClientRect();
    const sectionRects = sections.map((section) => section.getBoundingClientRect());
    const controlsRect = controls?.getBoundingClientRect() ?? null;
    return {
      display: getComputedStyle(inner).display,
      innerWidth: innerRect.width,
      sectionRects: sectionRects.map((rect) => ({
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
      })),
      controlsRect: controlsRect ? {
        top: controlsRect.top,
        bottom: controlsRect.bottom,
        width: controlsRect.width,
      } : null,
    };
  });
  expect(mobileGeometry.display, 'phone navigation shell must not reuse the legacy two-column tile grid').not.toBe('grid');
  expect(mobileGeometry.sectionRects.length).toBeGreaterThanOrEqual(2);
  for (const section of mobileGeometry.sectionRects) {
    expect(section.width, 'each mobile navigation section should use the full menu reading width').toBeGreaterThan(mobileGeometry.innerWidth * 0.9);
  }
  expect(
    mobileGeometry.sectionRects[1]!.top,
    'mobile navigation sections must stack vertically rather than squeeze side-by-side',
  ).toBeGreaterThanOrEqual(mobileGeometry.sectionRects[0]!.bottom - 1);
  expect(mobileGeometry.controlsRect, 'mobile navigation controls must exist').not.toBeNull();
  if (mobileGeometry.controlsRect) {
    expect(mobileGeometry.controlsRect.width).toBeGreaterThan(mobileGeometry.innerWidth * 0.9);
    expect(mobileGeometry.controlsRect.top).toBeGreaterThanOrEqual(mobileGeometry.sectionRects.at(-1)!.bottom - 1);
  }

  await mobileMenu.locator('[data-theme-toggle-mobile]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  await expect(toggle).toBeFocused();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  const resourceMenu = page.locator('[data-resource-menu]');
  const resourceSummary = resourceMenu.locator('summary');
  await resourceSummary.click();
  await expect(resourceMenu).toHaveAttribute('open', '');
  await expect(resourceMenu.locator('.resource-menu__panel')).toBeVisible();
  const firstResourceLink = resourceMenu.locator('.resource-menu__links a').first();
  await firstResourceLink.focus();
  await expect(firstResourceLink).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(resourceMenu).not.toHaveAttribute('open', '');
  await expect(resourceSummary).toBeFocused();
});

test('404 fallback keeps a usable global navigation escape hatch', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
  const response = await page.goto(fallbackRoute, { waitUntil: 'domcontentloaded' });
  expect(response?.status(), 'deliberate missing route should resolve through the 404 page').toBe(404);

  for (const state of headerStates) {
    await assertGlobalHeader(page, fallbackRoute, state);
  }
});
