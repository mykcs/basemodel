# Scenario trigger registry

Last reviewed: **2026-08-31**

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

Completed Vercel pilot/adoption records live under `docs/agents/history/`; they explain why the current architecture exists but do not own today's release behavior. For the 2026-08-28/29 self-hosted-runner + Vercel-browser-offload + Cloudflare-smoke migration, including failed isolation/bootstrap attempts, CI-vs-deploy relevance mistakes, and the later Doctor-led safe disk/cache maintenance pass, read [`../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`](../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md).

---

## TRIGGER: Mac self-hosted runner health, disk pressure, or cache maintenance

**Cues:** MacBook CI, OrbStack runner, runner Doctor, disk full/low space, Docker cache, npm/pip/uv/pnpm cache, runner cleanup, machine-wide cache cleanup, LaunchAgent warning.

**Automatic response:**

1. Read `deployment-policy.md` § Mac runner lifecycle and inspect the executable `.github/runner/` scripts before acting.
2. Run the installed Doctor first; require the correct home/data-volume capacity, container isolation/health, GitHub `busy=false`, OOM/version state, and LaunchAgent state.
3. Inventory targeted roots and classify tool-owned cache versus active/warm state, rollback image/container, worktree, mixed-purpose directory, credentials-adjacent state, and OrbStack internals.
4. Separate runner state from machine-wide state. With zero host mounts, host npm/pip/uv/pnpm caches do not optimize CI; clear them only when the current task also authorizes host developer-cache maintenance and accept the next local cold download.
5. Before a mutating cache command, prove no relevant host package-manager or Docker/Buildx build process is active, resolve the real cache root, and confirm the current task authorizes that scope.
6. Prefer tool-owned cache cleanup; never bulk-delete `~/.npm`, `~/.cache`, OrbStack internals, runner writable state, images/containers, or registered worktrees from size output alone.
7. Measure the real free-space delta and rerun Doctor. Below 15% free remains a warning condition even when a bounded cleanup succeeded; stop rather than widening deletion scope without ownership evidence.

Historical evidence, command side effects, retained boundaries, and the 2026-08-30 79→102 GiB result: [`../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`](../history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md).

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

## TRIGGER: exact-head acceptance / `main` moved / provider says READY

**Cues:** a validated branch is behind `main`; another PR merged during a long task; Preview succeeded on an older head; provider status is green but the user asked to verify the real site.

**Automatic response:**

1. Compare the candidate head with current intended `main`.
2. Classify intervening changes by file, contract, provider config, research state, and shared UI ownership.
3. Synchronize when necessary without discarding newer intended semantics.
4. Re-run the required deterministic/browser acceptance on the new exact head for deploy-relevant work.
5. Verify provider metadata points to that commit and inspect the required real route/interaction/metadata.
6. A READY badge is not visual/product acceptance; a prior Preview is not evidence for a later synchronized tree.

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
6. Keep the current version primary for future experiments/reporting, but preserve valid historical data as reusable evidence. Link canonical artifacts at immutable HF/GitHub revisions and state private/public access honestly.
7. On the website, explain both the numeric difference **and what it means**. Do not imply the current version is guaranteed to score higher merely because extra decoding filters were disabled.

Historical end-to-end case: [`../history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md`](../history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md).

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

**Cues:** heading/introduction/callout/status copy, `说人话`, `不要 AI 味`, `自然一点`, “make this easier to understand”, technical explainer, research result story, onboarding, bilingual rewrite, process/evidence visual.

**Automatic response:**

1. Load the writing stack from `docs/agents/README.md` by responsibility, not by filename count.
2. Read `website-design-spec.md` for the canonical website voice, information order, and current “说人话 / 去 AI 味” preference. If the owner explicitly asks for human/natural/non-AI wording, also read `website-copy-cases.md` and match the closest historical pattern instead of applying a word blacklist.
3. For any public technical copy read `audience-centered-technical-copy.md`.
4. For research/result copy also read `reader-first-copy-hierarchy.md` and `research-editorial-style.md`.
5. For Chinese technical explainers add `layered-technical-explainer-copy.md`.
6. For a visible page/structure change apply `human-thinking-web-expression-contract.md` and the relevant UI/knowledge-architecture owners.
7. Enter the subject directly; put decisive facts/conclusions/numbers before stage directions and long explanation; keep claim -> evidence -> inference -> boundary intact.
8. Treat run IDs, SHAs, and campaign labels as provenance unless the reader genuinely needs them for orientation.
9. Review the whole affected reading journey rather than patching one sentence into an incoherent page.
10. If the user identifies a mistake in a **semantic level** (for example who owns an action transition, which layer is evidence, or what state persists), audit every sibling visual/copy surface that encodes the same level: lede, canonical figure, sibling stages, static prose, summaries, and tests. Do not fix only the named specimen.

When source-owner coverage/exemptions change, update the maintained `audience-copy-audit-2026-08-12.md` inventory and run the copy audits. Its date marks the original audit baseline; it remains current only because it is deliberately maintained as the owner inventory.

---

## TRIGGER: actionable content / commands / generated artifacts

**Cues:** code, commands, prompts, paths, SHAs, JSON/YAML, citations, downloadable files, generated decision memos/results.

**Automatic response:** ask what the user needs to click at the content location. Use the shared actionable-content primitives for copy/open/download/save as appropriate; preserve keyboard/mobile/text-selection behavior and feedback. Do not make users retype or reconstruct reusable output. Read `actionable-content-ux.md` when the surface is non-trivial.

---

## TRIGGER: blocked tool, unavailable connector, credentials, or secret injection

**Cues:** provider unavailable, tool lacks access, API token/Account ID, proposed plaintext secret in a private repo, GitHub Secrets assumptions.

**Automatic response:**

1. Separate repository state, provider state, local-only state, and human authorization.
2. Try another safe entrypoint before escalating tools; use the narrowest surface that actually owns the missing state.
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

**Automatic response:** inspect base/head, changed files, checks, shared owners, and semantic intent. Prefer current `main` plus the still-valid contribution; do not resurrect stale scientific/deployment state merely to keep an old PR mergeable. Use one coherent integration head when several accepted changes must ship together. Close/supersede obsolete duplicate PRs once the replacement is clear.

---

## TRIGGER: reusable lesson discovered

Persist only when the lesson is likely to recur or expensive to forget. Current cross-task rule -> update its existing `current/` owner; short-lived live state -> `LATEST.md`; reusable incident/migration rationale -> `history/`; pre-current superseded milestone/context -> `archive/`; task-local scratch -> do not persist.

## Trigger maintenance

Keep this registry short enough to scan. When a scenario becomes a normal standing rule, move detail into the owning current doc and leave only the trigger here. Remove triggers that describe already-completed migrations as future work.
