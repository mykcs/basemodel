# Human Feedback Ingestion Closeout Protocol

Status: **current**
Audience: coding, writing, design, review, and release Agents
Owner: repository-level human-preference ingestion at the end of a user-facing modification conversation
Related authority: [`human-preference-learning-system.md`](human-preference-learning-system.md)

## 0. Why this protocol exists

The owner’s preferred working pattern is:

```text
modify the page normally
-> owner gives many rounds of direct human feedback during the same conversation
-> finish the page work first
-> at the end, run one explicit feedback-ingestion closeout
-> absorb the valuable feedback into the repository preference system
-> prove the next Agent can retrieve and use it
```

Do **not** interrupt every correction by maintaining the case library in real time unless the current task specifically requires that. The closeout exists so the design/development conversation can stay focused while still preserving the full human-feedback trajectory afterward.

The closeout is not a retrospective-writing exercise. It is a repository-learning operation.

Success means that a future Agent, with no access to the original conversation, can start materially closer to the owner’s preferences and can reject repeated failure families before owner review.

The primary metric remains:

> **How many times does the owner need to correct the same failure family again?**

---

## 1. Trigger

Run this protocol when all of the following are true:

1. a user-facing page/copy/layout/design task is substantially complete or paused at a stable review point;
2. the owner has given multiple rounds of direct feedback in the current conversation;
3. the owner asks to “吸收真人反馈 / 沉淀偏好 / 更新人话反馈 loop / 按反馈系统 closeout” or invokes this file explicitly.

Do not require the owner to repeat the feedback in a separate structured form. The current conversation is the primary source.

---

## 2. Non-goals

This closeout is **not**:

- another pass of ordinary page polishing;
- a project-status summary;
- a generic retrospective;
- a keyword blacklist builder;
- a reason to rewrite already-correct preference assets from scratch;
- permission to promote an Agent’s own visual taste into owner preference;
- permission to merge to `main` without explicit owner approval;
- model-weight fine-tuning or account-level memory.

If ingestion reveals a real unresolved page regression, record it and report it. Do not silently launch a broad redesign unless the owner asked for more page work.

---

## 3. Sources and authority

Before ingestion, resolve current repository authority from **current `main`**, not from remembered paths or stale chat SHA values.

Before the first local/RDC/terminal command in this closeout, read the current repository root `AGENTS.md` and `docs/agents/README.md`. This is an execution preflight, not merely a pre-mutation step: the root bootstrap may already own shell/worktree/tool rules that this protocol intentionally does not duplicate. If the command depends on Bash syntax, set the outer shell/interpreter explicitly (for example `/bin/bash`) before running it. Do not discover this only after a Fish parser error.

At minimum inspect:

- root `AGENTS.md`;
- `docs/agents/README.md`;
- `docs/agents/current/human-preference-learning-system.md`;
- `docs/agents/current/website-design-spec.md`;
- `docs/agents/current/website-copy-cases.md`;
- `src/data/humanFeedbackPrecedents.ts`;
- `src/data/humanPreferenceModel.ts`;
- `src/data/humanPreferenceLearningHistory.ts`;
- `src/lib/humanPreferenceLearning.ts`;
- `src/lib/humanPreferenceBrief.ts`;
- `src/lib/humanPreferenceJudge.ts`;
- current package scripts / audits / tests relevant to preference learning.

Paths may evolve. If an owner has moved, follow current repository ownership rather than restoring an old topology.

Evidence precedence for this closeout:

```text
current explicit owner instruction
> exact owner wording in the current conversation
> current rendered/version evidence from the task
> current repository preference data and executable tests
> historical cases / older summaries
> Agent inference
```

Never use an old summary to overwrite newer direct owner feedback.

---

## 4. Input contract

The ingestion input is the **entire current page-modification conversation**, from the first relevant design/copy/layout request through the final stable review point.

Collect, when available:

- owner feedback turns;
- assistant/page variants referenced by those turns;
- route(s);
- PR / commit / exact head;
- Preview URL(s);
- screenshot(s) or screenshot references;
- explicit “before / after” comparisons;
- explicit owner acceptance or rejection language;
- statements such as “我之前说过”, “好多了”, “这个可以”, “以后都这样”, “这个只是这一页”.

Do not assume every owner message is preference evidence.

---

## 5. Mandatory coverage ledger — no silent loss

Create a **Feedback Coverage Ledger** before mutating preference assets.

Every owner turn that plausibly contains user-facing design/copy/layout preference must receive exactly one disposition:

- `ingest` — create/update structured preference evidence;
- `merge-duplicate` — same preference event/failure family already represented; link it as reinforcing evidence;
- `superseded` — newer direct feedback explicitly replaces an older rule or implementation choice;
- `task-fact-not-preference` — scientific fact, bug report, temporary operation, or project state rather than reusable preference;
- `page-specific-only` — valid feedback that must stay narrowly scoped;
- `ambiguous-hold` — insufficient confidence to generalize; preserve raw evidence but do not promote a rule;
- `out-of-scope` — unrelated to user-facing expression.

**Delivery requirement:** 100% of identifiable candidate feedback turns must appear in the ledger. No high-value correction may disappear silently.

For every `ingest` / `merge-duplicate` / `superseded` item, record the exact owner wording or a stable direct excerpt reference.

---

## 6. What counts as high-value human feedback

Strong candidates include:

- explicit dislike / rejection;
- explicit preference for a newer variant;
- “better, but not accepted” intermediate feedback;
- repeated correction signals;
- explanation of *why* something causes cognitive load or feels artificial;
- explicit future-default language;
- a contrast between page variants;
- a device-specific behavior preference;
- a boundary between technical depth and presentation depth;
- a statement about what belongs in the main narrative versus progressive disclosure.

Weak/non-preference examples include:

- “build failed” without expression preference;
- a temporary command request;
- “the score is 49.33” as a factual correction;
- server/GPU status;
- an uncertain brainstorm with no preference commitment;
- implementation detail that applies only to one experiment unless the owner states a reusable principle.

---

## 7. Preserve the owner signal before abstraction

Do not store only the Agent’s cleaned-up rule.

For each Human Feedback Event preserve, as far as current schema allows:

- exact owner wording or faithful direct excerpt;
- route / surface / variant;
- timestamp or sequence identity when useful;
- prior variant relation;
- verdict;
- reason supplied by the owner;
- failure mechanism(s);
- scope;
- confidence;
- repeat signal;
- evidence reference (PR/SHA/route/screenshot) when available;
- anti-overgeneralization boundary.

Raw owner language is first-class evidence.

---

## 8. Verdict mapping — non-binary by default

Use the existing V2 verdict system accurately:

- `rejected` — owner rejects the direction/result;
- `better` — clearly improved relative to predecessor, but **not accepted**;
- `promising` — useful positive direction / experiment / technical-depth signal, still not accepted as final;
- `accepted` — owner explicitly accepts the concrete result;
- `canonical` — owner explicitly approves it as a reusable future standard/reference.

Hard rules:

- “好多了 / 比上一版好多了” **must not** become `accepted` or `canonical`;
- “方向对了” is normally `promising` or `better`, not Golden;
- “可以合并这版，但还不是 100%” may accept the concrete result without making the style canonical;
- only explicit future-reference language such as `以后就按这个标准 / 这个可以作为参考 / 以后参考这版` may justify `canonical` / Golden, subject to scope.

If uncertain, choose the lower-confidence / narrower state.

---

## 9. Failure mechanism — learn the cause, not the token

For every negative or corrective event, separate:

```text
visible symptom
!=
underlying failure mechanism
```

Example visible symptoms:

- meaningless English eyebrow labels;
- internal project jargon as headings;
- naked numbers with no semantic object;
- implementation parameter `2048 → 4096` promoted into a slide title;
- SHA / reproducibility details presented as research highlights.

Possible shared mechanism:

> **Author-internal encoding, implementation detail, or baseline-quality evidence was incorrectly promoted into the reader’s primary attention path.**

