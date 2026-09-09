# OpenEVO briefing × preference-learning execution retrospective — 2026-09-09

Status: **historical evidence, not current authority**

This retrospective records the failure mechanisms exposed while turning a long OpenEVO research conversation into an advisor-facing HTML briefing and, more importantly, while making direct owner feedback affect the *next first draft* instead of merely accumulating in a case library.

Current rules live in root `AGENTS.md` and `docs/agents/current/*`. Dated PRs, SHAs, Preview URLs, worktree paths, process IDs, deployment states, and experiment-progress snapshots mentioned in the original conversation are historical evidence only. They must not be treated as current authority.

## 1. Retention classification

### A — long-term durable rules

Promote only rules that should still hold across future BaseModel work:

- refresh remote authority before mutating shared Git/CI state;
- after a timed-out mutation, read remote state before retrying;
- choose the execution surface by the fastest safe path, not by ideology;
- use an explicit Bash outer shell when Bash syntax matters;
- treat engineering validity as a prerequisite, not automatically as a scientific contribution;
- bind visual/preference evidence to the exact final artifact, not an earlier candidate;
- let explicit owner instructions outrank generic reviewer preferences;
- learn feedback by failure mechanism, not by copying a rejected token or surface style;
- run preference retrieval before the first substantial user-facing draft and preference-aware evaluation before owner review;
- use rendered screenshots/geometry for visual acceptance; CSS intent is not visual evidence.

These rules belong in current policy owners. They are not re-owned by this retrospective.

### B — project-level OpenEVO / research-publication experience

Keep these as project-scoped scientific lessons:

- a longer WebShop horizon can be a clean null result rather than proof that the harness is broken;
- simply increasing Text Memory capacity is not equivalent to changing its scientific organization;
- a zero TaskVector caused by identical anchors is an identifiability failure, not a causal null;
- changing the treatment/control definition in the middle of a frozen causal comparison creates a new experiment identity;
- GDR admission count and SD-LoRA training opportunities are different scientific objects;
- SEED paper scores and local OpenEVO panels must not be turned into a causal win/loss when protocols differ;
- main presentation pages should carry only the technical depth required to understand the scientific argument; detailed derivations and reproducibility proof belong in progressive disclosure / technical notes.

The dated OpenEVO masterplans and experiment repository remain the authority for exact experimental lineage.

### C — temporary state deliberately not promoted

Do **not** preserve as rules:

- current PR head/base SHAs;
- current mergeability or CI status;
- transient Vercel Preview/share URLs;
- current PID / local dev-server ports;
- current worktree paths;
- current provider queue ownership;
- current experiment round, percent complete, or GPU occupancy.

They may appear in historical evidence when necessary to explain an incident, but a future Agent must refresh them live.

This conversation did not perform material shared-GPU/server mutation. Therefore it produced **no new GPU ownership or server cleanup rule**; existing server/GPU policies remain the owner.

## 2. Repeated-correction priority: what happened more than once

