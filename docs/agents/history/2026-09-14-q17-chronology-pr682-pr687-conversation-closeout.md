# Q17 chronology cold-read and closeout — 2026-09-14

Status: historical closeout evidence. Current rules live in `docs/agents/current/product-and-research-integrity.md` and repository release/governance owners.

## What this conversation exposed

A cold read of the Q17 DirectApply publication found a cross-section contradiction that normal green release checks had not caught. The new experiment overview correctly described the frozen sequence as `seal R159 -> read-only D1 -> one frozen final`, while an older lede still narrated the final before D1. Each sentence looked plausible in isolation, but together they changed the scientific chronology.

The narrow follow-up corrected the lede and added a chronology regression. The lesson is not the temporary PR state; it is that chronology in research copy is part of scientific meaning and needs an explicit semantic consistency check.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Plain-language Q17 copy contained two incompatible event orders. | Related class seen before: stale/current research narration can diverge across surfaces. | Resolve canonical event order first; compare hero/lede/flow/result text against it; contradictions are research-integrity bugs. | `docs/agents/current/product-and-research-integrity.md` | This is a durable invariant for all research publication copy. |
| Exact-head Public PR CI was green while the semantic contradiction remained. | Yes, broader pattern: green gates can coexist with unsupported or stale scientific prose. | Treat CI/deploy success as artifact/release evidence, not proof of cross-section scientific consistency; add focused semantic regressions for stable critical boundaries. | Same current integrity owner + task-specific regression tests | Keeps release mechanics and scientific truth distinct, while making the known failure executable. |
| Recent deployment-failure emails were initially easy to conflate with the candidate under review. | Existing provider-state rule already covers this class. | Bind provider claims to the exact candidate SHA/branch/deployment before declaring a PR blocked. Do not create a second rule. | Existing `AGENTS.md` / deployment policy | The repository already has exact-head/provider-owned acceptance rules; duplication would weaken authority. |
| Vercel final-gate was temporarily occupied by another candidate. | Existing single-writer final-gate behavior. | Never steal the persistent final-gate ref from an active candidate; use the repository request script and wait for the owner gate to clear. | Existing executable gate script and deployment policy | This was temporary queue state, not a new standing rule. |

## What was intentionally not promoted

The PR numbers, branch names, exact transient provider queue owner, Preview URLs, and momentary merge status were not added to standing policy. They remain historical evidence only.

## Future-Agent test

A new Agent starting from root `AGENTS.md` is routed to `product-and-research-integrity.md` for user-facing research work. The new invariant tells it to preserve canonical event order, compare all summary surfaces, and add a focused regression when the sequence is stable. That is enough to prevent the specific failure without teaching future Agents to memorize one Q17 page or one PR number.
