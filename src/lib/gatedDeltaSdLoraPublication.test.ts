import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GATED_DELTA_SD_LORA_PUBLICATION as snapshot } from '../data/gatedDeltaSdLoraPublicationSnapshot';
import { CAPABILITY_READER_ROUTES } from '../data/capabilityReaderRoutes';
import { bilingualStaticPaths } from './sitemapRoutes';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const current = read('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro');
const history = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');

describe('Gated-Delta SD-LoRA publication split', () => {
  it('keeps runtime control free of Task Vector, score, probe, and future-state leakage', () => {
    expect(snapshot.runtimeBoundary.taskVectorRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.scoreRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.probeRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.futureStateRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.decay).toBe(0);
    expect(snapshot.status.realExecutionProved).toBe(true);
    expect(snapshot.status.executionProofOnly).toBe(false);
    expect(snapshot.status.partialPairedSignalOnly).toBe(true);
    expect(snapshot.status.fullPairedD1Complete).toBe(false);
    expect(snapshot.status.pairedRoundsSealed).toBe(2);
    expect(snapshot.status.fullPairedD1ProgressPercent).toBe(66);
    expect(snapshot.status.efficacyClaim).toBe(false);
    expect(snapshot.status.finalPanelAccess).toBe(false);
    expect(snapshot.routeSExecution.attemptCount).toBe(128);
    expect(snapshot.routeSExecution.appliedFactorWrites).toBe(7904);
    expect(snapshot.routeSExecution.allGExactZero).toBe(true);
    expect(snapshot.pairedD1.round1.pairedMeanRewardDelta).toBeCloseTo(0.024652777777777746);
    expect(snapshot.pairedD1.round1.pairedExactSuccessDelta).toBe(6);
    expect(snapshot.pairedD1.round1.treatmentAppliedFactorWrites).toBe(6496);
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
    expect(current).toContain('四轮 Vanilla vs GDR 配对实验已经封存两轮');
    expect(current).toContain('snapshot.routeSExecution.appliedFactorWrites.toLocaleString');
    expect(current).toContain('配对实验进度');
    expect(current).toContain('Round 1 · reward');
    expect(current).not.toContain('20,480 rollouts · 44 candidates · 7 adopted');
    expect(current).not.toContain('16-task probe 比较新旧状态');
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
