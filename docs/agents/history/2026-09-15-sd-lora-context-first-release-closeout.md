# SD-LoRA context-first release conversation closeout — 2026-09-15

Status: **historical closeout evidence; not current product, scientific, release, or deployment authority**

Scope: the accessible conversation that moved the Vanilla SD-LoRA page from mechanism-first explanation to context-first explanation, then carried that exact candidate through current-base synchronization, exact-head Vercel acceptance, merge, Production verification, and final closeout. Current rules remain in `docs/agents/current/**`, executable tests, live GitHub/Vercel state, and the scientific authority in `mykcs/openevo-experiment`.

## Coverage boundary

This closeout uses the visible conversation, current BaseModel `main`, live provider/repository evidence, the canonical closeout protocol, and the already-merged SD-LoRA plain-language/flow closeouts. It does not claim hidden reasoning or unavailable tool history. Earlier SD-LoRA closeouts already own the Archify/flow and plain-language lessons, so they are not duplicated here.

Temporary branch heads, Preview share URLs, deployment IDs, local screenshots, worktree paths, PIDs, provider polling states, and one-time ETAs are intentionally excluded from standing policy.

## What was actually new

### 1. A Reader Contract selector must name the message owner, not the tallest convenient wrapper

The page correctly put “why SD-LoRA exists” before the mechanism, but the first hosted acceptance initially selected the whole intro section as `firstViewportSelector`. That section also contained the scope paragraph and five-step position map. The core lede was already visible, yet the Gate correctly failed because the *selected element* extended below the first viewport.

The fix was not to relax the viewport threshold. The selector moved to the stable lede that actually carries the declared first-screen message. The current Reader Attention Contract now states the reusable rule: select the smallest stable semantic element that independently carries `firstViewportGoal`; do not bind later cards/steps merely because a parent section contains both. Conversely, never shrink the selector to a decorative fragment that cannot communicate the goal by itself.

### 2. Fish/Bash failed again even though the rule already existed

A compound command used Bash process substitution while the execution surface launched Fish. It failed before repository mutation. Root `AGENTS.md`, `project-agent-operating-principles.md`, and the scenario registry already said to set and verify the outer shell before compound Bash syntax. This was therefore a repeated **activation failure**, not a missing-policy gap.

`REPEAT-CORRECTION` witness for future use: `compound shell command -> shell-dialect owner -> tool-reported outer interpreter must be /bin/bash -> compound syntax allowed -> invalidate immediately if the tool reports Fish/Zsh/sh or crosses another unverified parsing layer`. Parser failure before mutation remains `NOT_EXECUTED`.

Later in the same closeout, the outer shell was correctly Bash but an inline heredoc was nested inside command substitution while creating the PR body; quoting failed before the PR mutation. The existing rule already covers this too: when quoting is no longer trivial, switch execution shape to a standalone script/file plus a simple command instead of adding another parsing layer. The branch push had already succeeded, but the PR action itself remained `NOT_EXECUTED`.

### 3. Merge was attempted before the required exact-head Vercel final gate

The branch had green public GitHub Actions, but the first merge attempt was rejected because the required `Vercel` status was still expected. Current deployment policy already says public GHA is preflight, while `request-vercel-final-gate.mjs` owns exact-head merge acceptance. Again, the rule existed; the release trigger was not activated before the mutation.

`REPEAT-CORRECTION` witness: `merge PR -> deployment-policy + release-closeout-protocol -> live head/base ancestry + required-status state + exact-head Vercel success -> merge allowed -> invalidate if head/main/required-check state moves`. A merge call must not be used as a probe to discover which required check is missing.

### 4. Current-base drift was caught by the existing guard

Before the final gate could run, `main` advanced. `request-vercel-final-gate.mjs` failed closed because the PR was behind current `main`; the candidate was synchronized, the affected checks reran, and only then was the final gate requested again. No new policy is needed here: the executable guard and current release policy did exactly what they should.

### 5. Production completion required the real route, not just merge or BUILDING state

The task was not called complete at merge time or while Production was still building. Completion was reconstructed from a READY Production deployment plus a real-browser read of the canonical SD-LoRA route, checking the new H1, lede, LoRA comparison, no horizontal overflow, and no error overlay. This is existing release discipline working correctly, not a new rule.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Closeout action |
| --- | --- | --- | --- | --- |
| Context-first page needed motivation / role / timing before mechanism | Yes, already covered by earlier copy/reader work | establish object and reader need before internals | existing website design + reader contracts | no duplicate rule |
| `firstViewportSelector` covered the whole tall intro section | New narrow gap | bind selector to smallest stable semantic owner that fully carries `firstViewportGoal` | `site-reader-attention-contract.md` | **current rule strengthened** |
| Bash process substitution reached a Fish outer shell | **Yes** | verify the actual outer interpreter before compound syntax | existing root/principles/scenario shell rule | no duplicate rule; activation failure recorded |
| PR creation nested heredoc inside command substitution and broke quoting | **Yes shell/quoting family** | when quoting is non-trivial, use a standalone body/script and a simple mutation command | existing project-agent shell rule | no duplicate rule; execution shape changed |
| Merge attempted with public GHA green but no required Vercel status | **Yes family / policy already explicit** | public preflight is not merge authority; exact-head Vercel must be green first | existing deployment + release-closeout policy | no duplicate rule; activation failure recorded |
| `main` moved before final gate | Known | refresh current-base ancestry and requalify the exact new head | executable final-gate script + release policy | guard worked; no new rule |
| Merge/Production status was not treated as page acceptance by itself | Known | verify canonical Production route and claimed UI directly | existing release/scenario policy | existing guard followed |

## Temporary state intentionally not promoted

Do not preserve as current policy or long-term memory: candidate SHAs, merge SHAs, PR numbers, Preview share parameters, deployment IDs, transient `BUILDING/READY` snapshots, local worktree paths, screenshots, one-time CI counts, or ETAs. Those facts are reconstructible from Git/provider history when historically needed and must be refreshed live for future release decisions.

No SD-LoRA/GDR scientific semantics, experiment runtime, GPU state, deployment configuration, or Production behavior is changed by this closeout.

## Future-Agent test

A future Agent starting from `AGENTS.md` should now be able to answer, before claiming a similar page/release complete:

1. What exact element independently carries the declared first-screen message?
2. Is a reader-contract failure caused by real content overload, or only by a selector that includes second-layer content?
3. Did the execution tool actually launch Bash before Bash-only syntax, and did non-trivial quoting move into a standalone file/script instead of another inline parsing layer?
4. Before merge, is the candidate current with live `main`, and is the required exact-head `Vercel` status actually successful?
5. After merge, was the canonical Production route opened and the claimed change verified there?

If the Agent can still use a tall wrapper as the first-screen selector without asking whether the wrapper owns second-layer content, or can still treat public-GHA green as merge authority, this closeout has failed.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. The durable project lesson is stored in current repository policy plus this indexed historical case; repository and live provider/scientific authority remain stronger than remembered summaries.
