# Remove direct model navigation — conversation closeout

Status: **historical closeout evidence; not current policy**

This record captures the reusable lessons from the follow-up conversation that removed the direct `模型 / Model / Models` navigation entries after the Base Model Flow → Models migration. Current authority lives in `docs/agents/current/*`; this file explains why the navigation/HPL use-site rules were tightened.

## Coverage boundary

Reviewed evidence includes the accessible conversation, merged PR #672 product diff, current BaseModel governance, HPL/cold-read evidence, and the canonical conversation-closeout protocol. It does not claim access to unavailable private reasoning.

Temporary execution state is intentionally excluded: local PIDs/ports, worktree paths, transient branch heads, one-time reviewer transport errors, Preview/share URLs, deployment IDs, provider queue state, and intermediate `main` SHAs are not standing policy.

## What actually taught us something

### 1. Removing a navigation entry is narrower than deleting the model capability

The owner first pointed at the research navigation, then clarified that the homepage/global navigation must not keep exposing the same direct model-catalog entry. The correct abstraction is a **shared navigation-promotion correction**: remove the direct destination everywhere the shared shell promotes it, not the model content itself.

The same correction must not be over-applied. `/models/`, model detail pages, search, `Compare models`, and contextual Qwen experiment links remained valid because they serve distinct reader tasks. The durable acceptance pattern is therefore two-sided: prove the unwanted navigation entry is absent from every relevant shell, and prove at least one intended contextual/task path still survives.

### 2. A diagnostic interaction state is not the default-page cold read

One blind-review attempt used a homepage screenshot with the Resources menu manually opened so the missing Models entry was visible. The reviewer then correctly complained that the open menu competed for first attention — but that state was created by the test itself, not by a normal first visit.

The correction is procedural: Phase A first-attention review starts from the real default/persisted entry state. Expanded menus, details, filters, dialogs, or drawers can be captured separately to prove interaction-state behavior. They cannot be substituted for the default-state screenshot merely because the changed control is easier to see there.

### 3. Phase B still has to separate candidate regressions from inherited page debt

The default-state cold reads surfaced real existing issues such as missing first-screen result summaries and unexplained project terms. None of those were introduced by the navigation-only candidate. Phase B correctly kept them visible as independent debt while judging the scoped navigation migration PASS.

This is the same family as the earlier Base Model Flow → Models closeout, so no second HPL-scope policy was created; the current HPL owner already distinguishes candidate-caused regressions from pre-existing/independent debt.

### 4. Moving `main` repeatedly exercised the existing fail-closed release rule

`main` advanced several times while exact-head acceptance was being prepared. The final-gate helper repeatedly refused stale-base acceptance until the PR absorbed the new base. Those intervening changes were semantically checked and found independent before refresh.

This was a repeated release-state pattern, not a new governance gap. Existing exact-head/current-base rules already prevented the mistake, so this closeout records the evidence but adds no duplicate release policy.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Owner removed Model from research nav, then noticed homepage/global nav still exposed it | New direct correction, old shared-shell family | Navigation demotion must scan desktop/global, mobile, local child nav, and summary copy together | `current/research-journey-experience.md` + scenario trigger | Navigation ownership and reader-journey semantics |
| Risk of deleting Compare/search/contextual model links together with the nav entry | New scope boundary | Removing navigation promotion is not deleting capability/content; preserve positive-control paths unless explicitly removed | `current/research-journey-experience.md` + scenario trigger | Prevents over-application of a valid simplification |
| Blind screenshot manually opened Resources before first-attention review | New HPL use-site failure | Phase A uses the true default/persisted entry state; expanded states are separate witnesses | `current/human-preference-learning-system.md` + scenario trigger | HPL owns blind-review evidence semantics |
| Cold read surfaced unrelated existing homepage/Flow debt | Repeated HPL-scope family | Phase B keeps independent debt visible without widening a narrow candidate | Existing HPL owner | Already fixed by the earlier migration closeout |
| `main` moved repeatedly before final gate | Repeated release family | Fail closed on stale base and refresh after semantic-overlap check | Existing release/current-base owners | Existing rule worked; no duplicate policy |

## Future-Agent test

Before acting on the same class of request, a new Agent should be able to answer:

1. Is the owner asking to remove a **navigation promotion**, or to delete the underlying route/capability too?
2. Which shared navigation surfaces can still expose that direct destination: desktop, mobile, local child nav, or visible summary/meta copy?
3. Which contextual/task paths must remain as positive controls?
4. Is the Phase A screenshot the page's true initial/default state, or a menu/filter/dialog that the tester manually opened?
5. If Phase A finds other page debt, did Phase B classify whether it was caused/worsened by this candidate before widening scope?

If these checks are performed, the main mistakes from this conversation become harder to repeat without adding a second policy system.

## Temporary state intentionally not promoted

No PID, local port, worktree path, temporary dependency link, intermediate branch/head SHA, Preview/share URL, deployment ID, reviewer retry detail, provider queue state, or one-time Production timing is made current policy by this closeout.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed. Repository documentation is the durable project record for these project-specific rules; it is not the same thing as account memory.
