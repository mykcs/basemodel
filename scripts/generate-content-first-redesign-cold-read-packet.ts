import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';
import { buildColdReadPacketCases, buildColdReadPacketReadme, CONTENT_FIRST_PRIMARY_HEADING_SELECTOR } from './content-first-redesign-cold-read-packet';

const args = process.argv.slice(2);
const getArg = (name: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const productHead = getArg('product-head');
const baseUrl = getArg('base-url');
const outDir = getArg('out-dir');
if (!productHead || !baseUrl || !outDir) {
  console.error('Usage: npm run redesign:cold-read:packet -- --product-head=<40-char-sha> --base-url=<http(s)://...> --out-dir=/tmp/review-packet');
  process.exit(2);
}

const cases = buildColdReadPacketCases(baseUrl, productHead);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, 'phase-a-blind'), { recursive: true });
mkdirSync(join(outDir, 'phase-b-after-blind'), { recursive: true });
writeFileSync(join(outDir, 'README.md'), `${buildColdReadPacketReadme(productHead, cases)}\n`);
writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify({ schemaVersion: 1, productHead, cases: cases.map(({ key, pilotId, device, contractId, pathname, candidateUrl, viewport }) => ({ key, pilotId, device, contractId, pathname, candidateUrl, viewport })) }, null, 2)}\n`);

const browser = await chromium.launch({ headless: true });
try {
  for (const item of cases) {
    const blindDir = join(outDir, 'phase-a-blind', item.key);
    const compareDir = join(outDir, 'phase-b-after-blind', item.key);
    mkdirSync(blindDir, { recursive: true });
    mkdirSync(compareDir, { recursive: true });
    const context = await browser.newContext({ viewport: item.viewport, locale: 'zh-CN' });
    const page = await context.newPage();
    const response = await page.goto(item.candidateUrl, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) throw new Error(`${item.key}: HTTP ${response?.status() ?? 'NO_RESPONSE'} for ${item.candidateUrl}`);
    await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); });
    await page.waitForTimeout(100);
    const actualContract = await page.locator('body').getAttribute('data-reader-contract-id');
    if (actualContract !== item.contractId) throw new Error(`${item.key}: expected reader contract ${item.contractId}, got ${actualContract}`);
    const h1Count = await page.locator(CONTENT_FIRST_PRIMARY_HEADING_SELECTOR).count();
    if (h1Count !== 1) throw new Error(`${item.key}: expected exactly one h1, got ${h1Count}`);
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    if (overflow > 1) throw new Error(`${item.key}: horizontal overflow ${overflow}px`);

    await page.screenshot({ path: join(blindDir, 'first-viewport.png'), fullPage: false });
    await page.screenshot({ path: join(blindDir, 'full-page.png'), fullPage: true });
    writeFileSync(join(blindDir, 'BLIND.md'), `${item.blindPrompt}\n`);
    writeFileSync(join(compareDir, 'COMPARE.md'), `${item.comparePrompt}\n`);
    writeFileSync(join(compareDir, 'receipt.template.json'), `${JSON.stringify(item.receiptTemplate, null, 2)}\n`);
    await context.close();
    console.log(`PACKET_CASE=PASS ${item.key} contract=${item.contractId} viewport=${item.viewport.width}x${item.viewport.height}`);
  }
} finally {
  await browser.close();
}
console.log(`CONTENT_FIRST_COLD_READ_PACKET=PASS productHead=${productHead} cases=${cases.length} outDir=${outDir}`);
