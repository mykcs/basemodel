# BaseModel Dev

This folder explains BaseModel's current development direction and why its CI and hosting roles fit the research site. The shared lifecycle is owned by the [Dev protocol](https://github.com/mykcs/.codex/blob/main/engineering/DEV_PROTOCOL.md).

- [LATEST.md](LATEST.md) — short current direction; read for ordinary implementation.
- [DESIGN.md](DESIGN.md) — repository-specific CI/provider reasoning; read before changing CI, hosting, or release behavior.
- [ARCHIVE.md](ARCHIVE.md) — replaced development directions; consult only for history.

The current CI and hosting contract remains [hosting-architecture.md](../agents/current/hosting-architecture.md), with provider rationale in [ci-provider-decision.md](../agents/current/ci-provider-decision.md), release procedure in [deployment-policy.md](../agents/current/deployment-policy.md), and failure diagnosis in [provider-failure-attribution-runbook.md](../agents/current/provider-failure-attribution-runbook.md). Root [AGENTS.md](../../AGENTS.md) routes Agent work. The [workflows](../../.github/workflows/) and live GitHub/Vercel settings determine what actually runs or blocks a merge; this folder does not replace them. The integration branch is `main`.
