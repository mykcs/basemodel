import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { reviewedPrivacyProofs } from './typography-ledger-continuation.mjs';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { verifyAppendOnlyArticleTypography, verifyReviewedUiAndArticleTypography, verifySealedProofWithEditorialAnonymization, verifyReviewedSourceContinuation, reviewedReaderGuideTypography, reviewedFlowDisclosureTypography, reviewedSharedTypographyRows, reviewedHomeDeadTypographyRetirement, reviewedHomeScopedLinkFocusContinuation, verifyReviewedHomeDeadTypographyRetirement } from './typography-ledger-continuation.mjs';

test('privacy continuations accept only exact reviewed source pairs', () => {
  assert.equal(Object.keys(reviewedPrivacyProofs).length, 4);
  for (const [file, pair] of Object.entries(reviewedPrivacyProofs)) {
    const bytes = readFileSync(new URL(`../../${file}`, import.meta.url));
    const proof = { file, sha256: pair.before };
    assert.deepEqual(verifySealedProofWithEditorialAnonymization(proof, bytes), { editorialPrivacyOnly: true });
    assert.throws(() => verifySealedProofWithEditorialAnonymization(proof, Buffer.concat([bytes, Buffer.from(' ')])));
    assert.throws(() => verifySealedProofWithEditorialAnonymization({ ...proof, sha256: '0'.repeat(64) }, bytes));
  }
});

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

test('one reviewed reader guide adds only its exact semantic typography declarations', () => {
  const reviewed = reviewedSharedTypographyRows(reviewedReaderGuideTypography);
  assert.equal(reviewed.length, 8);
  assert.deepEqual(verifyAppendOnlyArticleTypography([baseline], [baseline, ...reviewed], reviewed), {
    newTokenDeclarations: 8, newFiles: [reviewedReaderGuideTypography.file],
  });
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, ...reviewed.slice(1)], reviewed), /missing from current source/);
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, ...reviewed, { ...reviewed[0], value: '12px' }], reviewed), /outside page-local Astro/);
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, ...reviewed, { ...reviewed[0], file: 'src/styles/app.css' }], reviewed), /outside page-local Astro/);
});

test('Flow native disclosure permits only two exact token-backed summary declarations', () => {
  const approved = reviewedSharedTypographyRows(reviewedFlowDisclosureTypography);
  assert.equal(approved.length, 2);
  const source = readFileSync(new URL('../../src/components/research/SeedOpenEvoResearchHub.astro', import.meta.url), 'utf8');
  assert.match(source, /<details class="flow-learning-disclosure">/);
  assert.match(source, /font-size:\s*var\(--type-body-small\);\s*font-weight:\s*var\(--type-weight-label\)/);
  assert.deepEqual(verifyAppendOnlyArticleTypography([baseline], [baseline, ...approved], approved), {
    newTokenDeclarations: 2, newFiles: [reviewedFlowDisclosureTypography.file],
  });
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, approved[0]], approved), /missing from current source/);
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, ...approved, { ...approved[0], value: '11px' }], approved), /outside page-local Astro/);
  assert.throws(() => verifyAppendOnlyArticleTypography([baseline], [baseline, ...approved, { ...approved[0], selector: '.unrelated-summary' }], approved), /outside page-local Astro/);
});

test('later hero layout review keeps the original approved source SHA as evidence', () => {
  const file = 'src/components/research/SeedOpenEvoMissionHero.astro';
  const bytes = readFileSync(new URL(`../../${file}`, import.meta.url));
  const currentSha = createHash('sha256').update(bytes).digest('hex');
  const prior = { currentSourceSha256: 'ed53ab3bc49083fc41ec3c4bee432ab20ee335be4d9a0f54adcdbc1f74e7c1e6' };
  const review = { [file]: { priorReviewedSourceSha256: prior.currentSourceSha256, currentSourceSha256: currentSha, reason: 'Exact later reader-path layout review' } };
  assert.deepEqual(verifyReviewedSourceContinuation(file, bytes, prior, review), { subsequentReview: true });
  assert.throws(() => verifyReviewedSourceContinuation(file, Buffer.concat([bytes, Buffer.from(' ')]), prior, review), /differs from its exact subsequent review/);
  assert.throws(() => verifyReviewedSourceContinuation(file, bytes, prior, { [file]: { ...review[file], priorReviewedSourceSha256: '0'.repeat(64) } }), /preserve the original approved SHA/);
});

