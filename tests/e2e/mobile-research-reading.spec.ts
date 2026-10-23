import { expect, test, type Locator, type Page } from '@playwright/test';
import { persistJsonAttachment } from './evidence-json';

const models = ['qwen2-5-3b-instruct', 'qwen2-5-7b-instruct'];
const research = '/research/seed-openevo/study/capability-exploration/';

async function tabTo(page: Page, target: Locator) {
  // Safari on macOS uses Option-Tab for links unless full keyboard access is enabled.
  // https://support.apple.com/guide/safari/cpsh003/mac
  const key = process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
  for (let step = 0; step < 90; step += 1) {
    await page.keyboard.press(key);
    if (await target.evaluate(node => node === document.activeElement)) return;
  }
  throw new Error('The intended control could not be reached in the normal tab order');
}

async function visibleWithoutScrolling(locator: Locator) {
  await expect.poll(() => locator.evaluate(node => {
    const box = node.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    return box.width > 0 && box.height > 0 && box.top >= 0 && box.bottom <= innerHeight && Boolean(hit && node.contains(hit));
  })).toBe(true);
}

async function unobscured(locator: Locator, page: Page) {
  await locator.scrollIntoViewIfNeeded();
  await expect.poll(() => locator.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    return box.width > 0 && box.height > 0 && box.top >= 0 && box.bottom <= innerHeight && Boolean(hit && node.contains(hit));
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

for (const theme of ['light', 'dark']) {
  test(`mobile research journeys preserve task entry and control access ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(({ theme, models }) => {
      localStorage.clear(); localStorage.setItem('atlas-theme', theme);
      localStorage.setItem('atlas-compare', JSON.stringify(models));
    }, { theme, models });
    await page.goto('/workspace/');
    await page.getByRole('link', { name: '开始填写实验条件', exact: true }).click();
    const task = page.locator('.workspace-pane-task');
    await expect(task).toBeVisible();
    await unobscured(task.getByRole('heading', { name: '研究约束', exact: true }), page);
    await task.getByRole('button', { name: /全新实验/ }).click();
    await task.getByRole('button', { name: '下一步', exact: true }).click();
    await task.getByRole('button', { name: '执行者', exact: true }).click();
    await task.locator('.task-step select').selectOption('lora');
    const next = task.getByRole('button', { name: '下一步', exact: true });
    for (const size of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
      await page.setViewportSize(size);
      await unobscured(next, page);
      await next.focus(); await expect(next).toBeFocused();
      await testInfo.attach(`task-next-control-${size.width}`, { body: await page.screenshot(), contentType: 'image/png' });
    }
    await next.click();
    await expect(task.getByLabel('单卡显存（GB）')).toBeVisible();
  });

  for (const route of ['bounded-effective-state-gdr/', 'stage2-256-window/']) {
    test(`mobile table keeps complete labelled scientific rows without horizontal drag ${theme} ${route}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.addInitScript(t => { localStorage.clear(); localStorage.setItem('atlas-theme', t); }, theme);
      await page.goto(research + route);
      const region = route.startsWith('bounded') ? page.locator('[data-paper-table-scroll]').filter({ has: page.locator('.paper-table--ablation') }).first() : page.locator('.legacy-journey__table-wrap');
      await expect(region).toBeVisible();
      await region.scrollIntoViewIfNeeded();
      const table = region.locator('table');
      const check = async () => table.evaluate(node => {
        const rect = node.getBoundingClientRect();
        const cells = [...node.querySelectorAll<HTMLTableCellElement>('tbody th,tbody td')];
        return rect.width <= innerWidth && node.scrollWidth <= node.clientWidth + 1 && cells.every(cell => {
          const box = cell.getBoundingClientRect();
          const labelled = cell.tagName === 'TH' ? cell.scope === 'row' : Boolean(cell.dataset.paperLabel);
          const range = document.createRange(); range.selectNodeContents(cell);
          const text = range.getBoundingClientRect();
          return labelled && box.width > 0 && box.left >= rect.left - 1 && box.right <= rect.right + 1 && text.width > 0 && text.left >= box.left - 1 && text.right <= box.right + 1 && parseFloat(getComputedStyle(cell).fontSize) >= 14;
        });
      });
      const baseline = await table.locator('tbody tr').evaluateAll(rows => rows.map(row => [...row.querySelectorAll('th,td')].map(cell => cell.textContent?.trim())));
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await expect.poll(check).toBe(true);
        expect(await table.locator('tbody tr').evaluateAll(rows => rows.map(row => [...row.querySelectorAll('th,td')].map(cell => cell.textContent?.trim())))).toEqual(baseline);
        if (route.startsWith('bounded') && width >= 768) {
          const bounded = table.getByRole('columnheader', { name: 'Bounded', exact: true });
          expect(await bounded.evaluate(node => {
            const range = document.createRange(); range.selectNodeContents(node);
            return range.getClientRects().length;
          })).toBe(1);
        }
        await table.evaluate(node => window.scrollTo({ top: node.getBoundingClientRect().top + scrollY - 160, behavior: 'instant' }));
        const caption = table.locator('caption');
        await visibleWithoutScrolling(caption);
        await testInfo.attach(`scientific-entry-${width}`, { body: await page.screenshot(), contentType: 'image/png' });
        await testInfo.attach(`scientific-rows-${width}`, { body: await table.screenshot(), contentType: 'image/png' });
      }
      if (route.startsWith('bounded')) {
        await expect(table).toContainText('67.07');
        await expect(table).toContainText('64.33');
        await expect(table).toContainText('54.28');
      } else {
        await expect(table).toContainText('0.0149');
        await expect(table).toContainText('0.00145');
        await expect(table).toContainText('0.2918');
        await expect(table).toContainText('0.0974');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      // An actually oversized native table must fail the same complete-cell predicate.
      const oldStyle = await table.getAttribute('style');
      await table.evaluate(node => node.style.minWidth = '1600px');
      expect(await check()).toBe(false);
      await table.evaluate((node, value) => value === null ? node.removeAttribute('style') : node.setAttribute('style', value), oldStyle);
      await expect.poll(check).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    });
  }

  test(`comparison results are directly reachable without the whole model picker ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(t => { localStorage.clear(); localStorage.setItem('atlas-theme', t); }, theme);
    await page.goto('/compare/?models=' + models.join(','));
    const picker = page.locator('details.comparison-picker');
    await expect(picker).toBeVisible();
    await expect(picker).not.toHaveAttribute('open', '');
    const hardware = page.locator('.comparison-mobile-group').filter({ has: page.getByRole('heading', { name: '硬件', exact: true }) });
    await page.getByRole('link', { name: '硬件', exact: true }).click();
    const lora = hardware.locator('.comparison-mobile-field').filter({ has: page.getByRole('heading', { name: /LoRA 档位/ }) });
    await unobscured(lora, page);
    await expect(lora).toContainText(/Qwen2.5[–-]3B[–-]Instruct/);
    await expect(lora).toContainText('16GB'); await expect(lora).toContainText('24GB');
    await picker.locator('summary').click();
    await expect(page.locator('#compare-search')).toBeVisible();
  });

  test(`empty tray supports keyboard task entry and ordinary two-model selection ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(t => { localStorage.clear(); localStorage.setItem('atlas-theme', t); }, theme);
    await page.goto('/workspace/');
    const entry = page.getByRole('link', { name: '开始填写实验条件', exact: true });
    await tabTo(page, entry);
    await page.keyboard.press('Enter');
    const heading = page.locator('.workspace-pane-task').getByRole('heading', { name: '研究约束', exact: true });
    await expect(heading).toBeFocused();
    await visibleWithoutScrolling(heading);
    await testInfo.attach('keyboard-task-entry', { body: await page.screenshot(), contentType: 'image/png' });
    await page.goto('/compare/');
    const search = page.locator('#compare-search');
    for (const size of ['3B', '7B']) {
      await search.fill(`Qwen2.5-${size}-Instruct`);
      await page.locator('.picker-item').filter({ hasText: `Qwen2.5-${size}-Instruct` }).getByRole('checkbox').check();
    }
    await expect(page.locator('#comparison-results')).toBeVisible();
    const tray = page.locator('[data-compare-tray]');
    await tray.locator('[data-compare-open]').click();
    await page.getByRole('link', { name: '硬件', exact: true }).click();
    const lora = page.locator('.comparison-mobile-field').filter({ has: page.getByRole('heading', { name: /LoRA 档位/ }) });
    for (const [name, value] of [['3B', '16GB'], ['7B', '24GB']] as const) {
      const model = lora.locator('.comparison-mobile-value').filter({ hasText: `Qwen2.5-${name}-Instruct` });
      await expect(model).toContainText(value);
    }
    await unobscured(lora, page);
    await testInfo.attach('selected-model-hardware', { body: await page.screenshot(), contentType: 'image/png' });
    const clear = tray.locator('[data-compare-clear]');
    await expect(clear).toBeVisible();
    await clear.click();
    await expect(tray).toBeHidden();
  });
}

