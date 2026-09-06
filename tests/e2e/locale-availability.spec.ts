import { expect, test } from '@playwright/test';

test('bilingual route exposes reciprocal metadata and language controls', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/results/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/research\/seed-openevo\/study\/results\/$/);
  await expect(page.locator('.nav-inner > .lang-switch')).toHaveAttribute('href', '/en/research/seed-openevo/study/results/');
  await page.goto('/en/research/seed-openevo/study/results/');
  await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute('href', /\/research\/seed-openevo\/study\/results\/$/);
});

test('Chinese-only route advertises no fabricated English target on desktop or mobile', async ({ page }) => {
  await page.goto('/guide/today/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveCount(0);
  await expect(page.locator('.nav-inner > .lang-switch')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('.mobile-menu .lang-switch')).toHaveCount(0);
});

// CircleCI current-main control benchmark marker; no test semantics or identities change.
