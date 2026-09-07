# Audience-centered copy audit — 2026-08-12

Status: completed source-owner audit and sustainable verification baseline

Primary standard: `audience-centered-technical-copy.md`

Executable inventory/scanner: `scripts/audit-audience-copy.ts`

## Executive conclusion

All production user-visible copy owners are covered below as individual high-impact owners or bounded owner groups. The audit works at source-owner level, then validates representative generated routes; it does not pretend that hundreds of generated HTML files are independent authored sources.

The 13 priority surfaces from the task are **FIXED**. Remaining candidate matches are either contextual technical terms that are explained nearby, direct safety/research-integrity warnings, dated project-instance material, or factual structured records whose semantics must not be rewritten. No known high-priority copy risk remains in the defined production scope.

## 2026-09-07 capability-route follow-up

The August source-group conclusion above is a dated audit result. It did not cover the later capability-route bodies sufficiently: `OpenEvo7BStage2AnalysisMap.astro` still contained the exact opaque update-gate example prohibited by `website-design-spec.md` case 051, and historical prose used sub-16px text. The narrow strict scanner returned zero invariant failures before this repair.

This follow-up reviews the 12 capability body owners across all 13 route identities and both locales. It rewrites the historical parameter analysis, interface comparison, initial-experience archive, old update-rule archive and Ceiling results; removes editorial headings from the entry, design, exploration, report and first-run summaries; preserves the latest mechanism introduction; and raises component-owned prose to 16px. The result-language test now scans the parameter-analysis owner. The canonical reader-journey suite measures component-owned text on all declared routes before and after disclosure, at 390px/1440px in light/dark and zh/en.

This is a **copy and typography review**, not a claim that every route has been rebuilt against the typed lifecycle contract or that novice comprehension has been measured. Keep the `contextualized` entries in `capabilityReaderRoutes.ts` until their full narrative contract is implemented. Technical evidence panels still retain identifiers and diagnostic notation for audit. Task-specific findings, verification, and remaining boundaries are recorded in [`../history/2026-09-07-capability-copy-standard-followup.md`](../history/2026-09-07-capability-copy-standard-followup.md).

## Audit method and baseline

The scanner discovers the complete production source boundary: every non-test `src/**/*.astro`, `src/**/*.tsx`, and `src/**/*.ts`; every public structured record under `src/content` and `src/data`; and the public Guide scripts and social image copy in `public/guides/**` and `public/og-cover.svg`. It excludes only concrete non-owner classes: `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}`, directories named `fixtures` / `__fixtures__`, generated `dist`, dependencies, and private `.omc` state. Repository documentation and test-only strings are not runtime public-copy owners.

Baseline before the rewrite:

- 325 production source files discovered;
- 408 contextual review candidates;
- 5 strict invariant failures: three known negative/history-dependent headings and two mission-metadata gaps.

The final expanded-boundary scan discovers 367 production sources and reports 383 contextual review candidates with 0 strict invariant failures. Candidate count is a triage signal; PASS/FIXED/EXEMPT classification below, not raw string matching, determines completion.

Strict mode is intentionally narrow. It blocks the incorrect `复现 C` / `Reproduction C` name, known prohibited headings, missing SEED/OpenEvo locale metadata, or missing canonical bilingual OpenEvo guide titles. Ordinary candidate matches return success and require paragraph-level judgment.

## Source-owner inventory

