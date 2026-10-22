import { expect, test } from '@playwright/test';
import { writeFileSync } from 'node:fs';

// Representative reader roles, not a claim that these paths are every static
// route. The build audit separately walks all generated HTML.
const routes=[
  '/',
  '/guide/',
  '/models/',
  '/papers/',
  '/compare/',
  '/workspace/',
  '/research/seed-openevo/study/',
  '/research/seed-openevo/study/openevo-methods/',
  '/research/seed-openevo/study/parameter-memory-results/',
  '/research/seed-openevo/flow/webshop/',
] as const;

for(const width of [390,1440] as const) {
  for(const route of routes) {
    test('shared type roles remain legible: '+route+' at '+width,async({page})=>{
      await page.setViewportSize({width,height:900});
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.status(),route).toBe(200);
      const reader=await page.evaluate(()=>{
        const root=getComputedStyle(document.documentElement);
        const body=getComputedStyle(document.body);
        const heading=document.querySelector('main h1, .site-main h1, h1');
        const h2=document.querySelector('main h2, .site-main h2');
        if(!heading)return null;
        const headingStyle=getComputedStyle(heading);
        return {
          family:body.fontFamily,
          pageToken:root.getPropertyValue('--type-page').trim(),
          bodyToken:root.getPropertyValue('--type-body').trim(),
          captionToken:root.getPropertyValue('--type-caption').trim(),
          h1:parseFloat(headingStyle.fontSize),
          h2:h2?parseFloat(getComputedStyle(h2).fontSize):null,
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
          h1Rect:heading.getBoundingClientRect().toJSON(),
        };
      });
      expect(reader,route).not.toBeNull();
      expect(reader!.pageToken).toBeTruthy();
      expect(reader!.bodyToken).toBe('1rem');
      expect(reader!.captionToken).toBe('.875rem');
      expect(reader!.family).toMatch(/Inter|PingFang|system-ui/);
      expect(reader!.h1).toBeGreaterThanOrEqual(22);
      expect(reader!.h1).toBeLessThanOrEqual(86);
      expect(reader!.overflow).toBeLessThanOrEqual(2);
      expect(reader!.h1Rect.left).toBeGreaterThanOrEqual(-2);
      expect(reader!.h1Rect.right).toBeLessThanOrEqual(width+2);
      if(reader!.h2!==null)expect(reader!.h1).toBeGreaterThanOrEqual(reader!.h2-1);

      // The type system is stable when changing theme after initial render.
      await page.evaluate(()=>{document.documentElement.dataset.theme='dark'});
      const dark=await page.evaluate(()=>({
        body:getComputedStyle(document.body).fontFamily,
        foreground:getComputedStyle(document.body).color,
        background:getComputedStyle(document.body).backgroundColor,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      }));
      expect(dark.body).toBe(reader!.family);
      expect(dark.overflow).toBeLessThanOrEqual(2);
      expect(dark.foreground).not.toBe(dark.background);
      await page.evaluate(()=>{document.documentElement.dataset.theme='light'});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    });
  }
}

test('restoring the Q03 value-label collision actually fails the same geometry test',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  const chart=page.locator('[data-q03-desktop-chart]');
  const offsets=async()=>chart.evaluate(svg=>{
    const node=svg.querySelector('[data-trend-point="A0"] .advisor-viz__q03-score');
    const axis=svg.querySelector('.advisor-viz__q03-axis-line');
    if(!(node instanceof SVGGraphicsElement)||!(axis instanceof SVGGraphicsElement))return null;
    return {left:node.getBBox().x,axis:axis.getBBox().x};
  });
  const good=await offsets();
  expect(good).not.toBeNull();
  expect(good!.left).toBeGreaterThan(good!.axis+2);
  // Old Q03 screenshot coordinates, deliberately reintroduced for one check.
  await chart.locator('[data-trend-point="A0"] .advisor-viz__q03-score').evaluate(node=>node.setAttribute('x','88'));
  const bad=await offsets();
  expect(bad).not.toBeNull();
  expect(bad!.left).toBeLessThanOrEqual(bad!.axis+2);
});

const knownUnreadableProse=[
  {route:'/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/',selector:'.harness-fairness__rows p'},
  {route:'/research/seed-openevo/study/results/3b-minimax-analysis/',selector:'.exp-scaffold__pipeline p'},
  {route:'/research/seed-openevo/flow/sd-lora/',selector:'.sdlora-map p'},
  {route:'/research/seed-openevo/flow/alfworld/',selector:'.irx-paper-caption p'},
  {route:'/research/seed-openevo/study/capability-exploration/stage2-256-window/',selector:'.s2-choice__head p'},
  {route:'/lab/',selector:'.lab-first-login p'},
] as const;

