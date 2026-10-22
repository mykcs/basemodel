# BaseModel Typography #898 — 2026-10-22 精确状态与剩余工作交接

> **用途**：供 Codex 直接从当前代码继续收尾的执行看板，不是新 Typography Design System，不代替已有 [CODEX_EXECUTION_PLAN.md](CODEX_EXECUTION_PLAN.md)、[HANDOFF_CONTINUATION.md](HANDOFF_CONTINUATION.md)、`src/styles/tokens.css` 或 Current 规则。**按实际完成的工作打勾；已通过的历史 SHA、静态审计和截图的含义必须区分。**
>
> **证据采样点**：2026-10-22，PR [#898](https://github.com/mykcs/basemodel/pull/898) HEAD `3a91d498a4f6ffd3c3b12eb6f2a716508f2b0233`。本交接文件自身随后提交会使 HEAD 改变，因此下方的 3a91d498 自动门禁成功**只验证该旧 HEAD 的代码树**。Codex 启动时一律刷新 GitHub PR/CI、main、Vercel 与 Artifact。

## 0. 快速导航和真实快照

| 入口 | 已实证状态 / 不能误读的边界 |
| --- | --- |
| 唯一主工作 PR | [#898](https://github.com/mykcs/basemodel/pull/898)，**Open + Draft**，base 为 `design/sitewide-type-and-paper-figures-20261020`（[#895](https://github.com/mykcs/basemodel/pull/895) 仍 Open，未合并）。不要新开另一支 Typography 主 PR，不改 Production |
| 最新代码验证 | [Actions #39751700058](https://github.com/mykcs/basemodel/actions/runs/39751700058)：**completed / success**，准确 HEAD 为 `3a91d498`；`public-plan`、`public-deterministic`、**8/8 Chromium**、**4/4 full-WebKit**、`public-ci-gate`、`typography-full-webkit-gate` 全部 success，共 16 completed-success jobs。用户手头“还有一个 WebKit 运行中”的总结现已过期 |
| 本次 CI 实际 Artifact | 12 个未过期 Actions Artifact：Chromium `basemodel-ui-pr-898-shard-1…8`；WebKit `typography-898-full-webkit-shard-1…4`。从 **#39751700058** 下载和审读，不能挪用旧 run。四个 WebKit Artifact ID 分别为 shard 1 `12414347691`、2 `12413449629`、3 `12414307719`、4 `12414990661` |
| 最近已审阅的图 | [D6](../../agents/evidence/sitewide-typography/2026-10-22/WP_D6_Q17_FRONTIER_TYPOGRAPHY.md) 对 `30a8d2ec` 的 Q17 Frontier/DirectApply **108 张来源 PNG 接触表 + 6 张单独原图**作了**有界 ACCEPT**；不得再次写为 D6 全未审，但也不得将其扩充为全站已审 |
| 尚需补齐的图 | [D7](../../agents/evidence/sitewide-typography/2026-10-22/WP_D7_NATIVE_SVG_AND_LANDSCAPE.md)：Q17 native + Landscape 样本**部分已审且有 FIX**；`3a91d498` 后续修复了 JSON 保存/滚动捕获的测试代码并获得绿色 CI，但仍需实际下载、打开**新 HEAD 的 PNG/JSON**，才能改 D7 verdict。Briefing / EffectiveState 剩余图索引和完整读图仍存在 NEEDS HUMAN REVIEW |
| 当前来源候选（**非精确 HEAD**） | [inventory.json](../../agents/evidence/sitewide-typography/2026-10-22/inventory.json) 记录 **61 standalone CSS direct literal** + **1,981 Astro scoped literal/`font:` shorthand candidates**；JSON 明示 `candidate_worktree_source_audit_dirty=true` / `full_exact_head_reaudit_required=true`，**不是 2,042 个确定缺陷、更不是 3a91d498 的最终精确审计** |
| inline/JS 来源分类 | [INLINE_SURFACE_TRIAGE.md](../../agents/evidence/sitewide-typography/2026-10-22/INLINE_SURFACE_TRIAGE.md)：58 个 raw hits：48 布局/几何等来源例外、1 实际字号已迁移、9 解析假阳性；**源意图分类 != 58 项视觉验收 PASS** |
| 最近 Vercel Review | 已查独立 `basemodel-ui-preview-20260811` 项目最近 READY 的 `dpl_4VpqdFX6LE4i14D7WKkRBhRvFT1y` 绑定旧 SHA `58201cf4`。没有查到准确 `3a91d498` 的 READY Review，**旧 URL 不能当最终 Preview**；访问可能受 SSO 保护 |
| 与 main 的真实距离 | 查询时 main `06ac736703f322be8c97786fb5288df4875949f0`；Git 比较结果 `diverged / #898 ahead 112, behind 107`，merge-base `18319e35`。这是**交接前**快照；文档提交后数字可能变化。堆叠分支不能直接当最新 main 的视觉真相 |
| 已合并、应保留的新成果 | [#901](https://github.com/mykcs/basemodel/pull/901) 云端图表验收、[#918](https://github.com/mykcs/basemodel/pull/918) 图细节、[#920](https://github.com/mykcs/basemodel/pull/920) 三线表、[#922](https://github.com/mykcs/basemodel/pull/922) Q03 表、[#925](https://github.com/mykcs/basemodel/pull/925) Q03 PGFPlots、[#926](https://github.com/mykcs/basemodel/pull/926) Q01 PGFPlots、[#927](https://github.com/mykcs/basemodel/pull/927) Figure evidence 在本次检查均为 **merged**，而 #898 还未与之对账 |

**权威先读**：`AGENTS.md`、`src/AGENTS.md`、`docs/wish/LATEST.md`／`DESIGN.md`、`docs/agents/current/sitewide-typography-standard.md`、`css-architecture.md`、`ui-change-visual-acceptance-gate.md`、`website-design-spec.md`、`branch-and-pr-conventions.md`、`docs/dev/LATEST.md`，共享 Harness Human Expression / Project Report Skill。科学数值、来源、保留的未测点和读者合同优先于排版偏好。

## 1. 剩余工作按依赖执行（R0 → R6；每包即时交证据）

### R0｜刷新真状态与停止重复施工 — S / 只读

- [ ] 查当前 #898 HEAD/base/Draft、#895、main、相关开放 PR owner；核对与上述快照的差异，记录执行前的准确 HEAD。
- [ ] 对 **当前** HEAD 列出 workflow run、16 个所需 Gate/job 状态、Artifacts；确认当前分支已包含 #901 相关测试能力与是否被最新 main 覆盖，不能仅凭 #901 已合并就假设它存在于旧 stacked branch。
- [ ] 读 [D6](../../agents/evidence/sitewide-typography/2026-10-22/WP_D6_Q17_FRONTIER_TYPOGRAPHY.md) / [D7](../../agents/evidence/sitewide-typography/2026-10-22/WP_D7_NATIVE_SVG_AND_LANDSCAPE.md) 最近审阅段落，区分 `ACCEPT / FIX / NEEDS HUMAN REVIEW`，保留 D6 有界接受。重新读取旧清单标记的 `R1–R6` 进度和历史 T0–T6（未勾选不等于全部从零开始）。
- **验收**：一页事实账本，包括 HEAD、CI、Artifact、Vercel、Git 分叉、PR 文件所有权；没有不明日期、错 HEAD 或“CI 绿=视觉通过”。

### R1｜准确 3a91d498 的云端 Figure 截图审查 — S，最高优先

- [ ] 从 Actions `39751700058` 的十二份未过期 Artifact 中优先取 Q17 native 4 图、Frontier 2 原图、Landscape ECharts 390/768/1440 × light/dark 的 PNG、geometry/`getBBox` JSON、视口/滚动位置和 No-JS 交互收据。使用 `gh run download 39751700058 --repo mykcs/basemodel --name <actual-name> --dir <isolated-dir>` 或已连接 GitHub API；不要拉不相关的大 ZIP。
- [ ] **实际打开图片**逐图看字体/轴标/图注/暗色/局部滚动/放大阅读器/截图定位；复核 JSON 文件确实存在于 Artifact ZIP，而非仅通过 Playwright `info.attach()` 写入测试报告。检查 screenshot 里的目标页面而非登录页、错滚动位置或只有局部右侧视图。
- [ ] 对 Q17、Landscape、Briefing/EffectiveState 分开维护 `ACCEPT / FIX / NEEDS HUMAN REVIEW`。D6 的旧 108 张来源图不重复计为 R1 新审阅数；D7 无 768 tablet 旧缺口需在新 Artifact 里核实。**不是每张源图都必须重新走相同的人工步骤，但未经打开/检验不得声称全部通过。**
- [ ] 若缺 JSON、标签/轴 `getBBox` 有误、图注遮挡或截图错滚动位置：定位真实的 owner（常见 `tests/e2e/sitewide-typography.spec.ts`、`NativeSvgChartReader.astro`、`LandscapeECharts.tsx`），最小修复→同样正反例验收→重新跑当前 HEAD 的相应云端 gate，**不得仅改证据文档为 PASS**。
- **交付**：在 D7 或新的 R1 evidence 写明被**实际查看**的源 PNG 数和路线、是否包含 768/light/dark、current HEAD 与 run id、Artifact 文件名/ID、JSON 字段、结论及剩余 FIX；一条 PR comment 说明本包结果。

### R2｜最终 HEAD 精确 AST/source Inventory — S–M

- [ ] 用隔离工作目录 checkout 当前 HEAD（Node 24），先执行 `npm ci`、`npm run build`、`node scripts/audit-sitewide-typography.mjs --json /tmp/typography-HEAD.json`；日志记录 `git rev-parse HEAD` 与 `git status --porcelain`。JSON 应保留本机 `sha`、`dirtyTree`、`summary`、`declarations`、`unresolvedSurfaces`。 **如果构建/审计制造可预期的构建输出，严格区分 clean source checkout 与 generated files，不能伪称 dirty=false。**
- [ ] 以“真实消费组件 + 页面语义”给声明分类：`MIGRATE`、`JUSTIFIED_EXCEPTION`、`DEAD_OR_SHADOWED`、`LAYOUT_BLOCKER`、`CONCURRENT_PR_BLOCKER`、`AUDIT_FALSE_POSITIVE`；记录 `file:line / selector / literal / semanticRole / route / owner / overlapping PR / computed style / reason / evidence`。
- [ ] 分母必须清楚：**61 / 1,981 是旧 dirty source 候选值，不是当前准确数**；`font_declarations` 是多类属性合计，不是字号总数；CSS/Astro scoped/inline 与真实可见错误要分别呈现。不要把未知 consumer 直接归到例外来造出“unclassified=0”。
- [ ] 输出可机器检查的 exact-head inventory JSON 和简短 `README.md`；保留原始 snapshot 文件、记录新旧差异。不修改科学数值、坐标或大批量替换字体。
- **验收**：完整可复算的 counts/HEAD/dirty/分类、每类优先级和不足证据的名单；记录真正 unclassified 数与并行 blocker。

### R3｜小批修复实际在线的 Scoped Astro / CSS Owner — M，可拆多批

- [ ] 先按 R2 的“在线消费 + 真小字/截断 + 无其他 PR 文件冲突”排序。核实源组件存在不等于路由能访问：先 `rg ComponentName src`、检查静态 HTML/SSR 调用和实际 DOM。不要把疑似退役 `OpenEvoFairComparisonExplainer.astro` 的 56 个候选全部直接调大，除非证明真实 consumer。
- [ ] 优先筛查实际可见的 `OpenEvoSuccessorReport.astro`、`OpenEvoFirstRunMap.astro`、`WebShopSeedSplitFigure.astro`、`OpenEvoHarness2MiniStudy.astro`、`WebShopGoalGenerationFigure.astro`、`AdvisorTenEvidenceVisual.astro`、剩余研究长文/Result Table；**具体排序取决于实时查得的 consumer 和 owner**，而非上面字面量数量。
- [ ] 每批**只改 1–2 个 owner**：让真正的正文 ≥适用的 `--type-body/body-small`，Table/Caption/Meta/plot label 使用其现有角色；同时改 Grid、行高、容器 shrink、局部滚动或图面几何，不能单纯放大导致图节点互压。保留技术 ID mono、KaTeX 和合理的固定 SVG glyph。
- [ ] 同时加 Playwright `getComputedStyle` / `getBoundingClientRect` / SVG `getBBox`、390/768/1440 × light/dark + 实际相关 WebKit，以及**注入旧 9–10px/窄栏行为后同一判据失败**的负向测试。
- [ ] 遇并发的 `SeedOpenEvoProgressBriefing.astro`、`OpenEvoEffectiveStateGdrLoraStudy.astro`、`site.css`、`final-hardening.css`、`advisor-ten-approved-reader.css` 等，先核查 #806/#816/#895/#841/#916 和其它 PR changed-file owner；不能抢写或回退较新修复。**不新增全局 patch 层或 `!important`。**
- **每小包 Done**：真实代码 diff + 科研数据/文本不变收据 + 具体路由 × viewport/theme 实际 PNG/JSON + exact-head 适用 CI/负向 gate + PR checklist 更新和一次 ELI5 汇报。无实际 Screenshot Review 时是 PARTIAL。

### R4｜安全 reconcile 新 main、父 PR、科研图证据 — M–L

- [ ] 比较最新 `main`、父 #895、#898 的 merge-base 和真正文件差异。2026-10-22 采样时 #898 相对 main `ahead 112 / behind 107`；**不要**用该计数作最终状态，也不能对旧 stack 执行无差别 rebase/reset/force push。
- [ ] 逐对象核对已经合并到 main 的 #901/#918/#920/#922/#925/#926/#927：Q01/Q03 PGFPlots 的真实点、轴、LaTeX 编译产物、三线表、图注、Evidence Gate 是否已经存在于 #898 的树；它们和当前 #895 的 Q03/Token CSS 谁是权威，按最新语义和 CI/Artifact 证据解决。
- [ ] 先写 conflict matrix：路径、旧/新 SHA、数据归属、source owner、决定 `KEEP_MAIN / KEEP_STACK / MANUAL_MERGE / DEFER_OWNER`、如何验证科学数据与截图。只对当前有授权、无并发覆盖的文件实施必要集成。
- [ ] 若 #895 仍 open，保留合法 stacked PR 依赖；**绝不为了 final Vercel Gate 改 base=main** 或提前合并 #895/#898。可在隔离分支预演整合并提供冲突和测试证据。
- **验收**：完整冲突/保留矩阵；Q01/Q03 源数值、PGFPlots、booktabs、未测轮次说明都不退化；main 较新的修复未被覆盖。

### R5｜最终完整浏览器和真实视觉验收 — M–L

- [ ] 对所有生成路由做可复算静态扫描（旧基线 268 HTML/73 figure/130 table；最终以 exact HEAD 为准），**不要**写成 268 页全人工目视通过。
- [ ] 代表性 Home/Nav/Models/Papers/Compare/Workspace、SEED/OpenEVO、Q01/Q03、Q17/Briefing、复杂 Result/Table/长文、移动流程图在 **390 / 768 / 1440px × light / dark × Chromium / WebKit** 查看截图和真实 state（展开、图放大、局部表格滚动、No-JS、键盘、图例分页、合理时 print/200% zoom）。
- [ ] 浏览器收集 `fontFamily/Size/Weight/Style/LineHeight/LetterSpacing/FontVariantNumeric`、`scrollWidth/clientWidth`、`getBoundingClientRect`、SVG `getBBox`；图数字不能花体/异常加粗；正文不能每行只剩五六个汉字；Caption 不得与轴标重叠。各状态记录图片与 JSON，实际**打开**而非只上传。
- [ ] 强制可证伪坏例：9px 长正文、按钮 Arial fallback、SEED 窄双列、Compare 9px 数据、Figure C1 真 75px 窄栏与非误报混排、SVG/轴标签裁切、dark theme 对比。产品状态恢复后同一 Gate 绿，不许为了绿削弱阈值。
- [ ] 使用仓库现有 `npm run preflight:ui:plan` / `npm run preflight:ui`、`npm run verify:deploy`、`npm run build`、`npm run audit:typography` / `npm run audit:css`、`npm run test:ui:all`（按 package.json/Actions 提供的 shard 参数），再在**最终确切 SHA**查 `public-ci-gate` 和 `typography-full-webkit-gate` 是否 success。勿把历史 3a91 绿灯借给新提交。
- **验收**：来源/静态路由全扫描 + 有编号的浏览器截图样本矩阵 + 逐张 `ACCEPT/FIX/NEEDS HUMAN REVIEW` + exact-SHA CI/Artifacts；未过图/样本不能冒充全站已验收。

### R6｜准确 HEAD 的 Vercel Review-only Preview、PR 和 ELI5 收口 — L

- [ ] 查 `.github/workflows/review-preview.yml` 具体前置；其 current review workflow 需要 PR base=main，但 #898 仍 stacked。必要时只用现有独立非 Production Review-only 项目（如 `basemodel-ui-preview-20260811`），先核查配额/权限，避免为了文档反复部署。
- [ ] 最终产品 SHA 的 deployment 必须 `readyState=READY`、`meta.githubCommitSha` 与 #898 当前 HEAD 一致，且属于 Review/Preview 不是 Production。检查 `noindex`、域名、真实 HTML；Vercel SSO 登录页的 HTTP 200 **不代表业务页面已被打开**。
- [ ] 实际打开这份终版 Preview 的首页、Models/Papers、Compare/Workspace、Q03/研究 Flow 等代表路由，按手机/平板/桌面与 light/dark 目视确认用户能看懂；登录/授权限制明确写 `NEEDS AUTHENTICATED REVIEW`，不擅自绕过保护。
- [ ] 更新 #898 首屏状态看板、原执行书/本 handoff、每个 R 包和适用 Txx.yy 的真实完成标记（`PASS / PARTIAL / FAILED / BLOCKED / NOT RUN / NEEDS HUMAN REVIEW`）、未迁移和合理例外数、审阅截图数、Github Actions/Artifact、最后的 Preview URL。**保留 #898 Draft，未获进一步许可绝不 merge/close/Production**。
- **最终 ELI5 九题必须答全**：过去的实际排版问题、哪些真的修好、页面/组件覆盖数量、旧规则删/合并数量、合理例外和待迁移、CI/浏览器/截图结果、正确 Preview URL、blocker、是否仍有漏网同类问题。未能验证者直接写未知或 BLOCKED。

## 2. Codex 实施方式与硬边界

- **从最新 GitHub HEAD 继续；不重开一个新 PR、不重新规划整个系统。** 先复用本 PR 已有改动和源/测试/Artifact 证据，再针对缺口编码。新增规则放原组件 owner；共享 Token 只由 `src/styles/tokens.css` 定义。
- 优先 GitHub 直连 + GitHub Actions + Vercel。需要本地构建/浏览器时用**隔离云端工作区**，不要使用/争抢用户 MacBook/RDC。并行冲突要明确 owner，保持科学内容与已验收源码。
- 严禁为降低审计字面量计数而机械缩放科研图、把 BaseModel 整站套成 ICLR 双栏、把普通数字/实验分数改成花体/mono、或改变 Q03 的真实数值和**“中间轮次没有测量”**边界。
- 不给代码级任务打完成勾，除非有可追溯的 diff、当前 SHA 的检查/实际截图/负向例证。截图和 CI 都是工程证据，不能凭它们宣称独立导师冷读已通过（那属于另一项读者理解任务）。
- **一包完成立即向用户汇报一次**；不要仅重复此文档或发送计划。任何 provider 402/403、SSO、配额和被占用的 PR 只能标真实 blocker，不能绕过安全限制。
