# Latest Agent handoff

Last updated: **2026-08-09 15:40 +08:00**

Status: **planning complete; repository re-layout not yet executed**.

This is the stable first-stop file for future coding Agents. Read this before dated migration/history notes.

## Current deployment state

- Source of truth: GitHub `mykcs/basemodel`.
- Hosting/build: Cloudflare Pages project `basemodel`.
- Production branch: `main`.
- Cloudflare build command: `npm run build:cloudflare`.
- Build output: `dist`.
- Cloudflare Root directory: repository root.
- GitHub Actions and GitHub Pages are intentionally retired for this repository.

## Current Cloudflare Build Watch Paths

Verified from the Cloudflare dashboard on 2026-08-09:

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
playwright.config.ts
```

## Pending repository-layout work

The Astro application itself is already in the conventional project root and should stay there. The planned cleanup is intentionally limited to auxiliary structure:

- keep `src/`, `public/`, `scripts/`, `package.json`, `astro.config.mjs`, `tsconfig.json`, `.node-version` and deployment logic where they are;
- move browser tests from `e2e/` to `tests/e2e/`;
- move `demo-archive/` fixtures to `tests/fixtures/demo-archive/`;
- separate current Agent guidance from dated history under `docs/agents/`;
- keep this file at the fixed path `docs/agents/LATEST.md` and refresh its timestamp/status after meaningful architecture or repository-layout changes.

The detailed transition plan is in [`repository-layout-plan.md`](./repository-layout-plan.md).

## Safety gate before execution

Do **not** execute the repository moves until the owner confirms the transitional Cloudflare exclusion list from `repository-layout-plan.md` has been entered. The transition list temporarily covers both old and new test/fixture paths so organizational commits do not spend Pages builds unnecessarily.

After the re-layout is complete, update this file with the completion timestamp, final directory map, final Build Watch Paths and verification result.