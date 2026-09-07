# 训练设计真人反馈 → 全站举一反三 → 发布收口：经验沉淀

状态：**historical evidence only**。记录 2026-09-07 这次 BaseModel 网站工作；它不授权实验运行，也不替代 `AGENTS.md`、`docs/agents/current/*`、代码/测试或 live provider state。

当前执行规则优先读：
- [`../current/project-agent-operating-principles.md`](../current/project-agent-operating-principles.md)
- [`../current/human-thinking-web-expression-contract.md`](../current/human-thinking-web-expression-contract.md)
- [`../current/ui-change-visual-acceptance-gate.md`](../current/ui-change-visual-acceptance-gate.md)
- [`../current/scenario-trigger-registry.md`](../current/scenario-trigger-registry.md)
- [`../current/website-copy-cases.md`](../current/website-copy-cases.md)
- [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md)

## 1. 这次真正解决的不是一个页面

Owner 最初指出训练设计页的五类问题：页面归属错位、局部导航另起一套语言、字体角色漂移、标题上方重复 eyebrow / 主持人小标题、以及没有理解收益的循环动效。关键要求随后升级为“触类旁通、举一反三”：不能只修被点名 URL，要把真人反馈变成全站可复用案例和防回归机制。

最终实现把训练设计正文并入流程理解图，旧 `/study/design/` 只保留兼容入口；同一失败机制又传播到 Results、Analysis、GDR、benchmark、共享详情组件和字体 token。PR #536 最终合并为 `879d76fa74386f11c6e9929fbb824e8021ed64da`，随后 #545 又把 attention-first 规则提升到站点 current contract。以上 SHA 只用于历史重建，不是未来 current authority。

## 2. 工程摩擦：从事件抽象成操作前规则

| 发生了什么 | 为什么 / 错误假设 | 下次操作前检查 | 防御性规则 | 看似合理但错误的反例 |
|---|---|---|---|---|
| 主工作树在无关分支且 `package-lock.json` dirty | 把“本地有仓库”误当成“可安全直接修改” | `HEAD`、branch、index/worktree diff、remote intent | 有未知/无关 dirty state 就转 isolated worktree | `git restore` / `reset --hard` 先把工作树“弄干净” |
| 新 worktree build 首次缺 `@astrojs/react` | clean checkout 没有 `node_modules`，却容易被误判成产品编译失败 | lockfile、依赖目录、已知兼容 dependency tree | 缺依赖是环境/setup failure；可复用兼容依赖树，但临时 symlink 不提交 | 为诊断本地缺依赖先触发一次 hosted Preview |
| 4321/4322/4327 等端口碰撞 | 默认相信请求端口，而不是运行器实际绑定结果 | server stdout、owned PID、当前端口占用 | 使用唯一端口并读取实际 URL；只终止本任务拥有的进程 | 看到端口占用就 kill 任意监听进程 |
| 纯 Astro redirect 导致 static heading audit 发现 0 个 H1 | 把“路由只负责跳转”当成可忽略仓库语义 contract | route heading/a11y/static audit | 兼容 route 也必须满足当前 route contract；实现形式由 repo gate 决定 | 为了“更标准的 redirect”绕过现有 heading invariant |
| 动效测试最初要求 `document.getAnimations() === 0` | 把“禁止 ambient motion”扩大成“任何瞬时 transition 都不允许” | 真实动画 iteration/count、触发来源、reduced-motion 状态 | 测试要锁定失败类别：禁止持续/无限装饰动画，不误伤一次性状态切换 | 为了让断言绿，把合法 theme transition 全删掉 |
| 一次测试修改膨胀成数百行格式化 diff | 工具/格式化把语义修复和无关重排混在一起 | `git diff --stat`、changed lines、真正必要的 assertion | review 噪声不是免费；恢复文件后只保留必要语义差异 | “反正测试都过了，顺便格式化整个文件” |
| 同一 PR 分支被并发 Agent 多次推进/force-update | 把远端 branch 当成静态私人工作区 | 每次 push 前 fetch remote head、PR changed files、semantic delta | 未知远端漂移先读再叠加；保留本地备份，绝不 force-push 覆盖并发工作 | `git push --force` 把分支恢复成自己记忆里的状态 |
| `main` 在 CI 运行期间前进，已绿 PR 变成 `BEHIND` | 把“刚通过的 exact head”误当成“当前 merge window 仍有效” | current main、accepted head、merge state、required checks | merge 前重新绑定 base/head；必要时合 current main 后重跑组合树 | required checks 全绿就直接用 admin 绕过 behind rule |
| GitHub HTTPS / HTTP2 多次超时 | 一个 transport path 失败容易被误判成 GitHub/权限整体不可用 | durable PR/status、connector/CLI alternate path、实际 remote ref | transport failure ≠ capability failure；换 owner-appropriate path 重建状态 | 第一次 `git fetch` 超时就宣布 blocked |
| 本次经验沉淀又用 Fish 执行 Bash `if ...; then ...; fi` 而失败 | 规则早已写过，但没有落实到工具调用的 outer interpreter | 工具 `shell` 参数 / 外层解释器 | 需要 Bash 语义时在**那次调用**显式 `/bin/bash`；“读过规则”不是 use-site witness | 以为内部 `bash -lc` 或人的记忆会自动覆盖外层 Fish |

