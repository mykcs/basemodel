# arXiv / LaTeX 风格实验表格系列化改造复盘 — 2026-08-31

Status: **historical case / reusable Agent friction record, not current authority**

Conversation scope: 2026-08-31 这一轮围绕 OpenEvo × WebShop 实验报告表格：先把 7B/self 的 WebShop 对比表做得更像论文 / LaTeX，再把同类型实验报告统一到同一视觉语法，并完成 Preview、CI、合并、Production 与清理。

Primary current owners:

- `../current/research-site-presentation-contract.md`
- `../current/human-thinking-web-expression-contract.md`
- `../current/ui-change-visual-acceptance-gate.md`
- `../current/website-engineering-standard.md`
- `../current/deployment-policy.md`
- `../current/release-closeout-protocol.md`

If this file disagrees with current user instruction, current policy, executable repository truth, live GitHub/Vercel state, or current experiment evidence, **this file loses**. PR、SHA、deployment ID 和测试数量只记录这次历史发布链。

## 为什么这轮值得单独复盘

表面上这是一个视觉小改动：把一张已经存在的 HTML 实验表格做得“更像 arXiv / LaTeX”。真正难的地方却有四层：

1. “像论文”到底应该复制截图，还是抽取排版语法；
2. 一页变漂亮后，同一实验系列的 sibling pages 是否也必须统一；
3. 样式重构时怎样不把刚刚在 `main` 上更新的科学文案、历史 Stage-2 边界和测试语义倒回去；
4. 在 `main` 持续移动、Vercel Preview、受保护分支、自托管 CI 和本地浏览器矩阵并存时，怎样证明最终接受的是同一棵树。

最终最重要的结论不是某个 CSS 数值，而是：**实验报告的视觉语法也有“语义所有权”。同一种科研对象应该共享稳定的呈现合同；不同科研对象可以共享论文气质，但不能为了统一外观而被强行变成同一种组件。**

## 最终历史状态

本轮发布最终通过 PR **#373** 合入 `main`。

Historical release provenance:

| Layer | Historical evidence |
|---|---|
| Initial narrow Preview head | `592ae20521ac9ed0576a18e6f9d611965671d84d` |
| Final accepted PR head | `9f0f855a05b45b3366e320b49295091c07c1ea05` |
| PR | `#373` · `style(research): share arXiv-like tables across experiment reports` |
| Exact-head Vercel Preview | `dpl_8o5FDUpPd24ikmugWkhRoRm1YbxN` · `READY` |
| Required self-hosted CI | run `33370213950` / job `basemodel-self-hosted` · `success` |
| Merge commit | `05dc255d47517794258a284e93622ccdc9f89c69` |
| Production deployment | `dpl_43CvDJbGLWccSJ7rQu6i7LTwTSFR` · `READY` |
| Production canonical | `https://basemodel-preview.vercel.app` |

Final implementation scope:

- 7B WebShop score-comparison table keeps semantic HTML but uses a restrained paper / `booktabs`-like grammar;
- the shared `OpenEvoExperimentResultsScaffold` applies the same table treatment to 3B/self、3B/MiniMax、7B/self、7B/MiniMax and the four-arm result matrix;
- `OpenEvoExperimentAnalysisPlan` applies the same editorial grammar to factor-matrix and analysis-plan tables where row/column alignment is still the right semantic form;
- the current presentation contract now says sibling experiment reports should share one paper-like table grammar unless the semantic object genuinely differs;
- a structural test dynamically discovers current `*-analysis` routes and requires them to pass through the shared result scaffold.

This was intentionally **not** a sitewide “make every table serif” migration.

## 对话演进：从一张表到一个系列合同

### 1. 起点不是“重做整站”，而是让一张科研表格更像论文

用户先关注 7B/self 页面里的 WebShop score comparison，希望它更接近 arXiv / LaTeX 论文表格，而不是网站常见的 dashboard table。

这里最关键的判断是：**复制论文的排版语法，不复制论文截图。**

因此保留真实 `<table>` 结构，只改变科研表格的视觉语法：

