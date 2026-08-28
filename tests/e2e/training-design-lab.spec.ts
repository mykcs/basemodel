import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/research/seed-openevo/study/',
  '/research/seed-openevo/study/design/',
  '/en/research/seed-openevo/study/',
  '/en/research/seed-openevo/study/design/',
] as const;

const hostedRouteFilter = new Set(
  (process.env.VERCEL_CHANGED_ROUTES ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean),
);
const routeInScope = (path: string) => hostedRouteFilter.size === 0 || hostedRouteFilter.has(path);

async function noPageOverflow(page: Page) {
  return page.evaluate(() => ({
    viewport: window.innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
}

for (const route of routes) {
  test(`training design lab is readable and operable on ${route}`, async ({ page }) => {
    test.skip(!routeInScope(route), 'outside hosted focused route scope');

    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const root = page.locator('[data-training-decision-lab]');
      await expect(root).toBeVisible();
      await expect(root.locator('h1')).toContainText(/WebShop/);
      await expect(root.locator('#responsibility')).toBeVisible();
      await expect(root.locator('#parameters')).toBeVisible();
      await expect(root.locator('#teachers')).toBeVisible();
      await expect(root.locator('#decision')).toBeVisible();

      const tabs = root.locator('[data-claim]');
      await expect(tabs).toHaveCount(5);
      const teacherTab = root.locator('[data-claim="teacher"]');
      await teacherTab.click();
      await expect(teacherTab).toHaveAttribute('aria-selected', 'true');
      await expect(root.locator('[data-claim-panel="teacher"]')).toBeVisible();
      await expect(root.locator('[data-claim-panel="system"]')).toBeHidden();

      const firstTrack = root.locator('.track').first();
      await firstTrack.locator('summary').click();
      await expect(firstTrack).toHaveAttribute('open', '');
      await expect(firstTrack.locator('dl')).toBeVisible();

      const dimensions = await noPageOverflow(page);
      expect(dimensions.html).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}

test('training design lab remains legible in dark theme and reduced motion', async ({ page }) => {
  const route = '/research/seed-openevo/study/';
  test.skip(!routeInScope(route), 'outside hosted focused route scope');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

  const root = page.locator('[data-training-decision-lab]');
  await expect(root).toBeVisible();
  await expect(root.locator('.flow-pulse')).toHaveCSS('display', 'none');

  const colors = await root.evaluate((node) => {
    const style = getComputedStyle(node);
    return { color: style.color, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(colors.color).not.toBe('rgb(24, 32, 31)');
  expect(colors.background).not.toBe('rgb(247, 243, 235)');
});

test('first visit defaults to light even when the operating system prefers dark', async ({ page }) => {
  const route = '/research/seed-openevo/study/';
  test.skip(!routeInScope(route), 'outside hosted focused route scope');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');

  await page.evaluate(() => localStorage.setItem('atlas-theme', 'dark'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
});
