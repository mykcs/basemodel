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

const historicalArms = [
  { id: '3b-self', path: '/research/seed-openevo/study/results/3b-self-analysis/', answer: '1.71', boundary: '与 3B base 逐项一致' },
  { id: '7b-self', path: '/research/seed-openevo/study/results/7b-self-analysis/', answer: '13.33 升到 25.66', boundary: '只从 3 个增到 4 个' },
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
      if (route.id === 'four-arm') {
        const firstResultTop = await direct.evaluate((element) => element.getBoundingClientRect().top);
        expect(firstResultTop, 'four-arm result matrix must start in the first viewport').toBeLessThan(width === 390 ? 844 : 1000);
      }
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

for (const width of [390, 768, 1440]) {
  for (const route of historicalArms) {
    test(`${route.id} leads with the sealed result at ${width}px`, async ({ page }) => {
      const height = width === 390 ? 844 : 1000;
      await page.setViewportSize({ width, height });
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const lead = page.locator('.exp-scaffold__lead');
      await expect(lead).toContainText(route.answer);
      await expect(lead).toContainText(route.boundary);
      const box = await lead.boundingBox();
      expect(box && box.y + box.height, `${route.id}: direct answer must fit in the first viewport`).toBeLessThanOrEqual(height);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, `${route.id}: page-level horizontal overflow at ${width}px`).toBe(false);
    });
  }
}
