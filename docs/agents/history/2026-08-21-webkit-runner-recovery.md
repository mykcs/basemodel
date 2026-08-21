# WebKit runner recovery — zero-step CI diagnosis and production fallback

Date: 2026-08-21
Status: historical incident / reusable browser-validation evidence

## Why this document exists

During the CSS architecture Phase 2–5 closeout, the UI policy correctly required real WebKit evidence because Header/Nav ownership and cascade responsibility had changed. Chromium on the exact Vercel Preview passed, but WebKit initially did not execute.

The important lesson was that **“WebKit did not run” is not one failure mode**. Runner allocation, operating-system compatibility, browser installation, test-harness execution and application assertions are separate layers. Treating all of them as “the WebKit test failed” wastes time and can lead to false release claims.

This incident established a reusable diagnosis sequence and a safe emergency fallback for an already-public production site.

## Incident summary

The accepted CSS ownership work was released through PR #173. Its exact-head Vercel Chromium matrix passed, but the requested cross-browser WebKit proof was missing at merge time.

Three execution surfaces were investigated.

### 1. Vercel hosted build: wrong operating-system boundary for Playwright WebKit

The Vercel build environment used Amazon Linux 2023. The repository had already proven that its hosted Chromium setup works there, but Playwright's Linux WebKit binaries target supported Ubuntu/Debian environments and depend on distro/version-specific GTK, GStreamer, ICU and related libraries.

Attempting to force Ubuntu-oriented WebKit binaries into Amazon Linux with compatibility shims made the gate fragile and was rejected as the wrong architecture.

Durable rule:

> Vercel remains Chromium-only. Do not turn the deployment environment into a cross-distro WebKit compatibility project.

### 2. Private-repository GitHub Actions: job existed, but no runner ever started

A temporary workflow was added to the `basemodel` feature branch using `ubuntu-24.04` and Playwright 1.62.1.

GitHub accepted the workflow and created the job, but the job completed with:

- zero executed steps;
- no checkout;
- no Playwright install;
- no WebKit launch;
- no downloadable job log.

The same job was re-run later and again completed with zero steps and no log.

Relevant evidence:

- temporary runner commit: `4049792e8bb075cf513eea0c344a32d0ab040237`;
- workflow run: `32409947155`;
- original job: `96557779243`;
- re-run job: `96671839031`.

The repository already contained historical evidence that the account's included GitHub Actions minutes had been exhausted. That history, combined with repeated zero-step behavior, supports classifying this as a **hosted-runner allocation/quota boundary**, not a WebKit/application failure.

Durable rule:

> A workflow record proves only that GitHub accepted the workflow. A job with zero steps and no log is not browser evidence and must never be reported as a WebKit failure or PASS.

### 3. Current Debian execution environment: supported OS, blocked browser download

The active execution environment was Debian 13, which is a supported Playwright WebKit target. Playwright resolved the correct WebKit build, but the browser cache was empty and the environment could not download the runtime because outbound DNS/CDN access was isolated (`EAI_AGAIN`).

This was therefore a network/bootstrap limitation, not a WebKit compatibility problem.

Durable rule:

> Distinguish “OS unsupported” from “OS supported but browser runtime unavailable.” The remediation is different.

## The recovery path that actually worked

A one-off black-box harness was created in the existing public repository `mykcs/colab-web`.

Why this was safe for this incident:

- it copied **no `basemodel` private source**;
- it used no private repository token or secret;
- it accessed only the already-public production URL;
- it existed solely to execute a real supported Ubuntu WebKit browser against public pages;
- the PR was never merged;
- after the successful run, the temporary branch was reset to the public repository's original `main`, leaving no workflow diff.

This was an emergency validation harness, **not a new CI architecture and not a recommended recurring cost-avoidance mechanism**.

### First public-runner attempt

Run `32448960790` successfully:

- allocated GitHub-hosted Ubuntu 24.04.4;
- installed Playwright 1.62.1;
- installed and launched WebKit 26.5 / Playwright WebKit revision 2336.

It then failed before browser assertions because the temporary Node script mixed CommonJS `require()` with top-level `await`, producing `ERR_AMBIGUOUS_MODULE_SYNTAX`.

This was a **test-harness bug**, not a site/WebKit failure.

The harness was fixed by running the async browser logic inside an explicit async function.

### Successful public-runner attempt

Workflow run:

- `https://github.com/mykcs/colab-web/actions/runs/32449067650`
- job: `96673964935`
- runner: GitHub-hosted Ubuntu 24.04.4
- Playwright: 1.62.1
- WebKit: 26.5 (`webkit v2336`)
- target: `https://basemodel-preview.vercel.app`
- conclusion: **PASS**

The harness executed 36 route × viewport × theme checks:

- 6 routes;
- 3 viewports: 390×844, 768×1024, 1440×1000;
- 2 themes: light and dark.

Routes covered:

- `/`;
- `/landscape/`;
- `/research/seed-openevo/`;
- `/research/seed-openevo/results/`;
- `/guide/openevo-webshop-alfworld/`;
- `/en/research/seed-openevo/results/`.

