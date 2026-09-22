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
    expect(component).toContain('三个 OpenEVO 实验');
    expect(component).toContain('paper-table--ablation');
    expect(component).toContain('普通 OpenEVO');
    expect(component).toContain('OpenEVO + Bounded Online Recurrence');
    expect(component).toContain('OpenEVO + Bounded Online Recurrence + β-gating（α 固定为 1）');
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
    expect(component).toContain('const seedPaperWebShopScore = 87.1');
    expect(component).toContain('const seedPaperWebShopSuccess = 77.3');
    expect(component).toContain('id="ablation-table-caption"');
    expect(component).toContain('SEED（论文，Qwen3-1.7B）');
    expect(component).toContain('不是我们三条 OpenEVO 最终模型共用的同一冻结 128 题');
    expect(component).not.toContain('paper-table__experiment-note');
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

  it('publishes the 160-round carrier lifecycle without equating UPDATE frequency with runtime use', () => {
    const carriers = study.carrierAnalysis;
    expect(carriers.ordinary.parameterState).toMatchObject({ updates: 159, noops: 1 });
    expect(carriers.ordinary.textMemory).toMatchObject({ updates: 2, noops: 158, updateRounds: [7, 95] });
    expect(carriers.ordinary.skillBundle).toMatchObject({ updates: 1, noops: 159, updateRounds: [0] });
    expect(carriers.ordinary.agentSystem).toMatchObject({ updates: 3, noops: 157, updateRounds: [41, 115, 148] });
    expect(carriers.ordinary.runtimeReadback.recordedEnvironmentSteps).toBe(184_478);
    expect(carriers.ordinary.runtimeReadback.skillBundle.selected).toBe(42_270);
    expect(carriers.ordinary.runtimeReadback.textMemory.selected).toBe(142_208);
    expect(carriers.ordinary.runtimeReadback.agentSystem.selected).toBe(175_820);

    expect(carriers.bounded.parameterState).toMatchObject({ updates: 158, noops: 2 });
    expect(carriers.bounded.textMemory).toMatchObject({ updates: 3, noops: 157 });
    expect(carriers.bounded.skillBundle).toMatchObject({ updates: 0, noops: 160 });
    expect(carriers.bounded.agentSystem).toMatchObject({ updates: 0, noops: 160 });
    expect(carriers.bounded.producerModelCalls).toEqual({ textMemory: 72, skillBundle: 320, agentSystem: 320 });

    expect(carriers.betaGating.parameterState).toMatchObject({ updates: 154, noops: 6 });
    expect(carriers.betaGating.textMemory).toMatchObject({ updates: 2, noops: 158 });
    expect(carriers.betaGating.skillBundle).toMatchObject({ updates: 0, noops: 160 });
    expect(carriers.betaGating.agentSystem).toMatchObject({ updates: 0, noops: 160 });
    expect(carriers.betaGating.producerModelCalls).toEqual({ textMemory: 22, skillBundle: 320, agentSystem: 320 });
    expect(carriers.boundary).toContain('not runtime-use');
    expect(study.evidence.q17CarrierAudit).toContain('240c479bead0450def3feaaa2a169d9a2bc3934c');

    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');
    expect(component).toContain('随着 rollout 积累，参数和非参数状态都会在满足条件时更新');
    expect(component).toContain('参数什么时候变：');
    expect(component).toContain('Text Memory 什么时候变：');
    expect(component).toContain('Skill Bundle 什么时候变：');
    expect(component).toContain('Agent System 什么时候变：');
    expect(component).toContain('至少得到 2 个不同任务的证据支持');
    expect(component).toContain('至少需要 3 个不同任务共同支持');
    expect(component).toContain('selected=true，可以直接理解成');
    expect(component).toContain('不能据此说参数一定比非参数状态更重要');
    expect(component).toContain('Completion-First Carrier Contract v2');
    expect(component).toContain('study.evidence.q17CarrierAudit');
  });

  it('keeps the public study definition-first before results and interpretation', () => {
    const component = readFileSync(new URL('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro', import.meta.url), 'utf8');

    expect(component).toContain('Bounded Online Recurrence 是什么：用固定 rank128 保存参数历史');
    expect(component).toContain('Gated Delta 是什么：根据 residual 控制一次新状态写入');
    expect(component).toContain('这里的“映射”是什么：把更新规则对应到 OpenEVO 参数 State');
    expect(component).toContain('为什么控制的是有效参数更新 ΔW，而不是 LoRA 的 A / C 数值');

    expect(component).toContain('Task Score 是什么：每轮任务完成程度的连续得分');
    expect(component).toContain('每 20 轮平均是什么：把连续 20 轮的 Task Score 合成一个均值');
    expect(component).toContain('最后 20 轮平均和固定终评分别是什么');
    expect(component).toContain('训练期正式对照是什么：在同一实验设置下比较 Bounded 与 β-gating');
    expect(component).toContain('计算代价是什么：区分参数更新耗时和整个 Stage 2 耗时');

    const lossWhat = component.indexOf("① 指标是什么");
    const lossResult = component.indexOf("② 这次实验的结果");
    const lossAnalysis = component.indexOf("③ 分析");
    expect(lossWhat).toBeGreaterThan(-1);
    expect(lossResult).toBeGreaterThan(lossWhat);
    expect(lossAnalysis).toBeGreaterThan(lossResult);

    expect(component).toContain('Task Vector 就是一轮参数更新前后模型参数的差值');
    expect(component).toContain('这里的 entropy 衡量模型使用不同有效动作类型时有多分散');
    expect(component).not.toContain('从 linear attention 的“记忆写入”借一个规则');
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
    expect(component).toContain('实验结果：Task Score、成功率与计算代价');
    expect(component).toContain('训练过程中发生了什么？从 loss 到行为变化');
    expect(component).toContain('4.1');
    expect(component).toContain('每 20 轮平均');
    expect(component).toContain('5.1 loss');
    expect(component).toContain('5.2');
    expect(component).toContain('范数：长期 State 和本轮更新到底有多大');
    expect(component).toContain('5.3 Task Vector');
    expect(component).toContain('谱与方向');
    expect(component).toContain('full/base spectral ratio 把更新后完整权重的最大 spectral norm 除以 base 权重的对应值');
    expect(component).toContain('输出长度与任务步数');
    expect(component).toContain('5.6 Entropy');
    expect(component).toContain('5.7');
    expect(component).toContain('我们现在能解释到哪里？');
    expect(component).toContain('① 指标是什么');
    expect(component).toContain('② 这次实验的结果');
    expect(component).toContain('③ 分析');
    expect(component).toContain('动态 α + 动态 β：尚未运行');
    expect(component).toContain('study.posthocAnalysis.stage1.qwen3OneP7bOpsdOptimizerSteps.toLocaleString');
    expect(component).toContain("import MetricEvidenceFigure from './MetricEvidenceFigure.astro'");
    expect(component).not.toContain("import WandbEvidencePanel from './WandbEvidencePanel.astro'");
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/task-score.svg');
    expect(component).toContain("linkText: t('打开 W&B Report ↗', 'Open W&B Report ↗')");
    expect(component).toContain('本页统一使用 Task Score / 100');
    const taskScoreSvg = readFileSync(new URL('../../public/research/seed-openevo/evidence/wandb-threeway/task-score.svg', import.meta.url), 'utf8');
    expect(taskScoreSvg).toContain('>0</text>');
    expect(taskScoreSvg).toContain('>100</text>');
    expect(taskScoreSvg).not.toContain('>1.00</text>');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/task-score-20-round-mean.svg');
    expect(component).toContain('SD-LoRA training loss · 累计 rollout');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/loss-vs-rollout.svg');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/task-vector-frobenius.svg');
    expect(component).toContain('每条 160 个点');
    expect(component).toContain('横轴密度和 y 轴量程完全一致');
    expect(component).toContain('相关性统计只针对普通 OpenEVO');
    expect(component).toContain('普通 OpenEVO：去掉 20 轮窗口共同训练趋势后的 Pearson');
    expect(component).toContain('Task Score / 100');
    expect(component).toContain('R159 click 占比');
    expect(component).not.toContain('</section>\\n\\n  <section');
    const taskVectorSvg = readFileSync(new URL('../../public/research/seed-openevo/evidence/wandb-threeway/task-vector-frobenius.svg', import.meta.url), 'utf8');
    const taskVectorSeries = [...taskVectorSvg.matchAll(/<polyline[^>]*points=\"([^\"]+)\"/g)].map((match) => match[1]!.trim().split(/\s+/));
    expect(taskVectorSeries.map((series) => series.length)).toEqual([160, 160, 160]);
    const taskVectorY = taskVectorSeries.flat().map((point) => Number(point.split(',')[1]));
    expect(Math.min(...taskVectorY)).toBeGreaterThanOrEqual(90);
    expect(Math.max(...taskVectorY)).toBeLessThanOrEqual(585);
    expect(taskVectorSvg).toContain('>0.00</text>');
    expect(taskVectorSvg).toContain('>2.50</text>');
    expect(taskVectorSvg).not.toContain('>-0.10</text>');
    expect(taskVectorSvg).not.toContain('<circle');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/tokens-per-step.svg');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/steps-per-episode.svg');
    expect(component).toContain('/research/seed-openevo/evidence/wandb-threeway/action-family-entropy.svg');
    expect(component).not.toContain('id="wandb"');

    const scoreWindows = JSON.parse(readFileSync(new URL('../../public/research/seed-openevo/evidence/wandb-threeway/task-score-20-round-mean.json', import.meta.url), 'utf8'));
    expect(scoreWindows.rows).toHaveLength(8);
    expect(scoreWindows.rows[0].window).toBe('R0–19');
    expect(scoreWindows.rows.at(-1)?.window).toBe('R140–159');
    expect(scoreWindows.rows.at(-1)?.ordinary).toBeCloseTo(67.07, 2);
    expect(scoreWindows.rows.at(-1)?.bounded).toBeCloseTo(64.33, 2);
    expect(scoreWindows.rows.at(-1)?.beta).toBeCloseTo(54.28, 2);

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
