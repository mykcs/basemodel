# 2026-08-27 SEED GLM Stage-1, brand-asset, and release retrospective

Status: **historical case record**. This document preserves reusable lessons from the full 2026-08-27 conversation that corrected the SEED explainer, released it, corrected the GLM icon, and then deposited the resulting workflow knowledge. It does not override `docs/agents/current/*`, executable repository truth, live GitHub/Vercel state, or current scientific authority.

## Scope

The work began as a scientific-content correction on `/research/seed-openevo/seed/`: the main page described SEED Stage 2 well, but the canonical visual mainline had effectively erased Stage 1 and therefore did not show the external GLM-5.2 bootstrap that creates hindsight-skill supervision before self-evolving training begins.

The task then became a broader UI/release case:

- Stage 1 had to be restored without breaking the existing Stage-2 interaction model;
- the page had to distinguish GLM hindsight annotation, GRPO reward, and OPD probability-shift signals;
- a model icon had to represent GLM-5.2 correctly;
- the first icon choice was wrong;
- the owner supplied a screenshot of the intended Z mark and explicitly said not to generate an image;
- the release had to survive moving `main`, long browser gates, an unrelated WebKit flake, Vercel Preview authentication, and concurrent local work;
- a later overlapping PR solved the logo problem more cleanly with the official first-party asset, so the local follow-up was intentionally abandoned rather than duplicated.

The scientific correction shipped in PR #296 (`fix(research): show SEED GLM-5.2 bootstrap stage`). The brand-asset correction shipped in PR #297 (`fix(research): use official GLM logo`). The initial retrospective/routing update shipped in PR #299.

## Scientific result that must remain explicit

The central correction was not cosmetic.

SEED has three signal roles that are easy to collapse into one vague “scoring” story:

```text
Stage 1 external GLM-5.2
-> reads completed WebShop episodes
-> generates hindsight-skill annotations
-> 180 tasks × 8 rollouts = 1,440 completed trajectories
-> filtered hindsight records
-> 3-epoch SFT
-> bootstrapped policy θ0

Stage 2 current policy
-> acts on-policy
-> analyzes its own completed episode
-> re-scores the same sampled actions under plain vs skill context
-> OPD from probability shift
-> GRPO from environment outcome / relative reward
-> joint policy update
```

Therefore:

- **GLM-5.2 is not the WebShop reward scorer.**
- WebShop/environment outcome is the GRPO reward signal.
- The same sampled action under two contexts supplies the OPD probability-shift signal.
- External GLM-5.2 is a Stage-1 bootstrap teacher.
- Stage 2 uses the current checkpoint as actor and hindsight analyzer; external GLM-5.2 is no longer continuously called in that loop.

A page can be locally correct about Stage 2 and still be globally wrong about the method if it presents Stage 2 as though it were the whole algorithm.

## Friction 1 — the canonical figure erased the bootstrap stage

The repository already contained accurate Stage-1 details in supporting text, including `180 × 8 = 1,440`, external GLM-5.2 hindsight generation, and 3-epoch SFT. The main interactive figure, however, started at the Stage-2 policy loop.

That created a reader-level falsehood without requiring any single Stage-2 sentence to be false.

Durable lesson:

> Method completeness must be audited at the owner figure/lede level, not inferred from whether some deeper note contains the missing stage.

For multi-stage research methods, inspect at least:

```text
route lede
-> canonical/main figure
-> stage cards or explanatory prose
-> interaction narration
-> semantic regression tests
```

If the canonical figure starts after a bootstrap, pretraining, teacher, filtering, data-construction, or initialization stage, either label that omission explicitly or restore the missing stage.

## Friction 2 — “GLM is involved” was close to the truth but easy to narrate incorrectly

The owner correctly remembered that GLM-5.2 was involved in SEED and described it loosely as “scoring.” A superficial implementation could have turned that into “GLM scores WebShop trajectories/rewards.”

That would have been scientifically wrong.

The correct separation is:

```text
GLM-5.2 -> hindsight-skill annotation in Stage 1
WebShop/environment -> outcome / reward signal for GRPO in Stage 2
dual-context probability shift -> OPD signal in Stage 2
```

Durable lesson:

> When a model participates in a training pipeline, name the exact artifact/signal it produces and the stage where it is consumed. “Teacher,” “scorer,” “reward model,” “analyzer,” and “evaluator” are not interchangeable labels.

## Friction 3 — “add a model icon” was treated as permission to invent a brand mark

The first implementation added an abstract star-like inline SVG for GLM-5.2. It was visually harmless, but semantically weak: the owner expected the recognizable Z.ai/GLM identity, not a generic symbol for “model.”

This exposed an important distinction:

```text
generic semantic icon
!= recognizable model/provider identity
```

When a node represents a named external model/provider, an invented pictogram should not silently substitute for an available first-party mark.

The better default is:

1. identify whether the visual is semantic/decorative or brand/entity identity;
2. if it is brand/entity identity, search the first-party repository/site/brand source;
3. prefer an official asset whose provenance can be recorded;
4. pin immutable upstream content or vendor it according to repository policy;
5. verify the rendered mark actually matches the intended identity.

PR #297 used the Z.ai / GLM-5 repository logo pinned to an immutable upstream commit rather than keeping the custom star.

## Friction 4 — a user-supplied icon reference was misclassified as an image-generation request

The owner supplied a screenshot of the desired Z icon and explicitly repeated that no image should be generated. The conversation nevertheless briefly invoked an image-generation path.

This was a task-classification error, not a visual-design disagreement.

The supplied image was an **implementation input/reference for a website asset**, not a request to create new media.

Durable rule:

```text
user supplies screenshot/logo/icon + asks to use it in the website
-> classify as repository/UI asset work
-> do not synthesize or restyle media unless explicitly requested
```

If the user asks to “use this icon,” distinguish three cases:

- exact supplied pixels;
- the recognizable brand/entity identity represented by the reference;
- a newly created or transformed derivative visual.

Only the third case is inherently a generation/editing task.

An explicit negative instruction such as “不要生成图片” must override any generic tendency to interpret the presence of an image as an image-generation task.

## Friction 5 — ad-hoc binary transfer created avoidable risk

During the attempted screenshot-PNG path, binary data was moved through manual base64 chunks and local shell commands. That introduced several failure modes:

- shell syntax differed between fish and zsh;
- a decode command initially produced an empty file;
- repeated partial writes made truncation/corruption possible;
- binary equivalence had to be recovered by hashing.

The eventual official SVG path made that entire workflow unnecessary.

Durable rule:

> Do not turn binary UI assets into hand-assembled text streams when a first-party immutable asset or a binary-safe repository/file path exists.

When an exact user-supplied binary really must be used:

```text
binary-safe transfer
-> verify type and dimensions
-> verify hash when identity matters
-> render it in the real component
```

Do not infer success merely because an `<img>` path exists.

## Friction 6 — Desktop Commander was useful, but not intrinsically required

The first release used Remote Desktop Commander for local Git/worktree operations, exact-head cross-browser tests, and real browser inspection. Those capabilities were useful, especially for WebKit and local Playwright.

But the repository and provider mutations themselves were GitHub/Vercel-owned state.

The correct boundary remains:

```text
GitHub state -> GitHub connector
Vercel state -> Vercel connector
user device -> local/remote-desktop tool only when local-only execution materially matters
```

A website task is not “a Desktop Commander task” merely because a local shell can perform Git operations conveniently.

Use the stronger user-device surface only when it buys something real, such as:

- uncommitted local state;
- a local-only browser/runtime;
- WebKit on a supported local runner;
- a device service;
- a reproduction that exists only on that machine.

A later documentation-only follow-up was completed entirely through GitHub without Desktop Commander or a manufactured Vercel Preview. That is the desired proof that the narrower cloud-side path is sufficient when the task is cloud-owned.

## Friction 7 — local shell choice and dependency layout created environment noise

Two local environment problems appeared during follow-up work:

1. a command written for one shell failed under fish syntax;
2. an isolated worktree reused dependencies through a path/symlink arrangement that caused Vite to reject `@fs/...` imports outside the allowed root, producing 403s and hydration failures.

Neither problem demonstrated a defect in the production SEED page.

Durable lesson:

> Local execution errors must be classified before they are allowed to mutate the product hypothesis.

In particular:

```text
shell/parser mismatch
symlink/root-policy failure
missing local dependency
broken dev-only hydration path
```

