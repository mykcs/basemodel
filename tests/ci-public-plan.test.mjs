import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import {
  browserAllocationForMode,
  resolveFullShardTotal,
} from '../scripts/ci-public-plan.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('expensive browser jobs wait for successful deterministic build preflight', () => {
  const publicCi = read('.github/workflows/public-pr-ci.yml');
  const browser = publicCi.split('\n  browser:')[1].split('\n  gate:')[0];
  assert.match(browser, /needs: \[plan, deterministic\]/);
  assert.match(browser, /needs\.deterministic\.result == 'success'/);
  assert.doesNotMatch(browser, /^    if:.*always\(\)|continue-on-error/m);
  const cloud = read('.github/workflows/cloud-figure-visual-review.yml');
  const preflight = cloud.split('\n  preflight:')[1].split('\n  cloud-figure-browsers:')[0];
  assert.ok(preflight.indexOf('run: npm run verify:deploy') < preflight.indexOf('run: npm run build'));
  assert.match(preflight, /run: npm run build/);
  assert.doesNotMatch(preflight, /ui:overflow-preflight/);
  assert.doesNotMatch(preflight, /continue-on-error/);
  const cloudBrowser = cloud.split('\n  cloud-figure-browsers:')[1].split('\n  cloud-figure-evidence:')[0];
  assert.match(cloudBrowser, /needs: preflight/);
  assert.match(cloudBrowser, /EXPECTED_SHA: \$\{\{ needs\.preflight\.outputs\.sha \}\}/);
  assert.doesNotMatch(cloudBrowser, /^    if:.*always\(\)|continue-on-error/m);
});

test('actual final gate shell rejects failed prerequisites and accepts only intentional zero-browser skip', () => {
  const job = read('.github/workflows/public-pr-ci.yml').split('\n  gate:')[1].split('\n  # An independent')[0];
  assert.match(job, /if: always\(\)/);
  assert.match(job, /needs: \[plan, deterministic, browser\]/);
  const script = job.split('        run: |\n')[1].split('\n').map(line => line.slice(10)).join('\n');
  const run = (changes = {}) => spawnSync('/bin/bash', ['-c', script], {
    env: { ...process.env, PLAN_RESULT: 'success', DETERMINISTIC_RESULT: 'success', BROWSER_TOTAL: '8', BROWSER_RESULT: 'success', ...changes },
  }).status;
  assert.equal(run(), 0);
  assert.equal(run({ BROWSER_TOTAL: '0', BROWSER_RESULT: 'skipped' }), 0);
  for (const result of ['failure', 'cancelled', 'skipped']) {
    assert.notEqual(run({ DETERMINISTIC_RESULT: result }), 0);
    assert.notEqual(run({ PLAN_RESULT: result }), 0);
    assert.notEqual(run({ BROWSER_RESULT: result }), 0);
  }
  assert.notEqual(run({ BROWSER_TOTAL: '0', BROWSER_RESULT: 'success' }), 0);
  const cloudGate = read('.github/workflows/cloud-figure-visual-review.yml').split('\n  cloud-figure-evidence:')[1];
  assert.match(cloudGate, /if: always\(\)/);
  assert.match(cloudGate, /run: test "\$SHARD_RESULT" = success/);
  for (const result of ['failure', 'cancelled', 'skipped']) {
    assert.notEqual(spawnSync('/bin/bash', ['-c', 'test "$SHARD_RESULT" = success'], { env: { ...process.env, SHARD_RESULT: result } }).status, 0);
  }
});

test('browser allocation is 0 for skip, 1 for focused, and configured N for full', () => {
  assert.deepEqual(browserAllocationForMode('skip', 8), { browserTotal: 0, shards: [] });
  assert.deepEqual(browserAllocationForMode('focused', 8), { browserTotal: 1, shards: [1] });
  assert.deepEqual(browserAllocationForMode('full', 4), { browserTotal: 4, shards: [1, 2, 3, 4] });
  assert.deepEqual(browserAllocationForMode('full', 6), { browserTotal: 6, shards: [1, 2, 3, 4, 5, 6] });
  assert.deepEqual(browserAllocationForMode('full', 8), { browserTotal: 8, shards: [1, 2, 3, 4, 5, 6, 7, 8] });
});

