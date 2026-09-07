# SEED × OpenEvo Research Route Inventory — 2026-09-03

Status: **PHASE B AUDIT COMPLETE**
Audit baseline: `mykcs/basemodel@3151686bdc594e723d08764b180532e86ef02fd3`
Authority note: [`seed-openevo-research-ia-authority-snapshot-2026-09-03.md`](./seed-openevo-research-ia-authority-snapshot-2026-09-03.md)
Masterplan: [`seed-openevo-research-information-architecture-masterplan.md`](./seed-openevo-research-information-architecture-masterplan.md)

This document is the Phase B route/site inventory. It describes the frozen website tree before the identity-driven reorganization. It does not claim that the scientific facts embedded in these pages are current; Phase C audits those facts against upstream evidence.

## 1. Enumeration result

The frozen tree contains **65 concrete SEED × OpenEvo page URLs**:

```text
Chinese: 39
English: 26
Total concrete URLs: 65
Unique locale-neutral semantic routes: 39
```

The repository sitemap currently covers **59** of those concrete URLs:

```text
Chinese sitemap routes: 36
English sitemap routes: 23
Total sitemap-covered URLs: 59
```

There are **6 concrete URLs missing from the sitemap**, corresponding to three bilingual semantic pages:

```text
/research/seed-openevo/study/capability-exploration/archive/
/en/research/seed-openevo/study/capability-exploration/archive/

/research/seed-openevo/study/capability-exploration/first-run/
/en/research/seed-openevo/study/capability-exploration/first-run/

/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/
/en/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/
```

No SEED × OpenEvo sitemap declaration was found whose corresponding Astro page/static path is absent from the frozen filesystem.

### How the count was resolved

The inventory combined:

1. `src/lib/sitemapRoutes.ts`;
2. the exact Git trees for `src/pages/research/seed-openevo/flow` and `study`;
3. the exact Git trees for `src/pages/en/research/seed-openevo/flow` and `study`;
4. the dynamic static-path list in `src/pages/research/seed-openevo/study/results/[note].astro`.

The dynamic result route generates exactly twelve Chinese-only URLs rather than one abstract `[note]` route.

## 2. Current navigation topology

### Global research split

The site header presents two research journeys:

```text
01 Flow map
02 OpenEvo × WebShop study
```

### Flow local navigation

`SeedOpenEvoResearchNav.astro` exposes all nine Flow routes as peers:

```text
Flow overview
-> server
-> model
-> SEED
-> OpenEvo
-> environment overview
-> WebShop
-> ALFWorld
-> update mechanisms
```

This is broadly coherent because these routes are explanatory concepts/operations rather than experiment identity levels.

### Study local navigation

The same component exposes only five Study-level entries:

```text
Experiment workflow
Training design
Run experiment
OpenEvo capability exploration
Research findings
```

This is the first structural mismatch with the target identity graph: `Training design`, `capability exploration`, and `research findings` each contain overlapping pieces of experiment-design truth, while runs/assets are not represented as identity objects.

### Capability exploration subgraph

`OpenEvoCapabilityMapLobby.astro` links three second-level destinations:

```text
capability exploration
├─ first-run historical map
├─ redesign/current-successor map
└─ experiment archive
```

The archive/lobby/first-run/redesign components cross-link the detailed historical pages:

```text
historical Stage 1
old Stage 2 / 256-window
Ceiling-1.0
Harness diagnostic
MiniMax teacher analysis
3B/7B/four-arm result analyses
```

Therefore the three sitemap-missing routes are **not orphan pages**: they have active in-site links but are absent from sitemap discovery.

### Results subgraph

`OpenEvoWebShopResultsAppendix.astro` links all twelve dynamic Chinese result-note URLs. Five are promoted as deep dives and seven remain under legacy/history disclosure. `OpenEvoExperimentAnalysisPlanIndex.astro` links the model/self/MiniMax/four-arm analysis pages.

Result: no frozen SEED × OpenEvo filesystem route was found with zero current in-site inbound path. The problem is hierarchy/discoverability, not literal total orphaning.

## 3. Route classification and disposition matrix

