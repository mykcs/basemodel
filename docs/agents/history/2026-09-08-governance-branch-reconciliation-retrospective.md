# Governance branch reconciliation — BaseModel #541 and OpenEVO #374

Status: **historical reusable evidence; not current PR, CI, deployment, or experiment authority.**

This case records the reusable lessons from reconciling two stale governance branches after both repositories had moved. It deliberately preserves the historical decisions while separating them from current mutable state. Future Agents must re-read current `main`, PRs, checks, routers, and experiment authority before acting.

## 1. What this conversation was actually solving

Two superficially similar open PRs required opposite dispositions.

- BaseModel #541 carried a still-missing governance boundary: root `AGENTS.md` as the unique repository bootstrap, docs routers as navigation-only, and Agent/docs/test-only governance excluded from website Production inputs. Its semantic owner topology was still valid, so the correct action was to refresh the same branch on current `main`, prove the diff stayed narrow, rerun exact-head required CI, and let auto-merge enforce the remaining checks.
- OpenEVO #374 contained useful Stage1 lessons, but `main` had since merged a root-`AGENTS.md` authority deduplication. Replaying #374 wholesale would have restored standing-rule prose into both root `AGENTS.md` and `docs/agents/README.md`, recreating the duplicate mutable authority that current `main` had intentionally removed. The correct action was a narrow successor carrying only the canonical runbook, friction register, and historical case deltas; the stale predecessor was then closed as superseded.

This is not a rule that "BaseModel refreshes and OpenEVO supersedes." The reusable rule is to resolve **semantic intent + current path ownership + exact-head evidence** before choosing refresh versus successor.

## 2. Information lifetime classification

### A. Long-lived rules

- A stale PR is not evaluated against the base recorded in chat or its PR body. Read current `main`, exact PR head/base, changed paths, review threads, and required-check provenance at every write/merge boundary.
- Old green checks are historical evidence for an old candidate. A refreshed/rebuilt head must receive current required checks; strict-base repositories require current-base evidence too.
- Governance conflicts include **authority topology**, not only text. Re-resolve whether each changed file is a bootstrap authority, canonical policy/runbook, navigation-only router, executable contract/test, or historical evidence.
- Do not preserve a useful rule by restoring it to a path that no longer owns that rule. Move/salvage the semantic delta into the current owner and preserve predecessor lineage explicitly.
- Prefer the smallest safe current-main decision unit: same-PR refresh when the old ownership topology is still valid; narrow successor when topology changed; full supersession when no unique delta remains.
- `mergeable`, CI green, auto-merge enabled, merged, deployed, and Production semantics are different states. Final closeout must read the durable state again; do not report an intermediate state as final.
- Agent/docs-only governance may still run repository CI while remaining outside website Production inputs. A provider `IGNORED`/`CANCELED` deployment record is not a website publication.
- When the primary checkout is dirty or belongs to unrelated work, do not clean/reset/reuse it merely to make reconciliation convenient. Use a fresh checkout or repository API route and preserve the other work.
- Tool-route failure is scoped evidence. A hanging local fetch/clone attempt does not prove GitHub is unavailable when a connected API can safely read/write the required objects.

### B. Project-level lessons

For BaseModel:

- root `AGENTS.md` is the unique repository-root Agent bootstrap; `docs/README.md` and `docs/agents/README.md` are routers, not second policy stores;
- `scripts/vercel-ignore-build.mjs` plus its tests own the executable Agent/docs-no-Production boundary;
- required CircleCI checks validate the current merge candidate, not an earlier branch head;
- reader/copy contracts that landed after an older governance branch must remain present when that branch is refreshed.

For OpenEVO:

- root `AGENTS.md` is the unique startup authority; `docs/agents/README.md` is navigation-only;
- durable Stage1 execution lessons belong in `SHARED_ARM_EXECUTION_RULES.md`, repeated failure classes in `FRICTION_REGISTER.md`, and dated causal history in the Stage1 troubleshooting case;
- preserving scientific/history lineage does not require keeping an obsolete PR topology open or merging duplicated standing rules;
- no documentation reconciliation grants experiment launch, GPU, controller, scientific amendment, or artifact-deletion authority.

### C. Volatile state deliberately not promoted

Do not reuse from this case without live readback: exact PR heads/bases, current main SHAs, which browser shard is pending, mergeability snapshots, whether auto-merge already fired, current Vercel/CircleCI state, temporary helper PRs, temporary worktree paths, process IDs, local authentication state, or the current number of commits behind.

No GPU occupancy, experiment round, server PID, disk state, or live scientific result was involved in this conversation; none is invented or promoted here.

## 3. Friction matrix

