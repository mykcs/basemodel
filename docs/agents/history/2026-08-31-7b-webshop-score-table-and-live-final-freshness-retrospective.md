# 7B WebShop 分数表与 MiniMax live-final 新鲜度复盘 — 2026-08-31

Status: **historical case / reusable Agent friction record, not current authority**
Conversation scope: 2026-08-30/31 这一轮 `7B / self` Results 页面分数展示、论文表格转 HTML、`7B + MiniMax` 状态纠错与发布收尾。
Primary current owners: `../current/scientific-state-provenance.md`, `../current/experiment-result-publication-workflow.md`, `../current/research-site-presentation-contract.md`, `../current/ui-change-visual-acceptance-gate.md`, `../current/deployment-policy.md`.

This case extends the earlier capability-exploration retrospectives. It records a narrower but expensive-to-forget failure mode: **the website already had a Pending slot, the experiment had actually finished, and the first publication pass repeated the stale Pending state because live scientific authority was not refreshed before writing.**

If this file disagrees with current policy, executable repository truth, live `mykcs/openevo-experiment` evidence, or current provider state, this file loses.

## Executive summary

The user supplied SEED Table 1 as an image and asked to change the score presentation on the 7B/self analysis page: render the comparison as real HTML, show our **OpenEVO 7B / no external teacher** row, and keep a row for **OpenEVO 7B + MiniMax**.

The first implementation made two good product decisions and one important scientific-state mistake:

- good: use a semantic HTML table rather than embedding the screenshot;
- good: show the paper's Qwen2.5-7B-Instruct WebShop slice beside local OpenEVO results with an explicit cross-protocol boundary;
- mistake: leave `7B + MiniMax` as `Pending` without first re-reading the current experiment-side final evidence.

The user immediately challenged that assumption: “OpenEVO · 7B + MiniMax 是不是做完了？” A fresh experiment-side audit showed that it **was already complete**.
The sealed historical 7B + MiniMax result was:

| Layer | Historical result |
|---|---|
| Old Stage 2 execution | `80/80` blocks complete |
| Old Stage 2 optimizer updates | `0` |
| Primary final | `128/128`, reconciliation `pass` |
| WebShop Task Score ×100 | **16.94** |
| Exact success | **0/128 = 0.0%** |
| Valid episodes | **116/128** |
| Matched local 7B base | **13.33**, exact success `3/128` |

The earlier 7B/self final on the same local panel remained **25.66**, exact success **4/128 = 3.1%**. Therefore the historical MiniMax arm was not merely “finished”; it had a final score that was already materially different from the self arm.

PR **#353** (`9ef9bf9`) introduced the HTML comparison table but still published MiniMax as Pending. The subsequent correction landed through PR **#354** (`a8918a0`), which filled the sealed MiniMax result and also made the historical 16-of-1,440 bootstrap branch explicit. Current `main` has moved further since then, so these SHAs are provenance only.

## Conversation arc

### 1. User asked for a paper-style score presentation, not another prose summary

The starting request was concrete: change `/research/seed-openevo/study/results/7b-self-analysis/`, turn the supplied paper table into HTML, identify our method as OpenEVO, show the 7B/no-teacher result, and keep a MiniMax-teacher row.

The implementation correctly treated the paper screenshot as **data to transcribe**, not as the final webpage asset. That preserved inspectability, accessibility, responsive control, and future result fill-in.
### 2. The page used the Qwen2.5-7B-Instruct / WebShop slice

The paper image contains ALFWorld, Search-based QA, and WebShop for several model families. Our local OpenEVO result in this page only measures WebShop on Qwen2.5-7B-Instruct.

The first implementation therefore rendered the **Qwen2.5-7B-Instruct WebShop columns** rather than fabricating local ALFWorld/Search-based-QA cells. The table preserved the paper rows, including Vanilla, OPSD, GRPO-family methods, SDAR, and SEED.

