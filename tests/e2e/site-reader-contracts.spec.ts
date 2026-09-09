import { expect, test } from '@playwright/test';
import { SITE_READER_CONTRACTS, type ReaderAttentionMode } from '../../src/data/siteReaderContracts';

const viewports = [
  { name: 'desktop', width: 1280, height: 633 },
  { name: 'phone', width: 390, height: 844 },
] as const;

const defaultBudgets: Record<ReaderAttentionMode, { maxInteractive: number; maxHeadings: number; maxTextChars: number }> = {
  focus: { maxInteractive: 12, maxHeadings: 4, maxTextChars: 1_300 },
  choice: { maxInteractive: 14, maxHeadings: 4, maxTextChars: 1_400 },
  reference: { maxInteractive: 14, maxHeadings: 5, maxTextChars: 1_500 },
  operational: { maxInteractive: 14, maxHeadings: 5, maxTextChars: 1_500 },
  narrative: { maxInteractive: 16, maxHeadings: 5, maxTextChars: 1_700 },
  comparison: { maxInteractive: 16, maxHeadings: 5, maxTextChars: 1_700 },
};

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
      try {
        await page.waitForLoadState('networkidle', { timeout: 5_000 });
      } catch {
        // Hydrated pages may retain background work; two animation frames below
        // still prevent us from measuring the pre-layout DOMContentLoaded state.
      }
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

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

      if (!contract.redirectsTo) {
        const metrics = await page.evaluate(() => {
          const root = document.querySelector('#main-content');
          if (!root) return { interactive: 0, headings: 0, textChars: 0 };

          const inFirstScreen = (el: Element) => {
            const closedDetails = el.closest('details:not([open])');
            if (closedDetails) {
              const summary = closedDetails.querySelector(':scope > summary');
              if (!summary || !summary.contains(el)) return false;
            }
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
            const meaningfulVisibleHeight = Math.min(12, Math.max(2, rect.height * 0.25));
            return rect.width > 0
              && rect.height > 0
              && visibleHeight >= meaningfulVisibleHeight
              && style.display !== 'none'
              && style.visibility !== 'hidden'
              && Number.parseFloat(style.opacity || '1') > 0;
          };

          const interactive = [...root.querySelectorAll('a,button,input:not([type="hidden"]),select,textarea,summary')].filter(inFirstScreen).length;
          const headings = [...root.querySelectorAll('h1,h2,h3')].filter(inFirstScreen).length;
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          let textChars = 0;
          while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? '';
            if (!text) continue;
            const parent = node.parentElement;
            if (!parent || !inFirstScreen(parent)) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight) textChars += text.length;
          }
          return { interactive, headings, textChars };
        });

        const budget = contract.firstViewportBudget ?? defaultBudgets[contract.attentionMode];
        if (metrics.interactive > budget.maxInteractive) failures.push(`${contract.id}: ${metrics.interactive} first-screen interactive targets exceed budget ${budget.maxInteractive}`);
        if (metrics.headings > budget.maxHeadings) failures.push(`${contract.id}: ${metrics.headings} first-screen headings exceed budget ${budget.maxHeadings}`);
        if (metrics.textChars > budget.maxTextChars) failures.push(`${contract.id}: ${metrics.textChars} first-screen text characters exceed budget ${budget.maxTextChars}`);
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      if (overflow) failures.push(`${contract.id}: page-level horizontal overflow`);
    }

    expect(failures).toEqual([]);
  });
}


test('briefing scales the whole 16:9 slide to iPhone width without horizontal scrolling and caps desktop at 1280×720', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/briefing/#capacity-diagnostic', { waitUntil: 'networkidle' });
  const phone = await page.evaluate(() => {
    const slide = document.querySelector('#capacity-diagnostic');
    const deck = document.querySelector('[data-testid="progress-briefing"]');
    if (!slide || !deck) return null;
    const box = slide.getBoundingClientRect();
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      slideWidth: box.width,
      slideHeight: box.height,
      scale: Number.parseFloat(getComputedStyle(deck).getPropertyValue('--deck-scale')),
    };
  });
  expect(phone).not.toBeNull();
  expect(phone!.documentWidth).toBeLessThanOrEqual(phone!.viewport + 2);
  expect(phone!.slideWidth).toBeCloseTo(phone!.viewport, 0);
  expect(phone!.slideHeight / phone!.slideWidth).toBeCloseTo(9 / 16, 3);
  expect(phone!.scale).toBeCloseTo(390 / 1280, 4);

  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto('/research/seed-openevo/study/briefing/#capacity-diagnostic', { waitUntil: 'networkidle' });
  const desktop = await page.locator('#capacity-diagnostic').boundingBox();
  expect(desktop).not.toBeNull();
  expect(desktop!.width).toBe(1280);
  expect(desktop!.height).toBe(720);
});
