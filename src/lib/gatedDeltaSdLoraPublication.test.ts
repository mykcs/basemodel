import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GATED_DELTA_SD_LORA_PUBLICATION as snapshot } from '../data/gatedDeltaSdLoraPublicationSnapshot';
import { CAPABILITY_READER_ROUTES } from '../data/capabilityReaderRoutes';
import { bilingualStaticPaths } from './sitemapRoutes';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const current = read('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro');
const history = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');
const currentZhRoute = read('../pages/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/index.astro');
const currentEnRoute = read('../pages/en/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/index.astro');

describe('Gated-Delta SD-LoRA publication split', () => {
  it('keeps runtime control free of Task Vector, score, probe, and future-state leakage', () => {
    expect(snapshot.runtimeBoundary.taskVectorRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.scoreRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.probeRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.futureStateRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.decay).toBe(0);
    expect(snapshot.status.realExecutionProved).toBe(true);
    expect(snapshot.status.executionProofOnly).toBe(false);
    expect(snapshot.status.partialPairedSignalOnly).toBe(false);
    expect(snapshot.status.fullPairedD1Complete).toBe(true);
    expect(snapshot.status.pairedRoundsSealed).toBe(4);
    expect(snapshot.status.fullPairedD1ProgressPercent).toBe(100);
    expect(snapshot.status.qualificationComparisonClaim).toBe(true);
    expect(snapshot.status.universalEfficacyClaim).toBe(false);
    expect(snapshot.status.finalPanelAccess).toBe(false);
    expect(snapshot.routeSExecution.attemptCount).toBe(128);
    expect(snapshot.routeSExecution.appliedFactorWrites).toBe(7904);
    expect(snapshot.routeSExecution.allGExactZero).toBe(true);
    expect(snapshot.pairedD1.round1.pairedMeanRewardDelta).toBeCloseTo(0.024652777777777746);
    expect(snapshot.pairedD1.round1.pairedExactSuccessDelta).toBe(6);
    expect(snapshot.pairedD1.round1.treatmentAppliedFactorWrites).toBe(6496);
    expect(snapshot.pairedD1.round2.pairedExactSuccessDelta).toBe(58);
    expect(snapshot.pairedD1.round3.pairedExactSuccessDelta).toBe(11);
    expect(snapshot.pairedD1.pooled.pairedMeanRewardDelta).toBeCloseTo(0.0356359);
    expect(snapshot.pairedD1.pooled.pairedExactSuccessDelta).toBe(75);
    expect(snapshot.pairedD1.clusterBootstrap.meanRewardDelta95[0]).toBeGreaterThan(0);
    expect(snapshot.pairedD1.clusterBootstrap.exactSuccessRateDelta95[0]).toBeGreaterThan(0);
  });

  it('gives current mechanism and historical experiment separate canonical owners', () => {
    expect(CAPABILITY_READER_ROUTES).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: 'gdr-directapply', owner: 'OpenEvoGdrDirectApplyExplainer' }),
      expect.objectContaining({ route: 'gated-delta-sd-lora', owner: 'OpenEvoGatedDeltaSdLoraExplainer' }),
    ]));
    expect(bilingualStaticPaths).toContain('/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/');
  });

  it('keeps the current page about recurrent write rather than replaying the old admission experiment', () => {
    expect(current).toContain("Task Vector 的角色");
    expect(current).toContain('S<sub>t</sub> = S̃<sub>t−1</sub> + β');
    expect(current).toContain('四轮 Vanilla vs GDR 配对资格实验已经全部封存');
    expect(current).toContain('snapshot.routeSExecution.appliedFactorWrites.toLocaleString');
    expect(current).toContain('配对实验进度');
    expect(current).toContain('四轮汇总 · reward');
    expect(current).not.toContain('20,480 rollouts · 44 candidates · 7 adopted');
    expect(current).not.toContain('16-task probe 比较新旧状态');
  });

  it('keeps route metadata aligned with the sealed four-round qualification', () => {
    expect(currentZhRoute).toContain('title="Gated-Delta SD-LoRA：四轮资格实验已封存"');
    expect(currentZhRoute).toContain('四轮冻结 D1 资格实验已全部封存');
    expect(currentZhRoute).toContain('这不代表普遍优于 Vanilla，也不是 final-panel 结果');
    expect(currentZhRoute).not.toContain('效果比较还没完成');
    expect(currentZhRoute).not.toContain('四轮效果比较还没封存');

    expect(currentEnRoute).toContain('title="Gated-Delta SD-LoRA: four-round qualification sealed"');
    expect(currentEnRoute).toContain('All four frozen D1 qualification rounds are sealed');
    expect(currentEnRoute).toContain('without implying universal superiority or a final-panel result');
    expect(currentEnRoute).not.toContain('efficacy comparison still incomplete');
    expect(currentEnRoute).not.toContain('comparison is not complete yet');
  });

  it('keeps the historical page about candidate admission rather than duplicating the current recurrence', () => {
    expect(history).toContain('44 个候选更新，只有 7 个真正改到了后续模型');
    expect(history).toContain('用固定 16 题比较更新前后的模型');
    expect(history).toContain('gated-delta-sd-lora');
    expect(history).not.toContain('S̃<sub>t−1</sub> = exp(g');
    expect(history).not.toContain('D0.26');
    expect(history).not.toContain('Task Vector 退出 runtime causal path');
  });

  it('pins a dated scientific source rather than turning the website into authority', () => {
    expect(snapshot.source.repository).toBe('mykcs/openevo-experiment');
    expect(snapshot.source.branch).toContain('gated-delta-sd-lora-event-write');
    expect(snapshot.source.head).toMatch(/^[0-9a-f]{40}$/);
    expect(snapshot.checkedAt).toMatch(/^2026-09-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
    expect(current).toContain('这是网站发布快照');
  });
});
