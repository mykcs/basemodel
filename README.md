# Agent Foundation Model Atlas

## Historical Codex dialogue archive

For prior product, deployment, or research-workbench context, consult the
private [`Codex-Dialogue` basemodel archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only; current source, deployment state, and task
requirements remain authoritative.

面向 AI 研究者的基础模型选择与论文采用地图。它把模型供应层与论文采用层分开维护，用结构化数据回答模型家族、代际、架构、开放性、研究可用性、硬件门槛和论文角色关系。

在线访问：<https://basemodel-preview.vercel.app/>

Agent 交接与历史研究工作台上下文：[`docs/agent-context/`](./docs/agent-context/)。当前执行规则仍以 [`AGENTS.md`](./AGENTS.md) 和 [`docs/agents/`](./docs/agents/) 为准。

## 当前部署架构（以实时平台状态为准）

```text
GitHub public repository = source of truth
ordinary PR             -> GitHub Actions public-ci-gate
                        + GitHub Actions cloudflare-artifact-gate (no deploy)
fresh exact-head PR      -> two required checks green -> protected merge
accepted main            -> explicit release-provider.yml on main (default: vercel + plan)
operation=deploy         -> protected Vercel Production (default), or Cloudflare Access standby
Production verification  -> deployed SHA + authentication denial + logged-in desktop/mobile QA
```

这是截至 **2026-11-09** 核对的仓库发布合同，而非当前线上已同步 `main` 的声明。`vercel.json` 禁用普通 PR **及 `main`** 的自动 Vercel Git 部署。默认主站是受 Vercel Authentication 保护的 <https://basemodel-preview.vercel.app/>；受 Cloudflare Access 保护的备用站是 <https://basemodel-access-standby.gemini202405.workers.dev/>。`plan` 不发布，只有明确选择 `deploy` 才执行受保护的手动发布。

两项必需检查必须在**同一精确 PR HEAD** 上通过，并证明当前 `main` 基线新鲜。`cloudflare-artifact-gate` 只执行无密钥的构建与 dry-run，**不是** Cloudflare 部署；PR 合并、CI 全绿和 Vercel `READY` 也都**不是**正式网站已更新的证据。每次发布都须读回目标环境实际 SHA、核对匿名访问受阻及授权会话的手机／桌面页面。两家服务商使用不同的受保护网址，不保证自动同步或无缝切换。

旧 `ci/vercel-gate-final` 只是可选 Preview 诊断；Cloudflare Pages 是历史快照／回退，不是当前受保护的 Workers + Access 备用发布路径。发布与配额决策唯一操作 owner 为 [双提供商切换 SOP](./docs/dev/CI/QUOTA_AWARE_PROVIDER_SWITCH.md)，约束见 [hosting architecture](./docs/agents/current/hosting-architecture.md)、[deployment policy](./docs/agents/current/deployment-policy.md)、工作流／规则集与平台实时状态。

新的 Coding Agent 请从 [`AGENTS.md`](./AGENTS.md)、[`docs/agents/LATEST.md`](./docs/agents/LATEST.md) 和上述当前规则开始；不要把历史 README 或旧 PR 摘要当作有效发布权限。

## 仓库可见性与 CI 预算（现行决定）

**2026-10-30 的明确选择是保持 `mykcs/basemodel` 公开**，以公开仓库标准 GitHub-hosted Actions 运行必需的代码与浏览器检查；不为普通 PR 自动消耗 Vercel 或 Cloudflare 发布额度。公开 Actions 的配额、并发及滥用政策仍然适用，不能理解为无限算力。Vercel Production 默认手动发布，Cloudflare Workers + Access 作为受保护备用；旧的“改私有仓库、由 Vercel 负责常规 PR CI”的方向已被更新决定覆盖。

公开 GitHub **意味着源码、历史、PR 与 Actions 日志／产物可能公开**；网站的 Vercel Authentication 或 Cloudflare Access 登录门锁只保护各自网页入口，不能让这些公开对象自动变私有。发布前继续执行[人物称谓与隐私审计](./docs/agents/current/person-reference-privacy-standard.md)，人工检查图片、外部链接、账号及既有公开副本。变更仓库可见性、套餐或付费能力必须由独立明确授权决定；本 README 不授权。

先前关于私有仓库与 Vercel 构建预算的权衡仍保留在[历史策略分析](./docs/dev/CI/PRIVATE_REPOSITORY_STRATEGY.md)，仅供理解旧决策，不是现行待执行计划；实际当前状态以 [`docs/dev/LATEST.md`](./docs/dev/LATEST.md)、平台和源码为准。

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
