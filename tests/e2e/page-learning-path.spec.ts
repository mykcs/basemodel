import { expect, test } from '@playwright/test';

const narrativePages = [
  { path: '/research/seed-openevo/flow/seed/', first: '一次任务的轨迹与反馈怎样产生' },
  { path: '/research/seed-openevo/flow/openevo/', first: '做完一题后，什么经验能留到下一题' },
  { path: '/research/seed-openevo/flow/benchmarks/', first: '两种任务环境里，Agent 分别做什么' },
  { path: '/research/seed-openevo/flow/alfworld/', first: 'Agent 怎样改变房间里的物体状态' },
  { path: '/research/seed-openevo/flow/loops/', first: 'SEED 和 OpenEvo 更新的到底是什么' },
  { path: '/methodology/', first: '为什么“未知”不能当作零' },
] as const;

for (const { path, first } of narrativePages) {
  test('one short learning path with real destinations on ' + path, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide).toBeVisible();
    const links = guide.getByRole('link');
    await expect(links).toHaveCount(3);
    await expect(links.first()).toContainText(first);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
    for (const link of await links.all()) {
      const hash = await link.getAttribute('href');
      expect(hash).toMatch(/^#[\w-]+$/);
      await expect(page.locator(hash!)).toHaveCount(1);
    }
    await links.last().click();
    const target = await links.last().getAttribute('href');
    await expect(page).toHaveURL(new RegExp(target!.replace('#', '#') + '$'));
    await expect(page.locator(target!)).toBeVisible();
    const offset = await page.locator(target!).evaluate((node) => node.getBoundingClientRect().top);
    expect(offset).toBeGreaterThan(45);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
  });
}

for (const width of [390, 768, 1280, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('reading path is quiet and legible at ' + width + ' ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1280 ? 633 : 844 });
      await page.addInitScript((t: string) => localStorage.setItem('atlas-theme', t), theme);
      await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
      const guide = page.locator('[data-reader-guide]');
      await expect(guide).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(guide.locator('.page-learning-path__heading')).toHaveText('读完本页，你会弄清楚');
      const bg = await guide.evaluate(node => getComputedStyle(node).backgroundColor);
      expect(bg).toBe('rgba(0, 0, 0, 0)');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    });
  }
}

test('distinct page roles do not accumulate redundant guides and anonymous rails', async ({ page }) => {
  for (const path of ['/', '/models/', '/papers/', '/research/seed-openevo/study/results/', '/models/kimi-k2-thinking/']) {
    await page.goto(path);
    await expect(page.locator('[data-reader-guide]')).toHaveCount(0);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  }
  await page.goto('/papers/metagpt/');
  const hasRichGuide = await page.locator('.learning-track-nav').count();
  if (hasRichGuide) {
    await expect(page.locator('[data-reader-guide]')).toHaveCount(0);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  } else {
    await expect(page.locator('[data-reader-guide]')).toHaveCount(1);
  }
});

test('learning path remains useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/methodology/');
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide.getByRole('link')).toHaveCount(3);
    await guide.getByRole('link').last().click();
    await expect(page).toHaveURL(/#recommendation-boundary$/);
    await expect(page.locator('#recommendation-boundary')).toBeVisible();
  } finally { await context.close(); }
});