| Source owner | Generated routes / surfaces | Locale | Status | Result / evidence |
|---|---|---|---|---|
| `src/components/OpenEvoSeedBenchmarksGuide.astro` | OpenEvo reproduction guide | zh/en | FIXED | General online-workstation → internal-GPU topology precedes Lab Mac → RTX6; four failure layers and full P0 evidence sentences added. |
| `src/pages/guide.astro` + `src/pages/en/guide.astro` | `/guide/`, `/en/guide/` | zh/en | FIXED | Both locales lead with the transferable online-workstation → internal-GPU-server topology, label 4×3090 as this project's example, and require profiling on the reader's actual hardware; the Chinese dedicated old-Mac case remains behind `<details>`. |
| `src/components/AgentToSeedBridge.astro` | live Guide bridge | zh/en | FIXED | Runtime/training split and paper → checkpoint → workspace next action. Former dead Guide owners are archived in history. |
| `src/components/SeedStudentReproductionGuide.astro` | SEED execution manual | zh/en | FIXED | Starts from a reusable online-workstation + internal-GPU pattern, then names the 4×3090 project instance. |
| `src/components/SeedComputeTimeBudget.astro` | Guide compute budget | zh/en | FIXED | Replaced colloquial headings while preserving planning-vs-measurement and monthly-billing warnings. |
| `src/components/ModelExplorer.tsx` + explorer i18n | `/models/` decisions, filters, empty states | zh/en | FIXED | API/hosted vs open-weight grouping now explains service/weight consequences; existing empty/filter states remain actionable. |
| `src/i18n/zh.ts` + `src/i18n/en.ts` | global title, description, navigation, statuses | zh/en | FIXED | Atlas brand retained; tagline/title suffix/default description align to the SEED × OpenEvo mission. |
| `src/pages/_bodies/home-v2.astro` + mission hero | `/`, `/en/` | zh/en | FIXED | Positive Learn/Run/Compare entry; mission-first first viewport retained. |
| `src/content/guides/**` | Guide structured concepts | zh/en | FIXED | API accessibility vs reproducibility is now a complete causal explanation. |
| `src/content/changeEvents/**` + schema | home/event-derived surfaces | zh/en | FIXED | Change-event public note now has explicit Chinese and English fields; original source note retained. |
| `src/lib/localizedChangeEvent.ts` + `src/pages/_bodies/home-v2.astro` | `/`, `/en/` recent-change timeline | zh/en | FIXED | Selects `note_zh` / `note_en` from the page locale and falls back to the other locale, legacy note, then event type. Built output is checked independently per locale. |
| `src/components/SeedReproductionPath.astro` + `src/components/papers/PaperLearningGuide.astro` | `/papers/seed/`, `/en/papers/seed/` | zh/en | FIXED | Persistent heading now points to a dated catalog snapshot instead of unanchored “今天 / today”; the market snapshot still exposes its exact check date. |
| `src/components/research/**` + `src/pages/research/**` | research hub and child routes | zh/en | FIXED | Benchmark and loop headings now establish interaction/update boundaries positively; scientific states remain unchanged. |
| `src/components/visual/**` | major route primers | zh/en | FIXED | Model-detail and evidence-limit headings state the decision boundary without negative-first framing. |
| `src/pages/guide/today.astro` | dated old-Mac lab runbook | zh | EXEMPT | Explicitly labeled as the **2026-08-11 project instance** with a link back to the general route. Relative “today” language inside this dated operational snapshot retains its absolute-date reference. |
| `src/layouts/AppLayout.astro` | every HTML route: title suffix, description, canonical, hreflang, OG/Twitter, JSON-LD, global status/quick-view shell | zh/en | PASS | Explicit SEO/metadata owner is scanner-covered; bilingual built-route assertions verify title, description, canonical, mission terms, and locale separation. |
| `src/components/Header.astro`, `StatusBadge.astro`, `EvidenceList.astro`, `FamilyTimeline.tsx`, `PaperModelMatrix.tsx`, `ModelComparison.tsx` | global navigation/status; model/paper/family/compare surfaces | zh/en | PASS | Shared navigation, status, empty and evidence language reviewed as one bounded shared-shell group; status values retain semantic meaning. |
| `src/components/common/**`, `src/components/navigation/**` | global copy/action controls, command menu, semantic-status legend | zh/en | PASS | Concrete shared-control owner group; empty/error/action labels are locale-aware and scanner-covered. |
| `src/components/models/**` | `/models/`, `/models/:id/`, corresponding `/en/` routes, global quick view | zh/en | PASS | Model decision cards, detail navigation, unresolved-field list, access ladder, alternatives, task fit and quick-view copy are scanner-covered; unknown values remain explicit. |
| `src/components/papers/**` | `/papers/`, `/papers/:id/`, corresponding `/en/` routes | zh/en | PASS | Paper explorer, learning guide, role diagram, reproduction summary and selection rationale map to paper routes; missing evidence stays “not recorded / verify”. |
| `src/components/workspace/**` | `/workspace/`, `/en/workspace/` | zh/en | PASS | Task builder steps, constraints, candidate board, evidence inspector, substitute lab, decision memo, compare tray and mobile navigation include actionable empty/error/status states. |
| `src/components/landscape/**` | `/landscape/`, `/en/landscape/` | zh/en | PASS | D3/ECharts/accessible-table labels and empty states share the locale contract and keep unknown access distinct. |
| Exact route shells `src/pages/{index,404,lab,guide,compare,methodology,data-status}.astro`, `src/pages/{models,papers,families,workspace,landscape}/**`, and matching `src/pages/en/**` | named HTML routes and English counterparts | zh/en | PASS | Every Astro route shell is discovered. Copy ownership delegates explicitly to its body/component plus `AppLayout`; route generation is verified in the 411-page build. |
| Exact body owners `src/pages/_bodies/{home-v2,not-found,families-index,papers-index,model-detail,compare,paper-detail,models-index,landscape,data-status}.astro` | home, 404, families, papers, model detail, compare, paper detail, model explorer, landscape, data status | zh/en | PASS | Each bounded body owner maps to both locale shells where available; 404/empty/status language and table containment are included in UI checks. |
| Machine-route owners `src/pages/{search-index.json,robots.txt,sitemap.xml}.ts`, `src/pages/{,en/}landscape/models.json.ts`, `src/pages/model-data/[id].json.ts` | search, robots, sitemap, public model/landscape JSON | machine-readable / shared | EXEMPT | Public outputs are scanner-covered, but identifiers/URLs/serialized facts are machine contracts rather than prose; their route tests remain authoritative. |
| `src/content/benchmarkRuns/**` | `/data-status/`, `/en/data-status/` benchmark run conditions | shared factual record with localized renderer | EXEMPT | Exact record owner is scanner-covered; benchmark, status, conditions and source IDs are evidence facts and are not stylistically rewritten. |
| `src/content/claims/**` | `/data-status/`, `/en/data-status/` claim history/conflicts | shared factual record with localized renderer | EXEMPT | Exact claim owner is scanner-covered; predicate/value/validity/support relation preserve evidence semantics. |
| `src/lib/fieldCatalog.ts` | unresolved-field list and Candidate Board on model/workspace routes | zh/en | PASS | Field labels and research-impact explanations are public copy; both locale columns are scanner-covered and consumer-linked. |
| `src/lib/modelFilters.ts`, `src/lib/researchLabels.ts`, `src/lib/recommendation.ts`, `src/lib/format.ts` | model filters/reasons, research labels, recommendations, formatted status across model/workspace/paper routes | zh/en | PASS | Bounded computed-copy owners are scanned; tests preserve actionable recommendations and localized enum/status labels. |
| `src/lib/{dataHealth,landscape,researchEngine}.ts` + `src/lib/research/**` | Data Status findings, Landscape labels, Candidate/compare/substitution reasons | zh/en / semantic facts | PASS | Public computed labels/reasons are in scope; ranking/math-only fields remain unchanged and unknown states are not coerced. |
| `src/i18n/index.ts`, `src/i18n/{zh,en}.ts` | all shared locale strings | zh/en | FIXED | Locale registry and both message catalogs are discovered; mission metadata, navigation, empty/error/status strings are route consumers, not isolated documentation. |
| `src/content/models/**` | model detail/generated catalog records | mostly shared factual data | EXEMPT | Public factual records are scanner-covered, but model facts, unknowns, licenses, dates, and evidence notes are not stylistically rewritten without source verification. |
| `src/content/papers/**` | paper details and role/reproduction records | zh/en where provided | EXEMPT | Scanner-covered scientific records retain paper claims, `not_reported`/`not_verified`, and evidence boundaries. |
| `src/content/coverage/**`, `src/content/guides/**`, `src/content/changeEvents/**`, `src/data/**` | family/data status, Guide concepts, home events, market/compute callouts | shared/zh/en | PASS / EXEMPT | Bilingual authored presentation fields are reviewed; catalog, date, price, hardware and evidence values are explicit factual exemptions. |
| `src/content.config.ts`, `src/lib/schemas.ts`, `src/lib/types.ts`, `src/stores/**` | content validation and persisted task/project defaults consumed by public routes | schema/state | EXEMPT | Discovered because they bound public values, but type keys, validation enums and empty state objects are runtime contracts, not direct prose owners. |
| `src/styles/**` | all visual routes | CSS identifiers / generated content only | EXEMPT | Scanner discovery includes `.ts`/UI sources, while CSS is concretely excluded from prose matching because it contains no authored visible prose; visual behavior is covered by UI safety tests. |
| `public/guides/seed-4x3090-preflight.sh`, `public/guides/seed-stage1-check.py` | downloadable Guide tools and their terminal help/error/status output | English/technical | PASS | Both downloadable public-copy owners are scanned; command/error text is operational and keeps exact evidence semantics. |
| `public/og-cover.svg` | social preview image text | English/brand | PASS | Scanner-covered social-image owner aligns with current mission; `public/favicon.svg`, `public/og-cover.png`, and `_headers` contain no authored prose or are binary/protocol assets. |
| Concrete exclusions: `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}`, fixture directories, `dist/`, `node_modules/`, `.omc/`, `docs/agents/**` | test/history/generated/private material | n/a | EXEMPT | These named classes do not own runtime public copy. Tests may intentionally contain banned samples; docs preserve audit history; generated/dependency/private state is not authored production source. |

