# OpenEVO × WebShop 实验区：Experiment-first 重组执行计划

状态：**COMPLETE / Definition of Done 已满足**
创建日期：2026-09-13  
仓库：`mykcs/basemodel`  
科学事实权威：`mykcs/openevo-experiment`  
目标路由：`/research/seed-openevo/study/`

> 本计划只重组 BaseModel 的读者入口和父子关系，不改写实验历史、不删除旧 URL、不把网站变成第二份实验真相数据库。

## 0. 用户目标

当前 Study / Capability Exploration 已同时把实验、结果、机制、历史入口、诊断页放在近似同一层级，读者很难先回答“我现在在看哪一次实验”。本次重组采用：**实验是树干，结果与分析是树枝。**

第一层固定为五个主要实验入口；进入一次实验后，再继续看它的结果、机制解释、诊断和派生分析。`Results / Capability / Stage1 / Stage2` 等内部分类继续保留旧 URL 和证据价值，但不再承担主要人类导航。

## 1. 五个一级实验单元

1. **训练跑了很久，但参数一直没有更新**  
   历史旧 Gate：成功轨迹存在，但最好只有 7 个不同任务满足重复成功条件，而规则要求 8 个，因此没有触发后续参数更新。
2. **7B 长周期实验**  
   7B 持续学习、参数更新、冻结终评与参数分析属于同一个实验单元。
3. **3B + 1.7B 后继实验**  
   在共享购物规则 / Harness 下，分别使用 3B 与 1.7B 做后继实验；接口诊断、研究报告和两条 arm 的结果挂在这里。
4. **1.7B · GDR-v1 实验**  
   本地 GDR-v1 实际是 SD-LoRA candidate admission gate；44 个 candidate 中 7 个正式进入后续状态。该 1.7B arm 同时属于第 3 项后继实验，但因其后来产生独立机制问题，允许作为一个主要入口重复引用，必须明确 lineage 关系。
5. **1.7B · DirectApply / No-GDR 实验**  
   去掉 GDR-v1 的 task-score veto；完整 160 轮、冻结 final、R127/R128 同题诊断、SD-LoRA latency/scaling、Text Memory 运行语义与 D1 等分析优先挂在这一单元下。

科学边界：历史 GDR final 与 DirectApply final 不是同一冻结题集，不得把 `60.72 - 37.60` 写成 GDR/DirectApply 的因果方法增益。

## 2. 第一阶段：最小可用 Experiment-first 首页

- [x] 新建 `src/components/research/OpenEvoExperimentIndex.astro`。
- [x] `/research/seed-openevo/study/` 中文入口只渲染新的 Experiment-first 目录。
- [x] `/en/research/seed-openevo/study/` 使用同一组件和同一层级。
- [x] 五个一级实验全部在目录中可见、可点击。
- [x] 派生分析使用缩进子链接表达父子关系，不再与实验入口平级。
- [x] `SD-LoRA 为什么越来越慢` 挂在 DirectApply / No-GDR 实验下面。
- [x] GDR-v1 入口明确写出它同时属于 3B + 1.7B 后继实验，避免伪造独立 lineage。
- [x] 保留旧 `capability-exploration/*`、`results/*` 等 URL；本阶段不移动、不删除旧页面。
- [x] 保留跨实验的 Flow / Results / Run 入口，但降为二级工具入口。
- [x] 更新 `src/data/siteReaderContracts.ts`：Study 的首要任务变为“先选实验，再看结果/分析”。
- [x] Study 首屏明确允许五个一级实验入口，`maxInteractive=5`；不得通过隐藏第五个实验来满足旧预算。
- [x] 新增 `src/lib/openEvoExperimentIndex.test.ts`，保护五实验结构、缩进子链接和 SD-LoRA scaling 归属。
- [x] 更新已经过时的 Study owner / Text Memory / heading tests，使测试保护新的 Experiment-first 信息架构，而不是强行恢复旧首页。

## 3. 第二阶段：把现有页面完整挂回实验树

逐页盘点 `src/pages/research/seed-openevo/study/**` 以及对应英文页面。每个读者可见研究页必须归类为：`experiment-result`、`experiment-analysis`、`cross-experiment`、`historical/archive` 或 `compatibility`。

