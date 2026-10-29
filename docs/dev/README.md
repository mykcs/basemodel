# BaseModel Dev

This folder explains BaseModel's current development direction and why its CI and hosting roles fit the research site. The shared lifecycle is owned by the [Dev protocol](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).

- [LATEST.md](LATEST.md) — short current direction; read for ordinary implementation.
- [DESIGN.md](DESIGN.md) — repository-specific CI/provider reasoning; read before changing CI, hosting, or release behavior.
- [CI/README.md](CI/README.md) — two workload modes (high-frequency public/paid versus low-frequency private), source privacy, Vercel limits, required-test migration and cutover checklist; **proposed, not deployed**.
- [ARCHIVE.md](ARCHIVE.md) — replaced development directions; consult only for history.
- [Project Report 全站内容审查计划](PROJECT_REPORT_SITEWIDE_20261014.md) — 268 个构建后路由的全量清单、按工作量拆 PR 与尚未验收的范围；机器候选信号不是科研结论。

The current CI and hosting contract remains [hosting-architecture.md](../agents/current/hosting-architecture.md), with provider rationale in [ci-provider-decision.md](../agents/current/ci-provider-decision.md), release procedure in [deployment-policy.md](../agents/current/deployment-policy.md), and failure diagnosis in [provider-failure-attribution-runbook.md](../agents/current/provider-failure-attribution-runbook.md). Root [AGENTS.md](../../AGENTS.md) routes Agent work. The [workflows](../../.github/workflows/) and live GitHub/Vercel settings determine what actually runs or blocks a merge; this folder does not replace them. The integration branch is `main`.
