import { expect, test } from '@playwright/test';

const routes = ['/research/seed-openevo/results/', '/en/research/seed-openevo/results/'];

for (const route of routes) {
  test(`reader-first report explains the problem before run IDs and methods: ${route}`, async ({ page }) => {
    await page.goto(route);
    const report = page.getByTestId('openevo-webshop-program-report');
    await expect(report).toBeVisible();
    await expect(report.locator('.opening-prose')).toBeVisible();
    await expect(report.locator('.trace-example')).toBeVisible();
    await expect(report.locator('.journey-table tbody tr')).toHaveCount(4);
    await expect(report.locator('#method-control')).toBeVisible();
    await expect(report.locator('#replication')).toBeVisible();
    await expect(report.locator('#next-experiment')).toBeVisible();
    await expect(report.locator('#interpretation')).toBeVisible();
    await expect(report.getByText('0.667', { exact: false }).first()).toBeVisible();
    await expect(report.getByText('+0.248845', { exact: false }).first()).toBeVisible();
    await expect(report.getByText('132', { exact: false }).first()).toBeVisible();
    await expect(report.getByText('384', { exact: false }).first()).toBeVisible();
    await expect(report.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();

    const ordered = await report.evaluate((node) => {
      const ids = ['abstract', 'background', 'journey', 'method-control', 'replication', 'next-experiment', 'interpretation', 'methods', 'appendix'];
      const sections = ids.map((id) => node.querySelector(`#${id}`));
      return sections.every((current, index) => {
        if (!current) return false;
        if (index === 0) return true;
        const previous = sections[index - 1];
        return Boolean(previous && (previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
    });
    expect(ordered).toBe(true);

    const methodOwnsFirstSd = await report.evaluate((node) => {
      const method = node.querySelector('#method-control');
      const candidates = Array.from(node.querySelectorAll('h1,h2,h3,p,li,summary,figcaption,td,th'));
      const firstSd = candidates.find((el) => el.textContent?.includes('SD-LoRA'));
      return Boolean(method && firstSd && (method.compareDocumentPosition(firstSd) & Node.DOCUMENT_POSITION_CONTAINED_BY));
    });
    expect(methodOwnsFirstSd).toBe(true);

    const lineage = report.getByTestId('lineage-appendix');
    const rtx6 = report.getByTestId('rtx6-appendix');
    await expect(lineage).not.toHaveAttribute('open', '');
    await expect(rtx6).not.toHaveAttribute('open', '');
    await lineage.locator(':scope > summary').click();
    await expect(lineage).toHaveAttribute('open', '');
    await expect(lineage.locator('.lineage-list > li')).toHaveCount(29);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

test('reader-first report remains useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/en/research/seed-openevo/results/');
  const report = page.getByTestId('openevo-webshop-program-report');
  await expect(report.getByRole('heading', { name: 'Can OpenEvo get better on WebShop by learning from its own experience?' })).toBeVisible();
  await expect(report.getByRole('heading', { name: 'What does WebShop measure?' })).toBeVisible();
  await expect(report.getByRole('heading', { name: 'What one WebShop task actually looks like' })).toBeVisible();
  await expect(report.getByRole('heading', { name: 'One concept matters here: what is LoRA?' })).toBeVisible();
  await expect(report.getByText('MEASUREMENT_INVALID', { exact: false }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} reader-first report is overflow-safe at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const report = page.getByTestId('openevo-webshop-program-report');
        await expect(report.locator('.trace-example')).toBeVisible();
        await expect(report.locator('.second-gen-ledger')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('print mode linearizes the narrative and exposes current provenance', async ({ page }) => {
  await page.goto('/research/seed-openevo/results/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  const report = page.getByTestId('openevo-webshop-program-report');
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.plain-detail__header')).toBeHidden();
  await expect(page.locator('.plain-detail__tabs')).toBeHidden();
  await expect(page.locator('.page-outline')).toBeHidden();
  await expect(page.locator('.actionable-content-status')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(report.locator('.paper-nav')).toBeHidden();
  await expect(report.locator('.print-methods')).toBeVisible();
  const printProvenance = report.locator('.print-methods code');
  await expect(printProvenance).toHaveCount(2);
  await expect(printProvenance.nth(0)).toContainText('main@e9088e47531f');
  await expect(printProvenance.nth(1)).toContainText('20260821-0141-h141-magnitude-screen');
  await expect(report.locator('.print-lineage')).toBeVisible();
  await expect(report.locator('.print-lineage > li')).toHaveCount(29);
  await expect(report.locator('.print-rtx6')).toBeVisible();
});

test('print cleanup remains scoped to the results report', async ({ page }) => {
  await page.goto('/research/seed-openevo/webshop/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await expect(page.locator('.plain-detail__header')).toBeVisible();
});
