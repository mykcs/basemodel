# Browser CI evidence audit — 2026-09-06 / 浏览器CI经验沉淀

Status: historical evidence and corrections, not live runtime state or current release authority.

当前操作协议：[CI performance experiment runbook](../current/ci-performance-experiment-runbook.md)。Shell、权限、Git、发布与科研授权继续由既有current owner承担。本文件不授权重跑性能实验或改GPU/服务器。

## 1. 历史更正：完整证据先于漂亮结论

此前聊天与#481原说明称#473“无对照、提前合并”，这超出证据。2026-09-06 UTC：#475评论5559257202在12:36:33已记录static critical356秒；#474重复运行在12:42:51完成；#473评论5559295528在12:44:05列出326/356/324；#473在12:44:50才合并。因此合并前已有对照与重复运行。共享GitHub账号不能识别某个具体Agent。[S4][S5]

评论提及>20秒预定筛选标准，本次未恢复结果出现前独立冻结该数值的证据。准确写“预注册时间证据未核实”，不是证明它从未预注册。

| 样本 | source head | browser shard秒 | critical秒 |
| --- | --- | --- | --- |
| adaptive首次 #474 | 570262267a6682260322c9d0f9f4dc5f580a6e52 | 278 / 326 | 326 |
| pre-merge static #475 | c2af67537b46bede63fd3aba5b716da51a3b6295 | 356 / 265 | 356 |
| adaptive重复 #474 | 0da8ea572a4d8473948cc5b3483743f99c657002 | 323 / 324 | 324 |
| 后续static #479 | 969aaa170ded4ee275d1f5a4e93ff3dec43cb3ea | 281 / 330 | 330 |
| 同树static重复 #479 | dc923b4df0795f2e7d4b472d7cc8bb87a7d63f2d | 389 / 385 | 389 |

static完整值356/330/389，均值358.33、中位数356秒；adaptive326/324，均值和中位数325秒。均值差33.33秒约9.30%仅是描述性差值：样本少、不平衡、不同时段，实际scheduler mode和阶段证据未逐run完整恢复，不是因果估计。

只挑最快static330得4到6秒，或只挑最慢389，都不完整。59秒是389减330的观测极差，不是统计方差、通用噪声阈值或零效应证明。

#481六路径回滚确实发生，保留#476/#480研究更新。head1e07c9d965d6046c001757dc2e52797e1a28abef、tree4a3f49305f262d42ade87bcd01f6043ddfc912e9经exact-head三项检查后合并为a0d718346e37a0e05d78d58981e94c039d95ad3f。将解释改为“证据不充分下偏好简单实现的工程采用决定”，不能称adaptive已科学证明无效。保留原记录并追加更正；本次不重启该实验。[S8]

## 2. 实验台账与推论边界

以下均为历史status-clock延迟代理，不是纯test/CPU/计费时长；不同工作量和模式不自动并池。历史163 Chromium tests、24文件、2medium、每job1worker、retries0是本次冻结快照，不是永久测试数量。

| 实验 | 记录 | 边界 |
| --- | --- | --- |
| 原main baseline | browser290/301，critical301秒 | 5m01s历史参照，不是永久SLO |
| #459 eager readiness | 353/296，critical353 | 慢52秒；重复audit是机制假设，非全部回退归因证明 |
| #464 carried readiness | hosted281/363；本地focused203.68到182.44秒 | 本地正结果和hosted负结果都保留 |
| #463/#466 video | 普通full299/322 | 没在该观察胜过301；失败canary未完成，第二次录像不是首次事故录像 |
| #468/#470 npm下载cache | warm362/323 | 净成本含restore/save；seed成功不是warm命中证明 |
| #471 static对照 | 279/315 | 同窗口cache critical慢47秒 |
| #473/#474 adaptive | critical326/324 | shadow兼容、资格验收与active性能分开 |
| #475 pre-merge static | critical356 | 后来同SHA复用不抹掉这个有效run |
| #479 static重复 | critical330/389；同tree c9c96023be8008e36569270fa56f8d2811f30522 | 极差不可当噪声分布或零效应证明 |
| #481 revert | 六个CI路径，验收后合并 | 回退正确性不是steady-state性能证据 |

#456/#457/#460为邻接runtime、测试粒度与资格实验，应查原PR和旧closeout，不把这里未详述理解为从未尝试。#472是重复warm入口；#477因base漂移无效；#478混workflow汇总无效不使原#475无效。[S1]–[S12]

## 3. 逐项摩擦：事件、原因、错误假设、预检、规则、反例

