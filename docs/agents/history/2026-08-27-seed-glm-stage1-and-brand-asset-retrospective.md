# 2026-08-27 SEED GLM Stage-1, brand-asset, and release retrospective

Status: **historical case record**. This document preserves reusable lessons from the 2026-08-27 SEED-page correction and logo follow-up. It does not override `docs/agents/current/*`, executable repository truth, live GitHub/Vercel state, or current scientific authority.

## Scope

The task began as a scientific-content correction on `/research/seed-openevo/seed/`: the page visually described SEED Stage 2 well, but the main explainer had effectively erased Stage 1 and therefore did not show the external GLM-5.2 bootstrap that creates hindsight-skill supervision before self-evolving training begins.

The work then expanded into a UI/release case because the new Stage-1 diagram needed a model icon, the first icon choice was wrong, the owner supplied a visual reference for the desired Z mark, and the release happened while `main` and nearby PRs continued to move.

The final scientific change shipped in PR #296 (`fix(research): show SEED GLM-5.2 bootstrap stage`). The brand-asset correction then shipped in PR #297 (`fix(research): use official GLM logo`).

## Scientific result that must remain explicit

The most important correction was not cosmetic.

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
- External GLM-5.2 is a Stage-1 bootstrap teacher; Stage 2 uses the current checkpoint as actor and hindsight analyzer.

A page can be locally correct about Stage 2 and still be globally wrong about the method if it presents Stage 2 as though it were the whole algorithm.

## Friction 1 — the primary figure erased the bootstrap stage

The repository already contained accurate Stage-1 details in supporting text, including `180 × 8 = 1,440`, external GLM-5.2 hindsight generation, and 3-epoch SFT. The main interactive figure, however, started at the Stage-2 policy loop.

That created a reader-level falsehood without requiring any single Stage-2 sentence to be false.

The durable lesson is:

> Method completeness must be audited at the owner figure/lede level, not inferred from whether some deeper note contains the missing stage.

For multi-stage research methods, inspect at least:

```text
route lede
-> canonical/main figure
-> stage cards or explanatory prose
-> interaction narration
-> tests that protect the stage boundary
```

If the canonical figure starts after a bootstrap, pretraining, teacher, filtering, or data-construction stage, label that omission explicitly or restore the missing stage.

## Friction 2 — “add a model icon” was treated as permission to invent a brand mark

The first implementation added an abstract star-like inline SVG for GLM-5.2. It was visually harmless, but semantically weak: the owner expected the recognizable Z.ai/GLM identity, not a generic symbol for “model.”

This exposed an important distinction:

```text
generic semantic icon
!= recognizable model/provider identity
```

When a node represents a named external model/provider, an invented pictogram should not silently substitute for an available first-party mark.

The better default is:

1. identify whether the visual is semantic/decorative or brand/entity identity;
2. if brand/entity identity, search the first-party repository/site/brand source;
3. prefer an official asset whose provenance can be recorded;
4. pin immutable upstream content or vendor it according to repository policy;
5. verify the rendered mark actually matches the intended identity.

PR #297 used the Z.ai / GLM-5 repository logo pinned to an immutable upstream commit rather than keeping the custom star.

## Friction 3 — a user-supplied icon reference was misclassified as an image-generation request

The owner supplied a screenshot of the desired Z icon and explicitly said not to generate an image. The conversation still briefly went down an image-generation path.

This was a task-classification error, not a visual-design disagreement.

The supplied image was an **implementation input/reference for a website asset**, not a request to create new media.

Durable rule:

```text
user supplies screenshot/logo/icon + asks to use it in the website
-> classify as repository/UI asset work
-> do not synthesize or restyle media unless explicitly requested
```

If the user asks to “use this icon,” first determine whether they mean:

- exact supplied pixels;
- the identity represented by the supplied reference;
- or a new derivative visual.

Only the third case is inherently a generation/editing task.

