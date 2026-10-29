# Agent Foundation Model Atlas

## Historical Codex dialogue archive

For prior product, deployment, or research-workbench context, consult the
private [`Codex-Dialogue` basemodel archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only; current source, deployment state, and task
requirements remain authoritative.

面向 AI 研究者的基础模型选择与论文采用地图。它把模型供应层与论文采用层分开维护，用结构化数据回答模型家族、代际、架构、开放性、研究可用性、硬件门槛和论文角色关系。

在线访问：<https://basemodel-preview.vercel.app/>

Agent 交接与历史研究工作台上下文：[`docs/agent-context/`](./docs/agent-context/)。当前执行规则仍以 [`AGENTS.md`](./AGENTS.md) 和 [`docs/agents/`](./docs/agents/) 为准。

## 当前部署架构

```text
GitHub = source of truth
ordinary PR         -> GitHub Actions public-ci-gate
final accepted PR   -> ci/vercel-gate-final -> Vercel Preview
main                -> Vercel Production
Production           -> https://basemodel-preview.vercel.app
Cloudflare Pages     -> frozen legacy rollback snapshot; normal Builds = 0
```

当前验收分为两个独立环节：GitHub Actions 的 `public-ci-gate` 负责确定性检查及按风险选择的浏览器测试；Vercel 负责最终候选的构建／部署检查与 `main` 的 Production 发布。Vercel 当前实际构建命令是 `npm run build`，**不能把 Vercel 构建通过等同于全套 CI 通过**。GitHub Pages 已退出日常发布；Cloudflare Direct Upload、Pages build helper 和 Workers shadow 只保留作回滚或 Cloudflare-specific 诊断。

直到 Cloudflare Pages 的 Git 自动部署能在账户侧关闭之前，分支和 release merge 使用 `[CF-Pages-Skip]`，避免旧 Pages 项目因 Git 提交再次消耗 Build。

新的 Coding Agent 请从 `AGENTS.md`、`docs/agents/LATEST.md`、`docs/agents/current/hosting-architecture.md` 和 `docs/agents/current/deployment-policy.md` 开始。

## 仓库隐私与构建频率：拟议方向（尚未切换）

考虑到 BaseModel 的构建频率已明显下降，**倾向在完成脱敏及 CI 迁移验收后将 GitHub 源码仓库改为私有**。截至本说明形成时，仓库仍为公开；这里记录的是意向，**不是已经改为私有或已切换 CI 的声明**，也不自动授权更改可见性、订阅或仓库保护规则。

按实际负载区分两种方案：

- **膨胀期：一天明显超过 100 次部署。** 如果源码已经通过公开安全审查且确实需要开放，公开 GitHub 仓库可使用标准托管 Actions 运行所需测试；若源码必须私有，应保持私有并评估 Vercel Pro、更合理的合批策略与独立的 CI 计算预算，不能为获取免费额度自动公开源码。Vercel Pro 官方每日部署上限为 6,000 次，但仍有构建时间、并发与使用成本约束。
- **平稳期：一天不超过约 100 次部署。** 倾向私有 GitHub 仓库，由 Vercel 负责网站构建、Preview 和 Production；独立的单元、浏览器、隐私与合并检查仍需要经过资格验证的 CI 执行环境。每天 100 次是内部预算目标；Vercel Hobby 官方部署上限才是 100 次／天，当前项目的付费方案不能仅凭这个数字判断。

变更前必须核实：GitHub 私有仓库 Actions 额度和账单、Vercel 的私人 Git 仓库授权及当前套餐、现行 `public-ci-gate`／`Vercel` 必需检查如何交接、部署访问控制、旧公开 fork／历史副本、以及实际生成网站是否含个人身份信息。**仓库私有不等于已发布的网页、旧提交或既有公开副本自动私有。**

详细决策、官方限额来源、迁移验收及回滚条件见 [`docs/dev/CI/README.md`](./docs/dev/CI/README.md)。当前真实部署架构仍以 [`hosting-architecture.md`](./docs/agents/current/hosting-architecture.md)、工作流、GitHub 规则与 Vercel 实际配置为准。

## 人物称谓与隐私

BaseModel 的公开科研沟通资料及可编辑仓库内容，只能用 **W 老师**、**L 学长** 指代对应的两位私人关系人物；其他具体个人不得直接写姓名、姓氏与头衔、可反查昵称或未获批准的个人识别信息。规则唯一权威为 [`人物称谓与姓名隐私规范`](./docs/agents/current/person-reference-privacy-standard.md)，从根 [`AGENTS.md`](./AGENTS.md) 和 Agent 导航均可找到。

`npm run audit:person-privacy` 对仓库文本执行自动检测，并已纳入 `npm run verify:deploy` 与 `npm run build`；仍需要对图片、科研账号与外部 RAW 链接进行人工隐私审查。封存的旧版排版测量和两份历史路由清单保留当时原始通用称谓，不能据此认为现行网页允许不规范称呼，更不能把历史证据改写成新的测量。

## 本地运行与验证

需要仓库声明的 Node.js 版本。

```bash
npm install
npm run dev
npm run verify:deploy
npm run build
npm run audit:person-privacy
npm run test:e2e
npm run test:ui
npm run test:ui:all
npm run audit:vendor-catalogs
npm run audit:urls
npm run audit:coverage
```

`verify:deploy` 是 provider-neutral 的确定性 Gate。完整浏览器回归和依赖外部网络的 vendor/source audits 按改动范围运行，不强塞进每一个 hosted build。

## 数据目录

- `src/content/models/*.json`：模型 checkpoint，一文件一条记录。
- `src/content/papers/*.json`：论文记录，通过 `models[].model_id` 引用模型。
- `src/lib/schemas.ts`：Zod schema。
- `src/lib/modelFilters.ts`、`recommendation.ts`、`hardware.ts`：纯规则/可测试逻辑。
- `tests/fixtures/demo-archive/`：非生产测试夹具。

真实数据应来自官方模型卡、官方文档、论文、官方代码仓库或 benchmark 页面，并保留核验时间和字段级证据。`unknown`、未公开、未核验、API 可用、开放权重、开源许可等语义不要互相替代。

添加或更新模型/论文后，至少运行 `npm run validate`、`npm run audit:claims`、`npm run audit:freshness`；广泛 current/latest 家族结论应按 `docs/agents/current/model-catalog-verification-policy.md` 重新核验一手来源。

## 产品边界

Basemodel 是研究决策系统，不只是排行榜/模型数据库。当前产品主线围绕 `Base Model → SEED / OpenEvo → ALFWorld / WebShop → 证据 → OpenEvo 改进` 展开。严格复现、方法复现和现代重跑是不同模式；启发式资源估计、目录规格与真实硬件测量也必须区分。详情见 `docs/agents/current/product-and-research-integrity.md` 与 `docs/agents/current/seed-openevo-research-mission-first-principles.md`。
