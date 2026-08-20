import { expect, test, type Page } from '@playwright/test';

const routes = ['/guide/openevo-webshop-alfworld/', '/en/guide/openevo-webshop-alfworld/'] as const;
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;
const forbidden = [
  'dev-wangr',
  'wangr-dev',
  '/data/home/wangr',
  'ssh wangrui_user',
  'ssh wangrui_root',
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(80);
}

test('public reproduction guide stays public-safe and content-height-driven', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of routes) {
      await test.step(`${viewport.name} ${path}`, async () => {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.ok(), `${path} returned ${response?.status()}`).toBe(true);
        await settle(page);

        const bodyText = await page.locator('body').innerText();
        for (const value of forbidden) expect(bodyText).not.toContain(value);
        expect(bodyText).not.toMatch(/GPU-[0-9a-f]{8,}(?:-[0-9a-f]{4,})+/i);
        expect(bodyText).not.toMatch(/(?:[0-9a-f]{2}:){5}[0-9a-f]{2}/i);

        for (const placeholder of ['<ordinary-account>', '<approved-control-account>', '<approved-persistent-workspace>', '<lab-infrastructure-checkout>']) {
          expect(bodyText).toContain(placeholder);
        }
        expect(bodyText).toContain('current-campaign');
        expect(bodyText.toLowerCase()).toContain('reconciliation');

        const gates = page.locator('.gate-runbook > li');
        await expect(gates).toHaveCount(12);
        const pageWidth = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
        expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client + 2);

        const blockAudit = await page.locator('.gate-runbook pre').evaluateAll((blocks) => blocks.map((block) => {
          const element = block as HTMLElement;
          const rect = element.getBoundingClientRect();
          const parent = element.closest('.gate-copy')?.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            height: Math.round(rect.height),
            minHeight: style.minHeight,
            right: rect.right,
            parentRight: parent?.right ?? rect.right,
          };
        }));
        expect(blockAudit).toHaveLength(12);
        expect(new Set(blockAudit.map((entry) => entry.height)).size).toBeGreaterThan(1);
        for (const entry of blockAudit) {
          expect(entry.minHeight).toBe('0px');
          expect(entry.right).toBeLessThanOrEqual(entry.parentRight + 2);
        }
      });
    }
  }
});
