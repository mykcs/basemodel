import { readFileSync } from 'node:fs';
import process from 'node:process';
import { validateHumanPreferenceJudgeReceipt } from '../src/lib/humanPreferenceJudge';

const path = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!path) {
  console.error('Usage: npm run feedback:judge -- /path/to/judge-receipt.json');
  process.exit(1);
}
let input: unknown;
try {
  input = JSON.parse(readFileSync(path, 'utf8'));
} catch (error) {
  console.error(`Cannot read judge receipt: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
const errors = validateHumanPreferenceJudgeReceipt(input);
if (errors.length) {
  console.error(`Human Preference Judge receipt FAIL (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Human Preference Judge receipt PASS');
