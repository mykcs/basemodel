# SEED × OpenEvo Research Information Architecture Masterplan

Status: **ACTIVE EXECUTION MASTERPLAN**
Created: **2026-09-03 (SGT)**
Repository: `mykcs/basemodel`
Scientific authority: `mykcs/openevo-experiment`
Scope: SEED × OpenEvo research website information architecture, scientific-state projection, experiment/design/run/asset navigation, provenance, historical supersession, external-provider bindings, migration, validation, and release.

> This file is the checkbox-driven execution authority for the website reorganization requested on 2026-09-03. Future Agents should continue from the first unchecked item whose prerequisites are satisfied. Do not declare this project complete until every required acceptance item is checked with evidence.

---

## 0. Why this exists

The current site contains useful research material, but the information grew page-by-page over time. As a result, the same scientific object may be described separately in the research overview, Study entry, Results page, capability-exploration pages, model-specific analysis pages, Stage 1/Stage 2 pages, and dated Agent state documents.

Meanwhile, `mykcs/openevo-experiment` now has a cross-platform identity and asset-governance model that distinguishes:

```text
program
-> benchmark / research line
-> campaign
-> design
-> run
-> asset
-> provider revision / immutable identity
```

and assigns distinct authority roles to GitHub, the experiment server, W&B, Hugging Face, Kaggle, and the public website.

The website must now be reorganized around that identity graph instead of continuing to maintain a second hand-written experiment-state system.

### One-sentence target

> A reader should be able to start from a scientific question, follow it to the design, runs, assets, provider revisions, evidence, and conclusion, while historical or superseded work remains visible without being confused with current scientific state.

---

## 1. Non-negotiable authority model

This project must preserve the existing cross-platform scientific authority order.

```text
frozen prereg / design + immutable Git state
-> run manifest / execution receipts / reconciliation
-> cross-platform registry / public-safe projection
-> provider metadata on W&B / HF / Kaggle
-> basemodel website presentation
```

### Platform roles

| Platform | Role | Must not become |
| --- | --- | --- |
| `openevo-experiment` Git | canonical scientific identity, design, preregistration, manifest, claim boundary, provider binding | a presentation-only mirror |
| experiment server | original execution site, raw traces/checkpoints/logs, server-side hashes, recoverability evidence | public website database |
| W&B | metrics, telemetry, Tables, reports, observational index | scientific source of truth |
| Hugging Face | long-term checkpoint/adapter/dataset/analysis publication | scientific identity authority |
| Kaggle | notebook/execution provenance and dataset bindings | scientific identity authority |
| `basemodel` | public-safe explanation, navigation, reader-facing projections | second experiment-state database |

### Conflict rule

If website copy conflicts with upstream scientific evidence, fix the derived website/projection. Do **not** rewrite provider metadata or scientific history merely to make the website internally consistent.

---

## 2. Project boundaries

### In scope

- the full SEED × OpenEvo website research subtree;
- relationships among overview, Study, design, Results, capability exploration, Stage 1/Stage 2, MiniMax, self-analysis, cross-arm analysis, and historical pages;
- the existing Experiment Designs catalog already shipped on `main`;
- canonical IDs and provider bindings for experiments **and assets**, including trajectories, checkpoints, adapters, analyses, reports, receipts, and other public-safe artifacts;
- GitHub / HF / W&B / Kaggle links and provider-native immutable identity;
- current vs historical vs superseded semantics;
- route hierarchy, navigation, search index, sitemap, redirects, provenance callouts, and reader-facing terminology;
- Chinese-first explanatory content and English counterparts for canonical new pages;
- deterministic validation, browser validation, Vercel Preview, merge, and Production acceptance.

### Explicitly out of scope unless upstream evidence forces it

- changing the scientific protocol;
- rerunning experiments merely to make naming or website structure cleaner;
- renaming frozen canonical scientific identities;
- modifying checkpoint bytes, trajectory bytes, adapters, or historical execution artifacts;
- moving historical server directories solely for presentation consistency;
- turning private server paths, usernames, secrets, credential transport, or non-public runtime details into public website data;
- replacing Astro/React or redesigning the entire product stack;
- deleting old URLs before migration/redirect evidence exists.