### F01 — readiness要替代audit，不叠加（A/B）

**发生**：删除40ms sleep却在点击后和下一轮各做audit，#459整体更慢。

**原因**：只算删等待，没有算新增跨进程和几何读取。

**错误假设**：ready越早返回，完整CI必更快。

**操作前检查**：画初始、点击、下一轮、最终状态的检查次数；测总路径。

**防御规则**：复用原检查结果并保留目标状态身份，完整成本实测。

**反面例子**：删40ms却增加两次重检查，仍称纯性能等价。

### F02 — 同一个40ms不等于同一时间合同（A/B）

**发生**：#464成功await之后可能已过deadline，成功路径仍接受；旧sleep40后audit也不保证总耗时40。

**原因**：轮询预算、内层超时、总操作耗时和状态成立时刻混淆。

**错误假设**：常量和断言文本相同就语义相同。

**操作前检查**：分别检查初始/中间/最终状态、内层timeout、成功/失败分支、期待的step。

**防御规则**：先定义时间模型；硬期限要覆盖成功返回；旧状态和暂态单独审查。

**反面例子**：deadline只在catch里判断，80ms后成功直接return，却称硬40ms上限。

### F03 — 局部与hosted结论各自成立（A）

**发生**：#464本地focused203.68到182.44秒，hosted critical为363秒。

**原因**：运行环境、样本、安装构建和调度不同。

**错误假设**：本地focused结果代表云端完整合同。

**操作前检查**：核对实际树、身份、OS、镜像、浏览器、worker和计时端点。

**防御规则**：保留正负结果，各自限定推论，采用依据完整目标路径。

**反面例子**：以Mac局部快10.4%抵消云端整体更慢。

### F04 — qualification不是steady state（B）

**发生**：CI基础设施变更触发额外Lab验收和reserve，stacked EOF-only PR测普通full路径。

**原因**：风险planner会改变辅助工作量。

**错误假设**：同名绿context就是相同工作。

**操作前检查**：实际planner、Lab、preflight、reserve、测试集合及模式。

**防御规则**：保留资格强度，单独冻结常态对照；两种证据分开。

**反面例子**：删除Lab gate令基础设施PR变快，或拿更强资格耗时当日常提速。

### F05 — 冻结的是实际执行树（A/B）

**发生**：#477源control仍旧，但main含adaptive，synthetic base+head已变。

**原因**：CI会整合base与head，而不是只跑源head。

**错误假设**：固定head就固定受试系统。

**操作前检查**：base、source head、配置revision、synthetic父关系和实际tree。

**防御规则**：冻结完整身份，漂移先做路径交集与语义判断。

**反面例子**：把优化后main整合进control，继续称未优化对照。

### F06 — status必须按attempt配对（A/B）

**发生**：#477/#478复用SHA导致combined summary混合不同workflow；#475旧有效run随后被遗漏。

**原因**：最新context投影不是运行台账。

**错误假设**：同SHA三项最近status必属于同一run。

**操作前检查**：读取完整历史，按SHA/context/workflow/job/attempt分组。

**防御规则**：pending与terminal只在同一attempt配对；新SHA隔离不抹旧run。

**反面例子**：拿旧pending减新success，或把这个SHA所有历史样本作废。

### F07 — 先补齐完整台账再继续或回退（A）

**发生**：漏读已关闭#475，错误声称#473无对照就被提前合并。

**原因**：沿聊天尾部与近期open PR推断历史。

**错误假设**：找不到就等于没有发生，共享账号能识别具体Agent。

**操作前检查**：open/closed/merged PR、评论、分支、SHA和时间窗口。

**防御规则**：先声明证据覆盖，阶段切换刷新台账，再作采用/回退决定。

**反面例子**：创建更多对照后才发现旧对照已完成，并把缺上下文归责其他Agent。

### F08 — 工程采用不等于科学否证（A）

**发生**：只挑static330计算4到6秒差值；把59秒极差叫方差并称adaptive无效。

**原因**：选择性样本与不确定性被压成二元结论。

**错误假设**：噪声大就是效应为零，选简单实现就是性能假设被否证。

**操作前检查**：全样本、预声明次数顺序预算阈值与排除标准、声明时刻。

**防御规则**：完整报告描述统计和局限；维护权衡与因果结论分写。

**反面例子**：候选取均值、对照只取最快，或结果后补阈值再称预注册。

### F09 — 等待时间、工作量与额度分开（A）

**发生**：600乘40ms被误用为并行critical必省24秒；status clock与纯test耗时混用。

