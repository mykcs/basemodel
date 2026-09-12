# Gated-Delta SD-LoRA 网站重构实施计划 — 2026-09-12

Status: **EXECUTION PLAN / CHECKLIST — NOT SCIENTIFIC AUTHORITY**
Owner task: BaseModel publication / information architecture
BaseModel branch: `research/gated-delta-page-restructure-20260912`
BaseModel initial discovery start: `a5dc1ec3f9f2afd1dd6af52d49ce1bc3e3be2e4f`
BaseModel implementation base after A1 refresh: `05fffea30fd90819572dca52eee1f911e4ded707`
Scientific source branch: `mykcs/openevo-experiment/research/gated-delta-sd-lora-event-write-202609120918`
Scientific source head checked at plan creation: `4dc70ccbfe52d25863461bb3be34c16da8efa291`
Scientific consolidation PR: `mykcs/openevo-experiment#461`

## 0. 这份计划负责什么

本文件是本次 BaseModel 网站施工的唯一任务 checklist。它保证即使聊天上下文丢失，新的 Agent 也能从 GitHub / worktree 恢复施工。

它不拥有新的 Gated-Delta 科学事实。任何“当前 / 已证明 / 已冻结 / 已启动 / 已完成”的科研状态，仍必须在发布前从 `mykcs/openevo-experiment` 的实际科学分支、evidence 与 preregistration 重新读取。

用户要求的核心产品约束只有两条：

1. **一个子网页只讲一个事情。**
2. 当前 Gated-Delta 页面先说清：以前本地实现的 GDR-v1 是 candidate admission gate；现在真正想研究的是 recurrent SD-LoRA parameter-state write。旧 GDR-v1 / DirectApply 实验细节放到另一个子网页。

## 1. 当前问题

现有 `/research/seed-openevo/study/capability-exploration/gdr-directapply/` 同时承担了太多职责：

- 历史 GDR-v1 的 44 candidates → 7 updates；
- DirectApply / No-GDR 对照；
- 原始 Gated Delta Rule 公式；
- Task Vector 的角色；
- DirectApply 固定同题诊断与 final；
- Round-0 matching；
- Ray / GPU / controller handoff；
- 工程经验；
- 当前 Gated-Delta successor 的思考。

这些内容单独都可能正确，但组合以后没有单一 reader task。读者必须不断在“旧实验”“论文机制”“新推导”“工程 provenance”之间切换，视觉上也形成多个同权重中心。

本次目标不是继续往旧页追加内容，而是重新分配 route ownership。

## 2. 信息架构决定

### 2.1 当前机制页：新建 canonical route

中文：`/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/`

英文：`/en/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/`

这页只回答：**“我们真正想做的 Gated-Delta SD-LoRA 是什么，以及这个定义怎样被一系列失败/通过的推导逼出来？”**

第一屏必须在 5–10 秒内让没有项目历史的读者得到这三个事实：

- 以前的本地 GDR-v1 是训练完 candidate 以后再做外部 16-task 放行判断；
- 现在研究的 Gated Delta 是 learning event 直接驱动 recurrent parameter-state write；
- 想看旧 GDR-v1 / DirectApply 实验，应去历史页，而不是在当前机制页继续读旧实验账本。

### 2.2 历史实验页：保留现有 route

继续使用：`/research/seed-openevo/study/capability-exploration/gdr-directapply/`

这页只回答：**“历史本地 GDR-v1 / DirectApply 实验到底做了什么，以及为什么它促使我们重新研究真正的 Gated Delta？”**

它保留 44→7、16-task probe、DirectApply、同题诊断、final-panel 边界等历史实验事实，但不再承担当前 Gated-Delta 数学推导。

历史页顶部应给一个清楚但次级的链接：`查看现在真正研究的 Gated-Delta SD-LoRA →`。

### 2.3 不再允许双重 owner

- 当前机制推导只由 `gated-delta-sd-lora/` 完整解释；
- `gdr-directapply/` 只能给当前机制一段最小上下文 + 链接；
- briefing、Vanilla SD-LoRA、Q17 analysis 等页面只保留满足自身 reader task 的一两句摘要 + canonical link；
- 不复制整套公式、D0 推导时间线或旧实验 funnel 到多个 route。

