# Superseded development directions

No earlier **effective** Dev generation was recorded when this folder was introduced. Prior CI/provider evidence remains under `docs/agents/history/`, not retroactively labeled a former Dev version.

- **2026-10-29 → 2026-10-30 (candidate replaced, not an executed migration):** a lower-frequency private-repository proposal considered trading public standard GitHub Actions' free compute for private source visibility. On 2026-10-30 the owner instead explicitly chose to **keep the repository public for independent public Actions CI**, while independently protecting Vercel and Cloudflare website endpoints and preserving rapid reversible fallback. Its dated calculation remains at [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md); current decision rationale and procedure are in [`DESIGN.md`](DESIGN.md) and [`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md). Public source is intentionally **not** hidden by website authentication.

Add an entry here only after the current development direction materially changes. Record the period, prior choice, reason for replacement, and successor; keep transient run IDs and provider logs in their evidence records.
