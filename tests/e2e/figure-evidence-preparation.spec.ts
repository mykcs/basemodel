import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { captureFigureEvidence, isFigureEvidencePreparationCurrent, prepareFigureEvidence } from './figure-evidence';

const fixture = `<!doctype html><html><head><style>
body { margin:0; font:16px sans-serif; }
figure { margin:0; width:240px; height:100px; background:rgb(240,240,240); }
.case { display:none; }
body:has(input[value="a"]:checked) [data-parameter-case="a"] { display:block; }
@media print { figure { width:280px; } }
</style></head><body>
<div data-parameter-controls><input type="radio" name="case" value="a" checked><input type="radio" name="case" value="b"></div>
<section class="case" data-parameter-case="a"><details id="reader"><summary>Evidence</summary><figure id="target"><p>Native evidence pixels</p></figure></details></section>
</body></html>`;

async function installFixture(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.setContent(fixture);
  await page.evaluate(() => localStorage.setItem('atlas-theme', 'light'));
  return page.locator('#target');
}

test('prepared native capture preserves the two-argument pixels and clipping contract', async ({ page }, info) => {
  const target = await installFixture(page);
  const oldPath = info.outputPath('legacy-native.png');
  const newPath = info.outputPath('prepared-native.png');
  const legacy = await captureFigureEvidence(target, oldPath);
  const prepared = await prepareFigureEvidence(target);
  try {
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(true);
    expect(await captureFigureEvidence(target, newPath, prepared)).toEqual(legacy);
    expect(readFileSync(newPath)).toEqual(readFileSync(oldPath));
  } finally { await prepared.dispose(); }
  expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
});

test('prepared reading state invalidates on theme, media and viewport changes', async ({ page }, info) => {
  const target = await installFixture(page);
  const prepared = await prepareFigureEvidence(target);
  try {
    await page.evaluate(() => localStorage.setItem('atlas-theme', 'dark'));
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
    await page.evaluate(() => localStorage.setItem('atlas-theme', 'light'));
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(true);
    await page.emulateMedia({ media: 'print' });
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
    const printed = await captureFigureEvidence(target, info.outputPath('print-native.png'), prepared);
    expect(printed.width).toBe(280);
    await page.emulateMedia({ media: 'screen' });
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(true);
    const current = page.viewportSize()!;
    await page.setViewportSize({ width: current.width - 1, height: current.height });
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
  } finally { await prepared.dispose(); }
});

test('stale radio and details preparation is repaired before native capture', async ({ page }, info) => {
  const target = await installFixture(page);
  const prepared = await prepareFigureEvidence(target);
  try {
    await page.locator('input[value="b"]').check();
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
    await captureFigureEvidence(target, info.outputPath('radio-restored.png'), prepared);
    await expect(page.locator('input[value="a"]')).toBeChecked();
    await expect(target).toBeVisible();
    await page.locator('#reader').evaluate(node => (node as HTMLDetailsElement).open = false);
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
    await captureFigureEvidence(target, info.outputPath('details-restored.png'), prepared);
    await expect(page.locator('#reader')).toHaveAttribute('open', '');
  } finally { await prepared.dispose(); }
});

test('replacement elements cannot reuse a former object preparation', async ({ page }, info) => {
  const target = await installFixture(page);
  const prepared = await prepareFigureEvidence(target);
  try {
    await target.evaluate(node => { node.outerHTML = '<figure id="target" style="width:300px">Replacement evidence</figure>'; });
    expect(await isFigureEvidencePreparationCurrent(target, prepared)).toBe(false);
    const clip = await captureFigureEvidence(target, info.outputPath('replacement-native.png'), prepared);
    expect(clip.width).toBe(300);
  } finally { await prepared.dispose(); }
});
