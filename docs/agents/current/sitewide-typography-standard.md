# BaseModel 全站排版与科研图表标准（Current）

> Owner：`src/styles/tokens.css` 的语义字号；`site.css` / `editorial-hierarchy.css` 的全站层级；科研对象仍归原组件。适用于全部公开路由。科研事实、Reader Contract 与现有 UI 约束优先。2026-10-20 由 Q03 真实截图触发。

## 读者目标

同一篇文章、目录、科研图、科研表、系统操作界面必须拥有一致的阅读语法。**统一是语义角色一致，不是把所有字号强制设成同一个数。** 首屏研究问题和直接结果应明显，图轴刻度、图例、数字、图注是其下一级。工作台应比阅读文章紧凑，但不靠 9px 字体隐藏复杂性。

BaseModel 仍采用 Research Editorial × Experimental Workbench。参考苏剑林《科学空间》的单列论证与公式邻接、OpenAI 技术博客的清晰节奏、OpenClaude 的明确信息层级，但不复制它们的品牌字体、颜色或装饰。用户提到的 `asloppy` 博客尚未确认精确地址，不能自行捏造设计来源。

## 单一字体与语义尺寸表

单一技术层：`src/styles/tokens.css`，优先使用以下变量，**不要在新组件中重复发明对应 px/rem/字重**。

| 语义角色 | Token | 使用范围 |
| --- | --- | --- |
| 视觉级 Hero | `--type-display` | 首页有真实主任务的展示标题；不用于科研结果数字 |
| 普通页面标题 | `--type-page` | 目录、模型/论文页面 H1 |
| 长文标题 | `--type-article-page` | 技术博客、研究长文 H1 |
| 页面分节 | `--type-section`、`--type-article-section` | 有层次的 H2 |
| 子问题 | `--type-subsection`、`--type-article-subsection` | H3 |
| 次级标题 | `--type-minor-heading` | H4 / 实验小节 |
| 导语与正文 | `--type-lead`、`--type-body`、`--type-body-small` | 自然说明文本 |
| 真实科研表 | `--type-table` | 原生 HTML table，booktabs 风格 |
| 图标题与图注 | `--type-figure-title`、`--type-caption` | 图标题在上；caption 位于图下 |
| 标签 / provenance / 刻度 | `--type-meta`、`--type-plot-label` | 低层级但必须清晰可读 |

字体只采用三种**用途**：界面/中文正文 `--font-interface`，少数真正编辑型大标题可用 `--font-editorial`，命令、代码、SHA 用 `--font-mono`。正文与科研数值不借用 serif 或 monospace 装饰；KaTeX 的数学字形是必要例外。常规字重是 400/500/600/650。不要因为某一数据行排第一就加粗，也不要为了“看起来更论文”随意使用斜体、超密间距或花体数字。强调由科研结论的重要性决定，不由数据行位置决定。数字保留普通字形，并就近说明单位与分母。

## 论文式 Figure / Table，不把网页做成两栏论文

- 单一曲线、单个置信区间：类似 LaTeX `figure`，宽度紧凑，主体居于阅读列内；多曲线/多面板可采用 `figure*` 宽度。不能为了填满卡片而无端放大。
- 图形标题、坐标轴、数值、图注由不同字号角色承担。原始数据点保持来源可核对，点标与轴至少留出真实字形空隙，手机端布局也要检查；所有点有图形语义，黑白打印也能分辨。
- 学术图不默认加圆角卡片边框、阴影或悬浮工具条。浏览器原生 SVG `<title>` 可能作为覆盖式 hover tooltip 盖住正文；为科研 SVG 优先使用 `role=img` + `aria-label` + `<desc>`，既保留读屏解释又不盖图。
- 简短科研数据表使用真正的三线表：顶线、表头线、底线，无逐行视觉隔断；比较对象做行、指标做列，数值右对齐，统计口径在 caption。密表在表格局部横滚。交互式工作台表不强套该样式。
- 图上能直接读到的四个数字不必原封不动再铺一段；正文主要讲**结果关系和限制**。图注标明样本、窗口、纵轴裁剪、未测点和不可直接对比的论文协议。不能拿展示比例冒充性能归因。

## 全站实施与例外

本规范在所有路由继承同一 token。具体 DOM 仍由 `site.css` / `editorial-hierarchy.css`、`openevo-research-blogs.css`、`research-booktabs.css` 及各科研组件负责。页面角色允许差异：Home Hero、PPT 演示、论文正文、工作台控件、公式、代码、Plot 坐标轴、状态标签；**每一处例外都应有读者任务理由**，不能用“这是历史 CSS”作理由。

不可通过在根部新增一层 `!important` 覆盖修复局部细节。共享 CSS 风格收敛遵守 `docs/agents/current/css-architecture.md`；已有旧 CSS 中的硬编码值属于迁移债务，审计负责显式报告，不得宣布自动全消。不会为通过检查而把字体缩到难辨，也不会只放大总体字号而挤坏中文和图示。

## 验收与防止再次假绿色

1. `npm run audit:typography`：在 `npm run build` 后遍历生成的全部 HTML 路由，检查角色 token、科研图存在、Q03 无遮挡型 SVG title，汇总全部 CSS 字体声明和剩余硬编码债务。审计不是视觉验收。
2. 浏览器实际覆盖 Home、Models、Papers、Research、Flow、Compare、Workspace 等代表性路径；390/768/1440 宽屏、明暗主题、主要标题/正文/图注级别、无横向溢出。科研网页必须用生产形态访问，不能只读 Astro 源码。
3. 对 Q03 回归做**旧坏例**和**修正例**：旧 SVG 标注距纵轴 13px 的重叠、原生 title 的遮挡必须判失败；新图在桌面和手机可读、图注不等于正文、数学与真实四点保留。Q01 相邻科研图也需检查；对合法的短方法标签/代码和必要的数学符号不误伤。
4. 每次发布读取最终 Vercel artifact 并浏览器看真实图像。测试绿灯仅证明所检测的性质；读者能否快速理解还需独立冷读，未完成应标记 `NEEDS_READER`。

参考：[苏剑林·科学空间](https://kexue.fm/)；[OpenAI 前端设计建议](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)；[OpenAI Research](https://openai.com/research)；[OpenClaude](https://github.com/Gitlawb/openclaude)。

**历史真人反馈**：对“只是补一个开头”“只加粗”“图题挤压、字体大小不统一”“要全站同类扫描”曾多次提出纠正。每次新例子都必须驱动同类检测和实际产品修复；不得用“规范已经存在”替代验证。
