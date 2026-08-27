# Vercel billing and cost-control retrospective — 2026-08-28

Status: **historical case record**. Current behavior is owned by `docs/agents/current/deployment-policy.md`, `docs/agents/current/hosting-architecture.md`, executable repository configuration/tests, and live Vercel project state.

This record captures the friction, corrections, successful diagnostics, and reusable operating lessons from the 2026-08-27/28 Vercel billing and spend-control investigation. It deliberately omits bank/card identifiers, payment links, tokens, and other private billing details.

## Why this case mattered

The initial symptom looked simple: the Vercel team showed `Overdue`, the site could still build and serve, and the owner remembered having already paid for Pro. At the same time, the dashboard showed usage credits and a non-trivial Build CPU line. Those facts are easy to collapse into one story, but they belong to different accounting and runtime layers.

The investigation eventually separated five independent questions:

1. Is the **Pro subscription invoice** paid?
2. Is a **usage meter** consuming included credit or generating additional spend?
3. Is a bank-side card event a **settled charge**, a temporary authorization, or a failed/reversed attempt?
4. Why is the team/site still operational while payment is overdue?
5. Which project and which execution path are actually producing the variable Vercel usage?

That separation was the key to both explaining the billing state correctly and finding the engineering changes that could reduce future spend.

## Final diagnosis

### Billing state

The provider-side invoice state and notification established that the Pro invoice was still open and that Vercel was retrying payment. The fact that deployments still worked did **not** prove the invoice was paid; it was consistent with a retry/grace period before suspension.

A small card transaction seen by the bank was not equal to the Pro invoice amount and therefore could not be treated as proof that the invoice had settled. The most plausible interpretation was card verification/preauthorization, but that amount is not a timeless Vercel contract and must not be hard-coded as one. The correct rule is to compare:

```text
Vercel invoice status / receipt
+ provider payment-retry state
+ bank transaction final state (pending / posted / reversed)
```

Do not infer settlement from a notification amount alone.

### Cost state

The useful spend diagnosis came from live usage attribution, not from the overdue invoice itself. A historical 2026-08-27 snapshot showed roughly:

```text
basemodel-preview Build CPU   ~ $7.22 effective usage
fuhuo-20260419 Build CPU      ~ $0.30 effective usage
Speed Insights Plus Events   ~ $0.65 effective usage
public traffic / functions   ~ negligible at that point
```

Those figures are a point-in-time diagnostic snapshot, not a forecast, quota, or current price contract. The important conclusion was structural: **BaseModel Build CPU dominated the variable usage; public crawler traffic did not.**

## Friction and corrections

### 1. Pro fee, included credit, usage, and invoice state were initially too easy to conflate

The Pro plan charge, included usage credit, current resource meters, and an overdue invoice are separate ledger concepts. A page can simultaneously show:

- an active/selected Pro plan;
- included credits being consumed;
- usage lines currently offset by credit;
- and an unpaid subscription invoice.

The reusable lesson is to name each ledger explicitly before explaining causality. Never say “the $20 was used up” or “the $20 is the same thing” unless the provider ledger actually proves that relationship.

### 2. `Overdue` plus a working site is not contradictory

A payment failure can enter a retry/grace lifecycle while the site continues to serve and deploy. Operational continuity during that window is not evidence that billing is healthy, and it is not a guarantee of how long service will remain available.

When explaining a shutdown warning, distinguish:

```text
payment failed
-> retry / grace period
-> invoice remains unpaid
-> possible suspension if unresolved
```

Do not invent an exact shutdown time unless the provider supplies one.

### 3. Small bank-side card events are weak evidence by themselves

A small authorization can succeed while a later subscription charge fails. Conversely, a bank can show a pending transaction that later reverses. The provider invoice is authoritative for “did this invoice settle?”, while the bank is authoritative for “what ultimately posted to this account?”. A suspected mismatch requires both sides before retrying payment manually.

Do not persist private card digits, bank message contents, or payment URLs in repository history.

### 4. Community examples were not available through the active web surface

General web search was unavailable during part of the conversation. The correct response was to avoid inventing Reddit/GitHub/forum anecdotes and instead use current first-party Vercel documentation plus live connected provider state. “I found real user examples” is a claim that requires actual retrieval.

### 5. Dashboard screenshots were insufficient for spend attribution

The invoice view showed totals but did not answer which project caused Build CPU. The high-leverage diagnostic was:

