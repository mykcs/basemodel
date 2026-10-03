import { expect, test } from '@playwright/test';

const route = '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/';

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`same-panel scientific table keeps the frozen Final readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-effective-state-gdr-page]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('OpenEVO 参数演变：Bounded State 与 β 组件');

    const firstResult = page.locator('.paper__first-result');
    await expect(firstResult).toBeVisible();
    await expect(firstResult).toContainText('60.72');
    await expect(firstResult).toContainText('45.98');
    await expect(firstResult).toContainText('20.77');

    const table = page.locator('[data-scientific-table="same-panel-final"]');
    await expect(table).toBeVisible();
    await expect(table.locator('[data-row-id="directapply"]')).toContainText('60.72');
    await expect(table.locator('[data-row-id="bounded"]')).toContainText('45.98');
    await expect(table.locator('[data-row-id="beta"]')).toContainText('20.77');
    await expect(table.locator('[data-row-id="dynamic-alpha-beta"]')).toContainText('—');
    await expect(table).not.toContainText('SEED');

    const reference = page.locator('.paper-table__external-reference');
    await expect(reference).toContainText('SEED');
    await expect(reference).toContainText('87.1');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('same-panel table contains only the local frozen-panel rows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const table = page.locator('[data-scientific-table="same-panel-final"]');
  const rows = table.locator('tbody tr[data-row-id]');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toContainText('普通 OpenEVO');
  await expect(rows.nth(1)).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(rows.nth(2)).toContainText('β-gating');
  await expect(rows.nth(3)).toContainText('dynamic α + dynamic β');
  await expect(rows.nth(3)).toContainText('—');
  await expect(page.locator('.paper-table__external-reference')).toContainText('不是本页三条 OpenEVO 最终模型共用的同一冻结 128 题');
});

test('same-panel table uses native semantics and keeps scientific boundary notes adjacent', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const table = page.locator('[data-scientific-table="same-panel-final"]');
  await expect(table.locator('caption')).toContainText('同一冻结 128 题 Final');
  await expect(table.getByRole('columnheader')).toHaveCount(6);
  await expect(table.locator('.scientific-table__caption')).toContainText('DirectApply 是更早独立完成的历史前驱');
  await expect(table.locator('.scientific-table__caption')).toContainText('dynamic α + dynamic β 尚未运行');
});

test('paper narrative follows motivation, method, mapping, experiment, result, and analysis', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const h2s = await page.locator('.paper__section > h2').allTextContents();
  expect(h2s.slice(0, 5)).toEqual([
    '我们先解决 SD-LoRA 越训练越慢',
    'Bounded State 与 β 组件：固定容量与写入强度控制',
    '实验设置：Qwen3-1.7B × WebShop',
    '实验结果：Task Score、成功率与计算代价',
    '训练过程中发生了什么？从 loss 到行为变化',
  ]);
});

test('method section explains source Gated Delta and the beta-gating alpha-one parameter mapping', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const method = page.locator('#method');
  await expect(method.locator('[data-math-formula]')).toHaveCount(7);
  await expect(method.locator('.katex').first()).toBeVisible();
  await expect(method).toContainText('Compress');
  await expect(method).toContainText('rank128 不是理论最优值');
  await expect(method).toContainText('78 个方向');
  await expect(method).toContainText('rank95 · median');
  await expect(method).toContainText('8');
  await expect(method).toContainText('7');
  await expect(method).toContainText('Gated Delta 在这个更新上再加入两个控制量');
  await expect(method).toContainText('α');
  await expect(method).toContainText('β');
  await expect(method).toContainText('我们把更新规则映射到 OpenEVO 参数 State');
  await expect(method).toContainText('A↦sA');
  await expect(method).toContainText('1.052');
  await expect(method).toContainText('657.836');
  await expect(method).toContainText('22 维不是把整个 rank128 State 压成 22 个数字');
  await expect(method).toContainText('reward、Task Score、Task Vector');
  await expect(method).toContainText('本实验真正启用的动态控制量');
  await expect(method).toContainText('α=1');
  await expect(method).toContainText('并没有构造这样的 k / v 张量');
  await expect(method).toContainText('β 来自离线训练、正式运行时冻结的 controller');
  await expect(method).toContainText('R0 / R24 / R46 / R91');
  await expect(method).toContainText('R114');
  await expect(method).toContainText('R136');
  await expect(method).toContainText('22 → 64 → 64 → 1');
  await expect(method).toContainText('最佳 epoch');
  await expect(method).toContainText('48');
  await expect(method).toContainText('Spearman = 0.978');
  await expect(method).toContainText('model.eval() + torch.no_grad()');
  await expect(method).toContainText('没有一个“最后学出来的 β”');
  await expect(method).toContainText('1.94e-20');
  await expect(method).toContainText('4.40e-3');
  await expect(method).toContainText('16,537');
  await expect(method).toContainText('1,053,394');
  await expect(method).toContainText('β 控制器训练代码');
  await expect(method).toContainText('正式实验 β runtime');
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
  await expect(setup).toContainText('SEED 论文路线：trajectory → hindsight skill → SFT');
  await expect(setup).toContainText('Stage 1 OPSD 参数学习 → OPSD bootstrap');
});

test('experiment setup exposes the four carrier update ledgers and the NOOP/runtime-use boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const ledger = page.locator('#carrier-ledger');
  await expect(ledger.getByRole('heading', { level: 3 })).toContainText('随着 rollout 积累，参数和非参数状态都会在满足条件时更新');
  const rows = ledger.locator('.paper-table--carrier-ledger tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toContainText('159 次更新');
  await expect(rows.nth(0)).toContainText('158 次更新');
  await expect(rows.nth(0)).toContainText('154 次更新');
  await expect(rows.nth(1)).toContainText('2 次更新');
  await expect(rows.nth(1)).toContainText('3 次更新');
  await expect(rows.nth(2)).toContainText('1 次更新');
  await expect(rows.nth(2)).toContainText('0 次更新');
  await expect(rows.nth(3)).toContainText('3 次更新');
  await expect(rows.nth(3)).toContainText('0 次更新');
  await expect(ledger).toContainText('这里不是“让 LM 自己决定要不要更新”');
  await expect(ledger).toContainText('deterministic eligibility gate');
  await expect(ledger).toContainText('validator');
  await expect(ledger).toContainText('one repair');
  await expect(ledger).toContainText('“2 个任务 / 3 个任务”描述的是这次冻结 evidence builder 实际采用的门槛');
  await expect(ledger).toContainText('不应该读成 OpenEVO 的理论常数');
  await expect(ledger.getByRole('link', { name: 'Carrier evidence gate' })).toHaveAttribute('href', /ceiling1_stage2_vnext_evidence\.py/);
  await expect(ledger).toContainText('“沿用上一轮”不等于“后续做题时不用它”');
  await expect(ledger).toContainText('42,270');
  await expect(ledger).toContainText('142,208');
  await expect(ledger).toContainText('175,820');
  await expect(ledger).toContainText('72 / 320 / 320');
  await expect(ledger).toContainText('22 / 320 / 320');
  await expect(ledger).toContainText('不能只凭这张 UPDATE 表把最终分数差归因给某一个载体');
  await expect(ledger.getByRole('link', { name: '普通 OpenEVO 载体对账' })).toHaveAttribute('href', /240c479bead0450def3feaaa2a169d9a2bc3934c/);
});

test('formal result preserves the matched-arm statistical boundary under public names', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const result = page.locator('#formal-result');
  await expect(result).toContainText('普通 OpenEVO');
  await expect(result).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(result).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α 固定为 1）');
  await expect(result).toContainText('WebShop Task Score · 160轮');
  await expect(result).toContainText('R0–19');
  await expect(result).toContainText('R140–159');
  await expect(result).toContainText('67.07');
  await expect(result).toContainText('64.33');
  await expect(result).toContainText('54.28');
  await expect(result).toContainText('R1–R159 mean reward');
  await expect(result).toContainText('R1–R159 exact success');
  await expect(result).toContainText('跨 0');
  await expect(result).toContainText('动态 α + 动态 β（未做）');
  await expect(result).toContainText('Task Score 不包含“成功率 + 合法性”');
  await expect(result).toContainText('won=true 且 task_score=1.0');
  await expect(result).toContainText('动作 / 解析合法性');
  await expect(result).toContainText('20 轮对应 2,560 次 rollout');
  await expect(result).toContainText('不是 continual-learning retention test');
  await expect(result.getByRole('link', { name: 'WebShop evaluator 定义' })).toHaveAttribute('href', /webshop_task_manifest\.py/);
  await expect(page.locator('#compute')).toContainText('31.09');
  await expect(page.locator('#compute')).toContainText('2.02');
  await expect(page.locator('#compute')).toContainText('2.35');
  await expect(page.locator('#compute')).toContainText('15.36×');
  await expect(page.locator('#compute')).toContainText('1.33×');
  const r200Extension = page.locator('#r200-extension');
  await expect(r200Extension).toContainText('继续到 200 轮以后发生了什么');
  await expect(r200Extension).toContainText('R160–R199');
  await expect(r200Extension).toContainText('5,120');
  await expect(r200Extension).toContainText('25,600');
  await expect(r200Extension).toContainText('40 UPDATE / 0 NOOP');
  await expect(r200Extension).toContainText('54.28');
  await expect(r200Extension).toContainText('59.51');
  await expect(r200Extension).toContainText('60.39');
  await expect(r200Extension).toContainText('R160 zero-replay');
  await expect(r200Extension).toContainText('R164 → R165 handoff');
  await expect(r200Extension).toContainText('R165–R199 Completion-First');
  await expect(r200Extension).toContainText('0 integrity failures');
  await expect(r200Extension).toContainText('final panel');
  await expect(r200Extension).toContainText('Final 0 · teacher 0');
  await expect(r200Extension.getByRole('img', { name: /R96 到 R199/ })).toBeVisible();
  await expect(r200Extension.getByRole('link', { name: 'R200 窗口分析 evidence →' })).toHaveAttribute('href', /bounded-beta-r200-analysis-20261001\.json/);
  await expect(r200Extension.getByRole('link', { name: 'R96–R199 逐轮 evidence →' })).toHaveAttribute('href', /bounded-beta-r200-round-series-20261001\.json/);
  await expect(r200Extension.getByRole('link', { name: 'R200 recovery \/ seal evidence →' })).toHaveAttribute('href', /bounded-beta-r200-control-plane-20261001\.json/);
});

test('analysis follows a simple-to-complex metric ladder with definition result and analysis in every subsection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const analysis = page.locator('#analysis');
  await expect(analysis.getByRole('heading', { level: 2 })).toContainText('训练过程中发生了什么？从 loss 到行为变化');

  const metricSteps = analysis.locator('.paper__metric-step');
  await expect(metricSteps).toHaveCount(6);
  const headings = await metricSteps.getByRole('heading', { level: 3 }).allTextContents();
  expect(headings).toEqual([
    '5.1 loss：训练有没有真的在拟合',
    '5.2 范数：长期 State 和本轮更新到底有多大',
    '5.3 Task Vector：参数更新大小和分数真的一起变吗',
    '5.4 谱与方向：不仅写了多少，还要看往哪里写',
    '5.5 输出长度与任务步数：单步输出和完整任务路径',
    '5.6 Entropy：最后看策略行为是不是越来越集中',
  ]);
  for (let index = 0; index < 6; index += 1) {
    const labels = metricSteps.nth(index).locator('.paper__metric-label');
    await expect(labels).toHaveCount(3);
    await expect(labels.nth(0)).toContainText('① 指标是什么');
    await expect(labels.nth(1)).toContainText('② 实验结果');
    await expect(labels.nth(2)).toContainText('③ 分析');
  }

  await expect(page.locator('#formal-result')).toContainText('W&B 原始 scalar 是 0–1');
  await expect(page.locator('#loss')).toContainText('1.046');
  await expect(page.locator('#loss')).toContainText('0.102');
  await expect(page.locator('#loss')).toContainText('0.065');
  await expect(page.locator('#loss')).toContainText('0.069');

  await expect(page.locator('#norms')).toContainText('21.051');
  await expect(page.locator('#norms')).toContainText('17.925');
  await expect(page.locator('#norms')).toContainText('0.889');

  await expect(page.locator('#task-vector')).toContainText('每条 160 个点');
  await expect(page.locator('#task-vector')).toContainText('横轴密度和 y 轴量程完全一致');
  await expect(page.locator('#task-vector')).toContainText('相关性统计只针对普通 OpenEVO');
  await expect(page.locator('body')).not.toContainText('\\n\\n');
  await expect(page.locator('#task-vector')).toContainText('0.597');
  await expect(page.locator('#task-vector')).toContainText('0.045');
  await expect(page.locator('#task-vector')).toContainText('-0.278');
  await expect(page.locator('#task-vector')).toContainText('+0.044');

  await expect(page.locator('#parameter-geometry')).toContainText('full/base spectral ratio');
  await expect(page.locator('#parameter-geometry')).toContainText('最强尺度变化很小');
  await expect(page.locator('#parameter-geometry')).toContainText('2.136');
  await expect(page.locator('#parameter-geometry')).toContainText('1.946');
  await expect(page.locator('#parameter-geometry')).toContainText('-0.287');
  await expect(page.locator('#parameter-geometry')).toContainText('20 轮窗口首尾 adapter 的净 State 位移');
  await expect(page.locator('#parameter-geometry')).toContainText('R140–159');
  await expect(page.locator('#parameter-geometry')).toContainText('净 State 位移');
  await expect(page.locator('#parameter-geometry')).toContainText('0.182');
  await expect(page.locator('#parameter-geometry')).toContainText('0.291');
  await expect(page.locator('#parameter-geometry')).toContainText('0.758');

  await expect(page.locator('#length')).toContainText('216.8');
  await expect(page.locator('#length')).toContainText('229.1');
  await expect(page.locator('#length')).toContainText('7.91');
  await expect(page.locator('#length')).toContainText('8.60');
  await expect(page.locator('#length')).toContainText('Task Score / 100');
  await expect(page.locator('#length')).toContainText('60.12');
  await expect(page.locator('#length')).toContainText('56.82');
  await expect(page.locator('#length')).toContainText('26.46');
  await expect(page.locator('#length')).toContainText('8.67');
  await expect(page.locator('#length')).toContainText('8.64');

  await expect(page.locator('#entropy')).toContainText('0.5826');
  await expect(page.locator('#entropy')).toContainText('0.3705');
  await expect(page.locator('#entropy')).toContainText('R159 click 占比');
  await expect(page.locator('#entropy')).toContainText('82.9%');
  await expect(page.locator('#entropy')).toContainText('87.7%');
  await expect(page.locator('#entropy')).toContainText('90.0%');
  await expect(page.locator('#entropy')).toContainText('100%');
  await expect(page.locator('#entropy')).toContainText('0.3535');
  await expect(page.locator('#entropy')).toContainText('0.3637');
  await expect(page.locator('#entropy')).toContainText('0.3653');
  await expect(page.locator('#analysis-boundary')).toContainText('把这些指标合起来后，我们能确定什么、还不能确定什么');
  await expect(page.locator('#analysis-boundary')).toContainText('还不能证明的');

  const next = page.locator('#next-question');
  await expect(next).toContainText('现在真正卡在哪里，以及下一步先做什么');
  await expect(next).toContainText('第一优先：补普通 SFT、普通 OPSD 与 SEED 1.7B 参照');
  await expect(next).toContainText('第二优先：直接做 rank 8 / 16 / 32 / 64 / 128 容量消融');
  await expect(next).toContainText('第三优先：先做最简单的 β scaling baseline');
  await expect(next).toContainText('R200 回答了“160 后还有没有变化”，但还没有给出最佳停止轮');
  await expect(next).toContainText('动态 α + 动态 β 仍然保留，但不是当前第一优先');
});

test('W&B evidence is embedded beside the relevant metric instead of collected in a separate gallery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const analysis = page.locator('#analysis');
  await expect(page.locator('#wandb')).toHaveCount(0);
  await expect(analysis.getByRole('link', { name: 'W&B Report（需要权限）', exact: true })).toHaveAttribute('href', /wandb\.ai/);
  await expect(analysis.getByRole('link', { name: /完整 W&B Workspace/ })).toHaveAttribute('href', /wandb\.ai/);

  const result = page.locator('#formal-result');
  const resultEvidence = result.locator('.metric-evidence');
  await expect(resultEvidence).toHaveCount(2);
  await expect(resultEvidence.nth(0).locator('img')).toHaveAttribute('src', /wandb-threeway\/task-score\.svg/);
  await expect(resultEvidence.nth(0).getByRole('link', { name: /打开 W&B Report/ }).last()).toHaveAttribute('href', /wandb\.ai\/.*reports/);
  await expect(resultEvidence.nth(1).locator('img')).toHaveAttribute('src', /bounded-beta-r200-task-score-r96-r199\.svg/);
  await expect(resultEvidence.nth(1).getByRole('link', { name: /打开 104 轮逐轮 evidence/ }).last()).toHaveAttribute('href', /bounded-beta-r200-round-series-20261001\.json/);
  await expect(result.locator('.paper__derived-figure img')).toHaveAttribute('src', /wandb-threeway\/task-score-20-round-mean\.svg/);

  const figures = analysis.locator('.metric-evidence');
  await expect(figures).toHaveCount(5);
  await expect(page.locator('#loss img')).toHaveAttribute('src', /wandb-threeway\/loss-vs-rollout\.svg/);
  await expect(page.locator('#loss').getByRole('link', { name: /打开 W&B Report/ }).last()).toHaveAttribute('href', /wandb\.ai\/.*reports/);
  await expect(page.locator('#task-vector img')).toHaveAttribute('src', /wandb-threeway\/task-vector-frobenius\.svg/);
  await expect(page.locator('#length img').first()).toHaveAttribute('src', /wandb-threeway\/tokens-per-step\.svg/);
  await expect(page.locator('#length img').nth(1)).toHaveAttribute('src', /wandb-threeway\/steps-per-episode\.svg/);
  await expect(page.locator('#entropy img')).toHaveAttribute('src', /wandb-threeway\/action-family-entropy\.svg/);
  for (let index = 1; index < 5; index += 1) {
    await expect(figures.nth(index).getByRole('link', { name: /打开 W&B 原生 panel/ }).last()).toHaveAttribute('href', /wandb\.ai/);
  }
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
  await expect(page.locator('.research-route-context')).toHaveCount(0);
  await expect(page.locator('.paper__kicker')).toHaveCount(0);
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('OpenEVO 参数演变：Bounded State 与 β 组件');
  const ablation = page.locator('[data-scientific-table="same-panel-final"]');
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
  await expect(evidence).toContainText('Bounded Online Recurrence + β-gating（α 固定为 1）');
  await expect(evidence).toContainText('动态 α + 动态 β');
  await expect(evidence).toContainText('DirectApply / No-GDR');
  await expect(evidence).toContainText('BOUNDED_OFF');
  await expect(evidence).toContainText('EFFECTIVE_STATE_GDR_LORA_V1');
});

test('historical Gated-Delta and Bounded pages still point to the successor study', async ({ page }) => {
  await page.goto('/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: /回到三组 1\.7B 已完成实验.*β-gating/ })).toHaveAttribute('href', route);
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
  const transition = await page.locator('[data-math-formula]').first().evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(Number.parseFloat(transition)).toBeLessThanOrEqual(0.001);
});

test('results index uses the same public names as the experiment page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
  const latest = page.locator('#latest-1p7b');
  await expect(latest).toContainText('普通 OpenEVO');
  await expect(latest).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(latest).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α 固定为 1）');
  await expect(latest).toContainText('60.72');
  await expect(latest).toContainText('45.98');
  await expect(latest).toContainText('20.77');
  await expect(latest).toContainText('动态 α + 动态 β（未做）');
  await expect(latest.getByRole('link', { name: /三组实验、方法与完整分析/ })).toHaveAttribute('href', route);
  await expect(latest.getByRole('link', { name: /普通 OpenEVO 独立实验/ })).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#final');
});
