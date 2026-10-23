import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
const expected = { sha: 'e'.repeat(40), count: 2, idsHash: createHash('sha256').update(['1'.repeat(20), '2'.repeat(20)].join('\n')).digest('hex') };
import { verifyTypographyReconciliation } from './typography-reconciliation.mjs';

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
