import { expect, test } from '@playwright/test';

const lobbyPath = '/research/seed-openevo/study/capability-exploration/';
const gatewayPath = `${lobbyPath}openevo-2-0/`;
const explorationPath = `${gatewayPath}exploration/`;
const reportPath = `${gatewayPath}report/`;
const stage1CompatPath = `${lobbyPath}stage1-evolution/`;
const stage2Path = `${lobbyPath}stage2-7b-analysis/`;
const principle = '在 SEED-aligned 的 WebShop 任务、轨迹与评测预算内，先冻结规则、再看结果，探索 OpenEvo 能把当前基座模型推到多高。';

export function registerOpenEvoResearchDeepDiveTests() {
  test('OpenEvo lobby keeps exactly two primary maps and exposes both successor reading modes', async ({ page }) => {
    await page.goto(lobbyPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-map-choice]')).toHaveCount(2);
    await expect(page.locator('[data-map-choice="redesign"]')).toContainText('当前 successor · 3B + 1.7B');
    await expect(page.locator('[data-deep-dive="successor-exploration"]')).toHaveAttribute('href', explorationPath);
    await expect(page.locator('[data-deep-dive="successor-report"]')).toHaveAttribute('href', reportPath);
    await expect(page.locator('[data-deep-dive="stage2-7b-analysis"]')).toHaveAttribute('href', stage2Path);
  });

  test('successor gateway makes exploration and report two views of one evidence set', async ({ page }) => {
    await page.goto(gatewayPath, { waitUntil: 'domcontentloaded' });
    const gateway = page.getByTestId('openevo-successor-gateway');
    await expect(gateway.locator('[data-successor-mode]')).toHaveCount(2);
    await expect(gateway.locator('[data-principle]')).toContainText(principle);
    await expect(gateway.locator('[data-arm="qwen25-3b"]')).toContainText('22 / 1440');
    await expect(gateway.locator('[data-arm="qwen3-1p7b"]')).toContainText('50 / 1440');
    await expect(gateway.getByTestId('openevo-harness-fairness')).toContainText('strategy-neutral bootstrap harness');
  });

  test('exploration view preserves real detours, backtracking, engineering fixes, and the shared freeze', async ({ page }) => {
    await page.goto(explorationPath, { waitUntil: 'domcontentloaded' });
    const map = page.getByTestId('openevo-successor-exploration-map');
    await expect(map.locator('[data-principle]')).toContainText(principle);
    await expect(map.locator('[data-exploration-detour="horizon"]')).toContainText('64/64 valid');
    await expect(map.locator('[data-exploration-detour="horizon"]')).toContainText('paired horizon delta = 0');
    await expect(map.locator('[data-exploration-detour="sampling"]')).toContainText('T=1.0');
    await expect(map.locator('[data-quest="deliberation"]')).toContainText('短自我推理');
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
    await expect(report.locator('[data-paper-step]')).toHaveCount(6);
    await expect(report.locator('[data-arm="qwen25-3b"]')).toContainText('22 / 1440');
    await expect(report.locator('[data-arm="qwen3-1p7b"]')).toContainText('50 / 1440');
    await expect(report.locator('[data-paper-step="harness"]')).toContainText('What');
    await expect(report.locator('[data-paper-step="harness"]')).toContainText('Why');
    await expect(report.locator('[data-paper-step="harness"]')).toContainText('Evidence');
    await expect(report.locator('[data-paper-step="harness"]')).toContainText('Boundary');
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
    await expect(map).toContainText('Task Vector 默认 diagnostic-only');
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
