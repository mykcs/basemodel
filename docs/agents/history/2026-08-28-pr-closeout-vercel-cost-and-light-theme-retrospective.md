# 2026-08-28 PR closeout, Vercel spend, and light-theme contract retrospective

Status: **historical case record**. This document preserves the engineering and reasoning lessons from the 2026-08-28 BaseModel conversation that closed the remaining pull requests, integrated the WebShop training-design work into the primary `/study/` route, changed first-visit theme behavior from operating-system-driven to site-owned light mode, repaired the stale browser-test contract exposed by that change, and verified the exact merged Production tree on Vercel.

This document does **not** override `docs/agents/current/*`, executable repository truth, current GitHub/Vercel state, or newer release policy. Future Agents must read the current owners first and use this file only as a reusable incident/reasoning case.

Related current owners:

- `docs/agents/current/branch-and-pr-conventions.md`
- `docs/agents/current/release-closeout-protocol.md`
- `docs/agents/current/multi-pr-semantic-integration-playbook.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/theme-contrast-contract.md`
- `docs/agents/current/ui-change-visual-acceptance-gate.md`

## Why this case matters

The user request sounded simple:

1. find any other unmerged PRs and finish them;
2. make the site default to the light theme instead of following the operating system.

In practice, the task touched five different ownership layers:

```text
GitHub PR inventory
-> semantic integration against moving main
-> Vercel spend / Preview eligibility
-> theme behavior ownership
-> executable browser-test contracts
-> Production acceptance
```

The most important lesson was that each layer can be individually “green” while the combined release is still not accepted.

A clean PR merge is not semantic integration. A READY Preview is not Production acceptance. A passing old test is not proof that the old behavior is still the desired product contract. And a site theme must have one explicit owner; the operating system should not silently own it when product policy says otherwise.

## 1. Start with a live PR inventory, not memory

At the beginning of the closeout, the live repository had exactly two open PRs:

- **#309** — the substantive WebShop training-design / responsibility-topology page work;
- **#315** — a historical Agent retrospective document.

The first useful move was not to start editing. It was to establish the complete live set and classify each PR by scope.

That classification immediately reduced risk:

- #315 was documentation-only and independent of the product surface;
- #309 contained the user-facing research-page changes and therefore required semantic integration and hosted acceptance.

Durable lesson:

> “Check all remaining PRs” means query live GitHub state, classify every open PR, and query again after all mutations. Do not rely on the list remembered from five minutes earlier.

The final closeout re-ran the PR search after all merges and confirmed **zero open PRs**.

## 2. Merge the independent, low-risk PR before spending integration effort

Because #315 was pure historical documentation and did not touch product/runtime files, it could be merged independently before the more expensive #309 acceptance path.

This was better than unnecessarily combining every open PR into one giant candidate because it:

- removed an unrelated branch from the release graph;
- preserved its history immediately;
- reduced the number of moving pieces in the substantive integration;
- did not require a Vercel Preview.

Durable lesson:

> Do not force unrelated PRs into one release head merely because they are open at the same time. Merge clearly independent documentation/history work separately when current policy allows it.

## 3. “No textual conflict” is weaker than “no semantic overwrite”

Before changing the theme or integrating #309, the work checked whether the relevant shared files on `main` and the PR branch were actually compatible.

Two checks mattered:

1. `AppLayout.astro` was compared between current `main` and #309 before changing theme behavior;
2. the files changed by the newer #314 work were compared against the files changed by #309.

The result was reassuring but had to be proven:

```text
AppLayout on main == AppLayout on #309 before the theme edit
#314 changed-file set ∩ #309 changed-file set == empty
```

That meant the new theme edit would not silently erase #314, and later integration of #309 would not overwrite #314 at the file level.

Durable lesson:

> Git mergeability only answers whether Git can produce a tree. It does not answer whether the resulting tree preserves the newest semantic owners.

When `main` moved, inspect overlap and ownership explicitly before calling the branch safe.

## 4. Route ownership mattered: the primary `/study/` page had to contain the actual training design

A product-level issue became clear during closeout: the important WebShop training-design material lived at `/study/design/`, while the primary scientific study route `/study/` was the route most readers would actually enter.

The final information architecture became:

```text
/research/seed-openevo/study/
    primary scientific study route
    includes the full Training Decision Lab

/research/seed-openevo/study/design/
    focused/shareable training-design route
    retained as a dedicated deep link
```

The study subnavigation now exposes:

```text
Experiment workflow
Training design
Run experiment
Research findings
```

This avoided two bad outcomes:

- hiding the main reasoning behind a secondary route that readers may never discover;
- deleting the focused route and breaking a useful shareable destination.

Durable lesson:

> When a secondary page contains the conceptual heart of a research journey, decide which route owns first-reader understanding. Duplication can be intentional when one route is the canonical journey and the other is a focused deep link.

## 5. A Preview push is a spend decision

The user explicitly cared about Vercel Build CPU / CI spend. That changed how writes were staged.

Instead of pushing six file edits one by one to a deployment-eligible branch, the work used Git object staging:

```text
create blobs
-> create tree
-> create commit
-> move branch ref once
```

Until the final ref update, no branch head moved and Vercel had nothing new to build.

This produced one coherent candidate head:

```text
d1df7a340fe316a5567e74d5414be4c6ac6accf8
```

The key principle was not the exact Git API technique. The principle was:

> Assemble the coherent candidate before moving a deployment-triggering ref.

For this repository, current branch/deployment policy is even stronger: ordinary docs branches are not Preview-eligible, and eligible Preview heads require the explicit spend token defined by current executable policy. Future Agents must follow the current branch/deployment rules rather than copying this historical mechanism mechanically.

### What not to do

Do not:

- push after each file edit “to see if Vercel wakes up”;
- create no-op commits as provider probes;
- add Preview-spend tokens to intermediate commits;
- repeatedly mutate a branch while a hosted acceptance run is already in flight.

Provider reads and GitHub reads are much cheaper than unnecessary rebuilds.

## 6. A green Preview on an old base is not enough when `main` moved

The first #309 Preview passed, but `main` had already advanced through other merges. Even with zero file-level overlap, Production would otherwise have become the first place where the exact combination

```text
new main
+
#309
```

was exercised.

That was rejected as an unnecessary release risk.

The fix was to construct a combined candidate tree using current `main` as the base and overlay only #309's changed files, yielding the final candidate head:

```text
b3b3a3e877a4e7c963b4759be18c7a6feed410bc
```

That exact combined head received hosted acceptance before merge.

Durable lesson:

> Preview acceptance belongs to an exact tree, not to “PR #309” as an abstract object.

If the intended base changes materially, validate the tree that would actually ship.

This is especially important when:

- shared policies changed;
- global CSS/theme/layout changed;
- tests or build scripts changed;
- research-state owners changed;
- generated/discovery surfaces changed.

Even when overlap is provably zero, explicitly state why the old evidence can or cannot be reused.

## 7. Theme ownership must be explicit: first visit is light, saved user choice wins

The requested product behavior was:

```text
no saved site theme
-> light

saved atlas-theme=dark
-> dark

saved atlas-theme=light
-> light
```

The operating system's `prefers-color-scheme` no longer owns the site's initial theme.

The Production bootstrap became conceptually:

```js
const storedTheme = localStorage.getItem('atlas-theme');
document.documentElement.dataset.theme =
  storedTheme === 'dark' ? 'dark' : 'light';
```

and if storage access fails:

```text
fallback -> light
```

This distinction is easy to miss:

```text
OS color preference
!= site theme preference
```

The operating system may still be relevant to CSS media queries, screenshots, or external browser UI. It does not become a stored user choice automatically.

Durable lesson:

> A product setting needs one ownership hierarchy. Here it is: explicit saved site choice first; otherwise product default light.

## 8. The first Production failure was a stale test contract, not a product regression

After #309 merged, Production caught a failure in an older browser test.

The old test encoded this assumption:

```text
OS prefers dark
-> site must initialize dark
```

But the new desired product contract was intentionally:

```text
OS prefers dark
+ no saved site preference
-> site initializes light
```

So the failure was not evidence that the implementation was wrong. It was evidence that the executable test contract still owned the old behavior.

This is the critical reasoning step:

> Do not change correct new product behavior merely to satisfy a stale test. First classify the red gate.

The failure class was **stale test/policy**, not product/runtime failure.

## 9. Dark-mode tests must model an explicit user choice

The repair in PR **#316** was intentionally tiny and test-only.

For tests that truly need a dark site theme, the correct setup is now:

```text
set localStorage['atlas-theme'] = 'dark'
-> load page
-> assert dark theme behavior
```

The test may still set the browser/OS `colorScheme` when it wants to exercise media queries, but that no longer owns the site's theme state.

This created three distinct test cases that future Agents should preserve:

### First visit

```text
no atlas-theme in localStorage
OS light or dark
-> site light
```

### Explicit dark user preference

```text
atlas-theme=dark
-> site dark
```

### Runtime toggle

```text
click theme toggle
-> DOM theme changes without reload
-> choice persists to localStorage
```

