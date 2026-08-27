# 2026-08-27 Vercel browser-gate performance and Lab flaky retrospective

Status: **historical rationale / reusable incident evidence**  
Date: **2026-08-27**  
Primary change: PR #281 (`perf(vercel): stabilize Lab gate and cache hosted Chromium`)  
Production merge: `add3a34076d08019144566fb4963e56df6e81a98`

This document records the friction and the successful engineering patterns from the Vercel Pro/browser-gate optimization work. It is not current policy by itself. Current executable source and `docs/agents/current/*` win when they differ from this retrospective.

## Why this case is worth keeping

The work started as a simple performance question: after moving to a stronger Vercel plan/build machine, could the website validation pipeline become faster and less flaky?

The useful answer was not “increase everything.” The work exposed three different classes of problem that had to be separated:

```text
Lab test flakiness
!= Chromium installation overhead
!= Playwright worker-count tuning
```

Treating them as one generic “Vercel is slow” problem would have produced weaker fixes.

The final result was:

- the Lab race was fixed at its real synchronization boundary and retries were removed;
- hosted Chromium was moved to a cacheable hermetic location and reduced to the headless shell needed by CI;
- 6 and 8 workers were measured instead of assumed to be faster, and both were rejected;
- the accepted default stayed capped at 4 workers;
- exact-head Preview and Production both passed full browser validation;
- no acceptance threshold, test scope, fail-closed behavior, or `--max-failures=1` protection was weakened.

## 1. Friction: a retry had been hiding a real harness race

### Symptom

The Lab matrix could occasionally fail on a desktop case such as:

```text
/en/lab/ 1440x1000-dark
SVG connector layer is not visible above mobile breakpoint
```

A retry would then pass.

That made the failure look random, but it was not random in the useful sense. It was a deterministic race between two asynchronous milestones.

### Root cause

`ServerExplainer` measures connector geometry after hydration using `requestAnimationFrame` / layout measurement. The old test treated removal of Astro's `ssr` attribute as proof that all derived connector geometry was ready.

The real ordering was:

```text
React island hydrates
-> Astro `ssr` marker disappears
-> one-frame window still exists
-> requestAnimationFrame / ResizeObserver geometry measurement completes
-> `.irx-edge-layer` and connector coordinates become authoritative
```

The old harness could inspect the page inside that window.

### What fixed it

The Lab test was changed to wait on the final product contract rather than an implementation-adjacent proxy:

- after hydration, desktop cases wait for the connector layer to exist and be visible;
- all six expected connector edges must be present;
- after viewport/ResizeObserver changes, geometry is polled until the real attachment contract is satisfied;
- blind fixed sleeps are no longer the acceptance synchronization mechanism;
- `retries` was changed from `1` to `0`.

This matters because a green retry is diagnostic evidence, not stability evidence. Once the race was actually fixed, the gate had to prove it without a retry safety net.

### Reusable rule

For any visual element computed after hydration—SVG connectors, canvas overlays, measured callouts, virtualized layout, ResizeObserver-driven geometry, font-dependent measurement—do not equate:

```text
hydrated
```

with:

```text
all derived geometry is settled
```

Wait on the observable state the product actually promises.

## 2. Friction: changing infrastructure without changing its contract tests atomically

The first optimization commit changed the hosted browser install command from the old form to:

```text
playwright install --only-shell chromium
```

but repository tests still asserted the old exact string:

```text
playwright install chromium
```

The resulting Vercel build failed during `verify:deploy` before the browser experiment even started.

This was not a Vercel failure and not a Playwright failure. It was a repository contract drift introduced by changing the implementation and leaving its owner tests stale.

### Reusable rule

Infrastructure scripts and tests that intentionally lock those scripts are one change unit.

When changing:

- browser install mode;
- cache path;
- worker policy;
- branch routing;
- fail-closed behavior;
- provider command composition;

search for exact-string and structural contract tests before the first provider-triggering push, and update them in the same coherent commit.

Do not “repair” a valid contract test by restoring the obsolete implementation. Update the test only when the intended contract genuinely changed.

## 3. Friction: sequential GitHub writes created avoidable provider churn

During the repair, two policy-test files were updated with sequential Contents API writes. Each ref update could independently trigger Vercel.

