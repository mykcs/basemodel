# Reader-journey repair experience retention

Date: **2026-09-07**
Status: **historical experience/causal record; not current runtime or scientific authority**
Parent implementation/release ledger: [`2026-09-06-reader-journey-repair.md`](2026-09-06-reader-journey-repair.md)

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
