# 2026-08-31 Superseded Stage-2 archive + Ceiling publication retrospective

Status: **historical cross-repository case / reusable Agent friction record, not current authority**
Scope: BaseModel capability-exploration Stage-2 information architecture, H1.45/H1.46 historical four-arm publication, Hugging Face archive/retention, OpenEVO-Ceiling-1.0 current-protocol publication, PR #366, Preview, merge, and Production closeout.

Current authority remains:

- current user instruction;
- current `mykcs/openevo-experiment` executable config / activation / immutable receipts / live execution state for scientific claims;
- current `mykcs/basemodel` source/tests for website behavior;
- `docs/agents/current/*` for standing policy;
- live GitHub/Vercel/Hugging Face state for provider-side claims.

If this file disagrees with any of those, **this file loses**. Every run status, SHA, PR number, metric, and deployment below is historical provenance.

## Why this retrospective exists

The user asked for a deceptively simple change: turn Stage 2 into two selectable versions, preserve the old mistaken experiment as a historical branch, explain the new OpenEVO-Ceiling-1.0 strategy, upload all old artifacts to Hugging Face, and keep enough local artifacts that engineering smoke tests remain possible even after future cleanup.

The task crossed six different lifecycle questions:

```text
scientific design
!= historical experiment result
!= artifact identity
!= local retention policy
!= website explanation
!= release/deployment state
```

The most reusable lesson is:

> **“这个实验设计错了”只说明某个科学方法层已经 superseded。它不自动让上游数据失效，不自动把所有 checkpoint 变成垃圾，也不自动授权删除服务器上的唯一工程恢复资产。**
## Conversation arc: what happened from start to finish

### 1. The request began with “design first, then execute”

The user explicitly did **not** authorize immediate deletion or blind migration. The requested order was:

```text
first design the information architecture + archive/retention policy
-> confirm the plan
-> then modify the site / HF / server artifacts
```

That ordering mattered because several irreversible-looking actions were mixed together in the request: changing the scientific story, moving artifacts to Hugging Face, and deciding what local data could eventually be removed.

A future Agent should treat those as separate approvals. “Please archive this” is not equivalent to “delete the source after upload”.

### 2. Read-only inspection showed that much of the requested structure already existed

Before changing anything, inspection found that the site already had two Stage-2 routes:

- `stage2-256-window/`;
- `stage2-ceiling/`.

Hugging Face already had a dedicated superseded Stage-2 archive and historical adapter repositories. The server already had publication staging and a permanent smoke-retention bundle.

The correct move was therefore **not** to create a second archive, a second chooser, or duplicate multi-gigabyte uploads. The task changed from “build from zero” to “audit what exists, correct scientific semantics, fill missing evidence, and close the remaining publication gaps”.

**Reusable rule:** a user request can describe the desired end state rather than current absence. Inspect current state before creating parallel infrastructure.
### 3. The naming problem was scientific, not cosmetic

The first proposed label was roughly “256 窗口策略设计错误”. That wording was too coarse.

The actual historical mistake was:

```text
method-control rule
= 8 distinct task identities × each with >=2 clean exact successes
inside one 256-rollout block
+ no evidence accumulation across blocks

was promoted into

long-running Stage-2 learning algorithm
```

The number `256` by itself was not the scientific error. A future reader should not learn the false rule “256 is bad”. The page therefore moved toward:

> **历史 Stage 2：窗口化硬门槛（设计错误 / 已取代）**

with explicit explanation that the brittle window-local admission rule, not the integer `256`, was superseded.

This distinction protects future research reasoning. Otherwise a later Agent may “fix” the old run by changing 256 to 512/1024/2048 and unknowingly repeat the same post-hoc tuning mistake.

### 4. The historical four arms needed one canonical manifest

The old Stage-2 page originally encoded arm facts directly in component markup. That creates drift when the same arm is also described in result pages, matrices, HF README text, and checkpoint links.

The implementation introduced one canonical historical data module for:

```text
3B/self
7B/self
3B/MiniMax
7B/MiniMax
```

including progress, qualified positives, best window-local task-identity count, Stage-2 update count, model-state/checkpoint semantics, sealed final-evaluation state, and pinned artifact links.

