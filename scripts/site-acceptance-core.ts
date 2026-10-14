import type { SiteReaderContract } from '../src/data/siteReaderContracts';

/** Only maps ownership. Having an owner is never a reading or UI PASS. */
export function acceptanceOwners(contract: SiteReaderContract): string[] {
  const id = contract.id;
  if (id === 'home' || id === 'study') return ['B01', 'X806'];
  if (id === 'flow-sd-lora' || id === 'capability-vanilla-sd-lora') return ['C03', 'X806'];
  if (id === 'study-run' || id === 'capability-archive') return ['B03', 'X806'];
  if (id === 'capability-bounded-effective-state-gdr') return ['B02', 'C02', 'X805', 'X812'];
  if (/^(models-index|model-detail|families|compare|papers-index|paper-detail|workspace)$/.test(id)) return ['X783', 'X806'];
  if (id === 'landscape') return ['A02', 'X806'];
  if (/^(study-results|result-|capability-|study-briefing|minimax-teacher)/.test(id)) return ['B02', 'X805', 'X806'];
  if (/^flow(?:-|$)/.test(id)) return ['C03', 'X806'];
  if (/^(guide|guide-today)$/.test(id)) return ['B03', 'X806'];
  if (/^(not-found|development|methodology|data-status|lab|study-design)$/.test(id)) return ['A02', 'X806'];
  return [];
}

export function endpointOwners(source: string): string[] {
  if (/^src\/pages\/research\/seed-openevo\/exports\/(?:rank32-capacity|same-panel-final)\.(?:csv|tex)\.ts$/.test(source)) return ['C01'];
  if (/^src\/pages\/(?:model-data\/(?:\[id\]|catalog)\.json|landscape\/models\.json|search-index\.json)\.ts$/.test(source)) return ['A02'];
  if (/^src\/pages\/(?:robots\.txt|sitemap\.xml)\.ts$/.test(source)) return ['X806'];
  return [];
}

export type EmittedFile = { file: string; pathname: string; sha256: string; bytes: number };
export type ResolvedPage = { source: string; pattern: string; type: string; regex: RegExp };
export type CoverageRow = EmittedFile & {
  kind: 'document' | 'redirect' | 'endpoint';
  source: string; contractId: string | null; owners: string[]; redirectTo: string | null;
};

export function routeForFile(file: string): string {
  if (file.startsWith('/') || file.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('Output must be a relative canonical file path');
  }
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -10)}`;
  if (file.endsWith('.html')) return `/${file.slice(0, -5)}/`;
  return `/${file}`;
}

export function buildRouteCoverage(
  files: readonly EmittedFile[], routes: readonly ResolvedPage[],
  contracts: readonly SiteReaderContract[], resolve: (pathname: string) => SiteReaderContract | undefined,
  generatedPages: readonly string[],
) {
  const errors: string[] = [];
  const rows: CoverageRow[] = [];
  const seen = new Set<string>();
  const represented = new Set<string>();
  const expected = new Set(generatedPages.map((route) => route.startsWith('/') ? route : `/${route}`));
  if (!files.length || !generatedPages.length || !routes.length) errors.push('Empty build inventory');
  const declaredIds = new Set<string>();
  for (const contract of contracts) {
    if (declaredIds.has(contract.id)) errors.push(`Duplicate reader contract: ${contract.id}`);
    declaredIds.add(contract.id);
    if (!acceptanceOwners(contract).length) errors.push(`No work-packet owner: ${contract.id}`);
  }
  for (const file of files) {
    if (seen.has(file.pathname)) errors.push(`Duplicate output route: ${file.pathname}`);
    seen.add(file.pathname);
    const owner = routes.find((route) => {
      route.regex.lastIndex = 0;
      return route.regex.test(file.pathname);
    });
    if (!owner) { errors.push(`No resolved source: ${file.pathname}`); continue; }
    if (owner.type === 'endpoint') {
      const owners = endpointOwners(owner.source);
      if (!owners.length) errors.push(`Unclassified endpoint: ${owner.source}`);
      rows.push({ ...file, kind: 'endpoint', source: owner.source, owners, contractId: null, redirectTo: null });
      continue;
    }
    const contract = resolve(file.pathname);
    if (!contract || !declaredIds.has(contract.id)) {
      errors.push(`No reader contract: ${file.pathname}`); continue;
    }
    represented.add(contract.id);
    const redirectTo = contract.redirectsTo ?? null;
    const kind = redirectTo || owner.type === 'redirect' ? 'redirect' : 'document';
    rows.push({ ...file, source: owner.source, kind, contractId: contract.id, owners: acceptanceOwners(contract), redirectTo });
  }
  for (const contract of contracts) {
    if (!represented.has(contract.id)) errors.push(`Reader family produced no HTML: ${contract.id}`);
    if (!seen.has(contract.samplePath)) errors.push(`Reader sample not emitted: ${contract.samplePath}`);
    if (contract.redirectsTo && !seen.has(contract.redirectsTo)) errors.push(`Redirect target not emitted: ${contract.redirectsTo}`);
  }
  for (const pathname of expected) if (!seen.has(pathname)) errors.push(`Generated route has no output: ${pathname}`);
  for (const row of rows) {
    if (row.kind !== 'endpoint' && !expected.has(row.pathname)) errors.push(`HTML not in generated pages: ${row.pathname}`);
  }
  for (const route of routes.filter((row) => row.type === 'endpoint')) {
    if (!rows.some((row) => row.source === route.source)) errors.push(`Endpoint produced no output: ${route.source}`);
  }
  return {
    errors,
    counts: {
      documents: rows.filter((row) => row.kind === 'document').length,
      redirects: rows.filter((row) => row.kind === 'redirect').length,
      endpoints: rows.filter((row) => row.kind === 'endpoint').length,
      readerFamilies: represented.size,
    },
    rows,
    acceptance: {
      routeOwnership: errors.length ? 'fail' : 'pass',
      renderedUi: 'not-assessed',
      humanComprehension: 'reader_evaluation_pending',
      ownerApproval: 'not-assessed',
      production: 'not-assessed',
    },
  };
}

/** Astro's assets map supplies exact emitted files, including dynamic endpoints. */
export function verifyDeclaredRouteOutputs(declared: readonly string[], observed: readonly string[]): string[] {
  if (!declared.length) return ['Empty compiler output declaration'];
  const errors: string[] = [];
  const expected = new Set(declared), actual = new Set(observed);
  for (const file of expected) if (!actual.has(file)) errors.push(`Compiler-declared output is missing: ${file}`);
  for (const file of actual) if (!expected.has(file)) errors.push(`Output not declared by compiler: ${file}`);
  return errors;
}