Do not mechanically merge unrelated events just because they share a word.

A failure family should help detect the *same cognitive mistake in a different surface form*.

---

## 10. Repetition and escalation

Use existing `failureFamilySeverity()` semantics and direct owner repeat signals.

Escalate when:

- the same mechanism appears repeatedly;
- the owner says `我之前说过 / 又出现了 / 我已经纠正过这个`;
- multiple pages demonstrate the same failure family.

Expected interpretation:

- `normal` — observed once;
- `repeated` — observed at least twice;
- `hard` — repeated enough to require explicit pre-owner-review checking, or owner explicitly identifies a repeat correction.

Do not turn `hard` into a literal word blacklist. Hard means **the mechanism must be checked**.

---

## 11. Scope, confidence, supersession

Every reusable abstraction must answer:

1. Where does this apply?
2. How strong is the evidence?
3. What newer instruction can override it?
4. When must it **not** be applied?

Typical scope examples:

- all public UI;
- research UI;
- advisor/research briefing;
- Chinese technical copy;
- phone layout only;
- desktop presentation only;
- one specific route / component.

### Supersession must be explicit

When a newer owner instruction replaces an older rule, do not silently edit history.

Example:

```text
older rule: fixed 16:9 on every device
newer direct feedback: desktop capped 16:9; phone reflows to viewport
```

Preserve the older event as historical evidence and record the newer scope-specific supersession.

---

## 12. Visual evidence and reference tiers

For visual feedback, text alone is insufficient when a stable variant can be identified.

Try to bind each important visual event to:

- route;
- PR / exact SHA;
- variant ID;
- screenshot reference or reproducible screenshot path;
- owner verdict;
- comparison target.

Use tiers exactly:

- `rejected`;
- `silver` — directionally positive, not approved as template;
- `golden` — explicitly approved reusable visual anchor;
- `current-candidate` — under review.

Never promote a screenshot to Golden because the Agent likes it.

If screenshots cannot be stably retained, preserve enough route/SHA/viewport information to reconstruct the visual state and state the limitation.

---

## 13. Preference Trajectory — preserve the sequence

When multiple variants exist, build/update the trajectory rather than creating disconnected CASEs.

Target form:

```text
A rejected
<
B better
<
C promising
<
D accepted
```

or, where a later direction regresses:

```text
A rejected
<
B better
>
C over-corrected
<
D balanced accepted candidate
```

For every edge, record **which dimensions improved or regressed**.

Recommended dimensions include:

- natural human wording;
- AI/rhetorical smell;
- cognitive load;
- competing attention centers;
- information density;
- heading hierarchy;
- numeric salience;
- terminology friction;
- scientific narrative clarity;
- technical depth;
- progressive disclosure;
- mobile readability;
- desktop composition;
- visual consistency;
- trust / scientific caveat visibility.

---

## 14. Preference Model / Gold Pair promotion rules

Do not create a broad Preference Model rule or Gold Pair for every event.

Promote only when:

- the mechanism is reusable;
- scope is known;
- the accepted side is genuinely supported by owner evidence;
- anti-overgeneralization can be stated;
- the abstraction changes future generation or evaluation.

A page-specific fix can remain only a Feedback Event + trajectory edge.

A reusable Gold Pair should encode **why** accepted beats rejected, not only different wording.

---

## 15. Required anti-overgeneralization

Every new reusable rule must include at least one explicit “do not overlearn” boundary.

Examples:

### Numbers in headings

Learn:

> Implementation parameters should not be promoted into headings merely to manufacture impact.

Do **not** learn:

> Numbers may never appear in headings.

A final score, `44 → 7` admission bottleneck, or another number that **is itself the scientific finding** may legitimately lead.

### Technical depth

Learn:

> Technical depth may increase when it carries the scientific argument; do not announce “this is more hardcore” as meta-rhetoric.

Do **not** learn:

> Every page should be simplified or formulas removed.

### Progressive disclosure

Learn:

> Baseline engineering rigor and deep implementation derivations should not steal main-talk attention when they are expected prerequisites rather than scientific findings.