- [x] 建立一份机器可读的实验 → 子页面映射，优先放在 `src/data/`，避免长期把关系硬编码散落在组件中。证据：`src/data/openEvoExperimentNavigation.ts` 现在集中拥有五个实验、`primaryHref`、带语义 `role` 的 `childLinks`、lineage 与 status；`OpenEvoExperimentIndex.astro` 已改为从该数据 owner 渲染。定向 Vitest 7/7 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints）。
- [x] Gate 失败实验至少覆盖 `stage2-256-window` 与相关 first-run 历史证据。证据：`OPEN_EVO_EXPERIMENTS[id=gate-no-update]` 以 `stage2-256-window` 为 primary/analysis，并以 `first-run` 为 history child；`openEvoExperimentIndex.test.ts` 对这两个语义归属做结构回归。
- [x] 7B 长周期实验至少覆盖 `stage2-ceiling`、`stage2-7b-analysis` 及真正属于该实验的 SD-LoRA/参数分析。证据：`OPEN_EVO_EXPERIMENTS[id=7b-long-run]` 以 `stage2-ceiling` 为 primary/result，并把 `stage2-7b-analysis` 明确标成 `7B SD-LoRA / 参数变化分析`；结构测试同时验证该分析页实际包含“7B 已发生真实参数更新”和“SD-LoRA 参数更新”的参数证据。定向 Vitest 9/9 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints）。
- [x] 3B + 1.7B 后继实验至少覆盖 `openevo-2-0`、`report`、`exploration`、Harness/interface 诊断。证据：`OPEN_EVO_EXPERIMENTS[id=successor-3b-1p7b]` 以 `openevo-2-0` 为 primary/result，并把 `report` 标为 evidence、`exploration` 与 `harness-2-0` 标为 diagnostic；结构测试验证四个子入口以及 Harness 页面确实是购物接口历史对照实验。定向 Vitest 17/17 PASS，`npm run check` 与 `npm run build` PASS（506 routes，单 H1 / brand-link audits PASS），Study Reader Contract Chromium desktop/phone/briefing 3/3 PASS。
- [x] GDR-v1 实验至少覆盖冻结结果、44→7 candidate admission 分析、Vanilla SD-LoRA candidate 机制和 GDR-v1 / 原始 Gated Delta Rule 区分。证据：`OPEN_EVO_EXPERIMENTS[id=gdr-v1-1p7b]` 现在分别提供 result=`openevo-2-0/report`、analysis=`gdr-directapply`、mechanism=`vanilla-sd-lora`，并用 `gdr-directapply/#original-gated-delta` 直接指向本地 candidate-admission GDR-v1 与原始 recurrent Gated Delta Rule 的区别；结构测试同时核验 37.60 / 1/128 冻结结果、44→7 证据、candidate 训练边界和 original-rule section。定向 Vitest 6/6 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints），`npm run build` PASS（506 routes，单 H1 / brand-link audits PASS）。
- [x] DirectApply / No-GDR 实验至少覆盖完整 160 轮分析、R127/R128、SD-LoRA scaling/history 系列、Text Memory、D1/geometry/function-preservation 等已公开分析。证据：`OPEN_EVO_EXPERIMENTS[id=directapply-1p7b]` 现在提供完整 160 轮分析、R127/R128 同题诊断、`sd-lora-scaling`、`sd-lora-history` 专题入口、Text Memory，以及 `q17-directapply-analysis/#geometry` 与 `#function` 两个 D1 锚点；history 专题仍明确显示“没有完成的科学实验不会提前写成结论”，因此未来骨架没有被冒充成已完成结果。定向 Vitest 7/7 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints），`npm run build` PASS（506 routes）；生成后的中英文 Study HTML 都实际包含 D1 `#geometry` / `#function` 与 `sd-lora-history/` 链接。

## 4. 第三阶段：统一导航与页面归属表达

目标不是把旧页面全部搬目录，而是让读者从任何实验页都能回答：**我在哪次实验里、这是结果还是分析、下一步回哪里。**

