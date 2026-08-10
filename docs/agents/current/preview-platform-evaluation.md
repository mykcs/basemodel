# Preview platform evaluation for Agent-driven web work

Last reviewed: **2026-08-11 +08:00**
Status: **evaluation / not yet an architecture change**

## Why this file exists

The owner originally optimized the workflow around Cloudflare Pages because Cloudflare was the known hosting option. The resulting policy — Agent-side build, Wrangler Direct Upload for ordinary previews, and Git-integrated Cloudflare Production only at release — is still valid and remains authoritative until this evaluation is completed.

The owner’s actual workflow constraint is broader:

> ChatGPT/Codex should be able to inspect GitHub, change the site, validate it, produce a public Preview URL, let the owner review it, and only then publish Production — with minimal human relay work and without anxiety about a small hosted-build quota.

This document records candidate workflows and the decision gate. If a new preview platform is validated successfully, update this file and the other deployment docs in `docs/agents/current/` rather than creating a parallel conflicting policy.

## Project facts that constrain the decision

`basemodel` is currently:

- a static Astro site (`output: 'static'`);
- built with `npm run verify:deploy` plus the Astro production build;
- hosted in Production on Cloudflare Pages at `basemodel.pages.dev`;
- GitHub-first, with GitHub Actions intentionally retired;
- maintained heavily by web-based ChatGPT/Codex agents;
- preview-heavy: visual/UI/research-guide work benefits from a real public URL before merge;
- sensitive to unnecessary Cloudflare Pages Git-build consumption.

Because the current output is static, Preview hosting does not need to be the same provider as Production for most UI/content validation. Platform-specific behavior such as headers, redirects, canonical URLs, noindex behavior, or future Functions/SSR still needs a Cloudflare-specific release check when relevant.

## Evaluation criteria, in priority order

1. **Agent autonomy** — can ChatGPT/Codex complete build/deploy/log inspection without asking the owner to relay dashboard state?
2. **Public Preview ergonomics** — one PR/branch should yield a stable public Preview plus an exact-deployment URL.
3. **Preview cost / quota anxiety** — ordinary iteration should not consume a small monthly production-host build budget.
4. **GitHub fit** — PR status/comment/URL should be visible from GitHub so the GitHub connector can recover deployment state.
5. **Astro/static compatibility** — should require little or no framework-specific migration.
6. **Failure diagnosability** — failed previews must expose enough evidence for an Agent to fix them autonomously.
7. **Production fidelity** — preview should be close enough to Production for the feature under review; Cloudflare-specific behavior can have a separate release gate.
8. **Lock-in / reversibility** — Preview-provider experiments must not require moving the Production domain first.

## Candidate A — keep Cloudflare, fix Direct Upload access

### Shape

```text
ChatGPT/Codex
  -> GitHub branch/PR
  -> Agent-side verify:deploy + build
  -> Wrangler Direct Upload to Cloudflare preview branch
  -> public pages.dev Preview
  -> owner accepts
  -> merge main
  -> Cloudflare Production build
```

### Strengths

- highest Production fidelity because Preview and Production use Cloudflare;
- Direct Upload deploys prebuilt assets and avoids the Git-connected Pages build count;
- current repository policy and scripts already target this model;
- no second hosting provider.

### Weakness observed in current ChatGPT sessions

The practical blocker has been tooling/credential availability, not Cloudflare’s static hosting capability. Several web-GPT sessions could read GitHub and Cloudflare documentation but could not obtain a usable Wrangler login/API deployment surface. When the owner explicitly demanded a Preview URL, the Agent had to fall back to a Git-integrated Cloudflare Preview Build, consuming the monthly build budget.

### Decision

Keep as the **reference architecture** and fallback. It becomes the best option again if the web Agent can reliably obtain a writable Cloudflare deployment surface without owner relay work.

## Candidate B — Vercel for Preview, Cloudflare for Production

### Shape

```text
GitHub feature branch / PR
  -> Vercel Preview
  -> public vercel.app branch + commit URL
  -> owner accepts
  -> merge main
  -> Cloudflare Production
```

Alternative Agent-controlled path:

```text
Agent-side build
  -> vercel build
  -> vercel deploy --prebuilt
  -> Preview URL on stdout
```

### Why it fits this repository

- Vercel officially supports static Astro with zero configuration and Git-generated Preview URLs for PRs;
- Git deployments provide both branch-stable and commit-specific URLs;
- CLI deployment prints the deployment URL directly;
- `vercel build` + `vercel deploy --prebuilt` supports an Agent-side build-before-upload model;
- current Hobby limits are daily/hourly rather than Cloudflare Pages’ 500 Git-builds/month: 100 deployments/day, 32 builds/hour, one concurrent build, 45-minute max build;
- a Vercel ChatGPT plugin/connector is discoverable in the current ChatGPT plugin catalog, which may materially improve web-only deployment and failure diagnosis if it exposes the needed write/log capabilities.

### Important caveats

- Hobby is restricted by Vercel’s current terms to personal/non-commercial use;
- Preview is not the Production platform, so Cloudflare-specific headers/redirects/build environment still need a release-boundary check when relevant;
- the Vercel ChatGPT connector must be tested before treating it as an operational advantage; existence in the plugin catalog is not proof that it exposes every deploy/log action required;
- daily/hourly deployment limits still exist even though there is no analogous 500/month Pages build counter.

### Current standing

**Leading candidate for the owner’s web-GPT workflow**, subject to an end-to-end pilot from GitHub change -> Preview -> log/status retrieval without human relay.

## Candidate C — Netlify for Preview, Cloudflare for Production

### Shape

```text
GitHub PR
  -> Netlify Deploy Preview
  -> deploy-preview-<PR>--<site>.netlify.app
  -> owner accepts
  -> merge main
  -> Cloudflare Production
```

