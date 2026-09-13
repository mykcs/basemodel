# Fast local deterministic gate experiment — 2026-09-13

## Question
Can ordinary BaseModel leaf-page iteration get trustworthy local deterministic feedback in <=10 s without weakening final merge/release acceptance?

## Frozen control
- Repository: `mykcs/basemodel`
- Base/control SHA: `65cc9173ff7214be98ac7c3fc7994162fb1235c7`
- Typical sample: `src/pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro`
- Full `npm run check`: ~31 s on the same Mac environment; 612 files.
- Final full `npm run verify:deploy`: 44.71 s on the candidate tree.
- Final static `npm run build`: 4.73 s; 506 routes; heading and brand-link audits PASS.

## Tested mechanisms
- `astro check --watch`: full-project incremental diagnostics remained correct, but an injected type error and its recovery each took about 13.1–13.2 s after the initial full pass. Better than a cold 31 s check, but above the <=10 s target.
- Scoped `astro check --tsconfig <generated>` for one concrete page: 2.96 s and correctly caught page-level type/import/prop diagnostics.
- Cold-archive page removal was tested separately and did not produce a meaningful check-time win, so this experiment does not depend on archiving pages.

## Adopted development mechanism
`npm run verify:fast` is a development-only planner. It admits at most four existing concrete `src/pages/**/*.astro` leaf pages, plus docs/source-test companions. It runs scoped Astro diagnostics, changed-page ESLint, the complete Vitest suite, CSS architecture, strict copy, Reader Contract, and human-feedback audits. Shared components, data/content, dynamic routes, page deletes/renames, unknown files, package/config changes, and gate-owner changes fail closed to `npm run verify:deploy`.

## Measurements
Three complete leaf-page `verify:fast` runs on the final implementation were 9.33 s, 8.49 s, and 8.43 s; median **8.49 s**. Against the 44.71 s full deterministic Gate, the iterative loop is about **5.3× faster** while retaining complete Vitest and the cheap deterministic audits. The <=10 s median acceptance target therefore passed.

## Acceptance and safety evidence
- Fast-gate/planner regression tests: 12/12 PASS, including shared/data/dynamic/gate-owner and missing-page fail-closed cases.
- Candidate `npm run verify:deploy`: PASS, 44.71 s.
- Candidate `npm run build`: PASS, 4.73 s, 506/506 static routes audited.
- Public GitHub Actions and exact-head Vercel release authority remain on the full `verify:deploy` path; `verify:fast` is not referenced by release CI.

## Boundary
This is a fast **iteration** loop, not a weaker release Gate. Use it while editing proven leaf pages. Before merge/release, run the repository's normal full deterministic, build, browser/provider, and exact-head acceptance contracts. If the planner cannot prove the change is a bounded existing leaf page, it deliberately pays the full cost.
