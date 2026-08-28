# Model catalog freshness and evidence-boundary retrospective — 2026-08-28

Status: **conversation closeout; model data itself was not changed in this task**

## Why this document exists

The user asked whether BaseModel's model-related site content had fallen behind, starting from a concrete observation: Qwen had already moved to the 3.8 line. The task then widened into a targeted catalog-freshness review: inspect what the repository already knows, identify likely post-baseline deltas, and separate evidence-backed updates from names that merely look newer.

This retrospective records the engineering and reasoning friction from that conversation so a future Agent can repeat the investigation without repeating the same mistakes. It is a historical case study, not a replacement for [`../current/model-catalog-verification-policy.md`](../current/model-catalog-verification-policy.md) and not a current model catalog.

The main lesson is simple:

> A model catalog can be structurally well maintained and still become stale within days. "New model name found" is only the start of the work; the real job is to determine which claim the evidence supports, which catalog surface owns that claim, and which repository pointers must move together.

## Starting state

The repository was much newer than a casual "the site is outdated" reading suggested. The current family inventory already represented frontier-era entries such as GPT-5.6, Claude 5, DeepSeek V4, Kimi K3, GLM-5.2, Gemma 4 and Grok 4.x. Qwen was not stuck at Qwen2/Qwen3 either: the family record already separated hosted Qwen3.7 from Qwen3.6 open-weight checkpoints.

The important stale boundary was the **audit date**. `src/content/coverage/vendors.json` and `src/content/coverage/families.json` were largely anchored to the 2026-08-12 differential audit. That audit was correctly stored as a point-in-time baseline, but the concrete family state had already moved after it.

## Friction 1: inventory first, or the investigation starts from the wrong mental model

The first useful step was not external search. It was reading the repository's own model inventory and family coverage.

That changed the shape of the task. Instead of "bring an old catalog up to date", the real task became "find the delta after a recent broad audit". This matters because the two tasks have very different failure modes:

- a broad rebuild risks duplicating records the repository already has;
- a delta audit risks missing a new family member if it trusts the old audit too much;
- a filename search alone can miss stale family pointers even when the model JSON already exists;
- a family page can look current while an individual model record or lifecycle field is wrong.

Future Agents should therefore inventory `src/content/models/`, `src/content/coverage/families.json`, `src/content/coverage/vendors.json`, and the audit/test owners before searching the outside world.

## Friction 2: a completed audit is evidence, not freshness

The 2026-08-12 differential audit was only sixteen days old, but that was already enough for multiple post-baseline model deltas to appear. In fact, two of the strongest leads landed the very next day.

This is the practical meaning of the repository's existing warning that a dated audit is not a current catalog. `catalog_checked_at` answers "when did we last check?"; it does not answer "is this still current?".

The configured `refresh_days` value is similarly a maintenance target, not permission to defer a re-check when the user explicitly asks for "today", "latest" or "current", or when first-party evidence newer than the baseline already indicates movement.

## Friction 3: tool availability changed the evidence path

Normal web search was unavailable in the conversation, so the investigation could not claim a fresh, exhaustive pass over every vendor's live documentation. The useful connected surfaces were GitHub plus first-party repositories/SDK changelogs, with third-party model catalogs used only as discovery aids.

That constraint produced an important evidence discipline:

- a first-party official model/API catalog is best for current family membership, availability and lifecycle;
- a first-party model card or weight repository is best for downloadable checkpoint facts;
- a first-party SDK changelog or official code repository can strongly confirm that a model ID exists or that a capability is supported;
- however, an SDK entry by itself does **not** prove that the model is the vendor's flagship, that older siblings are retired, or that the SDK list is the complete family catalog;
- third-party catalogs such as `models.dev`, Cloudflare catalog files, search results and community integrations are excellent for finding leads, but they are not the final authority for production facts.

The investigation therefore used weaker surfaces to maximize recall, then promoted only claims that could be tied back to first-party evidence.

## Friction 4: model existence, generation, flagship and lifecycle are different claims

A recurring temptation was to turn "a newer numbered model exists" into "this is now the family flagship". That is unsafe.

The clearest example was Gemini 3.7 Flash. Google's official `python-genai` changelog added `gemini-3.7-flash` on 2026-08-13. That is strong evidence that the model exists on a first-party API surface. It is **not**, by itself, evidence that Gemini 3.1 Pro stopped being the flagship or that every earlier Gemini 3.x model should be retired.

