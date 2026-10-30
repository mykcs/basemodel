import { persistJsonAttachment } from './evidence-json';
import { expect, test } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

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
    const containerWidth=await slide.evaluate(n=>parseFloat(getComputedStyle(n.closest('.sdlora-diagram-frame')??n.parentElement!).width));
    if(containerWidth<=900){
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
// This explicit narrowRecords producer keeps the 15px record-reading contract.
const acceptScientificCellSize=(pixels:number)=>expect(pixels).toBeGreaterThanOrEqual(15);
const acceptScientificTableFit=(m:{client:number;scroll:number;tableWidth:number})=>{expect(m.scroll,'complete scientific table fits its wrapper').toBeLessThanOrEqual(m.client+2);expect(m.tableWidth).toBeLessThanOrEqual(m.client+2);};

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
      expect(geometry.answer).toBeGreaterThanOrEqual(14);
      acceptScientificCellSize(geometry.table.size);
      acceptScientificCellSize(geometry.numeric.size);
      expect(geometry.caption.size).toBeGreaterThanOrEqual(width<=640?12:12.5);
      expect(geometry.numeric.family).toMatch(/Times|Noto Serif|Songti|SimSun/);
      expect(geometry.numeric.style).toBe('normal');
      expect(geometry.rootOverflow).toBeLessThanOrEqual(2);
      expect(geometry.holder.left).toBeGreaterThanOrEqual(-2);
      expect(geometry.holder.right).toBeLessThanOrEqual(width+2);
      acceptScientificTableFit({...geometry.holder,tableWidth:geometry.tableWidth});
      const label='advisor-q02-'+width+'-'+theme;
      await scroller.screenshot({path:testInfo.outputPath(label+'.png'),animations:'disabled',
        style:'.site-header { visibility: hidden; }'});
    });
  }
}

