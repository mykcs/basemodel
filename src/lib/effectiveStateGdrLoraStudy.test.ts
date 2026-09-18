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
    expect(study.source.finalImplementationPr).toBe(523);
    expect(study.source.controlTowerPr).toBe(502);
    expect(study.source.finalImplementationHead).toBe('fbdb21b2739ffeeca90e17eac83c14adb6087be2');
    expect(study.source.formalExecutionCheckout).toBe('fbdb21b2739ffeeca90e17eac83c14adb6087be2');
    expect(study.source.scientificExecutionSha).toBe('fbdb21b2739ffeeca90e17eac83c14adb6087be2');
    expect(study.source.scienceExecutionGateCodeFreeze).toBe('c5e012814bb9509deb0e2cbc8d57a63e2b56889f');
    expect(study.source.campaignId).toBe('20260916-0255-bounded-effective-state-gdr');
    expect(study.source.experimentId).toBe('202609160255-bounded-effective-state-gdr');
    expect(study.source.passportSha256).toMatch(sha64);
    expect(study.source.registrySha256).toMatch(sha64);
    expect(study.source.carrierAdoptionIdentity).toBe('bdeacdd126f89dffa9ec8c31a12e20b7bbb9ae8367f2ff80b92e9c8e848ad0e4');
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
    expect(component).toContain('正式 OFF / ON 实验正在运行');
    expect(component).toContain('运行中分数、partial W&B 或单个 checkpoint 都不是正式结论');
  });

  it('keeps the formal result fail-closed while the formal study is running', () => {
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
    expect(study.lifecycle.continuationAuthority).toBe(true);
    expect(study.lifecycle.armProgression).toBe('INDEPENDENT');
    expect(study.lifecycle.pairingMode).toBe('ASYNC_AUDIT_ONLY');
    expect(study.lifecycle.pairedReceiptsAdmissionAuthority).toBe(false);
    expect(study.lifecycle.pairedReceiptsBlockArmProgression).toBe(false);
    expect(study.lifecycle.sameWallClockCompletionRequired).toBe(false);
    expect(study.lifecycle.ownerLaunchReleasePresent).toBe(true);
    expect(study.lifecycle.ownerLaunchReleaseSha256).toBe('7c6484f3629b149c6b4afe21f9dfa8d5c02bc789784386402d9fd04f2017aecb');
    expect(study.lifecycle.sealedRolloutRecoverySha256).toBe('6e0369b3880e6ae36223f9f5eed826582e73f02a1a72e7ec02d9ae78804c569b');
    expect(study.lifecycle.formalRowsConsumed).toBeNull();
    expect(study.lifecycle.formalRowsDisclosure).toContain('all 160 pair audits');
    expect(study.lifecycle.finalPanelAccess).toBe(0);
    expect(study.lifecycle.formalOutputRootExists).toBe(true);
    expect(study.lifecycle.formalOutputRoot).toContain('bounded-effective-state-gdr-recovery-1e7c4952-20260916');
    expect(study.lifecycle.currentReadySha256).toBe('3493da01babaf762acc7b6337d685ec86111df352ad7e180d7dfbc9f74576432');
    expect(study.lifecycle.prelaunchReceiptsAreHistoricalAfterExecutionChange).toBe(true);
    expect(study.lifecycle.prelaunchEvidence.controllerInitOnlySha256).toBe('adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e');
    expect(study.lifecycle.prelaunchEvidence.matchedDryRunSha256).toBe('00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52');
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

  it('binds the current GPU4-7 resource pool without changing treatment', () => {
    expect(study.resourceExecution.physicalGpuIndices).toEqual([4, 5, 6, 7]);
    expect(study.resourceExecution.schedulerMode).toContain('capacity-aware');
    expect(study.resourceExecution.crossPhaseOverlapAllowed).toBe(true);
    expect(study.resourceExecution.liveResourceExecutionSha).toMatch(sha40);
    expect(study.resourceExecution.resourceSuccessorPr).toBe(525);
    expect(study.resourceExecution.resourceVerifierPr).toBe(526);
    expect(study.resourceExecution.claimBoundary).toContain('treatment/tasks/seeds/sampling');
  });

  it('freezes the matched formal budget, independent progression, and locked final panel', () => {
    expect(study.formalDesign.rounds).toBe(160);
    expect(study.formalDesign.rolloutsPerRoundPerArm).toBe(128);
    expect(study.formalDesign.formalRolloutsPerArm).toBe(20_480);
    expect(study.formalDesign.finalPanel).toContain('locked');
    expect(study.formalDesign.armProgression).toContain('independent 160-round state machines');
    expect(study.formalDesign.pairing).toContain('never gate arm progression');
    expect(study.formalDesign.onlyTreatmentDifference).toContain('Effective-State GDR');
  });
});
});
