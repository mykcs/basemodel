/**
 * Advisor research-question report, evidence snapshot verified 2026-10-09.
 *
 * Q02/Q04/Q05/Q06/Q09 additionally include a 2026-10-19 read-only
 * host-receipt reconciliation. This projection is not the experiment authority;
 * the original receipt/PR remains the source. Full carrier-off ablation remains unrun.
 * Reader-facing synthesis, NOT a scientific metric authority or live run ledger.
 * Every claim links to the corresponding OpenEVO experimental evidence/PR.
 * Historical six meeting themes were later decomposed into ten research questions:
 * Q10 is a post-meeting generalization question, not a verbatim advisor quote.
 */
export type QuestionFamily = 'learning' | 'updating' | 'generalization';

export interface AdvisorQuestion {
  id: string;
  family: QuestionFamily;
  title: string;
  opening: string;
  experiment: string;
  finding: string;
  interpretation: string;
  unknown: string;
  evidence: { label: string; href: string }[];
  evidenceState: 'bounded-answer' | 'partial' | 'unrun';
}

export const ADVISOR_RESEARCH_AS_OF = '2026-10-09';

export const ADVISOR_QUESTIONS = [
  {
    id: 'q01',
    family: 'learning',
    title: '训练 160 轮会不会太多了？',
    opening: '这里的“轮”是 OpenEVO 反复执行购物任务、整理经验并继续学习的迭代，不是把同一份固定训练集完整遍历一次的 epoch。有些轮次没有真正更新参数，而普通 OpenEVO 曲线按实际参数更新次数统计。我们想知道训练到什么时候继续做题已经没有明显收益。',
    experiment: '将普通 OpenEVO、Bounded 和历史 β/GDR 在训练中保存的模型，分别放到事先固定的同一批 64 道 WebShop 购物题上考试，每种方法测 11 个版本。事先约定一条挑选保存时点的规则：如果后面已测版本的平均分没有高出超过 2 分，完整成功也没有多出超过 2 道题，就记录这个较早的版本。',
    finding: '普通 OpenEVO 第 120 次更新得 60.40 分，第 160 次是 60.11 分，后续训练没有带来明显提高；Bounded 第 120 轮是 58.72 分，到第 150 轮提高至 67.25 分；历史 β/GDR 第 130 轮约 58.16 分，到第 160 轮反而降到 45.24 分。',
    interpretation: '三条路线应该分别选择训练时长。普通 OpenEVO 在这批题上训练到 120 次后收益已很小；Bounded 到 150 轮仍有进步；历史 β/GDR 后段出现成绩下降，不能把这种下降误当成稳定的平台期。',
    unknown: '上述判断仅来自固定的 64 道购物题和每种方法 11 个已测模型版本。这条规则用于从已测版本里挑时点，并不保证成绩以后始终稳定。换新题是否仍成立尚未验证；Bounded 和历史 β/GDR 有少数轮次没有实际更新参数。',
    evidence: [{ label: 'Q01 · 真实三机制保存点曲线与停止判据', href: 'https://github.com/mykcs/openevo-experiment/blob/48e1368c7afc260a1745a49e6c7c173bfbb172b2/docs/evidence/advisor-q01-horizon-plateau-20261001/Q01_THREE_WAY_RESULT.json' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q02',
    family: 'learning',
    title: '开始逐轮学习之前，怎样训练出一个更好的初始模型？',
    opening: 'OpenEVO 开始长期逐轮学习之前，先要用已有经验训练出一套起始参数。这里比较 SFT 与 OPSD 两种训练起点的方式。哪种初始训练方式更好，和后续多轮学习能否继续提高能力，是两个需要分别检验的问题。',
    experiment: '先让相同的 Qwen 模型学习同一批 WebShop 任务经验，并保持训练步数、参数容量等条件一致。SFT 直接学习示范回复；OPSD 在训练时让教师视角看到额外的经验总结，再指导学生学习。这里测试的是第一阶段怎样训练初始模型，还没有替代后续的逐轮学习实验。',
    finding: '早期同一批 32 道题上，OPSD 的平均 Task Score 是 36.01/100，SFT 是 34.96/100；完整成功分别是 0/32、3/32，平均分差的置信区间跨零。之后的匹配方案六组 SFT/OPSD 训练摘要均 PASS。匹配方案按训练方法、随机种子和 epoch 组成 18 个评测位置，目前已有 15 个模型版本完成固定 64 题评测，状态均为 PASS；训练完成和评测通过还不能代替最终的逐题配对统计。',
    interpretation: '这组实验先比较两种训练方式能否给后续学习提供更好的起点。平均分、完整成功数和训练损失回答不同的问题；SFT 或 OPSD 在第一阶段的局部表现，不能直接回答“后续持续学习是否值得”。',
    unknown: '原方案按两种方法、三组随机种子、三个 epoch 构成 18 个评测位置；这次只读核验到 15 个，剩余 3 格与最终配对统计仍待确认。早期 32 题不能决定哪种初始方法更好，长期逐轮学习后的差异也尚未独立比较。',
    evidence: [
      { label: 'Q02 · 当前匹配训练工作包与剩余单元', href: 'https://github.com/mykcs/openevo-experiment/pull/629' },
      { label: 'Q02 · 六次训练全部 PASS 的 10 月 4 日核账', href: 'https://github.com/mykcs/openevo-experiment/pull/629#issuecomment-5976961612' },
      { label: '早期目标消融网页', href: 'https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoStage1LearningObjectives.astro' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q03',
    family: 'learning',
    title: '我们的 SEED 实验成绩，能直接和论文比较吗？',
    opening: '历史 Q03 模型在我们使用的 64 道购物题上只有约 6 分，SEED 论文报告的另一套测试分数超过 87 分。两边使用的题目、提示和训练流程不同。先把考试条件对齐，才能讨论成绩差距从哪里来。',
    experiment: '历史 Q03 使用已有的 OpenEVO 轨迹与 MiniMax 经验分析，先训练三遍初始 SFT，再用与公开论文不完全相同的方式继续学习，最终在自定义 64 道题上测到 A120。另一个独立的公开 SEED 复现实验重新收集第一阶段数据，两条路线必须分别报告。',
    finding: '历史 Q03 的四个已测版本在自定义 64 题上的成绩有升有降，A120 为 6.62/100，四个版本都没有完整做对任何一题。独立复现实验的三组工程模型平均分为 4.07、3.97、4.28/100，完整成功分别为 1、1、3/512；在相同题目上比较后，两项相邻模型均分差的 95% 区间都跨过零。这些工程诊断尚未给出正式 SEED 成绩。',
    interpretation: '统一成百分制只能统一数字的写法。历史 Q03 的初始模型、任务题单、提示和动作解释都与论文设置不同；这些已知差异仍未分别测出各自贡献。因此这两套分数目前不能直接判断方法优劣。',
    unknown: '按 SEED 论文原定流程完成的正式验证尚无可靠成绩。独立复现已收集 1,440 条第一阶段轨迹和 1,200 条有效教师标注，三组工程模型共 1,536 次做题记录已核对完成；但工程 SFT 第三轮、完整八卡任务流恢复和存储验收仍未完成。正式数据 SFT 尚未启动，正式 Stage2 为 0/160。',
    evidence: [
      { label: 'Q03 · A0–A120 封存与原生评测差异', href: 'https://github.com/mykcs/openevo-experiment/pull/678' },
      { label: 'Q03 历史 Stage2', href: 'https://github.com/mykcs/openevo-experiment/pull/630' },
      { label: '从头复现公开 SEED 的独立实验', href: 'https://github.com/mykcs/openevo-experiment/pull/677' },
      { label: 'Q03 · 2026-10-15 八卡工程与训练恢复', href: 'https://github.com/mykcs/openevo-experiment/pull/707' },
      { label: 'Q03 · 八卡开发题评估的冻结原始运行收据', href: 'https://github.com/mykcs/openevo-experiment/blob/c930744044c4e648f5daf54514a23f2d188c268e/docs/evidence/seed-public-repro-minimax-20261007/EIGHT_PARALLEL_PROGRESS_AND_TASK_OBSERVER_CPU_20261015.json' },
      { label: 'Q03 · 2026-10-16 三模型 1,536 次完整工程诊断', href: 'https://github.com/mykcs/openevo-experiment/blob/31693e914487c9f210f93e3b4019037f9d5f0e06/docs/evidence/seed-public-repro-minimax-20261007/EIGHT_THREE_CHECKPOINT_CORE_BEHAVIOR_20261015.json' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q04',
    family: 'updating',
    title: '长期参数容量需要 rank128 这么大吗，缩小一点怎么样？',
    opening: 'rank 是长期参数状态的容量档位。此前我们用 rank128 保存历史更新，但还没有证明一定需要这么大；因此试着减到 rank32，比较文件大小和同题成绩。',
    experiment: '整段训练共 160 轮。此前 rank128 已经封存末尾八轮（第 152–159 轮）的续训结果，我们新增 rank32 的同阶段结果并与它做 1,024 组逐题配对。后续 Q04 Phase-A 又筛选 rank8、16、32、64、128 五种容量，累计完成 640 次开发题评测；这与前面的八轮配对不是同一个实验。',
    finding: '原来的 rank128、rank32 参数文件分别约 205.6 MB、51.4 MB，在后段匹配题上的 Task Score 分别为 62.98、61.19/100，rank32 平均低 1.79 分，95% 区间为 −3.68 至 +0.12 分。新的五档第一阶段（Phase A）评测已 640/640 完成，但分析没有找到稳定的最佳容量拐点。',
    interpretation: 'rank128 的全部容量还未被证明必要。但“差距不大”不等于统计上已经证明两个容量等价或严格非劣。',
    unknown: 'rank8、16、64 的第一阶段筛选已经有结果。还缺的是选定 rank128、64、32 在后续新任务流上的完整续学对照：第二阶段（Phase B）已有部分训练记录，但没有整套正式封存；所需最小长期容量尚未确定。',
    evidence: [
      { label: 'rank32 已完成的配对证据', href: 'https://github.com/mykcs/openevo-experiment/pull/597' },
      { label: 'Q04 · 更小容量正式实验', href: 'https://github.com/mykcs/openevo-experiment/pull/631' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q05',
    family: 'updating',
    title: '增加参数写入控制后，模型做题成绩有什么变化？',
    opening: '历史实验在 Bounded 固定容量方法上增加了复杂的 β/GDR 写入规则。后来又设计了只调节写入大小的简单 β。它们是两种不同的实验，需要分别看实际成绩与更新方向。',
    experiment: '先比较历史三条 160 轮路线的固定 128 题终评，并对新简单 β 检查更新方向。另有一项独立的短程敏感性实验：比较 R125 未写入对照和 R126 触发方向门槛的候选，在开始与 R127 后两个时点、开发题与旧题保持题上分别测量；共有 8 个评测单元，每个 64 道题。这不等于继续原来已正式终止的 R126 训练线。',
    finding: '历史三路线的固定 128 题分数为普通 OpenEVO 60.72、Bounded 45.98、历史 β/GDR 20.77；较简单 β 的 R120 更新方向余弦约 0.9992。新敏感性测试另完成了 8 × 64 = 512 次评测：R126 候选和 R125 对照在起点开发题上分别为 55.53、62.29 分，在 R127 后旧题保持题上则为 67.78、64.75 分。不同条件下描述性排序发生变化，尚不能宣布简单 β 的普遍收益。',
    interpretation: '历史 β/GDR 的长期掉分不能直接归因于新简单 β。R126 曾触发预先冻结的方向门槛，这是该实验合同下的终止结果；门槛源自历史八轮范围，并非已验证的能力损失阈值。后续 512 次行为评测使我们能观察不同条件下的成绩，但没有证明统一的 β 机制效益。',
    unknown: '新的简单 β 正式多单元工作包尚未完成全部训练与计划的 1,280 次评估及配对统计；10 月 18 日的 512 次独立敏感性评测不能替代这套正式比较。仍需确认写入强度、方向变化与旧能力保持之间的关系。',
    evidence: [
      { label: 'Q05 · 简单 β 训练进度与方向收据', href: 'https://github.com/mykcs/openevo-experiment/pull/632' },
      { label: '已有三路线冻结终评', href: 'https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q06',
    family: 'updating',
    title: '模型选择商品时有多拿不准？',
    opening: 'WebShop 需要在多个商品、规格和点击选项里做决定。模型选中某个按钮时有多确定，可以从它给各个合法选项分配的概率来观察；这能否预测以后出错，还需要单独检验。',
    experiment: '最早只从历史轨迹计算 search/click 两类动作的 action-family entropy（动作类型熵），它区分不了具体商品选择。随后在 Bounded 保存点测量合法 click 候选的概率分布，并对多个保存点进行同题测量。10 月 18 日又用两条共享 R119 训练祖先的新数据流，做了条件性的未来表现预测检验。',
    finding: '动作类型熵过于粗糙，无法判断究竟点击了哪个候选。较细的点击候选测量中，一个保存点的平均熵为 0.763，模型最终选中候选的平均概率约为 63%。后续两条数据流的预设整组预测检验已经计算完成，但综合结论为 NOT_CONFIRMED（未达到确认标准），不能说熵已经能够提前预测任务失败。',
    interpretation: '测量合法点击候选以及逐 token 的概率，比只统计 search/click 动作类型更接近真实决策。两个后续流共用 R119 祖先，属于条件验证，不能冒充独立初始化的重复实验；整体预测检验未确认，也不构成提高做题能力的因果证据。',
    unknown: '目前还没有可信的、可跨新训练起点泛化的“entropy 能预测掉分”结论。后续需用真正独立的模型起点与预先冻结的训练/验证划分核实 click-choice entropy、token-level entropy 及具体错误之间的关系。',
    evidence: [
      { label: 'Q06 · 原始分析和预测方案', href: 'https://github.com/mykcs/openevo-experiment/pull/633' },
      { label: '七组独立固定模型评测结果', href: 'https://github.com/mykcs/openevo-experiment/pull/649' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q07',
    family: 'updating',
    title: '把某轮参数更新的方向反过来，成绩会怎样？',
    opening: '一次参数更新既有大小，也有方向。我们尝试只改变某一轮更新的方向，让同一个模型重新做相同的题，看看成绩会发生什么变化。',
    experiment: '选取已有模型的真实参数更新，把其中一轮 Task Vector（参数更新向量）的方向反过来，其他条件尽量保持不变；在固定的 64 道购物题上比较原模型和改动后的模型，并按同一道题的成绩差统计不确定性。',
    finding: '第 156 轮的方向反转相对完整未干预模型让 Task Score 下降约 10.06 分（0–100 分制），配对 95% 区间为下降 5.60–15.02 分。这是八次方向反转中通过预设多重比较校正的一次。',
    interpretation: '因此至少在这个模型状态、这个任务面板和这一次更新上，参数变化方向有可验证的因果作用；只分析范数大小不够。',
    unknown: '这不证明任意一轮或任意模型都遵循相同关系，也不等于已经构建了有效的在线方向控制器。',
    evidence: [{ label: 'Q07 · Task Vector 方向干预', href: 'https://github.com/mykcs/openevo-experiment/pull/634' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q08',
    family: 'generalization',
    title: '训练很多轮后，模型还会做以前学过的购物题吗？',
    opening: '模型训练到最后的总成绩高，仍可能不会做早先学过的某些题。要判断有没有遗忘，得先确认这些题以前确实学会过，再检查长期训练之后是否仍能完成。',
    experiment: '完成了原计划的十个旧任务保持评测单元，共 960 次任务尝试，尝试比较当初学会时与长时间训练后对同类任务的表现。',
    finding: '960 次评测已经运行完成，但部分任务缺少足够可靠的早期学习身份或刚学会时的可比评测，因此不能严格构造前后遗忘量。',
    interpretation: '测量执行完成与科学问题回答完成是两回事。没有可确认的“当初确实学过”起点，后期做错无法直接归为遗忘。',
    unknown: '当前不能证明有遗忘，也不能证明没有遗忘；是否可从已保存的早期训练记录恢复对照，仍决定了能够回答到什么程度。',
    evidence: [{ label: 'Q08 · 旧任务保持评测和证据边界', href: 'https://github.com/mykcs/openevo-experiment/pull/635' }],
    evidenceState: 'partial',
  },
  {
    id: 'q09',
    family: 'generalization',
    title: '改变模型收到的文字经验提示，会影响做题吗？',
    opening: 'Text Memory、Skill 和 Agent System 都可能给模型提供文字经验或行为指导。我们先核对这些内容多久改写一次，再检查：只改变模型读到的指导文字，做题结果会不会变化？完整关闭这些功能是更大的一步实验。',
    experiment: '先统计三条历史训练里参数和文字记忆分别改写了多少次，再针对 DirectApply R159 保留三类载体权限、只中和具体指导文字，在同一批 64 道题上比较成绩。随后两条用于后续研究的冻结训练流已延伸至 R159 末端状态，但这不是三类载体完整关闭的配对消融。',
    finding: '普通 OpenEVO 参数更新 159 次，Text Memory、Skill、Agent System 仅改写 2、1、3 次。10 月 15 日的三项文字中和实验，平均成绩差的 95% 区间都包含零。10 月 18 日两条后续流已产生第 160 轮对应的末端模型状态，但这项工作还没有通过原计划 40 轮对照的正式验收，仍有 32 次状态转换未按协议完成结算，不能算作完整对照实验。',
    interpretation: '文字很少改写，不代表模型很少读到它。文字提示中和实验只检查了提示内容变化；目前无法从这些数据推断彻底关闭整个 Text Memory、Skill 或 Agent System 的效果。',
    unknown: '完整消融还没有完成：尚未在统一条件下真正关闭三种文字载体权限并形成正式配对结论。两条新训练流的末端状态可用于后续分析，但不能据此证明文字记忆有效或无效；另一次商品结果页排序反转测试不属于文字记忆收益。',
    evidence: [
      { label: 'Q09 · 关闭文字载体的因果对照计划（尚未执行完整关闭）', href: 'https://github.com/mykcs/openevo-experiment/pull/636' },
      { label: 'Q09 · 2026-10-15 已完成的文字指导中和测试', href: 'https://github.com/mykcs/basemodel/blob/f6c857cccbb11183d5d98ca31ce861f4c4311729/public/research/seed-openevo/evidence/q17-checkpoint-diagnostics-20261015.json' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q10',
    family: 'generalization',
    title: '换一批真正新的任务，这些判断还能成立吗？',
    opening: '前面很多结论来自同一批题和特定模型状态。如果换一批从未用于选择方法的任务，还会看到相同方向吗？',
    experiment: '会后把这个问题独立列为 Q10：准备简化的训练方案、独立随机流与任务排除规则，目标是让新训练和新验证在结果公布前固定。',
    finding: '已有方案、部分固定身份与可复用历史证据；当前并没有三条新随机流全部完成 160 轮后的独立正式成绩。',
    interpretation: '独立复现需要在真正新的一批购物题上取得可比的重复结果。重新使用已反复检查的固定题，不能代替面对新题的最终测试。',
    unknown: '目前不能把 Q01–Q09 的局部研究结论推广为跨任务、跨随机种子的稳定定律。Q10 是会后自然延伸的研究问题，不是学长在会议上逐字问出的第十条。',
    evidence: [{ label: 'Q10 · 新任务独立复现计划和执行状态', href: 'https://github.com/mykcs/openevo-experiment/pull/637' }],
    evidenceState: 'unrun',
  },
] satisfies AdvisorQuestion[];

export const ADVISOR_Q03_CUSTOM_PANEL = [
  { update: 'A0', score: '3.71', exact: '0 / 64', note: '旧 Stage1 模型在 Q17 桥接面板的起点' },
  { update: 'A40', score: '6.43', exact: '0 / 64', note: '早期改善' },
  { update: 'A80', score: '0.69', exact: '0 / 64', note: '明显回落' },
  { update: 'A120', score: '6.62', exact: '0 / 64', note: '再次回升；训练在此暂停' },
] as const;

export const ADVISOR_Q04_CAPACITY = [
  { method: 'rank128', bytes: '205.6 MB', score: '62.98', exact: '33.3%' },
  { method: 'rank32', bytes: '51.4 MB', score: '61.19', exact: '34.2%' },
] as const;

export const ADVISOR_Q05_FROZEN = [
  { method: '普通 OpenEVO / DirectApply', score: '60.72', exact: '50 / 128' },
  { method: 'Bounded', score: '45.98', exact: '32 / 128' },
  { method: 'Bounded + 历史复杂 β/GDR', score: '20.77', exact: '10 / 128' },
] as const;

export const ADVISOR_Q09_UPDATES = [
  { method: '普通 OpenEVO', parametric: 159, textMemory: 2, skill: 1, agent: 3 },
  { method: 'Bounded', parametric: 158, textMemory: 3, skill: 0, agent: 0 },
  { method: 'Bounded + β', parametric: 154, textMemory: 2, skill: 0, agent: 0 },
] as const;
