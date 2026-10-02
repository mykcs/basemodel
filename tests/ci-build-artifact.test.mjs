import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const SOURCE_SCRIPT = new URL('../scripts/ci-build-artifact.mjs', import.meta.url);
const git = (cwd, ...args) => execFileSync('git', ['--no-pager', ...args], { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();

function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'basemodel-build-artifact-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, 'scripts'), { recursive: true });
  mkdirSync(join(cwd, 'dist', 'nested'), { recursive: true });
  copyFileSync(SOURCE_SCRIPT, join(cwd, 'scripts', 'ci-build-artifact.mjs'));
  writeFileSync(join(cwd, '.gitignore'), 'dist/\nci-public-build-manifest.json\n');
  writeFileSync(join(cwd, 'package.json'), '{"name":"fixture","private":true}\n');
  writeFileSync(join(cwd, 'package-lock.json'), JSON.stringify({
    name: 'fixture', lockfileVersion: 3, packages: {
      '': { name: 'fixture' },
      'node_modules/@playwright/test': { version: '1.63.0' },
      'node_modules/astro': { version: '7.2.9' },
    },
  }, null, 2));
  writeFileSync(join(cwd, 'dist', 'index.html'), '<h1>fixture</h1>\n');
  writeFileSync(join(cwd, 'dist', 'nested', 'data.json'), '{"ok":true}\n');
  git(cwd, 'init', '-b', 'main');
  git(cwd, 'config', 'user.name', 'Build artifact test');
  git(cwd, 'config', 'user.email', 'build-artifact@example.invalid');
  git(cwd, 'config', 'commit.gpgsign', 'false');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', 'base');
  const base = git(cwd, 'rev-parse', 'HEAD');
  writeFileSync(join(cwd, 'candidate.txt'), 'candidate\n');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', 'candidate');
  const head = git(cwd, 'rev-parse', 'HEAD');
  return { cwd, base, head };
}

function run(state, command, extraEnv = {}) {
  const result = spawnSync(process.execPath, ['scripts/ci-build-artifact.mjs', command], {
    cwd: state.cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI_BASE_SHA: state.base,
      CI_HEAD_SHA: state.head,
      GITHUB_REPOSITORY: 'mykcs/basemodel',
      ...extraEnv,
    },
  });
  assert.ifError(result.error);
  return result;
}

function create(state, extraEnv = {}) {
  const result = run(state, 'create', extraEnv);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return JSON.parse(readFileSync(join(state.cwd, 'ci-public-build-manifest.json'), 'utf8'));
}

test('create and verify bind exact head, base, toolchain, environment and file inventory', (t) => {
  const state = fixture(t);
  const manifest = create(state, { PUBLIC_SITE_URL: 'https://example.invalid' });
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.artifactKind, 'public-static-build');
  assert.equal(manifest.repositoryIdentity.head, state.head);
  assert.equal(manifest.repositoryIdentity.base, state.base);
  assert.equal(manifest.toolchain.playwright, '1.63.0');
  assert.equal(manifest.toolchain.astro, '7.2.9');
  assert.equal(manifest.sourceInputs.buildEnvironment.PUBLIC_SITE_URL, 'https://example.invalid');
  assert.deepEqual(manifest.artifact.files.map((file) => file.path), ['index.html', 'nested/data.json']);
  const verified = run(state, 'verify', { PUBLIC_SITE_URL: 'https://example.invalid' });
  assert.equal(verified.status, 0, verified.stdout + verified.stderr);
  assert.match(verified.stdout, /verified 2 files/);
});

test('verify rejects changed, missing and extra artifact files', (t) => {
  const scenarios = [
    ['changed', (state) => writeFileSync(join(state.cwd, 'dist', 'index.html'), '<h1>tampered</h1>\n')],
    ['missing', (state) => rmSync(join(state.cwd, 'dist', 'nested', 'data.json'))],
    ['extra', (state) => writeFileSync(join(state.cwd, 'dist', 'extra.txt'), 'extra\n')],
  ];
  for (const [label, mutate] of scenarios) {
    const state = fixture(t);
    create(state);
    mutate(state);
    const result = run(state, 'verify');
    assert.notEqual(result.status, 0, `${label} artifact unexpectedly passed`);
    assert.match(result.stderr, /artifact file inventory mismatch/);
  }
});

test('verify rejects stale candidate identity and source inputs', (t) => {
  const state = fixture(t);
  create(state);

  const wrongHead = run(state, 'verify', { CI_HEAD_SHA: state.base });
  assert.notEqual(wrongHead.status, 0);
  assert.match(wrongHead.stderr, /HEAD mismatch/);

  const wrongBase = run(state, 'verify', { CI_BASE_SHA: '0000000000000000000000000000000000000000' });
  assert.notEqual(wrongBase.status, 0);
  assert.match(wrongBase.stderr, /CI_BASE_SHA is not available/);

  writeFileSync(join(state.cwd, 'package-lock.json'), readFileSync(join(state.cwd, 'package-lock.json'), 'utf8').replace('1.63.0', '1.63.1'));
  const wrongLock = run(state, 'verify');
  assert.notEqual(wrongLock.status, 0);
  assert.match(wrongLock.stderr, /tracked worktree must be clean/);
});

test('verify rejects build environment and manifest toolchain drift', (t) => {
  const state = fixture(t);
  const manifest = create(state, { PUBLIC_SEARCH_INDEXING: 'disabled' });
  const wrongEnv = run(state, 'verify');
  assert.notEqual(wrongEnv.status, 0);
  assert.match(wrongEnv.stderr, /source inputs mismatch/);

  manifest.toolchain.node = 'v0.0.0';
  writeFileSync(join(state.cwd, 'ci-public-build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const wrongToolchain = run(state, 'verify', { PUBLIC_SEARCH_INDEXING: 'disabled' });
  assert.notEqual(wrongToolchain.status, 0);
  assert.match(wrongToolchain.stderr, /toolchain mismatch/);
});

test('create rejects tracked working-tree drift that is not represented by HEAD', (t) => {
  const state = fixture(t);
  writeFileSync(join(state.cwd, 'candidate.txt'), 'dirty candidate\n');
  const result = run(state, 'create');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /tracked worktree must be clean/);
});

test('create fails closed on missing identities, empty roots and symlinks', (t) => {
  const missingIdentity = fixture(t);
  const noHead = run(missingIdentity, 'create', { CI_HEAD_SHA: '' });
  assert.notEqual(noHead.status, 0);
  assert.match(noHead.stderr, /CI_HEAD_SHA is required/);

  const emptyRoot = fixture(t);
  rmSync(join(emptyRoot.cwd, 'dist'), { recursive: true, force: true });
  mkdirSync(join(emptyRoot.cwd, 'dist'));
  const empty = run(emptyRoot, 'create');
  assert.notEqual(empty.status, 0);
  assert.match(empty.stderr, /contains no files/);

  if (process.platform !== 'win32') {
    const symlink = fixture(t);
    const target = join(symlink.cwd, 'dist', 'index.html');
    const link = join(symlink.cwd, 'dist', 'linked.html');
    execFileSync('ln', ['-s', target, link]);
    const result = run(symlink, 'create');
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unsupported symlink/);
  }
});
