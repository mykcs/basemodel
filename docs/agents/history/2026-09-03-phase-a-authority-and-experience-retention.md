# Phase A authority freeze and experience-retention retrospective — 2026-09-03

Status: **historical case / reusable Agent guidance, not current scientific authority**

Scope: this conversation's work on the SEED × OpenEvo research information-
architecture masterplan in mykcs/basemodel: current GitHub authority inspection,
Phase A evidence, masterplan checkbox validation, revalidation, PR/CI/merge
closeout, and the follow-up request to deposit the experience.

Current owners:

- ../current/project-agent-operating-principles.md — cross-task operating and
  deposition rules;
- ../current/scenario-trigger-registry.md — observable triggers and automatic
  response;
- ../README.md — documentation lifecycle and archive boundary;
- ../current/seed-openevo-research-information-architecture-masterplan.md —
  project-specific A–N acceptance authority;
- ../current/seed-openevo-research-ia-authority-snapshot-2026-09-03.md —
  original bounded Phase A snapshot;
- ../current/seed-openevo-research-ia-authority-revalidation-2026-09-03.md —
  current-GitHub revalidation evidence.

If this case conflicts with current executable truth, live provider state,
scientific authority, or a newer current policy, the newer authority wins. This
file explains the failure modes and the reason for the rules; it does not own
today's branch, experiment, deployment, or resource state.

---

## 1. Outcome in one paragraph

Phase A was already marked complete on the current main when this task began, but
the existing evidence was a bounded snapshot rather than a claim about the latest
main forever. The audit verified that the original website baseline was
basemodel main at 3151686..., the OpenEvo governance baseline was main at
8692bf6..., and the active scientific/control-plane evidence lived on Draft PRs
#270 and #268. Later basemodel commits moved main through the Phase A, B, and C
documentation closeouts. The correct response was to preserve the original
baseline, re-check current refs, add a revalidation note, link it from the
masterplan, leave only already-satisfied A01–A07 checked, and merge the
documentation through a new exact-head PR. No experiment, provider job, GPU
allocation, website runtime, or deployment was changed.

---

## 2. What happened, and what it teaches

### 2.1 A user's wording is not live GitHub state

The task referred to PR #417 as containing the masterplan. GitHub inspection showed
that PR #417 was already merged and closed, and that main had advanced. The
masterplan itself already had A01–A07 checked, and later main also contained
Phase B and Phase C closeouts.

Why this can go wrong: a PR number, branch name, or conversational description
can remain true historically after the live object has changed state.

Before acting, check:

1. repository and default branch;
2. PR state, base, head, exact head SHA, merge SHA, and updated time;
3. current main head;
4. the exact file at the relevant ref;
5. open PRs touching the same surface.

Defensive rule: treat summaries and filenames as search hints. Treat live GitHub
metadata and the exact file at a named ref as authority.

Anti-example: assume "PR #417 now contains..." means it is open, unmerged, or
still the latest tree, then create work on its stale branch.

### 2.2 A checked box is a claim that still needs acceptance evidence

The current masterplan had A01–A07 checked before this revalidation. That did not
make a second audit unnecessary: the task required checking the acceptance
criteria against current authority.

Why this can go wrong: checkbox state is a derived project status, while the
evidence note may be stale, incomplete, or bound to a historical baseline.

Before accepting a checkbox, read the acceptance text and prove:

- the exact source ref is named;
- the required parent documents were actually read;
- the implementation boundary is described;
- the precedence/conflict rule is explicit;
- the evidence is linked from the masterplan.

Defensive rule: verify the evidence chain, not the visual checkbox. If it is
satisfied, preserve the check and add only the missing current evidence. If it
is not satisfied, leave it unchecked.

Anti-example: mark all A items complete because an older Agent checked them, or
uncheck them merely because main later moved.

### 2.3 A moving main does not invalidate a bounded historical audit

The original authority snapshot intentionally pinned basemodel at
3151686... so Phase B/C could compare a stable website tree. Current main later
advanced to ec12bb5... and then to the revalidation merge.

Why this can go wrong: "current main" and "audit baseline" are different
questions. Replacing the baseline after the fact silently changes the population
that an inventory or factual-debt register describes.

Before mixing evidence, record:

- the bounded audit baseline;
- the live current head;
- which documents were computed against which one;
- whether later movement is drift or requires a successor snapshot.

