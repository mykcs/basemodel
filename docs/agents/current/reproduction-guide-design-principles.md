# Reproduction guide design principles

Status: current design contract for reproduction pages
Audience: product/design agents, content agents, implementation agents

## Why this document exists

A reproduction page is not a project retrospective, architecture pitch, or research dashboard. Its first job is to help a reader complete a reproducible experiment with the least unnecessary cognitive load.

This rule was learned after the OpenEvo × WebShop work accumulated many useful but competing forms of information: current execution steps, historical failures, architecture decisions, evidence semantics, and future research plans. Putting all of them at equal visual weight made the page informative but less executable.

The owner supplied the GDKVM reproduction page as the reference pattern. The durable lesson is stronger than “copy its typography”: **start from a proven reproduction-manual schema, then fill project-specific content into that schema. Do not invent a project-specific information architecture first and later try to make it look like a reproduction guide.**

## 1. Template-first, not content-first

For a reproduction page, the default schema is:

`Scope → Environment → Code → Assets/Data → Runtime/Dependencies → Run → Verify → Next experiment → Troubleshooting`

Project-specific material is inserted into those slots.

Do not begin with “what interesting things do we know about this project?” Begin with “what must a new reader do, in order, to reproduce the experiment?”

## 2. The default reader is an executor

Assume the reader opened the page because they want to run the experiment now.

The main path should therefore answer, in order:

1. What machine / account / network context do I need?
2. What exact code and revision do I use?
3. What assets and data do I need?
4. What runtime must exist?
5. What command do I run?
6. What output proves each stage worked?
7. What exact evidence counts as success?
8. If a step fails, where do I look next?

Research background is secondary. Historical debugging knowledge is secondary. Both remain valuable, but neither should block the execution path.

## 3. One dominant line, one subordinate diagnostic line

The page may contain two narratives, but they are not equal-weight columns.

- **Dominant line:** the shortest currently calibrated success path.
- **Subordinate line:** known failures, wrong assumptions, and fixes attached to the step where they matter.

The reader should be able to ignore all historical failures and still execute the experiment.

Failure knowledge belongs in local Troubleshooting, native disclosure blocks, and a compact final index. The complete retrospective belongs in Agent/project documentation, not in the primary reading flow.

## 4. Use HTML as an information architecture, not decoration

The web page should exploit native HTML semantics to make a long technical procedure easier to scan and operate.

### Anchors and navigation

Use a visible table of contents and stable section anchors. A reproduction page is a working document; users jump between setup, run, outputs, and troubleshooting repeatedly.

### Ordered lists

Use `<ol>` when order is part of correctness. Steps are not decorative cards; sequence is executable meaning.

### Native `<details>` disclosure

Use `<details>/<summary>` for secondary explanations, historical incidents, and troubleshooting branches. Keep the main success path visually quiet by default; let the reader expand the branch only when needed.

Do not hide required commands or required acceptance evidence inside collapsed content.

### `<figure>` for topology and flow

Use `<figure>` / `<figcaption>` for system topology, transfer paths, and proof ladders. Prefer simple diagrams that explain dependency and execution order over decorative illustrations.

### `<aside>` for constraints

Use `<aside>` for warnings, evidence boundaries, safety constraints, and “do not do this” rules that affect a nearby step.

### `<table>` for contracts

Use tables for adapter contracts, file requirements, version matrices, and failure → fix mappings. Do not use tables for prose that reads better as a sequence.

### `<pre><code>` for commands and expected output

Commands and machine-verifiable markers should be visually distinct and copyable. Expected output should be shown close to the command that produces it.

### Definition lists for claim semantics

Use `<dl>` when defining P0/P1/P2/P3 or similar evidence/claim levels. Claim taxonomy is not a process flow and should not be rendered like one.

## 5. Visualize the experiment before explaining it

A long reproduction page should open with a compact visual overview that answers three questions in under one screenful:

1. **Where does work happen?** Example: GitHub/ChatGPT → lab Mac → RTX6.
2. **What is the execution order?** Example: code → data → runtime → WebShop → evolution → verification.
3. **What counts as real progress?** Example: setup ready ≠ real CUDA action ≠ real evolution ≠ P0 pass.

The overview is a map, not a substitute for the manual. Every visual node should link to the relevant detailed section.

## 6. Make evidence progression visible

Technical reproduction pages often confuse “environment ready” with “experiment succeeded.” Prevent this visually.

Use an evidence ladder such as:

`environment ready → index/import preflight → real CUDA model action → real reflector + injection → machine-verified scientific pass`

Each rung must state what it proves and what it does **not** prove.

Do not present infrastructure readiness, clean process exit, `COMPLETED`, mocks, stubs, fallback-only actions, or unit tests as scientific reproduction evidence.

## 7. Progressive disclosure beats equal-weight density

Use three reading layers:

### Layer A — visual orientation

A topology/route map, evidence ladder, and one canonical entry command.

### Layer B — executable manual

The numbered reproduction process. Each subsection should normally follow:

`why / context → action or command → expected result → local troubleshooting`

### Layer C — diagnostic / historical depth

Expanded incident details, anti-loop rules, provenance, and research notes.

A reader should be able to finish Layer B without reading Layer C.

## 8. Visualization must encode meaning

Good visualizations on reproduction pages encode one of:

- dependency;
- sequence;
- location / execution boundary;
- success evidence;
- branching on failure;
- comparison of claims.

Avoid charts, badges, or cards that only make the page look richer. If a visual element does not change what the reader understands or does next, remove it.

## 9. Preserve scientific truth separately from UX simplification

A simpler page must not simplify away evidence boundaries.

Historical success must remain labeled historical. Current runtime success requires current artifacts. Zero reward may prove real execution but not performance improvement. Planned ALFWorld work must not be described as validated.

UX simplification changes presentation, not scientific acceptance.

## 10. Anti-patterns

Do not turn a reproduction page into:

- a dashboard of equal-weight cards;
- a chronological incident diary;
- an architecture presentation before the first command;
- a long literature/research essay before setup;
- a visual design that hides the canonical command;
- a page where failures have equal visual weight with the success path;
- a page where “environment installed” looks like “experiment reproduced”;
- a page whose route or title encodes a scientific relationship that is not true.

## 11. Mobile and accessibility contract

- All core steps remain readable in one column.
- Code blocks scroll horizontally without breaking layout.
- Tables may scroll horizontally when necessary.
- Native disclosure controls remain keyboard-accessible.
- Anchor targets account for sticky navigation if present.
- Visual flow remains understandable without color alone.
- Diagrams use text labels, not unexplained icons.

## 12. Maintenance rule

When the experiment changes:

1. update implementation truth in the experiment repository;
2. update the current execution path;
3. update acceptance evidence;
4. only then update troubleshooting/history;
5. keep the visual overview synchronized with the numbered manual.

The reproduction page is a view over experiment truth, not the source of experiment truth.
