import { expect, test } from '@playwright/test';

test('homepage leads with the research path and an accessible theme toggle', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('#experiment-selector')).toBeVisible();
  await expect(page.getByRole('link', { name: '按实验条件筛选模型 →' })).toHaveAttribute('href', '#experiment-selector');
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText('选择入口');

  const themeToggle = page.getByRole('button', { name: '切换深色模式' });
  const before = await themeToggle.getAttribute('aria-pressed');
  await themeToggle.click();
  await expect(themeToggle).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
});

test('model explorer exposes quick filters and a comparison entry point', async ({ page }) => {
  await page.goto('models/');

  const rlFilter = page.getByRole('button', { name: '适合 RL', exact: true });
  await expect(rlFilter).toHaveAttribute('aria-pressed', 'false');
  await rlFilter.click();
  await expect(rlFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/models\/\?rl=true$/);
  await expect(page.locator('.model-card')).not.toHaveCount(0);

  const compareLink = page.locator('.model-card').first().getByRole('link', { name: /加入模型对比/ });
  await expect(compareLink).toHaveAttribute('href', /\/compare\/\?models=.+/);
});

test('comparison restores selected models, groups fields, and filters differences', async ({ page }) => {
  await page.goto('compare/?models=qwen3-8b,gpt-oss-20b');

  await expect(page.locator('.picker-item input:checked')).toHaveCount(2);
  await expect(page.locator('.comparison-group')).toHaveCount(5);
  const allRows = page.locator('.comparison-table tbody tr:not(.comparison-group)');
  const allRowCount = await allRows.count();

  const onlyDifferences = page.getByRole('checkbox', { name: '只看差异' });
  await onlyDifferences.check();
  await expect.poll(() => allRows.count()).toBeLessThan(allRowCount);

  const extraModel = page.locator('.picker-item').filter({ hasText: 'GPT-5.2' }).locator('input');
  await extraModel.check();
  await expect(page).toHaveURL(/gpt-5-2/);
});

test('English routes preserve the base path and active navigation state', async ({ page }) => {
  await page.goto('en/models/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText('Models');
  await expect(page.getByRole('link', { name: 'Switch to Chinese' })).toHaveAttribute('href', '/basemodel/models/');
});

test('mobile navigation exposes the current page after opening the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('compare/');

  const menuToggle = page.getByRole('button', { name: '打开菜单' });
  await expect(menuToggle).toBeVisible();
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await expect(page.locator('.mobile-menu a[aria-current="page"]')).toHaveText('对比');
});