Do **not** learn:

> Engineering evidence is unimportant or should be hidden when it changes scientific validity.

### Responsive behavior

Learn:

> Device behavior can be scope-specific: phone readability may require reflow while desktop presentation preserves a capped composition.

Do **not** learn:

> Everything should be fully fluid, or everything should be fixed 16:9.

---

## 16. Mandatory real examples for this protocol

Any implementation or audit of this closeout must correctly handle the following cases.

### Case A — intermediate positive feedback

Owner:

> `好多了，但不能说很好 / 还没 OK。`

Required:

- verdict remains `better` or `promising`;
- visual tier may become `silver`;
- must **not** become `accepted`, `canonical`, or `golden`.

### Case B — repeated meaningless English eyebrow

Owner:

> `我之前已经说过不要这种无意义英文小标题。`

Required:

- recognize existing failure family;
- mark direct repeat signal;
- escalate severity appropriately;
- check mechanism, not `English == forbidden`.

### Case C — parameter salience / heading hierarchy

Owner:

> `2048 → 4096 不要放标题。直接说“我们把记忆容量翻倍了”，具体参数放正文加粗。`

Required:

- preserve exact feedback;
- learn attention hierarchy / implementation-parameter salience;
- retain **2048 → 4096** as important body evidence;
- anti-overfit: scientific-result numbers may still lead when they are the result itself.

### Case D — device-specific layout supersession

Owner:

> `手机端适应窗口；电脑端不要随着超宽显示器无限放大。`

Required:

- scope phone and desktop separately;
- supersede any older “fixed 16:9 on phone too” preference for the affected route/family;
- preserve desktop capped composition;
- verify the next Preference Brief retrieves the scope split.

### Case E — technical depth without meta-performance

Owner:

> `TaskVector 可以更技术，但不要在 slide 上写“这里可以更硬核一点”。`

Required:

- preserve ability to use equations / technical metrics;
- reject self-congratulatory or meta “hardcore” framing;
- anti-overfit: do not add formulas everywhere.

### Case F — engineering rigor is default, not the research highlight

Owner:

> `SHA、重复性、这些默认应该成立，不值得占主演讲时间。`

Required:

- learn main-narrative vs drill-down distinction;
- baseline quality evidence may move to technical notes;
- boundary: if reproducibility changes causal validity, it must remain visible enough to protect the scientific claim.

### Case G — scientific-thinking narrative

Owner preference:

> show `遇到什么科学问题 → 怎么判断 → 做了什么实验 → 排除了什么解释 → 为什么进入下一步`.

Required:

- preference dimension is research-thinking clarity;
- reject project-status流水账 as the primary story;
- keep scientific caveats and unfinished-result boundaries.

---

## 17. Ingestion execution sequence

Use this order.

### Step 1 — freeze the source window

Record:

- conversation/task identity;
- relevant start/end points;
- current page routes;
- current exact SHA / PR if available;
- final owner-visible candidate(s).

If the source window has **no real product PR**, leave `pullRequest` absent and bind the evidence with the exact source head/route (or the strongest available stable artifact identity). Never invent a PR number, borrow an unrelated governance PR, or create a throwaway PR only to satisfy the ingestion schema. A PR is provenance when it exists, not a mandatory proof object.

When the source conversation has already been split across earlier closeouts, connect them through `predecessorIngestionIds` instead of copying old ledger rows into a new record. The final closeout must compute cumulative lineage coverage across the full predecessor DAG, reject duplicate ledger IDs / cycles / unresolved `ambiguous-hold`, and report the cumulative disposition counts. A segmented closeout is not complete merely because each window passes separately.

`finalVerdict` follows the latest direct owner evidence about the exact owner-visible head, not repository state. `accepted` requires explicit concrete acceptance. A head may be `rejected` even if it was later merged, deployed, or marked green when newer direct owner feedback rejects that exact version and no successor implementation follows.

### Step 2 — build the coverage ledger

List every candidate feedback turn and disposition it.

### Step 3 — deduplicate and connect history

