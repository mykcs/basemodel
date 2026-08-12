# 2026-08-13 open-PR semantic integration

This record explains how the current open pull requests were combined into one release candidate without treating Git merge order as product authority.

## Snapshot

Base `main` at integration time: `772e3c0b85be98be3fed0c12c34248e304afad87`.

Candidate PRs reviewed: #135, #136, #138, #140, #142, #143, #65 and #66.

Previously folded worker work referenced by those candidates includes #134, #137 and #141.

## Disposition

- **#136 — integration base / product owner.** Keep its reader-centered copy, mobile composition, navigation intent, page outline, research journey and seed3090 evidence work. It already folds the useful intent of #134, #137 and #141 and supersedes #135 as the broader product integration candidate.
- **#138 — integrate.** Preserve the OpenEvo model-choice experiments, beginner questions and the model-inside-SEED/OpenEvo mechanism cutaway. These belong on the OpenEvo-specific route and do not replace the general loop-comparison explanation.
- **#140 — integrate with specialized ownership.** Preserve the end-to-end SEED/OpenEvo process diagrams and mechanism explanation. Where #140 overlaps #136 on `AgentEnvironmentTrajectory.astro` and `researchJourneyExperience.test.ts`, #140 owns the final implementation because it is the newer specialized representation of the same intent: real semantic data flow instead of an older dialogue-card presentation.
- **#142 — integrate.** Apply the Research Editorial × Experimental Workbench visual identity and its non-drift test over the integrated product tree. Its visual-system intent is independent of the research/data additions.
- **#143 — integrate.** Apply the first-party model-catalog differential audit, Grok additions, MiniMax/Mistral corrections and regression contract. This data/evidence work is orthogonal to the UI/research integration.
- **#135 — superseded, intent retained.** Do not mechanically merge its older tree. Its three-research-path information architecture is already carried forward by #136, while its stacked ancestry is also retained through #142.
- **#65 / #66 — defer.** These Dependabot PRs are stale dependency-only upgrades that both modify `package.json` and `package-lock.json`. They are intentionally kept out of this product/research release so an unrelated package-lock conflict cannot enlarge the acceptance surface. Rebase and validate them separately after the release.

## Conflict rule

A clean textual merge is not sufficient acceptance. For overlapping files, choose the implementation that best preserves the current reader/research intent, then retain useful history through Git ancestry rather than reintroducing superseded source trees.

The release candidate therefore uses #136 as its resolved base tree, overlays only exact changed paths from #138/#140/#142/#143, and records those exact worker heads as additional parents of the release commit.

## Release boundary

The candidate is not accepted merely because this tree can be constructed. It still requires the repository-owned deterministic gate and an exact-head Vercel Preview before merge to `main`. Provider quota failures before the build starts are not build failures and must not be bypassed with no-op probe commits.
