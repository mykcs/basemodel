# OpenEvo reproduction research page

Status: current product/content ownership

Routes:

- Chinese: `/guide/reproduction-c/openevo/`
- English: `/en/guide/reproduction-c/openevo/`

Primary component: `src/components/OpenEvoReproductionResearch.astro`
Entry surface: `src/components/GuideDecisionChapters.astro` → reproduction chapter → **复现 C · 真实案例** card.

## Purpose

This is the execution-first child guide for the SEED Reproduction-C path. Its primary reader should be able to reproduce the experiment by moving from top to bottom without first learning the entire project history.

The page still preserves two kinds of knowledge:

1. **current success path** — what to do now;
2. **failure knowledge** — what failed before, why, and the durable rule learned from it.

But these are no longer presented as two competing visual narratives. The current success path owns the main document flow; failure knowledge appears as local `Troubleshooting` notes beside the relevant step and again as a compact diagnostic index near the end.

## Structural reference

The information architecture intentionally follows the style of a concise academic reproduction manual such as the GDKVM reproduction page supplied by the owner:

`Environment Setup → Get/Pin Code → Data Preparation → Runtime/Dependencies → Run → Outputs/Acceptance → next benchmark → Troubleshooting`

This is structural inspiration only. Do not copy GDKVM project-specific text, commands, claims, or styling.

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

1. **Environment Setup**
   - ChatGPT/GitHub → lab Mac → RTX6 topology;
   - Mac prerequisites;
   - idle-GPU safety check.
2. **Get & Pin Project Code**
   - GitHub API snapshot rather than mandatory `git clone`;
   - pinned OpenEvo commit;
   - single bootstrap entrypoint;
   - strict patch validation.
3. **Data Preparation**
   - three required WebShop small JSON files;
   - pinned AgentGym vendored source;
   - Mac persistent cache → validation → rsync relay.
4. **Runtime & Dependencies**
   - Python ≥3.11 + CUDA Torch core first;
   - deterministic WebShop/OpenEvo overlay;
   - offline wheelhouse from Mac;
   - LuceneSearcher/index gate before GPU-heavy work;
   - no vLLM/gateway/Docker requirement for P0.
5. **Run WebShop Scientific P0**
   - single official bootstrap command;
   - explicit machine-verifiable P0 criteria;
   - longer run begins only after P0 pass.
6. **Outputs & Acceptance**
   - inspect `STATUS` and artifacts, not just process exit code;
   - persistent Mac result cache;
   - keep P1/P2/P3 claims separate.
7. **OpenEvo × ALFWorld next stage**
   - explicitly labeled as a next-stage execution specification until validated;
   - interface archaeology before coding;
   - staged proof ladder.
8. **Troubleshooting index**
   - compact symptom → fix entries;
   - anti-tunnel-vision rules.

## Current executable entrypoint

The guide should expose one canonical Mac-side command rather than teaching the reader to manually rebuild the dispatcher:

```bash
gh api 'repos/mykcs/seed3090/contents/scripts/openevo_webshop/api_bootstrap.sh?ref=main' --jq .content \
  | python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))' \
  | bash
```

The implementation details behind this entrypoint may evolve in `mykcs/seed3090`. If they do, update the experiment repository first, then reconcile this page.

## Technical facts currently taught

- GitHub API snapshot is the robust control-plane fallback when normal Git transport/worktree ownership is unreliable.
- OpenEvo validation pin: `b9fac2e1f9a078229124c6fd3bd5ab1379c46d05`.
- WebShop small requires at least:
  - `items_shuffle_1000.json`
  - `items_ins_v2_1000.json`
  - `items_human_ins.json`
- WebShop data is acquired from a fixed AgentGym vendored copy through GitHub Contents/Blob API, stored in the Mac persistent cache, validated, then relayed to RTX6.
- The Mac WebShop cache is `~/.cache/seed3090-openevo-webshop/webshop-data/`.
- Result artifacts are retrieved under `~/.cache/seed3090-openevo-webshop/results/`.
- WebShop runtime dependencies include the current pinned/curated stack such as `gym==0.24.0`, `env==0.1.0`, `train==0.0.5`, `pyserini==0.17.0`, `faiss-cpu`, and spaCy model support.
- The sparse/Lucene path validates `LuceneSearcher`; a superficial top-level import is not sufficient.
- P0 prioritizes CUDA Torch + Transformers + WebShop/OpenEvo scientific execution. vLLM belongs to P2.
- Deterministic failures must not be blindly rerun with identical conditions.

## Failure-knowledge contract

Known bugs must stay useful without overwhelming the main path. For each failure, preserve at least:

- failure layer;
- observable symptom;
- actual fix;
- durable rule.

Important classes already learned include:

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

The ALFWorld section is not yet a claim of validated one-command reproduction.

Before implementation, map:

- task/instruction;
- reset;
- action grammar/parser/admissible actions;
- observation;
- done/terminal;
- reward/evaluator;
- trajectory serialization;
- seed/determinism;
- data/game/cache paths.

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
- Number the main sections and subsections.
- Commands use obvious monospaced blocks and remain horizontally scrollable on mobile.
- `Troubleshooting` notes sit immediately after the step they explain.
- Keep the final diagnostic index compact.
- Tables must remain horizontally usable on narrow screens.
- Chinese and English share the same component via `locale`/`t()`.
- Keep the child route under `/guide/reproduction-c/` and preserve the forward entry from the existing Guide reproduction chapter.

## Validation

For runtime/content changes:

```bash
npm run verify:deploy
npm run build
```

Then inspect the exact Vercel Preview for:

- Guide reproduction-C entry card still resolves;
- both child routes return successfully;
- numbering/TOC/anchors work;
- command blocks do not overflow destructively on mobile;
- table remains usable on mobile;
- backlinks resolve;
- no current RTX6 P0 success is claimed without fresh evidence;
- the main flow reads as an executable reproduction manual rather than a research showcase.
