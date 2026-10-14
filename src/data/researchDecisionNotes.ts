import { z } from 'zod';
import analysisSnapshot from './researchAnalysisSnapshot.json';

const sha = z.string().regex(/^[a-f0-9]{40}$/);
const httpsUrl = z.url().refine((value) => value.startsWith('https://github.com/'), 'GitHub URL required');

const evidenceRefSchema = z.object({
  id: z.string().min(1),
  repository: z.string().min(1),
  prNumber: z.number().int().positive().nullable(),
  commit: sha,
  url: httpsUrl,
  checkedAt: z.literal('2026-10-03'),
  stateAtCheck: z.enum(['merged', 'open', 'closed-unmerged', 'local-analysis']),
  role: z.enum(['observation', 'existing-study-owner', 'causal-context', 'contract-boundary']),
  claim: z.string().min(1),
});

const hypothesisSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  support: z.array(z.string().min(1)).min(1),
  conflict: z.array(z.string().min(1)),
  discriminatingPrediction: z.string().min(1),
});

const nextStudySchema = z.object({
  action: z.enum(['continue-existing-work', 'no-new-study', 'wait-for-existing-evidence']),
  existingPrs: z.array(z.number().int().positive()),
  d04CreatesNewPr: z.literal(false),
  d04NewFormalRollouts: z.literal(0),
  executionAuthorityFromD04: z.literal(false),
  primaryMetric: z.string().min(1),
  independentUnit: z.string().min(1),
  budgetFormula: z.string().min(1),
  stopRule: z.string().min(1),
  decisionChangedBy: z.string().min(1),
});

const decisionNoteSchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  status: z.enum(['continue-existing-work', 'closed-by-evidence', 'wait-for-existing-evidence']),
  evidenceIds: z.array(z.string().min(1)).min(1),
  observations: z.array(z.string().min(1)).min(1),
  conflictsAndLimits: z.array(z.string().min(1)).min(1),
  hypotheses: z.array(hypothesisSchema).min(2),
  currentDecision: z.string().min(1),
  nextStudy: nextStudySchema,
});

export type ResearchDecisionNote = z.infer<typeof decisionNoteSchema>;
export type ResearchDecisionEvidenceRef = z.infer<typeof evidenceRefSchema>;

export const RESEARCH_DECISION_SNAPSHOT = {
  checkedAt: '2026-10-03' as const,
  d03ContentSha256: analysisSnapshot.contentSha256,
  d03Mode: analysisSnapshot.mode,
  finalPanelAccessAdded: 0 as const,
  newExperimentAuthorizationAdded: false as const,
};

