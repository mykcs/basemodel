import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/osa-memory/';
for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`OSA report at ${width}px in ${theme}`, async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const article = page.locator('[data-osa-memory-report]');
      await expect(article.locator('h1')).toHaveText('OSA 正交化记忆在 OpenEVO 中的三轮探索');
      await expect(page.locator('body')).toHaveAttribute('data-reader-contract-id', 'study-osa-memory');
      await expect(article.locator('.evo-article__lede')).toBeInViewport();
      await expect(article.locator('.evo-article__lede')).toContainText('尚未证明能改善完整 Agent');
      const navigation = page.getByRole('navigation', { name: 'OpenEVO 研究文章' });
      await expect(navigation.locator('li').nth(1)).toContainText('学长十问');
      await expect(navigation.locator('li').nth(2)).toContainText('独立探索：OSA');
      await expect(navigation.locator('[aria-current="page"]')).toContainText('OSA');
      await expect(article.locator('table[data-osa-comparison]')).toHaveCount(3);
      await expect(article.locator('#ridge')).toContainText('19.02%');
      await expect(article.locator('#ridge')).toContainText('19.69%');
      await expect(article.locator('#ridge')).toContainText('不是独立测试集确认');
      await expect(article.locator('#catalog')).toContainText('不是同容量对照');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      for (const href of await article.locator('.evo-article__toc a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')))) {
        await expect(page.locator(href!)).toHaveCount(1);
      }
      const detail = article.locator('#ridge details');
      await detail.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(detail).toHaveAttribute('open', '');
      await expect(detail.locator('.katex')).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(detail).not.toHaveAttribute('open', '');
      const data = await page.request.get('/data/research/osa-memory-20261015.json');
      expect(data.ok()).toBe(true);
      expect((await data.json()).validation.cells).toBe(135);
    });
  }
}

test('advisor question page exposes the new report as the next independent entry', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/advisor-questions/');
  const nav = page.getByRole('navigation', { name: 'OpenEVO 研究文章' });
  await nav.getByRole('link', { name: /独立探索：OSA/ }).click();
  await expect(page).toHaveURL(new RegExp(route));
  await expect(page.locator('[data-osa-memory-report]')).toBeVisible();
});
