# Vanilla SD-LoRA × Archify Flow — Completion Plan

Status: **ACTIVE — single checklist authority for this conversation**  
Repository: `mykcs/basemodel`  
Initial work branch: `feat/vanilla-sd-lora-archify-flow-20260912`  
Initial implementation commit: `be37d084`  
Created from the conversation beginning with: **“《Vanilla SD-LoRA 到底怎么工作》这个网页做好了吗？”**

> Future agents must treat this file as the execution authority for finishing this conversation. Work from the unchecked boxes below, verify the stated evidence, and change `- [ ]` to `- [x]` only after the requirement is actually satisfied in GitHub / CI / Preview / Production. Do not merely report completion in chat.

## 1. Outcome we are trying to deliver

The BaseModel page **《Vanilla SD-LoRA 到底怎么工作》** must stop looking like four adjacent cards and become a real mechanism flow inspired by `tt-a1i/archify`:

- one recoverable main path;
- real connectors and arrowheads;
- bounded replay as a side input;
- candidate-admission as a visible branch;
- current DirectApply and historical local GDR-v1 as separate paths;
- branch rejoin into the next-round state;
- a real Round `t+1` return edge into the next rollout;
- finite trace motion only as reinforcement, never as the only carrier of direction;
- a narrow/mobile layout that preserves the same topology rather than shrinking the desktop canvas;
- one canonical 16:9 visual that can also be reused in a slide.

The page must preserve the scientific boundary:

> **SD-LoRA parameter learning produces a candidate adapter. DirectApply / historical local GDR-v1 decide which state continues. They are not part of the Vanilla SD-LoRA update formula.**

## 2. Frozen scientific facts that the page must not silently change

- One round uses `16 tasks × 8 rollouts = 128` task attempts.
- Supervised SD-LoRA data comes from the earliest fully checked clean exact success per task identity.
- Failed / partial / repaired / invalid attempts remain diagnostic evidence and are not directly used as supervised successes.
- Cross-round old examples enter through bounded replay; the replay capacity is `64`.
- `W₀` is frozen.
- Prior SD-LoRA directions `D₁ … Dₜ₋₁` are frozen as directions.
- The current round learns the new low-rank direction `Dₜ ← BₜAₜ`.
- Magnitudes `α₁ … αₜ` are relearned, so frozen directions can still change effective contribution.
- The cumulative update is represented as `ΔWₜ = Σ αᵢDᵢ` and folded into one cumulative adapter.
- “candidate trained” and “state admitted” are separate events.
- Current line: DirectApply adopts a checked candidate directly.
- Historical local GDR-v1: a 16-task probe could select new or prior state; do not describe it as the original recurrent Gated Delta Rule.
- Current language-agent adaptation remains `paper_equivalent=false` and `rehearsal_free=false`.
- Do not upgrade mechanism risks such as forgetting/interference into proven causal conclusions without separate evidence.

## 3. Code and evidence owners

Primary UI owner:

- `src/components/research/OpenEvoVanillaSdLoraSlide.astro`

Long-form mechanism page:

- `src/components/research/OpenEvoVanillaSdLoraMechanism.astro`

Structural/scientific contract:

- `src/lib/vanillaSdLoraMechanism.test.ts`
- `src/data/vanillaSdLoraMechanism.ts`

Rendered topology browser contract:

- `tests/e2e/vanilla-sd-lora-mechanism.spec.ts`

Archify publication topology + validation receipt:

- `docs/agents/evidence/vanilla-sd-lora-mechanism/published-routed-loop.workflow.json`
- `docs/agents/evidence/vanilla-sd-lora-mechanism/published-routed-loop.archify-validate.json`
- `docs/agents/evidence/vanilla-sd-lora-mechanism/README.md`

Repository-wide UI authority that must remain satisfied:

- `docs/agents/current/human-thinking-web-expression-contract.md`
- `docs/agents/current/ui-change-visual-acceptance-gate.md`

## 4. Completed implementation checklist

