# Retired dual-hosting policy

> Historical record only. **Do not use this file as current operating guidance.**
>
> The repository owner explicitly retired GitHub Actions and GitHub Pages on 2026-08-09. The authoritative current policy is [`deployment-policy.md`](./deployment-policy.md).

This file name is retained so historical links from migration/audit documents do not break. It records that the repository previously chose a GitHub Pages + Cloudflare Pages dual-hosting model with Cloudflare as the indexed identity and GitHub Pages as a noindex fallback.

That policy was later superseded because maintaining the fallback required the exact complexity the project was trying to remove: GitHub-hosted runner minutes, Actions billing/queues, a second deployment chain, `/basemodel/` compatibility, duplicate-host SEO logic, Actions dependency updates, Playwright CI-container coordination, and additional Agent reasoning burden.

The current architecture is intentionally simpler:

```text
GitHub -> Cloudflare Pages
```

For the migration-era detail, failure modes, quota incident, and earlier rationale, read the dated history files in this directory. For current rules, read `deployment-policy.md` and `cloudflare-pages-deployment.md`.
