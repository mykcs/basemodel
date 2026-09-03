
# PR #420 deterministic verification and exact-head retrospective — 2026-09-03

Status: historical incident / lessons record; not current operating authority.

Current behavior is owned by the repository root AGENTS.md, the current Agent
principles, the scenario trigger registry, the UI/CSS and research-integrity
policies, the executable workflow/config/tests, and live GitHub/Vercel state.
This file preserves causal history and anti-examples so a future Agent can avoid
repeating the same reasoning errors.

All commit, PR, run, job, candidate, and provider values below are bounded to the
2026-09-03 validation conversation. They are evidence identifiers, not current
state.

## Executive result

The task began from the reported feature head
f53256269c4906e7b36b4331d1863a6b8a3cc38c. Live GitHub state had already advanced.
The validation snapshot ended with:

- PR #420 open, non-draft, and mergeable;
- feature head 14b0e142a210a85d83684bd24b84e31da562e88f;
- base 1fe9b3680904ff3ff53ed14ab0f8976c53074624;
- synthetic merge candidate 628e250c7852453349ed4c4ef327c2aa5047f08d;
- self-hosted CI run #207 successful, including 135 UI tests and 12 Lab-gate
  tests.

The original #187 failure was a real implementation failure in the old
candidate, not validation drift. The later #192 failure was checkout/base
resolution drift. The #203 failure exposed copy/test and candidate-tree drift,
not a reason to weaken the scientific or UI contract. The successful run #207
proved only that exact historical candidate snapshot, not any later head.

No experiment, GPU allocation, server cleanup, SSH operation, model call, budget,
seed, prompt, parser, gate threshold, or scientific artifact was changed in this
conversation. No exact-head Vercel deployment existed in the observed provider
window; therefore no Preview acceptance was claimed from an older deployment.

## 1. Timeline and classification

### 1.1 #187: real CSS contract failure

The first reported CSS-token failure had been described as fixed. The logs for
#187 instead stopped at audit:css with:

    OpenEvo7BStage2AnalysisMap.astro introduces !important outside the frozen
    compatibility-debt baseline
    .stage2-map__head>*{grid-column:auto!important}

This was a new declaration outside the frozen debt baseline. The correct repair
was selector/state ownership: replace the broad forced override with explicit
child selectors using ordinary declarations. The audit remained fail-closed.

Why it happened: the prior radius-token repair and the new !important violation
were different invariants. “The earlier CSS failure is fixed” was incorrectly
treated as “the next deterministic CSS failure must be stale.”

Pre-operation checks: read the first failing step and exact offending file;
inspect the frozen baseline and audit implementation; determine whether the new
declaration is intentional debt or an ownership error; run the audit on the
candidate after the smallest semantic repair.

Defensive rule: never add a CSS debt-baseline exception or remove an audit
assertion just because a previous CSS issue was fixed. Repair the narrowest
semantic owner. A new !important outside the baseline is a real regression until
evidence says otherwise.

Anti-example: adding the selector to css-important-debt-baseline.json makes CI
green but changes the architecture contract and hides future cascade debt.

### 1.2 #192: shallow checkout plus disabled credentials

After the CSS repair, #192 failed in Resolve test range before source validation.
The workflow used a shallow checkout and persist-credentials: false, then tried
to fetch the PR declared base SHA from origin. The fetch failed because the base
was not present locally and the remote had no usable credentials.

Why it happened: the workflow treated the event payload base SHA as the same
object as the base actually used to form a merge candidate. GitHub had
regenerated or moved PR refs while the run was queued; the checkout already
contained the candidate's parents, but the resolver ignored that local fact and
performed an unauthenticated network fallback.

Pre-operation checks: inspect checkout depth, credential persistence, event type,
candidate parents, and resolver inputs before changing source code. For a merge
candidate, verify HEAD^2 or the equivalent candidate parent is the tested base.
Decide explicitly between deriving locally and using an authenticated full-history
fetch.

Defensive rule: with persist-credentials: false, do not make an unauthenticated
base-fetch fallback part of the normal PR path. Resolve the tested base from the
candidate's actual parent; use full-history/authenticated fetch only when that is
the explicit design.

Anti-example: broadening token permissions or setting persist-credentials: true
merely to make a resolver fetch a stale SHA. That hides a ref/identity bug and
expands credential surface.

### 1.3 #200/#202: valid runs invalidated by moving head

Runs #200 and #202 reached useful phases and were then canceled because the
branch advanced. Their logs could not be reused as exact-head proof.

Why it happened: sequential Contents/API commits and concurrent branch activity
changed the tested tree during the long self-hosted workflow. A green step summary
was mistaken for a property of the branch rather than a property of one SHA.

Pre-operation checks: before starting or quoting a run, record PR head, base,
workflow run SHA, and whether the branch is still moving. Before merge, re-read
the live head and required status.

Defensive rule: every check belongs to the SHA it tested. A canceled run, an
older green head, or “the branch only changed docs” is not exact-head proof.
Batch coherent changes, minimize provider-triggering pushes, and require a fresh
terminal success for the final head.

