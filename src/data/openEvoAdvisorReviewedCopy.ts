/**
 * Conversation-derived ten-question copy: explicitly verified versus reconstructed.
 * This block protects the user-reviewed research narrative from being silently
 * replaced by later evidence-led rewrites. New experiments belong in the
 * detailed evidence fields, with a dated qualifier when they update a claim.
 * Q01.approvedSummary is the user-provided, verbatim Q01 answer reconfirmed in
 * the 2026-10-19 chat. This is different from the assistant's reconstructed
 * did/found/status/next fields: do not paraphrase or split approvedSummary.
 * Q02-Q10 have not yet received the same explicit verbatim re-confirmation.
 * Do not equate user-approved answer copy with the 2026-09-22 advisor RAW.
 */
export const ADVISOR_REVIEWED_COPY = {
  "q01": {
    "approvedSummary": "我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。",
    "did": "我们把普通 OpenEVO、Bounded 和历史 β/GDR 的训练保存点放在同一批 64 道开发题上比较，观察训练到第 120、150、160 轮时的变化。",
    "found": "普通 OpenEVO 约在第 120 次更新后收益很小；Bounded 到第 150 轮仍有提升；历史 β/GDR 后期出现掉分。因此，160 轮是否过多取决于采用哪一种更新方法。",
    "status": "三种方法的保存点对比已经做完。β-gating 另外已有延伸到 200 轮的训练轨迹，但这些证据还不能证明三种方法在新题上的最佳停止点。",
    "next": "比较三种方法在不同训练阶段的保存模型，并使用事先冻结的新任务验证停止时点。"
  },
  "q02": {
    "did": "我们比较了 SFT（监督微调）和 OPSD 两种初始训练方式，让相同的基础模型学习购物经验，并分别测试初始模型的能力。",
    "found": "早期 32 道题上，OPSD 的 Task Score 为 36.01/100，SFT 为 34.96/100，差异尚不明确。后续六组训练已经完成，18 个固定评测位置中已有 15 个模型版本完成 64 题测试。",
    "status": "六组训练都已完成，但还缺 3 个评测位置以及完整的逐题配对统计。因此不能仅凭 PASS 认定某种方法更好。",
    "next": "补齐缺少的评测和配对统计，然后观察采用不同初始训练方式的模型，在长期学习到第 120、160 轮时表现是否不同。"
  },
  "q03": {
    "did": "我们尝试按照 SEED 论文公开的训练方法进行复现，也对历史 OpenEVO 训练路线做了同题评测，希望解释为什么成绩与论文有差距。",
    "found": "历史 Q03 在自定义 64 题的 A120 模型上得到 6.62/100，但训练起点、任务题单、提示和动作处理与论文并不相同，因而无法把它与论文报告的另一套分数直接比较。",
    "status": "历史模型和独立复现的工程诊断已有结果，但按论文原生协议完成的正式 SFT、Stage2 与最终评测尚无完整验收成绩。",
    "next": "先完成与论文对齐的正式复现，再分别研究初始训练、教师模型和任务设置对成绩的影响。"
  },
  "q04": {
    "did": "我们把长期参数容量从 rank128 缩小到 rank32，在整段训练末尾的第 152–159 轮进行同题对照；之后又筛选了 rank8、16、32、64、128 五档容量。",
    "found": "rank32 参数文件比 rank128 小约 75%，平均 Task Score 低 1.79 分，但置信区间跨零。五档容量的第一阶段 640 次评测也已完成，尚未找到稳定的最佳容量。",
    "status": "末尾八轮比较与五档容量的初筛已完成；容量缩小后能否持续学习很多轮，仍缺完整的后续训练对照。",
    "next": "继续比较不同 rank 长期学习新任务和保留旧能力的表现，而不重复已经完成的五档初筛。"
  },
  "q05": {
    "did": "我们先比较了历史 Bounded 与加入 β/GDR 写入控制后的成绩，又研究只调节写入大小的简单 β，并进行短程敏感性测试。",
    "found": "历史 Bounded 与历史 β/GDR 在相同 128 题上的 Task Score 分别是 45.98 和 20.77。新的简单 β 已有局部方向测量和另外 8 组、512 次做题评测，不同任务与阶段的结果并不一致。",
    "status": "历史结果和独立敏感性测试已经测出；简单 β 的完整正式训练、同题比较和统计结论还没有全部完成。",
    "next": "在公平的相同起点和任务条件下比较简单 β、Bounded 与历史机制，分别研究写入强度、更新方向和旧知识保持。"
  },
  "q06": {
    "did": "第一版实验结束后，我们根据保存的任务轨迹，补充计算了 action-family entropy（动作类型熵），统计模型使用 search 和 click 两类动作的分散程度。",
    "found": "WebShop 主要就是搜索和点击，即使两个模型的动作类型熵相同，它们也可能点击完全不同的商品。因此，这个指标很难反映具体的决策质量，也无法解释模型为什么做错题。",
    "status": "动作类型熵已经测过，但还没有充分回答学长关心的 token-level entropy（逐 token 熵）问题。后续已有局部点击候选概率测量，并完成两条新数据流的条件预测检验，但预设的整体结果为 NOT_CONFIRMED（尚未确认）。",
    "next": "重点验证 token-level entropy，以及不同合法点击候选之间的概率分布（click-choice entropy）。将它们与模型实际选择和任务失败进行比较，再用独立训练起点验证预测能力。"
  },
  "q07": {
    "did": "选取 Bounded（固定容量、未加入 β）在训练末尾的 8 轮参数更新，分别尝试删除或反转更新方向，并让模型完成相同的 64 道购物题。",
    "found": "反转第 156 轮的更新方向后，相比完整、未干预的 Bounded 模型，Task Score 平均下降约 10.06 分，并通过针对八次比较的统计校正。这说明至少在这个模型和训练阶段，更新方向确实会影响做题成绩。",
    "status": "已经完成 Bounded 的局部方向干预实验，但还没有建立三种 OpenEVO 方法之间的完整方向对照。",
    "next": "对普通 OpenEVO、Bounded 和 Bounded + β 分别进行可比的方向干预，观察反转、取消或改变更新方向后的成绩差异，探索能否改善长期训练表现。"
  },
  "q08": {
    "did": "我们已经完成 960 次旧任务保持评测，希望比较模型当初学会某道购物题时与长时间训练后的表现。",
    "found": "补充实验中，后期模型在 12 道旧任务上的完整成功率下降了 9.38 个百分点，但统计结果仍不确定。部分任务没有可靠的早期成绩，无法证明模型当初确实学会了这些题，因此还不能把后期失败直接称作遗忘。",
    "status": "旧任务评测已经做了，但尚未获得可靠的 Catastrophic Forgetting（灾难性遗忘）程度结论。",
    "next": "先补齐旧任务早期学会时的成绩，与后期模型进行同题比较，再研究普通 OpenEVO、Bounded 和 Bounded + β 的旧知识保持差异。"
  },
  "q09": {
    "did": "统计三种 OpenEVO 方法中的参数更新和文字经验改写次数，并在 R159 模型上分别替换 Text Memory、Skill Bundle 与 Agent System 的指导内容，测试相同的购物题。",
    "found": "普通 OpenEVO 在 160 轮中更新参数 159 次，三类文字记忆分别只改写了 2、1、3 次。改变指导内容后的成绩差异尚不明确；文字改写少，不代表后续任务没有读取它。",
    "status": "改写频率统计和部分文字内容干预已经完成。另有两条延伸训练流得到末端状态，但三类文字载体的完整关闭消融还没有完成。",
    "next": "分别真正关闭 Text Memory、Skill Bundle 和 Agent System，再与原模型同题比较，研究它们对长期学习是否有贡献及与参数更新的配合。"
  },
  "q10": {
    "did": "我们已经规划新的 WebShop 任务划分和独立训练随机种子，希望验证前九项研究中观察到的现象是否能够重复。",
    "found": "前面一些现象，例如三种 OpenEVO 方法的训练收益不同、缩小参数容量后的成绩变化和更新方向的影响，目前主要来自特定模型和固定研究题目；尚未证明它们在真正的新题或其他环境中仍然成立。",
    "status": "独立重复训练和新任务验证的方案已经制定，但尚无完整的正式泛化结论。Q10 是会后新增的研究问题，并非学长当时逐字提出。",
    "next": "先用新的 WebShop 题目与随机种子复现，再参考 SEED（arXiv:2607.14777）等研究，将普通 OpenEVO、Bounded 和 Bounded + β 扩展到 ALFWorld 上重新训练和评测。"
  }
} as const;
