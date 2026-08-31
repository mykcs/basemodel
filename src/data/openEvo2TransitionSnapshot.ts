export const openEvo2TransitionSnapshot = {
  observedAt: '2026-08-31 20:34 JST',
  scienceBranch: 'ops/ceiling1-symmetric-coresidency-20260831',
  scienceSha: '319bbd0edaf027ff6d3f63fadf352ae11bcd5796',
  stage1: {
    rolloutsPerArm: 1_440,
    teacherEvidencePerArm: 1_440,
    sharedWithOpenEvo2: true,
  },
  ceiling1: {
    status: 'RUNNING_UNDER_HARNESS_REVIEW',
    threeB: { sealedRounds: 18, acceptedRollouts: 2_304, sdComponents: 0 },
    sevenB: { sealedRounds: 31, acceptedRollouts: 3_968, sdComponents: 25 },
    stopSnapshot: null,
  },
  openEvo2: {
    status: 'DESIGN_DRAFT_NOT_ACTIVATED',
    formalTaskConsumption: 0,
    finalPanelAccess: 0,
    branchPoint: 'reuse sealed Stage-1 trajectories/evidence; rebuild non-parametric carrier state and Stage-2 harness under the 2.0 contract',
  },
} as const;
