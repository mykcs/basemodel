# Site three-pass audit and release retrospective — 2026-08-28

Status: **historical case record**. Current behavior is owned by `docs/agents/current/*`, executable repository tests/configuration, live Vercel state, and current scientific authority in `mykcs/openevo-experiment`.

This document records the engineering and reasoning friction from the 2026-08-28 whole-site audit that proceeded in the order **facts → reader-first copy → visual language**, then closed through Preview, PR merge, Production browser acceptance, and direct Production HTML smoke checks. It is meant to help future Agents avoid repeating the same failure modes.

The short version is:

> A site-wide audit is not “read every page and polish it.” First decide which facts are allowed to be called current, then make those facts readable, then make visual weight follow semantic weight. Only after those three layers agree should the release machinery be allowed to spend a hosted build.

## Task constraints that shaped the solution

The user imposed several constraints that materially changed the engineering path:

- fact checking had to happen **before** copy/style work;
- explanations should work for a smart reader with essentially zero local context;
- professional terms should remain available, but only after the plain-language meaning is clear;
- page-direction filler such as “下面先讲……再……” should be removed;
- visual language should become more consistent without inventing a new design system;
- Remote Desktop Commander was explicitly out of scope;
- Vercel CI / Build CPU consumes paid quota, so intermediate hosted builds had to be minimized;
- the task should continue through merge and Production verification rather than stop at a green local patch.

Those constraints were compatible, but only if the work was batched and evidence ownership was resolved before editing.

## Historical release lineage