This narrowing was scientifically defensible, but the user had literally said “把这张表在 HTML 里面写出来”. Future Agents should not silently narrow a requested full paper table. Use one of two explicit patterns:

```text
A. clearly label the component as “Table 1 · Qwen2.5-7B-Instruct / WebShop slice”
or
B. render the full paper table and mark our unmeasured cells as “— not measured”
```

Never use `0` for a benchmark we did not run.

### 3. The first result table correctly separated paper context from local measurement

The paper row `SEED (Ours) = 89.7 / 78.1` and the local OpenEVO numbers do not share a proven paper-final 128-task denominator or checkpoint lineage.

The page therefore added a visible reading boundary: putting the values in one table is for orientation, **not** evidence that `89.7 - 25.66` or `89.7 - 16.94` is a causal method effect.

That boundary belongs in the visible reading path because it changes interpretation. It is not an optional provenance detail.
### 4. The first publication pass repeated stale scientific state

The BaseModel source still contained `OpenEVO · 7B + MiniMax` with a Pending final. That was a valid historical scaffold, but it was **not** evidence that the experiment was still unfinished.

The mistake was procedural:

```text
read current website component
-> see Pending
-> assume Pending is still true
-> publish the same Pending state
```

The correct sequence is:

```text
result/publication task begins
-> refresh exact experiment-side authority
-> resolve completion + result + claim boundary
-> only then read the website as a derived surface to update
```

This distinction already exists in `scientific-state-provenance.md` and `experiment-result-publication-workflow.md`; this conversation demonstrates why it must be executed, not merely remembered.

### 5. The user's status question exposed the stale assumption immediately

Once asked whether MiniMax was already done, a fresh experiment-side audit found four independent completion layers:

- the old Stage 2 execution state was complete;
- all `80/80` blocks were closed;
- Stage-2 optimizer updates were still `0`;
- both 64-task final-eval cells passed, giving `128/128` total rows and a passing reconciliation.
The two cell summaries had mean raw scores `0.16107` and `0.17780`; the authoritative aggregate was `0.169438...`, displayed as **16.94**. Exact success was `0 + 0 = 0/128`, and valid episodes were `57 + 59 = 116/128`.

Against the matched local 7B base, the mean Task Score delta was about **+3.61 points**, but the paired-bootstrap 95% interval crossed zero (approximately `[-0.29, +7.67]` points). Therefore the historical run supports a positive observed mean difference from base, **not a proven stable MiniMax win**.

### 6. “Finished” did not mean “Stage 2 learned”

The most important semantic distinction in the status answer was:

```text
Stage-2 interaction schedule finished
!= Stage-2 parameter learning happened
```

This historical MiniMax arm completed the old Stage 2, but Stage 2 made **zero parameter updates**. The final evaluation therefore measured the already-existing MiniMax-bootstrap adapter rather than a new Stage-2 checkpoint.

Future status answers should separate at least:

```text
rollout/execution completion
optimizer-update completion/count
final-evaluation completion
post-final diagnostic completion
```

A single word such as “done” is safe only after naming which layer is done.
## Scientific reasoning lessons

### Lesson A — 16.94 is a historical branch result, not “full MiniMax 1,440”

The later correction also made an adjacent scientific fact explicit: MiniMax had analyzed all `1,440/1,440` Stage-1 trajectories, but the historical bootstrap path only selected **16 / 1,440** analyzer records for parameter training and reused that same 16-record set across the sequential SD-LoRA increments.

Therefore:

> `16.94` must not be described as “OpenEVO after fully learning all 1,440 MiniMax analyses”.

It is the result of the historical path that learned from the 16-record subset and then ran an old Stage 2 that never updated parameters. It also does **not** prove SD-LoRA itself is ineffective.

Current `main` now archives that old Stage-2 design as superseded. A future Agent must not carry `16.94` into a newer Ceiling/OpenEVO-stage result table as though it were the new algorithm's score.

### Lesson B — Task Score and exact success must stay side by side

For the historical 7B + MiniMax final:

```text
Task Score ×100 = 16.94
Exact success    = 0 / 128 = 0.0%
Valid episodes   = 116 / 128
```

This means the run made graded task progress on many episodes while completing none of the 128 tasks exactly. Showing only 16.94 hides that distinction; showing only 0.0% hides graded progress.
### Lesson C — “有老师” is reader shorthand, not the causal mechanism

The requested row says “有老师 MiniMax”, but the mechanism remains **post-episode hindsight analysis**. MiniMax did not replace Qwen as the WebShop actor and did not click/search inside the episode.

Keep the friendly label if useful, but put the precise analyzer role next to it. Cross-arm claims should be phrased as a historical treatment-path difference unless the design actually isolates analyzer identity.

### Lesson D — paper ranking decoration must not erase protocol boundaries

The paper table highlights best and second-best values. Recreating those highlights in HTML is useful because they are part of the paper's visual semantics, but those decorations apply only to the **paper-reported block**.

Do not automatically rank the local OpenEVO rows against paper rows as though they were one controlled leaderboard. Separate group headers plus the visible comparison boundary are safer than one global “best” style.

### Lesson E — percentage formatting should preserve the count

The paper reports one-decimal percentages. For local `4/128`, the table used `3.1%`, but kept `4/128` directly underneath. This avoids hiding denominator semantics behind rounding.

For `0/128`, `0.0%` is a real measured zero because all 128 final tasks were evaluated successfully enough to enter the scientific denominator. That is different from an absent/Pending value and different from a measurement-invalid zero.

## Engineering friction and recovery patterns

### Friction 1 — stale website copy was treated as live upstream truth

This was the core failure. The website is a presentation layer; a `Pending` literal inside Astro source is not a completion oracle.
**Recovery:** query experiment-side execution/final artifacts, then treat the site as the stale derived surface. The authoritative check combined Stage-2 completion, final-seal/provenance evidence, both cell summaries, and the arm-level reconciliation.

**Reusable rule:** every Results edit that changes `Pending`, `current`, `running`, `finished`, `next`, or a headline metric must refresh `mykcs/openevo-experiment` first.

### Friction 2 — a structural test had frozen the obsolete Pending state

The regression test originally asserted that the MiniMax row contained:

```text
等待 primary final / primary final pending
```

Once live evidence proved the final existed, that test failed after the correct content change. The test was the stale contract, not the new score.

The repaired test asserted the scientific outcome instead:

- the MiniMax row exists;
- Pending wording is absent for this arm;
- `16.94` is present;
- `0.0%` is present;
- the paper/local comparison boundary remains present.

**Reusable rule:** tests should protect provenance semantics and closed facts, not force a dynamic scientific state to remain Pending forever.

### Friction 3 — the local `main` checkout was stale during the correction pass

The correction session discovered that local `main` was dozens of commits behind `origin/main`. Editing from that tree would have risked reintroducing already-superseded Results language.
**Recovery:** fetch current `origin/main`, create an isolated branch/worktree from that exact tree, and compare the intended result fill-in against current source before editing.

**Reusable rule:** fast-moving research publication work should not begin from “whatever local branch is open”. Resolve both the current website base and the current experiment authority.

### Friction 4 — shell dialect caused a harmless but avoidable failure

One local patch attempt used Bash-style heredoc syntax while Desktop Commander was running `fish`, producing a parser error before any mutation happened.

**Recovery:** rerun compound/heredoc commands explicitly under `/bin/bash`.

**Reusable rule:** if a command depends on heredocs, `VAR=value`, `set -euo pipefail`, or Bash compound syntax, select Bash explicitly rather than relying on the device default shell.

### Friction 5 — an existing Astro dev server was already running

Starting another dev server reported that one already existed on a different port. The correct action was not to kill the existing process blindly.

**Recovery:** reuse the already-running server for route inspection when it serves the intended checkout, or start an isolated worktree on a unique port. Do not terminate unrelated Agent work just to reclaim a preferred port.

