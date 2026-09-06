import { expect, test, type Page } from '@playwright/test';
import { CAPABILITY_READER_ROUTES } from '../../src/data/capabilityReaderRoutes';

const root = '/research/seed-openevo/study/capability-exploration/';
const mechanism = `${root}mechanism-1-0/`;
const primaryReadingPaths = [
  root,
  `${root}first-run/`,
  mechanism,
  `${root}openevo-2-0/`,
  `${root}openevo-2-0/report/`,
  `${root}openevo-2-0/exploration/`,
] as const;
const fields = ['start', 'action', 'stop', 'output'] as const;

async function assertVisibleReaderGeometry(page: Page) {
  const measured = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    const failures: string[] = [];
    const parse = (value: string): [number, number, number, number] => {
      const numbers = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return [numbers[0] ?? 0, numbers[1] ?? 0, numbers[2] ?? 0, numbers[3] ?? 1];
    };
    const luminance = (rgb: number[]) => rgb.slice(0, 3).map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0);
    const selectors = '[data-reader-page] [data-reader-purpose], [data-reader-page] [data-reader-task], [data-lifecycle] dd, [data-reader-question], [data-result-status]';
    const answers = document.querySelectorAll<HTMLElement>(selectors);
    if (answers.length === 0) failures.push('no reader answers found');
    answers.forEach((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const name = node.textContent?.trim().slice(0, 45) ?? '';
      if (box.width === 0 || box.height === 0 || node.closest('details:not([open])')) failures.push(`hidden answer: ${name}`);
      if (node.scrollWidth > node.clientWidth + 2) failures.push(`clipped answer: ${name}`);
      if (parseFloat(style.fontSize) < 15) failures.push(`small primary answer: ${name}`);
      const foreground = parse(style.color);
      let ancestor: HTMLElement | null = node;
      let background: number[] | null = null;
      while (ancestor) {
        const candidate = parse(getComputedStyle(ancestor).backgroundColor);
        if (candidate[3] >= 0.99) { background = candidate; break; }
        ancestor = ancestor.parentElement;
      }
      if (!background) failures.push(`unresolved background: ${name}`);
      else {
        const luminances = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        const ratio = (luminances[0]! + 0.05) / (luminances[1]! + 0.05);
        if (ratio < 4.5) failures.push(`low primary-text contrast ${ratio.toFixed(2)}: ${name}`);
      }
    });
    return { overflow, failures };
  });
  expect(measured).toEqual({ overflow: false, failures: [] });
}

