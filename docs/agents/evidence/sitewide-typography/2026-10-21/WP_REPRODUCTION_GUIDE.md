# Typography: public OpenEVO reproduction guide

**Production component:** `src/components/OpenEvoSeedBenchmarksGuide.astro` used by `/research/seed-openevo/study/run/`.

## Actual defect and migration

The reproduction guide's 12 Gate instructions were displayed at ~11.52px, executable examples at ~10.24px, four-part repository explanations at ~10.56px, and short provenance labels under 10px. These are reader/operational instructions, not fixed-coordinate plot labels.

Migrate **16 existing component-owned font and weight roles** to the current `--type-*` and `--font-interface` tokens. The main instructions and gap explanation use 16px body; secondary repository descriptions and operating controls use 15px body-small; compact identifiers use 13px meta. Code remains monospace and now uses a legible 13px size. Preserve the existing `pre { overflow:auto }` boundary, mobile single-column flow, click/expand semantics, source links and authorizations. No new `!important` or shared/global style override.

Local narrow source inventory before/after:
- Direct un-tokenized `font-size` declarations: **15 → 1** (the remaining Hero 1rem is a stable body role).
- Literal-size `font:` shorthands: **1 → 0**.
- Markup and scientific/source content above `<style>` are **byte-identical** to the baseline.
- Existing code-shell `!important` geometry is unchanged; this patch adds none.

## Exact-code validation

- Branch source/test commit: `9f6c455d879a82ab468f4a58f9a17a01a54141ff`, based on #898 `2a0dc995`.
- `npm run verify:deploy`: **exit 0**, Node 24 hosted sandbox.
- `npm run build`: **exit 0**, 268 static pages, 73 figures, 130 tables, static Typography Audit PASS.
- `tests/e2e/typography-reproduction-guide.spec.ts`: **7/7 Chromium** and **7/7 WebKit**, 390/768/1440px × light/dark; computed family, size, line height, local code scroll and document overflow checked.
- Mutation of a real instruction to 9px and code to 10px is **rejected**, then accepted when styles are restored.
- Actually inspected cloud screenshots of the first mobile reproduction Gate and four-part desktop dark repository map; no new text collisions or document-wide horizontal scroll were observed.
- Cloud screenshot files are temporary evidence, not persistent CI artifacts. The integrated exact-head PR CI should upload fresh screenshots and be reviewed before the final Preview is accepted.

## Concurrency and remaining acceptance

The open #819 content PR adds an adjacent ResearchContentLifecycle section in this component without changing the present scoped CSS declarations; preserve this when subsequently reconciling ownership. Do not overwrite newer PR edits. Once integrated into #898, require **new exact-head Public CI** and Preview; independent green tests do not certify all 268 pages visually.

**Status:** scoped component repaired and cloud-validated; sitewide Typography classification, WebKit sitewide review and final Production acceptance remain incomplete. No Production change or PR merge is authorized by this work package.
