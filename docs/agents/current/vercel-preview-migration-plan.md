# Vercel Git deployment workflow — Preview + Production

Status: **adopted for both non-main Preview and `main` Production**

Last reviewed: **2026-08-12 16:44 +08:00**

## Architecture

```text
GitHub branch/PR -> Vercel `basemodel-preview` Preview -> verify:deploy -> build -> inspect
GitHub main      -> Vercel `basemodel-preview` Production -> verify:deploy -> build -> verify public site
```

Project:
- team `wangrui92-team` (`team_Vz2qUrJvqqw5RAIgGQwNtbkR`)
- project `basemodel-preview` (`prj_UQRbjvnik0lW21LrzotTLPhKkgAK`)
- framework Astro/static
- Production project domain `https://basemodel-preview.vercel.app`

`vercel.json` owns the build command and ignored-path optimization. `main` must not be disabled.

## Preview contract

- exact-head Gate/build must really run for runtime/deployment changes;
- `VERCEL_ENV=preview` makes Preview non-indexable in repository code;
- canonical/hreflang use the stable Production identity;
- private Preview protection stays enabled; generate a temporary share URL when owner click-through requires it;
- READY alone is not product acceptance.

## Production contract

A merge to `main` is expected to create a Vercel Production deployment. Verify the deployment corresponds to the merge head and then inspect the public project domain separately.

While legacy Cloudflare Pages Git integration exists, use `[CF-Pages-Skip]` on the merge so Production is built only by Vercel.

## Pilot evidence

The original PR #99 pilot proved that Vercel can clone the private repository, run the full deterministic Gate, build the Astro static site and expose deployment/build state to connected Agent tooling. Preserve that evidence; the ownership decision has simply expanded from Preview-only to Preview + Production.

## Quota behavior

Vercel is not unlimited. Batch coherent edits and avoid speculative/no-op push loops. Provider rate limits are time-sensitive; verify current first-party limits when they affect a decision.

If Vercel becomes a repeated blocker, re-open provider ownership from measured evidence rather than automatically restoring Cloudflare builds.
