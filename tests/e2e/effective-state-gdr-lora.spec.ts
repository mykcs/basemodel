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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('三组已完成 OpenEVO 实验');
    const ablation = page.locator('.paper-table--ablation');
    await expect(ablation).toContainText('普通 OpenEVO');
    await expect(ablation).toContainText('OpenEVO + Bounded Online Recurrence');
    await expect(ablation).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α=1）');
    await expect(ablation).toContainText('60.72');
    await expect(ablation).toContainText('45.98');
    await expect(ablation).toContainText('20.77');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });
}

test('ablation table keeps all six columns on one explicit 100-percent grid', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const geometry = await page.locator('.paper-table--ablation').evaluate((table) => {
    const tableRect = table.getBoundingClientRect();
    const cells = Array.from(table.querySelectorAll('thead th')).map((cell) => {
      const rect = cell.getBoundingClientRect();
      return {
        left: rect.left - tableRect.left,
        width: rect.width,
        share: rect.width / tableRect.width,
      };
    });
    return { width: tableRect.width, cells };
  });

  expect(geometry.cells).toHaveLength(6);
  const expectedShares = [0.30, 0.08, 0.08, 0.08, 0.20, 0.26];
  expectedShares.forEach((expected, index) => {
    expect(Math.abs(geometry.cells[index]!.share - expected)).toBeLessThan(0.012);
  });
  const last = geometry.cells.at(-1)!;
  expect(Math.abs(last.left + last.width - geometry.width)).toBeLessThan(1.5);
});

test('ablation table separates three completed mechanisms from the unrun dynamic-alpha slot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const rows = page.locator('.paper-table--ablation tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toContainText('普通 OpenEVO');
  await expect(rows.nth(0).getByText('✓')).toHaveCount(0);
  await expect(rows.nth(1)).toContainText('OpenEVO + Bounded Online Recurrence');
  await expect(rows.nth(1).getByText('✓')).toHaveCount(1);
  await expect(rows.nth(2)).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α=1）');
  await expect(rows.nth(2).getByText('✓')).toHaveCount(2);
  await expect(rows.nth(3)).toContainText('动态 α + 动态 β（未做）');
  await expect(rows.nth(3).getByText('✓')).toHaveCount(3);
  await expect(rows.nth(3)).toContainText('—');
});

test('paper narrative follows motivation, method, mapping, experiment, result, and analysis', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const h2s = await page.locator('.paper__section > h2').allTextContents();
  expect(h2s.slice(0, 5)).toEqual([
    '动机：SD-LoRA 越训练越慢',
    '方法：Bounded Online Recurrence、Gated Delta 来源与本实验 β-gating（α=1）',
    '实验设置：Qwen3-1.7B × WebShop',
    '结果：训练后期与固定 128 题终评',
    '指标分析：从 loss 一直看到行为 entropy',
  ]);
});

test('method section explains source Gated Delta and the beta-gating alpha-one parameter mapping', async ({ page }) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const method = page.locator('#method');
  await expect(method.locator('[data-math-formula]')).toHaveCount(7);
  await expect(method.locator('.katex').first()).toBeVisible();
  await expect(method).toContainText('Compress');
  await expect(method).toContainText('Gated Delta 再给旧 State 加一个 retention α');
  await expect(method).toContainText('α');
  await expect(method).toContainText('β');
  await expect(method).toContainText('从 sequence State 映射到 OpenEVO 的参数 State');
  await expect(method).toContainText('A↦sA');
  await expect(method).toContainText('1.052');
  await expect(method).toContainText('657.836');
  await expect(method).toContainText('22');
  await expect(method).toContainText('reward、Task Score、Task Vector');
  await expect(method).toContainText('本实验真正启用的动态控制量');
  await expect(method).toContainText('α=1');
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
  await expect(result).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α=1）');
  await expect(result).toContainText('R1–R159 mean reward');
  await expect(result).toContainText('跨 0');
  await expect(result).toContainText('短暂正向信号没有形成稳定优势');
  await expect(result).toContainText('动态 α + 动态 β（未做）');
  await expect(page.locator('#compute')).toContainText('31.09');
  await expect(page.locator('#compute')).toContainText('2.02');
  await expect(page.locator('#compute')).toContainText('2.35');
  await expect(page.locator('#compute')).toContainText('13–15×');
});

