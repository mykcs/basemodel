import { expect, test } from '@playwright/test';

test('homepage is progressive and uses live research counts', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '你现在正在做什么？' })).toBeVisible();
  await expect(page.getByRole('link', { name: /复现一篇论文/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /设计一个新实验/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /替换一个旧模型/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /先学习基础知识/ })).toHaveAttribute('href', '/guide/');
  await expect(page.getByText('这些数字由当前目录和研究规则实时计算，不是演示占位符。')).toBeVisible();
});

test('model decision view starts from research meaning and research-first filters', async ({ page }) => {
  await page.goto('/models/');
  await expect(page.getByRole('heading', { name: '当前开放权重研究候选' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '当前 API / 托管模型' })).toBeVisible();
  const filterButton = page.locator('.filter-button');
  await filterButton.click();
  await expect(page.getByRole('button', { name: '研究约束' })).toBeVisible();
  await expect(page.getByRole('button', { name: '目录属性' })).toBeVisible();
  await page.getByRole('button', { name: '目录属性' }).click();
  await expect(page.locator('.filter-panel').getByText('厂商', { exact: true })).toBeVisible();
});

test('Qwen current state separates API and open-weight generations', async ({ page }) => {
  await page.goto('/data-status/');
  const qwenRow = page.getByRole('row').filter({ hasText: 'Qwen' });
  await expect(qwenRow).toContainText('Qwen3.7');
  await expect(qwenRow).toContainText('qwen3-7-max');
  await expect(qwenRow).toContainText('qwen3-6-35b-a3b');
  await page.goto('/models/qwen3-7-max/');
  await expect(page.getByRole('heading', { name: 'Qwen3.7-Max' }).first()).toBeVisible();
});

test('SEED exposes the released checkpoint through corrected evidence', async ({ page }) => {
  await page.goto('/papers/seed/');
  await expect(page.locator('a[href*="Seed-AlfWorld-3B"]').first()).toBeVisible();
});

test('paper cards distinguish evidence completeness, experiment burden, and provenance', async ({ page }) => {
  await page.goto('/papers/');
  await expect(page.getByText(/复现资料/).first()).toBeVisible();
  await expect(page.getByText(/实验负担/).first()).toBeVisible();
  await expect(page.getByText(/Atlas (推导|估算)/).first()).toBeVisible();
  await expect(page.getByText('高级视图：论文—模型关系矩阵')).toBeVisible();
});

test('guide is organized into four research-decision chapters', async ({ page }) => {
  await page.goto('/guide/');
  await expect(page.getByRole('heading', { name: '1. 我到底在选什么？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '2. 我到底能不能使用它？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '3. 我的实验会怎么改变模型？' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '4. 我怎么保证论文可比？' })).toBeVisible();
});

test('decision memo presents a readable report before Markdown source', async ({ page }) => {
  await page.goto('/workspace/?v=2&mode=new&update=none&open=1');
  await expect(page.locator('.memo-readable')).toBeVisible();
  await expect(page.locator('.memo-source-preview')).toBeVisible();
  await expect(page.locator('.memo-source-preview')).not.toHaveAttribute('open', '');
});

test('hardening remains usable at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/models/');
  await expect(page.getByRole('heading', { name: '当前开放权重研究候选' })).toBeVisible();
  await page.goto('/guide/');
  await expect(page.getByRole('heading', { name: '1. 我到底在选什么？' })).toBeVisible();
});