For each learned event:

- search current CASEs / Events / Model / Gold Pairs;
- connect to existing mechanism when appropriate;
- do not create parallel synonyms for the same family unless distinction is real.

### Step 4 — write structured evidence

Update the canonical current owners:

- raw case evidence;
- Human Feedback Events;
- trajectories;
- visual references;
- failure severity / repeat signals;
- Preference Model / Gold Pairs only when justified.

### Step 5 — add/update deterministic protection where mechanical

Examples:

- a required route contract;
- viewport overflow invariant;
- visual candidate screenshot requirement;
- forbidden stale heading pattern when the rule is semantically safe to detect.

Do not encode subjective aesthetics as brittle literal tests unless the invariant is genuinely mechanical.

### Step 6 — prove next-generation retrieval

Generate a Preference Brief using a **future-task query**, not the exact owner sentence copied verbatim.

Example future-task cues:

```text
科研汇报 说人话 降低认知负担 技术公式 手机适配 桌面演示 参数标题
```

The brief must retrieve the newly learned mechanisms, scope, visual evidence, and anti-overgeneralization boundaries.

For a source surface outside BaseModel, or a BaseModel task without a matching Reader Contract, record explicit cross-repository provenance (`sourceRepository`, route, exact source head) and give the closeout a narrow `preferenceBrief.scope`. Do not force a recovery/dashboard/other surface through `study-briefing` just because an earlier ingestion implementation used that contract. The closeout validator must bind a `current-candidate` by exact source head + requested scope rather than one hard-coded visual reference ID.

Scope is part of the retrieval proof: specialized briefing/research preferences must not leak into a recovery task simply because they have high priority. `all-public-ui` evidence may still apply, and explicit workflow cues may retrieve workflow evidence across surface scopes because workflow describes the delivery loop rather than the page's visual grammar.

Treat scope as a semantic contract, not a knob for making the receipt pass. If the future task is specifically copy, a `research-copy` brief may be more correct than a broad `research-ui` brief; do not widen stored Events/Gold Pairs to unrelated scopes merely to force retrieval. When a receipt misses an expected signal, first check whether the requested scope actually matches the evidence owner.

For workflow-scoped learning, also prove **activation-cue parity** across the low-level retrieval and the compiled Preference Brief. If a genuine feedback/case-learning cue activates a workflow preference, the corresponding direct Event/trajectory must not be silently dropped by a different cue filter. Conversely, Preview/build/review-specific workflow evidence must not be pinned for a generic feedback-learning task that never asked about Preview. Fix the cue taxonomy or retrieval pipeline; do not pad the query with irrelevant keywords, inflate failure severity, dump the full history, or broaden scopes just to manufacture a PASS.

### Step 7 — prove evaluation-side learning

Verify that the relevant hard/repeated failure family or deterministic guard can reject a recurrence before owner review.

### Step 8 — run focused tests and current required audits

At minimum, as applicable:

- the actual `feedback:ingestion-closeout` receipt for the new/updated record (a green focused unit-test subset is not a substitute for the integrated retrieval/evaluation proof);
- Human Preference focused tests;
- `audit:human-feedback`;
- candidate receipt verifier;
- Reader Contract tests for modified executable contracts;
- any current-main required preference/agent-doc gate.

Do not run expensive website deployment solely for agent-control prose if current deployment policy classifies it non-deploy-relevant.

---

## 18. Feedback Ingestion Pipeline engineering requirement

If the repository already contains a usable ingestion CLI/pipeline, use it.

If it does **not** exist or cannot satisfy this protocol, implement the narrow missing capability instead of pretending manual edits are automatic ingestion.

A proper ingestion capability should eventually support:

- structured input derived from conversation feedback;
- schema validation;
- coverage-ledger output;
- duplicate/failure-family matching;
- verdict + scope + confidence capture;
- supersession links;
- trajectory updates;
- visual-reference bindings;
- dry-run/diff before mutation;
- fail-closed validation;
- a machine-readable completion receipt.

