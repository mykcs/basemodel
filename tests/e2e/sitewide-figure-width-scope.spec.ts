import { expect, test } from '@playwright/test';
import { captureFigureEvidence, revealEvidenceReadingState, settleFigureHydration } from './figure-evidence';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const captureAudit = process.env.CLOUD_FIGURE_AUDIT === '1';
const root = join(process.cwd(), 'dist');
function discover(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return discover(path);
    if (!entry.name.endsWith('.html')) return [];
    const source = readFileSync(path, 'utf8');
    if (!/<figure(?=[\s>])|<table(?=[\s>])|<svg[^>]*role=["']img/i.test(source)) return [];
    const route = '/' + relative(root, path).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
    return [route === '//' ? '/' : route];
  });
}
const routes = [...new Set(discover(root))].sort();
test('visual-route audit covers all source-rendered graphics/table routes', () => {
  expect(routes.length).toBeGreaterThanOrEqual(66);
});

// Every static route with visible graphics or a table is in the browser acceptance
// matrix. Operational UI and fixed 16:9 slides retain their own semantic layout.
for (const route of routes) {
  test('research figure/table route remains viewport-safe: ' + route, async ({ page }, testInfo) => {
    if (captureAudit) testInfo.setTimeout(600_000); // Full per-object capture includes dense tables; the ordinary overflow probe keeps its original budget.
    const evidence = [];
    for (const theme of (captureAudit ? ['light', 'dark'] : ['light'])) {
    for (const width of (captureAudit ? [390, 768, 1440] : [390, 1440])) {
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
      if (captureAudit) {
        await page.evaluate(() => {
          // Capture explicitly records this expanded reading state.
          for (const details of document.querySelectorAll('details')) {
            if (details.querySelector('figure, table')) details.open = true;
          }
        });
        await settleFigureHydration(page);
        const sourceFile=join(root,route==='/'?'index.html':route.slice(1)+'index.html');
        const source=readFileSync(sourceFile,'utf8');
        const expectedFigures=[...source.matchAll(/<figure(?=[\s>])/gi)].length;
        await expect(page.locator('figure')).toHaveCount(expectedFigures);
        const figureCount=await page.locator('figure').count();
        let figureIndex=0,svgIndex=0;
        for (const figure of await page.locator('figure, svg[role="img"]').all()) {
          const kind=await figure.evaluate(el=>el.tagName.toLowerCase()==='figure'?'figure':el.closest('figure')?'inside-figure':'nonfigure-svg');
          if(kind==='inside-figure') continue;
          const index=kind==='figure'?figureIndex++:svgIndex++;
          const readingState=await revealEvidenceReadingState(figure);
          const visible = await figure.isVisible();
          const png = `${kind}-${index}-${width}-${theme}.png`;
          const details = await figure.evaluate(el => ({
            owner: el.closest('[data-testid]')?.getAttribute('data-testid') || el.getAttribute('class') || '(none)',
            caption: (el.querySelector('figcaption')??el.querySelector('desc'))?.textContent?.trim() ?? '',
            sources: [...el.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
            svgTitles: el.querySelectorAll('svg title').length,
            box: el.getBoundingClientRect().toJSON(),
            text: [...el.querySelectorAll('svg text')].map(node => ({
              text: node.textContent, box: node.getBoundingClientRect().toJSON(),
              fontSize: getComputedStyle(node).fontSize,
              renderedFontSize:node instanceof SVGGraphicsElement?parseFloat(getComputedStyle(node).fontSize)*Math.hypot(node.getScreenCTM()?.a??1,node.getScreenCTM()?.b??0):null,
            })),
          }));
          if (visible) {
            await captureFigureEvidence(figure,testInfo.outputPath(png));
            if (width === 1440 && theme === 'light') {
              const grayscale = await page.addStyleTag({content:'html { filter: grayscale(1) !important; }'});
              await captureFigureEvidence(figure,testInfo.outputPath(`${kind}-${index}-grayscale.png`));
              await grayscale.evaluate(node => node.parentNode?.removeChild(node));
              await page.emulateMedia({media:'print'});
              if (await figure.isVisible()) await captureFigureEvidence(figure,testInfo.outputPath(`${kind}-${index}-print.png`));
              await page.emulateMedia({media:'screen'});
            }
          }
          evidence.push({route,kind,index,width,theme,...details,visible,png:visible?png:null,
            status:'NEEDS_VISUAL_REVIEW',state:readingState});
        }
        expect(figureIndex).toBe(figureCount);
        await expect(page.locator('figure')).toHaveCount(figureCount);
        const tables=[];
        const tableCount=await page.locator('table').count();
        for(let index=0;index<tableCount;index++){
          const target=page.locator('table').nth(index);
          await revealEvidenceReadingState(target);
          const table=await target.evaluate((el,index)=>({
            index,owner:el.className,caption:el.querySelector('caption')?.textContent?.trim()??'',
            box:el.getBoundingClientRect().toJSON(),rows:el.querySelectorAll('tr').length,
            columns:el.querySelector('tr')?.children.length??0,status:'NEEDS_VISUAL_REVIEW',
            inFigure:Boolean(el.closest('figure')),
            borders:{top:getComputedStyle(el).borderTopWidth,bottom:getComputedStyle(el).borderBottomWidth},
            cells:[...el.querySelectorAll('th,td')].map(cell=>({text:cell.textContent?.trim(),
              box:cell.getBoundingClientRect().toJSON(),fontSize:getComputedStyle(cell).fontSize})),
          }),index);
          tables.push(table);
          if (width!==768 && !table.inFigure && await target.isVisible())
            await captureFigureEvidence(target,testInfo.outputPath(`table-${table.index}-${width}-${theme}.png`));
        }
        await expect(page.locator('table')).toHaveCount(tableCount);
        evidence.push({route,width,theme,tables,rootOverflow:overflow});
      }
    }
    }
    if (captureAudit) writeFileSync(testInfo.outputPath('sitewide-figure-table.json'),JSON.stringify({
      sha:process.env.FIGURE_SOURCE_SHA,browser:testInfo.project.name,route,evidence,
      boundary:'Screenshots and geometry are review inputs; no automatic visual or scientific PASS.',
    },null,2)+'\n');
  });
}

test('short quantitative tables shrink without affecting dense tables or method diagrams', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
  const tables = page.locator('.paper-table');
  await expect(tables).toHaveCount(21);
  const sizes = await tables.evaluateAll(els => els.map(el => ({
    cols: el.querySelector('thead tr')?.children.length ?? 0,
    width: el.getBoundingClientRect().width,
    dense: el.classList.contains('paper-table--dense-results') || el.classList.contains('paper-table--ablation'),
  })));
  expect(sizes.some(item => item.cols <= 3 && !item.dense && item.width <= 740)).toBe(true);
  expect(sizes.some(item => item.cols >= 6 && item.width >= 900)).toBe(true);
  await expect(page.locator('.metric-evidence[data-research-figure-size="wide"]')).toHaveCount(7);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/');
  const acceleration = page.locator('.ba-accel__table');
  const accelSizes = await acceleration.evaluateAll(els => els.map(el => ({
    cols: el.querySelector('thead tr')?.children.length ?? 0,
    width: el.getBoundingClientRect().width,
  })));
  expect(accelSizes.find(row => row.cols === 2)?.width).toBeLessThan(500);
  expect(accelSizes.find(row => row.cols === 5)?.width).toBeGreaterThan(900);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');
  const state = page.locator('.bounded__table');
  expect((await state.first().boundingBox())!.width).toBeLessThan(760);
  expect((await state.last().boundingBox())!.width).toBeGreaterThan(900);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/');
  const v2Compact = page.locator('.comparison-table');
  const v2Wide = page.locator('.next-table');
  expect((await v2Compact.boundingBox())!.width).toBeLessThan(780);
  expect((await v2Wide.boundingBox())!.width).toBeGreaterThan(800);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-scaling/');
  await expect(page.locator('.scaling-chart')).toHaveAttribute('data-research-figure-size', 'wide');
  // Five annotated observations must not be reduced to unreadable tiny labels.
  expect((await page.locator('.scaling-chart').boundingBox())!.width).toBeGreaterThan(950);
});

