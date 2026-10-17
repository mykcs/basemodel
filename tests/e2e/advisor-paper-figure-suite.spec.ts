import { expect, test } from '@playwright/test';

const result = '/research/seed-openevo/study/parameter-memory-results/';
const method = '/research/seed-openevo/study/openevo-methods/';

for (const width of [390,768,1440]) {
  test('advisor quantitative figures retain paper evidence at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(result,{waitUntil:'domcontentloaded'});
    const original=page.locator('[data-report-figure="q01-horizon"]');
    await expect(original).toHaveAttribute('data-paper-figure','true');
    const q01=width<=720 ? original.locator('.advisor-viz__q01-chart--phone') : original.locator('.advisor-viz__q01-chart--desktop');
    await expect(q01).toBeVisible();
    await expect(q01.locator('[data-q01-phone-line], [data-q01-line]')).toHaveCount(3);
    await expect(q01.locator('.advisor-viz__q01-point')).toHaveCount(33);
    await expect(original.locator('.advisor-viz__q01-legend-item')).toHaveCount(3);
    const q03=page.locator('[data-report-figure="q03-custom-curve"]');
    await expect(width<=720 ? q03.locator('[data-q03-mobile-chart]') : q03.locator('.advisor-viz__q03-chart--desktop')).toBeVisible();
    await expect(q03.locator('button')).toHaveCount(0);
    for(const [id,count] of [['q04-posthoc',2],['q07-zero-latest',2],['q08-old-queue',1],['q09-context',4],['rank32-paired',1],['q07-inversion',1]] as const){
      const plot=page.locator('[data-paper-effect="'+id+'"]');
      await expect(plot).toBeVisible();
      await expect(plot.locator('[data-effect-row]')).toHaveCount(count);
      await expect(plot.locator('.paper-effect__zero')).toHaveCount(count);
      await expect(plot.locator('.paper-effect__unit')).toContainText('95%');
    }
    const text=await page.locator('[data-q17-inline="q04"]').innerText();
    expect(text).toContain('后验压缩');
    await expect(page.locator('[data-q17-inline="q07"]')).toContainText('不是同一模型、同一干预');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

for(const width of [390,1440]){
  test('SEED engineering tables stay native booktabs and flows are printable at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(result,{waitUntil:'domcontentloaded'});
    const table=page.locator('[data-seed-eight-progress] .q03-world4__tablewrap');
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await expect(table.locator('thead th')).toHaveCount(4);
    const tableTags=await table.locator('table').evaluate((node)=>{
      const row=getComputedStyle(node.querySelector('tbody tr')!).display;
      const caption=getComputedStyle(node.querySelector('caption')!).captionSide;
      const xOverflow=document.documentElement.scrollWidth-document.documentElement.clientWidth;
      const localScroll=(node.parentElement!.scrollWidth > node.parentElement!.clientWidth);
      return {row,caption,xOverflow,localScroll};
    });
    expect(tableTags.row).toBe('table-row');
    expect(tableTags.caption).toBe('top');
    expect(tableTags.xOverflow).toBeLessThanOrEqual(2);
    if(width===390)expect(tableTags.localScroll).toBe(true);
    const flow=page.locator('[data-seed-world4-flow]');
    await expect(flow).toBeVisible();
    const style=await flow.evaluate(el=>({radius:getComputedStyle(el).borderRadius,bg:getComputedStyle(el).backgroundColor}));
    expect(style.radius).toBe('0px');
    expect(['transparent','rgba(0, 0, 0, 0)']).toContain(style.bg);
    await page.goto(method,{waitUntil:'domcontentloaded'});
    const lanes=page.locator('.advisor-method__lane');
    await expect(lanes).toHaveCount(3);
    expect(await lanes.first().locator('.advisor-method__node').first().evaluate(x=>getComputedStyle(x).borderRadius)).toBe('0px');
  });
}
