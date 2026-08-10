import { expect, test } from '@playwright/test';

test('home starts from three research intents and a live example', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { name: '你现在正在做什么？' })).toBeVisible();
  await expect(page.locator('.intent-row')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /先学习基础知识/ })).toHaveAttribute('href', /\/guide\//);
  await expect(page.locator('.example-card')).toContainText('数字由当前模型目录和推荐规则实时计算');
  await expect(page.locator('.home-scenarios-advanced')).not.toHaveAttribute('open', '');
});

test('model explorer puts research constraints before catalog metadata', async ({ page }) => {
  await page.goto('models/');
  await page.locator('.filter-button').click();
  await expect(page.getByRole('button', { name: '研究约束' })).toBeVisible();
  await expect(page.getByText('当前开放权重研究候选')).toBeVisible();
  await expect(page.getByText('当前 API / 托管模型')).toBeVisible();
  await page.getByRole('button', { name: '目录属性' }).click();
  await expect(page.locator('.filter-panel')).toContainText('厂商');
});

test('SEED shows the released checkpoint as available', async ({ page }) => {
  await page.goto('papers/seed/');
  const reproduction = page.locator('.reproduction-summary');
  await expect(reproduction).toBeVisible();
  const checkpointRow = reproduction.locator('.reproduction-item').filter({ hasText: 'Checkpoint' });
  await expect(checkpointRow).toContainText('可用');
  await expect(page.locator('a[href="https://huggingface.co/Jinyang23/Seed-AlfWorld-3B"]')).toBeVisible();
});

test('paper explorer distinguishes evidence completeness and Atlas heuristics', async ({ page }) => {
  await page.goto('papers/');
  await expect(page.locator('.paper-case-card').first()).toBeVisible();
  await expect(page.locator('.paper-case-grid')).toContainText(/复现资料/);
  await expect(page.locator('.paper-case-grid')).toContainText(/Atlas (推导|估算)/);
  await expect(page.locator('.paper-matrix-advanced')).toBeVisible();
  await expect(page.locator('.paper-matrix-advanced')).not.toHaveAttribute('open', '');
});

test('guide teaches concepts in four decision chapters', async ({ page }) => {
  await page.goto('guide/');
  await expect(page.locator('.guide-decision-chapters')).toBeVisible();
  await expect(page.locator('.guide-chapter')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: '我到底在选什么？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '我到底能不能使用它？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '我的实验会怎么改模型？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '我怎么保证论文可比？' })).toBeVisible();
});

test('decision memo presents readable research sections before Markdown source', async ({ page }) => {
  await page.goto('workspace/?v=2&mode=method&paper=seed&model=qwen2-5-3b-instruct&role=actor&roles=actor%2Canalyzer&update=rl&access=local&runtime=verl&open=1');
  await expect(page.locator('.memo-readable')).toBeVisible();
  await expect(page.locator('.memo-source-preview')).toBeVisible();
  await expect(page.locator('.memo-source-preview')).not.toHaveAttribute('open', '');
});

test('data status separates hosted/API and open-weight current models', async ({ page }) => {
  await page.goto('data-status/');
  await expect(page.getByText('托管 / API 当前模型')).toBeVisible();
  await expect(page.getByText('开放权重当前模型')).toBeVisible();
});

test('landscape defaults to learning mode and keeps the accessible table', async ({ page }) => {
  await page.goto('landscape/');
  await expect(page.locator('.landscape-learning-list')).toBeVisible();
  await expect(page.getByRole('button', { name: '学习视图' })).toHaveClass(/is-active/);
  await expect(page.locator('.accessible-landscape')).toBeVisible();
});

test('hardening remains usable at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('guide/');
  await expect(page.locator('.guide-chapter').first()).toBeVisible();
  await page.goto('models/');
  await expect(page.locator('.explorer-shell')).toBeVisible();
  await page.goto('papers/');
  await expect(page.locator('.paper-case-card').first()).toBeVisible();
});

test('English guide and model explorer expose the same decision hierarchy', async ({ page }) => {
  await page.goto('en/guide/');
  await expect(page.getByRole('heading', { name: 'What exactly am I choosing?' })).toBeVisible();
  await page.goto('en/models/');
  await page.locator('.filter-button').click();
  await expect(page.getByRole('button', { name: 'Research constraints' })).toBeVisible();
  await expect(page.getByText('Current open-weight research candidates')).toBeVisible();
});
