# BaseModel 全站 Typography Design System — Codex 实施与验收计划

> Current isolated candidate: source/role evidence, exact remaining migration debt, local failures and current ownership boundaries are recorded in [the evidence README](../../agents/evidence/sitewide-typography/2026-10-22/README.md). The latest exact-head CI/Preview/PNG acceptance is recorded on [PR #898](https://github.com/mykcs/basemodel/pull/898). Historical SHA results below remain historical. Candidate publication does not authorize merge, retarget or Production.


> **2026-10-22 cloud corrective iteration:** Feature/evidence commit [`f7251f31`](https://github.com/mykcs/basemodel/commit/f7251f31adcb2314f94db310fe1bf3a340873f0f) is on PR #898. Its complete [public/4-shard WebKit run #39731928649](https://github.com/mykcs/basemodel/actions/runs/39731928649) is **RED**, with WebKit shard 1 passing and 2–4 failing. Genuine failures were a public shallow-checkout-count invariant, test interactions before Astro Island/disclosure readiness, and a WebKit passive-scroll witness measuring in-flight inherited smooth scrolling. The followup patch removes only the extra checkout override, awaits real interactivity, opens disclosures explicitly, and makes only the witness's initial scroll instantaneous (the <12px event-induced-motion gate remains intact). A review-only Vercel deployment for exact `f7251f31` is READY/SSO/noindex and served application HTML, but **is not the final candidate**. Full green repeat, PNG/JSON review and scope backlog remain open. Evidence: [WP-D7](../../agents/evidence/sitewide-typography/2026-10-22/WP_D7_NATIVE_SVG_AND_LANDSCAPE.md).

> **2026-10-22 live work receipt — NOT sitewide accepted:** #898 remained Draft above #895; the branch advanced from the user's `487f5e76` to `02950bb`, then concurrent commits advanced it to `cbc2bc5` and `391cae8` while this session was working. The new Action Wrapper and Q17 Frontier 12px/interface-label fixes, plus existing Q17 historic screenshot/negative tests, were integrated without overwrite. The mobile MetricEvidenceFigure horizontal-swipe hint was **already committed**; it was source-verified and not recreated. New independent Q17 native-size readers cover four existing SVGs in `OpenEvoQ17DirectApplyAnalysis`/`OpenEvoQ17FrontierRoadmap`; the live Landscape ECharts 11px legend was upgraded to 14px with 13px axis labels. Real code and negative-injection browser tests were added for 390/768/1440px × light/dark, no-JS controls and captions. **Read-only PR #898-only** full-WebKit jobs were appended to the existing `public-pr-ci.yml` (the repo rejects a fourth workflow file), targeting 4 independently logged shards with an aggregate gate; the integrated candidate WebKit selection lists **643 cases**. Their completion/exit codes, screenshots and Vercel exact-head Preview are **PENDING**, not assumed from code or prior 539/557 partial evidence. Current source-level inline/JS triage: 58 raw candidates = 48 geometry/layout exceptions + 1 migrated chart label + 9 parser false positives, with **1,981 Astro scoped literal/shorthand candidates** still not given final consumer/visual decisions. See [2026-10-22 WP-D7](../../agents/evidence/sitewide-typography/2026-10-22/WP_D7_NATIVE_SVG_AND_LANDSCAPE.md), [inline triage](../../agents/evidence/sitewide-typography/2026-10-22/INLINE_SURFACE_TRIAGE.md) and [owner map](../../agents/evidence/sitewide-typography/2026-10-22/ownership.json). Do not report all-page WebKit/Preview or full-site approval until exact HEAD is confirmed.

> **2026-10-21 verified continuation (working SHA `185f3dd67ca652cf901369a40441325adc6447b6`; next documentation/screenshot commit requires its own exact-head CI):** The real four-arm report's status lines, causal explanatory paragraphs, factor matrix footnotes and plan-table cells now use existing semantic type tokens (roughly 13–15px, interface for statuses) in `src/components/research/OpenEvoExperimentAnalysisPlan.astro`. This is live on `/research/seed-openevo/study/results/four-arm-analysis/`, not a sitewide acceptance. The distinct 7B-only score comparison branch in that Astro component is **not mounted** on public `/results/7b-self-analysis/`: an initial false test was rejected and its dormant CSS migration reverted; that real page is owned by `OpenEvoExperimentResultsScaffold.astro` and overlaps PR #806. [Exact-head Public CI #39544919705](https://github.com/mykcs/basemodel/actions/runs/39544919705) succeeded: deterministic + 8/8 Chromium shards, but no whole-site WebKit proof. Downloaded all seven screenshot artifacts (93 PNG + 31 JSON) and actually opened all six four-arm card crops at 390/768/1440 × light/dark: readable text exists but sticky `.research-navigation` overlays parts of tall element screenshots; next test change must preserve an unmodified viewport capture and exclude floating chrome from **component-only** crops. Refreshing owner inventory found **41** open PRs, including new #908 modifying the same Astro owner (distinct plan-table column-width hunk) and #901 owning the unmerged WebKit evidence workflow. Source candidates: 61 literal `.css` size rules, 2,270 Astro scoped size/shorthand candidates, 56 unresolved inline/JS surfaces. Static build scanned 268 generated routes, not 268 screenshot approvals. WebKit, full scoped classification, real hosted Review Preview and actual page approval remain **PARTIAL/NOT RUN**. Never change base/merge/Production to force green.

> **2026-10-21 continuation receipt (supersedes the older 911b5acf snapshot below):** #898 is still Draft and stacked on #895. A further real change improves the four-arm-analysis report's comparison rationale, figure heading and indices: rendered 12.8px prose → 15px body-small; 10.88px technical number/metadata → 13px interface roles, with 400/600/650-style restrained weights. Code owners are `src/components/research/OpenEvoExperimentAnalysisPlan.astro` and `tests/e2e/sitewide-typography.spec.ts`. Isolated Chromium/WebKit 390/768/1440 × light/dark plus real 10px negative = **14/14 PASS**. Node24 `verify:deploy` PASS (833 unit tests), build/CSS/typography audit and root-overflow preflight PASS. Broad local `test:ui:all` is **NOT PASS**: 451 passed, the route-wide math test hit a 90s timeout while allocating a Chromium page, 495 did not run; do not weaken/skip it or count this as WebKit full evidence. Current independent source audit still has **61 CSS** direct-size candidates, **2,278 Astro** literal/shorthand candidates, **56 unresolved inline styles**; not proven visual bugs. This batch does not alter scientific data/claims, merge, Product or Production. See [work-package receipt](../../agents/evidence/sitewide-typography/2026-10-21/FOUR_ARM_REASONING.md). Hosted exact-head CI/Preview must be checked separately.\n\n
> **交付对象**：现有 [PR #898](https://github.com/mykcs/basemodel/pull/898)（Draft、堆叠在 [#895](https://github.com/mykcs/basemodel/pull/895) 上），**不是新设计系统的权威文件**。本文件是随 PR 迭代的执行清单、决策记录和证据入口。权威仍是 `docs/wish/LATEST.md`、`docs/wish/DESIGN.md`、`docs/agents/current/sitewide-typography-standard.md`、`docs/agents/current/css-architecture.md`、各组件及可执行代码。不要把本任务书搬到 `AGENTS.md` 或制造第二套 Token 规范。
>
> **快照时间**：2026-10-20；交接起点 `911b5acfe7324a81a5f752a534c48809e5825d4e`。以下数量是该 SHA 的审计快照，不代表 Codex 启动时的实时值。**每次写入前重新查 PR/commit/所有者，结果变了以实时证据为准。**
>
> **部署禁令**：不合并/关闭 #895、#898 或并行 PR；不改 `main` / Production；不未经授权动 GPU、科研事实、数据或 Notion；优先 GitHub + GitHub Actions + Vercel，不依赖 MacBook/RDC。当前任务由 Codex 接手后，其他 Agent 不应并发写 #898 头部。

## 0. 最终目标与“完成”含义

让 BaseModel 所有正式页面和复用组件按**语义角色**使用统一、克制、自然的字体排版：字体家族、大小层级、字重、斜体、行高、字距、普通数字/数学、中文/英文/技术 ID 混排、Figure/Table/Caption、状态/操作 UI 在不同宽度与主题均真实可读。

**不是**把 BaseModel 全站套成 ICLR 双栏论文。只有科研 Figure、Table、公式参照 ICLR/NeurIPS 等最终 LaTeX 的清晰度和可核查性；其他页面继续沿用 Research Editorial × Experimental Workbench。

完整交付要求同时满足：

- [ ] 单一 Token authority + 明确 CSS/组件 ownership，没有新增平行字号表/全局 patch 层或为赢 cascade 增加 `!important`。
- [ ] 真正迁移生产组件/页面中的规则；不是仅写规范、建审计、改 README。
- [ ] 每一个剩余硬编码字号经过**逐项归类**；应迁移的已迁移，正当例外有解释/owner/路由截图，废弃覆盖删除。追求 `unclassified = 0`，**不是**把有用的固定 SVG/数学尺寸机械替换到“计数=0”。
- [ ] 构建生成的所有静态路由审计通过；代表性全站页面在 390 / 768 / 1440px × light / dark 的**浏览器真实计算样式**、几何、截图、交互检查通过；WebKit/Safari 也有可追溯收据。
- [ ] 曾经漏网的坏例可以让**同一个发布 Gate**变红；修好后的真实正常例 + 正当例外通过。未实施证伪不可写“回归保护完成”。
- [ ] 精确 HEAD 的 Vercel **Review Preview** 实际展示新改动；校验精确提交/目标路由/页面/图表、`noindex` 和登录保护，不把 `READY` 或跳到 `vercel.com/login` 的 HTTP 200 当验收。
- [ ] PR 中提供每工作包变更文件、源码迁移表、CI run、浏览器截图/JSON Artifact、真实未完成项、科学内容未动证明、Preview URL。**生产发布需另等主人明确批准**。

## 1. 已完成工作：复用，不返工

### 1.1 PR/CI/Preview 快照

| 对象 | 快照状态 | 注意事项 |
| --- | --- | --- |
| [#895](https://github.com/mykcs/basemodel/pull/895) | Open；HEAD `9a18359d`；base `main` | Q03 图、全站 Token 和关键样式的依赖，**仍开放** |
| [#898](https://github.com/mykcs/basemodel/pull/898) | Open + Draft；HEAD `911b5acf`；base `design/sitewide-type-and-paper-figures-20261020` | 本计划唯一实施主 PR；不要新开一个重复 PR |
| [#806](https://github.com/mykcs/basemodel/pull/806) | Open | ModelDecisionCard、PaperExplorer、部分 Core/legacy CSS 正在独立改造 |
| [#816](https://github.com/mykcs/basemodel/pull/816) | Open + Draft | WebShop 科研图、`visual-upgrade.css`、`design-refinement.css`、`site.css` owner 整合 |
| [#901](https://github.com/mykcs/basemodel/pull/901) | Open | 云端 Chromium/WebKit Q01/Q03 图、截图/JSON Artifacts；**优先复用，不复制它的工作流** |
| [GitHub Actions #39436488345](https://github.com/mykcs/basemodel/actions/runs/39436488345) | #898 `911b5acf` exact-head `public-ci-gate=success`，8/8 browser shards | 证明**当时**的自动化检查通过，不是全站真人视觉批准 |
| [Review Preview](https://basemodel-ui-preview-20260811-hwf4t5a1f-wangrui92-team.vercel.app/) | `READY`，对应 `911b5acf` | Review-only；可能受 Vercel SSO 保护；不是最终新提交的验收 |

当前 `scripts/audit-sitewide-typography.mjs` 的 911b5acf 构建收据：**268** 个 HTML、**73** 个 `figure`、**130** 个 `table`、**35** 份 CSS；`font_declarations=632` 是 font-size/font-family/font-weight/font-style 四种属性之和，**不是 632 个字号**；`font_size_literals_remaining=249` 是 CSS 中未含 `var(` 的字号声明数，不等于“249 个已被证实的可读性错误”，也不包括所有可能的 Astro/inline/font 简写。最早 432 是另一时点的静态源基线，不是实时剩余。

### 1.2 #898 已做的实际代码

- 模型浏览/目录与导航：`src/components/ModelExplorer.css`、`src/pages/_bodies/models-index.astro`、`src/components/navigation/CommandMenu.css`。
- Workbench：`src/styles/workspace.css`、`src/components/workspace/CompareTray.css`、`src/components/workspace/ResearchContextBar.css`；收敛语义尺寸及窄网格溢出。
- 移动端与通用交互：`src/styles/mobile-composition.css`、`src/styles/actionable-content.css`。
- 研究图/结果：`src/styles/interactive-research-explainer-environments.css`、`src/styles/interactive-research-explainer-methods.css`、`src/styles/openevo-seed-world4-repro.css`；SEED mobile 双向通道从窄双栏改为上下完整消息、修原生按钮 Arial fallback、Q03 论文式表保留正常数字字形。
- 模型/论文详情与 Compare：`src/styles/v2-closeout.css`；正常 h3/h4 视觉层级及移动表数据文字。
- 现有测试：`tests/e2e/layout-anomaly-guard.spec.ts`、`tests/e2e/canonical-research-figures.spec.ts`、`tests/e2e/seed-world4-q03-presentation.spec.ts`、`tests/e2e/typography-method-role-witness.spec.ts`、`tests/e2e/typography-product-tools.spec.ts`、`src/lib/uiSafetyGate.test.ts`。先复用，再补新覆盖。
- 已有迁移收据：`docs/agents/evidence/typography-method-stage-migration-20261020.md`、`docs/agents/evidence/typography-product-tools-20261020.md`。

在原有见证里，移动端 Q03、Figure C1、WebShop/ALFWorld、SEED 机制图的混排/几何/字号误报经过回归修复。**不要删除上述测试来让 CI 变绿。** 也不要以当前快照推断其他 249 条规则已完成。

## 2. 首先读取的真实 Authority

开始写代码前（而非完成后补充）按需读取并记录实际版本：

1. `AGENTS.md`、`src/AGENTS.md`、修改范围内每个子目录 `AGENTS.md`，`docs/agents/README.md`、`docs/agents/LATEST.md`、`docs/dev/LATEST.md`。
2. `docs/wish/LATEST.md`，如涉及导航/页面角色再读 `docs/wish/DESIGN.md`。
3. `docs/agents/current/sitewide-typography-standard.md`、`css-architecture.md`、`ui-design-principles.md`、`website-design-spec.md`、`ui-change-visual-acceptance-gate.md`、`theme-contrast-contract.md`、`research-explainer-geometry-acceptance.md`、`deployment-policy.md`、`branch-and-pr-conventions.md`。
4. Shared [Human Expression Standard](https://github.com/mykcs/.agents/blob/main/docs/agents/HUMAN_EXPRESSION_STANDARD.md) 与 [历史真人反馈](https://github.com/mykcs/.agents/blob/main/docs/learning/shared/design/LEARNED_PREFERENCES.md)，BaseModel 专项 [learned experience](https://github.com/mykcs/.agents/tree/main/docs/learning/projects/basemodel)；科研汇报相关 [Project Report Skill](https://github.com/mykcs/myk-skills/blob/main/project-report/SKILL.md) 及适用的科研对象规则。
5. `src/styles/tokens.css`、`src/styles/app.css`、`src/styles/global.css`、`package.json`、`playwright.config.ts`、`scripts/audit-sitewide-typography.mjs`、`.github/workflows/public-pr-ci.yml`、`.github/workflows/review-preview.yml`；同时核对现在所有可能碰到的 Open PR **实时**文件清单。

参考 [科学空间](https://kexue.fm/) 的长文公式/表格、[OpenAI Research](https://openai.com/research) 的阅读层级、OpenClaude 的信息结构，但不复制品牌。**`asloppy` 的准确网站若未验证，就标待核实，不猜链接。**

## 3. 单一 Type Scale / CSS Ownership 合同

语义变量只由 `src/styles/tokens.css` 定义，数值以当时源码为准。当前常用：

| 内容角色 | 现有 Token | 预期用途 |
| --- | --- | --- |
| Home Hero / Page H1 / Article H1 | `--type-display`、`--type-page`、`--type-article-page` | 不同页面可有不同级别，语义内一致 |
| H2 / H3 / H4 | `--type-section`、`--type-article-section`、`--type-subsection`、`--type-article-subsection`、`--type-minor-heading` | 实际字体大小与行高递减，不把段落抬成标题 |
| 正文 / 注释正文 | `--type-body`=16px、`--type-body-small`=15px | 长文正常阅读尺寸（按默认根字号 16px） |
| 科研表与数值 | `--type-table`=15px | 真实 HTML Table、数字普通字形，是否启用 tabular 数字服从语义 owner |
| Figure title / Caption | `--type-figure-title`=15px、`--type-caption`=14px | 主图标题与图下注明确分层 |
| Meta / plot label | `--type-meta`=13px、`--type-plot-label`=12px | 仅短标签/刻度/紧凑技术标识；**不能拿 12px 借口放重要段落** |
| 字重、行高 | `--type-weight-*`=400/500/600/650；`--type-leading-body`、`--type-leading-heading`、`--type-leading-caption` | 实测字号+间距、不要任意 750/800/900 加粗 |
| 字体 | `--font-interface`、`--font-editorial`、`--font-mono` | 普通正文/数字默认 interface；少数编辑性标题 editorial；SHA/代码 mono；KaTeX 保持数学专用字形 |

**注意：** BaseModel `site.css` / `editorial-hierarchy.css` 拥有全站基础；`research-booktabs.css`、`openevo-research-blogs.css` 和各 `src/components/**`/feature CSS 拥有各自科研对象和组件。`app.css` 是唯一共享 CSS composition root。消除 cascade 冲突要在 owner 位置修，**不要**在末尾再加一张 `typography-overrides.css`、`!important` 或重复 `@layer`。对组件内原生 `button` 别只依赖 body 继承：真实 `font-family` 可能意外变成 Arial。

### 精准迁移示例（意图，不是已执行的代码）

~~~css
/* Before: a readable paragraph loses to a later compatibility layer. */
.irx-seed-stage__boundary-copy p { font-size: .72rem; }

/* After: choose the existing role, then check the actual cascade and box. */
.irx-seed-stage__boundary-copy p {
  font-size: var(--type-body-small);
  line-height: var(--type-leading-caption);
}

/* Native controls sometimes require explicit family ownership. */
.irx-carrier {
  font-family: var(--font-interface);
}

/* Wide scientific tables scroll in a local wrap; never widen html/body. */
.research-booktabs-wrap { max-width: 100%; overflow-x: auto; }
~~~

不要机械实施以上示意：该 SEED 段落已在 #898 修过；改动前确认每条 selector 当前是否仍存在及实际最终 owner。科研曲线轴字/固定坐标/箭头可能需要专用尺寸和重新布局，不能一刀切改到 15px。

## 4. 并行 PR 冲突协议（执行前及每工作包重复）

| 在途 PR | 当前最容易撞车的文件 | 执行策略 |
| --- | --- | --- |
| #895 | `tokens.css`、`site.css`、`editorial-hierarchy.css`、`openevo-research-blogs.css`、`advisor-ten-approved-reader.css`、`research-booktabs.css` 与 Q03 组件 | #898 已堆叠在其 head。不要覆盖其未合并文件；若必须触及，先看其最新提交与当前功能 owner，再做有凭据的堆叠差异或等其合并 |
| #806 | `ModelDecisionCard.css`、`PaperExplorer.css`、`final-hardening.css`、`interactive-research-explainer-core.css` 等 | 不用 #898 覆盖这批正在开发的 broad Design System v1；等 ownership 释放或准备独立手工整合 |
| #816 | `visual-upgrade.css`、`design-refinement.css`、`site.css`、`research-figure-readability.css`、WebShop Figure components | 复用其 CSS owner 收敛思路；禁止 duplicate paper shell |
| #901 | `.github/workflows/cloud-figure-visual-review.yml`、`tests/e2e/advisor-figure-paper-collision.spec.ts` | 云端 Q01/Q03 Chromium/WebKit 截图与 JSON Artifact 的 owner；若 PR 仍 open，不能把其未合并工作假装当前分支已有；可用独立 Actions 验收/合并后复用 |
| 其余 30+ 开放 PR | 尤其 Q01、研究页面、catalog/Compare、CSS、CI | 真实列出与本次改动文件相交的 PR 号、head SHA、owner 和处理决定，不能只复用上表的历史状态 |

每次工作包：

1. 读 `#898` base/head、`#895` head、`main`、完整 open PR 文件列表和工作流；确认 stack 仍合法。
2. **禁止多个 Agent 同时写同一头部**。有其他窗口/PR 改动时优先只读、做独立不冲突文件；冲突需等 owner 或明确堆叠。
3. 工程侧优先 GitHub 插件；若必须 checkout 用独立云端 workspace/job，不碰 MacBook 公共目录。
4. 不为了触发 Actions/Vercel 制造 noop commit，不放行宽松规则，不静默改变 `base` / 合并 / 关闭 PR。

## 5. 可执行工作清单（WP0–WP6；每包独立提交、验证并汇报）

> **状态规范**：下面全是**Codex 接手后尚待执行/重新验证的任务**，初始为 `[ ]`。前面「已完成工作」仍有效，不必返工。每项只在对应 exact-head 日志/代码/截图/PR 收据存在后勾选；如果不能做，写成 `BLOCKED: <PR/文件/错误/依赖>`，不勾成已完成。`NOT RUN` 与 `PASS` 必须区分。
>
> **顺序**：WP0 → （WP1 / WP2 可在**不重叠文件**上分批）→ WP3 → WP4 → WP5 → WP6。每 WP 完成一次真实提交/验证后马上按第 6 节向用户简短汇报，再继续下一包；遇到 blocker 不要静默卡住或强改别人的分支。
>
> **固定证据落点**：`docs/agents/evidence/sitewide-typography/<YYYY-MM-DD>/` 保存每包 `README.md`、规则分类 `inventory.json`、`route-inventory.json`、`ownership.json` 等可读/机器清单；截图和 trace 由 GitHub Actions Artifact 存，文档记录可访问的 run/Artifact URL（不把大图或秘密放进 Git）。

### WP0 — 当前版本、真实基线、消费者与冲突所有权

- [ ] **T0.01 | 锁定准确对象**：从 GitHub 读取 `main`、#895/#898 的 head/base/state/draft，`git rev-parse HEAD` 与 #898 HEAD 一致才执行写入；记录到 `ownership.json`。**PASS：**文件有 SHA、branch、时间、PR URL，未替换/误改 main。
- [ ] **T0.02 | 读取适用权威**：核对根 `AGENTS.md`、`src/AGENTS.md`、改动子目录的 `AGENTS.md`、Wish LATEST/DESIGN、Typography/CSS/UI Visual Gate、Human Expression、Project Report 和 `docs/dev/LATEST.md`。**PASS：**`README.md` 列出实际读取的路径/ref 及会影响实现的硬约束。
- [ ] **T0.03 | 全部 Open PR 文件交叉检查**：`gh pr list -R mykcs/basemodel --state open --limit 100`（或 GitHub 插件）；对目标文件查每个相关 PR 的变更清单，至少 #895/#806/#816/#901。**PASS：**`ownership.json` 每个目标文件有主 owner、重叠 PR、`SAFE / STACKED_DEPENDENCY / BLOCKED`，禁止擅自覆盖。
- [ ] **T0.04 | 生成基线日志**：在 Node **24.x** 隔离云端运行下方命令，保存 `HEAD`、exit code、stdout/stderr 与 CI run URL。**PASS：**`verify:deploy`、`build`、`audit:css` 和 `audit:typography` 有该 HEAD 的真实结果，失败附日志不藏起。
- [ ] **T0.05 | 全路由静态 inventory**：从 `dist/**/*.html` 列出每个实际路由的 `h1 / figure / table` 数与页面类型；输出 `route-inventory.json`。**PASS：**路由数量和同 HEAD `audit:typography` 一致；报告「静态遍历全部页面」而不是「全部页面人工截图」。
- [ ] **T0.06 | 扩展现有审计**：增强 `scripts/audit-sitewide-typography.mjs` 输出机器可读明细（例如 `--json <path>`，具体接口由实现/测试决定），至少 `src/**/*.css` 的 `font-size/family/weight/style` 及可可靠识别的 `font:` shorthand，额外检查 Astro scoped/inline/JS style。**PASS：**每项有 `file:line / selector / property / value`；未可靠分析的情况显式 `UNKNOWN`，不伪称遍历全部动态样式。
- [ ] **T0.07 | 建立消费/语义归类**：依据真实 source 引用与浏览器计算结果，在 `inventory.json` 每项填 `route/consumer/semantic role/CSS owner/PR owner/decision/evidence`；五种状态 `MIGRATE / JUSTIFIED_EXCEPTION / DEAD_OR_SHADOWED / LAYOUT_BLOCKER / CONCURRENT_PR_BLOCKER`。**PASS：**全部已检出的值被归类，`unclassified=0`；不能识别 consumer 的项目进入 blocker，不靠猜测。
- [ ] **T0.08 | 汇报起点并冻结下一包范围**：写 `WP0` 收据，说明本 HEAD CSS 文件数、总声明数、剩余 direct font-size 个数与高风险 owner；优先排无 PR 冲突文件。**PASS：**附 SHA、日志、可执行的 WP1/WP2 文件表，发一次 ELI5 汇报。

基线实际命令（从`package.json`再核对定义后使用）：

~~~bash
node --version               # 预期 Node 24.x
git rev-parse HEAD
npm ci
npm run verify:deploy
npm run build
npm run audit:typography
npm run audit:css
git diff --check
~~~

**旧值对照**：`911b5acf` 时是 268 HTML、73 Figure、130 Table、35 CSS、249 未含 `var(` 的 font-size 声明；`font_declarations=632` 是四类字体属性之和，不是 632 个字体大小。开始之后使用新 HEAD 的数字，差异必须解释，不能复用历史数字作实时结果。

### WP1 — 首页、目录、模型/论文详情、Compare、Workspace

- [ ] **T1.01 | Route × Role 选点**：从 T0.05 inventory 为首页、导航、Models list/detail、Papers list/detail、Families、Landscape、Guide、Compare、Workspace 建立具体 `route + selector + expected role` 表。**PASS：**每个路由真实存在且 selector 能找到可见内容；含中英文长标签、数据行和操作状态。
- [ ] **T1.02 | 复核已迁移组件的真实级联**：检查 `src/components/ModelExplorer.css`、`src/pages/_bodies/models-index.astro`、`CommandMenu.css`、`workspace.css`、`CompareTray.css`、`ResearchContextBar.css`、`v2-closeout.css`。使用 `getComputedStyle` 验证字体、字号、字重、斜体、行高；查过度覆盖/无消费者 selector。**PASS：**记录至少各主要 UI 角色的有效值和问题清单，不无故重写已正确样式。
- [ ] **T1.03 | 实际修复不冲突的 UI**：只对 T0.03 判 `SAFE` 的组件修改代码：用现有 `--type-*` / `--font-interface`、正确 `minmax(0,1fr)` / `min-width:0` / 正常换行；原生 `button` 要检验是否继承字体。**PASS：**`git diff --stat` 有真实生产代码改动，且没有新平行 Tokens/`!important`。
- [ ] **T1.04 | Compare 与宽表**：在 `/compare/` 用 2+ 个真实有效 model ID 选择比较，手机 `.comparison-mobile-group > h3` / `.comparison-mobile-field > h4` / `.comparison-mobile-value` 实测层级正确；桌面表在表格容器局部横滚、不撑大文档。**PASS：**移动标题层级 `h3 ≥ h4`，文字和数字可读、无横向页面溢出。
- [ ] **T1.05 | 处理高风险共享 owner**：若 `src/styles/site.css`（旧 81 条）或 `ModelDecisionCard.css` / `PaperExplorer.css` / `final-hardening.css` 仍与 #895/#806/#816 冲突，明确 `CONCURRENT_PR_BLOCKER` 并先做 T1.03；文件所有权解除后按 selector 一组一组改，不无声合并/覆盖。**PASS：**每个待改 selector 有 conflict 记录或相容的提交，不擅自写别人 owner。
- [ ] **T1.06 | 真实浏览器核验**：复用 `tests/e2e/typography-product-tools.spec.ts`、`layout-anomaly-guard.spec.ts`、`workspace.spec.ts`，必要时补针对同类问题的负向案例。测 390 / 768 / 1440 × light/dark，字体与 `documentElement.scrollWidth-clientWidth <= 2`。**PASS：**当前 HEAD 的相关 Playwright 命令与构建均通过，截屏比对手机/桌面。
- [ ] **T1.07 | 更新分类与汇报**：修改 T0.07 ledger，统计本包 `MIGRATE / JUSTIFIED_EXCEPTION / BLOCKED` 变化，附 commit、受影响真实页面与测试 run。**PASS：**已验证才勾、每完成一包发 ELI5 汇报，不把剩余冲突归零。

### WP2 — OpenEVO/SEED 长文、论文式 Figure/Table、KaTeX、交互机制图

- [ ] **T2.01 | 科学证据封存**：确定 Q01/Q03、其他结果 Figure/Table 的当前 source、真实测量、指标单位、样本/训练/评估窗口、未知/未测点、引用链接与科学限制；记录原始路径/提交。**PASS：**变更前有事实核对表，严禁改数据或把未运行变已完成。
- [ ] **T2.02 | 研究对象归类**：从 T0.05 所有 Figure/Table 列表分 `paper-single / paper-wide / method-flow / small-table / workbench-table / slide / formula`；为每种选真实测试路由和 role token。**PASS：**生成清单能定位至少 73 Figure / 130 Table 的历史基线差异，标出不该做论文式样式的对象。
- [ ] **T2.03 | 长文科研排版**：安全 owner 中调整 `openevo-research-blogs.css`、`advisor-ten-approved-reader.css`、文章 title/section/subsection、正文/图注/阅读宽度；若与 #895 冲突先处理 T0.03。**PASS：**实际字号/行高/H1-H4/中英文阅读截图通过，没有把网页变双栏。
- [ ] **T2.04 | Figure/Table 视觉与语义**：逐类检查 `research-booktabs.css`、`research-figure-readability.css` 与消费组件：图标题/Axis/Data label/Caption 不混级；单图适度紧凑、多面板允许较宽；三线表、右对齐数值、caption 的统计口径与 wrapper 局部滚动。**PASS：**每个修改对象有 before/after 同尺寸截图 + computed style 或 SVG 几何 JSON，不增逐行花哨表格线。
- [ ] **T2.05 | 复杂机制图几何修复**：检查 `interactive-research-explainer-methods.css`、`interactive-research-explainer-core.css`、Flow/SEED/OpenEVO/WebShop/ALFWorld。对小而重要的解释文本提高可读性时同步改 `grid-template-areas`/容器/换行/连接线，保护 390px 手机布局。**PASS：**所有主要节点无真实重叠/裁切；固定 54/82px 特殊标签要么重构几何，要么保留列入有依据的 exception。
- [ ] **T2.06 | 数学/数字/中英文规则**：真实公式保留 KaTeX 数学字体和符号；代码/SHA 保留 mono，普通科研数字/得分不使用装饰 serif/monospace 或排名自动加粗；核对 `font-variant-numeric` 与学长十问 plain-numeral owner。**PASS：**真实计算字体与两种语言截图无异常字形，科学数据逐项核对不变。
- [ ] **T2.07 | 研究回归保护**：复用 `canonical-research-figures.spec.ts`、`seed-world4-q03-presentation.spec.ts`、`research-explainer-layout.spec.ts`，验证 Q03 点轴 bbox 间距、SVG `aria-label + desc`、无覆盖式 `title`、Figure C1 中英混排合理性与真 75px 窄栏负向失败。**PASS：**同 HEAD 相关 Chromium/WebKit 与科学事实测试通过。
- [ ] **T2.08 | 保存研究视觉收据**：更新 Figure/Table 清单、真实受影响路由、截图/测量 Artifact 和未修复布局 blocker，向用户汇报。**PASS：**没有把 `CI passed` 当作人眼批准。

### WP3 — 逐 owner 删除旧 CSS，留下可追踪的合理例外

- [ ] **T3.01 | 重取债务 Top-N**：重新运行 T0.06；比较历史 `site.css=81`、`final-hardening.css=29`、`openevo-research-blogs.css=27`、`advisor-ten-approved-reader.css=23`、`methods.css=20`、`core.css=17`、`visual-upgrade.css=16` 等 owner。**PASS：**记录当前真实文件/行数，数字不从本计划复制。
- [ ] **T3.02 | 证明规则是否在线**：对每个可疑 selector 查 source/生成 HTML/已 hydrate DOM 中的消费者和最终 cascade；将遮蔽/废弃规则标 `DEAD_OR_SHADOWED`（需要引用/截图或 DOM 证据），不可只凭 `rg` 没找到名字就删除动态组件规则。
- [ ] **T3.03 | 安全删除与语义迁移**：只处理 owner 已明确的 `MIGRATE / DEAD_OR_SHADOWED`，每组采取 `迁移到现有语义 role→重跑 computed style/布局→删冗余 copy`；检查 `src/styles/app.css` 的 import/优先级不变。**PASS：**删前删后等价或更好且对应测试通过，不产生新全局 CSS override。
- [ ] **T3.04 | 例外账本逐条落地**：为合法 `JUSTIFIED_EXCEPTION` 写 `file:line / owner / reason / effect / screenshot-or-test / future guard`，如 CSS 中隐藏 ordered-list marker 的 `font-size:0!important`、固定 SVG 坐标或 KaTeX。**PASS：**残余不再有理由不明的 direct/font shorthand，未处理的真正 blocker 不得混为例外。
- [ ] **T3.05 | CSS Architecture 检查**：运行 `npm run audit:css` 与同类 selector 审计；既有 `!important` 债务不可新增，非法半迁移不可留在尾部 `final-hardening.css`，没有第二套 Token/`@layer`/全局补丁文件。**PASS：**当前 HEAD exact CI 通过，删除名单/例外名单可复算。
- [ ] **T3.06 | 数字收口与阻塞汇报**：`inventory.json` 分类满足 `unclassified=0`。若 `MIGRATE` 尚未完成或 `CONCURRENT_PR_BLOCKER` 未解决，WP3 标 `BLOCKED/PARTIAL`，写明具体 PR/文件/所需协调，不能宣布全站迁移完成。

### WP4 — 精确 SHA 工程测试、跨浏览器截图、坏例证伪

- [ ] **T4.01 | 代码完整 Gate**：同 HEAD 执行 `npm run verify:deploy`、`npm run build`、`npm run audit:typography`、`npm run audit:css`、`git diff --check`。**PASS：**exit=0，构建路由/图表统计和 sha 写入 `README.md`；失败列源文件和原因。
- [ ] **T4.02 | 浏览器矩阵**：运行已有 `tests/e2e/sitewide-typography.spec.ts`、`typography-product-tools.spec.ts`、`typography-method-role-witness.spec.ts`、`layout-anomaly-guard.spec.ts`、`research-explainer-layout.spec.ts` 和风险相关 tests，在 390/768/1440 × light/dark，Chromium **与 WebKit** 的云端 runner 上验收。**PASS：**有每引擎真实 run/成功数；仅 Chromium 通过不能写 Safari 通过。
- [ ] **T4.03 | 真 CSS 与布局见证**：在 `await document.fonts.ready` 后记录 `fontFamily/fontSize/fontWeight/fontStyle/lineHeight/letterSpacing/fontVariantNumeric` 及 `getBoundingClientRect / scrollWidth / clientWidth / SVG getBBox`。检查中文/英文换行、图轴碰撞、卡片/流程节点、Table wrapper；页面非预期横滚 ≤2px。**PASS：**每个选定 route+viewport+theme 有 JSON 和可复验脚本。
- [ ] **T4.04 | 坏例→拒绝→修正的证伪**：在隔离测试态故意重现 9–10px 长说明、Arial 原生按钮、SEED 双列窄 lane、Compare 9px 行、Figure C1 假误报与真实 75px 窄栏、Q03 轴标碰撞、SVG title 覆盖、暗色低对比等。**PASS：**相同强制发布 Gate 检测真实坏例变红；恢复正常变绿，正当例外仍通过（不要只 assert 一个新测试 helper 的 Boolean）。
- [ ] **T4.05 | 复用云端 Screenshot 所有者**：检查 #901 是否合并/在当前 head 可用；能用则运行其既有云端 Chromium/WebKit Figure 截图 + JSON Workflow。若尚未接入，不改 #901 代码：用当前 PR 已有测试/云端 Playwright 按相同输出证据形式生成 Artifact，并准确报告该依赖。**PASS：**每张 PNG/trace/JSON 有 run、sha、route、viewport、theme、截取状态。
- [ ] **T4.06 | 真实视觉复核**：**打开** T4.05 的图片，逐张看 Home/Models/Papers/Compare/Workspace/SEED/OpenEVO 代表性 route 的 H1–H4、长中文行宽、数字、图注/表格、边界、暗色对比和节点是否重叠。**PASS：**review sheet 填 `ACCEPT / FIX / NEEDS HUMAN REVIEW`，每个 `FIX` 重开对应生产代码任务，不以有截图等于视觉合格。
- [ ] **T4.07 | Public CI 最终收据**：确认 GitHub `public-ci-gate` 为**当前 HEAD 的 completed/success**，全部风险要求的浏览器分片结束；科学内容无改写、`npm run audit:claims`/`validate` 通过。**PASS：**存真实 Actions run URL/sha/失败数；不能挪用历史 8/8 的截图或 CI。
- [ ] **T4.08 | WP4 汇报**：列静态全路由与实际浏览器样本数、通过的浏览器/主题/宽度、截图检视数、红绿红测试结果和仍需读者确认项，附 HEAD，发一次 ELI5 汇报。

### WP5 — 同 SHA 的 Vercel Review Preview（禁止触及 Production）

- [ ] **T5.01 | 核对可用 Review 工作流的硬前置**：阅读 `.github/workflows/review-preview.yml`。该 Workflow **目前要求 PR base=main**，而 #898 **base=#895 的分支**。**PASS：**先报告此真实约束；在 stacked 状态**不能**直接运行 `gh workflow run review-preview.yml --ref main -f pr_number=898` 并期待成功，不为过关擅自 retarget base。
- [ ] **T5.02 | 选择合规 Review 路径**：若 #898 后续确实已 base=main 且现有 `review-preview.yml` 配置齐全，可以执行 `gh workflow run review-preview.yml --repo mykcs/basemodel --ref main -f pr_number=898`。若仍堆叠，则沿此前经授权的**独立 non-Production Vercel Review-only 项目/插件**，只在必要时用准确 SHA 创建 Preview，并强制验证 `noindex`/访问控制/构建预算；若这条路径不可用，写 `BLOCKED: Review preview access`，而不是绕过权限或伪造 URL。
- [ ] **T5.03 | 精确身份验证**：比对 Vercel deployment object 的 `meta.githubCommitSha` / build source SHA = #898 当前 HEAD，`readyState=READY`；验证 Preview 不是 Production 域、没有更改 canonical、`noindex` 有效。**PASS：**提供 deployment ID、完整 HTTPS URL、HEAD、触发方式及静态构建日志。
- [ ] **T5.04 | 真正打开 Preview 检查页面**：在相应合法权限下打开首页、Models/Papers 目录与详情、Compare/Workspace、Q03 Results、SEED/OpenEVO Flow 的目标路径；按 390/768/1440 × light/dark 对比对应截图，确认新 CSS 实际加载、目标视觉存在。**PASS：**验收记录包含路线与截图；若返回 Vercel 登录页或重定向，**不得**把最终 HTTP 200 当目标网页通过，写 `NEEDS AUTHENTICATED REVIEW`。
- [ ] **T5.05 | 尊重最终 Gate**：检查 `scripts/request-vercel-final-gate.mjs` 的约束（Open、非 Draft、base=main、当前 main 包含、exact-head public-ci-gate 成功），#895 未合并或 #898 Draft 时绝不调用 final gate；不执行 merge/close/Production/promote。**PASS：**PR 保持开放且无 Production 更改，Review-only 与 release candidate 清楚分开。
- [ ] **T5.06 | WP5 汇报**：给用户一个**确实验过准确 HEAD**的 Review URL 与重要测试/SSO 状态；否则只报告 blocker 和已取得的准确收据，不能拿旧 Preview 的 URL冒充新 HEAD。

### WP6 — 最终分类、PR 验收与用户收口

- [ ] **T6.01 | 生成完整 Evidence Receipt**：写 `docs/agents/evidence/sitewide-typography/<YYYY-MM-DD>/README.md`，列起点/终点 SHA、文件/组件/实际路由清单、各项源码迁移和删除量、合理例外、需协调的 PR、CI、浏览器、Artifact 和 Vercel 链接。**PASS：**别人能从来源重跑并复核每个数字/结论。
- [ ] **T6.02 | 验证迁移归类闭环**：确认 `inventory.json` 未分类数为 0；所有应迁移条目均已改好/有失败 blocker；每个例外有 reader-role 理由、owner、route 和测试/截图，且非数学/技术元素的已知不可读情况没有被误标例外。**PASS：**没有以数字 0 或“历史 CSS”掩盖布局问题。
- [ ] **T6.03 | 科研事实与视觉双重复查**：对科研数据、公式、四个 Q03 测量/未测点、科学图来源、指标统计范围做 diff 和重新读取；浏览器截图做最终完整复核。**PASS：**事实无漂移；未完成读者冷读/SSH/登录权限有明确状态。
- [ ] **T6.04 | 更新 PR #898 正文中的 WP 状态**：从当前 HEAD 更新 `PASS / PARTIAL / FAILED / BLOCKED / NOT RUN / NEEDS HUMAN REVIEW`，勾选的 Txx.yy 附具体 commit、Actions run、截图 Artifact、准确 Preview，未勾选项附 blocker。**PASS：**打开 PR 即能重建事实，没有「文档计划完成=网站完成」的混淆。
- [ ] **T6.05 | 用 ELI5 向用户交付九项回答**：原来真实字体问题 / 已修 / 实际页面及组件数 / 删除合并旧规则 / 剩余例外 / CI浏览器截图 / 当前可用 Preview / blocker / 同类问题仍漏网否。**PASS：**每项有可验证证据或明确未知，不以 CI 绿灯代替读者验收。
- [ ] **T6.06 | 保护发布边界**：最后复查 #898 未合并、#895 未擅自修改、Production 未触及；等待用户对最终视觉确认及后续 merge 的单独授权。**PASS：**不存在未经请求的 release/Production 变更。

### 每包“Done”判定（必须同时成立）

1. [ ] 生产修复任务有真实 diff（WP0 只读/盘点及 WP6 文档收口除外）、对应源码 owner、局部实际行为修复和迁移 Ledger 更新。
2. [ ] 针对改动的 `verify:deploy / build / audit` 与浏览器测试在**同一代码 HEAD**下有可读日志；若 browser/CI 不可用写 `NOT RUN`、不能勾。
3. [ ] 改动真实影响的 viewport/theme 截图和 computed geometry 实际检查，科学事实/合法例外不退化。
4. [ ] PR 当前 HEAD 与证据 SHA 对应，任务清单标记正确、附下一包依赖和 blocker，向用户汇报一次。

如第 1–4 项缺任何一项，只能标 `PARTIAL` 或 `BLOCKED`；不要将全部 WP 预先勾上。

## 6. 每批反馈模板（对用户，ELI5 中文）

一次 WP 关闭后报告：

| 项 | 必填 |
| --- | --- |
| 本次解决的问题 | 人眼能懂的一句事实 + 原来为什么不行 |
| 改动的真实 owner | 文件路径、关键 selector/组件、commit/PR |
| 页面与组件覆盖 | 几个实际页面/组件；全站审计 vs 抽样验收分开 |
| 字号迁移 | HEAD 前→后；MIGRATE/JUSTIFIED_EXCEPTION/未解决数量 |
| 验证 | exact-head `verify:deploy` / build / `public-ci-gate` / 浏览器分片 / WebKit / 截图 |
| Preview | 对应 exact SHA 的可点击 Review URL，实际查看了什么；SSO 权限说明 |
| Blocker/下一包 | 明确仍有的风险与待改文件/PR；不把未完成涂绿 |

全站完结需单独汇报 9 个问题：原问题、真修复、页面/组件数量、旧规则去重、合理例外/未迁移、CI/浏览器/截图、最终 Vercel URL、blocker、同类问题是否仍漏网。

## 7. 特别防错清单

- 不把“Token 存在”说成“网页已经使用”；**真实浏览器 computed style** 是判据。
- 不把“CI 绿”说成“人眼无问题”；跨主题/手机/中英混排/密 Figure/长文表格/打印结果必须看截图。
- 不把“字体变大”视为唯一可读性修复；宽度、Grid、换行、overflow、纵向节奏、相邻节点、connector 同步检查。
- 不用花体/衬线/等宽数字美化科研结果；`font-variant-numeric` 不能无视 page-level plain numeral policy。Math/KaTeX 另论。
- 不把 OpenEVO/SEED、WebShop/ALFWorld、历史/实时实验混作同一事实；不能改变指标、数据、来源、原始内容、科研结论。
- 不为减规则数在 `site.css` 或 compatibility 尾端新增更高 specificity/`!important`；不强删仍在线使用的 CSS。
- 不自行猜 `asloppy` 链接或仿造品牌。
- 不重复建设 #901 的云端截图 workflow；没有合并的工作不能假称本 PR 已含。
- 不新开第二个 Typography PR、不无理由改 PR base/合并、不请求 Production 发布、不碰 MacBook 本地共享工作目录。
- **完成标准是可见的真实产品成果 + 可追溯的验收收据，而不是只交这份计划。**