| Failure family | What happened | Why it recurred | Durable defense |
|---|---|---|---|
| Engineering proof presented as research highlight | measurement validity, fixed-GPU determinism, SHA/recovery, and a standalone “results are trustworthy and fast” slide repeatedly occupied the main story | the Agent tried to *prove diligence* explicitly instead of assuming competent engineering and showing scientific judgment | mainline engineering detail is allowed only when it changes scientific interpretation or eligibility; implementation proof moves to technical depth |
| AI-like/internal-language copy | defense-first negation, `closeout`, `successor`, `OpenEVO · SEED × WebShop`, `AGENDA / RESULTS / MECHANISM`, hanging numbers such as `44 → 7` | cases were learned as words, not as the underlying attention/decode tax | ask what the reader must decode; explain the concrete object on first use; no-value internal labels are a hard failure family |
| Attention overload followed by over-correction | dense card walls were rejected, then an over-minimal sterile page lost the useful color/structure, then decorative bubbles reintroduced visual competition | “cards bad” was over-generalized into “density bad”; “soft slides better” was over-generalized into a visual template | preserve pairwise preference trajectory and Silver/Golden distinction; reduce competing centers, not useful information |
| Research briefing became status taxonomy | early versions read like a project update; later `Ceiling → Mechanism → Control` was better but still weaker than the actual scientific sequence | the Agent organized by repository/module taxonomy instead of how questions changed | when negative tests and pivots are the contribution, prefer `question → hypothesis → experiment → outcome → next question` |
| Engineering/visual evidence went stale after later edits | screenshots/receipts were generated, then scientific authority or CSS changed | evidence was treated as attached to “the task” rather than the exact tree | material user-visible/scientific changes invalidate old screenshot/review evidence; re-render and bind to final SHA |
| Moving main / concurrent branch contamination | main moved repeatedly; an active briefing PR temporarily accumulated unrelated navigation/AppLayout work | chat context implied a stable branch while multiple Agents were mutating the repository | refresh live base/head and changed-file scope before destructive rewrites; preserve unrelated remote work on a recovery ref before separation |
| Focused tests mistaken for completion | page-specific tests passed while hosted/full gates later caught an unused variable and a forbidden `!important` | local focused checks were treated as the acceptance contract | run the live final repository gate on the exact final tree; fix source problems rather than weakening the gate |
| Generic reviewer suggestions conflicted with explicit owner requirements | a cold reader suggested removing agenda/TLDR and final decision framing even though the owner had explicitly required both | reviewer output was treated as authority rather than evidence | record an intentional owner override; generic reviewer guidance cannot silently delete explicit owner requirements |

## 3. Engineering failure mechanisms and defensive rules

### 3.1 Moving refs and concurrent work: a branch is not a private lock

**What happened.** Main advanced repeatedly during the briefing work. At one point the briefing PR also contained navigation/AppLayout/StudyOverview commits created by another flow.

**Why.** The hidden assumption was that “the branch I am discussing” remains semantically owned by this one task. In a multi-Agent repository, branch names and chat context do not provide exclusivity.

**Pre-action check.** Before force-push, rebase, merge, or scope cleanup:

1. refresh live `origin/main` and the remote PR head;
2. compare changed filenames and commit ancestry;
3. classify new commits as same task, compatible independent task, or contamination;
4. preserve any unrelated remote work on a recoverable ref before rewriting.

**Defensive rule.** Destructive branch cleanup requires recoverability first and `--force-with-lease` / expected-head guards afterward.

**Counterexample.** “The conflicts are tiny, so rebasing the whole branch is harmless” can silently retain or overwrite unrelated authority changes even when Git reports no textual conflict.

### 3.2 A timed-out mutation may already have succeeded

**What happened.** Git HTTPS push appeared to hang/timeout, but a later remote read showed that GitHub had already accepted the commit.

**Why.** Transport timeout was confused with remote transaction failure.

**Pre-action check.** After any write timeout, read the remote ref/resource and compare the expected object before retrying.

**Defensive rule.** `timeout != mutation failed` until durable remote state says so.

**Counterexample.** Immediately retrying a file write or branch update can duplicate commits, invalidate exact-head evidence, or create a misleading second failure.

This rule is already promoted to the current operating principles and root bootstrap; this incident is supporting history.

### 3.3 Shell dialect is part of the execution environment

**What happened.** This project has repeatedly encountered Fish/Bash friction. The conversation continued to use complex heredocs/compound commands while the user environment defaults to Fish in some interactive paths.

**Why.** An inner `bash -lc` was historically treated as enough even when outer parsing had already happened.

**Pre-action check.** If syntax uses Bash assignment, `set -euo pipefail`, arrays, loops, heredocs, process substitution, or complex quoting, explicitly choose `/bin/bash` as the execution shell or move logic into a standalone Bash/Python script.

**Defensive rule.** Shell grammar must be explicit before mutation.

