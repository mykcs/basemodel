import { expect, test, type Page } from '@playwright/test';

const path = '/research/seed-openevo/study/capability-exploration/';

async function enterCurrentStage2(page: Page) {
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await tree.locator('[data-stage1="current"]').click();
  await tree.locator('[data-analysis="current-state"]').click();
  await expect(tree.locator('[data-enter-stage2]')).toBeVisible();
  await tree.locator('[data-enter-stage2]').click();
  await expect(tree.locator('[data-floor="stage1"]')).toBeHidden();
  await expect(tree.locator('[data-floor="stage2"]')).toBeVisible();
  return tree;
}

test('future route silhouettes are visible before they unlock, and selected nodes become fully opaque', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  const stage1 = tree.locator('[data-stage1="current"]');
  const analysis = tree.locator('[data-step="analysis"]');
  const exit = tree.locator('[data-step="floor-exit"]');

  await expect(analysis).toBeVisible();
  await expect(analysis).toHaveAttribute('data-preview-state', 'preview');
  await expect(exit).toBeVisible();
  expect(Number(await stage1.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
  expect(Number(await analysis.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.5);
  expect(await analysis.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');

  await stage1.click();
  await expect(stage1).toHaveCSS('opacity', '1');
  await expect(analysis).toHaveAttribute('data-preview-state', 'active');
  const currentAnalysis = tree.locator('[data-analysis="current-state"]');
  expect(Number(await currentAnalysis.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);

  await currentAnalysis.click();
  await expect(currentAnalysis).toHaveCSS('opacity', '1');
  await expect(exit).toHaveAttribute('data-preview-state', 'active');
});

test('MiniMax runtime comparison is an optional side study, not a Stage-2 gate', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  const study = tree.locator('[data-runtime-study]');

  await tree.locator('[data-stage1="current"]').click();
  await expect(study).toHaveAttribute('data-preview-state', 'preview');
  await tree.locator('[data-analysis="current-state"]').click();
  await expect(study).toHaveAttribute('data-preview-state', 'active');

  await tree.locator('[data-analysis-runtime="server"]').click();
  await expect(tree.locator('[data-runtime-detail-panel="server"]')).toBeVisible();
  await expect(tree.locator('[data-selected-path-text]')).toContainText('服务器 CPU');

  await tree.locator('[data-analysis-runtime="kaggle"]').click();
  await expect(tree.locator('[data-runtime-detail-panel="kaggle"]')).toBeVisible();
  await expect(tree.locator('[data-selected-path-text]')).toContainText('Kaggle CPU');
});

test('Stage 1 is floor one and entering Stage 2 changes the map', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await expect(tree.locator('[data-floor="stage1"]')).toBeVisible();
  await expect(tree.locator('[data-floor="stage2"]')).toBeHidden();
  await enterCurrentStage2(page);
});
test('historical Stage 2 shows its zero-update outcome before the repair gate', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const original = page.url();
  const tree = page.getByTestId('openevo-capability-experiment-tree');
  await tree.locator('[data-stage1="old"]').click();
  await tree.locator('[data-analysis="old-7b-self"]').click();
  await tree.locator('[data-enter-stage2]').click();
  await tree.locator('[data-stage2="legacy"]').click();

  const bug = tree.locator('[data-bug="legacy-gate"]');
  const outcome = tree.locator('[data-ending-from-old]');
  const repairColumn = tree.locator('[data-old-successor]');
  await expect(bug).toBeVisible();
  await expect(bug).toContainText('至少 8 个重复成功任务');
  await expect(bug).toContainText('7 < 8');
  await expect(bug).toContainText('没有任何完整数据块触发参数更新');
  await expect(outcome).toBeVisible();
  await expect(outcome).not.toHaveAttribute('hidden', '');
  await expect(repairColumn).toHaveAttribute('data-preview-state', 'preview');

  // The historical result belongs to the failed run itself; it does not require repairing the rule first.
  await outcome.click();
  const story = tree.locator('[data-story="old-7b-self"]');
  await expect(story).toBeVisible();
  await expect(story).toContainText('7 / 8');
  await expect(story).toContainText('797');
  await expect(story).toContainText('0 次更新');
  expect(page.url()).toBe(original);

  // Repairing the bug is a separate continuation action for successor designs.
  await bug.click();
  await expect(repairColumn).toHaveAttribute('data-preview-state', 'active');
  const repair = tree.locator('[data-repair="legacy-gate"]');
  await repair.click();
  await expect(repair).toHaveClass(/rogue-node--resolved/);
});

test('Ceiling-1.0 and OpenEVO 2.0 use separate arrows and separate next nodes', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const tree = await enterCurrentStage2(page);
  const ceilingArrow = tree.locator('[data-current-map-arrow="ceiling"]');
  const evo2Arrow = tree.locator('[data-current-map-arrow="evo2"]');
  const ceilingOutcome = tree.locator('[data-current-outcome-slot="ceiling"]');
  const evo2Outcome = tree.locator('[data-current-outcome-slot="evo2"]');

  await expect(ceilingArrow).toHaveAttribute('data-preview-state', 'preview');
  await expect(evo2Arrow).toHaveAttribute('data-preview-state', 'preview');
  await expect(ceilingOutcome).toHaveAttribute('data-preview-state', 'preview');
  await expect(evo2Outcome).toHaveAttribute('data-preview-state', 'preview');

  const rowCenters = await tree.locator('[data-stage2-branch="current"]').evaluate((board) => {
    const center = (el: Element | null) => {
      if (!el) return Number.NaN;
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    return {
      ceilingNode: center(board.querySelector('[data-stage2="ceiling"]')),
      ceilingArrow: center(board.querySelector('[data-current-map-arrow="ceiling"]')),
      evo2Node: center(board.querySelector('[data-stage2="evo2"]')),
      evo2Arrow: center(board.querySelector('[data-current-map-arrow="evo2"]')),
    };
  });
  expect(Math.abs(rowCenters.ceilingNode - rowCenters.ceilingArrow)).toBeLessThan(3);
  expect(Math.abs(rowCenters.evo2Node - rowCenters.evo2Arrow)).toBeLessThan(3);
  expect(Math.abs(rowCenters.ceilingArrow - rowCenters.evo2Arrow)).toBeGreaterThan(70);

  await tree.locator('[data-stage2="ceiling"]').click();
  await expect(ceilingArrow).toHaveAttribute('data-preview-state', 'active');
  await expect(evo2Arrow).toHaveAttribute('data-preview-state', 'preview');
  await expect(ceilingOutcome).toHaveAttribute('data-preview-state', 'active');
  await expect(evo2Outcome).toHaveAttribute('data-preview-state', 'preview');
  await expect(ceilingOutcome).toContainText('继续 7B 训练');

  await tree.locator('[data-stage2="evo2"]').click();
  await expect(ceilingArrow).toHaveAttribute('data-preview-state', 'preview');
  await expect(evo2Arrow).toHaveAttribute('data-preview-state', 'active');
  await expect(ceilingOutcome).toHaveAttribute('data-preview-state', 'preview');
  await expect(evo2Outcome).toHaveAttribute('data-preview-state', 'active');
  await expect(evo2Outcome).toContainText('Harness 2.0.1 · Mechanical PASS');
  await expect(evo2Outcome).not.toContainText('继续 7B 训练');
});

test('OpenEVO 2.0 shows Harness 2.0.1 mechanical PASS and locks readiness instead', async ({ page }) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const original = page.url();
  const tree = await enterCurrentStage2(page);
  await tree.locator('[data-stage2="evo2"]').click();
  await expect(tree.locator('[data-evo2-gate]')).toBeVisible();
  const harness201 = tree.locator('[data-harness201-status]');
  await expect(harness201).toBeVisible();
  await expect(harness201).toContainText('Harness 2.0.1 · Mechanical PASS');
  await expect(harness201).toContainText('HOLD_FOR_STAGE2_READINESS_AUDIT');
  const readiness = tree.locator('[data-readiness-gate]');
  await expect(readiness).toBeVisible();
  await expect(readiness).toBeDisabled();
  await expect(readiness).toContainText('readiness audit');
  await expect(readiness).toContainText('BLOCKED_HARNESS_READINESS');
  await tree.locator('[data-ending="evo2"]').click();
  await expect(tree.locator('[data-story="evo2"]')).toBeVisible();
  expect(page.url()).toBe(original);
});
for (const viewport of [
  { name: 'iphone-375', width: 375, height: 812 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-430', width: 430, height: 932 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${viewport.name}-${theme} keeps roguelike floors readable`, async ({ page }) => {
      await page.addInitScript((nextTheme) => localStorage.setItem('atlas-theme', nextTheme), theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const tree = await enterCurrentStage2(page);
      await tree.locator('[data-stage2="evo2"]').click();
      const geometry = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(tree.locator('[data-evo2-gate]')).toBeVisible();
    });
  }
}
