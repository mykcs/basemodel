# Repository layout and Cloudflare build-watch plan — execution record

Planned: **2026-08-09 15:40 +08:00**  
Executed: **2026-08-09 16:18 +08:00**

Status: **repository re-layout executed; retained as historical decision record**.

## Design decision

The Astro application stays at the repository root. Moving `src/`, `public/`, package manifests or build configuration for cosmetic uniformity would add deployment risk without product value.

The cleanup was limited to auxiliary structure:

```text
/
├─ src/                         production application source
├─ public/                      production static assets
├─ scripts/                     build/validation/audit tooling
├─ tests/
│  ├─ e2e/                      Playwright specs (moved from /e2e)
│  └─ fixtures/
│     └─ demo-archive/           demo fixtures (moved from /demo-archive)
├─ docs/
│  └─ agents/
│     ├─ README.md
│     ├─ LATEST.md
│     ├─ current/                authoritative current policy/runbooks/maps
│     └─ history/                migration/superseded architecture records
├─ reports/                     generated output
├─ .github/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ astro.config.mjs
├─ playwright.config.ts
└─ tsconfig.json
```

## Mechanical changes executed

1. `e2e/*` -> `tests/e2e/*`.
2. `playwright.config.ts` now uses `testDir: './tests/e2e'`.
3. `demo-archive/*` -> `tests/fixtures/demo-archive/*`.
4. Current Agent policy/runbooks/maps -> `docs/agents/current/`.
5. Dated, retired and migration records -> `docs/agents/history/`.
6. Root `AGENTS.md`, `README.md`, Agent index and repository map were updated for the new paths.
7. `docs/agents/LATEST.md` remains the fixed handoff path.

## Cloudflare transition configuration used

Before execution, the owner confirmed this transitional superset was configured so both old and new non-production paths were ignored:

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

This avoids spending Pages builds on a Git move represented as delete-old + add-new.

## Intended durable configuration

After the owner removes now-obsolete old-path entries, the durable list is:

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

Keep `Include: *`. Do not exclude `src/*`, `public/*`, `scripts/*`, dependency manifests, Astro/TypeScript configuration or `.node-version`.

## Why this record is under history

This file describes a completed migration rather than a standing operating policy. Current rules live under `../current/`; the latest timestamped handoff remains `../LATEST.md`.
