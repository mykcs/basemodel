import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  EFFECTIVE_STATE_GDR_LORA_STUDY as study,
  type EffectiveStateFormalResult,
} from '../data/effectiveStateGdrLoraStudy';

const sha40 = /^[0-9a-f]{40}$/;
const sha64 = /^[0-9a-f]{64}$/;

describe('Effective-State GDR publication snapshot', () => {
  it('binds the current frozen scientific and control identities', () => {
    expect(study.source.repository).toBe('mykcs/openevo-experiment');
    expect(study.source.finalImplementationPr).toBe(510);
    expect(study.source.controlTowerPr).toBe(502);
    expect(study.source.finalImplementationHead).toBe('52dc699d5bccc1a75adc7a4e7a863ca58148eb93');
    expect(study.source.formalExecutionCheckout).toBe('80bf263e9bf65fd0382f3c762e2a42b4928514a0');
    expect(study.source.scientificExecutionSha).toBe('80bf263e9bf65fd0382f3c762e2a42b4928514a0');
    expect(study.source.scienceExecutionGateCodeFreeze).toBe('c5e012814bb9509deb0e2cbc8d57a63e2b56889f');
    expect(study.source.campaignId).toBe('20260916-0255-bounded-effective-state-gdr');
    expect(study.source.experimentId).toBe('202609160255-bounded-effective-state-gdr');
    expect(study.source.passportSha256).toMatch(sha64);
    expect(study.source.registrySha256).toMatch(sha64);
    expect(study.source.carrierAdoptionIdentity).toBe('274123dde66547d5d5ba68b5c8b75c0205a75191ce3c1c471a606d589ac5250b');
    expect(study.source.authorityReconciliationRequired).toBe(false);
    expect(study.source.preCampaignValidation.scientificExecutionSha).toBe('b41884ac90d185742dc47f240c4d54a3cfaf6175');
    expect(study.source.preCampaignValidation.implementationHead).toBe('5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa');
    expect(study.source.status).toBe('FORMAL_RUNNING');
    expect(study.source.currentCampaignClassification).toBe('FORMAL_RUNNING');
    expect(study.source.liveExecutionFrozen).toBe(true);
    expect(study.source.repositoryCurrentMustNotHotSwapLiveRun).toBe(true);
    expect(study.source.controlTowerHead).toMatch(sha40);
    expect(Number.isNaN(Date.parse(study.checkedAt))).toBe(false);
  });

  it('keeps Pending component copy non-claiming', () => {
    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');
    expect(component).toContain('不会在 seal 前写 winner');
    expect(component).not.toContain('Effective-State GDR 优于 Bounded');
    expect(component).not.toContain('Effective-State GDR beats Bounded');
    expect(component).toContain('正式实验正在 GPU4–7 运行');
    expect(component).toContain('不会把中途 round、partial W&B 或单个 checkpoint 当作正式结果');
  });

  it('keeps the formal result fail-closed while the formal run is active', () => {
    expect(study.formalResult).toEqual({
      status: 'pending',
      sealedEvidence: null,
      pooledReward: null,
      exactSuccess: null,
      uncertainty: null,
      finalPanel: null,
      conclusion: null,
    } satisfies EffectiveStateFormalResult);
    expect(study.lifecycle.status).toBe('FORMAL_RUNNING');
    expect(study.lifecycle.formalRunLaunched).toBe(true);
    expect(study.lifecycle.launchAuthority).toBe(true);
    expect(study.lifecycle.ownerLaunchReleasePresent).toBe(true);
    expect(study.lifecycle.ownerLaunchReleaseSha256).toBe('8c68c58dd45bc7216829d606eb5d5aaaa0db7855141306dafbec9cf6dcf1140f');
    expect(study.lifecycle.formalRowsConsumed).toBeNull();
    expect(study.lifecycle.formalRowsDisclosure).toContain('not a formal-result authority');
    expect(study.lifecycle.finalPanelAccess).toBe(0);
    expect(study.lifecycle.formalOutputRootExists).toBe(true);
    expect(study.lifecycle.formalOutputRoot).toContain('bounded-effective-state-gdr-formal-80bf263e-20260916');
    expect(study.lifecycle.currentReadySha256).toBe('db3087ec8d8269f99b60cd1ff1511ed825e1a4ad6ffc96388f3c7ca27c70413d');
    expect(study.lifecycle.prelaunchReceiptsAreHistoricalAfterExecutionChange).toBe(true);
    expect(study.lifecycle.prelaunchEvidence.controllerInitOnlySha256).toBe('adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e');
    expect(study.lifecycle.prelaunchEvidence.matchedDryRunSha256).toBe('00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52');
    expect(study.lifecycle.prelaunchEvidence.observabilityAdmissionSha256).toBe('9a75be897bb518a4bcbbf4e2069e511662f994e1b5f46f8b3126eab38e1b199a');
    expect(study.lifecycle.prelaunchEvidence.prelaunchZeroStateSealSha256).toBe('7771ad89c0c400adaa23a27762766a043a3c928122f3cbfa8780101f6882ea03');
  });

  it('requires pinned evidence before the sealed branch can carry formal numbers', () => {
    const sealed: EffectiveStateFormalResult = {
      status: 'sealed',
      sealedEvidence: {
        repository: 'mykcs/openevo-experiment',
        scientificExecutionSha: 'a'.repeat(40),
        sealReceiptPath: 'docs/evidence/example.json',
        sealReceiptSha256: 'b'.repeat(64),
      },
      pooledReward: { off: 0.1, on: 0.2, delta: 0.1 },
      exactSuccess: { off: 1, on: 2, delta: 1 },
      uncertainty: { label: 'sealed preregistered interval', low: 0, high: 1 },
      finalPanel: null,
      conclusion: 'example type witness only',
    };
    expect(sealed.sealedEvidence.scientificExecutionSha).toMatch(sha40);
    expect(sealed.sealedEvidence.sealReceiptSha256).toMatch(sha64);
  });

  it('keeps readiness evidence separate from formal efficacy', () => {
    expect(study.readiness.shortNonFinal.qualificationOnly).toBe(true);
    expect(study.readiness.shortNonFinal.claimBoundary).toContain('not formal efficacy');
    expect(study.readiness.shortNonFinal.rewardDelta).not.toBe(study.formalResult.pooledReward);
    expect(study.observability.scientificAuthority).toBe(false);
  });

  it('preserves the two different negative results', () => {
    expect(study.derivation.firstGenerationFactorFailure.betaC).toBeCloseTo(1.0523405381256283, 12);
    expect(study.derivation.firstGenerationFactorFailure.meaning).toContain('factor-displacement');
    expect(study.derivation.firstGenerationFactorFailure.meaning).toContain('not the original effective-beta');
    expect(study.derivation.mappingOnlyControllerFailure.betaEffective).toBeCloseTo(657.8360748437726, 9);
    expect(study.derivation.mappingOnlyControllerFailure.meaning).toContain('effective-beta');
  });

  it('freezes Effective-State runtime inputs and treatment timing', () => {
    expect(study.derivation.successor.forbiddenRuntimeInputs).toEqual({
      reward: false,
      score: false,
      taskVector: false,
      probe: false,
      futureState: false,
      finalPanel: false,
    });
    expect(study.identity.treatmentStart).toBe('Round0 first Stage2 optimizer update');
    expect(study.derivation.successor.g).toBe(0);
    expect(study.derivation.successor.retention).toBe(1);
  });

  it('binds the current GPU4-7 resource lane without changing treatment', () => {
    expect(study.resourceExecution.physicalGpuIndices).toEqual([4, 5, 6, 7]);
    expect(study.resourceExecution.workersPerGpu).toBe(2);
    expect(study.resourceExecution.postRolloutGpu).toBe(4);
    expect(study.resourceExecution.crossPhaseOverlapAllowed).toBe(false);
    expect(study.resourceExecution.resourceSuccessorSha256).toMatch(sha64);
    expect(study.resourceExecution.claimBoundary).toContain('treatment/tasks/seeds/sampling');
  });

  it('freezes the matched formal budget and locked final panel', () => {
    expect(study.formalDesign.rounds).toBe(160);
    expect(study.formalDesign.rolloutsPerRoundPerArm).toBe(128);
    expect(study.formalDesign.formalRolloutsPerArm).toBe(20_480);
    expect(study.formalDesign.finalPanel).toContain('locked');
    expect(study.formalDesign.roundBarrier).toContain('OFF+ON rollout concurrent');
    expect(study.formalDesign.roundBarrier).toContain('matched barrier');
    expect(study.formalDesign.onlyTreatmentDifference).toContain('Effective-State GDR');
  });
});
