# Reader-journey repair experience retention

Date: **2026-09-07**
Status: **historical experience/causal record; not current runtime or scientific authority**
Parent implementation/release ledger: [`2026-09-06-reader-journey-repair.md`](2026-09-06-reader-journey-repair.md)
Full-conversation delivery index: [`2026-09-07-full-conversation-experience-deposition.md`](2026-09-07-full-conversation-experience-deposition.md)

This file records the reusable lessons from the end-to-end reader-journey repair conversation. It intentionally does **not** restate the page implementation, PR/Preview/Production checklist, or current experiment state; those remain in the parent ledger and current owners. The purpose here is to explain why apparently reasonable approaches failed and what a future Agent must do differently.

## 1. Retention classification

### A — durable cross-task rules

1. **Current authority reads are ref-qualified.** A file in a local checkout is evidence about that checkout only. Before treating it as current `main`/branch truth, record `HEAD`, branch, dirty state, and intended remote/ref SHA; use `git show <ref>:path` or connector fetch at an exact ref.
2. **Durable artifacts outrank conversational status prose.** After tool timeouts, reconnects, or contradictory assistant messages, reconstruct state from branch/PR/CI/provider/test/research receipts before declaring blocked or done.
3. **One failed tool path is not capability absence.** Tool discovery/listing is not execution; a Git HTTPS/HTTP2 timeout is not automatically an auth failure; a missing stream is not automatically command failure. Try another safe owner-appropriate path before escalating.
4. **Repeated comprehension failure is a systems problem.** If prose standards/examples already exist but the same misunderstanding returns, repair semantic ownership and enforcement: typed content/state contracts, sibling-route coverage, negative tests, normal-Gate registration, and real browser acceptance.
5. **Structural PASS is not comprehension PASS.** Contrast/overflow/visibility/no-JS checks prove renderability; rendered reader-journey assertions prove visible semantic prerequisites; only real target readers can supply measured human-comprehension evidence.
6. **Scientific lifecycle states are distinct receipts.** Registered/locked, authorized, running, completed, and sealed/publishable are different. Website code/deployment cannot advance scientific authority.
7. **Non-identifiable is not zero effect.** If the causal contrast cannot be formed, preserve that failure as non-identifiable; do not rewrite it as a measured null.
8. **Release evidence belongs to an exact tree.** If `main` moves, classify overlap, build the final combined tree, rerun affected acceptance, lock merge to the accepted head, then verify Production separately.

### B — BaseModel / OpenEvo project-scoped lessons

- The capability-exploration family needs one explicit reader role/coverage inventory rather than assuming the named page is the whole scope. In the implemented repair, the gateway and Mechanism-1.0 were rebuilt while sibling routes were contextualized; those labels are part of honest scope, not generic product doctrine.
- Mechanism-1.0 is not a four-step A→B→C→D pipeline. M1-A and M1-B test distinct causal questions; M1-C is conditional on a preregistered signal plus separate authority; M1-D is an independent initialization reference. Future diagrams must preserve that dependency topology.
- The original M1-A predecessor became non-identifiable because its required late anchors resolved to the same model state. The successor repairs anchor selection; it does not rewrite the predecessor as a zero-effect experiment.
- M1-D execution authority and M1-D sealed results are different publication states. A public “activated” label must not fabricate running/completion/result evidence.
- The concrete executable reader owners created by the repair are recorded in the current human-thinking contract; future capability-exploration routes must enter the maintained route inventory and normal regression Gate.

### C — transient state deliberately not promoted

The implementation PR numbers, commit SHAs, Vercel deployment IDs, CircleCI job IDs, local PIDs, temporary worktree paths, exact test counts/durations, and momentary provider status are historical reconstruction evidence only. They may remain in the parent closeout, but they are **not** current rules and must not be copied into `LATEST.md`, current policy, or long-term memory as if still live. No GPU/server allocation or occupancy from this conversation was promoted.

## 2. Friction matrix: what happened, why, and the defensive rule