test('paper evidence width remains local to scientific plots; app catalog remains intact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  const one = (await page.locator('[data-paper-effect="q07-inversion"]').boundingBox())!.width;
  const many = (await page.locator('[data-paper-effect="q09-context"]').boundingBox())!.width;
  expect(many).toBeGreaterThan(one + 180);
  await page.goto('/data-status/');
  expect((await page.locator('table').first().boundingBox())!.width).toBeGreaterThan(800);
  await page.goto('/research/seed-openevo/study/briefing/');
  expect(await page.locator('.dynamics-chart').count()).toBe(8);
});

for (const theme of ['light', 'dark'] as const) {
  test('SD-LoRA v2 small scientific table keeps method names and numbers intact on mobile: ' + theme, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/');
    const table = page.locator('.comparison-table');
    await expect(table).toContainText('Vanilla');
    await expect(table).toContainText('105.11 s');
    const geometry = await table.evaluate(el => {
      const th = el.querySelector('thead th:nth-child(2)')!;
      const value = el.querySelector('tbody tr:first-child td:nth-child(2)')!;
      const holder = el.parentElement!;
      return {
        width: el.getBoundingClientRect().width,
        holderWidth: holder.clientWidth,
        holderScrollWidth: holder.scrollWidth,
        headerWhitespace: getComputedStyle(th).whiteSpace,
        valueWhitespace: getComputedStyle(value).whiteSpace,
        holderOverflow: getComputedStyle(holder).overflowX
      };
    });
    expect(geometry.width).toBeGreaterThan(460);
    expect(geometry.holderScrollWidth).toBeGreaterThan(geometry.holderWidth);
    expect(geometry.headerWhitespace).toBe('nowrap');
    expect(geometry.valueWhitespace).toBe('nowrap');
    expect(geometry.holderOverflow).toBe('auto');
    const pageOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(pageOverflow).toBeLessThanOrEqual(2);
  });
}