The same rule applies to Grok 4.6 and Qwen3.8 variants. Update identity, availability, aliases, role and lifecycle independently; do not move `current_flagship_model_id` merely because a version number increased.

## Evidence-backed leads found in this conversation

These are **historical leads as of 2026-08-28**, not permanent current-state claims. Re-verify them before changing production data.

### Qwen 3.8

The strongest Qwen evidence came from the official `QwenLM/qwen-code` repository:

- commit `ff5aa6be824a8979713c8e07bc90f10bc1020905` on 2026-08-19 states that stable `qwen3.8-max` graduated from preview and was listed in the Bailian model catalog; the same change records a 1M context window, mandatory thinking, and image/video understanding;
- commit `ac513de34e15f87b0bc4810893d7c370fac9f8b7` on 2026-08-27 adds modality metadata for `qwen3.8-flash` and `qwen3.8-plus`, both with image + video support.

This means the next Qwen audit should not stop at "replace Qwen3.7 with Qwen3.8 Max". It should inspect the whole Qwen3.8 hosted surface and separately decide what remains current in the Qwen3.7 and open-weight lines.

### Gemini 3.7 Flash

Google's official `googleapis/python-genai` changelog for v2.18.1, dated 2026-08-13, explicitly says `Add gemini-3.7-flash`.

This is sufficient to make `gemini-3.7-flash` a high-confidence candidate for the next catalog refresh, but not sufficient on its own to reassign flagship status or retire existing Gemini variants.

### Grok 4.6

xAI's official `xai-org/xai-sdk-python` changelog for v1.18.0, dated 2026-08-13, adds `grok-4.6` to the known chat-model literals and records `xhigh` reasoning effort support for models such as Grok 4.6.

That is strong first-party evidence for model identity/API support. The next xAI audit still needs the current model catalog/release surface for flagship and lifecycle claims.

## Friction 5: catalog scope must be decided before filling every provider endpoint

The discovery pass also surfaced newer image/realtime generation endpoints such as GPT Image 2, GPT Realtime 2.1 and newer Grok Imagine variants. Their existence does not automatically mean the BaseModel catalog should add them beside general-purpose foundation/chat families.

The repository has historically made scope decisions: the 2026-08-12 audit explicitly ignored non-general-purpose audio/image/embedding entries that were outside Atlas scope. That boundary is valuable. A completeness audit must first define **complete for which product/research surface**.

Future Agents should classify a discovered endpoint into one of three buckets before editing:

1. clearly in-scope general/foundation/chat model;
2. specialized variant already represented by the family taxonomy;
3. new modality/product surface that requires a deliberate taxonomy decision.

Do not create taxonomy accidentally by adding whatever appears in an external provider list.

## Friction 6: adding a JSON file is not a catalog refresh

A high-confidence new model can still be invisible or misleading if only one record changes. The repository's model catalog is a small graph, not a directory of independent files.

A real refresh may need coordinated edits to:

- `src/content/models/<model>.json`;
- `src/content/coverage/families.json` generation, flagship, API/open-weight and variant pointers;
- `src/content/coverage/vendors.json` source inventory and `catalog_checked_at` only after a real provider re-check;
- field-level `sources[].supports` provenance;
- family/differential audit tests that pin the current surface;
- lifecycle/alias fields for superseded models.

This is why "I found Qwen3.8" should become a family audit task, not a one-line label edit.

## Friction 7: current policy can drift around a correct historical baseline

While routing this retrospective, another mismatch became visible: the historical 2026-08-10 model-audit section correctly records that Cloudflare Preview was used at that time, but later sections of the *current* model-catalog policy still described Cloudflare as the normal validation/deployment path.

That conflicts with the repository's present deployment authority, where Vercel owns ordinary Preview and Production. The correct treatment is:

- keep Cloudflare details inside the dated 2026-08-10 baseline as historical evidence;
- keep current validation/provider instructions aligned with `docs/agents/current/deployment-policy.md`;
- never "modernize" a historical receipt by rewriting what actually happened.

This distinction mirrors the model-catalog lesson itself: **historical truth and current operating truth can both be correct, but they must not occupy the same semantic field.**

## What this conversation did not establish

This task did **not** perform a new exhaustive all-provider first-party audit. Normal web search was unavailable, and the investigation intentionally avoided upgrading discovery evidence into stronger claims than it could support.

It also did not:

- add or edit production model JSON;
- advance any vendor or family `catalog_checked_at` timestamp;
- declare Qwen3.7, Gemini 3.6/3.5, Grok 4.5/4.20/4.3 or any other existing model retired;
- prove that Qwen3.8 Max, Gemini 3.7 Flash or Grok 4.6 is the current family flagship solely from SDK/code evidence;
- decide that image/video/realtime endpoint catalogs should become first-class BaseModel families.

Any future Agent that turns this retrospective directly into production state without re-checking live first-party catalogs is repeating the exact error this document is meant to prevent.

## Friction 8: patching convenience is not a reason to widen the tool boundary

During documentation closeout, the task could be completed through the GitHub connector, but editing convenience led to an isolated local Remote Desktop worktree. The worktree avoided contaminating the user's active checkout, yet the boundary expansion itself was unnecessary: the repository's current operating principles explicitly prefer GitHub-owned state to stay on the GitHub surface when GitHub read/write/PR tools are sufficient.

The reusable rule is:

- prefer the GitHub connector and one Git data API tree/commit for GitHub-owned multi-file documentation changes;
- do not invoke a user device merely because `sed`, an editor or a local worktree feels easier;
- if local execution is genuinely required, use an isolated worktree and leave unrelated branches/processes untouched;
- once an avoidable boundary expansion is noticed, record it rather than silently turning convenience into precedent.

This is the tooling analogue of the evidence lesson above: use the narrowest authority that can support the claim or mutation you actually need.

## Recommended workflow for the next catalog-refresh Agent

Use this sequence when the user asks what model information needs updating:

```text
read current model-catalog policy
-> inventory repository model/family/vendor state
-> identify the last broad-audit date
-> search broadly for post-baseline leads
-> promote each lead only through first-party evidence
-> separate existence / role / flagship / lifecycle / openness claims
-> decide whether the model is in the site's current taxonomy scope
-> batch model + family + vendor + provenance + test edits
-> run repository Gates
-> use current Vercel Preview/release policy when hosted acceptance is required
-> record the completed audit as a new point-in-time history entry
```

For high-velocity providers, a 30-day maintenance interval is too coarse to function as a freshness guarantee. A shorter watch cadence may be operationally useful, but cadence should be adopted deliberately in executable/catalog configuration rather than invented in a retrospective. Regardless of cadence, explicit "latest/current/today" requests always trigger live re-verification.

## Reusable reasoning rules

1. **Inventory before discovery.** Know what the site already represents before looking for what is missing.
2. **Audit dates expire immediately.** A clean audit can be stale the next day.
3. **Use discovery sources for recall, first-party sources for authority.** Search breadth and evidence strength are different jobs.
4. **Match evidence to the claim.** SDK support proves less than a current model catalog; a weight card proves different things from an API catalog.
5. **Do not sort families numerically and call the largest suffix the flagship.** Product role and lifecycle require evidence.
6. **Keep hosted, open-weight, foundation, instruct, reasoning, coding and specialized modality lines separate.**
7. **Treat the catalog as a graph.** Model records, family pointers, vendor freshness and tests must move coherently.
8. **Do not let historical provider receipts become current deployment instructions.** Preserve old evidence; update current owners.

## Primary evidence referenced by the conversation

First-party evidence used for the strongest post-baseline leads:

- Qwen stable `qwen3.8-max`: <https://github.com/QwenLM/qwen-code/commit/ff5aa6be824a8979713c8e07bc90f10bc1020905>
- Qwen `qwen3.8-plus` / `qwen3.8-flash` modality support: <https://github.com/QwenLM/qwen-code/commit/ac513de34e15f87b0bc4810893d7c370fac9f8b7>
- Google GenAI SDK changelog / `gemini-3.7-flash`: <https://github.com/googleapis/python-genai/blob/main/CHANGELOG.md>
- xAI Python SDK changelog / `grok-4.6`: <https://github.com/xai-org/xai-sdk-python/blob/main/CHANGELOG.md>

Repository context:

- current policy: [`../current/model-catalog-verification-policy.md`](../current/model-catalog-verification-policy.md)
- previous point-in-time differential audit: [`2026-08-12-model-catalog-differential-audit.md`](2026-08-12-model-catalog-differential-audit.md)
- current deployment authority: [`../current/deployment-policy.md`](../current/deployment-policy.md)

These links are evidence for this retrospective's reasoning path. They do not remove the obligation to re-check live provider state when a future task asks what is current then.
