# Reader attention contract 与 Apple cognition 经验沉淀

记录日期：**2026-09-07**
状态：**historical causal record; not current scientific/runtime/deployment authority**
当前规则 owner：`docs/agents/current/site-reader-attention-contract.md`、`ui-design-principles.md`、`website-design-spec.md`、`website-copy-cases.md`

## 1. 这次对话真正解决了什么

这次工作不是一次“把页面改漂亮”的 UI 调整。它从一个非常具体的真人反馈开始：first-run 页面标题 `第一轮购物学习：7B 与 3B 的分岔` 和 `HISTORICAL MAP · FIRST RUN` 会迫使读者先解码作者的叙事包装，而不是直接理解实验事实。

第一次修复让文案更字面、更像人话；owner 随后继续指出：页面虽然“好多了”，但仍然不能让人第一眼抓住重点，也缺乏继续读的欲望。owner 提到 Apple 后，又明确纠正了一个容易发生的误读：不要复制 Apple 的大字、留白、圆角和 marketing hero，而要学习其关于 visibility、mental model、grouping 与 progressive disclosure 的认知设计哲学。

最终交付因此升级为两层：

1. **页面层**：首屏按真实读者注意力重排；CASE-067/068 进入真人反馈案例库；高置信 sibling 同步修复。
2. **仓库层**：PR #545 把这套原则做成 50 个公开 page-source pattern 的 executable Reader Attention Contract；没有 contract 的新公开页面 fail closed。

本文件只保留“为什么之前看起来合理的做法会失败”和“未来 Agent 怎样避免复发”。当前页面实现、当前路由、当前 CI/provider 状态仍以 executable repository / live provider truth 为准。

## 2. A / B / C 信息分层

### A — 长期稳定规则

- **人的注意力是预算。** 零项目上下文读者应先认出对象，再看到一个最重要事实；首屏通常只有一个主要认知中心。
- **exactly enough，不是 minimalism。** 可后置的是重复 orientation、术语、长日志和诊断历史；会改变结论、操作安全或下一步的 caveat 必须留在默认可见层。
- **设计参考先抽认知原则，再谈视觉。** owner 点名 Apple 等参考对象时，优先读取其第一方设计/开发材料；不要把著名网站的表面特征拼成 mood board 后称为“设计哲学”。
- **真人反馈不是禁词表。** 当前案例 + 至少两个同类/相邻案例先组成 case cluster，抽象失败机制和反边界，再扫描 sibling/shared owner。
- **重复出现的问题要进入 executable guard。** Markdown 规范只能解释；可机械检测的 invariant 应进入 schema、registry、audit、test 或 fail-closed runtime owner。
- **仓库知识、ChatGPT 长期记忆和对话总结是三种不同 receipt。** 修网页不能用“更新记忆”替代；写仓库也不能冒称账户长期记忆已更新。
- **Bash 语义必须显式指定外层 Bash。** `VAR=value`、`set -euo pipefail`、数组、heredoc 等不能假设远程默认 shell 是 Bash。
- **不要猜本地 repo 路径。** 多 clone/worktree 场景先发现 repo，再记录 root / branch / HEAD / dirty state / intended ref；熟悉的路径名不是 authority。

### B — BaseModel 项目级经验

- `src/data/siteReaderContracts.ts` 是当前公开页面 reader-task registry；`AppLayout` 对缺失 contract fail closed。
- 公开页面分成 focus / choice / reference / operational / narrative / comparison，是认知责任分类，不是六套视觉模板。
- `/study/design/` 这类兼容旧 URL 只能声明 redirect owner；不能把 compatibility route 当第二份正文 owner。
- capability/Results family 的科学 caveat（例如 external reference 与本地 matched comparison 的区别、开始/停止/授权状态）不能因首屏精简而隐藏。

### C — 临时状态，刻意不提升

本次对话中出现的临时 branch/head、PR 一时的 mergeability、CircleCI pending 时长、Vercel deployment ID、临时 Preview share URL、local PID、临时 worktree 路径、某次浏览器像素位置都只用于历史重建，不是未来默认事实。

这次没有进行 GPU 分配、实验恢复、Docker 变更、服务器文件删除或 scientific authority mutation。因此不能为了“完整 retrospective”虚构服务器/GPU事故；相关长期规则仍由仓库已有 server/experiment runbook 持有。