**Reusable rule:** when several public surfaces repeat the same historical experiment facts, centralize the facts; let presentation components transform them, not retype them.
## Historical Stage-2 facts that were frozen in this task

At this historical closeout point, the four old Stage-2 arms were:

| Arm | Old Stage-2 progress | Qualified positives | Best block | Stage-2 updates |
|---|---:|---:|---:|---:|
| 3B / self | 80/80 blocks · 20,480 rollouts | 138 | 2/8 identities | 0 |
| 7B / self | 80/80 blocks · 20,480 rollouts | 797 | 7/8 identities | 0 |
| 3B / MiniMax | 59/80 complete blocks + 171 partial rollouts | 38 over complete blocks | 1/8 identities | 0 |
| 7B / MiniMax | 80/80 blocks · 20,480 rollouts | 592 | 7/8 identities | 0 |

These numbers are **historical evidence only**. Do not use them to infer the current Ceiling run state.

### Sealed old final-evaluation states

Server-side machine evidence closed three historical finals:

- **3B/self:** Task Score ×100 `1.71`, exact success `1/128`, valid episodes `121/128`;
- **7B/self:** Task Score ×100 `25.66`, exact success `4/128`, valid episodes `122/128`;
- **7B/MiniMax:** Task Score ×100 `16.94`, exact success `0/128`, valid episodes `116/128`.

The fourth arm, **3B/MiniMax**, had no sealed final-evaluation artifact because the superseded run was explicitly stopped at 74.58%.

That state must be written as **final not run**, not `0`, not `Pending forever`, and not an estimated score.

This distinction corrected a stale website assumption that only 7B/self had a real final. The machine evidence, not the old page, determined which slots were now closed.
## Checkpoint semantics: zero update is a pointer state, not a missing file

All four headline old Stage-2 arms produced **zero new Stage-2 parameter updates**.

That means the scientifically correct model-state story is:

```text
Stage-2 entry state
-> rollouts / selection / admission checks happen
-> no parameter update admitted
-> final parameter bytes remain identical to Stage-2 entry state
```

The wrong publication instinct is to manufacture a new directory/file and call it “Stage-2 final checkpoint” merely so every experiment looks structurally symmetrical.

The correct publication uses:

- the real Stage-1/bootstrap adapter when one exists;
- an explicit base/no-update pointer when no adapter exists;
- a pointer/manifest explaining why no new Stage-2 bytes exist.

This matters for restore tests too. A future engineering smoke should load the actual historical policy state, not a duplicate blob whose filename invents a learning event that never happened.

**Reusable rule:** checkpoint identity is about parameter lineage, not directory naming symmetry.

## Historical result vs current algorithm

A historical run can be internally valid and still be superseded as the current algorithm.

For these arms:

```text
rollouts are real
selection evidence is real
0 Stage-2 updates are real
final evals that ran are real

but

window-local 8×2 admission rule is no longer the current Stage-2 method
```

Do not erase negative evidence to make the current method look cleaner. Also do not keep presenting the negative evidence as if it were the performance ceiling of the replacement algorithm.
## Ceiling publication friction: “frozen design” and “current runtime state” were different objects

The existing Ceiling page still said roughly:

```text
design frozen
formal Stage-2 task consumption not started
Skill disabled
```

Fresh experiment-side inspection showed that this was stale.

The current Stage-2 protocol had evolved to a four-carrier same-round decision structure:

```text
sealed 128-rollout round evidence
-> Text Memory decision
-> parametric SD-LoRA decision
-> Skill Bundle decision
-> Agent System decision
-> compose exactly once into State_(k+1)
```

The old `7-vs-8` gate was explicitly forbidden. Task Vector remained diagnostic-only.

At the same time, live server execution state had already advanced beyond “not started”: the 7B formal recovery state showed rounds `0..8` sealed, `1,152 / 20,480` Stage-2 rollouts consumed, `8` SD-LoRA generations, `0` external Stage-2 teacher calls, and `0` final-panel accesses, while round 9 was actively rolling out.

Those values were never safe to publish as timeless constants. They were therefore moved into an explicitly dated **receipt-backed execution snapshot** separate from the stable protocol explanation.

**Reusable rule:**

```text
stable strategy / protocol
!=
mutable execution progress
```