- [x] 为五个实验建立统一的实验 Hub / context 结构；优先复用一个共享组件，不在每页复制导航 HTML。证据：现有 `ResearchRouteContext.astro` 新增类型化 `experimentId`，统一渲染“实验目录 / 所属实验 / 当前页面”层级并暴露 `data-experiment-id`；五个 canonical 实验入口的中英文页面都显式绑定对应 experiment id，没有新建第二套导航组件。定向 Vitest 9/9 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints），`npm run build` PASS（506 routes）；真实浏览器核验 GDR-v1 桌面与 DirectApply 390×844 手机页面均显示正确 experiment id / breadcrumb 且无 root overflow。
- [x] 每个实验 Hub 至少包含：实验名称、为什么做、实验结果入口、由该实验引出的分析、原始证据/历史入口。证据：`src/data/openEvoExperimentNavigation.ts` 为五个实验统一增加 `motivation` 与显式 `evidenceLink`，并继续复用既有 `title / primaryHref / childLinks`；`ResearchRouteContext.astro` 只在 canonical experiment Hub 上用一个渐进展开的共享 `<details data-experiment-hub>` 从同一数据 owner 渲染“实验结果 / 分析与机制 / 原始证据与历史”，Hub 的 purpose 直接回答“为什么做”。结构 Vitest 10/10 PASS；`npm run check` 0 errors / 0 warnings（Playwright report 生成物带来 195 个非源码 hints）；`npm run build` PASS（506 routes、单 H1 与 external-brand audits PASS）；Chromium 定向回归覆盖中英文 `all declared routes` 与 `every experiment hub` 共 4/4 PASS，并修正了旧测试仍强制返回 Capability 大厅的过时假设。
- [x] 现有 `ResearchRouteContext.astro` / capability reader map 若承担相同职责，优先改造或复用，避免第二套导航系统。证据：实验上下文继续由同一个 `ResearchRouteContext.astro` 渲染，并同时读取既有 `CAPABILITY_READER_ROUTES` 与 `OPEN_EVO_EXPERIMENTS`；没有新增第二个 Experiment Hub 导航组件。`openEvoExperimentContext.test.ts` 明确锁定这两个数据 owner 与共享组件。为修复该共享 context 带来的英文 `openevo-2-0` 首屏回归，compact Hub 将完整“为什么做”放入同一个渐进展开区，顶部继续使用短 purpose；结构 Vitest 10/10 PASS，1280×633 中英文 orientation 2/2 PASS，按 GitHub CI 相同计划重跑 browser shard 3/4 为 53/53 PASS。
- [x] 子分析页提供返回所属实验的明确入口；跨实验页面可链接多个实验，但只能有一个 canonical 内容 owner。证据：`src/data/openEvoExperimentNavigation.ts` 新增 `OPEN_EVO_CANONICAL_ROUTE_OWNERS`，为 Gate failure、7B、3B+1.7B、GDR-v1、DirectApply 派生页声明唯一 canonical experiment owner；`ResearchRouteContext.astro` 自动读取该映射，子页统一显示“实验目录 / 所属实验 / 当前页”，因此跨实验可继续链接同一机制页，但 breadcrumb/content ownership 不再含糊。`sd-lora-scaling` 中英文页补回缺失的共享 context；`archive` 与 `stage1-previous` 故意保持未归属，留给下一项历史/证据降级处理。结构 Vitest 11/11 PASS；Chromium 对中英文全部 canonical-owned child route + 五个 Hub 的定向回归 4/4 PASS。CI correction witness：trigger=`fc513e6` Public PR CI run `34725814300` 的 browser shard 1/2 仍把完整 experiment motivation 锁在 compact top purpose；current owner=`ResearchRouteContext` + `reader-journey` Hub contract；checked artifact=该 run 的真实 failure + `[data-hub-motivation]`；allowed next action=让测试在展开 Hub 内核验完整 motivation，同时保留首屏短 purpose；invalidation cue=若 full motivation 不再由 Hub 持有或首屏 reader-budget contract 改变则重新评估。
- [x] `archive`、`stage1-previous`、兼容性入口降到历史/证据层，不再与五个主要实验抢同级注意力。证据：刷新并合入当时最新 `origin/main@cda12b31a7260f0461816ce7135a753df822d2bb` 后，`OpenEvoCapabilityMapLobby.astro` 将 `stage1-evolution` 旧书签从 focused research map 移入 `data-archive-tier="history-evidence"`，并明确说明这些入口只用于证据追溯、不是新的主要实验；`archive` / `stage1-previous` 继续没有 canonical experiment owner。结构 Vitest 12/12 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints），`npm run build` 506 routes + single-H1 / brand-link audits PASS，Chromium `openevo-two-map.spec.ts` 95/95 PASS。该浏览器回归同时纠正了旧 reader test 的泛化 `[data-reader-context]` selector：contextualized route 只核验真正带 `data-reader-route` 的共享 `ResearchRouteContext`，避免 `sd-lora-scaling` 上任务说明组件与实验 breadcrumb 的合法共存被误判为 strict-mode 冲突。
- [x] `flow/*` 继续负责“系统/方法怎么工作”，不混入实验历史树；实验页按需链接过去。证据：`OPEN_EVO_METHOD_BACKGROUND_ROUTE` 将 `/research/seed-openevo/flow/` 明确建模为独立的 system/method background，并由 Study 的跨实验入口与 canonical experiment Hub 的 `data-hub-method-background` 单独链接；五个实验的 `primaryHref / childLinks / evidenceLink` 均禁止指向 `flow/*`。`openEvoExperimentIndex.test.ts` 增加结构回归，锁定 flow 不进入实验历史树；结构 Vitest 13/13 PASS，`npm run check` 0 errors / 0 warnings（2 个既有 deprecation hints），`npm run build` 506 routes + single-H1 / brand-link audits PASS。真实浏览器打开 DirectApply Hub 并展开后确认方法入口 href=`/research/seed-openevo/flow/`，仍只有 result / analysis / evidence 三个实验分组，且无 root overflow。
  - CI correction witness（继续复现上一 exact head `1a0b005`）：trigger=`Public PR CI #212` 的 browser shard 1/4 与 2/4 失败；current owner=`tests/e2e/openevo-two-map.spec.ts` / `reader-journey.cases.ts` 等由 `ci-ui-test-list` 实际分配到这两个 shard 的浏览器合同；checked artifact=GitHub run `34730943492` 的 provider job 状态与本地 canonical shard list（各 53 tests）；本地 shard 1 已复现真实失败为 `capability-sd-lora-scaling` 首屏 result 被过长 compact context 推到 633px 首屏以下；allowed next action=保留实验归属，将该 route 的 compact purpose 收窄为一行；desktop 首屏已恢复，随后 shard 2 复现 phone budget=4 个有意义交互目标而旧合同为 3，因此仅把该 route 的显式 `maxInteractive` 调为 4，不删除 canonical experiment return；invalidation cue=若新 head 改变 canonical test list / shard assignment、首屏再增加交互目标，或 provider 失败转移到不同 job，则重新取证。