---

## 3. Target reader model

The research website should support two depths without forcing either reader to consume the other.

### Level A — research reader

The reader primarily needs:

```text
What question are we asking?
-> What did we do?
-> What happened?
-> Why does that matter?
-> Technical evidence if needed
```

They should not need to understand SHA formats, provider IDs, or raw receipt schemas unless they choose to inspect evidence.

### Level B — researcher / future Agent

The same page must make it possible to continue downward:

```text
question
-> canonical design ID
-> run / arm
-> asset ID
-> source manifest / receipt
-> execution/source Git SHA
-> HF revision / W&B run / Kaggle notebook or dataset binding
-> digest / verification state
```

This technical depth belongs behind progressive disclosure, evidence tables, or dedicated asset/run pages rather than dominating the first screen.

---

## 4. Target information architecture

The conceptual hierarchy is:

```text
SEED × OpenEvo Research
|
+-- Understand the system
|   +-- base models
|   +-- SEED
|   +-- OpenEvo
|   +-- WebShop / ALFWorld
|   +-- server / execution concepts
|   +-- update mechanisms
|
+-- Scientific research
    +-- Research overview
    +-- Experiment designs
    |   +-- design family
    |       +-- child designs / diagnostics
    |       +-- runs / arms
    |       +-- assets
    |       +-- evidence
    |       +-- result / interpretation
    |
    +-- Results and conclusions
    |   +-- current supported conclusions
    |   +-- analyses
    |   +-- cross-design comparisons
    |
    +-- History
        +-- superseded designs
        +-- failed but informative experiments
        +-- lineage transitions
```

### Primary public research navigation

The research side should converge toward four reader concepts:

1. **Research Overview** — what we are studying and how the pieces relate.
2. **Experiment Designs** — scientific questions and their designs/families.
3. **Results & Conclusions** — what is currently supported by evidence.
4. **Assets & Evidence** — runs, trajectories, checkpoints, adapters, analyses, receipts, and provider bindings.

`Stage 1`, `Stage 2`, `3B`, `7B`, `1.7B`, `MiniMax`, `OPSD`, `GDN`, etc. are not all peers. They should appear at the level that matches their scientific role.

---

## 5. Canonical public object model

The website projection should expose a public-safe object graph. Exact implementation may be JSON, TypeScript, generated static data, or equivalent, but the semantic contract should be close to the following.

### 5.1 Design family

Required conceptual fields:

```text
family_id
canonical_design_id
display_title_en
summary_zh
summary_en
scientific_question
what_changes
what_stays_fixed
models / arms
budget
scientific_lifecycle
scientific_validity
source_git_sha
source_design_path
child_designs[]
runs[]
provider_links[]
supersedes
superseded_by
checked_at
claim_boundary
```

Rules:

- one top-level card = one real scientific question/design family, not one config file;
- qualification, smoke, diagnostic, and implementation configs can be children;
- joint/cross-arm analysis is analysis of runs, not a fake extra arm;
- frozen design must never be displayed as completed execution merely because configuration is frozen.

### 5.2 Run / arm

Required conceptual fields:

```text
canonical_run_id
design_id
model
execution_class
seed / arm if applicable
scientific_lifecycle
scientific_validity
started_at
sealed_at
source_git_sha
manifest_ref
reconciliation_ref
assets[]
wandb_binding
kaggle_binding
server_public_summary
claim_boundary
```

Run status must separate lifecycle from validity. `not-run`, `running`, `sealed`, `protocol-invalid`, `valid-negative`, and `runtime-failure` must not collapse into one generic status.

### 5.3 Asset

Required conceptual fields:

```text
asset_id
canonical_run_id
asset_kind
display_name
milestone / scope
asset_lifecycle
scientific_role
content_digest
size_if_public_safe
produced_by
consumed_by[]
provider_bindings[]
verification_state
public_detail_level
notes
```

Candidate `asset_kind` vocabulary includes:

```text
trajectory-set
checkpoint
adapter
analysis
report
receipt
metric-table
manifest
prompt-contract
runtime-image
other-public-evidence
```

### 5.4 Provider binding

```text
provider
provider_id
provider_url
revision / immutable_id
binding_role
verified_at
verification_method
is_public_safe
```

Provider display names and slugs are aliases. They do not replace the canonical scientific identity.

---

## 6. Public-page generation strategy

### Target data flow

```text
openevo-experiment canonical evidence
-> validated registry / identity bindings
-> public-safe projection artifact
-> basemodel intake / validation
-> static research pages + search index + sitemap
```

### Required behavior

- the website should consume a generated public-safe projection rather than hand-copying mutable state into many Astro components;
- the projection must carry its source Git SHA and generation/check time;
- the website must fail closed or visibly degrade when required identity/provenance fields are missing;
- new public pages must not infer private server details from path names or logs;
- build-time or repository-time validation should catch duplicate canonical IDs, dangling references, impossible status combinations, and missing source evidence.

### Existing catalog migration

`OpenEvoExperimentDesignCatalog.astro` currently contains valuable design-family grouping and should be preserved conceptually, but its hard-coded families/member sets/governance SHA should become a **consumer** of the public-safe catalog rather than the long-term source of experiment truth.

---

## 7. Proposed route architecture

Final exact slugs may be adjusted after the inventory, but the target relationship should be close to:

```text
/research/seed-openevo/flow/
    conceptual understanding only

/research/seed-openevo/study/
    scientific research home

/research/seed-openevo/study/designs/
    design-family catalog

/research/seed-openevo/study/designs/<family-or-design>/
    one scientific design family

/research/seed-openevo/study/runs/<run>/
    run / arm evidence page when public detail is justified

/research/seed-openevo/study/assets/
    searchable/filterable asset evidence index

/research/seed-openevo/study/assets/<asset>/
    only for assets whose scientific importance justifies a dedicated page

/research/seed-openevo/study/results/
    current evidence-backed conclusions and comparison index

/research/seed-openevo/study/history/
    superseded/legacy design map and lineage transitions
```

### Route rules

- do not create one page for every tiny checkpoint or implementation file;
- ordinary checkpoints can live in run-level asset tables;
- milestone checkpoints, final/canonical adapters, canonical trajectory corpora, important analyses, and key receipts may earn dedicated asset pages;
- preserve legacy URLs until a replacement or historical landing page exists;
- redirects must point to the nearest semantic successor, not simply the nearest visually similar page;
- canonical new routes should be bilingual unless there is an explicit reason to keep a historical page Chinese-only.

---

## 8. Current / historical / superseded semantics

Every research-facing object must make temporal status understandable.

### Current-state pattern

```text
Current scientific state
Source repository: openevo-experiment
Campaign / design: <id>
Source ref: <branch or SHA>
Checked: <timestamp>
Claim boundary: <what this evidence does and does not establish>
```

### Historical pattern

```text
Historical milestone
Observed / sealed: <date>
Original design: <id>
Scientific validity: <value>
Superseded by: <id or none>
Why retained: <what we learned / what evidence it preserves>
```

### Mandatory distinctions

```text
current != latest page edit
frozen design != completed run
not-run != zero result
runtime failure != scientific negative result
historical != invalid
superseded != deleted
W&B display state != scientific authority
server inventory != GPU allocation != authorization != live idle capacity
```

---

## 9. Asset/evidence UX rules

A reader looking at a run should be able to see, at minimum:

```text
Run identity
Status / validity
What produced it
What it produced
What consumed those outputs
Main result
Evidence links
```

Example conceptual asset group:

```text
Stage-1 trajectory corpus
- canonical asset ID
- 1,440 expected / observed rows where applicable
- run that produced it
- source manifest
- HF dataset/revision if published
- Kaggle execution binding if applicable
- digest / verification status
- downstream MiniMax/OPSD consumers
```

Checkpoint group:

```text
Checkpoint <milestone>
- canonical asset ID
- checkpoint role
- produced by run / update
- scientific status
- HF repo + immutable revision if published
- digest
- consumed by successor run(s)
- whether it is retained, reconstructible, superseded, or retired
```

