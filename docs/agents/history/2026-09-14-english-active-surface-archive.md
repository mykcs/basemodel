# English active-surface archive — 2026-09-14

Status: accepted development-baseline change; English source retained, not deleted.

## Owner intent

During the current high-frequency BaseModel development cycle, `main` is still a development baseline rather than a formal public-release milestone. The owner asked to stop maintaining English as an active runtime surface for now, without deleting the existing English work and without adding a separate "fast development mode".

## Frozen experiment

Control and candidate use the same repository base:

`9f7333f7e21744f6015dc1bcff1ee20d5acf3d20`

Control keeps `src/pages/en/**` active. Candidate moves the exact English bytes to inert `.archive` files under `docs/archive/site-en/src/pages/en/`, keeps a manifest of original paths and Git blob SHAs, and makes Chinese the only active locale.

Three runs were executed serially on the same Mac and dependency tree.
## Measured result

| Gate | Control | Chinese-only candidate | Change |
| --- | ---: | ---: | ---: |
| `npm run check` | 31.91 / 31.44 / 31.36 s, median **31.44 s** | 29.88 / 30.99 / 29.56 s, median **29.88 s** | ~5% faster |
| `npm run build` | 4.27 / 4.50 / 4.16 s, median **4.27 s** | 3.14 / 3.04 / 3.07 s, median **3.07 s** | ~28% faster |
| static routes | **510** | **262** | ~49% fewer |
| active Astro diagnostics population | **631 files** before archive work | **569 files** after the final archive test was added | smaller, but wall-clock remains check-dominated |

Final candidate acceptance also passed:

- `npm run verify:deploy` — PASS, 50.08 s on Node 24;
- `npm run build` — PASS, 262 routes and no `dist/en`;
- standard Chromium UI gate — 195/195 PASS;
- `npm run test:ui:all` — 388/388 PASS across Chromium + WebKit;
- archive integrity — 63/63 entries byte-identical to their recorded Git blob SHA.
## Important failed approach

Simply moving `.astro` files from `src/pages/en/` into `docs/archive/` is **not** enough. `astro check` still discovers those files repository-wide, so the first archive attempt produced 185 broken-import diagnostics and retained the English typecheck population.

The safe archive therefore keeps the file bytes unchanged but adds a trailing `.archive` suffix. English-content tests may read those inert files directly, while runtime/build/browser planners must not treat them as deployed pages.

## Current responsibility split

- Active product: Chinese routes only.
- Retained English evidence: `docs/archive/site-en/` plus `MANIFEST.tsv`.
- Old `/en/**` links: temporary non-permanent Vercel fallback to the matching Chinese path.
- Runtime metadata/sitemap/header: advertise Chinese only.
- Restoration: remove `.archive`, restore `src/pages/en/`, locale routing, metadata, and bilingual acceptance, then rerun full deterministic and browser gates.

Do not describe this as deleting English or as a formal product launch. The measured benefit is real for build/route/browser surface, but it does **not** solve the dominant full-project Astro-check cost.

## Hosted-gate follow-up

Public PR CI caught one contract that local `test:ui:all` does not own: the dedicated Lab Playwright config still ran six `/en/lab/` cases after English left the active runtime. The ordinary canonical Chromium shard itself passed; only the auxiliary Lab tail failed with expected 404s.

The correction kept the full active Lab visual matrix rather than weakening it: `/lab/` still runs at 390, 768, and 1440 px in both light and dark, for six active cases. Current deployment/hosting policy and CI logging now call this the **6-case active-Lab gate**. Historical documents that accurately describe the former bilingual 12-case gate remain unchanged.

Reusable lesson: when removing an active route class, inventory auxiliary/provider-owned browser suites as well as `npm run test:ui` / `test:ui:all`; a separately configured tail can retain stale route assumptions even when the canonical matrix is already clean.
