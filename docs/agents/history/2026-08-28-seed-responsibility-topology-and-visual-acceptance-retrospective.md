# 2026-08-28 SEED responsibility-topology and visual-acceptance retrospective

Status: **historical case record**. This document preserves the engineering and reasoning lessons from the 2026-08-28 conversation that re-audited SEED Stage 1 ownership, rebuilt the SEED WebShop mechanism visual around real responsibility boundaries, hardened the browser regressions, and released an exact-head Vercel Preview in PR #309. It does not override `docs/agents/current/*`, executable repository truth, live GitHub/Vercel state, or current SEED/OpenEvo scientific authority.

## Scope

The conversation began with one apparently narrow scientific question:

> In SEED Stage 1, does Qwen collect WebShop trajectories through SEED's harness, or through Princeton WebShop's original harness?

That question exposed a deeper problem in the website. The page did not merely omit one label. It flattened multiple different responsibility layers into visually similar cards and arrows, making it hard to tell:

- which component produces model completions;
- which component owns prompt/history/action parsing;
- which component executes `search[]` / `click[]` and returns observations/scores;
- when an episode becomes fixed evidence;
- when GLM-5.2 appears;
- which signals are environment outcomes versus OPD/GRPO training signals;
- what actually persists into the next iteration.

The owner then explicitly widened the task: do not patch only the Stage-1 harness label; fix **all visual problems at the same semantic level** across the page.

The resulting implementation was prepared on branch `research/seed-responsibility-topology-20260828`, exact-head commit `ef9962707be2ed2ea677a6d708f24a11d204e621`, and PR #309 (`Fix SEED WebShop responsibility topology`). At the time of this retrospective, the exact-head Vercel Preview was READY and visually inspected; merge/Production state remains live release state and must be re-read rather than inferred from this record.

## Scientific responsibility chain resolved by the audit

The correct mental model is layered, not binary:

```text
Qwen policy model
  -> raw completion

SEED / verl-agent model-facing harness
  -> prompt + history
  -> available actions
  -> <think> / <action> contract
  -> action projection / parsing
  -> extracted WebShop action

Princeton WebShop environment
  -> WebAgentTextEnv
  -> executes search[] / click[]
  -> changes page state
  -> returns observation / available actions / WebShop score

repeat until episode terminates
  -> completed trajectory + outcome

Stage 1 only after completion:
  completed episode
  -> external GLM-5.2 offline hindsight analysis
  -> trajectory -> hindsight skill
  -> SFT
  -> bootstrapped policy θ0

Stage 2:
  current policy θt
  -> same interaction contract
  -> completed on-policy episode
  -> same checkpoint performs hindsight analysis
  -> plain/skill re-score -> OPD
  -> environment outcome -> GRPO
  -> optimizer
  -> persisted policy θt+1
```

Therefore the correct answer to “SEED harness or Princeton harness?” is not either/or:

- the **model-facing interaction contract** belongs to SEED / verl-agent;
- the **underlying shopping environment transition** is Princeton WebShop's `WebAgentTextEnv`;
- GLM-5.2 is **not** the trajectory collector and **not** the WebShop reward scorer.

This distinction matters directly to reproduction. Using the same WebShop data/environment is not sufficient if prompt construction, history, action grammar, projection/parser, or available-action contract differ from SEED.

## Friction 1 — the original question looked binary, but the architecture was layered

The first trap was framing the investigation as:

```text
SEED harness
OR
Princeton WebShop harness
```

The code boundary was actually:

```text
SEED/verl-agent model-facing wrapper
AROUND
Princeton WebShop environment implementation
```

A binary answer would have hidden one true layer regardless of which side was chosen.

Durable lesson:

> When a framework wraps a benchmark environment, trace the call chain and assign responsibility per transition instead of forcing one repository/project to “own the whole harness.”

For mechanism audits, ask separately:

```text
Who builds the prompt?
Who stores/limits interaction history?
Who defines the model output contract?
Who parses/projects the action?
Who executes the environment transition?
Who computes/returns the environment score?
Who seals the episode?
Who later analyzes it?
Who converts it into a learning signal?
What state persists?
```

## Friction 2 — paper wording alone was not enough to resolve implementation ownership

The paper/appendix established important facts such as Stage-1 trajectory count, GLM-5.2's offline role, and the two-stage method. But “what exact software layer drives the action/observation loop?” was clearest in released code.

The productive evidence order was:

```text
paper / appendix
-> released Stage-1 pipeline entrypoint
-> environment manager / wrapper construction
-> prompt definition
-> action projection/parser
-> underlying WebAgentTextEnv instantiation
```

