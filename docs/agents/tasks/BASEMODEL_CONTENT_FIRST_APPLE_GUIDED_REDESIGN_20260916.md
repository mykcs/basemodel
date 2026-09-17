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

For every migrated route, perform a cold-read pass against `website-copy-cases.md` and the human-preference system before completion.

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
- [ ] pass phone + desktop cold-read;
- [x] pass targeted browser/reader-contract checks;
- [x] obtain an inspectable review Preview when the owner needs visual feedback.

Pilot exit rule: do not start broad migration until the four pilots show a coherent system **without forcing them into the same page template**.

The five implementation rows above are evidenced across **all four** pilots. A review-only, noindex Preview for the four-pilot exact product head was also generated and target-checked on all four pilot routes, so the conditional review-Preview row is now complete. These are implementation/review prerequisites only. Phase C remains **0 / 20 weighted points** until the independent phone + desktop cold-read exit is satisfied. This preserves the existing 35 / 100 weighted total and prevents automated checks or Preview inspection from being relabeled as human comprehension.

The independent exit now has a fail-closed task-scoped verifier rather than relying on a prose claim. An actual external reviewer must complete the existing blind-first `feedback:cold-read` / `feedback:judge` protocol separately on **desktop and phone for each of the four pilots**, saving eight valid receipts under the exact filenames `flow-{desktop,phone}.json`, `sd-lora-{desktop,phone}.json`, `server-{desktop,phone}.json`, and `q17-{desktop,phone}.json`. Each receipt also records `reviewViewport`; this program binds desktop to `1280×633` and phone to `390×844`. Then run:

```bash
npm run redesign:cold-read:gate -- --product-head=<exact-rendered-product-git-sha> --dir=<receipt-dir>
```

The gate requires all eight receipts to PASS the existing preference/scientific-boundary validator, match the exact pilot Reader Contract and route, use the declared viewport, and bind the same rendered product head. Reviewer identity follows the canonical HPL contract: a genuine human or genuinely independent Agent may be recorded, while self-authored notes cannot be relabeled as independent. Missing, duplicated, stale-head, wrong-route, wrong-contract, wrong-viewport or FAIL evidence fails closed. The command makes the Phase-C exit auditable; it does **not** manufacture the independent evidence, so the checkbox above remains open until the command actually returns PASS on real receipts.

Phase-C rework witness — 2026-09-17: repeated independent cold reads still found first-screen comprehension friction. Trigger → Flow/Q17/Server feedback on exact head `61352682dec02352c5e60f701941fd37edf25907`; current owner → this Phase-C pilot exit; checked artifact → fresh exact-head blind packet plus canonical Reader Contracts; allowed next action → simplify the visible first task, explain unavoidable terms in place, surface one truthful next action, and re-run exact-head phone/desktop review; invalidation cue → any new runtime/copy change or head movement invalidates prior receipts. **No weighted credit changes until the 8/8 gate passes.**

Phase-C rework witness — 2026-09-17 current head: Trigger → independent cold read on `36d43c71724ad5683bc2f989ee71756a50521555` leaves Flow phone, Q17 phone and Server desktop failing while the other five viewports pass; current owner → this Phase-C pilot exit; checked artifact → `/private/tmp/bm737-auto7-36d43-phase-b/*/receipt.json` plus current Reader Contracts; allowed next action → add the missing two-stage OpenEvo method context without crowding Flow's first screen, make Q17 name the WebShop objects and show `10 → 8` while moving secondary diagnostics down, and keep Server's deletion/visibility/draft boundaries directly visible while reducing competing first-screen blocks; invalidation cue → any user-visible change or head movement invalidates all eight receipts and requires a fresh blind-first run. **No weighted credit changes until the replacement 8/8 gate passes.**

### Phase D — Canonical component/CSS consolidation — **15%**

- [x] Promote only proven pilot patterns into shared components/styles.
- [x] Remove touched obsolete compatibility rules when ownership is clear.
- [x] Reduce conflicting selector layers for the migrated surface.
- [x] Keep static content static; remove unnecessary hydration discovered during migration.
- [x] Ensure global navigation stays visually quieter than page content and active-state semantics stay correct.

Phase D is complete: **15 / 15 weighted points**. The consolidation is limited to patterns already proven by the four pilots; it does not authorize Phase E broad migration while the Phase C independent cold-read exit remains open. Current credited total: **35 / 100**.

### Phase E — Route-family migration — **25%**

Migrate in bounded groups to reduce concurrent-PR conflict:

- [ ] Flow/concept routes.
- [ ] Study gateway and experiment-design routes.
- [ ] Results/comparison routes.
- [ ] Mechanism/SD-LoRA/history routes.
- [ ] Operational/run/server routes.
- [ ] Model/paper/reference routes relevant to the active research journey.
- [ ] Long-tail compatibility/history routes: preserve redirects/history semantics; do not cosmetically revive deprecated owners.

Each group must preserve current scientific authority and refresh against live upstream evidence before changing “current/running/completed/next” claims.

### Phase F — Sitewide plain-language + content-shape sweep — **10%**

- [ ] Find remaining meta-talk / AI-flavored headings and rewrite against canonical cases.
- [ ] Find cardified prose that can become ordinary editorial structure.
- [ ] Find comparisons that still require memory-based cross-reading and give them a shared axis.
- [ ] Find sequences whose topology is invisible and expose the path.
- [ ] Find detached provenance/controls and restore semantic adjacency.
- [ ] Verify terminology consistency across nav, headings, diagrams, captions and evidence.

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

Automated first-viewport budgets are necessary regression guards, not a substitute for this cold-read check.

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
- sitewide copy replacement by regex without semantic cold-read;
- a route rewrite that collides with an active scientific/content PR and would erase its meaning;
- weakening reader-contract, browser, accessibility or release gates just to make the redesign pass.

---

## 15. First execution step

After this plan is accepted as the long-running checklist authority:

1. complete Phase A audit against live `main` and open PRs;
2. select exact pilot route owners and exact-head dependencies;
3. start the four pilots in small conflict-aware implementation PRs;
4. show the owner a visual review Preview after the first coherent pilot pair, before propagating the pattern sitewide.
