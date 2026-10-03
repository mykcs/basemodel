# C01 scientific table evidence

Status: implementation evidence for PR #827. C01 is stacked on BaseModel #805 so the rank32 source publication exists on the same branch. The broad design-system PR #806 remains independent; C01 keeps its new table CSS scoped.

## Why a new owner exists

The repository already has many ordinary HTML tables, but no shared owner for a research table that must keep:

- scientific raw values distinct from display precision;
- explicit missing / unrun state;
- comparison scope and notes next to the table;
- HTML, CSV, and LaTeX generated from one view object;
- local horizontal scroll without page overflow;
- native table semantics and print behavior.

C01 therefore adds a narrow `ScientificTable` owner rather than a universal TableBuilder.

## Caller 1 — rank32 capacity

Source: the published #805 `post-advisor-ab-final-20260928.json`.

The table reads rank128/rank32 Task Score, exact-success counts and adapter bytes directly from that JSON. It does not restate those values in a second data file.

The CI crossing zero remains in the table notes and is explicitly **not** treated as equivalence or strict non-inferiority.

## Caller 2 — same frozen Final

Source: `effectiveStateGdrLoraStudy.ts`, which owns the same-panel frozen Final values and panel identity.

The table contains only the local rows that share the same frozen 128-task Final. Training-period last-20-round means stay in their existing later training-dynamics table instead of being mixed into the Final. The SEED paper remains a nearby external reference because it uses a different 128-task validation panel.

The dynamic α+β row is represented with `null` result cells. HTML shows an em dash, CSV exports `NA`, and LaTeX exports `\\textemdash{}`; no path turns the unrun method into zero.

## Export contract

- CSV uses raw values, not rounded display strings.
- String cells beginning with spreadsheet-formula characters are prefixed safely; numeric negative scientific values remain numeric.
- LaTeX escapes `& % $ # _ { } ~ ^ \\` in text.
- The LaTeX view uses booktabs-style `toprule/midrule/bottomrule` commands but does not copy a conference template or font.
- Normal HTML remains the primary accessible surface.

## Mobile / accessibility

The table is a real `table` with caption, column headers and row headers. Narrow screens get a focusable local scroll region. There is no sticky column, so a frozen column cannot cover data. Print removes export controls and lets the table use the printable width.

Q01 still owns independent cold reading; C01 automated checks do not claim that a human reader has understood the result.
