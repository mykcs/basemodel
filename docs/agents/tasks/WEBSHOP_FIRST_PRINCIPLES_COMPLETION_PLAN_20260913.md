# WebShop First-Principles Page Completion Plan

Status: **ACTIVE / CHECKLIST AUTHORITY FOR THIS CONVERSATION**
Repository: `mykcs/basemodel`
Target route: `/research/seed-openevo/flow/webshop/` and `/en/research/seed-openevo/flow/webshop/`
Primary implementation PR: `#655` (`feat/webshop-reader-map-20260912`)
Created from owner conversation: 2026-09-13 (SGT)

## 0. Purpose and completion rule

This file is the execution authority for the WebShop page work requested in this conversation. The job is not merely to add a table of contents. The page must be reorganized from a first-time reader's point of view so that a reader can establish the experimental object before reading mechanics.

The required reader path is:

```text
WebShop 是什么
→ 为什么它值得作为 benchmark
→ SEED 在 WebShop 上用了什么设置
→ Agent 怎样交互
→ 任务怎样生成 / 划分
→ 分数怎样计算、怎样公平比较
```

**A checkbox may be changed from `[ ]` to `[x]` only after the corresponding repository/provider evidence exists.** “Code written”, “test started”, “PR opened”, “deployment pending”, or “I think it is correct” are not completion evidence.

When all delivery-standard items in §10 are `[x]`, the task is complete. Until then, the hourly automation must continue from the first meaningful unchecked item.

---

## 1. Frozen product intent

The WebShop route is an **experimental-instrument explanation page**, not a generic tutorial, dashboard, or parameter dump.

### 1.1 First-principles information architecture

- [x] The page starts by identifying **WebShop itself**, rather than beginning with interaction mechanics.
- [x] A visible, low-noise **目录 / Contents** appears before the detailed mechanism figures.
- [x] The contents order is:
  1. WebShop 基准 / WebShop benchmark
  2. 论文影响力 / Paper impact
  3. SEED 的 WebShop 设置 / SEED WebShop setting
  4. Agent 交互 / Agent interaction
  5. 任务生成与划分 / Task generation and split
  6. 评分与公平比较 / Scoring and fair comparison
- [x] Existing detailed WebShop mechanism figures remain below this orientation layer rather than being duplicated.
- [x] The selected visual direction is **B: vertical research-document hierarchy**, not a dashboard/card wall and not a two-column competing-center summary.

### 1.2 Rejected variants retained as design evidence

Variant A is rejected because it creates multiple equal-weight cards, English eyebrow labels, and attention tax before the reader has established the object. Variant C is rejected because benchmark identity and SEED configuration become two simultaneous visual centers.

Acceptance witness for selected B:

- desktop screenshot: `/tmp/webshop-candidate-b-final-desktop.png` during local review;
- phone screenshot: `/tmp/webshop-candidate-b-final-phone.png` during local review;
- human-preference candidate receipt: selected `B`, verifier PASS.

Do not copy local `/tmp` screenshot paths into public UI. They are local review evidence only.

---

## 2. WebShop identity and primary sources

Implementation owner: `src/components/research/WebShopReaderMap.astro`

- [x] State in plain language that WebShop is a simulated e-commerce benchmark in which an Agent receives a natural-language shopping request and must search, browse, choose product attributes/options, and complete a purchase over multiple actions.
- [x] Link the original paper: `https://arxiv.org/abs/2207.01206`.
- [x] Link the official project page: `https://webshop-pnlp.github.io/`.
- [x] Link the official code repository: `https://github.com/princeton-nlp/WebShop`.
- [x] Show original benchmark scale as approximately **1.18M products** and **12,087 crowd-sourced instructions**.
- [x] Keep source links close to the facts they support; do not build a detached bibliography wall.

### Acceptance

- `WebShopReaderMap.astro` contains the paper/project/code links.
- `npm run audit:brand-links` remains PASS.
- Chinese and English routes render the same scientific facts without translation-driven semantic drift.

