import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 1000 },
  { name: 'user-screenshot-2048', width: 2048, height: 1468 },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(100);
}

for (const viewport of viewports) {
  test(`${viewport.name} keeps the historical question cards and current Q7 as readable blocks`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/research/seed-openevo/study/results/');
    await settle(page);

    const root = page.getByTestId('openevo-webshop-result-index');
    const title = page.locator('#questions-title');
    const cards = root.locator('.question-list .question-card');
    const currentQ7 = root.getByTestId('current-source-faithful-q7');

    await expect(root).toBeVisible();
    await expect(title).toBeVisible();
    await expect(cards).toHaveCount(6);
    await expect(currentQ7).toHaveCount(1);
    await expect(currentQ7).toBeVisible();

    const metrics = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('#questions-title');
      const heading = title?.closest<HTMLElement>('.section-heading');
      const list = document.querySelector<HTMLElement>('[data-testid="openevo-webshop-result-index"] .question-list');
      const cards = [...document.querySelectorAll<HTMLElement>('[data-testid="openevo-webshop-result-index"] .question-card')];
      const currentQ7 = document.querySelector<HTMLElement>('[data-testid="current-source-faithful-q7"]');
      if (!title || !heading || !list || !currentQ7 || cards.length !== 6) return null;

      const titleRect = title.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const firstCardRect = cards[0]!.getBoundingClientRect();
      const currentQ7Rect = currentQ7.getBoundingClientRect();
      const style = getComputedStyle(title);
      const fontSize = Number.parseFloat(style.fontSize);
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.2;
      const lines = Math.max(1, Math.round(titleRect.height / lineHeight));
      const visibleCharacters = Array.from(title.innerText.replace(/\s+/g, '')).length;

      return {
        titleWidth: titleRect.width,
        headingWidth: headingRect.width,
        titleLines: lines,
        charactersPerLine: visibleCharacters / lines,
        listGap: listRect.top - headingRect.bottom,
        firstCardWidth: firstCardRect.width,
        currentQ7Width: currentQ7Rect.width,
        listWidth: listRect.width,
      };
    });

    expect(metrics).not.toBeNull();
    if (!metrics) return;

    expect(metrics.titleWidth, `questions title collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(360);
    expect(metrics.headingWidth, `questions heading row collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(850);
    expect(metrics.titleLines, `questions title wraps too many times: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(3);
    expect(metrics.charactersPerLine, `questions title became a narrow text rail: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(12);
    expect(metrics.listGap, `question cards are detached from their heading: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(48);
    expect(metrics.firstCardWidth, `question cards collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(600);
    expect(metrics.currentQ7Width, `current Q7 collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(600);
    expect(metrics.listWidth, `question list collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(900);

    // Preview-only pixel probe. Capture the real 2048px Chromium render, then
    // resize that captured bitmap in-browser. The thumbnail is only a transport
    // artifact for human visual inspection; layout assertions above still run
    // against the original 2048px render. Fixed-size indexed chunks make the
    // payload loss-detectable when it crosses tool boundaries.
    if (process.env.VERCEL_ENV === 'preview' && viewport.name === 'user-screenshot-2048') {
      const jpeg = await root.locator('.results-questions').screenshot({ type: 'jpeg', quality: 46 });
      const thumb = await page.evaluate(async (source) => {
        const image = new Image();
        image.src = source;
        await image.decode();
        const width = Math.min(240, image.naturalWidth);
        const scale = width / image.naturalWidth;
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('2d canvas unavailable for QA thumbnail');
        context.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', 0.30).split(',')[1];
      }, `data:image/jpeg;base64,${jpeg.toString('base64')}`);
      await mkdir('dist/__qa__', { recursive: true });
      const chunks = (thumb ?? '').match(/.{1,64}/g) ?? [];
      const payload = chunks.map((chunk, index) => `${String(index).padStart(3, '0')}:${chunk}`).join('\n');
      await writeFile('dist/__qa__/results-questions-2048-chunks.txt', payload, 'utf8');
    }
  });
}
