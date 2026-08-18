export const openEvoScientificState = {
  sourceRepo: 'https://github.com/mykcs/openevo-experiment',
  currentCampaignUrl: 'https://github.com/mykcs/openevo-experiment/blob/main/configs/experiment/current-campaign.json',
  checkedAt: '2026-08-18',
  checkedSourceCommit: 'f3124a16160f767e32e8663b099a102104b975f8',
  defaultBranchSnapshot: {
    branch: 'main',
    phase: 'H1.27',
    status: 'completed-descriptive-only',
    title: 'H1.27 base-agent model capability diagnostic',
    classification: 'scale-only-not-supported-or-task-local',
    observedAttempts: 64,
    scientificValidAttempts: 48,
    parserOrFallbackInvalidAttempts: 16,
    measuredGpuHours: 0.7191666666666666,
  },
  liveStateRule: {
    zh: '实时科学状态必须从实际使用的 openevo-experiment branch 读取 current-campaign.json，并继续解析该 campaign 或 successor 的最新有效 reconciliation / result；活跃科学分支可能领先默认 main。',
    en: 'Resolve live scientific state from current-campaign.json on the openevo-experiment branch actually in use, then follow the latest valid reconciliation/result for that campaign or successor; an active scientific branch may be ahead of default main.',
  },
  gpuRule: {
    zh: 'GPU 分配不是静态网页事实；以当前父级执行策略、preregistration、显式授权 UUID 与启动前 live-idle 核验为准。',
    en: 'GPU allocation is not a static-site fact; resolve it from the current parent execution policy, preregistration, explicitly authorized UUIDs, and live-idle checks immediately before launch.',
  },
} as const;
