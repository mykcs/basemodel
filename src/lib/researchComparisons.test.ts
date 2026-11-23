import { describe, expect, it } from 'vitest';
import {
  assessComparison, comparisonIdentityKeys, finiteDifference, reportedInterval,
  requireRecomputablePairs, requireReportedAgreement, summarizeRoundWindows,
  type ComparisonArm, type ComparisonContract,
} from './researchComparisons';
import type { EvidencePoint } from './researchEvidence';

function fixture() {
  const identity = Object.fromEntries(comparisonIdentityKeys.map((key) => [key, `fixed-${key}`])) as ComparisonArm['identity'];
  const make = (id: string): ComparisonArm => ({ id, metricId: 'taskScore', unit: 'ratio', evaluationRole: 'validation', populationId: 'synthetic-panel', taskCount: 2, trialCount: 2, independentUnitCount: 2, identity: { ...identity, model: id } });
  const { model, ...heldFixed } = identity;
  void model;
  const contract: ComparisonContract = {
    id: 'synthetic-contrast', arms: ['a', 'b'], metricId: 'taskScore', unit: 'ratio', evaluationRole: 'validation',
    design: 'same-panel', heldFixed: heldFixed as Record<Exclude<typeof comparisonIdentityKeys[number], 'model'>, string>, treatmentVariables: ['model'],
    estimand: 'Synthetic paired mean difference', pairingKeys: ['task-id', 'trial-id'], independentUnit: 'task',
    exclusionRule: 'missing-stays-null-no-success-filter', aggregationRule: 'paired-unit-mean',
    analysisRole: 'exploratory', preregistrationRef: null, recipeRef: 'synthetic-only', rawPairsAvailable: true,
  };
  return { contract, arms: [make('a'), make('b')] };
}
const point = (position: number, value: number | null): EvidencePoint => ({ series: 'fixture', position, value, precision: 'source', reportedDecimals: null });

