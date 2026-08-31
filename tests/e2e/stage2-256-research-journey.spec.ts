import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/stage2-256-window/?model=3b&teacher=self';

for (const localeRoute of [route, `/en${route}`]) {
  test(`${localeRoute} exposes the design genealogy and matched-prefix diagnosis`, async ({ page }) => {
    await page.goto(localeRoute);
    const journey = page.getByTestId('legacy-stage2-research-journey');
    await expect(journey).toBeVisible();
    await expect(journey).toContainText('H1.38B');
    await expect(journey).toContainText('H1.40');
    await expect(journey).toContainText('1,280');
    await expect(journey).toContainText('128 + 128');
    await expect(page.locator('[data-model-choice="3b"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-teacher-choice="self"]')).toHaveAttribute('aria-pressed', 'true');
  });
}

for (const c of [
  { name: 'mobile-light', width: 390, height: 844, theme: 'light' },
  { name: 'mobile-dark', width: 390, height: 844, theme: 'dark' },
  { name: 'tablet-light', width: 768, height: 1024, theme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 1000, theme: 'dark' },
] as const) {
  test(`${c.name} keeps the Stage2 research journey inside the document viewport`, async ({ page }) => {
    await page.addInitScript((theme) => localStorage.setItem('atlas-theme', theme), c.theme);
    await page.setViewportSize({ width: c.width, height: c.height });
    await page.goto(route);
    await expect(page.getByTestId('legacy-stage2-research-journey')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