Durable lesson:

> Test fixtures should model the real state owner. If the user preference is stored in `localStorage`, a dark-theme test should set that preference explicitly instead of borrowing the operating-system setting as a proxy.

## 10. Keep the product change and stale-test repair causally separate

The main product change landed through #309. The stale test was then repaired in a separate, tiny #316.

That separation was useful because it made the evidence easy to reason about:

```text
#309
-> product behavior intentionally changes
-> Production exposes old test assumption

#316
-> test contract is aligned to explicit saved theme choice
-> product implementation remains unchanged
```

The final `main` SHA after #316 was:

```text
c4b73faf0e0de55b56d988413a9c5566574d36b1
```

Durable lesson:

> When a valid product change exposes a stale test, fix the stale owner without smuggling unrelated product changes into the repair.

## 11. Do not confuse build success, UI-gate success, and deployment READY

The final Production path had multiple acceptance layers.

The build first completed the static/site checks and built **437 pages**. Then the hosted UI gates ran.

The complete global Chromium suite finished:

```text
92 / 92 passed
```

The focused Lab visual suite then finished:

```text
12 / 12 passed
```

Only after those gates completed did the deployment become READY.

The sequence matters:

```text
verify/build success
!= global browser gate complete
!= focused browser gate complete
!= Production READY
```

Durable lesson:

> Read the actual gate logs and wait for terminal provider state. Do not report “done” because an earlier phase printed `Complete!`.

## 12. While a long Production gate is running, observation is safer than mutation

The global Chromium suite took several minutes. During that time, the correct action was to monitor progress rather than push speculative fixes.

Repeated provider log reads do not create a new build. Moving the Git ref does.

This distinction matters for both safety and cost:

```text
read deployment/log state
-> observation

push new commit / move eligible ref
-> possible new hosted build
```

Durable lesson:

> Once a coherent candidate is running its acceptance suite, freeze the candidate unless a real blocker is observed.

Do not create new work merely because the gate has not finished yet.

## 13. Vercel protection can limit manual hosted inspection; do not overclaim what was checked

At one point the protected Preview could not be treated like a normal unauthenticated webpage by the available fetch path.

The correct reporting boundary was:

- exact-head static/build/browser gates had passed;
- the protected Preview had not been manually “clicked through” via that unavailable path;
- therefore do not claim a manual hosted interaction that did not occur.

After Production became READY, the stable canonical URL was fetched through the Vercel connector and returned HTTP 200.

That fetch directly confirmed the shipped HTML contained both:

1. the light-default bootstrap;
2. the Training Decision Lab on the primary `/study/` route.

Both Chinese and English stable routes were checked.

Durable lesson:

> Acceptance reports must say exactly which surface was observed: source, build output, automated browser, protected Preview fetch, or stable Production fetch. Do not collapse them into “I checked the page.”

## 14. Production HTML is useful final evidence for bootstrap behavior

The stable Chinese page returned a script equivalent to:

```js
try {
  const storedTheme = localStorage.getItem('atlas-theme');
  document.documentElement.dataset.theme =
    storedTheme === 'dark' ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme = 'light';
}
```

The same stable response also contained:

```text
OpenEvo × WebShop scientific study subnavigation
Training Decision Lab
responsibility topology
experiment tracks
parameter protocol
decision history
teacher roles
MiniMax thinking ON/OFF qualification
fairness ledger
final decision tree
```

This was valuable because it verified the real stable artifact rather than only the repository source.

Durable lesson:

> For changes that affect bootstrap HTML, metadata, canonical route content, or no-JS behavior, a final stable-URL response can prove that the intended output actually shipped.

## 15. Final-state queries are part of completion, not an optional courtesy

The user had asked to “check any other unmerged PRs too.” It would have been incomplete to report success after merging only the PRs known at the beginning.

The final step re-ran the live open-PR query and received an empty result.

This pattern generalizes:

```text
initial inventory
-> mutations
-> release acceptance
-> final inventory
```

Durable lesson:

> If the task is expressed as an exhaustive state goal (“all PRs”, “all warnings”, “no remaining blockers”), completion requires a final live query proving the set is empty or explicitly enumerating what remains.

## 16. The useful mental model for multi-PR closeout under provider cost pressure

The reusable sequence from this case is:

```text
1. Query live open PRs.
2. Classify each PR by scope and dependency.
3. Merge truly independent low-risk work first.
4. Re-read current main and semantic owners.
5. Check file overlap and behavioral overlap explicitly.
6. Assemble one coherent candidate before moving a deployment-triggering ref.
7. Spend one Preview on the candidate that actually needs hosted acceptance.
8. If main moved, build/validate the final combined tree, not the historical branch tree.
9. Race-check head/base/mergeability immediately before merge.
10. Merge the accepted head.
11. Treat Production as a separate acceptance boundary.
12. If a red gate appears, classify product vs contract vs harness vs environment vs stale test before editing.
13. Verify the stable changed route(s) and bootstrap/metadata when applicable.
14. Re-query the exhaustive live state, such as open PRs.
15. Stop. Do not create extra commits after acceptance merely to make the history look cleaner.
```

## 17. Failure classes observed in this conversation

### A. Information-architecture friction

Symptom:

> The important training design existed, but not on the primary page a reader naturally entered.

Repair:

> Make `/study/` own the full training-design explanation while keeping `/study/design/` as a focused route.

### B. Moving-base friction

Symptom:

> A branch Preview was green, but `main` had advanced.

Repair:

> Construct and validate the current-main + PR combined tree before merge.

### C. Provider-cost friction

Symptom:

> Every intermediate ref movement could trigger Vercel work.

Repair:

> Batch the coherent change before the spend-triggering ref update; use non-Preview docs branches for documentation-only work under current policy.

### D. Theme-ownership friction

Symptom:

> OS dark preference was silently treated as a site theme choice.

Repair:

> First visit defaults light; explicit saved site preference owns future visits.

### E. Test-contract friction

Symptom:

> Product behavior was correct under the new requirement, but a browser test still asserted the old OS-owned behavior.

Repair:

> Update the stale test to model explicit `localStorage` theme state instead of weakening the product change.

### F. Acceptance-language friction

Symptom:

> It was tempting to say “checked” or “done” before the full hosted gate and stable route verification completed.

Repair:

> Name exact evidence: exact-head Preview, browser test count, Production SHA, READY state, HTTP 200 stable route, final open-PR query.

## 18. Anti-patterns to avoid next time

Do not:

- assume the open-PR list stayed unchanged after merges;
- merge every open PR into one giant release candidate without classifying independence;
- treat `mergeable=true` as semantic compatibility;
- accept a Preview tied to an obsolete base as proof of the final combined Production tree;
- push each file edit separately to a deployment-eligible branch;
- create no-op commits to probe Vercel;
- let OS `prefers-color-scheme` impersonate a stored user theme preference;
- change correct product behavior merely to satisfy an obsolete test;
- weaken visual thresholds when the real issue is a stale fixture or harness assumption;
- call a conditional gate PASS when it only skipped;
- call a deployment READY before its required browser gates finish;
- claim manual hosted inspection when only automated/source evidence exists;
- stop after merging without re-querying the exhaustive state requested by the user.

## 19. What should remain current versus historical

The following are durable current behaviors and belong in current owners/executable tests:

- first visit defaults to light;
- saved explicit site theme overrides the default;
- dark-mode tests model explicit saved dark preference;
- exact-head / final-combined-tree release acceptance;
- Production is a separate acceptance boundary;
- Preview/build spend is deliberate rather than probe-driven.

The following belong in this historical file:

- PR numbers #309, #315, #316;
- exact SHAs from this release;
- the fact that the first Production attempt exposed the stale OS-dark test;
- the specific 92/92 and 12/12 gate counts;
- the exact sequence in which this conversation discovered the lessons.

Future Agents should not infer that these dated PRs or SHAs remain current repository state.

## 20. Final closeout snapshot for this case

Historical end state of this conversation:

```text
#315
-> merged independently as historical documentation

#309
-> final training-design / responsibility-topology integration
-> primary /study route includes the Training Decision Lab
-> /study/design remains available as a focused route
-> default site theme changed to light when no saved choice exists
-> merged to main

first Production after #309
-> intentionally new theme behavior exposed an obsolete OS-dark test assumption

#316
-> test-only repair
-> dark checks now model explicit saved user preference
-> product behavior unchanged
-> merged

final main
-> c4b73faf0e0de55b56d988413a9c5566574d36b1
-> 437 pages built
-> 92/92 global Chromium tests passed
-> 12/12 focused Lab browser tests passed
-> Production READY
-> stable Chinese and English /study routes returned HTTP 200
-> stable HTML contained the light-default bootstrap and Training Decision Lab
-> final open-PR query returned zero PRs
```

The lasting lesson is not the SHA. It is the release discipline:

> **Treat live repository state, semantic ownership, provider spend, user-setting ownership, executable tests, and Production evidence as separate layers. Integrate them deliberately, and only declare completion when the exact final tree has crossed every required boundary.**
