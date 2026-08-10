# Deployment and validation policy

Last reviewed: **2026-08-11 01:32 +08:00**

## Authority

This file defines the steady-state deployment boundary for `mykcs/basemodel`.

```text
GitHub = canonical source
non-main branches / PRs = Vercel Preview
main = Cloudflare Pages Production
Cloudflare Direct Upload = fallback / Cloudflare-specific Preview
```

GitHub Actions and GitHub Pages remain intentionally retired.

## Provider responsibilities

### GitHub

- canonical source and Git history;
- branches / pull requests;
- Dependabot for npm dependencies;
- review metadata and deployment-status surface.

### Vercel

- ordinary non-main Preview host through project `basemodel-preview`;
- runs `npm run verify:deploy && npm run build` through `vercel.json`;
- exposes deployment/build logs to the connected Agent tooling;
- creates stable branch + exact deployment URLs;
- currently protects private-repository Previews with Vercel Authentication;
- does **not** Git-deploy `main` (`git.deploymentEnabled.main = false`).

### Cloudflare Pages

- canonical Production host at `https://basemodel.pages.dev`;
- Production branch remains `main`;
- formal Cloudflare build command remains `npm run build:cloudflare`;
- build output remains `dist`;
- Direct Upload remains supported for Cloudflare-specific Preview/fallback work.

## Default non-main Preview workflow

```text
focused feature branch / PR
-> push source
-> Vercel runs verify:deploy
-> Vercel runs Astro build
-> confirm exact head has Vercel success
-> read build logs
-> inspect real Preview
-> generate temporary share URL if owner access needs protection bypass
-> iterate until accepted
```

Do not intentionally trigger a Cloudflare Git Preview merely to obtain a review URL when the Vercel path is available.

Intermediate branch commits may use `[CF-Pages-Skip]` where appropriate to protect Cloudflare build quota. Vercel still handles the non-main Preview unless the change is ignored by `vercel.json`'s `ignoreCommand`.

## Production release boundary

After the owner accepts the exact PR head:

```text
merge/release to main
-> Vercel main Git deployment stays disabled
-> Cloudflare Production is the intended release target
```

**Critical:** the real release merge/commit must not accidentally include `[CF-Pages-Skip]`, `[Skip CI]`, or another Cloudflare skip prefix if the owner expects Cloudflare Production to deploy.

Do not merge merely to obtain a Preview.

## Repository validation Gate

Executable truth lives in `package.json`.

At the time of this policy update, `npm run verify:deploy` includes:

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
```

Vercel Preview must run that Gate before `npm run build`.

Cloudflare formal Git builds retain their repository-owned gate through `npm run build:cloudflare`.

Do not weaken a failing Gate to make a deployment green. Fix the product/data/test mismatch or explicitly revise the contract with evidence.

Full Chromium/WebKit Playwright, vendor-catalog network audits, URL/source probes, and other third-party-dependent checks remain on-demand unless deliberately promoted into the deterministic Gate.

## Preview identity

Canonical/indexed identity belongs to Cloudflare Production.

For Vercel Preview preserve:

- `PUBLIC_SEARCH_INDEXING=disabled`;
- `PUBLIC_SITE_URL=https://basemodel.pages.dev`;
- page/meta `noindex` behavior;
- `X-Robots-Tag: noindex` where provided by Vercel;
- canonical/hreflang pointing to Production, not the Preview host.

Because the repo is private, normal Vercel Preview URLs may require Vercel authentication. Connected Agents should generate a temporary share URL when the owner needs an anonymous click-through link. Treat it as ephemeral, not canonical.

## Cloudflare Direct Upload fallback

Use the repository-owned Direct Upload command/runbook when:

- Cloudflare-specific deployment behavior is under test;
- Vercel is unavailable or rate-limited;
- the owner explicitly requests a `pages.dev` Preview;
- a Cloudflare release issue cannot be reproduced on Vercel.

Direct Upload uses prebuilt output and does not require a Git-connected Cloudflare build, but it is still a platform deployment and remains subject to Cloudflare deployment/upload limits.

See:

- `direct-upload-preview-command.md`
- `direct-upload-preview-policy.md`
- `cloudflare-pages-deployment.md`

## Completion report

For website work, report the relevant boundaries separately:

```text
Change complete: yes / no
Repository Gate: passed / failed / not run
Vercel Preview: READY / ERROR / none
Preview URL / share URL: <actual URL or reason unavailable>
Exact Git head: <SHA>
Cloudflare Git-integrated Preview intentionally triggered: yes / no
Cloudflare Production changed: yes / no / unknown
Merged to main: yes / no
```

Do not conflate Preview success, PR merge, and Production deployment.

Do not infer the exact Cloudflare monthly build counter unless an authoritative account-level source is available.

## Cost / quota policy

The owner cares about hosted-build consumption, but no provider should be described as unlimited.

- ordinary Preview iteration should use Vercel and stay within current Vercel limits;
- Cloudflare Git Preview builds should not be spent merely to review a branch;
- Cloudflare Direct Upload is the fallback when a Cloudflare-hosted Preview is required;
- re-check current first-party Vercel/Cloudflare limits before quota/cost decisions.

If SSR, Pages Functions, Workers, server-side APIs, KV/D1/R2, or provider-specific runtime features are introduced, re-evaluate this split rather than assuming static-site rules still apply.

## GitHub Actions / Pages

GitHub Actions remains retired; do not add workflows “just in case.” Repository tests/scripts remain provider-neutral assets.

GitHub Pages remains retired; `/basemodel/` deployment compatibility and GitHub-Pages-specific base-path environment variables are not release requirements.

## Validated evidence

The first full Vercel pilot was PR #99 at exact head `674f60bb57b37cd712cc745bf8dcf1ce513b722f`.

Vercel deployment `dpl_E3NeYkTLnsgUJyfNVUtomUqpmMuJ` reached READY after the complete Gate passed, including 75 tests, V2 completion/adversarial/hardening audits, and a 392-page Astro build.

See `vercel-preview-migration-plan.md` for the full evidence record and private-Preview access mechanics.
