# BaseModel 全站 Typography Design System — Codex 实施与验收计划

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

## 5. 待办工作包（完成一包立即报告）

### WP0 — 冻结实时基线与覆盖表（实施的必经依赖）

- [ ] 对当前 HEAD `npm ci`（Node 24）、`npm run verify:deploy`、`npm run build`、`npm run audit:typography` 和现有 `npm run audit:css` 获得**精确 HEAD 的日志**。不要把旧版 249/268 当下一轮实时值。
- [ ] 盘点生成后的所有 HTML 路由及其 `figure` / `table` / 页面角色，写出 machine-readable route inventory；将 CSS 属性按 `file:line + selector + property + original value + route/consumer + semantic role + CSS owner + action` 映射。
- [ ] 新旧 CSS 残余分五类：`MIGRATE`、`JUSTIFIED_EXCEPTION`、`DEAD_OR_SHADOWED`、`LAYOUT_BLOCKER`、`CONCURRENT_PR_BLOCKER`。最后两类不是“已迁移”。
- [ ] 列出所有适用 `AGENTS.md`、Wish、Skill、human feedback 和 PR 最新检查结果；记下实际读到的版本。
- [ ] 建立审计收据：`docs/agents/evidence/sitewide-typography/<date>/inventory.json` 与 `README.md`，机器产出与读者解释分离；包含 baseline SHA、每个规则的状态及未覆盖的范围。

建议完善现有 `scripts/audit-sitewide-typography.mjs`，而不是新增第二个审计 owner。该脚本目前只正则扫描 `src/**/*.css` 的四类 font 声明，并检查 `dist/**/*.html`；它不会自动识别全部 Astro scoped CSS、inline style、font 简写、真实 computed size、权重覆盖或死 selector。可以补统一 inventory 输出，但保留已有静态契约和数字/科学不变量。没有 parser 能力时先标未知，不假称完整 AST。

示例数据形状：

~~~json
{
  "head": "<exact-commit-sha>",
  "route": "/research/seed-openevo/flow/seed/",
  "owner": "src/styles/interactive-research-explainer-methods.css",
  "selector": ".irx-seed-stage__boundary-copy p",
  "original": "0.72rem",
  "computed_px": 15,
  "semantic_role": "body-small",
  "decision": "MIGRATE",
  "required_regression": "tests/e2e/typography-method-role-witness.spec.ts",
  "evidence": "CI artifact or browser receipt"
}
~~~

注意：该 JSON 是**结构样例**，`computed_px` 必须从真实执行的浏览器读出，不能从 CSS 字符串推断。

**WP0 收口**：全路由清单可复算、249 基线与最新差异解释清楚；未读文件/未知 owner 有精确 blocker，不把空白当 0。

### WP1 — 未迁移的目录 / 工具 / 共享 UI

按由低冲突到高冲突排序，先确认真正 consumer 再改：

1. `src/styles/v2-closeout.css`：#898 已迁移大部分 Compare、Model Detail、Paper 快速查看；剩余 `font-size: 0 !important` 是**隐藏 list marker**（非可读文字），合理例外保留；不要再为了计数删掉。
2. `src/components/ModelExplorer.css`、`src/pages/_bodies/models-index.astro`、`src/styles/workspace.css`、`src/components/navigation/CommandMenu.css`、`src/components/workspace/*`：复核 source owner、真实按钮字体、宽度、行高、长期阅读舒适性；清理已废弃重复声明。
3. `src/styles/site.css`（上次 81 处，#895 owner）：计划迁移 `.field`、`.explorer-summary`、`.quick-filter`、`th,td`、`.comparison-group`、`.landscape-learning-card`、`.paper-row`、`.evidence-row` 等角色，但只在 #895/其他 owner 协调后逐类执行。**不要批量替换全文件**；`.workflow-edge-label`、`.semantic-status-icon`、单独 Hero `clamp` 属不同语义。
4. `src/components/models/ModelDecisionCard.css`、`src/components/papers/PaperExplorer.css`、`src/styles/final-hardening.css`（#806 owner）需要先处理并行 ownership；不能把不允许动写成“完成”。

