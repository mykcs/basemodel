# BaseModel Content-First / Apple-Guided Redesign — 2026-09-16

Status: **ACTIVE TASK PLAN / CHECKLIST AUTHORITY**  
Owner intent: redesign BaseModel so UI and content form one readable system; use Apple first-party design guidance as a reasoning reference, not a surface-style template.  
Initial base: `mykcs/basemodel@a12a0fba94452a39adafe3d9e9900e13cdf0953e`  
Scope: BaseModel public website, especially the active SEED × OpenEvo research surface.  
Non-authority note: this file is a task execution plan. Existing `docs/agents/current/*` documents remain the canonical design/copy/release owners.

---

## 1. Outcome

A first-time reader should be able to open a BaseModel page and quickly answer:

1. **What am I looking at?**
2. **What matters here?**
3. **What can I do or read next?**
4. **Where is the evidence if I want to go deeper?**

The page should not ask the reader to reverse-engineer the website’s internal taxonomy, authoring logic, experiment bookkeeping, or component structure before understanding the actual research object.

The implementation should use the web well: semantic HTML, responsive composition, progressive disclosure, real comparison structures, figures, tables, timelines, definition lists, horizontal choice rails where the objects are genuinely peers, and static-first Astro rendering. React/JS islands remain reserved for interaction that actually needs state.

### 1.1 What success should feel like

- The **content is the visual center**; navigation and controls help without competing with it.
- Each first viewport has **one clear cognitive owner**.
- Layout communicates relationships: comparison looks like comparison, sequence looks like sequence, evidence looks like evidence, choices look selectable.
- Copy is direct enough that a reader can understand the subject without learning the author’s presentation framework first.
- Dense evidence remains available, but it arrives at the depth where the reader needs it.
- Mobile feels intentionally composed rather than a shrunken desktop page.

---

## 2. Current BaseModel authority this task must obey

Read before implementation and re-read when a change touches the owned concern:

- `AGENTS.md`
- `docs/agents/current/project-agent-operating-principles.md`
- `docs/agents/current/website-engineering-standard.md`
- `docs/agents/current/human-thinking-web-expression-contract.md`
- `docs/agents/current/site-reader-attention-contract.md`
- `docs/agents/current/research-site-presentation-contract.md`
- `docs/agents/current/website-design-spec.md`
- `docs/agents/current/website-copy-cases.md`
- `docs/agents/current/human-preference-learning-system.md`
- `docs/agents/current/ui-design-principles.md`
- `docs/agents/current/sitewide-visual-knowledge-architecture.md`
- `docs/agents/current/ui-change-visual-acceptance-gate.md`
- `docs/agents/current/theme-contrast-contract.md`
- `docs/agents/current/seed-openevo-research-ia-route-inventory-2026-09-03.md`
- deployment / CI authority named by root `AGENTS.md`

This task does **not** create another competing visual standard. Durable rules that prove useful must be folded into the existing canonical owner only after the implementation shows they are needed.

---

## 3. First-party Apple references

Primary references used for reasoning:

- Apple HIG — Design principles: https://developer.apple.com/design/human-interface-guidelines/design-principles
- Apple HIG — Writing: https://developer.apple.com/design/human-interface-guidelines/writing
- Apple HIG — Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- WWDC26 — Principles of great design: https://developer.apple.com/videos/play/wwdc2026/250/
- WWDC26 — Craft clear names for features and labels in your app: https://developer.apple.com/videos/play/wwdc2026/290/
- WWDC26 — Communicate your brand identity on iOS: https://developer.apple.com/videos/play/wwdc2026/251/
- WWDC25 — Design foundations from idea to interface: https://developer.apple.com/videos/play/wwdc2025/359/
- WWDC25 — Get to know the new design system: https://developer.apple.com/videos/play/wwdc2025/356/
- WWDC25 — Make a big impact with small writing changes: https://developer.apple.com/videos/play/wwdc2025/404/
- WWDC22 — Explore navigation design for iOS: https://developer.apple.com/videos/play/wwdc2022/10001/

### 3.1 Translation into BaseModel behavior

| Apple principle | BaseModel translation |
| --- | --- |
| Purpose | A route begins from the reader’s actual question or task, not from site metadata or internal experiment vocabulary. |
| Agency | Navigation stays predictable; readers can move between overview, detail and evidence without being trapped in a scripted tour. |
| Simplicity | “Exactly enough”: remove friction and repetition, while keeping caveats that change scientific meaning visible. |
| Hierarchy | Order, spacing, type scale and grouping identify the one thing to notice first; equal-looking cards do not decide priority for the reader. |
| Familiarity | Links look like links, buttons perform actions, tabs/rails represent true peers, tables represent comparisons, and familiar browser behavior is preserved. |
| Flexibility | The semantic relationship survives phone, tablet and desktop; responsive work may change composition, not merely scale it down. |
| Craft | Copy, spacing, focus states, alignment, figure labeling, loading behavior and dark/light themes are all part of quality. |
| UI layer vs content layer | Shared navigation/actions are calm and consistent. Research identity, diagrams, evidence and page-specific meaning live in the content layer. |
| Writing | Put the most important information first; remove filler/repetition; use plain language; use action verbs for actions; define technical terms at first use. |

### 3.2 Explicit anti-copy rule

Do not imitate Apple by copying:

