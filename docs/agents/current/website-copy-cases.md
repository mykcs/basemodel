# Basemodel 「说人话 / 去 AI 味」文案案例库

状态：**CURRENT COMPANION**
主规范：[`website-design-spec.md`](website-design-spec.md)
历史审计基线：`origin/main@e11d443`，2026-08-30。

## 1. 这份案例库怎么来的

本轮从建站首个 commit `dd9b04b`（2026-08-05）开始，检查到 `e11d443`：

- 主线 commits：901；
- 已合并 PR：274；
- GitHub 可见 PR 全量元数据：349（编号已到 #350，历史编号并不连续）；
- 以 copy / reader / editorial / human / wording / i18n / title / label / explain 等关键词扩展出的历史 commit 候选：116；另外经 PR body / diff 捕获 3 个主题未命中该过滤器、但实际改变公开表达边界的混合变更（#342、#349、#350），一并进入历史台账；
- 另外检查了没有这些关键词、但 PR body 或 diff 明确包含读者文案重构的混合型变更。

案例分两种证据：

- **PREFERENCE**：明确由用户反馈、全站 copy audit 或已固化的写作 contract 推动，可用于解释当前偏好。
- **EVOLUTION**：历史中间稿、功能 PR 中的文案变化或测试保护，用来理解偏好怎样演进；不能单独覆盖更新的 PREFERENCE 案例。
- **认可案例**：用户明确接受、或与当前 canonical 规范一致的写法；用于回答“应该怎么写”。
- **反面案例**：用户明确指出难懂、AI 味重、内部术语裸奔或容易误导的写法；用于回答“不要怎么写”。同一个 CASE 可以同时保存一组反面原句和认可改写。

不是每个新增字符串都能证明偏好。功能新增时自然产生的文案不因为“后来被 merge”就自动成为写作范式。

案例中的“前 / 后”会为可读性省略无关 JSX 或上下文，但不改变原句的语义；commit / PR 链接是精确来源。

## 2. 快速索引

| 类别 | 最稳定的偏好 | 代表案例 |
|---|---|---|
| 重复标签 | 一个意思不要用 kicker + H2 + body 再说三遍 | CASE-001–006 |
| 抽象包装 | 先命名具体对象/操作，不让“研究主线/证据链”承担全部意义 | CASE-007–012 |
| 编辑口吻 | 不讲网页怎样组织、文章怎样阅读、内容怎样迁移 | CASE-013–024 |
| 技术解释 | 零上下文先给对象和机制，再给术语与内部代号 | CASE-025–035 |
| 内部计数与阈值 | `block / identity / gate` 不能裸奔；先解释对象、规则和因果边界 | CASE-051–053 |
| 连续实验版本 | 每一版先写清“现实里坏了什么”，不要用版本号或“Stage 2 失败”代替机制 | CASE-054–056 |
| 首次读者完整性 | “没运行”不能写成失败；删掉聊天上下文后页面本身仍要自解释 | CASE-057–058 |
| 内部路线代号 | 首层先写真实实验对象；Track / branch / phase 只在第二层做 provenance | CASE-065 |
| 责任与结论 | 结论、责任层和结果先出现，证据随后展开 | CASE-029–038 |
| 科学精度 | 自然语言不能升级 claim、补 unknown 或丢失否定 | CASE-031–040 |
| 标题与解释腔 | 主题名替代“怎么读/常见误解/能做什么”式主持人口吻 | CASE-041–047 |
| 首屏身份与 TL;DR | 第一次进入先知道“这是什么”和“实验做了什么”；背景知识链接到唯一讲解页 | CASE-061–062 |
| 首屏注意力预算 | 一个首屏只承担一个主要理解任务；正确但次要的信息不能同时争夺第一眼 | CASE-068 |
| 注意力与视觉中心 | 标题、加粗和大字号只强调真实主题/结论，不强调作者的教学动作 | CASE-069 |
| 术语与代号的就地解释 | 先不用代号；必须保留时先给人类名称，并在第一次出现的位置解释 | CASE-070 |
| 解释层与可见 UI | 深浅层次是信息深度，不机械渲染“一句话看懂 / 专业解释”标签 | CASE-071 |
| 主持人式标题 | “怎样连起来 / 怎么读 / 先…再…”降为正文，标题只保留对象 | CASE-063 |
| 真人反馈闭环 | 真人指出一次问题后，保存反例、正例、规则、扫描项，并反查全站同类问题 | CASE-064 |
| 叙事隐喻与装饰性 eyebrow | 能直接说实验事实就不制造“分岔 / 分叉 / fork”故事；eyebrow 只有增加信息才保留 | CASE-067 |
| 防御性否定开场 | 先说发生了什么、我们怎么做，再在真正改变结论的地方补边界 | CASE-081 |
| 科研阶段汇报的研究叙事 | 用问题 → 假设 → 实验 → 结果 → 决策转折组织，不让状态/工程模块替代研究主线 | CASE-082 |
| 机制解释的自然语序 | 保留真实技术词，但按主体 → 动作 → 结果解释过程，不用名词化关系让观众反推机制 | CASE-087 |
| 同类实验图表 | Score / loss / update 复用稳定视觉语法，数值轴按真实量纲调整 | CASE-088 |
| 阶段汇报的方法背景 | 即使网站另有方法页，现场结果前仍给足以理解后续 claim 的最小 Stage 1 → Stage 2 心智模型 | CASE-089 |
| 结果页深度与交互语义 | 科学结果留在主线；命令/配置后置；控件不能诱导被警告的动作 | CASE-048–049 |
| 公开示例隐私 | 用通用路径表达复现要求，不把真实账号/主机身份写进页面 | CASE-050 |

## 3. 重复标签与重复动作