**Counterexample.** A parser error before any mutation is not evidence of repository/server corruption.

This was already documented before this retrospective; its recurrence shows why the rule belongs at bootstrap rather than only in a deep incident file.

### 3.4 RDC / one transport is an accelerator, not the authority

**What happened.** The remote Mac disconnected temporarily; Git smart-HTTP had transient failures; protected Preview fetches could hit SSO/cookie limitations. Work could continue through GitHub/Vercel APIs.

**Why.** Tool reachability was at risk of being conflated with resource health or authorization.

**Pre-action check.** Separate four questions: is the execution host reachable, did the child process finish, is the remote repository/provider reachable through another authenticated surface, and is the resource itself healthy?

**Defensive rule.** Switch surfaces when the task semantics permit; do not “repair” credentials/provider config because one transport failed.

**Counterexample.** A `curl` timeout from the Agent host does not prove the deployed route is down when provider deployment metadata and hosted browser gates are green.

### 3.5 Current CI/deployment governance must be read live

**What happened.** During this conversation the Vercel gate architecture itself changed. Early ad-hoc gate aliases and manual trigger attempts became obsolete after the repository gained the persistent `ci/vercel-gate-base` / `ci/vercel-gate-final` workflow and helper script.

**Why.** A recent chat instruction was reused after `main` had changed the governance contract.

**Pre-action check.** Before requesting provider execution, read current deployment policy/scripts and live required status controls.

**Defensive rule.** CI/deployment topology is mutable authority; old chat recipes are never enough.

**Counterexample.** Creating another “almost equivalent” Vercel gate ref can consume quota without producing the required status and can collide with the shared persistent gate.

**Historical note.** Ad-hoc gate alias strategies used earlier in this conversation are superseded. Current deployment docs/scripts own the mechanism.

### 3.6 Focused PASS is evidence, not final acceptance

**What happened.** The briefing-specific suite passed while the full/hosted contract later rejected an unused `gdrHref` and a new `!important`.

**Why.** The Agent stopped at the layer it had just edited instead of the repository acceptance layer.

**Pre-action check.** Identify the exact current merge/provider contract, then run it on the final tree after all content/style changes.

**Defensive rule.** Never weaken a cross-repo invariant to protect a page change. Remove the dead variable; fix CSS specificity structurally.

**Counterexample.** `page test + build = green` is insufficient when architecture, accessibility, human-feedback, or browser gates are required.

### 3.7 Brittle copy tests: preserve semantic invariants, not stale wording

**What happened.** Several tests failed because they asserted old headings/sentences after the briefing was intentionally rewritten.

**Why.** The literal string was mistaken for the policy it once represented.

**Pre-action check.** For every failed copy assertion ask: does this token encode a scientific/reader invariant, or only an old phrasing?

**Defensive rule.** Update incidental wording assertions when the new copy preserves or strengthens the contract; keep fail-closed assertions for scientific boundaries such as “no final winner” or metric identity.

**Counterexample.** Reverting correct reader-facing copy just to satisfy a stale literal test preserves test debt, not safety.

### 3.8 Screenshots are the truth for visual composition

**What happened.** CSS declared soft colors/circles, yet the screenshot barely showed them; one page-number pill stretched; another page number moved because a generic `position: relative` overrode absolute positioning; later scientific text caused vertical overflow.

**Why.** Implementation intent was used as a proxy for rendered perception.

**Pre-action check.** Render at the declared target geometry, measure overflow, and inspect the actual first attention center after every material content/layout change.

**Defensive rule.** DOM/CSS tests can prove structure; only rendered evidence can prove composition.

**Counterexample.** “The pseudo-element exists and has a pastel background” does not prove the audience can see it or that it is helpful.

### 3.9 Temporary visual evidence must not leak into the product diff

**What happened.** Internal candidate screenshots were necessary for comparison, but they were not intended product assets.

**Why.** Local evidence and shipped assets share the same filesystem and can be accidentally staged.

