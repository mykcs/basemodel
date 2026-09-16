import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`Effective-State GDR page keeps the scientific boundary at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
    await expect(page.locator('.esg__hero')).toContainText('rank128');
    await expect(page.locator('.esg__hero')).toContainText('正式结果尚未产生');
    await expect(page.locator('.esg__results')).toContainText('160-round pooled mean reward');
    await expect(page.locator('.esg__results')).not.toContainText('0.0000');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('Effective-State derivation keeps factor failure, controller failure, and successor identity separate', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const derivation = page.locator('#derivation');
  await expect(derivation).toContainText('1.052');
  await expect(derivation).toContainText('factor displacement');
  await expect(derivation).toContainText('657.836');
  await expect(derivation).toContainText('旧 controller');
  await expect(derivation).toContainText('C1');
  await expect(page.locator('#method')).toContainText('effective state');
  await expect(page.locator('#method')).toContainText('reward');
  await expect(page.locator('#formal-design')).toContainText('EFFECTIVE_STATE_GDR_LORA_V1');
});

test('Effective-State derivation order and connectors remain semantic across desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const steps = await page.locator('.esg__steps > li').allTextContents();
  expect(steps).toHaveLength(4);
  expect(steps[0]).toContain('1.052');
  expect(steps[1]).toContain('657.836');
  expect(steps[2]).toContain('C1');
  expect(steps[3]).toContain('effective state');
  const desktopArrow = await page.locator('.esg__flow-arrow').first().boundingBox();
  expect(desktopArrow).not.toBeNull();
  expect(desktopArrow!.width).toBeGreaterThan(desktopArrow!.height);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileArrow = await page.locator('.esg__flow-arrow').first().boundingBox();
  expect(mobileArrow).not.toBeNull();
  expect(mobileArrow!.height).toBeGreaterThan(mobileArrow!.width);
});

test('historical Gated-Delta and Bounded pages both point forward without rewriting their sealed results', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.gds-hero')).toContainText('四轮 Vanilla vs GDR 配对资格实验已经全部封存');
  await expect(page.getByRole('link', { name: /后继方法.*Effective-State GDR/ })).toHaveAttribute('href', route);

  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.bounded__metrics')).toContainText('37.04');
  await expect(page.locator('.bounded__next-question').getByRole('link')).toHaveAttribute('href', route);
});

for (const theme of ['light', 'dark'] as const) {
  test(`Effective-State GDR page supports ${theme} theme without overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}


test('Effective-State first screen tells the three-part story before deeper choices', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const h1 = page.locator('#main-content h1');
  await expect(h1).toHaveCount(1);
  const lede = page.locator('.esg__lede');
  await expect(lede).toBeVisible();
  await expect(lede).toContainText('rank128');
  await expect(lede).toContainText('第一代 GDR');
  await expect(lede).toContainText('同一个有效更新可以有多种内部表示');
  await expect(lede).toContainText('正式 OFF/ON 实验已启动');
  await expect(lede).toContainText('Carrier Health 诊断暂停');
  await expect(lede).toContainText('正式结果仍 Pending');
  const ledeBox = await lede.boundingBox();
  expect(ledeBox).not.toBeNull();
  expect(ledeBox!.y).toBeLessThan(844);
  const firstDeepChoice = await page.locator('.esg__context-links').boundingBox();
  expect(firstDeepChoice).not.toBeNull();
  expect(ledeBox!.y).toBeLessThan(firstDeepChoice!.y);
});

test('Effective-State page emits no browser errors on the primary route', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror:${error.message}`));
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto(route, { waitUntil: 'networkidle' });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Effective-State keyboard path reaches native controls and toggles evidence details', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const summary = page.locator('.esg__details summary').first();
  await summary.focus();
  await expect(summary).toBeFocused();
  const details = summary.locator('..');
  const wasOpen = await details.getAttribute('open');
  await page.keyboard.press('Enter');
  const isOpen = await details.getAttribute('open');
  expect(isOpen === null).not.toBe(wasOpen === null);
  const contextLink = page.locator('.esg__context-links a').first();
  await contextLink.focus();
  await expect(contextLink).toBeFocused();
  await page.keyboard.press('Tab');
  const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? '');
  expect(activeTag).not.toBe('BODY');
});

test('Effective-State page disables nonessential motion when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const motion = await page.locator('[data-effective-state-gdr-page]').evaluate((root) => {
    const sample = root.querySelector('.esg__flow-arrow');
    if (!sample) return null;
    const style = getComputedStyle(sample);
    return { animation: style.animationName, transition: style.transitionDuration };
  });
  expect(motion).not.toBeNull();
  expect(motion!.animation).toBe('none');
  expect(Number.parseFloat(motion!.transition)).toBeLessThanOrEqual(0.001);
});
