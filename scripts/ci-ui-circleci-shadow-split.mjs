import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parseCanonicalList } from './ci-ui-test-list.mjs';

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
  if (assignments.some((items) => items.length === 0)) throw new Error('CircleCI shadow split produced an empty shard');
  if (flat.length !== canonicalTitles.size) throw new Error(`CircleCI shadow split count mismatch: ${flat.length} != ${canonicalTitles.size}`);
  if (new Set(flat).size !== flat.length) throw new Error('CircleCI shadow split contains duplicate test titles');
  for (const title of flat) {
    if (!canonicalTitles.has(title)) throw new Error(`CircleCI shadow split returned unknown test title: ${title}`);
  }
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const shardIndex = Number(process.env.CI_BROWSER_SHARD_INDEX);
  const shardTotal = Number(process.env.CI_BROWSER_SHARD_TOTAL);
  if (!Number.isInteger(shardIndex) || shardIndex < 1 || !Number.isInteger(shardTotal) || shardTotal < 2 || shardIndex > shardTotal) {
    console.error('[ci-circleci-shadow] invalid CI browser shard identity');
    process.exit(2);
  }

  const listed = spawnSync('npm', ['run', 'test:ui', '--', '--list'], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1', PLAYWRIGHT_WORKERS: '1', PLAYWRIGHT_JUNIT_OUTPUT_FILE: '' },
  });
  if (listed.error || listed.status !== 0) {
    if (listed.stdout) process.stdout.write(listed.stdout);
    if (listed.stderr) process.stderr.write(listed.stderr);
    console.error('[ci-circleci-shadow] canonical Playwright list failed');
    process.exit(listed.status ?? 1);
  }
  const canonical = parseCanonicalList(listed.stdout);
  const byTitle = titleMapFromCanonical(canonical);
  const input = `${[...byTitle.keys()].join('\n')}\n`;
  const assignments = [];

  for (let index = 0; index < shardTotal; index += 1) {
    const result = spawnSync('circleci', [
      'tests', 'split',
      '--split-by=timings',
      '--timings-type=testname',
      `--index=${index}`,
      `--total=${shardTotal}`,
    ], { input, encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
      console.error(`[ci-circleci-shadow] native split index=${index} failed`);
      process.exit(result.status ?? 1);
    }
    if (result.stderr) process.stderr.write(result.stderr);
    const missing = (result.stderr ?? '').split(/\r?\n/).filter((line) => line.includes('No timing found for'));
    if (missing.length > 0) {
      console.error(`[ci-circleci-shadow] index=${index} missing historical timing for ${missing.length}/${byTitle.size} canonical test(s)`);
      process.exit(1);
    }
    const selected = result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    assignments.push(selected);
  }

  try {
    validateAssignments({ assignments, canonicalTitles: byTitle });
  } catch (error) {
    console.error('[ci-circleci-shadow]', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log(`[ci-circleci-shadow] timing coverage PASS canonical=${byTitle.size} split=${assignments.map((items) => items.length).join('/')} selected=${assignments[shardIndex - 1].length}`);
  console.log('[ci-circleci-shadow] shadow-only: existing #454 test-list remains authoritative');
}
