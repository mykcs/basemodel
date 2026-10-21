import { expect, test, type Page } from '@playwright/test';

/**
 * Exact rendered scientific four-arm report, not a CSS-string audit.
 * Research numbers, numeric variants and formulas are not rewritten.
 * A few compact codes are allowed to use the 12px plot/technical label role.
 */
const route = '/research/seed-openevo/study/results/four-arm-analysis/';
const rootSelector = '[data-testid="experiment-analysis-plan-four-arm"]';
const roles = [
  { selector: '.per-arm-grid p', minPx: 15.9, kind: 'arm scientific explanation' },
  { selector: '.per-arm-grid .arm-work', minPx: 15.9, kind: 'arm follow-up analysis' },
  { selector: '.reasoning-line li', minPx: 15.9, kind: 'evidence reasoning' },
  { selector: '.factor-matrix thead th', minPx: 14.9, kind: 'factor column heading' },
  { selector: '.factor-matrix small', minPx: 13.9, kind: 'factor explanation' },
  { selector: '.plan-table thead th', minPx: 14.9, kind: 'analysis table heading' },
  { selector: '.plan-table tbody td', minPx: 14.9, kind: 'analysis table value' },
  { selector: '.plan-table td span', minPx: 13.9, kind: 'scientific table explanation' },
  { selector: '.plan-table code', minPx: 11.9, kind: 'technical identifier', mono: true },
  { selector: '.per-arm-grid footer', minPx: 12.9, kind: 'scientific status metadata' },
  { selector: '.section-kicker', minPx: 12.9, kind: 'provenance metadata' },
] as const;

async function inspect(page: Page, selector: string) {
  const node = page.locator(rootSelector).locator(selector).first();
  await expect(node, 'missing ' + selector).toBeVisible();
  return node.evaluate(element => {
    const css = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      size: Number.parseFloat(css.fontSize),
      family: css.fontFamily,
      style: css.fontStyle,
      weight: css.fontWeight,
      leading: Number.parseFloat(css.lineHeight),
      width: rect.width,
      overflow: element.scrollWidth - element.clientWidth,
    };
  });
}

for (const width of [390, 768, 1024, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('four-arm scientific prose + tables at ' + width + 'px/' + theme, async ({page}, info) => {
      await page.setViewportSize({width, height: 900});
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      const response = await page.goto(route, {waitUntil: 'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      const root = page.locator(rootSelector);
      await expect(root).toBeVisible();

      for (const role of roles) {
        const style = await inspect(page, role.selector);
        expect(style.size, role.kind + ' size').toBeGreaterThanOrEqual(role.minPx);
        if ('mono' in role) {
          expect(style.family, role.kind).toMatch(/Mono|Consolas|Menlo/);
        } else {
          expect(style.family, role.kind).toMatch(/Inter|PingFang|system-ui/);
        }
        expect(style.style).toBe('normal');
        expect(style.width, role.kind).toBeGreaterThan(30);
        // Overflowing scientific tables scroll in their own container.
        if (!role.selector.includes('table') && !role.selector.includes('matrix')) {
          expect(style.overflow, role.kind + ' should not clip text').toBeLessThanOrEqual(2);
        }
        if (style.size >= 14) expect(style.leading).toBeGreaterThan(style.size * 1.25);
      }

      for (const name of ['.matrix-wrap', '.plan-table-wrap'] as const) {
        const wrap = root.locator(name).first();
        await expect(wrap).toBeVisible();
        const geometry = await wrap.evaluate(el => ({
          width: el.clientWidth,
          scroll: el.scrollWidth,
          overflow: getComputedStyle(el).overflowX,
        }));
        expect(geometry.overflow).toBe('auto');
        expect(geometry.width).toBeGreaterThan(200);
        if (width === 390 && name === '.plan-table-wrap') {
          expect(geometry.scroll).toBeGreaterThan(geometry.width + 40);
        }
      }
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, 'unexpected full-page horizontal scroll').toBeLessThanOrEqual(2);

      const columns = await root.locator('.reasoning-line ol').evaluate(el =>
        getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
      if (width <= 1024) expect(columns).toBe(1);
      else expect(columns).toBe(3);

      if (width === 390 || width === 1440) {
        const frame = root.locator(width === 390 ? '.per-arm-grid' : '.plan-section').first();
        await frame.screenshot({
          path: info.outputPath('four-arm-' + width + '-' + theme + '.png'),
          animations: 'disabled',
          style: '.site-header, .research-module-nav-shell, [data-site-header] { visibility: hidden; }',
        });
      }
    });
  }
}

test('old 10px prose, 9px table data and missing local scroll are rejected', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  for (const witness of [
    {selector:'.per-arm-grid p',minPx:15.9,bad:'10px'},
    {selector:'.plan-table tbody td',minPx:14.9,bad:'9px'},
  ]) {
    const node=page.locator(rootSelector).locator(witness.selector).first();
    const accepted=async()=>node.evaluate(el=>Number.parseFloat(getComputedStyle(el).fontSize))
      .then(n=>n>=witness.minPx);
    expect(await accepted()).toBe(true);
    await node.evaluate((el,bad)=>(el as HTMLElement).style.fontSize=bad,witness.bad);
    expect(await accepted(),'restored '+witness.bad+' must fail the real font gate').toBe(false);
    await node.evaluate(el=>(el as HTMLElement).style.removeProperty('font-size'));
    expect(await accepted()).toBe(true);
  }
  const wrap=page.locator(rootSelector+' .plan-table-wrap');
  const local=async()=>wrap.evaluate(el=>getComputedStyle(el).overflowX==='auto');
  expect(await local()).toBe(true);
  await wrap.evaluate(el=>(el as HTMLElement).style.overflowX='visible');
  expect(await local(),'a broken local table scroll must fail').toBe(false);
  await wrap.evaluate(el=>(el as HTMLElement).style.removeProperty('overflow-x'));
  expect(await local()).toBe(true);
});
