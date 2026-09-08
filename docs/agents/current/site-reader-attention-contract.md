# 全站 Reader Attention Contract

状态：**CURRENT / EXECUTABLE POLICY**
代码权威：`src/data/siteReaderContracts.ts`
机械审计：`scripts/audit-reader-contracts.ts`
浏览器验收：`tests/e2e/site-reader-contracts.spec.ts`

## 1. 目的

每个公开网页都必须先回答“读者这一刻到底要理解什么”，再决定 HTML、卡片、图表和交互。

这不是 Apple 视觉模仿，也不是要求所有页面使用同一种 hero。它把 CASE-068 的认知原则变成仓库契约：**人的时间和注意力是预算；一个首屏通常只承担一个主要理解任务。**

## 2. 新页面在写 HTML 之前必须登记什么

新增公开页面、公开动态页面家族，或把现有页面改成新的主要阅读任务时，先在 `SITE_READER_CONTRACTS` 登记：

- `audience`：第一次来的读者是谁、默认知道什么；
- `primaryTask`：读者进入这页最先要完成的一个认知/操作任务；
- `firstViewportGoal`：前几秒最需要抓住的事实、选择或状态；
- `mustStayVisible`：一旦藏掉就会改变科学解释或操作安全的边界；
- `nextStep`：理解第一层后最自然的下一步；
- `attentionMode`：页面属于 focus / choice / reference / operational / narrative / comparison 中哪一种；
- `firstViewportSelector`：高层入口或特别重要页面必须声明第一屏中真正承担主信息的可见元素；
- `firstViewportBudget`：高层入口页必须显式限制第一屏同时出现的交互目标、H1/H2/H3 数量和可见文字量。

这些字段不能写 `TBD`、`TODO`、`待定` 或占位句。新增 page source 却没有 contract，CI 直接失败。

## 3. 六种 attention mode 不是六套模板

- `focus`：结果、关键状态或核心事实必须先出现；适合结果页和明确结论页。
- `choice`：第一任务是从少数真实选项中选路；适合总览、目录和 gateway。
- `reference`：第一任务是确认一个对象是什么、有哪些可核事实；适合模型、论文、档案和方法页。
- `operational`：第一任务是看当前状态、限制和下一动作；适合 run、workspace、服务器/实验操作页。
- `narrative`：顺序、因果、开始/停止条件本身就是理解对象；适合机制、流程和排查历史。
- `comparison`：比较双方和共同维度必须先被看见；适合模型比较和多臂实验。

**mode 约束人的注意力目标，不规定视觉皮肤。** 不允许为了复用 `focus` 就把机制页的开始/停止条件藏掉，也不允许为了“统一”把 choice 页改成一个大结论 hero。

## 4. Progressive disclosure 的边界

可以后置：重复 orientation、术语表、参数、命令、长日志、历史 incident、诊断细节、引用工具、页内长导航、已经由 H1 / lede 建立过的背景结构。

不能后置：会改变结论含义的 caveat、核心比较双方、当前运行/授权状态、失败与测量无效的区别、会改变用户下一动作的安全边界。

目标不是 minimalism，而是 **exactly enough**：第一层只给当前需要的复杂度，完整语义仍能沿正常阅读路径恢复。

## 5. 仓库怎样强制执行

`AppLayout` 会为每个页面解析 reader contract，并把 contract id / attention mode 写到 `<body>`。找不到 contract 时构建直接失败。

`audit:reader-contracts` 会检查：

1. 所有 `src/pages/**/*.astro` 公开 page source（`_bodies` 除外）都有 contract；
2. contract 没有失效路径、重复 id 或占位字段；
3. 中英文和动态样例能解析到同一 contract；
4. 动态模型、论文和结果 note 必须使用明确的动态 route contract，不能靠全站 wildcard 兜底。

`site-reader-contracts.spec.ts` 会在桌面 **1280×633** 和手机 **390×844** 中遍历所有 contract 样例，检查页面实际挂载 contract、H1 和声明的主信息是否真正进入第一屏，并检查页面横向溢出。

### 5.1 Contract 存在 ≠ Contract 被兑现

#545 暴露过一个重要缺口：页面可以拥有正确的 `reader contract`，H1 也在第一屏，却仍同时塞进长解释、多个 CTA、整排导航、卡片和 provenance，让读者自己决定哪一个重要。这样的页面在结构上“有 contract”，在人类注意力上仍然失败。

因此浏览器 Gate 还会测真实第一屏的：

- **interactive targets**：可见链接、按钮、输入、选择器和 summary 有多少个；
- **heading count**：H1/H2/H3 有多少个在争夺视觉中心；
- **visible text characters**：第一屏同时要求读者处理多少正文和标签文字。

高层入口页必须显式声明 `firstViewportBudget`；其他页面按 `attentionMode` 使用默认预算。闭合 `<details>` 里的内容不算作当前可见竞争项，summary 本身仍算一个可交互入口。

这些数字是**回归报警器，不是真人理解的代理分数**。如果预算失败，默认动作是：减少重复导航、下沉次要工具、收起术语/引用/provenance、重排结果与背景；**不能先把预算数字调大来恢复绿色 CI**。只有页面任务本身确实需要更多同时可见对象，并且冷读证明它们不可再降级时，才允许连同理由一起调整预算。

## 6. 新页面的 stopping rule

完成声明必须同时满足：

```text
reader contract 已登记
-> 页面第一层按该 contract 设计
-> audit:reader-contracts PASS
-> 普通 deterministic gate PASS
-> UI 改动时 browser gate PASS
-> firstViewportBudget 在桌面 / 手机真实几何中 PASS
-> 人工冷读能在 5–10 秒回答：这页讲什么？最重要的是什么？下一步去哪？
```

最后一项不能被自动化数字替代。浏览器测试可以证明结构、密度与几何没有逃逸，但“有没有阅读欲望、注意力是否落在正确对象上”仍需要真人或真正的零上下文冷读判断。

## 7. 反规避规则

- 兼容旧 URL 如果会立刻迁移到新 owner，必须显式声明 `redirectsTo`；不能把跳转页伪装成第二个内容 owner；
- 不允许新增 catch-all contract（如 `/**`）来让未知页面自动通过；
- 不允许把 `firstViewportGoal` 机械写成 H1 的同义复述；
- 不允许把所有页面都标成 `reference` 来逃避结果/操作/比较责任；
- 不允许为了减少首屏信息，把 claim-changing caveat 塞进 `<details>`；
- 不允许通过放宽 1280×633 / 390×844 的阈值来修复信息几何失败；先修页面层级；
- 不允许因为某个交互组件位于页面下方，就让它的 `position: fixed` 控件从初始加载开始占据第一屏；浮动控件的出现必须与读者已经进入该交互任务相匹配；
- 不允许把“预算 PASS”冒充成人类理解已经 PASS；预算只负责拦截明显的注意力过载。

当真人反馈指出新的注意力失败机制时，继续写入 `website-copy-cases.md`，再判断是否需要扩充这里的 mode、字段或 Gate；不要把个案词语升级成禁词表。
