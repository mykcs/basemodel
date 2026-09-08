import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { SITE_READER_CONTRACTS } from '../src/data/siteReaderContracts';
import {
  GLOBAL_REJECTED_SURFACE_PATTERNS,
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
} from '../src/data/humanFeedbackPrecedents';

const root = process.cwd();
const caseLibraryPath = join(root, 'docs/agents/current/website-copy-cases.md');
const failures: string[] = [];

function walkTextFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walkTextFiles(path);
    return /\.(?:astro|tsx?|jsx?)$/.test(path) ? [path] : [];
  });
}

const caseLibrary = readFileSync(caseLibraryPath, 'utf8');
const precedentIds = new Set<string>();
for (const precedent of HUMAN_FEEDBACK_PRECEDENTS) {
  if (precedentIds.has(precedent.id)) failures.push(`duplicate human-feedback precedent id: ${precedent.id}`);
  precedentIds.add(precedent.id);
  if (!caseLibrary.includes(precedent.id)) failures.push(`${precedent.id}: not found in website-copy-cases.md`);
  if (!precedent.tags.length) failures.push(`${precedent.id}: requires at least one retrieval tag`);
  if (!precedent.principle.trim()) failures.push(`${precedent.id}: empty principle`);
  if (!precedent.antiPatterns.length) failures.push(`${precedent.id}: requires at least one anti-pattern`);
  if (!precedent.positiveSignals.length) failures.push(`${precedent.id}: requires at least one positive signal`);
}

const contractIds = new Set(SITE_READER_CONTRACTS.map((contract) => contract.id));
for (const [contractId, caseIds] of Object.entries(READER_CONTRACT_PRECEDENTS)) {
  if (!contractIds.has(contractId)) failures.push(`precedent binding references missing reader contract: ${contractId}`);
  if (!caseIds.length) failures.push(`${contractId}: precedent binding is empty`);
  for (const caseId of caseIds) if (!precedentIds.has(caseId)) failures.push(`${contractId}: unknown precedent ${caseId}`);
}

for (const requiredContract of ['study', 'study-results', 'study-run', 'study-briefing', 'capability-home', 'capability-first-run']) {
  if (!READER_CONTRACT_PRECEDENTS[requiredContract]?.length) failures.push(`${requiredContract}: missing required human-feedback precedent binding`);
}

const publicSurfaceFiles = [join(root, 'src/pages'), join(root, 'src/components')].flatMap(walkTextFiles);
for (const file of publicSurfaceFiles) {
  const text = readFileSync(file, 'utf8');
  for (const rejected of GLOBAL_REJECTED_SURFACE_PATTERNS) {
    if (text.includes(rejected)) failures.push(`${file.replace(`${root}/`, '')}: rejected human-feedback regression reappeared: ${rejected}`);
  }
}

if (failures.length) {
  console.error(`Human-feedback precedent audit failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Human-feedback precedent audit PASS: ${HUMAN_FEEDBACK_PRECEDENTS.length} structured precedents, ` +
    `${Object.keys(READER_CONTRACT_PRECEDENTS).length} reader-contract bindings, ` +
    `${publicSurfaceFiles.length} public source files checked for known regressions.`,
);
