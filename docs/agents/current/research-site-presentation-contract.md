# Research site presentation contract

Status: **current project-wide research publication and progressive-disclosure contract**
Decision date: **2026-08-30**

This document consolidates durable owner preferences for how BaseModel presents scientific research to people who did not personally run every experiment. It is a content-and-presentation contract, not a replacement for the existing visual, evidence, or browser-acceptance policies.

The site exists first to **show scientific research results, analysis, evidence boundaries, and the reasoning that connects them**. It is not primarily an operations manual, a terminal transcript, an engineering diary, or a gallery of implementation artifacts.

The default reader should be able to understand the scientific question and the supported conclusion without copying a command, reading a full config, knowing internal run IDs, or opening every disclosure. Exact implementation depth remains available for audit and reproduction.

## 1. Reader and publication purpose

Default language and reader model:

- research-result routes are **Chinese-first** by default; English may mirror the evidence faithfully, but should not force the Chinese primary reading path into translation-shaped prose;
- understands the broad SEED / OpenEvo / WebShop project context;
- has **not** followed every experiment iteration;
- wants to know what was tested, what happened, why the result matters, what the evidence supports, and what remains unknown;
- may later inspect source, hashes, commands, configs, logs, or raw outputs to challenge authenticity or reproduce the work.

Therefore a research page should normally reveal information in this order:

```text
scientific question
-> direct answer / current result
-> decisive numbers or visual comparison
-> interpretation
-> evidence boundary / what this does not prove
-> claim-local provenance
-> optional reproduction / implementation depth
```

Do not invert this order by making setup, code, run IDs, CI, hashes, or terminal instructions the reader's first job.

## 2. What stays visible; what becomes optional depth

### Visible by default

Keep these in the main reading path:

- the scientific question and why it matters;
- the direct result or current state;
- decisive metrics, uncertainty, failures, and null results;
- the minimum methodology needed to interpret the result correctly;
- distinctions that change scientific meaning, such as exact success vs task score, invalid measurement vs true zero, or source-faithful comparison vs paper-exact reproduction;
- unfamiliar project terms when they first become necessary;
- a short reasoning bridge from observation to inference to boundary;
- claim-local links to the closest available evidence.

### Collapsed by default

Use progressive disclosure for depth a reader needs mainly to audit or reproduce:

- copy/paste shell commands;
- API-key or environment-variable setup;
- complete scripts and long source snippets;
- exact directory paths used only for operations;
- long configs / manifests;
- terminal output and machine logs;
- CI or deployment mechanics;
- full hashes when a shorter provenance label is enough in the mainline;
- troubleshooting and recovery steps;
- verbose implementation notes that do not change interpretation.

A disclosure summary must name the thing inside it. Prefer:

```text
复现细节：安全配置 MiniMax API
代码证据：WebShop / SEED split 实现
运行记录：本次评测的机器与 artifact
```

Avoid generic summaries such as `More`, `Details`, or an icon-only affordance.

**Progressive disclosure is not permission to hide scientific caveats.** If a detail changes the conclusion, it belongs in the visible argument even when its raw implementation evidence stays collapsed.

## 3. Code has two different roles

Do not apply a blanket rule that every `<code>` or `<pre>` must disappear.

Keep code-like notation visible when it is the clearest representation of the **scientific mechanism or measured object**, for example:

- `search[...]` / `click[...]` as WebShop actions;
- a compact reward equation;
- a task split or state transition that the reader must understand;
- a short pseudocode flow that is itself the explanation.

Collapse code when it is primarily **execution machinery**, for example:

- `python ...`, `npm run ...`, `docker ...`, `ssh ...`, `curl ...`;
- `./setup.sh ...` copy commands;
- `chmod`, `chown`, `mkdir`, secret-file setup;
- complete launch scripts or long configuration blocks.

The test is simple: if removing the exact syntax leaves the scientific argument intact, the exact syntax is optional depth.

## 4. Secret and credential presentation

Research authenticity never requires publishing a real credential.

For any API credential or secret workflow:

- never commit, render, log, screenshot, or paste the real key;
- show only a placeholder or a hidden-input workflow;
- prefer `getpass` / masked entry over shell history containing the key;
- set least-privilege file permissions and show ownership checks when relevant;
- verify shape/permissions without printing secret contents;
- do not recommend `cat` on a secret file as a verification step;
- keep endpoint/model/config facts separate from the secret itself.

A public page may explain **how** a secret is provisioned while the secret value remains absent from the page, repository, logs, and chat.

## 5. Terminology and stage labels

Internal shorthand is provenance, not assumed reader knowledge.

When an unfamiliar label first matters, explain it in place in plain language. Examples include:

- what a particular Stage does;
- what `7` vs `8` means when a gate requires eight qualifying identities;
- what `BASE`, `SD-LoRA`, `qualified-positive`, `block`, or `trajectory` means in that experiment;
- whether a number is a score, count, threshold, step, seed, or model size.

Do not use unexplained negation or shorthand such as “no-update”, “not 8”, or “Stage 2 failed” when the reader cannot infer the underlying mechanism.

Internal experiment IDs such as `H1.46` may remain as compact provenance, but descriptive experiment names should carry the reader-facing title and navigation label.

## 6. Navigation and information architecture

Navigation expresses conceptual hierarchy, not every object the repository happens to contain.

- Do not make SEED and OpenEvo peers merely because both have pages if one is the reference method and the other is the current research program.
- Do not place infrastructure such as a lab server under a method navigation branch merely because the method runs there.
- Do not show nonexistent stages as empty navigation placeholders.
- When Stage numbers are visible, explain their role where a new reader first encounters them.
- Prefer fewer stable navigation choices over a long menu that mirrors internal project taxonomy.

