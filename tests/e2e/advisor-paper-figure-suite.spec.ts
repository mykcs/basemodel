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
    const q04Interval=page.locator('[data-paper-effect="q04-posthoc"]');
    await expect(q04Interval.locator('.paper-effect__comparison')).toContainText('压缩版 − 未压缩原模型');
    await expect(q04Interval.locator('.paper-effect__value').first()).toContainText('−0.87');
    await expect(q04Interval.locator('.paper-effect__interval').first()).toContainText('−3.91 至 +1.65');
    await expect(q04Interval.locator('.paper-effect__takeaway')).toContainText('不能确定压缩会稳定掉分');
    const frame=await q04Interval.evaluate(el=>{
      const css=getComputedStyle(el),box=el.getBoundingClientRect();
      const axisLabels=[...el.querySelectorAll('.paper-effect__axis span')].map(label=>label.getBoundingClientRect());
      return {width:css.borderTopWidth,side:css.borderLeftWidth,clipped:axisLabels.some(r=>r.left<box.left-1||r.right>box.right+1)};
    });
    expect(frame.width).toBe('1px');
    expect(frame.side).toBe('1px');
    expect(frame.clipped).toBe(false);
    await expect(q04Interval.locator('.paper-effect__directions span')).toHaveCount(2);
    const zeroAligned=await q04Interval.evaluate(el=>{
      const zero=el.querySelector('.paper-effect__zero')!.getBoundingClientRect();
      const tick=[...el.querySelectorAll('.paper-effect__axis span')].find(x=>x.textContent?.trim()==='0')!.getBoundingClientRect();
      return Math.abs((zero.left+zero.width/2)-(tick.left+tick.width/2));
    });
    expect(zeroAligned).toBeLessThan(2);
    const text=await page.locator('[data-q17-inline="q04"]').innerText();
    expect(text).toContain('训练后压缩');
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
    const detail=page.locator('[data-seed-gpu-explainer]');
    await expect(detail).not.toHaveAttribute('open','');
    await expect(detail.locator('summary')).toHaveText('工程细节，你可能感兴趣...');
    const flow=detail.locator('[data-seed-world4-flow]');
    await expect(flow).not.toBeVisible();
    await detail.locator('summary').click();
    await expect(detail).toContainText('工具叫 Ray');
    await expect(flow).toBeVisible();
    await expect(flow.locator('.q03-world4__trace > li')).toHaveCount(4);
    const style=await flow.evaluate(el=>({radius:getComputedStyle(el).borderRadius,bg:getComputedStyle(el).backgroundColor}));
    expect(style.radius).toBe('0px');
    expect(['transparent','rgba(0, 0, 0, 0)']).toContain(style.bg);
    await page.goto(method,{waitUntil:'domcontentloaded'});
    const lanes=page.locator('.advisor-method__lane');
    await expect(lanes).toHaveCount(3);
    expect(await lanes.first().locator('.advisor-method__node').first().evaluate(x=>getComputedStyle(x).borderRadius)).toBe('0px');
  });
}

for (const width of [390,768,1440]) for (const theme of ['light','dark']) {
  test('Q01 legend text meets contrast and rejects its old palette inheritance: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto(result,{waitUntil:'load'});
    const figure=page.locator('[data-report-figure="q01-horizon"]');
    const labels=figure.locator('.advisor-viz__q01-legend-item > span');
    await expect(labels).toHaveCount(3);
    const measure=()=>labels.evaluateAll(nodes=>{
      const rgb=(value:string)=>value.match(/[\d.]+/g)!.slice(0,3).map(Number);
      const lum=(values:number[])=>values.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      return nodes.map(node=>{
        let owner:Element|null=node;
        while(owner && ['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(owner).backgroundColor)) owner=owner.parentElement;
        if(!owner)throw Error('Missing actual legend background');
        const ink=lum(rgb(getComputedStyle(node).color)),paper=lum(rgb(getComputedStyle(owner).backgroundColor));
        return (Math.max(ink,paper)+.05)/(Math.min(ink,paper)+.05);
      });
    });
    for(const ratio of await measure())expect(ratio).toBeGreaterThanOrEqual(4.5);
    if(theme==='dark'){
      // Restore the exact old inherited series palette, on the real dark page.
      await labels.evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.color=getComputedStyle(node.parentElement!).color));
      const original=await measure();
      expect(original.some(ratio=>ratio<4.5)).toBe(true);
      expect(()=>original.forEach(ratio=>expect(ratio).toBeGreaterThanOrEqual(4.5))).toThrow();
      await labels.evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.removeProperty('color')));
      for(const ratio of await measure())expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
    for(const sample of await figure.locator('.advisor-viz__q01-legend-item > svg').all())
      await expect(sample).toHaveCSS('background-color','rgb(255, 255, 255)');
  });
}