This separated two different evidence questions:

- **method intent** — what SEED says the stage does;
- **runtime responsibility** — which released component owns each transition.

Durable lesson:

> For architecture ownership claims, use paper text to establish method semantics and code call chains to establish executable responsibility boundaries. Do not ask either source to answer the other's question by itself.

## Friction 3 — fixing one Stage-1 card would have left the page globally inconsistent

Once the Stage-1 chain was understood, the owner rejected a narrow patch and asked for all visual problems at the same level to be fixed.

That changed the unit of work from:

```text
one missing harness label
```

to:

```text
whole-page responsibility topology
```

The audit then had to include:

- page lede;
- Stage-1 collection visual;
- Stage-1 offline pipeline;
- Stage-2 rollout visual;
- Stage-2 analyzer branch;
- OPD vs GRPO branches;
- optimizer and persisted-state topology;
- static explanatory sections below the interactive figure;
- semantic unit tests;
- browser geometry tests.

A locally correct figure can still leave a globally false mental model when nearby prose or another stage uses the old abstraction.

Durable lesson:

> When the user identifies an error in **semantic level**, audit sibling visuals and prose that encode the same level of meaning. Do not treat the named specimen as the entire scope.

## Friction 4 — flat card grammar collapsed different kinds of things into one visual category

The earlier Stage-2 map used similarly styled nodes for:

- policy model;
- environment interaction;
- completed trajectory;
- analyzer;
- context variants;
- learning signals;
- optimizer;
- next policy state.

This made the diagram technically connected but cognitively flat.

The corrected visual introduced explicit responsibility categories:

```text
MODEL
HARNESS
ENVIRONMENT
EVIDENCE
ANALYZER
LEARNING SIGNAL
PERSISTED MODEL STATE
```

Stage 1 and Stage 2 now reuse the same harness/environment boundary so the reader can see what stays fixed and what changes between stages.

Durable lesson:

> A system diagram should encode **what kind of responsibility a node owns**, not merely the order in which boxes are visited.

If model, wrapper, environment, evidence, training signal, and persisted state all look equivalent, the diagram is hiding architecture even if every label is technically correct.

## Friction 5 — a stale CSS owner silently overrode the new topology

After the semantic rewrite, a browser gate exposed paragraphs compressed to roughly 12px-wide vertical rails on desktop.

The component itself defined the new 8-column responsibility layout correctly. The actual culprit was an older wide-screen readability override that still imposed the previous 6-column `grid-template-areas`.

The browser combined:

```text
new grid columns
+ old grid areas
-> implicit extra columns
-> policy / trajectory nodes squeezed
-> expanded prose becomes vertical CJK rails
```

This is a classic semantic-owner mismatch: both CSS rules were individually understandable, but one still owned a topology that no longer existed.

The successful diagnostic sequence was:

```text
inspect failing screenshot
-> read computed grid-template-columns / grid-template-areas
-> compare component owner vs later override owner
-> update the stale owner instead of adding another higher-specificity patch
```

Durable lesson:

> When a layout becomes inexplicably narrow after a structural refactor, inspect **computed grid/flex ownership** before changing typography. A stale compatibility/readability owner can be the real cause.

Do not “fix” semantic-owner drift with another override layer.

## Friction 6 — the Stage-1 offline pipeline had hidden horizontal clipping

The five-cell Stage-1 offline chain looked acceptable in a screenshot, but the browser geometry audit found several cells whose `scrollWidth` exceeded `clientWidth`.

The offending content included long mixed-language technical labels such as:

- `COMPLETED EPISODES`;
- `EXTERNAL OFFLINE ANALYZER`;
- `trajectory -> hindsight skill`;
- explanatory Chinese/English copy.

The correct response was not `overflow:hidden`.

The fix preserved the five-step conceptual sequence while allowing long technical words to wrap and removing geometry that expanded audited width.

Durable lesson:

> Browser property audits can catch “looks okay at a glance” clipping before the owner does. Treat `scrollWidth > clientWidth` on required explanatory content as a real communication defect, not a cosmetic nuisance.

## Friction 7 — a connector crossed an unrelated persisted-state node

At 1280px width, the GRPO-to-optimizer connector geometrically crossed the `policy θt+1` persisted-state node.

The line still reached the correct endpoint, so a source-only review might have called it fine. Visually, however, it suggested that the GRPO signal directly entered or passed through the persisted result.

The topology was changed to make the intended sequence explicit:

```text
OPD ----\
         -> optimizer -> θt+1
GRPO ---/
```

rather than letting a diagonal signal line run through the next-policy card.

Durable lesson:

> Connector geometry is part of semantic correctness. A line that crosses an unrelated node can create a false responsibility or dataflow even when its endpoints are correct.

## Friction 8 — WebKit mobile exposed CJK density that Chromium did not reject

The Stage-1 responsibility explanation passed earlier checks but WebKit at 390px classified one Chinese paragraph as too narrow: too few CJK characters per rendered line across too many lines.

The wrong fixes would have been:

- shrink the font;
- lower the readability threshold;
- add overflow suppression.

The better fix split one dense explanation into two responsibility-local sentences:

```text
SEED/verl-agent owns prompt/history/action projection.
Princeton WebAgentTextEnv executes the action and returns observation/score.
```

This improved both readability and conceptual separation.

Durable lesson:

> When a technical paragraph is too dense on mobile, first split it along real semantic boundaries. Do not make the typography smaller to preserve a sentence that is carrying too many responsibilities.

## Friction 9 — the full cross-browser gate exposed an unrelated pre-existing Quick View failure

The final repository-wide UI matrix later failed on a WebKit paper-detail Quick View test unrelated to the SEED route.

The failure was stable enough that it could not be dismissed as a one-off timeout. But changing unrelated product code inside the SEED PR would have expanded scope without evidence.

The decisive diagnostic was differential reproduction:

```text
run exact failing WebKit test on candidate
-> FAIL

run the same test, same runner/config, on untouched origin/main
-> same FAIL
```

This established that the Quick View failure was a pre-existing baseline defect, not a regression introduced by the SEED responsibility-topology change.

The release evidence then remained explicit:

- full repo matrix had a known base-existing blocker;
- the changed SEED surface still required its own focused Chromium + WebKit acceptance;
- that focused matrix passed;
- the unrelated bug was not silently “fixed” or hidden in this PR.

Durable lesson:

> When a large gate fails outside the changed surface, compare candidate vs intended base under the same test/runner before expanding scope. Same failure on base is evidence of a pre-existing blocker, not permission to call the full gate green.

Also preserve the coupling caveat: if the current change touched a shared primitive that can plausibly affect the failing surface, base reproduction alone is not enough; investigate the shared path.

## Friction 10 — `main` moved after the candidate had been validated

Before the final Preview push, the branch was one commit behind `origin/main`.

Because the branch still had uncommitted changes and no branch-specific commit, the safe path was to synchronize the base first, restore the candidate tree, and then rerun the deploy-relevant acceptance on that exact tree.

The important reasoning step was not “always rebase.” It was:

```text
refresh main
-> measure behind/ahead state
-> inspect whether intervening change overlaps materially
-> synchronize if required
-> revalidate exact candidate
```

Durable lesson:

> Acceptance belongs to a tree, not to a remembered branch state. Refresh the intended base before provider-triggering publication and classify material overlap rather than blindly trusting an earlier local green run.

## Friction 11 — Preview READY was necessary but not visual acceptance

The exact-head commit intentionally included `[vercel-preview]`, producing one Vercel Preview for PR #309.

The provider metadata was checked for:

- project;
- branch;
- exact commit SHA;
- PR identity;
- deployment state.

After READY, the protected hosted routes were inspected as real pages in:

- Chinese desktop light;
- Chinese 390px mobile dark;
- English desktop light.

The hosted checks verified the actual responsibility terms were rendered and that the page had no horizontal overflow.

Durable lesson:

```text
Vercel READY
!=
requested page visually accepted
```

Provider metadata proves what was built. Real-route inspection proves what the reader receives.

Do not persist temporary Vercel share/access tokens in repository or PR text.

## Friction 12 — using a stronger local tool for repository-only documentation was unnecessary

At the end of the conversation, the owner asked to deposit the lessons into the repository. The initial instinct was to continue through Remote Desktop Commander because a local checkout was already available.

The owner correctly pointed out that this was unnecessary.

The documentation task was GitHub-owned state and did not require:

- uncommitted local-only files;
- WebKit execution;
- a local binary environment;
- a device service;
- any user-device-only evidence.

The correct tool boundary is already owned by `current/project-agent-operating-principles.md`:

```text
GitHub state -> GitHub connector
Vercel state -> Vercel connector
user device -> only when local-only state materially matters
```

Durable lesson:

> Do not keep using a stronger execution surface merely because it was useful earlier in the same conversation. Re-evaluate tool scope when the task changes phase.

