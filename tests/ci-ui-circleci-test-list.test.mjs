import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseCircleCiAssignment, circleCiTimingAssignments, titleMapFromCanonical, validateAssignments } from '../scripts/ci-ui-circleci-test-list.mjs';

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

test('CircleCI timing adapter records missing history and fallback warnings without dropping tests', () => {
  const canonical = [
    '[chromium] › a.spec.ts:1:1 › alpha',
    '[chromium] › b.spec.ts:2:1 › beta',
  ];
  const fakeSpawn = (_command, args) => {
    const index = Number(args.find((arg) => arg.startsWith('--index='))?.split('=')[1]);
    return {
      status: 0,
      stdout: index === 0 ? 'alpha\n' : 'beta\n',
      stderr: index === 0 ? 'No timing found for "beta"\n' : 'timing data unavailable; falling back to weighting by name\n',
    };
  };
  const result = circleCiTimingAssignments({ canonical, shardTotal: 2, spawn: fakeSpawn });
  assert.deepEqual([...result.missingTitles], ['beta']);
  assert.equal(result.timingWarnings.length, 1);
  assert.deepEqual(result.assignments, [['alpha'], ['beta']]);
});

test('native timing is preferred when complete and static timing remains the fallback', () => {
  const canonical = [
    '[chromium] › a.spec.ts:1:1 › alpha',
    '[chromium] › b.spec.ts:2:1 › beta',
  ];
  const native = {
    assignments: [['alpha'], ['beta']],
    byTitle: titleMapFromCanonical(canonical),
    missingTitles: new Set(),
    timingWarnings: [],
  };
  const nativePlan = chooseCircleCiAssignment({ canonical, shardIndex: 1, shardTotal: 2, fallbackReserve: 1, native });
  assert.equal(nativePlan.mode, 'native');
  assert.deepEqual(nativePlan.selected, [canonical[0]]);

  native.missingTitles.add('beta');
  const fallbackPlan = chooseCircleCiAssignment({ canonical, shardIndex: 1, shardTotal: 2, fallbackReserve: 1, native });
  assert.equal(fallbackPlan.mode, 'static-fallback');
  assert.equal(fallbackPlan.selected.length, 1);

  const unavailablePlan = chooseCircleCiAssignment({ canonical, shardIndex: 2, shardTotal: 2, fallbackReserve: 1, native: null });
  assert.equal(unavailablePlan.mode, 'static-fallback');
  assert.equal(unavailablePlan.selected.length, 1);
});
