import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import {
  CONTENT_FIRST_PILOTS,
  CONTENT_FIRST_VIEWPORTS,
  validateContentFirstColdReadBundle,
  type ContentFirstColdReadBundle,
  type ContentFirstColdReadReceipt,
  type ContentFirstPilotId,
} from './content-first-redesign-cold-read-gate';

const args = process.argv.slice(2);
const productHead = args.find((arg) => arg.startsWith('--product-head='))?.slice('--product-head='.length);
const dir = args.find((arg) => arg.startsWith('--dir='))?.slice('--dir='.length);
if (!productHead || !dir) {
  console.error('Usage: npm run redesign:cold-read:gate -- --product-head=<40-char-sha> --dir=/tmp/content-first-cold-read');
  process.exit(2);
}

const receipts: ContentFirstColdReadBundle['receipts'] = [];
for (const pilotId of Object.keys(CONTENT_FIRST_PILOTS) as ContentFirstPilotId[]) {
  for (const device of Object.keys(CONTENT_FIRST_VIEWPORTS) as Array<keyof typeof CONTENT_FIRST_VIEWPORTS>) {
    const path = join(dir, `${pilotId}-${device}.json`);
    let receipt: ContentFirstColdReadReceipt;
    try {
      receipt = JSON.parse(readFileSync(path, 'utf8')) as ContentFirstColdReadReceipt;
    } catch (error) {
      console.error(`CONTENT_FIRST_COLD_READ_GATE=FAIL\n- missing/unreadable receipt ${path}: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
    receipts.push({ pilotId, device, receipt });
  }
}

const errors = validateContentFirstColdReadBundle({ productHead, receipts });
if (errors.length) {
  console.error('CONTENT_FIRST_COLD_READ_GATE=FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`CONTENT_FIRST_COLD_READ_GATE=PASS productHead=${productHead} receipts=${receipts.length}`);
