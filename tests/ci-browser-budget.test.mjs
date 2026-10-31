import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

const git = (cwd, ...args) => execFileSync('git', ['--no-pager', ...args], { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function fixture(t, changedFile = 'docs/note.md') {
  const cwd = mkdtempSync(join(tmpdir(), 'basemodel-browser-budget-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, 'scripts'));
  for (const name of ['ci-ui-gate.mjs', 'vercel-ui-plan.ts', 'vercel-git-range.mjs', 'preflight-ui.ts']) {
    copyFileSync(new URL(`../scripts/${name}`, import.meta.url), join(cwd, 'scripts', name));
  }
  writeFileSync(join(cwd, 'package.json'), '{"type":"module"}\n');
  git(cwd, 'init', '-b', 'main');
  git(cwd, 'config', 'user.name', 'CI budget test');
  git(cwd, 'config', 'user.email', 'ci-budget@example.invalid');
  git(cwd, 'config', 'commit.gpgsign', 'false');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', 'base');
  const base = git(cwd, 'rev-parse', 'HEAD');
  mkdirSync(dirname(join(cwd, changedFile)), { recursive: true });
  writeFileSync(join(cwd, changedFile), '# Candidate\n');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', 'candidate');

  const head = git(cwd, 'rev-parse', 'HEAD');
  const bin = join(cwd, 'bin');
  const log = join(cwd, 'spend.log');
  mkdirSync(bin);
  for (const cmd of ['npm', 'npx']) {
    const path = join(bin, cmd);
    writeFileSync(path, `#!/bin/sh\nprintf '%s\\n' '${cmd}' \"$@\" >> \"$CI_BUDGET_LOG\"\nexit 73\n`);
    chmodSync(path, 0o755);
  }
  return { cwd, base, head, bin, log };
}
function run(state, env = {}, args = []) {
  const result = spawnSync(process.execPath, ['scripts/ci-ui-gate.mjs', ...args], {
    cwd: state.cwd, encoding: 'utf8', timeout: 8000,
    env: { ...process.env, PATH: `${state.bin}:${process.env.PATH}`, CI_BUDGET_LOG: state.log,
      CI_BASE_SHA: state.base, CI_HEAD_SHA: state.head, CI_BROWSER_SHARD_TOTAL: '2',
      CI_BROWSER_SHARD_INDEX: '1', CI_BROWSER_INSTALL: '1', CI_BROWSER_BUILD: '1',
      CI_UI_FORCE_FULL: '0', ...env },
  });
  assert.ifError(result.error);
  return result;
}

function extrasFixture(t) {
  const state = fixture(t, 'src/styles/budget-check.css');
  for (const name of ['ci-ui-test-list.mjs', 'ci-ui-test-timings-202609152256.json']) {
    copyFileSync(new URL(`../scripts/${name}`, import.meta.url), join(state.cwd, 'scripts', name));
  }
  const source = `import { appendFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
const args=process.argv.slice(2);appendFileSync(process.env.CI_BUDGET_LOG,JSON.stringify(args)+'\\n');
if(args[0]==='playwright'&&args[1]==='install')process.exit(0);
if(!args.includes('--reporter=json')&&!args.includes('--reporter=list,json'))process.exit(71);
const core=args.includes('tests/e2e/core-research-visual-signatures.capture.spec.ts');
const file=core?'core-research-visual-signatures.capture.spec.ts':'lab-server-visual-qa.spec.ts';
const count=core?1:6, scenario=process.env.EXTRA_TEST_SCENARIO;
const specs=Array.from({length:scenario==='missing'&&core?0:count},(_,i)=>({title:core?'capture accepted core research screenshot signatures':'Lab fixture '+i,file,line:i+1,column:1,tests:[{projectName:'chromium',expectedStatus:'passed',status:scenario==='skipped'&&!args.includes('--list')?'skipped':args.includes('--list')?'skipped':'expected',results:args.includes('--list')?[]:[{status:'passed',retry:0}]}]}));
if(scenario==='unexpected'&&!args.includes('--list')&&core)specs[0].title='not the selected test';
if(scenario==='retry'&&!args.includes('--list')&&core)specs[0].tests[0].results.push({status:'passed',retry:1});
mkdirSync(dirname(process.env.PLAYWRIGHT_JSON_OUTPUT_FILE),{recursive:true});writeFileSync(process.env.PLAYWRIGHT_JSON_OUTPUT_FILE,JSON.stringify({suites:[{title:file,file,specs}]}));
if(scenario==='command-failure'&&!args.includes('--list'))process.exit(37);
`;
  writeFileSync(join(state.bin, 'npx'), `#!${process.execPath}\n${source}`);
  chmodSync(join(state.bin, 'npx'), 0o755);
  return state;
}

test('extras executes only the one core capture and six Lab cases with reused build', t => {
  const state = extrasFixture(t);
  const result = run(state, { CI_BROWSER_INSTALL: '0', CI_BROWSER_BUILD: '0', CI_BROWSER_SHARD_TOTAL: '1', CI_UNIFIED_PREFLIGHT: '1' }, ['extras']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const calls = readFileSync(state.log, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  assert.equal(calls.filter(args => args.includes('--list')).length, 2);
  assert.equal(calls.filter(args => args.includes('--reporter=list,json')).length, 2);
  assert.ok(calls.every(args => args[0] === 'playwright' && args[1] === 'test'), 'unified extras must not install or build');
  assert.ok(calls.every(args => args[0] !== 'ci' && !args.includes('build')));
  assert.ok(calls.filter(args => args[1] === 'test').every(args => args.includes('--retries=0') && args.includes('--workers=1')));
  const proof = JSON.parse(readFileSync(join(state.cwd, 'ci-browser-extras/public-extras-proof.json')));
  assert.equal(proof.cases, 7);
  assert.equal(proof.head, state.head);
  assert.deepEqual(proof.suites.map(suite => suite.cases), [1, 6]);
});

test('extras rejects missing, skipped, retried or unexpected cases and propagates command failures', t => {
  for (const scenario of ['missing', 'skipped', 'retry', 'unexpected', 'command-failure']) {
    const state = extrasFixture(t);
    mkdirSync(join(state.cwd, 'ci-browser-extras'));
    writeFileSync(join(state.cwd, 'ci-browser-extras/public-extras-proof.json'), '{"cases":7}\n');
    const result = run(state, { CI_BROWSER_INSTALL: '0', CI_BROWSER_BUILD: '0', CI_BROWSER_SHARD_TOTAL: '1', CI_UNIFIED_PREFLIGHT: '1', EXTRA_TEST_SCENARIO: scenario }, ['extras']);
    assert.notEqual(result.status, 0, scenario + ' unexpectedly passed');
    if (scenario === 'command-failure') assert.equal(result.status, 37);
    assert.equal(existsSync(join(state.cwd, 'ci-browser-extras/public-extras-proof.json')), false);
  }
});

test('extras keeps skip free, rejects focused/non-owner allocation and never broadens focused coverage', t => {
  const skip = fixture(t);
  noSpend(skip, run(skip, { CI_BROWSER_SHARD_TOTAL: '1' }, ['extras']));
  const focused = fixture(t, 'src/pages/budget-check.astro');
  const refused = run(focused, { CI_BROWSER_SHARD_TOTAL: '1' }, ['extras']);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /extras requires full applicability/);
  assert.equal(existsSync(focused.log), false);
  const multiple = fixture(t, 'src/styles/budget-check.css');
  assert.equal(run(multiple, {}, ['extras']).status, 2);
  assert.equal(existsSync(multiple.log), false);
});
function noSpend(state, result) {
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(existsSync(state.log), false, 'npm/npx ran before a no-work exit');
  assert.equal(existsSync(join(state.cwd, 'node_modules')), false);
}

for (let shard = 1; shard <= 2; shard += 1) {
  test(`skip mode spends no npm/browser work on shard ${shard}`, (t) => {
    const state = fixture(t);
    const result = run(state, { CI_BROWSER_SHARD_INDEX: String(shard) });
    assert.match(result.stdout, /plan=skip/);
    noSpend(state, result);
  });
  if (shard > 1) test(`focused mode spends no npm/browser work on non-owner shard ${shard}`, (t) => {
    const state = fixture(t, 'src/pages/budget-check.astro');
    const result = run(state, { CI_BROWSER_SHARD_INDEX: String(shard) });
    assert.match(result.stdout, /plan=focused/);
    noSpend(state, result);
  });
  test(`full mode still installs dependencies on shard ${shard}`, (t) => {
    const state = fixture(t, 'src/styles/budget-check.css');
    const result = run(state, { CI_BROWSER_SHARD_INDEX: String(shard) });
    assert.match(result.stdout, /plan=full/);
    assert.equal(result.status, 73, 'installer failure must propagate');
    assert.equal(readFileSync(state.log, 'utf8'), 'npm\nci\n');
  });
}
test('focused primary shard still owns install and acceptance', (t) => {
  const state = fixture(t, 'src/pages/budget-check.astro');
  const result = run(state);
  assert.match(result.stdout, /plan=focused/);
  assert.equal(result.status, 73);
  assert.equal(readFileSync(state.log, 'utf8'), 'npm\nci\n');
});

test('briefing-only changes spend nothing on non-owner browser shards', (t) => {
  const state = fixture(t, 'src/components/research/SeedOpenEvoProgressBriefing.astro');
  const result = run(state, { CI_BROWSER_SHARD_INDEX: '2' });
  assert.match(result.stdout, /plan=focused/);
  noSpend(state, result);
});
test('briefing-only shard 1 still owns install and focused acceptance', (t) => {
  const state = fixture(t, 'src/components/research/SeedOpenEvoProgressBriefing.astro');
  const result = run(state);
  assert.match(result.stdout, /plan=focused/);
  assert.equal(result.status, 73);
  assert.equal(readFileSync(state.log, 'utf8'), 'npm\nci\n');
});

test('mechanism-copy changes spend nothing on browser shard 2', (t) => {
  const state = fixture(t, 'src/components/research/OpenEvoMechanismMap.astro');
  const result = run(state, { CI_BROWSER_SHARD_INDEX: '2' });
  assert.match(result.stdout, /plan=focused/);
  noSpend(state, result);
});
test('mechanism-copy shard 1 still propagates dependency installation failures', (t) => {
  const state = fixture(t, 'src/components/research/OpenEvoMechanismMap.astro');
  const result = run(state);
  assert.match(result.stdout, /plan=focused/);
  assert.equal(result.status, 73);
  assert.equal(readFileSync(state.log, 'utf8'), 'npm\nci\n');
});


test('planner drift fails before spending browser work', (t) => {
  const state = fixture(t, 'src/styles/budget-check.css');
  const result = run(state, { CI_EXPECTED_UI_MODE: 'focused' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /planner drift/);
  assert.equal(existsSync(state.log), false);
});

test('force-full never takes a cheap skip path', (t) => {
  const state = fixture(t);
  const result = run(state, { CI_UI_FORCE_FULL: '1', CI_BROWSER_SHARD_INDEX: '2' });
  assert.equal(result.status, 73);
  assert.equal(readFileSync(state.log, 'utf8'), 'npm\nci\n');
});
test('an unresolvable Git range fails to full, not a free green skip', (t) => {
  const state = fixture(t);
  const result = run(state, { CI_BASE_SHA: 'missing-commit' });
  assert.match(result.stdout, /plan=full/);
  assert.equal(result.status, 73);
});
test('malformed planner output fails before spending', (t) => {
  const state = fixture(t);
  writeFileSync(join(state.cwd, 'scripts/vercel-ui-plan.ts'), "process.stdout.write('{}');\n");
  const result = run(state);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid planner mode/);
  assert.equal(existsSync(state.log), false);
});
test('invalid shard identity is not accepted as a skip', (t) => {
  const state = fixture(t);
  assert.equal(run(state, { CI_BROWSER_SHARD_INDEX: '3' }).status, 2);
  assert.equal(existsSync(state.log), false);
});

test('CircleCI delegates browser installation after the shared planner', () => {
  const config = read('.circleci/config.yml');
  const browserJob = config.split('\n  browser_shard:')[1].split('\nworkflows:')[0];
  assert.match(browserJob, /CI_BROWSER_INSTALL: "1"/);
  assert.doesNotMatch(browserJob, /\bnpm ci\b/);
  assert.match(browserJob, /node scripts\/ci-ui-gate\.mjs/);
  assert.match(config, /tests\/ci-browser-budget\.test\.mjs/);
  assert.match(config, /CI_BROWSER_SHARD_TOTAL: "2"/);
});
test('routine dependency updates are serialized without removing security configuration', () => {
  const config = read('.github/dependabot.yml');
  assert.match(config, /open-pull-requests-limit: 1\b/);
  assert.match(config, /interval: weekly/);
  assert.match(config, /applies-to: version-updates/);
  assert.match(config, /production-patch:/);
  assert.match(config, /dev-minor-patch:/);
});
