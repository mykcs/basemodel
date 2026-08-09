# Latest Agent handoff

Last updated: **2026-08-09 16:39 +08:00**

Status: **steady state complete — repository re-layout and final Cloudflare Build Watch Paths are both finished and confirmed**.

This is the stable first-stop file for future coding Agents. Read it before historical migration notes.

## Current deployment state

- Source of truth: GitHub `mykcs/basemodel`.
- Hosting/build: Cloudflare Pages project `basemodel`.
- Production branch: `main`.
- Cloudflare build command: `npm run build:cloudflare`.
- Build output: `dist`.
- Cloudflare Root directory: repository root.
- GitHub Actions and GitHub Pages are intentionally retired.

## Current repository layout

```text
src/                         production application/content/domain logic
public/                      production static assets
scripts/                     build, validation, audit and maintenance tooling
tests/e2e/                   Playwright browser regression tests
tests/fixtures/demo-archive/ non-production demo fixtures
docs/agents/current/         authoritative current Agent policy/runbooks/maps
docs/agents/history/         migration and superseded architecture records
docs/agents/README.md        Agent documentation index
docs/agents/LATEST.md        fixed latest handoff
```

The production Astro root, `src/`, `public/`, `scripts/`, dependency manifests and build configuration were deliberately not moved.

## Agent reading order

1. `/AGENTS.md`
2. `docs/agents/LATEST.md`
3. `docs/agents/current/deployment-policy.md`
4. `docs/agents/current/repository-map.md`
5. `docs/agents/current/cloudflare-pages-deployment.md`
6. `package.json` and task-specific source files

## Repository re-layout completed

PR: **#57 — Reorganize tests and Agent documentation**

Completed changes:

- `e2e/*` -> `tests/e2e/*`;
- Playwright `testDir` -> `./tests/e2e`;
- `demo-archive/*` -> `tests/fixtures/demo-archive/*`;
- current Agent docs -> `docs/agents/current/`;
- dated/retired/migration Agent docs -> `docs/agents/history/`;
- root `AGENTS.md`, `README.md`, Agent index and repository map updated for new paths;
- the repository-layout plan retained under history as the execution record.

## Verification evidence

Verified during the migration and on merged `main`:

- old `e2e/` and `demo-archive/` paths are gone;
- `tests/e2e/` and `tests/fixtures/demo-archive/` contain the moved files;
- current deployment policy/runbooks live under `docs/agents/current/`;
- `playwright.config.ts` uses `testDir: './tests/e2e'`;
- production `src/`, `public/`, `scripts/`, dependency manifests and Astro build configuration were not changed by the re-layout.

The re-layout was organizational and did not change runtime website semantics.

## Cloudflare Build Watch Paths — final confirmed state

The repository owner saved these settings in the Cloudflare dashboard and read them back successfully on **2026-08-09**:

```text
Include:
*

Exclude:
docs/*
AGENTS.md
README.md
.github/*
reports/*
tests/e2e/*
tests/fixtures/*
playwright.config.ts
```

The migration-only exclusions for the former `e2e/*` and `demo-archive/*` paths have been removed.

Do not exclude production source, `public/*`, `scripts/*`, dependency manifests, Astro/TypeScript configuration or `.node-version`.

No test commit or extra Cloudflare build was intentionally used to validate the final dashboard cleanup; the settings were confirmed by saving and reading them back in the dashboard.

## Current steady-state rule

For normal deployment-sensitive work:

```text
one logical task
-> batched intermediate work (skip deployment when appropriate)
-> one meaningful final-head Preview
-> merge
-> one Production build
```

Documentation, Agent files, generated reports, browser-only E2E tests and fixtures are excluded from Pages builds by the final watch-path configuration.

## Pending repository-layout / Build Watch work

**None.** The 2026-08-09 repository-layout and Cloudflare Build Watch migration is closed.

## Historical context

Completed migration/incident records live under `docs/agents/history/`. They are evidence, not current operating policy. Current rules live under `docs/agents/current/` and this fixed handoff file.
