# Pages preview and build-budget policy

Last reviewed: 2026-08-10

## Authority

This is the authoritative **day-to-day website preview policy** for `mykcs/basemodel`.

It changes the default validation/deployment workflow, not the repository ownership or hosting architecture: GitHub remains the source of truth and Cloudflare Pages remains the hosting platform. Where older current docs say that every deployment-sensitive task must manufacture a Git-connected final-head Preview, this file supersedes that workflow instruction.

## Owner priority

Cloudflare Pages Build count is a scarce resource. Prefer a workflow that validates the site without invoking Cloudflare's Git build service.

The default loop is:

```text
edit
  -> local repository validation/build
  -> upload the already-built dist/ with Wrangler
  -> fresh public Cloudflare Pages preview URL
  -> inspect/verify preview
  -> report completion + whether a Pages Build was triggered
```

Do not create validation-only branches, diagnostic PRs or push loops merely to obtain a Pages Preview.

## Default local validation

For a normal site change, run the repository-owned deterministic checks locally before uploading:

```bash
npm run verify:deploy
npm run build
```

Run the relevant deeper checks when the change warrants them, such as Playwright for browser-sensitive UI/routing work or source/catalog audits for data-maintenance work.

A local build failure is a blocker. Do not upload stale output or claim completion.

## Default public preview: Wrangler upload

After a successful local build, prefer a new preview deployment made from the prebuilt `dist/` output:

```bash
npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch=<unique-preview-branch>
```

Use a fresh, task-specific preview branch name so the owner receives a clear public review URL. Record the actual URL returned by Wrangler and, when tools permit, fetch or visually inspect it before declaring the website work complete.

This is a **manual upload of prebuilt assets**. It is preferred because it avoids asking Cloudflare's Git integration to build the site merely to create a review surface.

Do not overstate this as “no Cloudflare quota of any kind.” Pages deployment/account limits are separate platform constraints and may change. If upload limits, account state or remaining quota cannot be confirmed, state that uncertainty explicitly.

## Git pushes without a Pages Build

When repository changes need to be preserved on GitHub but a Git-integrated Pages deployment is not requested, avoid triggering an automatic Pages build.

For a commit that intentionally should not deploy, Cloudflare Pages supports a skip prefix such as:

```text
[CF-Pages-Skip] <commit message>
```

Continue to use Build Watch Paths for categories that provably cannot change the deployed site. Do not rely on a skip marker for a formal production release the owner explicitly requested.

## Formal Git-integrated deployment

Only intentionally trigger the Git-connected Pages Preview/Production path when the owner explicitly asks for a formal Git-integrated deployment/release.

Before triggering it, tell the owner that the action may consume a Cloudflare Pages Build. Then use the repository's exact-head/production validation rules and report the resulting deployment evidence honestly.

Do not silently turn “show me the changed website” into a Git-integrated PR build when a local build + Wrangler preview can serve that goal.

## Completion report contract

After website work is actually finished and verified, explicitly say it is complete and include all of the following claims separately:

- local build/validation: passed or failed;
- Direct Upload / Wrangler upload: succeeded, failed, or not run;
- public preview URL: actual URL, or state that none was created;
- Cloudflare Pages Build: **triggered or not triggered**;
- formal Git-integrated deployment: performed or not performed;
- unresolved quota/account uncertainty, if any.

Never infer one boundary from another. In particular:

```text
local build passed
!= upload succeeded
!= preview URL verified
!= Pages Build ran
!= Production is released
```

If build fails, upload fails, public access cannot be verified, or quota/account state is unknown when it matters, report the exact blocker and do not claim the site is safely deployed.

## Pages vs Workers

This policy is specific to Cloudflare Pages. It must not be copied onto Workers-only projects as though Direct Upload were their deployment model.