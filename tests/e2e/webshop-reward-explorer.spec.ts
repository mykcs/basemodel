import { expect, test } from '@playwright/test';
const path = '/research/seed-openevo/flow/webshop/';
for (const sample of [
  { name: 'phone light', width: 390, theme: 'light' },
  { name: 'phone dark', width: 390, theme: 'dark' },
  { name: 'desktop light', width: 1440, theme: 'light' },
  { name: 'desktop dark', width: 1440, theme: 'dark' },
] as const) {
  test('scoring example responds to inputs on ' + sample.name, async ({ page }) => {
    await page.setViewportSize({ width: sample.width, height: 900 });
    await page.addInitScript((theme: string) => localStorage.setItem('atlas-theme', theme), sample.theme);
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const example = page.locator('[data-webshop-reward-explorer]');
    await example.scrollIntoViewIfNeeded();
    await expect(page.locator('html')).toHaveAttribute('data-theme', sample.theme);
    const score = example.getByTestId('webshop-reward-score');
    const exact = example.getByTestId('webshop-exact-success');
    const size = example.getByRole('checkbox', { name: '尺码 9 选项正确' });
    await expect(size).toBeEnabled();
    await expect(score).toHaveText('0.75');
    await expect(exact).toContainText('完整成功：否');
    await size.check();
    await expect(score).toHaveText('1.00');
    await expect(exact).toContainText('完整成功：是');
    await example.getByRole('checkbox', { name: '防水属性符合要求' }).uncheck();
    await expect(score).toHaveText('0.75');
    await expect(exact).toContainText('完整成功：否');
    await size.focus();
    await size.press('Space');
    await expect(score).toHaveText('0.50');
    await example.getByRole('button', { name: '恢复初始示例' }).click();
    await expect(score).toHaveText('0.75');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}
test('static example still gives the answer without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const example = page.locator('[data-webshop-reward-explorer]');
    await expect(example.getByTestId('webshop-reward-score')).toHaveText('0.75');
    await expect(example.getByTestId('webshop-exact-success')).toContainText('完整成功：否');
    await expect(example.getByRole('checkbox', { name: '尺码 9 选项正确' })).toBeDisabled();
    await expect(example.getByText('启用 JavaScript 后可以修改条件。', { exact: false })).toBeVisible();
  } finally { await context.close(); }
});