```text
serif editorial typography
+ compact row height
+ restrained horizontal rules
+ aligned / tabular numbers
+ local best / second-best emphasis
+ theme-safe foreground/background
```

这比把表格截图贴进页面更适合 Web：数据仍可复制、搜索、测试、响应式布局和无障碍读取。

### 2. 第一版证明单页方向成立，但还没有回答“系列是否一致”

第一版 narrow head 已在 Preview 上可用。此时技术上已经可以合并一张表，但用户追加了真正改变 scope 的一句话：

> “合并，记得同样类型的实验报告网页也都有这个。”

这句话把任务从 **single component styling** 提升成 **report-family visual contract**。

### 3. 先找共同 owner，再决定传播范围

没有逐页复制 CSS。先审计 sibling routes 和它们的组件所有权：

```text
3B / self ──────┐
3B / MiniMax ───┤
7B / self ──────┼─> OpenEvoExperimentResultsScaffold
7B / MiniMax ───┤
four-arm ───────┘

four-arm deeper analysis
  └─> OpenEvoExperimentAnalysisPlan
```

这说明真正应该改的是共享 scaffold 和分析表格 owner，而不是五个页面分别打补丁。

同时也明确了传播边界：结果矩阵、checkpoint/result table、factor matrix、analysis plan 都依赖行列对齐，适合共享论文表格语法；实验选择器、状态卡、方法版本 chooser 属于交互工作台，不应为了“统一”被强制改成论文表格。

### 4. “同样类型都要有”随后被翻译成可执行保护

仅靠共享组件还不够，因为未来 Agent 仍可能新增一个 `*-analysis` 页面却绕开共享 owner。

因此新增结构测试：动态扫描 Results 下当前 `*-analysis` 路由，要求它们继续使用 `OpenEvoExperimentResultsScaffold`。测试保护的是 **family participation contract**，而不是把每个像素或每一句文案冻死。

这一步把一次口头偏好变成了未来可发现、可失败、可修复的工程合同。

## 思维上的摩擦与经验

### 1. “像 LaTeX”是视觉语法，不是渲染技术要求

用户说“像 arXiv / LaTeX”时，最容易走向两个过度方案：嵌入论文截图，或在网页里引入真正的 LaTeX 表格渲染。两者都没有必要。

真正有用的是论文表格长期形成的阅读语法：标题/表头克制、规则线少而明确、数字沿列比较、行高紧凑、重点值有限强调。HTML 完全可以表达这种语法，而且更符合现有 Astro/static-first 架构。

### 2. 一致性不等于所有东西长一样

“同类型报告都使用这套风格”必须先回答“什么叫同类型”。按文件夹或页面名统一会把选择器、状态卡、过程图也误伤。

更可靠的判断是看 **semantic object**：

- aligned scientific observations / comparisons -> paper-table grammar；
- interaction / route choice / status control -> workbench grammar；
- causal sequence / curve -> figure / SVG grammar。

因此共享的是读者的比较方式，不是一个万能 CSS skin。

### 3. 样式变更不能覆盖科学语义的新鲜度

本轮修改视觉时，`main` 上同时已有更新过的 Stage-2 reader-facing wording。重新应用旧分支样式时，绝不能因为旧文件更容易 cherry-pick / replace，就把新文案倒回作者速记。

**Presentation ownership 和 scientific-copy ownership 是正交的。** 样式 rebase 必须保留较新的科学语义，除非当前科学证据要求再次改变它。

### 4. 移动端不应该为了“适配”破坏科研对齐关系

390px 下，宽科学表格天然可能比视口宽。错误修复是把每一行拆成 cards，从而让“同一列比较”消失。

本轮采用的边界是：

```text
document-level overflow = forbidden
local table overflow    = allowed
```

实测 390px 页面本身保持 `scrollWidth == clientWidth == 390`；表格 wrapper 内部可以有 720px / 880px 等自然宽度并局部横向滚动。这样既保留表格语义，也不让整页横向漂移。

### 5. 自动化应保护“加入系列”，不要保护一次性像素快照

