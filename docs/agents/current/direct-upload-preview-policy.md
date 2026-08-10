# Direct Upload preview and Cloudflare build-budget policy

Last reviewed: 2026-08-10

## Authority

This file is the default preview/release policy for Agent-driven website changes in `mykcs/basemodel`.

It applies to Codex, Claude/other coding agents, ChatGPT conversations, and work-mode sessions that modify this website. Where an older workflow says every deployment-sensitive PR must trigger a Git-connected Cloudflare Preview, this file is the newer build-budget rule for normal work.

The repository architecture remains GitHub as source of truth and Cloudflare Pages as the production host. This policy changes the **default preview path**, not the ownership of source code or the production platform.

## Primary rule

Cloudflare Pages Build quota is a scarce resource. Prefer workflows that do not trigger a Cloudflare Git build.

Default for normal website work:

```text
edit code
  -> run repository-local validation/build locally
  -> Direct Upload the already-built output to a preview branch
  -> obtain a new public preview URL
  -> inspect/verify that preview
  -> report completion and exact deployment/build status
```

Do **not** trigger a Git-connected Cloudflare Pages Preview or Production build merely to show the owner the result of an ordinary website change.

## Default preview method

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
- <https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/>
- <https://developers.cloudflare.com/pages/platform/limits/>

Re-check these sources when quota or platform behavior matters because Cloudflare rules can change.

## Git synchronization without a Pages Build

When source/documentation should be synchronized to GitHub but no formal Git-integrated deployment is requested, use a Cloudflare-supported skip prefix on commits that would otherwise trigger Pages:

```text
[Skip CI] ...
```

Cloudflare currently also documents `[CF-Pages-Skip]`, `[CI Skip]`, `[CI-Skip]`, and `[Skip-CI]` as valid skip prefixes.

For multi-file Agent-policy/documentation synchronization, prefer a small number of coherent skip-build commits. Do not create a branch/PR/merge sequence that accidentally creates a final non-skip `main` commit just for documentation.

## Formal Git-integrated deployment boundary

Only use the normal Git-connected Preview/Production path when the owner explicitly asks for a formal Git-integrated deployment, production release, merge-and-deploy, or equivalent production boundary.

Before intentionally triggering that path:

1. tell the owner that the next Git push/merge may consume a Cloudflare Pages Build;
2. state whether Preview, Production, or both are expected to build;
3. batch the final changes so the build is deliberate rather than exploratory;
4. after deployment, verify the exact commit/deployment rather than assuming success.

Do not silently turn an ordinary preview request into a Git-integrated Pages Build.

## Required completion report

After a website change is implemented and validated, explicitly tell the owner **it is completed** only when the requested acceptance boundary has actually been reached.

The final report must include:

- local validation/build result;
- Direct Upload result and the new public preview URL, when preview was requested/default;
- `Cloudflare Pages Build triggered: yes / no / unknown`;
- whether source changes were synchronized to GitHub and whether Production was intentionally changed;
- any remaining blocker or unverified boundary.

Never use phrases such as “safe”, “deployed”, “verified”, or “no build consumed” when the evidence does not support them.

If the local build fails, Wrangler upload fails, authentication is unavailable, the public preview cannot be verified, or current quota/usage cannot be confirmed, say so directly and stop short of claiming completion at that boundary.

## Relationship to existing runbooks

`docs/agents/current/deployment-policy.md` and `docs/agents/current/cloudflare-pages-deployment.md` still describe the Git-integrated production architecture, repository-owned deployment gate, SEO rules, and rollback behavior. Keep using those details for a **formal Git-integrated release**.

For day-to-day Agent preview behavior and build-budget decisions, this file is the current default.