# SEED × OpenEvo Canonical Object Graph Audit — 2026-09-03

Status: **PHASE D AUDIT COMPLETE**
Website baseline: `mykcs/basemodel@3151686bdc594e723d08764b180532e86ef02fd3`
Accepted Phase-C main: `mykcs/basemodel@ec12bb5fd2809acad330f5530bfeb0c5cc1f553c`
Scientific merged governance baseline: `mykcs/openevo-experiment@8692bf6dfbfdb948b7f6a7229fb65f26a49566a9`
Merged cross-platform governance milestone: `bb57c88eb5de3036dee3ea9b095bc550dd6882c8`
Active Stage1 scientific lineage: PR #270 at the Phase-A frozen audit head `8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f`
Supplementary Draft asset-control plane: PR #268 at `9b410451ea5184e238a51f88f99d6c65fad29e80`

This document is the Phase D identity audit. It answers a narrower question than Phase C:

> Which scientific objects can already be joined through canonical identity, and which provider/run/asset objects must remain unresolved instead of being guessed into the website?

The object graph described here is an **audit projection**, not a new scientific authority. Frozen designs, receipts, reconciliations, immutable provider revisions, and exact hashes remain upstream authority.

---

## 1. D01 — registries and projections located

### 1.1 Merged design-family dry-run

Merged governance evidence contains:

```text
docs/evidence/server-audits/2026-09-03/
  cross-platform-asset-governance-dry-run/
    DESIGN_FAMILY_DRY_RUN.json
    PUBLIC_SAFE_DRY_RUN_SUMMARY.json
```

at `openevo-experiment@bb57c88eb5de3036dee3ea9b095bc550dd6882c8`.

The design-family dry-run is read-only and groups 49 design/config candidates into reader-level families instead of treating every config as a separate experiment.

Its own publication rule says the catalog is a website candidate projection, not scientific authority; every member remains owned by its pinned Git source.

### 1.2 Draft successor asset registry

PR #268 introduces the next registry/control layer:

```text
configs/experiment/asset-registry/README.md
configs/experiment/asset-registry/public-current-catalog.v1.json
schemas/experiment-asset-graph-node.schema.json
schemas/experiment-provider-observation.schema.json
schemas/server-run-passport.schema.json
```

plus generators/validators and public-safe closeout summaries.

The model is intentionally two-layered:

```text
Provider Observation Registry
  = every observed physical provider object, including unresolved objects

Canonical Asset Graph
  = only objects whose scientific identity is proven by Git / receipt / revision / hash
```

A provider object must never receive a canonical identity from naming similarity alone.

### 1.3 Current scale of the registry snapshot

PR #268 public-safe integration summary records:

```text
provider observations: 1608
  server: 242
  W&B: 1156
  Hugging Face: 27
  Kaggle: 183

canonical private graph: 25 nodes / 18 edges
public catalog: 7 nodes
OpenEvo credential-transport observations: 2
sensitive-hold observations: 3
```

The private graph is explicitly a seed. It does not claim that all unresolved observations have canonical scientific identity.

### 1.4 Server Run Passports

The run-passport closeout records:

```text
server top-level run roots: 244
unique passport IDs: 244
fully resolved canonical scientific lineages: 4
strongly partial: 11
partial: 134
legacy uncertain: 95
```

Run-root roles include:

```text
formal scientific run: 12
qualification/smoke: 62
scientific diagnostic: 13
legacy scientific experiment: 21
engineering/control/diagnostic: 19
campaign or multi-run container: 37
other support/archive/tracking roots: remaining roots
```

This is why the website must not turn “one server directory” into “one public experiment card”.

---

## 2. D02 — current design/campaign identity

### 2.1 Current campaign candidate in the public catalog

PR #268 generated public catalog declares:

```text
campaign canonical_id:
202609030400-ceiling1-autonomous-v1

display title:
Ceiling-1.0 Shared Stage1 Rerun and Successor Campaign

scientific_lifecycle:
running

scientific_validity:
not-assessed
```

