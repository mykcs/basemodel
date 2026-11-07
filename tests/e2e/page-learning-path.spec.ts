import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const narrativePages = [
  { path: '/research/seed-openevo/flow/seed/', first: '一次任务的轨迹与反馈怎样产生' },
  { path: '/research/seed-openevo/flow/openevo/', first: '做完一题后，什么经验能留到下一题' },
  { path: '/research/seed-openevo/flow/benchmarks/', first: '两种任务环境里，Agent 分别做什么' },
  { path: '/research/seed-openevo/flow/alfworld/', first: 'Agent 怎样改变房间里的物体状态' },
  { path: '/research/seed-openevo/flow/loops/', first: 'SEED 和 OpenEvo 更新的到底是什么' },
  { path: '/methodology/', first: '为什么“未知”不能当作零' },
] as const;

for (const { path, first } of narrativePages) {
  test('one short learning path with real destinations on ' + path, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide).toBeVisible();
    const links = guide.getByRole('link');
    await expect(links).toHaveCount(3);
    await expect(links.first()).toContainText(first);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
    for (const link of await links.all()) {
      const hash = await link.getAttribute('href');
      expect(hash).toMatch(/^#[\w-]+$/);
      await expect(page.locator(hash!)).toHaveCount(1);
    }
    await links.last().click();
    const target = await links.last().getAttribute('href');
    await expect(page).toHaveURL(new RegExp(target!.replace('#', '#') + '$'));
    await expect(page.locator(target!)).toBeVisible();
    const offset = await page.locator(target!).evaluate((node) => node.getBoundingClientRect().top);
    expect(offset).toBeGreaterThan(45);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
  });
}

// 390/768/1280 remain explicit regressions for the original reader-path PR;
// 440×956 and 1440×1000 are the current project's primary acceptance sizes.
for (const width of [390, 440, 768, 1280, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test('reading path is quiet and legible at ' + width + ' ' + theme, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 440 ? 956 : width === 1440 ? 1000 : width === 1280 ? 633 : 844 });
      await page.addInitScript((t: string) => localStorage.setItem('atlas-theme', t), theme);
      await page.goto('/research/seed-openevo/flow/seed/', { waitUntil: 'domcontentloaded' });
      const guide = page.locator('[data-reader-guide]');
      await expect(guide).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(guide.locator('.page-learning-path__heading')).toHaveText('读完本页，你会弄清楚');
      const bg = await guide.evaluate(node => getComputedStyle(node).backgroundColor);
      expect(bg).toBe('rgba(0, 0, 0, 0)');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    });
  }
}

test('Flow comparison hub has four real reading destinations without a competing rail', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/research/seed-openevo/flow/');
  const disclosure = page.locator('.flow-learning-disclosure');
  const summary = disclosure.locator('summary');
  const guide = page.getByRole('navigation', { name: '本页学习路线' });
  await expect(summary).toBeVisible();
  await expect(disclosure).not.toHaveAttribute('open', '');
  await expect(guide).toBeHidden();
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(guide).toBeVisible();
  const links = guide.locator('a[href^="#"]');
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#[\w-]+$/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  await links.nth(2).focus();
  await expect(links.nth(2)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#site-map$/);
  await expect(page.locator('#site-map')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});

test('distinct page roles do not accumulate redundant guides and anonymous rails', async ({ page }) => {
  for (const path of ['/', '/models/', '/papers/', '/research/seed-openevo/study/results/', '/models/kimi-k2-thinking/']) {
    await page.goto(path);
    await expect(page.locator('[data-reader-guide]')).toHaveCount(0);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  }
  await page.goto('/papers/metagpt/');
  const hasRichGuide = await page.locator('.learning-track-nav').count();
  if (hasRichGuide) {
    await expect(page.locator('[data-reader-guide]')).toHaveCount(0);
    await expect(page.locator('[data-page-outline].is-visible')).toHaveCount(0);
  } else {
    await expect(page.locator('[data-reader-guide]')).toHaveCount(1);
  }
});

test('learning path remains useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 440, height: 956 } });
  try {
    const page = await context.newPage();
    await page.goto('/methodology/');
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide.getByRole('link')).toHaveCount(3);
    await guide.getByRole('link').last().click();
    await expect(page).toHaveURL(/#recommendation-boundary$/);
    await expect(page.locator('#recommendation-boundary')).toBeVisible();
  } finally { await context.close(); }
});