| Friction | What happened | Wrong assumption / missing context | Pre-action check next time | Defensive rule | Reasonable-looking anti-example |
|---|---|---|---|---|---|
| Repeated “make it simpler” fixes did not hold | Earlier attempts had standards and examples, yet first-time readers still lacked start/stop/dependency context | Writing guidance was treated as enforcement; reader was implicitly assumed to know agents/project vocabulary | Inspect semantic owner, rendered route family, tests that actually run, and whether required lifecycle fields exist in data | Convert recurring reader invariants into shared typed data + rendered components + negative tests + route inventory | Add another “write clearly” Markdown and edit only the named paragraph |
| Flat experiment cards changed scientific meaning | A/B/C/D could look like one sequential flow | Visual equal weight was mistaken for causal/dependency equivalence | Resolve upstream design/authority before drawing topology | Diagram evidence dependencies, conditions, and independent references explicitly | Make four equally styled numbered cards because it is visually tidy |
| M1-A predecessor looked like a null result | Identical accepted states yielded no identifiable direction | Zero vector was conflated with measured zero causal effect | Check state identity and whether the contrast exists before interpreting reward | Non-identifiable/blocked is a separate state from valid negative result | Write “task-vector effect = 0” because the computed vector norm is zero |
| Authorization looked like execution/result | M1-D had an execution release but no sealed result | One status label was used as the whole lifecycle | Require release, actual start/end, and result receipt separately | Reject impossible lifecycle combinations in schema/tests | “Activated” → show progress/result placeholder as if run began |
| Structural tests were treated as understanding tests | Visibility/overflow/contrast could all pass while the argument remained confusing | Browser geometry was used as a proxy for reader mental model | Run both semantic answer-location checks and visual tests; label evidence layer | Structural/visual, reader-journey semantic, and human comprehension acceptance are three layers | `toBeVisible()` on a paragraph containing the right words |
| Stale tests failed after intentional rewrite | Old assertions still expected retired wording/global status | Test text was treated as product authority | Ask whether the invariant is still valid and compare against current semantic owner | Fix stale tests when current truth proves the assertion obsolete; do not weaken valid gates | Restore old copy just to make a snapshot green |
| `innerText` vs `textContent` caused a false failure | A strict before/after state check differed only in whitespace semantics | DOM serialization equivalence was mistaken for visible-text equivalence | Use one reader-facing text API on both sides | Test the user-visible invariant, not incidental DOM whitespace | Loosen the assertion to “contains some text” instead of fixing the measurement |
| Reduced-motion assertion expected literal `0s` | Global `.01ms !important` produced a tiny serialized duration | CSS duration string was used as proxy for “no meaningful motion” | Inspect transition property/active animations and owner CSS | Assert behavior (`transition-property: none`, no active animations) rather than one serialization | Add another `!important` override solely to force `0s` |
| Main moved after expensive acceptance | A concurrent PR added independent pages after the first qualification | Earlier exact-head evidence was assumed timeless | Refresh current main, compare intervening files/owners/provider policy | Preserve old evidence only in its scope; validate the final combined tree before merge | Merge a behind branch because its old Preview was green |
| Preview/Production/provider state was over-collapsed | READY could be mistaken for product acceptance | Provider completion, route correctness, merge, and Production identity were conflated | Record head/base/deployment SHA and inspect real route | Keep source, CI, Preview, merge, Production as separate gates | “Vercel READY, therefore website task complete” |
| Assistant said work could not continue even though artifacts existed | A later status answer ignored already-created branch/tests/Preview and downgraded a tool-path problem to task impossibility | Conversation narration was trusted instead of durable artifacts | Re-read worktree/branch/PR/CI/Vercel state before status claims | Reconstruct state from durable artifacts; correct the narrative and continue | Generate a standalone prototype because repository work is assumed unavailable without checking |
| Local working tree was mistaken for current authority during this retention pass | Directly reading the primary checkout exposed older policy text because that checkout was on another branch | Path existence/current-looking filename was mistaken for current `main` | `git status --branch`, `HEAD`, target ref SHA; use `git show <ref>:path` | Ref-qualify authority reads | `cat docs/agents/current/foo.md` from whichever checkout is easiest |
| Local Git transport failed while GitHub connector worked | HTTPS/HTTP2/443 fetch/push attempts timed out or errored, but repository API state remained writable | Network transport error was mistaken for repository permission/capability failure | Separate auth, transport, and repository state; try read via connector | Do not change credentials/remotes because one transport path failed | Rotate tokens/SSH keys immediately after a transient HTTP2 error |
| Tool discovery consumed time without completing actions | Repeated schema/tool listing occurred before the actual repo/provider operation | “I found a tool” was mentally counted as progress | After discovery, immediately invoke the owner action and verify its result | Discovery is not execution; every status claim needs an action/artifact | Repeatedly list tools and then report “not available” without invoking the discovered capability |
| Provider polling risked becoming busy-wait | CI/Preview were pending for minutes during closeout | Synchronous attention was conflated with useful work | Record exact identity, do independent work, then bounded recheck | Follow provider-wait discipline unless owner explicitly asks to wait synchronously | `sleep 30; poll` loops while no action is possible |

