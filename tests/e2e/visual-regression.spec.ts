import { expect, test, type Locator, type Page } from '@playwright/test';

const VIEWPORTS = [1440, 1280, 1024, 820, 768, 390, 360] as const;
const LOCALES = [
  { id: 'zh', prefix: '', search: '搜索' },
  { id: 'en', prefix: 'en/', search: 'Search' },
] as const;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

async function expectNoDocumentOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth, `document overflow at ${dimensions.clientWidth}px`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectNoOverlap(locator: Locator) {
  const boxes = await locator.evaluateAll((elements) => elements
    .filter((element) => getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden')
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }));
  for (let index = 0; index < boxes.length; index += 1) {
    for (let other = index + 1; other < boxes.length; other += 1) {
      const a = boxes[index]!;
      const b = boxes[other]!;
      const horizontal = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const vertical = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      expect(horizontal > 1 && vertical > 1, `overlap between controls ${index} and ${other}`).toBe(false);
    }
  }
}

async function takeRepresentativeScreenshot(locator: Locator, name: string, width: number, mask: Locator[] = []) {
  if (test.info().project.name !== 'chromium' || (width !== 1440 && width !== 390)) return;
  await expect(locator).toHaveScreenshot(`${name}-${width}.png`, {
    animations: 'disabled',
    caret: 'hide',
    mask,
    scale: 'css',
    maxDiffPixels: 0,
  });
}

test('header geometry and controls stay stable across bilingual viewports', async ({ page }) => {
  test.setTimeout(120_000);
  for (const locale of LOCALES) {
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 });
      await open(page, `${locale.prefix}models/`);
      const header = page.locator('.site-header');
      await expect(header).toBeVisible();
      await expect(page.locator('.command-search-trigger')).toHaveText(new RegExp(locale.search));
      await expectNoDocumentOverflow(page);
      await expectNoOverlap(page.locator('.nav-inner > *'));
      await expect(page.locator('.command-search-trigger')).toHaveCSS('position', 'static');
      if (width <= 960) {
        await expect(page.locator('.nav-inner > .lang-switch')).toBeHidden();
      } else {
        await expect(page.locator('.nav-inner > .lang-switch')).toBeVisible();
      }
      if (width <= 640) {
        await expect(page.locator('.nav-inner > .theme-toggle')).toBeHidden();
        await expect(page.locator('.mobile-menu .lang-switch')).toHaveCount(1);
        await expect(page.locator('.mobile-menu .theme-toggle')).toHaveCount(1);
      } else {
        await expect(page.locator('.nav-inner > .theme-toggle')).toBeVisible();
      }
      await takeRepresentativeScreenshot(header, `header-${locale.id}`, width);
    }
  }
});

test('dense bilingual pages keep facts, workflow connectors, and sticky tables inside their layout', async ({ page }) => {
  test.setTimeout(120_000);
  for (const locale of LOCALES) {
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 });

      await open(page, `${locale.prefix}models/qwen3-8b/`);
      await expectNoDocumentOverflow(page);
      const factGrid = page.locator('.fact-grid').first();
      const factColumns = await factGrid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
      expect(factColumns).toBe(width <= 560 ? 1 : 2);
      for (const fact of await page.locator('.fact-grid .fact').all()) {
        const size = await fact.evaluate((element) => ({ client: element.clientWidth, scroll: element.scrollWidth }));
        expect(size.scroll, `fact overflow at ${width}px`).toBeLessThanOrEqual(size.client + 1);
      }

      await open(page, `${locale.prefix}papers/seed/`);
      const workflow = page.locator('.workflow-flow');
      await expect(workflow).toBeVisible();
      const nodes = workflow.locator('.workflow-node');
      const arrows = workflow.locator('.workflow-arrow');
      expect(await arrows.count()).toBe((await nodes.count()) - 1);
      for (let index = 0; index < await nodes.count() - 1; index += 1) {
        const arrow = await nodes.nth(index).locator('.workflow-arrow').boundingBox();
        const nextNode = await nodes.nth(index + 1).boundingBox();
        expect(arrow).not.toBeNull();
        expect(nextNode).not.toBeNull();
        expect(arrow!.x + arrow!.width).toBeLessThanOrEqual(nextNode!.x + 1);
      }
      await takeRepresentativeScreenshot(page.locator('.paper-role-diagram'), `workflow-${locale.id}`, width);

      await open(page, `${locale.prefix}compare/?models=qwen3-8b,gpt-oss-20b`);
      await expectNoDocumentOverflow(page);
      const stickyHead = page.locator('.comparison-table thead th').first();
      await expect(stickyHead).toHaveCSS('position', 'sticky');
      const stickyTop = Number.parseFloat(await stickyHead.evaluate((element) => getComputedStyle(element).top));
      expect(stickyTop).toBe(0);
      await takeRepresentativeScreenshot(page.locator('.comparison-shell'), `comparison-${locale.id}`, width);

      await open(page, `${locale.prefix}papers/`);
      await page.locator('.paper-matrix-advanced > summary').click();
      const matrixHead = page.locator('.matrix-table thead th').first();
      await expect(matrixHead).toBeVisible();
      await expect(matrixHead).toHaveCSS('position', 'sticky');
      const matrixTop = Number.parseFloat(await matrixHead.evaluate((element) => getComputedStyle(element).top));
      expect(matrixTop).toBe(0);
      await takeRepresentativeScreenshot(page.locator('.matrix-wrap'), `matrix-${locale.id}`, width);

      await open(page, `${locale.prefix}data-status/`);
      const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
      for (const tableWrap of await page.locator('.comparison-table-wrap').all()) {
        const box = await tableWrap.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(-1);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
      }
      await expect(page.locator('.stats .stat')).toHaveCount(5);
      if (width <= 820 && width > 560) await expect(page.locator('.stats .stat').nth(3)).toHaveCSS('border-left-width', '0px');
      if (width <= 560) await expect(page.locator('.stats .stat').nth(1)).toHaveCSS('border-left-width', '0px');
      await takeRepresentativeScreenshot(page.locator('.stats'), `stats-${locale.id}`, width, [page.locator('.stats strong')]);
    }
  }
});

