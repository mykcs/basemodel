# Agent Foundation Model Atlas

面向 AI 研究者的基础模型选择地图。它把“模型供应层”和“论文采用层”分开维护，用结构化数据回答模型家族、代际、架构、开放性、研究可用性、硬件门槛和论文角色关系。

在线访问：<https://basemodel.pages.dev/>

## 架构

长期发布链路是：

```text
GitHub -> Cloudflare Pages
```

GitHub 是唯一代码源与协作面；Cloudflare Pages 负责 Preview、Production、构建、部署前确定性验证和托管。GitHub Actions 与 GitHub Pages 已有意退役。不要因为历史文档中出现旧 workflow 或双托管方案就恢复它们，除非仓库 owner 明确要求重新引入自动 CI/第二托管平台。

Cloudflare dashboard 的 Build command 应保持为：

```bash
npm run build:cloudflare
```

该命令先执行 `npm run verify:deploy`，再运行 Astro production build。`verify:deploy` 包含 Astro/TypeScript check、数据/关系校验、semantic/claims/freshness audit 和 Vitest。这些检查不依赖外部网络，失败会阻止 Preview/Production 发布。

完整 Chromium + WebKit Playwright E2E、vendor catalog audit、URL/source-health probe 仍保留在仓库中，但不在每次 Cloudflare build 自动执行；重大 UI、routing、i18n、Astro major 或浏览器兼容改动时由 Agent/本地按需运行。

## 本地运行与验证

需要 Node.js 22（或满足 Astro 当前要求的较新 Node.js）。

```bash
npm install
npm run dev
npm run verify:deploy
npm run build
npm run test:e2e
npm run audit:vendor-catalogs
npm run audit:urls
npm run audit:coverage
```

默认站点在 `http://localhost:4321`，生产部署语义为根路径 `/`。如未来引入正式自定义域名，可在 Cloudflare Production 环境设置 `PUBLIC_SITE_URL=https://<domain>`；Preview 会继续使用 Cloudflare 当前部署 URL，避免 canonical/OG 冒充 Production。

## 数据目录与添加方式

- `src/content/models/*.json`：模型 checkpoint，一文件一条记录。
- `src/content/papers/*.json`：论文记录；通过 `models[].model_id` 引用模型。
- `src/lib/schemas.ts`：Zod schema；非法字段会阻止校验或构建。
- `src/lib/modelFilters.ts`、`recommendation.ts`、`hardware.ts`：纯规则和可测试逻辑。

添加模型时，复制一个 JSON 文件，确保 `id` 唯一，补齐架构、开放性、研究可用性、硬件档位、来源 URL、`checked_at` 和 `data_status`。来源可选填 `title`、`publisher`、`published_at`、`revision`、`locator`、`notes`，并用 `supports` 精确列出它支持的字段。`audit:claims` 会生成 `reports/claim-audit.{json,md,csv}`；没有字段级 `supports` 的旧记录会标成 `legacy-unmapped`，不会伪装成已核验。如果记录了模型家族的当前旗舰，还要用精确的 `current_flagship_model_id` / `current_open_weight_model_id`，不要用名称模糊匹配；没有官方 ID 就显示“待核验”。`access` 区分已发布权重、API 和产品入口；API 可用不代表权重可下载，开放权重也不自动等于开源或允许无条件商用。许可证条件使用 `classification`、`custom_license`、`derivative_distribution`、`commercial_use` 和 `conditions` 表达。需要复现时记录模型 revision、tokenizer/config/chat template 是否公开，以及是否必须保留推理历史。

添加论文时，先确认每个 `model_id` 已存在，再填写角色、是否更新权重、进化对象和 benchmark。提交前运行 `npm run audit:claims` 检查字段级证据，运行 `npm run audit:freshness` 检查发布日期、旗舰引用和已验证记录的一手证据。`npm run audit:vendor-catalogs` 与 `npm run audit:urls` 依赖外部网络，只在需要时运行；目录 403、404、重定向或 timeout 只代表访问结果，不会自动推导模型事实。

真实数据必须来自官方模型卡、官方文档、论文、代码仓库或 benchmark 页面，并记录最后核验日期。`verified` 表示关键字段已有可靠来源；`partial` 表示仍有字段未核验；`claim_status: claim_verified` 只用于字段级证据覆盖完成的记录。字段缺口使用语义状态：`not_disclosed`（官方未公开）、`not_applicable`（不适用）、`not_reported`（论文/代码未报告）、`not_verified`（尚未核验）、`not_published`（未发布）、`unavailable`（来源不可用）。这些状态都不等于 `false` 或零。

`demo-archive/` 仅作为测试夹具，不进入 Astro content loader、搜索、比较器或 sitemap。新增的主流模型记录使用官方模型卡、官方文档或官方代码仓库，并按字段完整度标记为 `verified` 或 `partial`。

## 自动发布边界

`npm run build:cloudflare` 的 blocking checks 是确定性的仓库内检查：

- `npm run check`
- `npm run validate`
- `npm run audit:semantic`
- `npm run audit:claims`
- `npm run audit:freshness`
- `npm test`
- `npm run build`

以下能力保留但不属于每次发布 gate：

- `npm run test:e2e`：Chromium + WebKit 浏览器回归。
- `npm run audit:vendor-catalogs`：官方厂商目录外部网络审计。
- `npm run audit:urls`：来源 URL 健康检查。
- `npm run audit:coverage`：覆盖率/数据健康报告（当前主要生成报告，不额外提供有效 blocking 信号）。
- `npm run audit` / `audit:full`：按需执行更完整的审计组合。

## MVP 限制与路线图

当前不提供实时价格、自动论文抓取或数据库。事实更新仍需要来源核验与人工/Agent 维护；如果以后需要周期性监控，应重新选择合适的 scheduler/CI 平台，而不是为了历史兼容恢复 GitHub Actions。
