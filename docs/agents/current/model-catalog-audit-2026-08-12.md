# Official model catalog differential audit — 2026-08-12

Status: **completed against the 2026-08-10 full-catalog baseline**

Base commit inspected: `772e3c0b85be98be3fed0c12c34248e304afad87`

## Purpose

This audit rechecked every tracked provider against current first-party catalogs and corrected only evidence-backed deltas. It did not turn regex discoveries, search snippets, third-party articles, or provider marketing claims into model facts without a direct official source.

The audit preserves these distinctions:

- current hosted/API model versus downloadable weight release;
- general flagship versus specialized/coding/multi-agent variant;
- released versus preview/limited-access lifecycle;
- concrete fact versus semantic unknown;
- first-party fact versus operational derivation.

## Provider inventory

| Vendor ID | First-party surfaces rechecked | 2026-08-12 result |
| --- | --- | --- |
| `openai` | OpenAI API model catalog and model pages | No catalog delta: GPT-5.6 Sol / Terra / Luna remain the current general-purpose frontier family. |
| `qwen` | Alibaba Cloud Model Studio releases/models, Qwen GitHub and Hugging Face | No catalog delta from the 2026-08-10 baseline. |
| `google` | Gemini model/deprecation catalogs, Gemma 4 model card, Google Hugging Face org | No catalog delta from the 2026-08-10 baseline. |
| `meta` | Llama model catalog, Muse Spark announcement/API surface, Meta Llama weights | No catalog delta from the 2026-08-10 baseline. |
| `anthropic` | Claude model overview and release notes | No catalog delta from the 2026-08-10 baseline. |
| `deepseek` | DeepSeek V4 first-party model card and API docs | No catalog delta from the 2026-08-10 baseline. |
| `moonshot` | Kimi Agent help, Moonshot Hugging Face org, Kimi platform | No catalog delta from the 2026-08-10 baseline. |
| `mistral` | Mistral models overview, Large 3 card, Mistral Hugging Face org | **Structured-data correction:** Large 3 facts and API identity were present in evidence prose but absent from fields/family pointers. |
| `glm` | Z.ai Hugging Face org and product surface | No catalog delta from the 2026-08-10 baseline. |
| `lmsys` | LMSYS site and official Hugging Face org | No new Vicuna generation; the family remains historical/legacy. |
| `xai` | xAI model pages, rate-limit catalog, release notes and retirement guide | **Catalog expansion:** add current Grok 4.20, Grok 4.20 Multi-Agent Beta and Grok Build 0.1; restore existing Grok 4.3 to the current API family surface. |
| `minimax` | MiniMax M3 current page/blog and first-party Hugging Face model/config/license | **Structured-data/provenance correction:** active parameters, experts, video modality, API/runtime support, and official launch provenance. |

All twelve vendor `catalog_checked_at` values and all fourteen family current-claim snapshots are advanced to `2026-08-12`.

## Corrected records

### xAI / Grok

Added:

- `grok-4-20`
  - launched on 2026-03-10;
  - separate reasoning and non-reasoning API snapshots;
  - text/image input;
  - 1,000,000-token context.
- `grok-4-20-multi-agent`
  - beta lifecycle remains explicit;
  - separate current API model;
  - multi-agent deep-research specialization;
  - 1,000,000-token context.
- `grok-build-0-1`
  - launched on 2026-05-19;
  - coding/agentic workflow specialization;
  - 256,000-token context;
  - `grok-code-fast-1` retained only as an alias/migration surface.

Updated the Grok family so `current_api_model_ids` uses internal Atlas IDs:

```text
grok-4-5
grok-4-20
grok-4-20-multi-agent
grok-4-3
grok-build-0-1
```

`grok-4-5` remains the flagship. Grok 4.20 Multi-Agent and Grok Build 0.1 are tracked as specialized current models rather than being mistaken for newer general flagships.

### MiniMax M3

Corrected structured fields from first-party model card/config:

```text
total parameters:      428B
active parameters:      23B
context:          1,048,576
experts:                 128
active experts/token:      4
modalities: text, image, video
API model: MiniMax-M3
runtimes: Transformers, vLLM, SGLang
```

Removed the ITHome article that had been mislabeled as an `official_announcement`. The launch date and multimodal/API claims now come from MiniMax's own launch post, current model page, model card and configuration.

LoRA/SFT/RL suitability and hardware tiers remain semantic unknowns where the official sources do not provide a reproducible recipe or exact resource requirement.

### Mistral Large 3

Moved already-documented first-party facts out of source prose and into the record:

```text
release date:       2025-12-02
total parameters:           675B
active parameters:           41B
context:                  256K
license:             Apache-2.0
classification:       open_weight
API model:       mistral-large-2512
```

Added `mistral-large-3` to the Mistral family's current API model IDs while keeping Mistral Medium 3.5 as the current flagship.

## No-change decisions

A provider was not changed merely because:

- an old alias still resolves;
- a catalog contains non-general-purpose audio/image/embedding models outside the Atlas scope;
- a limited-access or preview model exists but is already represented with the correct lifecycle;
- an official page uses performance marketing that does not change identity, access, architecture or reproducibility fields;
- no new first-party weight/API release was found.

## Regression and acceptance contract

`src/lib/modelCatalogDifferentialAudit.test.ts` locks:

- twelve vendor snapshots and fourteen family snapshots at the audit date;
- the complete Grok current API family surface;
- Grok 4.20 / Multi-Agent / Build identities and contexts;
- MiniMax M3 architecture, modalities, runtimes and provenance;
- Mistral Large 3 architecture, license and API identity.

Normal acceptance remains:

```text
npm run verify:deploy
npm run build
exact-head Vercel Preview
```

External catalog scraping remains a discovery/maintenance tool, not a deterministic deployment blocker.