## 3. Scientific/engineering reasoning corrections

### 3.1 “Clearer page” and “scientifically faithful page” are one coupled problem

The page could not be simplified safely by deleting details at random. The repair had to preserve the upstream experiment semantics while changing the reader path. The useful pattern is:

```text
upstream scientific authority
-> stable semantic objects / lifecycle states
-> reader-first main path
-> local evidence depth
-> executable negative + browser acceptance
```

This prevents two symmetric failures: an accurate evidence wall that nobody can understand, and a friendly explanation that silently changes scientific meaning.

### 3.2 Engineering convenience must not create scientific state

A UI status chip, a static timestamp, a deployment event, a provider green badge, or a convenient test fixture cannot create experiment authorization, running state, completion, identifiability, or a result. When the science does not provide a state/time/result, the page must say unknown/unsealed/locked rather than infer it for design completeness.

### 3.3 Negative evidence needs the right ontology

At least four states that looked similar in a dashboard are scientifically different:

- `not run / locked`;
- `authorized but no execution receipt`;
- `not identifiable`;
- `valid executed negative/null result`.

A future Agent must name the correct one before writing copy, a chart, a badge, or a test.

## 4. Why previous retrospectives did not prevent repetition

Several failures were not new. Earlier repository history already discussed reader-first copy, moving-main release identity, stale tests, Fish/Bash boundaries, worktree isolation, and provider-vs-product acceptance. They still resurfaced for four reasons:

1. **Rules were discoverable only after the failure.** A detailed history file is weak protection if the task router does not trigger it at the moment of action.
2. **Some rules were prose-only.** “Write for the reader” did not force every experiment to have start/stop/output fields or every sibling route to declare coverage.
3. **The evidence proxy was too weak.** Visibility/overflow/keyword assertions protected pixels/strings, not the reader's causal model.
4. **Status was reconstructed from narrative memory.** Long tool sequences made the last assistant sentence feel authoritative even when PR/provider artifacts contradicted it.

This retention pass therefore changes the information level instead of merely adding another retrospective:

- root `AGENTS.md` gets the ref-qualified-read and durable-status reconstruction guards;
- `project-agent-operating-principles.md` gets durable state reconstruction and A/B/C retention classes;
- `human-thinking-web-expression-contract.md` gets the three-layer acceptance model and repeated-failure escalation path;
- `scientific-state-provenance.md` gets the lifecycle/identifiability state ontology;
- `scenario-trigger-registry.md` makes repeated readability failure and retrospective reconstruction trigger these owners automatically;
- this file keeps incident-specific causal detail as history.

## 5. Long-term-memory extraction boundary

Memory-eligible candidates from this conversation are the durable user/workflow preferences: reader-first Chinese technical explanation for people with no agent/project context; solve root causes rather than layering patches; when a repeated failure already has prose standards, add executable ownership/tests; distinguish engineering completion from real human comprehension; and continue autonomously across safe tool paths until a real boundary remains.

No long-term-memory mutation is claimed here. Repository commits are project knowledge, not ChatGPT account memory. A future Agent performing a memory write must first verify that the current runtime exposes an actual memory-write capability; search, personal-context retrieval, repository commits, and conversation summaries are not substitutes.

## 6. Temporary information intentionally excluded from durable memory/current policy

