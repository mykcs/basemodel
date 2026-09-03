import { expect, test, type Page } from '@playwright/test';

const root = '/research/seed-openevo/study/capability-exploration/';
const firstRun = `${root}first-run/`;
const redesign = `${root}openevo-2-0/`;
const archive = `${root}archive/`;

async function assertNoPageOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
}

test('desktop lobby exposes exactly two primary maps and keeps archive secondary', async ({ page }) => {
  const response = await page.goto(root, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-map-choice]')).toHaveCount(2);
  await expect(page.locator('[data-map-choice="first-run"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="redesign"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="archive"]')).toHaveCount(0);
  await expect(page.locator('.map-lobby__archive')).toBeVisible();
  await assertNoPageOverflow(page);
});

test('first-run defaults to 7B, switches to 3B, and restores focus after detail close', async ({ page }) => {
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  const arm7 = page.locator('[data-first-run-arm="7b"]');
  const arm3 = page.locator('[data-first-run-arm="3b"]');
  await expect(arm7).toHaveAttribute('aria-pressed', 'true');
  await arm3.click();
  await expect(arm3).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-first-run-panel="3b"]')).toBeVisible();

  const detail = page.locator('[data-first-run-panel="3b"] [data-first-run-detail]').first();
  await detail.click();
  await expect(page.locator('[data-first-run-detail-layer]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-first-run-detail-layer]')).toBeHidden();
  await expect(detail).toBeFocused();
  await assertNoPageOverflow(page);
});

test('redesign keeps current authority and all downstream/final nodes locked', async ({ page }) => {
  await page.goto(redesign, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('分析合同已冻结 · 202609022300')).toBeVisible();
  await expect(page.getByText('downstream_not_authorized_here')).toBeVisible();
  await expect(page.locator('.downstream-card[data-node-state="future"]')).toHaveCount(4);
  await expect(page.locator('article:has-text("FINAL EVALUATION")[data-node-state="future"]')).toHaveCount(1);

  const detail = page.locator('[data-redesign-detail]').first();
  await detail.click();
  await expect(page.locator('[data-redesign-detail-layer]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-redesign-detail-layer]')).toBeHidden();
  await expect(detail).toBeFocused();
  await assertNoPageOverflow(page);
});
for (const path of [root, firstRun, redesign, archive, `${root}stage1-previous/`, `${root}stage2-256-window/`, `${root}stage2-ceiling/`, `${redesign}harness-2-0/`]) {
  test(`desktop route ${path} is healthy`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(String(error)));
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await assertNoPageOverflow(page);
    expect(errors).toEqual([]);
  });
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of [root, firstRun, redesign, archive]) {
    test(`${theme} theme keeps ${path} readable and overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await assertNoPageOverflow(page);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
    });
  }
}
for (const path of [root, firstRun, redesign, archive]) {
  test(`iphone layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
  });
}

test('iphone detail behaves as a modal and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(redesign, { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('[data-redesign-detail="harness"]');
  await trigger.click();
  const dialog = page.locator('[data-redesign-detail-card]');
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('reduced motion preserves static route meaning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-first-run-arm="7b"]')).toBeVisible();
  await expect(page.locator('[data-node-kind="scientific-amendment"]').first()).toBeVisible();
  await page.goto(redesign, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-node-state="future"]').first()).toBeVisible();
  await expect(page.getByText('FINAL EVALUATION')).toBeVisible();
});

test('English routes mount the same two-map architecture', async ({ page }) => {
  await page.goto('/en/research/seed-openevo/study/capability-exploration/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-map-choice]')).toHaveCount(2);
  await page.goto('/en/research/seed-openevo/study/capability-exploration/openevo-2-0/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('ANALYSIS CONTRACT FROZEN · 202609022300')).toBeVisible();
  await assertNoPageOverflow(page);
});