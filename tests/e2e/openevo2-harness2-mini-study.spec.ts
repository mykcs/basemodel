import { expect, test } from '@playwright/test';

const routes = [
  '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/',
] as const; // English runtime is archived; browser coverage follows the active Chinese surface.

for (const path of routes) {
  test(`${path} publishes the paired Harness 2.0 qualification with its HOLD boundary`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const root = page.getByTestId('harness2-mini-study');
    await expect(root).toBeVisible();
    await expect(root.getByRole('heading', { name: /购物接口的历史对照实验|Historical shopping-interface comparison/ }).first()).toBeVisible();
    await expect(root).toContainText('128 / 128');
    await expect(root).toContainText('31.25%');
    await expect(root).toContainText('42.19%');
    await expect(root).toContainText(/通过|Passed/);
    await expect(root).toContainText(/暂停启用|Held/);
    await expect(root).toContainText(/Harness 2\.0\.1/i);

    const details = root.locator('.h2study__evidence');
    await expect(details).toBeVisible();
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
  });
}

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 1000 },
  ] as const) {
    test(`${viewport.name}-${theme} keeps the Harness 2.0 mini study overflow-safe`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      const primaryAnswer = page.locator('.h2study__hero>div>strong');
      await expect(primaryAnswer).toBeVisible();
      await expect(primaryAnswer).toContainText(/预设接口检查按既定阈值通过|preset interface check passed its defined thresholds/);
      await expect(primaryAnswer).toContainText(/更多购物尝试因无效动作提前结束|more candidate attempts ended early on invalid actions/);
      await expect(primaryAnswer).toContainText(/没有获准进入正式 Stage 2|formal Stage 2 was not authorized/);
      const answerBox = await primaryAnswer.boundingBox();
      expect(answerBox).not.toBeNull();
      expect(answerBox!.y).toBeGreaterThanOrEqual(0);
      expect(answerBox!.y + answerBox!.height).toBeLessThanOrEqual(viewport.height + 2);
      await expect(page.locator('.h2study__hero aside')).toContainText(/接口检查通过|Interface checks passed/);
      await expect(page.locator('.h2study__hero aside')).toContainText(/尚未授权正式训练|formal authorization were still pending/);

      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        rootOverflowX: getComputedStyle(document.documentElement).overflowX,
      }));
      expect(geometry.bodyOverflowX).not.toBe('hidden');
      expect(geometry.rootOverflowX).not.toBe('hidden');
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.getByTestId('harness2-mini-study')).toBeVisible();
    });
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const scenario of [
    { name: '320px-reflow', width: 320, height: 844, enlargeText: false },
    { name: '200-percent-text', width: 390, height: 844, enlargeText: true },
  ] as const) {
    test(`${scenario.name}-${theme} keeps the Harness 2.0 answer readable without page overflow`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
      await page.goto(routes[0], { waitUntil: 'domcontentloaded' });
      if (scenario.enlargeText) await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

      const primaryAnswer = page.locator('.h2study__hero>div>strong');
      await expect(primaryAnswer).toBeVisible();
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        answerRight: document.querySelector('.h2study__hero>div>strong')?.getBoundingClientRect().right ?? Infinity,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      expect(geometry.answerRight).toBeLessThanOrEqual(geometry.clientWidth + 2);
    });
  }
}
