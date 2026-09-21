# Site-wide HPL, math rendering, and release closeout — conversation lessons

Status: **historical evidence only**
Date: **2026-09-21**
Repository: `mykcs/basemodel`

Current policy remains under `docs/agents/current/`; this file does not create a second mutable authority.

## Scope and relation to HPL

This conversation began with the three-arm OpenEvo result page and W&B evidence, then widened when the owner repeatedly asked the Agent to generalize from each exposed defect instead of repairing only the named specimen.

The owner-facing preference corrections were already deposited through the repository's Human Preference Learning assets and the merged site-wide HPL/math work. This conversation-lessons closeout therefore **does not re-ingest** the same wording, chart-adjacency, LaTeX, or site-wide propagation feedback as new CASEs, Preference Model entries, Gold Pairs, or visual tiers.

This record preserves only the still-useful operational, release, concurrency, and knowledge-system lessons.

## What went wrong, and what was learned

### 1. A named page defect is a search seed, not the acceptance boundary

The owner first pointed to one concrete defect at a time: W&B explanations were detached from their charts; one page still exposed non-LaTeX formulas; a local page looked fixed while similar patterns remained elsewhere.

The durable reader preference was already captured by HPL, including sibling-surface propagation and site-wide math-rendering rules. The missing behavior was **activation**: earlier passes treated a reported specimen as the main scope instead of immediately inventorying the failure class.

The repair was not another wording reminder. The repository gained rendered whole-site audits and HPL enforcement coverage so a future Agent has to ask:

```text
what failure mechanism did the owner expose?
-> which shared owner / sibling routes encode it?
-> is the invariant machine-detectable?
-> which normal Gate proves the complete semantic population?
```

The current HPL system and scenario registry own that rule. This history file only records why the executable coverage was necessary.

### 2. Old tests can preserve a rejected product behavior

After public copy and shared diagrams were made more reader-first, several tests failed because they still required the old internal labels, centralized glossary, experiment-count assumption, or English presentation tags.

Those failures were not evidence that the product had regressed. They were evidence that the **test contract was stale**.

The correct fix was to preserve the scientific/interaction invariant while updating the assertion target:

- human label in the primary reading layer;
- exact technical identity retained in evidence/provenance where needed;
- unchanged geometry, interaction, scientific boundary, or route ownership.

Future work should classify a red assertion as `product regression / stale test contract / invalid metric / provider-harness failure` before changing product behavior. A stale test must not force a rejected HPL pattern back into the page.

### 3. Concurrent ownership can contaminate the local branch even when the intent is non-overlap

The site-wide math audit was initially assembled on a checkout that already contained another Agent's Gated-Delta work. The intended scope said “do not touch the concurrent owner,” but branch ancestry still carried that owner's commits.

The recovery was to stop, read the exact concurrent PR file set, create a clean worktree from current `main`, and transfer only the file-set difference. This preserved the other Agent's ownership and kept the site-wide PR reviewable.

The existing multi-PR/current-authority rules already cover this class. The reusable lesson is operational: **scope intent is not proof of tree isolation**. Verify ancestry and changed-file overlap before the first write and again before release.

### 4. Temporary audit exemptions need an expiry condition

To avoid modifying the concurrent Gated-Delta owner, the site-wide math audit temporarily exempted that owner's route/files. The exemption was reasonable while the parallel PR was open, but an unnamed/open-ended exemption would create a permanent blind spot.

This exposed a gap in the existing site-wide proof rule, which allowed explicit exemptions but did not require a removal trigger.

Current `website-engineering-standard.md` now requires temporary exemptions to name:

- exact route/component and failure class;
- current owner / PR / workline;
- repository-observable removal trigger;
- removal or explicit blocker when that trigger becomes true.

The rule remains narrow: legitimate long-lived exceptions can still exist when they are explicit and justified; the new requirement targets **temporary concurrency exemptions** that would otherwise silently become permanent.

### 5. Missing post-merge Production deployment is not “still pending” and not permission to promote Preview

A deploy-relevant PR passed exact-head Vercel acceptance and merged, but the normal Vercel Git webhook did not create a Production deployment object for the merged `main` SHA. The stable Production alias therefore still represented the earlier release.

The unsafe shortcuts would have been:

- call the old Production artifact current;
- add a no-op commit to “wake up” Git integration;
- promote the accepted Preview and skip the merged-main Production rebuild/gates;
- source-upload an ambiguous build without proving `main` Git identity.

The correct fallback was to prove that no Production object existed for the exact current `main` SHA, then create one Git-source Production deployment bound to repository `main` and that exact merge SHA. Vercel then ran the normal Production build, Chromium gate, and Lab gate before the stable alias was accepted.

