import { expect, test } from '@playwright/test';

const routes = ['/research/seed-openevo/results/', '/en/research/seed-openevo/results/'];

for (const route of routes) {
  test(`paper report exposes the main argument before appendices: ${route}`, async ({ page }) => {
    await page.goto(route);
    const report = page.getByTestId('openevo-webshop-program-report');
    await expect(report).toBeVisible();
    await expect(report.locator('#results table')).toBeVisible();
    await expect(report.locator('#results tbody tr')).toHaveCount(4);
    await expect(report.getByText('764 / 768', { exact: false })).toBeVisible();
    await expect(report.locator('#interpretation')).toBeVisible();
    await expect(report.locator('#next-experiment')).toBeVisible();

    const ordered = await report.evaluate((node) => {
      const ids = ['abstract', 'results', 'interpretation', 'next-experiment', 'methods', 'appendix'];
      return ids.map((id) => node.querySelector(`#${id}`)).every((current, index, all) => {
        if (!current || index === 0 || !all[index - 1]) return index === 0 ? Boolean(current) : false;
        return Boolean(all[index - 1]!.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
    });
    expect(ordered).toBe(true);

    const lineage = report.getByTestId('lineage-appendix');
    const rtx6 = report.getByTestId('rtx6-appendix');
    await expect(lineage).not.toHaveAttribute('open', '');
    await expect(rtx6).not.toHaveAttribute('open', '');
    await lineage.locator(':scope > summary').focus();
    await page.keyboard.press('Enter');
    await expect(lineage).toHaveAttribute('open', '');
    await expect(lineage.locator('.lineage-list > li')).toHaveCount(27);
    await expect(rtx6).not.toHaveAttribute('open', '');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('report remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/en/research/seed-openevo/results/');
  const report = page.getByTestId('openevo-webshop-program-report');
  await expect(report.getByRole('heading', { name: 'Experimental conclusion' })).toBeVisible();
  await expect(report.locator('#results table')).toBeVisible();
  const lineage = report.getByTestId('lineage-appendix');
  await lineage.locator(':scope > summary').click();
  await expect(lineage).toHaveAttribute('open', '');
  await expect(lineage.locator('.lineage-list > li')).toHaveCount(27);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} report is overflow-safe at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const report = page.getByTestId('openevo-webshop-program-report');
        await expect(report.locator('#results table')).toBeVisible();
        await report.getByTestId('lineage-appendix').locator(':scope > summary').click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('print mode linearizes the report and exposes provenance', async ({ page }) => {
  await page.goto('/research/seed-openevo/results/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  const report = page.getByTestId('openevo-webshop-program-report');
  await expect(report.locator('.paper-nav')).toBeHidden();
  await expect(report.locator('.print-methods')).toBeVisible();
  await expect(report.locator('.print-methods code').first()).toContainText('93a38821c884');
  await expect(report.locator('.print-lineage')).toBeVisible();
  await expect(report.locator('.print-lineage > li')).toHaveCount(27);
  await expect(report.locator('.print-rtx6')).toBeVisible();
});
