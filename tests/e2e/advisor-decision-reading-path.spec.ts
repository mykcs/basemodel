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

test('real 390-by-844 first viewport retains scientific scope and next-decision status without scrolling',async({page})=>{
  // Independent screenshot cold-read previously missed approval state on mobile.
  // This is a GEOMETRY guard, not a replacement for independent reader comprehension.
  await page.setViewportSize({width:390,height:844});
  const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const lead=page.locator('[data-advisor-scientific-question]');
  await expect(lead).toContainText('Q10 新题');
  await expect(lead).toContainText('后续方案待确认');
  await expect(lead).toContainText('正式训练未据此启动');
  const q04=page.locator('[data-advisor-executive-evidence="q04"]');
  const q07=page.locator('[data-advisor-executive-evidence="q07"]');
  await expect(q04).toContainText('连续 8 轮');
  await expect(q07).toContainText('已经通过多重比较校正');
  for(const selector of [
    '[data-advisor-scientific-question]',
    '[data-advisor-key-findings]',
    '[data-advisor-critical-gaps]',
  ]){
    const box=await page.locator(selector).boundingBox();
    expect(box,selector).not.toBeNull();
    expect(box!.y,selector).toBeGreaterThanOrEqual(0);
    expect(box!.y+box!.height,selector).toBeLessThanOrEqual(844);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
