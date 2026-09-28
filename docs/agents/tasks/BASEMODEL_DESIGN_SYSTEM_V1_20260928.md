# BaseModel Design System v1 — execution plan

Status: **PLAN REFINED / IMPLEMENTATION NOT STARTED**
Date: 2026-09-28
Repository: `mykcs/basemodel`
Branch: `design/basemodel-design-system-v1-20260928`
PR: #806

## 1. Owner request

Establish a BaseModel Design system parallel to Wish and Dev, then use it to redesign the site so content, explanation, HTML and visual composition reinforce each other.

The owner explicitly wants the planning/intelligence work solved now and the long-running implementation handed to Codex Luna.

This planning revision edits execution documents only. Page implementation, experiment execution, website acceptance and merge are not performed by this revision. The owner will review the revised plan and hand execution to Luna; do not dispatch an implementation chat automatically.

## 2. Why this exists

The current site already has strong scientific and reader-contract rules, but visually correct pages can still feel like research documents poured into a web layout:
- too many equally weighted blocks;
- result appears late;
- card-heavy composition;
- weak visual reward for continuing to read;
- mobile can inherit desktop presentation logic;
- copy, HTML structure and visual hierarchy are not always designed as one system.

This program closes that gap without redesigning the science.

## 3. Authorities

Before implementation read:

- root `AGENTS.md`;
- `docs/wish/LATEST.md` and relevant Wish design interpretation;
- `docs/design/README.md`;
- `docs/design/LATEST.md`;
- `docs/design/SYSTEM.md`;
- `docs/design/PATTERNS.md`;
- `docs/design/DELIVERY.md`;
- `docs/design/IMPLEMENTATION.md`;
- `docs/design/CODEX_LUNA_RUNBOOK.md`;
- `docs/design/REFERENCE_PAGES.md`;
- route-specific Reader Contract;
- scientific/result authority;
- relevant `docs/agents/current/*` design/research/browser owners.

## 4. Non-goals

This task does not authorize:
- rerunning OpenEVO experiments;
- changing scientific conclusions;
- creating a new research ranking;
- rewriting Astro/React stack;
- replacing all existing current policies with Design docs;
- copying Apple/OpenAI visual styling;
- a big-bang global CSS rewrite;
- merging without explicit merge authorization.

## 5. Deliverables

### Authority
- [x] create `docs/design/` parallel to Wish/Dev;
- [x] define Design responsibilities and precedence;
- [x] define current Design direction;
- [x] define semantic pattern catalog;
- [x] define delivery standard;
- [x] define site-wide implementation phases;
- [x] define Codex Luna autonomous runbook;
- [x] define first reference pages;
- [x] route Design from root `AGENTS.md`.

### Implementation
- [ ] Phase 0 inventory and baseline screenshots;
- [ ] Stage1 reference-page redesign;
- [ ] Bounded reference-page redesign;
- [ ] Progress briefing responsive redesign;
- [ ] extract only proven shared patterns/components;
- [ ] migrate active research journey;
- [ ] migrate broader route families;
- [ ] reduce proven-dead legacy visual layers;
- [ ] add objective Design guards where useful;
- [ ] full exact-head CI/browser/Preview acceptance.

### Closeout
- [ ] update this checklist with evidence;
- [ ] classify mechanically complete vs Design-reference candidate vs owner-accepted;
- [ ] refresh current main/open PRs before final gate;
- [ ] make PR Ready only after exact-head acceptance;
- [ ] do not merge unless separately authorized.

## 6. Scientific integration prerequisite for all three references

Stage1, Bounded **and Progress briefing** have scientific publication work in PR #805. The dependency includes their content components, `src/data/siteReaderContracts.ts`, `src/data/openEvoExperimentNavigation.ts`, the evidence mirror and publication/reading/briefing tests.

Before each affected batch:
1. refresh `main`, #806 head, #805 state/head/diff and the upstream scientific source revisions;
2. distinguish sealed scientific evidence from whether its website publication has merged; record both;
3. if #805 merged, incorporate current main into this branch before editing; if open, review its whole dependency set and integrate the required delta into this same branch only when semantic ownership is understood;
4. preserve newer scientific content and related assertions; never restore an old page snapshot or partially copy only a new hero;
5. re-read any subsequent #805 changes before the next affected write and final gate; unresolved concurrent semantics block that owner while independent work continues.

Keep #806 targeting `main`; no prerequisite merge or parallel redesign PR is authorized. Main and PR movement invalidates only the affected scientific/integration assumptions, not all prior independent work.

