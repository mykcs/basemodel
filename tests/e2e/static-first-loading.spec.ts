import { expect, test, type Page } from '@playwright/test';

function watchCatalog(page: Page) {
  let count = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/model-data/catalog.json')) count += 1;
  });
  return () => count;
}

test('models defers the interactive catalog until the reader reaches the filter', async ({ page }) => {
  const catalogRequests = watchCatalog(page);
  await page.goto('/models/');
  await page.waitForTimeout(500);
  expect(catalogRequests()).toBe(0);
  await expect(page.locator('[data-model-static-fallback]')).toBeVisible();

  await page.getByRole('link', { name: /开始筛选模型/ }).click();
  await expect(page.locator('.explorer-toolbar')).toBeVisible();
  expect(catalogRequests()).toBe(1);
  await expect(page.locator('[data-model-static-fallback]')).toBeHidden();
});

test('workspace keeps the first viewport static and hydrates after the explicit start action', async ({ page }) => {
  const catalogRequests = watchCatalog(page);
  await page.goto('/workspace/');
  await page.waitForTimeout(500);
  expect(catalogRequests()).toBe(0);
  await expect(page.locator('[data-workspace-static-fallback]')).toBeVisible();

  await page.getByRole('link', { name: '开始填写实验条件' }).click();
  await expect(page).toHaveURL(/#workspace-interactive$/);
  await expect(page.locator('.workspace')).toBeVisible();
  expect(catalogRequests()).toBe(1);
});

test('landscape keeps a static table until its interactive view enters the viewport', async ({ page }) => {
  const catalogRequests = watchCatalog(page);
  await page.goto('/landscape/');
  await page.waitForTimeout(500);
  expect(catalogRequests()).toBe(0);
  const fallback = page.locator('[data-landscape-static-fallback]');
  await expect(fallback).toBeVisible();

  await fallback.locator('summary').click();
  await expect(page.locator('.landscape-controls')).toBeVisible();
  expect(catalogRequests()).toBe(1);
  await expect(fallback).toBeHidden();
});

test('papers and compare load the shared catalog instead of serialized full-dataset island props', async ({ page }) => {
  const catalogRequests = watchCatalog(page);
  await page.goto('/papers/');
  await expect(page.locator('.paper-explorer')).toBeVisible();
  expect(catalogRequests()).toBe(1);
  await expect(page.locator('[data-paper-static-fallback]')).toBeHidden();

  await page.goto('/compare/?models=qwen2-5-3b-instruct,qwen3-8b');
  await expect(page.locator('.comparison-picker')).toBeVisible();
  await expect(page.locator('.comparison-table')).toBeVisible();
  expect(catalogRequests()).toBe(2);
  await expect(page.locator('[data-compare-static-fallback]')).toBeHidden();
});

test('catalog failure leaves the models fallback readable instead of an inert blank surface', async ({ page }) => {
  await page.route('**/model-data/catalog.json', (route) => route.abort('failed'));
  await page.goto('/models/');
  await page.getByRole('link', { name: /开始筛选模型/ }).click();
  await expect(page.locator('#model-browser [role="status"]')).toContainText('交互筛选暂时不可用');
  const fallback = page.locator('[data-model-static-fallback]');
  await expect(fallback).toBeVisible();
  expect(await fallback.getByRole('link').count()).toBeGreaterThan(0);
});

test('catalog failure preserves workspace orientation at the interactive deep link', async ({ page }) => {
  await page.route('**/model-data/catalog.json', (route) => route.abort('failed'));
  await page.goto('/workspace/?v=2&mode=modern#workspace-interactive');
  await expect(page.locator('#workspace-interactive [role="status"]')).toContainText('交互式工作台暂时不可用');
  await expect(page.locator('[data-workspace-static-fallback]')).toBeVisible();
});

test('phone first view keeps model and workspace heavy catalog work deferred', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const catalogRequests = watchCatalog(page);

  await page.goto('/models/');
  await page.waitForTimeout(500);
  expect(catalogRequests()).toBe(0);
  await expect(page.locator('[data-model-static-fallback]')).toBeVisible();

  await page.goto('/workspace/');
  await page.waitForTimeout(500);
  expect(catalogRequests()).toBe(0);
  await expect(page.locator('[data-workspace-static-fallback]')).toBeVisible();

  await page.getByRole('link', { name: '开始填写实验条件' }).click();
  await expect(page.locator('.workspace-mobile-nav')).toBeVisible();
  expect(catalogRequests()).toBe(1);
});