A browser-validation phase can legitimately need a local supported WebKit runner; a later docs-only deposition phase usually does not.

## Friction 13 — long release work needs state-based status, not activity-based status

The owner asked “现在卡在哪里了？” during the release sequence.

A useful answer named the exact remaining transition:

```text
code/visual work complete
+ focused browser acceptance complete
+ exact-head Preview READY and inspected
+ PR open and mergeable
-> remaining: merge -> Production -> stable-route verification
```

This is much more actionable than “still testing” or “waiting on Vercel.”

Durable status model:

```text
source understanding
-> implementation
-> focused tests
-> required local gate
-> base synchronization
-> branch/PR publication
-> exact-head Preview READY
-> Preview route accepted
-> mergeable
-> merged main
-> Production READY
-> stable public route verified
```

## Successful pattern 1 — trace responsibilities before drawing boxes

The strongest change was not CSS. It was turning a software call chain into a responsibility model first.

The implementation then followed that model:

```text
MODEL
-> HARNESS
<-> ENVIRONMENT
-> EVIDENCE
-> ANALYZER / LEARNING SIGNAL
-> PERSISTED STATE
```

This order prevents the visual from deciding the architecture by accident.

## Successful pattern 2 — make stable and changing boundaries visually different

Stage 1 and Stage 2 both use the same WebShop interaction contract. What changes is primarily:

- analyzer ownership;
- training/update path;
- current policy parameters.

The corrected page therefore reuses the harness/environment boundary across stages rather than redrawing two unrelated “rollout” boxes.

That makes the key method transition visible:

```text
Stage 1: external GLM hindsight bootstrap
Stage 2: same policy self-analyzes and updates itself
```

while preserving the benchmark interaction layer.

## Successful pattern 3 — synchronize every owner surface of the same scientific fact

The responsibility correction was applied to:

- page lede;
- interactive figure;
- Stage-1 header and pipeline;
- Stage-2 divider;
- static explanatory sections;
- training/inference strip;
- semantic unit tests;
- browser layout regression.

This is stronger than adding one correct note beside one incorrect picture.

## Successful pattern 4 — encode the scientific distinction in tests, not only prose

The semantic regression checks now protect terms such as:

- `POLICY MODEL`;
- `Qwen2.5-3B-Instruct`;
- `SEED / verl-agent HARNESS`;
- `PRINCETON WEBSHOP ENVIRONMENT`;
- `WebAgentTextEnv`;
- `<think>` / `<action>`;
- `webshop_projection`;
- `EXTERNAL OFFLINE ANALYZER`;
- “neither collects trajectories nor scores WebShop reward”;
- `FIXED BENCHMARK INTERACTION CONTRACT`.

The browser regression additionally protects **relative geometry**: policy, harness, environment, and sealed evidence must remain visibly separated across desktop and mobile.

Durable lesson:

> For scientific diagrams, protect both semantic presence and visual responsibility separation. DOM existence alone cannot prove the reader sees the intended topology.

## Successful pattern 5 — use focused failures as design feedback, not mere blockers

Each browser failure revealed a real class of hidden visual debt:

```text
collapsed prose
-> stale CSS topology owner

scrollWidth overflow
-> long technical labels / arrow geometry

connector crossing node
-> misleading signal topology

WebKit mobile CJK density
-> explanation carrying too many responsibilities
```

The useful response was to fix the semantic/layout cause, not weaken the gate.

## Successful pattern 6 — focused iteration, then broad acceptance

The efficient loop was:

```text
specific failure
-> focused reproduction
-> targeted fix
-> focused re-check
```

Only the final candidate needed the expensive broad gates.

When the broad matrix revealed an unrelated base-existing failure, differential reproduction prevented the task from turning into an uncontrolled whole-site bugfix.

## Successful pattern 7 — preserve provider build budget with one intentional Preview

The branch was not pushed repeatedly during visual iteration.

The accepted path was:

```text
local/source iteration
-> final candidate acceptance
-> synchronize current main
-> one atomic commit with [vercel-preview]
-> one push
-> one exact-head Preview
```

This preserved the repository's Vercel build-budget contract and kept provider state easy to reason about.

## Successful pattern 8 — knowledge deposition should reuse existing owners

This retrospective is historical evidence, not a new governance layer.

The durable rules already have owners:

| Lesson | Current owner |
|---|---|
| semantic diagrams externalize real operations/responsibilities | `research-explainer-page-standard.md`, `human-thinking-web-expression-contract.md` |
| visual/browser acceptance, geometry, CJK, connector failures | `ui-change-visual-acceptance-gate.md` |
| candidate-vs-base failure classification | `ui-change-visual-acceptance-gate.md` Section 10 plus the scenario trigger |
| narrowest tool surface | `project-agent-operating-principles.md` |
| exact-tree acceptance / base movement | `website-engineering-standard.md`, `release-closeout-protocol.md` |
| Preview/Production provider boundaries | `deployment-policy.md`, `hosting-architecture.md` |

The task router should point future SEED/visual work here only when the trigger matches.

## Reusable SOP for future method/responsibility-diagram changes

```text
1. Start with the scientific/software question, not the existing figure.
2. Resolve method semantics from paper/appendix and runtime ownership from released code.
3. Trace who builds prompt/history, who parses/projects actions, who executes environment transitions, who returns score, who seals evidence, who analyzes, who updates, and what persists.
4. Refuse false binary ownership when the system is layered; label both wrapper and underlying environment.
5. Write the responsibility chain in plain text before changing HTML/CSS.
6. Audit the whole route for same-level semantics: lede, canonical figure, sibling stages, static prose, training/inference summaries.
7. Give model, harness, environment, evidence, analyzer, signal/update, and persisted state distinct visual roles.
8. Reuse stable boundaries across stages when the underlying interaction contract stays fixed.
9. Add semantic tests for the exact scientific distinction that motivated the change.
10. Add/extend browser tests for relative visual separation when topology itself matters.
11. During iteration, run the smallest focused test that reproduces the current failure.
12. If prose collapses, inspect computed grid/flex ownership before changing typography.
13. If required content clips, fix layout/wrapping instead of hiding overflow.
14. If a connector crosses an unrelated node, repair the route/topology rather than accepting endpoint-only correctness.
15. On mobile density failures, split copy along real semantic boundaries before shrinking text.
16. Run the required broad UI gate on the final candidate tree.
17. If the broad gate fails outside the changed surface, reproduce the exact failure on the intended base with the same runner/config before expanding scope.
18. Do not call a base-existing blocker green; report it separately and still prove the changed surface with focused acceptance.
19. Refresh current main before provider-triggering publication and classify intervening semantic overlap.
20. Batch the coherent source change into one provider-triggering push when possible.
21. Confirm Vercel metadata points to the intended exact head.
22. Inspect the real protected Preview route in representative locale/theme/viewport combinations.
23. Keep READY, visual acceptance, merge, Production READY, and stable-route verification as separate states.
24. When the task phase changes, re-evaluate tool scope; cloud-owned docs/repository state should stay on GitHub when no local-only evidence is needed.
25. Deposit reusable lessons into existing current owners plus one well-indexed history case, not a new parallel policy stack.
```

## Trigger for future Agents

Read this case after current policy when one or more of these cues appear:

- a method diagram says “rollout” without showing who owns prompt/history/action parsing versus environment transition;
- a benchmark framework wraps an upstream environment and the discussion asks which side “really owns the harness”;
- SEED WebShop is being reproduced and prompt/parser/harness identity may differ from Princeton WebShop environment identity;
- Stage 1 and Stage 2 use visually different interaction boxes even though the benchmark interaction contract is supposed to stay fixed;
- model, harness, environment, evidence, signal, and persisted state are all rendered as equivalent cards;
- a new diagram works in source but desktop prose collapses into narrow rails;
- required explanatory cards have `scrollWidth > clientWidth`;
- connectors cross unrelated nodes and visually imply the wrong dataflow;
- Chromium passes but WebKit/mobile CJK readability fails;
- a broad UI gate fails on a route apparently unrelated to the change;
- the right question is whether that failure also exists on the intended base;
- `main` moves after validation but before Preview/merge;
- Preview is READY but the exact route has not been visually inspected;
- a later documentation-only phase is about to use Remote Desktop / local shell even though GitHub owns all required state;
- a status update risks saying only “still testing” instead of naming the current release transition.

## Boundaries and refresh cues

- This record describes the released-code responsibility model resolved during the 2026-08-28 audit. If SEED/verl-agent/WebShop code changes, re-trace the current call chain before treating the exact implementation names as timeless.
- The PR/deployment identities above are historical coordinates, not current release authority.
- Do not infer current Production state from this document; read GitHub/Vercel live state.
- Do not infer current OpenEvo experimental state from this document; read `mykcs/openevo-experiment` and the current scientific-state owners.
- The provider/tool workflow here is subordinate to current repository policies if those policies later change.
