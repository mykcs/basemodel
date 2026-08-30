# CI runner, Cloudflare smoke, and Vercel offload retrospective — 2026-08-29

Status: **historical case record**. Current behavior is owned by `docs/agents/current/deployment-policy.md`, `docs/agents/current/hosting-architecture.md`, `.github/workflows/self-hosted-ci.yml`, `scripts/ci-ui-gate.mjs`, `scripts/vercel-ignore-build.mjs`, `vercel.json`, and live provider state.

This record captures the engineering and reasoning friction from the end-to-end CI redesign discussion and implementation on 2026-08-28/29, plus the Doctor-led safety and disk-maintenance follow-up on 2026-08-30. It is deliberately not a new architecture proposal. The accepted steady-state decision already exists in current policy; this file explains how that decision was reached, what went wrong during implementation, which intuitions were corrected by evidence, and what future Agents should avoid rediscovering.

## Starting problem

The repository already had strong quality gates, but too much responsibility had accumulated inside a Vercel Production build:

```text
source checks / deterministic audits
+ Astro build
+ Chromium environment preparation
+ 92-case browser regression
+ 12-case Lab browser gate
+ deployment
```

The owner wanted to preserve quality while reducing Vercel Build Compute, avoid GitHub-hosted runner minutes, avoid touching the research/GPU server, and preferably add no recurring CI bill.

The important constraint added during the discussion was explicit: **do not pay for a cloud runner**. That changed the runner choice materially. The goal therefore became not “find the most elegant cloud CI,” but “move expensive browser proof away from Vercel without creating a new paid service or weakening release safety.”

## Final accepted architecture

```text
GitHub PR / release candidate
-> repository-scoped self-hosted CI control plane
-> isolated Mac/OrbStack Docker runner
-> deterministic validation + risk-based browser acceptance
-> required `basemodel-self-hosted` check

merge to main
-> Vercel lightweight verify:deploy + Astro build
-> Production
-> Cloudflare Worker post-deploy smoke
```

The role boundaries are intentional:

- **GitHub Actions** schedules and reports the required check; it does not use GitHub-hosted compute for this workflow.
- **The local runner** proves source/build/browser behavior before merge.
- **Vercel** remains the ordinary Preview/Production deployment authority and no longer acts as the browser farm.
- **Cloudflare** observes the deployed Production origin; it does not compile the repository or replace pre-merge CI.
- **The research/GPU server** is not part of this CI topology.

## Friction 1: architecture discussion started with estimates; real build logs changed the priority

An early external proposal was directionally strong but overestimated several costs: it treated `verify:deploy` as roughly 1.5–2 minutes and the Vercel browser dependency setup as roughly 50–70 seconds. Representative live Vercel logs showed a different shape:

```text
verify:deploy                         ~40s
Astro build                           ~6–7s
first browser environment preparation ~20–25s range
92-case Chromium matrix               ~4.8m
12-case Lab gate                      ~33s
representative full Production wall   ~6m42s / displayed ~7m
```

The browser matrices dominated the build. That changed the implementation order: **move browser acceptance first; do not begin by splitting every deterministic audit or micro-optimizing package installation.**

After the browser gates were removed from ordinary Vercel Production, a real Production build completed in about **47 seconds** while still building all 437 pages. This was the decisive evidence that the migration target was correct.

Reusable lesson: before redesigning CI around guessed costs, decompose one or more real builds by phase. Optimize the dominant measured phase first.

## Friction 2: “free cloud runner” was the wrong abstraction

A cloud runner is usually just an ordinary VM with the GitHub runner program installed. Once the owner required **zero additional recurring cost**, most clean x86 cloud options stopped being attractive. Free-tier availability, quotas, architecture, and account eligibility are time-sensitive and should not be treated as permanent infrastructure guarantees.

The decision therefore shifted from “which free VPS?” to “which execution surface already exists, is isolated, and can be bounded safely?” The answer was the owner's MacBook, but **not** as a native runner in the everyday macOS user session.

The accepted local execution boundary became:

```text
MacBook
-> OrbStack Docker engine
-> repository-scoped Linux container
-> no host mounts
-> no Docker socket
-> no personal SSH agent/keychain mounts
-> 4 CPU / 8 GB / 1 GB shm cap
-> Playwright workers = 1
```

The start script also refuses to start while the Mac is on battery power. Idle measurements were tiny (roughly 0.01–0.18% CPU and around 100 MiB memory), so keeping the runner online was preferable to making every PR wait for a human to remember to start it.

Reusable lesson: “self-hosted” should not mean “give CI the user's whole laptop.” Treat the local machine as the hypervisor/host and keep CI inside a narrow, reproducible execution boundary.

## Friction 3: the first isolation plan was too strict to manage

