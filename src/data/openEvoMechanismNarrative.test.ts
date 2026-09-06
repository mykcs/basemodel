import { describe, expect, it } from 'vitest';
import { OPEN_EVO_MECHANISM_EXPERIMENTS as experiments, OPEN_EVO_MECHANISM_SOURCE as source, mechanismLifecycleSchema } from './openEvoMechanismNarrative';

const first = experiments[0]!;
const reference = experiments[3]!;

describe('reader-facing experiment lifecycle and scientific state', () => {
  it('defines exactly four experiments with an independent initialization reference', () => {
    expect(experiments.map((row) => row.id)).toEqual(['M1-A', 'M1-B', 'M1-C', 'M1-D']);
    expect(experiments.filter((row) => row.track === 'reference').map((row) => row.id)).toEqual(['M1-D']);
    expect(experiments.map((row) => [row.budget, row.budgetKind])).toEqual([[576, 'maximum'], [448, 'maximum'], [1536, 'fixed'], [1440, 'fixed']]);
  });

  it('preserves the original M1-A preregistration while projecting the locked successor', () => {
    expect(source.m1aAmendment).toContain('identifiability-202609062100');
    expect(source.m1cAmendment).toContain('successor-gate-202609062100');
    expect(first.source).toContain('causal-transplant-202609062100');
    expect(first.execution).toBe('locked');
    expect(reference.executionRelease).toBe(source.activationRelease);
    expect(experiments.slice(0, 3).every((row) => row.executionRelease === null)).toBe(true);
  });

  it('rejects missing or untranslated start, action, stop and output conditions', () => {
    for (const field of ['question', 'start', 'action', 'stop', 'output'] as const) {
      expect(mechanismLifecycleSchema.safeParse({ ...first, [field]: undefined }).success, field).toBe(false);
      for (const locale of ['zh', 'en'] as const) {
        expect(mechanismLifecycleSchema.safeParse({ ...first, [field]: { ...first[field], [locale]: '  ' } }).success, `${field}.${locale}`).toBe(false);
      }
    }
  });

  it('rejects invented run, result and source states rather than treating labels as evidence', () => {
    for (const invalid of [
      { ...first, execution: 'authorized' },
      { ...reference, execution: 'running' },
      { ...reference, execution: 'completed' },
      { ...reference, results: 'sealed' },
      { ...reference, actualEnd: '2026-09-06T12:00:00Z' },
      { ...reference, currentScore: 0 },
      { ...reference, finalScore: 0 },
      { ...first, source: 'https://example.com/fake-receipt' },
    ]) expect(mechanismLifecycleSchema.safeParse(invalid).success).toBe(false);
  });

  it('allows a later evidenced state without making today’s unsealed snapshot a permanent rule', () => {
    const complete = { ...reference, execution: 'completed', results: 'sealed', actualStart: '2026-09-06T10:00:00Z', actualEnd: '2026-09-06T12:00:00Z', resultReceipt: 'test-fixture-only/completion.json' };
    expect(mechanismLifecycleSchema.safeParse(complete).success).toBe(true);
    expect(mechanismLifecycleSchema.safeParse({ ...complete, actualEnd: '2026-09-06T09:00:00Z' }).success).toBe(false);
  });
});
