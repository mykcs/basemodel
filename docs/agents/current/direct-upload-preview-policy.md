# Cloudflare Direct Upload preview policy — fallback / Cloudflare-specific path

Last reviewed: **2026-08-12 16:44 +08:00**
Status: **Supported fallback only. Vercel owns ordinary Preview and Production.**

## Authority

```text
non-main -> Vercel Preview
main     -> Vercel Production -> https://basemodel-preview.vercel.app
Cloudflare Pages -> frozen legacy rollback
Cloudflare Direct Upload -> fallback / Cloudflare-specific Preview
```

For normal deployment behavior read `../LATEST.md`, `hosting-architecture.md`, `vercel-preview-migration-plan.md`, and `deployment-policy.md` first.

## When to use Direct Upload

Use it only when the acceptance question specifically requires Cloudflare Pages fidelity, an explicit `pages.dev` Preview, or a Cloudflare-specific reproduction that Vercel cannot answer. Do not use a Git-connected Cloudflare branch build merely because Direct Upload credentials are unavailable.

Prefer the maintained `npm run preview:cloudflare` command/runbook. Preserve non-production naming, `PUBLIC_SEARCH_INDEXING=disabled`, Preview `noindex`, and canonical/hreflang pointing to the current Vercel Production identity.

## Build-budget semantics

```text
static visitor request != Pages Git Build
Git-connected Pages deployment = may consume Pages Build quota
local/Agent build + Direct Upload = prebuilt Pages deployment, not a Git-connected build
```

Direct Upload is not broadly quota-free; it remains subject to Cloudflare platform/deployment/upload limits.

## Git and Production warning

While the legacy Pages Git integration exists, branch and merge/release commits should keep `[CF-Pages-Skip]`. A normal Vercel Production release must **not** intentionally wake the frozen Cloudflare Pages builder.

A Git-integrated Cloudflare Build is justified only when the property under test is specifically that build path or the owner explicitly authorizes the Cloudflare-specific execution after being told why it is needed.

## Completion report

Report repository Gate/build, Direct Upload result/URL, exact Git head, whether a Cloudflare Git Build was intentionally triggered, Vercel Production state, and whether the frozen Pages rollback changed.