for (const width of [390,768,1440]) for (const theme of ['light','dark'] as const) {
  test('scientific timing and composition tables keep readable labels with local scrolling: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'load'});
    const timing=page.locator('.advisor-timing-table');
    await timing.evaluate(node=>{
      for(let parent=node.parentElement;parent;parent=parent.parentElement)
        if(parent instanceof HTMLDetailsElement)parent.open=true;
    });
    const labelLines=()=>timing.locator('tbody th').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      return range.getClientRects().length;
    }));
    const acceptLabels=(lines:number[])=>lines.forEach(count=>expect(count).toBe(1));
    acceptLabels(await labelLines());
    for(const value of ['31.09','2.02','15.36','74.78','56.25','1.33'])await expect(timing).toContainText(value);
    if(width===390){
      await timing.locator('tbody th').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.whiteSpace='normal'));
      const old=await labelLines();
      expect(old.some(count=>count>1)).toBe(true);
      expect(()=>acceptLabels(old)).toThrow();
      await timing.locator('tbody th').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.removeProperty('white-space')));
      acceptLabels(await labelLines());
    }
    const rowBounds=()=>page.locator('.advisor-result-matrix tbody th[scope="row"]').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      const cell=node.getBoundingClientRect();
      return {text:node.textContent,lines:[...range.getClientRects()].map(rect=>({left:rect.left,right:rect.right})),left:cell.left,right:cell.right};
    }));
    const acceptRows=(rows:Awaited<ReturnType<typeof rowBounds>>)=>rows.forEach(row=>{
      expect(row.lines.length).toBeGreaterThan(0);
      for(const line of row.lines){expect(line.left).toBeGreaterThanOrEqual(row.left-1);expect(line.right).toBeLessThanOrEqual(row.right+1);}
    });
    acceptRows(await rowBounds());
    if(width===390){
      const oldLabel=page.locator('[data-advisor-matrix="q01"] tbody tr').nth(1).locator('th');
      await oldLabel.evaluate(node=>(node as HTMLElement).style.whiteSpace='nowrap');
      const oldRows=await rowBounds();
      expect(()=>acceptRows(oldRows)).toThrow();
      await oldLabel.evaluate(node=>(node as HTMLElement).style.removeProperty('white-space'));
      acceptRows(await rowBounds());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/',{waitUntil:'load'});
    const composition=page.locator('.ba-accel__table').filter({hasText:'能否直接 composition'});
    const wordLines=()=>composition.locator('thead th').nth(1).evaluate(node=>{
      const text=node.firstChild;
      if(!text||text.nodeType!==Node.TEXT_NODE)throw Error('Missing composition label text');
      const start=(text.textContent??'').indexOf('composition');
      if(start<0)throw Error('Missing scientific comparison label');
      const range=document.createRange();range.setStart(text,start);range.setEnd(text,start+'composition'.length);
      return range.getClientRects().length;
    });
    expect(await wordLines()).toBe(1);
    const holder=composition.locator('..');
    await expect(holder).toHaveCSS('overflow-x','auto');
    if(width===390){
      const geometry=await holder.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
      expect(geometry.scroll).toBeGreaterThan(geometry.client);
      await composition.evaluate(node=>{
        (node as HTMLElement).style.minWidth='0';
        (node as HTMLElement).style.maxWidth='min(100%,46rem)';
        (node.querySelector('thead th:nth-child(2)') as HTMLElement).style.whiteSpace='normal';
      });
      const old=await wordLines();
      expect(old).toBeGreaterThan(1);
      expect(()=>expect(old).toBe(1)).toThrow();
      await composition.evaluate(node=>{
        (node as HTMLElement).style.removeProperty('min-width');
        (node as HTMLElement).style.removeProperty('max-width');
        (node.querySelector('thead th:nth-child(2)') as HTMLElement).style.removeProperty('white-space');
      });
      expect(await wordLines()).toBe(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('experiment plan table preserves contrast and time column reading width: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/results/four-arm-analysis/',{waitUntil:'load'});
    const table=page.locator('.plan-table');
    const widths=()=>table.evaluate(el=>{
      const row=el.querySelector('tbody tr')!,rem=parseFloat(getComputedStyle(document.documentElement).fontSize);
      return {contrast:row.children[2]!.getBoundingClientRect().width/rem,gpu:row.children[4]!.getBoundingClientRect().width/rem,time:row.children[5]!.getBoundingClientRect().width/rem};
    });
    const accept=(value:Awaited<ReturnType<typeof widths>>)=>{
      expect(value.contrast).toBeGreaterThanOrEqual(12);
      expect(value.gpu).toBeGreaterThanOrEqual(6);
      expect(value.time).toBeGreaterThanOrEqual(7);
    };
    accept(await widths());
    for(const id of ['B1','B2','B3','B4','B5','B6','B7','B8'])await expect(table).toContainText(id);
    await expect(table.locator('..')).toHaveCSS('overflow-x','auto');
    if(width===390){
      expect(await table.locator('..').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeGreaterThan(0);
      await table.locator('td:has(>code),td:nth-last-child(2),td:last-child').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.minWidth='0'));
      const old=await widths();
      expect(()=>accept(old)).toThrow();
      await table.locator('td:has(>code),td:nth-last-child(2),td:last-child').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.removeProperty('min-width')));
      accept(await widths());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}