## 3. Page Expression Brief — 当前机制页

**Reader**：懂基本机器学习 / LoRA，但不了解本项目历史的学生、老师或研究者。

**Page role**：当前 Gated-Delta SD-LoRA 机制与科学推导的 canonical explainer；不是旧实验结果页，也不是执行 runbook。

**Starting state**：读者知道“我们以前叫过 GDR”，但不知道旧 gate 为什么不等于杨松霖/FLA 的 Gated Delta，也不知道 SD-LoRA 版本现在推导到哪里。

**Target mental model**：

`learning event -> factor-local causal signals -> optimizer-aware write state -> first-generation Gated Delta recurrence -> recurrent LoRA-factor State`

Task Vector 位于 runtime path 之外，只做 retrospective/offline/post-hoc 工作。

**Primary path**：概念纠正 → 原始 recurrence → Task Vector 退出 runtime → causal write 怎样被找到 → factor state 放在哪里 → beta/g 当前结论 → D1 当前边界。

**Secondary depth**：D0.5–D0.25 exact statuses、数值、hash、PR、evidence JSON、实现路径统一放在 claim-local `<details>` / Evidence 区。

**Semantic shape**：纵向科学推理链 + 两个关键机制图，不使用 dashboard 式卡片墙。

**Next action**：读者要么打开历史 GDR-v1 / DirectApply 页，要么展开 exact evidence / upstream preregistration。

## 4. 科学内容快照与发布边界

本计划创建时，`openevo-experiment` 的 active scientific branch exact head 为 `4dc70ccbfe52d25863461bb3be34c16da8efa291`。该 head 已经明显晚于现有 BaseModel 页面所写的“具体映射仍在设计”。

发布前必须重新读取该 branch / successor 的 live head；下面只是本次施工的**起始快照**，不是永久 current truth：

- D0.5：generic pooled hidden-state `x_t` 失败，不能继续把 `TARGET_MEAN / TARGET_LAST` 当 runtime event representation；
- D0.6：真实 activation + output error 可以精确分解 instantaneous supervised gradient；
- D0.7–D0.9：raw gradient / full-event raw gradient / isolated fresh component 都不足以代表 realized SD-LoRA write；
- D0.10–D0.16：bitwise shadow replay、optimizer trajectory、AdamW causal reconstruction 与 causal low-rank write teacher 逐步补齐 realized write；
- D0.17–D0.19：native rank-8 factor-local geometry 与 factor-state identity bridge PASS，recurrent state 可以直接放在 coefficient-folded LoRA factor state；
- D0.20–D0.21：建立 cross-round teacher split 与 prospective runtime-policy boundary；
- D0.22：learned beta 可从 causal supervised update-local state 预测，不需要 Task Vector / score / probe；
- D0.23：nonzero decay signal gate 失败，因此第一版 D1 固定 `g=0`；
- D0.24：beta-policy checkpoint 冻结并进入 first D1 preregistration；
- D0.25：runtime-policy smoke PASS；本计划创建时仍需以最新 upstream authority 判断 remaining implementation launch blockers。

网站不得把上述 qualification 链写成“Gated Delta 已经提高 WebShop”。这些结果证明的是**机制身份、因果可构造性、状态位置与第一版 treatment contract 的收敛**；正式 D1 在线效果必须等真实实验结果。
## 5. 当前机制页的内容结构

### 5.1 首屏：只完成一次概念纠正

H1 建议使用稳定主题名：`Gated-Delta SD-LoRA`。

首段直接给事实，不用“这页将会讲……”：

> 我们之前叫 GDR-v1 的实现，是先把 SD-LoRA candidate 训练完，再用固定 16 题小测决定 candidate 能不能进入下一轮。现在研究的 Gated Delta 放在更内层：learning event 直接产生 recurrent parameter-state write。

首屏只保留一个次级历史入口：`查看历史 GDR-v1 / DirectApply 实验 →`。

首屏不得出现 44→7 大数字 funnel、DirectApply final、GPU/Ray handoff、D0 编号墙、完整 provenance 表；这些都会抢走当前机制页的唯一认知中心。

### 5.2 原始 Gated Delta recurrence

用一个 browser-native mechanism figure 表达真正的 recurrence，节点和 connector 必须是真实视觉关系，不能只用一行 `→` 字符：

