import { expect, test, type Page } from '@playwright/test';
import { registerOpenEvoResearchDeepDiveTests } from './openevo-research-deep-dives.cases';

const root = '/research/seed-openevo/study/capability-exploration/';
const firstRun = `${root}first-run/`;
const successor = `${root}openevo-2-0/`;
const exploration = `${successor}exploration/`;
const report = `${successor}report/`;
const archive = `${root}archive/`;

async function assertNoPageOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
}

registerOpenEvoResearchDeepDiveTests();

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

test('successor gateway exposes exactly two reading modes and shared Stage1 facts', async ({ page }) => {
  await page.goto(successor, { waitUntil: 'domcontentloaded' });
  const gateway = page.getByTestId('openevo-successor-gateway');
  await expect(gateway.locator('[data-successor-mode]')).toHaveCount(2);
  await expect(gateway.locator('[data-successor-mode="exploration"]')).toHaveAttribute('href', exploration);
  await expect(gateway.locator('[data-successor-mode="report"]')).toHaveAttribute('href', report);
  await expect(gateway).toContainText('202609030400');
  await expect(gateway).toContainText('22 / 1440');
  await expect(gateway).toContainText('50 / 1440');
  await assertNoPageOverflow(page);
});

for (const path of [root, firstRun, successor, exploration, report, archive, `${root}stage1-previous/`, `${root}stage2-256-window/`, `${root}stage2-ceiling/`, `${successor}harness-2-0/`, `${root}stage1-evolution/`]) {
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
  for (const path of [root, firstRun, successor, exploration, report, archive]) {
    test(`${theme} theme keeps ${path} readable and overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await assertNoPageOverflow(page);
      await expect(page.locator('body')).toBeVisible();
      expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
    });
  }
}

for (const path of [root, firstRun, successor, exploration, report, archive]) {
  test(`iphone layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
  });
}

test('report evidence details are keyboard-operable and preserve visible claim boundaries', async ({ page }) => {
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  const details = page.locator('[data-paper-step="carriers"] details');
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(page.getByText('解释边界：')).toBeVisible();
});

test('reduced motion preserves static map semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-first-run-arm="7b"]')).toBeVisible();
  await expect(page.locator('[data-node-kind="scientific-amendment"]').first()).toBeVisible();
  await page.goto(exploration, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-exploration-detour="horizon"]')).toBeVisible();
  await expect(page.locator('[data-quest="freeze"]')).toBeVisible();
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-paper-step="boundary"]')).toBeVisible();
});

test('English routes mount the same successor gateway and dual narrative architecture', async ({ page }) => {
  const enRoot = '/en/research/seed-openevo/study/capability-exploration/';
  await page.goto(enRoot, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-map-choice]')).toHaveCount(2);
  await page.goto(`${enRoot}openevo-2-0/`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-successor-mode]')).toHaveCount(2);
  await page.goto(`${enRoot}openevo-2-0/exploration/`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('openevo-successor-exploration-map')).toContainText('4096');
  await page.goto(`${enRoot}openevo-2-0/report/`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('openevo-successor-report')).toContainText('Cannot rule out');
  await assertNoPageOverflow(page);
});

test('successor gateway retains the seven experiment design families with pinned technical evidence', async ({ page }) => {
  await page.goto(successor, { waitUntil: 'domcontentloaded' });
  const catalog = page.getByTestId('openevo-experiment-design-catalog');
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-design-family]')).toHaveCount(7);
  const firstDetails = catalog.locator('details').first();
  await firstDetails.locator('summary').click();
  await expect(firstDetails.locator('a').first()).toBeVisible();
  await assertNoPageOverflow(page);
});