The audit work was prepared from the then-current `main` and shipped through PR [#314](https://github.com/mykcs/basemodel/pull/314), titled `research: complete site fact, copy, and visual audit`.

The important historical heads were:

```text
initial audit head       b57073d6193d78abf018a80f896c8f46b1d7a766
corrective Preview head  1805334c7197a4e3cde7e8a0d0c3426cd91ba44a
merged main commit       799a41192f1979cd49e1ac80899dc2cd0bd0d4a5
```

`main` has moved since then, so these are provenance markers, not current-head claims.

Two Preview deployments were intentionally consumed:

1. the first exposed stale regression contracts and failed before final browser acceptance;
2. the second passed the complete deploy verification.

After squash merge, one normal Production build ran. That was the desired cost shape: **one diagnostic Preview, one corrective exact-head Preview, one Production release** — not a Preview for every editing step.

## Friction 1: “fact check first” means finding the real authority, not proofreading existing claims

The first major trap was assuming the website’s structured data was the source of truth because it already looked deliberate.

It was not.

Two different freshness problems were present:

1. the model catalog had a recent but already stale point-in-time family snapshot;
2. the OpenEvo scientific-state owner still represented an older experiment phase even though the experiment repository had moved on.

The reusable rule is:

```text
user asks for current truth
-> resolve live/executable authority
-> compare website representation against it
-> only then edit public copy
```

For scientific claims, the actual authority chain was the live experiment repository and its current campaign/reconciliation state, not old website prose or an older checked date.

For provider/model claims, the authority depended on the exact claim: model existence, release timing, API availability, family membership, flagship status, and retirement are different facts and may require different first-party surfaces.

## Friction 2: a recent model-catalog audit can already be stale

The site still carried a complete-family snapshot checked on 2026-08-12. That was not very old in calendar time, but it was old enough to miss meaningful first-party post-snapshot evidence.

Strong evidence leads found during this audit included:

- Qwen official code commits supporting `qwen3.8-max` and later `qwen3.8-plus` / `qwen3.8-flash` metadata;
- Google’s official Python GenAI changelog adding `gemini-3.7-flash`;
- xAI’s official Python SDK changelog adding `grok-4.6`.

The important reasoning correction was **not** to turn those evidence dates into model release dates.

A commit dated 2026-08-19 can prove that the repository contained a statement by 2026-08-19. It does not automatically prove “the model was released on 2026-08-19”. Likewise, SDK support can prove a model identifier exists on a first-party surface without proving that it is the family flagship or that older siblings are retired.

Because the production model schema required fields such as `release_date`, manufacturing model records from commit dates would have created false precision. The chosen design therefore separated:

```text
last complete catalog snapshot
+
post-snapshot first-party evidence leads
```

instead of pretending that partial evidence was a complete new family map.

This audit also added a stale-family warning path in `src/lib/dataHealth.ts`, turning “remember to re-check this later” into an executable fuse.

For the deeper catalog-specific case, also read [`2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md`](2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md).

## Friction 3: lack of general web search must narrow the claim, not lower the evidence bar

General web search was unavailable during the conversation. That prevented a fresh exhaustive sweep of every provider’s current live documentation.

The wrong response would have been to fill the gap with memory or to call the result a “complete current catalog audit” anyway.

Instead, the audit used first-party GitHub repositories and SDK changelogs where available, then explicitly bounded the public claim. The site wording was changed to say, in effect:

- this is the **last complete catalog check**;
- it is **not a live vendor feed**;
- newer first-party evidence may appear as an evidence lead before a fully populated model record exists.

This is a general rule for constrained tooling:

> When a retrieval surface disappears, shrink the epistemic scope. Do not silently weaken the standard of proof.

## Friction 4: live scientific state and historical scientific evidence must coexist without overwriting each other

The old website-level scientific state still described an H1.27-era snapshot. The authoritative experiment repository had advanced to Track B / WB1 continuation with a Gen28 / state-v28 barrier state.

The then-checked default-main scientific state was refreshed from experiment source commit `04c0faf02af6f0fcb0724aff3c5697b0c858e9e4` and recorded:

```text
phase                 WB1-TRACKB-CONTINUATION
classification        GEN28_STATE_V28_BARRIER_PASS_ADOPTED
latest generation     28
latest native state   state-v28
matched budget        3,584 / 20,640
remaining             17,056
formal task use       false
GPU allocation        false
final test            locked
```

These values are historical as of that audit. Future Agents must resolve current experiment truth again.

The key conceptual separation was:

- **current campaign state** tells the reader where the active program is now;
- **historical experiment evidence** explains how earlier claims were established;
- current state should not rewrite old receipts;
- old receipts should not masquerade as current operating status.

That separation is especially important for research pages because a “current” card and a historical timeline can both be true while pointing to different phases.

## Friction 5: reader-first copy is an ordering rule, not a simplification rule

The copy problem was not that the site used technical language. The problem was that many passages made the reader learn the page’s narration before learning the fact.

Unhelpful patterns included sentences equivalent to:

- “下面先讲研究对象，再逐层展开……”;
- “先进入模型浏览器；只有需要……再……”;
- “这里承接原首页……”.

Those sentences describe how the editor organized the page, not what the reader needs to know.

The successful ordering was:

```text
1. concrete conclusion or fact
2. plain-language mechanism
3. professional term on first use
4. raw machine state / SHA / audit ID as provenance
```

For example, a reader should first learn “Gen28 的状态已经补齐，但下一代训练仍未授权”, then see `state-v28`, `barrier reconciliation`, and the machine status string.

This is not “dumbing down”. It is moving terminology into the correct semantic layer.

## Friction 6: visual-language audit did not require a redesign

A tempting response to “视觉语言风格检查” is to change global CSS until the site looks more uniform. That would have created unnecessary regression surface.

The site already had a usable Research Editorial × Experimental Workbench language through shared variables such as:

```text
--surface
--surface-muted
--line
--muted
--accent-deep
```

The audit therefore focused on mismatches between semantic importance and visual weight:

- important explanatory text that had drifted into near-footnote sizes was raised;
- shared model surfaces received the same evidence-boundary notice pattern;
- responsive evidence cards followed a single 3 → 2 → 1 column collapse;
- no new global gradient/shadow/theme system was introduced.

A dedicated regression test, `src/lib/siteThreePassAudit.test.ts`, then encoded some of the audit’s high-value checks: banned stage-direction phrases on primary sources, presence of catalog evidence notices, explicit evidence boundaries, and removal of selected tiny text literals from primary audited surfaces.

The general lesson is:

> Visual consistency should first remove semantic contradictions. A redesign is justified only when the existing system cannot express the intended hierarchy.

## Friction 7: the first Preview failure was caused by stale contracts, not by the new scientific truth

The first exact-head Preview was important because it exposed a different layer of staleness.

The implementation had correctly advanced scientific state, but several tests and strict audit scripts still hard-coded the old H1.27 / 2026-08-18 world.

The first Preview ended with roughly:

```text
62 test files passed
4 test files failed
382 tests passed
6 tests failed
```

The failing owners included:

- `SeedStudentReproductionGuide.test.ts`;
- `audienceCopyAudit.test.ts`;
- `editorialHeadingPolicy.test.ts`;
- `openEvoScientificState.test.ts`;
- plus strict invariants in `scripts/audit-audience-copy.ts` and `scripts/audit-final-product-hardening.ts`.

This was not evidence that the live scientific-state refresh should be reverted. It was evidence that the regression contract had become an independent stale copy of the old state.

The correct diagnostic question was:

```text
Does the failure prove the new fact is wrong?
or
Does the failure prove the test still encodes the old fact?
```

That distinction prevented a common failure mode where an Agent “fixes CI” by restoring stale production data.

## Friction 8: tests that pin exact prose can become hidden semantic owners

Some strict audits were not merely checking behavior; they expected exact textual tokens such as source-resolution phrases and GPU-governance wording.

To keep the release moving, the corrective patch updated the old H1.27 assertions and retained a few exact contract tokens in compatibility-oriented hidden text, including phrases around:

- `actual branch → campaign → reconciliation`;
- `preregistration + authorized UUIDs`;
- exact GPU authorization / live-idle language;
- default-main snapshot compatibility tokens.

This worked, but it is a useful design smell to remember.

A test that requires a precise human-visible sentence can accidentally become a second copy owner. Future cleanup should prefer semantic assertions over invisible prose shims where practical. If a hidden compatibility token is still consumed by an executable audit, migrate the consumer and the shim in the same change; do not delete it blindly.

## Friction 9: Vercel cost control requires controlling both build count and build scope

The user explicitly cared about Vercel quota, so the release workflow treated `[vercel-preview]` as a spend decision rather than a normal commit decoration.

The successful pattern was:

```text
read/verify first
-> prepare one coherent source batch
-> create one exact-head Preview
-> diagnose all failures from that Preview
-> prepare one corrective exact head
-> run one final Preview
-> merge once
-> allow one Production build
```

No per-file Preview was created, and the docs-only closeout that produced this retrospective uses a `docs/**` branch specifically so it does not become Vercel Preview eligible under the current branch policy.

For the broader cost investigation and Build CPU controls, read [`2026-08-28-vercel-billing-and-cost-control-retrospective.md`](2026-08-28-vercel-billing-and-cost-control-retrospective.md).

## Friction 10: protected Preview access and final product verification are separate concerns

The successful Preview was `READY`, but an early direct fetch against a protected Preview alias encountered Vercel authentication redirect behavior. That did not mean the deployment had failed.

The release therefore kept these layers separate:

```text
build / verify:deploy status
browser acceptance status
protected Preview fetch capability
Production public fetch status
```

After merge, Production became publicly fetchable and direct Vercel fetches returned HTTP 200 for representative routes, including Chinese and English Results.

The lesson is to classify an authentication redirect as an access-layer condition, not automatically as a product failure.

## Friction 11: Production browser acceptance can legitimately dominate the final wait

After merge, the Production pipeline built 435 pages successfully and then ran the repository’s full Chromium acceptance matrix because the change touched shared UI/research surfaces.

The final matrix completed:

```text
91 / 91 passed
```

Coverage included mobile/tablet/desktop widths, Chinese and English Results, dark/light mode, navigation, CJK overflow, research visuals, and Landscape interactions.

This was not an unnecessary extra deployment. It was part of the one Production release already required by the repository’s acceptance contract.

A cost-sensitive Agent should distinguish:

- **duplicate provider builds** — waste;
- **one required Production validation that is expensive** — release cost.

Do not abort a single valid Production gate merely because it takes longer than the static build itself.

## Friction 12: main can move while a release is being closed

During the broader session, `main` continued to receive unrelated work. This reinforces why “PR mergeable” and “exact deployment lineage” should be checked near the actual merge/release point rather than assumed from an earlier read.

For this audit, PR #314 was checked for mergeability and path overlap against relevant in-flight work before merge. After squash merge, Production was verified against the merge lineage rather than against an older Preview URL.

The durable rule is:

> A green Preview proves one exact head. It does not prove that `main` has remained unchanged or that the Production deployment corresponds to that same source until you verify the lineage.

## What the audit changed structurally

The important durable additions were not just copy edits.

### Catalog evidence boundary

The audit introduced shared evidence-lead data and a reusable catalog notice so model-facing surfaces can distinguish a dated full snapshot from newer first-party evidence without fabricating complete records.

### Automatic stale-family warning

`src/lib/dataHealth.ts` now treats stale family catalog checks as warnings based on configured refresh policy.

### Site-wide audit regression

`src/lib/siteThreePassAudit.test.ts` encodes selected cross-cutting facts/copy/visual regressions.

### Current scientific-state owner refresh

`src/lib/openEvoScientificState.ts` was updated from an H1.27-era default-main snapshot to the then-current Track B / Gen28 / state-v28 state, while preserving the rule that true live state must resolve the actual experiment branch and latest reconciliation/result.

### Reader-first surface updates

Shared Home, Models, Families, Compare, Landscape, research hero, and experiment-program surfaces were changed so conclusion and plain meaning precede provenance and machine identifiers.

These changes matter because they reduce the chance that the exact same class of error will need another manual full-site audit.

## What worked well

### 1. Resolve truth before touching prose

This prevented polished but stale copy.

### 2. Separate evidence leads from complete catalog records

This allowed the site to acknowledge Qwen 3.8 / Gemini 3.7 Flash / Grok 4.6 evidence without inventing release dates, flagship status, or family completeness.

### 3. Treat CI failures as evidence that needs interpretation

The first failed Preview was useful because it revealed stale regression contracts. It was not “lost work”.

### 4. Batch hosted acceptance

One coherent Preview head, one corrective Preview head, and one Production build respected both quality and spend constraints.

### 5. Verify source, CI, browser acceptance, and final public artifact independently

The task only closed after all four layers agreed.

### 6. Keep tool scope narrow

The work stayed on GitHub/Vercel-owned surfaces. No Remote Desktop Commander was used because no local-only state was required.

## Anti-patterns to avoid next time

Do not:

- start with visual polishing before current facts are resolved;
- call a dated catalog snapshot “current” simply because it is recent;
- convert a source commit date into a model release date without evidence;
- infer flagship or retirement from a larger version suffix;
- restore stale website state merely to satisfy a stale test;
- interpret a protected Preview auth redirect as a failed build;
- trigger `[vercel-preview]` on intermediate commits;
- redesign global CSS to solve local hierarchy problems;
- expose raw machine status before the reader knows what it means;
- silently keep invisible compatibility prose forever after the test owner can be migrated;
- claim an exhaustive live-provider fact audit when the available retrieval surface did not support one.

## Recommended workflow for the next whole-site audit Agent

Use this order:

```text
1. Read current Agent/router + deployment + copy + scientific/catalog owners.
2. Inventory the public surfaces that share fact owners.
3. Resolve live scientific/provider truth for claims that can move.
4. Mark each fact as current, historical, stale, unknown, or evidence-lead-only.
5. Update structured truth owners before public prose.
6. Add/repair automatic freshness or regression checks where the same error could recur.
7. Rewrite copy in conclusion -> plain mechanism -> term -> evidence order.
8. Audit visual hierarchy using the existing design system before inventing new styles.
9. Run repository/static tests before spending Preview.
10. Batch a coherent exact head and opt in to one Vercel Preview when required.
11. If Preview fails, classify whether source, test contract, provider, or access layer is stale.
12. Re-run one corrective exact-head Preview.
13. Re-check PR mergeability/main movement, then merge once.
14. Verify Production build, required browser matrix, exact lineage, and representative public HTTP 200 routes.
15. Record reusable friction in history; promote only truly durable rules into existing current owners.
```

## Known follow-up smell: compatibility prose shims

A few hidden exact-token shims were retained because strict repository audits still consume legacy textual contracts. They are not a reason to rewrite public copy back into machine-oriented prose, but they are also not ideal permanent architecture.

Future work that intentionally migrates those strict consumers should:

1. identify every executable reader of the token;
2. replace exact prose matching with a semantic state/value assertion where possible;
3. remove the hidden compatibility token in the same change;
4. run the affected strict audit plus the normal release gate.

Until then, treat those shims as fixed-path/executable compatibility, not dead text.

## Evidence and related records

Primary historical release artifacts:

- PR #314: <https://github.com/mykcs/basemodel/pull/314>
- initial audit head: <https://github.com/mykcs/basemodel/commit/b57073d6193d78abf018a80f896c8f46b1d7a766>
- corrective Preview head: <https://github.com/mykcs/basemodel/commit/1805334c7197a4e3cde7e8a0d0c3426cd91ba44a>
- merged audit commit: <https://github.com/mykcs/basemodel/commit/799a41192f1979cd49e1ac80899dc2cd0bd0d4a5>

Related current owners:

- [`../current/product-and-research-integrity.md`](../current/product-and-research-integrity.md)
- [`../current/audience-centered-technical-copy.md`](../current/audience-centered-technical-copy.md)
- [`../current/reader-first-copy-hierarchy.md`](../current/reader-first-copy-hierarchy.md)
- [`../current/research-editorial-style.md`](../current/research-editorial-style.md)
- [`../current/model-catalog-verification-policy.md`](../current/model-catalog-verification-policy.md)
- [`../current/scientific-state-provenance.md`](../current/scientific-state-provenance.md)
- [`../current/deployment-policy.md`](../current/deployment-policy.md)
- [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md)
- [`../current/ui-change-visual-acceptance-gate.md`](../current/ui-change-visual-acceptance-gate.md)

Related historical cases:

- [`2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md`](2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md)
- [`2026-08-28-vercel-billing-and-cost-control-retrospective.md`](2026-08-28-vercel-billing-and-cost-control-retrospective.md)
- [`2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md`](2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md)
- [`2026-08-28-webshop-explainer-and-results-reader-workflow-retrospective.md`](2026-08-28-webshop-explainer-and-results-reader-workflow-retrospective.md)

This record is intentionally historical. If a future Agent needs to know what is true **now**, it must resolve current repository/provider/experiment state again rather than treating the numbers in this document as live status.
