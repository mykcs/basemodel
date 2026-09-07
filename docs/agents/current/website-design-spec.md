# Basemodel 网站设计与「说人话」文案规范

状态：**CURRENT / CANONICAL**
适用范围：`basemodel` 的所有公开页面、导航、标题、说明文字、按钮、图表注释、状态提示和中英文文案。
案例库：[`website-copy-cases.md`](website-copy-cases.md)
实验谱系 / 肉鸽地图视觉语义：[`experiment-lineage-map-visual-standard.md`](experiment-lineage-map-visual-standard.md)
实现与推理复盘：[`../history/2026-08-31-human-copy-preference-mining-and-governance-retrospective.md`](../history/2026-08-31-human-copy-preference-mining-and-governance-retrospective.md)
历史审计基线：`origin/main@e11d443`，2026-08-30；从首个 commit `dd9b04b` 起对 901 个主线 commits 做全量历史检索，并交叉检索 274 个已合并 PR 与 349 个可见 PR 的元数据（当前最大 PR 编号为 #350）。

这份文档回答一个过去经常被误解的问题：

> 用户说「请说人话」「不要 AI 味很重」时，在这个网站里具体是什么意思？

它不是词汇黑名单，也不是要求把技术内容写浅。它定义的是**信息先后、说话姿势、标题职责和证据层级**。详细的历史原句、改写和来源统一放在案例库；本文件只保留已经稳定下来的规则。

## 1. 一句话定义

**说人话 = 先说对象和事实，再说结论与原因；让读者直接理解事情本身，而不是先理解网页怎样组织、作者准备怎样解释、内部系统怎样记账。**

**AI 味 = 用通用的讲解框架包住内容：先替读者规定阅读姿势，再制造“重点 / 误解 / 怎么读 / 如果只记住一句话”等舞台提示，最后才说真正的事实。**

最短判断：删掉一句话里的 `这页 / 本节 / 下面 / 这里 / 值得注意 / 常见误解 / 怎么读` 后，如果意思反而更清楚，就应该删。
## 2. 默认信息顺序

公开页面默认按下面顺序组织；只有内容本身需要别的逻辑时才改变：

1. **对象 / 事实**：这是什么、发生了什么、具体涉及谁或哪个系统。
2. **结论**：现在能下什么判断；如果只是信息页，就直接给最重要的状态。
3. **机制**：为什么会这样、系统怎样工作、因果链在哪里。
4. **证据**：精确数字、配置、run ID、SHA、manifest、原始字段和来源。

这不是要求页面显示四个同名栏目。它是作者脑中的排序规则，不能变成新的模板化 UI。

