# PR #429 7B final closeout and experience-retention retrospective — 2026-09-05

Status: **historical case / reusable Agent guidance, not current release or experiment authority**

Scope: the BaseModel PR #429 closeout conversation. The task began from a report that PR #429 was open and mergeable, its exact head had successful self-hosted CI, and its Vercel Preview was READY. The requested decision was whether the frozen Qwen2.5-7B publication was genuinely releasable and, if so, to finish the release. This case records the evidence path, the one real freshness question, the release result, and reusable lessons. It does not own today's main, Vercel state, scientific progress, GPU state, or any future PR.

Current owners:

- ../current/release-closeout-protocol.md — exact-head, moving-main, gate, merge-lock, and Production acceptance;
- ../current/project-agent-operating-principles.md — tool boundaries, shared-state writes, and experience deposition;
- ../current/scenario-trigger-registry.md — recognizable triggers and just-in-time loading;
- ../README.md and ../current/seed-openevo-results-reader-contract.md — documentation/research publication routing;
- mykcs/openevo-experiment — scientific authority and immutable experiment receipts; BaseModel is a derived public-safe projection.

If this case conflicts with current user instruction, live provider state, executable repository truth, or a newer current policy, the newer authority wins.

---

## 1. Closeout outcome

The release was accepted and completed:

- PR #429 was squash-merged with an expected-head guard.
- Accepted PR head: e6cef51b4021d1809fcb97394194b4efb6e62def.
- Merge commit on main: 93606d962466f87805fa6e98fe6deb05e38891ee.
- Vercel Production for that merge commit reached READY.
- Chinese and English Production routes returned HTTP 200 and exposed final 7B metadata.
- The scientific claim stayed bounded: 149 completed rounds (0–148), 19,072 accepted rollouts, Task Score 49.33, 58/128 exact success (45.31%), seven fail-closed action-admissibility failures, and zero runtime errors.
- SEED 89.7 / 78.1% remained explicitly paper-reported reference evidence, not a paired local reproduction or causal treatment comparison.
- K64/K80/K96 remained post-run diagnostics, not part of the formal final checkpoint.

These numbers are historical evidence for this closeout, not a current live status. Re-check experiment authority and the public route before repeating them elsewhere.

---

## 2. Evidence ledger

| Layer | Evidence | What it proves | What it does not prove |
| --- | --- | --- | --- |
| PR metadata | PR state, base/head, exact head, changed files, mergeability | Which object was considered | Scientific truth by itself |
| Publication source/data/tests | PR body and changed files | Intended claim wording and structural safeguards | Remote archive bytes |
| Pre-merge CI | Self-hosted run checked a tested merge candidate; deterministic verification, build, and browser steps succeeded | The tree that run actually checked passed its listed gates | That a later main base is identical |
| Preview | Vercel deployment bound to exact PR head, READY, clean build-error scan | Provider built that exact branch tree | Production acceptance |
| Moving-main differential | Main was seven commits ahead, but intervening files were disjoint from PR #429’s seven files | No overlap requiring a pre-merge rerun was found | Independence without inspecting contracts |
| Merge lock | Expected-head squash merge | No unseen push was included | Combined tree health before Production |
| Production | Deployment bound to merge commit, READY; zh/en routes returned 200 with final metadata | Combined tree was deployed and reachable | Browser interaction coverage beyond route fetch |

The old CI evidence was kept at its original scope. It was not treated as an eternal certificate; the moving-main differential and post-merge Production deployment closed the combined-tree boundary.

---

## 3. The real freshness question

The only substantive release question was whether a green exact-head branch remained acceptable after main moved.

Correct procedure:

1. compare PR head with current main;
2. enumerate intervening changed files;
3. inspect shared CI/provider/data/UI ownership, not just textual conflicts;
4. preserve exact-head evidence at its original scope;
5. use merge-commit Production acceptance as final combined-tree proof.

The seven intervening commits changed CI/runner governance, documentation, server-page content, and related tests. They did not touch PR #429’s seven research publication files. The base movement was therefore independent for this release. If any intervening change had touched research data, shared rendering, deployment policy, or acceptance gates, a targeted refresh on the combined tree would have been required.

---

## 4. Failure modes and defensive rules

### 4.1 PR descriptions are hypotheses

