# 从能找到信息到能解释实验：网站重构执行记录

日期：2026-09-07；负责人：本对话。用户已明确授权接管，并要求网络搜索与 Astra 审查。

## 基线和范围

当前基线固定为 de51fb4c0d88a334418a81859a7f1f6ba4c5b4c8。PR #499 已合并；继续改进其实现。b9dfe5a7 属于另一个未采用候选，保留供参考而不覆盖主线。
Git HTTPS transport 超时，已通过已认证 GitHub API 下载该精确提交的源码归档。验证使用归档的完整代码；最终 GitHub 提交以真实基线 SHA 为父节点，不用临时本地提交冒充主线。

## 读者和已确认的问题

读者没有智能体基础。Astra 独立源码审查确认：购物交互只高亮文字；购物到参数干预缺推理桥梁；报告正文约 .71rem 而标题可达 4.45rem；历史准备与后来完成的测试并列造成时间混乱。报告、入口与探索页需要正文修复，不能把共享背景组件覆盖算作整页完成。

## 网络依据及实际设计决策

- [Bret Victor, Explorable Explanations](https://worrydream.com/ExplorableExplanations/)：同一示例嵌入连续解释；静态阅读依然成立。应用于购物示例和参数对照，交互改变可见对象及说明。
- [W3C, Make Each Step Clear](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p04-clear-steps/)：明确当前步骤及其上下文。购物要求始终保留，报告明确历史阶段与后来结果。
- [NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)：按读者需要区分主内容和次内容。过程含义及科学边界可见，精确方法记录按需展开。

上述资料是设计依据，不是新版理解率的证据。

## 实施

1. 复用 ResearchTaskContext：四个状态展示任务、搜索结果、商品规格和购买核对。内容明确标注教学示意；不生成实验分数，不暗示动画是在线模型。
2. ParameterComparisonExample：解释参数及差值来源；较早模型、真实变化、同幅度随机变化三种对照。相同任务与评判办法始终可见。二维箭头标为概念示意，原数据和实验授权保持来源约束。
3. 报告：补初始经验/后续学习/最终测试的阶段表；六个历史步骤重写为中文意义段落；方法原记录保留就地披露；修正历史准备检查的时态；提高正文大小并降低标题支配。
4. 入口与探索/报告 gateway：正文按问题及因果关系表达，继续使用同一数据源，原事实和预算不随可视化修改。
5. 回归测试：购物对象状态变化、参数比较切换、无 JS 完整内容、全部展开、阶段识别与非空选择器；中英文、亮暗、360/390/768/1440 宽、减少动画。

## 验收

- 首屏可判断研究对象和证据状态；不把 toBeVisible 当作首屏或理解率。
- 默认正文能解释一次任务、学习与动作关系、随机对照的作用、每实验起止、独立参照。
- 所有交互键盘可达、无 JS 可读；演示状态不写入实验状态。
- 历史准备与后来完成分开；保留不可识别/零效应和授权/运行/封存区别。
- 必须通过项目 preflight:ui、真实 Preview 和发布后验证；未执行保持未勾选。
- Astra 是独立 Agent 审查，不能冒称陌生同学/老师受试者或真人理解率。

## 清单

- [x] 用户授权接管；刷新真实主线与旧工作归属。
- [x] 网络检索原始设计资料。
- [x] Astra 独立审查现行源码并给出具体修复意见。
- [x] 修改前固化本计划。
- [x] 实现购物情景及参数对照。
- [x] 修复报告、入口与探索正文。
- [x] 自动化回归与完整 preflight。
- [ ] 渲染后阅读走查及必要修正。
- [ ] 原子 PR、精确 Preview、CI 验收。
- [ ] 合并与 Production 验收。

## 整合说明

运行中发现 PR #516（ec95f1d）提供同范围章节结构。选择性整合其首屏定位、就地证据披露及真实顺序流程；保持本轮正文、字号和购物/参数示例。Astra 再审后移除重复的机制顺序摘要，保留真实 A/B 分支图；纠正起点可比性表述，运行完成不退回授权态，状态列表不冒充步骤进度。

主线 bcc9b9a 相对原基线只有规则文档及对应断言变化，已逐项读取并同步。整合版本单独验收；旧版本测试结果不冒充整合版本 PASS。

## 最终验收记录

PR #516 已合并为 859c74d。其后 #517（6307e45）只更新 CI 成本配置、对应文档/断言与 development 页面中的分片数；本任务内容不冲突。保留当前两分片严格保护，补跑其预算回归与确定性构建。发布使用当前主线为父节点，研究组件内容与完整浏览器通过版本保持一致。

Astra 最后一次整合复核确认主要拓扑、状态、任务步骤与时间衔接已修复；另外纠正了探索摘要的条件表述、外部分析器参与时机和预先固定测试题的时间顺序。实际首屏截图发现长标题和英文长句侵占首屏后，修改内容与标题尺寸，保留正文 16px。

最初链接 dpl_5HLjByMdzMCZtVsJV2eMMU3oic59 指向 d00e986（#480）的旧部署，不会自动包含后续改稿。正式阅读入口使用 basemodel-preview.vercel.app。

完整 preflight:ui：PASS，374 项 Chromium/WebKit 测试通过（7.9 分钟，重试 0）。此后仅吸纳独立 #517 主线配置及本验收记录；研究组件字节保持不变。Preview/CI/Production 以 PR 的后续精确提交记录为准，未观察到的状态不标为 PASS。


## 当前主线与可读性覆盖补充

首次候选 1ffb70e 与文字修正版 ee4dda6 各自通过完整 374 项跨浏览器检查；两者均生成真实 READY Preview。实际阅读走查推动第二版清理默认摘要黑话与数字单位。它们不是后续提交的精确验收凭据。

REPEAT-CORRECTION：主线 #519 在验收期间前进到 01871f4，并保留了新增组件逃出旧字号选择器的已知漏洞。当前所有者为 human-thinking §10.10、release-closeout §6.3/6.4。已核查真实 main ref、九个独立变动路径及现有 assertVisibleReaderGeometry 选择器；允许整合同一 PR，并给 Orientation/StateRail/Journey 的核心回答添加共享 data-reader-answer 标记。现有字号、对比度和几何检查扩至六条主阅读路线，且逐项检查实际语义节点确实进入选择器；关闭折叠中的 summary 仍应按其可见几何验收。源码、主线或部署身份变化时重新核验，不把旧版 PASS 改写为新版 PASS。

本轮仍是源码导出：保留已知主线和改动清单，通过 Git blob 比对验证来源，再用原子 Git-data 提交发布；不伪称有 .git 的干净工作树。后续当前候选的 CI/Preview/Production 凭据追加在 PR #518 与用户交付 Markdown。


## 2026-09-07：把研究目的放在术语前面

用户再次指出，读者刚进入机制子页仍不知道它要干什么。REPEAT-CORRECTION：触发为首段先说参数、没有先交代任务与研究目的；所有者为 human-thinking §10.10 和现有 ResearchOrientation；核查对象为 0af72ec 的实际机制页开头。允许的下一步是只重写中英文标题、导语、问题/意义，并把首个阅读入口指向已有购物示例；实验状态、依赖关系、预算和结果保持原数据语义。页面源码、主线或首屏几何变化时重新核验。

新的顺序：AI 从尝试中学习 → 模拟购物任务 → 之前问能做到多好 → 本页检查哪些内部变化影响表现 → 先看一次购物，再看对照实验。沿用已有排版、正文大小和回归检查，不另加一块重复长说明，也不以自动测试代替理解率。发布与实测凭据记录在本轮 PR。
# 2026-09-07 execution follow-up

User authorized implementation of the reviewed comprehension plan. REPEAT-CORRECTION witness: repeated unexplained first-screen codes and incomplete stop summary → existing expression contract §10.8–10.10 and typed lifecycle owner → exact main `9bbae312a027d6623de39f61d50ec275d1a9f473`, rendered reading-path tests, independent Astra review → implement plain roles, complete branches, score units and derived state in an isolated source export → invalidate on main/source/state changes or a new reader misunderstanding. PRs #522/#523 are separate CI optimization/measurement work; preserve them, never merge the measurement PR. No experiment execution is authorized by this website change. Implementation and acceptance receipts follow after actual checks; human comprehension remains unmeasured.

## Implementation scope and cold-read inventory

The existing 13-route inventory is retained (12 unique owners; exploration and its compatibility URL share one owner). `rebuilt`/`contextualized` remains an implementation classification, not a human-comprehension score. Astra independently read the pinned main and identified the following repairs; the shared route context already provides the shopping task and purpose on contextualized routes.

| Route suffix | Default answer location and inspected reader question | Repair / disposition |
|---|---|---|
| root | Orientation, shopping example, three entry paths: where should I read? | The finish summary now explains independent paths rather than giving the whole family one mechanism endpoint. |
| mechanism-1-0 | Orientation → shopping → learning bridge → parameter controls → state → dependencies → lifecycles | Plain roles precede codes; all stop branches in the summary; accepted means retained active states, not reward-selected winners; score units explained locally; displayed execution/results derive from typed facts. |
| first-run | Orientation, historical closeout: what ran and stopped? | Add 128 attempts per 7B round; distinguish complete and partial records; explicitly leave the original early-stop reason unverified. |
| openevo-2-0 | Orientation and report link: what is complete? | Give 1.7B's 160-round / 20,480-attempt endpoint and final outcome; retain unfinished matched 3B evaluation. |
| openevo-2-0/report | Chronology and final-result section: how did preparation become learning and a final test? | Add the training-to-frozen-evaluation bridge and mean-score/exact-success explanation. SEED is an external reference, not a locally paired causal control. |
| openevo-2-0/exploration | Final journey summary and existing capacity detail | Explain organizing saved shopping experience before the 20-input retry/split mechanics; preserve fixed rules and no extra shopping. |
| stage1-evolution | Same owner as exploration | Same repair; compatibility URL is not a second independent experiment. |
| openevo-2-0/harness-2-0 | Opening control/candidate comparison | Explain the changed input as historical-experience hints; preserve common model/tasks/action interpretation and historical qualification scope. |
| stage1-previous | Opening, archive links, reuse section | Pin the old/new comparison to the 2026-08-31 archive review, separate later shared-interface research, and repair the obsolete return fragment. |
| stage2-256-window | Opening and gate explanation | Correct 20,480 from an apparent aggregate to a per-arm ceiling; distinguish the early-stopped 3B/MiniMax arm. |
| stage2-7b-analysis | Historical scope before authority strip, parameter-update section | Change stale current-state claims to historical tense and link later 7B closeout; do not retroactively insert later interventions into training. |
| stage2-ceiling | Final results and nearby note | Explain complete-round accounting and partial exclusion; do not infer budget exhaustion as the early-stop cause. |
| archive | Existing task context, evidence navigation and archive sections | No demonstrated main-narrative defect requiring rewrite; technical evidence density is appropriate to this route's lookup purpose. |

Scientific checks: accepted-state selection and task-score units are from the mechanism design at `8ddb7890073bdc0573acb1fc9ef40239e2655979`; SEED reference provenance is from `docs/evidence/server-runs/2026-09-06/qwen3-1p7b-final-closeout/FINAL_ANALYSIS.json` at `e9233c8693c078f61cc08a4409138a3d09d39bd6`. The available 7B governance records establish closeout and artifact identity, not the original early-stop reason. That gap is shown explicitly rather than filled with an invented explanation.

Regressions cover default explanation order, each stop branch, score scale, typed execution/result projections under later mixed states, external-reference qualification and historical scope/links. Existing no-JS, topology, keyboard, reduced-motion and geometry coverage remains registered. UI preflight classifies this batch as shared: deterministic gate, build, overflow preflight and full cross-browser UI matrix are required before a provider-triggering ref.

Integration witness: main advanced through independent #522 to `aa765005c9af9351b9e8e94cd71a42c0cca6b112`. Its five CI ownership/policy/test files do not overlap this batch and are retained unchanged in the validation surface. This batch changes shared components, so it still requires the full UI matrix; the isolated mechanism optimization does not narrow this acceptance. English first-screen screenshots exposed excess total height; grouped repeated result labels, shortened redundant introduction, and adjusted section padding without reducing font size or hiding answers. The old exact “new version is authoritative” copy assertion was replaced with dated identity and non-equivalence checks, preserving its scientific purpose.

## 2026-09-07：#524 实际整合与当前验收

本次接手首先重新核对实时仓库，而不是沿用交接包中的旧状态。`main` 仍为 `aa765005c9af9351b9e8e94cd71a42c0cca6b112`；PR #524 已前进到 `bdb837152f33ff7e08a85d8df7717aacf9875d11`。新出现的 #527 基于 #524 重构 study 首页，但不直接改本轮 19 个恢复文件，因此本分支不自动吸收 #527；提交前仍需再次检查并行漂移。

交接 zip 实际只包含 handoff 与 plan 两个 Markdown，没有 README 所述的 `implementation/`、`reader-ours/` 等目录。远程源码导出 `/Users/myk/tmp/basemodel-reader-completion-20260907` 与精确 `main` 的 950 个 tracked files 做逐字节比较后，恰好只有交接声明的 19 个文件不同、0 个 tracked file 缺失，因此先从真实 main 恢复这 19 个差异，再把最新 #524 作为第二父节点三方合并。

三方合并真实产生 9 个冲突文件。解决原则不是整文件选择 ours/theirs：保留 #524 的通俗标题、历史字号、展开内容和回归覆盖，同时保留本轮的科学边界。特别是 20,480 明确为旧 Stage 2 **每组**上限；7B 最终模型只纳入 149 个完整轮次 / 19,072 次学习尝试，后续 96 条 partial 不进入最终模型，提前停止原因仍保持 unknown；SEED 数值保持外部冻结参考值而非本地配对因果对照；Harness 机械检查 PASS 不等于正式训练授权；accepted state 明确按训练记录顺序保留，不按购物 reward 选窗口。

状态 owner 进一步收紧：`openEvoMechanismNarrative` 删除未被渲染的自由文本 `state` 字段，只保留 `execution / results / timestamps / release / receipt` 这些 typed facts。strict schema 现在直接拒绝附加自由文本状态；M1-A/B/C 保持 `locked`，M1-D 保持 `authorized + actualStart=null + results=unsealed`，公开文案由 `mechanismDisplayState` 派生为“已授权，尚无开始记录 / 结果未封存”。旧的“M1-D 阶段已激活”中英文 E2E 字符串已经删除，避免测试反向固化含糊状态。

当前整合候选 `5a223ee222aafd58f37397182ad2f0c1f0654484` 已通过相关语义单测、`verify:deploy`、478 路由生产构建和 390/768/1440 overflow preflight；完整 shared UI matrix 尚需在追加本记录后的最终 head 重跑，因此这些绿色结果不能冒充后续 head 的完整验收。

当前授权环境没有可调用的 Astra CLI / tool；本轮不能伪称完成了新的 Astra 独立审读。先前历史记录若有 Astra 证据仍按其原时间点保留，但本次 continuation 的 Astra 项明确记为 unavailable。真人目标读者测试仍为 0；自动化、模型冷读和此前任何 Agent 审读都不计作真人理解率。

发布边界不变：网站改动不授权实验运行。本轮先完成 exact-head 本地全量验收，再一次性推送 `research/**` 分支形成 Preview/PR；合并与 Production 必须单独满足接受条件，未发生前分别标记为 pending。
