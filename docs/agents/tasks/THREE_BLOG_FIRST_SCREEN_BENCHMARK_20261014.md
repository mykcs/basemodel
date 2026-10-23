# 三篇 OpenEVO 技术博客：网页呈现试验的首个验收切片

**目标：** 研究优秀技术文档网站的表达方式，让 BaseModel 第一眼就讲明白主题，同时让科研证据和精确实验保持可追溯。本文件是一次有边界的试验记录，现行产品目标仍归 [Wish](../../wish/DESIGN.md)，网页规范仍归 [Human Thinking](../current/human-thinking-web-expression-contract.md)、[Reader Attention](../current/site-reader-attention-contract.md) 和 [UI Acceptance](../current/ui-change-visual-acceptance-gate.md)。

## 外部参考的机制与适用范围

参考：[Claude Code Docs — Overview](https://code.claude.com/docs/en/overview)。
借鉴的是按读者目标组织入口、可扫描的导航、首屏定位与按需展开的技术细节。**不复制对方的品牌样式、颜色或 DOM 结构**。BaseModel 当前三篇专题是独立研究文章，和 API 文档的页内任务不同：可以借鉴阅读成本控制，但不应该无条件移植全站常驻侧栏。

## 当前已从 GitHub 源码确认的实现

- `src/pages/research/seed-openevo/study/{openevo-methods,advisor-questions,parameter-memory-results}/index.astro` 三页均以可见的 H1 与带 `data-reader-purpose` 的导言开头，接摘要、三篇导航、页内目录。
- `src/components/research/OpenEvoArticleNavigation.astro` 是三篇共用导航 owner；`src/styles/openevo-research-blogs.css` 局部维护浅灰绿背景与白纸阅读面，不应改全站主题。
- `tests/e2e/advisor-ten-questions-report.spec.ts` 已覆盖 390/768/1440 的 DOM 结构、科学区分、锚点与横向溢出。本 PR 增加**真实浏览器首屏位置**断言，避免仅检查 H1/导言存在就宣布首屏可读。
- 已有 [阅读路径 PR #841](https://github.com/mykcs/basemodel/pull/841)、[表达方式审计 PR #829](https://github.com/mykcs/basemodel/pull/829)、[Q03 科研图文 PR #854](https://github.com/mykcs/basemodel/pull/854) 分别负责更大的结构、内容媒介和科学证据。请先整合/核对这些真实 PR，不在本 PR 重写同一组件。

## 本 PR 的判断

**仅修补一条可自动验收的规则**：手机、平板和桌面首屏应出现正文的实际研究问题和开场解释，且导言位于标题之后。断言读取真实浏览器元素几何；不依赖脆弱的具体文案词串或截图主观打分。

## 尚不能声称完成的事

- **没有在本轮启动 Playwright、构建或打开带 SSO 的 Vercel Preview**；新增测试目前只有源码级回读，运行结果尚未知。
- 没有证明 Claude Docs 与 BaseModel 的 CSS/字体/布局逐像素对比；需两侧真实浏览器视图与匹配视口才可作视觉基准。
- 没有做人类可理解性 A/B 测试。首屏几何 PASS 只能证明打开页面能看到解释，不能证明读者理解科研。
- 任何真实设计调整都须通过 BaseModel 的 `preflight:ui`、浏览器、Vercel 与独立阅读验收后再合并发布。
