import { expect, test } from '@playwright/test';

const results = '/research/seed-openevo/study/parameter-memory-results/';
const narrow = ['rank32-paired', 'q07-inversion', 'q08-old-queue'];
const wide = ['q04-posthoc', 'q07-zero-latest', 'q09-context'];

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`research paper width tiers remain selective at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(results);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const compactWidths: number[] = [];
      const wideWidths: number[] = [];
      for (const id of narrow) {
        const figure = page.locator(`[data-paper-effect="${id}"]`);
        await expect(figure).toHaveAttribute('data-paper-width', 'single');
        await expect(figure).toHaveAttribute('data-paper-figure', 'interval');
        await expect(figure.locator('img[data-pgfplot]')).toHaveCount(1);
        compactWidths.push((await figure.boundingBox())!.width);
      }
      for (const id of wide) {
        const figure = page.locator(`[data-paper-effect="${id}"]`);
        await expect(figure).toHaveAttribute('data-paper-width', 'double');
        await expect(figure).toHaveAttribute('data-paper-figure', 'interval');
        wideWidths.push((await figure.boundingBox())!.width);
      }

      if (width === 1440) {
        expect(Math.max(...compactWidths)).toBeLessThan(650);
        // The owner-approved 620px reading column deliberately no longer allows
        // the older 820px full-bleed width. Keep meaningful single/double contrast.
        expect(Math.min(...wideWidths)).toBeGreaterThan(580);
        expect(Math.max(...wideWidths)).toBeLessThanOrEqual(625);
        expect(Math.min(...wideWidths) - Math.max(...compactWidths)).toBeGreaterThan(180);
        const tableWidth = (await page.locator('[data-report-visual="q02-early-sft"] table').boundingBox())!.width;
        expect(tableWidth).toBeLessThan(450);
      }
      // The page never becomes a two-column paper, and evidence stays inside the viewport.
      const documentOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(documentOverflow).toBeLessThanOrEqual(2);
      await expect(page.locator('[data-paper-effect="rank32-paired"] figcaption')).toContainText('1,024');
      await expect(page.locator('[data-paper-effect="q07-inversion"] figcaption')).toContainText('第 156 轮');
      await expect(page.locator('[data-paper-effect="q09-context"] figcaption')).toContainText('完整关闭载体权限');
      await expect(page.locator('[data-paper-effect="q09-context"] [data-effect-row]')).toHaveCount(4);
      // Historical 128-task measurements remain a three-row panel; the SEED
      // paper's independent 128-task results are a clearly separate reference.
      const finalTable = page.locator('#response-q05 [data-webshop-seed-paper-comparison]');
      await expect(finalTable).toHaveAccessibleName(/表 5｜历史三路线与 SEED 论文 WebShop 指标/);
      await expect(finalTable.locator('[data-score-origin="our-frozen-128"] tr')).toHaveCount(3);
      await expect(finalTable.locator('[data-score-origin="paper-reported-128"] tr')).toHaveCount(1);
      await expect(finalTable).toContainText('60.72');
      await expect(finalTable).toContainText('77.3%');
    });
  }
}

test('print keeps single-panel confidence plot compact and multiple-effect figure wide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ media: 'print' });
  await page.goto(results);
  const one = (await page.locator('[data-paper-effect="q07-inversion"]').boundingBox())!.width;
  const multi = (await page.locator('[data-paper-effect="q09-context"]').boundingBox())!.width;
  expect(multi).toBeGreaterThan(one + 180);
  await expect(page.locator('[data-paper-effect="q07-inversion"] figcaption')).toContainText('图 6');
});


/** A chart's existence and page overflow are insufficient: 390px compressed
 * Q17 axes formerly rendered at ~3.71/4.47 CSS pixels. Keep the native data,
 * preserve legible labels, and prove horizontal movement stays within figure. */
for (const { label, route, root, scoreSelector, lossSelector } of [
  {
    label: 'frontier',
    route: '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/',
    root: '.plateau-charts',
    scoreSelector: '.score-chart',
    lossSelector: '.loss-chart',
  },
  {
    label: 'analysis',
    route: '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/',
    root: '.q17-analysis__charts',
    scoreSelector: 'figure:first-child',
    lossSelector: 'figure:nth-child(2)',
  },
]) {
  for (const width of [390, 768]) for (const theme of ['light', 'dark'] as const) {
    test(`Q17 ${label} scientific axes stay readable and locally scrollable at ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(route, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      if (label === 'frontier') {
        // Historical Q17 roadmap intentionally starts collapsed; test the
        // reader's actual disclosure state rather than asserting hidden HTML
        // must be visible before its summary is opened.
        const disclosure = page.locator('.q17-roadmap-depth > details');
        await disclosure.locator('summary').click();
        await expect(disclosure).toHaveAttribute('open', '');
      }

      for (const selector of [scoreSelector, lossSelector]) {
        const figure = page.locator(root).locator(selector);
        const svg = figure.locator('svg');
        await expect(figure).toBeVisible();
        await expect(figure).toHaveAttribute('tabindex', '0');
        const measure = () => svg.evaluate(node => {
          const label = node.querySelector('text');
          if (!(label instanceof SVGGraphicsElement)) throw Error('Missing scientific axis label');
          const m = label.getScreenCTM();
          if (!m) throw Error('Axis has no rendering matrix');
          const figure = node.closest('figure')!;
          return {
            width: node.getBoundingClientRect().width,
            renderedFontPx: parseFloat(getComputedStyle(label).fontSize) * Math.hypot(m.a, m.b),
            figureClientWidth: figure.clientWidth,
            figureScrollWidth: figure.scrollWidth,
          };
        });
        const normal = await measure();
        expect(normal.renderedFontPx).toBeGreaterThanOrEqual(11.5);
        if (width === 390) {
          expect(normal.figureScrollWidth).toBeGreaterThan(normal.figureClientWidth + 50);
          await figure.evaluate(node => node.scrollTo({ left: node.scrollWidth, behavior: 'instant' }));
          expect(await figure.evaluate(node => node.scrollLeft)).toBeGreaterThan(50);

          // Negative control: replay the old phone shrink without hiding the
          // labels. The exact same geometric contract must turn red.
          await svg.evaluate(node => (node as SVGElement).style.minWidth = '0px');
          const old = await measure();
          expect(old.renderedFontPx).toBeLessThan(10);
          expect(() => expect(old.renderedFontPx).toBeGreaterThanOrEqual(11.5)).toThrow();
          await svg.evaluate(node => (node as SVGElement).style.removeProperty('min-width'));
          expect((await measure()).renderedFontPx).toBeGreaterThanOrEqual(11.5);
        }
      }
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
}
