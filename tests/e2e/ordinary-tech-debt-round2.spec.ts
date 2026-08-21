import { expect, test } from '@playwright/test';

test('does not mount the global quick-view shell on unrelated routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.global-quick-view')).toHaveCount(0);
  await page.goto('/families/');
  await expect(page.locator('.global-quick-view')).toHaveCount(1);
});

test('route-scoped global quick view still works from the family timeline', async ({ page }) => {
  await page.goto('/families/');
  const trigger = page.locator('.tree-quick-view').first();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog = page.locator('.global-quick-view');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('open', '');
});

test('paper-detail quick view hydrates on visibility and opens the shared dialog for recorded model roles', async ({ page }) => {
  await page.goto('/papers/agentbench/');
  const trigger = page.locator('.role-model-quick-view').first();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveText(/快速查看|Quick view/);
  await trigger.click();
  await expect(page.locator('.global-quick-view')).toBeVisible();
});

test('Landscape keeps static learning content and hydrates controls when visible', async ({ page }) => {
  await page.goto('/landscape/');
  await expect(page.locator('.landscape-learning-list')).toBeVisible();
  const fullView = page.getByRole('button', { name: '完整视图' });
  await fullView.scrollIntoViewIfNeeded();
  await fullView.click();
  await expect(page.locator('.landscape-view-note')).toBeVisible();
});
