import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const QUALIFICATION_BRANCH_PREFIX = 'ci/cloudflare-workers-builds-qualification-';
export const QUALIFICATION_ROLES = new Set(['deterministic', 'browser-1', 'browser-2']);

function fail(message, code = 1) {
  console.error(`[ci-cloudflare-qualification] ${message}`);
  process.exit(code);
}

function capture(command, args, env = process.env) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function run(command, args, extraEnv = {}) {
  console.log(`[ci-cloudflare-qualification] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) fail(`failed to start ${command}: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export function parseRangeEnv(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const split = line.indexOf('=');
    if (split <= 0) throw new Error(`invalid range env line: ${line}`);
    result[line.slice(0, split)] = line.slice(split + 1);
  }
  return result;
}

export function validateQualificationEnvironment(env = process.env, nodeVersion = process.versions.node) {
  if (env.WORKERS_CI !== '1') throw new Error('WORKERS_CI=1 is required');
  const branch = env.WORKERS_CI_BRANCH?.trim() ?? '';
  if (!branch.startsWith(QUALIFICATION_BRANCH_PREFIX)) {
    throw new Error(`refuse non-qualification branch: ${branch || '<empty>'}`);
  }
  const head = env.WORKERS_CI_COMMIT_SHA?.trim() ?? '';
  if (!/^[0-9a-f]{40}$/i.test(head)) throw new Error('WORKERS_CI_COMMIT_SHA must be a 40-character Git SHA');
  const role = env.BASEMODEL_CLOUDFLARE_ROLE?.trim() ?? '';
  if (!QUALIFICATION_ROLES.has(role)) throw new Error(`unsupported qualification role: ${role || '<empty>'}`);
  if (Number(nodeVersion.split('.')[0]) !== 24) throw new Error(`Node 24 is required, got ${nodeVersion}`);
  return { branch, head, role };
}

function fullPlan(base, testedHead) {
  const output = capture(process.execPath, [
    'scripts/ci-plan.mjs',
    '--event', 'pull_request',
    '--base', base,
    '--head', testedHead,
  ]);
  process.stdout.write(`${output}\n`);
  const match = output.match(/\[ci-plan\] event=pull_request mode=([^ ]+)/);
  if (!match) fail('could not parse CI plan mode');
  if (match[1] !== 'full') fail(`qualification must fail closed to full mode, got ${match[1]}`);
}

export function main(env = process.env) {
  let identity;
  try {
    identity = validateQualificationEnvironment(env);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error), 2);
  }

  const checkoutHead = capture('git', ['rev-parse', 'HEAD']);
  if (checkoutHead !== identity.head) {
    fail(`checkout HEAD ${checkoutHead} does not match WORKERS_CI_COMMIT_SHA ${identity.head}`);
  }

  // The provider checkout is the source-head identity. Fetch current main explicitly so
  // the existing merge-candidate materializer can test current base + exact source head.
  // A private-repository credential that cannot perform this read is a qualification FAIL.
  run('git', ['fetch', '--no-tags', 'origin', 'main']);
  const base = capture('git', ['rev-parse', 'FETCH_HEAD']);

  const rangeFile = '/tmp/basemodel-cloudflare-ci-range.env';
  run('bash', [
    'scripts/ci-circleci-prepare.sh',
    '--event', 'pull_request',
    '--base', base,
    '--head', identity.head,
    '--output', rangeFile,
  ]);

  const range = parseRangeEnv(readFileSync(rangeFile, 'utf8'));
  if (range.CI_BASE_SHA !== base) fail(`prepared base mismatch: ${range.CI_BASE_SHA} != ${base}`);
  if (range.CI_SOURCE_HEAD_SHA !== identity.head) fail(`prepared source-head mismatch: ${range.CI_SOURCE_HEAD_SHA} != ${identity.head}`);
  if (!/^[0-9a-f]{40}$/i.test(range.CI_HEAD_SHA ?? '')) fail('prepared tested head is not a Git SHA');

  const sharedEnv = {
    CI: '1',
    CI_LOGICAL_EVENT: range.CI_LOGICAL_EVENT,
    CI_BASE_SHA: range.CI_BASE_SHA,
    CI_HEAD_SHA: range.CI_HEAD_SHA,
    CI_SOURCE_HEAD_SHA: range.CI_SOURCE_HEAD_SHA,
  };

  console.log(`[ci-cloudflare-qualification] role=${identity.role} branch=${identity.branch}`);
  console.log(`[ci-cloudflare-qualification] base=${range.CI_BASE_SHA} source_head=${range.CI_SOURCE_HEAD_SHA} tested_head=${range.CI_HEAD_SHA}`);

  if (identity.role === 'deterministic') {
    run('node', ['--test', 'tests/ci-plan.test.mjs', 'tests/ci-circleci-prepare.test.mjs'], sharedEnv);
    fullPlan(range.CI_BASE_SHA, range.CI_HEAD_SHA);
    run('node', ['--test', 'tests/ci-browser-budget.test.mjs'], sharedEnv);
    run('npm', ['ci'], sharedEnv);
    run('npm', ['run', 'verify:deploy'], sharedEnv);
    run('npm', ['run', 'build'], sharedEnv);
    console.log('[ci-cloudflare-qualification] deterministic PASS');
    return;
  }

  const shardIndex = identity.role === 'browser-1' ? '1' : '2';
  run('node', ['scripts/ci-ui-gate.mjs'], {
    ...sharedEnv,
    PLAYWRIGHT_WORKERS: '1',
    CI_BROWSER_BUILD: '1',
    CI_BROWSER_INSTALL: '1',
    CI_PLAYWRIGHT_WITH_DEPS: '1',
    CI_BROWSER_SHARD_TOTAL: '2',
    CI_BROWSER_SHARD_INDEX: shardIndex,
    // Provider-infrastructure qualification deliberately runs the complete Chromium
    // matrix and the Lab reserve on shard 1. This is stronger than an ordinary
    // steady-state focused plan and never changes the canonical assertions.
    CI_UI_FORCE_FULL: '1',
  });
  console.log(`[ci-cloudflare-qualification] ${identity.role} PASS`);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;
if (invoked === import.meta.url) main();
