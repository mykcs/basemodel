# Typography #898 continuation handoff

## 2026-10-22 live continuation — **in progress; preserve concurrent commits**

- #898 remains **open/Draft**, stacked on #895. The user-supplied `487f5e76` and initially refreshed `02950bb` are historical, **not** destinations for reset. During this work the remote advanced to **`cbc2bc56682ed2647cf0d7b26afd326a986b76df`**; its three new commits (Action Wrapper readability and Q17 historical Frontier typography) were fetched and fast-forwarded, then the isolated local patch was reapplied and the test conflict reconciled. The existing 12px/interface Q17 SVG label change and 131 lines of same-branch browser tests are preserved.
- **Already implemented by concurrent Codex:** `MetricEvidenceFigure.astro` now shows the expanded-only `已放大：左右滑动查看完整曲线和刻度` hint; `aria-expanded`, original 1200px SVG, raw link, local scroll and source-squeeze negative already exist. This work did not regress/replace that component.
- **New isolated code work:** four original Q17 inline SVGs in two non-overlapping research owner components are wrapped in a no-JS, keyboard-operable native-size reader; existing plots/data/viewBoxes untouched. Landscape ECharts legend 11px → 14px, axes 13px, tooltip 14px; the full-view interaction is exercised. New negative regression tests inject the original mobile SVG squeeze and 9px landscape labels, require the same predicate to fail and restored behavior to pass; 390/768/1440 × light/dark Figure+caption+controls PNG/JSON cases added.
- **WebKit evidence gap addressed at CI code level, not falsely declared solved:** new read-only, PR #898-only `typography_full_webkit` jobs appended to the existing `public-pr-ci.yml` run the *full* `test:ui:all` WebKit selection across four shards with an independent aggregate gate, exact SHA, retained per-shard logs/exit codes and screenshot/JSON artifacts. The repository explicitly requires **three** workflow files, so a new fourth workflow was rejected by a real unit test and removed; no invariant was relaxed. The locally listed integrated candidate now has **643 WebKit cases** (not the old 557); confirm final exact SHA after commit. Execution PASS remains **PENDING** until Actions finishes. #814 also touches the shared workflow (different hunk), so recheck its merge implications.
- **Static/source triage:** initial Q17 wrapper candidate built 268 routes, 73 figures, 130 tables; 36 CSS owners and 61 standalone CSS literal-size rules. Source triage of 58 inline/JS style candidates found 48 geometry/timing/layout exceptions, 1 actual 11px chart legend (migrated), 9 lexical false positives; **1,981 Astro scoped literal size/shorthand candidates remain a classification queue**, not auto-approved. See `docs/agents/evidence/sitewide-typography/2026-10-22/INLINE_SURFACE_TRIAGE.md` and `ownership.json`.
- **Not complete:** actual exact-head CI, whole WebKit exit code, the rest of scoped CSS/parallel-owner classification, 390/768/1440 real screenshot verdicts, 8 Briefing figures, derived Effective-State figures, protected exact-head Vercel Review Preview and PR body closeout. Do not mark full typography accepted or publish Production.

See [WP-D7 scoped receipt](../../agents/evidence/sitewide-typography/2026-10-22/WP_D7_NATIVE_SVG_AND_LANDSCAPE.md). New run/Preview source SHA and status must be verified after the *actual* next commit; this authoring snapshot is not a successful cloud run.

## 2026-10-21 latest checked state — preserve downstream work