`type` uses the masterplan vocabulary: `concept`, `design`, `run`, `asset`, `analysis`, `result`, `history`, `operations`, `mixed`.

`disposition` is the Phase B recommendation, not an implementation commit. Exact successor slugs/redirects remain subject to Phase E.

| # | Locale-neutral route | Locales | Type | Current semantic role | Main issue | Disposition | Intended semantic owner |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 01 | `/research/seed-openevo/flow/` | zh/en | mixed | research/concept orientation | stable explanation mixed with dated/current-state callouts | `rewrite` | Research Overview / Concepts |
| 02 | `/research/seed-openevo/flow/server/` | zh/en | operations | server/execution explanation | operational/current usage material can age independently of concepts | `rewrite` | Concepts / Operations |
| 03 | `/research/seed-openevo/flow/base-model/` | zh/en | concept | base-model role | concept is valid; factual freshness handled separately | `keep` | Concepts |
| 04 | `/research/seed-openevo/flow/seed/` | zh/en | concept | SEED method explanation | appropriate conceptual owner | `keep` | Concepts |
| 05 | `/research/seed-openevo/flow/openevo/` | zh/en | concept | OpenEvo method explanation | appropriate conceptual owner | `keep` | Concepts |
| 06 | `/research/seed-openevo/flow/benchmarks/` | zh/en | concept | environment overview | appropriate conceptual owner | `keep` | Concepts |
| 07 | `/research/seed-openevo/flow/webshop/` | zh/en | concept | WebShop environment/protocol | appropriate conceptual owner | `keep` | Concepts |
| 08 | `/research/seed-openevo/flow/alfworld/` | zh/en | concept | ALFWorld environment/protocol | appropriate conceptual owner | `keep` | Concepts |
| 09 | `/research/seed-openevo/flow/loops/` | zh/en | concept | update-mechanism comparison | appropriate conceptual owner | `keep` | Concepts |
| 10 | `/research/seed-openevo/study/` | zh/en | mixed | study gateway + old completed/next experiment material | multiple scientific eras and next-step state share one landing page | `rewrite` | Research Overview |
| 11 | `/research/seed-openevo/study/design/` | zh/en | design | WebShop training decision lab | route called Design is not the actual Experiment Designs catalog | `merge` | Experiment Designs |
| 12 | `/research/seed-openevo/study/run/` | zh/en | operations | reproduction/run guide | valid operational guide, but not a canonical scientific run object | `keep` | Operations / Reproduction Guide |
| 13 | `/research/seed-openevo/study/capability-exploration/` | zh/en | mixed | two-map historical/current experiment lobby | combines history and current redesign instead of canonical design identity | `merge` | Experiment Designs + History |
| 14 | `/research/seed-openevo/study/capability-exploration/archive/` | zh/en | history | technical experiment archive | useful evidence index; missing sitemap | `historical` | History / Assets & Evidence |
| 15 | `/research/seed-openevo/study/capability-exploration/first-run/` | zh/en | history | first-run historical lineage map | useful lineage summary; missing sitemap | `historical` | History |
| 16 | `/research/seed-openevo/study/capability-exploration/openevo-2-0/` | zh/en | design | current-successor map + embedded Experiment Designs catalog | actual design catalog is buried under capability exploration | `merge` | Experiment Designs |
| 17 | `/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/` | zh/en | analysis | historical Harness qualification/diagnostic | page itself says parent map is current authority; missing sitemap | `historical` | History / Assets & Evidence |
| 18 | `/research/seed-openevo/study/capability-exploration/stage1-previous/` | zh/en | history | old Stage 1 trajectories/assets archive | correctly historical, but identity should eventually be asset/run-driven | `historical` | History / Assets & Evidence |
| 19 | `/research/seed-openevo/study/capability-exploration/stage2-256-window/` | zh/en | history | old invalid method-control/256-window story | valuable negative/historical evidence | `historical` | History |
| 20 | `/research/seed-openevo/study/capability-exploration/stage2-ceiling/` | zh/en | history | Ceiling-1.0/second Stage-2 historical snapshot | path understates broader lineage and successor context | `historical` | History / Results |
| 21 | `/research/seed-openevo/study/minimax-teacher/` | zh only | analysis | MiniMax frozen facts + teacher/cost analysis | unique analysis but outside bilingual canonical structure | `keep` | Assets & Evidence / Analysis |
| 22 | `/research/seed-openevo/study/results/` | zh/en | result | main findings + history + next steps | current claims, historical notebook, analyses, and future work are mixed | `rewrite` | Results & Conclusions |
| 23 | `/research/seed-openevo/study/results/3b-self-analysis/` | zh/en | analysis | sealed historical arm result | historical arm appears next to current Results | `historical` | History / Results Evidence |
| 24 | `/research/seed-openevo/study/results/7b-self-analysis/` | zh/en | analysis | sealed historical arm result | historical arm appears next to current Results | `historical` | History / Results Evidence |
| 25 | `/research/seed-openevo/study/results/3b-minimax-analysis/` | zh/en | analysis | stopped historical arm result | historical arm appears next to current Results | `historical` | History / Results Evidence |
| 26 | `/research/seed-openevo/study/results/7b-minimax-analysis/` | zh/en | analysis | sealed historical arm result | historical arm appears next to current Results | `historical` | History / Results Evidence |
| 27 | `/research/seed-openevo/study/results/four-arm-analysis/` | zh/en | analysis | historical cross-arm analysis | analysis belongs to historical design/run graph | `historical` | History / Results Evidence |
| 28 | `/research/seed-openevo/study/results/webshop-training/` | zh only | concept | moved-primer compatibility page | content owner is now Flow/WebShop; route is a migration stub under Results | `redirect` | Concepts / WebShop |
| 29 | `/research/seed-openevo/study/results/seed-training/` | zh only | concept | moved-primer compatibility page | content owner is Flow/SEED + paper; route is a migration stub under Results | `redirect` | Concepts / SEED |
| 30 | `/research/seed-openevo/study/results/openevo-training/` | zh only | concept | moved-primer compatibility page | content owner is Flow/OpenEvo; route is a migration stub under Results | `redirect` | Concepts / OpenEvo |
| 31 | `/research/seed-openevo/study/results/why-it-kept-failing/` | zh only | history | H1.16–H1.29 failure history | scientifically useful but historical | `historical` | History / Results Evidence |
| 32 | `/research/seed-openevo/study/results/first-positive-transfer/` | zh only | history | H1.38B positive-transfer milestone | scientifically useful but historical | `historical` | History / Results Evidence |
| 33 | `/research/seed-openevo/study/results/independent-replication/` | zh only | history | H1.39 replication milestone | scientifically useful but historical | `historical` | History / Results Evidence |
| 34 | `/research/seed-openevo/study/results/second-generation/` | zh only | history | H1.40/H1.41 second-generation boundary | scientifically useful but historical | `historical` | History / Results Evidence |
| 35 | `/research/seed-openevo/study/results/measurement-boundary/` | zh only | history | H1.42 measurement calibration | scientifically useful later calibration | `historical` | History / Results Evidence |
| 36 | `/research/seed-openevo/study/results/current-conclusion/` | zh only | result | H1.41-era claim boundary | URL says current although the cutoff is historical | `merge` | Results & Conclusions + History |
| 37 | `/research/seed-openevo/study/results/benchmark-first/` | zh only | design | old formal-comparison rationale | design truth is split across Results/Design/Capability pages | `merge` | Experiment Designs / History |
| 38 | `/research/seed-openevo/study/results/seed-faithful-benchmark/` | zh only | design | old SEED-faithful comparison protocol | protocol belongs with canonical design, not Results history navigation | `merge` | Experiment Designs / History |
| 39 | `/research/seed-openevo/study/results/openevo-benchmark-design/` | zh only | design | old OpenEvo variant design note | design belongs with canonical design family | `merge` | Experiment Designs / History |