The first OrbStack VM attempt used both filesystem and network isolation. It successfully reduced exposure, but it also cut the management path needed to provision the guest. An amd64 isolated VM then failed to obtain a usable IP during provisioning on the Apple Silicon host.

Rather than weakening isolation broadly or installing the runner directly into macOS, the implementation changed execution form: use OrbStack's Docker engine with **zero host volume mounts**. That preserved the important data boundary while avoiding the management dead end.

## Friction 4: x86 was initially preferred, but the actual suite did not require an x86 pixel oracle

The first runner preference was x86 Linux because it is closer to Vercel's hosted Linux environment and avoids accidental visual-baseline drift. The available local machine, however, is Apple Silicon. The relevant question was therefore not “is ARM always equivalent?” but “what does this repository's browser suite actually assert?”

Inspection showed that the current visual-signature flow captures signatures into artifacts and does not compare the ARM render against a committed x86 pixel baseline. The important current tests are DOM, geometry, overflow, interaction, theme, route, and screenshot-signature behavior rather than a fixed cross-platform pixel oracle.

That made an arm64 Linux runner acceptable **for the present suite**. Real execution confirmed it: the full Chromium matrix passed repeatedly on the ARM64 container.

Do not generalize this into “ARM is always fine for visual CI.” If the project later introduces committed platform-specific screenshots or font-sensitive pixel baselines, declare one baseline platform and keep those tests there.

## Friction 5: the obvious official Playwright image was too heavy for the zero-cost local goal

The first container plan used Microsoft's full Playwright image. The image download was roughly hundreds of megabytes with a very large layer and progressed slowly enough that it became the dominant setup cost.

The better local image was built from `node:24-bookworm-slim`, with only the required system packages plus the official GitHub runner binary. Playwright downloads Chromium into the persistent runner cache when needed.

This reduced the custom runner image substantially and kept the trust boundary clearer than adopting an arbitrary third-party “GitHub runner + Playwright” image.

Reusable lesson: an official all-in-one image is not automatically the best fit for a persistent low-volume runner. Prefer the smallest first-party/reproducible base that satisfies the actual execution contract.

## Friction 6: first-run downloads looked like hangs until progress was measured

The first real workflow spent noticeable time in `actions/setup-node` and later in `playwright install chromium`. Looking only at the GitHub step state made both look stuck.

The useful diagnosis was to inspect the runner filesystem and process tree. The Node temporary download file was steadily growing; later the Playwright cache grew from roughly 496 MiB to about 984 MiB while the browser download process remained active. That proved slow initialization, not a deadlock.

Once those caches were warm, later runs moved quickly through setup and into the repository work. The persistent container therefore became part of the cost model: keep npm and Playwright caches local rather than pretending every run is an ephemeral cloud runner.

A related optimization removed `cache: npm` from `actions/setup-node`. The persistent runner already retained its local npm cache, so uploading roughly 100+ MiB to GitHub at the end of every job added time and hosted-cache dependence without useful reuse.

Reusable lesson: when diagnosing “stuck CI,” check whether bytes/processes are still moving before killing the job. When the runner is persistent, distinguish **local cache persistence** from **hosted cache upload/download**; they solve different problems.

## Friction 7: the first browser failure was a harness lifecycle bug, not an ARM/browser failure

The first heavy run reached `ui-overflow-preflight.mjs` and appeared to hang. Initial evidence could have suggested ARM Chromium incompatibility, but direct checks showed:

- the downloaded Chromium binary was native `aarch64`;
- dynamic libraries resolved;
- `chromium.launch()` worked and exited normally;
- the preview port returned HTTP 200 in milliseconds.

The actual problem was an **Astro preview lifecycle mismatch**. Astro 7's preview command can maintain/detach a server, so canceling a CI job left a server bound to port 4328. The repository's main Playwright config had already solved this class of problem with `scripts/playwright-static-server.mjs`, but `ui-overflow-preflight.mjs` still used the older Astro preview path.

The fix was to make the preflight reuse an attached static server and to bound its readiness fetch rather than depending on the detached Astro preview lifecycle. The patched preflight then passed all six route/viewport probes inside the real ARM64 runner.

Reusable lesson: when a browser gate stalls, classify the failure layer explicitly:

```text
browser download
-> browser launch
-> local server lifecycle
-> harness navigation
-> assertion / real product regression
```

Do not jump from “Playwright step is stuck” to “this CPU architecture is unsupported.”

## Friction 8: the first full runner proof had to be real, not inferred from registration

A GitHub runner showing `online` only proves that the listener registered and can open a session. It does not prove checkout, Node setup, npm installation, repository gates, browser launch, or the actual test suite.

The first complete self-hosted proof therefore ran the whole chain on an exact PR head:

```text
checkout
-> resolve base/head
-> classify CI relevance
-> Node 24
-> npm ci
-> verify:deploy
-> build
-> UI preflight
-> 92-case Chromium matrix
-> 12-case Lab gate
```

