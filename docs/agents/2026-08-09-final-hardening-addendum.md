# Final post-migration hardening addendum

Last reviewed: 2026-08-09

This addendum records the last issues found after the second post-migration audit. It is intentionally concise and should be read after `2026-08-09-post-migration-second-audit.md`.

## 1. Cloudflare PR bot comments are not a monotonic status source

Cloudflare Pages maintains one deployment comment on a pull request and edits it as builds start and finish. When several commits are queued on the Free plan's single build slot, an older build can finish after a newer build has started and overwrite the comment with the older commit's successful result.

Observed on PR #41:

- PR head was `aa60668` and Cloudflare briefly reported that commit as building;
- an earlier `8007f4c` build then completed;
- the same Cloudflare PR comment changed back to `8007f4c` with a green result.

Therefore **never treat the green icon alone as proof for the current PR head**.

Agent verification rule:

```text
1. Read the actual PR head SHA.
2. Read Cloudflare bot comment `Latest commit`.
3. Only claim the current head is Cloudflare-validated when the SHAs match.
4. If they do not match, identify which later commits are deploy-affecting.
5. A later docs/provider-metadata-only commit may be reasoned about separately; do not falsely attribute an older green build to it.
```

This matters especially when `[CF-Pages-Skip]` is used for documentation or provider-only configuration.

## 2. Astro 7 changed inline whitespace behavior

Astro 7 changed the default `compressHTML` value from `true` to `'jsx'`. Under JSX-style whitespace handling, meaningful spaces between adjacent inline elements can disappear even though type checks and builds are green.

Official migration guidance:

- https://docs.astro.build/en/guides/upgrade-to/v7/

The repository intentionally sets:

```js
compressHTML: true
```

to preserve the previous HTML-aware whitespace behavior. A small Vitest regression checks that this compatibility setting remains present.

This is a visual correctness guard, not a performance workaround. If a future agent wants to return to Astro 7's JSX whitespace behavior, visually audit inline text across the site and replace implicit whitespace with explicit spacing before removing the setting.

## 3. Cloudflare Preview URLs are public by default

`noindex` prevents search indexing; it is **not access control**.

Cloudflare documents that Pages Preview deployment URLs are public by default, including hash URLs and branch aliases. For a private GitHub repository, this means unreleased branch output can still be viewed by anyone who obtains a Preview URL.

Official reference:

- https://developers.cloudflare.com/pages/configuration/preview-deployments/

Cloudflare supports protecting Preview deployments with Cloudflare Access:

```text
Cloudflare dashboard
-> Workers & Pages
-> basemodel
-> Settings
-> General
-> Enable access policy
```

That policy protects Preview deployments without protecting the normal production `basemodel.pages.dev` site.

Recommended policy for this repository:

- keep Production public;
- keep Preview `noindex` as a search-engine safeguard;
- additionally enable Preview Access if the owner does not want unreleased branches publicly reachable.

If public shareable previews are intentionally desired, document that decision instead of assuming `noindex` provides confidentiality.

## 4. `main` currently has no repository ruleset

The repository owner showed the Rulesets UI with `You haven't created any rulesets` / `No rulesets`.

That was useful for diagnosing Copilot automatic review, but it also reveals a source-control hardening gap: repository policy is documented as branch + PR, but GitHub is not currently enforcing that policy at the branch-rule layer.

GitHub rulesets can block force pushes/deletions and require changes to arrive through pull requests.

Official references:

- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets

Recommended minimal `main` ruleset for this single-owner/Agent workflow:

```text
Ruleset name: Protect main
Enforcement: Active
Target: Include default branch

Enable:
- Restrict deletions
- Block force pushes
- Require a pull request before merging
- Required approvals: 0
- Require linear history (compatible with the repository's squash-merge practice)

Do NOT enable yet:
- Automatically request Copilot code review
- Review new pushes
- GitHub Actions status checks that cannot run while the account allowance is exhausted
- a required Cloudflare check unless skip-build behavior has been designed around that requirement
```

Why zero approvals: the goal is to prevent accidental direct changes to `main`, not to invent a second human reviewer for a personal repository.

Why no required Cloudflare check yet: Cloudflare explicitly omits a deployment/check when a commit uses `[CF-Pages-Skip]`. Making that check universally required would make intentionally skipped provider/docs-only PRs impossible to merge without another ruleset design.

This ruleset is an account/UI setting and cannot be created by the currently exposed GitHub connector. Future agents should ask for a screenshot after the owner creates it and then update this documentation to record the actual configured state.

## 5. GitHub Actions Dependabot PRs should not consume Cloudflare Pages builds

Dependabot's `commit-message.prefix` affects both commit messages and PR titles. Cloudflare Pages supports skipping builds when a commit message begins with `[CF-Pages-Skip]`.

Official references:

- https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

The repository therefore prefixes the **github-actions ecosystem only** with:

```text
[CF-Pages-Skip] chore(actions)
```

Rationale:

- GitHub Action SHA/version changes affect GitHub CI/GitHub Pages behavior;
- they do not change the static content Cloudflare builds from the repository;
- a Cloudflare Preview cannot validate GitHub Actions runner behavior anyway;
- skipping those Pages builds saves the 500-build monthly allowance and the Free plan's single build slot.

Do not apply the same skip prefix to normal npm dependency updates, because those can affect the code, checks, audits, or generated site and should continue to receive Cloudflare validation.

## 6. Final manual account settings

Repository-side work cannot change the owner's personal Copilot setting or arbitrary third-party GitHub App installations.

Recommended manual state:

```text
GitHub personal Copilot settings
Automatic Copilot code review = Disabled
```

The repository-level Copilot page already shows:

```text
MCP tools = Off
Review effort = Lite
Copilot review rulesets = none
```

Keep those repository settings unless the owner explicitly chooses a different review policy.

If ECC Tools is not intentionally used, remove `basemodel` from that App's repository access or uninstall it; during the migration it repeatedly posted paid-upgrade comments without providing private-repository analysis.

## Final operating model

```text
GitHub remains canonical source
        |
        +--> feature/data/dependency PR
        |      -> Cloudflare Preview
        |      -> deterministic checks + tests + Astro build
        |      -> merge
        |      -> Cloudflare Production
        |
        +--> docs/provider-only change
        |      -> optional [CF-Pages-Skip]
        |
        +--> GitHub Actions dependency PR
               -> [CF-Pages-Skip] automatically
               -> validate with GitHub Actions when allowance is available

GitHub Pages remains public noindex fallback.
Cloudflare Production remains indexed canonical provider identity.
Cloudflare Preview remains noindex and can additionally be protected with Access.
Copilot review is manual/cost-conscious unless owner deliberately changes policy.
```
