import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { inventoryCSS, inventoryAstro } from './lib/typography-inventory.mjs';
import { verifyTypographyReconciliation, verifyTypographyObservationSnapshot } from './lib/typography-reconciliation.mjs';
import { intelligenceTypographyDelta } from './lib/typography-intelligence-ui-delta.mjs';

const root = new URL('../', import.meta.url).pathname;
const built = process.argv.includes('--built');
assert(process.argv.slice(2).every(arg => arg === '--built'), 'Only --built is supported');
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
assert(ledger.baselineReconciliation, 'Final migration ledger requires its pinned baseline reconciliation');
verifyTypographyReconciliation(ledger.baselineReconciliation, rows);
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const fingerprint = createHash('sha256');
const source = [];
for (const file of walk(path.join(root, 'src')).filter(file => /\.(astro|css)$/.test(file)).sort()) {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  fingerprint.update(relative + '\0' + text + '\0');
  source.push(...(file.endsWith('.css') ? inventoryCSS(text, relative) : inventoryAstro(text, relative).entries));
}
const identity = row => JSON.stringify([row.file, row.selector, row.contexts, row.property, row.value]);
const currentSourceFingerprint = fingerprint.digest('hex');
const ownerDelta = currentSourceFingerprint === ledger.sourceFingerprint ? null : intelligenceTypographyDelta;
const historicalSourceKeys = rows.map(identity).sort();
const liveSourceKeys = source.map(identity).sort();
const difference = (left, right) => {
  const counts = new Map();
  for (const key of right) counts.set(key, (counts.get(key) ?? 0) + 1);
  return left.filter(key => {
    const remaining = counts.get(key) ?? 0;
    if (remaining) { counts.set(key, remaining - 1); return false; }
    return true;
  }).sort();
};
if (ownerDelta) {
  assert.equal(ownerDelta.fromSourceFingerprint, ledger.sourceFingerprint, 'Typography delta must be anchored to the sealed ledger');
  assert.equal(currentSourceFingerprint, ownerDelta.toSourceFingerprint, 'Unreviewed current-source change: classify the exact typography delta first');
  const declarationKeys = groups => Object.entries(groups).flatMap(([selector, entry]) =>
    Object.entries(entry.properties ?? entry).map(([property, value]) => identity({ file: ownerDelta.owner, selector, contexts: [], property, value })));
  for (const [selector, entry] of Object.entries(ownerDelta.added)) {
    assert(entry.role?.trim(), `New typography selector needs an explicit semantic role: ${selector}`);
    assert(Object.keys(entry.properties).length > 0, `New typography selector has no reviewed declarations: ${selector}`);
  }
  assert(ownerDelta.removedReason?.trim(), 'Removed typography declarations need a reason');
  assert.deepEqual(difference(liveSourceKeys, historicalSourceKeys), declarationKeys(ownerDelta.added).sort(), 'Unexpected new typography declaration outside the reviewed two-stage UI');
  assert.deepEqual(difference(historicalSourceKeys, liveSourceKeys), declarationKeys(ownerDelta.removed).sort(), 'Unexpected removed typography declaration outside the reviewed two-stage UI');
} else {
  assert.deepEqual(historicalSourceKeys, liveSourceKeys, 'Missing or extra source declarations');
}
const occurrences = new Map();
const executionCounts = {};
const allowedExecution = new Set(['IMPLEMENTED_THIS_CHANGE', 'PREEXISTING_ROLE_BINDING', 'SOURCE_RETAIN', 'CURRENT_OWNER_POLICY_ADOPTION', 'PLANNED_NOT_IMPLEMENTED', 'PLANNED_SELECTOR_SPLIT_NOT_IMPLEMENTED']);
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
assert.equal(new Set(rows.map(row => row.id)).size, rows.length, 'Historical ledger occurrence identities must remain unique');
const counts = Object.fromEntries(['MIGRATE', 'JUSTIFIED_EXCEPTION', 'DEAD_OR_SHADOWED'].map(decision => [decision, rows.filter(row => row.decision === decision).length]));
assert.deepEqual(counts, ledger.counts);
assert.deepEqual(executionCounts, ledger.executionCounts);
assert.equal(ledger.pendingRoleMapping, 0);
assert.equal(ledger.observationSnapshot.sourceFingerprint, ledger.sourceFingerprint);
verifyTypographyObservationSnapshot(ledger.observationSnapshot);
const builtRoutes = built ? walk(path.join(root, 'dist')).filter(file => file.endsWith('.html')).map(file => '/' + path.relative(path.join(root, 'dist'), file).replace(/index\.html$/, '')).sort() : ledger.observationSnapshot.routes;
if (built) assert.deepEqual([...ledger.observationSnapshot.routes].sort(), builtRoutes, 'Observation route manifest must match the current built site');
const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
const scope = config.match(/scopedStyleStrategy:\s*['"](class|attribute|where)['"]/)?.[1];
assert.equal(ledger.observationSnapshot.scopedStyleStrategy, scope, 'Observation compiler scoping must match current Astro config');
const changedProducerTransitionIds = new Set();
const invalidatedTransitionIds = new Set();
for (const [transitionId, transition] of Object.entries(ledger.baselineReconciliation.currentOwnerTransitions ?? {})) {
  for (const proof of [transition.policy, transition.currentProducer, ...transition.currentOwnerEvidence]) {
    if (ownerDelta && ownerDelta.changedOwnerProofs[proof.file]) {
      const review = ownerDelta.changedOwnerProofs[proof.file];
      assert(review.reason?.trim() && review.transitions.includes(transitionId), 'Unreviewed old transition proof invalidation');
      changedProducerTransitionIds.add(transitionId);
      continue;
    }
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, proof.file))).digest('hex'), proof.sha256, 'Current owner or policy changed after reconciliation');
  }
  const formerTupleExists = source.some(row => identity(row) === identity(transition.oldSourceTuple));
  assert.equal(formerTupleExists, Boolean(transition.retainedLocalTuple), 'Removed versus retained local tuple must match actual current inventory');
  for (const proof of transition.currentOwnerEvidence) {
    if (ownerDelta && ownerDelta.changedOwnerProofs[proof.file]) {
      assert(ownerDelta.invalidatedHistoricalTransitionIds.includes(transitionId), 'Unreviewed former producer proof invalidation');
      assert(rows.some(row => row.file === proof.file && row.selector === proof.selector && transition.targets.includes(row.id)), 'Former owner proof was not part of the sealed historical ledger');
      invalidatedTransitionIds.add(transitionId);
      continue;
    }
    assert(rows.some(row => row.file === proof.file && row.selector === proof.selector && transition.targets.includes(row.id)), 'Current owner proof must name an actual target source declaration');
    for (const route of proof.routes) {
      assert(builtRoutes.includes(route), 'Transition consumer is absent from current build');
      const ownerRow = rows.find(row => transition.targets.includes(row.id) && row.file === proof.file && row.selector === proof.selector);
      assert(ownerRow, 'Transition consumer must name an actual target source declaration');
      if (ownerRow.observationJoin === 'INVALIDATED_OWNER_CHANGED') {
        assert.equal(ownerRow.observationStatus, 'NOT_REOBSERVED_AFTER_SOURCE_CHANGE', 'Invalidated owner observations must remain explicitly unobserved');
      } else {
        assert(ownerRow.currentObservation?.routes.includes(route), 'Observed transition consumer must actually match its owner selector in the current observation');
      }
    }
  }
}
if (ownerDelta) {
  const expectedTransitionIds = Object.values(ownerDelta.changedOwnerProofs).flatMap(review => review.transitions);
  assert.deepEqual([...changedProducerTransitionIds].sort(), [...expectedTransitionIds].sort(), 'Missing old transition producer invalidation');
  assert.deepEqual([...invalidatedTransitionIds].sort(), [...ownerDelta.invalidatedHistoricalTransitionIds].sort(), 'Missing historical consumer invalidation');
}
assert.deepEqual(ledger.observationSnapshot.mappingErrors, []);
for (const observation of ledger.consumerObservations.map(decode)) assert(rows.some(row => row.id === observation.id));
console.log(JSON.stringify({ historicalSourceFingerprint: ledger.sourceFingerprint, currentSourceFingerprint, historicalDeclarations: rows.length, currentDeclarations: source.length, deltaStatus: ownerDelta ? 'EXACT_DELTA_CLASSIFIED_WITH_HISTORICAL_OBSERVATIONS_INVALIDATED' : 'NO_SOURCE_CHANGE', counts, executionCounts: ledger.executionCounts, pendingRoleMapping: 0, staticObservationRows: ledger.consumerObservations.length, builtVerification: built ? 'CURRENT_DIST_ROUTE_MANIFEST_MATCHED' : 'EXPLICIT_POST_BUILD_GATE_REQUIRED', visualAcceptance: 'SEPARATE_EXACT_HEAD_RECEIPT_REQUIRED' }));