- [x] `results/*` 继续作为跨实验结果索引，不重复拥有五个实验的正文。证据：`OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE` 现在把 `/study/results/` 明确建模为 `cross-experiment-results` secondary route；Study 目录渲染 `data-secondary-route` 供结构验收；`openEvoExperimentIndex.test.ts` 强制五个实验的 primary / child / evidence 与 canonical owner 均不得指向 `results/*`，并确认中英文 Results root 不导入五实验 navigation owner，因此 Results 保留跨实验汇总职责而不成为第二份实验正文；结构 Vitest 14/14 PASS，`npm run check` 与 `npm run build` PASS（506 routes，single-H1 / brand-link audits PASS）。
- [x] 中英文页面保持同一实验层级；英文不得新增中文没有的独立 IA。证据：中英文 `/study/` 都只渲染同一个 `OpenEvoExperimentIndex`，五实验层级、child role / href 与 canonical owner 只来自 `src/data/openEvoExperimentNavigation.ts`；新增 `openEvoExperimentContext.test.ts` 回归会逐一要求所有 `OPEN_EVO_CANONICAL_ROUTE_OWNERS` 在 zh / en 两侧都有对应 Astro route source，并要求每个实验 title / summary / child label 同时具备 zh / en 文案，避免英文另建独立 IA。Experiment-first 定向 Vitest 15/15 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints），`npm run build` 506 routes + single-H1 / external-brand audits PASS。

## 5. 页面与代码级实现约束