test('timeline prose and model metadata keep separate rendered roles', async ({ page }, testInfo) => {
  await page.goto('/data-status/');
  const note = page.locator('[data-timeline-note]').first();
  await expect(note).toBeAttached();
  const readable = () => note.evaluate(node => {
    const style = getComputedStyle(node);
    return parseFloat(style.fontSize) >= 16 && parseFloat(style.lineHeight) / parseFloat(style.fontSize) >= 1.65;
  });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(readable).toBe(true);
    expect(await page.locator('.model-timeline li strong').evaluateAll(titles => titles.every(title => {
      const note = title.nextElementSibling;
      return note && note.getBoundingClientRect().top >= title.getBoundingClientRect().bottom - 1;
    }))).toBe(true);
  }
  const oldStyle = await note.getAttribute('style');
  try {
    await note.evaluate(node => (node as HTMLElement).style.fontSize = '9px');
    expect(await readable()).toBe(false);
  } finally {
    await note.evaluate((node, value) => value === null ? node.removeAttribute('style') : node.setAttribute('style', value), oldStyle);
  }
  await expect.poll(readable).toBe(true);
  await testInfo.attach('timeline-prose', { body: await page.locator('.model-timeline').screenshot(), contentType: 'image/png' });
});

const scientificTableRoutes = [{"route":"/models/qwen2-5-3b-instruct/","indices":[0]},{"route":"/papers/adaplanner/","indices":[0]},{"route":"/papers/agentbench/","indices":[0]},{"route":"/papers/agentboard/","indices":[0]},{"route":"/papers/agentverse/","indices":[0]},{"route":"/papers/appworld/","indices":[0]},{"route":"/papers/camel/","indices":[0]},{"route":"/papers/chameleon/","indices":[0]},{"route":"/papers/critic/","indices":[0]},{"route":"/papers/dspy/","indices":[0]},{"route":"/papers/expel/","indices":[0]},{"route":"/papers/generative-agents/","indices":[0]},{"route":"/papers/metagpt/","indices":[0]},{"route":"/papers/openhands/","indices":[0]},{"route":"/papers/osworld/","indices":[0]},{"route":"/papers/reflexion/","indices":[0]},{"route":"/papers/seed/","indices":[0,1,2]},{"route":"/papers/self-refine/","indices":[0]},{"route":"/papers/swe-agent/","indices":[0]},{"route":"/papers/swe-bench/","indices":[0]},{"route":"/papers/voyager/","indices":[0]},{"route":"/papers/webarena/","indices":[0]},{"route":"/research/seed-openevo/flow/alfworld/","indices":[0]},{"route":"/research/seed-openevo/flow/benchmarks/","indices":[0]},{"route":"/research/seed-openevo/flow/","indices":[0]},{"route":"/research/seed-openevo/flow/loops/","indices":[0]},{"route":"/research/seed-openevo/flow/openevo/","indices":[0]},{"route":"/research/seed-openevo/flow/sd-lora/","indices":[0]},{"route":"/research/seed-openevo/flow/webshop/","indices":[0,1,2]},{"route":"/research/seed-openevo/study/briefing/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/","indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]},{"route":"/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/gdr-directapply/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/mechanism-1-0/","indices":[0,1]},{"route":"/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/","indices":[0,1]},{"route":"/research/seed-openevo/study/capability-exploration/openevo-2-0/report/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/","indices":[0,1,2,3]},{"route":"/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/","indices":[0,1]},{"route":"/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/","indices":[0,1]},{"route":"/research/seed-openevo/study/capability-exploration/sd-lora-history/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/sd-lora-scaling/","indices":[0,1]},{"route":"/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/stage2-256-window/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/stage2-ceiling/","indices":[0]},{"route":"/research/seed-openevo/study/capability-exploration/text-memory/","indices":[0,1,2]},{"route":"/research/seed-openevo/study/minimax-teacher/","indices":[0]},{"route":"/research/seed-openevo/study/parameter-memory-results/","indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]},{"route":"/research/seed-openevo/study/results/3b-minimax-analysis/","indices":[0]},{"route":"/research/seed-openevo/study/results/3b-self-analysis/","indices":[0]},{"route":"/research/seed-openevo/study/results/7b-minimax-analysis/","indices":[0]},{"route":"/research/seed-openevo/study/results/7b-self-analysis/","indices":[0,1]},{"route":"/research/seed-openevo/study/results/four-arm-analysis/","indices":[0,1,2,3]},{"route":"/research/seed-openevo/study/results/","indices":[0,1,2,3,4,5,6]},{"route":"/research/seed-openevo/study/results/openevo-benchmark-design/","indices":[0]},{"route":"/research/seed-openevo/study/results/seed-faithful-benchmark/","indices":[0]}];