A research page may show both, but the mutable layer needs an observation time, evidence identity, and clear statement that future Agents must re-read live state.
## Authority friction: one “current” file was not enough

The local `openevo-experiment` checkout was actively dirty because another Agent was editing recovery code. Its `current-campaign.json` described an earlier fail-closed reflector-saturation recovery boundary, while the server's newer execution-state receipts showed a later recovered formal run already progressing.

The top-level Ceiling preregistration also still contained older carrier wording, while the dedicated frozen Stage-2 protocol and activation files encoded the newer four-carrier contract.

The correct response was not to pick whichever file looked most official. The task resolved authority by role:

```text
scientific envelope / preregistration
-> dedicated current Stage-2 protocol
-> activation authorization
-> append-only receipts / execution-state for progress
-> live process/container evidence for volatile runtime facts
```

And because the scientific checkout was owned by concurrent work, the website task stayed **read-only** there. All BaseModel changes were made in a separate website worktree.

### General rule

A dirty scientific worktree is not automatically invalid, but it is a strong ownership warning. Do not edit it from a publication task merely because the facts you need live there.

When two scientific artifacts disagree, first ask whether they own different lifecycle layers before calling one “stale”. A preregistration can remain the envelope while an activation receipt owns the allowed arm and an execution-state file owns progress.

This reasoning is more durable than remembering any specific Ceiling SHA from this case.
## Hugging Face archive: immutable bytes and mutable explanation have different lifecycles

The server audit discovered that the exact historical archive had already been completed before this task:

- `184,168` regular source files;
- `11,643,099,142` bytes before compression;
- three exact compressed archives;
- source-file SHA-256 manifest;
- fresh remote byte verification;
- full gzip-stream verification.

The immutable historical artifact revision was pinned at:

`f2d436659f060c6e1cba1fec391b1fbf20cec0dd`

Historical neighboring identities from this closeout were:

- reader-facing archive README update: `ef07d631204b95860d60cd9c9dc5c67b340faaf7`;
- historical adapter repository revision: `cc64938ac0bbef573b631d2742e3b9f477aff36b`;
- exact runtime digest: `sha256:d0f8796010899ae41a7af8ae3f44f47b96dea73b297b5af124049b3ae88e2850`.

These are historical restore anchors, not instructions to treat those repository heads as current.

The task therefore did **not** re-upload multi-gigabyte data. Only the reader-facing README was updated, producing a later documentation commit while the binary artifact anchor stayed pinned.

This is a useful two-layer model:

```text
immutable artifact revision
= which exact bytes are the historical evidence?

mutable repository head / README
= how should readers interpret those bytes today?
```

The README can gain a stronger superseded warning without rewriting history. Website links to exact artifacts should keep the immutable revision; links meant to show the latest warning may intentionally target the current README/head.

**Reusable rule:** never solve “we need a better warning” by changing the identity of the archived evidence.
## Retention: upload success is not deletion authorization

The user explicitly wanted old artifacts to remain useful for engineering qualification even if their scientific design was superseded.

The server already contained a permanent engineering smoke kit. At this closeout it was about `222.9 MB`, with `63` hash-verified files and three loadable historical adapters plus grounded examples from all four arms, selection/summary/execution-state records, historical receipts, and exact runtime identity.

The two large raw historical run roots were also still present, approximately `5.91 GB` and `5.29 GB`.

A new retention audit made the boundary machine-readable:

```text
raw run roots: KEEP
permanent smoke kit: KEEP
HF exact archive: verified
remote verification authorizes deletion: false
delete_authorized: false
```

No scientific run root was deleted in this conversation.

### Why keep a local smoke kit after remote archival?

A cold archive proves history is preserved. It does not optimize for fast engineering checks such as:

- can the historical adapter still load?
- does the old environment/path still exercise the model stack?
- can a regression reproduce the former checkpoint format?
- can a future recovery tool validate pointer/adapter compatibility without downloading 2 GB archives?

The local smoke kit is therefore not redundant with the cold archive. It serves a different recovery-time objective.
## Runtime preservation: preserve identity, not necessarily a giant tarball in HF

The old experiment runtime was already represented by an exact GHCR image tag and digest. The archive README recorded that immutable identity instead of duplicating OCI layers into the Hugging Face dataset.