---

## 3. WebShop impact / citation evidence

- [x] Include a concrete impact signal rather than vague language such as “very influential”.
- [x] Current pinned display value: **386 Scopus citations**.
- [x] Pin the source: **Princeton Research Portal**.
- [x] Pin the observation date: **2026-09-12**.
- [x] Explicitly say citation counts vary by database and date.
- [x] Link the citation-count source directly beside the citation statement.

### Refresh rule

The citation count is a dated observation, not a timeless constant. Future refreshes must update the number and date together and must not silently substitute Google Scholar/Semantic Scholar/OpenAlex counts while leaving the label “Scopus”.

---

## 4. SEED × WebShop setting: evidence layers must stay separate

Implementation owner: `src/components/research/WebShopReaderMap.astro` plus the existing detailed fair-comparison section in `SeedWebShopCanonicalFigure.astro`.

The top summary must use a semantic table with three evidence layers:

### 4.1 PAPER — what the SEED paper reports

- [x] Report **128 WebShop test samples** for the paper evaluation description.
- [x] Report training batch size **16**.
- [x] Report rollout group size **8**.
- [x] Report maximum interaction length **15 steps**.
- [x] Report paper training schedule **150 policy updates**.
- [x] Link the SEED paper from this row.

### 4.2 RELEASED CODE — what the pinned public implementation defines

Pinned source root:

```text
https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c
```

- [x] Link `examples/seed_trainer/_common/webshop.sh`.
- [x] Link `agent_system/environments/env_package/webshop/envs.py` for task sampling/split evidence.
- [x] Show small WebShop with **1,000 products**.
- [x] Show **6,910 executable goals**.
- [x] Show training-candidate goal range **500–6909**.
- [x] Show held-out candidate range **0–499**.
- [x] Show released-code validation size **128**.
- [x] Show released-code validation sampling temperature **T=0.4**.
- [x] Show max steps **15**.

### 4.3 UNKNOWN — what public evidence does not uniquely identify

- [x] State visibly that the paper's final reported result is **not uniquely bound in public evidence to one validation ordinal, one checkpoint, and one exact 128-task manifest**.
- [x] Do not relabel a reconstructable 128-task validation draw as “the exact final 128 tasks from the paper”.
- [x] Preserve the link from the summary to the detailed fair-comparison boundary lower on the page.

### Scientific wording invariant

Never collapse these into one “SEED setting” row if doing so erases provenance. A neat table is not allowed to imply paper-exact identity where only released-code reproducibility exists.

---

## 5. Page copy and reader-attention contract

Owners:

```text
src/components/research/SeedOpenEvoResearchDetail.astro
src/data/siteReaderContracts.ts
src/pages/research/seed-openevo/flow/webshop.astro
src/pages/en/research/seed-openevo/flow/webshop.astro
```

- [x] Update the WebShop route lede so it answers what WebShop is before describing page mechanics.
- [x] Update `flow-webshop` reader contract from mechanism-first to object/reference-first intent.
- [x] Keep the first scientific boundary visible: paper report / released code / unknown exact manifest are different evidence layers.
- [x] Remove meaningless English eyebrow UI such as `READER MAP`, `WHY IT MATTERS`, or `SETTING AT A GLANCE` when it adds no technical meaning.
- [x] Avoid “先回答六个问题 / how to read this page” host-like copy as a dominant visual center; the contents itself should do the navigation work.
- [x] Do not introduce a second H1; one rendered page owns one main heading.

### Reader cold-read target

A zero-context reader should be able to answer within roughly 5–10 seconds:

1. 这是什么？ — WebShop, a simulated e-commerce benchmark.
2. 为什么这里要讲它？ — it is the Web agent benchmark used in the SEED × OpenEvo research path.
3. SEED 怎么用它？ — the visible setting table gives the paper/code protocol and uncertainty boundary.
4. 接下来去哪？ — contents links to interaction, task construction/split, and scoring/fair comparison.

