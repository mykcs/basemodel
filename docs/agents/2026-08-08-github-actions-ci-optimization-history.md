# 2026-08-08 GitHub Actions CI optimization and hardening history

## Purpose

This file records the CI optimization work that preceded the Cloudflare Pages migration. It belongs with the migration retrospective because the Actions design, the optimization experiments, and the eventual quota incident directly shaped the final GitHub + Cloudflare architecture.

Read with:

- `dual-hosting-policy.md`
- `cloudflare-pages-deployment.md`
- `2026-08-09-cloudflare-migration-retrospective.md`

---

## Starting problem

`Validate Atlas` was originally a single long GitHub Actions job that serialized almost everything:

```text
checkout
setup Node
npm ci
astro/type check
data validation
semantic audit
claims audit
vendor catalog network audit
unit tests
Astro build
Playwright browser/system-dependency install
Chromium + WebKit E2E
```

Playwright's `webServer.command` also ran another `npm run build`, so the same E2E path built the site twice.

The result was high wall-clock latency and unnecessary runner usage.

---

## PR #11 — safe CI parallelization

PR #11, `Optimize CI validation safely`, was merged as commit:

```text
f26b8a16cc04bf47fa8ed0bc8fb36554ed09dc23
```

Main changes:

- split validation into parallel `static` and `e2e` jobs;
- cache Playwright browser binaries using a lockfile-derived cache key;
- remove the external-network `audit:vendor-catalogs` from normal PR/main validation;
- keep vendor catalog checking in scheduled trusted data-health workflows;
- build Astro once before E2E;
- change Playwright `webServer.command` to preview the existing build instead of rebuilding it;
- keep `push: main` validation rather than weakening main coverage;
- keep `contents: read` permissions;
- keep `pull_request`, not `pull_request_target`.

### Security reason for moving vendor catalog audit

The audit fetches repository-controlled official catalog URLs over the network. Running such behavior against untrusted PR code expands the outbound-request attack surface and adds third-party latency/flakiness to routine CI.

The safer boundary was:

```text
normal PR/main deterministic validation
        -> no vendor network audit
scheduled trusted-branch data health
        -> vendor network audit
```

This separation later became the model used for Cloudflare deployment-blocking checks as well.

### Playwright worker experiment that failed to help

A CI experiment forced two Playwright workers. WebKit became flaky/retried and wall-clock time did not improve materially, so the change was reverted.

Lesson: more parallelism is not automatically faster or cheaper when browser/system startup dominates and tests contend for resources.

### Remaining bottleneck after PR #11

Even with Playwright browser binaries cached, WebKit still needed `playwright install --with-deps`, which installed a large set of Ubuntu system packages on fresh GitHub-hosted runners.

Browser cache does not cache apt/system packages. This remained the largest E2E startup cost.

Potential future alternatives were documented but intentionally not rushed:

- official Playwright container matching package version;
- sharing a build artifact across browser jobs;
- Chromium on every PR and WebKit on main/schedule for lower cost, with an explicit coverage tradeoff.

---

## PR #13 — Node runtime warning and immutable Action pinning

PR #13, `Harden GitHub Actions runtimes and pin dependencies`, was merged as:

```text
b6f805da750ce43cf8d63b353c2ac59c69466de7
```

The hosted runner had started warning that Actions declaring Node.js 20 were being forced onto Node.js 24.

The repository was hardened by moving affected actions to current Node-24-compatible releases and pinning **every third-party Action to a full immutable commit SHA** while retaining a readable version comment.

At that time the pinned set included:

```text
actions/checkout       v7.0.1
actions/setup-node     v7.0.0
actions/cache          v5.0.5
actions/upload-artifact v7.0.0
withastro/action       v6.1.1
actions/deploy-pages   v5.0.0
```

Important separation:

- GitHub Action implementation runtimes moved to Node 24-compatible releases.
- The project/test runtime intentionally stayed Node 22.

Do not conflate Action implementation runtime upgrades with application runtime upgrades.

Validation on PR #13 showed static, Chromium, and WebKit all green and the old Node-20 warning absent.

---

## Further hardening before the quota incident

Later CI work culminated in PR #24, `ci: close remaining validation and deploy gaps`, merged as:

```text
c3c78ea661431d00e8ae399d9a57f32c08ff618d
```

Key improvements:

- rename-safe change classification using `git diff --name-only --no-renames -z`;
- stable `Validation gate` job to aggregate classifier/static/tier outcomes;
- static checks run in parallel with classification;
- freshness audit made blocking;
- concurrency isolated by event type;
- manual GitHub Pages deployment bypass removed;
- Pages deploy allowed only after successful same-repository `main` push validation;
- exact `@playwright/test` version pin and runtime/container version agreement checks;
- vendor catalog audit gained summaries/artifacts and catastrophic-failure handling;
- weekly Dependabot monitoring for npm and GitHub Actions;
- README updated to describe the actual validation/deploy architecture.

