export type EffectiveStateSealedEvidence = {
  repository: 'mykcs/openevo-experiment';
  scientificExecutionSha: string;
  sealReceiptPath: string;
  sealReceiptSha256: string;
};

export type EffectiveStateFormalResult =
  | {
      status: 'pending';
      sealedEvidence: null;
      pooledReward: null;
      exactSuccess: null;
      uncertainty: null;
      finalPanel: null;
      conclusion: null;
    }
  | {
      status: 'sealed';
      sealedEvidence: EffectiveStateSealedEvidence;
      pooledReward: { off: number; on: number; delta: number };
      exactSuccess: { off: number; on: number; delta: number };
      uncertainty: { label: string; low: number; high: number };
      finalPanel: { label: string; off: number; on: number } | null;
      conclusion: string;
    };

const repo = 'https://github.com/mykcs/openevo-experiment';
const scienceExecutionGateSha = 'c5e012814bb9509deb0e2cbc8d57a63e2b56889f';
const formalExecutionCheckout = '80bf263e9bf65fd0382f3c762e2a42b4928514a0';
const qualificationEvidenceSha = 'b41884ac90d185742dc47f240c4d54a3cfaf6175';
const evidenceRoot = `${repo}/blob/${qualificationEvidenceSha}/docs/evidence/bounded-recurrence-gdr-20260915`;

export const EFFECTIVE_STATE_GDR_LORA_STUDY = {
  checkedAt: '2026-09-16T14:09:00+08:00',
  source: {
    repository: 'mykcs/openevo-experiment',
    controlTowerPr: 502,
    controlTowerHead: '99dd0fdce328682fb0218aa084d3d2b0d0b7ae49',
    finalImplementationPr: 510,
    finalImplementationHead: '52dc699d5bccc1a75adc7a4e7a863ca58148eb93',
    formalExecutionCheckout,
    scientificExecutionSha: formalExecutionCheckout,
    scienceExecutionGateCodeFreeze: scienceExecutionGateSha,
    campaignId: '20260916-0255-bounded-effective-state-gdr',
    experimentId: '202609160255-bounded-effective-state-gdr',
    passportSha256: '5d9adea0312ea93f4a12fa561fae5fa5fa8bd8f0f5cbff7d86c7db51371b5e42',
    registrySha256: '9d07b2eff5a8eff6fa3471418bfadb96461aa638d28c118c3d66ae41cf13d999',
    carrierAdoptionIdentity: '274123dde66547d5d5ba68b5c8b75c0205a75191ce3c1c471a606d589ac5250b',
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
    status: 'FORMAL_RUNNING',
    currentCampaignClassification: 'FORMAL_RUNNING',
    liveExecutionFrozen: true,
    repositoryCurrentMustNotHotSwapLiveRun: true,
  },
  lifecycle: {
    status: 'FORMAL_RUNNING',
    formalRunLaunched: true,
    launchAuthority: true,
    ownerLaunchReleasePresent: true,
    ownerLaunchReleaseSha256: '8c68c58dd45bc7216829d606eb5d5aaaa0db7855141306dafbec9cf6dcf1140f',
    formalRowsConsumed: null,
    formalRowsDisclosure: 'run is active; exact in-flight denominator is not a formal-result authority',
    finalPanelAccess: 0,
    formalOutputRootExists: true,
    formalOutputRoot: '/data/home/wangr/workspace/runs/bounded-effective-state-gdr-formal-80bf263e-20260916',
    currentReadySha256: 'db3087ec8d8269f99b60cd1ff1511ed825e1a4ad6ffc96388f3c7ca27c70413d',
    prelaunchReceiptsAreHistoricalAfterExecutionChange: true,
    prelaunchEvidence: {
      controllerInitOnlySha256: 'adb861f8797c0b75f549e88865bdff651e8ac35230e39b0bc36d0be438150f4e',
      matchedDryRunSha256: '00f7f3284bc67568e4552906cd95c9e91cbfd14800d828444f221c439e835b52',
      observabilityAdmissionSha256: '9a75be897bb518a4bcbbf4e2069e511662f994e1b5f46f8b3126eab38e1b199a',
      prelaunchZeroStateSealSha256: '7771ad89c0c400adaa23a27762766a043a3c928122f3cbfa8780101f6882ea03',
    },
  },
  resourceExecution: {
    physicalGpuIndices: [4, 5, 6, 7] as const,
    workersPerGpu: 2,
    rolloutMode: 'one OFF + one ON worker per physical GPU',
    postRolloutGpu: 4,
    crossPhaseOverlapAllowed: false,
    resourceSuccessorSha256: 'd272e022bb6dade53dc6165a274872f319de06ae3504ce07ec85d74d8d79907f',
    claimBoundary: 'resource-lane migration only; treatment/tasks/seeds/sampling/common start/Carrier/GDR policy/budget/analysis unchanged',
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
    roundBarrier: 'OFF+ON rollout concurrent -> OFF post-rollout -> ON post-rollout -> matched barrier -> round r+1',
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
      { zh: 'round barrier：两臂 rollout 并发 → OFF/ON post-rollout 串行 → 两臂 seal 后进 r+1', en: 'round barrier: concurrent OFF/ON rollouts -> serialized post-rollout -> both sealed before r+1' },
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
    carrierContract: 'same Carrier Contract v2 mechanism on both arms; realized bytes may diverge only after treatment evidence diverges',
    rewardControl: 'reward cannot control admission, order, early stop, or treatment mutation',
    failClosed: {
      round0MissingUpdate: 'OWNER_DECISION_REQUIRED; no synthetic S1',
      recurrentMissingUpdate: 'keep prior rank128 state/replay; advance matched logical-history identity; no GDR event',
      carrierHealthFailure: 'pause only at a sealed round boundary; never mutate treatment automatically',
      finalPanelWithoutAuthority: 'locked',
    },
    resultSlots: [
      '160-round pooled mean reward: OFF / ON / delta',
      '160-round exact success: OFF / ON / delta / percentage-point delta',
      'preregistered matched uncertainty / bootstrap / CI',
      'full 160-round per-round trajectory after sealed cutoff',
      'engineering-invalid / invalid-action termination / denominator accounting',
      'state/update health: current update, GDR beta domain, Carrier Health pauses',
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
    finalImplementationPr: `${repo}/pull/510`,
    currentMainPrelaunchHandoff: `${repo}/blob/9f6259be9b961223a5cab7711fe1f297e272d541/docs/agent-handoffs/BOUNDED_GDR_WANDB_PRELAUNCH_HANDOFF_2026-09-15.md`,
  },
  formalResult: {
    status: 'pending',
    sealedEvidence: null,
    pooledReward: null,
    exactSuccess: null,
    uncertainty: null,
    finalPanel: null,
    conclusion: null,
  } satisfies EffectiveStateFormalResult,
} as const;
