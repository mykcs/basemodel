import { expect, test } from '@playwright/test';

for (const width of [390,1440] as const) {
  test('busy advisor can locate scoped evidence, missing experiments and next decision at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const overview=page.locator('[data-advisor-overview]');
    await expect(overview).toBeVisible();
    const purpose=overview.locator('[data-advisor-scientific-question]');
    await expect(purpose).toContainText('长期参数');
    const evidence=overview.locator('[data-advisor-executive-evidence]');
    await expect(evidence).toHaveCount(2);
    await expect(evidence.nth(0)).toContainText('205.6 MB');
    await expect(evidence.nth(0)).toContainText('51.4 MB');
    await expect(evidence.nth(0)).toContainText('95%');
    await expect(evidence.nth(1)).toContainText('10.06');
    await expect(evidence.nth(1)).toContainText('局部因果');
    const gaps=overview.locator('[data-advisor-executive-gap]');
    await expect(gaps).toHaveCount(2);
    await expect(gaps.nth(0)).toContainText('尚未完成');
    await expect(gaps.nth(1)).toContainText('仍未完成');
    await expect(overview.locator('[data-advisor-priorities]')).toContainText('建议');
    await expect(overview.locator('[data-advisor-priorities]')).toContainText('尚未据此启动');
    await expect(overview.locator('[data-overview-count="green"]')).toHaveText('2');
    await expect(overview.locator('[data-overview-count="yellow"]')).toHaveText('6');
    await expect(overview.locator('[data-overview-count="red"]')).toHaveText('2');
    // The full scientific evidence remains reachable, without duplicating the research body.
    await overview.locator('a[href="#response-q10"]').first().click();
    await expect(page).toHaveURL(/#response-q10$/);
    await expect(page.locator('#response-q10 [data-detail-brief="q10"]')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