Observed: the user supplied a current-looking PR summary, but live metadata still had to confirm state, head, base, mergeability, reviews, and changed files.

Why: PR numbers, branch names, and chat summaries remain plausible after merges, force-pushes, and new commits.

Before acting: fetch live PR metadata and exact files.

Rule: never act on a PR number or remembered status until live metadata and the exact tree agree.

Anti-example: merge because a message says “open and mergeable” without checking whether the head moved.

### 4.2 Mergeable is not semantic compatibility

Observed: GitHub reported mergeable even though main had moved seven commits.

Why: Git mergeability answers whether Git can construct a merge, not whether the combined product or research meaning is correct.

Before acting: classify overlap by file, shared primitive, provider contract, data contract, and scientific ownership.

Rule: treat mergeable as a mechanical precondition only.

Anti-example: use whole-file ours/theirs or mergeability as permission to resurrect stale research copy.

### 4.3 Exact-head CI is scoped evidence

Observed: CI checked a tested merge candidate, not every future main.

Why: CI evidence belongs to a concrete tree and runner/config state.

Before acting: record run ID, head SHA, tested base/merge candidate, executed steps, and retry/flaky state.

Rule: preserve a green run at its exact scope; refresh affected checks after material base movement.

Anti-example: call CI green a permanent certificate after workflow, base, or shared code changes.

### 4.4 READY Preview is not Production acceptance

Observed: branch Preview was READY, but release completion required the Production deployment and public routes.

Why: Preview and Production are separate deployments and aliases.

Before acting: verify Preview commit binding; after merge, find Production deployment bound to the merge SHA and inspect representative routes/metadata.

Rule: report source sync, CI, Preview, merge, Production, and route verification separately.

Anti-example: stop at a green Vercel status callback or Preview badge.

### 4.5 Protected Preview access is an access boundary

Observed: direct Preview fetch first returned a 302 to Vercel SSO; public Production fetch returned 200.

Why: protection/authentication can block an automated fetch without an application failure.

Before acting: inspect status, redirect target, deployment state, and Preview versus Production.

Rule: classify SSO/403/redirect as an access/provider boundary. Do not weaken protection or persist temporary share tokens.

Anti-example: call a protected Preview broken, or commit a _vercel_share URL.

### 4.6 Hexadecimal identities are not interchangeable

Observed: scientific archive revision, website source/merge SHA, and Vercel deployment ID all existed.

Why: different systems use opaque hashes for different objects.

Before acting: label each identity by system and object.

Rule: keep separate identity ledgers. Website exactness does not prove archive restore exactness.

Anti-example: substitute a website merge SHA for an immutable scientific archive revision.

### 4.7 Numbers beside each other can imply a false causal claim

Observed: the page showed 49.33 and SEED 89.7, so the release needed an explicit paper-reference boundary.

Why: readers naturally interpret adjacent numbers as a matched comparison.

Before acting: check checkpoint, denominator, protocol, and whether the comparison is local paired evidence or paper reference.

Rule: preserve observation, interpretation, and cannot-prove boundaries; lower claim strength when comparability is unproven.

Anti-example: publish the gap as a method effect without a matched local rerun.

### 4.8 A zero-exit command may have skipped the gate

Observed: acceptance depended on knowing that deterministic, build, and browser gates actually ran.

Why: conditional scripts can exit zero after skipped or ignored outcomes.

Before acting: require start marker, condition match, expected tests/count, assertions, and explicit PASS.

Rule: SKIPPED is not PASS.

Anti-example: count a successful shell command as browser acceptance without reading execution markers.

---

## 5. Cross-project lessons kept separate

The wider SEED × OpenEvo effort has durable rules that were not newly exercised by this release; existing owners remain authoritative:

- resolve scientific truth from the object-owning lineage and immutable receipts, not a website snapshot or router;
- keep frozen design, execution receipt, archive identity, provider metadata, and public projection distinct;
- do not turn historical 3B/7B observations into intrinsic-ability claims without matched action-validity and harness analysis;
- never hot-swap a trajectory-changing harness into a formal lineage; use a successor or amendment;
- do not restart, preempt, or duplicate GPU work to make a status page look active;
- on shared servers, prove ownership and future dependency before upload/move/delete; names are clues, not authority;
- use explicit Bash when syntax requires it; a Fish parser error is an execution-surface failure;
- keep root-only SSH routing fail-closed and verify UID before remote mutation;
- upload, exact-verify, and assign identity before reclaiming scientific payloads;
- BaseModel is a derived projection and must not override experiment authority.