test('keyboard user can follow the evidence path without a mouse', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/research/seed-openevo/flow/seed/');
  const first = page.getByRole('navigation', { name: '本页学习路线' }).getByRole('link').first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#seed-responsibilities$/);
  await expect(page.locator('#seed-responsibilities')).toBeVisible();
});

test('Flow hub native chapter disclosure works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 440, height: 956 } });
  try {
    const page = await context.newPage();
    await page.goto('/research/seed-openevo/flow/');
    const disclosure = page.locator('.flow-learning-disclosure');
    const guide = page.getByRole('navigation', { name: '本页学习路线' });
    await expect(guide).toBeHidden();
    await disclosure.locator('summary').click();
    await expect(guide).toBeVisible();
    await expect(guide.getByRole('link')).toHaveCount(4);
    await guide.getByRole('link').last().click();
    await expect(page).toHaveURL(/#evidence$/);
    await expect(page.locator('#evidence')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});


// A second heading is allowed on the Home *only* when it is the naturally
// reached Current answer chapter, unmistakably smaller than the question H1.
// The older one-heading proxy failed on a good, directly inspected screenshot.
// Keep a source-bound visual hierarchy witness, not a generalized budget raise
// or a full-screen spacer to move the next section out of view.
test('Home has one primary question and a subordinate evidence heading, not competing hero titles', async ({ page }) => {
  for (const { width, height } of [
    { width: 390, height: 844 }, // exact Reader Contract phone viewport
    { width: 440, height: 956 },
    { width: 1440, height: 1000 },
  ] as const) {
    for (const theme of ['light', 'dark'] as const) {
      await page.setViewportSize({ width, height });
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('#main-content h1')).toHaveCount(1);
      await expect(page.locator('#mission-title')).toBeVisible();
      await expect(page.locator('#answer-title')).toBeVisible();
      const measured = await page.evaluate(() => {
        const primary = document.querySelector<HTMLElement>('#mission-title')!;
        const answer = document.querySelector<HTMLElement>('#answer-title')!;
        const cta = document.querySelector<HTMLElement>('.mission-hero__actions > a')!;
        const hero = document.querySelector<HTMLElement>('.mission-hero__copy')!;
        const h1Size = parseFloat(getComputedStyle(primary).fontSize);
        const h2Size = parseFloat(getComputedStyle(answer).fontSize);
        const answerBox = answer.getBoundingClientRect();
        const ctaBox = cta.getBoundingClientRect();
        const heroBox = hero.getBoundingClientRect();
        return {
          h1Size, h2Size,
          h1Weight: getComputedStyle(primary).fontWeight,
          answerTop: answerBox.top,
          ctaBottom: ctaBox.bottom,
          heroBottom: heroBox.bottom,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
          nextSectionTitles: [...document.querySelectorAll('#main-content h2')]
            .filter(el => {
              const box = el.getBoundingClientRect();
              return box.top >= 0 && box.top < innerHeight;
            }).map(el => el.id),
        };
      });
      // A new hero-size H2 would be a real competing visual title.
      expect(measured.h2Size / measured.h1Size, 'the Current answer must remain visually subordinate').toBeLessThan(0.86);
      expect(measured.answerTop - measured.ctaBottom, 'the evidence chapter must follow the primary CTA').toBeGreaterThan(72);
      expect(measured.heroBottom - measured.ctaBottom, 'do not hide a third competing owner with blank hero space').toBeLessThan(96);
      expect(measured.nextSectionTitles, 'only the Current answer H2 may reach the first viewport').toEqual(
        measured.answerTop < height ? ['answer-title'] : [],
      );
      if (width !== 390) {
        expect(measured.answerTop, 'Current answer should be discoverable without scrolling').toBeLessThan(height);
      }
      expect(measured.documentWidth - measured.viewportWidth, 'no root horizontal overflow').toBeLessThanOrEqual(2);
    }
  }
});

// The comparison design's 3B example must not be confused with the 7B / 1.7B
// evidence rows. Check real rendered copy in both themes and viewport sizes.
test('Home explicitly separates comparison model from measured findings', async ({ page }) => {
  for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
    for (const theme of ['light', 'dark'] as const) {
      await page.setViewportSize({ width, height });
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const lead = page.locator('.mission-hero:not(.mission-hero--compact) .mission-hero__lede');
      await expect(lead).toContainText('Qwen2.5-3B-Instruct');
      await expect(lead).toContainText('下方 7B 与 1.7B 来自另外的实验');
      await expect(lead).toContainText('完整的方法对方法比较仍未完成');
      await expect(page.locator('.home-answer .answer-row')).toHaveCount(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    }
  }
});

// The homepage naturally sizes its hero so the Current answer enters the first screen without a blank slide.
// Keep the attention budget fixed: the evidence CTA is primary; an optional
// provenance disclosure is the second interactive target. Flow is still
// discoverable below the findings in the existing task-navigation owner.
test('home first screen has one evidence CTA plus accessible provenance, with Flow preserved below', async ({ page }) => {
  for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const actions = page.locator('.mission-hero__actions > a');
    await expect(actions).toHaveCount(1);
    await expect(actions.first()).toHaveAttribute('href', '/research/seed-openevo/study/results/');
    const details = page.locator('.mission-hero__secondary');
    const summary = details.locator('summary');
    await expect(summary).toBeVisible();
    await expect(details).not.toHaveAttribute('open', '');
    const heading = await page.locator('#answer-title').boundingBox();
    expect(heading?.y).toBeLessThan(height);
    expect(heading!.y + heading!.height).toBeLessThan(height);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('.mission-status')).toBeVisible();
    const flow = page.locator('.home-next .next-list a[href="/research/seed-openevo/flow/"]');
    await expect(flow).toHaveCount(1);
    await expect(flow).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
  }
});

