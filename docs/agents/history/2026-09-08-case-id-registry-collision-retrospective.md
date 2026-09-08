# Case-ID registry collision during human-feedback deposition — 2026-09-08

Status: **HISTORICAL INCIDENT / LESSONS LEARNED**

This file records one narrow failure discovered while depositing the 2026-09-07 Training Design / reader-feedback conversation. The broader human-feedback, cognition-first design, Fish/Bash, moving-main, A/B/C retention, and memory-boundary lessons are already owned by `2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md` and the current policies created around it. This incident exists only because one additional integration failure was not yet mechanically protected.

## What happened

At the deposition baseline `main@d045aceb62f3162572c45a480b31934cbf527af8`, `docs/agents/current/website-copy-cases.md` contained **76 CASE headings but only 72 unique CASE IDs**. Two independently valid case clusters had been appended by concurrent work using overlapping branch-local numbering; the collision covered CASE-065 through CASE-068.

The first deposition branch repaired that snapshot by preserving both clusters and provisionally moving the Training Design block to CASE-073–080. That repair was correct for that candidate tree, and a structural uniqueness test passed there.

While PR #548 was running its required CI, `main` moved again. PR #542 added the newer CASE-069–071 reader rules and integrated the Training Design cluster as CASE-072–079. Later PRs #550 and #551 also deposited broader human-feedback and stale-governance lessons. The old #548 numbering was therefore no longer current authority even though its earlier CI had been green.

The final resolution does **not** replay #548's case-library hunk. Current `main` keeps the already integrated CASE-072–079 identities. A narrow successor retains only the missing general invariant and the machine uniqueness Gate.

## Why it happened

The mistaken assumption was that a numbered append-only Markdown file behaves like a branch-local counter. It does not. In a repository with concurrent Agents, `max + 1` is only a proposal until the integrated tree is known.

A second contributing assumption was that a successful local/hosted check freezes the semantic identity of the candidate. It does not: when `main` changes the same registry, the candidate must be re-resolved against the new combined tree.

## Defensive rule

For manually numbered shared registries:

- read the exact base and overlapping registry work before allocating an ID;
- treat branch-local numbers as provisional;
- at integration, scan the combined candidate tree for duplicate IDs, anchors, and stale references;
- preserve all still-valid records and renumber the later/coherent block rather than choosing `ours`/`theirs` by convenience;
- re-run the check after material `main` movement;
- when uniqueness is machine-checkable, make it a normal repository Gate.

Current owner: `docs/agents/current/shared-registry-identity-governance.md`.
Executable protection: `src/lib/websiteCopyCaseIdGovernance.test.ts`.

## Anti-examples

**Looks reasonable but is wrong:** "My branch saw CASE-079 as the maximum, so CASE-080 is mine permanently." Another branch may have allocated the same identity before integration.

**Looks fast but is wrong:** resolve the merge with `ours` or `theirs` because both files are documentation. A numbering conflict can hide two different valid historical records.

**Looks conservative but is wrong:** restore the older numbering because its CI was green. Green checks are evidence for that exact tested tree, not authority over a newer integrated registry.

**Looks tidy but is wrong:** rewrite historical incident prose so every old CASE number matches today's registry. Historical receipts should stay truthful; only current references must follow current identity.

## A / B / C retention

**A — durable cross-task rule:** shared durable IDs are allocated at integration time; machine-check uniqueness when possible. This is kept in the current owner and executable Gate.

**B — BaseModel project lesson:** `website-copy-cases.md` is a concurrently edited registry whose CASE headings and explicit anchors must remain unique. This incident is retained here as project history.

**C — transient state:** the temporary worktree path, CI pending state, local port/PID, transport status, and momentary PR mergeability were deliberately not promoted into current policy. Exact SHAs and PR numbers appear here only to preserve the historical sequence.

## Repeat-error diagnosis

This failure was not caused by an absence of retrospectives about concurrency. The missing layer was **enforcement at the identity use-site**. Existing Git/worktree rules prevented destructive overwrites, but nothing mechanically rejected two valid branches choosing the same CASE number.

The corrective change is therefore not another generic "watch for conflicts" paragraph. It is a narrow identity-governance rule plus a structural test whose failure message points directly to that rule.

## Long-term-memory boundary

No account-level memory write is claimed by this incident. Repository policy, history, and tests are durable project artifacts; they are not evidence that ChatGPT account memory was updated. The broader 2026-09-07 retrospective already records the runtime's memory-write limitation and the stable user-preference candidates.
