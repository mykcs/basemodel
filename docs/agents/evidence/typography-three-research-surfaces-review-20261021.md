# Three independently repaired BaseModel research surfaces — single integration candidate

**Status:** Optional, isolated integration-ready candidate based on #898 at \`7e3d5b6ccdec18e565c6d375f9619aad5512cf12\`; it is not part of #898, not Production and not a sitewide Typography PASS. **One combined commit contains the three previously validated components, three browser suites and three per-case evidence records.** No changes to #898, #895, #806, #816 or #901.

## Three separate owners, no overlap with current in-flight work

| Scoped source (markup/science unchanged) | Reader defect | Corrective typography | Individual evidence |
| --- | --- | --- | --- |
| \`OpenEvoExperimentSelector.astro\` | Four-arm choices described in 10.56–10.88px prose | Real explanations now 15px/24px; short IDs remain technical | [Experiment chooser](typography-experiment-selector-review-20261020.md) |
| \`OpenEvoLegacyStage2ResearchJourney.astro\` | Actual Stage-2 timeline explanation ~11.5px; table header ~9.6px | Body 16px, table 15px and local 960px table scrollbar; adaptive single-column timeline | [Historical genealogy](typography-stage2-genealogy-reader-review-20261020.md) |
| \`OpenEvoExperimentAnalysisPlan.astro\` | Live four-arm analysis data labels 10.24px, headings 12.48px, narrative 12.8px | Explanatory table captions 14px, table 15px, narrative 16px, logic chain collapses by 1040px | [Four-arm scientific report](typography-four-arm-scientific-results-review-20261021.md) |

BaseModel's existing \`src/styles/tokens.css\` remains the only semantic type-scale authority. No new \`!important\`, no global CSS patch layer and no changes to scientific copy, scores, facts, citations or evidence links. Each CSS change resides in the file that renders the UI.

## Independent exact-source validation before this combination

- Experiment chooser: Chromium 19/19, WebKit 19/19, 390/768/1440 light/dark + injected 10px negative witness; original live 10.56px -> 15px. \`verify:deploy\` and static build passed on identical production code.
- Historical Stage-2 genealogy: Chromium 9/9, WebKit 9/9, 390/768/1024/1440 light/dark + 10px/9px injected negatives. \`verify:deploy\`, static build, and prior reader-journey regression 4/4 passed on its production source.
- Four-arm scientific analysis: Chromium 9/9, WebKit 9/9, 390/768/1024/1440 light/dark + 10px/9px/local-scroll injected negatives; 268-page static build passed. Full \`verify:deploy\` was launched but the previous sandbox expired before its exit code was captured. Do not label that check passed until this combined commit runs the check again.
- Real phone and desktop screenshots from each case were actually inspected during isolated reviews. Temporary/stale sandbox image URLs are **not** persistent GitHub artifact URLs; the integrated branch must collect its own exact-head PNG/JSON artifacts.

## How Codex should use this without parallel conflicts

1. Recheck the current #898 head and every open PR file owner. At the point of making this candidate, none of the three production source paths was changed in #898 or in the then-current open #903–#906 / #901 / #895 / #816 / #806; inspect newer PRs again.
2. This branch is intentionally **not** an open PR and is not merged. It presents one coherent code change that can be selectively carried to #898 when the owner is ready. Never force-push/cherry-pick over Codex's active files.
3. Run exact-commit \`npm run verify:deploy\`, \`npm run build\`, all three Playwright suites on Chromium and WebKit, full affected-route UI regressions, and inspect actual screenshots **on the integrated SHA**, not a stale green predecessor.
4. \`OpenEvoFairComparisonExplainer.astro\` is a distinct likely-retired component: a production-source grep at the original head found no direct runtime consumers and \`/study/design/\` is a redirect; do not count its source literals as a live visual defect without verifying reachability. The dormant \`isSeven\` branch in \`OpenEvoExperimentAnalysisPlan.astro\` similarly was not rendered on the current four-arm route.
5. No exact-head Vercel Review Preview has been deployed for this combined branch; acceptance and Production release remain governed by #898 and the current hosting policy, without retargeting or merging the Draft PR.

**Complete-site acceptance:** still blocked on the larger scoped-Astro semantic inventory, shared CSS owners and full preview+visual gate. This document closes three **production component** readability problems, not the entire site.
