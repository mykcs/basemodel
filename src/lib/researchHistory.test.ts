import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { normalizeResearchHistory, type HistoryImportInput } from './researchHistory';
import { HISTORY_SOURCES } from '../../scripts/research/history-sources';
import { historyScientificSha256, importHistorySource, writeHistoryArtifact } from '../../scripts/research/import-history';

function fixture(): HistoryImportInput {
  const source = { repository: 'example/synthetic-fixtures', commit: 'a'.repeat(40), path: 'fixtures/history.json', sha256: 'b'.repeat(64) };
  const { sha256, ...basis } = source;
  return {
    schema: 'basemodel.history-import.v1', lineageId: 'synthetic-fixture', source, observedSha256: sha256,
    capturedAt: '2026-10-02', frozen: true, retrieval: 'complete-export', pageKind: 'export-page',
    publication: { approved: true, approvedScope: 'explicit-release', basis, reason: 'Synthetic software fixture, not experimental evidence.' },
    contract: { id: 'synthetic-training', evaluationRole: 'training', taskPanelId: null, taskCount: null, trialCount: null, independentUnit: 'round', comparison: 'none', fixed: ['synthetic'], varied: ['step'], scientificRefs: [], boundary: 'Software behavior test only.' },
    aggregation: 'per-round-mean', axis: 'round', axisKey: '_step',
    fields: [
      { key: 'score', series: 'fixture', metricId: 'taskScore', sourceUnit: 'ratio' },
      { key: 'train/loss', series: 'fixture', metricId: 'trainingLoss', sourceUnit: 'loss' },
    ],
    segments: [{ id: 'base', runId: 'fixture-run-a', parentId: null, stepOffset: 0, firstStep: 0, lastStep: 2, stepStride: 1, expectedPages: 2, expectedRows: 3 }],
    pages: [
      { segmentId: 'base', runId: 'fixture-run-a', ordinal: 0, rows: [{ step: 0, eventTime: null, values: { score: 0.2, 'train/loss': 1 } }] },
      { segmentId: 'base', runId: 'fixture-run-a', ordinal: 1, rows: [
        { step: 1, eventTime: null, values: { score: 0.4, 'train/loss': 0.8 } },
        { step: 2, eventTime: null, values: { score: 0.5, 'train/loss': 0.7 } },
      ] },
    ],
  };
}
const values = (input: HistoryImportInput, metric: string) => normalizeResearchHistory(input).snapshots.find((item) => item.metric.id === metric)!.points.map((point) => point.value);
function resumeFixture() {
  const input = fixture();
  input.segments.push({ id: 'resume', runId: 'fixture-run-b', parentId: 'base', stepOffset: 2, firstStep: 0, lastStep: 1, stepStride: 1, expectedPages: 1, expectedRows: 2 });
  input.pages.push({ segmentId: 'resume', runId: 'fixture-run-b', ordinal: 0, rows: [
    { step: 0, eventTime: null, values: { score: 0.5, 'train/loss': 0.7 } },
    { step: 1, eventTime: null, values: { score: 0.6, 'train/loss': 0.6 } },
  ] });
  return input;
}

