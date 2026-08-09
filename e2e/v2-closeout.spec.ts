import { expect, test } from '@playwright/test';

test('model detail exposes research navigation and never fabricates a pinned revision', async ({ page }) => {
  await page.goto('models/qwen3-8b/');

  await expect(page.locator('.model-detail-nav')).toBeVisible();
  await expect(page.locator('.model-detail-nav')).toContainText('研究速览');
  await expect(page.getByText('模型版本尚未固定', { exact: true }).first()).toBeVisible();
  await expect(page.locator('.unresolved-fields')).toBeVisible();
});

test('paper explorer exposes benchmark and checkpoint filters', async ({ page }) => {
  await page.goto('papers/');

  const benchmark = page.getByLabel('Benchmark');
  const checkpoint = page.getByText('Checkpoint', { exact: true }).first();
  await expect(benchmark).toBeVisible();
  await expect(checkpoint).toBeVisible();
  await benchmark.selectOption({ index: 1 });
  await expect(page).toHaveURL(/benchmark=/);
});

test('family timeline opens the global model quick view', async ({ page }) => {
  await page.goto('families/');

  const quickView = page.locator('.tree-quick-view').first();
  await expect(quickView).toBeVisible();
  await quickView.click();
  await expect(page.locator('.global-quick-view[open]')).toBeVisible();
  await expect(page.locator('.global-quick-view .quick-view-actions')).toBeVisible();
});

test('mobile comparison uses research cards instead of the wide desktop table', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('compare/?models=qwen3-8b,gpt-oss-20b');

  await expect(page.locator('.comparison-mobile-cards')).toBeVisible();
  await expect(page.locator('.comparison-mobile-field').first()).toBeVisible();
  await expect(page.locator('.comparison-desktop-table')).toBeHidden();
});

test('replacement lab exposes strict method and modern verdicts together', async ({ page }) => {
  await page.goto('workspace/');

  const lab = page.locator('.substitute-lab');
  await expect(lab).toBeVisible();
  const select = lab.locator('select');
  await select.selectOption('qwen2-5-3b-instruct');
  const firstCard = lab.locator('.substitute-card').first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.locator('.replacement-verdict')).toHaveCount(3);
  await expect(firstCard).toContainText('严格复现');
  await expect(firstCard).toContainText('方法复现');
  await expect(firstCard).toContainText('现代化重跑');
});
