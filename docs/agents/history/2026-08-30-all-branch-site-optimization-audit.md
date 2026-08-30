# 2026-08-30 all-branch website code optimization audit

Status: completed read-only audit and implementation handoff

Repository: `mykcs/basemodel`

Audited source head: `origin/main@57dd0b7a40cef0346e9dcbb97bc7e39db1a16a53`

Production checked: <https://basemodel-preview.vercel.app>

Lifecycle: historical evidence and execution brief; it does not override `docs/agents/current/*`, executable code/tests, or live provider state.

Final implementation/release closeout: [`2026-08-30-site-optimization-implementation-and-release-retrospective.md`](2026-08-30-site-optimization-implementation-and-release-retrospective.md). That retrospective records PR #350, the browser regressions found during implementation, exact-tree acceptance, merge, and Production `READY`.

## 1. Purpose and decision summary

This audit answers two questions:

1. Does the current website code have evidence-backed optimization opportunities?
2. Does any remote branch contain unfinished work that should be integrated before optimizing `main`?

The answer to the first question is **yes**. The application has a strong baseline—deterministic validation and build pass, Production is fast, and the repository has substantial semantic/test coverage—but it still has one live routing/SEO correctness defect, a false-green CI path, four confirmed contrast failures, missing Vercel security/cache headers, oversized serialized islands, avoidable global hydration/CSS, and maintainability debt.

