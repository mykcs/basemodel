import { expect, test, type Page } from '@playwright/test';

// This component is the canonical historical per-arm experiment results view.
// Data, scientific claims and the saved checkpoint rows are deliberately untouched.
const cases = [
  { route: '/research/seed-openevo/study/results/3b-minimax-analysis/', kind: 'stopped' },
  { route: '/research/seed-openevo/study/results/7b-self-analysis/', kind: 'checkpoint' },
  { route: '/research/seed-openevo/study/results/7b-minimax-analysis/', kind: 'complete' },
] as const;

const common = [
  { selector: '.exp-scaffold__legacy-warning p', role: 'historical warning prose', min: 15.9 },
  { selector: '.exp-scaffold__term-list dd', role: 'experiment-stage explanation', min: 15.9 },
  { selector: '.exp-scaffold__table-wrap tbody td', role: 'scientific data', min: 14.9 },
  { selector: '.exp-scaffold__table-wrap thead th', role: 'scientific heading', min: 14.9 },
  { selector: '.exp-scaffold__pipeline p', role: 'scientific process prose', min: 14.9 },
  { selector: '.exp-scaffold__footer', role: 'footer provenance', min: 12.9 },
] as const;

async function computed(page: Page, selector: string) {
  const node = page.locator('.exp-scaffold').locator(selector).first();
  await expect(node, selector + ' not rendered').toBeVisible();
  return node.evaluate(element => {
    const css = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      size: Number.parseFloat(css.fontSize),
      leading: Number.parseFloat(css.lineHeight),
      family: css.fontFamily,
      weight: css.fontWeight,
      italic: css.fontStyle,
      width: rect.width,
      overflow: element.scrollWidth - element.clientWidth,
    };
  });
}

for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    for (const item of cases) {
      test('historical results have readable prose and local tables: ' + width + '/' + theme + '/' + item.kind,
        async ({ page }, info) => {
          await page.setViewportSize({ width, height: 900 });
          await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
          const response = await page.goto(item.route, { waitUntil: 'domcontentloaded' });
          expect(response?.status()).toBe(200);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await page.evaluate(() => document.fonts.ready);

          // Some of the historical checkpoint tables belong to user-operated details.
          await page.locator('.exp-scaffold details').evaluateAll(items => items.forEach(el => {
            el.open = true;
          }));
          for (const rule of common) {
            const actual = await computed(page, rule.selector);
            expect(actual.size, rule.role).toBeGreaterThanOrEqual(rule.min);
            expect(actual.italic, rule.role).toBe('normal');
            expect(actual.family, rule.role).toMatch(/Inter|PingFang|system-ui/);
            expect(actual.width, rule.role).toBeGreaterThanOrEqual(50);
            expect(actual.leading, rule.role).toBeGreaterThan(actual.size * 1.25);
          }
          if (item.kind === 'checkpoint') {
            for (const role of [
              { selector: '.exp-scaffold__resource-note', min: 14.9 },
              { selector: '.exp-scaffold__gate-flow p', min: 14.9 },
              { selector: '.exp-scaffold__checkpoint-reading p', min: 15.9 },
              { selector: '.exp-scaffold__provenance-note', min: 15.9 },
            ]) {
              const result = await computed(page, role.selector);
              expect(result.size, role.selector).toBeGreaterThanOrEqual(role.min);
            }
          }
          const tableWrap = page.locator('.exp-scaffold__table-wrap').first();
          await expect(tableWrap).toBeVisible();
          const scroll = await tableWrap.evaluate(el => ({
            width: el.clientWidth,
            fullWidth: el.scrollWidth,
            overflow: getComputedStyle(el).overflowX,
          }));
          expect(scroll.overflow).toMatch(/auto|scroll/);
          expect(scroll.width).toBeGreaterThan(100);
          if (width === 390) expect(scroll.fullWidth - scroll.width).toBeGreaterThanOrEqual(60);
          expect(await page.evaluate(() =>
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          )).toBeLessThanOrEqual(2);

          if (width === 390 && theme === 'light' && item.kind === 'checkpoint') {
            await page.locator('.exp-scaffold__gate-flow').screenshot({
              path: info.outputPath('checkpoint-gate-mobile.png'),
              animations: 'disabled',
              style: '.site-header,.research-module-nav-shell { visibility:hidden; }',
            });
          }
          if (width === 1440 && theme === 'dark' && item.kind === 'checkpoint') {
            await tableWrap.screenshot({
              path: info.outputPath('checkpoint-table-desktop.png'),
              animations: 'disabled',
              style: '.site-header,.research-module-nav-shell { visibility:hidden; }',
            });
          }
        });
    }
  }
}

test('old 10px explanation, 9px value and missing table scroll fail the same rendered gate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(cases[1].route, { waitUntil: 'domcontentloaded' });
  const root = page.locator('.exp-scaffold');
  for (const item of [
    { selector: '.exp-scaffold__term-list dd', px: 15.9, bad: '10px' },
    { selector: '.exp-scaffold__table-wrap tbody td', px: 14.9, bad: '9px' },
  ]) {
    const el = root.locator(item.selector).first();
    const readable = async () => el.evaluate((node, minimum) =>
      Number.parseFloat(getComputedStyle(node).fontSize) >= minimum, item.px);
    expect(await readable()).toBe(true);
    await el.evaluate((node, font) => { node.style.fontSize = font; }, item.bad);
    expect(await readable(), 'restored ' + item.bad + ' must be detected').toBe(false);
    await el.evaluate(node => { node.style.removeProperty('font-size'); });
    expect(await readable()).toBe(true);
  }
  const wrapper = root.locator('.exp-scaffold__table-wrap').first();
  const local = async () => wrapper.evaluate(node =>
    /auto|scroll/.test(getComputedStyle(node).overflowX));
  expect(await local()).toBe(true);
  await wrapper.evaluate(node => { node.style.overflowX = 'visible'; });
  expect(await local(), 'broken local table scrolling must be detected').toBe(false);
  await wrapper.evaluate(node => { node.style.removeProperty('overflow-x'); });
  expect(await local()).toBe(true);
});