**验收**：Home/Nav/Models listing+detail/Papers listing+detail/Families/Landscape/Compare/Workspace/Guide 每种代表路由 390×768×1440 / light×dark；`getComputedStyle` 查真实字体家族/字重/行高/斜体，长中文行宽、选项按钮、表格列名、data label，横向溢出。Compare 手机版 `h3` 分组不比 `h4` 字段更小、数据行至少现有 `--type-table`；不能把论文表统一改成工作台 table 或反过来。

建议沿用：`tests/e2e/typography-product-tools.spec.ts`、`layout-anomaly-guard.spec.ts`、`workspace.spec.ts`、`ordinary-tech-debt-round2.spec.ts`。

### WP2 — 研究博客、科研 Figures/Tables、公式

1. `src/styles/openevo-research-blogs.css`（旧 27）、`advisor-ten-approved-reader.css`（旧 23）、`research-booktabs.css`（#895 相关）、`research-figure-readability.css`（#816/895）、`src/components/research/**`：先 owner/冲突核验，再按 Article/Section/Body/Meta/Figure/Caption/Table 分类迁移。
2. `src/styles/interactive-research-explainer-methods.css`（旧 20）与 `interactive-research-explainer-core.css`（旧 17，#806 owner）：特别区分短方法标签、坐标系标签、技术 ID 与真正的说明句。某些固定几何节点必须同时改变 Grid / connector / wrap，禁止把 8px → 15px 后任其碰撞。
3. Q01/Q03 真实图的点、轴、数字、Q03 四个测量及“中间轮次没有测量”边界严格保留。`MathFormula`/KaTeX 数学字体和符号不为了全站字体统一而改变。普通试验分数绝不能继承装饰性 serif、monospace 或花体数字。
4. 真实三线表只在科研语义对象使用 booktabs：顶线/表头线/底线；无无意义逐行框；指标名/行标协调、真实数值右对齐、单位和样本/窗口说明放 caption。宽表在 wrapper **局部**滚动，手机 `documentElement.scrollWidth - clientWidth <= 2`；导出/CSV/LaTeX 来源口径不变。**不要**把整个网站变两栏。
5. 遵守 Figure 的单栏/宽图角色；`role=img` + `aria-label` + `desc`，避免遮挡式 SVG `title`。视觉密度/数据点数量/坐标轴范围不能制造虚假的科学差异。

既有测试：`tests/e2e/canonical-research-figures.spec.ts`、`sitewide-typography.spec.ts`、`advisor-paper-figure-suite.spec.ts`、`seed-world4-q03-presentation.spec.ts`、`research-explainer-layout.spec.ts`。#901 的云端 Chromium/WebKit Figure Artifacts 工作在兼容后复用，避免重复写工作流。

**WP2 收口**：每张改动的 Figure/Table 的 before/after 图像（同状态、同尺寸）、计算样式/几何 JSON、科研数值不变校验、有意义的例外与未修复块均记录。研究图不能仅靠 CI 绿色获得肉眼验收。

### WP3 — CSS 遗产收敛，防止再次产生“多 owner”

高债务快照（249 残余）：

| 文件 | 快照未迁移 font-size literal | 当前约束 |
| --- | ---: | --- |
| `src/styles/site.css` | 81 | #895 与 #816 重叠 |
| `src/styles/final-hardening.css` | 29 | #806 |
| `src/styles/openevo-research-blogs.css` | 27 | #895 |
| `src/styles/advisor-ten-approved-reader.css` | 23 | #895 |
| `src/styles/interactive-research-explainer-methods.css` | 20 | #898，可按图的几何依赖处理 |
| `src/styles/interactive-research-explainer-core.css` | 17 | #806 |
| `src/styles/visual-upgrade.css` | 16 | #816 |
| `src/components/models/ModelDecisionCard.css` | 9 | #806 |
| `src/components/papers/PaperExplorer.css` | 8 | #806 |
| `src/styles/design-refinement.css` | 4 | #816 |