**Pre-action check.** Audit changed filenames before push; explicitly classify screenshot evidence as canonical reference vs disposable local receipt.

**Defensive rule.** Internal selection artifacts remain out of the product commit unless the repository intentionally promotes them into a visual reference set.

### 3.10 Capability discovery must stay read-only

**What happened.** During this retrospective closeout itself, the Agent mistakenly called a GitHub `create_file` action on a deliberately nonexistent branch while trying to confirm the available mutation surface. GitHub returned 404 and no repository object was created, but the probe still violated the repository's existing read-before-write rule.

**Why.** Tool-schema discovery and capability confirmation were allowed to drift into an execution action even though a read-only discovery path (`list_resources` / existing tool schema) was available.

**Pre-action check.** Before any provider write, ask whether the same capability/question can be answered by tool discovery, list/search/fetch, schema inspection, or dry-run/local construction.

**Defensive rule.** Never use a write endpoint merely to test whether a connector/tool works. A failed write with no residue is still a workflow defect and should be disclosed. Root `AGENTS.md` already owns this rule; this section is historical evidence of recurrence, not a new authority.

**Counterexample.** `create a harmless probe file and delete it if it works` is not harmless on Git-connected repositories: it can trigger CI/deployments, leave audit residue, or race with concurrent work.

## 4. Scientific/reasoning failure mechanisms

### 4.1 Engineering validity is a prerequisite, not automatically a contribution

**What happened.** The owner repeatedly rejected main-deck emphasis on “先证明测量是真的”, fixed-GPU determinism, SHA/recovery, and a standalone “我怎么保证：结果可信，而且推进得快” slide.

**Why.** The Agent tried to demonstrate quality by narrating engineering diligence. For an advisor audience, competent engineering is assumed; spending slide time on it can make the research appear shallow.

**Missing distinction.** There are two different objects:

1. implementation proof that a run is trustworthy;
2. a scientific consequence that changes what the result means.

**Pre-action check.** Ask: if this engineering fact disappeared from the slide, would the scientific interpretation change?

**Defensive rule.** Put engineering proof in technical notes/progressive disclosure unless it changes interpretation, eligibility, or causal validity.

**Counterexample.** A measurement fix that changes `Task Score` while complete success stays unchanged *does* support a scientific distinction between partial progress and exact completion; the scientific consequence belongs in the main story, while hash/plumbing details do not.

### 4.2 Research briefing should expose judgment, not repository taxonomy

**What happened.** Early versions read like project status. `Ceiling → Mechanism → Control` improved the structure, but the owner ultimately preferred the real research sequence: low 7B result → 1.7B/3B → negative horizon/capacity tests → bounded redesign → GDR admission problem → DirectApply question.

**Why.** The Agent organized information by modules/workstreams rather than by how evidence changed the next hypothesis.

**Pre-action check.** Identify the strongest negative tests and pivots. Ask what belief each experiment ruled out.

**Defensive rule.** When the scientific contribution is iterative diagnosis, structure the talk as `question → hypothesis → controlled test → outcome → next question`.

**Counterexample.** A clean three-column workstream taxonomy can look organized while hiding the actual reasoning quality the advisor is evaluating.

### 4.3 Numbers require measured objects, units, and referents

**What happened.** Bare `49.33 / 58/128` and `44 → 7` were confusing.

**Why.** Internal familiarity made the denominator/object seem obvious.

**Pre-action check.** On first occurrence, name what is measured, the denominator/unit, and the scientific meaning.

**Defensive rule.** Prefer `Task Score 49.33 / 100` and `complete success 58 / 128 tasks`; prefer “44 SD-LoRA update candidates, 7 admitted into the continuing model” over a hanging transition.

**Counterexample.** A shorter title is not clearer when the reader must search elsewhere to discover what the numbers count.

### 4.4 Experiment inventory must come from authority, not the current page

**What happened.** A result summary initially omitted the 3B experiment line; the owner had to remind the Agent it existed.

