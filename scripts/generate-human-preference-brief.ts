#!/usr/bin/env node
import { buildHumanPreferenceBrief, renderHumanPreferenceBriefMarkdown } from '../src/lib/humanPreferenceBrief';
import type { HumanPreferenceScopeV2 } from '../src/data/humanPreferenceLearningHistory';

const args = process.argv.slice(2);
let contractId: string | undefined;
let scope: HumanPreferenceScopeV2 | undefined;
const queryParts: string[] = [];
for (const arg of args) {
  if (arg.startsWith('--contract=')) contractId = arg.slice('--contract='.length);
  else if (arg.startsWith('--scope=')) scope = arg.slice('--scope='.length) as HumanPreferenceScopeV2;
  else queryParts.push(arg);
}
const query = queryParts.join(' ').trim();
if (!query) {
  console.error('Usage: npx tsx scripts/generate-human-preference-brief.ts [--contract=<reader-contract>] [--scope=<preference-scope>] "<task + feedback cue + reader problem>"');
  process.exit(2);
}

const brief = buildHumanPreferenceBrief({ query, contractId, scope });
process.stdout.write(renderHumanPreferenceBriefMarkdown(brief) + '\n');
