# Claude Code project entrypoint

Provider-neutral repository policy lives in [`AGENTS.md`](AGENTS.md). For deployment behavior, the newer Agent handoff files below take precedence over older Cloudflare-only wording.

Before non-trivial work, read:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md)
2. [`docs/agents/current/vercel-preview-migration-plan.md`](docs/agents/current/vercel-preview-migration-plan.md)
3. [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md)
4. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md)
5. the other current Agent docs referenced by `docs/agents/README.md`

## Preview / Production rule

For ordinary website work:

```text
non-main GitHub branch / PR
-> Vercel Preview
-> npm run verify:deploy
-> npm run build
-> inspect exact Preview

main
-> Vercel Git deployment disabled
-> Cloudflare Pages Production
```

Cloudflare Direct Upload remains the fallback / Cloudflare-specific Preview path.

Intermediate non-release commits may use `[CF-Pages-Skip]` where appropriate to avoid intentionally triggering Cloudflare branch builds. Do not use a Cloudflare skip prefix on the final merge/release commit when the owner expects Production to deploy.

Because the repository is private, Vercel Preview URLs may be protected. Generate a temporary share URL when the owner needs anonymous review access rather than asking them to relay dashboard state.

Do not claim completion from a READY badge alone: verify the exact Git head, repository Gate, and real Preview route.

Do not duplicate the full policy here; `docs/agents/LATEST.md`, `vercel-preview-migration-plan.md`, and `deployment-policy.md` are the deployment sources of truth.
