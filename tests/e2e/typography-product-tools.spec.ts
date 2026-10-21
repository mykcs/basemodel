import { expect, test, type Locator } from '@playwright/test';
import { waitForHydratedIsland } from './hydration-ready';

async function assertCompareData(row: Locator) {
  await expect(row).toBeVisible();
  const style=await row.evaluate(node=>{
    const css=getComputedStyle(node);
    return {size:parseFloat(css.fontSize),family:css.fontFamily,style:css.fontStyle,
      width:node.getBoundingClientRect().width,overflow:node.scrollWidth-node.clientWidth};
  });
  expect(style.size).toBeGreaterThanOrEqual(15);
  expect(style.family).toMatch(/Inter|PingFang|system-ui/);
  expect(style.style).toBe('normal');
  expect(style.width).toBeGreaterThan(160);
  expect(style.overflow).toBeLessThanOrEqual(2);
}

async function assertQuickViewComposition(dialog:Locator){
  const composition=await dialog.evaluate(node=>{
    const article=node.querySelector('.quick-view-dialog-inner')!;
    const header=node.querySelector('.quick-view-header')!;
    const facts=node.querySelector('.quick-view-facts')!;
    const label=facts.querySelector('dt')!.getBoundingClientRect();
    const value=facts.querySelector('dd')!.getBoundingClientRect();
    const close=header.querySelector('button')!.getBoundingClientRect();
    const heading=header.querySelector('h2')!.getBoundingClientRect();
    return {padding:parseFloat(getComputedStyle(article).paddingLeft),header:getComputedStyle(header).display,
      facts:getComputedStyle(facts).display,sameRow:Math.abs(label.top-value.top)<=2,
      valueAfterLabel:value.left>label.right,closeAfterHeading:close.left>=heading.right};
  });
  expect(composition.padding).toBeGreaterThanOrEqual(16);
  expect(composition.header).toBe('flex');
  expect(composition.facts).toBe('grid');
  expect(composition.sameRow).toBe(true);
  expect(composition.valueAfterLabel).toBe(true);
  expect(composition.closeAfterHeading).toBe(true);
}

// These witnesses cover legacy v2-closeout UI roles that used to bypass
// the established semantic scale. The model/paper catalogs and research
// diagrams have separate visual gates.
for (const width of [390, 768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('model detail nav and paper quick view inherit site typography at ' + width + ' / ' + theme, async ({page},testInfo) => {
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      await page.goto('/models/qwen3-8b/',{waitUntil:'domcontentloaded'});
      const actions=page.locator('.model-detail-actions');
      await expect(actions).not.toHaveAttribute('open','');
      await actions.locator(':scope > summary').click();
      await expect(actions).toHaveAttribute('open','');
      const nav=page.locator('.model-detail-nav a').first();
      await expect(nav).toBeVisible();
      const a=await nav.evaluate(el=>{const s=getComputedStyle(el);return {size:parseFloat(s.fontSize),family:s.fontFamily,italic:s.fontStyle}});
      expect(a.size).toBeGreaterThanOrEqual(13);
      expect(a.family).toMatch(/Inter|PingFang|system-ui/);
      expect(a.italic).toBe('normal');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);

      await page.goto('/papers/agentbench/',{waitUntil:'domcontentloaded'});
      const quick=page.locator('.role-model-quick-view').first();
      await quick.scrollIntoViewIfNeeded();
      await waitForHydratedIsland(quick);
      await expect(quick).toBeVisible();
      const q=await quick.evaluate(el=>{const s=getComputedStyle(el);return {size:parseFloat(s.fontSize),family:s.fontFamily}});
      expect(q.size).toBeGreaterThanOrEqual(13);
      expect(q.family).toMatch(/Inter|PingFang|system-ui/);
      await quick.click();
      const dialog=page.locator('#global-model-quick-view');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.quick-view-facts')).toBeVisible();
      const title=dialog.locator('h2');
      await expect(title).toBeVisible();
      expect(await title.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(17);
      await assertQuickViewComposition(dialog);
      await dialog.screenshot({path:testInfo.outputPath('quick-view-'+width+'-'+theme+'.png'),animations:'disabled'});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    });
  }
}

