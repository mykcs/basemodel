import { test, expect, type Page } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { TECHNICAL_ARTICLE_ROUTES, READING_OVERVIEW_ROUTES } from '../../src/data/technicalArticleRoutes';

const paperRoutes = readdirSync('src/content/papers').filter(file => file.endsWith('.json')).map(file => '/papers/' + file.slice(0,-5) + '/');
const readingRoutes = [...TECHNICAL_ARTICLE_ROUTES, ...READING_OVERVIEW_ROUTES, ...paperRoutes];

async function articleGeometry(page: Page, width: number) {
  return page.locator('#main-content .evo-approved-reader').evaluate((root, viewport) => {
    const h1 = root.querySelector('h1');
    const style = getComputedStyle(root);
    const heading = h1 && getComputedStyle(h1);
    const rect = root.getBoundingClientRect();
    const errors: string[] = [];
    if (!h1) errors.push('missing H1');
    if (parseFloat(style.fontSize) !== 14) errors.push('body must use 14px reading type');
    if (heading && Math.abs(parseFloat(heading.fontSize) - (viewport <= 520 ? 26 : 28)) > .1) errors.push('old display heading escaped the article owner');
    if (rect.width > Math.min(root.classList.contains('evo-reading-overview') ? 960.5 : 750.5, viewport - 23)) errors.push('article measure escaped the reading frame');
    if (document.documentElement.scrollWidth > viewport + 1) errors.push('document overflow');
    for (const node of root.querySelectorAll<HTMLElement>('p,dd,li,span,small')) {
      if (node.children.length || node.closest('details:not([open]),[hidden],[aria-hidden="true"],[data-research-paper-table]')) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || getComputedStyle(node).visibility === 'hidden') continue;
      const text = node.innerText.trim();
      const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
      if (cjk < 12) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const lines = [...range.getClientRects()].filter(line => line.width > .5 && line.height > .5);
      range.detach();
      if (lines.length >= 3 && rect.width < parseFloat(getComputedStyle(node).fontSize) * 7) errors.push('CJK prose column too narrow: ' + node.className + ' ' + text.slice(0,35));
    }
    return errors;
  }, width);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test('all technical articles: ' + width + 'px ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      for (const route of readingRoutes) {
        await test.step(route, async () => {
          const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
          expect(response?.status(), route).toBe(200);
          await expect(page.locator('body')).toHaveAttribute('data-technical-article', 'true');
          await expect(page.locator('#main-content h1')).toHaveCount(1);
          expect(await articleGeometry(page, width), route).toEqual([]);
        });
      }
    });
  }
}

test('article directory has real labels, valid anchors and no competing rail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/capability-exploration/text-memory/');
  const directory = page.locator('[data-article-outline]');
  await expect(directory).toBeVisible();
  await directory.locator('summary').click();
  const links = directory.locator('a');
  expect(await links.count()).toBeGreaterThan(1);
  for (const link of await links.all()) {
    expect((await link.innerText()).trim().length).toBeGreaterThan(1);
    const href = await link.getAttribute('href');
    await expect(page.locator('[id=' + JSON.stringify(decodeURIComponent(href!.slice(1))) + ']')).toHaveCount(1);
  }
  const target = await links.nth(1).getAttribute('href');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await links.nth(1).click();
  await expect.poll(() => page.locator('[id=' + JSON.stringify(decodeURIComponent(target!.slice(1))) + ']').evaluate(node => Math.round(node.getBoundingClientRect().top))).toBe(96);
  await expect(directory.locator('details')).not.toHaveAttribute('open', '');
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  await expect(page.locator('[data-article-outline]')).toBeHidden();
  await expect(page.locator('.advisor-ten-toc')).toHaveCount(1);
});

