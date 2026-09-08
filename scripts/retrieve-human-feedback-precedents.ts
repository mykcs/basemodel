import process from 'node:process';
import {
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
} from '../src/data/humanFeedbackPrecedents';

const rawQuery = process.argv.slice(2).join(' ').trim();
if (!rawQuery) {
  console.error('Usage: npm run feedback:retrieve -- "首屏 标题 AI味"');
  process.exit(1);
}

const query = rawQuery.toLowerCase();
const tokens = rawQuery
  .split(/[\s,，。/|:：;；()（）\[\]【】]+/)
  .map((token) => token.trim().toLowerCase())
  .filter(Boolean);

const boundContractsByCase = new Map<string, string[]>();
for (const [contractId, caseIds] of Object.entries(READER_CONTRACT_PRECEDENTS)) {
  for (const caseId of caseIds) {
    const list = boundContractsByCase.get(caseId) ?? [];
    list.push(contractId);
    boundContractsByCase.set(caseId, list);
  }
}

const ranked = HUMAN_FEEDBACK_PRECEDENTS.map((precedent) => {
  const haystack = [precedent.title, precedent.principle, ...precedent.tags, ...precedent.antiPatterns, ...precedent.positiveSignals]
    .join(' ')
    .toLowerCase();
  let score = 0;
  for (const tag of precedent.tags) {
    const normalized = tag.toLowerCase();
    if (query.includes(normalized)) score += 6;
  }
  for (const token of tokens) {
    if (token.length < 2) continue;
    if (haystack.includes(token)) score += 2;
  }
  if (query.includes(precedent.id.toLowerCase())) score += 20;
  return { precedent, score };
})
  .filter(({ score }) => score > 0)
  .sort((a, b) => b.score - a.score || a.precedent.id.localeCompare(b.precedent.id))
  .slice(0, 8);

if (!ranked.length) {
  console.log(`No structured precedent matched: ${rawQuery}`);
  console.log('Read docs/agents/current/website-copy-cases.md and add a structured precedent only if the feedback mechanism is genuinely reusable.');
  process.exit(0);
}

console.log(`Human-feedback precedents for: ${rawQuery}\n`);
for (const { precedent, score } of ranked) {
  const contracts = boundContractsByCase.get(precedent.id) ?? [];
  console.log(`${precedent.id} · ${precedent.title} · score ${score}`);
  console.log(`  rule: ${precedent.principle}`);
  console.log(`  avoid: ${precedent.antiPatterns.join(' / ')}`);
  console.log(`  prefer: ${precedent.positiveSignals.join(' / ')}`);
  if (contracts.length) console.log(`  bound reader contracts: ${contracts.join(', ')}`);
  console.log('');
}
