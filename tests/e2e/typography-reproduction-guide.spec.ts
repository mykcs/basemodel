import {expect, test, type Page} from '@playwright/test';

/** Public OpenEVO reproduction page — real reading/operating instructions. */
const route = '/research/seed-openevo/study/run/';
const roles = [
  {selector:'.hard-boundary',min:14.9,role:'safety explanation'},
  {selector:'.hero-actions a',min:14.9,role:'entry action'},
  {selector:'.gate-intro>header>p',min:15.9,role:'reproduction introduction'},
  {selector:'.gate-num',min:12.9,role:'step number'},
  {selector:'.gate-copy h3',min:16.9,role:'step heading'},
  {selector:'.gate-copy p',min:15.9,role:'step instruction'},
  {selector:'.gate-copy code',min:12.9,role:'command source',mono:true},
  {selector:'.run-context>summary',min:14.9,role:'expand details control'},
  {selector:'.repo-map>aside',min:14.9,role:'repository explanation'},
  {selector:'.repo-flow small',min:12.9,role:'repository provenance'},
  {selector:'.repo-flow strong',min:14.9,role:'repository heading'},
  {selector:'.repo-flow p',min:14.9,role:'repository role explanation'},
  {selector:'.gap p',min:15.9,role:'known gap'},
] as const;

async function compute(page:Page,selector:string){
 const node=page.locator('.repro-guide').locator(selector).first();
 await expect(node,'missing '+selector).toBeVisible();
 return node.evaluate(el=>{
   const style=getComputedStyle(el),rect=el.getBoundingClientRect();
   return {size:parseFloat(style.fontSize),leading:parseFloat(style.lineHeight),family:style.fontFamily,italic:style.fontStyle,width:rect.width,overflow:el.scrollWidth-el.clientWidth};
 });
}

for(const width of [390,768,1440] as const){
 for(const theme of ['light','dark'] as const){
  test('reproduction workflow has readable operational typography: '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(v=>localStorage.setItem('atlas-theme',v),theme);
    const response=await page.goto(route,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('.run-context>summary').click();
    await expect(page.locator('.run-context')).toHaveAttribute('open','');
    for(const rule of roles){
      const data=await compute(page,rule.selector);
      expect(data.size,rule.role).toBeGreaterThanOrEqual(rule.min);
      expect(data.italic,rule.role).toBe('normal');
      if('mono' in rule){
        expect(data.family,rule.role).toMatch(/Mono|monospace|Consolas|Menlo/);
      } else {
        expect(data.family,rule.role).toMatch(/Inter|PingFang|system-ui/);
      }
      expect(data.width,rule.role).toBeGreaterThan(25);
      if(rule.role==='step instruction'||rule.role==='repository role explanation'||rule.role==='known gap')
        expect(data.leading,rule.role).toBeGreaterThan(data.size*1.4);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);

    const codeShell=page.locator('.gate-copy pre').first();
    await expect(codeShell).toBeVisible();
    const shell=await codeShell.evaluate(node=>({width:node.clientWidth,scroll:node.scrollWidth,overflow:getComputedStyle(node).overflowX}));
    expect(shell.width).toBeGreaterThan(100);
    expect(shell.overflow).toMatch(/auto|scroll/);

    if(width===390&&theme==='light'){
      await page.locator('.gate-runbook li').first().screenshot({
        path:info.outputPath('first-reproduction-step-mobile.png'),animations:'disabled',
        style:'.site-header,.research-module-nav-shell{visibility:hidden}',
      });
    }
    if(width===1440&&theme==='dark'){
      await page.locator('.repo-flow').screenshot({
        path:info.outputPath('repository-map-dark.png'),animations:'disabled',
        style:'.site-header,.research-module-nav-shell{visibility:hidden}',
      });
    }
  });
 }
}
test('old 9px instructions and 10px code fail the same computed-size rule',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(route,{waitUntil:'domcontentloaded'});
 for(const item of [
  {selector:'.gate-copy p',floor:15.9,bad:'9px'},
  {selector:'.gate-copy code',floor:12.9,bad:'10px'}
 ]){
  const node=page.locator('.repro-guide').locator(item.selector).first();
  const valid=async()=>node.evaluate((el,min)=>parseFloat(getComputedStyle(el).fontSize)>=min,item.floor);
  expect(await valid()).toBe(true);
  await node.evaluate((el,bad)=>(el as HTMLElement).style.fontSize=bad,item.bad);
  expect(await valid()).toBe(false);
  await node.evaluate(el=>(el as HTMLElement).style.removeProperty('font-size'));
  expect(await valid()).toBe(true);
 }
});
