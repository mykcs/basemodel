# Human Preference Learning System

Status: **current**
Audience: coding, writing, design, review, and release Agents

This file owns how direct human feedback becomes reusable project behavior. It does **not** claim model-weight fine-tuning or account-level memory. The learning loop is repository-level: structured preference evidence, task-time compilation, internal candidate screening, blind review, and executable verification.

## The success criterion

A case library is not successful because it contains many notes.

A correction counts as learned only when it changes both:

1. **the next generation context** — what the Agent sees before the first substantial draft; and
2. **the next evaluation context** — what can reject that draft before the owner has to repeat the same correction.

The metric we care about is therefore:

> **How many times does the owner need to correct the same failure family again?**

## Why the original case library was insufficient

The old failure loop was:

```text
owner correction
-> case written down
-> future Agent starts from default aesthetics anyway
-> one keyword or visual detail is copied mechanically
-> the underlying failure mechanism returns in a new form
-> owner repeats the correction
```

A raw case is valuable evidence, but passive storage is not learning.

## Learning stack

```text
raw human case
-> Human Feedback Event
-> Preference Trajectory
-> Golden / Silver / Rejected Visual Set
-> rejected ↔ accepted Gold Pairs
-> scoped Preference Model
-> task-time Preference Brief
-> 2–3 internal candidates + pairwise screening
-> Phase A blind cold read
-> Phase B preference comparison
-> judge receipt / browser + deterministic gates
-> owner review
-> new feedback returns to the loop
```

The existing CASE / Gold Pair / Preference Model system remains valid. V2 adds the missing **trajectory, visual, escalation, and pre-generation screening** layers.

## 1. Raw cases remain canonical history

`docs/agents/current/website-copy-cases.md` preserves the owner feedback, reason, rejected/accepted examples when known, scope, and boundaries. Do not rewrite history to make a newer abstraction look cleaner.

Raw cases answer: **What did the owner actually say?**

## 2. Human Feedback Events preserve intermediate verdicts

`src/data/humanPreferenceLearningHistory.ts` stores individual feedback moments as events.

A verdict is not binary:

- `rejected` — this direction should not survive owner review;
- `better` — clearly better than a predecessor, but not approved;
- `promising` — a useful positive direction or technical-depth signal;
- `accepted` — owner explicitly accepts this concrete result;
- `canonical` — owner explicitly approves it as a reusable standard/reference.

**Never promote “好多了 / 比之前好” into `accepted` or `canonical`.**

This preserves the most valuable information in iterative design: the owner may prefer B over A without wanting B copied forever.

## 3. Preference Trajectory preserves pairwise direction

A Gold Pair records one reusable rejected → accepted contrast. A Preference Trajectory records a longer sequence of comparisons such as:

```text
dense card wall
  < soft slide direction
  > over-minimal HTML
  < later balanced candidate
```

The system must preserve *why* one variant beat another. This prevents overlearning such as:

```text
"cards caused overload"
-> incorrectly learn "all information density is bad"
-> produce an empty page
```

The correct learned mechanism may instead be:

> competing visual centers are bad; structured information can remain.

## 4. Golden / Silver / Rejected Visual Set

Visual preference cannot be represented faithfully by prose alone.

`HUMAN_VISUAL_REFERENCE_SET` uses four tiers:

- `rejected` — direct negative evidence;
- `silver` — directionally positive, but **not** approved as a template;
- `golden` — reusable visual anchor explicitly approved by the owner;
- `current-candidate` — under review; never treat as learned preference yet.

A visual reference should be reconstructable when possible with Git SHA / PR / route. Screenshots may be stored when they are stable and worth the repository weight, but an unapproved screenshot must never be promoted to Golden merely because an Agent likes it.

When an old `current-candidate` is later superseded by an accepted successor, keep the historical record but point it at the successor with `supersededByReferenceId`. Task-time briefs must hide that stale candidate from the **active** visual set while still preserving the source-window history for audit. This avoids the failure mode where a future Agent is told that an already-merged predecessor is “still under review.”

**Golden promotion rule:** only explicit owner language such as `OK / 可以 / 就按这个标准 / 以后参考这个` can create a Golden reference. A concrete `先合并进 main` / `merge this version` is `accepted` and may support Silver, but it is not future-template authorization by itself.