---

## 6. HTML / CSS implementation requirements

Primary component: `src/components/research/WebShopReaderMap.astro`.

- [x] Use semantic `<nav><ol>` for the contents.
- [x] Use semantic `<dl>` for paper / scale / citation facts.
- [x] Use a real `<table>` for PAPER / RELEASED CODE / UNKNOWN because row/column alignment carries meaning.
- [x] Keep the setting table in a local `overflow-x:auto` container on narrow screens.
- [x] Prevent the table's `min-width:760px` from expanding the parent grid/document: `.webshop-entry` must use `grid-template-columns:minmax(0,1fr)`.
- [x] Document-level horizontal overflow must be zero at 390px mobile width.
- [x] The table may have internal scroll width > viewport width as long as the root document does not.
- [x] Contents links wrap safely in Chinese and English.
- [x] All major same-page targets use appropriate `scroll-margin-top` so the sticky header does not cover the section heading.

### Regression already found and fixed

The first narrow-screen implementation used an implicit CSS Grid track. The table's 760px min-content expanded the only grid column and caused a **378px document overflow** at a 390px viewport. The durable fix is a shrinkable track, not hiding overflow globally.

Do not replace this with `body { overflow-x:hidden }`; that would mask layout errors.

---

## 7. Interactive WebShop explainer compatibility

The existing `InteractiveResearchExplainer kind="webshop"` remains the interaction-mechanics owner.

- [x] Contents “Agent 交互” points to the explainer's existing `#irx-webshop-title` anchor.
- [x] Do **not** wrap the explainer in an extra div merely to create an anchor.
- [x] Preserve the repository's standalone transport CSS ownership:

```css
.plain-detail__interactive > astro-island > [data-interactive-research-explainer] > .irx-controls > .irx-transport {
  position: fixed;
}
```

- [x] Previous / Next transport remains fixed from initial render through interaction on standalone research routes.
- [x] Mobile WebShop transport remains inside the viewport.

### Regression already found and fixed

An intermediate version inserted `<div id="webshop-interaction">` around the explainer. That broke the direct-child selector and caused `.irx-transport` to fall back from `fixed` to base `sticky`. The wrapper was removed; the contents now link directly to `#irx-webshop-title`.

---

## 8. Required validation sequence

Do not skip directly to Vercel.

### 8.1 Static / deterministic validation

- [x] `git diff --check`
- [x] `npm run check` — 0 errors.
- [x] `npm run audit:copy:strict` — 0 strict invariant failures.
- [x] `npm run audit:reader-contracts` — PASS.
- [x] `npm run build` — PASS; 494 static routes built at the last recorded local validation.
- [x] `npm run audit:headings` — every static route has exactly one H1.
- [x] `npm run audit:brand-links` — PASS.
- [x] deterministic Vitest suite — 103 files / 676 tests PASS at the recorded candidate run.

### 8.2 Focused browser validation

- [x] `tests/e2e/canonical-research-figures.spec.ts` — WebShop mobile/desktop/light/dark passes after overflow fix.
- [x] `tests/e2e/floating-step-transport.spec.ts` — PASS after removing the wrapper regression.
- [x] `tests/e2e/site-reader-contracts.spec.ts` relevant WebShop route remains compliant.
- [x] 390px root document width equals client width; local setting table remains independently scrollable.

### 8.3 Full UI preflight on final code tree

Command:

```bash
npm run preflight:ui
```

This expands to the repository-owned deterministic gate, production build, overflow preflight, and `test:ui:all` cross-browser matrix.

- [ ] **Final exact candidate** `npm run preflight:ui` completes with exit code 0 after all WebShop fixes.
- [ ] Record exact candidate SHA in §11 after the final preflight is green.
- [ ] If a failure is unrelated to the branch, prove it on current `main` before changing shared code or tests.
- [ ] If a failure is branch-induced, make the narrowest semantic fix, rerun the affected focused spec, then rerun full preflight.

