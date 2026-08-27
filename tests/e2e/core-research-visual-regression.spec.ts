import { readFile } from 'node:fs/promises';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

type Theme = 'light' | 'dark';
type BaselineEntry = {
  route: string;
  viewport: { width: number; height: number };
  theme: Theme;
  dhash64: string;
  avgRgb: [number, number, number];
};
type BaselineFile = {
  version: 2;
  browser: 'chromium';
  algorithm: 'dhash64+avgRgb';
  signatures: Record<string, BaselineEntry>;
};

const baselinePath = 'tests/e2e/visual-baselines/core-research-signatures.json';
const routes = [
  { key: 'overview-zh', path: '/research/seed-openevo/flow/' },
  { key: 'webshop-zh', path: '/research/seed-openevo/flow/webshop/' },
  { key: 'alfworld-zh', path: '/research/seed-openevo/flow/alfworld/' },
  { key: 'seed-zh', path: '/research/seed-openevo/flow/seed/' },
  { key: 'openevo-zh', path: '/research/seed-openevo/flow/openevo/' },
  { key: 'loops-zh', path: '/research/seed-openevo/flow/loops/' },
  { key: 'results-zh', path: '/research/seed-openevo/study/results/' },
  { key: 'results-en', path: '/en/research/seed-openevo/study/results/' },
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
  return { jpeg, signature };
}

function hamming64(left: string, right: string) {
  let value = BigInt(`0x${left}`) ^ BigInt(`0x${right}`);
  let distance = 0;
  while (value) {
    distance += Number(value & 1n);
    value >>= 1n;
  }
  return distance;
}

function compareSignatures(expected: BaselineEntry, actual: { dhash64: string; avgRgb: [number, number, number] }) {
  const colorDelta = expected.avgRgb.reduce((sum, value, index) => sum + Math.abs(value - (actual.avgRgb[index] ?? 0)), 0) / 3;
  return {
    hamming: hamming64(expected.dhash64, actual.dhash64),
    colorDelta,
    expectedHash: expected.dhash64,
    actualHash: actual.dhash64,
    expectedRgb: expected.avgRgb,
    actualRgb: actual.avgRgb,
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
    test.skip(testInfo.project.name !== 'chromium', 'Committed visual signatures are Chromium-specific');
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
        const metrics = compareSignatures(expectedEntry!, actual.signature);

        // dHash protects page composition while avgRgb protects large surface/theme
        // changes. The separate layout-anomaly/CJK gates remain stricter for thin
        // columns and text starvation. Baselines may only move via the explicit
        // capture command after a human visual review of the intended change.
        const accepted = metrics.hamming <= 14 && metrics.colorDelta <= 18;
        if (!accepted) await attachFailure(testInfo, key, actual.jpeg, metrics);
        expect(
          accepted,
          `${key} visual signature drifted: hamming=${metrics.hamming}/64, avgRGBΔ=${metrics.colorDelta.toFixed(1)}`,
        ).toBe(true);
      });
    }
  });
}
