import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import { SITE_READER_CONTRACTS, readerContractForRoute } from '../src/data/siteReaderContracts';

const root = process.cwd();
const pagesRoot = join(root, 'src/pages');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.astro') ? [path] : [];
  });
}

export function sourceRoutePattern(file: string): string | null {
  let rel = relative(pagesRoot, file).replaceAll('\\', '/');
  if (rel.startsWith('_bodies/')) return null;
  if (rel.startsWith('en/')) rel = rel.slice(3);
  if (rel === 'index.astro') return '/';
  if (rel.endsWith('/index.astro')) rel = rel.slice(0, -'index.astro'.length);
  else if (rel.endsWith('.astro')) rel = `${rel.slice(0, -'.astro'.length)}/`;
  return `/${rel}`.replaceAll('//', '/');
}

const sourceRoutes = [...new Set(walk(pagesRoot).map(sourceRoutePattern).filter((value): value is string => Boolean(value)))].sort();
const contractRoutes = SITE_READER_CONTRACTS.map((row) => row.sourceRoute).sort();
const failures: string[] = [];

for (const route of sourceRoutes) if (!contractRoutes.includes(route)) failures.push(`missing reader contract: ${route}`);
for (const route of contractRoutes) if (!sourceRoutes.includes(route)) failures.push(`stale reader contract without page source: ${route}`);

const ids = new Set<string>();
for (const contract of SITE_READER_CONTRACTS) {
  if (ids.has(contract.id)) failures.push(`duplicate reader contract id: ${contract.id}`);
  ids.add(contract.id);
  for (const [field, value] of Object.entries({
    audience: contract.audience,
    primaryTask: contract.primaryTask,
    firstViewportGoal: contract.firstViewportGoal,
    mustStayVisible: contract.mustStayVisible,
    nextStep: contract.nextStep,
    samplePath: contract.samplePath,
  })) {
    if (!value.trim()) failures.push(`${contract.id}: empty ${field}`);
    if (/\b(?:tbd|todo|placeholder)\b|待定|以后再说/i.test(value)) failures.push(`${contract.id}: placeholder ${field}: ${value}`);
  }
  const resolved = readerContractForRoute(contract.samplePath);
  if (resolved?.id !== contract.id) failures.push(`${contract.id}: samplePath ${contract.samplePath} resolves to ${resolved?.id ?? 'nothing'}`);
  const englishResolved = readerContractForRoute(`/en${contract.samplePath === '/' ? '/' : contract.samplePath}`);
  if (englishResolved?.id !== contract.id) failures.push(`${contract.id}: English sample path does not resolve to the same contract`);
  if (contract.redirectsTo && !readerContractForRoute(contract.redirectsTo)) failures.push(`${contract.id}: redirectsTo ${contract.redirectsTo} has no target reader contract`);
  if (contract.attentionMode === 'focus' && !contract.firstViewportGoal.trim()) failures.push(`${contract.id}: focus pages require a first-viewport goal`);
}

if (failures.length) {
  console.error(`Reader contract audit failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Reader contract audit PASS: ${SITE_READER_CONTRACTS.length} page-source contracts cover ${sourceRoutes.length} public page patterns.`);
