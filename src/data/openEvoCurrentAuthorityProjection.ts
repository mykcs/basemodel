/**
 * Derived website projection only. The experiment repository remains authoritative.
 * Update this object only from a hash-bound OpenEVO campaign/router readback.
 */
export const openEvoCurrentAuthorityProjection = {
  schema: 'openevo.basemodel-derived-current-authority.v1',
  derivedOnly: true,
  observedAt: '2026-09-04 03:55 SGT',
  freezeId: '202609030400',
  sourceControlHead: 'c5a5f5a48ef52338dc7c19e089d05cddfeced61a',
  campaignManifestSha256: '356db91575144e8fd075103bd4fc1b68de9a447c3ed1dec26710e8f7e2f4e8d3',
  masterPlanExecutionAuthority: false,
  qwen25ThreeB: {
    stage: 'Stage2-vNext',
    state: 'RUNNING_EXTERNAL_EXECUTOR_ADOPTED',
    scientificExecutionSha: 'e73b1022b76b23875a40bffc9b7975feda57816e',
    predecessorRule: 'old df2 partial is PREMATURE_LINEAGE_NO_RESUME',
  },
  qwen3OneP7B: {
    stage: 'Stage2-vNext',
    state: 'RUNNING_EXTERNAL_EXECUTOR_ADOPTED',
    scientificExecutionSha: 'e439cbba64d2071ad7c1a239b84e893fd135bc78',
    chatTemplateEnableThinking: false,
  },
  liveStateRule: 'Do not infer live round/GPU/PID state from this website snapshot; re-read router → campaign → phase release → live receipt.',
} as const;
