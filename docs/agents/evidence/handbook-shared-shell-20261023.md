# Handbook integration: product acceptance correction

## Owner feedback and failed acceptance boundary

Source: user message `Sentinel_c91e0d0a356c8191bbc5f57ce1ca8e1c`, 2026-10-23 08:46:38 UTC; faithfully supplied by the parent task. This is a selected project feedback record, not a complete conversation archive or a new canonical design preference.

> 这个技术手册，我不明白你为什么要脱离 BaseModel 网站的整个 UI 设计，并且单拎出来这么一项。
>
> 但实际上，我整个网站的内容排版都是各种散落在一地，没有一个统一的标准。这也是我很苦恼的问题，能不能解决这个问题？

PR #933 passed its exact-head functional, browser and provider checks, and shipped. Those checks did not require shared website navigation, shared theme persistence or shared presentation ownership. The owner rejected that product outcome. Passing the old checks does not close this feedback.

REPEAT-CORRECTION: detached handbook despite existing CSS/shared-site policy → existing Header/app.css/tokens and current #898 typography owner → Production main2157fa2f, seven routes ×390/1440 ×light/dark actual 28 baseline screenshots → isolated handbook integration Draft and controlled Review Preview → invalidate on source/main movement, concurrent same-block edits, or visible/behavioral regression. No Production authorization for this correction.

## Page Expression Brief

The reader should stay inside BaseModel while finding operational documentation. Reuse the real site Header and its research destinations, resource navigation and theme controls. Starlight provides the local documentation directory and Pagefind search, with search composed into the shared Header instead of mounting two competing search dialogs. This is navigation plus ordinary prose, not a dashboard or a paper. Short handbook pages do not need a second right column containing only “概述”. Existing research tables/plots retain their own compact evidence roles; mechanism interactions and catalog/workspace layouts are intentional role differences.

## Existing authorities and first bounded integration

| Concern | Current owner / competing source | This change / remaining gap |
| --- | --- | --- |
| Global navigation | Header.astro; handbook previously default Starlight Header | Render the same Header component, with a named search slot; default native catalog search remains unchanged. Add handbook to existing resources. |
| Theme persistence | Native atlas-theme vs handbook starlight-theme | One ThemeInitialization component and existing Header writes atlas-theme. Remove Starlight theme selector. Test deliberately conflicting legacy storage. |
| Colors, font stacks, space, radius, width | tokens.css; app.css is canonical composition root; handbook had independent literals | Consume app.css and map framework variables to existing tokens. No new token scale or global typography migration. |
| Header geometry | components/header.css + Header scoped structural CSS | Keep existing values/1080 breakpoint. Framework adapter positions only its local directory below that shared header. |
| Reading geometry | reading-width token vs Starlight49rem; technical article has role-specific research-article.css | Handbook consumes reading-width; remove useless overview-only TOC. It retains documentation navigation, not article evidence framing. |
| Scientific objects | research-booktabs, research figure components/TeX and frozen data | No scientific value, uncertainty, table/plot threshold or source changes. |
| Legacy site layout | app.css frozen compatibility layers, component styles and #898 migration | Audit only; no parallel replacement system. #898 remains Draft on #895 at eb0f875a when inspected, with1531 planned migrations/25 selector splits and usability limits. |
| Reader coverage | Astro page-source contracts excluded Starlight docs | Register all three handbook routes and discover MD/MDX sources in the same reader audit. |

Actual baseline reviewed: homepage, Models, Papers, SEED paper, response article, Development and handbook at390/1440, both themes. All28 returned200 with no document overflow; handbook alone lacked shared Header and used distinct theme/font/surface authority. These observations do not establish every route's usability. Native homepage phone first-screen whitespace, Development desktop narrow six cards, article density and #898 table/compare/task-bar findings remain separate gaps, not silently solved here.

## Validation receipts

Before/after screenshots and metrics must be tied to their environment and source. Local dirty-tree evidence is preflight only. Final Draft, hosted checks and actual Review Preview receipts will be added after execution. No Ready, merge or Production publication is authorized.

