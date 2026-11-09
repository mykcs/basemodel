import { expect, test } from '@playwright/test';

test('active pages advertise only Chinese while English source is archived', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/results/');
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"en\"]')).toHaveCount(0);
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"zh-CN\"]')).toHaveCount(1);
  await expect(page.locator('link[rel=\"alternate\"][hreflang=\"x-default\"]')).toHaveCount(1);
  await expect(page.locator('.nav-inner > .lang-switch')).toHaveCount(0);
  await expect(page.locator('#mobile-menu .lang-switch')).toHaveCount(0);
});

// Guard the exact failure that made an otherwise valid Flow link test open
// the Chinese 404 page under a retired /en/ URL. This must not silently 200.
test('inactive English research URLs fail closed while Chinese pages remain real routes', async ({ page }) => {
  for (const route of ['/research/seed-openevo/flow/', '/research/seed-openevo/study/results/']) {
    const active = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(active?.status(), `active Chinese route: ${route}`).toBe(200);

    const archived = await page.goto(`/en${route}`, { waitUntil: 'domcontentloaded' });
    expect(archived?.status(), `inactive English route must not impersonate ${route}`).toBe(404);
  }
});
