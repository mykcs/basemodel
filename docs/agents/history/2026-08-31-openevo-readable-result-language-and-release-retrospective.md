# OpenEvo Results「说人话」与发布收尾复盘 — 2026-08-31

Status: **historical case / reusable Agent friction record, not current authority**

Conversation scope: 2026-08-30/31 这一轮围绕 BaseModel 的 OpenEvo × WebShop Results 页面，重点是把作者内部速记改成第一次接触实验的人也能看懂的说明，并在主分支持续移动、多个 PR 并行、Vercel Preview/Production 和自托管 CI 同时存在的情况下，把 PR #341 安全收尾。

Primary current owners:

- `../current/website-design-spec.md`
- `../current/website-copy-cases.md`
- `../current/audience-centered-technical-copy.md`
- `../current/layered-technical-explainer-copy.md`
- `../current/research-editorial-style.md`
- `../current/research-site-presentation-contract.md`
- `../current/scientific-state-provenance.md`
- `../current/experiment-result-publication-workflow.md`
- `../current/deployment-policy.md`
- `../current/multi-pr-semantic-integration-playbook.md`

If this file disagrees with current user instruction, live experiment evidence, executable repository truth, current policy, or current Vercel/GitHub state, **this file loses**. The numbers and commit/PR states below are historical provenance, not a promise that the same experiment or branch is still current.

## Why this conversation mattered

The visible problem looked like copy editing:

> “Stage 2 写出了 20,480 条 rollout 和 797 条 qualified-positive trajectory，但 80/80 个 block 都没有参数更新；单个 block 的 qualifying identity 最大只有 7，而 gate 需要 8。”

But the actual failure was deeper. The page assumed the reader already knew:

- `20,480` 是什么单位；
- `797` 是从什么集合里筛出来的；
- `block` 为什么存在；
- `7` 数的是什么；
- `8` 是分数、轨迹数、任务数，还是别的门槛；
- `0 次更新` 是实验没跑、训练挂了，还是实验跑完但参数没变；
- `16 / 1,440` 是模型得分、老师分析数量，还是实际进入训练的数据数量；
- `0 / 128` 是真实测得的零，还是结果缺失。

用户指出的核心不是“这句话难”，而是：**作者把自己脑子里的隐含上下文直接写到了网站上。**

这次修复因此不是简单把英文术语翻译成中文，而是把“读者需要自己补全的推理”显式写出来，并把这种要求变成可回归测试的产品合同。

## 最终完成状态

本轮主实现通过 PR **#341** 合入 `main`。

Historical merge provenance:

- PR: `#341`
- final merge commit: `c4d15e88b8f79e67ab0557bf7a62266a17d79136`
- Vercel Production deployment for that merge: `READY`
- production alias included `https://basemodel-preview.vercel.app`

在最终收尾前，PR #341 还吸收了两个并行结果分支的内容：

- **#353**：7B WebShop HTML score table；
- **#354**：历史 7B + MiniMax final 与 `16 / 1,440` Stage-1 写回路径。

之后 `main` 又通过 **#345** 增加了网站设计/文案规范。#341 再同步 #345 后，三点 diff 仍只包含本轮应有的 `src/` 与测试变更，没有把 #345 的文档治理倒回去。

最终页面不再只显示原始速记，而是让读者顺着这一条链就能理解旧 Stage 2：

```text
20,480 次 Stage-2 任务尝试
-> 其中 797 条轨迹满足当时的 exact-success 筛选规则
-> 当时每个 256-attempt block 要有至少 8 个不同的 qualifying task identity 才允许参数训练
-> 实际单个 block 最多只有 7 个
-> 所以 80/80 个 block 都没有触发 Stage-2 参数更新
-> Stage 2 确实跑完并产生了数据，只是参数没有因此改变
```

页面还明确解释：

> `8` 是“不同任务身份数量”的门槛，不是 8 分，也不是 8 条轨迹。

以及：