That separation is preferable when the registry artifact is already durable and addressable:

```text
HF dataset
-> configs / receipts / manifests / scientific files / checksums

model repo
-> actual adapter bytes / pointer manifests

container registry
-> exact OCI runtime image by digest

local smoke kit
-> minimal hot-path restore assets
```

Do not upload a huge Docker tar to Hugging Face merely because “everything should be in one place”. Reproducibility needs a complete provenance graph, not necessarily one physical storage bucket.

## Website information architecture: old and current Stage 2 must be siblings, not blended prose

The landing page now makes Stage 2 a method-version choice:

```text
historical / superseded
-> window-local hard gate

current mainline
-> OpenEVO-Ceiling-1.0
```

The historical branch then exposes two orthogonal choices:

```text
model: 3B | 7B
teacher treatment: self | MiniMax hindsight
```

The chosen arm is reflected in URL query state. This makes a direct link reproducible and prevents “I clicked 7B/MiniMax but sent somebody the default 3B/self URL” ambiguity.

The page still has a truthful static default so the core meaning survives without JavaScript.
## Browser friction: automation can produce a false negative

During local browser acceptance, the first attempt to click the 7B / MiniMax selector appeared to do nothing. It initially looked like an interaction bug.

Inspection showed the target button was below the current viewport. A synthetic event proved the page logic worked; after scrolling the real button into view, a genuine pointer click updated both URL and visible panel correctly.

The useful diagnostic sequence was:

```text
selector exists?
-> event listener/state mutation works synthetically?
-> target is actually visible/clickable?
-> real pointer click after scroll
-> URL + DOM state both update?
```

Do not immediately rewrite UI code because an automation click did not change state. First distinguish product bug, hydration problem, off-screen target, overlay interception, and automation-runner limitation.

The accepted local behavior was:

```text
?model=7b&teacher=minimax
-> only legacy-7b-minimax panel visible
-> sealed 16.94 / 0-of-128 / 116-of-128 evidence present
```

A similar check confirmed 3B/MiniMax visibly says its final evaluation was **not run**, rather than encoding a fake zero.
## Worktree friction: missing dependencies are not source failure

The isolated BaseModel worktree initially could not run Astro because it had no local `node_modules`.

Before reusing the dependency tree from the existing checkout, the task compared SHA-256 of both `package.json` and `package-lock.json`. They matched exactly.

Only then was the existing dependency tree temporarily linked for validation. The link was removed before the Git closeout.

This preserved two useful properties:

- no network reinstall was needed merely to validate an identical lockfile;
- no hidden dependency drift was introduced into the clean candidate.

**Reusable rule:** dependency reuse across worktrees is acceptable only after proving the dependency contract is identical. “Both are the same repo” is weaker evidence than matching lockfile/package hashes.

## Main-drift friction: the first accepted-looking head became stale before PR closeout

The first website commit was based on `f6b293c…` and pushed as `593aac6…`.

By PR creation, `main` had advanced through PR #365. That new commit modified exactly the capability-exploration landing pages and the same result-language test because it added the new-vs-historical Stage-1 comparison.

GitHub therefore reported the PR non-mergeable. This was a real semantic overlap, not a transient “mergeability still computing” state.

The safe response was:

```text
compare main drift by changed file + semantic ownership
-> preserve #365 Stage-1 comparison completely
-> rebase the Stage-2 work onto latest main
-> resolve only three overlapping files
-> rerun validation on the new exact head
```

The merged result kept both axes: Stage-1 version comparison first, then Stage-2 method-version choice.
### Why semantic conflict resolution mattered

The three rebase conflicts were not resolved with blanket `ours` or `theirs`.

The correct combined tree needed:

```text
#365 facts/UX
= Stage-1 new-vs-historical comparison + its regression assertions

this task
= Stage-2 superseded/current split + historical manifest + current Ceiling snapshot + its regression assertions
```

The result-language test therefore had to include both source families. The landing page had to keep the Stage-1 comparison component and update only the Stage-2 explanatory sentence beneath it.

The rebased exact head became `88482ab…`, with latest main as its parent. Full deterministic validation and browser checks were rerun on that tree before the one corrective force-with-lease push.

