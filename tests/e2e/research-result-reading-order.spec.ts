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


// One shared source renders four historical arms. A reader must see each
// measured (or explicitly absent) endpoint before the mechanism glossary.
const historicalReports = [
  { id: '3b-self', result: /1\.71/ },
  { id: '7b-self', result: /25\.66/ },
  { id: '3b-minimax', result: /未运行|Not run/ },
  { id: '7b-minimax', result: /16\.94/ },
] as const;

// These historical reports are published under the Chinese study routes;
// there is no physical /en/study/... page in the current static build.
const locale = '';
{
  for (const width of [390, 1440]) {
    for (const arm of historicalReports) {
      test(`historical ${arm.id} shows the real endpoint before its old training gate (${locale || 'zh'}, ${width}px)`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
        await page.goto(`${locale}/research/seed-openevo/study/results/${arm.id}-analysis/`, { waitUntil: 'domcontentloaded' });

        const direct = page.locator('[data-result-stage="direct-result"]').first();
        const mechanism = page.locator('[data-result-stage="mechanism"]').first();
        await expect(direct).toBeVisible();
        await expect(mechanism).toBeVisible();
        await expect(direct).toContainText(arm.result);
        const findings = page.locator('section[aria-labelledby="known-title"]').first();
        await expect(findings).toBeVisible();
        await expect(page.getByText('最终解释先留空', { exact: false })).toHaveCount(0);

        const resultBeforeFindings = await direct.evaluate((el, selector) => {
          const next = document.querySelector(selector);
          return next ? Boolean(el.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
        }, 'section[aria-labelledby="known-title"]');
        expect(resultBeforeFindings).toBe(true);
        const findingsBeforeMechanism = await findings.evaluate((el, selector) => {
          const next = document.querySelector(selector);
          return next ? Boolean(el.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
        }, '[data-result-stage="mechanism"]');
        expect(findingsBeforeMechanism).toBe(true);
        await expect(page.locator('.exp-scaffold__terms-disclosure > summary')).toBeVisible();

        const isEarlier = await direct.evaluate((el, other) => {
          const next = document.querySelector(other);
          return next ? Boolean(el.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
        }, '[data-result-stage="mechanism"]');
        expect(isEarlier).toBe(true);

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
      });
    }

    test(`historical 4-arm comparison uses method rows, shared score units and an honest explanation (${locale || 'zh'}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(`${locale}/research/seed-openevo/study/results/four-arm-analysis/`, { waitUntil: 'domcontentloaded' });
      const comparison = page.locator('[data-historical-arm-comparison] table');
      await expect(comparison.locator('tbody tr')).toHaveCount(4);
      await expect(comparison.locator('thead')).toContainText('Task Score');
      await expect(comparison.locator('caption')).toContainText('0–100');
      await expect(comparison.locator('tbody tr').nth(0)).toContainText('3B / self');
      await expect(comparison.locator('tbody tr').nth(1)).toContainText('25.66');
      await expect(comparison.locator('tbody tr').nth(2)).toContainText(/未运行|Not run/);
      await expect(page.locator('[data-reader-gap-explanation]')).toContainText(/−8\.72/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    });
  }
}
