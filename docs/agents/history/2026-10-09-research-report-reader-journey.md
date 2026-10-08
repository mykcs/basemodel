# BaseModel 研究汇报：读者问题与页面表达核查｜2026-10-09

**性质：已执行的站点审查与本次修复证据。** 本文件记录页面事实和未收口范围；可执行的通用写作规则仍以 `mykcs/myk-skills/project-report` 和账户级 Human Expression 为准，BaseModel 的发布与布局约束以 `docs/agents/current/research-editorial-style.md`、`site-reader-attention-contract.md` 和 `src/data/siteReaderContracts.ts` 为准。本文件不是第二套规则引擎。

## 本次审查对象和完成边界

- 从当前 BaseModel `main` 构建了 265 个静态 HTML 页，读取其中 `/research/seed-openevo/study/` 的 **53 条中文路径**（包含入口页、研究解释、结果笔记、历史实验、跳转／兼容页）。
- 检查实际渲染后的标题、摘要、主要结果、章节、术语和证据边界，而非只检查源码字符串。多数页面已有主题、解释和证据条件。**某页没有字面问号不代表研究问题未回答；没有 H2 的跳转页也不应冒充内容缺失。**
- 针对已经确定的共性缺陷，在 `OpenEvoExperimentResultsScaffold.astro` 修复 **五条实际报告路线**：`results/3b-self-analysis/`、`results/7b-self-analysis/`、`results/3b-minimax-analysis/`、`results/7b-minimax-analysis/`、`results/four-arm-analysis/`。
- **已修复**：数字与未知结果提前进入正文；已有结论不再写“最终解释先留空”；确认事项数量不再硬写四件；先放观察与解释，后放旧的 256 次任务／8 个不同成功任务门槛和术语；四臂结果以**方法为行、指标为列**，Task Score 明确 0–100，缺失 endpoint 不补成零。
- **已补自然追问**：固定同题 7B/self 的 25.66 与 7B/MiniMax 的 16.94 到底说明什么？它是历史可观察差异，不是教师模型的受控因果效应。3B/self 起点没生成 Stage1 adapter、3B/MiniMax final 没测，因此亦不可当成纯模型规模效应。
- 原始实验常量、SFT/SD-LoRA 算法、rollout、checkpoint、来源和其他页面的既有结论未改变。性能好坏与科学公平性不可因视觉统一而自动推断。

## 其他现存页面的归属：不覆盖进行中的正确工作

以下当前 PR 已经针对同一范围开展更专门的升级，不从本次分支拷贝或抢写它们的页面：
- [#829](https://github.com/mykcs/basemodel/pull/829)：全站媒介与读者任务不匹配审计（audit-only）。
- [#830](https://github.com/mykcs/basemodel/pull/830)：Vanilla SD-LoRA 的轮次、历史组件与状态交互解释。
- [#831](https://github.com/mykcs/basemodel/pull/831)：SEED 与 OpenEVO 的比较和因果／依赖关系解释。
- [#812](https://github.com/mykcs/basemodel/pull/812)：Bounded／β 科学博客式长文重排。
- [#818](https://github.com/mykcs/basemodel/pull/818)：Stage1 学习信号、rank32 容量与 β 后期行为的研究综合。
- [#827](https://github.com/mykcs/basemodel/pull/827)：有数据来源的科学表格 HTML/CSV/LaTeX 一致性，当前 Draft。

基线已观察到多篇很好的例子，**因此保留原有优点**：
- `q17-directapply-analysis` 将最终 128 题、训练曲线、R127/R128 诊断和算法边界分开。
- `sd-lora-scaling` 分清固定 workload 下的计时与不成立的普遍规律。
- `sd-lora-equivalence` 先说明 v2 与严格等价优化的差别，再给加速和 WebShop 证据。
- `briefing` 已对齐 0–100 的 SEED 论文参考与本地结果，并明确不能直接排名。
- `bounded-effective-state-gdr` 明确三组冻结 128 题结果与论文原生 128 题不是一场考试。此页另由 #812 改进呈现。

## 核查方法与验收证据

- 报告级别：自然的主问题是否得到回答？发生变化的证据是否交代？最值得问的一个异常有没有在正文用**现有证据**得到解释或明确说出未知？是否把不同任务池／提示／采样下的成绩误当成同题公平排名？
- 媒介级别：结论是否出现在主阅读层，详细流程与术语是否可以按需展开；是否用真实原生 HTML 表格、图注、移动端局部横向滚动和语义标题；不凭空增加动效。
- 机械证据：本次源码与页面重新编译，`npm run check`，`npm run build`，以及 `tests/e2e/research-result-reading-order.spec.ts` 浏览器覆盖；实际结果以 PR 验收记录为准。

## 尚未收口，不能冒充全站完成

本次 **53 条路由的结构盘点 ≠ 53 篇已经被独立真人冷读并全面重写**。已有内容合格的页面不应为了产生 diff 而强行改写。进行中的上述 PR 各自仍需其 exact-head CI、真实浏览器视觉与读者验收，并在合并后从新 main 再做一次全站复读。独立新读者的完整跨主题行为 A/B 仍是 Project Report Skill 自身的验收范围；不能因本次网站构建通过而声称模型已经学会举一反三。

本次不改 Notion，也不修改科学试验或发布新证据。
