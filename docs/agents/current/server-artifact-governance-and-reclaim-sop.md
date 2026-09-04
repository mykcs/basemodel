# Shared experiment server artifact governance, publication, and reclaim SOP

Status: **current task orchestrator**  
Last reviewed: **2026-09-04 (UTC+8)**  
Audience: ChatGPT / Codex / other Agents that have authorized access to the experiment server and the relevant GitHub / Hugging Face / container-registry tooling

## Purpose

Use this SOP when the owner says, in effect:

> “整理一下服务器上的科研产物，把该留的东西配好身份证并上传到正确的远端，然后安全清理本地空间。”

This is not just a disk-cleaning procedure. It is one end-to-end governance loop:

```text
live inventory
  -> prove ownership / lineage
  -> classify scientific retention
  -> build or repair artifact passports
  -> deduplicate and publish to the correct remote
  -> independently verify recovery
  -> produce an exact reclaim manifest
  -> obtain the required exact deletion authorization
  -> reclaim only approved project-owned objects
  -> verify bytes and restore paths
  -> refresh the public BaseModel server snapshot
  -> close out with machine-readable + human-readable evidence
```

The goal is that the server remains a **hot working set**, while scientifically meaningful history becomes independently recoverable and reviewable elsewhere.

---

## 0. Authority and source-of-truth order

This document is an orchestrator, not a replacement for the repositories that own server safety and scientific semantics.

Before mutation, read the current versions of the applicable authority documents. When wording conflicts, the newer/more specific canonical authority wins.

### Server / shared-resource authority

Read from `mykcs/zju-server`:

- `AGENTS.md`
- `docs/shared-filesystem-deletion-safety.md`
- `docs/storage-pressure-artifact-reclaim-sop.md`
- `docs/research-artifact-lifecycle.md`
- `docs/agent-friction-register.md`

These own account identity, shared Docker/filesystem boundaries, cleanup authorization, deletion safety, and storage-pressure behavior.

### OpenEvo scientific / artifact authority

For OpenEvo outputs, read from `mykcs/openevo-experiment`:

- `docs/operations/governance/RUN_MANIFEST_CONTRACT.md`
- `docs/operations/publication/EXPERIMENT_ARTIFACT_PUBLICATION_SOP.md`
- `docs/infrastructure/server/SERVER_STORAGE_PRESSURE_AND_RECLAIM_SOP.md`
- the current campaign / result / reconciliation routers referenced by that repository

These own scientific lineage, run provenance, checkpoint/trajectory semantics, publication routing, and current analysis holds.

### BaseModel public-page authority

Read from `mykcs/basemodel`:

- `docs/agents/current/server-storage-pressure-audit-sop.md`
- this document
- the tests that enforce public server privacy/copy rules

These own the public snapshot presentation, not private server ownership.

### Missing authority

If an Agent cannot read one of the canonical documents, do **not** invent the missing rule. Continue only with actions whose authority is already proven; mark the blocked action `HOLD_AUTHORITY_UNRESOLVED`.

Do not trust an old local checkout just because it exists. Resolve the current remote branch / commit first. A stale checkout is a location, not authority.

---

## 1. Authorization semantics for this workflow

A copied prompt pointing to this SOP authorizes the Agent to:

- perform bounded read-only inventory;
- inspect project-owned provenance and liveness evidence;
- create/repair small manifests, indexes, receipts, reports, and documentation;
- publish artifacts to destinations already covered by the project's existing visibility/license policy;
- reuse or verify existing remote artifacts;
- create an exact reclaim proposal and deletion ledger;
- update the BaseModel server page and its tests;
- perform reversible project-scoped staging/quarantine when current server policy allows it.

It does **not** pre-authorize an unknown future destructive deletion list.

For capacity reclaim, follow the current storage-pressure rule:

```text
inventory -> recovery proof -> detailed + plain report -> exact NOT_AUTHORIZED manifest
-> owner approves that exact manifest -> immediate live re-check -> precise deletion
```

