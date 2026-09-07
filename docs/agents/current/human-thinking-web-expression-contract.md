# Human-thinking web expression contract

Status: **current and mandatory for every user-facing website change**
Audience: product Agents, writing Agents, frontend Agents, design Agents, review Agents

## Why this document exists

The owner’s durable preference is not a one-off visual style request. It is a product invariant:

> A web page should use HTML, layout, interaction, and visualization to externalize human thinking—not merely place more text on a screen. At the same time, it must preserve deliberate information density, structural clarity, and a fluent reading path.

This contract applies even when the request sounds small, such as “add one item to this page.” A small content request can still break the page’s mental model, density balance, reading order, or surrounding journey.

Model memory may remind an Agent of this preference, but model memory is not the project source of truth. The durable mechanism is:

```text
root AGENTS.md invariant
-> this design contract
-> user-facing expression brief
-> semantic HTML / visual implementation
-> UI browser acceptance gate
-> exact-head Preview review
```

The owner should not need to repeat these principles in every prompt.

---

## 1. Automatic trigger

Load and apply this contract whenever a task changes what a reader can see, understand, compare, decide, or do on the website, including:

- adding a page, section, card, row, explanation, tutorial, benchmark, result, or feature;
- changing copy, headings, ordering, navigation, labels, or page density;
- adding a process, hierarchy, comparison, timeline, decision path, evidence claim, troubleshooting branch, or system topology;
- changing a shared component whose visual or semantic role affects multiple routes;
- inserting content into an existing page, even when the request does not explicitly mention “UI” or “design.”

Do not wait for the owner to say “make this visual,” “use HTML,” “keep the page coherent,” or “consider information density.” Those are default requirements.

---

## 2. Form a Page Expression Brief before implementation

Before editing user-facing code, form a concise **Page Expression Brief**. For a small change this can be a short section in the PR body. For a broad change it may become a design note. It must answer:

1. **Reader** — Who is reading, and what can they already understand?
2. **Page role** — What role does this route or section play in the whole-site journey?
3. **Starting state** — What confusion, question, or task brings the reader here?
4. **Target mental model** — What structure should exist in the reader’s mind after this section?
5. **Next action** — What should the reader understand, compare, decide, verify, or execute next?
6. **Primary path** — What is the one main reading or action sequence?
7. **Secondary depth** — Which details, evidence, history, and diagnostics should stay available without interrupting the main path?
8. **Semantic shape** — Is the material fundamentally a sequence, hierarchy, comparison, topology, evidence ladder, branch, timeline, state transition, or executable instruction?
9. **Density plan** — What belongs in orientation, mainline, detail, and on-demand layers?
10. **Acceptance evidence** — How will an Agent prove that the structure is understandable, usable, responsive, and visually safe?

Do not begin by asking “which card component can hold this text?” Begin by asking “what thought structure must the page make visible?”

---

## 3. Map human thought structures to semantic HTML

Choose the web form from the meaning of the information, not from a preferred decorative component.

| Human thought structure | Preferred web expression |
| --- | --- |
| Ordered procedure or research path | `<ol>`, linked step navigation, progress route, explicit PASS evidence |
| Feedback loop or causal chain | `<figure>` with a static flow, arrows, labels, and an optional motion reinforcement |
| Hierarchy or layered system | nested lists, layer map, tree, grouped sections, clear parent-child relationships |
| Comparison or trade-off | real `<table>`, comparison matrix, aligned dimensions, explicit unknown cells |
| Claim, proof, and limitation | `<dl>`, evidence ladder, source links, “proves / does not prove” pairing |
| Decision or failure branch | decision tree, `<details>/<summary>`, conditional callouts, local troubleshooting |
| Timeline or evolution | ordered timeline with `<time>`, milestones, before/after evidence |
| System or deployment topology | `<figure>`, named nodes, boundaries, transfer channels, ownership labels |
| Executable instruction | `<pre><code>`, copy action, expected output, failure-first diagnostic |
| State or status | explicit status text, semantic badges, timestamps, provenance; never color alone |
| Unknown or uncertainty | visible unknown state and evidence boundary; never silently fill with a guess |

Use animation only when it measurably reduces cognitive load or makes an already understandable static sequence, dependency, or state change easier to follow. A moving dot, pulse, shimmer, auto-advancing highlight, or other ambient motion is not justified merely because the content is a flow. If removing the motion does not make the mechanism harder to understand, remove the motion. Animation must never carry the only copy of meaning.

