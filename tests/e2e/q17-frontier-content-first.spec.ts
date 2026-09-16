import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/';

test('focus result keeps the comparable result and scientific boundary in the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 633 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('R128 比 R127 平均低 4.18 分');
  await expect(page.locator('.result-hero__facts > div')).toHaveCount(3);
  const lede = await page.locator('.result-hero .lede').boundingBox();
  const facts = await page.locator('.result-hero__facts').boundingBox();
  expect(lede).not.toBeNull();
  expect(facts).not.toBeNull();
  expect(lede!.y + lede!.height).toBeLessThanOrEqual(633);
  expect(facts!.y + facts!.height).toBeLessThanOrEqual(633 + 3);
  await expect(page.locator('.result-hero__boundary')).toContainText('95% 统计范围是 −17.13 ～ +8.00');
});

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme}: comparison stays readable without page overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('.table-wrap')).toBeVisible();
      await expect(page.locator('.table-wrap table tbody tr')).toHaveCount(6);
      await expect(page.locator('.evidence-links')).toContainText('数字摘要');
      await page.locator('.table-wrap').focus();
      await expect(page.locator('.table-wrap')).toBeFocused();
    });
  }
}