**Reusable rule:** when main moves on the same page, preserve semantic ownership from both sides. A conflict-free Git merge is not the goal; a coherent combined research story is.

## Preview friction: protected Preview access and ephemeral share tokens

The exact-head Vercel Preview for `88482ab…` reached `READY`, and deployment metadata proved the expected Git SHA and PR identity.

The Preview was protected by Vercel Authentication. An initial browser attempt still landed on the Vercel login page even after a temporary share URL had been obtained.

The subtle cause was token lifecycle: an intermediate protected-fetch call regenerated the share token, so the browser later used an older token.

The successful sequence was:

```text
provider READY + exact SHA confirmed
-> request one final temporary share URL
-> do not invoke another action that regenerates it
-> open that URL directly in browser
-> establish access cookie
-> inspect real protected routes
```

Temporary share URLs are secret-like review artifacts. They must not be written into Git, PR bodies, docs, or final reports.
## Release closeout: Preview, merge, Production were separate proof obligations

PR #366 was merged only after the synchronized exact-head Preview was accepted.

Historical release anchors:

- PR: `#366`;
- accepted rebased head: `88482ab78afdc588b8eb82c15ab9f436f720e626`;
- squash merge / Production source SHA: `322cc0d6b8d8cc4cf8484b17d246ea5ff35e4b0f`;
- Vercel Production: `READY`;
- provider build: `456` pages;
- GitHub Vercel status: success.

Production acceptance did not stop at the provider badge. The stable public domain was re-read for:

- the capability-exploration landing page with both Stage-1 and Stage-2 version structure;
- the historical Stage-2 selector with pinned archive/model-state links;
- the Ceiling protocol/snapshot page;
- 3B/self sealed final;
- 3B/MiniMax not-run final state;
- 7B/MiniMax sealed final.

The public canonical URLs pointed to the stable Production domain.

The release ladder was therefore:

```text
local/source validation
-> rebased exact-head validation
-> exact-head protected Preview READY + real route acceptance
-> merge
-> Production build from merge SHA
-> stable public-route acceptance
```

Do not collapse this into “Vercel was green”.
## The main reasoning frictions

### 1. “Wrong experiment” is not a single validity bit

The hardest conceptual repair was replacing this binary model:

```text
correct experiment | wrong experiment
```

with a layered classification:

```text
upstream trajectories / teacher analyses: may remain valid historical evidence
Stage-1/bootstrap adapter: may remain a real reusable model state
old Stage-2 admission algorithm: superseded as current method
old Stage-2 rollouts: real evidence produced under that historical method
old final evaluation: valid only when it actually ran and its lineage is explicit
engineering runtime/checkpoint format: may remain highly useful for smoke/recovery
```

A future Agent should never propagate one downstream scientific judgment upward through the whole provenance graph without evidence.

### 2. The correct replacement strategy should not be derived by maximizing old-data gate passage

The old archive made it easy to ask “what window size would have passed?” That is useful diagnosis, but it is not enough to define the next algorithm.

Once a different admission rule allows earlier parameter updates, later on-policy trajectories change. Therefore a post-hoc window that looks attractive under the old fixed trajectory corpus does not establish causal superiority.

The current Ceiling strategy was published from its own frozen protocol, not reverse-engineered from whichever historical pooling made the most blocks pass.

### 3. Negative results remain valuable when their cause is explained correctly

The old four-arm `0 Stage-2 updates` result is not useless. It shows concretely that a window-local repeated-success gate can block parameter evolution despite non-zero learnable successes.

Its value depends on preserving the correct causal sentence:

> the historical program admitted no parameter update under its window-local gate.

It should not be inflated into:

> OpenEVO cannot learn in Stage 2.

Nor erased into:

> that run was wrong so none of its evidence matters.
### 4. Archive and hot-retention optimize for different failure modes

A cold exact archive answers:

> Can we reconstruct what existed?

A small local smoke kit answers:

> Can we quickly prove the old artifact/runtime path still works?

These are not substitutes. Storage cleanup should reason about both **preservation value** and **recovery latency**.

### 5. “Current” belongs to evidence, not adjectives

The Ceiling page previously used a `DESIGN SHA` and “current” wording that had already fallen behind the experiment.

The fix was not to find a more recent hard-coded adjective. It was to separate a stable protocol identity from a dated snapshot whose evidence boundary is explicit.