### 4.1 Establish the real failure

- [x] Verify the published page existed and was not merely a design draft.
- [x] Confirm the old primary visual was card adjacency plus CSS character arrows rather than a routed topology.
- [x] Compare the old page against Archify’s workflow semantics and record that the missing value was authored edges/routes/branch/return structure, not superficial card styling.
- [x] Add the repeat-correction / FLOW-WITNESS evidence to the mechanism evidence README.

### 4.2 Replace the card rail with one real topology

- [x] Replace the four-card rail as the primary visual with a BaseModel-native HTML/SVG mechanism figure.
- [x] Add a real main route: prior cumulative adapter → rollout → clean-success selection → SD-LoRA update → candidate.
- [x] Add bounded replay as a visible side input joining the SD-LoRA update.
- [x] Keep SD-LoRA direction/magnitude internals inside the update node instead of creating a competing second primary diagram.
- [x] Add a visible candidate-admission split to current DirectApply and historical local GDR-v1.
- [x] Add separate join edges from DirectApply and GDR-v1 into the next-round state.
- [x] Add a real Round `t+1` return edge back to rollout.
- [x] Add SVG arrowheads and route labels.
- [x] Add finite route-trace motion over already-authored static paths.
- [x] Add `prefers-reduced-motion` behavior so static topology remains complete with motion disabled.

### 4.3 Mobile / responsive topology

- [x] Do not shrink the desktop graph onto phones.
- [x] Provide a vertical mobile topology preserving start → rollout → clean data → replay join → update → candidate → admission split/join → next round → return.
- [x] Preserve explicit mobile edge witnesses with `data-edge` attributes.
- [x] Keep the page free of document-level horizontal overflow at 390 / 768 / 1440 widths.

### 4.4 Preserve scientific wording contracts

- [x] Keep the exact Chinese fact `最多回放 64 条旧经验` visible in the projection source.
- [x] Keep `Dₜ ← BₜAₜ` visible.
- [x] Keep `α₁ · α₂ · … · αₜ` visible.
- [x] Keep `ΔWₜ = Σ αᵢDᵢ` visible.
- [x] Keep `候选累计 LoRA` / candidate semantics visible.
- [x] Keep the boundary `SD-LoRA 到这里结束` before state admission.
- [x] Preserve `paper_equivalent=false` / `rehearsal_free=false` on the long-form page.

## 5. Completed validation checklist

### 5.1 Archify source validation

- [x] Author `published-routed-loop.workflow.json` to match the publication topology rather than only the old internal candidate diagram.
- [x] Run Archify `validate workflow --quality showcase --json` on that source.
- [x] Record a PASS receipt with all 9 artifact checks passing.
- [x] Require composition summary `0 errors` and `0 warnings`.
- [x] Require `0 proper crossings` and `0 ambiguous corridors`.

Current validated receipt at plan creation:

- checks: `9/9 PASS`
- composition: `PASS`
- errors: `0`
- warnings: `0`
- proper crossings: `0`
- ambiguous corridors: `0`

### 5.2 Focused browser acceptance

- [x] Add a desktop topology test that asserts named routed edges exist, not just node text.
- [x] Add desktop node-order / branch geometry assertions.
- [x] Add a mobile topology test with side-input, branch, join, and return witnesses.
- [x] Add reduced-motion verification.
- [x] Verify Chinese and English mechanism contracts.
- [x] Verify light/dark at 390 / 768 / 1440.
- [x] Verify the desktop canvas remains reusable as a 16:9 slide.
- [x] Focused Chromium result: `13/13 PASS`.

### 5.3 Full repository pre-provider gate

