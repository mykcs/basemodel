# GitHub Actions cost optimization after Cloudflare migration

Last reviewed: 2026-08-09

## Why this follow-up exists

After Cloudflare Pages became the independently deployable primary build/deploy path, a final cost audit found one remaining source of avoidable GitHub Actions usage.

`Validate Atlas` already classified pull requests into three tiers:

```text
docs -> static checks only
data -> static + 7 Chromium smoke tests
full -> static + full Chromium + WebKit E2E
```

However, every `push` to `main` still defaulted to `full`, regardless of what changed.

That meant a README/Agent-doc merge or a model/paper JSON update would repeat the most expensive Chromium + WebKit matrix after merge, and only then allow the secondary GitHub Pages deployment.

This was reasonable before Cloudflare became independently deployable, but became unnecessarily expensive after the final architecture was established.

## New steady-state behavior

Both pull requests and normal pushes to `main` now classify their changed path range with the same conservative rules:

```text
README.md or docs/** only
-> docs
-> static checks only

src/content/models/*.json or src/content/papers/*.json, with no code/config changes
-> data
-> static checks + 7 Chromium data smoke tests

any code, config, workflow, dependency, test, rename-sensitive, or otherwise unclassified change
-> full
-> static checks + full Chromium + WebKit E2E
```

Manual `workflow_dispatch` and weekly scheduled validation continue to default to `full` cross-browser coverage.

The classifier remains fail-safe: if a push has an all-zero/unavailable `before` SHA or the change range cannot be resolved, it keeps the default `full` tier instead of guessing.

Rename safety remains preserved with:

```text
git diff --name-only --no-renames -z
```

so moving a code/config file into a docs path cannot hide the original path and incorrectly downgrade validation.

## Why this does not weaken code-change coverage

This optimization does **not** make code/config changes cheaper.

A code/config PR is still `full`; the matching `main` push remains `full` because the pushed range also contains code/config paths. The savings come from avoiding full cross-browser reruns for changes whose own classifier already says they are docs-only or data-only.

The weekly scheduled full regression remains a backstop for browser coverage across the whole site.

## Relationship to Cloudflare

Cloudflare remains responsible for deployment-blocking deterministic checks and Astro build on meaningful site deployments.

GitHub Actions remains the secondary/deeper assurance layer when hosted-runner allowance is available. GitHub Pages remains fail-closed behind a successful `Validation gate`, but that gate now enforces the selected tier for a main push instead of forcing every push into the most expensive tier.

This preserves the dual-hosting contract while reducing the chance that GitHub Actions minutes are exhausted again by routine data/documentation maintenance.

## Verification constraints during the 2026-08-09 change

The account's included GitHub Actions minutes were still exhausted when this workflow change was authored. Therefore a hosted runner could not execute the new workflow end-to-end.

Agents must distinguish two kinds of validation:

1. GitHub accepting/creating the workflow for the PR proves the YAML/workflow definition is parseable enough to be registered.
2. Only an actual future runner execution proves the event-specific classifier/gate behavior on GitHub infrastructure.

Do not claim a zero-step quota failure is application or classifier evidence.

When Actions capacity returns, the first docs-only, data-only, and code/config PR/main merges should be inspected to confirm the selected tiers match this document.

## Cost principle

The final principle is:

```text
Cloudflare -> deployment availability and deterministic validation
GitHub Actions PR/main -> change-proportional browser assurance
GitHub Actions schedule/manual -> full cross-browser regression
GitHub Pages -> secondary public mirror after the selected main validation gate
```

This optimizes billed runner minutes without removing the full validation path for risky changes.
