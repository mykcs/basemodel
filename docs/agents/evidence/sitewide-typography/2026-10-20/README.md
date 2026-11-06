# Typography continuation: audit and method-diagram migration

Latest followthrough and superseding counters: [available-owner CSS closeout](OWNED_CSS_CLOSEOUT.md).

The rest of this file is the **initial c5d0f4f3 batch receipt**.

Status: **PARTIAL — not whole-site acceptance**. The canonical working PR remains
[#898](https://github.com/mykcs/basemodel/pull/898), stacked on #895. No merge,
retarget, Production deployment, scientific-data or claim change is authorized by
this receipt. Exact post-commit CI/browser receipts are recorded on that PR.

## Identity and ownership

Starting #898 head: `4b7017a3c08990c4387b740a3bdacd978abb8829`.
Live main read at intake: `793a7ffc5afb2f2ff2df3341942f30e17f9f3bbc`.
`ownership.json` captures all 35 open PRs with head/base and full changed-path
sets, including #895, #806, #816, #901 and the additional #814 workflow owner.
The cloud checkout was clean and switched to the exact #898 head before edits.

Production changes stay in `interactive-research-explainer-methods.css`, owned by
#898. Parent #895's `package.json` and typography auditor are extended as explicit
child-stack deltas; #895's live head was still `9a18359d`. No parent branch was
changed. #806/#816 production files remain untouched.

The Public PR CI evidence-upload tail is a narrow transplant of already-merged
main (#900), with JSON geometry added. #814 at `8d97bc29` was inspected: its
static-build sealing/download changes remain independent and are not imported.
No #901 workflow is copied, and no new workflow, runner, permission or trigger
is introduced.

## Actual reader problem and implementation

Readers following SEED's policy/harness/environment relationship encountered
7.7–10.9px labels/prose, heavy monospace stage headings, and cramped direction
labels. OpenEVO carrier state and Lab server descriptions had the same problem.
The existing semantic diagram remains; scientific inputs and claims do not change.

- Stage, responsibility, validation and carrier labels use existing meta tokens.
- Benchmark descriptions and offline-pipeline titles use body-small tokens.
- Figure/server titles and inspector headings use their appropriate roles.
- Technical revision/GPU IDs retain mono; prose and ordinary labels use interface.
- The runtime connector reserves 84px minimum; intermediate message lanes stack;
  output text can wrap. Node geometry changes with text size.
- No token, global override, import-order change or new `!important` is added.

Direct CSS literal sizes: **249 → 232** (17 migrated). Literal-size `font:`
shorthands in independent CSS: **50 → 24** (26 migrated). These are different
metrics; do not add font-property declaration counts and call them font sizes.

`route-inventory.json` contains **268** static routes, **73** Figures and **130**
Tables. Static traversal is not 268-route visual acceptance. Method changes are
witnessed on `/research/seed-openevo/flow/seed/`, `/flow/openevo/` under that same
prefix and `/lab/`; the existing geometry suite also exercises their bilingual
and stateful consumers. Exact distinct route coverage must come from the run,
not from this static file count.

## Audit scope and remaining debt

The existing auditor now parses CSS declarations (including multiline shorthand)
using PostCSS from the locked Astro toolchain. `--json <path>` emits original
file/line/column, selector, nesting, property/value, explicit unknown consumers,
route counts and unresolved inline/JS style candidates. Two parser tests protect
comment exclusion, nested contexts, original Astro line numbers, shorthand debt
and unknown dynamic expressions, and run through `audit:typography` in build.

The broader scan exposes **1,920** additional direct-size declarations inside
Astro style blocks and **410** literal-size shorthands across CSS + Astro after
this batch. These include paper figures, slides and dedicated geometry; they
are **not automatically defects or justified exceptions**. The prior 249 count
never covered this surface. `inventory.json` retains individual CSS debt and a
per-file scoped-source summary; regenerate complete scoped entries with:

```sh
node scripts/audit-sitewide-typography.mjs --json /tmp/typography-full.json
```

CSS debt currently has 244 concurrent-owner entries, seven provisional justified
exceptions, and five remaining migration entries (direct-size + shorthand).
The exceptions still require their applicable browser witness; a glyph or relative
inline-code size is not proof that a text paragraph may be tiny. Scoped-source
semantic classification is **unfinished**. Do not report unclassified=0 globally.

## Validation and visual evidence

- Node 24.19.0; `npm ci`: exit 0.
- Intake build and deterministic gate: exit 0; the latter overlapped subsequent
  working-tree edits and is preflight evidence, **not exact-head final acceptance**.
- Parser tests: 2/2 pass. Lint of edited JS/TS and `git diff --check`: pass.
- Initial SEED Chromium witness: 8/8 pass at 390/768/1440, light/dark; initial
  390-light and 1440-light images were actually opened. Sticky chrome contaminated
  the tall element capture; capture-only hiding now excludes chrome after all
  original-page assertions. This is documented capture state, not a product fix.
- One intermediate browser run was invalidated by rebuilding `dist` while it
  was active. Its result is discarded, including any passing cases.
- Expanded cross-browser method/geometry checks: see exact post-commit PR receipt.
- The role assertion is shared by normal witnesses and restored-9px rejection;
  the method and product-tools suites are now explicitly included in `test:ui`
  and `test:ui:all`, so Public PR CI full shards select them.
- PNG and geometry JSON use Playwright `testInfo.outputPath`. The adopted CI tail
  retains each shard's screenshots, JSON and failure traces for three days.

WebKit's Debian 13 binary was downloaded in the cloud. Missing Debian libraries
were downloaded and extracted under task scratch, then linked into the task-owned
Playwright cache because the runtime wrapper replaces `LD_LIBRARY_PATH`. No root,
Mac, RDC, secret or repository runtime change was used. A real WebKit launch and
page render succeeded. The host-validation shortcut is needed only because its
ldconfig-based GLES check cannot see these task-local libraries; actual browser
execution and every acceptance assertion remain required. This environment setup
is not evidence that a WebKit test suite passed.

## Preview and unfinished boundaries

Use the Vercel skill and existing dedicated review-only project after exact-head
checks. The trusted `review-preview.yml` requires base=main and cannot dispatch
#898 while it remains stacked. The final-gate helper is also inapplicable while
Draft/stacked. A dedicated review-only plugin deployment may be used without
retargeting, merging or touching Production. Do not reuse the historical
`911b5acf` Preview as current evidence or count an SSO login response as acceptance.

Remaining: owner-by-owner classification/migration across scoped source, #806 /
#816 / #895 / #865 overlap resolution, complete UI preflight, exact-head hosted CI,
inspected screenshot matrix, same-SHA review Preview, and user visual approval.