The public catalog binds this campaign to GitHub scientific governance and describes PR #270 as the current Ceiling-1.0 dual-model line using the `202609030400` shared harness.

Important boundary: PR #268 is Draft. These canonical IDs are the current **registry candidate** for the website projection; they do not override PR #270 scientific evidence and should not be treated as merged registry authority until the registry work itself lands.

### 2.2 Current website-facing design IDs in the PR #268 public catalog

Five design nodes are currently projected under the campaign:

| Design | Canonical design ID | Stage | Lifecycle | Important boundary |
| --- | --- | --- | --- | --- |
| Shared Stage1 Harness 202609030400 | `202609030400-ceiling1-autonomous-v1--shared-stage1-harness` | Stage1 | frozen | current shared raw-collection design |
| Stage1 Post-Collection Audit and MiniMax Handoff | `202609030400-ceiling1-autonomous-v1--postcollection-minimax-handoff` | MiniMax | frozen | MiniMax is gated behind corpus seal + post-collection audit |
| OPSD v2 Parametric Bootstrap | `202609030400-ceiling1-autonomous-v1--opsd-v2-parametric-bootstrap` | OPSD | frozen | downstream; no new WebShop/student/teacher budget in this bootstrap design |
| Stage2-vNext Persistent Evidence Learning | `202609030400-ceiling1-autonomous-v1--stage2-vnext-3b` | Stage2 | frozen | currently 3B-specific design; not an automatic 1.7B replacement |
| GDN D1 Prospective Task-Vector Confirmation | `202609030400-ceiling1-autonomous-v1--gdn-d1-prospective-confirmation` | GDN | frozen | prospective diagnostic after accepted Stage2 parametric updates |

The catalog also contains one public asset node for the scientific runtime; see D04/D05.

### 2.3 Historical/predecessor design families that must remain reachable

The merged read-only design-family dry-run proposed these seven reader-level families for the pre-`030400` state:

```text
fresh-stage1-202609021800
stage1-shared-harness-deliberation
stage1-minimax-posthoc
stage1-opsd-v2
stage2-vnext
gdn-d1
ceiling1-end-to-end-autonomous
```

and separately preserves the existing website family:

```text
historical-capability-exploration
```

These family IDs are valuable predecessor/history groupings. They are not all current canonical design IDs. Phase E must preserve their historical evidence while making the `202609030400` design graph the current route owner.

---

## 3. D03 — run identity coverage

### 3.1 Current formal Stage1 runs with declared canonical IDs

The PR #268 `202609030400` Stage1A phase releases declare two formal run canonical IDs.

#### Qwen2.5-3B

```text
202609030400-ceiling1-autonomous-v1
--shared-stage1-harness
--qwen25-3b
--formal
```

The same release declares the produced trajectory corpus:

```text
202609030400-ceiling1-autonomous-v1
--shared-stage1-harness
--qwen25-3b
--formal
--trajectory-corpus--stage1
```

#### Qwen3-1.7B

```text
202609030400-ceiling1-autonomous-v1
--shared-stage1-harness
--qwen3-1p7b
--formal
```

Produced corpus:

```text
202609030400-ceiling1-autonomous-v1
--shared-stage1-harness
--qwen3-1p7b
--formal
--trajectory-corpus--stage1
```

Each phase release also declares recovery and runtime-telemetry child identities. Those are run-support assets, not separate public experiments.

### 3.2 What the current public catalog does **not** yet expose

`public-current-catalog.v1.json` has 7 nodes but no `node_level = run` node. Therefore the two current formal run IDs are proven by their phase-release asset contracts but are not yet materialized as public catalog run nodes.

This is an explicit Phase-F projection gap, not permission to invent a different run name on the website.

### 3.3 Qualification and diagnostic runs

The server passport summary proves that many qualification/smoke and scientific-diagnostic run roots exist, but it intentionally does not publish private run-root identity details.

