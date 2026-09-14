# BaseModel sitewide normalization conversation closeout

Status: **historical closeout evidence; not current policy**

This record captures reusable lessons from the conversation that normalized BaseModel's design and public copy across route families, turned the work into a recovery-safe checklist, reconciled overlapping PR ownership, carried the candidate through browser/provider acceptance, and then verified the result on current repository state.

Current rules live in `docs/agents/current/*`. This file explains which failure modes mattered and which existing owners now prevent recurrence. It must not be used as live branch, provider, deployment, experiment, or scientific authority.

## Coverage boundary

Reviewed evidence includes the accessible conversation, the merged sitewide-normalization workline, its checklist and PR discussion, the later specialized SD-LoRA navigation reconciliation, current BaseModel governance, and the canonical conversation-closeout protocol in `mykcs/openevo-experiment`.

This closeout does not claim access to unavailable private reasoning. It reconstructs completion from durable repository/PR/provider evidence rather than from earlier assistant status sentences.

Temporary execution state is intentionally excluded: local PIDs/ports, worktree paths, scheduled-task identifiers, transient branch heads, Preview URLs, deployment IDs, provider queue state, and one-time percentages are not promoted into standing policy or long-term memory.

## What actually taught us something

### 1. A broad normalization task needs one execution checklist, not another style-guide authority

The repository already had strong design, copy, reader-attention, research-publication, theme, and UI-acceptance contracts. The initial risk was to create one more competing “BaseModel standard.” The safer pattern was to keep existing current policies canonical and create one task-specific checklist that translated them into concrete route-family work, code owners, tests, browser matrices, and delivery criteria.

That checklist was an execution authority for this task, not a new standing design policy. The durable design/copy rules remain in the existing current owners.

### 2. Sitewide consistency means shared cognitive responsibility, not identical page templates

The first cold read showed why mechanical normalization is unsafe. WebShop already entered object-first; ALFWorld still entered mechanism-first; the capability landing was already result/boundary-first and did not need a broad rewrite. A route can be different because its role is different and still be coherent with the same site.

The useful rule was therefore: prove a problem from current source/render/cold-read evidence, then repair the semantic owner. Do not convert every copy-audit candidate, eyebrow, card, or “先…” phrase into an automatic defect. `website-design-spec.md`, Reader Contracts, and the human-thinking contract already own this principle, so no duplicate rule was added here.

### 3. Localized route metadata did not guarantee localized visible body copy

A concrete bug escaped source-level confidence: the English Benchmarks route had localized page metadata while the shared body owner still rendered a hard-coded Chinese H1. The route existed, `<title>` was English, and the layout was healthy, but the user-facing body was still wrong.

This was the clearest missing use-site guard from the conversation. `ui-change-visual-acceptance-gate.md` now requires a shared bilingual body owner to verify visible H1 / lede / primary controls in both locales. Metadata and shell localization are not accepted as body-copy parity evidence.

### 4. Redundant labels are a semantic-density problem, not a ban on eyebrows

The benchmark overview repeated `环境 / 证据 / 对比` immediately above headings that already carried the full meaning. The SD-LoRA overview repeated its identity in an eyebrow while child pages used `NN / 07` as real sequence metadata.

The correction was selective: remove labels that add no information, retain labels that carry sequence, date, status, category, or provenance. The current human-thinking and copy contracts already own this distinction, so this closeout records the case without adding another eyebrow rule.

### 5. One sitewide survivor must not absorb specialized semantic ownership

The older audit-only workline was useful evidence but was not the release branch. The normalization PR became the single survivor for sitewide design/copy repair, while the separate Vanilla SD-LoRA Flow routing/navigation PR retained its own canonical-route and navigation ownership and was reconciled after normalization landed.

This is the existing multi-PR semantic-integration rule in practice: supersede stale audit baselines when their intent is absorbed, but preserve genuinely distinct semantic owners instead of merging every overlapping branch into one oversized PR.

### 6. Scheduled continuation is orchestration, not acceptance evidence

The hourly continuation task failed on repeated runs during the conversation. Those failures did not erase repository progress and did not justify restarting completed work. Manual continuation recovered by reading the canonical checklist, PR state, exact commits, tests, and provider receipts.

This belongs to the already-existing durable-artifact reconstruction rule in root `AGENTS.md` and the progress-report rules in current Agent principles. No scheduler-specific standing policy was added: the reusable lesson is that an automation run is a delivery mechanism, while Git/PR/test/provider artifacts are task state. Once the Definition of Done was reached, the continuation automation was stopped instead of being left to manufacture churn.

### 7. The accepted release head must not mutate itself just to document its own PASS

