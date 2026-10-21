import { expect, test } from '@playwright/test';
import { captureFigureEvidence } from './figure-evidence';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const sourceSha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
test.beforeAll(()=>{
  if(process.env.FIGURE_SOURCE_SHA) expect(sourceSha).toBe(process.env.FIGURE_SOURCE_SHA);
});

// User-reported Figure 2 defect on the actual advisor report (desktop and phone),
// plus sibling Figure 1: check the rendered evidence, not only CSS source.
const route='/research/seed-openevo/study/parameter-memory-results/';
const checkpointScores=['3.71','6.43','0.69','6.62'] as const;

for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('Q03 default ICLR booktabs table and optional paper figure at '+width+' '+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      const q01=page.locator('[data-report-figure="q01-horizon"]');
      const q03Paper=page.locator('[data-q03-report-paper]');
      const table=q03Paper.locator('table[data-q03-paper-table]');
      const disclosure=q03Paper.locator('[data-q03-trend-details]');
      const q03=q03Paper.locator('[data-report-figure="q03-custom-curve"]');
      await expect(q01).toBeVisible();
      await expect(q01).toHaveCSS('border-top-width','0px');
      await expect(q03Paper).toBeVisible();
      await expect(table).toBeVisible();
      await expect(table.locator('thead th')).toHaveCount(3);
      await expect(table.locator('thead th').first()).toHaveText('保存点');
      await expect(table.locator('tbody tr')).toHaveCount(4);
      await expect(disclosure).not.toHaveAttribute('open','');
      await expect(q03).toBeHidden();
      await expect(q03Paper.locator('.advisor-viz__heading')).toHaveCount(0);
      await expect(table.locator('caption')).toContainText('表 S2｜四个 Stage2 保存点');
      await expect(q03Paper.locator('.advisor-q03-paper__reading')).toContainText('均没有完整成功的题目');
      await expect(q03Paper.locator('.advisor-q03-paper__reading')).toContainText('没有测量中间轮次');
      await expect(q03Paper.locator('.advisor-q03-paper__boundary')).toContainText('SEED 论文');
      await expect(q03Paper.locator('.advisor-q03-paper__boundary a[href*="/pull/678"]')).toBeVisible();
      const rows=await table.locator('tbody tr').evaluateAll(nodes=>nodes.map(row=>
        [...row.querySelectorAll('th,td')].map(cell=>cell.textContent?.trim())
      ));
      expect(rows).toEqual([
        ['A0','3.71','0'],['A40','6.43','0'],['A80','0.69','0'],['A120','6.62','0']
      ]);
      const tableMetrics=await table.evaluate(el=>{
        const css=getComputedStyle(el);
        const caption=el.querySelector('caption')!;
        const header=el.querySelector('thead th')!;
        const row2=el.querySelector('tbody tr:nth-child(2) td')!;
        const numeric=el.querySelector('tbody tr td[data-numeric]')!;
        const outer=el.closest('[data-q03-report-paper]')!.getBoundingClientRect();
        const wrap=el.closest('.research-booktabs-wrap')!.getBoundingClientRect();
        const root=document.documentElement;
        return {
          tableWidth:el.getBoundingClientRect().width,
          rowHeight:el.querySelector('tbody tr')!.getBoundingClientRect().height,
          headerWeight:getComputedStyle(header).fontWeight,
          captionWidth:caption.getBoundingClientRect().width,
          captionCenteredBy:Math.abs((caption.getBoundingClientRect().left+caption.getBoundingClientRect().right)/2-(outer.left+outer.right)/2),
          wrapWidth:wrap.width,
          columnWidth:outer.width,
          centeredBy:Math.abs((wrap.left+wrap.right)/2-(outer.left+outer.right)/2),
          captionSide:getComputedStyle(caption).captionSide,
          captionBeforeHeader:caption.getBoundingClientRect().bottom<=header.getBoundingClientRect().top+1,
          fontFamily:css.fontFamily,
          tableFontSize:parseFloat(css.fontSize),
          topBorder:parseFloat(css.borderTopWidth),
          bottomBorder:parseFloat(css.borderBottomWidth),
          headerRule:parseFloat(getComputedStyle(header).borderBottomWidth),
          bodyRowRule:parseFloat(getComputedStyle(row2).borderTopWidth),
          verticalRule:parseFloat(getComputedStyle(numeric).borderRightWidth),
          numericAlign:getComputedStyle(numeric).textAlign,
          numericFontVariant:getComputedStyle(numeric).fontVariantNumeric,
          pageOverflow:root.scrollWidth-root.clientWidth,
        };
      });
      expect(tableMetrics.columnWidth).toBeLessThanOrEqual(514);
      expect(tableMetrics.centeredBy).toBeLessThanOrEqual(3);
      expect(tableMetrics.wrapWidth).toBeLessThanOrEqual(tableMetrics.columnWidth+1);
      // Four-row paper tables should fit the phone reading column without hiding headings.
      expect(tableMetrics.tableWidth).toBeLessThanOrEqual(tableMetrics.wrapWidth+1);
      expect(tableMetrics.captionSide).toBe('top');
      expect(tableMetrics.captionBeforeHeader).toBe(true);
      expect(tableMetrics.fontFamily).toContain('Times New Roman');
      expect(tableMetrics.tableFontSize).toBeGreaterThanOrEqual(16);
      // A four-row LaTeX booktabs table is typeset compactly, not as dashboard rows.
      expect(tableMetrics.rowHeight).toBeLessThanOrEqual(31);
      expect(tableMetrics.headerWeight).toBe('400');
      // The genuine table caption must stay centered above a compact natural-width tabular.
      expect(tableMetrics.tableWidth).toBeLessThanOrEqual(345);
      expect(tableMetrics.captionWidth).toBeLessThanOrEqual(tableMetrics.tableWidth+1);
      expect(tableMetrics.captionCenteredBy).toBeLessThanOrEqual(3);
      expect(tableMetrics.topBorder).toBeGreaterThanOrEqual(1.3);
      expect(tableMetrics.bottomBorder).toBeGreaterThanOrEqual(1.3);
      expect(tableMetrics.headerRule).toBeGreaterThanOrEqual(.8);
      expect(tableMetrics.bodyRowRule).toBe(0);
      expect(tableMetrics.verticalRule).toBe(0);
      expect(tableMetrics.numericAlign).toBe('right');
      expect(tableMetrics.numericFontVariant).toContain('tabular-nums');
      expect(tableMetrics.pageOverflow).toBeLessThanOrEqual(2);
      // Default screenshot is the actual LaTeX-style table, not the old SVG plot.
      await captureFigureEvidence(q03Paper,testInfo.outputPath('q03-paper-'+width+'-'+theme+'.png'));
      if(width!==768) await captureFigureEvidence(q01,testInfo.outputPath('q01-paper-'+width+'-'+theme+'.png'));
      await disclosure.evaluate(el=>(el as HTMLDetailsElement).open=true);
      await expect(q03).toBeVisible();
      await expect(q03).toHaveCSS('border-top-width','0px');
      await expect(q03).toHaveCSS('box-shadow','none');
      const chart=width<=720?q03.locator('[data-q03-mobile-chart]'):q03.locator('[data-q03-desktop-chart]');
      await expect(chart).toBeVisible();
      for(const svg of await q03.locator('svg[role="img"]').all()){
        await expect(svg.locator('title')).toHaveCount(0);
        await expect(svg.locator('desc')).toHaveCount(1);
      }
      const plotMetrics=await chart.evaluate(svg=>{
        if(!(svg instanceof SVGSVGElement))return null;
        const first=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-score');
        const axis=svg.querySelector<SVGGraphicsElement>('.advisor-viz__q03-axis-line');
        if(!first||!axis)return null;
        return {
          valueLeft:first.getBBox().x,
          axisX:axis.getBBox().x,
          renderedTextSize:parseFloat(getComputedStyle(first).fontSize)*svg.getBoundingClientRect().width/svg.viewBox.baseVal.width
        };
      });
      expect(plotMetrics).not.toBeNull();
      expect(plotMetrics!.valueLeft).toBeGreaterThan(plotMetrics!.axisX+2);
      expect(plotMetrics!.renderedTextSize).toBeGreaterThanOrEqual(13);
      for(const score of checkpointScores)await expect(q03).toContainText(score);
      await expect(q03.locator('figcaption')).toContainText('没有测量中间轮次');
      await expect(q03.locator('figcaption')).toContainText('SEED 论文');
      // Keep a separately inspectable optional-plot screenshot without changing its scientific data.
      await captureFigureEvidence(q03,testInfo.outputPath('q03-optional-trend-'+width+'-'+theme+'.png'));
      writeFileSync(testInfo.outputPath('q03-paper-geometry-'+width+'-'+theme+'.json'),
        JSON.stringify({sha:sourceSha,browser:testInfo.project.name,width,theme,tableMetrics,metrics:plotMetrics,source:'rendered Chromium/WebKit Playwright',route},null,2)+'\n');
    });
  }
}

