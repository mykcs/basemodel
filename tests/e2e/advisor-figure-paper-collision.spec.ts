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
      // In collapsed-border layout browsers may report a 1px resolved rule.
      // The compiled LaTeX booktabs top/bottom rules are ~1 CSS pixel at 96dpi.
      expect(tableMetrics.topBorder).toBeGreaterThanOrEqual(1);
      expect(tableMetrics.bottomBorder).toBeGreaterThanOrEqual(1);
      expect(tableMetrics.headerRule).toBeGreaterThanOrEqual(.8);
      expect(tableMetrics.bodyRowRule).toBe(0);
      expect(tableMetrics.verticalRule).toBe(0);
      expect(tableMetrics.numericAlign).toBe('right');
      expect(tableMetrics.numericFontVariant).toContain('tabular-nums');
      expect(tableMetrics.pageOverflow).toBeLessThanOrEqual(2);
      // Eagerly decode this small vector image even before opening its details:
      // the evidence camera inspects all descendants of the Q03 reading block.
      const hiddenPlot=q03.locator('img[data-pgfplot="q03-stage2"]');
      await expect(hiddenPlot).toHaveAttribute('loading','eager');
      await expect.poll(()=>hiddenPlot.evaluate(img=>
        img instanceof HTMLImageElement && img.complete && img.naturalWidth>300
      )).toBe(true);
      // Default screenshot is still the real booktabs table; the figure is opt-in.
      await captureFigureEvidence(q03Paper,testInfo.outputPath('q03-paper-'+width+'-'+theme+'.png'));
      if(width!==768) await captureFigureEvidence(q01,testInfo.outputPath('q01-paper-'+width+'-'+theme+'.png'));
      await disclosure.evaluate(el=>(el as HTMLDetailsElement).open=true);
      await expect(q03).toBeVisible();
      await expect(q03).toHaveCSS('border-top-width','0px');
      await expect(q03).toHaveCSS('box-shadow','none');
      const plot=q03.locator('img[data-pgfplot="q03-stage2"]');
      await expect(plot).toBeVisible();
      await expect(plot).toHaveAttribute('src','/research/seed-openevo/figures/q03-stage2-pgfplots.svg');
      await expect(plot).toHaveAttribute('aria-describedby','advisor-q03-publication-caption');
      await expect(plot).toHaveAttribute('alt',/A0 为 3\.71，A40 为 6\.43，A80 为 0\.69，A120 为 6\.62/);
      await expect(q03.locator('svg[role="img"],canvas')).toHaveCount(0);
      await plot.scrollIntoViewIfNeeded();
      const imageMetrics=await plot.evaluate(async(img,scores)=>{
        if(!(img instanceof HTMLImageElement))return null;
        await img.decode();
        const box=img.getBoundingClientRect();
        const outer=img.closest('figure')!.getBoundingClientRect();
        const text=img.getAttribute('alt')||'';
        return {
          loaded:img.complete&&img.naturalWidth>300&&img.naturalHeight>190,
          naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,
          width:box.width,height:box.height,
          left:box.left,right:box.right,
          figureLeft:outer.left,figureRight:outer.right,
          centeredBy:Math.abs((outer.left+outer.right)/2-(box.left+box.right)/2),
          descriptive:scores.every(score=>text.includes(score)),
          externalRequests:img.currentSrc.startsWith(location.origin+'/research/'),
        };
      },[...checkpointScores]);
      expect(imageMetrics).not.toBeNull();
      expect(imageMetrics!.loaded).toBe(true);
      expect(imageMetrics!.descriptive).toBe(true);
      expect(imageMetrics!.externalRequests).toBe(true);
      expect(imageMetrics!.width).toBeLessThanOrEqual(442);
      expect(imageMetrics!.width).toBeGreaterThanOrEqual(250);
      expect(imageMetrics!.left).toBeGreaterThanOrEqual(imageMetrics!.figureLeft-1);
      expect(imageMetrics!.right).toBeLessThanOrEqual(imageMetrics!.figureRight+1);
      expect(imageMetrics!.centeredBy).toBeLessThanOrEqual(3);
      const caption=q03.locator('figcaption');
      await expect(caption).toContainText('没有测量中间轮次');
      await expect(caption).toContainText('SEED 论文');
      await expect(caption).toContainText('0–10');
      await expect(caption).toContainText('满分 100');
      await captureFigureEvidence(q03,testInfo.outputPath('q03-pgfplots-paper-'+width+'-'+theme+'.png'));
      writeFileSync(testInfo.outputPath('q03-pgfplots-geometry-'+width+'-'+theme+'.json'),
        JSON.stringify({sha:sourceSha,browser:testInfo.project.name,width,theme,tableMetrics,imageMetrics,
          renderer:'XeLaTeX + PGFPlots -> committed SVG -> Astro img',route},null,2)+'\n');
    });
  }
}

for(const width of [390,1440] as const){
  test('Q03 PGFPlots image clipping is detected at '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height:900});
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.locator('[data-q03-trend-details]').evaluate(el=>(el as HTMLDetailsElement).open=true);
    const image=page.locator('img[data-pgfplot="q03-stage2"]');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    const geometry=()=>image.evaluate(img=>{
      const imgBox=img.getBoundingClientRect(),outer=img.closest('figure')!.getBoundingClientRect();
      return {left:imgBox.left,outerLeft:outer.left,right:imgBox.right,outerRight:outer.right};
    });
    const good=await geometry();
    expect(good.left).toBeGreaterThanOrEqual(good.outerLeft-1);
    await image.evaluate(img=>(img as HTMLElement).style.transform='translateX(-110px)');
    const bad=await geometry();
    expect(bad.left).toBeLessThan(bad.outerLeft-5);
    expect(()=>expect(bad.left).toBeGreaterThanOrEqual(bad.outerLeft-1)).toThrow();
    await captureFigureEvidence(page.locator('[data-report-figure="q03-custom-curve"]'),testInfo.outputPath('q03-pgfplots-known-bad-'+width+'.png'));
    await image.evaluate(img=>(img as HTMLElement).style.removeProperty('transform'));
    const restored=await geometry();
    expect(restored.left).toBeGreaterThanOrEqual(restored.outerLeft-1);
    writeFileSync(testInfo.outputPath('q03-pgfplots-known-bad-'+width+'.json'),JSON.stringify({
      sha:sourceSha,browser:testInfo.project.name,width,good,bad,restored,
      knownBadRejected:true,mutation:'visible compiled image shifted left by 110px',route,
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