test('Results first-screen height review preserves historical proof and rejects unreviewed changes', () => {
  const file = 'src/components/research/OpenEvoWebShopResultsHero.astro';
  const bytes = readFileSync(new URL(`../../${file}`, import.meta.url));
  const prior = { currentSourceSha256: 'cd5b2feb3d4aef5591990c66e3c6377f4688111289e4c1bc370e1e6a1bd2621b' };
  const currentSha = createHash('sha256').update(bytes).digest('hex');
  // The original 1edf01e6 source identity is retained in the reviewed ledger;
  // #1011 adds a route-local native-anchor scroll correction, not a new typography scale.
  assert.equal(currentSha, 'f528f47299f2dc95c6c73c63a860174fea79be594938a75ed7f250e79d6a0043');
  const source = bytes.toString('utf8');
  assert.match(source, /\.results-first-screen\s*\{\s*min-height:\s*0\s*\}/);
  assert.match(source, /统计范围也仍然包含“没有差异”/);
  assert.match(source, /class="progress-detail"/);
  assert.match(source, /:global\(html:has\(\.results-hero \.paper-nav\)\)\s*\{\s*scroll-behavior:\s*auto;?\s*\}/);
  assert.deepEqual(verifyReviewedSourceContinuation(file, bytes, prior), { subsequentReview: true });
  assert.throws(() => verifyReviewedSourceContinuation(file, Buffer.concat([bytes, Buffer.from(' ')]), prior), /differs from its exact subsequent review/);
  assert.throws(() => verifyReviewedSourceContinuation(file, bytes, { currentSourceSha256: '0'.repeat(64) }), /preserve the original approved SHA/);
});


test('Flow accessible landmark continuation preserves the original reviewed source and rejects silent drift', () => {
  const file = 'src/components/research/SeedOpenEvoResearchHub.astro';
  const bytes = readFileSync(new URL(`../../${file}`, import.meta.url));
  const source = bytes.toString('utf8');
  const prior = { currentSourceSha256: 'ab1a3ca61ee15c7d0b2195bf873381a5866760715a8f0628c628f3409a39edbc' };
  assert.match(source, /id="site-map" aria-labelledby="site-map-title"/);
  assert.match(source, /id="evidence" aria-labelledby="evidence-title"/);
  assert.match(source, /<h2 id="site-map-title">/);
  assert.match(source, /<h2 id="evidence-title">/);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '942f5836f687c07fbc78f74ee02b1419b725ca9ce7aed7058e64cf1fb8e59f57');
  assert.deepEqual(verifyReviewedSourceContinuation(file, bytes, prior), { subsequentReview: true });
  assert.throws(() => verifyReviewedSourceContinuation(file, Buffer.concat([bytes, Buffer.from(' ')]), prior), /differs from its exact subsequent review/);
  assert.throws(() => verifyReviewedSourceContinuation(file, bytes, { currentSourceSha256: '0'.repeat(64) }), /preserve the original approved SHA/);
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


test('dead Home-scoped typography has an eight-tuple exact-source retirement receipt', () => {
  const review = reviewedHomeDeadTypographyRetirement;
  const bytes = readFileSync(new URL('../../src/pages/_bodies/home-v2.astro', import.meta.url));
  const text = bytes.toString('utf8');
  const blob = createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex');
  assert.equal(blob, reviewedHomeScopedLinkFocusContinuation.currentBlobSha, 'follow-up Home source must match the exact reviewed Git blob');
  assert.equal(reviewedHomeScopedLinkFocusContinuation.priorBlobSha, review.currentBlobSha, 'the old retirement receipt must remain pinned');
  assert.equal(review.retired.length, 8);
  const rows = review.retired.map(({ selector, contexts = [], property, value }) =>
    ({ file: review.file, selector, contexts, property, value }));
  const result = verifyReviewedHomeDeadTypographyRetirement(rows, [], text);
  assert.deepEqual(result, { retainedRows: [], retiredCount: 8, retiredOwner: review.file });
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows.slice(1), [], text), /once in sealed historical ledger/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [rows[0]], text), /unexpectedly remains/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [], text + ' '), /source changed beyond/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [], text, { ...review, currentBlobSha: '0'.repeat(40) }), /must start from the sealed/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [], text, review, { ...reviewedHomeScopedLinkFocusContinuation, currentBlobSha: '0'.repeat(40) }), /source changed beyond/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [], text, review, { ...reviewedHomeScopedLinkFocusContinuation, snippets: ['nonexistent focus rule'] }), /cue is absent/);
  assert.throws(() => verifyReviewedHomeDeadTypographyRetirement(rows, [], text, { ...review, absentClasses: ['home-research'] }), /remains a source consumer/);
  assert.throws(() => verifyAppendOnlyArticleTypography(rows, []), /disappeared or changed/);
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