## 3. 历史主线：从一句真人反馈到可执行契约

1. owner 明确指出 first-run 的 `分岔`、`路径分叉` 和装饰性英文 eyebrow 增加无用联想，并要求**实际改仓库 + 写案例库**，而不是更新 ChatGPT memory。
2. literal-copy 修复不只改一个词；CASE-067 抽象成“真实实验对象和事实先于叙事隐喻”，并扫描同类 H1/lede/shared owner。
3. owner 认可页面“好多了”，但继续指出首屏仍有太多正确但等权重的信息；这暴露出“文案自然”与“注意力层级正确”不是同一件事。
4. Agent 起初容易把“仿 Apple”理解成首屏营销式重排；owner 再次纠正：真正问题是读者注意力极少，要学习 Apple 第一方设计哲学，而不是视觉皮肤。
5. PR #544 把 first-run、3B/1.7B sibling 改成 attention-first，同时保留机制页等 intentional exception；CASE-068 和 UI current owner 随之建立。
6. owner 继续追问“其他页面是否也改”和“以后怎样保证”。问题由单页重构升级为**未来页面 governance**。
7. PR #545 新增 50 个 public page-source Reader Contract、fail-closed AppLayout、静态 audit 和 desktop/phone browser matrix，并在真实 Gate 中修复既有违规页，而不是降低阈值。
8. #545 在 #536 已合入的新 main 上完成同步、required checks 和 Production closeout；旧 #542 没有被顺手吸收，因为它当时已经对新 main 产生独立整合问题。

## 4. 摩擦矩阵：发生了什么、为什么、下次先查什么

