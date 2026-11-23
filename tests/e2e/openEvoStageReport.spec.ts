import { test, expect } from '@playwright/test';

const route = '/research/seed-openevo/study/parameter-memory-report/';

for (const width of [440, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('stage report: source-bound first read at '+width+'px '+theme, async ({page})=>{
      await page.setViewportSize({width, height: width===440?956:1000});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value), theme);
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('main.stage-report')).toBeVisible();
      await expect(page.locator('.stage-report__toc a')).toHaveCount(6);
      await expect(page.locator('.stage-report__lede')).toContainText('205.6 MB');
      await expect(page.locator('.stage-report__lede')).toContainText('51.4 MB');
      await expect(page.locator('.stage-report__status-table tbody tr')).toHaveCount(4);
      await expect(page.locator('.stage-report__bar-row')).toHaveCount(2);
      await expect(page.locator('[data-paper-effect="rank32-paired"]')).toContainText('区间包含 0');
      await expect(page.locator('.stage-report__boundary')).toContainText('都是固定容量方案');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      await page.locator('.stage-report__toc a[href="#outcome"]').click();
      await expect(page).toHaveURL(/#outcome$/);
      await expect(page.locator('#outcome h2')).toBeVisible();
      await expect(page.locator('.stage-report__reading a')).toHaveCount(3);
    });
  }
}

test('stage report remains readable without client JavaScript',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:440,height:956}});
  const page=await context.newPage();
  await page.goto(route);
  await expect(page.locator('.stage-report__lede')).toBeVisible();
  await expect(page.locator('[data-paper-effect="rank32-paired"]')).toBeVisible();
  await expect(page.locator('.stage-report__status-table')).toBeVisible();
  await context.close();
});
