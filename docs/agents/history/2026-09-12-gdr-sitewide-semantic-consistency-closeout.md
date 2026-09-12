# GDR sitewide semantic-consistency closeout

Date: **2026-09-12**  
Status: **historical closeout evidence; not current scientific authority**  
Scope: BaseModel publication semantics only. Current scientific truth remains owned by the current OpenEVO experiment authority and executable lineage.

## Why this closeout exists

A sitewide BaseModel repair had to separate two mechanisms that had been easy to blur because they shared the label “GDR”:

- the **historical local GDR-v1** actually used in the earlier OpenEVO run was a post-training **candidate-admission gate**: train an SD-LoRA candidate first, then use a probe/acceptance decision to adopt the candidate or keep the prior state;
- the **original Gated Delta Rule** from the Yang Songlin / FLA line is a **recurrent state update**: the recurrent rule itself defines how prior state is read, a residual/update is formed, and the state is written back;
- **Task Vector** is diagnostic / analysis evidence in the current discussion and does **not** directly set runtime `β` or `g` unless executable evidence later proves such a control path.

The publication task also had an explicit scope boundary: it must not take over the separate successor-program design or mathematical derivation work. BaseModel may explain the current boundary and label the successor as proposed/unexecuted, but it must not freeze a parallel Agent’s unfinished design.

The actual website repair was integrated separately. This closeout records the reusable lesson rather than replaying that product change.

## What went wrong

The main failure mechanism was **name equivalence being mistaken for mechanism equivalence**.

Once the same short label appeared in a mechanism page, briefing slide, technical notes, route metadata, and explanatory copy, a locally true sentence could still leave the whole site scientifically misleading. Fixing one sentence was not enough because the ambiguity lived at the semantic-family level.

A second risk was **role inflation**: a diagnostic quantity such as Task Vector could be described as though it were a runtime gate/control signal simply because a future design might use it that way. That would silently convert an analysis idea into an executed mechanism.

A third risk was **scope capture**: while repairing publication semantics, it was tempting to continue into successor implementation or derivation. That would cross the publication task’s authority boundary and could prematurely freeze research still owned by another workline.

## Durable lessons

The reusable rule now lives in `docs/agents/current/research-editorial-style.md`, which is mandatory for user-facing research components through `src/components/research/AGENTS.md`.

Future publication work should:

1. resolve upstream method semantics and local executed semantics independently;
2. keep their identities distinct whenever control point, state object, update rule, or timing differs;
3. preserve the historical run as it actually executed rather than rewriting it to fit a later interpretation;
4. keep proposed successor mechanisms explicitly unexecuted until executable evidence exists;
5. never upgrade a diagnostic/teacher/evaluation object into a runtime control input without executable proof;
6. after an owner correction of a semantic identity, scan sibling pages, slides, technical notes, route metadata, and tests for the same overloaded term;
7. stop at the publication boundary when implementation or mathematical derivation belongs to another workline.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Local GDR-v1 and the original Gated Delta Rule were easy to describe as one mechanism because they shared a name | Yes, the ambiguity propagated across multiple publication surfaces | Shared terminology does not prove shared mechanism; resolve local execution and upstream method separately | `docs/agents/current/research-editorial-style.md` | Mandatory research-publication owner; future Agents load it before writing research copy |
| Task Vector could be described as if it directly controlled `β/g` | Recurring risk whenever diagnostics are promoted into mechanism prose | Diagnostic/teacher/evaluation evidence is not a runtime control path without executable proof | `docs/agents/current/research-editorial-style.md` | This is a general evidence-to-mechanism wording boundary, not a GDR-only rule |
| A single-page fix could leave sibling pages semantically inconsistent | Yes; the correction required a sitewide consistency pass | Fix the semantic family after one direct correction, not only the sentence that exposed it | Existing `src/components/research/AGENTS.md` sibling-scan rule + editorial rule | The sibling-scan rule already existed; this closeout strengthens the missing method-identity trigger instead of duplicating it |
| Publication repair could drift into successor code/math design | No code takeover occurred in the completed repair, but the boundary was explicitly owner-corrected | A publication task may state an unexecuted successor boundary but does not inherit implementation/derivation authority | `docs/agents/current/research-editorial-style.md` | Keeps research narration honest without creating a second program-design authority |

## What is intentionally not permanent policy

The following are historical/transient and are not stored as standing rules:

- temporary topic-branch names or worktree paths;
- exact PR heads, provider deployment IDs, Preview URLs, CI run numbers, or queue states;
- one-time visual-review state;
- current experiment progress or live GPU/runtime state.

The merged publication change and its provider evidence remain available in Git history when needed, but those values do not belong in current governance.

## Repeated-mistake diagnosis

The repository already had a rule in `src/components/research/AGENTS.md` saying that after one direct owner correction, sibling research surfaces must be scanned for the same failure mechanism. The GDR case shows that this was necessary but not sufficient: an Agent also needs to recognize **method identity / abstraction level** as the failure mechanism being propagated.

Therefore this closeout does not add another sibling-scan policy. It adds the missing abstraction to the existing mandatory editorial owner and protects it with a focused documentation-authority regression test.

## Future-Agent test

A new Agent starting from repository entry documents should now be able to answer all of these before changing a research page:

1. Does this local experiment use a paper/library method name?
2. What did the upstream/original method actually define?
3. What did the local historical run actually execute?
4. Are any diagnostics being accidentally described as runtime controls?
5. Is a successor mechanism still proposed/unexecuted?
6. Which sibling publication surfaces use the same overloaded term?
7. Does this website task actually have authority to change the successor implementation or derivation?

If those answers are not resolved, the publication change is not ready.
