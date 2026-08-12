# OpenEvo reproduction research page

Status: current product/content ownership
Routes: `/guide/reproduction-c/openevo/`, `/en/guide/reproduction-c/openevo/`
Primary component: `src/components/OpenEvoReproductionResearch.astro`
Entry: `src/components/GuideDecisionChapters.astro` → reproduction chapter → **复现 C · 真实案例**.

## Template contract

This is an execution-first academic reproduction manual. The owner supplied the GDKVM reproduction page as the structural template. Preserve:

`Environment Setup → Get/Pin Code → Data Preparation → Runtime/Dependencies → Run → Outputs/Acceptance → next benchmark → Troubleshooting`

Use its manual mindset only, not GDKVM project content. Executable subsections normally read: **explanation → command/action → expected result/acceptance → local Troubleshooting**.

The original dual-line requirement is integrated: the current success path owns the numbered main flow; failure knowledge appears beside relevant steps and in the final diagnostic index. Do not turn this back into a dashboard, research-card gallery, architecture pitch, or chronological incident diary.

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

Use a narrow numbered academic-document flow, monospaced commands, local Troubleshooting, compact failure index, mobile-safe code/tables, shared bilingual component, and `/guide/reproduction-c/` hierarchy. Never treat setup/stubs/mocks/fallback-only/clean exit/`COMPLETED` as P0.

Run `npm run verify:deploy` and `npm run build`, then inspect exact-head Vercel Preview for routing, TOC/anchors, commands, mobile overflow, backlinks, evidence boundaries, and execution-manual flow.