Whenever a page says “current”, future Agents should ask:

```text
current as of what evidence?
which layer owns the state?
what will make this sentence stale?
```

### 6. Provider waiting created low-value conversational churn

The Production build was healthy and visibly progressing. Several repeated state/log reads added little until the next meaningful phase transition.

Current provider-wait discipline is better:

```text
pin deployment + exact SHA
-> one immediate state/log read
-> if healthy, avoid rapid polling
-> continue independent work or return a resume checkpoint
-> re-read when a meaningful transition is likely
```

Provider latency is not Agent reasoning work.
## What worked well

### Read-only audit before mutation prevented duplicate infrastructure

The task discovered that the expensive archive/restore work was already complete. That saved duplicate Hugging Face repositories, duplicate 2 GB uploads, and a second retention policy.

### Historical evidence and current method became navigable siblings

The old experiment was not hidden in a footnote and the new strategy was not mixed into the same timeline. A reader can deliberately choose which method version they are inspecting.

### Final-evaluation truth was recovered from machine evidence

The stale website did not decide which arms were complete. Reading the actual final-eval summaries recovered 3B/self and 7B/MiniMax finals while correctly leaving 3B/MiniMax as not run.

### No-update model-state semantics remained honest

The page links to the actual Stage-2 entry/base state instead of manufacturing checkpoint bytes for aesthetic symmetry.

### Retention was made explicit before any cleanup

The server now had a clear machine-readable “KEEP / delete_authorized=false” boundary, so a future disk-pressure task cannot plausibly infer that this publication conversation silently approved deletion.

### Main drift was integrated rather than overwritten

The Stage-1 comparison merged just before this PR. The final page preserved it and added the Stage-2 hierarchy underneath, producing a stronger whole-page model than either branch alone.

## Anti-patterns to avoid

Do not repeat these moves:

- call the old method “the 256 bug” and teach that 256 itself was the mistake;
- create a new archive before checking whether an exact verified archive already exists;
- re-upload immutable historical bytes merely to update explanatory README text;
- treat an HF repository head as the identity of historical bytes when a pinned revision exists;
- fabricate Stage-2 checkpoint files after zero parameter updates;
- write an unrun 3B/MiniMax final as `0`;
- treat a measured `0/128` final as Pending merely because zero looks suspicious;
- treat `HF verified` as `local deletion authorized`;
- delete the local smoke kit because the cold archive exists;
- duplicate a whole OCI image into HF when an immutable registry digest already owns runtime identity;
- edit an active dirty experiment worktree from a website-publication task;
- let a stale top-level preregistration override a newer dedicated Stage-2 protocol/activation/receipt for a different lifecycle question;
- publish a live rollout counter as an undated permanent page fact;
- keep repeated arm facts hard-coded independently across multiple components;
- assume a browser automation no-op proves the UI is broken before checking viewport/target state;
- reuse another worktree's dependencies without proving package + lockfile identity;
- use `ours`/`theirs` wholesale when main drift carries a valid sibling research feature;
- keep validating an obsolete exact head after `main` changes the same page/test surface;
- persist temporary Vercel share links in GitHub or docs;
- call the task complete at merge time without checking the Production successor and stable routes.

## Fast decision checklist for the next similar task

When an experiment is scientifically superseded but its artifacts still matter, ask in this order:

1. **Which exact layer is superseded?** Collection, teacher analysis, bootstrap, Stage 2 admission/update, evaluation, or only publication wording?
2. **Which artifacts remain valid historical evidence?** Do not infer invalidity by ancestry alone.
3. **Did a final evaluation actually run?** Distinguish measured zero, Pending, not-run, invalid, and N/A.
4. **Did parameters actually change?** If not, publish a pointer to the unchanged state rather than a fake checkpoint.
5. **Does an exact remote archive already exist?** Inspect before uploading anything large.
6. **What is the immutable artifact revision?** Separate it from the latest README/head.
7. **Has remote restore/hash verification passed?** “Upload command exited 0” is weaker evidence.
8. **What must remain local for fast recovery/smoke?** Preserve a minimal hot-path bundle separately from cold archival.
9. **Is deletion separately authorized?** If not, record `delete_authorized=false` and stop cleanup there.
10. **Where does runtime identity live?** Dataset, model repo, container registry, or a combination by digest.
11. **Is the website separating stable protocol from mutable progress?** Put live progress behind a dated receipt-backed snapshot.
12. **Does current experiment authority have multiple layers?** Resolve envelope, dedicated protocol, activation, receipts, and live processes by role.
13. **Is another Agent actively editing the science checkout?** Stay read-only and isolate publication work.
14. **Does the chooser encode the experimental factors?** Prefer stable query/link state over UI-only local state.
15. **Did main move?** Compare semantic overlap before rebasing or discarding expensive acceptance.
16. **Did a browser click really reach the target?** Inspect viewport, hydration, overlay, and event behavior before rewriting code.
17. **Is exact-head Preview actually the synchronized tree?** Confirm provider metadata, not only GitHub color.
18. **Is Production the merge SHA or its intended successor?** Verify lineage and the stable public routes.

## Search cues for this case

Future Agents should find this file for cues such as:

`superseded Stage2`, `256-window`, `8 identities × 2 successes`, `old Stage2 archive`, `no-update checkpoint`, `checkpoint pointer`, `3B MiniMax final not run`, `Hugging Face archive`, `immutable artifact revision`, `README warning`, `delete_authorized=false`, `engineering smoke kit`, `cold archive`, `Ceiling four carriers`, `receipt-backed snapshot`, `Skill Bundle`, `Agent System`, `main drift #365`, `PR #366`, or `Vercel share token`.

## Related current owners and neighboring historical cases

Read current owners first:

- [`../current/experiment-result-publication-workflow.md`](../current/experiment-result-publication-workflow.md) — result intake, superseded-layer classification, historical artifact publication, checkpoint/final semantics;
- [`../current/scientific-state-provenance.md`](../current/scientific-state-provenance.md) — live scientific authority and freshness;
- [`../current/scenario-trigger-registry.md`](../current/scenario-trigger-registry.md) — old/new/superseded-artifact trigger;
- [`../current/research-site-presentation-contract.md`](../current/research-site-presentation-contract.md) — reader-facing research boundaries;
- [`../current/deployment-policy.md`](../current/deployment-policy.md) and [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md) — exact-head Preview/merge/Production acceptance.

Neighboring historical cases:

- [`2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md`](2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md) — Stage-1 old/new protocol/realization/runtime distinction, GPU/Holder execution, and historical Stage-1 artifact publication;
- [`2026-08-31-openevo-readable-result-language-and-release-retrospective.md`](2026-08-31-openevo-readable-result-language-and-release-retrospective.md) — reader-first explanation of `20,480 -> 797 -> 7/8 -> 0`, 16-of-1,440 semantics, and Results release friction;
- [`2026-08-30-openevo-capability-exploration-series-retrospective.md`](2026-08-30-openevo-capability-exploration-series-retrospective.md) — earlier four-arm scaffold, selector, checkpoint visualization, and series navigation;
- [`2026-08-31-ci-pr-stability-and-moving-head-retrospective.md`](2026-08-31-ci-pr-stability-and-moving-head-retrospective.md) — moving-head and CI-layer classification.

Experiment-side execution details remain owned by `mykcs/openevo-experiment`; BaseModel historical docs must not become a second live experiment dashboard.

## Final mental model

The whole conversation can be compressed to this graph:

```text
SUPERSEDED SCIENCE, PRESERVED EVIDENCE

old scientific method
    ↓ classify by layer, not one validity bit
historical run facts
    ↓ exact artifact identity
immutable HF/model/runtime provenance
    ↓ restore verification
cold archive
    +
small permanent local smoke kit
    ↓ no automatic deletion
explicit retention boundary
    ↓
reader-facing historical route

CURRENT SCIENCE

current experiment authority
    ↓ frozen dedicated Stage-2 protocol
stable Ceiling explanation
    +
dated receipt-backed execution snapshot
    ↓
exact-head website acceptance
    ↓
Production
```

The most important stopping rule is:

> **Never use publication cleanup to rewrite scientific history, and never use scientific supersession as implicit storage-deletion authority. Preserve the exact old evidence, explain why it is no longer the current method, and let the current experiment publish from its own authority.**
