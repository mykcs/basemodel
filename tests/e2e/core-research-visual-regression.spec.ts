import { readFile } from 'node:fs/promises';
import { expect, test, type TestInfo } from '@playwright/test';
import { matrices, routes, settle, screenshotSignature as captureSignature, type Theme } from './core-research-visual-shared';

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

// Missing approval is a real blocker, not permission to auto-accept a capture.
const baseline = JSON.parse(await readFile(baselinePath, 'utf8').catch((error: unknown) => {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
    throw new Error(
      `No approved baseline at ${baselinePath}. Capture with npm run test:visual:capture, inspect the rendered screenshots, and accept a baseline explicitly before running this opt-in regression.`,
      { cause: error },
    );
  }
  throw error;
})) as BaselineFile;

// Fail closed if an archived route or omitted matrix entry sneaks back in.
const expectedKeys = matrices.flatMap(matrix => routes.map(route => `${route.key}__${matrix.key}`)).sort();
const actualKeys = Object.keys(baseline.signatures).sort();
if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
  throw new Error(`Visual baseline scope mismatch: expected ${expectedKeys.length} active entries, got ${actualKeys.length}; review and accept a current capture.`);
}

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

        const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), `visual regression route must render: ${route.path}`).toBe(200);
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