- [x] Remove newly introduced `!important` debt and pass `npm run audit:css`.
- [x] Pass the deterministic repository gate.
- [x] Pass production Astro build.
- [x] Build all `494` static pages successfully.
- [x] Pass one-H1 audit across all `494` routes.
- [x] Pass official GitHub / Hugging Face / arXiv brand-link audit.
- [x] Pass 390 / 768 / 1440 root-overflow preflight.
- [x] Run the repository-required shared-UI cross-browser matrix on an isolated free Playwright port.
- [x] Chromium portion: `207/207 PASS`.
- [x] WebKit portion: `207/207 PASS`.
- [x] Total shared-UI matrix: `414/414 PASS`.
- [x] Final `npm run preflight:ui` result: `PASS: required pre-provider checks completed`.

## 6. Git / GitHub publication checklist — remaining work

The implementation has already been committed and pushed on:

- branch: `feat/vanilla-sd-lora-archify-flow-20260912`
- implementation commit: `be37d084`

Do not declare the conversation complete until every unchecked item below is satisfied.

- [x] Confirm the plan file itself is present on the same GitHub branch and record its commit SHA in the Evidence Log.
- [x] Re-fetch `origin/main` immediately before PR creation / final-gate work and record the current main SHA.
- [x] Re-check open PRs that touch the Vanilla SD-LoRA route, especially PR `#656` or its successor; determine whether it changes only surrounding series navigation or also conflicts with the mechanism visual.
- [x] If `main` advanced or a relevant PR merged, reconcile this branch onto current `main` without dropping either the routed-flow work or newer navigation/content. Never overwrite unrelated work.
- [x] If reconciliation changes runtime/UI-owned files, rerun the minimum required validation. For meaningful UI/head changes, rerun the repository-prescribed `preflight:ui`; do not reuse stale green evidence.
- [x] Create or update one PR from `feat/vanilla-sd-lora-archify-flow-20260912` to current `main` with a concise Page Expression Brief, FLOW-WITNESS summary, Archify receipt, and local validation evidence.
- [x] Confirm the PR changed-file set is limited to intended mechanism/evidence/test/plan files plus any explicitly reconciled navigation changes; no accidental generated output, machine state, or unrelated edits.
- [x] Confirm PR mergeability against current main and inspect unresolved review threads / requested changes.
- [x] Request the repository’s exact-head Vercel final gate using the current repository authority (currently `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` unless current main changes the policy).
- [x] Record the exact PR head SHA submitted to the final gate.
- [x] Confirm a real Vercel deployment object exists for that exact head; `SKIPPED`, ignored, canceled, stale-head, or status-only callbacks are not PASS.
- [x] Require the exact-head Vercel gate / deployment to reach its required successful terminal state.
- [x] After recording the PR/Preview evidence in this checklist changes the PR head, request one final exact-head Vercel gate for that docs-only head before merge.
- [x] Confirm the final docs-only head changes no runtime/UI/evidence-owner file versus `b78ba9ebf2fd697cfe40af793ec2d2e32d7b577d`; if it does, rerun the affected visual acceptance instead of inheriting the prior Preview result.

## 7. Exact-head Preview visual acceptance — remaining work

The owner’s original complaint was visual/structural, so source/CI success alone is insufficient.

For the exact PR head Preview, inspect the real rendered route in both locales:

- Chinese: `/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/`
- English: `/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/`

Required acceptance:

- [x] Desktop light: the reader can visually follow the main path before reading body prose.
- [x] Desktop dark: connectors, arrowheads, labels, nodes, and contrast remain legible.
- [x] Phone / 390px: the mobile topology visibly preserves replay join, state split/join, and return edge.
- [x] Tablet / 768px: no overlap, clipping, root horizontal overflow, or unreadably compressed branch labels.
- [x] Motion enabled: trace motion follows authored routes and does not move geometry.
- [x] Reduced motion: complete meaning remains visible with animation disabled.
- [x] DirectApply is clearly marked as the current path.
- [x] GDR-v1 is clearly marked as historical local behavior, not the original recurrent Gated Delta Rule.
- [x] SD-LoRA update and state admission are visibly separate conceptual layers.
- [x] Replay visibly enters training from the side rather than appearing to be a current rollout.
- [x] The Round `t+1` return is visible as a real route rather than only mentioned in prose.
- [x] The figure still reads as one primary mechanism visual rather than two competing diagrams.
- [x] The exact-head Preview passes a final subjective cold-read: a technically curious first-time reader should understand “what flows where” within roughly 30 seconds.

