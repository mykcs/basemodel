import process from 'node:process';
import { SITE_READER_CONTRACTS } from '../src/data/siteReaderContracts';
import {
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
} from '../src/data/humanFeedbackPrecedents';

const contractId = process.argv.slice(2).find((arg) => !arg.startsWith('--'))?.trim();
if (!contractId) {
  console.error('Usage: npm run feedback:cold-read -- study');
  process.exit(1);
}

const contract = SITE_READER_CONTRACTS.find((item) => item.id === contractId);
if (!contract) {
  console.error(`Unknown reader contract: ${contractId}`);
  process.exit(1);
}

const caseIds = READER_CONTRACT_PRECEDENTS[contractId] ?? [];
const precedents = caseIds
  .map((id) => HUMAN_FEEDBACK_PRECEDENTS.find((precedent) => precedent.id === id))
  .filter((value): value is NonNullable<typeof value> => Boolean(value));

console.log(`# Zero-context cold read · ${contract.id}`);
console.log(`Route sample: ${contract.samplePath}`);
console.log(`Audience: ${contract.audience}`);
console.log(`Primary task: ${contract.primaryTask}`);
console.log(`First viewport goal: ${contract.firstViewportGoal}`);
console.log(`Must stay visible: ${contract.mustStayVisible}`);
console.log('');
console.log('Review the rendered page without reading the implementation, PR description, or experiment chat first.');
console.log('Answer each question in one or two sentences, using only what the page itself communicates.');
console.log('');
console.log('1. In 5–10 seconds, what is this page about?');
console.log('2. What did your attention land on first, and was that the intended object/result rather than an author instruction?');
console.log('3. What is the one most important fact, result, or next action?');
console.log('4. Which sentence, heading, card, bold phrase, or label feels most machine-written or presenter-like? Why?');
console.log('5. Did any terminology force you to leave the reading path, consult a glossary, or reconstruct missing context?');
console.log('6. Are two or more visual centers competing for equal attention? Name them.');
console.log('7. Is any caveat or safety/scientific boundary hidden so deeply that the visible claim becomes misleading?');
console.log('8. What would you remove, rename, or move one layer down while preserving the scientific meaning?');
console.log('');
if (precedents.length) {
  console.log('Historical human-feedback precedents to compare after the cold read:');
  for (const precedent of precedents) {
    console.log(`- ${precedent.id} ${precedent.title}: ${precedent.principle}`);
  }
} else {
  console.log('No structured precedent is bound to this route yet. If the cold read reveals a reusable mechanism, deposit it in website-copy-cases.md before adding a new structured precedent.');
}