**Why.** The visible page/current narrative was treated as an inventory of all experiment families.

**Pre-action check.** Before an “all experiments” table or chronology, query the project authority/lineage for model families and completed/pending arms.

**Defensive rule.** Page visibility is publication state, not experiment inventory authority.

**Counterexample.** Filling a missing 3B final score from memory would be worse than leaving an em dash if no exact terminal metric has been verified.

### 4.5 Negative tests are research results

Project-specific examples from this conversation:

- extending WebShop from 15 to 30 steps did not improve the targeted result, rejecting the simple “horizon too short” explanation;
- increasing Text Memory capacity from 2048 to 4096 did not resolve the issue, so the next move was not another arbitrary capacity increase;
- the later bounded 10+10 organization represented a different hypothesis from “more memory is enough”.

**Rule.** Preserve clean nulls and the explanation they reject. Do not bury them as failed engineering attempts.

### 4.6 TaskVector identifiability: zero vector is not a causal null

**What happened.** Original anchor selection could map two percentage labels to the same accepted parameter state, yielding a zero difference vector.

**Why.** Percentage/round labels were mistaken for guaranteed distinct states.

**Pre-action check.** Verify the selected anchors correspond to distinct parameter states before interpreting vector magnitude/direction.

**Defensive rule.** Identifiability must be established before causal intervention. Rebuild using distinct states (historically R14/R27/R49 in this project) and norm-matched random controls.

**Counterexample.** Reporting “TaskVector had no effect” from a zero vector created by identical anchors would convert a design failure into a false causal conclusion.

### 4.7 Experiment identity cannot be edited midstream for convenience

**What happened.** A tempting recovery path was to continue an old GDR-vs-DirectApply comparison after changing the treatment definition.

**Why.** Same starting checkpoint was mistaken for same causal experiment.

**Pre-action check.** Ask whether treatment set, control, frozen seeds/order, admission semantics, or primary hypothesis changed.

**Defensive rule.** A causal-contract change creates a new experiment identity from the same frozen start; preserve the old lineage and do not rewrite old rounds.

**Counterexample.** “The state is the same, so we can resume with the improved treatment” is operationally convenient and scientifically wrong when it changes the question being estimated.

### 4.8 GDR admission and SD-LoRA training are different scientific objects

**What happened.** “7 updates” could be heard as “SD-LoRA only trained seven times”. The actual issue was that many update candidates/opportunities were produced, while Gated Delta Rule admitted only a small subset into the continuing model.

**Pre-action check.** Distinguish candidate generation, gate decision, and application into persistent model state.

**Defensive rule.** Explain GDR on first use and label counts by lifecycle stage.

**Counterexample.** A concise `44 → 7` title can accidentally imply 37 training failures instead of a conservative admission mechanism.

### 4.9 SEED paper values and local OpenEVO values need visible comparability boundaries

**What happened.** A paper-style table put SEED and OpenEVO scores side by side, creating a risk that the reader would read them as a 40-point causal deficit before seeing the caveat.

**Why.** Table alignment visually implies comparability even when prose later denies it.

**Pre-action check.** Confirm task panel, evaluation protocol, temperature, seeds, and metric semantics before any cross-source conclusion.

**Defensive rule.** If protocols differ, put the non-comparability boundary *before or beside* the table, not in low-weight footnotes.

**Counterexample.** Side-by-side values are allowed for orientation, but they are not evidence that OpenEVO lost to SEED under a matched treatment.

### 4.10 Main slide vs technical subpage is a scientific communication boundary

**What happened.** The owner wanted a simple TaskVector formula and technical signal in the talk, but not a full Gram/Frobenius derivation, SHA proof, recovery rules, or complete causal-registration machinery on the slides.

**Why.** “More rigorous” was conflated with “show more machinery in the first layer”.

**Pre-action check.** Ask whether the audience needs a detail to follow the claim or only to audit/reproduce it.