`current event representation -> k / v / beta / g -> read old State -> residual -> gated write -> next State`

公式保持紧凑：

`S_tilde = exp(g_t) S_(t-1)`

`r_t = v_t - S_tilde k_t`

`S_t = S_tilde + beta_t * write(k_t, r_t)`

正文解释语义；转置方向按具体矩阵 orientation 处理，不能把一种排版约定冒充唯一数学定义。
### 5.3 Task Vector：退出 runtime causal path

这一段只回答一个问题：**为什么 Task Vector 仍然有用，但不能再充当 runtime GDR 控制量。**

可见主线写：

- Task Vector 描述参数状态实际移动了多少、朝哪里移动；
- 它帮助我们发现 Vanilla / DirectApply 的 recurrent geometry；
- 它可以继续作为 retrospective geometry、offline teacher/label 或 post-hoc evaluation；
- 它不能直接生成 runtime `K/V/beta/g`，也不能变成 disguised candidate-admission gate。

不得再写“Agent learning event → x/K/V/beta/g 映射仍完全未解决”这种已经过时的总括句。应按最新 scientific branch 区分：**哪些 bridge 已关闭、哪些 treatment choice 仍开放、哪些 D1 launch gate 仍未通过。**

### 5.4 科学推导主线：按“认知转折”组织，不按 D0 编号堆日志

主阅读路径最多保留 6–8 个转折节点，每个节点只显示：`当时的假设 -> 结果 -> 这让下一步怎么变`。

建议合并为：

1. **Generic hidden state 不够**：D0.5 FAIL，放弃 pooled-hidden `x_t` 方案；
2. **真实 learning event 里存在 local Delta geometry**：D0.6 PASS；
3. **instant/raw gradient 不等于 realized SD-LoRA write**：D0.7–D0.9 FAIL；
4. **optimizer history 是缺失的因果状态**：D0.10–D0.16 把真实 write 还原出来；
5. **State 就在 LoRA rank-8 factors 里**：D0.17–D0.19 PASS；
6. **runtime gate 收敛到 learned beta + identity decay**：D0.20–D0.24，beta 可预测，nonzero `g` 未获证据，第一版固定 `g=0`；
7. **实现资格与 D1**：显示最新 upstream launch gate 状态，不提前写结果。

D0 exact 编号、指标、阈值和 SHA 放到节点自己的 `<details>`，不要作为 H2/H3 目录。
### 5.5 当前 runtime picture

当前机制页需要第二张、也是最后一张核心图：只画**现在已经冻结到什么程度**。

按发布时最新 upstream authority，目标结构应近似：

`supervised learning event`
`-> factor-local activation / error or equivalent clipped factor gradients`
`-> current A / C^T state + prior optimizer memory`
`-> frozen beta policy`
`-> first-generation Gated Delta recurrence (first D1: g = 0)`
`-> next recurrent LoRA-factor state`

必须在图旁边直接写清楚三条禁止输入：Task Vector、WebShop score/reward、candidate probe/future state 不进入 runtime control path。

如果发布前 upstream 已进一步推进 D1 implementation qualification 或正式 launch，必须刷新这张图的状态标签；如果只完成 qualification，不能写成“正在训练”或“已经提升性能”。

### 5.6 页面结尾

结尾只保留：

- 当前支持的机制结论；
- 当前尚未证明的事情；
- 上游 scientific authority / preregistration 的 claim-local 链接；
- 一个历史页入口。

不要加入“六条工程经验”“GPU handoff”“controller recovery”“完整 SHA 墙”。需要审计的 hash / exact artifact 可以放一个最终 `<details>`，但不得成为页面主体。
## 6. 历史 GDR-v1 / DirectApply 页的收缩规则

`gdr-directapply/` 保留旧 route，避免破坏已有外链；但它的 reader task 改成“历史实验到底做了什么”。

保留：

- 44 SD-LoRA candidates → 7 accepted updates；
- 16-task task-score probe 的实际 admission semantics；
- DirectApply / No-GDR 移除了哪一层 veto；
- matched controls / Round-0 semantic matching 中真正影响 causal interpretation 的最小证据；
- DirectApply final 与“不同 frozen panel 不能直接做因果差”的边界；
- 链到 Q17 same-task diagnostics / final analysis 的必要入口。

