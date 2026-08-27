# Retired dual-hosting policy

> Historical record only. **Do not use this file as current operating guidance.**
>
> The repository owner retired the GitHub Pages side of this policy on 2026-08-09. Current deployment authority is [`../current/hosting-architecture.md`](../current/hosting-architecture.md) plus [`../current/deployment-policy.md`](../current/deployment-policy.md).

This record preserves an earlier GitHub Pages + Cloudflare Pages dual-hosting model in which Cloudflare was the indexed identity and GitHub Pages was a noindex fallback.

The architecture adopted immediately after retiring GitHub Actions/Pages was simpler for that moment:

```text
GitHub -> Cloudflare Pages
```

That was a **successor state at the time, not today's architecture**. It was later superseded again when Vercel became the ordinary provider for both Preview and Production.

Current architecture:

```text
GitHub non-main -> Vercel Preview
GitHub main     -> Vercel Production -> https://basemodel-preview.vercel.app
Cloudflare      -> legacy rollback / provider-specific fallback only
```

This history remains useful because it explains why duplicate CI/hosting paths were removed: runner cost/queues, base-path compatibility, duplicate-host SEO logic, dependency maintenance, Playwright coordination, and extra Agent reasoning burden outweighed the value of a second normal deployment chain.

For current rules read [`../LATEST.md`](../LATEST.md), [`../current/hosting-architecture.md`](../current/hosting-architecture.md), and [`../current/deployment-policy.md`](../current/deployment-policy.md). Other dated files in this directory are migration/incident evidence, not instructions to restore their provider state.
