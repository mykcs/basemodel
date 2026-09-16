import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/flow/sd-lora/';

test('Vanilla SD-LoRA page exposes the real round mechanism and scientific boundary', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('vanilla-sd-lora-mechanism');
  await expect(body).toBeVisible();
  const navigation = page.locator('[data-research-navigation][data-research-track="flow"]');
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'SD-LoRA', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(navigation.getByRole('link', { name: 'SD-LoRA', exact: true })).toHaveAttribute('href', route);
  const series = page.locator('[data-sdlora-series-nav]');
  const vanillaSeries = series.locator(`a[href="${route}"]`).filter({ hasText: 'Vanilla SD-LoRA 是怎么学习的？' });
  await expect(vanillaSeries).toHaveCount(1);
  await expect(vanillaSeries).toHaveAttribute('href', route);
  await expect(vanillaSeries).toHaveAttribute('aria-current', 'page');
  await expect(series.locator('a[href="/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/"]')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('SD-LoRA 用筛选后的成功轨迹训练候选 LoRA 参数');
  await expect(body).toContainText('一次 WebShop（网页购物任务）成功先只是一条任务轨迹');
  await expect(body).toContainText('SD-LoRA 在本轮任务结束后、下一轮开始前更新 LoRA');
  await expect(body.locator('#what-is-sd-lora table')).toBeVisible();
  await expect(body.locator('#what-is-sd-lora tbody tr')).toHaveCount(3);
  await expect(body).toContainText('候选参数不等于能力一定提升');
  await expect(body).toContainText('普通 LoRA');
  await expect(body).toContainText('Scalable Decoupled LoRA');
  await expect(body).toContainText('本页把没有加入后续加速变体的当前基线称为 “Vanilla SD-LoRA”');
  await expect(body).toContainText('16 个任务 × 每题 8 次');
  await expect(body).toContainText('每个任务只取最早一条通过全部检查的成功');
  await expect(body).toContainText('最多带回 64 条旧经验');
  await expect(body).toContainText('旧方向');
  await expect(body).toContainText('重新调整所有方向的影响大小');
  await expect(body).toContainText('ΔWₜ = Σ αᵢDᵢ');
  await expect(body).toContainText('paper_equivalent=false');
  await expect(body).toContainText('rehearsal_free=false');
  await expect(body).toContainText('这些是接下来要测的风险');
});

test('historical capability URL forwards to the Flow map owner', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL((url) => url.pathname === route);
  await expect(page.locator('[data-research-navigation]')).toHaveAttribute('data-research-track', 'flow');
  await expect(page.getByTestId('vanilla-sd-lora-mechanism')).toBeVisible();
});

for (const viewport of [
  { name: 'desktop-first-screen', width: 1280, height: 633 },
  { name: 'phone-first-screen', width: 390, height: 844 },
] as const) {
  test(`${viewport.name}: the first viewport stays on one parameter-write task`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const primer = await page.locator('#what-is-sd-lora').boundingBox();
    expect(primer).not.toBeNull();
    expect(primer!.y).toBeGreaterThanOrEqual(viewport.height);
    await expect(page.locator('.sdlora-intro__frame')).toBeVisible();
    await expect(page.locator('.sdlora-intro__boundary')).toBeVisible();
    const visibleMainHeadings = await page.locator('#main-content h1, #main-content h2, #main-content h3').evaluateAll((nodes) => nodes
      .filter((node) => { const box = node.getBoundingClientRect(); return box.width > 0 && box.height > 0 && box.top < innerHeight && box.bottom > 0; })
      .map((node) => node.textContent?.trim()));
    expect(visibleMainHeadings).toEqual(['SD-LoRA 用筛选后的成功轨迹训练候选 LoRA 参数']);
  });
}

test('desktop reading order puts motivation and LoRA comparison before the mechanism canvas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const positions = await page.locator('.sdlora-intro, #what-is-sd-lora, [data-slide-canvas]').evaluateAll((nodes) => nodes.map((node) => ({
    id: node.id || node.className,
    top: node.getBoundingClientRect().top,
    bottom: node.getBoundingClientRect().bottom,
  })));
  expect(positions).toHaveLength(3);
  expect(positions[0]!.bottom).toBeLessThanOrEqual(positions[1]!.top + 2);
  expect(positions[1]!.bottom).toBeLessThanOrEqual(positions[2]!.top + 2);
});