| 摩擦 | 当时发生了什么 | 错误假设 / 缺失上下文 | 下次操作前检查 | 防御性规则 | 看似合理但错误的做法 |
|---|---|---|---|---|---|
| 把真人反馈误归为 memory 工作 | owner 一开始就纠正“不是更新 ChatGPT 记忆，是解决网页并写仓库案例” | 把“希望以后记住”与“当前产品要修”混成同一任务 | owner 是否明确要求 repo implementation、case deposition、memory persistence 中的哪一种 | 三种 receipt 分开完成；产品修复不能由 memory 替代 | 回复“我会记住以后不用分岔”却不改页面/仓库 |
| 只替换 `分岔` 两个字 | 单点修复会留下 `路径分叉`、英文 eyebrow、同类 sibling | 把用户给的例子当词表，而不是失败机制样本 | 当前案例 + 邻近案例；共享 owner；H1/lede/status/table 等语义位置 | case cluster → 规则 + 反边界 → sibling scan → guard | 全局禁用 `fork`，连真实 checkpoint 分组也删掉 |
| “学 Apple”被浅化成 marketing hero | 初始方向容易变成大标题、留白、CTA | 把品牌视觉外观当设计哲学 | 第一方 design/developer material；读者 mental model；第一任务 | 设计参考先解释人的感知/决定/推进，再决定 HTML/CSS | 抄 Apple 圆角/大字后说“更高级、更简洁” |
| 文案自然了但仍没阅读欲望 | CASE-067 后读者仍要在五问、背景、术语中自己找重点 | “每块都正确”被误当“页面层级正确” | 首屏有哪些竞争中心；读者 5–10 秒能否复述对象/结果/下一步 | 一个首屏通常一个主要理解任务；次要复杂度后置 | 把五个正确字段做得更漂亮，但仍全部首屏等权 |
| Progressive disclosure 过度 | 简化很容易把科学 caveat 一起塞进 `<details>` | “减少首屏信息”被误读成“隐藏所有复杂内容” | 哪条信息会改变结论或下一动作 | claim-changing caveat、比较双方、授权/停止/失败边界保持可见 | 把 “SEED 只是外部参考”藏进术语说明 |
| 按组件外观传播修改 | 同一个 `ResearchOrientation` 有不同 reader task | 共享组件被误当成共享认知语义 | 每个消费者的 primaryTask / attentionMode / scientific boundary | 按 reader task 分类，保留 intentional exception | 六个调用点全部强制 `layout="focus"` |
| Gate 一加就暴露旧页面违规 | 新 reader matrix 发现 Flow H1 隐藏、Results 先显示 chooser、Stage2/Ceiling 先显示策略控件 | 新 contract 被当成只约束“未来页面” | 先让 Gate 跑现有样本，区分 test bug 与真实 hierarchy bug | 新规则首先 red-team 现存页面；实现违规就修页面，不降 Gate | 因为“旧页面以前通过”就给它永久豁免 |
| `compact` 把唯一 H1 隐藏 | Flow overview 为了省空间隐藏 identity copy | compact 被等同为“隐藏主语义” | 页面是否仍有唯一可见 H1；首屏是否先认出对象 | compact 只能降低次要密度，不能移除页面身份 | 用 `display:none` 隐掉 H1，再靠导航猜当前页 |
| 控件/警告跑到结果主体前 | 历史四组 Results、旧 Stage2、Ceiling 的 chooser/warning 先于 H1 | “操作控件重要”被误当“比页面对象更重要” | 首屏 DOM 顺序和 visual order；primaryTask 是选路还是看结果 | focus/result 页面先给对象与结果，再给策略/筛选 | 把历史方法选择器放最顶端，因为它能交互 |
| WebKit 比 Chromium 更晚看到 H1 | Harness hero 使用 `align-items:end`，右侧状态较高时把左侧标题推低 | 一个浏览器通过被当成布局普遍成立 | Chromium + WebKit；真实 1280×633 / 390×844 bounding geometry | 信息层级 Gate 必须跨浏览器；修布局几何，不改容忍线 | Chromium 绿后删掉 WebKit first-screen gate |
| 兼容跳转被当独立内容页 | `/study/design/` 已变成指向 Flow anchor 的 compatibility URL；E2E 最初仍要求旧页 contract/H1 | URL 存在被误当语义 owner 仍存在 | canonical owner、redirect target、fragment landing、target contract | compatibility route 显式 `redirectsTo`；验收目标 owner，不制造第二套正文 | 给旧 redirect 页再写一份“精简设计说明”让测试好看 |
| 修 Flow identity 后出现 CJK rail | 恢复主 hero 后 4 列对象卡在 split layout 变得过窄 | “H1 回来了”被误当整页几何安全 | layout anomaly / CJK line width / desktop+tablet | 修共享布局比例或列数；不要把中文正文压成窄竖条 | 降字号、硬断行或放宽 CJK anomaly gate |
| 英文首屏比中文多溢出 | attention-first 英文事实句换行更多，1280×633 首屏约束先失败 | 中文几何被误当英文几何 | zh/en 两套实际文本长度和 viewport | 保留语义，改善信息几何/措辞长度；不放宽 first-screen contract | 删除英文 caveat 只为了让首屏变矮 |
| Preview 受 SSO 保护 | Vercel Preview READY，但直接浏览器/抓取会被登录保护挡住 | auth challenge 被误读成应用失败，或 READY 被误读成视觉验收 | deployment object、bound SHA、Protection、已有本地/browser evidence | Provider health、访问权限、视觉 acceptance 分层；不要为自动化关闭保护 | 看到 302/登录页就回滚应用，或反过来说“READY 所以视觉也通过” |
| `main` 在工作中前进 | #539、#536 等并行工作改变 base，旧 exact-head evidence 不再自动覆盖新树 | 一次绿色验收被当成永久证明 | current `main`、intervening PR、changed paths、semantic owners | material base drift 后重建组合树并重跑受影响 Gate；不 force-push 覆盖别人 | 把旧 Preview 截图当新 base 的合并证据 |
| 并行 PR 形成重复方案 | first-run 修复曾出现 #537/#538 等相近实现 | “两个都对”被误当“两个都该保留” | diff、case/library owner、page coverage、tests、current main | 选一个 canonical，吸收另一边有价值的增量，关闭重复线 | 为避免冲突让两个 PR 永久并行维护同一页面规则 |
| 本地主 checkout 有无关改动 | 主目录处于另一分支且 `package-lock.json` dirty | 熟悉的本地 clone 被当安全工作区 | branch、HEAD、dirty state、remote base | 不清理/覆盖未知改动；从 exact remote base 建隔离 worktree | `git reset --hard` 只为了“让环境干净” |
| 先猜了不存在的 repo 路径 | 直接 `cd` 到一个猜测的本地 checkout 路径，失败后才搜索真实 clone | 习惯路径被当成环境事实 | repo discovery / `git rev-parse --show-toplevel` / multiple worktrees | 路径未知时先发现再 mutation；路径不是 authority | 路径不存在就推断 repo 没有 checkout 或连接坏了 |
| Retrospective 自己再次触发 Fish/Bash | 本次沉淀的第一条 compound shell 命令又在默认 Fish 下使用 `ROOT=...` | 已写规则被误认为会自动执行；bootstrap 之前就开始 mutation/discovery | 工具外层 `shell` 参数；下一条命令的真实 interpreter | REPEAT-CORRECTION 必须落到下一次 tool call；本次随后显式 `/bin/bash` | 再写一篇 Fish 文档，但下一条命令仍不指定 shell |
| 文件读取超时 | 读 `LATEST.md` 的一次文件工具调用超时，随后用安全 `sed` 路径成功 | 单一路径失败被当成 capability 缺失 | child/process/alternate owner-appropriate read path | 一次工具超时不是“文件不存在/能力不可用” | 因一次 timeout 改权限、换凭据或宣布 blocked |
| Git push transport 失败 | retrospective 同步到新 `main` 后，HTTPS push 先遇到 HTTP/2 framing failure，重试又遇到连接超时 | 把一个传输路径失败误当成仓库不可写，或为了省事回到旧绿 head | durable local tree、remote branch head、可用 GitHub connector/Git Data API | 传输失败先保留 exact tree；用安全的 owner-appropriate alternate path 发布，并校验远端 tree SHA 与已验证本地 tree 相同 | 因 `git push` 失败就宣称 blocked，或 force-push 旧分支跳过 moving-main 整合 |

