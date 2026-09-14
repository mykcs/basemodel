# Vanilla SD-LoRA mechanism conversation closeout — 2026-09-14

Status: **historical closeout evidence; not current product, scientific, design, or release authority**

Scope: the accessible conversation that began with the BaseModel / Slide task “Vanilla SD-LoRA 到底怎么工作”, including the later owner correction that the published visual still did not visibly flow, plus current repository evidence through the routed-flow release and its later plain-language refinement. This file records only reusable lessons and coverage. Current rules remain in `docs/agents/current/` and executable source/tests.

## Coverage boundary

The closeout uses the visible conversation, current `main`, merged PR history, current policy, the earlier 2026-09-12 HTML-flow closeout, and the archived completion plan. It does not claim access to hidden reasoning or vanished tool output. Temporary ports, PIDs, worktree paths, branch heads, Preview URLs, deployment IDs, and one-time provider state are intentionally excluded from standing authority.

## What the owner corrected

The central correction was not “use prettier arrows”. The owner had asked for Archify-style process expression, but the first accepted-looking artifact still read as parallel summaries. The Agent had used Archify for semantic candidate generation and validation, yet the final BaseModel render did not make routing visually recoverable. Therefore “we used Archify” was true at the tooling layer but insufficient at the product layer.

The correction repeated because the task was repeatedly reported as nearly complete from broad green checks, while the named human-facing requirement — visible movement through a main path, side input, branch/join, and return edge — still lacked a direct rendered witness. Later iterations also showed that a desktop flow can become semantically wrong on mobile even when it has no horizontal overflow, and that a valid HPL receipt becomes stale after a material visible change.

## Repeated-correction classification

This conversation does **not** need another new design rule. The missing enforcement has already been added to current authority:

- `human-thinking-web-expression-contract.md` now requires a `FLOW-WITNESS` for non-linear flow, including main path, side input/branch, return/terminal, connector carrier, and rendered acceptance.
- `ui-change-visual-acceptance-gate.md` now has the failure scenario “all nodes exist, but the flow is not visually recoverable”, including desktop/mobile topology assertions.
- `human-preference-learning-system.md` already requires exact-artifact / exact-Git-SHA refresh after material visible changes.
- `project-agent-operating-principles.md` already requires semantic-target overlap search before substantial implementation, durable-state reconstruction instead of trusting chat prose, and literal artifact-state reporting.
- `multi-pr-semantic-integration-playbook.md` already requires stale branches to be re-resolved against current ownership and closed as superseded when `main` already contains the intended outcome.

The failure was therefore mostly **activation / use-site enforcement**, not absence of prose guidance.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Closeout action |
| --- | --- | --- | --- | --- |
| “用了 Archify，但完全看不出流程流动” | Yes | Tool/method adoption is not product acceptance; branch/side-input/return semantics must be visible in the final render | human-thinking expression contract + UI acceptance gate | already encoded and regression-protected; no duplicate rule added |
| A row of cards plus small arrows was called a flow | Yes | Non-linear flow needs real routed connectors; card adjacency and step text are insufficient | same owners | already encoded as `FLOW-WITNESS` / Scenario H |
| Desktop looked correct while phone moved failure/replay branches to the bottom | Yes within this work | Responsive acceptance must preserve causal attachment, not only avoid overflow | UI acceptance gate | already encoded and covered by mobile topology E2E |
| Material copy/layout changes were made after an HPL/cold-read receipt | Yes | Re-render and re-run review; old screenshot/receipt cannot represent the new exact head | HPL system | existing exact-artifact rule was sufficient; later work followed it |
| Several replies said “only the final few steps remain” before PR/Preview/exact-head review was actually terminal | Yes | Report branch/PR/merge/provider state literally; rebuild status from durable artifacts on resume | project-agent operating principles + canonical closeout protocol | no new rule; classify this as recurrence of an existing exact-state discipline |
| A new flow branch was started before discovering another local workline already owned the same semantic target | Yes | Search open PRs/branches/worktrees by reader problem and semantic target before substantial implementation | project-agent operating principles | existing semantic-overlap prewrite rule is sufficient |
| Much later, the stale local flow branch was hundreds of commits behind while current `main` already contained a better routed implementation | Yes | Do not rebase/merge obsolete product work just to preserve effort; prove the intended outcome survives in current `main`, then stop the stale line | multi-PR semantic integration playbook | current `main` / merged routed-flow implementation was accepted; stale line was not revived |
| Local `curl` to Vercel timed out although provider deployment state was successful | Known | Transport failure from one machine is not a provider/product failure; bind claims to provider object, exact SHA, ancestry, and real route evidence | existing provider/release policy | no duplicate rule added |
| A completed task checklist stayed under `docs/agents/current/` after all boxes were checked and Production was verified | Newly found closeout hygiene issue | Completed execution plans are historical evidence, not standing current authority | docs lifecycle / closeout protocol | moved the completed plan to `docs/agents/history/` and marked it archived |

## What should be remembered from the Archify part

Archify was useful in three distinct ways: topology authoring, geometry diagnostics, and deterministic validation. It caught route-preset conflicts and crossing side branches. But Archify receipts do not prove the BaseModel page inherited the same visual grammar. The final product still needs a direct screenshot/cold-read plus rendered topology assertions.

A useful mental model is:

`Archify semantic topology / diagnostics -> BaseModel-native render -> browser topology tests -> cold read`

Each arrow is a different evidence layer. Skipping the middle layers recreates the original failure.

## Temporary state intentionally not retained

Do not preserve as current policy: old feature-branch names, stale exact SHAs, temporary worktrees, local server ports, screenshots under `/tmp`, intermediate Preview URLs, transient CI queues, or the local network timeout to Vercel. Historical release evidence already lives in the archived completion plan and merged PR history; current product truth comes from `main`.

## Future-Agent test

A new Agent should be able to start from current policy and answer these before claiming a mechanism-flow task complete:

1. What is the main path?
2. Where does each side input / branch leave or join?
3. Is the loop return a real rendered edge?
4. Does mobile preserve the same causal topology?
5. Does the exact current artifact — not an earlier screenshot — pass browser/HPL review?
6. Is another workline or current `main` already the semantic owner?

If the Agent can still say “Archify passed” while the final page visually reads as adjacent cards, or can keep a completed execution checklist under `current/`, this closeout has failed.
