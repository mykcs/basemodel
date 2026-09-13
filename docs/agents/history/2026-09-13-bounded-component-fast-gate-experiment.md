# Bounded-component fast local gate experiment — 2026-09-13

## Question
Can `verify:fast` cover a small shared Astro component without weakening final acceptance, while keeping median local feedback at or below the existing 10 s development target?

## Frozen benchmark
- Repository: `mykcs/basemodel`
- Base SHA: `1a3863780e06ade8397260505ce0d8716a31dea8`
- Component sample: `src/components/research/SeedOpenEvoProgressBriefing.astro` (713 lines)
- Proven direct runtime consumers: the Chinese and English briefing `index.astro` pages only.
- Existing final release authority remains `verify:deploy` + build + hosted browser/Vercel acceptance.

## Candidate mechanism
A changed Astro component may use fast mode only when repository-wide source scanning proves every runtime importer is a concrete non-dynamic Astro page. Any indirect/non-page importer, global component, unknown source, deleted path, dynamic route, data/config change, or wider graph fails closed to `verify:deploy`.
The scoped Astro diagnostics include the changed component plus all proven page consumers. ESLint, complete Vitest, CSS architecture, strict copy, Reader Contract, and HPL audits remain present. Those independent read-only checks run in parallel; their assertions and test population are unchanged.

## Measurements
With the bounded consumer graph held fixed but audits serialized: 11.42 s / 11.02 s / 11.82 s; median **11.42 s**.

With the same checks parallelized: 10.07 s / 9.50 s / 9.56 s before scanner hardening; after broadening the text-source scan, 9.47 s / 9.50 s / 9.36 s; final median **9.47 s**. The inherited <=10 s median target passes.

On the same frozen base, existing leaf-page control was 8.66 s / 7.66 s / 7.63 s; median **7.66 s**. The candidate parallel schedule was 6.21 s / 6.09 s / 6.12 s; median **6.12 s**, about 20% faster without dropping checks.
## Safety evidence
- Targeted fast-gate/pre-Vercel tests pass, including direct bounded consumers and fail-closed indirect/global/data/dynamic/gate-owner cases.
- The scanner also inspects common text-source extensions so a future MDX/Vue/Svelte/text reference cannot silently become an unseen consumer; unprovable references fail closed.
- Repeated fast runs leave no tracked changes and no `verify-fast-*.json` residue.
- Gate-owner changes still classify as global, so this implementation cannot qualify itself for fast release acceptance.

## Boundary and stopping rule
This is development feedback only. Public GitHub Actions, final-candidate Vercel, merge, and Production remain full acceptance. Do not broaden the component limit or consumer model from timing alone; require a new consumer-graph proof and benchmark.

The <=10 s target was inherited from the already-merged leaf-page fast-gate experiment. The bounded-component implementation was prototyped locally before this dated record was written; the acceptance threshold was not changed after observing the measurements.