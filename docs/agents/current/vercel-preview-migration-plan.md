# Vercel Preview workflow — validated and adopted

Status: **Validated / adopted for non-main Preview only**

Last reviewed: **2026-08-11 01:32 +08:00**

## Adopted architecture

```text
GitHub = source of truth

non-main feature branch / PR
        -> Vercel project `basemodel-preview`
        -> repository-owned `npm run verify:deploy`
        -> Astro production build
        -> protected *.vercel.app Preview
        -> Agent reads build state/logs + verifies the real page
        -> Agent generates a temporary share URL when the owner needs anonymous access

main
        -> Vercel Git deployment disabled
        -> Cloudflare Pages Production
        -> https://basemodel.pages.dev
```

Cloudflare Direct Upload remains a supported fallback and a useful Cloudflare-specific integration Preview. It is no longer the ordinary first-choice Preview path when Vercel is available.

Do not move the canonical Production domain to Vercel as a side effect of this decision. A Production-host migration is a separate project.

## Vercel project

- Team: `wangrui92-team`
- Team ID: `team_Vz2qUrJvqqw5RAIgGQwNtbkR`
- Project: `basemodel-preview`
- Project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`
- Git repository: private `mykcs/basemodel`
- Framework: Astro / static output
- Canonical Production remains `https://basemodel.pages.dev`

The first private-repository connection required a one-time human OAuth / GitHub App authorization. After that boundary was crossed, the connected Vercel tools could list projects/deployments, inspect build logs, fetch protected deployments, and create temporary share links without asking the owner to relay dashboard state.

## Repository configuration

`vercel.json` is now part of the deployment contract:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run verify:deploy && npm run build",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- src public scripts package.json package-lock.json astro.config.mjs tsconfig.json .node-version vercel.json",
  "git": {
    "deploymentEnabled": {
      "main": false
    }
  }
}
```

Interpretation:

- non-main Vercel Previews must run the complete deterministic repository Gate before Astro build;
- docs-only / Agent-only changes normally do not create a Vercel deployment;
- Vercel does not deploy `main` from Git integration;
- Cloudflare remains the only intended Production host.

If the list of runtime-affecting repository paths changes, keep `ignoreCommand` synchronized. Do not let a new runtime directory become invisible to Preview builds.

## Pilot evidence — PR #99

The controlled pilot used the real SEED / 4×RTX 3090 Guide PR rather than a no-op sample.

Final tested PR head:

`674f60bb57b37cd712cc745bf8dcf1ce513b722f`

Final Vercel deployment:

- deployment ID: `dpl_E3NeYkTLnsgUJyfNVUtomUqpmMuJ`
- exact deployment: `https://basemodel-preview-be5vofsnz-wangrui92-team.vercel.app`
- branch alias: `https://basemodel-preview-git-agent-seed-owned-4x-54f1f3-wangrui92-team.vercel.app`
- GitHub commit status: `Vercel = success`
- Vercel state: `READY`

The final build cloned the exact PR head and ran the complete Gate:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run audit:v2
npm run audit:v2:adversarial
npm run audit:hardening
npm run build
```

Observed final result:

- Astro check: 0 errors;
- data validation: 164 models / 21 papers;
- semantic audit: 0 findings;
- Vitest: 14 files / 75 tests passed;
- V2 completion audit: passed;
- V2 adversarial audit: passed;
- hardening audit: passed;
- Astro generated 392 pages;
- deployment: READY.

The stronger Gate caught two real regressions in PR #99 that a plain `astro build` had hidden:

1. the simplified Guide stopped reading the `guides` content collection (`V2-DATA-002`);
2. the Guide had lost the research-integrity boundary that heuristic VRAM/resource estimates are not measured hardware results (`AV-GUIDE-HARDWARE-TRUTH`).

Both were fixed before the final READY deployment. Do not weaken these audits merely to make a Preview pass.

## Preview SEO / identity contract

The final Chinese Guide Preview was opened through the connected Vercel capability and verified to return/render:

- HTTP success after authenticated access;
- `X-Robots-Tag: noindex`;
- `<meta name="robots" content="noindex,follow">`;
- canonical URL pointing to `https://basemodel.pages.dev/guide/`;
- bilingual hreflang identity pointing to the Cloudflare canonical host;
- the new 4×3090-first SEED workflow and restored evidence-boundary copy.

