import { test, expect, type Page } from '@playwright/test';
import { TECHNICAL_ARTICLE_ROUTES } from '../../src/data/technicalArticleRoutes';

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
    if (rect.width > Math.min(750.5, viewport - 23)) errors.push('article measure escaped the reading frame');
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
      for (const route of TECHNICAL_ARTICLE_ROUTES) {
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
