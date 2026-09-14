# PR #698 receipt-only scientific-boundary closeout — 2026-09-14

Status: **historical case record, not current authority**

Current rule owners:

- `../current/release-closeout-protocol.md` — exact-head acceptance, moving-main/base drift, research/provenance conflict handling, and merge-time freshness;
- `../current/scenario-trigger-registry.md` — just-in-time routing for release/Production work and moving shared state;
- `../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md` — BaseModel entrypoint to the canonical conversation-closeout protocol.

This record explains one concrete closeout decision. It must not be used as a mutable source of current experiment status.

## Scope and accessible evidence

The conversation reviewed BaseModel PR #698 as a two-file documentation receipt for an already merged and Production-smoked Gated-Delta plain-language release. The review inspected the PR patch, exact-head CI/provider state, current BaseModel `main`, the already merged release PR #696, and the then-current OpenEVO scientific authority PR #461.

The durable question was not “what was the live PR status at one moment?” It was:

> How should an Agent review and integrate a receipt-only closeout when `main` can move concurrently and the underlying research can continue after the website release snapshot was sealed?

## What the conversation exposed

### 1. A documentation receipt still needs moving-main freshness

PR #698 began from the release merge base, then BaseModel `main` advanced through an independent SD-LoRA navigation fix. The correct response was not to assume the old green head remained merge-ready merely because the diff was documentation-only.

The review re-read current `main`, compared the concurrent change, verified that it did not overlap the two closeout evidence files or alter their semantic owner, and then treated the refreshed exact-head CI/provider evidence as the merge candidate.

This is already owned by `release-closeout-protocol.md`: acceptance belongs to an exact head + intended base, and independent base drift must be inspected rather than assumed harmless.

### 2. Release-time scientific authority is a historical snapshot, not “current truth forever”

The closeout text intentionally recorded the scientific authority that governed the already released page and preserved the boundary that only sealed evidence was publishable at release time. The research branch could continue executing later rounds after that release.

The important distinction is:

```text
release receipt
= what authority and sealed evidence justified the released bytes at that time

current research state
= whatever the current scientific authority says now
```

A later research update does **not** automatically make the release receipt stale or wrong. Conversely, the release receipt must not be cited as the current scientific state once the authority advances.

When reviewing a receipt-only PR:

1. verify that its dated/release-time claims were true for the released artifact;
2. separately inspect current scientific authority for contradictions that would make the receipt misleading;
3. do not rewrite the historical receipt merely to mirror later unsealed or newly sealed progress;
4. do not promote later execution into a release-time result;
5. if a current-facing page needs new science, handle that as a new publication update, not by silently rewriting the prior release receipt.

This is an application of the existing research/provenance rule in `release-closeout-protocol.md`, not a new competing policy.

### 3. “Receipt-only” must be proven from the diff, not trusted from the PR title/body

The PR described itself as receipt-only, but the review still checked the patch. The safe classification required confirming that it changed only documentation/evidence and did not alter rendered pages, routes, tests, snapshots, provider configuration, scientific runtime semantics, or already released product bytes.

Only after that scope check was it valid to conclude that the receipt did not itself reopen the product release candidate or require a new product-level acceptance campaign.

A documentation-only PR can still require ordinary repository-required checks for its own exact head. “No new product bytes” means “do not invent a second product release,” not “skip repository merge discipline.”

### 4. Scientific wording must preserve interpretation boundaries even inside closeout prose

The receipt included interim paired numbers. Those numbers were safe only because the text explicitly kept them inside the sealed-round boundary and rejected superiority/final-efficacy interpretation.

For research release receipts, a cold read must therefore check both:

- **fact boundary** — only sealed/authorized evidence is described as a result;
- **interpretation boundary** — interim directional differences are not silently upgraded into superiority, causal efficacy, long-term stability, or final-panel claims.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| `main` moved after the initial cold read | Known recurring shared-state hazard; not repeated as an error here | Re-read exact head + exact current base and inspect semantic overlap before merge | `release-closeout-protocol.md` | Already owns moving-main/exact-head acceptance |
| Risk of treating a release-time scientific snapshot as current research forever | Same provenance family seen in prior publication work; not committed here | Keep release-time receipt and current scientific authority as separate temporal objects | `release-closeout-protocol.md` research/provenance section | Existing authority already covers scientific freshness/conflict resolution |
| PR body says “receipt-only” | No error occurred; classification was verified | Prove receipt-only scope from the changed files/diff before relaxing product-level re-release work | This historical case + existing release protocol | Concrete worked example; no need for another current policy owner |
| Interim Round evidence could be read as superiority/final | Known scientific-publication boundary; not violated here | Preserve explicit sealed/interim/no-superiority/no-final wording in both page and receipt | Scientific authority + release protocol | Interpretation belongs to scientific authority; release protocol governs publication handling |
| Temporary PR/CI/provider state could leak into standing policy | Avoided | Keep one-time SHA/run/deployment state in dated evidence only | This historical record / task evidence | Temporary state is audit evidence, not standing policy |

## What was intentionally not promoted to standing policy

The following are temporary or case-specific and must not become durable rules:

- the PR number/head SHA/base SHA used during this closeout;
- one-time GitHub Actions run IDs;
- one-time Vercel deployment IDs or Preview URLs;
- the exact live `main` SHA observed during the review;
- the live execution state of later Gated-Delta rounds;
- the fact that a particular concurrent PR happened to be non-overlapping.

Those facts belong to Git history, PR history, or dated release evidence. Future Agents must re-read live state.

## Repetition check

No previously known closeout mistake was repeated in this conversation.

In particular:

- old green evidence was **not** blindly carried across a moving base;
- a docs-only label was **not** accepted without inspecting the patch;
- later research execution was **not** promoted into the sealed 2/4 release snapshot;
- interim numbers were **not** converted into superiority/final claims;
- the already strong current release protocol was **not** duplicated into another mutable policy file.

The knowledge-system improvement here is therefore a worked historical example, not another bootstrap/current-rule layer.

## Future-Agent test

A future Agent starting from root `AGENTS.md` already reaches `scenario-trigger-registry.md` and `release-closeout-protocol.md`. Those current owners tell it to refresh exact head/base state and preserve current scientific authority during provenance overlaps. If it needs to understand why a receipt-only closeout must keep release-time science separate from later research progress, this dated case provides the worked example without competing with current authority.