```bash
vercel usage --from <date> --to <date> --group-by project --json
```

This separated BaseModel from fuhuo and showed that traffic/function lines were near zero. `effectiveCost`/usage output is useful for attribution; it is **not automatically the same thing as the amount currently due on an invoice**, and the selected usage date range may not equal the invoice billing period.

### 6. The build machine had silently adapted to the workload

Live project state showed BaseModel on elastic build-machine selection and recorded `long-build-duration` as the reason for automatic promotion. This was important because a larger machine can shorten wall time while still being the wrong cost choice for a mostly static site with expensive browser gates.

The fix was to pin the project to **fixed Standard** and then verify the provider state after mutation. A cost-affecting provider setting is not “done” because a CLI command was issued; read the project back and confirm the effective value.

### 7. Vercel CLI confirmation behavior was a real automation boundary

The CLI refused a non-interactive cost-affecting project update and required interactive confirmation. This is a valid provider safety boundary, not an application failure. The reusable pattern is:

- use provider read APIs first;
- expect some billing-affecting mutations to require an interactive/authenticated surface;
- escalate to the user-authorized machine only when the provider connector cannot perform the needed write;
- never log or persist the authentication token used by that local CLI.

### 8. Speed Insights was already provider-disabled, but the site still loaded its client script

Live project state already contained disabled/canceled Speed Insights timestamps, so repeatedly trying to toggle the provider feature was unnecessary. The remaining source-level problem was that `AppLayout.astro` still injected `/_vercel/speed-insights/script.js` on public pages.

The successful fix removed the client loader and verified the Production HTML contained zero Speed Insights references. This is a good example of checking **provider state and source state together**.

### 9. AI crawler blocking was initially attractive but not the main cost center

It was tempting to treat AI bots as the explanation for Vercel spend. Live usage disproved that hypothesis: Edge Requests, transfer, and Functions were negligible relative to Build CPU.

The chosen response was deliberately cheap:

- Production `robots.txt` allows ordinary search and user-requested AI retrieval;
- named training crawlers are asked not to crawl;
- Preview/noindex environments now disallow cooperative crawlers entirely;
- no paid BotID deep analysis or rate-limit product was added without evidence that traffic cost justified it.

`robots.txt` is cooperative, not an enforcement firewall. If abusive traffic later becomes material, re-measure first, then evaluate Firewall/Rate Limit against **current** pricing.

### 10. The expensive part of BaseModel builds was the browser acceptance layer

Representative build logs showed a large Chromium matrix plus a separate Lab visual matrix consuming most of the build wall time. A small site edit could therefore trigger minutes of browser work in Preview and again after merge to Production.

The fix was not to delete testing. It was to make hosted testing **risk-aware and fail-closed**:

- bounded, known explainer owners map to their real routes and dedicated regression owner;
- local page changes get changed-route smoke plus mapped owners;
- content-only changes get representative safety coverage;
- global/shared/unknown changes still run the full matrix.

This preserved safety while removing unrelated browser work from routine builds.

### 11. The first cost-optimization release was necessarily expensive once

PR #301 changed the hosted planner itself, global shell behavior, robots policy, and Lab gating. Because planner uncertainty is intentionally fail-closed, its own Preview/Production could not demonstrate the future cheap path by skipping the full matrix. The release ran the complete browser coverage and Lab gate and finished successfully.

This is important when reading the first post-optimization bill: **the migration build is not representative of steady-state future builds.** Do not judge the optimization solely by the one release that installs it.

### 12. A second gap remained: intermediate Preview pushes could still spend money

After #301, current `main` added PR #303. It introduced an explicit exact-head Preview spend token: deployment-eligible Preview branches require `[vercel-preview]` in the commit message before the expensive site build proceeds. Intermediate pushes are ignored; Production on `main` stays automatic.

That follow-up complements rather than replaces the #301 changes. It closes the “correct branch, but too many provider-triggering pushes” failure mode.

### 13. Docs-only and superseded-build controls matter even for cheap projects

The fuhuo project was not the major cost center, but it had many deployments caused by repository/documentation churn. PR #8 added an ignored-build step for non-site changes and same-branch auto-cancellation. This reduces waste without disabling normal Production behavior.

The general lesson is to reduce both:

```text
number of provider builds
×
cost of each provider build
```

Optimizing only one side leaves avoidable spend.

## What worked well

### Start with accounting attribution, then optimize the responsible subsystem