Anti-example: citing #202 after a later documentation push because the
application files were “unchanged.”

### 1.4 #203: stale test assertion and candidate-tree confusion

#203 reached deterministic verification and failed because
openEvoExperimentResultLanguage.test.ts still asserted the older lobby phrase
“旧轨迹保留为历史证据，不冒充新版数据”, while the branch version of the lobby
had intentionally moved to more specific redesign/freeze language.

A one-off expectation update was prepared, but the branch later retained the
historical-boundary assertion. The final #207 candidate passed because its
synthetic merge tree resolved the relevant content with the current base side.
This is not a contradiction: a PR branch file, a merge candidate file, and
current main can differ after conflict resolution or concurrent movement.

Why it happened: the test encoded a literal phrase without first checking which
tree the CI job actually tested and whether the old phrase was still the stable
contract in that candidate. The initial temptation was to treat the test as stale
or the page as wrong, instead of comparing candidate/base/branch and deciding
which semantic assertion should own the boundary.

Pre-operation checks: inspect the exact candidate tree and changed-file patch;
compare branch and intended-base versions; identify the semantic contract
(historical evidence remains historical) separately from incidental wording; run
the focused test on the same tree/config as CI.

Defensive rule: tests should protect stable scientific/UI meaning, not an
accidental string snapshot. If wording really changes, update the assertion to
the new stable contract and preserve the boundary. If current base wins in the
merge candidate, do not claim the branch-only wording was validated. Never
delete the assertion or change research semantics just to obtain green.

Anti-example: remove the historical-label assertion, or rewrite the page to an
older sentence solely because the isolated branch test failed, without checking
the candidate tree and current product authority.

### 1.5 #207: terminal evidence, bounded to its SHA

Run #207 completed all workflow stages for the exact head/candidate pair in the
snapshot: setup, checkout, resolver, planner, dependency install, deterministic
verification, static production build, risk-based browser acceptance, and cleanup.
The logs reported 135 UI tests and 12 Lab-gate tests passing.

This was genuine evidence for that pair. It did not prove a later branch head, a
different base, an unobserved Preview, or Production. The Vercel query found no
deployment bound to the exact feature head in the observed window, so the correct
report kept Preview acceptance unclaimed.

## 2. Scientific and product/UI boundaries that must not move

The maps explain two distinct objects: active Stage 1 evolution and a historical
7B Stage 2 parameter-mechanism study. The historical map is not a newer active
result, and the older Stage 2 semantics must not be merged into Ceiling-1.0.
Task Vector remains diagnostic-only. Provider links (W&B/Kaggle) are evidence
locations, not scientific authority.

The engineering fixes therefore had these non-negotiable boundaries:

- CSS architecture debt was repaired at selector ownership; the audit was not
  weakened.
- Historical lineage labels, stale/unknown distinctions, and the active
  202609030400 boundary were preserved.
- A UI test was not removed merely because its wording collided with a copy
  refactor or merge resolution.
- No experiment was rerun and no new external teacher/analyzer call, budget,
  seed, model revision, prompt, parser, adaptive gate, or Task-Vector controller
  was introduced.

Looks reasonable, but wrong: “This is only a map/copy change, so changing a test
phrase or adding a CSS baseline exception cannot affect science.” In this
project, UI wording and audits are part of the publication contract: they can
silently turn historical evidence into current evidence or make architectural
debt invisible.

## 3. Stable rules, project rules, and temporary state

### A. Long-term stable rules

These generalize beyond PR #420:

1. Treat the user's summary, a PR description, branch name, old handoff, and
   filename as a search hint. Read live provider state and executable truth before
   acting.
2. Identify the exact object under test: isolated branch, synthetic merge
   candidate, current base, deployed artifact, or production artifact. Never
   interchange them.
3. Classify the first failure by owning layer before editing. Source, scientific
   contract, validator/test drift, checkout/bootstrap, runner/provider, and
   stale-head cancellation require different repairs.
4. Preserve fail-closed validators when the invariant remains valid. Repair the
   semantic owner or the validator's proven stale assumption; do not weaken a
   gate to make a badge green.
5. Require fresh evidence for the same exact head at the decision boundary.
   “Passed earlier” and “mergeable” are different assertions.
6. Treat repository/provider writes as shared state; batch coherent changes, verify
   returned SHAs, and avoid probe commits.
7. Keep memory retrieval, repository persistence, and actual memory mutation
   distinct. Never claim a long-term memory write without a memory-write result.
8. Keep volatile state—PIDs, GPU occupancy, temporary ports, current provider
   counters, current PR/branch/Preview IDs and transient paths—out of durable
   policy and long-term memory.

### B. Project-level rules

These belong to the BaseModel / SEED x OpenEvo workflow:

1. For a PR merge candidate, resolve the tested base from its actual second
   parent when the workflow has a shallow checkout and disabled persisted
   credentials; do not fetch a stale declared base unauthenticated.
2. For a deterministic failure, inspect the first failing step and actual
   candidate tree before touching CSS, copy, tests, scientific data, or CI
   configuration.
3. Compare branch, candidate, and current intended base when moving main or a
   conflict can change file ownership. A branch-only read is insufficient.