## 3. CI 摩擦：红灯不等于产品回退

| 发生了什么 | 为什么 / 错误假设 | 下次操作前检查 | 防御性规则 | 反例 |
|---|---|---|---|---|
| 三项 CircleCI 同时 FAIL | 共同前置 contract 漂移，而不是三个独立 UI bug | 第一个真实 failure、shared preflight、candidate/base 同环境 | 先找共同 owner，再拆独立失败 | 三个 job 红就分别改三个页面 |
| unit test 强制 `FIGURE 04/05` 装饰 eyebrow 存在 | 测试保护了旧文案形状而非当前信息不变量 | current component + current copy/design contract | 有证据证明 Gate stale 时更新 Gate，并保留其余安全断言 | 为了绿灯把已被真人反馈否定的 eyebrow 加回来 |
| Results visual test 强制 heading 宽度 ≥850px | 历史布局数字被误当成可读性本身；真实 760px 阅读列并未塌缩/溢出 | 实测 width、line count、overflow、可读字符密度 | 阈值应检测真实 collapse；修错误 proxy，不降低有效安全边界 | 把页面重新拉宽到旧布局，只因为旧数字写在测试里 |
| `--max-failures=1` 修掉第一处后还有测试未执行 | first failure 只暴露最先失败项，未运行项是 unknown | 最终 suite executed count / terminal status | 每次修复后把 serial gate 跑到底；`did not run` 不能算 green | “第一条失败修了，所以 shard 应该没问题” |
| 本地 focused test 绿，但 hosted required checks 还没绿 | 不同 acceptance layer 被混成一个 | exact candidate tree、本地命令、远端 status context | local reproduction、hosted required checks、merge、Production 分层报告 | 用本地 100/100 代替 GitHub required check |

这些规则现已由 [`../current/ui-change-visual-acceptance-gate.md`](../current/ui-change-visual-acceptance-gate.md) Section 10 与 scenario trigger 持有；本历史文件不再另立一份 Gate。

## 4. 思维与产品/科研语义摩擦

| 错误倾向 | 为什么危险 | 操作前问题 | 可执行边界 |
|---|---|---|---|
| “用户讨厌小字，所以所有 small label 都删” | 会同时删除日期、版本、sealed/historical、evidence identity 等解释边界 | 这行是否提供标题没有的状态/顺序/provenance？ | 删除的是重复 narration，不是信息密度本身 |
| `01 · 已经知道什么` 整行一起留或一起删 | 序号和主持人分类承担不同语义 | 去掉后半句是否仍能保留必要顺序？ | 可以保留 `01`，删除重复 H2 的“已经知道什么” |
| “HTML 动画用得越多越体现设计” | 纯 motion 会抢注意力，甚至暗示不存在的机制或状态 | 静态版本是否已经完整表达方向/依赖？移除 motion 是否损失理解？ | 没有可说明的理解收益就删除 ambient motion |
| “代码能拆 route，所以信息架构也应拆 page” | 实现模块化被误提升为读者 mental model | 读者为什么来这里？它在 whole-site journey 里回答什么问题？ | page/section ownership 按 reader journey，不按组件边界 |
| 同一 section 做自己的 tab/chapter/font mini-system | 局部一致、全站不一致，读者要重新学习控件语义 | parent route 是否已有 nav/disclosure/font/shape primitive？ | 默认继承共享系统；只有真正互斥 view/state 才新增 tab 语义 |
| 只修 owner 点名 URL | shared owner 会继续把错误复制到 sibling routes | 这个 DOM/copy/pattern 是谁生成的？有哪些 consumers？ | 真人反馈命中共享源头时扫描全部 consumer，高置信同类同批修 |
训练设计本身还承载项目级科学边界，不能为了页面简化而重写：Stage 1 是 Qwen 先独立完成 WebShop episode，完整轨迹封存后 external analyzer 才复盘；完整系统比较与只比较 Stage 2 learner 是不同问题；sampling / history / regeneration 等参数是公平协议而非装饰默认值。UI 重构必须搬运这些边界，不能把“更顺的交互”变成 teacher 进入 step loop、比较对象变化或实验协议变化。

