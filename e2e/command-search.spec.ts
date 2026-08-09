import { expect, test } from '@playwright/test';

test('English command search uses the shared deployment search index', async ({ page }) => {
  const searchIndexResponse = page.waitForResponse((response) =>
    response.url().endsWith('/basemodel/search-index.json'),
  );

  await page.goto('en/models/');

  const response = await searchIndexResponse;
  expect(response.ok()).toBe(true);
  expect(response.url()).not.toContain('/en/search-index.json');

  await page.getByRole('button', { name: 'Search' }).click();
  const search = page.getByRole('searchbox', { name: /Search models/i });
  await search.fill('qwen3-8b');

  const result = page.locator('.command-results a').first();
  await expect(result).toHaveAttribute('href', '/basemodel/en/models/qwen3-8b/');
  await expect(result).toContainText('Qwen3');
});