test('analysis follows a simple-to-complex metric ladder with definition result and analysis in every subsection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const analysis = page.locator('#analysis');
  await expect(analysis.getByRole('heading', { level: 2 })).toContainText('指标分析：从 loss 一直看到行为 entropy');

  const metricSteps = analysis.locator('.paper__metric-step');
  await expect(metricSteps).toHaveCount(5);
  const headings = await metricSteps.getByRole('heading', { level: 3 }).allTextContents();
  expect(headings).toEqual([
    '5.1 loss：最基本的问题——训练有没有真的在拟合',
    '5.2 Task Vector：一轮训练到底把参数推了多远',
    '5.3 参数范数、谱与方向：再往里看“状态长什么样”',
    '5.4 输出长度与任务步数：从参数走到实际做题路径',
    '5.5 Entropy：最后看策略行为是不是越来越集中',
  ]);
  for (let index = 0; index < 5; index += 1) {
    const labels = metricSteps.nth(index).locator('.paper__metric-label');
    await expect(labels).toHaveCount(3);
    await expect(labels.nth(0)).toContainText('① 指标是什么');
    await expect(labels.nth(1)).toContainText('② 这次实验的结果');
    await expect(labels.nth(2)).toContainText('③ 分析');
  }

  await expect(page.locator('#loss')).toContainText('1.046');
  await expect(page.locator('#loss')).toContainText('0.102');
  await expect(page.locator('#loss')).toContainText('0.065');
  await expect(page.locator('#loss')).toContainText('0.069');

  await expect(page.locator('#task-vector')).toContainText('0.597');
  await expect(page.locator('#task-vector')).toContainText('0.045');
  await expect(page.locator('#task-vector')).toContainText('-0.278');
  await expect(page.locator('#task-vector')).toContainText('+0.044');

  await expect(page.locator('#parameter-geometry')).toContainText('21.051');
  await expect(page.locator('#parameter-geometry')).toContainText('17.925');
  await expect(page.locator('#parameter-geometry')).toContainText('2.136');
  await expect(page.locator('#parameter-geometry')).toContainText('1.946');
  await expect(page.locator('#parameter-geometry')).toContainText('-0.287');

  await expect(page.locator('#length')).toContainText('216.8');
  await expect(page.locator('#length')).toContainText('229.1');
  await expect(page.locator('#length')).toContainText('7.91');
  await expect(page.locator('#length')).toContainText('8.60');

  await expect(page.locator('#entropy')).toContainText('0.5826');
  await expect(page.locator('#entropy')).toContainText('0.3705');
  await expect(page.locator('#entropy')).toContainText('1158');
  await expect(page.locator('#entropy')).toContainText('100%');

  const next = page.locator('#next-question');
  await expect(next).toContainText('下一步：先补动态 α，再研究 β 还该知道什么');
  await expect(next).toContainText('动态 α + 动态 β');
});

test('W&B evidence is embedded beside the relevant metric instead of collected in a separate gallery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const analysis = page.locator('#analysis');
  await expect(page.locator('#wandb')).toHaveCount(0);
  await expect(analysis.getByRole('link', { name: /W&B Report/ })).toHaveAttribute('href', /wandb\.ai/);
  await expect(analysis.getByRole('link', { name: /完整 W&B Workspace/ })).toHaveAttribute('href', /wandb\.ai/);

  const figures = analysis.locator('.metric-evidence');
  await expect(figures).toHaveCount(4);
  await expect(page.locator('#loss img')).toHaveAttribute('src', /wandb-threeway\/loss-vs-rollout\.svg/);
  await expect(page.locator('#task-vector img')).toHaveAttribute('src', /wandb-threeway\/task-vector-frobenius\.svg/);
  await expect(page.locator('#length img')).toHaveAttribute('src', /wandb-threeway\/steps-per-episode\.svg/);
  await expect(page.locator('#entropy img')).toHaveAttribute('src', /wandb-threeway\/action-family-entropy\.svg/);
  for (let index = 0; index < 4; index += 1) {
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
  await expect(h1).toContainText('三组已完成 OpenEVO 实验');
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
  await expect(evidence).toContainText('Bounded Online Recurrence + β-gating（α=1）');
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
  await expect(latest).toContainText('OpenEVO + Bounded Online Recurrence + β-gating（α=1）');
  await expect(latest).toContainText('60.72');
  await expect(latest).toContainText('45.98');
  await expect(latest).toContainText('20.77');
  await expect(latest).toContainText('动态 α + 动态 β（未做）');
  await expect(latest.getByRole('link', { name: /三组实验、方法与完整分析/ })).toHaveAttribute('href', route);
  await expect(latest.getByRole('link', { name: /普通 OpenEVO 独立实验/ })).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#final');
});
