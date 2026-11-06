import { expect, test } from '@playwright/test';

const lobbyPath = '/research/seed-openevo/study/capability-exploration/';
const gatewayPath = `${lobbyPath}openevo-2-0/`;
const explorationPath = `${gatewayPath}exploration/`;
const reportPath = `${gatewayPath}report/`;
const stage1CompatPath = `${lobbyPath}stage1-evolution/`;
const stage2Path = `${lobbyPath}stage2-7b-analysis/`;
const principle = '在与 SEED 对齐的购物任务、尝试次数和评测预算内，先固定规则再看结果，研究 OpenEvo 能把模型提高到什么程度。';

export function registerOpenEvoResearchDeepDiveTests() {
  test('research topics preserve distinct results, diagnosis and archive destinations', async ({ page }) => {
    await page.goto(lobbyPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-topic-group]')).toHaveCount(4);
    for (const path of [gatewayPath, explorationPath, reportPath, stage2Path, `${lobbyPath}mechanism-1-0/`, `${lobbyPath}archive/`]) {
      await expect(page.locator(`[data-topic-route] a[href="${path}"]`)).toHaveCount(1);
    }
    await expect(page.locator(`[data-topic-route] a[href="${stage1CompatPath}"]`)).toHaveCount(0);
    await expect(page.locator('[data-topic-group="history"] [data-topic-route="stage1-previous"]')).toBeVisible();
  });

  test('successor gateway makes exploration and report two views of one evidence set', async ({ page }) => {
    await page.goto(gatewayPath, { waitUntil: 'domcontentloaded' });
    const gateway = page.getByTestId('openevo-successor-gateway');
    await expect(gateway.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
    await expect(gateway.locator('[data-reading-choice]')).toBeVisible();
    await expect(gateway.locator('[data-successor-mode]')).toHaveCount(2);
    await expect(gateway.locator('[data-successor-mode]').first()).toHaveAttribute('data-successor-mode', 'report');
    await expect(gateway.locator('[data-principle]')).toContainText(principle);
    await expect(gateway.locator('[data-arm="qwen25-3b"]')).toContainText('22 / 1440');
    await expect(gateway.locator('[data-arm="qwen3-1p7b"]')).toContainText('50 / 1440');
    await expect(gateway.getByTestId('openevo-harness-fairness')).toContainText('共享接口只约束合法动作与通用短推理，不提供具体购物策略');
  });

  test('exploration view preserves real detours, backtracking, engineering fixes, and the shared freeze', async ({ page }) => {
    await page.goto(explorationPath, { waitUntil: 'domcontentloaded' });
    const map = page.getByTestId('openevo-successor-exploration-map');
    await expect(map.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
    await expect(map.locator('[data-research-journey] [data-research-step]')).toHaveCount(5);
    await expect(map.locator('[data-research-depth="history"]')).toBeVisible();
    await expect(map.locator('[data-principle]')).toContainText(principle);
    await expect(map.locator('[data-exploration-detour="horizon"]')).toContainText('64 条记录全部有效');
    await expect(map.locator('[data-exploration-detour="horizon"]')).toContainText('每一对任务的结果差值都是 0');
    await expect(map.locator('[data-exploration-detour="sampling"]')).toContainText('温度设为 1.0');
    await expect(map.locator('[data-quest="deliberation"]')).toContainText('动作前的短思考');
    await expect(map.locator('[data-fix]')).toHaveCount(2);
    await expect(map.locator('[data-quest="freeze"]')).toContainText('202609030400');
    await expect(map.locator('[data-quest="raw-results"]')).toContainText('22/1440');
    await expect(map.locator('[data-quest="raw-results"]')).toContainText('50/1440');
    await expect(map.locator('[data-exploration-detour="memory-capacity"]')).toContainText('4096');
    await expect(map.locator('[data-exploration-detour="memory-capacity"]')).toContainText('extended_repair_failed');
    await expect(map.locator('[data-quest="a2"]')).toContainText('first10 + last10');
    await expect(map.locator('[data-quest="prestage2"]')).toContainText('stage2_authorized=false');
  });

  test('report view is a linear claim-bearing map with explicit fairness and contamination boundaries', async ({ page }) => {
    await page.goto(reportPath, { waitUntil: 'domcontentloaded' });
    const report = page.getByTestId('openevo-successor-report');
    await expect(report.locator('[data-research-orientation] [data-orientation-field]')).toHaveCount(5);
    await expect(report.locator('[data-research-journey]')).toBeVisible();
    await expect(report.locator('[data-research-step]')).toHaveCount(6);
    await expect(report.locator('[data-paper-step]')).toHaveCount(6);
    await expect(report.locator('[data-arm="qwen25-3b"]')).toContainText('22 / 1440');
    await expect(report.locator('[data-arm="qwen3-1p7b"]')).toContainText('50 / 1440');
    await expect(report.locator('[data-paper-step="harness"] .paper-step__meaning')).toHaveCount(2);
    await expect(report.locator('[data-paper-step="harness"] .paper-step__meaning').first()).toBeVisible();
    await expect(report.locator('.report-chronology tbody tr')).toHaveCount(3);
    await report.locator('[data-paper-step="harness"] .paper-step__technical summary').click();
    for (const label of ['操作', '理由', '记录', '适用范围']) {
      await expect(report.locator('[data-paper-step="harness"] dt').filter({ hasText: label })).toBeVisible();
    }
    await expect(report.locator('[data-paper-step="minimax"]')).toContainText('new_webshop_calls=0');
    await expect(report.locator('[data-paper-step="carriers"]')).toContainText('4096');
    await expect(report.locator('[data-paper-step="carriers"]')).toContainText('first10 + last10');
    await expect(report.getByTestId('openevo-harness-fairness')).toContainText('基座模型预训练污染');
    await expect(report.getByTestId('openevo-harness-fairness')).toContainText('无法排除');
    await expect(report).toContainText('stage2_authorized=false');
  });

  test('legacy Stage-1 deep link mounts the same exploration semantics', async ({ page }) => {
    await page.goto(stage1CompatPath, { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('openevo-successor-exploration-map')).toBeVisible();
    await expect(page.locator('[data-quest="freeze"]')).toContainText('202609030400');
  });

  test('7B Stage 2 analysis map remains historical parameter evidence', async ({ page }) => {
    await page.goto(stage2Path, { waitUntil: 'domcontentloaded' });
    const map = page.getByTestId('openevo-7b-stage2-analysis-map');
    await expect(map).toBeVisible();
    await expect(map).toContainText('20,480');
    await expect(map).toContainText('797');
    await expect(map).toContainText('参数分析只做诊断，不自动控制训练');
  });

  for (const path of [explorationPath, reportPath, stage1CompatPath, stage2Path]) {
    test(`${path} has no page-level horizontal overflow on iPhone width`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
    });
  }
}