A visualization is justified only when it improves at least one of these:

- sequence recognition;
- dependency understanding;
- hierarchy comprehension;
- comparison accuracy;
- evidence boundaries;
- decision speed;
- failure localization.

If it only makes the page look busier, do not add it.

---

## 4. Treat information density as a designed budget

Information density is neither “show as little as possible” nor “put everything on one screen.” It is the deliberate allocation of information to the moment when the reader needs it.

Use four layers:

```text
L0 orientation
  What is this page, where am I, and what is the route?

L1 primary path
  The minimum complete sequence needed to understand or act.

L2 supporting detail
  Evidence, dimensions, examples, parameters, and implementation depth.

L3 diagnostic / historical depth
  Troubleshooting, failed approaches, incident history, edge cases.
```

Default behavior:

- L0 stays low-density and gives a visual map;
- L1 remains continuous and can be followed without opening diagnostics;
- L2 is close to the claim or step it supports;
- L3 uses progressive disclosure such as `<details>` or a dedicated diagnostic section;
- repeated labels, duplicate summaries, and card proliferation do not count as useful density;
- empty space is used to expose grouping and sequence, not to make a sparse page look premium.

The main path must remain identifiable when the reader scans only headings, step labels, table headers, and primary actions.

---

## 5. Preserve whole-page and whole-site flow

A locally correct section can still damage the product if it interrupts the surrounding journey.

Before inserting content, inspect:

- what the reader learned immediately before it;
- what question the new section answers;
- what the next section assumes;
- whether the new content duplicates an existing route;
- whether it should be a summary, detail page, inline explanation, or troubleshooting branch;
- whether navigation and cross-links still communicate one coherent product.

Each major section should make these three states clear:

```text
where I am
-> why this matters now
-> what I do or read next
```

Do not solve a page request by appending an isolated block at the bottom unless the information architecture actually calls for an appendix.

---

## 6. Use progressive disclosure without hiding necessary meaning

Progressive disclosure is for depth, not for repairing a weak mainline.

Keep visible by default:

- the page purpose;
- the primary route;
- the central comparison or decision dimensions;
- the next action;
- evidence boundaries that change interpretation;
- the minimum success or acceptance criteria.

Good candidates for disclosure:

- historical incident detail;
- rare edge cases;
- long command output;
- alternate approaches;
- deep implementation notes;
- local troubleshooting after the normal path is clear.

A reader must not need to open every `<details>` element to reconstruct the core argument.

---

## 7. Keep visual form truthful and accessible

The visual hierarchy must match the conceptual hierarchy.

- Do not give a secondary fact the strongest visual weight merely because it is easy to style.
- Do not use color, motion, or position as the sole carrier of meaning.
- Preserve semantic reading order in the DOM.
- Use headings as a real outline, not as font-size controls.
- Treat same-page anchors and chapter jumps as navigation, not as permission to invent a new tab/button language. If the parent route already has shared navigation and section/disclosure primitives, reuse them; reserve tabs for genuine mutually exclusive view or application-state changes.
- Treat typography as semantic infrastructure. Navigation, body copy, and ordinary controls inherit the shared interface stack; mono is for code, paths, SHAs, parameter keys, revision IDs, and similar machine-oriented identifiers; editorial type is limited to the site-wide headline roles already defined by the visual system. Use shared `--font-*` tokens rather than one-off local font stacks.
- When human feedback identifies a pattern generated by a shared component, audit every consumer of that component before closing the issue. Fix the shared source when the pattern is universally wrong; do not patch only the route where the owner happened to notice it.
- A bilingual or all-caps eyebrow is still repetition when the following heading already names the same topic. Translation, uppercase styling, warm color, or monospace typography do not count as new information.
- **One rendered page owns one main heading.** The route or page-root component should own the single `<h1>`. A reusable component that can be embedded inside another page must not unconditionally render another `<h1>`; either use the appropriate lower heading rank or expose an explicit heading-level contract. Hiding a duplicate heading with CSS does not repair the semantic outline.
- **`hidden` means “do not present this content now,” not “show a faded preview.”** A future/locked route that remains visible must use an explicit preview/disabled state. Do not put `hidden` on it and then use CSS (especially `!important`) to force it back onto the screen. Visible-but-unavailable controls must also be removed from ordinary keyboard activation and expose the unavailable state semantically.
- Tables must remain tables when row/column alignment is essential.
- Long Chinese and English strings, paths, SHAs, model names, and URLs must wrap or scroll locally.
- All user-facing changes also trigger `ui-change-visual-acceptance-gate.md` for theme, viewport, overlap, clipping, and interaction verification.

