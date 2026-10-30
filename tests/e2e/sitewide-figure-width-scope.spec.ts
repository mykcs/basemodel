import { expect, test, type Locator } from '@playwright/test';
import { createHash } from 'node:crypto';
import { RETROSPECTIVE_NUMERIC_CELLS, RETROSPECTIVE_QUESTION_LABELS } from '../fixtures/open-evo-research-retrospective-tables';
import { captureFigureEvidence, revealEvidenceReadingState, settleFigureHydration } from './figure-evidence';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const paperTableBaseline = JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/research-paper-table-values.json'), 'utf8')) as { routes: { route: string; tables: { index: number; hash: string }[] }[] };
const responseRoute = '/research/seed-openevo/study/parameter-memory-results/';
const sdLoraScalingRoute = '/research/seed-openevo/study/capability-exploration/sd-lora-scaling/';
// #938 / experiment 877ade0e: preserve the sealed new comparison explicitly;
// never regenerate the immutable historical table receipt from current output.
const q01FreshCells = [
  '方法与保存点', '后期减早期（分）', '校正 95% 区间（分）',
  '普通 OpenEVO：160 − 120', '+4.59', '−7.07 至 +16.73',
  'Bounded：160 − 150', '+2.52', '−8.04 至 +13.84',
  '历史 β/GDR：160 − 130', '−5.16', '−16.50 至 +5.29',
];
// This table deliberately changed from the older four-column receipt when
// typography work grouped each stage's schedule and note into one readable
// record cell. Keep its current evidence explicit without rewriting history.
const webshopDataUsageCells = [
  '阶段及 task 抽样', '轨迹数', '不同 goal 覆盖',
  'Stage 1 · hindsight-skill SFT180 个不同 goal × 每个 8 条 rollout先固定抽出 180 个 goal；这 180 个内部不重复。',
  '1,440', '2.8% 的 6,410-goal 训练候选池',
  'Stage 2 · 论文设置150 policy updates × 每轮 16 个 goal × 每个 8 条 rollout跨 update 可以重新抽到旧 goal，因此不是把训练池顺序扫一遍。',
  '19,200', '最多 2,400 个不同 goal；按 released sampler 的期望值约 2,004 个（31.3%）',
  'Stage 2 · 当前公开脚本默认160 epochs/updates × 每轮 16 个 goal × 每个 8 条 rollout公开脚本的 total_epochs=160；官方技术说明把论文设置记为 150 policy updates。',
  '20,480', '最多 2,560 个不同 goal；期望约 2,113 个（33.0%）',
];

