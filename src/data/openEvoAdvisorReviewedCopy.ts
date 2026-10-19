/**
 * Conversation-reference TL;DR for the advisor ten questions.
 *
 * Q01.summary was pasted verbatim by the user and is locked word-for-word.
 * Q02–Q10.summary were restored from the ChatGPT ten-question discussion,
 * retaining the originally authored natural-paragraph explanations. These
 * are conversation-reference drafts, not independently user-requoted text.
 * Their nextResearch may reflect evidence verified later. New experiment
 * details belong to the longer report's evidence fields and must not
 * silently rewrite these summaries. This does not quote the advisor RAW.
 */
export const ADVISOR_REVIEWED_COPY = {
  "q01": {
    "summary": "我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。",
    "nextResearch": "比较三种方法在不同训练阶段的保存模型，并使用事先冻结的新任务验证停止时点。",
    "provenance": "user-quoted-exact"
  },
  "q02": {
    "summary": "我们比较了两种初始训练方式：SFT 直接学习示范，OPSD 利用额外经验指导模型学习。早期 32 道题的平均成绩接近，目前尚无明确赢家。",
    "nextResearch": "补齐尚缺的同条件评测和逐题配对统计，再分别进行长期学习，观察初始训练方式是否影响后续学习速度和最终能力。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q03": {
    "summary": "我们尝试复现 SEED 的公开训练方法。现有历史实验与论文在初始训练、教师模型和任务设置等方面存在差异，因此成绩还不能直接比较；完整的独立正式复现尚未完成。",
    "nextResearch": "先完成论文设置下的正式复现，再分别研究不同训练条件对成绩差距的影响。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q04": {
    "summary": "我们在训练末尾 8 轮比较了 rank128 和 rank32。缩小到 rank32 后，参数文件减少约 75%，平均成绩低 1.79 分，但还不能确定这点损失是否稳定存在。",
    "nextResearch": "五档容量的第一阶段筛选已经完成。接下来观察较小容量能否持续学习新知识、保持原来的能力，并比较所需计算资源。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q05": {
    "summary": "我们在 Bounded 的基础上增加了历史 β/GDR 写入机制。两组模型在相同 128 道题上的成绩分别为 45.98 和 20.77 分。新的简单 β 方案已有部分方向测量，但完整的做题能力比较尚未完成。",
    "nextResearch": "先验证只控制更新强度的简单 β，再进一步研究更新方向、写入时机和新旧知识之间的关系。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q06": {
    "summary": "我们原本希望通过 Entropy（熵）衡量模型决策的不确定性。第一版实验结束后，只计算了 search 和 click 两类动作的 action-family entropy（动作类型熵）。但 WebShop 本来就主要使用这两类动作。即使动作类型熵相同，模型也可能点击完全不同的商品，因此很难从这个指标判断模型的决策质量。后续已有部分点击候选概率测量，预测失败的能力仍未得到确认。",
    "nextResearch": "重点研究 token-level entropy（逐 token 熵）和 click-choice entropy（点击候选熵），把具体候选概率与模型做出的选择、任务成功或失败进行比较，再验证它们能否稳定预测错误。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q07": {
    "summary": "我们研究了 Task Vector（参数更新向量），并对 Bounded（未加入 β）训练末尾的 8 轮更新进行删除和方向反转实验。反转第 156 轮的更新方向，相比完整、未干预的 Bounded 模型使 Task Score 下降约 10.06 分，并通过统计校正。这说明至少在这一轮，参数更新方向确实会影响模型能力。",
    "nextResearch": "在普通 OpenEVO、Bounded 和 Bounded + β 上进行可比的方向干预，观察三种方法反转、取消或改变更新方向后的表现是否不同，并探索利用方向控制改善长期训练。",
    "provenance": "chatgpt-discussed-with-user-correction"
  },
  "q08": {
    "summary": "我们研究了 Catastrophic Forgetting（灾难性遗忘），已完成 960 次旧任务保持评测。补充实验中，后期模型在 12 道旧任务上的完整成功率下降了 9.38 个百分点，但统计结果仍有不确定性。部分旧任务还缺少可靠的早期成绩，因此无法确认模型以前是否真正学会这些题，也就不能直接将后期失败判定为遗忘。",
    "nextResearch": "补齐旧任务在早期训练阶段的成绩，与后期模型进行同题比较。之后进一步比较普通 OpenEVO、Bounded 和 Bounded + β 的遗忘情况。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q09": {
    "summary": "OpenEVO 除了参数更新，还会保存外部文字经验。我们发现，普通 OpenEVO 在 160 轮中更新参数 159 次，而 Text Memory、Skill 和 Agent System 分别只改写了 2、1、3 次。随后，我们尝试替换这些文字指导内容，但目前尚未发现统计上明确的稳定收益。文字很少改写，也不代表后续任务没有使用它。",
    "nextResearch": "分别真正关闭 Text Memory、Skill Bundle 和 Agent System，再与原模型进行同题比较。同时观察三种 OpenEVO 对这些文字记忆的依赖是否不同。",
    "provenance": "chatgpt-discussed-draft"
  },
  "q10": {
    "summary": "我们已经规划独立训练和新任务验证，但尚未完成足以支持跨任务结论的正式重复实验。",
    "nextResearch": "除了用新的 WebShop 题目验证结果，我们还计划扩展到 ALFWorld。例如，SEED（arXiv:2607.14777）同时研究了 WebShop 和 ALFWorld。我们计划在 ALFWorld 上重新训练并比较普通 OpenEVO、Bounded 和 Bounded + β，观察此前在 WebShop 中发现的训练收益、参数容量和更新机制的影响是否仍然成立。",
    "provenance": "chatgpt-discussed-with-user-example"
  }
} as const;
