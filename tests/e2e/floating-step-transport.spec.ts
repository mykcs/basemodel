import { expect, test, type Page } from '@playwright/test';

const ownerRoutes = [
  ['/research/seed-openevo/webshop/', 'webshop'],
  ['/research/seed-openevo/alfworld/', 'alfworld'],
  ['/research/seed-openevo/seed/', 'seed'],
  ['/research/seed-openevo/openevo/', 'openevo'],
  ['/lab/', 'server'],
  ['/en/research/seed-openevo/webshop/', 'webshop'],
  ['/en/research/seed-openevo/alfworld/', 'alfworld'],
  ['/en/research/seed-openevo/seed/', 'seed'],
  ['/en/research/seed-openevo/openevo/', 'openevo'],
  ['/en/lab/', 'server'],
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

async function activate(root: ReturnType<Page['locator']>) {
  await root.scrollIntoViewIfNeeded();
  const island = root.locator('xpath=ancestor::astro-island[1]');
  if (await island.count()) await expect(island).not.toHaveAttribute('ssr', '');
  const next = root.locator('button[aria-label="下一步"], button[aria-label="Next step"]');
  await expect(next).toBeVisible();
  await next.click();
  await expect(root).toHaveAttribute('data-overview', 'false');
  return root.locator('.irx-transport');
}

test('every true step-by-step owner floats Previous / Next after interaction', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const [path, kind] of ownerRoutes) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      await page.mouse.move(4, 4);
      const root = page.locator(`[data-interactive-research-explainer="${kind}"]`).first();
      const transport = await activate(root);
      await expect(transport).toHaveCSS('position', 'fixed');
      expect(await transport.evaluate((node) => Boolean(node.closest('[data-interactive-research-explainer]')))).toBe(true);
      const rect = await transport.boundingBox();
      expect(rect).not.toBeNull();
      expect(rect!.bottom).toBeLessThanOrEqual(900);
      expect(rect!.left).toBeGreaterThanOrEqual(0);
      expect(rect!.right).toBeLessThanOrEqual(1440);
    });
  }
});

test('WebShop floating transport also stays inside a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/webshop/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  const root = page.locator('[data-interactive-research-explainer="webshop"]').first();
  const transport = await activate(root);
  await expect(transport).toHaveCSS('position', 'fixed');
  const rect = await transport.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.left).toBeGreaterThanOrEqual(0);
  expect(rect!.right).toBeLessThanOrEqual(390);
  expect(rect!.bottom).toBeLessThanOrEqual(844);
});

test('canonical-only comparison routes never expose a floating step transport', async ({ page }) => {
  for (const path of ['/research/seed-openevo/loops/', '/en/research/seed-openevo/loops/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await expect(page.locator('#fig-seed-openevo-update-target')).toBeVisible();
    await expect(page.locator('[data-interactive-research-explainer]')).toHaveCount(0);
    await expect(page.locator('.irx-transport')).toHaveCount(0);
  }
});

test('SEED canonical S1 does not borrow the later explainer transport before interaction', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/seed/', { waitUntil: 'domcontentloaded' });
  await settle(page);
  await page.mouse.move(4, 4);
  await expect(page.locator('#fig-seed-webshop')).toBeVisible();
  const root = page.locator('[data-interactive-research-explainer="seed"]').first();
  const transport = root.locator('.irx-transport');
  await expect(transport).not.toHaveCSS('position', 'fixed');
});