test('former 13px data and a clipped oversized table fail the actual advisor predicates',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(advisorTableRoute,{waitUntil:'domcontentloaded'});
  const cell=page.locator(advisorTableSelector+' tbody td[data-numeric]').first();
  const scroller=page.locator(advisorTableSelector+' .advisor-result-matrix__wrap');
  const readSize=()=>cell.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
  const readFit=()=>scroller.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth,tableWidth:node.querySelector('table')!.getBoundingClientRect().width}));
  acceptScientificCellSize(await readSize());acceptScientificTableFit(await readFit());
  const injected=await page.addStyleTag({content:`
    .evo-approved-reader .advisor-result-matrix tbody td[data-numeric]{font-size:13px!important}
    .advisor-result-matrix table{width:1600px!important;min-width:1600px!important;max-width:none!important}
    .advisor-result-matrix__wrap{overflow-x:hidden!important}
  `});
  const brokenSize=await readSize();expect(brokenSize).toBeLessThan(15);
  expect(()=>acceptScientificCellSize(brokenSize)).toThrow();
  const broken=await readFit();expect(broken.scroll).toBeGreaterThan(broken.client+2);
  expect(()=>acceptScientificTableFit(broken)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  acceptScientificCellSize(await readSize());acceptScientificTableFit(await readFit());
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
      await persistJsonAttachment(testInfo,'four-arm-type.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
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
      expect(r.local.scroll,'all plan columns fit without horizontal drag').toBeLessThanOrEqual(r.local.client+2);
      const region=page.locator('.per-arm-grid');
      await region.scrollIntoViewIfNeeded();
      // Two different proof surfaces: (1) true viewport with its live sticky navigation;
      // (2) tall component crop without floating navigation covering paragraphs in
      // the Playwright stitched element image. The latter is NOT a navigation acceptance.
      await page.screenshot({path:testInfo.outputPath('four-arm-viewport-'+width+'-'+theme+'.png'),
        animations:'disabled'});
      await region.screenshot({path:testInfo.outputPath('four-arm-evidence-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await persistJsonAttachment(testInfo,'four-arm-evidence-computed.json',{
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
  '#benchmark-answer-title .evo-article__heading-number':21,
  '.hero-answer p':14,
  '.answer-main>p':14,
  '.benchmark-callout>div small':13,
  '.benchmark-callout li span':13,
  '.fit-head small':13,
  '.fit-row>div:first-child span':13,
  '.fit-row>strong':13,
  '.comparison thead th':15,
  '.comparison tbody td':15,
  '.boundary':14,
  '.budget-flow p':14,
  '.resource-cards dd':13,
  '.repro-copy>p':14,
  '.repro-checks span':13,
  '.provenance a':13,
  '.provenance p':14,
  '.resource-cards header b':13,
  '.resource-cards article.combined>p':14,
  '.reconcile-row span':13,
  '.reconcile-row b':15,
  '.reconcile footer span':13,
  '.bill-strip span':13,
  '.bill-strip b':15,
  '.bill-strip small':13,
  '.protocol b':15,
  '.protocol span':15,
  '.frontier__lead':14,
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
    if(selector.startsWith('.comparison '))expect(role.family,selector+' native paper family').toMatch(/Times|Noto Serif|Songti|SimSun/);
    else expect(role.family,selector+' article system family').toMatch(/Inter|PingFang|system-ui|Segoe UI|Arial/);
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
  expect(m.table.width).toBeLessThanOrEqual(m.wrap.client+2);
  expect(m.wrap.scroll).toBeLessThanOrEqual(m.wrap.client+2);
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
      await persistJsonAttachment(testInfo,'minimax-roles.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
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
    await persistJsonAttachment(testInfo,'metric-original-size.json',{body:Buffer.from(JSON.stringify({width,theme,...receipt},null,2)),contentType:'application/json'});
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
  const style=await page.addStyleTag({content:'.metric-evidence__viewport.is-expanded a,.metric-evidence__viewport.is-expanded img{width:100% !important;min-width:0 !important;max-width:100% !important}'});
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
  '.ceiling__hero>div>p':14,
  '.ceiling__hero aside span':16,
  '.ceiling__hero aside strong':16,
  '.ceiling__hero aside small':16,
  '.ceiling__budget b':20,
  '.ceiling__budget span':16,
  '.ceiling__rounds b':20,
  '.ceiling__rounds p':14,
  '.ceiling__learning-list span':16,
  '.ceiling__compare thead th':15,
  '.ceiling__compare tbody th':15,
  '.ceiling__compare tbody td':15,
  '.ceiling__arm-status article>span':16,
  '.ceiling__arm-status article>strong':14,
  '.ceiling__arm-status article p':14,
  '.ceiling__provenance summary':16,
  '.ceiling__provenance dt':16,
  '.ceiling__provenance small':16,
  '.ceiling__provenance nav a':16,
} as const;
type CeilingMeasure={
  roles:Record<string,{size:number;family:string;weight:number;style:string;width:number;overflow:number;left:number;right:number;concealedHeader:boolean}>;
  table:{viewportWidth:number;scrollWidth:number;rows:number;headings:number;tabIndex:number;labels:Array<{expected:string;label:string;actual:string;size:number}>};
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
        style:style.fontStyle,width:rect.width,overflow:el.scrollWidth-el.clientWidth,left:rect.left,right:rect.right,concealedHeader:!!el.closest('thead')&&getComputedStyle(el.closest('thead')!).position==='absolute'}];
    })) as CeilingMeasure['roles'];
    const b=root.getBoundingClientRect();
    const nativeHeaders=[...wrapper.querySelectorAll('thead th')].map(cell=>cell.textContent?.replace(/\s+/g,' ').trim()??'');
    return {roles,table:{viewportWidth:wrapper.clientWidth,scrollWidth:wrapper.scrollWidth,
      rows:wrapper.querySelectorAll('tbody tr').length,headings:wrapper.querySelectorAll('thead th').length,
      tabIndex:wrapper.tabIndex,labels:[...wrapper.querySelectorAll<HTMLTableCellElement>('tbody td')].map(cell=>({expected:nativeHeaders[cell.cellIndex]??'',label:cell.dataset.paperLabel??'',actual:getComputedStyle(cell,'::before').content.replace(/^['"]|['"]$/g,''),size:parseFloat(getComputedStyle(cell,'::before').fontSize)}))},
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
    if(selector.startsWith('.ceiling__compare '))expect(role.family,selector+' native paper family').toMatch(/Times|Noto Serif|Songti|SimSun/);
    else expect(role.family,selector+' system reading family').toMatch(/Inter|PingFang|system-ui|Segoe UI|Arial/);
    expect(role.style,selector+' normal style').toBe('normal');
    expect(role.weight,selector+' reasonable weight').toBeLessThanOrEqual(700);
    if(!role.concealedHeader){expect(role.width,selector+' visible width').toBeGreaterThan(0);expect(role.overflow,selector+' no clipped text').toBeLessThanOrEqual(2);}
    if(!selector.startsWith('.ceiling__compare ')){
      expect(role.left,selector+' left edge').toBeGreaterThanOrEqual(-2);
      expect(role.right,selector+' right edge').toBeLessThanOrEqual(width+2);
    }
  }
  expect(m.table.rows,'preserve all old/new Stage2 method comparison rows').toBe(4);
  expect(m.table.headings).toBe(3);
  expect(m.table.viewportWidth).toBeGreaterThan(200);
  expect(m.table.tabIndex).toBe(0);
  expect(m.table.scrollWidth,'complete comparison fits without horizontal drag').toBeLessThanOrEqual(m.table.viewportWidth+2);
  if(width<=760){expect(m.table.labels).toHaveLength(8);for(const label of m.table.labels){expect(label.expected).not.toBe('');expect(label.label).toBe(label.expected);expect(label.actual).toBe(label.expected);expect(label.size).toBeGreaterThanOrEqual(15);}}
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
    '.ceiling__compare thead th,.ceiling__compare tbody td{font-size:9px!important}'});
  const broken=await measureCeiling(page);
  expect(broken.roles['.ceiling__hero>div>p']!.size).toBeLessThan(10);
  expect(broken.roles['.ceiling__compare thead th']!.size).toBeLessThan(10);
  expect(broken.roles['.ceiling__compare tbody td']!.size).toBeLessThan(10);
  expect(()=>acceptCeiling(broken,width)).toThrow();
  await css.evaluate(node=>node.parentNode?.removeChild(node));
  acceptCeiling(await measureCeiling(page),width);
  const value=page.locator(ceilingRoot+' .ceiling__compare tbody td').first(),saved=await value.getAttribute('data-paper-label');
  await value.evaluate(cell=>cell.setAttribute('data-paper-label','错误列名'));const wrongColumn=await measureCeiling(page);expect(()=>acceptCeiling(wrongColumn,width)).toThrow();
  await value.evaluate((cell,label)=>cell.setAttribute('data-paper-label',label!),saved);acceptCeiling(await measureCeiling(page),width);
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
  '.frontier-hero h2':21,
  '.frontier-hero .lede':14,
  '#known-now .evo-article__heading-number':21,
  '.metric-grid article span':16,
  '.metric-grid article strong':18,
  '.metric-grid article p':14,
  '.blank-card b':22,
  '.experiment-list li>span':16,
  '.experiment-list h3':17,
  '.plateau-visual-head h3':18,
  '.training-chart figcaption':14,
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
  expect(m.roles['.frontier-hero h2']!.size).toBeGreaterThan(m.roles['.frontier-hero .lede']!.size);
  expect(m.roles['#known-now .evo-article__heading-number']!.size).toBe(m.roles['.frontier-hero h2']!.size);
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
    '#known-now .evo-article__heading-number{font:800 9px/1 monospace!important}'+
    '.training-chart .chart-label{font:700 7px/1 monospace!important}'});
  const wrong=await measureQ17(page);
  expect(wrong.roles['#known-now .evo-article__heading-number']!.size).toBeLessThan(10);
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
    expect(m.tickPixels,'expanded scientific labels remain physically readable').toBeGreaterThanOrEqual(12);
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
      const readerReceipt=JSON.stringify({route:chart.route,width,theme,head:process.env.CI_HEAD_SHA??'local',measurements},null,2);
      writeFileSync(info.outputPath('q17-svg-reader.json'),readerReceipt);
      await persistJsonAttachment(info,'q17-svg-reader.json',{body:Buffer.from(readerReceipt),contentType:'application/json'});
      await page.evaluate(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
      await expect.poll(()=>page.evaluate(()=>window.scrollY),'original viewport screenshot starts at the top').toBe(0);
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
  const injected=await page.addStyleTag({content:'.native-svg-reader__viewport svg {width:100% !important;min-width:0 !important;max-width:100% !important}'});
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
for(const width of [390,768,1440] as const)for(const theme of ['light','dark'] as const){
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
    const landscapeReceipt=JSON.stringify({width,theme,head:process.env.CI_HEAD_SHA??'local',...witness},null,2);
    writeFileSync(info.outputPath('landscape-svg-labels.json'),landscapeReceipt);
    await persistJsonAttachment(info,'landscape-svg-labels.json',{body:Buffer.from(landscapeReceipt),contentType:'application/json'});
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
// These witnesses came from exact source-to-scoped-DOM matching, not a blanket
// assumption that every literal size is a defect. Keep concurrent rewrites out.
type ScopedMigrationWitness = {file:string;selector:string;route:string;text:string;minimum:number;role:string;maximumVisibleWidth:number|null;minimumVisibleWidth:number|null;ordinaryFace?:boolean;codeFaceException?:{kind:'SEMANTIC_CODE_OR_CONFIG';file:string;selector:string;producer:string;scope:string};readerOwner?:'article'|'product';faceOwner?:'system-sans'|'paper-serif'|'interface';maximumWeight?:number;localViewport?:boolean;visibilityContainerSelector?:string;maximumVisibleContainerWidth?:number|null;minimumVisibleContainerWidth?:number|null;minimumApplicableWidth?:number|null;maximumApplicableWidth?:number|null};
const historicalScopedMigrationWitnesses = JSON.parse(readFileSync(new URL('../../docs/agents/evidence/sitewide-typography/2026-10-22/scoped-migration-witnesses.json', import.meta.url), 'utf8')).witnesses as ScopedMigrationWitness[];
const flowRoute = '/research/seed-openevo/flow/';
// Preserve the 2026-10-22 historical witness receipt byte-for-byte. The 2026-10-29
// Intelligence UI replaced these exact text/selector pairs; they must no longer
// masquerade as current-page observations, while unaffected witnesses remain live.
const obsoleteFlowWitness = (row: ScopedMigrationWitness) => row.route === flowRoute && (
  (row.selector === '.mission-section__heading h2' && row.text.startsWith('01 模型、任务与比较范围')) ||
  row.selector.startsWith('.responsibility-flow') ||
  row.selector === '.stage2-bridge' ||
  row.selector === '.mission-hero.mission-hero--compact .mission-hero__boundary' ||
  row.selector === '.mission-hero.mission-hero--compact .mission-hero__lede'
);
const currentFlowWitnesses: ScopedMigrationWitness[] = [
  {file:'src/components/research/SeedOpenEvoResearchHub.astro',selector:'.mission-section__heading h2',route:flowRoute,text:'01 SEED × OpenEVO 两阶段学习范式',minimum:21,role:'heading',minimumVisibleWidth:null,maximumVisibleWidth:null,faceOwner:'system-sans'},
  {file:'src/components/research/SeedOpenEvoTrainingDesignOverview.astro',selector:'.intelligence-stage__header h4',route:flowRoute,text:'外部经验引导的能力初始化',minimum:18,role:'heading',minimumVisibleWidth:null,maximumVisibleWidth:null},
  {file:'src/components/research/SeedOpenEvoTrainingDesignOverview.astro',selector:'.intelligence-method__action',route:flowRoute,text:'采集 WebShop 任务轨迹',minimum:14,role:'method',minimumVisibleWidth:null,maximumVisibleWidth:null},
  {file:'src/components/research/SeedOpenEvoTrainingDesignOverview.astro',selector:'.intelligence-method__boundary',route:flowRoute,text:'本阶段不再调用 Stage 1 的外部高能力教师模型 API。',minimum:12,role:'boundary',minimumVisibleWidth:null,maximumVisibleWidth:null},
  {file:'src/components/research/SeedOpenEvoMissionHero.astro',selector:'.mission-hero.mission-hero--compact .mission-hero__lede',route:flowRoute,text:'两套方法都先借助外部高能力教师',minimum:14,role:'prose',minimumVisibleWidth:null,maximumVisibleWidth:null},
];
const scopedMigrationWitnesses = [...historicalScopedMigrationWitnesses.filter(row=>!obsoleteFlowWitness(row)),...currentFlowWitnesses];
const acceptScopedRole=(size:number,minimum:number,label:string)=>expect(size,label).toBeGreaterThanOrEqual(minimum);
type FaceOwner='interface'|'system-sans'|'paper-serif';
const acceptOrdinaryFace=(font:string,label:string,owner:FaceOwner='interface')=>{
  if(owner==='paper-serif'){
    expect(font,label+' scientific paper family').toMatch(/Times|Noto Serif|Songti|SimSun/);
    expect(font,label+' native table is not a code face').not.toMatch(/mono|Menlo|Consolas/i);
  }else{
    expect(font,label+' owned sans family').toMatch(owner==='system-sans'?/Inter|PingFang|system-ui|Segoe UI|Arial/:/^Inter\b/);
    expect(font,label+' ordinary reading').not.toMatch(/mono|Menlo|Consolas|Georgia|Times New Roman/i);
  }
};
for (const route of [...new Set(scopedMigrationWitnesses.map(row=>row.route))]) {
  const routeWitnesses = scopedMigrationWitnesses.filter(row => row.route === route);
  test('confirmed scoped typography readers '+route, async ({page}, info)=>{
    // Six viewport/theme passes over 70+ historical witnesses can exceed the
    // normal 90s total test budget even when individual assertions succeed.
    // WebKit needed just over 90s for 77 witnesses on study/results. Keep every
    // witness and all six views; extend only routes with that measured workload.
    if (routeWitnesses.length >= 70) test.setTimeout(180_000);
    for (const width of [390,768,1440]) for (const theme of ['light','dark']) {
      await page.setViewportSize({width,height:900});
      await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
      expect((await page.goto(route,{waitUntil:'domcontentloaded'}))?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipts=[];let faceNegative=false,weightNegative=false;
      for(const row of routeWitnesses.filter(row=>(row.minimumApplicableWidth==null||width>=row.minimumApplicableWidth)&&(row.maximumApplicableWidth==null||width<=row.maximumApplicableWidth))){
        const checksFace=row.ordinaryFace!==false && Boolean(row.faceOwner || row.ordinaryFace);
        const liveText=route==='/research/seed-openevo/flow/webshop/'&&row.selector==='.heldout span'&&row.text==='保留候选池'?'500':row.text;
        const node=page.locator(row.selector).filter({hasText:liveText}).first();
        await expect(node).toBeAttached();
        const container=row.visibilityContainerSelector
          ?await page.locator(row.visibilityContainerSelector).first().evaluate(n=>{const s=getComputedStyle(n);return {width:parseFloat(s.width),name:s.containerName,type:s.containerType};})
          :null;
        if(container){
          expect(Number.isFinite(container.width),'named reading container has measurable width').toBe(true);
          expect(container.name,'the witness follows the real SD-LoRA query container').toBe('sdlora-reading');
          expect(container.type).toBe('inline-size');
        }
        const visibilityWidth=container?.width??width;
        const maximumVisible=row.visibilityContainerSelector?row.maximumVisibleContainerWidth:row.maximumVisibleWidth;
        const minimumVisible=row.visibilityContainerSelector?row.minimumVisibleContainerWidth:row.minimumVisibleWidth;
        if((maximumVisible!=null&&visibilityWidth>maximumVisible)||(minimumVisible!=null&&visibilityWidth<minimumVisible)){
          await expect(node).toBeHidden();receipts.push({...row,expectedHidden:true,visibilityWidth,container});continue;
        }
        const ancestors=node.locator('xpath=ancestor::details');
        for(let i=0;i<await ancestors.count();i++){
          const disclosure=ancestors.nth(i);
          if(!await disclosure.evaluate(n=>(n as HTMLDetailsElement).open)){
            await disclosure.locator(':scope > summary').focus();
            await page.keyboard.press('Enter');
            await expect(disclosure).toHaveJSProperty('open',true);
          }
        }
        await expect(node).toBeVisible();
        if(row.codeFaceException){
          expect(row.ordinaryFace,'a code-family exception does not change size or geometry ownership').toBe(false);
          expect(row.codeFaceException.kind).toBe('SEMANTIC_CODE_OR_CONFIG');
          expect(row.codeFaceException.file).toBe(row.file);
          expect(row.codeFaceException.selector).toBe(row.selector);
          expect(row.codeFaceException.producer.trim().length).toBeGreaterThan(0);
          expect(await node.evaluate(n=>n.matches('code')||n.matches('.parameter-list dt')),row.selector+' is actual code or a configuration key').toBe(true);
        }
        if(row.faceOwner==='paper-serif')expect(await node.evaluate(n=>Boolean(n.closest('table[data-research-paper-table],table[data-q03-paper-table]'))),row.selector+' owns a native scientific table').toBe(true);
        if(row.faceOwner==='system-sans')expect(await node.evaluate(n=>Boolean(n.closest('.evo-approved-reader'))),row.selector+' owns an article system face').toBe(true);
        const measured=await node.evaluate(n=>{const s=getComputedStyle(n);return {size:parseFloat(s.fontSize),font:s.fontFamily,weight:Number(s.fontWeight),fontStyle:s.fontStyle,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,fontVariantNumeric:s.fontVariantNumeric,width:n.getBoundingClientRect().width,overflow:n.scrollWidth-n.clientWidth};});
        acceptScopedRole(measured.size,row.minimum,row.file+' '+row.selector);
        if(row.maximumWeight)expect(measured.weight,row.selector+' semantic emphasis').toBeLessThanOrEqual(row.maximumWeight);
        if(checksFace)acceptOrdinaryFace(measured.font,row.selector,row.faceOwner);
        if(width===390&&theme==='light'&&receipts.length===0){
          const saved=await node.getAttribute('style');
          await node.evaluate(n=>(n as HTMLElement).style.setProperty('font-size','9px','important'));
          const bad=await node.evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
          expect(bad).toBe(9);
          expect(()=>acceptScopedRole(bad,row.minimum,'injected unreadable label')).toThrow();
          await node.evaluate((n,old)=>old===null?n.removeAttribute('style'):n.setAttribute('style',old),saved);
          acceptScopedRole(await node.evaluate(n=>parseFloat(getComputedStyle(n).fontSize)),row.minimum,'restored reader');
        }
        if(width===390&&theme==='light'&&((checksFace&&!faceNegative)||(row.maximumWeight&&!weightNegative))){
          const saved=await node.getAttribute('style');
          if(checksFace&&!faceNegative){
            await node.evaluate(n=>(n as HTMLElement).style.setProperty('font-family','monospace','important'));
            const bad=await node.evaluate(n=>getComputedStyle(n).fontFamily);
            expect(()=>acceptOrdinaryFace(bad,row.selector+' ordinary face negative',row.faceOwner)).toThrow();
            await node.evaluate((n,paper)=>(n as HTMLElement).style.setProperty('font-family',paper?'Inter, sans-serif':'Georgia, serif','important'),row.faceOwner==='paper-serif');const wrongFace=await node.evaluate(n=>getComputedStyle(n).fontFamily);expect(()=>acceptOrdinaryFace(wrongFace,row.selector+' incompatible face negative',row.faceOwner)).toThrow();faceNegative=true;
          }
          if(row.maximumWeight&&!weightNegative){
            await node.evaluate(n=>(n as HTMLElement).style.setProperty('font-weight','900','important'));
            const bad=await node.evaluate(n=>Number(getComputedStyle(n).fontWeight));
            expect(()=>expect(bad,row.selector+' emphasis negative').toBeLessThanOrEqual(row.maximumWeight!)).toThrow();weightNegative=true;
          }
          await node.evaluate((n,old)=>old===null?n.removeAttribute('style'):n.setAttribute('style',old),saved);
          if(checksFace)acceptOrdinaryFace(await node.evaluate(n=>getComputedStyle(n).fontFamily),row.selector,row.faceOwner);
          if(row.maximumWeight)expect(await node.evaluate(n=>Number(getComputedStyle(n).fontWeight))).toBeLessThanOrEqual(row.maximumWeight);
        }
        if(row.localViewport){
          expect(await node.evaluate(n=>getComputedStyle(n).overflowX)).toMatch(/auto|scroll/);
          if(measured.overflow>2){await node.evaluate(n=>n.scrollLeft=80);expect(await node.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);await node.evaluate(n=>n.scrollLeft=0);}
        }else expect(measured.overflow,row.selector+' clipped').toBeLessThanOrEqual(2);
        receipts.push({...row,...measured,visibilityWidth,container});
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
      await persistJsonAttachment(info,'scoped-roles-'+width+'-'+theme+'.json',{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA??'local-dirty',route,width,theme,engine:info.project.name,receipts})),contentType:'application/json'});
      await page.screenshot({path:info.outputPath('scoped-viewport-'+width+'-'+theme+'.png'),animations:'disabled'});
    }
  });
}

for(const width of [390,768,821,960,1440])for(const theme of ['light','dark'] as const){
  test('WebShop split label containment '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/flow/webshop/');
    await page.evaluate(()=>document.fonts.ready);
    const figure=page.locator('.split-story');
    await figure.locator('.webshop-legacy-split > summary').focus();
    await page.keyboard.press('Enter');
    await expect(figure.locator('.webshop-legacy-split')).toHaveJSProperty('open',true);
    await expect(figure.locator('.orig-test span')).toBeVisible();
    await expect(figure.locator('.seed-heldout span')).toBeVisible();
    const measure=()=>figure.locator('.heldout span,.orig-test span,.seed-heldout span').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      const text=range.getBoundingClientRect(),segment=node.parentElement!.getBoundingClientRect();
      return {text:node.textContent,size:parseFloat(getComputedStyle(node).fontSize),left:text.left-segment.left,right:segment.right-text.right,top:text.top-segment.top,bottom:segment.bottom-text.bottom};
    }));
    const accept=(rows:Awaited<ReturnType<typeof measure>>)=>{
      expect(rows).toHaveLength(3);
      for(const row of rows){acceptScopedRole(row.size,13,row.text??'split label');for(const value of [row.left,row.right,row.top,row.bottom])expect(value,JSON.stringify(row)).toBeGreaterThanOrEqual(-2);}
    };
    const receipts=await measure();accept(receipts);
    const negatives=[];
    if(width===390&&theme==='light'){
      const label=figure.locator('.heldout span'),segment=figure.locator('.heldout');
      for(const [node,css] of [[label,'font-size:9px!important'],[segment,'width:1px!important;min-width:1px!important;max-width:1px!important;flex:0 0 1px!important']] as const){
        const saved=await node.getAttribute('style');
        try{
          await node.evaluate((element,value)=>element.setAttribute('style',value),css);
          const bad=await measure();
          if(node===label)expect(bad.some(row=>row.size===9)).toBe(true);
          else expect(bad.some(row=>[row.left,row.right,row.top,row.bottom].some(value=>value < -2))).toBe(true);
          expect(()=>accept(bad)).toThrow();negatives.push({css,measurements:bad,rejected:true});
        }finally{await node.evaluate((element,value)=>value===null?element.removeAttribute('style'):element.setAttribute('style',value),saved);}
        accept(await measure());
      }
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    const visibleText=await figure.locator('.reference-strip small,.reference-strip strong,.reference-strip span,.reference-strip a,.total > *, .paper-boundary p, :scope > figcaption').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);const text=range.getBoundingClientRect(),owner=node.closest('.split-story')!.getBoundingClientRect();
      return{text:node.textContent,left:text.left-owner.left,right:owner.right-text.right,width:text.width};
    }));
    for(const row of visibleText){expect(row.width).toBeGreaterThan(0);expect(row.left).toBeGreaterThanOrEqual(-2);expect(row.right).toBeGreaterThanOrEqual(-2);}
    expect(await page.evaluate(()=>window.scrollX)).toBe(0);
    await figure.scrollIntoViewIfNeeded();
    await page.screenshot({path:info.outputPath('split-unmodified-viewport.png'),animations:'disabled'});
    await figure.screenshot({path:info.outputPath('split-full-figure.png'),animations:'disabled',style:'.site-header,.research-navigation,.webshop-story-nav{visibility:hidden}'});
    const ruler=figure.locator('.ruler-wrap');
    const localScroll=await ruler.evaluate(node=>({width:node.clientWidth,content:node.scrollWidth,overflow:getComputedStyle(node).overflowX,left:node.scrollLeft}));
    if(localScroll.content>localScroll.width+2){
      expect(localScroll.overflow).toMatch(/auto|scroll/);
      await ruler.evaluate(node=>node.scrollLeft=node.scrollWidth-node.clientWidth);
      expect(await ruler.evaluate(node=>node.scrollLeft)).toBeGreaterThan(0);
      const end=await ruler.locator('.axis-end').evaluate(node=>{const a=node.getBoundingClientRect(),b=node.closest('.ruler-wrap')!.getBoundingClientRect();return{left:a.left-b.left,right:b.right-a.right};});
      expect(end.left).toBeGreaterThanOrEqual(-2);expect(end.right).toBeGreaterThanOrEqual(-2);
      await figure.screenshot({path:info.outputPath('split-ruler-right.png'),animations:'disabled',style:'.site-header,.research-navigation,.webshop-story-nav{visibility:hidden}'});
      await ruler.evaluate(node=>node.scrollLeft=0);
    }
    await persistJsonAttachment(info,'split-containment.json',{body:Buffer.from(JSON.stringify({width,theme,receipts,negatives,localScroll,visibleText,componentCropHidesFloatingChrome:true,unmodifiedViewportRetained:true})),contentType:'application/json'});
  });
}