> `7` 表示最好的一块仍差 1 个任务身份才允许训练；`0 次更新` 表示 Stage 2 没有改变模型参数，而不是 Stage 2 没有运行。

这两个解释看起来很基础，但正是原页面最缺的上下文。

## 对话里最重要的科研语义澄清

### 1. `20,480`、`797`、`7`、`8`、`0` 必须分别回答“数的是什么”

以后看到连续数字时，不要只做排版。每个数字至少要附三件事：

```text
对象：数的是任务、轨迹、任务身份、参数更新，还是评估样本？
范围：Stage 1、Stage 2、单个 block、全程，还是 final panel？
作用：这是结果、筛选后数量、门槛，还是控制变量？
```

本轮对应关系是：

| 数字 | 历史含义 | 读者最容易误解成 |
|---|---|---|
| `20,480` | Stage 2 的任务尝试总数 | 参数更新步数 / 训练样本数 |
| `797` | 满足当时 qualified-positive 规则的 exact-success trajectories | 797 个不同任务 / 797 次更新 |
| `8` | 单个 256-attempt block 所需的不同 qualifying task identity 门槛 | 8 分 / 8 条轨迹 |
| `7` | 任意一个 block 实际达到的最大不同 qualifying identity 数 | 得分 7 / 只成功 7 次 |
| `0` | Stage-2 optimizer/parameter update 次数 | Stage 2 没跑 / 结果不存在 |

**Reusable rule:** 只要一个数字离开作者上下文后可能有两种合理解释，就必须在第一阅读层说明单位和因果角色。

### 2. `0 次参数更新` 不等于 `Stage 2 没运行`

这是整轮最重要的负状态语义。

历史 Stage 2：

- 任务调度执行了；
- rollout 产生了；
- qualified-positive trajectories 也产生了；
- 但 admission/update rule 没有被满足；
- 因而参数写回次数为 `0`。

所以状态应该写成：

```text
Stage 2 已执行
+ 有经验数据
+ 参数更新 = 0
```

而不是模糊写成：

```text
Stage 2 failed
```

更不能让一个灰色 `0` 或 `—` 同时代表“没跑”“没测到”“真实为零”“分母为零”。

### 3. `0 / 128` 可以是完整、真实、有效的最终结果

历史 7B + MiniMax local final 是：

- WebShop Task Score ×100: **16.94**
- Exact Success: **0 / 128 = 0.0%**

这里的 `0.0%` 不是 Pending，不是空值，也不是 evaluation pipeline 失败。128 个 final tasks 的分母存在，因此这是一个真实测得的零成功率。

未来页面必须区分：

```text
0 / 128      = 测了 128 个，确实 0 个完整成功
Pending      = 还没有 final
measurement invalid = 有运行但测量不能作为结果
—            = 该指标不适用或没有定义
0 / 0        = 分母本身为空，不能写成普通 0%
```

### 4. `16 / 1,440` 数的是“进入参数训练的老师分析记录”，不是模型分数

历史 7B + MiniMax Stage 1 中：

- MiniMax 分析了 **1,440 / 1,440** 条 Stage-1 trajectories；
- 但旧 bootstrap parameter-write path 只把 **16 / 1,440** 条 teacher-analysis records 实际送入 SD-LoRA 参数训练；
- 同一组 16 条记录被历史配方重复用于 8 次顺序 SD-LoRA 更新。

因此 `16 / 1,440` 绝不能写成：

```text
MiniMax 只分析了 16 条
```

也不能让它在视觉上像一个 score。

更安全的读法是：

> MiniMax 已完成 1,440 / 1,440 条轨迹分析；历史参数训练路径只让其中 16 / 1,440 条分析记录真正进入参数更新。

### 5. 历史 MiniMax 结果不能被宣传成“OpenEVO 已完整学习 1,440 条老师分析”

因为参数写回只用了 16 条，所以历史 `16.94 / 0-of-128` 只能证明那条历史处理路径的最终表现。

它不能支持：