移出主线或删除公开展示：

- 原始 Gated Delta Rule 的完整公式与当前推导链；
- Task Vector 当前机制页的完整解释；
- Ray/GPU/controller handoff timeline；
- 六条工程规则；
- 与“旧 gate 实验做了什么”无直接关系的 deployment/resource provenance。

历史页首屏不再承担当前机制解释；只用一段简短 correction + 一个链接把读者送到新的 canonical `gated-delta-sd-lora/`。
## 7. 代码级改动清单

### 7.1 新增当前机制页 owner

新增组件：

`src/components/research/OpenEvoGatedDeltaSdLoraExplainer.astro`

职责：只渲染当前 Gated-Delta SD-LoRA mechanism / derivation narrative，不承载历史 GDR-v1 运行账本。

新增中文 route：

`src/pages/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/index.astro`

新增英文 route：

`src/pages/en/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/index.astro`

route metadata 使用短主题标题；description 只描述当前机制和推导，不混入 44→7 历史结果。

### 7.2 新增 publication snapshot data owner

优先新增：

`src/data/gatedDeltaSdLoraPublicationSnapshot.ts`

用于集中保存本次静态网站实际引用的：scientific branch、checked head、checked time、current qualification milestones、D1 state、claim boundaries 和 upstream links。

组件不得把可变化的 scientific status 散落硬编码在多个段落里。
### 7.3 收缩历史页 owner

修改：

`src/components/research/OpenEvoGdrDirectApplyExplainer.astro`

目标不是重写历史数字，而是删掉与历史实验 reader task 无关的当前机制推导和资源/工程枝节；保留 claim-changing scientific boundaries。

修改中文 / 英文 `gdr-directapply/index.astro` metadata，使标题稳定为“历史 GDR-v1 与 DirectApply”语义，不再把 44→7 当整个研究项目的当前入口。

### 7.4 Reader Contract / capability route registry

修改：

- `src/data/siteReaderContracts.ts`
- `src/data/capabilityReaderRoutes.ts`

新增 `gated-delta-sd-lora` 的独立 reader contract。建议 `attentionMode = narrative`；`primaryTask` 只描述当前机制；`firstViewportGoal` 只描述概念纠正；`nextStep` 指向 evidence 或历史页。

现有 `capability-gdr` contract 改为历史实验角色：44→7、16-task admission、DirectApply 对照；不得继续声称它同时拥有原始 Gated Delta 的完整机制解释。

### 7.5 Discovery / sitemap / lobby

修改：

- `src/lib/sitemapRoutes.ts`
- `src/lib/sitemapRoutes.test.ts`
- `src/components/research/OpenEvoCapabilityMapLobby.astro`

Capability lobby 需要同时让读者看见“历史 GDR-v1 / DirectApply”与“当前 Gated-Delta SD-LoRA 推导”是两个对象，但不能做成两个同权重、重复解释的卡片墙。优先用一个当前研究入口 + 一个历史参考入口。
### 7.6 Sibling links / stale-copy audit

至少检查并按语义改链接：

- `src/components/research/OpenEvoVanillaSdLoraMechanism.astro`
- `src/components/research/OpenEvoQ17DirectApplyAnalysis.astro`
- `src/components/research/OpenEvoQ17FrontierRoadmap.astro`
- `src/components/research/SeedOpenEvoProgressBriefing.astro`
- `src/components/research/SeedOpenEvoBriefingTechnicalNotes.astro`

链接规则：

- “candidate 为什么被接受/拒绝、44→7、DirectApply” → 历史 `gdr-directapply/`；
- “真正的 recurrent Gated Delta / factor state / beta/g / current derivation” → `gated-delta-sd-lora/`；
- sibling 页面不复制完整推导，只保留满足自身任务的 1–2 句上下文。

若 briefing 中仍有“映射完全未冻结”等被 upstream 新证据淘汰的 current-facing 句子，必须同步修正；历史 dated slide / historical evidence 不因新推导而被回写。

### 7.7 Tests

新增或更新 focused source/structural tests，至少保护：