for(const width of [1100,1300,1440])for(const theme of ['light','dark'] as const){
  test('Vanilla container-selected readable nodes and connection labels '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:1000});
    await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/flow/sd-lora/');
    await page.evaluate(()=>document.fonts.ready);
    const containerWidth=await page.locator('.sdlora-diagram-frame').evaluate(n=>parseFloat(getComputedStyle(n).width));
    const mobile=containerWidth<=900;
    const diagram=page.locator(mobile?'.sdlora-map__mobile':'.sdlora-map__desktop');
    await expect(diagram).toBeVisible();
    const data=await diagram.evaluate(root=>{
      const rect=(n:Element)=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
      const nodes=[...root.querySelectorAll('.sdlora-node,.sdlora-mobile-node,.sdlora-mobile-side,.sdlora-mobile-branch__choices article')].map(n=>({name:n.getAttribute('data-flow-node'),box:rect(n),overflow:n.scrollWidth-n.clientWidth}));
      const labels=[...root.querySelectorAll('svg text')].map(n=>({text:n.textContent,box:rect(n),size:parseFloat(getComputedStyle(n).fontSize)*(n as SVGGraphicsElement).getScreenCTM()!.a}));
      return {nodes,labels,outer:rect(root)};
    });
    const overlaps=(a:typeof data.outer,b:typeof data.outer)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2;
    expect(data.nodes).toHaveLength(9);
    for(const [i,n] of data.nodes.entries()){
      expect(n.overflow,n.name??'node').toBeLessThanOrEqual(2);
      expect(n.box.bottom).toBeLessThanOrEqual(data.outer.bottom+2);
      for(const other of data.nodes.slice(i+1))expect(overlaps(n.box,other.box),n.name+' overlaps '+other.name).toBe(false);
    }
    for(const label of data.labels){expect(label.size).toBeGreaterThanOrEqual(12);for(const node of data.nodes)expect(overlaps(label.box,node.box),label.text+' hidden by '+node.name).toBe(false);}
    await persistJsonAttachment(info,'vanilla-layout.json',{body:Buffer.from(JSON.stringify({width,theme,containerWidth,mobile,...data})),contentType:'application/json'});
    await page.locator('.sdlora-slide').screenshot({path:info.outputPath('vanilla-full-figure.png'),animations:'disabled'});
  });
}

