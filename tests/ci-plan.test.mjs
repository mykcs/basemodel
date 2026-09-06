import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyCiMode } from '../scripts/ci-plan.mjs';

const circleCiConfig = readFileSync(new URL('../.circleci/config.yml', import.meta.url), 'utf8');
const docsContractPath = fileURLToPath(new URL('../scripts/ci-docs-contract.mjs', import.meta.url));

test('pure Markdown documentation PR uses docs mode', () => {
  assert.equal(classifyCiMode('pull_request', ['README.md', 'docs/agents/current/example.md']).mode, 'docs');
});

test('CircleCI docs-mode halts terminate the current shell successfully', () => {
  const haltAndExitPairs = circleCiConfig.match(/circleci-agent step halt\n\s+exit 0/g) ?? [];
  assert.equal(haltAndExitPairs.length, 2);
});

test('documentation contract disables Git paging before inherited output', () => {
  const root = mkdtempSync(join(tmpdir(), 'basemodel-docs-contract-'));
  try {
    const bin = join(root, 'bin');
    const gitLog = join(root, 'git.log');
    const fakeGit = join(bin, 'git');
    mkdirSync(bin);
    writeFileSync(
      fakeGit,
      [
        '#!/usr/bin/env node',
        "const { appendFileSync } = require('node:fs');",
        'const args = process.argv.slice(2);',
        "appendFileSync(process.env.FAKE_GIT_LOG, JSON.stringify(args) + '\\n');",
        "if (args[0] !== '--no-pager') process.exit(91);",
        'const command = args.slice(1);',
        "if (command[0] === 'diff' && command[1] === '--name-only') process.stdout.write('README.md\\n');",
        '',
      ].join('\n'),
    );
    chmodSync(fakeGit, 0o755);
    writeFileSync(join(root, 'README.md'), '# docs fixture\n');

    const output = execFileSync(process.execPath, [docsContractPath], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        CI_BASE_SHA: 'base',
        CI_HEAD_SHA: 'head',
        FAKE_GIT_LOG: gitLog,
        PATH: `${bin}${delimiter}${process.env.PATH ?? ''}`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    assert.match(output, /\[docs-contract\] PASS files=1/);
    const invocations = readFileSync(gitLog, 'utf8')
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line));
    assert.equal(invocations.length, 4);
    assert.ok(invocations.every((args) => args[0] === '--no-pager'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('CI and workflow files fail closed to full', () => {
  assert.equal(classifyCiMode('pull_request', ['.github/workflows/self-hosted-ci.yml']).mode, 'full');
  assert.equal(classifyCiMode('pull_request', ['.github/README.md']).mode, 'full');
});

test('code, tests, data, and mixed diffs require full validation', () => {
  for (const files of [
    ['src/pages/index.astro'],
    ['tests/e2e/ui-safety.spec.ts'],
    ['src/content/models/example.json'],
    ['README.md', 'scripts/ci-ui-gate.mjs'],
  ]) {
    assert.equal(classifyCiMode('pull_request', files).mode, 'full');
  }
});

test('empty PR diff fails closed', () => {
  assert.equal(classifyCiMode('pull_request', []).mode, 'full');
});

test('main push and manual dispatch are always full', () => {
  assert.equal(classifyCiMode('push', ['README.md']).mode, 'full');
  assert.equal(classifyCiMode('workflow_dispatch', ['README.md']).mode, 'full');
});

test('unknown events fail closed', () => {
  assert.equal(classifyCiMode('schedule', ['README.md']).mode, 'full');
});