This table gives every frozen locale-neutral semantic route exactly one primary `type`, one `disposition`, and one intended semantic owner.

> **2026-09-07 human-feedback override for row 11:** `/research/seed-openevo/study/design/` is no longer a canonical content owner or Experiment Designs destination. Its training-design explanation is owned by `/research/seed-openevo/flow/#training-design`; the old zh/en URL is compatibility-only, must not appear in the sitemap or new reader-facing links, and must not regain a page-specific navigation / typography system.

## 4. Duplicate and overlap groups

### DUP-01 — two design centers

```text
/study/design/
  = WebShop training decision lab

/study/capability-exploration/openevo-2-0/
  = current successor map + actual OpenEvo Experiment Designs catalog
```

This is the largest structural duplication. The route named `design` is not the canonical design-family catalog; the catalog is embedded in a capability-exploration successor page.

### DUP-02 — Results current-claim duplication

```text
/study/results/
/study/results/current-conclusion/
```

The main Results page already owns current-facing conclusions, while `current-conclusion` names an H1.41-era cutoff as if it were perpetually current. Phase I should consolidate the supported current claim view and retain the H1.41 cutoff as historical evidence.

### DUP-03 — design protocol split across Results

```text
/study/design/
/study/results/benchmark-first/
/study/results/seed-faithful-benchmark/
/study/results/openevo-benchmark-design/
```

