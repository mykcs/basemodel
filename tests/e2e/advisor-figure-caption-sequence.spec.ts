import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/parameter-memory-results/';
const expectedFigures = Array.from({ length: 9 }, (_, index) => '图 ' + (index + 1) + '｜');
const expectedTables = Array.from({ length: 7 }, (_, index) => '表 ' + (index + 1) + '｜');
const supplemental = Array.from({ length: 6 }, (_, index) => '补充表 S' + (index + 1) + '｜');

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test('paper figure/table sequence is coherent at ' + width + 'px ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(nextTheme => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const article = page.locator('[data-evo-blog="results"]');
      // Eleven new method×metric tables own their own explanatory figcaptions.
      // Figure numbering still belongs to the nine actual scientific figures.
      const captions = (await article.locator('figure:not(.paper-table-figure) figcaption').allTextContents()).map(s => s.trim());
      expect(captions).toHaveLength(9);
      expect(captions.map(s => s.match(/^图\s*\d+｜/)?.[0])).toEqual(expectedFigures);
      const tables = (await article.locator('table caption').allTextContents()).map(s => s.trim());
      expect(tables.filter(s => /^表\s*\d+｜/.test(s)).map(s => s.match(/^表\s*\d+｜/)?.[0])).toEqual(expectedTables);
      expect(tables.filter(s => /^补充表 S\d+｜/.test(s)).map(s => s.match(/^补充表 S\d+｜/)?.[0])).toEqual(supplemental);

      await expect(article.locator('.q03-world4__hardware table tbody tr')).toHaveCount(2);
      await expect(article.locator('#main-results .evo-article__tablewrap table')).toHaveCount(2);
      await expect(article).toContainText('15.36 倍');
      await expect(article).toContainText('1.33 倍');
      // Genuine table-only comparison is not mislabeled as a separate figure.
      expect(await page.locator('[data-report-visual="q02-early-sft"]').evaluate(el => el.tagName)).toBe('DIV');
      expect(await page.locator('[data-report-figure="q04-capacity"]').evaluate(el => el.tagName)).toBe('DIV');

      // Existing model/panel boundaries remain in their associated figure captions.
      await expect(article.locator('[data-report-figure="q03-custom-curve"] figcaption')).toContainText('没有测量中间轮次');
      await expect(page.locator('[data-paper-effect="rank32-paired"] figcaption')).toContainText('1,024');
      await expect(page.locator('[data-paper-effect="q07-inversion"] figcaption')).toContainText('第 156 轮');
      await expect(page.locator('[data-paper-effect="q04-posthoc"] figcaption')).toContainText('训练后压缩');
      await expect(page.locator('[data-paper-effect="q09-context"] figcaption')).toContainText('完整关闭载体权限的因果消融仍未完成');
      await expect(article).toContainText('1,536 次完整任务尝试');
      await expect(article).toContainText('正式 Stage2 计划训练 160 轮，目前尚未开始');
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
}
