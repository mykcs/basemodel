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
    expect(study.source.formalExecutionCheckout).toBe('a6f67b66e7d0fce0dc445890a68f9f0364da452a');
    expect(study.source.scientificExecutionSha).toBe('a6f67b66e7d0fce0dc445890a68f9f0364da452a');
    expect(study.source.scienceExecutionGateCodeFreeze).toBe('c5e012814bb9509deb0e2cbc8d57a63e2b56889f');
    expect(study.source.campaignId).toBe('20260916-0255-bounded-effective-state-gdr');
    expect(study.source.experimentId).toBe('202609160255-bounded-effective-state-gdr');
    expect(study.source.passportSha256).toMatch(sha64);
    expect(study.source.registrySha256).toMatch(sha64);
    expect(study.source.carrierAdoptionIdentity).toBe('bdeacdd126f89dffa9ec8c31a12e20b7bbb9ae8367f2ff80b92e9c8e848ad0e4');
    expect(study.source.authorityReconciliationRequired).toBe(false);
    expect(study.source.preCampaignValidation.scientificExecutionSha).toBe('b41884ac90d185742dc47f240c4d54a3cfaf6175');
    expect(study.source.preCampaignValidation.implementationHead).toBe('5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa');
    expect(study.source.status).toBe('COMPLETE');
    expect(study.source.currentCampaignClassification).toBe('COMPLETE');
    expect(study.source.finalCloseoutCommit).toBe('04d6bd8e422103aa71be2b8f2672c2db97d0e351');
    expect(study.source.liveExecutionFrozen).toBe(true);
    expect(study.source.repositoryCurrentMustNotHotSwapLiveRun).toBe(true);
    expect(study.source.controlTowerHead).toMatch(sha40);
    expect(Number.isNaN(Date.parse(study.checkedAt))).toBe(false);
  });

  it('publishes the three experiments as one consistent ablation family without strengthening the causal claim', () => {
    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');
    expect(component).toContain('三组已完成 OpenEVO 实验');
    expect(component).toContain('paper-table--ablation');
    expect(component).toContain('普通 OpenEVO');
    expect(component).toContain('OpenEVO + Bounded Online Recurrence');
    expect(component).toContain('OpenEVO + Bounded Online Recurrence + β-gating（α=1）');
        expect(component).toContain('动态 α + 动态 β（未做）');
        expect(component).toContain("<th>{t('动态 β', 'Dynamic β')}</th>");
        expect(component).toContain("<th>{t('动态 α', 'Dynamic α')}</th>");
        expect(component).not.toContain("gdr: t('OpenEVO + Bounded Online Recurrence + GDR'");
    expect(study.threeWayFinal.directApply.score).toBeCloseTo(60.71597673160174, 10);
    expect(study.threeWayFinal.off.score).toBeCloseTo(45.984865395021635, 10);
    expect(study.threeWayFinal.on.score).toBeCloseTo(20.769142316017317, 10);
    expect(component).toContain('study.threeWayFinal.directApply.score.toFixed(2)');
    expect(component).toContain('study.threeWayFinal.off.score.toFixed(2)');
    expect(component).toContain('study.threeWayFinal.on.score.toFixed(2)');
    expect(component).toContain('跨 0');
    expect(component).not.toContain('Effective-State GDR 优于 Bounded');
    expect(component).not.toContain('Effective-State GDR beats Bounded');
  });

  it('binds the sealed formal result and completed lifecycle', () => {
    expect(study.formalResult.status).toBe('sealed');
    if (study.formalResult.status !== 'sealed') throw new Error('expected sealed formal result');
    expect(study.formalResult.sealedEvidence.scientificExecutionSha).toBe('a6f67b66e7d0fce0dc445890a68f9f0364da452a');
    expect(study.formalResult.trajectory.off).toHaveLength(160);
    expect(study.formalResult.trajectory.on).toHaveLength(160);
    expect(study.formalResult.pooledReward.delta).toBeCloseTo(0.025007099968405926, 12);
    expect(study.formalResult.uncertainty.low).toBeLessThan(0);
    expect(study.formalResult.uncertainty.high).toBeGreaterThan(0);
    expect(study.formalResult.finalPanel?.off).toBeCloseTo(45.984865395021635, 10);
    expect(study.formalResult.finalPanel?.on).toBeCloseTo(20.769142316017317, 10);
    expect(study.lifecycle.status).toBe('COMPLETE');
    expect(study.lifecycle.launchAuthority).toBe(false);
    expect(study.lifecycle.continuationAuthority).toBe(false);
    expect(study.lifecycle.formalRowsConsumed).toBe(40_960);
    expect(study.lifecycle.finalPanelAccessBeforeFinalEval).toBe(0);
    expect(study.lifecycle.finalPanelEvaluationsCompleted).toBe(2);
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
      trajectory: {
        off: [{ round: 0, score: 10, exactSuccessRate: 0.1, loss: 1.0 }],
        on: [{ round: 0, score: 11, exactSuccessRate: 0.1, loss: 0.9 }],
      },
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

  it('preserves the completed hardware exposure without treating it as live ownership', () => {
    expect(study.resourceExecution.physicalGpuIndices).toEqual([2, 4, 5, 6, 7]);
    expect(study.resourceExecution.schedulerMode).toContain('campaign released');
    expect(study.resourceExecution.rolloutMode).toContain('GPU6→GPU2');
    expect(study.resourceExecution.crossPhaseOverlapAllowed).toBe(true);
    expect(study.resourceExecution.liveResourceExecutionSha).toMatch(sha40);
    expect(study.resourceExecution.resourceAuthorityPr).toBe(525);
    expect(study.resourceExecution.resourceRepositoryCandidateSha).toBe('4305a70fd920caa81fd8f7636a45be2d0a8d3960');
    expect(study.resourceExecution.historicalVerifierPr).toBe(526);
    expect(study.resourceExecution.historicalVerifierDisposition).toBe('CLOSED_ABSORBED_INTO_525');
    expect(study.resourceExecution.claimBoundary).toContain('treatment/tasks/seeds/sampling');
  });

  it('binds the same-panel three-way final and keeps DirectApply outside the paired treatment contrast', () => {
    expect(study.threeWayFinal.sameFrozenPanel).toBe(true);
    expect(study.threeWayFinal.directApply.score).toBeCloseTo(60.71597673160174, 10);
    expect(study.threeWayFinal.off.score).toBeCloseTo(45.984865395021635, 10);
    expect(study.threeWayFinal.on.score).toBeCloseTo(20.769142316017317, 10);
    expect(study.threeWayFinal.boundary).toContain('not a third arm');
  });

  it('keeps trainer/transition speedup separate from whole-Stage2 wall-clock time', () => {
    expect(study.timingComparison.directApply.trainerHours).toBeCloseTo(31.087279689253773, 10);
    expect(study.timingComparison.off.transitionHours).toBeCloseTo(2.024057791739987, 10);
    expect(study.timingComparison.on.transitionHours).toBeCloseTo(2.345676467124269, 10);
    expect(study.timingComparison.boundary).toContain('not whole-Stage2 wall-clock');
  });

  it('publishes symmetric 160-round parameter diagnostics without treating norm size as efficacy', () => {
    expect(study.parameterAnalysis.coverage).toContain('17,920');
    expect(study.parameterAnalysis.off.fullToBaseSpectralRatioMedian).toBeCloseTo(1.000201829722446, 10);
    expect(study.parameterAnalysis.on.fullToBaseSpectralRatioMedian).toBeCloseTo(1.0001246314969383, 10);
  });

  it('publishes the read-only advisor diagnostics without upgrading them into causal evidence', () => {
    expect(study.posthocAnalysis.status).toBe('EXPLORATORY_READ_ONLY_POSTHOC');
    expect(study.posthocAnalysis.scientificAuthority).toBe(false);
    expect(study.posthocAnalysis.parameterScore.stateFroSpearmanRaw).toBeCloseTo(0.7203187041, 9);
    expect(study.posthocAnalysis.parameterScore.stateFroWithin20Pearson).toBeCloseTo(-0.0051929108, 9);
    expect(study.posthocAnalysis.directionMagnitudeR159.updateCosineOnOff).toBeCloseTo(-0.2869049545, 9);
    expect(study.posthocAnalysis.directionMagnitudeR159.updateNormRatioOnOff).toBeCloseTo(0.8885967055, 9);
    expect(study.posthocAnalysis.exploratoryAssociation.exactPermutationP).toBeGreaterThan(0.05);
    expect(study.posthocAnalysis.outputLength.linearConstraint.lateSteps).toBeGreaterThan(study.posthocAnalysis.outputLength.linearConstraint.midSteps);
    expect(study.posthocAnalysis.entropy.fullThreeWayTokenEntropyAvailable).toBe(false);
    expect(study.posthocAnalysis.stage1.qwen3OneP7bOpsdOptimizerSteps).toBe(11_198);
    expect(study.posthocAnalysis.gdr.betaControllerFeatures).toBe(22);
    expect(study.posthocAnalysis.gdr.controllerUsesTaskVector).toBe(false);

    expect(study.posthocAnalysis.behaviorEntropy.ordinaryEarly).toBeCloseTo(0.4895, 4);
    expect(study.posthocAnalysis.behaviorEntropy.gdrLate).toBeCloseTo(0.3705, 4);
    expect(study.posthocAnalysis.behaviorEntropy.validActionRate).toBe(1);

    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');
    expect(component).toContain('动机：SD-LoRA 越训练越慢');
    expect(component).toContain("import MathFormula from '../common/MathFormula.astro'");
    expect(component).toContain('\\operatorname{Compress}_{128}');
    expect(component).toContain('\\alpha_t S_{t-1}\\left(I-\\beta_t k_t k_t^{\\top}\\right)');
    expect(component).toContain('S_t^{(\\alpha=1,\\,\\beta\\text{-gate})}');
    expect(component).toContain('\\beta_t r_t k_t^{\\top}');
    expect(component).not.toContain('\\beta_t k_t r_t^{\\top}');
    expect(component).toContain('A\\mapsto sA');
    expect(component).toContain('Task Vector、范数和谱');
    expect(component).toContain('真正的 predictive token entropy 仍然不能从文本补出来');
    expect(component).toContain('下一问分成两层：先补动态 α，再研究 β 还该看什么');
    expect(component).toContain('“动态 α + 动态 β”尚未做，结果暂时留空');
    expect(component).toContain('study.posthocAnalysis.stage1.qwen3OneP7bOpsdOptimizerSteps.toLocaleString');
    expect(component).toContain('不能说“Task Vector / norm 越大，WebShop 就越好”');
    expect(component).toContain("import WandbEvidencePanel from './WandbEvidencePanel.astro'");
    expect(component).toContain('OpenEVO-1.7B-%C2%B7-%E4%B8%89%E7%BB%84%E5%AE%9E%E9%AA%8C%E5%88%86%E6%9E%90');
    expect(component).toContain('SD-LoRA training loss · 累计 rollout');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/loss-vs-rollout.svg');
    expect(component).not.toContain('paper-table--metric-guide');
    expect(component).toContain('每张图自己的解释和边界就放在图下面');
    expect(component).toContain('没有发生更新的轮次保持缺失，不做插值');
    const lossEvidence = JSON.parse(readFileSync(new URL('../../public/research/seed-openevo/evidence/wandb-threeway/loss-vs-rollout.json', import.meta.url), 'utf8'));
    expect(lossEvidence.rounds).toBe(160);
    expect(lossEvidence.rollouts_per_round).toBe(128);
    expect(lossEvidence.rows).toHaveLength(160);
    expect(lossEvidence.rows.at(-1)?.cumulative_rollouts).toBe(20_480);
    expect(lossEvidence.missing_loss_points).toEqual({ ordinary_openevo: 1, bounded: 2, bounded_gdr: 6 });
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