describe('frozen scalar history normalization', () => {
  it('normalizes a complete history without modifying its input', () => {
    const input = fixture(), before = structuredClone(input);
    expect(values(input, 'taskScore')).toEqual([0.2, 0.4, 0.5]);
    expect(input).toEqual(before);
    expect(normalizeResearchHistory(input).receipt.sourceRows).toBe(3);
  });
  it('unions asynchronously logged metric streams instead of taking an intersection', () => {
    const input = fixture();
    delete input.pages[0]!.rows[0]!.values['train/loss'];
    input.pages[1]!.rows.unshift({ step: 0, eventTime: null, values: { 'train/loss': 1 } });
    input.segments[0]!.expectedRows += 1;
    expect(values(input, 'taskScore')).toEqual([0.2, 0.4, 0.5]);
    expect(values(input, 'trainingLoss')).toEqual([1, 0.8, 0.7]);
  });
  it('preserves absent and explicit-null metrics as null, and preserves zero', () => {
    const input = fixture();
    delete input.pages[1]!.rows[0]!.values['train/loss'];
    input.pages[1]!.rows[1]!.values['train/loss'] = null;
    input.pages[1]!.rows[0]!.values.score = 0;
    expect(values(input, 'trainingLoss')).toEqual([1, null, null]);
    expect(values(input, 'taskScore')).toEqual([0.2, 0, 0.5]);
    expect(normalizeResearchHistory(input).snapshots.find((item) => item.metric.id === 'trainingLoss')!.completeness).toBe('partial');
  });
  it('marks an entirely absent step as missing instead of connecting across it', () => {
    const input = fixture(); input.pages[1]!.rows.shift(); input.segments[0]!.expectedRows -= 1;
    expect(values(input, 'taskScore')).toEqual([0.2, null, 0.5]);
  });
  it('deduplicates equal repeated observations and retains both source origins', () => {
    const input = fixture(); input.pages[1]!.rows.push(structuredClone(input.pages[1]!.rows[0]!)); input.segments[0]!.expectedRows += 1;
    const result = normalizeResearchHistory(input);
    expect(result.receipt.duplicateObservations).toBe(2);
    expect(result.receipt.observations.find((item) => item.identity === 'score:1')!.origins).toHaveLength(2);
    expect(values(input, 'taskScore')).toHaveLength(3);
  });
  it('does not apply last-write-wins to conflicting values', () => {
    const input = fixture(); input.pages[1]!.rows.push({ step: 1, eventTime: null, values: { score: 0.9 } }); input.segments[0]!.expectedRows += 1;
    expect(() => normalizeResearchHistory(input)).toThrow(/Conflicting/);
  });
  it('joins an explicitly related resumed run with reset source steps', () => {
    const input = resumeFixture();
    expect(values(input, 'taskScore')).toEqual([0.2, 0.4, 0.5, 0.6]);
    const result = normalizeResearchHistory(input);
    expect(result.receipt.duplicateObservations).toBe(2);
    expect(result.receipt.observations.find((item) => item.identity === 'score:2')!.origins.map((item) => [item.runId, item.sourceStep])).toEqual([['fixture-run-a', 2], ['fixture-run-b', 0]]);
  });
  it('refuses unrelated runs with overlapping step numbers', () => {
    const input = resumeFixture(); input.segments[1]!.parentId = null;
    expect(() => normalizeResearchHistory(input)).toThrow(/Unrelated/);
  });
  it('refuses a page from the wrong run', () => {
    const input = fixture(); input.pages[0]!.runId = 'another-run';
    expect(() => normalizeResearchHistory(input)).toThrow(/run identity mismatch/);
  });
  it.each(['missing-page', 'duplicate-page', 'missing-row'] as const)('fails closed on %s', (kind) => {
    const input = fixture();
    if (kind === 'missing-page') input.pages.pop();
    if (kind === 'duplicate-page') input.pages[1]!.ordinal = 0;
    if (kind === 'missing-row') input.pages[1]!.rows.pop();
    expect(() => normalizeResearchHistory(input)).toThrow(/Incomplete/);
  });
  it('does not lose an unknown segment outside the declared lineage', () => {
    const input = fixture(); input.pages.push({ segmentId: 'alien', runId: null, ordinal: 0, rows: [] });
    expect(() => normalizeResearchHistory(input)).toThrow(/Unknown page segment/);
  });
  it('refuses sampled exports and active mutable sources', () => {
    expect(() => normalizeResearchHistory({ ...fixture(), retrieval: 'sampled-history' })).toThrow();
    expect(() => normalizeResearchHistory({ ...fixture(), frozen: false })).toThrow();
  });
  it('checks source digests before creating evidence', () => {
    expect(() => normalizeResearchHistory({ ...fixture(), observedSha256: '0'.repeat(64) })).toThrow(/SHA-256 mismatch/);
  });
  it('requires explicit publication approval', () => {
    const input = fixture(); input.publication = { approved: false, approvedScope: null, basis: null, reason: 'Not approved' };
    expect(() => normalizeResearchHistory(input)).toThrow(/not approved/);
  });
  it('does not let history create final-panel evidence', () => {
    const input = fixture(); input.contract.evaluationRole = 'frozen_final'; input.contract.taskPanelId = 'f'.repeat(64); input.contract.taskCount = 128; input.contract.trialCount = 128;
    expect(() => normalizeResearchHistory(input)).toThrow(/cannot create a frozen final/);
  });
  it('only converts an explicitly declared score-100 unit', () => {
    const input = fixture(); input.fields[0]!.sourceUnit = 'score-100';
    for (const page of input.pages) for (const row of page.rows) row.values.score = row.values.score! * 100;
    expect(values(input, 'taskScore')).toEqual([0.2, 0.4, 0.5]);
    input.fields[0]!.sourceUnit = 'loss';
    expect(() => normalizeResearchHistory(input)).toThrow(/unit conversion/);
  });
  it('rejects unapproved fields rather than silently dropping them', () => {
    const input = fixture(); input.pages[0]!.rows[0]!.values.unapproved = 0.1;
    expect(() => normalizeResearchHistory(input)).toThrow(/Unapproved history field/);
  });
  it.each(['api_key', 'token', 'password', 'hostname'])('rejects credential-like field %s', (key) => {
    expect(() => normalizeResearchHistory({ ...fixture(), [key]: 'synthetic-value' })).toThrow(/Credential-like/);
  });
  it('bounds invalid or oversized step ranges', () => {
    const input = fixture(); input.segments[0]!.lastStep = 100_000_000;
    expect(() => normalizeResearchHistory(input)).toThrow(/point budget/);
    input.segments[0]!.firstStep = 4; input.segments[0]!.lastStep = 1;
    expect(() => normalizeResearchHistory(input)).toThrow(/segment range/);
  });
  it('keeps content hashes stable across capture clocks and transport page ordering', () => {
    const first = fixture(), second = fixture(); second.capturedAt = '2026-10-03'; second.pages.reverse();
    expect(historyScientificSha256(normalizeResearchHistory(first))).toBe(historyScientificSha256(normalizeResearchHistory(second)));
  });
  it('keeps actual observation times in provenance rather than replacing them with import time', () => {
    const input = fixture(); input.pages[0]!.rows[0]!.eventTime = '2026-09-30T10:00:00Z';
    const result = normalizeResearchHistory(input);
    expect(result.receipt.observations[0]!.origins[0]!.eventTime).toBe('2026-09-30T10:00:00Z');
    expect(historyScientificSha256(result)).not.toBe(historyScientificSha256(normalizeResearchHistory(fixture())));
  });
});

