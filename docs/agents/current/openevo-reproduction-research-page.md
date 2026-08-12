# OpenEvo reproduction research page

Status: current product/content ownership

Routes:
- Chinese: `/guide/reproduction-c/openevo/`
- English: `/en/guide/reproduction-c/openevo/`

Primary component: `src/components/OpenEvoReproductionResearch.astro`
Entry: `src/components/GuideDecisionChapters.astro` → reproduction chapter → **复现 C · 真实案例**.

## Template contract

This is an execution-first academic reproduction manual. A new reader should be able to move from top to bottom and run the experiment without first reading the complete project history.

The owner supplied the GDKVM reproduction page as the structural template. Preserve this order:

`Environment Setup → Get/Pin Code → Data Preparation → Runtime/Dependencies → Run → Outputs/Acceptance → next benchmark → Troubleshooting`

Use its manual mindset only; do not copy GDKVM-specific content. Executable subsections should normally read: **short explanation → command/action → expected result/acceptance → local Troubleshooting**.

The owner’s original two-line requirement is integrated into this structure:
- the **current success path** owns the numbered main flow;
- **failure knowledge** appears beside the relevant step and again in the final diagnostic index.

Do not turn the page back into a dashboard, research-card gallery, architecture pitch, or chronological incident diary.

## Scientific boundary

Historical 2026-07-29 WEIYING/Kaggle/Colab evidence is a real core-path reference: real WebShop, Qwen2.5-3B-Instruct, Transformers, CUDA, real model actions, real reflector, evolution injection, gen0→gen1. `0.0` reward is valid execution evidence; `0.0→0.0` is not improvement.

A historical OpenEvo `COMPLETED` stub path is orchestration evidence only. Do not claim current RTX6 OpenEvo × WebShop reproduction is complete without fresh P0 artifacts.

Current hierarchy:
- **P0:** real WebShop + CUDA Qwen + ≥1 non-fallback model action + numeric score + real reflector + non-empty evolution injection + gen0→gen1 + machine-verifier acceptance.
- **P1:** freeze the successful golden environment.
- **P2:** vLLM → rollout → gateway → Docker → harness → evaluator infrastructure E2E.
- **P3:** scale/migrate using measured 3090 evidence.

P2 must not redefine P0.

## Required page order

1. **Environment Setup** — control/acquisition/runtime topology, Mac prerequisites, GPU safety.
2. **Get & Pin Project Code** — GitHub API snapshot, pinned OpenEvo, canonical bootstrap, strict patch validation.
3. **Data Preparation** — required WebShop data, pinned vendored source, Mac cache → validation → relay.
4. **Runtime & Dependencies** — Python ≥3.11 + CUDA Torch core, deterministic overlay, offline wheelhouse, Lucene gate; no P2 infrastructure requirement.
5. **Run WebShop Scientific P0** — canonical bootstrap and machine-verifiable P0 criteria.
6. **Outputs & Acceptance** — STATUS/artifacts, persistent result cache, separate P1/P2/P3 claims.
7. **OpenEvo × ALFWorld next stage** — interface archaeology and staged proof ladder; not yet validated one-command reproduction.
8. **Troubleshooting** — known-failure index plus anti-loop rules.

## Canonical Mac entrypoint

```bash
gh api 'repos/mykcs/seed3090/contents/scripts/openevo_webshop/api_bootstrap.sh?ref=main' --jq .content \
  | python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' \
  | bash
```

Update implementation truth in `mykcs/seed3090` first, then reconcile this teaching page.

## Current technical facts

- OpenEvo validation pin: `b9fac2e1f9a078229124c6fd3bd5ab1379c46d05`.
- GitHub API snapshot is the control-plane fallback when Git transport/worktree ownership is unreliable.
- Required WebShop small files: `items_shuffle_1000.json`, `items_ins_v2_1000.json`, `items_human_ins.json`.
- Data path: pinned AgentGym vendored copy → GitHub Contents/Blob API → Mac persistent cache → validation → rsync to RTX6.
- Mac data cache: `~/.cache/seed3090-openevo-webshop/webshop-data/`.
- Mac results: `~/.cache/seed3090-openevo-webshop/results/`.
- Current curated WebShop stack includes `gym==0.24.0`, `env==0.1.0`, `train==0.0.5`, `pyserini==0.17.0`, `faiss-cpu`, and spaCy model support.
- Validate the sparse/Lucene path with `LuceneSearcher`.
- P0 prioritizes CUDA Torch + Transformers + WebShop/OpenEvo; vLLM belongs to P2.

## Failure knowledge

For each known failure preserve: layer, symptom, actual fix, durable rule.

Key classes: Git transport/worktree ownership; ancestor `.git`; malformed diff hunks; HF/Google data instability; hosted admission/billing misread as network failure; wrong runtime identity; P0/P2 scope confusion; zero-reward semantics.

If the same error class occurs twice under materially unchanged conditions, the next attempt must change a causal variable rather than only adding retries/timeouts. Every 2–3 blocker rounds, re-check the original scientific goal.

## ALFWorld boundary

ALFWorld is currently a next-stage execution specification, not validated one-command reproduction. Before coding, map task/instruction, reset, action grammar/parser/admissible actions, observation, terminal/done, reward/evaluator, trajectory serialization, seed/determinism, and data/game/cache paths.

Proof ladder: `static contract → real reset/action → real CUDA model action → complete episode + numeric reward → real evolution → optional P2 infrastructure E2E`.

## Product/UX rules

- Never treat `COMPLETED`, unit tests, mocks, fallback-only actions, setup success, or clean exit as P0 proof.
- Keep historical and current RTX6 evidence distinct; never describe a zero-reward tie as improvement.
- Do not present planned ALFWorld work as measured results.
- Preserve historical failure knowledge after later success.
- Use a narrow academic-document column, numbered sections/subsections, monospaced command blocks, local Troubleshooting notes, compact final failure index, and mobile-safe tables/code overflow.
- Chinese and English share one component via `locale`/`t()`.
- Keep the child route under `/guide/reproduction-c/` and preserve the Guide forward entry.

## Validation

Run `npm run verify:deploy` and `npm run build`, then inspect exact-head Vercel Preview for the Guide entry, both child routes, TOC/anchors, commands, mobile overflow, backlinks, evidence boundaries, and execution-manual flow.
