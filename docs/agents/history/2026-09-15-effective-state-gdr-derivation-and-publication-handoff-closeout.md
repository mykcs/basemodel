# Effective-State GDR 推导与网站交接：对话经验沉淀 — 2026-09-15

状态：**historical conversation closeout / no scientific or release authority**
范围：Effective-State GDR × LoRA 推导、BaseModel 预结果发布、长上下文交接、重复执行摩擦。
当前规则仍由 `docs/agents/current/*`、`mykcs/openevo-experiment` 科学 authority 和可执行仓库事实拥有。

## 1. 这次对话最重要的纠正

本次真正重要的纠正不是某个数值，而是三个语义边界：

1. **treatment onset 不等于 recurrent state 已经非空。** 如果科学问题是“GDR 控制 Stage2 的参数更新”，那么第一条 Stage2 optimizer update 就应属于 treatment；不能因为 Round0 之前没有物理 rank128 predecessor，就把 treatment 偷偷推迟到 Round1。
2. **原始 GDR gate、effective-write magnitude、LoRA factor displacement 是三个不同对象。** 一个 factor-coordinate 数值越界，不能自动解释成原始 recurrent GDR gate 越界。
3. **ELI5 要解释 owner 点名的科学疑问。** 不能把旁支操作、状态和背景讲得很简单，却让真正的因果问题埋在后面。

这些科学/沟通规则已经由 OpenEvo 当前 authority 提升；本文件不复制成第二份 policy。
## 2. 科学推导为什么会绕弯

旧 first-generation GDR 把 LoRA factor state 当作直接 recurrent state 后，容易把“表示坐标”误当“科学对象”。LoRA 的有效参数是类似 `W = C A^T` 的对象，但同一个 `W` 可以由不同的 factor scaling 表示，因此 raw factor norm、factor displacement 和基于它们的 range check 会随坐标变化。

这次推导最终把两层问题拆开：

```text
controller 该决定什么 effective write
!=
LoRA 坐标里 A / C 各自移动多少
```

随后又发现：只修 output mapping 仍不够，因为旧 controller 的输入特征本身也读 raw factor norms / gradients / optimizer moments。一个 representation-aware successor 必须同时检查：

```text
representation -> controller features -> effective control
and
effective control -> factor intervention -> effective state change
```

这条完整 causal loop 的科学规则现在由 OpenEvo `EXPERIMENT_STANDARD.md` 与对应 historical case 拥有。
## 3. 预结果网站不是“等结果后再写”

Owner 明确要求：正式 160-round 结果出来以前，网站就应该把**问题、推导、方法身份、matched experiment 设计和结果槽位**写好；真正依赖正式实验的结论先空着。

这不是新规则。BaseModel 当前 `experiment-result-publication-workflow.md` 已经规定：

```text
freeze scientific question
-> freeze metric/comparison slot
-> mark Pending
-> wait for sealed upstream evidence
-> fill only fields that evidence closes
```

本次把这个规则落实成更严格的 task-local data contract：Pending formal result 必须使用空值/显式 Pending，而不是 `0`、partial W&B、ETA 或预期 winner。正式结果回来以后只填预先冻结的槽位，不根据 outcome 重新选择故事。

这次具体施工由 BaseModel PR #729 的长期 checklist authority 管理；它是任务交接文件，不是新的站点级 publication policy。
## 4. 长对话要把 authority 外置，而不是让聊天变成唯一记忆

这次上下文持续增长后，Owner 要求把后续网站工作写成一个代码级 Markdown，并放进一个长期 Draft PR，让新窗口只读 PR + 文件就能继续逐项打勾。

可复用原则是：

- 长期工作必须有一个 durable checklist authority；
- checklist 写清代码 owner、科学 authority、阶段边界、验收命令、DoD 和证据格式；
- 新窗口重新读取 current `main`、PR exact head、overlapping PR 和上游 scientific state，不从旧聊天继承“current”事实；
- 只有真实 file/test/browser/provider evidence 才能把 `[ ]` 改成 `[x]`；
- task-local handoff prompt 可以很短，只指向唯一计划 authority；不要复制一整套会漂移的规则；
- milestone 要区分“预结果页面已经发布”和“正式结果已经发布”，避免 Pending 结果让一个已完成的预结果阶段永远看起来没完成。

PR #729 是这次任务的具体应用；未来类似任务应优先复用仓库现有 plan/checklist 模式，而不是把聊天摘要当施工 authority。
## 5. 重复摩擦：问题不在“没有规则”

### Fish / Bash 又重复了

本次仍出现多次默认 Fish 解析 Bash heredoc / compound syntax 的 `NOT_EXECUTED`。BaseModel 根 `AGENTS.md` 已要求：只要语法依赖 Bash，就在 dispatch 前显式选择 `/bin/bash`；重复失败后应转 standalone script / structured tool，而不是继续堆 quoting。

因此本 closeout**不再新增 shell policy**。重复发生说明是 use-site adherence failure。未来 Agent 要在第一条 compound command 前执行已有 guard，而不是等 parser 报错后才想起它。

### Provider / PR 状态在最后一刻发生变化

创建 PR #729 前已经做过 overlapping PR 搜索，但 provider mutation 真正发出时，同一 branch 的 PR 已经存在，GitHub 返回 `422`。正确处理是把这次 create 记为未执行，重新读取 provider state，然后复用现有 PR；不能再造第二个 PR。