### Provider presentation

Use consistent official/provider brand marks where available (GitHub, Hugging Face, W&B, Kaggle) and reuse the site's existing external-brand component rather than inventing unrelated icon treatments.

---

## 10. Results architecture

The Results area should stop being a second chronological notebook.

It should answer:

1. What has been measured?
2. Which evidence is still valid?
3. What conclusions are supported?
4. What conclusions were superseded or narrowed?
5. What remains unknown?
6. Which design/run/asset supports each claim?

### Results claim card contract

Each important claim should eventually be traceable to:

```text
claim_id
human-readable claim
scope
supporting_designs[]
supporting_runs[]
supporting_assets[]
validity
checked_at
supersedes / superseded_by
claim_boundary
```

Results pages should link back to evidence instead of duplicating entire design histories.

---

## 11. Search, sitemap, and navigation contract

Search should eventually index:

- design families;
- canonical and alias names;
- model arms;
- important runs;
- important assets;
- provider IDs when public-safe;
- historical/superseded labels;
- result/claim titles.

Search result types must visibly distinguish `Design`, `Run`, `Asset`, `Result`, `Historical`, `Model`, and `Paper` rather than presenting every object as the same kind of card.

The sitemap must reflect canonical public pages, not every internal implementation object.

Navigation should not force users to know whether something is stored under `results/`, `capability-exploration/`, or an old Stage-specific route in order to find it.

---

## 12. Copy and language contract

All rewritten copy must continue to follow the repository's human-thinking / “说人话” standards.

### Required order for technical explanations

Prefer:

```text
What are we trying to learn?
-> What did we do?
-> What happened?
-> Why does that matter?
-> Technical evidence if needed
```

Avoid opening a section with unexplained internal labels such as `7 < 8`, `G3`, `WB1`, `H1.27`, `Stage2-vNext`, or `NOOP gate` before explaining the scientific meaning.

### Language defaults

- canonical IDs, repository/project names, run/artifact titles: English;
- website explanatory content: Chinese first;
- new canonical research pages: Chinese + English where practical;
- machine fields, model names, metric keys, provider IDs: preserve exact original spelling;
- English companion content must not make stronger scientific claims than the Chinese source.

---

## 13. Security and privacy boundary

The public projection must exclude:

- secrets, API keys, tokens, credential transport artifacts;
- private server usernames/IPs/hostnames unless explicitly approved as public research infrastructure;
- personal MacBook/device information;
- private paths that reveal unnecessary identity or infrastructure information;
- raw logs containing credentials or private identifiers;
- unpublished artifacts whose access is not authorized.

A credential-transport dataset is not a scientific asset and must never appear in the public asset catalog merely because it exists on Kaggle/HF/server storage.

---

# 14. EXECUTION CHECKLIST

Checkboxes below are the operational source of truth for this project.

## Phase A — Freeze the baseline and collect authority documents

- [x] **A01** Record the exact `basemodel/main` SHA used as the website-audit baseline.
- [x] **A02** Record the exact `openevo-experiment` authority branch/SHA used for the first identity/provenance audit.
- [x] **A03** Read and reconcile the current cross-platform experiment asset standard.
- [x] **A04** Read the current artifact archive/publication and experiment-standard parents referenced by that standard.
- [x] **A05** Read the current `basemodel` scientific-state provenance, research mission, presentation, copy, visual, and deployment contracts relevant to this work.
- [x] **A06** Inspect the current Experiment Designs implementation already on `main` and document what is hard-coded versus generated.
- [x] **A07** Define a dated audit snapshot so website facts are never silently mixed across upstream SHAs.

**Phase A acceptance:** one authority note identifies every source repository/ref used by the audit and the precedence order between them.

Evidence: [2026-09-03 authority snapshot](./seed-openevo-research-ia-authority-snapshot-2026-09-03.md).

---

## Phase B — Inventory the entire existing research site