## Necessary direct warnings retained

Direct prohibitions remain when the nearby context names the protected object and consequence:

- shared GPU safety: do not kill or reset another researcher’s process;
- network/account safety: do not expose SSH/VNC publicly or publish passwords, keys, or tokens;
- research integrity: do not promote fallback-only actions, clean exit, import success, unknown values, P2 infrastructure, or `0.0→0.0` into stronger scientific claims;
- billing integrity: do not multiply a monthly-only SKU into a fictional hourly payable amount;
- gate integrity: do not advance when the required evidence is absent.

These are **EXEMPT** from negative-word cleanup because each protects a named resource, person, cost, or scientific conclusion.

## Representative route coverage

Chinese source/render coverage:

`/`, `/guide/`, `/research/seed-openevo/study/run/`, `/research/seed-openevo/flow/`, `/research/seed-openevo/flow/base-model/`, `/research/seed-openevo/flow/seed/`, `/research/seed-openevo/flow/openevo/`, `/research/seed-openevo/flow/benchmarks/`, `/research/seed-openevo/flow/loops/`, `/research/seed-openevo/study/results/`, `/models/`, `/models/qwen2-5-3b-instruct/`, `/papers/`, `/papers/seed/`, `/workspace/`, `/compare/`, `/data-status/`, `/methodology/`.

