# Claude Code project entrypoint

Provider-neutral repository policy lives in [`AGENTS.md`](AGENTS.md) and wins over Claude-specific conventions.

Before non-trivial work, read:

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/agents/current/direct-upload-preview-policy.md`](docs/agents/current/direct-upload-preview-policy.md)
3. [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md)
4. the other current Agent docs referenced by `AGENTS.md`

## Cloudflare Pages preview rule

For normal website work, default to repository-local validation/build followed by Wrangler Direct Upload of the prebuilt `dist/` to a non-production preview branch. Return the new public preview URL and explicitly report whether a Cloudflare Pages Build was triggered.

Do not trigger a Git-connected Cloudflare Pages Preview/Production build merely to obtain a preview. Use skip-build Git semantics such as `[CF-Pages-Skip]` / another currently supported Cloudflare skip prefix when source synchronization should not deploy.

Only intentionally use the formal Git-integrated deployment path when the owner explicitly asks for it. Before doing so, state that the next push/merge may consume a Cloudflare Pages Build.

If local build, Wrangler upload, authentication, public-preview verification, or quota/build status cannot be confirmed, say so explicitly and do not claim completion at that boundary.

Do not duplicate the full deployment policy here; the files above are the source of truth.