- [ ] **B01** Enumerate every SEED × OpenEvo public route from sitemap plus filesystem routes.
- [ ] **B02** Classify every route as `concept`, `design`, `run`, `asset`, `analysis`, `result`, `history`, `operations`, or `mixed`.
- [ ] **B03** Record parent/child links currently exposed by navigation and in-page links.
- [ ] **B04** Identify orphan pages that are reachable only by old links or search.
- [ ] **B05** Identify duplicate pages describing the same scientific design/run/result.
- [ ] **B06** Identify pages that mix stable explanation with mutable live-state claims.
- [ ] **B07** Identify pages whose title/path no longer matches their scientific role.
- [ ] **B08** Inventory bilingual vs Chinese-only coverage.
- [ ] **B09** Inventory current search-index coverage for research objects.
- [ ] **B10** Produce a route inventory table with recommended disposition: `keep`, `rewrite`, `merge`, `redirect`, `historical`, or `remove-after-redirect`.

**Phase B acceptance:** every existing research route has exactly one disposition and one intended semantic owner.

---

## Phase C — Audit factual claims and freshness

- [ ] **C01** Extract mutable scientific-state claims from research overview pages.
- [ ] **C02** Extract mutable claims from Study/design pages.
- [ ] **C03** Extract mutable claims from Results and result subpages.
- [ ] **C04** Extract mutable claims from capability-exploration and Stage-specific pages.
- [ ] **C05** Extract mutable claims from model-specific self/MiniMax/cross-arm analysis pages.
- [ ] **C06** For each claim, record source evidence, source SHA, checked date, and claim boundary where available.
- [ ] **C07** Mark claims as `current-supported`, `historical-supported`, `superseded`, `stale-unknown`, `duplicate`, or `unsupported`.
- [ ] **C08** Resolve contradictions by walking upstream authority rather than choosing the newest-looking website page.
- [ ] **C09** Identify old tests/docs that force stale phase/allocation/next-step wording.
- [ ] **C10** Produce a factual-debt register that future rewrites consume.

**Phase C acceptance:** no planned rewrite relies on an undated website statement as its own source of truth.

---

## Phase D — Audit canonical experiment and asset identity

- [ ] **D01** Locate the current cross-platform registry/public-safe dry-run or successor registry in `openevo-experiment`.
- [ ] **D02** Enumerate current design families and canonical design IDs.
- [ ] **D03** Enumerate formal/qualification/diagnostic runs and their canonical run IDs where registered.
- [ ] **D04** Enumerate public-relevant asset kinds: trajectory sets, checkpoints, adapters, analyses, reports, receipts, manifests, metric tables.
- [ ] **D05** Verify provider bindings for GitHub/HF/W&B/Kaggle where available.
- [ ] **D06** Verify aliases preserve historical names rather than renaming scientific identity.
- [ ] **D07** Identify assets with missing canonical IDs or ambiguous run ownership.
- [ ] **D08** Identify provider objects that exist but are non-scientific credential transport or otherwise must stay out of public catalog.
- [ ] **D09** Identify asset families too granular for dedicated web pages and define their grouping rule.
- [ ] **D10** Produce a canonical object graph: `design -> run -> asset -> provider revision -> downstream consumer`.

**Phase D acceptance:** every website-facing experiment family and important asset can be joined back to upstream canonical identity or is explicitly marked unresolved.

---

## Phase E — Freeze the new information architecture before UI mutation

- [ ] **E01** Finalize the four top research concepts: Overview, Experiment Designs, Results & Conclusions, Assets & Evidence.
- [ ] **E02** Finalize the conceptual/history boundary between `/flow/` and `/study/`.
- [ ] **E03** Finalize route rules for design family pages.
- [ ] **E04** Finalize criteria for when a run earns a dedicated page versus appearing inside a design page.
- [ ] **E05** Finalize criteria for when an asset earns a dedicated page versus appearing in a run asset table.
- [ ] **E06** Finalize the History/Superseded organization.
- [ ] **E07** Finalize legacy URL redirect/retention strategy.
- [ ] **E08** Finalize Chinese/English route parity for new canonical pages.
- [ ] **E09** Produce a before/after site tree and route migration matrix.
- [ ] **E10** Confirm no proposed route requires changing scientific identity solely for presentation.