**Merge is not a verdict.** A Git merge / green CI / production deployment never upgrades a visual to `accepted`. If the owner gives a later direct rejection against the exact merged head and no successor page commit resolves it, record that exact head as `rejected` evidence. Preserve the Git fact and the human verdict separately; do not rewrite history to make them agree.

## 5. Failure-family escalation

A repeated correction is stronger evidence than a one-off page detail.

`failureFamilySeverity()` classifies mechanisms:

- `normal` — one observed event;
- `repeated` — the same mechanism appears at least twice;
- `hard` — at least three events, or the owner explicitly says this was already corrected before.

Hard does **not** mean “turn one word into a global blacklist.” It means the failure mechanism must be explicitly checked before owner review.

Example:

```text
OpenEVO · SEED × WebShop
AGENDA / RESULTS / MECHANISM
```

are not forbidden because English is forbidden. They belong to a hard family when the English eyebrow adds no identity, technical definition, or navigation value and therefore creates pure attention tax.

## 6. Preference Model still owns cross-case generalization

`src/data/humanPreferenceModel.ts` remains the cross-case model with:

- scope;
- confidence;
- priority;
- supporting cases;
- retrieval tags;
- anti-overgeneralization boundaries.

Precedence remains:

```text
current explicit owner instruction
> newest direct accepted feedback
> repeated/scoped Preference Model
> generic design guidance
> Agent aesthetics
```

One page-specific correction must not silently become a universal law.

### Owner instruction vs generic reviewer

A generic blind/preference reviewer is evidence, not a higher authority than the owner. If a reviewer recommendation conflicts with an explicit current owner requirement:

1. preserve the owner-required object;
2. record the conflict as an **intentional owner override** rather than silently deleting the requirement;
3. keep any independent valid concern from the review (for example terminology friction or weak visual hierarchy);
4. do not manufacture a PASS by treating generic taste as task authority.

This is not permission to bypass scientific/product truth. Executable truth and non-hideable scientific boundaries still outrank presentation preference.

## 7. Mandatory task-time Preference Brief

For material user-facing copy/layout/design work, **do this before the first substantial draft**, not after a rejection:

```bash
npx tsx scripts/generate-human-preference-brief.ts \
  --contract=study-briefing \
  "科研汇报 去 AI 味 ADHD 注意力 TaskVector 公式"
```

The brief compiles:

- current hard/repeated failure families;
- direct feedback events;
- relevant Preference Trajectories;
- Golden / Silver / Rejected visual references;
- existing Preference Model rules;
- Gold Pairs;
- anti-overgeneralization boundaries.

`feedback:retrieve` remains a useful low-level search tool. The **Preference Brief** is the generation-time owner because it combines the old retrieval layer with trajectories, visual evidence, and escalation.

As the case/pair corpus grows, retrieval must preserve older hard constraints as well as newer high-similarity evidence. Current briefs allow up to 16 learned preferences/Gold Pairs. Direct events use a bounded two-part selection: the 22 most relevant events first, then any additional in-scope event that carries a hard failure family, with an absolute cap of 30. This is not permission to dump the full history; it prevents new high-similarity events from silently evicting direct evidence for an already-hard correction. Regression tests must prove older closeout receipts still retrieve their required signals after new cases are added.

If the brief says there is no Golden reference, the Agent must not invent one.

For a material surface that is not owned by a BaseModel Reader Contract, use the narrow learned scope instead of borrowing a convenient research contract. Example:

```bash
npx tsx scripts/generate-human-preference-brief.ts \
  --scope=recovery \
  "账号故障自救页面：用户很着急、没有上下文，但完整运行手册仍要保留"
```

`scope` is an anti-overgeneralization gate, not a display label. Scoped Preference Briefs keep that scope plus genuinely `all-public-ui` evidence; briefing-only / research-only history must not leak into a recovery task merely because it has high global priority. Explicit workflow cues such as Preview/build/review may still retrieve workflow evidence across a page scope because they describe the delivery loop rather than the page's visual grammar.

Cross-repository feedback remains valid training evidence when provenance is explicit: preserve the source repository, route, PR/SHA when available, and keep the learned rule in this BaseModel HPL authority. Do not copy the source product itself into BaseModel or pretend the source artifact was a BaseModel route.

