import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/flow/server/';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 633 },
  { name: 'phone', width: 390, height: 844 },
] as const) {
  test(`${viewport.name}: operational state and one default action own the first viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('实验文件磁盘：约 1.09 TB 可用');
    await expect(page.locator('.server-hero__status')).toBeVisible();
    await expect(page.locator('.server-hero__facts')).toBeVisible();
    await expect(page.locator('.server-hero__facts')).toContainText('未授权');
    await expect(page.locator('.server-hero__next')).toHaveText('下一步：只读健康扫描');
    await expect(page.locator('.server-safety-depth summary')).toBeAttached();
    await expect(page.locator('.routine-entry summary')).toBeAttached();

    const geometry = await page.evaluate(() => {
      const box = (selector: string) => {
        const rect = document.querySelector(selector)!.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      };
      return {
        hero: box('.server-hero'),
        routine: box('.routine-entry'),
        switchboard: box('.operation-switchboard'),
        minHeight: getComputedStyle(document.querySelector('.server-hero')!).minHeight,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(geometry.hero.height).toBeLessThan(viewport.height);
    expect(geometry.minHeight).toBe('0px');
    expect(geometry.switchboard.top).toBeGreaterThan(viewport.height);
    expect(geometry.routine.top).toBeGreaterThan(geometry.switchboard.bottom);
    expect(geometry.overflow).toBeLessThanOrEqual(2);

    const visibleHeadings = await page.locator('#main-content h1, #main-content h2, #main-content h3').evaluateAll((nodes) => nodes
      .filter((node) => { const rect = node.getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0; })
      .map((node) => node.textContent?.trim()));
    expect(visibleHeadings).toEqual(['实验文件磁盘：约 1.09 TB 可用']);
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
    await expect(page.locator('.server-hero__facts')).toContainText('未授权');
    await page.locator('.server-safety-depth summary').click();
    await expect(page.locator('.server-hero__boundary')).toContainText('上传成功 ≠ 可恢复');
    await expect(page.locator('.server-hero__boundary')).toContainText('对象 / 服务器负责人必须批准同一版精确回收清单');
    await expect(page.locator('#reclaim-proposal')).toContainText('NOT_AUTHORIZED');
    await expect(page.locator('.server-hero__context')).toContainText('非实时数据');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