Do not retain as timeless facts: current PIDs; current GPU usage/allocation; current rounds/percentages; temporary worktree paths; a PR's momentary mergeability; CircleCI queue state; Vercel BUILDING/READY at a past instant; one-off test durations; transient HTTPS failure text; temporary share URLs.

When these details matter for historical truth, keep them only in the bounded parent release/incident ledger with exact timestamps/identities.

## 7. Future Agent preflight for this problem class

Before touching a page after a complaint like “people still cannot understand it”:

1. prove the target ref/working tree you are reading;
2. read root/current reader + scientific provenance owners and the scenario trigger;
3. fetch the exact upstream scientific authority;
4. write the target reader questions before rewriting prose;
5. inventory sibling routes and the shared semantic owner;
6. model start/action/stop/output/evidence state explicitly;
7. preserve planned / locked / authorized / running / completed / sealed / non-identifiable / negative states separately;
8. implement the main path with semantic HTML, then optional interaction;
9. add negative-state tests plus rendered route coverage to the normal Gate;
10. run structural/visual and reader-journey acceptance; label real-human testing separately;
11. refresh main/PR/provider identities immediately before merge;
12. verify Production independently;
13. deposit only the new reusable delta, not every transient detail.


## 8. 完整对话的增量复核

范围：Ceiling 后继问题选择 → Mechanism 哲学/Master Plan/实验身份证 → M1-D runtime、模型与Ray边界 → 轨迹/MiniMax发布依赖 → 网站骨架 → 反复可读性投诉 → #499/#516 合流及发布。实验细节由 [OpenEVO 已有案例](https://github.com/mykcs/openevo-experiment/blob/main/docs/troubleshooting/experiment-ops/CASE-MECHANISM1-M1D-EXECUTION-PUBLICATION-RETROSPECTIVE-20260906.md) 持有；本节只存跨层教训和网页侧增量。

证据等级：可见用户指令和实际工具回执优先；本次重新读取仓库现有规范并核验 #516。更早的截断/脱敏内容不补写成已看到的命令、数字或责任归因。旧 Assistant 总结只能作检索线索；不能证明“已上线”“已开跑”或某次删除的对象。共享存储保护是有历史纠错依据的长期边界，但不据此虚构本对话某一次误删事故。

### 新增摩擦：从合理外观到可执行反例

| 触发/发生了什么 | 原因与错误假设 | 操作前检查 | 防御性规则及落点 | 看似合理的反例 |
|---|---|---|---|---|
| 多次报80%/90%、最后一道，用户仍连续问进度 | 没有统一分母；局部资格通过被当成端到端收口 | 当前交付物、已验证证据、下一项缺失条件 | operating principles 的阶段式进度报告；不报未定义完成百分比 | “只差runtime”但尚有轨迹、MiniMax、对比、网站发布 |
| 已知Fish规则后仍用默认shell执行Bash | 规则在上下文，命令参数没有落实 | 看工具外层 `shell`、脚本语法检查、最小无副作用调用 | `REPEAT-CORRECTION` 的检查证据必须落在下一条命令 | 在被Fish解析的复杂命令内再套 `bash -lc` |
| 目录名叫integrated/final，却没有Git元数据 | 来源导出被误称worktree/精确head | Git分类、导出base、允许改动清单、完整树/文件映射 | release §6.4；导出可测试但不能自行授予提交身份 | `git status`失败后仍称“干净Git树已验收” |
| 新增五問字段后仍用大量内部词汇 | 把字段存在当作答案可理解 | 脱离标签读正文；任务、角色、开始/结束是否可复述 | human-thinking §10.10；字段/几何/真人理解分层 | 用“等待gate / 跟随successor”填满五格 |
| 单屏目标容易诱发过小字体或过度压缩 | 把“塞得下”当成“看得懂” | 核心字号、行距、文本含义、设备适用范围 | 删除重复表达或重排；不靠缩字/隐藏主答案过测试 | 为让1280×633通过把主文变成10px |
| 桌面首屏通过被概括为所有设备通过 | 混用了首屏高度和横向overflow两个指标 | 分设备记录实际几何、可见路径与交互 | 手机可以滚动；不能把无横向溢出说成五问同屏 | 用390px overflow=0宣称手机首屏完整 |
| 两个并行实现各自正确，合并却可能恢复旧科学状态 | 以文件归属/代码新旧代替语义所有者 | 当前科学来源、main已有贡献、UI增量、保留回归 | 当前事实先行，展示层后接；不删除生命周期反例 | 整文件覆盖掉#499，只留新的Orientation |
| 反复重新发现工具、读取同一旧日志 | 把操作次数当交付推进；已知schema没复用 | 上次动作结果、当前缺少的可观察量、下一有效工具 | 能力发现后实际调用；只在状态边界复核 | 连续列工具后仍说“不知道能不能做” |
| 旧固定deployment链接被当成最新站点 | 发布地址与可变别名没有区分 | 稳定域及其实际部署SHA；页面内容回查 | release §9；旧链接标历史，临时share不入Git | main已更新仍给旧随机子域让用户验收 |
| `current/`中的旧M1快照继续写全锁定 | 目录标签压过文件作用域 | 日期、绑定的科学SHA、后续机器router | 加历史作用域与现行入口，保留原值 | 把旧快照状态直接套到未来M1-A |
| 写了retrospective又被视为“已经记住” | 仓库知识、检索记忆、持久化记忆混为一谈 | 真实写接口及成功回执是否存在 | 没有写接口就明确未写；候选不称已保存 | 用personal-context search成功冒充memory update |

