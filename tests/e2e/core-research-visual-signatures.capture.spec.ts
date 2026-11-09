import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { matrices, routes, settle, screenshotSignature, type Theme } from './core-research-visual-shared';

test('capture accepted core research screenshot signatures', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Visual baseline capture is Chromium-specific');
  const signatures: Record<string, { route: string; viewport: { width: number; height: number }; theme: Theme; dhash64: string; avgRgb: [number, number, number] }> = {};

  for (const matrix of matrices) {
    await page.setViewportSize(matrix.viewport);
    for (const route of routes) {
      await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
      // Captured signatures are reusable evidence. Reject a 404/error page
      // before it can become a seemingly valid visual baseline.
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `cannot capture a missing/error research route: ${route.path}`).toBe(200);
      await settle(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
      const { signature, jpeg } = await screenshotSignature(page);
      signatures[`${route.key}__${matrix.key}`] = {
        route: route.path,
        viewport: matrix.viewport,
        theme: matrix.theme,
        ...signature,
      };
      // Inspectable renders for the main Flow, WebShop, and Results reading paths.
      // A signature by itself is not a visual or human-comprehension review.
      if (['overview-zh', 'webshop-zh', 'results-zh'].includes(route.key)) {
        await testInfo.attach(`research-${route.key}-${matrix.key}.jpeg`, {
          body: jpeg,
          contentType: 'image/jpeg',
        });
      }
    }
  }

  const payload = { version: 2, browser: 'chromium', algorithm: 'dhash64+avgRgb', signatures };
  await mkdir('dist/__qa__', { recursive: true });
  await writeFile('dist/__qa__/core-research-visual-signatures.json', `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
});
