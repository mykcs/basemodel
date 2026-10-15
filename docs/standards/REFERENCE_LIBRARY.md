# BaseModel 参考案例库 · Reference Library

**类型：用户点名的参考源和设计假说；不是第二套 Design 权威，更不代表页面已被用户正式验收。**  
**整理：2026-10-15。** 从历史对话和现有仓库可核查到下列主要例子，**不能保证已穷尽所有往期对话**。

## 一、网站、技术博客和 HTML 原型

| ID / 参考 | 用户想学什么 | 来源状态与已知执行位置 | 采用时的验收 / 禁区 |
| --- | --- | --- | --- |
| **WEB-01 Apple 商品页 / Apple Store App** | 对象与选择一眼可懂、重点少而突出、渐进解释 | 用户明确点名。[Apple 官方入口](https://www.apple.com/)；认知原则见 [当前 UI 规范](../agents/current/ui-design-principles.md) | 先看 BaseModel 首屏真实研究任务和下一步；**不复制大营销 Hero、圆角皮肤或空白**。 |
| **WEB-02 Apple Developer / HIG** | 心智模型、可见性、命名、分组、writing/layout | [HIG Principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)、[Writing](https://developer.apple.com/design/human-interface-guidelines/writing)、[Layout](https://developer.apple.com/design/human-interface-guidelines/layout)；已有 [认知设计复盘](../agents/history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md) | 验证真实 Reader Contract/浏览器首屏。用户曾批评“只模仿 Apple 的形”；不得靠大留白骗首屏预算。 |
| **WEB-03 OpenAI 技术/研究博客** | 专业研究出版感，图表/文字/证据连续解释 | [OpenAI Research](https://openai.com/research/)；用户点名，尚无被明确指定为最终模板的单篇文章 | 三篇研究博客先回答问题和结果，再深入公式/来源；不拷贝营销材料。 |
| **WEB-04 Claude Code Docs** | 文档导航、舒适的阅读密度与节奏；背景不要太黄、可微灰绿/豆绿 | 用户提供过准确 [Claude Code Docs overview](https://code.claude.com/docs/en/overview) | 三篇文章的长文/目录/代码块，在手机和桌面实测；未冻结任何具体 CSS 色值。 |
| **WEB-05 Astro Starlight** | 真正的文档搜索、侧边导航、手机阅读 | [官网](https://starlight.astro.build/)；实际安装工作由 [BaseModel PR #860](https://github.com/mykcs/basemodel/pull/860) 负责（登记时仍开放） | 这是**功能实现参考**，不能只调研不安装；Standards 不重复造一个手册，不把未合并 PR 称作 Production。 |
| **WEB-06 苏剑林「科学空间」** | 公式、代码、长篇推导与 HTML 自然穿插 | [科学空间](https://kexue.fm/)；用户明确点名且站点身份已确认 | OpenEVO/SD-LoRA 深层技术页；公式和正文手机可读，不要求所有简报具备同等数学密度。 |
| **WEB-07 “Cloud and Slope”** | 内容、表达和 HTML 形式高度统一的技术博客 | 用户曾点名；**准确网站身份/URL 未找到可靠证据** | 先保留 SOURCE-UNVERIFIED；不以名称相近的站点冒充、不抽象出臆测 CSS。 |
| **WEB-08 `basemodel_quality_calibration_round7.html`** | 用户曾明确认为本地第 7 版 HTML 原型视觉优于当时 BaseModel | 用户明确给过本机文件名；**这次未读到原始 HTML 字节/截图** | 三篇博客的浅灰绿阅读区、宽度/段落节奏候选；不能将私人本地路径、原件或截图发布到公开仓库。 |
| **WEB-09 A / B / C HTML 对照原型** | A=机制导入；B=对比图表的表现手法；C=有科研判断价值的交互 | 用户喜欢 B 的对照形式，但指出当时 B 内容科学价值不足；三种设计未被全部认可为永久标准 | 先向零背景读者解释 WebShop/OpenEVO；交互要改变可理解/可比较的证据，不能只是分页开关。 |
| **WEB-10 OpenAI Intelligent UI** | 可见内容和有意义的交互帮助理解科研问题 | 用户提过方向；**未指定单个要复刻的 UI 页面/状态** | 可作为交互假设；没有对应研究任务时不凭“Intelligent UI”造交互小组件。 |
| **WEB-11 Karpathy 技术“飞行员手册”思路** | 技术资料与复现步骤可执行、清楚呈现输入/结果/失败分支 | 用户曾提及，但**原始文章或仓库未唯一确认** | 暂留待核实参考；不能发明具体文章链接或冒称已阅读某一本手册。 |

## 二、论文图表、方法对比和代码差异

| ID / 参考 | 用户想学什么 | 来源状态与实施 owner | 科学及版权边界 |
| --- | --- | --- | --- |
| **SCI-01 ICLR / NeurIPS 学术图表** | 真实测量的科研图、克制的坐标/图例/图注、自然宽度的 `booktabs` 表格 | 用户明确要求；Q01 SVG [PR #856](https://github.com/mykcs/basemodel/pull/856) 和 scientific-table [Draft #827](https://github.com/mykcs/basemodel/pull/827) 已有独立实现线 | 原始 panel/metric 一致，missing≠0，灰度与手机端可辨；别把不同冻结任务集画成同组优胜排名。 |
| **SCI-02 Kimi Linear** | 左右红删绿增伪代码、行号、公式少量重点着色 | [论文](https://arxiv.org/pdf/2510.26692) / [原始 LaTeX](https://arxiv.org/src/2510.26692)；用户提供链接，相关 TeX 技法已在 OpenEVO 论文工作中核过 | 学视觉语法，不挪用 Kimi 代码、图或数字。真正的 Git Diff 需两端 SHA，抽象代码只能标 schematic。 |
| **SCI-03 Agent-Reflex** | 先问题图、再框架图、方法到实验对照的连贯论证 | [论文](https://arxiv.org/pdf/2610.17953)；用户提供链接作为质量目标 | 只借鉴表达层次；参考论文实验数字与方法不属于 OpenEVO，不能宣称其会议录用状态。 |
| **SCI-04 GitHub Diff** | 旧版删除/新版添加的改变能一眼看出 | 用户明确举的 GitHub Diff 式代码比较 | 真正源代码 diff 必须可追溯旧 SHA / 新 SHA / 路径 / 函数 / 行号；概念方法对照必须标为示意。 |

## 参考 ≠ 规则 ≠ 实际采用 ≠ 用户验收

**参考身份：** USER-NAMED / SOURCE-VERIFIED / SOURCE-UNVERIFIED / LOCAL-ARTIFACT-NOT-READ。  
**实现状态：** IDEA / EXISTING-OWNER / PR-OPEN / MERGED / PRODUCTION-VERIFIED。  
**设计签收：** PREFERENCE-EXPRESSED / CANDIDATE / OWNER-ACCEPTED。三个维度不能用一个绿色勾混写。

例如 Apple 的认知原则已进入 [Reader Contract](../agents/current/site-reader-attention-contract.md)，不等于 Apple 风格皮肤已成为 BaseModel 强制标准；现有 [Design System PR #806](https://github.com/mykcs/basemodel/pull/806) 三张候选示范页尚需用户验收。Starlight 的 PR 也不能当作已上线的证明。

## 什么时候用哪一个例子？

- **主页/模型选择：** 从 WEB-01/02 选注意力与选择模型；先定义读者任务，不堆卡片。
- **研究长文/技术说明：** WEB-03/04/06/08/09；先科学内容，再决定纸面背景/目录/公式/图。
- **技术手册/搜索：** WEB-05，交给既有 Starlight PR 实现。
- **实测曲线/消融：** SCI-01/03，先找真实收据和同口径实验。
- **方法演变/真实源码变更：** SCI-02/04，只突出能追溯的差异。

详见 [新参考收录与升级流程](REFERENCE_INTAKE.md)。此目录只记录**用户参考→可迁移原则→正确 owner→验收要求**。真实 Design 方案由当前 [UI 规范](../agents/current/ui-design-principles.md)、[Wish](../wish/LATEST.md) 和 [Design System PR #806](https://github.com/mykcs/basemodel/pull/806) 保持权威。
