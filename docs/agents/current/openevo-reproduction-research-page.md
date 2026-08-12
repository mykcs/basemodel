# OpenEvo reproduction research page

Status: current product/content ownership

Routes:

- Chinese: `/guide/reproduction-c/openevo/`
- English: `/en/guide/reproduction-c/openevo/`

Primary component: `src/components/OpenEvoReproductionResearch.astro`
Entry surface: `src/components/GuideDecisionChapters.astro` → reproduction chapter → **复现 C · 真实案例** card.

## Purpose

This is the execution-first child guide for the SEED Reproduction-C path. Its primary reader should be able to reproduce the experiment by moving from top to bottom without first learning the entire project history.

The page preserves two forms of knowledge:

1. **current success path** — what to do now;
2. **failure knowledge** — what failed before, why, and the durable rule learned from it.

The success path owns the main document flow. Failure knowledge appears as local `Troubleshooting` notes beside the relevant step and again as a compact diagnostic index near the end.

## Structural reference

The information architecture intentionally follows the owner-supplied GDKVM reproduction page as a structural template:

`Environment Setup → Get/Pin Code → Data Preparation → Runtime/Dependencies → Run → Outputs/Acceptance → next benchmark → Troubleshooting`

Use the same academic reproduction-manual mindset, not GDKVM-specific content. Do not copy its project-specific text, commands, claims, or implementation.

For executable sections, prefer this micro-pattern whenever practical:

1. short explanation;
2. command or concrete action;
3. expected result / acceptance condition;
4. troubleshooting note for a known failure at that exact layer.

Avoid turning the top half of the page back into a research essay, dashboard, card gallery, architecture presentation, or chronological incident diary.

## Evidence/source boundary

### Historical scientific evidence

The 2026-07-29 WEIYING/Kaggle/Colab run remains a real core-path reference:

- real WebShop;
- Qwen2.5-3B-Instruct;
- Transformers backend;
- CUDA;
- real model actions;
- real reflector;
- evolution injection;
- gen0 → gen1.

A `0.0` reward is valid execution evidence. A `0.0 → 0.0` result is **not** evidence of performance improvement.

### Historical stub evidence

A prior OpenEvo `COMPLETED` proof used a documented stub path. It may support orchestration claims but must not be described as real WebShop scientific reproduction.

### Current RTX6 evidence

Do not claim current RTX6 OpenEvo × WebShop scientific reproduction is complete until fresh P0 runtime markers exist.

Current scientific hierarchy:

- **P0:** real WebShop + CUDA Qwen + non-fallback model action + real reflector + evolution injection + gen0→gen1 + machine-verifier acceptance;
- **P1:** freeze the reproducible golden environment after P0;
- **P2:** vLLM → rollout → gateway → Docker → harness → evaluator infrastructure E2E;
- **P3:** scale/migrate using measured 3090 evidence.

P2 infrastructure success/failure must not redefine P0 scientific success.

## Required page order

Keep this linear order unless the owner deliberately changes the reproduction-manual template:

1. **Environment Setup** — topology, Mac prerequisites, GPU safety.
2. **Get & Pin Project Code** — GitHub API snapshot, OpenEvo pin, single bootstrap, strict patch validation.
3. **Data Preparation** — three WebShop JSON assets, pinned AgentGym source, persistent cache → validation → relay.
4. **Runtime & Dependencies** — Python ≥3.11 + CUDA Torch core, deterministic overlay, offline wheelhouse, Lucene gate, no P2 infrastructure dependency.
5. **Run WebShop Scientific P0** — canonical bootstrap and explicit machine-verifiable P0 criteria.
6. **Outputs & Acceptance** — STATUS/artifacts, persistent result cache, separate P1/P2/P3 claims.
7. **OpenEvo × ALFWorld next stage** — interface archaeology and staged proof ladder, explicitly not yet a validated one-command reproduction.
8. **Troubleshooting index** — compact symptom → fix records and anti-tunnel-vision rules.

## Current executable entrypoint

