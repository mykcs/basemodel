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

## BaseModel deployment exception: final-gate refs have executable meaning

Current `vercel.json` deliberately keeps ordinary working branches out of Vercel. Branch prefixes such as `research/`, `fix/`, `docs/`, and `agent/` remain semantic/readability conventions; hosted acceptance is requested separately by a `ci/vercel-gate-*` ref that points to the exact final PR head SHA.

The spend rule is now:

1. **Ordinary working branch:** no Vercel deployment while iterating.
2. **Final candidate:** create/move a `ci/vercel-gate-*` ref to the exact same commit SHA; do not add a commit or rebuild the candidate on the gate ref.
3. **Any triggered gate Preview:** automatic real acceptance. The Ignored Build Step does not trust `VERCEL_GIT_PULL_REQUEST_ID`; once provider compute is intentionally requested, it fails open into the real Gate.
4. **`[vercel-preview]`:** optional historical/review marker only; it does not control spend.
5. **Docs/governance-only final candidate:** the explicit gate still runs `verify:deploy`; the risk planner may skip Chromium if UI risk is proven absent.
6. **Docs/governance-only `main`:** remains non-deploy-relevant and must not replace the Production website.
7. If this document disagrees with `vercel.json` / `scripts/vercel-ignore-build.mjs`, executable configuration wins and this document must be corrected.

Therefore choose `research/`, `fix/`, `docs/`, `ci/`, or `agent/` for semantic ownership, not Vercel eligibility. The separate gate ref is the execution control.

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

## Local Git authentication: separate account authorization from credential-helper wiring

Use local Git only when the task genuinely needs a local checkout/worktree. When local `git fetch/push` authentication behaves differently from GitHub connector or GitHub CLI access, do not immediately change repository permissions, remotes, tokens, or SSH keys.

Diagnose in this order:

1. inspect the configured remote transport (`https://...` vs `git@github.com:...`);
2. verify account authorization separately (`gh auth status` when GitHub CLI is the approved local credential source);
3. if HTTPS Git is intended and `gh` is authenticated, ensure Git's credential helper is actually wired to that credential; `gh auth setup-git` is the normal GitHub CLI bridge;
4. retry a **read-only fetch** before attempting a write;
5. treat an SSH `Permission denied (publickey)` result as evidence about the SSH key path, not automatic proof that repository authorization is missing;
6. never paste a PAT into the remote URL or commit credential material as the default workaround.

A successful GitHub login and a functioning local Git credential helper are distinct layers. Classify the layer before mutating shared repository state.

Historical case: [`../history/2026-09-02-official-external-brand-links-retrospective.md`](../history/2026-09-02-official-external-brand-links-retrospective.md).

## Lifecycle and cleanup

- Do not rename historical or active branches merely to satisfy this convention.
- Prefer one coherent task branch and one PR over many probe branches.
- When a worker PR is superseded by an integration/release head, mark that relationship explicitly and close the superseded PR rather than leaving ambiguous parallel release candidates.
- After a PR is merged or intentionally superseded and no other branch/PR depends on it, its task branch is normally safe to delete.
- Never delete a branch that is still the only reachable home of required scientific/provenance history without first preserving that history deliberately.

## Authority

This document governs naming conventions and the BaseModel-specific local Git/PR workflow boundary. It does not override:

- `vercel.json` deployment eligibility;
- current deployment/release policy;
- tests and executable Gates;
- GitHub/Vercel live provider state;
- current scientific authority in `mykcs/openevo-experiment`.

When a prefix affects automation, the automation configuration and this document must remain aligned.
