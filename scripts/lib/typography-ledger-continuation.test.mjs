import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyAppendOnlyArticleTypography } from './typography-ledger-continuation.mjs';

const baseline = { file: 'src/styles/old.css', selector: '.reader', contexts: [], property: 'font-size', value: 'var(--type-body)' };
const newArticle = { file: 'src/pages/research/new/index.astro', selector: '.question', contexts: [], property: 'font-size', value: 'var(--type-meta)' };

test('unchanged historical declarations remain valid', () => {
  assert.deepEqual(verifyAppendOnlyArticleTypography([baseline], [baseline]), { newTokenDeclarations: 0, newFiles: [] });
});
test('token-backed declarations may be added only in a new article route', () => {
  assert.deepEqual(verifyAppendOnlyArticleTypography([baseline], [baseline, newArticle]), {
    newTokenDeclarations: 1,
    newFiles: ['src/pages/research/new/index.astro'],
  });
});
test('historically classified declarations cannot silently disappear', () => {
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [newArticle]), /disappeared or changed/);
});
test('a new hardcoded type size is rejected', () => {
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, { ...newArticle, value: '12px' }]), /semantic type token/);
});
test('new global or shared typography requires explicit classification', () => {
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, { ...newArticle, file: 'src/styles/app.css' }]), /outside page-local Astro/);
});
