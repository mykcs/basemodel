# BaseModel Ponytail-style simplification closeout — 2026-09-11

Status: **historical engineering evidence; not current policy**
Scope: simplification audit of BaseModel runtime/browser glue, CSS reach, hydration boundaries and related tests
Current authority remains in `docs/agents/current/`.

## Why this audit existed

The task was not to make BaseModel look like Ponytail. It borrowed only Ponytail's engineering order:

```text
Does it need to exist?
-> can current code be reused?
-> can native HTML/CSS/browser/Astro behavior replace it?
-> can an installed dependency solve it?
-> otherwise add the smallest new implementation
```

The stopping rule was equally important: simplify only while observable behavior, accessibility, scientific boundaries, bilingual behavior, responsive behavior and release evidence stay intact.

## Classification

| Class | Finding | Disposition |
| --- | --- | --- |
| DELETE | `astro:page-load` re-init wrappers in static pages with no `ClientRouter` / view-transition topology | Removed after browser behavior was proven |
| DELETE | `DOMContentLoaded` / `readyState` wrapping around processed Astro module scripts | Removed; the processed module already runs after document parsing |
| NATIVE | Page Outline runtime-created DOM needed styling reach | Replaced broken scoped reach with tightly namespaced Astro `is:global` styling |
| DELETE | unsupported `aria-label` on a role-less Header `div` | Removed after axe identified it as invalid ARIA |
| KEEP | pre-hydration Quick View bridge and readiness guards | They preserve first-click behavior during a real hydration gap |
| KEEP | D3, ECharts, Nanostores, React, Zod | Real consumers exist; no high-confidence dependency deletion |
| KEEP | frozen compatibility CSS layers | Still contain live rules; retirement remains property-owner by property-owner |
| INVESTIGATE | native-anchor replacement for Page Outline custom scrolling | Offset/history semantics are not equivalent enough for a safe cleanup |
| INVESTIGATE | duplicated normalization between native adjuncts and stores | Direct reuse may import state-library side effects and increase coupling |

## The important surprise

The audit initially targeted lifecycle glue, but real-browser inspection exposed a separate inherited Page Outline bug: its runtime-created anchors and bars had zero geometry because Astro scoped CSS expected generated scope markers that those script-created nodes did not have.

This matters because a compiler/build green state would not have found it. The repair deliberately did **not** add JavaScript. It used Astro's native selector-reach mechanism while keeping the `.page-outline*` namespace and component ownership intact.

A focused browser regression now proves the rail has non-zero geometry and that clicking it changes the heading hash/current location. That regression runs in Chromium and WebKit.

The axe audit also demonstrated differential attribution: the candidate and exact base shared the same pre-existing contrast violation family. The candidate removed one invalid-ARIA incomplete finding, but the inherited contrast debt was not expanded into an unrelated palette refactor.

## Durable lessons promoted to current policy

1. A lifecycle hook is justified by navigation topology, not by defensive habit. On static full-page Astro navigation, ordinary processed module setup should not carry `DOMContentLoaded`, `readyState`, or `astro:page-load` wrappers unless a real re-entry path exists.
2. Runtime-created DOM does not automatically inherit Astro scoped markers. Component-owned dynamic nodes need explicit, tightly namespaced style reach and real-browser geometry/interaction proof.
3. Simplification must preserve readiness bridges that have a real consumer. Removing all guards or all hydration glue mechanically would be negligence, not minimalism.
4. When a surprising browser/a11y result may pre-exist, reproduce it on the exact base before assigning blame to the candidate.

The first two rules were added to the existing rendering/performance and CSS architecture owners instead of creating new mutable policy files.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Do not copy Ponytail's appearance or stack; transfer only engineering minimalism | No new failure | Reference repositories have dimensions; reuse the relevant dimension only | Existing website engineering standard + this history case | The accepted stack already has authority |
| Lifecycle glue existed without a router consumer | Newly exposed | Prove router/re-entry topology before lifecycle hooks | `rendering-and-performance-policy.md` | Rendering/hydration owner |
| Runtime Page Outline styles looked defined but matched no dynamic nodes | Newly exposed | Scoped CSS reach must match runtime DOM construction | `css-architecture.md` | Selector/ownership owner |
| axe found red output during candidate validation | Known class | Reproduce exact base before calling it a regression | Existing website engineering standard + this history case | Differential attribution was already policy; this is a new concrete case |
| Multilayer Bash/Python quoting failed before mutation while embedding Markdown/code text | Yes — same class was already known | Correct shell selection is necessary but not sufficient; complex content should not travel through nested shell quoting | `scenario-trigger-registry.md` -> existing `project-agent-operating-principles.md` | The current owner existed, but the use-site cue was still too vague |
| The owner had to say `继续完成` while merge/Production work was still safely actionable | Yes | Do not stop at a still-pollable or still-authorized completion boundary | Existing exact-head/pending-check trigger + release closeout policy | Already current authority; record recurrence instead of duplicating the rule |
| A protected Vercel Preview opened to an authentication page in a plain browser | Known class | Use the authorized provider/share path; do not weaken protection or persist temporary share credentials | Existing deployment/release policy and historical Vercel cases | Existing authority already covered the recovery path |

## Conversation-closeout addendum — 2026-09-12

The only new durable gap found after the original audit write-up was at the shell-quoting use site. The outer interpreter was correctly Bash, but a long inline Bash/Python command still embedded Markdown containing backticks and angle-bracket syntax. Parsing failed before mutation. The failure was correctly treated as `NOT_EXECUTED`, and the retry used a standalone file instead of deeper quoting.

This is a repeated class, not a new shell architecture rule. The existing owner already says non-trivial quoting belongs in a standalone script. The scenario trigger is therefore tightened only enough to classify multiline Markdown/code/data as non-trivial quoting by default.

Two other events were deliberately deduplicated rather than promoted into new policy: the owner again had to say `继续完成` while a live gate/release path remained actionable, and the protected Preview required an authorized share path for browser inspection. Both already have current owners. No Preview/share token, deployment ID, PID, port, worktree path, branch head, or other transient release state is retained here.

## Validation and stopping rule

The candidate was exercised through deterministic repository gates, production static build, overflow checks, Chromium and WebKit browser acceptance, targeted Page Outline interaction, and axe/console inspection. The browser matrix includes phone/desktop and light/dark coverage; scientific content and experiment-state semantics were not changed.

Stop here because the remaining candidates are not high-confidence simplifications. No evidence justifies removing live dependencies, readiness bridges, compatibility CSS, custom scroll-offset behavior, or persistence normalization merely to reduce line count. Future cleanup needs a new concrete failure, measurable opportunity, or behavior-equivalent replacement.

Temporary worktree paths, ports, Preview URLs, transient provider state and branch/PR status are intentionally not preserved here.