## 8. Internal 2–3 candidate screening

Material user-facing work should not expose the Agent's first aesthetic guess to the owner.

Generate a receipt template:

```bash
npx tsx scripts/generate-human-preference-candidate-receipt.ts \
  --contract=study-briefing \
  "refresh OpenEVO advisor briefing" \
  > /tmp/preference-candidates.json
```

Then create **2–3 internal candidates**. For visual work each candidate must have a screenshot reference.

Each candidate records:

- hypothesis;
- first attention center;
- intended information density;
- visual-language rationale;
- screenshot reference;
- predicted failure families.

The selected candidate must beat every other candidate in a recorded pairwise comparison with visible evidence.

Before owner review:

```bash
npx tsx scripts/verify-human-preference-candidate-receipt.ts \
  /tmp/preference-candidates.json
```

The verifier fails when:

- there are fewer than 2 or more than 3 candidates;
- a visual candidate has no screenshot;
- the selected candidate did not beat every alternative;
- a current hard failure family was not checked;
- the receipt says the owner was shown the discarded internal variants.

The point is not to make the owner choose among three drafts. The point is to use historical feedback to reject weak drafts **before** the owner sees them.

### Evidence binds to the final artifact

Candidate selection, screenshots, and judge receipts are evidence for a concrete artifact, not for a task name in the abstract. A material change after selection — scientific result/caveat, information hierarchy, composition, or other user-visible content that can change attention — invalidates the old rendered evidence. Re-render and rerun the relevant comparison/review, then bind the receipt to the final Git SHA / artifact identity.

A non-semantic mechanical fix may use a narrower revalidation only when the current contract allows it, but the final receipt must still identify the final tree. Never cite screenshots from an earlier candidate as exact-head evidence for a materially changed version.

## 9. Two-phase cold read remains mandatory after generation

Candidate screening uses learned preferences and is therefore not a blind review. A separate blind pass is still required.

### Phase A — blind

```bash
npm run feedback:cold-read -- study-briefing --phase=blind --url=<rendered-url>
```

The reviewer sees only the rendered artifact and answers what it appears to be about, first attention target, terminology friction, competing centers, hidden boundaries, suggested changes, and desire to continue reading.

Save Phase A before revealing preference evidence.

### Phase B — compare

```bash
npm run feedback:cold-read -- study-briefing --phase=compare
```

Now reveal the Reader Contract, Preference Model, Gold Pairs, and historical boundaries. Compare rather than guess.

## 10. Judge receipt remains the post-generation gate

```bash
npm run feedback:cold-read -- study-briefing --phase=receipt --url=<rendered-url> > /tmp/preference-judge.json
npm run feedback:judge -- /tmp/preference-judge.json
```

A PASS requires exact Git SHA + rendered URL, a real blind-first ordering, complete judgments, scientific-boundary PASS, no failed bound preference, no rejected-like required pair, and zero unresolved concern.

Browser/structural PASS still does not prove human comprehension.

## 11. Feedback ingestion lifecycle

When the owner gives new direct feedback:

1. preserve the exact owner signal and rejected surface;
2. record the verdict accurately (`better` is not `accepted`);
3. append/update the canonical CASE;
4. create a Human Feedback Event;
5. connect it to a Preference Trajectory when a prior variant exists;
6. identify the underlying failure mechanism, not only the visible token;
7. recompute whether that family is normal / repeated / hard;
8. update a Silver/Golden/Rejected visual reference only when evidence supports the tier;
9. update Preference Model / Gold Pair only when the abstraction is reusable and scoped;
10. scan sibling surfaces by failure mechanism;
11. add deterministic protection only for mechanically detectable invariants;
12. run Preference Brief → internal candidates → blind cold read → preference compare on the next material task.

## 12. Anti-overfitting rules

Do not turn this system into a larger word blacklist or frozen style guide.

