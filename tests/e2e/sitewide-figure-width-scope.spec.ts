import { expect, test, type Locator } from '@playwright/test';
import { createHash } from 'node:crypto';
import { captureFigureEvidence, revealEvidenceReadingState, settleFigureHydration } from './figure-evidence';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const paperTableBaseline = JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/research-paper-table-values.json'), 'utf8')) as { routes: { route: string; tables: { index: number; hash: string }[] }[] };

async function expectPaperGrammar(target: Locator, route: string, index: number) {

  const expected = paperTableBaseline.routes.find(entry => entry.route === route)?.tables.find(entry => entry.index === index);
  expect(expected, 'sealed original table identity '+route+'#'+index).toBeTruthy();
  const cellTexts = await target.locator('th,td').evaluateAll(cells => cells.map(cell => cell.textContent?.trim()));
  expect(createHash('sha256').update(JSON.stringify(cellTexts)).digest('hex')).toBe(expected!.hash);
  const grammar = await target.evaluate(el => {
    const style = getComputedStyle(el);
    const cap = el.querySelector('caption')!;
    const box = el.getBoundingClientRect(), captionBox = cap.getBoundingClientRect();
    const cells = [...el.querySelectorAll<HTMLElement>('th,td')];
    return {
      readableColumns: [...el.querySelectorAll<HTMLElement>('tbody th,tbody td')].every(cell => {
        const minimum = cell.matches(':first-child') ? 8 : cell.classList.contains('paper-table__mark') ? 2 : cell.hasAttribute('data-numeric') ? 7 : 12;
        const css=getComputedStyle(cell);
        return cell.getBoundingClientRect().width >= parseFloat(css.fontSize)*minimum-1 && css.overflowWrap==='normal' && css.wordBreak==='normal';
      }),
      roles: [...el.querySelectorAll('thead,tbody,tfoot,tr,th,td')].every(node => getComputedStyle(node).display === ({THEAD:'table-header-group',TBODY:'table-row-group',TFOOT:'table-footer-group',TR:'table-row',TH:'table-cell',TD:'table-cell'} as Record<string,string>)[node.tagName]),
      display: style.display, family: style.fontFamily, font: parseFloat(style.fontSize),
      top: parseFloat(style.borderTopWidth), bottom: parseFloat(style.borderBottomWidth),
      caption: Boolean(cap && captionBox.width > 0 && captionBox.height > 0 && captionBox.bottom <= (el.querySelector('thead,tbody,tr')?.getBoundingClientRect().top ?? box.top) + 2),
      captionSide: getComputedStyle(cap).captionSide,
      verticalRules: cells.some(cell => parseFloat(getComputedStyle(cell).borderLeftWidth) > 0 || parseFloat(getComputedStyle(cell).borderRightWidth) > 0),
      bodyRules: [...el.querySelectorAll<HTMLElement>('tbody tr:not(:first-child)>*')].some(cell => parseFloat(getComputedStyle(cell).borderTopWidth) > 0 || parseFloat(getComputedStyle(cell).borderBottomWidth) > 0),
      numeric: [...el.querySelectorAll<HTMLElement>('[data-numeric]')].every(cell => getComputedStyle(cell).textAlign === 'right' && getComputedStyle(cell).fontVariantNumeric.includes('tabular-nums')),
      bodyBackgrounds: [...el.querySelectorAll<HTMLElement>('tbody tr,tbody th,tbody td')].every(cell => ['rgba(0, 0, 0, 0)','transparent'].includes(getComputedStyle(cell).backgroundColor)),
    };
  });
  expect(grammar.display).toBe('table');
  expect(grammar.roles).toBe(true);
  expect(grammar.readableColumns).toBe(true);
  expect(grammar.family).toContain('Times');
  expect(grammar.font).toBeGreaterThanOrEqual(route.includes('/briefing/') ? 14 : 16);
  expect(grammar.top).toBeGreaterThan(0);
  expect(grammar.bottom).toBeGreaterThan(0);
  expect(grammar.caption, JSON.stringify(grammar)).toBe(true);
  expect(grammar.captionSide).toBe('top');
  expect(grammar.verticalRules).toBe(false);
  expect(grammar.bodyRules).toBe(false);
  expect(grammar.numeric).toBe(true);
  expect(grammar.bodyBackgrounds).toBe(true);
  await expect(target.locator('..')).toHaveCSS('overflow-x','auto');
}

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
      const nativeTables = page.locator('table');
      for (let index = 0; index < await nativeTables.count(); index++) {
        const target = nativeTables.nth(index);
        if (await target.getAttribute('data-research-paper-table') !== null && await target.isVisible()) await expectPaperGrammar(target, route, index);
      }
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
          const readingState=await revealEvidenceReadingState(target);
          const visible=await target.isVisible();
          const alternative=await target.evaluate(el=>({
            phone:Boolean(el.closest('.advisor-viz__q03-phone-table')),
            compactCatalog:Boolean(el.closest('.seed-reproduction.compact .catalog-wrap')),
          }));
          if(!visible){
            // The source owns this responsive alternative: its desktop SVG is
            // visible above 720px, while the same data table appears on phones.
            if(alternative.phone){
              expect(width).toBeGreaterThan(720);
              await expect(page.locator('[data-q03-desktop-chart]')).toBeVisible();
            }else{
              // SeedReproductionPath's compact variant explicitly excludes its
              // rental catalog; it is source-present, never a reading state.
              expect(alternative.compactCatalog).toBe(true);
              expect(route).toBe('/papers/seed/');
              expect([0,1]).toContain(index);
            }
          }
          const table=await target.evaluate((el,index)=>({
            index,owner:el.className,caption:el.querySelector('caption')?.textContent?.trim()??'',
            box:el.getBoundingClientRect().toJSON(),rows:el.querySelectorAll('tr').length,
            columns:el.querySelector('tr')?.children.length??0,status:'NEEDS_VISUAL_REVIEW',
            inFigure:Boolean(el.closest('figure')),
            borders:{top:getComputedStyle(el).borderTopWidth,bottom:getComputedStyle(el).borderBottomWidth},
            cells:[...el.querySelectorAll('th,td')].map(cell=>({text:cell.textContent?.trim(),
              box:cell.getBoundingClientRect().toJSON(),fontSize:getComputedStyle(cell).fontSize})),
          }),index);

          if (await target.getAttribute('data-research-paper-table') !== null && visible) await expectPaperGrammar(target, route, index);
          tables.push({...table,visible,state:visible?readingState:alternative.phone?'source-owned phone-only table; desktop data chart visible':'source-owned compact rental catalog excluded from this page'});
          if(visible) {
            await captureFigureEvidence(target,testInfo.outputPath(`table-${table.index}-${width}-${theme}.png`));
            if(width===1440 && theme==='light' && await target.getAttribute('data-research-paper-table') !== null) {
              await target.evaluate(node=>(node as HTMLElement).style.filter='grayscale(1)');
              await captureFigureEvidence(target,testInfo.outputPath(`table-${table.index}-grayscale.png`));
              await target.evaluate(node=>(node as HTMLElement).style.removeProperty('filter'));
              await page.emulateMedia({media:'print'});
              await captureFigureEvidence(target,testInfo.outputPath(`table-${table.index}-print.png`));
              await page.emulateMedia({media:'screen'});
            }
          }
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

