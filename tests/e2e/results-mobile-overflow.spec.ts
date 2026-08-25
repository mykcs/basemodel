import { expect, test } from '@playwright/test';

const resultsRoutes = [
  '/research/seed-openevo/results/',
  '/en/research/seed-openevo/results/',
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
