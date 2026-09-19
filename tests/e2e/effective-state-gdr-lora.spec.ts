import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`three-experiment paper view keeps the ablation result readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('三个 OpenEVO 实验');
    const ablation = page.locator('.paper-table--ablation');
    await expect(ablation).toContainText('普通 OpenEVO');
    await expect(ablation).toContainText('OpenEVO + Bounded Online Recurrence');
    await expect(ablation).toContainText('OpenEVO + Bounded Online Recurrence + GDR');
    await expect(ablation).toContainText('60.72');
    await expect(ablation).toContainText('45.98');
    await expect(ablation).toContainText('20.77');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('ablation table makes the three mechanism combinations explicit with checkmarks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const rows = page.locator('.paper-table--ablation tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText('普通 OpenEVO');
  await expect(rows.nth(0).getByText('✓')).toHaveCount(0);
  await expect(rows.nth(1)).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(rows.nth(1).getByText('✓')).toHaveCount(1);
  await expect(rows.nth(2)).toContainText('OpenEVO + Bounded Online Recurrence + GDR');
  await expect(rows.nth(2).getByText('✓')).toHaveCount(2);
});

test('paper narrative follows motivation, method, mapping, experiment, result, and analysis', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const h2s = await page.locator('.paper__section > h2').allTextContents();
  expect(h2s.slice(0, 5)).toEqual([
    '动机：SD-LoRA 越训练越慢',
    '方法：Bounded Online Recurrence 与 GDR',
    '实验设置：Qwen3-1.7B × WebShop',
    '结果：Bounded 把参数训练变快了，但最终分数下降；再加 GDR 下降更多',
    'Analysis：为什么 GDR 后期会掉下来？',
  ]);
});

test('method section explains Bounded Online Recurrence and the GDR-to-parameter-state mapping', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const method = page.locator('#method');
  await expect(method).toContainText('Compress');
  await expect(method).toContainText('Gated Delta Rule');
  await expect(method).toContainText('α');
  await expect(method).toContainText('β');
  await expect(method).toContainText('从 sequence State 映射到 OpenEVO 的参数 State');
  await expect(method).toContainText('A → sA');
  await expect(method).toContainText('1.052');
  await expect(method).toContainText('657.836');
  await expect(method).toContainText('22');
  await expect(method).toContainText('reward、Task Score、Task Vector');
});

test('experiment setup names Qwen3-1.7B, WebShop, budget, and OPSD boundary', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const setup = page.locator('#formal-design');
  await expect(setup).toContainText('Qwen3-1.7B');
  await expect(setup).toContainText('WebShop');
  await expect(setup).toContainText('20,480');
  await expect(setup).toContainText('rank128');
  await expect(setup).toContainText('rank8 SD-LoRA');
  await expect(setup).toContainText('11,198');
  await expect(setup).toContainText('不是 SEED 的 hindsight-skill SFT');
});

test('formal result preserves the matched-arm statistical boundary under public names', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const result = page.locator('#formal-result');
  await expect(result).toContainText('普通 OpenEVO');
  await expect(result).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(result).toContainText('OpenEVO + Bounded Online Recurrence + GDR');
  await expect(result).toContainText('R1–R159 mean reward');
  await expect(result).toContainText('跨 0');
  await expect(result).toContainText('LONG_HORIZON_TRANSIENT_ONLY');
  await expect(page.locator('#compute')).toContainText('31.09');
  await expect(page.locator('#compute')).toContainText('2.02');
  await expect(page.locator('#compute')).toContainText('2.35');
  await expect(page.locator('#compute')).toContainText('13–15×');
});

test('analysis answers Task Vector, direction, steps, entropy, and adaptive questions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const analysis = page.locator('#analysis');
  await expect(analysis).toContainText('Task Vector、范数和谱');
  await expect(analysis).toContainText('0.72');
  await expect(analysis).toContainText('-0.287');
  await expect(analysis).toContainText('7.91');
  await expect(analysis).toContainText('8.60');
  await expect(analysis).toContainText('不能补造 token entropy');
  await expect(analysis).toContainText('0.489');
  await expect(analysis).toContainText('0.370');
  await expect(analysis).toContainText('约束要不要更 adaptive');
  await expect(analysis.getByRole('link', { name: /W&B/ })).toHaveAttribute('href', /wandb\.ai/);
});

for (const theme of ['light', 'dark'] as const) {
  test(`paper view supports ${theme} theme without page overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('phone first screen establishes the three experiments before deep method detail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const context = page.locator('.research-route-context');
  await expect(context).toHaveAttribute('data-compact', 'true');
  await expect(context).toContainText('1.7B · 普通 OpenEVO / Bounded Online Recurrence / + GDR');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('三个 OpenEVO 实验');
  const ablation = page.locator('.paper-table-wrap--hero');
  await expect(ablation).toBeVisible();
  const h1Box = await h1.boundingBox();
  const tableBox = await ablation.boundingBox();
  expect(h1Box).not.toBeNull();
  expect(tableBox).not.toBeNull();
  expect(h1Box!.y).toBeLessThan(tableBox!.y);
  expect(tableBox!.y).toBeLessThan(844);
  expect(tableBox!.x).toBeGreaterThanOrEqual(0);
  expect(tableBox!.x + tableBox!.width).toBeLessThanOrEqual(390);
});

test('evidence keeps public names separate from exact internal experiment identities', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const evidence = page.locator('#evidence');
  await expect(evidence).toContainText('普通 OpenEVO / Bounded Online Recurrence / Bounded Online Recurrence + GDR');
  await expect(evidence).toContainText('DirectApply / No-GDR');
  await expect(evidence).toContainText('BOUNDED_OFF');
  await expect(evidence).toContainText('EFFECTIVE_STATE_GDR_LORA_V1');
});

test('historical Gated-Delta and Bounded pages still point to the successor study', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: /后继方法.*Effective-State GDR/ })).toHaveAttribute('href', route);
  await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.bounded__next-question').getByRole('link', { name: /另一条后续问题/ })).toHaveAttribute('href', route);
});

test('paper page emits no browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror:${error.message}`));
  const response = await page.goto(route, { waitUntil: 'networkidle' });
  expect(response?.status()).toBeLessThan(400);
  expect(errors).toEqual([]);
});

test('evidence disclosures stay keyboard-operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const summary = page.locator('.paper__details summary').first();
  await summary.focus();
  await expect(summary).toBeFocused();
  const details = summary.locator('..');
  const wasOpen = await details.getAttribute('open');
  await page.keyboard.press('Enter');
  const isOpen = await details.getAttribute('open');
  expect(isOpen === null).not.toBe(wasOpen === null);
});

test('reduced motion keeps the paper content static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const transition = await page.locator('.paper__equation').first().evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(Number.parseFloat(transition)).toBeLessThanOrEqual(0.001);
});

test('results index uses the same public names as the experiment page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  const latest = page.locator('#latest-1p7b');
  await expect(latest).toContainText('普通 OpenEVO');
  await expect(latest).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(latest).toContainText('OpenEVO + Bounded Online Recurrence + GDR');
  await expect(latest).toContainText('60.72');
  await expect(latest).toContainText('45.98');
  await expect(latest).toContainText('20.77');
  await expect(latest.getByRole('link', { name: /三组实验、方法与完整分析/ })).toHaveAttribute('href', route);
  await expect(latest.getByRole('link', { name: /普通 OpenEVO 独立实验/ })).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#final');
});
