import { expect, test } from '@playwright/test';

test.describe('static-first core research pages', () => {
  test.use({ javaScriptEnabled: false });

  test('model catalog remains readable without JavaScript', async ({ page }) => {
    await page.goto('/models/');
    await expect(page.locator('.explorer-shell')).toBeVisible();
    await expect(page.locator('.model-grid')).toBeVisible();
    expect(await page.locator('.model-grid a[href*="/models/"]').count()).toBeGreaterThan(0);
  });

  test('paper catalog and matrix remain readable without JavaScript', async ({ page }) => {
    await page.goto('/papers/');
    await expect(page.locator('.paper-explorer')).toBeVisible();
    expect(await page.locator('.paper-case-card').count()).toBeGreaterThan(0);
    await expect(page.locator('.matrix-table')).toBeVisible();
  });

  test('comparison picker remains readable without JavaScript', async ({ page }) => {
    await page.goto('/compare/');
    await expect(page.locator('.comparison-picker')).toBeVisible();
    expect(await page.locator('.picker-item').count()).toBeGreaterThan(0);
  });
});