Do all non-destructive work first. Ask the owner once, at the exact deletion-manifest boundary, rather than repeatedly asking for routine steps.

Never interpret a guard `DENY`/`HOLD` as permission to retry the same operation through a stronger root/Docker path.

---

## 2. Phase A — live preflight and bounded storage snapshot

### 2.1 Verify the actual execution identity

Before any server operation, verify the identity and shell context used by that exact route. Do not infer it from a previous chat.

For general authorized server inspection, follow the current `zju-server` operator policy. For candidate file cleanup, start through the dedicated cleanup capability documented in `shared-filesystem-deletion-safety.md`.

If Bash semantics are required, make the Bash boundary explicit at the layer that parses the command. Local orchestration shell, SSH, and remote interactive shell can differ.

### 2.2 Capture the filesystem before state

Record at least:

```text
captured_at (explicit UTC+8 timestamp)
filesystem total_bytes
filesystem used_bytes
filesystem available_bytes
filesystem Use%
inode Use%
```

Use `df` as the physical filesystem authority. Do not substitute summed directory sizes or Docker logical-size output for actual free space.

### 2.3 Audit cost is part of safety

Start bounded and exact:

- `stat` / `lstat` / mount metadata;
- known top-level workspace paths;
- exact process/container references;
- shallow, intentionally scoped `du` where necessary.

Do **not** begin with an unbounded recursive `find`, whole-tree checksum, or full shared-home crawl merely because it is read-only. If a deeper walk is required, record why, scope it, use an early stop/timeout when practical, and avoid competing with live science I/O.

### 2.4 Never cross the sibling-user boundary to improve a dashboard

Do not `docker exec` into sibling-user development containers, use a raw Docker socket to mount another user's home, or otherwise exercise a technical bypass merely to obtain a prettier attribution table.

If complete cross-user attribution cannot be refreshed within the current authority boundary:

- refresh current global `df` and safely measurable facts;
- keep the most recent complete anonymous attribution as a separately dated historical snapshot;
- explicitly mark attribution as not freshly recomputed;
- never fabricate missing account totals.

---

## 3. Phase B — build one machine-readable inventory before deciding what to upload or delete

Create a snapshot-specific inventory/ledger. For OpenEvo, prefer the repository's established evidence/server-audit location; otherwise use a clearly scoped project evidence directory or temporary file before committing reviewed evidence.

Every discovered material object must have a row/object, even if the decision is `HOLD`.

Minimum fields:

```text
candidate_id
captured_at
private_source_path_or_image_id
object_kind
size_bytes
filesystem_uid_gid_when_applicable
project
campaign_or_run
scientific_role
source_git_sha
upstream_openevo_sha_if_applicable
model_id_and_revision_if_applicable
runtime_image_digest_if_applicable
task_or_dataset_manifest_identity_if_applicable
ownership_status
ownership_evidence[]
active_process_refs[]
active_container_refs[]
config_or_resume_refs[]
retention_class
passport_status
local_digest_kind
local_sha256_or_tree_manifest
planned_destination
remote_status
remote_revision_or_digest
secret_scan_status
license_visibility_status
restore_test_status
reclaim_status
expected_reclaim_bytes
notes
```

### Completeness rule

The inventory does not need to claim that every byte on the shared machine belongs to a known project. It does need to classify every object that the Agent proposes to touch.

Unknown is a valid state. Guessing is not.

---

## 4. Phase C — prove ownership; names are zero evidence

This is the critical shared-server rule.

Many users run OpenEvo. Therefore none of the following proves ownership:

```text
file/directory name contains openevo
container name contains openevo
Docker image repository/tag looks familiar
worktree path contains a campaign label
old chat says “that one was ours”
UID 0 / root owns the path
an image/container label looks project-like
```

### 4.1 Ownership states

Use explicit states such as:

```text
PROVEN_PROJECT_OWNED
ATTRIBUTABLE_WRITABLE_LAYER
SHARED
OWNER_UNRESOLVED
EXTERNAL
```

