import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { assignByTiming, listCanonicalTests, parseCanonicalList, canonicalJsonTests, exactGrepForCases, timedAssignments, requireExactCases, runTimedCli } from '../scripts/ci-ui-test-list.mjs';

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
  assert.ok(gate.includes("['run', 'test:ui', '--', '--list', '--reporter=json']"));
  assert.ok(gate.includes("['scripts/ci-ui-test-list.mjs', 'timed', 'test:ui', 'chromium'"));
  assert.ok(gate.includes("'scripts/ci-ui-test-timings-20261029-public.json', report]"));
  assert.ok(!gate.includes("'--test-list'"));
});


test('retired timing-list CLI fails closed instead of emitting unsafe execution lists', () => {
  const result = spawnSync(process.execPath, ['scripts/ci-ui-test-list.mjs'], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Retired execution CLI/);
  assert.match(result.stderr, /--shard=i\/n/);
});

const reportFixture = (titles = ['a [x].*', 'b'], { executed = false, tags = [] } = {}) => ({
  suites: [{ title: 'importer.spec.ts', file: 'importer.spec.ts', specs: [], suites: [{
    title: 'nested describe', specs: titles.map((title, index) => ({
      title, file: 'tests/e2e/helper.cases.ts', line: index + 1, column: 1, tags,
      tests: [{ projectName: 'webkit', expectedStatus: 'passed', status: executed ? 'expected' : 'skipped', results: executed ? [{ status: 'passed', retry: 0 }] : [] }],
    })),
  }] }],
});

test('timed JSON identities select importing suites and ignore helper source-line drift', () => {
  const canonical = canonicalJsonTests(reportFixture(), { browser: 'webkit' });
  assert.ok(canonical.every(item => item.titlePath[0] === 'importer.spec.ts'));
  assert.ok(canonical.every(item => item.timingKey.startsWith('webkit|helper.cases.ts|')));
  const moved = reportFixture();
  moved.suites[0].suites[0].specs[0].line = 999;
  requireExactCases(canonical, canonicalJsonTests(moved, { browser: 'webkit' }));
  const grep = new RegExp(exactGrepForCases([canonical.find(item => item.title === 'a [x].*')]));
  assert.ok(grep.test(' webkit importer.spec.ts nested describe a [x].*'));
  assert.ok(!grep.test(' webkit helper.cases.ts nested describe a [x].*'));
  assert.ok(!grep.test(' webkit importer.spec.ts nested describe a xZZ'));
  assert.ok(!grep.test(' webkit importer.spec.ts nested describe a [x].* suffix'));
  assert.ok(!grep.test(' chromium importer.spec.ts nested describe a [x].*'));
});

test('timed LPT retains every unknown current test with conservative weights', () => {
  const canonical = canonicalJsonTests(reportFixture(['slow', 'fast', 'new', 'newer']), { browser: 'webkit' });
  const split = timedAssignments(canonical, 2, { 'webkit|helper.cases.ts|slow': 30, 'webkit|helper.cases.ts|fast': 5, 'webkit|old.spec.ts|gone': 40, 'chromium|unrelated.spec.ts|slow': 999 });
  requireExactCases(canonical, split.assignments.flat());
  assert.equal(split.unknownTests.length, 2);
  assert.equal(split.unknownWeight, 40);
  assert.equal(split.loads.reduce((a, b) => a + b, 0), 115);
  assert.throws(() => timedAssignments(canonical, 5, {}), /empty shard/);
  assert.throws(() => timedAssignments([...canonical, canonical[0]], 2, {}), /Duplicate/);
});

test('timed population validation rejects omissions, duplicates, wrong projects and dirty outcomes', () => {
  const canonical = canonicalJsonTests(reportFixture(), { browser: 'webkit' });
  assert.throws(() => requireExactCases(canonical, canonical.slice(1)), /differs/);
  assert.throws(() => requireExactCases(canonical, [...canonical, canonical[0]]), /differs/);
  assert.throws(() => canonicalJsonTests(reportFixture(), { browser: 'chromium' }), /Unexpected browser/);
  assert.throws(() => canonicalJsonTests({ suites: [] }, { browser: 'webkit' }), /Empty/);
  assert.throws(() => canonicalJsonTests({ ...reportFixture(), errors: [{ message: 'teardown' }] }, { browser: 'webkit' }), /global errors/);
  for (const mutate of [
    item => { item.status = 'skipped'; },
    item => { item.status = 'flaky'; },
    item => { item.expectedStatus = 'failed'; },
    item => { item.results[0].status = 'failed'; },
    item => { item.results.push({ status: 'passed' }); },
    item => { item.results[0].retry = 1; },
  ]) {
    const report = reportFixture(['x'], { executed: true });
    mutate(report.suites[0].suites[0].specs[0].tests[0]);
    assert.throws(() => canonicalJsonTests(report, { browser: 'webkit', executed: true }), /clean first-attempt/);
  }
});

function timedCliFixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'timed-cli-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const canonical = join(root, 'canonical.json'), timing = join(root, 'timings.json'), result = join(root, 'result.json');
  writeFileSync(canonical, JSON.stringify(reportFixture(['a'])));
  writeFileSync(timing, JSON.stringify({ timings_seconds: {} }));
  return { root, args: ['test:ui:all', 'webkit', '1', '1', canonical, timing, result] };
}

test('timed CLI verifies its filtered list before running and then checks actual clean coverage', t => {
  const { root, args } = timedCliFixture(t);
  const calls = [];
  const summary = runTimedCli(args, { spawn(command, argv, options) {
    calls.push(argv);
    assert.equal(command, 'npm');
    assert.deepEqual(argv.slice(0, 3), ['run', 'test:ui:all', '--']);
    assert.ok(argv.includes('--project=webkit'));
    assert.ok(argv.includes('--workers=1'));
    assert.ok(!argv.some(arg => arg.includes('--test-list') || arg.startsWith('--shard')));
    writeFileSync(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify(reportFixture(['a'], { executed: !argv.includes('--list') })));
    return { status: 0 };
  } });
  assert.equal(calls.length, 2);
  assert.ok(calls[0].includes('--list'));
  assert.ok(calls[1].includes('--reporter=list,json'));
  assert.equal(summary.selectedCount, 1);
  assert.equal(JSON.parse(readFileSync(join(root, 'timing-webkit-1-of-1-selection.json'))).unknown.length, 1);
});

test('timed CLI refuses a filtered-list omission before execution and propagates command failure', t => {
  const { args } = timedCliFixture(t);
  let calls = 0;
  assert.throws(() => runTimedCli(args, { spawn(command, argv, options) {
    calls++;
    writeFileSync(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify(reportFixture(['wrong'])));
    return { status: 0 };
  } }), /differs/);
  assert.equal(calls, 1);
  assert.throws(() => runTimedCli(args, { spawn() { return { status: 37 }; } }), error => error.exitCode === 37);
  assert.throws(() => runTimedCli(args, { spawn() { return { status: 0 }; } }), /Invalid canonical/);
  assert.throws(() => runTimedCli(['unknown', ...args.slice(1)]), /Usage/);
});

test('timed max-failures defaults to one and exhaustive zero is explicit without retries', t => {
  const { args } = timedCliFixture(t);
  for (const [extra, expected] of [[[], '1'], [['0'], '0'], [['1'], '1']]) {
    const calls = [];
    const summary = runTimedCli([...args, ...extra], { spawn(command, argv, options) {
      calls.push(argv);
      assert.ok(argv.includes(`--max-failures=${expected}`));
      assert.ok(argv.includes('--retries=0'));
      writeFileSync(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify(reportFixture(['a'], { executed: !argv.includes('--list') })));
      return { status: 0 };
    } });
    assert.equal(calls.length, 2);
    assert.equal(summary.maxFailures, Number(expected));
  }
  for (const invalid of ['-1', '2', 'many', '0.5', '']) {
    assert.throws(() => runTimedCli([...args, invalid]), /max.failures|Usage/i);
  }
});

