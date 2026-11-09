import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { matrices, routes, settle, screenshotSignature, type Theme } from './core-research-visual-shared';

test('capture accepted core research screenshot signatures', async ({ context }, testInfo) => {
  // The full 7-route signature baseline is Chromium-only. WebKit still runs a
  // real, non-skipped 3-route smoke across both viewports and both themes:
  // our release gate requires every allocated case to pass on its first run.
  const chromiumCapture = testInfo.project.name === 'chromium';
  const captureRoutes = chromiumCapture
    ? routes
    : routes.filter(({ key }) => ['overview-zh', 'webshop-zh', 'results-zh'].includes(key));
  const signatures: Record<string, { route: string; viewport: { width: number; height: number }; theme: Theme; dhash64: string; avgRgb: [number, number, number] }> = {};

  for (const matrix of matrices) {
    // A page-level init script survives navigation. Reusing one page across
    // themes accumulates conflicting scripts whose execution order is undefined.
    const page = await context.newPage();
    try {
      await page.setViewportSize(matrix.viewport);
      await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
      for (const route of captureRoutes) {
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
    } finally {
      await page.close();
    }
  }

  // Never write WebKit pixels into the Chromium reference artifact.
  if (chromiumCapture) {
    const payload = { version: 2, browser: 'chromium', algorithm: 'dhash64+avgRgb', signatures };
    await mkdir('dist/__qa__', { recursive: true });
    await writeFile('dist/__qa__/core-research-visual-signatures.json', `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  }
});
