import { expect, test } from '@playwright/test';

const zhRoute = '/research/seed-openevo/study/results/';
const enRoute = '/en/research/seed-openevo/study/results/';
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
  await expect(index.getByRole('heading', { name: '先分清两种“新任务”' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '我们现在能回答的七个问题' })).toBeVisible();
  await expect(index.getByRole('heading', { name: '第二代为什么还不能说“越学越好”？' })).toBeVisible();
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
  await expect(index.locator('a[href="#evidence-q7"]')).toHaveCount(1);
  await expect(index.locator('a[href="#next-n2"]')).toHaveCount(1);
  const currentEvidence = index.locator('#evidence-q7');
  await expect(currentEvidence).not.toHaveAttribute('open', '');
  await currentEvidence.locator(':scope > summary').click();
  await expect(currentEvidence).toHaveAttribute('open', '');
  await expect(currentEvidence.locator('a[href*="server/evidence/analysis.json"]').first()).toBeVisible();
  await expect(currentEvidence.locator('a[href*="server/evidence/reconciliation.json"]').first()).toBeVisible();
  await expect(index.locator('#next-n2')).toBeVisible();
  await expect(index.locator('#next-n2 a[href="https://github.com/mykcs/openevo-experiment/blob/main/configs/experiment/current-campaign.json"]')).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('English results landing mounts the same unified findings page in English', async ({ page }) => {
  await page.goto(enRoute);
  const index = page.getByTestId('openevo-webshop-result-index');
  await expect(index).toBeVisible();
  await expect(page.getByTestId('openevo-webshop-program-report')).toHaveCount(0);
  await expect(index.getByRole('heading', { name: 'OpenEvo × WebShop research findings' })).toBeVisible();
  await expect(index.getByRole('heading', { name: 'Two task ranges to keep in mind' })).toBeVisible();
  await expect(index.getByRole('heading', { name: 'The seven questions we can now answer' })).toBeVisible();
  await expect(index.getByRole('heading', { name: 'Why can’t we yet say the second generation keeps improving?' })).toBeVisible();
  await expect(index.locator('article.question-card')).toHaveCount(6);
  await expect(index.getByTestId('current-source-faithful-q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveCount(1);
  await expect(index.locator('#q7')).toHaveAttribute('data-testid', 'current-source-faithful-q7');

  const measurementEvidence = index.locator('#evidence-g2');
  await expect(measurementEvidence).not.toHaveAttribute('open', '');
  await measurementEvidence.locator(':scope > summary').click();
  await expect(measurementEvidence).toHaveAttribute('open', '');
  await expect(measurementEvidence.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

  const transferEvidence = index.locator('#evidence-q4');
  await expect(transferEvidence).not.toHaveAttribute('open', '');
  await transferEvidence.locator(':scope > summary').click();
  await expect(transferEvidence).toHaveAttribute('open', '');
  await expect(transferEvidence.locator('.forest-row')).toHaveCount(3);

  const ordered = await index.evaluate((node) => {
    const ids = ['protocol', 'questions', 'g2-ablation', 'next-steps', 'appendix'];
    const sections = ids.map((id) => node.querySelector(`#${id}`));
    return sections.every((current, position) => {
      if (!current) return false;
      if (position === 0) return true;
      const previous = sections[position - 1];
      return Boolean(previous && (previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
  });
  expect(ordered).toBe(true);

  const lineage = index.getByTestId('lineage-appendix');
  const rtx6 = index.getByTestId('rtx6-appendix');
  await expect(lineage).not.toHaveAttribute('open', '');
  await expect(rtx6).not.toHaveAttribute('open', '');
  await lineage.locator(':scope > summary').click();
  await expect(lineage).toHaveAttribute('open', '');
  await expect(lineage.locator('.lineage-list > li')).toHaveCount(30);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('both results routes remain useful without JavaScript', async ({ browser }) => {
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
      for (const route of [zhRoute, enRoute]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const index = page.getByTestId('openevo-webshop-result-index');
        await expect(index).toBeVisible();
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

test('print mode exposes the current provenance codes on both results routes', async ({ page }) => {
  for (const route of [zhRoute, enRoute]) {
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