Current execution note at file creation: an exact-head full preflight was running on the post-regression-fix candidate; do not mark it green until its process exits 0.

---

## 9. GitHub / Vercel / merge / Production workflow

Working PR: **BaseModel #655**.

Repository deployment contract requires ordinary branch work to stay off Vercel until the final candidate is ready.

- [ ] Refresh `origin/main` and PR #655 immediately before publishing final branch state; inspect unexpected main/PR drift before proceeding.
- [ ] Push the selected implementation and this checklist to `feat/webshop-reader-map-20260912` without overwriting unknown concurrent work.
- [ ] Confirm PR #655 head SHA equals the pushed local candidate SHA.
- [ ] Confirm PR #655 remains mergeable against current `main`; if main moved materially, reconcile/revalidate rather than assuming the old base is current.
- [ ] Update PR body if needed so it describes the final document-style implementation, scientific boundary, regression fixes, and validation evidence.
- [ ] Run the repository's final candidate gate:

```bash
node scripts/request-vercel-final-gate.mjs 655
```

- [ ] Confirm persistent `ci/vercel-gate-base` records live `main` and `ci/vercel-gate-final` points to the exact PR head.
- [ ] Confirm Vercel Preview exists for that exact head and reaches **READY / SUCCESS**.
- [ ] Inspect Vercel build logs if ERROR; fix only the smallest validated cause.
- [ ] Verify the Preview WebShop route in Chinese and English.
- [ ] Verify Preview at 390px mobile and desktop, light/dark, no document overflow, no overlap/clipping, and working contents anchors.
- [ ] Verify no toolbar/reviewer comments remain unresolved for this route if provider state exposes them.
- [ ] Merge PR #655 only after required checks and exact-head Vercel acceptance are green.
- [ ] Record merge commit SHA.
- [ ] Confirm `main` Production deployment reaches READY.
- [ ] Verify public Production route:

```text
https://basemodel-preview.vercel.app/research/seed-openevo/flow/webshop/
https://basemodel-preview.vercel.app/en/research/seed-openevo/flow/webshop/
```

- [ ] Production cold read still satisfies the 5–10 second reader target in §5.

---

## 10. Delivery standard — all boxes required for DONE

### Product / research

- [ ] A first-time reader sees a real contents section before detailed WebShop mechanisms.
- [ ] WebShop identity is stated directly and the original paper is linked.
- [ ] Scale is visible: 1.18M products / 12,087 instructions.
- [ ] Impact is visible as a dated/source-labelled citation observation, not an undated popularity claim.
- [ ] SEED setting is visible near the top and separated into PAPER / RELEASED CODE / UNKNOWN.
- [ ] The exact-final-128-task uncertainty remains visible and is not rhetorically erased.
- [ ] Existing detailed interaction / dataset / small-world / goal-generation / split / evaluation figures remain reachable in one coherent page.

### UX / accessibility

- [ ] Chinese and English routes are semantically aligned.
- [ ] Exactly one H1 per rendered route.
- [ ] Contents anchors land on the intended sections.
- [ ] No document horizontal overflow at 390px, 768px, or desktop widths.
- [ ] Internal table scrolling is local and keyboard-focusable.
- [ ] Light and dark themes preserve text/border/surface readability.
- [ ] WebShop Previous / Next controls keep the correct fixed standalone behavior.
- [ ] Reduced-motion/static reading does not lose meaning from the existing mechanism explainer.

### Engineering / release

- [ ] Final exact code tree passes `npm run preflight:ui`.
- [ ] PR #655 exact head is accepted by required GitHub/Vercel gates.
- [ ] PR #655 is merged into `main`.
- [ ] Production Vercel deployment is READY.
- [ ] Public Production route is manually/browser verified after merge.
- [ ] This checklist is updated with final SHA / PR / deployment evidence and every completed item is `[x]`.

**Only when every checkbox in this §10 is `[x]` may the automation report “WebShop first-principles page complete”.**

---