- Liquid Glass;
- Apple typography or proprietary assets;
- giant marketing heroes without a research reason;
- gratuitous rounded cards;
- decorative product-carousels where there is no real peer-choice task;
- large blue gradients or Apple-like chrome;
- slide-like screens that hide necessary scientific context.

The borrowed value is the **relationship between purpose, content, hierarchy, controls and progression**.

---

## 4. What the owner-provided screenshots teach us

The screenshots are treated as preference evidence for composition, not as components to clone.

### 4.1 Apple Store product rail

Useful qualities:

- the object being considered is visually dominant;
- image, variant swatches, name, one-line value, price and action are adjacent because they belong to the same decision;
- a horizontal rail is used because the products are genuine peers and continuation is visible;
- “learn more” material is separated from the immediate choice;
- controls are visually quieter than the product/content itself.

BaseModel application:

- use peer rails for real peer objects such as experiment designs, model families, evidence packages or alternate methods only when choosing/browsing peers is the reader task;
- keep status, result, evidence and action physically near the research object they modify or explain;
- do not detach a control into a remote toolbar if the reader cannot tell what it affects.

### 4.2 The short-form iOS comparison slides

Useful qualities:

- one screen communicates one primary thought;
- the title directly states the subject or decision;
- comparison cards appear only when there is a real two/three-way comparison;
- numeric callouts are few and large enough to carry meaning;
- secondary explanation is visibly subordinate;
- metadata exists, but it is not the first thing the eye must decode.

BaseModel application:

- a long research page can contain several **meaningful screens/chapters**, each with one visual owner;
- major section transitions may use strong type and whitespace when a new reader task begins;
- comparison sections should use a shared axis/structure instead of separate prose blocks;
- provenance stays reachable and traceable without becoming the headline treatment.

---

## 5. Repository observations that shape the implementation

At the initial base:

- `siteReaderContracts.ts` already makes reader intent executable;
- `ui-design-principles.md` already defines **Research Editorial × Experimental Workbench**, a scarce card budget and one-primary-center first viewport;
- the SEED × OpenEvo route inventory already classifies the route graph and flags mixed/current/history ownership problems;
- `src/styles/app.css` still composes several historical CSS layers (`v2-closeout`, `visual-upgrade`, `design-refinement`, `final-hardening`, `actionable-content`, `mobile-composition`, `visual-closeout`) before canonical owners, so visual debt can still leak through the cascade;
- current pages often share `shell / editorial-page / page-header / section-kicker` grammar, but page semantics vary much more than that grammar suggests;
- active open PRs include research-result/content work and CI work, so this redesign must avoid overwriting their semantic changes and should migrate by route family rather than by one massive blind rewrite.

The redesign therefore has two jobs at once:

1. improve page composition and copy;
2. reduce the gap between the already-good design contracts and the actual rendered site.

---

## 6. Page Expression Brief for this program

### Audience

A technically literate reader who may know machine learning or agents but does not already know the BaseModel site taxonomy, experiment nicknames, run IDs or the sequence of past OpenEVO decisions.

### Primary task

Understand one research object, state, comparison or mechanism quickly enough to decide where to go next.

### Primary path

```text
object / question
→ answer or current state
→ why / how
→ evidence
→ implementation / raw provenance when needed
```

### Density layers

- **L0 — Orientation:** object, one primary fact/choice, immediate next step.
- **L1 — Working understanding:** mechanism, comparison, causal relation, important caveat.
- **L2 — Evidence:** figures, tables, exact metrics, source identity, timestamps.
- **L3 — Audit depth:** SHA, manifest, run ID, raw fields, commands, long logs, implementation notes.

The UI should express these layers rather than making all four look equally important.

---

## 7. Route-family design model

This is a semantic model, not a set of templates.

| Route family | Default attention mode | First visual responsibility | Preferred web forms |
| --- | --- | --- | --- |
| Home / research gateway | choice | show the few real paths and why they differ | short intro + real choice rail/grid + recent state bridge |
| Flow / concept pages | reference | name the concept and show where it sits in the system | diagram, definition list, figure, linked evidence |
| Mechanism pages | narrative | show the causal/temporal path | real flow figure, ordered stages, optional motion, evidence below |
| Results pages | focus / comparison | show the supported result and claim boundary | result sentence, shared-axis comparison, chart/table, provenance disclosure |
| Experiment-design pages | comparison / choice | expose actual alternatives and frozen differences | comparison plate/table, decision criteria, selected path |
| Server / run / operations | operational | show current state, ownership boundary and next safe action | status line, resource composition, action list, provenance timestamp |
| Paper / model detail | reference | identify object and decision-relevant facts | article header, fact list, evidence/source notebook |
| Workspace | operational | keep the current decision surface central | task-centered controls, constraints quieter, evidence notebook |
| History / archive | narrative / reference | explain what happened and why it still matters | timeline, lineage, compact evidence links, explicit historical status |

---

## 8. Web/Astro implementation rules

### 8.1 Semantic HTML before container proliferation

Prefer native structure where it carries meaning:

- `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`;
- `figure` + `figcaption` for diagrams and charts;
- `dl` for fact/value relationships;
- real `table` for shared-axis comparison;
- `ol` for actual sequence;
- `details` + `summary` for optional provenance/implementation depth;
- anchor links for navigation, buttons for actions;
- `aria-current`, proper headings and landmarks.

A `div` plus border-radius is not a semantic primitive.

### 8.2 Astro static-first

