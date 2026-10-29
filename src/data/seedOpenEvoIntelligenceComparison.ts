/**
 * One semantic owner for the SEED / OpenEVO method comparison.
 * Identical concepts MUST be rendered from the same `sharedAction` string in
 * both columns. Only the implementation-level details may diverge.
 */
export interface BilingualCopy {
  zh: string;
  en: string;
}

export interface MethodDetail {
  explanation: BilingualCopy;
  technique?: BilingualCopy;
  replaceableTeacher?: BilingualCopy;
}

export interface ComparisonRow {
  id: string;
  axis: BilingualCopy;
  sharedAction: BilingualCopy;
  similarity: 'same-operation' | 'same-role-different-mechanism';
  tone: 'environment' | 'experience' | 'optimization' | 'model' | 'accepted';
  seed: MethodDetail;
  openEvo: MethodDetail;
  /** A symmetric factual boundary printed verbatim in both method columns. */
  sharedBoundary?: BilingualCopy;
}

export interface ComparisonStage {
  id: string;
  number: string;
  name: BilingualCopy;
  promise: BilingualCopy;
  result: BilingualCopy;
  rows: ComparisonRow[];
}

const copy = (zh: string, en: string): BilingualCopy => ({ zh, en });

const taskTrajectoryExplanation = copy(
  '模型在环境里逐步选动作；保存任务、观察、动作和最终结果。每题 8 次尝试，共 180 题。',
  'The model chooses actions in the environment and records tasks, observations, actions, and outcomes: 180 tasks × 8 attempts each.',
);

const externalTeacherExplanation = copy(
  '任务结束后才分析已保存轨迹；不在执行任务时替 Qwen 选动作。',
  'Reviews the saved trajectory after the task ends; it does not choose actions for Qwen during the task.',
);

export const stage2TeacherBoundary = copy(
  '本阶段不再调用 Stage 1 的外部高能力教师模型 API。',
  'This stage no longer calls the external high-capability teacher-model API used in Stage 1.',
);