for (const width of [390, 414, 768, 1440] as const) {
  for (const theme of ['light','dark'] as const) {
    test('Home and Landscape reading roles at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      for(const route of ['/','/landscape/']){
        await page.goto(route,{waitUntil:'domcontentloaded'});
        await page.evaluate(()=>document.fonts.ready);
        const target=page.locator(route==='/'?'.mission-hero h1':'.landscape-overview .stat strong').first();
        await expect(target).toBeVisible();
        const style=await target.evaluate(node=>{
          const css=getComputedStyle(node);
          return {size:parseFloat(css.fontSize),family:css.fontFamily,style:css.fontStyle};
        });
        expect(style.size).toBeGreaterThanOrEqual(route==='/'?32:18);
        if(route==='/landscape/'){
          expect(style.family).toMatch(/Inter|PingFang|system-ui/);
          expect(style.style).toBe('normal');
        }
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
        await page.screenshot({path:testInfo.outputPath((route==='/'?'home':'landscape')+'-'+width+'-'+theme+'.png'),animations:'disabled'});
        if(route==='/landscape/') await page.locator('.landscape-overview .overview-stats').screenshot({
          path:testInfo.outputPath('landscape-statistics-'+width+'-'+theme+'.png'),animations:'disabled',
          style:'.site-header { visibility:hidden; }',
        });
      }
    });
  }
}

test('the same Quick View composition gate rejects its former missing interior stylesheet',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/papers/agentbench/',{waitUntil:'domcontentloaded'});
  const quick=page.locator('.role-model-quick-view').first();
  await waitForHydratedIsland(quick);
  await quick.click();
  const dialog=page.locator('#global-model-quick-view');
  await expect(dialog.locator('.quick-view-facts')).toBeVisible();
  await assertQuickViewComposition(dialog);
  const owners=await page.evaluateHandle(()=>{
    const found:Array<{rule:CSSStyleRule;cssText:string}>=[];
    const prefixes=['.quick-view-dialog-inner','.quick-view-header','.quick-view-facts','.quick-view-actions'];
    const walk=(rules:CSSRuleList)=>{
      for(const rule of [...rules]){
        if(rule instanceof CSSStyleRule&&prefixes.some(prefix=>rule.selectorText.startsWith(prefix)))found.push({rule,cssText:rule.style.cssText});
        if('cssRules' in rule)walk((rule as CSSGroupingRule).cssRules);
      }
    };
    for(const sheet of [...document.styleSheets])walk(sheet.cssRules);
    return found;
  });
  expect(await owners.evaluate(rules=>rules.length)).toBeGreaterThan(0);
  await owners.evaluate(rules=>{for(const {rule} of rules)rule.style.cssText='';});
  await expect(assertQuickViewComposition(dialog)).rejects.toThrow();
  await owners.evaluate(rules=>{for(const {rule,cssText} of rules)rule.style.cssText=cssText;});
  await assertQuickViewComposition(dialog);
  await owners.dispose();
});

for (const theme of ['light','dark'] as const) {
  test('mobile Compare has coherent heading rank and actual readable data at 390px '+theme,async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    await page.goto('/compare/?models=qwen3-8b,gpt-oss-20b',{waitUntil:'domcontentloaded'});
    const mobile=page.locator('.comparison-mobile-cards');
    await expect(mobile).toBeVisible();
    const group=mobile.locator('.comparison-mobile-group > h3').first();
    const field=mobile.locator('.comparison-mobile-field > h4').first();
    const row=mobile.locator('.comparison-mobile-value').first();
    await expect(group).toBeVisible();
    await expect(field).toBeVisible();
    await expect(row).toBeVisible();
    const measure=async(el:typeof group)=>el.evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {font:parseFloat(s.fontSize),family:s.fontFamily,italic:s.fontStyle,width:r.width,overflow:e.scrollWidth-e.clientWidth}});
    const g=await measure(group),h=await measure(field),v=await measure(row);
    await assertCompareData(row);
    expect(g.font).toBeGreaterThanOrEqual(17);
    expect(h.font).toBeGreaterThanOrEqual(16);
    expect(g.font).toBeGreaterThanOrEqual(h.font);
    expect(v.font).toBeGreaterThanOrEqual(15);
    for(const item of [g,h,v]){
      expect(item.family).toMatch(/Inter|PingFang|system-ui/);
      expect(item.italic).toBe('normal');
      expect(item.width).toBeGreaterThan(160);
      expect(item.overflow).toBeLessThanOrEqual(2);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}

