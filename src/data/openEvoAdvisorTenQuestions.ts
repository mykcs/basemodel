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
    title: '训练 160 轮会不会太多？',
    opening: '这里的“轮”是 OpenEVO 反复执行购物任务、整理经验并继续学习的迭代，不是把同一份固定训练集完整遍历一次的 epoch。有些轮次没有真正更新参数，而普通 OpenEVO 曲线按实际参数更新次数统计。我们想知道训练到什么时候继续做题已经没有明显收益。',
    experiment: '我们把普通 OpenEVO、Bounded 和历史 β/GDR 各自保存的 11 个训练阶段模型，放到预先固定的同一批 64 道 WebShop 开发题上测试。除了平均 Task Score，还看完整做对的题数；按照事先约定的规则，如果后来已测的版本既没有高出超过 2 分，也没有多做对超过 2 道题，就把较早版本记作候选停止时点。这是在已保存的模型之间比较，并没有证明未来再训练永远不会变好。',
    finding: '普通 OpenEVO 在第 120 次参数更新时的 Task Score 为 60.40 分，第 160 次更新时为 60.11 分；Bounded 在第 120 轮得 58.72 分，到第 150 轮提高到 67.25 分；历史 β/GDR 在第 130 轮得分约为 58.16 分，到第 160 轮降至 45.24 分。以上 Task Score 均为满分 100 分的同题开发集成绩。三种方法的训练轨迹并不相同，因此 120 轮只能作为普通方法在这批题上的局部参考。另有 β-gating 延长至 200 轮的历史轨迹，不能当成三方法均已完成的新题终评。',
    interpretation: '学长担心 160 轮过长，是有依据、值得分方法回答的问题。普通 OpenEVO 在这批题上较早进入收益很小的阶段；Bounded 后期仍能提高；历史 β/GDR 后段掉分。我们由此知道训练轮数不能对三种机制使用同一条停止规则。',
    unknown: '这 33 个模型版本用的是固定 64 道开发题，所选停止点也只是已测版本中的判断。还缺事先冻结的新题验证，以及对三种方法更长训练阶段的同等口径评测。不能把已有 200 轮训练轨迹误报为尚未做过，也不能把它冒充新题上的泛化结论。',
    evidence: [{ label: 'Q01 · 真实三机制保存点曲线与停止判据', href: 'https://github.com/mykcs/openevo-experiment/blob/48e1368c7afc260a1745a49e6c7c173bfbb172b2/docs/evidence/advisor-q01-horizon-plateau-20261001/Q01_THREE_WAY_RESULT.json' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q02',
    family: 'learning',
    title: '开始长期学习前，SFT 和 OPSD 哪种方法更好？',
    opening: 'OpenEVO 开始长期逐轮学习之前，先要用已有经验训练出一套起始参数。这里比较 SFT 与 OPSD 两种训练起点的方式。哪种初始训练方式更好，和后续多轮学习能否继续提高能力，是两个需要分别检验的问题。',
    experiment: '第一阶段先让同一个 Qwen 起始模型学习已有购物经验。SFT（Supervised Fine-Tuning）直接模仿示范回复；OPSD 则让教师视角看到更多经验信息，再指导学生学习。新的匹配训练按两种方法、三组随机设置和每组三个训练周期（epoch）组织，共有 18 个模型评测位置；它只研究怎样获得更好的初始模型，后续逐轮学习另需单独比较。',
    finding: '早期 32 道题上，OPSD 的 Task Score 为 36.01 分，32 道题中没有完整成功的任务；SFT 得 34.96 分，32 道题中完整成功 3 道（Task Score 满分 100 分），平均分差的 95% 区间跨零。新一批训练中，SFT 和 OPSD 各有 3 组完成并通过检查，18 个评测位置中已有 15 个模型版本完成同一批 64 道开发题的评测，每份记录均为 PASS。这表示我们测出了更多初始模型的表现；执行 PASS 不能代替最终的逐题配对统计，因此还不能确定哪种训练目标更好。',
    interpretation: '这项研究现在可以回答：SFT 和 OPSD 都已实际训练，并且已有多个同题成绩；早期结果没有明确赢家。一次训练完成、一个模型在评测器上成功运行，与两种方法谁带来稳定的能力提升，是三件不同的事。即使某种方法在起点更好，也不保证再进行 120 或 160 轮长期学习后仍然占优。',
    unknown: '原本规划的 18 个评测位置仍有 3 格缺少可验收的同口径结果，完整的同任务配对比较和不确定性分析尚未封存。还没有让这两类起始模型按相同长期逐轮学习预算独立训练，从而回答初始训练方式会不会改变后续学习的收益。',
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
    title: '我们的 SEED 实验成绩为什么比论文低这么多？',
    opening: '历史 Q03 模型在我们使用的 64 道购物题上只有约 6 分，SEED 论文报告的另一套测试分数超过 87 分。两边使用的题目、提示和训练流程不同。先把考试条件对齐，才能讨论成绩差距从哪里来。',
    experiment: '历史 Q03 先利用已有轨迹和 MiniMax 的经验分析做初始训练，再沿自己的 OpenEVO 方式逐轮更新，只在自定义的 64 道 WebShop 题上保存 A0、A40、A80、A120 四个阶段成绩。SEED 论文公开评测使用另一套 128 题和原生提示/动作处理方式；历史路线在起始模型、采样配置和 Memory/Skill/Agent 载体上也有不同。我们已另开一条从公开 SEED 配方出发的复现线，不能将两条路线的成绩拼在一起。',
    finding: '历史 64 题评测中，A0 模型得 3.71 分，A40 得 6.43 分，A80 得 0.69 分，A120 得 6.62 分（Task Score 满分 100 分）；四个模型都没有完整做对任何一道题；A80 明显掉分，A120 又回升，并未形成随轮次稳定提高的曲线。独立公开复现另有三组工程模型也有独立的开发题结果：SFT 初始模型得 4.07 分、512 次尝试中完整成功 1 次；Step30 得 3.97 分、成功 1 次；Step60 得 4.28 分、成功 3 次。每个模型均在相同的 64 道题上重复尝试 8 次；这是工程诊断，并非论文原生的正式 SEED 成绩。',
    interpretation: '现在能解释成绩为何不能直接排名：我们和论文的模型起点、题单、提示、动作语义、训练步骤都没有完全对齐。把 64 题分数乘 100 只统一了数字格式，并没有让它成为论文的 128 题成绩。现有结果可以定位历史复现的困难，仍不能直接判断方法优劣，也不能断言哪个单独因素造成了低分。',
    unknown: '历史 A120 已封存且后续训练暂停；原生 128 题评测尚无可靠完整成绩。按论文公开配方的独立复现已经准备第一阶段数据并进行工程测试，但正式 SFT 尚无经封存的科学成绩，计划进行 160 轮的正式 Stage2 尚未启动，论文协议对应的最终评测亦未完成。优先完成相同评测协议下的校准，再决定重启哪条正式实验。',
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
    experiment: '我们先做一个可控的小问题：在接近 160 轮训练结束的末尾八轮（第 152–159 轮），新增 rank32 的续训与做题测试，和已经封存的 rank128 同题结果配对，合计 1,024 组比较，没有重跑 rank128。这里的 rank 表示长期低秩参数容量。之后又在 Q04 Phase-A 对 rank8、rank16、rank32、rank64、rank128 五档做了共 640 次开发题筛选，选出值得继续研究的容量。',
    finding: 'rank128 的参数文件约为 205.6 MB，平均 Task Score 为 62.98 分；rank32 的文件约为 51.4 MB，平均得分为 61.19 分（Task Score 满分 100 分）；rank32 文件小约 75%，平均低 1.79 分，配对 95% 区间为 −3.68 到 +0.12 分。进一步的五档容量第一阶段评测已完成计划中的全部 640 次任务尝试，但没有出现稳定、清晰的最优容量拐点。这些测量来自不同实验阶段，不能直接合并成一条连续训练曲线。',
    interpretation: '我们已经证明，在这个末尾阶段，较小的参数文件仍能保留大部分观测做题能力，rank128 的完整容量还没有被证明必要。不过，置信区间包含零并不等于两个容量统计等价；能压缩旧状态，也不保证之后再学习很多轮依然有效。',
    unknown: '第一阶段五档容量已测，剩下需要回答的是从较早阶段持续使用较小容量，能否吸收新任务经验并保留旧能力。第二阶段选定 rank128、rank64、rank32，已有部分真实训练记录但尚无全部匹配流的封存结论，因此还不能给出长期学习的最小充分 rank。',
    evidence: [
      { label: 'rank32 已完成的配对证据', href: 'https://github.com/mykcs/openevo-experiment/pull/597' },
      { label: 'Q04 · 更小容量正式实验', href: 'https://github.com/mykcs/openevo-experiment/pull/631' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q05',
    family: 'updating',
    title: 'β 写入控制会让模型学得更好吗？',
    opening: '历史实验在 Bounded 固定容量方法上增加了复杂的 β/GDR 写入规则。后来又设计了只调节写入大小的简单 β。它们是两种不同的实验，需要分别看实际成绩与更新方向。',
    experiment: '我们先比较三条历史长跑：普通 OpenEVO、固定容量 Bounded，以及加入复杂 β/GDR 写入规则的 Bounded；它们共享冻结 128 题，但不是从完全相同起点随机重复的三臂实验。之后单独设计更简单的 β，只调整每轮写入幅度，检查更新方向是否仍保持。为了解释一次 R126 方向门槛事件，又做了独立敏感性实验：R125 不写入对照与 R126 触发门槛的候选，分别在起点与短程后、开发题与旧任务保持题上各测 64 道题，共 8 组。',
    finding: '历史终评中，普通 OpenEVO 得 60.72 分，Bounded 得 45.98 分，历史复杂 β/GDR 得 20.77 分（均为满分 100 分的同一批 128 道题）；历史复杂 β/GDR 路线得分最低。简单 β 在 R120 的局部更新方向余弦接近 1；另一项短程敏感性实验完成 8 组、每组 64 次任务尝试，共 512 次评测。以其中两组为例，起点开发题上 R126 候选的平均得分为 55.53 分，R125 对照为 62.29 分；在 R127 后的旧题保持测试中，R126 候选得 67.78 分，R125 对照得 64.75 分。不同题单和阶段出现不同排序，不能混用成单个增益数字。',
    interpretation: '我们知道历史复杂 β/GDR 的最终分数比固定容量 Bounded 低，也知道新简单 β 不会在已测局部显著改变更新方向。但不能把复杂机制的掉分直接归因于简单 β。R126 跨越的冻结门槛来自八轮历史更新的最小余弦，不是一个经过大规模行为验证的安全阈值；后续 512 次评测也不能自动证明简单 β 提高了长期做题能力。',
    unknown: '新的简单 β 的完整多单元训练、原计划 1,280 次同题评估与最终配对统计仍未封存；独立的 512 次短程敏感性评测不能直接顶替原合同。仍需在相同起点和题目条件下分别确认写入大小、方向与旧知识保持的实际作用。',
    evidence: [
      { label: 'Q05 · 简单 β 训练进度与方向收据', href: 'https://github.com/mykcs/openevo-experiment/pull/632' },
      { label: '已有三路线冻结终评', href: 'https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q06',
    family: 'updating',
    title: '模型做选择时有多犹豫？能用熵来衡量吗？',
    opening: '学长希望用 entropy（熵）观察模型在做决定时有多犹豫，尤其是 token-level entropy（逐 token 熵）。WebShop 里最关键的是具体选择哪个商品或规格，单独知道动作属于 search 还是 click，回答不了这个问题。',
    experiment: '学长希望用 entropy（熵）衡量模型的决策不确定性，特别是逐 token 熵（token-level entropy），而不是只有做题分数。第一版训练结束后，我们先从保存的轨迹回算 action-family entropy（动作类型熵），只统计 search 和 click 两类动作；之后才真正测量合法点击候选的概率分布与 click-choice entropy。再用新的任务流检验这些概率指标能否提前预测后续错误。',
    finding: 'WebShop 大多数动作本来就是搜索或点击：两个模型即使 search/click 比例完全相同，也可能点中完全不同的商品，因此第一版动作类型熵无法回答“它究竟选哪个选项时有多犹豫”。在一个保存点上，合法点击候选的平均熵为 0.763，最终被选中选项的平均概率约 63%；这里的 63% 是模型给自己选择的概率，并不是正确率。后续两条共享 R119 祖先的新数据流已经完成条件预测分析，但预设整组结论为 NOT_CONFIRMED（尚未确认）。',
    interpretation: '这一轮真正回答了两件事：旧测法的粒度太粗；更细的候选概率确实能描述模型在具体选择上的分散程度。不过，从能描述犹豫到能预测未来会做错，再到能据此改善决策，还需要分别验证。新的两条流共享早期训练祖先，并非两次独立初始化，更不能把相关性直接当作因果。',
    unknown: '我们尚未获得可在独立模型起点和新题上重复的熵预测结论。旧 DirectApply R159 历史动作轨迹没有保存逐 token logits，不能事后从 search/click 重算出当时的 token-level entropy；以后的前瞻评测必须在生成时按冻结协议保存对应概率。',
    evidence: [
      { label: 'Q06 · 原始分析和预测方案', href: 'https://github.com/mykcs/openevo-experiment/pull/633' },
      { label: '七组独立固定模型评测结果', href: 'https://github.com/mykcs/openevo-experiment/pull/649' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q07',
    family: 'updating',
    title: '参数更新的方向，会影响模型的做题能力吗？',
    opening: '一次参数更新既有大小，也有方向。我们尝试只改变某一轮更新的方向，让同一个模型重新做相同的题，看看成绩会发生什么变化。',
    experiment: 'Task Vector（参数更新向量）同时记录了参数改变的大小与方向。我们以 Bounded（未加 β）的最终模型为基准，选取训练末尾 R152–R159 的八次真实参数更新：对每次分别构造“删除这轮更新”和“保持幅度、把方向反过来”两个条件，并在同一批 64 道题上比较。整个矩阵包含完整模型、早期参考模型和 16 个干预状态；新运行 1,088 次评测，另外 64 次完整模型评测经身份核验后复用。',
    finding: '在八个方向反转测试中，只有第 156 轮相对完整、未干预的 Bounded 模型显示稳定下降：Task Score 平均低 10.06 分，配对 95% 区间约为下降 5.60–15.02 分，并通过对八次反转进行的 Holm 多重比较校正。单独删除某一轮更新的八组比较则没有通过各自的校正。两种干预的结果不能互相替代。',
    interpretation: '至少在 Bounded 的这一轮、这一批开发题上，参数更新的方向具有可验证的因果影响。也就是说，只看更新量有多大不够；把同样大小的更新转向别处，做题能力可能明显变化。不过这不是一个已经能自动筛选更新方向的控制器。',
    unknown: '目前还没有对普通 OpenEVO、Bounded + β 做等口径的八轮删除/反转比较，也没有在独立任务和不同训练种子上确认方向规律。下一步要比较三种方法对方向干预的响应，再判断是否值得研究方向控制，而不能从 R156 一个显著点直接推出普适规则。',
    evidence: [{ label: 'Q07 · Task Vector 方向干预', href: 'https://github.com/mykcs/openevo-experiment/pull/634' }],
    evidenceState: 'bounded-answer',
  },
  {
    id: 'q08',
    family: 'generalization',
    title: 'OpenEVO 训练很多轮以后，会忘记以前学会的任务吗？',
    opening: '模型训练到最后的总成绩高，仍可能不会做早先学过的某些题。要判断有没有遗忘，得先确认这些题以前确实学会过，再检查长期训练之后是否仍能完成。',
    experiment: '我们想测 Catastrophic Forgetting（灾难性遗忘）：模型学会新题后，会不会忘记原来能做对的旧题？为了判断这一点，必须同时有“当初确实学会”的证据和“后来同一题做不好”的证据。我们已完成 10 个旧任务保持评测单元、共 960 次任务尝试；另有 DirectApply 的 R129 和 R159 在一组 12 道旧题上的补充配对测量。这两套评测范围不同，不应相加后当作独立旧题数量。',
    finding: '960 次旧任务尝试已经运行完成，但若某题从来没有被可靠证明学会，后期失败就不能判为遗忘。在 12 道旧题的补充测量中，R159 相比 R129 的完整成功率低 9.38 个百分点，但按题目配对的 95% 区间包含零。现有记录因此既不能证明稳定的灾难性遗忘，也不能证明模型绝不会忘记。',
    interpretation: '例如一件旧商品在第 40 轮就能正确买到、第 160 轮却失败，才可能支持遗忘；如果缺少第 40 轮成功记录，就只知道模型现在做错。我们完成了旧任务评测的执行部分，也确定了缺失的早期学习证据正是阻止下结论的关键。',
    unknown: '许多旧任务缺少第一次真正学会时的可靠成绩，三种方法也未建立同起点、多随机种子的完整可比保持曲线。下一步需先补齐 exposure（是否经历过该题）与 first-post（学会后的第一次评测）证据，之后才能衡量遗忘量或设计专门的抗遗忘机制。',
    evidence: [{ label: 'Q08 · 旧任务保持评测和证据边界', href: 'https://github.com/mykcs/openevo-experiment/pull/635' }],
    evidenceState: 'partial',
  },
  {
    id: 'q09',
    family: 'generalization',
    title: '模型外部保存的文字经验，究竟有多大作用？',
    opening: 'Text Memory、Skill 和 Agent System 都可能给模型提供文字经验或行为指导。我们先核对这些内容多久改写一次，再检查：只改变模型读到的指导文字，做题结果会不会变化？完整关闭这些功能是更大的一步实验。',
    experiment: 'OpenEVO 的 BUNDLE 同时包含参数状态和文字状态：Text Memory、Skill Bundle、Agent System。我们先统计三种方法在 160 轮里各类状态真正被改写的次数，再对 DirectApply R159 保留三类载体权限、只把指导文字换成不提供提示的文字，在相同 64 道题上比较。更大规模的后续工作还有两条冻结训练流延伸到 R159 末端状态；它们和“完全关闭载体”是不同的实验。',
    finding: '普通 OpenEVO 在 160 轮中更新参数 159 次，Text Memory 改写了 2 次，Skill 改写了 1 次，Agent System 改写了 3 次。10 月 15 日三种指导文字中和测试的平均成绩差，95% 区间都包含零，因此没有发现可确认的稳定增益。10 月 18 日两条后续流已经产生第 160 轮对应的末端状态，但原计划 40 轮对照的完整科学验收仍有 32 次状态转换未正式结算；末端模型存在不能替代整套消融完成。',
    interpretation: '文字经验很少重新写，不代表它在任务中很少被读取。例如一条“购买前核对尺寸”的经验只写一次，也可能被后续很多次任务使用。我们测得的是改写频率和改变提示内容的局部影响，目前不能从这些结果判断如果完全关闭 Text Memory、Skill 或 Agent System 会怎样。',
    unknown: '完整消融还没有完成：三种文字载体分别关闭权限、其他因素保持一致的能力对照还缺正式封存。结果页顺序反转引起的成绩下降属于界面排列敏感性，不能算作文字记忆收益。后续还需研究文字状态与参数更新之间是否存在可重复的互补作用。',
    evidence: [
      { label: 'Q09 · 关闭文字载体的因果对照计划（尚未执行完整关闭）', href: 'https://github.com/mykcs/openevo-experiment/pull/636' },
      { label: 'Q09 · 2026-10-15 已完成的文字指导中和测试', href: 'https://github.com/mykcs/basemodel/blob/f6c857cccbb11183d5d98ca31ce861f4c4311729/public/research/seed-openevo/evidence/q17-checkpoint-diagnostics-20261015.json' },
    ],
    evidenceState: 'partial',
  },
  {
    id: 'q10',
    family: 'generalization',
    title: '换一批新任务，OpenEVO 的实验结论还成立吗？',
    opening: '旧题上的分数不是普遍规律。即使其他实验曾发现更新一次参数后换题提分，也不能据此判断连续学习 160 轮后是否仍然有效。',
    experiment: '这是由学长会议议题延伸出的会后问题。这里分开两个问题：此前有训练一次后拿没用于训练的新购物题考试的局部迁移测试；当前 Q10 则要先固定一个模型起点和一套简单方法，换三条独立的任务顺序及生成随机流重新训练 160 轮，再在同一批冻结的新题上与匹配对照逐题比较。Q10 的 128 道新 WebShop 确认题已完成训练题、开发题及允许的历史终评身份排除和独立核验。通常是三条新方法流加三条匹配对照流；只有完整科学身份确实相同，才能事先登记去重。这不是同时复现普通、Bounded 和 β 三种方法的全部机制。',
    finding: '在此前另一组 7B 模型条件下，H1.38B 与 H1.39 的单次更新新题测试里，SD-LoRA 相对基础模型的平均奖励分别高 0.124 和 0.249（以 0–1 标度计），两次 95% 置信区间下界均高于零。这支持这些条件下的一次更新迁移，不是 Q10 的长期训练结果。截至 2026 年 10 月 18 日的 Q10 冻结收据，新 128 题尚未接受正式模型评测，新训练流及其配对成绩也未封存。',
    interpretation: '当前能说的是：已有特定模型和题集上的单次新题收益，长期独立复现仍然未知。Q10 只确认预先冻结的一种简单方法、一个模型起点与匹配对照的稳定性；即使以后通过，也不能自动宣布前九问的停止轮次、参数容量、方向干预等结论已在新题上一并成立。ALFWorld 等新环境需要单独实验。',
    unknown: '下一步先验证完整持久存储和准确恢复、热工作集峰值及 GPU6 共卡条件，并取得匹配的科学方案、资源资格与正式启动许可；之后执行三条独立训练流及对照，封存逐题得分、置信区间和训练阶段变化。已有 CPU 存储/恢复测试不等于 GPU 科研任务已经启动。',
    evidence: [
      { label: 'Q10 · 已冻结的 128 道新题与独立排重结果（尚无成绩）', href: 'https://github.com/mykcs/openevo-experiment/blob/98253146d04d24505127655c631fdc15c3f5749f/docs/evidence/q10-gpu6-preparation-20261018/confirmation-panel-freeze-progress-20261018.json' },
      { label: 'Q10 · 当前简单配方、三条独立训练流及匹配对照', href: 'https://github.com/mykcs/openevo-experiment/blob/98253146d04d24505127655c631fdc15c3f5749f/docs/science/webshop/advisor-questions/2026-09-22/Q10_SIMPLE_PARAMETRIC_REPLICATION.md' },
      { label: 'Q10 · 存储恢复工程资格和正式启动边界', href: 'https://github.com/mykcs/openevo-experiment/blob/98253146d04d24505127655c631fdc15c3f5749f/docs/evidence/q10-gpu6-preparation-20261018/exact-storage-qualification/current-index.json' },
      { label: 'H1.38B · 一次更新后的内部新题迁移结果', href: 'https://github.com/mykcs/openevo-experiment/blob/1971fad6602d23d499a5de8bd4bf718947207d86/docs/evidence/remote-runs/2026-08-20/h1.38b-correction-02/reconciliation-summary.json' },
      { label: 'H1.39 · 另一批新题的独立复验', href: 'https://github.com/mykcs/openevo-experiment/blob/1971fad6602d23d499a5de8bd4bf718947207d86/docs/evidence/remote-runs/2026-08-20/h1.39-mr/reconciliation-summary.json' },
      { label: 'SEED · 论文原文（跨环境验证的后续参照）', href: 'https://arxiv.org/abs/2607.14777' },
    ],
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

// SEED v1 Table 1, Qwen3-1.7B-Instruct, WebShop: paper-reported only.
// The paper reports the normalized Score / 100 and Succ. %, but does not
// publish a verifiable count of exact successes or matching per-task IDs.
// Never merge this source into our three historical frozen 128-task arms.
export const ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE = {
  method: 'SEED（论文；Qwen3-1.7B-Instruct）',
  score: '87.1',
  succPercent: '77.3',
  taskCount: 128,
  exactSuccessCount: null,
  paperTable: 'Table 1',
  source: 'https://arxiv.org/html/2607.14777v1',
  pairedWithOurFrozenTasks: false,
} as const;


export const ADVISOR_Q09_UPDATES = [
  { method: '普通 OpenEVO', parametric: 159, textMemory: 2, skill: 1, agent: 3 },
  { method: 'Bounded', parametric: 158, textMemory: 3, skill: 0, agent: 0 },
  { method: 'Bounded + β', parametric: 154, textMemory: 2, skill: 0, agent: 0 },
] as const;