for(const width of [390,1440] as const){
  test('the original Q03 value collision is rejected at '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height:900});
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.locator('[data-q03-trend-details]').evaluate(el=>(el as HTMLDetailsElement).open=true);
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
    // Exercise the same accepting predicate against the deliberately bad DOM.
    expect(()=>expect(original!.left).toBeGreaterThan(original!.axis+2)).toThrow();
    await captureFigureEvidence(chart,testInfo.outputPath('q03-known-bad-'+width+'.png'));
    writeFileSync(testInfo.outputPath('q03-known-bad-'+width+'.json'),JSON.stringify({
      sha:sourceSha,browser:testInfo.project.name,width,accepted,original,knownBadRejected:true,
      mutation:width===390?'A0 xPhone=50':'A0 x=88',route,
    },null,2)+'\n');
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

test('phone reader gets a Q10 decision route and can still find the meeting RAW',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const finding=page.locator('[data-advisor-key-findings]');
  const q10=page.locator('[data-advisor-priorities] a[href="#response-q10"]');
  const raw=page.locator('[data-meeting-provenance] a[href*="2026-09-22-meeting-transcript.raw.md"]');
  // Current main reader contract prioritizes scope-bounded Q04/Q07; Q05 remains in deeper results.
  await expect(finding).toContainText('Q04');
  await expect(finding).toContainText('Q07');
  await expect(finding).toContainText('95%');
  await expect(q10).toBeVisible();
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


test('native document capture rejects the sticky-layer-obscured Q01 framing',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const figure=page.locator('[data-report-figure="q01-horizon"]');
  const title=figure.locator('strong').first();
  // Controlled bad camera position: tall-object auto-scroll can put the title
  // under persistent navigation. This changes scroll only, never product DOM.
  await title.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY,left:0,behavior:'instant'}));
  await expect.poll(()=>title.evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(1);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  const obscured=await title.evaluate(el=>{
    const r=el.getBoundingClientRect();
    const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    return {blocked:!hit||!el.contains(hit),top:r.top,blocker:hit?.tagName};
  });
  expect(obscured.blocked).toBe(true);
  await page.screenshot({path:testInfo.outputPath('q01-known-bad-viewport.png'),animations:'disabled'});
  const clip=await captureFigureEvidence(figure,testInfo.outputPath('q01-document-safe.png'));
  const fixedBottom=await page.evaluate(()=>Math.max(0,...[...document.querySelectorAll('body *')].filter(el=>{
    const style=getComputedStyle(el),r=el.getBoundingClientRect();
    return ['fixed','sticky'].includes(style.position)&&r.width>0&&r.height>0&&r.top<innerHeight;
  }).map(el=>el.getBoundingClientRect().bottom)));
  expect(clip.y).toBeGreaterThan(fixedBottom);
  writeFileSync(testInfo.outputPath('q01-capture-framing.json'),JSON.stringify({
    sha:sourceSha,browser:testInfo.project.name,obscured,clip,fixedBottom,
    method:'native document clip; DOM and viewport dimensions unchanged',route,
  },null,2)+'\n');
});

