# BaseModel CI latency optimization — 2026-09-15

Status: **implementation + benchmark qualification complete; release closeout in progress**
Owner goal: make multi-Agent BaseModel iteration visibly faster without moving ordinary CI onto the owner's MacBook and without weakening exact-head release acceptance.

## Correction-to-action witness

`trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue`

- repeated concern: the MacBook already carries Remote Desktop / browser / Agent / OpenEVO control-plane load -> current owner: BaseModel CI architecture -> checked: `AGENTS.md`, current provider/hosting/deployment policy, live protected `main`, current public GHA workflow, dedicated review Vercel project -> allowed: optimize public GHA scheduling and cloud review Preview; Mac remains optional accelerator only -> invalidate if live CI authority/provider state changes.
- repeated concern: several Agents mutate this repository concurrently -> current owner: live GitHub state -> checked: `main@f0795e51569c750cbd28b5e6b75664218d519859`, no overlapping open CI-performance PR -> allowed: isolated worktree + one PR -> invalidate on remote-main/head/overlap drift before every write/merge boundary.
- repeated concern: faster must not mean weaker -> current owner: shared `vercel-ui-plan.ts` + canonical `npm run test:ui` -> checked: current workflow and tests -> allowed: change scheduling/executor topology only; preserve exact test identities, retries=0, one worker per browser runner, fail-closed unknown risk -> invalidate if test selection/acceptance semantics change.

## Frozen starting evidence

- base: `main@f0795e51569c750cbd28b5e6b75664218d519859`;
- required merge status remains `Vercel` (App 8329); no authority switch is part of this optimization;
- current public full qualification: run `34261768688`, 4 browser runners, accepted 204-test population at that historical head, slowest browser step `191 s`, representative prior Vercel full-browser tail about `402 s`;
- current-main canonical browser population discovered before provider mutation: **197 tests in 28 files**;
- current timing receipt is stale: it declares 163 tests, and only 80 of current 197 identities match the accepted historical GHA timing log exactly.

## Treatment A — dynamic browser runner allocation

Keep the deterministic PR gate automatic. Add a dependency-free planning job that reuses the same fail-closed UI planner before browser runners start:

```text
skip    -> 0 browser runners
focused -> 1 browser runner
full    -> N independent browser runners
```

The browser job must re-evaluate the plan and fail before npm/browser spend if its mode differs from the planning job. CI/planner/workflow changes remain full-risk owners.

Acceptance:
- docs/non-UI live canary proves browser job is skipped entirely;
- bounded route-owner live canary proves exactly one browser runner executes;
- full-risk work proves exact canonical coverage with every selected test passing once, retries=0.

## Treatment B — fresh timing + 4/6/8 full-matrix benchmark

Frozen executor contract: GitHub-hosted `ubuntu-24.04`, digest-pinned Playwright 1.62.1 Noble container, Node 24, one Playwright worker per shard, retries=0, unchanged canonical `npm run test:ui` identities and assertions.

Primary metric: **maximum browser acceptance-step wall time**. Also record complete browser-job wall time, workflow wall time, queue and runner count separately. A discovered list is not execution evidence.
Benchmark sequence is sequential on fresh exact heads: first obtain a fresh current-suite timing receipt from the 4-shard implementation qualification, then run 4, 6, and 8 shard candidates against the same product/test tree with only the full-shard scheduler value changing.

Selection rule: every candidate must be green with exact canonical coverage and no retries. Choose the **smallest shard count whose primary wall time is within 10% of the fastest qualified candidate**; this preserves multi-Agent runner concurrency unless extra shards buy a material latency win. Any candidate that changes test scope or needs retries is disqualified, not “faster.”

## Treatment C — cloud Fast Review Preview

Move review-only build compute off the MacBook. Add a manual GitHub-hosted workflow with a strict trust split:

```text
build job (PR code executes, contents:read, NO Vercel secret)
  -> exact PR head
  -> npm ci + fresh noindex Astro build
  -> package static Build Output artifact

deploy job (artifact only; candidate code does NOT execute)
  -> download artifact
  -> dedicated non-Git-connected Vercel review project
  -> Preview only, never Production
```

The deploy token lives only in a GitHub Actions secret. Opaque project/team identifiers live only in repository Actions variables. No token, project ID, team ID, bypass/share URL, or temporary `_vercel_share` value may be committed or written into PR/Issue prose.

Acceptance: one real workflow dispatch must build an exact PR head on GitHub-hosted compute, deploy the prebuilt artifact to the dedicated review project, reach Vercel `READY`, preserve `noindex`, and leave `ci/vercel-gate-final`, Production, and required-status authority untouched.

## Qualification result — 2026-09-15

Fresh current-suite timing evidence covers **197/197** canonical Chromium identities with zero missing or duplicate identities and retries=0. The full-matrix benchmark held the executor, image, test population, assertions, worker count, and timing scheduler fixed; only the configured shard total changed.

| shards | exact head | workflow run | max browser step | max browser job | workflow wall | coverage |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 4 | `66ddf8b8d6dd3d7453796f333a4c6da60f3bd813` | `34986898313` | 138 s | 190 s | 209 s | 197/197 |
| 6 | `88ad6b4eba11043f3e451ed79b0278531a96ac19` | `34987545968` | 102 s | 141 s | 159 s | 197/197 |
| 8 | `9f5ccc18ba0bb685fd12be55fd05a6eb6280dbcf` | `34988052276` | **80 s** | **119 s** | **139 s** | 197/197 |

Selection rule result: **8 shards wins**. Six shards is not within 10% of the fastest 80 s result (threshold 88 s), so there is no smaller qualifying configuration. Relative to the earlier ~191 s public-GHA browser tail, the selected full path reduces the browser critical path by about **58%**.

Treatment A is also qualified inside these runs: the dependency-free planner runs before browser allocation, browser jobs independently re-evaluate the plan, and full CI stayed green under the new topology. Post-merge canaries still verify real skip=0 and focused=1 allocation on ordinary PRs.