Additional WebKit assertions passed for:

- global Header existence and visibility;
- page HTTP success;
- expected light/dark theme initialization;
- document-level horizontal overflow;
- basic audited-item geometry;
- mobile menu open and Escape-close in light and dark themes;
- desktop navigation visibility;
- resource-menu opening in light and dark themes;
- hydrated light → dark → light theme switching.

The temporary public PR was closed without merge. Its branch was reset to the original public-repository `main`; the final compare was `identical`, ahead 0 / behind 0. The successful Actions run remains as immutable external evidence.

## Evidence boundary: what this PASS does and does not prove

This distinction is mandatory.

The successful run proves:

> The public BaseModel production site served at the test time behaved correctly under real Playwright WebKit 26.5 for the covered routes, widths, themes and interactions.

It does **not** retroactively prove:

> PR #173's original exact Preview head executed the repository's complete `npm run test:ui:all` suite before merge.

The public harness tested a live production URL rather than checking out the private repository and running its exact test suite. It also did not pin the public URL to a commit inside the harness itself.

Therefore future reports must label this evidence as **post-release production WebKit black-box acceptance**, not exact-head pre-merge WebKit evidence.

A later production build may contain additional commits while still containing the earlier CSS work through ancestry. That can demonstrate current compatibility, but it cannot be used to rewrite history about which exact head was tested before release.

## Reusable diagnosis ladder

When a required browser check does not run, diagnose in this order:

```text
workflow registered?
-> job object created?
-> runner allocated / “Set up job” started?
-> checkout started?
-> dependencies installed?
-> browser runtime downloaded?
-> browser launched?
-> test harness started?
-> first application/browser assertion reached?
```

Classification rules:

| Observed state | Classification | What it proves |
|---|---|---|
| no workflow run | trigger/workflow registration problem | nothing about browser/app |
| job exists, zero steps, no log | runner allocation/quota/platform boundary | nothing about browser/app |
| setup starts, browser install fails | environment/network/dependency failure | runner works; browser not proven |
| browser installs, harness crashes | test-harness failure | browser bootstrap may be proven; app not proven |
| browser launches, assertion fails | real browser/application evidence | investigate product/test contract |
| browser assertions pass | browser acceptance for the exact tested target/matrix | only the declared target/matrix |

Do not skip levels and do not collapse them into one “CI failed” label.

## Safe fallback hierarchy

For future WebKit-required work, prefer this order:

1. **Supported on-demand runner with the private repo/exact head** — macOS, Ubuntu or Debian; run the repository's own `npm run test:ui:all` or WebKit project. This is the preferred evidence because it can bind source, tests and browser to the same commit.
2. **Another already-authorized private execution surface** with a supported OS and browser download/cache available.
3. **Post-release public black-box WebKit smoke** only when the target is already public and the exact-head path is genuinely unavailable. Clearly label it post-release and narrower than repository-suite evidence.

Do not:

- weaken the UI gate just because a runner is unavailable;
- claim zero-step CI as a browser failure;
- install Ubuntu WebKit fallback binaries into Vercel Amazon Linux with ad-hoc ABI shims;
- copy private source, secrets, Preview credentials or protected deployment material into a public harness;
- institutionalize an unrelated public repository as permanent CI infrastructure;
- claim a production smoke retroactively tested an earlier exact PR head.

## Long-term architecture lesson

The current repository policy intentionally retired ordinary GitHub Actions and keeps Vercel as the deployment authority. This incident does **not** reverse that decision.

The durable requirement is simpler:

> UI changes classified as cross-browser-sensitive need access to at least one Playwright-supported WebKit execution surface that is independent of the Vercel Amazon Linux build.

That execution surface can be an on-demand macOS/Ubuntu/Debian environment outside ordinary deployment CI.

A GitHub self-hosted runner is technically possible, but adopting it would reintroduce a GitHub Actions execution path and therefore counts as an **explicit architecture change**, not an automatic follow-up. Do not add one silently. If the owner later chooses that architecture, scope it narrowly to on-demand browser assurance rather than deployment authority.

## Improvements for the next incident

1. Record the exact failure layer immediately: allocation, install, launch, harness or assertion.
2. If a GitHub job has zero steps, inspect account/repository Actions capacity before changing YAML repeatedly.
3. Keep Vercel Chromium-only unless Vercel's supported build OS changes.
4. Maintain an on-demand supported WebKit execution option outside Vercel.
5. If using a public black-box harness, pin or independently record the production deployment/SHA when exactness matters.
6. Keep black-box test scope explicit: routes, viewports, themes, interactions and browser version.
7. Preserve the difference between pre-merge exact-head evidence and post-release compatibility evidence in every release report.

## Related current policy

Current authority remains:

- `docs/agents/current/ui-change-visual-acceptance-gate.md`;
- `docs/agents/current/deployment-policy.md`;
- `docs/agents/current/release-closeout-protocol.md`;
- `docs/agents/current/hosting-architecture.md`.

This file records the incident and recovery pattern. If current policy changes later, current documents override this historical record.