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
      const title=dialog.locator('h2');
      await expect(title).toBeVisible();
      expect(await title.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(17);
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