The merged design-family catalog registers many qualification/diagnostic **design/preregistration members**, for example shared-harness microqualification and Stage2 preformal diagnostics. However, the current public catalog does not expose canonical public run nodes for those executions.

Therefore Phase D records:

```text
qualification/smoke run roots exist: yes
diagnostic run roots exist: yes
public canonical run IDs available from current catalog: no
safe website behavior: do not invent them
```

### 3.4 Historical arm mapping gap

The existing website's 3B/7B self/MiniMax/four-arm pages remain valuable sealed/stopped evidence, but the current public registry does not yet provide direct canonical run nodes joining those website pages to exact historical run identities.

They remain **historical evidence with unresolved canonical run join** until a registry/backfill proves the mapping.

---

## 4. D04 — asset kinds and currently proven identities

### 4.1 Immutable prerequisite assets consumed by current Stage1

The current Stage1 releases refer to logical canonical assets rather than embedding provider paths:

```text
openevo--asset--model--qwen25-3b
openevo--asset--model--qwen3-1p7b
openevo--asset--dataset--seed-webshop-v1
openevo--asset--runtime--h144-scientific
openevo--asset--environment--seed-webshop-v1
```

The asset-registry contract explicitly separates model, benchmark dataset, environment/source tree, and runtime image even if historical directories bundled several together.

### 4.2 Assets produced/supporting current Stage1

Per arm the release contract identifies:

```text
formal run
trajectory corpus
shard recovery state
runtime telemetry
```

The current release has no publication entries yet.

### 4.3 Public historical asset classes already represented in HF governance

The merged HF asset registry shows distinct roles including:

```text
canonical/compatibility trajectory archives
canonical/compatibility adapter/model-state archives
incremental checkpoint + NO_UPDATE pointer archives
historical frozen SD-LoRA artifacts
measurement-invalid mechanism-screen artifacts
reproducible runtime archive
private Stage1 evidence archives
private OPSD checkpoint archives
```

This proves why website asset UX must display scientific role/validity and not merely a filename or repo name.

### 4.4 Asset kinds the website schema must support even when not yet public nodes

Phase F should be able to represent at least:

```text
trajectory-set / trajectory-corpus
checkpoint / model-state / no-update pointer
adapter
analysis
report
receipt
manifest
metric-table
prompt/design contract
runtime-image
environment/source tree
benchmark dataset
base model
recovery state
runtime telemetry
```

Not every kind earns a dedicated public page; D09 defines grouping.

---

## 5. D05 — provider-binding verification

### GitHub

Verified as the primary public scientific-governance binding in the current PR #268 catalog:

- campaign node -> PR #270 / immutable Git revision;
- design nodes -> exact frozen design/handoff files at immutable Git revisions.

This is appropriate for public projection.

### Hugging Face

Verified public binding in `public-current-catalog.v1.json`:

```text
canonical asset:
openevo--asset--runtime--h144-scientific

provider:
huggingface

provider object:
miyuki17/openevo-scientific-runtime-docker
```

The merged HF registry separately proves multiple historical public/private canonical and compatibility assets, with immutable revisions where applicable and explicit classifications/retention rules.

### Server

The current phase releases have exact server execution bindings and the server-passport system covers all 244 run roots, but private server paths are not public website data.

The public website should expose canonical run/asset IDs and public-safe status, not private absolute paths.

### W&B

Provider observations exist at scale and Run Passports record W&B bindings for many roots, but the current 7-node public catalog contains no W&B binding for the two current Stage1 formal runs.

Therefore:

```text
W&B observation != current canonical public binding
```

Do not manufacture a W&B URL for the current run until the registry provides one.

### Kaggle

The observation inventory contains Kaggle notebooks/datasets and identifies OpenEvo-related assets, but the current public catalog contains no canonical Kaggle binding for the two active Stage1 formal runs.

Therefore:

```text
Kaggle object observed != scientific asset identity proven
```