| Friction | Why it happened / missing context | Check before acting | Defensive rule | Reasonable-looking anti-example |
|---|---|---|---|---|
| The user supplied "seven commits through #545", but BaseModel had advanced again. | Chat state was treated as a live repository snapshot. | Fetch protected `main` immediately before comparison and again before merge/closeout. | User SHAs are starting evidence, not a substitute for live readback. | Calculating behind-by from the supplied SHA and never checking that #542 merged afterward. |
| #541 was fully green at its old head. | Green status was tempting to reuse after base movement. | Compare current base/head and fetch required statuses for the new exact head. | Any refresh creates a new merge candidate; old green is non-transferable. | Merging because the diff is docs-only and "it was green yesterday." |
| #374 had useful rules in `AGENTS.md` and `docs/agents/README.md`. | Useful content was conflated with correct current ownership. | Read current root/router authority headers and search canonical owners. | Preserve semantics, not obsolete placement. | Rebase #374 wholesale and recreate a second mutable Agent rule store. |
| A local BaseModel/OpenEVO primary checkout existed. | Existing checkout was assumed to be the convenient integration surface. | `git status`, branch, HEAD, dirty/untracked state, worktree list. | Unknown/dirty shared checkout is read-only; use a fresh task-owned checkout/API route. | `git reset --hard origin/main` to make the reconciliation worktree clean. |
| A compound remote Git operation stalled. | One transport route was treated as the only way to finish. | Distinguish local Git transport, GitHub CLI, and connected GitHub API capability. | Change routes after bounded evidence; do not infer provider outage from one stuck path. | Repeating the same `git fetch` indefinitely or asking the user for new credentials while API writes are authorized. |
| Same-PR refresh required getting `main` into the feature branch. | Direct branch-update tooling was limited while force rewriting was undesirable. | Verify helper PR base=feature, head=current `main`, and no extra commits. | A mechanical main→feature helper is allowed only as ancestry plumbing; afterwards re-prove `main..feature` is narrow. | Treating the helper PR's mergeability/CI as acceptance of the feature PR. |
| Auto-merge was enabled while checks were pending. | "No more manual action" can sound like "already merged." | Re-read PR state after checks have had a chance to settle and before final closeout. | Report `auto-merge armed` separately from `merged`; durable final state wins. | Saying the governance boundary is on main while the PR is still blocked. |
| We wanted one polished retrospective. | Retrospective completeness can encourage copying current rules into the history file. | Classify every statement A/B/C and identify the current owner. | History explains why; current owner says what to do now. | Copying the full deployment policy into this dated file and letting it drift. |

## 4. Decision procedure for future stale governance PRs

Before changing anything:

1. Read root `AGENTS.md`, documentation governance/router, branch/PR policy, and the canonical current owner for each changed surface.
2. Fetch current `main`, PR head/base, changed paths, mergeability, reviews/threads, and required checks.
3. For every changed path, label its current role: `bootstrap`, `router`, `canonical mutable owner`, `executable contract/test`, or `history/evidence`.
4. Search current `main` for the semantic rule, not only the exact old wording.
5. Compute the intended surviving delta.
6. Choose one disposition:
   - **refresh same PR**: intent remains missing and all affected paths still own it;
   - **narrow successor**: unique intent remains, but old placement/topology is obsolete;
   - **supersede without successor**: no unique current delta remains.
7. If preserving history, link predecessor → successor explicitly before closing the predecessor.
8. Treat the refreshed/successor head as new evidence: run current required tests/checks and verify its diff against current `main`.
9. At the final boundary, re-read both repositories if the task spans repositories; another Agent may have merged overlapping work while this task ran.
10. Report `prepared`, `checks pending`, `auto-merge armed`, `merged`, and `Production verified` as separate completion layers.

## 5. Repeated-error check

Several failures were not new.

**Moving-main / old-green reuse** had already appeared in earlier BaseModel release retrospectives and OpenEVO PR #347. It recurred because the rule was usually expressed as "refresh current main" rather than attached to the exact **write/closeout use site**. The defense is now startup-visible: refresh volatile state at every write boundary and explicitly separate exact-head evidence from historical green checks.

**Duplicate Agent authorities** had already required owner correction across repositories. It recurred because an old branch still contained pre-dedup standing-rule prose; a normal rebase would mechanically resurrect it. The missing abstraction was not "keep README short" but **path role is mutable over repository history**. Stale governance reconciliation must therefore re-resolve authority topology before applying old hunks.

**Retrospective without execution** had also been a recurring failure mode: a deep case can describe the right lesson while the next Agent never loads it. This closeout promotes the operational rule into root/playbook and leaves this document as historical rationale only.

**Intermediate state reported as completion** is another recurring class. Auto-merge, a watcher, a pending provider job, or a mergeable PR is an automation state, not the terminal fact. The final report must read durable state again.

## 6. Long-term-memory boundary

Repository deposition is not ChatGPT native memory. This runtime exposes no native long-term-memory write action, so this conversation records **zero native memory writes**. Stable candidates are instead deposited in repository startup/current policy where appropriate and, for OpenEVO, in its explicit portable `STABLE_MEMORY_CANDIDATES.zh-CN.md` file. That file is a portability aid, not proof of account-level memory.

Do not put PR heads, check states, helper branches, PIDs, GPU occupancy, or temporary paths into long-term memory even when a memory tool exists.

## 7. Historical closeout

Historically, the conversation ended with BaseModel #541 refreshed on then-current `main`, exact-head CI rerun, and auto-merge armed; a later durable read showed that it did merge. OpenEVO #374 was closed as superseded after a narrow successor carried its unique Stage1 lessons into the three current/history owners and was merged.

Those outcomes explain the decision pattern. They are not current repository state. Future Agents must re-read live state before making any claim or action.
