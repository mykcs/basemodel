# 网站读者路径修复：方案、技术细节与验收记录

日期：2026-09-06。实现分支：`research/reader-journey-20260906`。状态：**工程交付完成**；PR #499 已合并，Production 已完成独立验收。
本文件是有边界的任务记录，不是另一套写作规范。长期规则更新已有 owner；可检查的规则落实到组件、数据和测试。

## 目标与根因

读者没有智能体基础，没有参与项目聊天。读完应能回答：模型在做什么；实验验证什么；现在知道什么；何时开始和结束；下一项为何依赖上一项。
基线网站：`main@a0d71834`。示例部署：`d00e986457cbb83c596340cd4413160a131f99b0`，截图证据不能跨树冒用。

| 现象 | 根因 | 实际修复对象 |
|---|---|---|
| 首屏口号大，购物任务与模型的关系缺席 | 旧规范默认读者懂 SEED / OpenEvo / WebShop | 修订现行读者前提；共享任务背景 |
| 四个实验平铺，开始和结束不清楚 | 数据只有问题、预算、状态，没有生命周期和依赖 | 有类型的开始—操作—停止—产出合同和 HTML/SVG 分支图 |
| GPU / release / seal 压过科学问题 | 内部运维记录直接成为正文 | 主文重排，运维和长证据本地折叠 |
| 反复写标准仍复发 | 测试只检查关键词和不溢出 | 默认可见语义、负例、无 JS、键盘、移动端测试 |
| 原 M1-A 仍像可直接执行 | 网站没有投影已合并的不可识别修订 | 原预注册保留；successor 单列；不修改科学仓库 |

## 结构与范围

主线：购物任务 → 研究问题 → 已知状态 → 因果干预及条件分支 → 独立 SEED 初始化参照 → 结果与解释边界 → 技术证据。
完整重构能力探索入口、Mechanism-1.0 和 M1-D 结果区，中英文同步。枚举能力探索全部 13 个中文源路由及英文对应路由；关联页面补齐共享背景、职责和返回主线入口。全站其他模型、论文、工作台不冒称已经完成阅读测试。
原研究记录保留：Ceiling 数据、原预注册、预算、final-panel 边界、M1-D 四个发布条件。此任务不申请 GPU、不运行训练、不调用教师模型、不创造实验授权。

## 技术细节

1. Astro 静态优先，沿用 native CSS/tokens。一个 H1；短主题标题；正文先具体对象后术语。
2. 生命周期包含 `id/question/start/action/stop/output/state/source`；中英文非空。组件直接消费，不让合同仅留在文档。
3. 主线真实分支：M1-A/B 检查行为因果，M1-C 须过预注册条件且独立授权；M1-D 是独立初始化参照，不是第四步。
4. M1-A 原末段两个锚点相同，零向量使方向不可识别。这不是因果零效应。保留原预注册，投影相邻且互异接受状态的独立 successor。
5. 语义 HTML 节点和 SVG/CSS 连接线表达关系；交互只突出步骤解释，不伪装实时进度。无 JS 时主线完整；减少动画模式不丢信息。
6. 手机纵向重排；必要正文不依赖横向滚动。技术对照表允许局部滚动。正文颜色和行高优先保证可读。
7. 授权、实际运行、封存、科学结论分开。时间显示为有来源的发布快照；没有实际起止时间就写未提供，不编 ETA/百分比。
8. 复用既有 Vitest/Playwright gate，加入缺字段、来源、依赖和状态误判负例；实际路由必须被测试选中。
9. 原子提交和一次 exact-head Preview；先本地 preflight，之后 CI 和 Preview 浏览器。合并和 Production 单独验收。

## 交付标准

