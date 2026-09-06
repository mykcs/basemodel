import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalTestId, parseListedTests, partitionByHistoricalDuration } from '../scripts/ci-playwright-test-list.mjs';

test('canonicalizes Playwright list entries without line-number identity drift', () => {
  const output = '[chromium] › tests/e2e/a.spec.ts:10:2 › slow\n[chromium] › tests/e2e/b.spec.ts:2:1 › fast\n';
  assert.deepEqual(parseListedTests(output).map((entry) => entry.id), [
    'tests/e2e/a.spec.ts › slow',
    'tests/e2e/b.spec.ts › fast',
  ]);
  assert.equal(canonicalTestId('[webkit] › tests/e2e/a.spec.ts:10:2 › slow'), null);
});

test('greedily assigns individual tests by descending historical runtime', () => {
  const tests = parseListedTests([
    '[chromium] › tests/e2e/a.spec.ts:1:1 › a',
    '[chromium] › tests/e2e/b.spec.ts:1:1 › b',
    '[chromium] › tests/e2e/c.spec.ts:1:1 › c',
    '[chromium] › tests/e2e/d.spec.ts:1:1 › d',
  ].join('\n'));
  const result = partitionByHistoricalDuration(tests, {
    'tests/e2e/a.spec.ts › a': 9000,
    'tests/e2e/b.spec.ts › b': 8000,
    'tests/e2e/c.spec.ts › c': 3000,
    'tests/e2e/d.spec.ts › d': 1000,
  }, 2);
  assert.deepEqual(result.shards.map((shard) => shard.tests.map((entry) => entry.id)), [
    ['tests/e2e/a.spec.ts › a', 'tests/e2e/d.spec.ts › d'],
    ['tests/e2e/b.spec.ts › b', 'tests/e2e/c.spec.ts › c'],
  ]);
  assert.equal(result.unseen.length, 0);
});
