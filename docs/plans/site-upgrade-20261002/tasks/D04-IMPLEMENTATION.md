# D04 实际实现：从证据形成下一阶段研究决策

## 这一轮解决什么

D04 不再写新的大实验清单，而是把 D03 的可复算结果、OpenEVO Experiment 当前真实 PR 状态和已经合入的研究答案连起来。
目标是让后续 Agent 能回答三件事：这个问题现在知道什么、谁已经在继续做、什么结果会真正改变当前判断。

本轮没有启动训练、没有访问 Final panel、没有给任何新实验增加授权，也没有创建新的 OpenEVO Experiment PR。
D04 自己新增的 formal rollout 数是 **0**。

## 依赖与快照

- D03 / BaseModel #824：f738b67a018fe3a1b068fd210b367cafd649cc24
- 本轮读取 OpenEVO Experiment PR 状态的日期：2026-10-03
- D03 中学习信号与 rank32 仍保持 awaiting-pr805-integration
- D03 中 β 第96–199轮分析仍是 existing-site-projection
- 所有开放上游工作线都按读取时的 exact head 记录，不把未来可能变化的 head 当永久事实

机器可读 owner：src/data/researchDecisionNotes.ts。
正常 npm run validate 会调用 validateResearchDecisionNotes()，阻止缺证据、重复 question、D04 偷增预算或把关闭问题重新排进实验队列。

## 五个问题的当前处理

| 问题 | 当前处理 | 已有 owner / 证据 | D04 新预算 |
|---|---|---|---:|
| loss 降但能力不升 | 继续已有工作 | Q02 #629 + Q03 #630；#597 旧结果 | 0 |
| rank32 容量取舍 | 继续已有工作 | Q04 #631；复用 rank32/rank128 与 rank8 已发生副作用 | 0 |
| β 后期回升与退化 | 继续已有工作 | Q05 #632 + Q08 #635；Q07 #634 已合入因果方向证据 | 0 |
| 120/160/200 轮价值 | **当前问题关闭** | Q01 #628 已合入跨机制答案 | 0 |
| 加速后如何重分预算 | 等现有证据 | #471 加速谱系 + #481 准入边界 | 0 |

## 1. 学习信号

现有证据已经说明：SEED-style Stage1 的训练目标确实被优化，但同一64题留出能力没有同步改善。
这只否定“Stage1 目标下降就自然带来 WebShop 能力提升”的简单故事，不否定完整 SEED Stage2。

现在不应该再重跑 #597。
上游已经有两个能区分解释的 owner：

- Q02 / #629：比较学习信号本身；
- Q03 / #630：检验加入完整 Stage2 闭环之后是否出现 Stage1 没有的能力提升。

如果 Q02 在同类预算下改善 held-out Task Score，说明学习信号选择更关键。
如果 Q03 的完整 Stage2 才产生改善，则支持“Stage1 本身不足”的解释。
两者都没有改善时，才需要重新讨论模型容量、任务分布或更深层的目标错配。

## 2. rank 容量

rank32 的已有结果说明持久 payload 可以大幅缩小，但 Task Score 与完整成功率并不是同方向变化。
因此当前证据既不支持“rank32 无损”，也不支持“effective rank 很低，所以 rank8 肯定够”。

Q04 / #631 已经是容量问题的唯一现有执行 owner。
它承接 rank32/rank128，并继续 rank8/16/64；rank8 已经发生的128条 rollout 副作用必须续接和核账，不能为了整齐重新跑。

D04 不开第二条 rank sweep。
真正会改变当前判断的是：多个 rank 点能否在预先固定的能力与保持指标上形成稳定平台，或者随着 rank 降低出现可重复的系统性损失。

## 3. β 后期变化

D03 用全部第96–199轮窗口复算后，看到的是：

- loss 持续下降；
- Task Score 从第120–139轮到第140–159轮明显下降；
- 第160–199轮训练分数又回升；
- 这没有产生新的 Frozen Final。

与此同时，Q01 / #628 已经用统一64题开发面板发现 GDR 大约在 R130 后出现后期退化。
Q07 / #634 还给出直接因果证据：反转 R156 更新方向会明显伤害能力。

所以 D04 不再把“β是不是太大”当唯一解释。
现有 Q05 / #632 负责缩幅与自适应增益；Q08 / #635 负责旧任务保持。
这两条线能区分“主要是幅度问题”与“方向/任务分布/遗忘问题”。

训练回升仍然不自动授权 Final 重测。

## 4. 120 / 160 / 200 轮

这个问题与规划时相比已经发生实质变化：Q01 / #628 已经完成并合入。

在同一冻结64题开发验证规则下：

- Ordinary OpenEVO：约 120 parameter updates 进入实用平台；
- Bounded State：约 R150；
- GDR：约 R130，之后出现明显退化。

因此“120轮是否对所有方法都够”已经有当前答案：**不能跨机制统一。**
D04 将这个问题标记为 closed-by-evidence，并明确 no-new-study。

未来出现新机制时，它仍需要自己的预先固定停止规则；这不是把 120、150 或 130 变成新的通用常数。

## 5. 加速后的预算

#471 已经明确两条加速线不是一个东西：

- Stable Reduction 代表性 trainer 加速约 2.01×；
- Bounded Online Recurrence 第151–159轮相对 formal Vanilla 的 trainer 加速均值约 37.04×。

它们改变的科学处理、状态表示和估计对象不同。
#481 也记录了原 GDR160 没有把它们直接当成 Vanilla 等价实现准入。

因此不能把 2.01× 或 37.04× 直接乘成“可以免费多跑多少轮”。
只有在**同一个已准入科学处理**里，拿端到端实际墙钟/GPU成本与原有能力/行为门一起测，才可以把真实差额重新分配。

而 #628 已经说明更长训练并不自动更有价值。
所以拿到真实节省后，优先比较“更多独立重复、更多任务覆盖、更多诊断”与“更长单次训练”的机会成本，而不是机械增加轮数。

## 机器可读决策合同

ResearchDecisionNote 对每个问题保存：

- evidence IDs；
- 观测；
- 冲突证据与限制；
- 至少两个竞争解释；
- 每个解释的区分性预测；
- 当前处理；
- 已存在的上游 PR；
- primary metric 与独立单位；
- budget formula；
- stop rule；
- 什么证据会改变当前决定。

所有 continue-existing-work 必须有现有 PR owner。
所有 closed-by-evidence 必须是 no-new-study。
D04 的 d04CreatesNewPr、d04NewFormalRollouts 和 executionAuthorityFromD04 被 schema/test 固定为 false / 0 / false。

## 反例与防错

测试会拒绝这些做法：

- 五个问题缺一个或重复一个；
- 引用不存在的 evidence ID；
- 把 D04 变成实验授权；
- 已关闭的 horizon 问题又安排新实验；
- continue 状态却没有现有 owner；
- 用全0 SHA 或无身份来源冒充证据；
- 把 D03 仍待 #805 接入的学习信号/rank32 标成网站已经发布；
- 把 β 训练回升写成新的 Frozen Final；
- 把 2.01× 与 37.04× 直接折成一个通用 GPU 小时数；
- 从 effective rank 直接声称 rank8 足够。

## 后续消费

B01/B02/C02 不应重新手抄这五套判断。
它们直接读取 RESEARCH_DECISION_NOTES，再把同一证据组织成读者页面、文章或图表。

D04 也不会成为 OpenEVO Experiment 的新科学 authority。
上游 sealed result、merged result、active execution PR 和 ledger 继续拥有各自科学状态；BaseModel 这里只保存一个有日期、可检查、不会暗中启动实验的决策快照。
