import { expect, test } from '@playwright/test';

// User-reported Figure 2 defect on the actual advisor report (desktop and phone),
// plus sibling Figure 1: check the rendered evidence, not only CSS source.
const route='/research/seed-openevo/study/parameter-memory-results/';
const checkpointScores=['3.71','6.43','0.69','6.62'] as const;

for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('Q01/Q03 paper figures: no tooltip/card or clipped value at '+width+' '+theme,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      const figures=page.locator('[data-report-figure="q01-horizon"],[data-report-figure="q03-custom-curve"]');
      await expect(figures).toHaveCount(2);
      const q01=figures.first();
      const q03=figures.last();
      for(const figure of [q01,q03]){
        await expect(figure).toBeVisible();
        await expect(figure).toHaveCSS('border-top-width','0px');
        await expect(figure).toHaveCSS('border-left-width','0px');
        await expect(figure).toHaveCSS('box-shadow','none');
        const x=await figure.evaluate(el=>({
          w:el.getBoundingClientRect().width,
          outer:document.documentElement.scrollWidth-document.documentElement.clientWidth
        }));
        expect(x.w).toBeLessThanOrEqual(width+1);
        expect(x.outer).toBeLessThanOrEqual(2);
      }
      for(const svg of await figures.locator('svg[role="img"]').all()){
        await expect(svg.locator('title')).toHaveCount(0);
        await expect(svg.locator('desc')).toHaveCount(1);
        const name=await svg.getAttribute('aria-label');
        expect(name?.length).toBeGreaterThanOrEqual(12);
      }
      const chart=width<=720?q03.locator('[data-q03-mobile-chart]'):q03.locator('[data-q03-desktop-chart]');
      await expect(chart).toBeVisible();
      const metrics=await chart.evaluate(svg=>{
        if(!(svg instanceof SVGSVGElement))return null;
        const first=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-score');
        const axis=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-axis-line');
        if(!first||!axis)return null;
        const bbox=first.getBBox();
        return {
          valueLeft:bbox.x,
          axisX:axis.getBBox().x,
          renderedTextSize:parseFloat(getComputedStyle(first).fontSize)*svg.getBoundingClientRect().width/svg.viewBox.baseVal.width
        };
      });
      expect(metrics).not.toBeNull();
      expect(metrics!.valueLeft).toBeGreaterThan(metrics!.axisX+2);
      expect(metrics!.renderedTextSize).toBeGreaterThanOrEqual(13);
      for(const score of checkpointScores)await expect(q03).toContainText(score);
      await expect(q03).toContainText('均没有完整成功的题目');
      const caption=q03.locator('figcaption');
      await expect(caption).toContainText('没有测量中间轮次');
      await expect(caption).toContainText('SEED 论文');
      await expect(caption.locator('a[href*="/pull/678"]')).toBeVisible();
      if(width<=720){
        const table=q03.locator('.advisor-viz__q03-phone-table');
        await expect(table).toBeVisible();
        await expect(table.locator('tbody tr')).toHaveCount(4);
        const sides=await table.locator('table').evaluate(el=>({
          top:getComputedStyle(el).borderTopWidth,
          bottom:getComputedStyle(el).borderBottomWidth,
          caption:getComputedStyle(el.querySelector('caption')!).captionSide
        }));
        expect(parseFloat(sides.top)).toBeGreaterThan(0);
        expect(parseFloat(sides.bottom)).toBeGreaterThan(0);
        expect(sides.caption).toBe('top');
      }
    });
  }
}

for(const width of [390,1440] as const){
  test('the original Q03 value collision is rejected at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(route,{waitUntil:'domcontentloaded'});
    const chart=page.locator(width===390?'[data-q03-mobile-chart]':'[data-q03-desktop-chart]');
    const measure=()=>chart.evaluate(svg=>{
      const text=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-score');
      const axis=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-axis-line');
      if(!text||!axis)return null;
      return {left:text.getBBox().x,axis:axis.getBBox().x};
    });
    const accepted=await measure();
    expect(accepted).not.toBeNull();
    expect(accepted!.left).toBeGreaterThan(accepted!.axis+2);
    // Reintroduce exactly the old A0 layout without changing source data.
    await chart.locator('.advisor-viz__q03-score').first().evaluate((node,x)=>node.setAttribute('x',String(x)),width===390?50:88);
    const original=await measure();
    expect(original).not.toBeNull();
    expect(original!.left).toBeLessThanOrEqual(original!.axis+2);
  });
}


for(const width of [390,1440] as const){
  test('sibling research scaling SVG retains accessible evidence without blocking hover tooltip at '+width,async({page})=>{
    await page.setViewportSize({width,height:900});
    const response=await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-scaling/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const figure=page.locator('figure.scaling-chart');
    const svg=figure.locator('svg[role="img"]');
    await expect(svg).toHaveAttribute('aria-label',/component.*更新/);
    await expect(svg.locator('title')).toHaveCount(0);
    await expect(svg.locator('desc')).toContainText('44.05');
    await expect(svg.locator('desc')).toContainText('969.17');
    await expect(figure.locator('figcaption')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

test('phone reader gets the result source before the preserved meeting RAW',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const finding=page.locator('[data-advisor-key-findings]');
  const evidence=finding.getByRole('link',{name:'查看 Q05、Q07 的详细证据'});
  const raw=page.locator('[data-meeting-provenance] a[href*="2026-09-22-meeting-transcript.raw.md"]');
  await expect(evidence).toBeVisible();
  await expect(raw).toHaveCount(1);
  await expect(raw).toContainText('会议原始逐字记录');
  const placement=await page.evaluate(()=>{
    const first=document.querySelector('[data-advisor-key-findings]');
    const source=document.querySelector('[data-meeting-provenance]');
    if(!first||!source)throw new Error('missing scientific finding or meeting provenance');
    return {finding:first.getBoundingClientRect().top,source:source.getBoundingClientRect().top,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  expect(placement.finding).toBeLessThan(844);
  expect(placement.source).toBeGreaterThan(placement.finding);
  expect(placement.overflow).toBeLessThanOrEqual(2);
});
