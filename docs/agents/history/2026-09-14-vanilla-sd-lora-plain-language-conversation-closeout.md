# Vanilla SD-LoRA plain-language conversation closeout — 2026-09-14

Status: **historical closeout evidence; not current product, scientific, routing, or release authority**

Scope: this record covers the accessible conversation around the Vanilla SD-LoRA mechanism page, including the missing-flow correction, the later plain-language rewrite, browser acceptance, HPL handling, and release closeout. Current rules remain owned by `docs/agents/current/**`; this file records why those rules mattered and where two narrow use-site gaps remained.

## What happened

The mechanism implementation eventually had a real routed HTML/SVG flow, but the public explanation still required too much project-internal decoding. The useful rewrite kept the real technical objects and changed the reading order: task attempts, checked successes, old examples, parameter update, candidate parameters, and the next-round choice now come before internal labels.

This was not a new preference. The repository already treated “webification language regression” as a repeated failure family: accepted natural explanations should not be rewritten into more abstract or project-internal prose merely to sound formal.

The earlier missing-flow correction was also already institutionalized. The prior Vanilla HTML-flow closeout had turned the existing design preference into a `FLOW-WITNESS` and rendered-topology acceptance. This closeout therefore does not add another flow rule.

Several red tests during the rewrite expected retired sentences rather than the current scientific contract. They were classified as stale copy contracts only after checking that the facts and boundaries were still present. Geometry, topology, overflow, bilingual, and scientific checks stayed intact. Existing UI acceptance and website-engineering rules already cover that classification, so no duplicate stale-test policy was added.

## New narrow lessons

A focused browser run once reused older static output and looked green before a fresh exact-tree build exposed a source syntax problem. The missing distinction was between “browser reached the intended server” and “browser rendered the intended built tree.” The UI acceptance policy now says that existing-`dist/` shortcuts are rapid preflight unless current-tree artifact identity is proven, and that a relevant source change requires a fresh build before exact-head browser evidence can be claimed.

A second issue came from the global inline-code copy enhancement. A formula inside the mechanism diagram was presentational content, not an artifact the reader was expected to reuse, but the mobile copy affordance made the formula look as if it contained extra glyphs. The actionable-content policy now states that presentational math, formula labels, diagram annotations, and similar code-styled text should opt out with `data-no-copy="true"` when copying is not part of the reader task.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Closeout action |
| --- | --- | --- | --- | --- |
| Flow movement was not visible enough | Yes | Non-linear process diagrams need real topology and rendered acceptance | existing human-thinking expression + UI acceptance owners | no duplicate rule; prior FLOW-WITNESS remains authority |
| Owner requested another plain-language pass after technical completion | Yes | Preserve accepted natural explanation; use object → action → result before internal labels | existing website design / CASE-091 / HPL owners | no duplicate rule; existing Vanilla plain-language regression remains the use-site guard |
| Exact-string tests failed after accepted wording changed | Yes | Verify current semantic owner first; keep facts and boundaries, retire stale literal assumptions | existing UI acceptance §10 + website-engineering §6 | no duplicate rule |
| Longer natural copy caused a small WebKit overlap | No new rule needed | Copy changes are still layout changes; preserve geometry gates instead of weakening them | existing UI acceptance gate | existing guard worked |
| Browser test reused stale static output | Related exact-tree family; use site was underspecified | Reused static output is preflight unless artifact identity is proven | `ui-change-visual-acceptance-gate.md` | current rule strengthened |
| Copy affordance visually polluted display math | New use-site detail | Only reusable/actionable code should gain copy affordance | `actionable-content-ux.md` | current rule strengthened |
| Independent HPL reviewer was unavailable | Existing boundary | Unavailable reviewer stays `NOT_EXECUTED`; never manufacture an independent PASS | existing HPL authority | rule worked; no duplicate |
| Provider / branch state changed during closeout | Existing release discipline | Reconstruct literal state from GitHub, Vercel, and public route evidence | existing release authority | temporary state excluded |

## Temporary state intentionally excluded

This closeout does not preserve PIDs, ports, local worktree paths, one-time screenshots, candidate SHAs, Preview share URLs, deployment IDs, provider polling state, or transient branch status as standing policy. Merged product history remains recoverable from Git and provider records; future Agents must read current `main` and live provider state.

No scientific result, SD-LoRA/GDR/DirectApply semantics, experiment runtime, GPU state, route ownership, or Production behavior is changed by this closeout.

## Future-Agent test

A new Agent starting from `AGENTS.md` and working on user-facing copy/UI should reach the accepted-copy/HPL rules before drafting and the UI acceptance gate before claiming browser evidence. If it intentionally reuses static output, it should know that the result is not exact-tree evidence without artifact identity. If it renders a formula only for explanation, it should not accidentally turn that formula into a mobile copy control.

If an older `dist/` can still be reported as current-head browser evidence, or a presentational formula can still be visually polluted by an automatic copy affordance without the Agent recognizing the actionability boundary, this closeout has failed.
