# OpenEvo 能力探索「两张肉鸽地图」信息架构与实施标准

状态：**CURRENT / CANONICAL SPECIALIZATION**  
适用范围：`/research/seed-openevo/study/capability-exploration/` 及其 Stage 1 / Stage 2 / Ceiling-1.0 / OpenEVO 2.0 相关子页面、组件、导航、实验谱系、历史结局与实验档案。

关联规范：

- [`experiment-lineage-map-visual-standard.md`](experiment-lineage-map-visual-standard.md) — 节点等级、scientific amendment、engineering fix、patch lane、future/locked 与移动端地图语义；
- [`website-design-spec.md`](website-design-spec.md) — 说人话、对象先行、内部数字与代号解释；
- [`human-thinking-web-expression-contract.md`](human-thinking-web-expression-contract.md) — 页面必须表达研究对象与因果，不先解释网页自己；
- [`research-site-presentation-contract.md`](research-site-presentation-contract.md) — 结论、解释与技术证据分层；
- [`scientific-state-provenance.md`](scientific-state-provenance.md) — current / historical / successor / amended lineage 与 provenance 边界；
- [`ui-change-visual-acceptance-gate.md`](ui-change-visual-acceptance-gate.md) — Desktop / iPhone / light / dark / reduced-motion 的验收要求。
- [`openevo-capability-exploration-two-map-implementation-runbook.md`](openevo-capability-exploration-two-map-implementation-runbook.md) — 实施顺序、latest-authority 同步、一项一汇报协议、完整测试 / 浏览器 / Preview / PR / Production 验收合同。

本文件是当前 OpenEvo capability-exploration 的**页面结构与实施合同**。它不冻结任何 live round、score、PID、GPU 或最新 SHA；这些易变事实必须继续从 `mykcs/openevo-experiment` 的当前 scientific authority 读取。

---

## 1. 已批准的产品决定

OpenEvo 能力探索不再尝试把旧 Stage 1 / Stage 2、Ceiling-1.0、Harness201 / Harness201.1、后续重采 Stage 1 和各种工程修复强行塞进同一张不断延长的实验树。

当前采用：

```text
OpenEvo 能力探索大厅
        │
        ├── 第一张地图：第一轮 OpenEvo 实验
        │      旧 Stage 1 / Stage 2 + Ceiling-1.0 的完整历史探索
        │      重点回答：我们跑出了什么，以及从中学到了什么
        │
        └── 第二张地图：重新设计 OpenEvo
               从新的 Harness / Stage 1 重新建立 coherent successor
               重点回答：吸收旧实验经验以后，现在怎样重新设计
```

两张地图**科学上独立、叙事上有因果联系**。

不要写成：

> 旧实验失败，所以换新版。

也不要写成：

> OpenEVO 2.0 只是旧 Stage 2 的下一个普通节点。

正确关系是：

> 第一轮实验跑得足够深，暴露了 Stage 2 更新规则、行动接口、参数容量和长期运行等问题；这些证据决定了第二轮怎样重设 Harness、Stage 1 与 Stage 2。新版不是凭空出现，也不能假装和旧 lineage 连续。

---

## 2. 页面级信息架构

### 2.1 总入口：能力探索大厅

保留：

`/research/seed-openevo/study/capability-exploration/`

职责只做三件事：

1. 用一段人话说明为什么现在有两张地图；
2. 让读者选择进入“第一轮实验”或“重新设计 OpenEvo”；
3. 提供一个降权的“实验档案”入口，供研究者查看 qualification、Kaggle/Server、API、checkpoint、PR/SHA 等实现证据。

总入口**不再直接渲染完整的 Stage1→analysis→Stage2 巨型交互树**。

推荐公开标题：

> OpenEvo 能力探索

推荐开场事实：

> 我们先跑了一轮完整的 Stage 1 → Stage 2，7B 证明这套方法能够持续产生参数更新，3B 和长期运行则暴露了更新规则、行动接口和容量边界的问题。后来的 OpenEvo 重设计直接来自这些实验，因此我们把历史探索和新版实验拆成两张地图。

