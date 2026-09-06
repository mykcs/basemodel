# Scientific-state provenance for public research pages

Last reviewed: **2026-08-26**

Status: **current**
Audience: research, content, UI, review, and release Agents

This contract prevents a fast-moving experiment from being frozen into `basemodel` as an undated “current phase”, “current allocation”, or “current result”. The public site is a presentation layer; it is not a second experiment-state database.

For the end-to-end cross-repository handoff from experiment evidence to public website release, follow [`experiment-result-publication-workflow.md`](experiment-result-publication-workflow.md). Its experiment-side counterpart is [`mykcs/openevo-experiment/docs/experiment-tracking/RESULT_PUBLICATION_HANDOFF.md`](https://github.com/mykcs/openevo-experiment/blob/main/docs/experiment-tracking/RESULT_PUBLICATION_HANDOFF.md). This file remains the authority for scientific-state ownership and freshness; the workflow document owns the transport/intake/release procedure.

## Source of truth

For OpenEvo × WebShop, scientific state belongs to `mykcs/openevo-experiment`.

Resolve live state in this order:

```text
actual openevo-experiment checkout / branch / SHA used by the scientific work
-> configs/experiment/current-campaign.json on that branch
-> latest valid reconciliation / result for that campaign or successor
-> scientific claim boundary recorded by that evidence
```

An active scientific branch may intentionally be ahead of default `main`. Do not replace a newer active-branch result with an older default-branch status page merely because `main` is easier to fetch.

## Scientific lifecycle state is not one boolean

For experiment-facing pages, keep at least these states semantically separate when they apply:

```text
registered / preregistered / locked
!= execution authorized
!= observed running
!= execution completed
!= result sealed / publishable
```

Each transition requires its own upstream evidence/receipt. A website label, deployment, or code merge may **project** an upstream state but cannot create scientific authorization, running state, completion, or a sealed result. If the upstream evidence does not provide an actual start/end time, keep it unknown rather than inventing an ETA, percentage, or timestamp.

Also separate **measurement identifiability** from **measured effect**. A causal contrast that cannot be formed (for example because two required model states resolve to the same bytes and the task vector is zero by construction) is `not identifiable`/blocked evidence, not an observed zero causal effect. Preserve the predecessor design and its failure reason; a successor experiment may repair identifiability, but it does not retroactively turn the predecessor into a valid null result.

Tests should reject impossible state combinations (for example `running` without a run-start receipt, `sealed` without a result receipt, or `locked` with active execution timestamps) instead of merely snapshotting a status string.

## What a static public site may say

A static page may publish a **dated, branch-labelled snapshot**, for example:

```text
Default-branch snapshot
openevo-experiment/main
checked 2026-08-18
H1.27 · completed-descriptive-only
```

That snapshot must visibly remain a snapshot. It must not be worded as if it proves the live campaign is still H1.27 after the checked date.

Historical phases such as Phase D–F, Phase G, H0, or later H1.x diagnostics may remain when the page clearly labels them as historical evidence or dated milestones.

## What must not be copied as live truth

Do not hard-code these as undated current facts in public copy, metadata, tests, or Agent instructions:

- `current phase = H0` or any other phase that can advance;
- `current experiment allocation = 5×RTX5090` or any other allocation that can change;
- a particular “next experiment” after the scientific branch has moved;
- an old campaign ID as the live campaign merely because it once powered the page;
- W&B group/version metadata as the authority for scientific state.

A regression test that requires a stale current phase is itself a stale contract and must be corrected rather than forcing the page back to old language.

## GPU allocation and server inventory

Keep these concepts separate:

```text
server inventory / visibility
!= experiment allocation
!= authorization to use a GPU
!= live idle capacity
```

Live GPU use comes from the current private laboratory execution policy plus the active preregistration, explicitly authorized GPU UUIDs, and live-idle checks immediately before launch.

A historical `5×RTX5090` allocation may remain as historical evidence. A dated server audit may state that 8 RTX 5090 GPUs were visible when that audit supports it. Neither fact should be rewritten as the current allocation without current run evidence.

## Public-page pattern

Prefer this structure:

```text
stable subject heading
-> historical measured results, clearly dated/labeled
-> dated default-branch snapshot, if useful
-> link/instruction for resolving live state from the actual experiment branch
-> claim boundary
```

For a live-state callout, use language equivalent to:

```text
actual branch -> current-campaign.json -> latest reconciliation/result
```

For GPU state, use language equivalent to:

```text
parent execution policy + preregistration + authorized UUIDs + live-idle check
```

## Testing contract

Tests should protect provenance semantics, not one ephemeral phase value.

Good assertions:

- current-facing pages link or route to `current-campaign.json`;
- live-state copy mentions the actual branch and reconciliation/result;
- default-branch snapshots include a checked date and branch label;
- historical Phase G/H0 copy is explicitly historical;
- current-facing copy does not claim a fixed GPU allocation;
- W&B remains observational rather than authoritative.

Bad assertions:

- `expect(page).toContain('Current phase: Phase H0')`;
- `expect(page).toContain('Current allocation: 5× RTX 5090')`;
- forcing old “next step” copy to keep a unit test green.

## Refresh trigger

Re-check scientific state when any of these occurs:

- `openevo-experiment` records a new campaign, reconciliation, or result;
- an active scientific branch becomes the operative experiment branch;
- user-facing copy uses words such as “current”, “now”, “next”, or “active” for experiment state;
- a PR changes results, experiment navigation, hardware allocation wording, or research metadata;
- a stale-state audit or user report identifies contradictory phase/allocation claims.

When updating the static snapshot, change the checked date/source commit together and preserve older experimental evidence as history rather than rewriting it.
