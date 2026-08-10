# Cloudflare Direct Upload Preview retrospective — 2026-08-11

Status: historical implementation record. Current executable guidance lives in `docs/agents/current/direct-upload-preview-command.md` and `docs/agents/current/direct-upload-preview-policy.md`.

## Why this work happened

The owner wants normal website iteration to stay inside web-based ChatGPT / coding-agent workflows while conserving the Cloudflare Pages monthly Git-build budget.

The target experience is:

```text
Agent changes code
-> Agent validates/builds the site
-> Agent creates a public pages.dev Preview
-> owner reviews it
-> accepted source is merged
-> Production changes only at an explicit release boundary
```

The critical constraint is that obtaining an ordinary Preview must not silently consume a Git-integrated Cloudflare Pages Build.

## What failed or proved unreliable

### 1. Falling back to a Git-integrated Preview just to obtain a URL

This works technically, but it spends one of the scarce Cloudflare Pages Builds. It is therefore the wrong default for ordinary review.

A previous SEED guide iteration used this fallback only after Direct Upload was blocked and after warning the owner. That incident made the cost boundary explicit: a branch push that asks Cloudflare Git integration to build source is not equivalent to Direct Upload of already-built assets.

Lesson: never use a hosted Git Preview as a substitute for missing local/Agent deployment credentials without explicit owner approval.

### 2. Assuming every ChatGPT execution environment has persistent Wrangler authentication

It does not. A web ChatGPT session can have GitHub access while its execution sandbox lacks:

- a Cloudflare account connector;
- `CLOUDFLARE_API_TOKEN`;
- `CLOUDFLARE_ACCOUNT_ID`;
- persisted `wrangler login` state;
- or even reliable npm access for installing Wrangler on demand.

Lesson: repository automation must treat Cloudflare authentication as an external capability and fail clearly when it is absent. Never claim that a Preview was deployed merely because the source was pushed to GitHub.

### 3. Treating one session's credentials as durable infrastructure

Even if a temporary shell obtains credentials, another ChatGPT/Codex session may not inherit them.

Lesson: the repository should own the deployment procedure, while the execution environment injects credentials. Do not build a workflow that depends on remembering one session's local Wrangler state.

### 4. Putting the secret into source control to make it readable

A private repository is access-controlled source storage, not a secret manager. Committing a live API token makes the secret part of Git history, expands the number of systems/people/apps that can read it, and creates rotation/removal work if it leaks.

GitHub's real secret stores (Actions secrets and Agent secrets) intentionally do not return the plaintext value through their read APIs. This is good security, but it also means a generic GitHub file-reading connector cannot retrieve those secret values and inject them into an unrelated ChatGPT sandbox.

Lesson: do not solve Agent credential injection by committing a plaintext Cloudflare token, even to a private repository.

### 5. Letting Preview automation target Production-like branches

A generic `wrangler pages deploy dist` wrapper without branch protection is too easy to misuse.

Lesson: the repository-owned Preview command must generate its own unique non-production branch and reject `main`, `master`, `production`, and `prod` targets.

### 6. Uploading before proving what was built

A deployment URL alone is weak evidence if the local build failed, the worktree was dirty, or Preview SEO settings were wrong.

Lesson: validation/build comes before upload; the deployment should carry the exact Git SHA; Preview HTML should be checked for `noindex`; and the returned public URL should be fetched after upload.

## What worked

### Repository-owned one-command entrypoint

PR #103 added:

```bash
npm run preview:cloudflare
```

The command delegates to `scripts/direct-upload-preview.mjs` and keeps the deployment contract in version-controlled code rather than in Agent memory.

### Minimal, non-interactive credential contract

The command expects only:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The API token should be a dedicated Cloudflare token with the minimum Pages permission required by current Cloudflare documentation. It must be injected by the execution environment, not stored in tracked source.

### Build before upload

The command runs the repository's existing:

```bash
npm run build:cloudflare
```

That preserves repository-owned validation instead of replacing it with an ad-hoc deployment-only build.

### Provenance and dirty-tree protection

The command records the exact Git SHA and refuses a dirty worktree by default. A disposable dirty Preview is possible only through the explicit `DIRECT_UPLOAD_ALLOW_DIRTY=1` escape hatch and is marked dirty in Wrangler metadata.

### Unique Preview identity

Preview branches are generated as `agent-preview-*` names containing a task label, short Git SHA and timestamp. Parallel Agent work therefore does not overwrite one shared Preview alias.

### Preview SEO protection

