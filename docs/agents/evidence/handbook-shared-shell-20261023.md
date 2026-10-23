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
