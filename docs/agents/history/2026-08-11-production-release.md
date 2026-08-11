# Production release — 2026-08-11

This release publishes the validated SEED learning/reproduction stack merged through PR #115, including its dependency chain (#104, #106, #112), to the canonical Cloudflare Pages Production site.

Release boundary:
- canonical source: `main`
- Production: `https://basemodel.pages.dev`
- Vercel `main` deployment remains disabled
- PR #116 is intentionally not included because it conflicts with the older #112 stylesheet path and requires an explicit UI conflict-resolution pass rather than a blind merge

This commit intentionally has no Cloudflare skip prefix so it is the single Production build trigger for this release.
