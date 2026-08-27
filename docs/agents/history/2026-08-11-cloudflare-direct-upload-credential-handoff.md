# Cloudflare Direct Upload credential handoff — 2026-08-11

Status: **historical implementation/credential handoff; not current deployment authority**

This record explains why the repository added `npm run preview:cloudflare` and how the credential boundary was reasoned about before Vercel became the ordinary Preview + Production provider.

## What landed

PR #103 added the repository-owned Direct Upload path:

```text
scripts/direct-upload-preview.mjs
src/lib/directUploadPreview.test.ts
package.json -> preview:cloudflare
docs/agents/current/direct-upload-preview-command.md
docs/agents/current/direct-upload-preview-policy.md
```

The command validates credentials/Git provenance, refuses an unsafe dirty worktree by default, builds a non-indexed Cloudflare artifact, Direct Uploads it with Wrangler, records the Git SHA, verifies the returned Preview URL, and reports machine-readable evidence.

## Credential lesson

GitHub repository read access and runtime deployment credentials are different capabilities. A web Agent may read a private repository without having `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, Wrangler OAuth state, or a runtime that can execute the build.

The durable security decision was **not** to use plaintext committed to a private Git repository as the preferred secret bridge. A bearer token in Git becomes ordinary history and expands the trust boundary to every sufficiently privileged reader/integration/backup.

Preferred order remains:

```text
execution-environment secret injection
-> trusted local authenticated CLI/keychain state
-> integrated external secret manager
-> GitHub secret storage only when the consuming runtime is the corresponding GitHub runtime
```

GitHub secret APIs do not make decrypted values available as a generic key-value store to an unrelated ChatGPT session.

## What changed afterward

Vercel later became the ordinary provider for both Preview and Production. Cloudflare Direct Upload remains only a Cloudflare-specific/fallback path. Current behavior is owned by:

- `../current/hosting-architecture.md`;
- `../current/deployment-policy.md`;
- `../current/direct-upload-preview-policy.md`;
- `../current/direct-upload-preview-command.md`.

Use this file for provenance and secret-boundary rationale, not as a pending credential project or normal deployment workflow.
