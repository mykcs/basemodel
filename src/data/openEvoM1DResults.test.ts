import { describe, expect, it } from 'vitest';
import { OPEN_EVO_M1D_RESULTS } from './openEvoM1DResults';

describe('M1-D result publication boundary', () => {
  it('keeps the frozen Stage1 budget exact', () => {
    expect(OPEN_EVO_M1D_RESULTS.stage1).toMatchObject({
      taskCount: 180,
      rolloutsPerTask: 8,
      trajectoryTarget: 1440,
      maxSteps: 15,
      historyLength: 2,
      worldSeed: 2026,
      numProducts: 1000,
      luceneIndex: 'indexes_1k',
      policyTemperature: 0.4,
      requestLevelSeed: null,
      stage2Budget: 0,
    });
  });

  it('withholds scientific metrics until both trajectory and MiniMax seals exist', () => {
    expect(OPEN_EVO_M1D_RESULTS.publicationState).toBe(
      'RESULTS_WITHHELD_UNTIL_TRAJECTORY_AND_MINIMAX_SEAL',
    );
    expect(OPEN_EVO_M1D_RESULTS.publicationGates.map((gate) => gate.id)).toEqual([
      'trajectory-seal',
      'minimax-seal',
      'matched-compare',
      'hard-stop',
    ]);
    expect(JSON.stringify(OPEN_EVO_M1D_RESULTS)).not.toContain('currentScore');
    expect(JSON.stringify(OPEN_EVO_M1D_RESULTS)).not.toContain('finalScore');
  });

  it('keeps the public result fields descriptive rather than populated', () => {
    expect(OPEN_EVO_M1D_RESULTS.resultMetrics.map((metric) => metric.id)).toEqual([
      'exact',
      'positive',
      'mean-score',
      'invalid',
      'length',
    ]);
    for (const metric of OPEN_EVO_M1D_RESULTS.resultMetrics) {
      expect(Object.keys(metric).sort()).toEqual(['en', 'id', 'zh']);
    }
  });
});