- [x] 新的实验树关系最终由 `src/data/` 的单一数据 owner 驱动，Study 首页和实验 Hub 从同一来源渲染。证据：`src/data/openEvoExperimentNavigation.ts` 是 `OPEN_EVO_EXPERIMENTS` 的唯一定义位置；`OpenEvoExperimentIndex.astro` 与 `ResearchRouteContext.astro` 都直接从该文件读取同一个 `OPEN_EVO_EXPERIMENTS`，前者用它渲染 Study 实验树，后者用它解析 Experiment Hub/context。新增 `openEvoExperimentContext.test.ts` 回归明确锁定两个组件的同源 import、`map/find` 消费方式与 owner 单一定义；Experiment-first 定向 Vitest 16/16 PASS，`npm run check` 0 errors / 0 warnings（仅 2 个既有 deprecation hints）。
- [x] 数据结构至少包含 `id / title / summary / primaryHref / childLinks / lineageNote / status`，子链接至少包含 `role / label / href`。证据：`OpenEvoExperimentNavigationItem` 明确定义上述实验字段，`OpenEvoExperimentChildLink` 明确定义 `role / label / href`；`openEvoExperimentContext.test.ts` 新增结构回归，同时核验五个 runtime experiment 的 id、双语 title/summary、Study 内 primaryHref、status、非空 childLinks 以及每个 child 的 role/双语 label/href。
- [x] `role` 只能表达真实语义，例如 `result`、`analysis`、`mechanism`、`diagnostic`、`history`、`evidence`；不要用 `misc` 兜底。证据：`ExperimentChildRole` 只声明这六种语义值，`openEvoExperimentContext.test.ts` 新增 runtime 回归，逐一检查所有 child/evidence link 的 role 属于 allowlist，并明确拒绝 navigation owner 中出现 `misc`。
- [x] 任何新公开 route 都必须先登记 `src/data/siteReaderContracts.ts`，并通过 `audit:reader-contracts`。证据：本重组复用现有公开 routes、没有新建未登记 route；在最新分支树执行 `npm run audit:reader-contracts` PASS，Reader Contract closed inventory 未发现缺失公开入口。
- [x] 保持一个页面一个 `<h1>`；嵌入组件不得自行制造第二个 H1。证据：最新分支树执行 `npm run build` 后 `audit-static-headings` 对 506 个静态 routes 全部 PASS，每个 route 恰好一个 `<h1>`；Experiment Hub/context 继续使用 aside/details，不引入第二个页面标题。
- [x] 不新增无意义英文 eyebrow、内部代号优先标题或 `7 < 8` 式需先解码的主标题。证据：五个实验主标题由同一 navigation owner 提供，`openEvoExperimentContext.test.ts` 新增首标题回归，禁止 `7 < 8`、`Stage N`、`Q17`、`Track X`、`GATE` 等内部 shorthand 抢占标题开头，并锁定第一项继续使用“训练跑了很久，但参数一直没有更新”；同时 `npm run audit:copy:strict` PASS。
- [x] 不为了目录整齐复制科学数字；数字继续由现有 canonical 页面 / 数据源拥有。证据：Experiment navigation 已移除 Gate 具体阈值、7B final、GDR 44→7 / final、DirectApply 轮数与 D1 update-count 等结果数字，只保留“发生了什么 / 去哪里看”的目录语义；精确值继续由 `OpenEvoCeilingStrategy`、`OpenEvoSuccessorReport`、`OpenEvoQ17DirectApplyAnalysis` 等 canonical 页面拥有。`openEvoExperimentContext.test.ts` 明确禁止这些已知结果数字重新进入 navigation owner，并确认 canonical owners 仍保留精确值。
- [x] 不删除现有深链；若未来迁移 URL，必须显式 compatibility redirect 并更新 sitemap / locale 可用性测试。证据：本次重组没有删除/搬迁旧 route；`openEvoExperimentContext.test.ts` 现在遍历五个实验的 primary / child / evidence href，去掉 hash 后逐一要求中文与英文 Astro route source 都真实存在，同时兼容 directory `index.astro` 与 file-route `.astro` 两种形式。未来任何已挂入实验树的旧深链被删都会直接失败。
- [x] 不把历史 GDR-v1、DirectApply 与未来可能的 recurrent Gated Delta Rule successor 混成同一实验。证据：五实验 registry 分别保留 `gdr-v1-1p7b` 与 `directapply-1p7b`，没有把尚未执行的 recurrent-GDR successor 注册成第六个既成实验；`openEvoExperimentContext.test.ts` 锁定这一身份分离，并检查 `OpenEvoGdrDirectApplyExplainer.astro` 明确写出“三个对象必须分开记录”、本地 GDR-v1、DirectApply 和“原始 Gated Delta Rule 启发的 state update”，且未来对象继续标记“设计中 · 尚未执行新实验”。

## 6. 验证与回归清单

