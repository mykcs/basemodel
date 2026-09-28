# Private Production monitor retirement — 2026-09-28

## Why this changed

BaseModel Production is now intentionally protected by Vercel Authentication. Two older monitoring paths still assumed the site was public:

- a borrowed GitHub Actions WebKit/Lighthouse harness in `mykcs/colab-web`;
- `cloudflare/production-smoke/`, a scheduled unauthenticated Worker.

Once Production became private, unauthenticated requests were redirected to the Vercel login surface. Those probes could therefore report false product failures or benchmark the login page while still ending on an HTTP 200 response.

## Current contract

- Required Public PR CI owns deterministic and browser acceptance on the exact PR head.
- The explicit Vercel final gate owns exact-head provider build/deploy acceptance.
- Vercel Production publishes the accepted `main` tree behind access protection.
- Post-merge verification uses Vercel deployment identity/state; page inspection uses authenticated access when needed.
- Production emits `noindex` / crawler-disallow behavior while private.
- There is no anonymous external Production monitor.

The old cross-repository monitor and Cloudflare monitor are retired, not migrated to a bypass secret. Historical evidence remains in Git history and dated history documents.

## Re-entry rule

If Production becomes public again, do not resurrect either monitor automatically. Re-evaluate whether an external black-box monitor is useful, keep any active monitoring inside the owning project/provider boundary, and explicitly distinguish provider-login pages from product HTML.
