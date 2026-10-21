import { expect, test, type Page } from '@playwright/test';

/**
 * Historical Stage-2 research genealogy. Its narrative and experiment
 * diagnostics are readable scientific prose, not fixed-coordinate plot labels.
 * The single scientific comparison table must scroll in its own wrapper.
 */
const route = '/research/seed-openevo/study/capability-exploration/stage2-256-window/';
const rootSelector = '[data-testid="legacy-stage2-research-journey"]';
const roles = [
  { selector: '.legacy-journey__intro > span', role: 'introduction', min: 15.9 },
  { selector: '.legacy-journey__timeline li .legacy-journey__copy p', role: 'timeline explanation', min: 15.9 },
  { selector: '.legacy-journey__copy strong', role: 'timeline conclusion', min: 15.9 },
  { selector: '.legacy-journey__number-note p', role: 'number caveat', min: 15.9 },
  { selector: '.legacy-journey__boundary', role: 'causal boundary', min: 15.9 },
  { selector: '.legacy-journey__diag-grid dd', role: 'intervention/observation/meaning', min: 15.9 },
  { selector: '.legacy-journey__next strong', role: 'continuation summary', min: 15.9 },
  { selector: '.legacy-journey__timeline h3', role: 'timeline heading', min: 16.9 },
  { selector: '.legacy-journey__diag-grid h3', role: 'diagnostic heading', min: 16.9 },
  { selector: '.legacy-journey__table-wrap tbody td', role: 'scientific number', min: 14.5 },
  { selector: '.legacy-journey__table-wrap thead th', role: 'scientific column name', min: 14.5 },
  { selector: '.legacy-journey__copy a', role: 'source link', min: 12.5 },
  { selector: '.legacy-journey__index small', role: 'short timeline provenance', min: 12.5 },
] as const;

async function inspectRole(page: Page, selector: string) {
  const node = page.locator(rootSelector).locator(selector).first();
  await expect(node, selector + ' not rendered').toBeVisible();
  return node.evaluate(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      fontPx: Number.parseFloat(style.fontSize),
      linePx: Number.parseFloat(style.lineHeight),
      family: style.fontFamily,
      italic: style.fontStyle,
      boxWidth: rect.width,
      contentOverflow: element.scrollWidth - element.clientWidth,
      text: element.textContent?.trim().slice(0, 80) ?? '',
    };
  });
}

for (const width of [390, 768, 1024, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('historical Stage-2 prose and comparison table at ' + width + 'px / ' + theme,
      async ({ page }, info) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
        const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await page.evaluate(() => document.fonts.ready);
        const owner = page.locator(rootSelector);
        await expect(owner).toBeVisible();
        for (const role of roles) {
          const computed = await inspectRole(page, role.selector);
          expect(computed.fontPx, role.role + ': ' + computed.text).toBeGreaterThanOrEqual(role.min);
          expect(computed.family, role.role).toMatch(/Inter|PingFang|system-ui/);
          expect(computed.italic, role.role).toBe('normal');
          expect(computed.boxWidth, role.role).toBeGreaterThan(40);
          if (!role.selector.includes('table-wrap')) {
            expect(computed.contentOverflow, role.role).toBeLessThanOrEqual(2);
          }
        }
        const wrapper = owner.locator('.legacy-journey__table-wrap');
        const table = wrapper.locator('table');
        const tableGeometry = await wrapper.evaluate(node => ({
          overflow: node.scrollWidth - node.clientWidth,
          width: node.clientWidth,
          fullTable: node.querySelector('table')!.getBoundingClientRect().width,
        }));
        expect(tableGeometry.width).toBeGreaterThan(160);
        expect(tableGeometry.fullTable).toBeGreaterThanOrEqual(950);
        if (width <= 768) expect(tableGeometry.overflow).toBeGreaterThan(90);
        expect(await table.locator('tbody tr').count()).toBeGreaterThanOrEqual(2);
        expect(await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )).toBeLessThanOrEqual(2);

        if (width === 390 || width === 1440) {
          const frame = width === 390 ? owner.locator('.legacy-journey__timeline')
            : owner.locator('.legacy-journey__compare');
          await frame.screenshot({
            path: info.outputPath('stage2-genealogy-' + width + '-' + theme + '.png'),
            animations: 'disabled',
            // Screenshot-only: the sticky global header can overlay scrolled elements.
            style: '.site-header, .research-module-nav-shell, [data-site-header] { visibility: hidden; }',
          });
        }
      });
  }
}

test('the real computed-style gate detects restored 10px prose and a 9px scientific table', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  for (const item of [
    { selector: '.legacy-journey__timeline p', minimum: 15.9, bad: '10px' },
    { selector: '.legacy-journey__table-wrap tbody td', minimum: 14.5, bad: '9px' },
  ]) {
    const el = page.locator(rootSelector).locator(item.selector).first();
    const accepted = async () => el.evaluate(node =>
      Number.parseFloat(getComputedStyle(node).fontSize),
    ).then(value => value >= item.minimum);
    expect(await accepted()).toBe(true);
    await el.evaluate((node, size) => { node.style.fontSize = size; }, item.bad);
    expect(await accepted(), 'injected ' + item.bad + ' must fail the same size invariant').toBe(false);
    await el.evaluate(node => { node.style.removeProperty('font-size'); });
    expect(await accepted()).toBe(true);
  }
});
