# Hosting architecture audit — Vercel-only vs Vercel Preview + Cloudflare Production

Date: **2026-08-11**

This is a historical architecture-decision record. Current instructions live in `docs/agents/LATEST.md`, `docs/agents/current/hosting-architecture.md`, and `docs/agents/current/deployment-policy.md`.

## Question

Once ordinary branch Preview had moved to Vercel, the owner asked a higher-level question:

> If Preview already consumes Vercel resources, should Cloudflare simply be removed from the workflow and Production moved to Vercel too?

This audit re-opened the earlier assumption that Cloudflare Workers Static Assets should become the next Production target.

## Evidence reviewed

Repository/live-state evidence showed:

- `mykcs/basemodel` is still a static Astro site;
- ordinary non-main Preview is already validated on Vercel project `basemodel-preview`;
- Vercel Git deployment on `main` is disabled;
- Cloudflare Pages remains Production at `https://basemodel.pages.dev`;
- GitHub Actions and GitHub Pages are intentionally retired;
- PR #105 already proved that the same static `dist/` can run on a non-production Workers Static Assets shadow;
- that Workers shadow is pure static assets and does not require a Worker script;
- the current product does not depend on Workers/KV/D1/R2/Durable Objects or another Cloudflare-native runtime capability.

Current first-party provider behavior was also re-checked before drawing the architecture conclusion because build, promotion, limits and hosting guidance are time-sensitive.

## Initial intuition

At first glance, Vercel-only looked cleaner:

```text
GitHub
├─ PR / branch -> Vercel Preview
└─ main        -> Vercel Production
```

Compared with:

```text
GitHub
├─ PR / branch -> Vercel Preview
└─ main        -> Cloudflare Pages Production
```

one provider appears simpler than two.

That observation is true at the provider-count level, but it did not answer the owner's actual build-budget problem.

## Key correction: provider count and build count are different variables

The central lesson from the audit is:

```text
fewer providers
!= fewer hosted builds
```

The historical pain was that **Cloudflare Pages Git Preview builds were being spent on ordinary branch iteration**.

That problem was already solved by assigning ordinary Preview to Vercel.

A normal Vercel-only Git flow still has two deployment events for a typical accepted change:

```text
PR -> Preview deployment
merge/main -> Production deployment
```

So deleting Cloudflare does not automatically turn a two-deployment release cycle into a one-build cycle. It mostly moves both responsibilities and quota pressure onto one provider.

This changed the audit framing from:

> Which provider is better?

into:

> Which ownership split solves the actual job with the least operational complexity and least unnecessary hosted work?

## Why Cloudflare Pages remains Production

### 1. The original Pages quota problem is now isolated

With Vercel owning ordinary Preview, Cloudflare Pages no longer needs to build every feature branch merely so the owner can inspect it.

The intended pattern is:

```text
branch / PR iteration -> Vercel
accepted release       -> Cloudflare Pages
```

That means Cloudflare's hosted build budget is spent mainly at the actual release boundary instead of during every exploratory iteration.

### 2. Production identity is already tied to `pages.dev`

The public/canonical identity is:

```text
https://basemodel.pages.dev
```

That hostname cannot simply be carried to another provider.

Therefore deleting Cloudflare is not merely infrastructure cleanup. It also creates a product-identity migration involving at least:

- hostname;
- canonical URLs;
- hreflang;
- robots/search-indexing behavior;
- sitemap identity;
- external links/bookmarks;
- rollback and redirect strategy.

A custom domain would decouple product identity from the hosting vendor, but custom-domain adoption is a separate decision and should not be bundled casually into provider cleanup.

### 3. Cloudflare still provides a simple stable Production surface

For the current static Astro product, Pages is already serving the desired output and does not force application-framework changes.

The fact that Workers Static Assets is newer/more capable does not by itself make Pages inadequate for this site.

## Why the Workers cutover was paused

Earlier work correctly proved a Workers Static Assets migration path through a shadow deployment.

That work was valuable because it answered:

> Can the product run correctly on Workers Static Assets?

The answer was yes, with documented provider-native differences.

But the architecture audit asked a different question:

> Is there a current reason to move Production there?

For the present product, the answer was no.

The shadow uses only static assets and does not unlock a requirement the site currently has. Workers also changes the hosting identity away from `pages.dev` unless a separate custom-domain migration is performed.

Therefore the correct state became:

```text
Workers Static Assets = validated optional path
not = default next Production target
```

The configuration and evidence are retained because they make a future migration cheaper and safer. Further cutover work is frozen until a real trigger appears.

## When to reopen the decision

A future Agent should re-audit rather than mechanically preserve this 2026 decision when one or more of these conditions becomes real:

- the project adopts an independent custom domain;
- Cloudflare Pages limits/reliability/product direction become an actual blocker;
- the product needs server APIs or Cloudflare-native state/storage/compute such as Workers, KV, D1, R2 or Durable Objects;
- Vercel Preview quota/build economics become a repeated material problem;
- the owner explicitly wants a build-once promotion model;
- provider capabilities/pricing/limits materially change;
- maintaining two provider accounts becomes a larger operational burden than the release/quota/domain benefits of the split.

At that point, re-check current first-party documentation and live account/provider state. Do not treat the 2026 comparison as timeless.

## Build-once is a separate architecture problem

The owner also surfaced a stricter possible goal:

> Build exactly one hosted artifact, inspect it, then publish that same artifact without another build.

That is not solved merely by removing Cloudflare.

It requires an explicit **build once -> staged inspection -> artifact promotion** design.

If this becomes the real priority, future work should evaluate provider staging/promotion semantics, environment parity, rollback, domain routing and auditability directly. The decision should be based on current first-party behavior at that time.

Do not conflate:

```text
one provider
with
one build
```

## Final decision from this audit

The recommended steady state became:

```text
GitHub = source of truth
Vercel = ordinary Preview / Gate / visual review
Cloudflare Pages = Production at https://basemodel.pages.dev
Cloudflare Workers shadow = validated/frozen option
Cloudflare Direct Upload = fallback / Cloudflare-specific verification
```

No new GitHub Actions layer is added. No application-framework migration is implied.

## Reusable decision rule

When considering platform consolidation, evaluate at least five separate dimensions:

1. **Application requirements** — static output, SSR, APIs, state, storage, edge logic.
2. **Preview ownership** — where branch validation and owner review happen.
3. **Production ownership** — where the accepted artifact is served.
4. **Product identity** — domain/canonical/SEO/links and whether the hostname is provider-owned.
5. **Build economics** — number of builds, quota pools, concurrency/rate limits, and whether promotion reuses or rebuilds an artifact.

Do not optimize one dimension (for example provider count) while accidentally making another (build economics, domain migration, rollback, or product complexity) worse.

## Knowledge-deposition outcome

This audit intentionally changed current policy instead of merely being archived:

- `docs/agents/current/hosting-architecture.md` now defines Vercel Preview + Cloudflare Pages Production as the reaffirmed steady state;
- `docs/agents/LATEST.md` no longer tells future Agents that Workers is the default next Production target;
- `docs/agents/current/repository-map.md` labels Workers as a validated/frozen option;
- `src/lib/hostingArchitecture.test.ts` protects this ownership split and the distinction between provider consolidation and build reduction.

Future hosting/platform questions are already covered by the scenario-trigger registry. Agents should re-read current architecture and refresh provider evidence rather than relying on this historical record alone.