const readQ01Curve=async(reader:import('@playwright/test').Locator)=>reader.locator('svg.advisor-viz__q01-chart--desktop').evaluate(svg=>{
  const scale=(svg as SVGGraphicsElement).getScreenCTM()!.a;
  return {width:svg.getBoundingClientRect().width,axis:[...svg.querySelectorAll('text')].map(n=>({text:n.textContent,size:parseFloat(getComputedStyle(n).fontSize)*scale})),points:[...svg.querySelectorAll('polyline')].map(n=>n.getAttribute('points'))};
});
const acceptQ01Curve=(m:Awaited<ReturnType<typeof readQ01Curve>>)=>{expect(m.width).toBeGreaterThanOrEqual(888);expect(m.axis.length).toBeGreaterThan(5);for(const label of m.axis)expect(label.size,label.text??'axis').toBeGreaterThanOrEqual(13);expect(m.points).toHaveLength(3);};
for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('Q01 native curve reader '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/study/parameter-memory-results/');await page.evaluate(()=>document.fonts.ready);
    const figure=page.locator('.advisor-viz--q01'),reader=figure.locator('.q01-native-reader [data-native-svg-reader]'),input=reader.locator('input');
    await expect(figure).toBeAttached();await figure.locator('[data-q01-raw-svg] > summary').click();await expect(input).toBeAttached();
    const before=await reader.locator('svg.advisor-viz__q01-chart--desktop polyline').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('points')));
    await input.focus();await page.keyboard.press('Space');await expect(input).toBeChecked();
    await expect(reader.locator('.native-svg-reader__hint')).toBeVisible();await expect(reader.locator('svg.advisor-viz__q01-chart--desktop')).toBeVisible();await expect(reader.locator('svg.advisor-viz__q01-chart--phone')).toBeHidden();
    const reading=await readQ01Curve(reader);acceptQ01Curve(reading);expect(reading.points).toEqual(before);
    await expect(figure.locator('figcaption')).toBeVisible();
    await persistJsonAttachment(info,'q01-native.json',{body:Buffer.from(JSON.stringify({width,theme,reading})),contentType:'application/json'});
    await figure.screenshot({path:info.outputPath('q01-full-figure.png'),animations:'disabled'});
    if(width===390&&theme==='light'){
      const style=await page.addStyleTag({content:'.q01-native-reader .native-svg-reader__viewport svg.advisor-viz__q01-chart--desktop {width:260px !important;min-width:0 !important;max-width:260px !important}'});
      const bad=await readQ01Curve(reader);expect(()=>acceptQ01Curve(bad)).toThrow();
      await style.evaluate(n=>n.parentNode?.removeChild(n));acceptQ01Curve(await readQ01Curve(reader));
    }
    await input.focus();await page.keyboard.press('Space');await expect(input).not.toBeChecked();await expect(reader.locator('.native-svg-reader__hint')).toBeHidden();
  });
}
test('Q01 curve native keyboard reader works without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{const page=await context.newPage();await page.goto('/research/seed-openevo/study/parameter-memory-results/');await page.locator('.advisor-viz--q01 [data-q01-raw-svg] > summary').click();const reader=page.locator('.advisor-viz--q01 .q01-native-reader [data-native-svg-reader]');await reader.locator('input').focus();await page.keyboard.press('Space');await expect(reader.locator('input')).toBeChecked();await expect(reader.locator('svg.advisor-viz__q01-chart--desktop')).toBeVisible();acceptQ01Curve(await readQ01Curve(reader));}finally{await context.close();}
});