### 重复犯错的具体归因

不是所有问题都因文档埋太深：Bash、exact-head、不能伪造结果等已在入口，仍未落实到命令/报告；这属于**操作时检查缺失**。可读性反复失败还包括**代理指标过弱**和**新增展示层绕过旧事实所有者**。不断加更长的AGENTS会增加检索成本，却不补这三处断点。

本轮只在根入口留一个短路由；把检查步骤放在既有owner；沿用已注册的reader/lifecycle浏览器检查，并给已有Agent入口测试补充路由回归。文档测试仅证明规则可发现，不能证明未来Agent一定执行，更不能冒称真人看懂。

### 长期记忆提炼（候选，不是已写入）

值得跨对话保留：用户偏好中文、对零项目背景者也讲清任务与边界；要求实际落地而非反复规划；重复纠错应修共享根因并保护回归；不动他人的文件/容器/实验，唯一科学证据先验证归档再讨论删除；科学证据、运行状态、网站发布分别核对。短交付窗口意味着优先有辨识力的OpenEVO问题，而不是挑好分数；具体日期、模型、GPU许可和M1阶段禁令仍归项目合同，不能成为永久账户默认值。

本轮环境没有可用的长期记忆写接口，因此实际长期记忆写入为**0条**。检索到既有记忆不等于新增记忆；仓库提交亦不等于ChatGPT永久记忆。未来写入前必须再核验当时能力，且不得把这条工具限制永远化。

### 保留层级与明确排除

A：反复纠错的操作前证据、正确解释/状态口径、最小权限及非破坏性工作方式 → 根AGENTS短路由与current owners。
B：M1-D支持实验定位、A/B/C依赖、MiniMax发布链、#499/#516合流、单屏范围 → 科学runbook及本案例/父发布记录。
C：PID、当前占卡/磁盘余量、轨迹进度、百分比、临时目录、瞬时PR/CI状态、端点端口 → 不提升为长期规则。必要的历史SHA/部署ID/失败测量留在父案例供复核，不写入记忆；secret/share值不保存。


### 具体验证：新组件逃出了旧的字号选择器

复核快照 `basemodel@6307e459af9820fee2e2843cd640ac978c77aea9` 中，`ResearchStateRail.astro` 使用 `data-state-lifecycle`，正文 `dd` 的局部样式为 `.68rem`；`ResearchJourney.astro` 的摘要为 `.75rem`。与此同时，`reader-journey.cases.ts` 的字号/对比检查仍选择 `[data-lifecycle] dd` 等旧表面，未覆盖这些新增状态栏和旅程正文。这是源码可核查的覆盖漏洞，不是通过总测试数能排除的问题；此处不冒充新做了全部设备的计算样式测量。