The owner should evaluate the quality and usefulness of a design—not discover basic readability or layout failures.

---

## 8. Required completion questions

Before reporting a user-facing change complete, answer with evidence:

1. Can a first-time reader identify the page purpose and route within roughly 30 seconds?
2. Can the reader follow the main path without reading the incident history or diagnostics?
3. Does the chosen HTML form match the actual thought structure?
4. Is the information density intentionally layered rather than uniformly high or low?
5. Does every visualization encode real order, dependency, hierarchy, comparison, evidence, or state?
6. Does the section connect naturally to what comes before and after it?
7. Does the section reuse its parent route’s navigation, typography, shape, and disclosure language instead of creating a local mini design system?
8. Are the primary next action and acceptance boundary visible?
9. Does the page remain understandable with animation disabled and JavaScript unavailable where progressive enhancement is expected?
10. Have light/dark themes, representative viewports, languages, and expanded states passed the browser UI gate?
11. Is the exact-head Preview evidence available before owner review?

A build or deployment badge cannot answer these questions.

---

## 9. Anti-patterns

Do not:

- paste a paragraph into the nearest card without reconsidering page structure;
- create a new card for every concept until the page becomes a dashboard of equal-weight boxes;
- duplicate the same explanation at the page, section, and card levels;
- make the failure history as visually dominant as the successful path;
- replace a meaningful comparison table with visually attractive but misaligned cards;
- use animation as decoration or as the only explanation of direction;
- hide evidence limitations because they make the page less visually clean;
- treat “more information” as higher information density when it only adds repetition;
- treat “minimal” as removing the context needed to understand the next action;
- declare the work complete from source code or Vercel READY without browser and Preview evidence.

---

## 10. Research-results editorial contract

This subsection is **mandatory for experiment-result pages, research closeouts, benchmark narratives, scientific-study summaries, and any page that turns internal experiment evidence into an explanation for another researcher.** It is not limited to the current OpenEvo route.

### 10.1 Write for a reader who is new to agents and this project

The default reader may be a student or teacher with no agent background, project vocabulary, or run history. Explain the concrete environment task and model role first. Preserve technical rigor through local evidence depth rather than assumed familiarity.

Therefore:

- do not open with internal run IDs, campaign names, selector labels, artifact names, or unexplained acronyms;
- do not assume the reader knows what `H1.38B`, `H1.39-MR`, `G2`, `T2`, `SD-LoRA`, `parser-invalid`, or similar local vocabulary means;
- introduce a technical term only when the argument reaches the point where the term is useful, and define it in ordinary technical language at first use;
- prefer one concrete environment/trajectory/example before a dense abstraction when that example helps the reader form the correct mental model;
- keep run IDs, SHAs, campaign names, raw artifact locators, and full experiment lineage as provenance near the relevant claim or in an appendix, not as the article outline.

A reader should be able to understand the research question, the strongest conclusion, and the main uncertainty without knowing any internal experiment code name.

### 10.2 Organize the main text like a research argument, not an experiment dashboard

The primary narrative should normally follow this logic:

```text
research question / concrete problem
-> why the question is non-trivial
-> what the system or environment actually does
-> the important failed or ambiguous explanations
-> the experiment that changes the belief state
-> independent or stronger evidence
-> conclusion
-> reasoning from evidence to conclusion
-> limitations / what cannot be inferred
-> next scientific question
```

Chronology is useful only when it explains how the scientific belief changed. Do not mechanically write “Phase 1, Phase 2, Phase 3...” or one card per experiment.

For each major scientific claim, make four things recoverable from the visible main text:

1. **Claim** — what we currently believe.
2. **Evidence** — the observations, effect estimates, intervals, controls, or failure evidence supporting it.
3. **Inference** — why that evidence changes the explanation, including which simpler alternatives it weakens or rules out.
4. **Boundary** — what the evidence does not establish.

If one of these four is missing, the section is not yet a scientific explanation; it is only a result dump.

### 10.3 Preserve negative results as reasoning, not clutter

Failed experiments should stay in the story when they materially narrowed the hypothesis space.

Good negative-result writing answers:

- What explanation were we testing?
- What did we observe?
- What interpretation became less plausible?
- What remained unresolved?
- Why did that justify the next experiment?