English source/render coverage:

`/en/`, `/en/guide/`, `/en/research/seed-openevo/study/run/`, `/en/research/seed-openevo/flow/`, `/en/research/seed-openevo/flow/loops/`, `/en/models/qwen2-5-3b-instruct/`, `/en/papers/seed/`.

The build and browser UI matrix verify generation, responsive layout, overflow, details controls, and theme/locale behavior. Exact-head Preview inspection remains a release-stage responsibility after the final synchronized push.

## Sustainable author workflow

1. A user-visible page/copy/status/i18n change triggers the scenario registry.
2. Read the copy standard, this inventory, visual architecture, and the relevant research contract.
3. Identify source owner → generated routes → locales before editing.
4. Run `npm run audit:copy`; review changed-source candidates in context.
5. Run `npm run audit:copy:strict`, focused tests, `npm run verify:deploy`, build, and the relevant browser gate in one validation session.
6. Update this canonical inventory only when ownership, coverage, or a justified exemption changes.

## Coverage boundary after completion

There are no unresolved high-priority copy items in the defined production source-owner scope. Candidate output is intentionally non-zero because precise research terminology, dated source evidence, bilingual source literals, and justified warnings require contextual review. A candidate count is not a defect count, and automatic rewriting of factual model/paper records would violate the project’s evidence contract.