- 新 route 中英文都存在且指向同一 current mechanism owner；
- `gdr-directapply` 与 `gated-delta-sd-lora` 各自只拥有自己的 reader task；
- current page 首屏存在历史纠正 + 历史页链接，但不出现 `44 candidates` metric wall / Ray handoff；
- current page 明确 `Task Vector` 不进入 runtime K/V/beta/g；
- current page publication snapshot 带 scientific branch/head/check time；
- historical page 不再包含 current Gated Delta 完整 recurrence / D0 derivation timeline；
- sitemap / capability route registry / Reader Contract 覆盖新 route；
- 中英文关键科学极性一致。
## 8. 视觉与交互约束

### 8.1 当前机制页必须做减法

禁止把现有页面原样拆成“更多卡片 + 更多 section”。目标是减少同时竞争注意力的中心。

默认视觉结构：

- 一个窄正文 column；
- 两张核心机制图；
- 一条纵向 reasoning timeline；
- claim-local evidence disclosures；
- 少量 inline status，不做 metric dashboard。

避免：六列数字卡、三列 Known/Unknown 卡墙、多个大表、装饰性 gradient、重复 eyebrow、每个 D0 都单独一个同权重 box。

### 8.2 图必须表达真实结构

两张图分别负责：

1. original / adapted recurrent write 的内部结构；
2. 当前 qualified SD-LoRA factor-state runtime path。

用 semantic HTML nodes + CSS Grid + inline SVG connectors。中文/英文 DOM reading order 必须一致；reduced-motion 下仍完整可读。

### 8.3 Evidence 层

每个科学转折自己的 `<details>` 只放最贴近的 exact evidence：D0 status、关键数值、upstream source、commit/PR、必要 hash。

不要在页面底部再复制一个巨型 provenance wall；全局 source snapshot 可以有一个 compact final disclosure。
## 9. Human Preference Learning / cold-read 要求

在第一轮页面代码施工前运行 task-time preference retrieval / brief，query 至少覆盖：

`Gated Delta 机制推导 单页单问题 ADHD 注意力 去 AI 味 科研叙事 公式 失败实验`

使用当前 mechanism-page Reader Contract；如果新 contract 尚未落代码，可先用最接近的 research-copy / capability scope，并在 contract 创建后重新生成一次。

至少生成 2 个内部表达候选，不把所有候选都交给 owner：

- Candidate A：纯纵向 scientific reasoning narrative；
- Candidate B：reasoning narrative + 更强机制图，但仍只有一个主路径。

选择标准不是“更漂亮”，而是第一次来的读者能否更快回答：

1. 以前的 GDR-v1 错在哪一层？
2. 现在真正研究的 recurrent write 是什么？
3. Task Vector 为什么退出 runtime path？
4. 目前推导已经确定到哪里？
5. 还没有证明什么？

必须执行 Phase A blind cold read，再做 Phase B preference compare；不能只因为 automated budget PASS 就宣布理解性完成。
## 10. 实施顺序

严格按下面顺序施工；每一步完成后把对应 checkbox 改为 `[x]` 并留下证据。

### Phase A — durable plan / authority freeze

- [x] A1. 重新读取 BaseModel `main`、本 branch dirty state、open overlapping PR；若 main 有重叠移动，先分类再继续。
- [x] A2. 重新读取 active Gated-Delta scientific branch / PR #461 exact head、D1 decision/prereg/evidence；把发布 snapshot 的 source head 更新到最新实际值。
- [x] A3. 完成本计划 Markdown，`git diff --check` PASS。
- [ ] A4. 只提交这份计划作为第一个 commit，并 push 到 `research/gated-delta-page-restructure-20260912`；记录 exact commit SHA。

### Phase B — reader contract / HPL before UI

- [ ] B1. 为新 `gated-delta-sd-lora/` route 创建 Reader Contract，并把旧 `capability-gdr` contract 收缩为历史实验职责。
- [ ] B2. 运行 repository-owned preference brief/retrieval，保存 task-local receipt，不把临时路径写进 public copy。
- [ ] B3. 形成 2–3 个内部表达方案并完成 pairwise screening；选定一个后才开始完整实现。

### Phase C — current mechanism canonical page

