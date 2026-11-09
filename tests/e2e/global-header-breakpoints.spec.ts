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

test('mobile navigation releases scroll lock when keyboard focus leaves the open menu', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);

  const toggle = page.locator('[data-menu-toggle]');
  const mobileMenu = page.locator('[data-mobile-menu]');
  const searchTrigger = page.locator('[data-command-trigger]');

  for (const theme of ['light', 'dark'] as const) {
    await test.step(`440px ${theme}: focus leaves the mobile disclosure`, async () => {
      await page.evaluate((nextTheme) => { document.documentElement.dataset.theme = nextTheme; }, theme);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(mobileMenu.locator('.mobile-journeys a').first()).toBeFocused();
      await expect(page.locator('html')).toHaveClass(/mobile-nav-open/);

      await page.keyboard.press('Shift+Tab');
      await expect(toggle).toBeFocused();
      await expect(mobileMenu).toBeVisible();

      await page.keyboard.press('Shift+Tab');
      await expect(searchTrigger).toBeFocused();
      await expect(mobileMenu).toBeHidden();
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('html')).not.toHaveClass(/mobile-nav-open/);

      // Outside pointer input does not itself transfer keyboard focus.
      // Clicking the empty top-left edge must dismiss the mobile disclosure.
      await toggle.click();
      await expect(mobileMenu).toBeVisible();
      await expect(page.locator('html')).toHaveClass(/mobile-nav-open/);
      await page.mouse.click(2, 2);
      await expect(mobileMenu).toBeHidden();
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('html')).not.toHaveClass(/mobile-nav-open/);
    });
  }
});
