import { expect, test } from '@playwright/test';

test('active pages advertise only Chinese while English source is archived', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/results/');
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"en\"]')).toHaveCount(0);
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"zh-CN\"]')).toHaveCount(1);
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"x-default\"]')).toHaveCount(1);
  await expect(page.locator('.nav-inner > .lang-switch')).toHaveCount(0);
  await expect(page.locator('#mobile-menu .lang-switch')).toHaveCount(0);
});
