import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = join(process.cwd(), 'dist');
function discover(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return discover(path);
    if (!entry.name.endsWith('.html')) return [];
    const source = readFileSync(path, 'utf8');
    if (!/<figure(?=[\s>])|<table(?=[\s>])/i.test(source)) return [];
    const route = '/' + relative(root, path).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
    return [route === '//' ? '/' : route];
  });
}
const routes = [...new Set(discover(root))].sort();
test('visual-route audit covers all source-rendered graphics/table routes', () => {
  expect(routes.length).toBeGreaterThanOrEqual(66);
});

// Every static route with visible graphics or a table is in the browser acceptance
// matrix. Operational UI and fixed 16:9 slides retain their own semantic layout.
for (const route of routes) {
  test('research figure/table route remains viewport-safe: ' + route, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    }
  });
}

test('short quantitative tables shrink without affecting dense tables or method diagrams', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
  const tables = page.locator('.paper-table');
  await expect(tables).toHaveCount(21);
  const sizes = await tables.evaluateAll(els => els.map(el => ({
    cols: el.querySelector('thead tr')?.children.length ?? 0,
    width: el.getBoundingClientRect().width,
    dense: el.classList.contains('paper-table--dense-results') || el.classList.contains('paper-table--ablation'),
  })));
  expect(sizes.some(item => item.cols <= 3 && !item.dense && item.width <= 740)).toBe(true);
  expect(sizes.some(item => item.cols >= 6 && item.width >= 900)).toBe(true);
  await expect(page.locator('.metric-evidence[data-research-figure-size="wide"]')).toHaveCount(7);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/');
  const acceleration = page.locator('.ba-accel__table');
  const accelSizes = await acceleration.evaluateAll(els => els.map(el => ({
    cols: el.querySelector('thead tr')?.children.length ?? 0,
    width: el.getBoundingClientRect().width,
  })));
  expect(accelSizes.find(row => row.cols === 2)?.width).toBeLessThan(500);
  expect(accelSizes.find(row => row.cols === 5)?.width).toBeGreaterThan(900);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');
  const state = page.locator('.bounded__table');
  expect((await state.first().boundingBox())!.width).toBeLessThan(760);
  expect((await state.last().boundingBox())!.width).toBeGreaterThan(900);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/');
  const v2Compact = page.locator('.comparison-table');
  const v2Wide = page.locator('.next-table');
  expect((await v2Compact.boundingBox())!.width).toBeLessThan(780);
  expect((await v2Wide.boundingBox())!.width).toBeGreaterThan(800);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-scaling/');
  await expect(page.locator('.scaling-chart')).toHaveAttribute('data-research-figure-size', 'wide');
  // Five annotated observations must not be reduced to unreadable tiny labels.
  expect((await page.locator('.scaling-chart').boundingBox())!.width).toBeGreaterThan(950);
});

test('paper evidence width remains local to scientific plots; app catalog remains intact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  const one = (await page.locator('[data-paper-effect="q07-inversion"]').boundingBox())!.width;
  const many = (await page.locator('[data-paper-effect="q09-context"]').boundingBox())!.width;
  expect(many).toBeGreaterThan(one + 180);
  await page.goto('/data-status/');
  expect((await page.locator('table').first().boundingBox())!.width).toBeGreaterThan(800);
  await page.goto('/research/seed-openevo/study/briefing/');
  expect(await page.locator('.dynamics-chart').count()).toBe(8);
});