async function expectPaperGrammar(target: Locator, route: string, index: number) {

  // Preserve the immutable hashes for all historical research tables. The
  // Q03 paper repair replaced two tables with one, #938 inserted a fresh Q01
  // comparison, and the advisor explanation now includes an *unnumbered*
  // Q03 protocol matrix. New content has its own semantic tests; it must not
  // shift the lookup onto a different sealed scientific table.
  const cellTexts = await target.locator('th,td').evaluateAll(cells => cells.map(cell => cell.textContent?.trim()));
  const freshQ01 = route === responseRoute && await target.evaluate(el => Boolean(el.closest('[data-q01-fresh448]')));
  const currentWebshopDataUsage = route === '/research/seed-openevo/flow/webshop/'
    && await target.evaluate(el => Boolean(el.closest('.webshop-seed-data-usage')));
  const retrospective = route === '/research/seed-openevo/recent-challenges/'
    && await target.evaluate(el => Boolean(el.closest('[data-research-retrospective]')));
  if (retrospective) {
    // Keep numeric receipts bound to their evidence sections while checking
    // both newly added editorial tables by identity and content.
    const identity = await target.evaluate(el => {
      const root = el.closest('[data-research-retrospective]')!;
      const numericTables = [...root.querySelectorAll('#findings table, #history table')];
      if (el.closest('#advisor')) return { kind: 'advisor', numericIndex: -1, numericCount: numericTables.length, totalTables: root.querySelectorAll('table').length };
      if (el.closest('#questions')) return { kind: 'questions', numericIndex: -1, numericCount: numericTables.length, totalTables: root.querySelectorAll('table').length };
      return { kind: 'numeric', numericIndex: numericTables.indexOf(el), numericCount: numericTables.length, totalTables: root.querySelectorAll('table').length };
    });
    expect(identity.numericCount).toBe(RETROSPECTIVE_NUMERIC_CELLS.length);
    expect(identity.totalTables).toBe(RETROSPECTIVE_NUMERIC_CELLS.length + 2);
    if (identity.kind === 'numeric') {
      expect(identity.numericIndex, 'only declared numeric evidence sections are allowed').toBeGreaterThanOrEqual(0);
      expect(cellTexts, 'retrospective source-bound numeric table ' + identity.numericIndex).toEqual(RETROSPECTIVE_NUMERIC_CELLS[identity.numericIndex]);
    } else if (identity.kind === 'questions') {
      expect(await target.locator('tbody th').allTextContents()).toEqual(RETROSPECTIVE_QUESTION_LABELS);
      await expect(target.locator('tbody tr')).toHaveCount(10);
      for (const row of await target.locator('tbody tr').all()) {
        await expect(row.locator('td')).not.toHaveText('');
        await expect(row.locator('a')).toHaveCount(1);
      }
    } else {
      await expect(target.locator('thead th')).toHaveText(['需要回答的议题', '已经可检查的事实', '仍未过关的地方']);
      await expect(target.locator('tbody th')).toHaveText(['科研能力和推进速度', '怎样利用 AI 做科研', '方向是否值得继续', '继续讨论的机会与名额']);
      await expect(target.locator('tbody tr')).toHaveCount(4);
      await expect(target).toContainText('必须分开正式确认');
      await expect(target).toContainText('现有转写不构成录取承诺');
      for (const row of await target.locator('tbody tr').all()) {
        await expect(row.locator('td')).toHaveCount(2);
        for (const cell of await row.locator('td').all()) await expect(cell).not.toHaveText('');
      }
    }
  } else if (freshQ01) {
    expect(cellTexts, 'sealed Q01 fresh-448 comparison').toEqual(q01FreshCells);
  } else if (currentWebshopDataUsage) {
    expect(cellTexts, 'current WebShop data-usage evidence after its documented readable-column redesign').toEqual(webshopDataUsageCells);
  } else {
    const protocolBeforeTarget = route === responseRoute ? await target.evaluate(el => {
      const protocol=document.querySelector('[data-q03-protocol]');
      return protocol && Boolean(protocol.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) ? 1 : 0;
    }) : 0;
    const afterInsertions = route === responseRoute ? index - 1 - protocolBeforeTarget : index;
    const reorderedSdLoraTableIndex = route === sdLoraScalingRoute && index < 2 ? 1 - index : index;
    const originalIndex = route === sdLoraScalingRoute
      ? reorderedSdLoraTableIndex
      : route === responseRoute && afterInsertions >= 5 ? afterInsertions + 1 : afterInsertions;
    const expected = paperTableBaseline.routes.find(entry => entry.route === route)?.tables.find(entry => entry.index === originalIndex);
    expect(expected, 'sealed original table identity '+route+'#'+index).toBeTruthy();
    expect(createHash('sha256').update(JSON.stringify(cellTexts)).digest('hex')).toBe(expected!.hash);
  }
  const grammar = await target.evaluate(el => {
    const style = getComputedStyle(el);
    const cap = el.querySelector('caption')!;
    const box = el.getBoundingClientRect(), captionBox = cap.getBoundingClientRect();
    const cells = [...el.querySelectorAll<HTMLElement>('th,td')];
    return {
      readableColumns: [...el.querySelectorAll<HTMLElement>('tbody th,tbody td')].every(cell => {
        const css=getComputedStyle(cell);
        return cell.scrollWidth <= cell.clientWidth + 2 && parseFloat(css.fontSize) >= (style.display === 'block' ? 15 : el.closest('.research-booktabs-wrap--presentation') ? 14 : 12) && css.wordBreak === 'normal';
      }),
      records: style.display === 'block',
      intactIdentifiers: [...el.querySelectorAll('tbody tr > :first-child')].every(cell => {
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const text = walker.currentNode;
          for (const word of (text.textContent ?? '').matchAll(/SFT|A\d+|Bounded|OpenEVO|DirectApply|Vanilla|rank\d+/g)) {
            const range = document.createRange(); range.setStart(text, word.index!); range.setEnd(text, word.index! + word[0].length);
            if (range.getClientRects().length !== 1) return false;
          }
        }
        return true;
      }),
      roles: style.display === 'block' ? el.getAttribute('role') === 'table' && [...el.querySelectorAll('tbody td')].every(cell => Boolean((cell as HTMLElement).dataset.paperLabel)) : [...el.querySelectorAll('thead,tbody,tfoot,tr,th,td')].every(node => getComputedStyle(node).display === ({THEAD:'table-header-group',TBODY:'table-row-group',TFOOT:'table-footer-group',TR:'table-row',TH:'table-cell',TD:'table-cell'} as Record<string,string>)[node.tagName]),
      display: style.display, family: style.fontFamily, font: parseFloat(style.fontSize),
      top: parseFloat(style.borderTopWidth), bottom: parseFloat(style.borderBottomWidth),
      caption: Boolean(cap && captionBox.width > 0 && captionBox.height > 0 && captionBox.bottom <= (el.querySelector(style.display === 'block' ? 'tbody' : 'thead,tbody,tr')?.getBoundingClientRect().top ?? box.top) + 2),
      captionSide: getComputedStyle(cap).captionSide,
      verticalRules: cells.some(cell => parseFloat(getComputedStyle(cell).borderLeftWidth) > 0 || parseFloat(getComputedStyle(cell).borderRightWidth) > 0),
      bodyRules: [...el.querySelectorAll<HTMLElement>('tbody tr:not(:first-child)>*')].some(cell => parseFloat(getComputedStyle(cell).borderTopWidth) > 0 || parseFloat(getComputedStyle(cell).borderBottomWidth) > 0),
      numeric: [...el.querySelectorAll<HTMLElement>('[data-numeric]')].every(cell => (style.display === 'block' || getComputedStyle(cell).textAlign === 'right') && (el.closest('[data-seed-world4-case]') ? getComputedStyle(cell).fontVariantNumeric === 'normal' : getComputedStyle(cell).fontVariantNumeric.includes('tabular-nums'))),
      bodyBackgrounds: [...el.querySelectorAll<HTMLElement>('tbody tr,tbody th,tbody td')].every(cell => ['rgba(0, 0, 0, 0)','transparent'].includes(getComputedStyle(cell).backgroundColor)),
    };
  });
  expect(['table','block']).toContain(grammar.display);
  expect(grammar.roles).toBe(true);
  expect(grammar.intactIdentifiers, 'scientific method and checkpoint identifiers must remain whole').toBe(true);
  expect(grammar.readableColumns, JSON.stringify(await target.locator('tbody th,tbody td').evaluateAll(cells=>cells.map(cell=>({text:cell.textContent,width:(cell as HTMLElement).offsetWidth,font:getComputedStyle(cell).fontSize,min:getComputedStyle(cell).minWidth,wrap:getComputedStyle(cell).overflowWrap,break:getComputedStyle(cell).wordBreak}))))).toBe(true);
  expect(grammar.family).toContain('Times');
  expect(grammar.font).toBeGreaterThanOrEqual(grammar.records ? 15 : route.includes('/briefing/') ? 14 : 12);
  expect(grammar.top).toBeGreaterThan(0);
  expect(grammar.bottom).toBeGreaterThan(0);
  expect(grammar.caption, JSON.stringify(grammar)).toBe(true);
  expect(grammar.captionSide).toBe('top');
  expect(grammar.verticalRules).toBe(false);
  expect(grammar.bodyRules).toBe(false);
  expect(grammar.numeric).toBe(true);
  expect(grammar.bodyBackgrounds).toBe(true);
  expect(await target.locator('..').evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(2);
  expect(await target.locator('..').evaluate(node => getComputedStyle(node).overflowX)).not.toMatch(/hidden|clip/);
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
      if (route === responseRoute) await expect(page.locator('[data-q01-fresh448] table')).toHaveCount(1);
      if (route === '/research/seed-openevo/recent-challenges/') {
        await expect(nativeTables).toHaveCount(7);
        await expect(page.locator('#advisor table')).toHaveCount(1);
        await expect(page.locator('#findings table')).toHaveCount(4);
        await expect(page.locator('#history table')).toHaveCount(1);
        await expect(page.locator('#questions table')).toHaveCount(1);
      }
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

test('Q01 table identity rejects a changed scientific value and accepts restoration', async ({ page }) => {
  await page.goto(responseRoute);
  const target = page.locator('[data-q01-fresh448] table');
  await expectPaperGrammar(target, responseRoute, 0);
  const cell = target.locator('tbody td').first();
  const original = await cell.textContent();
  try {
    await cell.evaluate(el => { el.textContent = '+4.60'; });
    await expect(expectPaperGrammar(target, responseRoute, 0)).rejects.toThrow(/sealed Q01 fresh-448 comparison/);
  } finally {
    await cell.evaluate((el, text) => { el.textContent = text; }, original);
  }
  await expectPaperGrammar(target, responseRoute, 0);
});

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
  expect(sizes.some(item => item.cols >= 6)).toBe(true);
  expect(await tables.evaluateAll(els=>els.every(el=>el.getBoundingClientRect().width<=el.parentElement!.parentElement!.clientWidth+2))).toBe(true);
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
    const available = (await column.boundingBox())!.width;
    try {
      await column.evaluate((el, width) => { (el as HTMLElement).style.width=width+'px'; (el as HTMLElement).style.maxWidth='none'; }, available+600);
      const before = (await table.boundingBox())!.width;
      expect(before).toBeLessThan(available + 600);
      await column.evaluate((el, width) => { (el as HTMLElement).style.width=width+'px'; }, available+1200);
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
  // The compact default stays responsive; the native reader exposes the full
  // source plot on demand, with scrolling owned by its labelled viewport.
  const nativeReader = page.locator('.scaling-chart [data-native-svg-reader]');
  const nativeToggle = nativeReader.locator('.native-svg-reader__toggle');
  await nativeReader.locator('.native-svg-reader__action').click();
  await expect(nativeToggle).toBeChecked();
  const nativeViewport = nativeReader.locator('.native-svg-reader__viewport');
  expect((await nativeReader.locator('svg').boundingBox())!.width).toBeGreaterThanOrEqual(912);
  expect(await nativeViewport.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
  expect(await page.locator('.scaling-chart').evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(2);
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
    expect(geometry.width).toBeLessThanOrEqual(geometry.holderWidth+2);
    expect(geometry.holderScrollWidth).toBeLessThanOrEqual(geometry.holderWidth+2);
    expect(['hidden','clip']).not.toContain(geometry.holderOverflow);
    const pageOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(pageOverflow).toBeLessThanOrEqual(2);
  });
}

for (const width of [390,768,1440]) for (const theme of ['light','dark'] as const) {
  test('scientific timing and composition tables fit the article: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    for(const [route,selector,values] of [
      ['/research/seed-openevo/study/parameter-memory-results/','.advisor-timing-table',['31.09','2.02','15.36','74.78','56.25','1.33']],
      ['/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/','.ba-accel__table', ['composition']],
    ] as const){
      await page.goto(route,{waitUntil:'load'});
      await page.locator(selector).first().evaluate(node=>{
        for(let parent=node.parentElement;parent;parent=parent.parentElement)if(parent instanceof HTMLDetailsElement)parent.open=true;
      });
      for(const value of values)await expect(page.locator(selector).filter({hasText:value}).first()).toContainText(value);
      for(const table of await page.locator(selector).all()){
        if(!await table.isVisible())continue;
        expect(await table.locator('..').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(2);
        expect(await table.locator('th,td').evaluateAll(cells=>cells.every(el=>el.scrollWidth<=el.clientWidth+2))).toBe(true);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    }
  });
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('experiment plan table preserves all comparisons inside the article: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/results/four-arm-analysis/',{waitUntil:'load'});
    const table=page.locator('.plan-table');
    for(const id of ['B1','B2','B3','B4','B5','B6','B7','B8'])await expect(table).toContainText(id);
    expect(await table.locator('..').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(2);
    expect(await table.locator('th,td').evaluateAll(cells=>cells.every(el=>el.scrollWidth<=el.clientWidth+2))).toBe(true);
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
    await expect(rank).toContainText('rank95 · median');
    const holder=rank.locator('..');
    const geometry=await holder.evaluate(el=>({scroll:el.scrollWidth-el.clientWidth,width:el.getBoundingClientRect().width,parent:el.parentElement!.clientWidth,overflow:getComputedStyle(el).overflowX}));
    expect(geometry.scroll).toBeLessThanOrEqual(2);
    expect(geometry.width).toBeLessThanOrEqual(geometry.parent+2);
    expect(['hidden','clip']).not.toContain(geometry.overflow);
    const difference=page.locator('.paper-table').filter({hasText:'R1–R159 mean reward'}).locator('tbody tr').first().locator('td').last();
    await expect(difference).toContainText('+0.0250');
    const fragments=await difference.evaluate(el=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),tops=new Set<number>();while(walker.nextNode()){if(!walker.currentNode.textContent?.trim())continue;const r=document.createRange();r.selectNodeContents(walker.currentNode);for(const rect of r.getClientRects())if(rect.width)tops.add(Math.round(rect.top*10)/10);}return tops.size;});
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
      if(id==='q03'){
        // Short A0/A40/A80/A120 identifiers belong in a compact LaTeX column,
        // while longer method names wrap between words within the article.
        const ids=await table.locator('tbody th').allTextContents();
        expect(ids.map(text=>text.trim())).toEqual(['A0','A40','A80','A120']);
        const rows=await table.locator('tbody th').evaluateAll(nodes=>nodes.map(node=>{
          const range=document.createRange();range.selectNodeContents(node);
          return {rectCount:range.getClientRects().length,width:node.getBoundingClientRect().width,wrap:getComputedStyle(node).overflowWrap};
        }));
        expect(rows.every(row=>row.rectCount===1&&row.width>=30&&row.width<=115&&row.wrap==='normal')).toBe(true);
        await label.evaluate(el=>{(el as HTMLElement).style.overflowWrap='anywhere';(el as HTMLElement).style.maxWidth='1ch';});
        const badWrap=await label.evaluate(el=>getComputedStyle(el).overflowWrap);
        expect(()=>expect(badWrap).toBe('normal')).toThrow();
        await label.evaluate(el=>{(el as HTMLElement).style.removeProperty('overflow-wrap');(el as HTMLElement).style.removeProperty('max-width');});
        expect(await label.evaluate(el=>getComputedStyle(el).overflowWrap)).toBe('normal');
        continue;
      }
      const before=await label.boundingBox();
      expect(before!.width).toBeGreaterThan(0);
      const fragments=await label.evaluate(el=>{
        const text=el.firstChild!;
        const value=text.textContent??'',word=value.match(/SFT|A\d+|Bounded/);
        if(!word)throw Error('Missing scientific row identifier');
        const range=document.createRange();range.setStart(text,word.index!);range.setEnd(text,word.index!+word[0].length);
        return range.getClientRects().length;
      });
      expect(fragments).toBe(1);
      await label.evaluate(el=>{(el as HTMLElement).style.fontSize='1px';});
      const index=await table.evaluate(el=>[...document.querySelectorAll('table')].indexOf(el as HTMLTableElement));
      await expect(expectPaperGrammar(table,route,index)).rejects.toThrow();
      await label.evaluate(el=>{for(const property of ['font-size'])(el as HTMLElement).style.removeProperty(property);});
      expect((await label.boundingBox())!.width).toBeGreaterThan(0);
      expect(await table.locator('..').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(2);
    }
  });
}
