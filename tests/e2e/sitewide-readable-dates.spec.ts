import {expect,test} from '@playwright/test';

const DATE_RE=/20\d\d 年 (?:[1-9]|1[0-2]) 月 (?:[1-9]|[12]\d|3[01]) 日/;
const pages=[
  '/data-status/',
  '/landscape/',
  '/models/',
  '/models/qwen3-1-7b/',
  '/families/',
  '/research/seed-openevo/study/parameter-memory-results/',
];

for(const width of [390,1440]){
  test('human dates stay canonical across static and hydrated pages at '+width+'px',async ({page})=>{
    await page.setViewportSize({width,height:900});
    for(const path of pages){
      const response=await page.goto(path,{waitUntil:'domcontentloaded'});
      expect(response?.status(),path).toBe(200);
      if(path==='/models/'){
        await expect(page.locator('#model-browser .model-grid .model-card').first()).toBeVisible();
        await expect(page.locator('[data-model-static-fallback]')).toBeHidden();
      }
      const result=await page.evaluate(()=>{
        const visible=document.body.innerText;
        const rawDates=[...visible.matchAll(/(?<![a-z0-9/-])20\d\d-\d\d-\d\d\b/g)].map(m=>m[0]).slice(0,5);
        const formattedDates=[...visible.matchAll(/20\d\d 年 (?:[1-9]|1[0-2]) 月 (?:[1-9]|[12]\d|3[01]) 日/g)].map(m=>m[0]).slice(0,5);
        return {rawDates,formattedDates,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      expect(result.rawDates,path).toEqual([]);
      expect(result.formattedDates.length,path).toBeGreaterThan(0);
      expect(result.overflow,path+' whole-page overflow').toBeLessThanOrEqual(2);
    }
    await page.goto('/models/qwen3-1-7b/',{waitUntil:'domcontentloaded'});
    const time=page.locator('time[datetime]').first();
    if(await time.count()){
      const original=await time.getAttribute('datetime');
      expect(original).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      await expect(time).toContainText(DATE_RE);
    }
  });
}
test('response article keeps 10 月 14 日 and unchanged source URLs',async ({page})=>{
  await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
  const q03=page.locator('#response-q03');
  await expect(q03).toContainText('10 月 14 日');
  await expect(q03).not.toContainText('十月十四日');
  await expect(page.locator('[data-seed-world4-case]')).toHaveAttribute('data-evidence-as-of','2026-10-16');
  await expect(page.locator('a[href*="PR704_WORLD4_OFFLINE_STAGE2_LIVE_20261014.md"]')).toHaveCount(1);
});