- [ ] C1. 新建 `gatedDeltaSdLoraPublicationSnapshot.ts`，绑定 scientific source branch/head/checkedAt/status/links。
- [ ] C2. 新建 `OpenEvoGatedDeltaSdLoraExplainer.astro`，实现首屏概念纠正。
- [ ] C3. 实现原始 Gated Delta recurrence 图。
- [ ] C4. 实现 Task Vector runtime-boundary 段。
- [ ] C5. 实现按认知转折压缩后的 derivation timeline，并给每个节点 claim-local evidence `<details>`。
- [ ] C6. 实现当前 factor-state runtime picture 与 D1 boundary。
- [ ] C7. 新建 zh/en route 与 metadata。### Phase D — historical page separation

- [ ] D1. 收缩 `OpenEvoGdrDirectApplyExplainer.astro`：保留旧 GDR-v1 / DirectApply 科学事实，移除 current Gated-Delta 完整推导。
- [ ] D2. 移除/下沉 Ray/GPU/controller handoff 与工程经验等非核心历史实验内容；若仍需保留审计入口，只允许 compact technical disclosure / external provenance link。
- [ ] D3. 修改 zh/en historical route metadata；顶部加入清晰的 current mechanism canonical link。
- [ ] D4. 确认历史数字、final-panel boundary 与原有 source provenance 没有被“为了简化”改写。

### Phase E — discovery / sibling consistency

- [ ] E1. 更新 `capabilityReaderRoutes.ts`、Capability lobby 与 sitemap。
- [ ] E2. 更新 Vanilla SD-LoRA / Q17 analysis / frontier 等链接，让 historical admission 与 current mechanism 各指向正确 owner。
- [ ] E3. 审计 briefing / technical notes 的 current-facing GDR 句子；只修 stale current claim，不重写 dated history。
- [ ] E4. 全仓搜索 `gdr-directapply`, `GDR-v1`, `Gated Delta Rule`, `Task Vector`, `β`, `g=`，确认没有第二个完整 owner 或过时 current claim。

### Phase F — source / structural validation

- [ ] F1. `git diff --check` PASS。
- [ ] F2. `npm run check` PASS，0 errors。
- [ ] F3. focused structural/unit tests PASS，包括新 route ownership / scientific polarity / snapshot provenance。
- [ ] F4. `npm run audit:copy:strict` 0 invariant failures。
- [ ] F5. `npm run audit:reader-contracts` PASS；所有新增公开 route 都有 contract。
- [ ] F6. `npm run audit:human-feedback` PASS。
- [ ] F7. `npm run preflight:ui:plan`，按实际 risk 执行 repository-owned pre-provider Gate，不手工挑轻量测试来规避 full/shared classification。

### Phase G — browser / visual acceptance

- [ ] G1. 中文 + 英文 current page 在 390 / 768 / 1440px 检查 page-level overflow、长公式、evidence disclosure、connector geometry。
- [ ] G2. 中文 + 英文 historical page 同样检查 390 / 768 / 1440px，确认删减后没有新的空洞或视觉漂移。
- [ ] G3. light / dark theme 都通过；颜色不能承担唯一语义。
- [ ] G4. Chromium + WebKit 覆盖 current page 和 historical page 的核心 layout / navigation / disclosure。
- [ ] G5. reduced-motion 下两张机制图仍然完整表达方向；JS 禁用时静态 HTML 仍可理解核心机制。
- [ ] G6. Reader Contract first-viewport budget 在 desktop 1280×633 与 phone 390×844 都 PASS，且不是靠 `100vh` 空白作弊。
- [ ] G7. 做人工/Agent Phase A blind cold read：5–10 秒内回答“这页讲什么、最重要事实、下一步去哪”；保存 receipt。

### Phase H — exact-head publication

- [ ] H1. 发布前再次刷新 BaseModel `main` 与 upstream Gated-Delta scientific head；若 scientific state 前进，只更新 current snapshot / current-facing copy，不篡改历史页面。
- [ ] H2. rebase / reconcile current `main` 只在语义兼容时进行；遇到 overlapping research-page PR 先 cold-read semantic delta。
- [ ] H3. commit/push final candidate；PR body 写清 Page Expression Brief、route ownership、scientific source head、validation evidence。
- [ ] H4. ordinary public GitHub Actions PR preflight PASS。
- [ ] H5. owner 需要视觉复核时先用 review-only Preview；只有 merge-ready candidate 才触发 `ci/vercel-gate-final`。
- [ ] H6. exact-head Vercel required check PASS，打开托管 current/historical 两个目标 route 做 real-route smoke。
- [ ] H7. merge 前重新确认 PR head / current main / upstream science freshness；使用 expected-head-safe merge path。
- [ ] H8. Production READY 后实际打开两个正式 route，确认 canonical/hreflang、核心 copy、历史/current 交叉链接与 200 状态。