const remainingNativePlots=[
  {route:'/research/seed-openevo/study/results/7b-self-analysis/',selector:'.checkpoint-viz',native:1152},
  {route:'/research/seed-openevo/study/capability-exploration/sd-lora-scaling/',selector:'.scaling-chart',native:912},
] as const;
const readNativeText=async(reader:import('@playwright/test').Locator)=>reader.locator('svg text').evaluateAll(nodes=>nodes.map(node=>{const n=node as SVGTextElement,m=n.getScreenCTM()!,s=getComputedStyle(n);return{text:n.textContent,size:parseFloat(s.fontSize)*Math.hypot(m.a,m.b),font:s.fontFamily};}));
const acceptNativeText=(rows:Awaited<ReturnType<typeof readNativeText>>)=>{expect(rows.length).toBeGreaterThan(5);for(const row of rows){expect(row.size,row.text??'scientific label').toBeGreaterThanOrEqual(12);expect(row.font).not.toMatch(/mono|Menlo|Consolas/i);}};
for(const chart of remainingNativePlots)for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('remaining scientific curve reading '+chart.selector+' '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);await page.goto(chart.route);await page.evaluate(()=>document.fonts.ready);
    const figure=page.locator(chart.selector),reader=figure.locator('[data-native-svg-reader]');
    const points=await reader.locator('svg polyline').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('points')));
    const input=reader.locator('input');await input.focus();await page.keyboard.press('Space');await expect(input).toBeChecked();
    await expect(reader.locator('.native-svg-reader__hint')).toBeVisible();
    const text=await readNativeText(reader);acceptNativeText(text);
    expect(await reader.locator('svg polyline').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('points')))).toEqual(points);
    expect(await reader.locator('svg').evaluate(n=>n.getBoundingClientRect().width)).toBeCloseTo(chart.native,0);
    if(width===390&&theme==='light'){
      const style=await page.addStyleTag({content:chart.selector+' svg text{font-size:5px !important}'});
      const bad=await readNativeText(reader);expect(()=>acceptNativeText(bad)).toThrow();await style.evaluate(n=>n.parentNode?.removeChild(n));acceptNativeText(await readNativeText(reader));
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    await figure.screenshot({path:info.outputPath('full-scientific-figure.png'),animations:'disabled'});
    await persistJsonAttachment(info,'native-scientific-labels.json',{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA,width,theme,chart,text})),contentType:'application/json'});
  });
}

