import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/parameter-memory-results/#q04-gpu-resources';

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Q04 phase-oriented GPU evidence and schematic are unambiguous at ${width}px ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(next => localStorage.setItem('atlas-theme', next), theme);
      await page.goto(route);
      const root = page.locator('[data-q04-gpu-resource]');
      await expect(root).toBeVisible();
      await expect(root).toHaveAttribute('data-mode', 'observed');
      await expect(root).toContainText('34分32秒');
      await expect(root).toContainText('4.48 GiB');
      await expect(root).toContainText('5.71 GiB');
      await expect(root).toContainText('不知道整个 34 分钟内真实的全卡最高峰值');
      await expect(root.locator('[data-q04-gpu-snapshot]')).toHaveCount(2);
      await expect(root.locator('[data-q04-gpu-observed]')).toBeVisible();
      await expect(root.locator('[data-q04-gpu-schematic]')).toBeHidden();
      await expect(root.locator('.q04-gpu__phases li')).toHaveCount(4);
      await expect(root).toContainText('调度预留 ≠ 实际峰值');
      await expect(root.locator('[data-q04-gpu-mode-copy="observed"]')).toBeVisible();
      const plot = await root.locator('.q04-gpu__plot-wrap').evaluate(node => ({
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
      }));
      if (width === 390) expect(plot.scrollWidth).toBeGreaterThan(plot.clientWidth);
      const capture = (width === 390 && theme === 'light') || (width === 1440 && theme === 'dark');
      if (capture) await root.screenshot({ path: testInfo.outputPath(`q04-observed-${width}-${theme}.png`), animations: 'disabled' });

      const demo = root.getByRole('button', { name: '完整曲线示意' });
      await expect(demo).toBeVisible();
      await demo.click();
      await expect(root).toHaveAttribute('data-mode', 'schematic');
      await expect(demo).toHaveAttribute('aria-pressed', 'true');
      await expect(root.locator('[data-q04-gpu-schematic]')).toBeVisible();
      await expect(root.locator('[data-q04-gpu-observed]')).toBeHidden();
      await expect(root.locator('[data-q04-gpu-mode-copy="schematic"]')).toContainText('不是这次 Q04 的测量结果');
      if (capture) await root.screenshot({ path: testInfo.outputPath(`q04-schematic-${width}-${theme}.png`), animations: 'disabled' });

      await root.getByRole('button', { name: '真实证据' }).click();
      await expect(root.locator('[data-q04-gpu-snapshot]')).toHaveCount(2);
      await expect(root).toHaveAttribute('data-mode', 'observed');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const horizontalOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(horizontalOverflow).toBeLessThanOrEqual(2);
    });
  }
}

test('Q04 truth remains available with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  const root = page.locator('[data-q04-gpu-resource]');
  await expect(root.locator('[data-q04-gpu-observed]')).toBeVisible();
  await expect(root.locator('.q04-gpu__modes')).toBeHidden();
  await expect(root).toContainText('没有采集连续显存曲线');
  await context.close();
});