因此 #516 的发布成功和已有浏览器通过记录仍保留，但不能从它们推出“用户可读性问题已经彻底解决”。现有 [后续修复 #518](https://github.com/mykcs/basemodel/pull/518) 的候选范围包括这些产品表面；这里只记录复核时的范围，不把候选的自报验收当成已发布事实，也不复制其代码开另一条修复线。

长期规则是：**语义内容换了所有者或DOM标记，相关字号/对比/可见性检查必须一起迁移；测试数量不是覆盖率。** 当前表达合同§10.10已补充这一操作要求。本轮新增文档入口测试只保护规则发现，不能充当尚需产品回归验证的替代品。


## 9. 2026-09-07 implementation follow-up: overlap, conflict boundary, and paused handoff

本节只记录本轮“允许执行后”的后续尝试；它不把未合并的源码导出、临时测试结果或暂停状态改写成产品发布事实。

### 发生了什么

用户授权执行后，Agent 先把读者入口、生命周期解释、路线覆盖和浏览器检查组织成一组约 19 个文件的补丁，并做了目标路由的浏览器回归。与此同时，仓库里已有的相关 PR 继续前进，导致初始补丁快照与当前 main/PR 头部不再是同一棵树。合并比较中出现未解决的冲突标记；这些文件没有被当作可交付代码。定向路由检查曾通过，但完整 UI 预检先暴露了一个过时的字面量断言和桌面首屏高度问题：前者应随语义迁移，后者通过删去重复表达和重排解决，不能靠缩小主文字。用户随后明确暂停，因此没有继续创建实现分支、改动实验/GPU/Docker、部署或宣称网页已修复。

### 增量摩擦与防御规则

| 当时发生了什么 | 为什么发生 | 操作前检查 | 防御性规则 | 看似合理但不应该 |
|---|---|---|---|---|
| 并行 PR 改变了同一批页面的基线 | 把第一次读取的 main/PR 快照当成静态基线 | 重新读取 main、所有相关 PR 的 base/head、文件 owner 和 CI 身份 | 任何合流前都要在最终组合树上重做语义回归；旧 green 只对旧树有效 | 复用落后分支的 Preview 说“已验证” |
| patch/export 目录出现冲突标记 | 来源导出被误当成 Git worktree，且合并只按文件而非语义 owner | 检查 .git 身份、三方 diff、冲突标记扫描 | 冲突标记 fail-closed；export 可用于审阅，不能提交或授予 HEAD 身份 | 看到文件齐全就压缩交付，或整文件覆盖掉并行 PR |
| 旧 E2E 断言期待“阶段已激活” | 文案从执行暗示改为“授权/暂无执行回执”，测试仍锁定旧词 | 判断旧断言保护的科学不变量是否仍成立 | 让断言跟随当前语义 owner，验证授权、实际开始/结束、sealed 各自状态 | 为让 CI 绿而恢复含糊的“已激活” |
| 受约束状态未进入 schema | 页面先写标签再补数据，导致 impossible state 可出现 | 定义状态转移和互斥字段；例如 authorized 不得有 actualStart/End，running 不得有 actualEnd，sealed 必须 completed | 所有显示状态由 typed facts 派生，并用负例拒绝不可能组合 | 用一个 status 字符串覆盖全部生命周期 |
| 首屏“装下”与理解混为一谈 | 几何通过被当成信息密度通过 | 检查核心字号、行距、折行、答案是否仍可直接找到 | 先删重复、重排层次、补可滚动分段；不得隐藏答案或压到不可读字号 | 把正文缩到 10px 只为通过 1280×633 |
| 只验证了命名路由 | 组件复用范围大于已测路由，覆盖统计看起来比实际大 | 建立 route × semantic-owner inventory，逐路跑 reader assertions | “覆盖”必须给出实际 route/locale/owner；未知路由 fail-closed | 用一个中文 URL 的绿灯代表整个 capability family |

### 暂停边界

暂停时保留了审阅用的 patch/export 和 handoff 压缩包，但它们不是 Git worktree、不是当前 main、不是生产部署。没有继续创建实现提交、启动/停止实验、占用 GPU、改容器或升级依赖；本轮新增真实运行/真人理解证据为 0。这些临时路径、压缩包位置、当前 PR/PID/GPU/provider 状态均不进入长期规则或账户记忆。

