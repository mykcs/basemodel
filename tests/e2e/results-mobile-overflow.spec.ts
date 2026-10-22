import { expect, test } from '@playwright/test';

const resultsRoutes = [
  '/research/seed-openevo/study/results/',
] as const;

const themes = ['light', 'dark'] as const;

for (const path of resultsRoutes) {
  test(`${path} stays within the 390px viewport without masking overflow`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
    await page.setViewportSize({ width: 390, height: 844 });

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), `${path}: Results route must render`).toBe(200);

    for (const theme of themes) {
      await page.evaluate((nextTheme) => {
        document.documentElement.dataset.theme = nextTheme;
      }, theme);
      await page.evaluate(() => new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }));

      const snapshot = await page.evaluate(() => {
        const root = document.documentElement;
        const bodyStyle = getComputedStyle(document.body);
        const rootStyle = getComputedStyle(root);
        const badges = [...document.querySelectorAll<HTMLElement>(
          "[data-testid='openevo-webshop-result-index'] .status-badge",
        )].map((badge) => {
          const rect = badge.getBoundingClientRect();
          return { left: rect.left, right: rect.right, width: rect.width };
        });

        return {
          rootScrollWidth: root.scrollWidth,
          rootClientWidth: root.clientWidth,
          bodyOverflowX: bodyStyle.overflowX,
          rootOverflowX: rootStyle.overflowX,
          badges,
        };
      });

      const context = `${path} / mobile-${theme}`;
      expect(snapshot.bodyOverflowX, `${context}: body must not hide overflow`).not.toBe('hidden');
      expect(snapshot.bodyOverflowX, `${context}: body must not clip overflow`).not.toBe('clip');
      expect(snapshot.rootOverflowX, `${context}: html must not hide overflow`).not.toBe('hidden');
      expect(snapshot.rootOverflowX, `${context}: html must not clip overflow`).not.toBe('clip');
      expect(
        snapshot.rootScrollWidth,
        `${context}: document horizontal overflow (${snapshot.rootScrollWidth}px > ${snapshot.rootClientWidth}px)`,
      ).toBeLessThanOrEqual(snapshot.rootClientWidth + 2);

      expect(snapshot.badges.length, `${context}: expected Results status badges`).toBeGreaterThan(0);
      for (const badge of snapshot.badges) {
        expect(badge.left, `${context}: badge must stay inside the left viewport edge`).toBeGreaterThanOrEqual(-2);
        expect(badge.right, `${context}: badge must stay inside the right viewport edge`).toBeLessThanOrEqual(snapshot.rootClientWidth + 2);
        expect(badge.width, `${context}: badge must remain shrinkable`).toBeLessThanOrEqual(snapshot.rootClientWidth + 2);
      }
    }
  });
}

// Exercise the shared paper-table owner against real short, dense and carrier tables.
for (const width of [320, 390, 768, 1440]) {
  test(`research tables fit the article at ${width}px without clipping or local scrolling`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
    await page.evaluate(() => document.fonts.ready);
    for (const theme of themes) {
      await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
      const tables = await page.locator('[data-research-paper-table]').evaluateAll(elements => elements.map(table => {
        const wrap = table.parentElement!;
        const bounds = table.getBoundingClientRect();
        return {
          caption: table.querySelector('caption')?.textContent,
          width: bounds.width,
          available: wrap.parentElement!.clientWidth,
          cols: table.querySelector('thead tr')?.children.length ?? 0,
          centerDelta: Math.abs((bounds.left+bounds.right)/2 - (()=>{ const p=wrap.parentElement!.getBoundingClientRect(); return (p.left+p.right)/2; })()),
          scroll: wrap.scrollWidth - wrap.clientWidth,
          overflow: getComputedStyle(wrap).overflowX,
          cellOverflow: Math.max(...Array.from(table.querySelectorAll('th,td')).map(cell => cell.scrollWidth - cell.clientWidth)),
          fontSize: parseFloat(getComputedStyle(table).fontSize),
        };
      }));
      expect(tables.length).toBeGreaterThan(5);
      expect(tables.some(table => table.caption?.includes('参数状态与非参数状态'))).toBe(true);
      for (const table of tables) {
        expect(table.width, `${theme}: ${table.caption}`).toBeLessThanOrEqual(table.available + 2);
        expect(table.scroll, `${theme}: ${table.caption}`).toBeLessThanOrEqual(2);
        expect(table.cellOverflow, `${theme}: ${table.caption}`).toBeLessThanOrEqual(2);
        expect(['hidden', 'clip']).not.toContain(table.overflow);
        expect(table.fontSize).toBeGreaterThanOrEqual(12);
      }
      const shortTables=tables.filter(table => table.cols>0 && table.cols<=3 && table.width < table.available*.85 && table.width>0);
      for(const table of shortTables){
        expect(table.centerDelta, 'short paper table should be centered: '+table.caption).toBeLessThanOrEqual(3);
        if(width<=390)expect(table.fontSize,'short paper table should not inherit dense-matrix microtype').toBeGreaterThanOrEqual(14);
      }
      if (width === 1440) expect(shortTables.length).toBeGreaterThan(0);
    }
  });
}


/** Regress older native evidence tables as well as ResearchPaperTable. */
for(const width of [320,390,768,1440]){
  test('native WebShop and model evidence tables require no horizontal drag at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    for(const theme of themes){
      await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
      for(const [route,selector,expected] of [
        ['/research/seed-openevo/flow/webshop/','.setting-table-wrap table, .webshop-seed-data-usage .table-wrap table',2],
        ['/models/qwen2-5-3b-instruct/','.experiment-table-wrap .experiment-table',1],
      ] as const){
        const response=await page.goto(route,{waitUntil:'domcontentloaded'});
        expect(response?.status(),route).toBe(200);
        await page.evaluate(async value=>{document.documentElement.dataset.theme=value;await document.fonts.ready;},theme);
        const tables=page.locator(selector);
        await expect(tables,route).toHaveCount(expected);
        const layout=await tables.evaluateAll(nodes=>nodes.map(table=>{
          const wrap=table.parentElement!;
          const box=table.getBoundingClientRect();
          const cells=[...table.querySelectorAll('th,td')];
          return {
            width:box.width,
            parentWidth:wrap.getBoundingClientRect().width,
            localScroll:wrap.scrollWidth-wrap.clientWidth,
            cellOverflow:Math.max(0,...cells.map(cell=>cell.scrollWidth-cell.clientWidth)),
            minFont:Math.min(...cells.map(cell=>parseFloat(getComputedStyle(cell).fontSize))),
            rowCount:table.querySelectorAll('tbody tr').length,
            columns:table.querySelectorAll('thead th').length,
          };
        }));
        for(const table of layout){
          expect(table.columns,route).toBeGreaterThanOrEqual(3);
          expect(table.rowCount,route).toBeGreaterThanOrEqual(3);
          expect(table.width,route).toBeLessThanOrEqual(table.parentWidth+2);
          expect(table.localScroll,route).toBeLessThanOrEqual(2);
          expect(table.cellOverflow,route).toBeLessThanOrEqual(2);
          expect(table.minFont,route).toBeGreaterThanOrEqual(12);
        }
      }
    }
  });
}
