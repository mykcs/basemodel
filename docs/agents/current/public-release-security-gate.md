# Public Release Security Gate

Last reviewed: **2026-08-20**

Status: **PASS for the audited repository state recorded below. The repository remains private; this document does not change visibility. Any ref change that is not covered by the accepted closeout scan returns the release decision to HOLD until the delta is scanned.**

## Gate A — tracked tree

PASS requires:

- no plaintext bearer/API tokens, passwords, private keys, cookies or session material;
- no tracked `.env`, `.dev.vars`, provider-state directories or Agent scratch state;
- no persisted temporary Preview share/access parameters;
- no unnecessary provider account/team/project opaque identifiers;
- no personal device inventory, private network topology, IP/hostname/username, VPN endpoint or physical-lab detail.

The repository `.gitignore` must cover common local credential and provider-state paths.

**Result: PASS.** PR #145 removed or generalized the identified tracked security/privacy material and added regression coverage. The all-object scan in Gate C found zero secrets in reachable historical text, including the current tracked tree.

## Gate B — GitHub collaboration surfaces

PR/Issue bodies and comments become public with the repository. Before release:

- remove temporary share/access URLs and query parameters;
- do not paste live credentials into a replacement note;
- keep only non-sensitive deployment IDs/status summaries when they are useful evidence.

Temporary Vercel share URLs are ephemeral delivery artifacts. They may be sent through an ephemeral review surface, but must not be persisted in GitHub or repository text.

**Result: PASS.** PR #145 paginated and sanitized the then-existing collaboration surfaces. The 2026-08-20 closeout additionally reviewed 47 records introduced after that baseline (PR bodies/comments for #146–#169 plus Issue #152), found zero temporary Vercel share/access parameters or private-network patterns, and produced zero Gitleaks findings. The closeout PR itself must receive the same pre-merge check.

## Gate C — all refs and full Git history

Run a maintained secret scanner against all advertised refs and complete reachable history, not only the current `main` tree.

The preferred route is an authenticated mirror/full clone. An authenticated Git-object traversal is equivalent only when it:

1. enumerates every paginated advertised ref;
2. follows every commit parent to closure;
3. recursively enumerates every distinct root tree and fails on truncation;
4. fetches every reachable UTF-8 blob, verifies its Git blob SHA, and accounts separately for binary blobs;
5. scans every full text blob and commit metadata with a pinned maintained scanner, without a baseline or pre-existing suppression;
6. refetches all refs and fails closed on drift.

PASS requires **zero unresolved real secrets** across reachable branches, PR refs, tags and history. False positives may be documented, but ambiguous findings are HOLD.

If a live credential is found:

1. revoke/rotate it first;
2. remove it from the current tree;
3. purge/rewrite Git history when appropriate;
4. rescan all refs;
5. only then reconsider public visibility.

History rewriting does not make an exposed credential safe without rotation.

### 2026-08-20 audit evidence

The connected GitHub authorization could enumerate private Git objects but could not provide an authenticated clone. The closeout therefore used the equivalent fail-closed Git-object route above.

Baseline stable snapshot before the closeout commit:

- advertised refs: **340** (heads and PR refs; no tag refs);
- reachable commits: **1,199**;
- distinct root trees: **1,061**;
- unique reachable blobs: **2,892**;
- UTF-8 text blobs scanned: **2,890**;
- binary blobs accounted for: **2**;
- ref-list SHA-256: `e1fea016bcd2c2b818df487655d42f4e0ca8e7761a129b83295de377e6d681f0`;
- Gitleaks: **8.30.1**;
- official Linux x64 asset SHA-256: `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`;
- reachable text-blob findings: **0**;
- commit-metadata findings: **0**;
- post-#145 collaboration-surface findings: **0**;
- unresolved real secrets: **0**.

The redacted reports remained local and were not committed or uploaded. The exact closeout head and its collaboration surface must be incrementally scanned before merge, the merge must be locked to that accepted head, and the post-merge ref delta must be checked. Record that final snapshot binding in the closeout PR conversation rather than creating an infinite “edit evidence, then rescan the evidence edit” loop.

**Result: PASS, subject to the exact-head and post-merge binding above.**

## Gate D — public-intent review

Confirm that remaining material is intentionally public, including:

- research logs and historical decision records;
- deployment architecture and public hostnames;
- experiment hardware facts needed for reproducibility;
- PR/Issue discussions that reveal workflow or research direction.

Non-secret does not automatically mean intended for publication.

**Result: PASS.** After the remaining public-intent scope and HOLD state were stated explicitly, the repository owner directed completion of every unfinished item in this closeout while preserving the no-visibility-change boundary. This records the remaining sanitized, non-secret research/workflow/deployment/reproducibility material as intended for a future public release.

## Release decision

```text
TRACKED_TREE=PASS
COLLAB_SURFACES=PASS
ALL_REFS_HISTORY=PASS
PUBLIC_INTENT=PASS
PUBLIC_RELEASE_GATE=PASS
```

This PASS is an eligibility result, not a visibility mutation. Immediately before any future private → public change, re-read live refs and collaboration surfaces. If they differ from the accepted closeout snapshot, scan the delta and return to HOLD on any finding, ambiguity or unstable ref set.
