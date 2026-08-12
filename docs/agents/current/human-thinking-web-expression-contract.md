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

Use animation only when it reinforces an already understandable static sequence, dependency, or state change. Animation must never carry the only copy of meaning.

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
7. Are the primary next action and acceptance boundary visible?
8. Does the page remain understandable with animation disabled and JavaScript unavailable where progressive enhancement is expected?
9. Have light/dark themes, representative viewports, languages, and expanded states passed the browser UI gate?
10. Is the exact-head Preview evidence available before owner review?

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

## 10. Ownership and relationship to other contracts

This file owns the durable **expression and information-architecture invariant**.

Related owners:

- `sitewide-visual-knowledge-architecture.md` — current whole-site route and page-density design;
- `reproduction-guide-design-principles.md` — execution-first reproduction-page specialization;
- `actionable-content-ux.md` — local copy/open/download/share actions;
- `theme-contrast-contract.md` — semantic light/dark color pairs;
- `ui-change-visual-acceptance-gate.md` — browser-level visual, responsive, and state verification;
- `product-and-research-integrity.md` — evidence and recommendation truthfulness.

When a future user-facing failure reveals a new recurring design class, update this contract or the owning specialized contract and add executable protection where feasible. Do not rely on conversational memory alone.
