# GitHub Actions and GitHub Pages retirement decision

Date: 2026-08-09

## Decision

After Cloudflare Pages Preview and Production had already been proven as the independent deployment path, the repository owner chose to stop using GitHub Actions entirely and retire GitHub Pages rather than maintain a second provider path.

The target architecture became:

```text
GitHub -> Cloudflare Pages
```

## What was removed

All four workflow files present on `main` at the time of the decision were retired:

- `validate.yml` — static checks plus change-aware Playwright jobs;
- `deploy.yml` — GitHub Pages deployment gated by Validate Atlas;
- `update-data.yml` — scheduled/manual data health checks;
- `vendor-catalog-audit.yml` — scheduled/manual external vendor catalog checks.

The executable quality capabilities were not deleted. Static checks moved to/continued in the Cloudflare repository-owned build gate; Playwright and external audit scripts remain available on demand.

## Why GitHub Pages was retired

The fallback copy was not free architecturally. Keeping it current required GitHub Actions compute and also required permanent support for a second deployment base (`/basemodel/`), duplicate-host SEO behavior, Pages-specific environment variables/tests, Actions dependency maintenance, and two deployment states for future Agents to reason about.

For this project, those ongoing costs outweighed the value of a stale-or-quota-dependent fallback mirror once Cloudflare was already the normal deploy path.

## New validation boundary

Cloudflare Preview/Production blocks on deterministic repository-local checks:

```text
check
validate
audit:semantic
audit:claims
audit:freshness
Vitest
Astro production build
```

The following stay outside every deployment because they are expensive, third-party-dependent, monitoring-oriented, or primarily report-generating:

```text
Playwright Chromium/WebKit E2E
vendor catalog network audit
URL/source-health probes
coverage report
```

## History preservation

Older documents remain in `docs/agents/` to explain the quota incident, migration, previous dual-hosting rationale, CI hardening, and cost experiments. Current policy documents explicitly override those historical instructions so future Agents do not accidentally restore Actions or GitHub Pages.