// The three Current answer links share short visible copy but point to
// different research evidence. Distinct accessible names let a screen-reader
// link list identify each destination without changing the visual hierarchy.
for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Home evidence links name their findings at ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const rows = page.locator('.home-answer .answer-row');
      await expect(rows).toHaveCount(3);
      const names: string[] = [];
      for (const row of await rows.all()) {
        const title = (await row.locator('h3').innerText()).trim();
        const link = row.getByRole('link', { name: `查看证据：${title}`, exact: true });
        await expect(link).toHaveCount(1);
        await expect(link).toContainText('查看证据');
        expect(await link.getAttribute('href')).toMatch(/^\/research\/seed-openevo\//);
        names.push((await link.getAttribute('aria-label'))!);
        await link.focus();
        await expect(link).toBeFocused();
      }
      expect(new Set(names).size).toBe(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
      // Every homepage evidence CTA must lead to a real in-page target, not a stale hash.
      // The third finding is about the next fair method comparison on Results.
      const methodComparison = rows.nth(2).getByRole('link');
      await expect(methodComparison).toHaveAttribute('href', '/research/seed-openevo/study/results/#next-steps');
      await methodComparison.click();
      await expect(page).toHaveURL(/\/research\/seed-openevo\/study\/results\/#next-steps$/);
      await expect(page.locator('#next-steps')).toHaveCount(1);
    });
  }
}

