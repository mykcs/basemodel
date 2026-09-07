import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/research/seed-openevo/flow/',
  '/en/research/seed-openevo/flow/',
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
  test(`training design is integrated into the flow map on ${route}`, async ({ page }) => {
    test.skip(!routeInScope(route), 'outside hosted focused route scope');

    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const root = page.locator('#training-design');
      await expect(root).toBeVisible();
      await expect(root.locator('h2')).toContainText(/训练设计|Training design/);
      await expect(root.locator('.responsibility-flow > li')).toHaveCount(6);
      await expect(page.locator('nav').getByRole('link', { name: /训练设计|Training design/ }).first()).toBeVisible();
      await expect(page.getByText('SEED × OPENEVO · WEBSHOP')).toHaveCount(0);
      await expect(page.getByText('先分清谁负责什么')).toHaveCount(0);

      const details = root.locator('details');
      await expect(details).toHaveCount(2);
      await details.first().locator('summary').click();
      await expect(details.first()).toHaveAttribute('open', '');

      const animationCount = await root.evaluate((node) => node.getAnimations({ subtree: true }).length);
      expect(animationCount).toBe(0);

      const dimensions = await noPageOverflow(page);
      expect(dimensions.html).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}

test('legacy training-design URLs redirect to the flow map section', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/design/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/research\/seed-openevo\/flow\/#training-design$/);

  await page.goto('/en/research/seed-openevo/study/design/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/en\/research\/seed-openevo\/flow\/#training-design$/);
});

test('training design stays legible in dark theme and reduced motion', async ({ page }) => {
  const route = '/research/seed-openevo/flow/';
  test.skip(!routeInScope(route), 'outside hosted focused route scope');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

  const root = page.locator('#training-design');
  await expect(root).toBeVisible();
  const ambientAnimations = await root.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => {
    const iterations = animation.effect?.getTiming().iterations;
    return animation.playState === 'running' && iterations === Infinity;
  }).length);
  expect(ambientAnimations).toBe(0);

  const colors = await root.evaluate((node) => {
    const style = getComputedStyle(node);
    return { color: style.color, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(colors.color).not.toBe('rgb(24, 32, 31)');
  expect(colors.background).not.toBe('rgb(247, 243, 235)');
});
