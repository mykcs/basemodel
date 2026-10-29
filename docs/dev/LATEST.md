# Current development direction

**CI mode: `SPECIALIZED_CI`.**

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

Development favors repository-owned validation and selective browser work before hosted acceptance. GitHub owns source, PRs, and repository/browser checks. A separate Vercel check proves that the accepted candidate builds through the real website provider; Vercel publishes access-protected Production from `main`. Human review may use a lightweight, non-authoritative Preview. CircleCI and the Mac runner remain manual recovery options; Cloudflare is legacy/fallback tooling, not an active Production monitor.

**Pending direction (not yet deployed):** the owner prefers a private GitHub repository now that normal build demand is low. [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md) records the high-frequency and low-frequency alternatives, privacy scan, quota distinctions, required-check migration gates, and rollback. The repository remains **public** and the current `public-ci-gate` + `Vercel` merge contract remains intact until a proven, explicitly approved cutover.

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
