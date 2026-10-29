import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const identity = row => JSON.stringify([row.file, row.selector, row.contexts, row.property, row.value]);

/**
 * The 2026-10-22 ledger is a historical, completely classified snapshot.
 * Its existing declarations must remain accounted for; future article pages may
 * add ONLY semantic-token declarations in page-local Astro styles. Any removal,
 * global CSS change, or literal type size still requires an explicit new ledger.
 * This continuation does not claim the new route was historically observed.
 */
export function verifyAppendOnlyArticleTypography(baselineRows, currentRows) {
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

  for (const row of added) {
    assert.match(row.file, /^src\/pages\/.*\.astro$/, `New typography declaration requires a new classification outside page-local Astro: ${row.file}`);
    assert.match(row.value, /^var\(--type-[\w-]+\)$/, `New typography declaration must use a semantic type token: ${row.file} ${row.selector} ${row.property}: ${row.value}`);
  }
  return { newTokenDeclarations: added.length, newFiles: [...new Set(added.map(row => row.file))] };
}

/**
 * Compose the independently reviewed two-stage UI replacement with later
 * page-local token additions. The sealed historical rows are never rewritten:
 * only the specifically enumerated UI removals/replacements may differ, and
 * all other new typography must satisfy the additive article-token rule.
 */
export function verifyReviewedUiAndArticleTypography(historicalRows, currentRows, review) {
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
  const appendOnly = verifyAppendOnlyArticleTypography([...retained, ...added], currentRows);
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

export function verifySealedProofWithEditorialAnonymization(proof, currentBytes) {
  if (digest(currentBytes) === proof.sha256) return { editorialAliasOnly: false };
  assert(aliasOnlyProofOwners.has(proof.file), `Sealed typography owner changed: ${proof.file}`);
  const text = currentBytes.toString('utf8');
  assert(text.includes(publicAlias), `No supported editorial anonymization in: ${proof.file}`);
  const priorSpelling = text.replaceAll(publicAlias, legacyRole);
  assert.equal(digest(priorSpelling), proof.sha256,
    `Typography owner changed beyond the exact permitted alias substitution: ${proof.file}`);
  return { editorialAliasOnly: true };
}