这些前十合计不等于 249 的全量；其余也要进入分类 ledger。还有字号 `font:` 简写、像素/行高/字距/字重/斜体漂移，不被该单一计数覆盖。

逐 owner 做**迁移 → computed-style 等价或改进测试 → 删除遮蔽/废弃副本**；比对 CSS 架构审计对 `!important` 的冻结基线，不可以新增兼容补丁来解决当前可修的 owner。**只有确认文件真的不再有在线消费者**才能移除整个兼容样式表。`final-hardening.css`、`design-refinement.css` 等仍有在线职责，不可为了目录整齐一次性删除。

### WP4 — 真实浏览器回归与负向证伪

最少做到：

- [ ] 对**全部生成 HTML**执行 source/render inventory（静态）；逐类抽代表性页面做真实浏览器计算样式。将“抽样页面”与“全部页面”分开报告，不能声称 268 页全视觉验收。
- [ ] 三视口 390/768/1440px × light/dark，至少 Chromium + WebKit（Q01/Q03 用 #901 兼容设施，其他共享/全站变化运行适用 WebKit）。依源码支持时补 320px、宽 tablet、200% zoom、print/reduced-motion、键盘/展开态。
- [ ] 实际 `getComputedStyle`：`fontFamily`、`fontSize`、`fontWeight`、`fontStyle`、`lineHeight`、`letterSpacing`、`fontVariantNumeric`；`document.fonts.ready` 后测。页面角色与可读性必要条件用断言，不用简单 CSS 文本包含检查冒充。
- [ ] 几何：`getBoundingClientRect`、`scrollWidth/clientWidth`、真实 line wrapping、裁切、点标-坐标轴间隙、兄弟节点重叠、Figure 外缘，必要时 SVG `getBBox`；允许 2px rounding tolerance，异常更大必须定位 owner。
- [ ] 中英混排规则**不能**只用 CJK 字数除以所有文字行数：Figure C1 曾因此误报；应测真实字体和混排总体字符宽度/行宽，并保留“故意压成 75px 窄栏”的负向案例。
- [ ] 复现旧 9–10px 段落、原生按钮 Arial、SEED 双列窄 lane、移动 Compare 9px 数据、Q03 轴碰撞、SVG title 覆盖、长中文五六个字/行、Dark 低对比等真实 bad case。每例需绿（修正）→ 红（故意恢复旧坏例）→ 绿（撤销注入），在**实际 Gate**里面证明触发；测试代码不能在正常仓库里永久加入坏 CSS。
- [ ] `src/lib/uiSafetyGate.test.ts` 里硬编码旧报错字符串的断言应与真实 browser invariant 同步；若发现误报，应修检测方法并证明还能识别真实坏例（不能简单移除断言）。
- [ ] 截图文件/geometry JSON/trace 在 GitHub Actions Artifacts 存储，写明 job/run/sha/viewport/theme/路径/预期结果。**必须实际查看截图**；截图存在不等于通过。
- [ ] Live Light/Dark Theme 正反切换，页面无不可预期横滚；没有截断状态按钮、标题倒挂、异常花体数字、正文落成小字。

已有命令/测试依次运行，按当前 `package.json` 为准：

~~~bash
node --version                       # repository Node 24.x
npm ci
npm run verify:deploy                # ESLint / Astro / CSS audit / domain / Vitest / integrity
npm run build                        # renders routes and audits typography/math/date/figure
npm run audit:typography             # after build; static inventory only
npm run audit:css
npm run preflight:ui:plan
npm run preflight:ui
npx playwright test tests/e2e/sitewide-typography.spec.ts \
  tests/e2e/typography-method-role-witness.spec.ts \
  tests/e2e/typography-product-tools.spec.ts \
  tests/e2e/layout-anomaly-guard.spec.ts \
  tests/e2e/research-explainer-layout.spec.ts \
  --project=chromium --max-failures=1
npm run test:ui:all                   # full Chromium/WebKit on supported cloud runner
git diff --check
~~~

`public-ci-gate` 是必备的 exact-commit GitHub 合并证据。当前常规 CI full/global 模式分 8 个 browser shard；**不能只引用其它 HEAD 的绿灯**，也不能在只跑 Chromium 时写 “Safari 通过”。