- a rejected word can be correct in another semantic role;
- a Silver visual is not a template;
- absence of Golden evidence means uncertainty, not permission for Agent taste;
- scientific caveats outrank minimalism;
- exact technical terms remain valid when the reader needs them;
- reducing cognitive load does not mean deleting useful mathematical depth;
- page-specific accepted implementation details do not automatically become global defaults;
- a generic preference cannot override a newer direct owner correction;
- a browser Gate cannot certify that the owner will like or understand a page;
- a judge receipt proves the review protocol ran; it does not manufacture owner approval.

## 13. Current briefing lesson encoded by V2

The 2026-09-08 OpenEVO briefing is the first explicit Preference Trajectory.

The important learned distinction is not `cards bad / circles good / minimal good`.

It is:

> **Remove elements that make the reader decide where to look or decode author-internal language; preserve information, color, mathematics, or structure when they directly carry the research argument.**

That is why a decorative pale bubble can be rejected while a dense TaskVector formula can be preferred on the mechanism slide.


The PR #605 storyline review adds a further research-copy distinction:

> **A scientifically meaningful shorthand can still be the wrong first sentence if the audience must decode it before they know the event.**

`7 < 8` is useful evidence after the gate is introduced, but the human entry point is `训练跑了很久，但参数一次都没有更新`. Likewise, `7B：结论` and `composed state` are not globally banned tokens: prefer a directly repeatable event sentence, preserve technical names that denote real objects, and translate author-internal English glue that adds no scientific precision. The owner repeated this family during closeout, so `compressed-shorthand-heading` is now hard.

A later HPL-informed draft still titled Slide 3 `我们不是只跑一次实验，而是一步步换问题去验证`. The owner explicitly said the slide **still** repeated the same pattern. Reuse CASE-081 rather than inventing a keyword ban: `defensive-negation-opening` and `anticipatory-rebuttal` are hard mechanisms. A direct topic such as `我们做过哪些尝试` wins when the contrast adds no scientific information; real scientific negation/caveats remain allowed next to the claim they constrain.

PR #605 visual state still follows the later #611 closeout: exact head `56b5120b…` is Rejected because later owner hard-failure feedback remained unresolved on that exact page head. The binary-contrast correction is preserved as a dimension-level improvement only; it does not upgrade the whole visual to accepted/Silver.

## End-of-conversation ingestion closeout

When the owner asks to absorb a whole modification conversation, follow [`human-feedback-ingestion-closeout.md`](human-feedback-ingestion-closeout.md). The closeout source of truth is machine-readable: `src/data/humanFeedbackIngestionCloseouts.ts`. Validate a recorded closeout with:

```bash
npm run feedback:ingestion-closeout -- INGESTION-20260909-OPENEVO-BRIEFING
```

`src/lib/humanFeedbackIngestionCloseout.ts` verifies ledger coverage, structured references, verdict/tier boundaries, supersession, a real future-task Preference Brief, and an evaluation-side recurrence failure. Conversation → ledger semantic extraction is still Agent-interpreted because repository tooling cannot read ChatGPT conversation history directly; never call that part automatic ingestion.

## Ownership map

- raw feedback history: `docs/agents/current/website-copy-cases.md`;
- structured precedent index: `src/data/humanFeedbackPrecedents.ts`;
- cross-case model + Gold Pairs: `src/data/humanPreferenceModel.ts`;
- event / trajectory / visual / escalation evidence: `src/data/humanPreferenceLearningHistory.ts`;
- old retrieval + cold-read context: `src/lib/humanPreferenceLearning.ts`;
- V2 Preference Brief + candidate receipt verification: `src/lib/humanPreferenceBrief.ts`;
- Preference Brief CLI: `scripts/generate-human-preference-brief.ts`;
- candidate receipt template: `scripts/generate-human-preference-candidate-receipt.ts`;
- candidate verifier: `scripts/verify-human-preference-candidate-receipt.ts`;
- blind/compare protocol: `feedback:cold-read`;
- final preference judge: `src/lib/humanPreferenceJudge.ts` + `feedback:judge`;
- deterministic integrity: structural tests + `audit:human-feedback`;
- end-of-conversation coverage ledger: `src/data/humanFeedbackIngestionCloseouts.ts`;
- closeout integrity + future-task retrieval + evaluation proof: `src/lib/humanFeedbackIngestionCloseout.ts` + `feedback:ingestion-closeout`;
- rendered geometry: Reader Contract + browser gates.
