# Why BaseModel develops this way

Cross-project CI rules live in the shared [`.agents` CI Standard](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md). Apply that contract before this document and the local workflow/provider owners below, which define BaseModel's workload-specific CI and hosting choices.

## 工程原愿望与当前选择（2026-10-30，用户确认）

**2026-10-30 新增优先愿望：** 因为两家服务商（尤其 Vercel Hobby）的额度可能随时耗尽，用户希望**Cloudflare 优先、Vercel 备用，快速按剩余配额切换**，不要求先消耗 Vercel 的最终 PR 部署次数才能更新 Cloudflare。目标是固定 GitHub Actions 的完整 PR/浏览器验收 + 单独的 Cloudflare 离线产物门，再按需选择受保护的发布平台；Vercel 项目、登录与回退保留。实施步骤、当前尚未切换的 required checks 和真实门槛见 [配额感知切换 SOP](CI/QUOTA_AWARE_PROVIDER_SWITCH.md)。在新的 GitHub 规则集检查通过之前，旧 Vercel 必需门仍然有效，不能将目标当成既成事实。

> 最初想解决的是：高频开发时不再因 Vercel 的构建/部署额度中断工作；尽量利用公开仓库标准 GitHub Actions 的免费 CI；但网页本身不让未授权访客直接查看；以后可以在 Vercel 与 Cloudflare 间尽快切换，并保留回退。

这里记录的是 **工程 Wish / WHY**，不是新的科研或产品需求。当前明确选定 **公开 GitHub 源码 + GitHub Actions CI + 两个分别加锁的网站服务商**。2026-10-29 提出的私有仓库低频方案已由本选择取代，原有成本与隐私推演只作为 [历史备选](CI/PRIVATE_REPOSITORY_STRATEGY.md) 保留。

| 要解决的问题 | 当前决定及原因 | 不能误解成 |
| --- | --- | --- |
| CI 免费额度与开发连续性 | `mykcs/basemodel` 继续 **public**，普通 Linux 标准 GitHub-hosted Actions 在公开仓库免费，承接独立构建、隐私审计、浏览器矩阵；并按影响面分级减少无谓运行 | 不代表无限并发/时长、任何 Runner 和 artifact 都免费，也不代表滥用条款失效 |
| 保护读者访问 | **Vercel Authentication** 保护正式 Vercel URL；**Cloudflare Access** 保护备用 Worker URL，默认拒绝未登录访问；Access 上线必须先检查门锁，再部署内容 | 登录保护**不会隐藏公开的源码、Git 历史、PR、Actions 日志/产物或历史公开镜像** |
| 减少服务商构建 | **现状**是 PR 先由 GitHub Actions 验收，最终候选仍触发 Vercel 精确 HEAD provider build；**目标**是通过 Cloudflare 独立无密钥构建门验收后，替换掉 Vercel 必需 PR 检查，Cloudflare 仅按需 `plan` / `deploy` | 迁移前不能为了额度提前删除 `Vercel` 检查；新方案仍必须保留 `public-ci-gate` 与 provider 产物验证 |
| 快速切换/撤回 | Cloudflare 为目标首选，Vercel 为保留回退；按 [切换操作卡](CI/REVERSIBLE_HOSTING.md) 对照部署 SHA、门锁和关键页面，再发对应入口链接。Vercel 不应成为 Cloudflare 更新的前置依赖 | 没有自有域名时，不是同一个网址无感切换，也不保证两端一直与最新 `main` 同版本 |
| 不额外花钱、不给实验添负担 | 优先利用已授权的云端免费能力并查看实时配额；Mac/CircleCI 手动恢复，科研 GPU 不做常规网页 CI；付费扩容由用户单独选择 | 不能未经核实自动升级付费方案、迁移域名、修改公开权限或扩大部署 Token 权限 |

**隐私与公开的不可兼得边界：** 此选择是允许非敏感 BaseModel 源码公开，不是允许发表个人原始通信、真实姓名、内部研究数据、密钥或可反查身份。必须继续执行 [人物称谓及隐私审查](../agents/current/person-reference-privacy-standard.md) 与 `npm run audit:person-privacy`，同时对构建输出、旧公开静态站和仓库历史进行独立审查；审查未覆盖的部分不得宣称已加锁。若未来**必须保密源码**，应重新评估改为私有仓库及其 CI 预算，但不能假装设置网页登录即可隐藏 GitHub。

官方计费/保护依据：[GitHub Actions 公共标准 Runner](https://docs.github.com/en/actions/concepts/billing-and-usage)、[GitHub Actions 运行限制](https://docs.github.com/en/actions/reference/limits)、[Vercel Deployment Protection](https://vercel.com/docs/deployment-protection)、[Cloudflare Workers Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)。实际配额、套餐、主域名权限与运行状态以当次官方页面及控制台读回为准。


## Workload and acceptance

The site combines static publishing, research explanation, executable audits, and browser behavior. A green static build alone cannot prove its reader contracts or interactions. Local checks and repository-owned scripts catch source mistakes before spending hosted resources; [the engineering standard](../agents/current/website-engineering-standard.md) defines which checks apply. The [Public PR workflow](../../.github/workflows/public-pr-ci.yml) plans browser coverage from the changed surface, so a non-UI change need not allocate the full browser matrix while shared or uncertain UI work retains broad acceptance.

GitHub Actions supplies independent Linux compute for repository and browser acceptance. Vercel supplies the distinct provider-build and deployment proof, then serves the Production site. The [hosting architecture](../agents/current/hosting-architecture.md) owns the exact PR/ref/status sequence, required checks, Preview distinction, and release evidence. A viewing Preview helps human iteration; it never substitutes for merge acceptance. [The deployment policy](../agents/current/deployment-policy.md) owns Production and rollback procedure.

## Provider choices and spend

The required Vercel candidate is requested only when a PR is ready for final acceptance. Repository-only changes still receive required merge checks, while Production build relevance is decided by the [Vercel ignore script](../../scripts/vercel-ignore-build.mjs). This keeps documentation or Agent-policy edits from publishing a new website. [The provider decision](../agents/current/ci-provider-decision.md) records the measured alternatives and current provider rationale; live plan limits and provider settings must be rechecked before a migration.

Production is access-protected, so anonymous external smoke checks are not valid release evidence. The independent Cloudflare Workers + Access standby is now a **deployed, manually refreshed protected fallback**; older Cloudflare Pages/shadow helpers are historical and must not be mistaken for current protected Production. Anonymous Access-login probes establish fail-closed behavior, while real authenticated browser checks are needed to prove content. Neither provider lock authenticates the public GitHub source. The [manual Mac workflow](../../.github/workflows/self-hosted-ci.yml) and CircleCI configuration are recovery paths, not routine PR or Production compute. Research/GPU machines do not become CI capacity. Source, workflow, ruleset, and provider settings remain authoritative over this explanation.

## Change and recovery rule

For a CI change, inspect the local validator, current workflow, branch rules, provider identity, and the first failing job or build phase. [The failure runbook](../agents/current/provider-failure-attribution-runbook.md) distinguishes application failure, CI contract failure, and provider failure. Qualify any replacement on the actual final candidate before moving merge authority; keep the previous path available until the new one is proven. A scientific result or experiment state is never altered to repair a CI bill or a provider outage.