After the preflight lifecycle fix, the exact head passed the 92-case Chromium matrix in about **3.5–3.6 minutes** with one worker and the Lab 12-case gate in roughly **20 seconds**. Multiple later infrastructure changes repeated the full matrix successfully.

This mattered because the Mac runner was not accepted on architectural optimism. It was accepted after the same repository gates actually ran there.

Reusable lesson: distinguish **runner registered**, **job started**, **environment prepared**, **browser launched**, and **full required gate passed**. Only the last state is release evidence.

## Friction 9: risk planning must fail closed when CI infrastructure itself changes

The existing `vercel-ui-plan.ts` already encoded useful risk-based UI scope. The new `ci-ui-gate.mjs` intentionally reused that planner instead of creating a second provider-specific taxonomy.

But moving the executor introduced a new class of high-risk file: the planner, CI gate, workflow, and runner image/start scripts themselves. Those files can change what gets tested even when they do not alter a rendered page.

The resulting rule is fail-closed: changes to CI/browser infrastructure force the complete browser matrix, and runner/CI infrastructure changes also force the Lab gate. This prevents the system that chooses tests from declaring its own change low risk.

Reusable lesson: risk classifiers need **self-protection**. Any file that changes classification, execution, environment, or gate semantics should expand coverage rather than use the optimized path it is modifying.

## Friction 10: CI relevance and deploy relevance were accidentally coupled

One of the most important implementation mistakes appeared only after the Vercel ignored-build classifier was improved.

The desired behavior was:

```text
test-only change
-> self-hosted CI validates it
-> Vercel does not rebuild the website
```

The first implementation reused `scripts/vercel-ignore-build.mjs` inside the GitHub workflow to decide whether CI itself was needed. Once `*.test.*` and `tests/**` were correctly excluded from Vercel deployment relevance, the same test-only PR also caused Node/npm/tests/browser work to be skipped in self-hosted CI. The required check was green, but it was an **empty green**.

That proof PR was intentionally not merged in that state. The workflow was corrected so CI relevance and Vercel deploy relevance use separate decisions:

```text
docs/governance-only
-> CI classifier can stop after checkout/diff classification
-> Vercel ignored build

test / workflow / runner / validation code
-> CI must validate
-> Vercel may ignore the website build

product/runtime/deploy code
-> CI validates according to risk
-> Vercel builds/deploys when deploy-relevant
```

A later exact-head run proved the corrected workflow actually entered Node 24, `npm ci`, deterministic validation, static build, and browser acceptance instead of returning an empty green.

Reusable lesson: **“does this need testing?” and “does this need a deployment?” are different questions.** Never let a deployment-budget classifier become the sole CI classifier.

## Friction 11: branch protection had to be enabled only after the runner path was proven

At the start of the migration, `main` had no branch protection. Making a brand-new required check mandatory before the runner had completed one real job could have locked the repository behind a broken CI path.

The safer order was:

```text
implement workflow + runner on a branch
-> prove the real self-hosted job
-> prove full browser/Lab acceptance
-> merge the architecture
-> then require `basemodel-self-hosted` on main
```

The final branch protection uses strict up-to-date status checks, disables force-push/delete, and does not enforce administrators. The non-enforced admin path is an explicit emergency recovery route if the on-demand/self-hosted runner itself becomes unavailable.

The strict setting immediately proved useful: a later docs-only PR passed, but `main` advanced while it waited behind another CI job. GitHub correctly refused the stale merge. The branch was synchronized with current `main`, the fast docs-only classifier reran, and only then was the PR merged.

Reusable lesson: required checks should become blocking **after** their execution path is proven, and strict-up-to-date rejection is expected safety behavior, not CI friction to bypass with admin merge.

## Friction 12: single-runner serialization is a deliberate tradeoff

The Mac runner uses one repository-scoped listener and one-worker Playwright execution. A docs-only PR once sat queued because an earlier PR was running a full browser matrix. Nothing was hung: GitHub showed the runner `busy=true` on the prior run and the docs job queued behind it.

The correct response was to let the earlier job finish rather than cancel another Agent's valid acceptance just to make a documentation PR faster. Once the runner was free, the docs PR took only seconds to classify and skipped Node/npm/build/browser work.

Reusable lesson: with one zero-cost runner, **queueing is normal**. Diagnose `queued` by inspecting which run owns the runner before treating it as an outage. Increase runner count only if measured queue contention becomes a real delivery problem.

## Friction 13: Cloudflare was useful only after its role was narrowed

The tempting idea was “move some of Vercel CI to Cloudflare.” That phrase is too broad. Moving npm install, repository compilation, Vitest, or the full Playwright matrix into a Worker would merely recreate the same CI complexity on another provider.

