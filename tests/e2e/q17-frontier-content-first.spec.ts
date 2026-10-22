import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/';

test('focus result keeps the comparable result and scientific boundary in the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 633 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('OpenEVO 的 WebShop 同题复测：暂时不能证明第 128 轮模型状态整体变差');
  await expect(page.locator('.result-hero > .eyebrow')).toContainText('局部诊断 · 2026 年 9 月 11 日');
  await expect(page.locator('.result-hero__numbers')).toContainText('63.58 → 59.41');
  await expect(page.locator('.result-hero__numbers')).toContainText('10 / 32 → 8 / 32');
  await expect(page.locator('.result-hero__numbers')).not.toContainText('−17.13 ～ +8.00');
  await expect(page.locator('.result-hero__boundary')).toContainText('平均分少 4.18');
  await expect(page.locator('.result-hero__boundary')).toContainText('−17.13 ～ +8.00');
  await expect(page.locator('.diagnostic-summary')).toContainText('购物动作没有执行错误');
  await expect(page.locator('.diagnostic-summary')).toContainText('R128 的选择概率分布更集中');
  await expect(page.locator('.same-task-facts')).toHaveCount(0);
  const boundary = await page.locator('.result-hero__boundary').boundingBox();
  expect(boundary).not.toBeNull();
  expect(boundary!.y + boundary!.height).toBeLessThanOrEqual(633 + 3);
  const heroNumbers = await page.locator('.result-hero__numbers').boundingBox();
  expect(heroNumbers).not.toBeNull();
  expect(heroNumbers!.y + heroNumbers!.height).toBeLessThanOrEqual(633 + 3);
});

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme}: comparison stays readable without page overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('.table-wrap')).toBeVisible();
      await expect(page.locator('.table-wrap table tbody tr')).toHaveCount(6);
      if (viewport.width === 390) {
        const tableGeometry = await page.locator('.table-wrap').evaluate((node) => ({
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
        }));
        expect(tableGeometry.scrollWidth).toBeLessThanOrEqual(tableGeometry.clientWidth + 2);
        const readingWindow = page.locator('[data-paper-table-scroll]');
        await expect(readingWindow).toHaveCSS('overflow-x', 'auto');
        await expect(page.locator('.table-wrap table')).toHaveCSS('display', 'table');
        await readingWindow.evaluate(node => { const cell = node.querySelector('tbody td:nth-child(3)')!; (node as HTMLElement).scrollLeft = (cell as HTMLElement).offsetLeft; });
        const r128Cells = await page.locator('.table-wrap tbody tr td:nth-child(3)').evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        }));
        for (const cell of r128Cells) {
          expect(cell.left).toBeGreaterThanOrEqual(0);
          expect(cell.right).toBeLessThanOrEqual(viewport.width + 1);
        }
      }
      await expect(page.locator('.evidence-links')).toContainText('数字摘要');
      await page.locator('.table-wrap').focus();
      await expect(page.locator('.table-wrap')).toBeFocused();
    });
  }
}

for(const width of [390,768,1440])for(const theme of ['light','dark'] as const){
  test('same-task comparison values stay inside their labeled cells: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto(route,{waitUntil:'load'});
    const table=page.locator('.table-wrap table');
    const measure=()=>table.locator('tbody td:nth-child(2),tbody td:nth-child(3),tbody td:nth-child(4)').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      const cell=node.getBoundingClientRect();
      return {text:node.textContent,left:cell.left,right:cell.right,lines:[...range.getClientRects()].map(r=>({left:r.left,right:r.right}))};
    }));
    const accept=(rows:Awaited<ReturnType<typeof measure>>)=>rows.forEach(row=>{
      expect(row.lines.length).toBeGreaterThan(0);
      for(const line of row.lines){expect(line.left).toBeGreaterThanOrEqual(row.left-1);expect(line.right,row.text??'').toBeLessThanOrEqual(row.right+1);}
    });
    accept(await measure());
    for(const value of ['10 / 32 (31.25%)','8 / 32 (25.00%)','27 / 32 (84.38%)','25 / 32 (78.13%)'])await expect(table).toContainText(value);
    if(width===390){
      await table.locator('tbody tr').evaluateAll(nodes=>nodes.forEach(node=>{(node as HTMLElement).style.display='grid';(node as HTMLElement).style.gridTemplateColumns='repeat(3,minmax(0,1fr))';}));
      await table.locator('tbody td').evaluateAll(nodes=>nodes.forEach(node=>{(node as HTMLElement).style.whiteSpace='nowrap';}));
      const old=await measure();expect(()=>accept(old)).toThrow();
      await table.locator('tbody tr').evaluateAll(nodes=>nodes.forEach(node=>{(node as HTMLElement).style.removeProperty('display');(node as HTMLElement).style.removeProperty('grid-template-columns');}));
      await table.locator('tbody td').evaluateAll(nodes=>nodes.forEach(node=>{(node as HTMLElement).style.removeProperty('white-space');}));
      accept(await measure());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}
