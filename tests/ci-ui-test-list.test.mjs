import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { assignByTiming, listCanonicalTests, parseCanonicalList } from '../scripts/ci-ui-test-list.mjs';

const receipt = JSON.parse(readFileSync(new URL('../scripts/ci-ui-test-timings-202609061200.json', import.meta.url), 'utf8'));

test('baseline timing receipt is exact and self-identifying', () => {
  assert.equal(receipt.baseline_commit, '799e78bba9e5d528d86c667f2a4fc4289ed14881');
  assert.equal(receipt.canonical_test_count, 163);
  assert.equal(Object.keys(receipt.timings_seconds).length, 163);
  assert.equal(receipt.execution_contract.playwright_workers, 1);
  assert.equal(receipt.execution_contract.retries, 0);
});

test('canonical Playwright list is fully covered by the baseline timing receipt', () => {
  const tests = listCanonicalTests();
  assert.equal(tests.length, 163);
  assert.deepEqual(tests.filter((name) => !receipt.timings_seconds[name]), []);
});

test('two timing-balanced shards cover every canonical test exactly once', () => {
  const tests = listCanonicalTests();
  const result = assignByTiming({ tests, shardTotal: 2, primaryReserveSeconds: 30 });
  assert.deepEqual(result.unknownTests, []);
  assert.equal(result.assignments.flat().length, 163);
  assert.equal(new Set(result.assignments.flat()).size, 163);
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

test('invalid canonical list fails closed', () => {
  assert.throws(() => parseCanonicalList('noise only'), /empty/);
  assert.throws(() => parseCanonicalList('[chromium] › a.spec.ts:1:1 › a\n[chromium] › a.spec.ts:1:1 › a'), /duplicates/);
});
