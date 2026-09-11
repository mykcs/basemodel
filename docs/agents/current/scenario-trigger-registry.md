# Scenario trigger registry

Last reviewed: **2026-09-10**

This is a **just-in-time attention router**, not a second governance system. Scan it after `/AGENTS.md`, `docs/agents/LATEST.md`, and the core bootstrap in `docs/agents/README.md`. Load only the matched owner, executable truth, and live evidence.

Precedence:

```text
current user instruction
> live provider state / executable repository or experiment truth
> docs/agents/current/*
> historical case evidence
```

Re-scan when the task changes state: a blocker appears, an overlapping PR is discovered, a provider boundary is crossed, `main` moves, a Gate reveals an invariant, or a current/latest external claim becomes decision-relevant.

---

## TRIGGER: remembered plan or current doc may be stale

**Cues:** an earlier plan conflicts with repository state; two current docs disagree; provider behavior changed; the user challenges an assumption; the task depends on fast-moving models/APIs/frameworks/hosting.

**Automatic response:**

1. Treat remembered/chat state as a hypothesis.
2. Re-read `LATEST.md`, the task-owning current policy, executable config/tests/manifests, and live provider/experiment state.
3. Re-verify time-sensitive first-party claims when they affect the decision.
4. If live/executable truth contradicts a `current/` doc, update or demote that doc. Do not add another workaround policy.

---

## TRIGGER: Preview, Production, release, hosting, or Cloudflare

**Cues:** Vercel, deploy, Preview URL, Production, release, Cloudflare Pages/Workers, `pages.dev`, Direct Upload, Wrangler, build quota/count.

**Automatic response:**

1. For normal deployment read `hosting-architecture.md`, `deployment-policy.md`, and `release-closeout-protocol.md`.
2. Treat Vercel as the only ordinary Preview + Production authority.
3. Load Cloudflare runbooks only when the task explicitly needs rollback, retirement, Cloudflare-specific fidelity, or fresh evidence shows legacy-provider activity.
4. Do not intentionally trigger a Cloudflare Pages Git build unless the owner is told why Cloudflare-specific execution is necessary and explicitly authorizes it.
5. If Cloudflare Direct Upload is the required fallback, use `direct-upload-preview-policy.md` and `direct-upload-preview-command.md`; never silently substitute a Git-connected Pages build because credentials are missing.
6. Keep source state, deterministic Gate/build, provider READY, real-route acceptance, and Production acceptance separate in reports.
7. Do not quote exact provider quota/price counters without authoritative current evidence.
8. If the task changes the blocking CI/provider owner, treat cutover as a transaction: inspect the exact-head provider execution **and** live GitHub required-status/ruleset state before mutation and again before closeout. Repository docs/config alone cannot prove blocking authority moved; a concurrent live ruleset change is a stop-and-read event, not permission to overwrite it.
9. Localize provider red states by the first failing execution phase before changing architecture. A repository `verify:deploy` assertion failure, browser/product failure, environment/bootstrap failure, ignored policy outcome, and provider infrastructure failure require different fixes.
10. During iterative human review, use the fast review-only lane rather than the final gate. A review handoff is complete only after opening the **hosted target route / anchor / slide** and confirming the specific claimed change is visible there. If the current build failed, do not reuse an older successful static output or old Preview URL as if it represented the new candidate; rebuild fresh generated output first. This target-specific check is not permission to rerun the unrelated full 205-case final matrix on every edit.

Completed Vercel pilot/adoption records live under `docs/agents/history/`; they explain why the current architecture exists but do not own today's release behavior. For the 2026-08-28/29 self-hosted-runner + Vercel-browser-offload + Cloudflare-smoke migration, including failed isolation/bootstrap attempts, CI-vs-deploy relevance mistakes, and the later Doctor-led safe disk/cache maintenance pass, read [`../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`](../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md).

---

## TRIGGER: shared experiment server disk pressure / storage attribution / artifact publication / cleanup

**Cues:** server disk is nearly full; “who is using space”; compare anonymous users; organize runs/checkpoints/analysis outputs; give experiment artifacts passports; publish to GitHub/Hugging Face/GHCR; reclaim space without disturbing scientific work.

**Automatic response:**

