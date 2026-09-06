# Reader-journey repair experience retention

Date: **2026-09-07**
Status: **historical experience/causal record; not current runtime or scientific authority**
Parent implementation/release ledger: [`2026-09-06-reader-journey-repair.md`](2026-09-06-reader-journey-repair.md)

This file records the reusable lessons from the end-to-end reader-journey repair conversation. It intentionally does **not** restate the page implementation, PR/Preview/Production checklist, or current experiment state; those remain in the parent ledger and current owners. The purpose here is to explain why apparently reasonable approaches failed and what a future Agent must do differently.

## 1. Retention classification

### A — durable cross-task rules

1. **Current authority reads are ref-qualified.** A file in a local checkout is evidence about that checkout only. Before treating it as current `main`/branch truth, record `HEAD`, branch, dirty state, and intended remote/ref SHA; use `git show <ref>:path` or connector fetch at an exact ref.
2. **Durable artifacts outrank conversational status prose.** After tool timeouts, reconnects, or contradictory assistant messages, reconstruct state from branch/PR/CI/provider/test/research receipts before declaring blocked or done.
3. **One failed tool path is not capability absence.** Tool discovery/listing is not execution; a Git HTTPS/HTTP2 timeout is not automatically an auth failure; a missing stream is not automatically command failure. Try another safe owner-appropriate path before escalating.
4. **Repeated comprehension failure is a systems problem.** If prose standards/examples already exist but the same misunderstanding returns, repair semantic ownership and enforcement: typed content/state contracts, sibling-route coverage, negative tests, normal-Gate registration, and real browser acceptance.
5. **Structural PASS is not comprehension PASS.** Contrast/overflow/visibility/no-JS checks prove renderability; rendered reader-journey assertions prove visible semantic prerequisites; only real target readers can supply measured human-comprehension evidence.
6. **Scientific lifecycle states are distinct receipts.** Registered/locked, authorized, running, completed, and sealed/publishable are different. Website code/deployment cannot advance scientific authority.
7. **Non-identifiable is not zero effect.** If the causal contrast cannot be formed, preserve that failure as non-identifiable; do not rewrite it as a measured null.
8. **Release evidence belongs to an exact tree.** If `main` moves, classify overlap, build the final combined tree, rerun affected acceptance, lock merge to the accepted head, then verify Production separately.

### B — BaseModel / OpenEvo project-scoped lessons

- The capability-exploration family needs one explicit reader role/coverage inventory rather than assuming the named page is the whole scope. In the implemented repair, the gateway and Mechanism-1.0 were rebuilt while sibling routes were contextualized; those labels are part of honest scope, not generic product doctrine.
- Mechanism-1.0 is not a four-step A→B→C→D pipeline. M1-A and M1-B test distinct causal questions; M1-C is conditional on a preregistered signal plus separate authority; M1-D is an independent initialization reference. Future diagrams must preserve that dependency topology.
- The original M1-A predecessor became non-identifiable because its required late anchors resolved to the same model state. The successor repairs anchor selection; it does not rewrite the predecessor as a zero-effect experiment.
- M1-D execution authority and M1-D sealed results are different publication states. A public “activated” label must not fabricate running/completion/result evidence.
- The concrete executable reader owners created by the repair are recorded in the current human-thinking contract; future capability-exploration routes must enter the maintained route inventory and normal regression Gate.

### C — transient state deliberately not promoted

The implementation PR numbers, commit SHAs, Vercel deployment IDs, CircleCI job IDs, local PIDs, temporary worktree paths, exact test counts/durations, and momentary provider status are historical reconstruction evidence only. They may remain in the parent closeout, but they are **not** current rules and must not be copied into `LATEST.md`, current policy, or long-term memory as if still live. No GPU/server allocation or occupancy from this conversation was promoted.

## 2. Friction matrix: what happened, why, and the defensive rule

