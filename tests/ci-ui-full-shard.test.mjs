import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FULL_UI_WORK_SECONDS,
  assignWeightedSpecs,
  fullUiShardPlan,
  parseCanonicalFullUiSuite,
} from '../scripts/ci-ui-full-shard.mjs';

test('canonical full UI suite is parsed from the single package.json contract', () => {
  const { specs, passthroughArgs } = parseCanonicalFullUiSuite();
  assert.equal(specs.length, 23);
  assert.equal(new Set(specs).size, specs.length);
  assert.deepEqual(passthroughArgs, ['--project=chromium', '--max-failures=1']);
  for (const spec of specs) assert.ok(Object.hasOwn(FULL_UI_WORK_SECONDS, spec), spec);
});

test('two weighted shards cover the canonical suite exactly once', () => {
  const first = fullUiShardPlan({ shardIndex: 1, shardTotal: 2, primaryReserveSeconds: 23 });
  const second = fullUiShardPlan({ shardIndex: 2, shardTotal: 2, primaryReserveSeconds: 23 });
  const union = [...first.specs, ...second.specs];
  assert.deepEqual([...union].sort(), [...first.canonicalSpecs].sort());
  assert.equal(new Set(union).size, union.length);
  assert.deepEqual(first.estimatedLoads, second.estimatedLoads);
  assert.ok(Math.abs(first.estimatedLoads[0] - first.estimatedLoads[1]) < 2);
  assert.deepEqual(first.unknownSpecs, []);
});

test('new unmeasured specs are included conservatively rather than omitted', () => {
  const specs = ['tests/e2e/known.spec.ts', 'tests/e2e/new-regression.spec.ts'];
  const result = assignWeightedSpecs({
    specs,
    shardTotal: 2,
    weights: { 'tests/e2e/known.spec.ts': 10 },
  });
  assert.deepEqual(result.unknownSpecs, ['tests/e2e/new-regression.spec.ts']);
  assert.deepEqual(result.assignments.flat().sort(), [...specs].sort());
  assert.equal(result.conservativeUnknownWeight, 10);
});

test('invalid or duplicate canonical suites fail closed', () => {
  assert.throws(() => parseCanonicalFullUiSuite('npm test'), /playwright test/);
  assert.throws(
    () => parseCanonicalFullUiSuite('playwright test tests/e2e/a.spec.ts tests/e2e/a.spec.ts'),
    /duplicate/,
  );
});
