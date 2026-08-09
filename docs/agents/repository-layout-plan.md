# Repository layout and Cloudflare build-watch plan

Planned: **2026-08-09 15:40 +08:00**

Status: **approved design candidate; waiting for owner Cloudflare dashboard update before execution**.

## Why this plan exists

The goal is to improve repository readability for humans and coding Agents without moving the working Astro application merely for aesthetics, and without increasing Cloudflare Pages build consumption.

Astro's application source is already correctly rooted at the repository root: `src/`, `public/`, `package.json`, `astro.config.mjs` and `tsconfig.json` follow the normal Astro project shape. The repository should keep that boundary.

## Current high-level layout

```text
/
├─ src/                  Astro pages/components/content/domain logic
├─ public/               passthrough static assets
├─ scripts/              build, validation, audit and maintenance scripts
├─ e2e/                  Playwright browser regression tests
├─ demo-archive/         non-production fixtures/archive samples
├─ docs/agents/          current + historical Agent documentation mixed together
├─ reports/              generated audit output (gitignored)
├─ .github/              GitHub-native metadata / Dependabot
├─ AGENTS.md
├─ README.md
├─ package.json
├─ astro.config.mjs
├─ playwright.config.ts
└─ tsconfig.json
```

## Target layout

```text
/
├─ src/                  unchanged: production application source
├─ public/               unchanged: passthrough static assets
├─ scripts/              unchanged: repository-owned build/validation/audit tooling
├─ tests/
│  ├─ e2e/               Playwright specs moved from /e2e
│  └─ fixtures/
│     └─ demo-archive/    non-production fixtures moved from /demo-archive
├─ docs/
│  └─ agents/
│     ├─ README.md        Agent documentation index
│     ├─ LATEST.md        fixed latest handoff, timestamped
│     ├─ current/         authoritative current policy/runbooks/maps
│     └─ history/         dated/superseded migration and architecture records
├─ reports/              generated output, remains gitignored
├─ .github/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ astro.config.mjs
├─ playwright.config.ts
└─ tsconfig.json
```

## What will NOT move

To keep deployment risk low, do not move:

- `src/`;
- `public/`;
- `scripts/`;
- `package.json` / lockfile;
- `astro.config.mjs`;
- `tsconfig.json`;
- `.node-version`;
- Cloudflare build entrypoint or deterministic deployment checks.

This avoids turning a readability cleanup into a deployment architecture migration.

## Planned mechanical changes

1. Move `e2e/*` -> `tests/e2e/*`.
2. Set Playwright `testDir` to `./tests/e2e`.
3. Move `demo-archive/*` -> `tests/fixtures/demo-archive/*`.
4. Split `docs/agents/` into `current/` and `history/` while preserving `README.md` and `LATEST.md` as stable entrypoints.
5. Update internal documentation links and repository map.
6. Run repository-local validation appropriate to the changed files.
7. Refresh `docs/agents/LATEST.md` with a completion timestamp and final map.

## Cloudflare Build Watch Paths — transition configuration

Before the repository moves are executed, temporarily use this superset so both the old and new non-production paths are ignored:

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

Why the old paths remain temporarily: a Git move is represented as delete-old + add-new. If only the destination is excluded, deleting `e2e/*` or `demo-archive/*` can still make the push look deployment-sensitive.

## Cloudflare Build Watch Paths — final configuration

After the migration is complete and the old directories are absent, simplify to:

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

Keep `Include: *`. Production source, dependency manifests, build scripts and config must continue to trigger Cloudflare.

## Build-budget behavior

- Documentation-only and Agent-policy changes should be skipped by Build Watch Paths.
- Intermediate organizational commits may also use `[CF-Pages-Skip]`.
- A future change touching production source/build semantics must still receive a real exact-head Preview before merge.
- Do not broaden exclusions to `src/*`, `public/*`, `scripts/*`, `package*.json`, `astro.config.mjs`, `tsconfig*` or `.node-version`.

## Completion criteria

The re-layout is complete only when:

- old `e2e/` and `demo-archive/` paths are gone;
- Playwright points to `tests/e2e/`;
- fixture references resolve from `tests/fixtures/`;
- current and historical Agent docs are clearly separated;
- repository-local validation passes;
- final Cloudflare exclusions are recorded in `LATEST.md`;
- `LATEST.md` has a new completion timestamp.