典型可执行见证（仅范式，不替代现有 test helper）：

~~~ts
const actual = await locator.evaluate((el) => {
  const css = getComputedStyle(el);
  const box = el.getBoundingClientRect();
  return {
    family: css.fontFamily,
    px: parseFloat(css.fontSize),
    weight: css.fontWeight,
    italic: css.fontStyle,
    leading: css.lineHeight,
    letterSpacing: css.letterSpacing,
    width: box.width,
    overflow: el.scrollWidth - el.clientWidth,
  };
});
expect(actual.family).toMatch(/Inter|PingFang|system-ui/);
expect(actual.px).toBeGreaterThanOrEqual(13);
expect(actual.italic).toBe('normal');
expect(actual.overflow).toBeLessThanOrEqual(2);
~~~

`getComputedStyle` 只能证明属性，不保证内容理解；同一快照要有人眼检查标题分节、图说、表格密度、不同视觉层级。

### WP5 — 最终真实 Preview（不是 Production）

当前 #898 是 **Draft + base #895 branch**。`scripts/request-vercel-final-gate.mjs 898` 的**代码级硬前置**明确要求：

- PR 是 Open **且非 Draft**；
- base **直接为 `main`**；
- HEAD 完全包含最新 `main`；
- exact-head `public-ci-gate` 来自要求的 GitHub Actions App 且 success；
- 作者 commit identity 可映射 GitHub；
- `ci/vercel-gate-final` 已存在且没有别的 pending gate。

**因此在 #895 尚未合并、#898 尚是堆叠 Draft 时，绝不能为了触发 final gate 擅自重定向 base、改 main 或强制触发 provider。** UI 调整中的预览使用现有 `.github/workflows/review-preview.yml` 的 review-only lane；Codex 可通过已有 Vercel 集成核对 deployed HEAD，减少重复构建。Review Preview 不是 Release Gate。到真正最终阶段，如依赖已合并并经主人同意 Ready，再按当前规则请求 final gate，仍不自动 merge。

每一个交付给主人的 URL 必须是**当前 HEAD**：核验 Vercel deployment meta 提交 SHA、状态 READY、具体主页/Models/Papers/Compare/Workspace/Q03/研究流程 URL、Light/Dark、`noindex`，且必须打开渲染目标。**Vercel 登录跳转后显示的 200 不是目标页面 200。** 遇访问权限限制报告“需登录/无法外部审阅”，不要擅自关闭部署保护。

### WP6 — 最终验收、文档与 Codex 交接

- [ ] 生成最终 `docs/agents/evidence/sitewide-typography/<date>/README.md`：起始/结束 SHA、已改文件和组件数、影响路由数（真实路径，而非猜数）、静态完整路由数、例外 ledger、所有未解决 blocker、CI/Artifacts/截图/Preview 清单。
- [ ] 每类写**结果**与**完成状态**：例如“图中文字不再挤压”有截图/几何证据；“CSS 仍 80 个旧字面值”是迁移状态，不可替代视觉结果。
- [ ] 维护 PR #898 描述，按 WP0~WP6 标 `PASS/FAILED/NOT RUN/BLOCKED/NEEDS HUMAN REVIEW`；每完成一个小包向用户简短汇报一次，附 commit、改动、测试和下一包。
- [ ] 全量 CSS 例外分类 0 未知；残余特殊规则有 owner/理由/触发路由、经过本轮视觉判断，并且未来不会因为审计回归而失控。
- [ ] 对科研的所有数据和 Q01/Q03、其他真实 Figure、Figure Caption / Stats / Source 做事实不变收据，不通过“清理文字”改变已有结论。
- [ ] 不擅自把 `NEEDS HUMAN REVIEW` 写成 `PASS`。如有某部分不能实际运行/预览，请给**准确 blocker、精确文件、失败日志与可执行下一步**，而不是凭绿灯宣布完成。
- [ ] 主人没有批准前，PR 保持未合并，Production 没有变化。

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