**Phase E acceptance:** the intended destination of every old route and every new canonical object type is known before broad page rewriting begins.

---

## Phase F — Build the public-safe research projection contract

- [ ] **F01** Define the concrete schema for design-family projection consumed by `basemodel`.
- [ ] **F02** Define the concrete schema for run projection.
- [ ] **F03** Define the concrete schema for asset and provider-binding projection.
- [ ] **F04** Define lifecycle/validity/asset-lifecycle enums and impossible combinations.
- [ ] **F05** Define source SHA, checked-at, claim-boundary, and supersession fields as required provenance metadata.
- [ ] **F06** Define public/private filtering rules.
- [ ] **F07** Define validation for duplicate canonical IDs and dangling references.
- [ ] **F08** Define how `basemodel` receives or refreshes the upstream projection without requiring live runtime access during normal page rendering.
- [ ] **F09** Define failure behavior when the projection is stale, malformed, or incomplete.
- [ ] **F10** Replace the Experiment Designs component's long-term hard-coded scientific authority with projection consumption while retaining its useful reader-facing grouping.

**Phase F acceptance:** one validated public-safe projection can drive design, run, asset, provider-link, and provenance views without copying mutable state into multiple components.

---

## Phase G — Rebuild Research Overview and Experiment Designs

- [ ] **G01** Rewrite the Study landing page as a research map rather than a mixture of old results and next-run details.
- [ ] **G02** Make Experiment Designs a primary discoverable destination.
- [ ] **G03** Render top-level cards only for real scientific design families/questions.
- [ ] **G04** Move implementation/qualification/diagnostic child configs behind the correct family.
- [ ] **G05** Add design-family detail views with question, changes, fixed conditions, arms/models, budget, lifecycle, validity, and evidence.
- [ ] **G06** Show predecessor/successor relationships explicitly.
- [ ] **G07** Explain terms before internal experiment labels.
- [ ] **G08** Keep current-state callouts dated and source-labelled.
- [ ] **G09** Add consistent official external-provider marks to evidence links.
- [ ] **G10** Implement equivalent English structure without stronger claims.

**Phase G acceptance:** a reader can understand the experiment tree without visiting Stage/model-specific pages first.

---

## Phase H — Add Run and Asset evidence views

- [ ] **H01** Add run-level evidence summaries under each design family.
- [ ] **H02** Show run lifecycle and scientific validity as separate concepts.
- [ ] **H03** Show what each run produced and what downstream stages consumed it.
- [ ] **H04** Add grouped asset tables for trajectories/checkpoints/adapters/analysis/receipts/manifests.
- [ ] **H05** Surface canonical asset IDs and immutable provider revisions where public-safe.
- [ ] **H06** Show HF/W&B/Kaggle/GitHub bindings as provider locations, not alternate scientific identities.
- [ ] **H07** Add dedicated asset pages only for scientifically important milestone assets.
- [ ] **H08** Add asset lifecycle/recoverability labels without implying delete authorization.
- [ ] **H09** Ensure checkpoint pages/tables state provenance and role, not merely file size/name.
- [ ] **H10** Verify no secret/private infrastructure data enters generated pages.

**Phase H acceptance:** an important published checkpoint or trajectory corpus can be traced from website -> canonical asset -> producing run -> provider revision/evidence.

---

## Phase I — Rebuild Results, conclusions, and historical lineage

- [ ] **I01** Separate current evidence-backed conclusions from chronological experiment narration.
- [ ] **I02** Map each major conclusion to supporting design(s), run(s), and asset(s).
- [ ] **I03** Preserve measured negative results as valid evidence when protocol-valid.
- [ ] **I04** Move superseded interpretations into explicit historical context instead of silently rewriting them.
- [ ] **I05** Create or finalize a History/Superseded map for failed/incorrect but informative designs.
- [ ] **I06** Explain why the old 256-window / old gate design was superseded before showing internal numeric shorthand.
- [ ] **I07** Preserve old 3B/7B/MiniMax/self-analysis evidence under the correct design/run/analysis parents.
- [ ] **I08** Prevent stale “next step” text from appearing as current scientific authority.
- [ ] **I09** Update result-page metadata/descriptions that still describe old Track A/Track B/WB1 state as present tense.
- [ ] **I10** Add clear unknown/unresolved states rather than guessed conclusions.

