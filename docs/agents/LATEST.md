# Latest Agent handoff

## 2026-10-30 Frontend tooling adoption · PR #967

PR #967 is an open candidate, refreshed onto current main `8e0c1e94` after #972. It adopts the existing Astro/TypeScript/MDX stack with Lucide, prefixed Tailwind/daisyUI, Alpine CSP, Motion mini and an adapted shadcn/ui Button in live controls. Existing design tokens, scientific content and route contracts remain owners. The prior exact head passed Public CI, the local deploy verification/build and recorded browser review; those receipts do not transfer to the refreshed head. Vercel rejected the prior exact-head final gate with “Deployment rate limited — retry in 24 hours.” Re-run affected checks on the refreshed head; preserve the shared final-gate ref while another candidate owns it.

## 2026-10-30 SEED × OpenEVO UI release

PR [#960](https://github.com/mykcs/basemodel/pull/960) is being updated onto the current `main` after #966 advanced it. Its two overlapping browser-test changes were combined by table identity and section, preserving the numeric evidence fixtures and testing the new retrospective discussion table. The affected Chromium suite passed locally (118 tests). Previous exact-head CI and Vercel receipts do not transfer to this updated candidate; use the live PR head for Public PR CI, Cloud Figure Visual Review, final-gate Preview, merge, and Production verification.

## 2026-10-29 隐私后续与发布身份检查

#958 已合入 `main@1ed126cb`，#959 研究页面保留。#963 后续候选恢复现有 SVG 的分享 PNG、将当前 W&B 账号入口改为匿名来源索引，并保留逐字节原件、哈希与未改动的科研 payload；[`current/person-reference-privacy-standard.md`](current/person-reference-privacy-standard.md) 拥有语义与风险清单入口。图片人工确认、历史公开副本、外部账号与平台别名仍是明确残余，不宣称完全匿名。#964 的只读 GitHub 部署镜像告警与 Vercel 实际 alias/READY 验收各司其职，执行及恢复由 [`current/deployment-policy.md`](current/deployment-policy.md) 拥有。当前候选的合并/发布状态以准确 HEAD 的 CI 和 Vercel 实时对象为准。

## 2026-10-30 BaseModel content reorganization · PR #817

The owner-requested reorganization gives the Home, Study, research-topic directory and existing search distinct roles. The previous exact head passed Public CI (1,040 browser tests) and the complete Chromium/WebKit visual review (1,039 first-attempt tests per browser); scientific pages, evidence and public URLs remain intact.

Status: current main advanced through #969 (`c9c5052f`) after #966. The prior refreshed head `c6adc11e` was superseded while exact-head checks were running; those partial checks are not merge evidence. The owner approved publication on 2026-10-30. PR #817 is refreshed again and must pass new current-base Public, Vercel and Figure acceptance before merge. No Production deployment is claimed.

## 2026-10-29 CI performance qualification

[#814](https://github.com/mykcs/basemodel/pull/814) merged fail-early browser prerequisites, exact-source sealed static artifacts, duration-balanced full-title allocation and shared risk routing. [The CI implementation and measurement record](../dev/CI/README.md) owns behavior, positive/negative receipts, costs and rollback; hosting and release authority remain in the existing current owners. The sampled complete browser-workflow wait fell from 55.6 to 35.8 minutes, while summed Runner time rose 5.2%; no net full-run compute saving is claimed. [#962](https://github.com/mykcs/basemodel/pull/962) merged the typography consumer's shared-plan condition as `b2807e2`; current-base Public and complete Figure acceptance passed, including an explicitly recorded failed-only WebKit recovery. The independent #958 privacy work is preserved, including its merged auditor and existing image/external-identity follow-up. Scientific source/evidence and required check identities remain intact.

## 2026-10-29 人物称谓隐私：历史候选记录

历史快照（#958 合并前）：下段保留当时的候选状态；该候选现已作为 `1ed126c` 合入 main。此状态更新不代表历史、图片或外部链接已完全匿名，既有剩余事项见 [#963](https://github.com/mykcs/basemodel/issues/963)。

BaseModel 当前任务分支正在把公开科研沟通中的人物引用统一为 `W 老师` 与 `L 学长`，以 [`current/person-reference-privacy-standard.md`](current/person-reference-privacy-standard.md) 为唯一称谓 owner；根入口、`src/AGENTS.md`、站点 README、质量验收索引和 `npm run audit:person-privacy` 都指向/执行这一规则。当前源码对已知私人身份做失败即停止审查，正式发布仍须看 PR 精确 HEAD 的 CI / Vercel 及真实网页；此段是候选状态记录，不能当作已经合入 `main` 或撤回公共 Git 历史的证明。


## 2026-10-24 Typography release and Production closeout

PR [#949](https://github.com/mykcs/basemodel/pull/949) squash-merged the sitewide Typography system to `main@dbda56cb3ca12c1956f0fb0a1876a6a10541bc84`, including Q05 PR #948's discrete β teaching axis, formula fit, browser checks, workflow triggers and qualified 65-minute Cloud Figure timeout. Exact-head Public PR CI (run `40060099546`), full Cloud Figure Visual Review (run `40060098996`, eight browser shards plus artifact round-trip checks), local `npm run verify:deploy`, `npm run build`, and the 2,096-case Chromium/WebKit matrix passed. The exact-head Vercel Preview was READY; the `main` Production deployment `dpl_3M8R7Sy9hsWknow5o671aPTTELut` is READY on the same SHA. Production `/` and `/research/seed-openevo/study/parameter-memory-results/` returned HTTP 200; the five-point Q05 axis and `--type-plot-label` are present in served output. Production `noindex,follow` is intentional while access protection is active; canonical and hreflang use `https://basemodel-preview.vercel.app/`. The source ledger covers 5,491 declarations; ten new/inherited identities remain explicitly unobserved in the incremental snapshot, so no full-site visual observation is claimed. Older SHA receipts below are historical.


R1 screenshot review is closed for its requested D6/D7 surfaces. On the exact #949
candidate, Q17 Frontier/DirectApply readers and all six Landscape viewport/theme
states were visually opened alongside SHA-bound JSON. Publication SVG-reader segments
were opened to verify local scrolling and label readability. See the current receipts
in `evidence/sitewide-typography/2026-10-22/WP_D6_Q17_FRONTIER_TYPOGRAPHY.md` and
`WP_D7_NATIVE_SVG_AND_LANDSCAPE.md`. The adjacent Briefing image-reader scope remains
PARTIAL because its captures show only scrolled segments; it is not represented as
accepted. No scientific values changed.

## 2026-10-20 Typography continuation

The completed continuation inventories all open PR paths and extends the audit to Astro scoped
styles and font shorthands; the historical 249 CSS literal count is not a complete
source inventory. Method-diagram migration and remaining ownership/classification
are recorded in `evidence/sitewide-typography/2026-10-20/README.md`. Current successor
acceptance is pending and tracked in the 2026-10-23 handoff above; historical green
CI/Preview receipts do not transfer to its SHA.

Last updated: **2026-08-28** (research-state snapshot)

CI architecture last verified: **2026-10-29**

Agent bootstrap last refreshed: **2026-10-03** — root `AGENTS.md` remains a routing/invariant layer; substantial/durable user-facing content now loads the shared `HUMAN_EXPRESSION_STANDARD.md` on demand, and source/raw/calculation questions route through the current scenario trigger plus `research-site-presentation-contract.md`. Detailed scientific/provider authority did not move.

Status: **The SEED × OpenEvo Results route is aligned to the closed Track A paired measurement and the adopted WB1 Gen28 state-v28 boundary. Track A remains `measurement-not-proven-stable-improvement`; WB1 is `GEN28_STATE_V28_BARRIER_PASS_ADOPTED` at 3,584/20,640 counted episodes with 17,056 remaining, while Gen29/GPU/formal-task/final authority remains locked.**

This file is a short current-state router. Detailed policy belongs under `docs/agents/current/`; historical rationale belongs under `docs/agents/history/`.

## 2026-10-23 Starlight 技术手册发布候选

Owner 08:46 反馈 #933 技术手册脱离 BaseModel UI；技术验收通过不代表共享站壳的产品目标完成。后续隔离 Draft 接回真实 Header、app.css/tokens 与 atlas-theme，保留文档目录/Pagefind，不启动第三套字体迁移；#898 原 writer 分支不改写。反馈、共享 owner、抽样覆盖和已知缺口见 [handbook shared-shell evidence](evidence/handbook-shared-shell-20261023.md)。该纠偏尚未获 Ready/merge/Production 授权。

PR #933 延续 #860 的安装历史，提供 `/handbook/`、`/handbook/agent-harness/`、`/handbook/openevo-gpu/`，原生侧栏、Pagefind 搜索和 Development 入口。原生 sitemap 与 404 继续由既有 owner 维护；手册使用 noindex。全站样式采用等优先级的 class scoping，图表审计及 reader ownership 同步识别编译 scope；不改变科研数值、原有表格阈值或负例。

候选 `f30d709d` 已包含 main `84db23c6` 的 #936–#938；Public CI `39902779990` 实际通过 493 项主 UI 和 6 项 Lab，完整 Chromium/WebKit `39902779991` 各通过 492 项首次测试，两个汇总均完成完整身份并集和各 1,787 个文件回读校验。受控 Review `39902798458` 的当前 28 张截图已独立查看；此证据不是正式供应商门禁、Production 或真人理解验收。

本轮发布批准仅覆盖 #933。受控 Review、正式 Vercel 门禁、合并及 Production 验收分别记账；后续追加提交仍须取得对应 HEAD 的检查，不能把 `f30d709d` 的绿色结果直接搬给新提交。原 #860 待整合版本正式发布验收后再收束；全站排版与真人理解不因本手册候选通过而记作完成。当前 PR、检查和 Vercel 实时对象仍为发布状态权威。

## 2026-10-22 Q04 单轮 GPU 资源画像

第三篇「我们的回应实验」Q04 新增一幅**实验为单位**、非 GPU0–3 设备列表的显存时间轴：`src/components/research/Q04GpuResourceTimeline.astro`；资料 owner 为 `src/data/research-evidence/advisor-q04-gpu-round140-20261022.ts`。2026-10-22 现场只读核查的 Cell1/rank128/round140 单轮历时 34分32秒，只有 2 MiB 与 4,586 MiB 两次 NVML 全卡快照和 PyTorch 更新阶段 6,136,238,080 bytes 的已分配峰值。无连续 NVML 采样，不能推导全轮真实峰值、GPU 利用率或 GPU·小时；界面「完整曲线示意」明确不是实测。调度 12/24/4 GiB 是预算门槛，不是观测值。源码、静态构建、单测与交互回归由任务 PR 的 exact HEAD 证明；上线状态以独立 CI / Vercel / Production 收据为准。原始现场日志未随公开网页发布，PR #631 只提供 Q04 实验背景，不能当作这一轮资源测量的公开原始证据。

## 2026-10-22 阅读风格扩展与章节编号

续接已合入的 #932：19 个研究入口／指南固定路由及21个论文详情页接入共享阅读层，功能入口采用960px内容框；原44篇文章保留750.4px样板。章节数字移入原h2左侧，与标题同字号同行，移除独立小号数字眉题。范围与静态数据由 technicalArticleRoutes.ts 和原内容 owner 维护；本轮不更改实验、部署、模型目录或工作台结构。发布状态以本轮候选精确提交的CI/Vercel收据为准。

## 2026-10-22 全站技术文章阅读样板

以「我们的回应实验」为阅读样板的候选覆盖 `src/data/technicalArticleRoutes.ts` 中 44 个现行文章路由，共享 owner 为 `src/styles/research-article.css`。工具、目录、比较页、运行工作台及科研图表／booktabs 表格保留原有语义 owner；`PageOutline.astro` 为文章提供可折叠目录，三篇博客沿用自己的目录。当前主线没有 `/en` 发布路由，候选保留已有语言分支而不恢复归档页。

用户本地路线图修改保留在原 checkout；文章候选在独立 worktree 开发。数值、原有锚点和外部证据链接须与基线逐页比对；本地检查、review-only Preview、精确提交 CI / Vercel 和 Production 分别验收，发布状态以候选 PR 的实时收据为准。

## 2026-10-21 科研论文表格的真实渲染入口

[PR #920](https://github.com/mykcs/basemodel/pull/920) 将科研报告表格的实际调用统一到 `ResearchPaperTable.astro`；唯一排版 owner 是 `src/styles/research-booktabs.css`。采用 Times / 中文衬线回退、可见的上方表题、booktabs 横线和数字对齐；短表按内容取宽，宽表在自身窗口横向滚动，手机端保持原生行列。工作台、购物操作示意和应用目录保持各自职责。科研值、缺失状态、比较口径及来源不因排版变化而改写。

`research-paper-table-values.json` 保存已封存云端产物中 39 个研究路由、96 个原生表格的单元格序列指纹；浏览器验收同时核对数值与原生表格排版，并生成 390 / 768 / 1440、浅色 / 深色、打印及灰度证据。构建通过、截图生成、逐对象视觉审查、Preview、Production 和真人理解分别记账；当前精确提交的发布收据以 #920 实时 CI / Vercel 记录为准，真人冷读仍为 **NEEDS_READER**。

Q03 的独立单栏论文图改动来自已合入的 [PR #921](https://github.com/mykcs/basemodel/pull/921)，与本次表格整合保留。先前字体与图表阅读窗口收尾见 [PR #918](https://github.com/mykcs/basemodel/pull/918)；先前字体任务的账户中央归档见 `.agents` [PR #490](https://github.com/mykcs/.agents/pull/490)，本次论文表格纠偏的案例增量已合入 `.agents` [PR #500](https://github.com/mykcs/.agents/pull/500)。这些历史收据不能替代 #920 合并树的实际验收。

## 2026-10-20 科研 Figure 云端验收入口

[PR #901](https://github.com/mykcs/basemodel/pull/901) 的 [原任务书](../plans/2026-10-20-figure-cloud-closeout.md) 记录 Figure/云端证据的工作边界与冻结冷读任务。最新执行状态以 PR exact-head Actions、Artifacts 和 Vercel 实时收据为准；静态清点、截图生成、视觉审查和真人理解分别记账。Q03 碰撞反例已接入现有两条 UI 命令与 escaped-regression registry。Typography 继续由另一工作线负责。

图表收尾已接入 checkpoint 标题、Q01 深色图例、WebShop 比例尺标签、科研表格内容宽度、实验计划数值列、方法对比图文字对比度、置信区间坐标标签间距，以及手机表格碰撞的命名正反例。云端捕获通过真实交互进入参数比较与购物示意步骤，并区分 Q03 手机专用表格和 SEED compact 组件明确不展示的租卡目录；这些状态不能混记成缺图或视觉通过。历史候选的绿色检查不继承给新 SHA；完整当前候选验收、逐对象审查和发布收据仍以 #901 为准，未取得真实收据前保持未完成。独立真人冷读为 **NEEDS_READER**；#895/#898 不并入此工作线。

## 2026-10-14 三篇博客写作续接（科研测量暂停）

BaseModel PR #851 仍按 **① OpenEVO 方法 → ② L 学长十问 → ③ 我们的回应实验**。本轮只将已有科研证据补写第三篇和报告，不运行 GPU、checkpoint 或 WebShop。Q17 DirectApply R159 冻结64题开发成绩为 **60.1088/100、18/64 exact**，旧 M1 64×8 Success@k、D1 同模型32条训练 prefix 证据与128题三线终评、rank32/rank128 后段1024次比较均非同一测量。D1 #52/#65/#66 只到 PARTIAL；Q07 Bounded OFF 不能替代 DirectApply R159。实验 PR #703 未合并的 **39/78、核心9/9** 不等于实验 main 的旧 **38/78**；全体13份仅186/1014接纳格、0/13达78/78。权威交接：https://github.com/mykcs/openevo-experiment/blob/science/checkpoint13-cpu-evidence-followthrough-20261013/docs/science/webshop/program/OPEN_EVO_CHECKPOINT78_PAUSED_BASEMODEL_WRITING_HANDOFF_20261014.md

新文章提交需要**重新验收 PR #851 的 exact head**，旧 60da447 的 CI / Vercel Preview 通过只属历史；PR / Preview 不是 Production。

## 三篇 OpenEVO 技术博客的当前文章职责（2026-10-13）

PR #851 保留三个独立路由，顺序 **① OpenEVO 方法详解 → ② L 学长十问（问题本身）→ ③ 我们的回应实验（Q01–Q10 的实验、结果及未知）**。Q10 是会后新增，不当作L 学长逐字提问。页面角色权威在 `docs/wish/DESIGN.md`；本地测试保护第二篇不混入成绩/图表、第三篇十项回应各有来源。三篇共享 `src/data/openEvoAdvisorTenQuestions.ts`；可用浏览器 QA 评价风格，但不得改写科研证据。

未合并的 PR/Preview 不等于 Production。恢复或延续任务时先核对 PR exact head、CI 与 Vercel 的实时状态。

## Current architecture

```text
GitHub `mykcs/basemodel`          = public website source of truth
ordinary working PR/ref           -> required Public PR CI; no Vercel Preview compute
final current-base PR candidate   -> persistent exact-SHA Vercel provider gate
main                              -> Vercel Production
Production                        -> https://basemodel-preview.vercel.app

mykcs/openevo-experiment         = scientific experiment/result authority
```

**Live CI control plane (verified 2026-09-21 at `main@d747a658008566e8ba82df50d5dc35fb87e53534`):** protected `main` keeps strict current-base semantics and requires **both** `public-ci-gate` (GitHub Actions app 15368) and `Vercel` (app 8329). CircleCI has no ordinary merge authority.

Ordinary working refs are not Vercel deployment-enabled. They receive automatic **Public PR CI**: read-only exact-head deterministic validation plus the shared risk-based browser planner; non-UI work allocates zero browser runners, bounded UI work allocates one, and full/global browser work is native Playwright-sharded over eight independent Chromium shards with one worker each and retries=0. `public-ci-gate` is required merge evidence. Hosted Vercel acceptance is requested only after that exact-head check is green through `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`, which pins `ci/vercel-gate-base` to live `main` and moves persistent `ci/vercel-gate-final` to the exact PR head. Vercel then performs the static production build and proves provider deployability on that same SHA instead of rerunning the deterministic/browser suite. Proven docs/governance-only `main` changes remain ignored so they cannot replace Production. **Merge readiness therefore requires both `public-ci-gate` and `Vercel`.** CircleCI automatic PR/main workflows remain disabled; the self-hosted GitHub Actions workflow remains manual recovery only.

Provider-selection rationale is `current/ci-provider-decision.md`; current hosting authority is `current/hosting-architecture.md`; release/deployment authority is `current/deployment-policy.md`. Cloudflare deployment and monitoring paths are legacy/rollback/provider-specific tooling; there is no active anonymous external Production monitor.

The 2026-09-21 de-duplication qualification measured the same provider phase before/after: exact-head Vercel BUILDING→READY fell from **507.7 s to 14.170 s** (97.209% reduction, 35.83× faster), and merged Production fell from **633.3 s to 16.608 s** (97.378% reduction, 38.13× faster). No test population, retries, assertion threshold, or build-machine tier changed.

Browser-heavy acceptance now runs once, in required Public PR CI, before any final-candidate Vercel spend. Public PR CI and the retained manual fallbacks share `vercel-ui-plan.ts`; first/unknown comparisons fail closed to complete Chromium coverage, and the 6-case active-Lab gate remains relevant where owned. The 2026-09-15 latency qualification refreshed the suite to 197 Chromium identities and selected 8 independent full-matrix shards after 4/6/8 comparison. Vercel is no longer a second browser executor: the exact-head gate proves the static provider build/deploy, and Production builds the already-accepted merge tree. Production is access-protected and non-indexable; post-merge evidence comes from Vercel deployment identity/state plus authenticated page inspection when needed, not an anonymous external monitor.

## Current research state

### Historical repaired PRIMARY-v2

The 2026-08-25 repaired measurement on the historical frozen SEED-compatible panel remains unchanged:

- BASE: Task Score×100 `4.1`, exact success `0.0%`;
- frozen OpenEvo SD-LoRA: `7.3`, exact success `2.3%`;
- paired delta `+3.15`;
- bootstrap 95% CI `[-0.65,+7.19]`.

The CI crosses zero, so this is a positive direction, not a stable win. The panel is SEED-compatible, not the paper-final exact 128 and not the later source-faithful first-validation panel.

PRIMARY-v1’s 0/0 result remains **measurement-invalid**, caused by the action-wrapper / released-SEED parser incompatibility. Do not reinterpret it as zero capability.

### Source-faithful Track A — closed

The current immutable publication snapshot is `mykcs/openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19`, refreshed against later `main@17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d`.

The first source-faithful reconstruction was superseded after the pinned SEED `SimServer.__init__` second `random.seed(worker_seed)` before goal shuffle was found to be missing from the first builder. The corrected panel was rematerialized and then passed the authoritative runtime semantic gate:

- total slots `128`;
- matches `128`;
- mismatches `0`;
- match rate `1.0`.

The completed paired measurement on the corrected source-derived first-validation semantic panel is:

| Metric | BASE | frozen OpenEvo SD-LoRA | Paired contrast |
|---|---:|---:|---:|
| Mean Task Score ×100 | 7.17 | 8.74 | +1.57, 95% CI [-3.21,+6.31] |
| Exact success | 5/128 = 3.9% | 5/128 = 3.9% | 0.0 pp |

Both arms are `128/128` valid, reconciliation is `ok=true`, and parser-invalid count is `0`. The Task Score interval crosses zero, so the supported interpretation is **`measurement-not-proven-stable-improvement`**.

The evidence package is `PUBLISHED_AND_VERIFIED`: 256 raw episodes plus reconciliation, analysis, conclusion, release/readiness, GPU, W&B, executed semantic-panel, deterministic-rebuild, and per-cell receipts were transferred byte-for-byte and verified by per-file SHA-256 (`274` files, mismatch `0`, missing `0`).

Preserve the governance exception: the scientific contract was frozen and readiness passed before formal task consumption, but GitHub branch authority and the `main` router did not precede the first formal episode. This is an authorization-ordering deviation, not evidence that the scientific contract changed, and must not be rewritten as prior `main` launch authorization.

This Track A panel still must **not** be called the exact paper-final 128 behind SEED 89.7 / 78.1%, and the SEED paper checkpoint / reported numbers were not locally reproduced.

### Track B / WB1 — current program line

Immutable adoption authority: `mykcs/openevo-experiment@c2791000a3af97190c264ba5ea39f0c4e5f65823`.

Current WB1 state:

- campaign: `20260821-2341-wb1-seed-aligned-webshop-benchmark`;
- classification: `GEN28_STATE_V28_BARRIER_PASS_ADOPTED`;
- Gen28 episodes: `128/128` valid, `2` exact successes, mean Task Score×100 `2.8646`;
- latest native state: `state-v28`;
- counted matched experience: `3,584 / 20,640`; remaining: `17,056`;
- Amendment 006 repair is complete and exactly-once consumed;
- `formal_task_consumption_allowed=false`;
- `gpu_allocation_allowed=false`;
- Gen29 is not authorized;
- final test remains locked.

The next gate is a separate Gen29 execution-readiness / resumption decision under the frozen Track B contract. Do not rerun the Gen28 repair, start Gen29, allocate GPU, consume new tasks, or unlock final under current authority.

Track A and Track B answer different questions. Track A validates one released-code-recoverable first-validation task semantic panel and measures frozen BASE vs frozen SD-LoRA on it. Track B is the matched method comparison that reruns SEED and OpenEvo under one frozen world and matched budgets.

## Current BaseModel Results state

The Results route keeps the seven-question reader path, claim-local provenance, and the collapsed technical action-wrapper trace. The current publication refresh must visibly reflect:

- Track A semantic validation `128/128 PASS`;
- Track A paired result `7.17` vs `8.74`, both `3.9%` exact success;
- paired Task Score delta `+1.57`, 95% CI `[-3.21,+6.31]`;
- no stable win claim;
- evidence package `PUBLISHED_AND_VERIFIED`;
- paper-final exact-128 / paper-checkpoint boundary;
- governance ordering exception in technical provenance;
- current WB1 `GEN28_STATE_V28_BARRIER_PASS_ADOPTED` state-v28 boundary, with Gen29 still no-execution.

For non-trivial Results edits, read:

1. `current/scientific-state-provenance.md`
2. `current/experiment-result-publication-workflow.md`
3. `current/seed-openevo-results-reader-contract.md`
4. `current/seed-openevo-results-current-state-2026-08-26.md`
5. `current/research-explainer-page-standard.md`
6. `current/audience-centered-technical-copy.md`

Then refresh `mykcs/openevo-experiment` before using words such as current, running, completed, released, next, or authorized.

## Current release / acceptance rules

Keep these boundaries separate:

```text
source synchronization
!= repository Gate/build success
!= exact-head Preview READY
!= changed-route browser acceptance
!= merge
!= Production acceptance
```

For ordinary deployable changes, the Vercel build command must actually execute:

```bash
npm run verify:deploy
npm run build
node scripts/vercel-ui-gate.mjs
node scripts/vercel-lab-browser-gate.mjs
```

`SKIPPED`, ignored, canceled, stale-head, or rate-limited execution is not `PASS`.

For the Results release, require exact-head Preview metadata and zh/en browser acceptance on the changed routes before merging. After merge, require a READY Production successor on `main` and verify the public zh/en routes.

For Production browser scope, read `current/deployment-policy.md` and `scripts/vercel-ui-plan.ts`; never infer that a focused or skipped hosted browser layer weakens the pre-provider acceptance requirement. Uncertain scope must fail closed to the complete hosted matrix.

## Provider wait discipline

Provider latency is not productive Agent work. Do not spend minutes in repeated `sleep -> poll Vercel -> sleep -> poll logs` loops when a deployment is visibly progressing and there is no actionable failure.

Default behavior after a provider-triggering ref update:

1. Record the exact head SHA and deployment ID/URL.
2. Do one immediate provider-state read and, when useful, one short tail/error log read to prove that the build started and is not already failing.
3. If the deployment is still `BUILDING` with active progress and no actionable failure, make at most one short recheck after roughly 30–60 seconds. Do **not** schedule multi-minute conversational sleeps merely to wait for Vercel.
4. While the provider runs, continue only independent work that cannot retrigger or invalidate the same deployment. Do not manufacture source changes just to stay busy.
5. If no independent work remains, stop active polling and return a compact resume checkpoint: exact SHA, deployment ID/URL, current phase, last meaningful log timestamp, and the next acceptance action once the deployment becomes terminal.
6. On the next user turn or explicit monitoring run, resume from that checkpoint. Query the deployment object first; read only `errorsOnly` or the log tail needed for the current phase instead of rescanning full build logs.
7. Repeated fast polling is justified only when the provider is already near a terminal transition, when an actionable failure is suspected, or when the owner explicitly asks to wait synchronously.

The goal is to separate **provider completion latency** from **Agent reasoning time**. A long Vercel build may still be correct for a high-risk change, but the Agent should not occupy the whole build duration babysitting it.

## Repository-write hygiene

Shared GitHub/provider state is not scratch space.

- use reads/searches for discovery;
- never create probe files/comments/commits to test capability;
- batch intended changes before the first provider-triggering branch update;
- prefer one atomic blob/tree/commit/ref update for coherent multi-file changes;
- never create empty/no-op commits solely to wake Vercel;
- if provider state blocks release, report the blocker instead of manufacturing source changes.

## Agent reading model

```text
/AGENTS.md
-> this handoff
-> current/project-agent-operating-principles.md
-> current/branch-and-pr-conventions.md
-> current/website-engineering-standard.md
-> current/scenario-trigger-registry.md
-> one matched task bundle from docs/agents/README.md
-> executable source/config/tests/live provider or experiment truth
```

History is evidence, not current authority. The reusable Results/Vercel/source-faithful cases remain under `docs/agents/history/`; always rerun fresh diagnostics before acting on a similar symptom.