每次完成一个可见阶段后，至少执行与改动范围匹配的最小验证；准备合并时执行完整仓库 Gate。

- [x] `vitest`：Experiment-first 结构测试通过。
- [x] `astro check`：当前 MVP 0 errors。
- [x] `npm run build`：506 个静态页面构建通过，heading / external-brand audit 通过。
- [x] 本地浏览器人工/自动冒烟：桌面 1280×633、手机 390×844、dark mode；五个实验存在、单 H1、无页面级横向溢出。
- [x] Reader Contract 定向测试：desktop / phone / briefing 共 3/3 PASS；Study 的 5-entry 首屏预算已与新任务一致。
- [x] `npm run verify:deploy` 最终 exact tree PASS；证据：候选 `9768ccb39e7f11207493bf0c0cda82702b070f99` 已合入当时最新 `origin/main@57e3db8f4f2e2711334b5026cc01523e5a55ef08`（`MAIN_IS_ANCESTOR=yes`），并在该 exact tree 执行 `npm run verify:deploy` exit 0；Astro check 0 errors / 0 warnings（2 个既有 hints），其余 deterministic audits/tests 全部 PASS。
- [x] `npm run ui:overflow-preflight` 最终 exact tree PASS。
- [x] `npm run test:ui:all` 最终 runtime tree 在可用的 Chromium + WebKit runner 上完整 PASS。证据：候选 runtime tree `9768ccb39e7f11207493bf0c0cda82702b070f99`（包含当时最新 `origin/main@57e3db8f4f2e2711334b5026cc01523e5a55ef08`）使用空闲 `PLAYWRIGHT_PORT=58350` 重跑完整矩阵，Chromium + WebKit 共 **426 / 426 PASS**、exit 0；随后 `cda7c98a12ae4f885f9034d6b15e61c6c767f26c` 仅追加本计划的验证记录，不改变 runtime/test tree。
- [x] 新增/更新实验映射后，为“每个主要实验至少有一个结果/分析子页、所有 href 可解析、无重复 canonical owner”添加结构测试。证据：`openEvoExperimentContext.test.ts` 新增完整映射回归：五个实验都必须至少有一个 `result` 或 `analysis` child；primary / child / evidence href 必须在 zh/en 两侧解析；同一 route 若被多个实验交叉引用，必须在 `OPEN_EVO_CANONICAL_ROUTE_OWNERS` 中声明唯一 canonical owner，且该 owner 必须属于实际引用它的实验上下文之一。
- [x] 手机 390px、平板 768px、桌面 1440px均无 root overflow；中英文、light/dark 都可读。证据：最终 426-case Chromium + WebKit matrix 中 `reader-journey` 覆盖 zh/en × 390/768/1440 × light/dark，`openevo-two-map` / `results-mobile-overflow` / `ui-safety` 等同时验证手机、平板、桌面与页面级 overflow，全部 PASS。

## 7. Git / PR / Preview / Production 交付

