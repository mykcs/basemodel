export const OPEN_EVO_M1D_RESULTS = {
  experimentId: 'M1-D-SEED-STAGE1-INIT-PROBE-3B',
  authorityCommit: 'b4cdf8ecc5d442f984402f517a6d5b6b5e5e3bc9',
  activationRelease: '202609062029',
  publicationState: 'RESULTS_WITHHELD_UNTIL_TRAJECTORY_AND_MINIMAX_SEAL',
  stage1: {
    taskCount: 180,
    rolloutsPerTask: 8,
    trajectoryTarget: 1440,
    maxSteps: 15,
    historyLength: 2,
    worldSeed: 2026,
    numProducts: 1000,
    luceneIndex: 'indexes_1k',
    policyTemperature: 0.4,
    requestLevelSeed: null,
    stage2Budget: 0,
  },
  resultMetrics: [
    { id: 'exact', zh: 'Exact success', en: 'Exact success' },
    { id: 'positive', zh: 'Positive reward', en: 'Positive reward' },
    { id: 'mean-score', zh: '平均 WebShop score', en: 'Mean WebShop score' },
    { id: 'invalid', zh: 'Invalid / interface failure', en: 'Invalid / interface failure' },
    { id: 'length', zh: '轨迹长度', en: 'Trajectory length' },
  ],
  publicationGates: [
    {
      id: 'trajectory-seal',
      zh: 'Stage1 必须先得到恰好 1,440 条轨迹，并写出 corpus SHA / completion receipt。',
      en: 'Stage1 must first produce exactly 1,440 trajectories with a corpus SHA and completion receipt.',
    },
    {
      id: 'minimax-seal',
      zh: '同一冻结 MiniMax analyzer 必须达到 1,440 / 1,440 parse_ok。',
      en: 'The same frozen MiniMax analyzer must reach 1,440 / 1,440 parse_ok.',
    },
    {
      id: 'matched-compare',
      zh: '只有两边 seal 都齐全后，才发布 SEED Stage1 vs OpenEVO 3B 的结构性比较。',
      en: 'Only after both seals exist may the site publish the SEED Stage1 vs OpenEVO 3B structural comparison.',
    },
    {
      id: 'hard-stop',
      zh: 'M1-D 在 MiniMax closeout 后停止；SEED skill generation / SFT / Stage2 / final panel 均为 0。',
      en: 'M1-D stops after MiniMax closeout; SEED skill generation, SFT, Stage2, and final-panel access all remain zero.',
    },
  ],
} as const;
