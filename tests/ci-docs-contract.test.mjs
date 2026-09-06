import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const contract = fileURLToPath(new URL('../scripts/ci-docs-contract.mjs', import.meta.url));
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();

function fixture(t, changes = { 'README.md': '# Updated docs\n' }) {
  const cwd = mkdtempSync(join(tmpdir(), 'basemodel-docs-contract-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  git(cwd, ['init', '-b', 'main']);
  git(cwd, ['config', 'user.name', 'CI Test']);
  git(cwd, ['config', 'user.email', 'ci-test@invalid.local']);
  git(cwd, ['config', 'commit.gpgsign', 'false']);
  writeFileSync(join(cwd, 'README.md'), '# Base\n');
  git(cwd, ['add', '.']);
  git(cwd, ['commit', '-m', 'base']);
  const base = git(cwd, ['rev-parse', 'HEAD']);
  for (const [path, text] of Object.entries(changes)) {
    if (text === null) {
      rmSync(join(cwd, path));
    } else {
      mkdirSync(dirname(join(cwd, path)), { recursive: true });
      writeFileSync(join(cwd, path), text);
    }
  }
  git(cwd, ['add', '-A']);
  git(cwd, ['commit', '--allow-empty', '-m', 'candidate']);
  const head = git(cwd, ['rev-parse', 'HEAD']);
  return { cwd, base, head };
}

function run({ cwd, base, head }, env = {}) {
  return spawnSync(process.execPath, [contract], {
    cwd,
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, CI_BASE_SHA: base, CI_HEAD_SHA: head, ...env },
  });
}

function expectStatus(result, status, message) {
  assert.ifError(result.error);
  assert.equal(result.status, status, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, message);
}

test('valid Markdown additions, modifications, and deletions pass', (t) => {
  const state = fixture(t, { 'README.md': null, 'AGENTS.md': '# Rules\n', 'docs/new.md': '# New\n' });
  expectStatus(run(state), 0, /PASS files=3/);
});

test('every docs-contract Git command explicitly bypasses the pager', (t) => {
  const state = fixture(t);
  const realGit = execFileSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).trim();
  const bin = join(state.cwd, 'bin');
  const log = join(state.cwd, 'git-commands.log');
  mkdirSync(bin);
  const wrapper = join(bin, 'git');
  writeFileSync(wrapper, '#!/bin/sh\n'
    + 'if [ "$1" != "--no-pager" ]; then echo "interactive pager boundary reached" >&2; exit 97; fi\n'
    + 'printf "%s\\n" "$*" >> "$DOCS_TEST_GIT_LOG"\n'
    + 'exec "$DOCS_TEST_REAL_GIT" "$@"\n');
  chmodSync(wrapper, 0o755);
  const result = run(state, {
    PATH: `${bin}:${process.env.PATH}`,
    DOCS_TEST_REAL_GIT: realGit,
    DOCS_TEST_GIT_LOG: log,
    GIT_PAGER: 'false',
    PAGER: 'false',
  });
  expectStatus(result, 0, /PASS files=1/);
  const calls = readFileSync(log, 'utf8').trim().split('\n');
  assert.equal(calls.length, 4);
  assert.ok(calls.every((call) => call.startsWith('--no-pager ')));
  assert.ok(calls.some((call) => call.startsWith('--no-pager diff --check ')));
});

for (const [name, changes, message] of [
  ['whitespace errors', { 'README.md': '# Trailing space \n' }, /trailing whitespace/],
  ['conflict markers', { 'README.md': '<<<<<<< ours\ntext\n>>>>>>> theirs\n' }, /conflict marker/],
  ['NUL bytes', { 'README.md': '# Text\0bad\n' }, /NUL byte/],
  ['non-documentation files', { 'src/code.js': 'export const x = 1;\n' }, /non-documentation path/],
  ['empty diffs', {}, /empty diff/],
]) {
  test(`${name} still fail closed`, (t) => {
    expectStatus(run(fixture(t, changes)), 1, message);
  });
}

test('missing base is an explicit configuration error', (t) => {
  expectStatus(run(fixture(t), { CI_BASE_SHA: '' }), 2, /CI_BASE_SHA is required/);
});

test('an unresolved commit fails closed', (t) => {
  expectStatus(run(fixture(t), { CI_HEAD_SHA: 'nonexistent-commit' }), 1, /FAIL/);
});