// Results must bring the next scientific reading control into the first viewport.
// A nearly-full-viewport min-height left an empty region after the measured
// finding while pushing the expandable experiment progress below the fold.
// The statistical uncertainty and execution boundary remain in the primary finding.
for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Results exposes the bounded finding and next reading step at ${width} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/results/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const finding = page.locator('.results-primary');
      await expect(finding).toBeVisible();
      await expect(finding).toContainText('两边各完成 128 个任务');
      await expect(finding).toContainText('还不能写成');
      await expect(finding.locator('a[href="#evidence-q7"]')).toBeVisible();
      const details = page.locator('.progress-detail');
      const summary = details.locator('summary');
      await expect(summary).toBeVisible();
      const box = await summary.boundingBox();
      expect(box, 'Results progress summary should be laid out').not.toBeNull();
      expect(box!.y + box!.height, 'Results progress is hidden behind empty viewport space').toBeLessThan(height);
      const findingBox = await finding.boundingBox();
      expect(findingBox, 'Results primary conclusion must have a measurable position').not.toBeNull();
      const deadSpace = box!.y - (findingBox!.y + findingBox!.height);
      expect(deadSpace, 'Results must not add a blank slide between its finding and the next step').toBeGreaterThanOrEqual(0);
      expect(deadSpace, 'Results native progress should follow its conclusion without a viewport-sized spacer').toBeLessThan(112);
      await expect(details).not.toHaveAttribute('open', '');
      await summary.focus();
      await expect(summary).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(details).toHaveAttribute('open', '');
      await expect(details.locator('.abstract-row')).toHaveCount(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    });
  }
}

