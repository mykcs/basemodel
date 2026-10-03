import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { SITE_READER_CONTRACTS, readerContractForRoute } from '../data/siteReaderContracts';
import { acceptanceOwners, buildRouteCoverage, verifyDeclaredRouteOutputs, endpointOwners, routeForFile, type EmittedFile, type ResolvedPage } from '../../scripts/site-acceptance-core';
import { digest, outputManifestDigest, emittedFile, fileInventory, verifyOutputManifest } from '../../scripts/site-acceptance-files';
import { evaluateReadingTrials, type ReadingTrial } from '../../scripts/site-reader-evaluation';
import { coverageReceiptSchema } from '../../scripts/audit-site-acceptance';

const home = SITE_READER_CONTRACTS.find((row) => row.id === 'home')!;
const file = (name: string): EmittedFile => ({ file: name, pathname: routeForFile(name), bytes: 1, sha256: 'a'.repeat(64) });
const rootRoute: ResolvedPage = { source: 'src/pages/index.astro', pattern: '/', type: 'page', regex: /^\/$/ };
const testCoverage = (files = [file('index.html')], pages = ['/'], routes = [rootRoute]) => buildRouteCoverage(files, routes, [home], readerContractForRoute, pages);

describe('generated-site coverage, not source-file counting', () => {
  it('separates route ownership from reading, UI and production acceptance', () => {
    const result = testCoverage();
    expect(result.errors).toEqual([]);
    expect(result.counts).toEqual({ documents: 1, redirects: 0, endpoints: 0, readerFamilies: 1 });
    expect(result.acceptance.humanComprehension).toBe('reader_evaluation_pending');
    expect(result.acceptance.renderedUi).toBe('not-assessed');
    expect(result.acceptance.production).toBe('not-assessed');
  });
  it('maps every current reader contract to existing work packets', () => {
    for (const contract of SITE_READER_CONTRACTS) expect(acceptanceOwners(contract).length).toBeGreaterThan(0);
    expect(acceptanceOwners({ ...home, id: 'unregistered-family' })).toEqual([]);
  });
  it.each(['empty', 'duplicate', 'unknown', 'missing', 'phantom'] as const)('rejects %s output coverage', (caseId) => {
    const result = caseId === 'empty' ? testCoverage([], [])
      : caseId === 'duplicate' ? testCoverage([file('index.html'), file('index.html')])
      : caseId === 'unknown' ? testCoverage([file('index.html'), file('orphan/index.html')])
      : caseId === 'missing' ? testCoverage([], ['/']) : testCoverage([file('index.html')], ['/phantom/']);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  it('detects one missing dynamic endpoint even when its family still has other files', () => {
    const declared = ['index.html', 'model-data/a.json', 'model-data/b.json'];
    expect(verifyDeclaredRouteOutputs(declared, declared)).toEqual([]);
    expect(verifyDeclaredRouteOutputs(declared, declared.slice(0, 2)).join()).toContain('model-data/b.json');
    expect(verifyDeclaredRouteOutputs([], []).length).toBeGreaterThan(0);
    expect(verifyDeclaredRouteOutputs(declared, [...declared, 'orphan.json']).join()).toContain('not declared');
  });
  it('counts emitted endpoint files separately from documents', () => {
    const endpoint: ResolvedPage = { source: 'src/pages/search-index.json.ts', pattern: '/search-index.json', type: 'endpoint', regex: /^\/search-index\.json$/ };
    const result = testCoverage([file('index.html'), file('search-index.json')], ['/'], [rootRoute, endpoint]);
    expect(result.errors).toEqual([]);
    expect(result.counts.endpoints).toBe(1);
    expect(result.rows.find((row) => row.kind === 'endpoint')?.contractId).toBeNull();
    expect(testCoverage([file('index.html')], ['/'], [rootRoute, endpoint]).errors.join()).toContain('Endpoint produced no output');
  });
  it('does not exempt arbitrary future APIs', () => {
    expect(endpointOwners('src/pages/new-private-api.ts')).toEqual([]);
    expect(endpointOwners('src/pages/research/seed-openevo/exports/same-panel-final.csv.ts')).toEqual(['C01']);
    const endpoint = { source: 'src/pages/new-private-api.ts', pattern: '/new', type: 'endpoint', regex: /^\/new$/ };
    expect(testCoverage([file('index.html'), file('new')], ['/'], [rootRoute, endpoint]).errors.join()).toContain('Unclassified endpoint');
  });
  it('does not use a redirect as an extra accepted research page', () => {
    const redirect = { ...home, id: 'study-design', sourceRoute: '/old/', samplePath: '/old/', redirectsTo: '/' };
    const result = buildRouteCoverage([file('index.html'), file('old/index.html')], [rootRoute, { ...rootRoute, regex: /^\/old\/$/ }], [home, redirect], (route) => route === '/' ? home : redirect, ['/', '/old/']);
    expect(result.errors).toEqual([]);
    expect(result.counts.redirects).toBe(1);
    redirect.redirectsTo = '/absent/';
    expect(buildRouteCoverage([file('old/index.html')], [{ ...rootRoute, regex: /^\/old\/$/ }], [redirect], () => redirect, ['/old/']).errors.join()).toContain('Redirect target not emitted');
  });
  it.each(['../secret.html', '/absolute', 'a/../b', 'a//b', './index.html'])('refuses non-canonical file %s', (name) => {
    expect(() => routeForFile(name)).toThrow();
  });
  it('keeps output digests stable across schema property ordering', () => {
    const entry = file('index.html');
    expect(outputManifestDigest([entry])).toBe(outputManifestDigest([{ bytes: entry.bytes, sha256: entry.sha256, file: entry.file, pathname: entry.pathname }]));
    expect(outputManifestDigest([entry])).not.toBe(outputManifestDigest([{ ...entry, bytes: entry.bytes + 1 }]));
  });
  it('normalizes index, nested index, special 404 and endpoint paths', () => {
    expect(['index.html', 'models/x/index.html', '404.html', 'sitemap.xml'].map(routeForFile)).toEqual(['/', '/models/x/', '/404/', '/sitemap.xml']);
  });
  it('refuses a malformed receipt that invents human or production acceptance', () => {
    expect(coverageReceiptSchema.safeParse({ acceptance: { humanComprehension: 'pass', production: 'pass' } }).success).toBe(false);
  });
  it('verifies exact outputs and detects edits, additions, deletion and links', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'q01-files-'));
    try {
      fs.writeFileSync(path.join(root, 'index.html'), '<h1>Fixture</h1>');
      const manifest = [emittedFile(root, 'index.html')];
      expect(verifyOutputManifest(root, manifest)).toEqual([]);
      fs.appendFileSync(path.join(root, 'index.html'), 'changed');
      expect(verifyOutputManifest(root, manifest).join()).toContain('changed');
      fs.writeFileSync(path.join(root, 'orphan.html'), 'new');
      expect(verifyOutputManifest(root, manifest).join()).toContain('Unrecorded');
      fs.unlinkSync(path.join(root, 'index.html'));
      expect(verifyOutputManifest(root, manifest).join()).toContain('Missing');
      fs.symlinkSync(path.join(root, 'orphan.html'), path.join(root, 'link.html'));
      expect(() => fileInventory(root)).toThrow(/Symlink/);
      expect(verifyOutputManifest(root, [])).toEqual(['Empty output manifest']);
      expect(digest('a')).not.toBe(digest('b'));
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
});

const identity = { baselineInput: 'b'.repeat(64), candidateInput: 'c'.repeat(64) };
const trial = (role: ReadingTrial['role'], index: number): ReadingTrial => {
  const answer = { response: 'Synthetic fixture, not a real reader answer.', correct: true };
  const response = { question: { ...answer }, result: { ...answer }, limitations: { ...answer }, nextStep: { ...answer }, evidence: { ...answer }, elapsedSeconds: 30, criticalMisread: { trainingAsFinal: false, differentPanelsAsPaired: false, unknownAsZero: false } };
  return structuredClone({ participantId: `reader-fixture-${index}`, reviewerKind: 'human', role, ...identity, order: index % 2 ? 'candidate-first' : 'baseline-first', resultRecord: 'docs/fixtures/synthetic.md', resultRecordSha256: 'd'.repeat(64), stewardVerified: true, baseline: response, candidate: response });
};
const threeRoles = () => [trial('new-reader', 0), trial('lab-colleague', 1), trial('returning-reader', 2)];

describe('human-required evidence stays human-required', () => {
  it('does not turn an empty list into a PASS', () => {
    expect(evaluateReadingTrials([], identity).status).toBe('reader_evaluation_pending');
  });
  it('does not let Agent trials fill any of the human roles', () => {
    const trials = threeRoles().map((row) => ({ ...row, reviewerKind: 'agent' as const }));
    const result = evaluateReadingTrials(trials, identity);
    expect(result.status).toBe('reader_evaluation_pending');
    expect(result.verifiedHumans).toBe(0);
    expect(result.agentTrials).toBe(3);
  });
  it('requires explicit provenance verification by the human-study facilitator', () => {
    const result = evaluateReadingTrials(threeRoles().map((row) => ({ ...row, stewardVerified: false })), identity);
    expect(result.verifiedHumans).toBe(0);
    expect(result.status).toBe('reader_evaluation_pending');
  });
  it('accepts a small balanced fixture without claiming significance or publication', () => {
    const result = evaluateReadingTrials(threeRoles(), identity);
    expect(result.status).toBe('small-sample-reading-complete');
    expect(result.provesStatisticalImprovement).toBe(false);
    expect(result.ownerApproval).toBe('not-assessed');
    expect(result.production).toBe('not-assessed');
  });
  it.each(['trainingAsFinal', 'differentPanelsAsPaired', 'unknownAsZero'] as const)('rejects critical misreading: %s', (misread) => {
    const trials = threeRoles(); trials[0]!.candidate.criticalMisread[misread] = true;
    expect(evaluateReadingTrials(trials, identity).status).toBe('comprehension-failed');
  });
  it('requires four correct answers, not a total test-count badge', () => {
    const trials = threeRoles(); trials[0]!.candidate.question.correct = false; trials[0]!.candidate.result.correct = false;
    expect(evaluateReadingTrials(trials, identity).status).toBe('comprehension-failed');
  });
  it('accepts exactly four correct answers when no critical boundary is misread', () => {
    const trials = threeRoles(); trials[0]!.candidate.nextStep.correct = false;
    expect(evaluateReadingTrials(trials, identity).status).toBe('small-sample-reading-complete');
  });
  it('keeps a missing role or unbalanced order pending', () => {
    expect(evaluateReadingTrials(threeRoles().slice(0, 2), identity).status).toBe('reader_evaluation_pending');
    expect(evaluateReadingTrials(threeRoles().map((row) => ({ ...row, order: 'baseline-first' })), identity).status).toBe('reader_evaluation_pending');
  });
  it('rejects duplicate people and receipts for another tree', () => {
    const trials = threeRoles();
    expect(() => evaluateReadingTrials([trials[0], trials[0]], identity)).toThrow(/Duplicate/);
    expect(() => evaluateReadingTrials(trials, { ...identity, candidateInput: 'e'.repeat(64) })).toThrow(/different candidate/);
    expect(() => evaluateReadingTrials([], { ...identity, candidateInput: identity.baselineInput })).toThrow(/must differ/);
  });
  it('does not accept blank answers, bad timing or invalid reviewer kinds', () => {
    const row = trial('new-reader', 0); row.candidate.question.response = '';
    expect(() => evaluateReadingTrials([row], identity)).toThrow();
    expect(() => evaluateReadingTrials([{ ...trial('new-reader', 0), reviewerKind: 'simulated-human' }], identity)).toThrow();
  });
});
