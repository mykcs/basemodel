import { expect, test } from '@playwright/test';

const routes = {
  zh: '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/',
  en: '/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/',
} as const;

test('Vanilla SD-LoRA page exposes the real round mechanism and scientific boundary', async ({ page }) => {
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('vanilla-sd-lora-mechanism');
  await expect(body).toBeVisible();
  await expect(page.locator('h1')).toContainText('Vanilla SD-LoRA');
  await expect(body).toContainText('16 个任务 × 每题 8 次');
  await expect(body).toContainText('每个任务最早一条通过全部检查的完整成功');
  await expect(body).toContainText('容量受限的旧经验回放');
  await expect(body).toContainText('旧方向');
  await expect(body).toContainText('全部幅度');
  await expect(body).toContainText('ΔWₜ = Σ αᵢDᵢ');
  await expect(body).toContainText('paper_equivalent=false');
  await expect(body).toContainText('rehearsal_free=false');
  await expect(body).toContainText('这些是需要测的风险，不是当前已经证明的故障原因');
});

test('English route preserves the mechanism and boundary', async ({ page }) => {
  await page.goto(routes.en, { waitUntil: 'domcontentloaded' });
  const body = page.getByTestId('vanilla-sd-lora-mechanism');
  await expect(page.locator('h1')).toContainText('One Vanilla SD-LoRA update round');
  await expect(body).toContainText('16 tasks × 8');
  await expect(body).toContainText('Earliest fully checked success per task');
  await expect(body).toContainText('Old directions');
  await expect(body).toContainText('All magnitudes');
  await expect(body).toContainText('risks to measure, not causes already proven');
});

test('desktop canvas carries real routed topology instead of card adjacency', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
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
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
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
  await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
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
      await page.goto(routes.zh, { waitUntil: 'domcontentloaded' });
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

for (const [locale, route] of Object.entries(routes)) {
  test(`desktop ${locale} mechanism canvas is 16:9 and can be reused as one slide`, async ({ page }) => {
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
}