Expose one canonical Mac-side command rather than teaching the reader to manually rebuild the dispatcher:

```bash
gh api 'repos/mykcs/seed3090/contents/scripts/openevo_webshop/api_bootstrap.sh?ref=main' --jq .content \
  | python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' \
  | bash
```

Implementation details behind this entrypoint may evolve in `mykcs/seed3090`. Update the experiment repository first, then reconcile this page.

## Technical facts currently taught

- GitHub API snapshot is the robust control-plane fallback when normal Git transport/worktree ownership is unreliable.
- OpenEvo validation pin: `b9fac2e1f9a078229124c6fd3bd5ab1379c46d05`.
- WebShop small requires at least `items_shuffle_1000.json`, `items_ins_v2_1000.json`, and `items_human_ins.json`.
- WebShop data is acquired from a fixed AgentGym vendored copy through GitHub Contents/Blob API, stored in the Mac persistent cache, validated, then relayed to RTX6.
- Mac WebShop cache: `~/.cache/seed3090-openevo-webshop/webshop-data/`.
- Mac results: `~/.cache/seed3090-openevo-webshop/results/`.
- Current WebShop runtime stack includes pinned/curated dependencies such as `gym==0.24.0`, `env==0.1.0`, `train==0.0.5`, `pyserini==0.17.0`, `faiss-cpu`, and spaCy model support.
- The sparse/Lucene path validates `LuceneSearcher`; a superficial top-level import is insufficient.
- P0 prioritizes CUDA Torch + Transformers + WebShop/OpenEvo scientific execution. vLLM belongs to P2.

## Failure-knowledge contract

Known bugs must stay useful without overwhelming the main path. Preserve at least failure layer, observable symptom, actual fix, and durable rule.

Important classes already learned:

- Git transport/worktree ownership;
- ancestor `.git` misidentification;
- corrupt unified-diff hunk counts;
- HF/Google Drive data-source instability;
- hosted-service admission/billing failures misread as network failures;
- wrong Python/runtime identity causing cascaded dependency errors;
- scientific P0 vs infrastructure P2 scope confusion;
- zero-reward execution vs performance-improvement semantics.

Anti-loop rule: if the same error class occurs twice under materially unchanged conditions, the next attempt must change a causal variable instead of merely adding retries/timeouts.

Every 2–3 blocker rounds, re-check whether the work still serves the owner's original scientific claim.

## ALFWorld boundary

The ALFWorld section is not yet a claim of validated one-command reproduction. Before implementation, map task/instruction, reset, action grammar/parser/admissible actions, observation, terminal/done, reward/evaluator, trajectory serialization, seed/determinism, and data/game/cache paths.

Proof should progress:

`static contract → real reset/action → real CUDA model action → complete episode + numeric reward → real evolution → optional P2 infrastructure orchestration`

## Product integrity rules

- Never use `COMPLETED`, unit tests, mocks, fallback-only actions, environment setup, or a clean exit by itself as proof of P0.
- Keep historical evidence and current RTX6 evidence distinct.
- Never describe a zero-reward tie as improvement.
- Do not present planned ALFWorld work as measured results.
- Current reproduction procedure may change with evidence; historical failure knowledge should not be silently deleted after success.

## UX ownership

- Prefer a narrow academic-document reading column over dashboard-style grids.
- Number main sections and subsections.
- Commands use obvious monospaced blocks and remain horizontally scrollable on mobile.
- `Troubleshooting` notes sit immediately after the step they explain.
- Keep the final diagnostic index compact.
- Tables remain horizontally usable on narrow screens.
- Chinese and English share one component via `locale`/`t()`.
- Keep the child route under `/guide/reproduction-c/` and preserve the forward entry from the existing Guide reproduction chapter.

## Validation

For runtime/content changes:

```bash
npm run verify:deploy
npm run build
```

Then inspect the exact Vercel Preview for the Guide entry, both child routes, numbering/TOC/anchors, mobile command overflow, mobile table behavior, backlinks, evidence-boundary language, and overall execution-manual reading flow.
