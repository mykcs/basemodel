import { expect, test } from '@playwright/test';

const lobbyPath = '/research/seed-openevo/study/capability-exploration/';
const stage1Path = '/research/seed-openevo/study/capability-exploration/stage1-evolution/';
const stage2Path = '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/';

export function registerOpenEvoResearchDeepDiveTests() {
  test('OpenEvo lobby exposes the Stage 1 and 7B deep-dive maps while marking the older redesign as predecessor', async ({ page }) => {
    await page.goto(lobbyPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-map-choice="first-run"]')).toBeVisible();
    await expect(page.locator('[data-map-choice="redesign"]')).toContainText('重设计前序地图');
    await expect(page.locator('[data-map-choice="redesign"]')).toContainText('202609030400');
    await expect(page.locator('[data-deep-dive="stage1-evolution"]')).toHaveAttribute('href', stage1Path);
    await expect(page.locator('[data-deep-dive="stage2-7b-analysis"]')).toHaveAttribute('href', stage2Path);
  });

  test('Stage 1 evolution map explains the causal path to the shared 202609030400 freeze', async ({ page }) => {
    await page.goto(stage1Path, { waitUntil: 'domcontentloaded' });
    const map = page.getByTestId('openevo-stage1-evolution-map');
    await expect(map).toBeVisible();
    await expect(map).toContainText('180 个 WebShop 任务');
    await expect(map).toContainText('paired 64 + 64');
    await expect(map).toContainText('202609030400');
    await expect(map).toContainText('T=1.0');
    await expect(map).toContainText('任务成功率不是 raw corpus 的 PASS gate');
    await expect(map.locator('a[href="https://github.com/mykcs/openevo-experiment/pull/270"]')).toBeVisible();
    await expect(map.locator('a[href="https://www.kaggle.com/code/mykcs01/openevo-qwen3-h2011-minimax-m3-formal"]')).toBeVisible();
  });

  test('7B Stage 2 analysis map separates parameter learning from transfer claims and does not republish stale counters', async ({ page }) => {
    await page.goto(stage2Path, { waitUntil: 'domcontentloaded' });
    const map = page.getByTestId('openevo-7b-stage2-analysis-map');
    await expect(map).toBeVisible();
    await expect(map).toContainText('20,480');
    await expect(map).toContainText('797');
    await expect(map).toContainText('80 / 80');
    await expect(map).toContainText('暂不复制');
    await expect(map).toContainText('Task Vector 默认 diagnostic-only');
    await expect(map).toContainText('64 个 component');
    await expect(map.getByText(/fresh-task transfer 未必稳定为正/)).toBeVisible();
    await expect(map.locator('a[href="https://wandb.ai/zju-openevo-wangrui/zju-openevo-experiments"]')).toBeVisible();
    await expect(map.locator('a[href*="seed-openevo-research-ia-factual-debt-2026-09-03.md"]')).toBeVisible();
  });

  for (const path of [stage1Path, stage2Path]) {
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
