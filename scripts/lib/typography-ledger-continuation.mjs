import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const identity = row => JSON.stringify([row.file, row.selector, row.contexts, row.property, row.value]);

// New shared typography needs a reviewed, exact-selector continuation.
// This is deliberately narrower than the page-local token-only allowance:
// the reader guide is the single reusable owner of these eight declarations.
export const reviewedReaderGuideTypography = {
  file: 'src/components/navigation/PageLearningPath.astro',
  reason: 'Short, bilingual, keyboard-accessible research reading paths need readable token-owned labels and anchors; no new global typography tokens or CSS owner.',
  selectors: {
    '.page-learning-path__heading': {
      role: 'Secondary learning-path label',
      properties: {
        'font-size': 'var(--type-meta)',
        'line-height': 'var(--type-leading-caption)',
        'font-weight': 'var(--type-weight-label)',
      },
    },
    '.page-learning-path a': {
      role: 'Readable primary anchor text with a 44px minimum touch row',
      properties: {
        'font-size': 'var(--type-body-small)',
        'line-height': 'var(--type-leading-body)',
        'font-weight': 'var(--type-weight-label)',
      },
    },
    '.page-learning-path__index': {
      role: 'Small monospaced section number',
      properties: {
        font: 'var(--type-weight-label) var(--type-meta)/var(--type-leading-caption) var(--font-mono)',
      },
    },
    '.page-learning-path__go': {
      role: 'Secondary directional glyph',
      properties: { 'font-size': 'var(--type-meta)' },
    },
  },
};

export function reviewedSharedTypographyRows(review) {
  assert(review.file?.trim() && review.reason?.trim(), 'Shared typography needs an identified owner and reason');
  return Object.entries(review.selectors).flatMap(([selector, entry]) => {
    assert(entry.role?.trim(), `Shared typography selector needs a semantic role: ${selector}`);
    return Object.entries(entry.properties).map(([property, value]) => ({
      file: review.file, selector, contexts: [], property, value,
    }));
  });
}

// A historical Intelligence UI owner was already source-pinned by a prior
// review. Keep that earlier exact SHA intact; a subsequent content/layout
// edit has its own source identity and browser-acceptance boundary.
export const reviewedSourceContinuations = {
  'src/components/research/SeedOpenEvoMissionHero.astro': {
    priorReviewedSourceSha256: 'ed53ab3bc49083fc41ec3c4bee432ab20ee335be4d9a0f54adcdbc1f74e7c1e6',
    currentSourceSha256: '5c2f706a951fda4a7e0790e7542657b2c860b7e7aef855e9f43e29f3635bdc69',
    reason: 'The same home research question and two-choice budget remain, but first-fold vertical alignment and headline measure changed after the 2026-10-09 reading-path review. Historical screenshot geometry is no longer current; exact-head 440px/1440px browser acceptance is still required.',
  },
};

export function verifyReviewedSourceContinuation(file, bytes, priorReview, continuations = reviewedSourceContinuations) {
  const actual = digest(bytes);
  if (actual === priorReview.currentSourceSha256) return { subsequentReview: false };
  const review = continuations[file];
  assert(review?.reason?.trim(), `Changed historical owner needs a separate review: ${file}`);
  assert.equal(review.priorReviewedSourceSha256, priorReview.currentSourceSha256,
    `Subsequent review must preserve the original approved SHA: ${file}`);
  assert.equal(actual, review.currentSourceSha256,
    `Changed historical owner differs from its exact subsequent review: ${file}`);
  return { subsequentReview: true };
}

/**
 * The 2026-10-22 ledger is a historical, completely classified snapshot.
 * Its existing declarations must remain accounted for; future article pages may
 * add ONLY semantic-token declarations in page-local Astro styles. New shared
 * components require an explicit exact-selector review (never a blanket path
 * exception). Any removal, global CSS change, or literal type size still
 * requires an explicit new ledger.
 * This continuation does not claim the new route was historically observed.
 */
export function verifyAppendOnlyArticleTypography(baselineRows, currentRows, approvedSharedRows = []) {
  const remaining = new Map();
  for (const row of baselineRows) {
    const key = identity(row);
    remaining.set(key, (remaining.get(key) ?? 0) + 1);
  }

  const added = [];
  for (const row of currentRows) {
    const key = identity(row);
    const count = remaining.get(key) ?? 0;
    if (count > 0) remaining.set(key, count - 1);
    else added.push(row);
  }

  const missing = [...remaining].filter(([, count]) => count > 0);
  assert.equal(missing.length, 0, `Previously classified typography declarations disappeared or changed: ${missing.slice(0, 5).map(([key]) => key).join('; ')}`);

  const approved = new Map(approvedSharedRows.map(row => [identity(row), row]));
  assert.equal(approved.size, approvedSharedRows.length, 'Shared typography review contains duplicate declarations');
  const used = new Set();
  for (const row of added) {
    if (/^src\/pages\/.*\.astro$/.test(row.file)) {
      assert.match(row.value, /^var\(--type-[\w-]+\)$/, `New typography declaration must use a semantic type token: ${row.file} ${row.selector} ${row.property}: ${row.value}`);
      continue;
    }
    const key = identity(row);
    assert(approved.has(key), `New typography declaration requires a new classification outside page-local Astro: ${row.file} ${row.selector} ${row.property}`);
    used.add(key);
  }
  assert.equal(used.size, approved.size, 'Reviewed shared typography declaration missing from current source');
  return { newTokenDeclarations: added.length, newFiles: [...new Set(added.map(row => row.file))] };
}

