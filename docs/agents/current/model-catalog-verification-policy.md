# Model catalog verification policy

Last reviewed: **2026-08-28**

This document is the durable Agent contract for maintaining the model catalog in `mykcs/basemodel`. It preserves the reusable conclusions from the 2026-08-10 full-catalog audit without turning a dated snapshot into permanent truth.

The catalog is a research decision surface, not a marketing list. A model should only be presented as current, available, open, reproducible, trainable or suitable for a workflow when the repository has evidence for that exact claim.

## Read this before broad model-data work

Use this document together with:

1. `/AGENTS.md`
2. `docs/agents/LATEST.md`
3. `docs/agents/current/product-and-research-integrity.md`
4. this file
5. `docs/agents/current/deployment-policy.md`
6. `src/lib/schemas.ts`
7. `src/content/coverage/families.json`
8. `src/content/coverage/vendors.json`
9. the target files under `src/content/models/`

## Core rule: “latest” has more than one axis

Do not collapse these concepts into one value:

- latest hosted/API generation;
- latest downloadable/open-weight generation;
- latest base/foundation checkpoint;
- latest instruct/reasoning/coder checkpoint;
- latest flagship product model;
- latest model that is practical for academic reproduction.

A family can legitimately have a newer proprietary API generation while its newest usable open-weight research checkpoint belongs to an older generation. The Qwen audit on 2026-08-10 is the canonical example: the hosted line advanced beyond the newest first-party open-weight checkpoints. Future Agents must preserve this distinction instead of forcing a single “latest model” answer.

## Verification workflow

When asked to verify the whole site or a model family, use this order.

### 1. Inventory the repository first

Inspect:

- `src/content/models/*.json`;
- `src/content/coverage/families.json`;
- `src/content/coverage/vendors.json`;
- current family helper logic such as `src/lib/familyCoverage.ts`;
- validation/audit scripts exposed by `package.json`.

Do not assume a missing family-page entry means the model file is absent, or vice versa. The 2026-08-10 audit found both kinds of mismatch: models that existed but were not represented correctly by family coverage, and families/variants that were genuinely missing.

### 2. Verify against first-party catalogs

Prefer official sources in roughly this order:

- official model/API catalog;
- official model card / official weight repository;
- official release announcement;
- official license text;
- official code repository;
- official deprecation/retirement page.

Use third-party sources only when first-party evidence is unavailable, and label the evidence quality accordingly.

Match each source to the claim it can actually support. An official SDK changelog or first-party code repository can strongly confirm that a model ID exists or that a capability is supported, but it does not by itself prove flagship rank, complete family membership, or lifecycle state. Third-party aggregators, provider integrations and search results are discovery surfaces: use them to improve recall, then follow the lead to first-party evidence before changing production facts.

For vendors that have both hosted and downloadable models, verify both surfaces. A Hugging Face organization page alone is not enough to determine the newest hosted API model; an API pricing/catalog page alone is not enough to determine the newest downloadable base checkpoint.

A previous `catalog_checked_at` value or configured `refresh_days` is never a freshness guarantee. When the user asks for “today”, “latest” or “current”, or when first-party evidence newer than the baseline indicates movement, re-check the affected provider even if the nominal refresh interval has not elapsed. A broad audit can become stale the next day.

### 3. Verify the family, then individual checkpoints

For each family, answer separately:

- What is the current generation?
- What is the current flagship model?
- What are the current API model IDs represented by site model IDs?
- What is the current open-weight model, if any?
- Which current variants are flagship / foundation / instruct / thinking / code?
- Are there official sizes/checkpoints missing from `src/content/models/`?

Do not use provider API slugs where the site expects internal model IDs. In `current_api_model_ids`, use repository model IDs; keep provider slugs in `variants[].api_aliases` and model `access.api_model_ids`.

### 4. Verify lifecycle state, not only release state

A historical model may still have an API slug that redirects to a newer model. That does **not** mean the historical model itself remains callable.