Defensive rule: never silently rewrite an old audit to current main. Preserve its
identity and record a post-snapshot revalidation or a new snapshot.

Anti-example: change a Phase B route count's baseline from 3151686... to the
latest main and continue calling it the same audit.

### 2.4 Recency alone does not resolve scientific conflicts

The authority note found that OpenEvo current-campaign.json values did not by
themselves identify the global current scientific lineage. PR #270 explicitly
owned the shared Stage 1 lineage, while its inherited router still pointed at
older campaign state.

Why this can go wrong: the newest-looking file is often a router or projection,
not the owner of the scientific object.

Before writing current research copy, resolve:

1. owner instruction;
2. frozen preregistration/design plus exact execution receipts/reconciliation;
3. the exact lineage that owns the object;
4. merged governance;
5. validated generated projections;
6. provider metadata;
7. website copy/components/tests.

Defensive rule: object ownership and immutable evidence outrank recency and
presentation. A router conflict becomes explicit factual debt; it is not hidden
by choosing the newest filename.

Anti-example: publish current-campaign.json's phase as the current experiment
without checking the active PR, frozen design, or receipts.

### 2.5 Reading a standard means reading its named parents

The cross-platform asset standard named the experiment standard, artifact
publication standard, OpenEvo AGENTS rules, and the parent zju-server policy.
The original Phase A note summarized the first two and OpenEvo AGENTS; the
revalidation also read and recorded the parent server policy and artifact
lifecycle policy.

Why this can go wrong: a document can look self-contained while delegating
authority to a parent repository or a higher-level policy.

Before marking a governance-reading checkbox complete:

1. follow every normative-parent link;
2. distinguish a parent standard from a historical case;
3. record exact ref/blob identities for material parent documents;
4. record what rule was carried forward and what remains subordinate.

Defensive rule: dependency links in governance docs are part of the reading
contract. Do not claim a standard was reconciled until its current authority
parents have been resolved.

Anti-example: read only the cross-platform standard, then infer that website
publication or server cleanup rules are covered.

### 2.6 Hard-coded scientific-looking UI is not generated provenance

The Experiment Designs component was inspected and found to embed family IDs,
ordering, questions, summaries, status strings, member sets, source SHAs/paths,
and evidence URL roots. Locale selection, markup, and URL construction are
derived from those constants, but the scientific data is not generated from a
validated public-safe projection.

Why this can go wrong: computed links and a polished catalog can create the
appearance of live provenance while the underlying facts remain manually copied.

Before treating a research component as projection-driven, check:

- where its scientific data enters;
- whether source SHA and checked-at are carried as data;
- whether design/run/asset/provider references are validated;
- whether refresh is automatic or manual;
- whether tests prove freshness or only protect component structure.

Defensive rule: distinguish presentation derivation from scientific-data
generation. A hard-coded catalog must be described honestly and eventually
migrated behind a validated public-safe projection.

Anti-example: call a component "generated" because it maps an embedded array into
Astro markup.

### 2.7 Documentation writes are shared-state changes

The local working directory was not a Git checkout, so the GitHub connector was
the correct repository authority and write path. The change was made from the
current main head on a dedicated docs branch, then reviewed through PR #422.

Why this can go wrong: using a nonexistent or stale local checkout encourages
blind file assumptions; using main as a scratchpad makes evidence changes harder
to review and can trigger deployment/review work unexpectedly.

Before writing:

- confirm whether a local checkout exists and is authoritative;
- if GitHub state is enough, stay on GitHub;
- refresh main and inspect overlapping PRs;
- create one coherent branch from the exact current base;
- prepare all files before the first provider-triggering write;
- use a docs-only branch when hosted UI acceptance is not required.

Defensive rule: repository/provider writes are not probes. Use an isolated branch,
one coherent PR, and exact-path verification after every write.

Anti-example: edit main directly just to discover a file's current SHA, or create
a tokenized Preview commit for documentation that changes no website behavior.

### 2.8 Exact-head CI and merge are separate proof layers

PR #422 was based on ec12bb5..., its exact head was recorded, self-hosted CI
run #189 completed successfully, and the merge used an expected-head guard,
producing merge SHA 9fc83c.... Main was then read back to confirm the evidence
links and A01–A07 state.

