import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { verifyAppendOnlyArticleTypography, verifyReviewedUiAndArticleTypography, verifySealedProofWithEditorialAnonymization } from './typography-ledger-continuation.mjs';

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

test('reviewed UI replacement and later page-local semantic tokens reconcile against one sealed ledger', () => {
  const old = { file: 'src/components/research/Example.astro', selector: '.old', contexts: [], property: 'font-size', value: 'var(--type-meta)' };
  const replacement = { ...old, selector: '.new', value: 'var(--type-body-small)' };
  const review = {
    owner: old.file,
    removed: { '.old': { 'font-size': old.value } },
    added: { '.new': { role: 'Readable replacement', properties: { 'font-size': replacement.value } } },
    removedReason: 'The former component was replaced',
  };
  const combined = [baseline, replacement, newArticle];
  assert.deepEqual(verifyReviewedUiAndArticleTypography([baseline, old], combined, review), {
    reviewedRemoved: 1,
    reviewedAdded: 1,
    appendOnly: { newTokenDeclarations: 1, newFiles: [newArticle.file] },
  });
  assert.throws(() => verifyReviewedUiAndArticleTypography([baseline, old], [baseline, newArticle], review), /disappeared or changed/);
  assert.throws(() => verifyReviewedUiAndArticleTypography([baseline, old], [...combined, { ...newArticle, file: 'src/styles/app.css' }], review), /outside page-local Astro/);
  assert.throws(() => verifyReviewedUiAndArticleTypography([baseline, old], [...combined, { ...newArticle, value: '12px' }], review), /semantic type token/);
  assert.throws(() => verifyReviewedUiAndArticleTypography([baseline], combined, review), /removal is absent/);
});

test('exact editorial alias substitutions preserve sealed source owner proofs', () => {
  const role = String.fromCodePoint(0x5b66, 0x957f);
  const before = `const title = '${role}';`;
  const after = `const title = 'L ${role}';`;
  const sha256 = createHash('sha256').update(before).digest('hex');
  const proof = { file: 'src/components/research/OpenEvoExperimentIndex.astro', sha256 };
  assert.deepEqual(verifySealedProofWithEditorialAnonymization(proof, Buffer.from(before)), { editorialAliasOnly: false });
  assert.deepEqual(verifySealedProofWithEditorialAnonymization(proof, Buffer.from(after)), { editorialAliasOnly: true });
  assert.throws(() => verifySealedProofWithEditorialAnonymization(proof, Buffer.from(after + '/* font-size: 4px */')), /beyond the exact/);
  assert.throws(() => verifySealedProofWithEditorialAnonymization({ ...proof, file: 'src/styles/tokens.css' }, Buffer.from(after)), /Sealed typography owner changed/);
});

test('reviewed content changes invalidate observations and remain pinned to exact bytes', () => {
  const before = Buffer.from('<p>Old directory</p>');
  const after = Buffer.from('<p>Canonical directory</p>');
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  const proof = { file: 'src/components/research/OpenEvoExperimentIndex.astro', sha256: hash(before) };
  const review = { priorSourceSha256: hash(before), currentSourceSha256: hash(after), reason: 'Remove duplicate entries; retain all typography declarations' };
  assert.deepEqual(verifySealedProofWithEditorialAnonymization(proof, after, review),
    { editorialAliasOnly: false, historicalObservationInvalidated: true });
  assert.throws(() => verifySealedProofWithEditorialAnonymization(proof, Buffer.from('unreviewed change'), review), /beyond the reviewed source/);
  assert.throws(() => verifySealedProofWithEditorialAnonymization(proof, after, { ...review, reason: '' }), /semantic reason/);
  assert.throws(() => verifySealedProofWithEditorialAnonymization(proof, after), /No supported editorial anonymization/);
});
