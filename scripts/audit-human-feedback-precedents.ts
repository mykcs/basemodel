import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { SITE_READER_CONTRACTS } from '../src/data/siteReaderContracts';
import {
  GLOBAL_REJECTED_SURFACE_PATTERNS,
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
} from '../src/data/humanFeedbackPrecedents';
import { HUMAN_FEEDBACK_GOLD_PAIRS, HUMAN_PREFERENCE_MODEL } from '../src/data/humanPreferenceModel';
import { goldPairIdsForContract, preferenceIdsForContract } from '../src/lib/humanPreferenceLearning';

const root = process.cwd();
const caseLibraryPath = join(root, 'docs/agents/current/website-copy-cases.md');
const systemPath = join(root, 'docs/agents/current/human-preference-learning-system.md');
const failures: string[] = [];

function walkTextFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walkTextFiles(path);
    return /\.(?:astro|tsx?|jsx?)$/.test(path) ? [path] : [];
  });
}

const caseLibrary = readFileSync(caseLibraryPath, 'utf8');
const system = readFileSync(systemPath, 'utf8');
const rootAgents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
const researchAgents = readFileSync(join(root, 'src/components/research/AGENTS.md'), 'utf8');
const scenarioRegistry = readFileSync(join(root, 'docs/agents/current/scenario-trigger-registry.md'), 'utf8');

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

const preferenceIds = new Set<string>();
for (const preference of HUMAN_PREFERENCE_MODEL) {
  if (preferenceIds.has(preference.id)) failures.push(`duplicate human preference id: ${preference.id}`);
  preferenceIds.add(preference.id);
  if (!preference.scopes.length) failures.push(`${preference.id}: missing scope`);
  if (!preference.retrievalTags.length) failures.push(`${preference.id}: missing retrieval tags`);
  if (!preference.supportingCaseIds.length) failures.push(`${preference.id}: missing supporting cases`);
  if (!preference.antiOvergeneralization.length) failures.push(`${preference.id}: missing anti-overgeneralization boundary`);
  for (const caseId of preference.supportingCaseIds) if (!precedentIds.has(caseId)) failures.push(`${preference.id}: unknown supporting case ${caseId}`);
}

const pairIds = new Set<string>();
for (const pair of HUMAN_FEEDBACK_GOLD_PAIRS) {
  if (pairIds.has(pair.id)) failures.push(`duplicate Gold Pair id: ${pair.id}`);
  pairIds.add(pair.id);
  if (!precedentIds.has(pair.caseId)) failures.push(`${pair.id}: unknown source case ${pair.caseId}`);
  if (pair.rejected.trim() === pair.accepted.trim()) failures.push(`${pair.id}: rejected and accepted sides are identical`);
  if (!pair.reason.trim()) failures.push(`${pair.id}: missing reason`);
  if (!pair.failureMechanisms.length) failures.push(`${pair.id}: missing failure mechanism`);
  if (pair.ownerStatus !== 'accepted') failures.push(`${pair.id}: Gold Pair must be owner-accepted`);
  for (const preferenceId of pair.preferenceIds) if (!preferenceIds.has(preferenceId)) failures.push(`${pair.id}: unknown preference ${preferenceId}`);
}

const contractIds = new Set(SITE_READER_CONTRACTS.map((contract) => contract.id));
for (const [contractId, caseIds] of Object.entries(READER_CONTRACT_PRECEDENTS)) {
  if (!contractIds.has(contractId)) failures.push(`precedent binding references missing reader contract: ${contractId}`);
  if (!caseIds.length) failures.push(`${contractId}: precedent binding is empty`);
  for (const caseId of caseIds) if (!precedentIds.has(caseId)) failures.push(`${contractId}: unknown precedent ${caseId}`);
}

for (const requiredContract of ['study', 'study-results', 'study-run', 'study-briefing', 'capability-home', 'capability-first-run']) {
  if (!READER_CONTRACT_PRECEDENTS[requiredContract]?.length) failures.push(`${requiredContract}: missing required human-feedback precedent binding`);
  if (preferenceIdsForContract(requiredContract).length < 2) failures.push(`${requiredContract}: requires at least two learned preference dimensions`);
  if (goldPairIdsForContract(requiredContract).length < 2) failures.push(`${requiredContract}: requires at least two Gold Pairs`);
}

for (const token of ['Preference Model', 'Gold Pairs', 'Phase A', 'Phase B', 'feedback:retrieve', 'feedback:judge', 'anti-overfitting']) {
  if (!system.toLowerCase().includes(token.toLowerCase())) failures.push(`human-preference-learning-system.md missing: ${token}`);
}
if (!rootAgents.includes('human-preference-learning-system.md')) failures.push('root AGENTS.md does not route to human-preference-learning-system.md');
if (!researchAgents.includes('feedback:retrieve')) failures.push('research AGENTS.md does not require feedback:retrieve');
if (!researchAgents.includes('feedback:cold-read')) failures.push('research AGENTS.md does not route material work through two-phase cold read');
if (!scenarioRegistry.includes('feedback:retrieve')) failures.push('scenario trigger does not execute task-time preference retrieval');
if (!caseLibrary.includes('CASE-083')) failures.push('canonical case library is missing CASE-083 learning-loop correction');

const publicSurfaceFiles = [join(root, 'src/pages'), join(root, 'src/components')].flatMap(walkTextFiles);
for (const file of publicSurfaceFiles) {
  const text = readFileSync(file, 'utf8');
  for (const rejected of GLOBAL_REJECTED_SURFACE_PATTERNS) {
    if (text.includes(rejected)) failures.push(`${file.replace(`${root}/`, '')}: rejected human-feedback regression reappeared: ${rejected}`);
  }
}

if (failures.length) {
  console.error(`Human-feedback learning audit failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Human-feedback learning audit PASS: ${HUMAN_FEEDBACK_PRECEDENTS.length} precedents, ` +
    `${HUMAN_PREFERENCE_MODEL.length} preference dimensions, ${HUMAN_FEEDBACK_GOLD_PAIRS.length} Gold Pairs, ` +
    `${Object.keys(READER_CONTRACT_PRECEDENTS).length} reader-contract bindings, ` +
    `${publicSurfaceFiles.length} public source files checked.`,
);
