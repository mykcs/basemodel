# Codex Luna long-run execution runbook

Purpose: let a long-running implementation Agent execute BaseModel Design v1 for hours without drifting into a redesign-by-instinct loop.

## 1. Start contract

Work on the existing Design v1 branch/PR. Do not create parallel redesign PRs unless the current PR is technically unrecoverable.

Before mutation:
1. read root `AGENTS.md`;
2. read `docs/wish/LATEST.md`;
3. read this folder's `README.md`, `LATEST.md`, `SYSTEM.md`, `PATTERNS.md`, `DELIVERY.md`, `IMPLEMENTATION.md`, `REFERENCE_PAGES.md`;
4. read the rollout task document under `docs/agents/tasks/`;
5. refresh `origin/main`, the task PR head and open overlapping PRs;
6. inspect worktree/branch/dirty state;
7. resolve scientific authority before touching research copy.

On first execution, read the full authority chain. On resume, read the latest task checkpoint, refresh changed authorities and verify the actual branch/tree before continuing the first unfinished item. Do not restart completed phases or rebuild the authority system. The frozen Phase 0 inventory defines scope; `DELIVERY.md` defines exit criteria.

## 2. Non-negotiable boundaries

Do not:
- rerun scientific experiments;
- change a result to improve the story;
- weaken claim boundaries;
- join incompatible panels into a ranking;
- delete assertions because the redesign fails them;
- invent a new global component before proving a real repeated pattern;
- make all pages share one template;
- copy Apple/OpenAI/other reference-site surface styling;
- hide provenance that a deep reader needs;
- spend Vercel final-gate builds on every intermediate push.

## 3. Execution loop

Repeat until the current phase is complete:

```text
select smallest coherent route batch
-> resolve authority + Reader Contract
-> state the page's one-sentence reader task
-> state first-viewport answer
-> identify the specific reader/checklist failure this batch will fix
-> choose semantic pattern(s)
-> implement content + HTML + visual composition together
-> run focused deterministic tests
-> run real browser at 390/768/1440 in light + dark, plus the existing required matrix
-> inspect screenshots and DOM overflow
-> fix hierarchy, not just CSS symptoms
-> update task checklist / evidence
-> commit coherent batch
-> continue
```

Default batch size: one reference page or up to three closely related sibling routes.

Reuse existing tokens/components where suitable; keep new composition local until all three references have been compared. Before each changed presentation contract, distinguish immutable scientific/functional invariants from editorial DOM/order assumptions. Update only the latter with an explicit before/after reader rationale and equivalent or stronger checks.

## 4. Checkpoints

Create a durable checkpoint after:
- each reference page;
- each extracted shared pattern/component;
- each route-family batch;
- any shared/global CSS change;
- any main-branch refresh that changes the candidate tree.

A checkpoint records:
- files changed;
- reader task;
- scientific authority checked;
- focused tests;
- browser widths;
- regressions found/fixed;
- remaining phase items.

Use the existing rollout task as the durable ledger. Each checkpoint also binds base/head (or pre-commit tree fingerprint), route/template/locale scope, scientific source revision, build/browser artifacts, actual pass/fail/not-run results, acceptance level and the exact next action. After committing, reference the source commit from the next checkpoint or PR record; do not chase a self-referential commit hash with endless evidence-only commits. Final required CI and Preview still bind to the latest PR head under current provider policy.

Keep a single current resume pointer and compact completed evidence. Runtime/context exhaustion is an interrupted run, not completion or a scientific blocker: save the checkpoint and resume at the unfinished action on the next execution. Do not promise work will continue after the session ends unless the user has separately requested a scheduler.

Do not fill permanent design docs with transient run IDs. Use the task document / PR body for execution evidence.

## 5. Decision rules

### If tests pass but the Design review identifies a concrete defect

Keep working on that defect. Mechanical green is not a design conclusion.

Diagnose:
- wrong first visual owner?
- too many equal-weight blocks?
- no visual relationship?
- card soup?
- result too late?
- density not staged?
- mobile merely collapsed?

Record the observed defect, smallest corrective hypothesis and a before/after check. Once the checklist findings are resolved and candidate criteria pass, advance to the next batch. An undefined wish to make it prettier is not an endless retry requirement or grounds for a new visual direction. An unresolved subjective preference remains an owner-review item without a false acceptance claim.

### If a test fails because it protects real semantics

Fix the page.

### If a test protects an obsolete implementation detail

Prove the intended user-facing contract first, then narrowly update the test. Never weaken scientific or accessibility assertions.

### If an active PR touches the same semantic owner

Stop writing that owner, inspect the other PR, then choose one:
- wait for/absorb its semantic delta;
- move to a non-overlapping batch.

Never overwrite unknown concurrent work.

Apply the task's PR #805 integration rule to all three references and their dependencies. Prefer a reviewed integration into the same #806 branch; keep #806 based on `main`. Do not create a parallel redesign PR, force-push over a moving head, or merge the prerequisite PR without separate authorization. An overlapping filename alone is not a blocker; unresolved semantic ownership is.

### If main moves

Continue on the current batch if the movement is unrelated. Before final exact-head acceptance, refresh and reconcile. If a shared owner moved materially, revalidate the combined tree.

## 6. Stop conditions

Pause implementation and report a real blocker only when:
- scientific authority is genuinely ambiguous or contradictory;
- an irreversible/high-risk action needs owner approval;
- auth/2FA/billing blocks required provider acceptance;
- another active writer makes safe semantic integration impossible;
- current repository truth contradicts the rollout authority and cannot be safely reconciled.

Do **not** stop merely because:
- a build/test fails;
- CSS is hard;
- a page needs several iterations;
- a tool path times out once;
- the visual result is not good enough yet.

Try safe alternate paths and continue.

If only one route is blocked, record its exact owner conflict and continue genuinely independent authorized work. Before declaring no route remains, consult the [shared Engineering Completion Protocol](https://github.com/mykcs/.agents/blob/main/docs/dev/ENGINEERING_COMPLETION_PROTOCOL.md) and the project operating principles. A failed connector or unsupported local browser binary is a route failure until authorized alternatives are checked.

Provider work still running is `pending`, not `PASS` or a failure. Follow the current provider wait policy: use bounded state reads, perform independent work, and leave a resume checkpoint if nothing else remains. Do not use no-op commits or repeated final-gate triggers to manufacture progress.

## 7. Human-taste boundary

The Agent should autonomously complete all mechanical and evidence-driven work.

It may label a page:
- `mechanically complete`;
- `Design-reference candidate`.

Only the owner can label it:
- `owner-accepted reference`.

Lack of immediate owner review is not permission to stop the implementation program early. Finish the executable scope, then leave the subjective acceptance status explicit.

## 8. Provider / PR discipline

- Keep one long-running Design v1 PR unless unrecoverable.
- Use ordinary branch pushes for work; avoid final Vercel acceptance until a candidate is actually ready.
- Reuse the PR for corrections.
- Request exact-head provider gate only at final acceptance according to current Dev/hosting authority.
- Do not merge unless the execution prompt explicitly authorizes merge.

Use lightweight review-only Preview when a render is useful during iteration; it cannot substitute for final acceptance. At closeout verify the actual public CI execution, the same-head Vercel deployment and protected product routes. Mark Ready only after Phase 8 passes. This task grants no merge or Production-release authorization.

## 9. Final report

The final report must say:
1. which phases completed;
2. which routes migrated;
3. which patterns/components were extracted;
4. test/browser evidence;
5. remaining visual debt;
6. owner-accepted vs candidate status;
7. exact blocker, if any;
8. whether PR is merely Ready or actually merged.
