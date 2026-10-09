/**
 * Advisor research-question report, evidence snapshot verified 2026-10-09.
 *
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
    title: '160 轮训练真的都有必要吗？',
    opening: '训练损失继续下降，不代表模型做 WebShop 任务的能力会一直提高。究竟什么时候该停止？',
    experiment: '我们把普通 DirectApply、Bounded 和历史 β/GDR 三类方法放在各自冻结的 64 道开发题上，比较第 0–160 轮的多个保存点，而不是拿最后的训练损失当答案。',
    finding: '三个方法的平台位置并不相同：普通 DirectApply 约第 120 轮，Bounded 约第 150 轮，历史复杂 β/GDR 约第 130 轮，后者在后段还明显下降。',
    interpretation: '“应该训练多少轮”是方法特有的问题。后期继续优化能否提高任务能力，要由开发题决定；不能从一条曲线推广到所有更新规则。',
    unknown: '这是同一开发协议上的近似平台，不是新的自动停止算法，也不是独立新任务集上的最终泛化结论。',
    evidence: [{ label: 'Q01 · 三机制停止点证据', href: 'https://github.com/mykcs/openevo-experiment/pull/628' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q02',
    family: 'learning',
    title: '普通 SFT 和 OPSD 能替代持续学习吗？',
    opening: '如果把成功经验直接训练进一套参数就足够好，我们就不能把效果全部归功于 SD-LoRA 的历史状态。',
    experiment: '先在相同数据与训练预算下比较普通 SFT 和 OPSD，再设计不同随机设置的重复训练。它检验的是初始参数的监督学习方式，不是 SEED 完整 Stage2。',
    finding: '早期 32 题对照中 OPSD 的平均任务分数略高，而 SFT 有更多完整成功；两者没有一致的单方面赢家。历史多遍 SFT 也没有表现出“训练越久越好”。10 月 4 日的服务器收据核账确认，六个固定训练格的训练 summary 均为 PASS。',
    interpretation: 'loss 降低、Task Score 和完整成功分别衡量不同层面。只有把同一模型、同一经验、同一开发题和重复训练结果对齐，才可以进一步判断哪种初始学习目标更好。',
    unknown: '六次训练均已完成，但统一固定开发题评测和六格完整配对统计尚未封存。训练成功只是输入模型准备完成，不能替代 SFT 与 OPSD 的科学胜负结论。',
    evidence: [
      { label: 'Q02 · 六次训练全部 PASS 的 10 月 4 日核账', href: 'https://github.com/mykcs/openevo-experiment/pull/629#issuecomment-5976961612' },
      { label: '早期目标消融网页', href: 'https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoStage1LearningObjectives.astro' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q03',
    family: 'learning',
    title: '为什么我们的 SEED 分数只有 6 分，论文却超过 87 分？',
    opening: '这是看完数据最自然的问题。先确认是否使用同一种尺度、同一套考题和同一种模型，再讨论训练算法有没有问题。',
    experiment: '历史 Q03 复用了 OpenEVO 冻结轨迹与 MiniMax 分析，完成三遍 Stage1 SFT；随后以不同于公开论文的自分析粒度和 OpenEVO 自定义 64 题评测运行 SEED-derived Stage2，到 A120 停下。另一条新的公开代码复现则独立收集 Stage1，不沿用旧 Q03。',
    finding: '在同一自定义 64 题上，Q03 的任务得分多次反转：A120 虽回到 6.62/100，但四个测量点的完整成功均是 0/64。论文的 Qwen3-1.7B 报告 87.10/100 和完整成功 77.3%，属于不同评测协议，不能直接作方法胜负判断。',
    interpretation: '数值可以统一换成百分制，实验仍然不能直接排名。Q03 使用弱的历史 Stage1 起点、不同提示和动作解释、非空文字载体、温度 1.0 和 64 题；论文使用另一套原生 128 题。我们知道这些差异存在，但还不知道各自造成了多少分的差距。',
    unknown: 'Q03 的原生 SEED 验证尚无可靠封存成绩，不能宣称“SEED 方法失败”。全新公开代码路线已采集 1,440 条 Stage1 轨迹，取得 1,200 条有效教师标注，但截至所核的 10 月 8 日收据，正式 SFT 和 Stage2 仍没有可报告的能力分数。',
    evidence: [
      { label: 'Q03 · A0–A120 封存与原生评测差异', href: 'https://github.com/mykcs/openevo-experiment/pull/678' },
      { label: 'Q03 历史 Stage2', href: 'https://github.com/mykcs/openevo-experiment/pull/630' },
      { label: '从头复现公开 SEED 的独立实验', href: 'https://github.com/mykcs/openevo-experiment/pull/677' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q04',
    family: 'updating',
    title: '长期参数状态真的需要 rank128 吗？',
    opening: '保存越来越多参数会增加成本。若只保留一部分方向，能力能保住多少？',
    experiment: '在匹配的第 152–159 轮继续训练中，比较 rank128 和 rank32，复用同样的任务、随机设置与 1,024 次任务尝试。',
    finding: 'rank32 的长期参数文件约 51.4 MB，rank128 约 205.6 MB；相应 Task Score 为 61.19 和 62.98/100，完整成功率约 34.2% 和 33.3%。文件缩小到四分之一，分数并没有同步缩到四分之一。',
    interpretation: 'rank128 的全部容量还未被证明必要。但“差距不大”不等于统计上已经证明两个容量等价或严格非劣。',
    unknown: 'rank8、16、64 的完整能力/续学结果仍需看各自封存数据；当前不能从几何上的低有效秩直接推断所需的最小可学习容量。',
    evidence: [
      { label: 'rank32 已完成的配对证据', href: 'https://github.com/mykcs/openevo-experiment/pull/597' },
      { label: 'Q04 · 更小容量正式实验', href: 'https://github.com/mykcs/openevo-experiment/pull/631' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q05',
    family: 'updating',
    title: '把更新幅度缩小，为什么仍可能掉分？',
    opening: '历史 β 门控既可能改变更新幅度，也可能改变方向；得分变差后，到底是哪一种影响？',
    experiment: '先回看三组在同一冻结 128 题上的终评，再开展更简单的 β 实验：固定当前更新的方向，只对更新幅度乘非负系数。',
    finding: '冻结终评里，普通 DirectApply 为 60.72，Bounded 为 45.98，Bounded 加历史 β/GDR 为 20.77/100。新简单 β 在第 120 轮检查到缩放前后方向余弦约 0.9992，说明这一节点基本保持方向。',
    interpretation: '旧复杂 β/GDR 的结果提醒我们：参数机制更复杂不保证能力更高。新规则的一次方向检查只说明“实现接近我们设计的缩放方式”，不说明它会让任务分数回升。',
    unknown: '简单 β 的正式能力配对和误差区间尚未封存，不能借用历史复杂 β 的结果替它得出结论。普通路线是历史前驱，Bounded 与 β 是更接近正式匹配的对照。',
    evidence: [
      { label: 'Q05 · 简单 β 训练进度与方向收据', href: 'https://github.com/mykcs/openevo-experiment/pull/632' },
      { label: '已有三路线冻结终评', href: 'https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q06',
    family: 'updating',
    title: '模型越犹豫，后面就越容易掉分吗？',
    opening: 'WebShop 真正困难的是“点哪个商品/颜色/按钮”，只统计 search 还是 click 的两类概率不够。',
    experiment: '后来改看具体合法点击候选的概率分布，并在 Bounded 第 120 轮的固定 64 题上测量。又补了七组模型保存点、每组 64 题的观察。',
    finding: '一个固定保存点上的具体点击候选平均 entropy 为 0.763，最终选择的平均概率约 63%，前三候选合计约 93%。这描述了选择时的犹豫程度，属于已测量的诊断。',
    interpretation: '熵可以回答“现在面对这些合法候选，模型有多拿不准”；不能仅因它与某个低分节点同时出现，就说熵是之后失败的原因。',
    unknown: '七组共 448 道任务的预测研究尚未形成无泄漏的独立训练/验证划分，因此没有可信的“entropy 可以提前预测掉分”结论。',
    evidence: [
      { label: 'Q06 · 原始分析和预测方案', href: 'https://github.com/mykcs/openevo-experiment/pull/633' },
      { label: '七组独立固定模型评测结果', href: 'https://github.com/mykcs/openevo-experiment/pull/649' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q07',
    family: 'updating',
    title: 'Task Vector 的方向本身会影响任务能力吗？',
    opening: '一次参数更新不只有大小，还有方向。把更新方向反过来，模型会怎样？',
    experiment: '在冻结的 64 题开发面板上选多个真实更新点，保留其他设置，只反向施加某一轮的 Task Vector，并进行配对检验及多重比较校正。',
    finding: '第 156 轮的方向反转让 Task Score 下降约 10.06 分（0–100 分制），配对 95% 区间为下降 5.60–15.02 分。这是八次方向反转中通过预设多重比较校正的一次。',
    interpretation: '因此至少在这个模型状态、这个任务面板和这一次更新上，参数变化方向有可验证的因果作用；只分析范数大小不够。',
    unknown: '这不证明任意一轮或任意模型都遵循相同关系，也不等于已经构建了有效的在线方向控制器。',
    evidence: [{ label: 'Q07 · Task Vector 方向干预', href: 'https://github.com/mykcs/openevo-experiment/pull/634' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q08',
    family: 'generalization',
    title: '学会一件事后，模型能把它留下来吗？',
    opening: '末尾分数高，不代表它仍会做早先学会的那些任务；持续学习需要同时看新能力与旧能力。',
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
    title: 'Text Memory、Skill、Agent System 真的有用吗？',
    opening: '它们改写的次数很少。但如果某条文字记忆始终被读取，仅凭改写次数少无法断定它不起作用。',
    experiment: '先核对三条长周期实验里，参数状态和三类文字载体各发生了多少次实际内容更新，再设计在其他条件相同时关闭这些载体的对照。',
    finding: '普通 OpenEVO 的参数状态更新 159 次，而 Text Memory / Skill / Agent System 只有 2 / 1 / 3 次；Bounded 与 β 路线的文字更新更少。',
    interpretation: '已知的是内容改写频率，不是它们在任务中被引用的频率或对最终分数的因果贡献。',
    unknown: '真正的关闭载体实验尚无可报告的完成结果。不能用“很少写新笔记”推出“关掉它不会影响能力”。',
    evidence: [{ label: 'Q09 · 文字状态因果对照计划', href: 'https://github.com/mykcs/openevo-experiment/pull/636' }],
    evidenceState: 'unrun',
  },
  {
    id: 'q10',
    family: 'generalization',
    title: '换一批真正新的任务，这些判断还能成立吗？',
    opening: '前面很多结论来自同一批题和特定模型状态。如果换一批从未用于选择方法的任务，还会看到相同方向吗？',
    experiment: '会后把这个问题独立列为 Q10：准备简化的训练方案、独立随机流与任务排除规则，目标是让新训练和新验证在结果公布前固定。',
    finding: '已有方案、部分固定身份与可复用历史证据；当前并没有三条新随机流全部完成 160 轮后的独立正式成绩。',
    interpretation: '独立复现需要的是新任务上同口径的重复结果，不是把旧题再换一个文件名，也不是将开发题评估当成最终测试。',
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
