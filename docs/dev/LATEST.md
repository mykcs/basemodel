# Current development direction

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

Development favors repository-owned validation and selective browser work before hosted acceptance. GitHub owns source, PRs, and repository/browser checks. A separate Vercel check proves that the accepted candidate builds through the real website provider; Vercel publishes Production from `main`. Human review may use a lightweight, non-authoritative Preview. Cloudflare observes the Production origin, while CircleCI and the Mac runner remain manual recovery options.

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
