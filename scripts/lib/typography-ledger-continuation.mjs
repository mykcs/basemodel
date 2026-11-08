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

// The Flow study hub uses a single native disclosure as its first-screen
// navigation entry. The existing type tokens remain authoritative; only the
// named summary's two typography properties are reviewed here.
export const reviewedFlowDisclosureTypography = {
  file: 'src/components/research/SeedOpenEvoResearchHub.astro',
  reason: 'The four real method-comparison anchors remain available through one keyboard- and no-JS-accessible native disclosure without four competing first-screen actions.',
  selectors: {
    '.flow-learning-disclosure > summary': {
      role: 'Readable, secondary four-section navigation control',
      properties: {
        'font-size': 'var(--type-body-small)',
        'font-weight': 'var(--type-weight-label)',
      },
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
    currentSourceSha256: '3f349c7d458254d33cf1febf344aec839d5c5db1582928bea0b51238ebb69d11',
    reason: 'Exact-head 3ad8713 Chromium/WebKit browser logs verified that the shorter 62svh hero brought Current answer into 440x956 viewport (heading y818-848), but the formerly below-fold provenance summary became a third competing control alongside two CTAs at 390x844 and 1280x633, exceeding the existing two-target Reader Attention budget. The home hero now keeps one primary results link and its keyboard-native scientific provenance disclosure; the existing home Next section still contains the Flow learning route. No science text, compact Flow variant, global CSS token, attention budget or existing provenance is removed. The subsequent exact-head 18e76f12 Chromium screenshots at 440x956 / 1440x1000, both themes, proved the 62svh panel still left 233px/206px blank below the only CTA. Previous source SHA256 9e073580d8fdf6751d9495d3aab10c0303b64fe454b88c1e4be2d84ae1221476 is preserved here as the reviewed predecessor; the component now has natural min-height 0 and a browser guard against a new blank slide. The earlier Home geometry remains protected by its browser gate. 2026-11-06 copy clarification: the noncompact Home lead treats Qwen2.5-3B-Instruct as a controlled-comparison example, separates the measured 7B and 1.7B findings into different experiments, and makes clear that the complete method-to-method comparison remains unfinished. The compact Flow hero, measured results, anchors, scientific source links, all typography/CSS declarations and previous fingerprints are unchanged; current-head bilingual mobile/desktop browser acceptance is required.',
  },
  'src/components/research/OpenEvoWebShopResultsHero.astro': {
    priorReviewedSourceSha256: 'cd5b2feb3d4aef5591990c66e3c6377f4688111289e4c1bc370e1e6a1bd2621b',
    currentSourceSha256: '1edf01e67c127800f555751cddb6ac8808f910902dd2b81afd7a8f9349806877',
    reason: 'The Results hero previously imposed calc(100svh - 7rem) minimum height and left an empty visual gap after the matched 128+128 episode result and its explicit uncertainty boundary. The exact-head 61fa528 mobile/desktop light/dark screenshots showed that gap delaying the native full-progress disclosure. The earlier reduction to 60svh brought the native progress control into the viewport, but exact-head b5b2351 1440x1000 dark Chromium screenshot still showed roughly 250px of empty space between the bounded result and the progress disclosure. The page-local minimum is now 0: the section sizes naturally to its content, preserving the current conclusion, uncertainty, 128+128 denominators, disclosure, typography tokens, scientific comparability, and privacy boundary. A browser geometry regression now rejects an artificial gap; exact-head Chromium/WebKit plus 440x956 and 1440x1000 light/dark visual checks are still required.',
  },
  'src/components/research/SeedOpenEvoResearchHub.astro': {
    priorReviewedSourceSha256: 'ab1a3ca61ee15c7d0b2195bf873381a5866760715a8f0628c628f3409a39edbc',
    currentSourceSha256: '942f5836f687c07fbc78f74ee02b1419b725ca9ce7aed7058e64cf1fb8e59f57',
    reason: 'The method-comparison hub retains four bilingual anchors behind one keyboard-native disclosure without overloading the first viewport. Reviewed prior Flow source SHA256 3faab90e1c550f227668cb458f1e5ed99d98166f77696d026d935f60f3a3e895 remains explicitly recorded as its predecessor. The subsequent 2026-11-07 accessibility-only source edit adds aria-labelledby and unique H2 ids to the existing site-map and evidence sections, completing four explicitly named region landmarks without changing visible text, CSS declarations, research facts, navigation destinations, or Reader Attention budgets. The historical observation is not reused as proof of this changed source; require exact-head Chromium/WebKit, 440x956 and 1440x1000 bilingual light/dark keyboard and no-overflow verification, and still independently review rendered screenshots. The later 2026-11-07 Flow evidence-footer update links first to measured Results and unresolved questions, then to the optional pinned-model setup; previous reviewed source SHA256 65664bcc811355659a35a3848e54ec89b778bb70f7b196f170a57d75b501a931 remains recorded as its predecessor. This is a content-only reading-path continuation: the four named regions, first-screen disclosure, CSS/typography owners, scientific outcomes and model configuration are unchanged. The updated exact-source SHA was independently calculated by Public CI on PR #1003 head d5fce1eb; newly updated exact-head deterministic, Chromium/WebKit and privacy gates plus source-linked screenshots are mandatory before merge.',
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

/** 
 * 2026-11-08 page-local dead-selector retirement receipt.
 * The sealed 2026-10-22 ledger remains immutable: exactly five historical
 * typography tuples have been retired from an Astro-scoped stylesheet whose
 * four CSS classes have zero markup consumers. All other declarations remain
 * subject to the append-only ledger. Do not generalize to arbitrary deletions.
 * Previous and current Git blob identities are independently reviewable.
 */
export const reviewedHomeDeadTypographyRetirement = {
  file: 'src/pages/_bodies/home-v2.astro',
  priorBlobSha: '92527338b8d069a25dbe5dfd9b36ee3a4e50487c',
  currentBlobSha: '2db840ddc074b0c74451ba618cd74467094023d7',
  reason: 'Four retired Home journey/after class families are absent from this Astro component markup. Their scoped CSS cannot target markup owned by another Astro component. Retain the current-answer and next-step hierarchy, and require independent browser acceptance after removing dead declarations.',
  absentClasses: ['journey-list', 'journey-number', 'journey-open', 'home-section__after'],
  retired: [
    { selector: '.journey-number', property: 'font', value: 'var(--type-weight-medium) var(--type-meta)/var(--type-leading-heading) var(--font-interface)' },
    { selector: '.journey-list h3', property: 'font-size', value: 'var(--type-minor-heading)' },
    { selector: '.journey-list h3', property: 'line-height', value: 'var(--type-leading-heading)' },
    { selector: '.journey-list p', property: 'font-size', value: 'var(--type-body-small)' },
    { selector: '.journey-list p', property: 'line-height', value: 'var(--type-leading-body)' },
  ],
};

export function verifyReviewedHomeDeadTypographyRetirement(historicalRows, currentRows, pageSource, review = reviewedHomeDeadTypographyRetirement) {
  assert(review.file === 'src/pages/_bodies/home-v2.astro' && review.reason?.trim(), 'Home retirement requires its exact owner and reason');
  assert.match(review.priorBlobSha, /^[a-f0-9]{40}$/, 'Home retirement must retain the prior Git blob identity');
  const actualBlobSha = createHash('sha1').update(`blob ${Buffer.byteLength(pageSource, 'utf8')}\\0`).update(pageSource).digest('hex');
  assert.equal(actualBlobSha, review.currentBlobSha, 'Home dead-selector retirement source changed beyond its reviewed Git blob');
  for (const className of review.absentClasses) {
    assert(!pageSource.includes(className), `Retired Home class remains a source consumer: ${className}`);
  }
  const removed = new Set();
  for (const item of review.retired) {
    const row = { file: review.file, selector: item.selector, contexts: [], property: item.property, value: item.value };
    const key = identity(row);
    assert(!removed.has(key), 'Duplicate retirement tuple');
    assert.equal(historicalRows.filter(candidate => identity(candidate) === key).length, 1, 'Retired tuple must occur once in sealed historical ledger');
    assert.equal(currentRows.filter(candidate => identity(candidate) === key).length, 0, 'Retired tuple unexpectedly remains in current CSS');
    removed.add(key);
  }
  return {
    retainedRows: historicalRows.filter(row => !removed.has(identity(row))),
    retiredCount: removed.size,
    retiredOwner: review.file,
  };
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