```text
“MiniMax 全量讲评没有用”
“SD-LoRA 方法本身没有用”
“OpenEVO 学完 1,440 条 MiniMax 分析后只有 16.94”
```

后续页面应把这条结果定位成：

> historical incomplete-design path / 历史实验分支；代码按当时冻结方案正确执行，但当时的科学设计并不等同于后来明确的“让 OpenEVO 学习完整 1,440 条老师分析”的目标。

这也是一个重要的科研写作原则：

**工程正确执行 ≠ 科学设计一定回答了后来想问的问题。**

### 6. temperature 与 `16 / 1,440` 是两条不同因果路径

这轮对话中还需要防止把两个容易同时出现的变量混成一个解释：

- rollout temperature 改变的是 actor 在环境里生成动作/轨迹时的随机性；
- `16 / 1,440` 是 MiniMax 分析完成后的下游训练数据 admission / writeback 选择。

因此不能把“temperature 不一样”写成“所以只有 16 条进入训练”的原因，也不能反过来。

**Reusable rule:** 同一页面上出现多个异常数字时，先画出因果位置，再决定是否能放进同一句解释。

### 7. 论文 SEED 数字和本地 OpenEVO final 可以同表展示，但不能直接相减成方法效果

页面最终同时展示了论文上下文和本地 OpenEVO 行，但明确保留 evaluation-boundary：

- 论文 SEED WebShop `89.7 / 78.1%`；
- 本地 OpenEVO 7B/self `25.66 / 4-of-128`；
- 本地历史 OpenEVO 7B+MiniMax `16.94 / 0-of-128`。

这些数字不具有已证明完全相同的 128-task panel、checkpoint lineage 和 evaluation protocol，因此同表是为了读者定位量级，而不是为了把：

```text
89.7 - 25.66
89.7 - 16.94
```

解释成一个严格的 causal method effect。

## “说人话”在这次任务里的真正含义

本轮证明“说人话”不是把术语删掉，也不是把句子缩短。

更准确的规则是：

### 先说发生了什么，再说内部名字

差：

> qualifying identity 最大 7，gate 需要 8。

好：

> 当时规则要求：同一个 256 次尝试的小块里，至少要有 8 个不同任务各自达到合格成功条件，才允许开始一次参数训练。实际最好的一块只有 7 个，所以没有任何一块触发参数更新。

读者已经理解后，才在括号或二级说明中保留 `qualifying identity`、`gate` 这些审计词。

### 一个负状态必须写清“哪一层没发生”

差：

> Stage 2: 0 updates.

好：

> Stage 2 已完成 20,480 次任务尝试，但当时的训练门槛始终没有满足，因此 Stage 2 没有改变模型参数。

### 术语不能承担作者没有写出的推理

`block`、`gate`、`qualified-positive`、`checkpoint`、`primary final` 都可以保留，但第一次出现时必须回答：

> 它是什么？为什么读者现在需要知道它？

### 标题也要对读者说事，不要对作者说文件结构

类似：

```text
Stage 2 · Update Gate
Protocol State
Historical Control
```

如果它只告诉作者“这是哪一类组件”，却不告诉读者“这里要讲什么”，就是弱标题。

优先写成：

```text
为什么跑了 20,480 次，参数却一次都没更新？
这 16 条到底代表什么？
0 / 128 是真实结果，不是缺失数据
```

## 工程摩擦与恢复方式

### Friction 1 — 多 PR 同时修改同一 Results 语义，不能按文件级 winner-takes-all 合并

#341 正在改“读者如何理解数字”时，#353 又加入 7B 分数表，#354 又补齐 MiniMax final 和 `16 / 1,440` 路径。

这三个 PR 都有正确的新信息，但职责不同：

```text
#341 -> 表达语义 / reader contract
#353 -> score-table presentation
#354 -> newer experiment facts and historical-branch boundary
```

合并 #354 时出现两个真实冲突，位于分析计划组件和 score comparison test。

