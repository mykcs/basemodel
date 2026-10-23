import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const timingReceipt = JSON.parse(
  readFileSync(new URL('./ci-ui-test-timings-202609152256.json', import.meta.url), 'utf8'),
);

export const parseCanonicalList = (stdout) => {
  const tests = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\[chromium\] › /.test(line));
  if (tests.length === 0) throw new Error('Playwright canonical list is empty');
  if (new Set(tests).size !== tests.length) throw new Error('Playwright canonical list contains duplicates');
  return tests;
};

export const assignByTiming = ({ tests, shardTotal, primaryReserveSeconds = 0, timings = timingReceipt.timings_seconds }) => {
  if (!Number.isInteger(shardTotal) || shardTotal < 1) throw new Error('shardTotal must be a positive integer');
  if (!Number.isFinite(primaryReserveSeconds) || primaryReserveSeconds < 0) throw new Error('primaryReserveSeconds must be non-negative');
  const knownWeights = Object.values(timings).filter((value) => Number.isFinite(value) && value > 0);
  const unknownWeight = knownWeights.length > 0 ? Math.max(...knownWeights) : 1;
  const loads = Array.from({ length: shardTotal }, (_, index) => index === 0 ? primaryReserveSeconds : 0);
  const assignments = Array.from({ length: shardTotal }, () => []);
  const unknownTests = [];

  const weighted = tests.map((test) => {
    const measured = timings[test];
    if (!Number.isFinite(measured) || measured <= 0) {
      unknownTests.push(test);
      return { test, weight: unknownWeight };
    }
    return { test, weight: measured };
  }).sort((left, right) => right.weight - left.weight || left.test.localeCompare(right.test));

  for (const item of weighted) {
    let target = 0;
    for (let index = 1; index < shardTotal; index += 1) {
      if (loads[index] < loads[target]) target = index;
    }
    assignments[target].push(item.test);
    loads[target] += item.weight;
  }

  if (assignments.some((items) => items.length === 0)) throw new Error('timing split produced an empty shard');
  const flattened = assignments.flat();
  if (flattened.length !== tests.length || new Set(flattened).size !== tests.length) {
    throw new Error('timing split does not cover the canonical suite exactly once');
  }
  return { assignments, loads, unknownTests, unknownWeight };
};

export const listCanonicalTests = () => {
  const result = spawnSync('npm', ['run', 'test:ui', '--', '--list'], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1', PLAYWRIGHT_WORKERS: '1' },
  });
  if (result.error || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw result.error ?? new Error(`Playwright --list exited ${result.status}`);
  }
  return parseCanonicalList(result.stdout);
};

// Retain the timing receipt and pure allocator for historical analysis only.
// Native Playwright shards own current execution, including imported tests.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  console.error('[ci-ui-test-list] Retired execution CLI: use npm run test:ui -- --shard=i/n; helper locations cannot safely select importing specs.');
  process.exit(2);
}
