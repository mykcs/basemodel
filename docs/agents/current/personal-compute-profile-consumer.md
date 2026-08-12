# Personal compute profile consumer

Last reviewed: **2026-08-12**

## Ownership

The editable device/lab profile is owned by:

```text
repository: mykcs/fuhuo_20260419
path: public/shared/personal-compute-profile.js
```

Base Model must not keep a second editable object.

Current public runtime endpoint:

```text
https://mykcs.github.io/fuhuo_20260419/shared/personal-compute-profile.js
```

Consumer routes: `/lab/` and `/en/lab/`.

## Why runtime consumption

The fuhuo repository is private, while its GitHub Pages artifact is public. Loading a classic JavaScript data endpoint at runtime avoids embedding repository credentials and lets both websites update from one file. Each website owns only its presentation.

A cache-busting query is added at load time so the browser rechecks the published profile after fuhuo changes.

## Failure behavior

If the public endpoint is unavailable:

- show an explicit unavailable state;
- keep the canonical source and owner-site links visible;
- do not copy or fabricate a fallback device inventory in this repository;
- do not claim that a source edit is already published.

At the time this consumer was introduced, the fuhuo GitHub Pages workflow was blocked before runner allocation by a GitHub account billing/spending-limit failure. That is provider infrastructure state, not a profile-code result. Once fuhuo publication succeeds, the Base Model route will populate without another data copy.

## Evidence semantics

Preserve distinctions supplied by the canonical profile:

- user-reported device/tool fact;
- official product capability;
- user-observed time-sensitive outcome;
- inferred network explanation;
- recommended operational pattern.

The observed Codex/MiniMax result must not become “Codex never works” or “MiniMax always works.” Retest when app versions, account entitlements, macOS, or network routing changes.

## Security boundary

Do not publish or mirror IP addresses, hostnames, usernames, serial numbers, physical lab location, SSH keys, credentials, access tokens, VPN endpoints, or port-forwarding instructions that expose the lab server publicly. The recommended topology keeps the MacBook dual-homed and the server offline.

## Change checklist

1. Change facts in fuhuo only.
2. Validate and publish fuhuo.
3. Open `/lab/` and confirm `updatedAt`.
4. Change Base Model only for presentation, routing, accessibility, or consumer-contract changes.
5. Keep the consumer source URL protected by `PersonalComputeProfile.test.ts`.
