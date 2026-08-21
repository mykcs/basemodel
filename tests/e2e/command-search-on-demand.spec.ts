import { expect, test } from '@playwright/test';

test('command search loads its index only after the user opens it', async ({ page }) => {
  const searchIndexRequests: string[] = [];
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/search-index.json')) searchIndexRequests.push(request.url());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(searchIndexRequests).toEqual([]);

  await page.getByRole('button', { name: '搜索' }).click();
  const search = page.getByRole('searchbox', { name: '搜索模型、alias、厂商、家族或论文…' });
  await search.fill('qwen3-8b');
  await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /models\/qwen3-8b/);
  await expect.poll(() => searchIndexRequests.length).toBe(1);

  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
