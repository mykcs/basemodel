# Vercel Git deployment workflow — Preview + Production

Status: **adopted for both non-main Preview and `main` Production**

Last reviewed: **2026-08-12**

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

`vercel.json` owns the build command, same-branch auto-cancellation and ignored-path optimization. `main` must not be disabled.

## Preview contract

- exact-head Gate/build must really run for runtime/deployment changes;
- `VERCEL_ENV=preview` makes Preview non-indexable in repository code;
- canonical/hreflang use the stable Production identity;
- private Preview protection stays enabled; generate a temporary share URL when owner click-through requires it;
- READY alone is not product acceptance.

## Production contract

A deploy-relevant merge to `main` is expected to create a Vercel Production deployment. Verify the deployment corresponds to the merge head and then inspect the public project domain separately.

While legacy Cloudflare Pages Git integration exists, use `[CF-Pages-Skip]` on the merge so Production is built only by Vercel.

## Build-budget workflow

The main saving comes from reducing pushes, not from assuming canceled jobs are free.

For ordinary work:

```text
complete coherent local/Agent edit
-> one atomic multi-file branch push
-> one exact-head Preview
-> inspect logs + real route
-> at most one batched corrective push
-> one accepted merge / Production build
```

Technical safeguards:

- `github.autoJobCancelation: true` cancels an older same-branch job when a newer push supersedes it;
- `ignoreCommand` calls `scripts/vercel-ignore-build.mjs`;
- the ignore script compares the current commit to `VERCEL_GIT_PREVIOUS_SHA`, which is the previous successful deployment SHA exposed by Vercel when an Ignored Build Step is configured;
- Agent/docs-only paths are skipped;
- source, public assets, scripts, tests and build/provider config trigger a real build;
- missing history or classification failure runs the build rather than silently skipping it.

Agent/tool guidance:

- use one branch/PR for one coherent feature;
- use a worktree or one Git data API commit for multi-file changes rather than sequential Contents API writes;
- do not recreate a PR because the first implementation needs a fix;
- stabilize a parent before extending a stacked child;
- if multiple accepted PRs must ship together, consider one explicit integration/release head only when traceability and rollback remain clean;
- do not push merely to obtain a new badge or URL.

## Pilot evidence

The original PR #99 pilot proved that Vercel can clone the private repository, run the full deterministic Gate, build the Astro static site and expose deployment/build state to connected Agent tooling. Preserve that evidence; the ownership decision has simply expanded from Preview-only to Preview + Production.

## Quota behavior

Vercel is not unlimited. Provider limits and billing semantics are time-sensitive; verify current first-party limits when they affect a decision.

A push may still create a deployment record even when an older job is canceled or an ignored-build step stops execution. Therefore completion reports should distinguish total triggers from `READY`, `ERROR`, `CANCELED` and ignored/skipped outcomes when live provider data is available.

If Vercel becomes a repeated blocker, re-open provider ownership from measured evidence rather than automatically restoring Cloudflare builds.
