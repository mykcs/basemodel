import assert from 'node:assert/strict';

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