- Server-render/static-render explanatory content by default.
- Reuse typed data owners instead of duplicating facts in page markup.
- Add a client island only when the reader gets real stateful behavior from it.
- Do not hydrate static cards, headings, tables or disclosure that native HTML can handle.
- Prefer CSS scroll snap for simple peer rails over a JS carousel.

### 8.3 Responsive composition

- Use Grid/Flex/container queries where the relationship benefits from them.
- Recompose comparisons and sequences on narrow screens; do not simply reduce font size.
- Horizontal rails are allowed only when the continuation is visually discoverable and the page itself does not overflow.
- Important claim boundaries remain visible on mobile.
- Keep the existing phone persistent-layer budget.

### 8.4 CSS ownership

- New shared visual behavior should enter through an existing canonical semantic owner or a clearly named new canonical component stylesheet.
- Do not add another `*-final-final.css` patch layer.
- When a touched legacy rule becomes unnecessary, retire it in the same route-family migration if safely attributable.
- Do not launch a sitewide CSS rewrite before pilot pages prove the replacement primitives.

---

## 9. Content + UI coupling rules

Every major section must answer **why this visual form fits this content**.

Examples:

- Two methods differ on the same four dimensions → one comparison table/plate, not two unrelated cards.
- A method moves through five stages → one connected process figure/ordered sequence, not five independent tiles.
- One result depends on one caveat → result and caveat stay in the same visible result block.
- An experiment has multiple evidence artifacts → one evidence notebook/list grouped by claim, not a decorative grid of filenames.
- A page offers three genuinely peer destinations → a choice rail/grid is appropriate.
- A page contains ordinary explanatory paragraphs → typography + whitespace is often enough; no card is needed.

### 9.1 Adjacency test

A reader should be able to point at a control, number, label or source and answer what object it belongs to without searching elsewhere on the screen.

If not, regroup the content or remove the detached UI.

### 9.2 Shared-axis test

If the purpose is comparison, comparable fields must align visually. Separate prose chunks that force memory-based comparison fail this test.

### 9.3 Sequence test

If order/flow is meaningful, the connection between steps must be visible in the static state. Animation may reinforce the path, but it cannot be the only evidence that a flow exists.

---

## 10. Copy rules for this migration

Apply the existing canonical “说人话” rules, with these task-time checks:

- H1 names the object, result, question or task directly.
- The lede gives the most important fact/state; it does not repeat the H1 in more words.
- Remove author-stage directions such as “这页先看… / 下面我们… / 如果只记住一句话…”.
- Avoid decorative insight language when a fact can be stated directly.
- Define unfamiliar technical terms on first use.
- Keep run IDs, SHAs, manifest fields and raw schema names at evidence/audit depth unless they change the reader’s first judgment.
- Buttons/links use descriptive action labels.
- Same object uses the same name across navigation, heading, diagram and evidence.
- A short sentence is preferred to a heading + card + explanation when the extra structure does not add meaning.

For every migrated route, perform a first-read comprehension pass against `website-copy-cases.md` and the human-preference system using the rendered page/screenshots plus the applicable Reader Contract and browser evidence. Do not introduce an external AI chat, AI CLI, or local/network vision model as a default reviewer. An independent reviewer is used only when the owner or the task explicitly asks for an independent comprehension study.

---

## 11. Execution phases and weighted progress

The percentages below are the reporting authority for the scheduled hourly continuation. Completion is checkbox/evidence based; do not raise the percentage merely because time was spent.

### Phase A — Baseline audit and conflict map — **10%**

- [x] Refresh `main`, open PRs, exact route owners and current design/copy authority.
- [x] Reuse the existing SEED × OpenEvo route inventory; update only where current route truth has drifted.
- [x] Generate a visual/content smell inventory: first-screen overload, detached controls, card misuse, comparison-without-shared-axis, sequence-without-flow, raw provenance too early, copy meta-talk, mobile compression.
- [x] Map overlapping open PRs by semantic route owner; classify independent / stack / wait / reconcile.
- [x] Record representative before screenshots for desktop + phone on pilot routes without promoting temporary screenshots to standing policy.

### Phase B — Shared composition primitives and token audit — **10%**

- [x] Audit current global shell, research nav, headings, spacing, typography, radii, borders, elevation, color semantics and disclosure patterns.
- [x] Identify which legacy CSS layers still override canonical owners on active routes.
- [x] Define the smallest reusable composition primitives needed by the pilots; no generic component factory.
- [x] Add/adjust shared tokens only when multiple pilots need the same semantic treatment.
- [x] Protect the new primitives with structural/unit tests where useful.

### Phase C — Four representative pilots — **20%**

Pilot selection covers four reader modes:

1. **Choice/gateway:** `/research/seed-openevo/` or the current canonical research gateway.
2. **Narrative/mechanism:** `/research/seed-openevo/flow/sd-lora/`.
3. **Focus/comparison:** one current result page with sealed evidence and an active route owner.
4. **Operational:** `/research/seed-openevo/flow/server/`.

For each pilot:

- [x] write/update the Page Expression Brief and reader contract if the task changed;
- [x] rewrite first viewport around one primary cognitive owner;
- [x] select content-shaped HTML rather than a card-first layout;
- [x] keep evidence/claim boundaries intact;
- [x] pass phone + desktop first-view visual/comprehension acceptance with rendered screenshots + Reader Contract/browser evidence;
- [x] pass targeted browser/reader-contract checks;
- [x] obtain an inspectable review Preview when the owner needs visual feedback.