| 项 | 标准 | 证据 |
|---|---|---|
| R1 | 无需术语表即可解释购物任务和研究目的 | 首屏和无 JS 检查；冷读逐问作答 |
| R2 | 每个实验有可见开始、结束、产出、状态 | 类型/运行时校验、缺字段负例、渲染可见性 |
| R3 | 主线、条件分支、独立参照关系清楚 | DOM 和连接图检查；静态与交互对照 |
| R4 | 授权不冒充运行；未封存不冒充零分；不可识别不冒充因果零效应 | 科学来源及状态反例测试 |
| R5 | 主线不依赖折叠和动画 | 禁用 JS、减少动画、键盘展开检查 |
| R6 | 中英文、亮暗、390/768/1440 宽可读 | Chromium + WebKit；核心文字无裁切、页面无溢出 |
| R7 | 改动在实际浏览器可达 | 改前/改后截图；agent-browser 交互 |
| R8 | 重复问题有可执行防护 | 负例失败且测试接入既有 gate |
| R9 | 新旧事实、预算及发布条件可追溯 | 固定上游 SHA，局部证据，旧设计保留 |
| R10 | 验收属于精确代码树 | HEAD/base、CI、Preview、合并、Production 分层记录 |

自动化只能证明必要信息可见且未发生结构退化，不能替代真人理解测试。冷读走查记录答案位置；不虚构同学/老师受试者或通过率。

## 执行清单

- [x] 独立 worktree；保留原工作区未提交文件。
- [x] 核对示例部署、现行规范和源码，取得改前桌面截图。
- [x] 找到旧读者前提、生命周期和验收代理的缺口。
- [x] 在修改代码前写出本计划和交付标准。
- [x] 核对固定科学来源及 M1-A successor。
- [x] 枚举关联路由和职责：13 个中文源路由，13 个英文对应路由。
- [x] 实现共享任务背景和生命周期合同。
- [x] 重构机制主线、分支、M1-D 结果区。
- [x] 修复入口和关联路径的背景/导航。
- [x] 更新现行规范；加入语义、负例和浏览器回归。
- [x] 冷读逐问走查，记录答案位置；未冒称真人理解率。
- [x] deterministic / build / UI preflight 通过：509 项 Vitest + 358 项 Chromium/WebKit，retries=0。
- [x] exact-head Preview 中英文实际浏览器验收：`941cd336f25ff9db3007bce512300838e976b6ef` / `dpl_3vvb9T5druXKa5H7cazbWH41NttX`。
- [x] 独立 PR #499、三项 CircleCI required checks、Vercel Preview Comments 与 base 漂移复核全部通过。
- [x] PR #499 合并为 `35f08d2d233e5a2a3545845d2978165d1cfd2cce`；Vercel Production `dpl_4wpTGYmYCpdYJ2qZavy1Fq9r7tcs` READY，并完成真实公开路由验收。

## 验收记录

最终完整 `npm run preflight:ui`：PASS。Node 24.20 / npm 10.9.2；单 Playwright worker；retries=0；Chromium 和 WebKit 均实际启动。

| 验收层 | 结果 |
|---|---|
| `verify:deploy` | PASS；结构性测试 472，行为测试 37，共 509 项 |
| `build` | PASS；最终组合树 478 个静态路由各一个 H1；3,974 个 GitHub/HF 外链品牌标记通过 |
| `ui:overflow-preflight` | PASS；390 / 768 / 1440 宽 |
| `test:ui:all` | 最终组合树 358 / 358 PASS，7.6 分钟，零重试 |
| 冷读与实际浏览器 | 本地中英文结构和交互走查；下方保留逐问答案位置；不是受试者实验 |
| exact-head Preview | `941cd336...` → `dpl_3vvb9T5...` READY；中文/英文 390px、暗色模式、1440px lobby 均实机走查，无页面级横向溢出 |
| PR CI | PR #499 current-base merge candidate；deterministic + browser shard 1 + browser shard 2 全部 SUCCESS，Vercel Preview Comments SUCCESS |
| merge | `35f08d2d233e5a2a3545845d2978165d1cfd2cce`；expected-head 锁定 `941cd336...` 后 merge |
| Production | `dpl_4wpTGYmYCpdYJ2qZavy1Fq9r7tcs` READY，source commit=`35f08d2d...`；post-merge 三项 CircleCI 全 SUCCESS；稳定入口真实浏览器复核 PASS |

