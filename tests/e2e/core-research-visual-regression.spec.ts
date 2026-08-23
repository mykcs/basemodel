import { readFile } from 'node:fs/promises';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

type Theme = 'light' | 'dark';
type BaselineEntry = {
  route: string;
  viewport: { width: number; height: number };
  theme: Theme;
  rgb32x24: string;
};
type BaselineFile = {
  version: number;
  width: number;
  height: number;
  signatures: Record<string, BaselineEntry>;
};

const baselinePath = 'tests/e2e/visual-baselines/core-research-signatures.json';
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

async function captureSignature(page: Page) {
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 52, fullPage: false, animations: 'disabled' });
  const signature = await page.evaluate(async (source) => {
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
  return { jpeg, signature };
}

function compareSignatures(expectedBase64: string, actualBase64: string) {
  const expected = Buffer.from(expectedBase64, 'base64');
  const actual = Buffer.from(actualBase64, 'base64');
  if (expected.length !== actual.length || expected.length === 0) {
    return { meanChannelDelta: Number.POSITIVE_INFINITY, changedPixelRatio: 1, maxPixelDelta: 255 };
  }

  let channelDelta = 0;
  let changedPixels = 0;
  let maxPixelDelta = 0;
  const pixelCount = expected.length / 3;
  for (let offset = 0; offset < expected.length; offset += 3) {
    const dr = Math.abs(expected[offset] - actual[offset]);
    const dg = Math.abs(expected[offset + 1] - actual[offset + 1]);
    const db = Math.abs(expected[offset + 2] - actual[offset + 2]);
    const pixelDelta = (dr + dg + db) / 3;
    channelDelta += dr + dg + db;
    maxPixelDelta = Math.max(maxPixelDelta, pixelDelta);
    if (pixelDelta > 24) changedPixels += 1;
  }

  return {
    meanChannelDelta: channelDelta / expected.length,
    changedPixelRatio: changedPixels / pixelCount,
    maxPixelDelta,
  };
}

async function attachFailure(testInfo: TestInfo, key: string, jpeg: Buffer, metrics: unknown) {
  await testInfo.attach(`${key}-actual.jpeg`, { body: jpeg, contentType: 'image/jpeg' });
  await testInfo.attach(`${key}-visual-diff.json`, {
    body: Buffer.from(`${JSON.stringify(metrics, null, 2)}\n`),
    contentType: 'application/json',
  });
}

const baseline = JSON.parse(await readFile(baselinePath, 'utf8')) as BaselineFile;

for (const matrix of matrices) {
  test(`${matrix.key} core research screenshots stay near the accepted visual signatures`, async ({ page }, testInfo) => {
    await page.setViewportSize(matrix.viewport);
    await page.addInitScript((theme: Theme) => localStorage.setItem('atlas-theme', theme), matrix.theme);

    for (const route of routes) {
      await test.step(route.key, async () => {
        const key = `${route.key}__${matrix.key}`;
        const expectedEntry = baseline.signatures[key];
        expect(expectedEntry, `missing visual baseline ${key}`).toBeTruthy();
        expect(expectedEntry?.route).toBe(route.path);
        expect(expectedEntry?.theme).toBe(matrix.theme);
        expect(expectedEntry?.viewport).toEqual(matrix.viewport);

        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', matrix.theme);
        const actual = await captureSignature(page);
        const metrics = compareSignatures(expectedEntry.rgb32x24, actual.signature);

        // The 32×24 signature deliberately ignores subpixel typography noise,
        // but large composition changes (collapsed columns, reordered cards,
        // unexpected blank regions, wrong theme surfaces) move many cells and
        // must fail. Update baselines only after an explicit human visual review.
        const accepted = metrics.meanChannelDelta <= 10 && metrics.changedPixelRatio <= 0.20;
        if (!accepted) await attachFailure(testInfo, key, actual.jpeg, metrics);
        expect(
          accepted,
          `${key} visual signature drifted: mean=${metrics.meanChannelDelta.toFixed(2)}, changed=${(metrics.changedPixelRatio * 100).toFixed(1)}%, max=${metrics.maxPixelDelta.toFixed(1)}`,
        ).toBe(true);
      });
    }
  });
}