**Phase I acceptance:** current conclusions, historical evidence, and superseded interpretations are visibly distinct and all major claims are traceable.

---

## Phase J — Migrate legacy pages and repair the graph

- [ ] **J01** Apply the route migration matrix from Phase E.
- [ ] **J02** Merge duplicate content into canonical design/result/history pages.
- [ ] **J03** Convert legacy Stage/model pages into historical/detail views when they still have unique evidence.
- [ ] **J04** Add redirects for pages fully replaced by canonical destinations.
- [ ] **J05** Preserve deep links from prior GitHub/chat/research records.
- [ ] **J06** Update cross-page navigation and breadcrumbs to reflect object hierarchy.
- [ ] **J07** Update sitemap canonical routes.
- [ ] **J08** Update search index types, labels, aliases, and destinations.
- [ ] **J09** Remove stale duplicate navigation entries only after replacement routes resolve.
- [ ] **J10** Run an orphan-link audit and eliminate unintended dead ends.

**Phase J acceptance:** every known old route either remains intentionally meaningful or resolves to a documented semantic successor.

---

## Phase K — Repository validation and semantic gates

- [ ] **K01** Add/extend tests for canonical ID uniqueness.
- [ ] **K02** Add/extend tests for dangling design/run/asset/provider references.
- [ ] **K03** Add/extend tests preventing undated `current/now/next/active` scientific claims where provenance is required.
- [ ] **K04** Add/extend tests separating lifecycle from validity and `not-run` from zero.
- [ ] **K05** Add/extend tests for historical/superseded labels on legacy evidence.
- [ ] **K06** Add/extend tests for public-safe filtering and provider links.
- [ ] **K07** Validate Chinese/English canonical route availability.
- [ ] **K08** Run repository claim/freshness/link/search/sitemap audits relevant to the changed surface.
- [ ] **K09** Run `npm run verify:deploy` on the exact intended release tree.
- [ ] **K10** Run `npm run build` and confirm no generated-route or content errors.

**Phase K acceptance:** deterministic repository gates pass without weakening existing audits or encoding stale current-state values into tests.

---

## Phase L — UI/browser acceptance

- [ ] **L01** Check research home, designs, representative design detail, representative run/asset evidence, Results, and History on desktop.
- [ ] **L02** Check the same critical journey on iPhone/mobile viewport.
- [ ] **L03** Check light and dark themes.
- [ ] **L04** Check Chinese and English canonical routes.
- [ ] **L05** Check long IDs, hashes, provider revisions, and tables for overflow/clipping.
- [ ] **L06** Check progressive-disclosure controls and deep links.
- [ ] **L07** Check search behavior for design/run/asset aliases.
- [ ] **L08** Check redirected legacy URLs.
- [ ] **L09** Run the strongest applicable repository UI suite (`test:ui` or `test:ui:all` based on actual shared-surface changes).
- [ ] **L10** Record any browser-console/runtime errors and close them before release acceptance.

**Phase L acceptance:** the owner is not the first person to discover dark-mode, mobile, overflow, navigation, or deep-link breakage.

---

## Phase M — Vercel Preview, merge, and Production

- [ ] **M01** Consolidate the deployable change into a deployment-eligible non-main branch/PR.
- [ ] **M02** Avoid `[vercel-preview]` on intermediate commits.
- [ ] **M03** Add `[vercel-preview]` only to the exact head intended for hosted acceptance.
- [ ] **M04** Confirm the exact-head Vercel Preview reaches READY.
- [ ] **M05** Inspect Preview build logs for warnings/errors relevant to the change.
- [ ] **M06** Perform independent Preview smoke checks on the new canonical research journey and representative legacy redirects.
- [ ] **M07** Confirm required GitHub CI/checks are green for the accepted head.
- [ ] **M08** Merge the accepted PR without introducing an untested semantic tree.
- [ ] **M09** Confirm the merge SHA receives a READY Production deployment.
- [ ] **M10** Independently verify `https://basemodel-preview.vercel.app` Production routes, links, search, and representative redirects.

