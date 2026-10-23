import { expect, test, type Page } from '@playwright/test';

/**
 * Historical Stage-2 research genealogy. Its narrative and experiment
 * diagnostics are readable scientific prose, not fixed-coordinate plot labels.
 * The scientific comparison table preserves every field without default horizontal drag.
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
  await expect(node, selector + ' not rendered').toBeAttached();
  const measured = await node.evaluate(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      concealedHeader:!!element.closest('thead')&&getComputedStyle(element.closest('thead')!).position==='absolute',
      fontPx: Number.parseFloat(style.fontSize),
      linePx: Number.parseFloat(style.lineHeight),
      family: style.fontFamily,
      italic: style.fontStyle,
      boxWidth: rect.width,
      contentOverflow: element.scrollWidth - element.clientWidth,
      text: element.textContent?.trim().slice(0, 80) ?? '',
    };
  });
  if(!measured.concealedHeader)await expect(node,selector+' remains painted').toBeVisible();
  return measured;
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
          if(role.selector.includes('thead'))expect(computed.concealedHeader,'native headers paint outside complete-record mode').toBe(width<=760);
          if(!computed.concealedHeader)expect(computed.boxWidth, role.role).toBeGreaterThan(40);
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
          headers:[...node.querySelectorAll('thead th')].map(cell=>cell.textContent?.replace(/\s+/g,' ').trim()),
          headerSpans:[...node.querySelectorAll<HTMLTableCellElement>('thead th')].map(cell=>[cell.rowSpan,cell.colSpan]),
          labels:[...node.querySelectorAll<HTMLTableCellElement>('tbody td')].map(cell=>({column:cell.cellIndex,expected:cell.dataset.paperLabel??'',actual:getComputedStyle(cell,'::before').content.replace(/^['"]|['"]$/g,''),size:parseFloat(getComputedStyle(cell,'::before').fontSize)})),
        }));
        expect(tableGeometry.width).toBeGreaterThan(160);
        expect(tableGeometry.fullTable).toBeLessThanOrEqual(tableGeometry.width+2);
        expect(tableGeometry.overflow).toBeLessThanOrEqual(2);
        const fields=['完整成功','非法动作提前结束','平均得分'];
        expect(tableGeometry.headers).toEqual(['模型','旧 256-window Stage 2','Ceiling-1.0',...fields,...fields]);
        expect(tableGeometry.headerSpans).toEqual([[2,1],[1,3],[1,3],...[...fields,...fields].map(()=>[1,1])]);
        const expectedColumns=['模型',...['旧 256-window Stage 2','Ceiling-1.0'].flatMap(group=>fields.map(field=>`${group} · ${field}`))];
        if(width<=760){expect(tableGeometry.labels.length).toBeGreaterThan(0);for(const label of tableGeometry.labels){expect(label.expected).toBe(expectedColumns[label.column]);expect(label.actual).toBe(expectedColumns[label.column]);expect(label.size).toBeGreaterThanOrEqual(15);}}
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