## 8. Merge and Production acceptance — remaining work

- [x] Before merging, refresh current main and confirm the PR head/base relationship is still valid.
- [x] Follow the current BaseModel merge policy. Self-merge only if current policy permits it and no explicit owner-approval requirement applies; never bypass a required human approval.
- [ ] Merge the PR only after required checks, exact-head Vercel, review state, and Preview visual acceptance are all green.
- [ ] Record the merge commit SHA.
- [ ] Confirm a READY / successful Production successor is built from the merged `main` state.
- [ ] Open the public Production Chinese route and confirm the routed topology is the version from the merged commit.
- [ ] Open the public Production English route and confirm the same topology/boundaries.
- [ ] Re-check one desktop and one mobile Production view for obvious clipping/overlap and for the real return edge.
- [ ] Confirm no superseded card-adjacency primary visual was accidentally restored by a later merge.

## 9. Final delivery standard

This conversation is **DONE** only when all of the following are simultaneously true:

1. The published mechanism visual contains real SVG/semantic connectors for main path, replay side input, state branch/join, and round return.
2. Archify publication workflow validates at showcase quality with 9/9 checks and 0 errors / 0 warnings.
3. Focused Vanilla SD-LoRA browser contract is green.
4. Any head that materially changes after the recorded full preflight receives the appropriate fresh validation required by repository policy.
5. The PR is based on current main, review-clean, and mergeable.
6. Exact-head Vercel final gate is real and successful.
7. Exact-head Preview has been visually inspected in both locales and representative desktop/mobile/theme/reduced-motion states.
8. The PR is merged under current repository policy.
9. Production successor is successful and the public zh/en pages show the routed mechanism.
10. This file has no remaining unchecked delivery items, its Status is changed to **COMPLETE**, and the Evidence Log contains the final PR number, final head SHA, Vercel result, merge SHA, and Production verification.

Passing local tests alone is **not** the delivery standard. A Vercel READY badge alone is **not** the delivery standard. The owner must not be the first person to discover a predictable visual failure.

## 10. Hourly agent execution contract

Every hourly run must:

1. Read repository root `AGENTS.md`, `docs/agents/LATEST.md`, the current matched UI/release authority, and **this plan** before changing files.
2. Fetch current `main`, the active routed-flow branch/PR, and relevant concurrent PRs.
3. Pick the earliest meaningful unchecked checklist item that is not blocked by a provider/human requirement; execute as many adjacent safe items as practical in the same run.
4. Never repeat expensive validation merely to create activity. Reuse still-valid receipts only when the exact source/head/base conditions remain unchanged.
5. When a provider is running, do one immediate state read and at most one short recheck if near terminal; do not spend the whole hourly run in sleep/poll loops.
6. When an item passes, edit this exact Markdown file and replace its `- [ ]` with `- [x]`, adding concrete evidence to the log below.
7. Commit and push checklist updates together with the evidence-producing change when appropriate; do not leave “completed” only in chat.
8. If an item fails, do not tick it. Record the narrow blocker/evidence and fix it on the next safe step.
9. Do not force-push over unrelated work, delete branches, or bypass current repository approval / deployment rules.
10. If all delivery criteria pass, change `Status` to **COMPLETE**, record final evidence, and stop making repository changes for this task. If task-automation controls are available, disable the hourly automation after the first confirmed COMPLETE run.

## 11. Known concurrency / integration note

At plan creation, PR `#656` (`Add SD-LoRA growing-history research page skeleton`) is open from the same base and adds surrounding SD-LoRA series navigation, including navigation on the Vanilla SD-LoRA route. It does **not** modify `OpenEvoVanillaSdLoraSlide.astro` in the inspected diff. Treat it as a likely clean integration, but re-check its current diff/status before merging either line because it may advance after this snapshot.