动态发现 `*-analysis` 页面，比手写一个永远会过期的五页列表更能覆盖未来 sibling。与此同时，测试只要求共享 scaffold 与关键 paper-table grammar 存在，不把某个具体 padding、某一句标题或一次历史数字永久冻结。

这是这轮对“设计偏好可执行化”的核心判断：**保护稳定语义，允许可演进表达。**

### 6. 昂贵验收要和树变化的真实风险匹配

完整 Chromium + WebKit UI matrix 花了约 7.3 分钟。验证期间 `main` 又前进了一个 docs-only、与运行时文件不重叠的 commit。

正确处理不是机械地把所有昂贵测试再跑一遍，也不是完全忽略 moving main；而是先做 semantic-overlap classification。同步后，运行时产品树仍与已验收候选一致，因此补跑 targeted 18 tests + Astro diagnostics 足以确认同步没有改变本轮 UI acceptance assumptions。

如果介入的是 shared CSS、组件、测试 owner、部署配置或科学事实，这个结论就不成立，必须重新执行对应完整验收。

## 工程摩擦与恢复方式

### Friction 1 — stale exact-string test 把旧文案当成了永久合同

第一次完整 `preflight:ui` 并不是在 CSS 上失败，而是 deterministic Gate 里 `openEvoExperimentResultLanguage.test.ts` 仍要求旧字符串，例如旧的 block / partial-rollout 速记。

这时最危险的修法是把页面文案改回旧表达来迎合测试。

正确分类是 **stale test contract**：`main` 已经接受新的 reader-complete scientific copy，因此更新测试去保护当前语义——完成多少任务尝试、多少完整批次、何时主动停止、是否触发参数更新——而不是保护旧作者速记的字面拼写。

修复后 targeted semantic tests 为 **18/18 PASS**，随后完整 preflight 通过。

### Friction 2 — moving main 后用脆弱字符串手术重放 patch 失败

为了同步更新后的 `main`，曾尝试用 Python 按大块 substring 把旧候选的样式片段重新塞回新文件。因为周围内容已经变化，直接得到 `ValueError: substring not found`。

这个失败发生在 mutation 之前，反而及时暴露了策略不稳。

恢复方式是先比较 new/bak 的精确 marker 和 diff，只重新应用真正属于本轮的 style / test delta，同时保留 `main` 较新的科学文案。

**Reusable rule:** moving-main 场景里，大段 find/replace 的“方便”很容易跨越 semantic ownership；优先使用最小、可定位的 patch，并在重放后检查三点 diff。

### Friction 3 — 本地 preview 端口已经被别的任务占用

尝试启动 Astro Preview 时，CLI 报告已有 preview server 在运行。这里不能为了抢一个熟悉端口就杀掉现存进程，因为同一台机器可能同时有其他 Agent / worktree 在验收。

恢复方式：确认 owner，复用合适的已有服务或给当前 worktree 使用独立端口；收尾时只终止本任务启动的服务。本轮最后清理的是任务自有的 4462 server，没有动无关进程。

### Friction 4 — protected Preview 的临时 share link 不等于本地浏览器一定能消费

Vercel Preview 本身已经 `READY`。但把临时 `_vercel_share` URL 交给本地 Playwright 时，浏览器仍被带到 Vercel SSO/login，说明这条本地自动化路径没有成功建立需要的认证 cookie/session。

这不是应用 404/500，也不是 Preview 构建失败。

正确分类是 **provider/auth boundary**：不要为了制造浏览器 PASS 去关闭保护；优先使用 Vercel 原生 authenticated fetch / provider metadata 验证受保护 deployment，并把匿名 browser-review 能力和应用健康分开。

### Friction 5 — Vercel 列表里同时存在旧 ERROR 与当前 READY

历史 `main` deployment 中有之前失败的构建；如果只看“最近有红色”，很容易误判这次候选仍失败。

正确做法是按 exact SHA / branch / deployment ID 定位：本轮 accepted Preview 对应 `9f0f855...` 并达到 READY，合并后的 Production 对应 `05dc255...` 并达到 READY。Provider state 必须绑定到 acceptance identity，而不是绑定到项目名字。

### Friction 6 — disposable worktree 里的 `node_modules` 不能进入提交

