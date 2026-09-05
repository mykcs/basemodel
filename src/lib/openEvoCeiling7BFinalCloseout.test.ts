import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const snap = read('../data/openEvoCeilingStage2Snapshot.ts');
const ceiling = read('../components/research/OpenEvoCeilingStrategy.astro');
const firstRun = read('../components/research/OpenEvoFirstRunMap.astro');
const zhPage = read('../pages/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro');

describe('Ceiling-1.0 7B final closeout', () => {
  it('keeps the historical 2026-08-31 snapshot and adds a separate final record', () => {
    expect(snap).toContain("observedAt: '2026-08-31 20:34 JST'");
    expect(snap).toContain("status: 'RUNNING', roundsComplete: 31");
    expect(snap).toContain('sevenBFinalCloseout');
    expect(snap).toContain('completedRounds: 149');
    expect(snap).toContain("completedRange: '0–148'");
    expect(snap).toContain('acceptedRollouts: 19_072');
    expect(snap).toContain('partialRound149Excluded: true');
    expect(snap).toContain('sdComponents: 143');
  });

  it('publishes the frozen 128-task final without dropping fail-closed rows from the denominator', () => {
    expect(snap).toContain('meanTaskScore: 49.326636904761905');
    expect(snap).toContain('exactSuccessCount: 58');
    expect(snap).toContain('exactSuccessPct: 45.3125');
    expect(snap).toContain('actionAdmissibilityFailures: 7');
    expect(snap).toContain('runtimeErrors: 0');
    expect(ceiling).toContain('128 / 128 全部完成');
    expect(ceiling).toContain('headline 始终以全部 128 题为分母');
    expect(firstRun).toContain('58 / 128 完整成功');
  });

  it('keeps SEED paper numbers in a paper-reference claim domain', () => {
    expect(snap).toContain('seedPaperReference: { score: 89.7, successPct: 78.1 }');
    expect(ceiling).toContain('SEED · PAPER REFERENCE');
    expect(ceiling).toContain('Score −40.37');
    expect(ceiling).toContain('Success −32.79');
    expect(ceiling).toContain('不把它写成方法因果效应');
    expect(firstRun).toContain('不冒充本地 paired reproduction');
  });

  it('shows parameter-analysis closeout without claiming compression was used in the final checkpoint', () => {
    expect(firstRun).toContain('update stable rank 16.55');
    expect(firstRun).toContain('95% energy rank 77');
    expect(firstRun).toContain('residual-energy 中位数 0.0597');
    expect(firstRun).toContain('K64');
    expect(firstRun).toContain('不属于 formal final checkpoint');
    expect(ceiling).toContain('formal 训练里始终没有启用 rank reduction / compression');
  });

  it('updates both localized Ceiling page descriptions with the final 7B closeout', () => {
    expect(zhPage).toContain('49.33 分 / 45.31% 完整成功');
    expect(zhPage).toContain('149 个完整 round');
    expect(enPage).toContain('49.33 score / 45.31% exact success');
    expect(enPage).toContain('149 completed rounds');
  });
});
