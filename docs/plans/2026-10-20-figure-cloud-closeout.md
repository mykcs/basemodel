# BaseModel：学长十问科研图表、全站同类 Figure、云端浏览器与读者验收——Codex 工程交接

> **接手入口**：[PR #901](https://github.com/mykcs/basemodel/pull/901)；主分支 `main`。  
> **文档性质**：代码级执行计划、交付标准和阻塞检查，不是完成证明。  
> **核查快照**：2026-10-20。执行前重新读取 PR/head、`main`、CI、Vercel；本文 SHA 均为有日期的历史记录，不能视为后续常量。  
> **明确排除**：全站字体家族、字号系统、字重、斜体、type tokens、大范围 Typography CSS 重构。用户已交给另一窗口。**不要推进或合并含有该混合改造的 #895。**

## 0. 一句话目标、范围及已完成证据

目标不是“再写一份设计建议”，而是把用户截图发现的研究图表缺陷转化成**云端可执行、可复核、能阻止再次漏检的工程验收**。同时清理科研图表同类问题，保留证据与读者理解边界。默认工具链：**GitHub / GitHub Actions / Playwright 云端 Chromium + WebKit / CI Artifacts / Vercel**；MacBook、RDC、个人 SSH 不是正常执行路径。

已经完成、不要重复做或错误重开：
- [x] 学长十问表达与十问摘要、红黄绿状态、局部结论/未知、原始收据：[#893](https://github.com/mykcs/basemodel/pull/893) 和 [#894](https://github.com/mykcs/basemodel/pull/894) 已合并。
- [x] 用户截图 Q03 A0=3.71 标注碰到纵轴、原生 SVG `<title>` 遮挡、论文式单图外框问题；Q01 和 SD-LoRA Scaling 同类问题：[#897](https://github.com/mykcs/basemodel/pull/897) 已合并并验证 Production。
- [x] GitHub-first 执行规则、Public PR CI 自动保存 Playwright 失败截图/trace/video：[#900](https://github.com/mykcs/basemodel/pull/900) 已合并，至少一份真实 Artifact 下载验证。
- [x] #901 最新已运行的云端 `Cloud Figure Visual Review`：Chromium/WebKit **均曾在 SHA `dd54b0a1a31f669780c26ee40eb3a11615d774cb` 上 SUCCESS**（Actions run [39423672032](https://github.com/mykcs/basemodel/actions/runs/39423672032)），并生成两个浏览器的 PNG/JSON Artifacts。**这是历史提交的证据，改动后需要新的 exact-head 成功结果。**
- [ ] #901 Public PR CI：该 SHA 上失败（Actions [39423671896](https://github.com/mykcs/basemodel/actions/runs/39423671896)），原因是旧工作流 allowlist 未包括新增的云端 Figure Workflow，而不是 WebKit 页面回归。
- [ ] #901 尚未合并；当前候选落后 live `main` 一个或多个提交。最新主分支有 Q10/首屏/科研解释相关更新，尤其修改了同一份 `advisor-figure-paper-collision.spec.ts`。**必须做语义合并，不能用旧分支直接覆盖。**
- [ ] 站点全部科研 Figure 的逐张可视验收和独立零上下文阅读试验仍未全部完成；不要把“73 张 Figure 的静态清点”冒充“73 张均视觉通过”。

## 1. 科研展示必须遵守的读者/证据合同

受众：同时管理多个项目、未必跟上最新进展的老师，以及几个月后重新查看证据的研究者。研究网页需要读者快速回答：**讨论的是什么、已经得到什么结论、怎么测的、仍缺什么证据、先做什么下一步**。

必须同时保留：
1. Q03 历史 Stage2 保存点 `A0/A40/A80/A120`，各自 Task Score `3.71/6.43/0.69/6.62`（满分 100），自定义 64 道题，每个保存点完整成功 `0/64`；图轴只放大显示 `0–10`，不能暗示满分 10 分。
2. 仅四个实测点之间作**虚线连接**，中间轮次没有测量，不能叫连续训练曲线；不能与 SEED 论文的独立 128 题结果当作同题对照。
3. Q01 三条方法和冻结 33 个曲线点、Q04/Q07 等置信区间、论文引用和可恢复的原始来源；**不得**为视觉优化虚构点、置信区间、完成状态，或抹去 `NOT_RUN`、未知与论文协议差异。
4. 图 2 采用类似最终 LaTeX `figure` 的**紧凑单栏、无多余网页卡片边框/阴影、图题—SVG—图注阅读顺序**；Q01 多系列图依真实信息密度选择宽度。只借鉴科学对象，不把整站做成 ICLR 双栏排版。
5. 数值与坐标轴实际不碰撞。用 SVG `getBBox()` / 页面计算尺寸检验，不能只检查源 SVG 的 `x` 数值；图缩小时必须测得最终字符可读。保留 `aria-label` + `<desc>`，消除会覆盖图形的原生 `<svg><title>` 悬浮框。
6. 简洁的图注要说明单位、分母、裁剪、统计边界及来源；图上已有的四个数字不必完整复述成两段。科研 `table` 使用真正 `<table>` 和 `booktabs` 风格，不为视觉效果插入无意义的“第一行加粗”或逐行粗边线。
7. 符合 `docs/wish/LATEST.md`、`docs/agents/current/ui-design-principles.md`、`docs/agents/current/research-result-reading-contract.md`、`docs/agents/current/site-reader-attention-contract.md`、`src/AGENTS.md` 及 Project Report Skill。曾提到 OpenClaude、苏剑林的科学空间、asloppy 和 OpenAI 技术博客作为阅读/图表设计参考；不能未经核实声称完全复刻，也不能直接复制受版权保护的样式/内容。

### 必须保存的主人反馈及失败机制

- “这个表格没有按照 LaTeX 的格式做，或者没有仿照模拟 LaTeX 的样子做。”
- “我之前说要把这一类问题都解决掉，但还是有很多漏网之鱼，说明你没有做好。”
- “其他事情我要求的肯定也有漏网之鱼，你没有做好。”
- “我的整个 BaseModel 里，不同字体大小、字号、字体大小、粗细、斜体都不规范，都要统一规范一下。”

第四条被用户**之后明确交给另一窗口**，本 PR 不再改 Typography。前三条要求的是从一个反例推广到同类审计、避免假绿色，并有可追溯、可回放、可证伪的验收。涉及保存 RAW/派生工程经验时，使用中央 `mykcs/.agents` 学习/Closeout 机制，按仓库规范保留原话和出处；不要只写空泛的设计原则。

## 2. 阶段目标 → 可执行清单（Codex 按顺序逐项勾选）

**状态纪律**：本节是**待执行任务**，只有在本 PR/关联 PR 留下**精确代码 SHA + 真实测试或人工验证链接 + 可查看交付物**后，才能将对应 `- [ ]` 改为 `- [x]`。旧 SHA 的历史 PASS、原设计已写好、CI 仅排队、Vercel READY 或自动扫描清点，都不能自动代替当前验收。未获真人反馈的冷读任务必须保持未勾选并标记 `NEEDS_READER`；被阻塞请保留 `[ ]` 并写清 blocker。仓库 Policy/Owner 变更时优先遵从现行约束，不能为了按表执行而覆盖其他窗口。

### WP-00｜同步最新代码与分工（所有写入的前置依赖）

- [ ] **00.1 读取规范**：GitHub 读取 `AGENTS.md`、`src/AGENTS.md`、`docs/wish/LATEST.md`、当前 UI/Reader、branch、deployment、release-closeout 合同，记录读过的文件路径/必要版本；不能只依据本交接文档。
- [ ] **00.2 核对远端身份**：读取 PR #901 的 `state/base/head SHA`、live `main SHA`、`merge-base`、`main...HEAD` 文件清单、当前 check runs、开放的重叠 PR（特别是 #895 和科研 Q10 相关 PR）。产出 `BASE_SHA / HEAD_SHA / OVERLAP` 文字收据；更新前发现 head 改变则重新读取。
- [ ] **00.3 锁定明确范围**：确认字体/字号/字重/斜体/Token 由另一个窗口负责，本 PR 只改科研 Figure 云端验收、非字体的图表质量与必要的测试/计划；将重叠路径和责任人/PR 链接写在 #901。
- [ ] **00.4 做前置失败复现**：抓取 `Public PR CI` 上实际第一条失败断言、Cloud Figure 两浏览器运行/Artifact 及其 SHA；分类为代码、陈旧测试、环境或科学内容问题，并留日志 URL。**验收**：PR 中有可核查的基线与 blocker，而不是猜测。
  
### WP-01｜修正 CI 架构白名单，不放宽安全约束（依赖 WP-00）

- [ ] **01.1 修改准确 owner**：在 `src/lib/deploymentArchitecture.test.ts` 把 GitHub Workflows **精确允许列表**改为四项：`cloud-figure-visual-review.yml`、`public-pr-ci.yml`、`review-preview.yml`、`self-hosted-ci.yml`；保留对未知第五码 workflow 的 fail-closed 检查。
- [ ] **01.2 补安全负例**：验证云端 Figure Workflow 有 read-only `permissions`、固定 action/container 身份、受限 `workflow_dispatch` / PR head、`chromium + webkit`；对新添加未知 workflow、`pull_request_target`、`push`/未授权部署、写权限的危险反例应实际 FAIL（不要删除旧断言）。
- [ ] **01.3 运行确定性验收**：对当前 head 实际执行 `npx vitest run src/lib/deploymentArchitecture.test.ts`、`npm run verify:deploy`、`npm run build`；**验收**：三个命令退出码 0，当前 SHA 的 CI 日志能证明，旧红灯不再重现。
- [ ] **01.4 保存防回归收据**：在 #901 留下具体修改行、负例被拦住的测试名称/日志，以及“没有削弱 required checks”的说明。

### WP-02｜合并最新 Q10 首屏科研语义与云端截图功能（依赖 WP-00）

- [ ] **02.1 双向对比同名文件**：`git diff main...HEAD -- tests/e2e/advisor-figure-paper-collision.spec.ts` 加上 `main` 单独提交审查，明确识别**新版** Q10/会议 RAW/`site-reader-contracts.spec.ts` 约束和旧 #901 图片输出；不做整文件 `ours/theirs`。
- [ ] **02.2 保留新的科研与首屏断言**：当前 main 的 Q10“新题冻结、正式训练未完成”、Q01–Q10 证据边界、会议 RAW 位置及阅读优先级必须原样保留，不能复活过期的固定“首屏正好两个旧链接”测试。
- [ ] **02.3 只移植证据生成逻辑**：在新版 `advisor-figure-paper-collision.spec.ts` 有限添加 `testInfo.outputPath`、`q03.screenshot`、`q01.screenshot` 和 `writeFileSync` 几何 JSON；PNG/JSON 存在于测试运行的 `test-results`，绝不把旧产物当成新构建。
- [ ] **02.4 保护科学不变量**：断言 Q03 `A0/A40/A80/A120`、`3.71/6.43/0.69/6.62`、`0/64`、局部纵轴 `0–10`、非 SEED 论文 128 题同源评测；Q01/Scaling 的图形、来源链接、读屏 `aria-label + desc` 均仍在。
- [ ] **02.5 证明防撞检测真的有用**：实际运行 `getBBox()` 首点-纵轴间距与手机/桌面负例（临时恢复 `x=88` / `xPhone=50` 必须被判失败）；运行 `npx playwright test tests/e2e/advisor-figure-paper-collision.spec.ts tests/e2e/advisor-paper-figure-suite.spec.ts --project=chromium`，**验收**：新版阅读测试与图表几何均在同一 HEAD PASS。

### WP-03｜云端 Chromium/WebKit 与可恢复截图证据（依赖 WP-01、02）

- [ ] **03.1 核实运行时**：`package-lock.json` 的 `@playwright/test` 版本与 `.github/workflows/cloud-figure-visual-review.yml` 的 Playwright Noble 镜像及 immutable digest 一致；不再发生 `webkit-2359/pw_run.sh` 缺失，也不随意改成 `latest`。
- [ ] **03.2 完成安全云端 Workflow**：明确 PR/`workflow_dispatch` 的输入与目标 head、`contents: read`、`persist-credentials: false`、无 `pull_request_target` / Mac/RDC / Production secrets；`git rev-parse HEAD` 与 PR head 身份一致。
- [ ] **03.3 运行双浏览器**：同一最新 HEAD 在 GitHub-hosted Ubuntu/Playwright cloud runner 上执行 `chromium` 和 `webkit` 的科研图专项测试（包括 390/768/1440、light/dark）。**验收**：两个 job 均 `completed/success`；旧 SHA 的绿灯不能充数。
- [ ] **03.4 核对真实 Artifacts**：每个引擎从 GitHub Actions 产出非空 `.png` / `.json`，Q03 目标 6 组 viewport×theme 图、Q01 目标 4 组图与各组六份几何 JSON（若当前测试设计变化，先明确准确计数）；上传 `trace.zip`/video 失败证据并设置 3 天保留。
- [ ] **03.5 下载与核验**：通过 GitHub Artifact API 下载**当前 SHA** 的 Chromium/WebKit ZIP，检查图像能打开、JSON 值是实际浏览器测量（如 `bbox`、rendered font-size、axis gap）、来源路由正确；在 PR 留 `run URL + artifact ID/name/size + 抽查结果`。无文件、错 SHA、仅有 200 登录页都不算 PASS。

### WP-04｜科研 Figure/Table 同类缺陷系统盘点（依赖 WP-02、03；新产品改动独立聚焦 PR）

- [ ] **04.1 清点全部生成对象**：在新鲜 `npm run build` 的 `dist/` 上执行 `node scripts/audit-sitewide-research-figure-widths.mjs --snapshot /tmp/basemodel-figure-current.json`；读取全部路线/`figure`/`table`，**记录本次真实总数**，旧 268/73/130 只作为历史参考。
- [ ] **04.2 为每张对象标 owner**：给每张 Figure 和 Table 记录 `route / figure_id / owner component / scientific-or-structural role / single-double-workflow-slide / source identity`；生成可以审核的行级清单，漏 owner 或不明角色标 `BLOCKED`。
- [ ] **04.3 执行几何与内容扫描**：用云端 Playwright 在 390/768/1440 与 light/dark 对有意义的科研图检查图例/轴/文字 `getBBox` 与矩形碰撞、真实渲染字号、水平溢出、遮挡型 SVG tooltip、表格 `booktabs`/局部横滚、科学来源及不可比数据声明；对投影/工作流/slide 按自身语义测试，不强套单栏 LaTeX。
- [ ] **04.4 给每张图明确证据状态**：只有有真实截图或可复核几何/读者证据的对象才标 `PASS`；缺少视觉核对的明确标 `NEEDS_VISUAL_REVIEW`，失败给 `FAIL` 和 route+截图；**验收**：`PASS + FAIL + NEEDS_VISUAL_REVIEW + BLOCKED = 实际本次审计总数`，禁止把 inventory 当成全通过。
- [ ] **04.5 按 owner 聚类修复**：真实重复错误先修共用组件再加有意退化的负例；跨越 CI 目的的新 UI/CSS 修复单独窄 PR，链接 #901。遇到字体体系则提交可复现发现给 Typography Agent，**不修改其所有文件**。
- [ ] **04.6 输出完成/未完成清单**：在 #901 提供版本化 inventory 路径或 Artifact 链接、修复 PR 链接以及仍需人工审查的确切 Figure/Table 数量；不能仅报“扫描过 73 张”。

### WP-05｜表达科学边界与真实冷读（依赖 WP-02；可与 WP-04 后段并行）

- [ ] **05.1 逐问核对来源**：检查 Q01–Q10 速览与详细报告、科学状态和证据成熟度、三条历史训练路线并非完全受控对照、Q03 64 题与 SEED 128 题不同协议、Q10 “确认题已冻结但正式训练尚未开始”。
- [ ] **05.2 阅读层验收**：检查 390/768/1440 下首屏一个中心、目录/图号/图注顺序、适度的链接数量、读者能找到 RAW 与完整技术细节；跑当前 `tests/e2e/site-reader-contracts.spec.ts` 与 `src/lib/openEvoAdvisorFirstViewport.test.ts`，不恢复过时的硬编码文字。
- [ ] **05.3 独立真人 30 秒冷读**：邀请真正零上下文读者复述研究问题、已经有证据的一个结论、一个未完成问题及下一步；记录原话、误读位置、测试条件。**若无人参加，此项不勾选**，在最终状态写 `NEEDS_READER`，不能用 Codex 角色扮演冒充真人。
- [ ] **05.4 按原话沉淀错误模式**：对照用户截图和原话记录“论文式图未落实、同类漏网、CI 假绿”等真实机制，使用中央 Closeout 规则；只把可证实工程结论写进可复用规范。

### WP-06｜精确提交、Vercel、合并与 Production（依赖 WP-00～05 中所有机器可完成项）

- [ ] **06.1 再核对并发**：合并前重新获取 live `main SHA` / PR `head SHA`、merge-base、changed paths 与科学权威；如果 main 更新了同文件，先语义集成再重新验收，禁止强制覆盖与复用旧 SHA 的 PASS。
- [ ] **06.2 跑仓库必需门禁**：确保当前 HEAD 的 `npm run verify:deploy`、`npm run build`、Public PR CI 的风险规划 browser shards 及 `public-ci-gate`（App 15368）均为 `completed/success`，同时 WP-03 双浏览器与真实 Artifact 在该 HEAD 通过。
- [ ] **06.3 申请唯一最终 Vercel Gate**：仅在 06.2 PASS 后执行 `node scripts/request-vercel-final-gate.mjs 901` 或严格等价的 GitHub/Gate ref 操作；先绑定 `ci/vercel-gate-base=live main`、`ci/vercel-gate-final=PR exact HEAD`，避免试探性 Preview 构建与无效 refs。
- [ ] **06.4 实际打开 Preview**：核对 Vercel 对象 `READY`、`meta.git SHA=PR HEAD`、`noindex` 和真实 `data-report-figure="q03-custom-curve"`/Scaling 路由，浏览器应显示 BaseModel 正文而非 Vercel 登录页；做桌面/手机 light/dark 的最终视觉审读。
- [ ] **06.5 依法合并或明确停下**：只有所有强制 checks 与当前 base 符合仓库保护规则、无未解科研/产品阻塞，才用带 `expected_head_sha` 的 PR merge；否则 PR 保持开放，列出阻塞而不伪装完成。
- [ ] **06.6 合并后独立收口**：读回 `main merge SHA`、Production 的 `READY` 或 docs/CI-only `IGNORED/CANCELED` 的合规原因、正式 alias 的对应 SHA 与实际 Figure 路由；**不能用 Preview PASS 代替 Production**。保留匿名可审核的链接/收据。

### WP-07｜Conversation Closeout 与交付收据（WP-06 后；真实未完可独立归档）

- [ ] **07.1 按包汇报**：每完成 WP-00…WP-06 一个工作包，在 PR 评论写 `PASS / PARTIAL / BLOCKED`、文件/commit、所跑命令及结果、当前阻塞与下一任务；不可在交付之前虚标 `[x]`。
- [ ] **07.2 归档逐字反馈与复现**：按 `mykcs/.agents` 的 Conversation Closeout 规范保存适用 RAW/设计原则，记录 Q03 轴碰撞/原生 tooltip、WebKit 1.62↔1.63、旧 Workflow allowlist、主分支 Q10 语义竞争及“不能用绿色代替阅读”的反例。
- [ ] **07.3 记录真实发布证据**：给出 PR URL、HEAD/merge/main SHA、GitHub CI 两种浏览器 URL、Artifact 名称/大小/截图、Vercel Preview/Production、Figure/Table 数量与验收率、冷读状态；有明确 `NEEDS_READER` 或剩余问题单。
- [ ] **07.4 最终 ELI5 核对**：回答“原问题是什么／确实修好什么／仍没做完什么／如何避免重复”；不得把 Codex 计划清单勾选完当作外部科学或真人验收完成。

**执行关系**：WP-00 →（WP-01 与 WP-02）→ WP-03 → WP-04；WP-05 的机器审核可与 WP-04 后段并行，真人验收仍独立；WP-06 仅在强制机器 Gate 真通过时继续；WP-07 持续保存收据。**本节下方第 3～10 节是每包的代码与证据细节，不代表已经执行。** 大型新增视觉缺陷另开小 PR，不把 #895/Typography 和无关网页混入 #901。

**每勾一项的收据格式**：`WP-xx.yy | STATUS | changed file(s) | exact commit SHA | command/run URL | Artifact/Preview/Source URL | unresolved blocker`。不能提供必要证据就保持未勾选。

## 3. WP-00：开始写代码前的精确基线清单

优先通过 GitHub 插件和 GitHub Actions，不占用 MacBook/RDC。Codex 若使用隔离 cloud checkout，应证明是最新 PR 分支的 Git tree，不要读此前聊天留下的 `dist/` 当作新版。

执行前读：
- `AGENTS.md`、`src/AGENTS.md`、`docs/wish/LATEST.md`、`docs/agents/current/branch-and-pr-conventions.md`、`docs/agents/current/deployment-policy.md`、`docs/agents/current/release-closeout-protocol.md` 和 `docs/agents/current/ui-change-visual-acceptance-gate.md`。
- PR [#901](https://github.com/mykcs/basemodel/pull/901) 的 live head/base、changed-file 列表、open/merged、review comments、最新 check runs；以及 #895（Typography，其他窗口）、已合并 #897/#900。
- 读取 `main` 上最新 Q10 页面和测试，不相信旧 PR body 内关于 Q10 的文字/目标、旧 SHA 或 2026-10-19 的科研阶段能代表现在。

可用的只读示例（命令只作操作草图，按照已连接插件能力调整）：

```bash
gh pr view 901 --repo mykcs/basemodel --json number,state,headRefOid,baseRefOid,files,statusCheckRollup
gh api repos/mykcs/basemodel/branches/main --jq '.commit.sha'
git fetch origin main
git merge-base HEAD origin/main
git diff --name-status origin/main...HEAD
git diff -- src/lib/deploymentArchitecture.test.ts tests/e2e/advisor-figure-paper-collision.spec.ts
```

报告：`base_SHA`、`head_SHA`、`merge_base`、main-vs-PR 文件差异、重叠权限、最新 CI URL。若 main 在验收期间移动，再做并发核对，而不是强行覆盖。

## 4. WP-01：旧工作流 allowlist 测试——保留 fail-closed，不能放宽

**已复现证据**：Public PR CI [39423671896](https://github.com/mykcs/basemodel/actions/runs/39423671896)，`src/lib/deploymentArchitecture.test.ts:36`。旧断言要求只有：

```ts
['public-pr-ci.yml', 'review-preview.yml', 'self-hosted-ci.yml']
```

但是 GitHub 已合法新增 `.github/workflows/cloud-figure-visual-review.yml`。修复应该是**明确列出唯一允许的四个 Workflow**，不是去掉 workflow 白名单，或改成 `toContain` / 只检查数量 / 随意跳过测试。

建议改成：

```ts
const allowedWorkflowFiles = [
  'cloud-figure-visual-review.yml',
  'public-pr-ci.yml',
  'review-preview.yml',
  'self-hosted-ci.yml',
];
expect(workflowFiles).toEqual(allowedWorkflowFiles);

const cloudFigureWorkflow = readText('../../.github/workflows/cloud-figure-visual-review.yml');
expect(cloudFigureWorkflow).toContain('workflow_dispatch:');
expect(cloudFigureWorkflow).toContain('runs-on: ubuntu-24.04');
expect(cloudFigureWorkflow).toContain('browser: [chromium, webkit]');
expect(cloudFigureWorkflow).toContain('retention-days: 3');
expect(cloudFigureWorkflow).toContain('persist-credentials: false');
expect(cloudFigureWorkflow).not.toContain('pull_request_target:');
expect(cloudFigureWorkflow).not.toMatch(/\n\s*push:/);
```

还要检查：只用 read-only 权限、不在 fork PR 下暴露密钥、不直接 deploy Production、不自动修改 Git refs、动作 pin SHA、Playwright Linux 运行时与锁文件版本一致。对于 YAML `on`、权限等可以使用已存在的可靠解析器，不要因为匹配文本可被注释欺骗而降低安全性；新增负例测试确认插入未知 Workflow 或 `pull_request_target` 会变红。保留 `self-hosted-ci.yml` 的手动 fallback 安全约束，不删除其他架构断言。

验收：

```bash
npx vitest run src/lib/deploymentArchitecture.test.ts
npm run verify:deploy
npm run build
```

上述命令须在 **当前 PR 结合当前 main 的同一 tree** 上执行。先检查第一个真实错误，不得仅为了绿灯提高超时/降低断言。

## 5. WP-02：保留最新 main 的科学阅读逻辑，叠加截图改动

当前冲突点：#901 与 `main` 都修改 `tests/e2e/advisor-figure-paper-collision.spec.ts`。旧 #901 的末尾测试要求首屏两个具体链接；之后 `main` 引入 **Q10 新任务证据 + meeting RAW 的新阅读顺序**：

```ts
test('phone reader gets a Q10 decision route and can still find the meeting RAW', ...);
```

**以最新 main 当前读者/科研合同为准**，不能把 #901 旧整文件覆盖回去，更不能为了保留旧 `2 links` 条件删除最新 Q10 任务/状态。处理顺序：

1. `git diff` 双向逐行审查两边测试；保留 main 新的 Q10、meeting RAW、首屏决策与 `site-reader-contracts.spec.ts` 行为；
2. 仅把 #901 新的截图与 JSON 输出代码**移植到 main 的现行六组视口/主题测试**：`writeFileSync`、`testInfo.outputPath`、`q03.screenshot`、`q01.screenshot`；
3. 不要求永久上传全站大截图，Cloud Figure Artifacts 只保留短期可追溯证据；截图来自**真实构建结果**，不得用过期 `dist/`；
4. 保存现有 Q03 A0 原位负例测试：源码故意恢复旧 `x=88` / `xPhone=50` 时原位 `getBBox()` 断言必须失败；正确布局应 PASS；
5. 确保原始 A0/A40/A80/A120 值、`0/64`、非 SEED 同题协议、Q01 33 点及 Scaling 图 44.05/969.17 秒说明不漂移；
6. 源码修改最小化，新增测试不仅在文件里存在，还要由真正的 Public PR CI 或 Cloud Figure workflow 执行，参照 `release-closeout-protocol.md` 的 escaped-regression wiring。

优先形成明确的小 diff：`main` 版末尾保留、`testInfo` 输出保留、原图验收保护不变。严禁以 `git checkout --ours`、`-X theirs` 或整文件粘贴来处理 Q10 的科学语义。

## 6. WP-03：GitHub-hosted Chromium + WebKit + 实际 Artifact

已有文件：
- `.github/workflows/cloud-figure-visual-review.yml`
- `tests/e2e/advisor-figure-paper-collision.spec.ts`
- `tests/e2e/advisor-paper-figure-suite.spec.ts`
- `.github/workflows/public-pr-ci.yml`（既有默认 Chromium required gate，PR #900 已添加短期失败证据上传）

**历史失败分类：**
- 初版 WebKit 不能启动，是 Docker 镜像 Playwright 1.62.x 与项目 `@playwright/test 1.63.0` 不同，报 `webkit-2359/pw_run.sh` 缺失；不要把它写成产品 Figure 失败，也不要退回 Mac。
- 当前 #901 Cloud Workflow 已锁定 `mcr.microsoft.com/playwright:v1.63.0-noble` + digest，历史 SHA 的两个浏览器均成功。执行前核实 `package-lock.json` / `package.json` 的 Playwright 版本和镜像真实 digest；不要把镜像换成未经验证的 latest。
- Public PR CI 的旧 allowlist 红灯与 WebKit 工作本身应分别修复、分别报告。

Cloud workflow 改进/核验：
- 两套矩阵 job 明确叫 `cloud-figure-chromium` 和 `cloud-figure-webkit`；容器 `ubuntu-24.04` + Playwright Noble 版本与 lock 对齐；
- 自动触发只针对涉及 Figure/workflow/test 的 PR；允许 `workflow_dispatch` 的话先验证数字 PR id、PR open 和 base/main、读取得到的 PR head SHA，禁止将 fork 不可信代码带到有可写 token/Production secrets 的环境。checkout 后再校验 `git rev-parse HEAD` 与所登记的不可变 SHA；
- `permissions: contents: read`；`persist-credentials: false`；动作 pinned SHA；不使用 `pull_request_target`、不触发 Production、不修改共享 Gate refs、不调用 RDC；
- `npm ci` 和 `npm run build` 使用当前 exact head；`npx playwright test tests/e2e/advisor-figure-paper-collision.spec.ts tests/e2e/advisor-paper-figure-suite.spec.ts --project=... --workers=1`。无 `--update-snapshots` 自动接受视觉差异；
- `actions/upload-artifact` 在 `if: always()` 保留 PNG、JSON、trace ZIP、失败视频、错误上下文；保留 3 天。没有文件时不虚报截图成功。

实际 artifact 正向期望（以图表规格和执行的 6 组为准，真实清点，不假造文件）：
- 每种浏览器：Q03 `390/768/1440 × light/dark` = 6 张 PNG；Q01 `390/1440 × light/dark` = 4 张 PNG；Q03 对应计算几何 JSON = 6 份；有新的 Scaling 截图时应注明新增数量；
- 该 job 真正运行并为**当前 SHA**产出，GitHub REST `actions/runs/<id>/artifacts` 可查到 Chromium 和 WebKit 两个非空 Artifact；
- 下载任意一份 ZIP 查原始 PNG/JSON 字节、`source SHA`、页面标识、轴距、字号、主题、viewport；不能只看绿色 job 或空 ZIP；
- 若 `test-results` 有失败附件，保留 trace 并检查失效的第一个路由/浏览器，不可使用 skip、增大容差或隐藏 DOM 冒充通过。

此工作包的合格状态是**同一最新提交**：两浏览器 SUCCESS、仓库 Public PR CI SUCCESS、真实 Artifact 已核查，四者独立成立。

## 7. WP-04：扩展“一个图坏了，同类图都查”的视觉验收

最初已对 268 个静态页面中 26 个含 `figure` 的页面清点出 73 张 Figure、130 个原生 Table（快照数字会变，重跑为准），且三处原生遮挡图已修复；**仅静态 inventory 不等于逐图验收**。用户真正希望的是“别有漏网之鱼”。

优先增强**现有 owner** `scripts/audit-sitewide-research-figure-widths.mjs`，而不是另建几套重叠审计。使用现有 `--snapshot` 导出 machine-readable route / `figure` owner / 数据属性 / 形状类：

```json
{
  "route": "/research/.../",
  "figure_owner": "advisor-viz--q03",
  "role": "research-evidence",
  "width_tier": "single",
  "viewports_tested": [390, 768, 1440],
  "themes_tested": ["light", "dark"],
  "status": "PASS | FAIL | NEEDS_VISUAL_REVIEW",
  "evidence_artifact": "artifact-name/path.png",
  "scientific_source": "verified source URL or missing"
}
```

另用云端 Playwright 扫描所有当前生成的真实 `figure` 与科研定量表；按真正类型分类：
- 静态论文单图/双图：轴值/点注/图例不得遮挡、实际 px 字体达到现行可读门槛、色盲/灰度可辨、标题与 caption 不重复吹大、原始数据完整；
- 置信区间/数值表：零基线、区间端点、95% 解释与方向正确，数字对齐但不装饰、`booktabs` 顶线/表头线/底线、长表局部滚动不引起页面横向溢出；
- 方法拓扑/固定 16:9 幻灯片/工作台：由各自语义 owner 管；不套单栏论文 Figure 规范，不把信息缩到不可读；
- 中文长句窄栏：检测 `overflow`、裁剪和“每行仅几个汉字”的实际 `getClientRects`；不能为了省空间用错误的 flex/grid 结构把段落塞进标签栏；
- 交互状态：图放大或详情阅读层若存在，需键盘/触控可操作、焦点可回到原处、缩放后不丢来源与数据。

**全覆盖的措辞要和实际 coverage 一致**。最低要求是每个当前 `figure` 都有一行审计结果与归属；逐图视觉 PASS 必须有真正执行的截图/浏览器对象。不允许“抽检三张→声明七十三张通过”。重要失败按共同 owner 聚类，修复真实共享组件 + 反例回归；涉及新页面或共享样式的修复另外开最小 `fix/research/...` PR，并链接 #901，不和 Typography Agent 抢同一份 CSS。

如果真正完成的只是自动清单与抽样视觉，应把剩余列为 `NEEDS_VISUAL_REVIEW`，附数量与路由，不能将它说成不存在。

## 8. WP-05：表达/Reader Contract/零上下文冷读

保留最近 `main` 对 Q10 “确认题已冻结、正式独立训练未启动”的权威表达。它是科研状态，不得改写成“实验已完成”。读者首屏保持一个主要中心、实验发现/范围先于底层工程过程，RAW 来源可追溯。当前 `site-reader-contracts.spec.ts` 和 `openEvoAdvisorFirstViewport.test.ts` 的限制优先于旧 PR 的具体用词。

要继续确认：
- [ ] 390/768/1440 下 Q01–Q10 速览标题、当前回答/已做/还缺、绿色黄色红色状态与逐问详细层逐项一致；
- [ ] Q03 64 题成绩不冒充 SEED 128 题；历史三路线对照注明“并非完全严格对照”；
- [ ] 目录和章节不重启无意义的 “4”，图表编号/图注/来源互相对应；
- [ ] 对照页面没有无端把第一个方法或第一数据行加粗，数学与普通数字清楚；
- [ ] 决策首屏可点击入口数量及 Q10 与 RAW 的相对阅读顺序符合当前 Reader Contract，不恢复已退役的旧文本断言；
- [ ] 真人/完全无项目背景读者做 30 秒快速审读：能口述研究问题、已完成的重要结果、未完成的工作各至少一项，且不会误判 Q03 已正式复现。收集匿名文字反馈。无人实际读则写 `NEEDS_READER`，不得用 Agent 自评或 CI 代替。

表达改动与全站 Typography 不同。**本 PR 不改 font-family、font-size/scale、weight、italic 或全局 Token**。如发现与字体直接有关的遗留错误，给 Typography Agent 生成精确 issue/文件/截图，不在此 PR 顺手改掉。

## 9. WP-06：Exact-head PR/Provider/Production 的真验收

仓库门禁链：当前 `main` → PR #901 exact HEAD → `public-ci-gate`（GitHub App 15368，必需）+ Cloud Figure Chromium/WebKit（这项工作合同要求，两者都应成功）→ ```node scripts/request-vercel-final-gate.mjs 901``` → 同 exact-head `Vercel` provider status SUCCESS / Preview READY → 两条真实路由复检 → 带 `expected_head_sha` 的 merge → `main` Production 状态和目标页面复核。

执行细则：
1. 如果 `main` 发生并发改变，比较新旧 base 的**真实语义差异**、交叉文件，重组最终 tree 后再跑所需 gate；不得用旧成功作为新 tree 成功。
2. 正常开发 ref 不消耗 Vercel 构建；最终使用**已有** `ci/vercel-gate-base` / `ci/vercel-gate-final`，仅在同 SHA 的 Public PR CI 真绿后移动；避免重复新建 gate aliases、no-op 唤醒提交和浪费 provider 构建。
3. Vercel 的 `READY` 或 HTTP 200 可能只是登录页：用已授权 Vercel 浏览与具体 `data-report-figure="q03-custom-curve"`、`data-report-figure="q01-horizon"`、Scaling 图标识验证页面内容，确认 viewport/theme、实际坐标/图注/书签。Preview `noindex`。
4. 只有 PR 没有未解决的阻塞、base/current head 一致、所需 hosted 检查均通过才允许 merge；不要跳过安全门禁、禁用 WebKit 或重试多次直到一次绿来冒充可靠。
5. Merge 后判定 Vercel `main` 是否**真的需要新 Production 构建**：如果只修改 CI 和文档而服务端有意 `IGNORED/CANCELED`，这是政策允许的结果，不要凭旧 READY 强行宣称“新的生产构建已发布”；若包含真实页面/测试发布相关变更且按 policy 应部署，则必须核实 exact merge SHA → Production deployment → READY → stable alias/真实路由。
6. 若发现新产品缺陷，回到 owning component 修复；后续 UI 改动要有新 HEAD 的 GitHub+Vercel 验收。

参考 `docs/agents/current/release-closeout-protocol.md`，特别是 `base-vs-candidate` 归因、escaped regression wiring、跳过与通过的区分、预览与 Production 不能混称。

## 10. WP-07：Codex 交付形式、必须给用户看的收据

每做完一个工作包，向用户汇报：当前 PR / exact SHA、完成代码（逐文件）、运行测试（路径/命令/数量/Chromium 与 WebKit 分列）、真实 Artifacts 链接及截图对照、Vercel Preview（准确 SHA）、科学内容是否有修改、当前阻塞。不要用一段“持续优化中”取代工程收据。

最终交付 Checklist：

- [ ] PR #901 说明与本计划保持一致，最新 `main` 的 Q10 科研语义已保留，未引入全站 Typography。
- [ ] WP-01 allowlist + 安全反例测试 PASS，新增 Workflow 仍是唯一明确允许的四个之一。
- [ ] WP-02 新版 Q10 / meeting RAW + Figure PNG/geometry 测试在同一源码中 coexist，`getBBox` 旧缺陷能判红。
- [ ] WP-03 exact-head Cloud Figure **Chromium 和 WebKit** 都 SUCCESS，无 browser missing / skipped；各有非空 PNG/JSON Artifacts、SHA/截图/数值可复核。
- [ ] Public PR CI deterministic + 全部风险规划 Browser shards + 最终 `public-ci-gate` SUCCESS。
- [ ] 至少输出 268 路由的当前清单、全部当前 Figure 的 owner/覆盖率；只将确有截图和人工/自动验收的子集标绿，其余分门别类列出来。
- [ ] 科研指标/来源和 Reader Contract 全部保持；无法获得真人冷读时仍 `NEEDS_READER`，不可自行签字通过。
- [ ] Vercel exact-head Preview READY 且真实页面复核；与 `main` 无竞争冲突；按照保护规则完成 merge 或准确写出 blocker。
- [ ] 合并后的 `main`/Production 有真实状态说明（包括 docs/CI-only 应跳过 Production 的情形），不得混淆 SHA。
- [ ] 记录此次旧 allowlist、WebKit 版本漂移、假绿色风险、用户逐字反馈及剩余视觉遗留项，避免相同错误再发生。

## 11. 禁止事项与 Escalation

- 不使用 RDC/MacBook/自托管 Runner/SSH/GPU 作为 BaseModel 的普通网页执行平台；只有云端确实无法代替的**用户明确批准**例外。
- 不修改/合并 PR #895，不重做全站字体/字重/斜体，不动 Notion、论文/实验仓库原始测量、不公开私有 checkpoint 或机密科研记录。
- 不改 `public-ci-gate` / Vercel required checks 成为宽松条件，不删失败测试，不捏造 screenshot/Artifacts/几何数字，也不修改数据使图看起来更好。
- 不以过期 PR head、旧部署 READY、旧源码或只读 UI 静态快照作为当前最新完成证据。
- 发现新的独立科研事实或 owner 不清楚时先查 GitHub/科研来源，再决定是否改变网站；归档用户原话不能夹带自己推测的错误归因。
- 若其他窗口同时修改了同一测试、科学文本、共用 CSS 或 Gate，请停止冲突写入并在 PR 说明里写出 overlap/文件/commit/base，再按语义分层整合；保留另一窗口可独立完成的工作。

> **终点定义**：不是“PR 建立了”，也不是“CI 几个绿灯”。而是 GitHub 上找到已测试、可追溯、没有侵犯 Typography 分工的**最终候选代码树**，真实云端浏览器截图显示论文式 Figure 清楚，误读边界仍可见，发布状态说得准确，并把剩余人为验收与未完成项清楚交给读者。

## 12. 本次实施的证据读取方式与冻结冷读任务

本次云端证据改动保留 main 的 Q10 / meeting RAW 语义；不改生产组件、字体系统或科研数据。架构测试使用 YAML 解析器读取实际触发器、权限和矩阵，未知工作流与危险配置通过受控变异测试证伪。图表回归加入既有 `test:ui` / `test:ui:all` 和 escaped-regression registry，避免测试文件存在但正常门禁不执行。

Cloud Figure 工作流解析 open/main PR 的不可变 head SHA，checkout 后复核；PNG/几何 JSON 和逐文件 SHA-256 manifest 绑定相同 SHA/浏览器。Q03 六张、Q01 四张及 Q03 六份 JSON 缺失时失败。全路由 inventory 与逐图截图复用现有审计脚本及 `sitewide-figure-width-scope.spec.ts`；正常屏幕矩阵为 390/768/1440 × light/dark，另保存桌面 light 的灰度和 print 图。包含证据的 details 在截图时显式展开，隐藏的幻灯片/未渲染对象保留未审状态。六状态逐对象截图比原二状态 overflow 探针工作量大，证据模式单例预算 180 秒、矩阵 job 30 分钟，几何/可读性门槛不变。

**状态边界：** inventory 与逐对象 JSON 默认 `NEEDS_VISUAL_REVIEW`；截图存在、根溢出检查通过，都不能自动升级为逐图视觉/科学 PASS。图内未附链接也不自动认定来源缺失，需检查相邻正文与 owning data。执行收据、最终 SHA、真实 run/artifact URL 写入 PR 元数据，避免“记录当前提交通过”又产生新提交使证据过期。

**独立真人 30 秒冷读：NEEDS_READER。** 给未参与编辑、未看交接的研究者直接打开第三篇文章默认状态，30 秒后隐藏页面，请原样记录回答：
1. 这组研究在研究什么？说出一个已经测得的结果。
2. Q03 的历史成绩能否直接与 SEED 论文排名？为什么？
3. Q10 哪项已准备，哪项还没得到结果？
4. 接下来最该补哪类证据？从哪里找原始来源？

评分预先冻结：能识别研究问题和一个真实结果；不能把自定义 64 题当论文 128 题、不能说正式 SEED 复现已完成；明确 Q10 冻结新题与正式训练/封存成绩不同；能指出证据缺口和来源入口。任一实质误读记 FAIL，未实际邀请独立真人时保持 NEEDS_READER。浏览器、Agent 自评及本任务委托者的既有上下文不能代替此收据。
