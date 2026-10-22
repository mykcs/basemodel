import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { inventoryCSS, inventoryAstro } from './lib/typography-inventory.mjs';

const root = new URL('../', import.meta.url).pathname;
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'docs/agents/evidence/sitewide-typography/2026-10-22/source-disposition-ledger.json'), 'utf8'));
const memo = new Map();
for (let owner = 0; owner < ledger.dictionary.length; owner++) {
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if (!Array.isArray(value) && Object.keys(value).length === 1 && '$ref' in value) {
      assert(Number.isInteger(value.$ref) && value.$ref >= 0 && value.$ref < owner, 'Dictionary references must point backwards');
    } else for (const child of Object.values(value)) visit(child);
  };
  visit(ledger.dictionary[owner]);
}
function decode(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 1 && '$ref' in value) {
    const index = value.$ref;
    assert(Number.isInteger(index) && index >= 0 && index < ledger.dictionary.length);
    if (!memo.has(index)) memo.set(index, decode(ledger.dictionary[index]));
    return memo.get(index);
  }
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]));
  return value;
}
const rows = ledger.rows.map(decode);
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const fingerprint = createHash('sha256');
const source = [];
for (const file of walk(path.join(root, 'src')).filter(file => /\.(astro|css)$/.test(file)).sort()) {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  fingerprint.update(relative + '\0' + text + '\0');
  source.push(...(file.endsWith('.css') ? inventoryCSS(text, relative) : inventoryAstro(text, relative).entries));
}
assert.equal(fingerprint.digest('hex'), ledger.sourceFingerprint, 'Source fingerprint changed: refresh every affected disposition');
const identity = row => JSON.stringify([row.file, row.selector, row.contexts, row.property, row.value]);
assert.deepEqual(rows.map(identity).sort(), source.map(identity).sort(), 'Missing or extra source declarations');
const occurrences = new Map();
const executionCounts = {};
const allowedExecution = new Set(['IMPLEMENTED_THIS_CHANGE', 'PREEXISTING_ROLE_BINDING', 'SOURCE_RETAIN', 'PLANNED_NOT_IMPLEMENTED', 'PLANNED_SELECTOR_SPLIT_NOT_IMPLEMENTED']);
for (const row of rows) {
  const key = identity(row);
  const occurrence = occurrences.get(key) ?? 0;
  occurrences.set(key, occurrence + 1);
  assert.equal(row.occurrence, occurrence);
  assert.equal(row.id, createHash('sha256').update(key + '|' + occurrence).digest('hex').slice(0, 20));
  assert(['MIGRATE', 'JUSTIFIED_EXCEPTION', 'DEAD_OR_SHADOWED'].includes(row.decision));
  assert(allowedExecution.has(row.executionStatus));
  executionCounts[row.executionStatus] = (executionCounts[row.executionStatus] ?? 0) + 1;
  assert(row.semanticRole && row.semanticRole !== 'NOT_YET_MAPPED');
  assert(typeof row.reason === 'string' && row.reason.trim());
  if (row.executionStatus === 'PLANNED_NOT_IMPLEMENTED') assert(row.plannedTarget);
  if (row.executionStatus === 'PLANNED_SELECTOR_SPLIT_NOT_IMPLEMENTED') assert(row.plannedSplitTargets);
}
assert.equal(new Set(rows.map(row => row.id)).size, source.length);
const counts = Object.fromEntries(['MIGRATE', 'JUSTIFIED_EXCEPTION', 'DEAD_OR_SHADOWED'].map(decision => [decision, rows.filter(row => row.decision === decision).length]));
assert.deepEqual(counts, ledger.counts);
assert.deepEqual(executionCounts, ledger.executionCounts);
assert.equal(ledger.pendingRoleMapping, 0);
assert.equal(ledger.observationSnapshot.sourceFingerprint, ledger.sourceFingerprint);
assert.equal(ledger.observationSnapshot.states, 3216);
assert.deepEqual(ledger.observationSnapshot.mappingErrors, []);
for (const observation of ledger.consumerObservations.map(decode)) assert(rows.some(row => row.id === observation.id));
console.log(JSON.stringify({ sourceFingerprint: ledger.sourceFingerprint, declarations: rows.length, counts, executionCounts: ledger.executionCounts, pendingRoleMapping: 0, staticObservationRows: ledger.consumerObservations.length, visualAcceptance: 'SEPARATE_EXACT_HEAD_RECEIPT_REQUIRED' }));