本对话**没有执行新的 GPU 训练、Docker 清理、服务器文件删除或实验 resume**。因此任何当时的 GPU 占用、PID、round、磁盘余量都不属于本次可提升的事实；网站工作也不构成实验授权。

## 5. 发布收口：source、CI、merge、Production 是四件事

#536 的安全 closeout 最后需要同时满足：accepted PR head、current base、required CircleCI contexts、merge rule、以及 Vercel Production identity。一次尝试中 required checks 已全绿，但 GitHub 仍拒绝合并，因为 `main` 已前进，merge state 为 `BEHIND`；把最新 main 合入、重新验证后才满足规则。

最终使用 exact-head auto-merge/guarded merge 思路，而不是 admin bypass。合并后又独立查询 Vercel deployment，确认 Production `READY` 的 `githubCommitSha` 精确绑定 #536 merge commit；再读生产 `/flow/` 和旧 `/study/design/` 兼容页面。`READY` 证明 deployment object 成功，不自动证明读者体验；真实 route readback 才完成这次发布边界。

旧 `/study/design/` 在该次实现里是 **HTTP 200 compatibility page + `window.location.replace(...)`**，不是 301/302。这是历史实现事实，不应抽象成“兼容 URL 必须用 JS redirect”的长期规则。

## 6. A / B / C 信息分层

### A — 长期稳定规则

已由 current owner 持有、这次只验证其必要性：
- 需要 Bash 语义就在执行调用显式选 `/bin/bash`；
- dirty/并发 checkout 不覆盖，使用 isolated worktree；
- unexpected branch/main drift 是 stop-and-read event；
- Gate failure 先分类 product regression / stale contract / bad measurement；
- serial first-failure 必须跑到全套终态；
- user-facing feedback 命中 shared owner 时扫描 sibling consumers；
- animation、navigation、typography 按语义和理解收益决定，不按装饰习惯；
- implementation/local CI/hosted CI/merge/Production/real-reader feedback 分层验收。
本次真正新增的 A 类机制是：**共享编号注册表在 integration time 分配稳定身份**。CASE / ADR / incident / rule 等手工编号在并发分支上不能把 `max + 1` 当成最终 authority；组合树必须检查 ID/anchor 唯一性，冲突时保留双方事实并重编号，不得删另一 Agent 的记录。机器可检时必须进入正常 Gate。

### B — BaseModel / SEED × OpenEvo 项目级经验

- 训练设计的 reader owner 是 Flow/流程理解图；独立 Study route 只承担兼容入口。
- Training Design 案例族保留 page ownership、eyebrow、motion、local navigation、font roles、shared-component propagation、bilingual labels、sequence metadata 等具体实例。
- Stage 1 analyzer 的 post-episode 边界、full-system vs learner-only 对照、参数协议属于科研项目语义；不泛化成所有网站/所有实验默认值。
- BaseModel ordinary CI 的 required contexts、Vercel Preview/Production contract、branch eligibility 由当前 repo config/policy决定，未来必须刷新 live truth。

### C — 刻意不提升的临时状态

不进入 current policy / 长期记忆：当时 PID、4321/4322/4323/4327 端口、临时 worktree 路径、某轮 CircleCI pending/pass 时间点、当时 PR branch head、一次网络超时、实时 Vercel deployment URL、当前 GPU/磁盘/round/百分比。必要 SHA 只在本历史 case 中承担事件身份，不成为未来执行默认值。

## 7. 重复犯错检查：哪些其实以前就写过

| 再次发生的问题 | 以前为什么没挡住 | 这次如何改变层级 |
|---|---|---|
| Fish 解析 Bash 失败 | 根 `AGENTS.md` 和历史 retrospective 已写，但 Agent 在具体 tool call 没有执行 outer-shell 检查 | 不再追加第三份 shell SOP；把它标记为 `REPEAT-CORRECTION` 的 use-site failure，并保留 current witness 规则 |
| stale test 把页面拉回旧设计 | 以前有 stale-contract retrospective，但容易在红灯时把测试当绝对 authority | current UI gate 已显式三分 product / stale contract / bad proxy，并要求保留未受影响安全断言 |
| moving main / moving PR head | exact-head 规则早已存在，但长时间 CI 后未再次绑定 merge window | current release rule要求 accepted head + current base + required checks + merge state；支持时锁 expected head / auto-merge |
| 真人反馈只修局部、同类又复发 | 旧 copy case 存在但位置深，且缺少“shared owner + sibling scan”的执行 trigger | scenario registry 与 human-thinking contract 已把 shared-consumer scan 提升为默认动作，并有 rendered regression |
| “写进案例库”被误当成已经治理 | 案例内容能沉淀，但并发 PR 可让案例身份自身碰撞 | 本次新增 CASE-ID uniqueness guard；integrated tree 会机械拒绝重复 ID |
| repo 文档被误想象成 ChatGPT 长期记忆 | retrospective 曾提醒，但没有真实 memory receipt | current principles 明确区分 repo write / context retrieval / memory write；本次继续报告实际 memory writes=0 |
## 8. 为什么“以前写过 retrospective”仍然会复发