第一轮完整验收完成后，main 继续前进。最终发布前的 current base 为 `76d93d1012ee1f5e7247554023e0804169080077`（#497，只新增中英文 development workflow 页面）。实现分支通过两父 merge commit `941cd336f25ff9db3007bce512300838e976b6ef` 纳入该 base；无冲突，并在**合并后的完整组合树**重新运行 `preflight:ui`，再次得到 358 / 358 Chromium + WebKit PASS。随后 exact-head CircleCI / Preview 全绿才合并。

## 参考

- W3C Make Each Step Clear: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p04-clear-steps/
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- 当前 owner：website-design-spec、research-site-presentation-contract、human-thinking-web-expression-contract、ui-change-visual-acceptance-gate。

## 路由范围清单

完整重构与背景补齐分别记录；背景补齐不冒称重写了全部历史正文。

| 路径（相对 capability-exploration） | 范围 | 语义所有者 |
|---|---|---|
| `/` | 主文重构 | `OpenEvoCapabilityMapLobby` |
| `mechanism-1-0` | 主文重构 | `OpenEvoMechanismMap` |
| `first-run` | 背景、职责和返回主线入口 | `OpenEvoFirstRunMap` |
| `openevo-2-0` | 背景、职责和返回主线入口 | `OpenEvoRedesignMap` |
| `openevo-2-0/exploration` | 背景、职责和返回主线入口 | `OpenEvoSuccessorExplorationMap` |
| `openevo-2-0/report` | 背景、职责和返回主线入口 | `OpenEvoSuccessorReport` |
| `openevo-2-0/harness-2-0` | 背景、职责和返回主线入口 | `OpenEvoHarness2MiniStudy` |
| `stage1-evolution` | 背景、职责和返回主线入口 | `OpenEvoSuccessorExplorationMap` |
| `stage1-previous` | 背景、职责和返回主线入口 | `OpenEvoLegacyStage1Archive` |
| `stage2-256-window` | 背景、职责和返回主线入口 | `OpenEvoLegacyStage2Archive` |
| `stage2-7b-analysis` | 背景、职责和返回主线入口 | `OpenEvo7BStage2AnalysisMap` |
| `stage2-ceiling` | 背景、职责和返回主线入口 | `OpenEvoCeilingStrategy` |
| `archive` | 背景、职责和返回主线入口 | `OpenEvoExperimentArchive` |

## 验收中发现并修正的旧代理指标

- 旧浏览器断言要求整个 Mechanism 页面没有“执行仍锁定”，把 M1-D 的独立授权错误外推给 M1-A/B/C。改为逐个实验检查执行状态，并增加无授权却标记运行的失败用例。
- 旧入口断言锁定英文混排文案“当前 successor”，不检查读者含义。改为中文“独立的新一轮设计”、模型规模与真实目标路由，保留独立谱系和导航合同。
- 第一次完整 preflight 的 deterministic、build 和 overflow 已通过；浏览器在上述旧文案断言停止，55 项通过、302 项未运行，未将此轮记为验收通过。

## 冷读走查（Agent 逐问定位，不是受试者测试）

| 新读者的问题 | 可从网页直接得到的答案 | 可见位置 |
|---|---|---|
| 模型在做什么？ | 在模拟商店读取页面、搜索、选择规格并购买；整段记录才算一次尝试。 | 首段与“模型的购物任务”四步图 |
| 为什么研究它？ | 检查学习留下的参数变化是否造成特定的行为变化，而不只观察数值大小。 | 首段与“从观察参数到检验作用” |
| 哪些事现在已经做完？ | 网站记录 M1-D 执行授权，结果未封存；A/B/C 仍有独立限制。没有已核验的实际开跑/结束时间。 | 首屏发布快照与时间说明 |
| 什么时候开始？ | 各项先满足相应身份、数据、方向或门槛条件，再独立授权；D 不替 A/B/C 授权。 | 每项“开始条件”与依赖图 |
| 什么时候结束？ | A 身份/方向检查失败即 0 次任务停止；否则最多 576 次。B 最多 448；C 门槛未过则不启动，启动后固定 1,536；D 固定 1,440 加全部事后分析封存即停。 | 每项“结束条件” |
| 下一步为什么依赖前一步？ | A 修订结果优先、B 第一组变化备用；方向特异信号达门槛且另获授权才做 C。D 是独立初始化参照。 | 分支图、可见门槛和独立支线 |
| 没有分数是不是零分？ | 结果未封存，不能发布分数；原 A 不可识别也不是有效负结果。 | M1-D 结果状态和原 A 处置说明 |