for (const theme of ['light', 'dark']) {
  test(`scientific table families retain complete readable cells at four widths ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    await page.addInitScript(t => { localStorage.clear(); localStorage.setItem('atlas-theme', t); }, theme);
    const evidence = [];
    for (const { route, indices } of scientificTableRoutes) {
      await page.goto(route);
      if(await page.locator('[data-shopping-scene]').count()){
        const next=page.locator('[data-example-next]');await expect(next).toHaveCount(1);await expect(next).toBeVisible();await next.click();
        await expect(page.locator('[data-shopping-frame="1"]')).toBeVisible();
      }
      const tables=page.locator('table');
      const original=await tables.evaluateAll(tables=>tables.map(table=>[...table.querySelectorAll('th,td')].map(cell=>cell.textContent?.trim())));
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:1000});
        const measured=[];
        for(const index of indices){
          const table=tables.nth(index);await expect(table,`${route} table ${index} exists`).toBeAttached();
          // Native details with the same name form an exclusive accordion:
          // reach EACH table through its own actual disclosure, in source order.
          const disclosures=table.locator('xpath=ancestor::details');
          for(let i=0;i<await disclosures.count();i++){
            const disclosure=disclosures.nth(i);
            if(!await disclosure.evaluate(node=>(node as HTMLDetailsElement).open)){
              await disclosure.locator(':scope > summary').focus();await page.keyboard.press('Enter');
              await expect(disclosure).toHaveJSProperty('open',true);
            }
          }
          const item=await table.evaluate(table=>{
            const rect=table.getBoundingClientRect(),parent=table.parentElement!;
            const visible=rect.width>0&&rect.height>0&&table.checkVisibility({checkVisibilityCSS:true});
            const badCells=[...table.querySelectorAll('th,td')].flatMap(cell=>{
              const box=cell.getBoundingClientRect(),head=cell.closest('thead');
              if(head&&getComputedStyle(head).clipPath!=='none')return [];
              if(!box.width||!cell.checkVisibility({checkVisibilityCSS:true}))return cell.textContent?.trim()?['hidden scientific cell: '+cell.textContent.trim()]:[];
              const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);let node;
              while((node=walker.nextNode())){
                if(!node.textContent?.trim())continue;let hidden=false;
                for(let p=node.parentElement;p&&p!==cell;p=p.parentElement){const style=getComputedStyle(p);if(style.position==='absolute'&&(style.getPropertyValue('clip')!=='auto'||style.clipPath!=='none'))hidden=true;}
                if(hidden)continue;
                const textOwner=node.parentElement!;
                // Fixed16:9 briefing media has its own full-size/text-reader gate.
                // The article-table15px role must not rewrite that accepted medium.
                if(!table.closest('[data-testid="progress-briefing"] .briefing-slide')&&!textOwner.closest('code,pre,kbd,math,.katex,svg,sup,sub')){
                  const pixels=parseFloat(getComputedStyle(textOwner).fontSize);
                  const floor=textOwner.closest('.evidence-refs')?13:15;
                  if(!textOwner.closest('[aria-hidden="true"]')&&pixels<floor-.1)return [`scientific cell text below role floor${floor}px (${pixels}): ${node.textContent?.trim()}`];
                }
                const range=document.createRange();range.selectNodeContents(node);
                if([...range.getClientRects()].some(text=>text.width&&(text.left<box.left-1||text.right>box.right+1)))return [cell.textContent?.trim()];
              }
              return [];
            });
            return {visible,dormantCompactSeedCatalog:!!table.closest('.seed-reproduction.compact .catalog-wrap'),width:rect.width,available:parent.clientWidth,overflow:table.scrollWidth-table.clientWidth,badCells};
          });
          // The only importer of this legacy producer sets compact. Its two
          // old price catalogs are intentionally dormant at every width.
          if(route==='/papers/seed/'&&[0,1].includes(index)){
            expect(item.dormantCompactSeedCatalog).toBe(true);expect(item.visible).toBe(false);
            measured.push({index,expectedState:'dormant compact catalog; SeedReproductionPath.astro owner',...item});continue;
          }
          expect(item.dormantCompactSeedCatalog).toBe(false);await expect(table).toBeVisible();
          expect(item.visible,`${route} table ${index} is actually displayed in its reading state`).toBe(true);
          expect(item.width,`${route} table ${index} viewport width ${width}`).toBeLessThanOrEqual(width);
          expect(item.width,`${route} table ${index} article width ${width}`).toBeLessThanOrEqual(item.available+1);
          expect(item.overflow,`${route} table ${index} internal overflow`).toBeLessThanOrEqual(1);
          expect(item.badCells,`${route} table ${index} complete visible cell text`).toEqual([]);
          measured.push({index,expectedState:'visible; own ancestor disclosures open',...item});
        }
        expect(await tables.evaluateAll(tables=>tables.map(table=>[...table.querySelectorAll('th,td')].map(cell=>cell.textContent?.trim())))).toEqual(original);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),`${route} page at ${width}`).toBeLessThanOrEqual(1);
        evidence.push({route,width,theme,tables:measured});
      }
    }
    await persistJsonAttachment(testInfo,'scientific-table-family-measurements.json',{body:Buffer.from(JSON.stringify(evidence)),contentType:'application/json'});
  });
}

for (const theme of ['light', 'dark']) {
  test(`preregistered thresholds retain visible metric identities on phones and tablets ${theme}`, async ({ page }, testInfo) => {
    await page.addInitScript(t => { localStorage.clear(); localStorage.setItem('atlas-theme', t); }, theme);
    await page.goto(research + 'q17-directapply-analysis/');
    const table = page.locator('.q17-analysis table').first();
    const labelled = () => table.evaluate(node => {
      const headings = [...node.querySelectorAll('thead th')].map(cell => cell.textContent?.trim());
      return [...node.querySelectorAll<HTMLTableCellElement>('tfoot td')].every((cell, i) => cell.dataset.paperLabel === headings[i + 1] && getComputedStyle(cell, '::before').content.replace(/^"|"$/g, '') === headings[i + 1]);
    });
    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect.poll(labelled).toBe(true);
      const footer = table.locator('tfoot');
      await footer.scrollIntoViewIfNeeded();
      await testInfo.attach(`threshold-identities-${width}`, { body: await footer.screenshot(), contentType: 'image/png' });
    }
    const value = table.locator('tfoot td').first();
    const label = await value.getAttribute('data-paper-label');
    await value.evaluate(node => node.removeAttribute('data-paper-label'));
    expect(await labelled()).toBe(false);
    await value.evaluate((node, text) => node.setAttribute('data-paper-label', text!), label);
    await expect.poll(labelled).toBe(true);
    await expect(table.locator('tfoot')).toContainText('≤ 1e-4');
    await expect(table.locator('tfoot')).toContainText('≤ 0.05');
  });
}

for(const width of [390,760,761,820,821,1440])for(const theme of ['light','dark'] as const){
  test(`Q17 adjacent-state table preserves native headers and complete fields across retired breakpoint ${width} ${theme}`,async({page},info)=>{
    await page.setViewportSize({width,height:900});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/',{waitUntil:'domcontentloaded'});
    const table=page.locator('.table-wrap table[data-research-paper-table]');
    const measure=()=>table.evaluate(table=>{
      const headers=[...table.querySelectorAll<HTMLElement>('thead th')].map(cell=>({text:cell.textContent?.replace(/\s+/g,' ').trim()??'',size:parseFloat(getComputedStyle(cell).fontSize)}));
      const records=matchMedia('(max-width:760px)').matches;
      const cells=[...table.querySelectorAll<HTMLTableCellElement>('tbody td')].map(cell=>({expected:headers[cell.cellIndex]?.text??'',label:cell.dataset.paperLabel??'',paintedLabel:getComputedStyle(cell,'::before').content.replace(/^['"]|['"]$/g,''),labelSize:parseFloat(getComputedStyle(cell,'::before').fontSize),valueSize:parseFloat(getComputedStyle(cell).fontSize),overflow:cell.scrollWidth-cell.clientWidth}));
      return {records,headers,cells,role:table.getAttribute('role'),rootOverflow:document.documentElement.scrollWidth-innerWidth,width:table.getBoundingClientRect().width,holder:table.parentElement!.clientWidth};
    });
    const accept=(m:Awaited<ReturnType<typeof measure>>)=>{
      expect(m.role).toBe('table');expect(m.rootOverflow).toBeLessThanOrEqual(2);expect(m.width).toBeLessThanOrEqual(m.holder+2);
      expect(m.headers.map(h=>h.text)).toEqual(['看什么','进入第 127 轮（R127）','进入第 128 轮（R128）','相差','怎么理解']);
      for(const h of m.headers)expect(h.size).toBeGreaterThanOrEqual(15);
      expect(m.cells.length).toBeGreaterThan(0);
      for(const c of m.cells){expect(c.label).toBe(c.expected);expect(c.valueSize).toBeGreaterThanOrEqual(15);expect(c.overflow).toBeLessThanOrEqual(2);if(m.records){expect(c.paintedLabel).toBe(c.expected);expect(c.labelSize).toBeGreaterThanOrEqual(15);}}
    };
    accept(await measure());
    const first=table.locator('tbody td').first(),saved=await first.getAttribute('data-paper-label');
    await first.evaluate(cell=>cell.setAttribute('data-paper-label','错误字段'));
    const wrong=await measure();expect(()=>accept(wrong)).toThrow();
    await first.evaluate((cell,label)=>cell.setAttribute('data-paper-label',label!),saved);accept(await measure());
    const header=table.locator('thead th').nth(1),savedHeader=await header.textContent();await header.evaluate(cell=>cell.textContent='错误原生表头');const badHeader=await measure();expect(()=>accept(badHeader)).toThrow();await header.evaluate((cell,text)=>cell.textContent=text,savedHeader);accept(await measure());
    const injected=await page.addStyleTag({content:width<=760?'.table-wrap td::before{font-size:9px!important}':'.table-wrap thead th{font-size:9px!important}'});
    const tiny=await measure();expect(()=>accept(tiny)).toThrow();
    await injected.evaluate(node=>node.parentNode?.removeChild(node));accept(await measure());
    await table.screenshot({path:info.outputPath('adjacent-state-complete-table.png'),animations:'disabled'});
    await persistJsonAttachment(info,'adjacent-state-complete-table.json',{body:Buffer.from(JSON.stringify(await measure())),contentType:'application/json'});
  });
}
