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
| 子问题 | `--type-subsection`、`--type-article-subsection` | 普通 H3 |
| 次级标题 | `--type-minor-heading` | H4 / 实验小节 |
| 导语与正文 | `--type-lead`、`--type-body`、`--type-body-small` | 自然说明文本 |
| 真实科研表 | `--type-table` | 原生 HTML table，booktabs 风格 |
| 图标题与图注 | `--type-figure-title`、`--type-caption` | 图标题在上；caption 位于图下 |
| 标签 / provenance / 刻度 | `--type-meta`、`--type-plot-label` | 低层级但必须清晰可读 |

字体只采用三种**用途**：界面/中文正文 `--font-interface`，少数真正编辑型大标题可用 `--font-editorial`，命令、代码、SHA 用 `--font-mono`。正文与科研数值不借用 serif 或 monospace 装饰；KaTeX 的数学字形是必要例外。常规字重是 400/500/600/650。不要因为某一数据行排第一就加粗，也不要为了“看起来更论文”随意使用斜体、超密间距或花体数字。强调由科研结论的重要性决定，不由数据行位置决定。数字保留普通字形，并就近说明单位与分母。

## 共享间距、阅读宽度与实际执行层

`tokens.css` 仍是唯一尺度 owner。普通间距采用固定的 **2、4、8、12、16、24、32、48、64、96、128px** 档位；其中 4–64px 复用原有八级尺度，2/96/128 是同一尺度的半步或大区域组合。相对节奏由 `--space-relative: 1rem` 和 `--space-em-factor: 1` 拥有，保留浏览器根字号或当前元素字号的可访问性关系。紧凑、常规、宽松密度必须从这些有限档位选择，不能给每个旧 literal 新造一个变量或任意倍数。

| 阅读/界面角色 | 绝对间距 owner | 相对间距 owner | 基准 |
| --- | --- | --- | --- |
| 正文段落 | `--space-prose` | `--rhythm-prose` | 16px / 1rem |
| 普通列表缩进 | `--space-list` | `--rhythm-list` | 24px / 1.5rem |
| 标题邻接 | `--space-heading` | `--rhythm-heading` | 12px / .75rem |
| 区域间隔 | `--space-section` | `--rhythm-section` | 48px / 3rem |
| 卡片/面板内衬 | `--space-panel` | `--rhythm-panel` | 24px / 1.5rem |
| 内容堆叠 | `--space-stack` | `--rhythm-stack` | 16px / 1rem |
| 行内元素、控件 | `--space-inline` / `--space-control` | 对应 `--rhythm-*` | 8px / .5rem |
| 页面横向留白 | `--space-gutter` | `--rhythm-gutter` | 24px；手机16px，390px及以下12px |

默认 `p`、`ul`、`ol` 在 `site.css` 消费段落/列表角色。共享页面壳只由 `components/global-shell.css` 持有：普通壳使用 `--content-max`，研究工作台使用已有 `--workbench-max`，二者使用同一 `--page-gutter`；已删除 `site.css` 的旧壳宽度。普通正文、列表和 lede 的阅读宽度使用 **`--reading-width: 68ch`**；旧 `--type-reading-measure` 是它的兼容别名。此前 720px → 72ch → 68ch 的覆盖链已收束。标题 24/34/42ch、控件目标尺寸、表格最小可读宽度、图内画布/坐标宽度仍分别属于标题或几何角色，不能全部改成正文宽度。

普通 `strong,b` 直接消费既有 `--type-weight-strong:650`，避免UA `bolder`随父字重叠加；已有明确科学scoped字重保留。该新增声明通过精确selector continuation追加分类，未改历史5,491条账本。真实浏览器同时检查嵌套强调的token响应与恢复。

执行并非只靠作者记住规范：`astro.config.mjs` 把 `scripts/lib/sitewide-spacing.mjs` 放入既有 Vite/PostCSS 处理链，作用于公共 CSS、Astro scoped CSS、研究组件、Starlight 和工具样式。普通 margin/padding/gap 的旧值归入最近的有限档位（距离相等取小档）；对应正文/列表/lede 的固定 max-width 归入阅读 owner。Tailwind 的 `--spacing` 也映射到同一个 `--space-1`。源码旧 literal 仍是可盘点的迁移输入，不宣称它们已经逐文件删除；最终产物必须经过同一执行层并被独立复查。