## 基线刷新与测试解释

初始基线为 `a0d718346e37a0e05d78d58981e94c039d95ad3f`；独立分支已快进到经 GitHub 核对的 `349655bbc384b80ef8f89e3621469d4b5d8a3be3`。6 个中间提交属于 CI/docs 合同和经验记录，没有改动这些页面的运行源码。新的 deterministic/完整浏览器验收在合并这些基线规则后重跑。

一次 HTTPS fetch 发生连接超时；没有将其解释成鉴权失败。远端 SHA 已通过独立读取确认，本地快进结果也按完整 SHA 核对。后续复合命令使用显式 Bash 和 fail-fast；不把共同 origin 引用当作独占锁。

专题浏览器首轮 138/140 通过，两个失败来自同一新增测试混用了 innerText 与 textContent 的空白语义。已改为同一可见文本读取方式的严格前后相等比较，没有放宽产品行为要求。

减少动画检查同样使用行为条件：全站样式有 `.01ms !important` 的时长兜底，故时长字符串 `0s` 并不是组件“无动画”的正确代理。组件维持 `transition-property: none`；测试同时要求没有活动动画，保留原全站样式所有权，不增加覆盖补丁。

## 发布地址与验收身份

用户提供的是某次提交的固定 Vercel deployment URL，不会因后续提交自动更新。验收使用新提交对应的 Preview；正式发布后检查稳定入口 `https://basemodel-preview.vercel.app`。具体提交和部署状态分别记录，避免把旧页面缓存与新代码混为一谈。

依据：Vercel generated URLs 文档 https://vercel.com/docs/deployments/generated-urls 。临时 Preview share 参数只用于会话审阅，不进入本文件、代码或 PR。

## 最终发布收口

