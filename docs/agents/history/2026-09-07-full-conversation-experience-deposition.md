# 本次对话经验沉淀：交付与文档清单

记录日期：2026-09-07。本文件是交付索引，不是另一套仓库规范、科学执行授权或实时运行状态。

## 交付身份

| 仓库 | PR | 本次提交 | 初次提交基线 |
|---|---|---|---|
| mykcs/basemodel | [#519](https://github.com/mykcs/basemodel/pull/519) | `f879b9bfcc5bd0400035b9db9a92bb97e2612d9e` | `6307e459af9820fee2e2843cd640ac978c77aea9` |
| mykcs/openevo-experiment | [#370](https://github.com/mykcs/openevo-experiment/pull/370) | `89e147a95f406eaf42a0b616615fe262e3181a80` | `048b2a959885d45efbd883f1ae0cae2ac8a3b9b9` |

两边均通过原子提交写入独立分支，并逐一核对远端 Git blob 与准备内容一致。两个 PR 均已通过适用的合并前检查并合并到 main。

| 仓库 | 合并状态 | 合并提交 |
|---|---|---|
| mykcs/basemodel #519 | 已合并 | `01871f42644a1f5ae2d3d012aa33cf6c81486bfd` |
| mykcs/openevo-experiment #370 | 已合并 | `f11b17e9e281bda12776e1ec285a8673671bf223` |

BaseModel 合并前 deterministic、browser_shard_1、browser_shard_2 均成功；OpenEVO 的 App 绑定必需集成 gate 成功。两边均核对了精确 head/base 与无未解决 review threads；未绕过保护规则。这是本次合并收口记录，不代替后续实时检查，也不宣称另做了网页 Production 验收。

## 本次新增或澄清的长期规律

**规则必须在下一次操作中留下检查证据。** 读过 AGENTS、链接过 retrospective，不等于实际执行了检查。重复纠错后，在既有任务记录中写清：触发条件 → 当前规则所有者 → 实际检查的证据 → 允许的下一步 → 失效/重查条件。这不增加第二套批准流程。

**资格验证必须覆盖真正的使用环境。** 相同入口、UID、解释器、依赖、挂载与网络关系、完整转发参数、输出持久化路径，才支撑对应的资格结论。复用指纹匹配的稳定 PASS；正式实验中不临时安装环境或修改科学语义。

**测试应随语义内容一起迁移。** 新组件改变 DOM 标记后，旧选择器可能不再覆盖关键正文；全绿不证明没有漏检。五个答案字段存在、页面不溢出、真实读者理解，是不同层级。

**科研可比性不能用工程外观替代。** 固定权重不代表推理行为完全相同；当前单端点约束不等于永久禁止并行。应区分保持某次随机实现与前瞻定义统计比较。旧 MiniMax 记录只有在输入、分析器和合同绑定匹配时才能复用。

**有限交付窗口应优先有辨识力的问题，而不是漂亮分数。** 支持性 SEED 初始化不应吞没 OpenEVO 主问题；更多空闲 GPU 不会自动消除 CPU、I/O、环境和依赖阻塞，也不会产生新增实验授权。

**完成度按验收阶段说明，不猜百分比。** 代码、资格、真实开跑、轨迹完整、分析完成、网页上线、真人看懂不能折算为未经定义的 80%/90%，更不能反复都称为“最后一道”。

## 实际修改的位置与理由

共修改 **14 份现有文档、2 个现有测试文件**；没有新建平行长期规范。

### mykcs/basemodel

| 完整路径 | 为什么放这里 |
|---|---|
| `AGENTS.md` | 根入口只加重复纠错检查的短路由，便于操作前发现。 |
| `docs/agents/current/project-agent-operating-principles.md` | 操作前检查证据、阶段式进度报告、工具/记忆/仓库写入区分属于稳定工作方式。 |
| `docs/agents/current/human-thinking-web-expression-contract.md` | 五问含义、依赖图拓扑、正文可读性、选择器迁移和桌面/手机范围属于表达规范。 |
| `docs/agents/current/scenario-trigger-registry.md` | 在重复投诉、复盘和状态变化时触发现有规则，而不是依赖 Agent 想起来。 |
| `docs/agents/current/release-closeout-protocol.md` | 源码导出不等于 Git worktree；固定部署 URL 不等于最新稳定站点。 |
| `docs/agents/current/mechanism-site-authority-snapshot-202609062000.md` | 明确历史作用域，保留旧事实，避免 legacy current 目录误导未来执行授权。 |
| `docs/agents/history/2026-09-06-reader-journey-repair.md` | 追加 #516 的实际发布链、两次 Preview、WebKit 失败/修复与设备范围；不覆盖 #499 历史。 |
| `docs/agents/history/2026-09-07-reader-journey-experience-retention.md` | 在已有案例补充完整对话的原因、错误假设、操作检查、反例、重复失效原因与 A/B/C 分层。 |
| `src/lib/agentScenarioTriggerRegistry.test.ts` | 新增两项规则可发现性/历史快照作用域回归；不是人类理解率测试。 |

### mykcs/openevo-experiment

| 完整路径 | 为什么放这里 |
|---|---|
| `AGENTS.md` | 启动可见的检查路由，澄清真实消费环境、推理语义和并行限制作用域。 |
| `docs/operations/governance/GOAL_MODE_AUTONOMY.md` | 既有自治规范持有重复纠错、有限信息收益、阶段式进度与不重复批准原则。 |
| `docs/operations/execution/RUNTIME_PROVISIONING.md` | 同使用环境资格检查、权重恢复、失败证据、输出生命周期属于预配置运行环境流程。 |
| `docs/operations/publication/RESULT_PUBLICATION_HANDOFF.md` | 两个语料与同一分析方法的身份绑定、MiniMax 完整性口径和跨仓库发布归这里。 |
| `docs/agents/README.md` | 将新检查链接进 Agent 阅读入口，并明确仓库知识与账户记忆不同。 |
| `docs/troubleshooting/experiment-ops/CASE-MECHANISM1-M1D-EXECUTION-PUBLICATION-RETROSPECTIVE-20260906.md` | 追加整个实验—网站过程的科学/工程反例，保留原案例与历史授权。 |
| `tests/test_documentation_state_hygiene.py` | 新增三项入口、资格边界、分析器身份的文档回归。 |

## 旧规则怎样处理

- Bash/Fish、不可覆盖他人工作、当前 ref、新旧授权和发布验收分离等规则本来存在：没有再建重复 SOP，而是补“下一次操作实际检查了什么”。
- vLLM “不训练”与“绝不改变输出”的混淆被澄清；没有升级推理库、改采样或重跑实验。
- 历史 M1-D 单卡约束保留，但不泛化成所有未来实验的禁并行规则；冻结 Master Plan、machine router、manifest、release、receipt、结果未修改。
- 旧 Mechanism 快照明确标为历史，未把过去的 A/B/C 状态偷偷改成今天的值。
- #516 的工程发布记录保留；不得据此声称用户可读性问题永久解决。核验到状态栏 `data-state-lifecycle` 与旧字号检查 `[data-lifecycle]` 的覆盖缺口；已有产品后续 #518 保持独立，不复制其改动另开一条网页修复线。
- 实验仓库并行新增的比较准入与共享 Docker 所有权规则已读取并合入，未被旧副本覆盖。

## 重复犯错检查

| 已经总结过但再次发生 | 为什么未阻止复发 | 本次调整 |
|---|---|---|
| Fish 默认 shell 解析 Bash 片段 | 规则存在，但工具外层 shell 参数未落实。 | 根入口路由到操作前证据；证据必须是实际命令/检查结果。 |
| PASS、启动、结果、发布混淆 | 局部证据被提升为下一层结论；进度口径缺少验收分母。 | 稳定工作规范要求按证据阶段汇报，不报未定义百分比。 |
| 可读性反复修复、测试仍漏检 | 用可见/不溢出替代理解；新组件没有继承旧检查覆盖。 | 表达合同要求语义内容与覆盖一起迁移；保留三层验收区分。 |
| 已测旧树当成当前 main | 工作目录和对话叙述被误认为即时权威。 | 操作前精确 ref；本次实际阻止并处理了并行文档漂移。 |
| 源码导出被当 worktree | 目录名字“final/integrated”代替 Git 身份。 | 明确导出分类、基线与文件映射；提交后逐 blob 校验。 |
| 已有 retrospective 被当成自动记住 | 文档、检索与持久化记忆三者混淆。 | 分别要求实际写入回执；本次明确记忆写入为 0。 |

## 长期记忆：实际写入与候选

**实际写入：0 条。** 本次环境没有可用的长期记忆写接口。没有把 personal-context 检索、仓库提交或本索引冒称成账户记忆更新。

已在既有案例中准备的稳定候选：中文、零项目背景可读解释；实际落地而不是反复规划；重复纠错修共享根因并保护回归；不碰他人的文件/容器/实验；唯一科学证据先验证保全再讨论删除；科学、运行和发布证据分别核对。

具体模型、截止日期、某次 GPU 授权及 M1 阶段限制仍属于项目/当次合同，不能提升为永久账户默认值。未来环境若有真实写接口，应重新确认其能力再写入。

## 刻意没有提升为长期事实的内容

当前 PID、当前 GPU 占用、磁盘余量、实验 round/百分比、临时路径/端口、PR 一时的通过/失败、短期截止日期及临时分享凭证。历史 SHA、必要失败测量、发布身份只保留为有作用域的复核证据，不当未来运行默认值。密钥和分享令牌未入库。

## 验证范围

- BaseModel 定向文档/入口测试 15/15 通过。
- OpenEVO 定向文档测试 4/4 通过（三项新增、一项既有操作/鉴权边界测试）。
- 修改文档相对链接按完整固定 Git 树核对；新增文本的空白、编码和敏感内容检查通过。
- 两个原子提交的全部修改文件已做远端 blob 一致性回读。
- 以上是文档发现和作用域验证，不是全网站真人理解测试或 GPU 运行资格证明。合并状态以最终聊天 closeout 和 PR 当前状态为准。

## 历史真实性

覆盖可见对话从科研问题选择到网站发布的两条线，并以已有仓库案例交叉核验。部分早期工具记录被截断/脱敏；没有捏造其缺失命令、任务消耗、结果或事故责任。旧 Assistant 总结只用来找证据，不能替代证据。

## 后续状态说明

本文件写入 GitHub 时，后续产品修复 [#518](https://github.com/mykcs/basemodel/pull/518) 已合并到 `main`。这不改写上面的历史记录：#519/#370 仍是本次“经验沉淀”规则入库的独立交付，#518 属于后续产品可读性修复。