避免：

- `先走一条实验路线，再看它走到了什么结局`；
- `如果第一次看这一页……`；
- `这里不跳转页面……`；
- 把当前 mechanical gate / internal closeout 字段塞进大厅第一屏。

### 2.2 第一张地图：第一轮 OpenEvo 实验

新增主路线页，公开名称：

> 第一轮 OpenEvo 实验

建议路由：

`/research/seed-openevo/study/capability-exploration/first-run/`

职责：

- 展示旧 Stage 1 → analysis → Stage 2 / Ceiling-1.0 的完整实验历程；
- 默认优先展示 **Qwen2.5-7B**，因为它提供最完整的 Stage2 持续更新和 64→65 容量边界证据；
- 允许切换 Qwen2.5-3B，看 bootstrap / invalid termination / Harness diagnosis 如何把研究推向 successor；
- 把“得到的经验”作为这张地图的结局，而不是把整张图写成 failure archive；
- 在结局处解锁第二张地图。

这张地图是 **historical / frozen evidence map**。已经发生的事实可以展示，但不得把后来的 successor 规则反写到历史实验上。

### 2.3 第二张地图：重新设计 OpenEvo

沿用已存在的语义入口：

`/research/seed-openevo/study/capability-exploration/openevo-2-0/`

公开名称优先：

> 重新设计 OpenEvo

`OpenEVO 2.0` 可以作为可检索的项目名 / 次级标签，不应要求第一次来的读者先知道它是什么意思。

职责：

- 从 Harness201.1-style action contract / fresh Stage 1 起点开始讲；
- 明确新 Harness 改变 on-policy action channel，因此旧 Stage1 trajectory 不能当作正式 successor 数据；
- 展示 fresh Stage1 → MiniMax post-hoc analysis → teacher pool seal → OPSD / Memory / Skill / Agent → new Stage2 origin → new Stage2；
- current / future / blocked 必须按当前 experiment authority 动态或人工同步，不在长期规范里冻结 live 数字；
- 旧 G3 attempt、旧 premature 3B Stage2 等只作为“为什么重开”的证据链接，不占新版主 spine。

### 2.4 实验档案：降权，不做第三张主地图

实验档案可以是大厅下方区域或独立轻量页。它不是第三条科学路线。

收纳：

- Server vs Kaggle MiniMax execution；
- MiniMax API retry / 429 / resume semantics；
- G3 attempt1/2/3/4；
- parser / counterfactual diagnostics；
- checkpoint retention / HF archive；
- GPU scheduling / lease；
- PR、commit、receipt、SHA、raw evidence。

只有当某项改变科学合同，它才升级回某张地图上的 `Scientific amendment`；否则留在 archive / evidence / engineering detail。

---

## 3. 两张地图之间的关系

第一张地图结尾提供一个明确的“获得的经验 / 解锁下一张地图”节点，而不是直接把下一张地图画成普通下一层。

推荐结构：

```text
第一轮实验
   │
   ├─ 经验：旧 7-vs-8 / 256-window 规则不能继续当长期更新算法
   ├─ 经验：思考格式与真正 WebShop action validity 必须分开
   ├─ 经验：参数学习容量需要显式科学边界，不能让实现 guard 偷偷决定实验终点
   └─ 经验：长期运行的工程修复必须与科学 amendment 分层
         │
         └── 解锁 → 重新设计 OpenEvo
```

这个连接表达**知识因果**，不表达 checkpoint / optimizer state 连续。

因此：

- 视觉上可以有 `unlock / successor` 连接；
- provenance 上必须标明 new lineage / fresh Stage1；
- 不得用一条普通 continuation spine 从旧 Stage2 checkpoint 直接连到 Harness201.1 Stage1。

---

## 4. 第一张地图的详细主剧情

### 4.1 第一层：Stage 1

先让读者理解这一层做什么：

