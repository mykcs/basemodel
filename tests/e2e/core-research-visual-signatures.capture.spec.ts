import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  { key: 'overview-zh', path: '/research/seed-openevo/' },
  { key: 'webshop-zh', path: '/research/seed-openevo/webshop/' },
  { key: 'alfworld-zh', path: '/research/seed-openevo/alfworld/' },
  { key: 'seed-zh', path: '/research/seed-openevo/seed/' },
  { key: 'openevo-zh', path: '/research/seed-openevo/openevo/' },
  { key: 'loops-zh', path: '/research/seed-openevo/loops/' },
  { key: 'results-zh', path: '/research/seed-openevo/results/' },
  { key: 'results-en', path: '/en/research/seed-openevo/results/' },
] as const;

const matrices = [
  { key: '390-light', theme: 'light' as Theme, viewport: { width: 390, height: 844 } },
  { key: '390-dark', theme: 'dark' as Theme, viewport: { width: 390, height: 844 } },
  { key: '1440-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { key: '1440-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(100);
  await page.evaluate(() => scrollTo(0, 0));
}

async function screenshotSignature(page: Page) {
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 52, fullPage: false, animations: 'disabled' });
  return page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 9;
    canvas.height = 8;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('2d canvas unavailable for visual signature');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;

    const gray: number[] = [];
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;
    for (let offset = 0; offset < rgba.length; offset += 4) {
      const r = rgba[offset] ?? 0;
      const g = rgba[offset + 1] ?? 0;
      const b = rgba[offset + 2] ?? 0;
      red += r;
      green += g;
      blue += b;
      count += 1;
      gray.push(Math.round(r * 0.299 + g * 0.587 + b * 0.114));
    }

    let bits = '';
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const left = gray[y * 9 + x] ?? 0;
        const right = gray[y * 9 + x + 1] ?? 0;
        bits += left > right ? '1' : '0';
      }
    }

    return {
      dhash64: BigInt(`0b${bits}`).toString(16).padStart(16, '0'),
      avgRgb: [Math.round(red / count), Math.round(green / count), Math.round(blue / count)] as [number, number, number],
    };
  }, `data:image/jpeg;base64,${jpeg.toString('base64')}`);
}

test('capture accepted core research screenshot signatures', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Visual baseline capture is Chromium-specific');
  const signatures: Record<string, { route: string; viewport: { width: number; height: number }; theme: Theme; dhash64: string; avgRgb: [number, number, number] }> = {};

  for (const matrix of matrices) {
    await page.setViewportSize(matrix.viewport);
    for (const route of routes) {
      await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
      signatures[`${route.key}__${matrix.key}`] = {
        route: route.path,
        viewport: matrix.viewport,
        theme: matrix.theme,
        ...(await screenshotSignature(page)),
      };
    }
  }

  const payload = { version: 2, browser: 'chromium', algorithm: 'dhash64+avgRgb', signatures };
  await mkdir('dist/__qa__', { recursive: true });
  await writeFile('dist/__qa__/core-research-visual-signatures.json', `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
});