The task checklist intentionally retained an unchecked provider line on the accepted product head even after the exact-head provider gate passed. The live PASS receipt was stored in PR metadata/comment so the accepted SHA stayed unchanged. Later status reconstruction had to combine the checklist with that non-head-changing receipt.

This can look incomplete if someone reads only the checkbox, but changing the accepted release branch after provider acceptance would create a new head and invalidate the evidence. `release-closeout-protocol.md` already owns this exact rule and a prior historical case already explains it; this closeout does not create a second release policy.

### 8. “Done” must be re-read from live repository state

The conversation spanned enough time that a previously accurate “Ready, not merged” status later became stale: by the final audit, the normalization PR and the specialized navigation PR had both merged and `main` had advanced again. The final answer was correct only after re-reading live PR/main state.

This is a recurrence of the broader exact-state discipline, not a missing new rule. Root `AGENTS.md` already says to reconstruct status from durable artifacts before declaring blocked or done. The lesson here is why that check belongs immediately before owner-facing closeout language.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Owner asked to organize many standards and normalize the site | Repeated preference family | Reuse canonical current policies; use one task checklist to execute them, not another style-guide authority | Existing design/copy/reader contracts + task checklist | Avoid authority duplication |
| ALFWorld entered mechanism before benchmark identity while WebShop did not | Same-family transfer failure | Normalize cognitive responsibility from rendered evidence, not by templating every sibling route | `website-design-spec.md` + Reader Contract | Existing object-first / route-role owners |
| English Benchmarks metadata was localized but visible H1 remained Chinese | New concrete gap | Shared bilingual body owners must verify visible H1/lede/controls in both locales | `ui-change-visual-acceptance-gate.md` | Browser-visible locale parity is a UI acceptance concern |
| Benchmarks/SD-LoRA had redundant small labels | Repeated visual-density family | Remove label only when it adds no independent sequence/status/category/provenance information | `human-thinking-web-expression-contract.md` | Existing semantic-density owner already states this |
| Old sitewide audit and specialized SD-LoRA route work overlapped normalization | Repeated multi-Agent integration family | Keep one normalization survivor, close absorbed audit baseline, preserve specialized route/navigation owner | `multi-pr-semantic-integration-playbook.md` | Existing semantic-owner integration procedure |
| Hourly continuation runs failed | Repeated orchestration friction | Recover from checklist/PR/test/provider artifacts; automation is not progress authority | root `AGENTS.md` + current Agent principles | Existing durable-artifact/status discipline |
| Provider PASS was not written back as a new checkbox commit | Known release-closeout family | Record acceptance without changing the accepted head | `release-closeout-protocol.md` | Existing exact-head receipt owner |
| Earlier chat status became stale after PRs merged | Repeated exact-state family | Refresh live main/PR state immediately before completion language | root `AGENTS.md` | Existing status-reconstruction rule |

## Repeated-mistake audit

The conversation did repeat known failure families, but mostly as **activation/orchestration** problems rather than missing policies:

- automation failed more than once, yet repository state remained recoverable because the task had a single durable checklist;
- completion state changed after earlier reports, so relying on conversation prose alone would have been wrong;
- overlapping PRs could have become duplicate current owners, but the semantic-integration rule was applied and the specialized owner survived;
- exact-head acceptance could have been invalidated by an evidence-only source change, but the existing non-head-changing receipt rule was followed.

Because these rules already existed, repeating them in more current policy files would make the knowledge system worse. This closeout adds only the concrete bilingual-body acceptance guard that was still missing, and records the other incidents as historical evidence linked to their current owners.

## Future-Agent test

A new Agent starting from repository bootstrap should be able to answer these before changing a broad user-facing surface:

1. Which existing current policies own the requested design/copy behavior, and is the new document an execution checklist or an accidental second policy?
2. Which route role is being reviewed, and is the suspected defect proven by current source/render/cold-read evidence?
3. If a component serves both locales, did the **visible body** actually change language, or did only metadata/shell copy change?
4. Which PR is the current survivor for the broad work, and which overlapping PR owns a genuinely different semantic surface?
5. If a scheduled continuation failed, what do the checklist, branch/PR, tests, and provider receipts say happened?
6. If an exact-head gate already passed, can the remaining evidence be recorded without mutating that head?
7. Immediately before saying “done,” did live `main` / PR state get re-read?

If those checks are performed, the main failures from this conversation are less likely to recur without creating a second governance system.

## Temporary state intentionally not promoted

No local server port, PID, worktree path, scheduling identifier, transient progress percentage, Preview URL, deployment ID, provider queue state, or one-time branch head is made current policy by this closeout.

PR numbers are retained only where they identify durable project lineage/ownership decisions; current live state must still be re-read before future action.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. Repository documentation is the durable project record and remains separate from model/account memory.
