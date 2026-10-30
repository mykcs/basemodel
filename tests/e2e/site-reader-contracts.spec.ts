import { expect, test } from '@playwright/test';
import { SITE_READER_CONTRACTS, type ReaderAttentionMode } from '../../src/data/siteReaderContracts';
import { persistJsonAttachment } from './evidence-json';

const firstViewportMessageFits = (box: { y: number; height: number } | null, height: number) =>
  box !== null && box.y < height && box.y + box.height <= height + 2;

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
    // This case visits all 71 route contracts, including hydration settlement.
    // Allow the complete walk on cloud WebKit; reader budgets below stay fixed.
    test.setTimeout(600_000);
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
        const candidates = page.locator(contract.firstViewportSelector);
        let primary = null;
        for (let index = 0; index < await candidates.count(); index += 1) {
          const candidate = candidates.nth(index);
          if (await candidate.isVisible()) { primary = candidate; break; }
        }
        if (!primary) {
          failures.push(`${contract.id}: declared first-viewport message is not visible`);
        } else {
          const box = await primary.boundingBox();
          if (!firstViewportMessageFits(box, viewport.height)) failures.push(`${contract.id}: declared first-viewport message falls below the first screen`);
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

          const interactiveElements = [...root.querySelectorAll('a,button,input:not([type="hidden"]),select,textarea,summary')].filter(inFirstScreen);
          const interactive = interactiveElements.length;
          const interactiveTargets = interactiveElements.map((el) => ({
            text: el.textContent?.replace(/\s+/g, ' ').trim().slice(0, 70) ?? '',
            href: el.getAttribute('href') ?? '',
            tag: el.tagName,
            y: Math.round(el.getBoundingClientRect().top),
          }));
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
          return { interactive, headings, textChars, interactiveTargets };
        });

        const budget = contract.firstViewportBudget ?? defaultBudgets[contract.attentionMode];
        if (metrics.interactive > budget.maxInteractive) failures.push(`${contract.id}: ${metrics.interactive} first-screen interactive targets exceed budget ${budget.maxInteractive}; visible=${JSON.stringify(metrics.interactiveTargets)}`);
        if (metrics.headings > budget.maxHeadings) failures.push(`${contract.id}: ${metrics.headings} first-screen headings exceed budget ${budget.maxHeadings}`);
        if (metrics.textChars > budget.maxTextChars) failures.push(`${contract.id}: ${metrics.textChars} first-screen text characters exceed budget ${budget.maxTextChars}`);
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      if (overflow) failures.push(`${contract.id}: page-level horizontal overflow`);
    }

    expect(failures).toEqual([]);
  });
}

for (const theme of ['light', 'dark'] as const) for (const variant of ['bounded-effective-state-gdr', 'sd-lora-scaling', 'q17-directapply-analysis'] as const) {
  test(`research result remains in the first viewport: ${variant} ${theme}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1280, height: 633 });
    await page.addInitScript(mode => localStorage.setItem('atlas-theme', mode), theme);
    await page.goto(`/research/seed-openevo/study/capability-exploration/${variant}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const selector = variant === 'sd-lora-scaling' ? '.scaling-hero__result' : variant === 'q17-directapply-analysis' ? '.q17-analysis__hero' : '[data-gdr-first-result]';
    const message = page.locator(selector);
    const before = await message.boundingBox();
    expect(firstViewportMessageFits(before, 633)).toBe(true);
    await page.screenshot({ path: info.outputPath('first-viewport-result.png') });
    const legacy = await page.addStyleTag({ content: variant === 'q17-directapply-analysis'
      ? '.research-route-context[data-reader-route="q17-directapply-analysis"] [data-reader-purpose]{max-width:75px!important}'
      : variant === 'sd-lora-scaling'
      ? '.scaling-hero h1{max-width:6ch!important;font-size:clamp(2.25rem,8vw,6rem)!important;line-height:.98!important}'
      : '.paper{padding-top:34px!important}.paper h1{font-size:100px!important;max-width:10ch!important;line-height:1.04!important}' });
    let broken;
    let injectedHeading;
    try {
      if (variant === 'sd-lora-scaling') {
        injectedHeading = await page.locator('.scaling-hero h1').evaluate(node => {
          const css = getComputedStyle(node), box = node.getBoundingClientRect();
          return { size: parseFloat(css.fontSize), measure: css.maxWidth, width: box.width, height: box.height };
        });
        expect(injectedHeading.size).toBeGreaterThan(60);
      }
      broken = await message.boundingBox();
      expect(firstViewportMessageFits(broken, 633)).toBe(false);
      if (variant === 'sd-lora-scaling') expect(broken!.y + broken!.height).toBeGreaterThan(633);
      await page.screenshot({ path: info.outputPath('first-viewport-layout-negative.png') });
    } finally { await legacy.evaluate(node => node.parentNode?.removeChild(node)); }
    const restored = await message.boundingBox();
    expect(firstViewportMessageFits(restored, 633)).toBe(true);
    await persistJsonAttachment(info, 'first-viewport-result.json', { body: Buffer.from(JSON.stringify({ variant, theme, selector, viewport: { width: 1280, height: 633 }, before, broken, restored, injectedHeading, negativeKind: variant === 'q17-directapply-analysis' ? 'constrained purpose column' : variant === 'sd-lora-scaling' ? 'legacy heading size with a constrained 6ch title measure' : 'legacy heading geometry', negativeRejected: true })), contentType: 'application/json' });
  });
}