> Stage 1 先让模型完成 WebShop 任务，收集做题过程，再把这些轨迹变成后续训练可用的经验。

第一层不默认暴露全部内部 lineage ID。

模型选择：

- `Qwen2.5-7B` — 默认；
- `Qwen2.5-3B` — 可切换。

分析方式仅在它确实构成历史科学分支时出现；Server / Kaggle 不作为 map branch。

### 4.2 第二层：Stage 2

第一张地图要把“旧 Stage2”与“Ceiling-1.0 后续 Stage2”按真实科学边界呈现，不再用一堆同尺寸卡片表示。

旧更新规则的问题要先说人话：

> 模型已经产生了不少完整成功轨迹，但旧规则要求在一个固定窗口里同时满足过强的成功身份条件，因此很多成功经验最终没有触发参数更新。

技术层再解释 `256 window`、`7 / 8`、identity、qualified-positive。

### 4.3 7B 主线

7B 是第一张地图的默认故事线，目标不是证明“7B 最好”，而是提供最完整的持续进化观测。

建议主 spine：

```text
Stage 1
  ↓
MiniMax / Stage1 downstream
  ↓
Stage 2 起点
  ↓
持续产生 clean success → SD-LoRA updates
  ↓
Capacity policy amendment
  ↓
继续 7B Stage2
  ↓
最终结果 / 当前冻结结论
```

`64-component` 必须按现有 canonical visual standard 处理为 **L3 Scientific amendment**，不能降级成普通 engineering bug chip：解除独立 component guard 改变了允许的参数学习容量合同。

同时必须明确：

- component count ≠ replay capacity；
- component count ≠ effective rank；
- 当前 lineage 保留的 effective-rank / VRAM / artifact-growth 等保护要在计划页解释；
- rank reduction / compression 若尚未正式激活，保持 future / locked，不得写成已经实施。

以下属于 L4 Engineering fixes，挂在 patch lane，不占主 spine：

- trainer source recovery；
- restart-safe validator；
- execution provenance inheritance；
- HF cold-archive retention；
- semantics-preserving storage / resume 修复。

公开第一层名称合并成 `修复训练运行问题`，技术名词进入说明卡。

### 4.4 3B 主线

3B 的价值是暴露 successor 设计问题，而不是简单贴“3B 不行”。

建议结构：

```text
Stage 1
  ↓
旧 / premature Stage2 evidence
  ↓
bootstrap / invalid termination 问题
  ↓
Harness201 qualification / G3 diagnosis
  ↓
HOLD / STOPPED evidence
  ↓
解锁 successor：重新设计 OpenEvo
```

必须保留的叙事边界：

- old 3B premature lineage 是历史证据，不是新 Harness Stage2 的合法前缀；
- Harness diagnosis 发现的问题推动 successor，但不能把旧结果倒推成“新 Harness 已证明 3B 不行”；
- failed / stopped 不等于无价值，地图结局应说明它具体教会了我们什么。

---

## 4.5 第二张地图内部再分两种读法（2026-09-04）

第二张地图不再要求一张页面同时承担“真实探索史”和“论文式结论”两种互相冲突的叙事任务。`/openevo-2-0/` 作为 successor gateway，下面固定分成两个语义一致但叙事顺序不同的子页面：

```text
重新设计 OpenEvo
  ├─ 探索版 / exploration/
  │    按实际诊断与修复顺序：问题 → 假设 → 小实验 → 证伪/回退 → 新假设 → freeze
  └─ 报告与论文版 / report/
       按论文顺序：研究问题 → 冻结设计 → 结果 → 为什么这样设计 → 证据 → claim boundary
```

两页必须消费同一份稳定事实数据，不能各自手写一套数字或 Harness 定义。推荐单一 data owner：`src/data/openEvoSuccessorNarrative.ts`。

### 稳定设计哲学常量

除非 scientific authority 明确改变研究问题，以下句子作为 capability-ceiling 叙事的稳定常量，不在页面间改写同义句：

