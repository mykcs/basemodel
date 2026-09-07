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
  for (const name of ['ci-ui-gate.mjs', 'vercel-ui-plan.ts', 'preflight-ui.ts']) {
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
function run(state, env = {}) {
  const result = spawnSync(process.execPath, ['scripts/ci-ui-gate.mjs'], {
    cwd: state.cwd, encoding: 'utf8', timeout: 8000,
    env: { ...process.env, PATH: `${state.bin}:${process.env.PATH}`, CI_BUDGET_LOG: state.log,
      CI_BASE_SHA: state.base, CI_HEAD_SHA: state.head, CI_BROWSER_SHARD_TOTAL: '2',
      CI_BROWSER_SHARD_INDEX: '1', CI_BROWSER_INSTALL: '1', CI_BROWSER_BUILD: '1',
      CI_UI_FORCE_FULL: '0', ...env },
  });
  assert.ifError(result.error);
  return result;
}
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
