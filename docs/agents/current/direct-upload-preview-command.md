# One-command Cloudflare Direct Upload Preview

Last reviewed: **2026-08-11**

This is the executable companion to `direct-upload-preview-policy.md`.

Use it when an Agent environment has Cloudflare automation credentials and needs a public Preview without intentionally triggering the Git-connected Cloudflare Pages build path.

Implementation lessons, failed paths and the reasoning that produced this workflow are recorded in:

`docs/agents/history/2026-08-11-cloudflare-direct-upload-preview-retrospective.md`

## Command

From a clean repository state:

```bash
npm run preview:cloudflare
```

The command performs the full normal Preview sequence:

```text
credential check
-> Git SHA / working-tree provenance check
-> unique non-production Preview branch generation
-> npm run build:cloudflare
-> verify built HTML contains robots noindex
-> Wrangler Pages Direct Upload of dist/
-> attach Git commit SHA to the deployment
-> verify the returned public pages.dev URL
-> print machine-readable Preview URLs and commit metadata
```

The repository owns the project name (`basemodel`) and generates a branch beginning with `agent-preview-`. The command does not accept a Production target and does not call the Git-connected deployment path.

## Credentials

Wrangler automation uses these environment variables:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Cloudflare's current Pages Direct Upload CI guidance says a custom API token can use the minimum permission:

```text
Account → Cloudflare Pages → Edit
```

Prefer a Secret Manager, Agent secret store, or exported shell environment. **Never commit** the token to GitHub, put it in a tracked configuration file, or paste it into an issue/PR/chat transcript.

The repository already ignores `.env`, but a persistent local secret store or shell/Agent secret injection is preferred when available.

### Credential-injection boundary for web ChatGPT

Do not treat a private Git repository as a secret manager merely because the GitHub connector can read private files. A plaintext token committed to a private repository becomes normal Git content: it is copied into history and becomes readable by every principal/app with sufficient repository read access.

GitHub's actual secret stores have the opposite property: Actions Secrets and Agent Secrets are designed so their APIs can list/get secret metadata without returning the decrypted value. That makes them appropriate for runtimes that GitHub injects the secret into, but it means a generic GitHub-reading ChatGPT session cannot use them as a plaintext key-value store.

Therefore the preferred credential order for this command is:

```text
1. Agent/execution-environment secret injection
2. persistent local Wrangler OAuth/keychain or shell secret on a trusted Agent machine
3. a real external secret manager integrated with the Agent runtime
4. GitHub Actions/Agent Secrets only when the consuming runtime is GitHub's corresponding runtime
```

Do not move to `private repo plaintext token` as the next fallback. If a future platform offers a connected Cloudflare credential store or a secret-injection bridge for web ChatGPT, prefer that and keep the token unreadable as ordinary repository content.

The Cloudflare Account ID is an identifier rather than the bearer token, but keeping both values in the same injection mechanism keeps the deployment contract simple and avoids unnecessary account metadata exposure.

Official references checked on 2026-08-11:

- <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
- <https://developers.cloudflare.com/pages/get-started/direct-upload/>
- <https://developers.cloudflare.com/workers/wrangler/system-environment-variables/>
- <https://developers.cloudflare.com/fundamentals/api/get-started/create-token/>
- <https://developers.cloudflare.com/fundamentals/api/how-to/restrict-tokens/>
- <https://docs.github.com/en/rest/actions/secrets>
- <https://docs.github.com/en/rest/agents/secrets>

Re-check Cloudflare/GitHub documentation before changing authentication permissions, secret handling or Wrangler arguments because the platforms can change.

## Safety behavior

The command intentionally fails before upload when any of these are true:

- `CLOUDFLARE_API_TOKEN` is missing;
- `CLOUDFLARE_ACCOUNT_ID` is missing;
- Git provenance cannot be read;
- the working tree is dirty, unless `DIRECT_UPLOAD_ALLOW_DIRTY=1` is explicitly set for a disposable Preview;
- the generated branch is not an `agent-preview-*` branch;
- the repository-local deployment gate/build fails;
- `dist/index.html` lacks Preview `robots noindex`;
- Wrangler upload fails;
- the uploaded public URL cannot be reached after bounded retries.

A dirty Preview is deliberately opt-in. When enabled, Wrangler receives `--commit-dirty=true`; the deployment must not be presented as an exact committed-tree artifact.

## Wrangler resolution

The script does not add Wrangler to this repository's dependency graph solely for deployment.

It resolves Wrangler in this order:

1. use `node_modules/.bin/wrangler` when it is Wrangler v4 or newer;
2. otherwise run `npx --yes wrangler@4 ...`.

This keeps the repository light while still pinning the supported Wrangler major for an Agent environment that can access npm.

## Optional Preview label

Agents may set a short human-readable label:

```bash
PREVIEW_LABEL=seed-guide npm run preview:cloudflare
```

The final Cloudflare Preview branch is still generated by the script and includes the Git short SHA plus a timestamp. Agents should not hand-author a Production-like branch name.

## Output contract

On success, the last lines include:

```text
DIRECT_UPLOAD_PREVIEW_URL=<actual deployment URL>
DIRECT_UPLOAD_BRANCH_URL=<stable branch alias>
DIRECT_UPLOAD_BRANCH=<generated preview branch>
DIRECT_UPLOAD_COMMIT=<full Git SHA>
DIRECT_UPLOAD_MODE=wrangler-pages-direct-upload
```

Future Agents should use `DIRECT_UPLOAD_PREVIEW_URL` as the primary public evidence, then inspect the changed route(s) on that Preview.

## What this does not prove

A successful run means the repository gate/build passed, the assets were uploaded through Wrangler Direct Upload, and the returned public URL was reachable.

It does **not** mean:

- a Git-integrated Cloudflare Build ran;
- Production changed;
- every page/interaction was visually inspected;
- Cloudflare platform/deployment limits do not exist.

Direct Upload avoids the Git-connected Pages build step but still creates a Pages deployment and remains subject to Cloudflare platform limits.
