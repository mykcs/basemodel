import { expect, test } from '@playwright/test';

test('English command search uses the shared deployment search index', async ({ page }) => {
  await page.goto('en/models/');

  await page.getByRole('button', { name: 'Search' }).click();
  const search = page.getByRole('searchbox', { name: /Search models/i });
  await search.fill('qwen3-8b');

  const result = page.locator('.command-results a').first();
  await expect(result).toHaveAttribute('href', '/basemodel/en/models/qwen3-8b/');
  await expect(result).toContainText('Qwen3');
});