**Defensive rule.** Keep the minimal mechanism/formula required to understand the scientific object on the main slide; move derivation, exact gates, hashes, recovery, and reproducibility proof to a linked technical page.

**Counterexample.** Removing all formulas to reduce cognitive load would destroy the actual mechanism evidence; progressive disclosure is not anti-technical minimalism.

### 4.11 A projected deck keeps one 16:9 composition, but phone display still fits the viewport

**What happened.** The briefing needed to remain recognizably slide-like across devices. A first attempt kept the literal 1280×720 canvas on phones and forced horizontal dragging; a later attempt reflowed the slide internals like a normal article. The owner's final correction was more precise: keep the same 16:9 composition, scale the whole slide to iPhone width, and let the reader zoom manually if they want detail.

**Why.** “Preserve slide identity” and “fit a phone” are not opposites. The mistake was changing either the artifact's internal composition or the reader's default navigation burden instead of changing only display scale.

**Defensive rule.** A route explicitly declared as a projected deck may keep one capped 16:9 composition. On narrow screens, scale that whole composition to the viewport width with no page-level horizontal scroll; do not silently reflow its internal hierarchy into a long page. This exception does not weaken the normal responsive contract for ordinary research pages.

**Counterexample.** Copying fixed-deck behavior to Results/Study pages, or making an iPhone user horizontally drag a 1280px canvas, are both role errors.

## 5. Human-preference learning: why the old case-library approach failed

The most important meta-failure was **not lack of feedback data**. The owner had already supplied repeated, high-quality feedback. The failure was that the evidence did not reliably affect generation and evaluation.

### Failure 1 — evidence lived too deep

A historical case may describe a lesson perfectly while the next Agent never loads it before drafting.

**Correction.** Promote cross-task invariants to a current owner / root trigger; history remains rationale.

### Failure 2 — rules were too surface-specific

`avoid card walls`, `avoid this English title`, or `use more whitespace` can be copied without learning the mechanism.

**Correction.** Store the failure family (`attention tax`, `author-internal decode`, `competing centers`) plus anti-overgeneralization boundaries.

### Failure 3 — feedback did not bind generation-time context

Passive case storage let the next first draft start from generic Agent aesthetics.

**Correction.** Material user-facing work generates a task-time Preference Brief *before* the first substantial draft.

### Failure 4 — feedback did not bind evaluation-time context

A generic reviewer could approve a draft that repeated a known owner failure.

**Correction.** Candidate receipts, hard failure families, blind Phase A, preference-aware Phase B, and owner review are distinct gates.

### Failure 5 — binary accepted/rejected collapsed “better but not approved”

This encouraged overlearning from “好多了”.

**Correction.** Preserve `rejected / better / promising / accepted / canonical`, Preference Trajectories, and Silver vs Golden visual references.

### Failure 6 — visual learning was reduced to prose

The relationship between versions was lost; future Agents reproduced individual adjectives instead of visual hierarchy.

**Correction.** Keep screenshots or reconstructable refs for meaningful visual comparisons; internal variants are not Golden unless the owner explicitly promotes them.

### Failure 7 — repeated corrections were not escalated at use site

A rule could exist without proof that it had actually been checked before the next affected action.

**Correction.** `REPEAT-CORRECTION` and failure-family severity require a use-site witness/check, not merely a retrospective link.

## 6. Owner instruction vs generic reviewer

During the preference cold read, generic review suggested removing the agenda/TLDR and the final advisor-choice framing. Both contradicted explicit owner requirements.

**Durable precedence:**

```text
explicit current owner instruction
> task-specific accepted/canonical preference
> scoped repeated preference model
> generic reviewer heuristic
> Agent taste
```

When a generic reviewer conflicts with an explicit owner requirement:

1. mark the finding as an **intentional owner override**, not as a silent reviewer failure;
2. preserve any independent valid concern (for example terminology friction or information weight);
3. do not delete the owner-required object merely to obtain a generic-review PASS.

This rule is promoted into the current preference-learning owner by this closeout.

