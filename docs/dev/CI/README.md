# CI builds, routing and measured performance

BaseModel's CI optimization shipped in [#814](https://github.com/mykcs/basemodel/pull/814). A full ordinary high-risk candidate now builds the site twice in GitHub instead of seventeen times and reaches the combined browser-workflow terminal state sooner in the measured sample. **The sampled aggregate Runner time did not decrease.** The current merge/deployment authority remains [hosting architecture](../../agents/current/hosting-architecture.md); this record owns implementation qualification, measurements and rollback.

Qualification status: #814 and #958 are merged. The typography consumer correction in #962 passed its previous-base full matrix, then absorbed `main@1ed126c`; exact current-base head `eb5d7cc272416d29a751126cf2d8cd12b4b6ccfc` is still under hosted qualification. This documentation PR depends on that active correction and will be aligned with main and updated with actual docs-only measurements before merge.

## Current execution

Public deterministic validation and Cloud Figure preflight each own one static build. Their browser consumers wait for successful preflight, download only the successful producer's artifact from the same run, then verify head/base/tree, package and lock hashes, Node/npm/Playwright/Astro versions, allowed build environment, producer attempt and every output file's SHA-256. Wrong source, configuration, run, attempt or bytes fail; there is no latest-successful-artifact lookup. Failed-consumer reruns explicitly reuse the successful producer attempt. Vercel still builds its final candidate and Production independently.

The shared planner gives ordinary docs no browser work, bounded pages their mapped Public regression and exact-route smoke, and shared/global/unknown changes the full population. Browser selectors/fixtures, figure evidence gates and timing receipts force full work before route-owner shortcuts. Phone smoke retains iPhone 18 Pro Max browser simulation at 440×956; desktop acceptance and existing specific breakpoint regressions remain.

Cloud Figure runs a lightweight gate on every PR instead of filtering away the workflow. Non-full plans succeed only after successful preflight and an intentionally unallocated/skipped matrix. Full work requires every allocated shard plus exact-population/evidence aggregation. Missing/unknown plans, failed/canceled work, retries and unexpected skips never become success.

Full populations use actual historical browser/profile timings: the longest estimated case is assigned next to the least-loaded shard. Each lane retains all importing specs and selects exact full titles with escaped `--grep`; a second discovery must match the assignment before execution, and clean first-attempt outcomes must match afterward. Unknown cases receive the largest real weight for their browser. The old source-location `--test-list` CLI remains retired because it can lose helper registrations.

Draft heads already run on open and synchronize; changing an unchanged head to Ready does not allocate another full matrix. This was observed on #814: one Public and one Cloud run before and after promotion. Ordinary docs retain `verify:deploy` and the static build, but skip unused artifact transfer and browser discovery.

