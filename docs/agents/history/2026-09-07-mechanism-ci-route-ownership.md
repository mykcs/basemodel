# 机制页 CI 路由归属优化（202609070100）

历史说明：下面的候选状态是首次预注册时的原文，不能视为当前状态。#522 后来已合并；完整采用凭据、失败和经验见本文“后续收口与完整经验沉淀”。当前规则以现行工程/部署规范及代码为准。

> 状态：候选，尚未合并；下列标准在本次首次触发 CI 前固定。

## 问题与边界

主线 `5de1aeeb31a9d02e836b7244137ba7f34fbfe805` 已使用两台 medium、每台一个 Playwright worker、重试 0。#517 的先规划后安装和依赖更新串行化已生效，本次沿用。

#521 只修改机制页组件的中英文导语及历史说明，却因组件没有 ROUTE_OWNERS 记录而触发 full。其冻结对照为 `9e5d3f0654876751142161fae42353a34ef2757c`，父节点是上述 main，CircleCI pipeline 154 / workflow `5fb4c6a8-094a-4924-9ff8-8df0f255c062` 已成功：deterministic 124 秒，browser 1 为 356 秒，browser 2 为 343 秒，workflow 359 秒。合计 823 executor-seconds。这是页面实改的历史测量，不是新增空跑，也不能解释为当前额度余额。

## 修改

- 仅把 `OpenEvoMechanismMap.astro` 映射到机制页中英文两条路由。
- 保留完整 `openevo-two-map.spec.ts`，包括它注册的 reader-journey 和 research-deep-dive 检查；加上两路由 × 手机/桌面 × 浅色/深色 smoke，保留 overflow preflight。
- 确定性 Gate、构建、主线复验、双分片 required contexts、执行器、worker、retries、测试断言不变。focused 的第二片在 npm/browser 安装前退出。
- 在普通确定性 Gate 内检查所有 src 文件：该组件只能由两条登记页面导入；禁止组件全局样式、脚本和额外 CSS import。新消费者/全局副作用要求重新评估路由范围。共享 primitive、数据、测试或全局 CSS 混入仍为 full。

## 冻结验收与测量方法

1. 优化 PR 本身修改 planner，必须通过完整 CircleCI qualification（确定性、两个 full browser 分片、overflow、Lab）；qualification 耗时不当作普通机制页修改的收益。
2. qualification 完成后，在候选上开一个 benchmark-only 子 PR，机制页内容与 #521 一致，只在组件末尾追加一个无渲染作用的 Astro 注释作为范围标记。相对候选的 diff 只有这个组件，比较范围必须映射为 focused。它不能合并。
3. 对照已经完成，候选测量随后单独运行。运行前核查其他 BaseModel 工作流；如果有同期负载，记录为受干扰，不声称干净的速度对比。
4. 候选必须保留原始完整 reader spec 的每个测试身份，并跑足 8 个改动路由 smoke；所有实际测试完成且 retries=0，第二片在安装前按策略退出。不得用跳过冒充浏览器 PASS。
5. 采用标准：普通工作流耗时 <=215 秒（相对359秒至少约40%降低），三个任务合计 <=493 executor-seconds（相对823秒至少约40%降低）。用 provider job/workflow 时间，包含 setup；独立列出 queue。当前成本指标为 executor-seconds，不假装是账户账单或余额。
6. 预期上限：移除第二片的 npm/build/browser，以及非相关全站浏览器检查；确定性检查约124秒构成现有实测下界。因此不承诺低于两分钟，也不承诺全量任务获得同样收益。
7. 此次是冻结真实案例的顺序重放，只有一对观测；不声称随机试验或普适速度提升。无收益则保留原调度，关闭候选；收益验收完成才允许合并。

## 写入前见证

REPEAT-CORRECTION：重复 CI 优化/历史成功误当当前权威 → deployment-policy 与 release-closeout → 固定 main、#521 exact head、真实 CircleCI job 时间、当前全部开放 PR → 在独立 ci/ 分支做一次完整 qualification，随后一次 focused replay → main/head/测试身份/执行器或同期负载变化时重新核验。#502 是已被 #500 采用、随后由 #517 改回预算优先配置的历史测量，不是本次待执行方案。

预览判定：没有页面产品改动，使用 `ci/` 分支，不申请 Vercel Preview。源文件为按固定 ref 下载的部分源码导出，不是 Git worktree；本地测试仅证明导出中的规划逻辑与负例，完整 importer inventory 和仓库验收由真实 CircleCI checkout 完成。只原子发布五个明确改动文件，不覆盖其他 Agent 的页面内容。

## 本地检查与后续凭据

- planner Vitest：14/14；部分源码导出环境。
- 人为添加第三个 importer / 全局 CSS 的负例必须失败；恢复后必须通过。
- no-spend / installer-failure 回归在完整确定性 CI 的现有命令中运行。
- exact candidate/tree、qualification、focused replay、最终采用或拒绝决定记录在本次 PR；不把待执行项目改写为已完成。