## 11. 验收标准（Definition of Done）

只有同时满足下面这些条件，才允许把“网站重构完成”报告给 owner：

1. **单页单问题成立**：current mechanism page 不再承担旧 GDR-v1 experiment report；historical page 不再承担 current derivation。
2. **首屏可理解**：第一次来的读者不需要先解码 44→7、D0 编号或内部 run ID，就能知道旧 GDR-v1 与 current Gated Delta 的层级差异。
3. **科学状态新鲜**：current page 的 upstream branch/head/check time 与发布前实际读取一致；不能把旧 snapshot 写成 current。
4. **科学极性正确**：Task Vector 不进入 runtime control；`g=0` / learned beta / D1 状态按发布时 authority 精确表达；qualification 不升级成 benchmark gain。
5. **推理链可读**：D0.5 以后的一系列 PASS/FAIL 被压缩成认知转折；负结果保留其“为什么让下一步改变”的科学作用。
6. **视觉负担下降**：current page 没有 dashboard 式同权重卡墙；主线只使用必要的两张机制图 + reasoning timeline + local evidence。
7. **历史事实不被改写**：44 candidates / 7 accepted、16-task probe、DirectApply treatment、final-panel comparability boundary 保留正确含义。
8. **canonical ownership 清楚**：所有 sibling 页面只做摘要 + link，不再复制完整 current mechanism 或历史 funnel。
9. **双语等价**：中文和英文的机制、状态、禁止输入、未证明事项不出现极性差异。
10. **自动化与浏览器验收完整**：deterministic gate、reader contracts、copy/HPL、required browser matrix、exact-head Vercel、Production smoke 均有真实 PASS 证据。

不能用“文件存在”“本地 build 绿”“PR mergeable”“Vercel READY”中的任意一个单独替代上述完整完成条件。
## 12. 恢复 / 接管说明

如果聊天上下文丢失，新的 Agent 不需要重建本对话。恢复顺序：

1. 读取仓库根 `AGENTS.md` 与当前 task bundle；
2. 打开本文件，找到第一个仍为 `[ ]` 的 checklist；
3. `git fetch origin main`，记录当前 BaseModel `main` 与本 branch head / dirty state；
4. 重新读取 `mykcs/openevo-experiment` active Gated-Delta branch / PR #461 或其明确 successor，记录 exact scientific head；
5. 如果上游科学状态已推进，只刷新 current-facing publication snapshot 与相应文案；不要回写历史 GDR-v1 事实；
6. 如果 BaseModel `main` 改到了本任务计划中的同一文件，先做 semantic overlap cold-read，再 rebase / integrate；
7. 继续执行本计划，不重新设计 URL ownership，除非 owner 明确改变需求。

本计划的固定产品决定只有：**一个子网页只讲一个事情；`gated-delta-sd-lora/` 是 current mechanism canonical owner；`gdr-directapply/` 是 historical GDR-v1 / DirectApply owner。**

任何 D0/D1 数值、状态、SHA、launch blocker 都属于可刷新 scientific projection，不属于永久 IA 决定。

### A1/A2 首次刷新记录

- BaseModel `main`：`05fffea30fd90819572dca52eee1f911e4ded707`，已包含 #654 SD-LoRA scaling；#654 改到 lobby / capability route registry / Reader Contracts，因此后续实现必须以该版本为基础。
- Open PR #647：governance-only，改 `research-editorial-style.md` / history / policy test，不改产品 route；若在首次 public-copy implementation 前合并，重新读取最新 policy。
- Gated-Delta scientific branch：`research/gated-delta-sd-lora-event-write-202609120918`，首次刷新 exact head `4dc70ccbfe52d25863461bb3be34c16da8efa291`。
- 截止计划 first commit 前，**没有任何 `src/` 页面代码修改**；第一个 commit 必须只包含本计划文件。
