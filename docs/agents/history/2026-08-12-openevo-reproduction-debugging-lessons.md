# OpenEVO reproduction debugging lessons — 2026-08-12

Status: historical evidence for the current reproduction-writing policy.

## Context

A remote OpenEVO × WebShop reproduction was delegated through a multi-agent chain:

```text
planning/review Agent
→ GitHub control plane
→ MiniMax on the lab Mac
→ physical lab network relay
→ offline 4×RTX 3090 server
```

The first execution package looked complete: the WebShop adapter already existed, the planning Agent had written code fixes and one entrypoint, MiniMax only needed to pull/run/return evidence, and the final proof ladder had been defined.

The first plan was still incomplete in the only sense that matters for runtime work: it contained hidden assumptions that had never touched the actual machine.

## What the real runs exposed

The debugging rounds crossed these failure classes:

1. worktree branch ownership: a detached runner could not `checkout main` because another worktree owned it;
2. transport split: ordinary Git HTTPS was unstable while `api.github.com` remained usable;
3. source identity: an unpacked API snapshot inherited an unrelated ancestor `.git` from `~/.cache`;
4. patch parser validity: malformed unified-diff hunk counts were initially mistaken for source/pin mismatch;
5. missing benchmark assets: WebShop data had never actually been staged to the offline server;
6. repeated dead-end download attempts: Mac → HF reset and Mac → Google timeout repeated without a causal change;
7. hosted-service admission: a GitHub Actions data bridge never started because of account payment/spending state, but its first surface error looked like a storage/download issue;
8. successful asset reroute: immutable WebShop data already vendored in a pinned GitHub commit could be fetched through the stable GitHub API plane;
9. redundant verification: an extra OpenEVO commit lookup added transient failure without stronger integrity than the exact-SHA archive path;
10. runtime identity: nine missing Python imports were downstream of selecting system Python 3.8 even though OpenEVO required Python >=3.11.

## Why the mistakes happened

### 1. We confused logical completeness with empirical completeness

Code review can prove that a path is internally consistent. It cannot prove:

- the lab Mac's transport behavior;
- the server's installed Python/runtime;
- whether a hosted job is admitted by the provider;
- whether benchmark data exists on the execution machine;
- whether an external data source is reachable from the selected acquisition machine.

The first plan should therefore be called an **executable hypothesis**, not a finished truth.

### 2. Asset delivery was under-modeled

The original plan treated source code as a first-class artifact but described data/runtime assets with phrases such as “should exist” or “can be downloaded.”

For offline reproduction, this is not enough.

Every non-code asset needs:

```text
immutable source
→ acquisition machine
→ transport
→ persistent cache
→ integrity / structural validation
→ execution path
→ precise blocker when absent
```

### 3. Repetition looked like progress

Retrying a failing source is cheap, so it is tempting. But two identical network failures under unchanged conditions were already strong evidence against that path.

The adopted rule is now:

> Same error class twice under unchanged causal conditions → stop retrying; change one causal variable.

### 4. We sometimes debugged the message before locating the layer

The GitHub Actions incident is the clearest example. Before examining step execution/admission, a Blob/storage-looking message encouraged a hypothesis about Hugging Face/Azure downloads.

The job had actually executed zero steps.

Future debugging should locate the failing layer before assigning semantic meaning to a downstream-looking error string.

### 5. More checks were mistaken for more certainty

The extra OpenEVO commit lookup duplicated the exact-SHA tarball path. It added a network call but little new falsification power.

A reproduction plan should prefer **one strong deterministic proof** over several highly correlated remote checks.

### 6. There was pressure to obtain a green status

When the full WebShop path remained blocked, weaker contract/mock gates became tempting as a replacement target.

That would have changed the research claim.

Partial gates remain useful, but must remain named partial evidence.

## What was converted into current product/Agent policy

### Product writing

For mature reproduction cases, present two tracks in parallel:

- **current shortest path** — what the student should do now;
- **debugging evidence** — what failed, why the hypothesis was wrong, what changed, and the reusable lesson.

This preserves both usability and scientific provenance.

### Evidence boundary

The page must always state which parts are measured/verified and which are planned/pending. A live experiment must not be narrated in the past tense as if it already succeeded.

### Debugging pedagogy

Teach failure-layer localization and escape rules, not just a long list of possible fixes.

### Method reproduction boundary

The OpenEVO case is a useful “复现 C” example because it deliberately allows engineering substitutions while keeping the method claim controlled. Hardware/network/adapter substitutions must be disclosed instead of being silently promoted to strict reproduction.

## Current user-facing case

Chinese detailed page:

```text
/guide/reproduction-c/openevo/
```

The page contains:

- research goal and current evidence state;
- 10-step current runbook;
- explicit proof ladder;
- 10 debugging incidents;
- reasoning-trap section;
- ALFWorld adapter plan;
- fair OpenEVO vs SEED comparison table.

## Rule for future Agents

When updating this case after new lab results:

- update the **current/evidence** section when a new gate is actually crossed;
- do not delete the historical bug path;
- do not convert a pending gate into success from code inspection alone;
- preserve exact source/model/data/hardware boundaries needed for later comparison.