- [x] 工作基线已在首个提交前刷新到当时最新 `origin/main@e110446ca8227b47a9ad741ae74d0864bbd97dd3`；新增 main 提交均先做 shared-state drift 检查。
- [x] 本计划文件与对应代码已一起 commit 并进入 GitHub；首个实现提交为 `8671e0d1106ca8acebbe3414fcfe3e2ec404898b`。
- [x] 已推送 `feat/experiment-first-study-nav-20260912`。
- [x] 已创建聚焦 PR #661；PR body 已写明 Experiment-first IA、五个实验、旧 URL 保留、科学边界与已跑验证。
- [x] PR #661 当前只包含本任务的 Study IA、Reader Contract、回归测试与本计划；未夹带服务器状态或临时截图。
- [x] 普通工作 PR 先通过 GitHub Actions preflight；需要 owner 看页面时使用仓库允许的轻量 review Preview，不把 Preview 当 merge evidence。证据：PR #661 exact head `cda7c98a12ae4f885f9034d6b15e61c6c767f26c` 的 Public PR CI `34740319667` 中 `public-deterministic`、`public-browser-1-of-4`、`2-of-4`、`3-of-4`、`4-of-4` 与 `public-ci-gate` 均为 `SUCCESS`。
- [x] 候选真正 merge-ready 后按仓库规则请求 exact-head Vercel final gate；`Vercel` 必须绑定 exact PR head 且真实执行。证据：PR #661 current-base exact head `162edd49daab149b78f26ea08436edcbf7110d3a`（base `ceff230aa8c5f9d152874309759dd93fa580313d`）通过 `request-vercel-final-gate.mjs 661` 请求，Vercel deployment `dpl_E2XBvoDSv4Di5XL3pZMgaoZyJ6yq` 为 `READY`，commit status `Vercel` 为 `success`。
- [x] exact-head Preview 中实际打开中文和英文 Study 首页，确认五实验目录可见、链接可点、手机无溢出。证据：390×844 实测 zh/en 首页均 HTTP 200，均恰好显示五个 `data-experiment-primary`，首屏 child link 可见数为 0，`scrollWidth/clientWidth=390/390`；两种语言共 10 个 primary 深链逐个打开均 HTTP 200。
- [x] 合并后确认 Production successor 来自合并后的 `main`，并打开 `https://basemodel-preview.vercel.app/research/seed-openevo/study/` 做最终可见性检查。证据：PR #661 于 merge commit `41c086f367f790f7624461a4ff0ff3758ef23108` 合入 main；Production deployment `dpl_9yujbPnUKPwecbPpru9xEBvtLP3E` 为 `READY` 并绑定公开 alias `basemodel-preview.vercel.app`；最终复核时 `origin/main` 也为 `41c086f...`。
- [x] 只有 Production 与仓库 main 一致、关键路由可访问后，才把本计划状态改成 `COMPLETE`。证据：最终 Production 冷读时公开域名来自 `main@41c086f...`，zh/en Study 首页、五个实验 primary、`sd-lora-scaling` 父实验 context 与 GDR/DirectApply caveat 均可访问；本 closeout 仅修改 Agent 文档，不改变网站 runtime tree。

## 8. 明确交付标准（Definition of Done）

以下条件必须**全部同时成立**，不能用“页面已经能打开”替代：

- [x] `/study/` 首层只把五个主要实验当主要研究入口；Results / Capability / Stage 术语不再承担主导航职责。证据：Production 390px 首屏恰好五个 experiment primary，child/secondary 分析不进入首屏；Experiment-first 结构测试持续保护五父级。
- [x] 第一次来的读者能在 5–10 秒内回答：这是 OpenEVO × WebShop 的实验目录、共有哪五次主要实验、某个分析属于哪次实验。证据：Production H1 为“OpenEVO × WebShop 实验”，lede 明说“五次主要实验…先选一次实验”，五个标题同屏可见；`sd-lora-scaling` Production context 明确显示“实验目录 / 1.7B · DirectApply / No-GDR 实验 / SD-LoRA 计算扩展性”。
- [x] 五个实验的关键历史关系准确，尤其 GDR-v1 与 3B+1.7B successor 的 lineage 重叠被明确说明。证据：统一 `openEvoExperimentNavigation.ts` 的 `lineageNote` 与结构测试明确保护 GDR-v1 同时属于 3B + 1.7B successor、但因独立机制问题单独呈现。
- [x] DirectApply 下可找到完整 160 轮、R127/R128、SD-LoRA scaling/history、Text Memory、D1 等已经公开的主要分析；不得让这些页面继续像无父级的孤岛。证据：机器可读 experiment map 与 `openEvoExperimentIndex.test.ts` / `openEvoExperimentContext.test.ts` 已覆盖这些 child links；Production `sd-lora-scaling` 也验证为 `directapply-1p7b` canonical parent。
- [x] 7B、Gate failure、3B+1.7B、GDR-v1 也都至少有结果/分析的清晰子入口。证据：结构测试强制五个实验都至少存在 `result` 或 `analysis` child，并验证 Gate / 7B / successor / GDR-v1 的具体 canonical routes。
- [x] 所有旧 URL 仍可用，或有明确、安全的 compatibility redirect；没有死链和 locale 假链接。证据：route-resolution 回归验证 experiment primary / child / evidence 在 zh/en 两侧均有真实 route，locale reciprocal build 与完整浏览器矩阵通过；Production 的十个中英文 primary 深链逐个 HTTP 200。
- [x] 科学 caveat 默认可见：不同 frozen final panel 不能直接做 GDR vs DirectApply 因果比较。证据：Production `gdr-directapply` 正文可直接检索到“不同”、`final panel`、`37.60`、`60.72` 与“因果”边界，且相关 scientific-boundary 回归测试通过。
- [x] 中文与英文 IA 同构；移动端、桌面、明暗主题通过验收。证据：最终本地 Chromium + WebKit `test:ui:all` **426/426 PASS**，包含 zh/en × 390/768/1440 × light/dark；Production zh/en 390px 复核也均无 root overflow。
- [x] 全部自动测试、Reader Contract、build、overflow 与最终 browser gate 满足当前仓库 acceptance policy。证据：final current-base `verify:deploy` exit 0（结构/行为测试含 703 tests PASS、Reader Contract/HPL audits PASS），本地跨浏览器 426/426 PASS；PR #661 exact-head Public PR CI deterministic + 4 browser shards + `public-ci-gate` 全部 SUCCESS，Vercel Preview 与 Production gate 均 READY。
- [x] PR exact-head Vercel final gate 为绿色，合并后 Production 可见并由当前 main 提供。证据：Preview `dpl_E2XBvoDSv4Di5XL3pZMgaoZyJ6yq` READY 对应 `162edd49...`；PR #661 merge commit `41c086f...`；Production `dpl_9yujbPnUKPwecbPpru9xEBvtLP3E` READY，最终复核时 `origin/main=41c086f...` 且公开域名返回新 Experiment-first Study。
- [x] 本 Markdown 中所有必须项已由真实证据从 `[ ]` 改为 `[x]`，每个关键完成项能追溯到 file / test / commit / PR / deployment 证据。证据：本 closeout 逐项记录 runtime files/tests、PR #661、GitHub Actions、Vercel Preview、merge commit 与 Production deployment；提交前执行零未勾选检查。