> **在 SEED-aligned 的 WebShop 任务、轨迹与评测预算内，先冻结规则、再看结果，探索 OpenEvo 能把当前基座模型推到多高。**

English companion:

> **Within a SEED-aligned WebShop task, rollout, and evaluation envelope, freeze the rules before seeing outcomes and probe how far OpenEvo can push the current base model.**

`SEED-aligned` 表示研究问题与 WebShop task / rollout / evaluation envelope 对齐，不得扩写成“所有 runtime compute 与 SEED 完全相同”。

### 探索版叙事合同

探索版允许复杂、绕路和回退，而且**必须保留负结果的方向作用**。每个分叉至少回答：

1. 当时观察到了什么；
2. 为什么形成这个假设；
3. 跑了什么最小诊断；
4. 结果支持 / 证伪了什么；
5. 因此主线向哪里前进或回退。

真实存在的历史 predecessor diagnosis 可以作为“进入当前 successor 之前的探索节点”，但必须标明 historical predecessor，不得冒充 202609030400 shared Stage1 的同批 A/B。比如：15→30 horizon 的 paired 结果为零，因此 later shared harness 回到 15；这是旧 3B 诊断对 redesign 的输入，不是 current freeze 内重新消耗的实验预算。

### 报告 / 论文版叙事合同

报告版不按“我们先猜了什么”排序，而按 claim-bearing 结构：

```text
研究问题
  ↓
共享、strategy-neutral Harness
  ↓
canonical raw Stage1（两 arm 各 1,440）
  ↓
bootstrap behavior signal
  ↓
post-hoc MiniMax
  ↓
bounded Stage1 downstream carriers
  ↓
PRE_STAGE2_READY / separate Stage2 activation
```

每一段固定使用 `What / Why / Evidence / Boundary` 四层。主要结论与会改变解释的 caveat 保持可见；receipt、SHA、ablation 细节可以放 `<details>`。

### Harness 公平性披露合同

页面不得使用 `No assistance` 这类绝对词。统一公开口径是 **strategy-neutral bootstrap harness**，并同时披露：

- 任务、当前 observation、recent history、当前 admissible / Allowed actions：属于环境接口；
- hard action envelope / interface-owned action opener：属于 interface scaffolding，会降低机械非法动作，必须披露，但不选择答案；
- generic brief self-deliberation：属于 model-generic prompting scaffold，不包含 WebShop-specific strategy；
- raw Stage1 不注入 Memory / Skill / Agent System / SD adapter；
- raw Stage1 external teacher action calls = 0；
- MiniMax 只在 raw Stage1 seal 后做 post-hoc analysis；
- final panel 在 Stage1 不可访问；
- 公开 WebShop benchmark 可能存在 base-model pretraining contamination，当前实验不能证明其不存在。

因此可支持的是“共享接口、公平资源语义、无 task-solving strategy / answer leakage 的运行设计”，不能支持“模型从未受任何脚手架”“模型预训练从未见过 WebShop”。

---

## 5. 第二张地图的详细主剧情

### 5.1 新起点：Harness / action contract

第一层公开话术：

> 模型可以自由组织思考，但真正执行 `<action>` 时只能选择当前环境允许的 WebShop 动作。

技术层再显示：

- reasoning soft；
- action hard；
- dynamic Allowed Actions；
- no fuzzy repair；
- injective step seed；
- no learned carrier / adapter injection during fresh Stage1 collection。

### 5.2 Fresh Stage 1

必须明确：

> 因为新的行动接口会改变模型真正走出来的轨迹，所以新版从 Stage 1 重新采集，而不是继续沿用旧 1,440 条作为正式 successor 数据。

地图节点：

```text
新 Harness
  ↓
Fresh Stage 1
180 tasks × 8 = 1,440 rollouts
```

精确 task / rollout 数可以展示，但要同时解释各自数什么。

### 5.3 MiniMax analysis

MiniMax 的科学角色固定写成：

> 对已经发生的 Stage1 trajectory 做 post-hoc analysis；不替模型产生 WebShop action，不在 teacher pool seal 后继续进入 Stage2。

