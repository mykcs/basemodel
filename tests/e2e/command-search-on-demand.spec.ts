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
  const search = page.getByRole('searchbox', { name: '搜索研究专题、实验、模型或论文…' });
  await search.fill('qwen3-8b');
  await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /models\/qwen3-8b/);
  await expect.poll(() => searchIndexRequests.length).toBe(1);

  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('research search reaches canonical questions, mechanisms and results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '搜索' }).click();
  const input = page.locator('[data-command-input]');
  for (const [query, path] of [
    ['L 学长十问', '/research/seed-openevo/study/advisor-questions/'],
    ['DirectApply', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/'],
    ['Stable Reduction', '/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/'],
  ]) {
    await input.fill(query);
    await expect(page.locator(`.command-results a[href="${path}"]`)).toHaveCount(1);
  }
  const response = await page.request.get('/search-index.json');
  const index = await response.json() as { type: string; path?: string }[];
  const paths = index.filter((row) => row.type === 'guide').map((row) => row.path).filter(Boolean);
  expect(new Set(paths).size).toBe(paths.length);
  expect(paths).not.toContain('/research/seed-openevo/study/capability-exploration/stage1-evolution/');
});
