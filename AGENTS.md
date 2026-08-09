# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone.

## Required reading

Before changing hosting, deployment, URL/SEO behavior, repository automation, dependency automation, or release validation, read these current documents first:

1. [`docs/agents/deployment-policy.md`](docs/agents/deployment-policy.md) — authoritative steady-state architecture and validation policy.
2. [`docs/agents/cloudflare-pages-deployment.md`](docs/agents/cloudflare-pages-deployment.md) — current Cloudflare operational runbook.
3. [`docs/agents/README.md`](docs/agents/README.md) — index separating current operations from historical records.

Older files dated 2026-08-08/09 document migration history. They are evidence of what happened, not instructions to restore the previous architecture.

## Current architecture

```text
GitHub -> Cloudflare Pages
```

- GitHub is the canonical source repository, Git history, branch/PR surface, and Dependabot host.
- Cloudflare Pages owns Preview, Production, build execution, deployment-blocking validation, and hosting.
- GitHub Actions is intentionally retired. `.github/workflows/` should remain empty/absent unless the repository owner explicitly decides to reintroduce an automated CI platform.
- GitHub Pages is intentionally retired. Do not restore `/basemodel/` deployment compatibility merely because historical documents mention it.
- Cloudflare Production serves from `/` and is the canonical/indexed identity.
- Cloudflare Preview deployments are `noindex`; `noindex` is not access control.
- The Cloudflare dashboard Build command is `npm run build:cloudflare`; keep real build logic in the repository.

## Validation rules

Cloudflare automated blocking checks must stay deterministic and repository-local. The current deployment gate is `npm run verify:deploy`, followed by `npm run build`.

Keep, but do not automatically add to every Cloudflare build without a deliberate reliability decision:

- full Chromium/WebKit Playwright E2E;
- vendor-catalog network audits;
- URL/source-health network probes;
- monitoring/reporting tasks whose success depends on third parties.

Run those on demand for major UI, routing/i18n, Astro/framework, browser compatibility, or data-source maintenance work.

## Operating rules

- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- For deployment-sensitive PRs, verify the Cloudflare Preview for the exact PR head SHA before merge, then verify Production after merge.
- Read the Cloudflare GitHub App PR comment before asking the owner for dashboard screenshots; compare any reported commit with the actual PR head SHA because comments can arrive out of order.
- Preserve Preview `noindex`, stable Production canonical identity, sitemap/robots correctness, bilingual hreflang, OG/JSON-LD identity, and root-relative routing.
- Do not reintroduce `PUBLIC_BASE_PATH`, `PUBLIC_CANONICAL_SITE_URL`, GitHub Pages workflows, Actions runner containers, required Actions checks, or `github-actions` Dependabot updates without an explicit owner decision.
- Keep `@types/node` on the same major as `.node-version`; Node, Astro, React, TypeScript, and Vitest majors are deliberate migration work rather than routine Dependabot churn.
- Batch related GitHub edits. Avoid no-op commits because every normal branch push may consume a Cloudflare Pages build.
- Fetch the latest blob/ref state before sequential writes to avoid conflict-generated commits.
- Keep Astro 7 `compressHTML: true` unless inline whitespace has been explicitly audited and migrated; a regression test protects this compatibility contract.
- Update `docs/agents/deployment-policy.md` and the Cloudflare runbook when architecture or validation boundaries change materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