`deployment-policy.md` and `release-closeout-protocol.md` now own this fallback. It is a release-topology repair, not a second release or a Preview-promotion path.

### 6. Multiline shell/tool quoting failed again despite an existing rule

During the long implementation, multiline payloads containing backticks / `${...}` / nested shell quoting caused parser failures before dispatch more than once.

This was **not** a missing-policy problem. Root `AGENTS.md`, the scenario registry, and current project principles already say that non-trivial multiline content belongs in structured file tools or checked standalone scripts, and that after the first parser failure the task must stop retrying the same inline shape.

This conversation repeated that activation failure. No new current rule was added, because adding another copy would make the knowledge system worse. The existing rule remains authoritative; this history case records the recurrence.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Closeout treatment |
| --- | --- | --- | --- | --- |
| W&B explanations belonged under each graph rather than in one detached metric table | Yes, reader-context family | explanation and claim boundary stay spatially attached to the evidence object | current HPL assets / CASE-096 family | already ingested; not duplicated |
| One non-LaTeX formula page exposed broader fake-formula debt | Yes, site-wide propagation family | named specimen -> sibling/shared-owner/site-wide audit -> executable rendered gate | current HPL math preference + site-wide math audit | already current; not duplicated |
| Owner asked to “举一反三” across all BaseModel content | Yes | high-confidence same-family findings are repaired through shared owners; unrelated exceptions remain exempt | HPL system + scenario registry + HPL enforcement registry | already current; not duplicated |
| Old tests forced rejected English/internal labels back into the UI | Yes in this workline | classify stale test contract separately from product regression | release-closeout failure classification + HPL regression tests | historical cause recorded |
| Local branch inherited concurrent Gated-Delta commits | Known class | intent is not tree isolation; verify ancestry/file overlap | multi-PR/current-authority rules | existing rule confirmed |
| Concurrent route needed a temporary audit exemption | New gap | temporary exemption must name owner and removal trigger | `website-engineering-standard.md` | **new current rule** |
| Main merge created no Production deployment object | New gap | exact-main Git-source Production fallback; no Preview promotion/no-op commit | `deployment-policy.md` + `release-closeout-protocol.md` | **new current rule** |
| Multiline parser/quoting failure repeated after rule already existed | Yes | switch execution surface after first failure | root Agent shell rule + scenario registry | activation failure recorded; no duplicate rule |
| Live PR/deployment/SHA/session/PID/worktree state | Temporary | reconstruct from provider/Git when needed | none | intentionally not persisted |

## REPEAT-CORRECTION witnesses

### Site-wide generalization
- trigger: owner points to one visible defect and says to check the rest of the site;
- current owner: HPL system + scenario registry + executable rendered audits;
- checked artifact: shared owner / sibling routes / rendered-site population;
- allowed next action: fix confirmed same-family instances and add/extend the owning gate;
- invalidation cue: unrelated semantic object or explicit route-role exception.

### Quoting failure
- trigger: first parser failure on multiline content;
- current owner: root Agent shell rule + scenario-trigger shell/quoting section;
- checked artifact: failure happened before dispatch, so no repository mutation occurred;
- allowed next action: structured file edit or syntax-checked standalone script;
- invalidation cue: any retry that reuses nested inline quoting.

### Production fallback
- trigger: deploy-relevant merged `main` SHA has no Production deployment object;
- current owner: deployment policy + release closeout protocol;
- checked artifact: provider deployment list/status for exact `main`, stable alias still on prior release;
- allowed next action: one exact-main Git-source Production fallback;
- invalidation cue: provider creates the normal exact-main Production object, `main` moves, or Git identity cannot be proven.

## Future-Agent test

A new Agent starting from root `AGENTS.md` can now reach, within one or two jumps:

1. HPL/sibling propagation rules before a broad public-page repair;
2. the site-wide-proof rule that requires complete inventory or explicit exemptions;
3. the new exemption lease/removal-trigger rule;
4. exact-head/final-gate release rules and the new missing-Production-object fallback;
5. shell/quoting rules that already forbid repeated inline multiline retries.

The highest-risk mistakes from this conversation therefore no longer depend on remembering this historical narrative.

## Deliberately not persisted

This closeout does not preserve temporary branch heads, merge SHAs, deployment IDs, Preview/deployment-specific URLs, local worktree paths, ports, PIDs, browser session state, one-time W&B/Vercel queue state, or current open-PR readiness as standing policy.

Stable merged PR history and canonical public routes remain reconstructible from Git/GitHub when needed.

No claim is made that this repository closeout wrote ChatGPT account-level long-term memory. Repository persistence and account memory remain separate layers.
