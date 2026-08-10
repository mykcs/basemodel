# Preview platform evaluation — decision record

Last reviewed: **2026-08-11 01:32 +08:00**
Status: **Decision made: Vercel adopted for ordinary non-main Preview; Cloudflare remains Production**

## Decision

The project now uses this operating model:

```text
GitHub feature branch / PR
  -> Vercel Preview
  -> repository-owned verify:deploy + Astro build
  -> Agent inspects logs + real Preview
  -> owner reviews
  -> merge/release to main
  -> Cloudflare Pages Production
```

Cloudflare Direct Upload is retained as a fallback and Cloudflare-specific integration-preview mechanism.

Netlify remains the strongest alternate Preview provider from the earlier comparison, but no Netlify pilot is necessary while the validated Vercel path is working.

## Why Vercel won for this repository

The decision was based on an end-to-end real PR pilot, not feature marketing.

The owner’s highest-priority requirement is Agent autonomy: ChatGPT/Codex should be able to move from GitHub source to a real Preview, inspect failure evidence, and return a review URL without making the owner relay screenshots/logs between services.

The Vercel pilot demonstrated that, after the one-time private GitHub repository authorization:

- the connected Vercel capability can discover the project and deployments;
- Git branch pushes create non-main Preview deployments;
- GitHub receives a Vercel deployment status/comment;
- the Agent can retrieve build logs directly;
- failed repository Gates expose actionable errors;
- the Agent can inspect protected Preview responses;
- the Agent can create a temporary share URL for owner review;
- Vercel can be configured to disable Git deployments for `main`;
- the repository can preserve its existing deterministic `verify:deploy` Gate before Astro build;
- Preview iteration no longer needs a Cloudflare Git-integrated branch build merely to obtain a review URL.

This directly solves the failure mode that motivated the evaluation: Cloudflare Direct Upload is technically sound, but web-Agent sessions have not always had reliable writable Wrangler/Cloudflare credentials.

## Pilot evidence

Pilot PR: **#99 — SEED / 4×RTX 3090 student reproduction Guide**

Final tested head:

`674f60bb57b37cd712cc745bf8dcf1ce513b722f`

Vercel project:

- project: `basemodel-preview`
- project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`
- team: `wangrui92-team`

Final deployment:

- ID: `dpl_E3NeYkTLnsgUJyfNVUtomUqpmMuJ`
- state: `READY`
- exact URL: `https://basemodel-preview-be5vofsnz-wangrui92-team.vercel.app`
- stable branch alias: `https://basemodel-preview-git-agent-seed-owned-4x-54f1f3-wangrui92-team.vercel.app`

Final Gate evidence:

- Astro check: 0 errors;
- 14 Vitest files / 75 tests passed;
- V2 completion audit passed;
- V2 adversarial audit passed;
- hardening audit passed;
- 392 pages generated;
- GitHub combined status reported `Vercel = success`.

The full Gate found and forced fixes for two real Guide regressions before final acceptance: the `guides` content-collection contract and the heuristic-estimate-vs-measured-hardware evidence boundary. This is evidence that preserving the repository-owned Gate on Vercel is materially useful.

## Why not switch Production now

This evaluation was about the Preview workflow, not about finding a replacement CDN/Production host.

Cloudflare Production already works and is the canonical/indexed identity at:

`https://basemodel.pages.dev`

Moving Production would add DNS, canonical, redirect, rollback, and platform-fidelity risk without solving an additional current problem. Therefore Vercel is deliberately Preview-only and `vercel.json` disables Git deployment for `main`.

A future Vercel-Production migration requires a separate explicit decision and acceptance plan.

## Earlier alternatives and their current status

### Cloudflare Direct Upload

**Status: retained fallback / Cloudflare-specific Preview.**

Strengths remain:

- highest Production fidelity;
- prebuilt asset upload avoids Cloudflare Git build consumption;
- one-provider architecture.

Operational weakness remains that some ChatGPT/Agent sessions do not expose a usable Wrangler/Cloudflare write credential. The repository now also contains a dedicated Direct Upload command/runbook; use it when that path is available.

### Netlify

**Status: deferred alternate, not rejected.**

It remained especially attractive on Deploy Preview economics and Agent Runner support, but the Vercel connector provided the decisive web-GPT advantage in the real pilot: project/deployment/log inspection and temporary protected-Preview access were directly available from the same ChatGPT workflow.

Test Netlify only if Vercel becomes operationally unsuitable.

### Render

**Status: reserve option.**

It did not beat Vercel on Agent integration or Netlify on Preview economics for this static Astro site.

### Firebase Hosting Preview Channels / GitHub Pages / ephemeral tunnels

**Status: lower priority.**

They add CLI/CI or durability compromises without improving the current validated workflow.

## Current selection criteria for future reassessment

Re-open this decision if any of these materially change:

1. Vercel Preview limits/pricing no longer fit actual iteration volume;
2. Vercel Deployment Protection becomes too disruptive for review;
3. Vercel connected tools lose deployment/log access;
4. Cloudflare gains reliable first-class writable Agent access in every normal web session;
5. the site moves from static Astro to provider-specific SSR/Functions where Preview/Production fidelity matters more;
6. the project’s commercial status makes the current Vercel plan inappropriate;
7. Netlify or another provider offers a clearly better end-to-end Agent loop.

Always re-check current first-party provider documentation before relying on quotas, pricing, or product limits.

## Authority

For the executable current workflow, read:

`docs/agents/current/vercel-preview-migration-plan.md`

For Cloudflare fallback mechanics, read:

- `docs/agents/current/direct-upload-preview-command.md`
- `docs/agents/current/direct-upload-preview-policy.md`
- `docs/agents/current/cloudflare-pages-deployment.md`

Historical Cloudflare-only wording must not override the validated Vercel Preview / Cloudflare Production split.
