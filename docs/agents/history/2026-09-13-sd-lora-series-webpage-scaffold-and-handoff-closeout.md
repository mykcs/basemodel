# SD-LoRA series webpage scaffold / handoff closeout — 2026-09-13

Status: **historical closeout evidence; not current product, scientific, or deployment authority**

Scope: the accessible conversation around turning the SD-LoRA discussion into a BaseModel webpage series, especially the recent page-count / information-architecture discussion, the explicit scaffold-first request, navigation construction, first-screen acceptance, and final owner handoff.

Current owners:

- page expression and information architecture: `../current/human-thinking-web-expression-contract.md`
- attention budgets and first-screen acceptance: `../current/site-reader-attention-contract.md`
- Preview / Production delivery workflow: `../current/scenario-trigger-registry.md` + `../current/deployment-policy.md`
- scientific publication boundary: `../current/research-site-presentation-contract.md`
- conversation closeout protocol: `../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md` → canonical protocol in `mykcs/openevo-experiment`

## Coverage boundary

The closeout uses the current conversation that is still accessible plus repository evidence from the immediately preceding webpage work. It does not claim verbatim access to every older conversation turn outside the available context.

The owner corrections that matter here were not about CSS taste. They were about **what the webpage work was supposed to mean as a sequence of deliverables**: first recover the full research-question structure, then create the route/navigation skeleton, keep unfinished research visibly unfinished, and finally hand the actual webpage back with a link the owner can open.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| The first five-page proposal treated several subquestions as peers; the owner asked whether the structure really covered the whole conversation | existing conceptual-hierarchy family | Derive the route map from the parent research question and dependency chain; when one umbrella question owns several subquestions, use an overview / series owner rather than a flat peer list | existing `human-thinking-web-expression-contract.md` + `research-site-presentation-contract.md` | both already require conceptual hierarchy and dependency topology; no duplicate authority needed |
| The owner explicitly asked to create the subpages, entry links, return navigation, and other paths **first**, even if the pages were nearly blank | new direct phase-order correction | An owner-requested scaffold-first task is a real implementation boundary: routes + entries + return/series navigation + required route registration + honest placeholders, then stop until content filling is separately authorized | `human-thinking-web-expression-contract.md` + regression test | this is a user-facing information-architecture execution rule |
| After merge and Production verification, the Agent reported status but did not proactively give the actual webpage link; the owner asked “为什么不给我这个网页的链接？” | **yes — the same handoff family had already been corrected before** | Every webpage delivery handoff must contain a clickable URL for the exact surface just verified; Preview uses the current candidate URL, released work uses the canonical Production URL | `scenario-trigger-registry.md` + regression test | the older rule only made this explicit for iterative Preview review, leaving the released-page handoff gap |
| The first implementation put the full series navigation too high and the real phone/desktop attention gate rejected the first screen | existing guard worked | When secondary navigation competes with the page’s first question, move it below the first cognitive layer; do not raise the budget just to restore green CI | existing `site-reader-attention-contract.md` | current executable attention policy already says exactly this, so another rule would drift |
| Prospective research pages existed before their experiments were finished | existing scientific-publication boundary | A scaffold may name the question and planned evidence, but must not present hypotheses as completed results | existing research-presentation authority + new scaffold-first wording | preserves the difference between planned research and supported conclusion |

## 1. Scaffold-first means information architecture first

The owner did not ask for seven finished scientific essays. The explicit request was to make the pages exist, make them reachable, and make the reader able to return or continue. Minimal content was acceptable.

That request should have an executable interpretation:

```text
real route owners
-> parent / overview entry
-> series / previous / next / return links
-> route inventory / reader contract / sitemap where required
-> honest minimal page state
-> stop
```

The important distinction is between a **planned real route** and a **fake empty stage**. A real route owns an intended reader question and is explicitly requested as scaffold; it may be intentionally sparse while the experiment is pending. A fake stage exists only to make a navigation tree look complete. The former is allowed when clearly labeled; the latter remains prohibited.

