import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { browserAllocationForMode, resolveFullShardTotal, unifiedBrowserAllocationForMode } from '../scripts/ci-public-plan.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const publicCi = () => read('.github/workflows/public-pr-ci.yml');
const job = (workflow, name) => {
  const marker = `\n  ${name}:\n`;
  const start = workflow.indexOf(marker);
  assert.ok(start >= 0, `Missing workflow job ${name}`);
  const rest = workflow.slice(start + marker.length);
  const next = rest.search(/\n  [A-Za-z_][A-Za-z0-9_-]*:\n/);
  return next < 0 ? rest : rest.slice(0, next);
};
const expression = source => source.match(/^    if: (.+)$/m)?.[1].replace(/^\$\{\{\s*|\s*\}\}$/g, '');
const script = source => {
  const lines = source.split('\n');
  const start = lines.findIndex(line => /^        run: \|/.test(line));
  assert.ok(start >= 0, 'Missing executable gate shell');
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line && !line.startsWith('          ')) break;
    body.push(line.slice(10));
  }
  return body.join('\n');
};
const runShell = (source, env) => spawnSync('/bin/bash', ['-c', script(source)], {
  env: { ...process.env, ...env },
}).status;
const evaluate = (value, context) => runInNewContext(value, {
  always: () => true, contains: (value, needle) => (value ?? '').includes(needle), ...context,
}, { timeout: 100 });

test('legacy one-engine allocation remains compatible and bounded', () => {
  assert.deepEqual(browserAllocationForMode('skip', 8), { browserTotal: 0, shards: [] });
  assert.deepEqual(browserAllocationForMode('focused', 8), { browserTotal: 1, shards: [1] });
  for (const total of [4, 6, 8]) assert.deepEqual(browserAllocationForMode('full', total), {
    browserTotal: total, shards: Array.from({ length: total }, (_, i) => i + 1),
  });
  assert.equal(resolveFullShardTotal({}), 4);
  assert.equal(resolveFullShardTotal({ CI_FULL_BROWSER_SHARDS: '6' }), 6);
  for (const value of ['0', '17', '3.5', 'many']) assert.throws(() => resolveFullShardTotal({ CI_FULL_BROWSER_SHARDS: value }), /CI_FULL_BROWSER_SHARDS/);
});

test('unified allocation schedules each engine once with all four/eight shard identities', () => {
  assert.deepEqual(unifiedBrowserAllocationForMode('skip'), { browserTotal: 0, shards: [], matrix: [] });
  assert.deepEqual(unifiedBrowserAllocationForMode('focused'), { browserTotal: 1, shards: [1], matrix: [] });
  const full = unifiedBrowserAllocationForMode('full');
  assert.equal(full.browserTotal, 12);
  assert.deepEqual(full.shards, []);
  assert.equal(new Set(full.matrix.map(item => `${item.browser}:${item.shard}`)).size, 12);
  for (const [browser, total] of [['chromium', 4], ['webkit', 8]]) {
    const rows = full.matrix.filter(item => item.browser === browser);
    assert.deepEqual(rows.map(item => item.shard), Array.from({ length: total }, (_, i) => i + 1));
    assert.ok(rows.every(item => item.total === total));
  }
  assert.throws(() => unifiedBrowserAllocationForMode('unknown'), /unsupported/);
});