export const seedOpenEvoIntelligenceComparison: ComparisonStage[] = [
  {
    id: 'stage-1',
    number: '01',
    name: copy('学习信号与能力初始化', 'Learning signals and capability initialization'),
    promise: copy('先完成任务，再借助外部教师把完整经历变成可学习的经验，训练出下一阶段的起点。', 'Complete tasks, then use an external teacher to turn full episodes into learnable experience and train the starting state for Stage 2.'),
    result: copy('产物：经过初始参数训练的模型或适配器，以及可追溯的轨迹与学习信号。', 'Output: initially trained model parameters or adapters, plus traceable trajectories and learning signals.'),
    rows: [
      {
        id: 'initial-collection',
        axis: copy('采集任务轨迹', 'Collect task trajectories'),
        sharedAction: copy('Qwen 自主采集 WebShop 任务轨迹', 'Qwen independently collects WebShop task trajectories'),
        similarity: 'same-operation',
        tone: 'environment',
        seed: { explanation: taskTrajectoryExplanation },
        openEvo: { explanation: taskTrajectoryExplanation },
      },
      {
        id: 'external-teacher',
        axis: copy('引入外部教师', 'Use an external teacher'),
        sharedAction: copy('外部高能力教师模型 API', 'External high-capability teacher-model API'),
        similarity: 'same-operation',
        tone: 'experience',
        seed: {
          replaceableTeacher: copy('（GLM-5.2）', ' (GLM-5.2)'),
          explanation: externalTeacherExplanation,
        },
        openEvo: {
          replaceableTeacher: copy('（MiniMax-M3）', ' (MiniMax-M3)'),
          explanation: externalTeacherExplanation,
        },
      },
      {
        id: 'initial-signal',
        axis: copy('构造学习信号', 'Construct learning signals'),
        sharedAction: copy('从完整轨迹中构造学习信号', 'Construct learning signals from completed trajectories'),
        similarity: 'same-role-different-mechanism',
        tone: 'experience',
        seed: {
          technique: copy('Hindsight skill · 事后技能', 'Hindsight skill'),
          explanation: copy('教师把一整题的经验整理为可供模仿的事后技能示例。', 'The teacher turns an episode into hindsight-skill examples to imitate.'),
        },
        openEvo: {
          technique: copy('Episode skill · 单题经验', 'Episode skill'),
          explanation: copy('教师从冻结轨迹提取可复用的单题经验，作为初始蒸馏的训练材料。', 'The teacher extracts reusable episode-level experience from sealed trajectories as material for initial distillation.'),
        },
      },
      {
        id: 'initial-training',
        axis: copy('初始参数训练', 'Initial parameter training'),
        sharedAction: copy('把学习信号训练进模型参数', 'Train the learning signal into model parameters'),
        similarity: 'same-role-different-mechanism',
        tone: 'model',
        seed: {
          technique: copy('监督微调（SFT）· 3 轮', 'Supervised fine-tuning (SFT) · 3 epochs'),
          explanation: copy('用教师写出的事后技能示例训练模型，得到既会行动、也能回看轨迹的起点模型。', 'Train the model on teacher-produced hindsight examples, yielding a starting model that can both act and review episodes.'),
        },
        openEvo: {
          technique: copy('初始参数蒸馏（OPSD）', 'Initial parameter distillation (OPSD)'),
          explanation: copy('用冻结的轨迹与教师分析进行初始参数适配；此步发生在 Stage 2 持续演化之前。', 'Adapt initial parameters with sealed trajectories and teacher analysis, before Stage-2 continual evolution begins.'),
        },
      },
    ],
  },
  {
    id: 'stage-2',
    number: '02',
    name: copy('内部反馈驱动的持续演化', 'Continual evolution from internal feedback'),
    promise: copy('从新的任务结果里反复生成学习信号、更新可持续状态，再用更新后的系统做下一轮任务。', 'Repeatedly derive learning signals from new outcomes, update persistent state, and use that state for the next round.'),
    result: copy('产物：供下一轮使用的参数状态；OpenEVO 还可以保存经过准入的非参数经验状态。', 'Output: parameter state for the next round; OpenEVO can additionally retain admitted non-parametric experience.'),
    rows: [
      {
        id: 'online-collection',
        axis: copy('采集新任务轨迹', 'Collect new task trajectories'),
        sharedAction: copy('当前策略自主采集新的 WebShop 任务轨迹', 'The current policy independently collects new WebShop trajectories'),
        similarity: 'same-operation',
        tone: 'environment',
        seed: { explanation: copy('用本轮策略做新任务，记录动作与结果；模型更新后才进入后续采样。', 'Run new tasks with the current policy, record actions and results, and sample later rounds after policy updates.') },
        openEvo: { explanation: copy('用本轮参数与已采用的经验状态做新任务，记录动作与结果。', 'Run new tasks with the current parameters and admitted experience state, recording actions and results.') },
      },
      {
        id: 'online-signal',
        axis: copy('形成反馈', 'Form feedback'),
        sharedAction: copy('从新轨迹中构造学习信号', 'Construct learning signals from new trajectories'),
        similarity: 'same-role-different-mechanism',
        tone: 'optimization',
        sharedBoundary: stage2TeacherBoundary,
        seed: {
          technique: copy('当前策略自行生成 hindsight skill', 'Current policy generates its own hindsight skills'),
          explanation: copy('结合任务结果奖励，以及同一动作在有技能和无技能条件下的概率变化，形成在线训练信号。', 'Combines outcome rewards and how action probabilities change with versus without hindsight skills to form online learning signals.'),
        },
        openEvo: {
          technique: copy('从任务结果与已有经验生成候选更新', 'Candidate updates from outcomes and existing experience'),
          explanation: copy('根据新轨迹、任务反馈和已有经验生成本轮候选参数与经验更新。', 'Uses new trajectories, task feedback, and existing experience to propose parameter and experience updates.'),
        },
      },
      {
        id: 'online-update',
        axis: copy('持续学习', 'Continual learning'),
        sharedAction: copy('更新可用于下一轮的学习状态', 'Update learning state for the next round'),
        similarity: 'same-role-different-mechanism',
        tone: 'model',
        seed: {
          technique: copy('GRPO + OPD · 参数学习', 'GRPO + OPD · parameter learning'),
          explanation: copy('奖励优化与事后技能蒸馏共同更新当前策略；技能是训练信号，不是部署时持续读取的外部技能库。', 'Reward optimization and hindsight-skill distillation jointly update the policy. Skills supervise training; they are not an external skill bank queried at deployment.'),
        },
        openEvo: {
          technique: copy('SD-LoRA + 经验载体 · 参数与非参数学习', 'SD-LoRA + experience carriers · parametric and non-parametric learning'),
          explanation: copy('候选 SD-LoRA 改变少量适配参数；Text Memory、Skill Bundle、Agent System 分别保存文字经验、可复用策略和全局规则。', 'Candidate SD-LoRA updates a small adapter; Text Memory, Skill Bundle, and Agent System retain written experience, reusable strategies, and global rules.'),
        },
      },
      {
        id: 'next-round',
        axis: copy('进入下一轮', 'Continue to the next round'),
        sharedAction: copy('用更新后的系统继续做任务', 'Continue tasks with the updated system'),
        similarity: 'same-role-different-mechanism',
        tone: 'accepted',
        seed: {
          technique: copy('更新后的策略也是下一轮分析者', 'Updated policy becomes the next analyzer'),
          explanation: copy('新策略既执行任务，也在下一轮自行复盘；不依赖外部教师或独立技能库部署。', 'The new policy both acts and self-reviews in the next round, without an external teacher or separately deployed skill bank.'),
        },
        openEvo: {
          technique: copy('准入检查 → 下一版本（successor）', 'Admission checks → successor revision'),
          explanation: copy('只有通过既定检查的参数或经验候选才进入下一轮；未通过时保持原状态（NOOP）。', 'Only parameter or experience candidates passing frozen checks enter the next round; otherwise the prior state stays unchanged (NOOP).'),
        },
      },
    ],
  },
];
