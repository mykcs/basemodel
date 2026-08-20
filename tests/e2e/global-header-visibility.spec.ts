import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

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

async function readSitemapRoutes(request: APIRequestContext) {
  const response = await request.get('/sitemap.xml');
  expect(response.ok(), 'local preview must expose sitemap.xml for the global header crawl').toBeTruthy();

  const xml = await response.text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => {
      const url = new URL(match[1]);
      return `${url.pathname}${url.search}`;
    });

  const uniqueRoutes = [...new Set(routes)];
  expect(uniqueRoutes.length, 'sitemap route crawl unexpectedly found too few public pages').toBeGreaterThan(20);
  return uniqueRoutes;
}

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
  const header = page.locator('[data-site-header]');
  await expect(header, `${context}: exactly one global site header must exist`).toHaveCount(1);
  await expect(header, `${context}: global site header must be visible after computed CSS`).toBeVisible();

  const metrics = await header.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity),
      width: rect.width,
      height: rect.height,
    };
  });

  expect(metrics.display, `${context}: header display`).not.toBe('none');
  expect(metrics.visibility, `${context}: header visibility`).not.toBe('hidden');
  expect(metrics.opacity, `${context}: header opacity`).toBeGreaterThan(0);
  expect(metrics.height, `${context}: header must not collapse`).toBeGreaterThan(40);
  expect(metrics.width, `${context}: header must span the usable viewport`).toBeGreaterThan(state.viewport.width * 0.9);

  await expect(
    page.locator('[data-site-header] .brand'),
    `${context}: brand/home escape hatch must remain visible`,
  ).toBeVisible();

  if (state.viewport.width >= 1080) {
    await expect(
      page.locator('[data-site-header] .desktop-nav'),
      `${context}: desktop navigation must be visible`,
    ).toBeVisible();
  } else {
    await expect(
      page.locator('[data-site-header] [data-menu-toggle]'),
      `${context}: responsive navigation control must be visible`,
    ).toBeVisible();
  }
}

test('global navigation survives computed CSS on every public route', async ({ page, request }, testInfo) => {
  test.setTimeout(testInfo.project.name === 'chromium' ? 300_000 : 150_000);
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));

  const sitemapRoutes = await readSitemapRoutes(request);
  const routePaths = testInfo.project.name === 'chromium'
    ? sitemapRoutes
    : [...webkitRepresentativeRoutes];

  for (const path of routePaths) {
    await test.step(path, async () => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${path}: sitemap route must render successfully`).toBe(200);

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