## 9. 每小时自动执行规则

- [x] 已创建并启用 ChatGPT 每小时自动任务；任务唯一执行权威为本 Markdown，并要求每轮以真实证据打勾。

本文件是定时任务的唯一 checklist authority。每次小时触发后：

1. 读取仓库根 `AGENTS.md`、本文件和当前 `origin/main` / open PR / provider 状态。
2. 不依赖上一次聊天记忆；从本文件找到**第一个仍未完成且当前可安全执行的 `[ ]` 项**。
3. 优先继续已有 PR/分支，不重复创建平行实现；若 main 已前进，按当前规则安全刷新。
4. 真正执行该项：改代码/文档、跑必要测试、检查真实页面或 provider 状态。
5. 只有证据成立时才把 `[ ]` 改成 `[x]`；失败、NOT_EXECUTED、仍在 BUILDING 都不能打勾。
6. 把必要证据写回本文件相邻位置或 PR/commit；临时端口、PID、机器瞬态不作为永久事实保存。
7. 每轮汇报统一用 ELI5 中文说明：**现在做了什么；离目标还差多少；进行到哪里；是否需要人工处理。**
8. 若遇到真实的人类边界（owner approval、凭据、外部账户动作等），不要伪造完成；保留未勾选项并明确指出人工需求。
9. 当所有 Definition of Done 项均为 `[x]` 时，做一次最终冷读与 Production 复核，把文件状态改成 `COMPLETE`；之后不再制造新的重构任务。

## 10. 当前执行快照（2026-09-13）

- 当前 MVP：Experiment-first Study 首页代码已实现，中英文共用一个实验树组件。
- 当前科学结构：五个实验的机器可读父子关系、canonical owner、Hub/context、历史/Flow/Results 降级和子分析返回关系均已完成；统一复用 `ResearchRouteContext` / capability reader map，没有第二套平行导航。
- 当前验证：final current-base `verify:deploy` exit 0；完整 Chromium + WebKit matrix **426 / 426 PASS**；PR #661 hosted Public PR CI 全绿；exact-head Vercel Preview 与合并后的 Production deployment 均 `READY`，公开 Production zh/en + 手机冷读通过。
- 当前 Git / PR 状态：PR #661 已合并，merge commit `41c086f367f790f7624461a4ff0ff3758ef23108`；首个实现提交为 `8671e0d1106ca8acebbe3414fcfe3e2ec404898b`，accepted exact-head Preview SHA 为 `162edd49daab149b78f26ea08436edcbf7110d3a`。
- 当前自动执行：本计划已完成；每小时 `Experiment Nav Checklist` 已停用，避免重复施工。
- 当前人工需求：无；本计划已完成，停止继续制造本重组的新事项。
