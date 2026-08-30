import { expect, test } from '@playwright/test';

test.describe('static-first core research pages', () => {
  test.use({ javaScriptEnabled: false });

  test('model catalog remains readable without JavaScript', async ({ page }) => {
    await page.goto('/models/');
    await expect(page.getByRole('main')).toBeVisible();
    const catalog = page.locator('[data-model-static-fallback]');
    await expect(catalog.getByRole('heading', { level: 2 })).toBeVisible();
    const modelLinks = catalog.getByRole('link');
    expect(await modelLinks.count()).toBeGreaterThan(0);
    await expect(modelLinks.first()).toHaveAttribute('href', /\/models\/[^/]+\//);
  });

  test('paper catalog and matrix remain readable without JavaScript', async ({ page }) => {
    await page.goto('/papers/');
    await expect(page.getByRole('main')).toBeVisible();
    expect(await page.getByRole('article').count()).toBeGreaterThan(0);
    const disclosure = page.getByRole('button', { name: /矩阵|matrix/i }).first();
    if (await disclosure.count()) await disclosure.click();
    await expect(page.getByRole('table').first()).toBeVisible();
  });

  test('comparison picker remains readable without JavaScript', async ({ page }) => {
    await page.goto('/compare/');
    await expect(page.getByRole('main')).toBeVisible();
    expect(await page.getByRole('checkbox').count()).toBeGreaterThan(0);
  });
});