This case does not add current GPU, PID, server-occupancy, run-progress, or worker-count facts.

---

## 6. Stable, project-level, and temporary classification

### A. Long-term stable rules

1. Read live refs and executable truth before acting.
2. Separate current head, bounded audit baseline, object-owning lineage, provider state, and public projection.
3. Treat mergeability, CI success, Preview READY, merge, and Production READY as separate proof layers.
4. Lock merges to an expected head whenever supported.
5. Keep scientific archive identity, source/merge identity, and provider deployment identity separate.
6. Prove conditional gates actually executed; skipped is not passed.
7. Use the narrowest capable tool surface; repository/provider writes are shared state, not probes.
8. Deposit durable rules in current owners, triggers in the registry, causal detail in indexed history, and volatile continuation only in a dated handoff when necessary.
9. Never claim long-term memory was written unless a memory-write operation returned success.
10. Preserve historical truth without silently promoting old state or erasing superseded evidence.

### B. Project-level lessons

- BaseModel is a public-safe projection; mykcs/openevo-experiment owns scientific state.
- Research pages must keep score, exact success, action validity, rollout count, update count, panel identity, and comparison domain distinct.
- For moving main, an independent-base differential plus merged Production acceptance can close the tree; overlapping/provider-policy changes require targeted refresh.
- Protected Preview authentication is not a product failure.
- The current release protocol, research-copy contracts, and scenario registry are the durable owners.

### C. Temporary state deliberately not promoted

Do not copy these as current facts:

- PR #429’s open/closed state, branch, old base, and exact head;
- merge commit 93606d9… and Vercel deployment dpl_Aej2…;
- deployment timestamps, provider request IDs, and one-time redirects;
- the seven-commit movement observed during this task;
- any PID, GPU occupancy, server progress, worker count, or temporary worktree;
- connector response shapes and empty local-workspace state.

Future Agents must re-read live state.

---

## 7. Why earlier retrospectives did not fully prevent recurrence

Earlier current policies and histories already covered moving refs, exact-head acceptance, memory-capability honesty, Fish/Bash boundaries, server ownership, GPU safety, and scientific claim discipline. Recurrence still happened because:

1. a PR summary could bypass registry scanning;
2. proof layers were compressed into “CI green”;
3. history held detail while first-screen current owners had less trigger wording;
4. different system identities looked alike;
5. repository commits and ChatGPT memory are different persistence channels.

This closeout addresses the risk by placing the three-ledger and moving-main rule in the current release owner, indexing this case from the Agent task router, and requiring an explicit exclusion list. Older cases remain historical and were not rewritten.

---

## 8. Future-agent procedure

When asked “is this release ready?” or “did the previous closeout solve it?”:

1. read AGENTS.md, LATEST.md, the Agent README, current principles, registry, and task owner;
2. fetch live PR/repository/provider state;
3. record head, intended base, current main, changed files, checks, reviews, and provider metadata;
4. compare intervening files and shared contracts;
5. keep scientific authority and website source as separate ledgers;
6. verify required gates executed;
7. race-check and merge with expected-head protection;
8. verify merge SHA, Production deployment identity/state, and representative zh/en route/metadata;
9. report blocking, non-blocking, skipped-by-policy, and out-of-scope items separately;
10. for experience retention, update current owner for stable rules, add indexed history for causal detail, and state what was not persisted.

---

## 9. Closeout truth table

| Assertion | Minimum proof |
| --- | --- |
| PR is current | live PR metadata and exact head |
| Candidate fits current main | changed-file/shared-contract differential |
| CI is accepted | exact run, exact tree, required steps actually executed |
| Preview is accepted | deployment bound to candidate head + READY + route inspection |
| Merge is safe | race-check + expected-head merge |
| Production is released | deployment bound to merge SHA + READY |
| Public route is live | representative HTTP/metadata checks |
| Scientific claim is honest | frozen receipt/protocol + claim-domain caveat |
| Lesson is durable | current owner + trigger/index + history case |
| ChatGPT memory changed | actual memory-write result; none was available here |

The purpose is not to make future Agents memorize PR #429. It is to make them perform the same evidence separation automatically.
