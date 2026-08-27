import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/results/';
const handoffCases = [
  { width: 820, mode: 'mobile' },
  { width: 821, mode: 'mobile' },
  { width: 900, mode: 'mobile' },
  { width: 960, mode: 'mobile' },
  { width: 961, mode: 'mobile' },
  { width: 1080, mode: 'mobile' },
  { width: 1081, mode: 'desktop' },
] as const;

test('responsive header breakpoint handoff has no navigation dead zone', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-theme', 'light'));
  await page.setViewportSize({ width: 900, height: 1000 });
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);

  const desktopNav = page.locator('.desktop-nav');
  const toggle = page.locator('[data-menu-toggle]');
  const mobileMenu = page.locator('[data-mobile-menu]');

  for (const state of handoffCases) {
    await test.step(`${state.width}px ${state.mode}`, async () => {
      await page.setViewportSize({ width: state.width, height: 1000 });
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

      const rootWidth = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(
        rootWidth.scroll,
        `${state.width}px: responsive header handoff must not create horizontal overflow`,
      ).toBeLessThanOrEqual(rootWidth.client + 2);

      if (state.mode === 'mobile') {
        await expect(desktopNav).toBeHidden();
        await expect(toggle).toBeVisible();
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(mobileMenu).toBeVisible();
        await expect(mobileMenu.locator('.mobile-journeys a').first()).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(mobileMenu).toBeHidden();
      } else {
        await expect(desktopNav).toBeVisible();
        await expect(toggle).toBeHidden();
      }
    });
  }
});