Pilot exit rule: do not start broad migration until the four pilots show a coherent system **without forcing them into the same page template**.

The pilot implementation and visual-acceptance rows are evidenced across **all four** pilots. Owner decision — **2026-09-18**: ordinary BaseModel visual acceptance does **not** require a separate external AI/human reviewer. The canonical path is the repository-owned rendered evidence: exact phone/desktop screenshots, Reader Contract and semantic checks, browser geometry/overflow/theme/accessibility checks, and an inspectable review Preview when useful. HPL blind/compare tooling remains available for an explicitly requested independent preference/comprehension study, but it is not a default release or redesign dependency. Do not open Kimi, MiniMax, ChatGPT, Claude/Codex-style CLI sessions, or a local/network vision model merely to manufacture an independent verdict.

Current exact-product-tree evidence for this decision: the eight pilot phone/desktop renders were regenerated from the current product tree; focused Reader Contract/semantic checks passed **39/39**; targeted Chromium checks across the four pilot surfaces passed **39/39**, including phone/desktop first-view ownership, light/dark readability, overflow safety, keyboard reachability where applicable, and SD-LoRA topology/reduced-motion behavior. The subsequent change that records this owner decision is docs/tooling-only and does not alter the rendered product tree. Therefore Phase C is complete at **20 / 20 weighted points**. Current credited total: **55 / 100**.

Historical independent cold-read experiments remain useful iteration evidence: earlier failures helped uncover terminology friction, competing visual centers, and hidden first-screen context. They are no longer the Phase-C exit authority and must not be revived as a mandatory external-review workflow.

### Phase D — Canonical component/CSS consolidation — **15%**

- [x] Promote only proven pilot patterns into shared components/styles.
- [x] Remove touched obsolete compatibility rules when ownership is clear.
- [x] Reduce conflicting selector layers for the migrated surface.
- [x] Keep static content static; remove unnecessary hydration discovered during migration.
- [x] Ensure global navigation stays visually quieter than page content and active-state semantics stay correct.

Phase D is complete: **15 / 15 weighted points**. The consolidation is limited to patterns already proven by the four pilots. With the 2026-09-18 owner decision restoring ordinary visual acceptance as the Phase-C exit, Phase E may now proceed. Current credited total: **55 / 100**.

### Phase E — Route-family migration — **25%**

Migrate in bounded groups to reduce concurrent-PR conflict:

- [x] Flow/concept routes.
- [x] Study gateway and experiment-design routes.
- [x] Results/comparison routes.
- [x] Mechanism/SD-LoRA/history routes.
- [x] Operational/run/server routes.
- [x] Model/paper/reference routes relevant to the active research journey.

Model/paper use-site witness — **2026-09-18**: repeated owner feedback rejects “Apple-like” full-screen whitespace as a substitute for hierarchy. Current owners are the Reader Attention Contract, website copy/design rules, and the model-catalog evidence policy. This row may remove viewport-height padding and expose existing decision facts through semantic lists/definition axes; it may not invent or refresh model/paper facts, weaken first-screen budgets, or hide source/license/reproduction boundaries. Any scientific/data claim change, first-screen budget failure, or concurrent route-owner conflict invalidates this action and requires re-resolution.
- [x] Long-tail compatibility/history routes: preserve redirects/history semantics; do not cosmetically revive deprecated owners.

Long-tail use-site witness — **2026-09-18**: the remaining row is an authority/role cleanup, not a new scientific-content owner. Current owners are the executable Reader Contracts, sitemap/compatibility registries, the current Results and successor-design routes, and the preserved historical pages themselves. Checked artifacts show `/study/design/` already behaves as compatibility-only, while the three moved Results primers are still sitemap-listed pseudo-pages and the old benchmark-design/current-conclusion notes still read too much like present-tense owners. Allowed next action: make moved primers explicit redirect-style compatibility routes outside the sitemap; label old design/conclusion notes as historical cutoffs while preserving every scientific claim and evidence link; retain true archive/lineage pages and their historical caveats. Invalidation cues: any need to change a result, treatment, lifecycle, current scientific claim, or concurrent #734/#740/#743-owned meaning.

Each group must preserve current scientific authority and refresh against live upstream evidence before changing “current/running/completed/next” claims.

Flow/concept migration witness — **2026-09-18**: audited the canonical Flow family (`flow/`, `seed`, `openevo`, `benchmarks`, `webshop`, `alfworld`, `loops`, the base-model compatibility redirect, plus the already-migrated `server` / Vanilla `sd-lora` pilots) against current route ownership and concurrent PRs. The shared concept core now expresses ordinary explanation with editorial dividers, sequential relationships, shared-axis tables/lists, and quieter navigation instead of rounding each paragraph into a card; benchmark and loop first-view copy states the actual compared objects directly. Canonical WebShop interactive/figure ownership and the base-model redirect were deliberately preserved rather than cosmetically rewritten. Scientific facts and claim boundaries were unchanged. Focused structural/copy regression: **58/58 PASS** after the new anti-card-wall assertion; browser acceptance: **25/25 PASS** across Flow explainers, phone/tablet/desktop layout, light/dark readability, Reader Contract first-view checks, topology, reduced motion, and overflow. Phase-E route-family credit is recorded only for this completed Flow/concept row; the remaining six Phase-E families stay open.