### Why it is unusually attractive for Preview-only use

Current Netlify credit-based Free pricing explicitly lists:

- unlimited Deploy Previews;
- Deploy Preview / branch deploy = 0 credits;
- automatic Deploy Previews from Git pull requests;
- immutable deploy permalinks plus PR-stable Preview URLs;
- Agent Runners that support OpenAI Codex, Claude Code and Gemini.

This makes Netlify potentially better than Vercel on **pure Preview quota economics**.

### Caveats

- preview traffic still contributes to bandwidth/web-request usage credits;
- Free has a 300-credit monthly hard limit for metered usage overall;
- no dedicated Netlify connector was discoverable in the current ChatGPT plugin catalog, so failed-build logs/admin state may be harder for ChatGPT to inspect autonomously than with a working Vercel connector;
- Netlify Agent Runners are a separate Netlify-dashboard agent surface and consume AI inference/compute credits; using them would change the owner’s preferred ChatGPT-first surface.

### Current standing

**Best quota-first challenger.** If Vercel’s connector does not actually close the web-Agent loop, test Netlify next; GitHub-integrated Deploy Previews may be sufficient even without a ChatGPT-specific connector.

## Candidate D — Render static PR previews

Render can create free PR previews for a free static site, including manual preview activation through a GitHub PR label. This gives good control over which PRs build and provides `onrender.com` URLs.

However, Render Hobby currently includes a finite monthly build-pipeline budget (500 Starter pipeline minutes), and no dedicated Render connector was discovered in the current ChatGPT plugin catalog. For this static Astro project, it does not beat Vercel on Agent integration or Netlify on Preview economics.

**Status: reserve option, not first pilot.**

## Rejected / lower-priority options

### Firebase Hosting Preview Channels

Good manual preview channels and public temporary URLs, but the natural workflow is CLI-driven. GitHub PR automation usually adds more integration/CI machinery, and no ChatGPT-native connector advantage was identified. It also introduces Firebase project-level storage/data-transfer quotas unrelated to the current problem.

### GitHub Pages

The project intentionally retired GitHub Pages and GitHub Actions. PR-preview ergonomics are weak without reintroducing Actions or another deployment layer. Do not restore this path merely to avoid Cloudflare build limits.

### Cloudflare Workers Static Assets

Technically viable and separate from Pages build quotas, but still depends on a writable Wrangler/Cloudflare API path. It does not solve the current web-Agent credential/tooling problem by itself and would add a hosting migration without a user-facing benefit for the current static site.

### Ephemeral tunnels / forwarded local ports

Useful for a quick same-session inspection, but URLs depend on a running Agent process and are not durable review artifacts. They are not a replacement for PR Preview deployments.

## Recommended experiment before changing architecture

Do **not** move Production yet.

Use one existing representative PR (preferably a static UI/content PR such as the current SEED/Guide work) as a controlled pilot.

### Pilot 1 — Vercel Preview-only

Success criteria:

1. connect/import `mykcs/basemodel` as a Preview project without changing the Cloudflare Production domain;
2. build the existing static Astro project with the repository-owned gate;
3. obtain a public branch Preview and exact-deployment URL;
4. surface Preview status/URL back to GitHub;
5. from ChatGPT web, retrieve enough deployment state/log evidence to diagnose a failed build without the owner relaying dashboard screenshots;
6. confirm no Cloudflare Preview Build is triggered during the pilot;
7. confirm Cloudflare Production remains unchanged.

### Pilot 2 — Netlify only if needed

Run the same PR if either:

- the Vercel connector cannot actually perform/read the needed deployment operations; or
- Vercel Hobby policy/limits are undesirable for the project.

Compare time-to-preview, failure diagnosis, GitHub visibility and owner intervention count.

## Decision rule

Choose **Vercel Preview + Cloudflare Production** if the Vercel pilot completes end-to-end from ChatGPT/GitHub with no owner relay and normal iteration remains comfortably under Vercel’s daily/hourly limits.

Choose **Netlify Preview + Cloudflare Production** if Netlify’s zero-credit/unlimited Deploy Preview model works through GitHub with equally low owner intervention and Vercel’s connector advantage does not materialize.

Stay on **Cloudflare Direct Upload + Cloudflare Production** if Cloudflare write access becomes reliably available to the web Agent; this remains the simplest and highest-fidelity one-provider architecture.

Do not migrate Production to Vercel/Netlify during the preview-platform experiment. Production migration is a separate decision requiring SEO/canonical/domain/headers/redirects/rollback verification.

## If a pilot succeeds

Update, do not duplicate:

- this file — record measured pilot results and final choice;
- `docs/agents/LATEST.md` — new steady-state architecture and exact operating rule;
- `docs/agents/README.md` — reading order / authority;
- `AGENTS.md` and `CLAUDE.md` — default preview/release workflow;
- `direct-upload-preview-policy.md`, `deployment-policy.md`, `repository-map.md`, and `cloudflare-pages-deployment.md` as needed;
- deployment tests/scripts if provider-specific assumptions change.

Move superseded Cloudflare-only workflow text to history only after the replacement workflow is proven.

## Evidence reviewed on 2026-08-11

Primary vendor documentation checked for this evaluation:

- Cloudflare Pages limits, Direct Upload, Preview branch controls and Git integration;
- Vercel limits, Git deployments, generated URLs, Astro support, CLI build/deploy, Hobby terms;
- Netlify current credit-based pricing, Deploy Previews, CLI/manual deploys and Agent Runners;
- Firebase Hosting preview channels and Hosting quotas;
- Render static sites, PR previews and build-pipeline minutes.

Vendor limits and pricing are time-sensitive. Re-check first-party documentation before changing provider or relying on a quota number.