## 5. 思维与科研表达上的关键纠正

### 5.1 “更容易读”不能以改变科学语义为代价

attention-first 不是删除证据。科学网页必须同时满足两件事：读者能快速形成正确 mental model；更深层证据仍能完整恢复，而且会改变结论的边界保持默认可见。

因此同样是“复杂信息”，处理方式不同：

- `SEED 论文值只是 external reference，不是本地 paired rerun`：会改变因果解释，必须可见；
- `Stage 1/2` 的定义、旧 run ID、完整 archive hash：通常可以第二层解释；
- mechanism 页的 start / stop / authorization：它们本身就是科学对象，不能因为别的 result 页用了 focus hero 就折叠；
- `not run`、`held`、`measurement-invalid`、`valid negative` 不能被统一成一个灰色“未通过”。

### 5.2 “一致的设计语言”不是“所有页面长一样”

真正要统一的是：读者先知道什么、控件为什么存在、视觉强调是否对应语义权重、科学边界是否可恢复。focus / choice / operational / narrative 等 attention mode 允许不同结构。一个统一模板如果抹掉 page-specific reader task，反而违反设计系统。

### 5.3 设计参考应该回答行为问题

当 owner 说“像 Apple”，Agent 应先追问/推导：这里真正想借鉴的是怎样分配注意力、怎样让新人建立 mental model、怎样用 progressive disclosure 控制复杂度。只有这些原则明确后，才决定字体、布局、卡片、动画。不能把品牌识别元素当成研究页面的目标函数。

## 6. 重复犯错检查：哪些问题以前已经总结过

至少四类不是第一次出现：Fish/Bash、moving main / exact-head evidence、可读性修复只停留在 prose、provider READY 与真实 acceptance 混淆。历史文件已经写过，根 `AGENTS.md` 甚至已经有 shell 和 moving-main guard。

它们仍会回来，不等于“还缺一篇更长的规范”。这次暴露出四种不同断点：

1. **retrieval 断点**：规则在 history/current 中，但任务入口没有把最相关 owner 提到足够近的位置。#545 之前 `site-reader-attention-contract.md` 主要靠 scenario trigger 发现；本次把它再路由到 root、docs/agents/README 和 research-local AGENTS。
2. **abstraction 断点**：最初把 `分岔` 当成词问题、把 Apple 当成视觉问题；真人反馈需要 case cluster 才能抽出“额外解码成本”和“注意力竞争”这两个真正机制。
3. **enforcement 断点**：早期已有“说人话”“reader-first”规范，但没有任何东西阻止未来新 page source 没有 reader task。#545 用 registry + AppLayout + audit + browser matrix 补了这一层。
4. **use-site execution 断点**：Fish/Bash 规则已经在 root，但本次 retrospective 第一条命令仍没有显式 shell。这不是规则缺失，而是下一次 tool call 没有 witness。继续堆 shell 文档不会解决；必须让第一条 compound call 本身带 `/bin/bash`。