例如服务器页应该先写 `lyg2171 服务器简介` 和硬件事实，而不是先问“这台服务器能做什么，以及哪里最容易先用满”。见 [CASE-041](website-copy-cases.md#case-041-服务器标题直接命名对象)。

研究结果也一样：先说观察和结论，再解释实验机制，最后让读者展开证据。见 [CASE-029](website-copy-cases.md#case-029-结论先于实验账本) 与 [CASE-030](website-copy-cases.md#case-030-可见推理桥而不是只给标签)。

### 2.1 关系性结论需要先给最小参照物

`共同 / 继续 / 仍然 / 后续 / 第二版 / 同一个` 这类词本身没有完整意义：读者必须先知道“和谁共同、从哪里继续、相对什么仍然、接着哪一步后续”。

因此“结论先于解释”不能机械理解成“任何状态句都塞到第一句”。如果结论依赖一个尚未交代的实验结构，先用一两句给出最小结构，再说关系状态。

例如不要先写：

> 当前 corrected Stage 1 仍是共同起点。

应该先写：

> 接下来的训练分成 Stage 1 和 Stage 2。Stage 1 先收集并整理经验，Stage 2 再用这些经验继续训练；Ceiling-1.0 和 OpenEVO 2.0 都沿用同一份 corrected Stage 1，因此从这里分成两条 Stage-2 路线。

同样，`仍然是 8 张 GPU` 应写成 `并行规模保持 8 张 GPU`：把参照对象直接写进句子，不要求读者回忆上一段。详见 [CASE-060](website-copy-cases.md#case-060-关系状态前先给参照物)。

### 2.2 “AI 味”在本项目里通常是哪几种结构

1. **编辑者自述**：`本页 / 本节 / 本站 / 这里` 先解释内容怎样被组织。
2. **阅读舞台提示**：`下面我们会 / 如果第一次看 / 如果只记住一句话`。
3. **洞察表演**：`值得注意 / 真正重要 / 一个常见误解 / 关键洞察`，但后面只是普通事实。
4. **模拟读者提问**：把稳定主题都改成 `怎么读 / 为什么看起来 / 你可能会问`。
5. **强行教学化**：本可直接陈述的事实被包装成教程、类比或“先学会怎么看”。
6. **抽象包装先行**：`研究任务 / 研究主线 / 证据链 / 决策面` 遮住了实验、模型、GPU、数据等实际对象。
7. **机器记录直出**：把 `0 个训练步`、raw field、内部 ID 当成人类句子。
8. **排除法归因**：先清一串读者不认识的“嫌疑人”，最后才说责任在哪。
9. **卡片化写作**：每个小点都加同权重标题和卡片，视觉上像自动生成的 dashboard。

这些结构都不是绝对禁止；判断标准是它们有没有比直接事实多提供信息。案例见 CASE-013–024、CASE-035–036、CASE-041–049。

## 3. 标题：先命名主题，不替读者主持节目

### 3.1 H1 / H2 / H3 的默认职责

普通标题优先是**短、稳定、可导航的主题名**：

- `lyg2171 服务器简介`
- `GPU 规格`
- `磁盘使用情况`
- `数据来源`
- `模型角色`
- `实验结果与证据`

标题不是微型文章，不需要同时承担铺垫、解释、提醒和结论。
### 3.2 哪些标题通常有 AI 味

以下结构不是绝对禁词，但默认需要重写：

- `“第几代”和“多少核”怎么读`
- `一个常见误解`
- `这台服务器能做什么，以及哪里最容易先用满`
- `为什么我们现在要……`
- `真正重要的不是 X，而是 Y`
- `如果只带走一句话……`
- `先用一段话看懂……`
- `这篇文章不是……`

这些标题共同的问题不是“太长”，而是**把作者的讲解动作放在主题前面**。`“第几代”和“多少核”怎么读` 改成 `GPU 规格` 后，正文仍然可以解释代际、CUDA 核和多卡含义。见 [CASE-043](website-copy-cases.md#case-043-怎么读改成-gpu-规格)。

### 3.3 什么时候标题可以是问句或动作句

问句只在它本身就是读者正在做的真实判断时使用，例如 `这个模型符合已填写的实验条件吗？`。按钮和操作步骤则应该直接使用动词，例如 `比较模型`、`查看实验步骤`、`保存实验记录`。

不要把 2026-08-12 早期“标题尽量含动作”的规则机械推广到所有 H1/H2。历史演进表明：**导航和操作要可执行，普通章节标题要先命名对象。** 见 [CASE-010](website-copy-cases.md#case-010-从抽象研究标签改到具体操作) 与 [CASE-041](website-copy-cases.md#case-041-服务器标题直接命名对象)。

## 4. 正文：直接进入事情，不解释文章自己

正文第一句默认回答事情，而不是介绍页面。避免：

- `这篇文章不是……`
- `这一节只负责……`
- `下面我们会……`
- `如果你第一次打开这一页……`
- `这里提供回看入口……`
- `为了避免重复……`
- `完整流程图只保留在……`
- `这篇笔记已经并入……`

这些信息通常属于作者、CMS、路由或编辑过程，不是读者要理解的研究对象。能删除就直接删除；真的有迁移事实需要保留时，只写新的位置或事实。见 [CASE-019](website-copy-cases.md#case-019-删除已并入的编辑说明) 到 [CASE-024](website-copy-cases.md#case-024-本节只建立改成直接陈述关系)。
## 5. 否定句不是禁词；先让读者知道在否定什么

`不 / 不是 / 不要 / 不能` 不属于禁用词。历史上专门修过 copy audit，防止把正文里的科学对照 `X 不是 Y，而是 Z` 误判成坏文案。见 [CASE-032](website-copy-cases.md#case-032-否定句不是一刀切禁用)。

真正需要避免的是：

- 标题第一句话先告诉读者“不要怎么理解”，却还没说对象是什么；
- 通过连续排除陌生嫌疑对象，让读者自己推断责任；
- 用否定包装本可以直接说清的状态。

责任已经查清时，先写：

> 责任在我们的实验集成层：正式评测前没有用真实模型输出验证 parser / projection 能稳定恢复完整动作。

而不是先写：

> 不能归给 SD-LoRA，也不是 SEED parser 的 bug，更不能说……

触发原因和责任归属可以不同：模型可能触发边界情况，实验 harness 仍然负责让已知边界情况破坏正式测量。见 [CASE-036](website-copy-cases.md#case-036-责任先直接点名负责层)。

## 6. 技术语言：聪明读者不等于拥有项目上下文

默认读者可能没有智能体基础，也不了解本项目。先给具体任务、模型负责的动作和研究问题，再引入技术词。每个实验的开始、结束、产出与当前状态属于可见主线；技术深度放在相应证据旁，不要求读者先读术语表。

推荐顺序：

> 模型真正要执行的是 `search[...] / click[...]` 命令；`<action>...</action>` 是包住命令、让解析器定位动作的外层标签（wrapper）。

然后再讨论 parser、projection、compatibility preflight。见 [CASE-034](website-copy-cases.md#case-034-命令与-wrapper-先于-parser-术语)。

中文页面优先中文含义，必要时保留英文检索名：`训练候选池 (TRAIN CANDIDATE POOL)`、`原始任务分数 (task_score)`。不要要求读者先解码项目英语才能继续。见 [CASE-027](website-copy-cases.md#case-027-中文含义先于项目英文标签)。
## 7. 数字和机器字段：证据层精确，正文层自然

机器记录里的表达不一定适合直接成为人类句子。

例如正文优先：

> 我们一步都没训练，BASE 就已经写出了 `[action]`。

而不是：

> 0 个 OpenEvo adapter 训练步即可看到 `[action]`。

`0`、`adapter_loaded=false`、optimizer step 上限等仍然应该保留，但放在证据或技术层。读者不应该先把数据库式表达翻译回正常语言，才能知道发生了什么。见 [CASE-035](website-copy-cases.md#case-035-机器计数改成人类句子)。

同理，`80/80 block 没有参数更新`、`identity 最大 7，gate 需要 8` 这类状态如果公开给不了解实验的人，必须先解释 block、identity、gate 分别代表什么，以及 7 < 8 为什么导致没有更新；不能只把内部计数原样搬上网页。

### 7.1 内部计数、阈值和阶段名不能裸奔

面向不了解实验历史的读者，`Stage 2 / block / identity / gate / no-update / qualified positive` 这类词不能靠并排数字让读者自己推断含义。第一次出现时，必须在同一句或紧邻一句回答三件事：

1. **它数的是什么现实对象。** 例如 `identity` 在这次实验里数的是“能够各自重复完整成功的不同任务”，不是轨迹条数，也不是模型分数。
2. **这个数字为什么影响结果。** 例如历史规则要求每 256 次任务尝试里至少出现 8 个这样的不同任务，才允许做一次参数更新。
3. **这是运行事实还是长期算法。** 历史 method-control 能解释这一次为什么没有更新，不能自动升级成 OpenEVO 长期 Stage 2 的定义。

**反面案例：**

> Stage 2 写出了 20,480 条 rollout 和 797 条 qualified-positive trajectory，但 80/80 个 block 都没有参数更新；单个 block 的 qualifying identity 最大只有 7，而 gate 需要 8。

这句话数字准确，但要求读者同时知道五个内部术语，还把 `7 < 8` 当成自解释因果。

**认可案例：**

> Stage 2 完成了 20,480 次 WebShop 任务尝试，其中 797 次是完整成功、且轨迹质量足以进入训练候选池。这个历史实验把每 256 次尝试单独检查：只有同一批里至少有 8 个不同任务都能重复完整成功，才允许更新参数。实际最好的一批只有 7 个，因此这次运行的 80 批数据都没有触发参数更新。这里的 8 是当时实验采用的方法控制门槛，不是 OpenEVO 长期 Stage 2 的固定规则。

规则不是“所有术语都删掉”，而是**先给人类含义，再保留术语作精确索引**。详细正反面对照见 [CASE-051](website-copy-cases.md#case-051-内部计数不能代替解释)、[CASE-052](website-copy-cases.md#case-052-数字因果链要把规则说完整) 与 [CASE-053](website-copy-cases.md#case-053-历史规则不能伪装成长期算法)。

### 7.2 ELI5 不是“删掉术语”，而是“翻译成现实对象”

ELI5 的第一层必须保留 **对象 + 发生了什么**。不能为了变短，把内部术语删掉以后只剩一个数字、一个“限制”、一个“继续跑”或一个“结果”，让读者反而不知道在说什么。

例如 `64-component cap` 的实现含义是：这条 SD-LoRA 连续训练原本最多允许发生 64 次新的参数更新；每次正式更新都会新增一个 component。对第一次来的读者，第一层应该写：

> 放宽参数更新次数

而不是：

> 放宽 64 限制

后者虽然更短，却丢掉了 `64` 数的是什么。技术层再补 `component_count`、`generation`、`effective rank`，并明确一次参数更新内部仍包含多个 optimizer steps。

同样，`7B 继续跑 / 工程修复 / 当前结果 / 以后可能压缩` 这类短句如果脱离作者上下文仍需猜对象，也应改成 `继续 7B 训练 / 修复训练运行问题 / 7B 当前进度 / 以后可能压缩已积累的参数更新` 这类保留现实对象的写法。

规则：**ELI5 优先减少“解码项目术语”的成本，不以最短字数为目标。** 详见 [CASE-059](website-copy-cases.md#case-059-eli5-不能删掉对象只留下数字或空泛动词)。

### 7.3 没发生不等于失败；页面必须能脱离聊天独立成立

公开结果页要严格区分：**没有运行、运行后得 0、运行后没有参数更新、测量无效**。它们不是同一种“失败”，也不能都压成 `0 / failed / pending`。

同时做一次 first-time-reader completeness 检查：假设读者懂机器学习，但没有看过项目聊天、运行日志和内部编号。仅靠当前页面，他仍应能回答“发生了什么、数字数什么、为什么这样、能推出什么、不能推出什么”。详见 [CASE-057–058](website-copy-cases.md#case-057-没有发生不能写成效果差)。

## 8. 比喻：只在它真的减少理解成本时使用

“说人话”不等于“每段都加一个比喻”。如果字面事实已经简单，比喻反而像 AI 在表演解释。

例如服务器配置直接写：

> `lyg2171` 配置为 2 × Intel Xeon Platinum 8380、1.0 TiB 内存和 8 × RTX 5090；当前主文件系统剩余约 55 G。

比写“把它想成一张给科学训练用的大工作台”更合适。见 [CASE-042](website-copy-cases.md#case-042-能直说就不强行比喻)。

复杂机制仍然可以类比，但必须满足两个条件：类比建立正确心智模型；随后能自然回到真实技术对象。不要用类比替代精确定义。

## 9. 不制造“洞察感”

以下常见 AI 包装默认删除或改成事实：`值得注意的是`、`一个常见误解`、`关键洞察`、`真正重要的是`、`如果只记住一句话`、`总的来说`、`我们不妨`、`让我们先`。

不是因为这些词永远不能出现，而是它们经常没有增加信息，只是在替一句普通事实加主持人口吻。见 [CASE-044](website-copy-cases.md#case-044-常见误解改成事实栏目)。
## 10. 不重复同一个意思来制造“设计层级”

视觉层级不能靠把同一个词写三遍。

历史上已经多次删除：

- `Evidence` kicker + `证据`标题 + 证据正文；
- `模型供应层 / 家族层 / 决策面` 这类已经被 H1 表达过的 eyebrow；
- 与 H2 相同的 section kicker；
- 同一卡片里两个 `加入对比` 入口。

如果 kicker、标题、正文第一句表达的是同一件事，通常保留信息最强的一层。见 [CASE-001](website-copy-cases.md#case-001-删除重复-evidence-标签)、[CASE-004](website-copy-cases.md#case-004-删除重复-section-label) 和 [CASE-006](website-copy-cases.md#case-006-一个动作只保留一个主要入口)。

## 11. 内部代号是 provenance，不是叙事骨架

`H1.38B`、`PRIMARY-v1`、selector code、campaign 名、SHA、manifest path 很重要，但它们首先服务审计和复现。

面向读者的主线优先是：

> 发生了什么 → 我们观察到什么 → 这个观察支持什么 → 还不能证明什么。

内部 ID 放在证据链接、表格、括注或 `<details>` 中。除非页面本身就是运行日志或谱系审计，否则不要让 H-number 充当读者理解研究的第一层目录。见 [CASE-029](website-copy-cases.md#case-029-结论先于实验账本)。

## 12. “说人话”不能牺牲科学精度

自然语言仍然必须保持证据边界。

典型例子：已经提前固定比较问题和槽位，只能写 `comparison pre-specification`，不能为了显得正式升级成 `preregistration`。见 [CASE-039](website-copy-cases.md#case-039-pre-specification-不能升级成-preregistration)。

同样：

- measurement-invalid 不能写成模型能力为 0；
- `frozen` 如果可能被理解成模型来源，应写成“评测期间参数不再更新”；
- unknown 不能为了完整感补成 `false / 0 / no`；
- 一个丢失的 `不` 能把结论完全反转，必须有极性保护。见 [CASE-031](website-copy-cases.md#case-031-一个不字也属于科学正确性)。

公开示例还要保留隐私边界：路径、命令和配置如果只需要表达“当前实验账号的 home / secret 目录”，就写 `$HOME/...` 这类通用形式，不把真实 Unix 用户名、home path、主机名或私有账号标识写进公开页面。见 [CASE-050](website-copy-cases.md#case-050-公开示例使用通用路径而不暴露账号身份)。

**自然 ≠ 模糊；简洁 ≠ 降低证据标准。**
## 13. 页面各位置的具体写法

### 13.1 页面标题 / section heading

先命名对象。只有真正的用户决策才用问句，真正的操作步骤才用动作句。不要在标题里写阅读说明、免责声明或作者判断过程。

### 13.2 开场 / lede

第一段应让零项目上下文的技术读者知道：对象是什么、当前最重要的事实是什么。不要先说明“这页会讲什么”“我们为什么这样组织”。

### 13.3 正文过渡

用因果、时间、对照或对象关系连接段落，而不是 `下面来看`、`接下来我们讨论`、`值得注意的是`。真实的 `先 / 再 / 最后` 可以保留，例如真实训练步骤和因果顺序。

### 13.4 按钮 / 链接

按钮要预测下一步：`查看实验步骤`、`比较模型`、`保存实验记录`。避免 `进入研究`、`继续探索`、`形成决策` 这种需要猜目标的抽象动作。

### 13.5 Callout / warning

先给受保护对象和风险，再给禁止事项。安全、隐私、研究诚信警告可以直接使用否定句，不需要为了“语气柔和”绕弯。

### 13.6 `<details>` / evidence

主结论不能藏进去。适合放精确 counts、CI、manifest、代码路径、SHA、run ID、历史故障链。展开标题直接写内容类别，如 `数据来源`、`实验依据`、`技术回溯`。

### 13.7 图和视觉结构

图必须表达真实结构：顺序、依赖、边界、比较、数据流或状态变化。不要把一组 AI 风格卡片当作“可视化”。同一层级的每张卡如果只有一段文字，优先考虑普通段落、表格、定义列表或真正的流程图。

视觉规范继续以 [`human-thinking-web-expression-contract.md`](human-thinking-web-expression-contract.md)、[`ui-design-principles.md`](ui-design-principles.md) 和 [`sitewide-visual-knowledge-architecture.md`](sitewide-visual-knowledge-architecture.md) 为详细 owner。
## 14. 历史规则冲突时怎么判断

这个仓库的写作规范是逐步演进出来的。遇到旧文档或旧页面与本规范冲突时，按下面顺序判断：

1. **事实与证据正确性优先于口吻。** 不能为了更自然改坏科学含义。
2. **当前用户明确反馈优先于历史中间稿。** 案例库会标注“最终偏好证据”与“演进背景”。
3. **本规范决定通用口吻与信息顺序。** 更窄的 Results / reproduction contract 决定该页面额外需要保留什么。
4. **标题规则采用当前版本：主题优先。** 2026-08-12 的“concrete action before abstract framing”仍适用于按钮、导航、任务入口，但不要求普通 H1/H2 都写成长动作句。
5. **ELI5 是分层解释，不是儿童化。** 技术事实简单时直接说；只有复杂机制才逐层补充术语、类比和证据。

## 15. 30 秒「人话」检查

提交公开文案前逐项问：

- 标题能不能直接换成对象名，而信息反而更清楚？
- 第一段是在讲事情，还是在讲“这页准备怎么讲事情”？
- 有没有 `本站 / 本节 / 这里 / 下面 / 这篇文章` 可以直接删除？
- 有没有 `常见误解 / 怎么读 / 值得注意 / 如果只记一句话` 只是制造主持人口吻？
- 一个普通状态是不是被写成了机器计数或数据库字段？
- 项目术语第一次出现前，读者知道它具体做什么吗？
- 责任已经明确时，有没有直接点名负责层？
- 结论前是不是塞了太多 run ID、阶段号、SHA 或 provenance？
- kicker、标题、第一句是不是在重复同一个意思？
- 中文页是不是让读者先解码英文术语才能理解？
- 比喻真的降低理解成本，还是只是让句子更像“解释型 AI”？
- 删除所有舞台提示后，事实、因果和证据边界还完整吗？

如果其中三项以上回答“不确定”，回到案例库找相似改写，不要只靠“更友好”“更自然”这种抽象感觉。
## 16. Agent 工作流

任何新增或修改公开文案的任务：

1. 先读本规范。
2. 用户给出真人网页反馈、指出重复理解问题，或要求 `说人话 / 去 AI 味 / 自然一点 / 不要像 AI 写的` 时，不只找一个相似句子：从 [`website-copy-cases.md`](website-copy-cases.md) 读取一个**案例簇**，至少包含当前最接近案例 + 2 个同类/相邻案例；新反馈优先于较老案例。
3. 先把案例簇总结成一句可复用规则，并同时写清“这条规则不意味着什么”。例如 CASE-061–066 的共同规则不是“删除英文”，而是“零上下文首层先展示真实对象、双方、动作与结果；内部代号和方法学术语后置”。
4. 根据页面职责加载专门规范，例如 Results 加载 reader-first / research-editorial，技术解释页加载 layered explainer。
5. 先核实事实，再改口吻；不要让文案优化改变证据边界。
6. 通读当前页面所有受影响的 H1/H2/H3、lede、nav、table subject、result card、button、callout、empty/error/status 和图注，而不是只改用户点名的一句。
7. 用“语义位置 + 案例里的词语线索”扫描其他 production copy owner、共享组件和 sibling routes。先判断是不是同一个失败机制，再分类为高置信同类 / 不确定 / 有意例外；同一任务里直接修高置信同类，不对不确定项做机械替换。
8. 运行 `npm run audit:copy`，把结果与案例驱动的扫描结果一起当 review queue；不要把正则命中当作语义结论。
9. 能机械检测的规律要进入现有 audit/test，优先保护“失败家族”而不是只 ban 一句原话；不能可靠机械检测的规律保留为案例与 Agent 审查步骤。
10. 运行 `npm run audit:copy:strict` 与仓库对应验证；UI 改动继续走 browser gate，真实桌面/移动 viewport 验收仍不能被字符串测试替代。
11. 如果用户反馈形成新的、跨页面可复用偏好，更新本规范或案例库并记录本轮传播到哪些 sibling/surface；不要新建第六套平行 style guide。

## 17. 专门规范的职责

本规范是**网站级入口与用户口吻 owner**，不是要废掉已有文档：

研究结果页会进一步把本规范的 `对象/事实 → 结论 → 机制 → 证据` 细化成 `科学问题 → 直接结果 → 决定性数字 → 解释 → 证据边界 → provenance → 可选复现细节`；两者方向一致，以更窄的 [`research-site-presentation-contract.md`](research-site-presentation-contract.md) 决定 Results 的公开深度。

| 文档 | 继续负责什么 |
|---|---|
| [`audience-centered-technical-copy.md`](audience-centered-technical-copy.md) | 技术文案 baseline、上下文、术语、状态、copy audit |
| [`reader-first-copy-hierarchy.md`](reader-first-copy-hierarchy.md) | 结论/数字/责任的可见层级，删除阅读舞台指示 |
| [`layered-technical-explainer-copy.md`](layered-technical-explainer-copy.md) | 中文技术解释 L1 → L2 → L3，术语第一次出现的处理 |
| [`research-editorial-style.md`](research-editorial-style.md) | 科研叙事、claim → evidence → inference → boundary、run ID provenance |
| [`research-site-presentation-contract.md`](research-site-presentation-contract.md) | 科研结果页的 result-first 顺序，以及 commands / configs / logs 的 progressive disclosure 边界 |
| [`human-thinking-web-expression-contract.md`](human-thinking-web-expression-contract.md) | 思维结构到 semantic HTML / visualization 的映射 |
| [`ui-design-principles.md`](ui-design-principles.md) | 页面视觉、响应式、可访问性与交互设计 |

## 18. 案例库是规范的一部分

抽象规则不足以表达这个用户的偏好。历史案例不是附录装饰，而是解释规则含义的判例。

未来 Agent 如果只收到一句 `说人话，不要 AI 味`，必须把本规范与 [`website-copy-cases.md`](website-copy-cases.md) 一起当作解释该指令的仓库上下文；遇到边界冲突时，以**更接近当前页面、时间更晚、且明确来自用户反馈**的案例为优先参考。
## 19. 一句话偏好索引

未来 Agent 可以先用下面这张表定位，再去案例库看原句：

| 用户偏好 | 历史判例 |
|---|---|
| 标题先命名对象，不先教读者“怎么看” | [CASE-041](website-copy-cases.md#case-041-服务器标题直接命名对象), [CASE-043](website-copy-cases.md#case-043-怎么读改成-gpu-规格), [CASE-047](website-copy-cases.md#case-047-这些数字怎么测出来改成数据来源) |
| 事情先于文章；不要解释页面怎样组织 | [CASE-013–024](website-copy-cases.md#case-013-这篇文章不是开头被删除) |
| 一个意思只出现一次，不用重复标签制造层级 | [CASE-001–006](website-copy-cases.md#case-001-删除重复-evidence-标签) |
| 能说实验、模型、GPU、数据，就少用“研究主线/决策对象” | [CASE-007–012](website-copy-cases.md#case-007-研究总览改成实验总览) |
| 第一屏先给结论和决定性数字，run ID 后置 | [CASE-029](website-copy-cases.md#case-029-结论先于实验账本) |
| 推理要可见，但写成“观察→支持→边界”，不是内部标签 | [CASE-030](website-copy-cases.md#case-030-可见推理桥而不是只给标签) |
| 机器状态翻译成人类句子；raw field 留证据层 | [CASE-035](website-copy-cases.md#case-035-机器计数改成人类句子) |
| `block / identity / gate / no-update` 先翻译成人类对象和因果，再保留术语 | [CASE-051–053](website-copy-cases.md#case-051-内部计数不能代替解释) |
| ELI5 保留“对象 + 发生了什么”；不能删到只剩数字、限制或空泛动词 | [CASE-059](website-copy-cases.md#case-059-eli5-不能删掉对象只留下数字或空泛动词) |
| 连续几版实验都出问题时，分别写清每一版“现实里坏了什么”，不要统一叫“Stage 2 失败” | [CASE-054–056](website-copy-cases.md#case-054-阶段二失败不能写成一个标签) |
| “没运行”与“结果为 0”严格分开；页面脱离聊天仍能自解释 | [CASE-057–058](website-copy-cases.md#case-057-没有发生不能写成效果差) |
| `共同 / 继续 / 仍然 / 后续` 先给关系两端和最小结构，再写状态 | [CASE-060](website-copy-cases.md#case-060-关系状态前先给参照物) |
| 项目术语先解释它在这里干什么，再给英文/内部名 | [CASE-025–028](website-copy-cases.md#case-025-先解释-webshop-任务再讲内部对象), [CASE-034](website-copy-cases.md#case-034-命令与-wrapper-先于-parser-术语) |
| 责任已知时直接点名负责层，不先清嫌疑人 | [CASE-036](website-copy-cases.md#case-036-责任先直接点名负责层) |
| 否定句可以用；不要把 negative-first 当机械禁词 | [CASE-031–032](website-copy-cases.md#case-031-一个不字也属于科学正确性) |
| 能直说就不强行比喻，不为了“好懂”表演教学 | [CASE-042](website-copy-cases.md#case-042-能直说就不强行比喻) |
| `常见误解 / 值得注意 / 如果只记一句话` 没增加信息就删 | [CASE-015](website-copy-cases.md#case-015-如果只带走一句话被删除), [CASE-044](website-copy-cases.md#case-044-常见误解改成事实栏目) |
| 问句只有在它真的是用户正在做的判断时才有价值 | [CASE-046](website-copy-cases.md#case-046-为什么看起来不像改成原因) 与 [CASE-010](website-copy-cases.md#case-010-从抽象研究标签改到具体操作) 的演进对照 |
| 中文先给含义，英文术语保留作精确检索 | [CASE-027](website-copy-cases.md#case-027-中文含义先于项目英文标签) |
| 自然语言不能夸大 claim、补 unknown、丢否定或混淆术语 | [CASE-031](website-copy-cases.md#case-031-一个不字也属于科学正确性), [CASE-033](website-copy-cases.md#case-033-frozen-改成评测期间参数不更新), [CASE-039–040](website-copy-cases.md#case-039-pre-specification-不能升级成-preregistration) |
| Results 主线先给科学问题、结果和边界；命令、配置、日志后置 | [CASE-048](website-copy-cases.md#case-048-结果页不是命令手册) |
| 交互 affordance 不能反过来违背句子语义 | [CASE-049](website-copy-cases.md#case-049-不要-cat-就不能提供复制-cat) |
| 公开命令和路径只暴露复现所需信息，不暴露真实账号/主机身份 | [CASE-050](website-copy-cases.md#case-050-公开示例使用通用路径而不暴露账号身份) |
| 页面结构表达真实关系，不把一堆同权重卡片当“设计” | [`human-thinking-web-expression-contract.md`](human-thinking-web-expression-contract.md) + [CASE-001–006](website-copy-cases.md#case-001-删除重复-evidence-标签) |

如果只记一个判断：**先把作者、网页、阅读动作和内部账本从句子里拿掉，看剩下的事实是否已经足够清楚。**

## 20. 网站设计的非文案底线

本文件以文案为重点，但“说人话”不能只靠改句子。公开页面同时遵守这些设计底线：

1. **页面先有职责，再有组件。** 先确定读者在这条研究路径上要理解或完成什么，再决定 hero、table、diagram、details 或 CTA。
2. **视觉权重服从语义权重。** 结论、失败、原因、决定性数字不能因为版式好看被做成浅灰小字；provenance 才适合降级。
3. **一条想法不等于一张 card。** 普通连续论述优先用段落、列表、定义列表或表格；卡片用于真正并列、可独立扫描的对象。
4. **流程和架构要画成真实结构。** 有顺序、分支、回路、依赖或边界时，用 semantic HTML + CSS / SVG 表达连接，不用几段 prose 加 `→` 假装流程图。
5. **颜色必须有语义。** 相同对象类别保持相同视觉语言；不能为了“更丰富”给每个框随机换色。
6. **先保证手机能读。** CJK prose、表格、节点、导航和 evidence 展开在窄屏不能变成竖字轨、横向溢出或不可触达控件。
7. **可访问性属于设计本身。** heading order、focus、keyboard、reduced motion、contrast、semantic labels 和可复制文本不是收尾装饰。
8. **技术图仍然要允许逐层深入。** 主图先让人看懂对象和关系，精确实现细节放正文或 `<details>`；不要让截图或 raster 图代替主要语义内容。

详细实现分别由 [`human-thinking-web-expression-contract.md`](human-thinking-web-expression-contract.md)、[`ui-design-principles.md`](ui-design-principles.md)、[`sitewide-visual-knowledge-architecture.md`](sitewide-visual-knowledge-architecture.md)、[`theme-contrast-contract.md`](theme-contrast-contract.md) 和 [`ui-change-visual-acceptance-gate.md`](ui-change-visual-acceptance-gate.md) 负责。本规范只决定这些 owner 之间共同的页面表达方向。
## 21. 品牌外链：品牌保持官方，外围视觉保持本站统一

GitHub、Hugging Face 这类读者一眼就能识别的平台链接，不应只靠 `↗` 或让读者先读完整 URL 才知道会去哪里。默认同时保留**平台文字语义 + 第一方官方品牌 mark**；图标用于加快识别，不替代链接名称。

执行规则：

1. **只用第一方官方资产。** GitHub 使用 GitHub / Primer 官方发布的 GitHub mark；Hugging Face 使用 `huggingface/brand-assets` 的官方 mark。不要自己描一个“像 GitHub / Hugging Face”的图，也不要用通用代码、仓库、机器人图标冒充品牌。
2. **品牌本身不做本站化改造。** 不把 Hugging Face 的黄橙 mark 改成本站 accent；GitHub mark 只在其官方允许的黑 / 白高对比表现之间切换。不得拉伸、旋转、加渐变、描边或重新组合官方图形。
3. **统一的是容器，不是 logo。** 普通正文和按钮里的品牌 mark 使用同一视觉占位（当前为约 `20px × 20px`）、控制级圆角、本站 surface / border token 和一致的文字间距。这样不同品牌属于同一套界面语言，但仍然保留各自身份。
4. **官方资产必须 vendored + pinned。** 不在页面运行时请求第三方 favicon / logo CDN。把已审核的官方资产固定到仓库，并记录 immutable upstream revision 与 SHA-256；上游以后换 logo 时，要通过明确的资产更新 PR，而不是静默漂移。
5. **按真实 hostname 判断，不按字符串猜。** `github.com` / `*.github.com` 和 `huggingface.co` / `*.huggingface.co` 可以识别；`github.com.example.org` 之类的 lookalike 绝不能得到官方品牌标识。
6. **图标是装饰，链接文字承担可访问语义。** mark 用 `aria-hidden` / 空 `alt`，不能让 screen reader 重复朗读“GitHub GitHub”。如果页面只有一个无文字图标按钮，必须另行提供明确的 accessible name；不能套用本条“装饰 mark”规则。
7. **不能为了加图标改变原来的布局语义。** 如果 `<a>` 本身是 grid / flex card，优先把 mark 放进原有文字 / metadata cell，而不是粗暴增加一个 direct child，避免无意多出一列或一行。
8. **验收必须覆盖 light / dark、desktop / narrow、hover / keyboard focus。** GitHub mark 在暗色背景要保持足够对比；Hugging Face mark 的官方颜色也必须在本站 surface 上清楚。移动端不能因为图标造成标题竖排、截断或横向溢出。

反例包括：所有外链统一画一个 `↗` 就算“有图标”；给 GitHub / Hugging Face 各画一个风格相似但非官方的线框 icon；为了视觉整齐把所有品牌强行染成同一种蓝色；从第三方 favicon 服务实时拉图；在一个三列 evidence grid 里直接塞第四个 icon 节点导致布局变化。

当前共享实现由 `src/components/common/ExternalBrandMark.tsx`、`src/lib/externalLinkBrand.ts` 与 `public/brands/` 负责。新增品牌平台时，先核对品牌方官方资产与使用约束，再扩展这一层；不要在各页面复制 SVG。
