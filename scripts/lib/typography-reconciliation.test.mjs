import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
const expected = { sha: 'e'.repeat(40), count: 2, idsHash: createHash('sha256').update(['1'.repeat(20), '2'.repeat(20)].join('\n')).digest('hex') };
import { verifyTypographyReconciliation, verifyTypographyObservationSnapshot } from './typography-reconciliation.mjs';

const fixture = () => {
  const baselineSha = 'e'.repeat(40), old = ['1'.repeat(20), '2'.repeat(20)];
  const rows = ['a', 'b'].map(letter => ({ id: letter.repeat(20), executionStatus: 'IMPLEMENTED_THIS_CHANGE', migrationOrigins: old.map(oldId => ({ oldId, baselineSha })) }));
  return { rows, receipt: { baselineSha, baselinePlanned: 2, sourceReplacementReceipts: 1, alreadyNormalReceipts: 0, selectorSplitReceipts: 1, missing: [], oldToCurrent: { [old[0]]: [rows[0].id], [old[1]]: rows.map(row => row.id) } } };
};

test('split and converging source declarations retain every original identity', () => {
  const { receipt, rows } = fixture();
  verifyTypographyReconciliation(receipt, rows, expected);
});

for (const [name, corrupt] of [
  ['missing baseline ID', ({ receipt }) => { delete receipt.oldToCurrent['1'.repeat(20)]; }],
  ['shrunk workload and counter', ({ receipt }) => { delete receipt.oldToCurrent['1'.repeat(20)]; receipt.baselinePlanned = 1; receipt.sourceReplacementReceipts = 0; }],
  ['invented source target', ({ receipt }) => { receipt.oldToCurrent['1'.repeat(20)] = ['f'.repeat(20)]; }],
  ['lost historical lineage', ({ rows }) => { rows[0].migrationOrigins = []; }],
  ['new unresolved declaration', ({ rows }) => { rows.push({ id: 'c'.repeat(20), executionStatus: 'PLANNED_NOT_IMPLEMENTED' }); }],
  ['unimplemented source', ({ rows }) => { rows[0].executionStatus = 'PLANNED_NOT_IMPLEMENTED'; }],
]) test(`reconciliation rejects ${name}`, () => {
  const input = fixture(); corrupt(input);
  assert.throws(() => verifyTypographyReconciliation(input.receipt, input.rows, expected));
});

test('missing entire reconciliation is rejected', () => { const { rows } = fixture(); assert.throws(() => verifyTypographyReconciliation(undefined, rows, expected)); });

const ownerFixture = () => {
  const value = fixture(), id = '1'.repeat(20), target = value.rows[0];
  target.executionStatus = 'CURRENT_OWNER_POLICY_ADOPTION'; target.decision = 'JUSTIFIED_EXCEPTION';
  value.receipt.currentOwnerTransitions = { [id]: { kind: 'CURRENT_CANONICAL_OWNER', targets: [target.id], reason: 'Newer accepted article owner replaces a removed local size', oldSourceTuple: { file: 'old.astro' }, currentProducer: { file: 'old.astro', sha256: 'c'.repeat(64) }, policy: { file: 'docs/agents/current/website-design-spec.md', anchor: '13', sha256: 'f'.repeat(64) }, currentOwnerEvidence: [{ file: 'src/styles/research-article.css', selector: '.evo-approved-reader', sha256: 'a'.repeat(64), routes: ['/guide/'] }] } };
  // The second original also reaches target a, so both lineages need explicit adoption evidence.
  value.receipt.currentOwnerTransitions['2'.repeat(20)] = { ...value.receipt.currentOwnerTransitions[id], targets: value.rows.map(row => row.id) };
  return value;
};
test('newer canonical article ownership is explicit rather than falsely counted as old size implementation', () => {
  const { receipt, rows } = ownerFixture(); verifyTypographyReconciliation(receipt, rows, expected);
});
for (const [name, corrupt] of [
  ['missing transition', v => { delete v.receipt.currentOwnerTransitions; }],
  ['missing real consumer', v => { v.receipt.currentOwnerTransitions['1'.repeat(20)].currentOwnerEvidence[0].routes = []; }],
  ['missing producer', v => { delete v.receipt.currentOwnerTransitions['1'.repeat(20)].currentProducer; }],
  ['unbound target', v => { v.receipt.currentOwnerTransitions['1'.repeat(20)].targets = []; }],
  ['owner exception called migration', v => { v.rows[0].decision = 'MIGRATE'; }],
]) test('owner adoption rejects '+name, () => { const value = ownerFixture(); corrupt(value); assert.throws(() => verifyTypographyReconciliation(value.receipt, value.rows, expected)); });
const snapshotFixture = () => ({ routes: ['/','/handbook/'], routeCount: 2, dimensions: { widths: [390,768,1440], themes: ['light','dark'], nativeStates: ['default','native-open'] }, states: 24, scopedStyleStrategy: 'class', inputEndEqual: true, mappingErrors: [] });
test('observation dimensions use the actual route manifest including handbook', () => verifyTypographyObservationSnapshot(snapshotFixture()));
for (const [name, corrupt] of [
  ['old fixed 3216 states', v => { v.states = 3216; }],
  ['missing route', v => { v.routes.pop(); }],
  ['duplicate route', v => { v.routes[1] = '/'; }],
  ['producer changed', v => { v.inputEndEqual = false; }],
  ['mapping failure', v => { v.mappingErrors.push({ file:'example.astro' }); }],
]) test('observation rejects '+name, () => { const value=snapshotFixture(); corrupt(value); assert.throws(() => verifyTypographyObservationSnapshot(value)); });