1. For snapshot-only work read [`server-storage-pressure-audit-sop.md`](server-storage-pressure-audit-sop.md). For the full organize → passport → publish/verify → reclaim workflow read [`server-artifact-governance-and-reclaim-sop.md`](server-artifact-governance-and-reclaim-sop.md) plus `personal-compute-profile-consumer.md` **before the first mutation or public-number update**.
2. Start read-only and resolve the persistent workspace filesystem before using `df`; a control container's `/` may be overlay and must not be assumed to be the persistent data filesystem.
3. Treat read-only audit I/O as a resource budget. Start with exact metadata, known roots, current references, and bounded/shallow `du`; do not default to whole-tree `find`/checksum crawls on a live research filesystem.
4. If the authorized view exposes only a subset of expected homes, classify account attribution as incomplete. Do not `docker exec` into sibling-user containers or use raw-Docker/admin mount capabilities merely to complete a dashboard. Refresh current global facts and keep the most recent complete anonymous attribution visibly historical instead of publishing a partial new ranking.
5. Before touching an object, prove ownership/lineage. A filename, OpenEvo label, familiar run/container/image tag, project-looking path, or top-level directory owner is a clue, never deletion authority. Directory owner is not subtree ownership. Unknown/shared/external objects are HOLD.
6. Reuse current Run Manifest / artifact-publication contracts for passports. Deduplicate before upload; route small code/evidence/manifests to GitHub, model-derived state to Hugging Face model repos, appropriate large research data to HF dataset/private staging, and OCI runtimes to GHCR. W&B is telemetry/cross-linking, not the only backup.
7. Upload success is not recovery proof. Require immutable remote revision/digest/hash plus fresh read/download/reload/restore verification before a scientific object can enter a reclaim proposal.
8. Keep `P0_ACTIVE`, `P1_ANALYSIS_HOLD`, `P2_ARCHIVE_THEN_RECLAIM`, `P3_REBUILDABLE`, and `X_SHARED_OR_UNKNOWN` separate. Exact recoverability, live/path dependency, hot-recovery window, owner analysis hold, ownership, and deletion authorization are independent gates.
9. Permanent capacity reclaim still requires the current exact `NOT_AUTHORIZED` manifest, technical + plain reports, owner approval of that exact version, and an immediate live re-check. A safe-route DENY/HOLD is not permission to retry via root. Never broad-prune the shared Docker daemon.
10. Record quarantined, logically deleted, and physically reclaimed bytes separately. Same-filesystem quarantine normally frees no blocks; concurrent experiments can make `df` delta differ from logical deletion bytes.
11. Public website refreshes publish safely measurable current global facts plus only complete anonymous attribution snapshots. Never persist usernames, home paths, container identities, SSH/IP/GPU UUIDs, or anonymous-label mappings.

---

## TRIGGER: Mac fallback runner recovery, health, disk pressure, or cache maintenance

**Cues:** manual Mac CI fallback, restore OrbStack runner, runner Doctor, disk full/low space, Docker cache, npm/pip/uv/pnpm cache, fallback cleanup, machine-wide cache cleanup, LaunchAgent warning.

**Automatic response:**

1. Read `deployment-policy.md` § Mac manual fallback and inspect the executable `.github/runner/` scripts before acting. Resolve the **current** CI provider/required-check authority first. Do not wake or re-enable the fallback merely because GitHub reports it `offline`; the normal state after cloud cutover is intentionally disabled.
2. Interpret runner state as a tuple, not one badge: local mode, LaunchAgent loaded/disabled state, GitHub runner `online/busy`, Docker container running/exited/absent, and the current provider role. `offline + disabled + unloaded + exited` can be a healthy dormant fallback. `In Use` on an OrbStack image means a container references the image; it does not mean CPU is actively executing.
3. When fallback execution is explicitly required, run the installed Doctor before starting/mutating it; require the correct home/data-volume capacity, container isolation/health, GitHub `busy=false`, OOM/version state, and LaunchAgent state. After the manual canary, return the runner to the current policy state rather than silently restoring persistence.
4. Inventory targeted roots and classify each object before cleanup: canonical repository source/config; clean OCI runtime recovery image; active/warm cache; stopped rollback/fallback container; worktree; credentials-adjacent runner state; generated workspace/logs; or OrbStack internals. Docker `reclaimable` bytes and stopped state are not disposal authority.
5. Back up by artifact class. GitHub owns Dockerfile/scripts/config; a clean OCI runner image may be mirrored to **private GHCR** under an immutable digest; scientific model/checkpoint/data belongs in the experiment-side GitHub/Hugging Face publication flow. Never back up a registered/live runner container with `docker commit`, because `.credentials`, `.runner`, workspace, diagnostics, and machine identity are mutable host state. Before trusting GHCR, verify package visibility plus the remote digest/tag by readback.
6. Separate runner state from machine-wide state. With zero host mounts, host npm/pip/uv/pnpm caches do not optimize CI; clear them only when the current task also authorizes host developer-cache maintenance and accept the next local cold download.
7. Before a mutating cache command, prove no relevant host package-manager or Docker/Buildx build process is active and resolve every runner sharing that cache. Shared BuildKit pruning is allowed only when each relevant runner is proven idle, or intentionally disabled **and** its local runner container is proven stopped/absent; `unknown` fails closed. Prefer a bounded cache cap and tool-owned prune. Never use broad `docker system prune` as a housekeeping shortcut.
8. If CI is queued, distinguish queueing from a stuck runner before cancellation: inspect provider queue order, GitHub runner `busy`, current workflow step, child process liveness, and durable output. A single self-hosted runner naturally queues work; a long browser step is not failure evidence by elapsed time alone.
9. Treat Playwright worker-count changes as isolated performance experiments. Hold task selection, assertions, retries, browser, executor class, and acceptance semantics fixed; require the **entire** matrix to pass on the exact experimental head. Memory headroom is not stability proof, and an early-terminated run is not a valid speedup. Prefer horizontal independent shards with one worker each when vertical worker concurrency causes timeout/contention; do not merely raise timeouts to manufacture green.
10. Prefer tool-owned cache cleanup; never bulk-delete `~/.npm`, `~/.cache`, OrbStack internals, runner writable state, images/containers, registered worktrees, or stopped fallback assets from size output alone. Verify image-to-container references before removing unreferenced images.
11. Measure the real free-space delta and rerun Doctor or equivalent disabled-state checks. Below 15% free remains a warning condition even when a bounded cleanup succeeded; stop rather than widening deletion scope without ownership evidence.

Historical evidence and causal details: [`../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`](../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md) and [`../history/2026-09-06-mac-orbstack-runner-housekeeping-ghcr-and-ci-parallelism-retrospective.md`](../history/2026-09-06-mac-orbstack-runner-housekeeping-ghcr-and-ci-parallelism-retrospective.md).

---

## TRIGGER: Vercel billing, `Overdue`, or unexplained spend

