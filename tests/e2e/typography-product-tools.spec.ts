import { expect, test, type Locator } from '@playwright/test';
import { waitForHydratedIsland } from './hydration-ready';
import { persistJsonAttachment } from './evidence-json';

for (const width of [390, 768, 1440]) for (const theme of ['light', 'dark'] as const) {
  test(`paper source titles retain a readable column ${width}/${theme}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
    await page.goto('/papers/seed/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const row = page.locator('.detail-aside a.evidence-row').first();
    await expect(row).toBeVisible();
    const measure = () => row.evaluate(node => {
      const title = node.querySelector(':scope > span:first-child')!;
      const box = node.getBoundingClientRect(), text = title.getBoundingClientRect();
      const css = getComputedStyle(node), strong = getComputedStyle(title.querySelector('strong')!);
      return { text: title.textContent, rowWidth: box.width, titleWidth: text.width,
        innerWidth: node.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight),
        size: parseFloat(strong.fontSize), font: strong.fontFamily,
        overflow: title.scrollWidth - title.clientWidth, left: text.left - box.left, right: box.right - text.right };
    });
    const accept = (value: Awaited<ReturnType<typeof measure>>) => {
      expect(value.titleWidth).toBeGreaterThanOrEqual(Math.min(160, value.innerWidth) - 2);
      expect(value.size).toBeGreaterThanOrEqual(14.9);
      expect(value.font).toMatch(/Inter|PingFang|system-ui/);
      expect(value.overflow).toBeLessThanOrEqual(2);
      expect(value.left).toBeGreaterThanOrEqual(-2); expect(value.right).toBeGreaterThanOrEqual(-2);
    };
    const before = await measure(); accept(before);
    let broken;
    if (width === 1440 && theme === 'light') {
      const legacy = await page.addStyleTag({ content: '.detail-aside a.evidence-row{grid-template-columns:minmax(0,1fr) auto auto!important}.detail-aside a.evidence-row>span{grid-column:auto!important;grid-row:auto!important}' });
      try {
        broken = await measure();
        expect(broken.titleWidth).toBeLessThan(80);
        expect(() => accept(broken!)).toThrow();
      } finally { await legacy.evaluate(node => node.parentNode?.removeChild(node)); }
    }
    const restored = await measure(); accept(restored); expect(restored).toEqual(before);
    await row.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath('paper-source-unmodified-viewport.png') });
    await page.locator('.detail-aside .evidence-block').screenshot({ path: info.outputPath('paper-source-block.png'), animations: 'disabled', style: '.site-header{visibility:hidden}' });
    await persistJsonAttachment(info, 'paper-source-column.json', { body: Buffer.from(JSON.stringify({ width, theme, before, broken, restored, negativeRejected: broken !== undefined })), contentType: 'application/json' });
  });
}

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


// Mounted Qwen2.5-3B-Instruct reproduction setup: explanatory method text
// is not a 10–12px technical glyph. Phone keeps its own table scroller.
const reproSetupRoute='/models/qwen2-5-3b-instruct/';
async function readModelReproductionSetup(page:import('@playwright/test').Page){
  return page.evaluate(()=>{
    const root=document.querySelector('[data-seed-openevo-experiment-setup]');
    if(!root)throw Error('Missing mounted SEED/OpenEVO reproduction setup');
    const selectors=[
      '.experiment-setup__lede','.experiment-setup__group h3',
      '.model-name-anatomy dt','.model-name-anatomy dd',
      '.experiment-fields dt','.experiment-fields dd',
      '.experiment-table th','.experiment-table tbody td',
    ] as const;
    const roles=Object.fromEntries(selectors.map(selector=>{
      const node=root.querySelector(selector);
      if(!node)throw Error('Missing method explanatory role '+selector);
      const css=getComputedStyle(node);
      return [selector,{size:parseFloat(css.fontSize),weight:parseFloat(css.fontWeight),
        family:css.fontFamily,style:css.fontStyle,leading:css.lineHeight,
        width:node.getBoundingClientRect().width,client:(node as HTMLElement).clientWidth,
        scroll:(node as HTMLElement).scrollWidth}];
    })) as Record<string,{size:number;weight:number;family:string;style:string;
      leading:string;width:number;client:number;scroll:number}>;
    const wrap=root.querySelector('.experiment-table-wrap') as HTMLElement|null;
    const grid=root.querySelector('.model-name-anatomy');
    if(!wrap||!grid)throw Error('Missing reproduction table or model-name grid');
    const b=root.getBoundingClientRect();
    return {roles,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      bounds:{left:b.left,right:b.right},grid:getComputedStyle(grid).gridTemplateColumns,
      wrapper:{overflow:getComputedStyle(wrap).overflowX,client:wrap.clientWidth,scroll:wrap.scrollWidth}};
  });
}
function acceptModelReproductionSetup(r:Awaited<ReturnType<typeof readModelReproductionSetup>>,width:number){
  expect(r.overflow).toBeLessThanOrEqual(2);
  expect(r.bounds.left).toBeGreaterThanOrEqual(-2);
  expect(r.bounds.right).toBeLessThanOrEqual(width+2);
  const floors:Record<string,number>={
    '.experiment-setup__lede':15,
    '.experiment-setup__group h3':17,
    '.model-name-anatomy dt':16,
    '.model-name-anatomy dd':15,
    '.experiment-fields dt':15,
    '.experiment-fields dd':15,
    '.experiment-table th':14,
    '.experiment-table tbody td':15,
  };
  for(const [selector,min] of Object.entries(floors)){
    const role=r.roles[selector];
    if(!role)throw Error('No measured reproduction role: '+selector);
    expect(role.size,selector).toBeGreaterThanOrEqual(min);
    expect(role.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(role.style,selector).toBe('normal');
    expect(role.scroll,selector).toBeLessThanOrEqual(role.client+2);
  }
  expect(r.wrapper.overflow).toBe('auto');
  expect(r.wrapper.scroll,'all reproduction columns fit without horizontal drag').toBeLessThanOrEqual(r.wrapper.client+2);
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('Qwen 3B reproducibility field meanings and method table readable: '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
      const response=await page.goto(reproSetupRoute,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const r=await readModelReproductionSetup(page);
      acceptModelReproductionSetup(r,width);
      const section=page.locator('[data-seed-openevo-experiment-setup]').first();
      await section.scrollIntoViewIfNeeded();
      await page.screenshot({path:testInfo.outputPath('repro-setup-viewport-'+width+'-'+theme+'.png'),animations:'disabled'});
      await section.screenshot({path:testInfo.outputPath('repro-setup-component-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      // A tall component crop can stop at the current viewport's lower edge.
      // Independently prove the LAST real scientific row is in the document,
      // reachable with native scroll, and within its table's vertical bounds.
      const allRows=section.locator('.experiment-table tbody tr');
      await expect(allRows).toHaveCount(4);
      const lastRow=allRows.last();
      await lastRow.scrollIntoViewIfNeeded();
      await expect(lastRow).toBeVisible();
      const tail=await lastRow.evaluate(el=>{
        const table=el.closest('table');
        const wrap=el.closest('.experiment-table-wrap');
        if(!table||!wrap)throw Error('Last row is outside its own table/wrapper');
        const row=el.getBoundingClientRect(),all=table.getBoundingClientRect(),holder=wrap.getBoundingClientRect();
        return {rowTop:row.top,rowBottom:row.bottom,rowHeight:row.height,
          tableTop:all.top,tableBottom:all.bottom,holderTop:holder.top,
          holderBottom:holder.bottom,viewportHeight:innerHeight,
          rootOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      expect(tail.rowHeight).toBeGreaterThan(16);
      expect(tail.rowTop).toBeGreaterThanOrEqual(tail.tableTop-2);
      expect(tail.rowBottom).toBeLessThanOrEqual(tail.tableBottom+2);
      expect(tail.rowTop).toBeGreaterThanOrEqual(-2);
      expect(tail.rowBottom).toBeLessThanOrEqual(tail.viewportHeight+2);
      expect(tail.rootOverflow).toBeLessThanOrEqual(2);
      await page.screenshot({path:testInfo.outputPath('repro-setup-final-row-'+width+'-'+theme+'.png'),animations:'disabled'});
      await testInfo.attach('reproduction-final-row-computed.json',{body:Buffer.from(JSON.stringify(tail,null,2)),contentType:'application/json'});
      await testInfo.attach('reproduction-setup-computed.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
    });
  }
}
test('reproduction setup actually rejects restored 10px protocol text',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(reproSetupRoute,{waitUntil:'domcontentloaded'});
  acceptModelReproductionSetup(await readModelReproductionSetup(page),390);
  const bad=await page.addStyleTag({content:
    '.experiment-setup .model-name-anatomy dd{font-size:10px!important}' +
    '.experiment-setup .experiment-table td{font-size:10px!important}'});
  const old=await readModelReproductionSetup(page);
  expect(()=>acceptModelReproductionSetup(old,390)).toThrow();
  await bad.evaluate(node=>node.parentNode?.removeChild(node));
  acceptModelReproductionSetup(await readModelReproductionSetup(page),390);
});


// The current /guide/today/ URL displays a dated legacy runbook warning,
// NOT today's live equipment facts. The 2026 date is normal UI text, while
// the warning and the link to the current canonical source remain visible.
async function readLegacyRunbookTypography(page:import('@playwright/test').Page) {
  return page.evaluate(() => {
    const root=document.querySelector('.legacy-runbook-notice');
    if(!root) throw new Error('Missing mounted legacy runbook notice on /guide/today/');
    const selectors=[
      '.legacy-runbook-marker','.legacy-runbook-kicker',
      '.legacy-runbook-notice h2',
      '.legacy-runbook-notice p:not(.legacy-runbook-kicker)',
      '.legacy-runbook-notice a',
    ];
    const roles=Object.fromEntries(selectors.map(selector=>{
      const element=root.querySelector(selector);
      if(!element) throw new Error('Missing runbook role '+selector);
      const css=getComputedStyle(element);
      const rect=element.getBoundingClientRect();
      return [selector,{
        size:parseFloat(css.fontSize),
        family:css.fontFamily,
        weight:parseFloat(css.fontWeight),
        style:css.fontStyle,
        leading:css.lineHeight,
        width:rect.width,
        height:rect.height,
        paddingTop:parseFloat(css.paddingTop)||0,
        paddingBottom:parseFloat(css.paddingBottom)||0,
        scroll:(element as HTMLElement).scrollWidth,
        client:(element as HTMLElement).clientWidth,
      }];
    })) as Record<string,{size:number;family:string;weight:number;style:string;leading:string;width:number;height:number;paddingTop:number;paddingBottom:number;scroll:number;client:number}>;
    const bounds=root.getBoundingClientRect();
    return {
      roles,rootOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      cardLeft:bounds.left,cardRight:bounds.right,
      dateText:root.querySelector('.legacy-runbook-marker')?.textContent?.trim(),
      currentLink:root.querySelector('a')?.getAttribute('href')??'',
    };
  });
}
function assertLegacyRunbookTypography(r:Awaited<ReturnType<typeof readLegacyRunbookTypography>>,width:number) {
  const floors:Record<string,number>={
    '.legacy-runbook-marker':13,
    '.legacy-runbook-kicker':13,
    '.legacy-runbook-notice h2':20,
    '.legacy-runbook-notice p:not(.legacy-runbook-kicker)':16,
    '.legacy-runbook-notice a':15,
  };
  expect(r.rootOverflow).toBeLessThanOrEqual(2);
  expect(r.cardLeft).toBeGreaterThanOrEqual(-2);
  expect(r.cardRight).toBeLessThanOrEqual(width+2);
  // The global human-expression runtime may localize ISO dates to 2026 年 8 月 11 日.
  // Check the calendar identity, not the former decorative string spelling.
  expect(r.dateText?.replace(/\s+/g,'')).toMatch(/^2026(?:-08-11|年8月11日)$/);
  const dateRole=r.roles['.legacy-runbook-marker'];
  if(!dateRole)throw Error('No measured historical date role');
  expect(Number.isFinite(parseFloat(dateRole.leading))).toBe(true);
  expect(dateRole.height-dateRole.paddingTop-dateRole.paddingBottom,
    'the localized date ink/line box must fit one line').toBeLessThanOrEqual(
    parseFloat(dateRole.leading)+2);
  expect(r.currentLink).toContain('fuhuo-20260419.vercel.app/docs/machines');
  for(const [selector,min] of Object.entries(floors)){
    const v=r.roles[selector];
    if(!v)throw new Error('Missing computed runbook role '+selector);
    expect(v.size,selector).toBeGreaterThanOrEqual(min);
    expect(v.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(v.style,selector).toBe('normal');
    expect(v.scroll,selector).toBeLessThanOrEqual(v.client+2);
  }
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('legacy guide labels explain dated equipment boundary legibly '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      const response=await page.goto('/guide/today/',{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const computed=await readLegacyRunbookTypography(page);
      assertLegacyRunbookTypography(computed,width);
      await page.locator('.legacy-runbook-notice').screenshot({
        path:testInfo.outputPath('legacy-guide-card-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}',
      });
      await testInfo.attach('legacy-guide-computed.json',{
        body:Buffer.from(JSON.stringify(computed,null,2)),contentType:'application/json'});
    });
  }
}
test('live legacy guide keeps accessible dated warning and canonical source',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const response=await page.goto('/guide/today/',{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  const card=page.locator('aside.legacy-runbook-notice');
  await expect(card).toHaveAttribute('aria-labelledby','legacy-runbook-notice-title');
  await expect(page.locator('#legacy-runbook-notice-title')).toContainText('旧 Intel Mac');
  await expect(card.locator('p').last()).toContainText('不代表当前设备清单');
  await expect(card.locator('a')).toHaveAttribute('href',
    'https://fuhuo-20260419.vercel.app/docs/machines');
  assertLegacyRunbookTypography(await readLegacyRunbookTypography(page),390);
});
test('runbook readability gate rejects restored tiny dated warning and recovers',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/guide/today/',{waitUntil:'domcontentloaded'});
  assertLegacyRunbookTypography(await readLegacyRunbookTypography(page),390);
  const bad=await page.addStyleTag({content:
    '.legacy-runbook-kicker{font-size:9px!important}' +
    '.legacy-runbook-notice p:not(.legacy-runbook-kicker){font-size:10px!important}'});
  const damaged=await readLegacyRunbookTypography(page);
  expect(()=>assertLegacyRunbookTypography(damaged,390)).toThrow();
  await bad.evaluate(node=>node.parentNode?.removeChild(node));
  assertLegacyRunbookTypography(await readLegacyRunbookTypography(page),390);
});


test('legacy guide rejects a constrained date column wrapping at tablet width',async({page})=>{
  await page.setViewportSize({width:768,height:900});
  await page.goto('/guide/today/',{waitUntil:'domcontentloaded'});
  const before=await readLegacyRunbookTypography(page);
  assertLegacyRunbookTypography(before,768);
  const original=await page.addStyleTag({content:
    '.legacy-runbook-notice{grid-template-columns:80px minmax(0,1fr)!important}' +
    '.legacy-runbook-marker{white-space:normal!important}'});
  const bad=await readLegacyRunbookTypography(page);
  const oldDate=bad.roles['.legacy-runbook-marker'];
  if(!oldDate)throw Error('Former date role missing after injection');
  expect(oldDate.height-oldDate.paddingTop-oldDate.paddingBottom).toBeGreaterThan(
    parseFloat(oldDate.leading)+2);
  expect(()=>assertLegacyRunbookTypography(bad,768)).toThrow();
  await original.evaluate(node=>node.parentNode?.removeChild(node));
  assertLegacyRunbookTypography(await readLegacyRunbookTypography(page),768);
});


// Results landing page: five actual sealed/unrun experiment arm summaries.
// Unlike a short tick, these are 15px reader evidence paragraphs.
async function readFiveArmResultsIndex(page:import('@playwright/test').Page){
  return page.evaluate(()=>{
    const root=document.querySelector('.analysis-plan-index');
    if(!root)throw Error('Mounted five-arm index missing on public Results route');
    const selectors=['.analysis-plan-index h2','.analysis-plan-index__intro p',
      '.analysis-plan-index li>span','.analysis-plan-index h3',
      '.analysis-plan-index li p','.analysis-plan-index a'];
    const roles=Object.fromEntries(selectors.map(selector=>{
      const el=root.querySelector(selector);
      if(!el)throw Error('Missing Result role: '+selector);
      const css=getComputedStyle(el),b=el.getBoundingClientRect();
      return [selector,{size:parseFloat(css.fontSize),family:css.fontFamily,
        style:css.fontStyle,weight:parseFloat(css.fontWeight),client:(el as HTMLElement).clientWidth,
        scroll:(el as HTMLElement).scrollWidth,width:b.width}];
    })) as Record<string,{size:number;family:string;style:string;weight:number;
      client:number;scroll:number;width:number}>;
    const items=[...root.querySelectorAll(':scope > ol > li')];
    const b=root.getBoundingClientRect();
    return {roles,left:b.left,right:b.right,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      count:items.length,labels:items.map(li=>li.querySelector(':scope > span')?.textContent?.trim()??''),
      urls:items.map(li=>li.querySelector('a')?.getAttribute('href')??''),
      text:root.textContent??''};
  });
}
function acceptFiveArmResultsIndex(x:Awaited<ReturnType<typeof readFiveArmResultsIndex>>,width:number){
  expect(x.count).toBe(5);
  expect(x.labels).toEqual(['01','02','03','04','05']);
  expect(x.text).toContain('3B/MiniMax 的 final 明确未运行');
  expect(x.text).toContain('74.58%');
  expect(x.urls.every(u=>u.startsWith('/research/seed-openevo/study/results/'))).toBe(true);
  expect(x.overflow).toBeLessThanOrEqual(2);
  expect(x.left).toBeGreaterThanOrEqual(-2);
  expect(x.right).toBeLessThanOrEqual(width+2);
  const floors:Record<string,number>={
    '.analysis-plan-index h2':22,'.analysis-plan-index__intro p':16,
    '.analysis-plan-index li>span':13,'.analysis-plan-index h3':17,
    '.analysis-plan-index li p':15,'.analysis-plan-index a':15};
  for(const [selector,min] of Object.entries(floors)){
    const v=x.roles[selector];
    if(!v)throw Error('Missing computed five-arm type '+selector);
    expect(v.size,selector).toBeGreaterThanOrEqual(min);
    expect(v.family,selector).toMatch(/Inter|PingFang|system-ui/);
    expect(v.style,selector).toBe('normal');
    expect(v.scroll,selector).toBeLessThanOrEqual(v.client+2);
  }
}
for(const width of [390,768,1440] as const){
  for(const theme of ['light','dark'] as const){
    test('five-arm scientific Results index legible at '+width+'/'+theme,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width===390?844:900});
      await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
      const response=await page.goto('/research/seed-openevo/study/results/',{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const measured=await readFiveArmResultsIndex(page);
      acceptFiveArmResultsIndex(measured,width);
      const rows=page.locator('.analysis-plan-index > ol > li');
      await rows.first().scrollIntoViewIfNeeded();
      await rows.first().screenshot({path:testInfo.outputPath('five-arm-first-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await rows.last().scrollIntoViewIfNeeded();
      await rows.last().screenshot({path:testInfo.outputPath('five-arm-last-'+width+'-'+theme+'.png'),
        animations:'disabled',style:'.site-header,.research-navigation{visibility:hidden}'});
      await testInfo.attach('five-arm-computed.json',{
        body:Buffer.from(JSON.stringify({...measured,text:'omitted, original scientific text unchanged'},null,2)),
        contentType:'application/json'});
    });
  }
}
test('five-arm results gate rejects decorated 11px numbers and 12px scientific prose',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/research/seed-openevo/study/results/',{waitUntil:'domcontentloaded'});
  acceptFiveArmResultsIndex(await readFiveArmResultsIndex(page),390);
  const injected=await page.addStyleTag({content:
    '.analysis-plan-index li>span{font-size:11px!important}' +
    '.analysis-plan-index li p{font-size:12px!important}'});
  const damaged=await readFiveArmResultsIndex(page);
  expect(()=>acceptFiveArmResultsIndex(damaged,390)).toThrow();
  await injected.evaluate(node=>node.parentNode?.removeChild(node));
  acceptFiveArmResultsIndex(await readFiveArmResultsIndex(page),390);
});

