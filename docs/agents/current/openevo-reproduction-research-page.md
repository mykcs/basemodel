# OpenEvo × WebShop / ALFWorld reproduction guide

Status: current product/content ownership
Routes: `/research/seed-openevo/study/run/`, `/en/research/seed-openevo/study/run/`
Primary page shell: `src/components/OpenEvoSeedBenchmarksGuide.astro`
Archived implementation note: the former `OpenEvoReproductionResearch.astro` and
`GuideDecisionChapters.astro` owners were production-dead and retired in Phase 3.
The current execution path is owned by the live Guide and SEED × OpenEvo study routes.
General reproduction-page design contract: `docs/agents/current/reproduction-guide-design-principles.md`.

## Naming / information-architecture correction

This page is **not Reproduction C** and must never be labeled as such.

The owner clarified that the OpenEvo work is a reproduction/research track on the **WebShop and ALFWorld agent benchmarks discussed in the SEED paper**. The site's SEED “C” item refers to a separate speech-recognition-related misconception/path and is unrelated to this OpenEvo benchmark work.

Canonical Chinese title: **OpenEvo × WebShop / ALFWorld 复现指南**.
Canonical English title: **OpenEvo × WebShop / ALFWorld Reproduction Guide**.

Do not place the route under `/guide/reproduction-c/`, do not use a “复现 C” kicker, and do not backlink to “SEED 复现 C”.

## Design contract

This is an execution-first academic reproduction manual. The owner supplied the GDKVM reproduction page as the structural reference, but the durable rule is now codified separately in `reproduction-guide-design-principles.md`.

Preserve this execution schema:

`Scope → Environment → Get/Pin Code → Data Preparation → Runtime/Dependencies → Run → Outputs/Acceptance → next benchmark → Troubleshooting`

The page uses three reading layers:

1. **visual orientation** — topology, six-step route map, and evidence ladder;
2. **executable manual** — the narrow numbered reproduction flow;
3. **diagnostic depth** — local Troubleshooting disclosures and the final known-failure index.

Do not turn the page back into a dashboard, research-card gallery, architecture pitch, or chronological incident diary.

The original dual-line requirement is integrated asymmetrically: current success path owns the main reading flow; failure history is subordinate and appears only where it helps a blocked reader.

## HTML / visualization ownership

The web implementation should use HTML semantics to encode meaning rather than decoration:

- stable anchors + navigation for repeated jumping during execution;
- ordered lists for strict execution order;
- `<figure>` / `<figcaption>` for topology and dependency flow;
- native `<details>/<summary>` for optional diagnostic depth;
- `<aside>` for nearby constraints/evidence warnings;
- `<table>` for adapter/file/version contracts;
- `<pre><code>` for canonical commands and machine-verifiable expected output;
- definition-list semantics for claim levels where appropriate.

The top visual primer must answer before the long manual begins:

1. where work happens: ChatGPT/GitHub → lab Mac → RTX6;
2. what the execution order is;
3. what each evidence rung proves and does not prove.

Visualization must make it harder—not easier—to confuse setup success with scientific success.

## Scientific boundary

Historical 2026-07-29 WEIYING/Kaggle/Colab evidence is a real core-path reference: real WebShop, Qwen2.5-3B-Instruct, Transformers, CUDA, real model actions, real reflector, evolution injection, gen0→gen1. `0.0` is valid execution evidence; `0.0→0.0` is not improvement. Historical OpenEvo `COMPLETED` stub evidence is orchestration-only.

Do not claim current RTX6 OpenEvo × WebShop reproduction complete without fresh P0 artifacts.

- **P0:** real WebShop + CUDA Qwen + ≥1 non-fallback model action + numeric score + real reflector + non-empty evolution injection + gen0→gen1 + machine-verifier acceptance.
- **P1:** freeze successful golden environment.
- **P2:** vLLM → rollout → gateway → Docker → harness → evaluator infrastructure E2E.
- **P3:** scale/migrate from measured 3090 evidence.

P2 must not redefine P0.

## Required page order

1. Environment Setup — topology, Mac prerequisites, GPU safety.
2. Get & Pin Project Code — API snapshot, pinned OpenEvo, canonical bootstrap, strict patch validation.
3. Data Preparation — WebShop assets, pinned vendored source, Mac cache → validation → relay.
4. Runtime & Dependencies — Python ≥3.11 + CUDA Torch core, deterministic overlay, offline wheelhouse, Lucene gate; no P2 requirement.
5. Run WebShop Scientific P0 — canonical bootstrap and machine-verifiable criteria.
6. Outputs & Acceptance — STATUS/artifacts, result cache, separate P1/P2/P3 claims.
7. OpenEvo × ALFWorld next stage — interface archaeology and staged proof ladder; not yet validated one-command reproduction.
8. Troubleshooting — known-failure index and anti-loop rules.

## Canonical Mac command

```bash
gh api 'repos/mykcs/seed3090/contents/scripts/openevo_webshop/api_bootstrap.sh?ref=main' --jq .content \
  | python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' \
  | bash
```

Update implementation truth in `mykcs/seed3090` first, then reconcile this page.

## Current facts

- OpenEvo pin: `b9fac2e1f9a078229124c6fd3bd5ab1379c46d05`.
- Required WebShop small files: `items_shuffle_1000.json`, `items_ins_v2_1000.json`, `items_human_ins.json`.
- Data: pinned AgentGym copy → GitHub API → Mac cache → validation → rsync RTX6.
- Mac data cache: `~/.cache/seed3090-openevo-webshop/webshop-data/`; results: `~/.cache/seed3090-openevo-webshop/results/`.
- Curated stack includes `gym==0.24.0`, `env==0.1.0`, `train==0.0.5`, `pyserini==0.17.0`, `faiss-cpu`, spaCy support; validate sparse/Lucene with `LuceneSearcher`.
- P0 prioritizes CUDA Torch + Transformers + WebShop/OpenEvo; vLLM belongs to P2.

## Failure / anti-loop rules

Preserve layer, symptom, actual fix, durable rule for known failures: Git transport/worktree ownership; ancestor `.git`; malformed diff hunks; HF/Google data instability; hosted admission/billing mistaken for network failure; wrong runtime identity; P0/P2 scope confusion; zero-reward semantics.

If the same error class occurs twice under materially unchanged conditions, the next attempt must change a causal variable, not only retries/timeouts. Every 2–3 blocker rounds, re-check the original scientific goal.

## ALFWorld boundary

ALFWorld is a next-stage specification, not validated one-command reproduction. Map task/instruction, reset, action grammar/parser/admissible actions, observation, done, reward/evaluator, trajectory, seed/determinism, and asset paths before coding.

Proof: `static contract → real reset/action → real CUDA model action → complete episode + numeric reward → real evolution → optional P2 infrastructure E2E`.

## UX / validation

Use a narrow numbered academic-document flow beneath the visual primer, monospaced commands, progressive disclosure for local Troubleshooting, a compact failure index, mobile-safe code/tables, and shared bilingual content.

Never treat setup/stubs/mocks/fallback-only/clean exit/`COMPLETED` as P0.

Run `npm run verify:deploy` and `npm run build`, then inspect exact-head Vercel Preview for:

- corrected independent routes;
- visual primer legibility on desktop/mobile;
- topology labels remain understandable without color;
- six-step map anchors resolve;
- evidence ladder does not overclaim;
- native/progressively enhanced Troubleshooting remains accessible;
- TOC/anchors and commands remain readable;
- mobile overflow works for code/tables;
- current scientific evidence boundary remains truthful.