Study gateway / experiment-design migration witness — **2026-09-18**: refreshed the canonical Study directory, the `/study/design/` compatibility redirect, the successor design owner at `study/capability-exploration/openevo-2-0/`, and concurrent scientific/content ownership before editing. The Study directory remains the five-experiment content-shaped directory rather than being rebuilt into a universal hero/card template. On the successor design surface, the two reading destinations are now editorial rows, the shared Stage-1 starting point is one same-axis comparison instead of separate metric cards, and raw freeze/source identities move to progressive disclosure while the meaning-changing boundary — design/preregistration is not run completion, and the higher 1.7B pre-learning baseline is not a later-learning/general-strength result — remains visible in ordinary reading order. The six scientific design families plus release-control line keep their pinned evidence and statuses unchanged; concurrent navigation/Reader-Contract data owned by other PRs was not rewritten. Regression validation after the readability fix: focused structural/copy checks **58/58 PASS**; successor/reader browser checks **79/79 PASS**; full Chromium UI gate **197/197 PASS**; production build and heading/brand audits PASS; document overflow preflight PASS; exact candidate renders were captured for Study + successor design at phone/desktop in light/dark with route sentinels and zero page overflow. This completes only the Study/experiment-design row. Phase E has no per-row weights, so the credited total remains **55 / 100** until the full 25-point phase is complete.

Results / comparison migration witness — **2026-09-18**: refreshed BaseModel `main`, PR #737 exact head/base/checks, open route owners, the Results-specific reader/publication contracts, and current `openevo-experiment` authority before editing. The scientific snapshot was deliberately left unchanged: no result value, evidence link, lifecycle state, treatment identity, or claim boundary was rewritten, and concurrent #728 / #740 / #743 ownership was not absorbed. The main Results Q1–Q7 path now reads as one continuous numbered research record instead of a rounded-card wall; the two task ranges and the two result metrics use aligned editorial comparison axes; measurement validity remains visible beside the claim it constrains. The existing four-arm final-result matrix remains a real table, while its six prespecified cross-arm contrasts now align comparison identity, formula, current answer, and missing evidence on one shared axis rather than six detached cards. A stale browser-test description that still called the research rows “question cards” was corrected without weakening its geometry assertions. Acceptance on the exact candidate: targeted reader/copy/contract regression **30/30 PASS**; CSS architecture audit PASS with non-canonical radius debt reduced by six; deterministic deploy gate PASS; **263-page** production build plus heading/brand audits PASS; document overflow preflight PASS; full Chromium + WebKit UI matrix **392/392 PASS**; eight exact-candidate Results/four-arm renders at phone/desktop in light/dark all hit their route sentinels with zero root overflow. This completes only the Results/comparison row. Phase E still has no per-row weights, so the credited total remains **55 / 100** until all remaining Phase-E families are complete.

Mechanism / SD-LoRA / history migration witness — **2026-09-18**: audited the SD-LoRA mechanism/history family against its Reader Contracts and overlapping PR ownership before changing presentation. Concurrent #734 continues to own the Stable Reduction / acceleration-context scientific explanation and #743 its Bounded-diagnosis follow-up; those scientific owners were not rewritten here. The family already uses content-shaped forms where the relationship requires them: Stable Reduction and Bounded use real computation/state flows and tables, Scaling uses a measured chart + profiler decomposition + mechanism figure, Gated-Delta uses recurrent-state nodes and a derivation sequence, and the history overview uses a real two-line comparison table plus seven connected research questions. Those semantic nodes were deliberately retained rather than cosmetically “de-cardified”. The remaining ordinary card-like surface was the shared eight-link history chapter rail; it now behaves as a quiet editorial chapter index with a current-page underline while preserving every direct link, sequence number, previous/next control, touch target and `aria-current` state. No speedup, score, rank, round range, treatment identity, sealed-state claim or scientific boundary changed. Focused route-family regression: **56/56 PASS**; Chromium Reader Contract / SD-LoRA / Gated-Delta acceptance: **29/29 PASS** across phone/tablet/desktop, light/dark, no-JS/reduced-motion/overflow-sensitive paths; CSS architecture audit PASS; **263-page** production build plus heading/brand audits PASS. This completes only the Mechanism/SD-LoRA/history row. Phase E still has no per-row weights, so the credited total remains **55 / 100** until the remaining three Phase-E families are complete.

Operational / run / server migration witness — **2026-09-18**: re-audited the already-migrated Server pilot together with the public `/study/run/` reproduction route under the operational Reader Contract. Server keeps the dated operational state, safety boundary, and one default maintenance action; no live machine fact or project authorization was invented or promoted from capability. The reproduction guide still begins with account role and authority, keeps real SSH identities/hosts/ports/private paths out of the public page, and preserves all twelve commands and evidence boundaries. Its remaining content-shape defect was structural: the twelve strictly ordered gates were displayed as two columns of independent rounded cards with an artificial vertical spacer before Gate 01. They now read as one continuous numbered runbook: number → purpose/authority explanation → executable check, with the code beside the explanation on desktop and stacked inside the same step on phone. Deterministic browser validation caught a phone overflow caused by the runtime copy-code wrapper retaining intrinsic command width; the narrow fix made that injected shell shrink within the grid while leaving the command itself horizontally scrollable. The overflow/Reader Contract assertions were not weakened. Focused operational/copy regressions: **41/41 PASS**; Chromium run/server/Reader Contract acceptance after the fix: **11/11 PASS** across desktop/phone and light/dark server states; CSS architecture audit PASS with one additional non-canonical rounded container retired; **263-page** production build plus heading/brand audits PASS. This completes only the Operational/run/server row. Phase E still has no per-row weights, so the credited total remains **55 / 100** until the remaining two Phase-E families are complete.


