import { expect, test } from '@playwright/test';

const routes = [
  '/research/seed-openevo/study/capability-exploration/openevo-2-0/',
  '/en/research/seed-openevo/study/capability-exploration/openevo-2-0/',
] as const;

for (const path of routes) {
  test(`${path} presents the OpenEVO 2.0 lineage without claiming a premature stop`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const root = page.getByTestId('openevo-2-strategy');
    await expect(root).toBeVisible();
    await expect(root.getByRole('heading', { name: 'OpenEVO 2.0', exact: true })).toBeVisible();
    await expect(page.getByTestId('stage2-strategy-selector')).toBeVisible();
    await expect(root).toContainText('Context Governor');
    await expect(root).toContainText('Telemetry v2');
    await expect(root).not.toContainText('Ceiling-1.0 已暂停');
  });
}
for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 1000 },
  ] as const) {
    test(`${viewport.name}-${theme} keeps OpenEVO 2.0 readable and overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routes[0], { waitUntil: 'domcontentloaded' });

      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        rootOverflowX: getComputedStyle(document.documentElement).overflowX,
      }));
      expect(geometry.bodyOverflowX).not.toBe('hidden');
      expect(geometry.rootOverflowX).not.toBe('hidden');
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);

      const details = page.locator('.evo2__artifacts');
      await expect(details).toBeVisible();
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
    });
  }
}
