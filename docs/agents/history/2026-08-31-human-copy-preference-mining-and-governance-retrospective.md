# Human-copy preference mining and governance retrospective — 2026-08-31

## 1. Why this retrospective exists

The owner asked for a durable website design document that explains what “说人话 / 不要 AI 味很重” actually means in this repository, plus a separate Markdown case library built from the site's historical copy changes.

The hard part was not drafting a style guide. The hard part was recovering a stable preference from a fast-moving repository that already had several overlapping writing contracts, hundreds of historical commits and PRs, intermediate copy versions, later reversals, scientific-language constraints, CI/deployment cost controls, and concurrent work landing on `main` while the audit was still in progress.

This retrospective records the reasoning and engineering friction behind PR [#345](https://github.com/mykcs/basemodel/pull/345), which merged as `7a4e2f972e7b4a49ceef117d089dfa0588dce2c0` on 2026-08-30. The current policy owners remain:

- [`../current/website-design-spec.md`](../current/website-design-spec.md) — canonical website-level wording/design preference;
- [`../current/website-copy-cases.md`](../current/website-copy-cases.md) — historical before/after case evidence;
- the narrower technical/research/UI contracts referenced by the website design spec.

Read current policy first. Use this file when the task is to recover preferences from history, reconcile conflicting historical copy rules, or understand why the current “human voice” rules look the way they do.

## 2. What the owner actually asked for

The requested deliverable had four parts:

1. create one website design specification inside the repository;
2. make “说人话 / 去 AI 味” a first-class design rule rather than a chat-only preference;
3. put the concrete historical examples in a separate Markdown file and reference them from the main specification;
4. inspect the website's history from the beginning, including commits and PRs, and infer durable copy preferences from those changes.

A key requirement was implicit but important: a future Agent should be able to receive only “请说人话，不要 AI 味很重” and still know what that means for this specific site.

## 3. Starting state: there were already several writing contracts

The repository did not begin from zero. It already had, among others:

- `audience-centered-technical-copy.md`;
- `reader-first-copy-hierarchy.md`;
- `layered-technical-explainer-copy.md`;
- `research-editorial-style.md`;
- `human-thinking-web-expression-contract.md`;
- `ui-design-principles.md`.

Those files were useful, but none of them alone answered the owner's short instruction “说人话 / 不要 AI 味”. They owned different slices: technical context, result hierarchy, Chinese explanation depth, research narrative, semantic HTML, and visual design.

The first architectural decision was therefore **not** to create another parallel style guide with overlapping authority. The new `website-design-spec.md` became the website-level owner of user voice, information order, heading behavior, and conflict resolution. Existing documents remained narrower owners.

This prevented a common documentation failure mode:

```text
new feedback
-> create another style file
-> old files remain active
-> future Agent reads two incompatible rules
-> copy drifts again
```

The correct pattern is:

```text
canonical website preference
-> narrower technical/research/UI owner
-> concrete historical case evidence
```

## 4. The core reasoning breakthrough

The useful definition was not a blacklist of words. The stable pattern across the history was about **information order and narrator posture**.

The final general rule became:

> object / fact -> conclusion -> mechanism -> evidence

The recurring “AI taste” was usually the reverse: the page first explained how it would teach, how the reader should interpret it, what was “important”, what a “common misunderstanding” was, or how the section was organized, and only later stated the actual fact.

That distinction explains why the owner disliked phrases such as:

- `怎么读`;
- `一个常见误解`;
- `如果只带走一句话`;
- `下面我们会`;
- `本页 / 本节 / 本站 / 这里`;
- forced analogies when the literal fact was already easy to state.

It also explains why simply banning question marks, negative words, or technical terms would have been wrong.

## 5. Historical archaeology: what had to be mined

The audit started from the site's first commit, `dd9b04b` (`feat: launch agent model atlas MVP`, 2026-08-05), and followed the repository forward.

The repository was moving while the work was in progress, so the observed counts changed during the conversation:

- an early scan saw 884 mainline commits and 338 visible PRs;
- later scans saw 898 and then 901 mainline commits;
- the final canonical audit snapshot recorded in `website-design-spec.md` used `origin/main@e11d443`: 901 mainline commits, 274 merged PRs, and 349 visible PR metadata records, with repository PR numbering already reaching #350.

Those numbers are a **dated audit snapshot**, not a permanent repository count.

The audit used several layers instead of trusting commit titles alone:

1. broad commit-title search for copy/reader/editorial/human/wording/i18n/title/label/explainer signals;
2. targeted diffs for high-signal commits;
3. PR bodies to recover the stated reason for a change;
4. tests that intentionally locked or rejected specific wording;
5. existing current contracts and retrospectives;
6. direct owner feedback, especially the latest `lyg2171` wording pass.

This produced a high-signal historical ledger and a smaller set of explicit before/after cases.

## 6. The crucial classification: preference evidence vs historical evolution

A merged string is not automatically a user preference.

A feature PR can add hundreds of sentences simply because the feature needs text. A test can preserve a temporary wording. A later PR can reverse an earlier editorial rule. Therefore the case library separated two evidence classes:

- **PREFERENCE** — explicit owner feedback, a broad owner-approved copy audit, or a durable writing contract supported by later usage;
- **EVOLUTION** — useful historical context or intermediate wording that shows how the site changed but cannot override later preference evidence.

This distinction prevented circular reasoning such as:

> “The repository contains this sentence, therefore the owner prefers this sentence.”

It also prevented the new specification from treating its own delivery PR as proof that its rules were correct.

## 7. Historical rule drift: newer explicit feedback must beat older generic guidance

The clearest conflict was the heading rule.

A 2026-08-12 copy pass emphasized “concrete action before abstract framing”. That was a real improvement over vague labels such as `研究主线`, `决策面`, or `证据链`, and it remains useful for buttons, navigation, and executable procedures.

But later feedback refined the rule. By the Results work and especially the 2026-08-30 `lyg2171` edit, the owner repeatedly preferred ordinary headings such as:

- `lyg2171 服务器简介`;
- `GPU 规格`;
- `磁盘使用情况`;
- `数据来源`;

instead of headings such as:

- `这台服务器能做什么，以及哪里最容易先用满`;
- `“第几代”和“多少核”怎么读`;
- `一个常见误解`;
- `这些数字是怎么测出来的？`.

The correct reconciliation is not “old rule wrong, new rule right”. It is narrower:

- **ordinary H1/H2/H3**: name the subject;
- **buttons and real actions**: use concrete verbs;
- **procedures**: action language is appropriate because sequence is the content;
- **real decision questions**: a question heading can remain a question.

This became a general precedence rule: when historical guidance conflicts, prefer the later, more explicit, more directly owner-validated rule for the same surface.

## 8. Stable preferences recovered from the history

The case mining converged on a set of recurring preferences:

1. **Things before narration.** Explain the experiment, server, model, result, or failure before explaining the article/page.
2. **Subject-first headings.** Do not turn every heading into a tutorial prompt or simulated reader question.
3. **No editorial stage directions.** `本页 / 本节 / 这里 / 下面我们会 / 为了避免重复` usually belong in author notes, not public copy.
4. **No artificial “insight” framing.** `值得注意`, `常见误解`, `真正重要的是`, and `如果只记住一句话` must add information or disappear.
5. **One meaning once.** Do not create hierarchy by repeating the same idea as eyebrow + heading + first sentence.
6. **Concrete objects over packaging nouns.** Prefer model, GPU, experiment, result, file, task, and data over `研究主线 / 决策对象 / 证据链` when the concrete object is known.
7. **Human state before machine encoding.** `我们一步都没训练` is better mainline prose than `0 个 adapter 训练步`; raw fields remain available as evidence.
8. **Direct responsibility.** If the responsible layer is known, name it before clearing a list of unfamiliar suspects.
9. **Chinese-first meaning.** Keep exact English lookup terms when useful, but do not make Chinese readers decode project English before understanding the concept.
10. **Analogies are optional.** If the literal mechanism is already clear, an analogy can make the prose feel more synthetic rather than more human.
11. **Scientific precision is not tone debt.** `measurement-invalid`, `unknown`, `pre-specification`, exact checkpoint identity, and negation polarity must remain correct even when the prose becomes simpler.
12. **Interaction must agree with language.** A warning that says “do not `cat` this secret” must not be accompanied by a generated “copy `cat`” action.
13. **Public examples minimize identity exposure.** Reproduction examples should use generic paths such as `$HOME/...` rather than unnecessary real Unix usernames or account paths.
14. **Results are not command manuals.** Scientific question, result, decisive number, explanation, and boundary stay in the mainline; long commands/config/logs belong in optional reproduction depth.

These are not independent stylistic decorations. They all reduce one recurring burden: forcing the reader to translate author intent, product architecture, machine encoding, or project history before understanding the actual subject.

## 9. Friction A — too many existing style documents

### What happened

At first glance, adding another design/copy document risked creating a sixth overlapping style guide. The repository already had strong but specialized contracts.

### Why it was dangerous

A future Agent could satisfy one document while violating another. The owner would then have to repeat the preference in chat again.

### Reusable rule

Before adding a policy file, map existing owners by responsibility. Add a new owner only for a genuinely uncovered axis. State explicitly which older documents remain authoritative for narrower concerns.

## 10. Friction B — history contains intermediate drafts, not just final preferences

### What happened

Many historical copy changes were useful but later refined. Some old headings were more concrete than their predecessors but still more “AI-presenter-like” than the owner's later preferred wording.

### Reusable rule

Historical preference mining needs temporal and semantic weighting:

```text
latest explicit owner feedback
> durable current contract supported by later use
> owner-approved broad audit
> merged intermediate copy
> generic feature text
```

Do not count commits as votes.

## 11. Friction C — keyword search has both false negatives and false positives

A pure `git log --grep=copy` pass misses feature PRs whose real user-facing change is buried in a broader refactor. Conversely, a title containing `copy` may be a test-only or i18n maintenance change with little preference evidence.

The audit therefore needed both precision and recall passes, followed by PR-body/diff inspection. Mixed changes such as result-publication depth, privacy-safe paths, or interaction-copy mismatches entered the case set only after manual evidence review.

## 12. Friction D — a first extraction script failed before touching data

A small Python helper used during diff extraction failed with a `SyntaxError` because `nonlocal` was used without an enclosing binding.

This was not a repository problem and did not justify changing scope. The useful response was simply to replace the helper with a simpler extraction path and continue.

### Reusable rule

Classify tool/script failures by layer before reacting:

```text
helper syntax
!= repository content failure
!= Git failure
!= CI failure
!= product failure
```

Do not let a disposable analysis script become the critical path.

## 13. Friction E — the conversation resumed with partial repository state already present

During the work, the docs branch and PR already existed from prior progress. The correct move was to inspect the actual branch, files, commit, and PR state rather than reconstructing them from conversational memory.

### Reusable rule

When resuming a long repository task:

1. fetch remote state;
2. inspect current branch/worktree/PR;
3. read the files already written;
4. compare them with the current request;
5. continue from repository truth.

Chat memory is context, not a substitute for the current Git tree.

## 14. Friction F — `main` moved repeatedly during a historical audit

While the specification was being assembled, unrelated and related PRs kept landing. The observed baseline advanced through multiple `main` heads; later #350 and #351 landed during the final validation window, and #353/#354 landed before PR #345 finally merged.

The difficult question was not how to rebase. It was **when a moving `main` should change the audit conclusions**.

### Reusable rule

Re-inspect new `main` changes only when they can affect one of these:

- the copy/design evidence being mined;
- the current policy/router files being edited;
- the branch's merge safety;
- the validation contract.

Do not rewrite a dated historical audit count merely because an unrelated docs/CI commit landed after the snapshot. A snapshot needs a named SHA and date, not permanent numerical freshness.

Before final merge, synchronize once more with current `main` if the branch is behind and the repository requires current-base acceptance.

## 15. Friction G — isolated worktree had no usable Node dependencies

The clean temporary worktree did not have `tsx` / `vitest`, so `npm run audit:copy:strict` and the focused Vitest command could not start. The failure message was dependency resolution, not a test assertion.

A local symlink to the already-installed dependency tree in the main checkout was sufficient for this docs-only validation pass. After that:

- `npm run audit:copy:strict` completed with 0 strict invariant failures;
- `src/lib/agentScenarioTriggerRegistry.test.ts` passed 13/13.

### Reusable rule

In a clean worktree, distinguish “test runner unavailable” from “tests failed”. Reuse a verified local dependency tree when repository policy allows it, or install dependencies explicitly. Never report a command that failed to start as a failed product test.

## 16. Friction H — shell syntax was environment-dependent

One later worktree command used Bash variable syntax while Desktop Commander launched fish, producing:

> `fish: Unsupported use of '='`

No repository file changed. The fix was to run the command with an explicit `/bin/bash` shell.

### Reusable rule

For non-trivial shell snippets, especially ones using heredocs, Bash arrays, variable assignment, or `set -e`, choose the shell explicitly. A shell parser error is an invocation failure, not evidence about repository state.

## 17. Friction I — `gh pr edit` failed because of unrelated Classic Projects GraphQL behavior

Updating PR #345's body through `gh pr edit` hit a GitHub CLI GraphQL error related to Projects (classic) deprecation.

The PR itself was healthy. The workaround was to update the pull request body through the GitHub REST API instead of repeatedly retrying the broken CLI path.

### Reusable rule

When a GitHub CLI high-level command fails on an unrelated GraphQL field, fall back to the narrower REST endpoint. Do not create a new PR or rewrite Git history to work around collaboration-layer tooling.

## 18. Friction J — `src/AGENTS.md` looked like the obvious routing point but would trigger Vercel

An early version added the new policy to `src/AGENTS.md` so every source edit would load it automatically.

Repository inspection then showed that `scripts/vercel-ignore-build.mjs` classifies every non-test `src/` path as build-relevant. Keeping that edit would have turned a governance-only PR into a deployment-relevant change and consumed an unnecessary Vercel build.

The `src/AGENTS.md` change was removed. The durable routing remained in:

- root `AGENTS.md`;
- `docs/agents/README.md`;
- `scenario-trigger-registry.md`.

### Reusable rule

Policy discoverability and deployment relevance are separate design constraints. Before placing governance text under a source tree, inspect the repository's build classifier. Prefer the highest-level router that reaches the task without changing deploy semantics.

## 19. Friction K — self-hosted CI queue looked like a stuck PR

After the updated #345 head was pushed, the required self-hosted CI sat queued because the single runner was still executing #341's browser-heavy acceptance.

The correct diagnosis came from inspecting the active workflow/job list, not from assuming the new branch was broken. #345 later ran and completed successfully.

### Reusable rule

For a queued required check, inspect:

```text
workflow status
-> runner occupancy
-> currently running branch/job
-> queued jobs behind it
```

A queue is not a failure. Report the occupying job when useful so the owner knows exactly where progress is blocked.

## 20. Friction L — Vercel “no deployment” needed positive verification

Because the change was governance/docs-only, the desired outcome was **no Vercel Preview build**. That needed evidence too.

The branch's changed paths were checked with the repository's build-relevance classifier and all returned `SKIP`; `shouldBuildForFiles=false`. The Vercel deployment list was then inspected and showed no deployment object for the #345 head. Recent deployments belonged to other branches or `main`.

### Reusable rule

“Skipped by design” and “never checked” are different states. For build-budget-sensitive repositories, prove intentional non-deployment with both local classifier evidence and provider state when practical.

## 21. Friction M — open PRs are useful evidence, but not accepted preference

During the audit, PR #341 contained a good reader-first rewrite of the Stage-2 shorthand `20,480 -> 797 -> threshold 8 -> observed max 7 -> 0 update`. At that moment it was still open.

The case library therefore recorded it as pending evidence rather than promoting it into the accepted preference set. After it later merged into `main`, the governance sync updated its status accordingly.

### Reusable rule

A good-looking open PR is not repository truth. Track three states separately:

- proposed wording;
- accepted/merged wording;
- current policy derived from accepted history.

This is especially important when the historical audit itself overlaps active editorial work.

## 22. Friction N — final PR synchronization should preserve tested work, not restart it

PR #345 eventually used a synchronization commit (`b977704`) that merged the then-current `main` into the already-tested documentation branch before final merge. The PR merged at `7a4e2f9`.

The goal of synchronization was to reconcile routing/current-main changes, not to reopen the entire historical analysis from scratch.

### Reusable rule

When a docs governance PR is already semantically complete:

1. inspect new main changes for overlap;
2. merge/rebase once using the repository's accepted convention;
3. update only genuinely stale routing/evidence statements;
4. rerun required checks;
5. merge.

Do not continuously chase unrelated main commits after the acceptance question is already answered.

## 23. Reasoning lessons

### 23.1 Recover behavior, not vocabulary

The owner's preference cannot be represented as “ban these 20 phrases”. The same word can be natural in one context and artificial in another.

For example:

- a real scientific contrast can use `不是`;
- a real workflow can use `先 / 再 / 最后`;
- a real user decision can be a question;
- a precise technical term can remain English on first use if its Chinese meaning is already supplied.

The stable object of analysis is the sentence's **job**: does it state the subject, or does it narrate the act of explaining the subject?

### 23.2 Preference inference needs counterexamples

A useful style rule should include cases where the apparently similar construction is allowed. Without counterexamples, future Agents overfit.

The current spec therefore explicitly says:

- negative words are not banned;
- questions are not banned;
- analogies are not banned;
- technical terms are not banned;
- detailed evidence is not banned.

What matters is placement, necessity, and reader burden.

### 23.3 A case library is part of the contract, not decoration

Abstract guidance such as “sound natural” is too lossy. The separate case file lets future Agents compare a new sentence against real accepted before/after examples.

For this owner, “rule + precedent” is more reliable than rule alone.

### 23.4 Scientific copy has two simultaneous obligations

Good copy must be easier to read **and** at least as accurate as the source evidence.

A rewrite that removes AI-like scaffolding but accidentally changes `not` polarity, turns `pre-specification` into `preregistration`, collapses `unknown` into `false`, or converts measurement invalidity into model failure is strictly worse.

Therefore the sequence for research copy is:

```text
verify fact / claim boundary
-> rewrite information order and voice
-> preserve exact evidence beneath it
```

### 23.5 Current policy should be compact; history can be detailed

The 50-case library is intentionally larger than the canonical spec, and this retrospective is larger still. Future Agents should not be forced to read every incident for every copy edit.

The durable architecture is progressive disclosure:

```text
root router
-> website-design-spec
-> closest case category when tone is at issue
-> narrow technical/research/UI owner
-> historical retrospective only when reasoning/history is needed
```

## 24. Recommended workflow for future preference-mining tasks

### Phase A — define the missing owner

Before reading history, write down which question the current policy stack does not answer. Do not mine hundreds of commits before knowing the missing decision surface.

### Phase B — establish repository truth

Record:

- current `origin/main` SHA;
- first relevant historical commit;
- existing policy owners;
- active/open PRs that may overlap the topic;
- deployment/build-relevance rules for the files likely to change.

### Phase C — build a high-recall candidate set

Search commit subjects and PR metadata with multiple semantic families, not one keyword. Include wording, title, label, reader, editorial, explainer, i18n, copy, and user-feedback language.

### Phase D — classify evidence strength

For each candidate, ask:

1. Was this directly triggered by owner feedback?
2. Was it a broad accepted audit or a narrow incidental rewrite?
3. Did a later change refine or reverse it?
4. Is the changed sentence still present in current policy or public copy?
5. Does the PR body explain the editorial reason?

Mark the item as PREFERENCE, EVOLUTION, SUPPORT, or irrelevant.

### Phase E — extract before/after precedents

Cases should answer:

```text
before
-> after
-> why the after version is preferred
-> exact commit / PR provenance
```

Do not turn every historical candidate into a case. The ledger can be broad; the precedent set should stay discriminative.

### Phase F — derive rules from repeated mechanisms

Group cases by the burden they remove: meta-narration, duplicate hierarchy, abstract packaging, machine encoding, missing context, responsibility indirection, scientific overclaim, or interaction-language mismatch.

Avoid deriving a rule from one favorite phrase.

### Phase G — reconcile old and new rules explicitly

When a newer preference narrows an older rule, write the scope boundary into the current spec. Future Agents should not have to rediscover why both historical examples exist.

### Phase H — route without changing deployment semantics

Update the smallest current routers needed for discoverability. Check the build classifier before editing source-scoped instruction files.

### Phase I — validate structure and policy behavior

At minimum verify:

- case IDs are continuous;
- every spec -> case link resolves;
- local Markdown links resolve;
- the router and scenario trigger mention the new owner;
- copy strict gate passes;
- focused policy tests pass;
- `git diff --check` passes;
- changed paths have the intended deployment relevance.

### Phase J — synchronize once and close

Inspect concurrent `main`, reconcile genuine overlap, run required CI, verify provider skip/build state, and merge. Do not keep a historical snapshot numerically “live” forever.

## 25. Anti-patterns exposed by this conversation

Do not:

- create a new style guide before mapping existing owners;
- infer preference from commit count alone;
- promote every merged sentence into a durable style rule;
- turn “去 AI 味” into a blacklist of `不 / 先 / 问号 / 英文术语`;
- treat older generic guidance as stronger than newer explicit owner feedback;
- rewrite scientific terminology merely because it looks technical;
- let raw run IDs or machine fields become the first reader layer;
- add a source-scoped governance file without checking deployment relevance;
- interpret a missing test runner as a failed test;
- interpret a queued self-hosted job as a broken branch;
- repeatedly retry a high-level CLI path when a narrower API path works;
- chase every moving `main` commit after the relevant acceptance question has stabilized;
- use an open PR as accepted preference evidence;
- use the governance PR itself as circular proof of the rules it introduces.

## 26. Final outcome of the original task

PR #345 established the durable system the owner asked for:

- `docs/agents/current/website-design-spec.md` became the canonical website-level “说人话 / 去 AI 味” owner;
- `docs/agents/current/website-copy-cases.md` became the companion case library with concrete before/after precedents;
- root `AGENTS.md`, `docs/agents/README.md`, and `scenario-trigger-registry.md` route user-facing copy work into the new owner;
- explicit “说人话 / 不要 AI 味 / 自然一点” cues route future Agents to the case library instead of a generic style guess;
- existing research, technical-copy, visualization, and UI contracts remain narrower owners rather than being duplicated;
- the audit snapshot is explicitly dated and SHA-bound;
- docs-only deployment relevance was preserved, avoiding an unnecessary Vercel Preview;
- required self-hosted CI passed before merge;
- the final PR merged as `7a4e2f972e7b4a49ceef117d089dfa0588dce2c0`.

The most important long-term result is not the number of cases. It is that the owner's previously conversational preference now has three durable layers:

```text
rule
+ historical precedent
+ repository routing/enforcement
```

That makes a short future instruction such as “说人话” operational rather than ambiguous.

## 27. Evidence ledger

| Evidence | What it establishes |
|---|---|
| PR [#345](https://github.com/mykcs/basemodel/pull/345) | delivery and merge of the canonical website-copy governance |
| merge `7a4e2f972e7b4a49ceef117d089dfa0588dce2c0` | accepted repository integration |
| `website-design-spec.md` | current synthesized rule set and historical-audit boundary |
| `website-copy-cases.md` | concrete PREFERENCE / EVOLUTION examples and source links |
| PR [#336](https://github.com/mykcs/basemodel/pull/336) | strongest late-stage `lyg2171` subject-first / anti-presenter-tone precedent |
| PRs #218, #219, #224 | removal of editor/page self-narration |
| PRs #245, #247, #285 | conclusion-first and visible reasoning bridge |
| PRs #274, #278, #280, #287, #290 | technical context, natural machine-state wording, direct responsibility, and precise identity |
| PRs #342, #344, #349 | result-depth, interaction-language consistency, and privacy-safe public examples |
| `scripts/audit-audience-copy.ts` | contextual review queue plus narrow strict invariants |
| `scripts/vercel-ignore-build.mjs` | deployment relevance that motivated keeping the governance change outside `src/` |
| self-hosted CI run `33289857485` | required CI success for an exact #345 candidate head during closeout |

## 28. One-sentence handoff

When future owner feedback says “this still sounds like AI”, do not start by searching for banned words. Identify what the sentence is making the reader understand **before** the real subject, find the closest accepted case, remove that unnecessary translation layer, and keep the scientific/technical truth intact.