Historical Kaggle links may remain only when they already have an evidence binding; new canonical pages must wait for registry proof.

### Basemodel

Basemodel is deliberately a downstream derived binding. It should be added only after a canonical website route exists; it must never be used to prove upstream scientific identity.

---

## 6. D06 — aliases and historical-name preservation

The governance model separates:

```text
canonical_id
provider_id
display_title_en
aliases[]
```

Verification from the current audit:

1. PR #268 public catalog carries `aliases[]` as a first-class field.
2. New current nodes currently have empty alias arrays rather than fabricated aliases.
3. Asset-graph integration performed **0 provider renames** and **0 provider deletes**.
4. The merged HF registry keeps stable historical repo IDs and explicitly says not to rename canonical public archives merely for aesthetics.
5. HF compatibility copies are marked `canonical: false` rather than being silently renamed into the canonical object.
6. Duplicate-identity evidence is retained for compatibility copies until reference migration/fresh verification is complete.

Therefore the website migration rule is:

> Preserve old route/provider names as aliases or compatibility links; never change frozen scientific identity merely to make the UI tidy.

---

## 7. D07 — unresolved/ambiguous identity register

### U-01 — observation inventory is much larger than canonical graph

```text
provider observations: 1608
private canonical graph nodes: 25
public catalog nodes: 7
```

The integration summary explicitly says the private graph is only a seed and does not claim all unresolved observations have been assigned canonical identity.

Website rule: do not show an observation as a scientific asset merely because it exists on a provider.

### U-02 — most server run roots are not fully resolved

```text
244 passports
4 fully resolved scientific lineages
11 strongly partial
134 partial
95 legacy uncertain
```

Website rule: Passport existence proves durable root identity/navigation, not full scientific lineage.

### U-03 — current two formal run IDs are release-defined but absent from public catalog

The current Stage1 releases prove two formal canonical run IDs and two trajectory-corpus IDs, but the generated public catalog has no run nodes.

Website rule: Phase F must materialize these from the release/graph; do not hand-code a second naming scheme.

### U-04 — historical four-arm result pages lack canonical public run joins

The site archive has provider/archive revision hints, but Phase D did not find public canonical run nodes joining each historical arm page to exact upstream run identity.

Website rule: preserve existing pages, label identity linkage unresolved, and backfill through registry rather than copying numbers into new pages as if fully joined.

### U-05 — qualification/diagnostic run roots have no public canonical run nodes

Many such roots exist, but only design/prereg records are publicly visible at this audit depth.

Website rule: group them under the owning design family and show individual run details only after canonical proof.

### U-06 — current provider publication for active Stage1 is intentionally empty

Both `202609030400` Stage1A releases contain:

```text
publication: []
```

Website rule: do not show HF/W&B/Kaggle publication links for these current corpora until a later exact provider binding is generated/verified.

---

## 8. D08 — objects explicitly excluded from the public scientific catalog

### Credential transport

The provider observation schema has a security class:

```text
non-scientific-credential-transport
```

and a resolution state:

```text
sensitive-hold
```

The integration summary records:

```text
OpenEvo credential-transport observations: 2
sensitive-hold observations: 3
secret contents read: false
```

These objects must never become public scientific assets.

### Private provider objects

Private server paths and private HF staging archives may prove upstream identity but are not automatically public bindings.

The HF registry explicitly distinguishes public and private assets. A private canonical repo is still not a website download link.

### Unresolved observations

`unresolved`, `candidate`, and `legacy-alias` provider observations remain observations until proof is sufficient. The website projection must fail closed rather than converting them to public scientific nodes.

### Personal infrastructure

No personal MacBook/device inventory, usernames, IPs, private hostnames, credentials, or unnecessary private paths should enter the public projection.

---

## 9. D09 — grouping rules for web pages

The registry can track much more detail than the website should give dedicated pages.

### A run earns a dedicated public page only when all are true

