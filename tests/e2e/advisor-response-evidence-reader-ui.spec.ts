import { expect, test } from '@playwright/test';

const results = '/research/seed-openevo/study/parameter-memory-results/';

for (const width of [390, 768, 1440]) {
  test('advisor response anchor index reads in Q order at '+width+'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(results);
    const nav = page.getByRole('navigation', { name: '快速定位十个实验回应' });
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    await expect(links).toHaveCount(10);
    const actual = await links.evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    expect(actual).toEqual(Array.from({ length: 10 }, (_, i) =>
      '#response-q' + String(i + 1).padStart(2, '0')));
    const sourceTitles = await page.locator('[data-experiment-response] h3').allTextContents();
    const navTitles = await nav.locator('.advisor-question-index__question').allTextContents();
    const navNumbers = await nav.locator('.advisor-question-index__number').allTextContents();
    expect(navTitles.map((title,i) => navNumbers[i]+' '+title)).toEqual(sourceTitles);

    await nav.locator('a[href="#response-q07"]').click();
    await expect(page).toHaveURL(/#response-q07$/);
    const target = page.locator('#response-q07');
    await expect(target).toBeInViewport({ ratio: 0.1 });
    // The latest reviewed article explicitly rejects a jump-target highlight bar.
    expect(await target.evaluate(el => getComputedStyle(el).borderInlineStartWidth)).toBe('0px');
    expect(await target.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

for (const width of [390, 1440]) {
  test('native evidence tables use the shared paper grammar at '+width+'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(results);
    const frozen = page.locator('#main-results .evo-article__tablewrap table').first();
    await expect(frozen.locator('caption')).toContainText('三个历史终点');
    await expect(frozen).toBeVisible();
    await expect(frozen.locator('tbody tr')).toHaveCount(3);
    await expect(frozen).toContainText('60.72');
    await expect(frozen).toContainText('45.98');
    await expect(frozen).toContainText('20.77');
    const styles = await frozen.evaluate(table => {
      const header = table.querySelector('thead th')!;
      const numeric = table.querySelector('[data-numeric]')!;
      const body = table.querySelector('tbody tr:nth-child(2) > *')!;
      return {
        topRule: parseFloat(getComputedStyle(table).borderTopWidth),
        headerRule: parseFloat(getComputedStyle(header).borderBottomWidth),
        nowrap: getComputedStyle(numeric).whiteSpace,
        borderLeft: getComputedStyle(body).borderLeftWidth,
      };
    });
    expect(styles.topRule).toBeGreaterThanOrEqual(1);
    expect(styles.headerRule).toBeGreaterThanOrEqual(1);
    expect(styles.nowrap).toBe('nowrap');
    expect(styles.borderLeft).toBe('0px');
    await expect(page.locator('#capacity table.research-booktabs')).toBeVisible();
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
