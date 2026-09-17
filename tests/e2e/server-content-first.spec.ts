import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/flow/server/';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 633 },
  { name: 'phone', width: 390, height: 844 },
] as const) {
  test(`${viewport.name}: operational state and one default action own the first viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('2026-09-15 的非实时容量快照：实验文件磁盘约 0.99 TiB 可用');
    await expect(page.locator('.server-hero__status')).toBeVisible();
    await expect(page.locator('.server-hero__status')).toContainText('删除仍未授权');
    await expect(page.locator('.server-hero__safety')).toContainText('远端已有副本，也不能自动删服务器文件');
    await expect(page.locator('.server-hero__safety')).toContainText('删服务器文件和把私有归档改成公开，是两件事');
    await expect(page.locator('.server-hero__safety')).toContainText('还没合并的草稿，不能当正式规则');
    await expect(page.locator('.server-hero__next')).toContainText('复制例行维护指令');
    await expect(page.locator('.server-hero__next')).toHaveAttribute('href', '#routine-maintenance');
    await expect(page.locator('.server-hero__sequence')).toHaveCount(0);
    await expect(page.locator('.server-hero__maintenance-order')).toContainText('再重新读取或只加载最小必要部分确认备份真的能恢复');
    await expect(page.locator('.server-hero__maintenance-order')).toContainText('只列出准备释放空间的具体文件（回收清单）');
    await expect(page.locator('.server-safety-depth')).toHaveCount(0);
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
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return { text: node.textContent?.trim(), top: rect.top, bottom: rect.bottom, fontSize: Number.parseFloat(getComputedStyle(node).fontSize) };
      })
      .filter((heading) => heading.top < innerHeight && heading.bottom > 0));
    expect(visibleHeadings[0]?.text).toBe('2026-09-15 的非实时容量快照：实验文件磁盘约 0.99 TiB 可用');
    if (visibleHeadings.length > 1) {
      // The reader-attention contract allows the next chapter to peek naturally at
      // the bottom of a phone viewport; it must not become an equal-weight center.
      expect(visibleHeadings).toHaveLength(2);
      expect(visibleHeadings[1]?.text).toBe('服务器健康扫描');
      expect(visibleHeadings[1]!.top).toBeGreaterThanOrEqual(viewport.height * 0.8);
      expect(visibleHeadings[1]!.fontSize).toBeLessThan(visibleHeadings[0]!.fontSize);
    }
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
    await expect(page.locator('.server-hero__status')).toContainText('删除仍未授权');
    await expect(page.locator('.server-hero__safety')).toContainText('远端已有副本，也不能自动删服务器文件');
    await expect(page.locator('.server-hero__safety')).toContainText('把私有归档改成公开');
    await expect(page.locator('#reclaim-proposal')).toContainText('批准人是对象 / 服务器负责人');
    await expect(page.locator('#reclaim-proposal')).toContainText('NOT_AUTHORIZED');
    await expect(page.locator('h1')).toContainText('非实时容量快照');
    await expect(page.locator('.server-hero__context')).toContainText('保存时刻');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
