import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const productionBaseline = { sha: 'eb0f875ae33797939d96507cccde730ea877cbe2', count: 1556, idsHash: '07f23e0841cd49c0c5ae4dbf892578f989609a1b769cc61a77355ab09fd12807' };

/** Verify source migration lineage separately from rendered/visual acceptance. */
export function verifyTypographyReconciliation(receipt, rows, expected = productionBaseline) {
  assert(!rows.some(row => row.executionStatus?.startsWith('PLANNED_')), 'No current source declaration may remain planned at completion');
  assert.match(receipt.baselineSha, /^[a-f0-9]{40}$/);
  const entries = Object.entries(receipt.oldToCurrent);
  assert.equal(receipt.baselineSha, expected.sha, 'Baseline source identity must remain pinned');
  assert.equal(receipt.baselinePlanned, expected.count, 'Cannot shrink the original migration workload');
  assert.equal(createHash('sha256').update(entries.map(([id]) => id).sort().join('\n')).digest('hex'), expected.idsHash, 'Original baseline ID set must remain exact');
  assert.equal(entries.length, receipt.baselinePlanned, 'Baseline migration IDs are missing');
  assert.equal(receipt.sourceReplacementReceipts + receipt.alreadyNormalReceipts + receipt.selectorSplitReceipts, receipt.baselinePlanned);
  assert.deepEqual(receipt.missing, []);
  const current = new Map(rows.map(row => [row.id, row]));
  for (const [oldId, targets] of entries) {
    assert.match(oldId, /^[a-f0-9]{20}$/);
    assert(targets.length > 0 && new Set(targets).size === targets.length, 'Each old declaration needs unique current targets');
    for (const id of targets) {
      const row = current.get(id);
      assert(row, 'Migration target must exist in current source inventory');
      assert(['IMPLEMENTED_THIS_CHANGE', 'PREEXISTING_ROLE_BINDING'].includes(row.executionStatus), 'An unresolved migration cannot count as implemented');
      assert(row.migrationOrigins?.some(origin => origin.oldId === oldId && origin.baselineSha === receipt.baselineSha), 'Current target must retain its baseline lineage');
    }
  }
}
