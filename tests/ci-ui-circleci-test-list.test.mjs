import assert from 'node:assert/strict';
import test from 'node:test';
import { circleCiTimingAssignments, titleMapFromCanonical, validateAssignments } from '../scripts/ci-ui-circleci-test-list.mjs';

test('CircleCI title mapping requires unique exact Playwright titles', () => {
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

test('CircleCI assignment validation fails closed on gaps and duplicates', () => {
  const titles = new Map([['alpha', 'a'], ['beta', 'b']]);
  assert.doesNotThrow(() => validateAssignments({ assignments: [['alpha'], ['beta']], canonicalTitles: titles }));
  assert.throws(() => validateAssignments({ assignments: [['alpha'], ['alpha']], canonicalTitles: titles }), /duplicate|count mismatch/);
  assert.throws(() => validateAssignments({ assignments: [['alpha'], []], canonicalTitles: titles }), /empty shard/);
});

test('CircleCI timing adapter records missing historical titles without dropping them', () => {
  const canonical = [
    '[chromium] › a.spec.ts:1:1 › alpha',
    '[chromium] › b.spec.ts:2:1 › beta',
  ];
  const fakeSpawn = (_command, args) => {
    const index = Number(args.find((arg) => arg.startsWith('--index='))?.split('=')[1]);
    return {
      status: 0,
      stdout: index === 0 ? 'alpha\n' : 'beta\n',
      stderr: 'No timing found for "beta"\n',
    };
  };
  const result = circleCiTimingAssignments({ canonical, shardTotal: 2, spawn: fakeSpawn });
  assert.deepEqual([...result.missingTitles], ['beta']);
  assert.deepEqual(result.assignments, [['alpha'], ['beta']]);
});
