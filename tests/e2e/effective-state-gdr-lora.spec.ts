import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`Effective-State GDR page keeps the sealed result boundary at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
    await expect(page.locator('.esg__hero')).toContainText('160 轮已经全部跑完');
    await expect(page.locator('.esg__hero')).toContainText('60.72');
    await expect(page.locator('.esg__hero')).toContainText('45.98');
    await expect(page.locator('.esg__hero')).toContainText('20.77');
    await expect(page.locator('.esg__hero')).toContainText('COMPLETE');
    await expect(page.locator('.esg__results')).toContainText('R1–R159 平均 WebShop reward');
    await expect(page.locator('.esg__results')).toContainText('区间跨 0');
    await expect(page.locator('#compute')).toContainText('31.09');
    await expect(page.locator('#compute')).toContainText('2.02');
    await expect(page.locator('#compute')).toContainText('2.35');
    await expect(page.locator('#parameters')).toContainText('17,920');
    await expect(page.locator('#parameters')).toContainText('1.000202');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('Effective-State post-hoc section keeps facts, inference, and entropy boundary separate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const posthoc = page.locator('#posthoc');
  await expect(posthoc).toBeVisible();
  await expect(posthoc).toContainText('Task Vector 和范数目前不能直接解释分数变化');
  await expect(posthoc).toContainText('0.72');
  await expect(posthoc).toContainText('-0.287');
  await expect(posthoc).toContainText('29.5 → 28.4');
  await expect(posthoc).toContainText('不能只凭文本事后回算真正的 token entropy');
  await expect(posthoc).toContainText('当前 GDR 已经会自适应');
  await expect(posthoc).toContainText('11,198');
  await expect(posthoc.getByRole('link', { name: /W&B 原生参数/ })).toHaveAttribute('href', /wandb\.ai/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  expect(overflow).toBe(false);
});

test('Effective-State derivation keeps factor failure, controller failure, and successor identity separate', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const derivation = page.locator('#derivation');
  await expect(derivation).toContainText('1.052');
  await expect(derivation).toContainText('因子位移');
  await expect(derivation).toContainText('657.836');
  await expect(derivation).toContainText('旧控制器');
  await expect(derivation).toContainText('C1');
  await expect(page.locator('#method')).toContainText('有效状态');
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
  expect(steps[3]).toContain('有效状态');
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
  const boundedNext = page.locator('.bounded__next-question');
  await expect(boundedNext.getByRole('link', { name: /后续加速研究/ })).toHaveAttribute(
    'href',
    '/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/',
  );
  await expect(boundedNext.getByRole('link', { name: /另一条后续问题/ })).toHaveAttribute('href', route);
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
  const context = page.locator('.research-route-context');
  await expect(context).toContainText('实验目录');
  await expect(context).toContainText('1.7B · Bounded OFF / Effective-State GDR ON');
  await expect(context).toContainText('OFF 只做 Bounded');
  await expect(context).toContainText('完整 OFF / ON 与冻结终评');
  await expect(context).toContainText('同一 128 题的 DirectApply 历史基线');
  await expect(context).not.toContainText('正式结果尚未产生');
  await expect(context).not.toContainText('Pending 结果槽');

  const h1 = page.locator('#main-content h1');
  await expect(h1).toHaveCount(1);
  const lede = page.locator('.esg__lede');
  await expect(lede).toBeVisible();
  await expect(lede).toContainText('160 轮已经全部跑完');
  await expect(lede).toContainText('DirectApply 得 60.72');
  await expect(lede).toContainText('Bounded OFF 得 45.98');
  await expect(lede).toContainText('GDR ON 得 20.77');
  await expect(page.locator('.esg__status')).toContainText('正式实验 COMPLETE');
  await expect(page.locator('#formal-design')).toContainText('配对编号 / 审计记录');
  await expect(page.locator('#formal-result')).toContainText('三个 1.7B 最终状态');
  await expect(page.locator('#formal-result')).toContainText('每轮 WebShop Score');
  await expect(page.locator('#formal-result')).toContainText('SD-LoRA training loss');
  await expect(page.locator('#formal-result')).toContainText('LONG_HORIZON_TRANSIENT_ONLY');
  const ledeBox = await lede.boundingBox();
  expect(ledeBox).not.toBeNull();
  expect(ledeBox!.y).toBeLessThan(844);
  const firstDeepChoice = await page.locator('.esg__context-links').boundingBox();
  expect(firstDeepChoice).not.toBeNull();
  expect(ledeBox!.y).toBeLessThan(firstDeepChoice!.y);
});

test('Effective-State evidence keeps resource authority single-owner after verifier absorption', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const evidence = page.locator('#evidence');
  await expect(evidence).toContainText('PR #525');
  await expect(evidence).toContainText('历史资源层后继线');
  await expect(evidence).toContainText('PR #526');
  await expect(evidence).toContainText('已收口并吸收到 #525');
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


test('Results index exposes the same-panel three-way 1.7B comparison', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  const latest = page.locator('#latest-1p7b');
  await expect(latest).toBeVisible();
  await expect(latest).toContainText('三种最终状态，做同一份 128 题');
  await expect(latest).toContainText('60.72');
  await expect(latest).toContainText('45.98');
  await expect(latest).toContainText('20.77');
  await expect(latest).toContainText('区间跨过 0');
  await expect(latest.getByRole('link', { name: /完整 OFF \/ ON/ })).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
  await expect(latest.getByRole('link', { name: /DirectApply 独立实验/ })).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#final');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  expect(overflow).toBe(false);
});
