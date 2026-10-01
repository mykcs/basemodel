import { expect, test } from '@playwright/test';

const cases = [
  { locale: 'zh', route: '/research/seed-openevo/study/briefing/' },
] as const;

for (const entry of cases) {
  test(`${entry.locale} briefing reads as a responsive research document`, async ({ page }, testInfo) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.goto(entry.route, { waitUntil: 'domcontentloaded' });
      await page.evaluate((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.reload({ waitUntil: 'domcontentloaded' });
      for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      const response = await page.goto(entry.route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('.briefing-slide')).toHaveCount(24);

      await expect(page.locator('#briefing-top')).toContainText(entry.locale === 'zh' ? '学习信号与状态容量' : 'learning signals and state capacity');
      await expect(page.locator('[data-briefing-current-answers] .current-answer')).toHaveCount(2);
      const geometry = await page.evaluate(() => {
        const slide = document.querySelector<HTMLElement>('#briefing-top');
        const inner = slide?.querySelector<HTMLElement>('.slide-inner');
        const slideBox = slide?.getBoundingClientRect();
        const innerBox = inner?.getBoundingClientRect();
        const current = document.querySelector<HTMLElement>('[data-briefing-current-answers]');
        const currentBox = current?.getBoundingClientRect();
        return {
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          slideWidth: slideBox?.width ?? 0,
          contentInsideSlide: Boolean(slideBox && innerBox && currentBox
            && innerBox.left >= slideBox.left - 1 && innerBox.right <= slideBox.right + 1
            && currentBox.left >= slideBox.left && currentBox.right <= slideBox.right
            && currentBox.bottom <= innerBox.bottom + 1),
          naturalHeight: slideBox?.height ?? 0,
          currentWidth: currentBox?.width ?? 0,
          currentBottom: currentBox?.bottom ?? 0,
          innerScrollHeight: inner?.scrollHeight ?? 0,
          overflowingContent: [...document.querySelectorAll<HTMLElement>('.briefing-slide p,.briefing-slide h1,.briefing-slide h2,.briefing-slide h3,.briefing-slide a')]
            .filter((element) => !element.closest('.paper-table-wrap'))
            .filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && (box.left < -1 || box.right > window.innerWidth + 1); })
            .map((element) => element.textContent?.trim().slice(0, 90)),
        };
      });

      expect(geometry.pageWidth).toBeLessThanOrEqual(geometry.viewportWidth + 2);
      expect(geometry.contentInsideSlide).toBe(true);
      expect(geometry.naturalHeight).toBeGreaterThan(0);
      expect(geometry.innerScrollHeight).toBeLessThanOrEqual(geometry.naturalHeight + 2);
      expect(geometry.currentWidth).toBeGreaterThan(0);
      expect(geometry.currentBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
      expect(geometry.overflowingContent).toEqual([]);
      if (viewport.width === 390) await expect(page.locator('[data-briefing-current-answers]')).toHaveCSS('grid-template-columns', /\b\d+(?:\.\d+)?px\b/);
      await page.screenshot({ path: testInfo.outputPath(`${entry.locale}-${theme}-${viewport.width}-briefing.png`) });
      }
    }
    await page.evaluate(() => { window.location.hash = 'next'; });
    await expect(page).toHaveURL(/#next$/);
    await expect(page.locator('#next')).toHaveCount(1);
    await expect(page.locator('#next h2')).toBeVisible();
    await expect(page).toHaveURL(/#next$/);
  });
}

test('historical equation sections reflow at 320px and 200% text enlargement', async ({ page }) => {
  for (const scenario of [{ width: 320, enlarge: false }, { width: 390, enlarge: true }]) {
    await page.setViewportSize({ width: scenario.width, height: 844 });
    await page.goto('/research/seed-openevo/study/briefing/', { waitUntil: 'domcontentloaded' });
    if (scenario.enlarge) await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const layout = await page.evaluate(() => {
      const selectors = ['#mechanism', '#m1a-identifiability'];
      return {
        viewport: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        sections: selectors.map((selector) => {
          const section = document.querySelector<HTMLElement>(selector);
          return { selector, clientWidth: section?.clientWidth ?? 0, scrollWidth: section?.scrollWidth ?? 0 };
        }),
        formulaRegions: [...document.querySelectorAll<HTMLElement>('.taskvector-equation__math, .m1a-result strong')].map((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          tabIndex: element.tabIndex,
          right: element.getBoundingClientRect().right,
        })),
      };
    });
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport + 2);
    for (const section of layout.sections) {
      expect(section.scrollWidth, `${section.selector} stays within its own section`).toBeLessThanOrEqual(section.clientWidth + 2);
    }
    for (const region of layout.formulaRegions) {
      expect(region.right).toBeLessThanOrEqual(layout.viewport + 1);
      expect(region.tabIndex).toBe(0);
    }
  }
});