## 12. Evidence Log

Append durable evidence here. Keep temporary provider queue state, local port numbers, transient process IDs, and machine-specific scratch paths out of permanent authority unless they explain a real failure mode.

### 2026-09-13 — implementation / pre-provider evidence

- Routed-flow implementation committed as `be37d084` on `feat/vanilla-sd-lora-archify-flow-20260912`.
- Archify publication source validates showcase PASS: 9/9 artifact checks, 0 errors, 0 warnings, 0 proper crossings, 0 ambiguous corridors.
- Focused mechanism Playwright: 13/13 PASS.
- Structural mechanism test restored and passes 4/4.
- Repository shared-UI preflight: PASS.
- Production build: 494 pages PASS.
- Cross-browser matrix: 414/414 PASS (207 Chromium + 207 WebKit).
- Root overflow preflight: PASS at 390 / 768 / 1440 representative widths.
- CSS audit: PASS after removing newly introduced `!important` usage.

### 2026-09-13 — current-main reconciliation evidence

- Plan file added on the routed-flow branch by commit `f63ff5aef01b68bec9af10bf8eacbc28198b3f93`.
- `main` advanced to `2b8fb0d5dc3c2ec2325fc22255e75a28d1f9441b` via merged PR #656 (`Add SD-LoRA growing-history research page skeleton`).
- PR #656 was re-read before reconciliation: it adds surrounding SD-LoRA series navigation/routes and does not modify `src/components/research/OpenEvoVanillaSdLoraSlide.astro`; it was therefore treated as compatible surrounding navigation, not as a replacement mechanism visual.
- Routed-flow branch was merged with current `main` without conflict; local reconciled head before checklist evidence commit: `1349056e1fcc1b67298dc88a30f8bc7c6f82b9ba`.
- Because #656 adds UI-owned route/navigation code, the full shared-UI preflight was rerun on the reconciled head instead of reusing stale evidence. Result: PASS; 506 static pages built, one-H1 audit PASS across 506 routes, root overflow PASS, and cross-browser matrix 414/414 PASS (207 Chromium + 207 WebKit).

### 2026-09-13 — PR #659 exact-head Preview evidence

- PR #659 opened from `feat/vanilla-sd-lora-archify-flow-20260912` to `main@2b8fb0d5dc3c2ec2325fc22255e75a28d1f9441b`; GitHub reports `mergeable=true`, with 6 intended changed files, 0 review threads, and 0 submitted reviews at inspection time.
- Exact Preview-validated head: `b78ba9ebf2fd697cfe40af793ec2d2e32d7b577d`.
- Vercel deployment: `dpl_4ahCsi7EyoDU81pU8ehcv2bUrqCi`, URL `basemodel-preview-nyfh2g1r6-wangrui92-team.vercel.app`, terminal state `READY`, metadata `githubCommitSha=b78ba9ebf2fd697cfe40af793ec2d2e32d7b577d`.
- Protected Preview was accessed with a temporary Vercel share session; the login wall was explicitly rejected as invalid visual evidence before re-running against the authenticated page.
- Real Preview cold-read: zh desktop light/dark, zh 768px, zh 390px, en desktop, and reduced-motion all returned HTTP 200 with no console/page errors and zero root horizontal overflow. The routed mechanism visibly preserves main flow, bounded-replay side join, DirectApply/GDR-v1 split and rejoin, and Round t+1 return.
- Reduced-motion inspection reports the route-trace animation disabled (`animation-name: none`) while the complete static route remains visible.

### 2026-09-13 — post-evidence exact-head gate and later current-main refresh

