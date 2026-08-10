# Web-GPT + GitHub + Cloudflare build-budget workflow

Last reviewed: 2026-08-10
Owner decision: 2026-08-10

## Authority and relationship to existing docs

This file records the owner's latest operating decision for **web-based ChatGPT / coding-agent website work** when Cloudflare Pages Build quota should be conserved.

Read this before starting ordinary website changes. It does **not** replace the project-specific validation, SEO, rollback, or production details in:

- `direct-upload-preview-policy.md`
- `deployment-policy.md`
- `cloudflare-pages-deployment.md`
- `product-and-research-integrity.md`

Where older history says that every PR should receive a Git-integrated Cloudflare Preview, this file is newer and wins for normal day-to-day work.

## Desired operating model

The owner wants all routine work to remain possible from the ChatGPT web experience using connected GitHub / Cloudflare capabilities and an Agent execution environment. The owner should not have to act as a relay between tools.

For this repository the target path is:

```text
ChatGPT web / coding agent
  -> inspect current repo docs + open PRs
  -> edit on one focused branch
  -> Agent-side validation + production build
  -> Wrangler Direct Upload to a unique Pages Preview branch
  -> inspect the public pages.dev Preview
  -> synchronize source to GitHub without a Git-integrated Preview Build
  -> owner accepts
  -> merge to main
  -> one deliberate Cloudflare Production Build
```

"Local build" in this policy means **the coding Agent's execution environment**. It does not require the owner to open a terminal or run commands on their own computer.

## Cloudflare branch-control target

For the Git-integrated `basemodel` Pages project, the preferred steady state is:

- Production branch: `main`.
- Automatic Production branch deployments: **enabled**.
- Automatic Preview branch deployments: **None / disabled**.

Cloudflare documents that `Preview branch = None` disables automatic builds for all preview branches, while Production automatic deployment can remain enabled independently.

This split is the mechanism that makes ordinary PR development use **0 Git-integrated Pages Builds before merge**, while a real release to `main` normally uses **1 Production Build**.

Do not claim the dashboard already has this exact state unless it has been read back from Cloudflare in the current or a sufficiently fresh handoff.

## Mandatory pre-push gate

Before the first ordinary non-skip push for a new feature branch:

1. read this file and the existing Direct Upload policy;
2. inspect relevant open PRs and avoid duplicate/overlapping work;
3. confirm Cloudflare Preview automatic deployment is `None`, if current Cloudflare tooling can read it;
4. if the setting is unknown or cannot be changed from the current environment, do **not** use speculative non-skip push loops;
5. use a Cloudflare-supported skip prefix for Git synchronization until branch control is proven.

Cloudflare currently documents these skip prefixes: `[CI Skip]`, `[CI-Skip]`, `[Skip CI]`, `[Skip-CI]`, `[CF-Pages-Skip]`.

For policy/documentation synchronization, prefer `[Skip CI]` because it also communicates that no routine CI/deployment is intended.

## Normal feature workflow

### 1. Read first

Inspect:

- `AGENTS.md` and `CLAUDE.md`;
- `docs/agents/LATEST.md`;
- current Agent / architecture docs;
- relevant memory, skills, commands, hooks and handoffs when available;
- relevant open PRs and overlapping branches.

Reuse existing project rules instead of inventing a parallel workflow.

### 2. Keep work isolated

Default:

```text
one relatively independent feature
  -> one branch
  -> one PR
  -> one independent Preview
```

Do not merge unrelated work merely to save a deployment. When several PRs interact, build a temporary combined integration state and Direct Upload that state for review.

### 3. Validate before hosted deployment

Run repository-owned deterministic checks in the Agent environment, then run the production build. Use the commands already defined by this repository; do not replace the repository's build contract with provider-specific ad-hoc commands.

A failing Agent-side build is a reason to fix the code, not a reason to spend a Cloudflare Git Build for diagnostics.

### 4. Create the public Preview with Wrangler

Build the site first, then upload the prebuilt output to the existing Pages project using a unique preview branch, following `direct-upload-preview-policy.md`.

Cloudflare explicitly supports manually deploying with Wrangler to an existing Git-integrated Pages project. A preview branch upload yields a public `pages.dev` Preview without asking Cloudflare's Git integration to build the source.

Capture and report the actual deployment URL returned by Wrangler.

### 5. Inspect the real Preview

For UI, routing, responsive, SEO, or interaction changes, inspect the public Preview rather than relying only on source review.

A public Direct Upload Preview is a real deployed website. It is not Production, and it does not merge code.

### 6. Synchronize GitHub without spending a Preview Build

Intermediate source pushes and documentation-only synchronization should not intentionally request a Git-integrated Cloudflare deployment.

Use branch controls plus skip prefixes where appropriate. Avoid no-op commits, deployment probes, and repeated diagnostic pushes.

### 7. Release only after acceptance

After the accepted source is ready, merge the correct PR into `main`.

For `basemodel`, `main` is the Production branch, so the normal final release boundary is allowed to trigger **one** Git-integrated Cloudflare Production Build.

Do not merge simply to obtain a Preview.

## Expected Build consumption

For an ordinary feature when the branch controls above are in effect:

```text
feature branch edits/pushes              0 Pages Builds
Agent-side production builds             0 Pages Builds
Wrangler Direct Upload Preview(s)         0 Git-integrated Pages Builds
PR review / combined Direct Upload        0 Git-integrated Pages Builds
merge to main for real Production         1 Pages Build
```

Therefore one feature can be edited and previewed multiple times while normally consuming **one of the monthly Pages Builds only when it is actually released**.

If the feature is abandoned and never merged, it can consume **0 Git-integrated Pages Builds**.

Direct Upload is still a Pages deployment and remains subject to deployment/upload/platform limits; "0 Pages Builds" here means it does not consume the Git-integrated build count being conserved.

## Exceptions

A Git-integrated Preview Build before merge is justified only when the acceptance target is specifically the GitHub -> Cloudflare Git build path, or when Cloudflare's hosted build environment itself must be tested and Direct Upload cannot answer the question.

Before intentionally spending that Build, tell the owner:

- why Direct Upload is insufficient;
- which branch/environment will build;
- whether Agent-side validation and a Direct Upload Preview already passed;
- how many hosted Builds are expected.

## Cloudflare dashboard/API boundary

If the current ChatGPT/Agent session has a connected Cloudflare capability that can read or update Branch control, use it directly.

If that capability is unavailable, do not pretend the account setting changed. Record the exact desired dashboard state and continue using skip-build synchronization until a human or browser-capable Agent applies it.

Required state for `basemodel`:

```text
Workers & Pages
  -> basemodel
  -> Settings / Builds & deployments
  -> Branch control
  -> Production: main, automatic production deployments enabled
  -> Preview branch: None
  -> Save
```

## Required completion report

Every website task must end with:

```text
Task status: completed / not completed
Agent-side validation/build: passed / failed / not run
Preview type: Wrangler Direct Upload / Git-integrated Preview / none
Preview URL: <actual public URL if created>
Cloudflare Git-integrated Pages Builds triggered: 0 / 1 / more / unknown
Cloudflare Preview automatic deployment: None / enabled / unknown
GitHub branch: <name>
GitHub PR: <number/status>
Merged to main: yes / no
Production changed: yes / no / unknown
Production URL: <url>
```

Do not conflate local build success, Direct Upload success, public Preview verification, PR merge, and Production deployment.

## Current Cloudflare references

- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
