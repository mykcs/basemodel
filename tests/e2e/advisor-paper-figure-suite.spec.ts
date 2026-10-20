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
    // Regression for the owner's Q03 screenshot: paper figure, not a floating
    // tooltip/card; value labels stay clear of the y-axis on phone and desktop.
    const plot=width<=720 ? q03.locator('[data-q03-mobile-chart]') : q03.locator('[data-q03-desktop-chart]');
    await expect(plot).toHaveAttribute('aria-label',/四个.*保存点/);
    await expect(plot.locator('title')).toHaveCount(0);
    const q01Name=await q01.getAttribute('aria-label');
    expect(q01Name?.length).toBeGreaterThan(8);
    await expect(q01.locator('title')).toHaveCount(0);
    const geometry=await plot.evaluate(svg=>{
      const left=svg.querySelector('[data-trend-point="A0"] .advisor-viz__q03-score, [data-trend-point-phone="A0"] .advisor-viz__q03-score');
      const axis=svg.querySelector('.advisor-viz__q03-axis-line');
      if(!(left instanceof SVGGraphicsElement)||!(axis instanceof SVGGraphicsElement))return null;
      const label=left.getBBox();
      const origin=axis.getBBox().x;
      return {leftEdge:label.x,axisX:origin};
    });
    expect(geometry).not.toBeNull();
    expect(geometry!.leftEdge).toBeGreaterThan(geometry!.axisX+2);
    // SVG source font-size alone is not the reader-visible size: a 625px
    // viewBox squeezed to 384px makes its 13.5px labels render near 8px.
    const renderedScorePx=await plot.evaluate(svg=>{
      const label=svg.querySelector('.advisor-viz__q03-score');
      if(!(label instanceof SVGTextElement)||!(svg instanceof SVGSVGElement))return 0;
      return parseFloat(getComputedStyle(label).fontSize)
        * svg.getBoundingClientRect().width/svg.viewBox.baseVal.width;
    });
    expect(renderedScorePx).toBeGreaterThanOrEqual(11.5);
    const paper=await q03.evaluate(node=>{
      const root=document.querySelector('.evo-approved-reader');
      const caption=node.querySelector('figcaption');
      return {
        border:getComputedStyle(node).borderTopWidth,
        caption:caption?parseFloat(getComputedStyle(caption).fontSize):0,
        body:root?parseFloat(getComputedStyle(root).fontSize):0
      };
    });
    expect(paper.border).toBe('0px');
    expect(paper.caption).toBeGreaterThanOrEqual(13);
    expect(paper.caption).toBeLessThan(paper.body);
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
