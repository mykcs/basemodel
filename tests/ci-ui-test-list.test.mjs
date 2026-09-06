import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { assignByTiming, listCanonicalTests, parseCanonicalList, stableTimingKey } from '../scripts/ci-ui-test-list.mjs';

const receipt = JSON.parse(readFileSync(new URL('../scripts/ci-ui-test-timings-202609061200.json', import.meta.url), 'utf8'));

test('baseline timing receipt is exact and self-identifying', () => {
  assert.equal(receipt.baseline_commit, '799e78bba9e5d528d86c667f2a4fc4289ed14881');
  assert.equal(receipt.canonical_test_count, 163);
  assert.equal(Object.keys(receipt.timings_seconds).length, 163);
  assert.equal(receipt.execution_contract.playwright_workers, 1);
  assert.equal(receipt.execution_contract.retries, 0);
});

test('stable timing identity ignores source line drift but rejects ambiguous identities', () => {
  assert.equal(
    stableTimingKey('[chromium] › example.spec.ts:12:3 › same semantic test'),
    stableTimingKey('[chromium] › example.spec.ts:98:7 › same semantic test'),
  );
  assert.throws(() => stableTimingKey('not a Playwright list identity'), /cannot derive stable timing key/);
});

test('current canonical suite keeps stable identities unique and classifies only semantic changes as unknown', () => {
  const tests = listCanonicalTests();
  const stableKeys = tests.map(stableTimingKey);
  assert.equal(new Set(stableKeys).size, tests.length);
  const result = assignByTiming({ tests, shardTotal: 2, primaryReserveSeconds: 30 });
  assert.deepEqual(result.unknownTests.filter((test) => !tests.includes(test)), []);
  const receiptKeys = new Set(Object.keys(receipt.timings_seconds).map(stableTimingKey));
  assert.deepEqual(
    result.unknownTests.map(stableTimingKey).sort(),
    stableKeys.filter((key) => !receiptKeys.has(key)).sort(),
  );
});

test('two timing-balanced shards cover every current canonical test exactly once', () => {
  const tests = listCanonicalTests();
  const result = assignByTiming({ tests, shardTotal: 2, primaryReserveSeconds: 30 });
  assert.equal(result.assignments.flat().length, tests.length);
  assert.equal(new Set(result.assignments.flat()).size, tests.length);
  assert.deepEqual([...result.assignments.flat()].sort(), [...tests].sort());
  assert.ok(Math.max(...result.loads) - Math.min(...result.loads) < 1);
});

test('unknown current tests are included conservatively instead of disappearing', () => {
  const tests = ['[chromium] › known.spec.ts:1:1 › known', '[chromium] › new.spec.ts:2:1 › new'];
  const result = assignByTiming({ tests, shardTotal: 2, timings: { [tests[0]]: 7 } });
  assert.deepEqual(result.unknownTests, [tests[1]]);
  assert.equal(result.unknownWeight, 7);
  assert.deepEqual(result.assignments.flat().sort(), [...tests].sort());
});

test('invalid canonical list or ambiguous stable identity fails closed', () => {
  assert.throws(() => parseCanonicalList('noise only'), /empty/);
  assert.throws(() => parseCanonicalList('[chromium] › a.spec.ts:1:1 › a\n[chromium] › a.spec.ts:1:1 › a'), /duplicates/);
  assert.throws(
    () => assignByTiming({
      tests: ['[chromium] › a.spec.ts:1:1 › a', '[chromium] › a.spec.ts:9:4 › a'],
      shardTotal: 2,
      timings: { '[chromium] › known.spec.ts:1:1 › known': 7 },
    }),
    /duplicate stable timing keys/,
  );
});