## 11. Evidence ledger

Update this section rather than relying on chat memory.

| Evidence | Current value / status |
| --- | --- |
| Repository | `mykcs/basemodel` |
| Working PR | `#655` |
| Working branch | `feat/webshop-reader-map-20260912` |
| Original PR head observed | `df75940c49e91e80460a1085b4e3b06ac7c53984` |
| Selected candidate direction | `B — vertical research-document hierarchy` |
| Post-layout-fix local candidate observed | `7493ec8f893dbb79a7d3229fe883c2e74744cad1` before adding this checklist; refresh after final commit |
| Candidate preference receipt | PASS, 3 candidates, selected B |
| Mobile overflow regression | found (378px) → fixed via `minmax(0,1fr)` |
| Transport regression | found (`sticky`) → fixed by removing wrapper and linking `#irx-webshop-title` |
| Focused canonical/transport browser tests | PASS after fixes |
| Final full `preflight:ui` | **RUNNING / must refresh** |
| Exact-head Vercel final gate | **NOT YET CONFIRMED** |
| Merge commit | **NOT YET** |
| Production deployment | **NOT YET** |
| Hourly automation | **ENABLED · RRULE:FREQ=HOURLY · Asia/Shanghai scheduler timezone** |

Whenever status changes, append the exact evidence (SHA, PR state, deployment id/url, test count, or provider status) before checking the associated box.

---

## 12. Hourly automation execution contract

- [x] Hourly automation is created and enabled with `RRULE:FREQ=HOURLY` and uses this Markdown path as its checklist authority.

Every hourly run must execute this algorithm:

1. Read repository root `AGENTS.md` and this file before mutation.
2. Refresh live repository truth:
   - `git fetch origin main feat/webshop-reader-map-20260912`
   - inspect current PR #655 head/base/mergeability/checks;
   - inspect Vercel only when the workflow has reached a provider step.
3. Reconstruct current status from durable evidence; do not trust stale chat prose.
4. Find the first **meaningful unchecked** item whose prerequisites are satisfied.
5. Execute that item end-to-end using the fastest safe surface.
6. Run the smallest appropriate validation first; run full required gates at the release boundary.
7. Change `[ ]` to `[x]` **only** when acceptance evidence is present.
8. Update §11 with exact evidence.
9. Commit/push the checklist update together with any code/evidence change that produced the completed item.
10. If blocked by a real owner-only action, leave the item unchecked and record the exact blocker; do not manufacture completion.
11. If every checkbox in §10 is complete, report completion and perform no speculative redesign or unrelated cleanup.

### Hourly automation stopping behavior

The automation itself may remain scheduled, but once §10 is fully complete each run must become a no-op except for confirming that completion evidence still exists. It must not keep modifying the page after acceptance.

### Forbidden shortcuts

- Do not mark a task complete merely because a PR is mergeable.
- Do not treat a GitHub status callback as proof a Vercel deployment actually built.
- Do not merge automatically through failed required checks.
- Do not widen test thresholds or reader budgets merely to make CI green.
- Do not hide mobile overflow globally.
- Do not replace the exact-manifest unknown with a guessed task list.
- Do not mix paper settings and released-code defaults without provenance.
- Do not create new competing WebShop pages for the same concepts.
- Do not turn this task into a sitewide redesign unless a concrete regression is proven to be shared-owner code.

---

## 13. Final closeout format

When all criteria are satisfied, the final checklist commit must record:

```text
final PR head SHA:
merge commit SHA:
Vercel Preview deployment id/url + READY status:
Vercel Production deployment id/url + READY status:
production verification timestamp:
Chinese route: PASS
English route: PASS
390px mobile: PASS
Desktop: PASS
light/dark: PASS
contents anchors: PASS
root horizontal overflow: 0
PAPER / RELEASED CODE / UNKNOWN boundary: PASS
zero-context cold read: PASS
```

Then check every box in §10 and leave the document as the durable recovery/runbook for this conversation.