`Server` / `Kaggle` 是 execution environment。除非实验最终证明执行环境本身系统性改变分析结果，否则不画成两条科学分支。

### 5.4 Teacher evidence pool seal

将 teacher budget 的结束画成一个清楚的 milestone：

```text
1,440 trajectories
   ↓
1,440 MiniMax analyses
   ↓
Teacher evidence pool sealed
   ↓
external teacher calls = 0 for successor downstream / Stage2
```

机器字段放 evidence 层；主文案写“老师在这里退出”。

### 5.5 Stage1 downstream

OPSD / Text Memory / Skill Bundle / Agent System 可以作为同一层的并列 subsystem，但不要自动画成四条互斥科学路线。

默认语义：

```text
Teacher pool
    ↓
Stage1 downstream preparation
    ├─ OPSD
    ├─ Text Memory
    ├─ Skill Bundle
    └─ Agent System
    ↓
Stage2 origin seal
```

只有当某个 carrier 有正式 mutually-exclusive ablation / arm 时，才升级成 L2 branch。

### 5.6 New Stage 2

地图第一层只表达：

- 一轮收集一批新 rollout；
- clean exact success 可以触发参数学习；
- 0 clean success 时允许合法 NOOP；
- Text Memory / Skill / Agent 等按 frozen successor contract 更新 / no-op；
- 当前状态必须从最新 authority 同步。

旧 `7-vs-8`、旧 `256-window` 不再出现在 new Stage2 主 spine；它们只在“为什么改”中作为 historical evidence。

---

## 6. 节点分类与视觉语义

本项目继续使用 [`experiment-lineage-map-visual-standard.md`](experiment-lineage-map-visual-standard.md) 的五级节点。

本次两张地图的具体映射：

### L1 Mainline

- 第一轮实验 Stage 1；
- 第一轮实验 Stage 2；
- 7B sustained evolution；
- 第一轮结局 / lessons；
- Harness201.1 successor start；
- Fresh Stage 1；
- Stage2 origin；
- New Stage 2；
- final result / next decision。

### L2 Branch

- 3B / 7B model choice；
- self / MiniMax，仅在对应历史 experiment arm 真正改变 scientific lineage 时；
- future formal ablation / teacher arm。

### L3 Scientific amendment

- 旧 Stage2 → Ceiling update-policy amendment；
- 解除独立 64-component learning-capacity guard；
- Harness contract change when it changes trajectory semantics；
- future rank reduction / compression（若正式激活）。

### L4 Engineering fix

- resume / validator / trainer-source / archive / storage / lease 等 semantics-preserving 修复。

### L5 Evidence

- run receipt / SHA / checkpoint / HF / raw analysis / PR / notebook / logs。

---

## 7. 状态词汇标准

公开 UI 只保留少量稳定状态：

- `当前路线` — current active/recommended map；
- `历史路线` — completed / frozen historical evidence；
- `已停止` — scientific lineage intentionally stopped；
- `被阻塞` — current blocker exists；
- `已修复` — engineering blocker resolved；
- `尚未开始` — future / locked；
- `重新开始` — successor from fresh scientific boundary。

内部字段例如：

- `HOLD_FOR_STAGE2_READINESS_AUDIT`；
- `BLOCKED_HARNESS_READINESS`；
- `NO_RESUME`；
- raw attempt/run identifiers；

默认进入 evidence / technical detail，不直接作为大厅标题或主地图 headline。

---

## 8. 文案标准

### 8.1 地图第一层只回答“发生了什么”

推荐：

- `重新采集 Stage 1`；
- `MiniMax 分析这批新轨迹`；
- `老师在这里退出`；
- `继续 7B 参数训练`；
- `放宽参数学习容量`；
- `修复训练运行问题`；
- `重新设计模型的行动接口`。

避免：

- `G3 attempt4`；
- `comp64→65`；
- `formal-v4-agent-recovery`；
- `STAGED_INTERLOCK_HOLD`；
- `v5 carrier bridge`。