| Friction | What happened | Wrong assumption / missing context | Pre-action check next time | Defensive rule | Reasonable-looking anti-example |
|---|---|---|---|---|---|
| Repeated “make it simpler” fixes did not hold | Earlier attempts had standards and examples, yet first-time readers still lacked start/stop/dependency context | Writing guidance was treated as enforcement; reader was implicitly assumed to know agents/project vocabulary | Inspect semantic owner, rendered route family, tests that actually run, and whether required lifecycle fields exist in data | Convert recurring reader invariants into shared typed data + rendered components + negative tests + route inventory | Add another “write clearly” Markdown and edit only the named paragraph |
| Flat experiment cards changed scientific meaning | A/B/C/D could look like one sequential flow | Visual equal weight was mistaken for causal/dependency equivalence | Resolve upstream design/authority before drawing topology | Diagram evidence dependencies, conditions, and independent references explicitly | Make four equally styled numbered cards because it is visually tidy |
| M1-A predecessor looked like a null result | Identical accepted states yielded no identifiable direction | Zero vector was conflated with measured zero causal effect | Check state identity and whether the contrast exists before interpreting reward | Non-identifiable/blocked is a separate state from valid negative result | Write “task-vector effect = 0” because the computed vector norm is zero |
| Authorization looked like execution/result | M1-D had an execution release but no sealed result | One status label was used as the whole lifecycle | Require release, actual start/end, and result receipt separately | Reject impossible lifecycle combinations in schema/tests | “Activated” → show progress/result placeholder as if run began |
| Structural tests were treated as understanding tests | Visibility/overflow/contrast could all pass while the argument remained confusing | Browser geometry was used as a proxy for reader mental model | Run both semantic answer-location checks and visual tests; label evidence layer | Structural/visual, reader-journey semantic, and human comprehension acceptance are three layers | `toBeVisible()` on a paragraph containing the right words |
| Stale tests failed after intentional rewrite | Old assertions still expected retired wording/global status | Test text was treated as product authority | Ask whether the invariant is still valid and compare against current semantic owner | Fix stale tests when current truth proves the assertion obsolete; do not weaken valid gates | Restore old copy just to make a snapshot green |
| `innerText` vs `textContent` caused a false failure | A strict before/after state check differed only in whitespace semantics | DOM serialization equivalence was mistaken for visible-text equivalence | Use one reader-facing text API on both sides | Test the user-visible invariant, not incidental DOM whitespace | Loosen the assertion to “contains some text” instead of fixing the measurement |
| Reduced-motion assertion expected literal `0s` | Global `.01ms !important` produced a tiny serialized duration | CSS duration string was used as proxy for “no meaningful motion” | Inspect transition property/active animations and owner CSS | Assert behavior (`transition-property: none`, no active animations) rather than one serialization | Add another `!important` override solely to force `0s` |
| Main moved after expensive acceptance | A concurrent PR added independent pages after the first qualification | Earlier exact-head evidence was assumed timeless | Refresh current main, compare intervening files/owners/provider policy | Preserve old evidence only in its scope; validate the final combined tree before merge | Merge a behind branch because its old Preview was green |
| Preview/Production/provider state was over-collapsed | READY could be mistaken for product acceptance | Provider completion, route correctness, merge, and Production identity were conflated | Record head/base/deployment SHA and inspect real route | Keep source, CI, Preview, merge, Production as separate gates | “Vercel READY, therefore website task complete” |
| Assistant said work could not continue even though artifacts existed | A later status answer ignored already-created branch/tests/Preview and downgraded a tool-path problem to task impossibility | Conversation narration was trusted instead of durable artifacts | Re-read worktree/branch/PR/CI/Vercel state before status claims | Reconstruct state from durable artifacts; correct the narrative and continue | Generate a standalone prototype because repository work is assumed unavailable without checking |
| Local working tree was mistaken for current authority during this retention pass | Directly reading the primary checkout exposed older policy text because that checkout was on another branch | Path existence/current-looking filename was mistaken for current `main` | `git status --branch`, `HEAD`, target ref SHA; use `git show <ref>:path` | Ref-qualify authority reads | `cat docs/agents/current/foo.md` from whichever checkout is easiest |
| Local Git transport failed while GitHub connector worked | HTTPS/HTTP2/443 fetch/push attempts timed out or errored, but repository API state remained writable | Network transport error was mistaken for repository permission/capability failure | Separate auth, transport, and repository state; try read via connector | Do not change credentials/remotes because one transport path failed | Rotate tokens/SSH keys immediately after a transient HTTP2 error |
| Tool discovery consumed time without completing actions | Repeated schema/tool listing occurred before the actual repo/provider operation | “I found a tool” was mentally counted as progress | After discovery, immediately invoke the owner action and verify its result | Discovery is not execution; every status claim needs an action/artifact | Repeatedly list tools and then report “not available” without invoking the discovered capability |
| Provider polling risked becoming busy-wait | CI/Preview were pending for minutes during closeout | Synchronous attention was conflated with useful work | Record exact identity, do independent work, then bounded recheck | Follow provider-wait discipline unless owner explicitly asks to wait synchronously | `sleep 30; poll` loops while no action is possible |