Do not hide negative evidence to make the story look successful. Also do not give every failed run equal visual weight. Compress repeated engineering or null history into the minimum structure needed to explain the next scientific decision, with complete audit detail available underneath.

### 10.4 Keep science and engineering failure semantically separate

A scientific zero, an invalid measurement, an incomplete panel, and a runtime/parser failure are different states.

- Never convert invalid engineering attempts into model-performance evidence merely because `0` is convenient.
- Never describe an unrun panel as a failed experiment.
- Never describe a measurement-invalid screen as a clean null.
- Never promote an observed mechanism signal into a causal method claim without the required control.
- Never turn a single positive panel into universal superiority.

The prose should explain these distinctions where they affect interpretation, not only in hidden provenance.

### 10.5 Prefer restrained academic prose over generic AI presentation language

The target voice is a strong technical paper or high-quality research blog: problem-first, evidence-dense, explicit about reasoning, and concise where the argument is already clear.

Avoid generic AI-produced presentation habits such as:

- a wall of same-sized rounded cards;
- repeated “核心结论 / 关键洞察 / 值得注意的是 / 总的来说” labels that add no information;
- inflated claims such as “重大突破”, “全面验证”, or “显著领先” unless the evidence and statistical contract literally justify them;
- ornamental section titles that hide the actual research question;
- excessive emoji, badges, gradients, decorative arrows, or status colors used to manufacture importance;
- summary sentences that simply restate the heading;
- uniform bullet lists where connected prose is needed to express causality or inference;
- first-screen jargon density that forces the reader to decode the project before understanding the question.

Prefer specific nouns, concrete verbs, actual quantities, and explicit causal or epistemic relationships. Vary sentence length naturally. Use tables and figures for aligned evidence, not as decoration.

### 10.6 The web should improve a paper-like argument, not replace it with spectacle

Use HTML advantages to make the research easier to inspect:

- a real comparison table for aligned arms and intervals;
- a simple confidence-interval figure when it clarifies effect direction and uncertainty;
- a trajectory excerpt when it makes the environment concrete;
- progressive disclosure for full run lineage and raw evidence;
- source links beside the claim they support;
- print/no-JS behavior that still yields a coherent article.

The static reading order must remain sufficient. Interaction may reveal depth, but it must not be required to reconstruct the scientific argument.

### 10.7 Acceptance test for research-result writing

Before merging a result-page rewrite, explicitly verify:

- the first screen contains the research question and current conclusion before internal run IDs dominate;
- a student or teacher with no agent or project background can explain the task, tested change, start/stop conditions, and supported outcome;
- the main text contains evidence and reasoning, not only conclusions and numbers;
- internal experiment IDs function as provenance rather than navigation;
- negative results are connected to the next hypothesis rather than listed as a changelog;
- claim boundaries are visible near the claims they constrain;
- planned, unrun, invalid, incomplete, and completed experiments are linguistically distinct;
- the full audit trail remains accessible without overwhelming the primary narrative;
- the page remains useful as plain HTML / print and does not rely on visual effects to carry meaning.

When browser tests can cheaply protect these invariants, add them. For example, assert that reader-oriented question/background copy appears before the first method-specific or run-ID-heavy section.

---

### 10.8 Executable reader contracts and honest scope

For experiment narratives, maintain a typed start/action/stop/output contract that the visible HTML consumes. Distinguish execution authorization, observed running, completion, and sealed results with their own receipts. Static metadata labels cannot grant authority or create outcomes.

For the capability-exploration family, the executable owners are `src/data/openEvoMechanismNarrative.ts`, `ExperimentLifecycle.astro`, `ResearchTaskContext.astro`, and the closed inventory `src/data/capabilityReaderRoutes.ts`. The inventory declares fully rebuilt versus context-only coverage; do not describe a contextualized historical page as a fully rewritten narrative. New family routes must enter this inventory.

Acceptance requires both missing-field/state negative tests and the rendered reader journey in `tests/e2e/openevo-two-map.spec.ts` (registered cases in `reader-journey.cases.ts`). Main answers must remain visible with JavaScript disabled, and the optional step illustration must be keyboard-operable with reduced motion. Existing words anywhere in source or collapsed content are not sufficient.

Record a cold-read walkthrough: task, purpose, start, stop, current evidence, and next dependency, each with an answer location. This walkthrough and browser checks establish inspectable prerequisites; they do not establish a measured human comprehension rate. A real reader misunderstanding must update the owning data/component and a discriminating regression, rather than add another overlapping prose standard.

