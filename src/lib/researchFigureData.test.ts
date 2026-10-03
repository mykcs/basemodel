import { describe, expect, it } from 'vitest';
import {
  BETA_TRAINING_FIGURE,
  CAPACITY_TRADEOFF_FIGURE,
  SAME_PANEL_FINAL_FIGURE,
} from '../data/researchFigureData';
import analysisSnapshot from '../data/researchAnalysisSnapshot.json';

describe('C02 research figure data contracts', () => {
  it('keeps the beta trend on the full published R96–R199 axis', () => {
    expect(BETA_TRAINING_FIGURE.evaluationRole).toBe('training');
    expect(BETA_TRAINING_FIGURE.yDomain).toEqual([0, 100]);
    expect(BETA_TRAINING_FIGURE.rawPoints).toHaveLength(104);
    expect(BETA_TRAINING_FIGURE.rawPoints[0]?.round).toBe(96);
    expect(BETA_TRAINING_FIGURE.rawPoints.at(-1)?.round).toBe(199);
    expect(BETA_TRAINING_FIGURE.rawPoints.map((point) => point.round)).toEqual(
      Array.from({ length: 104 }, (_, index) => 96 + index),
    );
  });

  it('does not turn missing beta values into zero', () => {
    for (const point of BETA_TRAINING_FIGURE.rawPoints) {
      if (point.score === null) continue;
      expect(point.score).toBeGreaterThanOrEqual(0);
      expect(point.score).toBeLessThanOrEqual(100);
    }
    expect(BETA_TRAINING_FIGURE.rawPoints.some((point) => point.score === 0)).toBe(
      analysisSnapshot.studies.betaLateTraining.windows.some((window) => window.scorePoints === 0),
    );
  });

  it('preserves every prespecified beta window including the 24-round first window', () => {
    expect(BETA_TRAINING_FIGURE.windows.map((window) => [window.id, window.roundCount])).toEqual([
      ['R96-119', 24],
      ['R120-139', 20],
      ['R140-159', 20],
      ['R160-179', 20],
      ['R180-199', 20],
    ]);
    expect(BETA_TRAINING_FIGURE.windows.map((window) => window.score)).toEqual(
      analysisSnapshot.studies.betaLateTraining.windows.map((window) => window.scorePoints),
    );
  });

  it('marks the extension boundary without relabeling it as a final evaluation', () => {
    expect(BETA_TRAINING_FIGURE.extensionBoundary).toBe(160);
    expect(BETA_TRAINING_FIGURE.doesNotSupport).toContain('冻结 Final');
    expect(BETA_TRAINING_FIGURE.doesNotSupport).toContain('最佳停止点');
  });

  it('reads the same-panel final from the D01 evidence projection', () => {
    expect(SAME_PANEL_FINAL_FIGURE.evaluationRole).toBe('frozen_final');
    expect(SAME_PANEL_FINAL_FIGURE.denominator).toBe(128);
    expect(SAME_PANEL_FINAL_FIGURE.rows.map((row) => row.exactCount)).toEqual([50, 32, 10]);
    expect(SAME_PANEL_FINAL_FIGURE.rows.map((row) => Number(row.taskScore.toFixed(2)))).toEqual([
      60.72,
      45.98,
      20.77,
    ]);
  });

  it('keeps exact success on its own denominator instead of merging it into Task Score', () => {
    for (const row of SAME_PANEL_FINAL_FIGURE.rows) {
      expect(row.exactRate).toBe(row.exactCount / SAME_PANEL_FINAL_FIGURE.denominator);
      expect(row.taskScore).toBeGreaterThanOrEqual(0);
      expect(row.taskScore).toBeLessThanOrEqual(100);
    }
  });

  it('keeps ordinary OpenEVO as a historical predecessor rather than a third formal arm', () => {
    expect(SAME_PANEL_FINAL_FIGURE.doesNotSupport).toContain('historical predecessor');
    expect(SAME_PANEL_FINAL_FIGURE.doesNotSupport).toContain('not a third arm');
  });

  it('fails closed on the rank32 publication gap instead of copying unpublished values', () => {
    expect(CAPACITY_TRADEOFF_FIGURE.state).toBe('awaiting-publication');
    expect(CAPACITY_TRADEOFF_FIGURE.source.href).toContain('/pull/805');
    for (const row of CAPACITY_TRADEOFF_FIGURE.rows) {
      expect(row.adapterBytes).toBeNull();
      expect(row.taskScore).toBeNull();
      expect(row.exactCount).toBeNull();
    }
  });

  it('does not infer minimum trainable rank from posterior effective rank', () => {
    expect(CAPACITY_TRADEOFF_FIGURE.doesNotSupport).toContain('不从 effective rank 反推最小可训 rank');
  });
});