test('real planner CLI preserves typography focused-to-full, docs zero, manual force and legacy callers', t => {
  const root = mkdtempSync(join(tmpdir(), 'unified-planner-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'scripts'));
  copyFileSync(new URL('../scripts/ci-public-plan.mjs', import.meta.url), join(root, 'scripts/ci-public-plan.mjs'));
  writeFileSync(join(root, 'scripts/vercel-ui-plan.ts'), "console.log(JSON.stringify({mode:process.env.TEST_PLAN_MODE,risk:'local',reason:'fixture'}));\n");
  const run = (mode, changes = {}) => spawnSync(process.execPath, ['scripts/ci-public-plan.mjs'], {
    cwd: root, encoding: 'utf8', env: { ...process.env, CI_BASE_SHA: 'a'.repeat(40), CI_HEAD_SHA: 'b'.repeat(40), CI_UNIFIED_BROWSER: '1', CI_HEAD_REF: 'ci/ordinary', TEST_PLAN_MODE: mode, ...changes },
  });
  for (const [mode, ref, expectedMode, count] of [
    ['skip', 'docs/typography-closeout', 'skip', 0], ['focused', 'ci/ordinary', 'focused', 1],
    ['focused', 'ci/typography-test', 'full', 12], ['full', 'ci/ordinary', 'full', 12],
  ]) {
    const result = run(mode, { CI_HEAD_REF: ref });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout.split('\n').find(line => line.startsWith('{')));
    assert.equal(output.mode, expectedMode); assert.equal(output.browser_total, count);
  }
  assert.notEqual(run('full', { CI_HEAD_REF: '' }).status, 0);
  assert.notEqual(run('unrecognized').status, 0);
  assert.equal(JSON.parse(run('skip', { CI_FORCE_FULL: '1' }).stdout.split('\n').find(line => line.startsWith('{'))).browser_total, 12);
  assert.equal(JSON.parse(run('full', { CI_UNIFIED_BROWSER: '0', CI_HEAD_REF: '', CI_FULL_BROWSER_SHARDS: '6' }).stdout.split('\n').find(line => line.startsWith('{'))).browser_total, 6);
});

test('one automatic workflow runs draft heads and the former figure entrypoint is manual-only', () => {
  const workflow = publicCi();
  assert.match(workflow, /types: \[opened, synchronize, reopened\]/);
  assert.doesNotMatch(workflow, /ready_for_review|pull_request\.draft|pull_request\.isDraft|pull_request_target/);
  assert.match(workflow, /workflow_call:/);
  const manual = read('.github/workflows/cloud-figure-visual-review.yml');
  assert.match(manual, /workflow_dispatch:/);
  assert.doesNotMatch(manual, /\n  pull_request:|\n  push:/);
  const review = job(manual, 'review');
  assert.match(review, /uses: \.\/\.github\/workflows\/public-pr-ci.yml/);
  assert.match(review, /force_full: true/);
  const pilot = job(manual, 'performance-pilot');
  assert.match(pilot, /if: inputs.purpose == 'performance-pilot'/);
  assert.match(pilot, /name: diagnostic-webkit-pilot-/);
  assert.doesNotMatch(pilot, /name: (?:figure-raw-|basemodel-figure-)|public-ci-gate/);
});

test('all consumers wait for the same successful preflight and bind the frozen source and producer attempt', () => {
  const workflow = publicCi();
  const plan = job(workflow, 'plan');
  assert.match(plan, /CI_UNIFIED_BROWSER: '1'/);
  assert.match(plan, /CI_HEAD_REF: \$\{\{ steps\.candidate\.outputs\.head_ref \}\}/);
  assert.match(plan, /Candidate must be an open PR targeting this repository main/);
  assert.match(plan, /Candidate moved since the triggering event/);
  const deterministic = job(workflow, 'deterministic');
  assert.match(deterministic, /needs: plan/);
  assert.ok(deterministic.indexOf('run: npm run verify:deploy') < deterministic.indexOf('run: npm run build'));
  assert.ok(deterministic.indexOf('run: npm run build') < deterministic.indexOf('run: npm run ui:overflow-preflight'));
  assert.match(deterministic, /image: mcr\.microsoft\.com\/playwright:v[\d.]+-noble@sha256:[a-f0-9]{64}/);
  assert.equal((workflow.match(/run: npm run build/g) ?? []).length, 1);
  for (const name of ['browser', 'full_browser', 'extras']) {
    const source = job(workflow, name);
    assert.match(source, /needs: \[plan, deterministic\]/);
    assert.match(source, /needs\.deterministic\.result == 'success'/);
    assert.doesNotMatch(source, /^    if:.*always\(\)|continue-on-error/m);
    assert.match(source, /ref: \$\{\{ needs\.plan\.outputs\.sha \}\}/);
    assert.match(source, /CI_BASE_SHA: \$\{\{ needs\.plan\.outputs\.base \}\}/);
    assert.match(source, /CI_BUILD_RUN_ATTEMPT: \$\{\{ needs\.deterministic\.outputs\.build_attempt \}\}/);
    assert.match(source, /name: static-build-\$\{\{ github.run_id \}\}-\$\{\{ needs\.deterministic\.outputs\.build_attempt \}\}/);
    assert.ok(source.indexOf('run: npm ci') < source.indexOf('run: node scripts/ci-build-artifact.mjs verify'));
    assert.doesNotMatch(source, /run: npm run build|run-id:|github-token:/);
  }
  assert.match(job(workflow, 'browser'), /needs\.plan\.outputs\.mode == 'focused'/);
  assert.match(job(workflow, 'full_browser'), /needs\.plan\.outputs\.mode == 'full'/);
  assert.match(job(workflow, 'extras'), /needs\.plan\.outputs\.mode == 'full'/);
});

test('docs skip unused artifacts while full capture retains original baseline, exhaustive typography and evidence retention', () => {
  const workflow = publicCi(), deterministic = job(workflow, 'deterministic');
  for (const name of ['Seal exact-head static artifact', 'Upload exact-head static artifact', 'Validate built browser discovery contracts']) {
    const condition = deterministic.split(`- name: ${name}\n`)[1].match(/if: ([^\n]+)/)[1];
    for (const [total, expected] of [['0', false], ['1', true], ['12', true]]) assert.equal(evaluate(condition, { needs: { plan: { outputs: { browser_total: total } } } }), expected);
  }
  const full = job(workflow, 'full_browser');
  assert.match(full, /include: \$\{\{ fromJSON\(needs\.plan\.outputs\.matrix_json\) \}\}/);
  assert.match(full, /CLOUD_FIGURE_AUDIT: '1'/);
  assert.match(full, /FIGURE_REQUIRE_BASELINE: '1'/);
  assert.match(full, /FIGURE_SHARD_TOTAL: \$\{\{ matrix\.total \}\}/);
  assert.match(full, /timed test:ui:all/);
  assert.doesNotMatch(workflow, /\n  typography_full_webkit:\n/);
  const max = full.match(/MAX_FAILURES: (.+)/)[1].replace(/^\$\{\{\s*|\s*\}\}$/g, '');
  const days = full.match(/retention-days: (.+)/)[1].replace(/^\$\{\{\s*|\s*\}\}$/g, '');
  for (const [head, maxFailures, retention] of [['ci/ordinary', '1', 3], ['ci/typography', '0', 7]]) {
    const context = { needs: { plan: { outputs: { head_ref: head } } } };
    assert.equal(evaluate(max, context), maxFailures); assert.equal(evaluate(days, context), retention);
  }
  assert.match(job(workflow, 'extras'), /ci-ui-gate\.mjs extras/);
  assert.match(job(workflow, 'extras'), /dist\/__qa__\/core-research-visual-signatures\.json/);
  const aggregate = job(workflow, 'cloud-figure-evidence');
  assert.match(aggregate, /needs: \[plan, deterministic, full_browser\]/);
  assert.match(aggregate, /if: always\(\)/);
  assert.equal((aggregate.match(/FIGURE_REQUIRE_BASELINE: '1'/g) ?? []).length, 2);
  assert.equal((aggregate.match(/FIGURE_SHARD_TOTAL:/g) ?? []).length, 2);
});

const resultsFor = mode => ({
  PLAN_RESULT: 'success', DETERMINISTIC_RESULT: 'success', FIGURE_RESULT: 'success',
  MODE: mode, BROWSER_TOTAL: mode === 'skip' ? '0' : mode === 'focused' ? '1' : '12',
  BROWSER_RESULT: mode === 'focused' ? 'success' : 'skipped',
  FULL_RESULT: mode === 'full' ? 'success' : 'skipped', EXTRAS_RESULT: mode === 'full' ? 'success' : 'skipped',
});

test('actual required gate shell accepts only the complete allocated profile and rejects failure/cancellation/missing work', () => {
  const gate = job(publicCi(), 'gate');
  assert.match(gate, /name: public-ci-gate/); assert.match(gate, /if: always\(\)/);
  assert.match(gate, /needs: \[plan, deterministic, browser, full_browser, extras, cloud-figure-evidence\]/);
  for (const mode of ['skip', 'focused', 'full']) {
    const good = resultsFor(mode); assert.equal(runShell(gate, good), 0, mode);
    for (const field of ['PLAN_RESULT', 'DETERMINISTIC_RESULT', 'FIGURE_RESULT']) for (const result of ['failure', 'cancelled', 'skipped', ''])
      assert.notEqual(runShell(gate, { ...good, [field]: result }), 0, `${mode}/${field}/${result}`);
    for (const field of ['BROWSER_RESULT', 'FULL_RESULT', 'EXTRAS_RESULT']) {
      for (const result of ['success', 'skipped', 'failure', 'cancelled', '']) if (result !== good[field])
        assert.notEqual(runShell(gate, { ...good, [field]: result }), 0, `${mode}/${field}/${result}`);
    }
    for (const allocation of ['', 'unknown', '-1', '01', '8']) assert.notEqual(runShell(gate, { ...good, BROWSER_TOTAL: allocation }), 0);
  }
  assert.notEqual(runShell(gate, { ...resultsFor('full'), MODE: 'unknown' }), 0);
});

test('actual figure gate shell permits only intentional non-full skips and rejects failed prerequisites', () => {
  const aggregate = job(publicCi(), 'cloud-figure-evidence');
  for (const mode of ['skip', 'focused', 'full']) {
    const good = { PREFLIGHT_RESULT: 'success', DETERMINISTIC_RESULT: 'success', FIGURE_MODE: mode, SHARD_RESULT: mode === 'full' ? 'success' : 'skipped' };
    assert.equal(runShell(aggregate, good), 0);
    for (const field of ['PREFLIGHT_RESULT', 'DETERMINISTIC_RESULT']) for (const result of ['failure', 'cancelled', 'skipped', ''])
      assert.notEqual(runShell(aggregate, { ...good, [field]: result }), 0);
    for (const result of ['failure', 'cancelled', '']) assert.notEqual(runShell(aggregate, { ...good, SHARD_RESULT: result }), 0);
    assert.notEqual(runShell(aggregate, { ...good, SHARD_RESULT: mode === 'full' ? 'skipped' : 'success' }), 0);
  }
  assert.notEqual(runShell(aggregate, { PREFLIGHT_RESULT: 'success', DETERMINISTIC_RESULT: 'success', FIGURE_MODE: '', SHARD_RESULT: 'skipped' }), 0);
});

test('typography alias consumes unified evidence once and still fails when planning fails on an applicable PR', () => {
  const alias = job(publicCi(), 'typography_full_webkit_gate');
  assert.match(alias, /name: typography-full-webkit-gate/);
  assert.match(alias, /needs: \[plan, deterministic, full_browser, cloud-figure-evidence\]/);
  assert.equal(evaluate(expression(alias), { github: { head_ref: 'ci/typography' }, needs: { plan: { outputs: {} } } }), true);
  const run = (mode, extra = {}) => runShell(alias, {
    PLAN_RESULT: 'success', DETERMINISTIC_RESULT: 'success', FIGURE_RESULT: 'success',
    MODE: mode, BROWSER_TOTAL: mode === 'skip' ? '0' : '12', WEBKIT_RESULT: mode === 'skip' ? 'skipped' : 'success', ...extra,
  });
  assert.equal(run('skip'), 0); assert.equal(run('full'), 0);
  for (const field of ['PLAN_RESULT', 'DETERMINISTIC_RESULT', 'FIGURE_RESULT']) for (const value of ['failure', 'cancelled', 'skipped', '']) assert.notEqual(run('full', { [field]: value }), 0);
  assert.notEqual(run('full', { WEBKIT_RESULT: 'skipped' }), 0);
  assert.notEqual(run('skip', { WEBKIT_RESULT: 'success' }), 0);
  assert.notEqual(run('focused', { BROWSER_TOTAL: '1' }), 0);
  assert.notEqual(run('full', { BROWSER_TOTAL: '' }), 0);
});
