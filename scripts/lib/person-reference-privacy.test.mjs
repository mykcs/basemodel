import assert from 'node:assert/strict';
import test from 'node:test';
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