为了复用本地依赖，隔离 worktree 在验证过程中出现了未跟踪的 `node_modules`。这属于执行环境，不属于产品 diff。

每次 commit 前都重新检查 `git status`，只提交目标源文件/文档；依赖目录没有进入 Git。以后遇到类似 worktree dependency reuse，也应把“能运行”与“应该提交”分开。

### Friction 7 — 默认 shell 是 fish，Bash compound syntax 会直接失败

本轮一个 `if ... then ... fi` worktree setup command 在默认 fish 下解析失败。没有产生部分写入，但浪费了一次执行。

恢复方式是对 heredoc、`set -euo pipefail`、Bash compound command 明确选择 `/bin/bash`，不要假设远程执行工具的默认 shell 是 Bash。

### Friction 8 — provider / CI 的“正在跑”不需要高频盯盘

Self-hosted CI 的 deterministic verification、build 和 risk-based browser acceptance 都在正常推进；Vercel 也有明确 BUILDING → READY 状态。过程中进行了多次近距离状态读取，信息增量很低。

当前 `LATEST.md` 已经规定 provider wait discipline：一次即时读取、必要时一次短 recheck；如果没有 actionable failure，就继续独立工作或留下 resume checkpoint，而不是用对话时间反复 poll。

这次结果没有因此出错，但它是明显的效率摩擦，应作为反例保留。

### Friction 9 — cleanup 不是可选礼节

合并和 Production READY 后，任务还没有完全结束。最后显式清理了 task-owned preview server、临时 worktree、local branch 和 remote task branch，并确认 merge 已被 `main` 包含。

短命的 branch/worktree/server 如果长期留下，会让未来 Agent 更难判断哪个 checkout、端口和 ref 才是当前权威。

## What worked well

### 共享 semantic owner 比逐页复制样式更可靠

一处 scaffold 改动自然覆盖四个 single-arm 报告与 joint result matrix；分析计划再由自己的 table owner 继承同一 editorial grammar。这样新增科学事实仍由各页面控制，而表格阅读语法由共享 owner 控制。

### 先做本地全矩阵验收，再花 provider build

本轮 shared UI 被 `preflight:ui` 分类为 shared，先在支持 WebKit 的 macOS 上完成 deterministic Gate、production build、overflow preflight 和 Chromium + WebKit **204 tests**，再推动 exact-head `[vercel-preview]` commit。

这符合“Vercel 是部署/真实环境验证，不是第一个发现 CSS 问题的地方”的当前架构。

### 实际看 sibling pages，而不是只相信 shared CSS

手工/脚本抽样了 7B/self、3B/self、7B/MiniMax、four-arm 的 desktop/mobile table geometry。结果证明共享规则没有让页面级 document overflow 失控，也证明 factor/plan table 在窄屏上可以保留表格身份。

### 合并与 Production 分层验证

`basemodel-self-hosted` required check 终态 success 后，按 expected head 合并。之后单独等待 `main@05dc255...` 对应 Production deployment READY，再用 provider-native fetch 读取公开 7B/self、3B/self、four-arm 路由，确认 HTTP 200 与新共享结构已经出现在 Production。

这避免把“PR 已 merge”误写成“用户已经能看到”。

## Smallest reliable workflow for the next Agent

遇到“把这一张科研表格做得像论文，并让同类报告统一”的任务时，按这个顺序最稳：