// PGFPlots exports contain font outlines rather than SVGTextElement nodes.
// Measure each real aria-labelled glyph group with its complete SVG transform
// at the actual <img> size; retain the immutable asset and scientific data.
const readPublicationGlyphs=async(plot:import('@playwright/test').Locator)=>{
  const image=plot.locator('img[data-pgfplot]');
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0)).toBe(true);
  await image.evaluate((node:HTMLImageElement)=>node.decode());
  const src=await image.evaluate((node:HTMLImageElement)=>node.currentSrc);
  const response=await plot.page().request.get(src);expect(response.ok()).toBe(true);
  const source=await response.text();
  const path=new URL(src).pathname;
  const file=path.split('/').at(-1)!.replace(/\.svg$/,'.tex');
  const texPath='figures/latex/'+(path.includes('/advisor-confidence-intervals/')?'advisor-confidence-intervals/':'')+file;
  const tex=readFileSync(new URL('../../'+texPath,import.meta.url),'utf8');
  expect(tex).toMatch(/\\documentclass\[tikz,border=[\d.]+pt\]\{standalone\}/);
  expect(tex).not.toMatch(/\\(?:resizebox|scalebox)\b/);
  const fontSizes=[10,...[...tex.matchAll(/\\(tiny|scriptsize|footnotesize|small|normalsize)\b/g)].map(m=>({tiny:5,scriptsize:7,footnotesize:8,small:9,normalsize:10})[m[1] as 'tiny'|'scriptsize'|'footnotesize'|'small'|'normalsize']),...[...tex.matchAll(/\\fontsize\{([\d.]+)\}/g)].map(m=>Number(m[1]))];
  const minimumEm=Math.min(...fontSizes);
  return image.evaluate((node,{source,minimumEm,texPath})=>{
    const image=node as HTMLImageElement,box=image.getBoundingClientRect();
    const parsed=new DOMParser().parseFromString(source,'image/svg+xml');
    const svg=document.importNode(parsed.documentElement,true) as unknown as SVGSVGElement;
    const host=document.createElement('div');Object.assign(host.style,{position:'fixed',left:'-10000px',top:'0',visibility:'hidden',pointerEvents:'none'});
    Object.assign(svg.style,{width:box.width+'px',height:box.height+'px',maxWidth:'none',maxHeight:'none'});host.append(svg);document.body.append(host);
    try{const bounds=svg.getBoundingClientRect();return {src:image.currentSrc,width:box.width,natural:image.naturalWidth,texPath,minimumEm,labels:[...svg.querySelectorAll<SVGGraphicsElement>('[aria-label],use')].filter(n=>!n.closest('defs')&&n.getBBox().width>0).map(n=>{const m=n.getScreenCTM()!,r=n.getBoundingClientRect(),inlineEm=parseFloat((n as SVGElement).style.getPropertyValue('font-size'));return{text:n.getAttribute('aria-label')??n.getAttribute('xlink:href'),encoding:n.tagName==='use'?'glyph-reference':'labelled-outline',fontBasis:Number.isFinite(inlineEm)?'SVG inline size':'sealed TeX minimum',pixels:(Number.isFinite(inlineEm)?inlineEm:minimumEm*72/72.27)*Math.hypot(m.a,m.b),left:r.left-bounds.left,right:bounds.right-r.right,top:r.top-bounds.top,bottom:bounds.bottom-r.bottom};})};}
    finally{host.remove();}
  },{source,minimumEm,texPath});
};
const acceptPublicationGlyphs=(reading:Awaited<ReturnType<typeof readPublicationGlyphs>>)=>{
  expect(reading.labels.length).toBeGreaterThan(3);
  for(const row of reading.labels){expect(row.pixels,row.text??'outlined scientific label').toBeGreaterThanOrEqual(12);for(const edge of[row.left,row.right,row.top,row.bottom])expect(edge,row.text??'outlined label fits source canvas').toBeGreaterThanOrEqual(-2);}
};
for(const width of[390,768,1440])for(const theme of['light','dark']as const){
  test('compiled scientific figures retain readable original glyphs '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/study/parameter-memory-results/');await page.evaluate(()=>document.fonts.ready);
    const plots=page.locator('[data-publication-plot]');expect(await plots.count()).toBeGreaterThanOrEqual(8);const receipts=[];
    for(let index=0;index<await plots.count();index++){
      const plot=plots.nth(index),ancestors=plot.locator('xpath=ancestor::details');
      for(let j=0;j<await ancestors.count();j++){const detail=ancestors.nth(j);if(!await detail.evaluate(n=>(n as HTMLDetailsElement).open)){await detail.locator(':scope > summary').focus();await page.keyboard.press('Enter');await expect(detail).toHaveJSProperty('open',true);}}
      const reader=plot.locator('[data-native-svg-reader]');await reader.locator('input').focus();await page.keyboard.press('Space');await expect(reader.locator('input')).toBeChecked();
      await expect(reader.locator('.native-svg-reader__hint')).toBeVisible();const reading=await readPublicationGlyphs(plot);acceptPublicationGlyphs(reading);
      if(index===0&&width===390&&theme==='light'){
        const image=plot.locator('img');const old=await image.getAttribute('style');await image.evaluate(n=>{for(const property of ['width','min-width','max-width'])(n as HTMLElement).style.setProperty(property,'50px','important');});
        const bad=await readPublicationGlyphs(plot);expect(()=>acceptPublicationGlyphs(bad)).toThrow();await image.evaluate((n,old)=>old===null?n.removeAttribute('style'):n.setAttribute('style',old),old);acceptPublicationGlyphs(await readPublicationGlyphs(plot));
      }
      const viewport=reader.locator('.native-svg-reader__viewport');
      const positions=await viewport.evaluate(n=>{const end=n.scrollWidth-n.clientWidth,step=Math.max(80,n.clientWidth*.8),positions=[0];for(let x=step;x<end;x+=step)positions.push(x);if(end>0)positions.push(end);return positions;});
      const figure=plot.locator('xpath=ancestor::figure').last();
      for(let part=0;part<positions.length;part++){await viewport.evaluate((n,x)=>n.scrollLeft=x,positions[part]!);await figure.screenshot({path:info.outputPath('publication-full-figure-'+index+'-part-'+part+'.png'),animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});}
      if(width===390)expect(await viewport.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
      receipts.push({id:await plot.getAttribute('data-publication-plot'),...reading});
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    await persistJsonAttachment(info,'publication-glyphs.json',{body:Buffer.from(JSON.stringify({width,theme,receipts})),contentType:'application/json'});
  });
}

// The same immutable figure must fit a printed page regardless of reader state.
test('publication native reader resets expanded geometry for print',async({page})=>{
  await page.setViewportSize({width:768,height:900});
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  const plot=page.locator('[data-publication-plot]').first(),reader=plot.locator('[data-native-svg-reader]'),toggle=reader.locator('input');
  await plot.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p instanceof HTMLDetailsElement)p.open=true;});
  await page.emulateMedia({media:'print'});
  const dimensions=()=>reader.evaluate(root=>{const image=root.querySelector('img')!,viewport=root.querySelector('.native-svg-reader__viewport')!;return{image:image.getBoundingClientRect().width,viewport:viewport.getBoundingClientRect().width,overflow:getComputedStyle(viewport).overflowX};});
  const compact=await dimensions();
  await toggle.evaluate(n=>(n as HTMLInputElement).checked=true);
  expect(await dimensions()).toEqual(compact);expect(compact.image).toBeLessThanOrEqual(compact.viewport+1);expect(compact.overflow).toBe('visible');
  await expect(reader.locator('.native-svg-reader__action')).toBeHidden();await expect(reader.locator('.native-svg-reader__hint')).toBeHidden();
});

