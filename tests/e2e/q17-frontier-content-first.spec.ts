import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/';

test('focus result keeps the comparable result and scientific boundary in the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 633 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('同样 32 道题上，进入第 128 轮的模型比第 127 轮低 4.18 分，但还不能判定模型退步');
  await expect(page.locator('.result-hero > .eyebrow')).toContainText('局部诊断 · 2026-09-11');
  await expect(page.locator('.result-hero__method')).toContainText('第一阶段（Stage 1）先由 Qwen 做 WebShop 任务');
  await expect(page.locator('.result-hero__method')).toContainText('第二阶段（Stage 2）不再运行 OPSD');
  await expect(page.locator('.result-hero__method')).toContainText('DirectApply 表示候选参数通过共同的工程与数据检查后下一轮直接使用');
  await expect(page.locator('.result-hero__method')).toContainText('No-GDR 表示取消历史上那次 16 题新旧参数小测');
  await expect(page.locator('.result-hero__method')).toContainText('文字经验（Text Memory）');
  await expect(page.locator('.result-hero__boundary')).toContainText('95% 统计范围 −17.13 ～ +8.00');
  await expect(page.locator('.same-task-facts > div')).toHaveCount(3);
  const boundary = await page.locator('.result-hero__boundary').boundingBox();
  const facts = await page.locator('.same-task-facts').boundingBox();
  expect(boundary).not.toBeNull();
  expect(facts).not.toBeNull();
  expect(boundary!.y + boundary!.height).toBeLessThanOrEqual(633 + 3);
  expect(facts!.y - (boundary!.y + boundary!.height)).toBeLessThan(140);
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