test('D3 tooltip and compare tray stay within the viewport in bilingual layouts', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    localStorage.setItem('atlas-compare', JSON.stringify(['qwen3-8b', 'gpt-oss-20b']));
  });

  for (const locale of LOCALES) {
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 });
      await open(page, `${locale.prefix}landscape/`);
      await page.getByRole('button', { name: /完整视图|Full view/ }).click();
      await page.getByRole('button', { name: 'D3', exact: true }).click();
      await expect(page.locator('.landscape-d3 svg')).toBeVisible();
      const pointIndex = await page.locator('.landscape-point').evaluateAll((elements) => elements
        .map((element, index) => ({ index, right: element.getBoundingClientRect().right }))
        .sort((a, b) => b.right - a.right)[0]?.index ?? 0);
      await page.locator('.landscape-point').nth(pointIndex).evaluate((element) => {
        const rect = element.getBoundingClientRect();
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX: rect.right - 1, clientY: rect.top + rect.height / 2 }));
        element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: rect.right - 1, clientY: rect.top + rect.height / 2 }));
      });
      await expect(page.locator('.landscape-tooltip')).toHaveCSS('opacity', '1');
      const chart = await page.locator('.landscape-d3').boundingBox();
      const tooltip = await page.locator('.landscape-tooltip').boundingBox();
      expect(chart).not.toBeNull();
      expect(tooltip).not.toBeNull();
      expect(tooltip!.x).toBeGreaterThanOrEqual(chart!.x - 1);
      expect(tooltip!.y).toBeGreaterThanOrEqual(chart!.y - 1);
      expect(tooltip!.x + tooltip!.width).toBeLessThanOrEqual(chart!.x + chart!.width + 1);
      expect(tooltip!.y + tooltip!.height).toBeLessThanOrEqual(chart!.y + chart!.height + 1);
      await takeRepresentativeScreenshot(page.locator('.landscape-chart-shell'), `landscape-${locale.id}`, width);

      await open(page, `${locale.prefix}workspace/`);
      const tray = page.locator('.compare-tray');
      await expect(tray).toBeVisible();
      const trayHeight = await tray.evaluate((element) => element.getBoundingClientRect().height);
      expect(trayHeight).toBeGreaterThan(0);
      const bodyPadding = Number.parseFloat(await page.locator('body').evaluate((element) => getComputedStyle(element).paddingBottom));
      expect(bodyPadding).toBeGreaterThanOrEqual(trayHeight - 1);
      if (width <= 820) {
        const nav = page.locator('.workspace-mobile-nav');
        await expect(nav).toBeVisible();
        const navBottom = Number.parseFloat(await nav.evaluate((element) => getComputedStyle(element).bottom));
        expect(navBottom).toBeGreaterThanOrEqual(12 + trayHeight - 1);
      }
    }
  }
});
