import { expect, test } from '@playwright/test';

test.describe('scientific research tables', () => {
  test('rank32 table is readable without JavaScript and keeps horizontal scroll local on phone', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');

    const figure = page.locator('[data-scientific-table="rank32-capacity"]');
    await expect(figure).toBeVisible();
    await expect(figure.locator('caption')).toContainText('rank128 与 rank32');
    await expect(figure.getByRole('row', { name: /R152–R159 平均 Task Score/ })).toContainText('0.6298');
    await expect(figure.getByRole('row', { name: /R152–R159 平均 Task Score/ })).toContainText('0.6119');

    const scroller = figure.locator('.scientific-table__scroll');
    await scroller.focus();
    await expect(scroller).toBeFocused();
    const geometry = await page.evaluate(() => ({
      rootOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      tableOverflow: (() => {
        const el = document.querySelector<HTMLElement>('[data-scientific-table="rank32-capacity"] .scientific-table__scroll');
        return !!el && el.scrollWidth > el.clientWidth;
      })(),
    }));
    expect(geometry.rootOverflow).toBe(false);
    expect(geometry.tableOverflow).toBe(true);
    await context.close();
  });

  test('same-panel table keeps the unrun row missing and external SEED reference outside the table', async ({ page }) => {
    await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
    const figure = page.locator('[data-scientific-table="same-panel-final"]');
    await expect(figure).toBeVisible();
    await expect(figure.locator('[data-row-id="directapply"]')).toContainText('60.72');
    await expect(figure.locator('[data-row-id="bounded"]')).toContainText('45.98');
    await expect(figure.locator('[data-row-id="beta"]')).toContainText('20.77');
    await expect(figure.locator('[data-row-id="dynamic-alpha-beta"]')).toContainText('—');
    await expect(page.locator('.paper-table__external-reference')).toContainText('SEED');
  });

  test('CSV and LaTeX exports preserve raw values and explicit missing status', async ({ request }) => {
    const rankCsv = await request.get('/research/seed-openevo/exports/rank32-capacity.csv');
    expect(rankCsv.ok()).toBe(true);
    expect(await rankCsv.text()).toContain('0.6297621936440276');

    const finalCsv = await request.get('/research/seed-openevo/exports/same-panel-final.csv');
    expect(finalCsv.ok()).toBe(true);
    const finalCsvText = await finalCsv.text();
    expect(finalCsvText).toContain('60.71597673160174');
    expect(finalCsvText).toContain('"NA"');

    const rankTex = await request.get('/research/seed-openevo/exports/rank32-capacity.tex');
    expect(rankTex.ok()).toBe(true);
    expect(await rankTex.text()).toContain('\\toprule');

    const finalTex = await request.get('/research/seed-openevo/exports/same-panel-final.tex');
    expect(finalTex.ok()).toBe(true);
    expect(await finalTex.text()).toContain('\\textemdash{}');
  });

  test('200% content zoom does not create root overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');
    await page.evaluate(() => { document.body.style.zoom = '2'; });
    const rootOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(rootOverflow).toBe(false);
  });
});
