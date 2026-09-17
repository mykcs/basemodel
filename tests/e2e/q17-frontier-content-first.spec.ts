import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/';

test('focus result keeps the comparable result and scientific boundary in the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 633 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('同样 32 道题，暂时不能证明 R128 整体变差');
  await expect(page.locator('.result-hero > .eyebrow')).toContainText('局部诊断 · 2026-09-11');
  await expect(page.locator('.result-hero__boundary')).toContainText('95% 不确定范围是 −17.13 ～ +8.00，包含 0');
  await expect(page.locator('.diagnostic-summary')).toContainText('购物动作没有执行错误');
  await expect(page.locator('.diagnostic-summary')).toContainText('R128 的生成选择更集中');
  await expect(page.locator('.same-task-facts > div')).toHaveCount(3);
  const boundary = await page.locator('.result-hero__boundary').boundingBox();
  const summary = await page.locator('.diagnostic-summary').boundingBox();
  const facts = await page.locator('.same-task-facts').boundingBox();
  expect(boundary).not.toBeNull();
  expect(summary).not.toBeNull();
  expect(facts).not.toBeNull();
  expect(boundary!.y + boundary!.height).toBeLessThanOrEqual(633 + 3);
  expect(summary!.y + summary!.height).toBeLessThanOrEqual(633 + 3);
  expect(facts!.y).toBeGreaterThan(summary!.y + summary!.height - 3);
});

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme}: comparison stays readable without page overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('.table-wrap')).toBeVisible();
      await expect(page.locator('.table-wrap table tbody tr')).toHaveCount(6);
      if (viewport.width === 390) {
        const tableGeometry = await page.locator('.table-wrap').evaluate((node) => ({
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
        }));
        expect(tableGeometry.scrollWidth).toBeLessThanOrEqual(tableGeometry.clientWidth + 2);
        const r128Cells = await page.locator('.table-wrap tbody tr td:nth-child(3)').evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        }));
        for (const cell of r128Cells) {
          expect(cell.left).toBeGreaterThanOrEqual(0);
          expect(cell.right).toBeLessThanOrEqual(viewport.width + 1);
        }
      }
      await expect(page.locator('.evidence-links')).toContainText('数字摘要');
      await page.locator('.table-wrap').focus();
      await expect(page.locator('.table-wrap')).toBeFocused();
    });
  }
}