A route can expose deep evidence without making that evidence a permanent top-level navigation item.

## 7. Evidence lives next to the claim

The main prose is for understanding. Exact counts, confidence intervals, hashes, code links, machine results, manifests, and raw episodes should be placed in **local evidence blocks** close to the claim they support rather than collected into a disconnected link wall.

Evidence links should point as close to primary truth as possible:

- official fact -> official code / first-party document;
- our implementation -> actual source code;
- model output -> raw episode / output artifact;
- experiment number -> machine result / reconciliation / analysis JSON;
- configuration -> config / manifest;
- historical judgment -> the dated commit/report that made it;
- human summary -> supporting aid, not primary evidence when a machine/source artifact exists.

When practical, prefer immutable commit links and exact line ranges.

Every inferential claim should preserve a minimal bridge:

```text
observation
-> what this observation supports
-> what it still cannot prove
```

Do not merge different evidence layers into one causal claim merely because the numbers sit on the same page.

## 8. Scientific wording boundaries

Never upgrade evidence strength for rhetorical neatness.

- A positive delta whose confidence interval crosses zero is not a stable win.
- A SEED-compatible or source-faithful panel is not automatically the paper-final exact panel.
- A cross-source score difference is not a causal OpenEvo-vs-SEED treatment effect.
- An invalid measurement is not a scientific zero.
- An unexecuted experiment is not a negative result.
- A frozen historical fact record is not silently refreshed with current provider facts.

Unknown remains unknown until first-party evidence or a controlled experiment resolves it.

## 9. Visual expression for research

This contract inherits `ui-design-principles.md`: **Research Editorial × Experimental Workbench**, restrained hierarchy, scarce cards, semantic color, no generic AI gradient language.

For quantitative scientific relationships, prefer real web-native structure over decorative imagery:

- HTML/SVG/data-driven plots for curves, bars, state transitions, and comparisons;
- real tables when row/column alignment carries meaning;
- labeled axes, units, sample counts, uncertainty, and evidence provenance when they affect interpretation;
- generated or illustrative images only when they explain a visual concept that is not better represented by actual data geometry.

A chart is successful when the reader can understand the relation it encodes, not when it merely looks more polished than the underlying evidence.

## 10. Responsive, theme, and accessibility requirements

Research depth must remain usable across the normal browser matrix.

At minimum check 390px, 768px, and 1440px pressure points when the changed surface can wrap or overflow. Preserve light and dark themes.

- observation tables must not force page-level horizontal overflow;
- evidence chips and long technical tokens must wrap or scroll locally;
- disclosure summaries must be keyboard focusable and semantically named;
- links need readable text, not only a `↗` icon;
- color never carries evidence state alone;
- opening or closing `<details>` must not break layout or reading order.

## 11. Sitewide back-audit baseline — 2026-08-30

A repository scan of the research source established this starting point:

- 20 research source files contain `<code>`, `<pre>`, or equivalent code-like expression;
- only 3 contain literal `<pre>` blocks;
- 2 contain shell-looking operational commands;
- 26 research source files already use `<details>`.

This means progressive disclosure already exists in the product, but it previously lacked one durable publication contract.

The back-audit classifies code by **reader function**, not tag name:

| Surface | Decision |
|---|---|
| WebShop actions / reward equations / task split / conceptual pseudocode | keep visible when required to understand the science |
| exact WebShop / SEED source excerpts | keep in existing code-evidence disclosures |
| `./setup.sh -d small` copy command | move out of the visible transformation card; retain in code evidence |
| raw WebShop baseline training commands | collapse as reproduction detail |
| MiniMax secret provisioning | add as collapsed reproduction detail only |
| machine state / long provenance already in `<details>` | preserve the disclosure pattern |

A repository test should reject newly introduced shell-like operational commands in research surfaces when they appear outside an explicit technical disclosure. This keeps the site from drifting back toward an operations manual while allowing short mechanism notation to remain visible.

## 12. Review checklist for every research page

Before merge, answer yes to all of the following:

1. Can a reader identify the scientific question and supported answer before seeing implementation detail?
2. Are decisive numbers and caveats visible without opening disclosures?
3. Are unfamiliar Stage labels, thresholds, negative labels, and acronyms explained where first used?
4. Does each important claim have nearby provenance that actually supports it?
5. Are commands, scripts, configs, secrets setup, and logs optional depth unless they change interpretation?
6. Does every disclosure have a meaningful summary and keyboard-visible focus?
7. Are result, interpretation, and “cannot prove” boundaries separated?
8. Does navigation reflect conceptual hierarchy rather than internal repository structure?
9. Are real quantitative relationships represented with truthful web-native geometry rather than decorative art?
10. Has the affected route passed the required light/dark and responsive acceptance matrix?

## Relationship to current policy owners

This file owns the **research-publication purpose, reader-facing depth boundary, and code/operations progressive-disclosure rule**.

It complements rather than replaces:

- `human-thinking-web-expression-contract.md` — page expression and information architecture;
- `reader-first-copy-hierarchy.md` — subject-first scientific copy hierarchy;
- `research-editorial-style.md` — research prose and evidence-chain style;
- `audience-centered-technical-copy.md` — context and technical wording;
- `ui-design-principles.md` — visual identity and non-drift system;
- `sitewide-visual-knowledge-architecture.md` — route intent and information-density layers;
- `experiment-result-publication-workflow.md` — publication evidence workflow;
- `ui-change-visual-acceptance-gate.md` — browser-level acceptance.

When this contract conflicts with executable scientific truth or a more specific current evidence policy, preserve the scientific truth and update the stale presentation rule rather than hiding or rewriting the evidence.