Only the first two can ever enter a project reclaim candidate set, and only after the additional liveness/recovery gates.

### 4.2 File / directory ownership proof

For an individual file, combine the relevant evidence:

- location inside the established project workspace;
- effective filesystem owner/mode/ACL;
- a run/artifact manifest that references the exact path or digest;
- campaign/result/reconciliation evidence tying it to the user's project;
- exact Git/config/runtime lineage that produced it;
- no contrary sibling/shared reference.

A pathname or top-level UID alone is insufficient when provenance is ambiguous.

For a directory, **top-level inode ownership is not subtree ownership**. Descendants may contain another UID, mount point, active/open file, symlink, Git common-dir/worktree metadata, or live recovery dependency. Directory mutation requires a separate recursive ownership/reference proof sized to the risk, or it remains `HOLD`.

### 4.3 Git checkout / worktree ownership proof

Before classifying a checkout as disposable, record:

```text
remote URL / repository identity
exact HEAD SHA
branch / detached state
dirty state
untracked unique material
git common-dir / worktree relationship
remote reachability of the exact HEAD
live process/container/config references
```

Remove linked worktrees with Git's worktree mechanism, not blind `rm -rf`.

### 4.4 Docker container writable-layer attribution

A Docker writable layer may be attributed to one account only when the current container metadata gives a reliable unique account/home binding under existing policy.

Container name/label is not enough.

### 4.5 Docker image ownership proof

Before treating an image as project-owned reclaimable material, prove all of:

- exact image ID / content digest;
- linkage from the project's build recipe, run manifest, build receipt, or other exact provenance;
- all current container references and children;
- no sibling-user dependency;
- rollback/restore status;
- remote digest or exact rebuild identity as required by current lifecycle policy.

Shared layers are not allocated to a person merely because one project built or tagged an image.

Never use `docker system prune`, `docker image prune -a`, volume prune, or another shared-daemon global cleanup as a shortcut.

### 4.6 Models and caches

A model name is not ownership. Distinguish:

- project-derived checkpoint/adapter;
- externally downloadable base model/cache;
- shared cache used by multiple jobs;
- unique local model state.

For externally downloadable objects, pin the immutable upstream revision before considering local reclaim. For project-derived state, require the artifact/run provenance described below.

### Fail-closed ownership rule

If reasonable evidence cannot distinguish project-owned from shared/sibling state:

```text
retention_class = X_SHARED_OR_UNKNOWN
reclaim_status = HOLD
```

Do not “clean first and reconstruct ownership later.”

---

## 5. Phase D — give every meaningful run and terminal artifact a passport

“Passport / 身份证” means that another Agent can answer **what this is, where it came from, what exact bytes it is, what scientific role it had, where the canonical copy lives, and how to restore/use it** without relying on chat memory or directory names.

### 5.1 Reuse canonical Run Manifests

For OpenEvo bounded runs, use the current `RUN_MANIFEST_CONTRACT.md` instead of inventing a parallel run receipt. Validate existing manifests and repair missing fields/evidence where possible without rewriting historical outcomes.

The run-level passport should bind, when applicable:

```text
experiment Git SHA
exact command/config
upstream OpenEvo SHA
runtime image digest
model + tokenizer identity/revision
dataset/task manifest identity
seed/generation/campaign identity
GPU/resource identity where scientifically applicable
output artifacts + digests
tracking cross-links
status / wall time / gate evidence
```

A machine path is only a location hint; material output also needs a digest/identity.

### 5.2 Artifact-level passport

Each scientifically meaningful terminal or milestone artifact must either have an existing canonical manifest/index entry or receive one linked to the owning run.

Minimum artifact passport fields:

```text
artifact_id
kind
scientific_role
source_project
source_campaign_or_run
source_run_manifest
source_git_sha
source_command_or_config_identity
base_model_id_and_revision
upstream_openevo_sha
runtime_digest
task_or_dataset_identity
private_source_path
file_manifest (relative path + exact bytes)
digest_kind
sha256_or_tree_digest
created_or_observed_at
ownership_status + ownership_evidence
retention_class
analysis_hold / hot_recovery_role
canonical_remote
remote_revision_or_digest
restore_command_or_procedure
restore_test
secret_scan
license_visibility
publication_status
local_reclaim_status
```

Use `null`/`unknown` when genuinely unavailable; never invent provenance to make a passport look complete.

### 5.3 What counts as meaningful artifact

Do not passport only final weights. Check at least:

- checkpoint / LoRA / SD-LoRA / adapter;
- milestone trainable state needed for mechanism analysis;
- trajectories / episodes / selected records;
- analyzer / external-teacher outputs;
- evaluation/final-panel outputs;
- analysis reports, tables, figures, JSON/JSONL summaries;
- reconciliation / failure receipts / provenance receipts;
- configs, preregistration, exact commands, launch/restore scripts;
- Docker/runtime identity and build recipe;
- logs required to justify a scientific claim or failure diagnosis;
- W&B run IDs/spool identities where they are part of evidence.

Do not create redundant passports for byte-identical copies. One canonical artifact identity may point to multiple storage locations.

### 5.4 Coverage receipt

Produce a small summary:

```text
objects_discovered
scientifically_meaningful
passport_complete
passport_repaired
passport_missing_blocked
reused_existing_remote
newly_published
held_local
reclaim_candidates
owner_unresolved
```

This makes “all runs have IDs” auditable rather than anecdotal.

---

## 6. Phase E — route artifacts to the correct durable destination

Upload by object semantics, not convenience.

### 6.1 GitHub

Use for small/reviewable/versioned material:

- code;
- configs / preregistration / manifests;
- analysis scripts;
- small reports and curated evidence;
- checksums / artifact indexes / provenance receipts;
- restore instructions;
- Dockerfile/build recipe/lockfiles.

Do not put large model weights, full caches, secrets, or private raw server material into Git history.

### 6.2 Hugging Face model repositories

Use for redistributable model-derived payloads such as:

- checkpoint / adapter / LoRA / SD-LoRA state;
- required model configuration;
- model card and load/restore information.

Record the exact HF revision/commit and file hashes. Do not re-upload unchanged base-model weights simply because they were cached locally.

### 6.3 Hugging Face dataset/private staging

Use when appropriate for large research data/evidence:

- trajectories / episode corpora;
- analyzer/teacher outputs;
- large structured analysis artifacts.

If redistribution/privacy/license status is not fully resolved, use approved private staging or HOLD. Do not turn disk pressure into a public-release decision.

### 6.4 GHCR / OCI registry

Use for complete runtime images that should be `docker pull`-able. Record immutable digest, build recipe, and restore/pull test.

If an existing exact Docker tarball/archive is already the project's canonical artifact and independently verified, reuse it rather than manufacturing a duplicate remote merely for aesthetics.

### 6.5 W&B / telemetry

W&B is a run/telemetry cross-link, not by itself an independent server backup. Do not delete unique local science merely because a W&B run exists.

### 6.6 Upstream source instead of re-upload

For externally reproducible base models, datasets, packages, or caches, prefer recording the exact upstream repository/revision/content identity and verifying re-download when acceptable. Avoid creating pointless duplicate archives.

---

## 7. Phase F — deduplicate, scan, publish, then independently verify

### 7.1 Deduplicate before upload

Before uploading any material object, check whether the exact scientific object is already remote.

If the same content identity already exists and is usable:

```text
publication_status = REUSE_EXISTING
```

Do not create a second repo/tag/tarball merely because the Agent has a new session.

If a remote object has the same name but a different hash/digest:

```text
publication_status = HASH_CONFLICT
reclaim_status = HOLD
```

Resolve the lineage before overwrite or deletion.

### 7.2 Secret/privacy scan

