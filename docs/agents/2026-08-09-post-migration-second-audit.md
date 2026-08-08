# Post-migration second audit: Copilot, Dependabot, and steady-state cost controls

Last reviewed: 2026-08-09

## Purpose

This document records the second full audit performed after the GitHub + Cloudflare dual-host migration had already been accepted and hardened.

Read this together with:

- `dual-hosting-policy.md`
- `cloudflare-pages-deployment.md`
- `2026-08-08-github-actions-ci-optimization-history.md`
- `2026-08-09-cloudflare-migration-retrospective.md`

This follow-up exists because several important facts only became visible after the system ran for real: the actual Copilot Code review settings, Copilot billing behavior, Dependabot grouping behavior, repeated Cloudflare builds caused by long-lived Dependabot branches, and runtime/type-version drift.

---

## Repository Copilot Code review state observed in the UI

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

The key fact is **No rulesets**.

There is therefore no repository-level ruleset enabling:

```text
Automatically request Copilot code review
```

and no repository-level `Review new pushes` setting is currently active.

GitHub's current documentation says automatic review for a single repository is configured by creating a branch ruleset and enabling `Automatically request Copilot code review`. Only after that rule is enabled does the optional `Review new pushes` setting exist. If `Review new pushes` is not selected, Copilot reviews the PR only once.

Official reference:

- https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review

### Correction to an earlier troubleshooting assumption

An earlier troubleshooting step suggested looking for `Review new pushes` in repository Rulesets. That was incomplete for this repository because the repository has no rulesets at all.

Future agents must first establish whether a Copilot automation ruleset exists before telling the owner to change `Review new pushes`.

---

## Why Copilot still attempted to review PR #38

PR #38 received a Copilot code review attempt even though the repository had no automatic-review ruleset. The attempt reported that the requester had reached their quota limit.

GitHub documents a separate **user-level** setting:

```text
Profile picture
-> Copilot settings
-> Automatic Copilot code review
```

Because repository-level automation is absent, this personal setting is the strongest explanation for an automatically requested review on a PR created by the owner.

This remains an inference until the account-level setting is inspected. If the personal setting is already disabled, then the review must have been manually requested or triggered by another account-level mechanism.

Recommended steady-state while Actions allowance matters:

```text
Personal Automatic Copilot code review: Disabled
Repository automatic-review ruleset: Do not create merely for convenience
Manual Copilot review: Request only when the expected review value justifies the cost
```

If the owner later deliberately wants one automatic review per PR, create a repository ruleset with:

```text
Automatically request Copilot code review: enabled
Review new pushes: disabled
Review draft pull requests: disabled unless deliberately needed
```

---

## Copilot code review consumes Actions minutes on private repositories

The audit rechecked current GitHub documentation rather than relying on memory.

Copilot code review has two cost dimensions:

1. AI/model use consumes AI credits;
2. agentic review infrastructure consumes GitHub Actions minutes.

For private repositories, those Actions minutes are deducted from the repository owner's Actions entitlement, and excess usage is billed at normal Actions rates when paid usage is enabled.

Official references:

- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners

This matters directly because the Cloudflare migration was triggered by exhausting the included GitHub Actions allowance.

### Review effort naming

The actual repository UI screenshot displayed `Lite`. Current public GitHub documentation describes `Low` and `Medium` and states that Medium uses more Actions minutes and AI credits.

Do not invent a mapping if the UI and docs use different labels during a rollout. Treat the owner's actual UI as authoritative and avoid increasing review effort while cost is a constraint.

---

## Dependabot grouping worked

PR #38 introduced conservative npm grouping:

- development dependency minor + patch updates are grouped;
- production dependency patch updates are grouped;
- higher-risk updates stay separate.

The behavior was immediately verified in practice. PR #39 grouped `@astrojs/check` and `tsx` into a single development-dependency PR. Cloudflare Preview completed successfully, so PR #39 was squash-merged as commit `98ad8fb`.

Desired low-risk maintenance path:

```text
Dependabot grouped PR
-> Cloudflare Preview
-> repository checks + audits + Vitest + Astro build
-> merge when green and scope is low risk
```

Official references:

- https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference
- https://docs.github.com/en/enterprise-cloud@latest/code-security/tutorials/secure-your-dependencies/optimizing-pr-creation-version-updates

---

## Hidden runtime drift: @types/node 22 -> 26

Current runtime contract:

```text
.node-version = 22.16.0
Cloudflare runtime = pinned from .node-version
GitHub application/test runtime = Node 22 line
package.json @types/node = ^22.0.0
```

Dependabot PR #31 proposed:

```text
@types/node 22.20.1 -> 26.1.2
```

That is not routine maintenance. It changes the modeled Node API surface several major versions ahead of the runtime the project actually executes.

The PR was closed intentionally.

Policy:

- allow Node 22 `@types/node` minor/patch maintenance;
- ignore `@types/node` SemVer-major **version-update** PRs while runtime remains Node 22;
- do not suppress security updates with this rule;
- upgrade `.node-version`, GitHub/Cloudflare runtime expectations, `@types/node`, lockfile, and Agent docs together in a dedicated runtime migration PR.

A Vitest regression now checks that:

```text
.node-version major
== package.json @types/node major
== package-lock.json @types/node major
```

Official Dependabot control reference:

- https://docs.github.com/en/enterprise-cloud@latest/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/controlling-dependencies-updated

---

## Hidden Cloudflare cost: long-lived Dependabot PR rebases

A second issue appeared after PR #39 changed `main`.

Existing Dependabot major PRs automatically rebased against the new `main`. Those branch pushes triggered fresh Cloudflare Preview builds even though the upgrades were not ready to merge.

PR #40 (Vitest major) visibly entered a new Cloudflare build after the unrelated `main` update. The same mechanism can affect every long-lived Dependabot branch.

On Cloudflare Pages Free, current documented limits are:

```text
500 builds per month
1 concurrent build
20 minute build timeout
```

Therefore long-lived automated PRs can both consume monthly build count and occupy the only build slot, delaying real feature/bugfix previews.

This changed the major-upgrade policy.

### PR #31: @types/node 22 -> 26

Closed. Future Node-major work must be a dedicated runtime migration.

### PR #33: TypeScript 5 -> 7

Closed. TypeScript major upgrades change compiler behavior and should be initiated deliberately when there is time to review the migration, not kept as a permanently rebasing Dependabot branch.

### PR #40: Vitest 3 -> 4

Closed. Vitest is part of the validation toolchain itself; its major migration should receive explicit release-note review and a dedicated green validation PR.

### Dependabot steady-state change

Routine **version-update** major PRs are ignored for:

```text
@types/node
typescript
vitest
```

When an upgrade is desired, remove the relevant ignore rule in the same dedicated migration PR.

This does not turn off Dependabot security updates.

GitHub officially supports dependency-specific `ignore` rules with `version-update:semver-major`.

### PR #29 and #30: GitHub Action patch releases

These remain separate intentionally. The repository pins third-party Actions to immutable SHAs, and the GitHub Actions runner allowance is currently exhausted, so Action implementation changes should not be merged merely to reduce PR count.

After Actions capacity returns, review their upstream release changes and exercise the workflows before/after merging.

---

## Cloudflare limits rechecked

As of this audit, Cloudflare's official Pages limits document states for Free:

```text
500 Pages builds per month
1 concurrent Pages build
20 minute build timeout
20,000 files per site
100 Pages projects per account
unlimited active Preview deployments
```

Static asset requests remain free and unlimited when Pages Functions are not invoked.

Official references:

- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/

Cloudflare also documents build caching, but caching improves build time rather than the 500-build count. The primary cost-control mechanism for this repository is still reducing unnecessary builds.

---

## Cost-control rules after the second audit

Future agents must:

1. Batch related edits into as few meaningful commits as practical.
2. Use Cloudflare's documented skip-build commit marker only for changes that cannot affect the deployed site and only when a missing deployment status cannot violate branch policy.
3. Prefer grouped Dependabot PRs for low-risk npm minor/patch maintenance.
4. Do not leave unwanted automated major-upgrade PRs open indefinitely; their rebases can consume Cloudflare builds.
5. Treat major runtime/compiler/test-runner changes as dedicated migration work.
6. Keep `@types/node` aligned with the actual Node runtime major.
7. Do not automatically request Copilot review on every private-repository PR while Actions minutes are constrained.
8. Do not enable `Review new pushes` merely for repeated AI feedback; repeated reviews multiply noise and cost.
9. Keep Copilot MCP access off unless a concrete use case justifies extra permissions and a security review.
10. Keep review effort at the lowest practical setting for routine changes.
11. Read the Cloudflare bot PR comment before asking the owner for a dashboard screenshot.

---

## Account-level actions the repository connector cannot perform

The current GitHub connector can modify repository code, branches, PRs, and many repository resources, but it does not expose the owner's personal Copilot settings or arbitrary third-party GitHub App installation controls.

### Recommended: disable personal automatic Copilot review

```text
GitHub profile picture
-> Copilot settings
-> Automatic Copilot code review
-> Disabled
```

This removes automatic private-repo review cost while preserving the ability to request Copilot manually on important PRs.

### Recommended if unused: remove/restrict ECC Tools

During PR #37, `ecc-tools[bot]` repeatedly posted `Upgrade Required` comments without providing private-repository analysis.

If the owner does not use that integration:

```text
GitHub account Settings
-> Applications
-> Installed GitHub Apps
-> ECC Tools
-> Configure
-> remove basemodel access or uninstall
```

Do not remove an integration automatically without owner intent.

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

Source control remains GitHub. Cloudflare remains independently deployable when GitHub-hosted Actions minutes are exhausted. GitHub Pages remains the second public endpoint. Low-risk dependency maintenance is grouped; unwanted major automation PRs are suppressed; major upgrades are explicit migrations.