### Planning inspection checkpoint — refresh on execution

- Main observed at `f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`; #806 at `ee5067942b33b588f451dd91c4995a5209bf1015`, OPEN/Draft, before this revision.
- #805 was OPEN at `43fa2cbb3998824333826e8542cebf8265842f17`. Upstream `mykcs/openevo-experiment#597` was OPEN at `9aa6293e0fd409d9043d2f0ac62d72e27699ec7a`; its final scientific summary and #805's mirror agreed on the checked A/B results. These are inspection snapshots, not permanent current-state authority.
- No page in this rollout has yet received mechanical completion, Design-reference candidate or owner-accepted status. Existing references accepted under other contracts keep their original, narrower scope.
- The observed #806 bootstrap `public-ci-gate` passed; browser execution was skipped for docs-only scope. This is documentation CI evidence, not website Design acceptance.

The Design program may change hierarchy, narrative entry, semantic HTML and responsive composition. The current owner request authorizes updating the associated editorial Reader Contracts and presentation assertions in the same batch: Bounded may lead with the new capacity question while preserving original rank128 recurrence; Briefing may present current answers first and use phone vertical reading while preserving its full historical explanation. Scientific chronology, values, panels, claim limits, accessibility and functional checks remain protected. See `REFERENCE_PAGES.md` for exact owners, known test conflicts and the byte-unit correction to make during implementation.

## 7. Execution order

```text
authority + inventory
-> Stage1
-> Bounded
-> Briefing
-> compare three real pages
-> extract proven patterns
-> active research route families
-> broader BaseModel route families
-> shared CSS debt reduction
-> objective design guards
-> exact-head acceptance
-> Ready for review
```

## 8. Evidence cadence

After each reference page and each route-family batch, record:
- reader task;
- scientific authority checked;
- files changed;
- focused tests;
- browser widths inspected;
- visual problem found;
- fix made;
- remaining work.

Do not persist temporary Preview share tokens, local PIDs or ports.

Phase 0 must add the finite route/family inventory here following `IMPLEMENTATION.md`; this existing task is the execution ledger, not a second Design constitution. Use compact records with route/template/locale, owner, planned phase/batch, disposition and evidence links. Track canonical routes separately from redirect/retired routes and generated family representatives. Record migrated versus already-conformant routes honestly.

For each completed batch add the base/source commit or tree, exact checks actually run, fresh build/browser evidence, concrete review findings/resolution and the three separate acceptance fields from `DELIVERY.md`. Record any blocked owner and dependency explicitly. Keep the next action below current so another session can continue without rebuilding the plan.

**Next execution action:** refresh the scientific integration checkpoint, complete Phase 0 scope/baseline inventory, then implement Stage1. Phase 1 authority exists; Phase 0 and Phases 2–8 are not completed by this planning revision.

## 9. Stop conditions

Follow `docs/design/CODEX_LUNA_RUNBOOK.md`.

In particular, do not stop for ordinary build/test/visual iteration. Stop only for a real authority, concurrency, irreversible-action or authentication blocker.

## 10. Handoff to Codex Luna

After the owner reviews this plan, hand Luna this instruction:

> Continue `mykcs/basemodel` PR #806 on `design/basemodel-design-system-v1-20260928`, targeting main. First read `docs/agents/tasks/BASEMODEL_DESIGN_SYSTEM_V1_20260928.md`, then its full authority chain and current checkpoint. Execute `docs/design/IMPLEMENTATION.md` with `CODEX_LUNA_RUNBOOK.md` through the finite Phase 0 inventory and all mechanically executable phases. Refresh main, #805 and upstream science before touching any of the three references; preserve their full publication dependencies. Work Stage1 -> Bounded -> Progress briefing, compare all three, then extract only demonstrated reuse and migrate route families. Editorial Reader Contract/test migrations are authorized as documented; sealed science and meaningful assertions remain protected. Use one reference or at most three related routes per batch, real 390/768/1440 light/dark browser review plus the existing required matrices, and durable source-bound checkpoints. Continue through ordinary failures; isolate true blocked owners and finish independent work. Candidate design may propagate provisionally; only an actual owner render review grants owner acceptance. Finish with exact-head repository CI, actual Vercel deployment and real Preview inspection, then mark Ready. Keep one PR; do not merge or run experiments. If runtime ends, save the exact next action and report interruption rather than completion. Report scope, routes, extractions, CSS removals, guards, actual browser/CI/Preview evidence, acceptance levels and any remaining blocker.
