import { expect, test } from '@playwright/test';

const cases = [
  { locale: 'zh', route: '/research/seed-openevo/study/briefing/' },
  { locale: 'en', route: '/en/research/seed-openevo/study/briefing/' },
] as const;

for (const entry of cases) {
  test(`${entry.locale} briefing keeps fixed-slide geometry on desktop and phone`, async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      const response = await page.goto(entry.route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('.briefing-slide')).toHaveCount(22);

      const geometry = await page.evaluate(() => {
        const slide = document.querySelector<HTMLElement>('.briefing-slide');
        const inner = slide?.querySelector<HTMLElement>('.slide-inner');
        const slideBox = slide?.getBoundingClientRect();
        const innerBox = inner?.getBoundingClientRect();
        return {
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          slideWidth: slideBox?.width ?? 0,
          slideHeight: slideBox?.height ?? 0,
          innerInsideSlide: Boolean(slideBox && innerBox
            && innerBox.left >= slideBox.left - 1 && innerBox.right <= slideBox.right + 1
            && innerBox.top >= slideBox.top - 1 && innerBox.bottom <= slideBox.bottom + 1),
        };
      });

      expect(geometry.pageWidth).toBeLessThanOrEqual(geometry.viewportWidth + 2);
      expect(geometry.innerInsideSlide).toBe(true);
      expect(geometry.slideHeight / geometry.slideWidth).toBeCloseTo(9 / 16, 3);
      if (viewport.width === 390) expect(geometry.slideWidth).toBeCloseTo(390, 0);
      else expect(geometry.slideWidth).toBeCloseTo(1280, 0);
    }
  });
}
