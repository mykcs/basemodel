import { expect, test } from '@playwright/test';

const url = '/research/seed-openevo/study/muon-update/';

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test('Muon research proposal at ' + width + 'px in ' + theme + ' theme', async ({ page }) => {
      await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.locator('html').evaluate((node, selected) => {
        node.setAttribute('data-theme', selected);
      }, theme);
      const report = page.locator('[data-muon-study]');
      await expect(report).toBeVisible();
      await expect(report.locator('h1')).toHaveText('Muon 思路与 OpenEVO 的参数更新方向');
      await expect(report.locator('[data-reader-purpose]')).toContainText('还没有完成');
      await expect(report.getByRole('table')).toHaveCount(3);
      await expect(report.locator('.muon-node')).toHaveCount(4);
      await expect(report.locator('svg.muon-arrow')).toHaveCount(3);
      await expect(report.locator('#pending')).toContainText('NOT RUN');
      await expect(report.locator('#difference')).toContainText('top-128');
      await expect(report.locator('#evidence')).toContainText('−10.06');
      await expect(report.locator('#evidence')).toContainText('−0.85');
      await expect(report.locator('a[href*="app.notion.com/p/3fbfedee"]')).toHaveCount(2);

      const sectionAnchors = await report.locator('.evo-article__toc a')
        .evaluateAll((links) => links.map((node) => node.getAttribute('href')));
      expect(sectionAnchors).toHaveLength(6);
      for (const anchor of sectionAnchors) {
        await expect(page.locator(anchor!)).toHaveCount(1);
      }
      const geometry = await page.evaluate(() => {
        const paper = document.querySelector('[data-muon-study]')!;
        const node = paper.querySelector('.muon-node')!;
        const html = document.documentElement;
        const paperStyle = getComputedStyle(paper);
        return {
          overflow: html.scrollWidth - html.clientWidth,
          paper: paperStyle.backgroundColor,
          ink: paperStyle.color,
          minNodeWidth: node.getBoundingClientRect().width,
        };
      });
      expect(geometry.overflow).toBeLessThanOrEqual(2);
      expect(geometry.paper).not.toBe('rgba(0, 0, 0, 0)');
      expect(geometry.ink).not.toBe(geometry.paper);
      expect(geometry.minNodeWidth).toBeGreaterThan(100);
    });
  }
}

test('Muon is a discoverable separate study, not an eleventh advisor question', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-secondary-route="muon-study"]')).toHaveAttribute('href', url);
  await page.goto('/research/seed-openevo/study/advisor-questions/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-research-question]')).toHaveCount(10);
  await page.goto('/research/seed-openevo/study/parameter-memory-results/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#direction a[href="' + url + '"]')).toHaveCount(1);
});
