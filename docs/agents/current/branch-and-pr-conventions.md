# Branch and pull-request conventions

Status: **current repository policy**

Shared account-level baseline: `mykcs/.agents/docs/agents/BRANCH_AND_PR_CONVENTIONS.md`. This file is the BaseModel application/override: project executable truth and the Vercel-specific exception below take precedence over the shared default.

This document defines how new work branches and PRs should be named in `mykcs/basemodel`. It does not retroactively rename historical or in-flight branches.

## Core rule

A branch prefix describes the **meaning of the work and the repository workflow it needs**, not which Agent, model, or UI created it.

Use:

```text
<type>/<short-kebab-task>[-YYYYMMDD]
```

Examples:

```text
research/seed-webshop-results-refresh-20260827
fix/results-mobile-overflow
ci/run-browser-gate-on-main
agent/semantic-release-ui-closeout
```

Do not create new branches such as `chatgpt/*`, `claude/*`, or `codex/*` merely because ChatGPT, Claude, Codex, or another Agent performed the work. Executor identity belongs in provenance when it matters; it is not the branch taxonomy.

## Preferred prefixes

| Prefix | Use for |
|---|---|
| `research/` | Research publication, experiment/result interpretation, scientific provenance, or research-page work that needs the repository research/release workflow. |
| `feat/` | New product or engineering capability. |
| `fix/` | Correctness, UI, build, or integration repair. |
| `docs/` | Documentation-only work when no deployment Preview is required. |
| `ci/` | CI/workflow configuration. |
| `test/` | Test-only changes. |
| `refactor/` | Behavior-preserving restructuring. |
| `chore/` | Maintenance with no product/research semantic change. |
| `verify/` | Bounded verification/acceptance work when a dedicated branch is genuinely useful. |
| `review/` | Temporary review/salvage work; do not treat it as a long-lived release line. |
| `agent/` | Work whose subject is Agent automation, Agent policy, or an Agent-owned release mechanism. Do **not** use it merely because an Agent created the branch. |

The prefix is not determined only by the file extension. A Markdown change can still be `research/*` if it is part of a research release that must receive an exact-head Preview.

## BaseModel deployment exception: prefix has executable meaning

For this repository, branch naming is not only cosmetic. Current `vercel.json` enables Git-triggered deployments for:

```text
main
agent/semantic-release-*
research/**
```

and disables other branch patterns by default. This is **eligibility only**: on Vercel Preview, `scripts/vercel-ignore-build.mjs` still requires `[vercel-preview]` in the exact-head commit message before the expensive site build is allowed to run. Eligible intermediate pushes without the token are intentionally ignored. `main` Production does not require the token.

Therefore:

1. If a non-main change **requires exact-head Vercel Preview acceptance**, use `research/**` unless it is specifically the `agent/semantic-release-*` flow, finish the coherent local batch first, and add `[vercel-preview]` only to the exact head that should consume the hosted Preview.
2. `docs/**`, `fix/**`, `ci/**`, and other ordinary prefixes are currently **not Vercel-deployment-eligible** by name. Use them only when Preview is not required, or deliberately change the executable deployment policy as part of the work.
3. Do not label a branch `docs/**` solely because all changed files are Markdown if the release contract requires a Preview.
4. Do not add `[vercel-preview]` to intermediate commits merely because their branch is eligible; the token is an explicit spend decision for hosted acceptance.
5. If documentation and `vercel.json` / `scripts/vercel-ignore-build.mjs` disagree, executable configuration wins and this document must be corrected.

This exception explains why two branches containing substantially the same documentation change can behave differently when one is `docs/...` and the other is `research/...`.

## PR titles

Branch prefixes and PR-title prefixes are separate mechanisms. PR titles may use Conventional-Commit-style categories such as:

```text
research: ...
feat: ...
fix: ...
docs: ...
ci: ...
refactor: ...
```

Choose the PR title for the semantic change. Do not assume the PR title changes Vercel eligibility; the **branch name** is what `vercel.json -> git.deploymentEnabled` evaluates.

## Lifecycle and cleanup

- Do not rename historical or active branches merely to satisfy this convention.
- Prefer one coherent task branch and one PR over many probe branches.
- When a worker PR is superseded by an integration/release head, mark that relationship explicitly and close the superseded PR rather than leaving ambiguous parallel release candidates.
- After a PR is merged or intentionally superseded and no other branch/PR depends on it, its task branch is normally safe to delete.
- Never delete a branch that is still the only reachable home of required scientific/provenance history without first preserving that history deliberately.

## Authority

This document governs naming conventions. It does not override:

- `vercel.json` deployment eligibility;
- current deployment/release policy;
- tests and executable Gates;
- GitHub/Vercel live provider state;
- current scientific authority in `mykcs/openevo-experiment`.

When a prefix affects automation, the automation configuration and this document must remain aligned.
