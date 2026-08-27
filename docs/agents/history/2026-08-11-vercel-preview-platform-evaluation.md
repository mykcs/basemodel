# Vercel Preview platform evaluation — 2026-08-11

Status: **historical pilot evidence**

The Vercel Preview pilot proved that the connected Vercel path could clone the private repository, run the deterministic Gate/build, expose deployment/log state, protect Preview access, and provide an ephemeral owner-review path.

The pilot originally answered a narrower question and initially left Production on Cloudflare. That conclusion was superseded on 2026-08-12 when the owner adopted the validated Vercel project for Production as well.

Current authority is:

- [`../current/hosting-architecture.md`](../current/hosting-architecture.md)
- [`../current/deployment-policy.md`](../current/deployment-policy.md)
- [`../LATEST.md`](../LATEST.md)

Durable lesson: application stack, Preview provider, and Production provider are separate architectural decisions. A successful provider pilot is evidence for capability; it is not permanent authority after a later ownership decision.

Historical Cloudflare Direct Upload/Workers work remains useful only for Cloudflare-specific fallback/diagnostics. Provider quotas/pricing/features are time-sensitive and must be rechecked when they affect a current decision.
