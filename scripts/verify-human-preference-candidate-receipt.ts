#!/usr/bin/env node
import fs from 'node:fs';
import { verifyCandidateReceipt, type HumanPreferenceCandidateReceipt } from '../src/lib/humanPreferenceBrief';

const path = process.argv[2];
if (!path) {
  console.error('Usage: npx tsx scripts/verify-human-preference-candidate-receipt.ts <receipt.json>');
  process.exit(2);
}

const receipt = JSON.parse(fs.readFileSync(path, 'utf8')) as HumanPreferenceCandidateReceipt;
const failures = verifyCandidateReceipt(receipt);
if (failures.length) {
  console.error('Human preference candidate receipt FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Human preference candidate receipt PASS: ${receipt.variants.length} candidates, selected ${receipt.selectedVariantId}`);