**原因**：没有明确端点与并行依赖。

**错误假设**：时长可直接相加或换算CPU和credits。

**操作前检查**：required集合、开始时间、同attempt端点、provider阶段和依赖。

**防御规则**：状态时钟是延迟代理；critical为最晚required terminal减最早required pending。

**反面例子**：把两个并行shard的节省相加当用户等待收益，再直接乘计费率。

### F10 — 缓存、镜像和录像看净成本（A/B）

**发生**：预装镜像、缓存和关闭成功录像没有仅靠设计就证明提速。

**原因**：忽略pull/restore/save/setup、OS变量和诊断补采。

**错误假设**：cache hit或关video天然值得采用。

**操作前检查**：真实hit/key、seed/warm、runtime、完整阶段耗时、失败工件。

**防御规则**：实测净成本；首次失败退出码保留；补采录像属于第二次运行。

**反面例子**：绕过npm ci，或者失败canary未完成就称诊断等价。

### F11 — 性能元数据不是测试准入许可（A/B）

**发生**：新或改名测试没timing会bootstrap死锁，adaptive必须完整fallback。

**原因**：历史耗时被升级成正确性条件。

**错误假设**：有历史才准跑，无历史就跳过。

**操作前检查**：canonical身份、未知/重复title、空桶、遗漏和实际执行并集。

**防御规则**：缺历史完整运行并生成历史；身份损坏fail closed，性能元数据缺失可完整fallback。

**反面例子**：过滤未知测试以凑齐timing，或只查各job预测并集不查实际跨job集合。

### F12 — Shell、依赖和Git范围先成立（A）

**发生**：Fish/Bash、新worktree无依赖、外部Playwright解析、未提交EOF不在base..HEAD。

**原因**：假定继承其他工作区环境。

**错误假设**：创建branch就有依赖，磁盘改动就是Git比较范围。

**操作前检查**：显式shell/pipefail、根目录、lockfile与二进制来源、index/HEAD/diff。

**防御规则**：复用现有operating preflight；把环境和提交范围绑定。

**反面例子**：用tail掩盖发现错误，把空diff fail-closed当预期测试。

### F13 — 错误分类后再换操作（A）

**发生**：Mac git443超时而connector能写；不存在base的PR请求重复422。

**原因**：把网络、权限、结构性参数错误混为重试问题。

**错误假设**：超时就是token坏，重复相同参数会修复422。

**操作前检查**：错误类型、ref存在性、schema和真实远端head。

**防御规则**：网络换已授权路径；参数先修；采用远端实际SHA而非本地准备SHA。

**反面例子**：为网络超时暴露凭据或反复重新登录，盲目重发相同422。

### F14 — 只读也可能泄露秘密（A）

**发生**：为查局部任务读取完整进程命令参数，把无关敏感信息带入聊天。

**原因**：数据收集范围过宽。

**错误假设**：只读操作没有安全成本。

**操作前检查**：最小所需PID/字段/对象，token和私人路径风险。

**防御规则**：源端过滤脱敏，再读取和持久化；本文件不复制原始敏感输出。

**反面例子**：将原始ps aux或连接token贴进公开复盘。

### F15 — 轮询不是推进（A）

**发生**：长时间重复pending和重复schema查询，用户多次要求继续、询问是否完成。

**原因**：没有分离等待、独立工作和结束条件。

**错误假设**：查询频率就是完成进度。

**操作前检查**：下一次读取是否能改变决定，是否有不用重触发的独立任务。

**防御规则**：有界等待、准确checkpoint与阶段更新；不承诺后台交付。

**反面例子**：为刷新状态反复空提交，或把mergeable/merged写成全部验收完成。

### F16 — 回退只撤受试路径（A/B）

**发生**：#481期间#476/#480独立科研网页已合并，需保留。

**原因**：共享main继续前进。

**错误假设**：整树恢复旧baseline等于撤一个CI实验。

**操作前检查**：反向diff、后续路径交集、集成tree和exact-head checks。

**防御规则**：窄回退；文件写入、gate、merge、post-merge、deployment逐层记录。

**反面例子**：撤CI时连后来科研页面一起恢复旧版，或凭管理员mergeable绕过绿灯。

## 4. 风险分析与实证事实分开

成功await过deadline的例子是控制流审查/假时钟模型，不是已测得真实浏览器80ms事故。提前观察旧step或暂态是设计风险，本次没有真实轨迹证据证明发生。两个独立job各自验证预测桶并集完整，不证明实际跨job完整覆盖：历史更新或native/fallback混用可能使分配不同，应核对共享分配身份、fingerprint和实际执行并集。本次只增加人工规则，未部署新的自动跨job或merge gate。

