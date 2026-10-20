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
