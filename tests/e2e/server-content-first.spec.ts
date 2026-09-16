import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/flow/server/';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 633 },
  { name: 'phone', width: 390, height: 844 },
] as const) {
  test(`${viewport.name}: operational state and one default action own the first viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('项目持久盘可用空间约 0.99 TiB');
    await expect(page.locator('.server-hero__status')).toBeVisible();
    await expect(page.locator('.server-hero__facts')).toBeVisible();
    await expect(page.locator('.server-hero__boundary')).toBeVisible();
    await expect(page.locator('.routine-entry summary')).toBeVisible();

    const geometry = await page.evaluate(() => {
      const box = (selector: string) => {
        const rect = document.querySelector(selector)!.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      };
      return {
        hero: box('.server-hero'),
        summary: box('.routine-entry summary'),
        switchboard: box('.operation-switchboard'),
        minHeight: getComputedStyle(document.querySelector('.server-hero')!).minHeight,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(geometry.hero.height).toBeLessThan(viewport.height);
    expect(geometry.minHeight).toBe('0px');
    expect(geometry.summary.bottom).toBeLessThanOrEqual(viewport.height);
    expect(geometry.switchboard.top).toBeGreaterThanOrEqual(viewport.height - 12);
    expect(geometry.overflow).toBeLessThanOrEqual(2);

    const visibleHeadings = await page.locator('#main-content h1, #main-content h2, #main-content h3').evaluateAll((nodes) => nodes
      .filter((node) => { const rect = node.getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0; })
      .map((node) => node.textContent?.trim()));
    expect(visibleHeadings).toEqual(['项目持久盘可用空间约 0.99 TiB']);
  });
}

test('default operation is keyboard reachable and reveals the canonical prompt', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const summary = page.locator('.routine-entry summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.routine-entry details')).toHaveAttribute('open', '');
  await expect(page.locator('.routine-entry pre')).toContainText('例行服务器维护');
});

for (const theme of ['light', 'dark'] as const) {
  test(`${theme}: server state and safety boundary remain readable`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 633 });
    await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('.server-hero__status')).toBeVisible();
    await expect(page.locator('.server-hero__boundary')).toContainText('任何删除都要负责人单独批准同一版清单');
    await expect(page.locator('#reclaim-proposal')).toContainText('NOT_AUTHORIZED');
    await expect(page.locator('.server-hero__context')).toContainText('非实时数据');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
