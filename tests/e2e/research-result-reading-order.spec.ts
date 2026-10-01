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
  { id: '3b-minimax', path: '/research/seed-openevo/study/results/3b-minimax-analysis/', answer: '74.58% 时停止', boundary: 'final eval 未运行' },
  { id: '7b-minimax', path: '/research/seed-openevo/study/results/7b-minimax-analysis/', answer: '16.94、0/128、116/128', boundary: '任务结束后分析轨迹' },
] as const;

const resultNotes = [
  { id: 'why-it-kept-failing', answer: '接近 0' },
  { id: 'first-positive-transfer', answer: '+0.124' },
  { id: 'independent-replication', answer: '740 次科学有效' },
  { id: 'second-generation', answer: '132 条轨迹' },
  { id: 'measurement-boundary', answer: 'MV4：测量已验证' },
  { id: 'current-conclusion', answer: '可复现收益' },
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
  for (const note of resultNotes) {
    test(`${note.id} starts with result evidence before series navigation at ${width}px`, async ({ page }) => {
      const height = width === 390 ? 844 : 1000;
      await page.setViewportSize({ width, height });
      await page.goto(`/research/seed-openevo/study/results/${note.id}/`, { waitUntil: 'domcontentloaded' });
      const summary = page.locator('.note-hero .dek');
      await expect(summary).toBeVisible();
      const summaryBox = await summary.boundingBox();
      expect(summaryBox && summaryBox.y + summaryBox.height, `${note.id}: direct answer must fit in the first viewport`).toBeLessThanOrEqual(height);
      const firstSection = page.locator('.note-body section').first();
      await expect(firstSection).toContainText(note.answer);
      const sectionTop = await firstSection.evaluate((element) => element.getBoundingClientRect().top);
      expect(sectionTop, `${note.id}: direct result must precede the series navigation`).toBeLessThan(height);
      const navOrder = await page.locator('.note-body').evaluate((body, selector) => {
        const nav = document.querySelector(selector as string);
        return Boolean(nav && body.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING);
      }, '.series-nav');
      expect(navOrder, `${note.id}: navigation must follow the result content`).toBe(true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, `${note.id}: page-level horizontal overflow at ${width}px`).toBe(false);
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
