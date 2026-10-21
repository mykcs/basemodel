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
    test('Q01/Q03 paper figures: no tooltip/card or clipped value at '+width+' '+theme,async({page},testInfo)=>{
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
      // Publication figure contract: the four-point plot is one compact, centered
      // paper column. The caption immediately follows the visible plot; the old
      // side-by-side dashboard heading and card framing must not return.
      await expect(q03).toHaveAttribute('data-paper-width','single');
      await expect(q03.locator('.advisor-viz__heading')).toHaveCount(0);
      const paper=await q03.evaluate(figure=>{
        const outer=figure.getBoundingClientRect();
        const parent=figure.parentElement!.getBoundingClientRect();
        const svg=[...figure.querySelectorAll('svg[data-q03-desktop-chart],svg[data-q03-mobile-chart]')]
          .find(el=>getComputedStyle(el).display!=='none')!;
        return {
          width:outer.width,
          centeredBy:Math.abs((outer.left+outer.right)/2-(parent.left+parent.right)/2),
          chartBottom:svg.getBoundingClientRect().bottom,
          captionTop:figure.querySelector('figcaption')!.getBoundingClientRect().top,
        };
      });
      expect(paper.width).toBeLessThanOrEqual(514);
      expect(paper.centeredBy).toBeLessThanOrEqual(3);
      expect(paper.captionTop).toBeGreaterThanOrEqual(paper.chartBottom-2);
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
      // These PNGs and computed measurements become short-lived GitHub
      // Actions artifacts, so MacBook/RDC screenshots are not needed.
      await captureFigureEvidence(q03,testInfo.outputPath('q03-paper-'+width+'-'+theme+'.png'));
      if(width!==768) await captureFigureEvidence(q01,testInfo.outputPath('q01-paper-'+width+'-'+theme+'.png'));
      writeFileSync(testInfo.outputPath('q03-paper-geometry-'+width+'-'+theme+'.json'),
        JSON.stringify({sha:sourceSha,browser:testInfo.project.name,width,theme,metrics,source:'rendered Chromium/WebKit Playwright',route},null,2)+'\n');
    });
  }
}

for(const width of [390,1440] as const){
  test('the original Q03 value collision is rejected at '+width+'px',async({page},testInfo)=>{
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
  await expect(finding).toContainText('Q05、Q07');
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
