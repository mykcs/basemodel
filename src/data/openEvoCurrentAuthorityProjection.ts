/**
 * Derived website projection only. The experiment repository remains authoritative.
 * Update this object only from a hash-bound OpenEVO campaign/router readback.
 */
export const openEvoCurrentAuthorityProjection = {
  schema: 'openevo.basemodel-derived-current-authority.v1',
  derivedOnly: true,
  observedAt: '2026-09-04 SGT · post-#305 merge',
  freezeId: '202609030400',
  authorityBindingCommit: '4e8c3ab72f8e4f5e1e0c52b35da2a45c596ec415',
  campaignManifestSha256: '211f3cc923b6ccf3d760e12f6266b3193f6b08a91d95b0a0f369ccd8e632c9a5',
  masterPlanExecutionAuthority: false,
  runtimeAuthority: {
    identityTimestamp: '202609042025',
    path: 'configs/experiment/openevo-ceiling1-stage2-runtime-authority-202609042025.json',
    sha256: 'a96710a1a7ee764743358c90d224dab2617639d8db627bb85052b7da6d52a8ea',
    status: 'READY_FOR_AUDITED_NATURAL_MIGRATION',
    resourceBackend: 'ray-202609042025',
    executionActivationAuthority: false,
  },
  qwen25ThreeB: {
    stage: 'Stage2-vNext',
    authorityState: 'READ_ONLY_EXTERNAL_RAY_ADOPTED',
    currentExecutionSha: '4915dbdd75678da9a5752f991e70685c67dd497b',
    scientificActivationExecutionSha: 'e73b1022b76b23875a40bffc9b7975feda57816e',
    continuationReceiptSha256: 'e1744035504318712a847fc464a960b0a2fa39c755e972e74fc18ab5143bb104',
    predecessorRule: 'old df2 partial is PREMATURE_LINEAGE_NO_RESUME',
  },
  qwen3OneP7B: {
    stage: 'Stage2-vNext',
    authorityState: 'READ_ONLY_EXTERNAL_RAY_ADOPTED',
    currentExecutionSha: 'ac130148ee08b6462d9728e482a858fe5f514047',
    scientificActivationExecutionSha: 'e439cbba64d2071ad7c1a239b84e893fd135bc78',
    continuationReceiptSha256: 'bcb34f2db001a320ac3228790a080a691658fe2ae04f59bf662f0cb0ab6a1a7d',
    chatTemplateEnableThinking: false,
  },
  continuationAccounting: {
    formalRolloutReplay: 0,
    scientificSemanticsChanged: false,
  },
  liveStateRule: 'Do not infer RUNNING/PAUSED, round, GPU, or PID state from this website snapshot; re-read router → campaign → phase release → live receipt.',
} as const;
