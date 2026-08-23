import { mkdir, writeFile } from 'node:fs/promises';
import { test, type Page } from '@playwright/test';

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

async function screenshotSignature(page: Page): Promise<string> {
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 52, fullPage: false, animations: 'disabled' });
  return page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 24;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('2d canvas unavailable for visual signature');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const rgb = new Uint8Array(canvas.width * canvas.height * 3);
    for (let input = 0, output = 0; input < rgba.length; input += 4) {
      rgb[output++] = rgba[input];
      rgb[output++] = rgba[input + 1];
      rgb[output++] = rgba[input + 2];
    }
    let binary = '';
    for (let index = 0; index < rgb.length; index += 1) binary += String.fromCharCode(rgb[index]);
    return btoa(binary);
  }, `data:image/jpeg;base64,${jpeg.toString('base64')}`);
}

test('capture accepted core research screenshot signatures', async ({ page }) => {
  const signatures: Record<string, { route: string; viewport: { width: number; height: number }; theme: Theme; rgb32x24: string }> = {};

  for (const matrix of matrices) {
    await page.setViewportSize(matrix.viewport);
    for (const route of routes) {
      await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await settle(page);
      signatures[`${route.key}__${matrix.key}`] = {
        route: route.path,
        viewport: matrix.viewport,
        theme: matrix.theme,
        rgb32x24: await screenshotSignature(page),
      };
    }
  }

  await mkdir('dist/__qa__', { recursive: true });
  await writeFile(
    'dist/__qa__/core-research-visual-signatures.json',
    `${JSON.stringify({ version: 1, width: 32, height: 24, signatures }, null, 2)}\n`,
    'utf8',
  );
});
