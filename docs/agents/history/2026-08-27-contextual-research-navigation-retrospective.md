# 2026-08-27 contextual research navigation retrospective

Status: **history / reusable implementation case**  
Scope: splitting the SEED × OpenEvo research subnavigation to match the two primary journeys already present in the site header.

## What the user was actually asking for

The visible problem looked like “two navigation bars are independent.” The underlying problem was information architecture:

- the header already presented two primary journeys: `01 流程理解图` and `02 OpenEvo × WebShop 科学研究`;
- the lower research navigation ignored that distinction and flattened concept-learning pages, experiment pages, and Results into one long row;
- therefore the lower bar behaved like a second global navigation instead of a child navigation.

The desired ownership was:

```text
01 流程理解图
└─ 流程总览 · 模型 · SEED · OpenEvo · 环境总览 · WebShop · ALFWorld · 更新机制

02 OpenEvo × WebShop 科学研究
└─ 实验流程 · 运行实验 · 研究结果
```

The successful fix changed ownership, not merely spacing or CSS.

## Friction encountered

### 1. The screenshot described a structural problem, not a styling problem

A superficial response could have restyled or hidden links. That would have left the same information model in place.

The useful move was to inspect both `src/components/Header.astro` and `src/components/research/SeedOpenEvoResearchNav.astro`. `Header.astro` already contained the authoritative two-journey model and active-route logic, while the shared research nav still contained one flat `pages` array.

Reusable lesson: when two visible navigation layers feel redundant, first identify which layer owns primary navigation and which should be contextual child navigation. Do this before touching CSS.

### 2. The first implementation accidentally violated an existing wording contract

The first split used `实验结果 / Experiment results` in the study child nav. That sounded locally symmetrical with `实验流程`, but the repository already protects `研究结果 / Research findings` as the public Results terminology.

Vercel failed during `verify:deploy` because `src/lib/seedOpenEvoReaderVoiceProtection.test.ts` explicitly requires `研究结果 / Research findings` and rejects `实验结果 / Experiment results`.

Reusable lesson: navigation labels are semantic API, not decoration. Before renaming a public label, search source tests and reader contracts. A layout improvement is not allowed to silently weaken publication semantics.

### 3. Sequential direct-to-main edits caused avoidable production builds

The navigation change and follow-up test/wording corrections were written as several sequential commits to `main`. Because `main` is deployment-eligible, each write created another production build. Two intermediate deployments failed before the corrected head eventually passed.

This created exactly the kind of avoidable build work the repository's Vercel-cost effort is trying to reduce.

Reusable lesson: shared GitHub state is not a scratchpad. For implementation work, use one coherent branch, run the relevant source tests before merge, and ship one accepted head. For documentation-only retrospectives like this file, use a `docs/**` branch so the current `vercel.json` policy can skip a pointless Preview build.

### 4. The provider stayed in BUILDING for several minutes because browser acceptance is intentionally large

The successful production build ran the overflow preflight, then 91 Playwright UI tests, then the lab browser gate. Early `BUILDING` status was not evidence of failure.

Reusable lesson: use Vercel logs diagnostically. On a failure, request error-only logs first. On a long healthy build, inspect the tail to confirm forward progress instead of restarting or creating another commit.

### 5. Main moved concurrently during the broader session

After the navigation release, another repository change moved `main`. Any later documentation commit based on an old tree/parent SHA would therefore be stale.

Reusable lesson: refetch the current `main` commit and tree immediately before creating a Git-data commit or opening a PR. Do not reuse a head SHA captured earlier in a long conversation.

## What worked well

### 1. Reused the existing primary-journey model instead of inventing a new one

`Header.astro` already encoded the two top-level journeys and their active-route boundaries. The lower navigation was changed to reflect that same mental model.

This avoided a third taxonomy and kept the page structure understandable:

- concept/method/environment understanding belongs to the Flow map journey;
- experiment execution and findings belong to the scientific-study journey.

### 2. Kept one shared child-navigation owner

The fix stayed inside `SeedOpenEvoResearchNav.astro` instead of copying different nav arrays into individual pages.

The component now resolves one of two explicit child sets from the semantic page ID. This preserves one implementation owner while still making the navigation contextual.

### 3. Preserved all canonical routes

No URLs were renamed or redirected. `SEED`, `OpenEvo`, `WebShop`, `ALFWorld`, experiment, run guide, and Results kept their existing routes.

That made the change low-risk for links, search, citations, and existing documentation. The problem was presentation/ownership, not route identity.

### 4. Added a machine-readable track boundary

The rendered navigation exposes `data-research-track="flow"` or `data-research-track="study"`.

That small hook makes it cheap to verify the information architecture in source tests, browser tests, or production HTML without relying on visual inference.

### 5. Updated tests to protect the new architecture rather than deleting protection

The old navigation test expected one global ordered list. It was rewritten to assert the contextual split and the route-to-track relationship.

The separate reader-voice test was left semantically authoritative for `研究结果 / Research findings`.

Reusable lesson: when an architecture intentionally changes, update the test to protect the new invariant; when an unrelated semantic test fails, fix the implementation rather than weakening the test.

### 6. Verified both sides on the final production head

The final Vercel deployment reached `READY` and the canonical production domain returned `200` for representative routes.

Structural verification confirmed:

- WebShop rendered `data-research-track="flow"` and the Flow child links, with WebShop active;
- experiment rendered `data-research-track="study"` and only `实验流程 · 运行实验 · 研究结果`, with experiment active.

This is stronger than checking only the source diff because it verifies the deployed artifact. It is still a structural check: if the task changes pixel layout, spacing, wrapping, or responsive geometry, use browser/visual acceptance as well.

## Reusable playbook for future navigation restructuring

1. Translate the user's screenshot complaint into a route-ownership statement before editing.
2. Inspect the global header, the shared local-nav component, route-active logic, and navigation-related tests together.
3. Write down the intended parent → child map explicitly.
4. Keep URLs stable unless the user actually asked for route migration.
5. Implement contextual membership in the shared nav owner; add a machine-readable track/state hook.
6. Search for semantic wording contracts before renaming labels.
7. Update architecture tests and semantic tests according to their separate responsibilities.
8. Use one coherent branch/head; do not probe by pushing several commits to production.
9. Let the provider finish its gates; diagnose with logs instead of guessing from `BUILDING`.
10. Verify at least one representative route from every track on the final deployed head.

## Stopping rule

The task is complete when the two primary journeys have distinct child navigation, active-state behavior is correct, cross-track links do not leak into the local row, the public wording contract remains intact, tests pass, and the final deployed artifact reflects the same structure.

Do not keep polishing navigation labels or moving routes once those invariants are satisfied unless there is a separate reader problem to solve.
