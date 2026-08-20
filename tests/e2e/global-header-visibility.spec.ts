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
  '/research/seed-openevo/',
  '/research/seed-openevo/experiment/',
  '/research/seed-openevo/results/',
  '/en/',
  '/en/research/seed-openevo/results/',
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
}

test('global navigation survives computed CSS across every public route class', async ({ page }, testInfo) => {
  test.setTimeout(testInfo.project.name === 'chromium' ? 180_000 : 120_000);
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));

  expect(staticPublicRoutes.length, 'public static route registry unexpectedly shrank').toBeGreaterThan(40);
  const routePaths = testInfo.project.name === 'chromium'
    ? chromiumRoutePaths
    : [...webkitRepresentativeRoutes];

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

test('404 fallback keeps a usable global navigation escape hatch', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
  const response = await page.goto(fallbackRoute, { waitUntil: 'domcontentloaded' });
  expect(response?.status(), 'deliberate missing route should resolve through the 404 page').toBe(404);

  for (const state of headerStates) {
    await assertGlobalHeader(page, fallbackRoute, state);
  }
});