## 10. 暂停之后的继续执行：smart integration、guarded merge 与 Production 收口

第 9 节记录的“暂停”是当时真实发生的历史边界，不删除、不改写。随后用户明确要求继续，工作恢复，并最终形成 PR #530；因此“暂停”不能被未来 Agent 误读成整个对话的最终状态。下面只记录恢复之后新增的因果经验。

### 实际发生的关键转折

恢复工作时，最初计划仍想沿用此前已经验证过的候选 head，但远端 `main` 已经进入 #524 和 #527。第一次旧结论因此立即失效：不能把旧的 398/398 或“0 path overlap”继续当成当前合并证据。Agent 重新以 live `main` 为基线，发现 #530 的 10 个冲突文件全部来自已经合并的 #524 语义，而 #527 自身的 12 个新增/重构路径与这些冲突路径为 0 交集。进一步比较 #524 PR exact head 与其进入 `main` 后的内容，确认差异只在少量 CI/规范文档，而不是这 10 个冲突文件。最终保留已经审阅过的 `#524 + comprehension repair` 版本，同时完整接受 #527 的 disjoint Study Overview 结构。

组合树缩为 21 个真实差异文件后，旧测试证据被明确降级为历史证据；最终 exact head `a954760...` 重新完成确定性门、478 路由构建、单 H1、三档 viewport overflow 与 Chromium + WebKit 398/398。Vercel Preview 还必须证明是真构建而不是 ignored-build 假绿：provider 记录绑定同一 SHA、`[vercel-preview]` 生效、deploy-relevant 路径被检测、`vercel build` 实际运行。受 Preview Protection 影响，自动浏览器会话被 SSO 挡住，因此没有冒称“托管 Preview 视觉验收已通过”；该层证据由 exact-head 本地浏览器矩阵、hosted required checks 与之后 Production 公共域名验证分别承担。

所有 required checks 终态成功后，Agent 重新读取 PR head、`main`、branch protection、provider 状态和 review threads，再使用 `expected_head_sha=a954760...` 执行 squash merge。第一次 merge 工具调用因为参数名写错，在客户端 schema 校验阶段被拒绝，GitHub 没收到 mutation；这不是“半合并”。修正参数后同一 guarded merge 成功，`main` 成为 `4e8543ab...`，其 tree 与通过完整验证的 PR tree 相同。随后 Vercel Production 明确绑定该 main SHA、真实执行 build，稳定域名中英文 mechanism 页面均返回 200 并包含关键 reader/scientific 语义。main 自动 post-merge CI 也最终全绿；没有人为重跑来浪费 CI 额度。

### 新增摩擦、错误假设与防御规则

| 发生了什么 | 错误假设 / 缺失上下文 | 操作前必须检查 | 防御性规则 | 反面例子 |
|---|---|---|---|---|
| 已验证 head 在准备合并时落后于新 main | “刚通过的完整矩阵仍然自动覆盖未来 base” | live main SHA、intervening PR、路径/语义 owner、当前保护规则 | 验收绑定 `head + intended base + tree + required-check contract`；material base drift 必须重建最终组合树并重验受影响层 | 拿旧 398/398 给一个已经换过 base 的树背书 |
| 冲突出现在 #527 合并之后 | “最近合并的 PR 就是冲突来源” | conflict-path set ∩ 每个 PR changed-path set；旧 PR exact head vs merged-main blob | 先给冲突做归因，再选 side；冲突时间顺序不是因果归属 | 因为 #527 最后合并，就整文件覆盖掉 #527 的 disjoint Study Overview |
| Preview GitHub/Vercel 状态为绿 | “绿色 provider context 等于真实 Preview build” | deployment object、bound SHA、readyState、ignore-build 日志、真实 build marker | required provider acceptance 要证明执行链，不接受 ignored/skipped/canceled 假绿 | 只看 GitHub `Vercel=success` 就合并 |
| Preview 被 SSO 挡住 | “自动浏览器打不开 = 应用坏了”或“READY = 已做视觉验收” | HTTP/auth 跳转、provider protection、已有本地/hosted browser evidence | 保护层访问失败单独分类；既不降级应用，也不冒称视觉 PASS | 为了自动化方便关闭 Preview Protection |
| merge 工具参数 schema 校验失败 | “调用过 merge 就可能已经改了远端” | 错误发生在 dispatch 前还是后；PR/head readback | dispatch 前 schema rejection = 无远端 mutation；修正参数后刷新 merge witness 再重试 | 因参数名错就轮换 Git 凭据或手工改 main |
| hosted browser shard pending 数分钟 | “pending 太久就是 stuck，要重跑/取消” | required check、job 状态、是否已有失败、是否属于当前 exact head | 正常运行的 required job 保留；不要为追快取消/重触发，终态才是 merge authority | 本地已绿就绕过 pending shard |
| merge 后又出现 main CI | “PR 通过过，所以 main 自动复验可以当重复垃圾删掉” | 当前仓库 post-merge contract、main SHA、Production identity | pre-merge required checks 决定 merge；post-merge revalidation 是新的 main 身份证据，正常让它收口，不人为重触发 | 合并后取消 main CI 只为省几分钟 |

