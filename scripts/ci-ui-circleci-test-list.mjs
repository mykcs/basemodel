import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { assignByTiming, parseCanonicalList } from './ci-ui-test-list.mjs';

export const titleMapFromCanonical = (tests) => {
  const byTitle = new Map();
  for (const identity of tests) {
    const match = identity.match(/^\[chromium\] › .+?:\d+:\d+ › (.+)$/);
    if (!match) throw new Error(`cannot parse canonical Playwright identity: ${identity}`);
    const title = match[1];
    if (byTitle.has(title)) throw new Error(`duplicate canonical Playwright test title: ${title}`);
    byTitle.set(title, identity);
  }
  return byTitle;
};

export const validateAssignments = ({ assignments, canonicalTitles }) => {
  const flat = assignments.flat();
  if (assignments.some((items) => items.length === 0)) throw new Error('CircleCI timing split produced an empty shard');
  if (flat.length !== canonicalTitles.size) throw new Error(`CircleCI timing split count mismatch: ${flat.length} != ${canonicalTitles.size}`);
  if (new Set(flat).size !== flat.length) throw new Error('CircleCI timing split contains duplicate test titles');
  for (const title of flat) {
    if (!canonicalTitles.has(title)) throw new Error(`CircleCI timing split returned unknown test title: ${title}`);
  }
};

const parseArgs = (argv) => {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg?.startsWith('--')) throw new Error(`unexpected argument: ${arg}`);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`${arg} requires a value`);
    out[arg.slice(2)] = value;
    index += 1;
  }
  return out;
};

const listCanonicalTestsWithoutJunit = () => {
  const listed = spawnSync('npm', ['run', 'test:ui', '--', '--list'], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1', PLAYWRIGHT_WORKERS: '1', PLAYWRIGHT_JUNIT_OUTPUT_FILE: '' },
  });
  if (listed.error || listed.status !== 0) {
    if (listed.stdout) process.stdout.write(listed.stdout);
    if (listed.stderr) process.stderr.write(listed.stderr);
    throw listed.error ?? new Error(`canonical Playwright list exited ${listed.status}`);
  }
  return parseCanonicalList(listed.stdout);
};

export const circleCiTimingAssignments = ({ canonical, shardTotal, spawn = spawnSync }) => {
  const byTitle = titleMapFromCanonical(canonical);
  const input = `${[...byTitle.keys()].join('\n')}\n`;
  const assignments = [];
  const missingTitles = new Set();
  const timingWarnings = [];

  for (let index = 0; index < shardTotal; index += 1) {
    const result = spawn('circleci', [
      'tests', 'split',
      '--split-by=timings',
      '--timings-type=testname',
      `--index=${index}`,
      `--total=${shardTotal}`,
    ], { input, encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
      throw result.error ?? new Error(`CircleCI timing split index=${index} exited ${result.status}`);
    }
    if (result.stderr) process.stderr.write(result.stderr);
    for (const line of (result.stderr ?? '').split(/\r?\n/)) {
      const match = line.match(/No timing found for "(.+)"/i);
      if (match) missingTitles.add(match[1]);
      if (/falling back|No timing data|auto-detect(?:ing)? timing/i.test(line)) timingWarnings.push(line);
    }
    assignments.push(result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
  }

  validateAssignments({ assignments, canonicalTitles: byTitle });
  return { assignments, byTitle, missingTitles, timingWarnings };
};

export const chooseCircleCiAssignment = ({ canonical, shardIndex, shardTotal, fallbackReserve, native }) => {
  const nativeUsable = native && native.missingTitles.size === 0 && native.timingWarnings.length === 0;
  if (!nativeUsable) {
    const fallback = assignByTiming({ tests: canonical, shardTotal, primaryReserveSeconds: fallbackReserve });
    const reason = !native
      ? 'native-unavailable'
      : native.missingTitles.size > 0
        ? `missing-history:${native.missingTitles.size}`
        : `timing-warning:${native.timingWarnings.length}`;
    return { selected: fallback.assignments[shardIndex - 1], mode: 'static-fallback', reason };
  }

  const selected = native.assignments[shardIndex - 1].map((title) => native.byTitle.get(title));
  if (selected.some((identity) => !identity)) throw new Error('selected test could not be mapped back to canonical identity');
  return { selected, mode: 'native', reason: 'complete-history' };
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const shardIndex = Number(args['shard-index']);
    const shardTotal = Number(args['shard-total']);
    const fallbackReserve = Number(args['fallback-primary-reserve-seconds'] ?? 1);
    const output = args.output;
    if (!Number.isInteger(shardIndex) || shardIndex < 1 || shardIndex > shardTotal || shardTotal < 2) throw new Error('invalid shard index/total');
    if (!Number.isFinite(fallbackReserve) || fallbackReserve < 0) throw new Error('fallback reserve must be non-negative');
    if (!output) throw new Error('--output is required');

    const canonical = listCanonicalTestsWithoutJunit();
    let native = null;
    try {
      native = circleCiTimingAssignments({ canonical, shardTotal });
    } catch (error) {
      console.warn('[ci-circleci-test-list] native timing unavailable; using static fallback:', error instanceof Error ? error.message : error);
    }
    const plan = chooseCircleCiAssignment({ canonical, shardIndex, shardTotal, fallbackReserve, native });
    writeFileSync(output, `${plan.selected.join('\n')}\n`);
    console.log(`[ci-circleci-test-list] mode=${plan.mode} reason=${plan.reason} canonical=${canonical.length} shard=${shardIndex}/${shardTotal} selected=${plan.selected.length}`);
  } catch (error) {
    console.error('[ci-circleci-test-list]', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
