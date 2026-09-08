import { expect, test, type Locator, type Page } from '@playwright/test';

import { waitForHydratedIsland } from './hydration-ready';

const ownerRoutes = [
  ['/research/seed-openevo/flow/webshop/', 'webshop'],
  ['/research/seed-openevo/flow/alfworld/', 'alfworld'],
  ['/research/seed-openevo/flow/seed/', 'seed'],
  ['/research/seed-openevo/flow/openevo/', 'openevo'],
  ['/en/research/seed-openevo/flow/webshop/', 'webshop'],
  ['/en/research/seed-openevo/flow/alfworld/', 'alfworld'],
  ['/en/research/seed-openevo/flow/seed/', 'seed'],
  ['/en/research/seed-openevo/flow/openevo/', 'openevo'],
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

async function activate(root: Locator) {
  await waitForHydratedIsland(root);
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  await expect(next).toBeVisible();
  await next.click();
  await expect(root).toHaveAttribute('data-overview', 'false');
  return root.locator('.irx-transport');
}

function expectInsideViewport(rect: { x: number; y: number; width: number; height: number }, width: number, height: number) {
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(width);
  expect(rect.y).toBeGreaterThanOrEqual(0);
  expect(rect.y + rect.height).toBeLessThanOrEqual(height);
}

test('standalone step-by-step owners dock Previous / Next from initial render through interaction', async ({ page }) => {
  const viewport = { width: 1440, height: 900 };
  await page.setViewportSize(viewport);

  for (const [path, kind] of ownerRoutes) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      await page.mouse.move(4, 4);
      const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
      const transport = root.locator('.irx-transport');
      await expect(transport).toHaveCSS('position', 'fixed');
      await expect(transport).toBeInViewport();
      await activate(root);
      await expect(transport).toHaveCSS('position', 'fixed');
      expect(await transport.evaluate((node) => Boolean(node.closest('[data-interactive-research-explainer]')))).toBe(true);
      const rect = await transport.boundingBox();
      expect(rect).not.toBeNull();
      expectInsideViewport(rect!, viewport.width, viewport.height);
    });
  }
});

test('embedded Lab explainer controls do not enter the first screen before the explainer', async ({ page }) => {
  const viewport = { width: 1280, height: 633 };
  await page.setViewportSize(viewport);
  for (const path of ['/lab/', '/en/lab/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const root = page.locator('[data-interactive-research-explainer="server"]').first();
    const transport = root.locator('.irx-transport');
    expect(await transport.evaluate((node) => getComputedStyle(node).position)).not.toBe('fixed');
    await expect(transport).not.toBeInViewport();
    await root.scrollIntoViewIfNeeded();
    await activate(root);
    expect(await transport.evaluate((node) => getComputedStyle(node).position)).not.toBe('fixed');
  }
});

test('WebShop floating transport also stays inside a mobile viewport', async ({ page }) => {
  const viewport = { width: 390, height: 844 };
  await page.setViewportSize(viewport);
  await page.goto('/research/seed-openevo/flow/webshop/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  const root = page.locator('[data-interactive-research-explainer="webshop"]').first();
  const transport = root.locator('.irx-transport');
  await expect(transport).toHaveCSS('position', 'fixed');
  await expect(transport).toBeInViewport();
  await activate(root);
  await expect(transport).toHaveCSS('position', 'fixed');
  const rect = await transport.boundingBox();
  expect(rect).not.toBeNull();
  expectInsideViewport(rect!, viewport.width, viewport.height);
});

test('canonical-only comparison routes never expose a floating step transport', async ({ page }) => {
  for (const path of ['/research/seed-openevo/flow/loops/', '/en/research/seed-openevo/flow/loops/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await expect(page.locator('#fig-seed-openevo-update-target')).toBeVisible();
    await expect(page.locator('[data-interactive-research-explainer]')).toHaveCount(0);
    await expect(page.locator('.irx-transport')).toHaveCount(0);
  }
});

test('SEED transport is bottom-docked before interaction', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  await page.mouse.move(4, 4);
  await expect(page.locator('#fig-seed-webshop')).toHaveCount(0);
  const root = page.locator('[data-interactive-research-explainer="seed"]').first();
  const transport = root.locator('.irx-transport');
  await expect(transport).toHaveCSS('position', 'fixed');
  await expect(transport).toBeInViewport();
});