The answer to the second question is **no for legacy branches, with one active exception**. All 95 live GitHub heads were classified. There is no old branch whose code should simply be merged into `main`. The sole open PR, [#335](https://github.com/mykcs/basemodel/pull/335), is active research work and currently has merge-blocking privacy, routing, semantic HTML, evidence-visualization, and documentation-lifecycle problems. It must remain separate from the site-optimization work.

## 2. Scope, method, and evidence boundary

The audit used the repository's `website-improve` evidence-first workflow, with the user's explicit override that this round must diagnose and plan only. No production code, provider configuration, remote branch, PR, deployment, or repository setting was changed during diagnosis.

Evidence sources:

- GitHub live heads, PR states, tree/ancestry comparisons, and merge-tree classifications;
- exact-tree inspection of `origin/main@57dd0b7` and an isolated build of that tree;
- repository-owned `verify:deploy`, build, direct ESLint, and targeted Playwright tests;
- Production HTTP status, headers, HTML, payload sizes, and Lighthouse runs;
- current repository policies under `docs/agents/current/`;
- primary external guidance from Google, W3C, Astro, web.dev, Vercel, and OWASP.

The findings are a dated snapshot. The implementation Agent must re-fetch and recheck `origin/main`, open PRs, and Production before editing because those states can change.

## 3. Verified healthy baseline

These are non-findings and should not be “fixed” by speculative rewrites:

- `npm run verify:deploy` and `npm run build` pass on `57dd0b7`; the build emits 451 pages.
- The latest Production includes the new LYG.2171 server page, confirming that the deployed layer is at least as new as this audit's mainline feature.
- The dependency lockfile was unchanged from the registry audit that returned 0 vulnerabilities.
- Production Lighthouse remained strong: homepage `100/96/100/100`; Results `99/96/100/100`, with LCP about 1.4–1.7 seconds, CLS 0, and TBT 0.
- Astro, React, TypeScript, static-first rendering, Vercel-only ordinary deployment, Preview `noindex`, and Production canonical identity remain the accepted architecture. This audit does not justify a framework, hosting-provider, or major-dependency migration.

## 4. All-branch audit

### 4.1 Coverage ledger

GitHub had 95 live heads; local remote refs matched exactly after fetch, with no missing or stale ref. Those heads represented 83 unique commit SHAs and 79 unique trees.

| Classification | Count | Meaning | Required action |
| --- | ---: | --- | --- |
| `main` | 1 | Current source authority | Optimize from latest `origin/main` |
| Ancestor of `main`, non-main | 39 | Commit already reachable from `main` | Safe cleanup candidate after owner approval |
| Non-ancestor, MERGED PR | 44 | Mostly squash/merge remnants | Do not treat as unfinished; clean after provenance check |
| Non-ancestor, CLOSED/NO_PR | 10 | 3 closed + 7 aliases/review/intermediate refs | Confirm not unique evidence before deletion |
| Non-ancestor, OPEN PR | 1 | PR #335 | Keep separate and resolve blockers |

Repository setting `delete_branch_on_merge=false` explains much of the accumulation. Recommended governance is to enable automatic deletion after merge and run a periodic `OPEN PR → ancestry → same-tree → merge-tree` audit. Branch deletion is destructive and is not authorized by this document alone.

### 4.2 Branches that must not be revived

- `review/pr244-model-catalog-20260825`: its nine model records were deliberately removed by `007f603` for insufficient independent verification. Future restoration requires a new first-party model-catalog verification pass.
- `agent/semantic-release-ui-parallel-20260827`: PR #276 showed two workers were slower on the Hobby runner and the work was superseded by the risk-aware gate in #273.
- PR #249/#246 reasoning branches: their useful intent was absorbed while their scientific state became stale; merging their old tree would regress current evidence ownership.
- `feat/lyg2171-server-overview`: PR #334 is merged. The branch is one commit ahead/behind only because of merge shape, but its tree equals `main`; merge net is zero.

### 4.3 The only open branch: PR #335

At the first audit snapshot, `research/minimax-teacher-intelligence-cost@6dd1e33` was behind `main` by one commit and ahead by five, with 5 files and 1,016 additions. Before this document was finalized, the branch advanced to `feb961ac26a3e909d9d2efb36d41dd24bac7fb8e`, incorporated current `main`, added an inbound selector link, and grew to 6 files with 1,030 additions and 1 deletion. GitHub then reported the PR as `MERGEABLE/CLEAN`; self-hosted CI and Vercel status completed successfully. Those provider statuses do not by themselves prove independent exact-head route acceptance, which remains required.

Merge blockers:

1. The new Chinese route now has an inbound selector link, but it remains absent from the sitemap route registry; its test still relies on source strings rather than proving complete route wiring.
2. There is no English route, but `AppLayout` unconditionally emits an English alternate, producing another 404 hreflang target.
3. The page nests a second `<main>` inside `AppLayout`'s existing `<main>`.
4. A chart labels its y-axis “teacher quality,” puts unmeasured candidates at different heights, then says height is not a ranking. The visual encoding contradicts the evidence boundary.
5. Public copy says the current Agent session lacks live search. Tool-process narration is not durable user-facing product language.
6. The frozen facts document publishes `/data/home/wangr/...`, exposing a username/private infrastructure path forbidden by project policy.
7. An “immutable historical fact record” and nested `AGENTS.md` were added under `docs/agents/current/`. Historical immutable evidence belongs under the history/evidence owner; current policy must remain refreshable.

PR #335 must be repaired on its own branch, rebased onto current `main`, receive an actual exact-head Preview, and pass browser/evidence/security review before merge. The optimization Executor must not cherry-pick it into the site-optimization PR.

## 5. Findings on current `main`

### P0-1 — Thirteen language alternates and switches lead to 404

`src/lib/sitemapRoutes.ts` declares 13 `zhOnlyStaticPaths`, but `src/layouts/AppLayout.astro` always produces both locale alternates and `src/components/Header.astro` always mirrors the current path to the other language. Production checks confirmed that all 13 generated English targets return 404 while the Chinese pages still advertise those targets in hreflang and the language switcher.

This is not merely an SEO enhancement. It is a broken user control and invalid alternate-language graph. Google's localized-version guidance requires alternates to identify real versions and recommends reciprocal links between versions: [Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions).

Required design:

- create one canonical route-availability helper owned by routing, not separate guesses in layout/header/sitemap;
- emit `canonical`, `hreflang`, Open Graph alternates, and the language-switch target from the same availability map;
- when no translation exists, hide/disable the switch or send it to a clearly bilingual parent—not a fabricated mirror URL;
- add a build-time reciprocal-link/target-exists test over every declared locale route;
- cover representative zh-only and bilingual routes in browser tests.

### P1-1 — ESLint is false-green

`package.json` defines both lint commands with `|| true`, and `verify:deploy` does not call lint. Direct ESLint exits 1 with two real `no-undef` failures for `NodeJS` in `scripts/vercel-ui-plan.ts` lines 204 and 215, while `npm run lint` exits 0.

Required design:

- configure TypeScript/Node globals correctly rather than suppressing all lint failures;
- remove both `|| true` fallbacks;
- run the strict lint command from `verify:deploy`;
- add a negative self-test proving an injected lint violation makes the Gate nonzero.

### P1-2 — The hosted “full” UI gate omits known-red critical tests

`scripts/ci-ui-gate.mjs` maps its full path to `test:ui`, but the package scripts omit `static-first.spec.ts` and `workspace.spec.ts`. Running the relevant eight Chromium tests directly produced 5 passes and 3 failures:

- `static-first.spec.ts`: `.model-grid` now matches four elements;
- `static-first.spec.ts`: `.matrix-table` is hidden inside a closed `<details>`;
- `workspace.spec.ts`: the assertion expects “影响” while the current UI says “变化”.

The failures look like stale selectors/product contracts, but they are still evidence that the Gate can report green without executing critical tests. Update tests to stable roles/ARIA/user-visible semantics, explicitly open intentional disclosure widgets, include the owners in the full matrix, and add a verifier self-test with one known-good and one known-bad sample.

### P1-3 — Four confirmed text-contrast failures

Production Lighthouse identified three failures on the homepage maintenance block and one Results failure:

- `src/pages/_bodies/home-v2.astro` exposes a maintainer-only Vercel settings link and dims the label/links with opacity `.42/.5`;
- `src/components/research/OpenEvoWebShopCurrentQ7.astro` renders `.manifest-copy > span` with insufficient muted-on-tint contrast.

Ordinary text must meet at least 4.5:1 and large text 3:1 under WCAG 2.2 SC 1.4.3: [W3C understanding document](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Required design:

- remove the public Vercel owner/settings link; keep repository access in the normal footer/maintenance owner;
- use theme tokens with measured contrast instead of lowering whole-element opacity;
- correct the Results muted-on-accent token in both themes;
- add axe/contrast coverage for representative zh/en routes in light/dark mode.

### P1-4 — Vercel Production security and data-cache headers are incomplete

The Production HTML response included HSTS but lacked `X-Content-Type-Options`, `Referrer-Policy`, CSP/frame protection, and `Permissions-Policy`. `public/_headers` applies only to the historical Workers shadow host, while `vercel.json` has no equivalent header policy.

The source data route for `/model-data/[id].json` declares cache behavior, but Production returns `public,max-age=0,must-revalidate` instead of the intended shared-cache policy.

Required design:

- define Vercel-owned HTML security headers in `vercel.json`;
- begin CSP in Report-Only if the existing inline-script inventory prevents safe enforcement, then enforce only after representative Preview verification;
- set explicit `/model-data/*` cache headers in the provider configuration and avoid caching user-specific data if such data is ever introduced;
- add deployed-layer `curl` assertions so source-only headers cannot masquerade as Production behavior.

References: [OWASP Secure Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [Vercel cache-control headers](https://vercel.com/docs/caching/cache-control-headers).

### P1-5 — Full dictionaries and catalogs are serialized into client islands

Current exact-tree measurements:

| Route/island | Raw or serialized size | Gzip estimate | Primary cause |
| --- | ---: | ---: | --- |
| Homepage HTML | 96,701 B | 25,877 B | Global islands and CommandMenu labels |
| Models HTML | 1,027,736 B | 86,537 B | Full model catalog in `ModelExplorer` |
| Workspace HTML | 930,385 B | 89,550 B | Full catalogs/messages in `ResearchWorkspace` |
| `CommandMenu` island markup | about 53.7 KB | — | Entire locale message object `m` |
| Model/workspace island props | 792,539 / 834,232 chars | — | Whole collections rather than UI DTOs |

`Header.astro` passes the entire message tree to `CommandMenu`, although the component uses only a small navigation subset. `models-index.astro` and `workspace/index.astro` pass whole collections and messages to eager islands.

Required design:

- introduce narrow typed label objects for `CommandMenu` and any remaining global island;
- separate locale URL helpers from imports of both translation dictionaries;
- render a truthful SSR first batch for models/workspace;
- give client explorers compact task-specific DTOs and fetch the remaining static JSON on demand or by page;
- preserve search/filter URLs, keyboard behavior, no-JS reading, evidence semantics, and unknown values.

Astro recommends hydrating only components that need client interactivity and choosing directives by priority/visibility: [Astro client directives](https://docs.astro.build/en/reference/directives-reference/).

### P1-6 — Global JS and CSS exceed what ordinary pages use

Reachable client JavaScript and global CSS baselines:

| Surface | Raw | Gzip estimate |
| --- | ---: | ---: |
| Homepage reachable JS | 275,421 B | 89,844 B |
| Models reachable JS | 333,456 B | 105,194 B |
| Workspace reachable JS | 377,964 B | 116,310 B |
| Global CSS | 148,170 B | 26,718 B |

Homepage CSS coverage in the previous unchanged snapshot was only about 11.9%. `AppLayout` still hydrates global controls on every page. This does not justify deleting legacy CSS wholesale: ownership must be retired property-by-property under `css-architecture.md`, with browser proof.

Required design:

- route-scope islands and use interaction/visibility-triggered loading where first-click guarantees allow it;
- preserve the pre-hydration bridge rules for SSR-visible controls;
- split feature CSS away from the global composition root without adding another global “fix” layer;
- measure route traces before and after every removal.

Initial performance ceilings for this workstream:

- models and workspace raw HTML: each below 250 KB;
- `CommandMenu` serialized payload: below 8 KB;
- homepage reachable JS: at least 25 KB gzip below the 89.8 KB baseline;
- global CSS gzip: at least 20% below the 26.7 KB baseline without visual regressions;
- field acceptance at p75: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 when sufficient real-user data exists: [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).

### P2-1 — Twelve production-unreachable components remain

A production-import reachability pass found 12 zero-reference components totaling about 1,553 lines:

`AgentPrimer`, `GuideContent`, `GuideDecisionChapters`, `OpenEvoReproductionResearch`, `PersonalComputeProfile`, `AgentMechanismDialogues`, `OpenEvoSeedMechanismAnimation`, `SeedOpenEvoMissionRibbon`, `ResearchMainline`, `SeedUseCaseStrip`, `SiteRoutePrimer`, and `ConstraintPanel`.

Before deletion, create a reachability manifest that accounts for dynamic imports, test-only consumers, retained examples, and historical provenance. Delete only proven production-dead owners, then run build and route/browser acceptance. Do not mass-delete components based only on filename age.

### P2-2 — File-reading policy tests outweigh direct behavior tests

Of 68 `src/**/*.test.ts` files, 59 perform `readFileSync` or equivalent file reads. Most—but not all—inspect source or policy text; others legitimately validate JSON data, schemas, or runtime contracts. The mix still means a single green test count can overstate direct runtime confidence.

Required design:

- label structural policy audits separately from runtime/unit/component/store tests;
- replace fragile wording/selectors with behavior and accessible-role assertions where behavior is the contract;
- add runtime coverage for routing availability, persisted state normalization, filters/search, and hydration boundaries;
- report structural-test and behavioral-test coverage separately instead of presenting one blended count.

### P2-3 — Runtime type ownership is misaligned

The project declares Node 24.x while `@types/node` remains on major 22. Align the type package with the declared runtime, then accept only safe patch/minor dependency updates whose official migration notes and lockfile/build evidence are clean. Do not combine Astro/React/TypeScript major upgrades with this optimization work.

## 6. Implementation plan

Continue from `codex/site-optimization-audit-20260830`, which was created from the audited `origin/main` and contains this handoff document. Rebase or merge the latest `origin/main` before implementation if it moved. Keep PR #335 isolated. Batch local edits and spend Vercel build compute only when the exact head is ready for review.

### Phase 0 — Reconfirm the moving baseline

- fetch all heads/tags and list open PRs;
- confirm whether `main` moved past `57dd0b7` and rerun only the affected evidence;
- record current Production headers, 13 zh-only statuses, payload sizes, and test failures;
- inspect semantic overlap with active branches; do not revive or overwrite their work.

### Phase 1 — Correctness, truthful Gates, accessibility, and headers

- implement the route-availability SSOT and eliminate 404 alternates/switches;
- repair strict lint and full UI gate coverage, including negative verifier tests;
- remove the owner-only homepage link and fix all four contrast failures;
- configure Vercel security/model-data cache headers with deployed-layer assertions.

Do not proceed to payload refactoring until these correctness Gates are green.

### Phase 2 — Serialization and hydration reduction

- narrow CommandMenu/global-island label contracts;
- replace full models/workspace props with SSR first-batch DTOs and on-demand static JSON;
- route-scope/defer global islands without losing the first visible click;
- add HTML/island/JS budgets and no-JS/static-first regression coverage.

### Phase 3 — CSS, dead code, tests, and type alignment

- move feature-owned CSS out of the universal payload and retire only browser-proven duplicate properties;
- validate the reachability manifest, then remove confirmed dead components;
- separate structural audits from behavior tests and add missing behavior coverage;
- align Node types and apply only justified patch/minor updates with regenerated lockfile.

### Phase 4 — Exact-tree acceptance and handoff

- run deterministic, browser, accessibility, payload, and negative self-tests locally;
- make one coherent push whose exact head contains `[vercel-preview]` only when ready;
- verify the protected Vercel Preview and representative routes in both locales/themes/viewports;
- open or update one integration PR, record accepted head/base SHAs, and stop before merge so an independent Codex verifier can accept or reject it;
- this workstream does not authorize remote-branch deletion, any change or merge to PR #335, merge to `main`, or Production deployment; each requires a separate explicit user request in a separate workstream.

### Phase 3 reachability manifest (2026-08-30 implementation evidence)

Search scope: production source imports and dynamic references, tests, scripts, current docs, and history. Historical references remain evidence rather than runtime reachability.

| Candidate | Classification | Non-production references at audit time | Action |
| --- | --- | --- | --- |
| AgentPrimer | dead | test/current-doc/history | implementation deleted |
| GuideContent | dead | test/current-doc/history | implementation and owner-only test deleted |
| GuideDecisionChapters | dead | test/script/current-doc/history | implementation deleted; stale gates/docs updated |
| OpenEvoReproductionResearch | dead | test/current-doc/history | implementation deleted; stale test/doc updated |
| PersonalComputeProfile | dead | test/history | implementation deleted; privacy test retained against live surfaces |
| AgentMechanismDialogues | dead | history only | implementation deleted |
| OpenEvoSeedMechanismAnimation | dead | history only | implementation deleted |
| SeedOpenEvoMissionRibbon | dead | script/history | implementation deleted; negative layout assertion retained |
| ResearchMainline | dead | script/current-doc/history | implementation deleted; negative layout assertion retained |
| SeedUseCaseStrip | dead | script/current-doc/history | implementation deleted; negative route assertions retained |
| SiteRoutePrimer | dead | script/current-doc/history | implementation and now-unreachable CSS deleted |
| ConstraintPanel | dead | history only | implementation deleted |

Production-live: none. Test/doc-only: none (a production implementation referenced only by tests/docs is classified dead). Dead: all 12.

### Phase 3 corrective implementation evidence (2026-08-30)

- Vitest now has explicit structural and behavior commands; `npm test` runs both, and a filesystem-backed taxonomy regression proves every `*.test.ts/tsx` belongs to exactly one category. Playwright remains a separate browser suite.
- Global Research Task context is a native Astro adjunct on every prior route including `/`; it normalizes the existing research-task/candidate/compare storage, reacts to same-document events, and preserves clear/update behavior without homepage React.
- Native CompareTray clear writes `atlas-compare` and dispatches the shared compare event; the mounted compare nanostore consumes that event without redispatch, so native and React consumers converge.
- The payload verifier counts executable inline scripts plus reachable external/imported JavaScript once and follows built homepage stylesheets. Fixed ceilings remain unchanged; workbench-only CSS moved to `workspace.css`, and CSS proven unreachable after the Phase 3 component retirements was removed.
- `@types/node` remains unchanged: the local offline cache and lockfile contain no Node 24 package, and this workstream forbids network access. No dependency or lockfile state was fabricated; Node-type alignment remains bounded by a future authorized online install.

### Phase 4 base and concurrency reconciliation (2026-08-30)

- Final implementation rebase base: `origin/main@42ef063f6c45a57b0df56c4a0a9689f65110a4b8`; the implementation branch is two local commits ahead of that base before the final Preview-marked amend/push.
- PR #335 moved after the dated audit: GitHub now reports it merged at `432e3e7d8e68db8b132e4a1c0dbeeec3a89f4704`. The optimization work did not edit, merge, or delete its branch; its already-landed mainline state was inherited only through the required rebase.
- Live open PRs at the final-base check were #341 (reader-facing experiment-gate explanations) and #345 (website-copy preference documentation). #347 merged into main as `42ef063` during implementation and was inherited only through the second required rebase. None of the still-open PRs was cherry-picked into this branch. #341 overlaps nearby research-result surfaces and remains a separate semantic integration concern for later review.
- The rebase had one content conflict in `WebShopTrainingNote.astro`: upstream added `ResearchTechnicalDisclosure`; this branch added the feature-owned WebShop stylesheet import. Resolution preserved both without changing the research copy or moving the feature stylesheet back into the global bundle.
- No remote branch was deleted and no Production merge/deployment was performed.

## 7. Delivery and acceptance contract

The implementation is not complete until all applicable items below have evidence tied to the exact PR head.

### Repository Gates

```bash
npm run lint
npm run lint:check
npm run verify:deploy
npm run build
npm run test:ui:all
```

Also run the repaired `static-first.spec.ts` and `workspace.spec.ts` explicitly, plus the new route-availability, axe/contrast, header, cache, payload-budget, no-JS, and verifier-negative tests.

If `package.json` or the lockfile changes, review the lockfile diff and also run:

```bash
npm audit --registry=https://registry.npmjs.org/
```

### Functional acceptance

- every declared canonical/hreflang/language-switch target returns 200, or the unavailable alternate is not emitted;
- all four known contrast failures are absent in zh/en and light/dark;
- lint and full UI Gates fail when their negative sample is injected;
- models/workspace remain usable by keyboard and meaningful without JavaScript;
- search/filter/workspace persistence semantics and scientific unknown/evidence boundaries remain unchanged.

### Performance acceptance

- record before/after raw and gzip sizes for homepage, models, workspace, shared JS, global CSS, and serialized island props;
- meet the initial ceilings in P1-6 or provide measured evidence and independent approval for a different threshold;
- no material regression in Lighthouse lab metrics; report real-user p75 separately when available.

### Provider and release acceptance

- exact PR head and intended base SHA recorded;
- Vercel Preview is actually built and READY, not ignored/skipped;
- representative Preview route, metadata, response-header, cache, interaction, mobile, and dark-mode checks pass;
- no Production merge/deploy is claimed before the independent verifier returns PASS.

### Required executor handoff

Return:

- branch and PR URL;
- base/head/accepted tree SHAs;
- changed-file list grouped by finding;
- command results and negative self-test evidence;
- before/after payload table;
- Preview URL/status and tested routes;
- explicit remaining blockers, including the state of PR #335 and branch cleanup authorization.

## 8. Copyable prompt for the implementation Agent

```text
Work in the `mykcs/basemodel` repository and implement the evidence-backed website optimizations documented in:

docs/agents/history/2026-08-30-all-branch-site-optimization-audit.md

Read that document completely before editing. Then follow the repository root AGENTS.md, docs/agents/LATEST.md, docs/agents/README.md, the scenario-trigger registry, and every current owner routed by the audit (especially website engineering, routing/i18n/SEO, UI/browser/theme, CSS, deployment, security, repository map, and research-integrity policies). Executable code/tests and live GitHub/Vercel state outrank the dated audit if anything changed.

Objective:
Implement the current-main findings in the audit end to end, in the documented Phase 0→4 order. Continue from `codex/site-optimization-audit-20260830`, which contains this document; first fetch and integrate the latest `origin/main` if it moved. Preserve Astro/React, static-first behavior, research evidence semantics, Vercel-only ordinary deployment, Preview noindex, and Production identity. Do not perform speculative redesign or major dependency/framework/provider migration.

Concurrency and branch boundary:
Fetch and inspect every live remote head and all open PRs before editing. PR #335 (`research/minimax-teacher-intelligence-cost`) is a separate active research workline with blockers listed in the audit. Do not cherry-pick, merge, overwrite, or silently repair it inside the optimization PR. Report its live state at handoff. Do not delete any remote branch or enable automatic branch deletion without separate owner authorization.

Required implementation scope:
1. Replace fabricated locale mirrors with one route-availability source of truth used by canonical/hreflang/OG alternates, sitemap, and desktop/mobile language switches; add reciprocal target-existence tests for every route.
2. Make lint and the full UI gate truthful: fix the two ESLint errors, remove `|| true`, include strict lint in verify:deploy, repair and include static-first/workspace critical tests, and add known-good/known-bad verifier self-tests.
3. Remove the owner-only Vercel settings link from the public homepage, fix all four measured contrast failures in both themes/locales, and add automated axe/contrast coverage.
4. Add Vercel Production security headers and correct model-data cache headers; use CSP Report-Only first if immediate enforcement is not proven safe, and add deployed-layer curl assertions.
5. Narrow CommandMenu/global-island labels, replace full model/workspace catalog serialization with truthful SSR first content plus compact DTO/on-demand static JSON, route-scope/defer islands safely, and enforce the audit's HTML/props/JS/CSS budgets.
6. Route-split feature CSS without adding a new global fix layer; prove reachability before deleting the 12 candidate dead components; separate structural source audits from runtime behavior tests; align Node types and only safe patch/minor dependencies.

Execution rules:
- First reproduce every finding against the new exact base. If a finding is already fixed, show the commit/test evidence and do not reimplement it.
- Keep unknown scientific/model facts unknown. Do not restore old model records or stale branch UI.
- Add failing regression tests before each fix where practical; no skipped tests, stubs, TODO placeholders, or swallowed errors.
- Do not weaken thresholds just to obtain green. Classify product, stale-test, harness, environment, provider, and quota failures separately.
- Batch local commits and use `[vercel-preview]` only on the exact head ready for hosted acceptance. Do not merge to main or deploy Production; stop at a reviewable PR so Codex can independently verify it.
- This workstream does not authorize remote-branch deletion or any edit/merge to PR #335. Those actions, merge to main, and Production deployment each require a separate explicit user request in a separate workstream.

Mandatory local acceptance:
npm run lint
npm run lint:check
npm run verify:deploy
npm run build
npm run test:ui:all

Also run the repaired critical specs explicitly, new route/hreflang, axe/contrast, security/cache-header, payload-budget, no-JS/static-first tests, and both PASS/FAIL samples for any changed verifier. Run the strongest required Chromium/WebKit, desktop/mobile, zh/en, light/dark matrix supported by current project policy.

If package.json or the lockfile changes, inspect the lockfile diff and run `npm audit --registry=https://registry.npmjs.org/` before build and handoff.

Hosted acceptance:
Create one exact-head Vercel Preview, prove it is READY rather than ignored/skipped, and inspect representative real routes, metadata, headers, caching, interactions, responsive layout, and themes. Respect the repository's build-budget policy: one initial Preview and at most one evidence-driven corrective Preview.

Deliver back:
- concise change summary mapped to every finding;
- changed files;
- branch, PR URL, base SHA, head SHA, and tree identity;
- exact command/test results including negative self-tests;
- before/after HTML, serialized props, reachable JS, and CSS sizes;
- Preview deployment status and routes inspected;
- explicit blockers or deviations, with evidence;
- confirmation that PR #335 remained isolated and that no branch was deleted.

Do not claim completion if any required Gate is red, Preview is not exact-head READY, an in-scope current-main P0/P1 remains, or evidence is missing. Report PR #335 blockers separately and leave that branch untouched. Leave the optimization PR unmerged for independent Codex verification.
```

## 9. Independent verification plan for Codex

When the Executor returns, Codex should verify from scratch rather than trust its summary:

1. fetch the PR head/base and compare the exact tree; inspect overlap with all open branches;
2. reproduce each original failure on the audit baseline when practical, then prove it is fixed on the PR head;
3. run deterministic Gates, repaired critical specs, negative verifier samples, and the required browser matrix independently;
4. inspect the actual exact-head Preview for locale targets, a11y, headers/cache, payloads, interactions, themes, and responsive layout;
5. return PASS only when the delivery contract is complete; otherwise return a finding-by-finding FAIL list without editing the Executor's branch.

## 10. External references

- [Google: localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [W3C: WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Astro: client directives](https://docs.astro.build/en/reference/directives-reference/)
- [web.dev: Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [OWASP: HTTP security response headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Vercel: cache-control headers](https://vercel.com/docs/caching/cache-control-headers)