are environment evidence until the same failure is reproduced in the supported build/runtime path.

A partially broken dev server can still be useful for a narrowly scoped static rendering check, but it must not be reported as a full-app browser PASS.

## Friction 8 — a full UI gate exposed an unrelated WebKit flake

One exact-head `npm run preflight:ui` attempt reached WebKit test 137 and failed because an existing paper-detail Quick View dialog did not become visible within five seconds. The changed SEED/GLM surface was not implicated.

The correct response was not to waive the failure.

The diagnostic sequence that worked was:

```text
classify the failing surface
-> rerun the exact failing WebKit test repeatedly in isolation
-> observe repeated passes
-> rerun the complete required 180-test matrix
-> require the full matrix to pass
```

The second full run passed 180/180 across Chromium + WebKit.

Durable rule:

> An unrelated flaky failure can be diagnosed separately, but release evidence still needs a complete required gate on the accepted tree.

A retry is diagnostic evidence; a complete green matrix is release evidence.

## Friction 9 — expensive global gates can be wasted if used as the editing loop

The Stage-1 figure required several iterative fixes:

- mobile CJK narration was too narrow;
- small labels had insufficient light-theme contrast;
- the dense desktop five-column row clipped horizontally;
- arrow geometry contributed to audited scroll width.

Running the full global matrix after every microchange would have been wasteful.

The better pattern was:

```text
focused semantic/layout test for the changed failure
-> fix
-> focused re-check
-> full `preflight:ui` only for the final candidate tree
```

The repository blast-radius classifier still required the complete final matrix because shared/global explainer CSS changed. “Small visual change” is not a reason to skip the final gate when executable policy classifies the blast radius as global.

## Friction 10 — long browser gates competed with other local work

During a rebase-exact preflight, another worktree on the same Mac was also running many Playwright workers. The test matrix became unusually slow.

The correct response was to inspect process state, recognize shared-machine contention, and avoid killing the unrelated task. The current run continued with conservative concurrency.

Durable rule:

```text
slow test
!= failing test
!= stuck test
```

Before an expensive local gate, inspect relevant running workloads when practical. Use isolated worktrees/ports, reduce workers if contention is real, and do not terminate unrelated user/Agent work merely to make the current task faster.

## Friction 11 — monitoring timeouts and vanished sessions are not command failures

Remote monitoring itself occasionally timed out or lost the original terminal session while the underlying test process continued.

In one case, the durable Playwright `.last-run.json` state later showed:

```text
status: passed
failedTests: []
```

This is a useful distinction:

```text
monitoring channel state
!= child process state
!= test result state
```

Durable rule:

> Never declare a long-running command failed or “stuck” solely because a remote read timed out, a terminal session disappeared, or no new lines arrived for a while.

Confirm one or more of:

- child PID still running;
- process exit status;
- durable runner artifact;
- final test summary;
- provider build/deployment state.

## Friction 12 — `main` moved repeatedly during long acceptance runs

Because the browser matrix took several minutes, `main` advanced while work was in progress.

Three materially different cases occurred.

### Case A: unrelated main movement before push

When new main commits did not touch the eight SEED files, the correct action was:

```text
fetch latest main
-> compare changed paths and semantics
-> rebase/sync
-> rerun the exact-head required gate
```

### Case B: unrelated base movement after Preview acceptance

After the branch was pushed, `main` advanced again with a Vercel routing fix. The PR remained mergeable and the new base did not overlap the SEED scientific/UI change.

The correct action was **not** an endless rebase loop. Instead:

```text
inspect the new base change
-> confirm no semantic overlap
-> confirm PR mergeability
-> merge
-> let Production validate the merged main tree
```

Acceptance belongs to an exact tree, but “base moved” only invalidates evidence when the movement is materially relevant to the changed behavior.

### Case C: semantically overlapping main movement

Later, while preparing the Z-icon follow-up, `main` advanced with PR #297 and changed the exact same three files for the exact same purpose: replace the custom GLM symbol with the official logo.

At that point, blindly rebasing and pushing another PR would have created duplicate work.

The correct action was:

```text
inspect the new main diff
-> compare intent and rendered result
-> confirm the merged solution is equal or better
-> verify Production
-> discard the superseded local branch/worktree
```

