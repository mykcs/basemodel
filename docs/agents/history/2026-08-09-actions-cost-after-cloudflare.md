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

Pull requests and `main` pushes that GitHub can verify came from an already-merged pull request classify their changed path range with the same conservative rules:

```text
README.md or docs/** only
-> docs
-> static checks only

src/content/models/*.json or src/content/papers/*.json, with no code/config changes
-> data
-> static checks + 7 Chromium smoke tests

any code, config, workflow, dependency, test, rename-sensitive, or otherwise unclassified change
-> full
-> static checks + full Chromium + WebKit E2E
```

Manual `workflow_dispatch` and weekly scheduled validation continue to default to `full` cross-browser coverage.

The classifier remains fail-safe. It keeps the default `full` tier instead of guessing when any of the following is true:

- a push has an all-zero/unavailable `before` SHA;
- the change range cannot be resolved;
- a `main` push cannot be associated with an already-merged PR targeting `main`;
- the GitHub API call used to verify that PR association fails or returns an unexpected result.

The merged-PR check uses GitHub's read-only `List pull requests associated with a commit` endpoint and grants only `pull-requests: read` to the classifier job. It does not grant write access.

This direct-push fallback matters because the repository still has no server-side `main` ruleset. With `cancel-in-progress: true`, a newer docs-only direct push could otherwise cancel an older code-bearing main run and then validate the newest tree at the cheaper docs tier. Forcing every direct or unverifiable main push back to `full` closes that CI fail-open path while preserving the savings for the intended PR-based workflow.

A minimal GitHub `main` ruleset requiring pull requests is still recommended because only a repository rule can prevent direct pushes from landing at all. The workflow fallback makes CI safe when that account-level rule is absent; it is not a substitute for source-control enforcement.

Rename safety remains preserved with:

```text
git diff --name-only --no-renames -z
```

so moving a code/config file into a docs path cannot hide the original path and incorrectly downgrade validation.

## Why this does not weaken code-change coverage

This optimization does **not** make code/config changes cheaper.

A code/config PR is still `full`; the matching verified PR merge to `main` remains `full` because the pushed range also contains code/config paths. The savings come from avoiding full cross-browser reruns for changes whose own classifier already says they are docs-only or data-only.

A direct or unverifiable push to `main` is deliberately more expensive: it is always `full`, regardless of its apparent changed paths.

The weekly scheduled full regression remains a backstop for browser coverage across the whole site.

## Dual-base browser coverage without a third runner

The public hosts intentionally use different base paths:

```text
Cloudflare Pages -> /
GitHub Pages      -> /basemodel/
```

The normal Playwright suite continues to run against `/basemodel/`, which exercises the more failure-prone nested deployment base and preserves existing GitHub Pages coverage.

For `full` validation, the Chromium matrix job now performs one additional build with `PUBLIC_BASE_PATH=/` after its normal suite finishes, then runs two dedicated `cloudflare-root.spec.ts` smoke tests against `PLAYWRIGHT_BASE_PATH=/`. Those tests cover the bilingual command-search route and BibTeX URL generation, both of which previously exposed real base-path bugs.

The root smoke reuses the already-running Chromium job/container and browser installation. WebKit does not repeat it, and data/docs tiers do not run it. This closes the root-base browser gap without adding a third runner to every full validation.

## Relationship to Cloudflare

Cloudflare remains responsible for deployment-blocking deterministic checks and Astro build on meaningful site deployments.

GitHub Actions remains the secondary/deeper assurance layer when hosted-runner allowance is available. GitHub Pages remains fail-closed behind a successful `Validation gate`, but that gate now enforces the selected tier for a verified PR merge and falls back to `full` for direct/unverifiable main pushes.

Cloudflare Preview builds still do not run Playwright browsers themselves. They validate the application/test/build surface and repository contracts; the root browser smoke executes in the full GitHub Actions Chromium job when hosted-runner allowance is available.

This preserves the dual-hosting contract while reducing the chance that GitHub Actions minutes are exhausted again by routine data/documentation maintenance.

## Verification constraints during the 2026-08-09 change

The account's included GitHub Actions minutes were still exhausted when this workflow change was authored. Therefore a hosted runner could not execute the new workflow end-to-end.

Agents must distinguish two kinds of validation:

1. GitHub accepting/creating the workflow for the PR proves the YAML/workflow definition is parseable enough to be registered.
2. Only an actual future runner execution proves the event-specific classifier/API/gate and browser-smoke behavior on GitHub infrastructure.

Do not claim a zero-step quota failure is application, classifier, or browser evidence.

When Actions capacity returns, inspect the first verified PR merge and the first direct/unverifiable main push (if one ever occurs) to confirm the intended `docs/data/full` versus forced-`full` behavior. For the first `full` run, also confirm the Chromium job completes both the normal `/basemodel/` suite and the two Cloudflare-root smoke tests. Do not intentionally direct-push solely to test the guard if a ruleset has already been enabled.

## Cost principle

The final principle is:

```text
Cloudflare -> deployment availability and deterministic validation
GitHub Actions PR -> change-proportional browser assurance
GitHub Actions verified PR merge to main -> change-proportional browser assurance
GitHub Actions direct/unverifiable main push -> full browser assurance
GitHub Actions full Chromium -> normal suite + 2 root-base smoke tests on the same runner
GitHub Actions schedule/manual -> full cross-browser regression
GitHub Pages -> secondary public mirror after the selected main validation gate
```

This optimizes billed runner minutes without allowing an unverified direct-main path to downgrade validation and without leaving the Cloudflare root deployment completely outside browser coverage.
