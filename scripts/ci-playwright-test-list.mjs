import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const PREFIX = '[chromium] › ';
const HISTORY_PATH = new URL('../ci/playwright-test-history.json', import.meta.url);

export function canonicalTestId(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith(PREFIX)) return null;
  const rest = trimmed.slice(PREFIX.length);
  const separator = rest.indexOf(' › ');
  if (separator < 0) return null;
  const file = rest.slice(0, separator).replace(/:\d+(?::\d+)?$/, '');
  return `${file} › ${rest.slice(separator + 3)}`;
}

export function parseListedTests(output) {
  const cleanOutput = output.replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, '');
  const tests = [];
  const seen = new Set();
  for (const rawLine of cleanOutput.split('\n')) {
    const line = rawLine.trim();
    const id = canonicalTestId(line);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    tests.push({ id, line: `${PREFIX}${id}` });
  }
  return tests;
}

export function partitionByHistoricalDuration(tests, history, shardCount) {
  if (!Number.isInteger(shardCount) || shardCount < 1) {
    throw new Error(`shardCount must be a positive integer, got ${shardCount}`);
  }
  const known = tests.map((test) => Number(history[test.id])).filter((value) => Number.isFinite(value) && value > 0);
  const fallbackMs = known.length > 0
    ? Math.round(known.slice().sort((a, b) => a - b)[Math.floor(known.length / 2)])
    : 1000;
  const weighted = tests.map((test) => {
    const value = Number(history[test.id]);
    const historical = Number.isFinite(value) && value > 0;
    return { ...test, estimatedMs: historical ? value : fallbackMs, historical };
  });
  weighted.sort((a, b) => b.estimatedMs - a.estimatedMs || a.id.localeCompare(b.id));

  const shards = Array.from({ length: shardCount }, (_, index) => ({
    index: index + 1,
    estimatedMs: 0,
    tests: [],
  }));
  for (const test of weighted) {
    const target = shards.reduce((best, shard) => (
      shard.estimatedMs < best.estimatedMs ? shard : best
    ), shards[0]);
    target.tests.push(test);
    target.estimatedMs += test.estimatedMs;
  }
  return { shards, fallbackMs, unseen: weighted.filter((test) => !test.historical).map((test) => test.id) };
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  return result;
}

function positiveInteger(name, fallback) {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function main() {
  const shardIndex = positiveInteger('CI_BROWSER_SHARD_INDEX', 1);
  const shardTotal = positiveInteger('CI_BROWSER_SHARD_TOTAL', 1);
  if (shardIndex > shardTotal) throw new Error('CI_BROWSER_SHARD_INDEX exceeds CI_BROWSER_SHARD_TOTAL');

  const history = JSON.parse(readFileSync(HISTORY_PATH, 'utf8')).tests;
  const listed = run('npm', ['run', 'test:ui', '--', '--list', '--reporter=list']);
  if (listed.status !== 0) {
    process.stdout.write(listed.stdout || '');
    process.stderr.write(listed.stderr || '');
    process.exit(listed.status ?? 1);
  }
  const tests = parseListedTests(`${listed.stdout || ''}\n${listed.stderr || ''}`);
  if (tests.length === 0) throw new Error('Playwright discovery returned no test cases');
  const { shards, fallbackMs, unseen } = partitionByHistoricalDuration(tests, history, shardTotal);
  const shard = shards[shardIndex - 1];
  if (shard.tests.length === 0) throw new Error(`weighted shard ${shardIndex} is empty`);

  console.log(`[ci-playwright-test-list] discovered=${tests.length} shards=${shardTotal} shard=${shardIndex}`);
  console.log(`[ci-playwright-test-list] estimated_ms=${shard.estimatedMs} tests=${shard.tests.length} historical=${shard.tests.filter((test) => test.historical).length} fallback_ms=${fallbackMs} unseen=${unseen.length}`);
  if (unseen.length > 0) console.warn('[ci-playwright-test-list] unseen tests use the historical median as a conservative scheduling weight');

  const directory = mkdtempSync(join(tmpdir(), 'basemodel-playwright-test-list-'));
  const listPath = join(directory, `shard-${shardIndex}-of-${shardTotal}.txt`);
  writeFileSync(listPath, `# Generated from frozen historical Playwright timings.\n${shard.tests.map((test) => test.line).join('\n')}\n`);
  const started = Date.now();
  const result = spawnSync('npx', [
    'playwright', 'test',
    '--test-list', listPath,
    '--project=chromium',
    '--max-failures=1',
  ], {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_WORKERS: process.env.PLAYWRIGHT_WORKERS || '1' },
  });
  console.log(`[ci-playwright-test-list] observed_ms=${Date.now() - started}`);
  rmSync(directory, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