### Friction 6 — the wide table needed local, not document-level, overflow

The paper-style table needs enough width to keep Method / analyzer / Score / Succ. legible. On a 390px viewport, the table can be wider than the component viewport, but the **document itself must remain viewport-bounded**.

The acceptance pattern was:

```text
document scrollWidth == document clientWidth
table wrapper scrollWidth > wrapper clientWidth  # allowed local horizontal scroll
```
**Reusable rule:** wide scientific tables may scroll inside their own wrapper; they may not force page-level mobile overflow.

### Friction 7 — strong local checks did not justify skipping release gates

For PR #353, targeted structural tests, Astro diagnostics, lint, build, desktop rendering, and 390px overflow checks all passed. However, the PR was merged while the self-hosted CI run was still in progress, and the non-main Vercel Preview had not supplied an accepted exact-head review surface.

Production later reached `READY` and the public route returned `200` with the intended table. That successful outcome does **not** convert the earlier merge timing into a reusable policy exception.

**Reusable rule:** for a non-trivial Results change, follow the current release owners: terminal required CI, exact-head Preview when required, route acceptance, then merge, then independent Production acceptance. A later green Production deployment does not retroactively satisfy a skipped pre-merge gate.

### Friction 8 — the correct tool depends on who owns the truth

This conversation crossed three state domains:

```text
GitHub       -> website source / PR / merge lineage
experiment   -> scientific completion and metrics
Vercel       -> Preview/Production deployment state
```

The failure happened when website source was allowed to stand in for experiment truth. The recovery worked because each question was sent back to its owner.

Use local/remote execution only when the scientific evidence genuinely exists there and has not yet been published into the connected repository. Do not use a stronger device/SSH surface merely because patching is more convenient.

## What worked well

### Semantic HTML preserved the paper's comparison logic

The table used actual `<table>`, `<thead>`, `<tbody>`, row headers, group rows, a caption, and numeric columns. This made the data inspectable and testable rather than flattening the paper into an image.
### Paper rows and local rows were visually grouped instead of globally ranked

A paper-reported block and an OpenEVO local block can share one visual while remaining different evidence domains. Separate group headers make the comparison readable without pretending all rows came from one evaluation protocol.

### Exact counts stayed beside rounded percentages

`4/128 -> 3.1%` and `0/128 -> 0.0%` preserve both reader-friendly percentage formatting and the scientific denominator. This also makes it easier to distinguish a true measured zero from a missing result.

### Production was verified from the provider and the public route

After PR #353 merged, Vercel metadata was checked for the production commit, terminal `READY`, and the public canonical route. The rendered HTML was then inspected for `SEED (Ours)`, the OpenEVO/self row, and the MiniMax row.

That is the right separation:

```text
source diff / local render
!= provider deployment
!= public route acceptance
```

The later MiniMax correction was likewise confirmed by current repository source rather than trusting the original conversation response.

## Smallest reliable workflow for the next Agent

When asked to place a paper benchmark table beside our latest result, use this order:

1. **Read current publication/provenance policy.** Load `scientific-state-provenance.md`, `experiment-result-publication-workflow.md`, the research presentation contract, and the matched scenario trigger.
2. **Resolve the exact paper slice.** Identify model family, benchmark columns, metric units, star/footnote semantics, and whether best/second-best highlighting is local to the paper block.
3. **Refresh experiment authority before touching Pending/current text.** Resolve the exact scientific branch/SHA, final seal or reconciliation, denominator, protocol, checkpoint identity, and claim boundary.
4. **Classify completion by layer.** Execution complete? optimizer updates? final eval? post-final diagnostic? Do not answer all four with one boolean.
5. **Write a Page Expression Brief.** Decide whether the user asked for the full paper table or a benchmark/model slice; if narrowing, label the slice explicitly.
6. **Use semantic HTML for exact comparisons.** Keep paper and local groups separate; preserve Score vs Succ. semantics; use `— not measured` rather than invented zeroes.
7. **Put the comparison boundary in the visible path.** If paper and local rows are not the same exact denominator/checkpoint/protocol, say so next to the table.
8. **Search every derived surface.** Find the experiment identity and the old Pending phrase across detail page, selector/matrix, result scaffold, analysis copy, tests, metadata, and bilingual routes.
9. **Update tests with the science.** Remove obsolete Pending assertions; assert the sealed values plus the invariant boundary that should remain true after future copy changes.
10. **Run deterministic and browser acceptance.** Use the current repository Gate, build, and required mobile/desktop/theme checks. For wide tables, check document-level overflow explicitly.
11. **Wait for the current release gates.** Required CI and exact-head Preview acceptance are distinct from local success. Merge only after the current policy says the head is accepted.
12. **Verify Production separately.** Check provider commit metadata, terminal state, public HTTP, expected values, and absence of stale Pending only for the arm that actually closed.

