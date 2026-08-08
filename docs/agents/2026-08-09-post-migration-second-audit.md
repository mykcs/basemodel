# Post-migration second audit: Copilot, Dependabot, and steady-state cost controls

Last reviewed: 2026-08-09

## Purpose

This document records the second full audit performed after the GitHub + Cloudflare dual-host migration had already been accepted and hardened.

Read this together with:

- `dual-hosting-policy.md`
- `cloudflare-pages-deployment.md`
- `2026-08-08-github-actions-ci-optimization-history.md`
- `2026-08-09-cloudflare-migration-retrospective.md`

This file exists because several important facts were only observable after the migration had been running for real: Copilot review billing behavior, the difference between repository-level and account-level automatic review, Dependabot PR shape after grouping, and runtime/type-version drift.

---

## State observed in the GitHub repository UI

The repository owner provided a screenshot of:

```text
Repository
-> Settings
-> Copilot
-> Code review
```

The visible state was:

```text
Use custom instructions when reviewing pull requests: Off
Allow Copilot to use MCP tools when reviewing pull requests: Off
Review effort level: Lite
Manage Copilot code review automations: No rulesets
```

The most important fact is **No rulesets**.

There is therefore no repository-level ruleset currently enabling:

```text
Automatically request Copilot code review
```

and consequently no repository-level `Review new pushes` option is active.

GitHub's current documentation says automatic review for a single repository is configured by creating a branch ruleset and enabling `Automatically request Copilot code review`. Only after that rule is enabled does the optional `Review new pushes` setting exist. If `Review new pushes` is not selected, Copilot reviews the PR only once rather than after every push.

Official reference:

- https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review

### Correction to an earlier assumption

An earlier troubleshooting step suggested looking for `Review new pushes` in repository Rulesets. That was incomplete for this repository because the repository has **no rulesets at all**.

Future agents must first determine whether a Copilot automation ruleset exists before telling the owner to change `Review new pushes`.

---

## Why Copilot still reviewed a PR without a repository ruleset

PR #38 received a Copilot code review attempt even though the repository UI showed no Copilot review ruleset. The review reported that the requester had reached their quota limit.

Because repository-level automatic review is absent, the strongest remaining explanation is the owner's personal Copilot setting:

```text
Profile picture
-> Copilot settings
-> Automatic Copilot code review
```

GitHub documents a separate user-level option that automatically reviews pull requests created by that user. This is independent of a repository ruleset.

This is an inference from the observed behavior plus the documented configuration model. If the personal setting is already disabled, then the review must have been manually requested or triggered by another account-level integration; do not claim the personal setting is enabled without checking the account UI.

Recommended steady-state for this private repository while Actions allowance matters:

```text
Personal Automatic Copilot code review: Disabled
Repository automatic Copilot review ruleset: Do not create merely for convenience
Manual Copilot review: Request only on PRs where the extra review is worth the cost
```

If the owner later explicitly wants one automatic review per PR, a repository ruleset can be created with:

```text
Automatically request Copilot code review: enabled
Review new pushes: disabled
Review draft pull requests: disabled unless deliberately desired
```

---

## Copilot code review is not free from the Actions budget on private repos

The second audit verified against current GitHub documentation that Copilot code review has two independent cost dimensions:

1. model/token usage consumes AI credits;
2. agentic review infrastructure consumes GitHub Actions minutes.

For private repositories, those Actions minutes are deducted from the repository owner's existing Actions entitlement and excess usage is billed at normal Actions rates if billing is enabled.

Official references:

- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners

This matters directly to this repository because the migration was triggered by exhausting the included GitHub Actions allowance.

### Review effort naming

The repository screenshot showed `Lite` in the actual UI. Current public GitHub documentation describes `Low` and `Medium`, and says Medium uses more Actions minutes and AI credits.

Do not fight the UI wording. Treat the repository's actual displayed value as authoritative for what the owner currently sees, and avoid increasing review effort while Actions cost is a concern.

---

## Dependabot behavior after grouping

The repository previously opened many one-dependency PRs. After PR #38, the npm configuration groups:

- development dependency minor + patch updates;
- production dependency patch updates.

The grouping immediately worked in practice: PR #39 combined `@astrojs/check` and `tsx` into one development-dependency update PR. Cloudflare successfully built the PR Preview, so PR #39 was safely merged.

This is the desired maintenance path for low-risk updates:

```text
Dependabot grouped PR
-> Cloudflare Preview
-> repository checks + Vitest + Astro build
-> merge if green and scope is low risk
```

GitHub's current Dependabot documentation explicitly supports grouping by dependency type and SemVer level.

Official references:

- https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference
- https://docs.github.com/en/enterprise-cloud@latest/code-security/tutorials/secure-your-dependencies/optimizing-pr-creation-version-updates

---

## Hidden runtime drift found: @types/node 22 -> 26

The repository runtime contract is currently:

```text
.node-version = 22.16.0
Cloudflare Pages build runtime = Node 22.16.0 via .node-version
GitHub application/test runtime = Node 22 line
package.json @types/node = ^22.0.0
```

Dependabot PR #31 proposed:

```text
@types/node 22.20.1 -> 26.1.2
```