这同样不是新规则。现有 shared-state drift / provider-write guard 已要求：**紧贴 consequential write 再读一次目标对象**。早几分钟的搜索不能替代 dispatch-time readback。

### PR 元数据也必须跟 exact head 一起更新

计划 commit amend 后，PR body 仍引用旧 head/line count。最终做法是读取 live PR 后只刷新 metadata，不制造新 commit。这个案例再次说明：branch content 与 PR coordination metadata 是不同对象，二者都要做 exact-state readback。
## 6. Canonical destinations：不要复制第二份 mutable rule

本次没有新增下列 current rules，因为它们已经存在：

- OpenEvo `AGENTS.md`：ELI5 优先回答 owner 点名的 causal/scientific hinge；
- OpenEvo `docs/operations/governance/EXPERIMENT_STANDARD.md`：treatment onset 与 prior-state materialization 分开；non-unique parameterization 下区分 intrinsic/effective target 与 factor-coordinate displacement；sequential intervention 使用 realized state；
- OpenEvo `docs/troubleshooting/experiment-ops/CASE-EFFECTIVE-STATE-GDR-LORA-REPRESENTATION-CLOSEOUT-20260915.md`：本次科学推导的完整历史案例与 coverage ledger；
- BaseModel `docs/agents/current/experiment-result-publication-workflow.md`：pre-built Pending scaffold 与 sealed-result fill-in；
- BaseModel 根 `AGENTS.md` / project operating principles：explicit shell、shared-state drift、provider write exact-state readback；
- BaseModel PR #729 的计划文件：本次网站施工的 task-local checklist authority。

本历史文件只把这些 owner 串起来，帮助 BaseModel Agent 找到正确入口。
## 7. Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| 把“第一次非空 recurrence”误当成“第一次 treatment update” | 新的具体科学误判 | treatment onset 与 prior-state existence 分开冻结 | OpenEvo `EXPERIMENT_STANDARD.md` | 会改变 estimand |
| 把 LoRA factor displacement 讲成原始 GDR gate | 同类 representation 问题 | intrinsic/effective quantity 与 coordinate displacement 分层 | OpenEvo standard + historical case | 非唯一参数化下坐标不是科学本体 |
| teacher 的 `C_post` 被直接带进 intervention runtime | 新的具体形式 | sequential runtime 用实际 realized prior step state，除非提前证明等价 | OpenEvo standard | controller/teacher 通用规则 |
| 只修 mapping 后 controller 仍 OOD | 新的具体形式 | controller features 与 output mapping 都要满足同一 representation contract | OpenEvo standard + case | whole causal loop 才是 qualification |
| ELI5 花在旁支而不是 owner 点名疑问 | 是，沟通层 | owner 明确疑问决定 ELI5 的第一解释对象 | OpenEvo root Agent rule | 跨任务沟通行为 |
| 正式结果未出，网站是否应该等 | 否 | 先冻结问题/指标/结果槽，Pending 不是 0 | BaseModel result-publication workflow | 已有 current publication owner |
| 长对话快爆上下文 | 多次出现的工作模式 | 用唯一长期 checklist PR 外置 authority，新窗口 live-refresh 后继续 | PR #729 task-local plan | 项目施工交接，不应成为第二份全局 policy |
| Fish 解析 Bash syntax 失败 | **是** | 第一条 compound command 前执行现有 explicit-shell guard | BaseModel/OpenEvo root Agent rules | adherence failure，不是知识缺口 |
| PR create 时同 branch PR 已被并发创建 | 是，共享状态类 | provider write 前紧贴 dispatch 刷新 exact target | project operating principles | 防止重复 PR / 错对象 mutation |
| amend 后 PR body 仍引用旧 exact head | 是，metadata stale 类 | content SHA 与 PR narrative metadata 都要 readback | existing exact-state/release rules | coordination metadata 也会过时 |

## 8. 临时状态没有被永久化

本 closeout 故意不把以下内容提升成 standing guidance：

- 当前 GPU occupancy / UUID / utilization；
- 当前实验 round、partial reward、loss、W&B 实时曲线；
- 临时 worktree / server 路径、PID、port、container name；
- 当前 PR head、Preview URL、provider queue state；
- 一次性的 READY / launch 状态或某个当下授权窗口。

这些事实如果具有历史意义，保留在 Git/PR/experiment evidence 中；未来需要“当前”状态时必须重新 live-read authority。

## 9. Future-Agent test

一个完全不知道这段对话的新 Agent 应该能做到：

1. 从 BaseModel `docs/agents/README.md` 找到本案例，再跳到 current publication rules；
2. 知道正式结果没出来时应该发布 question/method/design scaffold，而不是猜 result；
3. 从 OpenEvo current authority 知道 Round0 empty history 不等于 treatment 延迟；
4. 分清 original/effective beta 与 LoRA coordinate displacement；
5. 在 non-unique parameterization 下先问“科学对象是什么”，再检查 controller feature/mapping 的 symmetry contract；
6. 新窗口接管 PR #729 时只认其计划文件的 checkbox + live repo/upstream state，不认旧聊天中的“current”；
7. 在第一条 Bash-dependent compound command 和每个 provider mutation 前执行已有 use-site guard。

如果未来 Agent 仍然从“Round1 才是真 recurrence，所以 Round0 不该 treatment”出发，或者把 Pending 正式结果填成 0，本次 closeout 就没有真正生效。