Check first-party deprecation/retirement pages and distinguish:

- `active` / available;
- preview;
- legacy/deprecated;
- unavailable/retired;
- alias/redirection compatibility.

The 2026-08-10 audit corrected this class of error for historical hosted models such as Grok 3 and confirmed existing Gemini retirement records rather than re-editing already-correct data.

### 5. Map claims to evidence fields

A page-level source list is not proof for every field.

For important concrete facts, attach `sources[].supports` to the exact fields the source supports, especially:

- `vendor`;
- `family`;
- `generation`;
- `release_date`;
- `checkpoint.type`;
- `checkpoint.modalities`;
- architecture parameter/context fields;
- `access.weights_status`;
- `access.api_status`;
- `openness.license_name`;
- `openness.classification`;
- `openness.commercial_use`;
- runtime/research support fields.

If evidence does not support a concrete value, use a semantic unknown rather than an inferred number/boolean/tier.

## Semantic unknown contract

Production model data should prefer a **precise reason for missing information**:

- `not_disclosed` — the provider withholds the fact;
- `not_reported` — the reviewed first-party material does not report it;
- `not_published` — the relevant artifact/checkpoint has not been published;
- `not_applicable` — the field does not apply;
- `unavailable` — the capability/model is not available;
- `conflicting_evidence` — reliable evidence disagrees.

Do not use a guessed hardware tier, trainability claim, product availability or runtime claim merely because the model scale makes it seem likely.

### Important repository-specific Gate

`npm run audit:semantic` treats `not_verified` in production JSON as a legacy value that must be replaced by a more precise semantic state or verified fact.

This caused an intermediate Cloudflare Preview failure during the 2026-08-10 audit. The correct fix was **not** to weaken the Gate. The records were revised to precise states such as `not_reported`, `not_disclosed` and `not_applicable`, after which the exact PR head passed Cloudflare Preview.

Future Agents must preserve this behavior unless the repository owner deliberately changes the semantic contract across schema, UI, audits and documentation together.

## Openness / research-use rules

Keep these separate:

- downloadable weights;
- open-weight classification;
- open-source classification;
- base checkpoint availability;
- fine-tuning permission;
- derivative distribution permission;
- commercial-use permission;
- license name and conditions.

Do not infer “open source” from “weights downloadable”. Do not infer commercial or derivative rights without license evidence. For modified/custom licenses, record the conditions rather than flattening them into Apache/MIT-like semantics.

Similarly, do not infer LoRA/SFT/RL suitability, vLLM/SGLang/Transformers support or a VRAM tier from parameter count alone. If first-party documentation does not support the claim, use the appropriate semantic state.

## 2026-08-10 verified baseline

This section records what the audit changed. It is historical baseline evidence, **not** permission to skip re-verification later.

The audit was implemented in **PR #77 — `data: audit current model catalog as of 2026-08-10`**.

Notable corrections included:

- **Qwen** — represented the newer hosted Qwen3.7 generation separately from the current first-party Qwen3.6 open-weight research checkpoints; added missing Qwen3.6/Qwen3.7 hosted/open variants and removed the incorrect Qwen3.6 Flash ↔ 35B-A3B aliasing assumption.
- **Gemini** — added missing family coverage and current Flash-Lite variants; preserved retirement/deprecation semantics for historical models.
- **Gemma 4** — removed the misleading generic `gemma-4` record and replaced it with exact first-party checkpoints: E2B, E4B, 12B, 26B A4B and 31B, preserving their architecture/context/modality differences.
- **Claude** — added missing Claude Opus 5 coverage while retaining existing current-family information.
- **DeepSeek V4** — added missing first-party Base checkpoints for the V4 Pro/Flash line.
- **Kimi** — added Kimi K2.7 Code as a distinct coding/agentic checkpoint instead of conflating it with the family flagship line.
- **Meta** — added the Muse family / Muse Spark 1.1 coverage rather than treating Meta model coverage as Llama-only.
- **Mistral** — added/corrected Mistral Medium 3.5 and corrected Mistral Small 4 facts, including its dated release, MoE scale, context, multimodality, weights/license and runtime evidence.
- **OpenAI GPT family** — filled missing same-generation API variants that had official model entries but were absent from the site catalog.
- **Grok** — corrected historical retirement semantics so a legacy API slug redirect is not represented as continued availability of the retired model.
- **vendor catalogs** — broadened provider entrypoints so future audits cover API catalogs and open-weight catalogs where both matter.