These pages all explain experiment-design choices. Their scientific content may remain as historical design evidence, but the canonical design should be owned by Experiment Designs rather than by Results.

### DUP-04 — moved primers still published as Result URLs

```text
/study/results/webshop-training/ -> /flow/webshop/
/study/results/seed-training/ -> /flow/webshop/#fig-seed-webshop + /papers/seed/
/study/results/openevo-training/ -> /flow/openevo/
```

`ResearchPrimerMoved.astro` already makes these compatibility pages. They should become real redirects or equivalent compatibility outcomes after Phase E/J rather than remaining indexable pseudo-results.

### Intentional summary/detail overlap

The capability lobby, first-run map, experiment archive, old Stage 1/Stage 2 pages, and model-specific result pages intentionally repeat short summaries while owning different evidence depth. This is not treated as accidental duplication. The reorganization should preserve the summary/detail relationship but express it through design/run/asset/history hierarchy.

## 5. Stable explanation mixed with mutable state

The following route groups contain or route into mutable current/next/live scientific state and therefore require Phase C provenance audit before rewriting:

- `/flow/` — stable research explanation plus dated/current research status;
- `/flow/server/` — stable server concepts plus operational state that can age independently;
- `/study/` — completed historical evidence plus “next experiment” material;
- `/study/design/` — training decisions/protocol state;
- `/study/run/` — explicitly resolves live state from campaign/reconciliation;
- `/study/capability-exploration/` — historical map plus “current design route”;
- `/study/capability-exploration/openevo-2-0/` — hard-coded current/future successor states and frozen IDs;
- `/study/capability-exploration/stage2-ceiling/` — snapshot values plus successor interpretation;
- `/study/minimax-teacher/` — frozen facts plus living analysis;
- `/study/results/` — current-facing claim boundary, historical evidence, and next-step material;
- `/study/results/current-conclusion/` — the word `current` is attached to an H1.41 cutoff;
- old benchmark-design notes — historical design text can be mistaken for an active next protocol if not labelled.

Historical wrappers such as `stage1-previous`, `stage2-256-window`, `harness-2-0`, and the four-arm result pages already contain explicit historical/sealed language, but Phase C must still verify their numeric claims and links.

## 6. Title/path/role mismatches

### MISMATCH-01 — `study/design` is not the Experiment Designs catalog

Current path:

```text
/research/seed-openevo/study/design/
```

Current page title/role:

```text
WebShop 训练设计实验室 · SEED × OpenEvo
SeedOpenEvoTrainingDecisionLab
```

Actual Experiment Designs catalog location:

```text
/research/seed-openevo/study/capability-exploration/openevo-2-0/
OpenEvoRedesignMap -> OpenEvoExperimentDesignCatalog
```

This is a primary Phase E/G migration target.

### MISMATCH-02 — concept compatibility pages live under Results

The three `*-training` result routes render `ResearchPrimerMoved` and point readers to Flow/paper content. Their path no longer matches their semantic owner.

### MISMATCH-03 — `current-conclusion` is historical by date

