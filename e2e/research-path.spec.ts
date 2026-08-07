import { expect, test } from '@playwright/test';

test('homepage leads with the research workspace entry and an accessible theme toggle', async ({ page }) => {
  await page.goto('./');

  // V2 首页：任务入口 CTA 指向研究工作台，三条研究路径可见。
  await expect(page.getByRole('link', { name: '开始设计实验' })).toHaveAttribute('href', /\/workspace\/$/);
  await expect(page.getByRole('heading', { name: '按你的复现目标选路径' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '从场景直接开始' })).toBeVisible();
  await expect(page.locator('a.scenario-card').first()).toHaveAttribute('href', /\/workspace\/\?v=2/);

  const themeToggle = page.locator('[data-theme-toggle]').first();
  const before = await themeToggle.getAttribute('aria-pressed');
  await themeToggle.click();
  await expect(themeToggle).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
});

test('landscape prototype loads both code-split chart engines', async ({ page }) => {
  await page.goto('landscape/');

  await expect(page.locator('.landscape-chart svg')).toBeVisible();
  await page.getByRole('button', { name: 'D3', exact: true }).click();
  await expect(page.locator('.landscape-d3 svg')).toBeVisible();
});

test('model explorer exposes quick filters and a comparison entry point', async ({ page }) => {
  await page.goto('models/');

  const rlFilter = page.getByRole('button', { name: '适合 RL', exact: true });
  await expect(rlFilter).toHaveAttribute('aria-pressed', 'false');
  await rlFilter.click();
  await expect(rlFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/models\/\?rl=true$/);
  await expect(page.locator('.model-card')).not.toHaveCount(0);
  await expect(page.locator('.active-filter-chip').first()).toContainText('适合 RL');

  await page.getByRole('tab', { name: '数据', exact: true }).click();
  await expect(page.locator('.model-data-table')).toBeVisible();
  await page.getByRole('tab', { name: '时间线', exact: true }).click();
  await expect(page.locator('.model-timeline')).toBeVisible();
  await page.getByRole('tab', { name: '决策', exact: true }).click();

  const compareLink = page.locator('.model-card').first().getByRole('link', { name: /加入模型对比/ });
  await expect(compareLink).toHaveAttribute('href', /\/compare\/\?models=.+/);
});

test('comparison restores selected models, groups fields, and filters differences', async ({ page }) => {
  await page.goto('compare/?models=qwen3-8b,gpt-oss-20b');

  await expect(page.locator('.picker-item input:checked')).toHaveCount(2);
  await expect(page.locator('.comparison-group')).toHaveCount(10);
  const allRows = page.locator('.comparison-table tbody tr:not(.comparison-group)');
  const allRowCount = await allRows.count();

  const onlyDifferences = page.getByRole('checkbox', { name: '只看差异' });
  await onlyDifferences.check();
  await expect.poll(() => allRows.count()).toBeLessThan(allRowCount);
  await page.getByRole('checkbox', { name: '只看影响研究选择' }).check();
  await expect(page).toHaveURL(/impact=1/);
  await expect(page.getByRole('button', { name: '复制 Markdown' })).toBeVisible();
  await expect(page.getByRole('button', { name: '下载 CSV' })).toBeVisible();

  const extraModel = page.locator('.picker-item').filter({ hasText: 'GPT-5.2' }).locator('input');
  await extraModel.check();
  await expect(page).toHaveURL(/gpt-5-2/);
});

test('English routes preserve the base path and active navigation state', async ({ page }) => {
  await page.goto('en/models/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText('Models');
  await expect(page.getByRole('link', { name: 'Switch to Chinese' })).toHaveAttribute('href', '/basemodel/models/');
});

test('English workspace exposes the same task builder shell', async ({ page }) => {
  await page.goto('en/workspace/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: /persistent research workbench/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '1. Research goal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Strict reproduction' })).toBeVisible();
});

test('model detail leads with research summary and access ladder', async ({ page }) => {
  await page.goto('models/qwen3-8b/');

  await expect(page.locator('.research-summary')).toBeVisible();
  await expect(page.locator('.access-ladder')).toBeVisible();
  await expect(page.locator('.claim-evidence-panel')).toBeVisible();
  await expect(page.locator('.claim-empty')).toBeVisible();
  await expect(page.locator('.access-ladder-step')).toHaveCount(6);
  await expect(page.locator('body')).not.toContainText('architecture.active_parameters_b');
  await expect(page.locator('body')).not.toContainText('research.verl_recipe_available');
  await expect(page.locator('body')).not.toContainText('openness.weights_available');
});

test('model detail renders field claims when source links exist', async ({ page }) => {
  await page.goto('models/kimi-k3/');

  await expect(page.locator('.claim-evidence-panel')).toBeVisible();
  await expect(page.locator('.claim-row').first()).toBeVisible();
  await expect(page.locator('.claim-level').first()).toContainText(/一手来源|first-party/i);
  await expect(page.locator('.semantic-status').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('access.api_status');
});

test('paper detail starts a research mode and shows recorded role topology', async ({ page }) => {
  await page.goto('papers/agentbench/');

  await expect(page.locator('.reproduction-summary')).toBeVisible();
  await expect(page.locator('.reproduction-summary')).toContainText('尚未核验');
  await expect(page.locator('.paper-role-diagram')).toBeVisible();
  await expect(page.locator('.role-node').first()).toBeVisible();
  const strictLink = page.getByRole('link', { name: '严格复现' });
  await expect(strictLink).toHaveAttribute('href', /workspace\/\?v=2&mode=strict&paper=agentbench/);
  await expect(page.locator('body')).not.toContainText('paper.models');
});

test('family page exposes timeline filters', async ({ page }) => {
  await page.goto('families/');

  await expect(page.locator('.family-timeline')).toBeVisible();
  await expect(page.getByRole('button', { name: '只看当前代' })).toBeVisible();
  await page.getByRole('button', { name: '只看当前代' }).click();
  await expect(page.getByRole('button', { name: '只看当前代' })).toHaveAttribute('aria-pressed', 'true');
});

test('global command search finds models and papers', async ({ page }) => {
  await page.goto('models/');

  await page.getByRole('button', { name: '搜索' }).click();
  const search = page.getByRole('searchbox', { name: '搜索模型、alias、厂商、家族或论文…' });
  await search.fill('qwen3-8b');
  await expect(page.locator('.command-results a').first()).toHaveAttribute('href', /models\/qwen3-8b/);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('compare tray is keyboard reachable and keeps a shareable models URL', async ({ page }) => {
  await page.goto('models/');

  const card = page.locator('.model-card').first();
  await card.getByRole('button', { name: '加入对比' }).click();
  const tray = page.locator('.compare-tray');
  await expect(tray).toBeVisible();
  const openCompare = tray.getByRole('link', { name: '打开对比' });
  await expect(openCompare).toHaveAttribute('href', /\/compare\/\?models=.+/);
  await openCompare.focus();
  await expect(openCompare).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/compare\/\?models=.+/);
});

test('mobile navigation exposes the current page after opening the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('compare/');

  const menuToggle = page.getByRole('button', { name: '打开菜单' });
  await expect(menuToggle).toBeVisible();
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await expect(page.locator('.mobile-menu a[aria-current="page"]')).toHaveText('对比');
});
