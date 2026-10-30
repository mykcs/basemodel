# BaseModel 双平台可逆发布：Vercel ↔ Cloudflare Workers + Access

状态（2026-10-30）：**Cloudflare Access 保护的备用站已经部署并通过有界验收；尚未切换正式入口。Vercel 仍是唯一正式发布端。** 这份操作说明不授权更改域名、DNS、GitHub 仓库可见性、账单套餐或访问政策。当前执行架构以 [`hosting-architecture.md`](../../agents/current/hosting-architecture.md) 和实际 GitHub/Vercel/Cloudflare 设置为准。

## 给不熟悉部署的同学

- **网站本体**：一份 Astro 静态源码，分别打包到两家服务商；不能让两份版本偷偷分叉。
- **两把门锁**：Vercel 继续使用自己的访问保护；Cloudflare 备用站必须使用 **Cloudflare Access**，而且未登录时连静态图片、JSON、旧路径也不能看到。
- **两把钥匙**：部署凭证仅放在 GitHub 受保护 Environment 的 secrets，不在公开代码、PR、构建产物中。
- **保留退路**：Cloudflare 上线也不删除 Vercel 项目、不解除 Vercel Authentication、不删除原域名。
- **真正的统一网址切换**：只有使用一个自己控制 DNS 的域名才能实现“不换链接就换后台”。当前项目仅验证到 `basemodel-preview.vercel.app`，还没有可以操作的自有域名，故不能声称一键切换同一个网址。

## 快速切换操作卡（当前只有两个不同的登录网址）

2026-10-30 的实际控制目标：**当一个站点不可用时，让已授权的读者尽快使用另一条已验证的链接继续阅读；保留原站和回退能力。** 这不是零停机、同一域名自动切流的 SLA。负责人先查 GitHub、Vercel、Cloudflare 的实时发布状态，不凭本文件的历史 SHA 假设两边已同步。

| 想做什么 | 最短安全路径 | 硬性验收 |
| --- | --- | --- |
| **继续使用现行正式站** | 访问 `https://basemodel-preview.vercel.app/`；保持 Vercel Authentication | 登录用户能看首页、研究主路径、JSON/静态资源；匿名用户不能直接看到页面 |
| **启用 Cloudflare 备用链接** | 若已部署的备用 SHA 与要展示的版本相同且 Access/内容复验通过，可直接向指定读者提供下方备用 URL，**无需重新构建**。版本过旧则手动运行 `Protected Cloudflare Standby (manual)` → `plan`、核验后 → `deploy` | 先读回 `main`、两端真实部署 SHA，部署时 Access 前后无 Cookie 4 路径 PASS；有权限的浏览器再检查首页、科研页、旧路由、JSON、SVG、手机视口 |
| **从 Cloudflare 回切 Vercel** | 将给读者的入口链接重新指向仍受保护的 `https://basemodel-preview.vercel.app/`，不删除 Cloudflare、也不关闭任一登录门 | Vercel 正式别名 READY 且真实登录页正常；登记回切时间、原因和当前版本 |
| **未来想同一网址切服务商** | 先取得可控的自有域名，再独立设计绑定、TLS、两个平台身份认证、DNS/路由切换、缓存 TTL 和回滚；现阶段**未实施** | 切流前后登录门、资源地址、重定向、版本和域名验证都通过；不能声称 DNS 无传播延迟 |

当前备用 URL：`https://basemodel-access-standby.gemini202405.workers.dev/`（生产 Worker，已加 Access）；现行正式 URL：`https://basemodel-preview.vercel.app/`（Vercel Authentication）。**只切给读者的入口链接，并不会自动同步两个服务商的内容。** 一个平台失效不能成为关闭另一平台登录门的理由。旧 `pages.dev` 或 shadow 等历史地址不在这张受保护入口清单，必须另行排查公开历史副本。

**值班者的四项读回证据：** ① 精确 Git commit SHA 和平台部署版本；② 匿名登录门（包括资源文件）拒绝/跳转；③ 已授权浏览器核心路由与手机视口；④ 入口链接、决定人、切换时刻、异常与回退记录。缺一项不得向他人声称双平台等价或成功切流。GitHub Actions 的公开仓库免费标准 Runner 用于 CI，不能把这张卡当作增加 Vercel 自动部署、修改仓库可见性或自动购买套餐的批准。

## 已实现的仓库端开关

