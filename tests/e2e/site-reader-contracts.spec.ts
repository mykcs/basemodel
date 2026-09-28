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

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`Stage1 first viewport keeps optimization and capability distinct at ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const h1 = page.locator('#main-content h1');
      const result = page.locator('#main-content [data-stage1-result]');
      await expect(h1).toContainText('WebShop');
      await expect(result).toBeVisible();
      await expect(result).toContainText('2.713 → 0.830');
      await expect(result).toContainText('0.0369 → 0.0352 → 0 → 0');
      await expect(result).toContainText('final panel');
      await expect(result).toContainText('完整 Stage2 未测试');

      const geometry = await result.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, viewport: innerHeight };
      });
      expect(geometry.top).toBeGreaterThanOrEqual(0);
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport + 2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    });
  }
}

for (const width of [390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`Bounded capacity answer and historical boundary fit at ${width}px ${theme}`, async ({ page }) => {
      const height = width === 768 ? 1024 : width === 1440 ? 1000 : 844;
      await page.setViewportSize({ width, height });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('#main-content h1')).toContainText('固定状态需要多大容量');
      const result = page.locator('#main-content [data-bounded-capacity-result]');
      const boundary = page.locator('#main-content [data-bounded-capacity-boundary]');
      await expect(result).toContainText('205,551,528 B');
      await expect(result).toContainText('51,410,296 B');
      await expect(result).toContainText('0.6298 → 0.6119');
      await expect(result).toContainText('341 / 1024 → 350 / 1024');
      await expect(boundary).toContainText('protected final panel 未访问');

      for (const locator of [result, boundary]) {
        const geometry = await locator.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, viewport: innerHeight };
        });
        expect(geometry.top).toBeGreaterThanOrEqual(0);
        expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport + 2);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    });
  }
}

for (const width of [320, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`Study mobile research chain stays complete and readable at ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme);
      await page.goto('/research/seed-openevo/study/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const thread = page.locator('[data-testid="experiment-first-study-index"] .study-hero__mobile-thread');
      await expect(thread).toBeVisible();
      for (const step of ['参数没更新', '长周期更新', '小模型接口', '候选准入', '参数历史', '固定 State / β', 'Stage1 学习方式']) {
        await expect(thread).toContainText(step);
      }

      const geometry = await thread.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
        };
      });
      expect(geometry.top).toBeGreaterThanOrEqual(0);
      expect(geometry.bottom).toBeLessThanOrEqual(844);
      expect(geometry.fontSize).toBeGreaterThanOrEqual(16);
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 2);
      await expect(page.locator('.experiment-children:visible')).toHaveCount(0);
      await expect(page.locator('.experiment-node__main')).toHaveCount(7);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)).toBe(true);
    });
  }
}

test('Stage1 route controls stay keyboard-visible at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/', { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

  const scaled = await page.evaluate(() => ({
    rootFontSize: getComputedStyle(document.documentElement).fontSize,
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(scaled.rootFontSize).toBe('32px');
  expect(scaled.documentWidth).toBeLessThanOrEqual(scaled.viewportWidth + 2);

  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab');
    await page.waitForFunction(() => {
      const rect = document.activeElement?.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight);
    }, undefined, { timeout: 1_500 });
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      const rect = element?.getBoundingClientRect();
      return {
        visible: Boolean(element && rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight),
        focusVisible: Boolean(element?.matches(':focus-visible')),
      };
    });
    expect(focus.visible, `keyboard stop ${index + 1} is visible`).toBe(true);
    expect(focus.focusVisible, `keyboard stop ${index + 1} exposes focus`).toBe(true);
  }
});


test('Study phone first screen exposes exactly the seven experiment parents', async ({ page }) => {
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
    'bounded-effective-state-1p7b',
    'stage1-learning-objectives',
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


test('Study desktop keeps the three SD-LoRA acceleration entries grouped and shows Effective-State as a separate formal successor', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ['/research/seed-openevo/study/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const directApply = page.locator('[data-experiment-primary="directapply-1p7b"]').locator('..').locator('..');
    const expectedGroupLabel = 'SD-LoRA 加速';
    const group = directApply.locator('.experiment-child-group').filter({ hasText: expectedGroupLabel });
    await expect(group).toHaveCount(1);
    await expect(group.locator(':scope > strong')).toHaveText(expectedGroupLabel);
    const links = group.locator(':scope > ul a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toContainText('两条路线说明');
    await expect(links.nth(0)).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/sd-lora-history/');
    await expect(links.nth(1)).toContainText('Stable Reduction');
    await expect(links.nth(2)).toContainText('Bounded Online Recurrence');

    const formalSuccessor = directApply.getByRole('link', { name: /后继三组对比：普通 \/ Bounded \/ β-gating（α 固定为 1）/ });
    await expect(formalSuccessor).toHaveCount(1);
    await expect(formalSuccessor).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
    expect(await formalSuccessor.evaluate((link) => Boolean(link.closest('.experiment-child-group')))).toBe(false);

    const boundedExperiment = page.locator('[data-experiment-primary="bounded-effective-state-1p7b"]');
    await expect(boundedExperiment).toHaveCount(1);
    await expect(boundedExperiment).toBeVisible();
    await expect(boundedExperiment).toHaveAttribute('href', '/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');

    const geometry = await group.evaluate((element) => {
      const label = element.querySelector(':scope > strong')?.getBoundingClientRect();
      const branchLinks = [...element.querySelectorAll(':scope > ul a')].map((link) => link.getBoundingClientRect());
      return label ? { labelX: label.x, branchX: branchLinks.map((box) => box.x) } : null;
    });
    expect(geometry).not.toBeNull();
    expect(geometry!.branchX.every((x) => x >= geometry!.labelX + 8)).toBe(true);
  }
});


test('briefing presents current answers in natural reading flow at phone, tablet and desktop widths', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/research/seed-openevo/study/briefing/#briefing-top', { waitUntil: 'networkidle' });
    const result = await page.evaluate(() => {
      const cover = document.querySelector('#briefing-top');
      const answers = document.querySelector('[data-briefing-current-answers]');
      const coverBox = cover?.getBoundingClientRect();
      const answerBox = answers?.getBoundingClientRect();
      return {
        viewport: innerWidth,
        viewportHeight: innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        coverWidth: coverBox?.width ?? 0,
        coverHeight: coverBox?.height ?? 0,
        answerWidth: answerBox?.width ?? 0,
        answerBottom: answerBox?.bottom ?? 0,
        coverBottom: coverBox?.bottom ?? 0,
        scale: getComputedStyle(document.querySelector('[data-testid="progress-briefing"]')!).getPropertyValue('--deck-scale'),
      };
    });
    expect(result.documentWidth).toBeLessThanOrEqual(result.viewport + 2);
    expect(result.coverWidth).toBeLessThanOrEqual(result.viewport + 2);
    expect(result.coverHeight).toBeGreaterThan(0);
    expect(result.answerWidth).toBeGreaterThan(0);
    expect(result.answerBottom).toBeLessThanOrEqual(result.viewportHeight + 1);
    expect(result.scale.trim()).toBe('');
    await expect(page.locator('[data-briefing-current-answers] .current-answer')).toHaveCount(2);
    await expect(page.locator('#next')).toHaveCount(1);
  }
});