因此本轮的信息层级调整是：

- 已经成熟的长期规则留在原 owner，不复制；
- root / task router / local AGENTS 只增加最短发现路径；
- executable invariants 继续由 #545 的代码与测试持有；
- 本文件保存因果经过、反例和失败分类；
- 临时 PR/provider/PID 不进入 current policy 或 memory。

## 7. 本次沉淀实际提升到 current owner 的增量

这次没有重写 CASE-067/068，也没有新建第二套 reader 规范；它们已经在 main 中承担当前行为。新增的 current-level delta 只有这些：

- root `AGENTS.md`：把 `site-reader-attention-contract.md` 提到 user-facing startup 路径；并把“第一次 compound shell 调用就显式外层 Bash”放到 Fast start 前置提示。
- `docs/agents/README.md`：把 Reader Attention Contract 加入所有 public-page bundle 和 writing-stack ownership table。
- `src/components/research/AGENTS.md`：research use-site 明确要求先解析 `src/data/siteReaderContracts.ts`，再设计 HTML，而不是反向 retrofit。
- `ui-design-principles.md`：参考 Apple 等设计系统时先读第一方设计哲学、抽 cognition，再决定视觉；禁止 generic famous-site mood-board shortcut。
- `project-agent-operating-principles.md`：本地路径未知或存在多 clone/worktree 时先 discover repo，再记录 root/HEAD/dirty/ref；不猜路径。
- `scenario-trigger-registry.md`：live-page feedback 明确是 product/repo implementation trigger，不能用 memory update 替代；并索引本历史案例。
- 文档发现/研究发布测试：保护 Reader Attention Contract 从 root/router/research-local 三层可发现，并保护 retrospective trigger 的 memory/repository 分界。

`LATEST.md` 没有因为本次 retrospective 被刷新：它承担短期 scientific/deployment handoff，本次新增的是长期网站/Agent规则。把 #545 的历史 PR 状态塞进 LATEST 只会让另一个职责 owner 更快过期。

`website-copy-cases.md` 也没有再新增重复 CASE：CASE-067 已持有“分岔/英文 eyebrow”，CASE-068 已持有“Apple cognition / attention budget / exactly enough”。再造 CASE 只会把同一真人反馈拆成多份互相竞争的判例。

## 8. 长期记忆提炼边界

### 适合未来真实 memory-write 接口的候选

- owner 对科研网页的稳定偏好是：中文、零项目背景、注意力极少的读者也应能快速抓住真实对象和最重要事实；
- owner 不希望“模仿 Apple”被处理成视觉皮肤或市场营销；应优先学习第一方设计哲学和认知原则；
- 真人反馈应实际修改产品、案例库、同类页面和 regression guard，而不是只回复“记住了”；
- 重复纠错应修 shared owner / executable contract，而不是继续叠一次性 patch；
- repository persistence、scientific evidence、provider acceptance、real-human comprehension 和 account memory 要分别给 receipt。

### 本次实际账户级写入

**0 条。** 当前运行环境没有可调用的长期记忆写接口；因此没有把仓库 commit、personal-context/search、对话总结或本 retrospective 冒称成 ChatGPT account memory update。

这是一条当前工具边界，不应永久化成“ChatGPT 永远不能写 memory”。未来若出现真实 memory-write capability，必须重新核对当时能力，并只写 A 类稳定偏好；不得写当前 PR、GPU、PID、round、provider 状态等 C 类信息。

## 9. 历史真实性与 bounded receipts

本次相关的已合并主线节点包括 #538（literal first-run/capability copy）、#544（attention-first capability pages）、#536（Training Design 归入 Flow）和 #545（sitewide Reader Contract）。这些 PR/merge SHA 只用于重建 2026-09-07 的因果顺序，不是未来 current authority；未来应重新读取 `main`。

#542 在 #545 closeout 时仍是独立、需要重新整合的 Results 变更；没有为了得到“漂亮历史”把它写成已经被 #545 吸收。compatibility Training Design URL 的旧身份也保留：它曾经是独立页面，#536 之后才变成 Flow owner 的兼容跳转。