Model / paper / reference migration witness — **2026-09-18**: refreshed current BaseModel `main`, PR #737 exact head/base/mergeability, open route owners and the current design/copy/Reader Contract/release/model-catalog policies before editing. No model or paper data, latest/current pointer, license, access fact, research suitability claim, paper result, reproduction status or scientific boundary was refreshed or invented. The Models directory no longer uses viewport-height whitespace to delay the catalog; its first layer now names the five existing decision lenses — identity, access, adaptation, catalog resource tier, and evidence — while explicitly keeping resource tiers distinct from measured hardware guarantees. Model detail likewise brings existing access, LoRA/RL suitability, catalog resource tier and evidence state onto one shared definition axis, and its Reader Contract now binds first-screen acceptance to those decision facts rather than the tall identity wrapper. The Papers directory replaces its full-screen spacer with an ordered research-question → method → model-role → benchmark → reproducibility reading path; the visible boundary keeps paper-reported evidence, local reproduction and semantic unknowns distinct before the dense filters begin. Paper detail drops only the redundant `方法 / Method` kicker above `方法摘要 / Method summary`. During validation, the phone Reader Contract correctly caught a partially visible filter; the repair added the already-required evidence boundary rather than widening the interaction budget or restoring empty space. The full deterministic deploy gate initially exposed one stale pre-existing reproduction-guide CSS-order assertion from the prior operational migration; the test was narrowed to the actual shrinkability/content-height invariants without changing product behavior, then the full gate passed. Acceptance on the final candidate: focused normalization/Reader regressions **22/22 PASS**; the stale-assertion regression **10/10 PASS**; strict copy invariants **0 failures**; Reader Contract audit **66/66 page patterns PASS**; CSS architecture and document-overflow preflight PASS; **263-page** production build plus heading/brand audits PASS; focused model/paper/Reader Chromium acceptance **16/16 PASS**; full Chromium UI gate **197/197 PASS**; deterministic deploy gate PASS. Internal phone before/after renders for Models and Papers confirm the rejected full-screen-whitespace mechanism is gone without introducing a card wall or an external reviewer dependency. This completes only the Model/paper/reference row. Phase E still has no per-row weights, so the credited total remains **55 / 100** until the final long-tail compatibility/history row is complete.

Long-tail compatibility / history migration witness — **2026-09-18**: audited the remaining compatibility and historical routes against the current Reader Contract, sitemap/discovery ownership, current Results owner, successor experiment-design owner, and concurrent scientific PR boundaries. The three old Results primer URLs (`webshop-training`, `seed-training`, `openevo-training`) remain addressable but no longer advertise themselves as independent sitemap content: with JavaScript they immediately hand readers to the single canonical Flow owner, while the no-JS fallback says the address moved and keeps a direct canonical link. The old H1.41/H1.42 `current-conclusion` note now names its real historical cutoff instead of presenting itself as the site's current conclusion; the old benchmark-design notes likewise identify themselves as historical design records and point to the current OpenEvo 2.0 design owner. True archive/lineage pages were deliberately preserved rather than cosmetically revived or rewritten, including their historical-state labels, exact evidence links, invalid-measurement distinctions, and scientific caveats. Browser validation exposed one stale theme test that still expected the retired pseudo-page DOM; the test was migrated to the canonical redirect destination without weakening theme, overflow, viewport, or theme-toggle assertions. A first rerun also found an occupied local browser port; validation moved to a fresh isolated port instead of killing or reusing another task's server. Final acceptance: focused reader/sitemap/science regressions **69/69 PASS**; UI-gate wiring regressions **39/39 PASS**; strict copy invariants **0 failures**; Reader Contract audit **66/66 public page patterns PASS**; CSS architecture PASS with non-canonical radius debt reduced from 352 to 350; document overflow preflight PASS; **263-page** production build plus heading/brand audits PASS; explicit no-JavaScript compatibility fallback **4/4 PASS**; canonical redirect/theme regression **18/18 PASS**; deterministic deploy gate PASS; full Chromium UI gate **197/197 PASS**. No model/result value, treatment identity, lifecycle state, evidence link, release authority or current scientific claim was changed. This completes the last Phase-E row, so Phase E earns its full **25 / 25 weighted points** and the current credited total becomes **80 / 100**.

### Phase F — Sitewide plain-language + content-shape sweep — **10%**

- [x] Find remaining meta-talk / AI-flavored headings and rewrite against canonical cases.
- [x] Find cardified prose that can become ordinary editorial structure.
- [x] Find comparisons that still require memory-based cross-reading and give them a shared axis.
- [ ] Find sequences whose topology is invisible and expose the path.
- [ ] Find detached provenance/controls and restore semantic adjacency.
- [ ] Verify terminology consistency across nav, headings, diagrams, captions and evidence.