## 5. A/B/C归位与长期记忆

A：完整台账、实际执行身份、正确性/观测/因果/采用分离、显式环境、错误分类、最小脱敏读取、有界等待、追加历史更正。进入root/current触发入口，既有Shell/Git/权限owner继续承担细则。

B：BaseModel synthetic base+head、planner与Lab、JUnit发现污染、timing/canonical映射、缺历史完整fallback、窄回退。具体配置每次重读，历史163不是永久合法数。

C：SHA、PR和时长只作带日期历史证据。刻意不保存PID、GPU此刻占用、round、百分比、临时worktree位置、私人地址、token、无关进程或过期quota。本CI线程没有新增GPU/服务器事实或科研执行授权。

账户长期记忆实际写入0条：当前bio写工具禁用，personal context只有读取。仓库提交不等于账户记忆。稳定候选是用户要求实际修改提交与验证、优化保留验收语义、继续/收口先刷新完整相关证据、重复问题进入root/current、授权内保持隔离与窄范围；没有真实成功写回执就不宣称ChatGPT账户已记住。

## 6. 重复犯错检查

| 已有规则仍复发 | 原位置 | 复发原因 | 本次调整 |
| --- | --- | --- | --- |
| Fish/Bash、依赖、dirty worktree | root / operating principles | 不全是历史太深，实际操作前漏跑preflight | 当前runbook触发并链接原owner |
| provider与验收主体 | deployment-policy | LATEST留旧浏览器gate命令、历史checklist像现行协议 | 修旧可执行指令、标历史身份、统一current性能owner |
| green/mergeable/merged/live不同 | release与旧CI closeout | 阶段切换沿聊天尾部，缺完整台账 | root规定继续/采用/回退查已关闭PR和评论 |
| 重跑不抹原失败 | 旧CI closeout | combined status当单run | 强制attempt分组和原工件保留 |
| 有界等待 | LATEST | 轮询被当进度且缺阶段汇报 | 复用等待纪律，准确checkpoint |
| 性能不削弱语义 | engineering standard | 常量未变替代时间模型，噪声替代零效应证明 | 时间语义审查、全样本、预定决策规则 |

用户多次要求继续与询问完成状态属实，不能编造成他亲自对同一技术问题纠正两次以上。上述是既有规则仍复发的审计，而不是虚构逐字用户纠正记录。文档层级修复不是自动执行保证；机器阻断须另开代码PR并验收误报、兼容性与成本。

## 7. 交付边界

本次目标为8个文档的原子提交：唯一current runbook、root/README/场景入口、provider委派、旧LATEST指令与完成checklist的历史身份、独立历史更正。是否已提交/合并以新head收据为准。既有#482 Draft保持原归属，已协调其邻接历史范围，不覆盖或关闭它。产品、CI执行、科研数据、GPU/服务器/provider配置不变，没有新增性能实验或付费。

## Sources

- [S1] https://github.com/mykcs/basemodel/pull/459#issuecomment-5558509152
- [S2] https://github.com/mykcs/basemodel/pull/464 ; https://github.com/mykcs/basemodel/pull/464#issuecomment-5559742193
- [S3] https://github.com/mykcs/basemodel/pull/463 ; https://github.com/mykcs/basemodel/pull/466
- [S4] https://github.com/mykcs/basemodel/pull/473#issuecomment-5559295528 ; https://github.com/mykcs/basemodel/pull/474
- [S5] https://github.com/mykcs/basemodel/pull/475#issuecomment-5559257202
- [S6] https://github.com/mykcs/basemodel/pull/468#issuecomment-5558936722 ; https://github.com/mykcs/basemodel/pull/470 ; https://github.com/mykcs/basemodel/pull/471
- [S7] https://github.com/mykcs/basemodel/pull/479
- [S8] https://github.com/mykcs/basemodel/pull/481 ; https://github.com/mykcs/basemodel/pull/481#issuecomment-5559616862
- [S9] https://github.com/mykcs/basemodel/pull/469
- [S10] [Operating principles](../current/project-agent-operating-principles.md), [deployment policy](../current/deployment-policy.md), [previous CI closeout](2026-09-05-basemodel-ci-optimization-closeout-experience.md)
- [S11] https://github.com/mykcs/basemodel/pull/477
- [S12] https://github.com/mykcs/basemodel/pull/478
