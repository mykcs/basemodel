import { expect, test, type Page } from '@playwright/test';

const route = '/research/seed-openevo/flow/server/';
const root = '.server-overview';
const roles = [
  {selector:'.server-hero__maintenance-order',min:14.9,role:'maintenance sequence'},
  {selector:'.server-hero__safety',min:14.9,role:'release and deletion caveat'},
  {selector:'.routine-entry__copy p',min:14.9,role:'operator introduction'},
  {selector:'.snapshot-facts p',min:12.9,role:'snapshot provenance'},
  {selector:'.operation-switchboard small',min:12.9,role:'action navigation'},
  {selector:'.operation-explainer span',min:14.9,role:'health scan explanation'},
  {selector:'.lifecycle-flow small',min:12.9,role:'life-cycle node label'},
  {selector:'.lifecycle-flow figcaption',min:13.9,role:'life-cycle caption'},
  {selector:'.reclaim-boundary p',min:14.9,role:'reclaim permission boundary'},
  {selector:'.reclaim-steps span',min:14.9,role:'reclaim steps'},
  {selector:'.privacy-grid p',min:14.9,role:'privacy explanation'},
] as const;

async function measure(page:Page, selector:string) {
  const el=page.locator(root).locator(selector).first();
  await expect(el,selector).toBeVisible();
  return await el.evaluate(node=>{
    const s=getComputedStyle(node),r=node.getBoundingClientRect();
    return {
      px:parseFloat(s.fontSize),leading:parseFloat(s.lineHeight),
      family:s.fontFamily,style:s.fontStyle,
      overflow:node.scrollWidth-node.clientWidth,
      width:r.width,text:node.textContent?.trim().slice(0,70)??'',
    };
  });
}

for (const width of [390,768,1440] as const) {
  for (const theme of ['light','dark'] as const) {
    test('public server governance prose is readable at '+width+'px/'+theme,async({page},info)=>{
      await page.setViewportSize({width,height:900});
      await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.evaluate(()=>document.fonts.ready);
      const owner=page.locator(root);
      await expect(owner).toBeVisible();

      for(const role of roles){
        const actual=await measure(page,role.selector);
        expect(actual.px,role.role+' '+actual.text).toBeGreaterThanOrEqual(role.min);
        expect(actual.family,role.role).toMatch(/Inter|PingFang|system-ui/);
        expect(actual.style).toBe('normal');
        expect(actual.width).toBeGreaterThanOrEqual(45);
        expect(actual.overflow,role.role+' clipped').toBeLessThanOrEqual(2);
        expect(actual.leading,role.role+' squeezed').toBeGreaterThanOrEqual(actual.px*1.25);
      }
      // Disclosures are initially closed; expand as the user would before
      // checking genuinely long explanations in them.
      const toOpen=['.operator-detail','.measurement-notes','.passport-authority-note','.q17-case-depth'];
      for(const selector of toOpen){
        const candidates=owner.locator(selector);
        if(await candidates.count()){
          await candidates.first().evaluate((element:HTMLDetailsElement)=>{element.open=true;});
        }
      }
      for(const role of [
        {selector:'.operator-detail>p',min:15.9},
        {selector:'.passport-authority-note p',min:15.9},
        {selector:'.q17-case__note',min:14.9},
      ]){
        const node=owner.locator(role.selector).first();
        if(await node.count()){
          await node.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
          const size=await node.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
          expect(size,role.selector).toBeGreaterThanOrEqual(role.min);
        }
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      if(width===390||width===1440){
        const frame=owner.locator(width===390?'.server-hero':'.lifecycle-flow').first();
        await frame.screenshot({
          path:info.outputPath('server-governance-'+width+'-'+theme+'.png'),
          animations:'disabled',
          style:'.site-header, .research-module-nav-shell, [data-site-header] {visibility:hidden;}',
        });
      }
    });
  }
}

test('restoring an 11px server safety warning is rejected by the same computed-size gate',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const node=page.locator(root+' .server-hero__safety');
  const size=async()=>node.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(await size()).toBeGreaterThanOrEqual(14.9);
  await node.evaluate(el=>(el as HTMLElement).style.fontSize='11px');
  expect(await size()).toBeLessThan(14.9);
  await node.evaluate(el=>(el as HTMLElement).style.removeProperty('font-size'));
  expect(await size()).toBeGreaterThanOrEqual(14.9);
});