for(const item of knownUnreadableProse) {
  test('a known 8–11px research-prose family becomes actually legible: '+item.route,async({page})=>{
    await page.setViewportSize({width:1280,height:900});
    const res=await page.goto(item.route,{waitUntil:'domcontentloaded'});
    expect(res?.status()).toBe(200);
    const paragraphs=page.locator(item.selector);
    expect(await paragraphs.count()).toBeGreaterThan(0);
    const rendered=await paragraphs.evaluateAll(nodes=>nodes.map(node=>({
      size:parseFloat(getComputedStyle(node).fontSize),
      text:node.textContent?.trim()||''
    })).filter(x=>x.text.length>0));
    expect(rendered.length).toBeGreaterThan(0);
    for(const item of rendered) expect(item.size).toBeGreaterThanOrEqual(13);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}

for(const width of [390,1280] as const){
  test("SD-LoRA's branch boxes never overlap at "+width+"px",async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/research/seed-openevo/flow/sd-lora/',{waitUntil:'domcontentloaded'});
    const slide=page.locator('.sdlora-slide').first();
    await expect(slide).toBeVisible();
    if(width<=900){
      await expect(slide.locator('.sdlora-map__mobile')).toBeVisible();
      const mobileText=slide.locator('.sdlora-mobile-node p').first();
      await expect(mobileText).toBeVisible();
      expect(await mobileText.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(13);
    }else{
      await expect(slide.locator('.sdlora-map__desktop')).toBeVisible();
      const overlap=await slide.evaluate(el=>{
        const nodes=[...el.querySelectorAll('.sdlora-map__desktop .sdlora-node')];
        const rects=nodes.map(n=>({name:n.className,rect:n.getBoundingClientRect()}));
        return rects.flatMap((a,i)=>rects.slice(i+1).filter(b=>
          Math.min(a.rect.right,b.rect.right)-Math.max(a.rect.left,b.rect.left)>2
          && Math.min(a.rect.bottom,b.rect.bottom)-Math.max(a.rect.top,b.rect.top)>2
        ).map(b=>a.name+' overlaps '+b.name));
      });
      expect(overlap).toEqual([]);
      for(const node of ['direct','gdr']){
        await expect(slide.locator('.sdlora-map__desktop .sdlora-node--'+node+' p')).toBeHidden();
        await expect(slide.locator('.sdlora-map__desktop .sdlora-node--'+node+' strong')).toBeVisible();
      }
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}

/* The same native evidence table is readable on phones and remains a local
 * scroller; a green document-overflow check alone did not catch 13px cells or
 * a hidden local overflow owner. The table's labels remain with PR #906. */
const advisorTableRoute='/research/seed-openevo/study/parameter-memory-results/';
const advisorTableSelector='[data-advisor-matrix="q02"]';
const acceptScientificCellSize=(pixels:number)=>expect(pixels).toBeGreaterThanOrEqual(15);
const acceptLocalTableScroller=(overflowX:string)=>expect(overflowX).toBe('auto');

for(const width of [390,768,1440] as const) {
  for(const theme of ['light','dark'] as const) {
    test('advisor Q02 native table font roles and local containment at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      const response=await page.goto(advisorTableRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);

      const matrix=page.locator(advisorTableSelector);
      await expect(matrix).toBeVisible();
      const scroller=matrix.locator('.advisor-result-matrix__wrap');
      await scroller.scrollIntoViewIfNeeded();
      const geometry=await matrix.evaluate(figure=>{
        const own=(selector:string)=>{
          const node=figure.querySelector(selector);
          if(!node)throw Error('Missing scientific cell role: '+selector);
          const s=getComputedStyle(node);
          return {size:parseFloat(s.fontSize),family:s.fontFamily,weight:s.fontWeight,style:s.fontStyle};
        };
        const globalRole=(selector:string)=>{
          const node=document.querySelector(selector);
          if(!node)throw Error('Missing article hierarchy: '+selector);
          return parseFloat(getComputedStyle(node).fontSize);
        };
        const holder=figure.querySelector('.advisor-result-matrix__wrap') as HTMLElement;
        const holderBounds=holder.getBoundingClientRect();
        const nativeTable=figure.querySelector('table') as HTMLElement;
        return {
          heading:globalRole('#responses > h2'),
          question:globalRole('#response-q02 .evo-article__question-header h3'),
          answer:globalRole('#response-q02 .advisor-response__answer'),
          table:own('table'),
          numeric:own('tbody td[data-numeric]'),
          caption:own('figcaption p'),
          holder:{client:holder.clientWidth,scroll:holder.scrollWidth,overflowX:getComputedStyle(holder).overflowX,left:holderBounds.left,right:holderBounds.right},
          tableWidth:nativeTable.getBoundingClientRect().width,
          rootOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        };
      });
      expect(geometry.heading).toBeGreaterThan(geometry.question);
      expect(geometry.question).toBeGreaterThan(geometry.answer);
      expect(geometry.answer).toBeGreaterThanOrEqual(16);
      acceptScientificCellSize(geometry.table.size);
      acceptScientificCellSize(geometry.numeric.size);
      expect(geometry.caption.size).toBeGreaterThanOrEqual(14);
      expect(geometry.numeric.family).toMatch(/Inter|PingFang|system-ui/);
      expect(geometry.numeric.style).toBe('normal');
      expect(geometry.rootOverflow).toBeLessThanOrEqual(2);
      expect(geometry.holder.left).toBeGreaterThanOrEqual(-2);
      expect(geometry.holder.right).toBeLessThanOrEqual(width+2);
      acceptLocalTableScroller(geometry.holder.overflowX);
      if(width===390) {
        expect(geometry.tableWidth).toBeGreaterThanOrEqual(416-1);
        expect(geometry.holder.scroll).toBeGreaterThan(geometry.holder.client);
      }
      const label='advisor-q02-'+width+'-'+theme;
      await scroller.screenshot({path:testInfo.outputPath(label+'.png'),animations:'disabled',
        style:'.site-header { visibility: hidden; }'});
    });
  }
}

test('former 13px data and hidden local scroller both fail the actual advisor table predicates',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(advisorTableRoute,{waitUntil:'domcontentloaded'});
  const cell=page.locator(advisorTableSelector+' tbody td[data-numeric]').first();
  const scroller=page.locator(advisorTableSelector+' .advisor-result-matrix__wrap');
  const readSize=()=>cell.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
  const readScroll=()=>scroller.evaluate(node=>getComputedStyle(node).overflowX);
  acceptScientificCellSize(await readSize());
  acceptLocalTableScroller(await readScroll());
  await page.addStyleTag({content:`
    /* Inject at the actual consumer, not the ancestor: a native td can keep
       its own 15px declaration even after the table inherits 13px. */
    .evo-approved-reader .advisor-result-matrix tbody td[data-numeric] {font-size:13px !important;}
    .evo-approved-reader .advisor-result-matrix__wrap {overflow-x:hidden !important;}
  `});
  const badSize=await readSize();
  expect(badSize).toBeLessThan(15);
  expect(()=>acceptScientificCellSize(badSize)).toThrow();
  const badScroller=await readScroll();
  expect(badScroller).toBe('hidden');
  expect(()=>acceptLocalTableScroller(badScroller)).toThrow();
});



const fourArmAnalysis='/research/seed-openevo/study/results/four-arm-analysis/';
async function readFourArmType(page: import('@playwright/test').Page) {
  return page.evaluate(()=>{
    const root=document.querySelector('.analysis-plan');
    if(!root) throw Error('Missing four-arm research report');
    const describe=(element:Element)=>{
      const style=getComputedStyle(element);
      const rect=element.getBoundingClientRect();
      return {size:parseFloat(style.fontSize),weight:parseFloat(style.fontWeight),
        family:style.fontFamily,style:style.fontStyle,
        width:rect.width,client:(element as HTMLElement).clientWidth,
        scroll:(element as HTMLElement).scrollWidth,
        text:element.textContent?.trim().slice(0,85)};
    };
    const selectors=['.section-kicker','.reasoning-line figcaption','.reasoning-line li','.reasoning-line li > span'];
    const roles=Object.fromEntries(selectors.map(selector=>{
      const nodes=[...root.querySelectorAll(selector)];
      if(nodes.length===0)throw Error('Missing role '+selector);
      return [selector,nodes.map(describe)];
    })) as Record<string, ReturnType<typeof describe>[]>;
    return {roles,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
}
function assertFourArmType(receipt:Awaited<ReturnType<typeof readFourArmType>>) {
  expect(receipt.overflow).toBeLessThanOrEqual(2);
  const a=receipt.roles;
  for(const x of a['.section-kicker']!) {
    expect(x.size).toBeGreaterThanOrEqual(13);
    expect(x.family).toMatch(/Inter|PingFang|system-ui/);
    expect(x.weight).toBeLessThanOrEqual(650);
  }
  for(const x of a['.reasoning-line figcaption']!)expect(x.size).toBeGreaterThanOrEqual(15);
  for(const x of a['.reasoning-line li']!) {
    expect(x.size).toBeGreaterThanOrEqual(15);
    expect(x.family).toMatch(/Inter|PingFang|system-ui/);
    expect(x.scroll).toBeLessThanOrEqual(x.client+2);
  }
  for(const x of a['.reasoning-line li > span']!) {
    expect(x.size).toBeGreaterThanOrEqual(13);
    expect(x.family).toMatch(/Inter|PingFang|system-ui/);
    expect(x.weight).toBeLessThanOrEqual(650);
  }
}
for(const width of [390,768,1440] as const) {
  for(const theme of ['light','dark'] as const) {
    test('four-arm reader sees legible reasoning steps at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
      const response=await page.goto(fourArmAnalysis,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipt=await readFourArmType(page);
      assertFourArmType(receipt);
      const figure=page.locator('.reasoning-line').first();
      await figure.scrollIntoViewIfNeeded();
      await figure.screenshot({path:testInfo.outputPath('four-arm-reasoning-'+width+'-'+theme+'.png'),animations:'disabled',style:'.site-header{visibility:hidden}'});
      await testInfo.attach('four-arm-type.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
    });
  }
}
test('same four-arm reader predicates reject restored 10px prose and metadata',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(fourArmAnalysis,{waitUntil:'domcontentloaded'});
  assertFourArmType(await readFourArmType(page));
  const injected=await page.addStyleTag({content:`
    .analysis-plan .reasoning-line li {font-size:10px !important;}
    .analysis-plan .reasoning-line li>span {font-size:10px !important;}
  `});
  const bad=await readFourArmType(page);
  expect(()=>assertFourArmType(bad)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  assertFourArmType(await readFourArmType(page));
});


async function readFourArmDataType(page:import('@playwright/test').Page){
  return page.evaluate(()=>{
    const root=document.querySelector('.analysis-plan');
    if(!root)throw Error('Missing four-arm report');
    const selectors=['.per-arm-grid header span','.per-arm-grid p','.per-arm-grid footer',
      '.factor-matrix small','.plan-table tbody td','.plan-table code'] as const;
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector(selector);
      if(!el)throw Error('Missing '+selector);
      const style=getComputedStyle(el);
      return [selector,{size:parseFloat(style.fontSize),weight:parseFloat(style.fontWeight),
        family:style.fontFamily,style:style.fontStyle,lineHeight:style.lineHeight,
        letterSpacing:style.letterSpacing}];
    })) as Record<string,{size:number;weight:number;family:string;style:string;lineHeight:string;letterSpacing:string}>;
    const wrap=root.querySelector('.plan-table-wrap') as HTMLElement|null;
    if(!wrap)throw Error('Missing local plan-table scroller');
    return {roles,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      local:{overflow:getComputedStyle(wrap).overflowX,client:wrap.clientWidth,scroll:wrap.scrollWidth}};
  });
}
function acceptFourArmDataType(r:Awaited<ReturnType<typeof readFourArmDataType>>){
  expect(r.overflow).toBeLessThanOrEqual(2);
  for(const [selector,min] of [
    ['.per-arm-grid header span',13],['.per-arm-grid p',15],
    ['.per-arm-grid footer',13],['.factor-matrix small',14],
    ['.plan-table tbody td',15],['.plan-table code',13]
  ] as const) {
    expect(r.roles[selector]?.size,selector).toBeGreaterThanOrEqual(min);
    expect(r.roles[selector]?.style,selector).toBe('normal');
  }
  expect(r.roles['.per-arm-grid header span']?.family).toMatch(/Inter|PingFang|system-ui/);
  expect(r.local.overflow).toBe('auto');
}
for(const width of [390,768,1440] as const) {
  for(const theme of ['light','dark'] as const) {
    test('four-arm evidence cards and plan table roles: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
      const response=await page.goto(fourArmAnalysis,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const r=await readFourArmDataType(page);
      acceptFourArmDataType(r);
      if(width===390)expect(r.local.scroll).toBeGreaterThan(r.local.client);
      const region=page.locator('.per-arm-grid');
      await region.scrollIntoViewIfNeeded();
      // Two different proof surfaces: (1) true viewport with its live sticky navigation;
      // (2) tall component crop without floating navigation covering paragraphs in
      // the Playwright stitched element image. The latter is NOT a navigation acceptance.
      await page.screenshot({path:testInfo.outputPath('four-arm-viewport-'+width+'-'+theme+'.png'),
        animations:'disabled'});
      await region.screenshot({path:testInfo.outputPath('four-arm-evidence-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await testInfo.attach('four-arm-evidence-computed.json',{
        body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
    });
  }
}
test('four-arm evidence guard rejects prior 11px status and 12px question prose',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(fourArmAnalysis,{waitUntil:'domcontentloaded'});
  acceptFourArmDataType(await readFourArmDataType(page));
  const injected=await page.addStyleTag({content:
    '.analysis-plan .per-arm-grid header span{font-size:11px!important}' +
    '.analysis-plan .per-arm-grid p{font-size:12px!important}'});
  const bad=await readFourArmDataType(page);
  expect(()=>acceptFourArmDataType(bad)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  acceptFourArmDataType(await readFourArmDataType(page));
});



/* MiniMax teacher: actual rendered scientific roles, local table scrolling,
 * non-invented candidate status and a same-assertion font regression. */
const minimaxTeacherRoute='/research/seed-openevo/study/minimax-teacher/';
const minimaxRoleFloors={
  '.section-no':13,
  '.hero-answer p':16,
  '.answer-main>p':16,
  '.benchmark-callout>div small':13,
  '.benchmark-callout li span':13,
  '.fit-head small':13,
  '.fit-row>div:first-child span':13,
  '.fit-row>strong':13,
  '.comparison thead th':15,
  '.comparison tbody td':15,
  '.boundary':15,
  '.budget-flow p':15,
  '.resource-cards dd':13,
  '.repro-copy>p':15,
  '.repro-checks span':13,
  '.provenance a':13,
  '.provenance p':14,
  '.resource-cards header b':13,
  '.resource-cards article.combined>p':15,
  '.reconcile-row span':13,
  '.reconcile-row b':15,
  '.reconcile footer span':13,
  '.bill-strip span':13,
  '.bill-strip b':15,
  '.bill-strip small':13,
  '.protocol b':15,
  '.protocol span':15,
  '.frontier__lead':15,
  '.frontier .point b':15,
  '.frontier .point small':13,
  '.frontier__note':14,
} as const;
async function readMinimaxTypography(page:import('@playwright/test').Page){
  return page.evaluate((selectors)=>{
    const roles:Record<string,{size:number,family:string,style:string,weight:number,scroll:number,client:number}>={};
    for(const selector of selectors){
      const node=document.querySelector(selector);
      if(!node)throw Error('Missing MiniMax scientific role '+selector);
      const css=getComputedStyle(node);
      roles[selector]={size:parseFloat(css.fontSize),family:css.fontFamily,style:css.fontStyle,
        weight:parseFloat(css.fontWeight),scroll:node.scrollWidth,client:node.clientWidth};
    }
    const table=document.querySelector('.comparison table') as HTMLTableElement | null;
    const wrap=document.querySelector('.comparison .table-wrap') as HTMLElement | null;
    const fit=document.querySelector('.fit-chart') as HTMLElement | null;
    const frontier=document.querySelector('.frontier') as HTMLElement | null;
    if(!table||!wrap||!fit||!frontier)throw Error('Missing native comparison or fitness plot');
    const points=[...frontier.querySelectorAll('.frontier__candidates > li')].map(node=>{
      const r=node.getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    });
    const pointOverlaps=points.flatMap((a,i)=>points.slice(i+1).filter(b=>
      Math.min(a.right,b.right)-Math.max(a.left,b.left)>2 &&
      Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2
    ).map(b=>[a.left,b.left]));
    return {roles,documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      wrap:{overflowX:getComputedStyle(wrap).overflowX,client:wrap.clientWidth,scroll:wrap.scrollWidth,
        left:wrap.getBoundingClientRect().left,right:wrap.getBoundingClientRect().right},
      table:{width:table.getBoundingClientRect().width,rows:table.tBodies[0]?.rows.length??0},
      fit:{client:fit.clientWidth,scroll:fit.scrollWidth},
      candidateList:{count:points.length,pointOverlaps,client:frontier.clientWidth,
        scroll:frontier.scrollWidth,layout:getComputedStyle(frontier.querySelector('.frontier__candidates')!).display}};
  },Object.keys(minimaxRoleFloors));
}
function acceptMinimaxTypography(m:Awaited<ReturnType<typeof readMinimaxTypography>>,width:number){
  expect(m.documentOverflow).toBeLessThanOrEqual(2);
  expect(m.table.rows).toBeGreaterThan(1);
  for(const [selector,min] of Object.entries(minimaxRoleFloors)){
    const role=m.roles[selector]!;
    expect(role.size,selector+' text size').toBeGreaterThanOrEqual(min);
    expect(role.family,selector+' font family').toMatch(/Inter|PingFang|system-ui/);
    expect(role.style,selector+' italic style').toBe('normal');
  }
  expect(m.wrap.overflowX).toBe('auto');
  expect(m.wrap.left).toBeGreaterThanOrEqual(-2);
  expect(m.wrap.right).toBeLessThanOrEqual(width+2);
  expect(m.fit.scroll).toBeLessThanOrEqual(m.fit.client+2);
  expect(m.candidateList.count).toBe(4);
  expect(m.candidateList.layout).toBe('grid');
  expect(m.candidateList.pointOverlaps).toEqual([]);
  expect(m.candidateList.scroll).toBeLessThanOrEqual(m.candidateList.client+2);
  if(width===390){
    expect(m.table.width).toBeGreaterThan(m.wrap.client+10);
    expect(m.wrap.scroll).toBeGreaterThan(m.wrap.client);
  }
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('MiniMax teacher research roles readable at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const res=await page.goto(minimaxTeacherRoute,{waitUntil:'domcontentloaded'});
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipt=await readMinimaxTypography(page);
      acceptMinimaxTypography(receipt,width);
      await testInfo.attach('minimax-roles.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
      await page.locator('.fit-chart').screenshot({path:testInfo.outputPath('minimax-fit-'+width+'-'+theme+'.png'),animations:'disabled'});
      await page.locator('.comparison .table-wrap').screenshot({path:testInfo.outputPath('minimax-table-'+width+'-'+theme+'.png'),animations:'disabled'});
      await page.locator('.frontier').screenshot({path:testInfo.outputPath('minimax-candidates-'+width+'-'+theme+'.png'),animations:'disabled'});
    });
  }
}
test('MiniMax teacher gate rejects old 10px data then accepts restored roles',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(minimaxTeacherRoute,{waitUntil:'domcontentloaded'});
  acceptMinimaxTypography(await readMinimaxTypography(page),390);
  const injected=await page.addStyleTag({content:'.teacher-audit .comparison tbody td {font-size:10px !important} .teacher-audit .fit-row>div:first-child span {font-size:9px !important}'});
  const bad=await readMinimaxTypography(page);
  expect(bad.roles['.comparison tbody td']!.size).toBeLessThan(15);
  expect(()=>acceptMinimaxTypography(bad,390)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  acceptMinimaxTypography(await readMinimaxTypography(page),390);
});

/* The native 1200px scientific SVG uses 13px tick labels; shrinking it to
 * 390px visually yields ~4px glyphs even though the page has no overflow.
 * One existing SVG stays visible as a compact preview and can be read at
 * its original size in a keyboard-scrollable local viewport. */
const metricZoomRoute='/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';
const readMetricZoom=async (figure:import('@playwright/test').Locator)=>{
  return figure.evaluate(root=>{
    const viewport=root.querySelector('.metric-evidence__viewport') as HTMLElement|null;
    const img=viewport?.querySelector('img') as HTMLImageElement|null;
    const button=root.querySelector('[data-metric-zoom]') as HTMLButtonElement|null;
    if(!viewport||!img||!button)throw Error('Scientific metric zoom must be mounted');
    const box=img.getBoundingClientRect();
    return {native:img.naturalWidth,drawn:box.width,axis:13*box.width/1200,
      client:viewport.clientWidth,scroll:viewport.scrollWidth,
      localOverflow:getComputedStyle(viewport).overflowX,
      expanded:button.getAttribute('aria-expanded'),tabindex:viewport.tabIndex,
      rootOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
};
const acceptMetricZoom=(value:Awaited<ReturnType<typeof readMetricZoom>>,wide:boolean)=>{
  expect(value.native).toBe(1200);
  expect(value.rootOverflow).toBeLessThanOrEqual(2);
  if(wide){
    expect(value.expanded).toBe('true');
    expect(value.drawn).toBeGreaterThanOrEqual(1198);
    expect(value.axis).toBeGreaterThanOrEqual(12.9);
    expect(value.localOverflow).toBe('auto');
    expect(value.scroll).toBeGreaterThan(value.client);
    expect(value.tabindex).toBe(0);
  }else{
    expect(value.expanded).toBe('false');
    expect(value.drawn).toBeLessThan(1200);
  }
};
for(const width of [390,768,1440] as const) for(const theme of ['light','dark'] as const){
  test('metric science plot retains original-size reading path '+width+'/'+theme,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width===390?844:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    const res=await page.goto(metricZoomRoute,{waitUntil:'domcontentloaded'});
    expect(res?.status()).toBe(200);
    const figs=page.locator('.metric-evidence');
    await expect(figs).toHaveCount(7);
    const first=figs.first();
    const image=first.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete',true);
    const button=first.locator('[data-metric-zoom]');
    const hint=first.locator('[data-metric-scroll-hint]');
    await expect(button).toBeVisible();
    await expect(hint).toBeHidden();
    acceptMetricZoom(await readMetricZoom(first),false);
    const full=first.getByRole('link',{name:/原尺寸打开/});
    await expect(full).toHaveAttribute('href',/wandb-threeway\/task-score\.svg$/);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded','true');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('左右滑动');
    const receipt=await readMetricZoom(first);
    acceptMetricZoom(receipt,true);
    await testInfo.attach('metric-original-size.json',{body:Buffer.from(JSON.stringify({width,theme,...receipt},null,2)),contentType:'application/json'});
    const viewport=first.locator('.metric-evidence__viewport');
    const scrolled=await viewport.evaluate(node=>{
      (node as HTMLElement).scrollLeft=200;
      const left=(node as HTMLElement).scrollLeft;
      (node as HTMLElement).scrollLeft=0;
      return left;
    });
    expect(scrolled).toBeGreaterThan(0);
    await viewport.screenshot({path:testInfo.outputPath('metric-original-size-'+width+'-'+theme+'.png'),animations:'disabled'});
    await first.screenshot({path:testInfo.outputPath('metric-expanded-with-controls-'+width+'-'+theme+'.png'),animations:'disabled',
      style:'.site-header,.research-navigation{visibility:hidden}'});
    await button.click();
    await expect(hint).toBeHidden();
    acceptMetricZoom(await readMetricZoom(first),false);
  });
}
test('metric zoom actual 13px axis-readability predicate rejects old squeezed mobile image',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(metricZoomRoute,{waitUntil:'domcontentloaded'});
  const first=page.locator('.metric-evidence').first();
  await first.locator('img').scrollIntoViewIfNeeded();
  await expect(first.locator('[data-metric-zoom]')).toBeVisible();
  await first.locator('[data-metric-zoom]').click();
  acceptMetricZoom(await readMetricZoom(first),true);
  const style=await page.addStyleTag({content:'.metric-evidence__viewport.is-expanded a,.metric-evidence__viewport.is-expanded img{width:100% !important;max-width:100% !important}'});
  const bad=await readMetricZoom(first);
  expect(bad.axis).toBeLessThan(6);
  expect(()=>acceptMetricZoom(bad,true)).toThrow();
  await style.evaluate(node=>node.parentNode?.removeChild(node));
  acceptMetricZoom(await readMetricZoom(first),true);
});


// Ceiling-1.0 actual 7B reader and table witnesses (WP-D4).
// Freeze factual copy and the local table-scroll contract while removing
// decorative monospace labels and unreadable small table headers.
const ceilingRoute='/research/seed-openevo/study/capability-exploration/stage2-ceiling/';
const ceilingRoot='[data-testid="ceiling-stage2-strategy"]';
const ceilingRoles={
  '.ceiling__hero>div>p':16,
  '.ceiling__hero aside span':16,
  '.ceiling__hero aside strong':16,
  '.ceiling__hero aside small':16,
  '.ceiling__budget b':20,
  '.ceiling__budget span':16,
  '.ceiling__rounds b':20,
  '.ceiling__rounds p':16,
  '.ceiling__learning-list span':16,
  '.ceiling__compare thead th':16,
  '.ceiling__compare tbody th':16,
  '.ceiling__compare tbody td':16,
  '.ceiling__arm-status article>span':16,
  '.ceiling__arm-status article>strong':16,
  '.ceiling__arm-status article p':16,
  '.ceiling__provenance summary':16,
  '.ceiling__provenance dt':16,
  '.ceiling__provenance small':16,
  '.ceiling__provenance nav a':16,
} as const;
type CeilingMeasure={
  roles:Record<string,{size:number;family:string;weight:number;style:string;width:number;overflow:number;left:number;right:number}>;
  table:{viewportWidth:number;scrollWidth:number;rows:number;headings:number;tabIndex:number};
  rootLeft:number;rootRight:number;documentOverflow:number;scientificText:string;
};
async function measureCeiling(page:import('@playwright/test').Page):Promise<CeilingMeasure>{
  return page.evaluate(selectors=>{
    const root=document.querySelector<HTMLElement>('[data-testid="ceiling-stage2-strategy"]');
    const wrapper=root?.querySelector<HTMLElement>('.ceiling__compare');
    if(!root||!wrapper)throw Error('Real Ceiling-1.0 result/table missing');
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('Missing Ceiling role '+selector);
      const style=getComputedStyle(el),rect=el.getBoundingClientRect();
      return [selector,{size:parseFloat(style.fontSize),family:style.fontFamily,weight:parseFloat(style.fontWeight),
        style:style.fontStyle,width:rect.width,overflow:el.scrollWidth-el.clientWidth,left:rect.left,right:rect.right}];
    })) as CeilingMeasure['roles'];
    const b=root.getBoundingClientRect();
    return {roles,table:{viewportWidth:wrapper.clientWidth,scrollWidth:wrapper.scrollWidth,
      rows:wrapper.querySelectorAll('tbody tr').length,headings:wrapper.querySelectorAll('thead th').length,
      tabIndex:wrapper.tabIndex},
      rootLeft:b.left,rootRight:b.right,documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      scientificText:root.textContent??''};
  },Object.keys(ceilingRoles));
}
function acceptCeiling(m:CeilingMeasure,width:number){
  expect(m.documentOverflow,'page should not horizontally scroll').toBeLessThanOrEqual(2);
  expect(m.rootLeft).toBeGreaterThanOrEqual(-2);
  expect(m.rootRight).toBeLessThanOrEqual(width+2);
  for(const [selector,min] of Object.entries(ceilingRoles)){
    const role=m.roles[selector];
    if(!role)throw Error('Unmeasured '+selector);
    expect(role.size,selector+' readable size').toBeGreaterThanOrEqual(min);
    expect(role.family,selector+' interface instead of decorative monospace').toMatch(/Inter|PingFang|system-ui/);
    expect(role.style,selector+' normal style').toBe('normal');
    expect(role.weight,selector+' reasonable weight').toBeLessThanOrEqual(700);
    expect(role.width,selector+' visible width').toBeGreaterThan(0);
    expect(role.overflow,selector+' no clipped text').toBeLessThanOrEqual(2);
    if(!selector.startsWith('.ceiling__compare ')){
      expect(role.left,selector+' left edge').toBeGreaterThanOrEqual(-2);
      expect(role.right,selector+' right edge').toBeLessThanOrEqual(width+2);
    }
  }
  expect(m.table.rows,'preserve all old/new Stage2 method comparison rows').toBe(4);
  expect(m.table.headings).toBe(3);
  expect(m.table.viewportWidth).toBeGreaterThan(200);
  expect(m.table.tabIndex).toBe(0);
  if(width===390)expect(m.table.scrollWidth,'large scientific table scrolls inside its wrapper').toBeGreaterThan(m.table.viewportWidth+100);
  for(const fact of ['49.33 / 100','58','128','20,480','19,072','149','89.7 / 100','Ceiling-1.0'])
    expect(m.scientificText,'retain sealed 7B scientific copy').toContain(fact);
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('Ceiling-1.0 historical 7B final and scrollable table '+width+'/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(ceilingRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const details=page.locator('[data-testid="ceiling-7b-archive-identity"]');
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open','');
      const good=await measureCeiling(page);
      acceptCeiling(good,width);
      writeFileSync(info.outputPath('ceiling-7b-'+width+'-'+theme+'.json'),
        JSON.stringify({sha:process.env.CI_HEAD_SHA??'local',width,theme,route:ceilingRoute,good},null,2));
      // Unmodified viewport witness preserves the real sticky navigation.
      // Element screenshot auto-scroll can otherwise put a valid card under
      // the sticky nav; hide ONLY chrome during the evidence crop (not tests).
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({
        path:info.outputPath('ceiling-unmodified-viewport-'+width+'-'+theme+'.png'),animations:'disabled'});
      await page.locator(ceilingRoot+' .ceiling__arm-status').first().screenshot({
        path:info.outputPath('ceiling-7b-final-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
      await page.locator(ceilingRoot+' .ceiling__compare').screenshot({
        path:info.outputPath('ceiling-stage2-table-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
    });
  }
}
test('Ceiling-1.0 9px status and header regression is rejected by the SAME geometry predicate',async({page})=>{
  const width=390;
  await page.setViewportSize({width,height:844});
  const response=await page.goto(ceilingRoute,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const details=page.locator('[data-testid="ceiling-7b-archive-identity"]');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open','');
  acceptCeiling(await measureCeiling(page),width);
  const css=await page.addStyleTag({content:
    '.ceiling__hero>div>p{font:850 9px/1 monospace!important}'+
    '.ceiling__compare thead th{font-size:9px!important}'});
  const broken=await measureCeiling(page);
  expect(broken.roles['.ceiling__hero>div>p']!.size).toBeLessThan(10);
  expect(broken.roles['.ceiling__compare thead th']!.size).toBeLessThan(10);
  expect(()=>acceptCeiling(broken,width)).toThrow();
  await css.evaluate(node=>node.parentNode?.removeChild(node));
  acceptCeiling(await measureCeiling(page),width);
});


test('metric zoom control is keyboard operated and returns to compact state',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(metricZoomRoute,{waitUntil:'domcontentloaded'});
  const figure=page.locator('.metric-evidence').first();
  const toggle=figure.locator('[data-metric-zoom]');
  const viewport=figure.locator('.metric-evidence__viewport');
  const hint=figure.locator('[data-metric-scroll-hint]');
  const image=figure.locator('img');
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(node=>(node as HTMLImageElement).naturalWidth)).toBe(1200);
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(viewport).toBeFocused();
  await expect(hint).toBeVisible();
  acceptMetricZoom(await readMetricZoom(figure),true);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(hint).toBeHidden();
  acceptMetricZoom(await readMetricZoom(figure),false);
});

test('scientific metric SVG and source links remain available without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{
    const page=await context.newPage();
    const response=await page.goto(metricZoomRoute,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const figures=page.locator('.metric-evidence');
    await expect(figures).toHaveCount(7);
    const first=figures.first();
    await expect(first.locator('img')).toBeVisible();
    await expect(first.locator('[data-metric-zoom]')).toBeHidden();
    await expect(first.locator('[data-metric-scroll-hint]')).toBeHidden();
    await expect(first.getByRole('link',{name:/原尺寸打开/})).toHaveAttribute('href',/wandb-threeway\/task-score\.svg$/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  }finally{
    await context.close();
  }
});

// Historical Q17 frontier roadmap typography and scientific chart glyphs (WP-D6).
// The historic Sept-10 investigation is not the later sealed same-task result.
const frontierRoute='/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/';
const frontierRoot='[data-reader-frontier]';
const frontierRoles={
  '.frontier-hero .eyebrow':16,
  '.frontier-hero h2':28,
  '.frontier-hero .lede':18,
  '.frontier-section-kicker':16,
  '.metric-grid article span':16,
  '.metric-grid article strong':22,
  '.metric-grid article p':16,
  '.blank-card b':22,
  '.experiment-list li>span':16,
  '.experiment-list h3':17,
  '.plateau-visual-head h3':20,
  '.training-chart figcaption':16,
  '.training-chart figcaption span':16,
  '.plateau-source':16,
} as const;
type Q17ChartMeasure={width:number;height:number;labels:{text:string;size:number;family:string;weight:number;x:number;y:number;right:number;bottom:number}[]};
type Q17Measure={roles:Record<string,{size:number;weight:number;family:string;style:string;leading:number;scroll:number;client:number;left:number;right:number;width:number}>;
  rootLeft:number;rootRight:number;documentOverflow:number;metrics:number;placeholders:number;charts:Q17ChartMeasure[];text:string};
async function measureQ17(page:import('@playwright/test').Page):Promise<Q17Measure>{
  return page.evaluate((selectors)=>{
    const root=document.querySelector<HTMLElement>('[data-reader-frontier]');
    if(!root)throw Error('Historical Q17 frontier component missing');
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector<HTMLElement>(selector);
      if(!el)throw Error('No historical reader role '+selector);
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return [selector,{size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight),family:s.fontFamily,
        style:s.fontStyle,leading:parseFloat(s.lineHeight),scroll:el.scrollWidth,client:el.clientWidth,
        left:r.left,right:r.right,width:r.width}];
    })) as Q17Measure['roles'];
    const charts=[...root.querySelectorAll<SVGSVGElement>('.training-chart svg')].map(svg=>({
      width:svg.viewBox.baseVal.width,height:svg.viewBox.baseVal.height,
      labels:[...svg.querySelectorAll<SVGTextElement>('.chart-label')].map(el=>{
        const css=getComputedStyle(el),rect=el.getBBox();
        return {text:el.textContent?.trim()??'',size:parseFloat(css.fontSize),family:css.fontFamily,
          weight:parseFloat(css.fontWeight),x:rect.x,y:rect.y,right:rect.x+rect.width,bottom:rect.y+rect.height};
      })
    }));
    const r=root.getBoundingClientRect();
    return {roles,charts,rootLeft:r.left,rootRight:r.right,
      documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      metrics:root.querySelectorAll('.metric-grid article').length,
      placeholders:root.querySelectorAll('.blank-grid .blank-card').length,
      text:root.textContent??''};
  },Object.keys(frontierRoles));
}
function acceptQ17(m:Q17Measure,width:number){
  expect(m.documentOverflow,'Q17 document overflow').toBeLessThanOrEqual(2);
  expect(m.rootLeft).toBeGreaterThanOrEqual(-2);
  expect(m.rootRight).toBeLessThanOrEqual(width+2);
  for(const [key,min]of Object.entries(frontierRoles)){
    const role=m.roles[key];
    if(!role)throw Error('Missing measured Q17 role '+key);
    expect(role.size,key+' minimum').toBeGreaterThanOrEqual(min);
    expect(role.family,key+' standard interface family').toMatch(/Inter|PingFang|system-ui/);
    expect(role.style,key+' regular presentation').toBe('normal');
    expect(role.weight,key+' not heavy decorative text').toBeLessThanOrEqual(700);
    expect(role.width,key+' visible width').toBeGreaterThan(0);
    expect(role.scroll-role.client,key+' no clipped prose').toBeLessThanOrEqual(2);
    expect(role.left,key+' left edge').toBeGreaterThanOrEqual(-2);
    expect(role.right,key+' right edge').toBeLessThanOrEqual(width+2);
  }
  expect(m.roles['.frontier-hero h2']!.size).toBeGreaterThan(m.roles['.frontier-section-kicker']!.size);
  expect(m.metrics,'historic four observed measures').toBe(4);
  expect(m.placeholders,'unrun four plans must not become results').toBe(4);
  expect(m.charts,'two original R0–R97 scientific plots').toHaveLength(2);
  expect(m.charts[0]!.labels).toHaveLength(6);
  expect(m.charts[1]!.labels).toHaveLength(5);
  for(const [i,chart] of m.charts.entries()){
    expect(chart.width).toBeGreaterThan(0);expect(chart.height).toBeGreaterThan(0);
    for(const tick of chart.labels){
      expect(tick.size,'tick '+tick.text+' size').toBeGreaterThanOrEqual(11.9);
      expect(tick.family,'tick '+tick.text+' not mono').toMatch(/Inter|PingFang|system-ui/);
      expect(tick.weight).toBeLessThanOrEqual(650);
      expect(tick.x,'plot '+i+' left label '+tick.text).toBeGreaterThanOrEqual(-1);
      expect(tick.y,'plot '+i+' top label '+tick.text).toBeGreaterThanOrEqual(-1);
      expect(tick.right,'plot '+i+' right label '+tick.text).toBeLessThanOrEqual(chart.width+1);
      expect(tick.bottom,'plot '+i+' bottom label '+tick.text).toBeLessThanOrEqual(chart.height+1);
    }
  }
  for(const fact of ['111 / 122','49.90 → 63.52','25.62% → 34.38%','未运行','R70–79','SD-LoRA'])
    expect(m.text,'unchanged historical evidence').toContain(fact);
}
for(const width of [390,768,1440]as const){
  for(const theme of ['light','dark']as const){
    test('Q17 historical roadmap and two original chart axes '+width+'/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(frontierRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      // This historical component is intentionally mounted beneath a closed
      // native details. A reader must explicitly reveal it before visual review.
      const historical=page.locator('.q17-roadmap-depth > details');
      await expect(historical).not.toHaveAttribute('open','');
      await historical.locator(':scope > summary').click();
      await expect(historical).toHaveAttribute('open','');
      await expect(page.locator(frontierRoot)).toBeVisible();
      await page.evaluate(()=>document.fonts.ready);
      const measurement=await measureQ17(page);
      acceptQ17(measurement,width);
      writeFileSync(info.outputPath('q17-frontier-'+width+'-'+theme+'.json'),
        JSON.stringify({width,theme,route:frontierRoute,head:process.env.CI_HEAD_SHA??'local',measurement},null,2));
      await page.locator(frontierRoot+' .frontier-hero').screenshot({
        path:info.outputPath('q17-frontier-hero-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
      await page.locator(frontierRoot+' .metric-grid').first().screenshot({
        path:info.outputPath('q17-frontier-metrics-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
      await page.locator(frontierRoot+' .plateau-charts').screenshot({
        path:info.outputPath('q17-frontier-charts-'+width+'-'+theme+'.png'),animations:'disabled',
        style:'.site-header,.research-navigation{visibility:hidden}'});
    });
  }
}
test('Q17 retro 9px scientific title and 7px SVG ticks fail the SAME acceptance function',async({page})=>{
  const width=390;
  await page.setViewportSize({width,height:844});
  const response=await page.goto(frontierRoute,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const historical=page.locator('.q17-roadmap-depth > details');
  await historical.locator(':scope > summary').click();
  await expect(historical).toHaveAttribute('open','');
  await expect(page.locator(frontierRoot)).toBeVisible();
  acceptQ17(await measureQ17(page),width);
  const style=await page.addStyleTag({content:
    '.frontier-section-kicker{font:800 9px/1 monospace!important}'+
    '.training-chart .chart-label{font:700 7px/1 monospace!important}'});
  const wrong=await measureQ17(page);
  expect(wrong.roles['.frontier-section-kicker']!.size).toBeLessThan(10);
  expect(wrong.charts[0]!.labels[0]!.size).toBeLessThan(8);
  expect(()=>acceptQ17(wrong,width)).toThrow();
  await style.evaluate(el=>el.parentNode?.removeChild(el));
  acceptQ17(await measureQ17(page),width);
});

// The two Q17 owners use inline, source-preserving SVGs rather than an image.
// Their original 10–12px plot labels can become ~4–7px after the 700/760px chart
// is squeezed into a phone column. Compact previews remain visible; the same
// scientific SVG must become legible at its native coordinate width on demand.
const q17NativeReaders=[
  {route:'/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/', widths:[760,400]},
  {route:'/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/', widths:[700,360]},
] as const;
const readQ17Native=async (reader:import('@playwright/test').Locator)=>reader.evaluate(root=>{
  const input=root.querySelector<HTMLInputElement>('.native-svg-reader__toggle');
  const viewport=root.querySelector<HTMLElement>('.native-svg-reader__viewport');
  const svg=viewport?.querySelector<SVGSVGElement>('svg');
  const tick=svg?.querySelector<SVGTextElement>('text');
  const hint=root.querySelector<HTMLElement>('.native-svg-reader__hint');
  if(!input||!viewport||!svg||!tick||!hint)throw Error('Native Q17 scientific chart is missing');
  const size=svg.getBoundingClientRect().width;
  const intrinsic=svg.viewBox.baseVal.width;
  return {
    checked:input.checked,native:intrinsic,drawn:size,tickPixels:parseFloat(getComputedStyle(tick).fontSize)*size/intrinsic,
    client:viewport.clientWidth,scroll:viewport.scrollWidth,overflow:getComputedStyle(viewport).overflowX,
    tabindex:viewport.tabIndex,hintVisible:getComputedStyle(hint).display!=='none',
    documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    svgText:svg.textContent?.trim(),
  };
});
type Q17NativeReceipt=Awaited<ReturnType<typeof readQ17Native>>;
function acceptQ17Native(m:Q17NativeReceipt,nativeWidth:number,expanded:boolean){
  expect(m.native,'scientific viewBox data stay unchanged').toBe(nativeWidth);
  expect(m.documentOverflow,'no document-wide horizontal scrolling').toBeLessThanOrEqual(2);
  expect(m.tabindex,'local chart supports keyboard scrolling').toBe(0);
  expect(m.checked).toBe(expanded);
  expect(m.hintVisible,'the scroll hint follows zoom state').toBe(expanded);
  expect(m.svgText).toMatch(/R0|R159|R97/);
  if(expanded){
    expect(m.drawn,'render SVG at source-native width').toBeGreaterThanOrEqual(nativeWidth-1);
    expect(m.drawn).toBeLessThanOrEqual(nativeWidth+1);
    expect(m.tickPixels,'native 10px labels must remain physically readable').toBeGreaterThanOrEqual(9.8);
    expect(m.overflow).toBe('auto');
    expect(m.scroll).toBeGreaterThanOrEqual(m.client);
  }else{
    expect(m.drawn,'compact chart must fit its local preview column').toBeLessThanOrEqual(m.client+2);
  }
}
for(const chart of q17NativeReaders){
  for(const width of [390,768,1440] as const)for(const theme of ['light','dark'] as const){
    test('Q17 native scientific SVG reader '+chart.route+' '+width+'/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      const response=await page.goto(chart.route,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      if(chart.route===frontierRoute){
        const historical=page.locator('.q17-roadmap-depth > details');
        await historical.locator(':scope > summary').click();
        await expect(historical).toHaveAttribute('open','');
      }
      await page.evaluate(()=>document.fonts.ready);
      const readers=page.locator('[data-native-svg-reader]');
      await expect(readers).toHaveCount(2);
      const measurements=[];
      for(let i=0;i<chart.widths.length;i++){
        const nativeWidth=chart.widths[i]!;
        const reader=readers.nth(i);
        const toggle=reader.locator('input[type="checkbox"]');
        const viewport=reader.locator('.native-svg-reader__viewport');
        const hint=reader.locator('.native-svg-reader__hint');
        await expect(hint).toBeHidden();
        acceptQ17Native(await readQ17Native(reader),nativeWidth,false);
        await reader.locator('label').click();
        await expect(toggle).toBeChecked();
        await expect(hint).toBeVisible();
        await expect(hint).toContainText('左右滑动');
        const expanded=await readQ17Native(reader);
        acceptQ17Native(expanded,nativeWidth,true);
        if(width===390 && i===0){
          expect(expanded.scroll).toBeGreaterThan(expanded.client+30);
          const localScroll=await viewport.evaluate(element=>{
            element.scrollLeft=120;
            const position=element.scrollLeft;
            element.scrollLeft=0;
            return position;
          });
          expect(localScroll).toBeGreaterThan(0);
        }
        measurements.push({index:i,...expanded});
        // The complete Figure includes caption, toggle, hint, and the SVG.
        await reader.locator('xpath=..').screenshot({
          path:info.outputPath('q17-full-figure-'+nativeWidth+'-'+width+'-'+theme+'.png'),
          animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'
        });
        await reader.locator('label').click();
        await expect(toggle).not.toBeChecked();
        await expect(hint).toBeHidden();
        acceptQ17Native(await readQ17Native(reader),nativeWidth,false);
      }
      await info.attach('q17-svg-reader.json',{body:Buffer.from(JSON.stringify({route:chart.route,width,theme,measurements},null,2)),contentType:'application/json'});
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:info.outputPath('q17-original-viewport-'+width+'-'+theme+'.png'),animations:'disabled'});
    });
  }
}
test('Q17 native-size readability gate rejects injected old mobile SVG squeeze',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(q17NativeReaders[0].route,{waitUntil:'domcontentloaded'});
  const reader=page.locator('[data-native-svg-reader]').first();
  await reader.locator('label').click();
  acceptQ17Native(await readQ17Native(reader),760,true);
  const injected=await page.addStyleTag({content:'.native-svg-reader__viewport svg {width:100% !important;max-width:100% !important}'});
  const old=await readQ17Native(reader);
  expect(old.tickPixels).toBeLessThan(7);
  expect(()=>acceptQ17Native(old,760,true)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  acceptQ17Native(await readQ17Native(reader),760,true);
});
test('Q17 native SVG zoom and local scroll work with JavaScript disabled',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{
    const page=await context.newPage();
    const response=await page.goto(q17NativeReaders[1].route,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const historical=page.locator('.q17-roadmap-depth > details');
    await historical.locator(':scope > summary').click();
    await expect(historical).toHaveAttribute('open','');
    const reader=page.locator('[data-native-svg-reader]').first();
    await expect(reader.locator('svg')).toBeVisible();
    await reader.locator('input').focus();
    await page.keyboard.press('Space');
    await expect(reader.locator('input')).toBeChecked();
    await expect(reader.locator('.native-svg-reader__hint')).toBeVisible();
    acceptQ17Native(await readQ17Native(reader),700,true);
    await page.keyboard.press('Space');
    await expect(reader.locator('input')).not.toBeChecked();
    acceptQ17Native(await readQ17Native(reader),700,false);
  }finally{
    await context.close();
  }
});

// The landscape chart is ECharts/SVG, not HTML prose. A prior 11px legend was
// unreadable on phones despite zero document overflow. Verify actual SVG text.
const readLandscapeLabels=async(page:import('@playwright/test').Page)=>page.locator('.landscape-chart').evaluate(root=>{
  const svg=root.querySelector('svg');
  const nodes=[...root.querySelectorAll<SVGTextElement>('svg text')].filter(node=>node.textContent?.trim());
  if(!svg||nodes.length<3)throw Error('Landscape ECharts labels did not render');
  return {labels:nodes.map(node=>({text:node.textContent?.trim(),size:parseFloat(getComputedStyle(node).fontSize)})),count:nodes.length,min:Math.min(...nodes.map(node=>parseFloat(getComputedStyle(node).fontSize))),
    max:Math.max(...nodes.map(node=>parseFloat(getComputedStyle(node).fontSize))),
    documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
});
const acceptLandscapeLabels=(m:Awaited<ReturnType<typeof readLandscapeLabels>>)=>{
  expect(m.count).toBeGreaterThanOrEqual(3);
  expect(m.min,'ECharts axis and legend text must be readable: '+JSON.stringify(m.labels)).toBeGreaterThanOrEqual(12.9);
  expect(m.max).toBeGreaterThanOrEqual(13.9);
  expect(m.documentOverflow).toBeLessThanOrEqual(2);
};
for(const width of [390,1440] as const)for(const theme of ['light','dark'] as const){
  test('Landscape ECharts legend and ticks '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:width===390?844:900});
    await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    const response=await page.goto('/landscape/',{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    const fullView=page.getByRole('button',{name:'完整视图'});
    await fullView.scrollIntoViewIfNeeded();
    await expect(page.locator('.landscape-controls')).toHaveAttribute('aria-busy','false');
    await expect(fullView).toBeEnabled();
    await fullView.click();
    await expect(page.locator('.landscape-chart svg')).toBeVisible();
    await expect.poll(async()=>page.locator('.landscape-chart svg text').count()).toBeGreaterThan(2);
    const witness=await readLandscapeLabels(page);
    acceptLandscapeLabels(witness);
    await info.attach('landscape-svg-labels.json',{body:Buffer.from(JSON.stringify({width,theme,...witness},null,2)),contentType:'application/json'});
    await page.locator('.landscape-chart-shell').screenshot({path:info.outputPath('landscape-figure-'+width+'-'+theme+'.png'),animations:'disabled',
      style:'.site-header,.research-navigation{visibility:hidden}'});
  });
}
test('Landscape label gate rejects injected 9px ECharts axis/legend text',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/landscape/',{waitUntil:'domcontentloaded'});
  const fullView=page.getByRole('button',{name:'完整视图'});
  await fullView.scrollIntoViewIfNeeded();
  await expect(page.locator('.landscape-controls')).toHaveAttribute('aria-busy','false');
  await expect(fullView).toBeEnabled();
  await fullView.click();
  await expect.poll(async()=>page.locator('.landscape-chart svg text').count()).toBeGreaterThan(2);
  acceptLandscapeLabels(await readLandscapeLabels(page));
  const style=await page.addStyleTag({content:'.landscape-chart svg text {font-size:9px !important}'});
  const bad=await readLandscapeLabels(page);
  expect(bad.min).toBeLessThan(10);
  expect(()=>acceptLandscapeLabels(bad)).toThrow();
  await style.evaluate(node=>node.parentNode?.removeChild(node));
  acceptLandscapeLabels(await readLandscapeLabels(page));
});
