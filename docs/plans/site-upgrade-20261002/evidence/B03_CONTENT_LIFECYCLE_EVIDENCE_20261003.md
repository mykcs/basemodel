# B03 content lifecycle evidence

Status: implementation evidence for PR #819. B03 is stacked on D01 PR 822; B01 PR 817 remains a merge-order dependency but is not copied into this branch.

## Four separate clocks

B03 deliberately separates:

1. **experiment status** — historical / completed / in progress;
2. **evidence completeness and role** — complete / partial / unavailable; training / development / frozen final;
3. **content review time** — when the website projection was actually reviewed against the pinned evidence;
4. **site publication time** — null until a production release is independently confirmed.

A CSS/layout edit therefore cannot refresh scientific evidence, and an old frozen result does not become false merely because 30 days passed.

## Source revision → review impact

D01 already owns evidence IDs, source-byte revisions, comparison roles and the consumer map.

B03 pins the lifecycle record to that exact revision. If a future source revision changes:

`reviewImpactForEvidenceRevision(evidenceId, observedRevision)`

returns `review-required` plus the registered consumers. The audit fails closed until a human/Agent deliberately reviews those consumers and updates the lifecycle record.

No background service or live W&B/server lookup is added to the static build.

## Three consumer projections

### Results

Results shows evidence role/completeness/capture time/content-review time separately. It does not duplicate the metrics themselves.

### Reproduction

The run guide distinguishes:
- public reproducibility protocol;
- restricted private machine/path identity;
- historical checkpoint verification versus a later reread that was not completed.

Restricted access is not rendered as “missing,” and a private checkpoint is not presented as anonymously downloadable.

### Archive

Archive preserves one concrete history boundary:
- the 2026-09-18 frozen Final remains a frozen-final judgment;
- the 2026-10-01 R200 training evidence changes the late-training interpretation only;
- later training evidence does not back-edit the frozen Final into a new result.

## Author path

For a newly approved evidence source:

1. D01 imports/validates the source and publication permission.
2. Its evidence ID/revision changes or becomes available.
3. `npm run audit:research-lifecycle` reports impacted consumers.
4. The author reviews only those result/body/chart/navigation owners.
5. The lifecycle `contentReviewedAt` and expected revision are updated deliberately.
6. `sitePublishedAt` remains null until production publication is independently confirmed.

This is intentionally a repository workflow, not an editorial backend.
