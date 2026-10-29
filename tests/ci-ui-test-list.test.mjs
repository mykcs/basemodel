import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { assignByTiming, listCanonicalTests, parseCanonicalList } from '../scripts/ci-ui-test-list.mjs';

const receipt = JSON.parse(readFileSync(new URL('../scripts/ci-ui-test-timings-202609152256.json', import.meta.url), 'utf8'));

test('baseline timing receipt is exact and self-identifying', () => {
  assert.equal(receipt.baseline_commit, '5003b92a398848a1061c0ad061a7994a9d2e8e37');
  assert.equal(receipt.canonical_test_count, 197);
  assert.equal(Object.keys(receipt.timings_seconds).length, 197);
  assert.equal(receipt.execution_contract.playwright_workers, 1);
  assert.equal(receipt.execution_contract.retries, 0);
});

test('historical canonical baseline remains fully covered by its timing receipt', () => {
  const tests = Object.keys(receipt.timings_seconds);
  assert.equal(tests.length, 197);
  assert.deepEqual(tests.filter((name) => !receipt.timings_seconds[name]), []);
});

test('historical timing split covers its frozen baseline exactly once', () => {
  const tests = Object.keys(receipt.timings_seconds);
  const result = assignByTiming({ tests, shardTotal: 2, primaryReserveSeconds: 30 });
  assert.deepEqual(result.unknownTests, []);
  assert.equal(result.assignments.flat().length, 197);
  assert.equal(new Set(result.assignments.flat()).size, 197);
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


test('native CI shards discover all canonical and imported tests exactly once', () => {
  const canonical = listCanonicalTests();
  const actual = [];
  for (let shard = 1; shard <= 8; shard += 1) {
    const result = spawnSync('npm', ['run', 'test:ui', '--', '--list', `--shard=${shard}/8`], {
      encoding: 'utf8', env: { ...process.env, CI: '1', PLAYWRIGHT_WORKERS: '1' },
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    actual.push(...parseCanonicalList(result.stdout));
  }
  assert.equal(actual.length, canonical.length);
  assert.equal(new Set(actual).size, canonical.length);
  assert.deepEqual([...actual].sort(), [...canonical].sort());
  for (const helper of ['reader-journey.cases.ts', 'openevo-research-deep-dives.cases.ts']) {
    const expected = canonical.filter(name => name.includes(helper + ':'));
    assert.ok(expected.length > 0, `missing canonical registrations from ${helper}`);
    assert.deepEqual(actual.filter(name => name.includes(helper + ':')).sort(), expected.sort());
  }
  const gate = readFileSync(new URL('../scripts/ci-ui-gate.mjs', import.meta.url), 'utf8');
  assert.ok(gate.includes("['run', 'test:ui', '--', `--shard=${shardIndex}/${shardTotal}`]"));
  assert.ok(!gate.includes("'--test-list'"));
});


test('retired timing-list CLI fails closed instead of emitting unsafe execution lists', () => {
  const result = spawnSync(process.execPath, ['scripts/ci-ui-test-list.mjs'], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Retired execution CLI/);
  assert.match(result.stderr, /--shard=i\/n/);
});