The successful sequence was:

```text
invoice / overdue state
-> usage grouped by project
-> usage grouped by service
-> representative deployment logs
-> project resource configuration
-> repository build/test policy
```

That sequence prevented traffic, bots, or Pro subscription billing from being blamed for Build CPU without evidence.

### Prefer reversible, low-cost controls first

The strongest early wins were either free or directly tied to the measured cost center:

- fixed Standard build machine instead of elastic auto-upsizing;
- ignored builds for non-site/docs changes;
- same-branch auto-cancellation;
- risk-aware browser gates;
- explicit Preview opt-in token;
- disabled/removed unused Speed Insights client telemetry;
- cooperative crawler policy before paid bot products.

### Preserve fail-closed quality boundaries

Every scoped optimization has an uncertainty escape hatch. If the Git range is missing, ownership cannot be mapped, the planner itself changed, or a global/shared surface changed, the hosted tests expand rather than silently skip.

That principle is more durable than any one route map:

> Spend less only where the system can prove the smaller scope is sufficient.

### Verify source, provider, and public artifact separately

Successful closeout used all three layers:

- GitHub PR/commit state for the intended source change;
- Vercel project/deployment state for machine selection and READY status;
- real Production fetches for `robots.txt` and the absence of Speed Insights script references.

A green PR or successful local build alone would not have proved the provider-side settings or final public artifact.

### Keep bot policy aligned with product discoverability

The site remains searchable and usable by user-requested AI retrieval while opting out named training crawlers. This avoids solving a hypothetical cost problem by making the research site undiscoverable.

## Durable artifacts created by the work

The implementation was spread across the two active website projects:

- BaseModel PR #301 — fixed/leaner provider behavior, Speed Insights client removal, production crawler policy, diff-aware Lab and scoped hosted UI testing.
- BaseModel PR #303 — exact-head `[vercel-preview]` spend opt-in and Preview crawler suppression.
- fuhuo PR #8 — ignored builds for non-site changes plus auto-cancellation.
- fuhuo PR #9 — production `robots.txt` training-crawler opt-out while preserving ordinary search/user-requested retrieval.

Current BaseModel operational rules are consolidated in `docs/agents/current/deployment-policy.md`; this retrospective explains how those rules were discovered and why they exist.

## Minimal diagnostic playbook for future Vercel spend incidents

Use this when the dashboard says Overdue, usage rises unexpectedly, or Build CPU looks abnormal.

1. **Separate billing from usage.** Record invoice status, retry state, plan/subscription line, included credits, and usage meters as different facts.
2. **Do not infer payment settlement from one bank notification.** If duplicate charge is suspected, compare provider receipt/invoice with the bank's final posted/reversed state.
3. **Attribute usage by project and service.** Prefer current Vercel usage data; use explicit date ranges and preserve the fact that usage windows and invoice periods can differ.
4. **Inspect representative deployments.** Count READY / ERROR / CANCELED / ignored; read build logs and identify the long phases instead of assuming Astro compile time is the problem.
5. **Read project resource state.** Check build machine type/selection, telemetry products, Functions, and any paid security/observability feature.
6. **Read executable deployment policy.** Check `vercel.json`, ignored-build logic, Preview opt-in, auto-cancellation, branch eligibility, and hosted browser planners.
7. **Optimize the measured cost center first.** Build spend -> fewer/lighter builds; traffic spend -> caching/firewall/rate-limit analysis; telemetry spend -> disable unused telemetry.
8. **Keep uncertainty fail-closed.** A cost optimization must not silently remove acceptance coverage when scope cannot be proven.
9. **Verify after mutation.** Read provider state back, wait for the authoritative deployment, and inspect the real public artifact.
10. **Re-measure later.** The optimization release itself may be expensive; compare a subsequent representative window against the pre-change baseline.

## What not to freeze as timeless truth

Re-check current first-party Vercel documentation and live project state before relying on any of these details:

- Pro price, included credit, deployment/build limits, or payment grace behavior;
- Build machine names, sizes, and billing model;
- Speed Insights / Observability / Firewall / BotID pricing;
- crawler user-agent names and provider policy;
- CLI confirmation behavior and available connector write capabilities;
- the historical dollar figures in this case.

The durable reasoning is the separation of ledgers, evidence-first attribution, reversible cost controls, fail-closed scoping, and three-layer source/provider/public verification—not a frozen 2026 pricing table.