1. canonical run identity is proven;
2. it has a clear scientific role (formal arm, important closed diagnostic, or historically decisive run);
3. lifecycle/validity can be stated without guessing;
4. at least one meaningful public-safe evidence/output relation exists;
5. the page adds explanatory value beyond a one-row table.

Otherwise the run appears under its design family or History table.

### An asset earns a dedicated public page only when all are true

1. canonical asset identity is proven;
2. its scientific role is important (canonical corpus, final/milestone checkpoint, canonical adapter, important analysis/report, key verification receipt/runtime);
3. provider/publication state is public-safe;
4. immutable revision/hash or equivalent verification can be shown where appropriate;
5. it is likely to be referenced independently by readers/Agents.

### Assets that normally stay grouped under the run

```text
individual episode files
ordinary shard outputs
runtime telemetry samples
recovery shards
intermediate non-milestone checkpoints
implementation-only receipts
repeated compatibility copies
```

### Provider observations never earn pages merely from existence

A W&B run, Kaggle notebook, HF repo, or server root becomes a website object only through a canonical scientific join or a deliberate non-scientific operations view.

### Historical checkpoint grouping

For historical incremental checkpoint families:

- show one run/asset family table;
- surface milestone checkpoints and NO_UPDATE pointers;
- preserve exact provider revision/digest when public;
- do not create dozens/hundreds of near-identical pages.

---

## 10. D10 — canonical object graph for the current website projection

### 10.1 Current bounded lineage

```text
Campaign
202609030400-ceiling1-autonomous-v1
│
├─ Design
│  202609030400-ceiling1-autonomous-v1--shared-stage1-harness
│  │
│  ├─ consumes model asset: openevo--asset--model--qwen25-3b
│  ├─ consumes model asset: openevo--asset--model--qwen3-1p7b
│  ├─ consumes dataset:     openevo--asset--dataset--seed-webshop-v1
│  ├─ consumes environment: openevo--asset--environment--seed-webshop-v1
│  ├─ consumes runtime:     openevo--asset--runtime--h144-scientific
│  │
│  ├─ Formal run
│  │  ...--shared-stage1-harness--qwen25-3b--formal
│  │  └─ produces trajectory corpus
│  │     ...--qwen25-3b--formal--trajectory-corpus--stage1
│  │     ├─ recovery state (grouped/private support)
│  │     └─ runtime telemetry (grouped/private support)
│  │
│  └─ Formal run
│     ...--shared-stage1-harness--qwen3-1p7b--formal
│     └─ produces trajectory corpus
│        ...--qwen3-1p7b--formal--trajectory-corpus--stage1
│        ├─ recovery state (grouped/private support)
│        └─ runtime telemetry (grouped/private support)
│
├─ Design
│  202609030400-ceiling1-autonomous-v1--postcollection-minimax-handoff
│  └─ may consume the two sealed Stage1 corpora only after required audit PASS
│
├─ Design
│  202609030400-ceiling1-autonomous-v1--opsd-v2-parametric-bootstrap
│  └─ downstream of frozen Stage1 + MiniMax evidence
│
├─ Design
│  202609030400-ceiling1-autonomous-v1--stage2-vnext-3b
│  └─ downstream 3B persistent-evidence/candidate-state design
│
└─ Design
   202609030400-ceiling1-autonomous-v1--gdn-d1-prospective-confirmation
   └─ prospective diagnostic after accepted Stage2 parametric updates
```

The current campaign manifest explicitly keeps later phase releases empty until prerequisites are satisfied. The graph therefore represents dependencies, not a claim that all nodes have executed.

### 10.2 Current asset/publication boundary

```text
GitHub design/campaign bindings: proven
HF public runtime binding: proven
server execution binding: proven privately; public path omitted
current Stage1 HF publication: not yet bound
current Stage1 W&B public canonical binding: not yet bound
current Stage1 Kaggle public canonical binding: not yet bound
```

### 10.3 Historical/predecessor graph

The following are retained as predecessor/history families, not merged into the current run state:

```text
historical capability exploration
shared-harness/deliberation qualifications
fresh Stage1 202609021800
Stage1 MiniMax post-hoc 202609022300
OPSD v2 predecessor configuration
old Stage2 / 256-window method control
Ceiling-1.0 old Stage2 snapshots
GDN D0/D1 predecessor evidence
old 3B/7B self/MiniMax four-arm analyses
WB1 / Track A / H1.x result lineage
```

Phase E/I will decide their route placement, but Phase D forbids rewriting them into the current `030400` run identity.

---

## 11. Provider/identity coverage matrix

| Object class | Canonical identity available? | Public provider binding available? | Website action |
| --- | --- | --- | --- |
| current campaign | yes, PR #268 candidate catalog + PR #270 scientific owner | GitHub | show current campaign with source/claim boundary |
| current five design nodes | yes, candidate catalog | GitHub | show as current/future design graph; lifecycle separate from execution |
| current 3B formal run | yes in phase release | not yet public-catalog materialized | Phase F should project it; do not invent provider links |
| current 1.7B formal run | yes in phase release | not yet public-catalog materialized | same |
| current Stage1 trajectory corpora | yes in phase releases | publication empty | show identity/status only after public projection; no fake HF link |
| scientific runtime | yes | HF + Git authority | eligible public asset evidence |
| base models/dataset/environment | logical canonical IDs used by release | provider-resolution metadata exists in asset registry/control plane | show only public-safe provider details |
| historical HF canonical assets | yes for many registry entries | public or private per registry | expose only public verified objects; retain private as provenance-only |
| current W&B/Kaggle observations | observation identity yes | canonical scientific join incomplete for current formal runs | do not project as run/asset links yet |
| server run passports | root identity yes for all 244 | private server binding | never equate passport with resolved scientific lineage |
| historical four-arm website runs | website evidence exists | canonical public run join unresolved | retain pages; Phase D debt for registry backfill |
| credential transport | observation only | deliberately sensitive-hold | exclude completely from public scientific catalog |

---

## 12. Phase-D unresolved identity queue handed to implementation

These are not reasons to block the IA design; they are explicit unknowns the website must represent safely.

1. Materialize the two current formal Stage1 run nodes into the public-safe projection from their phase-release canonical IDs.
2. Materialize the two current trajectory-corpus nodes when lifecycle/seal/publication evidence permits.
3. Do not publish private server provider IDs while doing so.
4. Bind current W&B/HF/Kaggle provider objects only after canonical proof; leave absent otherwise.
5. Backfill canonical run/asset joins for historically important 3B/7B self/MiniMax/four-arm evidence if upstream receipts/revisions prove them.
6. Preserve unresolved historical server passports as unresolved rather than inferring lineage from directory names.
7. Keep compatibility provider repos as aliases/compatibility copies; no aesthetic rename/delete migration.
8. Exclude the two credential-transport observations and all other sensitive-hold objects from the public graph.

---

## 13. Phase D acceptance

The Phase-D acceptance condition is:

> Every website-facing experiment family and important asset can be joined back to upstream canonical identity or is explicitly marked unresolved.

Satisfied because:

- current campaign and five current design IDs are enumerated from the generated public catalog;
- two current formal run IDs and trajectory-corpus IDs are enumerated from phase-release asset contracts;
- prerequisite model/dataset/environment/runtime canonical IDs are enumerated;
- provider bindings are separated into proven public, proven private, observation-only, and absent/not-yet-published states;
- historical provider assets preserve canonical/compatibility distinctions and stable names;
- unresolved server/qualification/diagnostic/historical-arm identity is explicitly queued instead of guessed;
- credential transport is explicitly excluded;
- page-granularity rules prevent 1608 observations / 244 server roots from becoming an accidental public page explosion;
- a canonical `campaign -> design -> run -> asset -> provider/downstream` graph is recorded for Phase E/F.

No scientific experiment, provider object, server directory, asset bytes, or public website runtime is mutated by this Phase-D audit.