import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  SD_LORA_BOUNDED_ACCELERATION_RESULT as result,
  SD_LORA_BOUNDED_ACCELERATION_SOURCE as source,
} from '../data/sdLoraBoundedAccelerationStudy';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const page = read('../components/research/OpenEvoSdLoraBoundedAccelerationStudy.astro');
const route = read('../pages/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/index.astro');
const bounded = read('../components/research/OpenEvoSdLoraBoundedRecurrence.astro');

describe('Bounded acceleration follow-up publication', () => {
  it('pins the publication to public OpenEVO engineering-smoke evidence', () => {
    expect(source.repository).toBe('mykcs/openevo-experiment');
    expect(source.commit).toBe('4ba4ce7432689ef5eead7f54a7cc9af320dd9444');
    expect(source.deviceSmokePath).toContain('ba-pre-b2b-gpu0123-smoke');
    expect(source.trainingOrderPath).toContain('ba-pre-a-training-order-smoke');
  });
  it('keeps the engineering-smoke boundary explicit', () => {
    expect(result.formalRowsConsumed).toBe(0);
    expect(result.protectedFinalPanelAccess).toBe(0);
    expect(result.claimBoundary.formalB2Closed).toBe(false);
    expect(result.claimBoundary.formalB3Closed).toBe(false);
    expect(result.claimBoundary.formalAClosed).toBe(false);
    expect(result.claimBoundary.formalWebShopEffectMeasured).toBe(false);
    expect(page).toContain('不是正式 B2 / B3');
  });

  it('publishes the measured bottleneck without turning SVD into the headline target', () => {
    expect(result.steadyTraining.trainLoopSeconds).toBeCloseTo(4.2590052, 6);
    expect(result.steadyTraining.compressionSeconds).toBeCloseTo(0.4904922, 6);
    expect(result.steadyTraining.trainToCompressionRatio).toBeGreaterThan(8);
    expect(result.batchedSvd.totalSeconds).toBeGreaterThan(result.batchedSvd.serialWarm112Seconds);
    expect(page).toContain('Bounded 的主要时间花在训练');
    expect(page).toContain('Muon / Newton–Schulz');
  });
  it('publishes functional order dependence rather than a serialization-only difference', () => {
    expect(result.orderDependence.changedModules).toBe(result.targetModules);
    expect(result.orderDependence.aggregateDenseRelativeL2Difference).toBeCloseTo(0.5935992357, 8);
    expect(result.orderDependence.originalAdapterSha256).not.toBe(result.orderDependence.reversedAdapterSha256);
    expect(page).toContain('112 个 module 全部不同');
    expect(page).toContain('不只是低秩因子的表示或序列化');
  });

  it('keeps naive A rejected while exact full-state transfer remains open', () => {
    expect(result.claimBoundary.naiveOptimizerStepReorderingEquivalent).toBe(false);
    expect(result.claimBoundary.everyExactFullStateTransferRuledOut).toBe(false);
    expect(page).toContain('排除了“把现有 AdamW step 独立分块、重排后再 merge”这种朴素 A');
    expect(page).toContain('没有证明所有可能的 exact chunk transfer 都不存在');
  });
  it('wires the new study into the public route and the bounded-result journey', () => {
    expect(route).toContain('OpenEvoSdLoraBoundedAccelerationStudy');
    expect(route).toContain('Bounded 后续加速：主要时间花在训练');
    expect(bounded).toContain('sd-lora-bounded-acceleration');
  });
});