4. Keep the CSS important-debt baseline, scientific evidence boundary, historical
   labels, and browser/UI acceptance fail-closed.
5. Separate “CI successful for candidate” from “exact-head Preview accepted” and
   from “merged main contains the intended content.”
6. Use the current Agent owner documents for rules and this file only for the
   historical causal explanation.

### C. Temporary state deliberately not promoted

The following values are retained here only to reconstruct this incident:

- the initial f532562 report, intermediate heads 9b37df9, 66e5351, 5b0044a,
  70a97a4, 795ee07, and final snapshot head 14b0e142;
- base/candidate SHAs 1fe9b368 and 628e250;
- CI runs #187, #192, #200, #202, #203, #207 and job 100684614314;
- Vercel project/deployment query results from that moment;
- temporary branch names, connector output shapes, local working-directory
  state, any PIDs, GPU/process occupancy, ports, and transient timing.

Future Agents must re-read live GitHub/Vercel/experiment state. These values are
not current authority.

## 4. Repeat-offense analysis

### Repeated problem 1: stale state versus live state

This class was already documented in root AGENTS, the moving-main/exact-head
history, and the Phase-A authority-retention case. It still appeared because
the initial task started from a user-provided SHA and PR description, while the
PR and base moved during a long self-hosted run.

Why earlier documentation did not work: the generic rule existed, but it did not
name the additional identity layer of a synthetic merge candidate, and it did
not force a first-failing-step check before interpreting “CSS fixed” or “green.”

Third-occurrence prevention: the current principles now own candidate identity
and exact-head classification; the scenario registry triggers it when a PR check
mentions a merge ref, shallow checkout, disabled credentials, or a moved head.
This history remains linked as explanation, not as the only place the rule lives.

### Repeated problem 2: fail-closed gate tempted by a convenient exception

Earlier site and research work already taught that audits, evidence gates and
historical boundaries must not be weakened. #187 still made the old
!important baseline tempting because the reported earlier CSS issue was said to
be fixed.

Why it recurred: the prior lesson was broad (“do not weaken gates”) but did not
connect the cue “a different deterministic failure appears after a claimed fix”
to the CSS debt baseline.

Third-occurrence prevention: the deterministic PR trigger now routes to the first
failing step, owning layer, candidate tree, and semantic repair; this case
records the counterexample of adding a baseline exception.

### Repeated problem 3: stale literal UI tests

The repository already had stale-test lessons in result/publication cases.
#203 again created pressure to either edit the test mechanically or revert
reader-facing language.

Why it recurred: existing cases emphasized stale copy but not the
branch-versus-merge-candidate distinction. A literal assertion can be stale in
one tree and still be the correct boundary in another.

Third-occurrence prevention: the current rule now requires candidate/base/branch
comparison and stable semantic-contract identification before changing an
assertion. The final successful candidate retained the historical-boundary
contract.

### What was not repeated in this conversation

Fish/Bash parser failures, shared-server deletion/storage attribution, GPU
scheduling/Holder handoff, SSH/rsync, worktree dependency installation, and
browser/mobile visual failures are important existing project lessons, but they
were not exercised here. No new rule is inferred from their absence; their
current owners and historical cases remain authoritative.

## 5. Future-agent procedure

When a similar PR reports “an earlier CI failure was fixed”:

1. Refresh live PR metadata and write down head, base, event, workflow SHA, and
   merge-candidate identity.
2. Read the first failing job step and the exact log/file/line.
3. If the job checks a merge candidate, inspect its parents and candidate tree;
   compare against branch and current intended base.
4. Read the owning audit/test/policy and decide whether the invariant is still
   valid.
5. Classify the failure before editing: implementation/science/UI,
   validator/test drift, checkout/bootstrap/credential, runner/provider, or
   stale head.
6. Apply the smallest repair in the owning layer; do not add exceptions or
   delete tests for convenience.
7. Batch documentation or code changes into one coherent commit when possible;
   after each provider write, verify the target SHA.
8. Require a terminal successful check for the exact new head. Treat canceled or
   older runs as historical only.
9. If Preview is required, verify provider metadata binds to that same head and
   inspect the real route; CI success alone is not Preview acceptance.
10. Immediately before merge, re-read live head/base/status. After merge, read
    main back and report merge/Production evidence separately.

## 6. Evidence and authority table

| Assertion | Required proof |
| --- | --- |
| The reported failure is real | first failing step + exact candidate file/tree + invariant |
| The failure is validation drift | reproducible resolver/test mismatch without changing source semantics |
| The fix is safe | owning-layer patch + unchanged scientific/UI boundary + relevant Gate |
| CI passed | terminal success for the exact head/candidate |
| Preview passed | deployment metadata bound to that head + route/browser acceptance |
| Merge completed | expected-head merge result + main readback |
| A lesson is durable | current owner + trigger + indexed history |
| ChatGPT memory changed | actual memory-write capability result |

The future-proofing goal is not to memorize the incident's SHAs. It is to make
the next Agent identify the right tree, authority, invariant, and boundary before
it changes anything.
