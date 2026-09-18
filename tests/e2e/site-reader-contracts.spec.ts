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
          const primaryHeading = root.querySelector('h1');
          const primaryHeadingSize = primaryHeading ? Number.parseFloat(getComputedStyle(primaryHeading).fontSize) : 0;
          const headings = [...root.querySelectorAll('h1,h2,h3')].filter((el) => {
            if (!inFirstScreen(el)) return false;
            if (el.tagName === 'H1') return true;
            const rect = el.getBoundingClientRect();
            const fontSize = Number.parseFloat(getComputedStyle(el).fontSize);
            // A later chapter may naturally peek into the bottom of a short phone
            // viewport. It only competes with the first-screen task when it arrives
            // before the final fifth or carries equal/greater visual weight than H1.
            // This preserves the attention budget without incentivizing fake spacer/min-height hacks.
            return rect.top < innerHeight * 0.8 || fontSize >= primaryHeadingSize;
          }).length;
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


test('Study phone first screen exposes exactly the five experiment parents', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

  const visible = await page.locator('#main-content [data-experiment-primary]').evaluateAll((links) => links
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
      return rect.width > 0 && rect.height > 0 && visibleHeight >= Math.min(12, Math.max(2, rect.height * 0.25))
        && style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > 0;
    })
    .map((el) => el.getAttribute('data-experiment-primary')));

  expect(visible).toEqual([
    'gate-no-update',
    '7b-long-run',
    'successor-3b-1p7b',
    'gdr-v1-1p7b',
    'directapply-1p7b',
  ]);
  const visibleChildren = await page.locator('#main-content .experiment-children a').evaluateAll((links) => links.filter((el) => el.getClientRects().length > 0).length);
  expect(visibleChildren).toBe(0);
  const featured = page.locator('#main-content .experiment-mobile-featured--group');
  await expect(featured).toHaveCount(1);
  await expect(featured).toBeVisible();
  await expect(featured.locator(':scope > strong')).toHaveText('SD-LoRA 加速');
  const branchLinks = featured.locator('a');
  await expect(branchLinks).toHaveCount(3);
  await expect(branchLinks.nth(0)).toBeVisible();
  await expect(branchLinks.nth(0)).toHaveText(/两条路线说明/);
  await expect(branchLinks.nth(0)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/sd-lora-history/');
  await expect(branchLinks.nth(1)).toBeVisible();
  await expect(branchLinks.nth(1)).toHaveText(/Stable Reduction/);
  await expect(branchLinks.nth(1)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/');
  await expect(branchLinks.nth(2)).toBeVisible();
  await expect(branchLinks.nth(2)).toHaveText(/Bounded Online Recurrence/);
  await expect(branchLinks.nth(2)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/');
});


test('Study desktop nests the SD-LoRA overview, two acceleration branches, and the Effective-State successor under one indented directory group', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ['/research/seed-openevo/study/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const directApply = page.locator('[data-experiment-primary="directapply-1p7b"]').locator('..').locator('..');
    const expectedGroupLabel = 'SD-LoRA 加速';
    const group = directApply.locator('.experiment-child-group').filter({ hasText: expectedGroupLabel });
    await expect(group).toHaveCount(1);
    await expect(group.locator(':scope > strong')).toHaveText(expectedGroupLabel);
    const links = group.locator(':scope > ul a');
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toContainText('两条路线说明');
    await expect(links.nth(0)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/sd-lora-history/');
    await expect(links.nth(1)).toContainText('Stable Reduction');
    await expect(links.nth(2)).toContainText('Bounded Online Recurrence');
    await expect(links.nth(3)).toContainText('Effective-State GDR');
    await expect(links.nth(3)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
    const geometry = await group.evaluate((element) => {
      const label = element.querySelector(':scope > strong')?.getBoundingClientRect();
      const branchLinks = [...element.querySelectorAll(':scope > ul a')].map((link) => link.getBoundingClientRect());
      return label ? { labelX: label.x, branchX: branchLinks.map((box) => box.x) } : null;
    });
    expect(geometry).not.toBeNull();
    expect(geometry!.branchX.every((x) => x >= geometry!.labelX + 8)).toBe(true);
  }
});


test('briefing scales the whole 16:9 slide to iPhone width without horizontal scrolling and caps desktop at 1280×720', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/briefing/#capacity-diagnostic', { waitUntil: 'networkidle' });
  const phone = await page.evaluate(() => {
    const slide = document.querySelector('#capacity-diagnostic');
    const deck = document.querySelector('[data-testid="progress-briefing"]');
    const inner = slide?.querySelector('.slide-inner');
    if (!slide || !deck || !inner) return null;
    const box = slide.getBoundingClientRect();
    const innerBox = inner.getBoundingClientRect();
    const innerStyle = getComputedStyle(inner);
    const matrix = new DOMMatrixReadOnly(innerStyle.transform);
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      slideWidth: box.width,
      slideHeight: box.height,
      scale: Number.parseFloat(getComputedStyle(deck).getPropertyValue('--deck-scale')),
      internalCssWidth: Number.parseFloat(innerStyle.width),
      internalCssHeight: Number.parseFloat(innerStyle.height),
      internalRenderedWidth: innerBox.width,
      internalRenderedHeight: innerBox.height,
      internalTransformScaleX: matrix.a,
      internalTransformScaleY: matrix.d,
    };
  });
  expect(phone).not.toBeNull();
  expect(phone!.documentWidth).toBeLessThanOrEqual(phone!.viewport + 2);
  expect(phone!.slideWidth).toBeCloseTo(phone!.viewport, 0);
  expect(phone!.slideHeight / phone!.slideWidth).toBeCloseTo(9 / 16, 3);
  expect(phone!.scale).toBeCloseTo(390 / 1280, 4);
  // Guard the exact failure the owner caught: an outer 390px box is not enough if
  // the inner desktop slide reflows/squeezes. The internal coordinate system must
  // remain literal 1280×720 and only its rendered transform may scale down.
  expect(phone!.internalCssWidth).toBeCloseTo(1280, 1);
  expect(phone!.internalCssHeight).toBeCloseTo(720, 1);
  expect(phone!.internalRenderedWidth).toBeCloseTo(phone!.slideWidth, 1);
  expect(phone!.internalRenderedHeight).toBeCloseTo(phone!.slideHeight, 1);
  expect(phone!.internalTransformScaleX).toBeCloseTo(390 / 1280, 4);
  expect(phone!.internalTransformScaleY).toBeCloseTo(390 / 1280, 4);

  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto('/research/seed-openevo/study/briefing/#capacity-diagnostic', { waitUntil: 'networkidle' });
  const desktop = await page.locator('#capacity-diagnostic').boundingBox();
  expect(desktop).not.toBeNull();
  expect(desktop!.width).toBe(1280);
  expect(desktop!.height).toBe(720);
});
