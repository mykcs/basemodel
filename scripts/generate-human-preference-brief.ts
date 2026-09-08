#!/usr/bin/env node
import { buildHumanPreferenceBrief, renderHumanPreferenceBriefMarkdown } from '../src/lib/humanPreferenceBrief';

const args = process.argv.slice(2);
let contractId: string | undefined;
const queryParts: string[] = [];
for (const arg of args) {
  if (arg.startsWith('--contract=')) contractId = arg.slice('--contract='.length);
  else queryParts.push(arg);
}
const query = queryParts.join(' ').trim();
if (!query) {
  console.error('Usage: npx tsx scripts/generate-human-preference-brief.ts --contract=<reader-contract> "<task + feedback cue + reader problem>"');
  process.exit(2);
}

const brief = buildHumanPreferenceBrief({ query, contractId });
process.stdout.write(renderHumanPreferenceBriefMarkdown(brief) + '\n');