### Rename-classification bug and probe

A subtle classifier bug existed because normal Git rename detection can report only the new path. A dangerous code/config file renamed into `docs/` could therefore look like a docs-only change.

Independent Git tests proved that `--no-renames -z` exposes both old and new names, allowing the classifier to choose the correct full validation tier.

Temporary probe PRs were used and closed without merge:

- data-only probe;
- docs-only probe;
- rename-to-docs probe;
- pure hosted-runner `echo` probe on Ubuntu 22.04 and 24.04.

The probe strategy was useful because it isolated classifier behavior from application behavior.

---

## Hosted-runner failure appears

During the final hardening phase, every private-repository GitHub-hosted job began failing before step 1, including trivial echo probes on multiple Ubuntu images.

Because:

- the same workflow family had recently passed;
- the failures occurred before repository commands ran;
- multiple runner images failed identically;
- GitHub public status showed Actions operational;

this was correctly treated as an account/repository startup-layer problem rather than a YAML/test failure.

Later Billing inspection identified the decisive root cause:

```text
GitHub Pro Actions minutes: 3,000 / 3,000 used
```

This led directly to the Cloudflare architecture documented in the migration retrospective.

---

## What was successful

### Parallelize independent work, not everything

Splitting static and browser jobs reduced wall-clock latency while preserving independent failure signals.

### Remove duplicate work

Building once and previewing the built artifact removed an unnecessary second Astro build.

### Cache what is actually cacheable

Playwright browser binaries benefited from cache. System packages did not; treating those as different cost classes avoided false expectations.

### Separate deterministic checks from external-network checks

This improved both reliability and security and was later reused in Cloudflare deployment design.

### Pin supply-chain dependencies immutably

Full Action SHAs prevent mutable major tags from silently changing executed CI code. Dependabot should be used to keep those pins maintainable.

### Fail closed for the secondary GitHub Pages path

Removing the manual Pages bypass meant unavailable validation could not silently publish an unvalidated GitHub Pages build.

### Diagnose infrastructure separately from application logic

The zero-step pattern, cross-image echo probes, and billing evidence prevented unnecessary application changes.

---

## What did not work or had tradeoffs

### More Playwright workers

Two workers did not improve the real bottleneck and made WebKit less stable. Reverted.

### Browser cache as a complete fix

It helped downloaded browser binaries but did not remove fresh-runner apt/system dependency installation.

### Parallel browser jobs and runner-minute cost

Separate Chromium/WebKit jobs improve elapsed time but duplicate checkout, Node setup, `npm ci`, and build work. Wall-clock optimization and billed runner-minute optimization are not the same objective.

### Continuing to probe after account-layer evidence

Once the quota root cause was confirmed, additional GitHub-hosted probes would only create noise. The correct response became architectural decoupling, not more Actions retries.

---

## Current responsibility split after Cloudflare migration

### Cloudflare deployment path

Runs deterministic deployment-blocking checks and Astro build on every meaningful deployment:

```text
check
validate
audit:semantic
audit:claims
audit:freshness
unit tests
build
```

### GitHub Actions when capacity exists

Best used for deeper or externally dependent assurance:

```text
Chromium/WebKit E2E
vendor catalog audit
URL/source-health audit
artifact-heavy diagnostics
GitHub Pages deployment
```

This keeps production deployability independent from the limited GitHub-hosted runner allowance.

---

## Rules for future CI optimization

1. Decide whether the goal is lower wall-clock latency, lower runner minutes, or stronger coverage; they are not always aligned.
2. Measure the actual bottleneck before adding parallelism.
3. Keep external-network audits out of hot deployment paths unless their availability is intentionally part of the release contract.
4. Pin GitHub Actions to immutable SHAs and maintain pins with Dependabot.
5. Keep workflow permissions minimal and avoid `pull_request_target` for untrusted build/test execution.
6. Do not weaken the GitHub Pages validation gate merely because Cloudflare is available.
7. Do not make Cloudflare production depend on GitHub Actions capacity.
8. When Actions quota is scarce, remember that Copilot code review on private repositories also consumes Actions minutes.
9. Avoid repeated/no-op commits: Cloudflare Pages builds on normal branch pushes too.
10. Re-check GitHub/Cloudflare runtime and pricing documentation before making time-sensitive optimization decisions.

---

## Historical references

- PR #11 — `Optimize CI validation safely`
- merge `f26b8a16cc04bf47fa8ed0bc8fb36554ed09dc23`
- PR #13 — `Harden GitHub Actions runtimes and pin dependencies`
- merge `b6f805da750ce43cf8d63b353c2ac59c69466de7`
- PR #24 — `ci: close remaining validation and deploy gaps`
- merge `c3c78ea661431d00e8ae399d9a57f32c08ff618d`

These are historical evidence, not configuration constants. Always inspect current workflow files before making changes.
