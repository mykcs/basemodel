# Content-first redesign HPL closeout — conversation lessons

Status: **historical evidence only**
Date: **2026-09-20**
Repository: `mykcs/basemodel`

Current policy remains under `docs/agents/current/`; this file does not create a second mutable authority.

## Scope and relation to HPL

This conversation continued the completed #737 content-first / Apple-guided redesign, corrected the visual-acceptance reviewer workflow, ran the formal Human Preference Learning ingestion, merged the HPL closeout as PR #751, and then cleaned an unused duplicate branch.

The user-facing preference evidence from this conversation is already canonicalized through the HPL assets merged by PR #751. This conversation-lessons closeout therefore **does not re-ingest those same corrections** as new CASEs, Preference Model entries, Gold Pairs, or visual tiers.

The durable preference owner is the current HPL system. This history file records only the still-useful engineering and governance lessons from executing that closeout.

## What went wrong, and what was learned

### 1. Existing rule, repeated quoting failure

During HPL editing, a multiline tool payload containing Markdown backticks caused a parser failure before dispatch. The same class of mistake happened again later even though the closeout protocol already said that after the first parser/quoting failure, the task must switch to checked-script or structured-tool mode.

This was not a missing-rule problem. It was an **activation failure**.

Future action: after the first parser/quoting failure, stop sending inline multiline content through the ambiguous quoting layer. Use a file write/edit API, a standalone checked script, or simple structured commands. Treat the failed attempt as `NOT_EXECUTED`; do not keep retrying the same shape.

### 2. Isolated worktree did not imply a valid dependency environment

A clean isolated worktree initially reused an older dependency tree. Current main had added `katex`, so Astro reported a missing module even though the candidate source was not wrong.

The existing current rule was correct: a clean worktree with missing or stale `node_modules` is an environment/bootstrap gap, not a product regression.

Future action: when current lockfile/package state has moved, normalize the isolated worktree with the current lockfile before interpreting compile failures. Temporary dependency symlinks or caches are local acceleration only and must not become repository state.

### 3. Concurrent HPL closeout produced a better survivor

While one local closeout implementation was being built, another concurrent workline opened PR #751 for the same semantic outcome. The second implementation had broader coverage: it included the Chrome/ChatGPT account-surface question, folded the just-merged reviewer-identity rule into the same evidence-class family, and produced 12/12 coverage rather than keeping two parallel closeout implementations.

The correct recovery was to stop treating the local branch as the intended release merely because work had already been spent on it. The two implementations were compared semantically, #751 was selected as the survivor, the duplicate branch was not merged, and the unused remote branch was later deleted after verifying it had no PR and main already contained the accepted closeout.

Future action: search by semantic target before the first substantial write, and **repeat that overlap scan when the task changes phase** or before release. If an equivalent concurrent owner appears, cold-read both and keep one survivor instead of stacking duplicate histories.

### 4. Provider log observability was weaker than provider acceptance state

The Vercel deployment reached the exact #751 head and became READY, but the available build-log connector action returned a tool-level “not found” error. That missing log transport did not justify inventing logs, nor did it invalidate the deployment.

Acceptance was bounded by other durable evidence: exact candidate SHA, required Vercel status, provider READY state, current `vercel.json` build command, HPL detachment tests, public PR CI, and exact-head deterministic validation.

Future action: one missing observation path is not evidence that the underlying provider action failed. Use independent durable artifacts, state the observability gap literally, and never upgrade a generic green badge into claims about tests that were intentionally skipped.

### 5. HPL-only merge must not be mistaken for a new product release

The HPL closeout changed control-plane learning assets, docs, tests, and retrieval logic while remaining detached from product runtime. The exact-head final gate still ran the required deterministic/build path, while browser execution was skipped by the repository's proven HPL-detachment planner.

After merge, the main-branch provider object was canceled by the existing non-deploy-relevant policy and the stable Production alias stayed on the prior READY product deployment. This is the intended behavior, not a failed release.

Future action: report deterministic validation, hosted final-gate acceptance, merge, and Production publication as separate facts. “Browser skipped by proven HPL detachment” is not “browser tests passed”, and a governance-only merge must not be described as a new website Production release.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Closeout treatment |
| --- | --- | --- | --- | --- |
| Apple/content-first and reviewer preference corrections | Yes | Already structured by HPL; do not double-ingest | current HPL assets from PR #751 | linked, not duplicated |
| Default Kimi/MiniMax/browser-as-reviewer path | Yes | verifier and independent reviewer are different evidence classes | `human-preference-learning-system.md` + UI acceptance policy + CASE-094 | already current |
| MiniMax/Kimi/Safari/file-paste probes | No | one-time execution exploration is not preference acceptance | none | intentionally not persisted as standing rules |
| Parser/backtick tool failure | Yes in this closeout | first parser failure must switch execution mode | canonical closeout protocol + scenario trigger shell rules | recorded as activation failure |
| Stale dependency tree in isolated worktree | Known class | normalize current lockfile environment before classifying candidate failure | project Agent principles + website engineering standard | existing rule confirmed |
| Concurrent duplicate closeout implementation | Known class | semantic overlap scan and one survivor | project Agent principles + scenario trigger + multi-PR playbook | existing rule confirmed |
| Missing provider build-log tool | No | use independent durable provider evidence; do not invent logs | deployment/release policy + reconstruct-status rule | no new policy needed |
| ChatGPT account-level long-term memory | N/A | repository persistence and account memory are separate | canonical closeout protocol §9 | no memory-write claim made |

## REPEAT-CORRECTION witnesses

**Quoting failure**
- trigger: first parser error while assembling multiline content;
- current owner: canonical conversation-closeout protocol + scenario-trigger shell/quoting section;
- checked artifact: parser failed before dispatch, so repository mutation did not occur;
- allowed next action: structured file edit or checked standalone script;
- invalidation cue: any further inline multiline payload with backticks/nested quoting.

**Concurrent closeout**
- trigger: live GitHub showed PR #751 owning the same HPL outcome;
- current owner: project Agent principles + multi-PR semantic integration rules;
- checked artifact: exact head/base, PR diff, coverage, tests, and HPL semantics;
- allowed next action: adopt #751 as survivor and discard only the unused duplicate path;
- invalidation cue: survivor head/base or semantic scope changes.

## Future-Agent test

A new Agent starting from root `AGENTS.md` can reach:
1. the current shell/quoting and dependency-environment rules in one or two jumps;
2. the semantic-overlap / survivor rule before opening parallel implementation paths;
3. the HPL trigger that explicitly says not to double-ingest a conversation that already ran HPL closeout;
4. CASE-094 and the current verifier-vs-reviewer boundary before ordinary UI acceptance work;
5. deployment policy that separates HPL-control-plane validation from actual Product Production publication.

Therefore no new current policy source is required by this closeout.

## Deliberately not persisted

Temporary local worktree paths, local PIDs, ports, browser/session/login state, provider queue timing, deployment-specific URLs/IDs, the unused duplicate branch name, and one-off tool transport state were not promoted into standing policy.

No claim is made that this repository closeout wrote ChatGPT account-level long-term memory. The repository is authoritative for this project's HPL/governance rules; account memory remains a separate user-controlled layer.
