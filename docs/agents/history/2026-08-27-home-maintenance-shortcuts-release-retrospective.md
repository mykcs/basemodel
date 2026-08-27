# Homepage maintenance shortcuts release retrospective

Date: **2026-08-27**

This is historical incident evidence for the small BaseModel homepage change that added owner-only maintenance shortcuts. Current behavior remains owned by `docs/agents/current/deployment-policy.md`, `scripts/vercel-ui-plan.ts`, `src/lib/vercelHostedUiGate.test.ts`, `vercel.json`, and live Vercel state.

## Situation

The owner wanted a low-attention maintenance entry on the BaseModel homepage: direct links to the GitHub repository and the real Vercel project settings, without promoting operational controls into primary navigation.

The user-facing change was deliberately small: one semantic `<nav>` at the end of the bilingual homepage body, with subdued scoped styling. The repository itself, however, has strict Vercel build-budget and hosted-browser gates, so the release exposed a hidden route-planner bug.

## What worked

1. **Resolve hosting truth before designing links.** BaseModel is Vercel-only for ordinary Preview + Production. The correct maintenance destinations were the real GitHub repository and `basemodel-preview` Vercel settings; no Cloudflare shortcut was added just for account-wide uniformity.
2. **Keep maintenance UI secondary.** The shortcuts live at the bottom of the homepage, use semantic navigation, inherit the current design language, and localize to Chinese/English. They do not compete with the research journey or global navigation.
3. **Use an ineligible staging branch before the provider-triggering ref when GitHub writes are sequential.** The initial edit could be assembled away from deploy-eligible refs, then copied once to an `agent/semantic-release-*` branch so Vercel saw one coherent Preview candidate instead of every intermediate write.
4. **Verify the provider against the exact commit.** Vercel deployment metadata was checked for branch, PR, and commit SHA rather than relying on a generic green badge.
5. **After Production, verify the stable public domain itself.** `https://basemodel-preview.vercel.app/` and `/en/` both returned HTTP 200 and the final HTML contained the localized GitHub and Vercel maintenance links.
6. **Fix the Gate contract instead of weakening it.** The corrective change taught `pageFileToRoute()` that underscore-prefixed page segments are internal modules, added regression tests, and retained fail-closed full-browser behavior for local files that cannot map to a concrete route.

## Friction and failure chain

### 1. Internal page modules looked like public routes to the planner

The homepage body lives at:

```text
src/pages/_bodies/home-v2.astro
```

The original planner matched any `src/pages/**/*.astro` path and transformed it mechanically into a route. Production therefore invented:

```text
/_bodies/home-v2/
```

The focused changed-route smoke then failed because that URL is intentionally not deployable. The first Production deployment stopped on the assertion that `/_bodies/home-v2/` should return a successful HTTP status.

This was a **test-planner bug**, not a broken homepage route.

### 2. A READY Preview was not sufficient evidence by itself

The first exact-head Preview reached `READY`, but its logs showed that the hosted browser gates were skipped for that branch class. That means:

```text
Vercel READY
!=
full browser acceptance
```

when the executable provider script explicitly skipped the browser layer. Future closeout must read the log path that actually ran, not infer coverage from deployment state alone.

### 3. The first Production failure only revealed the hidden planner defect

The initial Production deployment for the maintenance links reached the hosted route smoke, where the fabricated internal route failed. The right response was not to retry blindly and not to remove the smoke. The failure was traced to the route derivation function, then repaired at its owner.

### 4. Sequential connector mutations can create avoidable state noise

Once a branch/ref mutation succeeds, repeated `create branch` calls only produce `Reference already exists` noise. Shared GitHub state should not be used as a capability probe. After any successful write, future Agents should switch back to read/search to verify the returned ref/SHA before attempting another mutation.

## Durable executable fix

`pageFileToRoute()` now returns `undefined` whenever any path segment below `src/pages/` begins with `_`.

That makes internal page modules non-routes. Under the existing fail-closed planner policy, a local UI file that cannot map to one concrete public route falls back to the complete hosted Chromium matrix.

Regression coverage in `src/lib/vercelHostedUiGate.test.ts` protects both properties:

```text
src/pages/_bodies/home-v2.astro -> undefined
planHostedUi([internal module]) -> mode: full, routes: []
```

Do not replace this with a special-case fake route or a relaxed threshold.

## Release evidence

Historical release chain:

```text
PR #294  homepage maintenance shortcuts
  -> exact-head Preview READY
  -> merge to main
  -> Production ERROR on fabricated /_bodies/home-v2/

PR #295  planner repair + regression coverage
  -> corrective Preview READY
  -> merge to main at 719c7ef82b4984213b37a965bb1d5f40bbb3d046
  -> Production dpl_CZviApx2aTWGrRvj9ML9uTzWL4es READY
  -> full hosted Chromium matrix ran
  -> Lab 12/12 Chromium visual checks passed
  -> public zh/en homepage HTTP 200 with maintenance links present
```

The failed Production was useful evidence: it proved the Gate was exercising a false route and gave a concrete owner to repair.

## Smallest reliable workflow for similar homepage maintenance changes

```text
1. Read current hosting/deployment/UI policy and vercel.json branch eligibility.
2. Confirm the real provider/project and repository destinations.
3. Put owner maintenance controls in a deliberately secondary page location.
4. Batch all source edits before the first deploy-eligible ref update.
5. Run/observe exact-head Preview and inspect which gates actually executed.
6. If a route smoke fails, inspect the derived route before changing product code.
7. Repair planner/test ownership; do not weaken a valid browser Gate.
8. Merge once.
9. Require exact-main Production READY.
10. Fetch the stable Production zh/en routes and verify the actual rendered HTML/metadata.
```

## Boundaries

- The underscore-segment rule is BaseModel's current executable route-planner behavior; Astro conventions or Vercel behavior may evolve, so re-check current code before generalizing it to another repository.
- Deployment IDs and SHAs above are historical evidence only.
- Temporary Vercel share URLs are intentionally omitted and must never be persisted in repository history.
- A provider `READY` status remains weaker than product acceptance unless the required Gate/log path and real route behavior are also verified.
