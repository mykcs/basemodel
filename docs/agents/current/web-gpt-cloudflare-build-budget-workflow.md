# Web-GPT + Cloudflare build-budget workflow — legacy/fallback only

Last reviewed: **2026-08-12 16:44 +08:00**
Status: **Cloudflare Pages Build is removed from the normal Preview and Production workflow. This file only preserves Cloudflare fallback/build-budget rules.**

## Current authority

```text
non-main -> Vercel Preview
main     -> Vercel Production -> https://basemodel-preview.vercel.app
Cloudflare Pages -> frozen legacy rollback
Cloudflare Pages Build -> 0 for normal work/releases
Direct Upload / Workers shadow -> Cloudflare-specific fallback only
```

Read `../LATEST.md`, `hosting-architecture.md`, `vercel-preview-migration-plan.md`, and `deployment-policy.md` before any deployment change.

## Zero-build rule

- Do not intentionally trigger a Cloudflare Pages Git Preview or Production Build unless the owner has first been told why Cloudflare-specific execution is necessary and explicitly authorizes it.
- Until the account-side Pages Git integration is disabled, use `[CF-Pages-Skip]` on branch and merge/release commits.
- Do not keep `basemodel.pages.dev` synchronized after Vercel releases; it is a frozen rollback snapshot.
- Do not claim an exact remaining Cloudflare build counter without authoritative account evidence.

## Direct Upload fallback

When Cloudflare-specific behavior must be reproduced, prefer the maintained `npm run preview:cloudflare` / Direct Upload runbook. It uploads a prebuilt artifact and does not justify falling back to a Git-connected Pages Build when credentials/tooling are unavailable.

Completion reports distinguish Vercel Preview, Vercel Production, Direct Upload, Cloudflare Git Build, and rollback state.

The previous rule saying the final release commit must be non-skip because Pages Production should deploy is **superseded**. The current release commit should keep the Cloudflare skip prefix while legacy Pages Git integration exists so Vercel is the only normal release builder.