本 retrospective 自己的发布阶段连续复现了 moving-main。第一次是 #547 的初始 exact head 已经拿到 required CI 绿灯后，#542 才合并进 `main`，使 #547 从 CLEAN 变成 DIRTY；处理方式不是拿旧绿灯强合，而是显式把新 `main` 合进候选树，保留 #542 新增的 CASE-069–071 / Results reader rules 与本次新增的 attention/use-site rules，并重新运行 `verify:deploy`。随后 #541 又在新的 retention PR 打开后合并，改变了 root `AGENTS.md` / docs routers / Vercel docs-only production-isolation contract；因此候选树再次显式吸收 #541 的“root 唯一 bootstrap + router 只负责导航 + Agent-control docs 不触发网站 Production”边界，再对新的 exact tree 重新验证。两次事件都证明：**green once 不是 material base drift 之后的继续授权**。

本次 retrospective 现场又出现一次 Fish parser failure，这个事实保留，因为它证明“规则已写”仍可能在 use-site 失效；随后命令显式改用 `/bin/bash`。没有把 parser failure 说成 Git、服务器或仓库故障。

最终发布时，普通 Git HTTPS push 又连续遇到 HTTP/2 framing failure 与连接超时。这里同样没有把单一 transport failure 升级成“GitHub 不可写”：保留已经通过 `verify:deploy` 的 integrated local tree，改用已授权 GitHub Git Data API 从当前 `main` 构造提交，并要求远端 tree SHA 与本地已验证 tree SHA **逐字相同** 后才继续 PR/CI。这个替代路径改变了传输机制，没有改变候选文件树或验收语义。

## 10. Future Agent preflight：再次收到类似真人反馈时

1. 在第一条 compound terminal call 之前确认外层 shell；需要 Bash 就显式 `/bin/bash`。
2. 发现真实 repo root，记录 branch / HEAD / dirty state / intended remote ref；未知改动不 reset。
3. 读 root router、`docs/agents/README.md`、scenario trigger、`site-reader-attention-contract.md`、`website-design-spec.md` 和 case cluster。
4. 如果 owner 点名 Apple/其他参考产品，先查第一方设计哲学；写下要借鉴的 cognition principle，禁止先抄视觉 token。
5. 用一句话写 `primaryTask`；再写 `firstViewportGoal / mustStayVisible / nextStep / attentionMode`，然后才开始 HTML。
6. 明确“这次反馈的失败机制是什么”，并列出反边界；不要把示例词做 blacklist。
7. 扫 shared component 和 sibling routes，分类 high-confidence / uncertain / intentional exception；只自动传播 high-confidence。
8. 把 claim-changing caveat、核心比较双方、授权/停止/失败边界标出来，防止 progressive disclosure 误藏。
9. 先跑 reader-contract audit，再跑 desktop 1280×633 + phone 390×844；涉及共享 layout 时跑 Chromium + WebKit。
10. Gate 失败先判断实现是否真的违反 reader contract；真实 hierarchy/geometric bug 修页面，不放宽阈值。
11. compatibility URL 要解析 canonical owner 和 redirect/fragment 语义，不能当第二份正文。
12. hosted Preview 有 auth/protection 时把 provider READY、访问权限和视觉验收分层；不要为测试关闭安全保护。
13. merge 前刷新 current main / overlapping PRs / exact-head checks；base materially drift 后重新验证组合树。
14. Production 独立核验；工程/浏览器 PASS 不能升级成“真人已经证明有阅读欲望”。
15. 结束时只把新的 reusable delta 写进 current owner；因果经过进 history；C 类状态不进入 current policy 或长期记忆。

## 11. Stopping rule

同类任务只有在下面几层被分别说明时才算完整 closeout：

```text
human feedback captured as evidence
-> product/page repair
-> case-cluster generalization
-> sibling/shared-owner audit
-> executable regression where possible
-> exact-tree browser/CI acceptance
-> Production verification when released
-> real-human comprehension evidence reported separately
-> durable A/B/C deposition completed
-> account-memory write claimed only with a real write receipt
```

任何一层缺失都应按真实状态报告；不要用“页面看起来好多了”“CI 全绿”或“我会记住”替代另一层证据。
