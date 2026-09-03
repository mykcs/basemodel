export type OpenEvoNarrativeLocale = 'zh' | 'en';

export const OPEN_EVO_CEILING_PRINCIPLE = {
  zh: '在 SEED-aligned 的 WebShop 任务、轨迹与评测预算内，先冻结规则、再看结果，探索 OpenEvo 能把当前基座模型推到多高。',
  en: 'Within a SEED-aligned WebShop task, rollout, and evaluation envelope, freeze the rules before seeing outcomes and probe how far OpenEvo can push the current base model.',
} as const;

export const OPEN_EVO_STAGE1_FREEZE = {
  id: '202609030400',
  tasks: 180,
  rolloutsPerTask: 8,
  trajectoriesPerArm: 1440,
  maxSteps: 15,
  temperature: 1.0,
  topP: 1.0,
  topK: 0,
  repetitionPenalty: 1.0,
  historyLength: 2,
  minimumPreActionModelTokens: 4,
} as const;

export const OPEN_EVO_STAGE1_METRICS = [
  {
    id: 'qwen25-3b',
    model: 'Qwen2.5-3B-Instruct',
    exact: 22,
    exactRate: '1.53%',
    positive: 447,
    positiveRate: '31.04%',
    exactTaskIdentities: 16,
  },
  {
    id: 'qwen3-1p7b',
    model: 'Qwen3-1.7B',
    exact: 50,
    exactRate: '3.47%',
    positive: 1030,
    positiveRate: '71.53%',
    exactTaskIdentities: 23,
  },
] as const;

export const OPEN_EVO_EVIDENCE_LINKS = {
  sharedStage1Pr: 'https://github.com/mykcs/openevo-experiment/pull/270',
  sharedStage1Design: 'https://github.com/mykcs/openevo-experiment/blob/research/shared-stage1-min-deliberation-final-candidate-20260903/configs/experiment/stage1/202609030400/design.json',
  prestage2Design: 'https://github.com/mykcs/openevo-experiment/blob/research/shared-stage1-min-deliberation-final-candidate-20260903/configs/experiment/stage1/202609030400/prestage2_shared.json',
  capacityAuthority: 'https://github.com/mykcs/openevo-experiment/blob/research/shared-stage1-min-deliberation-final-candidate-20260903/docs/experiment-tracking/OPEN_EVO_CEILING_1.0_CAPACITY_AUTHORITY_2026-09-03.md',
  historicalStatus: 'https://github.com/mykcs/openevo-experiment/blob/main/docs/science/webshop/reports/OPEN_EVO_WEBSHOP_CURRENT_STATUS_2026-08-17.md',
  historicalHorizonPr: 'https://github.com/mykcs/openevo-experiment/pull/35',
  sharedStage1Troubleshooting: 'https://github.com/mykcs/openevo-experiment/blob/main/docs/troubleshooting/experiment-ops/CASE-STAGE1-202609030400-SHARED-HARNESS-TO-PRESTAGE2-20260903.md',
} as const;

export const OPEN_EVO_HARNESS_FAIRNESS = [
  {
    id: 'task-answer',
    state: 'none-found',
    label: { zh: '答案 / golden action 泄漏', en: 'Answer / golden-action leakage' },
    value: { zh: '未发现', en: 'None found' },
    note: { zh: '不提供目标商品 ID、golden action、expert trajectory 或下一步排名。', en: 'No target item ID, golden action, expert trajectory, or next-action ranking is provided.' },
  },
  {
    id: 'strategy',
    state: 'none-found',
    label: { zh: 'WebShop 解题策略注入', en: 'WebShop task-solving strategy' },
    value: { zh: '未注入', en: 'Not injected' },
    note: { zh: '不告诉模型“先搜什么、怎么缩关键词、何时购买”；strategy_guidance=false。', en: 'The harness does not prescribe search terms, query reduction, or when to buy; strategy_guidance=false.' },
  },
  {
    id: 'environment',
    state: 'declared-scaffold',
    label: { zh: '环境接口信息', en: 'Environment interface' },
    value: { zh: '明确提供', en: 'Explicitly provided' },
    note: { zh: 'Task、当前 observation、最近 history、当前 Allowed actions 属于 agent 与 WebShop 交互所需的接口。', en: 'Task, current observation, recent history, and current Allowed actions are the interface required to operate WebShop.' },
  },
  {
    id: 'action-envelope',
    state: 'declared-scaffold',
    label: { zh: 'Hard action envelope', en: 'Hard action envelope' },
    value: { zh: '有，必须披露', en: 'Yes, disclosed' },
    note: { zh: '接口只允许形成当前 admissible action，并拥有 action opener；它降低机械非法动作，但不替模型选择哪一个合法动作。', en: 'The interface permits only current admissible actions and owns the action opener; it reduces mechanical invalidity without choosing which legal action the model should take.' },
  },
  {
    id: 'deliberation',
    state: 'declared-scaffold',
    label: { zh: '通用短自我推理', en: 'Generic brief self-deliberation' },
    value: { zh: '有，非策略提示', en: 'Yes, not strategy advice' },
    note: { zh: '只要求模型在 action 前写自己的短 reasoning；不规定 WebShop-specific reasoning 内容。', en: 'The model writes its own brief reasoning before acting; no WebShop-specific reasoning recipe is prescribed.' },
  },
  {
    id: 'learned-carriers',
    state: 'none-found',
    label: { zh: 'Raw Stage1 learned carriers', en: 'Raw Stage-1 learned carriers' },
    value: { zh: '全部关闭', en: 'All disabled' },
    note: { zh: 'Memory / Skill / Agent System / SD adapter 都不注入 raw Stage1。', en: 'Memory, Skill, Agent System, and SD adapter are not injected into raw Stage 1.' },
  },
  {
    id: 'teacher',
    state: 'none-found',
    label: { zh: 'Stage1 外部老师代行动', en: 'External teacher acting in Stage 1' },
    value: { zh: '0 次', en: '0 calls' },
    note: { zh: 'MiniMax 只在每个 arm 的 raw Stage1 seal 之后做 post-hoc analysis；READY_FOR_MINIMAX 记录 new_webshop_calls=0。', en: 'MiniMax is used only for post-hoc analysis after each raw Stage-1 seal; READY_FOR_MINIMAX records new_webshop_calls=0.' },
  },
  {
    id: 'final-panel',
    state: 'none-found',
    label: { zh: 'Final panel 泄漏', en: 'Final-panel leakage' },
    value: { zh: 'Stage1 = 0', en: 'Stage 1 = 0' },
    note: { zh: '最终评测不参与 Stage1 采集或 Harness 选择。', en: 'Final evaluation is not used for Stage-1 collection or harness selection.' },
  },
  {
    id: 'pretraining',
    state: 'unknown',
    label: { zh: '基座模型预训练污染', en: 'Base-model pretraining contamination' },
    value: { zh: '无法排除', en: 'Cannot rule out' },
    note: { zh: 'WebShop 是公开 benchmark，而基座模型完整预训练语料不可审计，因此这里不能声称模型从未见过 WebShop。', en: 'WebShop is public and the full pretraining corpora are not auditable, so the experiment cannot claim that the base models never saw WebShop.' },
  },
] as const;
