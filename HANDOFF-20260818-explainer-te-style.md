# 交接：basemodel explainer × Transformer Explainer 风格改造

> 写给接手 Agent（2026-08-18）。你是同一台 MacBook 上的另一个 Agent，这份文档把你需要的全部上下文一次给齐。

## 1. 用户的原始要求（原话要点）

- 参考网站：<https://poloclub.github.io/transformer-explainer/>（Georgia Tech Polo Club，SvelteKit + D3 + 浏览器内真跑 GPT-2）。
- 用户在做 `basemodel` 网站里的研究讲解页，内容覆盖：**OpenEvo 框架、SEED 框架、WebShop 数据集原理与用法、ALFWorld 数据集原理与用法、两个框架在两个数据集上怎么训练/推理**。
- 要求：UI 设计和功能「尽可能和参考网站一样」；同时担心换参考站的语言（Svelte）会破坏现有工作流。
- 已确认的决策：**不换技术栈**（保持 Astro 7 + React 19 + 原生 CSS/SVG，零新依赖），只抄它的设计与交互模式。

## 2. 我们走过的弯路（重要，别重蹈）

- **第一版（P1）只做到「形似」**：卡片皮肤、圆角阴影、sticky 图、滚动联动、播放条。用户评审原话：「只模仿到了外形，没有模仿到精髓」。
- **用户定义的「精髓」**：通过拆解要展示的事物 + 利用人脑对图像的天然前注意加工，**用不同大小、不同形状、不同颜色、不同粗细等视觉通道直接编码信息**，让人不读文字就靠注意力理解。
- **第二版（V2，当前状态）按 5 条准则重做**，这 5 条就是验收线：
  1. 形状编码数据类型：token=小方块串、概率=横条（长度=值）、参数=格子网格、记忆/证据=卡片堆、分数=仪表条。不允许「万物皆是同款文字卡」。
  2. 大小编码量级：如 WebShop 1.18M 商品点阵池套 1,000 冻结子集小框（必须标注「数量真实、面积压缩示意」这类诚实口径）。
  3. Object constancy：同一实体全程同一视觉对象。ALFWorld 苹果 chip 真实移动 counter→inventory→microwave 且 heated 变琥珀色；SEED 同一批 action token chips 同时出现在 trajectory/plain/skill 三处。
  4. 粗细/明暗编码数值：plain vs skill 概率条长度差 = OPD（标 Δ 徽章）；连线粗细编码强弱。
  5. 变换用动画表达「运算」：θt→θt+1 参数网格变色；全部遵守 prefers-reduced-motion（静态下信息仍完整）。
- 示意数据必须标「示意/DEMO」，unknown 保持 unknown（仓库红线）。

## 3. 东西在哪

- **代码 worktree**：`/Users/myk/Claude/Projects/basemodel/.worktrees/explainer-te-style-20260818`
  - 分支 `agent/explainer-te-style-20260818`（基于最新 origin/main），**改动未 commit、未 push**（等用户验收后才推送，推送前必须再问用户）。
  - 注意：仓库主检出 `/Users/myk/Claude/Projects/basemodel` 停在旧分支且有未提交改动，**不要在那里工作**。
- **本地预览**：`cd <worktree> && npm run preview -- --port 4899`（若已在跑直接访问）。已验证 200 的页面：
  - http://localhost:4899/research/seed-openevo/seed/
  - http://localhost:4899/research/seed-openevo/openevo/
  - http://localhost:4899/research/seed-openevo/loops/
  - http://localhost:4899/lab/ （另有 /en/ 英文镜像）
- **效果截图**（V2 自审，46 张）：`/tmp/te2-wide-*.png`（宽版）、`/tmp/te2-fix-*.png`（修复复核）、`/tmp/te2-*.png`（窄 rail 版）。/tmp 会清，重启后需自己重截。
- **关键源码**：
  - 视觉原子（ChipSequence/ProbBar/ParamGrid/DocStack/Gauge）：`src/components/research/explainer/ResearchExplainerPrimitives.tsx`
  - 6 个 explainer：`src/components/research/explainer/{EnvironmentExplainers,MethodExplainers,ServerExplainer}.tsx` + `src/components/research/InteractiveResearchExplainer.tsx`
  - 样式：`src/styles/interactive-research-explainer{,-core,-environments,-methods}.css`（class 前缀 `irx-`）
  - 滚动联动：`src/components/research/ExplainerScrollLink.astro` + 页面里的 `data-explainer-step`
  - 页面：`src/pages/research/seed-openevo/{seed,openevo,loops}.astro`、`src/pages/{en/,}lab.astro`

## 4. 仓库硬规矩（违反会被验收脚本打回）

开工前必读：`AGENTS.md`、`src/AGENTS.md`、`docs/agents/current/{human-thinking-web-expression-contract,ui-design-principles,ui-change-visual-acceptance-gate,theme-contrast-contract,research-explainer-geometry-acceptance}.md`。
要点：语义颜色语法不可改（blue=环境、amber=经验、red=信号、violet=模型/policy、green=可持久化状态；实线=数据流、虚线=控制）；标题只写主题名词；图必须语义 HTML + SVG 连线；双语 zh/en；窄屏塌缩。

验收三命令（改动后必须全绿）：`npm run verify:deploy`、`npm run build`、`npm run test:ui`。当前全部通过（build 419 页、test:ui 22/22、单测 225/225）。

## 5. 当前进度与下一步

- ✅ P1 形似 + V2 神似均完成，等用户最终验收。
- ⏳ 用户验收满意后：commit + push 分支 → Vercel Preview → 开 PR（走仓库 deployment-policy，一次原子 push）。**git commit/push 前必须再向用户确认。**
-  backlog（用户已认可的方向）：P2 每页配「图嵌在文章里」的完整长文讲解（双语，KaTeX 可选）；P3 用 openevo-experiment 真实 run 的轨迹/分数 JSON 替换示意数据。
