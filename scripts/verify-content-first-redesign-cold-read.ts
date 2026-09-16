import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { CONTENT_FIRST_PILOTS, validateContentFirstColdReadBundle, type ContentFirstColdReadBundle, type ContentFirstColdReadDevice, type ContentFirstPilotId } from '../src/lib/contentFirstRedesignColdReadGate';
import type { HumanPreferenceJudgeReceipt } from '../src/lib/humanPreferenceJudge';

const args = process.argv.slice(2);
const exactHead = args.find((arg) => arg.startsWith('--head='))?.slice('--head='.length);
const dir = args.find((arg) => arg.startsWith('--dir='))?.slice('--dir='.length);
if (!exactHead || !dir) {
  console.error('Usage: npm run redesign:cold-read:gate -- --head=<40-char-sha> --dir=/tmp/content-first-cold-read');
  process.exit(2);
}

const receipts: ContentFirstColdReadBundle['receipts'] = [];
for (const [pilotId, contractId] of Object.entries(CONTENT_FIRST_PILOTS)) {
  for (const device of ['desktop', 'phone'] as const) {
    const path = join(dir, `${pilotId}-${device}.json`);
    let receipt: HumanPreferenceJudgeReceipt;
    try {
      receipt = JSON.parse(readFileSync(path, 'utf8')) as HumanPreferenceJudgeReceipt;
    } catch (error) {
      console.error(`CONTENT_FIRST_COLD_READ_GATE=FAIL\n- missing/unreadable receipt ${path}: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
    receipts.push({ pilotId: pilotId as ContentFirstPilotId, device: device as ContentFirstColdReadDevice, receipt: { ...receipt, contractId: receipt.contractId || contractId } });
  }
}
const bundle: ContentFirstColdReadBundle = { exactHead, receipts };
const errors = validateContentFirstColdReadBundle(bundle);
if (errors.length) {
  console.error('CONTENT_FIRST_COLD_READ_GATE=FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`CONTENT_FIRST_COLD_READ_GATE=PASS exactHead=${bundle.exactHead} receipts=${bundle.receipts.length}`);
