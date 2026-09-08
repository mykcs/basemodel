# PR #550 exact-head watch 与 merge closeout 经验沉淀

记录日期：**2026-09-08**
状态：**historical engineering record; not current CI/release authority**
当前规则 owner：[`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md)、[`../current/scenario-trigger-registry.md`](../current/scenario-trigger-registry.md)

## 1. 范围与历史真实性

这次对话只处理 BaseModel PR #550 的 CI 观察、merge-readiness 判断和随后经 owner 明确授权的合并。没有 GPU 调度、服务器存储、Docker、实验运行、科学结论或模型资产变更；不能为了“完整 retrospective”虚构这些摩擦。

历史接受身份是：

- PR：`#550`；
- 被要求监控的 exact head：`04afe97c24e47b22b06e51a4a7b6eab88c843bee`；
- required contexts：`ci/circleci: deterministic`、`ci/circleci: browser_shard_1`、`ci/circleci: browser_shard_2`；
- 用户最初动作边界：checks 完成后只给 merge-readiness note，**without merging anything**；
- 用户随后单独给出“合并”指令，才形成新的 merge authorization；
- 最终 merge commit：`1bb79eb5f45896c380954b39c6b545624f327e6e`，其父提交包含上述 exact head。

本文件记录当时事实与失败风险；未来 required-check 名称、branch protection、当前 main、PR 状态仍必须重新读取 live GitHub truth。

## 2. A / B / C 分层

### A — 长期稳定规则

1. **CI watch 先 live-read，再决定是否需要 watcher。** 对话里“still pending”可能在 Agent 接手时已经过期。首次读取若发现终止条件已满足，应立即报告并收敛；只有仍 pending 才需要真实的 future-condition watch。
2. **Watcher 身份绑定 exact SHA，不绑定会移动的 branch name。** head 漂移时旧 watch 失效；不能自动跟随新 head，也不能把旧 head 的绿色 checks 继承给新 head。
3. **观察条件、readiness 和 mutation authorization 是三件事。** “一条 shard 完成”是通知阈值；“全部 required checks 绿”是 readiness 证据；“可以执行 merge”还需要任务/用户的明确授权边界。
4. **授权改变后必须重新 race-check。** 后来的“合并”不会冻结 earlier readiness。执行 mutation 前重新读 head/base/checks/mergeability/review/provider 等适用 live tuple，并在接口支持时使用 expected-head guard。
5. **不能伪称后台监控。** 环境没有真实 future-condition capability 时，应说明边界；有 capability 时也必须先确认条件仍未满足再创建。
6. **历史结果与 current authority 分离。** 某次 exact head、某次 SUCCESS、某个 merge commit 可以做历史证据；未来 Agent 不能把它们当“现在仍然 pending/green/mergeable”的事实。

### B — BaseModel 项目级经验

- BaseModel 的 release closeout current owner 已经是 `release-closeout-protocol.md`；本次没有创建第二套 CI/merge policy。
- BaseModel 的 task trigger 已经集中在 `scenario-trigger-registry.md`；本次把 “pending-check watch” 加入 exact-head trigger，使 zero-context Agent 在监控任务开始时就加载正确 owner。
- 2026-09-08 这次历史上 required contexts 恰好是 deterministic + 两个 browser shards；这是该次 branch-protection 证据，不是永远不会变化的硬编码契约。

### C — 临时状态，刻意不提升

以下只保留为本历史记录，不写入 current policy / 长期记忆候选：

- 两条 browser shard 在那一分钟的 pending / SUCCESS 转换；
- CircleCI job URL、workflow ID、完成时间戳；
- PR #550 当时的 `open` / `mergeable=true`；
- 当时的 main SHA、临时对话时序；
- 任意本地 worktree 路径、PID 或 provider request ID。

## 3. 对话主线不是流水账，而是一个状态机

```text
用户给出 remembered state:
  deterministic=green
  shard1/shard2=pending
  exact head=H
  action boundary=no merge

        ↓ live read

实际 GitHub state:
  H 未漂移
  三个 required checks 已全部 SUCCESS

        ↓

立即完成 watch 的 terminal report
  不制造多余 watcher
  不执行 merge

        ↓ 用户问“下一步是否合并”

readiness decision:
  exact head + required checks + mergeable => merge-ready
  但 action boundary 仍是 no merge

        ↓ 用户明确说“合并”

new authorization
  -> 再读 live PR state
  -> exact head 未漂移且 mergeable
  -> 执行 merge
  -> readback / merge result
```

关键不是“PR #550 最后绿了”，而是**每个状态转换都有不同的证据和授权语义**。

## 4. 摩擦矩阵

| 摩擦 / 风险 | 当时发生了什么 | 错误假设或缺失上下文 | 下次操作前检查 | 防御性规则 | 看起来合理但错误的反例 |
|---|---|---|---|---|---|
| remembered pending 已过期 | 用户发出请求时说两条 shard pending；首次 live read 时两条已经 SUCCESS | 把聊天里的状态描述当 provider current truth | PR exact head；named check contexts；terminal state | watch 前先 live-read；若条件已满足就立即报告，不创建空转 watcher | “用户说 pending，所以先建每小时轮询，再去看 GitHub” |
| watcher 偷偷跟 head | 本次 exact head 被明确写死，因此 head 漂移本应使任务失效 | 把“watch PR #550”理解为“永远跟这个 PR 最新 head” | 当前 head 是否仍等于 watched SHA | exact-SHA watcher fail closed；新 head 需要新的 acceptance identity | shard 在 H 绿后，PR push 到 H2，仍把 H 的结果当 H2 绿 |
| green/mergeable 诱导提前 merge | 三个 required checks 全绿，PR mergeable；但最初用户明确要求不 merge | 把技术 readiness 当成 mutation authorization | task/PR explicit acceptance rule；draft/review；用户动作边界 | readiness note 和 merge mutation 分开；没有授权就停在 READY | “反正都绿了，顺手 merge 省一步” |
| 后续授权被误当成旧证据仍冻结 | 用户后来才说“合并” | 认为一句新的授权可以复用几分钟前所有 live state | head/base/checks/mergeability/review/provider live tuple | 新授权后立即 race-check，再 guarded merge | 收到“合并”后直接按上一条消息里的 head 状态调用 merge |
| 把 background promise 当执行 | 本次首次读取已 terminal，因此无需 watcher；若仍 pending，必须真的有 future-condition executor | 认为聊天里说“我会监控”就等于监控已经存在 | runtime 是否有真实 condition-watch/automation capability | 有能力就实际创建；无能力就明说，不能假装异步工作 | “我会持续关注”然后没有任何 scheduler/watcher |
| 把单次 required context 名称永久化 | 当时 branch protection 要求三个 CircleCI contexts | 认为 2026-09-08 的 protection 永久不变 | live branch protection / required checks | required-check identity 属于 live release contract | 未来改成别的 gate 后仍只查这三个旧 context |

## 5. 重复犯错检查：以前已经总结过什么，为什么还值得再改 current owner

这次出现的**主题**并不新：更早的 BaseModel retrospective 已经反复写过 exact-head、moving-main、expected-head、`mergeable != authorization`、provider/live state 优先于 remembered report。当前 `release-closeout-protocol.md` 也已经明确拥有这些规则。

可直接追溯的既有证据包括：[`2026-08-31 CI / PR stability`](2026-08-31-ci-pr-stability-and-moving-head-retrospective.md)、[`2026-09-06 CircleCI benchmark causality`](2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md)、[`2026-09-07 root-cause owner convergence`](2026-09-07-root-cause-owner-convergence-and-release-topology-retrospective.md) 和 [`2026-09-07 full-conversation deposition`](2026-09-07-full-conversation-experience-deposition.md)。它们已经说明过 stale status、green qualification、moving shared state 和 atomic merge window；本次不重写它们的通用规则。

因此不能把本次写成“我们第一次发现 exact-head 很重要”。真正的缺口是**触发和执行位置**：

1. 旧规则主要从“最终 release / merge”视角描述；
2. `scenario-trigger-registry.md` 的 exact-head cue 偏向 main drift / provider READY，没有点名“用户让我 watch pending shard”；
3. 未来 Agent 因此可能直到要 merge 才读 release protocol，而不是在创建 watcher 前就应用 exact-head / live-state 规则；
4. “先创建 watcher还是先读 live state”这一顺序此前也没有成为明确 invariant。

这次的层级调整因此是：

- **不再新增 root AGENTS 规则**：root 已经要求 live shared-state refresh、ref-qualified truth、reconstruct status from durable artifacts；再抄一份只会稀释 bootstrap。
- **补 current owner**：`release-closeout-protocol.md` 新增 pending-check monitoring 状态机。
- **补 trigger use-site**：`scenario-trigger-registry.md` 在 exact-head trigger 中加入 pending-check watch cue 和 immediate live-read 顺序。
- **本文件只保存历史因果**：exact PR/SHA/check transition/merge commit 不成为 future authority。

这解决的是 discovery/use-site gap，而不是再制造一份 generic “GitHub SOP”。

## 6. 科研与工程语义边界

这次对话没有触碰实验，所以没有新的 OpenEVO scientific rule。仍需保留一个负面规则：**不要因为 retrospective 模板要求检查 GPU/服务器/科学决策，就虚构一次并未发生的实验摩擦。** “没有发生”本身是历史真实性的一部分。

如果未来 PR closeout 同时携带研究事实，则 current scientific authority 必须另外解析；compile-green / mergeable 不能覆盖科学 provenance。

## 7. 长期记忆候选与实际写入 receipt

满足“跨对话仍适用、忘记会重复踩坑”的候选只有：

- exact-head CI watch 必须先 live-read；已 terminal 则立即收敛；
- watcher 不得自动跟随新 head；
- readiness 与 merge authorization 分离；新授权后必须重新 race-check；
- 不能假装存在后台监控。

**实际 account-level long-term memory write：0。** 当前运行环境没有可调用的长期记忆写入接口。仓库提交、personal-context 检索、聊天总结都不能冒充长期记忆写入。候选已在这里和 current policy 中持久化，但这不等于 ChatGPT account memory 已更新。

## 8. Closeout checklist for a future zero-context Agent

```text
[ ] Read root AGENTS + scenario trigger + release-closeout owner.
[ ] Pin PR number, watched head SHA, required context names, notification thresholds, current merge authorization.
[ ] Live-read PR + exact-SHA checks immediately.
[ ] If head mismatch -> stop; do not retarget silently.
[ ] If notification/terminal condition already satisfied -> report now; do not create redundant watcher.
[ ] If still pending and real condition-watch capability exists -> install it against exact identity.
[ ] When all required checks terminal -> summarize failures or readiness; do not infer merge permission.
[ ] If later explicitly authorized to merge -> re-read live merge tuple.
[ ] Use expected-head locking when supported.
[ ] Read back merge/main result.
[ ] Keep transient status in history only, not current policy/memory.
```

## 9. 沉淀执行期 addendum：规则已经存在，为什么仍会再次踩到

经验沉淀本身又遇到了四类工程摩擦。它们必须保留为历史真实性，但**不应再复制成第四、第五份 current policy**：

| 沉淀期摩擦 | 现场事实 | 正确处理 | 为什么不再新增长期规则 |
|---|---|---|---|
| 熟悉的 BaseModel clone 不是安全写入工作区 | 发现主 clone 位于旧 topic branch，并已有未提交的 `package-lock.json` 变化 | 只读确认 remote/root/HEAD/dirty state；新建从 live main 出发的隔离 worktree；没有 reset、checkout 或覆盖原工作区 | root `AGENTS.md` 已拥有 unexpected shared-state stop-and-read 和 dirty-worktree 边界；本次是执行 witness，不是规则缺失 |
| 普通 HTTPS `git push` 卡在传输层 | GitHub CLI 认证仍有效；远端 branch readback 仍是 404，说明 push 没有落 ref | 终止卡住的 transport path；没有换 token、没有把仓库判成不可用；改走已授权 Git Data 路径并要求 blob/tree/ref readback | root 已明确“一条 Git/HTTP/provider 路径失败 ≠ capability unavailable”；#550 的上一轮沉淀也记录过相同 transport fallback |
| 第一次 Git Data blob POST 返回 HTTP 422 | helper 在 POST 时漏传 request body，错误发生在目标 commit/ref 创建之前 | 用一个不被任何 ref 引用的最小 blob probe 验证 endpoint/auth；定位为 client invocation bug；修正后重新从 live state 开始 | `release-closeout-protocol.md` 已说明 client/schema error 在 dispatch 前不是 repository mutation；这里缺的是 use-site 执行仔细度，不是新 SOP |
| 正要发布时 `main` 被 #551 推进 | fail-closed 脚本发现 expected base 与 live main 不同，在创建候选 ref 前退出 | 比较 `1bb79eb5… -> 51c62282…`；确认 #551 只改 root/router/multi-PR owner/自身 history，与本次两个 current owner 不重叠；再把同一三文件语义贡献构造在新 main 上 | moving-main、stale-governance 与 semantic-owner reconciliation 已由 current owners 覆盖；这里保存的是“已有规则成功阻止 stale-base 写入”的历史 witness |

这四项暴露的共同问题不是“以前没有写规则”，而是：**文档存在不等于操作现场会执行。** durable learning 需要同时有：可发现的 trigger、操作前 witness、写入时 fail-closed guard、错误后的 readback。此次真正新增的 current 增量因此仍然只聚焦 pending-check watch 的 use-site；其余重复摩擦只作为历史证据保留。