合法例外按实际属性/选择器处理：仅 print 的媒体分支；SVG/canvas/Math/KaTeX 内部几何；可访问性隐藏元素；`SeedOpenEvoProgressBriefing.astro` 中明确的固定1280×720画布本体。演示页外层 `.briefing`、`.briefing-slide` 的页间距以及其普通正文、图注、列表仍参与统一。`/research/`、`figure` 目录/容器、类名中的 axis/chart 均不构成豁免。0/auto/百分比、负向对齐和实际 viewport/容器/env/state 关系保持语义；常数 `calc(18px)`、混合负/正 margin 的正项、`@media not print` 仍收敛。每次构建在 `reports/sitewide-design/spacing-build.json` 分别列出唯一源声明、编译记录、角色和精确例外，不用编译重复数冒充源码覆盖数。

绕过 Vite 的出口也要验收：全部生成 HTML 的内联 style 由独立 PostCSS 检查；DOM/React 的直接 style、setProperty、Object.assign 和 JSX 对象由 `dynamic-spacing.mjs` 检查；浏览器再检查已执行交互后的实际 inline style。动态图数据对象中的 axis margin 不属于 DOM CSS。`ResearchChartReader` 的阅读浮层消费同一段落、列表、表格内衬和阅读宽度，原始 SVG 坐标和表格数据保持原义。

## 论文式 Figure / Table，不把网页做成两栏论文

- 单一曲线、单个置信区间：类似 LaTeX `figure`，宽度紧凑，主体居于阅读列内；多曲线/多面板可采用 `figure*` 宽度。不能为了填满卡片而无端放大。
- 图形标题、坐标轴、数值、图注由不同字号角色承担。原始数据点保持来源可核对，点标与轴至少留出真实字形空隙，手机端布局也要检查；所有点有图形语义，黑白打印也能分辨。
- 学术图不默认加圆角卡片边框、阴影或悬浮工具条。浏览器原生 SVG `<title>` 可能作为覆盖式 hover tooltip 盖住正文；为科研 SVG 优先使用 `role=img` + `aria-label` + `<desc>`，既保留读屏解释又不盖图。
- 简短科研数据表使用真正的三线表：顶线、表头线、底线，无逐行视觉隔断；比较对象做行、指标做列，数值右对齐，统计口径在 caption。小表按内容紧凑居中；宽表在默认 iPhone 18 Pro Max 竖屏 440×956 CSS px 和桌面验收视口内保留完整列名和数值，默认不要求横滑。无法清晰放入窄阅读列时，使用来自同一原生单元格、带对应列名的完整逐行记录；不得缩成微字、裁列或丢失未测状态。交互式工作台表和固定演示文稿保留各自语义布局。
- 图上能直接读到的四个数字不必原封不动再铺一段；正文主要讲**结果关系和限制**。图注标明样本、窗口、纵轴裁剪、未测点和不可直接对比的论文协议。不能拿展示比例冒充性能归因。

## 全站实施与例外

### “用实验回答 L 学长十问”长文阅读样板

当用户指定这一页面作为排版参考时，**以真实页面及其 CSS 为可执行的视觉标准**，不要只凭“参考博客风格”的印象重建：

- 样板：`src/pages/research/seed-openevo/study/parameter-memory-results/index.astro`，复用 `.evo-blog.evo-article.evo-approved-reader`；
- 纸张宽度、左右留白、正文、H1/H2/H3、明暗主题：`src/styles/research-article.css`；
- 问题索引、问题编号、折叠目录和科研回应细节：`src/styles/advisor-ten-approved-reader.css` 与 `src/components/research/OpenEvoQuestionIndex.astro`；
- 编号问题标题有一项实际样板例外：`openevo-research-blogs.css` 为十问页面设定 `1.28rem`，已迁入私人档案的旧 W 沟通准备页不再作为公开阅读样板；普通导语 H3 仍由共享层级决定。全站 token 文件被历史排版证据按 SHA 封存，未获得重新分类前不修改其值或添加伪全站变量。
- 必须在 440×956 手机及 1440×1000 桌面上检查：纸张边界、中文长句换行、折叠回答、首屏可读性、明暗两套文本对比。见 `ui-change-visual-acceptance-gate.md`。

