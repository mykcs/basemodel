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
npm run audit:vendor-catalogs
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

添加模型时，复制一个 JSON 文件，确保 `id` 唯一，补齐架构、开放性、研究可用性、硬件档位、来源 URL、`checked_at` 和 `data_status`。如果记录了模型家族的当前旗舰，还要用精确的 `current_flagship_model_id` / `current_open_weight_model_id`，不要用名称模糊匹配。`access` 区分已发布权重、API 和产品入口；API 可用不代表权重可下载，开放权重也不自动等于开源或允许无条件商用。许可证条件使用 `classification`、`custom_license`、`derivative_distribution`、`commercial_use` 和 `conditions` 表达。需要复现时记录模型 revision、tokenizer/config/chat template 是否公开，以及是否必须保留推理历史。

添加论文时，先确认每个 `model_id` 已存在，再填写角色、是否更新权重、进化对象和 benchmark。提交前运行 `npm run audit:claims` 检查字段级证据，运行 `npm run audit:vendor-catalogs` 检查官方目录可访问性；目录 403、404 或重定向只代表访问结果，不会自动推导模型事实。

真实数据必须来自官方模型卡、官方文档、论文、代码仓库或 benchmark 页面，并记录最后核验日期。`verified` 表示关键字段已有可靠来源；`partial` 表示仍有字段未核验。字段缺口使用语义状态：`not_disclosed`（官方未公开）、`not_applicable`（不适用）、`not_reported`（论文/代码未报告）、`not_verified`（尚未核验）、`not_published`（未发布）、`unavailable`（来源不可用）。这些状态都不等于 `false` 或零。

`demo-archive/` 仅作为测试夹具，不进入 Astro content loader、搜索、比较器或 sitemap。新增的主流模型记录使用官方模型卡、官方文档或官方代码仓库，并按字段完整度标记为 `verified` 或 `partial`。Kimi K3、K2.6、K2.5、K2 Thinking、K2 Base、K2 Instruct 分别记录 checkpoint 角色、开放权重/API 分发面和一手来源；“当前旗舰”只作为带日期的来源 claim，不作为永久性能排名。

## GitHub Pages

仓库根目录的 `.github/workflows/deploy.yml` 使用 Pages artifact 和官方部署 action；校验与数据检查分别在 `.github/workflows/validate.yml`、`.github/workflows/update-data.yml`。仓库设置中将 Pages 来源设为 **GitHub Actions**。工作流在构建时自动使用仓库 owner 和 repository name 注入 `site` 与 `base`，因此内部链接和静态资源会保留子路径。

`validate.yml` 在相关文件 push / PR 时运行 check、数据校验、测试和 build。`update-data.yml` 目前只做每周或手动数据检查，不写入仓库、不自动部署错误结果；未来可在人工审核后扩展为创建 PR。

## MVP 限制与路线图

当前只验证页面结构、关系和规则筛选，不提供性能分数、实时价格、自动论文抓取或数据库。下一步应先审查 schema 与页面信息结构，再批量录入真实模型和论文资料；之后再增加事实核验报告、硬件估算、更多多模态字段、搜索索引和人工审核 PR 流程。
