# Agent Foundation Model Atlas

面向 AI 研究者的基础模型选择地图。它把“模型供应层”和“论文采用层”分开维护，用结构化数据回答模型家族、代际、架构、开放性、研究可用性、硬件门槛和论文角色关系。

在线访问：<https://mykcs.github.io/basemodel/>

## MVP 能做什么

- 首页实验选择器：按实验方式、任务、资源和目标给出规则筛选候选；候选不是性能排名。
- 模型浏览器：组合筛选、搜索、排序和 URL query 同步。
- 模型详情、家族树、2–5 个 checkpoint 对比。
- 论文列表、论文详情和论文—模型角色矩阵。
- Astro Content Collections + Zod schema、关系检查、基础单元测试。
- GitHub Actions 数据校验、构建和 GitHub Pages 部署。

## 本地运行

需要 Node.js 22（或满足 Astro 当前要求的较新 Node.js）。

```bash
npm install
npm run dev
npm run check
npm run validate
npm test
npm run build
npm run audit:claims
npm run audit:freshness
npm run audit:vendor-catalogs
npm run audit:urls
```

默认站点在 `http://localhost:4321`。GitHub Pages 子路径构建可设置：

```bash
PUBLIC_SITE_URL=https://OWNER.github.io PUBLIC_BASE_PATH=/REPOSITORY npm run build
```

## 数据目录与添加方式

- `src/content/models/*.json`：模型 checkpoint，一文件一条记录。
- `src/content/papers/*.json`：论文记录；通过 `models[].model_id` 引用模型。
- `src/lib/schemas.ts`：Zod schema；非法字段会阻止校验或构建。
- `src/lib/modelFilters.ts`、`recommendation.ts`、`hardware.ts`：纯规则和可测试逻辑。

添加模型时，复制一个 JSON 文件，确保 `id` 唯一，补齐架构、开放性、研究可用性、硬件档位、来源 URL、`checked_at` 和 `data_status`。来源可选填 `title`、`publisher`、`published_at`、`revision`、`locator`、`notes`，并用 `supports` 精确列出它支持的字段。`audit:claims` 会生成 `reports/claim-audit.{json,md,csv}`；没有字段级 `supports` 的旧记录会标成 `legacy-unmapped`，不会伪装成已核验。如果记录了模型家族的当前旗舰，还要用精确的 `current_flagship_model_id` / `current_open_weight_model_id`，不要用名称模糊匹配；没有官方 ID 就显示“待核验”。`access` 区分已发布权重、API 和产品入口；API 可用不代表权重可下载，开放权重也不自动等于开源或允许无条件商用。许可证条件使用 `classification`、`custom_license`、`derivative_distribution`、`commercial_use` 和 `conditions` 表达。需要复现时记录模型 revision、tokenizer/config/chat template 是否公开，以及是否必须保留推理历史。

添加论文时，先确认每个 `model_id` 已存在，再填写角色、是否更新权重、进化对象和 benchmark。提交前运行 `npm run audit:claims` 检查字段级证据，运行 `npm run audit:freshness` 检查发布日期、旗舰引用和已验证记录的一手证据，运行 `npm run audit:vendor-catalogs` 检查官方目录可访问性；目录 403、404 或重定向只代表访问结果，不会自动推导模型事实。

真实数据必须来自官方模型卡、官方文档、论文、代码仓库或 benchmark 页面，并记录最后核验日期。`verified` 表示关键字段已有可靠来源；`partial` 表示仍有字段未核验；`claim_status: claim_verified` 只用于字段级证据覆盖完成的记录。字段缺口使用语义状态：`not_disclosed`（官方未公开）、`not_applicable`（不适用）、`not_reported`（论文/代码未报告）、`not_verified`（尚未核验）、`not_published`（未发布）、`unavailable`（来源不可用）。这些状态都不等于 `false` 或零。

`demo-archive/` 仅作为测试夹具，不进入 Astro content loader、搜索、比较器或 sitemap。新增的主流模型记录使用官方模型卡、官方文档或官方代码仓库，并按字段完整度标记为 `verified` 或 `partial`。Kimi K3、K2.6、K2.5、K2 Thinking、K2 Base、K2 Instruct 以及 Kimi Linear、Kimi-VL、Kimi-Audio、Kimi-Dev、Moonlight、K2 Instruct 0905 分别记录 checkpoint 角色、开放权重/API 分发面和一手来源；“当前旗舰”只作为带日期的来源 claim，不作为永久性能排名。家族目录中的专线模型使用 `latest_specialized_model_ids`，不会替代旗舰 ID。

## CI、数据检查与 GitHub Pages

`.github/workflows/validate.yml` 使用 change-aware validation，但最终发布门槛不会因为 PR 加速而降低。PR 会先根据完整 diff 分类：只有 `src/content/models/*.json` / `src/content/papers/*.json` 的改动属于 `data`，只改 `README.md` / `docs/*` 属于 `docs`，其他任何代码、schema、脚本、依赖、测试、workflow、配置或资产改动都属于 `full`。重命名按删除旧路径和新增新路径处理，避免把代码文件改名到文档目录后误判成 docs-only。

三种 PR 路径分别为：`full` 执行 Static checks + 固定 Playwright Chromium/WebKit 全量 E2E；`data` 执行 Static checks + 7 条 hosted-Chrome 数据驱动 smoke；`docs` 执行 Static checks。Static checks 包含 Astro check、数据/关系校验、semantic/claims/freshness audit 和单元测试。固定名称的 `Validation gate` 会在所有上游 job 结束后校验选中的 tier 是否真的成功，classifier 失败也会让 gate 失败。仓库分支保护/ruleset 如启用 required checks，应将 **Validation gate** 设为稳定 required check。

`push` 到 `main`、手动运行 Validate 和每周定时回归始终使用 `full`，不会走 PR 降级路径。不同事件类型使用不同 concurrency group，因此定时或手动回归不会取消生产 `main push` 的验证。

`.github/workflows/deploy.yml` 没有手动部署旁路。Pages 只会在本仓库 `main` 的 `Validate Atlas` 因 push 触发且成功后运行，并 checkout 那次验证对应的精确 commit SHA，再通过 Pages artifact 和官方部署 action 发布。仓库设置中将 Pages 来源设为 **GitHub Actions**。

`.github/workflows/update-data.yml` 每周或手动运行更完整的数据健康检查，不写入仓库、不自动部署错误结果。`.github/workflows/vendor-catalog-audit.yml` 每日检查外部官方目录，保留 JSON/Markdown artifact 和 Step Summary；单个站点的 403/404/timeout 只表示访问状态，但配置为空或所有目录都不可用会使 audit 失败。

`.github/dependabot.yml` 每周检查 npm 与 GitHub Actions 更新。GitHub Actions 在 workflow 中继续使用 immutable commit SHA；Playwright test package 与固定 Playwright container 版本保持一致，升级 Playwright 时必须同时更新 package、container tag/digest 并跑完整 E2E。

## MVP 限制与路线图

当前只验证页面结构、关系和规则筛选，不提供性能分数、实时价格、自动论文抓取或数据库。下一步应先审查 schema 与页面信息结构，再批量录入真实模型和论文资料；之后再增加事实核验报告、硬件估算、更多多模态字段、搜索索引和人工审核 PR 流程。
