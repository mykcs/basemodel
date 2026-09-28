# BaseModel Design System v1 — execution plan

Status: **PLANNED / AUTHORITY BOOTSTRAP**
Date: 2026-09-28
Repository: `mykcs/basemodel`
Branch: `design/basemodel-design-system-v1-20260928`
PR: #806

## 1. Owner request

Establish a BaseModel Design system parallel to Wish and Dev, then use it to redesign the site so content, explanation, HTML and visual composition reinforce each other.

The owner explicitly wants the planning/intelligence work solved now and the long-running implementation handed to Codex Luna.

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
- [ ] route Design from root `AGENTS.md`.

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

## 6. Important overlap: post-advisor publication PR

The Stage1 and Bounded reference pages have recent/active scientific publication work in PR #805.

Before Phase 2:
1. inspect current `main`;
2. inspect PR #805 state and diff;
3. preserve the latest scientifically accepted content;
4. do not overwrite #805 with an older page snapshot;
5. if #805 merged, refresh this Design branch before editing those pages;
6. if #805 remains open and overlaps, integrate deliberately rather than creating a competing page owner.

The Design program may change hierarchy/HTML/CSS. It may not change the sealed scientific meaning.

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

## 9. Stop conditions

Follow `docs/design/CODEX_LUNA_RUNBOOK.md`.

In particular, do not stop for ordinary build/test/visual iteration. Stop only for a real authority, concurrency, irreversible-action or authentication blocker.

## 10. Handoff to Codex Luna

Use this instruction after this PR exists:

> Continue the existing BaseModel Design System v1 PR and branch. Read the full authority chain listed in `docs/agents/tasks/BASEMODEL_DESIGN_SYSTEM_V1_20260928.md`, then execute `docs/design/IMPLEMENTATION.md` using `docs/design/CODEX_LUNA_RUNBOOK.md` until all mechanically executable phases are complete. Do not rerun or redesign scientific experiments. Preserve scientific/result authority and Reader Contracts. Work reference-first: Stage1, Bounded, Progress Briefing; only then extract shared patterns and migrate route families. Keep one PR, use bounded route batches, validate real browser layouts at phone/intermediate/desktop widths, and continue through ordinary failures instead of stopping. Do not weaken tests or claim boundaries. Do not merge unless separately authorized. Final report must distinguish mechanically complete, Design-reference candidate, and owner-accepted status.