The useful split was semantic rather than provider-driven:

```text
pre-merge source/build/browser proof
-> self-hosted CI

deployment authority
-> Vercel

post-deploy observation of the real public origin
-> Cloudflare Worker
```

`cloudflare/production-smoke/` therefore checks the actual Vercel Production origin for critical HTTP status, canonical identity, indexability, `robots.txt`, sitemap presence, and a legacy redirect. It runs on a schedule and remains independent from the Vercel build command.

The local smoke logic was first run against the real Production site and passed **19 checks with zero failures** before the Worker was deployed. After deployment, `/healthz` returned 200/OK and the unauthenticated manual `/check` path correctly returned 401. The scheduled smoke does not need the manual token.

Cloudflare Browser Rendering was discussed only as a possible future **small online browser probe**. It was explicitly not chosen as the new home for 92 UI tests + 12 Lab tests. Current quotas/pricing/capabilities are time-sensitive and must be re-verified before any future decision.

Reusable lesson: assign providers by **semantic responsibility**. “Cloudflare exists” is not a reason to move arbitrary CI there.

## Friction 14: existing Cloudflare build scripts were not suitable smoke runners

The repository already contained Cloudflare build helpers, but those scripts themselves ran `verify:deploy` and a full site build. Reusing them for “cheap smoke” would have duplicated deterministic/build work rather than reduced it.

The production-smoke Worker was therefore created as a separate tiny surface instead of reactivating the existing fallback/shadow build path.

Reusable lesson: before reusing a provider script because its filename looks relevant, read what it actually executes. A “Cloudflare build” helper is not automatically a lightweight Worker health check.

## Friction 15: Vercel build skipping needed a real main-branch proof

After browser offload, another small source of waste appeared: a runner-infrastructure change also touched `src/lib/deploymentArchitecture.test.ts`, and the old Vercel path classifier treated every `src/**` file as deploy-relevant. Vercel started a Production build even though only a test contract and runner script had changed.

The fix excluded `tests/**` and `*.test.*` / `*.spec.*` from **Vercel deploy relevance** while leaving real product source, public assets, scripts, dependency/config files, and uncertain cases build-relevant.

This was not accepted from unit tests alone. A later test/workflow-only merge produced a real Vercel deployment record whose log said:

```text
Proven Git range has no deploy-relevant changes; skip this build
```

and the final deployment state was `CANCELED` by the Ignored Build Step. A later `.github/runner + *.test.ts` merge repeated the same result.

Docs-only behavior was also proven end to end: the self-hosted job performed checkout + classification, skipped Node/npm/build/browser, and the resulting main deployment record was canceled before the site build.

Reusable lesson: a cost classifier is not complete because its unit test says “false.” Prove at least one real provider-triggered `main` change reaches the intended ignored/canceled state.

## Friction 16: runner lifecycle scripts also need idempotence and cache-aware behavior

Two maintenance bugs appeared after the main architecture already worked:

1. `mac-orbstack-start.sh` checked for `Runner.Listener` with `ps` **inside** a slim container that did not contain `ps`. A repeat start could therefore falsely conclude no listener existed and attempt to start another one.
2. The start script rebuilt the Docker image on every invocation even when the tagged image already existed. A “start runner” operation could spend minutes downloading/installing packages before doing any CI work.

The listener check moved to host-side `docker top`, and the image build became conditional on the versioned image tag being absent. A real repeat-start test measured about **3 seconds**, with listener count staying **1 -> 1** and GitHub remaining online.

Reusable lesson: an on-demand runner needs a cheap, idempotent control path. Bootstrap/rebuild cost belongs to image/version changes, not every ordinary start.

## Friction 17: the running container and the rebuildable image briefly diverged

During setup, `xz`/`zstd` were added to the live runner environment so GitHub setup tooling could work reliably. The running container was healthy, but the tagged base image still represented the older state because a later full rebuild had been interrupted during slow package downloads.

That is a dangerous kind of success: CI works today, but deleting/recreating the container could resurrect an incomplete environment.

The final cleanup explicitly checked the **image itself**, not only the running container, found `xz=missing` and `zstd=missing`, and repaired the tagged image. A temporary clean container then verified:

```text
xz=/usr/bin/xz
zstd=/usr/bin/zstd
Node 24 present
GitHub runner binary present
```

Two tooling-only failures occurred during that repair: using all of `/tmp` as Docker build context hit a protected Logitech xattr file, and `FROM sha256:...` was interpreted as a remote image reference. Neither affected the live runner. The successful path used a clean tiny build context and a temporary local image tag.

Reusable lesson: for persistent runners, verify both **live mutable state** and **recreate-from-image state**. A container that works after manual package installation is not enough evidence that disaster recovery will work.

## Friction 18: exact source proof is stronger when commit identity and tree identity are separated

