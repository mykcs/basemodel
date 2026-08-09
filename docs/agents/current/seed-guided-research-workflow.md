# SEED guided research workflow

Last reviewed: **2026-08-10**

This document preserves the durable product/workflow decisions from the SEED-guided Basemodel walkthrough. It is intentionally **not** a chat transcript. Future Agents should use it to understand what the SEED guide is supposed to teach, which existing product capabilities it connects, and which claims must remain bounded by evidence.

## Why this exists

Basemodel already had substantial research functionality before the SEED guide was added: model and paper exploration, family/landscape views, model Quick View, Research Workspace, Compare, Decision Memo/snapshots, evidence/data-status surfaces, bilingual routes, theme support and URL-shareable state.

The SEED work did **not** invent all of those features. Its product contribution was to turn them into one coherent, teachable research workflow so that a new researcher can start from a real paper and learn how to use the site end to end.

The guiding principle is:

> Do not teach the site as a menu of unrelated features. Teach it as a research decision process using a concrete paper, concrete checkpoints, explicit constraints, evidence gaps and reproducibility goals.

## Implemented state

The walkthrough was merged through **PR #72 — `docs(guide): teach Basemodel end to end with SEED`**.

Squash commit on `main`:

`8130066f9bff2ea322647a2fd0e8cc81d87f2531`

The product change is intentionally small in code surface:

- `src/components/GuideContent.astro` — bilingual SEED walkthrough and direct workflow links;
- `src/components/GuideContent.test.ts` — source-contract regression for the key routes, terms and prefilled state.

The generic guide page metadata remains content-driven. Do not hardcode page title/lede in `src/pages/guide.astro` or `src/pages/en/guide.astro` merely to promote the SEED example.

## Canonical worked example

Paper:

**SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning**

Relevant repository content:

- `src/content/papers/seed.json`
- `src/content/guides/research-workbench.json`

The paper record is the evidence-backed source for the site-specific SEED representation. It includes the paper workflow, model roles, reproduction modes, paper-scale hardware information, learning-guide content and workspace prefill.

Important SEED model-role semantics currently represented by the site include:

- `qwen2-5-3b-instruct` — actor/policy backbone used as a weight-updated model;
- `qwen2-5-7b-instruct` — actor/policy backbone used as a weight-updated model;
- `qwen3-1-7b` — another paper-tested actor/policy backbone;
- analyzer role is methodologically distinct from the deployed learned policy.

Do not turn the presence of a newer model into an automatic recommendation to replace the paper model. Strict reproduction, method reproduction and modern rerun remain different research questions.

## Canonical SEED workflow links

These routes are part of the guide contract and should remain valid unless the product deliberately changes its URL/state model.

### Paper

`/papers/seed/`

Purpose: understand the method, model roles, benchmarks, code/checkpoint availability and reproduction modes before choosing a replacement model.

### Original/anchor checkpoint

`/models/qwen2-5-3b-instruct/`

Purpose: inspect the actual checkpoint semantics, weight access, RL suitability, runtime evidence, license, revision evidence and unresolved fields.

### Model Explorer prefilter

`/models/?q=qwen2.5&rl=true&paperUse=true`

Purpose: start from models relevant to the paper and RL use rather than browsing a global catalog without context.

### Method-reproduction Workspace prefill

`/workspace/?v=2&mode=method&paper=seed&model=qwen2-5-3b-instruct&role=actor&roles=actor%2Canalyzer&update=rl&access=local&runtime=verl&open=1`

Purpose: load a concrete research task, then let the researcher add their own real hardware/resource constraints rather than pretending the paper configuration is automatically feasible locally.

### Comparison example

`/compare/?models=qwen2-5-3b-instruct,qwen3-1-7b&diff=1&impact=1`

Purpose: demonstrate that model substitution should be evaluated through experimental differences/impacts, not by the shortcut “newer model = better replacement”.

## The 12-step teaching path

The guide should continue to teach these capabilities as one sequence.