- The original handoff stopped at `7b8246b3`, while the branch moved through `7987f2a7`. Its later commits were preserved. The next agent committed `33ee2d9d`, detected real CI failures (`astro check` returned two Node `remove` typing errors; browser tests incorrectly targeted an unmounted 7B table), then corrected at working production/test HEAD **`185f3dd67ca652cf901369a40441325adc6447b6`**. This HEAD has a true complete **Public PR CI PASS #39544919705** with 8 Chromium shards and two inject-and-reject negative checks for the live four-arm report.
- **Actual fix**: `src/components/research/OpenEvoExperimentAnalysisPlan.astro` four-arm `.per-arm-grid`, `.factor-matrix`, `.plan-table` explanatory/data roles. Not the 7B public scaffold, not all 268 routes.
- **Current source debt** grounded against 7987's whole-audit source and exact eight-declaration Astro owner delta: 61 independent CSS literal sizes; 2,270 Astro scoped literal/shorthand candidates; 56 inline/JS style candidates. `inventory.json` retains historical 4b rule entries and now has a separate exact-head source audit; unclassified ≠ 0.
- **New concurrent work**: **#908** at `a9a94b80` adds plan-table column min-width in the exact same Astro file. The hunk differs semantically from typography, but there is a textual merge-conflict risk. Keep independent. #901 at `e446d769` owns WebKit/cloud figure gate; do not imply it has merged.
- **Visual**: downloaded 7 hosted artifact ZIPs from run #39544919705, 93 unique PNG and 31 JSON. Opened all six 390/768/1440 × light/dark card PNGs plus one 390-dark reasoning PNG. The tall `.per-arm-grid` element screenshot captured `research-navigation` over the text (even with `.site-header` hidden), so classify these six card crops as **NEEDS CAPTURE FIX**, not ACCEPT. The next test adds unmodified viewport screenshots for honest navigation review and hides only sticky navigation in the component-specific crop; those new evidence files require a new exact-head successful CI.
- **Live PR/preview**: #898 remains Draft and stacked on #895; don't alter any parallel PR or Production. The existing Vercel review project is `basemodel-ui-preview-20260811`; its latest older READY deployment at `7e3d5b6c` is **not** a candidate preview. Create a fresh `target=preview` review-only deployment of the final SHA, verify `noindex` and actual app rather than the HTTP-200 Vercel login shell. If SSO prevents independent page inspection, explicitly mark blocked.
- **Do next**: complete crop/viewport artifact fix and exact-head hosted CI; inspect fresh PNGs. Regenerate complete scoped/inline/JS semantic ledger and reconcile owners (#806/#895/#908), WebKit all combos, then exact-head Vercel Review Preview. Do not mark full site accepted merely from CI.


Status: **PARTIAL / NOT sitewide accepted**. Stop point requested by the owner.
Continue the existing PR; no new PR, merge, closure of parallel PRs or Production.

## Read first and refresh live state

- Repo: https://github.com/mykcs/basemodel
- Work PR: https://github.com/mykcs/basemodel/pull/898
- Remote branch: `design/typography-catalog-workspace-20261020`
- Stack parent: #895, `design/sitewide-type-and-paper-figures-20261020`.
- Read the full sibling `CODEX_EXECUTION_PLAN.md` before implementing. Its task
  checkboxes and PR body are older than the continuation commits; reconcile them
  with executable code and exact-head evidence instead of repeating completed work.
- Read AGENTS.md, src/research instructions, Wish, Typography Standard, CSS
  Architecture, UI Visual Acceptance Gate, shared Harness/Engineering and Project
  Report guidance. Preserve scientific data, sources, claims and experiment states.
- User authorized code, tests, cloud CI, evidence and an isolated Vercel Review
  Preview in this PR. Prefer GitHub/Actions/Vercel; do not use the owner's Mac/RDC.

## Commits already pushed before the handoff snapshot

| Commit | Change / actual acceptance |
| --- | --- |
| `c5d0f4f36176cf3f8d640c64d1db230c7993dc24` | AST inventory, method role migration, canonical typography suites/artifacts. CI 39453296970 failed on a test opening state; retained as red evidence. |
| `6c6a8dde5ef5cf1338f222587f9e7548131d9159` | Methods/Lab label geometry, mobile Home/Landscape, retire orphan pool CSS, real controls and negative witnesses. Public CI 39456768936 PASS, deterministic + all 8 Chromium shards. |
| `0eeba36f3283984123228045fa3488f86bd1cafb` | Core control fonts, historical Stage 2, shared Quick View feature stylesheet, ownership test, stronger negatives and per-route geometry cases. Focused Chromium/WebKit 192/192 PASS, but full Public CI 39464610929 FAILED: new metadata/table tokens shrank historical prose below its existing 16px contract. |
| `be785915a59733492d5637f4977d5d5ce6eb80c0` | Restore the archive's body-token floor without weakening the reader test. Focused reader + legacy checks 20/20 Chromium/WebKit PASS; exact-head Public CI 39470403712 PASS. |

Last fully green hosted commit above is **be785915**, not the subsequent WIP CSS
snapshot accompanying this document. Hosted Public CI is Chromium; do not call it
full WebKit evidence. No fresh Vercel deployment was created during this continuation.

## WIP CSS saved with this handoff — build only, NOT accepted

Four files contain a further explicit-selector semantic role migration:

- `src/styles/site.css`
- `src/styles/final-hardening.css`
- `src/styles/openevo-research-blogs.css`
- `src/styles/advisor-ten-approved-reader.css`

This WIP has a successful `npm run build` and `git diff --check`. No new browser
matrix, screenshot review or complete deterministic gate has accepted these four
files. Continue reviewing the diff against **be785915**; fix or selectively undo
individual assignments as evidence requires. It is intentionally preserved for
review, not labelled complete.

WIP audit: 268 generated routes, 73 figures, 130 tables, 36 CSS owners,
`font_declarations=666`, **61 direct CSS size literals**, zero invalid inherit-family
shorthands. At be785915 the comparable count was **213**. Original start was 249
direct CSS sizes + 50 literal-size font shorthands = 299, not 299 proven visual bugs.
The WIP removes the last three literal shorthands from advisor CSS, but rerun the
AST JSON to verify the current tree. Never use falling counts as visual acceptance.

Immediate review concerns in this WIP:

1. Generic `.evo-blog p,.evo-blog li` and advisor lane `p` retain intentional `1em`
   inheritance so captions/notes are not forced back to body size. Classify these
   with evidence instead of replacing them mechanically.
2. Article question H2 and question-header H3 were both assigned
   `--type-article-subsection`; inspect their actual document roles and preserve a
   clear hierarchy (H2 may need article-section). Do not blindly enlarge both.
3. Many old weights 700/750/780/850 remain. Typography covers family/weight/style/
   leading/tracking too. Ordinary counts were made normal weight in selected
   actual owners, but a whole-site numeric/style audit is unfinished.
4. Native table cells now use table tokens. Check every affected table family's
   real wrapper/local scroll, not only viewport overflow. Keep scientific facts.
5. Mobile Home <=390 duplicate heading declaration was removed after both mobile
   rules converged; inspect actual 390/414 screenshots and final cascade.
6. `inventory.json` and `ownership.json` under the evidence directory still describe
   the PRE-WIP 213-rule snapshot. Regenerate/classify after reviewing this batch.

## Real completed components / regressions to preserve

- Existing catalog/workspace/Compare typography from pre-intake commits remains.
- Methods: SEED/OpenEVO offline text, carriers and technical IDs; Lab PERSISTENCE
  uses a content-width relation column, not the old 72px which split off `CE`.
- Core and legacy native controls had invalid `font: ... inherit` family
  shorthands. Actual Chromium used Arial and WebKit its standard font. Explicit
  token longhands fix it. Parser + source-injected audit negative + browser
  same-assertion negative now reject this failure; whole `font: inherit` stays valid.
- Global model Quick View on Papers lacked interior styling: it lived only in
  Workspace CSS. `ModelQuickView.css` now travels with both TSX consumers; Workspace
  retains mobile handoff and foundation outer shell. Structural ownership test
  prevents duplicates; browser same-assertion negative removes interior rules.
- Historical Stage 2 ordinary metrics are interface/normal400, with **body 16px
  minimum** for its prose/metadata/values. Do not restore meta13/table15 there.
- `research-explainer-layout.spec.ts` splits the unchanged full matrix by route.
  Every step/check/threshold remains; each test retains 90 seconds. Earlier grouping
  five routes exhausted a shared budget. No force clicks or threshold relaxation.
- Negatives also cover old 9px prose, Arial carrier, Lab label wrap, mobile exchange
  narrow columns, Compare9px, existing Q03 axis collision and real narrow C1 boxes.

## Inventory and scope still unfinished

At be785915, independent-CSS baseline ledger: 81 MIGRATE, 2 DEAD_OR_SHADOWED,
208 CONCURRENT_PR_BLOCKER, 8 JUSTIFIED_EXCEPTION, zero unclassified ONLY within
its 299 original entries. Concurrent entries are conservative pending review, not
proof that every declaration conflicts. WIP changes make these counts stale.

The expanded Astro scoped-source scan still has **2,281 literal/shorthand rules**
across many components plus unresolved inline/JS candidates. Their complete
semantic disposition/consumer ledger is NOT finished. Largest source is
`SeedOpenEvoProgressBriefing.astro` (277); presentation/plot geometry needs role
and responsive evidence, not blind token substitution. Other major sources:
Lyg2171ServerOverview, FairComparison, SuccessorReport, FirstRunMap, scientific
canonical figures, results scaffolds and minimax-teacher. No claim of full coverage.

Run `node scripts/audit-sitewide-typography.mjs --json <path>` after a fresh build.
The parser scans CSS and Astro styles; unknown inline/JS remains explicit.
All 268 HTML are scanned, but that is NOT 268 manually inspected screenshots.
Current Astro config generates Chinese-only routes; archived English source is
not a reason to invent `/en/` paths. Real mixed Chinese/English is in witnesses.

## Concurrent PRs: refresh exact heads before writes

Last checked: #895 `9a18359d`, #806 `8f976af8`, #816 `dab55a69` all open.
#901 moved repeatedly, last observed `7c6f7eed`; do not assume still current.
There were 35 open PRs at inventory capture; refresh all path sets before broad work.

- #895 is our actual stack parent; its semantic tokens/authority are inherited.
- #806 site.css patch changes two learning-guide radii; final-hardening changes a
  model radius and removes paper-card overrides. Preserve those pending deltas;
  do not replace its entire files. Its core CSS additions alter control structure,
  not the existing font declarations migrated here. Geometry-test additions are
  outside our matrix loop. Those are complementary overlaps, not blanket blockers.
- #816 owns section-heading structural consolidation in site/visual-upgrade/design-
  refinement and scientific Figure shell ownership. WIP changes typography only;
  don't steal/rewrite its layout ownership or import unmerged broad refactors.
- #901 now touches the same research-explainer-layout test, but only its late-file
  scroll test (`behavior:'instant'` + settled scrollY) in the last patch inspected.
  Our matrix loop is separate. It also owns workflow, package/lock, preflight,
  figure audit/evidence and a checkpoint heading collision fix. Inspect latest.
- Never merge or close these PRs, silently resolve a conflict or retarget #898.

## Acceptance still required

1. Finish/review WIP shared owners; remaining CSS/scoped/inline rules each need
   migrate / justified exception / dead / layout blocker / true concurrency blocker.
2. Models/Papers/Compare/Workspace/Home/Nav plus research blogs/results/Figures/
   Tables/Captions/math must be checked in actual containers, including normal
   numerals, CJK wrapping, cut-off text, nodes/connectors and axis geometry.
3. Clean exact-head `verify:deploy`, `build`, CSS/typography audits, unit/behavior
   tests, full applicable UI matrix, real red→green negatives. Do not borrow old CI.
4. 390/768/1440, light/dark, Chromium/WebKit; inspect actual new PNGs and computed
   role JSON. Existing witnesses cover ten representative route URLs, not all pages.
5. Download and actually open hosted CI artifacts, record ACCEPT/FIX/NEEDS HUMAN
   REVIEW samples and exact source SHA. CI green is not visual or scientific PASS.
6. Update execution-plan task statuses, current inventory/ownership/route receipts,
   PR #898 body and evidence comments. The body still mostly predates this session.
7. Produce and inspect an exact-SHA dedicated Vercel Review Preview after tests,
   then give the owner the link. No new Preview has been delivered yet.

## Vercel boundary

`review-preview.yml` requires base=main; #898 remains stacked on #895, so that
workflow/final gate cannot be used as if it were eligible. The user authorized
the existing isolated **basemodel-ui-preview-20260811** review-only project/tool
fallback. Check current hosting/review workflow first: the project is non-Git-
connected and may require trusted prebuilt upload rather than Git source deploy.
Do not create a Production deployment, retarget the PR or arm the final gate.
Inspect actual project/deployment metadata, exact SHA, noindex and target pages.
Protection was enabled (`all_except_custom_domains`); use legitimate protected
access tooling/skill if available, otherwise report SSO accurately. Login HTTP200
does not prove the site passed. Do not persist provider IDs, bypass/share tokens.

Historical Preview at SHA911b5acf is stale:
https://basemodel-ui-preview-20260811-hwf4t5a1f-wangrui92-team.vercel.app/

## Cloud workspace and evidence (if retained)

Repo `/workspace/basemodel`, local branch `typography-898-continuation`, Node24.
No Mac/RDC used. npm dependencies installed. Chromium/WebKit downloaded under
`/workspace/.cache/ms-playwright`. WebKit required task-local Debian libraries
under `/workspace/scratch/webkit-libs`; wrapper links installed under its browser
cache. `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` bypasses ldconfig visibility
only; both actual engines ran. On another runner install real matching deps.

Useful scratch files (not guaranteed to survive another environment):

- `typography-core-quick-view-tests.log`: 192 passed, BOTH engines; before body fix.
- `typography-reader-correction-tests.log`: 20 passed, BOTH engines; body fix.
- `typography-core-quick-view-results/`, `typography-reader-correction-results/`:
  actual PNG/JSON, including new Quick View and ordinary historical metrics.
- `typography-invalid-shorthand-{red,green}.log`: real source injection exit1→0.
- `typography-0eeba-preflight.log`: deterministic/build/overflow passed, then broad
  browser123 passed + historical-reader failure; 798 not run. NOT a full PASS.
- `typography-foundation-build.log`: WIP build PASS / 61 literals, NOT browser PASS.
- `typography-handoff-foundation-inventory.json`: raw WIP inventory.
- `typography-foundation-map.{mjs,json}`, `typography-advisor-map.mjs`: explicit
  selector assignment helpers for WIP; inspect final diff, don't blindly reapply.
- `typography-refresh-ledger.mjs`: baseline4b→current generator, incomplete for new
  shared shorthand/removed duplicates; repair it before regenerating ledger.
- `typography-6c6a-cloud-artifacts/`: six downloaded hosted artifact ZIPs verified
  by hash, 45 PNG+5 JSON; these are old6c evidence, not current acceptance.

Opened screenshots included Chromium390dark Quick View,390light historical
metrics,1440dark Lab transport; WebKit1440light transport,768light Quick View.
Also older Home/Landscape/SEED/Lab captures. WIP shared CSS has NO image approval.

Use unique browser ports/output/cache; never rebuild dist while a browser run
uses it. Avoid concurrent commands sharing trace directories. Put Playwright HTML
reports outside the checkout: Astro check otherwise scans report JS and bloats.
Use `--reporter=list` in development. No browser/build job is intentionally left
running at handoff. Recheck process/runtime state instead of trusting old sessions.

## Owner communication

Report each finished package in concise Chinese: what fixed, exact files/components,
real page samples vs static268, old-rule delta and remaining population, exact
CI/browser/screenshots/negative receipts, commits/links, real blockers and next work.
Be explicit about unfinished work; the owner rejected token/spec/green-CI-only
completion. Continue implementation autonomously until actual acceptance or a
specific decision/access/concurrency blocker, not merely a new plan.
