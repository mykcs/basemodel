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
  assert.match(workflow, /needs: plan/);
  assert.match(workflow, /browser_total: \$\{\{ steps\.plan\.outputs\.browser_total \}\}/);
  assert.match(workflow, /shard: \$\{\{ fromJSON\(needs\.plan\.outputs\.shards_json\) \}\}/);
  assert.match(workflow, /CI_EXPECTED_UI_MODE: \$\{\{ needs\.plan\.outputs\.mode \}\}/);
  assert.match(workflow, /if \[ "\$BROWSER_TOTAL" = 0 \]; then/);
  assert.match(workflow, /test "\$BROWSER_RESULT" = skipped/);
});
