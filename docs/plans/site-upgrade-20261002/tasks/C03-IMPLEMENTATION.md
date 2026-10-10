# C03 实际实现：Vanilla SD-LoRA 一轮机制图

## Page Expression Brief

**读者。** 第一次接触 OpenEvo × WebShop 的实验室同伴、几个月后回访的自己，以及需要接手参数更新机制的 Agent。

**页面角色。** 这不是整个 OpenEvo 系统图，只解释 Vanilla SD-LoRA 一轮参数路径：上一轮参数怎样进入任务尝试，成功轨迹怎样筛选，旧经验怎样旁路进入训练，旧方向、新方向和 α 怎样变化，候选参数怎样进入下一轮，以及没有新的可训练证据时为什么不更新。

**起始困惑。** main 已经有一张真实拓扑图，并非静态卡片堆砌；它已经画出了任务尝试、成功筛选、旧经验旁路、SD-LoRA 更新、DirectApply / 历史 GDR-v1 分支和下一轮回环。真正缺口只有两处：没有把参数 NOOP 的真实数据不足分支画出来，也没有让读者逐步聚焦某一段。

**目标心智模型。**

1. 基础模型 W0 保持不动。
2. 旧方向 D1…Dt-1 保持不动；本轮学习新方向 Dt；所有 α 仍可重调。
3. 当前训练数据不是所有 rollout，而是新的、尚未消费且最终可进入参数训练数据集的 clean exact evidence，加有限旧经验 replay。
4. 有可训练数据时才训练候选 LoRA；没有可用新证据时参数通道 NOOP，沿用 prior adapter。
5. 训练候选和下一轮是否采用它是两个阶段。
6. 下一轮再做 128 次任务尝试，形成真实回环。

## exact-source 复核与科学修正

本轮不是照着旧网页猜 NOOP 条件，而是重新读取 Q17 execution SHA ac130148ee08b6462d9728e482a858fe5f514047 下的冻结源码：

- scripts/openevo_webshop/ceiling1_stage2_vnext_evidence.py：参数 evidence gate 在没有新的、尚未尝试的 clean exact evidence 时给出 VNEXT_PARAMETRIC_NO_UNATTEMPTED_CLEAN_EXACT。
- scripts/openevo_webshop/ceiling1_stage2_vnext_parametric_dataset.py：排除已经消费的 task identity 后，如果没有记录能进入数据集，则 selection 状态为 NOOP_NO_UNCONSUMED_CLEAN_EXACT。
- scripts/openevo_webshop/run_ceiling1_stage2_vnext_arm.py：上述 gate / selection 不允许更新时，写 parametric NOOP terminal receipt，沿用 prior adapter、artifact id 和 component count。

因此页面不再笼统写成“这一轮 0 个成功就 NOOP”，而是写成：**没有新的、尚未消费并最终能进入参数训练数据集的 clean exact evidence 时，参数通道不更新。**

同时把原先的 Q17 训练数据选择器来源从旧 parametric_dataset_v2 路径修正为实际 vNext parametric dataset 文件；vNext evidence 和 runner 也加入实现来源。

## 已实现的表达

### 1. 真实 NOOP 分支

桌面图从“02 训练数据”增加黄色虚线到“02b 没有新的可训练成功”，再直接连到下一轮。NOOP 节点明确说明：adapter 与 component 数保持不变。

手机按同样顺序呈现 NOOP，而不是把分支藏进 tooltip。这样读者在窄屏也能看到：筛选后可能进入训练，也可能直接沿用 prior LoRA。

NOOP 使用独立的虚线/文字标签，同时图例写明“没有训练样本时不更新”；颜色只是辅助，文本本身就说明条件和动作。

### 2. 逐步聚焦，而不是自动播放

图上增加一个很轻的步骤条：全图、01 尝试、02 筛选、03 更新、04 候选、05 采用规则、无训练样本、下一轮。

- 默认是全图。
- 点击或键盘选择后，只把相关节点和边提高对比度；其他节点仍在 DOM 中、仍可见，不改变科学内容。
- ArrowLeft / ArrowRight / Home / End 可以操作。
- 没有 setInterval，没有 autoplay。
- prefers-reduced-motion 下取消路径动画和聚焦过渡。

### 3. 无 JavaScript 与打印

步骤条默认 CSS 隐藏，只有脚本成功初始化后才显示。因此无 JavaScript 时仍是完整有序机制图，主线与 NOOP 分支都在。

打印模式隐藏交互控件，并强制用完整桌面静态拓扑。首版打印测试发现 16:9 aspect-ratio + grid 1fr 在 Chromium print media 中会把机制图计算成 0px 高；已经改成打印时 block 布局 + 显式 520px 图高，保留完整节点。

### 4. SVG ID 与复用

OpenEvoVanillaSdLoraSlide 新增 instanceId，marker ID 由 locale + 安全化 instanceId 组成。当前机制页传 mechanism-main，因此当前 marker 是 sdlora-flow-arrow-zh-mechanism-main。浏览器测试只检查本组件 marker，不把 KaTeX 内部 SVG id 误算成流程 ID。

## 视觉冷读

agent-browser 在 1440×900 和 390×844 做了实际截图检查：

- 桌面默认图能同时看到主线、旧经验旁路、NOOP、DirectApply/GDR 分支和下一轮回环。
- 点击“无训练样本”后，NOOP 路径成为唯一高对比主角，但完整图没有消失。
- 390px 手机按同一顺序阅读，NOOP 位于筛选与训练之间；document scrollWidth 与 clientWidth 相同，没有页面级横向溢出。
- 步骤条在手机上自身横向滚动，不挤压整页。

## 验收

- Vanilla SD-LoRA 结构单测：6/6。
- Chromium + WebKit 专项：40/40；两种引擎各 20 项。
- 覆盖：桌面/手机真实拓扑、NOOP、键盘、无 JS、打印、reduced-motion、390/768/1440 亮暗、SVG marker ID、16:9 slide、200% 桌面放大等价重排。
- 200% 项明确是布局等价检查：1440px 桌面在 200% 浏览器放大时约对应 720 CSS px；测试用 720 CSS px 验证响应式重排和无页面溢出，不冒充操作系统级真实缩放。
- npm run verify:deploy：123 个结构测试文件 / 808 项测试通过；7 个行为测试文件 / 37 项测试通过。
- 类型检查：590 文件，0 error / 0 warning；仓库已有 2 个 hint。
- strict copy invariant failures = 0；Reader Contract 68/68。

## 边界

本 PR 没有改训练协议、TaskMem/Skill/Agent、实验结果、Final panel、W&B、GPU 调度或任何上游实验。没有创建新实验或扩大预算。

它也没有重做现有主流程：main 原本已经有真实桌面/手机拓扑、回环、reduced-motion 和 16:9 slide。C03 只补真实缺口并修掉 NOOP 语义中的旧假设。

保持 Draft；不请求 Vercel final gate，不合并或部署。