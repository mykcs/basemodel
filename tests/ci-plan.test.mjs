import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCiMode } from '../scripts/ci-plan.mjs';

test('pure Markdown documentation PR uses docs mode', () => {
  assert.equal(classifyCiMode('pull_request', ['README.md', 'docs/agents/current/example.md']).mode, 'docs');
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