这些精确名词仍要保留，但进入说明卡 / evidence。

### 8.2 关系状态先交代参照物

不要：

> corrected Stage 1 仍是共同起点。

要：

> 旧 Ceiling-1.0 曾从 corrected Stage 1 进入 Stage2；新的 Harness 会改变轨迹，因此 successor 不再沿用这批轨迹，而是重新采集 Stage1。

### 8.3 不通过失败标签替代原因

不要：

> 3B 完全不行。

要：

> 3B 的旧 Stage2 没能稳定点燃参数学习；后续 qualification 又发现 action validity / invalid termination 问题，因此这条 lineage 停在诊断阶段，并推动了新的 Harness 设计。

---

## 9. 交互标准

### 大厅

- 两个主入口必须明显可选；
- 不需要先在同一页把整张树点完；
- hover / focus 可以预览一句摘要；
- 点击进入独立子页。

### 地图

- 节点可选择；
- 点击 outcome / lesson 后在地图下方展开完整故事，或进入同页详情区；
- 需要技术解释的节点提供 `+` / details；
- Desktop 同时默认只打开一个说明卡；
- iPhone 使用 dialog / modal；
- 当前路线 100% opacity，future preview 35–50%；
- dashed 只表示 future / locked。

### 地图之间

- 第一张地图结尾的 `进入新版 OpenEvo` 是明确 CTA；
- 第二张地图顶部提供 `查看第一轮实验为什么这样改` 的回看入口；
- 不要求用户依赖浏览器 Back 才理解因果。

---

## 10. Responsive / iPhone 标准

### Desktop

- 大厅两个主入口并列；
- 每张地图有一条清楚的主 spine；
- 7B / 3B 分支在同一层展开；
- engineering patch lane 不抢主线视觉中心。

### iPhone

- 大厅两入口纵向堆叠；
- 地图变成单列纵向主 spine；
- 3B / 7B branch 在分叉点后纵向堆叠；
- patch node 缩进 18–28px；
- 不允许页面级横向滚动；
- 说明卡使用 dialog；
- future preview 仍需满足可读对比度。

移动端优先保留：

1. 路线顺序；
2. 主线 / branch / amendment / patch 的等级；
3. 当前 / future / stopped 状态；
4. 点击后的详情恢复焦点。

不要求保留桌面地图的几何形状。

---

## 11. 数据与 scientific authority 标准

### 11.1 页面代码不成为实验 authority

以下内容不得只因为写进网站就变成“事实”：

- current round；
- current score；
- latest checkpoint；
- latest execution SHA；
- running / blocked / authorized；
- GPU ownership；
- final-panel unlock。

这些状态更新前必须刷新 `mykcs/openevo-experiment`。

### 11.2 稳定设计与易变事实分开

建议组件数据层至少拆成：

```text
stable lineage semantics
  - node kind
  - route effect
  - parent/successor
  - scientific boundary
  - ELI5 title

current evidence snapshot
  - state
  - exact metric
  - run / receipt / SHA
  - last verified date
```

不要把 live snapshot 冻结进 canonical UI standard。

### 11.3 Server / Kaggle 分类

除非 future controlled comparison 证明 execution environment 会改变科学输出，Server / Kaggle 只属于：

```text
same scientific node
  └─ execution metadata / diagnostic
```

不是：

```text
MiniMax
  ├─ Server scientific branch
  └─ Kaggle scientific branch
```

---

## 12. 实现大部与汇报边界

本次改造按下面六个“大部”执行。每完成一个大部，必须先做最小自检并向 owner 汇报，再继续下一大部；避免在一个超长改动里同时改变 IA、事实、样式和部署状态。

### 大部 0 — 方案 / 标准落仓库

交付：本文件。

验收：

- 两张地图科学边界明确；
- 第一轮 / successor / archive 的职责明确；
- 64-component、engineering fix、Server/Kaggle 分类没有混淆；
- 后续实施顺序与验收口径明确。

