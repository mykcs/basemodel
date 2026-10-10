# 长期参数记忆的效率与能力权衡：OpenEVO 在 WebShop 上的实证研究

**Efficiency–Capability Trade-offs in Long-Term Parametric Memory: An Empirical Study of OpenEVO on WebShop**

*ICLR 论文章节式科研汇报｜证据核对截至 2026-10-09｜2026-10-10 整理*

*用途：导师与学长讨论、组会报告、后续论文写作的科学梳理；**不是**已投稿或通过审稿的 ICLR 论文。*

*研究对象：OpenEVO / SEED、Qwen3-1.7B、WebShop；实验真值由原始实验记录拥有，本报告不替代冻结收据。*

## Abstract｜摘要

持续学习的 WebShop Agent 必须在新任务中变好，同时控制长期参数状态的存储与训练开销，并保留旧能力。OpenEVO 的 SD-LoRA 将多轮经验留在参数组件中，但组件累积会拖慢后期更新。我们将学长于 2026 年 9 月 22 日提出的六个研究方向整理为九个可检验问题，并另外提出跨新任务、随机设置的独立复现问题（Q10）。这些问题涉及训练停止点、监督学习基线、SEED 复现、状态容量、更新幅度与方向、行为不确定性、遗忘及文字记忆的因果作用。

现有证据呈现出明显的**效率—能力权衡**：在历史的 160 轮运行统计窗口里，Bounded Online Recurrence 将参数更新累计耗时由 **31.09 小时降到 2.02 小时（15.36×）**，但包含任务执行等环节的完整时间仅由 **74.78 小时降到 56.25 小时（1.33×）**。三个长期实验的最终模型后来在同一冻结 128 题上评测，普通 OpenEVO、Bounded 和 Bounded + 历史复杂 β/GDR 的 Task Score 分别为 **60.72、45.98、20.77/100**，完整成功分别为 **50、32、10/128**。其中正式预注册的匹配 treatment 是 Bounded 与 Bounded + β；普通 OpenEVO 属于较早的前序实验，**三者并非完全受控的三臂随机对照**。

进一步的匹配后段容量筛选（第 152–159 轮，1,024 次任务尝试）显示，rank32 将参数文件降至约 **51.4 MB**，对比 rank128 的约 **205.6 MB**；Task Score 为 **61.19** 对 **62.98/100**，差值的配对 95% 置信区间跨零，**不足以证明统计等价或严格非劣**。在另一项固定 64 题的局部干预中，第 156 轮的 Task Vector 方向反转降低 Task Score **10.06 分**（95% 区间：下降 5.60–15.02 分），但不能外推为通用方向控制策略。当前没有充分证据确认复杂 β 退化的直接原因、量化遗忘、文字记忆的因果收益，或 OpenEVO 与完整 SEED 的公平胜负。研究下一步应优先补齐可比基线、冻结评测和独立复现，而不是先增加控制器复杂度。

**Keywords:** agent self-improvement; continual learning; parametric memory; low-rank adaptation; WebShop; evaluation comparability.

## 1 Introduction｜引言

WebShop 要求 Agent 依据商品属性、用户约束和购买动作完成模拟购物。一次任务的训练损失可能降低，但模型最终是否**买对东西**，需要通过终局 Task Score 和完整成功来检验。我们的目标是让 Agent 在经历多个任务批次后把有效经验保留下来，同时避免三类失败：参数历史不断膨胀、计算持续变慢，以及先前能力在后续更新中消失。

普通 SFT/OPSD 将经验写入一套模型参数；OpenEVO 的 DirectApply 历史线路持续累积 SD-LoRA 参数组件；Bounded 在线递推将长期状态限制在固定 rank；历史复杂 β/GDR 尝试限制更新写入的方式。我们关心的是：**控制复杂度是否真的换来了可重复的任务能力与合理成本**，而不仅是训练曲线或参数几何更漂亮。

本文的主张限定为一份**实证进展与开放问题报告**：① 已测量的工程效率收益及能力代价；② 参数容量和方向在特定条件下的实验线索；③ 因评测协议、对照与重复实验缺口而尚不能下的结论。它不提出新的通用持续学习理论，也不宣称优于 SEED 论文成绩。