1. **Home / research modes** — distinguish strict reproduction, method reproduction and modern rerun. For a first SEED walkthrough, method reproduction is the most useful teaching mode; do not start with a generic “best model” question.
2. **Global search** — use `⌘K` / `Ctrl+K` to search SEED and model checkpoints, reinforcing the distinction between a paper and a checkpoint.
3. **Paper Explorer / SEED detail** — inspect model roles, weight updates, code/checkpoint state, benchmarks, method structure and reproducibility evidence.
4. **Quick View / model detail** — inspect checkpoint identity, weights, RL/runtime fit, license, revision evidence and unknowns. `not_verified` is not equivalent to `false`.
5. **Model Explorer** — use query/vendor/family/generation/architecture/checkpoint/modality/parameter filters, quick filters and decision/data/timeline views to form candidates.
6. **Families / Landscape** — separate the paper-time model from the current family/model landscape; do not silently rewrite history with today’s newest generation.
7. **Research Workspace** — start from the prefilled SEED method task, then add the researcher’s actual GPU, VRAM, precision, context, batch and access constraints.
8. **Resource planning / candidate fit** — treat VRAM output as a heuristic planning estimate affected by precision, context, batch, LoRA rank, optimizer, KV cache and GPU count; it is not measured hardware evidence or a run guarantee.
9. **Compare** — compare up to the product limit, expose differences, impacts and unknowns, and preserve share/export behavior such as Markdown, CSV, BibTeX and URL state.
10. **Decision Memo / snapshots** — preserve local decision history and field-level changes. Local persistence/project/snapshot features must not be described as account-backed cloud storage.
11. **Evidence / Data Status / Methodology** — verify checkpoint, hardware, benchmark, code, weight and revision claims; preserve semantic unknown states and expose data-issue reporting rather than filling gaps with guesses.
12. **Language / theme / shareability** — equivalent Chinese/English paths, local theme state and canonical Workspace/Compare URLs are part of the usable workflow, not decorative extras.

## Three misuse warnings that must remain explicit

### 1. Newer does not automatically mean better for reproduction

A current-generation model may be interesting for a modern rerun while being a poor strict-reproduction substitute. The product should show the research consequence of replacement rather than silently upgrading the model.

### 2. Downloadable/callable does not mean reproducible

Weight access, API access, exact checkpoint/revision availability, license rights, runtime compatibility and evidence quality are separate facts.

### 3. Local project state is not cloud collaboration

LocalStorage, local snapshots, exported JSON/memos and shareable URLs are useful product capabilities, but they do not constitute account identity, cross-device cloud save, team permissions, realtime collaboration or a server database.

## Research-integrity guardrails inherited from the broader product contract

The SEED guide must remain consistent with `current/product-and-research-integrity.md`:

- unknown is not false/zero/absent;
- open weights is not synonymous with open source;
- release dates/model IDs must not be fabricated into reproducible revisions;
- paper method summary is distinct from model-selection rationale;
- benchmark values are contextual observations, not universal model scores;
- paper model roles matter;
- hardware catalog tiers, heuristic estimates and measured results are different evidence levels;
- recommendation output should expose tradeoffs rather than hide them in one score;
- “done” means the behavior is reachable through the real product path, not merely that a helper/component exists.

## Validation and deployment evidence

The guide change added a lightweight source-contract test in `src/components/GuideContent.test.ts`. Its job is to prevent accidental removal of the core SEED routes, workflow prefill and important terminology such as `⌘K`, Markdown/CSV/BibTeX, semantic unknowns and the local-vs-cloud boundary.

Cloudflare Pages successfully built a Preview containing the new SEED tutorial component during PR #72. An observed successful preview was associated with an earlier PR commit that already contained the tutorial component.

Do **not** rewrite that evidence into a stronger claim than it proves:

- the final PR was squash-merged to `main` as `8130066f...`;
- the available web/GitHub tooling during the original session did not expose a direct Cloudflare Production-deployment-to-Git-SHA query;
- therefore future Agents must not cite that earlier Preview as independent proof that Production was serving the exact final merge SHA at that moment.

If exact Production provenance matters, verify it from Cloudflare deployment metadata or a production response that can be tied to the current build. Do not infer it solely from HTTP 200 on the public domain.

## Deployment architecture remains unchanged

This workflow did not change the steady-state architecture:

```text
GitHub (source / branch / PR)
-> Cloudflare Pages (Preview / deterministic deployment gate / Production / hosting)
```

GitHub Actions and GitHub Pages remain intentionally retired. Do not reintroduce either merely to validate a documentation/tutorial change.

Agent docs are excluded by the current Cloudflare Build Watch configuration, so documentation-only maintenance here normally should not consume a Pages build.

## How future Agents should modify this workflow

1. Read `/AGENTS.md`, `docs/agents/LATEST.md`, `current/product-and-research-integrity.md` and this file before broad changes to the research journey.
2. Inspect the current implementation and content rather than assuming this handoff is more current than `main`.
3. Preserve the distinction between **existing product capabilities** and **the guide that connects/teaches them**.
4. Keep SEED as a worked example, not a hardcoded assumption that all research tasks use the same model roles or reproduction mode.
5. If URLs/state contracts change, update the guide, direct links and `GuideContent.test.ts` together.
6. If research semantics change, update `current/product-and-research-integrity.md`; do not bury a methodology change only in UI copy.
7. Keep bilingual behavior equivalent.
8. Do not overclaim external facts or deployment evidence.
9. Prefer one coherent researcher workflow over adding disconnected controls.
10. When introducing a new tutorial paper, reuse the same research-decision structure rather than copying SEED-specific conclusions as universal rules.

## Product intent in one sentence

A researcher should be able to start with SEED, understand what the paper actually did, inspect the relevant checkpoint, form feasible alternatives under their own constraints, compare the methodological impact of replacement, inspect evidence/unknowns, and leave with a defensible decision record.