export const RESEARCH_DECISION_EVIDENCE: ResearchDecisionEvidenceRef[] = [
  {
    id: 'd03-comparative-analysis',
    repository: 'mykcs/basemodel',
    prNumber: 824,
    commit: 'f738b67a018fe3a1b068fd210b367cafd649cc24',
    url: 'https://github.com/mykcs/basemodel/pull/824',
    checkedAt: '2026-10-03',
    stateAtCheck: 'local-analysis',
    role: 'observation',
    claim: 'D03复算学习信号、rank32与β后期训练，并保留任务面板、评估角色和不确定性边界。',
  },
  {
    id: 'post-advisor-stage1-rank32',
    repository: 'mykcs/openevo-experiment',
    prNumber: 597,
    commit: 'fd7ef9e8d377b731407f7b2c923ba2616719a71d',
    url: 'https://github.com/mykcs/openevo-experiment/pull/597',
    checkedAt: '2026-10-03',
    stateAtCheck: 'closed-unmerged',
    role: 'observation',
    claim: 'SEED-style Stage1目标被优化，但64题留出能力没有改善；同一工作线也封存了rank32对rank128的R152–R159比较。',
  },
  {
    id: 'q01-horizon',
    repository: 'mykcs/openevo-experiment',
    prNumber: 628,
    commit: '3223a157f8b347180e5d7e629cf8fddaca2ee53e',
    url: 'https://github.com/mykcs/openevo-experiment/pull/628',
    checkedAt: '2026-10-03',
    stateAtCheck: 'merged',
    role: 'observation',
    claim: '统一64题开发验证合同下，Ordinary约120更新进入实用平台，Bounded约R150，GDR约R130后出现后期退化。',
  },
  {
    id: 'q02-learning-signal-owner',
    repository: 'mykcs/openevo-experiment',
    prNumber: 629,
    commit: 'a8e50b3e79bc009ea95ac47a73eccf51a50eadab',
    url: 'https://github.com/mykcs/openevo-experiment/pull/629',
    checkedAt: '2026-10-03',
    stateAtCheck: 'open',
    role: 'existing-study-owner',
    claim: '现有Q02负责SFT/OPSD学习信号的匹配与重复，不应由D04另开同义训练线。',
  },
  {
    id: 'q03-seed-stage2-owner',
    repository: 'mykcs/openevo-experiment',
    prNumber: 630,
    commit: '9c88e4917d623e80340699c3ee10ad5de0afe5d7',
    url: 'https://github.com/mykcs/openevo-experiment/pull/630',
    checkedAt: '2026-10-03',
    stateAtCheck: 'open',
    role: 'existing-study-owner',
    claim: '现有Q03负责统一起点的完整SEED Stage2方案，Stage1旧结果只复用、不重做。',
  },
  {
    id: 'q04-rank-owner',
    repository: 'mykcs/openevo-experiment',
    prNumber: 631,
    commit: 'e5987eb950f82cd11d007deaa2c9926cf927d3b1',
    url: 'https://github.com/mykcs/openevo-experiment/pull/631',
    checkedAt: '2026-10-03',
    stateAtCheck: 'open',
    role: 'existing-study-owner',
    claim: '现有Q04承接rank32/rank128并继续rank8/16/64容量筛选；已发生的rank8副作用必须复用而不是重放。',
  },
  {
    id: 'q05-beta-owner',
    repository: 'mykcs/openevo-experiment',
    prNumber: 632,
    commit: '065a2cd675a28cbbf5bd503aa471d916895b5c67',
    url: 'https://github.com/mykcs/openevo-experiment/pull/632',
    checkedAt: '2026-10-03',
    stateAtCheck: 'open',
    role: 'existing-study-owner',
    claim: '现有Q05负责缩幅与自适应增益判别，已有E1封存结果，不应重跑E1。',
  },
  {
    id: 'q07-direction-causal',
    repository: 'mykcs/openevo-experiment',
    prNumber: 634,
    commit: '593e58daf537f7616cbfde8b785d42f8b0fbb92d',
    url: 'https://github.com/mykcs/openevo-experiment/pull/634',
    checkedAt: '2026-10-03',
    stateAtCheck: 'merged',
    role: 'causal-context',
    claim: 'R156更新方向反转在64题开发面板上显著伤害能力；方向本身已有直接因果证据，但不等于控制器已经有效。',
  },
  {
    id: 'q08-retention-owner',
    repository: 'mykcs/openevo-experiment',
    prNumber: 635,
    commit: 'f9a0cab1d8b37ac0f5929f505e356933c285a436',
    url: 'https://github.com/mykcs/openevo-experiment/pull/635',
    checkedAt: '2026-10-03',
    stateAtCheck: 'open',
    role: 'existing-study-owner',
    claim: '现有Q08负责有效学习与旧任务保持，可用于区分后期变化是否伴随保持/遗忘问题。',
  },
  {
    id: 'acceleration-lineages',
    repository: 'mykcs/openevo-experiment',
    prNumber: 471,
    commit: '961c17fb3999f2c469564a7635aaa11c8a73279a',
    url: 'https://github.com/mykcs/openevo-experiment/pull/471',
    checkedAt: '2026-10-03',
    stateAtCheck: 'merged',
    role: 'contract-boundary',
    claim: 'Stable Reduction约2.01×与Bounded Online Recurrence约37.04×属于不同处理与估计对象，不能合成一条通用加速曲线。',
  },
  {
    id: 'acceleration-admission',
    repository: 'mykcs/openevo-experiment',
    prNumber: 481,
    commit: '7200e4836d5330fe634739f49f8ec27e9a2d71f6',
    url: 'https://github.com/mykcs/openevo-experiment/pull/481',
    checkedAt: '2026-10-03',
    stateAtCheck: 'closed-unmerged',
    role: 'contract-boundary',
    claim: '原GDR160没有把两条加速线直接当成Vanilla等价实现；它们改变数值处理或状态转移，预算换算必须保留科学合同。',
  },
];