**Cues:** `Overdue`, payment failed/retry/shutdown warning, “I already paid”, included credits, Build CPU spike, usage meter, Speed Insights charge, bot/crawler cost concern, or a request to reduce Vercel spend.

**Automatic response:**

1. Read `deployment-policy.md` and separate **subscription invoice**, **included credit**, **usage meters**, **provider payment state**, and **bank/card final settlement**. Never collapse them into one `$20`-style story.
2. Use current first-party Vercel documentation plus live provider state. A still-working site can coexist with payment retry/grace; it does not prove the invoice is paid or suspension is impossible.
3. Attribute usage by **project and service** with explicit date ranges before changing architecture. Treat usage/effective-cost output as attribution evidence, not automatically as the invoice amount due.
4. Before the first provider-triggering write, refresh `main` and inspect recent/open PRs that touch the same provider/config/gate surface. If another Agent already shipped part of the optimization, preserve it and add only the missing delta instead of paying for a duplicate Preview.
5. Inspect representative deployment logs and project resource configuration. Build spend should be traced to build count, machine selection, and expensive phases; traffic spend should be traced to requests/transfer/functions before blaming bots.
6. Do not infer invoice settlement from a small/pending bank authorization. If duplicate payment is suspected, compare the provider receipt/invoice with the bank's final posted/reversed state. Never persist card digits, bank messages, payment URLs, or tokens.
7. Optimize the measured cost center first and prefer reversible/free controls. Keep scope uncertainty fail-closed; do not delete quality gates or enable paid bot analysis merely because it sounds protective.
8. After mutations, read provider state back and verify the real Production artifact. Re-measure a later representative window because the migration release itself may be expensive.

Historical case and friction record: [`../history/2026-08-28-vercel-billing-and-cost-control-retrospective.md`](../history/2026-08-28-vercel-billing-and-cost-control-retrospective.md).

---

## TRIGGER: whole-site performance / hydration / payload / dead-code optimization

**Cues:** full-site optimization, HTML/JS/CSS payload reduction, hydration cleanup, large serialized props, dead components, static-first/no-JS regressions, CommandMenu/global-island cost, or a request to optimize many pages without redesigning the product.

**Automatic response:**

1. Read `website-engineering-standard.md`, `rendering-and-performance-policy.md`, `css-architecture.md`, and the UI acceptance owners before editing.
2. Reconfirm current `main`, open PRs and provider/build policy first; a broad audit snapshot ages quickly.
3. Make correctness Gates fail closed before measuring optimization success. Add negative self-tests when verifier truthfulness changes.
4. Prefer architectural wins in this order: remove unnecessary hydration, keep truthful static HTML, narrow serialized props, route-scope/defer islands, move feature CSS out of global reach, then delete only reachability-proven dead code.
5. Preserve browser-local state, URL/share semantics, first-click behavior and evidence/unknown boundaries. Smaller payload after losing product behavior is a regression.
6. Use focused browser reproduction for each new failure, instrument timing/state when the cause is ambiguous, then rerun the full owning Chromium/WebKit matrix on the exact tree.
7. Before an expensive final matrix, checkpoint the implementation and reconcile material `main` movement. After acceptance starts, do not automatically throw away expensive evidence for proven-independent `main` commits; record the base/overlap boundary and apply the current exact-head closeout protocol.
8. If protected Preview automation stops at Vercel Authentication, classify that as an access/provider boundary. Do not treat SSO headers as application headers or weaken protection merely to manufacture PASS.
9. Stop once the requested measurable problem is fixed, relevant Gates are green, exact-head evidence is recorded and Production closeout is complete.

Historical end-to-end case: [`../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md`](../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md).

---

## TRIGGER: CI performance experiment / benchmark / timing regression

**Cues:** CI is slow; compare two schedulers/sharding strategies; remove sleeps/video/cache/setup work; benchmark CircleCI/Playwright; “is this optimization worth keeping”; a local A/B is faster but hosted CI is noisy.

**Automatic response:**