describe('real approved projections and resumable local output', () => {
  it('qualifies the real continuation, partial loss and windowed sources without writes', () => {
    const beta = importHistorySource('beta-r200');
    expect(beta.saved).toBeNull(); expect(beta.result.receipt.pageKind).toBe('local-partition'); expect(beta.result.receipt.sourceRows).toBe(104);
    expect(beta.result.receipt.segments.map((segment) => segment.rows)).toEqual([64, 40]);
    expect(beta.result.receipt.segments.every((segment) => segment.runId === null)).toBe(true);
    expect(beta.result.snapshots.find((item) => item.metric.id === 'exactSuccessCount')!.aggregation).toBe('count');
    const loss = importHistorySource('threeway-loss');
    expect(loss.result.receipt.fields.map((field) => field.missing)).toEqual([1, 2, 6]);
    expect(loss.result.snapshots[0]!.axis).toBe('cumulative-rollout');
    expect(loss.result.snapshots[0]!.points).toHaveLength(480);
    const window = importHistorySource('threeway-window-score');
    expect(window.result.receipt.sourceRows).toBe(8);
    expect(window.result.snapshots[0]!.aggregation).toBe('reported-scalar');
    expect(window.result.snapshots[0]!.points).toHaveLength(24);
    expect(importHistorySource('threeway-loss').scientificSha256).toBe(loss.scientificSha256);
  });
  it('treats a missing or changed source as an error, and dry-run creates no report directory', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'basemodel-history-test-'));
    try {
      const source = HISTORY_SOURCES['beta-r200'];
      const local = path.join(root, source.path);
      fs.mkdirSync(path.dirname(local), { recursive: true });
      expect(() => importHistorySource('beta-r200', { root })).toThrow();
      fs.writeFileSync(local, fs.readFileSync(path.resolve(import.meta.dirname, '../..', source.path)));
      expect(importHistorySource('beta-r200', { root }).saved).toBeNull();
      expect(fs.existsSync(path.join(root, 'reports'))).toBe(false);
      fs.appendFileSync(local, '\n');
      expect(() => importHistorySource('beta-r200', { root })).toThrow(/SHA-256 mismatch/);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
  it('does not reinterpret permission denial as empty successful history', () => {
    const read = vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => { throw new Error('EACCES: synthetic permission denial'); });
    try { expect(() => importHistorySource('beta-r200')).toThrow(/EACCES/); }
    finally { read.mockRestore(); }
  });
  it('rejects a well-formed but altered cached scientific value without replacing it', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'basemodel-history-test-'));
    try {
      const result = normalizeResearchHistory(fixture()), saved = writeHistoryArtifact(root, result);
      const envelope = JSON.parse(fs.readFileSync(saved.target, 'utf8'));
      envelope.result.snapshots[0].points[0].value = 0.9;
      fs.writeFileSync(saved.target, JSON.stringify(envelope));
      expect(() => writeHistoryArtifact(root, result)).toThrow(/content mismatch/);
      expect(JSON.parse(fs.readFileSync(saved.target, 'utf8')).result.snapshots[0].points[0].value).toBe(0.9);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
  it('never expands the source allowlist from a caller-supplied filename', () => {
    expect(() => importHistorySource('other' as 'beta-r200')).toThrow(/approved history list/);
  });
  it('writes atomically, reuses identical output, and rejects a corrupted existing receipt', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'basemodel-history-test-'));
    try {
      const result = normalizeResearchHistory(fixture());
      const first = writeHistoryArtifact(root, result); const before = fs.readFileSync(first.target, 'utf8');
      expect(first.reused).toBe(false);
      expect(writeHistoryArtifact(root, result).reused).toBe(true);
      expect(fs.readFileSync(first.target, 'utf8')).toBe(before);
      expect(fs.readdirSync(path.dirname(first.target))).toEqual([path.basename(first.target)]);
      fs.writeFileSync(first.target, '{}');
      expect(() => writeHistoryArtifact(root, result)).toThrow();
      expect(fs.readFileSync(first.target, 'utf8')).toBe('{}');
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
  it('does not leave a complete-looking file after an interrupted atomic commit', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'basemodel-history-test-'));
    const link = vi.spyOn(fs, 'linkSync').mockImplementation(() => { throw new Error('simulated interruption'); });
    try {
      expect(() => writeHistoryArtifact(root, normalizeResearchHistory(fixture()))).toThrow(/interruption/);
      expect(fs.readdirSync(path.join(root, 'reports/research-history'))).toEqual([]);
    } finally { link.mockRestore(); fs.rmSync(root, { recursive: true, force: true }); }
  });
  it('rejects a symlink masquerading as an already-written content-addressed report', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'basemodel-history-test-'));
    try {
      const result = normalizeResearchHistory(fixture());
      const saved = writeHistoryArtifact(root, result), outside = path.join(root, 'outside.json');
      fs.writeFileSync(outside, fs.readFileSync(saved.target)); fs.unlinkSync(saved.target); fs.symlinkSync(outside, saved.target);
      expect(() => writeHistoryArtifact(root, result)).toThrow();
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
});
