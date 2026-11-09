import type { Page } from '@playwright/test';

export type Theme = 'light' | 'dark';

export const routes = [
  { key: 'overview-zh', path: '/research/seed-openevo/flow/' },
  { key: 'webshop-zh', path: '/research/seed-openevo/flow/webshop/' },
  { key: 'alfworld-zh', path: '/research/seed-openevo/flow/alfworld/' },
  { key: 'seed-zh', path: '/research/seed-openevo/flow/seed/' },
  { key: 'openevo-zh', path: '/research/seed-openevo/flow/openevo/' },
  { key: 'loops-zh', path: '/research/seed-openevo/flow/loops/' },
  { key: 'results-zh', path: '/research/seed-openevo/study/results/' },
] as const;

export const matrices = [
  { key: '440-light', theme: 'light' as Theme, viewport: { width: 440, height: 956 } },
  { key: '440-dark', theme: 'dark' as Theme, viewport: { width: 440, height: 956 } },
  { key: '1440-light', theme: 'light' as Theme, viewport: { width: 1440, height: 1000 } },
  { key: '1440-dark', theme: 'dark' as Theme, viewport: { width: 1440, height: 1000 } },
] as const;

export async function settle(page: Page) {
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  await page.waitForTimeout(100);
  await page.evaluate(() => scrollTo(0, 0));
}

export async function screenshotSignature(page: Page) {
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 52, fullPage: false, animations: 'disabled' });
  const signature = await page.evaluate(async (source) => {
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
  return { signature, jpeg };
}

