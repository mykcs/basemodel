export const SD_LORA_SCALING_SOURCE = {
  repository: 'mykcs/openevo-experiment',
  branch: 'research/sd-lora-latency-profile-202609112003',
  commit: '80145bc38aa76afa0607a48fca525ac0cfb5f596',
  evidencePath: 'docs/evidence/q17-sd-lora-latency-202609112003/',
  scalingSummaryPath: 'docs/evidence/q17-sd-lora-latency-202609112003/scaling/component-scaling-summary.json',
  checkedAt: '2026-09-12',
} as const;

export const SD_LORA_FIXED_WORKLOAD = {
  model: 'Qwen3-1.7B',
  currentExamples: 47,
  replayExamples: 47,
  optimizerSteps: 94,
  batchSize: 1,
  dtype: 'BF16',
  rankPerComponent: 8,
  targets: 'q/k/v/o',
  gradientCheckpointing: true,
} as const;
export const SD_LORA_SCALING_POINTS = [
  { k: 1, trainer: 44.0458693341, forward: 10.1731296234, backward: 24.6346825562, kind: 'synthetic' },
  { k: 32, trainer: 248.4977676007, forward: 61.1632492676, backward: 162.4571563721, kind: 'synthetic' },
  { k: 64, trainer: 417.9571227729, forward: 104.3090938721, backward: 287.4085285645, kind: 'synthetic' },
  { k: 128, trainer: 803.8778089201, forward: 203.2603552246, backward: 559.0183408203, kind: 'synthetic' },
  { k: 148, trainer: 969.1709041460, forward: 241.5460744629, backward: 677.7445908203, kind: 'sealed-r149' },
] as const;

export const SD_LORA_SCALING_FITS = {
  trainer: { intercept: 38.0663209598, slope: 6.1480371796, r2: 0.9978517413 },
  forward: { intercept: 8.6056641699, slope: 1.5480524976, r2: 0.9987331291 },
  backward: { intercept: 17.5952403533, slope: 4.3519761324, r2: 0.9979151757 },
} as const;

export const SD_LORA_R149_PROFILE = {
  formalTrainerSeconds: 919.4829086727,
  uninstrumentedReproductionSeconds: 925.91,
  instrumentedTrainerSeconds: 969.1709041460,
  forwardSeconds: 241.5460744629,
  backwardSeconds: 677.7445908203,
  trainingLoopFraction: 0.951,
  observerEffectPercent: 4.67,
} as const;
export const SD_LORA_K128_REPLICATION = {
  gpu2TrainerSeconds: 803.8778089201,
  gpu5TrainerSeconds: 804.5730200578,
  deltaPercent: 0.0864821904,
  sameLoss: true,
  sameOptimizerSteps: true,
  sameComponentCount: true,
  samePeakMemory: true,
} as const;

export const SD_LORA_SCALING_BOUNDARY = {
  supported: 'Under the fixed R149 workload, Vanilla SD-LoRA update latency grows strongly and approximately linearly with accumulated prior component count; the growth is concentrated in forward/backward computation.',
  notEstablished: [
    'which replacement algorithm is best',
    'that component accumulation alone causes task-capability degradation',
    'a general law for every LoRA or continual-learning implementation',
  ],
} as const;
