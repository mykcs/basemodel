# Public Release Security Gate

Last reviewed: **2026-08-14**

Status: **HOLD until every gate below passes. Do not change repository visibility to public while any gate is unresolved.**

## Gate A — tracked tree

PASS requires:

- no plaintext bearer/API tokens, passwords, private keys, cookies or session material;
- no tracked `.env`, `.dev.vars`, provider-state directories or Agent scratch state;
- no persisted temporary Preview share/access parameters;
- no unnecessary provider account/team/project opaque identifiers;
- no personal device inventory, private network topology, IP/hostname/username, VPN endpoint or physical-lab detail.

The repository `.gitignore` must cover common local credential and provider-state paths.

## Gate B — GitHub collaboration surfaces

PR/Issue bodies and comments become public with the repository. Before release:

- remove temporary share/access URLs and query parameters;
- do not paste live credentials into a replacement note;
- keep only non-sensitive deployment IDs/status summaries when they are useful evidence.

Temporary Vercel share URLs are ephemeral delivery artifacts. They may be sent through an ephemeral review surface, but must not be persisted in GitHub or repository text.

## Gate C — all refs and full Git history

This is the final blocking gate.

Run a real secret scanner against a mirror/full clone that includes **all refs and complete history**, not only the current `main` tree. Use a maintained tool such as Gitleaks or an equivalent scanner and review every finding.

PASS requires **zero unresolved real secrets** across reachable branches/tags/history. False positives may be documented, but ambiguous findings are HOLD.

If a live credential is found:

1. revoke/rotate it first;
2. remove it from the current tree;
3. purge/rewrite Git history when appropriate;
4. rescan all refs;
5. only then reconsider public visibility.

History rewriting does not make an exposed credential safe without rotation.

## Gate D — public-intent review

Confirm that remaining material is intentionally public, including:

- research logs and historical decision records;
- deployment architecture and public hostnames;
- experiment hardware facts needed for reproducibility;
- PR/Issue discussions that reveal workflow or research direction.

Non-secret does not automatically mean intended for publication.

## Release decision

Only an explicit final result of:

```text
TRACKED_TREE=PASS
COLLAB_SURFACES=PASS
ALL_REFS_HISTORY=PASS
PUBLIC_INTENT=PASS
PUBLIC_RELEASE_GATE=PASS
```

authorizes changing repository visibility from private to public.