The accepted PR head and its eventual merge commit had different commit SHAs, but their Git tree hashes were identical. That provided a useful proof that the Production build source tree was byte-for-byte the same tree that had passed the heavy self-hosted gate.

This exposed a broader design nuance: GitHub status checks are commit-SHA keyed, while a squash/merge workflow can produce a different commit identity for the same file tree. Tree or build-input identity can therefore be useful **evidence**, but adding a custom proof registry merely to exploit it would create new infrastructure.

The current decision remains simpler: protected `main` + required exact-head check + normal merge/release discipline. Tree-hash comparison is a useful diagnostic/provenance technique, not a new mandatory service.

A still stronger future model would be **build once -> test that immutable deployed candidate -> promote the same deployment**. That removes rebuild/source-correlation ambiguity, but it changes the present Vercel Git-integration release model and was intentionally deferred.

## Friction 19: disk pressure needed a health baseline before cleanup

The later maintenance conversation began with a broad request to optimize the Mac-hosted CI safely. The useful first action was not deletion; it was the installed `mac-orbstack-doctor.sh`. The baseline showed:

```text
AC power
Data volume: 79 GiB available / 92% used
OrbStack: running
v2 runner container: running + healthy
runtime boundary: 4 CPU / 4 GiB RAM + 4 GiB swap / no mounts / no ports
memory peak: about 2.22 GiB / OOM kills: 0
GitHub runner: online / busy=false
LaunchAgent: loaded
```

This separated host storage pressure from runner failure. It also prevented cleanup while a GitHub job was active. The long `Runner.Listener --version` diagnostic block was not an error: the command still printed `2.337.0`, matched the latest release, and exited successfully. With the runner's current diagnostic environment, the version check can also append a small `_diag/Runner_*.log`; treat that as a bounded diagnostic side effect, not as proof that Doctor is byte-for-byte read-only. Verbose output must not be reclassified as failure without the exit status and final values.

On APFS, `df /` can describe the sealed system volume and look deceptively comfortable while user data lives on `/System/Volumes/Data`. Capacity decisions must use the volume that backs the target path; the Doctor's home-volume reading correctly exposed the 92% condition.

Reusable lesson: **establish power, correct-volume disk, runner busy state, isolation, memory/OOM, version, and lifecycle health before changing local CI storage.** A healthy listener plus low free space is a maintenance problem, not an excuse to rebuild the runner.

## Friction 20: “reclaimable” did not mean “safe to delete”

The first Docker inventory exposed roughly 10 GiB across **unused images, stopped containers, and BuildKit cache**. That Docker-reclaimable subtotal mixed very different ownership classes:

- older, proven-disposable BuildKit cache;
- unused but intentionally prepared OpenEvo/Node images;
- stopped v2 backup containers;
- the 1.94 GiB legacy runner kept for the bounded rollback window.

The active runner's warm Playwright, tool, npm, and workspace data appeared in the broader inventory, but was **not** part of Docker's reclaimable subtotal. It was retained as live writable state with known next-run value.

Likewise, large host directories were not uniformly disposable. `~/.npm` was about 20 GiB but was also a Git repository with a roughly 989 MiB `.git`; deleting the directory would have destroyed source history. `~/.cache` contained a Git repository, worktrees, model data, and credentials-adjacent Hugging Face state. OrbStack's own group-container directory was about 18 GiB, but its internal files are implementation state and must be managed through Docker/OrbStack commands rather than manual filesystem deletion. Xcode DeviceSupport and simulators, Playwright browser versions, registered worktrees, and the runner's active writable layer all had real reuse or recovery value.

The safe classification was therefore:

```text
tool-owned, reproducible cache
-> eligible for the tool's cleanup command

recent build cache / warm CI cache
-> retain unless disk pressure requires the rebuild cost

image / stopped container / worktree / provider state
-> preserve until ownership and rollback value are proven absent

opaque application internals or mixed-purpose directories
-> never bulk-delete
```

Reusable lesson: `docker system df` and `du` find size, not ownership. **Classify rebuild cost, rollback value, active-job state, and secret/source boundaries before turning a byte count into a deletion target.**

## Friction 21: supposedly diagnostic commands can mutate cache state

The initial whole-home `du -xhd 1` scan was too broad and exceeded the first 30-second observation window. Targeted scans of known roots produced actionable results faster: `~/Library/Caches` 27 GiB, `~/Library/Developer` 27 GiB, `~/.npm` 20 GiB, and `~/.cache` 17 GiB, followed by one-level breakdowns inside each root.

Because the v2 runner has zero host mounts, those host npm/pip/uv/pnpm caches are **not runner-owned cache and are not visible inside CI**. Their cleanup was separately authorized machine-wide developer-cache maintenance to recover space on the shared APFS Data volume. It did not make CI faster and can make the next host-side development command redownload dependencies. Authorization to maintain only the runner would not have authorized this host-cache scope.

