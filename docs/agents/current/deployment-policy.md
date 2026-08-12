# Deployment and validation policy

Last reviewed: **2026-08-12**

## Authority

```text
GitHub = canonical source
non-main branches / PRs = Vercel Preview
main = Vercel Production
Production identity = https://basemodel-preview.vercel.app
Cloudflare Pages = frozen legacy rollback snapshot
Cloudflare Direct Upload / Workers shadow = Cloudflare-specific fallback only
```

GitHub Actions and GitHub Pages remain retired.

## Vercel responsibilities

Project `basemodel-preview` owns both deployment environments. Every deployable Preview/Production build uses:

`npm run verify:deploy && npm run build`

Do not disable Vercel Git deployment on `main`.

Preview acceptance requires exact-head provider success plus real route/metadata inspection. Preview is automatically `noindex` when `VERCEL_ENV=preview`; canonical/hreflang continue to point to the stable Production project domain.

## Vercel build-budget discipline

Vercel is the normal deployment provider, but its deployments/builds are still finite resources. Optimize the **number of provider-triggering ref updates**, not only the runtime of each build.

Default target for a coherent feature:

```text
one coherent branch/PR
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview after real route/log inspection
-> one Production build per accepted release batch
```

Rules:

1. Finish the coherent code/content batch and run the strongest available local/Agent checks before the first push. Do not push every typo, intermediate experiment or file write.
2. Reuse the existing branch/PR. Do not create a duplicate PR to repair the same deployment or migration unless the old branch is genuinely unsafe to continue.
3. When a GitHub connector would otherwise write files one by one, prefer a checked-out worktree or one Git data API multi-file commit (`blob -> tree -> commit -> ref`). Sequential Contents API writes can create one Vercel deployment per ref update.
4. Keep stacked PRs only for real, reviewable dependencies. Stabilize the parent before repeatedly pushing the child, and do not mirror the same fix across multiple branches.
5. When several already-accepted PRs belong to one release window, one explicit integration/release head plus one merge to `main` may be used if authorship, review, rollback and ownership remain clear. Do not combine unrelated or unaccepted work only to reduce build count.
6. Batch evidence-driven Preview fixes. The normal budget is one initial Preview plus at most one corrective Preview; more pushes require a concrete reason such as a newly discovered Gate failure, exact-head synchronization conflict or real browser finding.
7. Avoid direct micro-commits to `main`. Every deploy-relevant `main` update can become a Production build.
8. Docs/Agent-only changes should remain outside deploy-relevant paths so the ignored-build step can skip them. Do not touch `src/`, `public/`, `scripts/`, tests or deployment config merely to obtain a Preview badge.
9. Vercel same-branch auto-cancellation limits wasted execution when a newer push supersedes a running job, but a canceled/ignored deployment is not a substitute for batching pushes.
10. When build usage matters, report deployment triggers separately as `READY`, `ERROR`, `CANCELED` and ignored/skipped when provider evidence is available. Do not report only successful builds.

## Executable build-scope protection

`vercel.json` owns two safeguards:

- `github.autoJobCancelation: true` keeps the newest same-branch job authoritative;
- `ignoreCommand: node scripts/vercel-ignore-build.mjs` decides whether a build is needed.

The ignore script compares `VERCEL_GIT_PREVIOUS_SHA` with the current commit so multi-commit pushes and accumulated docs-only changes are classified against the previous successful deployment, rather than only looking at `HEAD^..HEAD`. It skips only when no deploy-relevant path changed. Missing Git history, an invalid range, or any uncertainty **fails open** and runs the build.

The path classifier and policy are protected by `src/lib/vercelBuildBudget.test.ts`.

## Production release

After the accepted exact head is current with `main`:

```text
merge to main
-> Vercel Production build
-> https://basemodel-preview.vercel.app
-> verify indexability, canonical/hreflang, robots/sitemap, representative routes and interaction
```

Until Cloudflare Pages Git integration is disabled externally, the merge/release commit should keep `[CF-Pages-Skip]`. This is the opposite of the old Pages release rule: Cloudflare is no longer supposed to wake up on release.

## Cloudflare zero-build policy

**Cloudflare Pages Build = 0** for ordinary work and releases. Do not intentionally trigger a Git-connected Pages build unless the owner has first been told why Cloudflare-specific execution is necessary and explicitly authorizes it.

The old Pages deployment remains a rollback/legacy snapshot. Direct Upload and Workers shadow remain optional diagnostic surfaces. Do not commit Cloudflare tokens.

## Repository Gate

Executable truth lives in `package.json`. `npm run verify:deploy` remains provider-neutral and includes the project’s deterministic checks/tests/audits. Do not weaken a valid Gate to get a green deployment.

Full browser suites and third-party/network audits remain on demand when the changed surface requires them.

## Completion report

Report separately:

```text
Repository Gate/build
Vercel deployment triggers: total / READY / ERROR / CANCELED / ignored when known
Vercel Preview + exact head
Preview route/metadata acceptance
Merged to main
Vercel Production deployment + public verification
Cloudflare Pages Build intentionally triggered: yes/no
Cloudflare legacy rollback changed: yes/no/unknown
External provider boundary, if any
```

Do not infer exact provider quota counters without authoritative account evidence.
