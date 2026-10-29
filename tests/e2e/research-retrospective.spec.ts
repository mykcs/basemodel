import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/recent-challenges/';
for (const colorScheme of ['light', 'dark'] as const) {
  for (const viewport of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }]) {
    test(`research retrospective remains readable without scripts ${colorScheme} ${viewport.width}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport, colorScheme });
      const page = await context.newPage();
      expect((await page.goto(route))?.status()).toBe(200);
      const report = page.locator('[data-research-retrospective]');
      await expect(report.locator('h1')).toBeVisible();
      const lead = await report.locator('.intro .lead').boundingBox();
      expect(lead && lead.y + lead.height).toBeLessThan(viewport.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await expect(report.locator('#findings table')).toHaveCount(4);
      for (const table of await report.locator('#findings table').all()) {
        await table.scrollIntoViewIfNeeded();
        expect(await table.evaluate(el => [...el.querySelectorAll('th, td')].every(cell => {
          const box = cell.getBoundingClientRect();
          return box.left >= 0 && box.right <= innerWidth && box.width > 0;
        }))).toBe(true);
      }
      await report.locator('#inventory details summary').click();
      await expect(report.locator('.historical-records > li')).toHaveCount(60);
      expect(await report.locator('.historical-records > li').evaluateAll(rows => rows.filter(r => r.textContent?.includes('已封存结果')).length)).toBe(40);
      const sources = await report.locator('#findings a[href^="https://github.com/"]').evaluateAll(links => links.map(link => link.getAttribute('href')!));
      expect(sources.length).toBeGreaterThanOrEqual(3);
      expect(sources.every(url => /\/blob\/[a-f0-9]{40}\//.test(url))).toBe(true);
      // These boundaries prevent counting attempts as tasks, or a valid pilot as long-term confirmation.
      await expect(report.locator('#findings')).toContainText('192次尝试并非192道不同题');
      await expect(report.locator('#history')).toContainText('冻结的 128 题终评没有运行');
      await expect(report.locator('#ability')).toContainText(/导师接收意愿与招生指标分别通过何种正式程序/);
      await expect(report.locator('#ability')).toContainText('科研检验与招生决定不能相互替代');
      await expect(report.locator('#spoken')).toBeVisible();
      await context.close();
    });
  }
}