正确处理不是“选 #341”或“选 #354”，而是：

> 保留 #354 新增的科学事实，同时把 #341 的 reader-facing explanation 套到这些新事实上。

**Reusable rule:** 冲突解析按“语义 ownership”做，不按“哪个 PR 更新”做。

### Friction 2 — 批量替换很快，但会污染不该改的英文/审计字符串

本轮为消除大量 AI 味和内部术语做过批量替换。它提高速度，但一度把不应改动的英文字符串也污染了。

好在这件事在提交前被 targeted diff/test 发现并修复。

以后做类似文案批改：

```text
bulk transform
-> inspect diff around every transformed token class
-> run semantic/string regression tests
-> only then commit
```

不要因为“只是文案”就跳过代码级审查。

### Friction 3 — main 在验证过程中继续前进，不能把一次绿色验证永久绑定到旧 base

#341 在验证时 `main` 先后吸收 #354、#345。

处理方式：

1. 每次真正改变产品树的 main 变化都重新判断是否需要同步；
2. #354 改了 Results 产品树，因此合并、解决冲突、重新跑相关验证；
3. #345 是 docs/governance-only，但仍同步到 branch 以避免合并时倒退文档；
4. 同步后用 three-dot diff 检查 branch 相对新 main 仍只包含预期 21 个 `src` / test 文件。

**Reusable rule:** “main moved” 不是机械地“所有东西全重跑”，而是先判断它有没有改变待发布产品树或其 acceptance assumptions。

### Friction 4 — PR 被并行 Agent 关闭，不代表工作已经被 supersede

#341 在验证期间被一个并行治理任务关闭，但没有 merge。

事件调查表明：#345 把旧 #341 当作已经吸收的“文案偏好历史证据”，而实际上 #341 的 head 后来又积累了更多尚未进入 main 的 Results 修复。

正确恢复：

```text
PR unexpectedly closed
-> inspect event / merged state / head ancestry / current main
-> confirm unique diff still exists
-> reopen same PR
```

而不是立即开一个重复 PR。

**Reusable rule:** `closed` 是协作状态，不是“工作内容已在 main”的证明。

### Friction 5 — Vercel `CANCELED` / skipped 不等于代码失败

BaseModel Preview 是 exact-head opt-in：只有 commit message 带 `[vercel-preview]` 才应该花 Preview build compute。

第一次 branch push 没带 token，因此 Vercel log 明确说明 Preview 被默认跳过。这是设计行为，不是失败。

为了做最终 exact-head Preview，后来增加了一个空 commit：

`1208e49c31f381d9e45ab962b13974533128843e`

message 包含 `[vercel-preview]`，随后 exact-head Preview `READY`，并通过 24/24 的关键路由 × viewport/browser matrix。

当 branch 再同步 docs-only #345 后，新 head 的 Vercel deployment 又被取消，因为 proven Git range 没有新的 deploy-relevant 产品变化。这个取消同样是节省重复 build 的正确行为。

**Reusable rule:** provider 状态必须结合 build log 和 repo deployment policy 解释；不能把每一个 `CANCELED` 都汇报成红灯。

### Friction 6 — “Merge already in progress” 不是新的 blocker

最终发出 merge 请求时 GitHub 返回 `405 Merge already in progress`。

正确反应不是重新 patch 或重新开 PR，而是重新读取 PR 状态。复查后发现并行请求已经完成 merge，#341 已进入 `main`。

**Reusable rule:** 协作仓库里写操作失败后先读取 live state；错误可能说明别的 Agent 已完成同一目标。

### Friction 7 — 本地生产 Playwright 网络等待不能凌驾于 provider-side production evidence

Production 已经是 exact merge SHA 的 Vercel `READY`，并且 Vercel authenticated/server-side fetch 能直接取到生产 HTML，确认关键文案都在。

Mac 本地对公开 Production 做的额外 browser smoke 在少数 route 上出现长时间 public-network wait。这不是 source、build、deployment 或页面内容的失败。

