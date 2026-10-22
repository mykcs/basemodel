import { expect, test } from '@playwright/test';

const acceptChartSize = (smallest: number) => expect(smallest).toBeGreaterThanOrEqual(12);
const cases = [
  { locale: 'zh', route: '/research/seed-openevo/study/briefing/' },
] as const;

for (const entry of cases) {
  test(`${entry.locale} briefing keeps fixed-slide geometry on desktop and phone`, async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      const response = await page.goto(entry.route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('.briefing-slide')).toHaveCount(24);

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

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`scientific chart reading ${width} ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/briefing/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const buttons = page.locator('[data-briefing-chart]');
      await expect(buttons).toHaveCount(8);
      for (let i = 0; i < 8; i++) {
        const original = await page.locator('.dynamics-chart svg').nth(i).evaluate((svg) => ({
          text: Array.from(svg.querySelectorAll('text')).map((n) => n.textContent),
          points: Array.from(svg.querySelectorAll('polyline')).map((n) => n.getAttribute('points')),
          paint: Array.from(svg.querySelectorAll('line, polyline, circle')).map(n => { const s=getComputedStyle(n); return {fill:s.fill,stroke:s.stroke,dash:s.strokeDasharray}; }),
        }));
        await buttons.nth(i).click();
        const dialog = page.locator('#research-chart-reader');
        await expect(dialog).toBeVisible();
        const close = dialog.getByRole('button', { name: '关闭图表' });
        expect(await close.evaluate((n) => n.getBoundingClientRect().height)).toBeLessThan(60);
        expect(await close.evaluate((n) => n.getBoundingClientRect().width)).toBeGreaterThan(50);
        if (theme === 'dark') expect(await dialog.evaluate((n) => getComputedStyle(n).backgroundColor)).not.toBe('rgb(255, 253, 248)');
        const reading = await dialog.locator('svg').evaluate((svg) => ({
          text: Array.from(svg.querySelectorAll('text')).map((n) => n.textContent),
          points: Array.from(svg.querySelectorAll('polyline')).map((n) => n.getAttribute('points')),
          paint: Array.from(svg.querySelectorAll('line, polyline, circle')).map(n => { const s=getComputedStyle(n); return {fill:s.fill,stroke:s.stroke,dash:s.strokeDasharray}; }),
          smallest: Math.min(...Array.from(svg.querySelectorAll<SVGTextElement>('text')).map((n) => {
            const matrix = n.getScreenCTM()!;
            return parseFloat(getComputedStyle(n).fontSize) * Math.hypot(matrix.a, matrix.b);
          })),
        }));
        expect(reading.text).toEqual(original.text);
        expect(reading.points).toEqual(original.points);
        expect(reading.paint).toEqual(original.paint);
        acceptChartSize(reading.smallest);
        await testInfo.attach(`chart-reader-${i}.json`,{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA,width,theme,engine:testInfo.project.name,original,reading})),contentType:'application/json'});
        const canvas = dialog.locator('.research-chart-canvas');
        await expect(canvas).toBeFocused();
        if (width === 390) {
          await canvas.press('ArrowRight');
          await expect.poll(() => canvas.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
        }
        if (width === 390 && i === 0) {
          const smallest = await dialog.locator('svg').evaluate((svg) => {
            (svg as SVGSVGElement).style.transform = 'scale(0.3046875)';
            return Math.min(...Array.from(svg.querySelectorAll<SVGTextElement>('text')).map((n) => {
              const m = n.getScreenCTM()!;
              return parseFloat(getComputedStyle(n).fontSize) * Math.hypot(m.a, m.b);
            }));
          });
          expect(() => acceptChartSize(smallest)).toThrow();
          await dialog.locator('svg').evaluate((svg) => { (svg as SVGSVGElement).style.transform = ''; });
          const restored = await dialog.locator('svg text').evaluateAll(nodes => Math.min(...nodes.map(n => {
            const m=(n as SVGTextElement).getScreenCTM()!;
            return parseFloat(getComputedStyle(n).fontSize)*Math.hypot(m.a,m.b);
          })));
          acceptChartSize(restored);
        }
        await dialog.screenshot({ path: testInfo.outputPath(`chart-reader-${i}.png`) });
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(buttons.nth(i)).toBeFocused();
      }
      await expect(page.locator('.briefing-slide')).toHaveCount(24);
      await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
      const images = page.locator('.metric-evidence__viewport img, .research-image-viewport img');
      await expect(images).toHaveCount(8);
      for (let i = 0; i < 8; i++) {
        const image = images.nth(i);
        const zoom = image.locator('xpath=ancestor::figure').locator('[data-metric-zoom]');
        if (await zoom.count()) {
          await expect(zoom).toBeVisible();
          await zoom.click();
          await expect(zoom).toHaveAttribute('aria-expanded','true');
          await expect(image.locator('xpath=ancestor::figure').locator('[data-metric-scroll-hint]')).toBeVisible();
        }
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth > 0)).toBe(true);
        const source = await page.request.get((await image.getAttribute('src'))!);
        expect(source.ok()).toBe(true);
        const fontSizes = [...(await source.text()).matchAll(/font-size\s*[:=]\s*["']?(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
        expect(fontSizes.length).toBeGreaterThan(0);
        const nativeFont = Math.min(...fontSizes);
        const metrics = await image.evaluate((n: HTMLImageElement) => ({
          width: n.getBoundingClientRect().width, natural: n.naturalWidth,
          localOverflow: (() => { const region=n.closest('.metric-evidence__viewport,.research-image-viewport')!; return region.scrollWidth > region.clientWidth; })(),
        }));
        {
          expect(metrics.width / metrics.natural * nativeFont).toBeGreaterThanOrEqual(12);
          expect(metrics.localOverflow).toBe(true);
          await testInfo.attach(`image-reader-${i}.json`,{body:Buffer.from(JSON.stringify({sha:process.env.CI_HEAD_SHA,width,theme,engine:testInfo.project.name,nativeFont,...metrics})),contentType:'application/json'});
          const region = page.locator('.metric-evidence__viewport, .research-image-viewport').nth(i);
          await region.focus();
          await expect(region).toBeFocused();
          await region.press('ArrowRight');
          await expect.poll(() => region.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
          await region.evaluate((n) => { n.scrollLeft = n.scrollWidth; });
          await image.locator('xpath=ancestor::figure').screenshot({ path: testInfo.outputPath(`image-reader-${i}.png`),style:'.site-header,.research-navigation{visibility:hidden}' });
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true);
    });
  }
}
