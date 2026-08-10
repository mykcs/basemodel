# Web-GPT + Cloudflare build-budget workflow — fallback role

Last reviewed: **2026-08-11 01:32 +08:00**
Status: **Superseded as the ordinary Preview default; retained for Cloudflare fallback / Production guidance**

## Authority change

This file originally defined Cloudflare Direct Upload as the normal Preview path. That was the best validated workflow before the Vercel pilot.

The 2026-08-11 pilot has now changed the ordinary Preview architecture.

Current authority:

```text
ordinary non-main Preview
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build

main / Production
  -> Cloudflare Pages
  -> https://basemodel.pages.dev

Cloudflare Direct Upload
  -> fallback / Cloudflare-specific Preview
```

For normal day-to-day Preview behavior, read first:

- `../LATEST.md`
- `vercel-preview-migration-plan.md`
- `deployment-policy.md`

This file remains current only for the Cloudflare build-budget principles below.

## Cloudflare build-budget principles that still apply

- Cloudflare Pages Git-build quota remains a real constraint.
- Do not intentionally trigger a Cloudflare Git Preview merely to obtain a routine branch review URL while Vercel is available.
- Intermediate/non-release Git synchronization may use `[CF-Pages-Skip]` where appropriate.
- Cloudflare Direct Upload remains a valid prebuilt Preview path when Cloudflare-specific fidelity is needed or Vercel is unavailable.
- A real accepted release to `main` is allowed to trigger the intended Cloudflare Production build.
- Do not claim an exact monthly Cloudflare build-counter value unless an authoritative account-level source is available.

## Critical release distinction

Skip-prefixed commits are useful during non-main iteration, but the final merge/release commit must **not** accidentally contain `[CF-Pages-Skip]`, `[Skip CI]`, or another Cloudflare skip prefix when the owner expects Production to update.

The desired release flow is:

```text
Vercel exact-head Preview accepted
-> merge to main with a normal semantic message
-> Vercel main Git deployment remains disabled
-> Cloudflare Production deploys
```

Do not merge merely to obtain a Preview.

## Cloudflare Direct Upload fallback

When Cloudflare-specific Preview behavior is required, use the repository-owned implementation rather than an ad-hoc Wrangler command:

- `direct-upload-preview-command.md`
- `direct-upload-preview-policy.md`
- `cloudflare-pages-deployment.md`

The intended fallback sequence is:

```text
repository Gate + production build
-> Direct Upload prebuilt dist/
-> capture pages.dev Preview URL
-> inspect real Cloudflare Preview
-> report whether a Git-integrated Cloudflare Build was triggered
```

Direct Upload avoids the Git-connected build step but remains a Pages deployment and is subject to Cloudflare platform/upload/deployment limits.

## Why Vercel replaced Direct Upload as the ordinary first choice

The Cloudflare design itself was not the problem. The recurring problem was that web-based ChatGPT/Agent sessions did not always expose a writable Wrangler/Cloudflare credential path. That sometimes forced a fallback to a Git-integrated Cloudflare Preview merely to obtain a public URL.

The Vercel pilot proved a better Agent loop for this repository:

- GitHub branch -> Vercel Preview automatically;
- full repository `verify:deploy` Gate preserved;
- deployment/build logs readable from the connected Vercel capability;
- exact Preview state visible in GitHub;
- temporary share URL can be generated for protected private-repo Previews;
- Vercel Git deployment for `main` can be disabled so Production remains Cloudflare-only.

The full evidence is in `vercel-preview-migration-plan.md`.

## Completion reporting for Cloudflare-specific work

When Cloudflare is actually involved, report separately:

```text
Cloudflare Direct Upload used: yes/no
Cloudflare Git-integrated Preview intentionally triggered: yes/no
Cloudflare Production changed: yes/no/unknown
Preview URL: <actual pages.dev URL if created>
Exact Git head: <SHA>
```

Do not conflate a Vercel Preview, Cloudflare Direct Upload Preview, and Cloudflare Production deployment.
