# CI performance experiment runbook / CI 性能实验操作规范

Status: **current operational procedure**. This document owns experiment measurement and decision procedure, not CI provider selection, release permission, or scientific execution authority.

现有上位规范：[deployment-policy.md](deployment-policy.md)、[website-engineering-standard.md](website-engineering-standard.md)、[project-agent-operating-principles.md](project-agent-operating-principles.md)。历史 #433 baseline/checklist 是已完成实施的证据；新的实验使用本规范，避免把新的准入标准写进旧 COMPLETE 记录。事故与数字见 [2026-09-06 evidence audit](../history/2026-09-06-browser-ci-evidence-audit-retrospective.md)。

## 1. 触发与四个独立结论

遇到 CI 提速、缓存、预构建镜像、worker/shard 调整、readiness 等待替换、历史耗时调度、benchmark 续做，或“要不要撤回这次优化”，在**启动、恢复、判定、合并/撤回**四个节点重新读取本规范。

分别回答：

| 结论 | 所需证据 |
|---|---|
| 正确性通过 | 当前实际测试树、有效断言、完整适用测试集合、所有必需检查与失败记录 |
| 观测耗时变化 | 指定时钟、完整样本、准确 workflow/job/attempt 身份 |
| 可归因性能收益 | 预先定义的比较、相同工作负载、足够控制运行顺序/环境/历史数据的证据和不确定性 |
| 采用或撤回 | 上述证据、收益门槛、维护成本、风险及当前 release authority |

绿灯不直接给出后三个结论。因预算/复杂度选择保留简单实现是工程决策；它不等于证明复杂实现没有性能效果。记录正面结果和负面结果，分别写观测、解释、决策。

## 2. 首先重建完整相关证据，而不是再开一个实验

操作前读取当前 main、目标 PR metadata、完整 diff、评论/评审、相关**已关闭与已合并**的 benchmark/control/revert PR。按源分支、commit、候选 PR 引用和创建窗口交叉核对；搜索标题只是入口。

建立一个运行台账，每行至少包含：

```text
experiment role: qualification / seed / shadow / steady-state / diagnostic
PR number and lifecycle; head SHA; frozen base SHA
actual prepared merge parents and tested tree SHA
CI config revision; runtime image digest/architecture; lockfile/browser identity
workflow ID; job ID/context; attempt; source URL
planner mode; additional gate scope; reserve; workers; retries
canonical test-identity fingerprint; selected/executed identities per shard
actual scheduler mode; assignment/history fingerprint; actual cache hit/miss
clock type; start/end; outcome; measured duration or explicit unknown
included/excluded; exclusion reason; evidence available at decision time
```

所有字段以实际读取为准，未取得的字段填 unknown。不能把自己上一轮的总结当作已经核验的台账。准备新 control 前，先证明没有可复用的已完成 control。准备指责“未验收就合并”前，必须比较评论发布时间、运行终止时间与 merge 时间；账号相同也不能识别具体 Agent。

发现遗漏或错误时，保留原始记录并追加带来源的更正。区分“已证明不存在”与“这次没有找到”。局部恢复的对话、旧 PR body 或 combined status 都可能漏掉之后发生的工作。

## 3. 冻结比较对象，包括实际合成的 merge tree

BaseModel 的 PR CI 通过 `scripts/ci-circleci-prepare.sh` 准备 base + head 的合成合并。因此以下对象分别记录：分支头、PR 当时 base、实际合并父节点、测试树、CI 配置来源。一个只加注释的旧 head，在新的 base 上可能执行完全不同的 CI。

在第一个计费/执行触发前，定义候选与对照的唯一差异，并冻结：测试语义、原生测试身份、路由/语言/主题/视口、阈值、assertions、超时语义、失败证据、runtime、资源、worker、retry、build、preflight、附加门禁和计时范围。需要改变其中任一项时，建立明确的新实验，不借用旧同口径结论。

测试数量以当前 canonical discovery 为准。本规范不把某一天的 163、156、175 或某个耗时写成永久配额。旧运行的精确数字只属于其历史合同。

使用冻结 base ref 隔离对照，创建后读取返回的真实 base/head。续做或写入前再次检查 sibling PR 和 main drift。独立工作保持独立；对重叠文档先协调当前 owner，避免两个规范并存。

## 4. 明确时钟：状态耗时、执行耗时和费用不是同一个量