由于同一产品树已经有：

- related tests 全绿；
- Astro check 0 error / warning / hint；
- `verify:deploy` PASS；
- full UI suite 204/204；
- exact-head Preview matrix 24/24；
- required self-hosted CI SUCCESS；
- Vercel Production READY；
- Production HTML server-side fetch 200 + required copy present；

因此这个额外的本地公网等待被正确分类为非阻塞的 smoke-path 问题。

**Reusable rule:** 多层证据冲突时，先问失败发生在哪一层，不要让一个可选网络探针否定已经建立的 exact-tree release evidence。

### Friction 8 — “测试全绿”需要说清是哪一棵树、哪一层测试

本轮验证不是一句“CI passed”，而是逐层建立：

```text
focused semantic tests
-> Astro diagnostics
-> repository deterministic gate / build
-> full browser suite
-> exact-head Vercel Preview
-> exact-head self-hosted required CI
-> merge lineage
-> Vercel Production
-> production content verification
```

Historical notable checkpoints included：

- focused related tests: 40/40 after #354 integration；
- Astro check: 409 files, 0 errors / 0 warnings / 0 hints；
- full CI-like browser matrix: 204/204；
- exact-head Preview matrix: 24/24；
- self-hosted required CI on final synchronized head: success。

这些数字是历史证据，未来不能照抄成新的 acceptance。

## 思维上的摩擦与经验

### 1. 不要把“实验设计有问题”写成“工程失败”

历史 Stage 2 和 16-of-1,440 路径的程序可以完全按照冻结配置正确运行，同时那个冻结配置后来被认为不再代表当前科学目标。

所以必须拆开：

```text
implementation fidelity
vs
scientific adequacy
```

这能防止两个相反误判：

- 把科学设计问题甩锅成代码 bug；
- 因为代码完全按 preregistration 跑了，就拒绝承认设计没有回答真正问题。

### 2. 不要把 method-control 的门槛偷偷升级成“OpenEVO 的算法定义”

历史 `8 distinct identities per 256 block` 是特定实验/控制设定。页面现在可以解释它为什么导致 0 update，但不能暗示：

> “OpenEVO 本身就规定必须 8。”

这对后续 Stage 2 设计尤其重要。未来 Agent 必须把：

```text
公平预算：20,480 rollouts
```

和：

```text
经验如何组成 current_dataset / 什么时候生成新的 SD-LoRA component
```

分开讨论。

预算是比较约束；admission/update algorithm 是学习策略。前者不应该偷偷决定后者。

### 3. 后验看到 512/1024/2048 pooling 能过门槛，不等于它们就是正确新算法

历史离线诊断显示，如果事后把成功轨迹按更大的窗口 pooling：

- 256: 0/80 qualify
- 512: 4/40
- 1024: 12/20
- 2048: 10/10

这说明“没有成功经验”不是唯一解释，旧 admission gate 的确在阻止可用经验进入参数更新。

但它**不能**证明把窗口直接改成 1024 或 2048 就会提高最终分数，因为一旦早期参数更新发生，后续轨迹分布会改变。

真正的因果比较必须从同一个 Stage-1 checkpoint 重启，只改 accumulation/admission/update rule，保持任务预算、采样和评估尽量一致。

### 4. “最优陷阱”会把研究问题从机制验证变成参数调参

用户反复强调不要直接寻找一个事后最好看的门槛。

更可靠的研究顺序是：

```text
先明确 OpenEVO 的 generation / component 设计哲学
-> 再提出少量有机制依据的 Stage-2 方案
-> 预先固定比较规则
-> 做 causal run
```

而不是：

```text
看历史数据
-> 试很多窗口 / 阈值
-> 选最能触发更新的那个
-> 宣布它是新 Stage 2
```

### 5. 页面解释应该帮助未来科研判断，而不只是解释过去

这次把 `20,480 -> 797 -> 8 -> 7 -> 0` 写清楚后，读者能自然看到真正的问题：