Before public or external upload, scan candidate material for credentials, private keys, auth headers/tokens, cookies, internal addresses/paths where inappropriate, private inputs, and other sensitive content.

Do not print secret values into logs/manifests while scanning.

### 7.3 License / provenance gate

Confirm redistribution rights for model/data/runtime contents. A Docker image that bakes in non-redistributable weights must not be publicly published as a whole; publish the build recipe/runtime metadata and obtain weights through the permitted route instead.

### 7.4 Independent remote verification

“Upload command returned success” is not recovery proof.

Record and verify, as applicable:

```text
remote repository/object exists
immutable remote revision / commit / OCI digest
exact remote file list and sizes
local hash/tree digest
remote identity/hash equivalence
fresh read/download
minimum model/adapter reload
Docker pull/load + inspect
Git exact commit reachability
restore/read test
GitHub evidence cross-links back to the remote
```

Only after this gate may a scientific P2 object become eligible for a deletion proposal.

---

## 8. Phase G — classify retention separately from publication

Use the current project/server retention taxonomy:

```text
P0_ACTIVE
P1_ANALYSIS_HOLD
P2_ARCHIVE_THEN_RECLAIM
P3_REBUILDABLE
X_SHARED_OR_UNKNOWN
```

### Independent gates

Do not collapse these into one boolean:

- exact recoverability;
- current live/path dependency;
- hot recovery window;
- owner analysis hold;
- ownership proof;
- deletion authorization.

An uploaded checkpoint may still be P0/P1 because the next stage needs its run root, trajectories, optimizer/replay state, or exact local path.

A completed experiment is not automatically P2.

---

## 9. Phase H — produce the exact reclaim manifest; do not delete yet

Create a machine-readable manifest with a unique version, initially:

```text
status = NOT_AUTHORIZED
```

For every candidate include:

```text
candidate_id
exact path or complete image ID
ownership proof
object kind
size_bytes
retention_class
active refs
remote destination
remote revision/digest
local digest
fresh restore verification
expected reclaim bytes + uncertainty
reason it is safe to remove locally
delete_authorized = false
```

Also list **protected assets** explicitly: active runs, analysis holds, unresolved ownership, hot recovery points, unique/unverified evidence, shared objects.

### Human reports

Produce both:

1. **technical report** — exact evidence, paths/IDs, hashes, remote revisions, liveness, expected reclaim;
2. **plain report** — how much space is left, what is protected, what was archived, what is proposed for deletion, and the realistic reclaim range.

Then request approval for **that exact manifest version**.

If the owner does not approve it in the same session, stop destructive work but keep all passport/publication/verification work complete.

---

## 10. Phase I — after exact approval, re-check and reclaim precisely

Authorization becomes invalid for an object if its size/hash/ownership/liveness/references changed after the manifest was approved.

Immediately before each mutation re-check:

- exact target identity;
- ownership;
- active process/container/config/resume references;
- retention class / analysis hold;
- remote recovery proof;
- approved manifest membership.

### File / symlink fast path

Use the narrow cleanup capability defined by current server policy where applicable. A guard `DENY` is a HOLD requiring diagnosis, not a reason to bypass it with root.

### Directories

Directory deletion is never justified by the top-level owner alone. Prove descendant/mount/liveness/Git-worktree conditions first. Use `git worktree remove` for linked worktrees.

### Docker

Use exact project-owned image/container IDs only after current reference/ownership checks. Never broad-prune a shared daemon.

### Quarantine is not reclaim

A same-filesystem rename/quarantine is reversible but normally frees approximately zero blocks. Do not report quarantined bytes as reclaimed bytes.

### Scientific semantics

No cleanup action may change the experiment's task set, seeds, evaluator, model state, analysis results, scientific budget, frozen lineage, or claim semantics. If preserving space would require changing science, stop and treat it as a separate scientific amendment.

---

## 11. Phase J — verify post-reclaim state

Record:

```text
df before
df after
logical bytes removed by exact targets
observed physical available-space delta
objects deleted
objects held
restore identities for every deleted scientific/rebuildable object
```

Keep logical deletion bytes and `df` delta separate. Other users and live experiments may write concurrently.

Update each artifact passport/ledger entry with local state such as:

```text
LOCAL_HOT_REQUIRED
LOCAL_ANALYSIS_HOLD
LOCAL_THIN_ELIGIBLE
LOCAL_RECLAIMED
```

Never claim that remote recovery works after deletion unless the fresh restore test was completed before the local copy was removed.

---

## 12. Phase K — refresh the BaseModel server page honestly

After the governance/reclaim pass, update:

`/research/seed-openevo/flow/server/`

### Current global snapshot

Refresh safely measurable current facts:

- filesystem total / used / available / Use%;
- inode usage;
- CPU/RAM inventory when needed;
- GPU hardware inventory/driver when needed.

### Anonymous account attribution

Regenerate anonymous account rankings only when the completeness gate can be satisfied **without crossing sibling-user privacy/authority boundaries**.

If it cannot:

- do not use partial homes to create a fake new ranking;
- keep the most recent complete anonymous attribution visibly dated as historical;
- publish the current global capacity snapshot separately;
- explain that cross-user attribution was intentionally not refreshed rather than using Docker/admin bypasses.

### Public privacy

Never publish or persist real usernames, home paths, SSH aliases, IPs, container names/IDs, GPU UUIDs, or anonymous-label mappings.

### Website acceptance

Update Chinese and English copy/tests, then run the repository-required deterministic checks, build, overflow/static checks, and browser/UI verification. Open a PR, validate the exact-head Preview, merge only when ready, and verify the final Vercel page.

---

## 13. Final closeout contract

The task is complete only when the final response provides the verified status of all of these layers:

### A. Inventory / ownership

```text
snapshot timestamp
filesystem before/after
objects inventoried
proven project-owned
shared/external
owner unresolved
active/protected
```

### B. Passport coverage

```text
meaningful runs/artifacts discovered
passport complete
passport repaired
passport blocked/missing
coverage gaps and why
```

### C. Publication

For every new/reused remote artifact:

```text
artifact_id
destination (GitHub / HF model / HF dataset / GHCR / upstream pointer / local hold)
immutable revision/digest
verification result
restore/reload result
```

### D. Reclaim

```text
manifest id/version
approval status
exact objects deleted
logical bytes deleted
observed physical df delta
objects held and reason
```

### E. Website

```text
snapshot time shown publicly
which numbers were freshly measured
which anonymous-attribution snapshot remains historical
BaseModel PR
merge commit
exact-head Preview result
final Vercel page acceptance
```

---

## 14. Acceptance criteria — fail closed

Mark the whole workflow `PASS` only if:

- every object touched has explicit ownership status;
- no object is assigned to the owner from name/label resemblance alone;
- every scientifically meaningful run/artifact is passported, linked to an existing canonical passport, or explicitly recorded as an unresolved gap;
- large uploads were deduplicated first;
- every scientific artifact proposed for local deletion has exact remote identity and fresh recovery verification;
- P0, P1, X/unknown, hot-recovery, and active-reference objects were not deleted;
- every irreversible deletion belonged to the exact approved manifest and passed an immediate live re-check;
- no sibling-user files, containers, images, or shared daemon state were mutated;
- no broad Docker prune was used;
- quarantine bytes were not misreported as reclaimed bytes;
- secret/privacy/license gates passed for every publication;
- no scientific semantics were changed for engineering convenience;
- final `df` and reclaim accounting were recorded separately;
- the public website is current where safely measurable and explicitly dated where attribution remains historical;
- website and repository exact-head acceptance passed.

If any criterion is unresolved, report `PARTIAL / HOLD` with the exact blocker instead of calling the workflow complete.

---

## 15. One-line mental model

> **First prove whose bytes they are; then prove what scientific object they are; then make the object independently recoverable; only then ask to remove the local copy.**