| 入口 | 动作 | 是否发布 | 是否修改正式网站 |
| --- | --- | --- | --- |
| `npm run build:workers:standby` | 运行完整 `verify:deploy`、构建 noindex 备用静态文件，转换 Vercel 路由与安全头 | 否 | 否 |
| `npm run verify:workers:standby` | 检查路由转换、访问保护的正反样例 | 否 | 否 |
| GitHub Actions `Protected Cloudflare Standby (manual)` → `plan` | 从当前 `main` 精确 SHA 构建并保留一天的备用文件 | 否 | 否 |
| 同一 Actions → `deploy` | 同步精确 SHA、**先查 Access 登录门、再部署、再查 Access** | 仅受保护的 Cloudflare 备用 Worker | 否 |
| 保留的 Vercel Git/Vercel 域名 | 原生产路线持续独立运行 | 是（现行流程） | 不受上述开关影响 |

绝不在 PR、`push`、新分支上自动部署 Cloudflare；工作流只允许人工在 `main` 发起，部署 job 还需要 `cloudflare-protected` Environment。`wrangler.standby.jsonc` 使用**独立** Worker `basemodel-access-standby`，`preview_urls=false`，不覆盖历史 `basemodel-workers-shadow` 或公开 `basemodel.pages.dev`。生成的 `_redirects` 逐条继承 `vercel.json` 中 154 条路由；`_headers` 继承安全响应头并对所有路由加 `X-Robots-Tag: noindex, nofollow, noarchive`。已在 Cloudflare 受保护备用站完成有界 HTTP 与真实浏览器回归；这不等于对 273 条路由逐条做过跨平台等价性证明。

## 首次安装的硬门槛（2026-10-30 已执行；以后重新部署仍需重验）

1. 在已有 Cloudflare 账号上**先建一个只有无敏感占位内容的** `basemodel-access-standby` Worker，**不要上传 BaseModel**。
2. 在 Cloudflare Workers → 该 Worker → Settings/Access，创建针对该 Worker **production `workers.dev` 全路径**的 Access 登录策略，只允许用户指定的身份登录；确认预览 URL 关闭。如果后续绑定自有域名，重新单独证明自有域名也被 Access 覆盖。不能只保护某一条页面路径，不能只保护 preview。
3. 在 GitHub 仓库配置受保护的 Environment `cloudflare-protected`（建议审批人），其中配置 `CLOUDFLARE_STANDBY_API_TOKEN`（仅 Workers 部署最小范围）、`CLOUDFLARE_STANDBY_ACCOUNT_ID`；把 `CLOUDFLARE_PROTECTED_URL` 设成该 Worker 的**完整 HTTPS origin 且以 `/` 结尾**，例如 `https://basemodel-access-standby.<account>.workers.dev/`（示例是假地址）。它必须是该独立 Worker 的 `workers.dev` 域名。
4. 在尚未部署 BaseModel 的情况下先运行 `CLOUDFLARE_PROTECTED_URL=... npm run verify:cloudflare-access`。脚本对 `/`、`/index.html`、静态图片和不一定存在的 JSON 路径逐个发起**无 Cookie / 无授权 GET**，仅接受准确的 Cloudflare Access 登录重定向。`200`、普通 `403`、其他登录页都视为不合格并拒绝部署。不能把单纯存在一个 302 就当成访问保护。
5. 在 GitHub Actions 上手动发起 `plan`，核验产物 SHA、`noindex`、路由转换和完整检查均通过，再手动发起 `deploy`。部署在上传任何 BaseModel 文件前会重复执行 Access 检查，上传后再检查；有任何失败就停止，**不得拿失败的 Worker 当成可用备用站**。
6. 用有权限的**真实登录浏览器**完成 Cloudflare Access OTP/SSO 验收，检查首页、科研长页、动态旧路径、`/model-data/`、图片和 iPhone 18 Pro Max 视口；再用无痕窗口确认都不能绕过门锁。测试失败时撤回/禁用该 Worker 路由，不改 Vercel Production，修好后重验。

> 告警：匿名登录跳转 PASS 只是最低要求，不等于任何未在名单中的用户都无法登录。Cloudflare 端当前已读回仅允许指定身份的 Access 策略；后续变更仍须重新检查策略和实际登录旅程。

## 首次上线实证（2026-10-30）

