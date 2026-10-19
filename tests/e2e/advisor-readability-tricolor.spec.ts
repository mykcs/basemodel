import { expect, test } from '@playwright/test';

const statuses = [
  {tone:'green', label:'已有局部结论', ids:['q01','q07']},
  {tone:'yellow', label:'关键问题待验证', ids:['q02','q04','q05','q06','q08','q09']},
  {tone:'red', label:'核心验证未完成', ids:['q03','q10']},
] as const;

for(const {width,theme} of [
  {width:390,theme:'light'},
  {width:390,theme:'dark'},
  {width:1440,theme:'light'},
  {width:1440,theme:'dark'},
] as const) {
  test('advisor reads the same honest three-color scientific statuses in summary and detail at '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const palette=new Set<string>();
    for(const status of statuses){
      const overview=page.locator('[data-overview-status="'+status.tone+'"]');
      await expect(overview).toContainText(status.label);
      await expect(overview.locator('[data-overview-count="'+status.tone+'"]')).toHaveText(String(status.ids.length));
      for(const id of status.ids) {
        const summary=page.locator('[data-review-summary="'+id+'"]');
        const briefStatus=summary.locator('[data-brief-status="'+id+'"]');
        const details=page.locator('[data-experiment-response="'+id+'"]');
        const detailStatus=details.locator('[data-research-status="'+status.tone+'"]');
        await expect(briefStatus).toHaveText(status.label);
        await expect(detailStatus).toHaveText(status.label);
        await expect(summary.locator('[data-brief-answer="'+id+'"]')).not.toBeEmpty();
        await expect(summary.locator('[data-brief-done="'+id+'"]')).toContainText('已经做了：');
        await expect(summary.locator('[data-brief-missing="'+id+'"]')).toContainText('还差什么：');
        await expect(details.locator('[data-progress-stage="'+id+'"]')).toContainText('目前进度：');
        await expect(details.locator('[data-progress-gap="'+id+'"]')).toContainText('还差什么才能回答：');
        const render=await detailStatus.evaluate(node=>{
          const dot=node.querySelector('.evo-article__status-dot');
          if(!dot) return null;
          return {labelColor:getComputedStyle(node).color, dotColor:getComputedStyle(dot).backgroundColor};
        });
        expect(render).not.toBeNull();
        expect(render!.labelColor).toBe(render!.dotColor);
        palette.add(render!.dotColor);
      }
    }
    expect(palette.size).toBe(3);
    await expect(page.locator('[data-advisor-overview]')).toContainText('并非整项研究全部结束');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

test('previous all-grey status override is rejected while ordinary grey body metadata remains allowed',async({page})=>{
  const response=await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const renderedDots=()=>page.locator('#responses .evo-article__status-dot').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundColor));
  const before=await renderedDots();
  expect(new Set(before).size).toBe(3);
  const normalMetadata=await page.locator('.evo-article__lede').evaluate(node=>getComputedStyle(node).color);
  expect(normalMetadata).toBeTruthy();

  // Regression witness: this models the actual previous scoped CSS override.
  // The same visual oracle used above must reject it, without banning grey prose.
  await page.addStyleTag({content: '.evo-blog.evo-approved-reader[data-evo-blog="results"] .evo-article__status-dot {background:var(--paper-muted) !important;}'});
  const withOldBug=await renderedDots();
  expect(new Set(withOldBug).size).toBe(1);
  expect(withOldBug[0]).toBe(normalMetadata);
  expect(new Set(withOldBug).size===3).toBe(false);
});