这次证据表明，失败不主要来自“完全没有文档”，而来自四种不同断层：

1. **Retrieval failure**：规则埋在 history，当前任务没有自然触发它。
2. **Abstraction failure**：规则只写成某个旧页面/旧句子的修复，没有抽象为 shared owner / semantic level / failure class。
3. **Enforcement failure**：规则能被机器检测，却只有 prose，没有正常 Gate。
4. **Use-site execution failure**：Agent 明明读到规则，但真正调用工具时仍没显式指定 Bash、没刷新 remote head、没检查组合树。

因此未来遇到“这不是第一次了”时，不能默认答案是再写一份 retrospective。先判断上面哪一层断了：入口不够就补 trigger；抽象不够就改 current owner；可机械检测就加 guard；规则已有却没执行就要求 use-site witness。只有事件因果和反例才留在 history。

这次 CASE-ID 冲突是第五种提醒：**治理资产本身也会被并发修改**。`website-copy-cases.md` 在 current `main` 上曾同时存在两组 CASE-065–068；两边内容都有效，只是不同分支各自把局部最大编号当成全局身份。处理方式是保留两组事实，把训练设计 block 重编号为 CASE-073–080，并增加集成唯一性测试，而不是删除其中一组。

## 9. 长期记忆提炼

**实际长期记忆写入：0 条。** 当前环境没有可用的长期记忆写接口；`bio` 接口不可用/禁用。仓库 commit、personal-context 检索、聊天总结都不能冒充账户级记忆更新。

如果未来环境提供真实记忆写能力，值得重新确认并写入的稳定候选是：
- Owner 的真人网页反馈是高价值训练样本：修当前实例 + 保存反例/正例 + 抽象规则 + 扫描共享源头/高置信 siblings + 可机械时加回归；
- user-facing 页面优先中文、自然、直接，避免无信息增益的 eyebrow/kicker/主持人口吻；
- 动效/交互只有降低认知负担或表达真实状态时才值得存在；
- 页面归属与导航/字体/交互语法按 reader journey 与共享站点系统决定，不按实现模块自行发明；
- 并发代码工作优先 isolated worktree，未知 remote drift 不 force-push 覆盖。

这些候选不包含具体 PR、端口、SHA、GPU、运行进度或某个 provider 的短期状态。

## 10. 历史真实性与边界

本文件保留失败尝试本身：纯 redirect 曾触发 H1 audit；旧测试曾要求被否定的 figure eyebrow 和 850px heading width；Fish 解析失败在本次经验沉淀阶段又发生一次；PR/main 在 CI 窗口内多次前进；GitHub HTTPS 曾短暂不可达。它们不会因为最终成功而从历史中消失。

同样，#536 已发布并不证明未来所有页面都“真人可读”，工程 PASS 也不等于测得 human comprehension。后续 #545 的 attention contract 是新的 current product layer；本历史 case 不能拿 #536 的当时页面状态覆盖 #545 或未来 main。

## 11. 本次沉淀本身的验证

沉淀从 exact `main` `d045aceb62f3162572c45a480b31934cbf527af8` 建 isolated worktree；该 SHA 只标识本次集成基线。

- CASE heading 扫描：76 条记录 / 76 个唯一 ID；训练设计 block 从冲突的 CASE-065–072 改为 CASE-073–080；重复 ID = 0。
- 被重编号的旧 CASE-069–072 在案例库外没有活跃引用；没有需要迁移的外部稳定引用。
- focused policy tests：`websiteCopyCaseIdGovernance.test.ts` + `agentScenarioTriggerRegistry.test.ts` 共 6/6 PASS。
- 全部 repository unit/structural/behavior tests：560/560 PASS（structural 523 + behavior 37）。
- 新 guard 第一次进入完整 `verify:deploy` 时，`astro check` 抓到正则 capture 的 `string | undefined` 类型问题；修成显式 `requiredCapture` 后 focused test 与 `npm run check` 再次 PASS。这保留了“focused runtime test 绿不等于 type-check layer 已验证”的真实摩擦。
- 最终 `git diff --check` PASS；最终 `npm run verify:deploy` PASS。Astro diagnostics：522 files，0 errors，0 warnings，2 个既有 deprecation hints。
- 这次没有 reader-facing source/UI 改动，因此不为经验沉淀额外制造 Vercel Preview；正常仓库 CI 仍应在 PR 上验证集成树。
