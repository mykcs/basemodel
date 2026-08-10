# Cloudflare Direct Upload preview policy — fallback / Cloudflare-specific path

Last reviewed: **2026-08-11 01:32 +08:00**
Status: **Supported fallback; no longer the ordinary first-choice Preview path**

## Authority

The ordinary Agent Preview workflow is now defined by:

- `../LATEST.md`
- `vercel-preview-migration-plan.md`
- `deployment-policy.md`

Validated steady state:

```text
non-main branch / PR -> Vercel Preview
main -> Cloudflare Pages Production
Cloudflare Direct Upload -> fallback / Cloudflare-specific Preview
```

This file remains authoritative for Direct Upload mechanics, build-budget conservation, and Cloudflare-specific Preview work.

## When to use Direct Upload

Use Direct Upload when:

- the acceptance question is specifically about Cloudflare Pages behavior;
- Vercel is unavailable, rate-limited, or operationally unsuitable;
- the owner explicitly asks for a `pages.dev` Preview;
- a Cloudflare Production issue needs a same-provider pre-release reproduction;
- several PRs need a temporary Cloudflare-hosted integration Preview.

Do **not** trigger a Git-connected Cloudflare branch Preview merely because Direct Upload credentials are unavailable while Vercel can answer the review question.

## Repository-owned command

Prefer the maintained repository command/runbook in:

`direct-upload-preview-command.md`

rather than rebuilding the workflow ad hoc in each Agent session.

Conceptually the flow is:

```text
focused code state
-> repository Gate / Cloudflare-compatible production build
-> prebuilt dist/
-> Wrangler Direct Upload to a unique non-production branch
-> returned pages.dev deployment URL
-> inspect real Preview
-> report exact Git/build/deployment boundaries
```

A representative low-level command remains:

```bash
npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch=<unique-preview-branch>
```

Use the repository command when possible because it captures the project-specific build/identity contract.

## Preview identity

A Direct Upload Preview is not a competing Production identity.

Preserve:

- non-production branch naming;
- `PUBLIC_SEARCH_INDEXING=disabled`;
- Preview `noindex` semantics;
- correct root-relative routes and assets;
- Production canonical/hreflang identity where required by the build mode.

Capture and report the actual deployment URL returned by Wrangler. A predictable branch alias can be secondary evidence, not a substitute for the returned deployment result.

## Build-budget semantics

Cloudflare Pages Git-build quota remains a scarce engineering resource.

Keep these distinctions explicit:

```text
static visitor request != Pages Git Build
Git-connected branch/Production deployment = may consume Pages Build quota
local/Agent build + Direct Upload = prebuilt Pages deployment, not a Git-connected build
```

Direct Upload is **not broadly quota-free**. It remains subject to Cloudflare deployment/upload/file/platform limits.

Never claim the account has a specific remaining monthly Build count from an old snapshot. Use current authoritative account evidence when available; otherwise report the exact count as unknown and continue conservatively.

## PR isolation

Use one unique Preview identity per relatively independent feature:

```text
PR A -> Preview A
PR B -> Preview B
PR C -> Preview C
```

Do not make unrelated Agents share one reusable alias. A Preview is one code state, not a merge surface.

For a combined integration review:

```text
latest main + selected PR heads
-> temporary integration state
-> repository validation/build
-> unique Direct Upload integration Preview
-> inspect combined behavior
```

Keep source ownership and final merges in Git/PRs.

## Git synchronization

Intermediate/non-release commits may use `[CF-Pages-Skip]` when appropriate so Git synchronization does not intentionally trigger a Cloudflare branch build.

Avoid no-op deployment probes and speculative push loops.

### Production warning

Do **not** carry a Cloudflare skip prefix into the final merge/release commit when the owner expects Cloudflare Production to deploy.

The intended release sequence is:

```text
accepted Preview
-> normal non-skip merge/release to main
-> Vercel main deployment remains disabled
-> Cloudflare Production deploys
```

## When a Git-integrated Cloudflare Build is justified

A hosted Cloudflare Git Preview/Production Build should be deliberate, for example:

- the property under test is specifically the Cloudflare Git build path;
- Direct Upload cannot reproduce the issue;
- the owner explicitly asks for a formal `pages.dev` Git Preview;
- the accepted change is being released to Production.

Before intentionally spending such a Build, tell the owner why Vercel/Direct Upload cannot answer the question and which environment is expected to build.

## Completion report for Direct Upload work

Report these separately:

```text
Task complete: yes/no
Repository validation/build: passed/failed/not run
Direct Upload: succeeded/failed/not run
Preview URL: <actual pages.dev URL or none>
Cloudflare Git-integrated Build intentionally triggered: yes/no
Exact Git head: <SHA>
Production changed: yes/no/unknown
```

Do not conflate local build, Direct Upload, Vercel Preview, Git-integrated Cloudflare Build, PR merge, and Production release.

## Current relationship to Vercel

Vercel won the 2026-08-11 ordinary-Preview pilot because the connected Agent could read deployment state/logs, GitHub surfaced Vercel status, the complete repository Gate ran before build, and temporary protected-Preview share URLs could be generated without owner relay.

Cloudflare Direct Upload remains strategically useful because it gives same-provider Preview fidelity and a provider-independent fallback if Vercel becomes unsuitable.

See `vercel-preview-migration-plan.md` for the exact pilot evidence.
