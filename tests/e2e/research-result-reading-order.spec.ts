import { expect, test } from '@playwright/test';

const routes = [
  {
    id: 'q17',
    path: '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/',
    direct: '[data-result-stage="direct-result"]',
    later: '[data-result-stage="parameter-geometry"]',
    directText: '60.72 / 100',
    boundaryText: '不是同一套冻结题',
  },
  {
    id: '7b',
    path: '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/',
    direct: '[data-result-stage="direct-result"]',
    later: '[data-result-stage="parameter-process"]',
    directText: '参数学习',
    boundaryText: '参数变化不能替代新任务效果',
  },
  {
    id: 'four-arm',
    path: '/research/seed-openevo/study/results/four-arm-analysis/',
    direct: '[data-result-stage="direct-result"]',
    later: '[data-result-stage="mechanism"]',
    directText: '四组结果矩阵',
    boundaryText: '未运行',
  },
] as const;

for (const width of [390, 768, 1440]) {
  for (const route of routes) {
    test(`${route.id} keeps result-first order and page containment at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('h1')).toHaveCount(1);
      const direct = page.locator(route.direct).first();
      const later = page.locator(route.later).first();
      await expect(direct).toBeVisible();
      await expect(later).toBeVisible();
      await expect(direct).toContainText(route.directText);
      await expect(page.locator('body')).toContainText(route.boundaryText);

      const order = await page.evaluate(({ directSelector, laterSelector }) => {
        const directElement = document.querySelector(directSelector);
        const laterElement = document.querySelector(laterSelector);
        if (!directElement || !laterElement) return null;
        return Boolean(directElement.compareDocumentPosition(laterElement) & Node.DOCUMENT_POSITION_FOLLOWING);
      }, { directSelector: route.direct, laterSelector: route.later });
      expect(order, `${route.id}: direct result must precede deep diagnostics`).toBe(true);

      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, `${route.id}: page-level horizontal overflow at ${width}px`).toBe(false);
    });
  }
}
