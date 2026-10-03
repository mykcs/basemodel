# BaseModel 整站升级计划：3 + 1 个方向，18 项工作

**目标不是翻新外观，而是让一个不了解项目的人，能够理解研究问题、证据、判断与下一步。**

状态：方案编写与 Draft PR 建立；产品/科研实现尚未开始。本总控另算一项文档 PR，不充当网站实现。

## 本轮实际交付状态

十四份新增任务规格全部已提交并核对；十三个子任务 Draft PR 已创建，另有本总控 #813，因此本轮实际新建十四个 Draft PR。四项旧 PR 保持原状并被纳入复用计划。

**唯一未完成的创建动作：C01 学术表格 PR。** 工具安全检查拦截了创建请求，随后只读确认该分支没有 PR；未通过其他通道重试。完整 C01 规格和分支已存在，下面保留文档入口，不编造 PR 编号。这个状态不影响其他独立任务的计划可读性。

| 任务 | 实际 PR / 规格 | 状态 |
|---|---|---|
| A01 | [#814](https://github.com/mykcs/basemodel/pull/814) | Draft；仅规划 |
| A02 | [#815](https://github.com/mykcs/basemodel/pull/815) | Draft；仅规划 |
| A03 | [#816](https://github.com/mykcs/basemodel/pull/816) | Draft；仅规划 |
| B01 | [#817](https://github.com/mykcs/basemodel/pull/817) | Draft；仅规划 |
| B02 | [#818](https://github.com/mykcs/basemodel/pull/818) | Draft；仅规划 |
| B03 | [#819](https://github.com/mykcs/basemodel/pull/819) | Draft；仅规划 |
| C01 | [完整 C01 规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-scientific-tables-20261002/docs/plans/site-upgrade-20261002/tasks/C01.md) | 规格已提交；PR 创建被工具拦截 |
| C02 | [#820](https://github.com/mykcs/basemodel/pull/820) | Draft；仅规划 |
| C03 | [#821](https://github.com/mykcs/basemodel/pull/821) | Draft；仅规划 |
| D01 | [#822](https://github.com/mykcs/basemodel/pull/822) | Draft；仅规划 |
| D02 | [#823](https://github.com/mykcs/basemodel/pull/823) | Draft；仅规划 |
| D03 | [#824](https://github.com/mykcs/basemodel/pull/824) | Draft；仅规划 |
| D04 | [#825](https://github.com/mykcs/basemodel/pull/825) | Draft；仅规划 |
| Q01 | [#826](https://github.com/mykcs/basemodel/pull/826) | Draft；仅规划 |

本轮未改 src/public/scripts/workflow/package，也未实施实验、合并或请求部署。文档、远端分支与 PR 状态核验不等于产品测试通过；网站 build、浏览器冷读、真实性能比较属于后续执行。

## 规划结构

A 开发 3 项；B 内容 3 项；C 设计 3 项；D 证据与研究决策 4 项；Q 整体验收 1 项。另复用 X783/X805/X806/X812 四项既有 PR，共18项执行工作，不要求每个方向拆成同样数量。

新增的第四方向解决“材料→分析→解释→决策”的可靠流动。内容方向负责把判断讲清楚，设计方向负责让它看得懂，开发方向负责低成本持续迭代。整体验收不是第五套治理体系，而是确认四者真的连起来。

本次只写 docs/plans，不改网站、实验、CI 配置和生产。各任务文件中的代码/路径/命令是未来实施规格，不是本次完成事实。没有实测提速、全站视觉或服务器全量数据。

## 使用方法

先读 [COMMON](COMMON.md)，按任务读取 [SOURCES](SOURCES.md) 与 [既有工作复用](EXISTING_WORK.md)，再打开对应任务 PR。每个任务有现有/拟新增文件、代码步骤、交付、反例、停止/回退和专属接手提示词。

不要先把所有 PR 同时跑起来。A01（CI）、D01（证据合同）、C03（机制图）可作为三个低冲突起点；A02/B01 也可先做只读基线。X805/X806/X812 的内容/样式重叠先由一个整合 owner 确定顺序；不自动吞并旧成果。

## 新增任务

| 编号 | 工作 | 实现依赖 | 任务文件 |
|---|---|---|---|
| A01 | 一次构建、多处分片验收与 CI 成本归因 | 可先行 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-ci-artifact-20261002/docs/plans/site-upgrade-20261002/tasks/A01.md) |
| A02 | 按需加载交互，保留可读的静态网页 | 可先行 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-static-first-20261002/docs/plans/site-upgrade-20261002/tasks/A02.md) |
| A03 | 收束组件与样式所有权，减少补丁层 | X806, X812 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-module-css-20261002/docs/plans/site-upgrade-20261002/tasks/A03.md) |
| B01 | 面向新读者与回访者的研究入口 | 可先行 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-reader-journeys-20261002/docs/plans/site-upgrade-20261002/tasks/B01.md) |
| B02 | 把三个研究结果写成能支持判断的文章 | X805, X812, D03, D04 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-research-synthesis-20261002/docs/plans/site-upgrade-20261002/tasks/B02.md) |
| B03 | 让更新、归档和复现说明长期可信 | D01, B01 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-content-lifecycle-20261002/docs/plans/site-upgrade-20261002/tasks/B03.md) |
| C01 | 论文式表格与公式：熟悉、可读、可核验 | D01, X806 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-scientific-tables-20261002/docs/plans/site-upgrade-20261002/tasks/C01.md) |
| C02 | 让研究图表可比较、可交互、离线可读 | D01, D03, X806 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-research-figures-20261002/docs/plans/site-upgrade-20261002/tasks/C02.md) |
| C03 | 能看出数据怎样流动的原生 HTML 机制图 | 可先行 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-mechanism-flow-20261002/docs/plans/site-upgrade-20261002/tasks/C03.md) |
| D01 | 研究证据的最小清单与单一数值来源 | 可先行 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-evidence-contract-20261002/docs/plans/site-upgrade-20261002/tasks/D01.md) |
| D02 | 服务器与 W&B 历史数据的只读接入 | D01 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-history-import-20261002/docs/plans/site-upgrade-20261002/tasks/D02.md) |
| D03 | 可复算的比较、统计与跨实验诊断 | D01, D02 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-comparative-analysis-20261002/docs/plans/site-upgrade-20261002/tasks/D03.md) |
| D04 | 从综合证据形成下一阶段研究决策 | D03 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-research-decisions-20261002/docs/plans/site-upgrade-20261002/tasks/D04.md) |
| Q01 | 全站覆盖、独立冷读与最终整合验收 | A01, A02, A03, B01, B02, B03, C01, C02, C03, D01, D02, D03, D04, X783, X805, X806, X812 | [完整规格](https://github.com/mykcs/basemodel/blob/docs/site-upgrade-site-acceptance-20261002/docs/plans/site-upgrade-20261002/tasks/Q01.md) |

## 复用的四个 PR

| 编号 | 原工作 | 新规划中的职责 |
|---|---|---|
| X783 · [#783](https://github.com/mykcs/basemodel/pull/783) | 资源与当前研究任务桥接 | Models/Papers/Compare/Workspace；#781/#782已合并，不重复建设 |
| X805 · [#805](https://github.com/mykcs/basemodel/pull/805) | 学习信号与rank32结果发布 | 保留真实科学发布，先解决当前冲突，再供 B02 综合 |
| X806 · [#806](https://github.com/mykcs/basemodel/pull/806) | 设计体系与全站迁移 | 复用宽范围已有改动，不再新建竞争 Design authority |
| X812 · [#812](https://github.com/mykcs/basemodel/pull/812) | β 文章阅读布局 | 阅读基准候选；尚不能当作 owner 已认可标准 |

旧 PR 的历史 CI/视觉记录不继承为新 head 的验收。调查时 #805/#806 与 main 有冲突；状态可能改变，执行前刷新。详细补充步骤在 EXISTING_WORK，不改写旧 PR 正文。

## 顺序与关键依赖

```text
D01 证据合同 -> D02 历史接入 -> D03 可复算分析
                                  -> C02 图表
                                  -> D04 研究决策 -> B02 三篇综合文章
D01 + B01 -> B03 更新/归档/复现
D01 + X806 -> C01 学术表格
X806 + X812 -> A03 样式所有权
A01 / A02 / C03 可独立推进
所有适用工作 + 四项复用 -> Q01 完整旅程与冷读 -> 经授权的最终发布
```

实现依赖不是要求先把所有文档合并到 main。研究来源/共享类型先有稳定合同，消费者可用明确标记的 fixture 开发；真正发布前必须接到真实批准数据，不让 fixture 冒充实验结果。

## 如何判断真的变好了

开发：同条件总 runner 消耗与关键路径、重复构建数量、首屏真实负载、修改一个事实需要改几处；不靠删除测试获得进步。

内容：核心判断能回到数据；分清已做/未做、训练/Final、事实/推断；跨实验综合有竞争解释和可检验预测，不强求另类结论。

设计：图/表/正文消费同源事实，比较关系/数据流可见；无 JS、手机、键盘、亮暗仍有意义；不是多几个卡片或动画。

研究决策：能说明哪项不确定性值得下一笔预算，哪种结果会改变下一阶段选择；未批准的新实验仍是提案。

整体：冷读三类人能答问题、结果、限制、下一步、依据。自动化通过、Agent 冷读、真人结果、owner 接受、生产验证分别登记。

## 覆盖与本轮验收

[源码页面清单](ROUTE_SOURCE_INVENTORY.json)给出调查基线的全部 src/pages 源文件和候选处理 owner，不等于构建路由，更不等于全部已测试。Q01必须用当前实际生成路由/Reader Contracts对账，包括动态页面、API、redirect、404与非OpenEVO资源面。

[机器可读任务依赖](MANIFEST.json)用于调度；科学真实性、当前仓库规则与用户授权仍高于这个文件。此轮校验仅包括文档完整性、依赖无环、路径范围、链接结构和远端分支/PR存在；未声称产品测试通过。

## 明确不做

不改框架主版本、不引入新CMS/数据库/图谱平台、不恢复英文或删除暗色、不重跑实验、不访问冻结Final题目、不为画图公开私有W&B、不复制凭据到共享服务器、不合并/部署、不清理旧分支或他人文件。