test('same article gate rejects the old oversized heading', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/study/openevo-methods/');
  expect(await articleGeometry(page, 1440)).toEqual([]);
  const bad = await page.addStyleTag({ content: '.evo-approved-reader h1 {font-size:64px !important;}' });
  expect(await articleGeometry(page, 1440)).toContain('old display heading escaped the article owner');
  await bad.evaluate((node) => node.parentNode?.removeChild(node));
  expect(await articleGeometry(page, 1440)).toEqual([]);
});

test('same prose gate rejects a one-character-wide explanation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/research/seed-openevo/study/capability-exploration/text-memory/');
  expect(await articleGeometry(page, 1440)).toEqual([]);
  const bad = await page.addStyleTag({ content: '.evo-approved-reader .tm-lede {width:20px !important;}' });
  expect((await articleGeometry(page, 1440)).some(error => error.startsWith('CJK prose column too narrow'))).toBe(true);
  await bad.evaluate(node => node.parentNode?.removeChild(node));
  expect(await articleGeometry(page, 1440)).toEqual([]);
});

test('article text and native evidence remain readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/research/seed-openevo/study/parameter-memory-results/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.advisor-ten-toc summary')).toBeVisible();
  expect(await page.locator('table').count()).toBeGreaterThan(1);
  await context.close();
});

for (const width of [390,768,1440]) {
  test('chapter numbers stay on the heading left at '+width+'px', async ({page})=>{
    await page.setViewportSize({width,height:900});
    for (const route of ['/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/','/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/','/research/seed-openevo/study/minimax-teacher/','/research/seed-openevo/study/results/benchmark-first/','/research/seed-openevo/study/capability-exploration/archive/','/research/seed-openevo/flow/','/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/','/research/seed-openevo/study/capability-exploration/sd-lora-history-novelty/']) {
      await page.goto(route);
      const numbers=page.locator('.evo-article__heading-number');
      expect(await numbers.count(),route).toBeGreaterThan(0);
      expect(await headingNumberErrors(page),route).toEqual([]);
    }
  });
}

test('paper evidence and reproduction choices stay in the reading path',async({page})=>{
  await page.goto('/papers/seed/');
  await expect(page.locator('.evo-paper-record > aside')).toBeVisible();
  for(const mode of ['strict','method','modern'])await expect(page.locator('#paper-reproduce a[href*="mode='+mode+'"]')).toBeVisible();
  expect(await page.locator('.evo-paper-record > aside a').count()).toBeGreaterThan(0);
});

async function headingNumberErrors(page:Page){
  return page.locator('.evo-article__heading-number').evaluateAll(nodes=>nodes.flatMap(n=>{
        const h=n.parentElement!;const s=getComputedStyle(n);const hs=getComputedStyle(h);
        const number=n.getBoundingClientRect();const text=document.createRange();text.setStartAfter(n);text.setEnd(h,h.childNodes.length);
        const first=[...text.getClientRects()].find(r=>r.width>2&&r.height>2);
        return /^H[123]$/.test(h.tagName)&&s.display==='inline'&&s.fontSize===hs.fontSize&&first&&number.x<first.x&&Math.abs(number.y-first.y)<4?[]:[h.textContent];
      }));
}

test('number gate rejects the old small digit above its heading',async({page})=>{
  await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
  expect(await headingNumberErrors(page)).toEqual([]);
  const bad=await page.addStyleTag({content:'.evo-article__heading-number {display:block!important;font-size:10px!important;}'});
  expect((await headingNumberErrors(page)).length).toBeGreaterThan(0);
  await bad.evaluate(node=>node.parentNode?.removeChild(node));
  expect(await headingNumberErrors(page)).toEqual([]);
});

