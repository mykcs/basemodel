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
  /** Label describing this specific relationship, identical for both sides. */
  relationLabel?: BilingualCopy;
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
    name: copy('外部经验引导的能力初始化', 'Capability initialization guided by external experience'),
    promise: copy('先让模型做题，再请更强的外部教师总结经验，最后把经验转化为初始能力。', 'First let the model attempt tasks, then ask an external teacher to analyze the experience and turn it into an initial capability.'),
    result: copy('产物：经过初始参数训练的模型或适配器，以及可追溯的轨迹与学习信号。', 'Output: initially trained model parameters or adapters, plus traceable trajectories and learning signals.'),
    rows: [
      {
        id: 'initial-collection',
        axis: copy('采集任务轨迹', 'Collect task trajectories'),
        sharedAction: copy('采集 WebShop 任务轨迹', 'Collect WebShop task trajectories'),
        similarity: 'same-operation',
        tone: 'environment',
        seed: { explanation: copy('Qwen 在 WebShop 中执行任务；论文默认规模为 180 道任务 × 8 次采样。', 'Qwen runs tasks in WebShop; the paper uses 180 tasks × 8 samples by default.') },
        openEvo: { explanation: copy('Qwen 在 WebShop 中执行任务；Ceiling-1.0 对应阶段也是 180 道任务 × 8 次采样。', 'Qwen runs tasks in WebShop; the corresponding Ceiling-1.0 phase also uses 180 tasks × 8 samples.') },
      },
      {
        id: 'external-teacher',
        axis: copy('引入外部教师', 'Use an external teacher'),
        sharedAction: copy('调用外部高能力教师模型 API', 'Call an external high-capability teacher-model API'),
        similarity: 'same-operation',
        relationLabel: copy('共同角色，模型不同', 'Same role, different models'),
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
      {
        id: 'initial-state',
        axis: copy('进入持续演化的起点', 'Starting state for continual evolution'),
        sharedAction: copy('形成 Stage 2 的初始状态', 'Form the initial state for Stage 2'),
        similarity: 'same-role-different-mechanism',
        relationLabel: copy('初始状态不同', 'Different initial states'),
        tone: 'accepted',
        seed: {
          explanation: copy('主要得到一个既能执行任务、又能分析轨迹的策略模型。', 'The main output is a policy model that can both act and analyze trajectories.'),
        },
        openEvo: {
          explanation: copy('得到带有 OPSD 参数更新及 Text Memory、Skill Bundle、Agent System 的初始 Agent 状态。', 'The initial agent state includes OPSD parameter updates and Text Memory, Skill Bundle, and Agent System.'),
        },
      },
    ],
  },
  {
    id: 'stage-2',
    number: '02',
    name: copy('内部反馈驱动的持续演化', 'Continual evolution from internal feedback'),
    promise: copy('不再为每轮经验分析调用 Stage 1 的外部大模型 API，转而利用新轨迹和当前系统自身的能力反复改进。', 'Stop calling the Stage-1 external model API for each new episode; use fresh trajectories and the current system to improve repeatedly.'),
    result: copy('产物：供下一轮使用的参数状态；OpenEVO 还可以保存经过准入的非参数经验状态。', 'Output: parameter state for the next round; OpenEVO can additionally retain admitted non-parametric experience.'),
    rows: [
      {
        id: 'online-collection',
        axis: copy('采集新任务轨迹', 'Collect new task trajectories'),
        sharedAction: copy('采集新的 WebShop 任务轨迹', 'Collect new WebShop task trajectories'),
        similarity: 'same-operation',
        tone: 'environment',
        seed: { explanation: copy('由当前策略执行任务，采集它自己实际产生的新轨迹。', 'The current policy executes tasks and collects trajectories from its own actions.') },
        openEvo: { explanation: copy('由当前策略执行任务，采集它自己实际产生的新轨迹。', 'The current policy executes tasks and collects trajectories from its own actions.') },
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
