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
  test(`${viewport.name} keeps the results REFERENCE heading as a readable block`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/research/seed-openevo/results/');
    await settle(page);

    const root = page.getByTestId('openevo-webshop-result-index');
    const title = page.locator('#reference-title');
    const heading = title.locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " result-section-heading ")][1]');
    const copyColumn = title.locator('xpath=parent::*');
    const cards = root.locator('.reference-grid .reference-card');

    await expect(root).toBeVisible();
    await expect(title).toBeVisible();
    await expect(cards).toHaveCount(4);

    const metrics = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('#reference-title');
      const column = title?.parentElement as HTMLElement | null;
      const heading = title?.closest<HTMLElement>('.result-section-heading');
      const grid = document.querySelector<HTMLElement>('[data-testid="openevo-webshop-result-index"] .reference-grid');
      const cards = [...document.querySelectorAll<HTMLElement>('[data-testid="openevo-webshop-result-index"] .reference-card')];
      if (!title || !column || !heading || !grid || cards.length !== 4) return null;

      const titleRect = title.getBoundingClientRect();
      const columnRect = column.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const firstCardRect = cards[0]!.getBoundingClientRect();
      const style = getComputedStyle(title);
      const fontSize = Number.parseFloat(style.fontSize);
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.2;
      const lines = Math.max(1, Math.round(titleRect.height / lineHeight));
      const visibleCharacters = Array.from(title.innerText.replace(/\s+/g, '')).length;

      return {
        titleWidth: titleRect.width,
        columnWidth: columnRect.width,
        headingWidth: headingRect.width,
        titleLines: lines,
        charactersPerLine: visibleCharacters / lines,
        gridGap: gridRect.top - headingRect.bottom,
        firstCardWidth: firstCardRect.width,
        gridWidth: gridRect.width,
      };
    });

    expect(metrics).not.toBeNull();
    if (!metrics) return;

    expect(metrics.titleWidth, `REFERENCE title collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(360);
    expect(metrics.columnWidth, `REFERENCE copy column collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(520);
    expect(metrics.headingWidth, `REFERENCE heading row collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(850);
    expect(metrics.titleLines, `REFERENCE title wraps too many times: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(3);
    expect(metrics.charactersPerLine, `REFERENCE title became a narrow text rail: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(12);
    expect(metrics.gridGap, `REFERENCE cards are detached from their heading: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(48);
    expect(metrics.firstCardWidth, `REFERENCE cards collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(150);
    expect(metrics.gridWidth, `REFERENCE grid collapsed: ${JSON.stringify(metrics)}`).toBeGreaterThanOrEqual(900);

    // Preview-only pixel probe. Capture the real 2048px Chromium render, then
    // resize that captured bitmap in-browser. The thumbnail is only a transport
    // artifact for human visual inspection; layout assertions above still run
    // against the original 2048px render. Fixed-size indexed chunks make the
    // payload loss-detectable when it crosses tool boundaries.
    if (process.env.VERCEL_ENV === 'preview' && viewport.name === 'user-screenshot-2048') {
      const jpeg = await root.locator('.reference-index').screenshot({ type: 'jpeg', quality: 46 });
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
      const chunks = thumb?.match(/.{1,64}/g) ?? [];
      const payload = chunks.map((chunk, index) => `${String(index).padStart(3, '0')}:${chunk}`).join('\n');
      await writeFile('dist/__qa__/results-reference-2048-chunks.txt', payload, 'utf8');
    }

    await expect(heading).toBeVisible();
    await expect(copyColumn).toBeVisible();
  });
}