1. 先读 current research-presentation / expression / UI acceptance owners，并写一个简短 Page Expression Brief。
2. 明确“论文感”要保留的 semantic grammar：表格、数字列、规则线、强调层级，而不是复刻截图。
3. 找到当前页面的 sibling family 和 shared component owner；不要先复制 CSS。
4. 按 semantic object 分类：哪些是 aligned scientific table，哪些是 selector / status / figure，避免过度统一。
5. 在 shared owner 上实现最小视觉规则，并让颜色依赖现有 semantic tokens。
6. 对窄屏保留表格语义：wrapper local scroll，document 不横向溢出。
7. 给 family participation 增加结构 guard；优先动态发现未来 sibling，而不是冻住一份手写路由名单。
8. 跑 focused tests，确认样式修改没有把科学文案或动态状态倒回去。
9. 对 shared/global UI 运行 `preflight:ui`，在 provider push 前完成需要的 Chromium/WebKit 矩阵。
10. 若 `main` 在昂贵验收后移动，先做 semantic overlap classification；只有会改变 acceptance assumptions 的变化才要求重跑完整昂贵矩阵。
11. 只在 exact candidate head 准备好时添加 `[vercel-preview]`，确认 Preview metadata 指向该 SHA。
12. 等 required CI 终态；用 expected-head merge 防止 head race。
13. Production 单独验证 exact merged SHA、terminal provider state 和代表性真实路由。
14. 清理 task-owned branch、worktree、ports 和临时服务。

这套流程的目标不是让所有实验页面“长得一模一样”，而是让同一种科研比较对象使用可预测的阅读语法。

## Anti-patterns to avoid

不要重复这些做法：

- 把“像 arXiv”理解成把论文截图或 PDF 表格嵌进网页；
- 为了统一视觉，把 selector、status card、figure 和 scientific table 全部套成同一个组件；
- 只修用户点名的 7B/self，而不检查同一 experiment-report family；
- 给五个 sibling 页面复制五份几乎相同的 CSS；
- 为了 390px 把需要列对齐的科研表拆成失去比较轴的 cards；
- 用旧 branch 的整文件覆盖新 `main`，从而复活已经淘汰的科学文案；
- 当 current copy 已经改变时，反过来修改产品去满足 stale exact-string test；
- 把旧 Vercel ERROR/CANCELED deployment 当成当前 exact-head 的状态；
- 因 protected Preview 的本地 SSO 自动化失败就关闭认证或宣布应用坏了；
- `main` 每移动一个 docs-only commit 就无条件重跑整个昂贵 cross-browser matrix；
- provider 正常 BUILDING 时高频轮询；
- 合并后留下 worktree、端口、remote branch 或执行环境目录让下一位 Agent 猜用途。

## Historical-state boundary and refresh cue

这份记录描述的是 PR #373 的设计与发布过程。以后不要把这里的具体 commit、测试数量、Vercel deployment ID、CSS 数值或当前 route 列表当作永恒事实。

未来真正应该复用的是判断方法：**同类科研对象 -> 找 shared semantic owner -> 抽取稳定阅读语法 -> 保留语义差异 -> 用结构测试保护 family participation -> 按 exact tree 做成本匹配的验收。**

如果 Astro、CSS ownership、Results route family、Vercel policy 或实验报告信息架构已经变化，先刷新 current owners 和 executable source，再决定这套实现还是否适用。

## Related current owners and historical cases

Current owners first:

- `../current/research-site-presentation-contract.md` — research table grammar、结果可见性和 progressive disclosure；
- `../current/human-thinking-web-expression-contract.md` — semantic shape、information density 和 Page Expression Brief；
- `../current/ui-change-visual-acceptance-gate.md` — shared UI 的 pre-provider、responsive、theme、Chromium/WebKit acceptance；
- `../current/website-engineering-standard.md` — shared semantic owner、exact-tree evidence、provider spend 和 cleanup；
- `../current/deployment-policy.md` / `../current/release-closeout-protocol.md` — exact-head Preview、required CI、merge 和 Production boundary。

Complementary historical cases:

- [`2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md`](2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md) — 论文分数表转 HTML、MiniMax stale Pending、新鲜科学事实和 mobile table boundary；
- [`2026-08-31-openevo-readable-result-language-and-release-retrospective.md`](2026-08-31-openevo-readable-result-language-and-release-retrospective.md) — `20,480 -> 797 -> 8 -> 7 -> 0` 的 reader-complete wording、多 PR 与 release friction；
- this file — 从单个 7B table 的 paper-like refinement 推导到整个 capability-exploration report family 的 shared visual contract、测试与 release closeout。

最值得保留的一句话是：**科研网站的一致性不是“所有组件使用同一种皮肤”，而是“同一种科学关系使用同一种阅读语法，并由真正的共享 owner 和测试来保证”。**
