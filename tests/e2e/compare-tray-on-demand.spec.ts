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

test('native research context survives navigation and handles same-document update and clear', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('atlas-research-task', JSON.stringify({
      schemaVersion: 2,
      mode: 'method',
      roles: ['agent'],
      update: 'lora',
      accessMode: 'local',
      gpuVramGb: 24,
      openWeight: true,
      requiredRuntimes: [],
      license: {},
      reproducibility: {},
      evidencePolicy: 'verified_preferred',
      priorities: [],
    }));
    localStorage.setItem('atlas-candidates', JSON.stringify(['qwen3-8b']));
    localStorage.setItem('atlas-compare', JSON.stringify(['gpt-oss-20b']));
  });
  await page.goto('/models/');
  await page.goto('/');

  const context = page.locator('[data-research-context]');
  await expect(context).toBeVisible();
  await expect(context).toContainText('24GB');
  await expect(context.locator('[data-context-counts]')).toContainText(/1.*1/);

  await page.evaluate(() => {
    const task = JSON.parse(localStorage.getItem('atlas-research-task') || '{}');
    task.gpuVramGb = 48;
    localStorage.setItem('atlas-research-task', JSON.stringify(task));
    localStorage.setItem('atlas-candidates', JSON.stringify(['qwen3-8b', 'gpt-oss-20b']));
    window.dispatchEvent(new Event('atlas:research-context-change'));
  });
  await expect(context).toContainText('48GB');
  await expect(context.locator('[data-context-counts]')).toContainText(/2.*1/);

  await context.locator('[data-context-clear]').click();
  await expect(context).toBeHidden();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-research-task') || '{}').mode)).toBe('new');
});


test('native research context hydrates a shareable v2 task from the URL', async ({ page }) => {
  await page.goto('/?v=2&mode=method&roles=agent&gpu=32&open=1');
  const context = page.locator('[data-research-context]');
  await expect(context).toBeVisible();
  await expect(context).toContainText('32GB');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-research-task') || '{}').gpuVramGb)).toBe(32);
});