The same phase boundary prevents another failure: filling an unfinished scientific page with plausible prose can accidentally turn a hypothesis into a result. A scaffold should say what question will be answered and what evidence will eventually live there, not claim that the evidence already exists.

## 2. The webpage hierarchy must follow the reasoning hierarchy

The early five-page proposal covered many topics but flattened the logic. The owner’s correction exposed the real structure:

```text
one umbrella question
-> how Vanilla SD-LoRA works
-> why growing history becomes expensive
-> why fast grouped compute can change numerical semantics
-> whether growing history contains genuinely new information
-> whether present function survives compression
-> whether future learning survives compression
-> whether a bounded learning state is possible
```

This is not a request to make every research series linear. The durable rule is to preserve the real dependency topology. Here the questions genuinely form a reader progression, so an overview owner plus ordered child routes is appropriate. In another project, parallel causal questions may need branches rather than a forced numbered chain.

## 3. A webpage handoff without the webpage URL is false-complete

This failure repeated. An earlier closeout had already strengthened the iterative review rule to require a verified, clickable current-candidate Preview URL. The later Production handoff still omitted the actual page link and reported only repository/provider completion state.

The abstraction was too narrow. The owner’s actual need is simpler:

> If the deliverable is a webpage, the final handoff must contain the exact clickable webpage that was verified.

The durable rule now covers both states:

- active review -> current candidate Preview URL;
- merged/released page -> canonical Production URL.

PR numbers, commit SHAs, provider `READY`, test counts, and merge state remain useful evidence, but none of them substitute for the user-facing page link.

## 4. Existing attention rules worked; do not duplicate them

The series navigation initially entered the first cognitive layer and caused too many first-screen targets. The repository browser gate caught that before release. The correct fix was to keep the page’s main question first and move secondary series navigation later, not to weaken the budget.

This is evidence that `site-reader-attention-contract.md` is functioning as intended. The closeout therefore records the incident here but does not add another mutable attention policy.

## Temporary state intentionally excluded

This record intentionally does **not** preserve temporary branch/worktree names, Preview URLs, deployment IDs, one-time provider states, local ports/PIDs, exact transient PR heads, or pending CI observations. Those are reconstructible from Git/provider history and are not standing knowledge.

Parallel mechanism-page feature work is also outside this closeout. This closeout does not use its narrow documentation authority to merge or modify unrelated product work.

## Repeated-mistake check

The missing-link handoff failure **did repeat** after a previous direct owner correction. The repair is therefore not another reminder in history alone. The current scenario trigger is widened from “Preview review handoff” to **every webpage delivery handoff**, and the documentation-authority test protects the broader wording.

The scaffold-first phase boundary is new in this exact form. It is promoted into the current human-thinking expression contract because the same owner request can recur whenever information architecture must be established before content is ready.

The conceptual-hierarchy and first-screen issues already had adequate current owners. They are cited here as coverage, not copied into new rule sources.

## Future-Agent test

A new Agent starting from root `AGENTS.md` should now reach two defenses before repeating these failures:

1. user-facing page work loads `human-thinking-web-expression-contract.md`; if the owner says “先把页面/入口/导航搭好，内容可以空”, the Agent should build the real route skeleton, keep unfinished science explicitly unfinished, and stop at that phase boundary;
2. Preview/Production work loads `scenario-trigger-registry.md`; before the owner-facing handoff, the Agent must provide a clickable URL for the exact page it actually verified.

If a future Agent can still report “merged + READY” for a webpage without giving the page link, or can turn a scaffold-only request into speculative content publication, this closeout has failed.

## Long-term memory boundary

No account-level ChatGPT memory mutation is claimed by this closeout. The durable project rules are stored in repository current policy and regression tests. Temporary execution state remains intentionally outside long-term memory.
