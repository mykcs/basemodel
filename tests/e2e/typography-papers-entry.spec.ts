import {expect, test} from '@playwright/test';

const route = '/papers/';
const rootSelector = '.papers-entry';

for(const width of [390,768,1440] as const){
 for(const theme of ['light','dark'] as const){
  test('paper catalog reader path preserves typography hierarchy: '+width+'/'+theme, async({page},info)=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    const response=await page.goto(route,{waitUntil:'domcontentloaded'});
    expect(response?.status()).toBe(200);
    await page.evaluate(()=>document.fonts.ready);
    const note=page.locator(rootSelector+' .papers-reading-note').first();
    const heading=page.locator(rootSelector+' .papers-reading-path strong').first();
    const description=page.locator(rootSelector+' .papers-reading-path span').first();
    await expect(note).toBeVisible();
    await expect(heading).toBeVisible();
    await expect(description).toBeVisible();
    for(const [locator,min] of [[note,15.9],[heading,14.9],[description,14.9]] as const){
      const actual=await locator.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();
        return {size:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight),family:s.fontFamily,italic:s.fontStyle,width:r.width,overflow:el.scrollWidth-el.clientWidth};});
      expect(actual.size).toBeGreaterThanOrEqual(min);
      expect(actual.family).toMatch(/Inter|PingFang|system-ui/);
      expect(actual.italic).toBe('normal');
      expect(actual.width).toBeGreaterThan(160);
      expect(actual.overflow).toBeLessThanOrEqual(2);
      expect(actual.lineHeight).toBeGreaterThan(actual.size * 1.2);
    }
    const numbering=await page.locator(rootSelector+' .papers-reading-path li').first()
      .evaluate(el=>{const css=getComputedStyle(el,'::before');return {size:parseFloat(css.fontSize),family:css.fontFamily,weight:css.fontWeight}});
    expect(numbering.size).toBeGreaterThanOrEqual(12.9);
    expect(numbering.family).toMatch(/Inter|PingFang|system-ui/);
    const layout=await heading.evaluate(el=>{
      const h=el.getBoundingClientRect(),x=el.closest('li')?.querySelector('span')?.getBoundingClientRect();
      return {headingTop:h.top,headingBottom:h.bottom,descTop:x?.top??0,descBottom:x?.bottom??0};
    });
    if(width<=720)expect(layout.descTop).toBeGreaterThanOrEqual(layout.headingBottom-2);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
    if(width===390&&theme==='light'){
      await page.locator(rootSelector).screenshot({
        path:info.outputPath('papers-reading-header-phone.png'),animations:'disabled',
        style:'.site-header,[data-site-header]{visibility:hidden}',
      });
    }
  });
 }
}
test('paper entry regression rejects tiny body and decorative numbering',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route,{waitUntil:'domcontentloaded'});
  const note=page.locator(rootSelector+' .papers-reading-note').first();
  const acceptable=async()=>note.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=15.9);
  expect(await acceptable()).toBe(true);
  await note.evaluate(el=>(el as HTMLElement).style.fontSize='10px');
  expect(await acceptable()).toBe(false);
  await note.evaluate(el=>(el as HTMLElement).style.removeProperty('font-size'));
  expect(await acceptable()).toBe(true);

  const row=page.locator(rootSelector+' .papers-reading-path li').first();
  const indexNormal=async()=>row.evaluate(el=>{
    const s=getComputedStyle(el,'::before');
    return parseFloat(s.fontSize)>=12.9&&!/Georgia|Songti|Times New Roman/.test(s.fontFamily);
  });
  expect(await indexNormal()).toBe(true);
  const bad=await page.addStyleTag({content:'.papers-reading-path li::before{font-family:Georgia,serif!important;font-size:9px!important}'});
  expect(await indexNormal()).toBe(false);
  await bad.evaluate(el=>el.parentNode?.removeChild(el));
  expect(await indexNormal()).toBe(true);
});