describe('comparison eligibility and independence', () => {
  it('permits model identity as an explicit treatment without granting a causal claim', () => {
    const { contract, arms } = fixture(), result = assessComparison(contract, arms);
    expect(result.disposition).toBe('eligible-paired'); expect(result.causalClaimAuthorized).toBe(false);
  });
  it.each([[32,64],[64,128],[32,128]])('blocks mixing %s and %s task panels', (left, right) => {
    const { contract, arms } = fixture(); arms[0]!.taskCount = left; arms[1]!.taskCount = right;
    expect(assessComparison(contract, arms).reasons).toContain('different-task-counts');
  });
  it('blocks different panels even with the same number of tasks', () => {
    const { contract, arms } = fixture(); arms[1]!.populationId = 'different-panel';
    expect(assessComparison(contract, arms).disposition).toBe('not-comparable');
  });
  it('blocks training vs frozen-final rather than multiplying units to make them comparable', () => {
    const { contract, arms } = fixture(); arms[0]!.evaluationRole = 'training'; arms[1]!.evaluationRole = 'frozen_final';
    expect(assessComparison(contract, arms).reasons).toEqual(expect.arrayContaining(['evaluation-role:a', 'evaluation-role:b']));
  });
  it('blocks metric/units mismatch and an invalid common unit declaration', () => {
    const { contract, arms } = fixture(); arms[1]!.unit = 'count';
    expect(assessComparison(contract, arms).disposition).toBe('not-comparable');
    contract.unit = 'count'; arms[0]!.unit = 'count';
    expect(assessComparison(contract, arms).reasons).toContain('invalid-metric-unit-contract');
  });
  it('returns descriptive-only with explicit reasons when identities are unknown', () => {
    const { contract, arms } = fixture(); arms[0]!.identity.harness = null; arms[0]!.taskCount = null;
    const result = assessComparison(contract, arms);
    expect(result.disposition).toBe('descriptive-only');
    expect(result.limitations).toContain('fixed-identity-unknown:harness:a');
    expect(result.limitations).toContain('unique-task-count-unknown');
  });
  it('does not silently treat different harnesses as a controlled comparison', () => {
    const { contract, arms } = fixture(); arms[1]!.identity.harness = 'changed';
    expect(assessComparison(contract, arms).reasons).toContain('fixed-identity-mismatch:harness:b');
    delete contract.heldFixed.harness;
    expect(assessComparison(contract, arms).reasons).toContain('uncontrolled-difference:harness');
  });
  it('rejects a variable simultaneously declared fixed and varied', () => {
    const { contract, arms } = fixture(); contract.treatmentVariables.push('harness');
    expect(() => assessComparison(contract, arms)).toThrow(/held fixed and varied/);
  });
  it('requires exact arm membership without duplicate identities', () => {
    const { contract, arms } = fixture();
    expect(() => assessComparison(contract, [arms[0], arms[0]])).toThrow(/membership/);
    contract.arms = ['a', 'a'];
    expect(() => assessComparison(contract, arms)).toThrow(/distinct arm/);
  });
  it('does not accept a retrospective label as preregistration', () => {
    const { contract, arms } = fixture(); contract.analysisRole = 'predeclared';
    expect(() => assessComparison(contract, arms)).toThrow(/preregistration/);
  });
  it('keeps historical/temporal comparisons descriptive despite complete-looking metadata', () => {
    const { contract, arms } = fixture(); contract.design = 'historical-continuation';
    expect(assessComparison(contract, arms).disposition).toBe('descriptive-only');
  });
  it('requires raw observations and pairing keys before recomputation', () => {
    const { contract, arms } = fixture(); contract.rawPairsAvailable = false; contract.pairingKeys = [];
    const result = assessComparison(contract, arms);
    expect(result.limitations).toEqual(expect.arrayContaining(['paired-observations-unavailable','pairing-keys-unavailable']));
    expect(() => requireRecomputablePairs(result, [])).toThrow(/not eligible/);
  });
  it('does not substitute rollout count for unknown independent units', () => {
    const { contract, arms } = fixture(); for (const arm of arms) { arm.trialCount = 1024; arm.independentUnitCount = null; }
    const result = assessComparison(contract, arms);
    expect(result.disposition).toBe('descriptive-only'); expect(result.limitations).toContain('independent-unit-count-unknown');
  });
  it('rejects independent counts that disagree or exceed trial count', () => {
    const { contract, arms } = fixture(); arms[0]!.independentUnitCount = 3;
    expect(assessComparison(contract, arms).reasons).toEqual(expect.arrayContaining(['independent-unit-counts-differ','unit-count-exceeds-trials']));
  });
  it('validates pair identities and sample counts without implementing a second bootstrap', () => {
    const { contract, arms } = fixture(); const result = assessComparison(contract, arms);
    const rows = [{ pairId: 'p1', unitId: 't1', left: 0.2, right: 0.4 }, { pairId: 'p2', unitId: 't2', left: 0.4, right: 0.5 }];
    expect(requireRecomputablePairs(result, rows)).toEqual({ pairCount: 2, unitCount: 2 });
    expect(() => requireRecomputablePairs(result, [rows[0]!])).toThrow(/sample counts/);
    expect(() => requireRecomputablePairs(result, [rows[0]!, rows[0]!])).toThrow(/Duplicate/);
    expect(() => requireRecomputablePairs(result, [rows[0]!, { ...rows[1]!, unitId: 't1' }])).toThrow(/clustered/);
    expect(() => requireRecomputablePairs(result, [{ ...rows[0]!, left: Infinity }, rows[1]!])).toThrow(/Invalid paired/);
  });
});

