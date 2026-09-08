import process from 'node:process';
import { retrieveHumanPreferenceContext } from '../src/lib/humanPreferenceLearning';

const args = process.argv.slice(2);
const contractArg = args.find((arg) => arg.startsWith('--contract='));
const contractId = contractArg?.split('=', 2)[1]?.trim();
const query = args.filter((arg) => !arg.startsWith('--contract=')).join(' ').trim();

if (!query) {
  console.error('Usage: npm run feedback:retrieve -- --contract=study "首屏 标题 AI味"');
  process.exit(1);
}

const result = retrieveHumanPreferenceContext(query, contractId);
if (!result.cases.length && !result.preferences.length) {
  console.log(`No structured preference context matched: ${query}`);
  console.log('Read docs/agents/current/website-copy-cases.md as the canonical raw feedback library; promote a new structured preference only if the mechanism is reusable.');
  process.exit(0);
}

console.log('# Human Preference Brief');
console.log(`Query: ${query}`);
if (contractId) console.log(`Reader Contract: ${contractId}`);
console.log('Precedence: current explicit owner instruction > latest direct feedback case > repeated preference model > generic design guidance > Agent aesthetics.');
console.log('');

if (result.preferences.length) {
  console.log('## Preference Model');
  for (const { preference, score } of result.preferences) {
    console.log(`${preference.id} · ${preference.title} · score ${score} · confidence ${preference.confidence}`);
    console.log(`  prefer: ${preference.statement}`);
    console.log(`  evidence: ${preference.supportingCaseIds.join(', ')}`);
    console.log(`  do not overlearn: ${preference.antiOvergeneralization.join(' / ')}`);
  }
  console.log('');
}

if (result.goldPairs.length) {
  console.log('## Gold Pairs · rejected → accepted');
  for (const { pair } of result.goldPairs) {
    console.log(`${pair.id} · ${pair.caseId}`);
    console.log(`  REJECTED: ${pair.rejected}`);
    console.log(`  ACCEPTED: ${pair.accepted}`);
    console.log(`  because: ${pair.reason}`);
  }
  console.log('');
}

if (result.cases.length) {
  console.log('## Source Cases');
  for (const { precedent, score } of result.cases) {
    console.log(`${precedent.id} · ${precedent.title} · score ${score}`);
    console.log(`  rule: ${precedent.principle}`);
    console.log(`  avoid: ${precedent.antiPatterns.join(' / ')}`);
    console.log(`  prefer: ${precedent.positiveSignals.join(' / ')}`);
  }
}