## 3. Scientific/engineering reasoning corrections

### 3.1 “Clearer page” and “scientifically faithful page” are one coupled problem

The page could not be simplified safely by deleting details at random. The repair had to preserve the upstream experiment semantics while changing the reader path. The useful pattern is:

```text
upstream scientific authority
-> stable semantic objects / lifecycle states
-> reader-first main path
-> local evidence depth
-> executable negative + browser acceptance
```

This prevents two symmetric failures: an accurate evidence wall that nobody can understand, and a friendly explanation that silently changes scientific meaning.

### 3.2 Engineering convenience must not create scientific state

A UI status chip, a static timestamp, a deployment event, a provider green badge, or a convenient test fixture cannot create experiment authorization, running state, completion, identifiability, or a result. When the science does not provide a state/time/result, the page must say unknown/unsealed/locked rather than infer it for design completeness.

### 3.3 Negative evidence needs the right ontology

At least four states that looked similar in a dashboard are scientifically different:

- `not run / locked`;
- `authorized but no execution receipt`;
- `not identifiable`;
- `valid executed negative/null result`.

A future Agent must name the correct one before writing copy, a chart, a badge, or a test.

## 4. Why previous retrospectives did not prevent repetition

Several failures were not new. Earlier repository history already discussed reader-first copy, moving-main release identity, stale tests, Fish/Bash boundaries, worktree isolation, and provider-vs-product acceptance. They still resurfaced for four reasons:

1. **Rules were discoverable only after the failure.** A detailed history file is weak protection if the task router does not trigger it at the moment of action.
2. **Some rules were prose-only.** “Write for the reader” did not force every experiment to have start/stop/output fields or every sibling route to declare coverage.
3. **The evidence proxy was too weak.** Visibility/overflow/keyword assertions protected pixels/strings, not the reader's causal model.
4. **Status was reconstructed from narrative memory.** Long tool sequences made the last assistant sentence feel authoritative even when PR/provider artifacts contradicted it.

This retention pass therefore changes the information level instead of merely adding another retrospective:

- root `AGENTS.md` gets the ref-qualified-read and durable-status reconstruction guards;
- `project-agent-operating-principles.md` gets durable state reconstruction and A/B/C retention classes;
- `human-thinking-web-expression-contract.md` gets the three-layer acceptance model and repeated-failure escalation path;
- `scientific-state-provenance.md` gets the lifecycle/identifiability state ontology;
- `scenario-trigger-registry.md` makes repeated readability failure and retrospective reconstruction trigger these owners automatically;
- this file keeps incident-specific causal detail as history.

## 5. Long-term-memory extraction boundary

Memory-eligible candidates from this conversation are the durable user/workflow preferences: reader-first Chinese technical explanation for people with no agent/project context; solve root causes rather than layering patches; when a repeated failure already has prose standards, add executable ownership/tests; distinguish engineering completion from real human comprehension; and continue autonomously across safe tool paths until a real boundary remains.

No long-term-memory mutation is claimed here. Repository commits are project knowledge, not ChatGPT account memory. A future Agent performing a memory write must first verify that the current runtime exposes an actual memory-write capability; search, personal-context retrieval, repository commits, and conversation summaries are not substitutes.

## 6. Temporary information intentionally excluded from durable memory/current policy

Do not retain as timeless facts: current PIDs; current GPU usage/allocation; current rounds/percentages; temporary worktree paths; a PR's momentary mergeability; CircleCI queue state; Vercel BUILDING/READY at a past instant; one-off test durations; transient HTTPS failure text; temporary share URLs.

When these details matter for historical truth, keep them only in the bounded parent release/incident ledger with exact timestamps/identities.

## 7. Future Agent preflight for this problem class

Before touching a page after a complaint like “people still cannot understand it”:

1. prove the target ref/working tree you are reading;
2. read root/current reader + scientific provenance owners and the scenario trigger;
3. fetch the exact upstream scientific authority;
4. write the target reader questions before rewriting prose;
5. inventory sibling routes and the shared semantic owner;
6. model start/action/stop/output/evidence state explicitly;
7. preserve planned / locked / authorized / running / completed / sealed / non-identifiable / negative states separately;
8. implement the main path with semantic HTML, then optional interaction;
9. add negative-state tests plus rendered route coverage to the normal Gate;
10. run structural/visual and reader-journey acceptance; label real-human testing separately;
11. refresh main/PR/provider identities immediately before merge;
12. verify Production independently;
13. deposit only the new reusable delta, not every transient detail.