## 7. Exact-artifact evidence and invalidation

Preference selection is not valid forever after one screenshot.

A material change includes:

- scientific authority / result / caveat changed;
- information hierarchy changed;
- layout/composition/style changed enough to alter attention;
- new/removed content changes slide/page geometry.

After a material change, regenerate rendered evidence and rerun the relevant cold-read/preference comparison. Bind the final receipt to the final Git SHA / artifact identity.

A small non-semantic mechanical fix (for example deleting an unused variable) may use a lighter revalidation only if the current contract explicitly allows it; it still must not leave a receipt pointing at the wrong tree.

## 8. Superseded historical approaches

The following approaches occurred historically but are **not current authority**:

- “case library alone” as the human-preference system — superseded by Preference Learning V2;
- treating “better” feedback as implicit approval — superseded by non-binary verdicts and Silver/Golden tiers;
- ad-hoc Vercel final-gate aliases/manual gate invention — superseded by current deployment policy/helper;
- literal 1280px phone canvas **and** later phone-internal reflow for the dedicated briefing deck — both superseded by whole-slide 16:9 scale-to-viewport with no horizontal scroll; normal site responsiveness remains current elsewhere;
- standalone engineering-rigor/quality/speed slides as research contributions — superseded by science-first narrative plus technical depth;
- continuing a causal comparison after changing the treatment definition — superseded by preserving old lineage and creating a new experiment identity.

Do not erase these from history; their failure is the evidence for the current rules.

## 9. What future Agents should do before a similar task

### Before writing

- read root `AGENTS.md` and this repo's current task bundle;
- resolve live scientific authority instead of trusting the website/chat recap;
- generate the task-time Preference Brief;
- inventory all experiment families before claiming a comprehensive table/chronology;
- decide the artifact role: normal responsive research page vs explicit projected deck;
- write a one-sentence scientific story as question/evidence pivots before designing screens.

### Before showing the owner

- generate 2–3 internal candidates when the work is materially visual;
- compare rendered screenshots, not CSS plans;
- run blind Phase A and preference-aware Phase B;
- classify reviewer recommendations against explicit owner requirements;
- confirm metric objects/units/referents and visible scientific caveats;
- move audit/reproduction machinery to technical depth unless it changes interpretation.

### Before pushing/claiming complete

- refresh main + remote head + changed-file scope;
- preserve unrelated concurrent work before any history rewrite;
- run the exact current repository acceptance suite, not only focused tests;
- if base governance changed, re-run under the new contract even when product files do not overlap;
- after any timeout, read durable remote state before retrying;
- verify receipts/screenshots/provider evidence refer to the final exact tree;
- audit that temporary screenshots, local logs, ports, and worktree artifacts are not in the product diff.

## 10. Current authority map

Read these **before** this retrospective when acting:

- `AGENTS.md` — bootstrap invariants and repeated-correction trigger;
- `docs/agents/current/project-agent-operating-principles.md` — execution/tool/concurrency/A-B-C retention rules;
- `docs/agents/current/human-preference-learning-system.md` — generation-time and evaluation-time preference loop;
- `docs/agents/current/research-site-presentation-contract.md` — scientific vs implementation depth boundary;
- `docs/agents/current/seed-openevo-research-mission-first-principles.md` and live `mykcs/openevo-experiment` authority — current research truth;
- `docs/agents/current/openevo-successor-exploration-report-masterplan-2026-09-04.md` — dated project-level diagnostic lineage where still referenced by current owners;
- current deployment/branch policies — live CI/provider topology.

## 11. Closeout: information intentionally not retained

This document intentionally omits as durable facts:

- the final live PR/branch status from the conversation;
- exact Preview/share URLs;
- current provider queue state;
- current PIDs and local ports;
- current worktree names/paths;
- current experiment round/progress/GPU occupancy.

Future Agents must query those live. Their omission is deliberate evidence-lifetime hygiene, not an incomplete retrospective.