Phase-F plain-language heading sweep witness — **2026-09-18**: scanned the **263 rendered public pages** after a production build rather than treating every unused source string as a live UI defect. The remaining high-confidence stage-direction / presenter headings on actual routes were rewritten to name the subject directly: the paper learning guide now labels reproduction boundaries instead of “common misunderstandings”; the SEED/OpenEvo research hub names models/tasks/comparison scope, the WebShop two-stage learning object, and experiment/result comparison directly; the technical-note heading names the scientific meaning of the 64-component limit; and the SEED paper learning step names the long-horizon sparse-reward problem instead of telling the reader to “read the problem before the equations.” One rendered Q17 heading containing `先变好` was deliberately retained because it expresses a real temporal scientific result — which capability improved first — rather than author stage direction. No result value, treatment identity, lifecycle state, evidence boundary or scientific caveat changed. The deterministic gate found one stale copy assertion that still required the retired `下面用 WebShop...` sentence; it was updated to assert the same two-stage scientific fact plus the existing MiniMax / ALFWorld boundaries, without weakening the contract. Final pre-provider acceptance on the product tree: strict copy invariants **0 failures**; deterministic repository gate PASS; **263-page** production build plus heading/brand audits PASS; document overflow preflight PASS; full Chromium + WebKit UI matrix **394/394 PASS**. This completes only the first Phase-F row. Phase F has no per-row weights, so the credited total remains **80 / 100** until all six Phase-F rows are complete.

Phase-F cardified-prose sweep witness — **2026-09-18**: scanned the **263 rendered public pages** for visible bordered/rounded non-interactive blocks, then classified each candidate against the current card budget instead of deleting every class named `card`. Choice objects, operational controls, isolated scientific/status summaries, evidence boundaries, charts, process nodes, slide composition and pending-state placeholders were deliberately retained. Three high-confidence ordinary-explanation walls were retired: the Guide’s Agent runtime → training → RL vocabulary → SEED explanation is now one numbered editorial learning sequence; Q17’s four historical follow-up ideas are now one ordered historical-plan list while its metric summaries, not-run placeholders and safety boundary remain isolated; and Ceiling-1.0’s four ways of carrying Stage-1 experience into later learning are now one aligned numbered list while numeric budgets, round/status summaries, scientific comparisons and carrier-state blocks remain unchanged. All user-facing scientific text, result values, treatment identities, lifecycle states, evidence links and caveats were preserved. Internal preference screening compared the existing card wall, a borderless two-column variant and the selected continuous sequence; the continuous sequence reduced left/right attention switching without imitating Apple surface styling. Acceptance on the final product tree: focused normalization/scientific regressions **45/45 PASS**; strict copy invariants **0 failures**; Reader Contract audit **66/66 public page patterns PASS**; CSS architecture PASS; **263-page** production build plus heading/brand audits PASS; focused phone/desktop light/dark renders across the three changed surfaces **12/12 PASS** with zero root overflow; deterministic deploy gate PASS; full Chromium + WebKit UI matrix **394/394 PASS**. No external AI reviewer was introduced. This completes only the second Phase-F row. Phase F has no per-row weights, so the credited total remains **80 / 100** until all six Phase-F rows are complete.

Phase-F shared-axis comparison sweep witness — **2026-09-18**: scanned the current rendered/public comparison owners after the heading and cardified-prose sweeps, then changed only high-confidence cases where the reader had to remember one detached block while reading another. Four comparison families now use a real shared axis: the historical WebShop benchmark note aligns training-candidate versus official-held-out task pools and sparse versus dense feedback by the same dimensions; historical GDR-v1 versus DirectApply aligns the four update stages row-by-row; Ceiling-1.0 aligns the first and revised Stage-2 update rules by decision window, gate, state decision and next-state behavior; and the Harness 2.0 matched outcome summary is a real 2×2 paired matrix instead of four detached result cards. Existing result matrices, Stage-1 comparisons and already-aligned scientific tables were retained; unrendered legacy primer source was not cosmetically revived. Every result value, task identity, treatment identity, historical/current boundary and causal caveat is unchanged. Internal preference screening compared the existing detached layout with the selected shared-axis layout; the latter reduced memory-based cross-reading without importing an Apple surface style. The first complete browser run caught a real regression introduced by the migration: some new table prose fell below the repository's minimum readable size on phone. The product text was raised to the existing 1rem reading size and the gate was kept unchanged; focused capability/browser acceptance then passed **73/73**, and the final full Chromium + WebKit matrix passed **394/394**. Focused structural/scientific regressions passed **61/61** before the final shared-axis regression was added, the dedicated normalization regression passed **17/17**, deterministic deploy verification PASS, strict copy invariants remained at **0 failures**, Reader Contract audit remained **66/66 public page patterns PASS**, CSS architecture PASS, and the **263-page** production build plus heading/brand audits PASS. No external AI reviewer was introduced. This completes only the third Phase-F row. Phase F has no per-row weights, so the credited total remains **80 / 100** until all six Phase-F rows are complete.

### Phase G — Cross-device / theme / accessibility / performance acceptance — **5%**

- [ ] Desktop 1280×633 first-viewport contract.
- [ ] Phone 390×844 first-viewport contract.
- [ ] Representative tablet/narrow-laptop composition.
- [ ] Light + dark theme contrast and semantics.
- [ ] Keyboard navigation, focus visibility, landmarks, labels and touch targets.
- [ ] No page-level horizontal overflow.
- [ ] Reduced-motion fallback for any flow animation.
- [ ] No unnecessary client-side JS/hydration growth for static presentation.

### Phase H — Release, production readback and closeout — **10%**

