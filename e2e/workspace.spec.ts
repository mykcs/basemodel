import { expect, test } from '@playwright/test';

test('workspace scores candidates into three buckets and renders reasons, risks, and a decision memo', async ({ page }) => {
  await page.goto('workspace/');

  // 设定一个会触发打分差异的任务：新实验 + 开放权重 + 中文专长 + LoRA。
  await page.getByRole('button', { name: /全新实验/ }).click();
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.getByRole('button', { name: '执行者', exact: true }).click();
  await page.locator('.task-step select').selectOption('lora');
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.getByLabel('单卡显存（GB）').fill('24');
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.getByLabel('只考虑开放权重').check();
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.getByRole('button', { name: '中文能力', exact: true }).click();
  await page.getByRole('button', { name: '设定研究任务', exact: true }).click();

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
  await expect(memo.getByRole('button', { name: '下载 JSON' })).toBeVisible();

  // 替换分析面板存在。
  await expect(page.locator('.substitute-lab')).toBeVisible();
  await page.locator('#substitute-base').selectOption({ index: 1 });
  await expect(page.locator('.substitute-card').first()).toBeVisible();
  await expect(page.locator('.substitute-card').first().locator('thead')).toContainText('影响');

  // 离开工作台后，模型浏览器仍读取同一研究任务，并显示任务匹配状态。
  await page.goto('models/');
  await expect(page.locator('.task-fit').first()).toBeVisible();
  await expect(page.locator('.task-fit').first()).toContainText('当前任务匹配');

  await page.goto('models/qwen3-8b/');
  await expect(page.locator('.detail-task-fit')).toBeVisible();
  await expect(page.locator('.detail-task-actions').getByRole('button', { name: '加入候选' })).toBeVisible();
});

test('mobile workspace switches between task, candidate, evidence, and compare panes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('workspace/');

  const nav = page.locator('.workspace-mobile-nav');
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button', { name: '候选' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.workspace-pane-candidates')).toBeVisible();
  await expect(page.locator('.workspace-pane-task')).not.toBeVisible();

  await nav.getByRole('button', { name: '任务' }).click();
  await expect(page.locator('.workspace-pane-task')).toBeVisible();
  await expect(page.locator('.workspace-pane-candidates')).not.toBeVisible();

  await nav.getByRole('button', { name: '证据' }).click();
  await expect(page.locator('.workspace-pane-evidence')).toBeVisible();
  await nav.getByRole('button', { name: '对比' }).click();
  await expect(page.locator('.workspace-pane-compare')).toBeVisible();
});

test('mobile candidate quick view opens a native dialog and supports Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('workspace/?v=2&mode=modern');

  await page.locator('.candidate-row').first().getByRole('button', { name: '一眼概览' }).click();
  await expect(page.locator('.quick-view-dialog[open]')).toBeVisible();
  await expect(page.locator('.quick-view-dialog')).toContainText('开放权重');
  await page.keyboard.press('Escape');
  await expect(page.locator('.quick-view-dialog[open]')).toHaveCount(0);
});
