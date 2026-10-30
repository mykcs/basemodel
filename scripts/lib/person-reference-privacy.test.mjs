import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { hasAccountFingerprint, identityViews } from './person-reference-privacy.mjs';
import { SEALED_HISTORICAL_SNAPSHOTS, scanPersonReferences } from './person-reference-privacy.mjs';

const senior = String.fromCodePoint(0x5b66, 0x957f);
const knownIdentity = String.fromCodePoint(0x9b4f, 0x8001, 0x5e08);

test('accepts the only two permitted interpersonal aliases', () => {
  assert.deepEqual(scanPersonReferences('src/any.astro', `W 老师 / L ${senior}`), []);
});

test('rejects unqualified senior references and personal names', () => {
  const violations = scanPersonReferences('docs/research.md', `${senior}提出问题。${knownIdentity}评价。`);
  assert.deepEqual(violations.map((x) => x.kind), ['direct-identity', 'unqualified-senior']);
});

test('detects escaped personal names and bad alias formatting', () => {
  const escaped = Array.from(knownIdentity).map((c) => `\\u${c.codePointAt(0).toString(16).padStart(4, '0')}`).join('');
  assert.deepEqual(scanPersonReferences('src/pages/summary.astro', escaped).map((x) => x.kind), ['encoded-identity']);
  assert.deepEqual(scanPersonReferences('src/pages/summary.astro', `W${String.fromCodePoint(0x8001, 0x5e08)}`).map((x) => x.kind), ['advisor-alias-spacing']);
});

test('sealed typography evidence preserves former role text, never direct identity', () => {
  assert.equal(SEALED_HISTORICAL_SNAPSHOTS.size, 3);
  for (const path of SEALED_HISTORICAL_SNAPSHOTS) {
    assert.deepEqual(scanPersonReferences(path, senior), []);
    assert.deepEqual(scanPersonReferences(path, knownIdentity).map((x) => x.kind), ['direct-identity']);
  }
});

test('public observability locators are replaced with anonymous source IDs', () => {
  for (const path of ['src/pages/example.astro', 'public/research/receipt.json']) {
    assert.deepEqual(scanPersonReferences(path, 'https://wandb.ai/example-account/project/runs/run-1').map(x => x.kind), ['provider-account-locator']);
    assert.deepEqual(scanPersonReferences(path, 'wandb:example-account/project/run-1').map(x => x.kind), ['provider-account-locator']);
    assert.deepEqual(scanPersonReferences(path, '/research/seed-openevo/evidence/source-index.json#wb-001'), []);
  }
});

test('account fingerprints cover JSON, HTML and percent-encoded presentation', () => {
  const sample = 'exampleperson';
  const digest = createHash('sha256').update(sample).digest('hex');
  for (const value of [sample.toUpperCase(), [...sample].map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''), [...sample].map(c => `&#${c.charCodeAt(0)};`).join(''), [...sample].map(c => `%${c.charCodeAt(0).toString(16)}`).join('')]) {
    assert(identityViews(`width: 50%; ${value}`).some(view => hasAccountFingerprint(view, sample.length, digest)));
  }
  assert(!identityViews('safe role').some(view => hasAccountFingerprint(view, sample.length, digest)));
});