test('timed grep discovers imported helper registrations through the original importer, including describe tags', t => {
  const require = createRequire(import.meta.url);
  const root = mkdtempSync(join(tmpdir(), 'timed-playwright-list-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const api = require.resolve('@playwright/test');
  const cli = join(dirname(require.resolve('@playwright/test/package.json')), 'cli.js');
  const config = join(root, 'playwright.config.cjs');
  writeFileSync(config, 'module.exports={testDir:__dirname,projects:[{name:"webkit"}]};');
  writeFileSync(join(root, 'helper.cases.cjs'), `const {test}=require(${JSON.stringify(api)}); exports.register=()=>test.describe('tagged describe',{tag:'@parent'},()=>{test('helper [exact].*',{tag:'@case'},()=>{});test('other helper',()=>{});});`);
  writeFileSync(join(root, 'importer.spec.cjs'), "require('./helper.cases.cjs').register();");
  const list = grep => {
    const report = join(root, 'report.json');
    const args = [cli, 'test', '--config', config, '--list', '--reporter=json'];
    if (grep) args.push('--grep', grep);
    const result = spawnSync(process.execPath, args, { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: report } });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return canonicalJsonTests(JSON.parse(readFileSync(report, 'utf8')), { browser: 'webkit' });
  };
  const all = list();
  assert.equal(all.length, 2);
  assert.ok(all.every(item => item.specFile.endsWith('helper.cases.cjs')));
  const chosen = all.filter(item => item.title === 'helper [exact].*');
  assert.equal(chosen.length, 1);
  requireExactCases(chosen, list(exactGrepForCases(chosen)));
});

test('timed current public and figure matrices retain every importing/helper registration exactly once', t => {
  const root = mkdtempSync(join(tmpdir(), 'timed-current-lists-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const list = (suite, browser, grep, audit) => {
    const output = join(root, 'list.json');
    const args = ['run', suite, '--', `--project=${browser}`, '--list', '--reporter=json'];
    if (grep) args.push(`--grep=${grep}`);
    const result = spawnSync('npm', args, {
      encoding: 'utf8', env: { ...process.env, CI: '1', CLOUD_FIGURE_AUDIT: audit ? '1' : '0', PLAYWRIGHT_JSON_OUTPUT_FILE: output },
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return canonicalJsonTests(JSON.parse(readFileSync(output, 'utf8')), { browser });
  };
  for (const [suite, browser, total, receiptName, audit] of [
    ['test:ui', 'chromium', 8, 'public', false],
    ['test:ui:all', 'chromium', 4, 'figure', true],
    ['test:ui:all', 'webkit', 8, 'figure', true],
  ]) {
    const canonical = list(suite, browser, undefined, audit);
    const receipt = JSON.parse(readFileSync(new URL(`../scripts/ci-ui-test-timings-20261029-${receiptName}.json`, import.meta.url)));
    const allocation = timedAssignments(canonical, total, receipt.timings_seconds);
    const actual = [];
    for (const assigned of allocation.assignments) {
      const discovered = list(suite, browser, exactGrepForCases(assigned), audit);
      requireExactCases(assigned, discovered);
      actual.push(...discovered);
    }
    requireExactCases(canonical, actual);
    assert.equal(new Set(actual.map(item => item.id)).size, canonical.length);
    for (const helper of ['reader-journey.cases.ts', 'openevo-research-deep-dives.cases.ts']) {
      assert.ok(canonical.some(item => item.specFile.endsWith(helper)), `missing canonical helper ${helper}`);
      assert.equal(actual.filter(item => item.specFile.endsWith(helper)).length, canonical.filter(item => item.specFile.endsWith(helper)).length);
    }
  }
});

test('Public extras bridge unified Chromium and legacy Public populations without unrelated tests', t => {
  const root = mkdtempSync(join(tmpdir(), 'public-extras-lists-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const listed = (command, args) => {
    const path = join(root, 'list.json');
    const result = spawnSync(command, args, { encoding: 'utf8', env: { ...process.env, CI: '1', PLAYWRIGHT_JSON_OUTPUT_FILE: path } });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return canonicalJsonTests(JSON.parse(readFileSync(path, 'utf8')), { browser: 'chromium' });
  };
  const publicCases = listed('npm', ['run', 'test:ui', '--', '--list', '--reporter=json']);
  const unified = listed('npm', ['run', 'test:ui:all', '--', '--project=chromium', '--list', '--reporter=json']);
  const core = listed('npx', ['playwright', 'test', 'tests/e2e/core-research-visual-signatures.capture.spec.ts', '--project=chromium', '--list', '--reporter=json']);
  const lab = listed('npx', ['playwright', 'test', '--config', 'tests/e2e/lab-playwright.config.ts', '--list', '--reporter=json']);
  assert.equal(core.length, 1);
  assert.equal(core[0].specFile, 'core-research-visual-signatures.capture.spec.ts');
  assert.equal(lab.length, 6);
  assert.ok(lab.every(item => item.specFile === 'lab-server-visual-qa.spec.ts'));
  requireExactCases(publicCases, [...unified, ...core]);
  assert.equal(new Set([...publicCases, ...lab].map(item => item.id)).size, publicCases.length + lab.length);
});
