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


  test('workspace keeps a useful orientation and start link without JavaScript', async ({ page }) => {
    await page.goto('/workspace/');
    const fallback = page.locator('[data-workspace-static-fallback]');
    await expect(fallback.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(fallback.getByRole('link', { name: '开始填写实验条件' })).toHaveAttribute('href', '?v=2&mode=modern#workspace-interactive');
  });

  test('landscape keeps catalog counts and a readable static table without JavaScript', async ({ page }) => {
    await page.goto('/landscape/');
    await expect(page.locator('.landscape-overview')).toBeVisible();
    const fallback = page.locator('[data-landscape-static-fallback]');
    await fallback.locator('summary').click();
    await expect(fallback.getByRole('table')).toBeVisible();
    expect(await fallback.getByRole('row').count()).toBeGreaterThan(1);
  });


  test('legacy Results primer URLs keep a readable move notice without JavaScript', async ({ page }) => {
    const cases = [
      ['/research/seed-openevo/study/results/webshop-training/', '/research/seed-openevo/flow/webshop/'],
      ['/research/seed-openevo/study/results/seed-training/', '/research/seed-openevo/flow/webshop/#fig-seed-webshop'],
      ['/research/seed-openevo/study/results/openevo-training/', '/research/seed-openevo/flow/openevo/'],
    ] as const;

    for (const [route, target] of cases) {
      await page.goto(route);
      const notice = page.locator('.moved-primer');
      await expect(notice.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(notice.locator(`a[href="${target}"]`).first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    }
  });
});