### 10.9 Three acceptance layers; do not use one as a proxy for another

Readability work has three different evidence layers:

1. **Structural/visual safety** — heading order, visibility, contrast, overflow, responsive geometry, no-JS, keyboard, reduced-motion. This proves the page is renderable and operable.
2. **Reader-journey semantics** — the visible path actually answers the task, purpose, starting state, start/stop conditions, output, evidence state, and next dependency. Protect this with typed content contracts, route discovery/inventory, negative-state tests, and rendered browser assertions.
3. **Human comprehension** — a real target reader can accurately explain the causal path and boundaries without hidden oral context. Agent cold-read checks are preparation evidence, not a measured human pass rate.

`toBeVisible`, a green contrast/overflow audit, or “the words exist somewhere in the DOM” does **not** prove layer 2 or 3. Conversely, a human liking one screenshot does not replace deterministic geometry/accessibility checks. Report which layer each piece of evidence actually supports.

When the owner says that the site has been “fixed many times”, that standards/examples already exist, or the same misunderstanding keeps returning, treat that as evidence that prose guidance alone failed. Before writing another style rule:

- locate the shared semantic owner and every sibling route that encodes the same concept;
- move required start/action/stop/output/evidence state into typed data/schema consumed by the rendered component when practical;
- add failure-producing negative cases for missing/invalid states, not only positive snapshots;
- ensure the regression is registered in the normal owning Gate, not stranded in a one-off test file;
- keep an honest scope inventory (`rebuilt`, `contextualized`, `untouched` or equivalent) so one repaired page cannot be reported as whole-family completion.

The durable fix for repeated comprehension drift is therefore **owner + executable contract + route coverage + rendered acceptance**, with prose standards explaining why rather than carrying the enforcement alone.

---

### 10.10 Five questions are a reader aid, not a new authority

`ResearchOrientation` supplies question / why / start / finish / state; `ResearchJourney`, `ResearchDepth`, `ResearchGlossary`, and `ResearchStateRail` organize the reading depth. They consume existing task/lifecycle/evidence owners; they must not maintain a second scientific-state table.

Before accepting an orientation:

1. Read each answer without its label. Does it explain this task, or merely say “follow the main line / wait for the gate”? Define the shopping task and plain-language role before method codes. Having five nonempty fields is necessary but insufficient.
2. Preserve dependency topology: a chronological research history can be ordered; parallel causal questions, a conditional branch, and an independent reference must not become a false A→B→C→D sequence just to fit a 3–6-step component.
3. Put the current evidence and start/stop meaning on the default reading path. Native disclosures may hold operations and detailed history, but their summaries must say what can be opened; keyboard/no-JS access and relevant anchors must still work.
4. Do not meet a first-screen target by shrinking primary text, tightening it into illegibility, clipping, or hiding a required answer. Shorten redundant copy or change its layout. Transfer the minimum-size/contrast assertions when a semantic answer moves to a new component or changes data attributes; checking only the old selector leaves new state/journey prose unguarded. The historical 1280×633 test is a **desktop** contract, not proof that all five answers fit on a 390×844 phone. A mobile scrolling layout may be correct; report its actual scope.
5. Browser geometry cannot tell whether a teacher understood the explanation. Keep the three acceptance layers in §10.9 separate and record concrete remaining misunderstandings rather than a fabricated comprehension percentage.

Retain scientific truth before adding the new presentation layer when merging parallel implementations. Test normal state and impossible-state counterexamples; keep the checks registered in the owning suite. Never remove the older lifecycle/authority checks merely because the new orientation checks pass.

## 11. Ownership and relationship to other contracts

This file owns the durable **expression and information-architecture invariant**, including the reader-first editorial standard for research results.

Related owners:

- `sitewide-visual-knowledge-architecture.md` — current whole-site route and page-density design;
- `research-site-presentation-contract.md` — research-publication purpose, reader-facing depth, and the code/operations progressive-disclosure rule;
- `reproduction-guide-design-principles.md` — execution-first reproduction-page specialization;
- `actionable-content-ux.md` — local copy/open/download/share actions;
- `theme-contrast-contract.md` — semantic light/dark color pairs;
- `ui-change-visual-acceptance-gate.md` — browser-level visual, responsive, and state verification;
- `product-and-research-integrity.md` — evidence and recommendation truthfulness.

When a future user-facing failure reveals a new recurring design class, update this contract or the owning specialized contract and add executable protection where feasible. Do not rely on conversational memory alone.
