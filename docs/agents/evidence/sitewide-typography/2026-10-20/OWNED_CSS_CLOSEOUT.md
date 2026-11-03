# Available-owner CSS closeout and uncovered blockers

Status: **PARTIAL**. This receipt supersedes the initial numeric snapshot in
README.md. Exact final commit and test/artifact links belong to the #898 PR receipt.
Nothing here declares the whole website visually accepted.

## Production work

- `interactive-research-explainer-methods.css`: semantic roles for SEED/OpenEVO/Lab;
  connector space and intermediate message stacking; ordinary interface labels;
  technical GPU/revision IDs retain mono. Offline explanations, including the
  nested GLM description, share body-small size. The Lab relation column uses
  content width so `PERSISTENCE` does not break into an isolated `CE` line.
- `mobile-composition.css`: Home's mobile H1 uses the existing page role. Remove
  its now-redundant <=390px copy. Landscape's statistic uses the lead role.
- `workspace.css`: the shared Quick View H2 uses the existing subsection role.
- `interactive-research-explainer-environments.css`: retire the orphan WebShop
  pool CSS. Source renderers, all 268 HTML files and built JS contain no pool
  class carrier. This is stronger than a source-only name search. No scientific
  number, caption, formula, source link or state was edited.
- `css-radius-debt-baseline.json`: reduce only the retired owner's 7/12px entries
  and aggregate 394→392. #806's latest patch was read: it changes other owner
  entries. Future integration must combine both reductions (385 if unchanged),
  not replace one baseline with the other branch's whole file.

## Recomputable CSS ledger

The original exact-start CSS inventory has 249 direct sizes + 50 literal-size
shorthands = 299 entries. `inventory.json` records each original file/line,
selector, context, value, current value/line, owner, classification and evidence.

| Disposition | Entries |
| --- | ---: |
| MIGRATE — implemented token migration | 46 |
| DEAD_OR_SHADOWED — retired pool shorthands | 2 |
| CONCURRENT_PR_BLOCKER — needs owner reconciliation | 244 |
| JUSTIFIED_EXCEPTION — glyph/relative code/hidden marker | 7 |
| Unclassified within independent CSS inventory | 0 |

The comparable live counters are **249→229 direct CSS sizes**, **50→22 literal
CSS shorthands**. There are 244 concurrent-owner entries plus seven exceptions
left, not zero debt. An implementation classification is not a visual PASS.
Consumers/semantic meanings of blocked owners remain explicitly unknown.

The expanded scan still exposes **2,306 scoped-source literal/shorthand rules**
(1,920 direct sizes + 386 shorthands), plus unresolved inline/JS candidates.
Those are a separate unfinished semantic ledger. They must not be silently
collapsed into the smaller CSS counter or called valid merely because they are
scoped styles. Full raw entries are reproducible with the auditor's `--json`.

## Browser witnesses and genuine falsification

The two typography suites are now wired into both canonical UI scripts, and thus
Public PR CI's canonical full shards. The method suite is split by route so every
route keeps the existing 90s timeout; no font, geometry or overflow assertion is
relaxed. Native details are opened through real controls after the existing
hydration-ready helper. Default OpenEVO diagrams and expanded carriers are
captured separately. Capture-only hidden sticky chrome and disabled animations
are explicit screenshot state; assertions run on the original page.

New/strengthened common-assertion negatives:

- 9px SEED explanation must fail the same visible-role assertion as normal text.
- Arial on a native carrier button must fail that same family assertion.
- The old 72px Lab label column must fail the same text-line assertion; text
  Range rectangles avoid the false positive from Grid's stretched item height.
- 9px Compare data must fail the same size/family/geometry assertion as normal rows.
- The existing two-column phone SEED exchange negative remains in place.

Representative routes: `/`, `/landscape/`, `/lab/`, `/models/qwen3-8b/`,
`/papers/agentbench/`, `/compare/?models=qwen3-8b,gpt-oss-20b`, and the three
`/research/seed-openevo/flow/{seed,openevo,webshop}/` routes. These are nine
browser route samples, not 268 screenshot approvals. Widths 390/768/1440,
light/dark and Chromium/WebKit remain required; Home adds 414px to exercise the
actual changed phone range. Current Astro configuration generates Chinese-only
routes; no `/en/` route was invented or enabled. Mixed Chinese/English technical
text remains in the real samples.

## Real failures retained, not painted green

1. `c5d0f4f3` Public PR CI run 39453296970: deterministic gate passed; new product
   witnesses found the previously unwired test's navigation inside closed
   `.model-detail-actions`. Fix: click the actual summary before checking visible
   nav. Do not remove the visibility/size/family/overflow checks. The run remains
   red and is not final acceptance. Its uploaded shard-1 artifact is 12278883799.
2. The new carrier screenshot initially targeted a closed native `<details>`;
   fix the state and require visible text. WebKit also exposed SSR/native-control
   timing; use the repository hydration helper before interaction.
3. A preliminary broad browser run was invalidated by a concurrent `dist`
   rebuild. Discard it. Later runs use fixed dist, unique output/cache/ports.
4. A cloud local `astro check` picked up generated Playwright HTML-report JS and
   was terminated. Preserve that report outside the checkout; use list reporter
   during development. Exact c5d0f4f3 hosted deterministic CI passed on clean source.
5. **Unresolved broad WebKit interaction gate:** existing
   `research-explainer-layout.spec.ts` mobile-light times out on the SEED Next
   control. Candidate output reported `.irx-stepper` intercepting pointer events.
   An isolated clean worktree at **4b7017a3** reproduced the Next-control timeout
   at the same test line 214. Artifacts live in task scratch with separate ports,
   outputs and cache. This shows the baseline also fails; it does not prove the
   complete causal mechanism. Core transport/stepper CSS and the broad geometry
   test overlap #806. No force-click, timeout extension or owner overwrite was used.

## Visual review so far

Actually opened the updated 390-light Lab diagram and 1440-light SEED stage:
label truncation is resolved; connectors and node boxes remain separate; ordinary
numbers and mixed text are readable. Opened Home 390-dark default viewport and
Landscape 390-light default viewport: no clipping was visible. The latter did not
show the modified statistics, so a target-region capture was added; it is not yet
counted as a statistic visual PASS. All final engine/theme/width captures must be
reviewed from the final run and recorded on the PR.

## Concurrent state and remaining acceptance

At the second audit all 35 PRs remain open. #901 moved to `bbb87787` and now also
owns package/lockfile, LATEST, preflight and figure audit changes. Its current
package additions and LATEST hunk were read; this workline does not import or
replace them. #895/#806/#816 heads and production path sets remain as recorded.
#898 stays Draft, stacked on #895; no other PR is merged, closed or rewritten.

Pending: final clean-head preflight, Public PR CI, complete screenshot review,
the broad WebKit failure and concurrent owner reconciliation, 2,306 scoped rules,
then an exact-SHA dedicated Review Preview. `review-preview.yml` still requires
base=main; the final gate must not be armed on this Draft/stacked PR. Provider
protection or a blocked browser gate must be reported rather than bypassed.
