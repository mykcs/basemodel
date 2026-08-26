# SEED × OpenEvo Results / source-faithful 128-task integration retrospective — 2026-08-26

Status: **historical retrospective / reusable Agent case, not current authority**

Use this file when a future Agent is updating the SEED × OpenEvo Results surface, reconciling experiment evidence with website copy, exposing teacher-facing evidence, debugging Vercel acceptance, or integrating overlapping Results PRs.

Current policy and scientific truth still win. Before acting, refresh:

- `docs/agents/LATEST.md`
- `docs/agents/current/seed-openevo-results-reader-contract.md`
- `docs/agents/current/scientific-state-provenance.md`
- `docs/agents/current/experiment-result-publication-workflow.md`
- `docs/agents/current/deployment-policy.md`
- the live/immutable evidence in `mykcs/openevo-experiment`

This retrospective records what happened during one conversation and why particular recovery patterns worked. Do **not** copy its time-sensitive status words (`PREPARED`, `pending`, PR numbers, deployment state) into a future Results edit without refreshing current truth.

---

## 1. Executive summary

The work began as a simple question: **the experiment repository had new evidence; did the website Results page need updating?**

The answer turned into a cross-repository provenance and release problem.

The key scientific change was not a new BASE-vs-OpenEvo score. It was a correction to the identity of the supposedly source-faithful 128-task WebShop validation panel:

1. an earlier historical 128-task comparison had already produced an interpretable repaired result, but that panel was only **SEED-compatible**, not source-faithful;
2. a successor Track A tried to reconstruct one precisely defined 128-task validation call from pinned SEED public code;
3. the first source-faithful manifest passed deterministic rebuild checks but was later found to miss one real SEED runtime semantic: `SimServer` re-seeds Python `random` with `worker_seed` after synthetic-goal construction and before `random.shuffle(self.goals)`;
4. that omission changed every shuffled goal ordering and therefore every instruction identity;
5. the old manifest was superseded and a corrected manifest was materialized;
6. the corrected state returned to fail-closed `PREPARED`, with `formal_task_consumption_allowed=false`, pending authoritative `WebshopWorker` runtime semantic validation at `128/128`;
7. therefore no new source-faithful BASE-vs-SD scientific outcome could be published yet.

The website also had to change its narrative from:

> “next we need to rebuild the 128 tasks”

into:

> “the 128 tasks were rebuilt, the first reconstruction was invalidated by a stricter runtime-semantic audit, a corrected immutable manifest now exists, and runtime 128/128 validation must pass before formal comparison is released.”

A second product requirement emerged during the conversation: the owner wanted a **teacher-facing one-click artifact**. The best answer was not a prose report but an immutable GitHub link to the actual corrected 128-task manifest.

At the same time, release work exposed three non-scientific frictions:

- Vercel’s GitHub status initially looked like a build-rate-limit-only problem, but an earlier real deployment had in fact executed and failed repository tests;
- several of those failures were stale test ownership assumptions that forced transient details into `LATEST.md`, contrary to the repository’s newer documentation architecture;
- another open PR was editing the same Results surface with valuable claim-level provenance work but older, pre-correction Track A evidence.

The successful closeout pattern was:

```text
refresh experiment truth
-> distinguish historical result from current execution/task-identity state
-> pin corrected evidence to an immutable experiment SHA
-> expose the 128-task manifest as a reader-visible artifact
-> keep scientific claim boundaries explicit
-> repair stale tests against their true policy owners
-> detect overlapping PRs
-> create one explicit integration head preserving both histories
-> close superseded worker PRs
-> refuse merge until exact-head Vercel Gate/build/Preview actually executes
```

---

## 2. Scientific state discovered during the work

### 2.1 Historical repaired PRIMARY-v2 remained the latest interpretable completed comparison

The 2026-08-25 historical campaign had three evidence layers.

The strict first measurement was invalid because the formal SEED parser expected `<action>...</action>` while model output could drift to `[action]...[/action]`. This caused valid WebShop commands to be projected incorrectly and produced apparent zero scores for both arms.

After repairing the action-wrapper measurement path under the same contract for both arms, the historical frozen panel gave:

- BASE task score: `4.1`
- BASE exact success: `0.0%`
- frozen SD-LoRA task score: `7.3`
- frozen SD-LoRA exact success: `2.3%`
- paired mean delta: `+3.15` score×100
- bootstrap 95% CI: `[-0.65, +7.19]`
- positive / tie / negative task pairs: `11 / 114 / 3`

The confidence interval crossed zero. The correct claim was therefore:

> positive direction / interesting signal, **not a stable win**.

This historical result did **not** change during the conversation.

### 2.2 The historical 128-task panel was not source-faithful

The historical panel came from the right SEED held-out number range, but later source-code auditing showed that numeric `session_index` alone was not a complete task identity.

The released code’s validation semantics include, among other things:

- validation base seed;
- ordered session draw;
- per-slot worker seed;
- worker-specific goal ordering;
- resulting natural-language instruction;
- underlying data identity.

Therefore:

```text
“same goal/session number range”
!= “same semantic task”
```

This distinction must be preserved in product copy.

### 2.3 The first source-faithful manifest was itself superseded

The most important new experiment-side correction was recorded at:

`mykcs/openevo-experiment@af89bb5c39aeab8aaa04eed57585c91e5598a968`

The pinned SEED runtime path re-seeds Python `random` with `worker_seed` after synthetic goals are constructed and before `random.shuffle(self.goals)`.

The earlier builder omitted that second reseed. As a result:

- the shuffled goal order differed;
- the selected goal differed;
- the rendered instruction identity differed;
- the supposedly source-faithful old panel was not actually source-faithful.

The old manifest therefore had to be marked superseded rather than silently reused.

### 2.4 Corrected 128-task artifact

The corrected immutable manifest used during this work is:

https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968/configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json

This file is important because it is not merely a claim that “128 tasks were generated.” It directly records the panel, including per-slot task identity information such as:

- slot;
- worker seed;
- session index;
- instruction;
- instruction hash;
- data identity / provenance fields.

That made it the best artifact for a teacher-facing “show me the actual 128 tasks” link.

### 2.5 What the corrected manifest did **not** prove

At the close of this conversation, the corrected manifest was still bounded by:

- activation state: `PREPARED`;
- `formal_task_consumption_allowed=false`;
- next fail-closed gate: authoritative `WebshopWorker` runtime semantic validation at `128/128`;
- no new source-faithful BASE-vs-SD result.

The panel also must not be described as the exact paper-final 128 behind SEED’s reported `89.7 / 78.1%`, because public information does not uniquely identify the paper-final validation ordinal and checkpoint.

Use three distinct claims:

1. released SEED code defines validation size as 128;
2. with code/data/seeds/validation ordinal fixed, one specified validation’s 128 semantic tasks can be mechanically reconstructed;
3. the exact paper-final 128 behind the reported table is not uniquely recoverable from public information.

---

## 3. Friction: website state lagged behind experiment truth

The Results page was scientifically reasonable but operationally stale.

### 3.1 Hero still described reconstruction as future work

The first-screen summary said the next action was to rebuild 128 source-faithful task slots.

By the time of this conversation, that was no longer the right state. Reconstruction had happened, an additional semantic bug had been found, and a corrected manifest existed.

The necessary narrative transition was:

```text
old page:
“rebuild the source-faithful 128”

current truth during this work:
“the 128 were rebuilt, the first manifest was superseded after a reseed-semantic correction,
 and the corrected panel now awaits 128/128 authoritative runtime validation”
```

### 3.2 Q7 still represented an older lifecycle state

Q7 had previously said the source-faithful successor was still effectively design-only / pending construction.

That became misleading after panel materialization.

The corrected reader-facing state needed to say:

- panel construction exists;
- first manifest was invalidated;
- corrected panel exists;
- formal evaluation remains fail-closed;
- no new scientific outcome exists.

### 3.3 Next Steps also needed to advance one state transition

The N1 step originally focused on deterministic reconstruction and matching canonical hash.

After the correction, deterministic reconstruction was no longer the current scientific bottleneck. The bottleneck moved to **runtime semantic equivalence**.

This is a reusable rule:

> A research website’s “next step” must describe the next unresolved scientific gate, not the last successful engineering step.

### 3.4 Reader contract / handoff drift mattered too

A website can be visually correct while its Agent-facing contract remains stale. That creates a high probability that the next Agent will “fix” the page back to an older scientific state.

