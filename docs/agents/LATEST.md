# Latest Agent handoff

Last updated: **2026-08-09 16:20 +08:00**

Status: **repository re-layout complete on PR #57; Cloudflare Build Watch Paths still intentionally in transitional superset until the owner removes obsolete old-path entries**.

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

Executed changes:

- `e2e/*` -> `tests/e2e/*`;
- Playwright `testDir` -> `./tests/e2e`;
- `demo-archive/*` -> `tests/fixtures/demo-archive/*`;
- current Agent docs -> `docs/agents/current/`;
- dated/retired/migration Agent docs -> `docs/agents/history/`;
- root `AGENTS.md`, `README.md`, Agent index and repository map updated for new paths;
- `repository-layout-plan.md` retained under history as the execution record.

## Verification evidence

Verified on the PR branch before merge:

- old `e2e/` path returns absent and `tests/e2e/` exists with the same spec blobs;
- old `demo-archive/` path returns absent and `tests/fixtures/demo-archive/` exists with the same fixture blobs;
- old `docs/agents/deployment-policy.md` path is absent and `docs/agents/current/deployment-policy.md` exists;
- `playwright.config.ts` contains `testDir: './tests/e2e'`;
- GitHub main→branch compare shows production `src/`, `public/`, `scripts/`, package/lock files and Astro build configuration are untouched.

This was an organizational change to non-production paths. No runtime/production source semantics changed, so a Cloudflare Preview/build is intentionally not required for this PR.

## Cloudflare Build Watch Paths — currently configured transition state

The owner confirmed this transitional superset before execution:

```text
Include:
*

Exclude:
docs/*
AGENTS.md
README.md
.github/*
reports/*
e2e/*
demo-archive/*
tests/e2e/*
tests/fixtures/*
playwright.config.ts
```

The old-path entries `e2e/*` and `demo-archive/*` are now obsolete in the repository but should remain in Cloudflare until the owner performs the final dashboard cleanup.

## Cloudflare Build Watch Paths — final desired state

After cleanup, use:

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

Do not exclude production source, `public/*`, `scripts/*`, dependency manifests, Astro/TypeScript configuration or `.node-version`.

## Historical context

Completed migration/incident records live under `docs/agents/history/`. They are evidence, not current operating policy. Current rules live under `docs/agents/current/` and this fixed handoff file.