A more subtle mistake was treating `npm cache verify` as purely read-only. It verified content **and garbage-collected about 7.9 GB** of unreferenced entries. That behavior was safe here, but it means the command belongs to the cleanup phase, not a strict no-write inventory phase. Future maintenance should use `npm cache verify` only after cache cleanup has been authorized, and should record its reclaimed bytes separately from later `npm cache clean --force` output.

The following commands are an **authorized 2026-08-30 execution record, not a standing copy/paste runbook**. That run first proved the GitHub runner idle, checked that no host `npm`, `npx`, `pip`, `uv`, `pnpm`, Docker build, or Buildx process was active, resolved the actual cache roots, and kept containers/images/worktrees out of scope:

```bash
npm cache clean --force
python3 -m pip cache purge
uv cache clean
pnpm store prune
docker builder prune -af --filter 'until=24h'
```

The OrbStack BuildKit builder is a host-wide shared cache, not a repository-private directory. In this one run, the 24-hour filter retained the freshly built runner layers while removing about 2.09 GB of older data; that timing is historical evidence, **not** a universal safety guarantee. A future run must repeat Doctor/process/cache-root/ownership checks and confirm that its current task authorizes each mutating scope before using any cleanup command. No container, image, Playwright installation, Xcode data, worktree, OrbStack internal file, user document, or repository was removed. The remaining `~/.npm/_npx` cache and Docker image/container candidates were deliberately retained because clearing them would require a more destructive ownership decision than the available evidence justified.

Reusable lesson: prefer official cache commands over recursive filesystem deletion, check for active package-manager processes first, and know whether a command named `verify`, `doctor`, or `prune` is observational or mutating before placing it in a read-only phase.

## Friction 22: cleanup completion required measured deltas and a second Doctor pass

Summing every tool's reported deletion would have overstated confidence because cache sizes overlap in time, npm verification had already garbage-collected data, and APFS accounting is not a simple sum of directory reports. The authoritative outcome was the before/after filesystem measurement:

```text
before: 79 GiB available / 92% used
after:  102 GiB available / 89% used
measured gain: about 23 GiB
```

The second Doctor pass then re-established the operational contract: AC power, OrbStack running, v2 container healthy, unchanged isolation/limits, memory peak about 2.22 GiB, zero OOM kills, GitHub `online` and `busy=false`, runner `2.337.0`, and LaunchAgent loaded. Cache cleanup was therefore accepted only after proving it had not changed the runner identity, container boundary, or lifecycle state.

This was a successful **bounded cache pass**, not proof that disk pressure was fully resolved. At 89% used, only about 11% remained free, still below the LaunchAgent reconcile policy's 15% free-space warning threshold. The correct stopping decision was to preserve the remaining images, rollback containers, warm browser/runtime caches, Xcode data, and registered worktrees because their ownership/recovery value was not disproven. Continued warning is expected until a later, separately evidenced cleanup or normal data movement raises free space above the threshold.

Reusable lesson: report **measured free-space delta**, not a theoretical sum, and close maintenance with the same health probe used at the start. Disk space recovered without post-cleanup CI health evidence is an incomplete result.

The maintenance priority is deliberately ordered:

- **P0 — protect the machine and active work:** confirm AC power, the correct data volume, `busy=false`, healthy isolation, and no active host package-manager or Docker/Buildx build process; do not touch containers, images, worktrees, mixed-purpose directories, or application internals without separate ownership evidence.
- **P1 — reclaim only explicitly scoped, reproducible cache:** distinguish host developer caches from the zero-mount runner; use npm/pip/uv/pnpm commands only when machine-wide cache cleanup is authorized, and use an age-filtered BuildKit prune only after resolving the shared builder; accept the next-run download/rebuild cost explicitly.
- **P2 — prove the outcome:** measure the filesystem delta, rerun the Doctor, and require the same runner identity, online/idle state, isolation, zero OOM kills, version, and LaunchAgent health.

## Reasoning correction: not every plausible duplicate was an actual current duplicate

During architecture discussion it was easy to say “Preview runs full browser acceptance and Production runs it again.” Repository/live evidence showed that was not always the current behavior. For example, the observed PR #316 Preview skipped the browser gates while Production later ran them.

So the real pre-migration problem was not simply “the same 92 tests always run twice.” It was:

- browser acceptance was still coupled to Vercel Production;
- Preview evidence was not a durable required pre-merge browser proof;
- browser cost therefore landed in the release path even when a better executor could own it.

Reusable lesson: distinguish an **architecture-level duplication risk** from a **measured current duplicate**. Do not justify a migration with a waste pattern the logs do not actually show.

## Reasoning correction: do not move every deterministic audit out just because browser work moved out

