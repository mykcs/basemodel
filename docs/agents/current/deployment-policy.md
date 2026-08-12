# Deployment and validation policy

Last reviewed: **2026-08-12 16:44 +08:00**

## Authority

```text
GitHub = canonical source
non-main branches / PRs = Vercel Preview
main = Vercel Production
Production identity = https://basemodel-preview.vercel.app
Cloudflare Pages = frozen legacy rollback snapshot
Cloudflare Direct Upload / Workers shadow = Cloudflare-specific fallback only
```

GitHub Actions and GitHub Pages remain retired.

## Vercel responsibilities

Project `basemodel-preview` owns both deployment environments. Every deployable Preview/Production build uses:

`npm run verify:deploy && npm run build`

Do not disable Vercel Git deployment on `main`.

Preview acceptance requires exact-head provider success plus real route/metadata inspection. Preview is automatically `noindex` when `VERCEL_ENV=preview`; canonical/hreflang continue to point to the stable Production project domain.

## Production release

After the accepted exact head is current with `main`:

```text
merge to main
-> Vercel Production build
-> https://basemodel-preview.vercel.app
-> verify indexability, canonical/hreflang, robots/sitemap, representative routes and interaction
```

Until Cloudflare Pages Git integration is disabled externally, the merge/release commit should keep `[CF-Pages-Skip]`. This is the opposite of the old Pages release rule: Cloudflare is no longer supposed to wake up on release.

## Cloudflare zero-build policy

**Cloudflare Pages Build = 0** for ordinary work and releases. Do not intentionally trigger a Git-connected Pages build unless the owner has first been told why Cloudflare-specific execution is necessary and explicitly authorizes it.

The old Pages deployment remains a rollback/legacy snapshot. Direct Upload and Workers shadow remain optional diagnostic surfaces. Do not commit Cloudflare tokens.

## Repository Gate

Executable truth lives in `package.json`. `npm run verify:deploy` remains provider-neutral and includes the project’s deterministic checks/tests/audits. Do not weaken a valid Gate to get a green deployment.

Full browser suites and third-party/network audits remain on demand when the changed surface requires them.

## Completion report

Report separately:

```text
Repository Gate/build
Vercel Preview + exact head
Preview route/metadata acceptance
Merged to main
Vercel Production deployment + public verification
Cloudflare Pages Build intentionally triggered: yes/no
Cloudflare legacy rollback changed: yes/no/unknown
External provider boundary, if any
```

Do not infer exact provider quota counters without authoritative account evidence.
