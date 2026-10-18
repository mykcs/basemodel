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
        await expect(figure.locator('.paper-effect__zero')).toHaveCount(await figure.locator('[data-effect-row]').count());
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
        expect(Math.min(...wideWidths)).toBeGreaterThan(820);
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
      await expect(page.getByRole('table', { name: /表 3｜同一冻结 128 题/ })).toContainText('60.72');
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
  await expect(page.locator('[data-paper-effect="q07-inversion"] figcaption')).toContainText('图 9');
});