### 重复犯错检查：为什么以前写过仍会再发生

这次不是所有问题都“再次犯错”，但至少四类旧风险再次出现或差点出现：moving-main、provider-success 过度概括、工具调用层与目标系统层混淆、把自动化工程 PASS 当真人理解 PASS。它们此前已经存在于 release/readability retrospective 中。仍会复发的原因不是缺一篇更长的历史文档，而是：

1. **旧规则缺少合并窗口的机械 witness。** “merge 前刷新”容易被当成一句提醒，没有固定成一组 live tuple + guarded mutation。
2. **冲突没有先做因果归因。** 过去强调 path-by-path 语义 owner，但没有明确要求把 conflict set 与每个 intervening PR 的 changed-path set 做交集，导致“最近发生 = 最近 PR 导致”很诱人。
3. **工具错误视觉上很像目标系统错误。** schema validation、transport timeout、provider auth protection 都可能被粗暴压成“GitHub/Vercel 失败”。
4. **人类理解证据仍不可由工程测试替代。** 这次虽然页面、浏览器、Production 都收口，真实目标读者仍是 0 人；因此不能把 #530 的工程完成改写成“老师/同学已被证明能看懂”。

本轮不再扩写根 `AGENTS.md`：入口已经有 moving-main、REPEAT-CORRECTION、shell、provider、shared-state guards。新增规则直接进入现有 `multi-pr-semantic-integration-playbook.md` 与 `release-closeout-protocol.md`，让未来 Agent 在真正执行 smart merge / release 时读到 use-site 规则。

### A / B / C 信息分层

**A — 长期稳定规则**：冲突先归因再选 side；验收绑定 exact tree/base/contract；required checks 终态后形成 atomic merge-window witness；支持时用 expected-head 锁；dispatch 前 schema rejection 不冒充远端 mutation；provider access/READY/visual acceptance 分层；Production 独立验收；自动化 PASS 不等于真人理解。

**B — BaseModel 项目级经验**：#524/#527/#530 的具体合流方式、`[vercel-preview]` + deploy-relevant classifier、Vercel Preview Protection、CircleCI 三 required contexts、478-route/398-case 这些只用于解释本次 BaseModel release 机制和历史证据；当前数值/规则仍需按 executable/live truth 重查。

**C — 临时状态**：中间 head、workflow/job ID、deployment ID、pending 时长、本地 PID、临时 worktree、当时的 PR mergeability 均只作为本次历史 receipt；不进入长期规则或账户记忆。

### 长期记忆边界

本环境仍没有可调用的长期记忆写接口，因此本轮实际账户级长期记忆写入仍为 **0 条**。没有把仓库提交、personal-context 检索或聊天总结冒称为记忆更新。可作为未来真实记忆接口候选的只有跨项目稳定偏好：中文/零背景 reader-first；重复纠错修 owner/contract 而不是叠 patch；共享状态先读后写且不动他人资源；科学、运行、发布、真人理解证据分层；smart merge 要验证最终组合树并原子锁定 merge。
