import { BOUNDED_FORMAL_TRAJECTORY } from './boundedFormalTrajectory';

export type EffectiveStateSealedEvidence = {
  repository: 'mykcs/openevo-experiment';
  scientificExecutionSha: string;
  sealReceiptPath: string;
  sealReceiptSha256: string;
};

export type EffectiveStateRoundTrajectory = {
  round: number;
  score: number;
  exactSuccessRate: number;
  loss: number | null;
};

export type EffectiveStateFormalResult =
  | {
      status: 'pending';
      sealedEvidence: null;
      pooledReward: null;
      exactSuccess: null;
      uncertainty: null;
      trajectory: null;
      finalPanel: null;
      conclusion: null;
    }
  | {
      status: 'sealed';
      sealedEvidence: EffectiveStateSealedEvidence;
      pooledReward: { off: number; on: number; delta: number };
      exactSuccess: { off: number; on: number; delta: number };
      uncertainty: { label: string; low: number; high: number };
      trajectory: {
        off: readonly EffectiveStateRoundTrajectory[];
        on: readonly EffectiveStateRoundTrajectory[];
      };
      finalPanel: { label: string; off: number; on: number; offExactCount: number; onExactCount: number; offExactRate: number; onExactRate: number; panelDigest: string } | null;
      conclusion: string;
    };

const repo = 'https://github.com/mykcs/openevo-experiment';
const scienceExecutionGateSha = 'c5e012814bb9509deb0e2cbc8d57a63e2b56889f';
const formalExecutionCheckout = 'a6f67b66e7d0fce0dc445890a68f9f0364da452a';
const qualificationEvidenceSha = 'b41884ac90d185742dc47f240c4d54a3cfaf6175';
const evidenceRoot = `${repo}/blob/${qualificationEvidenceSha}/docs/evidence/bounded-recurrence-gdr-20260915`;

