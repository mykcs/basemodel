# OpenEvo reproduction research page

Status: current product/content ownership
Routes:

- Chinese: `/guide/reproduction-c/openevo/`
- English: `/en/guide/reproduction-c/openevo/`

Primary component: `src/components/OpenEvoReproductionResearch.astro`
Entry surface: `src/components/GuideDecisionChapters.astro` → reproduction chapter → **复现 C · 真实案例** card.

## Purpose

This page is the research-extension child page for the SEED reproduction-C path. It explains the OpenEvo × WebShop / ALFWorld work as two simultaneous narratives:

1. **direct success route** — the shortest calibrated way to reproduce the scientific mechanism now;
2. **bug/learning route** — major technical failures, wrong assumptions, actual fixes, and the durable rule learned from each failure.

Do not collapse these into a generic chronological diary. The direct route must stay usable as a procedure, while the bug route explains why the procedure is shaped this way.

## Evidence/source boundary

The page must preserve these distinctions:

### Historical scientific evidence

The 2026-07-29 WEIYING/Kaggle/Colab run is a real core-path reference:

- real WebShop;
- Qwen2.5-3B-Instruct;
- Transformers backend;
- CUDA;
- real model actions;
- real reflector;
- evolution injection;
- gen0 → gen1.

A 0.0 reward is valid execution evidence. A 0.0 → 0.0 run is **not** evidence of performance improvement.

### Historical stub evidence

A prior OpenEvo `COMPLETED` proof used a documented stub path. It is useful as orchestration evidence but must not be described as a real WebShop scientific reproduction.

### Current RTX6 evidence

Do not claim current RTX6 OpenEvo × WebShop scientific reproduction is complete until fresh P0 runtime markers exist.

Current scientific hierarchy is:

- **P0:** real WebShop + CUDA Qwen + non-fallback action + real reflector + evolution injection + gen0→gen1;
- **P1:** freeze reproducible golden environment after P0;
- **P2:** vLLM → rollout → gateway → Docker → harness → evaluator infrastructure E2E;
- **P3:** scale/migrate using measured 3090 evidence.

P2 infrastructure success/failure must not be used to redefine P0 scientific success.

## Page structure contract

Keep these sections unless a deliberate content redesign replaces them with equivalent semantics:

1. current evidence boundary;
2. P0/P1/P2/P3 claim split;
3. remote architecture (ChatGPT/GitHub/Mac/RTX6 + control/asset/runtime planes);
4. direct 12-step success path;
5. machine-verifiable P0 criteria;
6. bug trail with symptom → wrong assumption → actual fix → durable rule;
7. reasoning-error synthesis / anti-tunnel-vision rules;
8. OpenEvo × ALFWorld interface-contract research plan;
9. durable takeaways.

## Technical facts currently taught

The direct WebShop route currently reflects these project-tested decisions:

- GitHub API snapshot is the robust control-plane fallback when normal Git transport/worktree ownership is unreliable;
- WebShop small data can be relayed from a fixed AgentGym commit through GitHub Contents/Blob API → Mac persistent cache → RTX6;
- OpenEvo stays pinned and validation patch application remains strict;
- WebShop old dependencies include `gym==0.24.0`, `env==0.1.0`, `train==0.0.5`, `pyserini==0.17.0`, `faiss-cpu`, plus current spaCy model needs;
- Pyserini is curated with `--no-deps` for this sparse-Lucene path and the real check is `LuceneSearcher`, not a top-level import;
- P0 runtime should prioritize CUDA Torch + Transformers + WebShop/OpenEvo overlay;
- vLLM is P2 infrastructure, not a P0 prerequisite;
- deterministic failures should not be blindly rerun with identical source;
- auto-pilot must be single-instance with latest-SHA coalescing.

These facts are derived from the active `mykcs/seed3090` experiment. If the experiment changes materially, update the source experiment docs first, then reconcile this teaching page.

## ALFWorld boundary

The ALFWorld portion is a research plan, not a claim that the adapter is already fully validated.

The page should teach interface archaeology before coding:

- task/instruction;
- reset;
- action parser/grammar;
- observation;
- terminal/done;
- reward/evaluator;
- trajectory serialization;
- seed/determinism;
- asset paths.

Proof should progress from static contract → real reset/action → real CUDA model action → episode reward → real evolution → optional infrastructure orchestration.

## Product integrity rules

- Do not use `COMPLETED`, “no exception,” unit tests, mocks, fallback-only actions, or environment setup alone as evidence that P0 is complete.
- Keep historical evidence and current runtime evidence visually/semantically separate.
- Do not describe a zero-reward tie as improvement.
- Do not present heuristics, estimates, or planned ALFWorld work as measured/validated results.
- When current experiment status changes, update the page boundary rather than silently rewriting history.

## UX ownership

The page is deliberately long-form and self-contained, but must remain mobile-readable:

- the existing Guide reproduction chapter contains a compact forward card into this child page;
- direct route = ordered steps;
- bug route = compact two-column cards on desktop, one column on mobile;
- P0 criteria = scannable proof grid;
- ALFWorld contract = horizontally scrollable table on narrow screens;
- bilingual content lives in one shared component via `locale`/`t()`;
- breadcrumb links back to the SEED reproduction guide / reproduction-C context.

Keep the child route under `/guide/reproduction-c/` so the information architecture makes the relationship explicit rather than creating a disconnected top-level guide page.

## Validation

A route/content change should run:

```bash
npm run verify:deploy
npm run build
```

Then inspect the exact Vercel Preview for:

- reproduction-C entry card appears in the Guide;
- both child routes return 200;
- no missing translation/layout imports;
- mobile and desktop readability;
- table overflow works on mobile;
- breadcrumb/backlinks resolve;
- no page claims current RTX6 P0 is complete without evidence.
