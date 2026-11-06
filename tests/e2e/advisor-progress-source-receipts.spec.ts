import { expect, test } from '@playwright/test';

for(const width of [390,1440]) {
 test('all ten scientific answer states link to their executable work estimates at '+width+'px',async({page})=>{
   await page.setViewportSize({width,height:900});
   const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
   expect(response?.status()).toBe(200);
   const sections=page.locator('#responses [data-experiment-response]');
   await expect(sections).toHaveCount(10);
   await expect(page.locator('#responses [data-research-status="green"]')).toHaveCount(2);
   await expect(page.locator('#responses [data-research-status="yellow"]')).toHaveCount(6);
   await expect(page.locator('#responses [data-research-status="red"]')).toHaveCount(2);
   for(let i=1;i<=10;i++){
      const id='q'+String(i).padStart(2,'0');
      const section=page.locator('#response-'+id);
      const next=section.locator('[data-next-work="'+id+'"]');
      await expect(next).toBeVisible();
      await expect(next).toContainText('工作量粗估');
      const link=next.locator('[data-question-plan-source="'+id+'"]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href',/^https:\/\/github\.com\/mykcs\/openevo-experiment\//);
   }
   await expect(page.locator('#response-q02 [data-next-work="q02"]')).toContainText('计划的 6 组训练均已通过检查');
   await expect(page.locator('#response-q05 [data-next-work="q05"]')).toContainText('1,280 次评估');
   await expect(page.locator('#response-q09 [data-next-work="q09"]')).toContainText('40,960 次训练任务');
   await expect(page.locator('#response-q10 [data-next-work="q10"]')).toContainText('192次开发评测');
   await expect(page.locator('#response-q02 [data-experiment-finding="q02"]')).toContainText('SFT 和 OPSD 各有 3 组完成并通过检查');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(2);
 });
}
