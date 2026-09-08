#!/usr/bin/env node
import { candidateReceiptTemplate } from '../src/lib/humanPreferenceBrief';

const args = process.argv.slice(2);
let contractId = '';
const taskParts: string[] = [];
for (const arg of args) {
  if (arg.startsWith('--contract=')) contractId = arg.slice('--contract='.length);
  else taskParts.push(arg);
}
const task = taskParts.join(' ').trim();
if (!contractId || !task) {
  console.error('Usage: npx tsx scripts/generate-human-preference-candidate-receipt.ts --contract=<reader-contract> "<task>"');
  process.exit(2);
}

process.stdout.write(JSON.stringify(candidateReceiptTemplate(contractId, task), null, 2) + '\n');
