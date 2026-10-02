import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  browserAllocationForMode,
  resolveFullShardTotal,
} from '../scripts/ci-public-plan.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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
  assert.match(workflow, /name: public-browser-\$\{\{ matrix\.shard \}\}-of-\$\{\{ needs\.plan\.outputs\.browser_total \}\}[\s\S]*?needs: plan/);
  assert.match(workflow, /browser_total: \$\{\{ steps\.plan\.outputs\.browser_total \}\}/);
  assert.match(workflow, /shard: \$\{\{ fromJSON\(needs\.plan\.outputs\.shards_json\) \}\}/);
  assert.match(workflow, /CI_EXPECTED_UI_MODE: \$\{\{ needs\.plan\.outputs\.mode \}\}/);
  assert.match(workflow, /if \[ "\$BROWSER_TOTAL" = 0 \]; then/);
  assert.match(workflow, /test "\$BROWSER_RESULT" = skipped/);
});



test('workflow builds once, seals the artifact, and verifies it before browser acceptance', () => {
  const workflow = read('.github/workflows/public-pr-ci.yml');
  assert.equal((workflow.match(/run: npm run build/g) ?? []).length, 2);
  assert.match(workflow, /Build static artifact when browser acceptance is skipped[\s\S]*?if: steps\.deterministic_plan\.outputs\.browser_total == '0'[\s\S]*?run: npm run build/);
  assert.match(workflow, /name: public-static-build[\s\S]*?if: needs\.plan\.result == 'success' && needs\.plan\.outputs\.browser_total != '0'/);
  assert.match(workflow, /name: public-static-build/);
  assert.match(workflow, /node scripts\/ci-build-artifact\.mjs create/);
  assert.match(workflow, /actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a/);
  assert.match(workflow, /actions\/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c/);
  assert.match(workflow, /node scripts\/ci-build-artifact\.mjs verify/);
  assert.match(workflow, /CI_BROWSER_BUILD: '0'/);
  assert.match(workflow, /STATIC_BUILD_RESULT: \$\{\{ needs\.static_build\.result \}\}/);
  assert.match(workflow, /test "\$STATIC_BUILD_RESULT" = success/);
});

test('workflow binds exact event base without fetching every branch history', () => {
  const workflow = read('.github/workflows/public-pr-ci.yml');
  assert.equal((workflow.match(/fetch-depth: 1/g) ?? []).length, 4);
  assert.equal((workflow.match(/git fetch --no-tags --depth=1 origin "\$CI_BASE_SHA"/g) ?? []).length, 4);
});
