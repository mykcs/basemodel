import { expect, test, type Page } from '@playwright/test';
import { CAPABILITY_READER_ROUTES } from '../../src/data/capabilityReaderRoutes';
import { OPEN_EVO_MECHANISM_EXPERIMENTS, mechanismDisplayState, mechanismStateSummary } from '../../src/data/openEvoMechanismNarrative';

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
    const selectors = '[data-reader-page] [data-reader-purpose], [data-reader-page] [data-reader-task], [data-lifecycle] dd, [data-reader-question], [data-result-status], [data-reader-answer]';
    const answers = document.querySelectorAll<HTMLElement>(selectors);
    if (answers.length === 0) failures.push('no reader answers found');
    const ownedAnswers = document.querySelectorAll('[data-orientation-field] dd, [data-state-lifecycle] dd, [data-research-step] summary em');
    if (ownedAnswers.length === 0) failures.push('no shared reader answers found');
    ownedAnswers.forEach((node) => {
      if (!node.matches('[data-reader-answer]')) failures.push('shared reader answer escaped geometry checks');
    });
    answers.forEach((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const name = node.textContent?.trim().slice(0, 45) ?? '';
      if (box.width === 0 || box.height === 0) failures.push(`hidden answer: ${name}`);
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
  // The previous six-route check covered orientation components only. Historical
  // bodies and expanded records must be readable in both locales as well.
  for (const locale of ['zh', 'en'] as const) {
    for (const width of [390, 1440]) {
      for (const theme of ['light', 'dark']) {
        test(`capability copy ${locale} ${width}px ${theme}: historical prose stays readable when expanded`, async ({ page }) => {
          test.setTimeout(120_000);
          await page.setViewportSize({ width, height: 1000 });
          await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
          const routeFailures: string[] = [];
          for (const route of CAPABILITY_READER_ROUTES) {
            const path = `${locale === 'en' ? '/en' : ''}${root}${route.route ? `${route.route}/` : ''}`;
            await page.goto(path, { waitUntil: 'domcontentloaded' });
            await expect(page.locator('[data-copy-review]'), path).toHaveCount(1);
            for (const expanded of [false, true]) {
              if (expanded) await page.locator('[data-copy-review] details').evaluateAll((nodes) => {
                nodes.forEach((node) => { (node as HTMLDetailsElement).open = true; });
              });
              const measured = await page.locator('[data-copy-review]').evaluate((owner) => {
                const failures: string[] = [];
                let count = 0;
                let owned = 0;
                owner.querySelectorAll<HTMLElement>('p, li, dd, td, small, span, strong, a').forEach((node) => {
                  // Nested components keep their own typography contracts.
                  // Astro's scope token identifies prose owned by this component.
                  const scope = owner.getAttributeNames().find((name) => name.startsWith('data-astro-cid-'));
                  if (scope && !node.hasAttribute(scope)) return;
                  if (!node.textContent?.trim()) return;
                  owned++;
                  if (!node.checkVisibility({ checkVisibilityCSS: true }) || node.closest('details:not([open])')) return;
                  count++;
                  const style = getComputedStyle(node);
                  const sample = node.textContent.trim().slice(0, 60);
                  if (parseFloat(style.fontSize) < 15.9) failures.push(`small prose: ${sample}`);
                  if (node.clientWidth && node.scrollWidth > node.clientWidth + 2) failures.push(`clipped prose: ${sample}`);
                });
                owner.querySelectorAll<HTMLElement>('.lineage-node, .patch-node').forEach((panel) => {
                  const button = panel.querySelector<HTMLElement>('button[data-first-run-detail]');
                  if (!button?.checkVisibility({ checkVisibilityCSS: true })) return;
                  const target = button.getBoundingClientRect();
                  panel.querySelectorAll('h3, p, strong, small').forEach((prose) => {
                    const range = document.createRange();
                    range.selectNodeContents(prose);
                    for (const rect of range.getClientRects()) {
                      if (Math.min(rect.right, target.right) - Math.max(rect.left, target.left) > 1 &&
                          Math.min(rect.bottom, target.bottom) - Math.max(rect.top, target.top) > 1) {
                        failures.push(`control overlaps prose: ${prose.textContent?.trim().slice(0, 60)}`);
                        break;
                      }
                    }
                  });
                });
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) failures.push('document overflow');
                return { owned, count, failures };
              });
              if (measured.owned === 0 || (expanded && measured.count === 0)) routeFailures.push(`${path}: no owned prose measured`);
              routeFailures.push(...measured.failures.map((failure) => `${path} expanded=${expanded}: ${failure}`));
            }
          }
          expect(routeFailures).toEqual([]);
        });
      }
    }
  }

  for (const locale of ['zh', 'en'] as const) {
    const prefix = locale === 'en' ? '/en' : '';
    test(`reader journey ${locale}: explanation precedes codes and every stop branch has a visible answer`, async ({ page }) => {
      await page.goto(`${prefix}${mechanism}`, { waitUntil: 'domcontentloaded' });
      const orientation = page.locator('[data-research-orientation]');
      await expect(orientation.locator('[data-orientation-field] dd')).toHaveCount(5);
      expect(await orientation.innerText()).not.toMatch(/\bM1-[ABCD]\b|\bA\/B\b/);
      await expect(orientation.locator('[data-orientation-field="state"] dd')).toHaveText(mechanismStateSummary(OPEN_EVO_MECHANISM_EXPERIMENTS, locale));
      const stop = orientation.locator('[data-orientation-field="finish"] dd');
      // Each assertion addresses a different missing-branch counterexample.
      for (const meaning of locale === 'zh' ? [/均未达门槛.*结束主线/, /另获批准/, /固定预算结束/, /1,440.*事后分析.*结束/] : [/Neither passes: end/, /separate release/, /fixed-budget learning/, /1,440.*verified post-hoc analysis/]) await expect(stop).toContainText(meaning);
      for (const row of OPEN_EVO_MECHANISM_EXPERIMENTS) {
        const state = mechanismDisplayState(row, locale);
        await expect(page.locator(`[data-experiment="${row.id}"] header`)).toContainText(state.execution);
        await expect(page.locator(`[data-experiment="${row.id}"] header`)).toContainText(state.result);
      }
      const bridge = page.locator('[data-learning-bridge]');
      await expect(bridge).toBeVisible();
      await expect(bridge).toContainText(locale === 'zh' ? /任务结束.*经验用于学习.*参数/ : /ends one task.*learn from its experience.*parameters/);
      await expect(page.locator('[data-accepted-definition]')).toContainText(locale === 'zh' ? '不按购物成绩挑选' : 'without selecting by shopping score');
      const score = page.locator('[data-score-explanation]');
      await expect(score).toBeVisible();
      for (const meaning of ['task_score', '100', '0.01', locale === 'zh' ? '不是多成功一次' : 'not one more successful task']) await expect(score).toContainText(meaning);
      const order = await page.evaluate(() => {
        const before = (a: string, b: string) => Boolean(document.querySelector(a)!.compareDocumentPosition(document.querySelector(b)!) & Node.DOCUMENT_POSITION_FOLLOWING);
        return [before('[data-reader-task]', '[data-learning-bridge]'), before('[data-learning-bridge]', '[data-accepted-definition]'), before('[data-accepted-definition]', '[data-parameter-case]'), before('[data-score-explanation]', '[data-reader-gate] a')];
      });
      expect(order).toEqual([true, true, true, true]);
    });
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

    test(`reader journey ${locale}: historical scope and final-result comparisons stay explicit`, async ({ page }) => {
      await page.goto(`${prefix}${root}openevo-2-0/report/`);
      await expect(page.locator('[data-learning-completion]')).toContainText(/160.*20,480.*7.*128/);
      await expect(page.locator('[data-reference-boundary]')).toContainText(locale === 'zh' ? /外部参考值.*不是.*配对对照/ : /external reference.*not paired controls/);
      await expect(page.locator('[data-final-score-meaning]')).toContainText(/37.60.*1\/128/);
      await page.goto(`${prefix}${root}stage2-256-window/`);
      await expect(page.locator('[data-testid="legacy-stage2-archive"]')).toContainText(locale === 'zh' ? /每组实验.*20,480/ : /20,480.*per arm/);
      await page.goto(`${prefix}${root}stage2-7b-analysis/`);
      await expect(page.locator('[data-historical-scope]')).toContainText(locale === 'zh' ? '不代表当前封存状态' : 'does not describe the current sealed state');
      await expect(page.locator('[data-historical-scope] a')).toHaveAttribute('href', `${prefix}${root}stage2-ceiling/`);
      await page.goto(`${prefix}${root}stage1-previous/`);
      const link = page.locator('.legacy-s1__back');
      await expect(link).toHaveAttribute('href', `${prefix}${root}first-run/`);
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
          for (const path of primaryReadingPaths) {
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
          const containment = await page.evaluate(() => {
            const width = document.documentElement.clientWidth;
            const escaped = [...document.querySelectorAll<HTMLElement>('[data-copy-review] *')]
              .filter((node) => node.checkVisibility({ checkVisibilityCSS: true }) && node.getBoundingClientRect().right > width + 2)
              .map((node) => ({ tag: node.tagName, class: node.className, right: Math.round(node.getBoundingClientRect().right), font: getComputedStyle(node).fontSize }))
              .slice(-12);
            return { overflow: document.documentElement.scrollWidth - width, escaped };
          });
          expect(containment.overflow, `${suffix}: ${JSON.stringify(containment.escaped)}`).toBeLessThanOrEqual(2);
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
