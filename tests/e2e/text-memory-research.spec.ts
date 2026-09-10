import { expect, test } from '@playwright/test';

const entries = [
  { locale: 'zh', prefix: '', keyword: '短笔记' },
  { locale: 'en', prefix: '/en', keyword: 'concise notes' },
] as const;

for (const entry of entries) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${entry.locale} Text Memory ${theme}: routes, unknowns and fixed-slide bounds`, async ({ page }, testInfo) => {
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const viewport of [{width:1440,height:1000}, {width:768,height:1024}, {width:390,height:844}]) {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: theme });
        const path = `${entry.prefix}/research/seed-openevo/study/capability-exploration/text-memory/`;
        const response = await page.goto(path, { waitUntil: 'networkidle' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('main h1')).toContainText(entry.keyword);
        await expect(page.locator('[data-testid="text-memory-plan"]')).toBeVisible();
        await expect(page.locator('.research-placeholder')).toHaveCount(4);
        for (const box of await page.locator('.research-placeholder').all()) await expect(box).toContainText(entry.locale === 'zh' ? '待填' : 'TBD');
        const width = await page.evaluate(() => ({page:document.documentElement.scrollWidth,viewport:innerWidth}));
        expect(width.page).toBeLessThanOrEqual(width.viewport + 2);
        await expect(page.locator('a[href*="Q17_TEXT_MEMORY_REDESIGN_PLAN_2026-09-11.md"]')).toHaveCount(1);
        const themeClass = await page.evaluate(() => document.documentElement.dataset.theme ?? document.documentElement.className);
        expect(themeClass).toBe(theme);
        await page.screenshot({path:testInfo.outputPath(`${entry.locale}-${theme}-${viewport.width}-page.png`),fullPage:true});
        const slideResponse = await page.goto(`${entry.prefix}/research/seed-openevo/study/briefing/#text-memory-redesign`, {waitUntil:'networkidle'});
        expect(slideResponse?.status()).toBe(200);
        await expect(page.locator('.briefing-slide')).toHaveCount(24);
        const slide = page.locator('#text-memory-redesign');
        await expect(slide).toHaveCount(1);
        await expect(slide.locator('[data-placeholder]')).toHaveCount(3);
        await slide.scrollIntoViewIfNeeded();
        const bounds = await slide.evaluate(el => {
          const box=el.getBoundingClientRect();
          const outside=[...el.querySelectorAll('h2,p,article,span,a,strong')].filter(node=>{
            const b=node.getBoundingClientRect();
            return b.width > 0 && b.height > 0 && (b.left < box.left-2 || b.right > box.right+2 || b.top < box.top-2 || b.bottom > box.bottom+2);
          }).map(node=>node.textContent?.slice(0,80));
          return {ratio:box.height/box.width,outside,page:document.documentElement.scrollWidth,viewport:innerWidth};
        });
        expect(bounds.ratio).toBeCloseTo(9/16,3);
        expect(bounds.outside).toEqual([]);
        expect(bounds.page).toBeLessThanOrEqual(bounds.viewport+2);
        await slide.screenshot({path:testInfo.outputPath(`${entry.locale}-${theme}-${viewport.width}-slide.png`)});
        await testInfo.attach(`theme-${entry.locale}-${theme}-${viewport.width}`, {body:JSON.stringify({requested:theme,observedClass:themeClass}),contentType:'application/json'});
      }
      expect(errors).toEqual([]);
    });
  }
}

test('Text Memory is discoverable from the existing bilingual study entry', async ({ page }) => {
  for (const prefix of ['', '/en']) {
    await page.goto(`${prefix}/research/seed-openevo/study/`, {waitUntil:'networkidle'});
    const link=page.locator(`a[href="${prefix}/research/seed-openevo/study/capability-exploration/text-memory/"]`).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.locator('[data-testid="text-memory-plan"]')).toBeVisible();
  }
});