export const EFFECTIVE_STATE_GDR_LORA_STUDY = {
  checkedAt: '2026-09-18T23:10:00+08:00',
  source: {
    repository: 'mykcs/openevo-experiment',
    controlTowerPr: 502,
    controlTowerHead: '99dd0fdce328682fb0218aa084d3d2b0d0b7ae49',
    finalImplementationPr: 523,
    finalImplementationHead: 'fbdb21b2739ffeeca90e17eac83c14adb6087be2',
    formalExecutionCheckout,
    scientificExecutionSha: formalExecutionCheckout,
    scienceExecutionGateCodeFreeze: scienceExecutionGateSha,
    campaignId: '20260916-0255-bounded-effective-state-gdr',
    experimentId: '202609160255-bounded-effective-state-gdr',
    passportSha256: '5d9adea0312ea93f4a12fa561fae5fa5fa8bd8f0f5cbff7d86c7db51371b5e42',
    registrySha256: '9d07b2eff5a8eff6fa3471418bfadb96461aa638d28c118c3d66ae41cf13d999',
    carrierAdoptionIdentity: 'bdeacdd126f89dffa9ec8c31a12e20b7bbb9ae8367f2ff80b92e9c8e848ad0e4',
    campaignPreregParentScienceSha: 'de5b011035cfe907fee34c7b9a8ea961dd1e230d',
    authorityReconciliationRequired: false,
    preCampaignValidation: {
      scientificExecutionSha: qualificationEvidenceSha,
      implementationHead: '5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa',
      readySha256: '74233661885a033876b07a62df1a165f98d5109115f100418e2d5b084955aca9',
    },
    currentMainHandoffCommit: '9f6259be9b961223a5cab7711fe1f297e272d541',
    historicalImplementationPr: 497,
    historicalImplementationHead: '7847d6497ae58b7a82dc37cd1cf71ccfe44aa8df',
    status: 'COMPLETE',
    currentCampaignClassification: 'COMPLETE',
    finalCloseoutCommit: '04d6bd8e422103aa71be2b8f2672c2db97d0e351',
    originalRolloutProducerSha: '80bf263e9bf65fd0382f3c762e2a42b4928514a0',
    liveExecutionFrozen: true,
    repositoryCurrentMustNotHotSwapLiveRun: true,
  },
  lifecycle: {
    status: 'COMPLETE',
    formalRunLaunched: true,
    launchAuthority: false,
    continuationAuthority: false,
    armProgression: 'INDEPENDENT',
    pairingMode: 'ASYNC_AUDIT_ONLY',
    pairedReceiptsAdmissionAuthority: false,
    pairedReceiptsBlockArmProgression: false,
    sameWallClockCompletionRequired: false,
    ownerLaunchReleasePresent: true,
    ownerLaunchReleaseSha256: '7c6484f3629b149c6b4afe21f9dfa8d5c02bc789784386402d9fd04f2017aecb',
    sealedRolloutRecoverySha256: '6e0369b3880e6ae36223f9f5eed826582e73f02a1a72e7ec02d9ae78804c569b',
    carrierAdoptionIdentitySha256: 'bdeacdd126f89dffa9ec8c31a12e20b7bbb9ae8367f2ff80b92e9c8e848ad0e4',
    formalRowsConsumed: 40960,
    formalRowsDisclosure: 'both arms sealed 160 rounds × 128 rollouts = 20,480 formal rollouts per arm; paired Stage2 seal PASS',
    finalPanelAccessBeforeFinalEval: 0,
    finalPanelEvaluationsCompleted: 2,
    formalOutputRootExists: true,
    formalOutputRoot: '/data/home/wangr/workspace/runs/bounded-effective-state-gdr-recovery-1e7c4952-20260916',
    currentReadySha256: '3493da01babaf762acc7b6337d685ec86111df352ad7e180d7dfbc9f74576432',
    prelaunchReceiptsAreHistoricalAfterExecutionChange: true,
    prelaunchEvidence: {
      controllerInitOnlySha256: 'adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e',
      matchedDryRunSha256: '00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52',
      observabilityAdmissionSha256: '9a75be897bb518a4bcbbf4e2069e511662f994e1b5f46f8b3126eab38e1b199a',
      prelaunchZeroStateSealSha256: '7771ad89c0c400adaa23a27762766a043a3c928122f3cbfa8780101f6882ea03',
    },
  },
  resourceExecution: {
    physicalGpuIndices: [2, 4, 5, 6, 7] as const,
    schedulerMode: 'historical capacity-aware shared Ray pool; campaign released after closeout',
    rolloutMode: 'GPU4/GPU5/GPU7 covered all 160 rounds; the fourth rollout lane migrated GPU6→GPU2 at OFF R150 and ON R155',
    crossPhaseOverlapAllowed: true,
    liveResourceExecutionSha: '2133611ce751d04ba8f009b9d410fce4bc0cd3d6',
    resourceAuthorityPr: 525,
    resourceRepositoryCandidateSha: '4305a70fd920caa81fd8f7636a45be2d0a8d3960',
    historicalVerifierPr: 526,
    historicalVerifierDisposition: 'CLOSED_ABSORBED_INTO_525',
    claimBoundary: 'resource scheduling only; treatment/tasks/seeds/sampling/common start/Carrier/GDR policy/budget/analysis unchanged',
  },
  identity: {
    off: 'BOUNDED_OFF',
    on: 'EFFECTIVE_STATE_GDR_LORA_V1',
    commonStart: 'EMPTY_BOUNDED_HISTORY',
    boundedRank: 128,
    currentUpdateRank: 8,
    treatmentStart: 'Round0 first Stage2 optimizer update',
  },
  derivation: {
    firstGenerationFactorFailure: {
      betaC: 1.0523405381256283,
      betaA: 0.5071247662817098,
      status: 'BLOCKED_EMPTY_HISTORY_GDR_FIRST_TRANSITION_BETA_DOMAIN',
      meaning: 'factor-displacement-domain failure; not the original effective-beta gate',
    },
    mappingOnlyControllerFailure: {
      betaEffective: 657.8360748437726,
      status: 'FAIL_EFFECTIVE_WRITE_V2_BETA_POLICY_TRAJECTORY_DOMAIN',
      meaning: 'after fixing the mapping, the old factor-coordinate controller itself is outside the effective-beta domain',
    },
    representation: {
      symmetry: 'A -> sA, C -> C/s leaves the effective LoRA update C A^T unchanged',
      conclusion: 'GDR should control effective write/state; C/A are representation coordinates',
      sequentialWrite: 'C write -> actual C1 -> A write',
    },
    successor: {
      controller: '22-feature scalar-gauge-invariant beta policy',
      betaTarget: 'effective write magnitude',
      g: 0,
      retention: 1,
      forbiddenRuntimeInputs: {
        reward: false, score: false, taskVector: false, probe: false,
        futureState: false, finalPanel: false,
      },
    },
  },
  readiness: {
    gaugeInvariantPolicy: {
      status: 'PASS_GAUGE_INVARIANT_BETA_POLICY_V2',
      validationSpearman: 0.9788191768585606,
      heldoutSpearman: 0.9783382381899217,
      syntheticGaugeFeatureMaxAbsDiff: 7.262724199819104e-9,
    },
    round0PredictOnly: { status: 'PASS_ROUND0_PREDICT_ONLY', optimizerSteps: 65, writesApplied: 0 },
    isolatedExactStack: {
      status: 'PASS_EFFECTIVE_STATE_ISOLATED_EXACT_STACK',
      round0BetaMin: 1.6590857190385077e-6,
      round0BetaMax: 0.04607285230195468,
      round0DenseError: 3.5808603714113707e-6,
      nonemptyBetaMin: 6.586456032525531e-13,
      nonemptyBetaMax: 0.004016951923963068,
      round0ExactRepeatCount: 2,
      nonemptyExactRepeatCount: 2,
    },
    shortNonFinal: {
      status: 'PASS_EFFECTIVE_STATE_SHORT_NONFINAL', qualificationOnly: true, attemptsPerArm: 128,
      offMeanReward: 0.1596550888347763, onMeanReward: 0.1723575036075036,
      rewardDelta: 0.012702414772727294, offSuccessRate: 0.09375, onSuccessRate: 0.09375,
      claimBoundary: 'development-panel qualification only; not formal efficacy or fresh generalization',
    },
    stepTrace: {
      status: 'PASS_EFFECTIVE_STATE_GDR_STEP_TRACE_EXACT_EQUIVALENCE',
      round0Steps: 65, recurrentSteps: 130,
      round0PeakBeta: 0.04607285230195468, round0PeakBetaStep: 64,
      recurrentPeakBeta: 0.004016951923963068, recurrentPeakBetaStep: 1,
    },
    topology: { status: 'PASS_PREFERRED_4GPU_ZERO_FORMAL', formalRowsConsumed: 0 },
    finalPrelaunch: {
      status: 'HISTORICAL_PRELAUNCH_PASS_BEFORE_FORMAL_START',
      dryRunStatus: 'DRY_RUN_PASS_NO_FORMAL_TASKS',
      scienceFocusedTests: '47/47 PASS', carrierFocusedTests: '53/53 PASS', wandbFocusedTests: '17/17 PASS',
    },
  },
  formalDesign: {
    rounds: 160,
    rolloutsPerRoundPerArm: 128,
    formalRolloutsPerArm: 20480,
    horizon: 15,
    armProgression: 'OFF and ON are independent 160-round state machines; each arm depends on its own sealed predecessor and the frozen shared schedule',
    pairing: 'pair identities remain matched for audit and final analysis; pair receipts are asynchronous and never gate arm progression',
    matched: [
      { zh: '基础模型与 exact revision', en: 'base model + exact revision' },
      { zh: 'WebShop 任务顺序 / schedule position', en: 'WebShop task order / schedule positions' },
      { zh: '每个配对位置的 task identity', en: 'task identity at every matched position' },
      { zh: 'worker / generation seed 日程', en: 'worker / generation seed schedule' },
      { zh: 'sampling contract 与 horizon', en: 'sampling contract and horizon' },
      { zh: '完全相同的 treatment-start state identity', en: 'exact treatment-start state identity' },
      { zh: 'Bounded rank128 历史状态 + rank8 当前更新', en: 'Bounded rank128 historical state + rank8 current update' },
      { zh: 'replay policy 与 optimizer recipe', en: 'replay policy and optimizer recipe' },
      { zh: '每臂 rollout 与 optimizer-step 预算', en: 'per-arm rollout and optimizer-step budget' },
      { zh: 'WebShop environment / harness contract', en: 'WebShop environment / harness contract' },
      { zh: '冻结的 scientific execution SHA', en: 'frozen scientific execution SHA' },
      { zh: '配对身份仍按同一 schedule position 对齐，但两条臂不要求同一墙钟时间完成同一轮', en: 'pair identities stay aligned by schedule position, but the two arms do not need to finish the same round at the same wall-clock time' },
    ] as const,
    onlyTreatmentDifference: 'Effective-State GDR write on ON',
    treatmentTiming: {
      round0Rollout: 'pre-treatment behavior from exact common start',
      firstPostTreatmentBehavior: 'Round1 rollout',
    },
    analysis: {
      primary: 'R1-R159 post-treatment mean WebShop reward delta',
      secondary: ['R1-R159 exact success', 'all-160 mean reward', 'all-160 exact success'] as const,
      uncertainty: 'paired circular moving-block bootstrap over rounds',
      blockLengthRounds: 8,
      replicates: 50000,
      seed: 20260914,
    },
    finalPanel: 'locked during formal Stage2',
    carrierContract: 'same Completion-First Carrier Contract v2 on both arms; one primary plus at most one repair; fully evidenced content rejection keeps prior bytes and continues',
    rewardControl: 'reward cannot control admission, order, early stop, or treatment mutation',
    failClosed: {
      round0MissingUpdate: 'OWNER_DECISION_REQUIRED; no synthetic S1',
      recurrentMissingUpdate: 'keep prior rank128 state/replay; advance the same arm logical-history identity; no GDR event',
      carrierContentRejection: 'fully evidenced fixed-budget rejection -> KEEP_PRIOR / CONTENT_REJECTION_NOOP / continue; no third call',
      integrityUncertainty: 'pause/fail closed; resource loss alone is never proof of zero scientific side effect',
      finalPanelWithoutAuthority: 'locked',
    },
    resultSlots: [
      '160-round pooled mean reward: OFF / ON / delta',
      '160-round exact success: OFF / ON / delta / percentage-point delta',
      'preregistered matched uncertainty / bootstrap / CI',
      'full 160-round OFF/ON score, exact-success and SD-LoRA loss trajectories after sealed cutoff',
      'engineering-invalid / invalid-action termination / denominator accounting',
      'state/update health: current update, GDR beta domain, content-rejection NOOP / integrity-pause accounting',
      'final-panel result only with independent authority and sealed evidence',
      'final claim boundary: supported and unsupported claims',
    ] as const,
  },
  observability: {
    mode: 'offline-sidecar', readOnly: true, failOpen: true, scientificAuthority: false,
    sourceOfTruth: 'sealed scientific receipts and adapters',
    recordedFamilies: [
      'WebShop score / success / invalid / task-level breakdown', 'loss / coefficient / replay',
      'per-optimizer-step GDR beta aggregates and effective-write diagnostics',
      'LoRA C/A summaries and gauge-invariant C A^T state telemetry', 'Carrier flags',
      'CPU / RAM / disk / GPU utilization / VRAM / power / temperature / topology',
    ] as const,
    canonicalCloudRule: 'rebuild a fresh clean snapshot from sealed receipts before final sync',
  },
  evidence: {
    firstGenerationFactorFailure: `${evidenceRoot}/empty-history-on-first-transition-failure-20260915T110000.json`,
    mappingOnlyControllerFailure: `${evidenceRoot}/effective-write-v2-round0-beta-policy-failure-202609151300.json`,
    gaugeInvariantPolicy: `${evidenceRoot}/gauge-invariant-beta-policy-v2-qualification-202609151330.json`,
    round0PredictOnly: `${evidenceRoot}/effective-state-round0-predict-only-receipt-202609151410.json`,
    isolatedExactStack: `${evidenceRoot}/effective-state-isolated-202609151445/result.json`,
    shortNonFinal: `${evidenceRoot}/short-nonfinal-effective-state-202609151350/execution/result.json`,
    stepTrace: `${repo}/blob/5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa/docs/evidence/bounded-recurrence-gdr-20260915/gdr-step-trace-qualification-202609152040/result.json`,
    historicalTopologyCloseout: `${repo}/blob/5e1b6a2d6737be540ac9ae69dedcfb8b63a51baa/docs/evidence/bounded-recurrence-gdr-20260915/preferred-topology-closeout-202609150718.json`,
    controlTowerPr: `${repo}/pull/502`,
    finalImplementationPr: `${repo}/pull/523`,
    resourceAuthorityPr: `${repo}/pull/525`,
    historicalResourceVerifierPr: `${repo}/pull/526`,
    finalCloseout: `${repo}/blob/04d6bd8e422103aa71be2b8f2672c2db97d0e351/docs/evidence/bounded-effective-state-final-closeout-20260918/FINAL_CLOSEOUT.json`,
    finalComparison: `${repo}/blob/04d6bd8e422103aa71be2b8f2672c2db97d0e351/docs/evidence/bounded-effective-state-final-closeout-20260918/FINAL_COMPARISON.json`,
    longHorizon: `${repo}/blob/04d6bd8e422103aa71be2b8f2672c2db97d0e351/docs/evidence/bounded-effective-state-final-closeout-20260918/LONG_HORIZON_ANALYSIS.json`,
    resourceAnalysis: `${repo}/blob/04d6bd8e422103aa71be2b8f2672c2db97d0e351/docs/evidence/bounded-effective-state-final-closeout-20260918/STAGE2_GPU_RESOURCE_ANALYSIS.json`,
    q17Final: `${repo}/blob/04d6bd8e422103aa71be2b8f2672c2db97d0e351/docs/evidence/q17-final-closeout-20260912/FINAL_EVAL_VERIFICATION.json`,
    publicSnapshot: '/research/seed-openevo/evidence/bounded-effective-state-final-snapshot-20260918.json',
    currentMainPrelaunchHandoff: `${repo}/blob/9f6259be9b961223a5cab7711fe1f297e272d541/docs/agent-handoffs/BOUNDED_GDR_WANDB_PRELAUNCH_HANDOFF_2026-09-15.md`,
  },
  threeWayFinal: {
    sameFrozenPanel: true,
    panelContentSha256: '3529b94f97491434da01f9b2adc2faf1d0571545603a788d367561ae2b529d48',
    panelFileSha256: 'aea97afdd5b176126cf67f7ed315189c95fbf37b07263c84b947903cca69aa4d',
    panelDigest: 'cd531caff21d13d72df5c6fb013fadc10457393134d8bc3bcdc63fadf76bc453',
    directApply: { score: 60.71597673160174, exactCount: 50, exactRate: 0.390625 },
    off: { score: 45.984865395021635, exactCount: 32, exactRate: 0.25 },
    on: { score: 20.769142316017317, exactCount: 10, exactRate: 0.078125 },
    boundary: 'DirectApply is a historical predecessor on the same frozen 128-task panel, not a third arm of the preregistered OFF-vs-ON treatment contrast',
  },
  timingComparison: {
    directApply: { trainerHours: 31.087279689253773, wallClockHours: 74.77710828602314, rolloutGpuActiveHours: 76.65479753295581 },
    off: { transitionHours: 2.024057791739987, wallClockHours: 56.24978798992104, rolloutGpuActiveHours: 82.53728786057896, gpuActiveLowerBoundHours: 84.56134565231895 },
    on: { transitionHours: 2.345676467124269, wallClockHours: 54.96929190225072, rolloutGpuActiveHours: 78.300783249206, gpuActiveLowerBoundHours: 80.64645971633028 },
    boundary: 'trainer/transition speedup is not whole-Stage2 wall-clock speedup',
  },
  parameterAnalysis: {
    off: {
      finalStateFrobenius: 21.050718206060306,
      finalStateMaxSpectral: 2.136322021484375,
      finalTaskVectorFrobenius: 0.599323675851958,
      finalTaskVectorMaxSpectral: 0.058013759553432465,
      parameterStabilityP95: 11.053011603233955,
      fullToBaseSpectralRatioMedian: 1.000201829722446,
      participationRankMedian: 5.1554897382096145,
      rank95Median: 8,
    },
    on: {
      finalStateFrobenius: 17.92532067595396,
      finalStateMaxSpectral: 1.9457811117172241,
      finalTaskVectorFrobenius: 0.5325478794098215,
      finalTaskVectorMaxSpectral: 0.05551622435450554,
      parameterStabilityP95: 11.051993361363486,
      fullToBaseSpectralRatioMedian: 1.0001246314969383,
      participationRankMedian: 4.880467418793721,
      rank95Median: 7,
    },
    coverage: '160 rounds × 112 q/k/v/o LoRA modules = 17,920 module-round rows per arm; read-only post-hoc',
  },
  posthocAnalysis: {
    status: 'EXPLORATORY_READ_ONLY_POSTHOC',
    scientificAuthority: false,
    gpuUsed: false,
    snapshot: '/research/seed-openevo/evidence/bounded-effective-state-advisor-analysis-20260919.json',
    wandbWorkspace: 'https://wandb.ai/zju-openevo-wangrui/zju-openevo-experiments?nw=aq3kg4ro7rf',
    parameterScore: {
      stateFroSpearmanRaw: 0.7203187040892476,
      stateFroWithin20Pearson: -0.005192910826452355,
      taskVectorSpearmanRaw: 0.5973866166647135,
      taskVectorWithin20Pearson: 0.044898299319663375,
      taskVectorFuture5Beta: -0.15540785205401592,
      taskVectorFuture5Ci95: [-0.2779314881545027, 0.043872949567619224] as const,
    },
    directionMagnitudeR159: {
      updateCosineOnOff: -0.2869049545428405,
      updateNormRatioOnOff: 0.8885967054679342,
      stateCosineOnOff: 0.35726423308613736,
      stateNormRatioOnOff: 0.8515301302462014,
      lateLayerUpdateCosineMean: -0.37233185811086655,
    },
    exploratoryAssociation: {
      stateNormRatioFuture5GapSpearman: -0.6190476190476191,
      anchorCount: 8,
      exactPermutationP: 0.11498015873015872,
    },
    outputLength: {
      ordinary: { earlyStepTokens: 43.33998502988982, lateStepTokens: 26.349412672288654, earlySteps: 9.803955078125, lateSteps: 6.926025390625 },
      bounded: { earlyStepTokens: 50.86332454641171, lateStepTokens: 28.413994410808378, earlySteps: 9.166259765625, lateSteps: 7.544921875 },
      linearConstraint: { midStepTokens: 29.50113782295178, lateStepTokens: 28.393542405944757, midSteps: 7.907958984375, lateSteps: 8.60205078125, midScore: 0.6011636744467552, lateScore: 0.5681677827380951 },
    },
    entropy: {
      fullThreeWayTokenEntropyAvailable: false,
      reason: 'formal rollout history did not persist per-token logits/logprobs',
      q17LocalDiagnosticOnly: true,
    },
    stage1: {
      seedUsesHindsightSkillSft: true,
      openEvoUsesOpsdBootstrap: true,
      qwen3OneP7bOpsdOptimizerSteps: 11198,
      qwen3OneP7bOpsdRelease: 'https://github.com/mykcs/openevo-experiment/blob/28c463749b29f0082b136c0f096836c470e10b23/configs/experiment/campaigns/202609030400/releases/qwen3-1p7b-stage1c-opsd.json',
    },
    gdr: {
      betaControllerFeatures: 22,
      controllerUsesReward: false,
      controllerUsesTaskScore: false,
      controllerUsesTaskVector: false,
      interpretation: 'adaptive to local optimizer/factor state, not adaptive to task utility',
    },
  },
  formalResult: {
    status: 'sealed',
    sealedEvidence: {
      repository: 'mykcs/openevo-experiment',
      scientificExecutionSha: 'a6f67b66e7d0fce0dc445890a68f9f0364da452a',
      sealReceiptPath: 'docs/evidence/bounded-effective-state-final-closeout-20260918/FORMAL_MATCHED_STAGE2_SEALED_ASYNC.json',
      sealReceiptSha256: 'e3486f1a2a31d02c88e02ce8380c9ab679ffa65afcbaeb021f208bce03e284ef',
    },
    pooledReward: { off: 0.47774638937669595, on: 0.5027534893451019, delta: 0.025007099968405926 },
    exactSuccess: { off: 0.19467374213836477, on: 0.172562893081761, delta: -0.022110849056603772 },
    uncertainty: {
      label: 'R1–R159 reward Δ · 95% moving-block bootstrap CI',
      low: -0.01331300583840575,
      high: 0.06634168469000419,
    },
    trajectory: BOUNDED_FORMAL_TRAJECTORY,
    finalPanel: {
      label: 'same frozen 128-task final · Task Score / 100',
      off: 45.984865395021635,
      on: 20.769142316017317,
      offExactCount: 32,
      onExactCount: 10,
      offExactRate: 0.25,
      onExactRate: 0.078125,
      panelDigest: 'cd531caff21d13d72df5c6fb013fadc10457393134d8bc3bcdc63fadf76bc453',
    },
    conclusion: 'LONG_HORIZON_TRANSIENT_ONLY',
  } satisfies EffectiveStateFormalResult,
} as const;
