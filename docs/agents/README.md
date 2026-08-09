# Agent documentation

This directory contains current operational guidance plus historical architecture records.

## Start here

[`LATEST.md`](./LATEST.md) is the fixed handoff entry for future coding Agents. It carries the latest timestamp, current repository/deployment state, pending work and the next human/Agent boundary. Read it before dated migration/history notes.

The current repository-layout migration design is recorded in [`repository-layout-plan.md`](./repository-layout-plan.md).

## Current authoritative documents

Read these before changing deployment, hosting, URL/SEO behavior, release validation, repository automation, or repository structure:

1. [`LATEST.md`](./LATEST.md) — latest timestamped handoff and pending work.
2. [`deployment-policy.md`](./deployment-policy.md) — authoritative steady-state policy: GitHub source -> Cloudflare Pages, with GitHub Actions and GitHub Pages intentionally retired.
3. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — current Cloudflare build/deploy runbook, including quota/build-budget rules.
4. [`repository-map.md`](./repository-map.md) — fast repository orientation: what each directory owns, what to read first, and what validation each kind of change needs.
5. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating rules and collaboration expectations.

If any historical file conflicts with these documents, the current documents win unless the repository owner explicitly changes policy.

## Consolidated migration and operating summary

[`2026-08-09-cloudflare-steady-state-summary.md`](./2026-08-09-cloudflare-steady-state-summary.md) is the one-file summary of the work and lessons that produced the current architecture. It records:

- why the project moved away from the GitHub Actions + GitHub Pages deployment chain;
- the final GitHub -> Cloudflare Pages responsibility split;
- the deterministic deployment gate and retained on-demand E2E/network audits;
- the application regressions fixed during migration/hardening;
- the final SEO/base-path/runtime/Dependabot hardening;
- the Cloudflare Free build-quota model and Agent push discipline;
- the rule that one logical task/PR should normally target one real final-head Preview instead of many tiny build-triggering pushes;
- why `[CF-Pages-Skip]` is appropriate for intermediate commits that intentionally do not need deployment;
- why raw deployment-history row counts must not automatically be interpreted as monthly builds used when skipped entries are present;
- the high-autonomy owner/Agent collaboration model and the remaining human account-settings boundary.

This summary is explanatory context, not a higher authority than the current policy/runbook files above.

## Recommended new-agent reading order

For a new coding agent taking over the repository:

```text
AGENTS.md
  -> docs/agents/LATEST.md
  -> docs/agents/deployment-policy.md
  -> docs/agents/repository-map.md
  -> package.json
  -> README.md
  -> only then the files directly relevant to the requested change
```

When an Agent needs the migration rationale or wants to understand why Actions/Pages/build-budget decisions exist, read `2026-08-09-cloudflare-steady-state-summary.md` after the authoritative files rather than reconstructing the history from old PRs.

The goal is to prevent an agent from rediscovering or accidentally reversing settled architecture decisions.

## Historical records

The dated 2026-08-08/09 files record the path that led here: GitHub Actions CI optimization, quota exhaustion, Cloudflare migration, dual-hosting experiments, hardening, cost analysis, and the later retirement decision. Keep them as history; do not treat them as instructions to restore Actions or GitHub Pages.

Notable history:

- [`2026-08-08-github-actions-ci-optimization-history.md`](./2026-08-08-github-actions-ci-optimization-history.md)
- [`2026-08-09-cloudflare-migration-retrospective.md`](./2026-08-09-cloudflare-migration-retrospective.md)
- [`2026-08-09-post-migration-second-audit.md`](./2026-08-09-post-migration-second-audit.md)
- [`2026-08-09-final-hardening-addendum.md`](./2026-08-09-final-hardening-addendum.md)
- [`2026-08-09-actions-cost-after-cloudflare.md`](./2026-08-09-actions-cost-after-cloudflare.md)
- [`dual-hosting-policy.md`](./dual-hosting-policy.md) — retired policy snapshot; no longer authoritative.
- [`2026-08-09-actions-and-pages-retirement.md`](./2026-08-09-actions-and-pages-retirement.md) — decision record for the current simplified architecture.

Current deployment status: Cloudflare Pages project `basemodel` is connected to `mykcs/basemodel`, Production uses `main`, the repository-owned build entrypoint is `npm run build:cloudflare`, and root `/` is the only maintained deployment base.