## Deployment evidence for the baseline

The final PR head was:

`c6b968fdb8eee92b84a20b3361a39a5e1df8822f`

Cloudflare Pages reported **Deploy successful** for that exact Preview head.

PR #77 was then squash-merged to `main` as:

`53e94579496cedfafa22c4cbdf6a4791e4971628`

Evidence boundary: the tools available in that session proved the exact-head Preview success and the GitHub merge SHA. They did **not** expose an authoritative Cloudflare Production-deployment-to-Git-SHA lookup. Do not cite a production HTTP 200 alone as independent proof that a particular Git SHA is live.

## Validation contract for model-catalog changes

For normal data/schema/domain changes, the repository Gates remain:

```text
npm run verify:deploy
npm run build
```

The deployment gate includes schema/relation checks plus semantic, claims, freshness, unit and V2/adversarial audits. Do not bypass a failing audit by deleting the check or downgrading the policy just to get a deployment.

Hosted Preview/Production acceptance follows [`deployment-policy.md`](deployment-policy.md) and [`release-closeout-protocol.md`](release-closeout-protocol.md). Vercel is the ordinary current deployment authority. The Cloudflare receipt in the 2026-08-10 baseline above remains valid historical evidence, but it is not the current provider workflow.

External catalog/source probes remain on-demand because they involve network cost/reliability. Use them when doing a real current-world catalog audit, but do not automatically move them into every Vercel build.

## Hosted build-budget rule for catalog work

A model audit can touch many records. Avoid one push per tiny correction.

Preferred flow:

```text
inventory + evidence gathering
-> batch model/family/vendor edits
-> deterministic local/static reasoning where possible
-> one meaningful final PR head
-> one exact-head Vercel Preview when current policy requires hosted acceptance
-> fix only concrete failures
-> exact-head Preview success
-> merge
```

The 2026-08-10 audit demonstrated why this matters even though it used the then-current Cloudflare provider: intermediate commits consumed Preview builds and surfaced a semantic-Gate failure. Later fixes were batched into Git trees so the final state could be tested without manufacturing many more deployment attempts. Preserve that batching lesson while following today's Vercel authority.

## What future Agents must not assume

Do not assume any of the following merely because they were true on 2026-08-10:

- Qwen3.7 is still the newest hosted Qwen generation;
- Kimi K3 or any other named model is still a family flagship;
- a current API model has not been deprecated;
- a weight repository/license has not changed;
- the family size ladder is still complete;
- a previously closed model has not received released weights;
- a provider catalog URL still covers all product surfaces.

When the task says “today”, “latest”, “current”, “all models” or “full family”, re-check first-party sources on that date.

## Definition of done for a broad catalog audit

A broad model-data audit is complete only when:

1. repository model records are inventoried;
2. family/vendor coverage indexes are checked;
3. current first-party catalogs are consulted for every in-scope provider;
4. missing current models/checkpoints are added;
5. incorrect lifecycle/access/license/architecture facts are corrected;
6. family current pointers use internal model IDs correctly;
7. concrete critical fields have field-level evidence or precise semantic unknowns;
8. deterministic deployment Gates pass;
9. when deployment-sensitive work requires hosted acceptance under current repository policy, the exact final PR head receives a successful Vercel Preview; docs/governance-only work may be legitimately skipped by the current build-scope rules;
10. the PR is merged without weakening the research-integrity contract.

“Added a few recent model names” is not a full-catalog audit.
