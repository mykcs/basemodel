import { expect, test } from '@playwright/test';
import { SITE_READER_CONTRACTS } from '../../src/data/siteReaderContracts';

const viewports = [
  { name: 'desktop', width: 1280, height: 633 },
  { name: 'phone', width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`site reader contracts stay visible in the ${viewport.name} first screen`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const failures: string[] = [];

    for (const contract of SITE_READER_CONTRACTS) {
      const response = await page.goto(contract.samplePath, { waitUntil: 'domcontentloaded' });
      if (!response) {
        failures.push(`${contract.id}: no response for ${contract.samplePath}`);
        continue;
      }
      if (response.status() >= 500) failures.push(`${contract.id}: HTTP ${response.status()}`);
      if (contract.redirectsTo) {
        try {
          await page.waitForURL((url) => url.pathname.endsWith(contract.redirectsTo!), { timeout: 5_000 });
          await page.waitForLoadState('networkidle', { timeout: 5_000 });
          if (contract.firstViewportSelector) await page.locator(contract.firstViewportSelector).waitFor({ state: 'visible', timeout: 5_000 });
          await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        } catch {
          failures.push(`${contract.id}: compatibility redirect did not settle on its target`);
        }
      }

      const body = page.locator('body');
      const renderedId = await body.getAttribute('data-reader-contract-id');
      const renderedMode = await body.getAttribute('data-reader-attention-mode');
      if (contract.redirectsTo) {
        const target = SITE_READER_CONTRACTS.find((row) => row.samplePath === contract.redirectsTo || row.sourceRoute === contract.redirectsTo);
        if (!page.url().includes(contract.redirectsTo)) failures.push(`${contract.id}: compatibility route did not reach ${contract.redirectsTo}`);
        if (target && renderedId !== target.id) failures.push(`${contract.id}: redirect rendered ${renderedId} instead of target ${target.id}`);
      } else {
        if (renderedId !== contract.id) failures.push(`${contract.id}: rendered contract id mismatch`);
        if (renderedMode !== contract.attentionMode) failures.push(`${contract.id}: rendered attention mode mismatch`);
      }

      if (!contract.redirectsTo) {
        const h1 = page.locator('#main-content h1').first();
        if (await h1.count() !== 1 || !(await h1.isVisible())) {
          failures.push(`${contract.id}: primary h1 is not visible`);
        } else {
          const box = await h1.boundingBox();
          const text = (await h1.textContent())?.trim() ?? '';
          if (!text) failures.push(`${contract.id}: primary h1 is empty`);
          if (!box || box.y < 0 || box.y > viewport.height * 0.82) failures.push(`${contract.id}: h1 starts too late for the first screen (${box?.y ?? 'no box'}px)`);
        }
      } else if (!contract.firstViewportSelector) {
        failures.push(`${contract.id}: compatibility redirect needs a target first-viewport selector`);
      }

      if (contract.firstViewportSelector) {
        const primary = page.locator(contract.firstViewportSelector).first();
        if (!(await primary.isVisible())) {
          failures.push(`${contract.id}: declared first-viewport message is not visible`);
        } else {
          const box = await primary.boundingBox();
          if (!box || box.y >= viewport.height || box.y + box.height > viewport.height + 2) failures.push(`${contract.id}: declared first-viewport message falls below the first screen`);
        }
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      if (overflow) failures.push(`${contract.id}: page-level horizontal overflow`);
    }

    expect(failures).toEqual([]);
  });
}
