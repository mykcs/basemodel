# BaseModel 全站注意力与阅读路线 — 2026-10-09

Status: **Draft design candidate for owner review; not a global visual-template mandate**

## 直接用户反馈

用户明确指出：全站虽然采用了某种编辑式暖色主题，但打开一页时注意力仍然分散；希望在开头用很短的几条横线式目录，使读者立即理解“能从这里学到什么”。这是**阅读顺序与权重**问题，不是再模仿一个颜色/圆角/巨幅留白主题的请求。

## 本次观察（当前 main）

- 首页一个过大的研究问题占据第一视觉中心；仅压小/上移整个 hero 会使手机第一屏出现原本不属于此屏的第三个可点击目标。正确修法不能以多露按钮换取少留白。
- SEED、OpenEvo、ALFWorld、学习循环等机制页先显示复杂的交互/实验图，在长正文目录之前没有“本页能够学懂三件什么事”。
- 研究结果已有 `paper-nav`、模型详情已有 `model-detail-nav`、论文学习指南已有 `learning-track-nav`，却可能同时出现全站右侧无文字 `PageOutline`，给用户制造重复路径。
- 主页已有明确“看目前发现 / 先理解这项研究”两个选择；目录型模型浏览、工作台和比较页则需要真实筛选/操作，不应再添加三条教育链接分流注意力。

## Page Expression Brief

- **谁读**：首次访问 BaseModel、知道部分研究词汇但没有完整实验上下文的技术读者；也包括过几个月重访的人。
- **页面角色**：因果机制/教学页面走 narrative，结果页先见证据，模型详情走 reference，首页/目录页走 choice，workspace 走 operational，比较页走 comparison。
- **典型困惑**：“这个页面这么多系统图，到底学什么？从哪里看？”；页面尚未可见的深层细节不需要第一屏复述。
- **目标心智模型**：首次 5–10 秒看到主题、一个主张，以及 2–5 个承载明确学习结果的自然顺序；滚动时不会被另一套匿名导航打断。
- **下一步**：可从任一简短学习项跳到拥有证据/说明的真 section；阅读顺序与深层科学审计互不取代。
- **介质**：原生 HTML `<nav><ol><li><a href="#section">…` + thin border，不使用交互岛，不复制动态标题，不做视觉卡片。只给有明确认知路线的 narrative / reference 页。
- **密度**：标题/一句介绍是最重要的；学习路线是三个次级句子；正式互动/图/证据保持在后，支持 native anchor 和 no-JS。
- **证据**：每个目录链接绑定唯一已存在的章节 owner；Renderer/H1/Reader Contract budget、Chromium/WebKit、390/768/1280/1440、light/dark、overflow 和 keyboard 完整验收。

## 本轮实现（不复制整个网站的视觉外壳）

1. 增加共享静态 `PageLearningPath.astro`，要求 2–5 个真实双语目标、唯一锚点、短编号与细横线；CSS 仅该组件所有。
2. 复用在 SEED / OpenEvo / ALFWorld / Benchmarks / Loops 五类 Research Flow 的内容 owner，所有 anchor 绑定实际三段内容。
3. 在方法论页提供“未知、证据、推荐边界”三行；在没有已有丰富学习路径的论文详情页提供 fallback。已有 `PaperLearningGuide` 时不重复。
4. 全站 `PageOutline` 检查真实 `data-reader-guide`、`paper-nav`、`model-detail-nav`、`learning-track-nav`、`page-contents`、WebShop 章节路线；choice/operational/comparison 页面避免匿名浮动 rail；保留没有显式主目录的长篇论证页原能力。
5. 首页减少标题字号和排版压迫，但不得改变原首屏的仅两个主选择预算；当尝试降低 hero min-height 导致预算回归时，收回该局部修改，而不是放宽 Gate。

## 不是本轮“全站统一”

- **不是**给首页、模型筛选、比较页、workspace 都塞一份固定的三项模板；
- **不是**将颜色替换为另一种流行产品主题；仍尊重当前暖中性 + terracotta、证据色的语义；
- **不是**删除论文的科学证据、结果限制、运行准则；只是将导读放在合适的首层；
- **不是**吞并尚未合并的 PR #806 (Design System v1) 或 PR #840 (WebShop 整页叙事)：`SeedOpenEvoResearchDetail.astro` 是与 #840 的同文件 owner，之后须以真实合并树检查和解决差异。

## 机械防回退

`src/lib/pageLearningPath.test.ts`、`tests/e2e/page-learning-path.spec.ts`、Reader Contract/viewport Gate 和保留右侧 outline 的现有用例，共同分别覆盖：
- 有链接的导读真实指向所有章节；
- 关闭 JavaScript 时仍可跳转；
- 宽/窄、亮/暗、滚动与页面溢出安全；
- 已有所有权明确的目录不会同时出现另一套匿名浮动导航；
- 首页仍满足两个第一屏主要选择，不通过增大预算伪造 PASS。

## 验收记录和未完成边界

代码提交、exact-head CI、人工设计预览与主干合并各自独立记账。应先得到真实 Chromium / WebKit 和 69 routes 的 Reader Contract 证据，再做成本较高的远端预览。最终视觉接受由读者（非单纯测试绿色）判断。

- [x] 源码/设计规范读取；审查首页、Flow、Research Results、Model、Paper、Workspace、Guide 等代表路径
- [x] 局部语义型组件、内容锚点及跨页面去重实现
- [x] 16 个单元测试和站点 deterministic gate 已通过
- [x] Chromium 在 69 个公开 route 的桌面/手机首屏预算全部通过；首次收缩首页导致 3 个竞争交互目标超出预算 2，已恢复首屏可见边界，没有提高预算阈值
- [x] 同页跳转的 briefing 缩放 test 原有竞态只增加了等待明确的 1280px 期望尺寸，保留所有尺寸断言；隔离回放 PASS
- [ ] 最新候选 Chromium / WebKit 强 UI preflight
- [ ] exact-head GitHub Public PR CI
- [ ] owner 浏览器冷读与最终选用