test('paper tables use content width while dense comparisons and diagrams retain their reading space', async ({ page }) => {
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
  expect(accelSizes.find(row => row.cols === 5)?.width).toBeGreaterThan((accelSizes.find(row => row.cols === 2)?.width ?? Infinity) + 180);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');
  const state = page.locator('.bounded__table');
  await expect(state).toHaveCount(2);
  // A text-heavy three-column comparison can be wider than a four-column
  // numeric result. Both must keep their intrinsic width when extra room is
  // available, rather than stretching to fill an arbitrary desktop column.
  const acceptIntrinsicWidth = async (table: Locator) => {
    const column = table.locator('..').locator('..');
    const originalStyle = await column.getAttribute('style');
    const before = (await table.boundingBox())!.width;
    const available = (await column.boundingBox())!.width;
    expect(before).toBeLessThan(available);
    try {
      await column.evaluate((el, width) => { (el as HTMLElement).style.width=width+'px'; (el as HTMLElement).style.maxWidth='none'; }, available+600);
      expect(Math.abs((await table.boundingBox())!.width-before)).toBeLessThanOrEqual(2);
    } finally {
      await column.evaluate((el, style) => { if(style===null)el.removeAttribute('style');else el.setAttribute('style',style); },originalStyle);
    }
  };
  for (const table of await state.all()) await acceptIntrinsicWidth(table);
  const compactState = state.first(), compactWindow = compactState.locator('..');
  await compactWindow.evaluate(el => (el as HTMLElement).style.width='100%');
  await compactState.evaluate(el => (el as HTMLElement).style.width='100%');
  await expect(acceptIntrinsicWidth(compactState)).rejects.toThrow();
  await compactWindow.evaluate(el => (el as HTMLElement).style.removeProperty('width'));
  await compactState.evaluate(el => (el as HTMLElement).style.removeProperty('width'));
  await acceptIntrinsicWidth(compactState);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/');
  const v2Compact = page.locator('.comparison-table');
  const v2Wide = page.locator('.next-table');
  expect((await v2Compact.boundingBox())!.width).toBeLessThan(780);
  expect((await v2Wide.boundingBox())!.width).toBeGreaterThan((await v2Compact.boundingBox())!.width);

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
      await oldLabel.evaluate(node=>{
        const table=node.closest('table')!;
        table.style.tableLayout='fixed';table.style.width='350px';table.style.minWidth='0';table.style.maxWidth='350px';
        (node as HTMLElement).style.whiteSpace='nowrap';
      });
      const oldRows=await rowBounds();
      expect(()=>acceptRows(oldRows)).toThrow();
      await oldLabel.evaluate(node=>{
        (node as HTMLElement).style.removeProperty('white-space');
        const table=node.closest('table')!;
        for(const property of ['table-layout','width','min-width','max-width'])table.style.removeProperty(property);
      });
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

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('table evidence enters the actual shopping illustration step: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/mechanism-1-0/',{waitUntil:'load'});
    const example=page.locator('[data-task-example]');
    const table=example.locator('table');
    await expect(example.locator('[data-example-controls]')).toBeVisible();
    await example.locator('[data-example-reset]').click();
    const ready=async()=>expect(await table.isVisible()).toBe(true);
    await expect(ready()).rejects.toThrow();
    expect(await revealEvidenceReadingState(table)).toBe('shopping example step 1');
    await ready();
    await expect(example.locator('[data-example-position]')).toHaveText('2 / 4');
    await expect(table).toContainText('$18');
    await expect(table).toContainText('$24');
    expect((await table.boundingBox())!.width).toBeGreaterThan(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('SD-LoRA research-line names stay within their table cells: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/',{waitUntil:'load'});
    const names=page.locator('.next-table tbody th');
    const measure=()=>names.evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      const cell=node.getBoundingClientRect();
      return {text:node.textContent,left:cell.left,right:cell.right,lines:[...range.getClientRects()].map(r=>({left:r.left,right:r.right}))};
    }));
    const accept=(rows:Awaited<ReturnType<typeof measure>>)=>rows.forEach(row=>{
      expect(row.lines.length).toBeGreaterThan(0);
      for(const line of row.lines){expect(line.left).toBeGreaterThanOrEqual(row.left-1);expect(line.right,row.text??'').toBeLessThanOrEqual(row.right+1);}
    });
    accept(await measure());
    await expect(names.nth(0)).toHaveText('SD-LoRA v2 · Stable Reduction');
    await expect(names.nth(1)).toHaveText('SD-LoRA · Bounded Online Recurrence');
    if(width===390){
      await names.evaluateAll(nodes=>nodes.forEach(node=>{
        const table=node.closest('table')!;
        table.style.tableLayout='fixed';table.style.width='350px';table.style.minWidth='0';table.style.maxWidth='350px';
        (node as HTMLElement).style.whiteSpace='nowrap';
      }));
      const old=await measure();expect(()=>accept(old)).toThrow();
      await names.evaluateAll(nodes=>nodes.forEach(node=>{
        (node as HTMLElement).style.removeProperty('white-space');
        const table=node.closest('table')!;
        for(const property of ['table-layout','width','min-width','max-width'])table.style.removeProperty(property);
      }));
      accept(await measure());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}