test('Study phone keeps all child destinations usable through native disclosures', async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('/research/seed-openevo/study/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-experiment-primary]')).toHaveCount(7);
  const details = page.locator('[data-experiment-details]');
  await expect(details).toHaveCount(7);
  for (const detail of await details.all()) {
    await expect(detail).not.toHaveAttribute('open', '');
    const primaryHref = await detail.locator('..').locator('[data-experiment-primary]').getAttribute('href');
    await detail.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(detail).toHaveAttribute('open', '');
    const children = detail.locator('.experiment-children a');
    expect(await children.count()).toBeGreaterThan(0);
    for (const link of await children.all()) {
      await expect(link).toBeVisible();
      expect(await link.getAttribute('href')).not.toBe(primaryHref);
    }
    await detail.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(detail).not.toHaveAttribute('open', '');
  }
  await expect(page.locator('.experiment-mobile-featured')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(2);
});


test('Study desktop keeps the three SD-LoRA acceleration entries grouped and shows Effective-State as a separate formal successor', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ['/research/seed-openevo/study/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const directApply = page.locator('[data-experiment-primary="directapply-1p7b"]').locator('..').locator('..');
    await directApply.locator('[data-experiment-details] > summary').click();
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
  const desktopSlide = page.locator('#capacity-diagnostic');
  // The resize event and the inline deck-scale recalculation are delivered on a later frame.
  // setViewportSize() and navigation/networkidle can finish before that frame. Wait for the
  // real layout instead of weakening the original 1280×720 acceptance thresholds.
  // Also exercise the live resize path: no page reload is needed to restore the desktop deck.
  await expect(desktopSlide).toHaveCSS('width', '1280px');
  await expect(desktopSlide).toHaveCSS('height', '720px');
  const desktop = await desktopSlide.boundingBox();
  expect(desktop).not.toBeNull();
  expect(desktop!.width).toBe(1280);
  expect(desktop!.height).toBe(720);
  const desktopScale = await page.evaluate(() => {
    const deck = document.querySelector('[data-testid="progress-briefing"]');
    const inner = document.querySelector('#capacity-diagnostic .slide-inner');
    if (!deck || !inner) return null;
    const style = getComputedStyle(inner);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return {
      viewport: innerWidth,
      deckScale: Number.parseFloat(getComputedStyle(deck).getPropertyValue('--deck-scale')),
      cssWidth: Number.parseFloat(style.width),
      cssHeight: Number.parseFloat(style.height),
      transformX: matrix.a,
      transformY: matrix.d,
    };
  });
  expect(desktopScale).not.toBeNull();
  expect(desktopScale!.viewport).toBe(2560);
  expect(desktopScale!.deckScale).toBe(1);
  expect(desktopScale!.cssWidth).toBe(1280);
  expect(desktopScale!.cssHeight).toBe(720);
  expect(desktopScale!.transformX).toBe(1);
  expect(desktopScale!.transformY).toBe(1);

  // Re-entering phone width must also rescale without a reload or horizontal overflow.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(desktopSlide).toHaveCSS('width', '390px');
  const phoneAgain = await desktopSlide.boundingBox();
  expect(phoneAgain).not.toBeNull();
  expect(phoneAgain!.width).toBeCloseTo(390, 0);
  expect(phoneAgain!.height / phoneAgain!.width).toBeCloseTo(9 / 16, 3);
  const phoneAgainState = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    scale: Number.parseFloat(getComputedStyle(document.querySelector('[data-testid="progress-briefing"]')!).getPropertyValue('--deck-scale')),
  }));
  expect(phoneAgainState.overflow).toBeLessThanOrEqual(2);
  expect(phoneAgainState.scale).toBeCloseTo(390 / 1280, 4);
});

for(const width of [390,1280])for(const theme of ['light','dark'] as const){
  test(`same-panel first result retains every completed route and comparison boundary ${width} ${theme}`,async({page},info)=>{
    const height=width===390?844:633;
    await page.setViewportSize({width,height});await page.addInitScript(mode=>localStorage.setItem('atlas-theme',mode),theme);
    await page.goto('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/',{waitUntil:'networkidle'});
    const result=page.locator('[data-gdr-first-result]');
    for(const row of [
      {id:'directApply',label:'普通 OpenEVO',score:'60.72',exact:'50/128'},
      {id:'off',label:'OpenEVO + Bounded Online Recurrence',score:'45.98',exact:'32/128'},
      {id:'on',label:'OpenEVO + Bounded Online Recurrence + β-gating（α 固定为 1）',score:'20.77',exact:'10/128'},
    ]){const entry=result.locator(`[data-gdr-final-row="${row.id}"]`);await expect(entry.locator('dt')).toHaveText(row.label);await expect(entry.locator('dd strong')).toHaveText(row.score);await expect(entry.locator('dd')).toContainText(row.exact);}
    for(const boundary of ['同一冻结 128 题 Final','普通 OpenEVO 是历史前驱','预注册对照仅为 Bounded 与 + β-gating','训练分数另列','SEED 是外部论文参考','动态 α + β 尚未运行'])await expect(result).toContainText(boundary);
    expect(firstViewportMessageFits(await result.boundingBox(),height)).toBe(true);
    await page.screenshot({path:info.outputPath('same-panel-first-result.png')});
    const full=page.locator('.paper-table-wrap--hero');await full.scrollIntoViewIfNeeded();await expect(full.locator('tbody tr')).toHaveCount(5);
  });
}
