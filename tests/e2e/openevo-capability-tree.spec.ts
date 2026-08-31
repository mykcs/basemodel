import { expect, test, type Page } from '@playwright/test';

const path = '/research/seed-openevo/study/capability-exploration/';

async function enterCurrentStage2(page: Page) {
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await tree.locator('[data-stage1="current"]').click();
  await tree.locator('[data-analysis="current-state"]').click();
  await expect(tree.locator('[data-enter-stage2]')).toBeVisible();
  await tree.locator('[data-enter-stage2]').click();
  await expect(tree.locator('[data-floor="stage1"]')).toBeHidden();
  await expect(tree.locator('[data-floor="stage2"]')).toBeVisible();
  return tree;
}

test('Stage 1 is floor one and entering Stage 2 changes the map', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await expect(tree.locator('[data-floor="stage1"]')).toBeVisible();
  await expect(tree.locator('[data-floor="stage2"]')).toBeHidden();
  await enterCurrentStage2(page);
});
test('historical Stage 2 cannot reach its ending before the bug gate is repaired', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const original = page.url();
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await tree.locator('[data-stage1="old"]').click();
  await tree.locator('[data-analysis="old-3b-self"]').click();
  await tree.locator('[data-enter-stage2]').click();
  await tree.locator('[data-stage2="legacy"]').click();
  await expect(tree.locator('[data-bug="legacy-gate"]')).toBeVisible();
  await expect(tree.locator('[data-ending-from-old]')).toBeHidden();
  await tree.locator('[data-bug="legacy-gate"]').click();
  await expect(tree.locator('[data-repair="legacy-gate"]')).toBeVisible();
  await expect(tree.locator('[data-ending-from-old]')).toBeHidden();
  await tree.locator('[data-repair="legacy-gate"]').click();
  await expect(tree.locator('[data-ending-from-old]')).toBeVisible();
  await tree.locator('[data-ending-from-old]').click();
  await expect(tree.locator('[data-story="old-3b-self"]')).toBeVisible();
  expect(page.url()).toBe(original);
});

test('OpenEVO 2.0 stops at a current bug gate and keeps 2.0.1 locked', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const original = page.url();
  const tree = await enterCurrentStage2(page);
  await tree.locator('[data-stage2="evo2"]').click();
  await expect(tree.locator('[data-evo2-gate]')).toBeVisible();
  await expect(tree.locator('.rogue-node--locked')).toBeDisabled();
  await tree.locator('[data-ending="evo2"]').click();
  await expect(tree.locator('[data-story="evo2"]')).toBeVisible();
  expect(page.url()).toBe(original);
});
for (const viewport of [
  { name: 'iphone-375', width: 375, height: 812 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-430', width: 430, height: 932 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name}-${theme} keeps roguelike floors readable`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const tree = await enterCurrentStage2(page);
      await tree.locator('[data-stage2="evo2"]').click();
      const geometry = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(tree.locator('[data-evo2-gate]')).toBeVisible();
    });
  }
}
