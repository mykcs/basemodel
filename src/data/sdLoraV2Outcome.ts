export const SD_LORA_V2_PUBLICATION_SOURCE = {
  repository: 'mykcs/openevo-experiment',
  branch: 'research/sd-lora-v2-stable-reduction-202609131200',
  commit: '0bf76b5a04d0429da52998fcb05cf30848d05198',
  strictCloseoutPath: 'docs/evidence/q17-sd-lora-backward-aware-202609130955/ENGINEERING_CLOSEOUT.md',
  v2PlanPath: 'docs/experiment-tracking/SD_LORA_V2_STABLE_REDUCTION_PLAN_20260913.md',
  v2ComparisonPath: 'docs/evidence/sd-lora-v2-stable-reduction-20260913/V2_COMPARISON.json',
  v3CloseoutPath: 'docs/evidence/sd-lora-v2-stable-reduction-20260913/v3-valid-eval-v2/V3_CLOSEOUT_RECEIPT.json',
} as const;

export const SD_LORA_STRICT_ACCELERATION = {
  vanillaSeconds: 969.17,
  fastBatchedSeconds: 352.12,
  speedup: 969.17 / 352.12,
  disposition: 'NO_STRICT_SUCCESSOR',
  decisiveGate: 'Candidate A v3 failed B0 while the known-good control stayed bitwise exact.',
} as const;

export const SD_LORA_V2_LOCAL = {
  name: 'stable-fp32-reducer-c16',
  chunkSize: 16,
  localGemmDtype: 'BF16',
  crossComponentReductionDtype: 'FP32',
  syntheticSpeedup2048: 2.538,
  syntheticSpeedup1024: 2.465,
  referenceEightStepSeconds: 105.11307090613991,
  v2EightStepSeconds: 52.28121632896364,
  eightStepSpeedup: 105.11307090613991 / 52.28121632896364,
  optimizerSteps: 8,
  currentExamples: 47,
  replayExamples: 47,
  priorTensorCount: 33152,
  lossTraceRmsRelative: 0.014600732205485698,
  finalCurrentBRmsRelative: 0.36463803125005634,
} as const;
export const SD_LORA_V2_WEBSHOP = {
  taskCount: 16,
  rolloutsPerTask: 8,
  attemptsPerArm: 128,
  referenceMeanReward: 0.29605034722222223,
  v2MeanReward: 0.30789930555555556,
  meanRewardDelta: 0.011848958333333326,
  referenceSuccessRate: 0.1015625,
  v2SuccessRate: 0.109375,
  successRateDelta: 0.0078125,
  pairedPositive: 8,
  pairedTie: 117,
  pairedNegative: 3,
  referenceInvalidActionTerminations: 72,
  v2InvalidActionTerminations: 71,
  engineeringInvalidPerArm: 0,
  status: 'V2_WEBSHOP_QUALIFIED',
} as const;

export const SD_LORA_V2_BOUNDARIES = [
  '不代表 SD-LoRA v2 与 Vanilla 在所有行为上全局等价。',
  '不代表 v2 在统计意义上显著优于 Vanilla。',
  '没有打开 protected final panel，因此不是 final-panel 结论。',
  '没有做 GDR 对照，因此不能说 v2 比 GDR 更好。',
  '这不是 formal Q17 的替代结果。',
] as const;
