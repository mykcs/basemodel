import assert from 'node:assert/strict';
import test from 'node:test';
import { titleMapFromCanonical, validateAssignments } from '../scripts/ci-ui-circleci-shadow-split.mjs';

test('shadow title mapping requires unique exact Playwright titles', () => {
  const map = titleMapFromCanonical([
    '[chromium] › a.spec.ts:1:1 › alpha',
    '[chromium] › b.spec.ts:2:1 › beta',
  ]);
  assert.deepEqual([...map.keys()], ['alpha', 'beta']);
  assert.throws(() => titleMapFromCanonical([
    '[chromium] › a.spec.ts:1:1 › duplicate',
    '[chromium] › b.spec.ts:2:1 › duplicate',
  ]), /duplicate canonical Playwright test title/);
});

test('shadow assignment validation fails closed on gaps and duplicates', () => {
  const titles = new Map([['alpha', 'a'], ['beta', 'b']]);
  assert.doesNotThrow(() => validateAssignments({ assignments: [['alpha'], ['beta']], canonicalTitles: titles }));
  assert.throws(() => validateAssignments({ assignments: [['alpha'], ['alpha']], canonicalTitles: titles }), /duplicate|count mismatch/);
  assert.throws(() => validateAssignments({ assignments: [['alpha'], []], canonicalTitles: titles }), /empty shard/);
});
