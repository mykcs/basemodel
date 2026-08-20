import { expect, test, type Page } from '@playwright/test';

const routes = ['/research/seed-openevo/results/', '/en/research/seed-openevo/results/'];

async function expectPriorityListReadable(page: Page, viewportWidth: number) {
  const list = page.locator('.priority-list');
  const rows = list.locator(':scope > li');
  await expect(list).toBeVisible();
  await expect(rows).toHaveCount(4);

  const metrics = await rows.first().evaluate((node) => {
    const row = node as HTMLElement;
    const label = row.querySelector(':scope > span') as HTMLElement | null;
    const body = row.querySelector(':scope > div') as HTMLElement | null;
    const title = body?.querySelector(':scope > strong') as HTMLElement | null;
    const list = row.parentElement as HTMLElement | null;
    if (!label || !body || !title || !list) throw new Error('priority-list structure is incomplete');

    const rowRect = row.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const rowStyle = getComputedStyle(row);
    const listStyle = getComputedStyle(list);

    return {
      display: rowStyle.display,
      listStyleType: rowStyle.listStyleType,
      listBackground: listStyle.backgroundColor,
      listBorderRadius: listStyle.borderRadius,
      rowWidth: rowRect.width,
      rowLeft: rowRect.left,
      rowRight: rowRect.right,
      labelLeft: labelRect.left,
      labelRight: labelRect.right,
      bodyWidth: bodyRect.width,
      bodyLeft: bodyRect.left,
      bodyRight: bodyRect.right,
      titleWidth: titleRect.width,
      titleHeight: titleRect.height,
    };
  });

  expect(metrics.display).toBe('grid');
  expect(metrics.listStyleType).toBe('none');
  expect(metrics.listBackground).toBe('rgba(0, 0, 0, 0)');
  expect(metrics.listBorderRadius).toBe('0px');
  expect(metrics.rowWidth).toBeGreaterThan(250);
  expect(metrics.bodyWidth).toBeGreaterThan(metrics.rowWidth * 0.72);
  expect(metrics.bodyRight).toBeGreaterThanOrEqual(metrics.rowRight - 2);
  expect(metrics.titleWidth).toBeGreaterThan(metrics.bodyWidth * 0.9);

  if (viewportWidth <= 560) {
    expect(Math.abs(metrics.bodyLeft - metrics.rowLeft)).toBeLessThanOrEqual(2);
  } else {
    expect(metrics.bodyLeft).toBeGreaterThan(metrics.labelRight);
  }
}

for (const route of routes) {
  test(`paper report exposes the scientific argument before appendices: ${route}`, async ({ page }) => {
    await page.goto(route);
    const report = page.getByTestId('openevo-webshop-program-report');
    await expect(report).toBeVisible();
    await expect(report.locator('.milestone-table tbody tr')).toHaveCount(4);
    await expect(report.getByText('764 / 768', { exact: false })).toBeVisible();
    await expect(report.locator('#interpretation')).toBeVisible();
    await expect(report.locator('#next-experiment')).toBeVisible();
    await expect(report.locator('.priority-list > li')).toHaveCount(4);

    const ordered = await report.evaluate((node) => {
      const ids = ['abstract', 'method', 'results', 'interpretation', 'next-experiment', 'methods', 'appendix'];
      const sections = ids.map((id) => node.querySelector(`#${id}`));
      return sections.every((current, index) => {
        if (!current) return false;
        if (index === 0) return true;
        const previous = sections[index - 1];
        return Boolean(previous && (previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING));
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

    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

test('report and NEXT priorities remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/en/research/seed-openevo/results/');
  const report = page.getByTestId('openevo-webshop-program-report');
  await expect(report.getByRole('heading', { name: 'Can OpenEvo actually self-evolve on WebShop?' })).toBeVisible();
  await expect(report.locator('.milestone-table')).toBeVisible();
  await expectPriorityListReadable(page, 390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 560, height: 900 },
    { width: 640, height: 960 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${theme} report keeps NEXT text full-width at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expectPriorityListReadable(page, viewport.width);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('print mode linearizes the report and exposes provenance', async ({ page }) => {
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
  await expect(report.locator('.print-methods code').first()).toContainText('93a38821c884');
  await expect(report.locator('.print-appendices')).toBeVisible();
  await expect(report.locator('.print-appendices > ol > li')).toHaveCount(27);
});

test('print cleanup remains scoped to the results report', async ({ page }) => {
  await page.goto('/research/seed-openevo/webshop/');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await expect(page.locator('.plain-detail__header')).toBeVisible();
});