Durable rule:

> “Main moved” is not automatically a rebase command. First classify semantic overlap and materiality.

If the new main state already solves the requested problem better, stop competing with it.

## Friction 13 — protected Preview access can fail at the alias layer even when the deployment is healthy

The branch Preview reached `READY`, but opening a protected branch alias with one share/access flow redirected to the Vercel login page instead of the target route.

Using the deployment-specific URL with Vercel’s access mechanism succeeded and allowed the real page to be inspected.

Durable lesson:

> `READY` plus “a browser opened something” is not enough for protected Preview acceptance.

Verify:

```text
expected deployment identity
+ expected page path
+ expected application content
+ not an auth/login/interstitial page
```

When an alias/share flow behaves unexpectedly, prefer the immutable deployment identity for diagnosis before changing product code.

## Friction 14 — status communication can become vague during long release pipelines

The owner asked “现在卡到哪里了？” while a long sequence of sync, browser gates, branch push, Preview, merge, and Production work was happening.

The useful status report was not “还在测试.” It named the exact state:

```text
code complete
+ latest Playwright evidence passed
+ worktree clean
+ branch not pushed yet
+ main moved again
-> remaining transition: sync latest main, publish, Preview accept, merge
```

Durable rule:

> For long release work, report the current state transition, not a vague activity label.

Use a compact state model:

```text
source
-> focused tests
-> full local gate
-> branch pushed
-> Preview READY
-> Preview accepted
-> PR mergeable
-> merged main
-> Production READY
-> stable public route verified
```

This makes “stuck,” “running,” and “done” precise.

## Successful pattern 1 — restore the missing stage before refining the loop

The final canonical SEED explainer teaches two distinct stages:

```text
Stage 1 · HINDSIGHT-SKILL SFT
Stage 2 · SELF-EVOLVING OPD + GRPO
```

The Stage-1 row makes the external teacher, trajectory count, annotation transform, SFT, and bootstrapped policy visible before the Stage-2 loop.

This fixes the reader’s mental model rather than adding another footnote.

## Successful pattern 2 — separate annotation, reward, and probability-shift signals everywhere

The corrected page uses the same distinction in multiple owner surfaces:

- top lede;
- main figure;
- Stage-1 card;
- Stage-2 narration;
- “奖励与 hindsight skill” explanation;
- semantic regression tests.

This matters because the shorthand “GLM scores trajectories” is close enough to sound plausible while still being scientifically wrong.

The stronger pattern is:

```text
name the producer
+ name the artifact/signal
+ name the stage where it is used
+ state what it is not when confusion is likely
```

## Successful pattern 3 — the visual fix kept scientific structure and UI geometry aligned

The Stage-1 figure was not accepted merely because the new nodes existed. The implementation was adjusted until the scientific structure also survived real layout constraints.

The fixes included:

- shortening Stage-2 mobile narration rather than squeezing the typography;
- using stronger semantic text tokens to recover contrast;
- changing the desktop Stage-1 flow layout rather than shrinking content below useful size;
- removing/adjusting arrow geometry that contributed to horizontal clipping.

Durable lesson:

> A scientific figure is only useful when the reader can actually parse it at the required viewport/theme. Geometry, contrast, and overflow are part of scientific communication quality.

## Successful pattern 4 — semantic tests protected the mechanism, not just the DOM

The focused SEED explainer test asserted terms such as:

- `STAGE 1 · HINDSIGHT-SKILL SFT`;
- `EXTERNAL TEACHER`;
- `GLM-5.2`;
- `180 tasks × 8 rollouts`;
- `1,440 completed trajectories`;
- `3-epoch SFT`;
- `not the WebShop reward scorer`;
- `STAGE 2 · SELF-EVOLVING OPD + GRPO`.

That is stronger than testing only for a CSS class or component mount. It protects the scientific distinction that motivated the UI change.

The later logo correction also protected the asset choice by asserting the official first-party logo source and rejecting the retired custom-inline-SVG path.

## Successful pattern 5 — first-party immutable brand provenance beat both custom drawing and screenshot extraction

The final logo solution did not require generated media and did not require converting a screenshot into a permanent site asset.

PR #297 references the official GLM-5 repository logo at a pinned upstream commit:

```text
zai-org/GLM-5
@ 414ad9eb891b05b5d7d51d573939bfe9ce538223
resources/logo.svg
```

The rendered Production node was then inspected in a browser to confirm it was the intended Z mark.

This gives two different forms of evidence:

```text
provenance evidence -> this is the first-party asset
visual evidence      -> this rendered mark matches the intended identity
```

Do not substitute one for the other.

## Successful pattern 6 — exact supplied pixels and brand identity were finally separated correctly

The owner’s screenshot was useful as a visual specification. The final implementation did not need to preserve the screenshot bytes because the real intent was the recognizable Z brand identity and a first-party source existed.

That distinction avoided locking a screenshot-derived raster artifact into the repository when a better canonical asset was available.

Future boundary:

- if the owner explicitly requires exact pixels, preserve the supplied binary through a binary-safe path;
- if the owner requires the recognizable brand identity, prefer the official asset when it visually matches;
- if the official asset differs materially from the supplied reference, surface the discrepancy instead of silently choosing.

## Successful pattern 7 — protected Preview and Production were checked as real pages

The Preview deployment was protected by Vercel Authentication. The workflow ultimately opened the actual deployment-specific page in a browser instead of equating `READY` with “the page looks right.”

Checks included:

- desktop light;
- 390px mobile dark;
- Stage 1 present;
- GLM icon present;
- `1,440` present;
- `3-epoch SFT` present;
- “not reward scorer” distinction present;
- Stage 2 present;
- no horizontal overflow;
- no framework error overlay.

After merge, Production ran its hosted Chromium UI gate and lab browser gate, reached READY, and the stable public route was opened again.

Keep these states separate:

```text
source edited
!= focused test pass
!= local cross-browser gate pass
!= Preview READY
!= Preview visually accepted
!= PR merged
!= Production READY
!= stable public URL verified
```

## Successful pattern 8 — local and hosted browser evidence complemented rather than duplicated each other

The final local gate covered the repository-required 180-test Chromium + WebKit matrix. Production then ran its own hosted Chromium acceptance and lab browser gate.

These were not redundant copies of the same claim:

```text
local supported runner -> cross-browser evidence, including WebKit
Vercel hosted gate     -> exact hosted/Production Chromium behavior
Production page check  -> stable public route actually serves the intended content
```

Keeping those scopes distinct avoids both false confidence and needless duplication.

## Successful pattern 9 — isolated worktrees reduced local concurrency risk

When local execution was genuinely useful, a dedicated worktree isolated the change from other Agents and long-running local work.

This was especially useful because other tasks were simultaneously using the same Mac and because `main` moved frequently.

A worktree is not a substitute for refreshing remote state, but it prevents unrelated local branch/checkouts from contaminating one another.

Pair it with unique ports and explicit process ownership.

## Successful pattern 10 — the release respected the repository’s provider-write budget

The branch was not pushed until the coherent source change and required local gate were ready. That avoided turning Vercel Preview into the editing loop.

The preferred sequence remained:

```text
edit locally / assemble coherently
-> focused checks during iteration
-> final exact-head full gate
-> one branch push
-> one Preview
-> browser acceptance
-> merge
-> one Production deployment
```

This is especially important in a repository where deployment-triggering writes consume real provider/build budget.

## Successful pattern 11 — overlap discovery prevented a duplicate logo PR

While a local screenshot-derived icon follow-up was being prepared, PR #297 landed on `main` with a better first-party-logo solution.

The correct response was to inspect and accept the superior merged solution, not to insist on shipping already-superseded local work.

This is a key Agent behavior:

> Ownership of a task does not imply ownership of a particular implementation. If current shared state already solves the request better, verify it and stop.

## Successful pattern 12 — cleanup removed superseded local work instead of leaving ambiguous debt

After the official-logo solution on `main` was verified, the temporary worktree/branch used for the alternative PNG path was deleted rather than left as an ambiguous future candidate.

This preserved one clear implementation owner and reduced the chance that a later Agent would revive stale screenshot-derived work.

## Successful pattern 13 — knowledge deposition followed the repository lifecycle

The reusable experience was not dumped into an arbitrary notes folder.

The final knowledge placement used the repository’s existing lifecycle:

```text
completed incident/workflow case -> docs/agents/history/
durable cross-task rule          -> existing current owner
future discoverability           -> docs/agents/README.md task route
```

The explicit “user-supplied screenshot/logo/icon is not an automatic generation request” rule was added to the current website engineering standard. The broader local concurrency/monitoring rule was added to the current Agent operating principles. The full narrative remains historical evidence.

## Reusable SOP for future research-page + brand-asset changes

```text
1. Resolve the exact scientific role from source/evidence before editing the figure.
2. Audit whether the canonical lede/figure contains every method stage needed for the reader’s mental model.
3. Separate external annotation, environment reward, and probability-derived learning signals.
4. If the owner supplies a screenshot/logo/icon, classify it as an implementation reference unless they explicitly ask to create/edit media.
5. Decide whether the asset means exact supplied pixels or recognizable brand/entity identity.
6. For brand identity, prefer a first-party official asset; pin immutable upstream content or vendor it according to current repository policy.
7. For exact supplied binaries, use a binary-safe path and verify type/dimensions/hash where appropriate.
8. Render the actual mark in the real component; do not trust filename/provenance alone.
9. Add semantic regression coverage for the scientific distinction and asset identity that motivated the change.
10. During iteration, use focused tests for the specific failure instead of repeatedly paying the global gate cost.
11. Before the final local gate, inspect relevant concurrent workloads when the machine is shared; use an isolated worktree and unique ports.
12. Run `preflight:ui:plan`, then the exact required final UI gate for the accepted tree.
13. If a browser test flakes, isolate it diagnostically, then still require a complete green required matrix before release.
14. If a monitoring tool times out, confirm process/result state before declaring failure or stuckness.
15. Before any provider-triggering ref update or merge, refresh `main` and classify semantic overlap/materiality.
16. If a new overlapping PR already solves the task better, adopt/verify it instead of creating a competing release.
17. Verify protected Preview against the expected deployment and page content, not an auth/interstitial page.
18. Verify representative themes/viewports on the real Preview.
19. Merge with current head/base identity, wait for Production READY, then verify the stable public route.
20. Report progress using explicit release states rather than vague “still testing” language.
21. Clean superseded local worktrees/branches, browser sessions, and temporary access artifacts that belong to the task.
22. Deposit only reusable lessons: historical case in `history/`, durable rule in an existing `current/` owner, route it from the existing Agent index.
```

## Trigger for future Agents

Load this case after current policies when any of these are true:

- a research figure starts at Stage 2 while a teacher/bootstrap/data-construction stage exists elsewhere;
- GLM-5.2 is described as a scorer/reward model without distinguishing hindsight annotation from GRPO/OPD;
- a user supplies a screenshot/logo/icon and asks for that identity to appear in the website;
- the user explicitly says not to generate/edit an image but the task includes an image attachment;
- an Agent is about to invent a logo-like symbol for a named model/provider;
- binary UI assets are about to be shuttled through ad-hoc base64/shell text paths;
- a local dev-server/worktree failure may actually be shell/root/symlink/dependency-environment noise;
- a cross-browser gate fails on an apparently unrelated pre-existing interaction;
- a long test appears stuck while another worktree is consuming browser/CPU resources;
- a remote monitoring session times out or disappears while the child process may still be running;
- `main` moves during a long acceptance run;
- another PR lands on the same files while a local fix is still being prepared;
- a protected Preview is `READY` but the browser lands on login/SSO instead of the application;
- Preview/Production is READY but the requested visual has not been inspected in a real browser;
- a progress report risks saying only “still testing” instead of naming the current release state.

Current owners for the durable rules are:

- `docs/agents/current/website-engineering-standard.md` — asset intent/provenance, exact-tree acceptance, provider-write and stopping rules;
- `docs/agents/current/project-agent-operating-principles.md` — narrowest execution surface, concurrent local work, monitoring-vs-execution evidence, and durable-knowledge deposition;
- `docs/agents/current/ui-change-visual-acceptance-gate.md` — required browser matrix and UI acceptance;
- `docs/agents/current/release-closeout-protocol.md` — exact-head merge and Production closeout;
- `docs/agents/current/product-and-research-integrity.md` plus the SEED research owners — scientific completeness and claim boundaries.