A proposal to split `verify:deploy` aggressively or move many audits to nightly would have increased change surface before the dominant cost was removed. Several audits are cheap, deterministic release invariants and are valuable precisely because they fail before deployment.

The chosen sequence was intentionally conservative:

```text
Phase 1: remove expensive browser execution from Vercel
Phase 2: prove self-hosted CI + required check + deploy classifier
Phase 3: consider further split only if new measurements justify it
```

The current Vercel build still runs `verify:deploy && build`. That is acceptable because the measured Production build fell to roughly the 47-second range after browser offload.

Reusable lesson: optimize one dominant layer at a time. A cost project does not need to become a complete CI taxonomy rewrite.

## Reasoning correction: one risk planner is better than provider-specific planners

The repository already had useful risk knowledge in `vercel-ui-plan.ts`. Reimplementing a new Mac-specific planner would have created policy drift: the same file change could mean “focused” on one provider and “full” on another.

The new self-hosted gate therefore treats the planner as **repository policy**, even though its historical filename still contains `vercel`. Executor-specific code handles environment/bootstrap; risk ownership remains shared.

Longer term the filename may be renamed if that improves clarity, but a cosmetic rename is not needed to make the architecture correct.

## Tool and authorization friction

Several failures belonged to tooling/auth boundaries rather than architecture:

- one GitHub integration could not read branch protection and returned a permissions error, so protection state was not assumed from that surface;
- the authenticated local `gh` CLI later had the repository authority needed to read/write branch protection;
- an attempt to automate creation/injection of a Cloudflare `SMOKE_TOKEN` was blocked by the active tool safety layer, so the implementation did **not** work around the restriction or commit a token;
- the scheduled Worker remained fully functional without the manual `/check` token, while `/check` stayed safely locked at 401;
- several diagnostic shell commands failed because the active shell was `fish` while the command used Bash-only syntax, or because a grep/process pattern matched the diagnostic command itself.

These incidents should be classified as execution-surface errors. They do not justify weakening repository or provider security boundaries.

Reusable lesson: when a connector/CLI/tool cannot perform a write, distinguish **missing authority** from **product failure**. Use another already-authorized narrow surface when available; do not smuggle secrets into Git or relax protections to make automation easier.

## Security decisions that should remain boring

The self-hosted runner was deliberately designed to be uninteresting to attack:

- repository-scoped runner;
- same-repository owner-trigger restriction;
- `contents: read` workflow permission;
- checkout credentials not persisted;
- no deploy token on the generic test runner;
- no host home-directory mount;
- no SSH agent/keychain mount;
- no Docker socket mount;
- no research-server credential or CI role;
- one CI job at a time and one Playwright worker;
- administrator branch-protection bypass retained only as emergency recovery, not normal release flow.

The key model is: **GitHub may ask the runner to execute repository code, so the runner should possess as little unrelated authority as possible.**

## Things that were intentionally not done

- No GitHub-hosted runner was introduced as the normal executor.
- No paid cloud VM was made a prerequisite.
- No research/GPU server was registered as a CI runner.
- No Cloudflare Worker was turned into an npm/build/test environment.
- No full 92+12 browser matrix was moved to Cloudflare Browser Rendering.
- No Vercel deploy token was placed on the generic self-hosted test runner.
- No custom tree-hash proof database was introduced.
- No build-once/promote release model was adopted yet.
- No broad `verify:deploy` teardown was performed simply because browser work moved out.

## What the external architecture critique got right — and what live evidence corrected

The external critique that triggered part of this discussion was useful because it correctly noticed several structural facts:

- the repository already had a risk-aware UI planner;
- heavy browser execution should not remain coupled to Vercel Production;
- the research/GPU server should stay outside ordinary CI;
- a post-deploy Cloudflare smoke layer can complement, rather than replace, deployment;
- provenance between tested source and released source matters.

But live repository/provider evidence corrected several details:

- `verify:deploy` was about 40 seconds in the representative run, not the much larger estimate;
- Vercel's first browser-system preparation was tens of seconds, not the dominant multi-minute cost;
- the 92-case browser matrix itself was the dominant phase;
- a representative Preview had actually skipped browser acceptance, so “Preview full matrix + Production full matrix every time” was not a proven current pattern;
- GitHub checks/statuses are commit-oriented, so a proposed tree-hash lookup is not a free native replacement for commit proof; a custom mapping/registry would add complexity;
- moving every audit to nightly would incorrectly demote cheap deterministic release invariants.

Reusable lesson: third-party architecture advice is most valuable as a list of hypotheses. Validate its timing, provider assumptions, and current-repository claims before turning it into work.

## End-state evidence from this case

The migration was closed with multiple independent proofs:

```text
self-hosted exact head
-> deterministic gate PASS
-> 437-page build PASS
-> Chromium 92/92 PASS (about 3.5–3.6m, 1 worker)
-> Lab 12/12 PASS (about 20s)

Vercel Production
-> 437 pages
-> no Chromium / dnf browser setup
-> Build Complete about 47s

Cloudflare / public Production
-> production smoke 19/19 PASS
-> Worker /healthz 200
-> unauthenticated /check 401
```

The accepted PR head and the Production merge commit were also compared by Git tree hash and matched, proving the deployed source tree matched the heavily tested tree even though the commit SHAs differed.

## Durable implementation trail

The implementation and hardening were intentionally split into small, observable steps rather than one unreviewable infrastructure jump:

- **PR #319** — moved browser acceptance off Vercel, introduced self-hosted CI, runner packaging, Cloudflare Production smoke, and current architecture updates;
- **PR #320** — proved docs-only required-check behavior and recorded the blocking check;
- **PR #321** — fixed runner start idempotence (`docker top` instead of assuming `ps` exists inside the slim container);
- **PR #322** — made test-only files non-deploy-relevant to Vercel;
- **PR #323** — caught and fixed the empty-green coupling between CI relevance and deploy relevance, then proved test/workflow-only changes still execute real CI while Vercel can skip deployment;
- **PR #324** — stopped rebuilding the runner image on every ordinary start and proved repeat start remained one listener;
- **PR #327** — added the accepted decision rationale and explicitly marked tree identity, build-once/promote, alternate x86 runners, and Cloudflare Browser Rendering as deferred ideas rather than current work.

Treat these PR numbers and timings as historical evidence, not current state. Future Agents must read current policy/executable config first.

## Minimal playbook for a future CI/provider-cost incident

1. Read `current/deployment-policy.md` and `current/hosting-architecture.md` before proposing a provider change.
2. Read live Vercel deployment logs and decompose wall time by deterministic checks, build, browser bootstrap, browser matrices, deploy, and cache handling.
3. Check whether the self-hosted runner is `online`, `busy`, or genuinely unavailable before calling a queued job stuck.
4. Separate CI relevance from deploy relevance. A test/runner/workflow change can require CI while requiring no website rebuild.
5. If browser CI fails, classify download -> launch -> server -> harness -> assertion before changing architecture.
6. If the runner environment was manually repaired, verify the tagged image/recreation path also contains the repair.
7. Keep the planner provider-neutral in behavior: reuse one risk policy rather than creating Mac/Vercel/Cloudflare variants.
8. Treat Cloudflare smoke as post-deploy observation; do not push compilation/full regression into the Worker merely to move cost.
9. Enable or change branch protection only after the replacement required-check path has proven itself.
10. Prove cost optimizations in the real provider: inspect ignored/canceled Vercel records, not only local classifier tests.
11. Preserve source/test/release identity. Use exact-head checks and, when useful, compare tree identity; do not invent a proof service unless the simpler model stops being sufficient.
12. Re-measure after changes. The migration run, cold-cache run, or runner bootstrap is not necessarily the steady-state cost.
13. For Mac runner disk pressure, run the installed Doctor before and after cleanup; use the data volume that backs the home directory rather than assuming `df /` represents user storage.
14. Inventory targeted cache roots, classify ownership, and use package-manager/Docker cleanup commands only within the separately authorized scope. Never bulk-delete `~/.npm`, `~/.cache`, OrbStack internals, runner writable state, or registered worktrees from size alone.
15. Preserve active and rollback containers/images unless their recovery value has expired; a proven-idle age-filtered BuildKit prune narrows scope but does not make host-wide pruning intrinsically safe.

## When to reopen the architecture

Do **not** reopen this design simply because a new provider feature exists. Re-evaluate when evidence shows one of these conditions:

- local-runner availability repeatedly blocks merges;
- CI queue contention becomes materially disruptive;
- the suite adopts one platform-pinned visual/pixel baseline that the current ARM64 runner cannot authoritatively own;
- CI volume grows enough that a dedicated/ephemeral x86 runner has a clear operational advantage;
- Vercel Build Compute remains a material cost after browser offload;
- the project intentionally moves to an immutable build-once/test/promote release model;
- current Cloudflare/Vercel/GitHub capabilities or pricing materially change the tradeoff.

When that happens, re-check current first-party provider evidence. Do not treat 2026-08-29 free-tier limits, pricing, machine classes, or Browser Rendering quotas as timeless facts.

## Final mental model

```text
GitHub decides whether code is allowed to merge.
The self-hosted runner proves the code/build/browser behavior.
Vercel publishes the accepted website.
Cloudflare watches the published website.
The research/GPU server stays out of this loop.
```

The deepest lesson from the conversation is not “Mac good, Vercel bad, Cloudflare good.” It is: **measure first, give each system one clear responsibility, keep uncertainty fail-closed, and only add architecture when the evidence shows the simpler boundary is insufficient.**