describe('reported uncertainty and exact arithmetic', () => {
  it.each([[-0.03,0.01],[-0.1,-0.02],[0.02,0.1]])('never infers equivalence or non-inferiority from [%s,%s]', (low, high) => {
    const result = reportedInterval([low, high], 'synthetic-report#/ci');
    expect(result.origin).toBe('source-reported-not-recomputed');
    expect(result.equivalence).toBe('not-established'); expect(result.nonInferiority).toBe('not-established');
    expect(result.containsZero).toBe(low <= 0 && high >= 0);
  });
  it.each([[1,0],[NaN,1],[0,Infinity],[0]])('rejects malformed interval %s', (...values) => {
    expect(() => reportedInterval(values, 'fixture')).toThrow();
  });
  it('requires interval source attribution', () => { expect(() => reportedInterval([0,1], '')).toThrow(/source/); });
  it('keeps true zero, unknown and invalid arithmetic separate', () => {
    expect(finiteDifference(0,0)).toBe(0); expect(finiteDifference(0,0.5)).toBe(-0.5);
    expect(finiteDifference(null,0)).toBeNull(); expect(() => finiteDifference(Infinity,0)).toThrow();
    expect(() => finiteDifference(Number.MAX_VALUE,-Number.MAX_VALUE)).toThrow(/overflow/);
  });
  it('uses exact equality for counts and a declared tolerance for floating results', () => {
    expect(requireReportedAgreement(7,7,0).tolerance).toBe(0);
    expect(() => requireReportedAgreement(7,8,0)).toThrow(/disagrees/);
    expect(requireReportedAgreement(0.1+0.2,0.3,12).absoluteError).toBeLessThan(1e-12);
    expect(() => requireReportedAgreement(null,0)).toThrow();
    expect(() => requireReportedAgreement(NaN,0)).toThrow();
    expect(() => requireReportedAgreement(Infinity,0)).toThrow();
  });
});

describe('whole-scope windows and missing data', () => {
  const scope = { first: 0, last: 4 }, windows = [{ id:'early', first:0, last:1 }, { id:'late', first:2, last:4 }];
  it('calculates hand-checkable means/slopes with unequal window lengths', () => {
    const result = summarizeRoundWindows([0,1,2,3,4].map((round) => point(round,2*round+1)), 'fixture', windows, scope);
    expect(result.map((window) => window.mean)).toEqual([2,7]);
    expect(result.map((window) => window.slopePerRound)).toEqual([2,2]);
    expect(result.map((window) => window.expectedRounds)).toEqual([2,3]);
    expect(result.reduce((sum,window) => sum+window.sum!,0)/5).toBe(5);
  });
  it('does not turn an absent or null point into zero or a full-window estimate', () => {
    const result = summarizeRoundWindows([point(0,0),point(2,4),point(3,null),point(4,8)], 'fixture', windows, scope);
    expect(result.map((window) => window.mean)).toEqual([null,null]);
    expect(result.map((window) => window.observedOnlyMean)).toEqual([0,6]);
    expect(result.map((window) => window.missingRounds)).toEqual([[1],[3]]);
    expect(result.map((window) => window.slopePerRound)).toEqual([null,null]);
  });
  it('rejects selecting only the better window or silently skipping a window', () => {
    expect(() => summarizeRoundWindows([], 'fixture', [windows[1]!], scope)).toThrow(/partition/);
    expect(() => summarizeRoundWindows([], 'fixture', [windows[0]!], scope)).toThrow(/best window/);
  });
  it('rejects overlapping windows and duplicate observations', () => {
    expect(() => summarizeRoundWindows([], 'fixture', [{ id:'a',first:0,last:2 },{id:'b',first:2,last:4}], scope)).toThrow(/partition/);
    expect(() => summarizeRoundWindows([point(0,1),point(0,1)], 'fixture', windows, scope)).toThrow(/Duplicate/);
  });
  it('does not silently drop out-of-scope or invalid positions', () => {
    expect(() => summarizeRoundWindows([point(8,1)], 'fixture', windows, scope)).toThrow(/outside/);
    expect(() => summarizeRoundWindows([{ ...point(0,1), position:null }], 'fixture', windows, scope)).toThrow(/outside/);
  });
  it('reports all-missing windows as unknown, not measured zero', () => {
    const result = summarizeRoundWindows([], 'fixture', windows, scope);
    expect(result.map((window) => [window.mean,window.sum,window.observedOnlyMean])).toEqual([[null,null,null],[null,null,null]]);
  });
});
