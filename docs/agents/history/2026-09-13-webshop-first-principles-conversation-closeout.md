# WebShop first-principles conversation closeout

Status: **historical evidence; not current authority**

This record captures why current reader-first and responsive-layout rules were tightened after the WebShop page was reorganized from a zero-context reader's point of view. Current authority remains under `docs/agents/current/`.

## What changed in our understanding

The useful lesson was not “add a table of contents.” The stronger rule is to establish the experimental object before asking a new reader to decode its mechanics: what the benchmark is, why it is relevant evidence, how the experiment uses it, and only then interaction/data/scoring details. A dashboard of orientation cards can still fail this job even when every fact is technically present.

Two implementation bugs exposed separate ownership traps. First, a wide settings table was locally scrollable but still forced the parent CSS Grid to its min-content width, creating page-level mobile overflow; containment required a shrinkable owner track, not global overflow masking. Second, an extra wrapper added only to create an anchor changed the DOM relationship used by the standalone explainer's direct-child selector, so viewport-fixed controls silently fell back to sticky behavior. The safe default is to reuse an existing semantic anchor target and treat structural wrappers as real layout changes.

The scientific boundary did **not** need a new duplicate policy: current research-presentation rules already say source-faithful/released-code reproduction is not automatically paper-final exact reproduction and unknown stays unknown. The closeout therefore adds only a retrieval/use-site reminder rather than another provenance authority.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| A first implementation drifted toward equal-weight orientation cards even though the owner asked for a first-principles entry path. | **Yes.** Anti-cardification / empty-eyebrow rules already existed; they were retrieved too late. | Run the reader/preference retrieval **before** the first UI write; establish the benchmark object before mechanism details. | `scenario-trigger-registry.md` + refined `website-copy-cases.md` CASE-025 | Fixes the retrieval failure without creating a second design authority. |
| A 760px evidence table had local scrolling but still widened a 390px page through Grid min-content propagation. | No exact prior incident in this conversation; it is a known overflow class with a new concrete mechanism. | Local `overflow-x:auto` is insufficient proof; shrink the owning grid/flex track/item and assert root width independently. | `ui-change-visual-acceptance-gate.md` | This is a browser falsification rule for responsive layout work. |
| An anchor-only wrapper broke the explainer's direct-child CSS ownership and changed fixed controls to sticky. | No. | Prefer an existing semantic target for same-page anchors; wrappers are structural changes that can alter selector/hydration/position ownership. | `website-engineering-standard.md` | This is a reusable DOM/semantic-ownership engineering rule. |
| The page had to keep paper-reported settings, released-code defaults, and unknown exact identities distinct. | Existing principle, not a new failure. | Preserve provenance layers when they change scientific interpretation; do not guess a neat exact manifest. | Existing `research-site-presentation-contract.md`; scenario trigger now reminds the use site | Avoids duplicating an already-canonical scientific rule. |
| The owner had to ask for the website URL after a completion-style report. | **Yes.** The release trigger already required an exact hosted route in every webpage handoff. | Re-scan the release trigger at handoff and include the exact route actually verified. | Existing `scenario-trigger-registry.md` release trigger; new first-principles trigger links to it | The rule was already strong; the failure was phase-transition retrieval, not missing wording. |

## Temporary state intentionally not promoted

This closeout does not preserve temporary branch heads, deployment IDs, Preview URLs, PIDs, ports, current provider status, or the hourly task's transient scheduler state as standing policy. Dated external citation counts remain page content with their own visible observation date/source; they are not converted into timeless governance facts here.

## Future-Agent test

A future Agent starting from root `AGENTS.md` reaches the scenario registry during bootstrap. A request containing “第一性原理 / 目录 / 先讲是什么” now triggers reader/preference retrieval before implementation, points to the existing copy/design authorities, and carries the two concrete responsive/DOM ownership checks into the use site. The Agent should therefore be less likely to build the card wall first, let a wide table stretch the document, or add an anchor wrapper that silently changes control positioning.
