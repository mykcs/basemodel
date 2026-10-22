import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { z } from 'zod';
import { SITE_READER_CONTRACTS, readerContractForRoute } from '../src/data/siteReaderContracts';
import { acceptanceOwners, endpointOwners } from './site-acceptance-core';
import { outputManifestDigest, materialInputIdentity, verifyOutputManifest } from './site-acceptance-files';

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const file = z.strictObject({ file: z.string(), pathname: z.string(), sha256: hash, bytes: z.number().int().nonnegative() });
const counts = z.strictObject({ documents: z.number().int().nonnegative(), redirects: z.number().int().nonnegative(), endpoints: z.number().int().nonnegative(), readerFamilies: z.number().int().positive() });
export const coverageReceiptSchema = z.strictObject({
  schema: z.literal('basemodel.site-coverage.v1'),
  materialInputs: z.strictObject({ sha256: hash, files: z.number().int().positive(), scope: z.string() }),
  internalRuntimeOnly: z.array(z.string()),
  sourceInventory: z.strictObject({ liveSourceFiles: z.number().int(), publicPageSources: z.number().int(), bodyFragments: z.array(z.string()), endpointSources: z.array(z.string()), archivedEnglishPageSources: z.number().int(), archivedSourcesAreLiveRoutes: z.literal(false) }),
  sourceHead: z.string().regex(/^[a-f0-9]{40}$/).nullable(), buildTreeClean: z.boolean(),
  emittedManifestSha256: hash, manifest: z.array(file).min(1),
  errors: z.array(z.string()).length(0), counts,
  rows: z.array(file.extend({ kind: z.enum(['document', 'redirect', 'endpoint']), source: z.string(), contractId: z.string().nullable(), owners: z.array(z.string()).min(1), redirectTo: z.string().nullable() })).min(1),
  acceptance: z.strictObject({
    routeOwnership: z.literal('pass'), renderedUi: z.literal('not-assessed'),
    humanComprehension: z.literal('reader_evaluation_pending'), ownerApproval: z.literal('not-assessed'), production: z.literal('not-assessed'),
  }),
  scope: z.string(),
});

export function checkCoverageReceipt(root: string) {
  const report = coverageReceiptSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'reports/site-acceptance/coverage.json'), 'utf8')));
  const errors: string[] = [];
  if (report.sourceHead !== null) {
    const currentHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (currentHead !== report.sourceHead) errors.push('Candidate HEAD changed; rebuild before claiming current coverage');
  }
  if (report.materialInputs.sha256 !== materialInputIdentity(root).sha256) errors.push('Material inputs changed; rebuild before claiming current coverage');
  if (report.emittedManifestSha256 !== outputManifestDigest(report.manifest)) errors.push('Output manifest digest mismatch');
  errors.push(...verifyOutputManifest(path.join(root, 'dist'), report.manifest));
  const manifest = new Map(report.manifest.map((entry) => [entry.file, entry]));
  for (const row of report.rows) {
    const entry = manifest.get(row.file);
    if (!entry || entry.sha256 !== row.sha256 || entry.bytes !== row.bytes || entry.pathname !== row.pathname) errors.push(`Row is not bound to output: ${row.file}`);
  }
  for (const row of report.rows) {
    const contract = row.kind === 'endpoint' ? undefined : readerContractForRoute(row.pathname);
    const owners = row.kind === 'endpoint' ? endpointOwners(row.source) : contract ? acceptanceOwners(contract) : [];
    if (JSON.stringify(owners) !== JSON.stringify(row.owners) || (contract?.id ?? null) !== row.contractId) errors.push(`Ownership drift: ${row.pathname}`);
    if ((contract?.redirectsTo ?? null) !== row.redirectTo) errors.push(`Redirect drift: ${row.pathname}`);
  }
  for (const contract of SITE_READER_CONTRACTS) if (!report.rows.some((row) => row.contractId === contract.id)) errors.push(`Missing reader family: ${contract.id}`);
  if (report.counts.readerFamilies !== SITE_READER_CONTRACTS.length) errors.push('Reader family count mismatch');
  if (new Set(report.rows.map((row) => row.pathname)).size !== report.rows.length) errors.push('Duplicate coverage row');
  for (const [key, kind] of [['documents', 'document'], ['redirects', 'redirect'], ['endpoints', 'endpoint']] as const) {
    if (report.counts[key] !== report.rows.filter((row) => row.kind === kind).length) errors.push(`Count mismatch: ${key}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { sourceHead: report.sourceHead, buildTreeClean: report.buildTreeClean, materialInputs: report.materialInputs, counts: report.counts, acceptance: report.acceptance };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.length > 2) throw new Error('Run from the candidate checkout; no external path argument is accepted');
    console.log(JSON.stringify(checkCoverageReceipt(process.cwd()), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Site coverage receipt check failed');
    process.exitCode = 1;
  }
}