- 实现 PR：[#499](https://github.com/mykcs/basemodel/pull/499)。
- 最终接受 head：`941cd336f25ff9db3007bce512300838e976b6ef`；接受 base：`76d93d1012ee1f5e7247554023e0804169080077`。
- exact-head Preview：`dpl_3vvb9T5druXKa5H7cazbWH41NttX`，READY。
- merge commit：`35f08d2d233e5a2a3545845d2978165d1cfd2cce`。
- Production：`dpl_4wpTGYmYCpdYJ2qZavy1Fq9r7tcs`，READY，stable alias=`https://basemodel-preview.vercel.app`。
- post-merge CI：`ci/circleci: deterministic`、`browser_shard_1`、`browser_shard_2` 全部 SUCCESS。
- Production 实测：中文 Mechanism 390px、暗色 390px、英文 Mechanism 390px、中文 capability lobby 1440px 均无页面级横向溢出；Mechanism 中英文各只有一个 H1；中文页可见购物任务解释；canonical 指向稳定 Production 域。
- GitHub review threads：0；Vercel unresolved toolbar threads：0。

本文件的“完成”指**网站工程与发布链路完成**。它不伪造“真实同学/老师理解率”。如果未来真实读者仍产生关键误解，应把具体误解转化为同一语义 owner 下的页面修复和可判别回归，而不是再增加一套平行规范。

后续 main 可以继续产生与本功能无关的 docs-only commit；这不把 Production runtime identity 改写成那些 docs commit。网站运行版本、Git main 版本、实验科学证据版本始终分别记录。

## 2026-09-07 统一读者体系收敛

并行实现收敛后，只保留一套 canonical reader system：#499 已有的 WebShop 任务背景、13 条 capability route context、typed lifecycle 与 M1-A successor 科学修订继续作为事实和生命周期所有者；新增的 `ResearchOrientation`、`ResearchJourney`、`ResearchDepth`、`ResearchStateRail` 只负责阅读层级，不复制科学状态。

### 增强后的页面合同

- 六个主阅读页面第一屏固定回答：研究问题、为什么重要、从哪里开始、什么时候结束、当前状态。
- 顺序性研究必须用 3–6 步的语义旅程表达；依赖、GO/NO-GO 和 STOP 不能只藏在段落里。
- 授权、实际运行、结果封存、科学结论继续由 typed lifecycle 分开；阅读组件不得自行推断或改变状态。
- WebShop 任务背景继续由 `ResearchTaskContext` / `ResearchRouteContext` 提供，避免新读者先遇到项目缩写。
- 深层 provenance、完整诊断历史和运行细节使用命名 disclosure；核心结论不依赖展开或 JavaScript。

### 量化验收

- `ResearchOrientation` 的五个字段必须在源码与浏览器回归中可检测。
- capability 主线、first-run、Mechanism、successor report / exploration 必须保留显式 journey 或线性 argument。
- 1280×633 桌面首屏要求 orientation 完整落在首屏；中英文分别验收。
- 390 / 768 / 1280+ 宽度、light / dark、reduced-motion、全部 disclosure 展开状态均不得产生页面级横向溢出。
- 旧卡片“默认全部可见”不再是验收代理；正确契约是摘要默认可见，展开后证据完整、键盘可达、无 JS 时核心含义仍成立。

这部分是 #499 任务记录的后续收敛，不创建第二套长期规范；长期约束仍由现有 website / research presentation owner 文档和可执行测试共同持有。


## PR #516 统一实现的历史发布凭据

这是对既有 #499 记录的追加，不覆盖其当时的范围与结果，也不表示今天的实时部署版本。

- 实现：[PR #516](https://github.com/mykcs/basemodel/pull/516)，最终接受 head `ec95f1d5c46f06dce77a457728b63711f1f5e04a`，base `bcc9b9ae9966a131f9b4fd444dbd2e0b3e85cba0`，merge `859c74d07a546f7473b1536994ff4b4b769a93ee`。
- 首次 Preview 为 `dpl_Genj3gRtxzEAhYYp9YxYf2xSrA8Z`；独立 base 更新后，最终 exact-head Preview 为 `dpl_8Sty3mWcCSLo6ThA4h7TiSZGYCyQ`。实际是两次 Preview，不把“一次 Preview”的计划改写成完成事实。
- 对话中的 Production 回执为 `dpl_2cp2BZcpLRsbybihkhJuZn3Bnu3E`，绑定上述 merge 并通过稳定域页面回查；合并后 deterministic 与四个 browser shard 均成功。这里是当时回执，不承诺此部署仍是最新。
- 本地统一树完成 `verify:deploy`、184 项 canonical Chromium 与 74 项 reader Chromium / 74 项 reader WebKit。计数归属当时树/套件，不是永久验收数量，也不证明真人理解率。
- WebKit 首轮 73/74，英文入口 orientation bottom 为 638.390625px，阈值为 635px（633px 视口加既有2px容差）。通过缩短英文重复文案修复；未减小可读字体、未放宽阈值。后续完整74项重跑通过。
- 桌面五问首屏通过；手机暗色回查只有“无横向溢出”的证据，中文/英文 orientation 曾高于844px，不能写成手机五问也都在第一屏。
- 主阅读层迁移覆盖入口、first-run、Mechanism、successor gateway、report、exploration；保留其他历史页面的背景入口，不声称13条路线全部重写正文。

完整对话的新增反例、重复犯错分析与记忆写入边界追加在 [既有经验案例](2026-09-07-reader-journey-experience-retention.md#8-完整对话的增量复核)，不新建平行规范。