const notes: ResearchDecisionNote[] = [
  {
    questionId: 'learning-signal-transfer',
    question: '训练目标已经学到，为什么留出WebShop能力没有同步提高？',
    status: 'continue-existing-work',
    evidenceIds: ['d03-comparative-analysis', 'post-advisor-stage1-rank32', 'q02-learning-signal-owner', 'q03-seed-stage2-owner'],
    observations: [
      'Stage1训练loss明显下降，但同一64题留出验证上的Task Score没有超过初始状态。',
      '这个结果只覆盖SEED-style Stage1，不覆盖完整Stage2自演化。',
      '上游已经分别有Q02学习信号对照和Q03完整SEED Stage2两条现有工作线。',
    ],
    conflictsAndLimits: [
      'SFT验证loss与WebShop Task Score不是同一对象或量纲，不能合成一个“验证分数”。',
      '现有汇总不足以把失败唯一归因于目标函数、模型容量、分布差异或缺少Stage2。',
    ],
    hypotheses: [
      {
        id: 'objective-or-credit-assignment',
        label: '学习信号本身没有把经验转成可迁移的任务能力',
        support: ['Stage1优化目标下降而留出任务能力没有上升。'],
        conflict: ['现有结果没有完成匹配的多目标/多seed比较。'],
        discriminatingPrediction: '若该解释更强，Q02中更合适的学习信号应在相同验证合同下改善任务指标，即使不引入完整Stage2。',
      },
      {
        id: 'missing-stage2-loop',
        label: 'Stage1只学会局部监督目标，缺少完整Stage2自演化闭环',
        support: ['#597明确没有测试完整SEED Stage2。'],
        conflict: ['完整Stage2尚未给出封存结果。'],
        discriminatingPrediction: '若该解释更强，Q03在统一起点下加入完整Stage2后应出现Stage1没有的留出能力改善。',
      },
    ],
    currentDecision: '不重跑已完成的Stage1；让Q02与Q03分别检验“学习信号”与“缺少Stage2”两个解释。',
    nextStudy: {
      action: 'continue-existing-work',
      existingPrs: [629, 630],
      d04CreatesNewPr: false,
      d04NewFormalRollouts: 0,
      executionAuthorityFromD04: false,
      primaryMetric: '各自冻结合同中的held-out Task Score；loss只作训练诊断',
      independentUnit: '以各上游PR冻结的任务/seed单位为准，D04不重定义',
      budgetFormula: 'D04新增预算=0；只消费Q02/Q03原有、已授权且去重后的预算账。',
      stopRule: 'Q02/Q03各自封存后停止在本问题新增同义实验；若两者仍不能区分解释，再由新的科学授权决定。',
      decisionChangedBy: '匹配学习信号改善留出能力，或完整Stage2在统一起点下产生Stage1未出现的能力增益。',
    },
  },
  {
    questionId: 'rank-capacity-knee',
    question: 'rank32节省大量持久状态后，性能取舍来自容量瓶颈还是训练信号瓶颈？',
    status: 'continue-existing-work',
    evidenceIds: ['d03-comparative-analysis', 'post-advisor-stage1-rank32', 'q04-rank-owner'],
    observations: [
      'rank32相对rank128显著缩小持久payload，但Task Score与完整成功率方向并不一致。',
      '低effective-rank是事后几何诊断，不能直接推出rank8或任何最小可训练rank。',
      'Q04已经拥有rank8/16/64/32/128容量筛选线，且已有部分rank8副作用需要续接而不是重放。',
    ],
    conflictsAndLimits: [
      '当前BaseModel发布快照仍等待#805整合rank32来源，D04不复制这部分数值成为第二权威。',
      '单个rank32对照不足以定位容量拐点，也不足以证明非劣或无损。',
    ],
    hypotheses: [
      {
        id: 'overprovisioned-state',
        label: 'rank128长期状态容量明显过量',
        support: ['rank32以更小payload保留了大量行为能力。'],
        conflict: ['Task Score方向存在损失，且更低rank尚未全部封存。'],
        discriminatingPrediction: '若该解释更强，Q04多个更低rank会在预先固定的能力/保持指标上形成宽平台，而不是从32以下立即系统性恶化。',
      },
      {
        id: 'capacity-matters',
        label: '容量在继续学习或保持上仍是限制因素',
        support: ['rank32平均Task Score低于rank128，行为指标并非全部同向。'],
        conflict: ['一个rank点和一个窗口不能确定趋势。'],
        discriminatingPrediction: '若该解释更强，Q04的rank sweep会出现随rank降低而稳定加重的能力或保持损失，并能在重复/续接上重现。',
      },
    ],
    currentDecision: '不从effective rank推最小容量，也不另开rank实验；继续Q04并复用已有副作用。',
    nextStudy: {
      action: 'continue-existing-work',
      existingPrs: [631],
      d04CreatesNewPr: false,
      d04NewFormalRollouts: 0,
      executionAuthorityFromD04: false,
      primaryMetric: 'Q04冻结的Task Score与保持/继续学习指标，payload作为成本维度',
      independentUnit: 'Q04冻结的任务×seed/续接身份',
      budgetFormula: 'D04新增预算=0；Q04按ledger从既有gross预算扣除已完成rank32/128和rank8副作用。',
      stopRule: 'Q04容量曲线和保持确认封存后停止扩大rank网格；没有新证据不得向rank4/2/1外推。',
      decisionChangedBy: '出现清晰容量拐点，或更低rank在预先固定指标上持续保留/丢失能力。',
    },
  },
  {
    questionId: 'beta-late-dynamics',
    question: 'β后期训练分数回升、loss继续下降，但冻结结果较差，这种变化该怎样解释？',
    status: 'continue-existing-work',
    evidenceIds: ['d03-comparative-analysis', 'q01-horizon', 'q05-beta-owner', 'q07-direction-causal', 'q08-retention-owner'],
    observations: [
      'D03复算第96–199轮全部窗口：loss持续下降，Task Score先降后回升；训练回升没有产生新的Frozen Final。',
      '#628在统一开发验证合同下发现GDR约R130进入平台后出现明确后期退化。',
      '#634显示至少R156的更新方向反转会直接伤害能力，说明方向信息不能被纯缩幅解释完全替代。',
    ],
    conflictsAndLimits: [
      '训练窗口不是冻结Final；不能把训练回升写成最终能力恢复。',
      'β强度、方向、任务分布变化与遗忘可能同时存在，当前时间序列不能单独给因果归因。',
    ],
    hypotheses: [
      {
        id: 'magnitude-instability',
        label: '后期主要问题是更新幅度或增益调节不合适',
        support: ['Q05正针对缩幅与自适应增益，历史E1已提供描述性起点。'],
        conflict: ['Q07说明某些更新方向本身具有因果作用，单纯缩幅不一定足够。'],
        discriminatingPrediction: '若幅度问题占主导，Q05在保持方向的前提下调节增益应改善后期开发指标并减少退化。',
      },
      {
        id: 'direction-or-retention',
        label: '后期退化更依赖方向选择、任务分布或旧能力保持',
        support: ['Q07的R156方向反转结果与Q01后期退化均与“只看loss”冲突。'],
        conflict: ['Q08保持检验和Q05新cells尚未全部封存。'],
        discriminatingPrediction: '若该解释更强，Q08会发现保持/遗忘差异，或Q05仅缩幅不能稳定修复后期开发表现。',
      },
    ],
    currentDecision: '不申请新的Final重测；继续Q05缩幅/增益与Q08保持线，用已有Q07因果方向证据约束解释。',
    nextStudy: {
      action: 'continue-existing-work',
      existingPrs: [632, 635],
      d04CreatesNewPr: false,
      d04NewFormalRollouts: 0,
      executionAuthorityFromD04: false,
      primaryMetric: '开发Task Score/保持指标；训练loss只作辅助诊断',
      independentUnit: 'Q05/Q08各自冻结的任务与配对单位',
      budgetFormula: 'D04新增预算=0；复用Q05已有E1与Q08已核fresh结果，只补各自owner确认的差集。',
      stopRule: 'Q05/Q08能区分幅度与保持解释后停止追加同义后期诊断；Frozen Final仍不因训练回升自动重开。',
      decisionChangedBy: '保持方向的增益控制稳定改善后期能力，或保持检验证明后期退化主要伴随旧任务损失。',
    },
  },
  {
    questionId: 'training-horizon',
    question: '120、160、200轮到底值不值得继续？',
    status: 'closed-by-evidence',
    evidenceIds: ['q01-horizon', 'd03-comparative-analysis'],
    observations: [
      '#628已在同一64题开发验证规则下跨Ordinary、Bounded、GDR比较训练时长。',
      '最早实用平台点随机制不同：Ordinary约120更新，Bounded约R150，GDR约R130且之后明显退化。',
      'D03的β第160–199轮训练回升进一步说明单看某一条训练曲线不能给全部方法统一停止轮数。',
    ],
    conflictsAndLimits: [
      '这是开发/检查点选择证据，不是数学意义上的全局收敛证明。',
      '新机制仍需自己的预先固定验证规则，不能永远继承这三个历史点。',
    ],
    hypotheses: [
      {
        id: 'universal-120',
        label: '120更新可以作为所有机制的统一停止点',
        support: ['Ordinary OpenEVO在#588/#628中约120更新进入实用平台。'],
        conflict: ['#628显示Bounded约R150才到平台，GDR约R130后退化。'],
        discriminatingPrediction: '该解释已经被跨机制开发曲线反驳；继续重复同一比较不会改变当前项目决策。',
      },
      {
        id: 'mechanism-dependent-horizon',
        label: '有效训练时长取决于更新机制',
        support: ['#628三种机制的最早平台点不同，并观察到GDR后期退化。'],
        conflict: ['结果只覆盖当前三种机制与冻结验证合同。'],
        discriminatingPrediction: '未来新机制若采用自己的冻结验证曲线，应允许得到不同停止点，而不是强制120/160/200之一。',
      },
    ],
    currentDecision: '停止为“120是否普遍足够”再开重复实验；把#628作为当前答案，新机制各自做自己的开发停止验证。',
    nextStudy: {
      action: 'no-new-study',
      existingPrs: [],
      d04CreatesNewPr: false,
      d04NewFormalRollouts: 0,
      executionAuthorityFromD04: false,
      primaryMetric: '无新增；复用#628冻结开发曲线',
      independentUnit: '无新增科学调用',
      budgetFormula: 'D04新增预算=0；重复回答同一跨机制120/160问题的预算为0。',
      stopRule: '当前问题关闭；只有出现新机制或#628证据身份失效时才重新打开。',
      decisionChangedBy: '新的、同合同跨机制证据推翻#628，或一个新机制需要独立停止点。',
    },
  },
  {
    questionId: 'acceleration-budget-reallocation',
    question: '有了2.01×和37.04×之后，省下来的预算能否直接换成更多实验或更长训练？',
    status: 'wait-for-existing-evidence',
    evidenceIds: ['acceleration-lineages', 'acceleration-admission', 'q01-horizon'],
    observations: [
      '#471明确2.01× Stable Reduction与37.04× Bounded Online Recurrence属于不同科学处理、工作负载和估计对象。',
      '#481记录原GDR160没有把两条加速线直接当成Vanilla等价实现。',
      '#628又表明更长训练并不总有价值：不同机制的平台点不同，GDR后期还会退化。',
    ],
    conflictsAndLimits: [
      '速度倍率不能脱离科学合同直接相乘成“可免费增加的轮数”。',
      '当前D04没有同一科学处理下完整的端到端墙钟、GPU小时、存储和质量保持账，不能造精确节省预算。',
    ],
    hypotheses: [
      {
        id: 'engineering-savings-transfer',
        label: '同一已准入处理内部的工程节省可以转成更多重复或更强诊断',
        support: ['加速确实降低某些已测trainer路径成本。'],
        conflict: ['两个代表性倍率跨不同处理，不能互换；原GDR160没有直接准入。'],
        discriminatingPrediction: '只有在同一科学处理、同一评估合同下测得端到端成本且质量门保持时，节省预算才可以按真实差额重分配。',
      },
      {
        id: 'scientific-contract-dominates',
        label: '主要约束不是纯算力，而是处理身份与需要回答的科学问题',
        support: ['#471/#481把两条加速明确分成不同科学语义；#628显示盲目延长训练可能无收益甚至退化。'],
        conflict: ['未来某个处理可能获得独立准入并形成真实端到端节省。'],
        discriminatingPrediction: '若该解释更强，预算决策将优先增加独立重复、任务覆盖和诊断，而不是机械把全部节省换成长轮次。',
      },
    ],
    currentDecision: '暂不把2.01×或37.04×折算成新的科学预算；等各现有处理给出同合同端到端成本与准入证据后再分配。',
    nextStudy: {
      action: 'wait-for-existing-evidence',
      existingPrs: [],
      d04CreatesNewPr: false,
      d04NewFormalRollouts: 0,
      executionAuthorityFromD04: false,
      primaryMetric: '同一科学处理下的端到端墙钟/GPU成本 + 原有能力/行为门',
      independentUnit: '处理×独立运行/评估单位；禁止跨处理把倍率当同一单位',
      budgetFormula: '可重分配预算=同一已准入处理的基线实测成本−候选实测成本；任一项未知则保持未知，不用2.01或37.04直接外推。',
      stopRule: '没有同合同端到端实测与质量门时保持等待；有证据后只在该处理内部重算预算。',
      decisionChangedBy: '某条加速处理获得明确准入，并在同合同端到端测量中稳定节省成本且不越过其能力/行为边界。',
    },
  },
];