- **备用站：** [BaseModel Cloudflare Access 入口](https://basemodel-access-standby.gemini202405.workers.dev/)；Cloudflare Worker `basemodel-access-standby`。Vercel Production 未修改，正式入口仍是 `https://basemodel-preview.vercel.app`。
- **可追溯发布：** [GitHub Actions #41044575890](https://github.com/mykcs/basemodel/actions/runs/41044575890)，从 `main@e7eee10998509936acce147d600b6e432fd7c683` 的完整构建产物发布；构建与部署两个 job 都真实成功。Wrangler 上传 690 个新/变更静态资源；构建覆盖 273 个静态页面，生成 154 条重定向与 2 组安全头。
- **发布前后保护：** 同一次 deploy job 在上传前和上传后均证明四个无 Cookie 路径（`/`、`/index.html`、`/og-cover.svg`、`/model-data/hosting-access-probe.json`）准确重定向到 Cloudflare Access 登录，未出现可匿名读取的 200 响应。只允许指定身份的策略已从 Cloudflare 管理界面读回，部署密钥仅限该独立 Worker 且设置一年到期。
- **真实浏览器：** 使用已有获准会话检查首页、`/research/seed-openevo/flow/`、`/research/seed-openevo/study/results/`、`/model-data/catalog.json`（167 个模型条目）、`/og-cover.svg`，以及旧路径 `/en/compare` → `/compare/`。这些页面/资源可以加载；iPhone 18 Pro Max CSS 视口 `440×956` 的首页、学习流程页无横向溢出，菜单可正常展开和收起。
- **边界：** 以上是代表性页面与匿名路径实测，非所有路由逐一验收；尚无自有域名，所以只能在两个**不同网址**间快速回切，不能无感切换同一网址。GitHub 仓库当前仍公开；Access 保护托管页面，**不保护公开源码**。凭据值、Cloudflare 账户 ID、身份邮箱与私密策略明细不得放在仓库文档。

## 可操作的切换与回切

**目前是双入口，不是单网址切换**。现有 Vercel 域名属于 Vercel；Cloudflare `workers.dev` 属于 Cloudflare。不能仅凭改 `PUBLIC_SITE_URL`、README 或 DNS 让一个平台接管另一个平台的 `.vercel.app` / `.workers.dev` 地址。两个服务商要各自维持访问保护。

**启用 Cloudflare 备用入口**（不改全站默认入口）：

1. 从 `main` 手动执行 `Protected Cloudflare Standby` → `deploy`，从 GitHub 读回该运行的准确源提交 SHA、artifact、Access pre/post PASS。
2. 经真实登录与完整页面回归后，才将指定受众的访问**链接**切到 Cloudflare 受保护的 `workers.dev` 地址。记录何人、何时、哪一 SHA、哪些入口及证据。原 `basemodel-preview.vercel.app` 继续可用。

**立即回到 Vercel**：停止继续对外提供 Cloudflare 备用链接，使用仍受 Vercel Authentication 保护的 `https://basemodel-preview.vercel.app`。这不需要修改源码、重跑模型或重新构建站点。保留/撤回旧链接按敏感性具体决定；不要因回切关闭 Cloudflare Access。

**以后有自有域名时**：可以单独设计 `www.<owned-domain>` 作为稳定统一入口，先分别验证两个服务商、TLS、Access/SSO、缓存和资源路径，再以有记录的 DNS/路由开关实现切流。切回前确认缓存 TTL 与域名验证；不可把 DNS 改动说成零传播延迟。**这是尚未实施的第二阶段**，需要域名所有权、实际 Cloudflare 配置及明确的外部切流资格。

## 任一阶段必退回条件

- 无痕请求看到 HTTP 200 正文或任何静态文件；Access 保护缺失、身份白名单错误、Cloudflare preview/custom domain 漏网；
- Cloudflare 登录后的用户旅程、旧路由、模型 JSON、图片、安全响应头与 Vercel 同源结果不等价；
- 执行 SHA 与测试 SHA 不一致、保护策略没有读回、`noindex` 消失；
- 任何一步要求关闭 Vercel Auth、扩大 token 权限、改变公开/私有状态、自动付费升级或删除已上线退路。

发生这些条件时：**Vercel 保持原状**，隔离 Cloudflare 入口、保留证据并修复，然后从头验收。绝不“先开放访问、以后再加门锁”。

## 参考依据（官方）

- [Cloudflare Workers Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)：生产及预览 Worker 的登录保护、基于 Worker 的 Access。
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)：静态文件直接发布。
- [Workers `_redirects`](https://developers.cloudflare.com/workers/static-assets/redirects/)：307/308 和动态路径语法。
- [Workers `_headers`](https://developers.cloudflare.com/workers/static-assets/headers/)：静态响应头规则。
- [GitHub Actions environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)：带审批的发布边界。