export function registerReaderJourneyTests() {
  for (const locale of ['zh', 'en'] as const) {
    const prefix = locale === 'en' ? '/en' : '';
    test(`reader journey ${locale}: all declared routes provide task, purpose and one primary title`, async ({ page }) => {
      for (const route of CAPABILITY_READER_ROUTES) {
        const path = `${prefix}${root}${route.route ? `${route.route}/` : ''}`;
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), path).toBe(200);
        await expect(page.locator('h1'), path).toHaveCount(1);
        await expect(page.locator('[data-reader-context]'), path).toBeVisible();
        await expect(page.locator('[data-reader-purpose]').first(), path).toBeVisible();
        await expect(page.locator('[data-reader-task]').first(), path).toBeVisible();
        if (route.coverage === 'contextualized') {
          await expect(page.locator('[data-reader-route]')).toHaveAttribute('data-reader-route', route.route);
          await expect(page.locator('[data-reader-route] a')).toHaveAttribute('href', `${prefix}${root}`);
        }
      }
    });

    test(`reader journey ${locale}: starts, stops, outcomes and independent branch remain visible without JavaScript`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      try {
        await page.goto(`${prefix}${mechanism}`, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('[data-example-step]')).toHaveCount(4);
        for (const id of ['M1-A', 'M1-B', 'M1-C', 'M1-D']) {
          const experiment = page.locator(`[data-experiment="${id}"]`);
          for (const field of fields) await expect(experiment.locator(`[data-lifecycle="${field}"]`)).toBeVisible();
          await expect(experiment).toHaveAttribute('data-execution', id === 'M1-D' ? 'authorized' : 'locked');
          await expect(experiment).toHaveAttribute('data-results', 'unsealed');
        }
        const map = page.getByTestId('mechanism-dependency-map');
        for (const dependency of ['source', 'M1-A', 'M1-B', 'gate', 'M1-C', 'stop']) await expect(map.locator(`[data-dependency="${dependency}"]`)).toBeVisible();
        await expect(map.locator('[data-dependency="M1-D"]')).toHaveCount(0);
        await expect(page.locator('aside[data-dependency="M1-D"]')).toBeVisible();
        await expect(page.locator('[data-example-controls]')).toBeHidden();
        await expect(page.locator('[data-predecessor-status="not-identifiable"]')).toBeVisible();
        for (const gate of ['trajectory-seal', 'minimax-seal', 'matched-compare', 'hard-stop']) await expect(page.locator(`[data-gate="${gate}"]`)).toBeVisible();
        await expect(page.locator('[data-result-status]')).toContainText(locale === 'zh' ? '不表示模型得了零分' : 'does not mean the model scored zero');
        await assertVisibleReaderGeometry(page);
      } finally { await context.close(); }
    });

    for (const width of [390, 768, 1440]) {
      for (const theme of ['light', 'dark']) {
        test(`reader journey ${locale} ${width}px ${theme}: visible answer geometry and contrast`, async ({ page }) => {
          await page.setViewportSize({ width, height: 1000 });
          await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
          for (const path of [root, mechanism]) {
            await page.goto(`${prefix}${path}`, { waitUntil: 'domcontentloaded' });
            await page.evaluate(() => document.fonts.ready);
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
            const h1Size = await page.locator('h1').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
            expect(h1Size).toBeLessThanOrEqual(48);
            await assertVisibleReaderGeometry(page);
          }
        });
      }
    }

    test(`reader journey ${locale}: primary orientation fits the 1280x633 first screen`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 633 });
      for (const path of primaryReadingPaths) {
        await page.goto(`${prefix}${path}`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        const orientation = page.locator('[data-research-orientation]');
        await expect(orientation, path).toBeVisible();
        await expect(orientation.locator('[data-orientation-field]'), path).toHaveCount(5);
        const geometry = await orientation.evaluate((node) => {
          const box = node.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, viewport: window.innerHeight };
        });
        expect(geometry.bottom, `${path} orientation bottom`).toBeLessThanOrEqual(geometry.viewport + 2);
      }
    });

    test(`reader journey ${locale}: expanded disclosures stay page-overflow-safe on phone`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      for (const path of primaryReadingPaths) {
        await page.goto(`${prefix}${path}`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
          document.querySelectorAll<HTMLDetailsElement>('details').forEach((node) => { node.open = true; });
        });
        const geometry = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(geometry.scrollWidth, path).toBeLessThanOrEqual(geometry.clientWidth + 2);
      }
    });
  }

  test('reader journey: manual illustration is keyboard-operable and never changes experiment state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(mechanism, { waitUntil: 'domcontentloaded' });
    const before = await page.locator('[data-reader-status]').allInnerTexts();
    const next = page.locator('[data-example-next]');
    await expect(next).toBeVisible();
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-example-position]')).toHaveText('2 / 4');
    await expect(page.locator('[data-example-step="1"]')).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('[data-example-explanation]')).toContainText('一次动作不是一次完整任务');
    const previous = page.locator('[data-example-previous]');
    await previous.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-example-position]')).toHaveText('1 / 4');
    for (let i = 0; i < 3; i++) await next.click();
    await expect(next).toBeDisabled();
    await page.locator('[data-example-reset]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-example-position]')).toHaveText('1 / 4');
    expect(await page.locator('[data-reader-status]').allInnerTexts()).toEqual(before);
    await expect(page.locator('[role="progressbar"]')).toHaveCount(0);
    // The site-wide reduced-motion owner keeps a tiny !important duration.
    // This component disables transition properties entirely; inspect actual
    // motion semantics rather than the irrelevant duration serialization.
    expect(await page.locator('[data-example-step]').first().evaluate((node) => ({
      property: getComputedStyle(node).transitionProperty,
      activeAnimations: node.getAnimations().length,
    }))).toEqual({ property: 'none', activeAnimations: 0 });
    const disclosure = page.locator('#causal-experiments details');
    await disclosure.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(disclosure).toContainText('R27 / R49 / R49 / R49');
    await page.getByTestId('mechanism-dependency-map').locator('a[href="#m1-c"]').click();
    await expect(page).toHaveURL(/#m1-c$/);
    await expect(page.locator('#m1-c [data-lifecycle="start"]')).toBeVisible();
  });

  for (const locale of ['zh', 'en'] as const) {
    const prefix = locale === 'en' ? '/en' : '';
    test(`reader explanation ${locale}: shopping scene and parameter changes expose different objects`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${prefix}${mechanism}`);
      const scene = page.locator('[data-shopping-scene]');
      await expect(scene).toBeVisible();
      await expect(scene.locator('[data-shopping-frame="0"]')).toBeVisible();
      const brief = await scene.locator('.shopping-scene__brief').innerText();
      const status = await page.locator('[data-reader-status]').allInnerTexts();
      await page.locator('[data-example-next]').click();
      await expect(scene.locator('[data-shopping-frame="1"]')).toBeVisible();
      await expect(scene.locator('[data-shopping-frame="1"]')).toContainText('$24');
      await page.locator('[data-example-next]').click();
      await expect(scene.locator('[data-shopping-frame="2"]')).toBeVisible();
      await page.locator('[data-example-next]').click();
      await expect(scene.locator('[data-shopping-frame="3"]')).toBeVisible();
      expect(await scene.locator('.shopping-scene__brief').innerText()).toBe(brief);
      const comparison = page.locator('[data-parameter-example]');
      await expect(comparison.locator('[data-parameter-case="baseline"]')).toBeVisible();
      await comparison.locator('input[value="learned"]').check();
      await expect(comparison.locator('[data-parameter-case="learned"]')).toBeVisible();
      await comparison.locator('input[value="random"]').focus();
      await page.keyboard.press('Space');
      await expect(comparison.locator('[data-parameter-case="random"]')).toBeVisible();
      await expect(comparison.locator('[data-parameter-case="learned"]')).toBeHidden();
      await expect(comparison.locator('.parameter-example__fixed')).toBeVisible();
      expect(await page.locator('[data-reader-status]').allInnerTexts()).toEqual(status);
      await assertVisibleReaderGeometry(page);
    });

    test(`reader explanation ${locale}: static comparisons and report chronology survive narrow expanded layout`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 844 }, colorScheme: 'dark' });
      const page = await context.newPage();
      try {
        await page.goto(`${prefix}${mechanism}`);
        for (const name of ['baseline', 'learned', 'random']) await expect(page.locator(`[data-parameter-case="${name}"]`)).toBeVisible();
        for (let step = 0; step < 4; step++) await expect(page.locator(`[data-shopping-frame="${step}"]`)).toBeVisible();
        await expect(page.locator('[data-parameter-controls]')).toBeHidden();
        for (const suffix of ['openevo-2-0/', 'openevo-2-0/report/', 'openevo-2-0/exploration/']) {
          await page.goto(`${prefix}${root}${suffix}`);
          await expect(page.locator('h1')).toHaveCount(1);
          for (const summary of await page.locator('details > summary').all()) {
            if (await summary.isVisible()) await summary.click();
          }
          expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
          if (suffix.includes('/report/')) {
            await expect(page.locator('.report-chronology tbody tr')).toHaveCount(3);
            await expect(page.locator('.paper-step__meaning')).toHaveCount(12);
            const styles = await page.locator('.paper-step__meaning').evaluateAll((nodes) => nodes.map((node) => ({
              size: parseFloat(getComputedStyle(node).fontSize),
              width: node.getBoundingClientRect().width,
            })));
            expect(styles.every((style) => style.size >= 16 && style.width >= 200)).toBe(true);
            await expect(page.locator('[data-paper-step="boundary"] h2')).toContainText(locale === 'zh' ? '当时' : 'at that time');
          }
        }
      } finally { await context.close(); }
    });
  }

}