This is not a routine dependency update. It changes the Node API type surface several majors ahead of the runtime the project actually executes.

Policy after this audit:

- allow Node 22 `@types/node` minor/patch maintenance;
- ignore `@types/node` SemVer-major version-update PRs while the runtime remains Node 22;
- security updates remain separate and must not be suppressed by this version-update rule;
- when the runtime is deliberately upgraded, update `.node-version`, GitHub runtime expectations, Cloudflare support assumptions, `@types/node`, lockfile, and Agent docs together in one migration PR.

GitHub officially supports `ignore.update-types: version-update:semver-major` for this exact class of Dependabot version-update control.

Official reference:

- https://docs.github.com/en/enterprise-cloud@latest/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/controlling-dependencies-updated

A repository regression test also checks that the `.node-version` major, declared `@types/node` major, and lockfile `@types/node` major remain aligned.

---

## Existing major-upgrade PR policy

At the time of this audit the repository had several pre-grouping Dependabot PRs.

### PR #31: @types/node 22 -> 26

Disposition: close after the ignore rule lands. This update conflicts with the current Node 22 runtime contract and should be revisited only as part of a Node runtime migration.

### PR #33: TypeScript 5 -> 7

Disposition: leave as an explicit major-upgrade candidate, not an automatic maintenance merge. A TypeScript major migration can change compiler behavior and should be validated deliberately.

### PR #40: Vitest 3 -> 4

Disposition: leave as an explicit major-upgrade candidate. Even if the existing test suite is green, test-runner major upgrades deserve focused review because they alter the tool that provides validation evidence.

### PR #29 and #30: GitHub Action patch releases

Disposition while hosted Actions allowance is exhausted: do not merge merely to reduce PR count. The repository intentionally pins Action implementations to immutable SHAs, so supply-chain changes should be reviewed deliberately and ideally exercised when Actions capacity is available.

---

## Cloudflare limits rechecked

Cloudflare Pages Free limits were rechecked during this audit rather than relying on migration-era memory.

As of the review date, Cloudflare documents:

```text
500 Pages builds per month
1 concurrent Pages build on Free
20 minute build timeout
20,000 files per site on Free
100 Pages projects per account
unlimited active Preview deployments
```

Static asset requests remain free and unlimited when Pages Functions are not invoked.

Official references:

- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/

The earlier lesson remains important: many small commits can create a build queue and consume the 500-build monthly allowance even when each individual build is free.

---

## Cost-control rules after the second audit

Future agents should follow all of these:

1. Batch related file edits into as few meaningful commits as practical.
2. Use Cloudflare's documented skip-build commit marker only for changes that truly cannot affect the deployed site and only when branch/ruleset policy does not require a Cloudflare status.
3. Prefer grouped Dependabot PRs for low-risk npm minor/patch maintenance.
4. Do not auto-merge major tool/runtime upgrades.
5. Keep `@types/node` aligned with the actual Node runtime major.
6. Do not automatically request Copilot review on every private-repository PR while Actions minutes are a constrained resource.
7. Do not enable `Review new pushes` merely to get repeated AI feedback; repeated reviews multiply both noise and cost.
8. Keep MCP access for Copilot review disabled unless there is a concrete reason and an explicit security review.
9. Keep repository review effort at the lowest practical setting for routine changes; use deeper review only when the expected benefit justifies the additional cost.
10. Read the Cloudflare bot PR comment before asking the owner for a dashboard screenshot.

---

## Account-level actions that repository agents cannot perform through the current connector

The current GitHub connector can modify repository code, branches, PRs, and many repository resources, but it does not expose the owner's personal Copilot settings or arbitrary third-party GitHub App installation controls.

Therefore these remain manual owner actions when desired:

### Disable personal automatic Copilot review

```text
GitHub profile picture
-> Copilot settings
-> Automatic Copilot code review
-> Disabled
```

This is the recommended setting for the current cost-sensitive workflow.

### Remove or restrict ECC Tools if unused

During PR #37, `ecc-tools[bot]` repeatedly posted `Upgrade Required` comments without providing private-repository analysis. If the owner does not use this integration, remove the repository from that GitHub App's access or uninstall the App.

Typical path:

```text
GitHub account Settings
-> Applications
-> Installed GitHub Apps
-> ECC Tools
-> Configure
-> remove basemodel access or uninstall
```

Do not remove unknown integrations automatically without the owner's explicit intent.

---

## Final steady-state workflow after this audit

```text
ChatGPT / coding agent
        |
        v
GitHub branch + PR
        |
        +----------------------+
        |                      |
        v                      v
Cloudflare Preview        optional/manual Copilot review
repo checks + tests       only when worth Actions + AI cost
        |
        v
merge main
        |
        +----------------------+
        |                      |
        v                      v
Cloudflare Production     GitHub Actions deep CI when quota exists
indexed canonical site    Chromium/WebKit/network audits
                               |
                               v
                         GitHub Pages fallback
                         public + noindex
```

Source control remains GitHub. Cloudflare remains independently deployable when GitHub-hosted Actions minutes are exhausted. GitHub Pages remains a second public endpoint. Major dependency/runtime changes remain deliberate migrations rather than unattended maintenance.