Retained first failure: initial integration's outer framework header stacking covered the phone directory toggle. The original nine-case suite stopped1 failed/8 not run. Repair belongs in the framework adapter stacking, not shared Header typography. A separate temporary config attempt supplied Starlight locales alongside Astro i18n and failed configuration; retained Astro's existing i18n and used supported translation content instead. Neither failed build is accepted evidence.

Acceptance includes desktop/phone theme continuity, native/handbook navigation, back/forward, repeated global and local menus, Pagefind result navigation and shortcut ownership, no-JS anchors, a real detached-header negative/restoration, and representative sibling screenshots. Agent visual acceptance is not human preference approval or comprehension evidence. Whole-site migration and usability debt remain open.

## First hosted product checkpoint and corrective delta

Draft #941 first HEAD `ce8e7301` received a successful controlled Review build `39929694042`. Actual inspection covered28 default page screenshots plus12 expanded-menu screenshots;14 hosted cross-route/theme/search/history/no-JS states passed. This was deliberately delivered as a product-direction checkpoint before full qualification. It is not owner aesthetic approval.

The full Public `39929667091` and dual-browser `39929691188` exposed missing rendered reader metadata/main-content landmarks on the three newly registered handbook routes. The original screenshot H1 was visible, but did not belong to the shared landmark used by the normal gate. Correction adapts Starlight's static HTML body/main to that same contract; no contract removed or gate weakened. All other routes return their original middleware response unchanged.

Independent actual Preview review also found768px light/dark global menus with handbook text showing through. No native768 open-menu baseline existed, so introduction attribution is unknown. Current candidate state still failed. The bounded correction sets an opaque semantic background in the one canonical Header stylesheet, also covering native Papers;390/768/1080 both themes have an actual transparent-negative/restoration check. #898 patch review showed its Header CSS changes were weight/size tokens in different blocks; exact background-only boundary was coordinated in6361600975 without changing its branch. A static header-background assumption or interaction PASS is not visual proof.

The adapter now references #895/#898 existing article title/section/subsection/body/leading role tokens when that stack is integrated. Until then framework defaults remain explicit compatibility fallback; this does not claim those pending typography values are live or migrate other pages. The first ce8 snapshot and failures remain historical; subsequent HEAD needs its own checks, actual menu images and Review identity.

The b342 Review's JS-disabled comparison found one remaining theme-authority gap: native Papers used the site's light fallback, while Starlight's static html still seeded dark before any theme script. Readable content/no-JS links alone had not tested that shared default. The same static adapter now seeds light; saved dark remains restored by the shared initializer when JavaScript is available. Existing no-JS route cases require that light attribute. This is a real follow-up correction, not permission to relabel b342 qualification as a newer HEAD's result.

Public523计划/512实跑差额保留为失败的覆盖资格：9条reader-journey、2条deep-dives helper用例未运行。复用#898 eb0f875a现成native sharding修复，三个selector/gate/test文件保持源blob，当前main workflow仅追加build后discovery回归一步；不导入898字号迁移或专属WebKit工作。旧235浏览器/Review收据保持原identity，不能冒充新HEAD。

## 第二批：七类页面收敛图与 Development 角色错配

这是 main7eb1 / #898eb0 / #941c376 的代码来源快照与本批实施边界，不是新设计政策或第三套 token。既有 Wish、CSS architecture、tokens 与实际源码继续拥有规范。#898 保持 Draft/base895，不能把它的语义字号值视为已上线。

