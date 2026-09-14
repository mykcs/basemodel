export const SD_LORA_VR_LINEAGE_INDEX = {
  repository: 'mykcs/openevo-experiment',
  branch: 'docs/sd-lora-vr-parallel-lineage-index-20260914',
  commit: 'a4d33bada8e8cc1bc4f4a24f1470650beca7a493',
  path: 'docs/experiment-tracking/SD_LORA_VR_PARALLEL_LINEAGE_INDEX_20260914.md',
} as const;

export const SD_LORA_STABLE_REDUCTION_IDENTITY = {
  name: 'SD-LoRA v2 · Stable Reduction',
  route: 'sd-lora-equivalence',
  branch: 'research/sd-lora-v2-stable-reduction-202609131200',
  commit: '0bf76b5a04d0429da52998fcb05cf30848d05198',
  historyShape: 'growing-components',
} as const;

export const SD_LORA_BOUNDED_RECURRENCE_SOURCE = {
  name: 'SD-LoRA · Bounded Online Recurrence',
  route: 'sd-lora-bounded-state',
  branch: 'research/sd-lora-bounded-online-recurrence-pass-20260914',
  tag: 'sd-lora-bounded-online-recurrence-pass-20260914',
  commit: '3a2128e5fb424403987e925c80adc15cfadbd9f7',
  planPath: 'docs/experiment-tracking/SD_LORA_FUNCTIONAL_EQUIVALENCE_AND_BOUNDED_STATE_PLAN_20260913.md',
  q0CloseoutPath: 'docs/evidence/q17-sd-lora-bounded-online-recurrence-q0-20260913/closeout.json',
  q1CloseoutPath: 'docs/evidence/q17-sd-lora-bounded-online-recurrence-q1-20260913/final-closeout.json',
} as const;

export const SD_LORA_BOUNDED_RECURRENCE_RESULT = {
  status: 'PASS',
  q0Speedup: 35.89677660008812,
  recurrentRounds: 9,
  stateRank: 128,
  currentUpdateRank: 8,
  formalSpeedupMean: 37.03782382421645,
  formalSpeedupMin: 35.12385297275877,
  formalSpeedupMax: 39.90088614115592,
  adapterModelBytes: 205551528,
  secondsPerOptimizerStepMean: 0.2340515323514557,
  historySlope: 1.8168988467904638e-05,
  noFullCheckpointReset: true,
  protectedFinalPanelAccess: 0,
  behavior: [
    { round: 150, scoreLowerBound: -0.03872767857142857, successLowerBound: -0.0625 },
    { round: 152, scoreLowerBound: -0.02912608225108225, successLowerBound: -0.0546875 },
    { round: 155, scoreLowerBound: 0.0030686327561327545, successLowerBound: -0.0546875 },
    { round: 159, scoreLowerBound: -0.040368247204184714, successLowerBound: -0.015625 },
  ],
} as const;
