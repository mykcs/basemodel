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
non-main branch / PR -> Vercel Preview
main                 -> Vercel Production
Production           -> https://basemodel-preview.vercel.app
Cloudflare Pages     -> frozen legacy rollback snapshot; normal Builds = 0
```

Vercel 统一执行 `npm run verify:deploy && npm run build`。GitHub Actions 与 GitHub Pages 保持退役。Cloudflare Direct Upload、Pages build helper 和 Workers shadow 只保留作回滚/Cloudflare-specific 诊断，不是日常发布链路。

直到 Cloudflare Pages 的 Git 自动部署能在账户侧关闭之前，分支和 release merge 使用 `[CF-Pages-Skip]`，避免旧 Pages 项目因 Git 提交再次消耗 Build。

新的 Coding Agent 请从 `AGENTS.md`、`docs/agents/LATEST.md`、`docs/agents/current/hosting-architecture.md` 和 `docs/agents/current/deployment-policy.md` 开始。

## 本地运行与验证

需要仓库声明的 Node.js 版本。

```bash
npm install
npm run dev
npm run verify:deploy
npm run build
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
