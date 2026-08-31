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
  { name: 'mobile', width: 390, height: 844 },
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
      if (viewport.width <= 900) await expect(labels).toBeHidden();
      else await expect(labels).toBeVisible();
    });
  }
}