Until full automatic conversation extraction is technically available, the Agent may perform the extraction from the current conversation manually, but must still produce the same structured artifacts and completion receipt. Report that limitation honestly.

Current executable closeout owner:

```bash
npm run feedback:ingestion-closeout -- <INGESTION_ID>
```

Recorded ledgers live in `src/data/humanFeedbackIngestionCloseouts.ts`; generic integrity, retrieval and evaluation proof live in `src/lib/humanFeedbackIngestionCloseout.ts`. This validates a manually interpreted conversation ledger; it does not claim direct ChatGPT-history ingestion.

---

## 19. One-to-one delivery standard

The closeout is incomplete unless all of the following are true.

### A. Coverage

- 100% of identifiable preference-bearing owner turns have a ledger disposition;
- no explicit repeat correction is silently dropped;
- no `better` feedback is promoted to Golden without explicit approval.

### B. Evidence integrity

- every new structured event links back to owner wording/evidence;
- every reusable abstraction lists scope and anti-overgeneralization;
- every supersession preserves the older evidence instead of rewriting history.

### C. Trajectory integrity

- where multiple variants exist, their relative preference order is represented;
- every trajectory transition names the improved/regressed dimensions;
- Silver / Golden distinction is preserved.

### D. Mechanism quality

- the system learns failure mechanisms, not merely literal tokens;
- repeated mechanisms are linked rather than duplicated under near-synonyms;
- page-specific exceptions do not become universal rules.

### E. Generation proof

A newly generated Preference Brief for a plausible future task must visibly contain the important newly learned rules.

At minimum, for a conversation containing Cases A–G above, the brief should be able to recover:

- intermediate verdict ≠ canonical;
- meaningless-eyebrow / author-internal-language attention tax;
- parameter salience hierarchy;
- phone vs desktop scope split;
- technical depth without meta-performance;
- engineering rigor as progressive disclosure unless scientifically decisive;
- scientific problem → diagnostic → ruling-out → next-question narrative.

### F. Evaluation proof

At least one recurrence of a newly learned hard/repeated family must be demonstrably rejectable by:

- candidate screening;
- cold-read comparison;
- preference judge;
- or a deterministic test when mechanically appropriate.

### G. No fake automation claims

If conversation-to-event extraction still requires an Agent to interpret the current chat, say so. Do not claim “automatic ingestion complete” merely because the repository has storage schemas.

---

## 20. Required completion receipt

At the end, report a concise owner-facing summary, but keep the detailed machine/repository evidence in the project.

The report must contain exactly these categories:

1. **Feedback coverage** — number of candidate owner feedback turns; number ingested / merged / excluded / held / superseded.
2. **Learned mechanisms** — new or strengthened failure families / preference dimensions.
3. **Escalations** — which families became `repeated` / `hard` and why.
4. **Visual trajectory** — Rejected / Silver / Golden / current-candidate changes.
5. **Three concrete examples** — `owner said → system learned → future Agent behavior`.
6. **Intentional non-learning** — examples classified as fact/temporary/page-specific/ambiguous, with reasons.
7. **Retrieval proof** — future-task Preference Brief output summary showing the new learning is retrievable.
8. **Evaluation proof** — what can now reject recurrence before owner review.
9. **Automation gap** — anything still manual.
10. **Merge boundary** — do not merge to `main` unless the owner explicitly approves.

Do not drown the owner in every internal event. The repository holds detail; the completion message proves the loop worked.

---

## 21. Red-team completion question

Before saying “feedback absorbed”, ask:

> A future Agent has no access to this conversation and only sees current repository authority. On a similar page task, will its **first meaningful draft** be materially closer to the owner’s preferences, and can the system reject the known failure families before the owner repeats them?

If the answer is not clearly **yes**, the closeout is not finished.

---

## 22. Stop rule

Once:

- coverage is complete;
- structured evidence is updated;
- future Preference Brief retrieval is proven;
- evaluation-side protection is proven;
- required tests/audits pass;
- remaining automation gaps are honestly stated;

stop.

Do not use feedback closeout as an excuse for another unrequested redesign cycle.
