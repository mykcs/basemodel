import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  evidenceContractSchema, evidenceSnapshotSchema, validateEvidenceRegistry,
  publishedEvidence, evidenceNumber, formatEvidencePoint,
} from './researchEvidence';
import { RESEARCH_EVIDENCE, RESEARCH_EVIDENCE_CONTRACTS, frozenFinalView, getResearchEvidence } from '../data/researchEvidenceIndex';
import { verifyResearchEvidenceFiles } from '../../scripts/research-evidence-integrity';
import finalSource from '../../public/research/seed-openevo/evidence/bounded-effective-state-final-snapshot-20260918.json';
import trainingSource from '../../public/research/seed-openevo/evidence/bounded-beta-r200-round-series-20261001.json';

const clone = () => structuredClone(getResearchEvidence('bounded-final-task-score'));
const check = (value: unknown) => validateEvidenceRegistry([value], RESEARCH_EVIDENCE_CONTRACTS);
const root = path.resolve(import.meta.dirname, '../..');

describe('numeric research evidence contracts', () => {
  it('extends the existing evidence owner without replacing old links', () => {
    expect(validateEvidenceRegistry(RESEARCH_EVIDENCE, RESEARCH_EVIDENCE_CONTRACTS).snapshots).toHaveLength(7);
  });
  it.each(['duplicate-evidence', 'duplicate-contract'])('rejects %s', (kind) => {
    expect(() => validateEvidenceRegistry(
      kind === 'duplicate-evidence' ? [clone(), clone()] : [clone()],
      kind === 'duplicate-contract' ? [...RESEARCH_EVIDENCE_CONTRACTS, RESEARCH_EVIDENCE_CONTRACTS[0]!] : RESEARCH_EVIDENCE_CONTRACTS,
    )).toThrow(/Duplicate/);
  });
  it('requires the comparison contract', () => {
    const value = clone(); value.contractId = 'missing';
    expect(() => check(value)).toThrow(/Unknown comparison contract/);
  });
  it('refuses to relabel a training curve as final', () => {
    const value = structuredClone(getResearchEvidence('beta-r200-task-score'));
    value.evaluationRole = 'frozen_final';
    expect(() => check(value)).toThrow();
    value.axis = 'none'; value.points = [value.points[0]!]; value.points[0]!.position = null;
    expect(() => check(value)).toThrow(/Evaluation role mismatch/);
  });
  it('does not accept training loss as a final task result', () => {
    const value = clone(); value.metric = { id: 'trainingLoss', unit: 'loss', direction: 'lower' };
    expect(() => check(value)).toThrow(/Training loss/);
  });
  it.each(['unit', 'direction'] as const)('rejects metric %s drift', (key) => {
    const value = clone();
    if (key === 'unit') value.metric.unit = 'count'; else value.metric.direction = 'lower';
    expect(() => check(value)).toThrow(/drift/);
  });
  it.each(['main', 'abc', 'z'.repeat(40)])('requires an immutable revision: %s', (commit) => {
    const value = clone(); value.source.commit = commit;
    expect(() => check(value)).toThrow();
  });
  it('binds the evidence revision to its source digest', () => {
    const value = clone(); value.revision = '0'.repeat(64);
    expect(() => check(value)).toThrow(/source-byte revision/);
  });
  it.each(['../secret.json', '/absolute.json', 'safe/../secret.json', 'data%2Fsecret.json'])('rejects unsafe source path %s', (sourcePath) => {
    const value = clone(); value.source.path = sourcePath;
    expect(() => check(value)).toThrow();
  });
  it('keeps unknown populations null, and rejects fake zero denominators', () => {
    const contract = structuredClone(RESEARCH_EVIDENCE_CONTRACTS[1]!);
    expect(evidenceContractSchema.parse(contract).taskCount).toBeNull();
    contract.taskCount = 0;
    expect(evidenceContractSchema.safeParse(contract).success).toBe(false);
  });
  it('requires a digest and denominators for a frozen panel', () => {
    const contract = structuredClone(RESEARCH_EVIDENCE_CONTRACTS[0]!);
    contract.taskPanelId = 'same-panel'; contract.trialCount = null;
    expect(evidenceContractSchema.safeParse(contract).success).toBe(false);
  });
  it('keeps a measured zero distinct from a missing value', () => {
    const value = clone(); value.points[0]!.value = 0;
    expect(evidenceNumber(check(value).snapshots[0]!, value.points[0]!.series)).toBe(0);
    value.points[0]!.value = null; value.completeness = 'partial';
    expect(() => evidenceNumber(check(value).snapshots[0]!, value.points[0]!.series)).toThrow(/Missing/);
    expect(formatEvidencePoint(value.points[0]!)).toBe('未知');
  });
  it('does not call null data complete', () => {
    const value = clone(); value.points[0]!.value = null;
    expect(() => check(value)).toThrow(/missing values/);
  });
  it.each([Number.NaN, Infinity, -0.1, 1.01])('rejects invalid ratio %s', (number) => {
    const value = clone(); value.points[0]!.value = number;
    expect(() => check(value)).toThrow();
  });
  it('checks integer successes and the denominator', () => {
    const value = structuredClone(getResearchEvidence('bounded-final-exact-count'));
    value.points[0]!.value = 1.5; expect(() => check(value)).toThrow();
    value.points[0]!.value = 129; expect(() => check(value)).toThrow(/denominator/);
  });
  it('rejects duplicate point identities', () => {
    const value = clone(); value.points.push(value.points[0]!);
    expect(() => check(value)).toThrow(/Duplicate series/);
  });
  it('rejects unknown nested fields rather than publishing them', () => {
    expect(() => check({ ...clone(), debug: 'extra' })).toThrow();
    const value = clone();
    expect(() => check({ ...value, source: { ...value.source, credential: 'extra' } })).toThrow();
  });
  it.each(['http://localhost:8000/run', 'http://192.168.1.2/run', 'file:///private/run', 'https://example.org/?access_token=fixture', 'https://example.org/?nw=fixture'])('rejects private or ephemeral metadata %s', (reason) => {
    const value = clone(); value.publication.reason = reason;
    expect(() => check(value)).toThrow(/Private or temporary/);
  });
  it('does not publish unapproved values even through the raw registry', () => {
    const value = clone(); value.publication = { approved: false, approvedScope: null, basis: null, reason: 'Unapproved' };
    expect(() => check(value)).toThrow(/Unapproved evidence/);
  });
  it('requires an approval basis and scope', () => {
    const value = clone(); value.publication.basis = null;
    expect(() => check(value)).toThrow(/Approval/);
  });
  it('keeps the rank32 pending entry isolated without blocking existing final evidence', () => {
    expect(() => getResearchEvidence('rank32-continuation-pending')).toThrow(/blocked/);
    const pending = RESEARCH_EVIDENCE.find((item) => item.id === 'rank32-continuation-pending')!;
    expect(pending.points).toEqual([]);
    expect(pending.source.sha256).toBeNull();
    expect(pending.evaluationRole).toBe('development');
    expect(getResearchEvidence('bounded-final-task-score').completeness).toBe('complete');
  });
  it('does not fabricate higher precision from a rounded report', () => {
    const value = clone(); value.points[0]!.precision = 'reported'; value.points[0]!.reportedDecimals = 2;
    expect(() => check(value)).toThrow(/precision invents digits/);
    value.points[0]!.value = 0.61;
    const validated = check(value).snapshots[0]!;
    expect(formatEvidencePoint(validated.points[0]!, 8)).toBe('0.61');
    expect(formatEvidencePoint(validated.points[0]!, 8, 100)).toBe('61');
  });
  it('rejects invalid display precision and unknown ids', () => {
    expect(() => formatEvidencePoint(clone().points[0]!, -1)).toThrow();
    expect(() => publishedEvidence(RESEARCH_EVIDENCE, 'missing')).toThrow(/Unknown/);
  });
});