<a id="case-001-删除重复-evidence-标签"></a>
### CASE-001 — 删除重复 Evidence 标签
**PREFERENCE · 2026-08-05 · commit [`2365f12`](https://github.com/mykcs/basemodel/commit/2365f12)**
前：`Evidence` kicker / `论文证据` / `证据链` 与真正的证据列表叠在一起。
后：删除这些重复包装，直接展示证据列表或保留唯一主题标题。
规律：**视觉层级不能靠重复同一个名词制造。**

<a id="case-002-模型名里已有供应商就不再重复"></a>
### CASE-002 — 模型名里已有供应商就不再重复
**PREFERENCE · 2026-08-05 · commits `2254b4e`, `ac3615c`**
前：provider label 与模型标题里的供应商名称重复出现。
后：标题已经包含供应商时隐藏额外 provider label。
规律：**身份信息出现一次就够；重复不是“更清楚”。**

<a id="case-003-详情页身份信息不重复"></a>
### CASE-003 — 详情页身份信息不重复
**PREFERENCE · 2026-08-05 · commit `f4d399f`**
前：详情页标题、aside、note 重复同一模型/论文身份。
后：每个区域只保留它真正新增的信息。
规律：**一个区域存在的理由应该是增加信息，不是复述上一区域。**

<a id="case-004-删除重复-section-label"></a>
### CASE-004 — 删除重复 section label
**PREFERENCE · 2026-08-06 · commit [`b6c88ce`](https://github.com/mykcs/basemodel/commit/b6c88ce)**
前：`模型供应层`、`家族层`、`决策面`、`研究采用层`、`论文 × 模型`、`数据治理` 等 eyebrow 叠在已经明确的 H1/H2 上。
后：删除冗余 eyebrow / section kicker，保留实际页面标题。
规律：**“给这一层取个抽象名字”不是必要的 UI 设计。**
<a id="case-005-kicker-与-h2-相同就删-kicker"></a>
### CASE-005 — kicker 与 H2 相同就删 kicker
**PREFERENCE · 2026-08-10 · PR [#76](https://github.com/mykcs/basemodel/pull/76)**
前：`研究摘要` 等 section kicker 与紧接着的标题表达同一件事。
后：删除 kicker，让 H2 独立承担导航语义。
规律：**设计装饰不能要求额外造一层文案。**

<a id="case-006-一个动作只保留一个主要入口"></a>
### CASE-006 — 一个动作只保留一个主要入口
**PREFERENCE · 2026-08-10 · PR [#76](https://github.com/mykcs/basemodel/pull/76)**
前：同一候选卡片里同时存在两个 `加入对比` 入口。
后：只保留一个明确操作。
规律：**重复 CTA 会制造噪声，不会增加可用性。**

## 4. 抽象包装改成具体对象和动作

<a id="case-007-研究总览改成实验总览"></a>
### CASE-007 — `研究总览` → `实验总览`
**PREFERENCE · 2026-08-12 · commit [`c9ee929`](https://github.com/mykcs/basemodel/commit/c9ee929)**
前：`研究总览` / `Research map`。
后：`实验总览` / `Experiment overview`。
规律：**能说实际对象，就不要先说抽象研究包装。**

<a id="case-008-研究工具改成更多工具"></a>
### CASE-008 — `研究工具` → `更多工具`
**PREFERENCE · 2026-08-12 · commit `c9ee929`**
前：`研究工具`、`辅助页面`、`需要证据、筛选或比较时再进入`。
后：`更多工具`、`按需查看`，并直接列出模型、论文、实验配置和比较结果。
规律：**菜单名要帮助找到东西，不要给产品内部信息架构命名。**
<a id="case-009-形成可保存的研究任务改成保存实验条件"></a>
### CASE-009 — `形成可保存的研究任务` → 直接说保存什么
**PREFERENCE · 2026-08-12 · commit `c9ee929`**
前：工作台说明 `形成可保存的研究任务`。
后：`保存模型、GPU、网络和训练条件`。
规律：**不要让读者猜“研究任务”这个抽象对象里到底装了什么。**

<a id="case-010-从抽象研究标签改到具体操作"></a>
### CASE-010 — 流程标签从抽象研究阶段改到实际动作
**PREFERENCE · 2026-08-12 · commit [`2d1e20f`](https://github.com/mykcs/basemodel/commit/2d1e20f), PR [#136](https://github.com/mykcs/basemodel/pull/136)**
前：`先定实验 / 确认限制 / 选择方案 / 核对证据 / 记录结论`。
后：`确认实验 / 检查资源 / 选择模型 / 运行并记录 / 比较结果`。
规律：**操作路径可以用动词，但动词必须指向真实对象和结果。**

<a id="case-011-本页提供研究任务中的证据对象改成这页提供模型数据运行信息"></a>
### CASE-011 — 页面角色不写成产品架构术语
**PREFERENCE · 2026-08-12 · commit `2d1e20f`**
前：`本页提供研究任务中的一个证据或决策对象。`
后：`这页提供完成实验所需的模型、数据或运行信息。`
规律：**解释页面价值时，说读者拿到什么，不说系统把页面归成什么对象。**

<a id="case-012-研究主线改成实验步骤"></a>
### CASE-012 — `研究主线` → `实验步骤`
**PREFERENCE · 2026-08-12 · commit `2d1e20f`**
前：`SEED × OpenEvo 研究主线`。
后：`实验步骤`。
规律：**当内容实际是一串可执行步骤时，直接叫步骤。**
## 5. 删掉编辑者、网页和文章自己的声音

<a id="case-013-这篇文章不是开头被删除"></a>
### CASE-013 — 不用 `这篇文章不是……` 开场
**PREFERENCE · 2026-08-21 · PR [#179](https://github.com/mykcs/basemodel/pull/179), contract `research-editorial-style.md`**
前：文章先解释“这篇文章不是……”“如果只从最后的正结果讲……”。
后：直接进入实验现象、背景和科学问题。
规律：**读者来理解研究，不是来理解作者怎样设计文章。**

<a id="case-014-下面我们会被删除"></a>
### CASE-014 — 删除 `下面我们会……`
**PREFERENCE · 2026-08-21 · PR [#179](https://github.com/mykcs/basemodel/pull/179)**
前：`下面把主张和证据拆开……`、`下面我们会……`。
后：下一段直接给主张、证据或主题标题。
规律：**段落顺序已经由页面结构表达，不需要旁白再播报一次。**

<a id="case-015-如果只带走一句话被删除"></a>
### CASE-015 — 删除 `如果只带走一句话……`
**PREFERENCE · 2026-08-21 · PR [#179](https://github.com/mykcs/basemodel/pull/179)**
前：作者替读者宣布“如果只带走一句话”。
后：把真正的结论直接放在视觉和语义上的第一层。
规律：**重要性靠信息层级表达，不靠主持人口吻宣布。**

<a id="case-016-为了避免-ai-味不能写进页面"></a>
### CASE-016 — 不在页面里讨论“为什么这样写”
**PREFERENCE · 2026-08-21 · commit [`62ce244`](https://github.com/mykcs/basemodel/commit/62ce244)**
前类模式：`为了少一点内部代号……`、`为了避免 AI 味……`。
后：直接采用自然命名和结构，不解释编辑动机。
规律：**“去 AI 味”的过程本身也不能变成新的 AI 元叙事。**
<a id="case-017-完整谱系保留用于审计改成附录是什么"></a>
### CASE-017 — 不说“为什么把它放在这里”，直接说附录是什么
**PREFERENCE · 2026-08-25 · PR [#218](https://github.com/mykcs/basemodel/pull/218)**
前：`完整谱系和历史平台记录保留用于审计，默认收起，不参与主结论的视觉排序。`
后：`附录 A：Phase G–H1.41 完整实验谱系。附录 B：更早的 RTX6 平台参数实验。两个附录都默认收起，按需展开。`
规律：**写内容身份和状态，不写编辑者的视觉排序理由。**

<a id="case-018-完整流程图只保留在专门页面被删除"></a>
### CASE-018 — 删除“完整流程图只保留在专门页面”
**PREFERENCE · 2026-08-25 · PR [#218](https://github.com/mykcs/basemodel/pull/218)**
前：`完整流程图只保留在各自的专门页面；这里提供回看入口，让当前页面继续承担实验或复现主线。`
后：整段删除，保留真实导航入口本身。
规律：**不要把信息架构决策写给读者。**

<a id="case-019-删除已并入的编辑说明"></a>
### CASE-019 — 删除 `这篇前景笔记已经并入当前研究路径`
**PREFERENCE · 2026-08-25 · PR [#219](https://github.com/mykcs/basemodel/pull/219), commit [`498e381`](https://github.com/mykcs/basemodel/commit/498e381)**
前：`这篇前景笔记已经并入当前研究路径；下面的入口会带你到它现在的正式位置。`
后：删除该 aside，只保留入口。
规律：**内容搬家是网站维护历史，不是研究内容。用户反馈的核心是：“这不是读者关心的事”。**

<a id="case-020-这一节只保留历史诊断价值改成直接状态"></a>
### CASE-020 — `这一节只保留历史诊断价值` → 直接写平台状态
**PREFERENCE · 2026-08-25 · PR [#218](https://github.com/mykcs/basemodel/pull/218)**
前：`这一节只保留历史诊断价值。RTX6……已经退出当前实验主线……`
后：`RTX6（4×RTX 3090）已退出当前实验主线。当前 WebShop 的科学结论以……为准。`
规律：**状态本身已经足够，不需要“这一节的职责”作前缀。**
<a id="case-021-本站记录合同改成实验记录合同"></a>
### CASE-021 — `本站记录合同` → `实验记录合同`
**PREFERENCE · 2026-08-25 · PR [#224](https://github.com/mykcs/basemodel/pull/224), commit [`50ce9e0`](https://github.com/mykcs/basemodel/commit/50ce9e0)**
前：`本站记录合同`、`站内实验记录`。
后：`实验记录合同`、`实验记录同时保存 task_score 与 exact success`。
规律：**命名科学对象，不命名“本站怎样处理它”。**

<a id="case-022-本节只定义改成直接评估事实"></a>
### CASE-022 — `本节只定义评估输出` → 直接写评估输出
**PREFERENCE · 2026-08-25 · PR [#224](https://github.com/mykcs/basemodel/pull/224)**
前：`本节只定义评估输出：终局状态经过 evaluator 后得到……下一节……`
后：`终局状态经过 evaluator 后得到 task_score 与 exact success；公平比较要求 SEED 与 OpenEvo 在同一评分合同下报告二者。`
规律：**事实和约束比“这一节负责什么”更重要。**

<a id="case-023-本节对象改成讨论对象"></a>
### CASE-023 — `本节对象` → `讨论对象`
**PREFERENCE · 2026-08-25 · PR [#224](https://github.com/mykcs/basemodel/pull/224)**
前：`本节对象`。
后：`讨论对象`。
规律：**把 UI 指向实际对象，而不是文章章节自身。**

<a id="case-024-本节只建立改成直接陈述关系"></a>
### CASE-024 — `本节只建立一条关系` → 直接陈述关系
**PREFERENCE · 2026-08-25 · PR [#224](https://github.com/mykcs/basemodel/pull/224)**
前：`本节只建立一条关系：1,000 个商品……；下一节再处理……`
后：`1,000 个商品通过 WebShop 的 synthetic goal generation 产生 6,910 个可执行 goals；goal 的 index split 见 SEED wrapper 划分图。`
规律：**关系本身就是最好的过渡；不需要章节舞台提示。**
## 6. 技术解释：先给上下文，再给术语和机器细节

<a id="case-025-先解释-webshop-任务再讲内部对象"></a>
### CASE-025 — 先让第一次来的读者知道 WebShop 在做什么
**PREFERENCE · 2026-08-24 · PR [#215](https://github.com/mykcs/basemodel/pull/215)**
前：页面更快进入 split、goal ID、wrapper 等内部结构。
后：先解释一个购物任务如何从自然语言要求变成搜索、点击、选项和评分，再进入数据集切分。
规律：**first-reader 不是“降低智力”，而是补齐项目上下文。**

<a id="case-026-先给一句话含义再给专业解释和证据"></a>
### CASE-026 — L1 → L2 → L3 分层，而不是把所有细节平铺
**PREFERENCE · 2026-08-26 · PR [#254](https://github.com/mykcs/basemodel/pull/254)**
后形成固定三层：`一句话看懂` → 中文优先的专业机制 → `展开实验依据`。
规律：**读者先拿到解释，再决定是否需要精确 counts / manifests / configs。**

<a id="case-027-中文含义先于项目英文标签"></a>
### CASE-027 — 中文含义先于项目英文标签
**PREFERENCE · 2026-08-26 · PR [#254](https://github.com/mykcs/basemodel/pull/254)**
前：`TRAIN CANDIDATE POOL`、`task_score` 等标签可能先于解释出现。
后：`训练候选池 (TRAIN CANDIDATE POOL)`、`原始任务分数 (task_score)`；术语第一次出现时给中文含义。
规律：**英文检索名可以保留，但不能成为中文读者理解概念的前置条件。**

**2026-09-08 复发 / 阶段汇报**：`closeout` 对项目内部的人很顺手，但对老师和普通技术观众不是通用科研词；读者既不知道它是“最终实验结果”“实验收口”还是“归档完成”，也无法自行给出替代词。观众层改用 `最终实验结果 / 完整实验结果 / 最终测试`。LoRA、RL、GPU 这类领域通用术语可以直接保留；`closeout / successor / continuing state / transition authority` 这类项目内部英文默认翻译为普通中文，只有复现或证据链接需要时才保留原名。

**2026-09-08 再次复发 / 演讲稿眉题**：`OpenEVO · SEED × WebShop`、`AGENDA / RESULTS / QUESTION / MECHANISM` 这类小号英文眉题即使视觉上很轻，也会让中文观众多做一次“这行是不是有新信息”的判断；删掉后页面语义没有损失，因此属于纯认知噪声。默认规则收紧为：**一个英文小标签如果删掉后不损失对象身份、技术定义或导航意义，就不要放。** `LoRA / RL / GDR / TaskVector` 这类真正的技术对象仍可保留；`Too long, Don't read` 是用户明确指定、用于区分另一种阅读模式的例外。

<a id="case-028-技术定义先回答它在系统里干什么"></a>
### CASE-028 — 定义术语时先说它做什么
**PREFERENCE · 2026-08-12 至 08-26 · layered explainer 系列**
例：`Reward` 不只翻译为“奖励”，而是解释为“把一次任务做得怎么样变成训练可用的结果信号”。
规律：**术语的功能性含义比词典式同义词更有用。**
<a id="case-029-结论先于实验账本"></a>
### CASE-029 — 结论先于实验账本
**PREFERENCE · 2026-08-26 · PR [#245](https://github.com/mykcs/basemodel/pull/245)**
前：Results 容易先暴露内部 run / phase / evidence 结构。
后：第一屏先放“现在知道什么、最新评测、还缺什么”，精确 counts、CI、manifest 和 provenance 放在 `展开实验依据`。
规律：**run ID 是 provenance，不是读者理解结果的第一层目录。**

<a id="case-030-可见推理桥而不是只给标签"></a>
### CASE-030 — `观察 → 支持 → 还不能证明` 的可见推理桥
**PREFERENCE · 2026-08-26 · PR [#247](https://github.com/mykcs/basemodel/pull/247)**
后：每个重要结果都让读者看见“观察到什么 → 这个观察支持什么 → 还不能证明什么”。
规律：**说人话不是删掉推理，而是把推理从内部标签翻译成可检查的逻辑。**

<a id="case-031-一个不字也属于科学正确性"></a>
### CASE-031 — 一个 `不` 字也属于科学正确性
**PREFERENCE · 2026-08-25 · PR [#230](https://github.com/mykcs/basemodel/pull/230)**
历史修复：缺失的否定词会把研究结论极性翻转，必须恢复并用测试保护。
规律：**“更顺口”不能以牺牲 claim polarity 为代价。**

<a id="case-032-否定句不是一刀切禁用"></a>
### CASE-032 — 否定句不是一刀切禁用
**PREFERENCE · 2026-08-25 · PR [#231](https://github.com/mykcs/basemodel/pull/231)**
前：copy audit 对正文 `X 不是 Y，而是 Z` 也可能报 negative-heading。
后：收窄规则，只把没有上下文的 negative-first heading 当候选；科学澄清和边界对照可以保留。
规律：**问题是信息顺序，不是汉字 `不` 本身。**
<a id="case-033-frozen-改成评测期间参数不更新"></a>
### CASE-033 — `frozen model` → 直接说“评测期间参数不更新”
**PREFERENCE · 2026-08-27 · PR [#290](https://github.com/mykcs/basemodel/pull/290)**
前：`两臂都是 frozen models` 容易和 vendor Base checkpoint / 模型来源混淆。
后：明确写“评测期间参数不再更新”，并单独说明 checkpoint 身份。
规律：**同一个词有两种技术含义时，不要靠读者猜这里是哪一种。**

<a id="case-034-命令与-wrapper-先于-parser-术语"></a>
### CASE-034 — 命令与 wrapper 先于 parser 术语
**PREFERENCE · 2026-08-27 · PR [#274](https://github.com/mykcs/basemodel/pull/274), commits `6cfee32`, `c859678`**
前：直接讨论 parser、projection、wrapper drift、compatibility preflight。
后：先解释 `search[...] / click[...]` 是实际动作命令，`<action>...</action>` 是让解析器定位命令的外层标签；再解释标签漂移怎样让合法命令被读错。
规律：**先给对象和故障机制，再给内部术语。**

<a id="case-035-机器计数改成人类句子"></a>
### CASE-035 — `0 个训练步` → `我们一步都没训练`
**PREFERENCE · 2026-08-27 · PR [#287](https://github.com/mykcs/basemodel/pull/287), commits [`6027674`](https://github.com/mykcs/basemodel/commit/6027674), [`6766154`](https://github.com/mykcs/basemodel/commit/6766154)**
前：`0 个 OpenEvo adapter 训练步即可看到 [action]`。
后：`我们一步都没训练，BASE 就已经写出了 [action]`。
规律：**正文用人类自然状态；精确 0 和 raw field 留在证据层。**

<a id="case-036-责任先直接点名负责层"></a>
### CASE-036 — 责任先直接点名负责层
**PREFERENCE · 2026-08-27 · commit [`33d4ca6`](https://github.com/mykcs/basemodel/commit/33d4ca6), PR [#309](https://github.com/mykcs/basemodel/pull/309)**
前：先写 `不能归给 SD-LoRA……`、`不是 SEED parser bug……`，读者要看完排除法才知道责任在哪。
后：先写 `责任在我们的实验集成层` / `真正漏掉的是正式评测前的兼容性预检`，再解释模型漂移和 parser 合同。
规律：**责任已知就直接说；不要用“清嫌疑人”来制造推理感。**
<a id="case-037-事故标题先说发生了什么"></a>
### CASE-037 — 事故标题先说发生了什么
**PREFERENCE · 2026-08-27 · PR [#278](https://github.com/mykcs/basemodel/pull/278)**
前：标题偏向内部 forensic trace / parser 归因。
后：标题先描述模型动作格式与评测接口发生了什么，再在正文追代码责任。
规律：**事故页面先让读者看懂事件，不要把取证术语当新闻标题。**

<a id="case-038-归因前先补实验设置"></a>
### CASE-038 — 归因前先补零上下文实验设置
**PREFERENCE · 2026-08-27 · PR [#280](https://github.com/mykcs/basemodel/pull/280)**
前：读者可能在不知道 BASE / SD-LoRA、训练与评测关系时进入责任分析。
后：先交代比较对象、训练发生在哪、评测怎样读动作，再列替代解释并逐项核对证据。
规律：**先给最小必要上下文，不能要求读者从结论反推实验结构。**

<a id="case-039-pre-specification-不能升级成-preregistration"></a>
### CASE-039 — `pre-specification` 不能升级成 `preregistration`
**PREFERENCE · 2026-08-29 · PR [#331](https://github.com/mykcs/basemodel/pull/331), commit [`afc7633`](https://github.com/mykcs/basemodel/commit/afc7633)**
前：历史文字把提前固定的比较问题写成更强的 `preregistration`。
后：收窄为 `pre-specification`，只声称证据真正支持的“提前固定”。
规律：**专业词不能为了显得更正式而升级 claim。**

<a id="case-040-unknown-保持-unknown"></a>
### CASE-040 — unknown 保持 unknown，不补一个“看起来合理”的答案
**PREFERENCE · 2026-08-12 至 08-28 · copy / evidence contracts，PR [#314](https://github.com/mykcs/basemodel/pull/314)**
前风险：把未报告、未核验、来源冲突等状态压成 `false / 0 / no`。
后：区分 `not_disclosed / not_reported / not_verified / conflicting_evidence`，正文用正常语言解释，底层状态仍可追溯。
规律：**人话负责解释未知，不能负责把未知填掉。**

## 7. 2026-08-30 `lyg2171`：标题与解释腔的去 AI 味判例

<a id="case-041-服务器标题直接命名对象"></a>
### CASE-041 — 服务器标题直接命名对象
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336), commit [`c312949`](https://github.com/mykcs/basemodel/commit/c312949)**
前：`这台服务器能做什么，以及哪里最容易先用满`。
后：`lyg2171 服务器简介`。
规律：**普通 H1 先告诉读者页面是什么，不需要先制造一个“阅读问题”。**

<a id="case-042-能直说就不强行比喻"></a>
### CASE-042 — 能直说就不强行比喻
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：`把它想成一张给科学训练用的大工作台：CPU 和内存很宽裕……`
后：`lyg2171 是当前 OpenEvo / WebShop 实验使用的主要训练服务器。配置为 2 × Intel Xeon Platinum 8380、1.0 TiB 内存和 8 × RTX 5090；当前主文件系统剩余约 55 G。`
规律：**字面事实已经简单时，比喻只会增加“解释型 AI”口吻。**

<a id="case-043-怎么读改成-gpu-规格"></a>
### CASE-043 — `“第几代”和“多少核”怎么读` → `GPU 规格`
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：标题规定读者怎样理解两个概念。
后：标题只命名 `GPU 规格`；正文直接写 RTX 50 系列、Blackwell、21,760 CUDA cores、显存和 Compute Capability。
规律：**“怎么读”属于作者动作；规格属于页面主题。**

<a id="case-044-常见误解改成事实栏目"></a>
### CASE-044 — `一个常见误解` → `多卡性能说明`
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：`一个常见误解`。
后：`多卡性能说明`。
规律：**不要先宣布“有人会误解”；直接说这一段提供什么事实。**

<a id="case-045-最容易撞到的上限改成磁盘使用情况"></a>
### CASE-045 — `我们现在最容易撞到的上限` → `磁盘使用情况`
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：作者先判断“最容易撞到”。
后：`磁盘使用情况`，并直接列 437 G / 360 G / 55 G / 87%。
规律：**事实表已经会让风险自己显现，不必每个栏目都加戏。**

<a id="case-046-为什么看起来不像改成原因"></a>
### CASE-046 — `为什么 360 / 437 看起来不像 87%？` → `df 显示 87% 的原因`
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：模拟读者提问。
后：直接命名需要解释的现象和原因。
规律：**问句不是天然更亲切；如果答案是稳定知识点，陈述式标题更自然。**

<a id="case-047-这些数字怎么测出来改成数据来源"></a>
### CASE-047 — `这些数字是怎么测出来的？` → `数据来源`
**PREFERENCE · 2026-08-30 · PR [#336](https://github.com/mykcs/basemodel/pull/336)**
前：`这些数字是怎么测出来的？`
后：`数据来源`，正文直接列 `lscpu / free -h / df -hT / du / nvidia-smi`。
规律：**稳定、可扫描的名词标题优先于教程式问句。**

## 8. 2026-08-30：结果页深度与交互语义

<a id="case-048-结果页不是命令手册"></a>
### CASE-048 — 结果页不是命令手册
**PREFERENCE · 2026-08-30 · PR [#342](https://github.com/mykcs/basemodel/pull/342), commit [`08cfa76`](https://github.com/mykcs/basemodel/commit/08cfa76)**
前：研究页面仍有 shell command、secret provisioning、完整脚本/config/log 等实现细节混在科学主阅读路径里；读者可能要先理解“怎么跑”，再理解“实验发现了什么”。
后：科学问题、直接结果、决定性数字、解释和证据边界保持可见；copy/paste commands、密钥配置、长脚本/config/log 和排障步骤进入有具体名称的 progressive disclosure。
规律：**“说人话”也包括页面深度：公开主线先服务理解科学结果，复现机械细节仍可审计，但不抢第一阅读层。**

<a id="case-049-不要-cat-就不能提供复制-cat"></a>
### CASE-049 — 写“不要 `cat`”，界面就不能同时提供“复制 cat”
**PREFERENCE · 2026-08-30 · PR [#344](https://github.com/mykcs/basemodel/pull/344), commit [`dae2a32`](https://github.com/mykcs/basemodel/commit/dae2a32)**
前：安全提示写“不用 `cat`”，但 inline `<code>` 被全站 copy enhancer 自动增强成 `复制这段内容: cat` 按钮。
后：`cat` 保持普通警告文本，并用浏览器回归测试保证不会生成复制按钮。
规律：**文案语义和交互 affordance 必须一致；不能一边劝阻一个动作，一边把那个动作做成最醒目的 CTA。**


<a id="case-050-公开示例使用通用路径而不暴露账号身份"></a>
### CASE-050 — 公开示例使用通用路径，而不是公开真实账号身份
**PREFERENCE · 2026-08-30 · PR [#349](https://github.com/mykcs/basemodel/pull/349), commit [`3e5e7b0`](https://github.com/mykcs/basemodel/commit/3e5e7b0b3b1420c0d944fa9a937665b195d2f3b2)**
前：公开复现命令里仍出现某个真实 Unix 用户的 `/data/home/<user>/...` 一类路径与硬编码 ownership。
后：改成 `$HOME/.secrets/...`，由当前实验 Unix 账号自然解析；源代码和浏览器回归同时禁止旧的可识别路径重新出现。
规律：**公开文案只写复现需要知道的路径语义，不把实验室账号身份当成“具体一点”的例子。**

## 9. 2026-08-31：内部术语、数字与因果解释的正反面对照

<a id="case-051-内部计数不能代替解释"></a>
### CASE-051 — 内部计数不能代替解释
**PREFERENCE · 认可案例 + 反面案例 · 2026-08-31 · owner feedback**

**反面案例**：`Stage 2 写出了 20,480 条 rollout 和 797 条 qualified-positive trajectory，但 80/80 个 block 都没有参数更新；单个 block 的 qualifying identity 最大只有 7，而 gate 需要 8。`

问题：数字都对，但 `rollout / qualified-positive / block / qualifying identity / gate` 五个项目内词同时出现，零上下文读者无法知道 7 和 8 数的是什么，也不知道为什么 7 < 8 会让参数保持不变。

**认可案例**：`Stage 2 完成了 20,480 次 WebShop 任务尝试，其中 797 次是完整成功、且轨迹质量足以进入训练候选池。这个历史实验把每 256 次尝试单独检查：只有同一批里至少有 8 个不同任务都能重复完整成功，才允许更新参数。实际最好的一批只有 7 个，因此这次运行的 80 批数据都没有触发参数更新。`

规律：**内部名词第一次出现时先翻译成现实对象；不能把精确计数当成读者已经理解机制。**

<a id="case-052-数字因果链要把规则说完整"></a>
### CASE-052 — `7 < 8` 不是解释，规则本身才是解释
**PREFERENCE · 认可案例 + 反面案例 · 2026-08-31 · owner feedback**

**反面案例**：`identity 最大 7，gate 需要 8，所以 80/80 block 都没有更新。`

**认可案例**：`当时的规则要求：每收集 256 次任务尝试，就统计这一批里有多少个不同任务至少完整成功 2 次；达到 8 个才允许更新参数。最好的一批只有 7 个，所以程序从未进入参数更新。`

规律：**因果句要写出“判定对象 → 判定规则 → 实际值 → 结果”，不能只留下数学不等式。**

<a id="case-053-历史规则不能伪装成长期算法"></a>
### CASE-053 — 历史运行规则不能伪装成长期 Stage 2 定义
**PREFERENCE · 认可案例 + 反面案例 · 2026-08-31 · owner feedback**

**反面案例**：`Stage 2 的 gate 是 8；达不到就不更新。`

**认可案例**：`这次历史实验用“每批至少 8 个重复成功任务”作为方法控制门槛，所以它能解释这一次为什么没有更新；它不代表 OpenEVO 长期 Stage 2 必须采用同一门槛或逐批清零。`

规律：**公开文案必须区分“这次程序怎么跑”与“方法长期应该怎么设计”。实验配置不能在措辞里偷偷升级成算法定义。**

<a id="case-054-阶段二失败不能写成一个标签"></a>
### CASE-054 — “Stage 2 失败”不能把不同故障压成一个标签
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-01 · owner feedback**

**反面案例**：`Stage 2 又失败了，所以现在设计 Harness 2.0。`

**认可案例**：`第一版 Stage 2 有数百条可训练成功轨迹，但逐批门槛不允许它们进入参数更新；Ceiling-1.0 删除了这道门后，7B 能继续产生参数组件，而 3B 跑了 18 轮仍是 0，并大量选择当前页面不存在的动作。Harness 2.0 因此针对的是新的经验注入 / 动作接口问题，不是重复修第一版的 7 对 8 门槛。`

规律：**同一研究阶段连续出现问题时，要给每次失败一个不同的“现实机制”，不能让版本号或“失败”二字承担因果解释。**

<a id="case-055-技术版本页标题先写发生了什么"></a>
### CASE-055 — 技术版本页标题先写发生了什么，不先写内部版本名
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-01 · owner feedback**

**反面案例**：`历史 Stage 2：窗口化硬门槛（设计错误 / 已取代）`、`OpenEVO-Ceiling-1.0 Stage 2`、`OpenEVO 2.0`。

**认可案例**：`第一次 Stage 2 为什么白跑：有成功经验，但旧规则不让模型继续学`；`旧的 7 对 8 门槛删掉了，但 3B 还是没有学起来`；`Harness 2.0：修复模型和 WebShop 的动作接口，再重跑 20,480 次任务`。

规律：**内部版本名可以保留作索引，但 H1 应优先告诉第一次进入页面的人“这一版解决什么 / 发生了什么”。**

<a id="case-056-资格检查先解释为什么存在"></a>
### CASE-056 — Harness 资格检查先解释“为什么存在”，再写 telemetry / receipt
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-01 · owner feedback**

**反面案例**：`Context Governor + carrier lint + Telemetry v2 + preformal Harness Qualification。`

**认可案例**：`3B 的很多失败是动作格式正常，但当前页面根本没有那个动作。正式再花 20,480 次任务预算之前，先跑两个各 128 次的小实验：一组不放历史经验，另一组只放经过接口安全约束的经验；任务、模型参数、随机种子、温度和解析器都保持相同。`

规律：**工程检查项放到第二层；第一层先说它在防什么具体失败、比较哪两个东西、哪些变量保持不变。**

<a id="case-057-没有发生不能写成效果差"></a>
### CASE-057 — “没运行”不能写成“失败”
**PREFERENCE · 认可案例 + 反面案例 · 2026-08-31 · owner feedback**

**反面案例**：`T2 failed`、`final = 0`，但对应评测实际上没有启动。

**认可案例**：`T2 没有运行，因此没有 T2 分数，也不能判断它是成功还是失败。`

规律：**没有测量结果（absence of measurement）不是负面测量结果。未运行、0 分、0 次更新、测量无效必须分开写。**

<a id="case-058-first-reader-completeness-test"></a>
### CASE-058 — 一句话必须经得起“第一次来的研究生”测试
**PREFERENCE · 认可案例 + 反面案例 · 2026-08-31 · owner feedback**

**反面案例**：作者看到内部名词就能补全上下文，因此觉得 `7/8 gate`、`59/80 + 171 partial`、`PREPARED` 已经足够。

**认可案例**：删除聊天历史和内部记忆后，页面本身仍能回答“发生了什么、数字数什么、为什么这样、能推出什么、不能推出什么”。

规律：**聪明读者不等于拥有项目上下文。公开科研页面必须自包含到足以让第一次来的研究生理解主要因果与边界。**

<a id="case-059-eli5-不能删掉对象只留下数字或空泛动词"></a>
### CASE-059 — ELI5 不能删掉对象，只留下数字或空泛动词
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-01 · owner feedback**

背景：Ceiling-1.0 的 SD-LoRA 上游实现原本有独立的 `64-component` stop。代码与 amendment 证明：每次正式 SD-LoRA `UPDATE` 都要求 `component_count_after = component_count_before + 1`；因此这里的 64 对应“这条连续训练最多允许发生 64 次这种参数更新”，而不是 optimizer step 上限。

**反面案例**：`放宽 64 限制`。

问题：这句话很短，但第一次来的读者不知道 64 数的是任务、轮次、显存、LoRA rank 还是更新次数。它不是 ELI5，只是把内部术语删掉后留下了一个失去对象的数字。

**认可案例**：`放宽参数更新次数`。说明卡第二层再写：原来最多允许 64 次新的 SD-LoRA 参数更新；每次更新新增一个 component；现在取消独立的 64 次停止线，继续由 effective rank ≤ 4096、显存、磁盘/产物增长等容量保护约束。一次这样的参数更新内部仍可包含多个 optimizer steps。

同一原则下：

- `7B 继续跑` → `继续 7B 训练`；
- `工程修复` → `修复训练运行问题`；
- `当前结果` → `7B 当前进度`；
- `以后可能压缩` → `以后可能压缩已积累的参数更新`。

规律：**ELI5 的目标是让读者少做一次术语解码，不是让字数最少。第一层必须保留“对象 + 变化/状态”；内部名、精确字段和例外条件再进入第二层。**

**2026-09-08 复发 / 阶段汇报封面**：`7B：49.33 / 58⁄128；1.7B：37.60 / 1⁄128` 虽然数字正确，但读者不知道 `49.33 / 37.60` 是什么量、满分多少，也不知道 `58/128 / 1/128` 数的是任务、轨迹还是成功次数。修正为 `Task Score · 49.33 / 100`、`完整成功 · 58 / 128 个任务（45.31%）` 等完整标签，并在第一次出现处解释：Task Score 衡量任务完成程度，完整成功只统计整道任务真正完成。**决定性数字也必须带“指标名 + 单位/分母 + 最小语义解释”；不能因为版面紧就退化成只有作者自己看得懂的数字串。**

同一轮反馈里，标题 `44 → 7：GDR 把“学习多少”变成机制问题` 也属于同一种失败：44 和 7 都没有对象。改成 `训练出 44 个参数更新候选，最终只有 7 个进入模型：GDR 是否筛得太保守？`，让数字、对象和科研问题同时出现。

<a id="case-060-关系状态前先给参照物"></a>
### CASE-060 — “共同 / 继续 / 仍然 / 后续”前先给参照物
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-01 · owner feedback**

**反面案例**：`当前 corrected Stage 1 仍是共同起点。第一次 Harness 2.0 128+128 qualification 已完成……`

问题：`共同起点` 是一个关系，不是独立事实。第一次来的读者还不知道后面有哪两条训练路线，也不知道它们为什么共用 Stage 1，就先被要求理解“共同”。`当前 / 仍是 / 后续` 同样都依赖一个尚未交代的参照物。

**认可案例**：`接下来的训练分成两个阶段：Stage 1 先收集并整理经验，Stage 2 再用这些经验继续训练。Ceiling-1.0 和 OpenEVO 2.0 都沿用同一份 corrected Stage 1，因此它们从这里分成两条 Stage-2 路线。`

同一原则下：

- `仍然是 8 张 GPU` → `并行规模保持 8 张 GPU`；
- `当前 policy 继续通过同一个 harness…` → `Stage 2 的 policy 继续通过 SEED / verl-agent harness…`；
- `当前路线把同一轮 128 条证据…` → `Ceiling-1.0 每轮把 128 次任务记录…`；
- `已经跑过 / 后续资格状态已更新` → `历史运行 / 机械资格已完成`。

规律：**关系词不是坏词，但必须先让读者知道关系两端是什么。结论先于解释，不等于让“共同、继续、仍然、后续”在没有参照物时充当第一句。先补最小结构，再说关系状态。** 这条规则是 [CASE-038](#case-038-归因前先补零上下文实验设置) 的句子级延伸。

<a id="case-061-首屏先说明对象类型"></a>
### CASE-061 — 首屏先说明对象是什么，再说明和谁比较
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：`OpenEvo × SEED：WebShop 研究`。第一次来的读者必须自己知道 OpenEvo 是 Harness、WebShop 是数据集；`× SEED` 先给了关系，却没有先给关系两端的类型。

**认可案例**：`OpenEVO (Harness) · WebShop 数据集实验`；下一行再写 `和 SEED 对照`、SEED 论文、训练资源与来源入口。

规律：**陌生对象的类型属于首屏身份，不属于背景知识。先说“它是什么”，再说“它和谁比较”；不要让关系符号代替对象身份。H1、全局入口标签和页内研究导航都属于这条身份链，不能让导航先恢复成旧的关系式命名。**

<a id="case-062-首屏-tldr-先说实验做了什么"></a>
### CASE-062 — 实验总览首屏先给 TL;DR，不重复教一遍背景课
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：H1 下面先用整段重新解释 `WebShop 是一个文字购物环境……`，再给“目前的答案”。页面已经有独立的流程理解图，但实验总览仍重复占用首屏注意力。

**认可案例**：H1 与来源/资源行之后直接给 TL;DR：第一段说主 benchmark 与机制实验分别做什么，第二段说已经知道什么、还不能下什么结论；OpenEVO / SEED / WebShop 的背景统一链接到流程理解图。

规律：**实验总览的首屏注意力预算优先回答“这是什么实验、做了什么、现在知道什么”。已有 canonical explainer 的背景知识不在首屏重讲，只提供清楚入口。**

<a id="case-063-怎样连起来不是主题"></a>
### CASE-063 — `怎样连起来 / 怎么读 / 先…再…` 不是主题
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：`三个研究问题怎样连起来`、`未知状态如何阅读`、`结果应该怎么读？`、`先判断这次比较能不能信，再判断谁的分数更高`。这些标题在扮演主持人，要求读者先理解“作者想怎样带我读”。

**认可案例**：`三个研究问题`、`未知状态`、`结果判定`、`有效性与分数判定`。连接关系、阅读顺序和解释句放在标题下面。

规律：**标题是页面坐标，不是主持人口播。能用名词短语命名对象时，不要把“如何理解 / 怎样串起来 / 先看什么再看什么”升成 H1/H2/H3。真正的科学研究问题本身仍可以是问句。**

<a id="case-064-真人反馈必须形成回归资产"></a>
### CASE-064 — 真人反馈不是一次性改字，要形成回归资产
**PREFERENCE · PROCESS · 2026-09-07 · owner live-page feedback**

本次反馈不是只修改 `/research/seed-openevo/study/`：同类扫描还发现了 GPU 预算、复现路径、结果判定、Stage 2 策略等页面里的主持人式标题。

规律：**真人指出一次可理解性问题后，交付必须包含四件事：修当前实例、保存反例/正例、抽象成可执行规则、扫描并修复同类高置信实例。能机械检测的模式再进入测试或审计脚本，避免未来 Agent 重复踩坑。**

<a id="case-065-内部路线代号不能代替实验对象"></a>
### CASE-065 — `Track A` 不能代替实验对象
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner feedback**

**反面案例**：`OpenEvo · Track A 7B`。第一次进入实验页的人不知道 Track A 是路线、数据集、模型版本、训练阶段还是结果等级；这个内部代号反而遮住了真正需要识别的对象。

**认可案例**：首层直接显示 `7B · 基础模型` 与 `7B · 使用 OpenEVO 学习结果`。如果审计和历史谱系仍需要内部名，则在第二层写成 `源码忠实任务测量路线（内部代号 Track A）`，并链接机器证据。后续 CASE-066 进一步说明，`配对评测` 也不应成为首层替代名。

规律：**公开首层先命名真实对象，再给内部代号。内部 route / branch / phase 名是 provenance，不是读者身份标签。H1/H2/H3、TL;DR、表格第一列和首屏结果卡都不得要求读者先掌握项目内部命名。**

<a id="case-066-配对评测仍然要求读者先懂统计术语"></a>
### CASE-066 — `配对评测` 仍然要求读者先懂统计术语
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner feedback**

**反面案例**：`OpenEVO · 7B 配对评测`。虽然已经去掉内部代号 `Track A`，第一次来的读者仍要先知道“配对”在统计设计里是什么意思，才能判断到底比较了谁。

**认可案例**：表格直接拆成两行：`7B · 基础模型 — 7.17 / 100` 与 `7B · 使用 OpenEVO 学习结果 — 8.74 / 100`，并注明两行做同一批 128 个 WebShop 任务、使用同一评测方式。统计层需要时再解释“因为任务一一对应，所以可以做 paired analysis”。

规律：**不要把一个内部代号换成另一个专业术语就算完成 ELI5。能把比较双方直接拆开显示时，就直接显示双方、分数和共同任务；方法学术语放到第二层。**

<a id="case-067-直接说实验事实不要制造分岔故事"></a>
### CASE-067 — 直接说实验事实，不制造“分岔 / 分叉”故事
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：`第一轮购物学习：7B 与 3B 的分岔`。页面实际只是分别用 7B 和 3B 做实验；“分岔”没有增加科学信息，却要求读者额外猜“从哪里岔开、为什么岔开、是不是存在某个共同分支点”。同一页面的 `路径分叉`、`两条路线` 也制造了同样的无必要联想。

**认可案例**：`3B 和 7B 的第一轮购物实验`；首段直接写 `我们分别用 Qwen2.5-3B 和 Qwen2.5-7B 做 WebShop 实验。`。如果实验设计确实从同一个 frozen checkpoint 分成两个 treatment arm，也优先写 `从同一 checkpoint 分成两组`，让动作本身承担含义，而不是把 `fork / 分叉` 当叙事风格。

**第二个反面案例**：中文页面 H1 上方出现 `HISTORICAL MAP · FIRST RUN`、`ROGUELIKE RESEARCH MAP · EXPLORATION`、`THE RESEARCH EVOLVED WITH THE QUESTION` 一类全英文 eyebrow。它们既不是必要的实验术语、日期、状态，也没有比 H1 新增信息，只是为了“看起来像一层设计”。

**认可处理**：没有新增信息就删除 eyebrow；如果它确实承担日期、阶段、状态或 provenance，则中文页面先给中文含义，英文只作为必要的检索/身份补充。

**同类扫描**：同一轮还发现 `Stage 1 设计分岔`、`四组实验怎样一起回答问题？` 与 `我们现在把旧实验放回正确的位置`。分别改为 `Stage 1 的两项设计选择`、`3B / 7B × self / MiniMax 的四组比较` 和 `旧实验的记录显示`，让标题与正文先说研究对象和事实。

规律：**科研页面优先写“做了什么、观察到什么、为什么停或继续”。隐喻和关系词只有在它们准确表达一个对结论有用的机制时才出现。Eyebrow / kicker 是可选的信息层，不是必须填满的 UI 插槽；不能为了版式制造新概念。**

<a id="case-068-首屏不是把所有正确的信息同时摆出来"></a>
### CASE-068 — 首屏不是把所有正确的信息同时摆出来
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：CASE-067 修完以后，文字已经更像人话，但 first-run 首屏仍同时出现研究位置、两段任务背景、H1、说明段、五个等权重的 `研究问题 / 为什么重要 / 从哪里开始 / 什么时候结束 / 现在到哪了`，紧接着又是术语说明。每一项单独看都“正确”，合起来却要求读者在第一眼自己判断哪一块最重要。结果是能看懂，但很难立刻抓住重点，也缺少继续读的欲望。

**owner 的进一步纠正**：不要把“学 Apple”理解成大字、留白、圆角或营销式 hero。真正要学的是人机界面的认知假设：读者的时间和注意力都很少；设计要替读者先完成取舍。第一次看的人应在几秒内知道“这是什么、最重要的结果是什么、为什么值得继续看”，而不是先浏览一张信息清单。

**2026-09-09 重复证据**：全站 cold read 再次发现同一机制以新形式返回：多个普通入口页把 `100svh` / 垂直居中 / 大块无语义空白、模板驱动的标题字体和实现细节优先误当成“attention-first”。owner 直接指出：`这个是因为我之前让 agent 模仿 Apple 开发者设计的思路，看来只模仿其形未模仿其神。` 这不是新的近义 CASE，而是 CASE-068 的重复纠正：**参考产品先抽“它怎样帮助人识别、分组、决定和继续”，再决定本站自己的视觉实现；不能把参考产品的表面构图当成认知原则本身。**

**认可处理**：first-run 首屏只保留主题 `3B 和 7B 的第一轮实验` 与一个事实结果：`7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。` 主要入口直接指向两种模型各自发生了什么。五问式 orientation 仍保留，但降到原生 `<details>` 的 `实验信息`；任务/研究位置仍可见，但使用 compact context，不再与 H1 竞争。完整实验过程、数字、术语和历史证据继续留在正常文档流中。

**边界**：这不是“越少越好”，也不是把关键科学 caveat 藏起来。会改变结论含义的证据边界、核心比较双方、当前状态和必要下一步必须默认可见。应该后置的是重复信息、可以从后文完整恢复的辅助 orientation、诊断历史和深层术语。Simplicity 的目标是 **exactly enough**，不是 minimalism。

**Apple 官方设计原则只作为认知依据，不作为视觉皮肤模板**：[WWDC17 `Essential Design Principles`](https://developer.apple.com/videos/play/wwdc2017/802/) 讨论 visibility、mental model、grouping/proximity 与 progressive disclosure；[WWDC25 `Design foundations from idea to interface`](https://developer.apple.com/videos/play/wwdc2025/359/) 明确用 progressive disclosure 让首层只显示开始所需的信息；[WWDC26 `Principles of great design`](https://developer.apple.com/videos/play/wwdc2026/250/) 把 simplicity 定义为去掉摩擦，并强调每个功能都会消耗人的时间、注意力和信任。

**同类传播**：扫描所有 6 个 `ResearchOrientation` 使用点后，把 `3B 与 1.7B` 实验入口和报告页判为高置信同类：两页都把实际完成状态/结果埋在五个同权重字段中，因此同样改成“对象 + 最重要结果”优先，再展开通用实验信息。能力探索总入口和接口排查过程页暂不机械套用；机制实验页明确保留 narrative orientation，因为开始、停止与授权边界本身就是科学对象。

规律：**视觉强调是一种稀缺资源。一个首屏通常只承担一个主要理解任务：先让零上下文读者认出对象，再让一个最重要的事实成为最明显的信息。不要让“都正确”的次要信息同时争夺第一眼；复杂度按重要性逐层出现，但不能把改变结论的边界一起藏掉。**

<a id="case-069-视觉中心必须给真实主题"></a>
### CASE-069 — `先分清两种“新任务”` 不应该成为视觉中心
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：Results 页把 `先分清两种“新任务”` 做成大号粗体 H2。句子本身不是研究对象，而是作者对读者发出的教学指令；大字号和加粗又进一步强迫注意力先落在“我应该先怎么读”，而不是任务范围本身。

**认可案例**：`训练范围内未见任务与 SEED 验证任务`。标题直接命名需要区分的两个现实对象，下一段再说明为什么它们不能混为同一个评测集合。

规律：**标题、加粗、大字号、色彩和卡片位置都会分配读者注意力。视觉中心必须给真实主题、关键结论或决定性数字，而不是作者的教学动作。每一次强调都必须证明它降低了理解成本。**

扫描项：H1/H2/H3 中的 `先分清 / 先看懂 / 先判断 / 先理解 / 先确认` 默认进入重写队列；如果删除这些主持人动作后能得到稳定主题名，就使用主题名。

<a id="case-070-术语和代号必须就地解释"></a>
### CASE-070 — 术语表不能要求读者离开当前句子去“查字典”
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：Results 页集中放一大组 `attempt / cell / qualified positive / qualifying identity / gate / H1.38B / Track A / 128×2 / Gen28 / BASE / SD-LoRA / Δ / 95% CI` 定义卡，然后正文继续使用这些词。读者必须记住当前上下文、跳到术语区找到对应项、再跳回正文恢复上下文；很多“解释”还只是把一个内部名换成另一个专业名。

**认可案例**：第一次出现任务范围时直接写 `训练范围内没有见过的任务（任务 500–6909）` 与 `SEED 留作验证的任务（任务 0–499）`；第一次出现两个指标时直接解释 `任务完成度` 与 `完整成功` 分别回答什么。只有复现和审计真正需要的 `H1.38B / Track A / state-v28` 留在 `实验依据`、manifest 或历史记录里。

规律：**术语处理顺序是：能不用代号就不用 → 需要保留时先给人类名称/全称 → 在第一次出现的位置解释它在这里做什么 → 内部名只作精确索引。集中 glossary 可以作为参考工具，但不能成为主阅读路径，也不能把“去查表”当成正文已经解释清楚。**

扫描项：主线正文出现 run ID、route code、raw config key、英文-only 方法词时，检查同一句或紧邻句是否已经给现实对象；若理解依赖远处 glossary，优先改正文而不是扩充 glossary。

<a id="case-071-解释深度不是可见-ui-模板"></a>
### CASE-071 — `一句话看懂 / 专业解释 / 实验依据` 是深度概念，不是必须显示三层标签
**PREFERENCE · 认可案例 + 反面案例 · 2026-09-07 · owner live-page feedback**

**反面案例**：页面把每个结论机械拆成 `一句话看懂：` 与加粗的 `专业解释：`，再用虚线、卡片或额外标签分隔。虽然作者意图是“分层”，读者实际需要不断判断“我现在应该读哪一层”，视觉层级本身成为新的认知任务。

**认可案例**：主线用一到两段自然文字完成“事实 → 解释 → 边界”；精确 attempts、CI、machine fields、manifest 和 run ID 在确实需要时用本地 `<details>` 的 `实验依据` / `实验记录` 展开。若精确机制一句话就能自然接在结论后面，不另外造一个 `专业解释` 标签。

规律：**分层的目标是提供不同信息深度，不是生成可见 UI 模板。L1/L2 可以合并成普通正文；L3 才在真正需要可选深度时 progressive disclose。任何解释标签、虚线分隔或额外卡片都必须证明它减少而不是增加注意力切换。**

扫描项：公开 Results / explainer 主线出现重复 `专业解释： / Technical detail:`、`一句话看懂：` 或固定三段 chrome 时，逐项判断能否自然合并；不能机械保留“因为规范要求三层”。

### 案例簇总结：CASE-061–071 — 零上下文读者先看到现实对象与最重要事实

这十一个连续真人反馈不是十一条互不相关的禁词。它们共同指出同一个失败机制：**页面第一层要求读者先解码网站作者的关系式、背景课、阅读姿势、内部路线名、统计术语、叙事隐喻、远处术语表、额外解释层或一整张等权重信息清单，真正的实验对象、比较双方与最重要事实反而不够突出。**

从 CASE-061–071 抽象出的当前规则是：**零项目上下文的读者先看到现实对象、对象类型、比较双方和一个最重要的事实；首屏只承担一个主要理解任务；视觉中心只强调真实主题、结论和决定性数字；术语在第一次出现的位置就地解释；共同任务、必要状态与会改变结论的边界保持可见；内部 route / phase / provenance、方法学术语、重复 orientation 与非必要叙事包装放第二层、渐进披露或删除；信息深度不能机械变成新的可见 UI 模板。** 这不意味着删除专业词、英文、统计方法、证据层、所有关系词或所有细节；它们在读者已经知道“谁和谁做了什么”之后，或它们本身确实改变科学解释时，仍然应该精确保留。

未来 Agent 收到新的真人反馈时，执行下面的案例学习循环，而不是只改一处：

1. 取“当前最接近案例 + 至少 2 个同类/相邻案例”组成案例簇；必要时扩到 3–8 个，不按词面相似度机械挑选。
2. 用自己的话写出一个可复用规则，并写出反边界，确认没有把科学精度、真实研究问句或必要专业词一起删掉。
3. 按语义位置扫描全站：H1/H2/H3、lede、导航、表格第一列/行标题、结果卡、状态/callout、共享组件和 sibling routes；案例词语只作为搜索线索。
4. 把命中分成“高置信同一失败机制 / 不确定 / 有意例外”。同一任务直接修高置信项；不确定项进入 review queue，不制造大范围机械重写。
5. 能稳定机械检测的失败家族加入现有 audit/test；不能稳定检测的保留为案例和 Agent 审查步骤。记录本轮实际传播到哪些页面/组件，未来案例才知道这条规则已经覆盖到哪里。

这就是本案例库的用途：**案例不是墓碑，而是训练样本；多个案例先归纳出失败机制，再把规律传播到其他同类位置。**

## 10. 这些判例不能被误读成什么

- 不是“永远不用问句”：真实用户决策可以问，例如模型是否符合已经填写的实验条件。
- 不是“永远不用否定句”：科学澄清、安全边界和责任对照可以直接否定。
- 不是“永远不用比喻”：复杂机制且类比确实建立正确模型时可以用。
- 不是“越短越好”：必要的上下文、因果和证据边界不能被压掉。
- 不是“把所有技术词翻成口语”：专业词保留，但第一次出现要让读者知道它在这里做什么。
- 不是“让页面像聊天”：自然、克制、直接，比口语化表演更接近本项目偏好。

## 11. 建站以来的文案相关历史台账

下面是本轮确认的 **119 个高信号历史候选 commit**：116 个来自标题关键词扩展，另加 3 个由 PR body / diff 捕获的混合型公开表达变更（#342、#349、#350）。`COPY CHANGE` 表示 commit 本身以语言/标题/解释为主要变化；`SUPPORT` 多为测试、merge、CI 或保护性提交；`CONTEXT` 是对文案规范有背景价值但不单独证明偏好的文档。这个表用于防漏，不代表每一行都是最终偏好证据；最终偏好以前面的 CASE 判例为准。

| 日期 | Commit | 角色 | Subject |
|---|---|---|---|
| 2026-08-30 | [`d4f86e0`](https://github.com/mykcs/basemodel/commit/d4f86e0208440b684faaae146baa3ac18c2d8047) | EVOLUTION | refactor: implement site optimization audit [vercel-preview] (#350) |
| 2026-08-30 | [`3e5e7b0`](https://github.com/mykcs/basemodel/commit/3e5e7b0b3b1420c0d944fa9a937665b195d2f3b2) | COPY / PRIVACY | research: preserve publication lessons and redact account path [vercel-preview] (#349) |
| 2026-08-30 | [`dae2a32`](https://github.com/mykcs/basemodel/commit/dae2a32) | COPY CHANGE | fix(research): do not offer cat copy action [vercel-preview] (#344) |
| 2026-08-30 | [`08cfa76`](https://github.com/mykcs/basemodel/commit/08cfa76) | COPY / DESIGN | research: codify result-first publication depth [vercel-preview] (#342) |
| 2026-08-30 | [`c312949`](https://github.com/mykcs/basemodel/commit/c312949) | COPY CHANGE | Refine lyg2171 server page copy |
| 2026-08-29 | [`afc7633`](https://github.com/mykcs/basemodel/commit/afc7633) | COPY CHANGE | docs: narrow four-arm retrospective wording (#331) |
| 2026-08-28 | [`799a411`](https://github.com/mykcs/basemodel/commit/799a411) | COPY CHANGE | research: complete site fact, copy, and visual audit (#314) |
| 2026-08-28 | [`2e69190`](https://github.com/mykcs/basemodel/commit/2e69190) | COPY CHANGE | Align training design invariant with page copy |
| 2026-08-28 | [`4115ac0`](https://github.com/mykcs/basemodel/commit/4115ac0) | CONTEXT | docs: record WebShop explainer and Results workflow retrospective |
| 2026-08-27 | [`77b7c17`](https://github.com/mykcs/basemodel/commit/77b7c17) | COPY CHANGE | Align journey test with research findings wording |
| 2026-08-27 | [`78b88da`](https://github.com/mykcs/basemodel/commit/78b88da) | COPY CHANGE | Keep research findings wording in study nav |
| 2026-08-27 | [`c0e1dcf`](https://github.com/mykcs/basemodel/commit/c0e1dcf) | CONTEXT | docs(agents): record SEED GLM explainer and asset lessons |
| 2026-08-27 | [`0d69951`](https://github.com/mykcs/basemodel/commit/0d69951) | SUPPORT | Merge pull request #290 from mykcs/research/clarify-frozen-model-identity-20260827 |
| 2026-08-27 | [`3ac64ac`](https://github.com/mykcs/basemodel/commit/3ac64ac) | SUPPORT | test(results): assert raw wrapper evidence instead of legacy wording |
| 2026-08-27 | [`33d4ca6`](https://github.com/mykcs/basemodel/commit/33d4ca6) | COPY CHANGE | docs(agents): require direct responsibility language |
| 2026-08-27 | [`6766154`](https://github.com/mykcs/basemodel/commit/6766154) | COPY CHANGE | docs(agents): prefer natural human wording over machine counts |
| 2026-08-27 | [`0ef6942`](https://github.com/mykcs/basemodel/commit/0ef6942) | SUPPORT | test(results): require natural pre-training wording |
| 2026-08-27 | [`6027674`](https://github.com/mykcs/basemodel/commit/6027674) | SUPPORT | test(copy): protect natural zero-step wording |
| 2026-08-27 | [`8fed7e4`](https://github.com/mykcs/basemodel/commit/8fed7e4) | SUPPORT | Merge pull request #285 from mykcs/research/reader-first-copy-hierarchy-20260827 |
| 2026-08-27 | [`8f2a3a7`](https://github.com/mykcs/basemodel/commit/8f2a3a7) | COPY CHANGE | docs(results): enforce reader-first copy hierarchy |
| 2026-08-27 | [`c0c611c`](https://github.com/mykcs/basemodel/commit/c0c611c) | SUPPORT | Merge pull request #274 from mykcs/research/eli5-action-wrapper-20260827 |
| 2026-08-27 | [`4247ea2`](https://github.com/mykcs/basemodel/commit/4247ea2) | SUPPORT | test(results): protect ELI5 wrapper explanation |
| 2026-08-27 | [`2fbefb8`](https://github.com/mykcs/basemodel/commit/2fbefb8) | SUPPORT | test(results): preserve attribution boundary wording |
| 2026-08-27 | [`6cfee32`](https://github.com/mykcs/basemodel/commit/6cfee32) | CONTEXT | docs(results): explain wrapper failure before parser jargon |
| 2026-08-27 | [`c859678`](https://github.com/mykcs/basemodel/commit/c859678) | COPY CHANGE | docs(results): make action-wrapper trace reader-first |
| 2026-08-27 | [`cc6efe0`](https://github.com/mykcs/basemodel/commit/cc6efe0) | SUPPORT | Merge pull request #270 from mykcs/research/eli5-fair-comparison-20260827 |
| 2026-08-27 | [`a54a341`](https://github.com/mykcs/basemodel/commit/a54a341) | COPY CHANGE | research: clarify Track A versus full-budget comparison |
| 2026-08-27 | [`a9e64a3`](https://github.com/mykcs/basemodel/commit/a9e64a3) | COPY CHANGE | research: stack ELI5 explainer on current Results integration |
| 2026-08-27 | [`72f59e0`](https://github.com/mykcs/basemodel/commit/72f59e0) | COPY CHANGE | research: add ELI5 fair-comparison explainer |
| 2026-08-27 | [`9d0fa8e`](https://github.com/mykcs/basemodel/commit/9d0fa8e) | SUPPORT | test(results): assert measurement boundary at its current wording |
| 2026-08-27 | [`809e69c`](https://github.com/mykcs/basemodel/commit/809e69c) | COPY CHANGE | fix(results): align current Track A state with reader contracts |
| 2026-08-26 | [`71bfae1`](https://github.com/mykcs/basemodel/commit/71bfae1) | SUPPORT | test: preserve Results summary label contract |
| 2026-08-26 | [`c011881`](https://github.com/mykcs/basemodel/commit/c011881) | COPY CHANGE | fix: keep desktop results questions attached to heading |
| 2026-08-26 | [`6db3d9a`](https://github.com/mykcs/basemodel/commit/6db3d9a) | COPY CHANGE | refactor(results): make every conclusion show its evidence logic (#247) |
| 2026-08-26 | [`0e4851e`](https://github.com/mykcs/basemodel/commit/0e4851e) | COPY CHANGE | refactor(research): make SEED × OpenEvo Results lab-reader friendly (#245) |
| 2026-08-26 | [`80e3dab`](https://github.com/mykcs/basemodel/commit/80e3dab) | CONTEXT | docs(research): clarify SEED/OpenEvo evidence boundaries (#244) |
| 2026-08-25 | [`a178f5e`](https://github.com/mykcs/basemodel/commit/a178f5e) | COPY CHANGE | fix(audit): suppress 'X 不是 Y 而是 Z' false positives in COPY-NEGATIVE-HEADING (#231) |
| 2026-08-25 | [`70b6460`](https://github.com/mykcs/basemodel/commit/70b6460) | COPY CHANGE | fix(home): sync HARDEN-HOME-005 with restored 研究结果 / Research findings hero label (#229) |
| 2026-08-25 | [`50ce9e0`](https://github.com/mykcs/basemodel/commit/50ce9e0) | COPY CHANGE | fix(research): drop residual '本站 / 本节 / 这里' editor voice in WebShop figures (#224) |
| 2026-08-25 | [`498e381`](https://github.com/mykcs/basemodel/commit/498e381) | COPY CHANGE | fix(research): drop '已并入' editorial aside on ResearchPrimerMoved (#219) |
| 2026-08-25 | [`ba55be8`](https://github.com/mykcs/basemodel/commit/ba55be8) | COPY CHANGE | fix(research): drop editor-tone copy in SEED × OpenEvo reader-facing path (#218) |
| 2026-08-25 | [`385bbd5`](https://github.com/mykcs/basemodel/commit/385bbd5) | COPY CHANGE | fix(copy): bilingual benchmark section labels + mask i18n string literals (#217) |
| 2026-08-24 | [`b5b1788`](https://github.com/mykcs/basemodel/commit/b5b1788) | SUPPORT | test(research): measure mixed-language heading density correctly |
| 2026-08-24 | [`8b802e3`](https://github.com/mykcs/basemodel/commit/8b802e3) | SUPPORT | chore: restore trailing newline in heading policy test |
| 2026-08-24 | [`62b6a9f`](https://github.com/mykcs/basemodel/commit/62b6a9f) | COPY CHANGE | refine WebShop interaction teaching copy |
| 2026-08-24 | [`c37c47b`](https://github.com/mykcs/basemodel/commit/c37c47b) | SUPPORT | test(research): align heading policy with findings page |
| 2026-08-24 | [`4e50935`](https://github.com/mykcs/basemodel/commit/4e50935) | COPY CHANGE | refine navigation resource copy |
| 2026-08-24 | [`2d26318`](https://github.com/mykcs/basemodel/commit/2d26318) | COPY CHANGE | docs(research): align production explainer reader contract |
| 2026-08-24 | [`4ec8228`](https://github.com/mykcs/basemodel/commit/4ec8228) | SUPPORT | test(research): align SEED split browser heading |
| 2026-08-24 | [`e39c5ab`](https://github.com/mykcs/basemodel/commit/e39c5ab) | COPY CHANGE | fix(research): simplify mobile goal-boundary copy |
| 2026-08-24 | [`9ae9a45`](https://github.com/mykcs/basemodel/commit/9ae9a45) | COPY CHANGE | Research: finalize first-reader WebShop explainer (#215) |
| 2026-08-24 | [`3a8f3e4`](https://github.com/mykcs/basemodel/commit/3a8f3e4) | COPY CHANGE | feat(research): finalize first-reader WebShop explainer |
| 2026-08-24 | [`22a68af`](https://github.com/mykcs/basemodel/commit/22a68af) | COPY CHANGE | refactor(research): drop redundant WEBSHOP eyebrow above IRX title |
| 2026-08-23 | [`0b16bc0`](https://github.com/mykcs/basemodel/commit/0b16bc0) | COPY CHANGE | refactor(research): clarify SEED and OpenEvo method figures |
| 2026-08-23 | [`9ca6df1`](https://github.com/mykcs/basemodel/commit/9ca6df1) | COPY CHANGE | fix(research): dock explainer controls from page load |
| 2026-08-23 | [`9c6b7d7`](https://github.com/mykcs/basemodel/commit/9c6b7d7) | SUPPORT | test(ui): distinguish prose from diagram micro-labels |
| 2026-08-23 | [`30b3f4e`](https://github.com/mykcs/basemodel/commit/30b3f4e) | COPY CHANGE | fix(ui): give SEED desktop explainer nodes readable width |
| 2026-08-23 | [`61646cf`](https://github.com/mykcs/basemodel/commit/61646cf) | COPY CHANGE | fix(results): stop REFERENCE heading collapsing into a CJK rail (#206) |
| 2026-08-23 | [`74618cc`](https://github.com/mykcs/basemodel/commit/74618cc) | COPY CHANGE | fix(research): contain Chinese explainer prose per line (#204) |
| 2026-08-23 | [`efa3f14`](https://github.com/mykcs/basemodel/commit/efa3f14) | COPY CHANGE | fix(research): keep one stage navigator in WebShop explainer (#205) |
| 2026-08-23 | [`14e974f`](https://github.com/mykcs/basemodel/commit/14e974f) | COPY CHANGE | fix(research): float controls for active step explainers (#203) |
| 2026-08-22 | [`228eeec`](https://github.com/mykcs/basemodel/commit/228eeec) | SUPPORT | ci: retrigger production deployment for research explainer dedupe |
| 2026-08-22 | [`f194211`](https://github.com/mykcs/basemodel/commit/f194211) | COPY CHANGE | fix(research): de-duplicate canonical explainers |
| 2026-08-21 | [`e941339`](https://github.com/mykcs/basemodel/commit/e941339) | COPY CHANGE | docs(agents): scope editorial contract to English research routes |
| 2026-08-21 | [`45ecf1b`](https://github.com/mykcs/basemodel/commit/45ecf1b) | COPY CHANGE | docs(agents): scope research editorial contract to routes |
| 2026-08-21 | [`ce86f94`](https://github.com/mykcs/basemodel/commit/ce86f94) | COPY CHANGE | docs(agents): scope research editorial contract to components |
| 2026-08-21 | [`62ce244`](https://github.com/mykcs/basemodel/commit/62ce244) | COPY CHANGE | docs(agents): codify natural research editorial style |
| 2026-08-21 | [`4290681`](https://github.com/mykcs/basemodel/commit/4290681) | SUPPORT | Merge pull request #177 from mykcs/agent/ui-openevo-reader-report-20260821 |
| 2026-08-21 | [`8397815`](https://github.com/mykcs/basemodel/commit/8397815) | COPY CHANGE | docs(agents): codify reader-first research result writing |
| 2026-08-21 | [`314ef6c`](https://github.com/mykcs/basemodel/commit/314ef6c) | COPY CHANGE | feat(results): publish reader-first OpenEvo research report |
| 2026-08-21 | [`4493ab6`](https://github.com/mykcs/basemodel/commit/4493ab6) | SUPPORT | test(results): respect localized T2 boundary copy |
| 2026-08-20 | [`f4d2dc4`](https://github.com/mykcs/basemodel/commit/f4d2dc4) | COPY CHANGE | feat(research): refocus OpenEvo results on scientific conclusions |
| 2026-08-20 | [`a561a43`](https://github.com/mykcs/basemodel/commit/a561a43) | COPY CHANGE | fix(research): close explainer interaction and privacy gaps (#162) |
| 2026-08-20 | [`d9cc432`](https://github.com/mykcs/basemodel/commit/d9cc432) | COPY CHANGE | fix(research): close explainer interaction and privacy gaps |
| 2026-08-18 | [`f2af78c`](https://github.com/mykcs/basemodel/commit/f2af78c) | SUPPORT | Merge pull request #156 from mykcs/agent/explainer-te-style-20260818 |
| 2026-08-18 | [`7bab50e`](https://github.com/mykcs/basemodel/commit/7bab50e) | SUPPORT | Merge remote-tracking branch 'origin/main' into agent/explainer-te-style-20260818 |
| 2026-08-18 | [`727c4ef`](https://github.com/mykcs/basemodel/commit/727c4ef) | COPY CHANGE | feat(research): make explainer maps and page copy precise [BATCH MODE] |
| 2026-08-16 | [`5793703`](https://github.com/mykcs/basemodel/commit/5793703) | COPY CHANGE | fix(lab): remove remaining server identity label |
| 2026-08-15 | [`2689195`](https://github.com/mykcs/basemodel/commit/2689195) | COPY CHANGE | fix(ui): remove duplicate outline label overflow |
| 2026-08-15 | [`0203df6`](https://github.com/mykcs/basemodel/commit/0203df6) | COPY CHANGE | feat(research): add interactive research explainer layer (#146) |
| 2026-08-15 | [`97038bf`](https://github.com/mykcs/basemodel/commit/97038bf) | COPY CHANGE | fix(research): route connectors around explainer nodes |
| 2026-08-15 | [`846ba30`](https://github.com/mykcs/basemodel/commit/846ba30) | SUPPORT | test(research): align gates with interactive explainer architecture |
| 2026-08-15 | [`d899ba8`](https://github.com/mykcs/basemodel/commit/d899ba8) | COPY CHANGE | refactor(research): rebuild explainer geometry and visual hierarchy |
| 2026-08-15 | [`176b2c5`](https://github.com/mykcs/basemodel/commit/176b2c5) | COPY CHANGE | feat(research): add interactive explainer layer |
| 2026-08-14 | [`17713e1`](https://github.com/mykcs/basemodel/commit/17713e1) | SUPPORT | test(hardening): align home contract with editorial hierarchy |
| 2026-08-14 | [`4ccf35a`](https://github.com/mykcs/basemodel/commit/4ccf35a) | COPY CHANGE | fix(editorial): finish route and shared-heading audit |
| 2026-08-14 | [`9f07cd4`](https://github.com/mykcs/basemodel/commit/9f07cd4) | SUPPORT | test(copy): align gates with editorial hierarchy |
| 2026-08-14 | [`e38a342`](https://github.com/mykcs/basemodel/commit/e38a342) | COPY CHANGE | fix(editorial): normalize headings and current OpenEvo status |
| 2026-08-12 | [`0528cae`](https://github.com/mykcs/basemodel/commit/0528cae) | SUPPORT | test(copy): align paper-summary regression with human-readable copy |
| 2026-08-12 | [`c9ee929`](https://github.com/mykcs/basemodel/commit/c9ee929) | COPY CHANGE | refactor(copy): remove remaining abstract labels from high-traffic pages |
| 2026-08-12 | [`1239ece`](https://github.com/mykcs/basemodel/commit/1239ece) | COPY CHANGE | [CF-Pages-Skip] feat(research): integrate human copy, mobile UI, outline, and seed3090 audit |
| 2026-08-12 | [`d6be29d`](https://github.com/mykcs/basemodel/commit/d6be29d) | COPY CHANGE | [CF-Pages-Skip] fix(openevo): remove mistaken OpenSeed explainer |
| 2026-08-12 | [`2d1e20f`](https://github.com/mykcs/basemodel/commit/2d1e20f) | COPY CHANGE | refactor(copy): make site entries concrete and actionable [BATCH MODE] |
| 2026-08-12 | [`3b72f17`](https://github.com/mykcs/basemodel/commit/3b72f17) | COPY CHANGE | [CF-Pages-Skip] feat(research): explain SEED and OpenEvo as semantic dialogues |
| 2026-08-12 | [`593e4e7`](https://github.com/mykcs/basemodel/commit/593e4e7) | SUPPORT | test(research): align journey contract with rendered copy |
| 2026-08-12 | [`de677bd`](https://github.com/mykcs/basemodel/commit/de677bd) | COPY CHANGE | feat(copy): complete audience-centered site audit [BATCH MODE] |
| 2026-08-12 | [`6a321b5`](https://github.com/mykcs/basemodel/commit/6a321b5) | COPY CHANGE | [CF-Pages-Skip] fix(test): assert the recorded integration wording |
| 2026-08-12 | [`d293f6a`](https://github.com/mykcs/basemodel/commit/d293f6a) | COPY CHANGE | docs: record sitewide audience-copy audit baseline |
| 2026-08-12 | [`879ddd6`](https://github.com/mykcs/basemodel/commit/879ddd6) | COPY CHANGE | Make human-thinking web expression a durable Agent invariant |
| 2026-08-12 | [`cda340f`](https://github.com/mykcs/basemodel/commit/cda340f) | COPY CHANGE | docs: define audience-centered technical copy standard |
| 2026-08-12 | [`488e752`](https://github.com/mykcs/basemodel/commit/488e752) | COPY CHANGE | refactor: rewrite OpenEvo guide for first-time readers |
| 2026-08-12 | [`a4735ba`](https://github.com/mykcs/basemodel/commit/a4735ba) | COPY CHANGE | fix: remove reproduction C label from OpenEvo entry |
| 2026-08-12 | [`db57632`](https://github.com/mykcs/basemodel/commit/db57632) | COPY CHANGE | Clarify GDKVM-style reproduction guide ownership |
| 2026-08-11 | [`6fefd7f`](https://github.com/mykcs/basemodel/commit/6fefd7f) | COPY CHANGE | [CF-Pages-Skip] refactor(models): unify copy actions on latest guide head |
| 2026-08-11 | [`b1bd079`](https://github.com/mykcs/basemodel/commit/b1bd079) | COPY CHANGE | [CF-Pages-Skip] feat(ux): restore shared CopyButton |
| 2026-08-10 | [`f768ee2`](https://github.com/mykcs/basemodel/commit/f768ee2) | COPY CHANGE | fix(ui): visual polish — dedupe labels, style concept map, fix squeezes (#76) |
| 2026-08-08 | [`5ff4d34`](https://github.com/mykcs/basemodel/commit/5ff4d34) | COPY CHANGE | feat(seo+a11y): fix sitemap routes, og image, heading order, links, i18n |
| 2026-08-06 | [`4ef65ca`](https://github.com/mykcs/basemodel/commit/4ef65ca) | COPY CHANGE | fix(e2e): 首页断言改用真实 V2 标题文案 (#7) |
| 2026-08-06 | [`ddc2b42`](https://github.com/mykcs/basemodel/commit/ddc2b42) | COPY CHANGE | fix(i18n): remove redundant English from Chinese pages |
| 2026-08-06 | [`b6c88ce`](https://github.com/mykcs/basemodel/commit/b6c88ce) | COPY CHANGE | fix(i18n): remove redundant section labels |
| 2026-08-06 | [`5c90628`](https://github.com/mykcs/basemodel/commit/5c90628) | COPY CHANGE | fix(i18n): translate generic license status labels |
| 2026-08-06 | [`c345f72`](https://github.com/mykcs/basemodel/commit/c345f72) | COPY CHANGE | fix(i18n): sanitize comparison license props |
| 2026-08-06 | [`57941ae`](https://github.com/mykcs/basemodel/commit/57941ae) | COPY CHANGE | fix(i18n): localize unresolved license placeholders |
| 2026-08-05 | [`ac3615c`](https://github.com/mykcs/basemodel/commit/ac3615c) | COPY CHANGE | fix(i18n): suppress provider names embedded in model titles |
| 2026-08-05 | [`2254b4e`](https://github.com/mykcs/basemodel/commit/2254b4e) | COPY CHANGE | fix(i18n): hide provider labels repeated in model titles |
| 2026-08-05 | [`f4d399f`](https://github.com/mykcs/basemodel/commit/f4d399f) | COPY CHANGE | fix(i18n): deduplicate model detail identities and paper notes |
| 2026-08-05 | [`667b5dd`](https://github.com/mykcs/basemodel/commit/667b5dd) | COPY CHANGE | fix(i18n): localize dynamic enum labels |
| 2026-08-05 | [`2365f12`](https://github.com/mykcs/basemodel/commit/2365f12) | COPY CHANGE | refactor(i18n): remove redundant evidence labels [BATCH MODE] (done) |
| 2026-08-05 | [`5163155`](https://github.com/mykcs/basemodel/commit/5163155) | COPY CHANGE | feat(i18n): 全站中英切换 — zh 留根 + en /en/ 前缀 + 字典驱动文案 |


## 11A. 2026-09-07 真人反馈：训练设计页的位置、设计语言、字体与动效

### CASE-072 — 页面归属按读者理解路径决定，不按实现模块决定
**PREFERENCE · 2026-09-07 · direct human feedback**
前：`训练设计` 作为 OpenEVO Harness / WebShop study 下的独立页面，与流程理解图重复解释 SEED、OpenEvo、WebShop、Stage 1 和责任边界。
后：把训练设计的必要内容拆进 `流程理解图` 总览；原独立 URL 只保留兼容跳转，不再维护第二份正文。
规律：**如果一个页面的主要作用是帮助读者理解系统怎样运作，它应该进入理解流程；不要因为代码可以拆成一个 route，就给读者制造一个新的信息架构层。**

### CASE-073 — 标题上方的小字必须新增信息，否则删除
**PREFERENCE · 2026-09-07 · direct human feedback**
反面：`SEED × OPENEVO · WEBSHOP` → `WebShop 训练设计实验室`；`先分清谁负责什么` → `责任边界`；`范围` → `研究对象`。
后：直接使用唯一主题标题 `训练设计`、`责任边界`、`研究对象`。
规律：**eyebrow / kicker / small label 不是默认装饰位。只有在它提供标题没有提供的分类、状态或证据边界时才保留。**

### CASE-074 — 动效的验收标准是理解收益，不是“页面用了 HTML 动画”
**PREFERENCE · 2026-09-07 · direct human feedback**
前：责任边界流程图用暖色小点从左向右循环移动；静态箭头已经完整表达方向，移动点没有新增机制、状态或交互信息。
后：删除循环移动点，保留静态责任链；需要展开时使用原生 `<details>/<summary>` 做按需披露。
规律：**HTML/CSS 交互必须降低认知负担、缩短定位时间或揭示状态变化。纯装饰 motion 即使“很轻”也应删除；native disclosure 只有在隐藏次要细节能让主线更清楚时才使用。**

### CASE-075 — 页内跳转不能另起一套“局部导航产品”
**PREFERENCE · 2026-09-07 · direct human feedback**
前：`责任边界 / 实验路线 / 参数协议` 被做成训练设计页自己的 chapter / tab 式选择器；它虽然能跳转，却与研究站点已有导航、section 和 disclosure 语法不同。
后：训练设计成为流程理解图中的普通 section；跨区定位复用共享研究导航，次级内容复用共享 `<details>/<summary>` disclosure，不再维护一套局部 tab / chapter-nav。
规律：**锚点跳转首先是导航，不是新的控件品类。父页面已有导航、section 和 disclosure 语言时，子内容必须继承；只有真正切换互斥视图或应用状态时才使用 tab。**

### CASE-076 — 字体按语义角色统一，不按局部页面“做风格”
**PREFERENCE · 2026-09-07 · direct human feedback**
前：独立训练设计页把 serif 用在自己的 hero / section 标题，又把 monospace 用在普通导航和说明标签上，形成只属于这一页的字体层级。
后：训练设计继承流程理解图的 interface typography；mono 只保留给序号、参数键、路径、SHA、命令等技术标识，并统一引用共享 `--font-*` token，不在局部组件写原始 font stack。
规律：**字体是语义，不是局部装饰。正文、导航和普通控件默认继承共享 interface 字体；editorial 字体只用于全站已经定义的重大编辑标题角色；mono 只用于机器标识和代码型信息。任何新字体角色必须先进入共享设计系统。**

### CASE-077 — 共享组件里的装饰层会把一个错误复制到整组页面
**PREFERENCE · 2026-09-07 · derived from direct human feedback**
前：共享详情组件统一在 H1 上方生成 `实验模型 / 方法 / 实验环境 / 比较 / 研究结果` 等 eyebrow。单看每页都只是“一行小字”，但一次组件决定让模型、SEED、OpenEvo、WebShop、ALFWorld 和更新机制页面同时出现相同的认知噪声。
后：在共享组件源头删除这一层，让 H1 直接承担主题；导航已经负责告诉读者自己位于哪一类页面。
规律：**真人反馈命中共享组件时，不能只修当前 route。先找生成这个模式的共同源头，再审计全部消费者；否则同一个错误会以“另一页的问题”反复回来。**

### CASE-078 — 不要用英文或双语小标签把已经说清的标题再说一遍
**PREFERENCE · 2026-09-07 · derived from direct human feedback**
反面：`研究结果 · RESEARCH FINDINGS` → `OpenEvo × WebShop 研究结果`；`七个问题 · SEVEN QUESTIONS` → `我们现在能回答的七个问题`；`OPENEVO × WEBSHOP · GDR → DIRECTAPPLY` → `为什么 44 次学习尝试，最后只让 7 次进入模型？`。
后：删除前一层装饰标签，保留真正描述内容的 H1/H2。
规律：**英文、全大写、暖色或 monospace 不会自动产生新的信息层级。中文页面尤其不能靠“中文 + 英文再说一次”制造视觉层次；如果第二行标题已经自解释，上一行应删除。**

### CASE-079 — 序号可以保留，序号后面的主持人标签仍要审查
**PREFERENCE · 2026-09-07 · derived from direct human feedback**
前：benchmark 说明页用 `01 · 已经知道什么`、`02 · 缺少什么`、`04 · 评分` 放在已经完整表达内容的 H2 上方。
后：保留 `01 / 02 / 04` 作为阅读顺序提示，删除 `已经知道什么 / 缺少什么 / 评分` 这层重复分类。
规律：**不要把“有一部分信息有用”误判成整行都必须留下。序号、时间、版本、状态可以是元数据；紧随其后的泛化分类词仍要通过新增信息测试。**

## 12. 使用案例库时的优先级

1. 当前用户明确指出某种写法不自然时，以该反馈为最高权重。
2. 同类场景优先采用更晚的 PREFERENCE 判例；例如普通主题标题优先参考 CASE-041–047，而不是把 2026-08-12 的动作标题规则机械放大；Results 的公开深度再参考 CASE-048–049。
3. PREFERENCE 判例优先于 EVOLUTION / SUPPORT 台账。
4. 科学事实、证据边界和安全要求永远不会因为口吻偏好而被覆盖。
5. 没有相似案例时，回到主规范的默认顺序：对象/事实 → 结论 → 机制 → 证据。

## 13. PR 级审计索引

下面列出本轮实际展开 PR body / diff 的主要已合并 review units。它补充上面的 commit 台账：PR 可以说明“为什么改”，commit 更适合定位“具体改了什么”。

| PR | 证据角色 | 与文案偏好的关系 |
|---|---|---|
| [#7](https://github.com/mykcs/basemodel/pull/7) | EVOLUTION | 首页测试必须跟真实公开标题走，不能让测试反过来固定旧文案 |
| [#74](https://github.com/mykcs/basemodel/pull/74) | EVOLUTION | beginner learning flow 与视觉层级开始成为显式设计目标 |
| [#76](https://github.com/mykcs/basemodel/pull/76) | PREFERENCE | 去重复 label / CTA，语义层级不靠重复文字制造 |
| [#78](https://github.com/mykcs/basemodel/pull/78) | EVOLUTION | 先补 Agent 基础上下文，再进入模型选择 |
| [#85](https://github.com/mykcs/basemodel/pull/85) | EVOLUTION | 用一条可理解的 SEED reproduction 主线替代散点入口 |
| [#104](https://github.com/mykcs/basemodel/pull/104) | EVOLUTION | 从 Agent 基础概念桥接到一个具体复现实验 |
| [#115](https://github.com/mykcs/basemodel/pull/115) | EVOLUTION | beginner guide 必须可执行，而不是只讲概念 |
| [#119](https://github.com/mykcs/basemodel/pull/119) | EVOLUTION | lab runbook 强调真实步骤和 PASS 结果 |
| [#121](https://github.com/mykcs/basemodel/pull/121) | EVOLUTION | 复杂流程开始用视觉结构而不是长 prose 承担 |
| [#136](https://github.com/mykcs/basemodel/pull/136) | PREFERENCE | 首次全站 human-readable copy audit；concrete action/object 优先于抽象包装 |
| [#138](https://github.com/mykcs/basemodel/pull/138) | EVOLUTION | first-time reader 需要模型选择理由和上下文 |
| [#156](https://github.com/mykcs/basemodel/pull/156) | PREFERENCE | explainer map 与正文必须精确对应真实机制 |
| [#160](https://github.com/mykcs/basemodel/pull/160) | EVOLUTION | program report 建立研究报告式信息层级 |
| [#161](https://github.com/mykcs/basemodel/pull/161) | EVOLUTION | 结果页向 paper-like 叙事演进 |
| [#163](https://github.com/mykcs/basemodel/pull/163) | EVOLUTION | 进一步压低 dashboard 感、提高论文式连续阅读 |
| [#177](https://github.com/mykcs/basemodel/pull/177) | PREFERENCE | reader-first Results：科学问题和结论先于内部实验账本 |
| [#179](https://github.com/mykcs/basemodel/pull/179) | PREFERENCE | 删除“这篇文章不是/下面我们会/只记一句话”等 meta-narration |
| [#183](https://github.com/mykcs/basemodel/pull/183) | PREFERENCE | 长背景拆成短、各自有明确对象的研究说明 |
| [#215](https://github.com/mykcs/basemodel/pull/215) | PREFERENCE | WebShop first-reader explainer：先懂任务，再懂 split / wrapper / score |
| [#217](https://github.com/mykcs/basemodel/pull/217) | PREFERENCE | 中英文 benchmark label 与代码字符串边界分开 |
| [#218](https://github.com/mykcs/basemodel/pull/218) | PREFERENCE | 删除“本页职责/视觉排序/让当前页承担……”等编辑者口吻 |
| [#219](https://github.com/mykcs/basemodel/pull/219) | PREFERENCE | “已并入当前研究路径”整段删除：内容迁移不是读者关心的事 |
| [#224](https://github.com/mykcs/basemodel/pull/224) | PREFERENCE | 二次清理 `本站 / 本节 / 这里 / 站内 / 这一节` |
| [#225](https://github.com/mykcs/basemodel/pull/225) | EVOLUTION | 统一 `研究结果 / Research findings`，稳定命名比局部新词重要 |
| [#230](https://github.com/mykcs/basemodel/pull/230) | PREFERENCE | 恢复丢失的“不”，把 copy polarity 当科学正确性保护 |
| [#231](https://github.com/mykcs/basemodel/pull/231) | PREFERENCE | negative wording 不是禁词；audit 不能误伤 `X 不是 Y，而是 Z` |
| [#241](https://github.com/mykcs/basemodel/pull/241) | EVOLUTION | Results 向统一 publication-grade 页面收敛 |
| [#244](https://github.com/mykcs/basemodel/pull/244) | PREFERENCE | SEED/OpenEvo evidence boundary 必须在自然文案里保持精确 |
| [#245](https://github.com/mykcs/basemodel/pull/245) | PREFERENCE | 第一屏先给“知道什么/最新结果/还缺什么”，证据细节后置 |
| [#247](https://github.com/mykcs/basemodel/pull/247) | PREFERENCE | 每个结论显示观察→支持→不能证明的推理桥 |
| [#254](https://github.com/mykcs/basemodel/pull/254) | PREFERENCE | 中文优先 L1→L2→L3；英文术语保留但不抢第一理解层 |
| [#259](https://github.com/mykcs/basemodel/pull/259) | EVOLUTION | action-wrapper 责任链开始显式化 |
| [#261](https://github.com/mykcs/basemodel/pull/261) | EVOLUTION | 技术归因并入 Results 证据，不另起平行叙事 |
| [#270](https://github.com/mykcs/basemodel/pull/270) | EVOLUTION | 公平比较增加低上下文解释层 |
| [#274](https://github.com/mykcs/basemodel/pull/274) | PREFERENCE | wrapper 事故先解释 command vs outer label，再说 parser jargon |
| [#278](https://github.com/mykcs/basemodel/pull/278) | PREFERENCE | 事故标题先说发生了什么，不用 forensic trace 当主标题 |
| [#280](https://github.com/mykcs/basemodel/pull/280) | PREFERENCE | 责任归因前先补最小实验设置 |
| [#285](https://github.com/mykcs/basemodel/pull/285) | PREFERENCE | 事实先于读法，结论先于解释，视觉权重服从语义权重 |
| [#287](https://github.com/mykcs/basemodel/pull/287) | PREFERENCE | `0 个训练步` 演进为 `一步都没训练` 的自然状态表达 |
| [#290](https://github.com/mykcs/basemodel/pull/290) | PREFERENCE | `frozen` 等歧义术语改成字面机制 + 精确 checkpoint 身份 |
| [#296](https://github.com/mykcs/basemodel/pull/296) | EVOLUTION | 缺失训练阶段需要补真实流程，不靠结果页暗示 |
| [#309](https://github.com/mykcs/basemodel/pull/309) | PREFERENCE | 责任 topology 要明确负责层、触发层和测量边界 |
| [#314](https://github.com/mykcs/basemodel/pull/314) | PREFERENCE | 全站 facts → reader-first copy → visual language 三遍审计 |
| [#326](https://github.com/mykcs/basemodel/pull/326) | PREFERENCE | Pending 与预先固定的比较槽位不能伪装成已有结果 |
| [#328](https://github.com/mykcs/basemodel/pull/328) | EVOLUTION | checkpoint 结果填入时保持 loss 与 capability 非单调事实 |
| [#331](https://github.com/mykcs/basemodel/pull/331) | PREFERENCE | `preregistration` 收窄为证据支持的 `pre-specification` |
| [#332](https://github.com/mykcs/basemodel/pull/332) | EVOLUTION | 模型选择与 checkpoint 行为用真实数据图表达 |
| [#333](https://github.com/mykcs/basemodel/pull/333) | PREFERENCE | 系列名称统一，避免同一实验被多套临时标签描述 |
| [#334](https://github.com/mykcs/basemodel/pull/334) | EVOLUTION | lyg2171 初版建立硬件/存储/隐私事实层 |
| [#336](https://github.com/mykcs/basemodel/pull/336) | PREFERENCE | `服务器简介 / GPU 规格 / 数据来源` 取代主持人式标题 |
| [#338](https://github.com/mykcs/basemodel/pull/338) | EVOLUTION | 固化 capability-exploration 的 publication/visualization 经验，不改变公开实验事实 |
| [#339](https://github.com/mykcs/basemodel/pull/339) | EVOLUTION | 固化 MiniMax teacher 审计与证据/成本表达经验 |
| [#341](https://github.com/mykcs/basemodel/pull/341) | PREFERENCE | 将 Stage 2 的计数、门槛与 0 update 改成 first-reader 可追踪的因果链；该表达已进入 `main` |
| [#342](https://github.com/mykcs/basemodel/pull/342) | PREFERENCE | 结果页主线保留科学问题/结果/解释/边界；commands/configs/logs 进入可选复现深度 |
| [#344](https://github.com/mykcs/basemodel/pull/344) | PREFERENCE | “不要 cat”的警告不能被 UI 增强成“复制 cat”动作 |
| [#349](https://github.com/mykcs/basemodel/pull/349) | PREFERENCE | 公开复现路径去掉真实 Unix 账号/home 身份，使用 `$HOME/...` 通用表达 |
| [#350](https://github.com/mykcs/basemodel/pull/350) | EVOLUTION | 大规模站点优化同时删除/收敛一批旧公开 copy owner；只把经过独立反馈支持的变化提升为偏好 |
| [#604](https://github.com/mykcs/basemodel/pull/604) | PREFERENCE | 两阶段方法背景、机制说人话、统一训练图表、诊断动机与手机整张 16:9 transform scale 的 concrete accepted successor；视觉仍是 Silver，不是 Golden |

## 14. PR 状态与自证边界

全量 PR 检索也会命中尚未合并的公开文案工作。它们可以帮助发现问题，但在 owner 尚未接受、`main` 尚未采用前，不进入 PREFERENCE 判例。

另一个边界是**交付这套规范的 PR 不能反过来证明规范本身正确**：

- [#345](https://github.com/mykcs/basemodel/pull/345) 已于 2026-08-30 合并；它负责交付本规范与案例库，但不作为“本规范正确”的历史偏好证据。

以后新增 OPEN / DRAFT PR 也按同一规则处理：可以进入审计备注，但不能仅凭“有人开了 PR”反推成用户偏好；规范自身的交付 PR 也不参与自证。


<a id="case-081-先说发生了什么再补必要边界"></a>
### CASE-081 — 先说发生了什么，再补必要边界
**PREFERENCE · 2026-09-08 · direct human feedback on the advisor progress briefing**
反面：`质量不是“页面做得漂亮”或“GPU 跑得满”。`；同页还有 `最核心的问题不是……`、`下一步不是简单“继续跑”……`、`现在不能说……`。这些句子虽然想守住边界，但讲话姿态先在反驳一个读者尚未提出的误解。

后：`我们把实验质量拆成四层：科学设计、工程门禁、证据身份和对外表达。每一层都有可追溯的证据，也都有明确的停止条件。`；研究问题直接说 `我们真正要回答的是……`；下一步直接给三层顺序；主比较状态写成 `OpenEVO vs SEED 的同口径最终比较还没完成`。

规律：**人类汇报通常先陈述对象、事实、做法或进展，再在会改变科学解释的位置补限制。不要为了显得严谨，一开口就用“不是 / 不能 / 不要”抢占注意力；那会产生防御性、AI 式的主持人口吻。科学 caveat 仍必须保留，但应该贴着它所约束的 claim，而不是提前否定一个没人提出的主张。**

**2026-09-09 repeated evidence**：在 HPL 已经记录这条规则以后，PR #605 的一版 Slide 3 仍写成 `我们不是只跑一次实验，而是一步步换问题去验证`。owner 直接指出：`Slide 的第3页还是犯了“不是……而是……”这样的错误。再照着这个标准看一看，然后改。` 后继版本把这一标题改成直接主题 `我们做过哪些尝试`。

这次重复纠正把 `defensive-negation-opening / anticipatory-rebuttal` 升级为 **hard**：future Agent 在交给 owner 前必须主动扫描标题、lede 和大号 callout 是否先制造了读者没有提出的二元反驳。**这里仍然不是禁用“不是 / 而是”**；科学澄清、责任边界和真正的排除结论可以正常使用否定句，前提是读者已经知道被否定的对象和 claim。PR #605 后继 head 后来又因别的 hard failure 被整体判为 Rejected，因此这里只学习这一维的文案方向，不把整版视觉升级为 Silver / Golden。


<a id="case-082-科研阶段汇报要展示研究判断"></a>
### CASE-082 — 科研阶段汇报要展示研究判断，不是项目状态流水账
**PREFERENCE · 2026-09-08 · direct human feedback on the advisor progress briefing**
反面：阶段汇报虽然罗列了 `实验系统 / 质量体系 / 推进节奏 / 当前阻塞`，也保留了不少正确数字，但主线仍像项目管理状态页。它漏掉已经发生的最新科学结果（例如 fixed-GPU determinism PASS 与 1.7B Ceiling final），也没有回答“为什么做下一轮”“哪一个异常改变了研究问题”“实验设计的亮点在哪里”。

后：用 `能力上限 → 参数机制 → 因果控制` 组织整套汇报。先给 7B / 1.7B 的最终实验结果，再明确说明“44 个参数更新候选里只有 7 个真正进入后续模型”如何把问题推进到 GDR 筛选机制；参数方向实验算出零向量时，先修复可识别性；Q17 在比较规则生效前就出现权重漂移时，先恢复可归因性。随后再进入参数方向移植、主要参数主题删除、GDR / DirectApply 双组对照和 SEED-style Stage2 对照线。

规律：**科研阶段汇报的主叙事应是“问题 → 假设 → 实验 → 结果 → 结果如何改变下一步”，而不是工程模块、时间线或状态清单。亮点来自可证伪设计、变量隔离、因果干预以及对异常/失败的正确解释；不是来自装饰，也不是来自“做了很多工作”。工程 gate 只有在它决定测量是否有效、变量是否可识别或因果归因是否成立时，才值得进入主叙事。**

**2026-09-08 交付介质补充**：视觉探索可以用静态 mockup 帮助确认方向，但最终交付介质固定为 **HTML 页面**，不是 PPT / Keynote / 图片式 slide。视觉参考只能转译成原生 HTML + CSS；标题、数字、表格、证据链接和正文必须保持真实 DOM，可复制、可搜索、可访问、可响应式阅读。**“像汇报”描述的是信息节奏，不是文件格式。**

**2026-09-08 再次纠正**：`第一道门：先证明测量是真的` 单独占一页，观众得到的主要印象只是“修好了接口 / parser”，科研含量并没有因此变强。处理原则进一步收紧：如果一段工程工作只能说明“系统终于按预期工作”，它应压缩成证据备注或直接略过；只有当它改变了可解释性、可识别性、因果归因或实验假设时，才升级为科研主线。该页因此删除，保留的科学内容改为“同一批任务上 Task Score 上升而完整成功不变，因此把两个评价信号拆开”。

**2026-09-08 演讲稿形态补充**：`HTML` 只是交付介质，不意味着一定要做响应式长网页。如果用户明确把页面当作 slides / PPT 来演讲，应固定标准 **16:9** 画布，允许页面内部滚动容器承载固定尺寸，而不要为了适配手机破坏演讲构图。封面与尾页不显示页码；中间页在右下角显示“当前页 / 总页数”；不放“下一页”按钮。封面先给标题、日期、汇报人等基本信息；第二页用“目录 + Too long, Don't read”让第一次听的人知道整场要讲什么。结果页优先模拟论文常见的 booktabs / LaTeX 表格，让 `Score / Succ.` 等指标第一次出现就有对象和定义。最后一页若请求导师做决策，必须把两条路线分别回答什么问题、各自适合什么目标写清楚，而不是只问一个抽象的“选哪个”。同时，像“固定 GPU 确定性已经 PASS”这种内部工程表述，应改写成人能直接理解的科学含义，例如“现在终于可以公平比较 GDR 和直接应用更新了”。

**2026-09-08 专业深度与视觉噪声补充**：减少注意力负担不等于把科研内容做浅。纯装饰的淡色大圆 / 气泡会抢占视觉注意力，却不承担信息角色，应删除；有功能的步骤编号、页码等圆形元素不在此列。相反，当 TaskVector、Gram 范数、干预系数、同范数随机对照正是研究设计本身时，应允许一页更硬核：直接给公式、真实参数、对照规模和进入下一阶段的定量阈值。**应该删的是无信息装饰和黑话，不是能够证明研究思路与质量的数学细节。**

**2026-09-09 科研故事与渐进披露补充**：主演讲默认假设实验在工程上是成立的。`SHA / hash / fixed-GPU repeatability / resume / container identity` 这类证据必须做好，但如果它们只证明“实验没有工程问题”，就不应该单独占一页当作科研亮点；应下沉到技术子页、折叠详情或按需证据层。主叙事更适合沿真实科学推进组织：`7B 基线 → 1.7B / 3B 诊断 → 15→30 的负向 horizon 实验 → 2048→4096 的容量负向实验 → 有边界 10+10 successor → TaskVector → GDR 44→7 → DirectApply`。这里真正展示能力的是：**看到异常以后提出一个可证伪解释，用小实验排除它，再据此缩窄下一问。**

同样，技术深度需要渐进披露。主演讲可以保留 `τ = ΔW_R49 − ΔW_R27`、`‖τ‖F≈0.608`、GDR 的简单状态更新公式和关键数值；完整 Gram/Frobenius 推导、OpenEVO state/update 映射、实验身份与复现细节放到相邻技术页。**删掉工程审计细节不等于降低严谨性；把严谨性放到正确的信息层，反而让科学判断更清楚。**

**2026-09-09 参数标题与屏幕适配补充（覆盖 2026-09-08“手机也保持固定画布”的旧规则）**：参数数字不应为了“冲击力”抢占标题。像 `2048 → 4096` 这种重要参数，应先用自然语言标题说清发生了什么（例如“我们把记忆容量翻倍了”），再在正文里用加粗数字给出精确值。视觉布局采用分层策略：**桌面端保持标准 16:9 演讲构图，并设置固定上限，不随超宽显示器无限放大；手机端则以可读性为先，按窗口宽度重排内容，不要求维持固定 1280×720 画布。**

**2026-09-09 iPhone 展示方式再次校正（覆盖同日“手机内容重排”的中间规则）**：briefing 仍然是一组 slide，不要为了手机把内部两列、卡片和信息层级重排成长网页；也不要保留 1280px 原宽后要求读者横向拖动。最新规则是：**桌面保持 capped 1280×720；iPhone 保持同一 16:9 构图，把整张 slide 等比缩到当前 viewport 宽度，默认没有横向滚动。** 读者如果想细看，自己使用系统缩放即可。这里改变的是显示比例，不是 slide 内部结构。

**2026-09-09 ingestion closeout 原始 owner 信号（中间态、supersession 与接受边界）**：

- 关于“为什么没承接前面的 slide 视觉方向”的那一轮，只能恢复到邻近 assistant 的复述，找不到可验证的 owner 原句；因此 closeout 仅保留为 page-specific 历史，不用于新增长期规则。随后可验证的 owner 原话 `两者中和一下` 只约束本 briefing：承接 slide 注意力结构，同时保留原生 HTML。
- `还是不像之前你给的 slides，多色彩、柔和、圆形什么的；之前 slides 上的信息也有一点点多。` 说明反例不是“信息多”，而是竞争注意力；过度极简同样会丢失正向视觉信号。
- `这个问题以前在普通网页就说过；无意义英文小标题增加人的认知负担。` 是显式重复纠正；机制不是“英文禁用”，而是作者内部编码抢读者第一注意力。
- `slide 上莫名的淡色气泡不要。` 拒绝无信息装饰，不连带禁止柔和色彩、圆角或有功能的圆形编号。
- `“这里可以更硬核一点”我们自己知道就行……可以换成“我们采用一个更技术性的指标”。` 技术深度由公式、数据和指标自己证明，不需要 meta 自我评价。
- `工程严谨性、SHA 和重复性是实验成立的默认前提，不应该单独占一页当科研亮点。` 默认下沉；只有影响科学有效性、可识别性或因果归因时回到主线。
- `从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10……最后进入 GDR / DirectApply。` 主叙事要让老师看到问题如何被小实验一步步缩窄。
- `目前整体效果比上一版好多了。` 对当时可见的 `1ca186d4…` 只支持 `better / Silver`；同一句继续提出参数标题和手机/桌面修正。后续 owner 明确说 `虽然做的不是100完成，先合并进main`，`89fe1190…` 因此是 concrete `accepted`，但没有“以后按这版”的模板授权，仍不是 `canonical / Golden`。

完整 signal-level coverage 与排除理由由 `src/data/humanFeedbackIngestionCloseouts.ts -> INGESTION-20260909-OPENEVO-BRIEFING` 持有，避免把“better / promising / accepted / canonical”再次压扁成二元喜欢/不喜欢。

**2026-09-09 PR #605 最晚反馈补充**：在 PR #605 最后代码 head `56b5120…` 已经生成之后，owner 明确说：`这轮 hard-failure 不是“建议”，是必须修掉`。其中两条不能被 merge 状态覆盖：

- `TaskVector 页面现在太像数学附录。` 主 deck 只保留 `v = θ_after − θ_before`、参数变化的 **norm**、更新方向的 **cosine** 和一句 faithful 科学判断；完整 Gram matrix、Frobenius geometry、R14/R27/R49、同范数随机对照、identifiability gate 下沉 `technical-notes`。这是对此前“机制页允许更硬核”的**更晚收窄**：技术深度保留，但主演讲只保留当前决策真正需要的最小数学量。
- `不要把“科学尝试”页做成数字清单；应拆成几张 slide。` 这里不是全局禁止 checklist；而是当连续小实验如何排除解释本身就是研究能力证据时，主讲需要让每个关键问题/实验/结论获得足够空间，不能把因果推进压平为四个等权短语。

这两条发生在 `56b5120…` 之后，而 PR #605 没有新的页面 commit 再处理它们。**Git merge 只能证明代码进入 main，不能倒推出 owner 接受了这版视觉/叙事。** 因此 HPL 里该 exact visual 必须记作 Rejected；此前 `670ab9b4…` 的 current-candidate 只保留为历史中间态，没有 Golden。

<a id="case-083-案例库必须进入生成和验收闭环"></a>
### CASE-083 — 案例库必须改变下一次任务的生成与验收
**PREFERENCE · PROCESS · 2026-09-08 · direct owner workflow feedback**

**反面流程**：`写入案例库 → 等未来 Agent 自己想起来`。过去已经反复证明，只把“说人话 / 去 AI 味 / 减少注意力负担”的反馈写成 Markdown，或者把某个被拒绝词加进 audit，并不会让下一次第一次输出自动更接近 owner。案例存在，但 retrieval、跨案例抽象和生成后的偏好验收没有稳定执行，Agent 仍会从自己的默认审美开始。

**认可流程**：`反馈 → Gold Pair → Preference Model → task-time retrieval → blind cold read → preference judge → release`。原始 CASE 继续保存具体语境；被明确接受的 `Rejected → Accepted` 形成偏好对；多个案例再形成带 scope / confidence / supporting cases / anti-overgeneralization 的 Preference Model。新任务开始前主动检索最相关的模型维度和偏好对；生成后先做不看历史答案的 Phase A cold read，再做看历史偏好的 Phase B pairwise comparison。

规律：**案例不是长期记忆的替代品，也不是墓碑。一次真人纠正只有在它改变下一次任务的 pre-write context 和 post-write evaluation 时，才真正产生累积学习。不能把单个页面实现细节升级成全局规则；当前明确指令 > 最新直接反馈 > 多案例偏好模型 > 通用设计原则 > Agent 自己的审美。**

边界：这套系统不声称修改了模型权重，也不把 Agent 自评伪装成人类偏好测量。deterministic audit 保护已知 precedent；独立 Agent / 真人 cold read 检查注意力、自然度和阅读欲望；真正的人类反馈仍是最高价值的新训练样本。

**2026-09-09 closeout 补充**：owner 的原始目标是 `我希望你能把这个库维护好，然后从这个库里学习，然后越来越变得更加聪明一些、更加符合我的要求一些。` 成功标准不是 CASE 数量，而是未来 Agent 第一版更接近、同一 failure family 的重复纠正次数下降。`先把这个工作流应用先落地，然后再应用` 是本次任务的执行顺序，归类为 task fact，不自动泛化成所有未来页面任务都要先修改偏好系统。


<a id="case-084-负向诊断必须闭环到观察排除与下一步"></a>
### CASE-084 — 负向诊断必须闭环到观察、排除与下一步
**PREFERENCE · RESEARCH COPY · 2026-09-09 · repeated direct owner feedback**

原始纠正一：`slide07写得还是有问题，你应该写出来，我们当时实际看了15、30步，都是在固定那几个动作打转，然后30步了还是打转，那我们就知道问题不在这里了，这个类型的细节要说出来。`

原始纠正二：`slide07 你也没说这个问题我们怎么解决的`。

原始纠正三：`“多给 15 步，模型还是在几个导航动作里打转”这一页前面都没说是什么问题，你就直接说为什么要多给 15 步，这个没说清楚；15→30、4096、20→10+10 都应该先说我们当时碰见了什么问题，所以才做这些处理。`

规律：**负向实验不是“一个数字没变”就结束，也不能让干预先于动机出现。主讲页至少要让人看到：先观察到什么问题 → 为什么这个问题让我们怀疑某个解释 → 用什么最小干预检验 → 行为/结果如何变化 → 排除了什么 → 因此停止继续调什么并转向哪个下一问。** 这里 `15→30` 的关键证据不是两个 0，而是先看到 15 步失败轨迹把预算走满仍在 next/back 等动作间打转，才提出“是不是 horizon 太短”；30 步仍复现同类循环后，才能排除“只是步数不够”，固定 horizon 后转查 Text Memory / 参数更新。若这一步只解决了错误诊断，就明确说“解决的是错误诊断”，不要伪装成最终低分已经被治好。

**Severity**：这一 failure family 已在同一 briefing 中被 owner 三次直接纠正，因此 `incomplete-scientific-decision-loop` 升级为 **hard**。未来首次生成和 owner review 前都必须显式检查。

checkpoint/W&B 曲线属于同一个证据思想：连续轨迹可以帮助判断训练是否真正发生、是否有上涨趋势，但 `training loss`、训练过程的任务 Score、以及冻结 final eval 是不同测量层。**loss 降低不能被画成“最终能力正在收敛”的同义词；曲线只能排除它真正支持排除的简单解释。**


<a id="case-085-人审preview与最终验收是两条工作流"></a>
### CASE-085 — 人审 Preview 与最终验收是两条工作流
**PREFERENCE · WORKFLOW · 2026-09-09 · explicit future-default owner instruction**

摩擦：owner 在连续改 slide 时问 `每次build怎么这么久 能不能加快一点`。实测瓶颈不是 Astro 静态 build，而是每次人审修改都错误触发了完整最终浏览器验收，导致一个本应很短的视觉反馈回路被拉长。

随后 owner 明确要求：`把这个规则合并到main或者怎么样 我希望以后都这样改`。

认可流程：`coherent UI/copy/slide 修改 → 本地 static build → 非权威 prebuilt review Preview → owner 继续反馈`；只有候选真正 `merge-ready` 时，才进入 `exact-head Vercel final gate → merge/release`。

规律：**“让我马上看到页面”与“证明这个 commit 可以发布”是两个不同任务。** 快速 Preview 是 canonical 的 BaseModel 人审工作流，但它永远不是 merge evidence；final gate、科学边界和 Production 门槛没有被削弱。这条是 workflow canonical，不是视觉 Golden。

**2026-09-10 补充**：在 No-GDR slide 已经声称改成曲线版以后，Agent 把旧 Preview URL 发给 owner；owner 只回了四个字：`没看到曲线`。这不是“曲线样式不好”，而是 review artifact 与声称的候选不一致。后续正确恢复是：重新构建 → 新建 prebuilt Preview → **实际打开托管后的目标 `#directapply-progress` slide** → 核对 `2 SVG / 3 polyline`、左 Score / 右 loss 确实可见 → 再把这个新 URL 发给 owner。

补充规律：**快 Preview 仍然要验证它真的是这次 Preview。** 发送 review URL 前做最小的 target-specific hosted 可见性检查；不需要因此每次跑 205 项全站 browser final gate。要验证的是“我刚声称改的这个东西，在我发的这个目标页面里确实看得到”。`review-preview-not-visually-verified` 当前只有这一次直接事件，因此维持 normal，不假升级 repeated/hard。


<a id="case-086-紧急恢复页先给行动再给运行手册"></a>
### CASE-086 — 紧急恢复页先给行动，再给运行手册
**PREFERENCE · RECOVERY UI · 2026-09-09 · repeated direct owner feedback from fuhuo `/docs/mac-remote`**

第一次版本把 `MacBook Pro · M2 Max`、`launchd`、watchdog、AC controller、`pmset`、refresh token 和 GitHub rescue 结构都放在恢复入口前部。owner 直接拒绝：`你好像列了很多专有名词，或者是列的很详细，列的很工程化……这会对那个时候很着急的我造成困扰。`

owner 给出的 successor 方向是：`具体的技术细节的话，你可以再往下放一放。就首先我打开这个网页，我前面几行我应该看的都是……我们发生了某种情况，然后现在我们进入到这种情况了，我们该怎么办？就大概就这么简单的一回事。` 此前还明确要求未来可以把自己当作 `完全失忆了`，并设想人在外面、拿不到 MacBook 时仍能从页面找到恢复入口。

规律：**高压恢复页的第一层不是 runbook。先用普通话确认“你现在遇到的是什么情况”，给一个最短且安全的主要动作，再告诉用户接下来会发生什么；实现架构、历史、排障细节和完整命令后置到明确的技术层。** 这复用 CASE-068 的注意力预算与 progressive disclosure，但把它收窄到“着急 + 零上下文 + 需要立即行动”的 recovery scope。

边界：不是所有页面都要变成一个按钮，也不是把工程资料删掉。会改变安全性、授权边界或不可逆动作的警告必须在行动前可见。`复制 prompt / command` 只是这次可能的实现方式；owner 当时明确把二者作为待判断选项，因此不能过拟合成“所有恢复页都必须有复制按钮”。完整 runbook 仍应保留，供 Agent 或需要深查的人恢复系统。

视觉证据：`mykcs/fuhuo_20260419` PR #20 / `f622ecd…` 为明确 Rejected 的 technical-first 状态；PR #22 / `123fb5e…` 实现 action-first、折叠技术 prompt 和单一恢复动作，但 closeout 前没有新的 concrete acceptance / template language，因此只能记为 `current-candidate`，不能升级成 Silver / Golden。


<a id="case-087-机制解释先说谁做了什么"></a>
### CASE-087 — 机制解释先说谁做了什么，再说抽象关系
**PREFERENCE · RESEARCH COPY · 2026-09-09 · direct owner feedback**

owner 直接指出：`“训练出一个更新”和“让这个更新进入后续模型”之间出现了很大的落差。我们正常的人话也不这样说。一般人类会说训练的时候已经可以参数更新了，但是 GDR 设计了就是不让这个更新进入后续模型。重点是这种语序或者是说话的这种感觉。`

反面：`“训练出一个更新”和“让这个更新进入后续模型”之间出现了很大的落差。` 句子没有明确主体，观众需要自己把“训练候选 → GDR 再筛一次 → 下一轮模型是否改变”还原出来。

认可方向：`训练程序有 44 次都把 SD-LoRA 候选训出来了；GDR 又筛了一次，只同意 7 次真的改到下一轮模型，另外 37 次被拒绝。`

规律：**技术对象可以保留，AI 式名词化过程不要保留。只要机制能按“谁 → 做了什么 → 结果怎样”表达，就优先用这个自然句序；不要用抽象关系名词替代动作链。** 这不是把科研写成闲聊：GDR、SD-LoRA、candidate、下一轮状态仍然要准确。

边界：如果“关系”本身就是研究对象（例如两个向量的余弦相似度），抽象关系词当然可以用；不要把这条规则误写成“所有句子都必须口语化”。

<a id="case-088-同类实验图共享一套视觉语法"></a>
### CASE-088 — 同类实验图共享一套视觉语法
**PREFERENCE · RESEARCH VISUAL · 2026-09-09 · direct owner feedback**

owner 要求：`我所有实验如果要出现这种 checkpoint loss、得分的图、SD-LoRA 的图，它们的表格风格、视觉风格和画的风格应当是一样的，只不过某些坐标轴有一些细微的技术性差别。`

反面：7B、1.7B、3B 每页都重新决定 Score 在哪、loss 在哪、candidate/accepted 用什么标记。即使每一张单独都“好看”，观众横向比较时仍要反复学习图例。

认可方向：同类训练页统一把 **WebShop Score 放左侧、SD-LoRA loss 放右侧、candidate / accepted update 用稳定标记**；7B、1.7B、3B 的 y 轴范围、点数和是否缺失 loss 可以按真实数据不同。

规律：**一致的是视觉语义，不是数值范围。** 同一个证据对象跨实验必须复用位置、线型、marker 含义；真实量纲、范围、缺失数据不能为了视觉对称被伪造或抹平。

边界：不同科学对象不必硬套同一个 chart type；没有 authoritative loss 的 rejected candidate 仍然留空，不能为了“统一”补假点。

**2026-09-10 重复证据**：owner 在新 No-GDR / DirectApply 实验加入 briefing 后再次明确：`我新实验也得用在html表现和其他实验一样的分数loss表`。当时新实验页主要是 6 个摘要数字卡片，虽然数字本身正确，却打破了已经在 7B / 1.7B / 3B 建立的横向比较语法。随后 successor 把同一批 authoritative 数据重新画成 **左侧 WebShop Score（原始 round + 12-round moving average）、右侧 SD-LoRA training loss、底部 update / progress 证据条**。

这次重复把 CASE-088 从一次 project-specific 明确偏好升级为 **repeated-explicit**：后续新增同类训练实验，只要真的有同类 per-round Score / loss / update 数据，默认继承现有视觉语义。两个 failure family `inconsistent-experiment-chart-grammar` 与 `cross-experiment-legend-relearning` 都已有两次直接事件，因此升级为 **repeated**，还不到 hard。边界不变：不能为了统一伪造不存在的曲线、缺失 loss 或相同 y 轴。

<a id="case-089-阶段汇报需要最小方法背景"></a>
### CASE-089 — 阶段汇报要自带理解结果所需的最小方法背景
**PREFERENCE · BRIEFING · 2026-09-09 · direct owner feedback**

owner 说明：`虽然我的网站里其他页面画了有关 SEED 是怎么做的，OpenEVO 是怎么做的，我觉得还是有必要向我的观众解释一下 OpenEVO 的两个阶段，比方说轨迹采集、MiniMax 的老式分析，以及 Agent System、Text Memory、SD-LoRA、OPSD 这堆东西；训练是怎么训练的还是要跟大家说一声。`

反面：主演讲直接进入 7B / 1.7B / 3B 结果，默认观众已经读过网站的 flow / method 页面，于是后续 `44 candidates / GDR / Text Memory / Agent System` 都变成内部上下文依赖。

认可方向：结果之前先给一份最小方法心智模型：**Stage 1 由学生模型采集轨迹，任务结束后 MiniMax 做回看分析并准备初始学习载体；Stage 2 由当前模型继续产生自己的 round evidence，SD-LoRA、Text Memory、Skill、Agent System 根据本轮证据更新，最后合成下一轮。** OPSD 等真实对象在第一次出现的位置直接解释。

规律：**“网站别处有说明”不能替代现场汇报的局部自包含。** 只补足听众理解紧接着结果和机制所需的最小背景；深参数、完整训练协议和实现细节仍然留给技术页。

边界：不是每场汇报都强制一页 Stage 1/2；如果听众已经明确共享方法上下文，可以压缩。但不能让一个关键结论依赖现场从未介绍的内部对象。


<a id="case-090-科研标题先说发生了什么"></a>
### CASE-090 — 科研标题先说发生了什么，再给数字缩写和内部标签
**PREFERENCE · RESEARCH COPY · 2026-09-09 · repeated direct owner feedback on OpenEVO briefing PR #605**

原稿一：`为什么后来会去改“15 步”和 Text Memory？因为日志里先暴露了两个很具体的问题`。owner 纠正：真正的研究过程是 **分数很低 → 先看失败轨迹和训练日志 → 发现 15 步仍在 next/back 打转、Text Memory 撞容量 → 再决定做 15→30 和 Text Memory 修复**。所以更自然的标题是 `分数很低，我们先去看日志，看看是不是哪里出了问题`。

原稿二：`7 < 8：不是模型没有成功经验，而是一个控制门槛挡住了长期训练`。owner 再次明确说 `又是这种先给了一个数字，然后后面再做解释，这不是人类说话的习惯`。`7<8` 是排查以后才得到的 shorthand，第一次听的人还不知道两边各自在数什么。更自然的入口是 `训练跑了很久，但参数一次都没有更新`，正文再解释旧 gate 要至少 8 个 qualifying identities、实际最多 7。

同一轮还拒绝了 `7B：训练过程明显学起来，但冻结终评仍是 49.33` 这种“模型名：结论”标签，认可方向是 `我们做了一次 7B 长跑：训练在变好，冻结终评是 49.33`。对 `composed state` 的反馈则进一步明确术语边界：Agent / SD-LoRA / GDR 这类真实技术对象可以保留；只起作者内部连接作用、中文一句就能说清的英文不要让观众额外解码。

规律：**briefing 标题先说一个听众可以直接复述的事件或问题；数字关系、模型标签、method 名和内部英文在对象已经建立以后再出现。科研故事按触发问题 → 观察 → intervention → 结果推进，不从事后方法名倒着解释。**

边界：数字和模型名当然可以出现在标题。比如 `44 个候选只有 7 个进入后续模型` 同时说清两端对象，数字本身就是科研发现。`GDR / SD-LoRA / Agent` 等真实技术对象也应准确保留。需要避免的是读者必须先猜 operands / 内部词义才能理解标题。

本轮具体视觉方向中，“可能的疑问”浅红圆框、SEED 89.7 的浅灰 pill、目录后科学尝试总结页和后段技术工作总结页都只绑定 OpenEVO briefing；没有“以后全站照此模板”的授权。PR #605 的 `670ab9b4…` 是历史 current-candidate；后续 `56b5120…` 虽然进入 main，但 owner 在该 exact head 后仍点名两条 hard failure，因此 `56b5120…` 记为 Rejected，不得因 Git merge 升级成 Silver / Golden。


**2026-09-10 · CASE-087 补充 / 关键归因句不要让听众猜“问题”指什么**：owner 直接指出 `《为了判断问题是不是 SD-LoRA 独有》这里也讲清什么问题是不是 SD 罗拉独有。` 这里真正要排查的是：**成功轨迹已经有了，为什么把这些经验写进参数以后，任务能力还是没有明显提升？** 普通 LoRA 与 SD-LoRA 的对照随后才有含义：如果普通 LoRA 能学而 SD-LoRA 不能，才支持把原因指向 SD-LoRA 更新机制；如果两种都不行，就继续查数据、任务信号或训练逻辑。

规律补充：**科研机制和归因实验里的关键 referent 先命名，再做因果归因。** `这个问题 / 这个现象 / 它` 本身完全可以使用；只有当它承担关键因果关系、但近邻没有清楚 antecedent 时才是 failure。该机制记为 `unnamed-scientific-referent`，当前只有一次直接事件，因此维持 normal，不假升级 repeated/hard；用 `PAIR-087-DIAGNOSTIC-REFERENT` 做 deterministic recurrence guard。

同一 source window 里的 `把现在的 nogdr 也写进 slide 里面` 只约束当前 OpenEVO briefing 的内容新鲜度。No-GDR 的 round、rollout、loss、Score 与 shadow-GDR 数值属于会继续变化的科学事实，不进入长期 Preference Model；PR #614 exact head `0652a9cf…` 只记 `current-candidate`，没有新的 owner accepted / canonical 语言，所以不升 Silver / Golden。