## Friction 4 — ad-hoc binary transfer created avoidable risk

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
-> verify dimensions/type
-> verify hash when identity matters
-> render it in the real component
```

Do not infer success merely because an `<img>` path exists.

## Friction 5 — Desktop Commander was useful, but not intrinsically required

The release used Remote Desktop Commander for local Git/worktree operations, exact-head cross-browser tests, and real browser inspection. Those were useful execution capabilities, especially for WebKit and local Playwright.

But the repository and provider mutations themselves were GitHub/Vercel-owned state.

The correct boundary remains:

```text
GitHub state -> GitHub connector
Vercel state -> Vercel connector
user device -> local/remote-desktop tool only when local-only execution materially matters
```

A website task is not “a Desktop Commander task” merely because a local shell can perform Git operations conveniently.

Use the stronger user-device surface when it buys something real, such as:

- uncommitted local state;
- a local-only browser/runtime;
- WebKit on a supported local runner;
- a device service;
- a reproduction that exists only on that machine.

Otherwise prefer cloud-side repository/provider tooling.

## Friction 6 — a full UI gate exposed an unrelated WebKit flake

One exact-head `npm run preflight:ui` attempt reached WebKit test 137 and failed because an existing paper-detail Quick View dialog did not become visible within five seconds. The changed SEED/GLM surface was not implicated.

The correct response was not to waive the failure.

The sequence that worked was:

```text
classify the failing surface
-> rerun the exact failing WebKit test repeatedly in isolation
-> observe 3/3 passes
-> rerun the complete required 180-test matrix
-> require the full matrix to pass
```

The second full run passed 180/180 across Chromium + WebKit.

Durable rule:

> An unrelated flaky failure can be diagnosed separately, but release evidence still needs a complete required gate on the accepted tree.

A retry is diagnostic evidence; a complete green matrix is release evidence.

## Friction 7 — `main` moved repeatedly during long acceptance runs

Because the browser matrix took several minutes, `main` advanced while work was in progress.

Two different cases occurred and must not be treated the same way.

### Unrelated main movement

When new main commits did not touch the eight SEED files, the correct action was:

```text
fetch latest main
-> compare changed paths and semantics
-> rebase/sync
-> rerun the exact-head required gate
```

### Semantically overlapping main movement

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

> “Main moved” is not automatically a rebase command. First classify semantic overlap.

If the new main state already solves the requested problem better, stop competing with it.

## Successful pattern 1 — restore the missing stage before refining the loop

The final canonical SEED explainer now teaches two distinct stages:

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

This matters because the common shorthand “GLM scores trajectories” is close enough to sound plausible while still being scientifically wrong.

The stronger pattern is:

```text
name the producer
+ name the artifact/signal
+ name the stage where it is used
+ state what it is not when confusion is likely
```

## Successful pattern 3 — the visual fix kept scientific structure and UI geometry aligned

The new Stage-1 row initially exposed several UI issues:

- mobile CJK narration became too narrow;
- small labels fell below the desired light-theme contrast;
- the five-column desktop row clipped horizontally;
- arrow geometry contributed to audited scroll width.

These were fixed by changing layout/copy/token use rather than shrinking everything until the gate stopped complaining.

The final accepted implementation passed the required responsive/light/dark geometry checks.

Durable lesson:

> A scientific figure is not accepted merely because its nodes exist. Reader geometry, contrast, and overflow are part of whether the mechanism is actually communicated.

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

## Successful pattern 5 — first-party immutable brand provenance beat both custom drawing and screenshot extraction

The final logo solution did not require generated media and did not require converting a screenshot into a permanent site asset.

PR #297 references the official GLM-5 repository logo at a pinned upstream commit:

```text
zai-org/GLM-5
@ 414ad9eb891b05b5d7d51d573939bfe9ce538223
resources/logo.svg
```

The rendered Production node was then inspected in a browser to confirm it was the intended Z mark.

This provides both provenance and visual verification.

## Successful pattern 6 — protected Preview and Production were checked as real pages

The Preview deployment was protected by Vercel Authentication. The workflow used Vercel’s access/share mechanism and then opened the real deployment in a browser instead of equating `READY` with “the page looks right.”

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

## Successful pattern 7 — isolated worktrees reduced concurrency risk

When local execution was genuinely useful, a dedicated worktree isolated the change from other Agents and long-running local work.

This was especially useful because other tasks were simultaneously using the same Mac and because `main` was moving frequently.

A worktree is not a substitute for refreshing remote state, but it prevents unrelated local branch/checkouts from contaminating one another.

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
9. Add semantic regression coverage for the scientific distinction that motivated the change.
10. Run `preflight:ui:plan`, then the exact required UI gate for the final tree.
11. If an unrelated browser test flakes, isolate it diagnostically, then still require a complete green matrix before release.
12. Before any provider-triggering ref update or merge, refresh `main` and classify semantic overlap.
13. If a new overlapping PR already solves the task better, adopt/verify it instead of creating a competing release.
14. Verify exact-head Preview in representative themes/viewports.
15. Merge with current head/base identity, wait for Production READY, then verify the stable public route.
16. Clean superseded local worktrees/branches and temporary access artifacts.
```

## Trigger for future Agents

Load this case after current policies when any of these are true:

- a research figure starts at Stage 2 while a teacher/bootstrap/data-construction stage exists elsewhere;
- GLM-5.2 is described as a scorer/reward model without distinguishing hindsight annotation from GRPO/OPD;
- a user supplies a screenshot/logo/icon and asks for that identity to appear in the website;
- an Agent is about to invent a logo-like symbol for a named model/provider;
- binary UI assets are about to be shuttled through ad-hoc base64/shell text paths;
- a cross-browser gate fails on an apparently unrelated pre-existing interaction;
- `main` moves during a long acceptance run;
- another PR lands on the same files while a local fix is still being prepared;
- Preview/Production is READY but the requested visual has not been inspected in a real browser.

Current owners for the durable rules are:

- `docs/agents/current/website-engineering-standard.md` — asset-intent/provenance, exact-tree acceptance, provider-write and stopping rules;
- `docs/agents/current/project-agent-operating-principles.md` — narrowest execution surface and durable-knowledge deposition;
- `docs/agents/current/ui-change-visual-acceptance-gate.md` — required browser matrix and UI acceptance;
- `docs/agents/current/release-closeout-protocol.md` — exact-head merge and Production closeout;
- `docs/agents/current/product-and-research-integrity.md` plus the SEED research owners — scientific completeness and claim boundaries.