- [ ] `npm run check` / deterministic repository gates pass.
- [ ] reader-contract / human-feedback / route-owner audits pass.
- [ ] risk-appropriate Playwright/GHA browser evidence passes.
- [ ] final current-base exact-head Vercel acceptance passes under existing release authority.
- [ ] merge only after current-base refresh and overlap reconciliation.
- [ ] Production readback verifies representative migrated routes on desktop + phone.
- [ ] update canonical rules only for genuinely reusable lessons; archive task checklist when complete.
- [ ] execute conversation/project closeout protocol and record repeated mistakes, if any.

Total = **100%**.

---

## 12. Acceptance standards

### 12.1 First-view comprehension

For every materially migrated route, a zero-context reader should be able to answer within roughly 5–10 seconds:

- what the page is about;
- the most important fact/choice/state;
- what to do/read next.

Automated first-viewport budgets are regression guards. Acceptance combines the rendered phone/desktop surface with Reader Contract/browser evidence; an external independent reviewer is not implied unless the owner/task explicitly activates one.

### 12.2 One primary center

The first viewport must not contain several equal-weight cards/headings/CTAs competing for attention unless the page’s reader task is explicitly a peer choice/comparison.

### 12.3 Card budget

Every bordered/rounded card must justify itself as one of:

- a choice;
- an operation;
- an isolated summary that must remain visually distinct.

Ordinary explanation defaults to editorial flow, lists, tables, figures, timelines or whitespace.

### 12.4 Content-shape correctness

- Comparison → shared axis.
- Sequence → visible connection/order.
- Hierarchy → nested visual structure.
- Evidence → claim-linked source structure.
- Choice → peer choices with clear differentiation.
- Status → current state + timestamp/authority where needed.

A component that looks polished but expresses the wrong relationship fails acceptance.

### 12.5 Copy

- No unexplained internal shorthand in the first comprehension layer.
- No stage-direction copy when the fact can be stated directly.
- No duplicate H1/lede meaning.
- Claim-changing caveats remain visible.
- Action labels describe the action/destination.
- Terminology is consistent at first use and across sibling pages.

### 12.6 Responsive behavior

- No page-level horizontal scrolling.
- Meaningful desktop side-by-side comparisons become meaningful narrow-screen forms.
- Important state/evidence does not disappear on mobile.
- Persistent UI layers stay within the existing mobile budget.
- Horizontal peer rails show discoverable continuation and remain keyboard/touch accessible.

### 12.7 Accessibility

- Semantic landmarks/headings remain logical.
- Controls have accessible names and correct element semantics.
- Focus is visible and order follows the reading path.
- Color is never the sole state indicator.
- Motion is optional and respects `prefers-reduced-motion`.

### 12.8 Performance / Astro discipline

- Static content does not gain a client island merely for presentation.
- New visual patterns do not require a large client library when native HTML/CSS is sufficient.
- Route-family CSS changes reduce or hold cascade complexity; they do not add another generic patch layer.
- Build output and browser interaction remain stable enough for the existing CI/deployment budget.

### 12.9 Scientific / provenance integrity

- UI simplification must never hide a caveat that changes the scientific interpretation.
- Current scientific state is refreshed from its canonical upstream owner before publication claims are changed.
- Historical results remain labeled historical.
- W&B, run IDs, manifests and SHAs stay provenance/evidence, not decorative credibility badges.

### 12.10 Release evidence

Completion means:

```text
current-base reconciled
→ repository checks PASS
→ reader/copy audits PASS
→ browser acceptance PASS
→ exact-head Vercel final gate PASS
→ merge
→ Production readback PASS
```

A local build or attractive screenshot alone is not completion.

---

## 13. Hourly scheduled continuation contract

Each scheduled run should:

1. refresh current `main`, this plan PR/head, relevant open PRs, and route-owner conflicts;
2. find the first safe incomplete checkbox in the highest-value current phase;
3. perform real work, not only inspect status;
4. use RDC/local isolated worktree for multi-file UI/browser loops when it materially speeds validation; use GitHub connector for small docs/provider/PR state;
5. avoid triggering expensive hosted acceptance after every visual tweak; use the repository’s lightweight review path until a candidate is genuinely ready;
6. update this checklist/evidence when a milestone is genuinely completed;
7. report in concise ELI5 Chinese:
   - what changed this hour;
   - completed percentage from the weighted checklist;
   - remaining percentage;
   - estimated completion time in Singapore time when estimable;
   - any blocker that truly requires owner/scientific judgment.

If a scheduled run reaches a real human boundary, it should ask one precise question and continue any independent safe work instead of stopping the whole program.

---

## 14. Stop conditions / anti-drift

Pause and re-evaluate if the work starts to become any of these:

- “Apple-like” surface styling without a reader-task improvement;
- a universal hero/card template imposed on all routes;
- a giant CSS rewrite detached from real route problems;
- removal of evidence or caveats merely to make a page feel cleaner;
- new JS/carousel/motion for static content that HTML/CSS already communicates;
- sitewide copy replacement by regex without a rendered first-read comprehension check;
- a route rewrite that collides with an active scientific/content PR and would erase its meaning;
- weakening reader-contract, browser, accessibility or release gates just to make the redesign pass.

---

## 15. First execution step

After this plan is accepted as the long-running checklist authority:

1. complete Phase A audit against live `main` and open PRs;
2. select exact pilot route owners and exact-head dependencies;
3. start the four pilots in small conflict-aware implementation PRs;
4. show the owner a visual review Preview after the first coherent pilot pair, before propagating the pattern sitewide.
