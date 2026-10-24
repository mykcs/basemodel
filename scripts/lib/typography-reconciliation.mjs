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
  assert.equal(receipt.sourceReplacementReceipts + receipt.alreadyNormalReceipts + receipt.selectorSplitReceipts + (receipt.currentOwnerTransitionReceipts ?? 0), receipt.baselinePlanned);
  assert.deepEqual(receipt.missing, []);
  if (receipt.currentOwnerTransitionReceipts !== undefined) assert.equal(Object.keys(receipt.currentOwnerTransitions ?? {}).length, receipt.currentOwnerTransitionReceipts);
  const current = new Map(rows.map(row => [row.id, row]));
  for (const [oldId, targets] of entries) {
    assert.match(oldId, /^[a-f0-9]{20}$/);
    assert(targets.length > 0 && new Set(targets).size === targets.length, 'Each old declaration needs unique current targets');
    for (const id of targets) {
      const row = current.get(id);
      assert(row, 'Migration target must exist in current source inventory');
      const transition = receipt.currentOwnerTransitions?.[oldId];
      if (row.executionStatus === 'CURRENT_OWNER_POLICY_ADOPTION') {
        assert(transition && transition.targets.includes(id), 'Owner adoption requires its explicit baseline transition');
        assert.equal(row.decision, 'JUSTIFIED_EXCEPTION', 'Owner-selected typography is an explicit current-policy exception');
      } else assert(['IMPLEMENTED_THIS_CHANGE', 'PREEXISTING_ROLE_BINDING'].includes(row.executionStatus), 'An unresolved migration cannot count as implemented');
      if (transition) {
        assert.equal(transition.kind, 'CURRENT_CANONICAL_OWNER');
        assert.deepEqual([...transition.targets].sort(), [...targets].sort());
        assert(transition.reason?.trim() && transition.oldSourceTuple && transition.currentOwnerEvidence?.length);
        assert(transition.currentProducer?.file && /^[a-f0-9]{64}$/.test(transition.currentProducer.sha256), 'Owner adoption needs its current producer identity');
        assert(transition.policy?.file === 'docs/agents/current/website-design-spec.md' && transition.policy.anchor === '13');
        assert.match(transition.policy.sha256, /^[a-f0-9]{64}$/);
        for (const evidence of transition.currentOwnerEvidence) {
          assert(evidence.file && /^[a-f0-9]{64}$/.test(evidence.sha256));
          assert(evidence.routes?.length > 0 && evidence.selector, 'Each owner transition needs a concrete consumer route and current selector');
        }
      }
      assert(row.migrationOrigins?.some(origin => origin.oldId === oldId && origin.baselineSha === receipt.baselineSha), 'Current target must retain its baseline lineage');
    }
  }
}

/** Route/state totals come from the current build, never a previous fixed site size. */
export function verifyTypographyObservationSnapshot(snapshot) {
  assert(snapshot.routes?.length > 0 && new Set(snapshot.routes).size === snapshot.routes.length);
  assert.equal(snapshot.routeCount, snapshot.routes.length);
  assert.deepEqual(snapshot.dimensions, { widths: [390, 768, 1440], themes: ['light', 'dark'], nativeStates: ['default', 'native-open'] });
  assert.equal(snapshot.states, snapshot.routeCount * 3 * 2 * 2);
  assert(['class', 'attribute', 'where'].includes(snapshot.scopedStyleStrategy));
  assert.equal(snapshot.inputEndEqual, true);
  assert.deepEqual(snapshot.mappingErrors, []);
}