test('native document capture decodes an offscreen lazy scientific image and ignores hidden alternatives',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto(route,{waitUntil:'load'});
  const asset=readFileSync('public/research/seed-openevo/evidence/wandb-threeway/task-score.svg');
  await page.route('**/task-score.svg?lazy-camera-control',async request=>{
    // Browser lazy-load heuristics differ. Only this named fixture is held
    // until a real scroll, making the undecoded control deterministic.
    await page.waitForFunction(()=>scrollY>1000);
    await request.fulfill({status:200,contentType:'image/svg+xml',body:asset});
  });
  await page.evaluate(()=>{
    window.scrollTo({top:0,left:0,behavior:'instant'});
    const spacer=document.createElement('div');
    spacer.style.height='5000px';
    const fixture=document.createElement('figure');
    fixture.id='lazy-camera-control';
    fixture.innerHTML='<figcaption>Test fixture: native lazy-image camera control, not experiment output</figcaption><img loading="lazy" width="340" height="220" src="/research/seed-openevo/evidence/wandb-threeway/task-score.svg?lazy-camera-control" alt="Existing scientific SVG"><div data-camera-local-scroll style="width:180px;overflow-x:auto;scroll-behavior:smooth"><div style="width:800px"><img loading="lazy" width="64" height="64" style="margin-left:500px" src="/research/seed-openevo/evidence/wandb-threeway/task-score.svg?lazy-camera-control" alt="Scrollable fixture alternative"></div></div><img style="display:none" alt="Hidden responsive test alternative">';
    const dense=document.createElement('div');
    dense.style.cssText='display:flex;width:180px;height:8px;overflow-x:auto';
    for(let i=0;i<1000;i++){
      const icon=document.createElement('img');
      icon.width=4;icon.height=4;icon.loading='lazy';icon.style.flexShrink='0';
      icon.src='/research/seed-openevo/evidence/wandb-threeway/task-score.svg?lazy-camera-control';
      icon.alt='Repeated real SVG in dense capture fixture';
      dense.append(icon);
    }
    fixture.append(dense);
    document.body.append(spacer,fixture);
    fixture.querySelector('[data-camera-local-scroll]')!.scrollTo({left:17,behavior:'instant'});
  });
  const figure=page.locator('#lazy-camera-control');
  const image=figure.locator('img').first();
  expect(await image.evaluate(node=>(node as HTMLImageElement).naturalWidth)).toBe(0);
  const badClip=await figure.evaluate(el=>{
    const r=el.getBoundingClientRect();
    return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};
  });
  await page.screenshot({path:testInfo.outputPath('lazy-known-bad-document.png'),clip:badClip,fullPage:true,animations:'disabled'});
  await captureFigureEvidence(figure,testInfo.outputPath('lazy-decoded-document.png'));
  expect(await image.evaluate(node=>(node as HTMLImageElement).complete&&(node as HTMLImageElement).naturalWidth>0)).toBe(true);
  expect(await figure.locator('img').evaluateAll(nodes=>nodes.filter(node=>getComputedStyle(node).display!=='none').every(node=>(node as HTMLImageElement).complete&&(node as HTMLImageElement).naturalWidth>0))).toBe(true);
  await expect(figure.locator('img')).toHaveCount(1003);
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  expect(await figure.locator('[data-camera-local-scroll]').evaluate(node=>node.scrollLeft)).toBe(17);
  // A separate native accordion fixture avoids reparenting an in-flight lazy
  // image, which cancels its resource in WebKit and resets hidden scroll state.
  await page.evaluate(()=>{
    const detail=document.createElement('details');detail.name='camera-accordion-control';
    detail.innerHTML='<summary>Test fixture: first exclusive evidence panel</summary><figure id="accordion-camera-control"><figcaption>Test fixture: native exclusive evidence reading state</figcaption><p>Evidence must be visible before document clipping.</p></figure>';
    const peer=document.createElement('details');peer.name=detail.name;
    peer.innerHTML='<summary>Test fixture: sibling evidence panel</summary><p>Another reading state</p>';
    document.body.append(detail,peer);peer.open=true;
  });
  const accordion=page.locator('#accordion-camera-control');
  await expect(accordion).not.toBeVisible();
  await captureFigureEvidence(accordion,testInfo.outputPath('accordion-document.png'));
  await expect(accordion).toBeVisible();
  writeFileSync(testInfo.outputPath('lazy-camera-control.json'),JSON.stringify({
    sha:sourceSha,browser:testInfo.project.name,route,fixture:true,
    source:'public/research/seed-openevo/evidence/wandb-threeway/task-score.svg',
    undecodedControl:true,decodedAfterCapture:true,hiddenAlternativeIgnored:true,localScrollRestored:17,
  },null,2)+'\n');
});