During this work, one existing reader-contract snapshot still described a previously authorized/executing state that had been superseded by the newer manifest correction.

The repair pattern was to add/refresh an explicit current-state authority note rather than rely on conversational memory.

---

## 4. Friction: “128 tasks” was overloaded language

The phrase “the 128 tasks” referred to multiple different objects across the project:

- historical SEED-compatible frozen 128-task panel;
- source-faithful first-validation reconstruction;
- superseded pre-reseed-correction source-faithful manifest;
- corrected source-faithful manifest;
- unknown paper-final exact 128 behind 89.7 / 78.1%.

This ambiguity repeatedly threatened to collapse distinct evidence layers.

### Recovery pattern

Name the object every time the distinction matters.

Good labels:

- “historical frozen SEED-compatible 128-task panel”;
- “corrected source-faithful first-validation 128-task manifest”;
- “paper-final exact 128 — not uniquely recoverable from public information.”

Avoid bare phrases such as:

- “the official 128 tasks”;
- “the SEED 128”;
- “the paper’s 128”

unless the referent is already unambiguous in the immediate sentence.

---

## 5. Friction: evidence links can be immutable and still be wrong for the current claim

The Results page already used commit-pinned GitHub URLs, which is good. However, some pins pointed to older evidence snapshots.

An immutable link solves **drift after publication**. It does not solve **choosing the wrong historical snapshot**.

One example during this audit was the held-out campaign evidence root. The older pinned result snapshot contained earlier GPU accounting, while later experiment evidence corrected the campaign accounting.

The broader lesson:

```text
immutable != current
immutable != scientifically authoritative
```

Before publishing or refreshing a pinned link:

1. identify the exact claim;
2. find the latest authoritative evidence supporting that claim;
3. then freeze that evidence with an immutable SHA.

Do not simply keep an old SHA because it is already immutable.

---

## 6. Success: teacher-facing evidence should point to the artifact, not only the explanation

The owner asked for a link they could click while reporting to a teacher and say, in effect:

> “You can see the exact 128 tasks here.”

The best solution was a visible callout on the Results page, not a buried evidence link.

The callout design used the following hierarchy:

```text
Current frozen 128-task panel
-> short explanation of what the JSON contains
-> explicit caveat that runtime 128/128 validation is still pending
-> button: “View the frozen 128 tasks on GitHub”
-> immutable commit-pinned manifest URL
```

This pattern is reusable for research communication:

> When a stakeholder needs to verify a concrete object, expose the closest machine-readable artifact directly, then explain its scientific boundary nearby.

Do not force them to traverse:

```text
Results page
-> generic report
-> appendix
-> manifest directory
-> guess which file is authoritative
```

### Suggested teacher-facing explanation

A concise explanation that preserves the boundary is:

> This JSON is the corrected 128-task validation panel reconstructed from a pinned SEED public-code path and frozen seed/data semantics. Each task identity is recorded in the manifest. We still need the final 128/128 runtime-semantic validation before allowing the formal BASE-vs-OpenEvo comparison, and we do not claim these are uniquely the paper-final 128 behind SEED’s reported table.

---

## 7. Friction: Vercel status was easy to misread

At one point the GitHub status UI suggested the blocker was simply Vercel build rate limiting.

Direct provider inspection showed a more complicated history:

- an earlier deployment had actually started;
- that deployment ran `npm run verify:deploy && npm run build ...`;
- it exited with failure;
- a later exact head then hit a build-rate-limit condition and did not create a new deployment object.

Therefore two very different conditions coexisted:

```text
older deployment: real executed build failure
newer exact head: no build execution because provider rate limit prevented deployment creation
```

### Recovery pattern

Do not infer provider truth from one badge.

For every release candidate, distinguish:

- GitHub commit status;
- whether a Vercel deployment object exists;
- whether the build actually executed;
- build log result;
- deployment state;
- whether the deployment corresponds to the current exact head.

A `failure` status whose target is a rate-limit page does not prove a build failed. Conversely, a rate-limit condition on the newest head does not erase a real code/test failure observed on an older head.

---

## 8. Friction: one genuine regression was mixed with stale baseline tests

The earlier executed deployment exposed six failures.