// Exact-head candidate visual receipts for human cold-read review.
// These are evidence captures, not an automated claim that the design reads well.
// GitHub-hosted Chromium/WebKit upload test-results/** so the source SHA,
// viewport and theme can be inspected without spending a provider deploy.
for (const { path, id } of [
  { path: '/', id: 'home' },
  { path: '/research/seed-openevo/flow/', id: 'flow' },
  { path: '/research/seed-openevo/study/results/', id: 'results' },
] as const) {
  for (const { width, height } of [{ width: 440, height: 956 }, { width: 1440, height: 1000 }] as const) {
    for (const theme of ['light', 'dark'] as const) {
      test(`candidate first-screen visual receipt: ${id} ${width} ${theme}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height });
        await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('#main-content h1')).toBeVisible();
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        const screenshotPath = testInfo.outputPath(`reader-${id}-${width}-${theme}.png`);
        await page.screenshot({ path: screenshotPath, animations: 'disabled', fullPage: false });
        const geometry = await page.evaluate(() => {
          const rectOf = (selector: string) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) };
          };
          return {
            viewport: { width: innerWidth, height: innerHeight },
            documentWidth: document.documentElement.scrollWidth,
            h1: rectOf('#main-content h1'),
            missionHero: rectOf('.mission-hero__copy'),
            missionActions: rectOf('.mission-hero__actions'),
            firstMissionSection: rectOf('.home-answer'),
            firstAnswerHeading: rectOf('#answer-title'),
          };
        });
        // Keep geometry in the Actions log too: reviewers can audit the first-answer
        // position without relying on access to a large artifact ZIP.
        console.log('[reader-first-screen-geometry] ' + JSON.stringify({ path, id, theme, ...geometry }));
        if (id === 'home') {
          expect(geometry.firstMissionSection, 'homepage current-answer section must have a real geometry owner').not.toBeNull();
          expect(geometry.missionActions, 'homepage primary links must have a real geometry owner').not.toBeNull();
          expect(geometry.firstAnswerHeading, 'homepage current-answer heading must have a real geometry owner').not.toBeNull();
          expect(geometry.firstAnswerHeading!.bottom, 'homepage current answer heading should enter the first screen without scrolling').toBeLessThan(geometry.viewport.height);
          expect(geometry.firstMissionSection!.top, 'the next section should follow the primary actions with real breathing room').toBeGreaterThan(geometry.missionActions!.bottom + 24);
          expect(geometry.missionHero!.bottom - geometry.missionActions!.bottom,
            'homepage must not reserve a blank viewport below its only primary CTA').toBeLessThan(96);
        }
        await testInfo.attach(`reader-${id}-${width}-${theme}`, { path: screenshotPath, contentType: 'image/png' });
        await testInfo.attach(`reader-${id}-${width}-${theme}-geometry`, {
          body: JSON.stringify({ path, theme, ...geometry }, null, 2),
          contentType: 'application/json',
        });
        expect(geometry.documentWidth - geometry.viewport.width, 'no root horizontal clipping').toBeLessThanOrEqual(2);
      });
    }
  }
}


// Flow regions must have accessible, uniquely named landmarks: the visible H2 is not enough for screen-reader
// region navigation when the section itself lacks a name. Keep the four
// existing reading-path targets and scientific copy unchanged.
const flowLandmarks = [
  { id: 'training-design', zh: 'SEED × OpenEVO 两阶段学习范式', en: 'SEED × OpenEVO two-stage learning paradigm' },
  { id: 'questions', zh: '模型、任务与比较范围', en: 'Models, tasks, and comparison scope' },
  { id: 'site-map', zh: '实验运行与结果比较', en: 'Experiment execution and result comparison' },
  { id: 'evidence', zh: '每轮都要留下可重建的证据', en: 'Every run must leave reconstructable evidence' },
] as const;

// Astro currently builds only the zh locale: astro.config.mjs has locales: ['zh'].
// Keep rendered landmark checks on a real published route, not a fabricated /en/
// path (which correctly returns HTTP 404). English labels remain a source-level
// translation contract until an English route is explicitly restored.
for (const viewport of [
  { width: 440, height: 956 },
  { width: 1440, height: 1000 },
]) for (const theme of ['light', 'dark'] as const) {
  test(`Flow's four reading sections expose named regions: zh ${viewport.width}px ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(value => localStorage.setItem('atlas-theme', value), theme);
    const response = await page.goto('/research/seed-openevo/flow/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

    const disclosure = page.locator('.flow-learning-disclosure');
    await disclosure.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');

    for (const landmark of flowLandmarks) {
      const name = landmark.zh;
      const section = page.getByRole('region', { name, exact: true });
      await expect(section, `${landmark.id} should be a uniquely named section landmark`).toHaveCount(1);
      await expect(section).toHaveAttribute('id', landmark.id);
      await expect(section.getByRole('heading', { name, exact: true })).toHaveCount(1);
      await expect(disclosure.locator(`a[href="#${landmark.id}"]`)).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
    await testInfo.attach('flow-landmarks-viewport', { body: await page.screenshot(), contentType: 'image/png' });
  });
}

test('Flow archived English section translations retain the same four heading labels', () => {
  // No live English route exists; this asserts source integrity, not English
  // browser accessibility or a published locale.
  const source = readFileSync(new URL('../../src/components/research/SeedOpenEvoResearchHub.astro', import.meta.url), 'utf8');
  for (const landmark of flowLandmarks) {
    expect(source).toContain(landmark.en);
    expect(source).toContain(landmark.zh);
  }
});

for (const width of [440, 1440] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Flow hub keeps a concrete evidence continuation at ${width}px ${theme}`, async ({ page }, testInfo) => {
      const height = width === 440 ? 956 : 1000;
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((value: string) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/flow/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const continuation = page.locator('[data-flow-next-step]');
      await expect(continuation).toBeVisible();
      const links = continuation.getByRole('link');
      await expect(links).toHaveCount(2);
      await expect(links.first()).toHaveAttribute('href', '/research/seed-openevo/study/results/');
      await expect(links.nth(1)).toHaveAttribute('href', '/models/qwen2-5-3b-instruct/#experiment-setup');
      // The prior CI screenshot covered only Flow's first viewport, not the new
      // footer CTA. Capture its actual scrolled state in every required theme/size.
      await continuation.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const footer = await continuation.boundingBox();
      expect(footer, 'Flow evidence continuation must have rendered geometry').not.toBeNull();
      expect(footer!.y).toBeGreaterThanOrEqual(-2);
      expect(footer!.y + footer!.height).toBeLessThanOrEqual(height + 2);
      await links.first().focus();
      await page.keyboard.press('Tab');
      await expect(links.nth(1)).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(links.first()).toBeFocused();
      await testInfo.attach(`flow-evidence-footer-${width}-${theme}`, {
        body: await page.screenshot(), contentType: 'image/png',
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
      await links.first().click();
      await expect(page).toHaveURL(/\/research\/seed-openevo\/study\/results\/$/);
      await expect(page.locator('.results-primary')).toBeVisible();
    });
  }
}