官方依据：[Playwright CI](https://playwright.dev/docs/ci) 建议受限 CI 默认一个 worker，并通过独立分片扩展；[CircleCI caching](https://circleci.com/docs/guides/optimize/caching/) 说明缓存只是可缺失的优化。本轮依据真实负载先缩小已证明的页面检查范围，没有添加缓存或更换镜像。


首次写入前 main 已合并 #521，前进到 `9bbae312a027d6623de39f61d50ec275d1a9f473`。已读取完整 compare：仅上述机制页导语与历史说明两个文件；CI、测试、依赖、共享 UI 无漂移。候选改基于该 main，保留页面全部新内容。既有 #521 对照的产品代码因此与候选相同；测量标记仅用于触发同一组件的路由规划。


## 后续收口与完整经验沉淀（2026-09-07）

本节是后补的历史事实与规律；上面的首次预注册阈值和失败经历不被倒改。当前执行权威仍是根 AGENTS、现行工程/部署/收口规范、源码和实时 provider 状态。

### 证据范围与实际结果

本案覆盖本对话：用户要求优化网站 CI → 检查已有两片预算方案与真实页面负载 → 补路由归属 → 首轮类型失败及纠正 → 全量正确性资格验证 → 独立普通页面重放 → 关闭测量 PR → 合并及主线/Production 核对 → 本次经验沉淀。可见本对话没有用户连续两次纠正同一技术问题的原话；不能把其他会话的提醒捏造成这里发生过的事故。

可复核凭据：[实现与完整收口 #522](https://github.com/mykcs/basemodel/pull/522)、[仅测量 #523](https://github.com/mykcs/basemodel/pull/523)、[旧测量 #502](https://github.com/mykcs/basemodel/pull/502)。

| 阶段 | 固定历史身份 | 结果及边界 |
| --- | --- | --- |
| 首轮正确性资格验证 | c89ddae6f962bf9c533853c7ab8c2083d70b9905 / pipeline156 | TypeScript 失败；不是成功测量，也没有从历史里删除 |
| 纠正后完整验证 | 8d740a3b8efad3a84b7cada81dd902ab39d9e416 / pipeline157 | deterministic 与两个 full browser required checks 全通过 |
| 普通机制页重放 | 045403028cf272395ff8fac86f5390344d8dc0dc / pipeline158 | 实际日志 86 passed，retries=0；第二片安装前退出；Lab 因无相关变化按策略跳过 |
| 采用与主线复验 | aa765005c9af9351b9e8e94cd71a42c0cca6b112 / pipeline159 | #522 合并；tree 与接受候选同为 34d9b4ad14fc26ed2ddd371d73babaf9baddcd72；三项全量复验通过 |
| Production | dpl_ESjZCe7RcwvteZZd6n94KhRhXSXZ | 精确合并 SHA READY；正式首页、中英文机制页及 canonical 已实际核对；本任务 Preview 0 / Production READY 1 |
| 测量清理 | #523、#502 | 均关闭未合并，保留证据；#502 四片历史不覆盖 #517 后来的两片预算权威 |

| 实际 provider 指标 | 冻结 #521 对照 | #523 重放 |
| --- | ---: | ---: |
| workflow wall-clock | 359s | 141s |
| deterministic | 124s | 137s |
| browser 1 | 356s | 132s |
| browser 2 | 343s | 16s（策略退出，仍有启动成本） |
| 所有 job 合计 | 823 executor-seconds | 285 executor-seconds |
| 各 job queue | 0s | 0s |

该对照观测下降60.7%和65.4%，通过事先固定的两个阈值。普通路径保留78个完整 reader suite 测试及8个精确路由 smoke，测试身份列表 SHA256 为 db17401f628b6c1db8630c98be38508cf4a358ac16e4321712bc491a64037d68。对照与重放是顺序单对观测；不能称为随机实验、已独立证明可重复、所有网页均有该收益，或账户费用下降65%。初次失败、纠正后的全量验证、测量及合并后全量复验都是此次采用成本；本案未形成完整账户账单，不补猜其金额。主线复验5m53s是规则变更全量成本，不改写为2m21s。

### A / B / C 分层

| 分类 | 保留内容 | 落点 |
| --- | --- | --- |
| A 跨任务规则 | 测试运行与类型检查分开；Git 祖先关系与端点内容分开；监控超时与任务失败分开；耗时与总资源分开 | 现行工程规范和部署诊断，根 AGENTS 只加入口 |
| A 已有稳定原则 | 免费预算优先；按明确授权推进；云状态用对应连接器；不为 CI 唤醒 Mac/GPU；不碰他人资产；重复纠正要有操作点证据 | 复用现有 operating principles/deployment，不复制个人设备或服务器资料 |
| B 本项目经验 | 机制页两条路由、完整注册用例、全 src consumer guard、未知/共享改动 full、focused 第二片提前退出 | 已有代码保护和 deployment；工程规范说明选择优化的证据口径 |
| B 事件与因果 | 类型失败、Git compare 误用、日志读取弯路、预注册和采用凭据 | 本文追加，不另造并行 retrospective |
| C 临时快照 | SHA、PR、workflow、时间和当次工具能力 | 仅为本案复核保留；不称未来 current 状态或长期记忆 |

### 重要摩擦：原因、检查、规则与反例

| 发生了什么 | 为什么发生／错误假设 | 下次操作前检查 | 防御性规则 | 看似合理但错误的反例 |
| --- | --- | --- | --- | --- |
| 小组件文案修改触发全站浏览器 | planner 没有明确 owner；目录局部不等于已证明影响局部 | 所有消费者、路由、全局样式/脚本、混合 diff、完整注册测试 | 先证明范围，再缩小；无法证明继续 full | 看到文件在 research 目录就一律 focused |
| 本地14项 Vitest通过， hosted 类型检查失败 | 运行转译不等于 TypeScript 类型检查；readdirSync 重载返回可能包含 Buffer | 仓库 TS/Node types/选项，调用的 encoding 和类型 | 类型检查与运行测试分别留凭据；纠正使用 encoding:utf8 | 用 as string 或关 strict 掩盖错配 |
| 部分源码导出能跑规划测试，却不足以证明整个 src 只有两个 importer | 把样本库存当作全集；它也没有真实 Git worktree 身份 | 导出覆盖范围、ref/blob、完整 importer 扫描的实际执行环境 | 局部通过仅支持局部断言；全仓库存由完整 hosted checkout 验证 | 给导出目录 git init 后声称复现了真实 merge candidate |
| 三点 compare 看起来有产品差异，实际端点产品 blobs 相同 | squash 改变祖先关系；贡献差异不等于端点文件差异 | 比较的到底是 merge-base→head 还是 endpoint→endpoint | 研究内容相同用逐路径 tree/blob 对照；保留 CI/test/doc 差异白名单 | 因 compare 中出现机制页便断言重放产品不相同 |
| #521 在首次写入前进入 main | 并行网页工作使早期 main 快照过期 | 最新 main/head、语义 delta 和受影响文件 | 基于新 main 只保留本任务五文件；历史对照身份不改写 | 为回到旧基线 reset main 或覆盖他人的文案 |
| DOM 日志只见行号/点，点击、滚动、截图连续超时 | Canvas/虚拟终端与浏览器控制链路并非普通文本 DOM；同法重试没有新信息 | provider 精确状态、独立 step 链接、是否已渲染 | 两次同类无信息失败后换证据入口；不重跑成功工作流 | 将 UI 超时当 CI 挂起，扩权限或提取 cookie |
| 最后通过独立 step 页面看到86 passed | 原页面弹窗遮挡汇总，独立页仍需等待渲染；早期空截图不是空日志 | UI 已观察到的 step 链接、终端汇总、退出状态 | structured状态核对身份，终端核对实际执行/skip/retry | --list 列出86项就报告86项实际通过 |
| 批量读长规范/工具数据出现截断，本次沉淀又发生 | 把数据已取得当作模型完整读到；没有输出预算 | 缺失的事实、文档段落、返回长度 | 结果留在调用层，输出相关段落；缺失必读段恢复后再决策 | 重复打印完整 registry/tree/大 PR 正文来“保险” |
| 资格验证、普通路径、主线复验耗时不同 | 规则修改本身触发更强保护；它不是普通页面负载 | 每次 planner、Lab、测试人口、base/head | 五个状态分开报告：分类、正确性、测量、合并、主线复验 | 用资格验证绿灯替代尚未完成的测量，或把主线全量时间当 focused 退化 |
| 总计算量与等待时间可能朝不同方向变化 | 并行越多可能更快但更贵；政策退出也有启动消耗 | workflow、全部job、setup、queue和采用时一次性开销 | 两个指标同时报告；账单未知保持未知 | 只报最快分片，或把823秒说成用户等待了823秒 |
| 既有协议只写 ordinary-full / 同一测试人口 | 旧案例研究调度器；机械套用会把选择优化误当等人口实验 | 实验处理变量是选择还是调度，需保持哪些语义 | 调度必须同人口；选择必须证明影响范围并完整保留相关测试 | 减少测试后声称“每项测试跑快了” |
| 旧 #502 测量仍开放，可能被误当待采用方案 | 历史成功与当前权威分离不充分 | 最新用途、采用/替代链、是否还有依赖 | 关闭明确结束的 benchmark，保留记录，不代其他 PR 做无关清理 | 绿灯就合并测量注释或恢复四片方案 |

浏览器恢复的确定观察是“独立输出页最终显示86 passed”；不能进一步无证据声称关闭旧页本身修好了浏览器性能。首次 Git transport/本地认证路径不足时，已可用的 GitHub 连接器完成同一精确树写入；没有为工具方便转向用户 Mac 或更改账号授权。

### 重复犯错检查与信息层级修补

对照既有 [2026-09-06 benchmark 案例](2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md) 与现行规范：

| 旧规则与本次状态 | 复发原因或防住的原因 | 本次改动 |
| --- | --- | --- |
| 本地环境正确性已有规则；本次仍漏掉类型检查 | “本地测试通过”没有拆成转译执行和编译检查，操作点未落地 | 工程规范 preflight 第一行绑定类型选项与检查凭据 |
| 端点身份已有规则；本次仍误用三点 compare | 高层 exact-tree 原则没有指出 squash 后祖先比较的陷阱 | 增加对比目的、命令语义和 blob 清单要求 |
| 监控失败不等于任务失败已有规则；本次仍连续操作慢日志页 | 规则抽象正确，但缺少停止同法重试和 standalone 日志路径 | 在部署 owner 加证据读取顺序和换路径条件 |
| progressive disclosure 已有；本次批量输出仍被截断 | 执行时未设输出预算，不能归咎于“没有写过” | 本案诚实保留重复；读取规范引用现有 owner，#526 的通用 bounded-read 增量不另复制到 operating principles |
| 资格验证不足以授权合并已有规则；本次正确执行 | 预注册和PR正文明确分离，测量完成后才采用 | 保留规则，补 focused 适用范围；不声称本次又发生了提前合并 |
| 不用 Mac/GPU、不删他人对象已有规则；本次遵守 | 使用 GitHub、云端 CI 与已登录浏览器即可完成 | 复用边界，不把其他对话的 Docker/Fish/科研事故写成本案事故 |

最重要的缺口是**操作时没有检查证据**，不是所有文档都埋得太深。根 AGENTS 已有 REPEAT-CORRECTION，本轮只增加进入工程 preflight 的链接；scenario 只负责触发；具体检查在 owner；历史只保留经过。#522 已有 consumer/全局副作用/安装失败测试属于可执行保护，本次文档提交没有新增自动约束 Agent 的能力，不能保证从此绝不复发。

本次经验写入时，#526 也在做文档沉淀。已读其完整文件补丁：它拥有通用 bounded reads / 方案交接增量；本案保留其独立改动，仅在 scenario 的 CI 段落补具体触发，不整文件覆盖其未来更新。后续 main 或同文件变化仍需重读。

### 长期记忆：候选与真实写入分开

本轮发现的是 personal-context 检索，没有可调用的账户长期记忆写入接口，**实际写入0条**。仓库提交和搜索结果都不是记忆回执；工具能力是当次观察，未来重新发现。

适合未来有写能力时保存的精简候选（不含 PR、路径、数量或当前状态）：

1. 用户优化 CI 时优先免费云端和总资源消耗，同时报告等待时间；不能仅以并行更快推断更省钱。
2. 用户要求重复问题修到可操作的检查或共享根因，按已给授权持续完成，并用简明中文报告实际验收边界。
3. 对长期经验，要分开稳定原则、项目流程和临时状态；仓库写入与账户记忆写入分别核验。

本次个人上下文检索还返回了与真实 #523 状态不符的叙述。已用 GitHub 精确 head、关闭未合并状态及本对话凭据校正，未据此重开测量，也未采用检索中未经核验的技术定义。检索用于定位，不能代替执行记录或擅自补充用户“多次纠正”的原话。

### 刻意不保存与下一位 Agent 的操作入口

没有将 PID、GPU占用、当前轮次/百分比、临时源码导出路径、浏览器 tab ID、登录会话、cookie、账户余额、别人的进程参数写入规则或记忆。SHA和测量数只为可重读历史保留。没有修改科学实验样本、seed、prompt、评分、训练预算、GPU调度或服务器资产；CI证据不能支持任何OpenEVO科研效果结论。

下一位 Agent 先刷新 main/开放PR及 CI owner，再按 [工程 preflight](../current/website-engineering-standard.md#ci-evidence-preflight) 明确处理变量、类型/库存/端点证据；读日志用 deployment owner。验收满足后只做必要收口，不能因工具已可用又创建重复测量。

REPEAT-CORRECTION：旧环境/身份/监控规则本次仍有漏用 → 工程/部署/操作原则 → 已核对 #522/#523/#502 精确状态、原预注册、旧 benchmark 案例和 #526 补丁 → 允许五文档原子提交及 docs-only 验证 → main/目标文件/重叠PR变化则重读。无需再要一次授权。
