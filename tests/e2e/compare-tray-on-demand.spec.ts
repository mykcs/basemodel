import { expect, test } from '@playwright/test';

test('compare tray resolves persisted model labels on demand without console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const modelDataRequests: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/model-data/')) modelDataRequests.push(request.url());
  });

  await page.addInitScript(() => {
    localStorage.setItem('atlas-compare', JSON.stringify(['qwen3-8b', 'gpt-oss-20b']));
  });
  await page.goto('./');

  const tray = page.locator('.compare-tray');
  await expect(tray).toBeVisible();
  await expect(tray).toContainText('Qwen3-8B');
  await expect(tray).toContainText('gpt-oss-20b');
  await expect.poll(() => modelDataRequests.filter((url) => /qwen3-8b|gpt-oss-20b/.test(url)).length).toBeGreaterThanOrEqual(2);
  await expect.poll(() => [...consoleErrors, ...pageErrors]).toEqual([]);
});
