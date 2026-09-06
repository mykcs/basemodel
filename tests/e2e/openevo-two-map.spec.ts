import { expect, test, type Page } from '@playwright/test';
import { registerReaderJourneyTests } from './reader-journey.cases';
import { registerOpenEvoResearchDeepDiveTests } from './openevo-research-deep-dives.cases';

const root = '/research/seed-openevo/study/capability-exploration/';
const firstRun = `${root}first-run/`;
const successor = `${root}openevo-2-0/`;
const exploration = `${successor}exploration/`;
const report = `${successor}report/`;
const mechanism = `${root}mechanism-1-0/`;
const archive = `${root}archive/`;

async function assertNoPageOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
}

registerOpenEvoResearchDeepDiveTests();
registerReaderJourneyTests();

test('desktop lobby exposes exactly three primary maps and keeps archive secondary', async ({ page }) => {
  const response = await page.goto(root, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-map-choice]')).toHaveCount(3);
  await expect(page.locator('[data-research-step="first-run"] summary')).toBeVisible();
  await expect(page.locator('[data-research-step="redesign"] summary')).toBeVisible();
  await page.locator('[data-research-step="first-run"] summary').click();
  await page.locator('[data-research-step="redesign"] summary').click();
  await expect(page.locator('[data-map-choice="first-run"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="redesign"]')).toBeVisible();
  await expect(page.locator('[data-map-choice="mechanism-1-0"]')).toHaveAttribute('href', mechanism);
  await expect(page.locator('[data-map-choice="archive"]')).toHaveCount(0);
  const archiveDepth = page.locator('[data-research-depth="history"]').last();
  await archiveDepth.locator('summary').first().click();
  await expect(page.locator('.map-lobby__archive')).toBeVisible();
  await assertNoPageOverflow(page);
});

test('Mechanism-1.0 exposes frozen passports, current M1-D activation, and explicit non-result boundaries', async ({ page }) => {
  const response = await page.goto(mechanism, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  const map = page.getByTestId('openevo-mechanism-map');
  await expect(map.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
  await expect(map.locator('[data-research-journey]')).toHaveCount(1);
  await expect(map.locator('[data-research-state-rail] [data-state-item]')).toHaveCount(4);
  await expect(map).toContainText('MECHANISM-1.0');
  for (const id of ['M1-A', 'M1-B', 'M1-C', 'M1-D']) await expect(map).toContainText(id);
  await expect(map.locator('[data-experiment="M1-D"]')).toContainText('1,440');
  await expect(map.locator('[data-experiment="M1-D"]')).toContainText('MiniMax');
  await expect(map).toContainText('SEED Stage2 = 0');
  await expect(map).toContainText('M1-D 阶段已激活');
  await expect(map).toContainText('结果未封存');
  await expect(map).toContainText('GPU0–3 SHARED RAY = AUTHORIZED');
  await expect(map).toContainText('M1-D STAGE1 = ACTIVATED');
  // Authority belongs to each experiment, not the whole program: the M1-A
  // successor remains locked even though M1-D Stage1 has an independent release.
  for (const id of ['M1-A', 'M1-B', 'M1-C']) await expect(map.locator(`[data-experiment="${id}"]`)).toHaveAttribute('data-execution', 'locked');
  await expect(map.locator('[data-experiment="M1-D"]')).toHaveAttribute('data-execution', 'authorized');
  await assertNoPageOverflow(page);
});

test('first-run defaults to 7B, switches to 3B, and restores focus after detail close', async ({ page }) => {
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
  await expect(page.locator('[data-research-journey] [data-research-step]')).toHaveCount(3);
  const lineageDepth = page.locator('[data-research-depth="history"]');
  await lineageDepth.locator('summary').first().click();
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

for (const path of [root, firstRun, successor, exploration, report, mechanism, archive, `${root}stage1-previous/`, `${root}stage2-256-window/`, `${root}stage2-ceiling/`, `${successor}harness-2-0/`, `${root}stage1-evolution/`]) {
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
  for (const path of [root, firstRun, successor, exploration, report, mechanism, archive]) {
    test(`${theme} theme keeps ${path} readable and overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await assertNoPageOverflow(page);
      await expect(page.locator('body')).toBeVisible();
      expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
    });
  }
}

for (const path of [root, `/en${root}`]) {
  test(`tablet layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
    await expect(page.locator('[data-map-choice]')).toHaveCount(3);
  });
}

for (const path of [root, firstRun, successor, exploration, report, mechanism, archive]) {
  test(`iphone layout keeps ${path} usable`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await assertNoPageOverflow(page);
  });
}

test('report evidence details are keyboard-operable and preserve visible claim boundaries', async ({ page }) => {
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  const details = page.locator('[data-paper-step="carriers"] details').filter({ has: page.getByText('展开 4096 → 10+10 的证据链', { exact: true }) });
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(page.getByText('解释边界：')).toBeVisible();
});

test('reduced motion preserves static map semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(firstRun, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-journey]')).toBeVisible();
  const firstRunDepth = page.locator('[data-research-depth="history"]');
  await firstRunDepth.locator('summary').first().click();
  await expect(page.locator('[data-first-run-arm="7b"]')).toBeVisible();
  await expect(page.locator('[data-node-kind="scientific-amendment"]').first()).toBeVisible();
  await page.goto(exploration, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-journey]')).toBeVisible();
  const explorationDepth = page.locator('[data-research-depth="history"]');
  await explorationDepth.locator('summary').first().click();
  await expect(page.locator('[data-exploration-detour="horizon"]')).toBeVisible();
  await expect(page.locator('[data-quest="freeze"]')).toBeVisible();
  await page.goto(report, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-paper-step="boundary"]')).toBeVisible();
});

test('English routes mount the same successor gateway and dual narrative architecture', async ({ page }) => {
  const enRoot = '/en/research/seed-openevo/study/capability-exploration/';
  await page.goto(enRoot, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-map-choice]')).toHaveCount(3);
  await expect(page.locator('[data-map-choice="mechanism-1-0"]')).toBeVisible();
  await page.goto(`${enRoot}mechanism-1-0/`, { waitUntil: 'domcontentloaded' });
  const mechanismMap = page.getByTestId('openevo-mechanism-map');
  await expect(mechanismMap.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
  await expect(mechanismMap).toContainText('M1-D PHASE ACTIVATED');
  await expect(mechanismMap).toContainText('results not sealed');
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
  const catalogDepth = page.locator('[data-research-depth="history"]');
  await catalogDepth.locator('summary').first().click();
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-design-family]')).toHaveCount(7);
  const firstDetails = catalog.locator('details').first();
  await firstDetails.locator('summary').click();
  await expect(firstDetails.locator('a').first()).toBeVisible();
  await assertNoPageOverflow(page);
});