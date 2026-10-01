import { expect, test } from '@playwright/test';

const zhRoute = '/research/seed-openevo/study/results/';
const benchmarkRoutes = [
  '/research/seed-openevo/study/results/benchmark-first/',
  '/research/seed-openevo/study/results/seed-faithful-benchmark/',
  '/research/seed-openevo/study/results/openevo-benchmark-design/',
] as const;

test('Chinese results landing mounts the unified six-module findings page', async ({ page }) => {
  await page.goto(zhRoute);
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index).toBeVisible();
  await expect(page.getByTestId('openevo-webshop-program-report')).toHaveCount(0);
  await expect(index.getByRole('heading', { name: 'OpenEvo × WebShop 研究结果' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '训练范围内未见任务与 SEED 验证任务' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '七个研究问题' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '第二次更新后的能力保持' })).toBeVisible();
  await expect(index.locator('article.question-card')).toHaveCount(6);
  await expect(index.getByTestId('current-source-faithful-q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveAttribute('data-testid', 'current-source-faithful-q7');
  await expect(index.locator('#current-q7-title')).toHaveCount(1);
  await expect(index.locator('.gate-grid .gate-card')).toHaveCount(3);

  const measurementEvidence = index.locator('#evidence-g2');
  await expect(measurementEvidence).not.toHaveAttribute('open', '');
  await expect(measurementEvidence.locator(':scope > summary')).toBeVisible();
  await measurementEvidence.locator(':scope > summary').click();
  await expect(measurementEvidence).toHaveAttribute('open', '');
  await expect(measurementEvidence.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

  const transferEvidence = index.locator('#evidence-q4');
  await expect(transferEvidence).not.toHaveAttribute('open', '');
  await transferEvidence.locator(':scope > summary').click();
  await expect(transferEvidence).toHaveAttribute('open', '');
  await expect(transferEvidence.getByText('+0.2488', { exact: false }).first()).toBeVisible();
  await expect(transferEvidence.locator('.forest-row')).toHaveCount(3);

  await expect(index.locator('a[href="#evidence-q4"]')).toHaveCount(1);
  const currentEvidenceLinks = index.locator('a[href="#evidence-q7"]');
  await expect(currentEvidenceLinks).toHaveCount(2);
  await expect(index.locator('.results-primary a[href="#evidence-q7"]')).toBeVisible();
  const snapshotAnswers = index.getByTestId('results-first-screen-answers');
  await expect(snapshotAnswers.locator('[data-result-answer]')).toHaveCount(3);
  await expect(snapshotAnswers.locator('[data-result-answer="learned"]')).toContainText('两次独立的一步更新实验');
  await expect(snapshotAnswers.locator('[data-result-answer="latest"]')).toContainText('稳定优势尚未建立');
  await expect(snapshotAnswers.locator('[data-result-answer="next"]')).toContainText('正式任务尚未解锁');
  await expect(index.locator('details.progress-detail a[href="#evidence-q7"]')).not.toBeVisible();
  await expect(index.locator('a[href="#evidence-q7"]:visible')).toHaveCount(1);
  await expect(index.locator('a[href="#next-n2"]')).toHaveCount(1);
  const currentEvidence = index.locator('#evidence-q7');
  await expect(currentEvidence).not.toHaveAttribute('open', '');
  await currentEvidence.locator(':scope > summary').click();
  await expect(currentEvidence).toHaveAttribute('open', '');
  await expect(currentEvidence.locator('a[href*="server/evidence/analysis.json"]').first()).toBeVisible();
  await expect(currentEvidence.locator('a[href*="server/evidence/reconciliation.json"]').first()).toBeVisible();
  await expect(index.locator('#next-n2')).toBeVisible();
  const continuationRecord = index.locator('#next-n2 .step-detail');
  await expect(continuationRecord).not.toHaveAttribute('open', '');
  await continuationRecord.locator(':scope > summary').click();
  await expect(continuationRecord).toHaveAttribute('open', '');
  await expect(continuationRecord.locator('a[href="https://github.com/mykcs/openevo-experiment/blob/836fc465f94619ecf81fe24aa1465015a6d8cc66/configs/experiment/current-campaign.json"]')).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('the active results route remains useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(zhRoute);
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index.getByRole('heading', { name: 'OpenEvo × WebShop 研究结果' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '这些数字会不会只是工程故障的假象？' })).toBeVisible();

  const measurementEvidence = index.locator('#evidence-g2');
  await expect(measurementEvidence).not.toHaveAttribute('open', '');
  await expect(measurementEvidence.locator(':scope > summary')).toBeVisible();
  await measurementEvidence.locator(':scope > summary').click();
  await expect(measurementEvidence).toHaveAttribute('open', '');
  await expect(measurementEvidence.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} unified results page is overflow-safe at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((selectedTheme) => localStorage.setItem('atlas-theme', selectedTheme), theme);
      for (const route of [zhRoute]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const index = page.getByTestId('openevo-webshop-result-index');
        await expect(index).toBeVisible();
        const answers = index.locator('[data-testid="results-first-screen-answers"] [data-result-answer]');
        await expect(answers).toHaveCount(3);
        const answerGeometry = await answers.evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            top: rect.top,
            bottom: rect.bottom,
            fontSize: Number.parseFloat(style.fontSize),
            clientWidth: (node as HTMLElement).clientWidth,
            scrollWidth: (node as HTMLElement).scrollWidth,
          };
        }));
        for (const geometry of answerGeometry) {
          expect(geometry.top).toBeGreaterThanOrEqual(0);
          expect(geometry.bottom).toBeLessThanOrEqual(viewport.height);
          expect(geometry.fontSize).toBeGreaterThanOrEqual(16);
          expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
        }
        await expect(index.locator('article.question-card')).toHaveCount(6);
        await expect(index.getByTestId('current-source-faithful-q7')).toHaveCount(1);
        await expect(index.locator('#q7')).toHaveCount(1);
        await expect(index.locator('#q7')).toHaveAttribute('data-testid', 'current-source-faithful-q7');
        await expect(index.locator('.gate-grid')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} results index and benchmark notes remain readable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((selectedTheme) => localStorage.setItem('atlas-theme', selectedTheme), theme);

      for (const route of [zhRoute, ...benchmarkRoutes]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('#main-content')).toBeVisible();
        if (route === zhRoute) {
          await expect(page.getByTestId('openevo-webshop-result-index')).toBeVisible();
        } else {
          await expect(page.locator('.benchmark-note')).toBeVisible();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('print mode exposes the current provenance codes on the active results route', async ({ page }) => {
  for (const route of [zhRoute]) {
    await page.goto(route);
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });
    const index = page.getByTestId('openevo-webshop-result-index');
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.plain-detail__header')).toBeHidden();
    const provenance = index.locator('.print-provenance');
    await expect(provenance).toBeVisible();
    const codes = provenance.locator('code');
    await expect(codes).toHaveCount(2);
    await expect(codes.nth(0)).toContainText('codex/h142-measurement-validity-20260821@d1f35ecdf84c');
    await expect(codes.nth(1)).toContainText('20260821-0142-h142-measurement-validity');
  }
});

test('print cleanup remains scoped away from the webshop explainer page', async ({ page }) => {
  await page.goto('/research/seed-openevo/flow/webshop/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await expect(page.locator('.plain-detail__header')).toBeVisible();
});
