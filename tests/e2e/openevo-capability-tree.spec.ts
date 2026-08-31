import { expect, test } from '@playwright/test';

const routes = [
  '/research/seed-openevo/study/capability-exploration/',
  '/en/research/seed-openevo/study/capability-exploration/',
] as const;

for (const path of routes) {
  test(`${path} exposes the Stage-1 to Stage-2 experiment tree`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    const tree = page.getByTestId('openevo-capability-experiment-tree');
    await expect(tree).toBeVisible();
    await expect(tree).toContainText('OpenEVO-Ceiling-1.0');
    await expect(tree).toContainText('OpenEVO 2.0');
    await expect(tree).toContainText('Harness 2.0');
    await expect(tree.locator('a[href*="stage2-256-window"]')).toHaveCount(1);
    await expect(tree.locator('a[href*="stage2-ceiling"]')).toHaveCount(2);
    await expect(tree.locator('a[href*="harness-2-0"]')).toHaveCount(1);
  });
}

for (const viewport of [
  { name: 'iphone-375', width: 375, height: 812 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-402', width: 402, height: 874 },
  { name: 'iphone-430', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name}-${theme} keeps the experiment tree readable`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
      const tree = page.getByTestId('openevo-capability-experiment-tree');
      await expect(tree).toBeVisible();
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      const labels = tree.locator('.exp-tree__stage-labels');
      if (viewport.width <= 900) {
        await expect(labels).toBeHidden();
        const mobileRoutes = tree.locator('.mobile-route');
        await expect(mobileRoutes).toHaveCount(4);
        await expect(mobileRoutes.first()).toBeVisible();
        const cardMetrics = await tree.locator('.node').first().evaluate((el) => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return { width: rect.width, minHeight: rect.height, fontSize: parseFloat(style.fontSize) };
        });
        expect(cardMetrics.width).toBeGreaterThan(viewport.width * 0.78);
        expect(cardMetrics.minHeight).toBeGreaterThanOrEqual(44);
      } else {
        await expect(labels).toBeVisible();
        await expect(tree.locator('.mobile-route').first()).toBeHidden();
      }
    });
  }
}