test('desktop canvas carries real routed topology instead of card adjacency', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const desktop = page.locator('[data-flow-layout="desktop"]');
  await expect(desktop).toBeVisible();

  for (const edge of [
    'prior-rollout',
    'rollout-clean',
    'clean-update',
    'replay-update',
    'update-candidate',
    'candidate-directapply',
    'candidate-gdr',
    'directapply-next',
    'gdr-next',
    'round-return',
  ]) {
    await expect(desktop.locator(`[data-edge="${edge}"]`)).toHaveCount(1);
  }

  const geometry = await desktop.locator('[data-flow-node]').evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return [node.getAttribute('data-flow-node'), { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }];
  })));

  expect(geometry.prior.right).toBeLessThan(geometry.rollout.left);
  expect(geometry.rollout.right).toBeLessThan(geometry.clean.left);
  expect(geometry.clean.right).toBeLessThan(geometry.update.left);
  expect(geometry.update.right).toBeLessThan(geometry.candidate.left);
  expect(geometry.replay.top).toBeGreaterThan(geometry.clean.top);
  expect(geometry.directapply.top).toBeGreaterThan(geometry.candidate.bottom);
  expect(geometry.gdr.top).toBeGreaterThan(geometry.candidate.bottom);
  expect(geometry.next.top).toBeGreaterThan(geometry.directapply.bottom);

  await expect(desktop.locator('[data-edge="round-return"]')).toHaveAttribute('marker-end', /sdlora-flow-arrow/);
});

test('mobile canvas preserves side-input, branch, join, and return topology', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-flow-layout="desktop"]')).toBeHidden();
  const mobile = page.locator('[data-flow-layout="mobile"]');
  await expect(mobile).toBeVisible();

  for (const edge of [
    'prior-rollout-mobile',
    'rollout-clean-mobile',
    'replay-update-mobile',
    'update-candidate-mobile',
    'candidate-directapply-mobile',
    'candidate-gdr-mobile',
    'directapply-next-mobile',
    'gdr-next-mobile',
    'round-return-mobile',
  ]) {
    await expect(mobile.locator(`[data-edge="${edge}"]`)).toHaveCount(1);
  }

  const vertical = await mobile.locator('[data-flow-node="prior-mobile"], [data-flow-node="rollout-mobile"], [data-flow-node="clean-mobile"], [data-flow-node="update-mobile"], [data-flow-node="candidate-mobile"], [data-flow-node="next-mobile"]').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(vertical).toEqual([...vertical].sort((a, b) => a - b));
});

test('reduced motion keeps static arrows and disables route animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const edge = page.locator('[data-edge="prior-rollout"]');
  await expect(edge).toHaveAttribute('marker-end', /sdlora-flow-arrow/);
  const animationName = await edge.evaluate((node) => getComputedStyle(node).animationName);
  expect(animationName).toBe('none');
});

for (const viewport of [
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${theme}: no horizontal overflow and mechanism remains readable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('[data-slide-canvas]')).toBeVisible();
      if (viewport.width > 900) {
        await expect(page.getByTestId('sdlora-direction-magnitude-core')).toBeVisible();
      } else {
        await expect(page.locator('[data-flow-node="update-mobile"]')).toBeVisible();
      }
    });
  }
}

test('desktop mechanism canvas is 16:9 and can be reused as one slide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const box = await page.locator('[data-slide-canvas]').boundingBox();
  expect(box).not.toBeNull();
  const ratio = box!.width / box!.height;
  expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.02);
  expect(box!.height).toBeLessThanOrEqual(650);
  const slideContainment = await page.locator('[data-slide-canvas]').evaluate((node) => ({
    scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
    scrollHeight: node.scrollHeight, clientHeight: node.clientHeight,
  }));
  expect(slideContainment.scrollWidth).toBeLessThanOrEqual(slideContainment.clientWidth + 2);
  expect(slideContainment.scrollHeight).toBeLessThanOrEqual(slideContainment.clientHeight + 2);
});