This was exactly the kind of provider churn the repository's deployment-budget policy is intended to avoid.

### Reusable rule

When a change is known to require several coordinated files, prefer:

```text
prepare all contents
-> one blob/tree/commit/ref update
-> one provider-triggering head
```

instead of:

```text
file A write -> deployment
file B write -> deployment
file C write -> deployment
```

GitHub state is not a scratchpad. Provider builds are finite and should not be used as an interactive text editor.

## 4. Success: distinguish cold-cache and warm-cache claims

The old browser install path lived under an ephemeral Vercel cache location and did not reliably benefit from the restored project build cache.

The accepted change sets:

```text
PLAYWRIGHT_BROWSERS_PATH=0
```

and installs only:

```text
playwright install --only-shell chromium
```

This puts Playwright's browser under:

```text
node_modules/playwright-core/.local-browsers/
```

which can travel with Vercel's restored build cache.

### What the evidence actually showed

Cold-cache behavior still downloads the required headless shell. In the accepted run, that was roughly 114.7 MiB plus FFmpeg.

Warm-cache behavior reused the restored browser shell and did not re-download Chromium.

The Lab gate later in the same build also reused the browser already present from the UI gate.

### Reusable rule

Do not compress this into “Chromium no longer downloads.” The correct claim is:

```text
cold cache -> one required shell download
warm cache -> restored shell reuse
```

Also keep the `ldd` preflight. Cache success does not prove runtime libraries are resolvable.

## 5. Success: measure worker count instead of mapping CPU count directly to concurrency

It was tempting to assume that a Pro machine with more CPU should run more Playwright workers.

A controlled benchmark disproved that assumption.

On the same ordinary Pro 8-core / 16 GB Preview class and the same 91-test Chromium suite:

| Workers | Result |
|---:|---|
| 4 | prior baseline about 1.6 min |
| 6 | 91 passed; gate measured 137.8 s (~2.3 min) |
| 8 | 91 passed; gate measured 141.7 s (~2.3 min) |

The higher worker counts made CPU-heavy browser cases slower because the browsers contended for CPU and layout/rendering resources.

The temporary benchmark loop was then removed. It was evidence-gathering code, not a permanent production feature.

The retained policy became:

```text
workers = max(1, min(4, floor(visible CPUs / 2)))
```

A later exact-head run on a 30-core / 60 GB Turbo builder still used 4 workers and completed the 91-test UI suite in about 1.3 minutes.

### Reusable rule

More visible CPUs do not imply “use all CPUs for browsers.”

For browser-heavy suites:

- benchmark on the real provider class;
- compare the same source tree and test matrix;
- watch per-test duration, not only worker startup count;
- reject a concurrency increase when total wall time worsens;
- remove benchmark-only branches/loops after the decision;
- do not raise the stable cap without new comparable evidence.

## 6. Success: exact-head Preview evidence before merge, then separate Production evidence

The accepted Preview evidence included:

- full hosted UI matrix: 91/91 passed;
- Lab matrix: 12/12 passed on the first attempt with `retries: 0`;
- deployment reached READY;
- warm-cache reuse was observed on a later Preview.

PR #281 was merged only after the exact head was green.

Production then ran its own full fail-closed matrix because the deployment scripts themselves had changed:

- 91/91 UI tests passed;
- 12/12 Lab tests passed with zero retries;
- Production reached READY;
- the public site returned HTTP 200.

### Reusable rule

Never collapse these into one statement:

```text
Preview passed
```

is not the same evidence as:

```text
merged main Production passed
```

A release closeout for browser/deployment work should preserve this chain:

```text
exact intended head
-> deterministic repository Gate
-> exact-head Preview
-> merge with expected head
-> exact merged main SHA
-> Production browser gate
-> Production READY
-> representative public fetch/interaction
```

## 7. Friction: provider build-machine class can vary

During the work, Vercel logs showed more than one build-machine class, including an 8-core / 16 GB Enhanced machine and a later 30-core / 60 GB Turbo machine.

That means a hard-coded mental model such as “Pro means exactly 8 cores” is unsafe.

### Reusable rule

Use live provider evidence:

- read the build-machine configuration from the exact deployment;
- use `availableParallelism()` or equivalent for runtime policy;
- cap concurrency by measured behavior, not marketing labels;
- state which machine class produced a benchmark.

A plan name is not a reproducible hardware identity.

## 8. Friction: partial logs are not completion evidence

Provider logs were inspected while builds were still running. Early log tails showed only part of the UI matrix or only the first Lab cases.

This is useful for diagnosis, but not for declaring success.

### Reusable rule

When a provider build is in progress:

```text
partial log output = current progress
not final acceptance
```

Do not busy-wait or repeatedly summarize the same incomplete state. Use logs to classify actionable failures; otherwise wait for the authoritative deployment state, then inspect the final tail once.

Related current policy: `docs/agents/current/release-closeout-protocol.md` and `docs/agents/current/deployment-policy.md`.

## 9. Success: optimize without weakening safety

The performance work intentionally preserved:

- Chromium-only hosted Vercel boundary;
- full browser coverage when risk classification requires it;
- `--max-failures=1` fail-fast behavior;
- geometry/overflow/theme thresholds;
- `ldd` runtime dependency preflight;
- exact-head acceptance;
- zero retry for the Lab regression after the race fix.

The speed improvement came from:

```text
fixing false flakiness
+ caching the browser correctly
+ installing only the needed browser shell
+ choosing evidence-backed concurrency
```

not from deleting tests or making assertions easier.

That distinction is the central success pattern from this work.

## 10. A better workflow for future website/browser-gate work

Use this sequence when a website edit exposes flaky browser validation or slow Vercel feedback:

```text
1. classify the problem
   product regression / readiness race / stale contract / provider environment / pure performance

2. inspect executable owners
   page/component + Playwright test + config + Vercel gate + contract tests

3. reproduce the real boundary
   wait for the product condition, not an arbitrary sleep

4. fix correctness before speed
   remove retries that would hide the repaired race

5. batch coordinated source + contract-test changes
   one coherent provider-triggering commit

6. obtain one exact-head Preview
   read final provider state, not only partial logs

7. benchmark one variable at a time
   e.g. 4 vs 6 vs 8 workers on comparable machine/source

8. remove benchmark-only code
   keep only the winning stable rule

9. merge and verify Production independently

10. stop when the measured problem is closed
    do not start another optimization phase without a new measurable bottleneck
```

## 11. Evidence ledger

Key historical evidence from this incident:

- PR: `#281` — `perf(vercel): stabilize Lab gate and cache hosted Chromium`
- accepted branch head before merge: `7426c62abc564567c0d7d2a3f943398c3c1ba455`
- Production merge SHA: `add3a34076d08019144566fb4963e56df6e81a98`
- benchmark Preview: `dpl_52au4LyTV7QMg5XWnpZDewPz6S5j`
  - 6 workers: 137.8 s measured by gate
  - 8 workers: 141.7 s measured by gate
  - Lab: 12/12 first-attempt PASS
- final Preview: `dpl_E25RWDSBxmEzpw5Y9J9b4Tk8Sj6r`
  - build cache restored from the accepted prior deployment
  - 91/91 UI PASS at 4 workers
  - 12/12 Lab PASS, zero retries
- Production: `dpl_FSnVX2aa4UPpKBL67m48u8zyQbri`
  - 91/91 UI PASS
  - 12/12 Lab PASS, zero retries
  - READY
  - public site HTTP 200

Treat deployment IDs and timings as historical evidence, not permanent expectations. Current provider class, source tree, Playwright version, test count, and Vercel behavior can change.

## 12. Where current policy lives

Use this retrospective for rationale and failure-pattern recognition. For current instructions, read:

- `docs/agents/current/website-engineering-standard.md`
- `docs/agents/current/ui-change-visual-acceptance-gate.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/release-closeout-protocol.md`
- `scripts/vercel-ui-gate.mjs`
- `scripts/vercel-lab-browser-gate.mjs`
- `playwright.config.ts`
- `tests/e2e/lab-playwright.config.ts`
- `tests/e2e/lab-server-visual-qa.spec.ts`

The durable lesson is simple: **make browser readiness observable, make provider work cacheable, benchmark concurrency, keep acceptance exact, and never trade correctness for a green badge.**
