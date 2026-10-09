import { expect, test } from '@playwright/test';

const path = '/research/seed-openevo/flow/webshop/';

for (const sample of [
  { name: 'phone light', width: 390, theme: 'light' },
  { name: 'phone dark', width: 390, theme: 'dark' },
  { name: 'tablet light', width: 768, theme: 'light' },
  { name: 'desktop light', width: 1440, theme: 'light' },
  { name: 'desktop dark', width: 1440, theme: 'dark' },
] as const) {
  test('product choices constrain later options in ' + sample.name, async ({ page }) => {
    await page.setViewportSize({ width: sample.width, height: 900 });
    await page.addInitScript((theme: string) => localStorage.setItem('atlas-theme', theme), sample.theme);
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const example = page.locator('[data-webshop-reward-explorer]');
    await example.scrollIntoViewIfNeeded();
    await expect(page.locator('html')).toHaveAttribute('data-theme', sample.theme);
    const product = example.getByLabel('① 选择商品');
    const size = example.getByLabel('② 选择这款商品提供的尺码');
    const reward = example.getByTestId('webshop-reward-score');
    const exact = example.getByTestId('webshop-exact-success');
    const purchase = example.getByRole('button', { name: '③ 完成购买并评分' });

    await expect(product).toBeEnabled();
    await expect(reward).toHaveText('0.75');
    await expect(exact).toContainText('完整成功：否');

    await product.selectOption('basic');
    await expect(size).toHaveValue('8');
    await expect(size.locator('option[value="9"]')).toBeDisabled();
    await expect(example.getByTestId('webshop-dependency')).toContainText('没有 9 码');
    await expect(reward).toHaveText('—');
    await expect(exact).toContainText('尚未评分');
    await expect(example).toContainText('不是 0 分');
    await purchase.click();
    await expect(reward).toHaveText('0.50');
    await expect(exact).toContainText('完整成功：否');

    await product.selectOption('trail');
    await expect(size.locator('option[value="9"]')).toBeEnabled();
    await size.selectOption('9');
    await expect(reward).toHaveText('—');
    await purchase.click();
    await expect(reward).toHaveText('1.00');
    await expect(exact).toContainText('完整成功：是');

    await product.selectOption('premium');
    await expect(size).toHaveValue('9');
    await expect(reward).toHaveText('—');
    await purchase.click();
    await expect(reward).toHaveText('0.50');
    await expect(example.getByTestId('webshop-product-facts')).toContainText('$75');

    await example.getByRole('button', { name: '恢复初始案例' }).click();
    await expect(reward).toHaveText('0.75');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
}

test('static fallback explains the completed example even without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const example = page.locator('[data-webshop-reward-explorer]');
    await expect(example.getByTestId('webshop-reward-score')).toHaveText('0.75');
    await expect(example.getByTestId('webshop-exact-success')).toContainText('完整成功：否');
    await expect(example.getByLabel('① 选择商品')).toBeDisabled();
    await expect(example.getByLabel('② 选择这款商品提供的尺码')).toBeDisabled();
    await expect(example.getByText('启用 JavaScript 后可以更换商品', { exact: false })).toBeVisible();
    await expect(example.getByText('评分检查的是购买后的四项要求', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});