### 8.1 One failure belonged to the Results change

The Hero label had been changed from the protected reader-contract wording “接下来 / What remains” to another label.

Existing tests correctly protected the intended first-screen language. The fix was to restore the label while keeping the new scientific content.

This was a real product/test regression.

### 8.2 Several other failures came from stale ownership assumptions

Other tests expected transient deployment/build-budget/history details to remain duplicated inside `docs/agents/LATEST.md`.

That conflicted with the newer documented architecture:

- `LATEST.md` = short current handoff/router;
- `docs/agents/current/*` = authoritative current policy;
- `docs/agents/history/*` = historical release/case evidence.

The correct repair was **not** to stuff old strings back into `LATEST.md` just to make tests green.

Instead, tests were redirected to validate the actual owner documents:

- hosting facts -> `current/hosting-architecture.md`;
- build-budget/release rules -> `current/deployment-policy.md`;
- old integration PR facts -> historical integration record;
- `LATEST.md` -> only needs to route to current authorities.

### Reusable rule

When a deterministic test fails because content moved under a newer ownership architecture:

```text
first determine whether the invariant is still valid
-> if yes, assert it against the current owner
-> if no, update the invariant
-> never weaken the gate just to obtain green status
-> never reintroduce stale architecture merely to satisfy string matching
```

---

## 9. Friction: hidden duplicate Q7 and selector/test contracts

One implementation path introduced a new current Q7 while retaining the old Q7 in the historical questions component and hiding it at the route level.

That created a subtle risk: tests or DOM selectors using generic `.question-card` counts could see both the old and new structures even if one is visually hidden.

The recovery was to avoid making the new current card look like another member of the old protected selector set.

This is a narrow but reusable UI-test lesson:

> When temporarily layering a corrected current-state component over a legacy component, ensure structural selectors and accessibility/test counts do not accidentally double-count the hidden legacy node.

Longer-term, prefer eliminating duplicate state rather than maintaining hidden parallel truths.

---

## 10. Friction: overlapping PRs carried different kinds of truth

While finishing the corrected Track A update, another open Results PR was discovered.

The two worker PRs were not simple duplicates:

- one carried the newer corrected Track A state, the reseed correction, a current Q7, the teacher-facing 128-task link, and focused current-state tests;
- another carried valuable claim-level provenance architecture across Protocol, Q1–Q6, wrapper attribution, G2, shared evidence vocabulary, and evidence UI;
- however, the provenance PR still pinned Track A source-faithful evidence to an older pre-correction snapshot.

A simple “pick one PR” decision would have thrown away useful work.

A simple merge would also have been unsafe because the scientific authority differed.

### Successful integration pattern

The work used an explicit integration head with both worker heads as parents.

The integrated result deliberately kept:

- claim-level provenance from the provenance PR;
- corrected Track A authority from the newer experiment SHA;
- teacher-facing immutable 128-task manifest link;
- fail-closed runtime-validation boundary;
- updated Agent docs/tests.

The integration commit used both worker heads as parents so their histories remained attributable.

The worker PRs were then explicitly closed as superseded by the integration PR, with notes explaining what was retained and why they must not be merged independently.

This follows the project’s intended pattern:

```text
inspect overlapping PRs
-> classify semantic ownership
-> preserve useful contributions
-> choose current scientific authority
-> build one explicit integration head
-> preserve ancestry when intentional
-> close superseded worker PRs
-> validate only the integration head
```

---

## 11. Success: fail-closed publication boundary was preserved

The most important research-integrity success was refusing to turn “task construction progress” into “scientific result progress.”

The corrected state was explicitly presented as:

```text
corrected manifest exists
+ deterministic rebuild evidence exists
+ runtime semantic validation still pending
+ formal task consumption remains disabled
= no new BASE-vs-SD outcome may be published
```

This prevented three common mistakes:

1. publishing an outcome from a run launched on a superseded manifest;
2. describing `PREPARED` task-construction evidence as an executed comparison;
3. relabeling source-faithful first-validation tasks as the paper-final exact 128.

---

## 12. Success: the website explanation was updated at two levels

The Results page needed both a beginner-readable explanation and a technical layer.

### Plain-language layer

The useful mental model was essentially:

> We built the exam paper, then discovered one rule for shuffling the questions was not exactly the same as SEED’s runtime. We threw that version away, rebuilt the paper correctly, and now we are checking that all 128 questions match the real runtime before letting BASE and OpenEvo take the exam.

### Technical layer

The technical copy recorded:

- omitted second `random.seed(worker_seed)` before shuffle;
- old manifest superseded;
- corrected manifest rematerialized;
- `PREPARED`;
- `formal_task_consumption_allowed=false`;
- next gate = authoritative `WebshopWorker` runtime semantic validation `128/128`;
- no new BASE-vs-SD scientific result.

Keeping both layers let the page remain useful to a teacher/lab reader without sacrificing auditability.

---

## 13. Success: current artifact link used an immutable SHA

The teacher-facing manifest link was pinned to:

`af89bb5c39aeab8aaa04eed57585c91e5598a968`

rather than `/blob/main/`.

This matters because the purpose of the link is to support a historical statement:

> “This is the exact corrected panel we were referring to in this report.”

A moving `main` URL would weaken that statement.

Use this rule:

- current navigation links may float when appropriate;
- evidence links supporting a specific scientific claim should normally pin to an immutable commit;
- if newer evidence later supersedes the pinned artifact, update the website claim and pin to a newer immutable snapshot rather than changing the meaning of the old link silently.

---

## 14. Success: no forced merge without exact-head acceptance

The integration PR became Git-mergeable, but the newest exact head hit Vercel build rate limiting before a new Preview deployment object was created.

The work did **not** treat these facts as equivalent:

```text
mergeable=true
!= repository Gate PASS
!= build PASS
!= exact-head Preview READY
!= changed-route acceptance
!= safe to merge
```

The PR body was updated to record that the exact head remained **NOT YET VERIFIED** and should not be merged until Vercel actually executes the required Gate/build/Preview checks.

This is preferable to “it should be fine because the previous failure was fixed.”

---

## 15. What should be reused in future Results work

### Research-state refresh checklist

Before editing Results copy:

1. refresh `mykcs/openevo-experiment` default/main authority;
2. inspect any experiment branch that claims a newer executing state;
3. compare timestamps and evidence semantics, not only branch labels;
4. prefer executable/main scientific correction over a stale branch lifecycle label;
5. distinguish result state, task-construction state, launch authorization, and execution state;
6. identify superseded manifests/receipts explicitly;
7. pin the evidence SHA only after current authority is resolved.

### Claim taxonomy checklist

For WebShop / SEED comparison copy, ask:

- Is this internal fresh-task transfer?
- historical SEED-compatible evaluation?
- source-faithful task-semantics reproduction?
- formal rerun outcome?
- paper-reported number?
- exact paper-final denominator?

Do not merge those layers.

### Teacher-facing evidence checklist

If a stakeholder asks “show me the thing itself”:

1. identify the closest primary artifact;
2. make it visible without opening a deep appendix;
3. use a descriptive label, not “source” or “JSON” alone;
4. explain what fields make the artifact meaningful;
5. state what the artifact does not prove;
6. pin the link to an immutable commit.

### Website update checklist

For current scientific-state changes:

1. update Hero first-screen summary;
2. update the specific question/answer whose status changed;
3. update Next Steps so it points at the next unresolved gate;
4. update current Agent contract/handoff if the old state would mislead another Agent;
5. update regression tests to protect the new scientific boundary;
6. keep historical completed measurements unchanged unless new evidence actually changes them.

### Release checklist

1. inspect current main;
2. search for overlapping open PRs touching the same Results surfaces;
3. classify which PR owns which scientific/product contribution;
4. integrate rather than discard useful orthogonal work;
5. preserve ancestry when the repository’s integration policy requires it;
6. close superseded worker PRs explicitly;
7. run repository Gate/build on the exact integration head;
8. verify a Vercel deployment object actually exists for that head;
9. inspect build logs rather than trusting a badge summary;
10. verify the changed Results route in Preview;
11. merge only after exact-head acceptance;
12. verify Production separately.

---

## 16. Anti-patterns exposed by this case

Do not:

- start a Results update from remembered chat state when experiment evidence has moved;
- call a correct numeric range “the same task panel” without checking task semantics;
- keep using a source-faithful manifest after a runtime-semantic correction supersedes it;
- publish a run result merely because a launch branch once said `executing-formal-run`;
- call source-faithful first-validation tasks the paper-final exact 128;
- bury the one artifact a teacher wants behind several layers of generic evidence links;
- assume an immutable evidence URL is therefore the right current evidence URL;
- infer build outcome from one Vercel/GitHub status badge;
- make `LATEST.md` a dumping ground for historical deployment details because old string tests expect them;
- fix stale tests by restoring stale architecture;
- merge overlapping Results PRs independently when they carry competing scientific authority;
- squash away deliberately preserved integration ancestry;
- merge a Git-mergeable PR whose exact-head Gate/Preview never actually executed.

---

## 17. Evidence / artifact index from this case

### Experiment authority used for the corrected 128 panel

Commit:

`af89bb5c39aeab8aaa04eed57585c91e5598a968`

Corrected 128-task manifest:

https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968/configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json

Corrected activation/release state:

https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968/configs/experiment/activations/webshop-seed-source-faithful-reproduction-v1-execution-release-v1.json

Panel builder:

https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968/scripts/openevo_webshop/build_seed_source_faithful_panel.py

Runtime validator:

https://github.com/mykcs/openevo-experiment/blob/af89bb5c39aeab8aaa04eed57585c91e5598a968/scripts/openevo_webshop/validate_seed_source_faithful_runtime.py

### Website integration work during this case

Worker PR with corrected Track A state and teacher-facing 128-task link:

https://github.com/mykcs/basemodel/pull/264

Worker PR with claim-level provenance architecture:

https://github.com/mykcs/basemodel/pull/266

Integration / release PR created to reconcile both:

https://github.com/mykcs/basemodel/pull/267

Integration head at the close of this conversation:

`ed4b108bdab1b53e104a9ac6a341ee60dfd7780f`

Again: these PR/deployment facts are historical. Refresh GitHub before using them as current status.

---

## 18. Open state at the end of this conversation

At the conversation close, the following remained unresolved:

- corrected source-faithful manifest still needed authoritative `WebshopWorker` runtime semantic validation at `128/128`;
- formal source-faithful BASE-vs-OpenEvo comparison remained blocked;
- no new source-faithful BASE-vs-SD result existed;
- the website integration PR was Git-mergeable but had not received an exact-head Vercel execution because the provider returned a build-rate-limit condition before creating a new deployment object;
- therefore the website change was not yet safe to merge or describe as Production.

Future Agents must refresh all of these before acting.

---

## 19. Durable lessons

1. **Scientific state is a moving cross-repository dependency.** Refresh experiment truth before touching publication copy.
2. **Task identity is semantic, not just numeric.** Session/goal indices can be insufficient when worker seeds alter ordering and instructions.
3. **A reproducible artifact can still reproduce the wrong semantics.** Deterministic rebuild is necessary but not sufficient; validate against the authoritative runtime path.
4. **Supersession must be explicit.** Do not silently overwrite an old manifest and pretend the evidence lineage is continuous.
5. **Separate task-construction evidence from scientific outcome evidence.** `PREPARED` is not a result.
6. **Give stakeholders direct access to the closest primary artifact.** A visible immutable manifest link is more useful than a buried generic evidence page.
7. **Immutable links still require authority selection.** Freeze the right evidence, not merely any evidence.
8. **Current website copy, Agent handoff, and tests must move together.** Otherwise the next Agent will reintroduce stale state.
9. **Tests should enforce current ownership, not accidental file placement.** Move assertions when the architecture moves; do not resurrect stale duplication.
10. **Provider status needs exact-head interpretation.** Distinguish “build executed and failed” from “deployment was never created.”
11. **Overlapping PRs need semantic integration, not first-writer-wins.** Preserve orthogonal value while choosing one current scientific authority.
12. **Close superseded worker PRs explicitly.** Ambiguous open PRs are a future release hazard.
13. **Git mergeability is weaker than product acceptance.** Do not merge without exact-head Gate/build/Preview evidence.
14. **Plain-language explanation and technical auditability can coexist.** The Results surface should offer both, in that order.
15. **Never relabel a recoverable public-code validation as the paper-final denominator without evidence.** This boundary is central to fair SEED × OpenEvo reporting.