## 2 Related Work｜相关工作

这一节比较的是不同方法**把经验保存在哪里、怎样成为下一轮决策能力**。原论文研究问题与本地工作不同；不能因为都有 WebShop 分数就把方法当作同协议竞争。

### 2.1 WebShop：真实约束下的交互式购物任务

WebShop（Yao et al., NeurIPS 2022）提供带真实商品和自然语言要求的模拟购物环境。它直接检验搜索、属性选择与购买动作，而不是只看语言模型训练误差。[原论文](https://arxiv.org/abs/2207.01206) / [官方代码](https://github.com/princeton-nlp/WebShop)。本文所有 Task Score 都保留任务清单、分母、评测时点和解析器的身份。

### 2.2 SEED：事后技能驱动的训练时蒸馏

SEED（Wu et al., arXiv 2026）先让策略学习从完成轨迹中提炼 hindsight skills，再在 on-policy 训练中比较普通上下文和技能增强上下文下的动作概率，将新增监督蒸馏回策略。[论文](https://arxiv.org/abs/2607.14777) / [公开代码](https://github.com/jinyangwu/SEED)。**论文中的方法效果不等于本地 Q03 桥接实现的效果**：Q03 采用不同 Stage1 起点、任务、温度、提示及动作解析，新的公开配方复现则是独立工作线。

### 2.3 LoRA 与多轮参数状态

LoRA（Hu et al., 2021）用低秩适配减少需要训练的参数。[论文](https://arxiv.org/abs/2106.09685)。OpenEVO 的 SD-LoRA 长期追加历史组件；Bounded 将跨轮历史约束在固定容量。本文测量**跨轮参数保留、压缩和更新控制对任务能力及开销的影响**；后续未测假设仍保持为未测。


## 3 Method｜方法

### 3.1 研究对象与跨轮学习机制

本研究以 Qwen3-1.7B × WebShop 为主要环境。下面的箭头是**语义示意**，不替代实验 runtime 的逐元素公式。

~~~text
WebShop 一批任务轨迹 → 本轮学习信号与参数更新 → 历史保留规则 → 下一轮 Agent
~~~

| 长期更新规则 | 本轮经验如何进入下一轮 | 要检验的代价或失效 |
|---|---|---|
| 普通 OpenEVO / DirectApply | 每轮追加 rank8 SD-LoRA 参数组件并携带历史 | 历史组件增长、训练逐渐变慢 |
| Bounded Online Recurrence | 将历史与新更新整合到固定容量，初始 rank128 | 状态可控，但可能丢失有用能力 |
| Bounded + 历史复杂 β/GDR | 在 Bounded 上调节每一步更新写入 | 可能改变长期优化路径并降低任务能力 |

简单非负 β 只对更新幅度做缩放，是**另一条后续研究线**，不能直接用历史复杂 β/GDR 的负结果代替它的实验结论。

### 3.2 初始学习与 SEED 属于不同研究问题

普通 SFT / OPSD 用来回答“复杂的长期参数记忆究竟增加了什么价值”；SEED 用来回答“按公开配方做 on-policy 蒸馏是否有可靠能力参照”。这两组基线尚未全部形成完全匹配的正式终评，所以既不被伪装成已完成的第四、第五个 treatment，也不填入不存在的分数。


## 4 Experimental Setup｜实验设置与评估合同

- **Task Score**：WebShop 终局任务满足程度，正文统一写作 0–100 分；原始 0–1 值仅做线性换算。**Exact Success**：每道题是否完整成功，报告题数/分母。两者不能互换。
- **Training loss**：学习目标的优化信号，不是完成购物的直接结果；**开发题**上的平台位置不是自动停止算法；**冻结最终题**不允许用来反复挑选最优模型。
- **Capacity/compute**：将 adapter 文件大小、参数更新累计训练时间、包含 rollout 等环节的整段耗时分别报告；不把 15.36× 的局部加速当作整套系统加速。
- **机制分析**：Task Vector 范数、方向余弦、entropy、文字状态 UPDATE 数都是辅助观察；没有明确干预或对照就不能命名为掉分原因。
- **可比性核查**：任务清单、模型初始权重、模型保存点、随机设置、prompt、采样温度、动作解析、额外文字状态、evaluation phase、evaluator 与是否锁定任务，都要先核对。

| 评测身份 | 样本与用途 | 可以支持 | 不能支持 |
|---|---|---|---|
| 同一冻结 128 题的三路线最终模型 | 三路线最终端点；Q05 / 长期性能 | 在相同题集上的描述性任务能力差异；预注册 Bounded 对 β 的处理对照须看原始协议 | 宣称所有三条路线完全随机匹配，或和 SEED paper-final 相比 |
| 第 152–159 轮匹配容量筛选 | 1,024 次任务尝试；rank128 vs rank32 | 该后段窗口的能力、成功及文件大小比较 | 代替完整 160 轮终评，或证明 rank32 永久无损 |
| Q03 自定义 64 题开发面板 | A0/A40/A80/A120；历史 SEED-derived Stage2 | 同一局部协议下的非单调轨迹 | 与公开 SEED 论文的 128 题绝对分数进行算法排名 |
| Q07 固定 64 题方向干预 | 局部参数状态、指定轮次、配对比较 | 干预某个更新方向时的局部因果效果 | 任意轮次、任意模型的普适方向控制规律 |
| Q02 早期小样本与后续六个训练格 | 初始学习目标消融；3 seeds × 2 objectives | 原始小样本对照和六格训练完成事实 | 六格完整性能对照已经封存，或完整 SEED Stage2 结论 |

## 5 Main Results｜主要实验结果

### 5.1 固定容量减少了训练成本，也暴露了能力代价

| 方法（160 轮历史） | 同一冻结 128 题 Task Score /100 | 完整成功 |
|---|---:|---:|
| 普通 OpenEVO / DirectApply | **60.72** | **50/128（39.1%）** |
| Bounded（固定容量） | **45.98** | **32/128（25.0%）** |
| Bounded + 历史复杂 β/GDR | **20.77** | **10/128（7.8%）** |

工程统计：参数更新累计耗时从 **31.09 h** 降至 **2.02 h**；整段运行从 **74.78 h** 降至 **56.25 h**。这些是各自**历史统计窗口**，不属于下方容量筛选的 1,024 次尝试。**主要观察**：固定容量使计算可控，但已完成终评显示任务表现没有完整保留；进一步叠加旧 β/GDR 的终评分数更低。**限制**：普通线是历史前序；完整因果机制的拆解仍不足以把差距单独归因于压缩损失、门控或训练随机性。[原始三路线结果页面](https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro)。

## 6 Ablation Studies｜消融实验

消融只有**在明确处理变量且可比较时**才是消融；“已安排但没产出成绩”的项目列为未完成。容量消融、第 152–159 轮和旧 Q02 小样本都不能代替三路线冻结 128 题的终评。

### 6.1 第 152–159 轮的 rank32 与 rank128 容量筛选

| 后段匹配指标 | rank128 | rank32 |
|---|---:|---:|
| Adapter 大小 | 205.6 MB | **51.4 MB** |
| Task Score /100 | **62.98** | **61.19** |
| Exact Success | 341/1024（33.3%） | 350/1024（34.2%） |

rank32 − rank128 的 Task Score 平均差为 **−1.79 分**（满分 100；原始数据与完整精度保留在实验收据）；其配对 95% 区间为 **[−3.68，+0.12] 分**（满分 100）。因此该窗口支持“将文件大小缩到约四分之一，能力损失不按容量同比例缩小”的观察；**尚不支持**“两者等价 / rank32 严格不劣”。几何上 rank95 很低也不能证明 rank8/16 跨轮容量足够。[#597 的匹配筛选与 #805 的发布核验](https://github.com/mykcs/basemodel/pull/805)。

### 6.2 为什么“loss 下降”没有回答持续学习

loss 是模型对训练目标的适配程度；Task Score 和 Exact Success 是完成 WebShop 任务的端点。Q02 的早期对照在同样预算下出现 OPSD 平均分稍高、SFT 完整成功更多的**指标方向冲突**。例如早期 1-pass Task Score 约 OPSD **36.58**、SFT **35.53**；SFT−OPSD 的配对 95% 区间约为 **[−16.64，+14.57] 分**，不能宣布稳定赢家。后续重复训练的**六格训练完成**，与六格同题评测/配对分析完成是两回事。[Q02 证据](https://github.com/mykcs/openevo-experiment/pull/629)。

### 6.3 β 与文字记忆：已检验实现，但能力消融尚未封存

历史复杂 β/GDR 在已有终评里表现较差；后续简单非负 β 的方向保持检查只验证了局部实现行为，尚无独立同题配对的能力区间。Text Memory / Skill / Agent System 关闭试验没有可报告的完成结果，因此“文字状态的因果贡献”仍是开放问题。[β 工作线](https://github.com/mykcs/openevo-experiment/pull/632) / [文字状态消融](https://github.com/mykcs/openevo-experiment/pull/636)。


## 7 Visualization & Mechanism Analysis｜可视化与机制分析

**图像与分数的身份必须分开。** 长期训练轨迹、某个开发面板的四点曲线、单轮方向干预的配对区间，并不是相同实验类型。

### 7.1 三条 160 轮训练路线的任务得分轨迹

![图 1：历史 160 轮三条路线的 WebShop 训练轮 Task Score](https://raw.githubusercontent.com/mykcs/basemodel/main/public/research/seed-openevo/evidence/wandb-threeway/task-score.svg)

*图 1｜归档的 W&B 160 轮训练过程 Task Score。训练轮分数不同于第 5 节在冻结 128 题上的最终成绩。*

### 7.2 三种更新规则的平台区间（Q01）

开发题上的近似平台并不发生在相同轮次：普通 DirectApply 约第 120 轮，Bounded 约第 150 轮，历史复杂 β/GDR 约第 130 轮后退化。这不是已经验证的通用自动停止算法。[Q01 原始记录](https://github.com/mykcs/openevo-experiment/pull/628)。

### 7.3 SEED-derived 历史训练出现非单调波动

| 自定义 64 题开发评测 | A0 | A40 | A80 | A120 |
|---|---:|---:|---:|---:|
| Task Score /100 | 3.71 | 6.43 | **0.69** | 6.62 |
| 完整成功 | 0/64 | 0/64 | 0/64 | 0/64 |

Q03 复用历史 OpenEVO 轨迹和 MiniMax 分析，训练了自己的 Stage1，再把 SEED-derived Stage2 接到**不同于公开论文**的 Q17 桥接环境。A40 的回升没有在 A80 保持，A120 再次恢复，四次完整成功均为零。**这是该自定义协议的不稳定轨迹，不是“公开 SEED 本身失败”**。论文报告的 Qwen3-1.7B 约 **87.10/100**、完整成功 **77.3%** 位于不同 128 题 / prompt / action-parser / carrier / sampling 条件下，不可直接相减推断算法差距。[Q03 历史与校准](https://github.com/mykcs/openevo-experiment/pull/678)。

截至此次证据快照，从头按公开配方采集的另一条 SEED 路线已有 **1,440** 条 Stage1 轨迹和 **1,200** 条有效教师标注（1,080 train、120 validation），但**正式 SFT/Stage2 能力结果未封存**。此路线与 Q03 历史 checkpoint 必须分开标识。[独立公开配方复现](https://github.com/mykcs/openevo-experiment/pull/677)。

### 7.4 更新方向可以产生局部因果影响

在 Q07 的固定 64 题中，第 156 轮将某个真实 Task Vector 的方向反转，Task Score **下降 10.06 分**（95% 配对区间：下降 **5.60–15.02 分**）。这是八次方向反转中**经过预设多重比较校正**的一个可报告结果。它说明至少在这个模型状态和面板上，“更新方向”是影响能力的变量；不等于范数越大越好，更不能据此承诺一般化的在线控制器。[Q07 干预原始证据](https://github.com/mykcs/openevo-experiment/pull/634)。

### 7.5 文字状态更新频率与候选点击熵（描述性）

在普通 OpenEVO 160 轮记录里，参数状态更新 **159** 轮，Text Memory **2** 轮，Skill **1** 轮，Agent System **3** 轮；Bounded、β 的文字状态更新也很少。**内容改写次数≠后续实际读取次数≠贡献的任务分数**。关闭文字状态时，其他条件不变的消融尚无可报告成果。[Q09 证据](https://github.com/mykcs/openevo-experiment/pull/636)。

具体合法点击候选的 entropy 可以刻画某次选择的不确定性，但 Q06 的七组 64 题观察尚未完成无泄漏的独立预测验证。**它不能被称为提前预测性能退化的模型。**[Q06 研究](https://github.com/mykcs/openevo-experiment/pull/633) / [已测固定点](https://github.com/mykcs/openevo-experiment/pull/649)。


## 8 Discussion & Limitations｜讨论与局限

目前的中心矛盾有两层。第一，**固定容量降低了后期更新成本，但能力没有完全保留**；研究必须检验压缩保留了哪些函数行为、丢掉了哪些任务所需方向。第二，**更复杂的 β/GDR 未带来可靠性能收益**；已有 cosine、步数、entropy 等诊断与掉分同时发生，但共变不是原因。

当前可设计的假设及其反例条件：

1. **容量假设：**模型只需比 rank128 更小的有效长期状态。*反证方式：*在相同续学任务、预算和冻结评测里，小容量显著且可重复地损伤任务性能，或对早期能力保持更差。
2. **更新幅度假设：**只缩放更新大小而保留方向的简单 β 比旧复杂 controller 更可解释。*反证方式：*干预已正确执行但在独立配对评测中既不改善能力，也不降低特定失效。
3. **方向假设：**少量关键更新方向决定后段能力。*反证方式：*在预先指定的多轮、随机流和新任务上方向干预缺乏复现，或效果被新的控制实验否定。
4. **泛化假设：**在 Q01–Q09 得到的局部关系能跨任务和随机设置保持。*反证方式：*预注册 Q10 独立任务上无相同效果，或置信区间不足以支持实际意义。

**这些是假设，不是已验证的研究结论。**研究价值来自可以明确地否定它们，而不是给已有负结果加一个看起来合理的解释。

- **历史对照不完全同质**：普通 OpenEVO 是前序实验；“同一冻结 128 题终评”不代表完整三臂预注册随机对照。
- **多重窗口不可混算**：第 152–159 轮 1,024 次容量试验、160 轮最终 128 题、Q03 自定义 64 题和 SEED paper 128 题，有不同的估计对象。
- **选择和验证必须分离**：Q01 的后验平台估计不能直接作为未验证的普适早停规则；Q06 的 7×64 题观察不能在无独立划分时宣称预测能力。
- **机制关联不足以归因**：方向余弦、entropy、路径长度、文字 UPDATE 频率不自动构成 β 掉分原因；Q07 仅是特定干预的局部因果结果。
- **关键空白仍在**：Q02 六格的完整固定开发题配对、Q03 公开原生验证与正式 Stage2、Q08 有效遗忘基线、Q09 载体消融、Q10 完整独立复现仍缺可报告结果。空白不是零分。
- **时间戳是证据快照**：状态为 **2026-10-09 核对**，不是运行中实验的实时仪表盘。引用新的科学结论前应核对实验 authority。

遗忘需要一个在时间点 t 已经确认掌握、之后在相同评测条件下重新测试的能力集合。如果无法重建“当时确实学会了”的任务身份和初始成绩，后续失败只能叫低表现，不能自动归因为遗忘。Q08 的 960 次任务尝试属于**评测执行完毕、因果前提未满足**。[Q08 证据](https://github.com/mykcs/openevo-experiment/pull/635)。

## 9 Conclusion & Next Experiments｜结论与下一步

**当前可以确定**：Bounded 在工程上显著缓解了参数更新成本，但同题最终能力低于历史普通线；旧复杂 β/GDR 的能力结果较差；小容量值得继续测；在局部模型状态上参数方向具有可报告的因果影响。**当前不能确定**：何种更新机制能同时达到能力提升、低成本与不遗忘，以及它是否比完整 SEED 更优。

建议按信息增益安排：第一，完成**已有** Q02 六个训练格的同题逐题配对与 SEED 自身协议校准，不重做已有训练；第二，做 rank8/16/32/64/128 在完全同一继续学习任务上的容量与旧能力保持对照；第三，分离**简单幅度 β**与旧复杂控制器；第四，在条件冻结后以新的随机流和任务验证机制结果。每一项都应预先规定任务集、计算预算、评价指标、置信区间和“何时停止/拒绝结论”的规则。

导师目前最有价值的判断是：**哪一项证据若成立，会真正改变科研方向**。这决定我们是继续发展固定容量参数记忆，还是转向更简洁的普通训练或别的能力保持机制。

## References｜参考文献与证据来源

**外部论文：**

1. Yao, S. et al. (2022). *WebShop: Towards Scalable Real-World Web Interaction with Grounded Language Agents*. [arXiv:2207.01206](https://arxiv.org/abs/2207.01206).
2. Wu, J. et al. (2026). *SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning*. [arXiv:2607.14777](https://arxiv.org/abs/2607.14777).
3. Hu, E. et al. (2021). *LoRA: Low-Rank Adaptation of Large Language Models*. [arXiv:2106.09685](https://arxiv.org/abs/2106.09685).

**本地研究证据：**

本报告没有把学长的所有会议说法写成逐字引语。所引数字来自截至 2026-10-09 核对的公共科学页面与实验 PR；如相互矛盾，应回到更高权威的原始冻结收据，保留差异并重新核对。

- **原始实验总结与长期状态**：[Bounded + 历史 β/GDR 的网页研究记录](https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro)；[9 月 22 日阶段性研究证据](https://github.com/mykcs/openevo-experiment/tree/main/docs/evidence)。
- **学习信号/容量**：[post-advisor 匹配筛选与科学解释 #597](https://github.com/mykcs/openevo-experiment/pull/597)；[BaseModel 发布核验 #805](https://github.com/mykcs/basemodel/pull/805)。
- **学长十问 Q01–Q10 的直接证据**：[#628](https://github.com/mykcs/openevo-experiment/pull/628)、[#629](https://github.com/mykcs/openevo-experiment/pull/629)、[#630](https://github.com/mykcs/openevo-experiment/pull/630)、[#631](https://github.com/mykcs/openevo-experiment/pull/631)、[#632](https://github.com/mykcs/openevo-experiment/pull/632)、[#633](https://github.com/mykcs/openevo-experiment/pull/633)、[#634](https://github.com/mykcs/openevo-experiment/pull/634)、[#635](https://github.com/mykcs/openevo-experiment/pull/635)、[#636](https://github.com/mykcs/openevo-experiment/pull/636)、[#637](https://github.com/mykcs/openevo-experiment/pull/637)。
- **Q03 独立新配方与可比性**：[#677](https://github.com/mykcs/openevo-experiment/pull/677)（新公开配方）、[#678](https://github.com/mykcs/openevo-experiment/pull/678)（原生评测校准）。
- **点击候选熵与独立固定点评测**：[#649](https://github.com/mykcs/openevo-experiment/pull/649)。
- **交互式、带图表的 Q01–Q10 原报告**：[BaseModel advisor questions](https://basemodel-preview.vercel.app/research/seed-openevo/study/advisor-questions/)（该公开网址是否已发布本版本，需另以 Production 核验）。

## Appendix A｜学长十问的来源、状态与证据

| 主题 | 学长会议关切与延伸 | 需要回答的科学问题 |
|---|---|---|
| 学习信号与参照（Q01–Q03） | 训练多久、普通 SFT/OPSD 有多强、SEED 能否真正复现 | 验证集能力是否改善，且与训练 loss、不同实验协议的数字明确区分？ |
| 长期参数更新（Q04–Q07） | rank128 必要性、β 的效果、点击 entropy、Task Vector 方向 | 哪些状态容量和更新操作在给定任务与预算下有可测影响？ |
| 可靠性与迁移（Q08–Q10） | 旧任务遗忘、文字状态贡献；会后加入新任务复现 | 能否在可证实的已学任务上测遗忘，能否排除文字状态的混杂，结果能否跨随机设置成立？ |

**会议来源边界：**2026-09-22 的实际讨论由六个主题构成；Q01–Q09 是会后细化的九个问题，Q10 是会后新增的推广性问题，不应伪装成学长逐字提出的第十问。[原始会议整理在 BaseModel 数据源中可追溯](https://github.com/mykcs/basemodel/blob/main/src/data/openEvoAdvisorMeeting.ts)。

| 问题 | 已有观察（简写） | 科学状态 / 下一证据 |
|---|---|---|
| **Q01** 停止点 | DirectApply 约第 120 轮、Bounded 约第 150 轮、历史复杂 β 约第 130 轮后退化 | **有限回答**；固定外部验证后才可能形成停止规则 [#628](https://github.com/mykcs/openevo-experiment/pull/628) |
| **Q02** 普通训练 | 早期 32 题 SFT 与 OPSD 指标方向不一致；6 个固定训练格训练 summary 均 PASS | **部分回答**；补齐同一固定开发题的六格逐题配对，不重训 [#629](https://github.com/mykcs/openevo-experiment/pull/629) |
| **Q03** SEED 复现 | A0→A120 为 3.71→6.43→0.69→6.62，均 0/64 exact | **部分回答**；先只读原生 128 题校准，再得公开配方正式成绩 [#678](https://github.com/mykcs/openevo-experiment/pull/678) [#677](https://github.com/mykcs/openevo-experiment/pull/677) |
| **Q04** 容量 | rank32 约四分之一文件大小；该后段窗口 Task Score 61.19 vs 62.98 | **部分回答**；rank8/16/64 的同契约对照与可学习性证据 [#631](https://github.com/mykcs/openevo-experiment/pull/631) |
| **Q05** β 幅度 | 历史复杂 β 终评 20.77；简单非负 β 在第 120 轮的更新方向余弦接近 1（精确值见原始收据） | **部分回答**；新简单 β 尚无完整配对能力结果，不能借旧结果替代 [#632](https://github.com/mykcs/openevo-experiment/pull/632) |
| **Q06** 点击犹豫 | 单一固定节点测得合法点击候选的不确定性；另测了 7×64 题 | **描述性**；尚无独立、无泄漏预测结论 [#633](https://github.com/mykcs/openevo-experiment/pull/633) [#649](https://github.com/mykcs/openevo-experiment/pull/649) |
| **Q07** 方向因果 | 第 156 轮反转导致 Task Score −10.06 分，配对 CI 不跨零 | **局部因果证据**；跨轮/模型/新任务仍未建立 [#634](https://github.com/mykcs/openevo-experiment/pull/634) |
| **Q08** 遗忘 | 960 次旧任务评测执行完成 | **未能严格测遗忘量**：缺可比的“当初已学会”起点 [#635](https://github.com/mykcs/openevo-experiment/pull/635) |
| **Q09** 文字状态 | 普通线 160 轮中参数 UPDATE 159 次；Text Memory / Skill / Agent System 为 2/1/3 次 | **没有因果结论**；未完成可报告的关闭文字状态对照 [#636](https://github.com/mykcs/openevo-experiment/pull/636) |
| **Q10** 新任务独立复现 | 已有方案与部分执行准备 | **核心正式成绩未出**；新任务 / 随机流 / 不泄漏评测 [#637](https://github.com/mykcs/openevo-experiment/pull/637) |

Q05 的第 120 轮简单非负 β 检查表明更新方向基本保留；Q06 在具体合法点击候选上测量了选择的不确定性。两项诊断的原始精度和定义分别保留在 [Q05](https://github.com/mykcs/openevo-experiment/pull/632) 与 [Q06](https://github.com/mykcs/openevo-experiment/pull/633) 的实验收据中。

这两项诊断不能直接替代任务得分或独立预测检验。