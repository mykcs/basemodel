/**
 * Advisor research-question report, evidence snapshot verified 2026-10-09.
 *
 * Q09 additionally summarizes the frozen 2026-10-15 R159 text-guidance
 * neutralization receipt; full carrier-off ablation remains unrun.
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
    opening: '训练一轮就要再消耗一批任务和参数更新计算。模型什么时候已经学得差不多了？继续训练 160 轮还值得吗？',
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
    finding: '早期同一批 32 道题上，OPSD 的平均 Task Score 是 36.01/100，SFT 是 34.96/100；完整做对的题目分别是 0/32、3/32。平均分差的 95% 置信区间跨过零，现阶段没有明确赢家。另有六次固定设置的训练在 10 月 4 日核账均已完成，但六组统一评测结果尚未封存。',
    interpretation: '这组实验先比较两种训练方式能否给后续学习提供更好的起点。平均分、完整成功数和训练损失回答不同的问题；SFT 或 OPSD 在第一阶段的局部表现，不能直接回答“后续持续学习是否值得”。',
    unknown: '六种固定训练设置都已运行，但它们在同一套固定购物题上的完整对照成绩尚未封存。早期 32 题的结果无法确定哪种初始训练方式在新任务上更好，更没有比较两种方式经过长期逐轮学习后的差异。',
    evidence: [
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
    title: '把长期参数容量从 rank128 缩到 rank32，做题成绩会怎样？',
    opening: 'rank128、rank32 指长期保存参数状态所用的两种容量设置。较小的设置能够节省存储，但我们需要在相同任务上测量做题能力会不会随之下降。',
    experiment: '在第 152–159 轮比较 rank128 与 rank32：两种设置做同样的题，尽可能保持随机条件一致，一共记录 1,024 组同题比较结果。',
    finding: 'rank128 与 rank32 的参数文件分别约 205.6 MB、51.4 MB，做题均分分别是 62.98、61.19/100。rank32 文件小了约 75%，均分低 1.79 分；95% 置信区间为 −3.68 至 +0.12 分，当前尚不能确定它一定造成稳定的成绩损失，也未证明完全无损。',
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
    title: '增加参数写入控制后，模型做题成绩有什么变化？',
    opening: '历史实验在 Bounded 固定容量方法上增加了复杂的 β/GDR 写入规则。后来又设计了只调节写入大小的简单 β。它们是两种不同的实验，需要分别看实际成绩与更新方向。',
    experiment: '先让普通 OpenEVO、Bounded 和带历史 β/GDR 的模型各自完成固定的 128 道购物题，核对训练结束的得分。再对较新的简单 β 检查参数更新方向是否保持一致；它的正式做题成绩还没有完成同题比较。',
    finding: '同一套 128 题的历史成绩是：普通 OpenEVO 60.72 分、Bounded 45.98 分、Bounded 加历史 β/GDR 20.77 分。较新的简单 β 在第 120 轮测得缩放前后方向余弦约 0.9992，只说明这一处更新方向基本保持一致。',
    interpretation: '历史 β/GDR 路线的成绩比 Bounded 更低，需要继续分清写入规则与训练历史的作用。简单 β 的方向检查结果不等于它已经提高了做题成绩。',
    unknown: '新的简单 β 还缺少正式的同题能力比较和不确定性分析。普通 OpenEVO 是更早的历史路线，不能将三组终评误当成从完全相同起点训练的随机三组试验。',
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
    experiment: '在 Bounded 的一个第 120 轮模型版本上，测量模型面对合法点击选项时分配的概率；另外检查七个已保存的模型版本，每个版本使用固定的 64 道题。',
    finding: '一个模型版本的合法点击候选平均熵（表示选择有多分散）为 0.763；最终选中的候选平均概率约 63%，排在前三的候选合计约 93%。这些是当前做选择时的观察结果。',
    interpretation: '概率分布可以帮助描述模型当前有多确定，但要用来提前预测后面哪些题会失败，还需要专门的预测实验。',
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
    title: '把某轮参数更新的方向反过来，成绩会怎样？',
    opening: '一次参数更新既有大小，也有方向。我们尝试只改变某一轮更新的方向，让同一个模型重新做相同的题，看看成绩会发生什么变化。',
    experiment: '选取已有模型的真实参数更新，把其中一轮 Task Vector（参数更新向量）的方向反过来，其他条件尽量保持不变；在固定的 64 道购物题上比较原模型和改动后的模型，并按同一道题的成绩差统计不确定性。',
    finding: '第 156 轮的方向反转让 Task Score 下降约 10.06 分（0–100 分制），配对 95% 区间为下降 5.60–15.02 分。这是八次方向反转中通过预设多重比较校正的一次。',
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
    experiment: '先在三条历史长跑里数清参数状态与文字状态分别改写了多少次。之后针对 DirectApply R159，保持三个载体的使用权限，只把具体指导文字替换成不提供指导的文字，让模型在同一批 64 道题上再做一次对照；关闭整个载体的消融仍未完成。',
    finding: '历史普通 OpenEVO 参数状态更新 159 次，Text Memory / Skill / Agent System 分别只改写 2 / 1 / 3 次。10 月 15 日针对 R159 的三种文字提示中和实验已经完成，但三个平均得分差的 95% 区间均包含零；结果不足以确定哪种文字提示稳定提高了做题成绩。',
    interpretation: '文字很少改写，不代表模型很少读到它。文字提示中和实验只检查了提示内容变化；目前无法从这些数据推断彻底关闭整个 Text Memory、Skill 或 Agent System 的效果。',
    unknown: '彻底关闭三种文字载体权限、其他条件保持一致的完整消融还没有完成。另一次将购物结果页顺序反转导致了成绩下降，那测的是页面排列敏感性，不能算成文字记忆的效果。',
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
