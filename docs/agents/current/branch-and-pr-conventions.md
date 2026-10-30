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

## BaseModel deployment exception: optional Vercel fallback refs

`vercel.json` disables automatic deployment for ordinary branches **and `main`**. Branch names still describe the subject of work, not the provider that must run. Every PR is instead required to pass exact-head `public-ci-gate` and `cloudflare-artifact-gate` on GitHub-hosted Actions. The current provider-control and manual release contract is in [the dual-provider SOP](../../dev/CI/QUOTA_AWARE_PROVIDER_SWITCH.md).

1. **Ordinary working branch:** no Vercel deployment while iterating; both required GitHub checks run.
2. **Accepted candidate:** merge only with the two required checks green on the same current SHA. Neither check deploys a website.
3. **Cloudflare default release:** explicitly dispatch `cloudflare-standby.yml` from protected `main` only when the published SHA needs updating. Verify Access before/after and the logged-in site.
4. **Vercel fallback:** existing `ci/vercel-gate-final` and `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` remain an **optional** real Vercel provider-build route. The alias must already exist and move byte-for-byte to the accepted PR SHA; creating a fresh alias may not trigger a build. This is no longer ordinary merge authority.
5. **`[vercel-preview]`:** historical/review marker only, not a deployment switch. Docs/governance-only changes should not publish a new site on either provider.
6. If this document disagrees with `vercel.json`, workflows, live branch protection, or the provider state, executable/live truth wins and the documentation needs repair.

Therefore choose `research/`, `fix/`, `docs/`, `ci/`, or `agent/` for semantic ownership, not for provider eligibility.

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

## Opening a pull request

Before calling a PR-create mutation, prove the proposed head already exists in the remote repository and contains the intended commit(s) relative to the selected base. For a normal same-repository PR, the safe order is: resolve current base -> create the semantic task branch from that base -> commit/push the task content -> verify the remote head and non-empty base...head delta -> open the PR.

A provider response such as `422 invalid head` or `no commits between base and head` means the PR mutation did **not** execute. Re-read the remote refs/delta, repair only the missing branch/commit/ref state, then retry the same intended PR. Do not switch bases, create probe PRs, or weaken repository policy merely to make the request succeed.

For a deliberately long-running checklist/audit workline, the first PR may be Draft, but it still needs a real remote branch and an initial committed checklist before the PR is opened.

## Lifecycle and cleanup

- Do not rename historical or active branches merely to satisfy this convention.
- Prefer one coherent task branch and one PR over many probe branches.
- When a worker PR is superseded by an integration/release head, mark that relationship explicitly and close the superseded PR rather than leaving ambiguous parallel release candidates.
- After a PR is merged or intentionally superseded and no other branch/PR depends on it, its task branch is normally safe to delete.
- After merge, the remote task branch may already be absent because repository automation removed it. Do not interpret that missing ref as evidence that the work was lost, and do not require the remote task branch to still exist before cleaning an isolated local checkout.
- Before removing a temporary local clone/worktree after merge, re-read the current integration branch and prove the local checkout is clean, its task-only commits are reachable from the current integration branch or another deliberate preservation ref, and no active PR/worktree still depends on that checkout. If reachability or cleanliness is uncertain, keep the checkout instead of guessing from branch-name existence.
- Never delete a branch that is still the only reachable home of required scientific/provenance history without first preserving that history deliberately.

## Authority

This document governs naming conventions and the BaseModel-specific local Git/PR workflow boundary. It does not override:

- `vercel.json` deployment eligibility;
- current deployment/release policy;
- tests and executable Gates;
- GitHub/Vercel live provider state;
- current scientific authority in `mykcs/openevo-experiment`.

When a prefix affects automation, the automation configuration and this document must remain aligned.