1. Read `website-engineering-standard.md` §6.1–6.2, `deployment-policy.md`, and `release-closeout-protocol.md` before the first benchmark ref mutation.
2. Search live open PRs and active/recent benchmark workflows first. Do not create a duplicate experiment or run candidate/control concurrently with your own other benchmark.
3. Pre-register the candidate/control exact refs or trees, canonical test identities, executor/worker/retry contract, metric, meaningful improvement rule, theoretical upside bound, and qualification-vs-steady-state distinction.
4. If the candidate changes CI infrastructure and therefore activates extra Lab/reserve/qualification work, do not compare that raw job duration to an ordinary product-PR baseline. Use a benchmark-only stacked PR with the ordinary risk class being optimized (focused or full) on the candidate to measure the post-merge steady-state shape. For test-selection changes, execute the [CI evidence preflight](website-engineering-standard.md#ci-evidence-preflight): prove consumers/side effects and retained test identities; do not apply scheduler-only same-population reasoning to a declared selection experiment.
5. Freeze the control to an immutable branch/ref when exact historical behavior matters; `main` is a moving ref. Give every workflow measurement a fresh head SHA because legacy GitHub status contexts attach to the commit SHA.
6. Preserve exact test identity and acceptance semantics. Candidate/control runs are sequential; compare the slower browser shard/true critical path, not the best shard or a local hotspot.
7. Separate queue/provisioning/setup/test time when the provider exposes it. A GitHub `pending -> success` interval includes every layer until proven otherwise.
8. If the observed benefit is comparable to hosted-runner variance or below the pre-computed upside bound, reject added complexity and close the experiment unmerged. Local focused speedups are diagnostic evidence, not hosted critical-path authority.
9. If a concurrent Agent moves/merges the candidate before acceptance completes, stop and re-read live state. Finish post-merge validation honestly and use a narrow revert/repair if the pre-registered criterion was not met.

Historical cases: [`benchmark causality`](../history/2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md), [`mechanism-route evidence and repetition audit`](../history/2026-09-07-mechanism-ci-route-ownership.md). Dashboard/log interaction failures use the evidence-reading procedure in `deployment-policy.md`; repeated UI timeouts are not CI failure evidence.

---

## TRIGGER: exact-head acceptance / pending-check watch / `main` moved / provider says READY

**Cues:** the user asks to watch named CI checks on an exact PR head; a required shard is reported pending; a validated branch is behind `main`; another PR merged during a long task; Preview succeeded on an older head; provider status is green but the user asked to verify the real site.

**Automatic response:**

1. Pin the PR number, exact watched/accepted head SHA, named required checks, notification thresholds, and whether merge is currently authorized.
2. Perform an immediate live read before creating any watcher. If the requested condition is already true, report it immediately; if the head no longer matches, stop rather than silently retargeting. Only install a real future condition watch when the condition remains pending and the environment actually supports background monitoring.
3. Compare the candidate head with current intended `main`.
4. Classify intervening changes by file, contract, provider config, research state, and shared UI ownership.
5. Keep one live semantic candidate through independent drift; synchronize that candidate when current-base policy requires it. Create a successor only when semantics, routing, or authority changes.
6. Before an expensive final run, inspect other near-merge PRs that can advance the same base and choose a stable closeout window.
7. Re-run the checks required by the **current** protection/provider contract on the accepted head, plus any overlap-affected checks.
8. Verify provider metadata points to that exact commit and read the provider's real execution state. `READY` is provider completion; `ignored/skipped/canceled` is not Preview acceptance even when the outer GitHub status is green.
9. Inspect the required real route/interaction/metadata; provider READY remains separate from visual/product acceptance.
10. Keep readiness separate from mutation authority. A later explicit “merge” changes authorization only; re-read the live merge tuple and use expected-head locking rather than spending an earlier readiness report. See `release-closeout-protocol.md` §6.5–8.
11. If the owner says **continue until complete** and the remaining work is a live check that can be polled in the current session, keep reading that exact provider/check to a terminal state or a real blocker. Do not end the task at `pending` and imply that you will come back later. A future watcher is only for genuinely future delivery, not a substitute for synchronous work that can still be completed now.

---

## TRIGGER: deterministic Gate fails and weakening it looks tempting

**Cues:** a copy/docs-like change fails a semantic/evidence/hardening audit; the easiest path to green is to remove an assertion.

**Automatic response:** read the failing invariant, decide whether it remains valid using current truth, fix the implementation/content if it does, and change the Gate only when evidence proves the Gate itself is stale. Encode recurring boundaries in the existing owner/test rather than weakening research or release safety. If a broad browser/full-suite failure appears outside the changed surface, reproduce the exact failing test on the candidate **and the intended base/current `main` under the same runner/config** before expanding scope. The same failure on base is evidence of a pre-existing blocker, not permission to call the full gate green; still prove the changed surface with focused acceptance and report the base-existing failure separately. If the change touched a shared primitive that plausibly affects the failing surface, continue investigating even when base also fails. See `ui-change-visual-acceptance-gate.md` Section 10 and the 2026-08-28 SEED responsibility-topology retrospective.

---

## TRIGGER: SEED / OpenEvo / ALFWorld / WebShop / reproduction / GPU choice

**Cues:** reproduction mode, SEED/OpenEvo method comparison, ALFWorld/WebShop, checkpoint substitution, paper hardware, local-vs-rented GPU planning.

**Automatic response:**

1. Read `seed-openevo-research-mission-first-principles.md`, `reproduction-guide-design-principles.md`, `product-and-research-integrity.md`, and current experiment-side authority.
2. Keep strict reproduction, method reproduction, modern rerun, diagnostics, and formal comparable measurement distinct.
3. Separate “code runs”, “training chain healthy”, “method effect measured”, and “paper-condition comparable”.
4. Preserve task/model/checkpoint/data/evaluation identity and observable provenance.
5. Prefer already-authorized hardware when it answers the scientific question; paper hardware is not automatically a universal prerequisite.
6. Never silently substitute a newer model/checkpoint or a nearby historical experiment for the exact artifact named by the current protocol.
7. When teaching or auditing an agent-loop diagram, trace responsibility from executable code rather than forcing a false binary owner: **model -> model-facing harness <-> benchmark environment -> completed evidence -> analyzer/reward/learning update -> persisted state**. In SEED WebShop specifically, distinguish the SEED/verl-agent prompt/history/action-projection harness from Princeton WebShop's `WebAgentTextEnv`. Read `research-explainer-page-standard.md` and, when this ambiguity appears, the 2026-08-28 responsibility-topology retrospective.

For SEED WebShop environment identity specifically, load `seed-webshop-environment-audit.md` before claiming source-faithful equivalence.

Historical responsibility-topology case: [`../history/2026-08-28-seed-responsibility-topology-and-visual-acceptance-retrospective.md`](../history/2026-08-28-seed-responsibility-topology-and-visual-acceptance-retrospective.md).

---

## TRIGGER: old/new experiment version, superseded downstream stage, or reusable historical artifacts

**Cues:** “旧版还能不能用”, “新旧是不是完全一样”, historical replicate, fresh replicate, a later Stage 2 was wrong/superseded, reuse old trajectories/adapters/analyzer outputs, or publish old experiment artifacts.

**Automatic response:**

1. Resolve the exact scientific layer that changed. A downstream method being superseded does not automatically invalidate upstream evidence produced before it.
2. Classify each relevant artifact/run as `current`, `valid historical`, `superseded as current method`, or `invalid for a specific reason`; do not use “old” as a validity label.
3. Compare old/new protocol identity separately from stochastic realization: task schedule, model revision, prompt/harness, parser, temperature, horizon, update timing, and actual consumed rows/seeds.
4. Trace config into the real runtime call. A deliberate new seed is a new replicate; a parameter that was configured but never forwarded is a runtime-implementation correction. Do not collapse the two.
5. When the scientific role is the same but the realization differs, use `protocol-equivalent / realization-different / runtime-corrected` when those labels are supported by evidence.
6. Keep the current version primary for future experiments/reporting, but preserve valid historical data as reusable evidence. Link canonical artifacts at immutable HF/GitHub revisions and state private/public access honestly. On a public website, verify anonymous reachability of every artifact presented as public; owner-authenticated access is insufficient. If the full canonical archive must stay private, use a separately audited minimal public mirror and keep the private archive as the scientific/preservation source.
7. On the website, explain both the numeric difference **and what it means**. Do not imply the current version is guaranteed to score higher merely because extra decoding filters were disabled.
8. If the superseded stage made zero parameter updates, point to the unchanged entry state rather than inventing a new checkpoint. Distinguish measured zero, `not run`, `Pending`, invalid, and N/A.
9. Separate immutable archive bytes from mutable explanatory README/head state. Require restore/hash verification for archive claims, but do not treat remote verification as local deletion authority.
10. Preserve a bounded local engineering-smoke bundle when fast adapter/runtime recovery remains useful; deletion of raw run roots requires a separate explicit authorization.
11. For a still-running replacement experiment, separate frozen protocol from time-bounded live progress; publish the latter only as a dated receipt-backed snapshot.
12. If the same multi-carrier harness makes 3B/7B diverge sharply in action validity, do not label the smaller model weak or the parser broken from aggregate score alone. Compare matched task/schedule prefixes, split format errors from state-inadmissible actions, trace each carrier from upstream artifact to the concrete WebShop runtime bridge, and treat any changed consumption contract as an explicit successor/amendment rather than an in-place hotfix. Load the OpenEVO 2.0 harness-redesign retrospective for the worked case.

Historical cases: [`../history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md`](../history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md), [`../history/2026-08-31-superseded-stage2-archive-ceiling-publication-retrospective.md`](../history/2026-08-31-superseded-stage2-archive-ceiling-publication-retrospective.md), and [`../history/2026-08-31-openevo2-harness-redesign-and-lineage-publication-retrospective.md`](../history/2026-08-31-openevo2-harness-redesign-and-lineage-publication-retrospective.md).

---

## TRIGGER: external hindsight teacher / API cost / MiniMax–GLM–Kimi–GPT comparison

**Cues:** “MiniMax 当外部教师”、SEED GLM-5.2 teacher、Kimi/GPT teacher comparison、teacher intelligence、hindsight quality、API/token cost、same-token fairness、Token Plan、console usage does not match experiment totals.

**Automatic response:**

1. Resolve the model's **actual experimental role** before choosing a benchmark. In H1.46 MiniMax-M3 is a post-episode trajectory analyzer, not the WebShop actor.
2. Read `minimax-h146-frozen-facts-2026-08-30.md` first and do not edit it in place; corrections require a new dated superseding fact record.
3. Read `minimax-h146-teacher-intelligence-cost-analysis.md` for the current WHTB / quality-cost comparison design.
4. Prefer experiment-side per-request/per-arm receipts over screenshots or account totals; use provider account exports as reconciliation evidence, not as automatic treatment attribution.
5. Keep `primary scientific treatment`, `account-window activity`, `public pay-as-you-go equivalent`, `incremental prepaid charge`, and `Token Plan amortized economics` separate. Never infer the last item without the plan purchase/allowance evidence.
6. For cross-provider fairness, prefer **same semantic workload** plus **same-dollar budget**. Raw token equality is not a clean control across tokenizers, reasoning-token policies, and cache accounting.
7. Re-verify current exact model IDs, prices, lifecycle, and public benchmark claims from first-party sources before filling Kimi/GLM/GPT cells. If current verification is unavailable, leave them pending.
8. Do not rerun a historical API analysis merely to recover a quantity already frozen in receipts; a rerun changes cache/provider/time conditions and cannot recreate historical billing exactly.
9. If the question is “which teacher is smarter for this experiment?”, use the role-matched WHTB idea: same frozen WebShop trajectories + same pinned SEED prompt/parser/schema + blind teacher-quality scoring + downstream student utility. Generic GPQA/AIME/SWE-bench scores are only background.
10. When publishing, keep measured quality, tokens, dollars, latency, and downstream utility on separate axes; “cheaper” is not “smarter”.

Historical friction record: [`../history/2026-08-30-minimax-hindsight-teacher-intelligence-cost-retrospective.md`](../history/2026-08-30-minimax-hindsight-teacher-intelligence-cost-retrospective.md). It includes the 14.01M-vs-27.66M reconciliation, OpenAI-compatible-vs-provider confusion, cache attribution limits, exact-head Preview churn, moving-`main` recovery, and the discovered English-route/hreflang gap.

---

## TRIGGER: a previously Pending experiment/result slot has completed

**Cues:** the server run says COMPLETE; a final evaluation/checkpoint sweep just finished; the user asks to fill a pre-built Results page; an individual arm closes while other arms are still running.

**Automatic response:**

1. Read `experiment-result-publication-workflow.md` and resolve the exact upstream completion marker, machine-readable result status, expected row/checkpoint count, model identity, panel/protocol identity, and claim boundary before editing the site.
2. Treat the old website Pending state as a slot to fill, not as scientific authority. Never turn an in-flight snapshot, ETA, missing update, or absent artifact into final `0`.
3. If the question is about progression across checkpoints, inspect the whole comparable curve; do not infer monotonic capability from base/final endpoints or monotonic training loss.
4. Keep Task Score, exact success, action validity, rollout volume, admitted data, and optimizer updates distinct.
5. Search all derived website surfaces for the old state and update the detail page, result index, joint matrix, deeper analysis, tests, and bilingual metadata together when they are owners of the same fact. Leave unfinished arms Pending.
6. If a post-hoc sweep reused the formal panel, record that the panel has now been inspected for model/checkpoint selection purposes and must not silently remain “fully unseen”.
7. Validate source and Production separately. A skipped/ignored Preview or a GitHub provider `success` context is not proof that exact-head Preview acceptance executed.

Historical cases:

- [`../history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](../history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md) — Pending scaffold and checkpoint fill-in;
- [`../history/2026-08-30-openevo-capability-exploration-series-retrospective.md`](../history/2026-08-30-openevo-capability-exploration-series-retrospective.md) — continuation through native visualization, factor-selector UX, series naming/navigation, and final release friction.
- [`../history/2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md`](../history/2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md) — a Results table re-published stale Pending state until a fresh upstream audit proved the MiniMax final had already closed; includes real-zero-vs-missing, stale-test, mobile-table, and release-gate recovery lessons.

---

## TRIGGER: offline lab server / SSH / SFTP / rsync / no outbound internet

**Cues:** online workstation prepares code/data; GPU server is isolated; artifacts cross a private transfer boundary.

**Automatic response:** treat the online workstation as preparation + Git truth and the GPU server as execution target. Freeze revision and manifests before transfer, stage Linux/CUDA-compatible dependencies/model/data/indexes, hash the bundle, verify hashes/GPU topology server-side, run the smallest smoke before training, and export compact provenance/results back to Git. SFTP is transport, not version control.

Never publish hostnames, usernames, VPN endpoints, tokens, or unnecessary personal infrastructure details; load `personal-compute-profile-consumer.md`.

---

## TRIGGER: time estimate, GPU rental cost, or current compute catalog

**Cues:** hours, cost, current SKU/inventory, whether local compute is enough.

**Automatic response:** use current first-party provider evidence; distinguish public catalog from logged-in inventory; show arithmetic and label assumptions; do not call a planning range a measurement. Once stable real-run timing exists, replace priors with measured throughput and preserve the configuration/hardware context that makes the timing meaningful.

---

## TRIGGER: user-visible copy, beginner explanation, research narrative, or broad UI rewrite

**Cues:** heading/introduction/callout/status copy, `说人话`, `不要 AI 味`, `自然一点`, “make this easier to understand”, technical explainer, research result story, onboarding, bilingual rewrite, process/evidence visual, or the owner says previous readability fixes/standards/examples have repeatedly failed.

**Automatic response:**

Treat explicit live-page feedback as product/repository work when the owner asked for the page to be fixed; do not substitute an account-memory update for implementation, case deposition, sibling audit, or regression protection. Repository persistence and long-term memory are separate receipts.

1. Load the writing stack from `docs/agents/README.md` by responsibility, not by filename count.
2. Read `website-design-spec.md`, `website-copy-cases.md`, and `human-preference-learning-system.md` for every user-facing copy/design task. **Before the first substantial draft, run `npm run feedback:retrieve -- --contract=<reader-contract> "<page role + feedback cue + reader problem>"` when a Reader Contract exists.** Use the returned Preference Model + Gold Pairs + source cases as pre-write context. When the owner gives live-page wording/readability feedback or reports a repeated comprehension problem, read a **case cluster**: current/closest case plus at least two nearby cases from the same failure family. Do not wait for the owner to repeat “说人话 / 去 AI 味”, learn from one specimen, or apply a word blacklist.
3. For any public technical copy read `audience-centered-technical-copy.md`.
4. For research/result copy also read `reader-first-copy-hierarchy.md` and `research-editorial-style.md`.
5. For Chinese technical explainers add `layered-technical-explainer-copy.md`, but treat its layers as information-depth guidance rather than mandatory visible labels/blocks. The canonical website spec and newer live-human PREFERENCE cases outrank an older rigid display template.
6. For a visible page/structure change apply `human-thinking-web-expression-contract.md` and the relevant UI/knowledge-architecture owners. **Before writing or substantially rearranging public-page HTML, read `site-reader-attention-contract.md` and register/update that page in `src/data/siteReaderContracts.ts`: audience, one primary task, first-viewport goal, non-hideable boundary, next step, and attention mode. Do not start from a visual template.**
7. Enter the subject directly; put decisive facts/conclusions/numbers before stage directions and long explanation; keep claim -> evidence -> inference -> boundary intact.
8. Treat run IDs, SHAs, and campaign labels as provenance unless the reader genuinely needs them for orientation.
9. Review the whole affected reading journey rather than patching one sentence into an incoherent page.
10. Before editing sibling pages, synthesize the case cluster into one reusable rule plus its boundary (“what this rule does not mean”). Build a search signature from semantic positions (H1/H2/H3, lede, nav, table subject, result card, status/callout, sibling route) and only then add lexical hints from the examples.
11. Scan all relevant production copy owners and repeated/sibling routes for that rule. Classify findings as **high-confidence same-family**, **uncertain**, or **intentional exception**. Fix high-confidence instances in the same coherent change; leave uncertain cases for review instead of mechanically rewriting them.
12. If the learned pattern is mechanically detectable, add or extend an audit/test so the same failure family cannot silently return. The guard should encode the generalized rule when possible, not only the one rejected sentence.
13. If the user identifies a mistake in a **semantic level** (for example who owns an action transition, which layer is evidence, or what state persists), audit every sibling visual/copy surface that encodes the same level: lede, canonical figure, sibling stages, static prose, summaries, and tests. Do not fix only the named specimen.
14. If one member of a repeated experiment/report family changes presentation grammar, identify sibling routes and the shared semantic owner before patching. Propagate through the shared component/primitive when the semantic object is the same, add structural coverage that discovers future siblings, and preserve intentional visual differences where the semantic object genuinely differs.
15. Apply `REPEAT-CORRECTION` and the correction-to-action witness in `project-agent-operating-principles.md` before the next affected action. Apply §10.10 of `human-thinking-web-expression-contract.md` to five-question orientation, actual dependency topology, readable text size, and desktop-versus-mobile scope. When the owner reports repeated comprehension failure despite prior prose standards, do not answer with another wording guide alone. Audit the shared semantic owner and sibling routes; establish typed required fields/state when practical; add negative cases and rendered reader-journey checks to the normal Gate; and keep explicit coverage labels so contextualized pages are not reported as fully rebuilt. **For material copy/layout work, run `feedback:cold-read` Phase A before revealing preferences, then Phase B and a `feedback:judge` receipt when an independent reviewer is available.** Structural/visual PASS, preference-judge PASS, and measured human-comprehension evidence remain separate receipts.
16. **Advisor briefing / slides / projected-deck specialization:** before the first substantial screen, classify the artifact role and compile the current Preference Brief. Write the scientific story as observable question/evidence pivots before arranging slides. Before a result table or chronology claims to cover the experiment family, inventory model/arm identities and terminal metrics from the live experiment authority; the current website is publication state, not experiment-inventory authority.
17. In the main briefing, treat engineering validity as a prerequisite rather than an automatic research highlight. Keep an engineering fact on the main path only when it changes scientific interpretation, eligibility, identifiability, or causal attribution; otherwise route hashes, recovery, reproducibility proof, and deep derivations to linked technical depth.
18. `HTML` is an implementation medium, not a visual-style reset. For an explicit projected deck, preserve the owner-learned presentation composition and current device-scope rule from the HPL system instead of silently converting it into a generic long-form webpage or reusing a stale fixed-phone canvas rule.
19. **HPL / feedback-learning retrieval parity:** when the task itself is about真人反馈、案例簇、Gold Pair、Preference Brief、cold read or judge, verify that the compiled Preference Brief retrieves the relevant workflow Event/trajectory using those cues. Do not require unrelated `Preview/build` words to make feedback-learning evidence appear, and do not inject the fast-Preview workflow unless Preview/build/review cues are actually present. If low-level retrieval and the compiled Brief disagree, treat that as a retrieval bug and fix the cue owner rather than padding the query or broadening scopes.

When source-owner coverage/exemptions change, update the maintained `audience-copy-audit-2026-08-12.md` inventory and run the copy audits. Its date marks the original audit baseline; it remains current only because it is deliberately maintained as the owner inventory.

Reader-journey repeat-failure case: [`../history/2026-09-07-reader-journey-experience-retention.md`](../history/2026-09-07-reader-journey-experience-retention.md) records why earlier style-guide-only fixes did not hold, the executable-contract repair, stale-check/worktree/provider/tool-path friction, and the exact separation between engineering acceptance and real human comprehension.

Attention-contract case: [`../history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md`](../history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md) records the direct first-run wording feedback, the correction from “Apple-looking” to cognition-first design, case-cluster propagation, the 50-page-source fail-closed contract, moving-main/redirect/WebKit/Preview friction, and why existing prose rules alone were not enough.

Historical table-family case: [`../history/2026-08-31-arxiv-like-experiment-table-family-retrospective.md`](../history/2026-08-31-arxiv-like-experiment-table-family-retrospective.md) records the 7B paper-table refinement that became a shared capability-exploration report contract, including mobile local-scroll semantics, moving-main synchronization, stale-test repair, protected-Preview authentication friction, and exact-head release closeout.

---

## TRIGGER: actionable content / commands / generated artifacts

**Cues:** code, commands, prompts, paths, SHAs, JSON/YAML, citations, downloadable files, generated decision memos/results.

**Automatic response:** ask what the user needs to click at the content location. Use the shared actionable-content primitives for copy/open/download/save as appropriate; preserve keyboard/mobile/text-selection behavior and feedback. Do not make users retype or reconstruct reusable output. Read `actionable-content-ux.md` when the surface is non-trivial.

---

## TRIGGER: blocked tool, unavailable connector, credentials, or secret injection

**Cues:** provider unavailable, tool lacks access, API token/Account ID, proposed plaintext secret in a private repo, GitHub Secrets assumptions.

**Automatic response:**

1. Separate repository state, provider state, local-only state, and human authorization.
2. Try another safe entrypoint before escalating tools; use the narrowest surface that actually owns the missing state. A tool/schema listing, one HTTP/Git transport error, or a vanished output stream is not proof that the underlying capability is absent.
3. Do not relax a hard constraint merely to produce an output.
4. Never commit a live bearer token as ordinary Git content, even in a private repository.
5. Prefer execution-environment secret injection, authenticated provider tooling, OS/keychain-backed state on a trusted machine, or an integrated secret manager.
6. Do not assume GitHub secret APIs return decrypted values to an unrelated Agent runtime.
7. Re-check current provider/Agent capabilities before treating an old limitation as permanent.

---

## TRIGGER: hosting/platform modernization or legacy-provider reactivation

**Cues:** “should we switch stack?”, Vercel vs Cloudflare, Workers migration, React/Astro/Next.js rewrite, restore an old provider.

**Automatic response:** decompose application stack, deployment ownership, product identity/domain, and provider-native services. Inspect current requirements and first-party behavior before changing architecture. Do not rewrite Astro/React merely because deployment ownership changes. A historical Cloudflare/Workers shadow or pilot is evidence, not a pending migration step. Reactivating legacy Production is a new architecture/release decision requiring fresh evidence and explicit owner intent.

---

## TRIGGER: overlapping PRs / large cross-site change

**Cues:** multiple open PRs touch the same docs/page/layout/policy; an old branch encodes an earlier product/scientific state.

**Automatic response:** read [`multi-pr-semantic-integration-playbook.md`](multi-pr-semantic-integration-playbook.md), then inspect base/head, changed files, checks, shared owners, and semantic intent. Prefer current `main` plus the still-valid contribution; for shared registries/owners transplant only the narrow current-valid entry instead of copying an older whole-file blob. Do not resurrect stale scientific/deployment state merely to keep an old PR mergeable. If the owner is still iterating one route/deck/surface, designate one survivor product PR and keep applying same-surface corrections there unless a real authority/base/authorization boundary requires a successor. Use one coherent integration head when several independent accepted changes must ship together. Close/supersede obsolete duplicate PRs once the replacement is clear.

---

## TRIGGER: reusable lesson discovered

Persist only when the lesson is likely to recur or expensive to forget. Current cross-task rule -> update its existing `current/` owner; short-lived live state -> `LATEST.md`; reusable incident/migration rationale -> `history/`; pre-current superseded milestone/context -> `archive/`; task-local scratch -> do not persist.

## TRIGGER: retrospective, handoff, or experience retention

**Cues:** the owner asks to review a conversation end-to-end, extract lessons,
record repeated mistakes, update Agent memory, write a handoff, or explain why a
previous retrospective did not prevent recurrence.

**Automatic response:**

1. read [`../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md`](../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md); it is BaseModel's navigation-only entrypoint to the single canonical protocol in `mykcs/openevo-experiment`; never duplicate the protocol body here;
2. read the root Agent router, current Agent principles, documentation index,
   scenario registry, and the task's current scientific/engineering owner;
3. search existing current policies and history before creating a new file;
4. separate stable rules, project-specific lessons, and temporary state;
5. promote only cross-task rules to the existing current owner or executable
   guard; put causal incident detail in an indexed history case;
6. update the trigger/index so a future Agent can discover the case;
7. check whether a real memory-write capability exists; never claim that a
   search, repository commit, or conversation summary was written to long-term
   memory;
8. before summarizing “blocked/done”, reconstruct the outcome from exact refs, PR/check/provider/test artifacts rather than trusting a previous assistant sentence or arbitrary working-tree file;
9. record what was deliberately not persisted and why; if a rule already existed but was violated, identify the missing use-site witness rather than claiming the rule was absent;
10. correct dated snapshots that masquerade as current authority by adding an explicit historical scope and current-owner pointer, without changing their recorded facts; report memory-write availability separately from repository persistence.
11. **Tool/connector capability discovery must stay read-only.** Use schema/list/search/fetch/read operations to confirm an available action or current state; never call `create` / `update` / `delete` merely to prove a connector works. If an accidental probe write occurs, clean only that exact object immediately, verify the cleanup, and record the recurrence instead of hiding it.
12. **Before any permitted closeout mutation, bind the target noun to the exact action.** Record a compact `REPEAT-CORRECTION` witness such as `open PR -> create_pull_request`; if the chosen tool/action names a different object (`create_branch`, `update_ref`, `create_file`, etc.), stop before dispatch. A nearby write capability is not an acceptable substitute for the intended mutation.
13. **Escalate repeated action-selection mismatch by changing execution surface.** If a provider write still targets the wrong object after an explicit target→action witness, stop using that ambiguous mutation surface for this task. Clean and verify the accidental object, then switch to a programmatic path whose intended object/action is visible in one explicit command or schema (for example `gh pr create` for opening a PR). Do not keep retrying the same connector mutation until it happens to hit the right action.
14. **Do not double-ingest a conversation that already ran Human Preference Learning closeout.** Treat the machine-readable HPL ledger/events/trajectory as predecessor evidence. Conversation-lessons closeout should add only the still-missing operational, engineering, authority-routing, or knowledge-system lesson; link the existing HPL owner instead of creating a second CASE, reclassifying visual tiers, or counting the same owner correction twice.

**Refresh cue:** current refs, provider behavior, deployment policy, model/runtime
behavior, and live resource state must be re-checked when the next task begins.

## Trigger maintenance

Keep this registry short enough to scan. When a scenario becomes a normal standing rule, move detail into the owning current doc and leave only the trigger here. Remove triggers that describe already-completed migrations as future work.