/**
 * Compose the independently reviewed two-stage UI replacement with later
 * page-local token additions. The sealed historical rows are never rewritten:
 * only the specifically enumerated UI removals/replacements may differ, and
 * all other new typography must satisfy the additive article-token rule.
 */
export function verifyReviewedUiAndArticleTypography(historicalRows, currentRows, review, approvedSharedRows = []) {
  assert(review.removedReason?.trim(), 'Reviewed typography removals need a reason');
  const toRows = (groups, requireRoles) => Object.entries(groups).flatMap(([selector, entry]) => {
    if (requireRoles) assert(entry.role?.trim(), `New selector needs an explicit semantic role: ${selector}`);
    const properties = entry.properties ?? entry;
    assert(Object.keys(properties).length > 0, `Reviewed selector has no declarations: ${selector}`);
    return Object.entries(properties).map(([property, value]) => ({
      file: review.owner, selector, contexts: [], property, value,
    }));
  });
  const removed = toRows(review.removed, false);
  const added = toRows(review.added, true);
  const toRemove = new Map();
  for (const row of removed) {
    const key = identity(row);
    toRemove.set(key, (toRemove.get(key) ?? 0) + 1);
  }
  const retained = historicalRows.filter(row => {
    const key = identity(row);
    const count = toRemove.get(key) ?? 0;
    if (count === 0) return true;
    toRemove.set(key, count - 1);
    return false;
  });
  assert.deepEqual([...toRemove].filter(([, count]) => count !== 0), [], 'Reviewed UI removal is absent from the sealed historical ledger');
  const appendOnly = verifyAppendOnlyArticleTypography([...retained, ...added], currentRows, approvedSharedRows);
  assert.equal(currentRows.length, historicalRows.length - removed.length + added.length + appendOnly.newTokenDeclarations,
    'Every current declaration must be accounted for by the two reviewed changes');
  return { reviewedRemoved: removed.length, reviewedAdded: added.length, appendOnly };
}

// A closed set of already-reviewed editorial anonymizations can preserve a
// sealed owner/consumer proof without rewriting its historical receipt.
// Every other byte must still match that original proof exactly.
const aliasOnlyProofOwners = new Set([
  'src/components/research/OpenEvoExperimentIndex.astro',
  'src/components/research/OpenEvoQ17FrontierRoadmap.astro',
]);
const legacyRole = String.fromCodePoint(0x5b66, 0x957f);
const publicAlias = `L ${legacyRole}`;
const digest = content => createHash('sha256').update(content).digest('hex');

// Exact privacy-only source continuation; historical proof bytes and all 5,537
// declarations remain sealed. Only these reviewed source digest pairs are valid.
export const reviewedPrivacyProofs = {
  "src/components/research/OpenEvoQ17DirectApplyAnalysis.astro": {
    "before": "5367f3c8ebf07af4fbdc28681561f50f2fed676e19678aed471084361c2346aa",
    "after": "2273259e4f4f1e9aea56c6b8bbea738af2e27b9b217231e6d0fa82cefab9dfb7"
  },
  "src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro": {
    "before": "a9a9ab570f0c64f2133806b57aa31e2354dbb1dfc21d379511cd49152331234a",
    "after": "8f3dbf91e1feb870066772a1e863985e8a51c6d593b2e04a8de56d57519b7bd2"
  },
  "src/components/research/OpenEvo7BStage2AnalysisMap.astro": {
    "before": "a717b5f46dc606c800b9ada0bd6f3eedbf0b289df22326b28915e2623b179cca",
    "after": "d5bb89ebed8910d38b2e1696b83764b7801281db5067c241eeb9aafc0e36a690"
  },
  "src/components/research/SeedOpenEvoBriefingTechnicalNotes.astro": {
    "before": "c5cd004479c18968435423a7e0a9028da2edc2641d01a0d0cb37e23e2d154a2e",
    "after": "c41e0553c82b5fec3991b6bc5d0b63316f2787e7b45a7204e1c40848102fa7ae"
  }
};

export function verifySealedProofWithEditorialAnonymization(proof, currentBytes, contentReview) {
  if (digest(currentBytes) === proof.sha256) return { editorialAliasOnly: false };
  const privacy = reviewedPrivacyProofs[proof.file];
  if (privacy && proof.sha256 === privacy.before && digest(currentBytes) === privacy.after) return { editorialPrivacyOnly: true };
  if (contentReview) {
    assert.match(contentReview.currentSourceSha256, /^[a-f0-9]{64}$/, 'Content review needs an exact source identity');
    assert.match(contentReview.priorSourceSha256, /^[a-f0-9]{64}$/, 'Content review must retain its prior source identity');
    assert(contentReview.reason?.trim(), 'Content review needs its semantic reason');
    assert.equal(digest(currentBytes), contentReview.currentSourceSha256,
      `Content reorganization owner changed beyond the reviewed source: ${proof.file}`);
    return { editorialAliasOnly: false, historicalObservationInvalidated: true };
  }
  assert(aliasOnlyProofOwners.has(proof.file), `Sealed typography owner changed: ${proof.file}`);
  const text = currentBytes.toString('utf8');
  assert(text.includes(publicAlias), `No supported editorial anonymization in: ${proof.file}`);
  const priorSpelling = text.replaceAll(publicAlias, legacyRole);
  assert.equal(digest(priorSpelling), proof.sha256,
    `Typography owner changed beyond the exact permitted alias substitution: ${proof.file}`);
  return { editorialAliasOnly: true };
}
