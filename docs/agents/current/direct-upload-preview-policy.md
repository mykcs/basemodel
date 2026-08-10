# Direct Upload preview, PR isolation, and Cloudflare build-budget policy

Last reviewed: 2026-08-10

## Authority

This file is the default preview/release policy for Agent-driven website changes in `mykcs/basemodel`.

It applies to Codex, Claude/other coding agents, ChatGPT conversations, and work-mode sessions that modify this website. Where an older workflow says every deployment-sensitive PR must trigger a Git-connected Cloudflare Preview, this file is the newer build-budget rule for normal work.

The repository architecture remains GitHub as source of truth and Cloudflare Pages as the production host. This policy changes the **default preview and parallel-development workflow**, not the ownership of source code or the production platform.

## Current budget snapshot

Owner-reported point-in-time usage on **2026-08-10**: approximately **350 / 500 Cloudflare Pages Builds used this month**, while the month is still around its middle.

Treat this as a strong conservation signal, not a permanent live counter:

- assume Pages Builds are scarce unless current account evidence proves otherwise;
- do not claim the account is still exactly at `350 / 500` in a later session without checking current usage;
- if current usage is available from Cloudflare, prefer that live value over this historical snapshot;
- if current usage is unavailable, continue to behave conservatively rather than spending builds speculatively.

Cloudflare's current Free-plan documentation lists 500 Pages builds per month. Re-check Cloudflare's current documentation when limits or plan behavior matter because platform rules can change.

## Primary rule

Cloudflare Pages Build quota is a scarce resource. Prefer workflows that do not trigger a Cloudflare Git build.

Default for normal website work:

```text
focused task
  -> dedicated Git branch/worktree
  -> repository-local validation/build
  -> Wrangler Direct Upload of the prebuilt output
  -> unique public pages.dev Preview
  -> inspect/verify that Preview
  -> synchronize source to GitHub without an intentional Pages Build
  -> report exact status
```

Do **not** trigger a Git-connected Cloudflare Pages Preview or Production build merely to show the owner the result of an ordinary website change.

## One feature should usually be one PR

Default scope rule:

```text
one relatively independent feature / UI change / content change
  -> one task branch
  -> one focused PR
  -> one independent Preview surface
```

This is not an absolute ban on larger PRs. A single coherent feature may touch several files or layers. The important rule is to avoid mixing unrelated work merely because several Agents are active at the same time.

Before starting non-trivial work, inspect current `main`, open PRs, and relevant branches when those are available. Avoid duplicate implementation and avoid having multiple Agents write to the same branch/worktree.

When two tasks overlap heavily in the same component, layout, design-system surface, data structure, or routing contract, either coordinate their merge order or intentionally consolidate them into one coherent task instead of creating competing implementations.

## Default preview method: local build + Direct Upload

Use a unique, non-production preview branch name such as:

```text
agent-preview-<short-task-name>-<date-or-short-id>
```

For this repository, a safe local preview build should preserve Preview noindex semantics. A practical pattern is:

```bash
PREVIEW_BRANCH="agent-preview-<name>"
PREVIEW_ORIGIN="https://${PREVIEW_BRANCH}.basemodel.pages.dev"

CF_PAGES_BRANCH="$PREVIEW_BRANCH" \
PUBLIC_SITE_URL="$PREVIEW_ORIGIN" \
PUBLIC_SEARCH_INDEXING=disabled \
npm run build:cloudflare

npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch="$PREVIEW_BRANCH"
```

Capture the actual deployment URL returned by Wrangler and give it to the owner. Prefer the returned deployment URL as evidence; the predictable branch alias may also be reported when it resolves correctly.

Direct Upload uploads prebuilt assets. It avoids Cloudflare's Git-connected build step; it still creates a Pages deployment and remains subject to Cloudflare deployment/upload/platform limits. Never describe it as having no limits.

Official references:

- <https://developers.cloudflare.com/pages/get-started/direct-upload/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/>
- <https://developers.cloudflare.com/pages/configuration/branch-build-controls/>
- <https://developers.cloudflare.com/pages/platform/limits/>

## Preview isolation for parallel Agents

A Preview is a view of one code state; it is **not** the place where parallel work is merged.

When several Agent conversations are active, keep both code and preview identity isolated:

```text
PR A -> branch A -> Preview A
PR B -> branch B -> Preview B
PR C -> branch C -> Preview C
```

Do not make unrelated Agents share one Git branch or one reusable Preview alias. Reusing the same alias allows a later deployment to replace what the alias points to, which makes review ambiguous even though the underlying Git branches may still be distinct.

The source merge happens in Git/PRs, not in `pages.dev`.

## Multiple PRs: merge carefully, not all at once

A set of PRs can each look correct in isolation and still conflict after combination.

Before merging several website PRs, check for overlap in at least:

- the same component or layout;
- global CSS, tokens, Tailwind configuration, or design-system primitives;
- routing/navigation/SEO behavior;
- shared data structures, loaders, stores, or URL-state contracts;
- common tests, build configuration, or dependency manifests.

