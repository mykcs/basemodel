import { persistJsonAttachment } from './evidence-json';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const acceptChartSize = (smallest: number) => expect(smallest).toBeGreaterThanOrEqual(12);
const cases = [
  { locale: 'zh', route: '/research/seed-openevo/study/briefing/' },
] as const;

for (const entry of cases) {
  test(`${entry.locale} briefing keeps fixed-slide geometry on desktop and phone`, async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      const response = await page.goto(entry.route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('.briefing-slide')).toHaveCount(24);

      const geometry = await page.evaluate(() => {
        const slide = document.querySelector<HTMLElement>('.briefing-slide');
        const inner = slide?.querySelector<HTMLElement>('.slide-inner');
        const slideBox = slide?.getBoundingClientRect();
        const innerBox = inner?.getBoundingClientRect();
        return {
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          slideWidth: slideBox?.width ?? 0,
          slideHeight: slideBox?.height ?? 0,
          innerInsideSlide: Boolean(slideBox && innerBox
            && innerBox.left >= slideBox.left - 1 && innerBox.right <= slideBox.right + 1
            && innerBox.top >= slideBox.top - 1 && innerBox.bottom <= slideBox.bottom + 1),
        };
      });

      expect(geometry.pageWidth).toBeLessThanOrEqual(geometry.viewportWidth + 2);
      expect(geometry.innerInsideSlide).toBe(true);
      expect(geometry.slideHeight / geometry.slideWidth).toBeCloseTo(9 / 16, 3);
      if (viewport.width === 390) expect(geometry.slideWidth).toBeCloseTo(390, 0);
      else expect(geometry.slideWidth).toBeCloseTo(1280, 0);
    }
  });
}

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`scientific chart reading ${width} ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/briefing/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const buttons = page.locator('[data-briefing-chart]');
      await expect(buttons).toHaveCount(8);
      for (let i = 0; i < 8; i++) {
        const original = await page.locator('.dynamics-chart svg').nth(i).evaluate((svg) => ({
          text: Array.from(svg.querySelectorAll('text')).map((n) => n.textContent),
          points: Array.from(svg.querySelectorAll('polyline')).map((n) => n.getAttribute('points')),
          paint: Array.from(svg.querySelectorAll('line, polyline, circle')).map(n => { const s=getComputedStyle(n); return {fill:s.fill,stroke:s.stroke,dash:s.strokeDasharray}; }),
        }));
        await buttons.nth(i).click();
        const dialog = page.locator('#research-chart-reader');
        await expect(dialog).toBeVisible();
        const close = dialog.getByRole('button', { name: '关闭图表' });
        expect(await close.evaluate((n) => n.getBoundingClientRect().height)).toBeLessThan(60);
        expect(await close.evaluate((n) => n.getBoundingClientRect().width)).toBeGreaterThan(50);
        if (theme === 'dark') expect(await dialog.evaluate((n) => getComputedStyle(n).backgroundColor)).not.toBe('rgb(255, 253, 248)');
        const reading = await dialog.locator('svg').evaluate((svg) => ({
          text: Array.from(svg.querySelectorAll('text')).map((n) => n.textContent),
          points: Array.from(svg.querySelectorAll('polyline')).map((n) => n.getAttribute('points')),
          paint: Array.from(svg.querySelectorAll('line, polyline, circle')).map(n => { const s=getComputedStyle(n); return {fill:s.fill,stroke:s.stroke,dash:s.strokeDasharray}; }),
          smallest: Math.min(...Array.from(svg.querySelectorAll<SVGTextElement>('text')).map((n) => {
            const matrix = n.getScreenCTM()!;
            return parseFloat(getComputedStyle(n).fontSize) * Math.hypot(matrix.a, matrix.b);
          })),
        }));
        expect(reading.text).toEqual(original.text);
        expect(reading.points).toEqual(original.points);
        expect(reading.paint).toEqual(original.paint);
        acceptChartSize(reading.smallest);
        await persistJsonAttachment(testInfo,`chart-reader-${i}.json`,{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA,width,theme,engine:testInfo.project.name,original,reading})),contentType:'application/json'});
        const canvas = dialog.locator('.research-chart-canvas');
        await expect(canvas).toBeFocused();
        if (width === 390) {
          await canvas.press('ArrowRight');
          await expect.poll(() => canvas.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
        }
        if (width === 390 && i === 0) {
          const smallest = await dialog.locator('svg').evaluate((svg) => {
            (svg as SVGSVGElement).style.transform = 'scale(0.3046875)';
            return Math.min(...Array.from(svg.querySelectorAll<SVGTextElement>('text')).map((n) => {
              const m = n.getScreenCTM()!;
              return parseFloat(getComputedStyle(n).fontSize) * Math.hypot(m.a, m.b);
            }));
          });
          expect(() => acceptChartSize(smallest)).toThrow();
          await dialog.locator('svg').evaluate((svg) => { (svg as SVGSVGElement).style.transform = ''; });
          const restored = await dialog.locator('svg text').evaluateAll(nodes => Math.min(...nodes.map(n => {
            const m=(n as SVGTextElement).getScreenCTM()!;
            return parseFloat(getComputedStyle(n).fontSize)*Math.hypot(m.a,m.b);
          })));
          acceptChartSize(restored);
        }
        await dialog.screenshot({ path: testInfo.outputPath(`chart-reader-${i}.png`) });
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(buttons.nth(i)).toBeFocused();
      }
      await expect(page.locator('.briefing-slide')).toHaveCount(24);
      await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
      const images = page.locator('.metric-evidence__viewport img, .research-image-viewport img');
      await expect(images).toHaveCount(8);
      for (let i = 0; i < 8; i++) {
        const image = images.nth(i);
        const zoom = image.locator('xpath=ancestor::figure').locator('[data-metric-zoom]');
        if (await zoom.count()) {
          await expect(zoom).toBeVisible();
          await zoom.click();
          await expect(zoom).toHaveAttribute('aria-expanded','true');
          await expect(image.locator('xpath=ancestor::figure').locator('[data-metric-scroll-hint]')).toBeVisible();
        }
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth > 0)).toBe(true);
        const source = await page.request.get((await image.getAttribute('src'))!);
        expect(source.ok()).toBe(true);
        const fontSizes = [...(await source.text()).matchAll(/font-size\s*[:=]\s*["']?(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
        expect(fontSizes.length).toBeGreaterThan(0);
        const nativeFont = Math.min(...fontSizes);
        const metrics = await image.evaluate((n: HTMLImageElement) => ({
          width: n.getBoundingClientRect().width, natural: n.naturalWidth,
          localOverflow: (() => { const region=n.closest('.metric-evidence__viewport,.research-image-viewport')!; return region.scrollWidth > region.clientWidth; })(),
        }));
        {
          expect(metrics.width / metrics.natural * nativeFont).toBeGreaterThanOrEqual(12);
          expect(metrics.localOverflow).toBe(true);
          await persistJsonAttachment(testInfo,`image-reader-${i}.json`,{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA,viewportWidth:width,theme,engine:testInfo.project.name,nativeFont,...metrics})),contentType:'application/json'});
          const region = page.locator('.metric-evidence__viewport, .research-image-viewport').nth(i);
          await region.focus();
          await expect(region).toBeFocused();
          await region.press('ArrowRight');
          await expect.poll(() => region.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
          await region.evaluate((n) => { n.scrollLeft = n.scrollWidth; });
          await image.locator('xpath=ancestor::figure').screenshot({ path: testInfo.outputPath(`image-reader-${i}.png`),style:'.site-header,.research-navigation{visibility:hidden}' });
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true);
    });
  }
}

// Run against the same freshly built tree served by the browser gate. Preserve
// the complete raw candidate list; raw source inventory is not visual approval.
test('fresh built-tree typography inventory has exact source identity', async ({}, info) => {
  const path=info.outputPath('sitewide-typography-audit.json');
  execFileSync(process.execPath,['scripts/audit-sitewide-typography.mjs','--json',path],{stdio:'pipe'});
  const audit=JSON.parse(readFileSync(path,'utf8'));
  if(process.env.CI_HEAD_SHA) expect(audit.sha).toBe(process.env.CI_HEAD_SHA);
  expect(audit.errors).toEqual([]);
  expect(audit.summary.rendered_routes).toBeGreaterThanOrEqual(260);
  expect(audit.declarations.some((entry:{property:string})=>entry.property==='line-height')).toBe(true);
  expect(audit.declarations.some((entry:{property:string})=>entry.property==='letter-spacing')).toBe(true);
  await persistJsonAttachment(info,'sitewide-typography-audit.json',{path,contentType:'application/json'});
});

// Reading mode is a same-source alternative to the fixed 1280×720 presentation.
// It preserves text, formulae, cells and links; graph geometry stays in the deck.
const slideReadingContent=async(root:import('@playwright/test').Locator)=>root.evaluate(element=>{
  const clone=element.cloneNode(true) as HTMLElement;
  for(const node of [...clone.querySelectorAll('svg,script,style,button,input,select,textarea,form,[aria-hidden="true"],[hidden],.research-chart-figure-note')])if(!node.closest('.katex,math'))node.remove();
  const normalize=(text:string|null)=>text?.replace(/\s+/g,' ').trim()||'';
  return {
    snippets:[...clone.querySelectorAll('h1,h2,h3,h4,p,li,small,strong,dt,dd,figcaption')].map(n=>normalize(n.textContent)).filter(Boolean),
    cells:[...clone.querySelectorAll('th,td')].map(n=>normalize(n.textContent)),
    links:[...clone.querySelectorAll<HTMLAnchorElement>('a[href]')].map(n=>({text:normalize(n.textContent),href:n.dataset.originalHref??n.getAttribute('href')})),
    math:[...clone.querySelectorAll('.katex annotation')].map(n=>n.textContent),
  };
});
const readSlideTextSizes=async(root:import('@playwright/test').Locator)=>root.evaluate(element=>[...element.querySelectorAll('p,li,th,td,dt,dd')].filter(n=>!n.closest('.katex,math')&&n.textContent?.trim()).map(n=>({text:n.textContent?.slice(0,90),size:parseFloat(getComputedStyle(n).fontSize)})));
const acceptSlideTextSizes=(rows:Awaited<ReturnType<typeof readSlideTextSizes>>)=>{expect(rows.length).toBeGreaterThan(0);for(const row of rows)expect(row.size,row.text).toBeGreaterThanOrEqual(15);};
for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('all briefing pages have readable same-source text '+width+'/'+theme,async({page},info)=>{
    await page.setViewportSize({width,height:900});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/study/briefing/');await page.evaluate(()=>document.fonts.ready);
    const slides=page.locator('.briefing-slide'),buttons=page.locator('[data-briefing-text]'),dialog=page.locator('#research-chart-reader');
    const count=await slides.count();expect(count).toBeGreaterThanOrEqual(24);await expect(buttons).toHaveCount(count);
    const receipts=[];
    for(let index=0;index<count;index++){
      const source=slides.nth(index).locator('.slide-inner');const expected=await slideReadingContent(source);
      await buttons.nth(index).click();await expect(dialog).toBeVisible();const reading=dialog.locator('.research-slide-text');await expect(reading).toBeVisible();
      const actual=await slideReadingContent(reading);expect(actual.cells).toEqual(expected.cells);expect(actual.links).toEqual(expected.links);expect(actual.math).toEqual(expected.math);
      for(const text of expected.snippets)expect(actual.snippets,'source text lost from slide '+index+': '+text).toContain(text);
      const metrics=await readSlideTextSizes(reading);acceptSlideTextSizes(metrics);
      const ids=await reading.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));expect(new Set(ids).size).toBe(ids.length);
      for(const id of ids)await expect(page.locator('[id="'+id+'"]')).toHaveCount(1);
      expect(await reading.locator('button:not(.research-chart-source-link),input,select,textarea,form,script').count()).toBe(0);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
      if([0,4,8,12,16,23].includes(index))await dialog.screenshot({path:info.outputPath('slide-text-'+index+'.png'),animations:'disabled'});
      if(index===0&&width===390&&theme==='light'){
        const style=await page.addStyleTag({content:'.research-slide-text p {font-size:9px !important}'});
        const bad=await readSlideTextSizes(reading);expect(bad.some(row=>row.size===9)).toBe(true);expect(()=>acceptSlideTextSizes(bad)).toThrow();
        await style.evaluate(node=>node.parentNode?.removeChild(node));acceptSlideTextSizes(await readSlideTextSizes(reading));
      }
      receipts.push({slide:index,sourceSnippets:expected.snippets.length,cells:expected.cells.length,links:expected.links.length,math:expected.math.length,metrics});
      await dialog.getByRole('button',{name:'关闭图表'}).click();await expect(dialog).not.toBeVisible();await expect(buttons.nth(index)).toBeFocused();
    }
    await persistJsonAttachment(info,'all-slide-text-receipts.json',{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA??'local-dirty',width,theme,receipts})),contentType:'application/json'});
  });
}


test('briefing text reader opens its original scientific curve without losing dialog content',async({page})=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto('/research/seed-openevo/study/briefing/');
  const dialog=page.locator('#research-chart-reader');
  const slides=page.locator('.briefing-slide');
  const index=await slides.evaluateAll(nodes=>nodes.findIndex(node=>node.querySelector('.dynamics-chart svg')));
  expect(index).toBeGreaterThanOrEqual(0);
  const original=slides.nth(index).locator('.dynamics-chart svg').first();
  const points=await original.locator('polyline').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('points')));
  await page.locator('[data-briefing-text]').nth(index).click();
  await dialog.locator('.research-chart-source-link').first().click();
  await expect(dialog).toBeVisible();await expect(dialog.locator('.research-slide-text')).toHaveCount(0);
  const curve=dialog.locator('.research-chart-canvas svg');await expect(curve).toBeVisible();
  expect(await curve.locator('polyline').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('points')))).toEqual(points);
  await expect(dialog.locator('.research-chart-hint')).toHaveText('左右滑动查看完整坐标。');
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-briefing-chart]').first()).toBeFocused();
});