- The checklist-evidence update produced a later exact-head candidate `4b5eb1d4abc899d8afa06f1e5c2ddaa6f93c6dbf`; Vercel deployment `dpl_Bg8kePHEtsPH61aHWuur4YyfUDDc` is a real Preview object in terminal `READY` state with `meta.githubCommitSha=4b5eb1d4abc899d8afa06f1e5c2ddaa6f93c6dbf`. Public PR CI on that head also completed green: deterministic + four browser shards + aggregate gate. This satisfies the post-evidence exact-head-gate requirement; it is historical acceptance after later base movement, not current merge evidence.
- `main` later advanced independently to `dd511119d22b7679927165ef65a430d499a0b922` via merged PR #655 (WebShop reader map). The intervening product files are WebShop-specific plus `SeedOpenEvoResearchDetail.astro` / `siteReaderContracts.ts`; no Vanilla SD-LoRA mechanism owner changed, and the Vanilla route/component does not import those WebShop owners.
- The same task branch was refreshed onto `main@dd511119…` without conflict. Pre-evidence combined head: `96c486844ed2e9d1fc0271b7cd6b593a3ccca6f0`. The PR contribution versus current main remains the same six intended Vanilla mechanism/evidence/test/plan files.
- Because the refreshed combined tree contains independent runtime/UI ancestry after `b78ba9eb…`, affected acceptance was rerun rather than blindly inherited: `src/lib/vanillaSdLoraMechanism.test.ts` = 4/4 PASS and `tests/e2e/vanilla-sd-lora-mechanism.spec.ts` Chromium = 13/13 PASS with retries=0, covering zh/en, routed desktop topology, mobile replay/split/join/return, reduced motion, light/dark at 390/768/1440, no root overflow, and 16:9 slide reuse.
- Concurrent PRs #661 and #658 were inspected before spending another final Gate. #661 is behind current main and has no exact-head Vercel acceptance; #658 likewise has no exact-head Vercel acceptance. Neither modifies the Vanilla SD-LoRA mechanism owner, so neither justifies replacing this live PR or waiting indefinitely for another base move.

### 2026-09-13 — final current-base pre-merge refresh

- Live `main` advanced from `dd511119…` to `a31b1656f991f170313021f5fe383d1c734b496d` only through merged WebShop checklist closeout PR #662; the range changes only `docs/agents/tasks/WEBSHOP_FIRST_PRINCIPLES_COMPLETION_PLAN_20260913.md` and does not touch Vanilla SD-LoRA runtime/UI/evidence owners.
- The task branch was merged with `main@a31b1656…` cleanly. Post-merge ancestry proof: merge base equals live `main` and `origin/main...HEAD = 0 behind / 9 ahead` before the evidence commit.
- Concurrent PRs were refreshed before release work: #661 changes study-index/navigation owners but not the Vanilla mechanism owner; #658 changes broader research/navigation/layout owners but not `OpenEvoVanillaSdLoraSlide.astro`; #647 is governance/test-only. None supersedes this routed mechanism PR.
- Live `main` protection requires strict up-to-date `Vercel` only; `required_pull_request_reviews=null`, no submitted reviews, no review comments, and no explicit owner-approval requirement applies. Self-merge is therefore permitted once the fresh exact-head Vercel acceptance is green.

### Final release evidence

- PR: `#659`
- latest reconciled main SHA: `dd511119d22b7679927165ef65a430d499a0b922`
- exact PR head SHA validated in Preview: `b78ba9ebf2fd697cfe40af793ec2d2e32d7b577d`; later post-evidence exact-head gate: `4b5eb1d4abc899d8afa06f1e5c2ddaa6f93c6dbf`; current-base candidate will be the evidence commit made after `main@dd511119…` refresh
- exact-head Vercel deployment/gate: `dpl_4ahCsi7EyoDU81pU8ehcv2bUrqCi` READY for `b78ba9eb…`; `dpl_Bg8kePHEtsPH61aHWuur4YyfUDDc` READY for `4b5eb1d4…`; a fresh current-base final Gate is still required after the `dd511119…` refresh
- Preview cold-read: PASS on real authenticated Vercel Preview for `b78ba9eb…`
- merge SHA: **pending**
- Production successor: **pending**
- public zh/en route verification: **pending**