test('full shard total is bounded and fails closed on malformed configuration', () => {
  assert.equal(resolveFullShardTotal({ CI_FULL_BROWSER_SHARDS: '6' }), 6);
  assert.equal(resolveFullShardTotal({}), 4);
  for (const value of ['0', '17', '3.5', 'many']) {
    assert.throws(() => resolveFullShardTotal({ CI_FULL_BROWSER_SHARDS: value }), /CI_FULL_BROWSER_SHARDS/);
  }
});

test('workflow plans before browser runner allocation and gates skipped browser work explicitly', () => {
  const workflow = read('.github/workflows/public-pr-ci.yml');
  assert.match(workflow, /name: public-plan/);
  assert.match(workflow, /needs: \[plan, deterministic\]/);
  assert.match(workflow, /browser_total: \$\{\{ steps\.plan\.outputs\.browser_total \}\}/);
  assert.match(workflow, /shard: \$\{\{ fromJSON\(needs\.plan\.outputs\.shards_json\) \}\}/);
  assert.match(workflow, /CI_EXPECTED_UI_MODE: \$\{\{ needs\.plan\.outputs\.mode \}\}/);
  assert.match(workflow, /if \[ "\$BROWSER_TOTAL" = 0 \]; then/);
  assert.match(workflow, /test "\$BROWSER_RESULT" = skipped/);
});

test('workflow binds exact event base without fetching every branch history', () => {
  const workflow = read('.github/workflows/public-pr-ci.yml');
  assert.equal((workflow.match(/fetch-depth: 1/g) ?? []).length, 3);
  assert.equal((workflow.match(/git fetch --no-tags --depth=1 origin "\$CI_BASE_SHA"/g) ?? []).length, 4);
});


test('browser discovery contracts run after dependency installation and static build', () => {
  const workflow = readFileSync(new URL('../.github/workflows/public-pr-ci.yml', import.meta.url), 'utf8');
  const job = workflow.split('  deterministic:')[1].split('  browser:')[0];
  const install = job.indexOf('run: npm ci');
  const build = job.indexOf('run: npm run build');
  const discovery = job.indexOf('run: node --test tests/ci-ui-test-list.test.mjs');
  assert.ok(install >= 0 && build > install && discovery > build, 'Playwright discovery imports require installed dependencies and freshly built dist');
  const bootstrap = job.split('- name: Validate CI contracts')[1].split('- name: Install dependencies')[0];
  assert.ok(!bootstrap.includes('ci-ui-test-list.test.mjs'), 'dependency-free bootstrap must not invoke Playwright');
});

test('each workflow builds once and consumers verify only their successful producer artifact', () => {
  for (const [file, producer, consumer, nextJob] of [
    ['public-pr-ci.yml', 'deterministic', 'browser', 'gate'],
    ['cloud-figure-visual-review.yml', 'preflight', 'cloud-figure-browsers', 'cloud-figure-evidence'],
  ]) {
    const workflow = read(`.github/workflows/${file}`);
    assert.equal((workflow.match(/run: npm run build/g) ?? []).length, 1);
    const job = workflow.split(`\n  ${consumer}:`)[1].split(`\n  ${nextJob}:`)[0];
    assert.match(job, new RegExp(`name: static-build-\\$\\{\\{ github.run_id \\}\\}-\\$\\{\\{ needs\\.${producer}\\.outputs\\.build_attempt \\}\\}`));
    assert.match(job, new RegExp(`CI_BUILD_RUN_ATTEMPT: \\$\\{\\{ needs\\.${producer}\\.outputs\\.build_attempt \\}\\}`));
    assert.ok(job.indexOf('run: npm ci') < job.indexOf('run: node scripts/ci-build-artifact.mjs verify'));
    assert.doesNotMatch(job, /run: npm run build/);
    assert.doesNotMatch(job, /run-id:|github-token:|continue-on-error:/);
  }
});