Why this can go wrong: a branch can be green at one head and merge a different
head, or a successful CI run can be mistaken for proof that the intended file
landed on main.

Before merge:

- record current head and base;
- wait for the exact-head required run;
- confirm no head drift;
- merge with expected-head protection;
- re-read the merged main file and confirm the intended evidence.

Defensive rule: "CI passed", "PR merged", and "main contains the intended content"
are three separate assertions.

Anti-example: merge after a green run without checking the head, or report success
from the branch without reading the resulting main file.

### 2.9 Tool capability boundaries must remain honest

The available personal-context capability supported searching user context but
did not expose a memory-write operation. Repository commits can preserve project
knowledge, but they are not proof that ChatGPT long-term memory was updated.

Why this can go wrong: an Agent can conflate retrieved context, a repository
document, and an actual memory write.

Before claiming memory persistence:

- inspect available memory/context capabilities;
- separate retrieval from mutation;
- write stable project rules to the repository's current owner;
- say explicitly when no memory-write endpoint exists.

Defensive rule: never claim "记住了" merely because the Agent saw a memory
summary or committed a document. Keep the memory and repository boundaries
explicit.

Anti-example: report that user preferences were saved to long-term memory when
the only completed action was a GitHub commit.

---

## 3. Stable rules, project lessons, and temporary state

### A. Long-term stable rules

These are suitable for future tasks because they cross repository/session
boundaries:

1. Read current authority before writing; user summaries, old handoffs, branch
   names, and filenames are not live state.
2. Separate current main, bounded audit baseline, active object-owning lineage,
   and provider state.
3. Record a precedence order whenever sources can disagree.
4. Treat repository/provider writes as shared state; use isolated branches and
   exact-head verification.
5. Keep scientific identity, execution evidence, provider metadata, and public
   presentation as distinct layers.
6. Do not promote volatile progress, PID, GPU occupancy, provider counters, or
   temporary paths into durable rules or memory.
7. Deposit reusable experience where future Agents discover it: current owner
   for stable invariants, trigger registry for recognizable situations, history
   for causal cases, handoff only for short-lived continuation.
8. If a memory-write capability is unavailable, do not claim the memory was
   updated; preserve project knowledge in the repository and disclose the limit.

These rules are general operating principles. They do not assert that any
particular PR, SHA, server, or provider is current.

### B. Project-level lessons

These apply to the SEED × OpenEvo website/experiment project:

- The website is a public-safe projection and reader-facing explanation layer,
  not a second experiment-state database.
- The OpenEvo authority graph is design -> run -> asset -> provider revision;
  website aliases and provider display names do not replace canonical identity.
- The Phase A masterplan's A01–A07 acceptance requires one linked authority note
  with exact refs, parent standards, implementation hard-code boundary, and
  precedence.
- OpenEvo current-campaign.json may be a stale router; current scientific
  status must be resolved per object-owning lineage and receipts.
- The Experiment Designs catalog is currently hard-coded presentation data until
  a validated public-safe projection replaces that source.
- Historical baselines remain valid historical evidence when clearly labeled;
  they must not be silently promoted to current or silently erased.

These belong with the masterplan and OpenEvo project authority, not in a
global server rule.

### C. Temporary state deliberately not promoted

The following were needed to close this task but must not become current facts:

- PR #417, PR #422, their branch names, and their temporary states;
- basemodel commits 3151686..., ec12bb5..., and 9fc83c... as current-main
  claims;
- OpenEvo PR #270/#268 states and their heads;
- self-hosted CI run #189;
- the exact 2026-09-03 audit timestamp;
- temporary connector output shapes, local working-directory state, and branch
  paths.

They remain historical evidence in the linked snapshot/revalidation and this
case. Future Agents must re-check them rather than copy them as current state.

---

## 4. Scientific and operational boundaries

This conversation did not authorize or require:

- starting, stopping, resuming, or changing Stage 1/Stage 2 experiments;
- changing seeds, prompts, parser semantics, model revisions, or budgets;
- allocating, reclaiming, resetting, or attributing GPUs;
- modifying another user's container or server resources;
- publishing private server paths, credentials, or unpublished artifacts;
- changing website runtime behavior or deploying a Preview/Production build.

Those boundaries are important because documentation drift is a publication/integrity
problem, not a reason to rerun an experiment or change scientific treatment.

For future cross-repository work, keep these separate:

- ChatGPT connector/OAuth authority;
- local MacBook CLI/token/SSH authority;
- remote server account/container/GPU authority;
- GitHub repository authority;
- W&B/Hugging Face/Kaggle provider state.

A successful check in one layer does not grant capability in another layer.

---

## 5. Repeat-offense analysis

### Repeated issue 1: stale knowledge versus current authority

This was already covered by the repository's moving-main, current-state,
claim-local provenance, and exact-head policies. It still reappeared because:

- the older authority snapshot was correct but its word "current" could be read
  without its baseline qualifier;
- the masterplan and later B/C closeouts made several historical and current
  layers visible together;
- the task began from a PR description rather than a live PR read;
- the rule existed in several documents but had no dedicated retrospective trigger
  for a full end-to-end knowledge audit.

Change made here: the current operating principles now explicitly require
baseline/live-head separation and successor snapshots; the scenario registry
recognizes retrospective/handoff requests; the detailed case is indexed.

### Repeated issue 2: provenance and presentation were easy to conflate

Existing research-integrity and experiment-publication policies already said that
the website is derived and provider metadata is not scientific authority. The
catalog inspection still required spelling out that computed URLs and polished
markup do not make data generated.

Why it recurs: presentation code is closer to the reader and easier to inspect
than upstream manifests, receipts, and projection validators.

Change made here: the case adds a reusable "presentation derivation is not
scientific-data generation" check and keeps it attached to the Phase A project
evidence rather than hiding it in a generic UI retrospective.

### Repeated issue 3: "documented" was mistaken for "discoverable and triggerable"

The repository already contained many excellent retrospectives, but a future Agent
could miss them if it did not scan the index and scenario registry. A deep history
file alone does not change behavior.

Why it recurs: lessons were deposited after incidents but not always promoted to
the first current owner or a recognizable trigger.

Change made here: current principles, trigger registry, and Agent README were
updated together. The history case is not the only copy of the rules.

### What was not repeated here

Fish-versus-Bash execution, server UID/ownership, shared-Docker cleanup, GPU
Holder handoff, MiniMax/API authorization, and browser/mobile UI failures are
important project history, but they were not exercised by this Phase A
documentation task. Their existing current owners and historical cases were
left in place; no temporary state from them was promoted here.

---

## 6. Future-agent procedure

### Authority audit

1. Read root AGENTS.md, LATEST.md, docs/agents/README.md, current principles,
   scenario registry, and the task owner.
2. Inspect current repository/main and all overlapping PRs.
3. Resolve the exact object, bounded baseline, active lineage, and provider
   sources.
4. Follow normative-parent links and record commit/blob identities.
5. Write precedence and conflict handling before deciding what is current.
6. Evaluate every checkbox from its acceptance criterion.
7. Preserve satisfied checks; leave unproven checks unchecked.
8. Record a dated snapshot and an explicit no-silent-mixing rule.

### Repository change

9. Decide whether the change is docs-only or requires UI/Preview/Production
   acceptance before choosing the branch prefix.
10. Create an isolated branch from the exact current base.
11. Prepare all coherent files, make one reviewable PR, and avoid probe writes.
12. Run the applicable repository checks on the exact candidate head.
13. Confirm required checks and head stability.
14. Merge with expected-head protection when authorized.
15. Read the merged main files and report the resulting merge SHA separately from
   the pre-merge head.

### Experience retention

16. Search for an existing current owner and historical case before creating a
   file.
17. Classify every item as stable, project-level, or temporary.
18. Put stable rules in the current owner, triggers in the registry, and causal
   detail in indexed history.
19. Check the actual memory capability; distinguish search from write.
20. In closeout, list what was persisted and what was deliberately excluded.

---

## 7. Closeout truth table

| Assertion | Required proof |
| --- | --- |
| A checkbox is satisfied | acceptance criterion + linked evidence |
| Current main is known | live ref/commit read |
| Audit is reproducible | pinned baseline + source refs + timestamp |
| Scientific state is current | object owner + frozen evidence/receipt, not a router alone |
| A docs change is accepted | exact head + applicable CI + merged-main readback |
| A lesson is durable | current owner/index/trigger or indexed history |
| ChatGPT memory changed | actual memory-write capability result; repository commit is not enough |

The purpose of this case is not to make future Agents memorize its SHAs. It is
to make them ask the right authority questions before they write.