`PUBLIC_SEARCH_INDEXING=disabled` and `PUBLIC_SITE_URL=https://basemodel.pages.dev` are part of the Preview identity assumptions. Preserve them when recreating the Vercel project.

## Private Preview protection

Because the GitHub repository is private, Vercel Deployment Protection is currently active for Preview URLs.

Consequences:

- a normal exact/branch `*.vercel.app` URL may redirect an anonymous visitor to Vercel authentication;
- connected Vercel tooling can still inspect the deployment and its logs;
- when the owner needs to open the Preview without Vercel login, use `get_access_to_vercel_url` and return the generated temporary share link;
- the temporary share link currently expires after roughly 23 hours, so regenerate it rather than treating it as a permanent artifact.

Do not disable Deployment Protection merely for convenience without an explicit security/product decision. If permanent anonymous PR URLs become important, evaluate that change separately.

## Normal feature workflow

```text
1. Read current Agent docs and inspect overlapping PRs.
2. Make one focused feature branch / PR.
3. Push the source branch; use `[CF-Pages-Skip]` where appropriate so branch iteration does not intentionally request a Cloudflare Pages build.
4. Vercel creates the non-main Preview.
5. Confirm the exact PR head received Vercel success.
6. Read Vercel build logs; do not accept a Preview that skipped `verify:deploy`.
7. Inspect the real Preview route(s).
8. Generate a temporary Vercel share URL when owner access requires it.
9. Iterate until the exact head is READY and acceptance checks pass.
10. Only after owner acceptance, merge/release to `main`.
11. `main` is not deployed by Vercel; Cloudflare remains the Production release boundary.
```

### Critical release caveat

Intermediate feature commits may deliberately use `[CF-Pages-Skip]` to protect Cloudflare Preview build quota.

However, when the owner actually wants the accepted change released to Cloudflare Production, the final merge/release commit **must not accidentally carry a Cloudflare skip prefix**. A skip-prefixed merge can prevent the intended Production deployment.

Use a normal semantic merge title/message for the real Production release.

## Cloudflare evidence boundary

During the Vercel pilot, the final PR head exposed a successful Vercel GitHub status. The Cloudflare PR bot remained on the older `828aaf4` Preview and did not record a newer Cloudflare branch deployment for the Vercel-pilot heads.

Therefore:

- no new Cloudflare Git-integrated Preview was intentionally requested for the Vercel pilot;
- Cloudflare Production was not intentionally changed by the pilot;
- do **not** infer the exact account-level monthly build counter from this evidence because the available tools do not expose that authoritative counter.

## Cloudflare Direct Upload fallback

Keep the repository-owned Direct Upload path. Use it when:

- Cloudflare-specific Preview fidelity is the thing under test;
- Vercel is unavailable or rate-limited;
- a release issue appears Cloudflare-specific;
- the owner explicitly requests a `pages.dev` Preview.

Prefer the repository-owned command/runbook rather than inventing a new ad-hoc Wrangler path.

## What this decision does not mean

- Vercel Hobby is not unlimited; re-check current Vercel limits before quota/cost decisions.
- Vercel Preview success is not proof of a Cloudflare Production deployment.
- Production has not been migrated to Vercel.
- GitHub Actions remains retired.
- Cloudflare Direct Upload remains useful; it is simply no longer the ordinary first-choice Preview route.
- A protected Preview share link is not permanent and should not be stored as a durable canonical URL.

## If this workflow later fails

Record the exact blocker here and fall back to Cloudflare Direct Upload. Netlify remains the strongest previously evaluated alternate Preview platform if both Vercel and Cloudflare Agent paths become unsuitable.
