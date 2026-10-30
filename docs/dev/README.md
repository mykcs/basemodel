# BaseModel Dev

This folder explains BaseModel's current development direction and why its CI and hosting roles fit the research site. The shared lifecycle is owned by the [Dev protocol](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).

- [LATEST.md](LATEST.md) — short current direction; read for ordinary implementation.
- [DESIGN.md](DESIGN.md) — **2026-10-30 确认的工程原愿望与决策依据**：公开源码承担免费标准 Actions、网站仍要登录、保留双平台退路。
- [CI/REVERSIBLE_HOSTING.md](CI/REVERSIBLE_HOSTING.md) — **Vercel ⇄ Cloudflare Access 快速换入口操作卡**、部署前验门、回切与版本证据。
- [CI performance implementation and qualification](CI/README.md) — staged optimization, measurements and rollback; current merge authority remains in the hosting contract.
- [2026-10-29 historical private-repository candidate](CI/PRIVATE_REPOSITORY_STRATEGY.md) — **已被 2026-10-30 的公开仓库决策取代**；仅供将来重新权衡源码隐私和 CI 成本。
- [ARCHIVE.md](ARCHIVE.md) — replaced development directions; consult only for history.
- [Project Report 全站内容审查计划](PROJECT_REPORT_SITEWIDE_20261014.md) — 268 个构建后路由的全量清单、按工作量拆 PR 与尚未验收的范围；机器候选信号不是科研结论。

The current CI and hosting contract remains [hosting-architecture.md](../agents/current/hosting-architecture.md), with provider rationale in [ci-provider-decision.md](../agents/current/ci-provider-decision.md), release procedure in [deployment-policy.md](../agents/current/deployment-policy.md), and failure diagnosis in [provider-failure-attribution-runbook.md](../agents/current/provider-failure-attribution-runbook.md). Root [AGENTS.md](../../AGENTS.md) routes Agent work. The [workflows](../../.github/workflows/) and live GitHub/Vercel settings determine what actually runs or blocks a merge; this folder does not replace them. The integration branch is `main`.