Git text conflicts are only one failure mode. Two PRs can merge cleanly while still creating a visual, semantic, routing, or state-management conflict.

Preferred merge flow:

```text
merge one coherent PR
  -> refresh remaining PRs against latest main when needed
  -> rerun relevant local validation/build
  -> regenerate Direct Upload Preview if the combined base changed materially
  -> inspect
  -> merge the next PR
```

Do not merge a pile of stale PRs merely because every individual Preview once looked correct.

## Combined integration Preview when several PRs matter together

When multiple important PRs exist and the final combined behavior is the real acceptance question, prefer a temporary integration worktree/branch:

```text
latest main
  + PR A
  + PR B
  + PR C
  -> temporary integration worktree/branch
  -> local validation + production build
  -> Direct Upload to a unique integration Preview
  -> inspect the combined site
```

This integration Preview is a review surface only. It does not replace the original PRs and should not be used to hide ownership or collapse unrelated changes into one giant PR.

Default the integration Preview to Direct Upload as well. Do not spend a Git-connected Cloudflare Build merely because several PRs are being reviewed together.

## Git synchronization without a Pages Build

When source/documentation should be synchronized to GitHub but no formal Git-integrated deployment is requested, use repository Build Watch controls and a Cloudflare-supported skip prefix on commits that would otherwise trigger Pages when appropriate:

```text
[Skip CI] ...
```

Cloudflare currently also documents `[CF-Pages-Skip]`, `[CI Skip]`, `[CI-Skip]`, and `[Skip-CI]` as valid skip prefixes.

For multi-file Agent-policy/documentation synchronization, prefer a small number of coherent skip-build commits. Do not create a branch/PR/merge sequence that accidentally creates a final non-skip `main` commit merely to synchronize documentation.

Avoid no-op commits, probe pushes, and repeated speculative push loops.

## When intentionally spending one Pages Build can be justified

Because the owner is already deep into the monthly build budget, a Git-integrated Cloudflare Pages Build should be deliberate rather than exploratory.

Examples of legitimate reasons include:

- several important PRs have already been locally validated and reviewed and the project is approaching a formal release boundary;
- the property being tested is specifically the **Git-integrated Cloudflare build/deploy path** and cannot be established by local build + Direct Upload alone;
- a final Production release is being performed;
- the owner explicitly asks for a formal Git-integrated deployment.

When several PRs are pending, first reduce uncertainty with local checks and combined Direct Upload Previews. If one hosted Build is still necessary, prefer spending it on a coherent, near-final state rather than on one tiny intermediate commit.

The presence of remaining monthly quota is not by itself a reason to consume a Build.

## Mandatory warning before an intentional Git-integrated Build

Before intentionally triggering a Git-connected Cloudflare Preview or Production build, tell the owner:

1. why this hosted Build is necessary now;
2. whether Preview, Production, or both are expected to build;
3. whether local validation/build and Direct Upload review have already been completed;
4. why the same acceptance question cannot be answered with the build-sparing path.

Do not silently convert an ordinary preview request into a hosted Git build.

## Formal Git-integrated deployment boundary

Only use the normal Git-connected Preview/Production path when the owner explicitly asks for a formal Git-integrated deployment, production release, merge-and-deploy, or equivalent production boundary, or when the narrow exception above genuinely requires testing Git integration itself.

Before intentionally triggering that path:

1. warn about expected Pages Build consumption;
2. batch the final changes so the build is deliberate rather than exploratory;
3. avoid extra diagnostic pushes;
4. after deployment, verify the exact commit/deployment rather than assuming success.

## Required completion report

After a website change is implemented and validated, explicitly tell the owner **it is completed** only when the requested acceptance boundary has actually been reached.

The final report must include:

```text
Task status: completed / not completed
Local validation/build: passed / failed / not run
Direct Upload Preview: succeeded / failed / not run
Preview URL: <actual public URL, if one exists>
Cloudflare Pages Build triggered: yes / no / unknown
GitHub: branch / PR / commit synchronization status
Production: changed / unchanged / unknown
```

Never use phrases such as “safe”, “deployed”, “verified”, or “no build consumed” when the evidence does not support them.

If the local build fails, Wrangler upload fails, authentication is unavailable, the public preview cannot be verified, or current quota/usage cannot be confirmed, say so directly and stop short of claiming completion at that boundary.

## Evidence distinctions

Keep these claims separate:

```text
local build passed
!= Direct Upload succeeded
!= public Preview verified
!= Git-integrated Cloudflare Pages Build ran
!= Production deployment completed
```

A GitHub push, a Cloudflare deployment, and a public-site verification are different evidence boundaries.

## Relationship to existing runbooks

`docs/agents/current/deployment-policy.md` and `docs/agents/current/cloudflare-pages-deployment.md` still describe the Git-integrated production architecture, repository-owned deployment gate, SEO rules, and rollback behavior. Keep using those details for a **formal Git-integrated release**.

For day-to-day Agent preview behavior, parallel PR isolation, integration previews, and Pages Build-budget decisions, this file is the current default.