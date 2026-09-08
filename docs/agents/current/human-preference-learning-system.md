# Human Preference Learning System

Status: **current**
Audience: coding, writing, design, review, and release Agents

This file owns how direct human feedback becomes reusable project behavior. It does **not** claim model-weight fine-tuning or account-level memory. The learning loop is repository-level: structured preference data, task-time retrieval, pairwise examples, independent cold reading, and executable verification.

## Why the case library alone was insufficient

`website-copy-cases.md` is the canonical raw feedback history, but passive storage does not guarantee use. The repeated failure pattern was:

```text
owner correction
-> case written down
-> future Agent starts from its default aesthetic anyway
-> rule is remembered late or applied as a word blacklist
-> owner must correct the same failure family again
```

A correction counts as learned only when it changes both **the next generation context** and **the next evaluation context**.

## Four executable layers

```text
raw human cases
-> rejected ↔ accepted Gold Pairs
-> scoped Preference Model
-> task-time retrieval
-> Phase A blind cold read
-> Phase B preference comparison
-> judge receipt / browser + deterministic gates
-> release
-> new feedback returns to the loop
```

### 1. Raw cases remain canonical evidence

`docs/agents/current/website-copy-cases.md` keeps the owner feedback, rejected/accepted examples, reason, propagation scope, and boundaries. Do not rewrite history to fit a newer abstraction.

### 2. Gold Pairs preserve preference direction

`HUMAN_FEEDBACK_GOLD_PAIRS` keeps concrete `REJECTED -> ACCEPTED` examples. A pair is stronger than a ban word because it preserves *direction* and the failure mechanism. Do not promote an unaccepted PR or an Agent-only rewrite into a Gold Pair.

### 3. Preference Model generalizes across cases

`HUMAN_PREFERENCE_MODEL` stores cross-case dimensions with:

- scope;
- confidence;
- priority;
- supporting case IDs;
- retrieval tags;
- anti-overgeneralization boundaries.

The model is deliberately scoped. Every public Reader Contract inherits the `all-public-ui` baseline preferences and reusable baseline Gold Pairs; research/result/run/briefing/capability scopes then add narrower evidence, and the six highest-risk research entry points keep explicit CASE bindings. One page-specific correction must not become a universal law merely because it is easy to encode.

Precedence remains:

```text
current explicit owner instruction
> newest direct accepted feedback
> repeated/scoped Preference Model
> generic design guidance
> Agent aesthetics
```

### 4. Retrieval and judging are required use sites

Before substantial public copy/layout work, run a Preference Brief:

```bash
npm run feedback:retrieve -- --contract=study "Study 首屏 标题 AI味 注意力"
```

The command returns relevant preference dimensions, Gold Pairs, source cases, and anti-overgeneralization boundaries. Retrieval failure is a signal to read the canonical case library; it is not permission to invent a new global preference.

## Two-phase cold read

A cold read must actually be blind.

### Phase A — blind

```bash
npm run feedback:cold-read -- study --phase=blind --url=<rendered-url>
```

Give the rendered page and Phase A questions to a reviewer who has not read the implementation, PR, Reader Contract, case library, Preference Model, or Gold Pairs. Save the answers **before** revealing historical preference evidence.

Phase A asks what the page appears to be about, first attention target, most important fact/action, machine-like wording, terminology friction, competing visual centers, hidden boundaries, suggested changes, and desire to continue reading.

### Phase B — compare

Only after Phase A is saved:

```bash
npm run feedback:cold-read -- study --phase=compare
```

Now reveal the intended Reader Contract, scoped Preference Model, anti-overgeneralization boundaries, and required Gold Pairs. The reviewer compares the candidate against those precedents instead of guessing the owner's taste from scratch.

## Judge receipt

Generate a fail-closed receipt template:

```bash
npm run feedback:cold-read -- study --phase=receipt --url=<rendered-url> > /tmp/study-preference-judge.json
```

Fill it from the saved Phase A + Phase B review, then verify:

```bash
npm run feedback:judge -- /tmp/study-preference-judge.json
```

A PASS receipt requires:

- an exact Git SHA and rendered URL;
- an identified independent Agent or human reviewer;
- proof that Phase A happened before preference reveal;
- answers to every blind-read question;
- judgments for every contract-bound preference and Gold Pair;
- no `fail` preference judgment;
- no `rejected-like` required pair;
- scientific-boundary PASS;
- zero unresolved concerns.

An `intentional-exception` is allowed only with an explicit reason. This prevents the system from overlearning a case into a rigid template.

## Feedback ingestion lifecycle

When the owner gives new direct feedback:

1. preserve the rejected surface and the accepted replacement once known;
2. record why the preference exists, not merely the disliked token;
3. add/update the canonical CASE first;
4. decide whether it belongs to an existing preference dimension or creates a genuinely new scoped dimension;
5. add a Gold Pair only when the direction is accepted and reusable;
6. update retrieval tags and supporting evidence;
7. scan sibling surfaces by failure mechanism;
8. add deterministic protection only for reliably detectable invariants;
9. run blind + comparison review for material user-facing changes;
10. record the release receipt separately from human-comprehension evidence.

## Anti-overfitting rules

Do not turn these assets into a larger word blacklist. In particular:

- a rejected word can still be correct in a different semantic role;
- scientific caveats outrank minimalism;
- exact technical terms remain valid when the reader needs them;
- page-specific accepted implementation details do not automatically become global defaults;
- a generic preference cannot override a newer explicit owner correction;
- browser/structural PASS does not prove human comprehension;
- a judge receipt does not prove a human liked the page; it proves the preference-review procedure actually ran.

## Ownership map

- canonical raw feedback: `website-copy-cases.md`;
- structured precedent index: `src/data/humanFeedbackPrecedents.ts`;
- cross-case model + Gold Pairs: `src/data/humanPreferenceModel.ts`;
- retrieval logic: `src/lib/humanPreferenceLearning.ts` + `feedback:retrieve`;
- blind/compare protocol: `feedback:cold-read`;
- receipt validation: `src/lib/humanPreferenceJudge.ts` + `feedback:judge`;
- deterministic integrity: `audit:human-feedback` and structural tests;
- rendered attention/geometry: Reader Contract + browser gates.