test('native table capture respects the real scroll container instead of photographing following content',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:900});
  await page.setContent('<style>body{margin:0} .holder{height:180px;width:350px;overflow:auto} td{height:30px}</style><div class="holder"><table>'+Array.from({length:100},(_,i)=>'<tr><td>Measured row '+i+'</td><td>'+i+'</td></tr>').join('')+'</table></div><p>Following page content is outside the table reader.</p>');
  const table=page.locator('table');
  const rect=await table.boundingBox();
  const bad=testInfo.outputPath('unclipped-table-negative.png');
  await page.screenshot({path:bad,clip:rect!,fullPage:true});
  const pixels=(path:string)=>({width:readFileSync(path).readUInt32BE(16),height:readFileSync(path).readUInt32BE(20)});
  // Native PNGs use device pixels; the reader window and clip use CSS pixels.
  const deviceScale=await page.evaluate(()=>window.devicePixelRatio);
  expect(deviceScale).toBeGreaterThan(0);
  const accept=(size:{width:number;height:number})=>{expect(size.width/deviceScale).toBeLessThanOrEqual(350);expect(size.height/deviceScale).toBeLessThanOrEqual(180);expect(size.height).toBeGreaterThan(0);};
  const original=pixels(bad);expect(()=>accept(original)).toThrow();
  const good=testInfo.outputPath('scroll-container-native-positive.png');
  const clip=await captureFigureEvidence(table,good);
  accept(pixels(good));expect(clip.height).toBe(180);
  expect(pixels(good).height).toBe(clip.height*deviceScale);
  await expect(page.locator('.holder')).toHaveJSProperty('scrollTop',0);
});

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('bounded-state table labels and numerical differences retain content width: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/',{waitUntil:'load'});
    const rank=page.locator('.paper-table').filter({hasText:'rank95 · median'}).first();
    const cell=rank.locator('tbody tr').first().locator('td').first();
    const lines=()=>cell.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length;});
    const accept=(count:number)=>expect(count).toBeLessThanOrEqual(2);
    accept(await lines());
    await expect(rank).toContainText('rank95 · median');
    if(width===390){
      const holder=rank.locator('..');
      await expect(holder).toHaveCSS('overflow-x','auto');
      expect(await holder.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeGreaterThan(0);
      await rank.evaluate(el=>{(el as HTMLElement).style.minWidth='0';(el as HTMLElement).style.maxWidth='100%';});
      await rank.locator('th,td').evaluateAll(nodes=>nodes.forEach(el=>(el as HTMLElement).style.minWidth='0'));
      const old=await lines();expect(()=>accept(old)).toThrow();
      await rank.evaluate(el=>{(el as HTMLElement).style.removeProperty('min-width');(el as HTMLElement).style.removeProperty('max-width');});
      await rank.locator('th,td').evaluateAll(nodes=>nodes.forEach(el=>(el as HTMLElement).style.removeProperty('min-width')));
      accept(await lines());
    }
    const difference=page.locator('.paper-table').filter({hasText:'R1–R159 mean reward'}).locator('tbody tr').first().locator('td').last();
    await expect(difference).toContainText('+0.0250');
    const fragments=await difference.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length;});
    expect(fragments).toBe(1);
    const entropy=page.locator('.paper-table').filter({hasText:'R0–31 mean H'});
    const numericFragments=await entropy.locator('tbody td:nth-child(n+2)').evaluateAll(nodes=>nodes.map(el=>{
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),tops=new Set<number>();
      while(walker.nextNode()){
        const r=document.createRange();r.selectNodeContents(walker.currentNode);
        for(const rect of r.getClientRects())if(rect.width)tops.add(Math.round(rect.top*10)/10);
      }
      return tops.size;
    }));
    for(const count of numericFragments)expect(count).toBe(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('three-way curve and legend identities survive grayscale: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/',{waitUntil:'load'});
    const names=["task-score.svg","task-score-20-round-mean.svg","loss-vs-rollout.svg","task-vector-frobenius.svg","tokens-per-step.svg","steps-per-episode.svg","action-family-entropy.svg"];
    const styles=await page.evaluate(async names=>Promise.all(names.map(async name=>{
      const response=await fetch('/research/seed-openevo/evidence/wandb-threeway/'+name);
      if(!response.ok)throw Error('Missing native plot '+name);
      const svg=new DOMParser().parseFromString(await response.text(),'image/svg+xml');
      return {name,curves:[...svg.querySelectorAll('polyline')].map(el=>({stroke:el.getAttribute('stroke'),dash:el.getAttribute('stroke-dasharray')})),legend:[...svg.querySelectorAll('line[stroke="#2563EB"],line[stroke="#B91C1C"]')].map(el=>el.getAttribute('stroke-dasharray'))};
    })),names);
    for(const plot of styles){
      expect(plot.curves.some(c=>c.stroke==='#2563EB'&&c.dash==='12 6'),plot.name).toBe(true);
      expect(plot.curves.some(c=>c.stroke==='#B91C1C'&&c.dash==='3 5'),plot.name).toBe(true);
      expect(plot.legend,plot.name).toEqual(expect.arrayContaining(['12 6','3 5']));
    }
  });
}