此处只是引用已有代码作为样板，**不创建另一份字号或间距数值副本**。样板只适用于明确选用这一阅读模式的长文，不能把它全站强制套用到科研工作台、图表或其他页面。

本规范在所有路由继承同一 token。具体 DOM 仍由 `site.css` / `editorial-hierarchy.css`、`openevo-research-blogs.css`、`research-booktabs.css` 及各科研组件负责。页面角色允许差异：Home Hero、PPT 演示、论文正文、工作台控件、公式、代码、Plot 坐标轴、状态标签；**每一处例外都应有读者任务理由**，不能用“这是历史 CSS”作理由。

不可通过在根部新增一层 `!important` 覆盖修复局部细节。共享 CSS 风格收敛遵守 `docs/agents/current/css-architecture.md`；已有旧 CSS 中的硬编码值属于迁移债务，审计负责显式报告，不得宣布自动全消。不会为通过检查而把字体缩到难辨，也不会只放大总体字号而挤坏中文和图示。

## 验收与防止再次假绿色

1. `npm run audit:typography`：在 `npm run build` 后遍历生成的全部 HTML 路由，沿每个页面实际 link/style/@import 图检查角色 token、字体/字号/行高/间距消费，拒绝漏接的样式、未编译的普通间距和内联绕过；同时检查科研图存在、Q03 无遮挡型 SVG title，并保留全部 CSS 字体声明和剩余硬编码档案。审计不是视觉验收。
   - 2026-10-22 的 5,491 条声明档案是历史收据，不是禁止未来新增页面的永久源码指纹。`verify-typography-ledger.mjs` 保证旧声明未被隐式删除或改值；新文章只允许追加使用既有语义字号 token 的局部声明。改动全站/共享 CSS、删除旧声明或引入新的硬编码字号仍需重新分类。新增页面没有继承历史截图验收，必须取得自己的浏览器证据。
2. `sitewide-typography.spec.ts` 从实际 dist 枚举全部 HTML，在440×956与1440×1000、Chromium/WebKit分别做8批完整路由检查。通过改变并恢复 token，证明 body 字体/行高、main 中实际存在的标题/正文/列表/面板/控件/工具类间距，以及正文阅读宽度确实受 owner 控制；正常页眉不能抵扣孤立正文。静态全路由使用关闭脚本的独立上下文；10个页面类型另做已启用脚本的代表验收、明暗首屏截图，日期和既有科研交互继续各自执行。既有 `test:ui:all` 动态测试清单在 Public PR CI 的双引擎完整分片中运行，不能只本地手动跑新 spec。科研网页必须用生产形态访问，不能只读 Astro 源码。
3. 对 Q03 回归做**旧坏例**和**修正例**：旧 SVG 标注距纵轴 13px 的重叠、原生 title 的遮挡必须判失败；新图在桌面和手机可读、图注不等于正文、数学与真实四点保留。Q01 相邻科研图也需检查；对合法的短方法标签/代码和必要的数学符号不误伤。
4. 每次发布读取最终 Vercel artifact 并浏览器看真实图像。测试绿灯仅证明所检测的性质；读者能否快速理解还需独立冷读，未完成应标记 `NEEDS_READER`。

参考：[苏剑林·科学空间](https://kexue.fm/)；[OpenAI 前端设计建议](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)；[OpenAI Research](https://openai.com/research)；[OpenClaude](https://github.com/Gitlawb/openclaude)。

**历史真人反馈**：对“只是补一个开头”“只加粗”“图题挤压、字体大小不统一”“要全站同类扫描”曾多次提出纠正。每次新例子都必须驱动同类检测和实际产品修复；不得用“规范已经存在”替代验证。
