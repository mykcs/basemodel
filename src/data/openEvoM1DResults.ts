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
    { id: 'exact', zh: '完整满足购物要求的尝试数', en: 'Exact success' },
    { id: 'positive', zh: '得到正奖励的尝试数', en: 'Positive reward' },
    { id: 'mean-score', zh: '平均任务完成度', en: 'Mean WebShop score' },
    { id: 'invalid', zh: '动作或接口错误', en: 'Invalid / interface failure' },
    { id: 'length', zh: '一次任务尝试的长度', en: 'Trajectory length' },
  ],
  publicationGates: [
    {
      id: 'trajectory-seal',
      zh: '完整保存恰好 1,440 条购物任务记录，并写出完整性记录与数据校验指纹（corpus SHA / completion receipt）。',
      en: 'Stage1 must first produce exactly 1,440 trajectories with a corpus SHA and completion receipt.',
    },
    {
      id: 'minimax-seal',
      zh: '同一个固定版本的 MiniMax 分析器，完成全部 1,440 条记录的分析，输出均能被程序正确读取（1,440 / 1,440 parse_ok）。',
      en: 'The same frozen MiniMax analyzer must reach 1,440 / 1,440 parse_ok.',
    },
    {
      id: 'matched-compare',
      zh: '比较所需的封存记录全部齐全后，才发布 SEED 与 OpenEvo 3B 初始经验的结构性比较。',
      en: 'Only after both seals exist may the site publish the SEED Stage1 vs OpenEVO 3B structural comparison.',
    },
    {
      id: 'hard-stop',
      zh: 'MiniMax 分析封存后即结束；不生成技能、不训练模型、不进入 SEED Stage2，也不使用最终测试题。',
      en: 'M1-D stops after MiniMax closeout; SEED skill generation, SFT, Stage2, and final-panel access all remain zero.',
    },
  ],
} as const;