GitHub commit status 是按 commit/context 展示的状态；combined endpoint 采用各 context 的最新状态，而不是一个 workflow 的完整原子结果。见 [GitHub commit statuses](https://docs.github.com/en/rest/commits/statuses)。

允许的证据层次：

1. 只有绿灯/combined status：只能报告其状态，不能计算耗时。
2. 有完整 pending 与终止事件且能绑定同一 workflow/job/attempt：可报告 **status-clock latency proxy**，即终止事件 `created_at` 减对应 pending 事件 `created_at`。它可能含排队、启动、安装、构建和上报延迟，不能命名为纯浏览器执行时间或计费时间。
3. 有 provider queued/start/stop、步骤日志及 JUnit：分别报告排队、执行、安装/build/test/reporting，并分析差异来自哪一段。

状态历史按 `(SHA, context, workflow/job target, attempt)` 分组。多次 pending 或无法区分 attempt 时暂停该条耗时解释，读取 provider 证据；不取一个旧 workflow 的 pending 和另一个 workflow 的 success。新 benchmark 可用新 head 避免状态碰撞，但保留 tree identity；同 SHA 后来有失败不会抹掉旧 workflow 的有效成功记录。

同一工作流内：

```text
per-job status duration = matched terminal - matched pending
workflow status critical path = latest required terminal - earliest required pending
browser critical path = corresponding span over browser jobs only
```

只有各 job 起点相同，critical path 才能简化为 `max(job durations)`。deterministic 若更晚结束，应计入完整 CI 等待时间。并行执行器的 active-time 总和用于资源分析，不替代用户等待的 critical path。没有计费证据就把 credits/minutes 标为未知。

缺少 provider 日志会限制阶段归因，但不会让已正确配对的 status-clock 观测自动失效。禁止把“没有细粒度日志”写成“一切计时都不可能”。

## 5. 分离资格验证与普通稳态形态

CI 源码、runner、planner、Playwright 配置的变化可能正确地触发更强的 full/Lab 验收。先让该资格验证通过，再测普通 PR 采用候选后会走的路径。不能删掉资格验证中的 Lab 来制造提速。

需要时采用 benchmark-only stacked PR：父分支固定为候选；子分支只在普通 E2E 文件末尾追加无语义注释。确认 discovery 的原生测试身份逐字相同、实际 planner 是 ordinary full、额外 gate scope 与对照一致。EOF 标记避免移动旧测试的行号，但不能凭“只是注释”省略身份验证。标记和 benchmark PR 永远不进入产品主线。

同样分离：

- cold/seed 与 warm：上传缓存的成功并不证明下次 restore 命中；读取实际 key/hit 和恢复成本。
- shadow compatibility 与 active scheduling：影子计算不代表运行时真的使用了它。
- candidate implementation 与实际 `native`/`static-fallback` 模式：记录真实模式；回退可以保护正确性，但该次不能伪装成 native 性能样本。
- qualification 的额外 gate 与稳态：读取实际代码/planner 输出；历史的 reserve 值不是未来的通用常量。

CircleCI 的 timing split 依赖已上传测试耗时，分割与执行是不同步骤；输出名称必须和报告字段一致。参考 [CircleCI splitting guide](https://circleci.com/docs/guides/optimize/use-the-circleci-cli-to-split-tests/)，同时验证项目固定版本和真实运行输出。

## 6. 先定采用规则、样本预算与停止规则

在查看候选结果前写下：主要指标、绝对/相对最小有用收益、正确性条件、两臂运行次数/顺序、冷热状态、允许的失效条件、总运行预算、何时停止以及谁拥有最后决策。历史台账中的“有意义”不能事后被改成刚好通过的门槛；找不到预先记录就写“未核验预声明”。

候选与对照顺序执行；记录其它可见 workload/排队干扰，而不是擅自取消其它人的验收。复测两臂，按预先安排交错或反转次序，以降低时间趋势影响。候选先跑、对照全部后跑，不能自动排除宿主机、网络或缓存变化。

报告所有有效样本、样本量、每次差值及描述性分布；预先指定汇总方法。异常运行保留身份和独立的失效理由，不能因为慢就丢掉。统计不确定性需要与设计/样本量相称的方法；两个样本的极差不是总体噪声阈值。

同 tree 只控制代码，不能固定宿主机、共享网络、缓存热度或可变历史 timing 数据。局部 25-test 加速不直接证明完整 hosted critical path 改善。反过来，少量 hosted 结果不佳也不能证明局部机制无效。

停止决策使用明确标签：`adopt / reject-this-implementation / inconclusive / measurement-invalid`。低成本探索筛选允许放弃当前实现，但结论限定于该筛选证据；下一轮必须有新的可测瓶颈与预算，不用重复运行寻找最漂亮的一次。

## 7. 调度完整性与优化依赖的边界

canonical discovery 是测试集合权威，历史耗时只是调度输入。保留当前 Playwright 原生执行 locator；历史 lookup 可用经过碰撞检查的 project + spec path + full title，行号变化不应冒充新测试。需要映射到仅 testname 的 provider 时，先证明名称全局唯一。

未知或改名测试必须仍然执行并取得新 timing。缺少优化历史/CLI 服务可按既有完整 static 路径回退；重复身份、未知返回项、漏项、空 bucket 等完整性错误保持 fail-closed。不能为等待历史数据而让新测试无法首次执行。

**验证真正执行的两个 shard，而不只验证每个 job 自己预测的两桶。** 两个独立 job 可能读取不同版本历史或选择不同 fallback 模式；每个局部预测覆盖完整，不足以证明实际跨 job 的 union/disjointness。采用共享/不可变 assignment，或在接受运行前核对实际执行列表与 assignment fingerprint。相同数量也不能排除“一条重复、一条遗漏”。这是防御性要求，不是对历史运行发生漏测的断言。

list-only discovery 应隔离 JUnit/HTML 输出与正式结果目录，避免覆盖历史 timing 或污染 JSON。保留原有 reporter/诊断合同，分别验证解析、分配、实际执行和报告四个边界。

## 8. 等待、缓存与失败诊断的语义

readiness 替换固定 sleep 时，先找出每个 state 的初始、post-click、下一次循环和最终 audit；让新检查替代旧检查，而不是叠加。证明检查对应预期新 step，评估状态是否稳定/单调，覆盖末状态。相同的 `40ms` 字面量不自动证明同样的时间合同：内部自动重试、一个很慢的 async audit、或过早接受旧 state 都可能改变含义。参考 [Playwright timeouts](https://playwright.dev/docs/test-timeouts)，并检查实际 helper，而不是只比较常数。这类问题未经复现时标为风险，不伪造事故。

先计算可消除工作的量级，再定位其是否落在 critical shard。全套固定 sleep 的总和是总工作池，不是每个 shard 都能节省同样时长，也不代表整个 CI 的理论收益。

缓存/镜像比较计算净效果：下载/恢复/解压/保存/冷拉取以及环境变化都计入适用范围。保持 lockfile 安装权威；预装或 cache hit 本身不等于提速。OS、浏览器、字体或依赖变化属于环境变化，不应靠放宽视觉断言来适配。

诊断 rerun 保留第一次失败的非零验收结果。失败后重录视频不是第一次失败现场的视频；若诊断证据种类改变，需显式审查合同和失败 canary。因性能筛选失败而提前结束时，明确写出尚未验证的 failure path，不能声称所有边界均通过。

## 9. 工具与协作：把已有规则用在执行节点

执行面与 Shell/worktree 原则由 [operating principles](project-agent-operating-principles.md) 和 [branch conventions](branch-and-pr-conventions.md) 统一拥有。CI 场景额外检查：

- GitHub-owned 状态从 connector 读取；真正依赖设备本地状态时才使用 Remote Desktop。普通 CI 不唤醒 Mac fallback，也不借用 GPU/Ray/科研服务器。
- 本地必要执行前验证 repo root、工作树、依赖与 lockfile。未提交 diff 不等于 `base..HEAD`；planner 必须看实际将测的提交区间。Bash 语义显式选 Bash；管道检查生产者退出状态，不能让 `tail` 掩盖 discovery 失败。
- 连接超时、凭证 helper、授权失败分层诊断。网络不通不等于需要新 token/改权限；connector 成功也不证明设备 HTTPS/SSH 可用。切换写入路径后记录真正返回的 SHA，并比较 tree，避免把本地 SHA 当远程验收对象。
- 422/不存在 base 时读取具体分支和 schema，修正原因后再重试；相同输入重复写不会创造缺失分支。工具已加载时复用 schema；不把反复 discovery 当进展。
- 读取最小必要进程/日志字段；通过源端过滤避免把全量命令行、token、私有路径带入工具输出或 PR。已有敏感输出不复制进复盘；恢复边界问题单独处理。
- 续做先读已有 benchmark/control 和评论。共享 ref 的并发变化需要重新判定，不靠记忆补写“别人没做”。更新一组文档时准备完整内容，一次原子提交；全文替换应核验原 blob 和最终 diff，保护其它 Agent 的内容。

## 10. 收口与知识保存

每次 provider 触发后读取一次当前状态和有价值的错误/阶段证据。按现有 [LATEST wait discipline](../LATEST.md#provider-wait-discipline) 做有界复查；没有可行动失败时停止密集轮询。回复先区分已提交、已通过、已合并、post-merge 已验证；任务继续不代表永久后台监控，也不授权无限新优化。

决定采用或撤回前重新读取 exact head、当前 base、实际受测 tree、所有必需结果和评论。对撤回只逆转目标变更，保留后续无关科研/产品提交；以新 PR 验证，expected-head merge 后分别核验主线与应执行的 post-merge 检查。绿灯和可合并性都不替代证据/权限。

临时 benchmark PR 关闭未合并，保留历史来源；分支/工作树删除另外检查依赖、可达性和 ownership。文档沉淀保持 docs-only 路径，不触碰产品/测试/配置来制造 Preview 或完整浏览器绿灯。

知识分类：跨任务规则进入现有入口/当前 owner；项目行为留在 runbook；具体事故/数字留在 dated history；当前 PID、GPU 占用、临时路径/会话、进度和瞬时 quota 不进入长期记忆。只有实际可写记忆能力成功返回才能报告 account memory 已更新；仓库提交不是 ChatGPT 记忆写入。

本规范是可执行的人工操作程序，**没有新增自动化 merge 阻断器**。现有 required checks 保持原样；任何新增机器化 gate 应另立经过验收的工程变更，而不是在复盘中声称已经部署。