The dynamic route metadata says “截至 H1.41”. A permanent URL named `current-conclusion` therefore has a semantic freshness bug even when its historical content remains valid.

### MISMATCH-04 — `stage2-ceiling` contains a wider lineage story

Its page title is “第二版 Stage 2”, while the description also explains 7B component state, 3B multi-round failure, Harness diagnosis, and the fresh-Stage1 successor. The evidence is useful, but the eventual semantic owner should be the historical Ceiling lineage rather than a supposedly current Stage-2 node.

## 7. Locale coverage

### Bilingual semantic routes: 26

All nine Flow routes are bilingual.

Seventeen Study routes are bilingual:

```text
/study/
/study/design/
/study/run/
/study/capability-exploration/
/study/capability-exploration/archive/
/study/capability-exploration/first-run/
/study/capability-exploration/openevo-2-0/
/study/capability-exploration/openevo-2-0/harness-2-0/
/study/capability-exploration/stage1-previous/
/study/capability-exploration/stage2-256-window/
/study/capability-exploration/stage2-ceiling/
/study/results/
/study/results/3b-self-analysis/
/study/results/7b-self-analysis/
/study/results/3b-minimax-analysis/
/study/results/7b-minimax-analysis/
/study/results/four-arm-analysis/
```

### Chinese-only semantic routes: 13

```text
/study/minimax-teacher/
```

plus all twelve dynamic `/study/results/<note>/` routes.

Three of the twelve are migration stubs and should eventually redirect rather than receive new English duplicate content. The remaining historical/design notes need a Phase E decision about whether their canonical successor is bilingual or whether the old Chinese URL remains a historical compatibility endpoint.

## 8. Search-index audit

Current `src/pages/search-index.json.ts` indexes only:

```text
models
papers
model families
Guide
Methodology
```

It indexes **zero** SEED × OpenEvo research objects or routes. There is currently no command-search type for:

```text
Design
Run
Asset
Result
Historical
```

This is a site-architecture gap, not a single-page omission. Phase J/K should add typed research-object search only after the canonical projection/object graph exists, otherwise search would simply index the current duplicated page taxonomy.

## 9. Orphan audit

Result: **0 known total-orphan SEED × OpenEvo routes** in the frozen tree.

Evidence:

- all Flow pages are in `SeedOpenEvoResearchNav`;
- all five Study top-level pages are in `SeedOpenEvoResearchNav`;
- capability exploration links first-run, redesign, and archive;
- archive/first-run/redesign cross-link the Stage/Harness/evidence pages;
- Results appendix links all twelve dynamic note routes;
- Results analysis index/archive links model/MiniMax/four-arm analysis pages;
- MiniMax teacher is linked from the experiment archive.

However, **discoverability debt remains**:

- 3 bilingual semantic pages / 6 concrete URLs are absent from sitemap;
- 0 research objects are in command search;
- detailed pages are primarily discoverable through old narrative hubs rather than canonical design/run/asset identity.

## 10. Phase B migration implications

The route inventory supports these constraints for later phases:

1. Do not delete historical Stage/result pages merely because the new IA is cleaner; most own unique evidence.
2. Do not keep `study/design` and the embedded redesign catalog as two independent design authorities.
3. Convert moved-primer compatibility pages to deliberate redirect/compatibility behavior.
4. Treat `current-conclusion` as a historical cutoff after its supported claims are absorbed into the canonical Results view.
5. Preserve the capability archive/first-run/harness URLs because they have active inbound links and unique lineage/diagnostic value, even though they were missing from sitemap.
6. Do not expand command search until canonical object identity exists; otherwise the search index would codify today's page-level duplication.
7. Phase C must audit mutable statements before any broad copy rewrite.
8. Phase D/E must decide canonical design/run/asset owners before redirect implementation.

## 11. Phase B acceptance

Phase B acceptance requires every existing research route to have exactly one disposition and one intended semantic owner.

That condition is satisfied by the 39-row locale-neutral matrix above, covering all 65 concrete public URLs in the frozen baseline.

No runtime page, sitemap, redirect, or search behavior is changed by this audit document.