> 不是 Stage 2 没收集到经验，而是“什么经验允许变成参数更新”这条规则需要重新审视。

一个好的 Results 页面应让读者知道下一步该问什么，而不是只把历史数字翻译得更漂亮。

## 可直接复用的 Results 文案检查表

未来 Agent 修改结果页时，至少逐项检查：

1. 每个 headline number 是否有单位和范围？
2. 每个缩写/内部名词第一次出现时是否解释了“它是什么”？
3. `0` 是否明确是真零、未运行、Pending、invalid 还是 N/A？
4. `done` 是否拆成 execution / optimizer update / final eval / diagnostic 等层？
5. 选择数量（如 `16 / 1,440`）是否可能被误读为 score？
6. 历史设计问题是否被错误归因成 implementation bug？
7. 历史分支结果是否被错误宣传成当前算法结果？
8. paper number 与 local number 是否真的同协议？如果不是，边界是否可见？
9. 一个 negative phrase（failed / zero / blocked / no update）是否写清到底哪一层没有发生？
10. 页面是否在读者第一屏就给“发生了什么”，而不是先堆 run ID、block、gate、checkpoint？
11. regression test 是否保护语义，而不是把某个会变化的 `Pending` 永久冻住？
12. 合并前是否重新确认 experiment-side authority，而不是把网站旧文案当事实源？

## 可直接复用的多 PR / 发布收尾流程

对于类似的高冲突 Results 修改，推荐：

```text
1. refresh experiment-side scientific authority
2. read current website copy + current policy
3. inspect overlapping PRs by semantic ownership
4. integrate facts first, then reader-facing explanation
5. run focused semantic tests
6. inspect diff for accidental bulk-copy mutations
7. run deterministic repository gate + build
8. run browser acceptance appropriate to changed surface
9. synchronize moving main only when materially required
10. verify three-dot diff still contains only intended product changes
11. request exact-head Preview only when head is actually ready
12. distinguish skipped/canceled provider builds from failures
13. wait for required CI on the exact candidate tree
14. if PR state changes unexpectedly, re-read live state before creating duplicate work
15. merge once
16. verify Production as a separate stage from Preview
17. classify optional local-network smoke failures against the stronger exact-tree evidence rather than reflexively reopening the release
```

## What future Agents should not copy from this historical case

Do **not** copy these as timeless rules:

- `gate = 8`；
- `256` 必须是 Stage-2 generation window；
- `20,480` 必须属于所有未来 OpenEVO runs；
- `16 / 1,440` 是当前 MiniMax 训练方案；
- `16.94` 或 `25.66` 是当前最新分数；
- 某个 PR、branch、commit 仍然存在或可合并；
- 某个 Vercel build token / CI topology 永远不变。

这些都属于这次历史实验和发布链路的 provenance。

应该复制的是**判断方法**：

```text
数字先解释对象和范围
负状态先解释发生在哪一层
网站不是实验真相源
工程正确 != 科学设计正确
历史控制规则 != upstream 算法定义
同表 != 同协议
post-hoc 可行 != causal improvement
moving main 要按语义影响判断是否重验
closed/canceled/405 要先读 live state 再下结论
Preview READY != Production accepted
Production READY != 不需要检查真实页面内容
```

## 最小接手提示

如果下一位 Agent 是因为“OpenEvo Results 页面有一串看不懂的数字 / 负状态 / gate / 0 update / 16-of-1440”来到这里：

1. 先读 current Results/copy/provenance owners；
2. 再重新读取 `mykcs/openevo-experiment` 当前实验事实；
3. 把每个数字翻译成“什么对象 + 什么范围 + 为什么重要”；
4. 保留专业术语用于审计，但不要让它承担第一层解释；
5. 对历史结果保留明确的 scientific boundary；
6. 修改测试，使它保护“读者不能误解”的合同；
7. 最后按当前 deployment policy 完成 exact-tree release acceptance。

这比记住任何一个历史数值都更重要。