test('mobile Compare regression rejects a restored 9px data row',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/compare/?models=qwen3-8b,gpt-oss-20b');
  const row=page.locator('.comparison-mobile-value').first();
  await expect(row).toBeVisible();
  await assertCompareData(row);
  await row.evaluate(e=>(e as HTMLElement).style.fontSize='9px');
  await expect(assertCompareData(row)).rejects.toThrow();
  await row.evaluate(e=>(e as HTMLElement).style.removeProperty('font-size'));
  await assertCompareData(row);
});


for (const width of [768, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('desktop Compare keeps table text readable with local scroll at ' + width + '/' + theme, async ({page}) => {
      await page.setViewportSize({width,height:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      await page.goto('/compare/?models=qwen3-8b,gpt-oss-20b',{waitUntil:'domcontentloaded'});
      const table=page.locator('table.comparison-table').first();
      await expect(table).toBeVisible();
      const header=table.locator('thead th').first();
      const style=await header.evaluate(el=>{
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        return {size:parseFloat(s.fontSize),family:s.fontFamily,width:r.width,italic:s.fontStyle};
      });
      expect(style.size).toBeGreaterThanOrEqual(13);
      expect(style.family).toMatch(/Inter|PingFang|system-ui/);
      expect(style.italic).toBe('normal');
      expect(style.width).toBeGreaterThan(80);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    });
  }
}


// Mounted Models / Data Status surfaces: a catalog provenance explanation is
// real body prose, not a 12px machine tag. The negative uses the same predicates.
type TypeRole = {
  size:number; family:string; weight:number; style:string; lineHeight:string;
  letterSpacing:string; width:number; client:number; scroll:number;
};
type ModelReaderReceipt = {
  roles:Record<string,TypeRole>; overflow:number;
  columns:string; bounds:{left:number;right:number};
};
const modelTypeSelectors=[
  '.research-summary h2','.research-summary .summary-block dt',
  '.research-summary .summary-block dd',
  '.catalog-freshness__summary strong','.catalog-freshness__summary p',
] as const;
async function readModelDetailType(page:import('@playwright/test').Page):Promise<ModelReaderReceipt>{
  return page.evaluate((selectors)=>{
    const describe=(selector:string)=>{
      const node=document.querySelector(selector);
      if(!node)throw Error('Missing mounted model role: '+selector);
      const c=getComputedStyle(node),box=node.getBoundingClientRect();
      return {size:parseFloat(c.fontSize),family:c.fontFamily,weight:parseFloat(c.fontWeight),
        style:c.fontStyle,lineHeight:c.lineHeight,letterSpacing:c.letterSpacing,
        width:box.width,client:(node as HTMLElement).clientWidth,scroll:(node as HTMLElement).scrollWidth};
    };
    const grid=document.querySelector('.research-summary-grid');
    const card=document.querySelector('.research-summary');
    if(!grid||!card)throw Error('ModelResearchSummary missing on model detail');
    const b=card.getBoundingClientRect();
    return {roles:Object.fromEntries(selectors.map(selector=>[selector,describe(selector)])),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      columns:getComputedStyle(grid).gridTemplateColumns,
      bounds:{left:b.left,right:b.right}};
  },[...modelTypeSelectors]);
}
function acceptModelDetailType(r:ModelReaderReceipt,width:number){
  expect(r.overflow).toBeLessThanOrEqual(2);
  expect(r.bounds.left).toBeGreaterThanOrEqual(-2);
  expect(r.bounds.right).toBeLessThanOrEqual(width+2);
  const floors:Record<string,number>={
    '.research-summary h2':18,
    '.research-summary .summary-block dt':13,
    '.research-summary .summary-block dd':15,
    '.catalog-freshness__summary strong':16,
    '.catalog-freshness__summary p':15,
  };
  for(const [selector,floor] of Object.entries(floors)){
    const type=r.roles[selector];
    if(!type)throw Error('Missing computed model role '+selector);
    expect(type.size,selector).toBeGreaterThanOrEqual(floor);
    expect(type.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(type.style,selector).toBe('normal');
    expect(type.scroll,selector).toBeLessThanOrEqual(type.client+2);
  }
  const modelValue=r.roles['.research-summary .summary-block dd'];
  if(!modelValue)throw Error('Missing model value role');
  expect(modelValue.weight).toBeLessThanOrEqual(650);
}
for(const width of [390,768,1440] as const) {
  for(const theme of ['light','dark'] as const) {
    test('model evidence and dated catalog prose are legible: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
      const response=await page.goto('/models/qwen3-8b/',{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipt=await readModelDetailType(page);
      acceptModelDetailType(receipt,width);
      const section=page.locator('.research-summary').first();
      await section.scrollIntoViewIfNeeded();
      await page.screenshot({path:testInfo.outputPath('model-evidence-viewport-'+width+'-'+theme+'.png'),animations:'disabled'});
      await section.screenshot({path:testInfo.outputPath('model-evidence-card-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await testInfo.attach('model-evidence-computed.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
    });
  }
}
test('model evidence predicate rejects 10px data and catalog provenance',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/models/qwen3-8b/',{waitUntil:'domcontentloaded'});
  acceptModelDetailType(await readModelDetailType(page),390);
  const badStyle=await page.addStyleTag({content:
    '.research-summary .summary-block dd{font-size:10px!important}' +
    '.catalog-freshness__summary p{font-size:10px!important}'});
  const bad=await readModelDetailType(page);
  expect(()=>acceptModelDetailType(bad,390)).toThrow();
  await badStyle.evaluate(el=>el.parentNode?.removeChild(el));
  acceptModelDetailType(await readModelDetailType(page),390);
});

async function readCatalogEvidenceType(page:import('@playwright/test').Page) {
  return page.evaluate(()=>{
    const roles=['.catalog-freshness__signal-note',
      '.catalog-freshness__signal-head strong','.catalog-freshness__signal-head time',
      '.catalog-freshness__signals li > p','.catalog-freshness__sources a'];
    const values=Object.fromEntries(roles.map(selector=>{
      const node=document.querySelector(selector);
      if(!node)throw Error('Missing dated evidence role '+selector);
      const c=getComputedStyle(node),b=node.getBoundingClientRect();
      return [selector,{size:parseFloat(c.fontSize),family:c.fontFamily,
        weight:parseFloat(c.fontWeight),style:c.fontStyle,width:b.width}];
    })) as Record<string,{size:number;family:string;weight:number;style:string;width:number}>;
    const parent=document.querySelector('.catalog-freshness__signals');
    if(!parent)throw Error('Model evidence list did not render');
    return {roles:values,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      parentWidth:parent.getBoundingClientRect().width};
  });
}
function acceptCatalogEvidenceType(r:Awaited<ReturnType<typeof readCatalogEvidenceType>>){
  expect(r.overflow).toBeLessThanOrEqual(2);
  expect(r.parentWidth).toBeGreaterThan(170);
  const floors:Record<string,number>={
    '.catalog-freshness__signal-note':14,
    '.catalog-freshness__signal-head strong':15,
    '.catalog-freshness__signal-head time':13,
    '.catalog-freshness__signals li > p':15,
    '.catalog-freshness__sources a':13,
  };
  for(const [selector,min] of Object.entries(floors)){
    const role=r.roles[selector];
    if(!role)throw Error('Missing computed catalog role '+selector);
    expect(role.size,selector).toBeGreaterThanOrEqual(min);
    expect(role.style,selector).toBe('normal');
    expect(role.family,selector).toMatch(/Inter|PingFang|system-ui/);
  }
}
for(const width of [390,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('Data Status lists sourced dated catalog claims readably: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
      const response=await page.goto('/data-status/',{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const receipt=await readCatalogEvidenceType(page);
      acceptCatalogEvidenceType(receipt);
      const node=page.locator('.catalog-freshness__signals').first();
      await node.scrollIntoViewIfNeeded();
      await node.screenshot({path:testInfo.outputPath('dated-catalog-signals-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await testInfo.attach('dated-catalog-computed.json',{body:Buffer.from(JSON.stringify(receipt,null,2)),contentType:'application/json'});
    });
  }
}
test('the same sourced-date predicate rejects restored tiny prose',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/data-status/',{waitUntil:'domcontentloaded'});
  acceptCatalogEvidenceType(await readCatalogEvidenceType(page));
  const bad=await page.addStyleTag({content:
    '.catalog-freshness__signals li>p{font-size:10px!important}'});
  const receipt=await readCatalogEvidenceType(page);
  expect(()=>acceptCatalogEvidenceType(receipt)).toThrow();
  await bad.evaluate(node=>node.parentNode?.removeChild(node));
  acceptCatalogEvidenceType(await readCatalogEvidenceType(page));
});