test('PageOutline tooltip uses the readable metadata face',async({page},info)=>{
  // The response article now owns its in-flow TOC; development still consumes the product tooltip.
  await page.setViewportSize({width:1440,height:900});await page.goto('/development/');
  const link=page.locator('[data-page-outline-list] a').first();await expect(link).toBeVisible();await link.hover();
  const tip=page.locator('[data-page-outline-tooltip]');await expect(tip).toBeVisible();
  const metrics=await tip.evaluate(n=>{const s=getComputedStyle(n);return{text:n.textContent,size:parseFloat(s.fontSize),font:s.fontFamily,fontStyle:s.fontStyle,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing};});
  expect(metrics.size).toBeGreaterThanOrEqual(13);acceptOrdinaryFace(metrics.font,'outline tooltip');
  await persistJsonAttachment(info,'outline-tooltip.json',{body:Buffer.from(JSON.stringify(metrics)),contentType:'application/json'});
});

// These producers previously hid below the body role or borrowed compact-label
// coverage. Exercise the ordinary source label and long explanation themselves.
for (const width of [390, 768, 1440]) {
  test('scientific explanation and noncompact evidence roles at '+width, async ({page}, testInfo) => {
    await page.setViewportSize({width,height:1000});
    const receipts=[];
    for (const entry of [
      {route:'/research/seed-openevo/study/results/',selector:'.evidence-refs:not(.evidence-refs--compact) small',minimum:13},
      {route:'/research/seed-openevo/flow/webshop/',selector:'.canonical-figure p',minimum:14},
      {route:'/research/seed-openevo/flow/webshop/',selector:'.irx p',minimum:15},
      {route:'/research/seed-openevo/flow/webshop/',selector:'.irx-paper-caption p',minimum:14},
    ]) {
      await page.goto(entry.route,{waitUntil:'networkidle'});
      await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('details').forEach(n=>n.open=true);});
      const node=page.locator(entry.selector).filter({visible:true}).first();
      await expect(node,entry.selector).toBeVisible();
      const read=()=>node.evaluate(n=>({text:n.textContent?.trim(),size:parseFloat(getComputedStyle(n).fontSize),family:getComputedStyle(n).fontFamily}));
      const result=await read();expect(result.size).toBeGreaterThanOrEqual(entry.minimum);acceptOrdinaryFace(result.family,entry.selector,'system-sans');
      await node.evaluate(n=>{(n as HTMLElement).style.setProperty('font-size','9px','important');});
      expect((await read()).size>=entry.minimum,'same predicate rejects tiny prose/label injection').toBe(false);
      await node.evaluate(n=>(n as HTMLElement).style.removeProperty('font-size'));
      expect((await read()).size).toBeGreaterThanOrEqual(entry.minimum);
      receipts.push({...entry,...result});
    }
    await persistJsonAttachment(testInfo,'semantic-body-source-labels.json',{body:Buffer.from(JSON.stringify(receipts)),contentType:'application/json'});
  });
}

