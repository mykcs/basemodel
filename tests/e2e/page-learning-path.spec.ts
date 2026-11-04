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

// 390/768/1280 remain explicit regressions for the original reader-path PR;
// 440×956 and 1440×1000 are the current project's primary acceptance sizes.
for (const width of [390, 440, 768, 1280, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('reading path is quiet and legible at ' + width + ' ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 440 ? 956 : width === 1440 ? 1000 : width === 1280 ? 633 : 844 });
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

test('Flow comparison hub has four real reading destinations without a competing rail', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/research/seed-openevo/flow/');
  const disclosure = page.locator('.flow-learning-disclosure');
  const summary = disclosure.locator('summary');
  const guide = page.getByRole('navigation', { name: '本页学习路线' });
  await expect(summary).toBeVisible();
  await expect(disclosure).not.toHaveAttribute('open', '');
  await expect(guide).toBeHidden();
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(guide).toBeVisible();
  const links = guide.locator('a[href^="#"]');
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#[\w-]+$/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  await links.nth(2).focus();
  await expect(links.nth(2)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#site-map$/);
  await expect(page.locator('#site-map')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});

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
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 440, height: 956 } });
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

test('keyboard user can follow the evidence path without a mouse', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/research/seed-openevo/flow/seed/');
  const first = page.getByRole('navigation', { name: '本页学习路线' }).getByRole('link').first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#seed-responsibilities$/);
  await expect(page.locator('#seed-responsibilities')).toBeVisible();
});

test('Flow hub native chapter disclosure works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 440, height: 956 } });
  try {
    const page = await context.newPage();
    await page.goto('/research/seed-openevo/flow/');
    const disclosure = page.locator('.flow-learning-disclosure');
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide).toBeHidden();
    await disclosure.locator('summary').click();
    await expect(guide).toBeVisible();
    await expect(guide.getByRole('link')).toHaveCount(4);
    await guide.getByRole('link').last().click();
    await expect(page).toHaveURL(/#evidence$/);
    await expect(page.locator('#evidence')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});


// Exact-head candidate visual receipts for human cold-read review.
// These are evidence captures, not an automated claim that the design reads well.
// GitHub-hosted Chromium/WebKit upload test-results/** so the source SHA,
// viewport and theme can be inspected without spending a provider deploy.
for (const { path, id } of [
  { path: '/', id: 'home' },
  { path: '/research/seed-openevo/flow/', id: 'flow' },
  { path: '/research/seed-openevo/study/results/', id: 'results' },
] as const) {
  for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
    for (const theme of ['light', 'dark'] as const) {
      test(`candidate first-screen visual receipt: ${id} ${width} ${theme}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height });
        await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('#main-content h1')).toBeVisible();
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        const screenshotPath = testInfo.outputPath(`reader-${id}-${width}-${theme}.png`);
        await page.screenshot({ path: screenshotPath, animations: 'disabled', fullPage: false });
        const geometry = await page.evaluate(() => {
          const rectOf = (selector: string) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) };
          };
          return {
            viewport: { width: innerWidth, height: innerHeight },
            documentWidth: document.documentElement.scrollWidth,
            h1: rectOf('#main-content h1'),
            missionHero: rectOf('.mission-hero__copy'),
            missionActions: rectOf('.mission-hero__actions'),
            firstMissionSection: rectOf('.mission-section'),
          };
        });
        await testInfo.attach(`reader-${id}-${width}-${theme}`, { path: screenshotPath, contentType: 'image/png' });
        await testInfo.attach(`reader-${id}-${width}-${theme}-geometry`, {
          body: JSON.stringify({ path, theme, ...geometry }, null, 2),
          contentType: 'application/json',
        });
        expect(geometry.documentWidth - geometry.viewport.width, 'no root horizontal clipping').toBeLessThanOrEqual(2);
      });
    }
  }
}