export const RESEARCH_DECISION_NOTES = notes.map((note) => decisionNoteSchema.parse(note));

export function validateResearchDecisionNotes(): string[] {
  const errors: string[] = [];
  const evidence = new Map(RESEARCH_DECISION_EVIDENCE.map((item) => [item.id, evidenceRefSchema.parse(item)]));
  const ids = new Set<string>();
  for (const note of RESEARCH_DECISION_NOTES) {
    if (ids.has(note.questionId)) errors.push('duplicate decision question: ' + note.questionId);
    ids.add(note.questionId);
    for (const evidenceId of note.evidenceIds) if (!evidence.has(evidenceId)) errors.push(note.questionId + ': missing evidence ' + evidenceId);
    if (note.nextStudy.d04CreatesNewPr || note.nextStudy.d04NewFormalRollouts !== 0 || note.nextStudy.executionAuthorityFromD04) errors.push(note.questionId + ': D04 must not create execution authority');
    if (note.status === 'closed-by-evidence' && note.nextStudy.action !== 'no-new-study') errors.push(note.questionId + ': closed question must not schedule a study');
    if (note.status === 'continue-existing-work' && note.nextStudy.existingPrs.length === 0) errors.push(note.questionId + ': continuing question needs an existing owner');
  }
  if (RESEARCH_DECISION_NOTES.length !== 5) errors.push('D04 must cover exactly five planned decision questions');
  if (analysisSnapshot.studies.learningSignal.status !== 'awaiting-pr805-integration') errors.push('D03 learning publication boundary changed');
  if (analysisSnapshot.studies.rankCapacity.status !== 'awaiting-pr805-integration') errors.push('D03 rank publication boundary changed');
  if (analysisSnapshot.studies.betaLateTraining.publication !== 'existing-site-projection') errors.push('D03 beta publication boundary changed');
  return errors;
}

export function researchDecisionSummary() {
  const errors = validateResearchDecisionNotes();
  if (errors.length) throw new Error(errors.join('\n'));
  return {
    checkedAt: RESEARCH_DECISION_SNAPSHOT.checkedAt,
    questions: RESEARCH_DECISION_NOTES.length,
    continueExisting: RESEARCH_DECISION_NOTES.filter((item) => item.status === 'continue-existing-work').map((item) => item.questionId),
    closedByEvidence: RESEARCH_DECISION_NOTES.filter((item) => item.status === 'closed-by-evidence').map((item) => item.questionId),
    waiting: RESEARCH_DECISION_NOTES.filter((item) => item.status === 'wait-for-existing-evidence').map((item) => item.questionId),
    d04NewFormalRollouts: 0,
  };
}
