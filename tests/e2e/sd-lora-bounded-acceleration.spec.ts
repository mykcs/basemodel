import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/';

test('Bounded acceleration page keeps the bottleneck and evidence boundary visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 633 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bounded 的主要时间花在训练');
  await expect(page.locator('.ba-accel__lede')).toContainText('4.26 秒');
  await expect(page.locator('.ba-accel__lede')).toContainText('0.49 秒');
  const ledeBox = await page.locator('.ba-accel__lede').boundingBox();
  expect(ledeBox).not.toBeNull();
  expect((ledeBox?.y ?? 9999) + (ledeBox?.height ?? 9999)).toBeLessThanOrEqual(633);
  await expect(page.locator('.ba-accel__boundary').first()).toContainText('不是正式 B2 / B3');
  await expect(page.locator('.ba-accel__findings')).toContainText('112/112');
  await expect(page.locator('.ba-accel__findings')).toContainText('59.36%');
});
test('Bounded acceleration page stays readable on phone and keeps audit depth collapsed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  const details = page.locator('.ba-accel__evidence');
  await expect(details).not.toHaveAttribute('open', '');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  expect(overflow).toBe(false);

  await details.locator('summary').click();
  await expect(details).toContainText('真实训练与顺序反例');
  await expect(details).toContainText('Muon / Newton–Schulz 判别');
  await expect(details).toContainText('FLA / WY composability witness');
});