describe('real-source compatibility and local hash verification', () => {
  it('uses source values for all final summaries without changing precision', () => {
    const view = frozenFinalView();
    expect(view.directApply.score).toBe(finalSource.three_way_final.directapply.task_score * 100);
    expect(view.off.score).toBe(45.984865395021635);
    expect(view.on.score).toBe(20.769142316017317);
    expect([view.directApply.exactCount, view.off.exactCount, view.on.exactCount]).toEqual([50, 32, 10]);
    expect(view.panelDigest).toBe(finalSource.same_frozen_final_panel.selected_panel_digest);
  });
  it('preserves every training point and its round, not sampled or re-labeled data', () => {
    const snapshot = getResearchEvidence('beta-r200-task-score');
    expect(snapshot.points).toHaveLength(104);
    expect(snapshot.points.map((item) => item.position)).toEqual(Array.from({ length: 104 }, (_, i) => 96 + i));
    expect(snapshot.points.map((item) => item.value)).toEqual(trainingSource.rows.map((row) => row.task_score));
    expect(snapshot.evaluationRole).toBe('training');
    expect(snapshot.eventTime).toBeNull();
  });
  it('verifies the actual repository bytes and skips the quarantined absent source', () => {
    expect(verifyResearchEvidenceFiles(root, RESEARCH_EVIDENCE)).toEqual([]);
  });
  it('fails closed on changed bytes, missing files, conflicting digests and symlink escapes', () => {
    const temporary = mkdtempSync(path.join(tmpdir(), 'basemodel-evidence-test-'));
    try {
      const item = clone(); const local = path.join(temporary, item.source.path);
      mkdirSync(path.dirname(local), { recursive: true });
      expect(verifyResearchEvidenceFiles(temporary, [item])).toHaveLength(1);
      writeFileSync(local, readFileSync(path.join(root, item.source.path)));
      expect(verifyResearchEvidenceFiles(temporary, [item])).toEqual([]);
      writeFileSync(local, '{}');
      expect(verifyResearchEvidenceFiles(temporary, [item])[0]).toContain('SHA-256 mismatch');
      const different = clone(); different.source.sha256 = '0'.repeat(64); different.revision = different.source.sha256;
      expect(verifyResearchEvidenceFiles(temporary, [item, different]).join(' ')).toContain('conflicting source digests');
      const outside = path.join(temporary, 'outside.json'); writeFileSync(outside, '{}');
      rmSync(local); symlinkSync(outside, local);
      expect(verifyResearchEvidenceFiles(temporary, [item])[0]).toContain('escapes');
    } finally { rmSync(temporary, { recursive: true, force: true }); }
  });
  it('does not bless a remote or non-publication file as a local source', () => {
    const item = clone(); item.source.repository = 'example/other';
    expect(verifyResearchEvidenceFiles(root, [item])[0]).toContain('not a local publication artifact');
  });
  it('validates every emitted point against the schema', () => {
    for (const snapshot of RESEARCH_EVIDENCE) expect(evidenceSnapshotSchema.safeParse(snapshot).success).toBe(true);
  });
});
