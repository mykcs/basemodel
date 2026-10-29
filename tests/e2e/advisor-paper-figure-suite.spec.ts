import { expect, test } from '@playwright/test';

const result = '/research/seed-openevo/study/parameter-memory-results/';
const method = '/research/seed-openevo/study/openevo-methods/';

for (const width of [390,768,1440]) {
  test('advisor quantitative figures retain paper evidence at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(result,{waitUntil:'domcontentloaded'});
    const original=page.locator('[data-report-figure="q01-horizon"]');
    await expect(original).toHaveAttribute('data-paper-figure','true');
    const pgf=original.locator('img[data-pgfplot="q01-three-way"]');
    await expect(pgf).toBeVisible();
    await expect(pgf).toHaveAttribute('loading','eager');
    await expect(pgf).toHaveAttribute('alt',/各 11 个实测保存点/);
    await expect(pgf).toHaveAttribute('src','/research/seed-openevo/figures/q01-three-way-pgfplots.svg');
    const selected=await pgf.evaluate(async img=>{
      if(!(img instanceof HTMLImageElement))return null;
      await img.decode();
      return {currentSrc:img.currentSrc,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight};
    });
    expect(selected).not.toBeNull();
    expect(selected!.naturalWidth).toBeGreaterThan(300);
    expect(selected!.naturalHeight).toBeGreaterThan(180);
    expect(selected!.currentSrc).toContain(width<=720?'q01-three-way-mobile-pgfplots.svg':'q01-three-way-pgfplots.svg');
    const q01Caption=original.locator('figcaption');
    const q01Detail=original.locator('[data-q01-raw-svg]');
    const layout=await original.evaluate(node=>{
      const graphic=node.querySelector('img[data-pgfplot="q01-three-way"]')!;
      const caption=node.querySelector('figcaption')!;
      const detail=node.querySelector('[data-q01-raw-svg]')!;
      return {imageBottom:graphic.getBoundingClientRect().bottom,captionTop:caption.getBoundingClientRect().top,
        captionBottom:caption.getBoundingClientRect().bottom,detailTop:detail.getBoundingClientRect().top};
    });
    expect(layout.captionTop).toBeGreaterThanOrEqual(layout.imageBottom-2);
    expect(layout.detailTop).toBeGreaterThanOrEqual(layout.captionBottom-2);
    await expect(q01Caption).toContainText('同一横轴刻度不是相同的训练计算量');
    await expect(q01Detail).not.toHaveAttribute('open','');
    const q01=width<=720 ? original.locator('.advisor-viz__q01-chart--phone') : original.locator('.advisor-viz__q01-chart--desktop');
    await expect(q01).toBeHidden();
    await q01Detail.locator('summary').click();
    await expect(q01).toBeVisible();
    await expect(q01.locator('[data-q01-phone-line], [data-q01-line]')).toHaveCount(3);
    await expect(q01.locator('.advisor-viz__q01-point')).toHaveCount(33);
    await expect(original.locator('.advisor-viz__q01-legend-item')).toHaveCount(3);
    await expect(page.locator('[data-q03-paper-table]')).toBeVisible();
    await page.locator('[data-q03-trend-details]').evaluate(el=>(el as HTMLDetailsElement).open=true);
    const q03=page.locator('[data-report-figure="q03-custom-curve"]');
    const plot=q03.locator('img[data-pgfplot="q03-stage2"]');
    await expect(plot).toBeVisible();
    await expect(plot).toHaveAttribute('src','/research/seed-openevo/figures/q03-stage2-pgfplots.svg');
    await expect(q03.locator('button')).toHaveCount(0);
    const q01Name=await q01.getAttribute('aria-label');
    expect(q01Name?.length).toBeGreaterThan(8);
    await expect(q01.locator('title')).toHaveCount(0);
    // Immutable outlined PGFPlots glyphs replace the retired inline SVG text.
    // Source/data/label placement hashes are verified before every build;
    // the native reading path has its own real glyph geometry/negative gate.
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
    expect(paper.caption).toBeLessThanOrEqual(paper.body);
    for(const [id,count] of [['q04-posthoc',2],['q07-zero-latest',2],['q08-old-queue',1],['q09-context',4],['rank32-paired',1],['q07-inversion',1]] as const){
      const plot=page.locator('[data-paper-effect="'+id+'"]');
      await expect(plot).toBeVisible();
      await expect(plot.locator('[data-effect-row]')).toHaveCount(count);
      const compiled=plot.locator('img[data-pgfplot="'+id+'"]');
      await expect(compiled).toBeVisible();
      await compiled.scrollIntoViewIfNeeded();
      const rendered=await compiled.evaluate(async image=>{
        const img=image as HTMLImageElement;
        await img.decode();
        return {width:img.naturalWidth,height:img.naturalHeight,currentSrc:img.currentSrc};
      });
      expect(rendered.width).toBeGreaterThan(200);
      expect(rendered.height).toBeGreaterThan(50);
      if(id==='q04-posthoc'||id==='q07-zero-latest'||id==='q09-context'){
        expect(rendered.currentSrc).toContain(width<=720?`${id}-mobile.svg`:`${id}.svg`);
      }
      await expect(plot.locator('.paper-effect__unit')).toContainText('95%');
    }
    const q04Interval=page.locator('[data-paper-effect="q04-posthoc"]');
    await expect(q04Interval.locator('.paper-effect__comparison')).toContainText('压缩版 − 未压缩原模型');
    await expect(q04Interval.locator('.paper-effect__value').first()).toContainText('−0.87');
    await expect(q04Interval.locator('.paper-effect__interval').first()).toContainText('−3.91 至 +1.65');
    await expect(q04Interval.locator('.paper-effect__takeaway')).toContainText('不能确定压缩会稳定掉分');
    const frame=await q04Interval.evaluate(el=>{
      const css=getComputedStyle(el),box=el.getBoundingClientRect();
      const image=el.querySelector('img[data-pgfplot]')!.getBoundingClientRect();
      return {width:css.borderTopWidth,side:css.borderLeftWidth,clipped:image.left<box.left-1||image.right>box.right+1};
    });
    expect(frame.width).toBe('1px');
    expect(frame.side).toBe('1px');
    expect(frame.clipped).toBe(false);
    await expect(q04Interval.locator('.paper-effect__directions span')).toHaveCount(2);
    await expect(q04Interval.locator('img[data-pgfplot="q04-posthoc"]')).toHaveAttribute('aria-describedby','advisor-q04-posthoc-caption');
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
    expect(tableTags.row).toBe(width === 390 ? 'grid' : 'table-row');
    await expect(table.locator('tbody tr').first()).toHaveAttribute('role', 'row');
    expect(await table.locator('tbody td').evaluateAll(cells => cells.every(cell => Boolean((cell as HTMLElement).dataset.paperLabel)))).toBe(true);
    expect(tableTags.caption).toBe('top');
    expect(tableTags.xOverflow).toBeLessThanOrEqual(2);
    expect(tableTags.localScroll).toBe(false);
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
      const lum=(values:number[])=>values.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i]!,0);
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
