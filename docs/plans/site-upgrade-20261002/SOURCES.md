# 来源与参考：用途、边界、复核方法

检查日期：2026-10-02。以下不是全部已经采纳的实现；外部资料提供设计/技术依据，当前仓库代码与科学合同决定落地方式。

## 仓库证据

BaseModel 调查基线：[360eabb](https://github.com/mykcs/basemodel/tree/360eabb92e5feb9ccef6ae7785332f73f7620ee0)。阅读了根 AGENTS、Wish/Dev、Reader Attention、研究呈现/结果阅读、安全发布与分支规则，以及 package、Astro/Vercel 配置、Content Collections、CI workflow 与 scripts/ci-ui-gate.mjs、WandbEvidencePanel、Vanilla 机制数据和组件、已有 W&B 派生产物清单。

旧工作原件：[资源桥接 #783](https://github.com/mykcs/basemodel/pull/783)、[结果发布 #805](https://github.com/mykcs/basemodel/pull/805)、[设计体系 #806](https://github.com/mykcs/basemodel/pull/806)、[β 文章 #812](https://github.com/mykcs/basemodel/pull/812)。#781/#782 本次确认已合并。旧 PR 正文中的 CI/视觉成绩是当时记录，不是本次重验。

## 技术依据

- [Astro islands](https://docs.astro.build/en/concepts/islands/)：静态 HTML 与按需要激活的交互；不据此强制把全部 React 改掉。
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)：现有集合和 schema 可复用，不另建 CMS。
- [GitHub workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data)：跨 job 复用产物；特别注意官方 digest 不匹配可能只报警，本项目要另外拒绝错误身份/哈希。
- [Playwright Docker](https://playwright.dev/docs/docker)：镜像与项目工具版本应对应；当前脚本会安装 Chromium，版本差异不等于已证实测试必然失败，应测重复安装成本。
- [W&B SDK Run 实现](https://github.com/wandb/wandb/blob/main/wandb/apis/public/runs.py)：实施时固定 SDK/source 版本并核对 history/scan_history 的抽样与缺失字段行为。网站现有受限 Report 链接不是开放 iframe 的授权。

## 科研阅读与视觉参考

- [ICML author instructions](https://icml.cc/Conferences/2026/AuthorInstructions)：科研呈现与面向非专家说明的参考入口。
- [booktabs](https://ctan.org/pkg/booktabs?lang=en)：出版级表格的克制线条与分组，网站仍使用真实 HTML table，不把 PDF 截图当数据表。
- [W3C accessible tables](https://www.w3.org/WAI/tutorials/tables/)：caption、表头、scope/headers 保留可访问关系。
- [W3C pause/stop/hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)：流程动画必须可停，不让自动运动妨碍读者。
- [Apple: The Illusion of Thinking](https://machinelearning.apple.com/research/illusion-of-thinking)：借鉴研究记录的题目、摘要、图、出处层次，不移植该论文结论。
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)：借鉴问题解释、具体例子和任务/试次/轨迹/结果的区分；不是把其术语机械替换项目科学合同。
- [OpenAI: Understanding neural networks through sparse circuits](https://openai.com/index/understanding-neural-networks-through-sparse-circuits/)：借鉴简短导语、正文论证、解释图和局限相邻的阅读路径。
- 苏剑林 / 科学空间：本次直接访问 spaces.ac.cn/kexue.fm 未成功；采用用户明确表达的“字体与整体布局简约、注意力集中”以及 #812 已记录的阅读取向，不声称逐页视觉复刻，也不复制其 HTML/CSS。

用户口述的“Neeps / IXML”在本方案中按 NeurIPS / ICML 一类论文的学术表格意图处理，不作为已确认的准确会名。方案不需要新增字体下载或仿冒品牌皮肤；所有引用仅支持具体取舍。

## 未完成的现场验证

未运行网站 build、浏览器或实验；未全面扫描服务器数据；未验证当前 W&B 账号的全部 run/Report 权限；未重新复核旧 PR 的每个数字。执行 Agent 必须在相应任务开始时从真实 owner 取证，不能将本计划抄成完成报告。
