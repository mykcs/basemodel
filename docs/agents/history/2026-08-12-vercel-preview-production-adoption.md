# Vercel Preview + Production adoption — 2026-08-12

Status: **historical adoption/rollout record; current operating rules live elsewhere**

This closeout records the decision to consolidate ordinary Preview and Production on the validated Vercel `basemodel-preview` project.

At adoption, the intended path became:

```text
GitHub non-main -> Vercel Preview -> Gate/build -> inspect
GitHub main     -> Vercel Production -> verify public site
Cloudflare      -> frozen rollback / provider-specific fallback
```

The migration work established several durable lessons that were later promoted into current policy:

- batch coherent branch work before provider-triggering ref updates;
- exact-head acceptance matters more than a generic READY badge;
- same-branch cancellation/ignored builds reduce waste but do not make triggers free;
- temporary Preview share access must not become canonical/persisted project state;
- provider account IDs/tokens belong outside public repository docs;
- Production acceptance is separate from Preview acceptance;
- historical providers should not appear in ordinary completion reports unless they are actually involved.

The detailed current owners are:

- [`../current/hosting-architecture.md`](../current/hosting-architecture.md)
- [`../current/deployment-policy.md`](../current/deployment-policy.md)
- [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md)
- executable `vercel.json` and current tests

The old path `../current/vercel-preview-migration-plan.md` is retained only as a short fixed-path test compatibility shim. Do not treat it as a second deployment policy.