If the user later asks “是不是做完了？”, do **not** quote the page you just published. Re-run step 3 against the scientific authority because the experiment can advance faster than the static site.

## Anti-patterns to avoid

Do not repeat these mistakes:

- treat BaseModel's current Astro source as the live experiment database;
- preserve a Pending row merely because an old structural test expects it;
- answer “finished” without separating execution, optimizer updates, final eval, and post-final analysis;
- call `0/128` missing when the final evaluation actually measured all 128 rows;
- call a missing/Pending value `0.0%`;
- compare paper `89.7 / 78.1` directly with local `25.66 / 3.1%` or `16.94 / 0.0%` as a causal method delta;
- imply that historical `16.94` used all 1,440 MiniMax analyses in parameter training;
- infer that old Stage 2 learned because it completed 20,480 rollouts;
- silently narrow “the whole paper table” to one slice without labeling the slice;
- let a wide table create document-level mobile overflow;
- merge a non-trivial Results PR while required hosted acceptance is still in progress merely because local checks are green;
- patch from a stale local `main` when `origin/main` has materially moved;
- assume the default shell supports Bash heredocs;
- kill an unrelated dev server because it occupies the preferred port.
## Historical-state boundary and refresh cue

The numeric values in this record describe the **historical old 7B/self and 7B+MiniMax capability-exploration arms**. They are useful evidence, not the current OpenEVO-Ceiling algorithm's score.

By the time this retrospective was written, BaseModel `main` had already moved further and explicitly archived the superseded Stage-2 design. Future Agents must therefore refresh both repositories before reusing any of these labels:

```text
mykcs/openevo-experiment -> current scientific/result authority
mykcs/basemodel          -> current publication/reader surface
```

Do not infer a current experiment plan from PR #353/#354, this file, or the historical score table alone.

## Related current owners and historical cases

Read current owners first:

- `../current/scientific-state-provenance.md` — live scientific authority and freshness triggers;
- `../current/experiment-result-publication-workflow.md` — Pending-to-sealed-result intake and synchronized fill-in;
- `../current/research-site-presentation-contract.md` — visible result/boundary vs optional implementation depth;
- `../current/ui-change-visual-acceptance-gate.md` — responsive/theme/browser acceptance;
- `../current/deployment-policy.md` and `../current/release-closeout-protocol.md` — exact-head Preview, merge, and Production acceptance.

Complementary historical cases:

- [`2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md) — Pending scaffolds and 7B/self checkpoint fill-in;
- [`2026-08-30-openevo-capability-exploration-series-retrospective.md`](2026-08-30-openevo-capability-exploration-series-retrospective.md) — whole series, selector, visualization, and prior release friction;
- this file — paper-vs-local HTML score table, stale MiniMax Pending assumption, completion-layer audit, stale-test repair, and release-gate lesson.

The durable insight is: **a pre-built Pending slot is a useful publication structure, but it is never a live-state oracle. Every time a result page is touched, refresh the scientific authority first; then render exact comparisons in inspectable HTML with the protocol boundary visible.**