| 页面族/消费者 | 导航与主题 | 正文/宽度/间距的现有来源 | 角色例外与尚缺项 |
| --- | --- | --- | --- |
| 首页 `/` | AppLayout + Header + atlas initializer | app.css → tokens/foundation；home 自有叙事组件 | landing 可突出研究问题；手机留白仍需 owner 收敛，不能把所有页改文章 |
| 模型目录 `/models/` | 同上 | 原生 `.shell` 最终由 global-shell.css；组件拥有筛选/卡片 | catalog/tool 密度不同于文章；局部字号/旧 patch 仍在 #898 计划迁移中 |
| Papers `/papers/` | 同上 | 同一 `.shell`；PaperExplorer/PaperModelMatrix 拥有查询与矩阵 | 矩阵按内容滚动/最小列宽，#930 行为保留，不强迫与 prose 同宽 |
| 论文记录 `/papers/seed/` | 同上，加文章局部目录 | technicalArticleRoutes 显式集合 + research-article.css 的现有宽阅读框 | 论文/来源/复现资料是阅读角色；不将目录列表也变文章。现有固定 frame 与全站 reading token 的进一步整合需与 #898 联合验证 |
| 科研回应文章 `/research/seed-openevo/study/parameter-memory-results/` | 同上，保留独立十问目录 | 既有文章 owner + advisor reader；科学表/图由 booktabs/figure width owners | 三篇 OpenEVO 博客的浅灰白阅读面有 Wish 明确授权；科学值、状态、负例阈值不能随视觉统一变化 |
| Development `/development/` | 同上 | 本批从错误文章纸框迁回原生 `.shell` / `.page-header`，section 使用 `--space-7`，步骤由组件拥有响应式 | 工具/流程页不是科学文章。本批保留全部文案、手册入口与科研边界；#898 大 hero/全站字号迁移不导入 |
| 手册 `/handbook/` 及两篇子页 | 实际 Header + 同一 atlas initializer；Starlight 框架持有 main/局部目录 | app.css/tokens → 既有 Starlight adapter；阅读宽度消费 `--reading-width` | 文档局部目录和 Pagefind 是合理内容角色；不为抽象统一新增全站搜索索引 |

收敛顺序：先让消费者选对现有模板/语义 owner，再沿 #898 接入 tokens 中 `--type-*` 角色并删除旧局部重复，最后逐族验证获胜级联与响应式。现有 main 的 foundation/editorial-hierarchy、article 固定值和冻结 patch 并非已经全部归一；#898 的1531计划迁移/25拆分仍是后续债务。导航断点归 header.css，shell 响应式归 global-shell.css，内容网格/表格滚动归对应组件，不用一个断点强迫所有内容同形。

本批具体实施：DevelopmentWorkflowPage 解除 research-article 导入及 evo 包装，复用 canonical shell/page-header；AppLayout 已有 main，组件 root 用 div，消除重复 main landmark。步骤普通数字消费现有 font-interface，保留字号/weight；861–1080 的六列改三列并去掉行末误导箭头，<=860 既有单列、宽桌面六列不变。technicalArticleRoutes 将 Development 归还工具角色；所有真正文章的14px、纸框、字体/负例和科学表格断言原样保留，Development 转入独立 shell/可读步骤/无JS回归，没有以删掉文章 coverage 隐藏问题。

已在 #898 评论6363059665/6363122939协调精确文件/边界；只写 #941，未改其分支、tokens、全局 article/global-shell owner 或实验值。c376 及其 Review/CI/持久化证据完整保留为第一批候选；本批必须单独按新 HEAD 验证，不搬用旧通过结果。当前只允许 Draft/Review，无 Ready/merge/Production。

明确还未收敛的重复定义与下一步依赖：`site.css .shell` 的历史1160px/40px 与最终 `components/global-shell.css` 的 token/响应式值仍共存，当前最终owner可执行但旧副本未退役；`site.css h1`、`editorial-hierarchy.css` 的 !important、`research-article.css` 固定文章值与 #898 待上线 `--type-*` 尚未共同完成级联整合，不能在 #941 再复制一套尺度。`AppLayout.astro .research-module-nav-shell` 也仍有独立1160px式宽度，须先区分局部导航用途并实际验收，不能机械全替换。Development 的旧角色边框原始色值与局部字号仍留在其组件owner，未在本批冒充全数token化。科学表格/图宽与普通工具卡宽不是同一个维度。

本批本地结果：build、verify:deploy（880单测+37专项审计）通过；63项针对性Chromium（完整真文章/Reader合同、14个新工具正反例与noJS、手册/共享菜单）通过。初次verify发现新增负例清理代码的Node.remove类型错误，已按现有parentNode.removeChild修正并重新verify通过；保留失败日志，不将初轮错误说成PASS。真实受控c376改前10个Development明暗/宽度状态已拍，新批需另取精确HEAD Review后才能给Hosted验收结论。