**Phase M acceptance:** exact-head Preview and merge-SHA Production are separately proven; a READY badge alone is insufficient.

---

## Phase N — Closeout and long-term maintenance

- [ ] **N01** Update this masterplan's completed checkboxes with final evidence references.
- [ ] **N02** Update the relevant current Agent docs if ownership, refresh workflow, or information architecture changed materially.
- [ ] **N03** Document the authoritative refresh path from `openevo-experiment` to `basemodel`.
- [ ] **N04** Document what event should trigger a website projection refresh (new design, reconciliation, published asset, supersession, etc.).
- [ ] **N05** Ensure future Agents do not manually reintroduce hard-coded duplicate scientific state.
- [ ] **N06** Record legacy redirects/historical pages that must not be casually removed.
- [ ] **N07** Record unresolved upstream identity gaps separately rather than hiding them with website guesses.
- [ ] **N08** Produce a final before/after information-architecture summary.
- [ ] **N09** Record final Vercel Preview/Production evidence and merge SHA.
- [ ] **N10** Mark this masterplan `COMPLETE` only when A–N acceptance criteria are all satisfied.

---

# 15. Migration decision rules

When reviewing an existing page, use this order:

### KEEP

Use when the page has a clear unique reader role and its facts can be wired to current provenance.

### REWRITE

Use when the route is semantically correct but the content is stale, duplicated, too implementation-first, or hand-maintained.

### MERGE

Use when multiple pages describe the same design/result and splitting them forces readers to reconstruct the relationship manually.

### HISTORICAL

Use when the page preserves scientifically useful evidence from an old or superseded design.

### REDIRECT

Use when the old route has no unique scientific value after migration but old links must continue to resolve.

### REMOVE-AFTER-REDIRECT

Use only when redirect coverage, search/sitemap migration, and deep-link checks prove no unique public evidence is being lost.

---

# 16. Completion definition

This project is **not complete** merely because:

- a new catalog exists;
- the home page looks cleaner;
- old text was rewritten;
- a Vercel Preview is READY;
- the new pages have provider icons;
- a few checkpoint links exist.

It is complete only when:

1. the website's research structure follows design -> run -> asset -> evidence relationships;
2. mutable scientific state comes from a dated/source-labelled projection rather than scattered hand-written page truth;
3. important assets such as checkpoints, trajectories, adapters, and analyses have canonical provenance and provider bindings visible at the appropriate depth;
4. historical/superseded work remains findable without being mistaken for current methodology;
5. major Results claims trace to designs/runs/assets;
6. legacy routes have intentional outcomes;
7. search/sitemap/navigation understand the new object graph;
8. privacy/security boundaries hold;
9. repository semantic/build/UI gates pass;
10. exact-head Vercel Preview and merge-SHA Production are both independently accepted;
11. all required A–N checkboxes are checked with evidence.

---

# 17. Execution log

Use this table for milestone evidence while executing the checklist.

| Date (SGT) | Phase / items | Evidence | Notes |
| --- | --- | --- | --- |
| 2026-09-03 | Masterplan created | this document | No website mutation performed by creation of this plan. |
| 2026-09-03 | Phase A · A01–A07 | [authority snapshot](./seed-openevo-research-ia-authority-snapshot-2026-09-03.md) | Baselines pinned; standards/contracts reconciled; catalog hard-code boundary documented; current-campaign router conflict recorded. |

---

# 18. First action after approval

Start with **Phase A**, then perform **B + C + D as a read-only audit** before broad UI/content mutation. The first meaningful deliverable is therefore not a rewritten page: it is the route inventory + factual-debt register + canonical object graph + route migration matrix.

Only after those are internally consistent should the implementation proceed to projection/data wiring and page migration.