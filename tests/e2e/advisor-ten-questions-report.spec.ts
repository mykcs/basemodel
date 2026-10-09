import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/advisor-questions/';

for (const width of [390, 768, 1440]) {
  test('advisor Q01-Q10 report remains readable at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-advisor-ten-questions]')).toBeVisible();
    await expect(page.locator('.advisor-ten__lede')).toBeVisible();
    await expect(page.locator('[data-report-question]')).toHaveCount(10);
    await expect(page.locator('[data-report-question="q01"]')).toContainText('120');
    await expect(page.locator('[data-report-question="q07"]')).toContainText('10.06');
    await expect(page.locator('[data-report-question="q08"]')).toContainText('960');
    await expect(page.locator('[data-report-question="q10"]')).toContainText('独立');
    await expect(page.locator('a[href^="https://github.com/mykcs/openevo-experiment/"]').first()).toBeVisible();

    const scoreTable = page.locator('[data-report-figure="q03-custom-curve"]');
    await expect(scoreTable.locator('tbody tr')).toHaveCount(4);
    await expect(scoreTable).toContainText('3.71');
    await expect(scoreTable).toContainText('6.43');
    await expect(scoreTable).toContainText('0.69');
    await expect(scoreTable).toContainText('6.62');
    await expect(page.locator('[data-comparison-boundary="noncomparable"]')).toContainText('87.10 / 100');
    await expect(page.locator('[data-comparison-boundary="noncomparable"]')).toContainText('未测');

    const scoreExample = page.locator('[data-report-figure="q05-same-final"] table');
    await expect(scoreExample.locator('tbody tr')).toHaveCount(3);
    await expect(scoreExample).toContainText('20.77');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflow, 'no page-level horizontal overflow').toBe(false);
  });
}

test('each topic remains navigable, static and source-linked', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('.advisor-ten__contents a').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  );
  expect(hrefs).toEqual(Array.from({ length: 10 }, (_, i) => '#q' + String(i + 1).padStart(2, '0')));

  for (let i = 1; i <= 10; i++) {
    const id = 'q' + String(i).padStart(2, '0');
    const article = page.locator('[data-report-question="' + id + '"]');
    await expect(article.locator('[data-report-finding]')).toBeVisible();
    await expect(article.locator('.advisor-ten__limit')).toBeVisible();
    await expect(article.locator('.advisor-ten__sources a').first()).toHaveAttribute('href', /github.com\/mykcs/);
  }

  const visible = await page.evaluate(() => {
    const node = document.querySelector('[data-report-question="q03"]');
    return node?.textContent?.includes('不能直接排名') ?? false;
  });
  expect(visible).toBe(true);
});