### 大部 1 — 重做能力探索大厅与路由骨架

目标：

- `capability-exploration/` 从巨型实验树改成两地图大厅；
- 新增 `first-run/` 路由；
- `openevo-2-0/` 明确成为 successor map 入口；
- zh/en 同步；
- 旧深层 detail route 保留，避免破坏历史链接。

不做：

- 这一部不一次塞完两张复杂地图的所有细节。

### 大部 2 — 第一张地图：第一轮 OpenEvo 实验

目标：

- 7B 默认故事线；
- 3B 可切换；
- Stage1 → Stage2 → capacity amendment → lessons 的主 spine；
- scientific amendment 与 engineering patch lane 分层；
- 结尾解锁 successor。

### 大部 3 — 第二张地图：重新设计 OpenEvo

目标：

- Harness/action contract；
- fresh Stage1；
- MiniMax post-hoc analysis；
- teacher pool seal；
- OPSD / Memory / Skill / Agent；
- new Stage2 origin / Stage2；
- current/future 状态按 authority。

### 大部 4 — 档案与 progressive disclosure

目标：

- 把 G3 attempts、Server/Kaggle、API retry、checkpoint、HF、PR/SHA 等从主剧情降权；
- 统一关卡说明卡 / evidence details；
- 不丢技术证据。

### 大部 5 — 清理旧叙事与全站引用

目标：

- 删除 / 改写“Ceiling-1.0 和 OpenEVO 2.0 共用 corrected Stage1”等已被 successor decision 推翻的公开叙事；
- 搜索 capability exploration 相关旧入口、CTA、描述、SEO description；
- 保留历史事实，但不让旧文案冒充 current architecture。

### 大部 6 — 测试、浏览器验收、Preview / release

目标：

- 更新 unit / semantic tests；
- `npm run verify:deploy`；
- `npm run build`；
- `npm run test:ui:all`（本次属于共享地图 / responsive / theme 改造）；
- Desktop + iPhone；
- light + dark；
- reduced motion；
- exact-head `[vercel-preview]` 只在代码完成、准备真实验收的最后 head 使用；
- Preview 通过后再决定 merge；
- merge 后单独验 Production。

---

## 13. 完成定义

这项改造只有同时满足以下条件才算完成：

1. 第一次打开 capability exploration 的人不用知道 Harness201、G3、7/8、256、component 等内部历史，就能理解为什么现在有两张地图；
2. 第一张地图能回答“第一轮做了什么、7B 学到了什么、3B 暴露了什么、为什么重设计”；
3. 第二张地图能回答“新版从哪里重新开始、为什么重采 Stage1、MiniMax 的角色是什么、老师什么时候退出、Stage2 怎样继续”；
4. 64-component capacity amendment 在主谱系上，普通 runtime 修复在 patch lane；
5. Server/Kaggle 不因执行位置不同被误画成科学分支；
6. 旧页面 / 旧结果仍可访问，不通过删除历史来制造简洁；
7. current / historical / stopped / future 状态不依赖颜色单独表达；
8. iPhone 没有横向溢出，地图等级仍可读；
9. zh/en 的信息架构一致；
10. current scientific claims 经过 `openevo-experiment` 刷新；
11. repository Gate / build / browser matrix 通过；
12. Vercel Preview 对真实 changed routes 完成验收；
13. 如果合并，Production 另行验证，不把 Preview READY 当 Production acceptance。

---

## 14. 不在本次改造里擅自决定的事情

这份网站方案不能替科学实验做决定。以下内容如需改变，必须回到 `openevo-experiment` 的 scientific authority / amendment：

- Stage1 sampling / task schedule / rollout budget；
- MiniMax teacher budget / prompt contract；
- Stage2 selector / threshold；
- effective-rank cap；
- rank reduction / compression 是否激活；
- final evaluation protocol；
- 任何 current lineage 的 resume / stop / activation。

网站只负责把已经有 authority 的研究事实和因果关系解释清楚。