test('wide reading entries keep expanded contents in flow without covering the title',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  for(const route of ['/papers/seed/','/research/seed-openevo/study/capability-exploration/','/research/seed-openevo/flow/','/research/seed-openevo/study/results/','/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/']){
    await page.goto(route);
    const nav=page.locator('[data-article-outline]');
    await expect(page.locator('.evo-approved-reader [data-article-outline]')).toHaveCount(1);
    await nav.locator('summary').click();
    expect(await nav.evaluate(el=>getComputedStyle(el).position)).toBe('static');
    const title=await page.locator('#main-content h1').boundingBox();
    const box=await nav.boundingBox();
    expect(box!.y).toBeGreaterThan(title!.y+title!.height);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('moving a chapter number into its heading preserves old generated anchors',async({page})=>{
  await page.goto('/research/seed-openevo/study/results/benchmark-first/');
  const heading=page.locator('.note-body h2').first();
  const label='OpenEvo 已经有第一代内部迁移证据，但这还不是 SEED 官方保留任务结果。';
  const id=label.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu,'-').replace(/^-+|-+$/g,'').slice(0,72);
  await expect(heading).toHaveAttribute('id',id);
  await expect(page.locator('[data-article-outline] a').first()).toHaveAttribute('data-outline-target',id);
});

// Page roles share sources; operational tools do not inherit scientific prose frames.
async function developmentPresentationErrors(page: Page) {
  return page.locator('.development-page').evaluate(root => {
    const errors: string[] = [];
    const frame = root.getBoundingClientRect();
    const shell = document.querySelector('.site-footer .shell')!.getBoundingClientRect();
    if (!root.classList.contains('shell') || root.classList.contains('evo-approved-reader')) errors.push('tool uses article frame');
    if (Math.abs(frame.width - shell.width) > 1) errors.push('tool diverges from canonical shell');
    if (document.querySelectorAll('main').length !== 1) errors.push('competing main landmarks');
    const flow = root.querySelector<HTMLElement>('.development-flow')!;
    const columns = getComputedStyle(flow).gridTemplateColumns.split(' ').length;
    const expected = innerWidth <= 860 ? 1 : innerWidth <= 1080 ? 3 : 6;
    if (columns !== expected) errors.push('steps do not fit their content band');
    for (const card of flow.children) {
      const text = card.querySelector('small')!;
      if (text.getBoundingClientRect().width < 7 * parseFloat(getComputedStyle(text).fontSize)) errors.push('step explanation squeezed');
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) errors.push('document overflow');
    return errors;
  });
}

for (const width of [390,768,861,1024,1440]) for (const theme of ['light','dark'] as const) {
  test(`development uses shared operational shell at ${width}px ${theme}`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(t=>localStorage.setItem('atlas-theme',t),theme);
    await page.goto('/development/');
    await expect(page.locator('body')).not.toHaveAttribute('data-technical-article','true');
    expect(await developmentPresentationErrors(page)).toEqual([]);
    await expect(page.locator('.development-flow li')).toHaveCount(6);
    await expect(page.locator('.development-handbook a[href="/handbook/"]')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
  });
}

for (const width of [861,1440]) test(`same tool role gate rejects a squeezed legacy frame at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/development/');
  expect(await developmentPresentationErrors(page)).toEqual([]);
  const bad=await page.addStyleTag({content:'.development-page {width:620px !important;} .development-flow {grid-template-columns:repeat(6,minmax(0,1fr)) !important;}'});
  const errors=await developmentPresentationErrors(page);
  expect(errors).toContain('tool diverges from canonical shell');
  expect(errors).toContain('step explanation squeezed');
  await bad.evaluate(node=>node.parentNode?.removeChild(node));
  expect(await developmentPresentationErrors(page)).toEqual([]);
});

for(const width of [390,1440])test(`operational development remains usable without JavaScript at ${width}px`,async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width,height:900}});
  const page=await context.newPage();await page.goto('/development/');
  expect(await developmentPresentationErrors(page)).toEqual([]);
  await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.development-flow li')).toHaveCount(6);
  await page.locator('.development-handbook a[href="/handbook/"]').click();
  await expect(page).toHaveURL(/\/handbook\/$/);await expect(page.locator('h1')).toBeVisible();
  await context.close();
});