for (const theme of ['light','dark']) {
  test('narrow server explanation uses the full reading row '+theme, async ({page},info)=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto('/lab/',{waitUntil:'networkidle'});
    await page.evaluate(theme=>document.documentElement.setAttribute('data-theme',theme),theme);
    const root=page.locator('[data-interactive-research-explainer="server"]');
    await root.scrollIntoViewIfNeeded();
    await root.locator('.srv-workspace').click();
    const box=root.locator('.irx-inspector-current');const prose=box.locator('p');
    await expect(prose).toContainText('长期状态写入持久 workspace');
    const read=()=>box.evaluate(n=>{const p=n.querySelector('p')!;const s=getComputedStyle(p),r=p.getBoundingClientRect();return {width:r.width,parent:n.clientWidth,size:parseFloat(s.fontSize),text:p.textContent,lines:Math.round(r.height/parseFloat(s.lineHeight))};});
    const accepts=(r:{width:number,parent:number,size:number,lines:number})=>r.width>=r.parent-2&&r.size>=15&&r.lines<=2;
    const receipt=await read();expect(accepts(receipt)).toBe(true);
    await box.evaluate(n=>(n as HTMLElement).style.setProperty('grid-template-columns','auto minmax(0,1fr)'));
    expect(accepts(await read()),'old badge/prose columns must fail the same reading predicate').toBe(false);
    await box.evaluate(n=>(n as HTMLElement).style.removeProperty('grid-template-columns'));
    expect(accepts(await read())).toBe(true);
    await root.locator('.irx-inspector').scrollIntoViewIfNeeded();
    await root.locator('.irx-inspector').screenshot({path:info.outputPath('server-current-explanation.png')});
    await persistJsonAttachment(info,'server-current-explanation.json',{body:Buffer.from(JSON.stringify({theme,...receipt})),contentType:'application/json'});
  });
}
