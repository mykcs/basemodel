import { expect, test } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [...new Set(
  (process.env.VERCEL_CHANGED_ROUTES ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean),
)];

const matrices = [
  { name: 'mobile-light', theme: 'light' as Theme, viewport: { width: 390, height: 844 } },
  { name: 'mobile-dark', theme: 'dark' as Theme, viewport: { width: 390, height: 844 } },
  { name: 'desktop-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { name: 'desktop-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
] as const;

if (routes.length === 0) {
  test('requires at least one exact changed route', () => {
    expect(routes, 'VERCEL_CHANGED_ROUTES must be provided by scripts/vercel-ui-gate.mjs').not.toEqual([]);
  });
} else {
  for (const route of routes) {
    for (const matrix of matrices) {
      test(`${matrix.name} keeps changed route ${route} deployable and contained`, async ({ page }) => {
        await page.setViewportSize(matrix.viewport);
        await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

        const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(response, `${route} should return an HTTP response`).not.toBeNull();
        expect(response!.ok(), `${route} should return a successful HTTP status`).toBe(true);

        await page.evaluate(async () => {
          if ('fonts' in document) await document.fonts.ready;
        });

        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('main h1').first()).toBeVisible();

        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description?.trim().length ?? 0, `${route} should keep a non-empty description`).toBeGreaterThan(0);

        const geometry = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(
          geometry.document,
          `${matrix.name} ${route} document width ${geometry.document}px should fit ${geometry.viewport}px viewport`,
        ).toBeLessThanOrEqual(geometry.viewport + 2);
        expect(
          geometry.body,
          `${matrix.name} ${route} body width ${geometry.body}px should fit ${geometry.viewport}px viewport`,
        ).toBeLessThanOrEqual(geometry.viewport + 2);
      });
    }
  }
}
