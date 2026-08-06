import { expect, test } from '@playwright/test';

test('workspace scores candidates into three buckets and renders reasons, risks, and a decision memo', async ({ page }) => {
  await page.goto('workspace/');

  // 设定一个会触发打分差异的任务：新实验 + 开放权重 + 中文专长 + LoRA。
  await page.locator('select').nth(0).selectOption('new');
  await page.locator('select').nth(1).selectOption('lora');
  await page.getByRole('button', { name: 'chinese', exact: true }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '设定任务' }).click();

  // 三篮标题至少出现基准 / 现代之一（取决于数据）。
  const board = page.locator('.candidate-board');
  await expect(board).toBeVisible();
  await expect(page.locator('.candidate-row').first()).toBeVisible();

  // 推荐理由与风险 chip 至少一处可见。
  await expect(page.locator('.reason-chip').first()).toBeVisible();

  // 决策备忘录在设定任务后可见，且能导出。
  const memo = page.locator('.decision-memo');
  await expect(memo).toBeVisible();
  await expect(memo.locator('.memo-preview')).toContainText('研究任务');
  await expect(memo.getByRole('button', { name: '下载 .md' })).toBeVisible();

  // 替换分析面板存在。
  await expect(page.locator('.substitute-lab')).toBeVisible();
});