test('expanded SD-LoRA paper comparison survives print without exposing unrelated sections',async({page},testInfo)=>{
  await page.goto('/research/seed-openevo/flow/sd-lora/',{waitUntil:'load'});
  const table=page.locator('table[data-research-paper-table]').first();
  await revealEvidenceReadingState(table);
  await page.emulateMedia({media:'print'});
  await expect(table).toBeVisible();
  const section=table.locator('xpath=ancestor::details[1]');
  await expect(section).toHaveAttribute('open','');
  await expect(page.locator('.sdlora__details')).toBeHidden();
  await section.evaluate(node=>(node as HTMLElement).style.display='none');
  await expect(captureFigureEvidence(table,testInfo.outputPath('sd-lora-print-hidden-negative.png'))).rejects.toThrow('no visible reading surface');
  await section.evaluate(node=>(node as HTMLElement).style.removeProperty('display'));
  await expect(table).toBeVisible();
  await captureFigureEvidence(table,testInfo.outputPath('sd-lora-paper-comparison-print.png'));
  await page.emulateMedia({media:'screen'});
});

for(const width of [390,768,1440]) {
  test('paper row labels remain whole words and checkpoint identifiers: '+width,async({page})=>{
    await page.setViewportSize({width,height:900});
    const route='/research/seed-openevo/study/parameter-memory-results/';
    await page.goto(route,{waitUntil:'load'});
    for(const id of ['q02','q03','q06','q07']) {
      const table=page.locator('[data-advisor-matrix="'+id+'"] table');
      await revealEvidenceReadingState(table);
      const label=table.locator('tbody th').first();
      const before=await label.boundingBox();
      expect(before!.width).toBeGreaterThanOrEqual(127);
      const fragments=await label.evaluate(el=>{
        const text=el.firstChild!;
        const value=text.textContent??'',word=value.match(/SFT|A\d+|Bounded/);
        if(!word)throw Error('Missing scientific row identifier');
        const range=document.createRange();range.setStart(text,word.index!);range.setEnd(text,word.index!+word[0].length);
        return range.getClientRects().length;
      });
      expect(fragments).toBe(1);
      await label.evaluate(el=>{(el as HTMLElement).style.minWidth='0';(el as HTMLElement).style.width='1ch';(el as HTMLElement).style.maxWidth='1ch';(el as HTMLElement).style.overflowWrap='anywhere';});
      const index=await table.evaluate(el=>[...document.querySelectorAll('table')].indexOf(el as HTMLTableElement));
      await expect(expectPaperGrammar(table,route,index)).rejects.toThrow();
      await label.evaluate(el=>{for(const property of ['min-width','width','max-width','overflow-wrap'])(el as HTMLElement).style.removeProperty(property);});
      expect((await label.boundingBox())!.width).toBeGreaterThanOrEqual(127);
    }
  });
}