The build is forced to use Preview search-indexing settings, and `dist/index.html` must contain a robots `noindex` directive before upload.

### Public evidence after deployment

After Wrangler returns a `pages.dev` URL, the command performs bounded HTTP verification and prints machine-readable evidence:

```text
DIRECT_UPLOAD_PREVIEW_URL=...
DIRECT_UPLOAD_BRANCH_URL=...
DIRECT_UPLOAD_BRANCH=...
DIRECT_UPLOAD_COMMIT=...
DIRECT_UPLOAD_MODE=wrangler-pages-direct-upload
```

### Git synchronization without a Pages Build

The implementation branch and merge used Cloudflare-supported skip-build commit prefixes. The tooling landed in `main` without intentionally requesting a Cloudflare Git-integrated deployment.

## Final steady-state workflow

### Ordinary feature work

```text
1. Read AGENTS.md, LATEST.md, current Agent docs and relevant open PRs.
2. Make one coherent change on an isolated branch/worktree.
3. Run repository-local validation.
4. Ensure the Agent environment securely provides:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
5. Run:

   PREVIEW_LABEL=<short-task-name> npm run preview:cloudflare

6. Capture DIRECT_UPLOAD_PREVIEW_URL and inspect the real changed route(s).
7. Iterate with another Direct Upload when necessary.
8. Synchronize source to GitHub without intentionally requesting a Git-integrated Preview Build.
9. Report build result, Preview URL, Git state, Cloudflare Git-build consumption and Production state separately.
10. Only after explicit acceptance/release intent, merge/release to Production according to the current deployment policy.
```

### If Cloudflare credentials are absent

Stop at the credential boundary. Do not:

- fabricate a Preview URL;
- reuse a stale Preview as if it represented the new head;
- trigger a Git-integrated Cloudflare Preview just to compensate;
- ask the owner to paste a live token into chat or a tracked file.

State clearly that source/build work and public Direct Upload are different evidence boundaries.

### If Wrangler is absent

The command first prefers an existing local Wrangler v4. Otherwise it attempts `npx --yes wrangler@4`.

If the environment cannot access npm, report that tool-resolution failure. Do not weaken the deployment path or silently switch to Git integration.

## Credential-storage decision record

Preferred order for a Cloudflare API token:

1. execution-environment / Agent secret injection;
2. OS keychain or authenticated Wrangler profile for a persistent local Agent machine;
3. a real secret manager integrated with the Agent environment;
4. GitHub Actions/Agent secrets only when the runtime consuming them is GitHub's corresponding execution environment.

Do not store the token as plaintext in a normal Git-tracked file, including in a private repository.

GitHub secret APIs intentionally expose metadata but not decrypted secret values, so GitHub Secrets cannot be treated as a readable key-value database for an unrelated ChatGPT session.

The Cloudflare Account ID is an identifier rather than the bearer credential, but keeping both values in the same secure injection mechanism simplifies the deployment contract and avoids needless account metadata exposure.

## Current implementation files

```text
scripts/direct-upload-preview.mjs
src/lib/directUploadPreview.test.ts
package.json                    # preview:cloudflare
docs/agents/current/direct-upload-preview-command.md
docs/agents/current/direct-upload-preview-policy.md
docs/agents/current/web-gpt-cloudflare-build-budget-workflow.md
```

## Evidence boundary from the implementation session

- PR: #103 — `feat(deploy): add one-command safe Cloudflare Direct Upload Preview`
- merged to `main`: `6233606cc8d89281c4aa6a367497ed3f8f2d410c`
- script syntax and branch/protection logic were exercised in the available sandbox;
- the repository could not perform a real Cloudflare Direct Upload in that session because the ChatGPT execution environment did not expose the owner's Cloudflare credentials;
- no Cloudflare Git-integrated Pages Build was intentionally triggered to compensate;
- Production was not intentionally redeployed for the tooling change.

Future Agents should treat a real successful `npm run preview:cloudflare` run with returned public URL as the remaining end-to-end credential/deployment proof, rather than repeating the architecture design work above.

## References

Re-check these before changing auth/deployment behavior because platform behavior can change:

- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/workers/wrangler/system-environment-variables/
- https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- https://developers.cloudflare.com/fundamentals/api/how-to/restrict-tokens/
- https://docs.github.com/en/rest/actions/secrets
- https://docs.github.com/en/rest/agents/secrets
- https://docs.github.com/en/code-security/how-tos/secure-your-secrets/prevent-future-leaks
