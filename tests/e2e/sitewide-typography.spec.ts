import { expect, test } from '@playwright/test';

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


// Research scores and evidence boundaries are reader content, not 9–11px plot ticks.
// This reuses the same predicates for the real CSS and deliberate old-style injection.
const sevenBReaderRoute='/research/seed-openevo/study/results/7b-self-analysis/';
const typedEvidenceRoles=['.score-comparison__table tbody td',
  '.score-comparison__table small','.score-comparison__note',
  '.score-comparison__heading p','.score-comparison__table .is-best'] as const;
async function readSevenBTableType(page:import('@playwright/test').Page) {
  return page.evaluate((selectors)=>{
    const root=document.querySelector('[data-testid="webshop-7b-score-comparison"]');
    if(!root)throw Error('Missing 7B WebShop performance table');
    const values=Object.fromEntries(selectors.map(selector=>{
      const element=root.querySelector(selector);
      if(!element)throw Error('Missing evidence role '+selector);
      const style=getComputedStyle(element);
      const box=element.getBoundingClientRect();
      return [selector,{size:parseFloat(style.fontSize),weight:parseFloat(style.fontWeight),
        family:style.fontFamily,style:style.fontStyle,lineHeight:style.lineHeight,
        letterSpacing:style.letterSpacing,numeric:style.fontVariantNumeric,width:box.width,
        text:element.textContent?.trim().slice(0,90)}];
    })) as Record<string,{size:number;weight:number;family:string;style:string;lineHeight:string;letterSpacing:string;numeric:string;width:number;text?:string}>;
    const wrapper=root.querySelector('.score-comparison__wrap') as HTMLElement|null;
    if(!wrapper)throw Error('No local scroll owner for research table');
    return {values,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      wrapper:{overflow:getComputedStyle(wrapper).overflowX,client:wrapper.clientWidth,scroll:wrapper.scrollWidth}};
  },[...typedEvidenceRoles]);
}
function acceptSevenBTableType(receipt:Awaited<ReturnType<typeof readSevenBTableType>>) {
  expect(receipt.overflow).toBeLessThanOrEqual(2);
  for(const [selector,min] of [
    ['.score-comparison__table tbody td',15],
    ['.score-comparison__table small',13],
    ['.score-comparison__note',14],
    ['.score-comparison__heading p',14],
    ['.score-comparison__table .is-best',15]
  ] as const) {
    const style=receipt.values[selector];
    expect(style,selector).toBeDefined();
    expect(style!.size,selector).toBeGreaterThanOrEqual(min);
    expect(style!.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(style!.style,selector).toBe('normal');
  }
  expect(receipt.values['.score-comparison__table .is-best']!.weight).toBeLessThanOrEqual(650);
  expect(receipt.wrapper.overflow).toBe('auto');
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('7B scientific table type and local scroll: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
      const response=await page.goto(sevenBReaderRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipt=await readSevenBTableType(page);
      acceptSevenBTableType(receipt);
      if(width===390)expect(receipt.wrapper.scroll).toBeGreaterThan(receipt.wrapper.client);
      const region=page.locator('[data-testid="webshop-7b-score-comparison"]');
      await region.scrollIntoViewIfNeeded();
      await region.screenshot({path:testInfo.outputPath('seven-b-table-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header{visibility:hidden}'});
      await testInfo.attach('seven-b-table-computed.json',{
        body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
    });
  }
}
test('real 7B table evidence guard rejects 9px notes and 12px results',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(sevenBReaderRoute,{waitUntil:'domcontentloaded'});
  acceptSevenBTableType(await readSevenBTableType(page));
  const old=await page.addStyleTag({content:
    '.analysis-plan .score-comparison__table tbody td{font-size:12px!important}' +
    '.analysis-plan .score-comparison__table small{font-size:9px!important}' +
    '.analysis-plan .score-comparison__note{font-size:9px!important}'});
  const bad=await readSevenBTableType(page);
  expect(()=>acceptSevenBTableType(bad)).toThrow();
  await old.evaluate(node=>node.remove());
  acceptSevenBTableType(await readSevenBTableType(page));
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
      await region.screenshot({path:testInfo.outputPath('four-arm-evidence-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header{visibility:hidden}'});
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
  await injected.evaluate(node=>node.remove());
  acceptFourArmDataType(await readFourArmDataType(page));
});
