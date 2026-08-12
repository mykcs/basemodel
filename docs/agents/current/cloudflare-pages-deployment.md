# Cloudflare Pages legacy rollback runbook

Last reviewed: **2026-08-12 16:44 +08:00**

Status: **legacy/frozen. Vercel owns Preview and Production. Cloudflare Pages is retained only as the last known-good rollback snapshot and Cloudflare-specific diagnostic surface.**

## Current boundary

```text
Vercel Preview + Production = active deployment system
https://basemodel-preview.vercel.app = current canonical target
https://basemodel.pages.dev = legacy snapshot / rollback evidence
Cloudflare Pages Build = 0 for normal work/releases
```

Do not intentionally trigger a Pages Git build merely to keep the old host synchronized.

## Until Pages Git integration is disabled

Use `[CF-Pages-Skip]` on branch and merge/release commits. The current ChatGPT/Vercel/GitHub execution surface does not expose Cloudflare account write controls, so disabling automatic Pages builds remains an account-side external boundary.

Do not work around that boundary by spending a build. If a future Agent gains Cloudflare account write access, the preferred cleanup is to disable automatic Git deployments while retaining the last good deployment for rollback.

## Redirect / retirement

The legacy `pages.dev` hostname may remain reachable. Redirecting or retiring it is a separate provider/SEO action. Do not spend a Pages Build to add a redirect without explicitly telling the owner why and obtaining permission.

If a provider-side redirect can be configured without a build, verify it before using it. Keep rollback until Vercel Production is stable.

## Fallback tooling

`npm run build:cloudflare`, `npm run preview:cloudflare`, Direct Upload docs and the Workers shadow are retained so a Cloudflare-specific issue can still be reproduced. They are not normal release paths.

Repository validation remains `npm run verify:deploy`; never weaken it to make a fallback deploy pass.

## Security

Never commit Cloudflare API tokens or put secrets in `PUBLIC_*`. Execution environments own credential injection.