The semantic `typography` WebKit lane also obeys the shared risk plan. [#962](https://github.com/mykcs/basemodel/pull/962) repairs the consumer's applicability rather than manufacturing an artifact for unnecessary work: no-UI docs allocate no browser, while real typography/UI changes retain all four dedicated WebKit shards. Its always-present gate requires successful planning and deterministic checks, then either a deliberately skipped zero-allocation matrix or successful positive-allocation work. Actual expression/shell tests reject missing allocation, failure and cancellation. The high-risk hosted run and later docs-only hosted run qualify the two runtime paths independently.

## Full-candidate measurements

The historical #957 source differs from the optimized source, and hosted runner speed varies. These are observed samples, not a controlled causal benchmark. The historical figure attempt failed one WebKit lane; the optimized figure run passed both complete populations. Queue time, execution time, deliberate qualification failures and superseded/canceled work must not be mixed into a claim of successful savings.

| Profile | Historical #957 | Optimized #814 | Observation |
| --- | ---: | ---: | --- |
| Public job wall time summed | 3013 s | 2890 s | 50.2 → 48.2 Runner min |
| Public first-job to final gate | 675 s | 685 s | Approximately unchanged |
| Figure job wall time summed | 10034 s | 10836 s | 167.2 → 180.6 Runner min |
| Figure first-job to final gate | 3271 s | 2052 s | 54.5 → 34.2 min |
| Both workflows: event to last gate | 3334 s | 2147 s | 55.6 → 35.8 min, about 36% sooner |
| Both workflows: Runner total | 13047 s | 13726 s | 217.5 → 228.8 min, **5.2% higher** |
| GitHub site builds | 17 | 2 | 15 repeated builds removed, about 88% fewer |
| Slowest browser shard | Figure WebKit 2/4, 3265 s (54.4 min) | Figure WebKit 1/4, 1858 s (31.0 min) | Full shard job wall time, including setup |

Runner figures sum GitHub job `started_at`→`completed_at`; they are not CPU-utilization measurements or exact billed minutes. Combined elapsed time starts at the workflow event and ends at the last gate. Vercel deployment builds are counted separately. Required Public feedback is roughly eleven minutes in both samples; the major latency improvement is the complete two-workflow high-risk acceptance. For the final #814 head, workflow creation was 15:00:21 UTC, Public gate success 15:11:49 (688 s), exact-head Vercel success 15:22:09 (1308 s), and the final Figure gate 15:36:08 (2147 s). Required checks were therefore green after 21.8 minutes, while this task waited for the complete Figure evidence too. This includes the deliberate delay before requesting Vercel; it is not provider build time. No comparable historical final-Vercel clock is available, so the 36% figure is specifically complete browser-workflow latency, not a claimed 36% improvement in all Required Checks.

Sources: historical [Public 40856964834](https://github.com/mykcs/basemodel/actions/runs/40856964834), [Figure 40856964880 attempt 1](https://github.com/mykcs/basemodel/actions/runs/40856964880/attempts/1); optimized [Public 40897133905](https://github.com/mykcs/basemodel/actions/runs/40897133905), [Figure 40897133931](https://github.com/mykcs/basemodel/actions/runs/40897133931), exact head `0912d7464dafbb46868d2497d0f9468af85c345f`, merged as `126f9e135135cf11995bb58706a272faa83088a5`.

The historical `sitewide-figure-width-scope` file consumed about 35.2 minutes across 106 cases, not one 35-minute test. The largest route cases were about 7.3 minutes for parameter-memory results, 4.9 minutes for bounded effective state and 1.9 minutes for WebShop. Their combined cost was about 40% of that file. Logs do not separately measure screenshot, image-decode, font and animation-frame waits, so no single wait is claimed as the cause. The optimized final run still spent about 8.0 minutes on its slowest parameter-memory WebKit case (historical sample about 7.3 minutes), so no individual-test speedup is claimed. Duration routing distributes these existing units; the six width/theme states, grayscale/print captures, scientific table hashes and per-route evidence format remain intact. Route decomposition was deferred because it would require a new evidence-aggregation contract and was unnecessary for the observed latency gain.

## Artifact cost and decisions

On P1 [run 40890621991](https://github.com/mykcs/basemodel/actions/runs/40890621991), the Public build took 21 seconds, its 10.4 MB ZIP uploaded in 3 seconds, eight downloads totaled 15 seconds, and verification totaled 3 seconds. At that producer's speed eight extra builds would cost 168 seconds versus about 21 seconds for sealing, transfer and verification; this is a build-stage accounting estimate, not a controlled eight-build replay. The final Public producer built in 26 seconds and uploaded in 3 seconds.

Two independent workflows retain two build owners. Combining them merely to save the second measured 26-second build offers less than 0.2% of the sampled total Runner time, while coupling source/artifact provenance and the separate ordinary/deep-figure acceptance roles. No cross-workflow token/run-discovery path was added. Plain UI and full figure capture have different screenshot workloads and execution budgets; one green run is not substituted for the other.

P1 alone saved job time but increased Public elapsed time: 3013→2774 job seconds and 675→777 elapsed seconds. An intermediate P2 Public sample observed 2687/625 seconds, while the final candidate observed 2890/685. Reporting only the best intermediate result would overstate the outcome. The confirmed benefits are fewer build executions, shorter full-matrix latency, no unchanged Ready-promotion replay and early rejection of invalid candidates. A net reduction of all successful-run compute remains unproven.

## Acceptance and failure evidence

The historical Figure canonical list contained 1033 cases per browser; one failed historical lane is not complete passing coverage. Final #814 Public executed 1034 canonical Chromium tests plus the six-case Lab gate. Figure Chromium and WebKit each executed 1033 clean first-attempt tests. Each browser then verified the complete canonical union and round-tripped 4137 PNG/JSON/evidence files against exact-head manifests. Artifact integrity remains distinct from independent human visual or reader acceptance.

Intentional build-failure [PR #961](https://github.com/mykcs/basemodel/pull/961) is closed and unmerged. [Public 40894074083](https://github.com/mykcs/basemodel/actions/runs/40894074083) and [Figure 40894074037](https://github.com/mykcs/basemodel/actions/runs/40894074037) failed at the injected build step, started zero browser shards, and failed every final gate. Scientific source values and sealed evidence were not changed. Node tests reject wrong SHA/run/attempt/configuration, missing/changed/extra files, skips/retries, selection omissions and duplicates; the browser Q01 case still rejects a changed scientific cell before restoration.

Independent [#958](https://github.com/mykcs/basemodel/pull/958) subsequently merged as `1ed126cbe2c799520fe365b98a105ef7aa79b7bd`. Its repository privacy auditor is now upstream in both `verify:deploy` and build, and this CI candidate absorbs that main unchanged. On the merged source, four auditor tests passed; an intentionally nonstandard generic role fixture caused the real audit CLI to fail, byte-for-byte restoration returned it to PASS. No actual private person's name was introduced. The auditor identifies known textual violations; it does not establish complete anonymity of historical records, images or external URLs. The existing residual-identity/image follow-up [#963](https://github.com/mykcs/basemodel/issues/963) remains a separate privacy work item.

## Low-risk docs and deployment

The ordinary docs baseline is [#867](https://github.com/mykcs/basemodel/pull/867), head `3864f61841b999ddb5c3f2823826e34cbb5b0060`, three docs-only files. [Run 38994719498](https://github.com/mykcs/basemodel/actions/runs/38994719498) reported planner skip, no browser runner, 132 summed job seconds and 122 seconds from first job to gate. A second historical docs-only case, [#950](https://github.com/mykcs/basemodel/pull/950) on `e32f797c0c37bd0ba4b2c9e228bdeb905bdd5a41`, changed only four Agent evidence documents but its typography-named branch allocated four full WebKit shards despite planner skip. [Run 40063668716](https://github.com/mykcs/basemodel/actions/runs/40063668716) consumed 5478 summed job seconds (91.3 Runner minutes) and 1535 seconds (25.6 minutes) from first job to gate. This is the direct unnecessary-consumer control for #962. The current docs qualification will be recorded after its actual run; no unmeasured speedup is asserted.

Vercel inspection found 9 READY deployments (3 Production, 6 Preview) in the 24 hours ending at the newest pre-task deployment, `2026-10-29T14:17:21.813Z`. Ordinary implementation pushes created no deployment. #814's one explicit final Preview was READY on the accepted head; one Production deployment reached READY on exact merged `126f9e1`, and its stable alias served both `/` and the parameter-memory research route with HTTP 200, the expected canonical identity and protected-site `noindex,follow`. Deployment Protection was retained. This dated count is not a quota or plan claim.

## Rollback

Revert workflow, scheduler/risk owner and matching contract changes together through a normal PR. Keep `public-ci-gate` and Vercel protection active; never remove required contexts to undo the optimization. Restoring native per-shard builds/scheduling restores their original cost. Preserve timing receipts, intentional-failure records and real source identities rather than rewriting historical measurements.
