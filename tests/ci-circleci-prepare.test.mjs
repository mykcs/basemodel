import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const prepareScript = join(repoRoot, 'scripts', 'ci-circleci-prepare.sh');

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const rangeReceipt = () => join(mkdtempSync(join(tmpdir(), 'basemodel-circleci-env-')), 'range.env');

function parseEnv(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split('=', 2)),
  );
}

function fixtureRepo() {
  const cwd = mkdtempSync(join(tmpdir(), 'basemodel-circleci-'));
  git(cwd, ['init', '-b', 'main']);
  git(cwd, ['config', 'user.name', 'CI Test']);
  git(cwd, ['config', 'user.email', 'ci-test@invalid.local']);
  writeFileSync(join(cwd, 'base.txt'), 'base\n');
  git(cwd, ['add', 'base.txt']);
  git(cwd, ['commit', '-m', 'base']);
  const base = git(cwd, ['rev-parse', 'HEAD']);
  git(cwd, ['checkout', '-b', 'feature']);
  writeFileSync(join(cwd, 'feature.txt'), 'feature\n');
  git(cwd, ['add', 'feature.txt']);
  git(cwd, ['commit', '-m', 'feature']);
  const head = git(cwd, ['rev-parse', 'HEAD']);
  return { cwd, base, head };
}

test('pull_request mode materializes a clean two-parent merge candidate', () => {
  const { cwd, base, head } = fixtureRepo();
  const out = rangeReceipt();

  execFileSync('bash', [prepareScript, '--event', 'pull_request', '--base', base, '--head', head, '--output', out], {
    cwd,
    stdio: 'pipe',
  });

  const env = parseEnv(out);
  assert.equal(env.CI_LOGICAL_EVENT, 'pull_request');
  assert.equal(env.CI_BASE_SHA, base);
  assert.equal(env.CI_SOURCE_HEAD_SHA, head);
  assert.notEqual(env.CI_HEAD_SHA, head);
  const parents = git(cwd, ['rev-list', '--parents', '-n', '1', env.CI_HEAD_SHA]).split(' ');
  assert.deepEqual(parents.slice(1), [base, head]);
  assert.equal(readFileSync(join(cwd, 'base.txt'), 'utf8'), 'base\n');
  assert.equal(readFileSync(join(cwd, 'feature.txt'), 'utf8'), 'feature\n');
  assert.equal(git(cwd, ['status', '--porcelain']), '');
});

test('push mode binds validation to the pushed commit and its first parent', () => {
  const { cwd, base, head } = fixtureRepo();
  const out = rangeReceipt();

  execFileSync('bash', [prepareScript, '--event', 'push', '--head', head, '--output', out], {
    cwd,
    stdio: 'pipe',
  });

  const env = parseEnv(out);
  assert.equal(env.CI_LOGICAL_EVENT, 'push');
  assert.equal(env.CI_BASE_SHA, base);
  assert.equal(env.CI_SOURCE_HEAD_SHA, head);
  assert.equal(env.CI_HEAD_SHA, head);
  assert.equal(git(cwd, ['rev-parse', 'HEAD']), head);
  assert.equal(git(cwd, ['status', '--porcelain']), '');
});
