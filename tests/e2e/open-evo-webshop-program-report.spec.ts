import { expect, test } from '@playwright/test';

for (const route of ['/research/seed-openevo/results/', '/en/research/seed-openevo/results/']) {
  test(`OpenEvo program report is interactive and overflow-safe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const report = page.getByTestId('openevo-webshop-program-report');
    await expect(report).toBeVisible();
    await expect(report.getByText('768', { exact: true }).first()).toBeVisible();

    const stageGroup = report.locator('[data-filter-group="stage"]');
    await stageGroup.locator('[data-filter-value="closeout"]').click();
    await expect(report.locator('[data-timeline-item]:visible')).toHaveCount(4);
    await expect(stageGroup.locator('[data-filter-value="closeout"]')).toHaveAttribute('aria-pressed', 'true');

    const first = report.locator('.timeline-card:visible').first();
    await first.focus();
    await first.press('ArrowDown');
    await expect(report.locator('.timeline-card:visible').nth(1)).toBeFocused();
    await report.locator('.timeline-card:visible').nth(1).click();
    await expect(report.locator('dialog[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(report.locator('dialog[open]')).toHaveCount(0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('mobile report has no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/results/');
  await expect(page.getByTestId('openevo-webshop-program-report')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('decision flow uses geometric connectors across responsive layouts', async ({ page }) => {
  await page.goto('/research/seed-openevo/results/');
  const geometry = async (index: number) => page.locator('.decision-flow li').nth(index).evaluate((node) => {
    const line = getComputedStyle(node, '::before');
    const head = getComputedStyle(node, '::after');
    return {
      lineWidth: Number.parseFloat(line.width),
      lineHeight: Number.parseFloat(line.height),
      content: head.content,
      borderTop: Number.parseFloat(head.borderTopWidth),
      borderRight: Number.parseFloat(head.borderRightWidth),
      borderBottom: Number.parseFloat(head.borderBottomWidth),
      borderLeft: Number.parseFloat(head.borderLeftWidth),
    };
  });
  const desktop = await geometry(0);
  expect(desktop.content).toBe('""');
  expect(desktop.lineWidth).toBeGreaterThan(0);
  expect(desktop.borderTop + desktop.borderRight).toBeGreaterThan(0);

  await page.setViewportSize({ width: 760, height: 900 });
  const twoColumnDown = await geometry(1);
  const twoColumnLeft = await geometry(2);
  expect(twoColumnDown.lineHeight).toBeGreaterThan(0);
  expect(twoColumnDown.borderBottom + twoColumnDown.borderRight).toBeGreaterThan(0);
  expect(twoColumnLeft.lineWidth).toBeGreaterThan(0);
  expect(twoColumnLeft.borderBottom + twoColumnLeft.borderLeft).toBeGreaterThan(0);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await geometry(0);
  expect(mobile.lineHeight).toBeGreaterThan(0);
  expect(mobile.borderBottom + mobile.borderRight).toBeGreaterThan(0);
});

test('dark-mode timeline hover preserves readable contrast', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/research/seed-openevo/results/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const card = page.locator('.timeline-card').first();
  await card.hover();
  const ratio = await card.evaluate((node) => {
    const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = (color: string) => {
      const channels = parse(color).map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const style = getComputedStyle(node);
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});
